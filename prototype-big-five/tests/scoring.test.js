import test from "node:test";
import assert from "node:assert/strict";
import { SAMPLE_QUESTIONS } from "../sample-questions.js";
import { makeDemoAnswers, scoreAnswers } from "../sample-scoring.js";

test("sample inventory contains a fixed 50 items and a balanced 20-item checkpoint", () => {
  assert.equal(SAMPLE_QUESTIONS.length, 50);
  const checkpointCounts = Object.groupBy(
    SAMPLE_QUESTIONS.slice(0, 20),
    (question) => question.factor,
  );
  for (const factor of ["O", "C", "E", "A", "N"]) {
    assert.equal(checkpointCounts[factor].length, 4);
  }
});

test("scoreAnswers returns five bounded scale-internal scores", () => {
  const result = scoreAnswers(makeDemoAnswers(20), 20);
  assert.equal(result.answerCount, 20);
  assert.deepEqual(Object.keys(result.scores), ["O", "C", "E", "A", "N"]);
  for (const score of Object.values(result.scores)) {
    assert.ok(score >= 0 && score <= 100);
    assert.equal(Number.isInteger(score), true);
  }
});

test("reverse-keyed items invert a response before averaging", () => {
  const answers = Object.fromEntries(
    SAMPLE_QUESTIONS.map((question) => [question.id, 3]),
  );
  answers.O1 = 5;
  answers.O2 = 1;
  answers.O7 = 1;

  const result = scoreAnswers(answers, 50);

  assert.deepEqual(result.scores, { O: 55, C: 50, E: 50, A: 50, N: 50 });
});
