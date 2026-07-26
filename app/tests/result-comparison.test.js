import assert from "node:assert/strict";
import test from "node:test";

import { FACTOR_ORDER } from "../js/data/factor-order.js";
import { COMPARE_ERROR, compareResultSnapshots } from "../js/domain/result-comparison.js";
import { createResultSnapshot } from "../js/domain/result-snapshot.js";

const DETAIL_SECTIONS = [
  "titleSubtitle", "titleReason",
  ...["observation", "strength", "tradeoff", "work", "relationship", "stress", "question", "action"]
    .flatMap((section) => FACTOR_ORDER.map(() => section)),
];
const PREVIEW_SECTIONS = ["titleSubtitle", "titleReason", ...FACTOR_ORDER.map(() => "observation")];
const VERSION_TUPLE = Object.freeze({
  scaleVersion: "ipip-ja-50-v1",
  questionVersion: "ipip-ja-50-question-set-v1",
  scoringVersion: "ipip-ja-50-scoring-v1",
  resultTextVersion: "result-text-v1",
  titleRuleVersion: "title-rule-v1",
  characterManifestVersion: "character-manifest-v1",
  presentationDefinitionVersion: "presentation-v1",
  cardTemplateVersion: "card-template-v1",
  appVersion: "mvp-0.1.0",
});

function factorResult(factorId, rawMean, questionCount) {
  const itemCount = questionCount / FACTOR_ORDER.length;
  const band = rawMean >= 3.5 ? "high" : rawMean <= 2.5 ? "low" : "middle";
  return {
    factorId,
    rawMean,
    displayScore: (rawMean - 1) * 25,
    band,
    salience: Math.abs(rawMean - 3),
    directionalSupportCount: band === "middle" ? 0 : itemCount,
    variance: 0,
  };
}

function renderedTexts(factors, mode, version) {
  const sections = mode === "preview20" ? PREVIEW_SECTIONS : DETAIL_SECTIONS;
  return sections.map((section, index) => {
    if (index === 0) return { id: "title-balanced-subtitle", version, section, text: "subtitle", evidenceRefs: ["e-1"] };
    if (index === 1) return { id: "title-balanced-reason", version, section, text: "reason", evidenceRefs: ["e-2"] };
    const factor = factors[(index - 2) % FACTOR_ORDER.length];
    return {
      id: `${mode}-${factor.factorId}-${factor.band}-${section}`,
      version,
      section,
      text: `${section}-${factor.factorId}`,
      evidenceRefs: [`e-${index + 1}`],
    };
  });
}

function makeSnapshot({
  resultId,
  completedAt = "2026-07-25T12:00:00+09:00",
  questionCount = 50,
  versionTuple = VERSION_TUPLE,
  rawMeans = [3, 3, 3, 3, 3],
} = {}) {
  const mode = questionCount === 20 ? "preview20" : "detail50";
  const factors = FACTOR_ORDER.map((factorId, index) => factorResult(factorId, rawMeans[index], questionCount));
  return createResultSnapshot({
    resultId,
    completedAt,
    questionCount,
    mode,
    versionTuple: { ...versionTuple },
    resultModel: {
      factors,
      titleId: "title-balanced",
      characterId: "character-balanced",
      boundaryFlags: [],
      renderedTexts: renderedTexts(factors, mode, versionTuple.resultTextVersion),
    },
    characterAssetVersion: "character-balanced-asset-v1",
    selectedPaletteId: "palette-default",
    cardTemplateVersion: versionTuple.cardTemplateVersion,
  });
}

function changedVersion(field) {
  return { ...VERSION_TUPLE, [field]: `${VERSION_TUPLE[field]}-changed` };
}

function assertDeeplyFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const nested of Object.values(value)) assertDeeplyFrozen(nested);
}

test("T-006 F-010/F-015 compares compatible snapshots chronologically and by FACTOR_ORDER", () => {
  const first = makeSnapshot({
    resultId: "00000000-0000-4000-8000-000000000002",
    completedAt: "2026-07-25T10:00:00+09:00",
    rawMeans: [3, 4, 2, 3, 4],
  });
  const second = makeSnapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
    completedAt: "2026-07-25T02:30:00+00:00",
    rawMeans: [4, 3, 2, 4, 3],
  });

  const comparison = compareResultSnapshots(second, first);

  assert.deepEqual(comparison, {
    compatible: true,
    beforeResultId: first.resultId,
    afterResultId: second.resultId,
    beforeCompletedAt: first.completedAt,
    afterCompletedAt: second.completedAt,
    factorDeltas: [
      { factorId: "intellectImagination", beforeRawMean: 3, afterRawMean: 4, deltaRawMean: 1 },
      { factorId: "conscientiousness", beforeRawMean: 4, afterRawMean: 3, deltaRawMean: -1 },
      { factorId: "extraversion", beforeRawMean: 2, afterRawMean: 2, deltaRawMean: 0 },
      { factorId: "agreeableness", beforeRawMean: 3, afterRawMean: 4, deltaRawMean: 1 },
      { factorId: "emotionalStability", beforeRawMean: 4, afterRawMean: 3, deltaRawMean: -1 },
    ],
  });
  assertDeeplyFrozen(comparison);
  assert.equal(Object.hasOwn(comparison, "before"), false);
  assert.equal(Object.hasOwn(comparison, "answers"), false);
});

test("T-006 F-010/F-015 orders an equal instant by resultId", () => {
  const laterId = makeSnapshot({
    resultId: "00000000-0000-4000-8000-000000000010",
    completedAt: "2026-07-25T03:00:00Z",
  });
  const earlierId = makeSnapshot({
    resultId: "00000000-0000-4000-8000-000000000001",
    completedAt: "2026-07-25T12:00:00+09:00",
  });
  const comparison = compareResultSnapshots(laterId, earlierId);

  assert.equal(comparison.beforeResultId, earlierId.resultId);
  assert.equal(comparison.afterResultId, laterId.resultId);
});

test("T-006 F-010/F-015 reports each compatibility mismatch in precedence order", () => {
  const first = makeSnapshot({ resultId: "00000000-0000-4000-8000-000000000001" });
  const cases = [
    ["scaleVersion", COMPARE_ERROR.SCALE_MISMATCH],
    ["questionVersion", COMPARE_ERROR.QUESTION_VERSION_MISMATCH],
    ["scoringVersion", COMPARE_ERROR.SCORING_VERSION_MISMATCH],
  ];
  for (const [field, code] of cases) {
    const second = makeSnapshot({
      resultId: "00000000-0000-4000-8000-000000000002",
      versionTuple: changedVersion(field),
    });
    assert.deepEqual(compareResultSnapshots(first, second), { compatible: false, code });
  }

  const preview = makeSnapshot({
    resultId: "00000000-0000-4000-8000-000000000003",
    questionCount: 20,
  });
  assert.deepEqual(compareResultSnapshots(first, preview), {
    compatible: false,
    code: COMPARE_ERROR.QUESTION_COUNT_MISMATCH,
  });
});

test("T-006 F-010/F-015 treats invalid snapshots, invalid scores, and duplicate IDs as SCORE_INVALID", () => {
  const first = makeSnapshot({ resultId: "00000000-0000-4000-8000-000000000001" });
  const second = makeSnapshot({ resultId: "00000000-0000-4000-8000-000000000002" });
  const invalidScore = structuredClone(second);
  invalidScore.factors[0].rawMean = Number.NaN;
  const duplicateId = structuredClone(second);
  duplicateId.resultId = first.resultId;

  for (const snapshot of [null, invalidScore, duplicateId]) {
    assert.deepEqual(compareResultSnapshots(first, snapshot), {
      compatible: false,
      code: COMPARE_ERROR.SCORE_INVALID,
    });
  }
});

test("T-006 F-010/F-015 does not require scaleId and leaves inputs untouched", () => {
  const first = makeSnapshot({ resultId: "00000000-0000-4000-8000-000000000001" });
  const second = makeSnapshot({ resultId: "00000000-0000-4000-8000-000000000002" });
  const firstBefore = structuredClone(first);
  const secondBefore = structuredClone(second);

  const comparison = compareResultSnapshots(first, second);

  assert.equal(comparison.compatible, true);
  assert.equal(Object.hasOwn(first.versionTuple, "scaleId"), false);
  assert.deepEqual(first, firstBefore);
  assert.deepEqual(second, secondBefore);
  assert.equal(Object.isFrozen(COMPARE_ERROR), true);
});
