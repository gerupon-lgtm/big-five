import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { parseCsv } from "./csv-parser.mjs";
import { serializeCsv } from "./csv-writer.mjs";
import { mixHex } from "./palette-variation.mjs";

export const ROLE_COLOR_ANCHORS = Object.freeze([
  Object.freeze({ surface: "#A7C6B8", accent: "#4F6F63" }),
  Object.freeze({ surface: "#D7B69C", accent: "#875846" }),
  Object.freeze({ surface: "#BFAFD3", accent: "#625177" }),
]);

export const PRIMARY_COLOR_OVERRIDES = Object.freeze({
  "palette-single-intellectimagination-low-3": "#5F8457",
  "palette-pair-intellectimagination-low-and-conscientiousness-low-1": "#D4B64C",
  "palette-pair-intellectimagination-low-and-conscientiousness-low-2": "#7CAB8A",
  "palette-pair-intellectimagination-low-and-conscientiousness-low-3": "#B6A184",
  "palette-pair-intellectimagination-low-and-extraversion-low-1": "#7A7E82",
  "palette-pair-intellectimagination-low-and-extraversion-low-2": "#4F84A8",
  "palette-pair-intellectimagination-low-and-extraversion-low-3": "#B5A89C",
  "palette-pair-intellectimagination-low-and-emotionalstability-low-1": "#737F88",
  "palette-pair-intellectimagination-low-and-emotionalstability-low-3": "#6E9FC3",
  "palette-pair-conscientiousness-high-and-extraversion-high-3": "#C9C2B5",
  "palette-pair-conscientiousness-low-and-extraversion-low-2": "#6F9A67",
  "palette-pair-conscientiousness-low-and-extraversion-low-3": "#739BB4",
  "palette-pair-conscientiousness-high-and-emotionalstability-high-2": "#C7D5D8",
  "palette-pair-conscientiousness-high-and-emotionalstability-high-3": "#5E8B6E",
  "palette-pair-conscientiousness-low-and-emotionalstability-high-2": "#78A665",
  "palette-pair-conscientiousness-low-and-emotionalstability-low-3": "#B69A72",
  "palette-pair-extraversion-low-and-emotionalstability-low-1": "#5C748B",
  "palette-pair-extraversion-low-and-emotionalstability-low-2": "#8566A1",
  "palette-pair-extraversion-low-and-emotionalstability-low-3": "#5D8870",
  "palette-pair-extraversion-high-and-emotionalstability-high-3": "#557FBD",
  "palette-pair-agreeableness-high-and-emotionalstability-high-2": "#659B6D",
  "palette-pair-agreeableness-high-and-emotionalstability-low-2": "#8464AA",
});

export function migratePaletteRows(rows) {
  if (!Array.isArray(rows) || rows.length !== 153) {
    throw new TypeError("PALETTE_MIGRATION_INPUT_INVALID");
  }

  return rows.map((row, index) => {
    const primaryColor =
      PRIMARY_COLOR_OVERRIDES[row.palette_id] ?? row.primary_color;
    const anchors = ROLE_COLOR_ANCHORS[index % 3];
    return {
      ...row,
      primary_color: primaryColor,
      secondary_color: mixHex(primaryColor, anchors.surface, 0.65),
      accent_color: mixHex(primaryColor, anchors.accent, 0.5),
    };
  });
}

function parseArgs(argv) {
  const fileIndex = argv.indexOf("--file");
  if (fileIndex === -1 || !argv[fileIndex + 1] || argv.length !== 2) {
    throw new TypeError("PALETTE_MIGRATION_ARGUMENT_INVALID");
  }
  return path.resolve(argv[fileIndex + 1]);
}

async function main() {
  const filePath = parseArgs(process.argv.slice(2));
  const table = parseCsv(await readFile(filePath, "utf8"), filePath);
  const rows = table.rows.map(({ values }) =>
    Object.fromEntries(table.headers.map((header, index) => [header, values[index]])));
  const migrated = migratePaletteRows(rows);
  await writeFile(
    filePath,
    serializeCsv(
      table.headers,
      migrated.map((row) => table.headers.map((header) => row[header])),
    ),
    "utf8",
  );
}

if (
  process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  await main();
}
