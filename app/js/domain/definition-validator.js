const ROOT_FIELDS = ["diagnostic", "factors", "questions"];
const DIAGNOSTIC_FIELDS = [
  "diagnosisId", "scaleId", "scaleName", "definitionVersion", "scaleVersion",
  "questionSetVersion", "scoringVersion", "resultTextVersion", "titleRuleVersion",
  "previewQuestionIds", "detailQuestionIds", "sourceReferences", "publicDomainTerms",
  "limitations",
];
const FACTOR_FIELDS = ["id", "name", "scaleVersion"];
const QUESTION_FIELDS = [
  "id", "sourceItemId", "stagedOrder", "text", "factorId", "keyedDirection",
  "previewIncluded", "questionSetVersion",
];
const SOURCE_REFERENCE_FIELDS = ["id", "url", "label"];
const PUBLIC_DOMAIN_FIELDS = ["sourceUrl", "statement"];
const LIMITATION_FIELDS = ["id", "text"];
const FACTOR_IDS = [
  "extraversion", "agreeableness", "conscientiousness", "emotionalStability",
  "intellectImagination",
];
const DIRECTIONS = new Set(["positive", "negative"]);
const VERSION_FIELDS = [
  "definitionVersion", "scaleVersion", "questionSetVersion", "scoringVersion",
  "resultTextVersion", "titleRuleVersion",
];

function fail() {
  throw new TypeError("DEFINITION_INVALID");
}

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

function matchesAuthorityFixture(questions, authorityFixture) {
  if (authorityFixture === undefined) return true;
  if (!isRecord(authorityFixture) || !Array.isArray(authorityFixture.rows) || authorityFixture.rows.length !== 50 || !Array.isArray(authorityFixture.previewQuestionIds) || authorityFixture.previewQuestionIds.length !== 20) return false;
  const questionsBySourceItemId = new Map(questions.map((question) => [question.sourceItemId, question]));
  return authorityFixture.rows.every((row) =>
    isRecord(row) && hasExactFields(row, ["sourceItemId", "text", "factorId", "keyedDirection", "previewIncluded"]) &&
    questionsBySourceItemId.has(row.sourceItemId) &&
    ["text", "factorId", "keyedDirection", "previewIncluded"].every(
      (field) => questionsBySourceItemId.get(row.sourceItemId)[field] === row[field],
    ),
  ) && authorityFixture.previewQuestionIds.every(
    (id, index) => typeof id === "string" && id === questions[index].id,
  );
}

export function validateDiagnosticDefinition(value, authorityFixture) {
  if (!hasExactFields(value, ROOT_FIELDS)) fail();
  const { diagnostic, factors, questions } = value;

  if (!hasExactFields(diagnostic, DIAGNOSTIC_FIELDS)) fail();
  if (!Array.isArray(factors) || factors.length !== 5) fail();
  if (!Array.isArray(questions) || questions.length !== 50) fail();
  if (diagnostic.diagnosisId !== "big-five-ipip-ja" || typeof diagnostic.scaleId !== "string" || typeof diagnostic.scaleName !== "string") fail();
  if (!VERSION_FIELDS.every((field) => hasVersion(diagnostic[field])) || diagnostic.titleRuleVersion !== "title-rule-v1") fail();

  if (!factors.every((factor) => hasExactFields(factor, FACTOR_FIELDS))) fail();
  if (factors.map(({ id }) => id).join(",") !== FACTOR_IDS.join(",")) fail();
  if (!factors.every(({ name, scaleVersion }) => typeof name === "string" && scaleVersion === diagnostic.scaleVersion)) fail();

  if (!questions.every((question) => hasExactFields(question, QUESTION_FIELDS))) fail();
  if (!questions.every(({ id, sourceItemId, stagedOrder, text, factorId, keyedDirection, previewIncluded, questionSetVersion }) =>
    typeof id === "string" && Number.isInteger(sourceItemId) && sourceItemId >= 1 && sourceItemId <= 50 &&
    Number.isInteger(stagedOrder) && stagedOrder >= 1 && stagedOrder <= 50 && typeof text === "string" && text.length > 0 &&
    FACTOR_IDS.includes(factorId) && DIRECTIONS.has(keyedDirection) && typeof previewIncluded === "boolean" &&
    questionSetVersion === diagnostic.questionSetVersion,
  )) fail();
  if (!["id", "sourceItemId", "stagedOrder"].every((field) => hasUniqueValues(questions.map((question) => question[field])))) fail();
  if (!questions.every((question, index) => question.stagedOrder === index + 1)) fail();

  if (!Array.isArray(diagnostic.previewQuestionIds) || diagnostic.previewQuestionIds.length !== 20 || !hasUniqueValues(diagnostic.previewQuestionIds)) fail();
  if (!Array.isArray(diagnostic.detailQuestionIds) || diagnostic.detailQuestionIds.length !== 50 || !hasUniqueValues(diagnostic.detailQuestionIds)) fail();
  const questionIds = new Set(questions.map(({ id }) => id));
  if (!diagnostic.previewQuestionIds.every((id) => questionIds.has(id)) || !diagnostic.detailQuestionIds.every((id) => questionIds.has(id))) fail();
  if (!questions.every((question, index) => diagnostic.detailQuestionIds[index] === question.id)) fail();
  if (!questions.every((question) => question.previewIncluded === diagnostic.previewQuestionIds.includes(question.id))) fail();
  if (!FACTOR_IDS.every((factorId) => questions.filter((question) => question.factorId === factorId).length === 10 && questions.filter((question) => question.factorId === factorId && question.previewIncluded).length === 4)) fail();

  if (!Array.isArray(diagnostic.sourceReferences) || diagnostic.sourceReferences.length !== 3 || !diagnostic.sourceReferences.every((reference) => hasExactFields(reference, SOURCE_REFERENCE_FIELDS) && Object.values(reference).every((field) => typeof field === "string" && field.length > 0)) || !hasUniqueValues(diagnostic.sourceReferences.map(({ id }) => id))) fail();
  if (!hasExactFields(diagnostic.publicDomainTerms, PUBLIC_DOMAIN_FIELDS) || !Object.values(diagnostic.publicDomainTerms).every((field) => typeof field === "string" && field.length > 0)) fail();
  if (!Array.isArray(diagnostic.limitations) || diagnostic.limitations.length !== 3 || !diagnostic.limitations.every((limitation) => hasExactFields(limitation, LIMITATION_FIELDS) && Object.values(limitation).every((field) => typeof field === "string" && field.length > 0)) || !hasUniqueValues(diagnostic.limitations.map(({ id }) => id))) fail();
  if (!matchesAuthorityFixture(questions, authorityFixture)) fail();
  return value;
}
