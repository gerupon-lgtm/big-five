import assert from "node:assert/strict";
import test from "node:test";

import { FORMAL_STORAGE_KEY } from "../js/infrastructure/progress-storage.js";
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
  assert.match(renderedText, /Big Five自己理解支援ツール/);
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

test("T-006 S-006 confirms and deletes one exact history result through startApp", () => {
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
  const confirmations = [];

  startApp({
    documentObject,
    historyObject,
    windowObject,
    storage,
    nowProvider: () => "2026-07-26T12:05:00.000Z",
    confirmProvider: (message) => {
      confirmations.push(message);
      return true;
    },
  });

  collectElements(host)
    .find(({ tagName, textContent }) => tagName === "button" && textContent === "この結果を削除")
    .dispatch("click");

  assert.equal(confirmations.length, 1);
  assert.match(confirmations[0], /1件/);
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
    .find(({ tagName, textContent }) =>
      tagName === "button" && textContent === "端末内データをすべて削除")
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

  const compareButtons = collectElements(host)
    .filter(({ tagName, textContent }) => tagName === "button" && textContent === "比較対象に選ぶ");
  compareButtons[0].dispatch("click");
  compareButtons[1].dispatch("click");

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
  assert.match(text, /診断時の選択色ID：palette-default/);
  assert.match(text, /画像を利用できない場合も診断結果は有効です/);
  assert.equal(
    collectElements(host).filter(({ className }) => className === "factor-result").length,
    5,
  );
  assert.equal(
    collectElements(host).filter(({ className }) =>
      className.includes("result-text-record")).length,
    42,
  );
  assert.deepEqual(requested, []);
});
