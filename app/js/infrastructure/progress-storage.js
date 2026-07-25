import { isValidFactorResults } from "../domain/factor-result.js";
import { isStrictIsoTimestamp } from "../domain/iso-timestamp.js";
import { FACTOR_ORDER } from "../data/factor-order.js";
import {
  RESPONSE_ERROR,
  answerCurrent,
  createVersionTuple,
  validateProgressRecord,
} from "../domain/response-state.js";

export const FORMAL_STORAGE_KEY = "big-five-self-understanding:v1";
export const STORAGE_ERROR = Object.freeze({
  CORRUPT: "STORAGE_CORRUPT",
  INCOMPATIBLE: "STORAGE_INCOMPATIBLE",
  UNAVAILABLE: "STORAGE_UNAVAILABLE",
  SAVE_FAILED: "STORAGE_SAVE_FAILED",
  DELETE_FAILED: "STORAGE_DELETE_FAILED",
});

const ENVELOPE_FIELDS = ["schemaVersion", "updatedAt", "progressByDiagnosis", "results"];
const VERSION_FIELDS = ["scaleVersion", "questionVersion", "scoringVersion", "resultTextVersion", "titleRuleVersion", "characterManifestVersion", "presentationDefinitionVersion", "cardTemplateVersion", "appVersion"];
const PROGRESS_FIELDS = ["progressId", "diagnosisId", "mode", "versionTuple", "startedAt", "updatedAt", "currentIndex", "answers", "previewDecision"];
const RESULT_FIELDS = ["resultId", "diagnosisId", "completedAt", "questionCount", "mode", "versionTuple", "factors", "titleId", "characterId", "characterAssetVersion", "boundaryFlags", "renderedTexts", "selectedPaletteId", "cardTemplateVersion"];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SECTIONS = new Set(["summary", "strength", "tradeoff", "work", "relationship", "stress", "action"]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOwnDataFields(value, fields) {
  return isRecord(value) && Object.getPrototypeOf(value) === Object.prototype &&
    Object.keys(value).length === fields.length && fields.every((field) => {
      const descriptor = Object.getOwnPropertyDescriptor(value, field);
      return descriptor && Object.hasOwn(descriptor, "value");
    });
}

function validVersionTuple(value) {
  return hasOwnDataFields(value, VERSION_FIELDS) && VERSION_FIELDS.every((field) => typeof value[field] === "string" && value[field].length > 0);
}

function validAnswers(value) {
  return isRecord(value) && Object.getPrototypeOf(value) === Object.prototype && Object.keys(value).every((id) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, id);
    return typeof id === "string" && id.length > 0 && descriptor && Object.hasOwn(descriptor, "value") &&
      Number.isInteger(descriptor.value) && descriptor.value >= 1 && descriptor.value <= 5;
  });
}

function validGenericProgress(progress, diagnosisId) {
  if (!hasOwnDataFields(progress, PROGRESS_FIELDS) || progress.diagnosisId !== diagnosisId ||
    !UUID_PATTERN.test(progress.progressId) || !validVersionTuple(progress.versionTuple) ||
    !isStrictIsoTimestamp(progress.startedAt) || !isStrictIsoTimestamp(progress.updatedAt) ||
    !["preview20", "detail50"].includes(progress.mode) || !Number.isInteger(progress.currentIndex) ||
    !validAnswers(progress.answers) || !["undecided", "showPreview", "continueHidden"].includes(progress.previewDecision)) return false;
  const answerCount = Object.keys(progress.answers).length;
  if (answerCount < progress.currentIndex) return false;
  if (progress.mode === "preview20") return progress.currentIndex >= 0 && progress.currentIndex <= 19 &&
    progress.previewDecision !== "continueHidden" && Object.keys(progress.answers).length <= 20 &&
    (progress.previewDecision !== "showPreview" || Object.keys(progress.answers).length === 20);
  return progress.currentIndex >= 0 && progress.currentIndex <= 49 &&
    ["showPreview", "continueHidden"].includes(progress.previewDecision) &&
    Object.keys(progress.answers).length >= 20 && Object.keys(progress.answers).length <= 50;
}

function validBoundaryFlag(flag, questionCount) {
  if (!isRecord(flag)) return false;
  const threshold = questionCount === 20 ? 0.25 : 0.1;
  if (flag.type === "factor-near-band-boundary") {
    return hasOwnDataFields(flag, ["type", "factorId", "boundary", "threshold", "questionCount"]) &&
      FACTOR_ORDER.includes(flag.factorId) && [2.5, 3.5].includes(flag.boundary) && flag.threshold === threshold && flag.questionCount === questionCount;
  }
  if (flag.type === "second-third-salience-near-tie") {
    return hasOwnDataFields(flag, ["type", "factorIds", "threshold", "questionCount"]) && Array.isArray(flag.factorIds) &&
      flag.factorIds.length === 2 && new Set(flag.factorIds).size === 2 && flag.factorIds.every((id) => FACTOR_ORDER.includes(id)) &&
      flag.threshold === threshold && flag.questionCount === questionCount;
  }
  return false;
}

function validRenderedText(value) {
  return hasOwnDataFields(value, ["id", "version", "section", "text", "evidenceRefs"]) &&
    ["id", "version", "text"].every((field) => typeof value[field] === "string" && value[field].length > 0) &&
    SECTIONS.has(value.section) && Array.isArray(value.evidenceRefs) && value.evidenceRefs.every((ref) => typeof ref === "string" && ref.length > 0) &&
    new Set(value.evidenceRefs).size === value.evidenceRefs.length;
}

function validGenericResult(result) {
  return hasOwnDataFields(result, RESULT_FIELDS) && UUID_PATTERN.test(result.resultId) && typeof result.diagnosisId === "string" && result.diagnosisId.length > 0 &&
    isStrictIsoTimestamp(result.completedAt) && [20, 50].includes(result.questionCount) &&
    result.mode === (result.questionCount === 20 ? "preview20" : "detail50") && validVersionTuple(result.versionTuple) &&
    isValidFactorResults(result.factors, result.questionCount) && ["titleId", "characterId", "characterAssetVersion", "selectedPaletteId", "cardTemplateVersion"].every((field) => typeof result[field] === "string" && result[field].length > 0) &&
    Array.isArray(result.boundaryFlags) && result.boundaryFlags.every((flag) => validBoundaryFlag(flag, result.questionCount)) &&
    Array.isArray(result.renderedTexts) && result.renderedTexts.every(validRenderedText);
}

function safeJsonValue(value, seen = new Set()) {
  if (value === null || ["string", "boolean"].includes(typeof value)) return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return !seen.has(value) && (seen.add(value), value.every((item) => safeJsonValue(item, seen)));
  if (!isRecord(value) || Object.getPrototypeOf(value) !== Object.prototype || seen.has(value)) return false;
  seen.add(value);
  return Object.keys(value).every((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    return descriptor && Object.hasOwn(descriptor, "value") && safeJsonValue(descriptor.value, seen);
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createEmptyEnvelope(now) {
  return { schemaVersion: 1, updatedAt: now, progressByDiagnosis: {}, results: [] };
}

function parseEnvelope(raw, now) {
  if (raw === null) return isStrictIsoTimestamp(now) ? { status: "ok", envelope: createEmptyEnvelope(now) } : { status: "error", code: STORAGE_ERROR.CORRUPT };
  if (typeof raw !== "string") return { status: "error", code: STORAGE_ERROR.CORRUPT };
  let value;
  try { value = JSON.parse(raw); } catch { return { status: "error", code: STORAGE_ERROR.CORRUPT }; }
  if (!hasOwnDataFields(value, ENVELOPE_FIELDS) || !Number.isInteger(value.schemaVersion) || !isStrictIsoTimestamp(value.updatedAt) ||
    !isRecord(value.progressByDiagnosis) || Object.getPrototypeOf(value.progressByDiagnosis) !== Object.prototype || !Array.isArray(value.results) ||
    !safeJsonValue(value.progressByDiagnosis) || !safeJsonValue(value.results)) return { status: "error", code: STORAGE_ERROR.CORRUPT };
  if (value.schemaVersion > 1) return { status: "error", code: STORAGE_ERROR.INCOMPATIBLE };
  if (value.schemaVersion !== 1) return { status: "error", code: STORAGE_ERROR.CORRUPT };
  return { status: "ok", envelope: clone(value) };
}

function readEnvelope(storage, now) {
  if (!storage || typeof storage.getItem !== "function") return { status: "error", code: STORAGE_ERROR.UNAVAILABLE };
  try { return parseEnvelope(storage.getItem(FORMAL_STORAGE_KEY), now); } catch { return { status: "error", code: STORAGE_ERROR.UNAVAILABLE }; }
}

function progressError(candidate, meta) {
  if (isRecord(candidate) && isRecord(candidate.versionTuple)) {
    try {
      const expected = createVersionTuple(meta);
      if (Object.keys(expected).some((field) => candidate.versionTuple[field] !== expected[field])) return RESPONSE_ERROR.INCOMPATIBLE_PROGRESS;
    } catch { /* corrupt below */ }
  }
  return STORAGE_ERROR.CORRUPT;
}

function validateStoredTarget(envelope, definition, meta) {
  const candidate = envelope.progressByDiagnosis[definition.diagnosisId];
  if (candidate === undefined) return { status: "ok", progress: null };
  try { return { status: "ok", progress: validateProgressRecord(candidate, { definition, meta }) }; }
  catch { return { status: "error", code: progressError(candidate, meta) }; }
}

function sanitizeEnvelope(envelope) {
  return {
    ...envelope,
    progressByDiagnosis: Object.fromEntries(Object.entries(envelope.progressByDiagnosis).filter(([id, progress]) => validGenericProgress(progress, id))),
    results: envelope.results.filter(validGenericResult),
  };
}

export function loadProgress({ storage, definition, meta, now }) {
  const read = readEnvelope(storage, now);
  if (read.status === "error") return read;
  const target = validateStoredTarget(read.envelope, definition, meta);
  return target.status === "error" ? target : { status: "ok", progress: target.progress };
}

export function saveProgress({ storage, progress, definition, meta, now }) {
  let validProgress;
  try { validProgress = validateProgressRecord(progress, { definition, meta }); }
  catch { return { status: "error", code: RESPONSE_ERROR.INCOMPATIBLE_PROGRESS, progress }; }
  if (!isStrictIsoTimestamp(now)) return { status: "error", code: STORAGE_ERROR.SAVE_FAILED, progress: validProgress };
  const read = readEnvelope(storage, now);
  if (read.status === "error") return { ...read, progress: validProgress };
  const existing = validateStoredTarget(read.envelope, definition, meta);
  if (existing.status === "error") return { ...existing, progress: validProgress };
  const sanitized = sanitizeEnvelope(read.envelope);
  const nextEnvelope = {
    ...sanitized,
    updatedAt: now,
    progressByDiagnosis: { ...sanitized.progressByDiagnosis, [definition.diagnosisId]: validProgress },
  };
  if (!storage || typeof storage.setItem !== "function") return { status: "error", code: STORAGE_ERROR.SAVE_FAILED, progress: validProgress };
  try { storage.setItem(FORMAL_STORAGE_KEY, JSON.stringify(nextEnvelope)); return { status: "ok", progress: validProgress }; }
  catch { return { status: "error", code: STORAGE_ERROR.SAVE_FAILED, progress: validProgress }; }
}

export function discardProgress({ storage, diagnosisId, confirmed, now }) {
  if (!confirmed) return { status: "cancelled" };
  if (typeof diagnosisId !== "string" || diagnosisId.length === 0 || !isStrictIsoTimestamp(now)) return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  const read = readEnvelope(storage, now);
  if (read.status === "error" || !storage || typeof storage.setItem !== "function") return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  const sanitized = sanitizeEnvelope(read.envelope);
  const { [diagnosisId]: removed, ...remaining } = sanitized.progressByDiagnosis;
  try {
    storage.setItem(FORMAL_STORAGE_KEY, JSON.stringify({ ...sanitized, updatedAt: now, progressByDiagnosis: remaining }));
    return { status: "ok" };
  } catch { return { status: "error", code: STORAGE_ERROR.DELETE_FAILED }; }
}

export function persistTransition({ storage, transition, definition, meta, now }) {
  if (!transition || typeof transition !== "object" || !transition.progress) {
    throw new TypeError(RESPONSE_ERROR.INVALID_INPUT);
  }
  const persistence = saveProgress({ storage, progress: transition.progress, definition, meta, now });
  return Object.freeze({ ...transition, persistence });
}

export function answerAndSave({ storage, progress, answer, definition, meta, now }) {
  return persistTransition({ storage, transition: answerCurrent(progress, answer, { definition, meta, now }), definition, meta, now });
}

export function transitionAndSave({ storage, transition, definition, meta, now }) {
  return persistTransition({ storage, transition, definition, meta, now });
}
