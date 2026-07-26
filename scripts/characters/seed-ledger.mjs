import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TitleProfileDefinitions } from "../../app/js/data/title-profile-definitions.js";
import { validateCharacterLedger } from "./character-contract.mjs";

const catalogPath = new URL("../../docs/title-character-catalog.md", import.meta.url);
const ledgerPath = new URL("../../docs/assets/character-production/ledger.json", import.meta.url);
const replace = process.argv.includes("--replace");

function fail(message) {
  throw new Error(`CHARACTER_LEDGER_SEED_INVALID: ${message}`);
}

function parseTableRow(line) {
  const cells = line.trim().split("|").slice(1, -1).map((cell) => cell.trim());
  return cells;
}

function numberedRows(markdown, heading, expectedColumns) {
  const start = markdown.indexOf(heading);
  if (start === -1) fail(`missing catalog heading ${heading}`);
  const end = markdown.indexOf("\n## ", start + heading.length);
  const section = markdown.slice(start, end === -1 ? markdown.length : end);
  const rows = section.split(/\r?\n/)
    .filter((line) => /^\|\s*\d+\s*\|/.test(line))
    .map(parseTableRow);
  if (rows.length !== 51 || rows.some((row) => row.length !== expectedColumns)) fail(`invalid numbered table ${heading}`);
  rows.forEach((row, index) => {
    if (Number(row[0]) !== index + 1) fail(`invalid row number in ${heading}`);
  });
  return rows;
}

function parseProps(value) {
  const props = value.split("、").map((prop) => prop.trim()).filter(Boolean);
  if (props.length < 1 || props.length > 2) fail(`invalid props ${value}`);
  return props;
}

function makeAlt({ pose, gazeTarget, props }) {
  return `猫が${pose}。視線・姿勢の指示は${gazeTarget}。小物は${props.join("、")}。`;
}

const catalog = await readFile(catalogPath, "utf8");
const titleRows = numberedRows(catalog, "## 1. 称号一覧", 4).map(([number, rawTitleId, _attribute, titleLabel]) => ({
  number: Number(number),
  titleId: rawTitleId.replace(/^`|`$/g, ""),
  titleLabel,
}));
const queueRows = numberedRows(catalog, "## 2. 制作キュー", 3).map(([number, props, poseAndGaze]) => ({
  number: Number(number),
  props: parseProps(props),
  poseAndGaze,
}));
const catalogByTitleId = new Map(titleRows.map((row) => [row.titleId, row]));
const queueByNumber = new Map(queueRows.map((row) => [row.number, row]));
if (catalogByTitleId.size !== 51) fail("duplicate title IDs in title catalog");
if (queueByNumber.size !== 51) fail("duplicate numbered rows in production queue");

const entries = TitleProfileDefinitions.map((profile) => {
  const title = catalogByTitleId.get(profile.titleId);
  const queue = title && queueByNumber.get(title.number);
  if (!title || !queue) fail(`missing catalog row for ${profile.titleId}`);
  const pose = queue.poseAndGaze;
  const gazeTarget = queue.poseAndGaze;
  return {
    titleId: profile.titleId,
    characterId: profile.characterId,
    titleLabelAtBrief: title.titleLabel,
    assetVersion: `${profile.characterId}-v1`,
    productionStatus: "brief",
    sceneIntent: `${title.titleLabel}の情景`,
    catReferenceKind: null,
    catReferencePath: null,
    referenceRightsNote: null,
    pose,
    gazeTarget,
    props: queue.props,
    prohibitedRepresentationCheck: null,
    sourcePngPath: null,
    sourceSha256: null,
    deliveryWebpPath: null,
    deliverySha256: null,
    width: null,
    height: null,
    byteLength: null,
    webpEncoder: null,
    webpSettings: null,
    alt: makeAlt({ pose, gazeTarget, props: queue.props }),
    artReviewStatus: null,
    anatomyReviewStatus: null,
    technicalReviewStatus: null,
    accessibilityReviewStatus: null,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    notes: null,
  };
});
const ledger = { schemaVersion: 1, entries };
validateCharacterLedger(ledger, TitleProfileDefinitions);

try {
  await readFile(ledgerPath, "utf8");
  if (!replace) fail("ledger already exists; pass --replace to overwrite it");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
await mkdir(dirname(fileURLToPath(ledgerPath)), { recursive: true });
await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
console.log(`seeded ${entries.length} character ledger rows`);
