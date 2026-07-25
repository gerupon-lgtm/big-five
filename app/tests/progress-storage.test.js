import assert from "node:assert/strict";
import test from "node:test";

import { appMeta } from "../js/config/app-meta.js";
import { DiagnosticDefinition } from "../js/data/diagnostic-definition.js";
import { createProgressRecord } from "../js/domain/response-state.js";
import {
  FORMAL_STORAGE_KEY,
  discardProgress,
  loadProgress,
  saveProgress,
} from "../js/infrastructure/progress-storage.js";

const NOW = "2026-07-25T00:00:00.000Z";

function memoryStorage(initial = null) {
  let value = initial;
  return {
    getItem(key) {
      assert.equal(key, FORMAL_STORAGE_KEY);
      return value;
    },
    setItem(key, next) {
      assert.equal(key, FORMAL_STORAGE_KEY);
      value = next;
    },
    read() {
      return value;
    },
  };
}

function progress() {
  return createProgressRecord({
    definition: DiagnosticDefinition,
    meta: appMeta,
    progressId: "resume-1",
    now: NOW,
  });
}

test("T-004 F-004 saves and resumes only valid current fixed-question progress while preserving unrelated records", () => {
  const storage = memoryStorage(JSON.stringify({
    schemaVersion: 1,
    updatedAt: NOW,
    progressByDiagnosis: {
      "unrelated-diagnosis": { retained: true },
    },
    results: [{ resultId: "retained-result" }],
  }));

  const saved = saveProgress({ storage, progress: progress(), definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:01:00.000Z" });
  const resumed = loadProgress({ storage, definition: DiagnosticDefinition, meta: appMeta });
  const persisted = JSON.parse(storage.read());

  assert.equal(saved.status, "ok");
  assert.equal(resumed.status, "ok");
  assert.equal(resumed.progress.progressId, "resume-1");
  assert.deepEqual(persisted.progressByDiagnosis["unrelated-diagnosis"], { retained: true });
  assert.deepEqual(persisted.results, [{ resultId: "retained-result" }]);
});

test("T-004 F-004 reports malformed, future, corrupt, and version-mismatched storage without overwriting it", () => {
  const cases = [
    ["{", "STORAGE_CORRUPT"],
    [JSON.stringify({ schemaVersion: 2, updatedAt: NOW, progressByDiagnosis: {}, results: [] }), "STORAGE_INCOMPATIBLE"],
    [JSON.stringify({ schemaVersion: 1, updatedAt: NOW, progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: { broken: true } }, results: [] }), "STORAGE_CORRUPT"],
    [JSON.stringify({
      schemaVersion: 1,
      updatedAt: NOW,
      progressByDiagnosis: {
        [DiagnosticDefinition.diagnosisId]: { ...progress(), versionTuple: { ...progress().versionTuple, appVersion: "mvp-9.9.9" } },
      },
      results: [],
    }), "PROGRESS_INCOMPATIBLE"],
  ];

  for (const [raw, code] of cases) {
    const storage = memoryStorage(raw);
    const loaded = loadProgress({ storage, definition: DiagnosticDefinition, meta: appMeta });
    const saved = saveProgress({ storage, progress: progress(), definition: DiagnosticDefinition, meta: appMeta, now: NOW });

    assert.deepEqual(loaded, { status: "error", code });
    assert.equal(saved.status, "error");
    assert.equal(storage.read(), raw);
  }
});

test("T-004 F-004 F-013 tolerates unavailable or quota storage and requires confirmation for targeted discard", () => {
  const unavailable = {
    getItem() { throw new Error("denied"); },
    setItem() { throw new Error("denied"); },
  };
  const quota = {
    getItem() { return null; },
    setItem() { throw new Error("quota"); },
  };
  const storage = memoryStorage(JSON.stringify({
    schemaVersion: 1,
    updatedAt: NOW,
    progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: progress() },
    results: [],
  }));

  assert.deepEqual(loadProgress({ storage: unavailable, definition: DiagnosticDefinition, meta: appMeta }), {
    status: "error", code: "STORAGE_UNAVAILABLE",
  });
  assert.deepEqual(saveProgress({ storage: quota, progress: progress(), definition: DiagnosticDefinition, meta: appMeta, now: NOW }), {
    status: "error", code: "STORAGE_SAVE_FAILED", progress: progress(),
  });
  assert.deepEqual(discardProgress({ storage, diagnosisId: DiagnosticDefinition.diagnosisId, confirmed: false, now: NOW }), {
    status: "cancelled",
  });
  assert.ok(JSON.parse(storage.read()).progressByDiagnosis[DiagnosticDefinition.diagnosisId]);
  assert.deepEqual(discardProgress({ storage, diagnosisId: DiagnosticDefinition.diagnosisId, confirmed: true, now: NOW }), {
    status: "ok",
  });
  assert.equal(JSON.parse(storage.read()).progressByDiagnosis[DiagnosticDefinition.diagnosisId], undefined);
});

test("T-004 F-013 reports deletion failure and retains the target progress", () => {
  const original = JSON.stringify({
    schemaVersion: 1,
    updatedAt: NOW,
    progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: progress() },
    results: [],
  });
  const storage = {
    getItem() { return original; },
    setItem() { throw new Error("denied"); },
  };

  assert.deepEqual(discardProgress({ storage, diagnosisId: DiagnosticDefinition.diagnosisId, confirmed: true, now: NOW }), {
    status: "error", code: "STORAGE_DELETE_FAILED",
  });
});
