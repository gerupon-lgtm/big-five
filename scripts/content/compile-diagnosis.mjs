import { FACTOR_ORDER } from "../../app/js/data/factor-order.js";
import { validateDefinitionStructure } from "../../app/js/domain/definition-validator.js";

const DIRECT_ERROR_CODES = new Set([
  "QUESTION_COUNT_INVALID",
  "PREVIEW_QUESTION_COUNT_INVALID",
  "QUESTION_REFERENCE_UNKNOWN",
]);

function contentError() {
  throw new TypeError("DIAGNOSIS_CONTENT_INVALID");
}

function assertCount(rows, expected, errorCode) {
  if (!Array.isArray(rows) || rows.length !== expected) {
    throw new TypeError(errorCode);
  }
}

function assertMinimumCount(rows, minimum) {
  if (!Array.isArray(rows) || rows.length < minimum) contentError();
}

function assertUnique(rows, field) {
  if (new Set(rows.map((row) => row[field])).size !== rows.length) contentError();
}

function sortByDisplayOrder(rows) {
  if (!rows.every(({ display_order }) => Number.isInteger(display_order) && display_order >= 1)) {
    contentError();
  }
  assertUnique(rows, "display_order");
  return [...rows].sort((left, right) => left.display_order - right.display_order);
}

function assertSameVersion(rows, field, expected) {
  if (!rows.every((row) => row[field] === expected)) contentError();
}

function toCanonicalVersions(diagnosisRow) {
  return {
    scaleId: diagnosisRow.scale_id,
    scaleVersion: diagnosisRow.scale_version,
    questionVersion: diagnosisRow.question_version,
    scoringVersion: diagnosisRow.scoring_version,
    resultTextVersion: diagnosisRow.result_text_version,
    titleRuleVersion: diagnosisRow.title_rule_version,
  };
}

function projectFactors(factorRows) {
  const factors = sortByDisplayOrder(factorRows).map((row) => ({
    id: row.factor_id,
    displayName: row.display_name,
    academicName: row.academic_name,
    lowPole: row.low_pole,
    highPole: row.high_pole,
    description: row.description,
  }));
  if (factors.map(({ id }) => id).join(",") !== FACTOR_ORDER.join(",")) contentError();
  return factors;
}

function projectQuestions(questionRows, previewRows) {
  assertUnique(questionRows, "question_id");
  const sortedQuestions = sortByDisplayOrder(questionRows);
  const questionById = new Map(sortedQuestions.map((row) => [row.question_id, row]));
  const sortedPreviewRows = sortByDisplayOrder(previewRows);
  assertUnique(sortedPreviewRows, "question_id");
  const previewQuestionIds = sortedPreviewRows.map(({ question_id }) => question_id);
  for (const row of sortedPreviewRows) {
    if (!questionById.has(row.question_id)) {
      throw new TypeError("QUESTION_REFERENCE_UNKNOWN");
    }
  }

  const previewQuestionIdSet = new Set(previewQuestionIds);
  const stagedRows = [
    ...previewQuestionIds.map((questionId) => questionById.get(questionId)),
    ...sortedQuestions.filter(({ question_id }) => !previewQuestionIdSet.has(question_id)),
  ];
  const questions = stagedRows.map((row, index) => {
    if (row.direction !== "positive" && row.direction !== "reverse") contentError();
    return {
      id: row.question_id,
      order: index + 1,
      textJa: row.text,
      factorId: row.factor_id,
      keyedDirection: row.direction === "reverse" ? "negative" : "positive",
      sourceItemId: row.source_ref,
      previewIncluded: previewQuestionIdSet.has(row.question_id),
    };
  });
  return { questions, previewQuestionIds };
}

function buildAndValidateDiagnosis({
  diagnosisRow,
  sourceRows,
  limitationRows,
  factorRows,
  questionRows,
  previewRows,
}) {
  const factors = projectFactors(factorRows);
  const source = sortByDisplayOrder(sourceRows).map((row) => ({
    id: row.source_id,
    url: row.url,
    label: row.label,
  }));
  const limitations = sortByDisplayOrder(limitationRows).map(({ text }) => text);
  const { questions, previewQuestionIds } = projectQuestions(questionRows, previewRows);
  const canonicalVersions = toCanonicalVersions(diagnosisRow);
  const diagnostic = {
    diagnosisId: diagnosisRow.diagnosis_id,
    ...canonicalVersions,
    scaleName: diagnosisRow.scale_name,
    factorOrder: [...FACTOR_ORDER],
    previewQuestionIds,
    detailQuestionIds: questions.map(({ id }) => id),
    source,
    limitations,
  };
  return validateDefinitionStructure({ diagnostic, factors, questions }, canonicalVersions);
}

export function compileDiagnosisContent({
  diagnosisRows,
  sourceRows,
  limitationRows,
  factorRows,
  questionRows,
  previewRows,
}) {
  try {
    assertCount(diagnosisRows, 1, "DIAGNOSIS_CONTENT_INVALID");
    assertCount(factorRows, 5, "DIAGNOSIS_CONTENT_INVALID");
    assertCount(questionRows, 50, "QUESTION_COUNT_INVALID");
    assertCount(previewRows, 20, "PREVIEW_QUESTION_COUNT_INVALID");
    assertMinimumCount(sourceRows, 4);
    assertMinimumCount(limitationRows, 3);

    const [diagnosisRow] = diagnosisRows;
    assertSameVersion(factorRows, "diagnostic_definition_version", diagnosisRow.diagnostic_definition_version);
    assertSameVersion(sourceRows, "diagnostic_definition_version", diagnosisRow.diagnostic_definition_version);
    assertSameVersion(limitationRows, "diagnostic_definition_version", diagnosisRow.diagnostic_definition_version);
    assertSameVersion(questionRows, "question_version", diagnosisRow.question_version);
    assertSameVersion(previewRows, "question_version", diagnosisRow.question_version);

    return buildAndValidateDiagnosis({
      diagnosisRow,
      sourceRows,
      limitationRows,
      factorRows,
      questionRows,
      previewRows,
    });
  } catch (error) {
    if (error instanceof TypeError && DIRECT_ERROR_CODES.has(error.message)) throw error;
    contentError();
  }
}
