import assert from "node:assert/strict";
import test from "node:test";

import { appMeta } from "../js/config/app-meta.js";
import { DiagnosticDefinition, QuestionDefinitions } from "../js/data/diagnostic-definition.js";
import { answerCurrent, choosePreviewExit, createProgressRecord } from "../js/domain/response-state.js";
import { createResultSnapshot } from "../js/domain/result-snapshot.js";
import { scoreDiagnostic } from "../js/domain/scoring.js";
import {
  FORMAL_STORAGE_KEY,
  deleteAllData,
  deleteResultSnapshot,
  discardProgress,
  answerAndSave,
  loadResultHistory,
  loadProgress,
  saveResultSnapshot,
  saveProgress,
  transitionAndSave,
  updateResultPaletteSelection,
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

function validResult(resultId = "7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c003", mode = "detail50", completedAt = NOW) {
  const questionCount = mode === "preview20" ? 20 : 50;
  const questionDefinitions = questionCount === 20
    ? QuestionDefinitions.filter(({ id }) => DiagnosticDefinition.previewQuestionIds.includes(id))
    : QuestionDefinitions;
  const sections = mode === "preview20"
    ? ["titleSubtitle", "titleReason", ...Array(5).fill("observation")]
    : ["titleSubtitle", "titleReason", ...["observation", "strength", "tradeoff", "work", "relationship", "stress", "question", "action"].flatMap((section) => Array(5).fill(section))];
  const factorIds = ["intellectImagination", "conscientiousness", "extraversion", "agreeableness", "emotionalStability"];
  return createResultSnapshot({
    resultId,
    completedAt,
    questionCount,
    mode,
    versionTuple: progress().versionTuple,
    resultModel: {
      factors: scoreDiagnostic({ questionDefinitions, answers: Object.fromEntries(questionDefinitions.map(({ id }) => [id, 3])), questionCount }),
      titleId: "title-retained",
      characterId: "character-retained",
      boundaryFlags: [],
      renderedTexts: sections.map((section, index) => ({
        id: index === 0 ? "title-retained-subtitle" : index === 1 ? "title-retained-reason" : `${mode}-${factorIds[(index - 2) % 5]}-middle-${section}`,
        version: progress().versionTuple.resultTextVersion,
        section,
        text: `text-${index}`,
        evidenceRefs: [`evidence-${index}`],
      })),
    },
    characterAssetVersion: "character-retained-asset-v1",
    selectedPaletteId: "palette-retained",
    cardTemplateVersion: "card-template-v1",
  });
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
    results: [validResult(), { ...validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c004"), answers: {} }],
  }));
  assert.equal(saveProgress({ storage, progress: progress(), definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T03:00:00.000Z" }).status, "ok");
  const persisted = JSON.parse(storage.read());
  assert.ok(persisted.progressByDiagnosis["unrelated-diagnosis"]);
  assert.equal(persisted.progressByDiagnosis["bad-diagnosis"], undefined);
  assert.deepEqual(persisted.results, [validResult()]);
  assert.deepEqual(loadProgress({ storage: memoryStorage(), definition: DiagnosticDefinition, meta: appMeta, now: "2026-02-30T00:00:00.000Z" }), { status: "error", code: "STORAGE_CORRUPT" });
});

test("T-005 T-006 F-005 F-006 saves preview snapshots idempotently without exposing progress or answers", () => {
  const storage = memoryStorage();
  const snapshot = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c010", "preview20");
  const first = saveResultSnapshot({ storage, snapshot, diagnosisId: DiagnosticDefinition.diagnosisId, definition: DiagnosticDefinition, meta: appMeta, now: NOW });
  const duplicate = saveResultSnapshot({ storage, snapshot: structuredClone(snapshot), diagnosisId: DiagnosticDefinition.diagnosisId, definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:01:00.000Z" });

  assert.deepEqual(first, { status: "ok", result: snapshot, duplicate: false });
  assert.deepEqual(duplicate, { status: "ok", result: snapshot, duplicate: true });
  assert.equal(JSON.parse(storage.read()).results.length, 1);
  assert.equal(Object.hasOwn(first, "progress"), false);
  assert.equal(JSON.stringify(first).includes("answers"), false);
});

test("T-005 T-006 F-009 F-013 completes detail save and progress removal atomically, including duplicate cleanup", () => {
  const snapshot = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c011");
  const storage = memoryStorage(JSON.stringify({
    schemaVersion: 1, updatedAt: NOW,
    progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: progress() }, results: [],
  }));
  assert.deepEqual(saveResultSnapshot({ storage, snapshot, diagnosisId: DiagnosticDefinition.diagnosisId, definition: DiagnosticDefinition, meta: appMeta, now: NOW }), {
    status: "ok", result: snapshot, duplicate: false,
  });
  assert.equal(JSON.parse(storage.read()).progressByDiagnosis[DiagnosticDefinition.diagnosisId], undefined);

  const leftover = JSON.parse(storage.read());
  leftover.progressByDiagnosis[DiagnosticDefinition.diagnosisId] = progress();
  storage.setItem(FORMAL_STORAGE_KEY, JSON.stringify(leftover));
  assert.deepEqual(saveResultSnapshot({ storage, snapshot, diagnosisId: DiagnosticDefinition.diagnosisId, definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:01:00.000Z" }), {
    status: "ok", result: snapshot, duplicate: true,
  });
  assert.equal(JSON.parse(storage.read()).progressByDiagnosis[DiagnosticDefinition.diagnosisId], undefined);
});

test("T-005 T-006 maps collision and write failures without losing a visible detail result", () => {
  const snapshot = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c012");
  const collision = structuredClone(snapshot);
  collision.selectedPaletteId = "palette-other";
  const collisionStorage = memoryStorage(JSON.stringify({
    schemaVersion: 1, updatedAt: NOW,
    progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: progress() }, results: [collision],
  }));
  const collisionResult = saveResultSnapshot({ storage: collisionStorage, snapshot, diagnosisId: DiagnosticDefinition.diagnosisId, definition: DiagnosticDefinition, meta: appMeta, now: NOW });
  assert.deepEqual(collisionResult, { status: "error", code: "STORAGE_CORRUPT", result: snapshot, cleanup: { status: "ok" } });
  assert.equal(JSON.parse(collisionStorage.read()).progressByDiagnosis[DiagnosticDefinition.diagnosisId], undefined);

  let writes = 0;
  const initialFailure = {
    getItem: () => JSON.stringify({ schemaVersion: 1, updatedAt: NOW, progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: progress() }, results: [] }),
    setItem: () => { writes += 1; if (writes === 1) throw new Error("quota"); },
  };
  assert.deepEqual(saveResultSnapshot({ storage: initialFailure, snapshot, diagnosisId: DiagnosticDefinition.diagnosisId, definition: DiagnosticDefinition, meta: appMeta, now: NOW }), {
    status: "error", code: "STORAGE_SAVE_FAILED", result: snapshot, cleanup: { status: "ok" },
  });
  assert.equal(writes, 2);
});

test("T-005 T-006 rejects invalid snapshot or operation metadata as corrupt without cleanup", () => {
  const snapshot = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c013");
  const storage = memoryStorage();
  for (const params of [
    { snapshot: { ...snapshot, answers: {} }, diagnosisId: DiagnosticDefinition.diagnosisId, now: NOW },
    { snapshot, diagnosisId: "", now: NOW },
    { snapshot, diagnosisId: DiagnosticDefinition.diagnosisId, now: "invalid" },
  ]) {
    assert.deepEqual(saveResultSnapshot({ storage, definition: DiagnosticDefinition, meta: appMeta, ...params }), { status: "error", code: "STORAGE_CORRUPT" });
  }
  assert.equal(storage.read(), null);
});

test("T-005 T-006 refuses a corrupt or incompatible target ProgressRecord without writing or cleanup", () => {
  const snapshot = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c014");
  const cases = [
    ["corrupt", { broken: true }, "STORAGE_CORRUPT"],
    ["incompatible", { ...progress(), versionTuple: { ...progress().versionTuple, appVersion: "mvp-9.9.9" } }, "PROGRESS_INCOMPATIBLE"],
  ];
  for (const [label, target, code] of cases) {
    const raw = JSON.stringify({
      schemaVersion: 1, updatedAt: NOW,
      progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: target }, results: [],
    });
    let writes = 0;
    const storage = {
      getItem: () => raw,
      setItem: () => { writes += 1; },
    };
    assert.deepEqual(saveResultSnapshot({ storage, snapshot, diagnosisId: DiagnosticDefinition.diagnosisId, definition: DiagnosticDefinition, meta: appMeta, now: NOW }), {
      status: "error", code, result: snapshot,
    }, label);
    assert.equal(writes, 0, label);
  }
});

test("T-005 T-006 leaves a future envelope untouched and reports unsafe detail cleanup", () => {
  const snapshot = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c015");
  const raw = JSON.stringify({ schemaVersion: 2, updatedAt: NOW, progressByDiagnosis: {}, results: [] });
  let writes = 0;
  const storage = {
    getItem: () => raw,
    setItem: () => { writes += 1; },
  };
  assert.deepEqual(saveResultSnapshot({ storage, snapshot, diagnosisId: DiagnosticDefinition.diagnosisId, definition: DiagnosticDefinition, meta: appMeta, now: NOW }), {
    status: "error", code: "STORAGE_INCOMPATIBLE", result: snapshot,
    cleanup: { status: "error", code: "STORAGE_DELETE_FAILED" },
  });
  assert.equal(writes, 0);
});

test("T-005 F-018 updates one result palette without rewriting surrounding records", () => {
  const untouched = validResult(
    "7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c030",
    "detail50",
    "2026-07-24T00:00:00.000Z",
  );
  const target = validResult(
    "7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c031",
    "detail50",
    "2026-07-25T00:00:00.000Z",
  );
  const futureRecord = {
    futureSchema: 2,
    resultId: "7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c032",
    payload: { retained: true },
  };
  const initialEnvelope = {
    schemaVersion: 1,
    updatedAt: NOW,
    progressByDiagnosis: {
      "unrelated-diagnosis": { ...progress(), diagnosisId: "unrelated-diagnosis" },
    },
    results: [untouched, futureRecord, target],
  };
  const storage = memoryStorage(JSON.stringify(initialEnvelope));

  const outcome = updateResultPaletteSelection({
    storage,
    resultId: target.resultId,
    paletteId: "palette-alternative-1",
    allowedPaletteIds: [
      "palette-retained",
      "palette-alternative-1",
      "palette-alternative-2",
    ],
    now: "2026-07-25T00:01:00.000Z",
  });
  const persisted = JSON.parse(storage.read());

  assert.equal(outcome.status, "ok");
  assert.equal(outcome.snapshot.selectedPaletteId, "palette-alternative-1");
  assert.deepEqual(persisted.results[0], initialEnvelope.results[0]);
  assert.deepEqual(persisted.results[1], initialEnvelope.results[1]);
  assert.deepEqual(
    {
      ...persisted.results[2],
      selectedPaletteId: target.selectedPaletteId,
    },
    target,
  );
  assert.deepEqual(
    persisted.progressByDiagnosis,
    initialEnvelope.progressByDiagnosis,
  );
  assert.equal(persisted.updatedAt, "2026-07-25T00:01:00.000Z");
});

test("T-005 F-018 refuses invalid or absent palette targets without writing", () => {
  const target = validResult(
    "7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c033",
  );
  const raw = JSON.stringify({
    schemaVersion: 1,
    updatedAt: NOW,
    progressByDiagnosis: {},
    results: [target],
  });

  for (const input of [
    {
      resultId: target.resultId,
      paletteId: "palette-unknown",
      allowedPaletteIds: [
        "palette-retained",
        "palette-alternative-1",
        "palette-alternative-2",
      ],
    },
    {
      resultId: "7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c034",
      paletteId: "palette-alternative-1",
      allowedPaletteIds: [
        "palette-retained",
        "palette-alternative-1",
        "palette-alternative-2",
      ],
    },
  ]) {
    const storage = memoryStorage(raw);
    assert.equal(updateResultPaletteSelection({
      storage,
      now: "2026-07-25T00:01:00.000Z",
      ...input,
    }).status, "error");
    assert.equal(storage.read(), raw);
  }
});

test("T-005 T-006 reports both initial detail write and safe cleanup write failures", () => {
  const snapshot = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c016");
  let writes = 0;
  const storage = {
    getItem: () => JSON.stringify({ schemaVersion: 1, updatedAt: NOW, progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: progress() }, results: [] }),
    setItem: () => { writes += 1; throw new Error("quota"); },
  };
  assert.deepEqual(saveResultSnapshot({ storage, snapshot, diagnosisId: DiagnosticDefinition.diagnosisId, definition: DiagnosticDefinition, meta: appMeta, now: NOW }), {
    status: "error", code: "STORAGE_SAVE_FAILED", result: snapshot,
    cleanup: { status: "error", code: "STORAGE_DELETE_FAILED" },
  });
  assert.equal(writes, 2);
});

test("T-005 T-006 preserves a valid preview ProgressRecord and writes detail completion once", () => {
  const previewSnapshot = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c017", "preview20");
  const previewStorage = memoryStorage(JSON.stringify({
    schemaVersion: 1, updatedAt: NOW,
    progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: progress() }, results: [],
  }));
  assert.equal(saveResultSnapshot({ storage: previewStorage, snapshot: previewSnapshot, diagnosisId: DiagnosticDefinition.diagnosisId, definition: DiagnosticDefinition, meta: appMeta, now: NOW }).status, "ok");
  assert.deepEqual(JSON.parse(previewStorage.read()).progressByDiagnosis[DiagnosticDefinition.diagnosisId], progress());

  const detailSnapshot = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c018");
  let stored = JSON.stringify({
    schemaVersion: 1, updatedAt: NOW,
    progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: progress() }, results: [],
  });
  let writes = 0;
  const detailStorage = {
    getItem: () => stored,
    setItem: (_key, value) => { writes += 1; stored = value; },
  };
  assert.equal(saveResultSnapshot({ storage: detailStorage, snapshot: detailSnapshot, diagnosisId: DiagnosticDefinition.diagnosisId, definition: DiagnosticDefinition, meta: appMeta, now: NOW }).status, "ok");
  assert.equal(writes, 1);
  assert.equal(JSON.parse(stored).progressByDiagnosis[DiagnosticDefinition.diagnosisId], undefined);
  assert.equal(JSON.parse(stored).results.length, 1);
});

test("T-006 F-009 loads an isolated newest-first history without rewriting storage", () => {
  const oldest = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c021", "detail50", "2026-07-24T23:00:00.000Z");
  const sameTimeLaterId = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c023", "preview20", "2026-07-25T09:00:00.000+09:00");
  const sameTimeFirstId = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c022", "detail50", "2026-07-25T00:00:00.000Z");
  let writes = 0;
  const raw = JSON.stringify({
    schemaVersion: 1, updatedAt: NOW, progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: progress() },
    results: [oldest, { broken: true }, sameTimeLaterId, sameTimeFirstId],
  });
  const storage = {
    getItem: () => raw,
    setItem: () => { writes += 1; },
  };

  const loaded = loadResultHistory({ storage, now: NOW });

  assert.equal(loaded.status, "ok");
  assert.deepEqual(loaded.results.map(({ resultId }) => resultId), [sameTimeFirstId.resultId, sameTimeLaterId.resultId, oldest.resultId]);
  assert.equal(writes, 0);
  assert.equal(Object.isFrozen(loaded.results), true);
  assert.equal(Object.isFrozen(loaded.results[0]), true);
  assert.equal(Object.hasOwn(loaded.results[0], "answers"), false);
  assert.equal(Object.hasOwn(loaded, "progressByDiagnosis"), false);
});

test("T-006 F-009 returns the existing read error for malformed or future history envelopes", () => {
  for (const [raw, code] of [
    ["{", "STORAGE_CORRUPT"],
    [JSON.stringify({ schemaVersion: 2, updatedAt: NOW, progressByDiagnosis: {}, results: [] }), "STORAGE_INCOMPATIBLE"],
  ]) {
    assert.deepEqual(loadResultHistory({ storage: memoryStorage(raw), now: NOW }), { status: "error", code });
  }
});

test("T-006 F-013 deletes exactly one valid matching ResultSnapshot and retains generic progress", () => {
  const target = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c024");
  const retained = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c025", "preview20");
  const invalidSameId = { resultId: target.resultId, broken: true };
  const invalidOther = { broken: true };
  let raw = JSON.stringify({
    schemaVersion: 1, updatedAt: NOW,
    progressByDiagnosis: { unrelated: { ...progress(), diagnosisId: "unrelated" }, invalid: { bad: true } },
    results: [invalidSameId, retained, target, invalidOther],
  });
  let writes = 0;
  const storage = {
    getItem: () => raw,
    setItem: (_key, value) => { writes += 1; raw = value; },
  };

  assert.deepEqual(deleteResultSnapshot({ storage, resultId: target.resultId, confirmed: true, now: "2026-07-25T00:02:00.000Z" }), {
    status: "ok", deleted: true,
  });
  const persisted = JSON.parse(raw);
  assert.equal(writes, 1);
  assert.deepEqual(persisted.results, [invalidSameId, retained, invalidOther]);
  assert.ok(persisted.progressByDiagnosis.unrelated);
  assert.deepEqual(persisted.progressByDiagnosis.invalid, { bad: true });
});

test("T-006 F-013 cancellation, a missing or invalid target, and unsafe envelopes never write", () => {
  const retained = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c026");
  const safeRaw = JSON.stringify({ schemaVersion: 1, updatedAt: NOW, progressByDiagnosis: {}, results: [retained] });
  const futureRaw = JSON.stringify({ schemaVersion: 2, updatedAt: NOW, progressByDiagnosis: {}, results: [] });
  for (const [raw, args, expected] of [
    [safeRaw, { resultId: retained.resultId, confirmed: false, now: NOW }, { status: "cancelled" }],
    [safeRaw, { resultId: "7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c027", confirmed: true, now: NOW }, { status: "ok", deleted: false }],
    [safeRaw, { resultId: "not-a-uuid", confirmed: true, now: NOW }, { status: "error", code: "STORAGE_DELETE_FAILED" }],
    [futureRaw, { resultId: retained.resultId, confirmed: true, now: NOW }, { status: "error", code: "STORAGE_DELETE_FAILED" }],
  ]) {
    let writes = 0;
    const storage = { getItem: () => raw, setItem: () => { writes += 1; } };
    assert.deepEqual(deleteResultSnapshot({ storage, ...args }), expected);
    assert.equal(writes, 0);
  }
});

test("T-006 F-013 maps unavailable and write-failed result deletion to STORAGE_DELETE_FAILED", () => {
  const target = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c028");
  const raw = JSON.stringify({ schemaVersion: 1, updatedAt: NOW, progressByDiagnosis: {}, results: [target] });
  assert.deepEqual(deleteResultSnapshot({
    storage: { getItem: () => { throw new Error("denied"); } }, resultId: target.resultId, confirmed: true, now: NOW,
  }), { status: "error", code: "STORAGE_DELETE_FAILED" });
  assert.deepEqual(deleteResultSnapshot({
    storage: { getItem: () => raw, setItem: () => { throw new Error("quota"); } }, resultId: target.resultId, confirmed: true, now: NOW,
  }), { status: "error", code: "STORAGE_DELETE_FAILED" });
});

test("T-006 F-015 deletes all progress and results only after confirmation", () => {
  const snapshot = validResult("7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c029");
  let raw = JSON.stringify({ schemaVersion: 1, updatedAt: NOW, progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: progress() }, results: [snapshot] });
  let writes = 0;
  const storage = { getItem: () => raw, setItem: (_key, value) => { writes += 1; raw = value; } };

  assert.deepEqual(deleteAllData({ storage, confirmed: false, now: NOW }), { status: "cancelled" });
  assert.equal(writes, 0);
  assert.deepEqual(deleteAllData({ storage, confirmed: true, now: "2026-07-25T00:03:00.000Z" }), { status: "ok" });
  assert.equal(writes, 1);
  assert.deepEqual(JSON.parse(raw), {
    schemaVersion: 1, updatedAt: "2026-07-25T00:03:00.000Z", progressByDiagnosis: {}, results: [],
  });
});

test("T-006 F-015 preserves malformed, future, unavailable, and write-failed all-data storage", () => {
  const malformed = "{";
  const future = JSON.stringify({ schemaVersion: 2, updatedAt: NOW, progressByDiagnosis: {}, results: [] });
  for (const raw of [malformed, future]) {
    let writes = 0;
    assert.deepEqual(deleteAllData({ storage: { getItem: () => raw, setItem: () => { writes += 1; } }, confirmed: true, now: NOW }), {
      status: "error", code: "STORAGE_DELETE_FAILED",
    });
    assert.equal(writes, 0);
  }
  assert.deepEqual(deleteAllData({ storage: { getItem: () => null, setItem: () => { throw new Error("quota"); } }, confirmed: true, now: NOW }), {
    status: "error", code: "STORAGE_DELETE_FAILED",
  });
});
