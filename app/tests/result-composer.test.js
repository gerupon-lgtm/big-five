import test from "node:test";
import assert from "node:assert/strict";

import { ResultTextDefinitions } from "../js/data/result-text-definitions.js";
import { composeResultTexts } from "../js/domain/result-composer.js";

const TITLE_ID = "title-pair-intellectImagination-high--extraversion-low";

const PREVIEW_IDS = [
  "title-pair-intellectImagination-high--extraversion-low-subtitle",
  "title-pair-intellectImagination-high--extraversion-low-reason",
  "preview20-intellectImagination-high-observation",
  "preview20-conscientiousness-middle-observation",
  "preview20-extraversion-low-observation",
  "preview20-agreeableness-middle-observation",
  "preview20-emotionalStability-high-observation",
];

const DETAIL_IDS = [
  "title-pair-intellectImagination-high--extraversion-low-subtitle",
  "title-pair-intellectImagination-high--extraversion-low-reason",
  "detail50-intellectImagination-high-observation",
  "detail50-conscientiousness-middle-observation",
  "detail50-extraversion-low-observation",
  "detail50-agreeableness-middle-observation",
  "detail50-emotionalStability-high-observation",
  "detail50-intellectImagination-high-strength",
  "detail50-conscientiousness-middle-strength",
  "detail50-extraversion-low-strength",
  "detail50-agreeableness-middle-strength",
  "detail50-emotionalStability-high-strength",
  "detail50-intellectImagination-high-tradeoff",
  "detail50-conscientiousness-middle-tradeoff",
  "detail50-extraversion-low-tradeoff",
  "detail50-agreeableness-middle-tradeoff",
  "detail50-emotionalStability-high-tradeoff",
  "detail50-intellectImagination-high-work",
  "detail50-conscientiousness-middle-work",
  "detail50-extraversion-low-work",
  "detail50-agreeableness-middle-work",
  "detail50-emotionalStability-high-work",
  "detail50-intellectImagination-high-relationship",
  "detail50-conscientiousness-middle-relationship",
  "detail50-extraversion-low-relationship",
  "detail50-agreeableness-middle-relationship",
  "detail50-emotionalStability-high-relationship",
  "detail50-intellectImagination-high-stress",
  "detail50-conscientiousness-middle-stress",
  "detail50-extraversion-low-stress",
  "detail50-agreeableness-middle-stress",
  "detail50-emotionalStability-high-stress",
  "detail50-intellectImagination-high-question",
  "detail50-conscientiousness-middle-question",
  "detail50-extraversion-low-question",
  "detail50-agreeableness-middle-question",
  "detail50-emotionalStability-high-question",
  "detail50-intellectImagination-high-action",
  "detail50-conscientiousness-middle-action",
  "detail50-extraversion-low-action",
  "detail50-agreeableness-middle-action",
  "detail50-emotionalStability-high-action",
];

function makeFactor(factorId, band, rawMean, itemCount) {
  return {
    factorId,
    rawMean,
    displayScore: Math.round(((rawMean - 1) / 4) * 100),
    band,
    salience: Math.abs(rawMean - 3),
    directionalSupportCount: band === "middle" ? 0 : itemCount,
    variance: 0,
  };
}

function makeFactors(itemCount) {
  return [
    makeFactor("intellectImagination", "high", 4, itemCount),
    makeFactor("conscientiousness", "middle", 3, itemCount),
    makeFactor("extraversion", "low", 2, itemCount),
    makeFactor("agreeableness", "middle", 3, itemCount),
    makeFactor("emotionalStability", "high", 4, itemCount),
  ];
}

function cloneDefinition(definition, version = definition.version) {
  return {
    ...definition,
    version,
    appliesTo: { ...definition.appliesTo },
    evidenceRefs: [...definition.evidenceRefs],
  };
}

function previewDefinitions(version = "result-text-v1") {
  return PREVIEW_IDS.map((id) => {
    const definition = ResultTextDefinitions.find((candidate) => candidate.id === id);
    assert.ok(definition, `missing test fixture definition: ${id}`);
    return cloneDefinition(definition, version);
  });
}

function previewInput(overrides = {}) {
  return {
    definitions: ResultTextDefinitions,
    version: "result-text-v1",
    mode: "preview20",
    questionCount: 20,
    factors: makeFactors(4),
    titleId: TITLE_ID,
    ...overrides,
  };
}

function detailInput(overrides = {}) {
  return {
    definitions: ResultTextDefinitions,
    version: "result-text-v1",
    mode: "detail50",
    questionCount: 50,
    factors: makeFactors(10),
    titleId: TITLE_ID,
    ...overrides,
  };
}

function assertCompositionInvalid(input) {
  let thrown;
  try {
    composeResultTexts(input);
  } catch (error) {
    thrown = error;
  }
  assert.ok(thrown instanceof TypeError);
  assert.equal(thrown.message, "RESULT_COMPOSITION_INVALID");
}

test("T-005 F-006 preview composes the production title and observations in canonical order", () => {
  const rendered = composeResultTexts(previewInput());

  assert.equal(rendered.length, 7);
  assert.deepEqual(rendered.map(({ id }) => id), PREVIEW_IDS);
  assert.deepEqual(rendered.map(({ section }) => section), [
    "titleSubtitle",
    "titleReason",
    "observation",
    "observation",
    "observation",
    "observation",
    "observation",
  ]);
  assert.deepEqual(rendered[0], {
    id: "title-pair-intellectImagination-high--extraversion-low-subtitle",
    version: "result-text-v1",
    section: "titleSubtitle",
    text: "静かな環境で考えを深める思索派",
    evidenceRefs: ["evidence-title-rule-v1"],
  });
});

test("T-005 F-006 detail composes all forty factor records in section then factor order", () => {
  const rendered = composeResultTexts(detailInput());

  assert.equal(rendered.length, 42);
  assert.deepEqual(rendered.map(({ id }) => id), DETAIL_IDS);
  assert.equal(rendered.filter(({ section }) => section === "action").length, 5);
});

test("T-005 F-006 renders only snapshot fields and deeply freezes copied output", () => {
  const definitions = previewDefinitions();
  const factors = makeFactors(4);
  const input = previewInput({ definitions, factors });
  const definitionsBefore = structuredClone(definitions);
  const factorsBefore = structuredClone(factors);

  const rendered = composeResultTexts(input);

  assert.deepEqual(definitions, definitionsBefore);
  assert.deepEqual(factors, factorsBefore);
  assert.equal(Object.isFrozen(input), false);
  assert.equal(Object.isFrozen(definitions), false);
  assert.equal(Object.isFrozen(definitions[0]), false);
  assert.equal(Object.isFrozen(definitions[0].evidenceRefs), false);
  assert.equal(Object.isFrozen(factors), false);
  assert.equal(Object.isFrozen(factors[0]), false);

  assert.equal(Object.isFrozen(rendered), true);
  for (const record of rendered) {
    assert.deepEqual(Object.keys(record), ["id", "version", "section", "text", "evidenceRefs"]);
    assert.equal(Object.isFrozen(record), true);
    assert.equal(Object.isFrozen(record.evidenceRefs), true);
    assert.equal(Object.hasOwn(record, "claimKind"), false);
    assert.equal(Object.hasOwn(record, "appliesTo"), false);
    assert.equal(Object.hasOwn(record, "previewAllowed"), false);
  }

  const source = definitions.find(({ id }) => id === rendered[0].id);
  assert.notStrictEqual(rendered[0], source);
  assert.notStrictEqual(rendered[0].evidenceRefs, source.evidenceRefs);
  assert.throws(() => rendered.push(rendered[0]), TypeError);
  assert.throws(() => rendered[0].evidenceRefs.push("late-evidence"), TypeError);
  assert.throws(() => {
    rendered[0].text = "late text";
  }, TypeError);

  const renderedText = rendered[0].text;
  const renderedEvidence = [...rendered[0].evidenceRefs];
  source.text = "mutated input";
  source.evidenceRefs.push("mutated-input-evidence");
  factors[0].band = "low";
  assert.equal(rendered[0].text, renderedText);
  assert.deepEqual(rendered[0].evidenceRefs, renderedEvidence);
});

test("T-005 F-006 accepts a coherent requested definition version instead of hard-coding v1", () => {
  const version = "result-text-v2";
  const rendered = composeResultTexts(previewInput({
    definitions: previewDefinitions(version),
    version,
  }));

  assert.deepEqual(rendered.map(({ id }) => id), PREVIEW_IDS);
  assert.equal(rendered.every((record) => record.version === version), true);
});

test("T-005 F-006 rejects unknown top-level fields and mode/count mismatches", () => {
  assertCompositionInvalid({ ...previewInput(), answers: [1, 2, 3] });
  assertCompositionInvalid(previewInput({
    mode: "preview20",
    questionCount: 50,
    factors: makeFactors(10),
  }));
  assertCompositionInvalid(detailInput({
    mode: "detail50",
    questionCount: 20,
    factors: makeFactors(4),
  }));
  assertCompositionInvalid(previewInput({ mode: "summary20" }));
});

test("T-005 F-006 rejects missing, excess, duplicate, reordered, unknown, and invalid factors", () => {
  const missing = makeFactors(4).slice(0, 4);
  const excess = [...makeFactors(4), { ...makeFactors(4)[0] }];
  const duplicate = makeFactors(4);
  duplicate[1] = { ...duplicate[0] };
  const reordered = makeFactors(4);
  [reordered[0], reordered[1]] = [reordered[1], reordered[0]];
  const unknown = makeFactors(4);
  unknown[0] = { ...unknown[0], factorId: "unknownFactor" };
  const invalid = makeFactors(4);
  invalid[0] = { ...invalid[0], variance: 0.25 };

  for (const factors of [missing, excess, duplicate, reordered, unknown, invalid]) {
    assertCompositionInvalid(previewInput({ factors }));
  }
});

test("T-005 F-006 rejects unknown titles and missing or duplicate matched records", () => {
  assertCompositionInvalid(previewInput({ titleId: "title-unknown" }));

  const missingTitle = previewDefinitions().filter(({ section }) => section !== "titleReason");
  assertCompositionInvalid(previewInput({ definitions: missingTitle }));

  const duplicateTitle = previewDefinitions();
  const titleReason = duplicateTitle.find(({ section }) => section === "titleReason");
  duplicateTitle.push({ ...cloneDefinition(titleReason), id: "duplicate-title-reason" });
  assertCompositionInvalid(previewInput({ definitions: duplicateTitle }));

  const missingFactor = previewDefinitions().filter(
    ({ id }) => id !== "preview20-extraversion-low-observation",
  );
  assertCompositionInvalid(previewInput({ definitions: missingFactor }));

  const duplicateFactor = previewDefinitions();
  const observation = duplicateFactor.find(
    ({ id }) => id === "preview20-intellectImagination-high-observation",
  );
  duplicateFactor.push({ ...cloneDefinition(observation), id: "duplicate-factor-observation" });
  assertCompositionInvalid(previewInput({ definitions: duplicateFactor }));
});

test("T-005 F-006 rejects mismatched and mixed definition versions", () => {
  assertCompositionInvalid(previewInput({
    definitions: previewDefinitions("result-text-v2"),
  }));

  const mixed = previewDefinitions();
  mixed[0].version = "result-text-v2";
  assertCompositionInvalid(previewInput({ definitions: mixed }));
});

test("T-005 F-006 normalizes definition-selection failures to the composition error code", () => {
  const malformed = previewDefinitions();
  malformed[0].unknown = true;
  assertCompositionInvalid(previewInput({ definitions: malformed }));

  const duplicateId = previewDefinitions();
  duplicateId[1].id = duplicateId[0].id;
  assertCompositionInvalid(previewInput({ definitions: duplicateId }));
});
