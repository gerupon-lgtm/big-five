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

function validateHttpsShareUrl(value) {
  if (typeof value !== "string") {
    invalidShareResultText();
  }

  const trimmedUrl = value.trim();
  if (trimmedUrl.length === 0) {
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

export function createShareResultText({
  brandName,
  modeLabel,
  titleLabel,
  titleSubtitle,
  titleReason,
  factors,
  fragrances,
  disclaimer,
  shareUrl = "",
} = {}) {
  if (![brandName, modeLabel, titleLabel, titleSubtitle, titleReason, disclaimer].every(isNonEmptyString) ||
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

  const blocks = [
    [brandName, modeLabel, `称号：${titleLabel}`, titleSubtitle, titleReason],
    factors.map(({ label, displayScore }) => `${label}：${displayScore}`),
    ["ココロアロマ", ...fragrances.map(({ sceneLabel, accordLabel }) =>
      `${sceneLabel}：${accordLabel}`)],
    [disclaimer],
  ];

  if (shareUrl !== "") {
    blocks.push([validateHttpsShareUrl(shareUrl)]);
  }

  return blocks.map((lines) => lines.join("\n")).join("\n\n");
}
