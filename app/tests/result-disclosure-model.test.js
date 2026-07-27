import assert from "node:assert/strict";
import test from "node:test";

import { createResultDisclosureModel } from "../js/domain/result-disclosure-model.js";
import { createTestResultSnapshot } from "./helpers/result-snapshot-fixture.js";

const labels = Object.freeze({
  factorLabels: Object.freeze({
    intellectImagination: "知性・想像力",
    conscientiousness: "勤勉性",
    extraversion: "外向性",
    agreeableness: "協調性",
    emotionalStability: "情緒安定性",
  }),
  factorDescriptions: Object.freeze({
    intellectImagination: "発想や新しい考えへの関心を表します。",
    conscientiousness: "計画や整理を重視する傾向を表します。",
    extraversion: "人との関わり方や活動の好みを表します。",
    agreeableness: "対人場面での配慮や協力を表します。",
    emotionalStability: "気分やストレスへの反応を表します。",
  }),
});

const EXPECTED_CATEGORIES = [
  {
    categoryId: "observation",
    label: "今の傾向",
    summary: "回答から見える現在の傾向を短くまとめます。",
  },
  {
    categoryId: "strength",
    label: "活かしやすい強み",
    summary: "活かしやすい場面を振り返ります。",
  },
  {
    categoryId: "tradeoff",
    label: "強みの裏返り",
    summary: "負担になりやすい場面を振り返ります。",
  },
  {
    categoryId: "work",
    label: "仕事での現れ方",
    summary: "仕事や学びでの現れ方を確認します。",
  },
  {
    categoryId: "relationship",
    label: "人間関係での現れ方",
    summary: "人との関わりでの現れ方を確認します。",
  },
  {
    categoryId: "stress",
    label: "ストレス時の傾向",
    summary: "負担がかかった場面を振り返ります。",
  },
  {
    categoryId: "reflectionAction",
    label: "振り返りと行動ヒント",
    summary: "振り返りの問いと小さな行動を確認します。",
  },
];

function assertDeeplyFrozen(value, seen = new Set()) {
  if (value === null || typeof value !== "object" || seen.has(value)) return;
  seen.add(value);
  assert.equal(Object.isFrozen(value), true);
  for (const nested of Object.values(value)) {
    assertDeeplyFrozen(nested, seen);
  }
}

test("T-008A F-006 projects detail section-first records into fixed factor categories", () => {
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000801",
  });

  const model = createResultDisclosureModel(snapshot, labels);

  assert.deepEqual(
    model.map(({ factorId }) => factorId),
    snapshot.factors.map(({ factorId }) => factorId),
  );
  assert.deepEqual(
    model[0].categories.map(({ categoryId, label, summary }) => ({
      categoryId,
      label,
      summary,
    })),
    EXPECTED_CATEGORIES,
  );
  assert.deepEqual(
    model[0].categories.at(-1).records.map(({ section }) => section),
    ["question", "action"],
  );
  assert.deepEqual(
    model
      .flatMap(({ categories }) =>
        categories.flatMap(({ records }) => records))
      .map(({ id }) => id)
      .sort(),
    snapshot.renderedTexts.slice(2).map(({ id }) => id).sort(),
  );
});

test("T-008A F-006 keeps preview disclosure to one observation per factor", () => {
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000802",
    questionCount: 20,
  });

  const model = createResultDisclosureModel(snapshot, labels);

  assert.equal(model.length, 5);
  assert.equal(
    model.every(({ categories }) =>
      categories.length === 1 &&
      categories[0].categoryId === "observation" &&
      categories[0].records.length === 1),
    true,
  );
});

test("T-008A F-006 exposes factor labels, descriptions, and display scores", () => {
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000803",
    rawMeans: [4, 4, 3, 2, 2],
  });

  const model = createResultDisclosureModel(snapshot, labels);

  assert.deepEqual(
    model.map(({ factorId, label, description, displayScore }) => ({
      factorId,
      label,
      description,
      displayScore,
    })),
    [
      {
        factorId: "intellectImagination",
        label: "知性・想像力",
        description: "発想や新しい考えへの関心を表します。",
        displayScore: 75,
      },
      {
        factorId: "conscientiousness",
        label: "勤勉性",
        description: "計画や整理を重視する傾向を表します。",
        displayScore: 75,
      },
      {
        factorId: "extraversion",
        label: "外向性",
        description: "人との関わり方や活動の好みを表します。",
        displayScore: 50,
      },
      {
        factorId: "agreeableness",
        label: "協調性",
        description: "対人場面での配慮や協力を表します。",
        displayScore: 25,
      },
      {
        factorId: "emotionalStability",
        label: "情緒安定性",
        description: "気分やストレスへの反応を表します。",
        displayScore: 25,
      },
    ],
  );
});

test("T-008A F-006 does not mutate the ResultSnapshot or labels and deeply freezes output copies", () => {
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000804",
  });
  const snapshotBefore = structuredClone(snapshot);
  const mutableLabels = structuredClone(labels);
  const labelsBefore = structuredClone(mutableLabels);

  const model = createResultDisclosureModel(snapshot, mutableLabels);

  assert.deepEqual(snapshot, snapshotBefore);
  assert.deepEqual(mutableLabels, labelsBefore);
  assertDeeplyFrozen(model);
  assert.notStrictEqual(
    model[0].categories[0].records[0],
    snapshot.renderedTexts[2],
  );
  assert.notStrictEqual(
    model[0].categories[0].records[0].evidenceRefs,
    snapshot.renderedTexts[2].evidenceRefs,
  );
});

test("T-008A F-006 rejects invalid snapshots with a stable error code", () => {
  const snapshot = structuredClone(createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000805",
  }));
  snapshot.renderedTexts.pop();

  assert.throws(
    () => createResultDisclosureModel(snapshot, labels),
    { name: "TypeError", message: "RESULT_DISCLOSURE_MODEL_INVALID" },
  );
});

test("T-008A F-006 rejects incomplete factor labels with a stable error code", () => {
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000806",
  });
  const incomplete = structuredClone(labels);
  delete incomplete.factorDescriptions.emotionalStability;

  assert.throws(
    () => createResultDisclosureModel(snapshot, incomplete),
    { name: "TypeError", message: "RESULT_DISCLOSURE_MODEL_INVALID" },
  );
});
