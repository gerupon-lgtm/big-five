import { isStrictIsoTimestamp } from "../domain/iso-timestamp.js";
import { validateResultSnapshot } from "../domain/result-snapshot.js";
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
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

function canonicalResultOrNull(result) {
  try { return validateResultSnapshot(result); } catch { return null; }
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
    results: envelope.results.map(canonicalResultOrNull).filter(Boolean),
  };
}

function compareHistoryResults(left, right) {
  const timeDifference = Date.parse(right.completedAt) - Date.parse(left.completedAt);
  if (timeDifference !== 0) return timeDifference;
  if (left.resultId < right.resultId) return -1;
  if (left.resultId > right.resultId) return 1;
  return 0;
}

/**
 * Load only valid, answer-free snapshots in deterministic display order.
 * T-006 F-009: reads never repair or rewrite persisted storage.
 */
export function loadResultHistory({ storage, now }) {
  const read = readEnvelope(storage, now);
  if (read.status === "error") return read;
  const results = read.envelope.results
    .map(canonicalResultOrNull)
    .filter(Boolean)
    .sort(compareHistoryResults);
  return { status: "ok", results: Object.freeze(results) };
}

/**
 * Delete one exact valid snapshot after an explicit confirmation.
 * T-006 F-013: malformed and future envelopes are never overwritten.
 */
export function deleteResultSnapshot({ storage, resultId, confirmed, now }) {
  if (!confirmed) return { status: "cancelled" };
  if (typeof resultId !== "string" || !UUID_PATTERN.test(resultId) || !isStrictIsoTimestamp(now)) {
    return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  }
  const read = readEnvelope(storage, now);
  if (read.status === "error") return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };

  const { results: storedResults } = read.envelope;
  let deleted = false;
  const results = storedResults.filter((result) => {
    const canonical = canonicalResultOrNull(result);
    if (!deleted && canonical && canonical.resultId === resultId) {
      deleted = true;
      return false;
    }
    return true;
  });
  if (!deleted) return { status: "ok", deleted: false };
  if (!storage || typeof storage.setItem !== "function") {
    return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  }
  try {
    storage.setItem(FORMAL_STORAGE_KEY, JSON.stringify({ ...read.envelope, updatedAt: now, results }));
    return { status: "ok", deleted: true };
  } catch {
    return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  }
}

/**
 * Clear progress and history only after an explicit confirmation.
 * T-006 F-015: preserve inaccessible, malformed, and future storage verbatim.
 */
export function deleteAllData({ storage, confirmed, now }) {
  if (!confirmed) return { status: "cancelled" };
  if (!isStrictIsoTimestamp(now)) return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  const read = readEnvelope(storage, now);
  if (read.status === "error" || !storage || typeof storage.setItem !== "function") {
    return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  }
  try {
    storage.setItem(FORMAL_STORAGE_KEY, JSON.stringify({
      ...read.envelope,
      updatedAt: now,
      progressByDiagnosis: {},
      results: [],
    }));
    return { status: "ok" };
  } catch {
    return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  }
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

function validateResultTarget(envelope, diagnosisId, definition, meta) {
  if (!definition || typeof definition !== "object" || definition.diagnosisId !== diagnosisId) {
    return { status: "error", code: STORAGE_ERROR.CORRUPT };
  }
  return validateStoredTarget(envelope, definition, meta);
}

function cleanupDetailProgress({ storage, diagnosisId, definition, meta, now }) {
  const read = readEnvelope(storage, now);
  if (read.status === "error" || !storage || typeof storage.setItem !== "function") {
    return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  }
  const target = validateResultTarget(read.envelope, diagnosisId, definition, meta);
  if (target.status === "error") return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  if (!Object.hasOwn(read.envelope.progressByDiagnosis, diagnosisId)) return { status: "ok" };
  const { [diagnosisId]: removed, ...remaining } = read.envelope.progressByDiagnosis;
  try {
    storage.setItem(FORMAL_STORAGE_KEY, JSON.stringify({
      ...read.envelope,
      updatedAt: now,
      progressByDiagnosis: remaining,
    }));
    return { status: "ok" };
  } catch {
    return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  }
}

function resultSaveError({ code, result, detail, cleanup }) {
  return detail
    ? { status: "error", code, result, cleanup }
    : { status: "error", code, result };
}

/**
 * Persist a completed, answer-free ResultSnapshot.
 * T-005/T-006: result persistence remains independent of progress save flows.
 */
export function saveResultSnapshot({ storage, snapshot, diagnosisId, definition, meta, now }) {
  let result;
  try { result = validateResultSnapshot(snapshot); }
  catch { return { status: "error", code: STORAGE_ERROR.CORRUPT }; }
  if (typeof diagnosisId !== "string" || diagnosisId.length === 0 || !isStrictIsoTimestamp(now)) {
    return { status: "error", code: STORAGE_ERROR.CORRUPT };
  }

  const detail = result.mode === "detail50";
  const read = readEnvelope(storage, now);
  if (read.status === "error") {
    return resultSaveError({
      code: read.code,
      result,
      detail,
      cleanup: detail ? cleanupDetailProgress({ storage, diagnosisId, definition, meta, now }) : undefined,
    });
  }
  const target = validateResultTarget(read.envelope, diagnosisId, definition, meta);
  if (target.status === "error") return { status: "error", code: target.code, result };

  const sanitized = sanitizeEnvelope(read.envelope);
  const existing = sanitized.results.find(({ resultId }) => resultId === result.resultId);
  if (existing && JSON.stringify(existing) !== JSON.stringify(result)) {
    return resultSaveError({
      code: STORAGE_ERROR.CORRUPT,
      result,
      detail,
      cleanup: detail ? cleanupDetailProgress({ storage, diagnosisId, definition, meta, now }) : undefined,
    });
  }

  const removeTargetProgress = () => {
    const { [diagnosisId]: removed, ...remaining } = sanitized.progressByDiagnosis;
    return remaining;
  };

  if (existing) {
    if (!detail || !Object.hasOwn(sanitized.progressByDiagnosis, diagnosisId)) {
      return { status: "ok", result: existing, duplicate: true };
    }
    try {
      storage.setItem(FORMAL_STORAGE_KEY, JSON.stringify({
        ...sanitized,
        updatedAt: now,
        progressByDiagnosis: removeTargetProgress(),
      }));
      return { status: "ok", result: existing, duplicate: true };
    } catch {
      return { status: "error", code: STORAGE_ERROR.DELETE_FAILED, result: existing, duplicate: true };
    }
  }

  const nextEnvelope = {
    ...sanitized,
    updatedAt: now,
    results: [...sanitized.results, result],
    ...(detail ? { progressByDiagnosis: removeTargetProgress() } : {}),
  };
  if (!storage || typeof storage.setItem !== "function") {
    return resultSaveError({
      code: STORAGE_ERROR.SAVE_FAILED,
      result,
      detail,
      cleanup: detail ? cleanupDetailProgress({ storage, diagnosisId, definition, meta, now }) : undefined,
    });
  }
  try {
    storage.setItem(FORMAL_STORAGE_KEY, JSON.stringify(nextEnvelope));
    return { status: "ok", result, duplicate: false };
  } catch {
    return resultSaveError({
      code: STORAGE_ERROR.SAVE_FAILED,
      result,
      detail,
      cleanup: detail ? cleanupDetailProgress({ storage, diagnosisId, definition, meta, now }) : undefined,
    });
  }
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
