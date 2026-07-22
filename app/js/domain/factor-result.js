import { FACTOR_ORDER } from "../data/factor-order.js";

const FACTOR_RESULT_FIELDS = ["factorId", "rawMean", "displayScore", "band", "salience", "directionalSupportCount", "variance"];
const FLOAT_COMPARISON_EPSILON = 1e-10;

function isExactRecord(value, fields) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).length === fields.length && fields.every((field) => Object.hasOwn(value, field));
}

function expectedBand(rawMean) {
  return rawMean >= 3.5 ? "high" : rawMean <= 2.5 ? "low" : "middle";
}

function displayScoreFromMean(rawMean) {
  return Math.floor((((rawMean - 1) * 25) + 0.5) + FLOAT_COMPARISON_EPSILON);
}

export function isValidFactorResults(factorResults, questionCount = null) {
  if (!Array.isArray(factorResults) || factorResults.length !== FACTOR_ORDER.length) return false;
  if (questionCount !== null && ![20, 50].includes(questionCount)) return false;
  if (!factorResults.every((factor) => isExactRecord(factor, FACTOR_RESULT_FIELDS))) return false;
  if (factorResults.map(({ factorId }) => factorId).join(",") !== FACTOR_ORDER.join(",")) return false;
  const maximumSupport = questionCount === null ? 10 : questionCount / FACTOR_ORDER.length;
  return factorResults.every(({ rawMean, displayScore, band, salience, directionalSupportCount, variance }) =>
    Number.isFinite(rawMean) && rawMean >= 1 && rawMean <= 5 &&
    Number.isInteger(displayScore) && displayScore === displayScoreFromMean(rawMean) &&
    band === expectedBand(rawMean) && Math.abs(salience - Math.abs(rawMean - 3)) <= FLOAT_COMPARISON_EPSILON &&
    Number.isInteger(directionalSupportCount) && directionalSupportCount >= 0 && directionalSupportCount <= maximumSupport &&
    (band === "middle" ? directionalSupportCount === 0 : true) &&
    Number.isFinite(variance) && variance >= 0 && variance <= 4);
}
