import { compareResultSnapshots } from "../domain/result-comparison.js";
import { comparisonErrorMessage } from "./comparison-copy.js";
import { appendTextElement, formatCompletedAt } from "./screen-helpers.js";

function renderVersions(parent, versionTuple) {
  const details = parent.ownerDocument.createElement("details");
  appendTextElement(details, "summary", "診断時のバージョン");
  const list = details.ownerDocument.createElement("dl");
  for (const [name, value] of Object.entries(versionTuple)) {
    appendTextElement(list, "dt", name);
    appendTextElement(list, "dd", value);
  }
  details.append(list);
  parent.append(details);
}

function renderResultCard(parent, snapshot, labels, actions, onSelectComparison) {
  const documentObject = parent.ownerDocument;
  const card = documentObject.createElement("article");
  card.className = "history-card";
  card.setAttribute("data-result-id", snapshot.resultId);

  appendTextElement(card, "h2", labels.titleLabels[snapshot.titleId] ?? snapshot.titleId);
  const metadata = documentObject.createElement("p");
  metadata.className = "history-metadata";
  const time = appendTextElement(metadata, "time", formatCompletedAt(snapshot.completedAt));
  time.setAttribute("datetime", snapshot.completedAt);
  appendTextElement(
    metadata,
    "span",
    snapshot.questionCount === 20 ? "20問 簡易プレビュー" : "50問 詳細結果",
  );
  card.append(metadata);
  appendTextElement(card, "p", `猫キャラクター: ${snapshot.characterId}`, "character-label");

  const factorList = documentObject.createElement("ul");
  factorList.className = "factor-score-list";
  for (const factor of snapshot.factors) {
    appendTextElement(
      factorList,
      "li",
      `${labels.factorLabels[factor.factorId] ?? factor.factorId}: ${factor.displayScore} / 100`,
    );
  }
  card.append(factorList);

  const textDetails = documentObject.createElement("details");
  appendTextElement(textDetails, "summary", "詳細を開く（根拠文とコメント）");
  for (const record of snapshot.renderedTexts) {
    appendTextElement(textDetails, "p", record.text);
  }
  card.append(textDetails);
  renderVersions(card, snapshot.versionTuple);

  const controls = documentObject.createElement("div");
  controls.className = "history-card-actions";
  const compareButton = appendTextElement(controls, "button", "比較対象に選ぶ", "secondary-button");
  compareButton.setAttribute("type", "button");
  compareButton.disabled = false;
  compareButton.addEventListener("click", () => onSelectComparison(snapshot));
  const deleteButton = appendTextElement(controls, "button", "この結果を削除", "danger-button");
  deleteButton.setAttribute("type", "button");
  deleteButton.addEventListener("click", () => actions.onDeleteResult?.(snapshot.resultId));
  card.append(controls);
  const compareReason = appendTextElement(card, "p", "", "comparison-reason");
  parent.append(card);
  return { snapshot, compareButton, compareReason };
}

export function renderHistoryScreen(host, historyState, actions = {}) {
  const documentObject = host.ownerDocument ?? document;
  const main = documentObject.createElement("main");
  main.className = "app-shell history-screen";

  const backLink = appendTextElement(main, "a", "開始画面へ戻る", "text-link");
  backLink.setAttribute("href", "#/start");
  appendTextElement(main, "h1", "診断結果の履歴");
  appendTextElement(
    main,
    "p",
    "結果はこの端末のブラウザ内にだけ保存されます。",
    "lead compact-lead",
  );
  if (actions.operationNotice) {
    const notice = appendTextElement(
      main,
      "p",
      actions.operationNotice.text,
      `notice ${actions.operationNotice.kind}-notice`,
    );
    notice.setAttribute("role", actions.operationNotice.kind === "error" ? "alert" : "status");
  }

  if (historyState.status === "error") {
    const error = appendTextElement(
      main,
      "p",
      "保存データを読み込めませんでした。既存データは変更していません。",
      "notice error-notice",
    );
    error.setAttribute("role", "alert");
  } else if (historyState.results.length === 0) {
    const empty = documentObject.createElement("section");
    empty.className = "status-card empty-state";
    appendTextElement(empty, "h2", "まだ結果がありません");
    appendTextElement(empty, "p", "診断が完了すると、この端末で過去の結果を振り返れます。");
    const startLink = appendTextElement(empty, "a", "診断を始める", "primary-link");
    startLink.setAttribute("href", "#/start");
    main.append(empty);
  } else {
    const list = documentObject.createElement("div");
    list.className = "history-list";
    const comparisonEntries = [];
    let firstSnapshot = null;
    const resetComparisonButton = appendTextElement(
      main,
      "button",
      "比較選択をやり直す",
      "secondary-button reset-comparison-button",
    );
    resetComparisonButton.setAttribute("type", "button");
    resetComparisonButton.hidden = true;
    const resetComparison = () => {
      firstSnapshot = null;
      resetComparisonButton.hidden = true;
      for (const entry of comparisonEntries) {
        entry.compareButton.disabled = false;
        entry.compareButton.textContent = "比較対象に選ぶ";
        entry.compareReason.textContent = "";
      }
    };
    resetComparisonButton.addEventListener("click", resetComparison);
    const selectComparison = (snapshot) => {
      if (firstSnapshot === null) {
        firstSnapshot = snapshot;
        resetComparisonButton.hidden = false;
        for (const entry of comparisonEntries) {
          if (entry.snapshot.resultId === snapshot.resultId) {
            entry.compareButton.disabled = true;
            entry.compareButton.textContent = "1件目に選択済み";
            entry.compareReason.textContent = "比較する2件目を選んでください。";
            continue;
          }
          const comparison = compareResultSnapshots(snapshot, entry.snapshot);
          entry.compareButton.disabled = !comparison.compatible;
          entry.compareReason.textContent = comparison.compatible
            ? ""
            : comparisonErrorMessage(comparison.code);
        }
        return;
      }
      const comparison = compareResultSnapshots(firstSnapshot, snapshot);
      if (comparison.compatible) actions.onCompare?.(comparison);
    };
    for (const snapshot of historyState.results) {
      comparisonEntries.push(renderResultCard(
        list,
        snapshot,
        historyState,
        actions,
        selectComparison,
      ));
    }
    main.append(list);
  }

  if (historyState.status === "ok") {
    const deleteAllButton = appendTextElement(
      main,
      "button",
      "端末内データをすべて削除",
      "danger-button delete-all-button",
    );
    deleteAllButton.setAttribute("type", "button");
    deleteAllButton.addEventListener("click", () => actions.onDeleteAll?.());
  }

  host.replaceChildren(main);
}
