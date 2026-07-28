import { appendAppHeader } from "./app-header.js";
import { appendScreenHeading } from "./screen-heading.js";
import { appendTextElement } from "./screen-helpers.js";

export function renderStartScreen(host, versionModel, actions = {}, options = {}) {
  const documentObject = host.ownerDocument ?? document;
  const main = documentObject.createElement("main");
  main.className = "app-shell start-screen";
  appendAppHeader(main);
  appendScreenHeading(main, {
    kicker: "SELF CHECK",
    title: "自分のことを知る",
  });
  appendTextElement(
    main,
    "p",
    "Big Fiveは、性格傾向を5つの因子から捉える考え方です。本チェックではIPIP日本語50項目版を使用し、回答から現在の傾向を振り返ります。",
    "lead start-lead",
  );

  const status = documentObject.createElement("section");
  status.className = "start-overview-card status-card";
  status.setAttribute("aria-labelledby", "build-status-title");
  const statusTitle = appendTextElement(
    status,
    "h2",
    "Big Fiveについて",
  );
  statusTitle.id = "build-status-title";
  appendTextElement(
    status,
    "p",
    "20問の簡易プレビューから始め、希望に応じて50問の詳しい結果まで進められます。",
  );
  if (typeof actions.onStartNew === "function") {
    const startButton = appendTextElement(status, "button", "診断を始める", "primary-button");
    startButton.setAttribute("type", "button");
    startButton.addEventListener("click", actions.onStartNew);
  }
  if (typeof actions.onResume === "function") {
    const resumeLabel = options.resumeLabel === "残り30問を再開する"
      ? options.resumeLabel
      : "途中から再開する";
    const resumeButton = appendTextElement(
      status,
      "button",
      resumeLabel,
      "secondary-button",
    );
    resumeButton.setAttribute("type", "button");
    resumeButton.addEventListener("click", actions.onResume);
  }
  main.append(status);

  const secondaryNavigation = documentObject.createElement("nav");
  secondaryNavigation.className = "start-secondary-navigation";
  const historyLink = appendTextElement(
    secondaryNavigation,
    "a",
    "診断結果の履歴を見る",
    "text-link start-history-link",
  );
  historyLink.setAttribute("href", "#/history");
  main.append(secondaryNavigation);

  const diagnosticVersion = documentObject.createElement("details");
  diagnosticVersion.className = "diagnostic-version";
  appendTextElement(
    diagnosticVersion,
    "summary",
    versionModel.diagnosticVersionLabel,
  );
  appendTextElement(diagnosticVersion, "p", versionModel.versionLabel, "version");
  const diagnosticVersionList = documentObject.createElement("ul");
  for (const item of versionModel.diagnosticVersionItems) {
    appendTextElement(diagnosticVersionList, "li", item);
  }
  diagnosticVersion.append(diagnosticVersionList);
  main.append(diagnosticVersion);
  host.replaceChildren(main);
}
