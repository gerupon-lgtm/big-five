import { appMeta } from "../config/app-meta.js";
import { FACTOR_ORDER } from "../data/factor-order.js";
import { isValidFactorResults } from "./factor-result.js";

const CLASSIFICATION_FIELDS = ["titleRuleVersion", "kind", "titleId", "characterId", "selectedFactors", "boundaryFlags"];
const RENDERED_TEXT_FIELDS = ["id", "version", "section", "text", "evidenceRefs"];
const SECTIONS = new Set(["summary", "strength", "tradeoff", "work", "relationship", "stress", "action"]);

function invalidResultModel() {
  throw new TypeError("RESULT_MODEL_INVALID");
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) deepFreeze(nestedValue);
  }
  return value;
}

function isExactRecord(value, fields) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).length === fields.length && fields.every((field) => Object.hasOwn(value, field));
}

function validBoundaryThreshold(questionCount, threshold) {
  return (questionCount === 50 && threshold === 0.1) || (questionCount === 20 && threshold === 0.25);
}

function validBoundaryFlag(flag) {
  if (!flag || typeof flag !== "object" || Array.isArray(flag)) return false;
  if (flag.type === "factor-near-band-boundary") {
    return isExactRecord(flag, ["type", "factorId", "boundary", "threshold", "questionCount"]) &&
      FACTOR_ORDER.includes(flag.factorId) && [2.5, 3.5].includes(flag.boundary) &&
      validBoundaryThreshold(flag.questionCount, flag.threshold);
  }
  if (flag.type === "second-third-salience-near-tie") {
    return isExactRecord(flag, ["type", "factorIds", "threshold", "questionCount"]) &&
      Array.isArray(flag.factorIds) && flag.factorIds.length === 2 &&
      new Set(flag.factorIds).size === 2 && flag.factorIds.every((factorId) => FACTOR_ORDER.includes(factorId)) &&
      validBoundaryThreshold(flag.questionCount, flag.threshold);
  }
  return false;
}

function validClassification(classification) {
  if (!isExactRecord(classification, CLASSIFICATION_FIELDS)) return false;
  const { titleRuleVersion, kind, titleId, characterId, selectedFactors, boundaryFlags } = classification;
  const expectedSelectedCount = kind === "balanced" ? 0 : kind === "single" ? 1 : kind === "pair" ? 2 : -1;
  return titleRuleVersion === appMeta.diagnosticVersions.titleRuleVersion &&
    typeof titleId === "string" && titleId.length > 0 &&
    typeof characterId === "string" && characterId.length > 0 &&
    Array.isArray(selectedFactors) && selectedFactors.length === expectedSelectedCount &&
    selectedFactors.every((factor) => isExactRecord(factor, ["factorId", "direction"]) &&
      FACTOR_ORDER.includes(factor.factorId) && ["high", "low"].includes(factor.direction)) &&
    new Set(selectedFactors.map(({ factorId }) => factorId)).size === selectedFactors.length &&
    Array.isArray(boundaryFlags) && boundaryFlags.every(validBoundaryFlag);
}

function validRenderedTexts(renderedTexts) {
  return Array.isArray(renderedTexts) && renderedTexts.every((record) =>
    isExactRecord(record, RENDERED_TEXT_FIELDS) &&
    typeof record.id === "string" && record.id.length > 0 &&
    typeof record.version === "string" && record.version.length > 0 &&
    SECTIONS.has(record.section) && typeof record.text === "string" &&
    Array.isArray(record.evidenceRefs) && record.evidenceRefs.every((reference) => typeof reference === "string" && reference.length > 0) &&
    new Set(record.evidenceRefs).size === record.evidenceRefs.length);
}

export function composeResultModel(input) {
  if (!isExactRecord(input, ["factors", "classification", "renderedTexts"])) invalidResultModel();
  const { factors, classification, renderedTexts } = input;
  if (!isValidFactorResults(factors) || !validClassification(classification) || !validRenderedTexts(renderedTexts)) invalidResultModel();
  return deepFreeze({
    factors: factors.map((factor) => ({ ...factor })),
    titleId: classification.titleId,
    characterId: classification.characterId,
    boundaryFlags: classification.boundaryFlags.map((flag) => ({
      ...flag,
      ...(flag.type === "second-third-salience-near-tie" ? { factorIds: [...flag.factorIds] } : {}),
    })),
    renderedTexts: renderedTexts.map((record) => ({ ...record, evidenceRefs: [...record.evidenceRefs] })),
  });
}
