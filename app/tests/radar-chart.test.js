import assert from "node:assert/strict";
import test from "node:test";

import { FACTOR_ORDER } from "../js/data/factor-order.js";
import { drawResultRadar } from "../js/presentation/radar-chart.js";

function factors() {
  return FACTOR_ORDER.map((factorId, index) => ({
    factorId,
    displayScore: 20 + (index * 15),
  }));
}

function recordingCanvas() {
  const calls = [];
  const context = {
    beginPath: () => calls.push(["beginPath"]),
    clearRect: (...args) => calls.push(["clearRect", ...args]),
    closePath: () => calls.push(["closePath"]),
    fill: () => calls.push(["fill"]),
    lineTo: (...args) => calls.push(["lineTo", ...args]),
    moveTo: (...args) => calls.push(["moveTo", ...args]),
    restore: () => calls.push(["restore"]),
    save: () => calls.push(["save"]),
    stroke: () => calls.push(["stroke"]),
  };
  return {
    canvas: {
      width: 320,
      height: 320,
      getContext: (kind) => kind === "2d" ? context : null,
    },
    calls,
  };
}

test("T-005 F-006 draws five axes, three guide rings, and the saved score polygon", () => {
  const { canvas, calls } = recordingCanvas();

  assert.deepEqual(drawResultRadar(canvas, factors()), {
    drawn: true,
    errorCode: null,
  });
  assert.equal(calls.filter(([name]) => name === "stroke").length, 9);
  assert.equal(calls.filter(([name]) => name === "fill").length, 1);
  assert.equal(calls.filter(([name]) => name === "clearRect").length, 1);
});

test("T-005 F-006 reports an unavailable canvas context without throwing", () => {
  assert.deepEqual(drawResultRadar({ getContext: () => null }, factors()), {
    drawn: false,
    errorCode: "RADAR_CONTEXT_UNAVAILABLE",
  });
});

test("T-005 F-006 converts canvas drawing failures into a stable error result", () => {
  const canvas = {
    width: 320,
    height: 320,
    getContext() {
      return {
        save() {
          throw new Error("canvas unavailable");
        },
      };
    },
  };

  assert.deepEqual(drawResultRadar(canvas, factors()), {
    drawn: false,
    errorCode: "RADAR_DRAW_FAILED",
  });
});
