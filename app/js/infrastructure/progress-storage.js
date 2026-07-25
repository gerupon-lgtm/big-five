import {
  RESPONSE_ERROR,
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
const ISO_8601_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

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

function validTimestamp(value) {
  return typeof value === "string" && ISO_8601_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
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
  return {
    schemaVersion: 1,
    updatedAt: now,
    progressByDiagnosis: {},
    results: [],
  };
}

function parseEnvelope(raw) {
  if (raw === null) return { status: "ok", envelope: createEmptyEnvelope(new Date().toISOString()) };
  if (typeof raw !== "string") return { status: "error", code: STORAGE_ERROR.CORRUPT };
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return { status: "error", code: STORAGE_ERROR.CORRUPT };
  }
  if (!hasOwnDataFields(value, ENVELOPE_FIELDS) || !Number.isInteger(value.schemaVersion) ||
    !validTimestamp(value.updatedAt) || !isRecord(value.progressByDiagnosis) ||
    Object.getPrototypeOf(value.progressByDiagnosis) !== Object.prototype || !Array.isArray(value.results) ||
    !safeJsonValue(value.progressByDiagnosis) || !safeJsonValue(value.results)) {
    return { status: "error", code: STORAGE_ERROR.CORRUPT };
  }
  if (value.schemaVersion > 1) return { status: "error", code: STORAGE_ERROR.INCOMPATIBLE };
  if (value.schemaVersion !== 1) return { status: "error", code: STORAGE_ERROR.CORRUPT };
  return { status: "ok", envelope: clone(value) };
}

function readEnvelope(storage) {
  if (!storage || typeof storage.getItem !== "function") {
    return { status: "error", code: STORAGE_ERROR.UNAVAILABLE };
  }
  try {
    return parseEnvelope(storage.getItem(FORMAL_STORAGE_KEY));
  } catch {
    return { status: "error", code: STORAGE_ERROR.UNAVAILABLE };
  }
}

function progressError(candidate, definition, meta) {
  if (isRecord(candidate) && isRecord(candidate.versionTuple)) {
    try {
      const expected = createVersionTuple(meta);
      if (Object.keys(expected).some((field) => candidate.versionTuple[field] !== expected[field])) {
        return RESPONSE_ERROR.INCOMPATIBLE_PROGRESS;
      }
    } catch {
      // Fall through to a corrupt-storage result.
    }
  }
  return STORAGE_ERROR.CORRUPT;
}

function validateStoredTarget(envelope, definition, meta) {
  const candidate = envelope.progressByDiagnosis[definition.diagnosisId];
  if (candidate === undefined) return { status: "ok", progress: null };
  try {
    return { status: "ok", progress: validateProgressRecord(candidate, { definition, meta }) };
  } catch {
    return { status: "error", code: progressError(candidate, definition, meta) };
  }
}

export function loadProgress({ storage, definition, meta }) {
  const read = readEnvelope(storage);
  if (read.status === "error") return read;
  const target = validateStoredTarget(read.envelope, definition, meta);
  if (target.status === "error") return target;
  return { status: "ok", progress: target.progress };
}

export function saveProgress({ storage, progress, definition, meta, now = new Date().toISOString() }) {
  let validProgress;
  try {
    validProgress = validateProgressRecord(progress, { definition, meta });
  } catch {
    return { status: "error", code: RESPONSE_ERROR.INCOMPATIBLE_PROGRESS, progress };
  }
  const read = readEnvelope(storage);
  if (read.status === "error") return { ...read, progress: validProgress };
  const existing = validateStoredTarget(read.envelope, definition, meta);
  if (existing.status === "error") return { ...existing, progress: validProgress };
  if (!validTimestamp(now)) return { status: "error", code: STORAGE_ERROR.SAVE_FAILED, progress: validProgress };
  const nextEnvelope = {
    ...read.envelope,
    updatedAt: now,
    progressByDiagnosis: {
      ...read.envelope.progressByDiagnosis,
      [definition.diagnosisId]: validProgress,
    },
  };
  if (!storage || typeof storage.setItem !== "function") {
    return { status: "error", code: STORAGE_ERROR.SAVE_FAILED, progress: validProgress };
  }
  try {
    storage.setItem(FORMAL_STORAGE_KEY, JSON.stringify(nextEnvelope));
    return { status: "ok", progress: validProgress };
  } catch {
    return { status: "error", code: STORAGE_ERROR.SAVE_FAILED, progress: validProgress };
  }
}

export function discardProgress({ storage, diagnosisId, confirmed, now = new Date().toISOString() }) {
  if (!confirmed) return { status: "cancelled" };
  if (typeof diagnosisId !== "string" || diagnosisId.length === 0 || !validTimestamp(now)) {
    return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  }
  const read = readEnvelope(storage);
  if (read.status === "error") return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
  if (!storage || typeof storage.setItem !== "function") return { status: "error", code: STORAGE_ERROR.DELETE_FAILED };
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
