import { FactorResultTextDefinitions } from "./factor-result-text-definitions.js";
import { TitleReflectionDefinitions } from "./title-reflection-definitions.js";
import { TitleResultTextDefinitions } from "./title-result-text-definitions.js";

const V2_TEXT_BY_ID = Object.freeze({
  "preview20-intellectImagination-high-observation":
    "今回の20問では、新しい考え方や発想への関心が尺度内で高めであるという傾向が見られました。",
  "preview20-intellectImagination-middle-observation":
    "今回の20問では、新しい考え方や発想への関心が尺度内の中間域にあるという傾向が見られました。",
  "preview20-intellectImagination-low-observation":
    "今回の20問では、新しい考え方や発想への関心が尺度内で低めであるという傾向が見られました。",
  "detail50-intellectImagination-high-observation":
    "今回の50問では、新しい考え方や発想への関心が尺度内で高めであるという傾向が見られました。",
  "detail50-intellectImagination-middle-observation":
    "今回の50問では、新しい考え方や発想への関心が尺度内の中間域にあるという傾向が見られました。",
  "detail50-intellectImagination-low-observation":
    "今回の50問では、新しい考え方や発想への関心が尺度内で低めであるという傾向が見られました。",
  "detail50-conscientiousness-high-observation":
    "今回の50問では、物事を準備や整理をしながら進める傾向が、尺度内で高めに見られました。",
  "detail50-conscientiousness-middle-observation":
    "今回の50問では、物事を準備や整理をしながら進める傾向が、尺度内の中間域にありました。",
  "detail50-conscientiousness-low-observation":
    "今回の50問では、物事を準備や整理をしながら進める傾向が、尺度内で低めに見られました。",
  "detail50-intellectImagination-high-action":
    "今日心に残った「キーワード」や「気づき」を、スマホや手帳に書き留めてみませんか。",
  "detail50-intellectImagination-middle-action":
    "最近気になっているテーマについて、「時間があれば調べてみたいこと」をメモしてみませんか。",
  "detail50-intellectImagination-low-action":
    "今日見聞きした少し難しい話を、「自分の生活で言うとどうなるか」に当てはめて考えてみませんか。",
  "detail50-conscientiousness-high-action":
    "明日取りかかることを決め、最初の一歩だけメモしてみませんか。",
  "detail50-conscientiousness-middle-action":
    "明日の予定から、先に決めておきたいことを選んでみませんか。",
  "detail50-conscientiousness-low-action":
    "今気になっていることから、まず手を動かせそうなものに取りかかってみませんか。",
  "detail50-extraversion-high-action":
    "今日話してみたい人へ、短いあいさつや一言を自分から伝えてみませんか。",
  "detail50-extraversion-middle-action":
    "今日は人と話したい気分か、静かに過ごしたい気分かを確かめてみませんか。",
  "detail50-extraversion-low-action":
    "伝えたい相手を思い浮かべ、話したいことを短くメモしてみませんか。",
  "detail50-agreeableness-high-action":
    "最近気になっている相手へ、「最近どう？」と短く声をかけてみませんか。",
  "detail50-agreeableness-middle-action":
    "会話の前に、相手に聞きたいことと自分から伝えたいことを整理してみませんか。",
  "detail50-agreeableness-low-action":
    "自分の意見を伝えるとき、いちばん大切な理由を添えてみませんか。",
  "detail50-emotionalStability-high-action":
    "最近落ち着いて対応できた場面と、そのとき役に立ったことを短くメモしてみませんか。",
  "detail50-emotionalStability-middle-action":
    "今日の気分と、そのきっかけになった出来事をそれぞれ短くメモしてみませんか。",
  "detail50-emotionalStability-low-action":
    "最近気持ちが揺れた場面と、そのとき少し安心できたことをそれぞれメモしてみませんか。",
  "detail50-intellectImagination-middle-work":
    "仕事や学びのなかで、慣れたやり方で確実に進めるか、時間をかけて新しい方法を試すかを考えた場面はありましたか。",
  "detail50-intellectImagination-low-stress":
    "考えることが増えたとき、「まずは目の前で確かめられることから決めよう」と、扱う内容を絞った場面はありましたか。",
  "detail50-agreeableness-low-strength":
    "最近、曖昧な状況のなかでも自分の考えをはっきり伝えた結果、話が整理された場面はありましたか。",
});

function projectToV2(definition) {
  return Object.freeze({
    ...definition,
    version: "result-text-v2",
    appliesTo: Object.freeze({ ...definition.appliesTo }),
    text: V2_TEXT_BY_ID[definition.id] ?? definition.text,
    evidenceRefs: Object.freeze([...definition.evidenceRefs]),
  });
}

const V2_BASE_DEFINITIONS = [
  ...TitleResultTextDefinitions,
  ...FactorResultTextDefinitions,
].map(projectToV2);

export const ResultTextDefinitions = Object.freeze([
  ...V2_BASE_DEFINITIONS,
  ...TitleReflectionDefinitions,
]);
