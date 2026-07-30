import { ContentError } from "./content-error.mjs";
import { validatePresentationDefinitionSet } from "../../app/js/domain/presentation-definition-validator.js";
import { validateTitleProfileDefinitions } from "../../app/js/domain/title-profile.js";

const STATUSES = new Set(["draft", "reviewed", "approved", "rejected"]);
const SCENE_IDS = ["pause", "reset", "quiet-focus"];
const PRESENTATION_SCHEMA_2_VERSION = "presentation-v2";
const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/;
const PALETTE_SOURCES = new Set(["primary", "secondary", "accent"]);
const MIX_TARGETS = new Set(["none", "white", "black"]);

function invalid() {
  throw new Error("PRESENTATION_CONTENT_INVALID");
}

function assertRows(rows, count = undefined) {
  if (!Array.isArray(rows) || (count === undefined ? rows.length === 0 : rows.length !== count)) invalid();
}

function assertStatuses(...rowSets) {
  if (!rowSets.every((rows) => rows.every((row) => row && STATUSES.has(row.status)))) invalid();
}

function ordered(rows) {
  if (!rows.every(({ display_order }) => Number.isInteger(display_order) && display_order >= 1)) invalid();
  const sorted = [...rows].sort((left, right) => left.display_order - right.display_order);
  if (!sorted.every(({ display_order }, index) => display_order === index + 1)) invalid();
  return sorted;
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
  assertRows(paletteRows);
  assertRows(paletteUsageRows);
  assertUnique(paletteRows, ({ palette_id }) => palette_id);
  assertUnique(paletteUsageRows, ({ palette_id }) => palette_id);
  if (paletteRows.length !== paletteUsageRows.length ||
    !paletteRows.every((row) =>
      row.presentation_definition_version === expectedVersion &&
      HEX_COLOR_PATTERN.test(row.primary_color) &&
      HEX_COLOR_PATTERN.test(row.secondary_color) &&
      HEX_COLOR_PATTERN.test(row.accent_color)) ||
    !paletteUsageRows.every((row) => row.presentation_definition_version === expectedVersion)) invalid();
  const paletteIds = new Set(paletteRows.map(({ palette_id }) => palette_id));
  if (paletteUsageRows.some(({ palette_id }) => !paletteIds.has(palette_id))) invalid();
  const orderedPaletteRows = ordered(paletteRows);
  const orderedUsageRows = ordered(paletteUsageRows);
  if (!orderedUsageRows.every(({ palette_id }, index) => palette_id === orderedPaletteRows[index].palette_id)) invalid();
  const usageByPalette = new Map(orderedUsageRows.map((row) => [row.palette_id, row]));
  const palettes = orderedPaletteRows.map((row) => ({
    paletteId: row.palette_id,
    version: row.presentation_definition_version,
    label: row.label,
    baseColors: {
      primary: row.primary_color,
      secondary: row.secondary_color,
      accent: row.accent_color,
    },
    description: row.description,
  }));
  const paletteUsageMappings = palettes.map(({ paletteId }) => {
    const row = usageByPalette.get(paletteId);
    if (!row) invalid();
    const roles = Object.fromEntries(["background", "surface", "accent", "chart"].map((role) => {
      const source = row[`${role}_source`];
      const mixWith = row[`${role}_mix_with`];
      const mixPercent = row[`${role}_mix_percent`];
      if (!PALETTE_SOURCES.has(source) || !MIX_TARGETS.has(mixWith) ||
        !Number.isInteger(mixPercent) || mixPercent < 0 || mixPercent > 100 ||
        (mixWith === "none" && mixPercent !== 0)) invalid();
      return [role, { source, mixWith, mixPercent }];
    }));
    if (!HEX_COLOR_PATTERN.test(row.text_candidate_1) ||
      !HEX_COLOR_PATTERN.test(row.text_candidate_2) ||
      row.text_candidate_1 === row.text_candidate_2) invalid();
    return {
      paletteId,
      version: row.presentation_definition_version,
      roles,
      textCandidates: [row.text_candidate_1, row.text_candidate_2],
    };
  });
  return { palettes, paletteUsageMappings };
}

function compileFragrances(fragranceRows, materialRows, materialExampleRows, sceneIds, expectedVersion) {
  assertRows(fragranceRows);
  assertRows(materialRows);
  assertRows(materialExampleRows);
  assertUnique(fragranceRows, ({ fragrance_id }) => fragrance_id);
  assertUnique(materialRows, ({ material_id }) => material_id);
  if (!fragranceRows.every((row) => row.presentation_definition_version === expectedVersion && sceneIds.has(row.scene_id)) ||
    !materialRows.every((row) => row.presentation_definition_version === expectedVersion) ||
    !materialExampleRows.every((row) => row.presentation_definition_version === expectedVersion)) invalid();
  const fragranceIds = new Set(fragranceRows.map(({ fragrance_id }) => fragrance_id));
  const orderedMaterials = ordered(materialRows);
  const materialIds = new Set(orderedMaterials.map(({ material_id }) => material_id));
  const examplesByFragrance = groupOrdered(materialExampleRows, ({ fragrance_id }) => fragrance_id);
  if ([...examplesByFragrance.keys()].some((fragranceId) => !fragranceIds.has(fragranceId)) ||
    materialExampleRows.some(({ material_id }) => !materialIds.has(material_id))) invalid();
  const referencedMaterialIds = new Set();
  const fragrances = ordered(fragranceRows).map((row) => {
    const examples = examplesByFragrance.get(row.fragrance_id);
    if (!examples || examples.length < 1 || examples.length > 3 ||
      new Set(examples.map(({ material_id }) => material_id)).size !== examples.length) invalid();
    const fragranceMaterialIds = examples.map(({ material_id }) => material_id);
    fragranceMaterialIds.forEach((materialId) => referencedMaterialIds.add(materialId));
    return {
      fragranceId: row.fragrance_id,
      version: row.presentation_definition_version,
      sceneId: row.scene_id,
      familyId: row.family_id,
      accordLabel: row.accord_label,
      description: row.description,
      materialIds: fragranceMaterialIds,
      disclaimerId: row.disclaimer_id,
    };
  });
  if (referencedMaterialIds.size !== materialIds.size) invalid();
  const fragranceMaterials = orderedMaterials.map((row) => ({
    materialId: row.material_id,
    version: row.presentation_definition_version,
    displayName: row.display_name,
    materialKind: row.material_kind,
  }));
  return { fragrances, fragranceMaterials };
}

function compileSelectors(selectorRows, selectorPaletteRows, selectorFragranceRows, titleProfiles, paletteIds, fragranceById, expectedVersion) {
  assertRows(selectorRows, 51);
  assertRows(selectorPaletteRows);
  assertRows(selectorFragranceRows);
  assertUnique(selectorRows, ({ title_id }) => title_id);
  if (!selectorRows.every((row) => row.presentation_definition_version === expectedVersion)) invalid();
  const selectors = ordered(selectorRows);
  if (!selectors.every((row, index) => row.title_id === titleProfiles[index].titleId)) invalid();
  const profileIds = new Set(titleProfiles.map(({ titleId }) => titleId));
  const palettesByTitle = groupOrdered(selectorPaletteRows, ({ title_id }) => title_id);
  const fragrancesByTitleScene = groupOrdered(selectorFragranceRows, ({ title_id, scene_id }) => `${title_id}\u0000${scene_id}`);
  if ([...palettesByTitle.keys()].some((titleId) => !profileIds.has(titleId)) ||
    [...fragrancesByTitleScene.keys()].some((key) => {
      const [titleId, sceneId] = key.split("\u0000");
      return !profileIds.has(titleId) || !SCENE_IDS.includes(sceneId);
    })) invalid();
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
      fragranceMaterialRows,
      fragranceMaterialExampleRows,
      selectorRows,
      selectorPaletteRows,
      selectorFragranceRows,
      titleProfiles,
    } = input;
    if (expectedVersion !== PRESENTATION_SCHEMA_2_VERSION) invalid();
    validateTitleProfileDefinitions(titleProfiles);
    assertRows(sceneRows, 3);
    assertStatuses(
      sceneRows,
      paletteRows,
      paletteUsageRows,
      fragranceRows,
      fragranceMaterialRows,
      fragranceMaterialExampleRows,
      selectorRows,
      selectorPaletteRows,
      selectorFragranceRows,
    );
    if (!sceneRows.every((row) => row.presentation_definition_version === expectedVersion)) invalid();
    const scenes = ordered(sceneRows).map(({ scene_id, label, icon_id }) => ({
      sceneId: scene_id,
      label,
      iconId: icon_id,
    }));
    const { palettes, paletteUsageMappings } = compilePalettes(paletteRows, paletteUsageRows, expectedVersion);
    const { fragrances, fragranceMaterials } = compileFragrances(
      fragranceRows,
      fragranceMaterialRows,
      fragranceMaterialExampleRows,
      new Set(scenes.map(({ sceneId }) => sceneId)),
      expectedVersion,
    );
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
      schemaVersion: 2,
      presentationDefinitionVersion: expectedVersion,
      scenes,
      palettes,
      paletteUsageMappings,
      fragrances,
      fragranceMaterials,
      titleSelectors,
    }, { titleProfiles, expectedVersion });
  } catch {
    throw new ContentError({
      code: "PRESENTATION_CONTENT_INVALID",
      message: "演出コンテンツCSV定義が不正です。",
    });
  }
}
