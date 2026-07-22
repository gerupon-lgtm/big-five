import { validateTitleProfileDefinitions } from "../data/title-profile-definitions.js";
import { appMeta } from "../config/app-meta.js";
import { FACTOR_ORDER } from "../data/factor-order.js";
import { isValidFactorResults } from "./factor-result.js";

function invalidClassification() {
  throw new TypeError("TITLE_CLASSIFICATION_INVALID");
}

function compareSalience(left, right) {
  const salienceDifference = right.salienceUnits - left.salienceUnits;
  if (salienceDifference !== 0) return salienceDifference;
  const supportDifference = right.directionalSupportCount - left.directionalSupportCount;
  if (supportDifference !== 0) return supportDifference;
  const varianceDifference = left.varianceNumerator - right.varianceNumerator;
  if (varianceDifference !== 0) return varianceDifference;
  return FACTOR_ORDER.indexOf(left.factorId) - FACTOR_ORDER.indexOf(right.factorId);
}

function profileKey(kind, factors) {
  const ordered = [...factors].sort((left, right) => FACTOR_ORDER.indexOf(left.factorId) - FACTOR_ORDER.indexOf(right.factorId));
  return `${kind}:${ordered.map(({ factorId, direction }) => `${factorId}/${direction}`).join(",")}`;
}

function classificationMetrics(factorResults, itemCount) {
  return factorResults.map((factor) => {
    const keyedSum = Math.round(factor.rawMean * itemCount);
    return {
      ...factor,
      keyedSum,
      salienceUnits: Math.abs(keyedSum - (3 * itemCount)),
      varianceNumerator: Math.round(factor.variance * itemCount * itemCount),
    };
  });
}

function boundaryFlags(factorMetrics, rankedSalientFactors, threshold, questionCount, itemCount) {
  const thresholdUnits = 1;
  const flags = factorMetrics.flatMap(({ factorId, keyedSum }) => [2.5, 3.5]
    .filter((boundary) => Math.abs(keyedSum - (boundary * itemCount)) <= thresholdUnits)
    .map((boundary) => Object.freeze({ type: "factor-near-band-boundary", factorId, boundary, threshold, questionCount })));
  if (rankedSalientFactors.length >= 3 && rankedSalientFactors[1].salienceUnits - rankedSalientFactors[2].salienceUnits <= thresholdUnits) {
    flags.push(Object.freeze({
      type: "second-third-salience-near-tie",
      factorIds: Object.freeze([rankedSalientFactors[1].factorId, rankedSalientFactors[2].factorId]),
      threshold,
      questionCount,
    }));
  }
  return Object.freeze(flags);
}

export function classifyTitle({ factorResults, questionCount, titleProfiles }) {
  if (!isValidFactorResults(factorResults, questionCount)) invalidClassification();
  validateTitleProfileDefinitions(titleProfiles);
  const threshold = questionCount === 20 ? 0.25 : 0.1;
  const itemCount = questionCount / FACTOR_ORDER.length;
  const factorMetrics = classificationMetrics(factorResults, itemCount);
  const rankedSalientFactors = factorMetrics.filter(({ band }) => band !== "middle").sort(compareSalience);
  const kind = rankedSalientFactors.length === 0 ? "balanced" : rankedSalientFactors.length === 1 ? "single" : "pair";
  const selectedFactors = rankedSalientFactors.slice(0, kind === "pair" ? 2 : 1).map(({ factorId, band }) => Object.freeze({ factorId, direction: band }));
  const matchingProfiles = titleProfiles.filter((profile) => profileKey(profile.kind, profile.factors) === profileKey(kind, selectedFactors));
  if (matchingProfiles.length !== 1) invalidClassification();
  const profile = matchingProfiles[0];
  return Object.freeze({
    titleRuleVersion: appMeta.diagnosticVersions.titleRuleVersion,
    kind,
    titleId: profile.titleId,
    characterId: profile.characterId,
    selectedFactors: Object.freeze(selectedFactors),
    boundaryFlags: boundaryFlags(factorMetrics, rankedSalientFactors, threshold, questionCount, itemCount),
  });
}
