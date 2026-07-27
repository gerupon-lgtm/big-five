import { FACTOR_ORDER } from "../data/factor-order.js";
import { validateResultSnapshot } from "./result-snapshot.js";

const CATEGORY_DEFINITIONS = Object.freeze([
  Object.freeze({
    categoryId: "observation",
    sections: Object.freeze(["observation"]),
    label: "今の傾向",
    summary: "回答から見える現在の傾向を短くまとめます。",
  }),
  Object.freeze({
    categoryId: "strength",
    sections: Object.freeze(["strength"]),
    label: "活かしやすい強み",
    summary: "活かしやすい場面を振り返ります。",
  }),
  Object.freeze({
    categoryId: "tradeoff",
    sections: Object.freeze(["tradeoff"]),
    label: "強みの裏返り",
    summary: "負担になりやすい場面を振り返ります。",
  }),
  Object.freeze({
    categoryId: "work",
    sections: Object.freeze(["work"]),
    label: "仕事での現れ方",
    summary: "仕事や学びでの現れ方を確認します。",
  }),
  Object.freeze({
    categoryId: "relationship",
    sections: Object.freeze(["relationship"]),
    label: "人間関係での現れ方",
    summary: "人との関わりでの現れ方を確認します。",
  }),
  Object.freeze({
    categoryId: "stress",
    sections: Object.freeze(["stress"]),
    label: "ストレス時の傾向",
    summary: "負担がかかった場面を振り返ります。",
  }),
  Object.freeze({
    categoryId: "reflectionAction",
    sections: Object.freeze(["question", "action"]),
    label: "振り返りと行動ヒント",
    summary: "振り返りの問いと小さな行動を確認します。",
  }),
]);

function invalidDisclosureModel() {
  throw new TypeError("RESULT_DISCLOSURE_MODEL_INVALID");
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

function validateLabels(labels) {
  if (
    !isRecord(labels) ||
    !isRecord(labels.factorLabels) ||
    !isRecord(labels.factorDescriptions)
  ) {
    invalidDisclosureModel();
  }
  for (const factorId of FACTOR_ORDER) {
    if (
      typeof labels.factorLabels[factorId] !== "string" ||
      labels.factorLabels[factorId].length === 0 ||
      typeof labels.factorDescriptions[factorId] !== "string" ||
      labels.factorDescriptions[factorId].length === 0
    ) {
      invalidDisclosureModel();
    }
  }
}

function cloneRenderedText(record) {
  return {
    id: record.id,
    version: record.version,
    section: record.section,
    text: record.text,
    evidenceRefs: [...record.evidenceRefs],
  };
}

function buildDisclosureModel(snapshot, labels) {
  validateLabels(labels);
  const savedSnapshot = validateResultSnapshot(snapshot);
  const factorRecords = new Map(
    savedSnapshot.factors.map(({ factorId }) => [factorId, []]),
  );

  savedSnapshot.renderedTexts.slice(2).forEach((record, index) => {
    const factor = savedSnapshot.factors[index % savedSnapshot.factors.length];
    const records = factorRecords.get(factor?.factorId);
    if (!records) invalidDisclosureModel();
    records.push(record);
  });

  return deepFreeze(savedSnapshot.factors.map((factor) => ({
    factorId: factor.factorId,
    label: labels.factorLabels[factor.factorId],
    description: labels.factorDescriptions[factor.factorId],
    displayScore: factor.displayScore,
    categories: CATEGORY_DEFINITIONS.flatMap((category) => {
      const records = factorRecords
        .get(factor.factorId)
        .filter(({ section }) => category.sections.includes(section))
        .map(cloneRenderedText);
      return records.length === 0
        ? []
        : [{
          categoryId: category.categoryId,
          label: category.label,
          summary: category.summary,
          records,
        }];
    }),
  })));
}

export function createResultDisclosureModel(snapshot, labels) {
  try {
    return buildDisclosureModel(snapshot, labels);
  } catch {
    invalidDisclosureModel();
  }
}
