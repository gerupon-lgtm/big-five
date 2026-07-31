export function selectShareableResultTexts(renderedTexts) {
  if (!Array.isArray(renderedTexts)) {
    throw new TypeError("INVALID_RESULT_TEXTS");
  }
  return Object.freeze(
    renderedTexts
      .filter(({ section }) => section !== "titleReflection")
      .map((record) => Object.freeze({
        ...record,
        evidenceRefs: Object.freeze([...record.evidenceRefs]),
      })),
  );
}

function invalidShareResultText() {
  throw new TypeError("INVALID_SHARE_RESULT_TEXT");
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

export function createShareResultText({
  brandName,
  modeLabel,
  titleLabel,
  factors,
  fragrances,
  disclaimer,
} = {}) {
  if (![brandName, modeLabel, titleLabel, disclaimer].every(isNonEmptyString) ||
    !Array.isArray(factors) ||
    factors.length !== 5 ||
    !factors.every(({ label, displayScore }) =>
      isNonEmptyString(label) &&
      Number.isInteger(displayScore) &&
      displayScore >= 0 &&
      displayScore <= 100) ||
    !Array.isArray(fragrances) ||
    fragrances.length !== 3 ||
    !fragrances.every(({ sceneLabel, accordLabel }) =>
      isNonEmptyString(sceneLabel) && isNonEmptyString(accordLabel))) {
    invalidShareResultText();
  }

  return [
    brandName,
    modeLabel,
    titleLabel,
    "",
    ...factors.map(({ label, displayScore }) => `${label}：${displayScore}`),
    "",
    "ココロアロマ",
    ...fragrances.map(({ sceneLabel, accordLabel }) =>
      `${sceneLabel}：${accordLabel}`),
    "",
    disclaimer,
  ].join("\n");
}
