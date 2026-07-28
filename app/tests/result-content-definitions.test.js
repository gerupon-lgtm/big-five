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
    assert.match(extraversion.text, /人との会話や集まりでのふるまい/);
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
