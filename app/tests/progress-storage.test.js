import assert from "node:assert/strict";
import test from "node:test";

import { appMeta } from "../js/config/app-meta.js";
import { DiagnosticDefinition, QuestionDefinitions } from "../js/data/diagnostic-definition.js";
import { answerCurrent, choosePreviewExit, createProgressRecord } from "../js/domain/response-state.js";
import { scoreDiagnostic } from "../js/domain/scoring.js";
import {
  FORMAL_STORAGE_KEY,
  discardProgress,
  answerAndSave,
  loadProgress,
  saveProgress,
  transitionAndSave,
} from "../js/infrastructure/progress-storage.js";

const NOW = "2026-07-25T00:00:00.000Z";
const PROGRESS_ID = "7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c002";

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
    progressId: PROGRESS_ID,
    now: NOW,
  });
}

function validResult() {
  return {
    resultId: "7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c003",
    diagnosisId: "unrelated-diagnosis",
    completedAt: NOW,
    questionCount: 50,
    mode: "detail50",
    versionTuple: progress().versionTuple,
    factors: scoreDiagnostic({ questionDefinitions: QuestionDefinitions, answers: Object.fromEntries(QuestionDefinitions.map(({ id }) => [id, 3])), questionCount: 50 }),
    titleId: "title-retained",
    characterId: "character-retained",
    characterAssetVersion: "character-manifest-v1",
    boundaryFlags: [],
    renderedTexts: [],
    selectedPaletteId: "palette-retained",
    cardTemplateVersion: "card-template-v1",
  };
}

test("T-004 F-004 saves and resumes only valid current fixed-question progress while preserving unrelated records", () => {
  const storage = memoryStorage(JSON.stringify({
    schemaVersion: 1,
    updatedAt: NOW,
    progressByDiagnosis: {
      "unrelated-diagnosis": { ...progress(), diagnosisId: "unrelated-diagnosis" },
    },
    results: [validResult()],
  }));

  const saved = saveProgress({ storage, progress: progress(), definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:01:00.000Z" });
  const resumed = loadProgress({ storage, definition: DiagnosticDefinition, meta: appMeta });
  const persisted = JSON.parse(storage.read());

  assert.equal(saved.status, "ok");
  assert.equal(resumed.status, "ok");
  assert.equal(resumed.progress.progressId, PROGRESS_ID);
  assert.equal(persisted.progressByDiagnosis["unrelated-diagnosis"].progressId, PROGRESS_ID);
  assert.deepEqual(persisted.results, [validResult()]);
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

test("T-004 F-004 persists every transition including terminal completion without losing in-memory state on save failure", () => {
  const storage = memoryStorage();
  const first = answerAndSave({
    storage, progress: progress(), answer: { questionId: DiagnosticDefinition.previewQuestionIds[0], value: 2 },
    definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:01:00.000Z",
  });
  assert.equal(first.kind, "in-progress");
  assert.equal(first.persistence.status, "ok");
  assert.equal(JSON.parse(storage.read()).progressByDiagnosis[DiagnosticDefinition.diagnosisId].currentIndex, 1);

  let state = first.progress;
  for (let index = 1; index < 20; index += 1) {
    state = answerCurrent(state, { questionId: DiagnosticDefinition.previewQuestionIds[index], value: 3 }, { definition: DiagnosticDefinition, meta: appMeta, now: `2026-07-25T00:${String(index + 1).padStart(2, "0")}:00.000Z` }).progress;
  }
  state = choosePreviewExit(state, "continueHidden", { definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:21:00.000Z" }).progress;
  for (let index = 20; index < 50; index += 1) {
    const event = answerCurrent(state, { questionId: DiagnosticDefinition.detailQuestionIds[index], value: 3 }, { definition: DiagnosticDefinition, meta: appMeta, now: `2026-07-25T01:${String(index - 20).padStart(2, "0")}:00.000Z` });
    state = event.progress;
    if (event.kind === "detail-complete") {
      const persisted = transitionAndSave({ storage, transition: event, definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T01:30:00.000Z" });
      assert.equal(persisted.persistence.status, "ok");
      assert.equal(persisted.progress.currentIndex, 49);
      assert.equal(Object.keys(JSON.parse(storage.read()).progressByDiagnosis[DiagnosticDefinition.diagnosisId].answers).length, 50);
    }
  }

  const quota = { getItem: () => null, setItem: () => { throw new Error("quota"); } };
  const failed = answerAndSave({ storage: quota, progress: progress(), answer: { questionId: DiagnosticDefinition.previewQuestionIds[0], value: 2 }, definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T02:00:00.000Z" });
  assert.equal(failed.kind, "in-progress");
  assert.equal(failed.progress.currentIndex, 1);
  assert.equal(failed.persistence.code, "STORAGE_SAVE_FAILED");
});

test("T-004 F-004 sanitizes only invalid unrelated records during write and rejects impossible empty-envelope timestamps", () => {
  const storage = memoryStorage(JSON.stringify({
    schemaVersion: 1,
    updatedAt: NOW,
    progressByDiagnosis: {
      "unrelated-diagnosis": { ...progress(), diagnosisId: "unrelated-diagnosis" },
      "bad-diagnosis": { progressId: "not-a-uuid" },
    },
    results: [validResult(), { ...validResult(), resultId: "7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c004", answers: {} }],
  }));
  assert.equal(saveProgress({ storage, progress: progress(), definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T03:00:00.000Z" }).status, "ok");
  const persisted = JSON.parse(storage.read());
  assert.ok(persisted.progressByDiagnosis["unrelated-diagnosis"]);
  assert.equal(persisted.progressByDiagnosis["bad-diagnosis"], undefined);
  assert.deepEqual(persisted.results, [validResult()]);
  assert.deepEqual(loadProgress({ storage: memoryStorage(), definition: DiagnosticDefinition, meta: appMeta, now: "2026-02-30T00:00:00.000Z" }), { status: "error", code: "STORAGE_CORRUPT" });
});
