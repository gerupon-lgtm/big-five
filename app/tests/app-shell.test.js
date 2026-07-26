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
