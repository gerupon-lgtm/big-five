const FACTOR_ORDER = [
  "intellectImagination",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "emotionalStability",
];

const DIRECTIONS = new Set(["positive", "negative"]);

function invalidInput() {
  throw new TypeError("SCORING_INPUT_INVALID");
}

function validateInput(questionDefinitions, answers, questionCount) {
  if (!Array.isArray(questionDefinitions) || ![20, 50].includes(questionCount) || questionDefinitions.length < questionCount || answers === null || typeof answers !== "object" || Array.isArray(answers)) invalidInput();

  const questions = questionDefinitions.slice(0, questionCount);
  const expectedFactorItemCount = questionCount / FACTOR_ORDER.length;
  const questionIds = questions.map(({ id }) => id);
  if (new Set(questionIds).size !== questionIds.length || !questions.every(({ id, factorId, keyedDirection }) => typeof id === "string" && FACTOR_ORDER.includes(factorId) && DIRECTIONS.has(keyedDirection))) invalidInput();
  if (!FACTOR_ORDER.every((factorId) => questions.filter((question) => question.factorId === factorId).length === expectedFactorItemCount)) invalidInput();
  if (Object.keys(answers).length !== questionIds.length || !questionIds.every((id) => Number.isInteger(answers[id]) && answers[id] >= 1 && answers[id] <= 5)) invalidInput();
  return questions;
}

function factorResult(factorId, questions, answers) {
  const keyedAnswers = questions.map(({ id, keyedDirection }) => keyedDirection === "negative" ? 6 - answers[id] : answers[id]);
  const keyedSum = keyedAnswers.reduce((sum, answer) => sum + answer, 0);
  const rawMean = keyedSum / keyedAnswers.length;
  const band = rawMean >= 3.5 ? "high" : rawMean <= 2.5 ? "low" : "middle";
  const variance = keyedAnswers.reduce((sum, answer) => sum + ((answer - rawMean) ** 2), 0) / keyedAnswers.length;
  return Object.freeze({
    factorId,
    rawMean,
    displayScore: Math.round(((rawMean - 1) / 4) * 100),
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
