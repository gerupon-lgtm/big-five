import test from "node:test";
import assert from "node:assert/strict";
import {
  canCompare,
  compareResults,
  loadStore,
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
  saveResult(storage, { ...base, id: "one", answerCount: 20, scores: { O: 50 }, answers: [1] });
  const store = loadStore(storage);
  assert.equal(store.history[0].id, "one");
  assert.equal("answers" in store.history[0], false);
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
