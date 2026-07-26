import assert from "node:assert/strict";
import test from "node:test";

import { FACTOR_ORDER } from "../js/data/factor-order.js";
import { renderHistoryScreen } from "../js/presentation/history-screen.js";
import { collectElements, collectText, createFakeScreen } from "./helpers/fake-dom.js";
import { createTestResultSnapshot } from "./helpers/result-snapshot-fixture.js";

function snapshot({
  resultId,
  completedAt,
  questionCount,
  titleId = "title-balanced",
} = {}) {
  return {
    resultId,
    completedAt,
    questionCount,
    mode: questionCount === 20 ? "preview20" : "detail50",
    versionTuple: {
      scaleVersion: "ipip-ja-50-v1",
      questionVersion: "ipip-ja-50-question-set-v1",
      scoringVersion: "ipip-ja-50-scoring-v1",
      resultTextVersion: "result-text-v1",
      titleRuleVersion: "title-rule-v1",
      characterManifestVersion: "character-manifest-v1",
      presentationDefinitionVersion: "presentation-v1",
      cardTemplateVersion: "card-template-v1",
      appVersion: "mvp-0.1.0",
    },
    factors: FACTOR_ORDER.map((factorId, index) => ({
      factorId,
      rawMean: 3 + (index / 10),
      displayScore: 50 + (index * 3),
    })),
    titleId,
    characterId: "character-balanced",
    renderedTexts: [
      { section: "titleSubtitle", text: "診断時の副題" },
      { section: "observation", text: "診断時の観察文" },
    ],
  };
}

const screenLabels = Object.freeze({
  factorLabels: Object.freeze({
    intellectImagination: "知性・想像力",
    conscientiousness: "勤勉性",
    extraversion: "外向性",
    agreeableness: "協調性",
    emotionalStability: "情緒安定性",
  }),
  titleLabels: Object.freeze({
    "title-balanced": "五つの風を見渡す観測者",
  }),
});

test("T-006 S-006 renders saved result cards without exposing answers", () => {
  const { host } = createFakeScreen();
  const newest = snapshot({
    resultId: "00000000-0000-4000-8000-000000000002",
    completedAt: "2026-07-26T12:00:00.000Z",
    questionCount: 50,
  });
  const older = snapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
    completedAt: "2026-07-25T12:00:00.000Z",
    questionCount: 20,
  });

  renderHistoryScreen(host, { status: "ok", results: [newest, older], ...screenLabels }, {});

  const text = collectText(host);
  assert.match(text, /五つの風を見渡す観測者/);
  assert.match(text, /50問 詳細結果/);
  assert.match(text, /20問 簡易プレビュー/);
  assert.match(text, /知性・想像力/);
  assert.match(text, /情緒安定性/);
  assert.match(text, /診断時の副題/);
  assert.match(text, /診断時の観察文/);
  assert.match(text, /詳細を開く/);
  assert.match(text, /ipip-ja-50-v1/);
  assert.doesNotMatch(text, /answers/);
  assert.deepEqual(
    collectElements(host)
      .filter(({ tagName }) => tagName === "time")
      .map(({ attributes }) => attributes.get("datetime")),
    [newest.completedAt, older.completedAt],
  );
});

test("T-006 S-006 delegates exact individual and all-data deletion actions", () => {
  const { host } = createFakeScreen();
  const first = snapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
    completedAt: "2026-07-26T12:00:00.000Z",
    questionCount: 50,
  });
  const calls = [];

  renderHistoryScreen(host, { status: "ok", results: [first], ...screenLabels }, {
    onDeleteResult: (resultId) => calls.push(["one", resultId]),
    onDeleteAll: () => calls.push(["all"]),
  });

  const buttons = collectElements(host).filter(({ tagName }) => tagName === "button");
  buttons.find(({ textContent }) => textContent === "この結果を削除").dispatch("click");
  buttons.find(({ textContent }) => textContent === "端末内データをすべて削除").dispatch("click");

  assert.deepEqual(calls, [
    ["one", first.resultId],
    ["all"],
  ]);
});

test("T-005/T-006 S-006 opens one exact saved result on an independent screen", () => {
  const { host } = createFakeScreen();
  const first = snapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
    completedAt: "2026-07-26T12:00:00.000Z",
    questionCount: 50,
  });
  const opened = [];

  renderHistoryScreen(host, { status: "ok", results: [first], ...screenLabels }, {
    onOpenResult: (resultId) => opened.push(resultId),
  });

  const openButton = collectElements(host).find(({ tagName, textContent }) =>
    tagName === "button" && textContent === "この結果を開く");
  assert.ok(openButton);
  openButton.dispatch("click");
  assert.deepEqual(opened, [first.resultId]);
});

test("T-006 S-006 keeps all-data deletion reachable when result history is empty", () => {
  const { host } = createFakeScreen();
  let deleteAllCalls = 0;

  renderHistoryScreen(host, { status: "ok", results: [], ...screenLabels }, {
    onDeleteAll: () => { deleteAllCalls += 1; },
  });

  const deleteAllButton = collectElements(host).find(({ tagName, textContent }) =>
    tagName === "button" && textContent === "端末内データをすべて削除");
  assert.ok(deleteAllButton);
  deleteAllButton.dispatch("click");
  assert.equal(deleteAllCalls, 1);
});

test("T-006 S-006 enables only compatible second results and delegates chronological comparison", () => {
  const { host } = createFakeScreen();
  const newest = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000003",
    completedAt: "2026-07-26T12:00:00.000Z",
    rawMeans: [4, 3, 3, 3, 3],
  });
  const compatibleOlder = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
    completedAt: "2026-07-25T12:00:00.000Z",
    rawMeans: [3, 3, 3, 3, 3],
  });
  const incompatiblePreview = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000002",
    completedAt: "2026-07-24T12:00:00.000Z",
    questionCount: 20,
  });
  const comparisons = [];

  renderHistoryScreen(
    host,
    { status: "ok", results: [newest, compatibleOlder, incompatiblePreview], ...screenLabels },
    { onCompare: (comparison) => comparisons.push(comparison) },
  );

  const compareButtons = collectElements(host)
    .filter(({ tagName, textContent }) => tagName === "button" && textContent === "比較対象に選ぶ");
  compareButtons[0].dispatch("click");

  assert.equal(compareButtons[0].disabled, true);
  assert.equal(compareButtons[1].disabled, false);
  assert.equal(compareButtons[2].disabled, true);
  assert.match(collectText(host), /設問数が異なるため比較できません/);

  compareButtons[1].dispatch("click");

  assert.equal(comparisons.length, 1);
  assert.equal(comparisons[0].beforeResultId, compatibleOlder.resultId);
  assert.equal(comparisons[0].afterResultId, newest.resultId);
});

test("T-006 S-006 can clear the first comparison selection without reloading", () => {
  const { host } = createFakeScreen();
  const first = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
  });
  const second = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000002",
    completedAt: "2026-07-26T12:00:00.000Z",
  });

  renderHistoryScreen(
    host,
    { status: "ok", results: [second, first], ...screenLabels },
    {},
  );

  const compareButtons = collectElements(host)
    .filter(({ tagName, textContent }) => tagName === "button" && textContent === "比較対象に選ぶ");
  compareButtons[0].dispatch("click");
  const resetButton = collectElements(host).find(({ tagName, textContent }) =>
    tagName === "button" && textContent === "比較選択をやり直す");
  assert.equal(resetButton.hidden, false);

  resetButton.dispatch("click");

  assert.equal(resetButton.hidden, true);
  assert.equal(compareButtons[0].disabled, false);
  assert.equal(compareButtons[0].textContent, "比較対象に選ぶ");
  assert.equal(compareButtons[1].disabled, false);
  assert.doesNotMatch(collectText(host), /1件目に選択済み/);
});
