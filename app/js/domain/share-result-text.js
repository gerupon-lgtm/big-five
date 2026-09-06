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

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isValidFactor(value) {
  return isRecord(value) &&
    isNonEmptyString(value.label) &&
    Number.isInteger(value.displayScore) &&
    value.displayScore >= 0 &&
    value.displayScore <= 100;
}

function isValidFragrance(value) {
  return isRecord(value) &&
    isNonEmptyString(value.sceneLabel) &&
    isNonEmptyString(value.accordLabel) &&
    Array.isArray(value.materialNames) &&
    value.materialNames.length >= 1 &&
    value.materialNames.length <= 2 &&
    value.materialNames.every(isNonEmptyString);
}

function validateHttpsShareUrl(value) {
  if (typeof value !== "string") {
    invalidShareResultText();
  }

  const trimmedUrl = value.trim();
  if (trimmedUrl.length === 0 || /\s/u.test(trimmedUrl)) {
    invalidShareResultText();
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    invalidShareResultText();
  }

  if (parsedUrl.protocol !== "https:" || parsedUrl.username !== "" || parsedUrl.password !== "") {
    invalidShareResultText();
  }

  return trimmedUrl;
}

export function createShareResultText(input) {
  if (!isRecord(input)) {
    invalidShareResultText();
  }

  const {
    brandName,
    modeLabel,
    titleLabel,
    titleSubtitle,
    titleReason,
    factors,
    fragrances,
    disclaimer,
    shareUrl = "",
  } = input;

  if (![brandName, modeLabel, titleLabel, titleSubtitle, titleReason, disclaimer].every(isNonEmptyString) ||
    !Array.isArray(factors) ||
    factors.length !== 5 ||
    !factors.every(isValidFactor) ||
    !Array.isArray(fragrances) ||
    fragrances.length !== 3 ||
    !fragrances.every(isValidFragrance)) {
    invalidShareResultText();
  }

  const blocks = [
    [brandName, modeLabel, `称号：${titleLabel}`, titleSubtitle, titleReason],
    factors.map(({ label, displayScore }) => `${label}：${displayScore}`),
    ["ココロアロマ", ...fragrances.flatMap(({
      sceneLabel,
      accordLabel,
      materialNames,
    }) => [
      `${sceneLabel}：${accordLabel}`,
      `香りの素材例：${materialNames.join("・")}`,
    ])],
    [disclaimer],
  ];

  if (shareUrl !== "") {
    blocks.push([validateHttpsShareUrl(shareUrl)]);
  }

  return blocks.map((lines) => lines.join("\n")).join("\n\n");
}
