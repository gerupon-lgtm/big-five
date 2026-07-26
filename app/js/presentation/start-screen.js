import { appendTextElement } from "./screen-helpers.js";

export function renderStartScreen(host, versionModel) {
  const documentObject = host.ownerDocument ?? document;
  const main = documentObject.createElement("main");
  main.className = "app-shell";

  const headingGroup = documentObject.createElement("header");
  headingGroup.className = "hero";
  appendTextElement(
    headingGroup,
    "p",
    "BIG FIVE · SELF UNDERSTANDING",
    "eyebrow",
  );
  appendTextElement(
    headingGroup,
    "h1",
    "Big Five自己理解支援ツール",
  );
  appendTextElement(
    headingGroup,
    "p",
    "5つの特性から、今の自分らしい傾向を丁寧に読み解くためのWebツールです。",
    "lead",
  );

  const status = documentObject.createElement("section");
  status.className = "status-card";
  status.setAttribute("aria-labelledby", "build-status-title");
  const statusTitle = appendTextElement(
    status,
    "h2",
    "正式版MVPを準備中です",
  );
  statusTitle.id = "build-status-title";
  appendTextElement(
    status,
    "p",
    "現在は診断本体を構築中です。保存済み結果の履歴と比較画面は利用できます。",
  );
  const historyLink = appendTextElement(status, "a", "診断結果の履歴を見る", "text-link");
  historyLink.setAttribute("href", "#/history");

  const appVersion = appendTextElement(main, "p", versionModel.versionLabel, "version");
  const diagnosticVersion = documentObject.createElement("section");
  diagnosticVersion.className = "diagnostic-version";
  diagnosticVersion.setAttribute("aria-labelledby", "diagnostic-version-title");
  const diagnosticVersionTitle = appendTextElement(
    diagnosticVersion,
    "h2",
    versionModel.diagnosticVersionLabel,
  );
  diagnosticVersionTitle.id = "diagnostic-version-title";
  const diagnosticVersionList = documentObject.createElement("ul");
  for (const item of versionModel.diagnosticVersionItems) {
    appendTextElement(diagnosticVersionList, "li", item);
  }
  diagnosticVersion.append(diagnosticVersionList);
  main.append(diagnosticVersion);
  main.prepend(headingGroup);
  main.insertBefore(status, appVersion);
  host.replaceChildren(main);
}
