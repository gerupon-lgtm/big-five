import { FACTOR_ORDER } from "../data/factor-order.js";

const DIRECTIONS = new Set(["positive", "negative"]);

function invalidInput() {
  throw new TypeError("SCORING_INPUT_INVALID");
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateInput(questionDefinitions, answers, questionCount) {
  if (!Array.isArray(questionDefinitions) || ![20, 50].includes(questionCount) || questionDefinitions.length < questionCount || !isRecord(answers)) invalidInput();

  const questions = questionDefinitions.slice(0, questionCount);
  const expectedFactorItemCount = questionCount / FACTOR_ORDER.length;
  if (!questions.every((question) => isRecord(question))) invalidInput();
  const questionIds = questions.map(({ id }) => id);
  if (new Set(questionIds).size !== questionIds.length || !questions.every(({ id, factorId, keyedDirection }) => typeof id === "string" && FACTOR_ORDER.includes(factorId) && DIRECTIONS.has(keyedDirection))) invalidInput();
  if (!FACTOR_ORDER.every((factorId) => questions.filter((question) => question.factorId === factorId).length === expectedFactorItemCount)) invalidInput();
  const answerKeys = Object.keys(answers);
  if (answerKeys.length !== questionIds.length || !answerKeys.every((id) => questionIds.includes(id)) || !questionIds.every((id) => {
    const descriptor = Object.getOwnPropertyDescriptor(answers, id);
    return descriptor && Object.hasOwn(descriptor, "value") && Number.isInteger(descriptor.value) && descriptor.value >= 1 && descriptor.value <= 5;
  })) invalidInput();
  return questions;
}

function factorResult(factorId, questions, answers) {
  const keyedAnswers = questions.map(({ id, keyedDirection }) => keyedDirection === "negative" ? 6 - answers[id] : answers[id]);
  const keyedSum = keyedAnswers.reduce((sum, answer) => sum + answer, 0);
  const itemCount = keyedAnswers.length;
  const rawMean = keyedSum / itemCount;
  const displayNumerator = (keyedSum - keyedAnswers.length) * 25;
  const band = rawMean >= 3.5 ? "high" : rawMean <= 2.5 ? "low" : "middle";
  const squaredSum = keyedAnswers.reduce((sum, answer) => sum + (answer ** 2), 0);
  const variance = ((itemCount * squaredSum) - (keyedSum ** 2)) / (itemCount ** 2);
  return Object.freeze({
    factorId,
    rawMean,
    displayScore: Math.floor(((displayNumerator * 2) + keyedAnswers.length) / (keyedAnswers.length * 2)),
    band,
    salience: Math.abs(rawMean - 3),
    directionalSupportCount: band === "high"
      ? keyedAnswers.filter((answer) => answer >= 4).length
      : band === "low"
        ? keyedAnswers.filter((answer) => answer <= 2).length
        : 0,
    variance,
  });
}

export function scoreDiagnostic({ questionDefinitions, answers, questionCount }) {
  const questions = validateInput(questionDefinitions, answers, questionCount);
  return Object.freeze(FACTOR_ORDER.map((factorId) => factorResult(
    factorId,
    questions.filter((question) => question.factorId === factorId),
    answers,
  )));
}
