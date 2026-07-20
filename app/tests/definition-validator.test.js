import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  DiagnosticDefinition,
  FactorDefinitions,
  QuestionDefinitions,
} from "../js/data/diagnostic-definition.js";
import { appMeta } from "../js/config/app-meta.js";
import { validateDefinitionAuthority, validateDefinitionStructure } from "../js/domain/definition-validator.js";
import { IPIP_JA_50_AUTHORITY_FIXTURE } from "./fixtures/ipip-ja-50-authority.fixture.js";
const definitionVersions = appMeta.diagnosticVersions;



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
  assert.equal(validateDefinitionStructure(definition, definitionVersions), definition);
  assert.throws(() => validateDefinitionAuthority(definition), /DEFINITION_INVALID/);
  assert.throws(() => validateDefinitionAuthority(definition, definitionVersions, { rows: [] }), /DEFINITION_AUTHORITY_INVALID/);
  assert.equal(validateDefinitionAuthority(definition, definitionVersions, IPIP_JA_50_AUTHORITY_FIXTURE), definition);
});

test("T-002 F-002 validates the fixed diagnostic definition", () => {
  const validated = validateDefinitionAuthority({
    diagnostic: DiagnosticDefinition,
    factors: FactorDefinitions,
    questions: QuestionDefinitions,
  }, definitionVersions, IPIP_JA_50_AUTHORITY_FIXTURE);

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
test("T-002 F-002 pins representative official literals independently of the fixture", () => {
  const bySourceId = new Map(QuestionDefinitions.map((question) => [question.sourceItemId, question]));
  assert.deepEqual(
    ["1", "24", "50"].map((sourceItemId) => {
      const { textJa, factorId, keyedDirection, previewIncluded } = bySourceId.get(sourceItemId);
      return { sourceItemId, textJa, factorId, keyedDirection, previewIncluded };
    }),
    [
      { sourceItemId: "1", textJa: "\u76db\u308a\u4e0a\u3052\u5f79\u3067\u3042\u308b", factorId: "extraversion", keyedDirection: "positive", previewIncluded: true },
      { sourceItemId: "24", textJa: "\u52d5\u63fa\u3057\u3084\u3059\u3044", factorId: "emotionalStability", keyedDirection: "negative", previewIncluded: false },
      { sourceItemId: "50", textJa: "\u30a2\u30a4\u30c7\u30a3\u30a2\u304c\u8c4a\u5bcc\u3067\u3042\u308b", factorId: "intellectImagination", keyedDirection: "positive", previewIncluded: false },
    ],
  );
});

test("T-002 F-002 uses requirement v1.7 factor labels, explanations, and fixed order", () => {
  assert.deepEqual(DiagnosticDefinition.factorOrder, [
    "intellectImagination", "conscientiousness", "extraversion", "agreeableness", "emotionalStability",
  ]);
  assert.deepEqual(FactorDefinitions.map(({ displayName }) => displayName), [
    "\u77e5\u6027\u30fb\u60f3\u50cf\u529b", "\u52e4\u52c9\u6027", "\u5916\u5411\u6027", "\u5354\u8abf\u6027", "\u60c5\u7dd2\u5b89\u5b9a\u6027",
  ]);
  assert.match(FactorDefinitions.find(({ id }) => id === "emotionalStability").description, /\u795e\u7d4c\u75c7\u50be\u5411.*\u9006\u65b9\u5411/);
  assert.match(FactorDefinitions.find(({ id }) => id === "intellectImagination").description, /Big Five.*\u958b\u653e\u6027.*\u5bfe\u5fdc/);
});


function createMutableDefinition() {
  return structuredClone({
    diagnostic: DiagnosticDefinition,
    factors: FactorDefinitions,
    questions: QuestionDefinitions,
  });
}
test("T-002 F-014 rejects an empty scaleId and every unrelated version reference", () => {
  const emptyScale = createMutableDefinition();
  emptyScale.diagnostic.scaleId = "";
  assert.throws(() => validateDefinitionStructure(emptyScale, definitionVersions), /DEFINITION_INVALID/);

  for (const field of Object.keys(definitionVersions)) {
    const definition = createMutableDefinition();
    definition.diagnostic[field] = field === "scaleId" ? "unrelated-scale" : `unrelated-${field}-v1`;
    assert.throws(() => validateDefinitionStructure(definition, definitionVersions), /DEFINITION_INVALID/, field);
  }
});


test("T-002 F-014 rejects independently authoritative corruption", () => {
  const wording = createMutableDefinition();
  wording.questions[0].textJa = "changed wording";
  assert.throws(
    () => validateDefinitionAuthority(wording, definitionVersions, IPIP_JA_50_AUTHORITY_FIXTURE),
    /DEFINITION_(?:AUTHORITY_)?INVALID/,
  );

  const sourceItem = createMutableDefinition();
  [sourceItem.questions[0].sourceItemId, sourceItem.questions[21].sourceItemId] = [
    sourceItem.questions[21].sourceItemId,
    sourceItem.questions[0].sourceItemId,
  ];
  assert.throws(
    () => validateDefinitionAuthority(sourceItem, definitionVersions, IPIP_JA_50_AUTHORITY_FIXTURE),
    /DEFINITION_(?:AUTHORITY_)?INVALID/,
  );

  const factor = createMutableDefinition();
  [factor.questions[0].factorId, factor.questions[21].factorId] = [
    factor.questions[21].factorId,
    factor.questions[0].factorId,
  ];
  assert.throws(
    () => validateDefinitionAuthority(factor, definitionVersions, IPIP_JA_50_AUTHORITY_FIXTURE),
    /DEFINITION_(?:AUTHORITY_)?INVALID/,
  );

  const direction = createMutableDefinition();
  [direction.questions[0].keyedDirection, direction.questions[5].keyedDirection] = [
    direction.questions[5].keyedDirection,
    direction.questions[0].keyedDirection,
  ];
  assert.throws(
    () => validateDefinitionAuthority(direction, definitionVersions, IPIP_JA_50_AUTHORITY_FIXTURE), /DEFINITION_(?:AUTHORITY_)?INVALID/);
});

test("T-002 F-014 rejects duplicates, preview corruption, and unknown fields", () => {
  const duplicate = createMutableDefinition();
  duplicate.questions[1].id = duplicate.questions[0].id;
  assert.throws(() => validateDefinitionStructure(duplicate, definitionVersions), /DEFINITION_INVALID/);

  const preview = createMutableDefinition();
  preview.questions[20].previewIncluded = true;
  assert.throws(() => validateDefinitionStructure(preview, definitionVersions), /DEFINITION_INVALID/);

  const unknownField = createMutableDefinition();
  unknownField.questions[0].unexpected = true;
  assert.throws(() => validateDefinitionStructure(unknownField, definitionVersions), /DEFINITION_INVALID/);

  const malformedNestedRecord = createMutableDefinition();
  malformedNestedRecord.diagnostic.source[0].unexpected = true;
  assert.throws(() => validateDefinitionStructure(malformedNestedRecord, definitionVersions), /DEFINITION_INVALID/);
});

test("T-002 F-014 rejects incomplete authority rows and source ID sets", () => {
  const definition = createMutableDefinition();
  const missingRow = structuredClone(IPIP_JA_50_AUTHORITY_FIXTURE);
  missingRow.rows.pop();
  assert.throws(() => validateDefinitionAuthority(definition, definitionVersions, missingRow), /DEFINITION_AUTHORITY_INVALID/);

  const duplicateSource = structuredClone(IPIP_JA_50_AUTHORITY_FIXTURE);
  duplicateSource.rows[49].sourceItemId = duplicateSource.rows[48].sourceItemId;
  assert.throws(() => validateDefinitionAuthority(definition, definitionVersions, duplicateSource), /DEFINITION_AUTHORITY_INVALID/);

  const unknownTopLevel = structuredClone(IPIP_JA_50_AUTHORITY_FIXTURE);
  unknownTopLevel.unexpected = true;
  assert.throws(() => validateDefinitionAuthority(definition, definitionVersions, unknownTopLevel), /DEFINITION_AUTHORITY_INVALID/);
});

test("T-002 F-014 rejects malformed, duplicate, or inconsistent preview authority arrays", () => {
  const definition = createMutableDefinition();
  for (const corrupt of [
    (fixture) => fixture.previewQuestionIds.pop(),
    (fixture) => { fixture.previewQuestionIds[1] = fixture.previewQuestionIds[0]; },
    (fixture) => { fixture.previewSourceItemIds[1] = fixture.previewSourceItemIds[0]; },
    (fixture) => { fixture.previewQuestionIds[0] = "ipip-ja-50"; },
    (fixture) => { fixture.rows[0].previewIncluded = false; },
  ]) {
    const fixture = structuredClone(IPIP_JA_50_AUTHORITY_FIXTURE);
    corrupt(fixture);
    assert.throws(() => validateDefinitionAuthority(definition, definitionVersions, fixture), /DEFINITION_AUTHORITY_INVALID/);
  }
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
