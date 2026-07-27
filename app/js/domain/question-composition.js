import { FACTOR_ORDER } from "../data/factor-order.js";

const KEYED_DIRECTIONS = new Set(["positive", "negative"]);

function invalidComposition() {
  throw new TypeError("QUESTION_COMPOSITION_INVALID");
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function buildComposition({ mode, definition, questionDefinitions }) {
  if (!isRecord(definition) || !Array.isArray(questionDefinitions)) {
    invalidComposition();
  }

  const questionIds = mode === "preview20"
    ? definition.previewQuestionIds
    : mode === "detail50"
      ? definition.detailQuestionIds
      : null;
  if (
    !Array.isArray(questionIds) ||
    questionIds.length === 0 ||
    questionIds.some((id) => typeof id !== "string" || id.length === 0) ||
    new Set(questionIds).size !== questionIds.length
  ) {
    invalidComposition();
  }

  const questionById = new Map();
  for (const question of questionDefinitions) {
    if (
      !isRecord(question) ||
      typeof question.id !== "string" ||
      question.id.length === 0 ||
      !FACTOR_ORDER.includes(question.factorId) ||
      !KEYED_DIRECTIONS.has(question.keyedDirection) ||
      questionById.has(question.id)
    ) {
      invalidComposition();
    }
    questionById.set(question.id, question);
  }

  const counts = new Map(FACTOR_ORDER.map((factorId) => [
    factorId,
    { factorId, positiveCount: 0, negativeCount: 0 },
  ]));
  for (const questionId of questionIds) {
    const question = questionById.get(questionId);
    if (!question) invalidComposition();
    const count = counts.get(question.factorId);
    if (!count) invalidComposition();
    count[question.keyedDirection === "positive"
      ? "positiveCount"
      : "negativeCount"] += 1;
  }

  return Object.freeze(FACTOR_ORDER.map((factorId) =>
    Object.freeze({ ...counts.get(factorId) })));
}

export function createQuestionComposition(input) {
  try {
    if (!isRecord(input)) invalidComposition();
    return buildComposition(input);
  } catch {
    invalidComposition();
  }
}
