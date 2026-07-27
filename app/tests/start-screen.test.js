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

test("T-008A S-001 renders the shared official app header and concise start heading", () => {
  const { host } = createFakeScreen();

  renderStartScreen(host, versionModel, {});

  assert.equal(host.children[0].children[0].className, "app-header");
  assert.deepEqual(
    collectElements(host)
      .filter(({ className }) => className === "app-brand-part")
      .map(({ textContent }) => textContent),
    ["Big Five｜", "自己理解支援ツール"],
  );
  assert.equal(
    collectElements(host)
      .filter(({ tagName, textContent }) =>
        tagName === "h1" && textContent === "5つの傾向").length,
    1,
  );
});

test("T-008A F-004 renders the state-aware resume label once", () => {
  const { host } = createFakeScreen();
  let resumes = 0;

  renderStartScreen(
    host,
    versionModel,
    {
      onResume() {
        resumes += 1;
      },
    },
    {
      resumeLabel: "残り30問を再開する",
    },
  );

  const resumeButtons = collectElements(host)
    .filter(({ tagName, textContent }) =>
      tagName === "button" && textContent === "残り30問を再開する");
  assert.equal(resumeButtons.length, 1);
  resumeButtons[0].dispatch("click");
  assert.equal(resumes, 1);
});
