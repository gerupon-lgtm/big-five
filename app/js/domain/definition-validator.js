import { FACTOR_ORDER } from "../data/factor-order.js";

const ROOT_FIELDS = ["diagnostic", "factors", "questions"];
const DIRECTIONS = new Set(["positive", "negative"]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactFields(value, fields) {
  return isRecord(value) && Object.keys(value).length === fields.length && fields.every(
    (field) => Object.hasOwn(value, field),
  );
}

function hasUniqueValues(values) {
  return new Set(values).size === values.length;
}


const CANONICAL_DIAGNOSTIC_FIELDS = ["diagnosisId", "scaleId", "scaleName", "scaleVersion", "questionVersion", "scoringVersion", "resultTextVersion", "titleRuleVersion", "factorOrder", "previewQuestionIds", "detailQuestionIds", "source", "limitations"];
const CANONICAL_FACTOR_FIELDS = ["id", "displayName", "academicName", "lowPole", "highPole", "description"];
const CANONICAL_QUESTION_FIELDS = ["id", "order", "textJa", "factorId", "keyedDirection", "sourceItemId", "previewIncluded"];
const CANONICAL_SOURCE_FIELDS = ["id", "url", "label"];
const AUTHORITY_ROW_FIELDS = ["sourceItemId", "textJa", "factorId", "keyedDirection", "previewIncluded"];
const AUTHORITY_FIELDS = ["rows", "previewQuestionIds", "previewSourceItemIds"];
const CANONICAL_VERSION_FIELDS = ["scaleId", "scaleVersion", "questionVersion", "scoringVersion", "resultTextVersion", "titleRuleVersion"];
const EXPECTED_SOURCE_ITEM_IDS = Array.from({ length: 50 }, (_, index) => String(index + 1));


function failStructure() {
  throw new TypeError("DEFINITION_INVALID");
}

function failAuthority() {
  throw new TypeError("DEFINITION_AUTHORITY_INVALID");
}

function hasCanonicalStrings(value, fields) {
  return hasExactFields(value, fields) && fields.every((field) => typeof value[field] === "string" && value[field].length > 0);
}

export function validateDefinitionStructure(value, canonicalVersions) {
  if (!hasExactFields(value, ROOT_FIELDS)) failStructure();
  const { diagnostic, factors, questions } = value;
  if (!hasExactFields(diagnostic, CANONICAL_DIAGNOSTIC_FIELDS) || !Array.isArray(factors) || factors.length !== 5 || !Array.isArray(questions) || questions.length !== 50) failStructure();
  if (!hasCanonicalStrings(canonicalVersions, CANONICAL_VERSION_FIELDS)) failStructure();
  if (diagnostic.diagnosisId !== "big-five-ipip-ja" || typeof diagnostic.scaleName !== "string" || diagnostic.scaleName.length === 0 || !CANONICAL_VERSION_FIELDS.every((field) => diagnostic[field] === canonicalVersions[field])) failStructure();
  if (!Array.isArray(diagnostic.factorOrder) || diagnostic.factorOrder.join(",") !== FACTOR_ORDER.join(",")) failStructure();
  if (!factors.every((factor) => hasCanonicalStrings(factor, CANONICAL_FACTOR_FIELDS)) || factors.map(({ id }) => id).join(",") !== diagnostic.factorOrder.join(",")) failStructure();
  if (!questions.every((question) => hasExactFields(question, CANONICAL_QUESTION_FIELDS))) failStructure();
  if (!questions.every(({ id, order, textJa, factorId, keyedDirection, sourceItemId, previewIncluded }) => typeof id === "string" && Number.isInteger(order) && order >= 1 && order <= 50 && typeof textJa === "string" && textJa.length > 0 && FACTOR_ORDER.includes(factorId) && DIRECTIONS.has(keyedDirection) && typeof sourceItemId === "string" && /^(?:[1-9]|[1-4][0-9]|50)$/.test(sourceItemId) && typeof previewIncluded === "boolean")) failStructure();
  if (!["id", "order", "sourceItemId"].every((field) => hasUniqueValues(questions.map((question) => question[field]))) || !questions.every((question, index) => question.order === index + 1)) failStructure();
  if (!Array.isArray(diagnostic.previewQuestionIds) || diagnostic.previewQuestionIds.length !== 20 || !hasUniqueValues(diagnostic.previewQuestionIds) || !Array.isArray(diagnostic.detailQuestionIds) || diagnostic.detailQuestionIds.length !== 50 || !hasUniqueValues(diagnostic.detailQuestionIds)) failStructure();
  const questionIds = new Set(questions.map(({ id }) => id));
  if (!diagnostic.previewQuestionIds.every((id) => questionIds.has(id)) || !diagnostic.detailQuestionIds.every((id) => questionIds.has(id)) || !questions.every((question, index) => diagnostic.detailQuestionIds[index] === question.id) || !questions.every((question) => question.previewIncluded === diagnostic.previewQuestionIds.includes(question.id))) failStructure();
  if (!FACTOR_ORDER.every((factorId) => questions.filter((question) => question.factorId === factorId).length === 10 && questions.filter((question) => question.factorId === factorId && question.previewIncluded).length === 4)) failStructure();
  if (!Array.isArray(diagnostic.source) || diagnostic.source.length < 4 || !diagnostic.source.every((reference) => hasCanonicalStrings(reference, CANONICAL_SOURCE_FIELDS)) || !hasUniqueValues(diagnostic.source.map(({ id }) => id)) || !diagnostic.source.some(({ id }) => id === "ipip-permission")) failStructure();
  if (!Array.isArray(diagnostic.limitations) || diagnostic.limitations.length < 3 || !diagnostic.limitations.every((limitation) => typeof limitation === "string" && limitation.length > 0)) failStructure();
  return value;
}
function validateAuthorityFixture(authorityFixture) {
  if (!hasExactFields(authorityFixture, AUTHORITY_FIELDS)) failAuthority();
  const { rows, previewQuestionIds, previewSourceItemIds } = authorityFixture;
  if (!Array.isArray(rows) || rows.length !== 50 || !rows.every((row) => hasExactFields(row, AUTHORITY_ROW_FIELDS))) failAuthority();
  if (!rows.every(({ sourceItemId, textJa, factorId, keyedDirection, previewIncluded }) =>
    typeof sourceItemId === "string" &&
    typeof textJa === "string" && textJa.length > 0 &&
    FACTOR_ORDER.includes(factorId) && DIRECTIONS.has(keyedDirection) &&
    typeof previewIncluded === "boolean")) failAuthority();

  const sourceItemIds = rows.map(({ sourceItemId }) => sourceItemId);
  if (!hasUniqueValues(sourceItemIds) || !EXPECTED_SOURCE_ITEM_IDS.every((id) => sourceItemIds.includes(id))) failAuthority();
  if (!Array.isArray(previewQuestionIds) || previewQuestionIds.length !== 20 || !hasUniqueValues(previewQuestionIds) || !previewQuestionIds.every((id) => typeof id === "string")) failAuthority();
  if (!Array.isArray(previewSourceItemIds) || previewSourceItemIds.length !== 20 || !hasUniqueValues(previewSourceItemIds) || !previewSourceItemIds.every((id) => typeof id === "string" && EXPECTED_SOURCE_ITEM_IDS.includes(id))) failAuthority();
  if (!previewSourceItemIds.every((sourceItemId, index) =>
    previewQuestionIds[index] === `ipip-ja-${sourceItemId.padStart(2, "0")}`)) failAuthority();

  const previewSourceItemIdSet = new Set(previewSourceItemIds);
  if (!rows.every((row) => row.previewIncluded === previewSourceItemIdSet.has(row.sourceItemId))) failAuthority();
  return authorityFixture;
}


export function validateDefinitionAuthority(value, canonicalVersions, authorityFixture) {
  const validValue = validateDefinitionStructure(value, canonicalVersions);
  const validAuthority = validateAuthorityFixture(authorityFixture);
  const questionBySourceItemId = new Map(validValue.questions.map((question) => [question.sourceItemId, question]));
  if (!validAuthority.rows.every((row) => questionBySourceItemId.has(row.sourceItemId) && ["textJa", "factorId", "keyedDirection", "previewIncluded"].every((field) => questionBySourceItemId.get(row.sourceItemId)[field] === row[field]))) failAuthority();
  if (!validAuthority.previewQuestionIds.every((id, index) => id === validValue.diagnostic.previewQuestionIds[index]) || !validAuthority.previewSourceItemIds.every((sourceItemId, index) => sourceItemId === validValue.questions[index].sourceItemId)) failAuthority();
  return validValue;
}
