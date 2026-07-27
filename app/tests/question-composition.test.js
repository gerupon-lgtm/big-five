import assert from "node:assert/strict";
import test from "node:test";

import {
  DiagnosticDefinition,
  QuestionDefinitions,
} from "../js/data/diagnostic-definition.js";
import { createQuestionComposition } from "../js/domain/question-composition.js";

const PREVIEW_COUNTS = [
  { factorId: "intellectImagination", positiveCount: 1, negativeCount: 3 },
  { factorId: "conscientiousness", positiveCount: 2, negativeCount: 2 },
  { factorId: "extraversion", positiveCount: 2, negativeCount: 2 },
  { factorId: "agreeableness", positiveCount: 2, negativeCount: 2 },
  { factorId: "emotionalStability", positiveCount: 2, negativeCount: 2 },
];

const DETAIL_COUNTS = [
  { factorId: "intellectImagination", positiveCount: 7, negativeCount: 3 },
  { factorId: "conscientiousness", positiveCount: 6, negativeCount: 4 },
  { factorId: "extraversion", positiveCount: 5, negativeCount: 5 },
  { factorId: "agreeableness", positiveCount: 6, negativeCount: 4 },
  { factorId: "emotionalStability", positiveCount: 2, negativeCount: 8 },
];

test("T-008A F-002 counts preview directions without exposing question text or answers", () => {
  const model = createQuestionComposition({
    mode: "preview20",
    definition: DiagnosticDefinition,
    questionDefinitions: QuestionDefinitions,
  });

  assert.deepEqual(model, PREVIEW_COUNTS);
  assert.doesNotMatch(
    JSON.stringify(model),
    /textJa|answers|sourceItemId|questionId/,
  );
  assert.equal(Object.isFrozen(model), true);
  assert.equal(model.every(Object.isFrozen), true);
});

test("T-008A F-002 counts all 50 item directions in fixed factor order", () => {
  const model = createQuestionComposition({
    mode: "detail50",
    definition: DiagnosticDefinition,
    questionDefinitions: QuestionDefinitions,
  });

  assert.deepEqual(model, DETAIL_COUNTS);
});

test("T-008A F-002 leaves diagnostic and question definitions unchanged", () => {
  const definition = structuredClone(DiagnosticDefinition);
  const questionDefinitions = structuredClone(QuestionDefinitions);
  const definitionBefore = structuredClone(definition);
  const questionsBefore = structuredClone(questionDefinitions);

  createQuestionComposition({
    mode: "preview20",
    definition,
    questionDefinitions,
  });

  assert.deepEqual(definition, definitionBefore);
  assert.deepEqual(questionDefinitions, questionsBefore);
});

test("T-008A F-002 rejects an unknown mode with a stable error code", () => {
  assert.throws(
    () => createQuestionComposition({
      mode: "preview21",
      definition: DiagnosticDefinition,
      questionDefinitions: QuestionDefinitions,
    }),
    { name: "TypeError", message: "QUESTION_COMPOSITION_INVALID" },
  );
});

test("T-008A F-002 rejects a missing selected question", () => {
  const selectedId = DiagnosticDefinition.previewQuestionIds[0];
  const missing = QuestionDefinitions.filter(({ id }) => id !== selectedId);

  assert.throws(
    () => createQuestionComposition({
      mode: "preview20",
      definition: DiagnosticDefinition,
      questionDefinitions: missing,
    }),
    { name: "TypeError", message: "QUESTION_COMPOSITION_INVALID" },
  );
});

test("T-008A F-002 rejects duplicate question IDs", () => {
  const duplicate = QuestionDefinitions.map((question, index) =>
    index === 1 ? { ...question, id: QuestionDefinitions[0].id } : question);

  assert.throws(
    () => createQuestionComposition({
      mode: "detail50",
      definition: DiagnosticDefinition,
      questionDefinitions: duplicate,
    }),
    { name: "TypeError", message: "QUESTION_COMPOSITION_INVALID" },
  );
});

test("T-008A F-002 rejects an unknown keyed direction", () => {
  const selectedId = DiagnosticDefinition.previewQuestionIds[0];
  const invalid = QuestionDefinitions.map((question) =>
    question.id === selectedId
      ? { ...question, keyedDirection: "sideways" }
      : question);

  assert.throws(
    () => createQuestionComposition({
      mode: "preview20",
      definition: DiagnosticDefinition,
      questionDefinitions: invalid,
    }),
    { name: "TypeError", message: "QUESTION_COMPOSITION_INVALID" },
  );
});
