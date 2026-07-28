import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { validateResultEvidenceDefinitions } from "../js/domain/result-evidence.js";
import {
  RESULT_CLAIM_KINDS,
  RESULT_TEXT_SECTIONS,
  validateResultTextDefinitions,
} from "../js/domain/result-text.js";
import { validateResultContentDefinitions } from "../js/domain/definition-validator.js";
import { FACTOR_ORDER } from "../js/data/factor-order.js";
import { FactorResultTextDefinitions } from "../js/data/factor-result-text-definitions.js";
import { ResultEvidenceDefinitions } from "../js/data/result-evidence-definitions.js";
import { ResultTextDefinitions } from "../js/data/result-text-definitions.js";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { TitleResultTextDefinitions } from "../js/data/title-result-text-definitions.js";
import { Q006_TITLE_CATALOG } from "./fixtures/q006-title-catalog.fixture.js";

const BANDS = ["low", "middle", "high"];
const DETAIL_SECTIONS = [
  "observation", "strength", "tradeoff", "work",
  "relationship", "stress", "question", "action",
];
const SCALE_SECTIONS = new Set(["observation"]);
const PROMPT_SECTIONS = new Set([
  "strength", "tradeoff", "work", "relationship", "stress", "question", "action",
]);

const evidence = {
  evidenceId: "evidence-title-rule-v1",
  version: "result-evidence-v1",
  sourceType: "internal-contract",
  sourceLabel: "Title rule",
  locator: "docs/requirements/2026-07-20-big-five-self-understanding-requirements.md#831",
  supportedClaims: ["title-selection"],
};

const text = {
  id: "title-balanced-subtitle",
  version: "result-text-v1",
  appliesTo: { titleId: "title-balanced" },
  section: "titleSubtitle",
  claimKind: "entertainmentReason",
  text: "5因子がいずれも中間域にあるプロフィール",
  evidenceRefs: ["evidence-title-rule-v1"],
  previewAllowed: true,
};

const detailStrengthText = {
  id: "detail50-extraversion-low-strength",
  version: "result-text-v1",
  appliesTo: {
    mode: "detail50",
    questionCount: 50,
    factorId: "extraversion",
    band: "low",
  },
  section: "strength",
  claimKind: "reflectionPrompt",
  text: "人との集まりで、少人数や静かな場所を選んだ場面はありましたか。",
  evidenceRefs: ["evidence-result-presentation-contract"],
  previewAllowed: false,
};

const titleProfiles = [{ titleId: "title-balanced" }];

test("Q-006 schemas accept exact evidence and result text", () => {
  assert.equal(validateResultEvidenceDefinitions([evidence]).length, 1);
  assert.equal(validateResultTextDefinitions([text]).length, 1);
  assert.deepEqual(RESULT_TEXT_SECTIONS, [
    "titleSubtitle", "titleReason", "observation", "strength", "tradeoff",
    "work", "relationship", "stress", "question", "action",
  ]);
  assert.deepEqual(RESULT_CLAIM_KINDS, [
    "scaleObservation", "entertainmentReason", "reflectionPrompt", "actionHint",
  ]);
});

test("Q-006 schemas reject unknown fields and unsupported claim kinds", () => {
  assert.throws(
    () => validateResultEvidenceDefinitions([{ ...evidence, extra: true }]),
    /RESULT_EVIDENCE_DEFINITION_INVALID/,
  );
  assert.throws(
    () => validateResultTextDefinitions([{ ...text, claimKind: "abilityClaim" }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
});

test("Q-006 text schema requires the section-specific claim kind and preview-safe sections", () => {
  assert.equal(validateResultTextDefinitions([detailStrengthText]).length, 1);
  assert.throws(
    () => validateResultTextDefinitions([{
      ...detailStrengthText,
      claimKind: "scaleObservation",
    }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
  assert.throws(
    () => validateResultTextDefinitions([{ ...text, claimKind: "scaleObservation" }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
  assert.throws(
    () => validateResultTextDefinitions([{ ...text, section: "strength", claimKind: "reflectionPrompt", appliesTo: { mode: "preview20" } }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
  assert.throws(
    () => validateResultTextDefinitions([{ ...text, evidenceRefs: [evidence.evidenceId, evidence.evidenceId] }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
  assert.throws(
    () => validateResultTextDefinitions([{
      ...text,
      appliesTo: { factorId: "extraversion", band: "high" },
      section: "strength",
      claimKind: "reflectionPrompt",
      previewAllowed: true,
    }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
});

test("Q-006 cross-definition validation rejects unknown outer fields and broken references", () => {
  const valid = {
    evidenceDefinitions: [evidence],
    textDefinitions: [text],
    titleProfiles,
    resultTextVersion: "result-text-v1",
  };
  assert.equal(validateResultContentDefinitions(valid), true);
  assert.throws(
    () => validateResultContentDefinitions({ ...valid, extra: true }),
    /RESULT_CONTENT_INVALID/,
  );
  assert.throws(
    () => validateResultContentDefinitions({ ...valid, textDefinitions: [{ ...text, evidenceRefs: ["unknown"] }] }),
    /RESULT_CONTENT_INVALID/,
  );
  assert.throws(
    () => validateResultContentDefinitions({ ...valid, textDefinitions: [{ ...text, appliesTo: { titleId: "unknown" } }] }),
    /RESULT_CONTENT_INVALID/,
  );
});

test("Q-006 title profiles match the approved 51-title catalog", () => {
  assert.equal(TitleProfileDefinitions.length, 51);
  assert.deepEqual(
    TitleProfileDefinitions.map(({ titleId, label }) => ({ titleId, label })),
    Q006_TITLE_CATALOG,
  );
});

test("every title has one subtitle and one reason", () => {
  assert.equal(TitleResultTextDefinitions.length, 102);
  for (const { titleId } of Q006_TITLE_CATALOG) {
    const sections = TitleResultTextDefinitions
      .filter(({ appliesTo }) => appliesTo.titleId === titleId)
      .map(({ section }) => section)
      .sort();
    assert.deepEqual(sections, ["titleReason", "titleSubtitle"]);
  }
});

test("factor content covers 5 factors, 3 bands, and both modes", () => {
  assert.equal(FactorResultTextDefinitions.length, 135);
  for (const factorId of FACTOR_ORDER) {
    for (const band of BANDS) {
      const preview = FactorResultTextDefinitions.filter(({ appliesTo }) =>
        appliesTo.mode === "preview20" &&
        appliesTo.factorId === factorId &&
        appliesTo.band === band);
      assert.deepEqual(preview.map(({ section }) => section), ["observation"]);

      const detail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
        appliesTo.mode === "detail50" &&
        appliesTo.factorId === factorId &&
        appliesTo.band === band);
      assert.deepEqual(detail.map(({ section }) => section), DETAIL_SECTIONS);
    }
  }
  assert.equal(ResultTextDefinitions.length, 237);
});

test("factor and aggregate content satisfy the result-content schemas", () => {
  assert.equal(
    validateResultTextDefinitions(FactorResultTextDefinitions),
    FactorResultTextDefinitions,
  );
  assert.equal(
    validateResultContentDefinitions({
      evidenceDefinitions: ResultEvidenceDefinitions,
      textDefinitions: ResultTextDefinitions,
      titleProfiles: TitleProfileDefinitions,
      resultTextVersion: "result-text-v1",
    }),
    true,
  );
  assert.deepEqual(
    ResultTextDefinitions.slice(0, TitleResultTextDefinitions.length),
    TitleResultTextDefinitions,
  );
  assert.deepEqual(
    ResultTextDefinitions.slice(TitleResultTextDefinitions.length),
    FactorResultTextDefinitions,
  );
});

test("20-question preview copy stays within the four-item observation contract", () => {
  const previewDefinitions = FactorResultTextDefinitions.filter(
    ({ appliesTo }) => appliesTo.mode === "preview20",
  );
  assert.equal(previewDefinitions.length, 15);
  for (const definition of previewDefinitions) {
    assert.equal(definition.appliesTo.questionCount, 20);
    assert.equal(definition.section, "observation");
    assert.equal(definition.claimKind, "scaleObservation");
    assert.equal(definition.previewAllowed, true);
    assert.match(definition.text, /^今回の20問では/);
    assert.doesNotMatch(
      definition.text,
      /仕事|職場|対人|人間関係|ストレス|強み|長所|弱み|短所|裏返り|行動|試して|してみ/,
    );
    assert.deepEqual(definition.evidenceRefs, [
      "evidence-ipip-japanese-markers",
      "evidence-mini-ipip-selection",
    ]);
  }
});

test("Q-006 E-1/F-1 uses the reviewed interest wording for intellect and imagination observations", () => {
  const byId = new Map(FactorResultTextDefinitions.map((definition) => [
    definition.id,
    definition.text,
  ]));
  assert.deepEqual(
    Object.fromEntries([
      ...["preview20", "detail50"].flatMap((mode) => [
        [`${mode}-intellectImagination-high-observation`, byId.get(`${mode}-intellectImagination-high-observation`)],
        [`${mode}-intellectImagination-middle-observation`, byId.get(`${mode}-intellectImagination-middle-observation`)],
        [`${mode}-intellectImagination-low-observation`, byId.get(`${mode}-intellectImagination-low-observation`)],
      ]),
    ]),
    {
      "preview20-intellectImagination-high-observation":
        "今回の20問では、新しい考え方や発想への関心は、尺度内で高めの傾向が見られました。",
      "preview20-intellectImagination-middle-observation":
        "今回の20問では、新しい考え方や発想への関心は、尺度内の中間域にある傾向が見られました。",
      "preview20-intellectImagination-low-observation":
        "今回の20問では、新しい考え方や発想への関心は、尺度内で低めの傾向が見られました。",
      "detail50-intellectImagination-high-observation":
        "今回の50問では、新しい考え方や発想への関心は、尺度内で高めの傾向が見られました。",
      "detail50-intellectImagination-middle-observation":
        "今回の50問では、新しい考え方や発想への関心は、尺度内の中間域にある傾向が見られました。",
      "detail50-intellectImagination-low-observation":
        "今回の50問では、新しい考え方や発想への関心は、尺度内で低めの傾向が見られました。",
    },
  );
});

test("Q-006 E-2/F-2 uses the reviewed preparation and organization wording for conscientiousness observations", () => {
  const byId = new Map(FactorResultTextDefinitions.map((definition) => [
    definition.id,
    definition.text,
  ]));
  assert.deepEqual(
    Object.fromEntries([
      ...["preview20", "detail50"].flatMap((mode) => [
        [`${mode}-conscientiousness-high-observation`, byId.get(`${mode}-conscientiousness-high-observation`)],
        [`${mode}-conscientiousness-middle-observation`, byId.get(`${mode}-conscientiousness-middle-observation`)],
        [`${mode}-conscientiousness-low-observation`, byId.get(`${mode}-conscientiousness-low-observation`)],
      ]),
    ]),
    {
      "preview20-conscientiousness-high-observation":
        "今回の20問では、物事を早めに進めたり整理して取り組んだりする傾向が、尺度内で高めに見られました。",
      "preview20-conscientiousness-middle-observation":
        "今回の20問では、物事を早めに進めたり整理して取り組んだりする傾向が、尺度内の中間域にありました。",
      "preview20-conscientiousness-low-observation":
        "今回の20問では、物事を早めに進めたり整理して取り組んだりする傾向が、尺度内で低めに見られました。",
      "detail50-conscientiousness-high-observation":
        "今回の50問では、準備や整理をしながら物事を進める傾向が、尺度内で高めに見られました。",
      "detail50-conscientiousness-middle-observation":
        "今回の50問では、準備や整理をしながら物事を進める傾向が、尺度内の中間域にありました。",
      "detail50-conscientiousness-low-observation":
        "今回の50問では、準備や整理をしながら物事を進める傾向が、尺度内で低めに見られました。",
    },
  );
});

test("Q-006 E-3/F-3 uses the reviewed interaction wording for extraversion observations", () => {
  const byId = new Map(FactorResultTextDefinitions.map((definition) => [
    definition.id,
    definition.text,
  ]));
  assert.deepEqual(
    Object.fromEntries([
      ...["preview20", "detail50"].flatMap((mode) => [
        [`${mode}-extraversion-high-observation`, byId.get(`${mode}-extraversion-high-observation`)],
        [`${mode}-extraversion-middle-observation`, byId.get(`${mode}-extraversion-middle-observation`)],
        [`${mode}-extraversion-low-observation`, byId.get(`${mode}-extraversion-low-observation`)],
      ]),
    ]),
    {
      "preview20-extraversion-high-observation":
        "今回の20問では、人との会話や人前でのやり取りを好む傾向が、尺度内で高めに見られました。",
      "preview20-extraversion-middle-observation":
        "今回の20問では、人との会話や人前でのやり取りを好む傾向が、尺度内の中間域にありました。",
      "preview20-extraversion-low-observation":
        "今回の20問では、人との会話や人前でのやり取りを好む傾向が、尺度内で低めに見られました。",
      "detail50-extraversion-high-observation":
        "今回の50問では、人との交流や人前に出ることを好む傾向が、尺度内で高めに見られました。",
      "detail50-extraversion-middle-observation":
        "今回の50問では、人との交流や人前に出ることを好む傾向が、尺度内の中間域にありました。",
      "detail50-extraversion-low-observation":
        "今回の50問では、人との交流や人前に出ることを好む傾向が、尺度内で低めに見られました。",
    },
  );
});

test("Q-006 E-4/F-4 uses the reviewed consideration wording for agreeableness observations", () => {
  const byId = new Map(FactorResultTextDefinitions.map((definition) => [
    definition.id,
    definition.text,
  ]));
  assert.deepEqual(
    Object.fromEntries([
      ...["preview20", "detail50"].flatMap((mode) => [
        [`${mode}-agreeableness-high-observation`, byId.get(`${mode}-agreeableness-high-observation`)],
        [`${mode}-agreeableness-middle-observation`, byId.get(`${mode}-agreeableness-middle-observation`)],
        [`${mode}-agreeableness-low-observation`, byId.get(`${mode}-agreeableness-low-observation`)],
      ]),
    ]),
    {
      "preview20-agreeableness-high-observation":
        "今回の20問では、人への関心や相手の気持ちに配慮する傾向が、尺度内で高めに見られました。",
      "preview20-agreeableness-middle-observation":
        "今回の20問では、人への関心や相手の気持ちに配慮する傾向が、尺度内の中間域にありました。",
      "preview20-agreeableness-low-observation":
        "今回の20問では、人への関心や相手の気持ちに配慮する傾向が、尺度内で低めに見られました。",
      "detail50-agreeableness-high-observation":
        "今回の50問では、相手の気持ちに配慮したり人のために行動したりする傾向が、尺度内で高めに見られました。",
      "detail50-agreeableness-middle-observation":
        "今回の50問では、相手の気持ちに配慮したり人のために行動したりする傾向が、尺度内の中間域にありました。",
      "detail50-agreeableness-low-observation":
        "今回の50問では、相手の気持ちに配慮したり人のために行動したりする傾向が、尺度内で低めに見られました。",
    },
  );
});

test("Q-006 F-4 uses the reviewed high-band reflection prompts for agreeableness", () => {
  const highDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "agreeableness"
    && appliesTo.band === "high"
  );
  assert.deepEqual(
    Object.fromEntries(highDetail
      .filter(({ section }) => section !== "observation")
      .map(({ section, text: resultText }) => [
        section,
        resultText,
      ])),
    {
      strength:
        "最近、相手の表情や様子の変化に気づき、「大丈夫？」と自分から声をかけた場面はありましたか。",
      tradeoff:
        "相手を気づかうあまり、自分の本来の作業を後回しにしてしまった場面はありましたか。",
      work:
        "仕事や学びのなかで、困っていそうな人に声をかけたことで、物事がスムーズに運んだ場面はありましたか。",
      relationship:
        "人との会話で、相手の気持ちを確かめながら言葉を選んだことで、落ち着いて話し合えた場面はありましたか。",
      stress:
        "意見が合わないとき、相手を傷つけない言い方を考えすぎて、伝えたいことを言えずに疲れたことはありませんか。",
      question:
        "最近、誰かのために時間を使ったことで、「力になれてよかった」と感じた場面はありましたか。",
      action:
        "もしよければ、最近気になっている相手へ、「最近どう？」と短く声をかけてみませんか。",
    },
  );
});

test("Q-006 F-3 uses the reviewed high-band reflection prompts for extraversion", () => {
  const highDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "extraversion"
    && appliesTo.band === "high"
  );
  assert.deepEqual(
    Object.fromEntries(highDetail
      .filter(({ section }) => section !== "observation")
      .map(({ section, text: resultText }) => [
        section,
        resultText,
      ])),
    {
      strength:
        "最近、人が集まる場で自分から声をかけたことで、会話の輪が自然に広がった場面はありましたか。",
      tradeoff:
        "会話が盛り上がったとき、つい自分が話し続けてしまい、「もう少し相手の話も聞けばよかった」と感じた場面はありましたか。",
      work:
        "仕事や学びのなかで、自分から声をかけたことで、相談や話し合いがスムーズに進んだ場面はありましたか。",
      relationship:
        "初めて会う人や、まだあまり話したことのない人に自分から声をかけたことで、距離が少し縮まった場面はありましたか。",
      stress:
        "人と話したり出かけたりする予定が続いたとき、「少し一人で落ち着きたい」と感じたことはありませんか。",
      question:
        "最近、自分から話しかけたことで、思いがけない話やつながりが生まれた場面はありましたか。",
      action:
        "もしよければ、今日話してみたい人へ、短いあいさつや一言を自分から伝えてみませんか。",
    },
  );
});

test("Q-006 F-3 uses the reviewed middle-band reflection prompts for extraversion", () => {
  const middleDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "extraversion"
    && appliesTo.band === "middle"
  );
  assert.deepEqual(
    Object.fromEntries(middleDetail
      .filter(({ section }) => section !== "observation")
      .map(({ section, text: resultText }) => [
        section,
        resultText,
      ])),
    {
      strength:
        "最近、「自分から話してみよう」と思った場面と、「まずは様子を見よう」と思った場面がありましたか。",
      tradeoff:
        "人が集まる場で、「会話に加わりたい」気持ちと「少し離れて見ていたい」気持ちの間で迷ったことはありましたか。",
      work:
        "仕事や学びのなかで、「自分から相談するか」「もう少し一人で考えてから話すか」で迷った場面はありましたか。",
      relationship:
        "親しい相手とは自然に話せても、初めて会う相手には少し様子を見たくなった場面はありましたか。",
      stress:
        "会話や集まりが続いたとき、「もう少し参加したい」気持ちと「少し一人で休みたい」気持ちの間で迷ったことはありませんか。",
      question:
        "最近、「今日は人と話したい」と感じた日と、「今日は静かに過ごしたい」と感じた日はありましたか。",
      action:
        "もしよければ、次に誰かと話すとき、自分から伝えたいこと、または、相手に聞きたいことを一つだけ決めてみませんか。",
    },
  );
});

test("Q-006 F-3 uses the reviewed low-band reflection prompts for extraversion", () => {
  const lowDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "extraversion"
    && appliesTo.band === "low"
  );
  assert.deepEqual(
    Object.fromEntries(lowDetail
      .filter(({ section }) => section !== "observation")
      .map(({ section, text: resultText }) => [
        section,
        resultText,
      ])),
    {
      strength:
        "最近、大人数の集まりより少人数や静かな場所を選んだことで、落ち着いて話せた場面はありましたか。",
      tradeoff:
        "話したいことがあっても、「今声をかけて大丈夫かな」と考えているうちに、きっかけを逃した場面はありましたか。",
      work:
        "仕事や学びのなかで、一人で考えを整理してから相談したことで、伝えたいことがまとまった場面はありましたか。",
      relationship:
        "親しい人と少人数で過ごしたことで、無理なく自然に話せた場面はありましたか。",
      stress:
        "急に人から注目されたとき、何を話せばよいか分からず、その場から少し離れたくなったことはありませんか。",
      question:
        "最近、すぐに会話へ加わらず、まず周りの様子を見たことで、話しやすいタイミングを見つけられた場面はありましたか。",
      action:
        "もしよければ、伝えたい相手を一人だけ思い浮かべ、話したいことを一文だけメモしてみませんか。",
    },
  );
});

test("Q-006 F-2 uses the reviewed high-band reflection prompts for conscientiousness", () => {
  const highDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "conscientiousness"
    && appliesTo.band === "high"
  );
  assert.deepEqual(
    Object.fromEntries(highDetail.map(({ section, text: resultText }) => [
      section,
      resultText,
    ])),
    {
      observation:
        "今回の50問では、準備や整理をしながら物事を進める傾向が、尺度内で高めに見られました。",
      strength:
        "最近、予定や持ち物をあらかじめ整えておいたことで、落ち着いて取りかかれた場面はありましたか。",
      tradeoff:
        "予定をきちんと立てようとして、手順を細かく決めることに時間がかかってしまった場面はありましたか。",
      work:
        "仕事や学びのなかで、期限から逆算して手順を整理したことで、落ち着いて進められた場面はありましたか。",
      relationship:
        "誰かと一緒に進めるとき、役割や予定を先に確認したことで、お互いに動きやすくなった場面はありましたか。",
      stress:
        "急な変更で予定が崩れたとき、やることの順番を何度も組み直して、かえって疲れたことはありませんか。",
      question:
        "最近、「先に準備しておいてよかった」と、安心したり助かったりした場面はありましたか。",
      action:
        "もしよければ、明日取りかかることを一つ選び、最初の一歩だけメモしてみませんか。",
    },
  );
});

test("Q-006 F-2 uses the reviewed middle-band reflection prompts for conscientiousness", () => {
  const middleDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "conscientiousness"
    && appliesTo.band === "middle"
  );
  assert.deepEqual(
    Object.fromEntries(middleDetail.map(({ section, text: resultText }) => [
      section,
      resultText,
    ])),
    {
      observation:
        "今回の50問では、準備や整理をしながら物事を進める傾向が、尺度内の中間域にありました。",
      strength:
        "最近、「先に準備してから始めよう」と思ったときと、「まずやりながら考えよう」と思ったときがありましたか。",
      tradeoff:
        "予定を立ててもそのとおりに進めるか、その場の状況に合わせて変えるかで迷った場面はありましたか。",
      work:
        "仕事や学びのなかで、「準備を整えてから始めるか」「まず着手して必要なことを後から決めるか」を選んだ場面はありましたか。",
      relationship:
        "誰かと予定を決めるとき、「細かく決めておきたい」気持ちと「大まかでいい」という気持ちの間で迷った場面はありましたか。",
      stress:
        "やることが重なったとき、「順番を決めるか」「目についたものから始めるか」で迷い、少し落ち着かなくなったことはありませんか。",
      question:
        "最近、予定を立てたことで進めやすかった場面や、その場で予定を変えたほうが動きやすかった場面はありましたか。",
      action:
        "もしよければ、明日の予定から「先に決めておきたいこと」を一つだけ選んでみませんか。",
    },
  );
});

test("Q-006 F-2 uses the reviewed low-band reflection prompts for conscientiousness", () => {
  const lowDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "conscientiousness"
    && appliesTo.band === "low"
  );
  assert.deepEqual(
    Object.fromEntries(lowDetail.map(({ section, text: resultText }) => [
      section,
      resultText,
    ])),
    {
      observation:
        "今回の50問では、準備や整理をしながら物事を進める傾向が、尺度内で低めに見られました。",
      strength:
        "最近、細かく準備する前にまず動き始めたことで、早く流れをつかめた場面はありましたか。",
      tradeoff:
        "まず取りかかってから、「先に少し整理しておけばよかった」と感じた場面はありましたか。",
      work:
        "仕事や学びのなかで、まず手を動かし、必要な手順をあとから決めたことで進めやすかった場面はありましたか。",
      relationship:
        "誰かと一緒に進めるとき、予定や役割を細かく決めずに始めて、あとから確認が必要になった場面はありましたか。",
      stress:
        "やることが重なったとき、どれから始めるか決められず、気持ちが落ち着かなくなったことはありませんか。",
      question:
        "最近、「準備より先に始めてよかった」と感じた場面と、「少し整えておけばよかった」と感じた場面はありましたか。",
      action:
        "もしよければ、今気になっていることを一つ選び、「最初にすること」だけメモしてみませんか。",
    },
  );
});

test("Q-006 F-1 uses the reviewed high-band reflection prompts for intellect and imagination", () => {
  const highDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "intellectImagination"
    && appliesTo.band === "high"
  );
  assert.deepEqual(
    Object.fromEntries(highDetail.map(({ section, text: resultText }) => [
      section,
      resultText,
    ])),
    {
      observation:
        "今回の50問では、新しい考え方や発想への関心は、尺度内で高めの傾向が見られました。",
      strength:
        "最近、時間を忘れて新しいアイデアや知識について考えたり、調べたりしたことはありましたか。",
      tradeoff:
        "いろいろな発想が広がったとき、ひとつの結論を選ぶまでに時間がかかった場面はありましたか。",
      work:
        "仕事や学びのなかで、新しいやり方や考え方に「いいな」と惹かれた瞬間はありましたか。",
      relationship:
        "人との対話のなかで、お互いの意見が重なり合い、思いがけず話が大きく広がった経験はありますか。",
      stress:
        "予想外のトラブルが起きたとき、別の見方や可能性を探し続けて、かえって疲れたことはありませんか。",
      question:
        "最近、ふと耳にした言葉や新しい考え方に対して、「もっと深く調べてみたい」と好奇心をくすぐられたことはありますか。",
      action:
        "もしよければ、今日心に残った「キーワード」や「気づき」を、スマホや手帳に一つだけ書き留めてみませんか。",
    },
  );
});

test("Q-006 F-1 uses the reviewed middle-band reflection prompts for intellect and imagination", () => {
  const middleDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "intellectImagination"
    && appliesTo.band === "middle"
  );
  assert.deepEqual(
    Object.fromEntries(middleDetail.map(({ section, text: resultText }) => [
      section,
      resultText,
    ])),
    {
      observation:
        "今回の50問では、新しい考え方や発想への関心は、尺度内の中間域にある傾向が見られました。",
      strength:
        "最近、「もう少し調べるか」「まずはやってみるか、ここで区切るか」を選んだ場面はありましたか。",
      tradeoff:
        "少し複雑なテーマについて、「じっくり考えたい」と感じるときと、「今は少し疲れる」と感じるときがありましたか。",
      work:
        "仕事や学びのなかで、「慣れたやり方で確実に進めるか」「少し時間がかかっても新しい方法を試すか」、どちらで進めるか考えた場面はありましたか。",
      relationship:
        "相手の考えを聞きながら、「もう少し掘り下げたい」気持ちと「そろそろ別の話題に移りたい」気持ちの間で迷った場面はありましたか。",
      stress:
        "情報が多いとき、「いろいろな視点を取り入れるか」「いったん一つに絞るか」で迷った場面はありましたか。",
      question:
        "最近、気になったことについて、「このくらい分かれば十分」と、自分なりに区切りをつけた場面はありましたか。",
      action:
        "もしよければ、最近少しだけ気になっているテーマについて、「時間があれば調べてみたいこと」を一つメモしてみませんか。",
    },
  );
});

test("Q-006 F-1 uses the reviewed low-band reflection prompts for intellect and imagination", () => {
  const lowDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "intellectImagination"
    && appliesTo.band === "low"
  );
  assert.deepEqual(
    Object.fromEntries(lowDetail.map(({ section, text: resultText }) => [
      section,
      resultText,
    ])),
    {
      observation:
        "今回の50問では、新しい考え方や発想への関心は、尺度内で低めの傾向が見られました。",
      strength:
        "最近、抽象的な説明を、自分の経験や具体的な事実に基づいて分かりやすくまとめ直した場面はありましたか。",
      tradeoff:
        "抽象的な話題が続いたとき、「結局、何をどうすればいいのだろう」と現実味が湧かず、戸惑った場面はありましたか。",
      work:
        "仕事や学びのなかで、手順やマニュアルなど、具体的な形があるほうが進めやすいと感じた出来事はありましたか。",
      relationship:
        "人との会話で、理想や仮定の話よりも、具体的な出来事に戻したくなった場面はありましたか。",
      stress:
        "考える範囲が広がったとき、「まずは目の前で確かめられることから決めよう」と、考える範囲を絞った場面はありましたか。",
      question:
        "最近、実際に手を動かしたり現物を見たりしたことで、物事が理解しやすくなったと感じた経験はありましたか。",
      action:
        "よければ、今日見聞きした少し難しい話を、「自分の生活で言うとどうなるか」に当てはめて考えてみませんか。",
    },
  );
});

test("preview observations use only the four selected items for each reviewed factor", () => {
  const byId = new Map(FactorResultTextDefinitions.map((definition) => [
    definition.id,
    definition,
  ]));
  for (const band of BANDS) {
    const extraversion = byId.get(`preview20-extraversion-${band}-observation`);
    assert.match(extraversion.text, /人との会話や人前でのやり取りを好む傾向/);
    assert.doesNotMatch(extraversion.text, /自分から話しかけ|注目を集め/);
  }
  const emotionalStabilityLow = byId.get(
    "preview20-emotionalStability-low-observation",
  );
  assert.match(emotionalStabilityLow.text, /慌て|気分の揺れ|落ち込み/);
  assert.doesNotMatch(emotionalStabilityLow.text, /心配/);
});

test("50-question detail copy separates scale observations from presentation prompts", () => {
  const detailDefinitions = FactorResultTextDefinitions.filter(
    ({ appliesTo }) => appliesTo.mode === "detail50",
  );
  assert.equal(detailDefinitions.length, 120);
  for (const definition of detailDefinitions) {
    assert.equal(definition.appliesTo.questionCount, 50);
    assert.equal(definition.previewAllowed, false);
    if (SCALE_SECTIONS.has(definition.section)) {
      assert.deepEqual(definition.evidenceRefs, [
        "evidence-ipip-japanese-markers",
        "evidence-ipip-50-item-scale",
      ]);
    }
    if (PROMPT_SECTIONS.has(definition.section)) {
      assert.deepEqual(
        definition.evidenceRefs,
        ["evidence-result-presentation-contract"],
      );
    }
    if (definition.section === "observation") {
      assert.match(definition.text, /^今回の50問では/);
    }
    if (PROMPT_SECTIONS.has(definition.section) && definition.section !== "action") {
      assert.equal(definition.claimKind, "reflectionPrompt");
      assert.match(definition.text, /(?:ましたか|ありますか|ありませんか)。$/);
    }
    if (definition.section === "action") {
      assert.match(definition.text, /^(?:もしよければ|よければ|無理のない範囲で|気が向けば)/);
      assert.match(definition.text, /みませんか。$/);
    }
  }
});

test("factor copy avoids prohibited labels, guarantees, and abstract wording", () => {
  for (const definition of FactorResultTextDefinitions) {
    assert.doesNotMatch(
      definition.text,
      /能力が高|能力が低|優れて|劣って|有能|才能|欠点|冷淡|弱い人|適職|向いている仕事|相性|治療|能力改善|前に出る傾向|連続したスコア/,
      definition.id,
    );
    if (definition.appliesTo.band === "middle") {
      assert.doesNotMatch(
        definition.text,
        /バランス|平均的|普通|理想/,
        definition.id,
      );
    }
    if (["strength", "tradeoff"].includes(definition.section)) {
      assert.doesNotMatch(
        definition.text,
        /面がうかがえます|こともありそうです/,
        definition.id,
      );
      assert.match(definition.text, /ましたか。$/, definition.id);
    }
  }
});

test("reviewed strength and tradeoff copy opens concrete reflection without opposite-strength claims", () => {
  const reflectionDefinitions = FactorResultTextDefinitions.filter(
    ({ section }) => ["strength", "tradeoff"].includes(section),
  );
  assert.equal(reflectionDefinitions.length, 30);
  assert.equal(
    reflectionDefinitions.every(({ claimKind }) => claimKind === "reflectionPrompt"),
    true,
  );
  const extraversionLowStrength = reflectionDefinitions.find(
    ({ id }) => id === "detail50-extraversion-low-strength",
  );
  assert.match(extraversionLowStrength.text, /少人数|静かな場所/);
});

test("factor content is an explicit literal catalog without runtime generation", async () => {
  const source = await readFile(
    new URL("../js/data/factor-result-text-definitions.js", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    source,
    /\.(?:map|flatMap|reduce)\s*\(|\b(?:for|while)\s*\(|Array\.from|function\s|=>/,
  );
  assert.equal(Object.isFrozen(FactorResultTextDefinitions), true);
  assert.equal(Object.isFrozen(ResultTextDefinitions), true);
});
