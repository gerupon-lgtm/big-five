import { FACTOR_ORDER } from "../../app/js/config/factor-order.js";

const HEX_COLOR = /^#[0-9A-F]{6}$/;
const EXACT_FIELDS = [
  "version",
  "representativeCatSource",
  "representativeCatNotice",
  "modeLabel",
  "fragrancePlaceholders",
  "factors",
];
const FACTOR_FIELDS = ["factorId", "label", "value", "fill", "tone"];

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
    definition.version !== "share-card-preview-v1" ||
    definition.representativeCatSource !==
      "docs/assets/character-production/source-png/character-balanced.png" ||
    typeof definition.representativeCatNotice !== "string" ||
    definition.modeLabel !== "50問 詳細結果" ||
    !Array.isArray(definition.fragrancePlaceholders) ||
    definition.fragrancePlaceholders.length !== 3 ||
    !definition.fragrancePlaceholders.every((value) =>
      typeof value === "string" && value.length > 0) ||
    !Array.isArray(definition.factors) ||
    definition.factors.length !== FACTOR_ORDER.length ||
    definition.factors.some((factor, index) =>
      !factor || typeof factor !== "object" ||
      Object.keys(factor).length !== FACTOR_FIELDS.length ||
      !FACTOR_FIELDS.every((field) => Object.hasOwn(factor, field)) ||
      factor.factorId !== FACTOR_ORDER[index] ||
      typeof factor.label !== "string" ||
      !Number.isInteger(factor.value) ||
      factor.value < 0 || factor.value > 100 ||
      !HEX_COLOR.test(factor.fill) ||
      !HEX_COLOR.test(factor.tone))) {
    invalidDefinition();
  }
  return true;
}

export const shareCardPreviewDefinition = deepFreeze({
  version: "share-card-preview-v1",
  representativeCatSource:
    "docs/assets/character-production/source-png/character-balanced.png",
  representativeCatNotice:
    "色・配置確認用の代表猫です。称号ごとの正式な猫ではありません。",
  modeLabel: "50問 詳細結果",
  fragrancePlaceholders: [
    "ひと息つく場面",
    "気持ちを整える場面",
    "静かに集中する場面",
  ],
  factors: [
    {
      factorId: "intellectImagination",
      label: "知性・想像力",
      value: 60,
      fill: "#ADA1C0",
      tone: "#6F677B",
    },
    {
      factorId: "conscientiousness",
      label: "勤勉性",
      value: 58,
      fill: "#7399B1",
      tone: "#536E7F",
    },
    {
      factorId: "extraversion",
      label: "外向性",
      value: 52,
      fill: "#9BA789",
      tone: "#656D59",
    },
    {
      factorId: "agreeableness",
      label: "協調性",
      value: 56,
      fill: "#E38543",
      tone: "#9A5A2E",
    },
    {
      factorId: "emotionalStability",
      label: "情緒安定性",
      value: 54,
      fill: "#A5B6BA",
      tone: "#616B6E",
    },
  ],
});

validateShareCardPreviewDefinition(shareCardPreviewDefinition);
