import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { parseCsv } from "../../scripts/content/csv-parser.mjs";
import {
  auditTitlePaletteGroups,
  mixHex,
  mixWithWhite,
  oklabDistance,
  relativeLuminance,
} from "../../scripts/content/palette-variation.mjs";
import {
  migratePaletteRows,
  PRIMARY_COLOR_OVERRIDES,
  ROLE_COLOR_ANCHORS,
} from "../../scripts/content/migrate-independent-palettes.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const PALETTES_PATH = path.join(
  ROOT,
  "content/source/presentation/presentation-v2/palettes.csv",
);

async function loadPalettes() {
  const table = parseCsv(await readFile(PALETTES_PATH, "utf8"), PALETTES_PATH);
  return table.rows.map(({ values }) =>
    Object.fromEntries(table.headers.map((header, index) => [header, values[index]])));
}

test("palette color metrics resolve deterministic preview colors", () => {
  assert.equal(mixHex("#000000", "#FFFFFF", 0.5), "#808080");
  assert.equal(mixWithWhite("#000000", 90), "#E6E6E6");
  assert.equal(relativeLuminance("#FFFFFF"), 1);
  assert.equal(relativeLuminance("#000000"), 0);
  assert.equal(oklabDistance("#FFFFFF", "#FFFFFF"), 0);
  assert.ok(oklabDistance("#000000", "#FFFFFF") > 99);
});

test("all title palettes are independent, visibly separated, and pale at upper right", async () => {
  const audit = auditTitlePaletteGroups(await loadPalettes(), {
    backgroundWhitePercent: 84,
    surfaceWhitePercent: 90,
  });

  assert.equal(audit.length, 51);
  assert.deepEqual(
    audit.filter(({ isCyclic }) => isCyclic).map(({ titleOrder }) => titleOrder),
    [],
  );
  assert.deepEqual(
    audit
      .filter(({ minimumBackgroundDistance }) => minimumBackgroundDistance < 1)
      .map(({ titleOrder }) => titleOrder),
    [],
  );
  assert.deepEqual(
    audit
      .filter(({ minimumSurfaceLuminance }) => minimumSurfaceLuminance < 0.9)
      .map(({ titleOrder }) => titleOrder),
    [],
  );
  assert.ok(audit.every(({ uniqueColorTriples }) => uniqueColorTriples === 3));
});

test("independent palette migration is deterministic and preserves non-color fields", async () => {
  const source = await loadPalettes();
  const migrated = migratePaletteRows(source);
  assert.deepEqual(migratePaletteRows(source), migrated);
  assert.equal(Object.keys(PRIMARY_COLOR_OVERRIDES).length, 22);

  const colorFields = new Set([
    "primary_color",
    "secondary_color",
    "accent_color",
  ]);
  for (let index = 0; index < source.length; index += 1) {
    const before = source[index];
    const after = migrated[index];
    const role = index % 3;
    const anchors = ROLE_COLOR_ANCHORS[role];
    const expectedPrimary =
      PRIMARY_COLOR_OVERRIDES[before.palette_id] ?? before.primary_color;

    assert.equal(after.primary_color, expectedPrimary, before.palette_id);
    assert.equal(
      after.secondary_color,
      mixHex(expectedPrimary, anchors.surface, 0.65),
      before.palette_id,
    );
    assert.equal(
      after.accent_color,
      mixHex(expectedPrimary, anchors.accent, 0.5),
      before.palette_id,
    );
    for (const field of Object.keys(before)) {
      if (!colorFields.has(field)) {
        assert.equal(after[field], before[field], `${before.palette_id}:${field}`);
      }
    }
  }

  const audit = auditTitlePaletteGroups(migrated, {
    backgroundWhitePercent: 84,
    surfaceWhitePercent: 90,
  });
  assert.ok(audit.every(({ isCyclic }) => !isCyclic));
  assert.ok(audit.every(({ minimumBackgroundDistance }) =>
    minimumBackgroundDistance >= 1));
  assert.ok(audit.every(({ minimumSurfaceLuminance }) =>
    minimumSurfaceLuminance >= 0.9));
});
