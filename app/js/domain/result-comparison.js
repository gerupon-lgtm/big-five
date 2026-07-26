import { FACTOR_ORDER } from "../data/factor-order.js";
import { validateResultSnapshot } from "./result-snapshot.js";

export const COMPARE_ERROR = Object.freeze({
  SCALE_MISMATCH: "COMPARE_SCALE_MISMATCH",
  QUESTION_VERSION_MISMATCH: "COMPARE_QUESTION_VERSION_MISMATCH",
  SCORING_VERSION_MISMATCH: "COMPARE_SCORING_VERSION_MISMATCH",
  QUESTION_COUNT_MISMATCH: "COMPARE_QUESTION_COUNT_MISMATCH",
  SCORE_INVALID: "COMPARE_SCORE_INVALID",
});

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) deepFreeze(nestedValue);
  }
  return value;
}

function incompatible(code) {
  return Object.freeze({ compatible: false, code });
}

function canonicalize(snapshot) {
  try {
    return validateResultSnapshot(snapshot);
  } catch {
    return null;
  }
}

function hasComparableFactors(snapshot) {
  return Array.isArray(snapshot.factors) && snapshot.factors.length === FACTOR_ORDER.length &&
    FACTOR_ORDER.every((factorId, index) => {
      const factor = snapshot.factors[index];
      return factor?.factorId === factorId && Number.isFinite(factor.rawMean) &&
        factor.rawMean >= 1 && factor.rawMean <= 5;
    });
}

function compatibilityError(first, second) {
  if (first.versionTuple.scaleVersion !== second.versionTuple.scaleVersion) {
    return COMPARE_ERROR.SCALE_MISMATCH;
  }
  if (first.versionTuple.questionVersion !== second.versionTuple.questionVersion) {
    return COMPARE_ERROR.QUESTION_VERSION_MISMATCH;
  }
  if (first.versionTuple.scoringVersion !== second.versionTuple.scoringVersion) {
    return COMPARE_ERROR.SCORING_VERSION_MISMATCH;
  }
  if (first.questionCount !== second.questionCount) {
    return COMPARE_ERROR.QUESTION_COUNT_MISMATCH;
  }
  return null;
}

function chronologicallyOrder(first, second) {
  const firstTime = Date.parse(first.completedAt);
  const secondTime = Date.parse(second.completedAt);
  if (firstTime < secondTime || (firstTime === secondTime && first.resultId < second.resultId)) {
    return { before: first, after: second };
  }
  return { before: second, after: first };
}

/**
 * Compares two complete result snapshots without returning their private or presentation data.
 *
 * @param {unknown} first
 * @param {unknown} second
 * @returns {Readonly<object>}
 */
export function compareResultSnapshots(first, second) {
  const canonicalFirst = canonicalize(first);
  const canonicalSecond = canonicalize(second);
  if (!canonicalFirst || !canonicalSecond || canonicalFirst.resultId === canonicalSecond.resultId ||
    !hasComparableFactors(canonicalFirst) || !hasComparableFactors(canonicalSecond)) {
    return incompatible(COMPARE_ERROR.SCORE_INVALID);
  }

  const error = compatibilityError(canonicalFirst, canonicalSecond);
  if (error) return incompatible(error);

  const { before, after } = chronologicallyOrder(canonicalFirst, canonicalSecond);
  const itemCount = before.questionCount / FACTOR_ORDER.length;
  return deepFreeze({
    compatible: true,
    beforeResultId: before.resultId,
    afterResultId: after.resultId,
    beforeCompletedAt: before.completedAt,
    afterCompletedAt: after.completedAt,
    factorDeltas: FACTOR_ORDER.map((factorId, index) => {
      const beforeRawMean = before.factors[index].rawMean;
      const afterRawMean = after.factors[index].rawMean;
      const beforeKeyedSum = Math.round(beforeRawMean * itemCount);
      const afterKeyedSum = Math.round(afterRawMean * itemCount);
      return {
        factorId,
        beforeRawMean,
        afterRawMean,
        deltaRawMean: (afterKeyedSum - beforeKeyedSum) / itemCount,
      };
    }),
  });
}
