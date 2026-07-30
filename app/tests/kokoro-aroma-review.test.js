import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";

import {
  loadKokoroAromaReviewModel,
  renderKokoroAromaReview,
} from "../../scripts/content/render-kokoro-aroma-review.mjs";

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "../..");
const SOURCE_DIR = path.join(ROOT, "content/source");

test("T-005/T-007 F-018 review covers every aroma master and title", async () => {
  const model = await loadKokoroAromaReviewModel({ sourceDir: SOURCE_DIR });
  const report = renderKokoroAromaReview(model);
  assert.match(report, /^# ココロアロマ確認資料/m);
  assert.match(report, /## 香調マスタ（29件）/);
  assert.match(report, /## 香り素材（25件）/);
  assert.match(report, /- 判定: 適合/);
  assert.match(report, /- 違反: 0件/);
  assert.match(report, /- 関連行: 306件/);
  assert.match(report, /fragrance-pause-sweet-orange/);
  assert.match(report, /fragrance-reset-ginger/);
  assert.equal(model.definitionSet.fragrances.some(
    ({ fragranceId }) => fragranceId === "fragrance-pause-ylang-ylang",
  ), false);
  assert.equal(model.definitionSet.fragrances.some(
    ({ fragranceId }) => fragranceId === "fragrance-reset-citronella",
  ), false);

  const titleHeadings = [...report.matchAll(
    /^### (\d+)\. (.+?) \(`(title-[^`]+)`\)$/gm,
  )];
  assert.equal(titleHeadings.length, 51);
  const blocks = report.split(
    /^### \d+\. .+? \(`title-[^`]+`\)$/gm,
  ).slice(1, 52);
  assert.equal(blocks.length, 51);
  for (const block of blocks) {
    assert.equal((block.match(/^- (?:★ 共有代表|候補):/gm) ?? []).length, 6);
    assert.equal((block.match(/^- 共有カード:/gm) ?? []).length, 3);
  }
  assert.match(report, /\| P-1 \| [^|]+ \| approved \|/);
  assert.match(report, /\| P-2 \| [^|]+ \| approved \|/);
  assert.match(report, /\| P-3 \| [^|]+ \| approved \|/);
  assert.match(report, /\| P-4 \| [^|]+ \| approved \|/);
  assert.match(report, /\| P-5 \| [^|]+ \| approved \|/);
  assert.match(report, /\| P-6 \| [^|]+ \| draft \|/);
});

test("T-005/T-007 F-018 aroma review CLI is byte deterministic", async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "kokoro-aroma-review-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const outputs = [
    path.join(directory, "first.md"),
    path.join(directory, "second.md"),
  ];
  for (const outputPath of outputs) {
    await execFileAsync(process.execPath, [
      path.join(ROOT, "scripts/content/render-kokoro-aroma-review.mjs"),
      "--source",
      SOURCE_DIR,
      "--output",
      outputPath,
    ]);
  }
  const first = await readFile(outputs[0]);
  assert.deepEqual(first, await readFile(outputs[1]));
  assert.deepEqual(
    first,
    await readFile(path.join(ROOT, "docs/kokoro-aroma-review.md")),
  );
});
