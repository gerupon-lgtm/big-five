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
    SAMPLE_QUESTIONS.slice(0, 20).map((question) => [question.id, 3]),
  );
  const positive = SAMPLE_QUESTIONS.slice(0, 20).find((question) => !question.reverse);
  const reversed = SAMPLE_QUESTIONS.slice(0, 20).find((question) => question.reverse);
  answers[positive.id] = 5;
  answers[reversed.id] = 1;
  const result = scoreAnswers(answers, 20);
  assert.ok(Object.values(result.scores).some((score) => score > 50));
});
