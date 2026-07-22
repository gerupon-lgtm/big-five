import assert from "node:assert/strict";
import test from "node:test";

import { QuestionDefinitions } from "../js/data/diagnostic-definition.js";
import { appMeta } from "../js/config/app-meta.js";
import { FactorOrderDefinition } from "../js/data/factor-order.js";
import { scoreDiagnostic } from "../js/domain/scoring.js";
import {
  TitleProfileDefinitions,
  validateTitleProfileDefinitions,
} from "../js/data/title-profile-definitions.js";
import { classifyTitle } from "../js/domain/title-classifier.js";
import { composeResultModel } from "../js/domain/result-model.js";
import {
  selectResultTextDefinitions,
  validateResultTextDefinitions,
} from "../js/domain/result-text.js";

const FACTOR_ORDER = [
  "intellectImagination",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "emotionalStability",
];

function answersWith(value) {
  return Object.fromEntries(QuestionDefinitions.map(({ id }) => [id, value]));
}

function answersFromKeyedValues(valuesByFactor) {
  const factorIndexes = new Map();
  return Object.fromEntries(QuestionDefinitions.map((question) => {
    const index = factorIndexes.get(question.factorId) ?? 0;
    factorIndexes.set(question.factorId, index + 1);
    const keyedValue = valuesByFactor[question.factorId][index];
    return [question.id, question.keyedDirection === "negative" ? 6 - keyedValue : keyedValue];
  }));
}

function result(factorId, rawMean, {
  directionalSupportCount = 0,
  variance = 0,
} = {}) {
  const band = rawMean >= 3.5 ? "high" : rawMean <= 2.5 ? "low" : "middle";
  return {
    factorId,
    rawMean,
    displayScore: Math.floor((((rawMean - 1) * 25) + 0.5) + 1e-10),
    band,
    salience: Math.abs(rawMean - 3),
    directionalSupportCount: band === "middle" ? 0 : directionalSupportCount,
    variance,
  };
}

function factorResults(rawMeans, optionsByFactor = {}) {
  return FACTOR_ORDER.map((factorId, index) => result(
    factorId,
    rawMeans[index],
    optionsByFactor[factorId],
  ));
}

test("T-003 F-005 scores positive and reverse answers as five complete factor results", () => {
  const allOne = scoreDiagnostic({
    questionDefinitions: QuestionDefinitions,
    answers: answersWith(1),
    questionCount: 50,
  });
  const allFive = scoreDiagnostic({
    questionDefinitions: QuestionDefinitions,
    answers: answersWith(5),
    questionCount: 50,
  });

  assert.equal(allOne.length, 5);
  assert.equal(allFive.length, 5);
  assert.deepEqual(allOne.map(({ factorId, rawMean }) => [factorId, rawMean]), [
    ["intellectImagination", 2.2],
    ["conscientiousness", 2.6],
    ["extraversion", 3],
    ["agreeableness", 2.6],
    ["emotionalStability", 4.2],
  ]);
  assert.deepEqual(allFive.map(({ factorId, rawMean }) => [factorId, rawMean]), [
    ["intellectImagination", 3.8],
    ["conscientiousness", 3.4],
    ["extraversion", 3],
    ["agreeableness", 3.4],
    ["emotionalStability", 1.8],
  ]);
  assert.equal(allOne[0].displayScore, 30);
  assert.equal(allFive[0].displayScore, 70);
});

test("T-003 F-005 rounds rational half scores upward without floating point drift", () => {
  const factors = scoreDiagnostic({
    questionDefinitions: QuestionDefinitions,
    answers: answersFromKeyedValues({
      intellectImagination: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      conscientiousness: [2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
      extraversion: [3, 3, 3, 3, 3, 3, 3, 4, 4, 4],
      agreeableness: [4, 4, 4, 4, 4, 4, 4, 4, 4, 5],
      emotionalStability: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    }),
    questionCount: 50,
  });

  assert.deepEqual(factors.map(({ rawMean, displayScore }) => [rawMean, displayScore]), [
    [1.9, 23],
    [2.3, 33],
    [3.3, 58],
    [4.1, 78],
    [3, 50],
  ]);
});

test("T-003 F-005 converts every answer value with the keyed direction and honors exact bands", () => {
  for (const answer of [1, 2, 3, 4, 5]) {
    const answers = answersWith(3);
    for (const question of QuestionDefinitions.filter(({ factorId }) => factorId === "extraversion")) {
      answers[question.id] = question.keyedDirection === "positive" ? answer : 6 - answer;
    }
    const factors = scoreDiagnostic({
      questionDefinitions: QuestionDefinitions,
      answers,
      questionCount: 50,
    });
    assert.equal(factors.find(({ factorId }) => factorId === "extraversion").rawMean, answer);
  }

  const exactBoundary = classifyTitle({
    factorResults: factorResults([2.5, 3.5, 2.5001, 3.4999, 3], {
      intellectImagination: { directionalSupportCount: 2 },
      conscientiousness: { directionalSupportCount: 4 },
    }),
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });
  assert.deepEqual(exactBoundary.selectedFactors, [
    { factorId: "conscientiousness", direction: "high" },
    { factorId: "intellectImagination", direction: "low" },
  ]);
});

test("T-003 F-005 rejects incomplete, invalid, and unsupported score inputs explicitly", () => {
  const missing = answersWith(3);
  delete missing[QuestionDefinitions[0].id];
  const inheritedAnswers = Object.create(answersWith(3));
  const nullQuestionDefinitions = [...QuestionDefinitions];
  nullQuestionDefinitions[0] = null;
  const unknownInsteadOfExpected = answersWith(3);
  delete unknownInsteadOfExpected[QuestionDefinitions[0].id];
  unknownInsteadOfExpected.unknownQuestion = 3;

  assert.throws(() => scoreDiagnostic({
    questionDefinitions: QuestionDefinitions,
    answers: missing,
    questionCount: 50,
  }), /SCORING_INPUT_INVALID/);
  assert.throws(() => scoreDiagnostic({
    questionDefinitions: QuestionDefinitions,
    answers: { ...answersWith(3), [QuestionDefinitions[0].id]: 6 },
    questionCount: 50,
  }), /SCORING_INPUT_INVALID/);
  assert.throws(() => scoreDiagnostic({
    questionDefinitions: QuestionDefinitions,
    answers: answersWith(3),
    questionCount: 21,
  }), /SCORING_INPUT_INVALID/);
  assert.throws(() => scoreDiagnostic({
    questionDefinitions: nullQuestionDefinitions,
    answers: answersWith(3),
    questionCount: 50,
  }), /SCORING_INPUT_INVALID/);
  assert.throws(() => scoreDiagnostic({
    questionDefinitions: QuestionDefinitions,
    answers: inheritedAnswers,
    questionCount: 50,
  }), /SCORING_INPUT_INVALID/);
  assert.throws(() => scoreDiagnostic({
    questionDefinitions: QuestionDefinitions,
    answers: unknownInsteadOfExpected,
    questionCount: 50,
  }), /SCORING_INPUT_INVALID/);
});

test("T-003 F-016 exposes exactly one immutable title profile for every 40 + 10 + 1 combination", () => {
  const profiles = validateTitleProfileDefinitions(TitleProfileDefinitions);
  const counts = profiles.reduce((all, profile) => ({
    ...all,
    [profile.kind]: (all[profile.kind] ?? 0) + 1,
  }), {});

  assert.deepEqual(counts, { balanced: 1, single: 10, pair: 40 });
  assert.equal(new Set(profiles.map(({ titleId }) => titleId)).size, 51);
  assert.equal(new Set(profiles.map(({ characterId }) => characterId)).size, 51);
  assert.equal(Object.isFrozen(profiles), true);
  assert.equal(Object.isFrozen(profiles[0]), true);
  assert.equal(Object.isFrozen(profiles[0].factors), true);

  const profileKeys = profiles.map(({ kind, factors }) => `${kind}:${factors.map(({ factorId, direction }) => `${factorId}/${direction}`).join(",")}`);
  assert.equal(new Set(profileKeys).size, 51);
});

test("T-003 F-016 rejects duplicate, missing, and unknown title profile combinations", () => {
  const duplicate = structuredClone(TitleProfileDefinitions);
  duplicate[1].factors = structuredClone(duplicate[2].factors);
  const missing = structuredClone(TitleProfileDefinitions).slice(1);
  const unknown = structuredClone(TitleProfileDefinitions);
  unknown[1].factors[0].factorId = "unknown";

  assert.throws(() => validateTitleProfileDefinitions(duplicate), /TITLE_PROFILE_INVALID/);
  assert.throws(() => validateTitleProfileDefinitions(missing), /TITLE_PROFILE_INVALID/);
  assert.throws(() => validateTitleProfileDefinitions(unknown), /TITLE_PROFILE_INVALID/);
});

test("T-003 F-016 title-rule-v1 resolves 0, 1, 2, and 3+ salient factors without using display integers", () => {
  const balanced = classifyTitle({
    factorResults: factorResults([3, 3, 3, 3, 3]),
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });
  const single = classifyTitle({
    factorResults: factorResults([3, 4, 3, 3, 3], { conscientiousness: { directionalSupportCount: 4 } }),
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });
  const pair = classifyTitle({
    factorResults: factorResults([1, 4, 3, 3, 3], {
      intellectImagination: { directionalSupportCount: 4 },
      conscientiousness: { directionalSupportCount: 4 },
    }),
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });
  const threePlus = classifyTitle({
    factorResults: factorResults([1, 4, 5, 3, 3], {
      intellectImagination: { directionalSupportCount: 8 },
      conscientiousness: { directionalSupportCount: 6 },
      extraversion: { directionalSupportCount: 10 },
    }),
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });

  assert.equal(balanced.kind, "balanced");
  assert.equal(single.kind, "single");
  assert.equal(pair.kind, "pair");
  assert.deepEqual(pair.selectedFactors.map(({ factorId }) => factorId), ["intellectImagination", "conscientiousness"]);
  assert.deepEqual(threePlus.selectedFactors.map(({ factorId }) => factorId), ["extraversion", "intellectImagination"]);
  assert.match(balanced.characterId, /^character-/);
  assert.equal(balanced.titleRuleVersion, appMeta.diagnosticVersions.titleRuleVersion);
  assert.deepEqual(FactorOrderDefinition, {
    version: "factor-order-v1",
    factorIds: FACTOR_ORDER,
  });
});

test("T-003 F-016 title-rule-v1 applies support, variance, and fixed factor order as successive tie breaks", () => {
  const support = classifyTitle({
    factorResults: factorResults([4, 4, 3, 3, 3], {
      intellectImagination: { directionalSupportCount: 2 },
      conscientiousness: { directionalSupportCount: 3 },
    }),
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });
  const variance = classifyTitle({
    factorResults: factorResults([4, 4, 3, 3, 3], {
      intellectImagination: { directionalSupportCount: 3, variance: 0.5 },
      conscientiousness: { directionalSupportCount: 3, variance: 0.25 },
    }),
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });
  const fixedOrder = classifyTitle({
    factorResults: factorResults([4, 4, 3, 3, 3], {
      intellectImagination: { directionalSupportCount: 3, variance: 0.25 },
      conscientiousness: { directionalSupportCount: 3, variance: 0.25 },
    }),
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });

  assert.deepEqual(support.selectedFactors.map(({ factorId }) => factorId), ["conscientiousness", "intellectImagination"]);
  assert.deepEqual(variance.selectedFactors.map(({ factorId }) => factorId), ["conscientiousness", "intellectImagination"]);
  assert.deepEqual(fixedOrder.selectedFactors.map(({ factorId }) => factorId), ["intellectImagination", "conscientiousness"]);
});

test("T-003 F-016 treats real-answer salience 1.7 and 4.3 as tied before support", () => {
  const classification = classifyTitle({
    factorResults: factorResults([1.7, 4.3, 3, 3, 3], {
      intellectImagination: { directionalSupportCount: 2 },
      conscientiousness: { directionalSupportCount: 4 },
    }),
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });

  assert.deepEqual(classification.selectedFactors.map(({ factorId }) => factorId), [
    "conscientiousness",
    "intellectImagination",
  ]);
});

test("T-003 F-016 title-rule-v1 flags the correct 20 and 50 item boundary thresholds without changing selection", () => {
  const closeMeans = factorResults([3.6, 3.51, 3.5, 3, 3], {
    intellectImagination: { directionalSupportCount: 4 },
    conscientiousness: { directionalSupportCount: 4 },
    extraversion: { directionalSupportCount: 4 },
  });
  const preview = classifyTitle({
    factorResults: closeMeans,
    questionCount: 20,
    titleProfiles: TitleProfileDefinitions,
  });
  const detail = classifyTitle({
    factorResults: closeMeans,
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });

  assert.deepEqual(preview.selectedFactors, detail.selectedFactors);
  assert.equal(preview.boundaryFlags.some(({ type }) => type === "factor-near-band-boundary"), true);
  assert.equal(preview.boundaryFlags.some(({ type }) => type === "second-third-salience-near-tie"), true);
  assert.equal(detail.boundaryFlags.some(({ type }) => type === "factor-near-band-boundary"), true);
  assert.equal(detail.boundaryFlags.some(({ type }) => type === "second-third-salience-near-tie"), true);

  const previewOnly = classifyTitle({
    factorResults: factorResults([3.74, 3, 3, 3, 3], { intellectImagination: { directionalSupportCount: 4 } }),
    questionCount: 20,
    titleProfiles: TitleProfileDefinitions,
  });
  const detailOnly = classifyTitle({
    factorResults: factorResults([3.74, 3, 3, 3, 3], { intellectImagination: { directionalSupportCount: 4 } }),
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });
  assert.equal(previewOnly.boundaryFlags.length > 0, true);
  assert.equal(detailOnly.boundaryFlags.length, 0);
});

test("T-003 F-016 includes exact 0.1 and 0.25 boundary distances despite floating point representation", () => {
  const detail = classifyTitle({
    factorResults: factorResults([3.6, 5, 4.2, 4.1, 3], {
      intellectImagination: { directionalSupportCount: 4 },
      conscientiousness: { directionalSupportCount: 10 },
      extraversion: { directionalSupportCount: 8 },
      agreeableness: { directionalSupportCount: 7 },
    }),
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });
  const preview = classifyTitle({
    factorResults: factorResults([3.75, 3, 3, 3, 3], {
      intellectImagination: { directionalSupportCount: 4 },
    }),
    questionCount: 20,
    titleProfiles: TitleProfileDefinitions,
  });

  assert.equal(detail.boundaryFlags.some((flag) =>
    flag.type === "factor-near-band-boundary" && flag.factorId === "intellectImagination" && flag.boundary === 3.5), true);
  assert.equal(detail.boundaryFlags.some((flag) =>
    flag.type === "second-third-salience-near-tie" && flag.factorIds.join(",") === "extraversion,agreeableness"), true);
  assert.equal(preview.boundaryFlags.some((flag) =>
    flag.type === "factor-near-band-boundary" && flag.factorId === "intellectImagination" && flag.boundary === 3.5), true);
});

test("T-003 F-005 F-006 result composition retains all caller supplied factors and rendered texts without raw answers", () => {
  const factors = factorResults([1, 2, 3, 4, 5], {
    intellectImagination: { directionalSupportCount: 4 },
    conscientiousness: { directionalSupportCount: 4 },
    extraversion: { directionalSupportCount: 0 },
    agreeableness: { directionalSupportCount: 4 },
    emotionalStability: { directionalSupportCount: 4 },
  });
  const classification = classifyTitle({
    factorResults: factors,
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });
  const renderedTexts = [{
    id: "caller-approved-text-id",
    version: "result-text-v1",
    section: "summary",
    text: "",
    evidenceRefs: [],
  }];
  const model = composeResultModel({ factors, classification, renderedTexts });

  assert.equal(model.factors.length, 5);
  assert.equal(model.factors[2].factorId, "extraversion");
  assert.equal(model.factors[4].factorId, "emotionalStability");
  assert.deepEqual(model.renderedTexts, renderedTexts);
  assert.equal(Object.hasOwn(model, "answers"), false);
  assert.equal(Object.hasOwn(model, "generatedText"), false);

  factors[0].answers = [1];
  renderedTexts[0].evidenceRefs.push("late-contamination");
  assert.equal(Object.hasOwn(model.factors[0], "answers"), false);
  assert.deepEqual(model.renderedTexts[0].evidenceRefs, []);
});

test("T-003 F-005 F-006 result composition rejects raw-answer and unknown-field contamination uniformly", () => {
  const factors = factorResults([2, 3, 3, 3, 4], {
    intellectImagination: { directionalSupportCount: 4 },
    emotionalStability: { directionalSupportCount: 4 },
  });
  const classification = classifyTitle({
    factorResults: factors,
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });
  const renderedTexts = [{
    id: "rendered-id",
    version: "result-text-v1",
    section: "summary",
    text: "",
    evidenceRefs: [],
  }];
  const invalidInputs = [
    { factors, classification, renderedTexts, answers: answersWith(3) },
    { factors: [{ ...factors[0], answers: [1] }, ...factors.slice(1)], classification, renderedTexts },
    { factors, classification: { ...classification, unknown: true }, renderedTexts },
    { factors, classification, renderedTexts: [{ ...renderedTexts[0], answers: [1] }] },
    { factors, classification, renderedTexts: [{ ...renderedTexts[0], unknown: true }] },
    { factors, classification, renderedTexts: [{ ...renderedTexts[0], evidenceRefs: [""] }] },
  ];

  for (const input of invalidInputs) {
    assert.throws(() => composeResultModel(input), /RESULT_MODEL_INVALID/);
  }
});

test("T-003 F-006 validates versioned fixed-text structure and selects explicit conditions deterministically", () => {
  const definitions = [
    {
      id: "summary-detail",
      version: "result-text-v1",
      appliesTo: { mode: "detail50", questionCount: 50, titleId: "title-balanced" },
      section: "summary",
      text: "",
      evidenceRefs: [],
      previewAllowed: false,
    },
    {
      id: "factor-preview",
      version: "result-text-v1",
      appliesTo: { factorId: "extraversion", band: "high" },
      section: "strength",
      text: "test-only",
      evidenceRefs: ["test-evidence"],
      previewAllowed: true,
    },
    {
      id: "factor-detail-only",
      version: "result-text-v1",
      appliesTo: { factorId: "extraversion", band: "high" },
      section: "tradeoff",
      text: "",
      evidenceRefs: [],
      previewAllowed: false,
    },
  ];

  assert.equal(validateResultTextDefinitions(definitions), definitions);
  assert.deepEqual(selectResultTextDefinitions({
    definitions,
    version: "result-text-v1",
    context: {
      mode: "preview20",
      questionCount: 20,
      factorId: "extraversion",
      band: "high",
      titleId: "title-balanced",
    },
  }).map(({ id }) => id), ["factor-preview"]);
  assert.deepEqual(selectResultTextDefinitions({
    definitions,
    version: "result-text-v1",
    context: {
      mode: "detail50",
      questionCount: 50,
      factorId: "extraversion",
      band: "high",
      titleId: "title-balanced",
    },
  }).map(({ id }) => id), ["summary-detail", "factor-preview", "factor-detail-only"]);
});

test("T-003 F-006 rejects malformed fixed-text fields, evidence references, conditions, and duplicate IDs", () => {
  const valid = {
    id: "valid",
    version: "result-text-v1",
    appliesTo: {},
    section: "action",
    text: "",
    evidenceRefs: [],
    previewAllowed: true,
  };
  const cases = [
    [{ ...valid, extra: true }],
    [{ ...valid, evidenceRefs: "not-an-array" }],
    [{ ...valid, evidenceRefs: [""] }],
    [{ ...valid, appliesTo: { unknown: true } }],
    [{ ...valid, appliesTo: { mode: "unknown" } }],
    [valid, { ...valid }],
  ];

  for (const definitions of cases) {
    assert.throws(() => validateResultTextDefinitions(definitions), /RESULT_TEXT_DEFINITION_INVALID/);
  }
});
