import { validateTitleProfileDefinitions } from "../data/title-profile-definitions.js";

const ROOT_FIELDS = ["schemaVersion", "presentationDefinitionVersion", "scenes", "palettes", "fragrances", "titleSelectors"];
const SCENE_FIELDS = ["sceneId", "label"];
const PALETTE_FIELDS = ["paletteId", "version", "label", "baseColors", "description"];
const BASE_COLOR_FIELDS = ["primary", "secondary", "accent"];
const FRAGRANCE_FIELDS = ["fragranceId", "version", "sceneId", "accordLabel", "description", "disclaimerId"];
const SELECTOR_FIELDS = ["titleId", "alternativePaletteIds", "fragranceScenes"];
const FRAGRANCE_SCENE_FIELDS = ["sceneId", "candidateFragranceIds", "shareFragranceId"];
const SCENES = [
  { sceneId: "pause", label: "ひと息つきたい" },
  { sceneId: "reset", label: "気持ちを切り替えたい" },
  { sceneId: "quiet-focus", label: "静かに取り組みたい" },
];
const SCENE_IDS = new Set(SCENES.map(({ sceneId }) => sceneId));
const PALETTE_ID_PATTERN = /^palette-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FRAGRANCE_ID_PATTERN = /^fragrance-(pause|reset|quiet-focus)-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/;

const COPY_RULES = [
  { code: "forbidden-product", pattern: /\b(?:buy|purchase|shop|brand|product)\b|商品|ブランド|購入|販売|https?:\/\/|www\./i },
  { code: "forbidden-essential-oil", pattern: /\bessential\s*oil\b|精油|アロマオイル/i },
  { code: "forbidden-plant", pattern: /\b(?:plant|lavender|eucalyptus|peppermint)\b|植物|ラベンダー|ユーカリ|ペパーミント/i },
  { code: "forbidden-usage", pattern: /\b(?:\d+(?:\.\d+)?\s*(?:drops?|ml|%)|use|apply|ingest|drink|diffuser|recipe|blend)\b|滴|濃度|配合|摂取|飲用|塗布|肌|ディフューザー|使用(?:方法)?|手順|レシピ/i },
  { code: "forbidden-effect", pattern: /\b(?:treat(?:ment)?|cure|heal|improve(?:s|ment)?|boost|enhance|ability|performance)\b|治療|改善|効果|能力|成績|集中力/i },
];

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactFields(value, fields) {
  return isRecord(value) && Object.keys(value).length === fields.length && fields.every((field) => Object.hasOwn(value, field));
}

function isDenseArray(value) {
  return Array.isArray(value) && Object.keys(value).length === value.length;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function hasUniqueValues(values) {
  return new Set(values).size === values.length;
}

function failDefinition() {
  throw new TypeError("PRESENTATION_DEFINITION_INVALID");
}

function failCopy() {
  throw new TypeError("PRESENTATION_COPY_INVALID");
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) deepFreeze(nestedValue);
  }
  return value;
}

function validateScenes(scenes) {
  if (!isDenseArray(scenes) || scenes.length !== SCENES.length || !scenes.every((scene) => hasExactFields(scene, SCENE_FIELDS))) failDefinition();
  if (!scenes.every(({ sceneId, label }, index) => sceneId === SCENES[index].sceneId && label === SCENES[index].label)) failDefinition();
}

function validatePalettes(palettes, expectedVersion) {
  if (!isDenseArray(palettes) || !palettes.every((palette) => hasExactFields(palette, PALETTE_FIELDS))) failDefinition();
  if (!palettes.every(({ paletteId, version, label, baseColors, description }) =>
    PALETTE_ID_PATTERN.test(paletteId) && version === expectedVersion && isNonEmptyString(label) &&
    hasExactFields(baseColors, BASE_COLOR_FIELDS) && BASE_COLOR_FIELDS.every((field) => HEX_COLOR_PATTERN.test(baseColors[field])) &&
    isNonEmptyString(description))) failDefinition();
  if (!hasUniqueValues(palettes.map(({ paletteId }) => paletteId))) failDefinition();
}

function validateFragrances(fragrances, expectedVersion) {
  if (!isDenseArray(fragrances) || !fragrances.every((fragrance) => hasExactFields(fragrance, FRAGRANCE_FIELDS))) failDefinition();
  if (!fragrances.every(({ fragranceId, version, sceneId, accordLabel, description, disclaimerId }) => {
    const idMatch = FRAGRANCE_ID_PATTERN.exec(fragranceId);
    return idMatch !== null && idMatch[1] === sceneId && version === expectedVersion && SCENE_IDS.has(sceneId) &&
      [accordLabel, description, disclaimerId].every(isNonEmptyString);
  })) failDefinition();
  if (!hasUniqueValues(fragrances.map(({ fragranceId }) => fragranceId))) failDefinition();
}

function validateSelectors(titleSelectors, titleProfiles, paletteIds, fragranceById) {
  if (!isDenseArray(titleSelectors) || titleSelectors.length !== titleProfiles.length || !titleSelectors.every((selector) => hasExactFields(selector, SELECTOR_FIELDS))) failDefinition();
  const referencedPaletteIds = new Set();
  const referencedFragranceIds = new Set();

  titleSelectors.forEach((selector, index) => {
    const profile = titleProfiles[index];
    const { titleId, alternativePaletteIds, fragranceScenes } = selector;
    if (titleId !== profile.titleId || !isDenseArray(alternativePaletteIds) || alternativePaletteIds.length !== 2 ||
      !alternativePaletteIds.every(isNonEmptyString) || !hasUniqueValues(alternativePaletteIds) ||
      alternativePaletteIds.includes(profile.defaultPaletteId) || !paletteIds.has(profile.defaultPaletteId) ||
      !alternativePaletteIds.every((paletteId) => paletteIds.has(paletteId))) failDefinition();

    referencedPaletteIds.add(profile.defaultPaletteId);
    alternativePaletteIds.forEach((paletteId) => referencedPaletteIds.add(paletteId));

    if (!isDenseArray(fragranceScenes) || fragranceScenes.length !== SCENES.length ||
      !fragranceScenes.every((scene) => hasExactFields(scene, FRAGRANCE_SCENE_FIELDS))) failDefinition();
    fragranceScenes.forEach((sceneSelector, sceneIndex) => {
      const { sceneId, candidateFragranceIds, shareFragranceId } = sceneSelector;
      if (sceneId !== SCENES[sceneIndex].sceneId || !isDenseArray(candidateFragranceIds) || candidateFragranceIds.length !== 2 ||
        !candidateFragranceIds.every(isNonEmptyString) || !hasUniqueValues(candidateFragranceIds) ||
        !candidateFragranceIds.every((fragranceId) => fragranceById.get(fragranceId)?.sceneId === sceneId) ||
        !candidateFragranceIds.includes(shareFragranceId)) failDefinition();
      candidateFragranceIds.forEach((fragranceId) => referencedFragranceIds.add(fragranceId));
    });
  });

  if (referencedPaletteIds.size !== paletteIds.size || ![...paletteIds].every((paletteId) => referencedPaletteIds.has(paletteId))) failDefinition();
  if (referencedFragranceIds.size !== fragranceById.size || ![...fragranceById.keys()].every((fragranceId) => referencedFragranceIds.has(fragranceId))) failDefinition();
}

export function lintPresentationCopy(value) {
  if (!isRecord(value)) return [];
  const findings = [];
  const inspect = (definitionId, field, copy) => {
    if (!isNonEmptyString(copy)) return;
    for (const { code, pattern } of COPY_RULES) {
      if (pattern.test(copy)) findings.push({ definitionId, field, code });
    }
  };
  for (const palette of Array.isArray(value.palettes) ? value.palettes : []) {
    if (!isRecord(palette)) continue;
    inspect(palette.paletteId, "label", palette.label);
    inspect(palette.paletteId, "description", palette.description);
  }
  for (const fragrance of Array.isArray(value.fragrances) ? value.fragrances : []) {
    if (!isRecord(fragrance)) continue;
    inspect(fragrance.fragranceId, "accordLabel", fragrance.accordLabel);
    inspect(fragrance.fragranceId, "description", fragrance.description);
  }
  return findings;
}

export function validatePresentationDefinitionSet(value, { titleProfiles, expectedVersion } = {}) {
  let validTitleProfiles;
  try {
    validTitleProfiles = validateTitleProfileDefinitions(titleProfiles);
  } catch {
    failDefinition();
  }
  if (!isNonEmptyString(expectedVersion) || !hasExactFields(value, ROOT_FIELDS)) failDefinition();
  const { schemaVersion, presentationDefinitionVersion, scenes, palettes, fragrances, titleSelectors } = value;
  if (schemaVersion !== 1 || presentationDefinitionVersion !== expectedVersion) failDefinition();

  validateScenes(scenes);
  validatePalettes(palettes, expectedVersion);
  validateFragrances(fragrances, expectedVersion);
  validateSelectors(
    titleSelectors,
    validTitleProfiles,
    new Set(palettes.map(({ paletteId }) => paletteId)),
    new Map(fragrances.map((fragrance) => [fragrance.fragranceId, fragrance])),
  );
  if (lintPresentationCopy(value).length > 0) failCopy();
  return deepFreeze(value);
}
