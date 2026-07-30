import { FACTOR_ORDER } from "../config/factor-order.js";
import { PRESENTATION_SCENE_IDS } from "./presentation-scenes.js";

const TITLE_PROFILE_FIELDS = [
  "titleId",
  "label",
  "kind",
  "factors",
  "characterId",
  "summaryTextId",
  "defaultPaletteId",
];
const DEFINITION_SET_FIELDS = [
  "schemaVersion",
  "presentationDefinitionVersion",
  "scenes",
  "palettes",
  "paletteUsageMappings",
  "fragrances",
  "fragranceMaterials",
  "titleSelectors",
];
const SELECTOR_FIELDS = ["titleId", "alternativePaletteIds", "fragranceScenes"];
const SCENE_SELECTOR_FIELDS = ["sceneId", "candidateFragranceIds", "shareFragranceId"];
const FACTOR_FIELDS = ["factorId", "direction"];
const SCENE_FIELDS = ["sceneId", "label"];
const PALETTE_FIELDS = ["paletteId", "version", "label", "baseColors", "description"];
const BASE_COLOR_FIELDS = ["primary", "secondary", "accent"];
const MAPPING_FIELDS = ["paletteId", "version", "roles", "textCandidates"];
const ROLE_FIELDS = ["background", "surface", "accent", "chart"];
const ROLE_DEFINITION_FIELDS = ["source", "mixWith", "mixPercent"];
const FRAGRANCE_FIELDS = [
  "fragranceId",
  "version",
  "sceneId",
  "accordLabel",
  "description",
  "materialIds",
  "disclaimerId",
];
const MATERIAL_FIELDS = ["materialId", "version", "displayName", "materialKind"];
const DIRECTIONS = ["high", "low"];
const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/;

function invalidSelection() {
  throw new TypeError("PRESENTATION_SELECTION_INVALID");
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactFields(value, fields) {
  return isRecord(value) &&
    Object.keys(value).length === fields.length &&
    fields.every((field) => Object.hasOwn(value, field));
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

function isDeeplyFrozen(value, seen = new Set()) {
  if (value === null || typeof value !== "object") return true;
  if (seen.has(value)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value);
  return Reflect.ownKeys(value).every((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    return descriptor && Object.hasOwn(descriptor, "value") &&
      isDeeplyFrozen(descriptor.value, seen);
  });
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) deepFreeze(nestedValue);
  }
  return value;
}

function frozenCopy(value) {
  return deepFreeze(structuredClone(value));
}

function isValidTitleProfile(titleProfile) {
  if (!hasExactFields(titleProfile, TITLE_PROFILE_FIELDS) ||
    !TITLE_PROFILE_FIELDS
      .filter((field) => field !== "factors")
      .every((field) => isNonEmptyString(titleProfile[field])) ||
    !["balanced", "single", "pair"].includes(titleProfile.kind) ||
    !isDenseArray(titleProfile.factors) ||
    titleProfile.factors.length !== (
      titleProfile.kind === "balanced" ? 0 : titleProfile.kind === "single" ? 1 : 2
    )) {
    return false;
  }
  return titleProfile.factors.every((factor, index) =>
    hasExactFields(factor, FACTOR_FIELDS) &&
    FACTOR_ORDER.includes(factor.factorId) &&
    DIRECTIONS.includes(factor.direction) &&
    (index === 0 ||
      FACTOR_ORDER.indexOf(titleProfile.factors[index - 1].factorId) <
      FACTOR_ORDER.indexOf(factor.factorId)));
}

function isValidRoleDefinition(value) {
  return hasExactFields(value, ROLE_DEFINITION_FIELDS) &&
    BASE_COLOR_FIELDS.includes(value.source) &&
    ["white", "black", "none"].includes(value.mixWith) &&
    Number.isInteger(value.mixPercent) &&
    value.mixPercent >= 0 &&
    value.mixPercent <= 100 &&
    (value.mixWith !== "none" || value.mixPercent === 0);
}

function validateDefinitionSet(definitionSet) {
  if (!hasExactFields(definitionSet, DEFINITION_SET_FIELDS) ||
    definitionSet.schemaVersion !== 2 ||
    !isNonEmptyString(definitionSet.presentationDefinitionVersion) ||
    !isDeeplyFrozen(definitionSet)) {
    invalidSelection();
  }

  const version = definitionSet.presentationDefinitionVersion;
  const { scenes, palettes, paletteUsageMappings, fragrances,
    fragranceMaterials, titleSelectors } = definitionSet;

  if (!isDenseArray(scenes) ||
    scenes.length !== PRESENTATION_SCENE_IDS.length ||
    !scenes.every((scene, index) =>
      hasExactFields(scene, SCENE_FIELDS) &&
      scene.sceneId === PRESENTATION_SCENE_IDS[index] &&
      isNonEmptyString(scene.label)) ||
    !isDenseArray(palettes) ||
    palettes.length === 0 ||
    !palettes.every((palette) =>
      hasExactFields(palette, PALETTE_FIELDS) &&
      isNonEmptyString(palette.paletteId) &&
      palette.version === version &&
      isNonEmptyString(palette.label) &&
      hasExactFields(palette.baseColors, BASE_COLOR_FIELDS) &&
      BASE_COLOR_FIELDS.every((field) =>
        HEX_COLOR_PATTERN.test(palette.baseColors[field])) &&
      isNonEmptyString(palette.description)) ||
    !hasUniqueValues(palettes.map(({ paletteId }) => paletteId))) {
    invalidSelection();
  }

  if (!isDenseArray(paletteUsageMappings) ||
    paletteUsageMappings.length !== palettes.length ||
    !paletteUsageMappings.every((mapping, index) =>
      hasExactFields(mapping, MAPPING_FIELDS) &&
      mapping.paletteId === palettes[index].paletteId &&
      mapping.version === version &&
      hasExactFields(mapping.roles, ROLE_FIELDS) &&
      ROLE_FIELDS.every((role) => isValidRoleDefinition(mapping.roles[role])) &&
      isDenseArray(mapping.textCandidates) &&
      mapping.textCandidates.length === 2 &&
      mapping.textCandidates.every((color) => HEX_COLOR_PATTERN.test(color)) &&
      hasUniqueValues(mapping.textCandidates))) {
    invalidSelection();
  }

  if (!isDenseArray(fragranceMaterials) ||
    fragranceMaterials.length === 0 ||
    !fragranceMaterials.every((material) =>
      hasExactFields(material, MATERIAL_FIELDS) &&
      isNonEmptyString(material.materialId) &&
      material.version === version &&
      isNonEmptyString(material.displayName) &&
      ["plant-name", "essential-oil-name"].includes(material.materialKind)) ||
    !hasUniqueValues(fragranceMaterials.map(({ materialId }) => materialId))) {
    invalidSelection();
  }
  const materialIds = new Set(
    fragranceMaterials.map(({ materialId }) => materialId),
  );

  if (!isDenseArray(fragrances) ||
    fragrances.length === 0 ||
    !fragrances.every((fragrance) =>
      hasExactFields(fragrance, FRAGRANCE_FIELDS) &&
      isNonEmptyString(fragrance.fragranceId) &&
      fragrance.version === version &&
      PRESENTATION_SCENE_IDS.includes(fragrance.sceneId) &&
      isNonEmptyString(fragrance.accordLabel) &&
      isNonEmptyString(fragrance.description) &&
      isDenseArray(fragrance.materialIds) &&
      fragrance.materialIds.length >= 1 &&
      fragrance.materialIds.length <= 3 &&
      fragrance.materialIds.every((materialId) =>
        isNonEmptyString(materialId) && materialIds.has(materialId)) &&
      hasUniqueValues(fragrance.materialIds) &&
      isNonEmptyString(fragrance.disclaimerId)) ||
    !hasUniqueValues(fragrances.map(({ fragranceId }) => fragranceId)) ||
    !isDenseArray(titleSelectors) ||
    titleSelectors.length === 0 ||
    !titleSelectors.every((selector) =>
      hasExactFields(selector, SELECTOR_FIELDS) &&
      isNonEmptyString(selector.titleId) &&
      isDenseArray(selector.alternativePaletteIds) &&
      selector.alternativePaletteIds.length === 2 &&
      selector.alternativePaletteIds.every(isNonEmptyString) &&
      hasUniqueValues(selector.alternativePaletteIds) &&
      isDenseArray(selector.fragranceScenes) &&
      selector.fragranceScenes.length === PRESENTATION_SCENE_IDS.length &&
      selector.fragranceScenes.every((scene, index) =>
        hasExactFields(scene, SCENE_SELECTOR_FIELDS) &&
        scene.sceneId === scenes[index].sceneId &&
        isDenseArray(scene.candidateFragranceIds) &&
        scene.candidateFragranceIds.length === 2 &&
        scene.candidateFragranceIds.every(isNonEmptyString) &&
        hasUniqueValues(scene.candidateFragranceIds) &&
        scene.candidateFragranceIds.includes(scene.shareFragranceId))) ||
    !hasUniqueValues(titleSelectors.map(({ titleId }) => titleId))) {
    invalidSelection();
  }
}

function validateInputs(titleProfile, definitionSet) {
  if (!isValidTitleProfile(titleProfile)) invalidSelection();
  validateDefinitionSet(definitionSet);
}

export function selectPresentation(titleProfile, definitionSet) {
  if (arguments.length !== 2) invalidSelection();
  validateInputs(titleProfile, definitionSet);

  const selectorMatches = definitionSet.titleSelectors
    .filter(({ titleId }) => titleId === titleProfile.titleId);
  if (selectorMatches.length !== 1) invalidSelection();
  const selector = selectorMatches[0];
  if (!hasExactFields(selector, SELECTOR_FIELDS) ||
    !isDenseArray(selector.alternativePaletteIds) ||
    selector.alternativePaletteIds.length !== 2 ||
    !selector.alternativePaletteIds.every(isNonEmptyString) ||
    new Set(selector.alternativePaletteIds).size !== 2 ||
    selector.alternativePaletteIds.includes(titleProfile.defaultPaletteId) ||
    !isDenseArray(selector.fragranceScenes) ||
    selector.fragranceScenes.length !== definitionSet.scenes.length) {
    invalidSelection();
  }

  const paletteById = new Map(
    definitionSet.palettes.map((palette) => [palette.paletteId, palette]),
  );
  const standard = paletteById.get(titleProfile.defaultPaletteId);
  const alternatives = selector.alternativePaletteIds.map((paletteId) =>
    paletteById.get(paletteId));
  if (!standard || alternatives.some((palette) => !palette)) invalidSelection();

  const fragranceById = new Map(
    definitionSet.fragrances.map((fragrance) => [fragrance.fragranceId, fragrance]),
  );
  const fragranceScenes = selector.fragranceScenes.map((sceneSelector, index) => {
    if (!hasExactFields(sceneSelector, SCENE_SELECTOR_FIELDS) ||
      sceneSelector.sceneId !== definitionSet.scenes[index].sceneId ||
      !isDenseArray(sceneSelector.candidateFragranceIds) ||
      sceneSelector.candidateFragranceIds.length !== 2 ||
      !sceneSelector.candidateFragranceIds.every(isNonEmptyString) ||
      new Set(sceneSelector.candidateFragranceIds).size !== 2 ||
      !sceneSelector.candidateFragranceIds.includes(sceneSelector.shareFragranceId)) {
      invalidSelection();
    }
    const candidates = sceneSelector.candidateFragranceIds.map((fragranceId) =>
      fragranceById.get(fragranceId));
    const shareRepresentative = fragranceById.get(sceneSelector.shareFragranceId);
    if (candidates.some((candidate) => !candidate ||
      candidate.sceneId !== sceneSelector.sceneId) ||
      !shareRepresentative ||
      shareRepresentative.sceneId !== sceneSelector.sceneId) {
      invalidSelection();
    }
    return {
      sceneId: sceneSelector.sceneId,
      label: definitionSet.scenes[index].label,
      candidates,
      shareRepresentative,
    };
  });

  return frozenCopy({
    palettes: { standard, alternatives },
    fragranceScenes,
  });
}
