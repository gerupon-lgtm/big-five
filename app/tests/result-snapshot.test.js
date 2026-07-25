import assert from "node:assert/strict";
import test from "node:test";

import { createResultSnapshot } from "../js/domain/result-snapshot.js";

const FACTOR_IDS = [
  "intellectImagination",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "emotionalStability",
];

const VERSION_FIELDS = [
  "scaleVersion",
  "questionVersion",
  "scoringVersion",
  "resultTextVersion",
  "titleRuleVersion",
  "characterManifestVersion",
  "presentationDefinitionVersion",
  "cardTemplateVersion",
  "appVersion",
];

const PREVIEW_SECTIONS = [
  "titleSubtitle",
  "titleReason",
  "observation",
  "observation",
  "observation",
  "observation",
  "observation",
];

const DETAIL_SECTIONS = [
  "titleSubtitle",
  "titleReason",
  "observation",
  "observation",
  "observation",
  "observation",
  "observation",
  "strength",
  "strength",
  "strength",
  "strength",
  "strength",
  "tradeoff",
  "tradeoff",
  "tradeoff",
  "tradeoff",
  "tradeoff",
  "work",
  "work",
  "work",
  "work",
  "work",
  "relationship",
  "relationship",
  "relationship",
  "relationship",
  "relationship",
  "stress",
  "stress",
  "stress",
  "stress",
  "stress",
  "question",
  "question",
  "question",
  "question",
  "question",
  "action",
  "action",
  "action",
  "action",
  "action",
];

function makeFactors() {
  return FACTOR_IDS.map((factorId) => ({
    factorId,
    rawMean: 3,
    displayScore: 50,
    band: "middle",
    salience: 0,
    directionalSupportCount: 0,
    variance: 0,
  }));
}

function makeRenderedTexts(sections = DETAIL_SECTIONS, version = "result-text-v1") {
  return sections.map((section, index) => ({
    id: `rendered-${index + 1}`,
    version,
    section,
    text: `診断時の表示文 ${index + 1}`,
    evidenceRefs: [`evidence-${index + 1}`],
  }));
}

function makeVersionTuple() {
  return {
    scaleVersion: "ipip-ja-50-v1",
    questionVersion: "ipip-ja-50-question-set-v1",
    scoringVersion: "ipip-ja-50-scoring-v1",
    resultTextVersion: "result-text-v1",
    titleRuleVersion: "title-rule-v1",
    characterManifestVersion: "character-manifest-v1",
    presentationDefinitionVersion: "presentation-v1",
    cardTemplateVersion: "card-template-v1",
    appVersion: "mvp-0.1.0",
  };
}

function makeValidInput() {
  return {
    resultId: "result-1",
    completedAt: "2026-07-25T12:00:00+09:00",
    questionCount: 50,
    mode: "detail50",
    versionTuple: makeVersionTuple(),
    resultModel: {
      factors: makeFactors(),
      titleId: "title-balanced",
      characterId: "character-balanced",
      boundaryFlags: [{
        type: "second-third-salience-near-tie",
        factorIds: ["extraversion", "agreeableness"],
        threshold: 0.1,
        questionCount: 50,
      }],
      renderedTexts: makeRenderedTexts(),
    },
    characterAssetVersion: "character-balanced-asset-v1",
    selectedPaletteId: "palette-default",
    cardTemplateVersion: "card-template-v1",
  };
}

function makePreviewInput() {
  const input = makeValidInput();
  input.questionCount = 20;
  input.mode = "preview20";
  input.resultModel.boundaryFlags[0].threshold = 0.25;
  input.resultModel.boundaryFlags[0].questionCount = 20;
  input.resultModel.renderedTexts = makeRenderedTexts(PREVIEW_SECTIONS);
  return input;
}

function assertDeeplyFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const nestedValue of Object.values(value)) assertDeeplyFrozen(nestedValue);
}

function assertSnapshotInvalid(input, label = undefined) {
  assert.throws(
    () => createResultSnapshot(input),
    (error) => {
      assert.ok(error instanceof TypeError, label);
      assert.equal(error.message, "RESULT_SNAPSHOT_INVALID", label);
      return true;
    },
  );
}

test("T-006 F-006 snapshot preserves displayed content as an isolated immutable copy without answers", () => {
  const input = makeValidInput();
  const before = structuredClone(input);
  const displayedText = input.resultModel.renderedTexts[0].text;

  const snapshot = createResultSnapshot(input);

  assert.deepEqual(Object.keys(snapshot), [
    "resultId",
    "completedAt",
    "questionCount",
    "mode",
    "versionTuple",
    "factors",
    "titleId",
    "characterId",
    "characterAssetVersion",
    "boundaryFlags",
    "renderedTexts",
    "selectedPaletteId",
    "cardTemplateVersion",
  ]);
  assert.equal(snapshot.completedAt, "2026-07-25T12:00:00+09:00");
  assert.equal(snapshot.renderedTexts[0].text, displayedText);
  assert.equal(Object.hasOwn(snapshot, "answers"), false);
  assert.equal(Object.hasOwn(snapshot, "resultModel"), false);
  assert.equal(JSON.stringify(snapshot).includes("\"answers\""), false);
  assert.deepEqual(input, before);
  assert.equal(Object.isFrozen(input), false);
  assert.equal(Object.isFrozen(input.versionTuple), false);
  assert.equal(Object.isFrozen(input.resultModel), false);
  assert.notStrictEqual(snapshot.versionTuple, input.versionTuple);
  assert.notStrictEqual(snapshot.factors, input.resultModel.factors);
  assert.notStrictEqual(snapshot.factors[0], input.resultModel.factors[0]);
  assert.notStrictEqual(snapshot.boundaryFlags, input.resultModel.boundaryFlags);
  assert.notStrictEqual(snapshot.boundaryFlags[0], input.resultModel.boundaryFlags[0]);
  assert.notStrictEqual(snapshot.boundaryFlags[0].factorIds, input.resultModel.boundaryFlags[0].factorIds);
  assert.notStrictEqual(snapshot.renderedTexts, input.resultModel.renderedTexts);
  assert.notStrictEqual(snapshot.renderedTexts[0], input.resultModel.renderedTexts[0]);
  assert.notStrictEqual(snapshot.renderedTexts[0].evidenceRefs, input.resultModel.renderedTexts[0].evidenceRefs);
  assertDeeplyFrozen(snapshot);

  input.versionTuple.resultTextVersion = "result-text-v2";
  input.resultModel.factors[0].rawMean = 4;
  input.resultModel.boundaryFlags[0].factorIds[0] = "intellectImagination";
  input.resultModel.renderedTexts[0].text = "更新後の文章";
  input.resultModel.renderedTexts[0].evidenceRefs.push("late-evidence");
  assert.equal(snapshot.versionTuple.resultTextVersion, "result-text-v1");
  assert.equal(snapshot.factors[0].rawMean, 3);
  assert.deepEqual(snapshot.boundaryFlags[0].factorIds, ["extraversion", "agreeableness"]);
  assert.equal(snapshot.renderedTexts[0].text, displayedText);
  assert.deepEqual(snapshot.renderedTexts[0].evidenceRefs, ["evidence-1"]);
  assert.throws(() => {
    snapshot.renderedTexts[0].text = "late mutation";
  }, TypeError);
});

test("T-006 F-006 accepts the complete preview and detail display shapes", () => {
  const preview = createResultSnapshot(makePreviewInput());
  const detail = createResultSnapshot(makeValidInput());

  assert.equal(preview.renderedTexts.length, 7);
  assert.deepEqual(preview.renderedTexts.map(({ section }) => section), PREVIEW_SECTIONS);
  assert.equal(detail.renderedTexts.length, 42);
  assert.deepEqual(detail.renderedTexts.map(({ section }) => section), DETAIL_SECTIONS);
});

test("T-006 F-006 rejects missing and unknown top-level or result-model fields", () => {
  for (const field of [
    "resultId",
    "completedAt",
    "questionCount",
    "mode",
    "versionTuple",
    "resultModel",
    "characterAssetVersion",
    "selectedPaletteId",
    "cardTemplateVersion",
  ]) {
    const input = makeValidInput();
    delete input[field];
    assertSnapshotInvalid(input, `missing ${field}`);
  }

  assertSnapshotInvalid({ ...makeValidInput(), answers: undefined }, "top-level answers");
  assertSnapshotInvalid({ ...makeValidInput(), domState: { mounted: true } }, "top-level DOM state");
  assertSnapshotInvalid({
    ...makeValidInput(),
    resultModel: { ...makeValidInput().resultModel, definition: {} },
  }, "result-model definition");
  assertSnapshotInvalid(null, "null input");
});

test("T-006 F-006 rejects answers contamination at every result-model depth even when undefined", () => {
  const root = makeValidInput();
  root.resultModel.answers = undefined;

  const factor = makeValidInput();
  factor.resultModel.factors[0].answers = undefined;

  const boundary = makeValidInput();
  boundary.resultModel.boundaryFlags[0].answers = undefined;

  const rendered = makeValidInput();
  rendered.resultModel.renderedTexts[0].answers = undefined;

  const evidenceRecord = makeValidInput();
  evidenceRecord.resultModel.renderedTexts[0].evidenceRefs[0] = { id: "evidence-1", answers: undefined };

  for (const [label, input] of [
    ["result model", root],
    ["factor", factor],
    ["boundary flag", boundary],
    ["rendered text", rendered],
    ["nested evidence record", evidenceRecord],
  ]) {
    assertSnapshotInvalid(input, label);
  }
});

test("T-006 F-006 permits only preview20/20 and detail50/50", () => {
  const cases = [
    { ...makeValidInput(), mode: "preview20" },
    { ...makeValidInput(), questionCount: 20 },
    { ...makeValidInput(), mode: "summary50" },
    { ...makeValidInput(), questionCount: 49 },
    { ...makeValidInput(), questionCount: "50" },
  ];
  for (const input of cases) assertSnapshotInvalid(input);
});

test("T-006 F-006 requires the exact complete nine-field VersionTuple", () => {
  assert.deepEqual(Object.keys(makeVersionTuple()), VERSION_FIELDS);

  for (const field of VERSION_FIELDS) {
    const missing = makeValidInput();
    delete missing.versionTuple[field];
    assertSnapshotInvalid(missing, `missing version ${field}`);

    const empty = makeValidInput();
    empty.versionTuple[field] = "";
    assertSnapshotInvalid(empty, `empty version ${field}`);

    const wrongType = makeValidInput();
    wrongType.versionTuple[field] = 1;
    assertSnapshotInvalid(wrongType, `wrong version type ${field}`);
  }

  const extra = makeValidInput();
  extra.versionTuple.futureVersion = "future-v1";
  assertSnapshotInvalid(extra, "extra version");

  const answers = makeValidInput();
  answers.versionTuple.answers = undefined;
  assertSnapshotInvalid(answers, "answers in version tuple");
});

test("T-006 F-006 preserves coherent historical versions without requiring current AppMeta values", () => {
  const input = makeValidInput();
  input.versionTuple = {
    scaleVersion: "ipip-ja-50-v2",
    questionVersion: "ipip-ja-50-question-set-v2",
    scoringVersion: "ipip-ja-50-scoring-v2",
    resultTextVersion: "result-text-v2",
    titleRuleVersion: "title-rule-v2",
    characterManifestVersion: "character-manifest-v2",
    presentationDefinitionVersion: "presentation-v2",
    cardTemplateVersion: "card-template-v2",
    appVersion: "mvp-0.2.0",
  };
  input.resultModel.renderedTexts = makeRenderedTexts(DETAIL_SECTIONS, "result-text-v2");
  input.cardTemplateVersion = "card-template-v2";

  const snapshot = createResultSnapshot(input);

  assert.deepEqual(snapshot.versionTuple, input.versionTuple);
  assert.equal(snapshot.renderedTexts.every(({ version }) => version === "result-text-v2"), true);
});

test("T-006 F-006 rejects rendered-text and card version mismatches", () => {
  const renderedMismatch = makeValidInput();
  renderedMismatch.resultModel.renderedTexts[0].version = "result-text-v2";
  assertSnapshotInvalid(renderedMismatch, "rendered text mismatch");

  const tupleMismatch = makeValidInput();
  tupleMismatch.versionTuple.resultTextVersion = "result-text-v2";
  assertSnapshotInvalid(tupleMismatch, "tuple text mismatch");

  const cardMismatch = makeValidInput();
  cardMismatch.cardTemplateVersion = "card-template-v2";
  assertSnapshotInvalid(cardMismatch, "card template mismatch");
});

test("T-006 F-006 keeps per-character asset version separate from manifest version", () => {
  const input = makeValidInput();
  input.characterAssetVersion = "character-balanced-asset-v9";
  input.versionTuple.characterManifestVersion = "character-manifest-v3";

  const snapshot = createResultSnapshot(input);

  assert.equal(snapshot.characterAssetVersion, "character-balanced-asset-v9");
  assert.equal(snapshot.versionTuple.characterManifestVersion, "character-manifest-v3");
});

test("T-006 F-006 rejects empty identity, asset, palette, and card strings", () => {
  for (const field of ["resultId", "characterAssetVersion", "selectedPaletteId", "cardTemplateVersion"]) {
    for (const value of ["", null, 1]) {
      const input = makeValidInput();
      input[field] = value;
      assertSnapshotInvalid(input, `${field}=${String(value)}`);
    }
  }

  for (const field of ["titleId", "characterId"]) {
    for (const value of ["", null, 1]) {
      const input = makeValidInput();
      input.resultModel[field] = value;
      assertSnapshotInvalid(input, `${field}=${String(value)}`);
    }
  }
});

test("T-006 F-006 validates completedAt as an existing strict ISO timestamp without normalization", () => {
  for (const completedAt of [
    "",
    "2026-02-30T12:00:00+09:00",
    "2026-07-25 12:00:00+09:00",
    "2026-07-25T12:00:00",
    "2026-07-25T24:00:00+09:00",
    "2026-07-25T12:00:00+24:00",
    1,
  ]) {
    assertSnapshotInvalid({ ...makeValidInput(), completedAt }, String(completedAt));
  }

  const completedAt = "2026-07-25T12:34:56.789+09:00";
  assert.equal(createResultSnapshot({ ...makeValidInput(), completedAt }).completedAt, completedAt);
});

test("T-006 F-006 rejects missing, extra, duplicate, reordered, and unreachable factors", () => {
  const missing = makeValidInput();
  missing.resultModel.factors.pop();

  const extra = makeValidInput();
  extra.resultModel.factors.push({ ...extra.resultModel.factors[0] });

  const duplicate = makeValidInput();
  duplicate.resultModel.factors[1] = { ...duplicate.resultModel.factors[0] };

  const reordered = makeValidInput();
  [reordered.resultModel.factors[0], reordered.resultModel.factors[1]] =
    [reordered.resultModel.factors[1], reordered.resultModel.factors[0]];

  const unknownField = makeValidInput();
  unknownField.resultModel.factors[0].unknown = true;

  const unreachable = makeValidInput();
  unreachable.resultModel.factors[0] = {
    ...unreachable.resultModel.factors[0],
    rawMean: 3.1,
    displayScore: 53,
    salience: 0.1,
    variance: 0,
  };

  for (const [label, input] of [
    ["missing", missing],
    ["extra", extra],
    ["duplicate", duplicate],
    ["reordered", reordered],
    ["unknown field", unknownField],
    ["unreachable", unreachable],
  ]) {
    assertSnapshotInvalid(input, label);
  }
});

test("T-006 F-006 validates boundary flag exact schemas against snapshot questionCount", () => {
  const cases = [];

  const unknown = makeValidInput();
  unknown.resultModel.boundaryFlags[0].unknown = true;
  cases.push(["unknown field", unknown]);

  const wrongThreshold = makeValidInput();
  wrongThreshold.resultModel.boundaryFlags[0].threshold = 0.25;
  cases.push(["wrong threshold", wrongThreshold]);

  const wrongCount = makeValidInput();
  wrongCount.resultModel.boundaryFlags[0].questionCount = 20;
  wrongCount.resultModel.boundaryFlags[0].threshold = 0.25;
  cases.push(["wrong question count", wrongCount]);

  const duplicateIds = makeValidInput();
  duplicateIds.resultModel.boundaryFlags[0].factorIds = ["extraversion", "extraversion"];
  cases.push(["duplicate factor ids", duplicateIds]);

  const invalidType = makeValidInput();
  invalidType.resultModel.boundaryFlags[0].type = "unknown-boundary";
  cases.push(["invalid type", invalidType]);

  for (const [label, input] of cases) assertSnapshotInvalid(input, label);
});

test("T-006 F-006 rejects malformed rendered records and evidence references", () => {
  const cases = [];

  const missing = makeValidInput();
  delete missing.resultModel.renderedTexts[0].text;
  cases.push(["missing field", missing]);

  const claimKind = makeValidInput();
  claimKind.resultModel.renderedTexts[0].claimKind = "scaleObservation";
  cases.push(["claim kind", claimKind]);

  const appliesTo = makeValidInput();
  appliesTo.resultModel.renderedTexts[0].appliesTo = { mode: "detail50" };
  cases.push(["applies to", appliesTo]);

  const emptyId = makeValidInput();
  emptyId.resultModel.renderedTexts[0].id = "";
  cases.push(["empty id", emptyId]);

  const wrongText = makeValidInput();
  wrongText.resultModel.renderedTexts[0].text = null;
  cases.push(["wrong text", wrongText]);

  const wrongSection = makeValidInput();
  wrongSection.resultModel.renderedTexts[0].section = "summary";
  cases.push(["wrong section", wrongSection]);

  const emptyEvidence = makeValidInput();
  emptyEvidence.resultModel.renderedTexts[0].evidenceRefs = [];
  cases.push(["empty evidence", emptyEvidence]);

  const blankEvidence = makeValidInput();
  blankEvidence.resultModel.renderedTexts[0].evidenceRefs = [""];
  cases.push(["blank evidence", blankEvidence]);

  const duplicateEvidence = makeValidInput();
  duplicateEvidence.resultModel.renderedTexts[0].evidenceRefs = ["evidence-1", "evidence-1"];
  cases.push(["duplicate evidence", duplicateEvidence]);

  const duplicateRenderedId = makeValidInput();
  duplicateRenderedId.resultModel.renderedTexts[1].id = duplicateRenderedId.resultModel.renderedTexts[0].id;
  cases.push(["duplicate rendered id", duplicateRenderedId]);

  for (const [label, input] of cases) assertSnapshotInvalid(input, label);
});

test("T-006 F-006 rejects hidden, symbolic, and array-attached nested fields", () => {
  const hidden = makeValidInput();
  Object.defineProperty(hidden.resultModel.factors[0], "unknown", {
    enumerable: false,
    value: true,
  });

  const symbolic = makeValidInput();
  symbolic.resultModel.renderedTexts[0][Symbol("unknown")] = true;

  const arrayAttached = makeValidInput();
  arrayAttached.resultModel.renderedTexts[0].evidenceRefs.unknown = true;

  const hiddenArrayAttached = makeValidInput();
  Object.defineProperty(hiddenArrayAttached.resultModel.renderedTexts[0].evidenceRefs, "unknown", {
    enumerable: false,
    value: true,
  });

  for (const [label, input] of [
    ["hidden factor field", hidden],
    ["symbolic rendered field", symbolic],
    ["array-attached evidence field", arrayAttached],
    ["hidden array-attached evidence field", hiddenArrayAttached],
  ]) {
    assertSnapshotInvalid(input, label);
  }
});

test("T-006 F-006 rejects incomplete or reordered mode-specific displayed content", () => {
  const shortPreview = makePreviewInput();
  shortPreview.resultModel.renderedTexts.pop();

  const extraPreview = makePreviewInput();
  extraPreview.resultModel.renderedTexts.push({
    id: "rendered-extra",
    version: "result-text-v1",
    section: "observation",
    text: "余分な表示文",
    evidenceRefs: ["evidence-extra"],
  });

  const reorderedPreview = makePreviewInput();
  [reorderedPreview.resultModel.renderedTexts[0], reorderedPreview.resultModel.renderedTexts[2]] =
    [reorderedPreview.resultModel.renderedTexts[2], reorderedPreview.resultModel.renderedTexts[0]];

  const shortDetail = makeValidInput();
  shortDetail.resultModel.renderedTexts.pop();

  const reorderedDetail = makeValidInput();
  [reorderedDetail.resultModel.renderedTexts[7], reorderedDetail.resultModel.renderedTexts[12]] =
    [reorderedDetail.resultModel.renderedTexts[12], reorderedDetail.resultModel.renderedTexts[7]];

  for (const [label, input] of [
    ["short preview", shortPreview],
    ["extra preview", extraPreview],
    ["reordered preview", reorderedPreview],
    ["short detail", shortDetail],
    ["reordered detail", reorderedDetail],
  ]) {
    assertSnapshotInvalid(input, label);
  }
});

test("T-006 F-006 keeps diagnosis-time text after current definitions change", () => {
  const input = makeValidInput();
  const snapshot = createResultSnapshot(input);
  const currentDefinitions = input.resultModel.renderedTexts.map((record) => ({
    ...record,
    text: `更新後: ${record.text}`,
  }));

  assert.notEqual(snapshot.renderedTexts[0].text, currentDefinitions[0].text);
  assert.equal(snapshot.renderedTexts[0].text, "診断時の表示文 1");
});

test("T-006 F-006 normalizes accessor and exotic-record failures to RESULT_SNAPSHOT_INVALID", () => {
  const accessor = makeValidInput();
  Object.defineProperty(accessor, "resultId", {
    enumerable: true,
    get() {
      throw new Error("getter must not escape");
    },
  });
  assertSnapshotInvalid(accessor, "accessor");

  const inherited = Object.create({ resultId: "inherited-result" });
  Object.assign(inherited, makeValidInput());
  delete inherited.resultId;
  assertSnapshotInvalid(inherited, "inherited");
});
