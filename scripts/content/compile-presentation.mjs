import { ContentError } from "./content-error.mjs";
import { validatePresentationDefinitionSet } from "../../app/js/domain/presentation-definition-validator.js";
import { validateTitleProfileDefinitions } from "../../app/js/domain/title-profile.js";

const STATUSES = new Set(["draft", "reviewed", "approved", "rejected"]);
const SCENE_IDS = ["pause", "reset", "quiet-focus"];

function invalid() {
  throw new Error("PRESENTATION_CONTENT_INVALID");
}

function assertRows(rows, count) {
  if (!Array.isArray(rows) || rows.length !== count) invalid();
}

function assertStatuses(...rowSets) {
  if (!rowSets.every((rows) => rows.every((row) => row && STATUSES.has(row.status)))) invalid();
}

function ordered(rows) {
  if (!rows.every(({ display_order }) => Number.isInteger(display_order) && display_order >= 1) ||
    new Set(rows.map(({ display_order }) => display_order)).size !== rows.length) invalid();
  return [...rows].sort((left, right) => left.display_order - right.display_order);
}

function groupOrdered(rows, key) {
  const groups = new Map();
  for (const row of rows) {
    const groupKey = key(row);
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey).push(row);
  }
  for (const [groupKey, group] of groups) groups.set(groupKey, ordered(group));
  return groups;
}

function assertUnique(rows, key) {
  if (new Set(rows.map(key)).size !== rows.length) invalid();
}

function compilePalettes(paletteRows, paletteUsageRows, expectedVersion) {
  assertRows(paletteRows, 103);
  assertRows(paletteUsageRows, 309);
  assertUnique(paletteRows, ({ palette_id }) => palette_id);
  if (!paletteRows.every((row) => row.presentation_definition_version === expectedVersion)) invalid();
  const paletteIds = new Set(paletteRows.map(({ palette_id }) => palette_id));
  const usages = groupOrdered(paletteUsageRows, ({ palette_id }) => palette_id);
  if (usages.size !== paletteIds.size || [...usages.keys()].some((paletteId) => !paletteIds.has(paletteId))) invalid();
  return ordered(paletteRows).map((row) => {
    const usageRows = usages.get(row.palette_id);
    if (usageRows.length !== 3 || new Set(usageRows.map(({ usage }) => usage)).size !== 3 ||
      !["primary", "secondary", "accent"].every((usage) => usageRows.some((row) => row.usage === usage))) invalid();
    const colors = Object.fromEntries(usageRows.map(({ usage, color }) => [usage, color]));
    return {
      paletteId: row.palette_id,
      version: row.presentation_definition_version,
      label: row.label,
      baseColors: { primary: colors.primary, secondary: colors.secondary, accent: colors.accent },
      description: row.description,
    };
  });
}

function compileFragrances(fragranceRows, sceneIds, expectedVersion) {
  assertRows(fragranceRows, 306);
  assertUnique(fragranceRows, ({ fragrance_id }) => fragrance_id);
  if (!fragranceRows.every((row) => row.presentation_definition_version === expectedVersion && sceneIds.has(row.scene_id))) invalid();
  return ordered(fragranceRows).map((row) => ({
    fragranceId: row.fragrance_id,
    version: row.presentation_definition_version,
    sceneId: row.scene_id,
    accordLabel: row.accord_label,
    description: row.description,
    disclaimerId: row.disclaimer_id,
  }));
}

function compileSelectors(selectorRows, selectorPaletteRows, selectorFragranceRows, titleProfiles, paletteIds, fragranceById, expectedVersion) {
  assertRows(selectorRows, 51);
  assertRows(selectorPaletteRows, 102);
  assertRows(selectorFragranceRows, 306);
  assertUnique(selectorRows, ({ title_id }) => title_id);
  if (!selectorRows.every((row) => row.presentation_definition_version === expectedVersion)) invalid();
  const selectors = ordered(selectorRows);
  if (!selectors.every((row, index) => row.title_id === titleProfiles[index].titleId)) invalid();
  const profileIds = new Set(titleProfiles.map(({ titleId }) => titleId));
  const palettesByTitle = groupOrdered(selectorPaletteRows, ({ title_id }) => title_id);
  const fragrancesByTitleScene = groupOrdered(selectorFragranceRows, ({ title_id, scene_id }) => `${title_id}\u0000${scene_id}`);
  if ([...palettesByTitle.keys()].some((titleId) => !profileIds.has(titleId)) ||
    [...fragrancesByTitleScene.keys()].some((key) => !profileIds.has(key.split("\u0000")[0]))) invalid();
  return selectors.map((selector, index) => {
    const profile = titleProfiles[index];
    const paletteRows = palettesByTitle.get(selector.title_id);
    if (!paletteRows || paletteRows.length !== 2 || new Set(paletteRows.map(({ palette_id }) => palette_id)).size !== 2 ||
      paletteRows.some(({ palette_id }) => palette_id === profile.defaultPaletteId || !paletteIds.has(palette_id))) invalid();
    const fragranceScenes = SCENE_IDS.map((scene_id) => {
      const rows = fragrancesByTitleScene.get(`${selector.title_id}\u0000${scene_id}`);
      if (!rows || rows.length !== 2 || new Set(rows.map(({ fragrance_id }) => fragrance_id)).size !== 2 ||
        rows.some(({ fragrance_id }) => fragranceById.get(fragrance_id)?.sceneId !== scene_id) ||
        rows.filter(({ share_selected }) => share_selected === "true").length !== 1 ||
        rows.some(({ share_selected }) => !["true", "false"].includes(share_selected))) invalid();
      return {
        sceneId: scene_id,
        candidateFragranceIds: rows.map(({ fragrance_id }) => fragrance_id),
        shareFragranceId: rows.find(({ share_selected }) => share_selected === "true").fragrance_id,
      };
    });
    return {
      titleId: selector.title_id,
      alternativePaletteIds: paletteRows.map(({ palette_id }) => palette_id),
      fragranceScenes,
    };
  });
}

export function compilePresentationContent(input, expectedVersion) {
  try {
    const {
      sceneRows,
      paletteRows,
      paletteUsageRows,
      fragranceRows,
      selectorRows,
      selectorPaletteRows,
      selectorFragranceRows,
      titleProfiles,
    } = input;
    if (typeof expectedVersion !== "string" || expectedVersion === "") invalid();
    validateTitleProfileDefinitions(titleProfiles);
    assertRows(sceneRows, 3);
    assertStatuses(sceneRows, paletteRows, paletteUsageRows, fragranceRows, selectorRows, selectorPaletteRows, selectorFragranceRows);
    if (!sceneRows.every((row) => row.presentation_definition_version === expectedVersion)) invalid();
    const scenes = ordered(sceneRows).map(({ scene_id, label }) => ({ sceneId: scene_id, label }));
    const palettes = compilePalettes(paletteRows, paletteUsageRows, expectedVersion);
    const fragrances = compileFragrances(fragranceRows, new Set(scenes.map(({ sceneId }) => sceneId)), expectedVersion);
    const titleSelectors = compileSelectors(
      selectorRows,
      selectorPaletteRows,
      selectorFragranceRows,
      titleProfiles,
      new Set(palettes.map(({ paletteId }) => paletteId)),
      new Map(fragrances.map((fragrance) => [fragrance.fragranceId, fragrance])),
      expectedVersion,
    );
    return validatePresentationDefinitionSet({
      schemaVersion: 1,
      presentationDefinitionVersion: expectedVersion,
      scenes,
      palettes,
      fragrances,
      titleSelectors,
    }, { titleProfiles, expectedVersion });
  } catch {
    throw new ContentError({
      code: "PRESENTATION_CONTENT_INVALID",
      message: "演出コンテンツCSV定義が不正です。",
    });
  }
}
