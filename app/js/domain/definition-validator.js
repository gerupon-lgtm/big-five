const ROOT_FIELDS = ["diagnostic", "factors", "questions"];
const FACTOR_IDS = [
  "extraversion", "agreeableness", "conscientiousness", "emotionalStability",
  "intellectImagination",
];
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

function hasVersion(value) {
  return typeof value === "string" && value.endsWith("-v1");
}


const CANONICAL_DIAGNOSTIC_FIELDS = ["diagnosisId", "scaleId", "scaleVersion", "questionVersion", "scoringVersion", "resultTextVersion", "titleRuleVersion", "factorOrder", "previewQuestionIds", "detailQuestionIds", "source", "limitations"];
const CANONICAL_FACTOR_FIELDS = ["id", "displayName", "academicName", "lowPole", "highPole", "description"];
const CANONICAL_QUESTION_FIELDS = ["id", "order", "textJa", "factorId", "keyedDirection", "sourceItemId", "previewIncluded"];
const CANONICAL_SOURCE_FIELDS = ["id", "url", "label"];
const AUTHORITY_ROW_FIELDS = ["sourceItemId", "textJa", "factorId", "keyedDirection", "previewIncluded"];

function failStructure() {
  throw new TypeError("DEFINITION_INVALID");
}

function failAuthority() {
  throw new TypeError("DEFINITION_AUTHORITY_INVALID");
}

function hasCanonicalStrings(value, fields) {
  return hasExactFields(value, fields) && fields.every((field) => typeof value[field] === "string" && value[field].length > 0);
}

export function validateDefinitionStructure(value) {
  if (!hasExactFields(value, ROOT_FIELDS)) failStructure();
  const { diagnostic, factors, questions } = value;
  if (!hasExactFields(diagnostic, CANONICAL_DIAGNOSTIC_FIELDS) || !Array.isArray(factors) || factors.length !== 5 || !Array.isArray(questions) || questions.length !== 50) failStructure();
  if (diagnostic.diagnosisId !== "big-five-ipip-ja" || typeof diagnostic.scaleId !== "string" || !["scaleVersion", "questionVersion", "scoringVersion", "resultTextVersion", "titleRuleVersion"].every((field) => hasVersion(diagnostic[field])) || diagnostic.titleRuleVersion !== "title-rule-v1") failStructure();
  if (!Array.isArray(diagnostic.factorOrder) || diagnostic.factorOrder.join(",") !== FACTOR_IDS.join(",")) failStructure();
  if (!factors.every((factor) => hasCanonicalStrings(factor, CANONICAL_FACTOR_FIELDS)) || factors.map(({ id }) => id).join(",") !== diagnostic.factorOrder.join(",")) failStructure();
  if (!questions.every((question) => hasExactFields(question, CANONICAL_QUESTION_FIELDS))) failStructure();
  if (!questions.every(({ id, order, textJa, factorId, keyedDirection, sourceItemId, previewIncluded }) => typeof id === "string" && Number.isInteger(order) && order >= 1 && order <= 50 && typeof textJa === "string" && textJa.length > 0 && FACTOR_IDS.includes(factorId) && DIRECTIONS.has(keyedDirection) && typeof sourceItemId === "string" && /^(?:[1-9]|[1-4][0-9]|50)$/.test(sourceItemId) && typeof previewIncluded === "boolean")) failStructure();
  if (!["id", "order", "sourceItemId"].every((field) => hasUniqueValues(questions.map((question) => question[field]))) || !questions.every((question, index) => question.order === index + 1)) failStructure();
  if (!Array.isArray(diagnostic.previewQuestionIds) || diagnostic.previewQuestionIds.length !== 20 || !hasUniqueValues(diagnostic.previewQuestionIds) || !Array.isArray(diagnostic.detailQuestionIds) || diagnostic.detailQuestionIds.length !== 50 || !hasUniqueValues(diagnostic.detailQuestionIds)) failStructure();
  const questionIds = new Set(questions.map(({ id }) => id));
  if (!diagnostic.previewQuestionIds.every((id) => questionIds.has(id)) || !diagnostic.detailQuestionIds.every((id) => questionIds.has(id)) || !questions.every((question, index) => diagnostic.detailQuestionIds[index] === question.id) || !questions.every((question) => question.previewIncluded === diagnostic.previewQuestionIds.includes(question.id))) failStructure();
  if (!FACTOR_IDS.every((factorId) => questions.filter((question) => question.factorId === factorId).length === 10 && questions.filter((question) => question.factorId === factorId && question.previewIncluded).length === 4)) failStructure();
  if (!Array.isArray(diagnostic.source) || diagnostic.source.length < 4 || !diagnostic.source.every((reference) => hasCanonicalStrings(reference, CANONICAL_SOURCE_FIELDS)) || !hasUniqueValues(diagnostic.source.map(({ id }) => id)) || !diagnostic.source.some(({ id }) => id === "ipip-permission")) failStructure();
  if (!Array.isArray(diagnostic.limitations) || diagnostic.limitations.length < 3 || !diagnostic.limitations.every((limitation) => typeof limitation === "string" && limitation.length > 0)) failStructure();
  return value;
}

export function validateDefinitionAuthority(value, authorityFixture) {
  const validValue = validateDefinitionStructure(value);
  if (!isRecord(authorityFixture) || !Array.isArray(authorityFixture.rows) || authorityFixture.rows.length !== 50 || !Array.isArray(authorityFixture.previewQuestionIds) || authorityFixture.previewQuestionIds.length !== 20 || !Array.isArray(authorityFixture.previewSourceItemIds) || authorityFixture.previewSourceItemIds.length !== 20) failAuthority();
  if (!authorityFixture.rows.every((row) => hasExactFields(row, AUTHORITY_ROW_FIELDS))) failAuthority();
  const questionBySourceItemId = new Map(validValue.questions.map((question) => [question.sourceItemId, question]));
  if (!authorityFixture.rows.every((row) => questionBySourceItemId.has(row.sourceItemId) && ["textJa", "factorId", "keyedDirection", "previewIncluded"].every((field) => questionBySourceItemId.get(row.sourceItemId)[field] === row[field]))) failAuthority();
  if (!authorityFixture.previewQuestionIds.every((id, index) => id === validValue.diagnostic.previewQuestionIds[index]) || !authorityFixture.previewSourceItemIds.every((sourceItemId, index) => sourceItemId === validValue.questions[index].sourceItemId)) failAuthority();
  return validValue;
}
