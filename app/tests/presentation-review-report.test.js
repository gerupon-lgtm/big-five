import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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
const PRE_REVIEW_NOTE_PALETTE_SHA256 =
  "71CBDC93F20B10AB2B6B3683AFDAD7CEF9001F0877157D9A73CE80834768F089";

test("adding content_review_note preserves every prior palette CSV byte and row order", async () => {
  const source = await readFile(
    path.join(SOURCE_DIR, "presentation/presentation-v2/palettes.csv"),
    "utf8",
  );
  const priorProjection = source
    .trimEnd()
    .split(/\r?\n/)
    .map((line) => {
      const fields = line.split(",");
      assert.equal(fields.length, 10);
      return fields.toSpliced(8, 1).join(",");
    })
    .join("\n")
    .concat("\n");
  assert.equal(
    createHash("sha256").update(priorProjection).digest("hex").toUpperCase(),
    PRE_REVIEW_NOTE_PALETTE_SHA256,
  );
});

test("review model preserves the complete current Q-013 structure", async () => {
  const model = await loadPresentationReviewModel({ sourceDir: SOURCE_DIR });

  assert.equal(model.definitionSet.schemaVersion, 2);
  assert.equal(model.definitionSet.presentationDefinitionVersion, "presentation-v2");
  assert.equal(model.definitionSet.palettes.length, 153);
  assert.equal(model.definitionSet.paletteUsageMappings.length, 153);
  assert.equal(model.definitionSet.fragrances.length, 32);
  assert.equal(model.definitionSet.fragranceMaterials.length, 26);
  assert.equal(model.definitionSet.titleSelectors.length, 51);
  assert.equal(model.paletteContentReviews.length, 153);
  assert.equal(
    model.paletteContentReviews.filter(({ contentReviewNote }) =>
      contentReviewNote !== "").length,
    10,
  );
  assert.deepEqual(
    model.paletteContentReviews
      .filter(({ contentReviewNote }) => contentReviewNote !== "")
      .slice(0, 3),
    [
      {
        paletteId: "palette-balanced-2",
        contentReviewNote:
          "要確認: ラベル「静謐な白」とHEX #8FAFC1は見た目の色相が一致しないため、元候補の意図を確認。",
      },
      {
        paletteId: "palette-single-intellectimagination-high-2",
        contentReviewNote:
          "要確認: ラベル「閃きを象徴する金黄色」とHEX #7567A8は見た目の色相が一致しないため、元候補の意図を確認。",
      },
      {
        paletteId: "palette-single-intellectimagination-high-3",
        contentReviewNote:
          "要確認: ラベル「未知への好奇心を誘う紫」とHEX #4FA8B8は見た目の色相が一致しないため、元候補の意図を確認。",
      },
    ],
  );
  assert.deepEqual(
    model.approvals.map(({ gate_id, display_order }) => [gate_id, display_order]),
    Array.from({ length: 7 }, (_, index) => [`P-${index}`, index + 1]),
  );
  assert.ok(model.approvals.every(({ status }) =>
    ["draft", "reviewed", "approved", "rejected"].includes(status)));

  assert.equal(model.contrastReports.length, 153);
  for (const report of model.contrastReports) {
    assert.equal(report.valid, true, report.paletteId);
    assert.ok(report.ratios.textBackground >= 4.5, report.paletteId);
    assert.ok(report.ratios.textSurface >= 4.5, report.paletteId);
    assert.ok(report.ratios.accentSurface >= 3, report.paletteId);
    assert.ok(report.ratios.chartBackground >= 3, report.paletteId);
  }
});

test("P-0 content review follows only the source CSV row after label and HEX changes", async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "presentation-review-source-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const sourceDir = path.join(directory, "source");
  for (const [source, destination] of [
    ["titles/title-rule-v1", "titles/title-rule-v1"],
    ["presentation/presentation-v2", "presentation/presentation-v2"],
    [
      "approvals/presentation-content-approvals.csv",
      "approvals/presentation-content-approvals.csv",
    ],
  ]) {
    await cp(path.join(SOURCE_DIR, source), path.join(sourceDir, destination), {
      recursive: true,
    });
  }
  const palettePath = path.join(
    sourceDir,
    "presentation/presentation-v2/palettes.csv",
  );
  const rows = (await readFile(palettePath, "utf8")).trimEnd().split(/\r?\n/);
  const columns = rows[0].split(",");
  const targetIndex = rows.findIndex((row) =>
    row.startsWith("palette-single-intellectimagination-high-2,"));
  assert.ok(targetIndex > 0);
  const fields = rows[targetIndex].split(",");
  fields[columns.indexOf("label")] = "検証用の青";
  fields[columns.indexOf("primary_color")] = "#123456";
  fields[columns.indexOf("content_review_note")] = "";
  rows[targetIndex] = fields.join(",");
  await writeFile(palettePath, `${rows.join("\r\n")}\r\n`, "utf8");

  const model = await loadPresentationReviewModel({ sourceDir });
  const report = renderPresentationReview(model);
  const targetReview = model.paletteContentReviews.find(({ paletteId }) =>
    paletteId === "palette-single-intellectimagination-high-2");
  assert.deepEqual(targetReview, {
    paletteId: "palette-single-intellectimagination-high-2",
    contentReviewNote: "",
  });
  assert.match(
    report,
    /palette-single-intellectimagination-high-2[\s\S]*?検証用の青[\s\S]*?#123456[\s\S]*?\| 確認事項なし \|/,
  );
  assert.doesNotMatch(
    report,
    /要確認: ラベル「閃きを象徴する金黄色」とHEX #7567A8/,
  );
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

test("P-0 review uses visible accessible swatches and separates WCAG from content review", async () => {
  const model = await loadPresentationReviewModel({ sourceDir: SOURCE_DIR });
  const report = renderPresentationReview(model);

  assert.match(
    report,
    /<span role="img" aria-label="primary color #7C8791" style="[^"]*background-color:#7C8791;[^"]*"><\/span> <code>#7C8791<\/code>/,
  );
  assert.match(
    report,
    /<span role="img" aria-label="background color #F5F5F6" style="[^"]*background-color:#F5F5F6;[^"]*"><\/span> <code>#F5F5F6<\/code>/,
  );
  assert.match(report, /\| WCAG判定 \| 内容確認 \|/);
  assert.match(
    report,
    /palette-single-intellectimagination-high-2[\s\S]*?\| 適合 \| 要確認: ラベル「閃きを象徴する金黄色」とHEX #7567A8/,
  );
  assert.match(
    report,
    /palette-single-intellectimagination-high-3[\s\S]*?\| 適合 \| 要確認: ラベル「未知への好奇心を誘う紫」とHEX #4FA8B8/,
  );
  assert.match(
    report,
    /palette-single-extraversion-high-1[\s\S]*?\| 適合 \| 要確認: ラベル「陽気なサンフラワーイエロー」とHEX #E07868/,
  );
});

test("approval metadata consistency is required by both model and renderer", async () => {
  const model = await loadPresentationReviewModel({ sourceDir: SOURCE_DIR });
  const approvedWithoutMetadata = structuredClone(model.approvals);
  approvedWithoutMetadata[0].status = "approved";
  assert.throws(
    () => renderPresentationReview({ ...model, approvals: approvedWithoutMetadata }),
    { name: "TypeError", message: "PRESENTATION_REVIEW_INVALID" },
  );

  const draftWithMetadata = structuredClone(model.approvals);
  draftWithMetadata[0].approved_by = "user";
  draftWithMetadata[0].approved_on = "2026-07-30";
  assert.throws(
    () => renderPresentationReview({ ...model, approvals: draftWithMetadata }),
    { name: "TypeError", message: "PRESENTATION_REVIEW_INVALID" },
  );
});

test("P-0 approval renders truthfully while later gates remain draft", async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "presentation-approved-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const sourceDir = path.join(directory, "source");
  await cp(
    path.join(SOURCE_DIR, "titles/title-rule-v1"),
    path.join(sourceDir, "titles/title-rule-v1"),
    { recursive: true },
  );
  await cp(
    path.join(SOURCE_DIR, "presentation/presentation-v2"),
    path.join(sourceDir, "presentation/presentation-v2"),
    { recursive: true },
  );
  await cp(
    path.join(SOURCE_DIR, "approvals/presentation-content-approvals.csv"),
    path.join(sourceDir, "approvals/presentation-content-approvals.csv"),
    { recursive: true },
  );

  const approvalPath = path.join(
    sourceDir,
    "approvals/presentation-content-approvals.csv",
  );
  const approvalText = await readFile(approvalPath, "utf8");
  await writeFile(
    approvalPath,
    approvalText.replace(
      "P-0,1,palette-mapping-wcag,draft,,,",
      "P-0,1,palette-mapping-wcag,approved,user,2026-07-30,P-0 fixture approval",
    ),
    "utf8",
  );
  for (const fileName of ["palettes.csv", "palette-usage-mappings.csv"]) {
    const filePath = path.join(
      sourceDir,
      "presentation/presentation-v2",
      fileName,
    );
    await writeFile(
      filePath,
      (await readFile(filePath, "utf8")).replaceAll(",draft\r\n", ",approved\r\n"),
      "utf8",
    );
  }

  const model = await loadPresentationReviewModel({ sourceDir });
  const report = renderPresentationReview(model);
  assert.match(report, /承認状況: approved=P-0; draft=P-1, P-2, P-3, P-4, P-5, P-6/);
  assert.doesNotMatch(report, /すべての行とP-0〜P-6は未承認/);
  assert.match(report, /## P-0 パレットと用途色（approved）/);
  assert.match(report, /## P-1 香調語彙と素材（draft）/);
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
  const first = await readFile(firstPath);
  assert.deepEqual(first, await readFile(secondPath));
  assert.deepEqual(
    first,
    await readFile(path.join(ROOT, "docs/presentation-content-catalog.md")),
  );
});
