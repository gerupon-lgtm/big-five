import { SCORE_FACTORS, validateScores } from "./score-validation.js";

const factorNames = {
  O: "開放性", C: "誠実性", E: "外向性", A: "協調性", N: "神経症傾向",
};

const titles = {
  "A-O": "調和する調整役", "C-O": "計画を形にする人", "E-O": "好奇心を広げる冒険者",
  "A-C": "真面目で支え合う実務家", "C-E": "伝え頼れる表現者", "A-E": "人をつなぐ聞き役",
};

export function buildResultModel({ answerCount, scores }) {
  validateScores(scores);
  const leadingFactors = [...SCORE_FACTORS]
    .sort((left, right) => scores[right] - scores[left])
    .slice(0, 2);
  const pair = [...leadingFactors].sort().join("-");
  const title = titles[pair] ?? `${factorNames[leadingFactors[0]]}を軸にする人`;

  return {
    title,
    leadingFactors,
    summary: `${factorNames[leadingFactors[0]]}と${factorNames[leadingFactors[1]]}が、今回のプロフィールに特に表れています。`,
    reason: `回答の集計: ${factorNames[leadingFactors[0]]} ${scores[leadingFactors[0]]}・${factorNames[leadingFactors[1]]} ${scores[leadingFactors[1]]}です。`,
    detail: answerCount === 50
      ? "50問の回答を使った体験用サンプル結果です。精度・妥当性は検証していません。"
      : "20問の結果は基本サンプルです。追加30問に答えると、より多くの回答を使ったサンプル結果を表示します。",
    disclaimer: "0〜100は尺度内スコアであり、優劣や能力差ではありません。",
  };
}
