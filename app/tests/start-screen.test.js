import assert from "node:assert/strict";
import test from "node:test";

import { renderStartScreen } from "../js/presentation/start-screen.js";
import { collectElements, collectText, createFakeScreen } from "./helpers/fake-dom.js";

const versionModel = Object.freeze({
  versionLabel: "バージョン mvp-1.0.0",
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
  assert.match(collectText(host), /ココロパレア/);
  assert.match(collectText(host), /Big Five 自己理解支援ツール/);
  assert.match(collectText(host), /SELF CHECK/);
  assert.match(collectText(host), /自分のことを知る/);
  assert.match(collectText(host), /Big Fiveは、性格傾向を5つの因子から捉える考え方です/);
  assert.match(collectText(host), /IPIP日本語50項目版/);
  assert.doesNotMatch(collectText(host), /5つの傾向/);
  assert.doesNotMatch(collectText(host), /正式版MVPを準備中です/);
  assert.match(
    collectText(host),
    /自分を知る。.*自分と付き合う。.*そのためのツール。/,
  );
  assert.match(
    collectText(host),
    /イメージキャラクターは愛猫の「もなか」/,
  );
  assert.match(
    collectText(host),
    /その時々の自分の傾向に応じて、出会えるもなかも変わります。/,
  );
  const introduction = collectElements(host).find(({ className }) =>
    className === "start-introduction");
  assert.equal(introduction.tagName, "details");
  assert.equal(introduction.open, false);
  assert.equal(
    collectText(introduction.children.find(({ tagName }) => tagName === "summary"))
      .replace(/\s+/g, ""),
    "自分を知る。自分と付き合う。そのためのツール。",
  );
  assert.equal(
    collectElements(introduction).filter(({ tagName }) => tagName === "p").length,
    1,
  );
  const visibleVersion = collectElements(host).find(({ className }) =>
    className === "start-app-version");
  assert.equal(visibleVersion.textContent, "バージョン mvp-1.0.0");
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

test("T-008A S-001 renders the shared official app header, start heading, and secondary history navigation", () => {
  const { host } = createFakeScreen();

  renderStartScreen(host, versionModel, {}, { hasHistory: true });

  assert.equal(host.children[0].children[0].className, "app-header");
  assert.equal(
    collectElements(host)
      .find(({ className }) => className === "app-brand-name")
      .textContent,
    "ココロパレア",
  );
  assert.equal(
    collectElements(host)
      .filter(({ tagName, textContent }) =>
        tagName === "h1" && textContent === "自分のことを知る").length,
    1,
  );
  const secondaryNavigation = collectElements(host)
    .find(({ className }) => className === "start-secondary-navigation");
  assert.ok(secondaryNavigation);
  assert.equal(
    collectElements(secondaryNavigation)
      .find(({ className }) => className === "secondary-button start-history-link")
      .attributes.get("href"),
    "#/history",
  );
  assert.match(collectText(secondaryNavigation), /診断結果の履歴を見る/);
  assert.equal(
    collectElements(host)
      .filter(({ className }) => className === "app-header-action").length,
    0,
  );
});

test("T-008C S-001 disables the history button when no result history exists", () => {
  const { host } = createFakeScreen();

  renderStartScreen(host, versionModel, {}, { hasHistory: false });

  const historyButton = collectElements(host)
    .find(({ className }) => className === "secondary-button start-history-link");
  assert.equal(historyButton.tagName, "button");
  assert.equal(historyButton.disabled, true);
  assert.equal(historyButton.attributes.get("aria-disabled"), "true");
  assert.equal(historyButton.attributes.has("href"), false);
});

test("T-008C S-001 uses the approved sprout without soil in the introduction disclosure", () => {
  const { host } = createFakeScreen();

  renderStartScreen(host, versionModel, {});

  const icon = collectElements(host)
    .find(({ className }) => className === "start-introduction-icon");
  assert.ok(icon);
  const sprout = collectElements(icon)
    .find(({ attributes }) => attributes.get("data-icon") === "sprout");
  assert.equal(sprout?.tagName, "svg");
  assert.equal(collectElements(icon).some(({ attributes }) =>
    attributes.get("data-part") === "soil"), false);
  assert.deepEqual(
    collectElements(host)
      .filter(({ className }) => className === "start-introduction-phrase")
      .map(({ textContent }) => textContent),
    ["自分を知る。", "自分と付き合う。", "そのためのツール。"],
  );
});

test("T-008A S-001 groups primary start content into one panel without nesting a status card", () => {
  const { host } = createFakeScreen();

  renderStartScreen(host, versionModel, {
    onStartNew() {},
    onResume() {},
  });

  const main = host.children[0];
  const panel = collectElements(main)
    .find(({ className }) => className === "start-main-panel");
  const secondaryNavigation = collectElements(main)
    .find(({ className }) => className === "start-secondary-navigation");
  const diagnosticVersion = collectElements(main)
    .find(({ className }) => className === "diagnostic-version");

  assert.ok(panel);
  const overview = collectElements(panel)
    .find(({ className }) => className === "start-overview");
  assert.ok(overview);
  assert.equal(
    overview.attributes.get("aria-labelledby"),
    "start-tool-overview-title",
  );
  assert.equal(
    collectElements(overview)
      .find(({ tagName }) => tagName === "h2")
      .textContent,
    "このツールについて",
  );
  const startActions = collectElements(overview)
    .find(({ className }) => className === "start-actions");
  assert.ok(startActions);
  assert.deepEqual(
    startActions.children.map(({ className }) => className),
    ["primary-button", "secondary-button"],
  );
  assert.equal(
    collectElements(panel)
      .filter(({ className }) => className === "screen-heading").length,
    1,
  );
  assert.equal(
    collectElements(panel)
      .filter(({ className }) => className === "lead start-lead").length,
    1,
  );
  assert.equal(
    collectElements(panel)
      .filter(({ className }) => className.includes("status-card")).length,
    0,
  );
  assert.equal(panel.children.includes(secondaryNavigation), false);
  assert.equal(panel.children.includes(diagnosticVersion), false);
  assert.equal(main.children.includes(secondaryNavigation), true);
  assert.equal(main.children.includes(diagnosticVersion), true);
});

test("T-008A S-001 keeps the diagnostic label and version details inside the diagnostic disclosure", () => {
  const { host } = createFakeScreen();

  renderStartScreen(host, versionModel, {});

  const diagnosticVersion = collectElements(host)
    .find(({ className }) => className === "diagnostic-version");
  assert.ok(diagnosticVersion);
  assert.equal(diagnosticVersion.tagName, "details");
  assert.equal(
    diagnosticVersion.children
      .find(({ tagName }) => tagName === "summary")
      .textContent,
    "この診断について",
  );
  assert.equal(
    collectElements(diagnosticVersion)
      .find(({ tagName }) => tagName === "h2")
      .textContent,
    "診断データの版",
  );
  assert.match(collectText(diagnosticVersion), /バージョン mvp-1\.0\.0/);
  assert.match(collectText(diagnosticVersion), /質問 ipip-ja-50-question-set-v1/);
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
