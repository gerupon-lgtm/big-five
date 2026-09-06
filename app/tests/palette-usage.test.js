import test from "node:test";
import assert from "node:assert/strict";
import {
  contrastRatio,
  resolvePaletteUsage,
  validatePaletteContrast,
} from "../js/domain/palette-usage.js";

const palette = Object.freeze({
  paletteId: "palette-example",
  version: "presentation-v2",
  label: "Example",
  baseColors: Object.freeze({
    primary: "#123456",
    secondary: "#ABCDEF",
    accent: "#7890AB",
  }),
  description: "Example palette.",
});

const mapping = Object.freeze({
  paletteId: "palette-example",
  version: "presentation-v2",
  roles: Object.freeze({
    background: Object.freeze({ source: "primary", mixWith: "white", mixPercent: 88 }),
    surface: Object.freeze({ source: "secondary", mixWith: "white", mixPercent: 94 }),
    accent: Object.freeze({ source: "accent", mixWith: "none", mixPercent: 0 }),
    chart: Object.freeze({ source: "primary", mixWith: "black", mixPercent: 12 }),
  }),
  textCandidates: Object.freeze(["#1F2430", "#FFFFFF"]),
});

test("T-005 F-018 resolves deterministic usage colors and WCAG evidence", () => {
  const first = resolvePaletteUsage(palette, mapping);

  assert.deepEqual(first, {
    background: "#E3E7EB",
    surface: "#FAFCFE",
    accent: "#7890AB",
    text: "#1F2430",
    chart: "#102E4C",
  });
  assert.deepEqual(first, resolvePaletteUsage(palette, mapping));
  assert.equal(validatePaletteContrast(first).valid, true);
  assert.ok(contrastRatio(first.text, first.background) >= 4.5);
  assert.ok(contrastRatio(first.chart, first.background) >= 3);
  assert.equal(Object.isFrozen(first), true);
});

test("T-005 F-018 applies inclusive 4.5 text and 3.0 non-text contrast gates", () => {
  const passing = validatePaletteContrast(Object.freeze({
    background: "#FFFFFF",
    surface: "#FFFFFF",
    accent: "#949494",
    text: "#767676",
    chart: "#949494",
  }));
  const failing = validatePaletteContrast(Object.freeze({
    background: "#FFFFFF",
    surface: "#FFFFFF",
    accent: "#959595",
    text: "#777777",
    chart: "#959595",
  }));

  assert.ok(contrastRatio("#767676", "#FFFFFF") >= 4.5);
  assert.ok(contrastRatio("#777777", "#FFFFFF") < 4.5);
  assert.ok(contrastRatio("#949494", "#FFFFFF") >= 3);
  assert.ok(contrastRatio("#959595", "#FFFFFF") < 3);
  assert.deepEqual(passing, { valid: true, failures: [] });
  assert.deepEqual(failing, {
    valid: false,
    failures: [
      "text-background",
      "text-surface",
      "accent-surface",
      "chart-background",
    ],
  });
  assert.equal(Object.isFrozen(passing), true);
  assert.equal(Object.isFrozen(passing.failures), true);
});

test("T-005 F-018 rejects malformed colors, mappings, and source or mix combinations", () => {
  const cases = [
    [structuredClone(palette), structuredClone(mapping), (p) => { p.baseColors.primary = "#abcdef"; }],
    [structuredClone(palette), structuredClone(mapping), (p, m) => {
      p.paletteId = undefined;
      m.paletteId = undefined;
    }],
    [structuredClone(palette), structuredClone(mapping), (p, m) => {
      p.version = undefined;
      m.version = undefined;
    }],
    [structuredClone(palette), structuredClone(mapping), (p) => { p.label = ""; }],
    [structuredClone(palette), structuredClone(mapping), (p) => { p.description = ""; }],
    [structuredClone(palette), structuredClone(mapping), (_p, m) => { m.paletteId = "palette-other"; }],
    [structuredClone(palette), structuredClone(mapping), (_p, m) => { m.version = "presentation-v1"; }],
    [structuredClone(palette), structuredClone(mapping), (_p, m) => { m.roles.background.source = "text"; }],
    [structuredClone(palette), structuredClone(mapping), (_p, m) => { m.roles.background.mixWith = "gray"; }],
    [structuredClone(palette), structuredClone(mapping), (_p, m) => { m.roles.background.mixPercent = -1; }],
    [structuredClone(palette), structuredClone(mapping), (_p, m) => { m.roles.background.mixPercent = 101; }],
    [structuredClone(palette), structuredClone(mapping), (_p, m) => { m.roles.background.mixPercent = 10.5; }],
    [structuredClone(palette), structuredClone(mapping), (_p, m) => {
      m.roles.accent.mixWith = "none";
      m.roles.accent.mixPercent = 1;
    }],
  ];

  for (const [candidatePalette, candidateMapping, mutate] of cases) {
    mutate(candidatePalette, candidateMapping);
    assert.throws(
      () => resolvePaletteUsage(candidatePalette, candidateMapping),
      { name: "TypeError", message: "PALETTE_USAGE_INVALID" },
    );
  }
  assert.throws(
    () => contrastRatio("#FFFFFF", "#ffffff"),
    { name: "TypeError", message: "PALETTE_USAGE_INVALID" },
  );
});
