function invalidResultModel() {
  throw new TypeError("RESULT_MODEL_INVALID");
}

export function composeResultModel({ factors, classification, renderedTexts }) {
  if (!Array.isArray(factors) || factors.length !== 5 || !classification || typeof classification !== "object" || !Array.isArray(renderedTexts)) invalidResultModel();
  return Object.freeze({
    factors: Object.freeze([...factors]),
    titleId: classification.titleId,
    characterId: classification.characterId,
    boundaryFlags: Object.freeze([...classification.boundaryFlags]),
    renderedTexts: Object.freeze([...renderedTexts]),
  });
}
