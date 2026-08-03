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
const SNAPSHOT_FIELDS = [
  "resultId",
  "completedAt",
  "questionCount",
  "mode",
  "versionTuple",
  "factors",
  "titleId",
  "characterId",
  "characterAssetVersion",
  "boundaryFlags",
  "renderedTexts",
  "selectedPaletteId",
  "cardTemplateVersion",
];
const VERSION_FIELDS = Object.freeze(Object.keys(createVersionTuple(appMeta)));
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TITLE_SECTIONS = ["titleSubtitle", "titleReason"];
const V1_PREVIEW_SECTIONS = Object.freeze([
  ...TITLE_SECTIONS,
  ...FACTOR_ORDER.map(() => "observation"),
]);
const V1_DETAIL_SECTIONS = Object.freeze([
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
const V2_PREVIEW_SECTIONS = Object.freeze([
  ...TITLE_SECTIONS,
  "titleReflection",
  ...V1_PREVIEW_SECTIONS.slice(TITLE_SECTIONS.length),
]);
const V2_DETAIL_SECTIONS = Object.freeze([
  ...TITLE_SECTIONS,
  "titleReflection",
  "titleReflection",
  "titleReflection",
  ...V1_DETAIL_SECTIONS.slice(TITLE_SECTIONS.length),
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
  const v1Sections = mode === "preview20" ? V1_PREVIEW_SECTIONS : V1_DETAIL_SECTIONS;
  const v2Sections = mode === "preview20" ? V2_PREVIEW_SECTIONS : V2_DETAIL_SECTIONS;
  let expectedSections;
  if (resultTextVersion === "result-text-v1") {
    expectedSections = v1Sections;
  } else if (resultTextVersion === "result-text-v2") {
    if (renderedTexts.length === v1Sections.length) {
      expectedSections = v1Sections;
    } else if (renderedTexts.length === v2Sections.length) {
      expectedSections = v2Sections;
    } else {
      return false;
    }
  } else {
    return false;
  }
  const factorSections = mode === "preview20"
    ? ["observation"]
    : ["observation", "strength", "tradeoff", "work", "relationship", "stress", "question", "action"];
  const reflectionCount = expectedSections.filter(
    (section) => section === "titleReflection",
  ).length;
  const expectedIds = [
    `${titleId}-subtitle`,
    `${titleId}-reason`,
    ...Array.from(
      { length: reflectionCount },
      (_, index) => `title-reflection-${titleId.slice("title-".length)}-${index + 1}`,
    ),
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
    !["characterAssetVersion", "selectedPaletteId", "cardTemplateVersion"].every(
      (field) => typeof input[field] === "string" && input[field].length > 0,
    ) ||
    !UUID_PATTERN.test(resultId) ||
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

export function validateResultSnapshot(snapshot) {
  try {
    if (!hasExactDataFields(snapshot, SNAPSHOT_FIELDS)) invalidSnapshot();
    return buildSnapshot({
      resultId: snapshot.resultId,
      completedAt: snapshot.completedAt,
      questionCount: snapshot.questionCount,
      mode: snapshot.mode,
      versionTuple: snapshot.versionTuple,
      resultModel: {
        factors: snapshot.factors,
        titleId: snapshot.titleId,
        characterId: snapshot.characterId,
        boundaryFlags: snapshot.boundaryFlags,
        renderedTexts: snapshot.renderedTexts,
      },
      characterAssetVersion: snapshot.characterAssetVersion,
      selectedPaletteId: snapshot.selectedPaletteId,
      cardTemplateVersion: snapshot.cardTemplateVersion,
    });
  } catch {
    invalidSnapshot();
  }
}
