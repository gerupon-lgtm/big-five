import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { parseCsv } from "../../scripts/content/csv-parser.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const PALETTES_PATH = path.join(
  ROOT,
  "content/source/presentation/presentation-v2/palettes.csv",
);

const REVIEWED_VARIATION_TRIPLETS = {
  "palette-balanced-1": ["#7C8791", "#8FAFC1", "#4F9B58"],
  "palette-single-conscientiousness-high-1": ["#40566F", "#6986A3", "#B5A786"],
  "palette-single-extraversion-low-1": ["#394A63", "#596F86", "#8B58A6"],
  "palette-single-emotionalstability-high-1": ["#5F86A3", "#405D73", "#41966E"],
  "palette-pair-intellectimagination-low-and-conscientiousness-high-1":
    ["#7C875A", "#A5684F", "#94928A"],
  "palette-pair-intellectimagination-low-and-emotionalstability-high-1":
    ["#D0B58D", "#92A083", "#C08A3E"],
  "palette-pair-intellectimagination-low-and-emotionalstability-low-1":
    ["#708EA3", "#3F704A", "#748C78"],
  "palette-pair-extraversion-low-and-agreeableness-low-1":
    ["#465469", "#777C7E", "#9A644A"],
  "palette-pair-agreeableness-low-and-emotionalstability-low-1":
    ["#854E5E", "#44556A", "#765792"],
};

async function loadPalettes() {
  const table = parseCsv(await readFile(PALETTES_PATH, "utf8"), PALETTES_PATH);
  return table.rows.map(({ values }) =>
    Object.fromEntries(table.headers.map((header, index) => [header, values[index]])));
}

function mixWithWhite(hex, whitePercent = 84) {
  const sourcePercent = 100 - whitePercent;
  return [1, 3, 5].map((offset) => {
    const source = Number.parseInt(hex.slice(offset, offset + 2), 16);
    return Math.round((source * sourcePercent + 255 * whitePercent) / 100);
  });
}

function rgbDistance(first, second) {
  return Math.hypot(...first.map((channel, index) => channel - second[index]));
}

test("reviewed palette labels match their preserved primary colors", async () => {
  const rows = await loadPalettes();
  const byId = new Map(rows.map((row) => [row.palette_id, row]));
  const expected = {
    "palette-balanced-2": ["静謐な淡いブルー", "#8FAFC1"],
    "palette-single-intellectimagination-high-2":
      ["閃きを象徴する星影の紫", "#7567A8"],
    "palette-single-intellectimagination-high-3":
      ["未知への好奇心を誘うターコイズ", "#4FA8B8"],
    "palette-single-extraversion-high-1":
      ["陽気なコーラルピンク", "#E07868"],
    "palette-single-extraversion-high-2":
      ["活気に満ちたオレンジ", "#E69A4B"],
    "palette-single-extraversion-high-3":
      ["交流をひらくターコイズ", "#38A8A0"],
    "palette-pair-intellectimagination-high-and-agreeableness-low-1":
      ["強い意志を宿す深い青", "#315E87"],
    "palette-pair-intellectimagination-high-and-agreeableness-low-2":
      ["未踏の地を拓く深い紫", "#694C91"],
    "palette-pair-intellectimagination-high-and-agreeableness-low-3":
      ["鋭い理性を照らすオレンジ", "#C46F3F"],
    "palette-pair-extraversion-high-and-agreeableness-high-1":
      ["華やかなコーラルピンク", "#D96F67"],
    "palette-pair-extraversion-high-and-agreeableness-high-2":
      ["共演する明るいターコイズ", "#3F9C98"],
    "palette-pair-extraversion-high-and-agreeableness-high-3":
      ["活気ある黄金色", "#D0A24C"],
    "palette-pair-agreeableness-low-and-emotionalstability-low-3":
      ["強い意志を示すプラム", "#765792"],
  };

  for (const [paletteId, [label, primaryColor]] of Object.entries(expected)) {
    const row = byId.get(paletteId);
    assert.ok(row, paletteId);
    assert.equal(row.label, label, paletteId);
    assert.equal(row.primary_color, primaryColor, paletteId);
  }
});

test("every title keeps three distinct labels and primary colors", async () => {
  const rows = await loadPalettes();
  assert.equal(rows.length, 153);

  for (let index = 0; index < rows.length; index += 3) {
    const group = rows.slice(index, index + 3);
    assert.equal(group.length, 3);
    assert.equal(new Set(group.map(({ label }) => label)).size, 3, group[0].palette_id);
    assert.equal(
      new Set(group.map(({ primary_color }) => primary_color)).size,
      3,
      group[0].palette_id,
    );
  }

  assert.ok(rows.every(({ content_review_note }) => content_review_note === ""));
  assert.ok(rows.every(({ status }) => status === "draft"));
});

test("reviewed title palettes keep one varied cyclic color triplet", async () => {
  const rows = await loadPalettes();
  const indexById = new Map(rows.map((row, index) => [row.palette_id, index]));

  for (const [firstPaletteId, colors] of Object.entries(REVIEWED_VARIATION_TRIPLETS)) {
    const start = indexById.get(firstPaletteId);
    assert.notEqual(start, undefined, firstPaletteId);
    const group = rows.slice(start, start + 3);

    assert.deepEqual(
      group.map(({ primary_color }) => primary_color),
      colors,
      `${firstPaletteId}: primary colors`,
    );
    assert.deepEqual(
      group.map(({ secondary_color }) => secondary_color),
      [colors[1], colors[2], colors[0]],
      `${firstPaletteId}: secondary colors`,
    );
    assert.deepEqual(
      group.map(({ accent_color }) => accent_color),
      [colors[2], colors[0], colors[1]],
      `${firstPaletteId}: accent colors`,
    );

    const previewColors = colors.map((color) => mixWithWhite(color));
    const distances = [
      rgbDistance(previewColors[0], previewColors[1]),
      rgbDistance(previewColors[0], previewColors[2]),
      rgbDistance(previewColors[1], previewColors[2]),
    ];
    assert.ok(
      Math.min(...distances) >= 7,
      `${firstPaletteId}: B preview colors are too close (${distances.join(", ")})`,
    );
  }
});
