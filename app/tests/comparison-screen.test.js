import assert from "node:assert/strict";
import test from "node:test";

import { compareResultSnapshots } from "../js/domain/result-comparison.js";
import { renderComparisonScreen } from "../js/presentation/comparison-screen.js";
import { collectElements, collectText, createFakeScreen } from "./helpers/fake-dom.js";
import {
  TEST_VERSION_TUPLE,
  createTestResultSnapshot,
} from "./helpers/result-snapshot-fixture.js";

const factorLabels = Object.freeze({
  intellectImagination: "知性・想像力",
  conscientiousness: "勤勉性",
  extraversion: "外向性",
  agreeableness: "協調性",
  emotionalStability: "情緒安定性",
});

test("T-006 S-007 renders chronological raw-mean deltas with non-color direction labels", () => {
  const { host } = createFakeScreen();
  const before = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
    completedAt: "2026-07-25T12:00:00.000Z",
    rawMeans: [3, 4, 3, 3, 3],
  });
  const after = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000002",
    completedAt: "2026-07-26T12:00:00.000Z",
    rawMeans: [4, 3, 3, 3, 3],
  });
  const comparison = compareResultSnapshots(after, before);

  renderComparisonScreen(host, {
    status: "ok",
    before,
    after,
    comparison,
    factorLabels,
  });

  const text = collectText(host);
  assert.match(text, /診断結果の比較/);
  assert.match(text, /古い結果/);
  assert.match(text, /今回の結果/);
  assert.match(text, /知性・想像力/);
  assert.match(text, /＋25.*増加/);
  assert.match(text, /−25.*減少/);
  assert.match(text, /±0.*変化なし/);
  assert.match(text, /性格の確定的な変化を示すものではありません/);
  assert.match(text, /回答時の状況や自己認識でも変動/);
  assert.doesNotMatch(text, /answers/);
});

test("T-006 S-007 explains differing presentation versions without blocking compatible scores", () => {
  const { host } = createFakeScreen();
  const before = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
    versionTuple: TEST_VERSION_TUPLE,
  });
  const afterVersion = {
    ...TEST_VERSION_TUPLE,
    resultTextVersion: "result-text-v2",
  };
  const after = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000002",
    completedAt: "2026-07-26T12:00:00.000Z",
    versionTuple: afterVersion,
  });

  renderComparisonScreen(host, {
    status: "ok",
    before,
    after,
    comparison: compareResultSnapshots(before, after),
    factorLabels,
  });

  const text = collectText(host);
  assert.match(text, /スコアは比較できます/);
  assert.match(text, /表示表現の版が異なります/);
  assert.match(text, /result-text-v1/);
  assert.match(text, /result-text-v2/);
});

test("T-006 S-007 treats a different selected character asset as a presentation-version difference", () => {
  const { host } = createFakeScreen();
  const before = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
  });
  const after = structuredClone(createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000002",
    completedAt: "2026-07-26T12:00:00.000Z",
  }));
  after.characterAssetVersion = "character-balanced-asset-v2";

  renderComparisonScreen(host, {
    status: "ok",
    before,
    after,
    comparison: compareResultSnapshots(before, after),
    factorLabels,
  });

  const text = collectText(host);
  assert.match(text, /characterAssetVersion/);
  assert.match(text, /character-balanced-v1/);
  assert.match(text, /character-balanced-asset-v2/);
});

test("T-006 S-007 returns missing, deleted, and incompatible selections to history", () => {
  for (const [state, message] of [
    [{ status: "missing-selection" }, /比較する2件を履歴から選んでください/],
    [{ status: "result-unavailable" }, /選択した結果を確認できません/],
    [{ status: "incompatible", code: "COMPARE_QUESTION_COUNT_MISMATCH" }, /設問数が異なるため比較できません/],
  ]) {
    const { host } = createFakeScreen();
    renderComparisonScreen(host, state);
    assert.match(collectText(host), message);
    assert.ok(collectElements(host).some(({ attributes }) => attributes.get("href") === "#/history"));
  }
});
