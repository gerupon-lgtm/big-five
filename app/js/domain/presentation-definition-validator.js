import { validateTitleProfileDefinitions } from "./title-profile.js";

const ROOT_FIELDS_BY_SCHEMA_VERSION = {
  1: ["schemaVersion", "presentationDefinitionVersion", "scenes", "palettes", "fragrances", "titleSelectors"],
  2: ["schemaVersion", "presentationDefinitionVersion", "scenes", "palettes", "paletteUsageMappings", "fragrances", "fragranceMaterials", "titleSelectors"],
};
const SCENE_FIELDS = ["sceneId", "label"];
const PALETTE_FIELDS = ["paletteId", "version", "label", "baseColors", "description"];
const BASE_COLOR_FIELDS = ["primary", "secondary", "accent"];
const PALETTE_USAGE_MAPPING_FIELDS = ["paletteId", "version", "roles", "textCandidates"];
const PALETTE_USAGE_ROLE_FIELDS = ["background", "surface", "accent", "chart"];
const PALETTE_USAGE_ROLE_DEFINITION_FIELDS = ["source", "mixWith", "mixPercent"];
const FRAGRANCE_FIELDS_BY_SCHEMA_VERSION = {
  1: ["fragranceId", "version", "sceneId", "accordLabel", "description", "disclaimerId"],
  2: ["fragranceId", "version", "sceneId", "accordLabel", "description", "materialIds", "disclaimerId"],
};
const FRAGRANCE_MATERIAL_FIELDS = ["materialId", "version", "displayName", "materialKind"];
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
const MATERIAL_ID_PATTERN = /^material-[a-z0-9]+(?:-[a-z0-9]+)*$/;
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

function validatePaletteUsageMappings(paletteUsageMappings, palettes, expectedVersion) {
  if (!isDenseArray(paletteUsageMappings) || paletteUsageMappings.length !== palettes.length ||
    !paletteUsageMappings.every((mapping) => hasExactFields(mapping, PALETTE_USAGE_MAPPING_FIELDS))) failDefinition();
  if (!paletteUsageMappings.every(({ paletteId, version, roles, textCandidates }, index) =>
    paletteId === palettes[index].paletteId && version === expectedVersion &&
    hasExactFields(roles, PALETTE_USAGE_ROLE_FIELDS) &&
    PALETTE_USAGE_ROLE_FIELDS.every((role) => {
      const definition = roles[role];
      return hasExactFields(definition, PALETTE_USAGE_ROLE_DEFINITION_FIELDS) &&
        BASE_COLOR_FIELDS.includes(definition.source) &&
        ["white", "black", "none"].includes(definition.mixWith) &&
        Number.isInteger(definition.mixPercent) && definition.mixPercent >= 0 && definition.mixPercent <= 100 &&
        (definition.mixWith !== "none" || definition.mixPercent === 0);
    }) &&
    isDenseArray(textCandidates) && textCandidates.length === 2 && textCandidates.every((color) => HEX_COLOR_PATTERN.test(color)) &&
    hasUniqueValues(textCandidates))) failDefinition();
}

function validateFragranceMaterials(fragranceMaterials, expectedVersion) {
  if (!isDenseArray(fragranceMaterials) || !fragranceMaterials.every((material) => hasExactFields(material, FRAGRANCE_MATERIAL_FIELDS))) failDefinition();
  if (!fragranceMaterials.every(({ materialId, version, displayName, materialKind }) =>
    MATERIAL_ID_PATTERN.test(materialId) && version === expectedVersion && isNonEmptyString(displayName) &&
    ["plant-name", "essential-oil-name"].includes(materialKind))) failDefinition();
  if (!hasUniqueValues(fragranceMaterials.map(({ materialId }) => materialId))) failDefinition();
}

function validateFragrances(fragrances, expectedVersion, fragranceMaterials) {
  const schemaVersion = fragranceMaterials ? 2 : 1;
  const fragranceFields = FRAGRANCE_FIELDS_BY_SCHEMA_VERSION[schemaVersion];
  if (!isDenseArray(fragrances) || !fragrances.every((fragrance) => hasExactFields(fragrance, fragranceFields))) failDefinition();
  if (!fragrances.every(({ fragranceId, version, sceneId, accordLabel, description, disclaimerId }) => {
    const idMatch = FRAGRANCE_ID_PATTERN.exec(fragranceId);
    return idMatch !== null && idMatch[1] === sceneId && version === expectedVersion && SCENE_IDS.has(sceneId) &&
      [accordLabel, description, disclaimerId].every(isNonEmptyString);
  })) failDefinition();
  if (!hasUniqueValues(fragrances.map(({ fragranceId }) => fragranceId))) failDefinition();
  if (schemaVersion === 2) {
    const materialIds = new Set(fragranceMaterials.map(({ materialId }) => materialId));
    const referencedMaterialIds = new Set();
    for (const { materialIds: fragranceMaterialIds } of fragrances) {
      if (!isDenseArray(fragranceMaterialIds) || fragranceMaterialIds.length < 1 || fragranceMaterialIds.length > 3 ||
        !fragranceMaterialIds.every(isNonEmptyString) || !hasUniqueValues(fragranceMaterialIds) ||
        !fragranceMaterialIds.every((materialId) => materialIds.has(materialId))) failDefinition();
      fragranceMaterialIds.forEach((materialId) => referencedMaterialIds.add(materialId));
    }
    if (referencedMaterialIds.size !== materialIds.size ||
      ![...materialIds].every((materialId) => referencedMaterialIds.has(materialId))) failDefinition();
  }
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
  for (const material of Array.isArray(value.fragranceMaterials) ? value.fragranceMaterials : []) {
    if (!isRecord(material)) continue;
    if (!isNonEmptyString(material.displayName)) continue;
    for (const { code, pattern } of COPY_RULES) {
      if (["forbidden-essential-oil", "forbidden-plant"].includes(code)) continue;
      if (pattern.test(material.displayName)) findings.push({ definitionId: material.materialId, field: "displayName", code });
    }
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
  if (!isNonEmptyString(expectedVersion) || !isRecord(value) || !Object.hasOwn(ROOT_FIELDS_BY_SCHEMA_VERSION, value.schemaVersion)) failDefinition();
  const { schemaVersion, presentationDefinitionVersion, scenes, palettes, paletteUsageMappings, fragrances, fragranceMaterials, titleSelectors } = value;
  if (!hasExactFields(value, ROOT_FIELDS_BY_SCHEMA_VERSION[schemaVersion]) || presentationDefinitionVersion !== expectedVersion) failDefinition();

  validateScenes(scenes);
  validatePalettes(palettes, expectedVersion);
  if (schemaVersion === 2) {
    validatePaletteUsageMappings(paletteUsageMappings, palettes, expectedVersion);
    validateFragranceMaterials(fragranceMaterials, expectedVersion);
    validateFragrances(fragrances, expectedVersion, fragranceMaterials);
  } else {
    validateFragrances(fragrances, expectedVersion);
  }
  validateSelectors(
    titleSelectors,
    validTitleProfiles,
    new Set(palettes.map(({ paletteId }) => paletteId)),
    new Map(fragrances.map((fragrance) => [fragrance.fragranceId, fragrance])),
  );
  if (lintPresentationCopy(value).length > 0) failCopy();
  return deepFreeze(value);
}
