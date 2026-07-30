import { PRESENTATION_SCENE_IDS } from "./presentation-scenes.js";

const SCENE_FIELDS = [
  "sceneId",
  "label",
  "candidates",
  "shareRepresentative",
];

function invalidSummary() {
  throw new TypeError("SHARE_FRAGRANCE_SUMMARY_INVALID");
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

export function summarizeFragrances(fragranceScenes) {
  if (arguments.length !== 1 ||
    !isDenseArray(fragranceScenes) ||
    fragranceScenes.length !== PRESENTATION_SCENE_IDS.length ||
    !fragranceScenes.every((scene, index) =>
      hasExactFields(scene, SCENE_FIELDS) &&
      scene.sceneId === PRESENTATION_SCENE_IDS[index] &&
      isNonEmptyString(scene.label) &&
      isDenseArray(scene.candidates) &&
      scene.candidates.length === 2 &&
      scene.candidates.every((candidate) =>
        isRecord(candidate) &&
        isNonEmptyString(candidate.fragranceId) &&
        candidate.sceneId === scene.sceneId) &&
      new Set(scene.candidates.map(({ fragranceId }) => fragranceId)).size === 2 &&
      isRecord(scene.shareRepresentative) &&
      isNonEmptyString(scene.shareRepresentative.fragranceId) &&
      scene.shareRepresentative.sceneId === scene.sceneId &&
      scene.candidates.some(({ fragranceId }) =>
        fragranceId === scene.shareRepresentative.fragranceId) &&
      isNonEmptyString(scene.shareRepresentative.accordLabel))) {
    invalidSummary();
  }

  return deepFreeze(fragranceScenes.map(({ sceneId, label, shareRepresentative }) => ({
    sceneId,
    label,
    accordLabel: shareRepresentative.accordLabel,
  })));
}
