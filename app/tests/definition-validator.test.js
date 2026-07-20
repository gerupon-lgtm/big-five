import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  DiagnosticDefinition,
  FactorDefinitions,
  QuestionDefinitions,
} from "../js/data/diagnostic-definition.js";
import { validateDefinitionAuthority, validateDefinitionStructure } from "../js/domain/definition-validator.js";
import { IPIP_JA_50_AUTHORITY_FIXTURE } from "./fixtures/ipip-ja-50-authority.fixture.js";


test("T-002 F-002 exports the canonical data-model schema", () => {
  assert.deepEqual(Object.keys(DiagnosticDefinition), [
    "diagnosisId", "scaleId", "scaleName", "scaleVersion", "questionVersion", "scoringVersion",
    "resultTextVersion", "titleRuleVersion", "factorOrder", "previewQuestionIds",
    "detailQuestionIds", "source", "limitations",
  ]);
  assert.deepEqual(Object.keys(QuestionDefinitions[0]), [
    "id", "order", "textJa", "factorId", "keyedDirection", "sourceItemId", "previewIncluded",
  ]);
  assert.deepEqual(Object.keys(FactorDefinitions[0]), [
    "id", "displayName", "academicName", "lowPole", "highPole", "description",
  ]);
  assert.equal(typeof QuestionDefinitions[0].sourceItemId, "string");
  assert.equal(DiagnosticDefinition.scaleName, "IPIP\u65e5\u672c\u8a9e50\u9805\u76ee\u7248");
  assert.equal(QuestionDefinitions[0].order, 1);
  assert.equal(Array.isArray(DiagnosticDefinition.limitations), true);
  assert.equal(DiagnosticDefinition.source.some(({ id }) => id === "ipip-permission"), true);
});

test("T-002 F-014 requires an independent fixture for authority validation", () => {
  const definition = { diagnostic: DiagnosticDefinition, factors: FactorDefinitions, questions: QuestionDefinitions };
  assert.equal(validateDefinitionStructure(definition), definition);
  assert.throws(() => validateDefinitionAuthority(definition), /DEFINITION_AUTHORITY_INVALID/);
  assert.throws(() => validateDefinitionAuthority(definition, { rows: [] }), /DEFINITION_AUTHORITY_INVALID/);
  assert.equal(validateDefinitionAuthority(definition, IPIP_JA_50_AUTHORITY_FIXTURE), definition);
});

test("T-002 F-002 validates the fixed diagnostic definition", () => {
  const validated = validateDefinitionAuthority({
    diagnostic: DiagnosticDefinition,
    factors: FactorDefinitions,
    questions: QuestionDefinitions,
  }, IPIP_JA_50_AUTHORITY_FIXTURE);

  assert.equal(validated.diagnostic.diagnosisId, "big-five-ipip-ja");
  assert.equal(validated.questions.length, 50);
  assert.equal(validated.factors.length, 5);
});

test("T-002 F-002 matches every independent IPIP Japanese authority row", () => {
  const actualRows = QuestionDefinitions.map((question) => ({
    sourceItemId: question.sourceItemId,
    textJa: question.textJa,
    factorId: question.factorId,
    keyedDirection: question.keyedDirection,
    previewIncluded: question.previewIncluded,
  })).sort((left, right) => Number(left.sourceItemId) - Number(right.sourceItemId));

  assert.deepEqual(actualRows, IPIP_JA_50_AUTHORITY_FIXTURE.rows);
  assert.deepEqual(DiagnosticDefinition.previewQuestionIds, IPIP_JA_50_AUTHORITY_FIXTURE.previewQuestionIds);
  assert.equal(actualRows[0].textJa, IPIP_JA_50_AUTHORITY_FIXTURE.rows[0].textJa);
  assert.equal(actualRows[49].textJa, IPIP_JA_50_AUTHORITY_FIXTURE.rows[49].textJa);
});

function createMutableDefinition() {
  return structuredClone({
    diagnostic: DiagnosticDefinition,
    factors: FactorDefinitions,
    questions: QuestionDefinitions,
  });
}

test("T-002 F-014 rejects independently authoritative corruption", () => {
  const wording = createMutableDefinition();
  wording.questions[0].textJa = "changed wording";
  assert.throws(
    () => validateDefinitionAuthority(wording, IPIP_JA_50_AUTHORITY_FIXTURE),
    /DEFINITION_(?:AUTHORITY_)?INVALID/,
  );

  const sourceItem = createMutableDefinition();
  [sourceItem.questions[0].sourceItemId, sourceItem.questions[21].sourceItemId] = [
    sourceItem.questions[21].sourceItemId,
    sourceItem.questions[0].sourceItemId,
  ];
  assert.throws(
    () => validateDefinitionAuthority(sourceItem, IPIP_JA_50_AUTHORITY_FIXTURE),
    /DEFINITION_(?:AUTHORITY_)?INVALID/,
  );

  const factor = createMutableDefinition();
  [factor.questions[0].factorId, factor.questions[21].factorId] = [
    factor.questions[21].factorId,
    factor.questions[0].factorId,
  ];
  assert.throws(
    () => validateDefinitionAuthority(factor, IPIP_JA_50_AUTHORITY_FIXTURE),
    /DEFINITION_(?:AUTHORITY_)?INVALID/,
  );

  const direction = createMutableDefinition();
  [direction.questions[0].keyedDirection, direction.questions[5].keyedDirection] = [
    direction.questions[5].keyedDirection,
    direction.questions[0].keyedDirection,
  ];
  assert.throws(
    () => validateDefinitionAuthority(direction, IPIP_JA_50_AUTHORITY_FIXTURE), /DEFINITION_(?:AUTHORITY_)?INVALID/);
});

test("T-002 F-014 rejects duplicates, preview corruption, and unknown fields", () => {
  const duplicate = createMutableDefinition();
  duplicate.questions[1].id = duplicate.questions[0].id;
  assert.throws(() => validateDefinitionStructure(duplicate), /DEFINITION_INVALID/);

  const preview = createMutableDefinition();
  preview.questions[20].previewIncluded = true;
  assert.throws(() => validateDefinitionStructure(preview), /DEFINITION_INVALID/);

  const unknownField = createMutableDefinition();
  unknownField.questions[0].unexpected = true;
  assert.throws(() => validateDefinitionStructure(unknownField), /DEFINITION_INVALID/);

  const malformedNestedRecord = createMutableDefinition();
  malformedNestedRecord.diagnostic.source[0].unexpected = true;
  assert.throws(() => validateDefinitionStructure(malformedNestedRecord), /DEFINITION_INVALID/);
});

test("T-002 F-002 exposes deeply immutable fixed definitions", () => {
  assert.equal(Object.isFrozen(DiagnosticDefinition), true);
  assert.equal(Object.isFrozen(DiagnosticDefinition.previewQuestionIds), true);
  assert.equal(Object.isFrozen(FactorDefinitions), true);
  assert.equal(Object.isFrozen(FactorDefinitions[0]), true);
  assert.equal(Object.isFrozen(QuestionDefinitions), true);
  assert.equal(Object.isFrozen(QuestionDefinitions[0]), true);
});

test("T-002 F-002 preserves staged order, factor coverage, and static-only definitions", async () => {
  const previewSourceItemIds = QuestionDefinitions.slice(0, 20).map(({ sourceItemId }) => sourceItemId);
  const remainingSourceItemIds = QuestionDefinitions.slice(20).map(({ sourceItemId }) => sourceItemId);
  const expectedRemainingSourceItemIds = Array.from({ length: 50 }, (_, index) => String(index + 1))
    .filter((sourceItemId) => !IPIP_JA_50_AUTHORITY_FIXTURE.previewSourceItemIds.includes(sourceItemId));

  assert.deepEqual(previewSourceItemIds, IPIP_JA_50_AUTHORITY_FIXTURE.previewSourceItemIds);
  assert.deepEqual(remainingSourceItemIds, expectedRemainingSourceItemIds);

  for (const factor of FactorDefinitions) {
    assert.equal(QuestionDefinitions.filter(({ factorId }) => factorId === factor.id).length, 10);
    assert.equal(QuestionDefinitions.filter(({ factorId, previewIncluded }) => factorId === factor.id && previewIncluded).length, 4);
  }

  const sourceUrls = [
    new URL("../js/data/diagnostic-definition.js", import.meta.url),
    new URL("../js/domain/definition-validator.js", import.meta.url),
  ];
  const runtimeSources = await Promise.all(sourceUrls.map((url) => readFile(url, "utf8")));
  assert.equal(runtimeSources.some((source) => source.includes("prototype-big-five") || source.includes("Math.random")), false);
  for (const source of runtimeSources) {
    assert.doesNotMatch(source, /from\s+["'][^"']*(?:fixtures|prototype-big-five)/);
    assert.doesNotMatch(source, /\b(?:Math\.random|localStorage|fetch|document|window)\b/);
  }
});
