import assert from "node:assert/strict";
import test from "node:test";

import { selectResultPalette } from "../js/domain/result-palette-selection.js";
import { createTestResultSnapshot } from "./helpers/result-snapshot-fixture.js";

const allowedPalettes = Object.freeze({
  standard: Object.freeze({ paletteId: "palette-default" }),
  alternatives: Object.freeze([
    Object.freeze({ paletteId: "palette-alternative-1" }),
    Object.freeze({ paletteId: "palette-alternative-2" }),
  ]),
});

test("T-005 F-018 changes only the selected result-card palette", () => {
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000060",
  });
  const before = structuredClone(snapshot);

  const updated = selectResultPalette(
    snapshot,
    allowedPalettes,
    "palette-alternative-2",
  );

  assert.equal(updated.selectedPaletteId, "palette-alternative-2");
  assert.deepEqual(
    { ...updated, selectedPaletteId: snapshot.selectedPaletteId },
    snapshot,
  );
  assert.deepEqual(snapshot, before);
  assert.equal(Object.isFrozen(updated), true);
  assert.equal(Object.isFrozen(updated.factors), true);
});

test("T-005 F-018 rejects palettes outside the exact standard-plus-two set", () => {
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000061",
  });

  for (const [palettes, paletteId] of [
    [allowedPalettes, "palette-unknown"],
    [{ ...allowedPalettes, alternatives: [allowedPalettes.alternatives[0]] }, "palette-default"],
    [{
      ...allowedPalettes,
      alternatives: [
        allowedPalettes.alternatives[0],
        allowedPalettes.alternatives[0],
      ],
    }, "palette-alternative-1"],
  ]) {
    assert.throws(
      () => selectResultPalette(snapshot, palettes, paletteId),
      { name: "TypeError", message: "RESULT_PALETTE_INVALID" },
    );
  }
});

test("T-005 F-018 rejects a malformed snapshot before changing its palette", () => {
  const snapshot = structuredClone(createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000062",
  }));
  snapshot.factors.pop();

  assert.throws(
    () => selectResultPalette(snapshot, allowedPalettes, "palette-alternative-1"),
    { name: "TypeError", message: "RESULT_PALETTE_INVALID" },
  );
});
