import test from "node:test";
import assert from "node:assert/strict";
import { buildResultModel } from "../sample-results.js";
import { radarPoints } from "../radar-chart.js";

test("result model names the two strongest profile factors", () => {
  const model = buildResultModel({
    answerCount: 20,
    scores: { O: 82, C: 68, E: 41, A: 74, N: 57 },
  });
  assert.equal(model.title, "調和する調整役");
  assert.deepEqual(model.leadingFactors, ["O", "A"]);
  assert.match(model.disclaimer, /尺度内スコア/);
});

test("radarPoints returns five bounded points", () => {
  const points = radarPoints({ O: 100, C: 50, E: 0, A: 75, N: 25 }, 100, 100, 80);
  assert.equal(points.length, 5);
  for (const [x, y] of points) {
    assert.ok(x >= 20 && x <= 180);
    assert.ok(y >= 20 && y <= 180);
  }
});
