import { FACTORS, SAMPLE_QUESTIONS } from "./sample-questions.js";

export function makeDemoAnswers(answerCount = 50) {
  const pattern = [5, 4, 3, 2, 4, 5, 2, 3, 4, 1];
  return Object.fromEntries(
    SAMPLE_QUESTIONS.slice(0, answerCount).map((question, index) => [
      question.id,
      pattern[index % pattern.length],
    ]),
  );
}

export function scoreAnswers(answers, answerCount) {
  if (![20, 50].includes(answerCount)) {
    throw new RangeError("answerCount must be 20 or 50");
  }
  const selected = SAMPLE_QUESTIONS.slice(0, answerCount);
  const scores = {};
  for (const factor of FACTORS) {
    const items = selected.filter((question) => question.factor === factor.id);
    const values = items.map((question) => {
      const response = Number(answers[question.id]);
      if (!Number.isInteger(response) || response < 1 || response > 5) {
        throw new TypeError(`missing or invalid answer: ${question.id}`);
      }
      return question.reverse ? 6 - response : response;
    });
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    scores[factor.id] = Math.round(((mean - 1) / 4) * 100);
  }
  return { answerCount, scores };
}
