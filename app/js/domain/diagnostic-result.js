import { resolveCharacterEntry, validateCharacterManifest } from "./character-manifest.js";
import { composeResultModel } from "./result-model.js";
import { composeResultTexts } from "./result-composer.js";
import { createResultSnapshot } from "./result-snapshot.js";
import { scoreDiagnostic } from "./scoring.js";
import { classifyTitle } from "./title-classifier.js";

const INPUT_FIELDS = [
  "answers",
  "questionCount",
  "mode",
  "resultId",
  "completedAt",
  "versionTuple",
  "questionDefinitions",
  "titleProfiles",
  "resultTextDefinitions",
  "resultTextVersion",
  "characterManifest",
  "cardTemplateVersion",
];

function invalidResult() {
  throw new TypeError("DIAGNOSTIC_RESULT_INVALID");
}

function isExactInput(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype &&
    Reflect.ownKeys(value).length === INPUT_FIELDS.length &&
    INPUT_FIELDS.every((field) => {
      const descriptor = Object.getOwnPropertyDescriptor(value, field);
      return descriptor?.enumerable && Object.hasOwn(descriptor, "value");
    });
}

function cloneDataTree(value, seen = new Map()) {
  if (value === null || ["string", "number", "boolean"].includes(typeof value)) return value;
  if (typeof value !== "object" || seen.has(value)) invalidResult();
  if (Array.isArray(value)) {
    if (Object.getPrototypeOf(value) !== Array.prototype) invalidResult();
    const lengthDescriptor = Object.getOwnPropertyDescriptor(value, "length");
    if (!lengthDescriptor || !Object.hasOwn(lengthDescriptor, "value") ||
      Reflect.ownKeys(value).length !== value.length + 1) invalidResult();
    const copy = [];
    seen.set(value, copy);
    for (let index = 0; index < value.length; index += 1) {
      const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
      if (!descriptor?.enumerable || !Object.hasOwn(descriptor, "value")) invalidResult();
      copy.push(cloneDataTree(descriptor.value, seen));
    }
    return copy;
  }
  if (Object.getPrototypeOf(value) !== Object.prototype) invalidResult();
  const copy = {};
  seen.set(value, copy);
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (typeof key !== "string" || !descriptor?.enumerable || !Object.hasOwn(descriptor, "value")) invalidResult();
    copy[key] = cloneDataTree(descriptor.value, seen);
  }
  return copy;
}

function buildSnapshot(input) {
  if (!isExactInput(input)) invalidResult();
  const {
    answers,
    questionCount,
    mode,
    resultId,
    completedAt,
    versionTuple,
    questionDefinitions,
    titleProfiles,
    resultTextDefinitions,
    resultTextVersion,
    characterManifest,
    cardTemplateVersion,
  } = input;

  if ((mode !== "preview20" || questionCount !== 20) &&
    (mode !== "detail50" || questionCount !== 50)) invalidResult();

  const manifestForValidation = cloneDataTree(characterManifest);
  validateCharacterManifest(
    manifestForValidation,
    titleProfiles,
    versionTuple?.characterManifestVersion,
  );
  const factors = scoreDiagnostic({ questionDefinitions, answers, questionCount });
  const classification = classifyTitle({ factorResults: factors, questionCount, titleProfiles });
  const renderedTexts = composeResultTexts({
    definitions: resultTextDefinitions,
    version: resultTextVersion,
    mode,
    questionCount,
    factors,
    titleId: classification.titleId,
  });
  const resultModel = composeResultModel({ factors, classification, renderedTexts });
  const matchingProfiles = titleProfiles.filter((profile) =>
    profile.titleId === classification.titleId && profile.characterId === classification.characterId);
  if (matchingProfiles.length !== 1) invalidResult();
  const characterEntry = resolveCharacterEntry(manifestForValidation, classification.characterId);

  return createResultSnapshot({
    resultId,
    completedAt,
    questionCount,
    mode,
    versionTuple,
    resultModel,
    characterAssetVersion: characterEntry.assetVersion,
    selectedPaletteId: matchingProfiles[0].defaultPaletteId,
    cardTemplateVersion,
  });
}

export function createDiagnosticResultSnapshot(input) {
  try {
    return buildSnapshot(input);
  } catch {
    invalidResult();
  }
}
