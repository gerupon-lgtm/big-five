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

async function loadPalettes() {
  const table = parseCsv(await readFile(PALETTES_PATH, "utf8"), PALETTES_PATH);
  return table.rows.map(({ values }) =>
    Object.fromEntries(table.headers.map((header, index) => [header, values[index]])));
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
      ["強い意志を示すプラム", "#866F82"],
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
