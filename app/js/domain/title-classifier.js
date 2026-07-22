import { validateTitleProfileDefinitions } from "../data/title-profile-definitions.js";

const FACTOR_ORDER = [
  "intellectImagination",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "emotionalStability",
];

function invalidClassification() {
  throw new TypeError("TITLE_CLASSIFICATION_INVALID");
}

function sameNumber(left, right) {
  return Math.abs(left - right) < 1e-10;
}

function expectedBand(rawMean) {
  return rawMean >= 3.5 ? "high" : rawMean <= 2.5 ? "low" : "middle";
}

function validateFactorResults(factorResults, questionCount) {
  const itemCount = questionCount / 5;
  const fields = ["factorId", "rawMean", "displayScore", "band", "salience", "directionalSupportCount", "variance"];
  if (!Array.isArray(factorResults) || ![20, 50].includes(questionCount) || factorResults.length !== 5) invalidClassification();
  if (!factorResults.every((factor) => factor !== null && typeof factor === "object" && !Array.isArray(factor) && Object.keys(factor).length === fields.length && fields.every((field) => Object.hasOwn(factor, field)))) invalidClassification();
  if (factorResults.map(({ factorId }) => factorId).join(",") !== FACTOR_ORDER.join(",")) invalidClassification();
  if (!factorResults.every(({ rawMean, displayScore, band, salience, directionalSupportCount, variance }) =>
    Number.isFinite(rawMean) && rawMean >= 1 && rawMean <= 5 &&
    Number.isInteger(displayScore) && displayScore === Math.round(((rawMean - 1) / 4) * 100) &&
    band === expectedBand(rawMean) && sameNumber(salience, Math.abs(rawMean - 3)) &&
    Number.isInteger(directionalSupportCount) && directionalSupportCount >= 0 && directionalSupportCount <= itemCount &&
    (band === "middle" ? directionalSupportCount === 0 : true) &&
    Number.isFinite(variance) && variance >= 0 && variance <= 4)) invalidClassification();
}

function compareSalience(left, right) {
  return (right.salience - left.salience) ||
    (right.directionalSupportCount - left.directionalSupportCount) ||
    (left.variance - right.variance) ||
    (FACTOR_ORDER.indexOf(left.factorId) - FACTOR_ORDER.indexOf(right.factorId));
}

function profileKey(kind, factors) {
  const ordered = [...factors].sort((left, right) => FACTOR_ORDER.indexOf(left.factorId) - FACTOR_ORDER.indexOf(right.factorId));
  return `${kind}:${ordered.map(({ factorId, direction }) => `${factorId}/${direction}`).join(",")}`;
}

function boundaryFlags(factorResults, rankedSalientFactors, threshold, questionCount) {
  const flags = factorResults.flatMap(({ factorId, rawMean }) => [2.5, 3.5]
    .filter((boundary) => Math.abs(rawMean - boundary) <= threshold)
    .map((boundary) => Object.freeze({ type: "factor-near-band-boundary", factorId, boundary, threshold, questionCount })));
  if (rankedSalientFactors.length >= 3 && rankedSalientFactors[1].salience - rankedSalientFactors[2].salience <= threshold) {
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
  validateFactorResults(factorResults, questionCount);
  validateTitleProfileDefinitions(titleProfiles);
  const threshold = questionCount === 20 ? 0.25 : 0.1;
  const rankedSalientFactors = factorResults.filter(({ band }) => band !== "middle").sort(compareSalience);
  const kind = rankedSalientFactors.length === 0 ? "balanced" : rankedSalientFactors.length === 1 ? "single" : "pair";
  const selectedFactors = rankedSalientFactors.slice(0, kind === "pair" ? 2 : 1).map(({ factorId, band }) => Object.freeze({ factorId, direction: band }));
  const matchingProfiles = titleProfiles.filter((profile) => profileKey(profile.kind, profile.factors) === profileKey(kind, selectedFactors));
  if (matchingProfiles.length !== 1) invalidClassification();
  const profile = matchingProfiles[0];
  return Object.freeze({
    titleRuleVersion: "title-rule-v1",
    kind,
    titleId: profile.titleId,
    characterId: profile.characterId,
    selectedFactors: Object.freeze(selectedFactors),
    boundaryFlags: boundaryFlags(factorResults, rankedSalientFactors, threshold, questionCount),
  });
}
