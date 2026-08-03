const PROGRESS_FIELDS = [
  "progressId",
  "diagnosisId",
  "mode",
  "versionTuple",
  "startedAt",
  "updatedAt",
  "currentIndex",
  "answers",
  "previewDecision",
];
const VERSION_FIELDS = [
  "scaleVersion",
  "questionVersion",
  "scoringVersion",
  "resultTextVersion",
  "titleRuleVersion",
  "characterManifestVersion",
  "presentationDefinitionVersion",
  "cardTemplateVersion",
  "appVersion",
];
import { isStrictIsoTimestamp } from "./iso-timestamp.js";

const PREVIEW_DECISIONS = new Set(["undecided", "showPreview", "continueHidden"]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const RESPONSE_ERROR = Object.freeze({
  INVALID_INPUT: "RESPONSE_INVALID_INPUT",
  INVALID_TRANSITION: "RESPONSE_INVALID_TRANSITION",
  INCOMPATIBLE_PROGRESS: "PROGRESS_INCOMPATIBLE",
});

function fail(code) {
  throw new TypeError(code);
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOwnDataFields(value, fields) {
  return isRecord(value) &&
    Object.getPrototypeOf(value) === Object.prototype &&
    Object.keys(value).length === fields.length &&
    fields.every((field) => {
      const descriptor = Object.getOwnPropertyDescriptor(value, field);
      return descriptor && Object.hasOwn(descriptor, "value");
    });
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) deepFreeze(nestedValue);
  }
  return value;
}

function resolveQuestionIds(definition) {
  if (!isRecord(definition) || typeof definition.diagnosisId !== "string" ||
    !Array.isArray(definition.previewQuestionIds) || definition.previewQuestionIds.length !== 20 ||
    !Array.isArray(definition.detailQuestionIds) || definition.detailQuestionIds.length !== 50 ||
    !definition.previewQuestionIds.every((id) => typeof id === "string") ||
    !definition.detailQuestionIds.every((id) => typeof id === "string") ||
    new Set(definition.previewQuestionIds).size !== 20 ||
    new Set(definition.detailQuestionIds).size !== 50 ||
    !definition.previewQuestionIds.every((id, index) => definition.detailQuestionIds[index] === id)) {
    fail(RESPONSE_ERROR.INVALID_INPUT);
  }
  return {
    previewIds: definition.previewQuestionIds,
    detailIds: definition.detailQuestionIds,
  };
}

export function createVersionTuple(meta) {
  if (!isRecord(meta) || !isRecord(meta.diagnosticVersions) ||
    !VERSION_FIELDS.every((field) => typeof (
      field === "appVersion" ? meta.appVersion :
        field === "characterManifestVersion" || field === "presentationDefinitionVersion" || field === "cardTemplateVersion"
          ? meta[field]
          : meta.diagnosticVersions[field]
    ) === "string")) {
    fail(RESPONSE_ERROR.INVALID_INPUT);
  }
  return deepFreeze({
    scaleVersion: meta.diagnosticVersions.scaleVersion,
    questionVersion: meta.diagnosticVersions.questionVersion,
    scoringVersion: meta.diagnosticVersions.scoringVersion,
    resultTextVersion: meta.diagnosticVersions.resultTextVersion,
    titleRuleVersion: meta.diagnosticVersions.titleRuleVersion,
    characterManifestVersion: meta.characterManifestVersion,
    presentationDefinitionVersion: meta.presentationDefinitionVersion,
    cardTemplateVersion: meta.cardTemplateVersion,
    appVersion: meta.appVersion,
  });
}

function matchesVersionTuple(value, expected) {
  return hasOwnDataFields(value, VERSION_FIELDS) && VERSION_FIELDS.every((field) => value[field] === expected[field]);
}

function activeQuestionIds(progress, questionIds) {
  return progress.mode === "preview20" ? questionIds.previewIds : questionIds.detailIds;
}

function validAnswers(value, permittedIds) {
  if (!isRecord(value) || Object.getPrototypeOf(value) !== Object.prototype) return false;
  const permitted = new Set(permittedIds);
  return Object.keys(value).every((questionId) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, questionId);
    return permitted.has(questionId) && descriptor && Object.hasOwn(descriptor, "value") &&
      Number.isInteger(descriptor.value) && descriptor.value >= 1 && descriptor.value <= 5;
  });
}

function validAnswerPrefix(progress, questionIds) {
  const ids = activeQuestionIds(progress, questionIds);
  const answers = progress.answers;
  const answeredIndexes = ids.map((id) => Object.hasOwn(answers, id));
  const completed = answeredIndexes.every(Boolean);
  if (answeredIndexes.some((answered, index) => !answered && answeredIndexes.slice(index + 1).some(Boolean))) return false;
  if (completed) return progress.currentIndex >= 0 && progress.currentIndex < ids.length;
  const firstUnanswered = answeredIndexes.findIndex((answered) => !answered);
  return progress.currentIndex <= firstUnanswered;
}

function cloneProgress(progress, changes) {
  return deepFreeze({
    ...progress,
    ...changes,
    versionTuple: { ...(changes.versionTuple ?? progress.versionTuple) },
    answers: { ...(changes.answers ?? progress.answers) },
  });
}

export function validateProgressRecord(progress, { definition, meta }) {
  const questionIds = resolveQuestionIds(definition);
  const expectedTuple = createVersionTuple(meta);
  if (!hasOwnDataFields(progress, PROGRESS_FIELDS) ||
    typeof progress.progressId !== "string" || !UUID_PATTERN.test(progress.progressId) ||
    progress.diagnosisId !== definition.diagnosisId ||
    !["preview20", "detail50"].includes(progress.mode) ||
    !matchesVersionTuple(progress.versionTuple, expectedTuple) ||
    !isStrictIsoTimestamp(progress.startedAt) || !isStrictIsoTimestamp(progress.updatedAt) ||
    !Number.isInteger(progress.currentIndex) || progress.currentIndex < 0 ||
    progress.currentIndex > (progress.mode === "preview20" ? 19 : 49) ||
    !PREVIEW_DECISIONS.has(progress.previewDecision) ||
    (progress.mode === "preview20" && progress.previewDecision === "continueHidden") ||
    (progress.mode === "detail50" && !["showPreview", "continueHidden"].includes(progress.previewDecision)) ||
    !validAnswers(progress.answers, activeQuestionIds(progress, questionIds)) ||
    !validAnswerPrefix(progress, questionIds)) {
    fail(RESPONSE_ERROR.INCOMPATIBLE_PROGRESS);
  }
  return cloneProgress(progress, {});
}

export function createProgressRecord({ definition, meta, progressId, now }) {
  resolveQuestionIds(definition);
  const versionTuple = createVersionTuple(meta);
  if (typeof progressId !== "string" || !UUID_PATTERN.test(progressId) || !isStrictIsoTimestamp(now)) {
    fail(RESPONSE_ERROR.INVALID_INPUT);
  }
  return deepFreeze({
    progressId,
    diagnosisId: definition.diagnosisId,
    mode: "preview20",
    versionTuple,
    startedAt: now,
    updatedAt: now,
    currentIndex: 0,
    answers: {},
    previewDecision: "undecided",
  });
}

function validateCurrentAnswer(answer, expectedQuestionId) {
  if (!hasOwnDataFields(answer, ["questionId", "value"]) ||
    answer.questionId !== expectedQuestionId || !Number.isInteger(answer.value) ||
    answer.value < 1 || answer.value > 5) {
    fail(RESPONSE_ERROR.INVALID_INPUT);
  }
}

function nextUnansweredIndex(progress, questionIds, fromIndex) {
  const ids = activeQuestionIds(progress, questionIds);
  for (let index = fromIndex; index < ids.length; index += 1) {
    if (!Object.hasOwn(progress.answers, ids[index])) return index;
  }
  return null;
}

export function answerCurrent(progress, answer, { definition, now, meta } = {}) {
  const questionIds = resolveQuestionIds(definition);
  const state = validateProgressRecord(progress, { definition, meta });
  if (!isStrictIsoTimestamp(now)) fail(RESPONSE_ERROR.INVALID_INPUT);
  if (state.previewDecision !== "undecided" && state.mode === "preview20") {
    fail(RESPONSE_ERROR.INVALID_TRANSITION);
  }
  const ids = activeQuestionIds(state, questionIds);
  validateCurrentAnswer(answer, ids[state.currentIndex]);
  const wasAnswered = Object.hasOwn(state.answers, answer.questionId);

  const answered = cloneProgress(state, {
    answers: { ...state.answers, [answer.questionId]: answer.value },
    updatedAt: now,
  });
  const isReviewingCompletedDetail = state.mode === "detail50" &&
    Object.keys(state.answers).length === ids.length;
  if (isReviewingCompletedDetail && wasAnswered && state.currentIndex + 1 < ids.length) {
    return deepFreeze({
      kind: "in-progress",
      progress: cloneProgress(answered, { currentIndex: state.currentIndex + 1 }),
    });
  }
  const nextIndex = nextUnansweredIndex(answered, questionIds, state.currentIndex + 1);
  if (nextIndex !== null) {
    return deepFreeze({ kind: "in-progress", progress: cloneProgress(answered, { currentIndex: nextIndex }) });
  }
  if (state.mode === "preview20") {
    return deepFreeze({ kind: "preview-choice-required", progress: cloneProgress(answered, { currentIndex: 19 }) });
  }
  return deepFreeze({
    kind: "detail-review-required",
    progress: cloneProgress(answered, { currentIndex: 49 }),
  });
}

function isDetailReviewState(state, questionIds) {
  return state.mode === "detail50" &&
    state.currentIndex === questionIds.detailIds.length - 1 &&
    Object.keys(state.answers).length === questionIds.detailIds.length;
}

export function isDetailReviewProgress(progress, { definition, meta } = {}) {
  const questionIds = resolveQuestionIds(definition);
  const state = validateProgressRecord(progress, { definition, meta });
  return isDetailReviewState(state, questionIds);
}

export function completeDetail(progress, { definition, meta, now }) {
  const questionIds = resolveQuestionIds(definition);
  const state = validateProgressRecord(progress, { definition, meta });
  if (!isStrictIsoTimestamp(now) || !isDetailReviewState(state, questionIds)) {
    fail(RESPONSE_ERROR.INVALID_TRANSITION);
  }
  const completed = cloneProgress(state, { updatedAt: now });
  return deepFreeze({
    kind: "detail-complete",
    progress: completed,
    answers: { ...completed.answers },
  });
}

export function goBack(progress, { definition, meta, now }) {
  const questionIds = resolveQuestionIds(definition);
  const state = validateProgressRecord(progress, { definition, meta });
  if (!isStrictIsoTimestamp(now) || state.currentIndex === 0 ||
    (state.mode === "preview20" && state.previewDecision !== "undecided")) {
    fail(RESPONSE_ERROR.INVALID_TRANSITION);
  }
  return deepFreeze({
    kind: "in-progress",
    progress: cloneProgress(state, { currentIndex: state.currentIndex - 1, updatedAt: now }),
  });
}

export function choosePreviewExit(progress, decision, { definition, meta, now }) {
  const state = validateProgressRecord(progress, { definition, meta });
  if (!isStrictIsoTimestamp(now) || state.mode !== "preview20" || state.previewDecision !== "undecided" ||
    !["showPreview", "continueHidden"].includes(decision) ||
    Object.keys(state.answers).length !== 20) {
    fail(RESPONSE_ERROR.INVALID_TRANSITION);
  }
  if (decision === "showPreview") {
    return deepFreeze({
      kind: "preview-ready",
      progress: cloneProgress(state, { previewDecision: decision, updatedAt: now }),
    });
  }
  return deepFreeze({
    kind: "detail-continued",
    progress: cloneProgress(state, {
      mode: "detail50",
      currentIndex: 20,
      previewDecision: decision,
      updatedAt: now,
    }),
  });
}

export function continueAfterPreview(progress, { definition, meta, now }) {
  const state = validateProgressRecord(progress, { definition, meta });
  if (!isStrictIsoTimestamp(now) || state.mode !== "preview20" || state.previewDecision !== "showPreview" ||
    Object.keys(state.answers).length !== 20) {
    fail(RESPONSE_ERROR.INVALID_TRANSITION);
  }
  return deepFreeze({
    kind: "detail-after-preview",
    progress: cloneProgress(state, {
      mode: "detail50",
      currentIndex: 20,
      previewDecision: "showPreview",
      updatedAt: now,
    }),
  });
}
