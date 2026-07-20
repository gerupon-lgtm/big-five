const rows = [
  [1, "盛り上げ役である", "extraversion", "positive"], [2, "他人を気づかうことはない", "agreeableness", "negative"], [3, "いつも用意周到である", "conscientiousness", "positive"], [4, "すぐにストレスがたまってしまう", "emotionalStability", "negative"], [5, "語彙が豊富である", "intellectImagination", "positive"],
  [6, "おしゃべりではない", "extraversion", "negative"], [7, "他人に興味がある", "agreeableness", "positive"], [8, "持ち物が整理できないほうだ", "conscientiousness", "negative"], [9, "いつもリラックスしていることが多い", "emotionalStability", "positive"], [10, "抽象的な考えを理解するのが苦手だ", "intellectImagination", "negative"],
  [11, "人前でもあがらない", "extraversion", "positive"], [12, "人を馬鹿にするほうだ", "agreeableness", "negative"], [13, "細かいことに気がつく", "conscientiousness", "positive"], [14, "心配性である", "emotionalStability", "negative"], [15, "想像力が豊かである", "intellectImagination", "positive"],
  [16, "引っ込み思案である", "extraversion", "negative"], [17, "人に共感しやすい", "agreeableness", "positive"], [18, "無茶なことをする", "conscientiousness", "negative"], [19, "落ち込むことはめったにない", "emotionalStability", "positive"], [20, "抽象的な考えには興味がない", "intellectImagination", "negative"],
  [21, "自分から話しかけるほうである", "extraversion", "positive"], [22, "他人の問題には興味がない", "agreeableness", "negative"], [23, "すぐに雑用を済ませる", "conscientiousness", "positive"], [24, "動揺しやすい", "emotionalStability", "negative"], [25, "素晴らしいアイディアを持っている", "intellectImagination", "positive"],
  [26, "あまり話すことがない", "extraversion", "negative"], [27, "優しい心を持っている", "agreeableness", "positive"], [28, "整理整頓を怠りがち", "conscientiousness", "negative"], [29, "慌てやすい", "emotionalStability", "negative"], [30, "アイディアが乏しいほうだ", "intellectImagination", "negative"],
  [31, "パーティでは色々な人と話すほうだ", "extraversion", "positive"], [32, "他人にはまったく興味がない", "agreeableness", "negative"], [33, "整頓するのが好きである", "conscientiousness", "positive"], [34, "気分をコロコロ変える", "emotionalStability", "negative"], [35, "ものわかりが良いほうだ", "intellectImagination", "positive"],
  [36, "人から注目を浴びるのは好きではない", "extraversion", "negative"], [37, "他の人のために時間を割くほうだ", "agreeableness", "positive"], [38, "仕事や学習をさぼることが多い", "conscientiousness", "negative"], [39, "気分が著しく変化するほうだ", "emotionalStability", "negative"], [40, "難しい言葉を使うほうだ", "intellectImagination", "positive"],
  [41, "注目の的になるのは嫌ではない", "extraversion", "positive"], [42, "他の人の気持ちがわかる", "agreeableness", "positive"], [43, "予定に従うほうだ", "conscientiousness", "positive"], [44, "イライラしやすい", "emotionalStability", "negative"], [45, "いろんなことを反省しては時間を過ごす", "intellectImagination", "positive"],
  [46, "人見知りする", "extraversion", "negative"], [47, "人を安心させる", "agreeableness", "positive"], [48, "張り切って仕事や学習に取り組むほうだ", "conscientiousness", "positive"], [49, "落ち込むことが多い", "emotionalStability", "negative"], [50, "アイディアが豊富である", "intellectImagination", "positive"],
];

const previewSourceItemIds = [1, 17, 23, 39, 15, 6, 22, 28, 9, 20, 31, 42, 33, 29, 10, 16, 32, 18, 19, 30];
const previewSourceItemIdSet = new Set(previewSourceItemIds);

export const IPIP_JA_50_AUTHORITY_FIXTURE = Object.freeze({
  rows: Object.freeze(rows.map(([sourceItemId, textJa, factorId, keyedDirection]) => Object.freeze({
    sourceItemId: String(sourceItemId),
    textJa,
    factorId,
    keyedDirection,
    previewIncluded: previewSourceItemIdSet.has(sourceItemId),
  }))),
  previewQuestionIds: Object.freeze(previewSourceItemIds.map((sourceItemId) => `ipip-ja-${String(sourceItemId).padStart(2, "0")}`)),
  previewSourceItemIds: Object.freeze(previewSourceItemIds.map(String)),
});
