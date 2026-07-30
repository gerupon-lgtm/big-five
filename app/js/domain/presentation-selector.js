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
const SCENE_IDS = ["pause", "reset", "quiet-focus"];

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

function validateInputs(titleProfile, definitionSet) {
  if (!hasExactFields(titleProfile, TITLE_PROFILE_FIELDS) ||
    !TITLE_PROFILE_FIELDS
      .filter((field) => field !== "factors")
      .every((field) => isNonEmptyString(titleProfile[field])) ||
    !isDenseArray(titleProfile.factors) ||
    !hasExactFields(definitionSet, DEFINITION_SET_FIELDS) ||
    definitionSet.schemaVersion !== 2 ||
    !isNonEmptyString(definitionSet.presentationDefinitionVersion) ||
    !Object.isFrozen(definitionSet) ||
    !isDenseArray(definitionSet.scenes) ||
    definitionSet.scenes.length !== SCENE_IDS.length ||
    !definitionSet.scenes.every(({ sceneId }, index) => sceneId === SCENE_IDS[index]) ||
    !isDenseArray(definitionSet.palettes) ||
    !isDenseArray(definitionSet.fragrances) ||
    !isDenseArray(definitionSet.titleSelectors)) {
    invalidSelection();
  }

  const version = definitionSet.presentationDefinitionVersion;
  if (!definitionSet.palettes.every(({ version: itemVersion }) => itemVersion === version) ||
    !definitionSet.fragrances.every(({ version: itemVersion }) => itemVersion === version)) {
    invalidSelection();
  }
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
    selector.fragranceScenes.length !== SCENE_IDS.length) {
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
      sceneSelector.sceneId !== SCENE_IDS[index] ||
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

