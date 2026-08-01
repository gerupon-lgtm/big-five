import { appMeta } from "../config/app-meta.js";
import { resultShareCallToActionCopy } from "../config/ui-copy.js";
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

const FRAGRANCE_TEASER_ASSETS = Object.freeze({
  pause: Object.freeze({
    src: "./assets/share-card/aroma-pause-v1.png",
    width: 994,
    height: 857,
  }),
  reset: Object.freeze({
    src: "./assets/share-card/aroma-reset-v1.png",
    width: 1243,
    height: 848,
  }),
  "quiet-focus": Object.freeze({
    src: "./assets/share-card/aroma-quiet-focus-v1.png",
    width: 875,
    height: 960,
  }),
});

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

function drawPaletteSwatch(canvas, primaryColor) {
  try {
    const context = canvas.getContext?.("2d");
    if (!context) return;
    context.beginPath();
    context.arc(36, 36, 32, 0, Math.PI * 2);
    context.fillStyle = primaryColor;
    context.fill();
  } catch {
    // The Palette choice remains available when Canvas drawing is unavailable.
  }
}

function createExclusiveResultPanelGroup(initialOpenId = null) {
  const members = [];

  return {
    register(member) {
      members.push(member);
      if (member.id === initialOpenId) member.open();
    },
    closeOthers(activeMember) {
      for (const member of members) {
        if (member !== activeMember && member.isOpen()) member.close();
      }
    },
    openId() {
      return members.find((member) => member.isOpen())?.id ?? null;
    },
  };
}

function findPaletteChoice(root, paletteId) {
  if (root?.getAttribute?.("data-palette-id") === paletteId) return root;
  for (const child of root?.children ?? []) {
    const match = findPaletteChoice(child, paletteId);
    if (match) return match;
  }
  return null;
}

function renderPaletteSelector(
  parent,
  snapshot,
  actions,
  dependencies,
) {
  const paletteSet = dependencies.presentation?.palettes;
  const options = paletteSet && Array.isArray(paletteSet.alternatives)
    ? [paletteSet.standard, ...paletteSet.alternatives]
    : [];
  if (
    typeof actions.onSelectPalette !== "function"
    || options.length !== 3
    || new Set(options.map((palette) => palette?.paletteId)).size !== 3
    || !options.some(({ paletteId }) => paletteId === snapshot.selectedPaletteId)
    || options.some((palette) =>
      !palette
      || typeof palette.paletteId !== "string"
      || typeof palette.label !== "string"
      || !palette.baseColors
      || !["primary", "secondary", "accent"].every((role) =>
        /^#[0-9A-F]{6}$/.test(palette.baseColors[role])))
  ) {
    return;
  }

  const section = parent.ownerDocument.createElement("section");
  section.className = "result-palette-selector";
  section.setAttribute("data-palette-selector", "");
  appendTextElement(
    section,
    "h2",
    "ココロパレット",
    "result-presentation-title",
  );
  appendTextElement(
    section,
    "p",
    "～あなたらしさから着想した色～",
    "result-presentation-subtitle",
  );
  appendTextElement(
    section,
    "p",
    "選んだ色は、共有カードの色合いに反映されます。",
    "result-presentation-description",
  );
  const group = parent.ownerDocument.createElement("div");
  group.className = "result-palette-options";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "結果カードの色を選ぶ");
  const choices = [];

  function setSelectedChoice(selectedPaletteId) {
    for (const choice of choices) {
      const selected = choice.paletteId === selectedPaletteId;
      choice.button.className = selected
        ? "palette-choice palette-choice--selected"
        : "palette-choice";
      choice.button.setAttribute("aria-pressed", String(selected));
      choice.button.setAttribute(
        "aria-label",
        `${choice.label}${selected ? "、選択中" : ""}`,
      );
      choice.check.hidden = !selected;
    }
  }

  options.forEach((palette, index) => {
    const selected = palette.paletteId === snapshot.selectedPaletteId;
    const button = parent.ownerDocument.createElement("button");
    button.className = selected
      ? "palette-choice palette-choice--selected"
      : "palette-choice";
    button.setAttribute("type", "button");
    button.setAttribute("data-palette-id", palette.paletteId);
    button.setAttribute("aria-pressed", String(selected));
    const visibleLabel = `パレット${index + 1}`;
    button.setAttribute(
      "aria-label",
      `${visibleLabel}${selected ? "、選択中" : ""}`,
    );
    const swatchFrame = parent.ownerDocument.createElement("span");
    swatchFrame.className = "palette-choice__swatch-frame";
    const swatch = parent.ownerDocument.createElement("canvas");
    swatch.className = "palette-choice__swatch";
    swatch.setAttribute("aria-hidden", "true");
    swatch.setAttribute("width", "72");
    swatch.setAttribute("height", "72");
    drawPaletteSwatch(swatch, palette.baseColors.primary);
    swatchFrame.append(swatch);
    const check = appendTextElement(swatchFrame, "span", "✓", "palette-choice__check");
    check.setAttribute("aria-hidden", "true");
    check.hidden = !selected;
    button.append(swatchFrame);
    const label = appendTextElement(
      button,
      "span",
      visibleLabel,
      "palette-choice__label",
    );
    label.setAttribute("data-palette-option-label", "");
    choices.push({ button, check, label: visibleLabel, paletteId: palette.paletteId });
    button.addEventListener("click", () => {
      setSelectedChoice(palette.paletteId);
      actions.onSelectPalette?.(palette.paletteId, {
        openResultDisclosureId: dependencies.getOpenResultDisclosureId?.() ?? null,
      });
      const focusRoot = parent.ownerDocument.getElementById?.("app") ?? parent;
      findPaletteChoice(focusRoot, palette.paletteId)?.focus?.();
    });
    group.append(button);
  });
  section.append(group);
  parent.append(section);
}

function renderFragranceIdeas(parent, dependencies, panelGroup) {
  const scenes = dependencies.presentation?.fragranceScenes;
  if (
    !Array.isArray(scenes)
    || scenes.length !== 3
    || scenes.some((scene) =>
      !scene
      || typeof scene.sceneId !== "string"
      || typeof scene.iconId !== "string"
      || typeof scene.label !== "string"
      || !Array.isArray(scene.candidates)
      || scene.candidates.length !== 2
      || scene.candidates.some((candidate) =>
        !candidate
        || typeof candidate.accordLabel !== "string"
        || typeof candidate.description !== "string"
        || !Array.isArray(candidate.materialNames)
        || candidate.materialNames.length < 1
        || candidate.materialNames.length > 2
        || candidate.materialNames.some((name) =>
          typeof name !== "string" || name.length === 0)))
  ) {
    return;
  }

  const section = parent.ownerDocument.createElement("section");
  section.className = "result-fragrance-section";
  const trigger = parent.ownerDocument.createElement("button");
  trigger.className = "result-presentation-summary";
  trigger.setAttribute("type", "button");
  trigger.setAttribute("data-fragrance-disclosure-trigger", "");
  trigger.setAttribute("aria-expanded", "false");
  appendTextElement(
    trigger,
    "span",
    "ココロアロマ",
    "result-presentation-title",
  );
  appendTextElement(
    trigger,
    "span",
    "～あなたらしさから着想した香り～",
    "result-presentation-subtitle",
  );
  const teasers = parent.ownerDocument.createElement("span");
  teasers.className = "result-fragrance-teasers";
  for (const scene of scenes) {
    const asset = FRAGRANCE_TEASER_ASSETS[scene.sceneId];
    if (!asset) return;
    const teaser = parent.ownerDocument.createElement("span");
    teaser.className = "result-fragrance-teaser";
    const image = parent.ownerDocument.createElement("img");
    image.className = "result-fragrance-teaser-image";
    image.setAttribute("src", asset.src);
    image.setAttribute("alt", `${scene.label}をイメージした香り`);
    image.setAttribute("loading", "lazy");
    image.setAttribute("width", String(asset.width));
    image.setAttribute("height", String(asset.height));
    teaser.append(image);
    teasers.append(teaser);
  }
  trigger.append(teasers);
  section.append(trigger);
  const panel = parent.ownerDocument.createElement("div");
  panel.className = "result-fragrance-panel";
  panel.id = "fragrance-disclosure";
  panel.hidden = true;
  panel.setAttribute("data-fragrance-disclosure-panel", "");
  trigger.setAttribute("aria-controls", panel.id);

  for (const scene of scenes) {
    const sceneSection = parent.ownerDocument.createElement("section");
    sceneSection.className = "result-fragrance-scene";
    sceneSection.setAttribute("data-scene-id", scene.sceneId);
    sceneSection.setAttribute("data-icon-id", scene.iconId);
    appendTextElement(sceneSection, "h3", scene.label);
    const candidates = parent.ownerDocument.createElement("div");
    candidates.className = "result-fragrance-candidates";
    for (const candidate of scene.candidates) {
      const article = parent.ownerDocument.createElement("article");
      article.className = "result-fragrance-candidate";
      appendTextElement(article, "h4", candidate.accordLabel);
      appendTextElement(
        article,
        "p",
        `香りの素材例：${candidate.materialNames.join("・")}`,
        "result-fragrance-materials",
      );
      appendTextElement(
        article,
        "p",
        candidate.description,
        "result-fragrance-description",
      );
      candidates.append(article);
    }
    sceneSection.append(candidates);
    panel.append(sceneSection);
  }
  appendTextElement(
    panel,
    "p",
    "香りをイメージするための素材例です。",
    "result-fragrance-note",
  );
  appendTextElement(
    panel,
    "p",
    "あなたらしさから着想した雰囲気の候補であり、現在の心理状態や効果を示すものではありません。実際の使用方法を案内するものではありません。",
    "result-fragrance-disclaimer",
  );
  const member = {
    id: "aroma",
    isOpen() {
      return !panel.hidden;
    },
    open() {
      trigger.setAttribute("aria-expanded", "true");
      panel.hidden = false;
    },
    close() {
      trigger.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    },
  };
  panelGroup.register(member);
  trigger.addEventListener("click", () => {
    const isOpen = member.isOpen();
    member.close();
    if (!isOpen) {
      panelGroup.closeOthers(member);
      member.open();
    }
    trigger.scrollIntoView?.({ block: "nearest" });
  });
  section.append(panel);
  parent.append(section);
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

function renderRadarAndFactors(parent, snapshot, labels, drawRadar, panelGroup) {
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
    trigger.setAttribute("data-factor-disclosure-trigger", factor.factorId);
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
    panel.setAttribute("data-factor-disclosure-panel", factor.factorId);
    trigger.setAttribute("aria-controls", panel.id);
    appendTextElement(panel, "p", factor.description, "factor-description");

    for (const category of factor.categories) {
      const categorySection = panel.ownerDocument.createElement("section");
      categorySection.className = "factor-category";
      categorySection.setAttribute("data-factor-category", category.categoryId);
      const categoryHeading = categorySection.ownerDocument.createElement("h4");
      categoryHeading.className = "factor-category-label";
      categoryHeading.textContent = category.label;
      categorySection.append(categoryHeading);
      for (const record of category.records) appendRenderedText(categorySection, record);
      panel.append(categorySection);
    }
    const member = {
      id: `factor:${factor.factorId}`,
      isOpen() {
        return !panel.hidden;
      },
      open() {
        trigger.setAttribute("aria-expanded", "true");
        trigger.setAttribute(
          "aria-label",
          `${factor.label}、スコア${factor.displayScore}点、詳しい結果を閉じる`,
        );
        hint.textContent = "閉じる";
        panel.hidden = false;
      },
      close() {
        trigger.setAttribute("aria-expanded", "false");
        trigger.setAttribute(
          "aria-label",
          `${factor.label}、スコア${factor.displayScore}点、詳しい結果を見る`,
        );
        hint.textContent = "詳しく見る";
        panel.hidden = true;
      },
    };
    panelGroup.register(member);
    trigger.addEventListener("click", () => {
      const isOpen = member.isOpen();
      member.close();
      if (!isOpen) {
        panelGroup.closeOthers(member);
        member.open();
      }
      trigger.scrollIntoView?.({ block: "nearest" });
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

function renderShareCallToAction(parent, snapshot, actions) {
  if (typeof actions.onShare !== "function") return;
  const section = parent.ownerDocument.createElement("section");
  section.className = "result-share-call-to-action";
  const icon = parent.ownerDocument.createElement("img");
  icon.className = "result-share-call-to-action__icon";
  icon.setAttribute("src", appMeta.brand.cardIconPath);
  icon.setAttribute("alt", "");
  icon.setAttribute("aria-hidden", "true");
  section.append(icon);
  appendTextElement(section, "h2", resultShareCallToActionCopy.heading);
  const button = appendTextElement(
    section,
    "button",
    resultShareCallToActionCopy.action,
    "primary-button",
  );
  button.setAttribute("type", "button");
  button.addEventListener("click", () => actions.onShare(snapshot));
  parent.append(section);
}

function renderActions(
  parent,
  snapshot,
  actions,
  { historyDetail = false, historyPreviewInProgress = false } = {},
) {
  const controls = parent.ownerDocument.createElement("nav");
  controls.className = "result-actions";
  controls.setAttribute("aria-label", "診断結果の操作");
  if (
    snapshot.mode === "preview20"
    && (!historyDetail || historyPreviewInProgress)
    && typeof actions.onContinueDetail === "function"
  ) {
    const button = appendTextElement(controls, "button", "50問へ進む", "primary-button");
    button.setAttribute("type", "button");
    button.addEventListener("click", () => actions.onContinueDetail?.(snapshot));
  }
  if (
    !historyDetail
    && snapshot.mode === "preview20"
    && typeof actions.onFinishPreview === "function"
  ) {
    const button = appendTextElement(controls, "button", "簡易プレビューで終了する", "secondary-button");
    button.setAttribute("type", "button");
    button.addEventListener("click", () => actions.onFinishPreview?.());
  }
  if (
    !historyDetail
    && snapshot.mode === "detail50"
    && typeof actions.onReturnToStart === "function"
  ) {
    const button = appendTextElement(controls, "button", "トップへ戻る", "secondary-button");
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
  if (historyDetail) {
    const historyLink = appendTextElement(
      controls,
      "a",
      "履歴一覧に戻る",
      "secondary-button",
    );
    historyLink.setAttribute("href", "#/history");
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
  const historyPreviewInProgress = dependencies.historyPreviewInProgress === true;
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
  const resultPanelGroup = createExclusiveResultPanelGroup(
    dependencies.openResultDisclosureId,
  );
  renderTitleReason(main, savedSnapshot);
  renderTitleReflection(main, savedSnapshot);
  renderRadarAndFactors(
    main,
    savedSnapshot,
    labels,
    dependencies.drawRadar ?? drawResultRadar,
    resultPanelGroup,
  );
  if (!historyPreviewInProgress) {
    renderPaletteSelector(
      main,
      savedSnapshot,
      actions,
      {
        ...dependencies,
        getOpenResultDisclosureId() {
          return resultPanelGroup.openId();
        },
      },
    );
  }
  renderFragranceIdeas(main, dependencies, resultPanelGroup);
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
  if (!historyPreviewInProgress) {
    renderShareCallToAction(main, savedSnapshot, actions);
  }
  renderMethodInformation(main, savedSnapshot, labels, dependencies);
  renderActions(main, savedSnapshot, actions, {
    historyDetail,
    historyPreviewInProgress,
  });
  host.replaceChildren(main);
}
