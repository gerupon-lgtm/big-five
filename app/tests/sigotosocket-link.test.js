import assert from "node:assert/strict";
import test from "node:test";

import { startApp } from "../js/main.js";
import { createSigotosocketLinkUrl } from "../js/domain/sigotosocket-link.js";
import { renderSavedResultScreen } from "../js/presentation/result-screen.js";
import {
  collectElements,
  collectText,
  createFakeScreen,
  FakeElement,
} from "./helpers/fake-dom.js";
import { createTestResultSnapshot } from "./helpers/result-snapshot-fixture.js";

const labels = Object.freeze({
  factorLabels: Object.freeze({
    intellectImagination: "知性・想像力",
    conscientiousness: "勤勉性",
    extraversion: "外向性",
    agreeableness: "協調性",
    emotionalStability: "情緒安定性",
  }),
  factorDescriptions: Object.freeze({
    intellectImagination: "説明",
    conscientiousness: "説明",
    extraversion: "説明",
    agreeableness: "説明",
    emotionalStability: "説明",
  }),
  titleLabels: Object.freeze({ "title-balanced": "五つの風を見渡す観測者" }),
});

test("T-032 F-023 builds the v1 fragment URL from five detail result means", () => {
  const url = createSigotosocketLinkUrl({
    mode: "detail50",
    factors: [
      { factorId: "extraversion", rawMean: 4.01 },
      { factorId: "agreeableness", rawMean: 1.95 },
      { factorId: "intellectImagination", rawMean: 3.42 },
      { factorId: "emotionalStability", rawMean: 2.67 },
      { factorId: "conscientiousness", rawMean: 2.88 },
    ],
  });

  assert.equal(
    url,
    "https://sigotosocket.sikumilab.com/#b5=v1-342288401195267",
  );
});

test("T-032 F-023 rejects incomplete, duplicate, unexpected, and invalid factors", () => {
  const valid = [
    { factorId: "intellectImagination", rawMean: 3.42 },
    { factorId: "conscientiousness", rawMean: 2.88 },
    { factorId: "extraversion", rawMean: 4.01 },
    { factorId: "agreeableness", rawMean: 1.95 },
    { factorId: "emotionalStability", rawMean: 2.67 },
  ];
  assert.equal(createSigotosocketLinkUrl({ mode: "detail50", factors: valid.slice(0, 4) }), null);
  assert.equal(createSigotosocketLinkUrl({ mode: "detail50", factors: [...valid, valid[0]] }), null);
  assert.equal(createSigotosocketLinkUrl({
    mode: "detail50",
    factors: [...valid.slice(0, 4), { factorId: "unknown", rawMean: 3 }],
  }), null);
  assert.equal(createSigotosocketLinkUrl({
    mode: "detail50",
    factors: [{ ...valid[0], rawMean: 0.99 }, ...valid.slice(1)],
  }), null);
  assert.equal(createSigotosocketLinkUrl({
    mode: "detail50",
    factors: [{ ...valid[0], rawMean: 0.999 }, ...valid.slice(1)],
  }), null);
  assert.equal(createSigotosocketLinkUrl({
    mode: "detail50",
    factors: [{ ...valid[0], rawMean: 5.004 }, ...valid.slice(1)],
  }), null);
  assert.equal(createSigotosocketLinkUrl({
    mode: "detail50",
    factors: [{ ...valid[0], rawMean: Number.NaN }, ...valid.slice(1)],
  }), null);
  assert.equal(createSigotosocketLinkUrl({
    mode: "detail50",
    factors: [{ ...valid[0], rawMean: "3.42" }, ...valid.slice(1)],
  }), null);
  assert.equal(createSigotosocketLinkUrl({
    mode: "detail50",
    factors: [{ ...valid[0], rawMean: Symbol("invalid") }, ...valid.slice(1)],
  }), null);
});

test("T-032 F-023 refuses previews and malformed top-level input without throwing", () => {
  assert.equal(createSigotosocketLinkUrl(), null);
  assert.equal(createSigotosocketLinkUrl({ mode: "preview20", factors: [] }), null);
});

test("T-032 F-023 shows one explicit handoff action on a 50-question result", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000119",
  });
  const handedOff = [];

  renderSavedResultScreen(host, snapshot, labels, {
    onLinkToSigotosocket: (selected) => handedOff.push(selected),
  }, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  assert.match(collectText(host), /5つの数値だけを渡します。回答そのものは渡しません。/);
  assert.match(
    collectText(host),
    /シゴトソケットは、Big Fiveの結果を仕事で活かすヒントにつなげるWebアプリです。/,
  );
  const buttons = collectElements(host).filter(({ tagName, textContent }) =>
      tagName === "button" && textContent === "この結果をシゴトソケットへ渡す");
  assert.equal(buttons.length, 1);
  assert.match(buttons[0].className, /result-linkage-button/);
  const links = collectElements(host).filter(({ tagName, textContent }) =>
    tagName === "a" && textContent === "シゴトソケットについて見る");
  assert.equal(links.length, 1);
  assert.equal(links[0].getAttribute("href"), "https://sigotosocket.sikumilab.com/");
  assert.equal(links[0].getAttribute("target"), null);
  buttons[0].dispatch("click");
  assert.deepEqual(handedOff, [snapshot]);
});

test("T-032 F-023 also exposes the action when a saved detail result is opened from history", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000122",
  });

  renderSavedResultScreen(host, snapshot, labels, {
    onLinkToSigotosocket() {},
  }, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
    historyDetail: true,
  });

  assert.equal(collectElements(host).filter(({ tagName, textContent }) =>
      tagName === "button" && textContent === "この結果をシゴトソケットへ渡す").length, 1);
});

test("T-032 F-023 does not expose the handoff from a 20-question preview", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000121",
    questionCount: 20,
  });

  renderSavedResultScreen(host, snapshot, labels, {
    onLinkToSigotosocket() {
      throw new Error("preview must not hand off");
    },
  }, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const text = collectText(host);
  assert.doesNotMatch(text, /この結果をシゴトソケットへ渡す/);
  assert.doesNotMatch(text, /5つの数値だけを渡します/);
});

test("T-032 F-023 moves the current tab to the exact handoff URL", () => {
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000120",
    rawMeans: [3, 2, 4, 2, 3],
  });
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
    location: { hash: `#/result?resultId=${snapshot.resultId}` },
    addEventListener() {},
  };

  startApp({
    documentObject,
    historyObject: { replaceState() {} },
    windowObject,
    storage: {
      getItem: () => JSON.stringify({
        schemaVersion: 1,
        updatedAt: "2026-09-05T12:00:00.000Z",
        progressByDiagnosis: {},
        results: [snapshot],
      }),
    },
    nowProvider: () => "2026-09-05T12:00:00.000Z",
    observeViewport() {},
  });

  const button = collectElements(host).find(({ tagName, textContent }) =>
      tagName === "button" && textContent === "この結果をシゴトソケットへ渡す");
  assert.ok(button);
  button.dispatch("click");
  assert.equal(
    windowObject.location.href,
    "https://sigotosocket.sikumilab.com/#b5=v1-300200400200300",
  );
});
