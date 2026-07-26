import { FACTOR_ORDER } from "../../js/data/factor-order.js";
import { createResultSnapshot } from "../../js/domain/result-snapshot.js";

const DETAIL_SECTIONS = [
  "titleSubtitle",
  "titleReason",
  ...["observation", "strength", "tradeoff", "work", "relationship", "stress", "question", "action"]
    .flatMap((section) => FACTOR_ORDER.map(() => section)),
];
const PREVIEW_SECTIONS = ["titleSubtitle", "titleReason", ...FACTOR_ORDER.map(() => "observation")];

export const TEST_VERSION_TUPLE = Object.freeze({
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
    if (index === 0) {
      return {
        id: "title-balanced-subtitle",
        version,
        section,
        text: "五つの風を見渡す観測者の副題",
        evidenceRefs: ["e-1"],
      };
    }
    if (index === 1) {
      return {
        id: "title-balanced-reason",
        version,
        section,
        text: "五つの因子を見渡した結果です。",
        evidenceRefs: ["e-2"],
      };
    }
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

export function createTestResultSnapshot({
  resultId,
  completedAt = "2026-07-25T12:00:00+09:00",
  questionCount = 50,
  versionTuple = TEST_VERSION_TUPLE,
  rawMeans = [3, 3, 3, 3, 3],
} = {}) {
  const mode = questionCount === 20 ? "preview20" : "detail50";
  const factors = FACTOR_ORDER.map((factorId, index) =>
    factorResult(factorId, rawMeans[index], questionCount));
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
