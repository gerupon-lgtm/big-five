import assert from "node:assert/strict";
import test from "node:test";

import { createShareCardModel } from "../js/domain/share-card-model.js";
import { createTestResultSnapshot } from "./helpers/result-snapshot-fixture.js";

const FACTOR_LABELS = Object.freeze({
  intellectImagination: "知性・想像力",
  conscientiousness: "勤勉性",
  extraversion: "外向性",
  agreeableness: "協調性",
  emotionalStability: "情緒安定性",
});

const PALETTE = Object.freeze({
  paletteId: "palette-default",
  version: "presentation-v1",
  label: "朝凪",
  baseColors: Object.freeze({
    primary: "#88AABB",
    secondary: "#DDEECC",
    accent: "#EEAABB",
  }),
  description: "静かな明るさを持つ配色。",
});

const PALETTE_USAGE = Object.freeze({
  background: "#F4F7F8",
  surface: "#FBFCF7",
  accent: "#EEAABB",
  text: "#252A2D",
  chart: "#7799AA",
});

const FRAGRANCE_SUMMARY = Object.freeze([
  Object.freeze({
    sceneId: "pause",
    iconId: "aroma-pause",
    label: "ひと息つきたい",
    materialNames: Object.freeze(["ローマンカモミール"]),
    accordLabel: "まろやかな甘みの草花の香調",
  }),
  Object.freeze({
    sceneId: "reset",
    iconId: "aroma-reset",
    label: "気持ちを切り替えたい",
    materialNames: Object.freeze(["グレープフルーツ", "ジンジャー"]),
    accordLabel: "ほろ苦く明るい柑橘の香調",
  }),
  Object.freeze({
    sceneId: "quiet-focus",
    iconId: "aroma-quiet-focus",
    label: "静かに取り組みたい",
    materialNames: Object.freeze(["ヒノキ", "フランキンセンス"]),
    accordLabel: "静かな樹脂の輪郭を含む木質の香調",
  }),
]);

const BRAND = Object.freeze({
  version: "brand-v1",
  name: "ココロパレア",
  subtitle: "Big Five 自己理解支援ツール",
  cardSubtitle: "～Big Five 自己理解支援ツール～",
  publicOrigin: "https://kokoroparea.gerupon.uk",
  iconPath: "./assets/brand/kokoro-parea-mark.svg",
});

const CHARACTER_ENTRY = Object.freeze({
  characterId: "character-balanced",
  assetVersion: "character-balanced-v1",
  imagePath: "./assets/characters/character-balanced.webp",
  width: 1024,
  height: 1024,
  alt: "五つの風を見渡す猫",
  integrity: "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
});

function createInput({
  questionCount = 50,
  characterEntry = CHARACTER_ENTRY,
} = {}) {
  const snapshot = createTestResultSnapshot({
    resultId: questionCount === 20
      ? "2f626a53-8c5b-4f12-bd4f-9cf2894791c1"
      : "599f2197-06cc-4a56-bf9f-7d303a57f65d",
    questionCount,
  });
  return {
    snapshot,
    titleLabel: "五つの風を見渡す観測者",
    factorLabels: FACTOR_LABELS,
    characterEntry,
    palette: PALETTE,
    paletteUsage: PALETTE_USAGE,
    fragranceSummary: FRAGRANCE_SUMMARY,
    brand: BRAND,
  };
}

function assertDeeplyFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const nested of Object.values(value)) assertDeeplyFrozen(nested);
}

test("T-007 F-011 creates the exact immutable 1080 by 1800 detail card model", () => {
  const input = createInput();
  const before = structuredClone(input);

  const model = createShareCardModel(input);

  assert.equal(model.width, 1080);
  assert.equal(model.height, 1800);
  assert.equal(model.mimeType, "image/png");
  assert.equal(model.filename, "kokoro-parea-result.png");
  assert.deepEqual(model.brand, {
    name: "ココロパレア",
    cardSubtitle: "～Big Five 自己理解支援ツール～",
    iconPath: "./assets/brand/kokoro-parea-mark.svg",
  });
  assert.equal(model.modeLabel, "50問 詳細結果");
  assert.equal(model.titleLabel, "五つの風を見渡す観測者");
  assert.equal(model.titleReason, "五つの因子を見渡した結果です。");
  assert.deepEqual(model.character, {
    path: "./assets/characters/character-balanced.webp",
    alt: "五つの風を見渡す猫",
    width: 1024,
    height: 1024,
  });
  assert.deepEqual(model.factors.map(({ factorId, label }) => [factorId, label]), [
    ["intellectImagination", "知性・想像力"],
    ["conscientiousness", "勤勉性"],
    ["extraversion", "外向性"],
    ["agreeableness", "協調性"],
    ["emotionalStability", "情緒安定性"],
  ]);
  assert.ok(model.factors.every(({ displayScore }) => Number.isInteger(displayScore)));
  assert.deepEqual(model.fragrances.map(({ sceneId }) => sceneId), [
    "pause",
    "reset",
    "quiet-focus",
  ]);
  assert.deepEqual(model.fragrances[0], {
    sceneId: "pause",
    sceneLabel: "ひと息つきたい",
    accordLabel: "まろやかな甘みの草花の香調",
  });
  assert.equal(model.disclaimer, "香りをイメージするための素材例です。");
  assert.deepEqual(Object.keys(model.versions), [
    "appVersion",
    "cardTemplateVersion",
    "presentationDefinitionVersion",
    "resultTextVersion",
  ]);
  assert.deepEqual(model.palette, {
    paletteId: "palette-default",
    label: "朝凪",
    background: "#F4F7F8",
    surface: "#FBFCF7",
    accent: "#EEAABB",
    text: "#252A2D",
    chart: "#7799AA",
  });
  assert.match(model.shareText, /ココロパレア\n50問 詳細結果\n五つの風を見渡す観測者/);
  assert.match(model.shareText, /知性・想像力：50/);
  assert.match(model.shareText, /ひと息つきたい：まろやかな甘みの草花の香調/);
  assert.match(model.shareText, /香りをイメージするための素材例です。$/);
  assert.doesNotMatch(
    JSON.stringify(model),
    /answers|titleReflection|materialIds|materialNames|publicOrigin|resultId|https?:\/\//,
  );
  assert.deepEqual(input, before);
  assertDeeplyFrozen(model);
});

test("T-007 F-011 creates preview and no-cat variants without changing the result", () => {
  const model = createShareCardModel(createInput({
    questionCount: 20,
    characterEntry: null,
  }));

  assert.equal(model.modeLabel, "20問 簡易プレビュー");
  assert.equal(model.character, null);
  assert.equal(model.factors.length, 5);
  assert.equal(model.fragrances.length, 3);
  assert.match(model.shareText, /20問 簡易プレビュー/);
});

test("T-007 F-011 rejects malformed or contaminated card inputs with one stable error", () => {
  const cases = [
    null,
    { ...createInput(), answers: {} },
    { ...createInput(), titleLabel: "" },
    { ...createInput(), factorLabels: { ...FACTOR_LABELS, extraversion: "" } },
    { ...createInput(), characterEntry: { ...CHARACTER_ENTRY, characterId: "character-other" } },
    { ...createInput(), palette: { ...PALETTE, paletteId: "palette-other" } },
    { ...createInput(), fragranceSummary: FRAGRANCE_SUMMARY.slice(0, 2) },
    { ...createInput(), brand: { ...BRAND, cardSubtitle: "Big Five 自己理解支援ツール" } },
  ];

  for (const input of cases) {
    assert.throws(
      () => createShareCardModel(input),
      { name: "TypeError", message: "SHARE_CARD_MODEL_INVALID" },
    );
  }
});
