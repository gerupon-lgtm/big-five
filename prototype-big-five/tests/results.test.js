import test from "node:test";
import assert from "node:assert/strict";
import { buildResultModel } from "../sample-results.js";
import { drawRadar, radarPoints } from "../radar-chart.js";

const standardScores = { O: 82, C: 68, E: 41, A: 74, N: 57 };

test("result model names the two strongest profile factors", () => {
  const model = buildResultModel({ answerCount: 20, scores: standardScores });
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

test("radarPoints keeps all-zero scores at the supplied center", () => {
  assert.deepEqual(
    radarPoints({ O: 0, C: 0, E: 0, A: 0, N: 0 }, 100, 100, 80),
    Array.from({ length: 5 }, () => [100, 100]),
  );
});

test("result model uses fixed factor order to break score ties", () => {
  buildResultModel({ answerCount: 20, scores: { O: 1, C: 2, E: 3, A: 90, N: 80 } });
  const model = buildResultModel({
    answerCount: 20,
    scores: { N: 50, A: 50, E: 50, C: 50, O: 50 },
  });
  assert.deepEqual(model.leadingFactors, ["O", "C"]);
});

test("result model distinguishes the 20- and 50-item result detail", () => {
  assert.equal(
    buildResultModel({ answerCount: 20, scores: standardScores }).detail,
    "20問の結果は基本サンプルです。追加30問に答えると、より多くの回答を使ったサンプル結果を表示します。",
  );
  assert.equal(
    buildResultModel({ answerCount: 50, scores: standardScores }).detail,
    "50問の回答を使った体験用サンプル結果です。精度・妥当性は検証していません。",
  );
});

test("result model and radar reject missing and non-finite scores", () => {
  for (const scores of [
    { C: 50, E: 50, A: 50, N: 50 },
    { O: NaN, C: 50, E: 50, A: 50, N: 50 },
    { O: Infinity, C: 50, E: 50, A: 50, N: 50 },
  ]) {
    assert.throws(() => buildResultModel({ answerCount: 20, scores }), TypeError);
    assert.throws(() => radarPoints(scores, 100, 100, 80), TypeError);
  }
});

test("result model and radar reject out-of-range scores", () => {
  for (const value of [-1, 101]) {
    const scores = { O: value, C: 50, E: 50, A: 50, N: 50 };
    assert.throws(() => buildResultModel({ answerCount: 20, scores }), RangeError);
    assert.throws(() => radarPoints(scores, 100, 100, 80), RangeError);
  }
});

test("drawRadar centers a rectangular canvas using both dimensions", () => {
  const calls = [];
  const context = {
    beginPath: () => calls.push(["beginPath"]), clearRect: () => {}, closePath: () => {},
    fill: () => {}, lineTo: (...args) => calls.push(["lineTo", ...args]),
    moveTo: (...args) => calls.push(["moveTo", ...args]), stroke: () => {},
  };
  const canvas = { width: 400, height: 200, getContext: () => context };
  drawRadar(canvas, { O: 0, C: 0, E: 0, A: 0, N: 0 });
  assert.deepEqual(calls.find(([method]) => method === "moveTo"), ["moveTo", 200, 100]);
});
