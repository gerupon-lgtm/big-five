import { FACTOR_ORDER } from "../data/factor-order.js";
import { PRESENTATION_SCENE_IDS } from "./presentation-scenes.js";
import { validateResultSnapshot } from "./result-snapshot.js";
import {
  createShareResultText,
  selectShareableResultTexts,
} from "./share-result-text.js";

const INPUT_FIELDS = Object.freeze([
  "snapshot",
  "titleLabel",
  "factorLabels",
  "characterEntry",
  "palette",
  "paletteUsage",
  "fragranceSummary",
  "brand",
]);
const CHARACTER_FIELDS = Object.freeze([
  "characterId",
  "assetVersion",
  "imagePath",
  "width",
  "height",
  "alt",
  "integrity",
]);
const PALETTE_FIELDS = Object.freeze([
  "paletteId",
  "version",
  "label",
  "baseColors",
  "description",
]);
const PALETTE_USAGE_FIELDS = Object.freeze([
  "background",
  "surface",
  "accent",
  "text",
  "chart",
]);
const FRAGRANCE_FIELDS = Object.freeze([
  "sceneId",
  "iconId",
  "label",
  "materialNames",
  "accordLabel",
]);
const BRAND_FIELDS = Object.freeze([
  "version",
  "name",
  "subtitle",
  "cardSubtitle",
  "publicOrigin",
  "iconPath",
  "cardIconPath",
]);
const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/;
const CARD_SUBTITLE = "～Big Five 自己理解支援ツール～";
const DISCLAIMER =
  "これは性格の優劣や心理学上の正式なタイプを示すものではありません。";
const PREVIEW_DISCLAIMER =
  "20問の簡易プレビューであり、50問で結果が変わることがあります。";

function invalidModel() {
  throw new TypeError("SHARE_CARD_MODEL_INVALID");
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactFields(value, fields) {
  return isRecord(value) &&
    Object.keys(value).length === fields.length &&
    fields.every((field) => Object.hasOwn(value, field));
}

function isDenseArray(value) {
  return Array.isArray(value) && Object.keys(value).length === value.length;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

function validateLabels(factorLabels) {
  return hasExactFields(factorLabels, FACTOR_ORDER) &&
    FACTOR_ORDER.every((factorId) => isNonEmptyString(factorLabels[factorId]));
}

function projectCharacter(characterEntry, snapshot) {
  if (characterEntry === null) return null;
  if (!hasExactFields(characterEntry, CHARACTER_FIELDS) ||
    characterEntry.characterId !== snapshot.characterId ||
    characterEntry.assetVersion !== snapshot.characterAssetVersion ||
    !isNonEmptyString(characterEntry.imagePath) ||
    !characterEntry.imagePath.endsWith(".webp") ||
    !isNonEmptyString(characterEntry.alt) ||
    !Number.isInteger(characterEntry.width) ||
    characterEntry.width <= 0 ||
    !Number.isInteger(characterEntry.height) ||
    characterEntry.height <= 0 ||
    !isNonEmptyString(characterEntry.integrity)) {
    invalidModel();
  }
  return {
    path: characterEntry.imagePath,
    alt: characterEntry.alt,
    width: characterEntry.width,
    height: characterEntry.height,
  };
}

function projectPalette(palette, paletteUsage, snapshot) {
  if (!hasExactFields(palette, PALETTE_FIELDS) ||
    palette.paletteId !== snapshot.selectedPaletteId ||
    palette.version !== snapshot.versionTuple.presentationDefinitionVersion ||
    !isNonEmptyString(palette.label) ||
    !hasExactFields(paletteUsage, PALETTE_USAGE_FIELDS) ||
    !PALETTE_USAGE_FIELDS.every((field) =>
      typeof paletteUsage[field] === "string" &&
      HEX_COLOR_PATTERN.test(paletteUsage[field]))) {
    invalidModel();
  }
  return {
    paletteId: palette.paletteId,
    label: palette.label,
    ...Object.fromEntries(PALETTE_USAGE_FIELDS.map((field) => [
      field,
      paletteUsage[field],
    ])),
  };
}

function projectFragrances(fragranceSummary) {
  if (!isDenseArray(fragranceSummary) ||
    fragranceSummary.length !== PRESENTATION_SCENE_IDS.length ||
    !fragranceSummary.every((fragrance, index) =>
      hasExactFields(fragrance, FRAGRANCE_FIELDS) &&
      fragrance.sceneId === PRESENTATION_SCENE_IDS[index] &&
      isNonEmptyString(fragrance.iconId) &&
      isNonEmptyString(fragrance.label) &&
      isDenseArray(fragrance.materialNames) &&
      fragrance.materialNames.length >= 1 &&
      fragrance.materialNames.length <= 2 &&
      fragrance.materialNames.every(isNonEmptyString) &&
      isNonEmptyString(fragrance.accordLabel))) {
    invalidModel();
  }
  return fragranceSummary.map(({
    sceneId,
    label,
    materialNames,
    accordLabel,
  }) => ({
    sceneId,
    sceneLabel: label,
    materialNames: [...materialNames],
    accordLabel,
  }));
}

function projectBrand(brand) {
  if (!hasExactFields(brand, BRAND_FIELDS) ||
    brand.name !== "ココロパレア" ||
    brand.cardSubtitle !== CARD_SUBTITLE ||
    !isNonEmptyString(brand.iconPath) ||
    !isNonEmptyString(brand.cardIconPath)) {
    invalidModel();
  }
  return {
    name: brand.name,
    cardSubtitle: brand.cardSubtitle,
    iconPath: brand.iconPath,
    cardIconPath: brand.cardIconPath,
  };
}

function buildModel(input) {
  if (!hasExactFields(input, INPUT_FIELDS) ||
    !isNonEmptyString(input.titleLabel) ||
    !validateLabels(input.factorLabels)) {
    invalidModel();
  }

  const snapshot = validateResultSnapshot(input.snapshot);
  const shareableTexts = selectShareableResultTexts(snapshot.renderedTexts);
  const titleReasons = shareableTexts.filter(({ section }) =>
    section === "titleReason");
  if (titleReasons.length !== 1) invalidModel();

  const brand = projectBrand(input.brand);
  const character = projectCharacter(input.characterEntry, snapshot);
  const palette = projectPalette(input.palette, input.paletteUsage, snapshot);
  const fragrances = projectFragrances(input.fragranceSummary);
  const factors = FACTOR_ORDER.map((factorId, index) => {
    const factor = snapshot.factors[index];
    if (factor.factorId !== factorId) invalidModel();
    return {
      factorId,
      label: input.factorLabels[factorId],
      displayScore: factor.displayScore,
    };
  });
  const modeLabel = snapshot.mode === "preview20"
    ? "20問 簡易プレビュー"
    : "50問 詳細結果";
  const disclaimer = snapshot.mode === "preview20"
    ? `${DISCLAIMER}\n${PREVIEW_DISCLAIMER}`
    : DISCLAIMER;
  const shareText = createShareResultText({
    brandName: brand.name,
    modeLabel,
    titleLabel: input.titleLabel,
    factors,
    fragrances,
    disclaimer,
  });

  return deepFreeze({
    width: 1080,
    height: 1800,
    mimeType: "image/png",
    filename: "kokoro-parea-result.png",
    brand,
    modeLabel,
    titleLabel: input.titleLabel,
    titleReason: titleReasons[0].text,
    character,
    factors,
    fragrances,
    disclaimer,
    versions: {
      appVersion: snapshot.versionTuple.appVersion,
      cardTemplateVersion: snapshot.versionTuple.cardTemplateVersion,
      presentationDefinitionVersion:
        snapshot.versionTuple.presentationDefinitionVersion,
      resultTextVersion: snapshot.versionTuple.resultTextVersion,
    },
    palette,
    shareText,
  });
}

export function createShareCardModel(input) {
  try {
    return buildModel(input);
  } catch {
    invalidModel();
  }
}
