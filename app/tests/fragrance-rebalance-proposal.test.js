import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";

import {
  proposeFragranceRebalance,
  renderSelectorFragrancesCsv,
} from "../../scripts/content/propose-fragrance-rebalance.mjs";
import {
  loadPresentationReviewModel,
} from "../../scripts/content/render-presentation-review.mjs";

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "../..");
const SOURCE_DIR = path.join(ROOT, "content/source");

test("T-005 F-018 proposal preserves 306 structural rows and passes every audit", async () => {
  const model = await loadPresentationReviewModel({ sourceDir: SOURCE_DIR });
  const proposal = proposeFragranceRebalance(model.definitionSet);
  assert.equal(proposal.audit.valid, true);
  assert.deepEqual(proposal.audit.findings, []);
  assert.equal(proposal.titleSelectors.length, 51);
  assert.equal(
    proposal.titleSelectors.flatMap(({ fragranceScenes }) =>
      fragranceScenes.flatMap(({ candidateFragranceIds }) =>
        candidateFragranceIds)).length,
    306,
  );
  proposal.titleSelectors.forEach((selector, titleIndex) => {
    const source = model.definitionSet.titleSelectors[titleIndex];
    assert.equal(selector.titleId, source.titleId);
    assert.deepEqual(selector.alternativePaletteIds,
      source.alternativePaletteIds);
    assert.equal(selector.fragranceScenes.length, 3);
    selector.fragranceScenes.forEach((scene, sceneIndex) => {
      assert.equal(scene.sceneId, model.definitionSet.scenes[sceneIndex].sceneId);
      assert.equal(scene.candidateFragranceIds.length, 2);
      assert.equal(new Set(scene.candidateFragranceIds).size, 2);
      assert.equal(scene.candidateFragranceIds.includes(scene.shareFragranceId),
        true);
    });
  });
  const csv = renderSelectorFragrancesCsv(proposal.titleSelectors);
  assert.equal(csv.trimEnd().split(/\r?\n/).length, 307);
  assert.equal((csv.match(/,true,draft\r\n/g) ?? []).length, 153);
  assert.equal((csv.match(/,false,draft\r\n/g) ?? []).length, 153);
  const sourceCsv = await readFile(path.join(
    SOURCE_DIR,
    "presentation/presentation-v2/selector-fragrances.csv",
  ), "utf8");
  assert.equal((sourceCsv.match(/,true,approved\r\n/g) ?? []).length, 93);
  assert.equal((sourceCsv.match(/,false,approved\r\n/g) ?? []).length, 93);
  assert.equal((sourceCsv.match(/,true,draft\r\n/g) ?? []).length, 60);
  assert.equal((sourceCsv.match(/,false,draft\r\n/g) ?? []).length, 60);
  assert.equal(
    sourceCsv.replace(/,approved\r\n/g, ",draft\r\n"),
    csv,
  );
});

test("T-005 F-018 proposal and CLI output are byte deterministic", async (t) => {
  const model = await loadPresentationReviewModel({ sourceDir: SOURCE_DIR });
  const first = proposeFragranceRebalance(model.definitionSet);
  const second = proposeFragranceRebalance(model.definitionSet);
  assert.deepEqual(first, second);

  const directory = await mkdtemp(path.join(os.tmpdir(), "aroma-proposal-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const outputs = [path.join(directory, "first.csv"), path.join(directory, "second.csv")];
  for (const outputPath of outputs) {
    await execFileAsync(process.execPath, [
      path.join(ROOT, "scripts/content/propose-fragrance-rebalance.mjs"),
      "--source",
      SOURCE_DIR,
      "--output",
      outputPath,
    ]);
  }
  assert.deepEqual(await readFile(outputs[0]), await readFile(outputs[1]));
  assert.equal(
    (await readFile(outputs[0], "utf8")),
    renderSelectorFragrancesCsv(first.titleSelectors),
  );
});
