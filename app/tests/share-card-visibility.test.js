import assert from "node:assert/strict";
import test from "node:test";

import {
  chooseCharacterTreatment,
  collectOpaqueEdgePixels,
} from "../js/domain/share-card-visibility.js";

function rgba(...pixels) {
  return new Uint8ClampedArray(pixels.flat());
}

test("T-007 F-016 collects only opaque pixels on a transparent or image edge", () => {
  const image = {
    width: 3,
    height: 3,
    data: rgba(
      [255, 0, 0, 0], [10, 20, 30, 255], [255, 0, 0, 0],
      [40, 50, 60, 255], [70, 80, 90, 255], [100, 110, 120, 255],
      [255, 0, 0, 0], [130, 140, 150, 255], [255, 0, 0, 0],
    ),
  };

  const pixels = collectOpaqueEdgePixels(image);

  assert.deepEqual(pixels, [
    { r: 10, g: 20, b: 30 },
    { r: 40, g: 50, b: 60 },
    { r: 100, g: 110, b: 120 },
    { r: 130, g: 140, b: 150 },
  ]);
  assert.doesNotMatch(JSON.stringify(pixels), /255,0,0|70,80,90/);
  assert.equal(Object.isFrozen(pixels), true);
  assert.ok(pixels.every(Object.isFrozen));
});

test("T-007 F-016 includes opaque image-boundary pixels and accepts an explicit threshold", () => {
  const image = {
    width: 2,
    height: 1,
    data: rgba([1, 2, 3, 10], [4, 5, 6, 11]),
  };

  assert.deepEqual(collectOpaqueEdgePixels(image, 11), [
    { r: 4, g: 5, b: 6 },
  ]);
});

test("T-007 F-016 selects all four fixed WCAG contrast treatments", () => {
  const cases = [
    [[{ r: 0, g: 0, b: 0 }], "none"],
    [[{ r: 153, g: 153, b: 153 }], "shadow"],
    [[{ r: 187, g: 187, b: 187 }], "double-outline"],
    [[{ r: 238, g: 238, b: 238 }], "neutral-plate"],
    [[], "neutral-plate"],
  ];

  for (const [edgePixels, expected] of cases) {
    assert.equal(
      chooseCharacterTreatment({ edgePixels, backgroundHex: "#FFFFFF" }),
      expected,
    );
  }
});

test("T-007 F-016 uses the least contrasting edge pixel for a safe treatment", () => {
  assert.equal(chooseCharacterTreatment({
    edgePixels: [
      { r: 0, g: 0, b: 0 },
      { r: 238, g: 238, b: 238 },
    ],
    backgroundHex: "#FFFFFF",
  }), "neutral-plate");
});

test("T-007 F-016 rejects malformed image and color inputs", () => {
  const validImage = {
    width: 1,
    height: 1,
    data: rgba([0, 0, 0, 255]),
  };
  const cases = [
    () => collectOpaqueEdgePixels(null),
    () => collectOpaqueEdgePixels({ ...validImage, width: 0 }),
    () => collectOpaqueEdgePixels({ ...validImage, data: [0, 0, 0, 255] }),
    () => collectOpaqueEdgePixels({ ...validImage, data: rgba([0, 0, 0]) }),
    () => collectOpaqueEdgePixels(validImage, 0),
    () => chooseCharacterTreatment(null),
    () => chooseCharacterTreatment({ edgePixels: [{ r: -1, g: 0, b: 0 }], backgroundHex: "#FFFFFF" }),
    () => chooseCharacterTreatment({ edgePixels: [], backgroundHex: "#ffffff" }),
  ];

  for (const run of cases) {
    assert.throws(run, {
      name: "TypeError",
      message: "SHARE_CARD_VISIBILITY_INVALID",
    });
  }
});
