import { validateResultSnapshot } from "../domain/result-snapshot.js";
import { drawResultRadar } from "./radar-chart.js";
import { appendTextElement, formatCompletedAt } from "./screen-helpers.js";

const SECTION_LABELS = Object.freeze({
  observation: "今の傾向",
  strength: "活かしやすい強み",
  tradeoff: "気をつけたいこと",
  work: "仕事・学び",
  relationship: "人との関わり",
  stress: "ストレスとの付き合い方",
  question: "振り返りの問い",
  action: "小さな行動",
});

function appendEvidence(parent, record) {
  const details = parent.ownerDocument.createElement("details");
  details.className = "result-evidence";
  appendTextElement(details, "summary", "根拠を確認");
  const list = details.ownerDocument.createElement("ul");
  for (const reference of record.evidenceRefs) {
    appendTextElement(list, "li", reference);
  }
  details.append(list);
  parent.append(details);
}

function appendRenderedText(parent, record, heading) {
  const article = parent.ownerDocument.createElement("article");
  article.className = "result-text-item";
  if (heading) appendTextElement(article, "h3", heading);
  const paragraph = appendTextElement(
    article,
    "p",
    record.text,
    "result-text-record",
  );
  paragraph.setAttribute("data-result-text-id", record.id);
  paragraph.setAttribute("data-result-text-section", record.section);
  appendEvidence(article, record);
  parent.append(article);
}

function renderTitle(parent, snapshot, labels) {
  const section = parent.ownerDocument.createElement("section");
  section.className = "result-title";
  const prefix = snapshot.mode === "preview20" ? "仮称号" : "称号";
  appendTextElement(
    section,
    "h2",
    `${prefix}：${labels.titleLabels[snapshot.titleId] ?? snapshot.titleId}`,
  );
  appendRenderedText(section, snapshot.renderedTexts[0]);
  appendRenderedText(section, snapshot.renderedTexts[1]);
  appendTextElement(
    section,
    "p",
    "この称号は自己理解を助ける独自のプロフィール表現であり、心理学上の正式なタイプではありません。",
    "notice title-disclaimer",
  ).setAttribute("role", "note");
  parent.append(section);
}

function renderCharacterMetadata(parent, snapshot, dependencies) {
  const section = parent.ownerDocument.createElement("section");
  section.className = "result-character";
  appendTextElement(section, "h2", "結果キャラクター");
  appendTextElement(section, "p", `キャラクターID：${snapshot.characterId}`);

  const {
    characterEntry,
    decodeImage,
    loadCharacterImage,
    observeViewport,
  } = dependencies;
  if (
    !characterEntry ||
    characterEntry.characterId !== snapshot.characterId ||
    typeof decodeImage !== "function" ||
    typeof loadCharacterImage !== "function" ||
    typeof observeViewport !== "function"
  ) {
    appendTextElement(
      section,
      "p",
      "画像を利用できない場合も診断結果は有効です。",
      "character-fallback",
    );
    parent.append(section);
    return;
  }

  const frame = section.ownerDocument.createElement("div");
  frame.className = "result-character-frame";
  frame.setAttribute("data-character-state", "pending");
  const fallback = appendTextElement(
    frame,
    "p",
    characterEntry.alt,
    "character-fallback",
  );
  fallback.setAttribute("role", "status");
  section.append(frame);

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
  appendTextElement(
    section,
    "p",
    "画像を利用できない場合も診断結果は有効です。",
    "character-availability-note",
  );
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
    radarResult = drawRadar(canvas, snapshot.factors);
  } catch {
    radarResult = { drawn: false, errorCode: "RADAR_DRAW_FAILED" };
  }
  if (!radarResult?.drawn) {
    canvas.hidden = true;
    const notice = appendTextElement(
      section,
      "p",
      "レーダーチャートを表示できません。5因子の数値は以下で確認できます。",
      "notice radar-notice",
    );
    notice.setAttribute("role", "status");
    if (radarResult?.errorCode) {
      notice.setAttribute("data-error-code", radarResult.errorCode);
    }
  }

  const factorList = section.ownerDocument.createElement("div");
  factorList.className = "factor-result-list";
  for (const factor of snapshot.factors) {
    const details = section.ownerDocument.createElement("details");
    details.className = "factor-result";
    appendTextElement(
      details,
      "summary",
      `${labels.factorLabels[factor.factorId] ?? factor.factorId} ${factor.displayScore} / 100 説明を見る`,
    );
    const description = labels.factorDescriptions[factor.factorId];
    if (typeof description === "string" && description.length > 0) {
      appendTextElement(details, "p", description);
    }
    factorList.append(details);
  }
  section.append(factorList);
  parent.append(section);
}

function renderBoundaryNotices(parent, boundaryFlags, labels) {
  if (boundaryFlags.length === 0) return;
  const section = parent.ownerDocument.createElement("section");
  section.className = "boundary-notices";
  appendTextElement(section, "h2", "結果の見方について");
  const list = section.ownerDocument.createElement("ul");
  for (const flag of boundaryFlags) {
    const item = section.ownerDocument.createElement("li");
    if (flag.type === "factor-near-band-boundary") {
      const factorLabel = labels.factorLabels[flag.factorId] ?? flag.factorId;
      appendTextElement(
        item,
        "p",
        `${factorLabel}は境界に近く、回答や状況により表示帯が変わり得ます。`,
      );
    } else {
      const factorNames = flag.factorIds
        .map((factorId) => labels.factorLabels[factorId] ?? factorId)
        .join("と");
      appendTextElement(
        item,
        "p",
        `称号の代表因子について、${factorNames}が僅差です。`,
      );
    }
    list.append(item);
  }
  section.append(list);
  parent.append(section);
}

function renderResultTexts(parent, snapshot, labels) {
  const section = parent.ownerDocument.createElement("section");
  section.className = "result-details";
  appendTextElement(
    section,
    "h2",
    snapshot.mode === "preview20" ? "5因子の観察" : "詳しい自己理解のヒント",
  );

  let previousSection = null;
  snapshot.renderedTexts.slice(2).forEach((record, index) => {
    if (record.section !== previousSection) {
      appendTextElement(section, "h3", SECTION_LABELS[record.section] ?? record.section);
      previousSection = record.section;
    }
    const factor = snapshot.factors[index % snapshot.factors.length];
    appendRenderedText(
      section,
      record,
      labels.factorLabels[factor.factorId] ?? factor.factorId,
    );
  });
  if (snapshot.mode === "detail50") {
    appendTextElement(
      section,
      "p",
      "※因子名の「説明を見る」から、それぞれの意味を確認できます。",
      "factor-help-note",
    );
  }
  parent.append(section);
}

function renderActions(parent, snapshot, actions) {
  const controls = parent.ownerDocument.createElement("nav");
  controls.className = "result-actions";
  controls.setAttribute("aria-label", "診断結果の操作");

  if (
    snapshot.mode === "preview20" &&
    typeof actions.onContinueDetail === "function"
  ) {
    const continueButton = appendTextElement(
      controls,
      "button",
      "あと30問に回答する",
      "primary-button",
    );
    continueButton.setAttribute("type", "button");
    continueButton.addEventListener(
      "click",
      () => actions.onContinueDetail?.(snapshot),
    );
  } else if (
    snapshot.mode === "detail50" &&
    typeof actions.onRetry === "function"
  ) {
    const retryButton = appendTextElement(
      controls,
      "button",
      "もう一度診断する",
      "secondary-button",
    );
    retryButton.setAttribute("type", "button");
    retryButton.addEventListener("click", () => actions.onRetry?.());
  }

  const historyLink = appendTextElement(
    controls,
    "a",
    "結果履歴を見る",
    "text-link",
  );
  historyLink.setAttribute("href", "#/history");

  if (typeof actions.onShare === "function") {
    const shareButton = appendTextElement(
      controls,
      "button",
      "結果を共有する",
      "secondary-button",
    );
    shareButton.setAttribute("type", "button");
    shareButton.addEventListener("click", () => actions.onShare(snapshot));
  }
  parent.append(controls);
}

export function renderSavedResultScreen(
  host,
  snapshot,
  labels,
  actions = {},
  dependencies = {},
) {
  let savedSnapshot;
  try {
    savedSnapshot = validateResultSnapshot(snapshot);
  } catch {
    throw new TypeError("RESULT_SCREEN_INVALID");
  }

  const documentObject = host.ownerDocument ?? document;
  const main = documentObject.createElement("main");
  main.className = `app-shell result-screen ${savedSnapshot.mode}`;
  appendTextElement(
    main,
    "h1",
    savedSnapshot.mode === "preview20" ? "20問簡易プレビュー" : "50問詳細結果",
  );
  const completed = appendTextElement(
    main,
    "time",
    formatCompletedAt(savedSnapshot.completedAt),
    "result-completed-at",
  );
  completed.setAttribute("datetime", savedSnapshot.completedAt);
  if (savedSnapshot.mode === "preview20") {
    appendTextElement(
      main,
      "p",
      "20問だけでは捉えきれない面があります。あと30問に回答すると、より詳しい結果を確認できます。",
      "notice preview-limit",
    );
    appendTextElement(
      main,
      "p",
      "20項目版は、独立した日本語版としての妥当性検証を受けていません。50問では、スコア・仮称号・仮キャラクターが変わり得ます。",
      "notice preview-validation-notice",
    ).setAttribute("role", "note");
  }

  renderTitle(main, savedSnapshot, labels);
  renderCharacterMetadata(main, savedSnapshot, dependencies);
  appendTextElement(
    main,
    "p",
    `診断時の選択色ID：${savedSnapshot.selectedPaletteId}`,
    "result-palette-metadata",
  );
  renderRadarAndFactors(
    main,
    savedSnapshot,
    labels,
    dependencies.drawRadar ?? drawResultRadar,
  );
  renderBoundaryNotices(
    main,
    savedSnapshot.boundaryFlags,
    labels,
  );
  renderResultTexts(main, savedSnapshot, labels);
  renderActions(main, savedSnapshot, actions);
  host.replaceChildren(main);
}
