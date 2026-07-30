import { FACTOR_ORDER } from "../../app/js/config/factor-order.js";

const HEX_COLOR = /^#[0-9A-F]{6}$/;
const EXACT_FIELDS = [
  "version",
  "representativeCatSource",
  "representativeCatNotice",
  "representativeCatUnavailableMessage",
  "modeLabel",
  "aromaHeading",
  "aromaSubtitle",
  "aromaNote",
  "factors",
];
const FACTOR_FIELDS = [
  "factorId",
  "label",
  "sampleDisplayScore",
  "barFillColor",
  "textOutlineColor",
];

function invalidDefinition() {
  throw new TypeError("SHARE_CARD_PREVIEW_INVALID");
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

export function validateShareCardPreviewDefinition(definition) {
  if (!definition || typeof definition !== "object" ||
    Object.keys(definition).length !== EXACT_FIELDS.length ||
    !EXACT_FIELDS.every((field) => Object.hasOwn(definition, field)) ||
    definition.version !== "share-card-preview-v3" ||
    definition.representativeCatSource !==
      "docs/assets/character-production/source-png/character-balanced.png" ||
    typeof definition.representativeCatNotice !== "string" ||
    typeof definition.representativeCatUnavailableMessage !== "string" ||
    definition.representativeCatUnavailableMessage.length === 0 ||
    definition.modeLabel !== "50問 詳細結果" ||
    definition.aromaHeading !== "ココロアロマ" ||
    definition.aromaSubtitle !== "～あなたらしさから着想した香り～" ||
    definition.aromaNote !== "香りをイメージするための素材例です" ||
    !Array.isArray(definition.factors) ||
    definition.factors.length !== FACTOR_ORDER.length ||
    definition.factors.some((factor, index) =>
      !factor || typeof factor !== "object" ||
      Object.keys(factor).length !== FACTOR_FIELDS.length ||
      !FACTOR_FIELDS.every((field) => Object.hasOwn(factor, field)) ||
      factor.factorId !== FACTOR_ORDER[index] ||
      typeof factor.label !== "string" ||
      !Number.isInteger(factor.sampleDisplayScore) ||
      factor.sampleDisplayScore < 0 || factor.sampleDisplayScore > 100 ||
      !HEX_COLOR.test(factor.barFillColor) ||
      !HEX_COLOR.test(factor.textOutlineColor))) {
    invalidDefinition();
  }
  return true;
}

export const shareCardPreviewDefinition = deepFreeze({
  version: "share-card-preview-v3",
  representativeCatSource:
    "docs/assets/character-production/source-png/character-balanced.png",
  representativeCatNotice:
    "色・配置確認用の代表猫です。称号ごとの正式な猫ではありません。",
  representativeCatUnavailableMessage:
    "代表猫画像を表示できません。配色と情報量は引き続き確認できます。",
  modeLabel: "50問 詳細結果",
  aromaHeading: "ココロアロマ",
  aromaSubtitle: "～あなたらしさから着想した香り～",
  aromaNote: "香りをイメージするための素材例です",
  factors: [
    {
      factorId: "intellectImagination",
      label: "知性・想像力",
      sampleDisplayScore: 60,
      barFillColor: "#ADA1C0",
      textOutlineColor: "#6F677B",
    },
    {
      factorId: "conscientiousness",
      label: "勤勉性",
      sampleDisplayScore: 58,
      barFillColor: "#7399B1",
      textOutlineColor: "#536E7F",
    },
    {
      factorId: "extraversion",
      label: "外向性",
      sampleDisplayScore: 52,
      barFillColor: "#9BA789",
      textOutlineColor: "#656D59",
    },
    {
      factorId: "agreeableness",
      label: "協調性",
      sampleDisplayScore: 56,
      barFillColor: "#E38543",
      textOutlineColor: "#9A5A2E",
    },
    {
      factorId: "emotionalStability",
      label: "情緒安定性",
      sampleDisplayScore: 54,
      barFillColor: "#A5B6BA",
      textOutlineColor: "#616B6E",
    },
  ],
});

validateShareCardPreviewDefinition(shareCardPreviewDefinition);
