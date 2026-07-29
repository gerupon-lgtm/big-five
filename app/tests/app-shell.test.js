import assert from "node:assert/strict";
import test from "node:test";

import { FORMAL_STORAGE_KEY } from "../js/infrastructure/progress-storage.js";
import { answerCurrent as answerProgress, choosePreviewExit, createProgressRecord } from "../js/domain/response-state.js";
import { appMeta } from "../js/config/app-meta.js";
import { DiagnosticDefinition } from "../js/data/diagnostic-definition.js";
import { startApp } from "../js/main.js";
import { FakeElement, collectElements, collectText } from "./helpers/fake-dom.js";
import { createTestResultSnapshot } from "./helpers/result-snapshot-fixture.js";

test("startApp renders the start heading and canonical version from a hash route", () => {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
    getElementById(id) {
      return id === "app" ? host : null;
    },
  };
  const host = new FakeElement("div", documentObject);
  const windowObject = {
    location: { hash: "#/start" },
    addEventListener() {},
  };
  const historyObject = {
    replaceState() {
      throw new Error("canonical route must not be replaced");
    },
  };

  startApp({ documentObject, historyObject, windowObject });

  const renderedText = collectText(host);
  assert.match(renderedText, /Big Five 自己理解チェック/);
  assert.equal(
    collectElements(host)
      .find(({ className }) => className === "app-brand-name")
      .textContent,
    "Big Five 自己理解チェック",
  );
  assert.equal(
    collectElements(host)
      .find(({ className }) => className === "app-brand-subtitle")
      .textContent,
    "BIG FIVE SELF UNDERSTANDING",
  );
  assert.match(renderedText, /バージョン mvp-0\.1\.0/);
  assert.match(renderedText, /ipip-ja-50-v1/);
  assert.match(renderedText, /ipip-ja-50-question-set-v1/);
  assert.match(renderedText, /ipip-ja-50-scoring-v1/);
  assert.ok(collectElements(host).some((element) => element.attributes.get("href") === "#/history"));
});

test("T-006 S-006 startApp renders the empty history state from browser storage", () => {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
    getElementById(id) {
      return id === "app" ? host : null;
    },
  };
  const host = new FakeElement("div", documentObject);
  const windowObject = {
    location: { hash: "#/history" },
    addEventListener() {},
  };
  const historyObject = {
    replaceState() {
      throw new Error("canonical route must not be replaced");
    },
  };
  const storage = {
    getItem() {
      return null;
    },
  };

  startApp({
    documentObject,
    historyObject,
    windowObject,
    storage,
    nowProvider: () => "2026-07-26T12:00:00.000Z",
  });

  const renderedText = collectText(host);
  assert.match(renderedText, /診断結果の履歴/);
  assert.match(renderedText, /まだ結果がありません/);
  assert.match(renderedText, /診断を始める/);
});

test("T-006 S-006 confirms in-app and deletes one exact history result through startApp", () => {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
    getElementById(id) {
      return id === "app" ? host : null;
    },
  };
  const host = new FakeElement("div", documentObject);
  const windowObject = {
    location: { hash: "#/history" },
    addEventListener() {},
  };
  const historyObject = { replaceState() {} };
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
  });
  let raw = JSON.stringify({
    schemaVersion: 1,
    updatedAt: "2026-07-26T12:00:00.000Z",
    progressByDiagnosis: { retained: { bad: true } },
    results: [target],
  });
  const storage = {
    getItem(key) {
      assert.equal(key, FORMAL_STORAGE_KEY);
      return raw;
    },
    setItem(key, value) {
      assert.equal(key, FORMAL_STORAGE_KEY);
      raw = value;
    },
  };
  startApp({
    documentObject,
    historyObject,
    windowObject,
    storage,
    nowProvider: () => "2026-07-26T12:05:00.000Z",
  });

  collectElements(host)
    .find(({ className }) => className === "history-management-toggle")
    .dispatch("click");
  collectElements(host)
    .find(({ tagName, textContent }) =>
      tagName === "button" && textContent.endsWith("この履歴を削除"))
    .dispatch("click");
  collectElements(host)
    .find(({ tagName, textContent }) =>
      tagName === "button" && textContent === "削除する")
    .dispatch("click");

  assert.deepEqual(JSON.parse(raw).results, []);
  assert.deepEqual(JSON.parse(raw).progressByDiagnosis, { retained: { bad: true } });
  assert.match(collectText(host), /まだ結果がありません/);
});

test("T-006 S-006 confirms and clears progress and history through startApp", () => {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
    getElementById(id) {
      return id === "app" ? host : null;
    },
  };
  const host = new FakeElement("div", documentObject);
  const windowObject = {
    location: { hash: "#/history" },
    addEventListener() {},
  };
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000002",
  });
  let raw = JSON.stringify({
    schemaVersion: 1,
    updatedAt: "2026-07-26T12:00:00.000Z",
    progressByDiagnosis: { retained: { bad: true } },
    results: [target],
  });
  const storage = {
    getItem: () => raw,
    setItem: (_key, value) => { raw = value; },
  };

  startApp({
    documentObject,
    historyObject: { replaceState() {} },
    windowObject,
    storage,
    nowProvider: () => "2026-07-26T12:05:00.000Z",
    confirmProvider: () => true,
  });

  collectElements(host)
    .find(({ className }) => className === "history-management-toggle")
    .dispatch("click");
  collectElements(host)
    .find(({ tagName, textContent }) =>
      tagName === "button" && textContent === "端末内データをすべて削除")
    .dispatch("click");
  collectElements(host)
    .find(({ tagName, textContent }) =>
      tagName === "button" && textContent === "すべて削除する")
    .dispatch("click");

  assert.deepEqual(JSON.parse(raw).progressByDiagnosis, {});
  assert.deepEqual(JSON.parse(raw).results, []);
  assert.match(collectText(host), /まだ結果がありません/);
});

test("T-006 S-006/S-007 selects two compatible results and opens their comparison", () => {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
    getElementById(id) {
      return id === "app" ? host : null;
    },
  };
  const host = new FakeElement("div", documentObject);
  const windowObject = {
    location: { hash: "#/history" },
    addEventListener() {},
  };
  const before = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
    completedAt: "2026-07-25T12:00:00.000Z",
    rawMeans: [3, 3, 3, 3, 3],
  });
  const after = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000002",
    completedAt: "2026-07-26T12:00:00.000Z",
    rawMeans: [4, 3, 3, 3, 3],
  });
  const raw = JSON.stringify({
    schemaVersion: 1,
    updatedAt: "2026-07-26T12:00:00.000Z",
    progressByDiagnosis: {},
    results: [before, after],
  });

  startApp({
    documentObject,
    historyObject: { replaceState() {} },
    windowObject,
    storage: { getItem: () => raw },
    nowProvider: () => "2026-07-26T12:05:00.000Z",
  });

  collectElements(host)
    .find(({ tagName, textContent }) =>
      tagName === "button" && textContent === "結果を比較する")
    .dispatch("click");
  let compareButtons = collectElements(host)
    .filter(({ className }) => className === "history-card-select-toggle");
  compareButtons[0].dispatch("click");
  compareButtons = collectElements(host)
    .filter(({ className }) => className === "history-card-select-toggle");
  compareButtons[1].dispatch("click");
  collectElements(host)
    .find(({ tagName, textContent }) =>
      tagName === "button" && textContent === "選択した2件を比較")
    .dispatch("click");

  assert.equal(
    windowObject.location.hash,
    `#/compare?before=${before.resultId}&after=${after.resultId}`,
  );
  assert.match(collectText(host), /診断結果の比較/);
  assert.match(collectText(host), /性格の確定的な変化を示すものではありません/);
});

test("T-006 S-007 returns a direct comparison URL without two IDs to history", () => {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
    getElementById(id) {
      return id === "app" ? host : null;
    },
  };
  const host = new FakeElement("div", documentObject);
  let replacedHash = null;

  startApp({
    documentObject,
    historyObject: {
      replaceState(_state, _title, hash) {
        replacedHash = hash;
      },
    },
    windowObject: {
      location: { hash: "#/compare" },
      addEventListener() {},
    },
    storage: { getItem: () => null },
    nowProvider: () => "2026-07-26T12:05:00.000Z",
  });

  assert.equal(replacedHash, "#/history");
  assert.match(collectText(host), /診断結果の履歴/);
  assert.match(collectText(host), /まだ結果がありません/);
});

test("T-005/T-006 S-004 opens one saved detail result by resultId", () => {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
    getElementById(id) {
      return id === "app" ? host : null;
    },
  };
  const host = new FakeElement("div", documentObject);
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
  });
  const raw = JSON.stringify({
    schemaVersion: 1,
    updatedAt: "2026-07-26T12:00:00.000Z",
    progressByDiagnosis: {},
    results: [target],
  });

  startApp({
    documentObject,
    historyObject: { replaceState() {} },
    windowObject: {
      location: { hash: `#/result?resultId=${target.resultId}` },
      addEventListener() {},
    },
    storage: { getItem: () => raw },
    nowProvider: () => "2026-07-26T12:05:00.000Z",
  });

  const text = collectText(host);
  assert.match(text, /50問詳細結果/);
  assert.match(text, /五つの風を見渡す観測者/);
  assert.match(text, /心理学上の正式なタイプではありません/);
  assert.match(text, /画像を利用できない場合も診断結果は有効です/);
  assert.match(text, /根拠を確認/);
  assert.doesNotMatch(text, /answers/);
});

test("T-008A F-008 does not fabricate current method facts for an unregistered historical definition", () => {
  for (const [index, field] of [
    [1, "scaleVersion"],
    [2, "questionVersion"],
    [3, "scoringVersion"],
  ]) {
    const documentObject = {
      createElement(tagName) {
        return new FakeElement(tagName, documentObject);
      },
      getElementById(id) {
        return id === "app" ? host : null;
      },
    };
    const host = new FakeElement("div", documentObject);
    const current = createTestResultSnapshot({
      resultId: `00000000-0000-4000-8000-00000000010${index}`,
    });
    const historical = createTestResultSnapshot({
      resultId: `00000000-0000-4000-8000-00000000020${index}`,
      versionTuple: {
        ...current.versionTuple,
        [field]: `${current.versionTuple[field]}-historical`,
      },
    });
    const raw = JSON.stringify({
      schemaVersion: 1,
      updatedAt: "2026-07-28T12:00:00.000Z",
      progressByDiagnosis: {},
      results: [historical],
    });

    startApp({
      documentObject,
      historyObject: { replaceState() {} },
      windowObject: {
        location: { hash: `#/result?resultId=${historical.resultId}` },
        addEventListener() {},
      },
      storage: { getItem: () => raw },
      nowProvider: () => "2026-07-28T12:05:00.000Z",
    });

    const text = collectText(host);
    assert.match(text, /診断時の尺度・設問・採点版に対応する説明は、このアプリでは確認できません/);
    assert.doesNotMatch(text, /因子ごとの設問構成を見る/);
    assert.doesNotMatch(text, /IPIP Japanese Translation|public domain|臨床診断、能力、雇用適性/);
    assert.equal(
      collectElements(host).filter(({ className }) =>
        className.includes("result-text-record")).length,
      42,
    );
  }
});

test("T-005/T-006 S-003/S-004 returns a missing saved result URL to history", () => {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
    getElementById(id) {
      return id === "app" ? host : null;
    },
  };
  const host = new FakeElement("div", documentObject);
  let replacedHash = null;

  startApp({
    documentObject,
    historyObject: {
      replaceState(_state, _title, hash) {
        replacedHash = hash;
      },
    },
    windowObject: {
      location: { hash: "#/result?resultId=00000000-0000-4000-8000-000000000099" },
      addEventListener() {},
    },
    storage: { getItem: () => null },
    nowProvider: () => "2026-07-26T12:05:00.000Z",
  });

  assert.equal(replacedHash, "#/history");
  assert.match(collectText(host), /指定された診断結果を開けませんでした/);
  assert.match(collectText(host), /診断結果の履歴/);
});

test("T-005 F-016 startApp observes once before decoding the selected manifest image", async () => {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
    getElementById(id) {
      return id === "app" ? host : null;
    },
  };
  const host = new FakeElement("div", documentObject);
  const observers = [];
  class FakeIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
      this.disconnectCalls = 0;
      this.target = null;
      observers.push(this);
    }

    observe(target) {
      this.target = target;
    }

    disconnect() {
      this.disconnectCalls += 1;
    }

    fire(isIntersecting) {
      this.callback([{ target: this.target, isIntersecting }]);
    }
  }
  const windowObject = {
    location: { hash: "#/result?resultId=00000000-0000-4000-8000-000000000060" },
    addEventListener() {},
    IntersectionObserver: FakeIntersectionObserver,
  };
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000060",
  });
  const raw = JSON.stringify({
    schemaVersion: 1,
    updatedAt: "2026-07-26T12:00:00.000Z",
    progressByDiagnosis: {},
    results: [target],
  });
  const requested = [];

  startApp({
    documentObject,
    historyObject: { replaceState() {} },
    windowObject,
    storage: { getItem: () => raw },
    nowProvider: () => "2026-07-26T12:05:00.000Z",
    decodeImage: async (path) => {
      requested.push(path);
      return documentObject.createElement("img");
    },
  });

  assert.deepEqual(requested, []);
  assert.equal(observers.length, 1);
  observers[0].fire(false);
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(requested, []);
  assert.equal(observers[0].disconnectCalls, 0);

  observers[0].fire(true);
  await new Promise((resolve) => setImmediate(resolve));
  observers[0].fire(true);
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(requested, [
    "assets/characters/character-balanced.webp",
  ]);
  assert.equal(observers[0].disconnectCalls, 1);
  const images = collectElements(host)
    .filter(({ tagName }) => tagName === "img");
  assert.equal(images.length, 1);
  assert.equal(
    images[0].attributes.get("alt"),
    "五枚の葉のモビールを見上げて座る猫。",
  );
  assert.equal(images[0].className, "result-character-image");
});

test("T-005 F-016 preserves a saved result when its character ID is absent from the manifest", () => {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
    getElementById(id) {
      return id === "app" ? host : null;
    },
  };
  const host = new FakeElement("div", documentObject);
  const target = JSON.parse(JSON.stringify(createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000061",
  })));
  target.characterId = "character-legacy-unknown";
  const raw = JSON.stringify({
    schemaVersion: 1,
    updatedAt: "2026-07-26T12:00:00.000Z",
    progressByDiagnosis: {},
    results: [target],
  });
  const requested = [];

  startApp({
    documentObject,
    historyObject: { replaceState() {} },
    windowObject: {
      location: { hash: `#/result?resultId=${target.resultId}` },
      addEventListener() {},
    },
    storage: { getItem: () => raw },
    nowProvider: () => "2026-07-26T12:05:00.000Z",
    decodeImage: async (path) => {
      requested.push(path);
      return documentObject.createElement("img");
    },
  });

  const text = collectText(host);
  assert.match(text, /50問詳細結果/);
  assert.match(text, /称号：五つの風を見渡す観測者/);
  assert.doesNotMatch(text, /診断時の選択色ID|palette-default/);
  assert.match(text, /画像を利用できない場合も診断結果は有効です/);
  assert.equal(
    collectElements(host).filter(({ className }) => className === "factor-score-row").length,
    5,
  );
  assert.equal(
    collectElements(host).filter(({ className }) =>
      className.includes("result-text-record")).length,
    42,
  );
  assert.deepEqual(requested, []);
});

function createAppHarness({ hash = "#/start", storage, confirmProvider = () => true } = {}) {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
    getElementById(id) {
      return id === "app" ? host : null;
    },
  };
  const host = new FakeElement("div", documentObject);
  const windowObject = {
    location: { hash },
    addEventListener() {},
  };
  let uuid = 1;
  startApp({
    documentObject,
    historyObject: { replaceState() {} },
    windowObject,
    storage,
    nowProvider: () => "2026-07-27T12:00:00.000Z",
    uuidProvider: () => `00000000-0000-4000-8000-${String(uuid++).padStart(12, "0")}`,
    confirmProvider,
  });
  return { host, windowObject };
}

test("T-005 S-001 starts a new in-memory questionnaire after saving compatible progress", () => {
  let raw = null;
  const { host, windowObject } = createAppHarness({
    storage: {
      getItem: () => raw,
      setItem(_key, value) { raw = value; },
    },
  });

  collectElements(host).find(({ tagName, textContent }) =>
    tagName === "button" && textContent === "診断を始める").dispatch("click");

  assert.equal(windowObject.location.hash, "#/answer");
  assert.match(collectText(host), /1 \/ 20問/);
  const envelope = JSON.parse(raw);
  assert.equal(Object.keys(envelope.progressByDiagnosis).length, 1);
  assert.equal(envelope.progressByDiagnosis["big-five-ipip-ja"].currentIndex, 0);
});

test("T-005 S-001 keeps a new questionnaire in memory when progress saving fails", () => {
  const { host, windowObject } = createAppHarness({
    storage: {
      getItem: () => null,
      setItem() { throw new Error("storage unavailable"); },
    },
  });

  collectElements(host).find(({ tagName, textContent }) =>
    tagName === "button" && textContent === "診断を始める").dispatch("click");

  assert.equal(windowObject.location.hash, "#/answer");
  assert.match(collectText(host), /1 \/ 20問/);
  assert.match(collectText(host), /この環境では回答を保存できません/);
});

function clickButton(host, text) {
  const button = collectElements(host).find(({ tagName, textContent }) =>
    tagName === "button" && textContent === text);
  assert.ok(button, `missing button: ${text}`);
  button.dispatch("click");
}

function answerCurrent(host, value = 3) {
  clickButton(host, `${value} どちらともいえない`);
}

test("T-005 S-002 sends twenty answers only to the choice and continueHidden enters question 21 without a result ID", () => {
  let raw = null;
  let uuidCalls = 0;
  const documentObject = {
    createElement(tagName) { return new FakeElement(tagName, documentObject); },
    getElementById(id) { return id === "app" ? host : null; },
  };
  const host = new FakeElement("div", documentObject);
  const windowObject = { location: { hash: "#/start" }, addEventListener() {} };
  startApp({
    documentObject,
    historyObject: { replaceState() {} },
    windowObject,
    storage: { getItem: () => raw, setItem(_key, value) { raw = value; } },
    nowProvider: () => "2026-07-27T12:00:00.000Z",
    uuidProvider: () => `00000000-0000-4000-8000-${String(++uuidCalls).padStart(12, "0")}`,
  });

  clickButton(host, "診断を始める");
  for (let index = 0; index < 20; index += 1) answerCurrent(host);

  assert.match(collectText(host), /20問の回答が完了しました/);
  assert.equal(uuidCalls, 1);
  assert.doesNotMatch(collectText(host), /仮称号|5因子のスコア/);
  clickButton(host, "結果を見ずに、あと30問続ける");
  assert.match(collectText(host), /21 \/ 50問/);
  assert.equal(uuidCalls, 1);
  assert.equal(JSON.parse(raw).progressByDiagnosis["big-five-ipip-ja"].previewDecision, "continueHidden");
});

test("T-005 S-002 renders an answer-free live preview with the exact notice when snapshot saving fails", () => {
  let writes = 0;
  const { host } = createAppHarness({
    storage: {
      getItem: () => null,
      setItem() {
        writes += 1;
        if (writes > 21) throw new Error("result save failed");
      },
    },
  });
  clickButton(host, "診断を始める");
  for (let index = 0; index < 20; index += 1) answerCurrent(host);
  clickButton(host, "20問の簡易プレビューを見る");

  const text = collectText(host);
  assert.match(text, /20問簡易プレビュー/);
  assert.match(text, /仮称号/);
  assert.match(text, /結果は表示できましたが、この端末の履歴には保存できませんでした。/);
  assert.doesNotMatch(text, /answers/);
  assert.equal(
    collectElements(host).filter(({ tagName, textContent }) =>
      tagName === "button" && textContent === "簡易プレビューで終了する").length,
    0,
  );
});

test("T-005 S-002 discarding is cancelled without writes, succeeds to start, and preserves the flow on deletion failure", () => {
  let raw = null;
  let writes = 0;
  let confirmation = false;
  const { host, windowObject } = createAppHarness({
    storage: {
      getItem: () => raw,
      setItem(_key, value) { writes += 1; raw = value; },
    },
    confirmProvider: () => confirmation,
  });
  clickButton(host, "診断を始める");
  const afterStartWrites = writes;
  clickButton(host, "回答を破棄");
  assert.equal(writes, afterStartWrites);
  assert.match(collectText(host), /1 \/ 20問/);

  confirmation = true;
  clickButton(host, "回答を破棄");
  assert.equal(windowObject.location.hash, "#/start");
  assert.match(collectText(host), /診断を始める/);

  const failing = createAppHarness({
    storage: { getItem: () => null, setItem() { throw new Error("delete failed"); } },
    confirmProvider: () => true,
  });
  clickButton(failing.host, "診断を始める");
  clickButton(failing.host, "回答を破棄");
  assert.match(collectText(failing.host), /1 \/ 20問/);
  assert.match(collectText(failing.host), /この環境では回答を保存できません/);
});

test("T-005 S-001 offers compatible resume and never offers it for incompatible stored progress", () => {
  const progress = createProgressRecord({
    definition: DiagnosticDefinition,
    meta: appMeta,
    progressId: "00000000-0000-4000-8000-000000000081",
    now: "2026-07-27T12:00:00.000Z",
  });
  const compatibleRaw = JSON.stringify({
    schemaVersion: 1,
    updatedAt: "2026-07-27T12:00:00.000Z",
    progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: progress },
    results: [],
  });
  const resumed = createAppHarness({ storage: { getItem: () => compatibleRaw } });
  assert.match(collectText(resumed.host), /途中から再開する/);
  clickButton(resumed.host, "途中から再開する");
  assert.match(collectText(resumed.host), /1 \/ 20問/);

  let writes = 0;
  const incompatible = createAppHarness({
    storage: {
      getItem: () => JSON.stringify({ schemaVersion: 1, updatedAt: "2026-07-27T12:00:00.000Z", progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: { invalid: true } }, results: [] }),
      setItem() { writes += 1; },
    },
  });
  assert.doesNotMatch(collectText(incompatible.host), /途中から再開する/);
  assert.equal(writes, 0);
});

test("T-005 S-002 retains the returned progress and visible error after answer and back persistence failures", () => {
  let raw = null;
  let fail = false;
  const { host } = createAppHarness({
    storage: {
      getItem: () => raw,
      setItem(_key, value) { if (fail) throw new Error("write failed"); raw = value; },
    },
  });
  clickButton(host, "診断を始める");
  fail = true;
  answerCurrent(host);
  assert.match(collectText(host), /2 \/ 20問/);
  assert.match(collectText(host), /この環境では回答を保存できません/);
  clickButton(host, "前へ");
  assert.match(collectText(host), /1 \/ 20問/);
  assert.match(collectText(host), /この環境では回答を保存できません/);
});

test("T-005 S-003 continues a shown preview at question 21 with showPreview preserved", () => {
  let raw = null;
  const { host } = createAppHarness({ storage: { getItem: () => raw, setItem(_key, value) { raw = value; } } });
  clickButton(host, "診断を始める");
  for (let index = 0; index < 20; index += 1) answerCurrent(host);
  clickButton(host, "20問の簡易プレビューを見る");
  clickButton(host, "あと30問続ける");
  assert.match(collectText(host), /21 \/ 50問/);
  assert.equal(JSON.parse(raw).progressByDiagnosis[DiagnosticDefinition.diagnosisId].previewDecision, "showPreview");
});

test("T-008A F-004 pauses at any question and resumes the same in-memory progress", () => {
  let raw = null;
  const { host, windowObject } = createAppHarness({
    storage: {
      getItem: () => raw,
      setItem(_key, value) { raw = value; },
    },
  });

  clickButton(host, "診断を始める");
  answerCurrent(host);
  clickButton(host, "中断してトップへ");

  assert.equal(windowObject.location.hash, "#/start");
  assert.match(collectText(host), /途中から再開する/);
  clickButton(host, "途中から再開する");
  assert.match(collectText(host), /2 \/ 20問/);
});

test("T-008A F-015 keeps the storage warning when unsaved memory progress resumes", () => {
  let confirmations = 0;
  const { host } = createAppHarness({
    storage: {
      getItem: () => null,
      setItem() { throw new Error("storage unavailable"); },
    },
    confirmProvider: () => {
      confirmations += 1;
      return true;
    },
  });

  clickButton(host, "診断を始める");
  assert.match(collectText(host), /この環境では回答を保存できません/);
  clickButton(host, "中断してトップへ");
  assert.equal(confirmations, 1);
  clickButton(host, "途中から再開する");
  assert.match(collectText(host), /この環境では回答を保存できません/);
  clickButton(host, "中断してトップへ");
  assert.equal(confirmations, 2);
});

test("T-008A F-004 confirms before replacing the most recent progress", () => {
  let raw = null;
  let confirmed = false;
  const { host } = createAppHarness({
    storage: {
      getItem: () => raw,
      setItem(_key, value) { raw = value; },
    },
    confirmProvider: () => confirmed,
  });

  clickButton(host, "診断を始める");
  answerCurrent(host);
  clickButton(host, "中断してトップへ");
  const before = raw;

  clickButton(host, "診断を始める");
  assert.equal(raw, before);
  assert.match(collectText(host), /途中から再開する/);

  confirmed = true;
  clickButton(host, "診断を始める");
  assert.match(collectText(host), /1 \/ 20問/);
  assert.notEqual(raw, before);
});

test("T-008A F-004 finishes a saved preview without deleting its result", () => {
  let raw = null;
  const { host, windowObject } = createAppHarness({
    storage: {
      getItem: () => raw,
      setItem(_key, value) { raw = value; },
    },
  });

  clickButton(host, "診断を始める");
  for (let index = 0; index < 20; index += 1) answerCurrent(host);
  clickButton(host, "20問の簡易プレビューを見る");
  const resultId = JSON.parse(raw).results[0].resultId;
  clickButton(host, "簡易プレビューで終了する");

  const envelope = JSON.parse(raw);
  assert.equal(windowObject.location.hash, "#/start");
  assert.deepEqual(envelope.progressByDiagnosis, {});
  assert.equal(envelope.results[0].resultId, resultId);
});

test("T-008A F-015 keeps preview progress and result when finish deletion fails", () => {
  let raw = null;
  let failWrites = false;
  const { host, windowObject } = createAppHarness({
    storage: {
      getItem: () => raw,
      setItem(_key, value) {
        if (failWrites) throw new Error("delete failed");
        raw = value;
      },
    },
  });

  clickButton(host, "診断を始める");
  for (let index = 0; index < 20; index += 1) answerCurrent(host);
  clickButton(host, "20問の簡易プレビューを見る");
  failWrites = true;
  clickButton(host, "簡易プレビューで終了する");

  const envelope = JSON.parse(raw);
  assert.match(windowObject.location.hash, /^#\/result/);
  assert.ok(envelope.progressByDiagnosis[DiagnosticDefinition.diagnosisId]);
  assert.equal(envelope.results.length, 1);
  assert.match(collectText(host), /簡易プレビューを終了できませんでした/);
});

test("T-008A F-013 never deletes a replacement progress from a stale preview", () => {
  let raw = null;
  let writes = 0;
  const { host } = createAppHarness({
    storage: {
      getItem: () => raw,
      setItem(_key, value) {
        writes += 1;
        raw = value;
      },
    },
  });

  clickButton(host, "診断を始める");
  for (let index = 0; index < 20; index += 1) answerCurrent(host);
  clickButton(host, "20問の簡易プレビューを見る");
  const envelope = JSON.parse(raw);
  envelope.progressByDiagnosis = {};
  raw = JSON.stringify(envelope);
  const writesBeforeFinish = writes;

  clickButton(host, "簡易プレビューで終了する");

  assert.equal(writes, writesBeforeFinish);
  assert.equal(JSON.parse(raw).results.length, 1);
  assert.match(collectText(host), /対応する途中回答を確認できないため/);
  assert.equal(
    collectElements(host).filter(({ tagName, textContent }) =>
      tagName === "button" && textContent === "簡易プレビューで終了する").length,
    0,
  );
});

test("T-005 S-004 renders detail after fifty answers and atomically clears progress on successful snapshot save", () => {
  let raw = null;
  const { host } = createAppHarness({ storage: { getItem: () => raw, setItem(_key, value) { raw = value; } } });
  clickButton(host, "診断を始める");
  for (let index = 0; index < 20; index += 1) answerCurrent(host);
  clickButton(host, "結果を見ずに、あと30問続ける");
  for (let index = 0; index < 30; index += 1) answerCurrent(host);
  assert.match(collectText(host), /50問詳細結果/);
  const envelope = JSON.parse(raw);
  assert.deepEqual(envelope.progressByDiagnosis, {});
  assert.equal(envelope.results.length, 1);
  assert.doesNotMatch(JSON.stringify(envelope.results[0]), /answers/);
});

function createShownPreviewProgress() {
  let progress = createProgressRecord({
    definition: DiagnosticDefinition,
    meta: appMeta,
    progressId: "00000000-0000-4000-8000-000000000091",
    now: "2026-07-27T12:00:00.000Z",
  });
  for (const questionId of DiagnosticDefinition.previewQuestionIds) {
    progress = answerProgress(progress, { questionId, value: 3 }, {
      definition: DiagnosticDefinition,
      meta: appMeta,
      now: "2026-07-27T12:00:00.000Z",
    }).progress;
  }
  return choosePreviewExit(progress, "showPreview", {
    definition: DiagnosticDefinition,
    meta: appMeta,
    now: "2026-07-27T12:00:00.000Z",
  }).progress;
}

test("T-005 S-003 reloads a saved preview into question 21 only with its compatible shown-preview progress", () => {
  const progress = createShownPreviewProgress();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000092",
    questionCount: 20,
    versionTuple: progress.versionTuple,
  });
  let raw = JSON.stringify({
    schemaVersion: 1,
    updatedAt: "2026-07-27T12:00:00.000Z",
    progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: progress },
    results: [snapshot],
  });
  const { host, windowObject } = createAppHarness({
    hash: `#/result?resultId=${snapshot.resultId}`,
    storage: { getItem: () => raw, setItem(_key, value) { raw = value; } },
  });

  clickButton(host, "あと30問続ける");
  assert.equal(windowObject.location.hash, "#/answer");
  assert.match(collectText(host), /21 \/ 50問/);
  assert.equal(JSON.parse(raw).progressByDiagnosis[DiagnosticDefinition.diagnosisId].previewDecision, "showPreview");
});

test("T-005 S-003 hides saved preview continuation without a matching compatible progress record", () => {
  const unrelatedProgress = createShownPreviewProgress();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000093",
    questionCount: 20,
    versionTuple: { ...unrelatedProgress.versionTuple, appVersion: "mvp-0.1.1" },
  });
  const { host } = createAppHarness({
    hash: `#/result?resultId=${snapshot.resultId}`,
    storage: { getItem: () => JSON.stringify({
      schemaVersion: 1,
      updatedAt: "2026-07-27T12:00:00.000Z",
      progressByDiagnosis: { [DiagnosticDefinition.diagnosisId]: unrelatedProgress },
      results: [snapshot],
    }) },
  });
  assert.equal(collectElements(host).filter(({ tagName, textContent }) =>
    tagName === "button" && textContent === "あと30問続ける").length, 0);
});

test("T-005 F-016 does not duplicate result observers when a hashchange follows an internal route update", () => {
  let hashchange;
  let raw = null;
  const documentObject = {
    createElement(tagName) { return new FakeElement(tagName, documentObject); },
    getElementById(id) { return id === "app" ? host : null; },
  };
  const host = new FakeElement("div", documentObject);
  const windowObject = {
    location: { hash: "#/start" },
    addEventListener(type, callback) { if (type === "hashchange") hashchange = callback; },
  };
  let observed = 0;
  startApp({
    documentObject,
    historyObject: { replaceState() {} },
    windowObject,
    storage: { getItem: () => raw, setItem(_key, value) { raw = value; } },
    nowProvider: () => "2026-07-27T12:00:00.000Z",
    uuidProvider: () => "00000000-0000-4000-8000-000000000094",
    observeViewport() { observed += 1; },
  });
  clickButton(host, "診断を始める");
  for (let index = 0; index < 20; index += 1) answerCurrent(host);
  clickButton(host, "20問の簡易プレビューを見る");
  assert.equal(observed, 1);
  hashchange();
  assert.equal(observed, 1);
});

test("T-005 S-004 keeps an unsaved detail live result and starts a fresh empty progress record on retry", () => {
  let raw = null;
  let writes = 0;
  const ids = [];
  const documentObject = {
    createElement(tagName) { return new FakeElement(tagName, documentObject); },
    getElementById(id) { return id === "app" ? host : null; },
  };
  const host = new FakeElement("div", documentObject);
  const windowObject = { location: { hash: "#/start" }, addEventListener() {} };
  startApp({
    documentObject,
    historyObject: { replaceState() {} },
    windowObject,
    storage: {
      getItem: () => raw,
      setItem(_key, value) {
        writes += 1;
        if (writes === 53) throw new Error("detail snapshot save failed");
        raw = value;
      },
    },
    nowProvider: () => "2026-07-27T12:00:00.000Z",
    uuidProvider: () => {
      const id = `00000000-0000-4000-8000-${String(ids.length + 1).padStart(12, "0")}`;
      ids.push(id);
      return id;
    },
  });
  clickButton(host, "診断を始める");
  for (let index = 0; index < 20; index += 1) answerCurrent(host);
  clickButton(host, "結果を見ずに、あと30問続ける");
  for (let index = 0; index < 30; index += 1) answerCurrent(host);
  assert.match(collectText(host), /50問詳細結果/);
  assert.match(collectText(host), /結果は表示できましたが、この端末の履歴には保存できませんでした。/);
  clickButton(host, "もう一度診断する");
  const progress = JSON.parse(raw).progressByDiagnosis[DiagnosticDefinition.diagnosisId];
  assert.match(collectText(host), /1 \/ 20問/);
  assert.equal(progress.progressId, ids[2]);
  assert.deepEqual(progress.answers, {});
});

test("T-005 F-016 opens a saved history result without duplicating its observer on the following hashchange", () => {
  const snapshot = createTestResultSnapshot({ resultId: "00000000-0000-4000-8000-000000000095" });
  let hashchange;
  const documentObject = {
    createElement(tagName) { return new FakeElement(tagName, documentObject); },
    getElementById(id) { return id === "app" ? host : null; },
  };
  const host = new FakeElement("div", documentObject);
  const windowObject = {
    location: { hash: "#/history" },
    addEventListener(type, callback) { if (type === "hashchange") hashchange = callback; },
  };
  let observed = 0;
  let disconnected = 0;
  startApp({
    documentObject,
    historyObject: { replaceState() {} },
    windowObject,
    storage: { getItem: () => JSON.stringify({
      schemaVersion: 1,
      updatedAt: "2026-07-27T12:00:00.000Z",
      progressByDiagnosis: {},
      results: [snapshot],
    }) },
    nowProvider: () => "2026-07-27T12:00:00.000Z",
    observeViewport() {
      observed += 1;
      return () => { disconnected += 1; };
    },
  });

  clickButton(host, "結果を見る");
  assert.equal(observed, 2);
  assert.equal(disconnected, 1);
  hashchange();
  assert.equal(observed, 2);
  assert.equal(disconnected, 1);
});

test("T-008A F-005 returns a saved detail result directly to the top without creating progress", () => {
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000096",
  });
  let confirmations = 0;
  let writes = 0;
  const raw = JSON.stringify({
    schemaVersion: 1,
    updatedAt: "2026-07-27T12:00:00.000Z",
    progressByDiagnosis: {},
    results: [snapshot],
  });
  const { host, windowObject } = createAppHarness({
    hash: `#/result?resultId=${snapshot.resultId}`,
    storage: {
      getItem: () => raw,
      setItem() { writes += 1; },
    },
    confirmProvider: () => {
      confirmations += 1;
      return false;
    },
  });

  clickButton(host, "トップへ戻る");

  assert.equal(windowObject.location.hash, "#/start");
  assert.equal(confirmations, 0);
  assert.equal(writes, 0);
  assert.match(collectText(host), /診断を始める/);
});

test("T-008A F-015 confirms before leaving an unsaved live detail result and preserves it on cancel", () => {
  let confirmation = false;
  let writes = 0;
  const { host, windowObject } = createAppHarness({
    storage: {
      getItem: () => null,
      setItem() {
        writes += 1;
        throw new Error("storage unavailable");
      },
    },
    confirmProvider: () => confirmation,
  });

  clickButton(host, "診断を始める");
  for (let index = 0; index < 20; index += 1) answerCurrent(host);
  clickButton(host, "結果を見ずに、あと30問続ける");
  for (let index = 0; index < 30; index += 1) answerCurrent(host);
  const writesAtResult = writes;

  clickButton(host, "トップへ戻る");
  assert.match(windowObject.location.hash, /^#\/result/);
  assert.match(collectText(host), /50問詳細結果/);
  assert.equal(writes, writesAtResult);

  confirmation = true;
  clickButton(host, "トップへ戻る");
  assert.equal(windowObject.location.hash, "#/start");
  assert.equal(writes, writesAtResult);
  assert.match(collectText(host), /診断を始める/);
});
