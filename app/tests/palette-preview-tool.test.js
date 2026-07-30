import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import { createContext, Script } from "node:vm";

import {
  contrastRatio,
  resolvePaletteUsage,
} from "../js/domain/palette-usage.js";
import { FACTOR_ORDER } from "../js/config/factor-order.js";
import {
  shareCardPreviewDefinition,
  validateShareCardPreviewDefinition,
} from "../../scripts/content/share-card-preview-definition.mjs";
import {
  loadPalettePreviewModel,
  renderPalettePreview,
} from "../../scripts/content/render-palette-preview.mjs";

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "../..");
const SOURCE_DIR = path.join(ROOT, "content/source");
const SCRIPT_PATH = path.join(
  ROOT,
  "scripts/content/render-palette-preview.mjs",
);
const COMMITTED_PREVIEW = path.join(ROOT, "docs/palette-preview.html");

test("share-card preview definition fixes factor colors and sample values", () => {
  assert.equal(shareCardPreviewDefinition.version, "share-card-preview-v3");
  assert.equal(
    shareCardPreviewDefinition.representativeCatSource,
    "docs/assets/character-production/source-png/character-balanced.png",
  );
  assert.equal(
    shareCardPreviewDefinition.representativeCatNotice,
    "色・配置確認用の代表猫です。称号ごとの正式な猫ではありません。",
  );
  assert.equal(
    shareCardPreviewDefinition.representativeCatUnavailableMessage,
    "代表猫画像を表示できません。配色と情報量は引き続き確認できます。",
  );
  assert.equal(shareCardPreviewDefinition.aromaHeading, "ココロアロマ");
  assert.equal(
    shareCardPreviewDefinition.aromaSubtitle,
    "～あなたらしさから着想した香り～",
  );
  assert.equal(
    shareCardPreviewDefinition.aromaNote,
    "香りをイメージするための素材例です",
  );
  assert.deepEqual(
    shareCardPreviewDefinition.factors.map(({ factorId }) => factorId),
    [...FACTOR_ORDER],
  );
  assert.deepEqual(
    shareCardPreviewDefinition.factors.map(
      ({
        factorId,
        label,
        sampleDisplayScore,
        barFillColor,
        textOutlineColor,
      }) => [
        factorId,
        label,
        sampleDisplayScore,
        barFillColor,
        textOutlineColor,
      ],
    ),
    [
      ["intellectImagination", "知性・想像力", 60, "#ADA1C0", "#6F677B"],
      ["conscientiousness", "勤勉性", 58, "#7399B1", "#536E7F"],
      ["extraversion", "外向性", 52, "#9BA789", "#656D59"],
      ["agreeableness", "協調性", 56, "#E38543", "#9A5A2E"],
      ["emotionalStability", "情緒安定性", 54, "#A5B6BA", "#616B6E"],
    ],
  );
  for (const factor of shareCardPreviewDefinition.factors) {
    assert.ok(contrastRatio(factor.textOutlineColor, "#EBEBEB") >= 4.5);
  }
  assert.equal(
    validateShareCardPreviewDefinition(shareCardPreviewDefinition),
    true,
  );
});

test("share-card preview definition rejects malformed factors", () => {
  const invalid = structuredClone(shareCardPreviewDefinition);
  invalid.factors[1].factorId = invalid.factors[0].factorId;
  assert.throws(
    () => validateShareCardPreviewDefinition(invalid),
    { name: "TypeError", message: "SHARE_CARD_PREVIEW_INVALID" },
  );
});

test("P-0 preview model maps 51 titles to exactly three palettes", async () => {
  const model = await loadPalettePreviewModel({ sourceDir: SOURCE_DIR });

  assert.equal(model.presentationDefinitionVersion, "presentation-v2");
  assert.equal(model.approvalStatus, "draft");
  assert.equal(model.shareCardPreview.intensityId, "b");
  assert.equal(model.shareCardPreview.backgroundMixPercent, 84);
  assert.equal(model.shareCardPreview.surfaceMixPercent, 90);
  assert.equal(model.titleCount, 51);
  assert.equal(model.paletteCount, 153);
  assert.equal(model.palettes.length, 153);

  for (let titleOrder = 1; titleOrder <= 51; titleOrder += 1) {
    const titlePalettes = model.palettes.filter(
      (palette) => palette.titleOrder === titleOrder,
    );
    assert.deepEqual(
      titlePalettes.map(({ selectionRole }) => selectionRole),
      ["standard", "alternative-1", "alternative-2"],
    );
    assert.equal(
      new Set(titlePalettes.map(({ titleId }) => titleId)).size,
      1,
    );
  }

  assert.deepEqual(model.palettes[0], {
    titleId: "title-balanced",
    titleLabel: "五つの風を見渡す観測者",
    titleOrder: 1,
    selectionRole: "standard",
    paletteId: "palette-balanced-1",
    paletteLabel: "澄み切った空色",
    titleDescription: "五つの傾向が近い範囲に集まるバランス派",
    description: "複数の方向を等しく見渡す中立的な印象。",
    contentReviewNote: "",
    fragrances: [
      {
        sceneId: "pause",
        iconId: "aroma-pause",
        label: "ひと息つきたい",
        materialNames: ["ローマンカモミール"],
        accordLabel: "まろやかな甘みの草花の香調",
      },
      {
        sceneId: "reset",
        iconId: "aroma-reset",
        label: "気持ちを切り替えたい",
        materialNames: ["グレープフルーツ"],
        accordLabel: "ほろ苦く明るい柑橘の香調",
      },
      {
        sceneId: "quiet-focus",
        iconId: "aroma-quiet-focus",
        label: "静かに取り組みたい",
        materialNames: ["ベルガモット"],
        accordLabel: "ほろ苦く端正な柑橘の香調",
      },
    ],
    baseColors: {
      primary: "#7C8791",
      secondary: "#98B0AA",
      accent: "#667B7A",
    },
    mapping: {
      background: {
        source: "primary",
        mixWith: "white",
        mixPercent: 84,
      },
      surface: {
        source: "secondary",
        mixWith: "white",
        mixPercent: 90,
      },
      accent: {
        source: "accent",
        mixWith: "black",
        mixPercent: 45,
      },
      chart: {
        source: "primary",
        mixWith: "black",
        mixPercent: 45,
      },
      textCandidates: ["#1F2430", "#FFFFFF"],
    },
    resolved: {
      background: "#EAECED",
      surface: "#F5F7F7",
      accent: "#384443",
      text: "#1F2430",
      chart: "#444A50",
    },
    contrast: {
      textBackground: 13.094,
      textSurface: 14.431,
      accentSurface: 9.407,
      chartBackground: 7.569,
      valid: true,
    },
  });

  for (let titleOrder = 1; titleOrder <= 51; titleOrder += 1) {
    const titlePalettes = model.palettes.filter(
      (palette) => palette.titleOrder === titleOrder,
    );
    assert.equal(
      new Set(titlePalettes.map(({ titleDescription }) => titleDescription))
        .size,
      1,
    );
    assert.notEqual(titlePalettes[0].titleDescription, "");
  }
});

test("P-0 preview is one offline HTML file with all interactive cards", async () => {
  const model = await loadPalettePreviewModel({ sourceDir: SOURCE_DIR });
  const html = renderPalettePreview(model);

  assert.match(html, /^<!doctype html>\n<html lang="ja">/);
  assert.equal(
    (html.match(/class="palette-preview-card(?: has-review-note)?"/g) ?? [])
      .length,
    153,
  );
  assert.equal((html.match(/<input type="color"/g) ?? []).length, 459);
  assert.equal(
    (html.match(/class="share-card-preview"/g) ?? []).length,
    153,
  );
  assert.equal(
    (html.match(/class="preview-factor-row"/g) ?? []).length,
    153 * 5,
  );
  assert.equal(
    (html.match(/class="preview-fragrance-row"/g) ?? []).length,
    153 * 3,
  );
  assert.equal((html.match(/class="preview-aroma"/g) ?? []).length, 153);
  assert.equal(
    (html.match(/data:image\/png;base64,/g) ?? []).length,
    1,
  );
  assert.equal(
    (html.match(/href="#kokoro-parea-preview-mark"/g) ?? []).length,
    153,
  );
  assert.match(html, /aspect-ratio:\s*3\s*\/\s*5/);
  assert.match(html, /ココロアロマ/);
  assert.match(html, /～あなたらしさから着想した香り～/);
  assert.match(html, /香りをイメージするための素材例です/);
  assert.match(html, /ローマンカモミール/);
  assert.match(html, /data-icon-id="aroma-pause"/);
  assert.match(html, /data-icon-id="aroma-reset"/);
  assert.match(html, /data-icon-id="aroma-quiet-focus"/);
  assert.match(html, /配色確認用の簡略プレビュー/);
  assert.match(
    html,
    /色・配置確認用の代表猫です。称号ごとの正式な猫ではありません。/,
  );
  assert.match(html, /data-factor-id="intellectImagination"/);
  assert.match(
    html,
    /data-sample-display-score="60" data-bar-fill-color="#ADA1C0" data-text-outline-color="#6F677B"/,
  );
  assert.match(html, /パレット由来のグラフ用途色/);
  assert.match(html, /標準のみ/);
  assert.match(html, /要確認のみ/);
  assert.match(html, /変更一覧/);
  assert.match(html, /すべて初期値に戻す/);
  assert.match(html, /この画面で色を変更しても正典CSVは変更されません。/);
  assert.match(
    html,
    /aria-label="五つの風を見渡す観測者 澄み切った空色の配色確認用簡略プレビュー"/,
  );
  assert.match(html, /data-role="background-hex">#EAECED</);
  assert.match(html, /data-preview-intensity="b"/);
  assert.match(html, /B（背景84%／表面90%）/);
  assert.match(
    html,
    /右上の淡色は副色を白90%で混ぜた確認表示です。完成カードでも淡い装飾として引き継ぎ、暗色の面にはしません。/,
  );
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /<script[^>]+\bsrc=/i);
  assert.doesNotMatch(html, /<link[^>]+\bhref=/i);
  assert.doesNotMatch(html, /\bfetch\s*\(/);
  assert.doesNotMatch(html, /[ \t]+$/m);
  assert.match(
    html,
    /\.preview-only-label\s*\{\s*color:\s*var\(--preview-text\)/,
  );
  assert.match(
    html,
    /\.preview-title-kicker\s*\{[^}]*color:\s*var\(--preview-text\)/,
  );
  assert.match(
    html,
    /\.preview-mode\s*\{\s*color:\s*var\(--preview-text\)/,
  );
  assert.doesNotMatch(
    html,
    /\.preview-(?:only-label|title-kicker|mode)[^{]*\{[^}]*color:\s*var\(--preview-accent\)/,
  );

  const cards = [
    ...html.matchAll(
      /<article class="palette-preview-card(?: has-review-note)?"[\s\S]*?<\/article>/g,
    ),
  ].map(([card]) => card);
  assert.equal(cards.length, 153);
  const expectedFactorTuples = shareCardPreviewDefinition.factors.map(
    ({
      factorId,
      sampleDisplayScore,
      barFillColor,
      textOutlineColor,
    }) => [
      factorId,
      sampleDisplayScore,
      barFillColor,
      textOutlineColor,
    ],
  );
  for (const card of cards) {
    for (const requiredClass of [
      "preview-brand",
      "preview-title-kicker",
      "preview-description",
      "preview-cat",
      "preview-cat-notice",
      "preview-factors",
      "preview-aroma",
      "preview-fragrances",
      "preview-disclaimer",
      "preview-mode",
      "preview-version",
    ]) {
      assert.match(card, new RegExp(`class="${requiredClass}(?: available)?"`));
    }
    const factorTuples = [
      ...card.matchAll(
        /data-factor-id="([^"]+)"\s+data-sample-display-score="(\d+)" data-bar-fill-color="(#[0-9A-F]{6})" data-text-outline-color="(#[0-9A-F]{6})"/g,
      ),
    ].map((match) => [
      match[1],
      Number(match[2]),
      match[3],
      match[4],
    ]);
    assert.deepEqual(factorTuples, expectedFactorTuples);
    assert.equal(
      (card.match(/class="preview-fragrance-row"/g) ?? []).length,
      3,
    );
    assert.equal(
      (card.match(/data-icon-id="aroma-(?:pause|reset|quiet-focus)"/g) ?? [])
        .length,
      3,
    );
  }

  const data = html.match(
    /<script type="application\/json" id="palette-data">([\s\S]*?)<\/script>/,
  );
  const browserScripts = [
    ...html.matchAll(/<script>([\s\S]*?)<\/script>/g),
  ].map((match) => match[1]);
  assert.ok(data);
  assert.equal(browserScripts.length, 2);
  assert.equal(JSON.parse(data[1]).length, 153);
  for (const browserScript of browserScripts) {
    assert.doesNotThrow(() => new Script(browserScript));
  }
});

test("P-0 preview model normalizes a missing representative cat image", async () => {
  const model = await loadPalettePreviewModel({
    sourceDir: SOURCE_DIR,
    representativeCatPath: path.join(ROOT, "missing-cat.png"),
  });
  assert.equal(model.paletteCount, 153);
  assert.equal(model.shareCardPreview.representativeCatAvailable, false);
  assert.equal(model.shareCardPreview.representativeCatDataUrl, null);
  assert.equal(
    model.shareCardPreview.representativeCatError.message,
    "REPRESENTATIVE_CAT_UNAVAILABLE",
  );
  assert.ok(
    model.shareCardPreview.representativeCatError.cause instanceof Error,
  );

  const html = renderPalettePreview(model);
  assert.equal(
    (html.match(/class="preview-cat unavailable"/g) ?? []).length,
    153,
  );
  assert.equal(
    (html.match(/代表猫画像を表示できません。配色と情報量は引き続き確認できます。/g) ?? [])
      .length,
    153,
  );
  assert.doesNotMatch(html, /data:image\/png;base64,/);
});

test("P-0 preview keeps the original fatal load error as cause", async () => {
  const missingSource = path.join(ROOT, "missing-content-source");
  await assert.rejects(
    loadPalettePreviewModel({ sourceDir: missingSource }),
    (error) => {
      assert.equal(error.name, "TypeError");
      assert.equal(error.message, "PALETTE_PREVIEW_INVALID");
      assert.ok(error.cause instanceof Error);
      return true;
    },
  );
});

test("P-0 preview CLI is deterministic and matches the committed HTML", async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "palette-preview-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const firstPath = path.join(directory, "first.html");
  const secondPath = path.join(directory, "second.html");

  for (const outputPath of [firstPath, secondPath]) {
    await execFileAsync(process.execPath, [
      SCRIPT_PATH,
      "--source",
      SOURCE_DIR,
      "--output",
      outputPath,
    ]);
  }

  const [first, second, committed] = await Promise.all([
    readFile(firstPath),
    readFile(secondPath),
    readFile(COMMITTED_PREVIEW),
  ]);
  assert.deepEqual(first, second);
  assert.deepEqual(first, committed);
});

test("browser-side edited colors remain in parity with canonical palette usage", async () => {
  const model = await loadPalettePreviewModel({ sourceDir: SOURCE_DIR });
  const html = renderPalettePreview(model);
  const executableScripts = [
    ...html.matchAll(/<script>([\s\S]*?)<\/script>/g),
  ].map((match) => match[1]);
  assert.equal(executableScripts.length, 2);

  const context = createContext({});
  new Script(executableScripts[0]).runInContext(context);
  const calculator = context.PalettePreviewCalculator;
  assert.deepEqual(
    Object.keys(calculator).sort(),
    ["ratios", "resolve"],
  );

  const entry = model.palettes[0];
  const cases = [
    {
      primary: "#1A2B3C",
      secondary: "#EEDDCC",
      accent: "#336699",
    },
    {
      primary: "#FFFFFF",
      secondary: "#000000",
      accent: "#FF0000",
    },
    {
      primary: "#E07868",
      secondary: "#E69A4B",
      accent: "#38A8A0",
    },
  ];

  for (const colors of cases) {
    const canonical = resolvePaletteUsage({
      paletteId: entry.paletteId,
      version: model.presentationDefinitionVersion,
      label: entry.paletteLabel,
      baseColors: colors,
      description: entry.description,
    }, {
      paletteId: entry.paletteId,
      version: model.presentationDefinitionVersion,
      roles: {
        background: entry.mapping.background,
        surface: entry.mapping.surface,
        accent: entry.mapping.accent,
        chart: entry.mapping.chart,
      },
      textCandidates: entry.mapping.textCandidates,
    });
    const browserResolved = JSON.parse(JSON.stringify(
      calculator.resolve(entry, colors),
    ));
    assert.deepEqual(browserResolved, canonical);

    const expectedRatios = {
      textBackground: contrastRatio(canonical.text, canonical.background),
      textSurface: contrastRatio(canonical.text, canonical.surface),
      accentSurface: contrastRatio(canonical.accent, canonical.surface),
      chartBackground: contrastRatio(canonical.chart, canonical.background),
    };
    const browserRatios = JSON.parse(JSON.stringify(
      calculator.ratios(browserResolved),
    ));
    assert.deepEqual(browserRatios, expectedRatios);
  }

  assert.deepEqual(
    shareCardPreviewDefinition.factors.map((factor) => [
      factor.factorId,
      factor.sampleDisplayScore,
      factor.barFillColor,
      factor.textOutlineColor,
    ]),
    [
      ["intellectImagination", 60, "#ADA1C0", "#6F677B"],
      ["conscientiousness", 58, "#7399B1", "#536E7F"],
      ["extraversion", 52, "#9BA789", "#656D59"],
      ["agreeableness", 56, "#E38543", "#9A5A2E"],
      ["emotionalStability", 54, "#A5B6BA", "#616B6E"],
    ],
  );
  assert.doesNotMatch(executableScripts[1], /--factor-(?:fill|tone|bar|text)/);
  assert.doesNotMatch(executableScripts[1], /data-factor-id/);
});

test("P-0 validity matches the colors used for visible card text", async () => {
  const model = await loadPalettePreviewModel({ sourceDir: SOURCE_DIR });
  const entry = model.palettes.find(
    ({ paletteId }) =>
      paletteId ===
      "palette-pair-conscientiousness-low-and-extraversion-low-2",
  );
  assert.ok(entry);
  assert.equal(entry.contrast.valid, true);
  assert.ok(
    contrastRatio(entry.resolved.text, entry.resolved.background) >= 4.5,
  );

  const html = renderPalettePreview(model);
  const card = html.match(
    /<article class="palette-preview-card" data-palette-id="palette-pair-conscientiousness-low-and-extraversion-low-2"[\s\S]*?<\/article>/,
  );
  assert.ok(card);
  assert.doesNotMatch(
    card[0],
    /class="preview-(?:only-label|title-kicker|mode)"[^>]*style="[^"]*preview-accent/,
  );
});

test("package command regenerates the standalone P-0 preview", async () => {
  const packageJson = JSON.parse(
    await readFile(path.join(ROOT, "package.json"), "utf8"),
  );
  assert.equal(
    packageJson.scripts["content:preview:palettes"],
    "node scripts/content/render-palette-preview.mjs --source content/source --output docs/palette-preview.html",
  );
});
