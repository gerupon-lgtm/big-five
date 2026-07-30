import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { appMeta } from "../../app/js/config/app-meta.js";
import { ResultTextDefinitions } from "../../app/js/data/result-text-definitions.js";
import { selectPresentation } from "../../app/js/domain/presentation-selector.js";
import { loadPresentationReviewModel } from "./render-presentation-review.mjs";
import {
  shareCardPreviewDefinition,
  validateShareCardPreviewDefinition,
} from "./share-card-preview-definition.mjs";

const PROJECT_ROOT = path.resolve(import.meta.dirname, "../..");
const SELECTION_ROLES = Object.freeze([
  Object.freeze({ id: "standard", label: "標準" }),
  Object.freeze({ id: "alternative-1", label: "代替1" }),
  Object.freeze({ id: "alternative-2", label: "代替2" }),
]);

function invalidPreview(cause) {
  if (cause === undefined) {
    throw new TypeError("PALETTE_PREVIEW_INVALID");
  }
  throw new TypeError("PALETTE_PREVIEW_INVALID", { cause });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function scriptJson(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003C")
    .replaceAll(">", "\\u003E")
    .replaceAll("&", "\\u0026");
}

function roundedRatios(report) {
  return {
    textBackground: Number(report.ratios.textBackground.toFixed(3)),
    textSurface: Number(report.ratios.textSurface.toFixed(3)),
    accentSurface: Number(report.ratios.accentSurface.toFixed(3)),
    chartBackground: Number(report.ratios.chartBackground.toFixed(3)),
    valid: report.valid,
  };
}

function projectMapping(mapping) {
  return {
    background: mapping.roles.background,
    surface: mapping.roles.surface,
    accent: mapping.roles.accent,
    chart: mapping.roles.chart,
    textCandidates: mapping.textCandidates,
  };
}

function titleDescriptionsById(titleProfiles) {
  const descriptions = ResultTextDefinitions.filter((definition) =>
    definition.version === appMeta.diagnosticVersions.resultTextVersion &&
    definition.section === "titleSubtitle");
  const byTitleId = new Map();
  for (const definition of descriptions) {
    const titleId = definition.appliesTo?.titleId;
    if (typeof titleId !== "string" || titleId === "" ||
      typeof definition.text !== "string" || definition.text === "" ||
      byTitleId.has(titleId)) {
      invalidPreview(new TypeError("TITLE_DESCRIPTION_INVALID"));
    }
    byTitleId.set(titleId, definition.text);
  }
  if (byTitleId.size !== titleProfiles.length ||
    titleProfiles.some(({ titleId }) => !byTitleId.has(titleId))) {
    invalidPreview(new TypeError("TITLE_DESCRIPTION_INVALID"));
  }
  return byTitleId;
}

export async function loadPalettePreviewModel({
  sourceDir,
  representativeCatPath = path.join(
    PROJECT_ROOT,
    shareCardPreviewDefinition.representativeCatSource,
  ),
} = {}) {
  if (typeof sourceDir !== "string" || sourceDir === "") invalidPreview();
  try {
    validateShareCardPreviewDefinition(shareCardPreviewDefinition);
  } catch (error) {
    invalidPreview(error);
  }

  let representativeCat = null;
  let representativeCatError = null;
  try {
    const image = await readFile(representativeCatPath);
    if (image.length > 0) {
      representativeCat = image;
    } else {
      representativeCatError = new TypeError(
        "REPRESENTATIVE_CAT_UNAVAILABLE",
        { cause: new TypeError("REPRESENTATIVE_CAT_EMPTY") },
      );
    }
  } catch (error) {
    representativeCatError = new TypeError(
      "REPRESENTATIVE_CAT_UNAVAILABLE",
      { cause: error },
    );
  }

  let review;
  try {
    review = await loadPresentationReviewModel({ sourceDir });
  } catch (error) {
    invalidPreview(error);
  }
  const titleDescriptionById = titleDescriptionsById(review.titleProfiles);
  const mappingById = new Map(
    review.definitionSet.paletteUsageMappings.map((mapping) => [
      mapping.paletteId,
      mapping,
    ]),
  );
  const reportById = new Map(
    review.contrastReports.map((report) => [report.paletteId, report]),
  );
  const contentReviewById = new Map(
    review.paletteContentReviews.map(({ paletteId, contentReviewNote }) => [
      paletteId,
      contentReviewNote,
    ]),
  );
  const palettes = [];

  for (const [titleIndex, title] of review.titleProfiles.entries()) {
    const selection = selectPresentation(title, review.definitionSet);
    const selectedPalettes = [
      selection.palettes.standard,
      ...selection.palettes.alternatives,
    ];
    selectedPalettes.forEach((palette, paletteIndex) => {
      const mapping = mappingById.get(palette.paletteId);
      const report = reportById.get(palette.paletteId);
      if (!mapping || !report || !contentReviewById.has(palette.paletteId)) {
        invalidPreview();
      }
      palettes.push({
        titleId: title.titleId,
        titleLabel: title.label,
        titleOrder: titleIndex + 1,
        selectionRole: SELECTION_ROLES[paletteIndex].id,
        paletteId: palette.paletteId,
        paletteLabel: palette.label,
        titleDescription: titleDescriptionById.get(title.titleId),
        description: palette.description,
        contentReviewNote: contentReviewById.get(palette.paletteId),
        baseColors: palette.baseColors,
        mapping: projectMapping(mapping),
        resolved: report.resolved,
        contrast: roundedRatios(report),
      });
    });
  }

  if (palettes.length !== 153 ||
    new Set(palettes.map(({ paletteId }) => paletteId)).size !== 153) {
    invalidPreview();
  }
  const p0 = review.approvals.find(({ gate_id }) => gate_id === "P-0");
  if (!p0) invalidPreview();

  return Object.freeze({
    presentationDefinitionVersion:
      review.definitionSet.presentationDefinitionVersion,
    approvalStatus: p0.status,
    titleCount: review.titleProfiles.length,
    paletteCount: palettes.length,
    palettes: Object.freeze(palettes),
    shareCardPreview: Object.freeze({
      definition: shareCardPreviewDefinition,
      representativeCatAvailable: representativeCat !== null,
      representativeCatError,
      representativeCatDataUrl: representativeCat === null
        ? null
        : `data:image/png;base64,${representativeCat.toString("base64")}`,
      brandName: appMeta.brand.name,
      cardSubtitle: appMeta.brand.cardSubtitle,
      appVersion: appMeta.appVersion,
    }),
  });
}

function colorControl(entry, role, label) {
  const color = entry.baseColors[role];
  const prefix = `${entry.titleLabel} ${entry.paletteLabel}`;
  return `
              <label class="color-field">
                <span>${label}</span>
                <span class="color-inputs">
                  <input type="color" value="${color}" data-color-role="${role}" aria-label="${escapeHtml(`${prefix} ${label} 色選択`)}">
                  <input class="hex-input" value="${color}" data-hex-role="${role}" aria-label="${escapeHtml(`${prefix} ${label} HEX`)}" inputmode="text" maxlength="7" spellcheck="false">
                </span>
              </label>`;
}

function resolvedSwatch(role, label, color) {
  return `
                <span class="resolved-item">
                  <span class="resolved-swatch" data-role="${role}-swatch" style="--swatch:${color}"></span>
                  <span>${label}</span>
                  <code data-role="${role}-hex">${color}</code>
                </span>`;
}

function factorRow(factor) {
  return `
    <div class="preview-factor-row"
      data-factor-id="${factor.factorId}"
      data-sample-display-score="${factor.sampleDisplayScore}" data-bar-fill-color="${factor.barFillColor}" data-text-outline-color="${factor.textOutlineColor}"
      style="--factor-bar-fill:${factor.barFillColor};--factor-text-outline:${factor.textOutlineColor}">
      <span class="preview-factor-label">${factor.label}</span>
      <span class="preview-factor-track">
        <span class="preview-factor-value"
          style="width:${factor.sampleDisplayScore}%"></span>
      </span>
      <strong>${factor.sampleDisplayScore}</strong>
    </div>`;
}

function shareCardPreview(entry, preview) {
  const cat = preview.representativeCatAvailable
    ? `<div class="preview-cat available" role="img"
        aria-label="色と配置を確認するための代表猫"></div>`
    : `<div class="preview-cat unavailable" role="img"
        aria-label="代表猫画像を読み込めない場合の配置見本">
        <span>${escapeHtml(preview.definition.representativeCatUnavailableMessage)}</span>
      </div>`;
  return `
    <section class="share-card-preview"
      aria-label="${escapeHtml(`${entry.titleLabel} ${entry.paletteLabel}の配色確認用簡略プレビュー`)}">
      <p class="preview-only-label">配色確認用の簡略プレビュー</p>
      <div class="preview-brand">
        <svg aria-hidden="true"><use href="#kokoro-parea-preview-mark"></use></svg>
        <div><strong>${escapeHtml(preview.brandName)}</strong>
        <small>${escapeHtml(preview.cardSubtitle)}</small></div>
      </div>
      <p class="preview-title-kicker">あなたの称号</p>
      <h3>${escapeHtml(entry.titleLabel)}</h3>
      <p class="preview-description">${escapeHtml(entry.titleDescription)}</p>
      ${cat}
      <p class="preview-cat-notice">
        ${escapeHtml(preview.definition.representativeCatNotice)}
      </p>
      <div class="preview-factors">
        ${preview.definition.factors.map(factorRow).join("")}
      </div>
      <div class="preview-fragrances" aria-label="香り欄の配置見本">
        ${preview.definition.fragrancePlaceholders.map((label) =>
          `<div class="preview-fragrance-row"><span>${escapeHtml(label)}</span><i></i></div>`).join("")}
      </div>
      <p class="preview-disclaimer">
        これは性格の優劣や心理学上の正式なタイプを示すものではありません。
      </p>
      <p class="preview-mode">${escapeHtml(preview.definition.modeLabel)}</p>
      <p class="preview-version">${escapeHtml(preview.appVersion)}</p>
    </section>`;
}

function paletteCard(entry, preview) {
  const role = SELECTION_ROLES.find(({ id }) => id === entry.selectionRole);
  if (!role) invalidPreview();
  const resolved = entry.resolved;
  const note = entry.contentReviewNote === ""
    ? "確認事項なし"
    : entry.contentReviewNote;
  const noteClass = entry.contentReviewNote === "" ? "" : " has-review-note";

  return `
        <article class="palette-preview-card${noteClass}" data-palette-id="${escapeHtml(entry.paletteId)}" data-title-order="${entry.titleOrder}" data-selection-role="${entry.selectionRole}" style="--preview-bg:${resolved.background};--preview-surface:${resolved.surface};--preview-accent:${resolved.accent};--preview-chart:${resolved.chart};--preview-text:${resolved.text};">
          <header class="card-heading">
            <div>
              <p class="eyebrow">${entry.titleOrder}. ${escapeHtml(entry.titleLabel)}</p>
              <h2>${escapeHtml(entry.paletteLabel)}</h2>
            </div>
            <span class="selection-badge">${role.label}</span>
          </header>

          ${shareCardPreview(entry, preview)}

          <details class="palette-editor">
            <summary>基調色を試しに変更</summary>
            <p class="editor-note">このカードだけ一時的に変わります。正典CSVには保存されません。</p>
            <p class="palette-description">配色メモ：${escapeHtml(entry.description)}</p>
            <div class="color-fields">
              ${colorControl(entry, "primary", "Primary")}
              ${colorControl(entry, "secondary", "Secondary")}
              ${colorControl(entry, "accent", "Accent")}
            </div>
            <button type="button" class="reset-one" data-action="reset-one">この配色を初期値に戻す</button>
          </details>

          <div class="resolved-grid" aria-label="実際に使用する解決色">
            ${resolvedSwatch("background", "背景", resolved.background)}
            ${resolvedSwatch("surface", "表面", resolved.surface)}
            ${resolvedSwatch("accent", "差し色", resolved.accent)}
            ${resolvedSwatch("chart", "パレット由来のグラフ用途色", resolved.chart)}
            ${resolvedSwatch("text", "文字", resolved.text)}
          </div>

          <div class="contrast-status" data-role="contrast-status">
            WCAG適合：文字-背景 ${entry.contrast.textBackground.toFixed(3)}／文字-表面 ${entry.contrast.textSurface.toFixed(3)}／差し色-表面 ${entry.contrast.accentSurface.toFixed(3)}／グラフ-背景 ${entry.contrast.chartBackground.toFixed(3)}
          </div>
          <p class="content-review">${escapeHtml(note)}</p>
          <code class="palette-id">${escapeHtml(entry.paletteId)}</code>
        </article>`;
}

function previewStyles(preview) {
  const representativeCatCss = preview.representativeCatAvailable
    ? `url("${preview.representativeCatDataUrl
      .replaceAll("\\", "\\\\")
      .replaceAll('"', '\\"')}")`
    : "none";
  return `
    :root {
      --representative-cat: ${representativeCatCss};
      color-scheme: light;
      font-family: "Yu Gothic UI", "Hiragino Sans", system-ui, sans-serif;
      color: #18372f;
      background: #f3f7f5;
    }
    * { box-sizing: border-box; }
    body { margin: 0; min-width: 0; }
    .svg-definitions { position: absolute; width: 0; height: 0; overflow: hidden; }
    button, input, textarea { font: inherit; }
    .page-header {
      padding: 28px clamp(18px, 4vw, 56px);
      color: #fff;
      background: #26705c;
    }
    .page-header h1 { margin: 4px 0 8px; font-size: clamp(1.6rem, 4vw, 2.5rem); }
    .page-header p { margin: 0; max-width: 72rem; line-height: 1.7; }
    .page-header .eyebrow { color: #fff4b8; font-weight: 800; letter-spacing: .08em; }
    .notice {
      margin: 18px clamp(18px, 4vw, 56px) 0;
      padding: 14px 16px;
      border: 1px solid #e0b83f;
      border-radius: 12px;
      background: #fff8d8;
      color: #5f4900;
      font-weight: 700;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: grid;
      gap: 12px;
      padding: 16px clamp(18px, 4vw, 56px);
      border-bottom: 1px solid #bfd2ca;
      background: rgba(255, 255, 255, .96);
      box-shadow: 0 6px 18px rgba(22, 66, 53, .08);
    }
    .toolbar-row { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; }
    .search-field { flex: 1 1 280px; }
    .search-field input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #90aca1;
      border-radius: 10px;
    }
    .check-field { display: inline-flex; gap: 7px; align-items: center; font-weight: 700; }
    .toolbar button, .reset-one {
      padding: 9px 12px;
      border: 1px solid #26705c;
      border-radius: 9px;
      color: #185342;
      background: #fff;
      cursor: pointer;
      font-weight: 800;
    }
    .toolbar button:hover, .reset-one:hover { background: #e7f3ee; }
    #visible-count { margin-left: auto; font-weight: 800; }
    .changes-panel {
      margin: 16px clamp(18px, 4vw, 56px);
      border: 1px solid #bfd2ca;
      border-radius: 12px;
      background: #fff;
    }
    .changes-panel summary { padding: 13px 15px; cursor: pointer; font-weight: 800; }
    .changes-panel textarea {
      display: block;
      width: calc(100% - 30px);
      min-height: 110px;
      margin: 0 15px 15px;
      padding: 10px;
      border: 1px solid #90aca1;
      border-radius: 8px;
      font-family: Consolas, monospace;
      font-size: .84rem;
    }
    .palette-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
      gap: 18px;
      padding: 8px clamp(18px, 4vw, 56px) 56px;
    }
    .palette-preview-card {
      min-width: 0;
      overflow: hidden;
      border: 1px solid #bed1c9;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 8px 24px rgba(24, 72, 58, .09);
    }
    .palette-preview-card[hidden] { display: none; }
    .palette-preview-card.has-review-note { border: 3px solid #d29d00; }
    .card-heading {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: start;
      padding: 15px 16px 12px;
    }
    .card-heading .eyebrow { margin: 0 0 4px; color: #55756a; font-size: .78rem; }
    .card-heading h2 { margin: 0; font-size: 1.08rem; }
    .selection-badge {
      flex: none;
      padding: 4px 8px;
      border-radius: 999px;
      color: #fff;
      background: #26705c;
      font-size: .74rem;
      font-weight: 800;
    }
    .share-card-preview {
      aspect-ratio: 3 / 5;
      width: min(100%, 18rem);
      margin-inline: auto;
      padding: 0.75rem;
      overflow: hidden;
      color: var(--preview-text);
      background:
        radial-gradient(circle at 92% 5%, var(--preview-surface) 0 8%, transparent 28%),
        var(--preview-bg);
      border: 1px solid var(--preview-text);
      border-radius: 1.25rem;
      box-shadow: 0 0.5rem 1.2rem rgba(31, 36, 48, 0.12);
    }
    .preview-only-label, .preview-title-kicker, .preview-mode, .preview-version { margin: 0; font-weight: 800; }
    .preview-only-label { color: var(--preview-text); font-size: .58rem; letter-spacing: .06em; }
    .preview-brand { display: flex; gap: .45rem; align-items: center; margin: .28rem 0 .42rem; }
    .preview-brand svg { width: 1.6rem; height: 1.6rem; flex: none; }
    .preview-brand strong, .preview-brand small { display: block; }
    .preview-brand strong { font-size: .75rem; }
    .preview-brand small { font-size: .5rem; line-height: 1.25; }
    .preview-title-kicker { font-size: .56rem; color: var(--preview-text); }
    .share-card-preview h3 { margin: .08rem 0 .2rem; font-size: 1rem; line-height: 1.15; }
    .preview-description { min-height: 2.7em; margin: 0; font-size: .58rem; line-height: 1.45; }
    .preview-cat {
      width: 62%;
      aspect-ratio: 1;
      margin-inline: auto;
      background-image: var(--representative-cat);
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .preview-cat.unavailable {
      display: grid;
      place-items: center;
      width: 62%;
      padding: .6rem;
      border: 1px dashed var(--preview-text);
      border-radius: .8rem;
      background: var(--preview-surface);
      text-align: center;
    }
    .preview-cat.unavailable span { font-size: .5rem; line-height: 1.45; }
    .preview-cat-notice { margin: 0; font-size: .48rem; line-height: 1.35; text-align: center; }
    .preview-factors { display: grid; gap: .2rem; margin-top: .34rem; }
    .preview-factor-row {
      display: grid;
      grid-template-columns: 4.9rem 1fr 1.6rem;
      gap: 0.35rem;
      align-items: center;
      padding: .08rem .12rem;
      color: var(--factor-text-outline);
      background: #EBEBEB;
      border-radius: .25rem;
      font-size: .5rem;
    }
    .preview-factor-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .preview-factor-row strong { text-align: right; font-size: .55rem; }
    .preview-factor-track {
      height: 0.55rem;
      overflow: hidden;
      border: 1px solid var(--factor-text-outline);
      border-radius: 999px;
      background: #EBEBEB;
    }
    .preview-factor-value {
      display: block;
      height: 100%;
      background: var(--factor-bar-fill);
    }
    .preview-fragrances { display: grid; gap: .17rem; margin-top: .36rem; }
    .preview-fragrance-row { display: flex; align-items: center; gap: .35rem; font-size: .5rem; }
    .preview-fragrance-row span { white-space: nowrap; }
    .preview-fragrance-row i { flex: 1; height: .28rem; border-radius: 999px; background: var(--preview-surface); border: 1px solid var(--preview-accent); }
    .preview-disclaimer { margin: .38rem 0 .14rem; font-size: .45rem; line-height: 1.3; }
    .preview-mode { color: var(--preview-text); font-size: .5rem; }
    .preview-version { margin-top: .08rem; font-size: .45rem; text-align: right; }
    .palette-editor { padding: 11px 15px; border-bottom: 1px solid #d7e2de; }
    .palette-editor summary { cursor: pointer; font-weight: 800; }
    .editor-note { margin: 8px 0; color: #55756a; font-size: .78rem; }
    .palette-description { margin: 8px 0; color: #425e55; font-size: .78rem; line-height: 1.5; }
    .color-fields { display: grid; gap: 8px; }
    .color-field { display: flex; justify-content: space-between; gap: 12px; align-items: center; font-size: .8rem; font-weight: 800; }
    .color-inputs { display: flex; gap: 6px; align-items: center; }
    .color-inputs input[type="color"] { width: 42px; height: 32px; padding: 2px; border: 1px solid #90aca1; border-radius: 7px; background: #fff; }
    .hex-input { width: 88px; padding: 6px 7px; border: 1px solid #90aca1; border-radius: 7px; font-family: Consolas, monospace; text-transform: uppercase; }
    .hex-input[aria-invalid="true"] { border: 2px solid #b3261e; background: #fff1f0; }
    .reset-one { margin-top: 10px; font-size: .76rem; }
    .resolved-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; padding: 13px 15px 5px; }
    .resolved-item { display: grid; grid-template-columns: 18px 1fr; align-items: center; column-gap: 6px; font-size: .69rem; }
    .resolved-item code { grid-column: 2; color: #425e55; font-size: .68rem; }
    .resolved-swatch { grid-row: 1 / span 2; width: 18px; height: 30px; border: 1px solid #1f2430; border-radius: 5px; background: var(--swatch); }
    .contrast-status { margin: 9px 15px; padding: 9px; border-radius: 8px; color: #255c49; background: #e8f4ef; font-size: .7rem; line-height: 1.5; }
    .contrast-status.invalid { color: #8a1c16; background: #fff0ef; font-weight: 800; }
    .content-review { min-height: 3em; margin: 9px 15px; color: #694f00; font-size: .74rem; line-height: 1.5; }
    .palette-id { display: block; padding: 0 15px 15px; overflow-wrap: anywhere; color: #698078; font-size: .67rem; }
    @media (max-width: 560px) {
      .toolbar { position: static; }
      #visible-count { margin-left: 0; width: 100%; }
    }`;
}

function previewCalculatorScript() {
  return `
    (() => {
      "use strict";
      function parseHex(color) {
        return [
          Number.parseInt(color.slice(1, 3), 16),
          Number.parseInt(color.slice(3, 5), 16),
          Number.parseInt(color.slice(5, 7), 16),
        ];
      }

      function toHex(channels) {
        return "#" + channels
          .map((channel) => channel.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase();
      }

      function mixColor(source, mixWith, mixPercent) {
        if (mixWith === "none") return source;
        const target = mixWith === "white" ? [255, 255, 255] : [0, 0, 0];
        const ratio = mixPercent / 100;
        return toHex(parseHex(source).map((channel, index) =>
          Math.round(channel * (1 - ratio) + target[index] * ratio),
        ));
      }

      function luminance(color) {
        const channels = parseHex(color).map((channel) => {
          const normalized = channel / 255;
          return normalized <= 0.04045
            ? normalized / 12.92
            : ((normalized + 0.055) / 1.055) ** 2.4;
        });
        return channels[0] * 0.2126 +
          channels[1] * 0.7152 +
          channels[2] * 0.0722;
      }

      function contrastRatio(foreground, background) {
        const first = luminance(foreground);
        const second = luminance(background);
        return (Math.max(first, second) + 0.05) /
          (Math.min(first, second) + 0.05);
      }

      function resolve(entry, colors) {
        const roleColors = {};
        for (const role of ["background", "surface", "accent", "chart"]) {
          const recipe = entry.mapping[role];
          roleColors[role] = mixColor(
            colors[recipe.source],
            recipe.mixWith,
            recipe.mixPercent,
          );
        }
        let bestText = entry.mapping.textCandidates[0];
        let bestScore = -1;
        for (const candidate of entry.mapping.textCandidates) {
          const score = Math.min(
            contrastRatio(candidate, roleColors.background),
            contrastRatio(candidate, roleColors.surface),
          );
          if (score > bestScore) {
            bestText = candidate;
            bestScore = score;
          }
        }
        return { ...roleColors, text: bestText };
      }

      function ratios(resolved) {
        return {
          textBackground: contrastRatio(resolved.text, resolved.background),
          textSurface: contrastRatio(resolved.text, resolved.surface),
          accentSurface: contrastRatio(resolved.accent, resolved.surface),
          chartBackground: contrastRatio(resolved.chart, resolved.background),
        };
      }

      globalThis.PalettePreviewCalculator = Object.freeze({
        resolve,
        ratios,
      });
    })();`;
}

function previewScript() {
  return `
    (() => {
      "use strict";
      const HEX = /^#[0-9A-F]{6}$/;
      const { resolve, ratios } = globalThis.PalettePreviewCalculator;
      const entries = JSON.parse(
        document.getElementById("palette-data").textContent,
      );
      const byId = new Map(entries.map((entry) => [entry.paletteId, entry]));
      const current = new Map(
        entries.map((entry) => [entry.paletteId, { ...entry.baseColors }]),
      );
      const cards = [...document.querySelectorAll(".palette-preview-card")];
      const search = document.getElementById("palette-search");
      const standardOnly = document.getElementById("standard-only");
      const reviewOnly = document.getElementById("review-only");
      const changesOutput = document.getElementById("changes-output");
      const visibleCount = document.getElementById("visible-count");

      function isChanged(entry, colors) {
        return ["primary", "secondary", "accent"]
          .some((role) => colors[role] !== entry.baseColors[role]);
      }

      function updateChanges() {
        const rows = [["palette_id", "primary_color", "secondary_color", "accent_color"]];
        for (const entry of entries) {
          const colors = current.get(entry.paletteId);
          if (isChanged(entry, colors)) {
            rows.push([
              entry.paletteId,
              colors.primary,
              colors.secondary,
              colors.accent,
            ]);
          }
        }
        changesOutput.value = rows.length === 1
          ? "変更はありません。"
          : rows.map((row) => row.join(",")).join("\\n");
      }

      function renderCard(card, entry) {
        const colors = current.get(entry.paletteId);
        const resolved = resolve(entry, colors);
        card.style.setProperty("--preview-bg", resolved.background);
        card.style.setProperty("--preview-surface", resolved.surface);
        card.style.setProperty("--preview-accent", resolved.accent);
        card.style.setProperty("--preview-text", resolved.text);
        for (const role of ["background", "surface", "accent", "chart", "text"]) {
          card.querySelector('[data-role="' + role + '-hex"]').textContent =
            resolved[role];
          card.querySelector('[data-role="' + role + '-swatch"]')
            .style.setProperty("--swatch", resolved[role]);
        }
        const values = ratios(resolved);
        const valid = values.textBackground >= 4.5 &&
          values.textSurface >= 4.5 &&
          values.accentSurface >= 3 &&
          values.chartBackground >= 3;
        const status = card.querySelector('[data-role="contrast-status"]');
        status.classList.toggle("invalid", !valid);
        status.textContent =
          (valid ? "WCAG適合" : "WCAG要修正") +
          "：文字-背景 " + values.textBackground.toFixed(3) +
          "／文字-表面 " + values.textSurface.toFixed(3) +
          "／差し色-表面 " + values.accentSurface.toFixed(3) +
          "／グラフ-背景 " + values.chartBackground.toFixed(3);
        updateChanges();
      }

      function setCardColors(card, entry, colors) {
        current.set(entry.paletteId, { ...colors });
        for (const role of ["primary", "secondary", "accent"]) {
          card.querySelector('[data-color-role="' + role + '"]').value =
            colors[role];
          const hexInput = card.querySelector('[data-hex-role="' + role + '"]');
          hexInput.value = colors[role];
          hexInput.setAttribute("aria-invalid", "false");
        }
        renderCard(card, entry);
      }

      for (const card of cards) {
        const entry = byId.get(card.dataset.paletteId);
        for (const role of ["primary", "secondary", "accent"]) {
          const picker = card.querySelector('[data-color-role="' + role + '"]');
          const input = card.querySelector('[data-hex-role="' + role + '"]');
          picker.addEventListener("input", () => {
            const colors = { ...current.get(entry.paletteId) };
            colors[role] = picker.value.toUpperCase();
            input.value = colors[role];
            input.setAttribute("aria-invalid", "false");
            current.set(entry.paletteId, colors);
            renderCard(card, entry);
          });
          input.addEventListener("change", () => {
            const value = input.value.trim().toUpperCase();
            if (!HEX.test(value)) {
              input.setAttribute("aria-invalid", "true");
              return;
            }
            const colors = { ...current.get(entry.paletteId), [role]: value };
            picker.value = value;
            input.value = value;
            input.setAttribute("aria-invalid", "false");
            current.set(entry.paletteId, colors);
            renderCard(card, entry);
          });
        }
        card.querySelector('[data-action="reset-one"]')
          .addEventListener("click", () => {
            setCardColors(card, entry, entry.baseColors);
          });
      }

      function applyFilters() {
        const query = search.value.trim().toLowerCase();
        let visible = 0;
        for (const card of cards) {
          const entry = byId.get(card.dataset.paletteId);
          const matchesText = query === "" || [
            entry.titleLabel,
            entry.paletteLabel,
            entry.paletteId,
          ].some((value) => value.toLowerCase().includes(query));
          const matchesStandard =
            !standardOnly.checked || entry.selectionRole === "standard";
          const matchesReview =
            !reviewOnly.checked || entry.contentReviewNote !== "";
          card.hidden = !(matchesText && matchesStandard && matchesReview);
          if (!card.hidden) visible += 1;
        }
        visibleCount.textContent = "表示 " + visible + " / " + entries.length;
      }

      search.addEventListener("input", applyFilters);
      standardOnly.addEventListener("change", applyFilters);
      reviewOnly.addEventListener("change", applyFilters);
      document.getElementById("reset-all").addEventListener("click", () => {
        for (const card of cards) {
          const entry = byId.get(card.dataset.paletteId);
          setCardColors(card, entry, entry.baseColors);
        }
      });
      applyFilters();
      updateChanges();
    })();`;
}

export function renderPalettePreview(model) {
  if (!model || model.paletteCount !== 153 ||
    !Array.isArray(model.palettes) || model.palettes.length !== 153) {
    invalidPreview();
  }
  const preview = model.shareCardPreview;
  if (!preview || typeof preview !== "object" ||
    typeof preview.representativeCatAvailable !== "boolean" ||
    (preview.representativeCatAvailable
      ? typeof preview.representativeCatDataUrl !== "string" ||
        !preview.representativeCatDataUrl.startsWith("data:image/png;base64,") ||
        preview.representativeCatError !== null
      : preview.representativeCatDataUrl !== null ||
        !(preview.representativeCatError instanceof TypeError) ||
        preview.representativeCatError.message !==
          "REPRESENTATIVE_CAT_UNAVAILABLE" ||
        !(preview.representativeCatError.cause instanceof Error)) ||
    typeof preview.brandName !== "string" || preview.brandName === "" ||
    typeof preview.cardSubtitle !== "string" || preview.cardSubtitle === "" ||
    typeof preview.appVersion !== "string" || preview.appVersion === "") {
    invalidPreview();
  }
  try {
    validateShareCardPreviewDefinition(preview.definition);
  } catch (error) {
    invalidPreview(error);
  }
  const reviewCount = model.palettes
    .filter(({ contentReviewNote }) => contentReviewNote !== "")
    .length;
  const validCount = model.palettes
    .filter(({ contrast }) => contrast.valid)
    .length;

  const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ココロパレア P-0 実使用プレビュー</title>
  <style>${previewStyles(preview)}
  </style>
</head>
<body>
  <svg class="svg-definitions" aria-hidden="true">
    <symbol id="kokoro-parea-preview-mark" viewBox="0 0 120 120">
      <rect x="2" y="2" width="116" height="116" rx="28" fill="#26705C"></rect>
      <path d="M60 17 C48 17 43 29 47 39 C50 47 60 54 60 54 C60 54 70 47 73 39 C77 29 72 17 60 17Z" fill="#F0B06C"></path>
      <path d="M60 17 C48 17 43 29 47 39 C50 47 60 54 60 54 C60 54 70 47 73 39 C77 29 72 17 60 17Z" fill="#DF7F68" transform="rotate(72 60 60)"></path>
      <path d="M60 17 C48 17 43 29 47 39 C50 47 60 54 60 54 C60 54 70 47 73 39 C77 29 72 17 60 17Z" fill="#A98DB5" transform="rotate(144 60 60)"></path>
      <path d="M60 17 C48 17 43 29 47 39 C50 47 60 54 60 54 C60 54 70 47 73 39 C77 29 72 17 60 17Z" fill="#6B98AB" transform="rotate(216 60 60)"></path>
      <path d="M60 17 C48 17 43 29 47 39 C50 47 60 54 60 54 C60 54 70 47 73 39 C77 29 72 17 60 17Z" fill="#82AD90" transform="rotate(288 60 60)"></path>
      <circle cx="60" cy="60" r="10.5" fill="#FFF9ED"></circle>
    </symbol>
  </svg>
  <header class="page-header">
    <p class="eyebrow">ココロパレア／Q-013 P-0</p>
    <h1>パレット実使用プレビュー</h1>
    <p>${model.titleCount}称号・${model.paletteCount}配色を、背景・表面・差し色・グラフ・文字へ展開した、配色・情報量確認用の簡略イメージです。完成共有カードではありません。現在のP-0状態は「${escapeHtml(model.approvalStatus)}」、WCAG適合は${validCount}件、内容要確認は${reviewCount}件です。</p>
  </header>
  <p class="notice">この画面で色を変更しても正典CSVは変更されません。試した変更は「変更一覧」へ表示されます。</p>
  <section class="toolbar" aria-label="プレビュー絞り込み">
    <div class="toolbar-row">
      <label class="search-field">
        <span>称号・色名・IDで検索</span>
        <input id="palette-search" type="search" placeholder="例：探究者、金黄色、palette-balanced">
      </label>
      <label class="check-field"><input id="standard-only" type="checkbox"> 標準のみ</label>
      <label class="check-field"><input id="review-only" type="checkbox"> 要確認のみ</label>
    </div>
    <div class="toolbar-row">
      <button id="reset-all" type="button">すべて初期値に戻す</button>
      <span id="visible-count" aria-live="polite">表示 ${model.paletteCount} / ${model.paletteCount}</span>
    </div>
  </section>
  <details class="changes-panel">
    <summary>変更一覧</summary>
    <textarea id="changes-output" readonly aria-label="試した配色の変更一覧">変更はありません。</textarea>
  </details>
  <main class="palette-grid">
    ${model.palettes.map((entry) => paletteCard(entry, preview)).join("\n")}
  </main>
  <script type="application/json" id="palette-data">${scriptJson(model.palettes)}</script>
  <script>${previewCalculatorScript()}
  </script>
  <script>${previewScript()}
  </script>
</body>
</html>
`;
  return html.replace(/[ \t]+$/gm, "");
}

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!["--source", "--output"].includes(key) ||
      typeof value !== "string" || value.startsWith("--") ||
      Object.hasOwn(values, key)) {
      invalidPreview();
    }
    values[key] = value;
  }
  if (argv.length !== 4 || !values["--source"] || !values["--output"]) {
    invalidPreview();
  }
  return values;
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  const model = await loadPalettePreviewModel({
    sourceDir: path.resolve(args["--source"]),
  });
  await writeFile(
    path.resolve(args["--output"]),
    renderPalettePreview(model),
    "utf8",
  );
}

if (process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
