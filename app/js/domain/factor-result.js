import { FACTOR_ORDER } from "../data/factor-order.js";

const FACTOR_RESULT_FIELDS = ["factorId", "rawMean", "displayScore", "band", "salience", "directionalSupportCount", "variance"];
const REACHABLE_STATISTICS = new Map();

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

function reachableRationals(rawMean, questionCount) {
  const itemCounts = questionCount === null ? [4, 10] : [questionCount / FACTOR_ORDER.length];
  return itemCounts.flatMap((itemCount) => {
    const keyedSum = Math.round(rawMean * itemCount);
    return rawMean === keyedSum / itemCount ? [{ itemCount, keyedSum }] : [];
  });
}

function statisticsKey(keyedSum, varianceNumerator, directionalSupportCount) {
  return `${keyedSum}:${varianceNumerator}:${directionalSupportCount}`;
}

function reachableStatistics(itemCount) {
  if (REACHABLE_STATISTICS.has(itemCount)) return REACHABLE_STATISTICS.get(itemCount);
  const statistics = new Set();
  for (let count1 = 0; count1 <= itemCount; count1 += 1) {
    for (let count2 = 0; count2 <= itemCount - count1; count2 += 1) {
      for (let count3 = 0; count3 <= itemCount - count1 - count2; count3 += 1) {
        for (let count4 = 0; count4 <= itemCount - count1 - count2 - count3; count4 += 1) {
          const count5 = itemCount - count1 - count2 - count3 - count4;
          const keyedSum = count1 + (2 * count2) + (3 * count3) + (4 * count4) + (5 * count5);
          const squaredSum = count1 + (4 * count2) + (9 * count3) + (16 * count4) + (25 * count5);
          const varianceNumerator = (itemCount * squaredSum) - (keyedSum ** 2);
          const band = expectedBand(keyedSum, itemCount);
          const directionalSupportCount = band === "high" ? count4 + count5 : band === "low" ? count1 + count2 : 0;
          statistics.add(statisticsKey(keyedSum, varianceNumerator, directionalSupportCount));
        }
      }
    }
  }
  REACHABLE_STATISTICS.set(itemCount, statistics);
  return statistics;
}

export function isValidFactorResults(factorResults, questionCount = null) {
  if (!Array.isArray(factorResults) || factorResults.length !== FACTOR_ORDER.length) return false;
  if (questionCount !== null && ![20, 50].includes(questionCount)) return false;
  if (!factorResults.every((factor) => isExactRecord(factor, FACTOR_RESULT_FIELDS))) return false;
  if (factorResults.map(({ factorId }) => factorId).join(",") !== FACTOR_ORDER.join(",")) return false;
  return factorResults.every(({ rawMean, displayScore, band, salience, directionalSupportCount, variance }) => {
    if (!Number.isFinite(rawMean) || rawMean < 1 || rawMean > 5) return false;
    if (!Number.isInteger(displayScore) || salience !== Math.abs(rawMean - 3) ||
      !Number.isInteger(directionalSupportCount) || directionalSupportCount < 0 ||
      !Number.isFinite(variance) || variance < 0 || variance > 4) return false;
    return reachableRationals(rawMean, questionCount).some(({ itemCount, keyedSum }) => {
      const varianceNumerator = Math.round(variance * (itemCount ** 2));
      return displayScore === displayScoreFromRational(keyedSum, itemCount) &&
        band === expectedBand(keyedSum, itemCount) &&
        variance === varianceNumerator / (itemCount ** 2) &&
        reachableStatistics(itemCount).has(statisticsKey(keyedSum, varianceNumerator, directionalSupportCount));
    });
  });
}
