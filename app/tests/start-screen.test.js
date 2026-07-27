import assert from "node:assert/strict";
import test from "node:test";

import { renderStartScreen } from "../js/presentation/start-screen.js";
import { collectElements, collectText, createFakeScreen } from "./helpers/fake-dom.js";

const versionModel = Object.freeze({
  versionLabel: "バージョン mvp-0.1.0",
  diagnosticVersionLabel: "診断データの版",
  diagnosticVersionItems: Object.freeze(["質問 ipip-ja-50-question-set-v1"]),
});

test("T-005 S-001 offers a new diagnosis action and accurate available-flow copy", () => {
  const { host } = createFakeScreen();
  let starts = 0;

  renderStartScreen(host, versionModel, {
    onStartNew() { starts += 1; },
  });

  const button = collectElements(host).find(({ tagName, textContent }) =>
    tagName === "button" && textContent === "診断を始める");
  assert.ok(button);
  button.dispatch("click");
  assert.equal(starts, 1);
  assert.match(collectText(host), /20問の簡易プレビューから始め、希望に応じて50問の詳しい結果まで進められます/);
  assert.doesNotMatch(collectText(host), /診断本体を構築中/);
});

test("T-005 S-001 offers resume only when the caller provides a compatible progress callback", () => {
  const { host } = createFakeScreen();
  let resumes = 0;

  renderStartScreen(host, versionModel, {
    onStartNew() {},
    onResume() { resumes += 1; },
  });

  const resume = collectElements(host).find(({ tagName, textContent }) =>
    tagName === "button" && textContent === "途中から再開する");
  assert.ok(resume);
  resume.dispatch("click");
  assert.equal(resumes, 1);
});
