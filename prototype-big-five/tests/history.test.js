import test from "node:test";
import assert from "node:assert/strict";
import {
  canCompare,
  compareResults,
  clearHistory,
  deleteResult,
  loadStore,
  saveProgress,
  saveResult,
} from "../history.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

const base = {
  instrumentId: "sample-big-five",
  instrumentVersion: "sample-v1",
  scoringVersion: "sample-v1",
  resultContentVersion: "sample-v1",
  mode: "manual",
};

test("saveResult prepends a result without persisting answers", () => {
  const storage = memoryStorage();
  const result = { ...base, id: "one", answerCount: 20, scores: { O: 50 }, answers: [1] };
  saveResult(storage, result);
  const store = loadStore(storage);
  assert.equal(store.history[0].id, "one");
  assert.equal("answers" in store.history[0], false);
  assert.deepEqual(result.answers, [1]);
});

test("loadStore returns an empty store for malformed JSON", () => {
  const storage = memoryStorage();
  storage.setItem("bigFivePrototype:v1", "{");
  assert.deepEqual(loadStore(storage), { inProgress: null, history: [] });
});

test("loadStore normalizes malformed shapes and history entries", () => {
  const storage = memoryStorage();
  storage.setItem("bigFivePrototype:v1", JSON.stringify({
    inProgress: "stale",
    history: [null, "stale", [], { id: "safe", answers: [1], scores: { O: 50 } }],
  }));
  assert.deepEqual(loadStore(storage), {
    inProgress: null,
    history: [{ id: "safe", scores: { O: 50 } }],
  });
});

test("saveProgress preserves sanitized history without re-persisting answers", () => {
  const storage = memoryStorage();
  storage.setItem("bigFivePrototype:v1", JSON.stringify({
    inProgress: null,
    history: [{ id: "prior", answers: [1], scores: { O: 50 } }],
  }));
  saveProgress(storage, { answers: [2], currentIndex: 1, startedAt: "now", mode: "manual" });
  assert.deepEqual(loadStore(storage), {
    inProgress: { answers: [2], currentIndex: 1, startedAt: "now", mode: "manual" },
    history: [{ id: "prior", scores: { O: 50 } }],
  });
});

test("deleteResult preserves in-progress data and ignores malformed history entries", () => {
  const storage = memoryStorage();
  storage.setItem("bigFivePrototype:v1", JSON.stringify({
    inProgress: { answers: [3], currentIndex: 1, startedAt: "now", mode: "manual" },
    history: [null, { id: "remove" }, { id: "keep" }],
  }));
  deleteResult(storage, "remove");
  assert.deepEqual(loadStore(storage), {
    inProgress: { answers: [3], currentIndex: 1, startedAt: "now", mode: "manual" },
    history: [{ id: "keep" }],
  });
});

test("clearHistory resets both progress and history", () => {
  const storage = memoryStorage();
  saveProgress(storage, { answers: [1], currentIndex: 1, startedAt: "now", mode: "manual" });
  saveResult(storage, { ...base, id: "one", answerCount: 20, scores: { O: 50 } });
  clearHistory(storage);
  assert.deepEqual(loadStore(storage), { inProgress: null, history: [] });
});

test("20 and 50 item results cannot be compared", () => {
  assert.equal(
    canCompare(
      { ...base, answerCount: 20 },
      { ...base, answerCount: 50 },
    ).ok,
    false,
  );
});

test("compatible results produce factor deltas", () => {
  const left = { ...base, answerCount: 20, scores: { O: 25, C: 50, E: 75, A: 50, N: 25 } };
  const right = { ...base, answerCount: 20, scores: { O: 50, C: 25, E: 75, A: 75, N: 50 } };
  assert.deepEqual(compareResults(left, right), { O: 25, C: -25, E: 0, A: 25, N: 25 });
});
test("two legacy results missing all comparison metadata cannot be compared", () => {
  const scores = { O: 25, C: 50, E: 75, A: 50, N: 25 };
  const left = { answerCount: 20, scores };
  const right = { answerCount: 20, scores };

  assert.equal(canCompare(left, right).ok, false);
  assert.throws(() => compareResults(left, right), TypeError);
});

test("results with partially missing comparison metadata cannot be compared", () => {
  const scores = { O: 25, C: 50, E: 75, A: 50, N: 25 };
  const left = { ...base, answerCount: 20, scores };
  const right = { ...base, answerCount: 20, scores };
  delete right.scoringVersion;

  assert.equal(canCompare(left, right).ok, false);
  assert.throws(() => compareResults(left, right), TypeError);
});

test("comparison rejects invalid answer counts and incomplete scores while current results remain valid", () => {
  const scores = { O: 25, C: 50, E: 75, A: 50, N: 25 };
  const validLeft = { ...base, answerCount: 20, scores };
  const validRight = { ...base, answerCount: 20, scores: { ...scores, O: 50 } };

  assert.equal(canCompare(validLeft, validRight).ok, true);
  assert.equal(canCompare({ ...validLeft, answerCount: 30 }, validRight).ok, false);
  assert.equal(canCompare({ ...validLeft, scores: { O: 25 } }, validRight).ok, false);
});
