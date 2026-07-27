import assert from "node:assert/strict";
import test from "node:test";

import { renderHistoryScreen } from "../js/presentation/history-screen.js";
import { collectElements, collectText, createFakeScreen } from "./helpers/fake-dom.js";
import {
  createTestResultSnapshot,
  TEST_VERSION_TUPLE,
} from "./helpers/result-snapshot-fixture.js";

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

const characterEntry = Object.freeze({
  characterId: "character-balanced",
  assetVersion: "character-balanced-v1",
  imagePath: "assets/characters/character-balanced.webp",
  width: 1024,
  height: 1024,
  alt: "五枚の葉のモビールを見上げて座る猫。",
  integrity: "sha256-gVfqsXoZbwa5AVZhAGwvT2via6MzHVbuVfrr3tK8seo=",
});

function clickButton(host, label) {
  const button = collectElements(host).find(
    ({ tagName, textContent }) =>
      tagName === "button" && textContent === label,
  );
  assert.ok(button, `missing button: ${label}`);
  button.dispatch("click");
}

function historyCards(host) {
  return collectElements(host).filter(
    ({ className }) => className === "history-card",
  );
}

test("T-008A F-009 renders only the compact normal-card contract", () => {
  const { host } = createFakeScreen();
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000101",
    completedAt: "2026-07-27T12:00:00.000Z",
  });
  const opened = [];

  renderHistoryScreen(
    host,
    { status: "ok", results: [target], ...screenLabels },
    { onOpenResult: (resultId) => opened.push(resultId) },
  );

  const [card] = historyCards(host);
  const text = collectText(card);
  assert.equal(card.attributes.get("data-result-id"), target.resultId);
  assert.match(text, /五つの風を見渡す観測者/);
  assert.match(text, /50問 詳細結果/);
  assert.match(text, /結果を見る/);
  assert.doesNotMatch(
    text,
    /知性・想像力|五つの因子を見渡した結果です|character-balanced|ipip-ja-50-v1|削除|比較/,
  );
  assert.equal(
    collectElements(card).filter(({ tagName }) => tagName === "button").length,
    1,
  );

  clickButton(card, "結果を見る");
  assert.deepEqual(opened, [target.resultId]);
});

test("T-008A F-009 loads only the matching Q-012 thumbnail after viewport entry", async () => {
  const { host } = createFakeScreen();
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000102",
  });
  const image = host.ownerDocument.createElement("img");
  let onEnter;
  let requests = 0;

  renderHistoryScreen(
    host,
    { status: "ok", results: [target], ...screenLabels },
    {},
    {
      resolveCharacterEntry: () => characterEntry,
      observeViewport(_frame, callback) {
        onEnter = callback;
      },
      decodeImage: async () => image,
      async loadCharacterImage(entry, { decodeImage }) {
        requests += 1;
        assert.equal(entry.characterId, target.characterId);
        return {
          status: "loaded",
          image: await decodeImage(entry.imagePath),
          alt: entry.alt,
        };
      },
    },
  );

  const frame = collectElements(host).find(
    ({ className }) => className === "history-character-frame",
  );
  assert.equal(frame.attributes.get("data-character-state"), "pending");
  assert.equal(requests, 0);
  assert.equal(typeof onEnter, "function");

  await onEnter();

  assert.equal(requests, 1);
  assert.equal(frame.attributes.get("data-character-state"), "loaded");
  const images = collectElements(frame).filter(({ tagName }) => tagName === "img");
  assert.equal(images.length, 1);
  assert.equal(images[0].attributes.get("alt"), characterEntry.alt);
});

test("T-008A F-015 preserves approved alt when a history thumbnail fails", async () => {
  const { host } = createFakeScreen();
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000103",
  });
  let onEnter;

  renderHistoryScreen(
    host,
    { status: "ok", results: [target], ...screenLabels },
    {},
    {
      resolveCharacterEntry: () => characterEntry,
      observeViewport(_frame, callback) {
        onEnter = callback;
      },
      decodeImage: async () => {
        throw new Error("decode failed");
      },
      async loadCharacterImage(entry) {
        return { status: "unavailable", image: null, alt: entry.alt };
      },
    },
  );

  await onEnter();

  const frame = collectElements(host).find(
    ({ className }) => className === "history-character-frame",
  );
  assert.equal(frame.attributes.get("data-character-state"), "unavailable");
  assert.match(collectText(frame), new RegExp(characterEntry.alt));
  assert.equal(
    collectElements(frame).filter(({ tagName }) => tagName === "img").length,
    0,
  );
});

test("T-008A F-013 exposes deletion and versions only through history management", () => {
  const { host } = createFakeScreen();
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000104",
  });
  const deleted = [];
  let deleteAllCalls = 0;

  renderHistoryScreen(
    host,
    { status: "ok", results: [target], ...screenLabels },
    {
      onDeleteResult: (resultId) => deleted.push(resultId),
      onDeleteAll: () => { deleteAllCalls += 1; },
    },
  );

  const [card] = historyCards(host);
  assert.doesNotMatch(collectText(card), /削除|バージョン|mvp-0\.1\.0/);

  const toggle = collectElements(host).find(
    ({ className }) => className === "history-management-toggle",
  );
  const menu = collectElements(host).find(
    ({ className }) => className === "history-management-menu",
  );
  assert.equal(toggle.textContent, "…");
  assert.equal(toggle.attributes.get("aria-label"), "履歴の管理");
  assert.equal(toggle.attributes.get("aria-expanded"), "false");
  assert.equal(menu.hidden, true);

  toggle.dispatch("click");

  assert.equal(toggle.attributes.get("aria-expanded"), "true");
  assert.equal(menu.hidden, false);
  assert.match(collectText(menu), /この結果を削除/);
  assert.match(collectText(menu), /端末内データをすべて削除/);
  assert.match(collectText(menu), /診断時のバージョン/);
  assert.match(collectText(menu), /mvp-0\.1\.0/);

  const deleteOne = collectElements(menu).find(
    ({ tagName, textContent }) =>
      tagName === "button" && textContent.endsWith("この結果を削除"),
  );
  deleteOne.dispatch("click");
  clickButton(menu, "端末内データをすべて削除");
  assert.deepEqual(deleted, [target.resultId]);
  assert.equal(deleteAllCalls, 1);
});

test("T-008A F-013 keeps all-data deletion reachable for empty history", () => {
  const { host } = createFakeScreen();
  let deleteAllCalls = 0;

  renderHistoryScreen(
    host,
    { status: "ok", results: [], ...screenLabels },
    { onDeleteAll: () => { deleteAllCalls += 1; } },
  );

  const toggle = collectElements(host).find(
    ({ className }) => className === "history-management-toggle",
  );
  assert.ok(toggle);
  toggle.dispatch("click");
  clickButton(host, "端末内データをすべて削除");
  assert.equal(deleteAllCalls, 1);
});

test("T-008A F-010 selects at most two compatible cards and compares only on explicit action", () => {
  const { host } = createFakeScreen();
  const newest = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000111",
    completedAt: "2026-07-27T12:00:00.000Z",
  });
  const older = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000112",
    completedAt: "2026-07-26T12:00:00.000Z",
  });
  const thirdCompatible = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000113",
    completedAt: "2026-07-25T12:00:00.000Z",
  });
  const incompatible = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000114",
    questionCount: 20,
  });
  const comparisons = [];

  renderHistoryScreen(
    host,
    {
      status: "ok",
      results: [newest, older, thirdCompatible, incompatible],
      ...screenLabels,
    },
    { onCompare: (comparison) => comparisons.push(comparison) },
  );

  clickButton(host, "結果を比較する");
  let toggles = collectElements(host).filter(
    ({ className }) => className === "history-card-select-toggle",
  );
  assert.equal(toggles.length, 4);
  toggles[0].dispatch("click");

  toggles = collectElements(host).filter(
    ({ className }) => className === "history-card-select-toggle",
  );
  assert.equal(host.ownerDocument.activeElement, toggles[0]);
  assert.equal(toggles[0].attributes.get("aria-pressed"), "true");
  assert.equal(toggles[1].disabled, false);
  assert.equal(toggles[2].disabled, false);
  assert.equal(toggles[3].disabled, true);
  assert.match(collectText(host), /設問数が異なるため比較できません/);

  toggles[1].dispatch("click");
  toggles = collectElements(host).filter(
    ({ className }) => className === "history-card-select-toggle",
  );
  assert.equal(host.ownerDocument.activeElement, toggles[1]);
  assert.equal(toggles[2].disabled, true);
  toggles[2].dispatch("click");
  assert.deepEqual(comparisons, []);
  assert.match(collectText(host), /2件選択中/);

  clickButton(host, "選択した2件を比較");
  assert.equal(comparisons.length, 1);
  assert.equal(comparisons[0].beforeResultId, older.resultId);
  assert.equal(comparisons[0].afterResultId, newest.resultId);
});

test("T-008A F-010 cancels comparison and restores normal result cards", () => {
  const { host } = createFakeScreen();
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000115",
  });

  renderHistoryScreen(
    host,
    { status: "ok", results: [target], ...screenLabels },
    {},
  );
  clickButton(host, "結果を比較する");
  collectElements(host).find(
    ({ className }) => className === "history-card-select-toggle",
  ).dispatch("click");
  clickButton(host, "キャンセル");

  assert.equal(
    collectElements(host).filter(
      ({ className }) => className === "history-card-select-toggle",
    ).length,
    0,
  );
  assert.match(collectText(host), /結果を見る/);
  assert.match(collectText(host), /結果を比較する/);
  assert.doesNotMatch(collectText(host), /件選択中/);
});

test("T-008A F-015 does not expose destructive controls after a history read error", () => {
  const { host } = createFakeScreen();

  renderHistoryScreen(
    host,
    { status: "error", results: [], ...screenLabels },
    { onDeleteAll() {} },
  );

  assert.match(collectText(host), /保存データを読み込めませんでした/);
  assert.equal(
    collectElements(host).filter(
      ({ className }) => className === "history-management-toggle",
    ).length,
    0,
  );
  assert.doesNotMatch(collectText(host), /削除/);
});

test("T-008A preserves operation notices and exact version values", () => {
  const { host } = createFakeScreen();
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000116",
    versionTuple: {
      ...TEST_VERSION_TUPLE,
      appVersion: "mvp-0.1.0",
    },
  });

  renderHistoryScreen(
    host,
    { status: "ok", results: [target], ...screenLabels },
    {
      operationNotice: {
        kind: "success",
        text: "診断結果を1件削除しました。",
      },
    },
  );

  const notice = collectElements(host).find(
    ({ className }) => className === "notice success-notice",
  );
  assert.equal(notice.attributes.get("role"), "status");
  assert.match(collectText(host), /mvp-0\.1\.0/);
});
