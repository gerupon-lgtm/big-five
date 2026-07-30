import { validateResultSnapshot } from "../domain/result-snapshot.js";
import {
  createResultDisclosureModel,
  createTitleReflectionDisclosureModel,
} from "../domain/result-disclosure-model.js";
import { drawResultRadar } from "./radar-chart.js";
import { appendAppHeader } from "./app-header.js";
import { appendBottomSheetLauncher } from "./bottom-sheet.js";
import { appendScreenHeading } from "./screen-heading.js";
import { appendTextElement, formatCompletedAt } from "./screen-helpers.js";

function appendRenderedText(parent, record) {
  const article = parent.ownerDocument.createElement("article");
  article.className = "result-text-item";
  const paragraph = appendTextElement(article, "p", record.text, "result-text-record");
  paragraph.setAttribute("data-result-text-id", record.id);
  paragraph.setAttribute("data-result-text-section", record.section);
  parent.append(article);
}

function appendCharacterFrame(parent, snapshot, dependencies) {
  const {
    characterEntry,
    decodeImage,
    loadCharacterImage,
    observeViewport,
  } = dependencies;
  if (
    !characterEntry ||
    characterEntry.characterId !== snapshot.characterId ||
    characterEntry.assetVersion !== snapshot.characterAssetVersion ||
    typeof decodeImage !== "function" ||
    typeof loadCharacterImage !== "function" ||
    typeof observeViewport !== "function"
  ) {
    appendTextElement(parent, "p", "画像を利用できない場合も診断結果は有効です。", "character-fallback");
    return;
  }

  const frame = parent.ownerDocument.createElement("div");
  frame.className = "result-character-frame";
  frame.setAttribute("data-character-state", "pending");
  const fallback = appendTextElement(frame, "p", characterEntry.alt, "character-fallback");
  fallback.setAttribute("role", "status");
  parent.append(frame);

  let loadStarted = false;
  async function loadOnEntry() {
    if (loadStarted) return;
    loadStarted = true;
    try {
      const result = await loadCharacterImage(characterEntry, { decodeImage });
      if (result.status === "loaded") {
        result.image.className = "result-character-image";
        result.image.setAttribute("alt", result.alt);
        result.image.setAttribute("width", String(characterEntry.width));
        result.image.setAttribute("height", String(characterEntry.height));
        frame.setAttribute("data-character-state", "loaded");
        frame.replaceChildren(result.image);
        return;
      }
    } catch {
      // The approved alt remains the visible fallback.
    }
    frame.setAttribute("data-character-state", "unavailable");
  }

  try {
    observeViewport(frame, loadOnEntry);
  } catch {
    frame.setAttribute("data-character-state", "unavailable");
  }
  appendTextElement(parent, "p", "画像を利用できない場合も診断結果は有効です。", "character-availability-note");
}

function renderResultHero(parent, snapshot, labels, dependencies) {
  const hero = parent.ownerDocument.createElement("section");
  hero.className = "result-hero";
  const prefix = snapshot.mode === "preview20" ? "仮称号" : "称号";
  appendTextElement(hero, "h2", `${prefix}：${labels.titleLabels[snapshot.titleId] ?? snapshot.titleId}`);
  appendCharacterFrame(hero, snapshot, dependencies);
  appendRenderedText(hero, snapshot.renderedTexts[0]);
  appendTextElement(
    hero,
    "p",
    "この称号は自己理解を助ける独自のプロフィール表現であり、心理学上の正式なタイプではありません。",
    "notice title-disclaimer",
  ).setAttribute("role", "note");
  parent.append(hero);
}

function renderTitleReason(parent, snapshot) {
  const section = parent.ownerDocument.createElement("section");
  section.className = "result-title-reason";
  appendTextElement(section, "h2", "この称号になった理由");
  appendRenderedText(section, snapshot.renderedTexts[1]);
  parent.append(section);
}

function renderTitleReflection(parent, snapshot) {
  const disclosure = createTitleReflectionDisclosureModel(snapshot);
  if (disclosure.records.length === 0) return;

  const section = parent.ownerDocument.createElement("section");
  section.className = "result-title-reflection";
  const heading = appendTextElement(section, "h2", "振り返りのヒント");
  heading.id = "title-reflection-heading";
  section.setAttribute("aria-labelledby", heading.id);
  if (snapshot.mode === "preview20") {
    appendTextElement(
      section,
      "p",
      "20問の簡易結果をもとにした、振り返りの参考情報です。",
      "title-reflection-preview-note",
    );
  }
  appendRenderedText(section, disclosure.records[0]);

  if (disclosure.mode === "detail50") {
    const trigger = appendTextElement(
      section,
      "button",
      "ほかのヒントを見る",
      "title-reflection-trigger",
    );
    trigger.setAttribute("type", "button");
    trigger.setAttribute("aria-expanded", "false");
    const extra = section.ownerDocument.createElement("div");
    extra.className = "title-reflection-extra";
    extra.id = "title-reflection-extra";
    extra.hidden = true;
    trigger.setAttribute("aria-controls", extra.id);
    for (const record of disclosure.records.slice(1)) appendRenderedText(extra, record);
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      trigger.textContent = expanded ? "ほかのヒントを見る" : "閉じる";
      extra.hidden = expanded;
    });
    section.append(extra);
  }

  parent.append(section);
}

function renderRadarAndFactors(parent, snapshot, labels, drawRadar) {
  const section = parent.ownerDocument.createElement("section");
  section.className = "result-factors";
  appendTextElement(section, "h2", "5因子のスコア");

  const canvas = section.ownerDocument.createElement("canvas");
  canvas.className = "result-radar";
  canvas.width = 320;
  canvas.height = 320;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "5因子スコアのレーダーチャート");
  section.append(canvas);

  let radarResult;
  try {
    radarResult = drawRadar(canvas, snapshot.factors, { factorLabels: labels.factorLabels });
  } catch {
    radarResult = { drawn: false, errorCode: "RADAR_DRAW_FAILED" };
  }
  if (!radarResult?.drawn) {
    canvas.hidden = true;
    const notice = appendTextElement(section, "p", "レーダーチャートを表示できません。5因子の数値は以下で確認できます。", "notice radar-notice");
    notice.setAttribute("role", "status");
    if (radarResult?.errorCode) notice.setAttribute("data-error-code", radarResult.errorCode);
  }

  appendTextElement(section, "h3", "0–100", "factor-score-column-heading");
  const factorList = section.ownerDocument.createElement("div");
  factorList.className = "factor-result-list";
  const disclosure = createResultDisclosureModel(snapshot, labels);
  let openFactor = null;
  let openCategory = null;

  function closeCategory() {
    if (!openCategory) return;
    openCategory.trigger.setAttribute("aria-expanded", "false");
    openCategory.panel.hidden = true;
    openCategory = null;
  }

  function closeFactor() {
    if (!openFactor) return;
    closeCategory();
    openFactor.trigger.setAttribute("aria-expanded", "false");
    openFactor.trigger.setAttribute(
      "aria-label",
      `${openFactor.label}、スコア${openFactor.displayScore}点、詳しい結果を見る`,
    );
    openFactor.hint.textContent = "詳しく見る";
    openFactor.panel.hidden = true;
    openFactor = null;
  }

  for (const factor of disclosure) {
    const row = section.ownerDocument.createElement("section");
    row.className = "factor-score-row";
    const trigger = row.ownerDocument.createElement("button");
    trigger.className = "factor-disclosure-trigger";
    trigger.setAttribute("type", "button");
    trigger.setAttribute(
      "aria-label",
      `${factor.label}、スコア${factor.displayScore}点、詳しい結果を見る`,
    );
    trigger.setAttribute("aria-expanded", "false");
    appendTextElement(trigger, "span", factor.label, "factor-score-name");
    const bar = row.ownerDocument.createElement("progress");
    bar.className = "factor-score-bar";
    bar.setAttribute("aria-label", `${factor.label}のスコア`);
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", String(factor.displayScore));
    bar.setAttribute("max", "100");
    bar.setAttribute("value", String(factor.displayScore));
    trigger.append(bar);
    appendTextElement(trigger, "span", `${factor.displayScore}`, "factor-score-value");
    appendTextElement(trigger, "span", "⌄", "factor-disclosure-chevron").setAttribute("aria-hidden", "true");
    const hint = appendTextElement(trigger, "span", "詳しく見る", "factor-disclosure-hint");
    row.append(trigger);
    const panel = row.ownerDocument.createElement("div");
    panel.className = "factor-disclosure-panel";
    panel.id = `factor-disclosure-${factor.factorId}`;
    panel.hidden = true;
    trigger.setAttribute("aria-controls", panel.id);
    appendTextElement(panel, "p", factor.description, "factor-description");

    for (const category of factor.categories) {
      const categorySection = panel.ownerDocument.createElement("section");
      categorySection.className = "factor-category";
      const categoryHeading = categorySection.ownerDocument.createElement("h4");
      categoryHeading.className = "factor-category-label";
      const categoryTrigger = appendTextElement(
        categoryHeading,
        "button",
        category.label,
        "category-disclosure-trigger",
      );
      categoryTrigger.setAttribute("type", "button");
      categoryTrigger.setAttribute("aria-expanded", "false");
      appendTextElement(
        categoryTrigger,
        "span",
        "⌄",
        "category-disclosure-chevron",
      ).setAttribute("aria-hidden", "true");
      categorySection.append(categoryHeading);
      const categoryPanel = categorySection.ownerDocument.createElement("div");
      categoryPanel.className = "category-disclosure-panel";
      categoryPanel.id = `category-disclosure-${factor.factorId}-${category.categoryId}`;
      categoryPanel.hidden = true;
      categoryTrigger.setAttribute("aria-controls", categoryPanel.id);
      for (const record of category.records) appendRenderedText(categoryPanel, record);
      categorySection.append(categoryPanel);
      categoryTrigger.addEventListener("click", () => {
        const isOpen = openCategory?.trigger === categoryTrigger;
        closeCategory();
        if (!isOpen) {
          categoryTrigger.setAttribute("aria-expanded", "true");
          categoryPanel.hidden = false;
          openCategory = {
            trigger: categoryTrigger,
            panel: categoryPanel,
          };
        }
      });
      panel.append(categorySection);
    }
    trigger.addEventListener("click", () => {
      const isOpen = openFactor?.trigger === trigger;
      closeFactor();
      if (!isOpen) {
        trigger.setAttribute("aria-expanded", "true");
        trigger.setAttribute(
          "aria-label",
          `${factor.label}、スコア${factor.displayScore}点、詳しい結果を閉じる`,
        );
        hint.textContent = "閉じる";
        panel.hidden = false;
        openFactor = {
          trigger,
          panel,
          label: factor.label,
          displayScore: factor.displayScore,
          hint,
        };
        trigger.scrollIntoView?.({ block: "nearest" });
      } else {
        trigger.setAttribute(
          "aria-label",
          `${factor.label}、スコア${factor.displayScore}点、詳しい結果を見る`,
        );
      }
    });
    row.append(panel);
    factorList.append(row);
  }
  section.append(factorList);
  if (snapshot.mode === "detail50") {
    appendTextElement(
      section,
      "p",
      "因子を選ぶと、詳しい結果を確認できます。",
      "factor-help-note",
    );
  }
  parent.append(section);
}

function renderBoundaryNotices(parent, boundaryFlags, labels) {
  if (boundaryFlags.length === 0) return;
  const section = parent.ownerDocument.createElement("section");
  section.className = "boundary-notices";
  appendTextElement(section, "h2", "今回の結果について");
  const list = section.ownerDocument.createElement("ul");
  for (const flag of boundaryFlags) {
    const item = section.ownerDocument.createElement("li");
    if (flag.type === "factor-near-band-boundary") {
      const factorLabel = labels.factorLabels[flag.factorId] ?? flag.factorId;
      appendTextElement(item, "p", `${factorLabel}は境界に近く、回答や状況により表示帯が変わり得ます。`);
    } else {
      const factorNames = flag.factorIds.map((factorId) => labels.factorLabels[factorId] ?? factorId).join("と");
      appendTextElement(item, "p", `称号の代表因子について、${factorNames}が僅差です。`);
    }
    list.append(item);
  }
  section.append(list);
  parent.append(section);
}

function renderMethodInformation(parent, snapshot, labels, dependencies) {
  const {
    questionComposition,
    methodInfo,
    methodInformationUnavailable,
  } = dependencies;
  if (
    typeof methodInformationUnavailable === "string"
    && methodInformationUnavailable.length > 0
  ) {
    const section = parent.ownerDocument.createElement("section");
    section.className = "result-method-information unavailable";
    appendTextElement(
      section,
      "p",
      methodInformationUnavailable,
      "notice method-information-unavailable",
    ).setAttribute("role", "note");
    parent.append(section);
    return;
  }
  if (!Array.isArray(questionComposition) || !Array.isArray(methodInfo)) return;
  const section = parent.ownerDocument.createElement("section");
  section.className = "result-method-information";
  appendTextElement(section, "h2", "結果の根拠と見方");
  appendTextElement(
    section,
    "p",
    "測定方法や、今回の結果を読むための補足情報です。",
    "result-method-lead",
  );
  const compositionLauncher = appendBottomSheetLauncher(section, {
    id: "question-composition",
    label: "因子ごとの設問構成を見る",
    title: "因子ごとの設問構成",
    body: "各因子に含まれる正方向・逆方向の設問数です。",
    appendContent(sheetBody) {
      appendTextElement(
        sheetBody,
        "p",
        `今回の結果：${snapshot.questionCount}問`,
        "question-composition-mode",
      );
      const table = sheetBody.ownerDocument.createElement("table");
      table.className = "question-composition-table";
      const header = sheetBody.ownerDocument.createElement("tr");
      for (const label of ["因子", "正方向", "逆方向"]) appendTextElement(header, "th", label);
      table.append(header);
      for (const row of questionComposition) {
        const tableRow = sheetBody.ownerDocument.createElement("tr");
        tableRow.className = "question-composition-row";
        appendTextElement(tableRow, "th", labels.factorLabels[row.factorId] ?? row.factorId);
        appendTextElement(tableRow, "td", String(row.positiveCount));
        appendTextElement(tableRow, "td", String(row.negativeCount));
        table.append(tableRow);
      }
      sheetBody.append(table);
      appendTextElement(
        sheetBody,
        "p",
        "設問本文や回答内容は表示しません。構成上の項目数だけを確認できます。",
        "question-composition-privacy",
      );
    },
  });
  compositionLauncher.className += " bottom-sheet-launcher--primary";
  compositionLauncher.setAttribute(
    "data-description",
    "正方向・逆方向の項目数を確認できます",
  );
  for (const method of methodInfo) {
    appendBottomSheetLauncher(section, {
      id: `method-${method.id}`,
      label: method.title,
      title: method.title,
      body: method.body,
    });
  }
  parent.append(section);
}

function renderActions(parent, snapshot, actions, { historyDetail = false } = {}) {
  const controls = parent.ownerDocument.createElement("nav");
  controls.className = "result-actions";
  controls.setAttribute("aria-label", "診断結果の操作");
  if (snapshot.mode === "preview20" && typeof actions.onContinueDetail === "function") {
    const button = appendTextElement(controls, "button", "あと30問続ける", "primary-button");
    button.setAttribute("type", "button");
    button.addEventListener("click", () => actions.onContinueDetail?.(snapshot));
  }
  if (snapshot.mode === "preview20" && typeof actions.onPausePreview === "function") {
    const button = appendTextElement(controls, "button", "中断してトップへ", "secondary-button");
    button.setAttribute("type", "button");
    button.addEventListener("click", () => actions.onPausePreview?.());
  }
  if (snapshot.mode === "preview20" && typeof actions.onFinishPreview === "function") {
    const button = appendTextElement(controls, "button", "簡易プレビューで終了する", "text-button");
    button.setAttribute("type", "button");
    button.addEventListener("click", () => actions.onFinishPreview?.());
  }
  if (
    !historyDetail
    && snapshot.mode === "detail50"
    && typeof actions.onReturnToStart === "function"
  ) {
    const button = appendTextElement(controls, "button", "トップへ戻る", "text-button");
    button.setAttribute("type", "button");
    button.addEventListener("click", () => actions.onReturnToStart?.());
  }
  if (
    !historyDetail
    && snapshot.mode === "detail50"
    && typeof actions.onRetry === "function"
  ) {
    const button = appendTextElement(controls, "button", "もう一度診断する", "secondary-button");
    button.setAttribute("type", "button");
    button.addEventListener("click", () => actions.onRetry?.());
  }
  const historyLink = appendTextElement(
    controls,
    "a",
    historyDetail ? "履歴一覧に戻る" : "結果履歴を見る",
    "text-link",
  );
  historyLink.setAttribute("href", "#/history");
  if (typeof actions.onShare === "function") {
    const button = appendTextElement(controls, "button", "結果を共有する", "secondary-button");
    button.setAttribute("type", "button");
    button.addEventListener("click", () => actions.onShare(snapshot));
  }
  parent.append(controls);
}

export function renderSavedResultScreen(host, snapshot, labels, actions = {}, dependencies = {}) {
  let savedSnapshot;
  try {
    savedSnapshot = validateResultSnapshot(snapshot);
  } catch {
    throw new TypeError("RESULT_SCREEN_INVALID");
  }
  const documentObject = host.ownerDocument ?? document;
  const main = documentObject.createElement("main");
  main.className = `app-shell result-screen ${savedSnapshot.mode}`;
  const historyDetail = dependencies.historyDetail === true;
  appendAppHeader(main, historyDetail ? {
    action: {
      label: "履歴一覧に戻る",
      href: "#/history",
    },
  } : {});
  appendScreenHeading(main, {
    kicker: savedSnapshot.mode === "preview20" ? "PREVIEW RESULT" : "DETAIL RESULT",
    title: savedSnapshot.mode === "preview20" ? "20問簡易プレビュー" : "50問詳細結果",
    titleClassName: "result-screen-title",
  });
  if (typeof dependencies.notice === "string" && dependencies.notice.length > 0) {
    const notice = appendTextElement(main, "p", dependencies.notice, "notice error-notice result-storage-error");
    notice.setAttribute("role", "alert");
  }
  renderResultHero(main, savedSnapshot, labels, dependencies);
  renderTitleReason(main, savedSnapshot);
  renderTitleReflection(main, savedSnapshot);
  renderRadarAndFactors(main, savedSnapshot, labels, dependencies.drawRadar ?? drawResultRadar);
  const completed = appendTextElement(main, "time", formatCompletedAt(savedSnapshot.completedAt), "result-completed-at");
  completed.setAttribute("datetime", savedSnapshot.completedAt);
  if (
    savedSnapshot.mode === "preview20"
    && dependencies.definitionSupported !== false
  ) {
    appendTextElement(main, "p", "20問だけでは捉えきれない面があります。あと30問に回答すると、より詳しい結果を確認できます。", "notice preview-limit");
    appendTextElement(main, "p", "20項目版は、独立した日本語版としての妥当性検証を受けていません。50問では、スコア・仮称号・仮キャラクターが変わり得ます。", "notice preview-validation-notice").setAttribute("role", "note");
  }
  renderBoundaryNotices(main, savedSnapshot.boundaryFlags, labels);
  renderMethodInformation(main, savedSnapshot, labels, dependencies);
  renderActions(main, savedSnapshot, actions, { historyDetail });
  host.replaceChildren(main);
}
