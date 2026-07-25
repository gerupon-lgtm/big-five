import { appMeta } from "../config/app-meta.js";
import { FACTOR_ORDER } from "../data/factor-order.js";
import { isStrictIsoTimestamp } from "./iso-timestamp.js";
import { isValidResultModel } from "./result-model.js";
import { createVersionTuple } from "./response-state.js";

const INPUT_FIELDS = [
  "resultId",
  "completedAt",
  "questionCount",
  "mode",
  "versionTuple",
  "resultModel",
  "characterAssetVersion",
  "selectedPaletteId",
  "cardTemplateVersion",
];
const VERSION_FIELDS = Object.freeze(Object.keys(createVersionTuple(appMeta)));
const TITLE_SECTIONS = ["titleSubtitle", "titleReason"];
const PREVIEW_SECTIONS = Object.freeze([
  ...TITLE_SECTIONS,
  ...FACTOR_ORDER.map(() => "observation"),
]);
const DETAIL_SECTIONS = Object.freeze([
  ...TITLE_SECTIONS,
  ...[
    "observation",
    "strength",
    "tradeoff",
    "work",
    "relationship",
    "stress",
    "question",
    "action",
  ].flatMap((section) => FACTOR_ORDER.map(() => section)),
]);

function invalidSnapshot() {
  throw new TypeError("RESULT_SNAPSHOT_INVALID");
}

function hasExactDataFields(value, fields) {
  if (value === null || typeof value !== "object" || Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Object.prototype) {
    return false;
  }
  const keys = Reflect.ownKeys(value);
  return keys.length === fields.length && fields.every((field) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, field);
    return descriptor && descriptor.enumerable && Object.hasOwn(descriptor, "value");
  });
}

function hasAnswersField(value, seen = new Set()) {
  if (value === null || typeof value !== "object") return false;
  if (seen.has(value)) return false;
  seen.add(value);

  for (const key of Reflect.ownKeys(value)) {
    if (key === "answers") return true;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor && Object.hasOwn(descriptor, "value") &&
      hasAnswersField(descriptor.value, seen)) {
      return true;
    }
  }
  return false;
}

function validVersionTuple(value) {
  return hasExactDataFields(value, VERSION_FIELDS) &&
    VERSION_FIELDS.every((field) => typeof value[field] === "string" && value[field].length > 0);
}

function validRenderedTexts({ renderedTexts, factors, titleId }, mode, resultTextVersion) {
  const expectedSections = mode === "preview20" ? PREVIEW_SECTIONS : DETAIL_SECTIONS;
  const factorSections = mode === "preview20"
    ? ["observation"]
    : ["observation", "strength", "tradeoff", "work", "relationship", "stress", "question", "action"];
  const expectedIds = [
    `${titleId}-subtitle`,
    `${titleId}-reason`,
    ...factorSections.flatMap((section) => factors.map(
      ({ factorId, band }) => `${mode}-${factorId}-${band}-${section}`,
    )),
  ];
  return renderedTexts.length === expectedSections.length &&
    renderedTexts.every((record, index) =>
      record.version === resultTextVersion &&
      record.section === expectedSections[index] &&
      record.id === expectedIds[index] &&
      record.evidenceRefs.length > 0) &&
    new Set(renderedTexts.map(({ id }) => id)).size === renderedTexts.length;
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) deepFreeze(nestedValue);
  }
  return value;
}

function buildSnapshot(input) {
  if (!hasExactDataFields(input, INPUT_FIELDS)) invalidSnapshot();
  const {
    resultId,
    completedAt,
    questionCount,
    mode,
    versionTuple,
    resultModel,
    characterAssetVersion,
    selectedPaletteId,
    cardTemplateVersion,
  } = input;

  const validModeAndCount =
    (mode === "preview20" && questionCount === 20) ||
    (mode === "detail50" && questionCount === 50);
  if (
    !validModeAndCount ||
    !isStrictIsoTimestamp(completedAt) ||
    !validVersionTuple(versionTuple) ||
    hasAnswersField(resultModel) ||
    !isValidResultModel(resultModel, questionCount) ||
    !validRenderedTexts(resultModel, mode, versionTuple.resultTextVersion) ||
    !["resultId", "characterAssetVersion", "selectedPaletteId", "cardTemplateVersion"].every(
      (field) => typeof input[field] === "string" && input[field].length > 0,
    ) ||
    cardTemplateVersion !== versionTuple.cardTemplateVersion
  ) {
    invalidSnapshot();
  }

  // The selected entry's assetVersion is independent of the containing manifest's version.
  return deepFreeze({
    resultId,
    completedAt,
    questionCount,
    mode,
    versionTuple: Object.fromEntries(VERSION_FIELDS.map((field) => [field, versionTuple[field]])),
    factors: resultModel.factors.map((factor) => ({ ...factor })),
    titleId: resultModel.titleId,
    characterId: resultModel.characterId,
    characterAssetVersion,
    boundaryFlags: resultModel.boundaryFlags.map((flag) => ({
      ...flag,
      ...(flag.type === "second-third-salience-near-tie" ? { factorIds: [...flag.factorIds] } : {}),
    })),
    renderedTexts: resultModel.renderedTexts.map((record) => ({
      ...record,
      evidenceRefs: [...record.evidenceRefs],
    })),
    selectedPaletteId,
    cardTemplateVersion,
  });
}

export function createResultSnapshot(input) {
  try {
    return buildSnapshot(input);
  } catch {
    invalidSnapshot();
  }
}
