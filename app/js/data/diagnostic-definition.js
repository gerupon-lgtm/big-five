const FACTORS = [
  ["extraversion", "外向性"],
  ["agreeableness", "協調性"],
  ["conscientiousness", "誠実性"],
  ["emotionalStability", "情緒的安定性"],
  ["intellectImagination", "知性・想像力"],
];

const SOURCE_ITEMS = [
  [1, "盛り上げ役である", "extraversion", "positive"],
  [2, "他人を気づかうことはない", "agreeableness", "negative"],
  [3, "いつも用意周到である", "conscientiousness", "positive"],
  [4, "すぐにストレスがたまってしまう", "emotionalStability", "negative"],
  [5, "語彙が豊富である", "intellectImagination", "positive"],
  [6, "おしゃべりではない", "extraversion", "negative"],
  [7, "他人に興味がある", "agreeableness", "positive"],
  [8, "持ち物が整理できないほうだ", "conscientiousness", "negative"],
  [9, "いつもリラックスしていることが多い", "emotionalStability", "positive"],
  [10, "抽象的な考えを理解するのが苦手だ", "intellectImagination", "negative"],
  [11, "人前でもあがらない", "extraversion", "positive"],
  [12, "人を馬鹿にするほうだ", "agreeableness", "negative"],
  [13, "細かいことに気がつく", "conscientiousness", "positive"],
  [14, "心配性である", "emotionalStability", "negative"],
  [15, "想像力が豊かである", "intellectImagination", "positive"],
  [16, "引っ込み思案である", "extraversion", "negative"],
  [17, "人に共感しやすい", "agreeableness", "positive"],
  [18, "無茶なことをする", "conscientiousness", "negative"],
  [19, "落ち込むことはめったにない", "emotionalStability", "positive"],
  [20, "抽象的な考えには興味がない", "intellectImagination", "negative"],
  [21, "自分から話しかけるほうである", "extraversion", "positive"],
  [22, "他人の問題には興味がない", "agreeableness", "negative"],
  [23, "すぐに雑用を済ませる", "conscientiousness", "positive"],
  [24, "動揺しやすい", "emotionalStability", "negative"],
  [25, "素晴らしいアイディアを持っている", "intellectImagination", "positive"],
  [26, "あまり話すことがない", "extraversion", "negative"],
  [27, "優しい心を持っている", "agreeableness", "positive"],
  [28, "整理整頓を怠りがち", "conscientiousness", "negative"],
  [29, "慌てやすい", "emotionalStability", "negative"],
  [30, "アイディアが乏しいほうだ", "intellectImagination", "negative"],
  [31, "パーティでは色々な人と話すほうだ", "extraversion", "positive"],
  [32, "他人にはまったく興味がない", "agreeableness", "negative"],
  [33, "整頓するのが好きである", "conscientiousness", "positive"],
  [34, "気分をコロコロ変える", "emotionalStability", "negative"],
  [35, "ものわかりが良いほうだ", "intellectImagination", "positive"],
  [36, "人から注目を浴びるのは好きではない", "extraversion", "negative"],
  [37, "他の人のために時間を割くほうだ", "agreeableness", "positive"],
  [38, "仕事や学習をさぼることが多い", "conscientiousness", "negative"],
  [39, "気分が著しく変化するほうだ", "emotionalStability", "negative"],
  [40, "難しい言葉を使うほうだ", "intellectImagination", "positive"],
  [41, "注目の的になるのは嫌ではない", "extraversion", "positive"],
  [42, "他の人の気持ちがわかる", "agreeableness", "positive"],
  [43, "予定に従うほうだ", "conscientiousness", "positive"],
  [44, "イライラしやすい", "emotionalStability", "negative"],
  [45, "いろんなことを反省しては時間を過ごす", "intellectImagination", "positive"],
  [46, "人見知りする", "extraversion", "negative"],
  [47, "人を安心させる", "agreeableness", "positive"],
  [48, "張り切って仕事や学習に取り組むほうだ", "conscientiousness", "positive"],
  [49, "落ち込むことが多い", "emotionalStability", "negative"],
  [50, "アイディアが豊富である", "intellectImagination", "positive"],
];

const PREVIEW_SOURCE_ITEM_IDS = [
  1, 17, 23, 39, 15, 6, 22, 28, 9, 20, 31, 42, 33, 29, 10, 16, 32, 18, 19,
  30,
];

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) {
      deepFreeze(nestedValue);
    }
  }
  return value;
}

const previewSourceItemIdSet = new Set(PREVIEW_SOURCE_ITEM_IDS);
const stagedSourceItemIds = [
  ...PREVIEW_SOURCE_ITEM_IDS,
  ...SOURCE_ITEMS.map(([sourceItemId]) => sourceItemId).filter(
    (sourceItemId) => !previewSourceItemIdSet.has(sourceItemId),
  ),
];

const FACTOR_METADATA = {
  extraversion: ["外向性", "Extraversion", "一人で過ごす場面を好む傾向", "人との交流を好む傾向", "人との関わり方や活動の好みの傾向を表します。"],
  agreeableness: ["協調性", "Agreeableness", "率直に意見を伝える傾向", "相手の気持ちや協力を重視する傾向", "対人場面での配慮や協力の傾向を表します。"],
  conscientiousness: ["誠実性", "Conscientiousness", "柔軟に進め方を変える傾向", "計画や整理を重視する傾向", "計画、整理、取り組み方の傾向を表します。"],
  emotionalStability: ["情緒的安定性", "Emotional Stability", "感情の変化を感じやすい傾向", "落ち着きを保ちやすい傾向", "気分やストレスへの反応の傾向を表します。"],
  intellectImagination: ["知性・想像力", "Intellect/Imagination", "具体的で身近な事柄を好む傾向", "考えや発想を広げることを好む傾向", "考え方や新しい発想への関心の傾向を表します。"],
};

export const FactorDefinitions = deepFreeze(FACTORS.map(([id]) => {
  const [displayName, academicName, lowPole, highPole, description] = FACTOR_METADATA[id];
  return { id, displayName, academicName, lowPole, highPole, description };
}));

export const QuestionDefinitions = deepFreeze(
  stagedSourceItemIds.map((sourceItemId, index) => {
    const [, text, factorId, keyedDirection] = SOURCE_ITEMS[sourceItemId - 1];
    return {
      id: `ipip-ja-${String(sourceItemId).padStart(2, "0")}`,
      order: index + 1,
      textJa: text,
      factorId,
      keyedDirection,
      sourceItemId: String(sourceItemId),
      previewIncluded: previewSourceItemIdSet.has(sourceItemId),
    };
  }),
);


export const DiagnosticDefinition = deepFreeze({
  diagnosisId: "big-five-ipip-ja",
  scaleId: "ipip-ja-50",
  scaleName: "IPIP日本語50項目版",
  scaleVersion: "ipip-ja-50-v1",
  questionVersion: "ipip-ja-50-question-set-v1",
  scoringVersion: "ipip-ja-50-scoring-v1",
  resultTextVersion: "result-text-v1",
  titleRuleVersion: "title-rule-v1",
  factorOrder: FactorDefinitions.map(({ id }) => id),
  previewQuestionIds: QuestionDefinitions.slice(0, 20).map(({ id }) => id),
  detailQuestionIds: QuestionDefinitions.map(({ id }) => id),
  source: [
    { id: "ipip-japanese-markers", url: "https://ipip.ori.org/JapaneseBig-FiveFactorMarkers.htm", label: "IPIP Japanese Translation of the Lexical Big-Five Factor Markers" },
    { id: "ipip-50-item-scale", url: "https://www.ipip.ori.org/New_IPIP-50-item-scale.htm", label: "IPIP Japanese 50-item scale (IPIP日本語50項目版)" },
    { id: "donnellan-2006-mini-ipip", url: "https://doi.org/10.1037/1040-3590.18.2.192", label: "Donnellan et al. (2006), Mini-IPIP Appendix A" },
    { id: "ipip-permission", url: "https://ipip.ori.org/newPermission.htm", label: "IPIP materials are public domain and may be used for commercial or non-commercial purposes." },
  ],
  limitations: [
    "IPIPプロジェクトは、この公式日本語訳を妥当性検証していません。",
    "20項目の日本語プレビューは、日本語版Mini-IPIPとして独立した妥当性検証を受けていません。",
    "結果は自己理解のためのものであり、臨床診断、能力、雇用適性、パーセンタイル、母集団内順位を示すものではありません。",
  ],
});
