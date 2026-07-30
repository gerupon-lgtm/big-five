import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import os from "node:os";
import { promisify } from "node:util";
import path from "node:path";
import test from "node:test";

import {
  loadPresentationReviewModel,
  renderPresentationReview,
} from "../../scripts/content/render-presentation-review.mjs";

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "../..");
const SOURCE_DIR = path.join(ROOT, "content/source");
const PRESENTATION_FILES = [
  "scenes.csv",
  "palettes.csv",
  "palette-usage-mappings.csv",
  "fragrances.csv",
  "fragrance-materials.csv",
  "fragrance-material-examples.csv",
  "presentation-selectors.csv",
  "selector-palettes.csv",
  "selector-fragrances.csv",
];

test("all nine presentation authority tables remain draft with uppercase HEX", async () => {
  const directory = path.join(SOURCE_DIR, "presentation/presentation-v2");
  for (const fileName of PRESENTATION_FILES) {
    const text = await readFile(path.join(directory, fileName), "utf8");
    const rows = text.trimEnd().split(/\r?\n/).slice(1);
    assert.ok(rows.length > 0, fileName);
    assert.ok(rows.every((row) => row.endsWith(",draft")), fileName);
    for (const color of text.match(/#[0-9A-Fa-f]{6}/g) ?? []) {
      assert.equal(color, color.toUpperCase(), `${fileName}: ${color}`);
    }
  }
});

test("review model preserves the complete draft Q-013 structure", async () => {
  const model = await loadPresentationReviewModel({ sourceDir: SOURCE_DIR });

  assert.equal(model.definitionSet.schemaVersion, 2);
  assert.equal(model.definitionSet.presentationDefinitionVersion, "presentation-v2");
  assert.equal(model.definitionSet.palettes.length, 153);
  assert.equal(model.definitionSet.paletteUsageMappings.length, 153);
  assert.equal(model.definitionSet.fragrances.length, 32);
  assert.equal(model.definitionSet.fragranceMaterials.length, 26);
  assert.equal(model.definitionSet.titleSelectors.length, 51);
  assert.deepEqual(
    model.approvals.map(({ gate_id, status }) => [gate_id, status]),
    Array.from({ length: 7 }, (_, index) => [`P-${index}`, "draft"]),
  );

  assert.equal(model.contrastReports.length, 153);
  for (const report of model.contrastReports) {
    assert.equal(report.valid, true, report.paletteId);
    assert.ok(report.ratios.textBackground >= 4.5, report.paletteId);
    assert.ok(report.ratios.textSurface >= 4.5, report.paletteId);
    assert.ok(report.ratios.accentSurface >= 3, report.paletteId);
    assert.ok(report.ratios.chartBackground >= 3, report.paletteId);
  }
});

test("review projection contains P-0 through P-6 and fixed 51-title detail", async () => {
  const model = await loadPresentationReviewModel({ sourceDir: SOURCE_DIR });
  const report = renderPresentationReview(model);

  assert.match(report, /^# Q-013 Presentation v2 承認レビュー/m);
  assert.match(report, /正典: content\/source\/presentation\/presentation-v2\/\*\.csv/);
  assert.match(report, /本書は承認用の生成ビューであり、手編集しない/);
  const gateOffsets = Array.from({ length: 7 }, (_, index) =>
    report.indexOf(`## P-${index} `));
  assert.ok(gateOffsets.every((offset) => offset >= 0));
  assert.deepEqual(gateOffsets, [...gateOffsets].sort((left, right) => left - right));

  const titleHeadings = [...report.matchAll(/^### (\d+)\. (.+?) \(`(title-[^`]+)`\)$/gm)];
  assert.equal(titleHeadings.length, 51);
  model.titleProfiles.forEach((title, index) => {
    assert.equal(Number(titleHeadings[index][1]), index + 1);
    assert.equal(titleHeadings[index][2], title.label);
    assert.equal(titleHeadings[index][3], title.titleId);
  });

  const titleBlocks = report.split(/^### \d+\. .+? \(`title-[^`]+`\)$/gm).slice(1);
  assert.equal(titleBlocks.length, 51);
  for (const block of titleBlocks) {
    assert.equal((block.match(/^- 香り候補:/gm) ?? []).length, 6);
    assert.equal((block.match(/^- 共有サマリ:/gm) ?? []).length, 3);
    assert.equal((block.match(/^- 素材例: .+$/gm) ?? []).length, 6);
  }
});

test("ordinary review shows one to three materials while share projection excludes them", async () => {
  const model = await loadPresentationReviewModel({ sourceDir: SOURCE_DIR });
  const report = renderPresentationReview(model);
  const materialNames = model.definitionSet.fragranceMaterials
    .map(({ displayName }) => displayName);

  const materialLines = report.match(/^- 素材例: .+$/gm) ?? [];
  assert.ok(materialLines.length > 0);
  for (const line of materialLines) {
    const count = line.slice("- 素材例: ".length).split("、").length;
    assert.ok(count >= 1 && count <= 3, line);
  }
  const shareLines = report.match(/^- 共有(?:投影|サマリ): .+$/gm) ?? [];
  assert.ok(shareLines.length > 0);
  for (const line of shareLines) {
    for (const materialName of materialNames) {
      assert.equal(line.includes(materialName), false, `${materialName}: ${line}`);
    }
  }
});

test("CLI renderer is byte-identical across two runs", async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "presentation-review-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const firstPath = path.join(directory, "first.md");
  const secondPath = path.join(directory, "second.md");
  const scriptPath = path.join(ROOT, "scripts/content/render-presentation-review.mjs");

  for (const outputPath of [firstPath, secondPath]) {
    await execFileAsync(process.execPath, [
      scriptPath,
      "--source",
      SOURCE_DIR,
      "--output",
      outputPath,
    ]);
  }
  assert.deepEqual(await readFile(firstPath), await readFile(secondPath));
});
