import { FACTOR_ORDER } from "../data/factor-order.js";

const FACTOR_RESULT_FIELDS = ["factorId", "rawMean", "displayScore", "band", "salience", "directionalSupportCount", "variance"];

function isExactRecord(value, fields) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).length === fields.length && fields.every((field) => Object.hasOwn(value, field));
}

function expectedBand(keyedSum, itemCount) {
  return keyedSum >= 3.5 * itemCount ? "high" : keyedSum <= 2.5 * itemCount ? "low" : "middle";
}

function displayScoreFromRational(keyedSum, itemCount) {
  return Math.floor((((keyedSum - itemCount) * 25 * 2) + itemCount) / (itemCount * 2));
}

function reachableRational(rawMean, questionCount) {
  const itemCounts = questionCount === null ? [4, 10] : [questionCount / FACTOR_ORDER.length];
  for (const itemCount of itemCounts) {
    const keyedSum = Math.round(rawMean * itemCount);
    if (rawMean === keyedSum / itemCount) return { itemCount, keyedSum };
  }
  return null;
}

export function isValidFactorResults(factorResults, questionCount = null) {
  if (!Array.isArray(factorResults) || factorResults.length !== FACTOR_ORDER.length) return false;
  if (questionCount !== null && ![20, 50].includes(questionCount)) return false;
  if (!factorResults.every((factor) => isExactRecord(factor, FACTOR_RESULT_FIELDS))) return false;
  if (factorResults.map(({ factorId }) => factorId).join(",") !== FACTOR_ORDER.join(",")) return false;
  const maximumSupport = questionCount === null ? 10 : questionCount / FACTOR_ORDER.length;
  return factorResults.every(({ rawMean, displayScore, band, salience, directionalSupportCount, variance }) => {
    if (!Number.isFinite(rawMean) || rawMean < 1 || rawMean > 5) return false;
    const rational = reachableRational(rawMean, questionCount);
    if (rational === null) return false;
    const { itemCount, keyedSum } = rational;
    return Number.isInteger(displayScore) && displayScore === displayScoreFromRational(keyedSum, itemCount) &&
      band === expectedBand(keyedSum, itemCount) && salience === Math.abs(rawMean - 3) &&
      Number.isInteger(directionalSupportCount) && directionalSupportCount >= 0 && directionalSupportCount <= maximumSupport &&
      (band === "middle" ? directionalSupportCount === 0 : true) &&
      Number.isFinite(variance) && variance >= 0 && variance <= 4 &&
      (questionCount === null || variance === Math.round(variance * (itemCount ** 2)) / (itemCount ** 2));
  });
}
