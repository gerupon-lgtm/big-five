import { appendAppHeader } from "./app-header.js";
import { appendScreenHeading } from "./screen-heading.js";
import { appendTextElement } from "./screen-helpers.js";

function appendSproutIcon(parent) {
  const documentObject = parent.ownerDocument;
  const createSvgElement = (tagName) => documentObject.createElementNS
    ? documentObject.createElementNS("http://www.w3.org/2000/svg", tagName)
    : documentObject.createElement(tagName);
  const medallion = documentObject.createElement("span");
  medallion.className = "start-introduction-icon";
  medallion.setAttribute("aria-hidden", "true");
  const svg = createSvgElement("svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("data-icon", "sprout");
  const stem = createSvgElement("path");
  stem.setAttribute("d", "M24 40V20");
  stem.setAttribute("fill", "none");
  stem.setAttribute("stroke", "#5f8f70");
  stem.setAttribute("stroke-width", "3");
  stem.setAttribute("stroke-linecap", "round");
  svg.append(stem);
  const leftLeaf = createSvgElement("path");
  leftLeaf.setAttribute("d", "M23 22C13 22 8 16 7 8c10-1 17 3 18 12");
  leftLeaf.setAttribute("fill", "#9fc8a7");
  leftLeaf.setAttribute("stroke", "#6d987a");
  leftLeaf.setAttribute("stroke-width", "1.2");
  svg.append(leftLeaf);
  const rightLeaf = createSvgElement("path");
  rightLeaf.setAttribute("d", "M25 24c10-1 16-7 16-16-10 0-17 5-18 14");
  rightLeaf.setAttribute("fill", "#7fb48f");
  rightLeaf.setAttribute("stroke", "#5f8f70");
  rightLeaf.setAttribute("stroke-width", "1.2");
  svg.append(rightLeaf);
  medallion.append(svg);
  parent.append(medallion);
}

export function renderStartScreen(host, versionModel, actions = {}, options = {}) {
  const documentObject = host.ownerDocument ?? document;
  const main = documentObject.createElement("main");
  main.className = "app-shell start-screen";
  appendAppHeader(main);

  const panel = documentObject.createElement("section");
  panel.className = "start-main-panel";
  appendScreenHeading(panel, {
    kicker: "SELF CHECK",
    title: "自分のことを知る",
  });
  appendTextElement(
    panel,
    "p",
    "Big Fiveは、性格傾向を5つの因子から捉える考え方です。本チェックではIPIP日本語50項目版を使用し、回答から現在の傾向を振り返ります。",
    "lead start-lead",
  );

  const introduction = documentObject.createElement("details");
  introduction.className = "start-introduction";
  const introductionSummary = documentObject.createElement("summary");
  appendSproutIcon(introductionSummary);
  const introductionTitle = documentObject.createElement("span");
  introductionTitle.className = "start-introduction-title";
  for (const phrase of ["自分を知る。", "自分と付き合う。", "そのためのツール。"]) {
    appendTextElement(
      introductionTitle,
      "span",
      phrase,
      "start-introduction-phrase",
    );
  }
  introductionSummary.append(introductionTitle);
  introduction.append(introductionSummary);
  appendTextElement(
    introduction,
    "p",
    "ココロパレアは、自分自身のことを知りたくて作り始めた自己理解支援ツールです。イメージキャラクターは愛猫の「もなか」。いつも文句ひとつ言わずに付き合ってくれるもなかのように、ココロパレアもそっとあなたに付き合える存在を目指しています。その時々の自分の傾向に応じて、出会えるもなかも変わります。",
  );
  panel.append(introduction);

  const overview = documentObject.createElement("section");
  overview.className = "start-overview";
  overview.setAttribute("aria-labelledby", "start-tool-overview-title");
  const statusTitle = appendTextElement(
    overview,
    "h2",
    "このツールについて",
  );
  statusTitle.id = "start-tool-overview-title";
  appendTextElement(
    overview,
    "p",
    "20問の簡易プレビューから始め、希望に応じて50問の詳しい結果まで進められます。",
  );
  const startActions = documentObject.createElement("div");
  startActions.className = "start-actions";
  if (typeof actions.onStartNew === "function") {
    const startButton = appendTextElement(startActions, "button", "診断を始める", "primary-button");
    startButton.setAttribute("type", "button");
    startButton.addEventListener("click", actions.onStartNew);
  }
  if (typeof actions.onResume === "function") {
    const resumeLabel = options.resumeLabel === "残り30問を再開する"
      ? options.resumeLabel
      : "途中から再開する";
    const resumeButton = appendTextElement(
      startActions,
      "button",
      resumeLabel,
      "secondary-button",
    );
    resumeButton.setAttribute("type", "button");
    resumeButton.addEventListener("click", actions.onResume);
  }
  if (startActions.children.length > 0) {
    overview.append(startActions);
  }
  panel.append(overview);
  main.append(panel);

  const secondaryNavigation = documentObject.createElement("nav");
  secondaryNavigation.className = "start-secondary-navigation";
  const hasHistory = options.hasHistory === true;
  const historyControl = appendTextElement(
    secondaryNavigation,
    hasHistory ? "a" : "button",
    "診断結果の履歴を見る",
    "secondary-button start-history-link",
  );
  if (hasHistory) {
    historyControl.setAttribute("href", "#/history");
  } else {
    historyControl.setAttribute("type", "button");
    historyControl.setAttribute("aria-disabled", "true");
    historyControl.disabled = true;
  }
  overview.append(secondaryNavigation);
  appendTextElement(
    main,
    "p",
    versionModel.versionLabel,
    "start-app-version",
  );

  const diagnosticVersion = documentObject.createElement("details");
  diagnosticVersion.className = "diagnostic-version";
  appendTextElement(
    diagnosticVersion,
    "summary",
    "この診断について",
  );
  appendTextElement(diagnosticVersion, "h2", versionModel.diagnosticVersionLabel);
  appendTextElement(diagnosticVersion, "p", versionModel.versionLabel, "version");
  const diagnosticVersionList = documentObject.createElement("ul");
  for (const item of versionModel.diagnosticVersionItems) {
    appendTextElement(diagnosticVersionList, "li", item);
  }
  diagnosticVersion.append(diagnosticVersionList);
  main.append(diagnosticVersion);
  appendTextElement(
    main,
    "footer",
    "© 2026 SIKUMI LAB",
    "start-footer",
  );
  host.replaceChildren(main);
}
