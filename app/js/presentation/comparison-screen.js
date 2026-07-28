import { comparisonErrorMessage } from "./comparison-copy.js";
import { appendAppHeader } from "./app-header.js";
import { appendScreenHeading } from "./screen-heading.js";
import { appendTextElement, formatCompletedAt } from "./screen-helpers.js";

const PRESENTATION_VERSION_FIELDS = [
  "resultTextVersion",
  "titleRuleVersion",
  "characterManifestVersion",
  "presentationDefinitionVersion",
  "cardTemplateVersion",
  "appVersion",
];

function renderHistoryReturn(main, message) {
  appendTextElement(main, "p", message, "notice error-notice").setAttribute("role", "alert");
  const link = appendTextElement(main, "a", "履歴で比較対象を選び直す", "primary-link");
  link.setAttribute("href", "#/history");
}

function displayDelta(deltaRawMean) {
  const value = Math.round(deltaRawMean * 25);
  if (value > 0) return `＋${value}（増加）`;
  if (value < 0) return `−${Math.abs(value)}（減少）`;
  return "±0（変化なし）";
}

function presentationVersionDifferences(before, after) {
  const differences = PRESENTATION_VERSION_FIELDS
    .filter((field) => before.versionTuple[field] !== after.versionTuple[field])
    .map((field) => ({
      field,
      beforeValue: before.versionTuple[field],
      afterValue: after.versionTuple[field],
    }));
  if (before.characterAssetVersion !== after.characterAssetVersion) {
    differences.push({
      field: "characterAssetVersion",
      beforeValue: before.characterAssetVersion,
      afterValue: after.characterAssetVersion,
    });
  }
  return differences;
}

export function renderComparisonScreen(host, state) {
  const documentObject = host.ownerDocument ?? document;
  const main = documentObject.createElement("main");
  main.className = "app-shell comparison-screen";
  appendAppHeader(main, {
    action: { label: "履歴へ戻る", href: "#/history" },
  });
  appendScreenHeading(main, {
    kicker: "COMPARISON",
    title: "診断結果の比較",
    titleClassName: "comparison-title",
  });

  if (state.status === "missing-selection") {
    renderHistoryReturn(main, "比較する2件を履歴から選んでください。");
  } else if (state.status === "result-unavailable") {
    renderHistoryReturn(main, "選択した結果を確認できません。削除済みまたは破損している可能性があります。");
  } else if (state.status === "incompatible") {
    renderHistoryReturn(
      main,
      comparisonErrorMessage(state.code),
    );
  } else if (state.status === "ok") {
    const { before, after, comparison } = state;
    const conditions = documentObject.createElement("section");
    conditions.className = "comparison-conditions";
    appendTextElement(conditions, "h2", "比較条件");
    appendTextElement(
      conditions,
      "p",
      `${before.questionCount}問 · ${before.versionTuple.scaleVersion} · ${before.versionTuple.questionVersion} · ${before.versionTuple.scoringVersion}`,
    );
    main.append(conditions);

    const dates = documentObject.createElement("div");
    dates.className = "comparison-dates";
    const beforeDate = documentObject.createElement("section");
    appendTextElement(beforeDate, "h2", "古い結果");
    const beforeTime = appendTextElement(beforeDate, "time", formatCompletedAt(before.completedAt));
    beforeTime.setAttribute("datetime", before.completedAt);
    const afterDate = documentObject.createElement("section");
    appendTextElement(afterDate, "h2", "今回の結果");
    const afterTime = appendTextElement(afterDate, "time", formatCompletedAt(after.completedAt));
    afterTime.setAttribute("datetime", after.completedAt);
    dates.append(beforeDate);
    dates.append(afterDate);
    main.append(dates);

    const factorList = documentObject.createElement("ul");
    factorList.className = "comparison-factor-list";
    for (const factor of comparison.factorDeltas) {
      const item = documentObject.createElement("li");
      appendTextElement(
        item,
        "h2",
        state.factorLabels[factor.factorId] ?? factor.factorId,
      );
      appendTextElement(
        item,
        "p",
        `${factor.beforeRawMean} → ${factor.afterRawMean}`,
        "raw-mean-transition",
      );
      appendTextElement(item, "p", displayDelta(factor.deltaRawMean), "display-delta");
      factorList.append(item);
    }
    main.append(factorList);

    const caution = appendTextElement(
      main,
      "p",
      "この差は性格の確定的な変化を示すものではありません。回答時の状況や自己認識でも変動します。",
      "notice comparison-caution",
    );
    caution.setAttribute("role", "note");

    const differingFields = presentationVersionDifferences(before, after);
    if (differingFields.length > 0) {
      const versionNotice = documentObject.createElement("section");
      versionNotice.className = "notice version-notice";
      appendTextElement(
        versionNotice,
        "h2",
        "スコアは比較できますが、表示表現の版が異なります",
      );
      const versions = documentObject.createElement("dl");
      for (const difference of differingFields) {
        appendTextElement(versions, "dt", difference.field);
        appendTextElement(
          versions,
          "dd",
          `${difference.beforeValue} → ${difference.afterValue}`,
        );
      }
      versionNotice.append(versions);
      main.append(versionNotice);
    }
  }

  host.replaceChildren(main);
}
