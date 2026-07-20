import test from "node:test";
import assert from "node:assert/strict";
import { compareResults } from "../history.js";
import { orderSelectedResultsChronologically } from "../comparison-order.js";

const base = {
  answerCount: 20,
  instrumentId: "sample-big-five",
  instrumentVersion: "sample-v1",
  scoringVersion: "sample-v1",
  resultContentVersion: "sample-v1",
  mode: "manual",
};

const older = {
  ...base,
  id: "older",
  completedAt: "2026-07-01T09:00:00.000Z",
  title: "古い結果",
  scores: { O: 25, C: 50, E: 50, A: 50, N: 50 },
};

const newer = {
  ...base,
  id: "newer",
  completedAt: "2026-07-02T09:00:00.000Z",
  title: "新しい結果",
  scores: { O: 75, C: 50, E: 50, A: 50, N: 50 },
};

test("newest-first selection is normalized to chronological previous and current", () => {
  const [previous, current] = orderSelectedResultsChronologically(
    [newer, older],
    ["newer", "older"],
  );

  assert.equal(previous.title, "古い結果");
  assert.equal(current.title, "新しい結果");
  assert.equal(compareResults(previous, current).O, 50);
});

test("oldest-first selection produces the same chronological labels and delta", () => {
  const [previous, current] = orderSelectedResultsChronologically(
    [newer, older],
    ["older", "newer"],
  );

  assert.equal(previous.title, "古い結果");
  assert.equal(current.title, "新しい結果");
  assert.equal(compareResults(previous, current).O, 50);
});

test("equal or invalid timestamps fall back to deterministic persisted history order", () => {
  const invalidNewer = { ...newer, completedAt: "invalid" };
  const invalidOlder = { ...older, completedAt: "invalid" };

  assert.deepEqual(
    orderSelectedResultsChronologically(
      [invalidNewer, invalidOlder],
      ["newer", "older"],
    ).map((result) => result.id),
    ["older", "newer"],
  );
});
