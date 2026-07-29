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
import { TitleReflectionDefinitions } from "../js/data/title-reflection-definitions.js";
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
const titleReflection = {
  id: "title-reflection-balanced-1",
  version: "result-text-v2",
  appliesTo: { titleId: "title-balanced" },
  section: "titleReflection",
  claimKind: "reflectionPrompt",
  text: "最近、状況に合わせて対応を変えたのはどんなときでしたか。",
  evidenceRefs: ["evidence-result-presentation-contract"],
  previewAllowed: true,
};

test("Q-006 schemas accept exact evidence and result text", () => {
  assert.equal(validateResultEvidenceDefinitions([evidence]).length, 1);
  assert.equal(validateResultTextDefinitions([text]).length, 1);
  assert.deepEqual(RESULT_TEXT_SECTIONS, [
    "titleSubtitle", "titleReason", "titleReflection", "observation", "strength", "tradeoff",
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
  assert.equal(validateResultTextDefinitions([titleReflection]).length, 1);
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
  assert.throws(
    () => validateResultTextDefinitions([{
      ...titleReflection,
      id: "title-reflection-balanced-2",
      previewAllowed: true,
    }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
  assert.throws(
    () => validateResultTextDefinitions([{
      ...titleReflection,
      previewAllowed: false,
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
  assert.equal(validateResultContentDefinitions({
    ...valid,
    evidenceDefinitions: ResultEvidenceDefinitions,
    textDefinitions: [{ ...titleReflection }],
    resultTextVersion: "result-text-v2",
  }), true);
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
  assert.throws(
    () => validateResultContentDefinitions({
      ...valid,
      textDefinitions: [{ ...text, version: "result-text-v2" }],
    }),
    /RESULT_CONTENT_INVALID/,
  );
  assert.throws(
    () => validateResultContentDefinitions({
      ...valid,
      textDefinitions: [{ ...text, version: "result-text-v3" }],
      resultTextVersion: "result-text-v3",
    }),
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

test("Q-006 T-0 uses the approved balanced and single-title copy", () => {
  assert.deepEqual(Q006_TITLE_CATALOG.slice(0, 11), [
    { titleId: "title-balanced", label: "五つの風を見渡す観測者" },
    { titleId: "title-single-intellectImagination-high", label: "おいかける探究者" },
    { titleId: "title-single-intellectImagination-low", label: "手ざわりをたどる散策者" },
    { titleId: "title-single-conscientiousness-high", label: "整然たる計画者" },
    { titleId: "title-single-conscientiousness-low", label: "風向きに道を変える漂泊者" },
    { titleId: "title-single-extraversion-high", label: "にぎわいへ進む交遊者" },
    { titleId: "title-single-extraversion-low", label: "静謐なる滞在者" },
    { titleId: "title-single-agreeableness-high", label: "歩幅をそろえる同伴者" },
    { titleId: "title-single-agreeableness-low", label: "自分の歩幅で進む同行者" },
    { titleId: "title-single-emotionalStability-high", label: "静かなる航行者" },
    { titleId: "title-single-emotionalStability-low", label: "そよ風に振り向く感受者" },
  ]);

  const t0TitleIds = new Set(Q006_TITLE_CATALOG.slice(0, 11).map(({ titleId }) => titleId));
  assert.deepEqual(
    Object.fromEntries(TitleResultTextDefinitions
      .filter(({ appliesTo }) => t0TitleIds.has(appliesTo.titleId))
      .map(({ id, text: resultText }) => [id, resultText])),
    {
      "title-balanced-subtitle":
        "五つの傾向が近い範囲に集まるバランス派",
      "title-balanced-reason":
        "今回の回答では、特定の傾向だけが強く前面に出るというより五つの因子すべてが尺度内の中間域に収まりました。五つの傾向をまんべんなく見渡すような結果から、今回はこの称号になりました。",
      "title-single-intellectImagination-high-subtitle":
        "新しい考えや未知のテーマを追いかける探究派",
      "title-single-intellectImagination-high-reason":
        "今回の回答では、新しい考え方や未知のテーマに関心を向ける回答が比較的多く見られました。ほかの四つの因子は中間域だったため「おいかける探究者」という称号になりました。",
      "title-single-intellectImagination-low-subtitle":
        "具体的で確かな内容を重視する現実派",
      "title-single-intellectImagination-low-reason":
        "今回の回答では、抽象的な発想を広げることより具体的で確かめやすい内容に関心を向ける回答が多く見られました。ほかの四つの因子は中間域だったため「手ざわりをたどる散策者」という称号になりました。",
      "title-single-conscientiousness-high-subtitle":
        "予定や手順を整えて進める計画派",
      "title-single-conscientiousness-high-reason":
        "今回の回答では、予定や手順を整えて準備しながら物事を進める回答が比較的多く見られました。ほかの四つの因子は中間域だったため「整然たる計画者」という称号になりました。",
      "title-single-conscientiousness-low-subtitle":
        "計画を固めるより状況を見ながら進めるマイペース派",
      "title-single-conscientiousness-low-reason":
        "今回の回答では、先に計画を固めるよりその時々の状況や関心に応じて進める回答が多く見られました。ほかの四つの因子は中間域だったため「風向きに道を変える漂泊者」という称号になりました。",
      "title-single-extraversion-high-subtitle":
        "人との交流や活気のある場を好む社交派",
      "title-single-extraversion-high-reason":
        "今回の回答では、人との交流や活気のある場に関心を向ける回答が比較的多く見られました。ほかの四つの因子は中間域だったため「にぎわいへ進む交遊者」という称号になりました。",
      "title-single-extraversion-low-subtitle":
        "落ち着いた環境や少人数での交流を好む少人数派",
      "title-single-extraversion-low-reason":
        "今回の回答では、にぎやかな交流より落ち着いた環境や少人数での関わりを選ぶ回答が比較的多く見られました。ほかの四つの因子は中間域だったため「静謐なる滞在者」という称号になりました。",
      "title-single-agreeableness-high-subtitle":
        "相手の気持ちや周囲との調和を大切にする協調重視派",
      "title-single-agreeableness-high-reason":
        "今回の回答では、相手の立場や気持ちを考えながら周囲との調和を大切にする回答が比較的多く見られました。ほかの四つの因子は中間域だったため「歩幅をそろえる同伴者」という称号になりました。",
      "title-single-agreeableness-low-subtitle":
        "周囲に合わせるより自分の判断を大切にする自分軸派",
      "title-single-agreeableness-low-reason":
        "今回の回答では、周囲との調和より自分の判断や基準をもとに関わる回答が比較的多く見られました。ほかの四つの因子は中間域だったため「自分の歩幅で進む同行者」という称号になりました。",
      "title-single-emotionalStability-high-subtitle":
        "予想外のときにも落ち着きを保つ安定派",
      "title-single-emotionalStability-high-reason":
        "今回の回答では、感情の揺れや緊張に大きく左右されにくく落ち着きを保つ回答が比較的多く見られました。ほかの四つの因子は中間域だったため「静かなる航行者」という称号になりました。",
      "title-single-emotionalStability-low-subtitle":
        "心配や気分の変化を感じ取る繊細派",
      "title-single-emotionalStability-low-reason":
        "今回の回答では、心配や気分の変化を感じやすいことを示す回答が比較的多く見られました。ほかの四つの因子は中間域だったため「そよ風に振り向く感受者」という称号になりました。",
    },
  );
});

test("Q-006 T-1 uses the approved title catalog No.12-21 copy", () => {
  assert.deepEqual(Q006_TITLE_CATALOG.slice(11, 21), [
    { titleId: "title-pair-intellectImagination-high--conscientiousness-high", label: "星座盤に印を置く記録者" },
    { titleId: "title-pair-intellectImagination-high--conscientiousness-low", label: "風まかせの空想者" },
    { titleId: "title-pair-intellectImagination-low--conscientiousness-high", label: "素朴な継続者" },
    { titleId: "title-pair-intellectImagination-low--conscientiousness-low", label: "気ままな遊歩者" },
    { titleId: "title-pair-intellectImagination-high--extraversion-high", label: "新風を運ぶ伝達者" },
    { titleId: "title-pair-intellectImagination-high--extraversion-low", label: "静寂に星座盤を見つめる探索者" },
    { titleId: "title-pair-intellectImagination-low--extraversion-high", label: "にぎわいの談話者" },
    { titleId: "title-pair-intellectImagination-low--extraversion-low", label: "窓辺の逗留者" },
    { titleId: "title-pair-intellectImagination-high--agreeableness-high", label: "寄り添う共鳴者" },
    { titleId: "title-pair-intellectImagination-high--agreeableness-low", label: "独歩の開拓者" },
  ]);

  const t1TitleIds = new Set(Q006_TITLE_CATALOG.slice(11, 21).map(({ titleId }) => titleId));
  assert.deepEqual(
    Object.fromEntries(TitleResultTextDefinitions
      .filter(({ appliesTo }) => t1TitleIds.has(appliesTo.titleId))
      .map(({ id, text: resultText }) => [id, resultText])),
    {
      "title-pair-intellectImagination-high--conscientiousness-high-subtitle":
        "新しいアイデアを計画的に形にする実行派",
      "title-pair-intellectImagination-high--conscientiousness-high-reason":
        "今回の回答では、新しい可能性を考える回答と計画的に整理して進める回答の両方が比較的多く見られました。発想を広げながら手順や成果物として形にしようとする組み合わせから「星座盤に印を置く記録者」という称号になりました。",
      "title-pair-intellectImagination-high--conscientiousness-low-subtitle":
        "新しい発想を自由に広げるひらめき派",
      "title-pair-intellectImagination-high--conscientiousness-low-reason":
        "今回の回答では、新しい発想や可能性に関心を向けやすい一方で決められた手順や継続的な管理にはこだわりが少ない傾向が見られました。興味に応じて柔軟に方向を変える組み合わせから「風まかせの空想者」という称号になりました。",
      "title-pair-intellectImagination-low--conscientiousness-high-subtitle":
        "具体的な手順を着実に続ける堅実派",
      "title-pair-intellectImagination-low--conscientiousness-high-reason":
        "今回の回答では、具体的で確認しやすい方法を選ぶ回答と計画的に続ける回答の両方が比較的多く見られました。定められた手順を安定して実行する組み合わせから「素朴な継続者」という称号になりました。",
      "title-pair-intellectImagination-low--conscientiousness-low-subtitle":
        "身近な状況を見ながら柔軟に動くマイペース派",
      "title-pair-intellectImagination-low--conscientiousness-low-reason":
        "今回の回答では、抽象的な発想や細かな計画よりその場で分かりやすいことに対応する回答が比較的多く見られました。身近な状況を基準に行動を選ぶ組み合わせから「気ままな遊歩者」という称号になりました。",
      "title-pair-intellectImagination-high--extraversion-high-subtitle":
        "新しいアイデアを人と共有して広げる発信派",
      "title-pair-intellectImagination-high--extraversion-high-reason":
        "今回の回答では、新しい考えや可能性への関心を示す回答と人との交流を好む回答の両方が比較的多く見られました。対話を通じて発想を広げる組み合わせから「新風を運ぶ伝達者」という称号になりました。",
      "title-pair-intellectImagination-high--extraversion-low-subtitle":
        "静かな環境で考えを深める思索派",
      "title-pair-intellectImagination-high--extraversion-low-reason":
        "今回の回答では、新しい概念や複雑なテーマを深く考える回答と静かな環境を選ぶ回答が比較的多く見られました。交流の量より内面的な探究を重視する組み合わせから「静寂に星座盤を見つめる探索者」という称号になりました。",
      "title-pair-intellectImagination-low--extraversion-high-subtitle":
        "身近な話題を人と楽しむ社交派",
      "title-pair-intellectImagination-low--extraversion-high-reason":
        "今回の回答では、身近で具体的な話題に関心を向ける回答と人との交流を好む回答が比較的多く見られました。実際の出来事や経験を通じて交流を広げる組み合わせから「にぎわいの談話者」という称号になりました。",
      "title-pair-intellectImagination-low--extraversion-low-subtitle":
        "身近なことを静かな環境で確かめる現実派",
      "title-pair-intellectImagination-low--extraversion-low-reason":
        "今回の回答では、具体的で身近な事柄を選ぶ回答と落ち着いた環境を好む回答が比較的多く見られました。刺激の多い交流や抽象的な思考より慣れた環境で静かに物事を進めるという組み合わせから「窓辺の逗留者」という称号になりました。",
      "title-pair-intellectImagination-high--agreeableness-high-subtitle":
        "多様な考えを受け止めて共通点を探す協調派",
      "title-pair-intellectImagination-high--agreeableness-high-reason":
        "今回の回答では、多様な考えや新しい可能性への関心を示す回答と相手の立場や感情に配慮する回答の両方が比較的多く見られました。異なる意見の間に共通点を見つけようとする組み合わせから「寄り添う共鳴者」という称号になりました。",
      "title-pair-intellectImagination-high--agreeableness-low-subtitle":
        "新しい可能性を自分の基準で追う独自路線派",
      "title-pair-intellectImagination-high--agreeableness-low-reason":
        "今回の回答では、新しい可能性への関心を示す回答と周囲との一致より自分の判断を重視する回答が比較的多く見られました。発想の独自性や自分なりの納得を大切にする組み合わせから「独歩の開拓者」という称号になりました。",
    },
  );
});

test("Q-006 T-2 uses the approved title catalog No.22-31 copy", () => {
  assert.deepEqual(Q006_TITLE_CATALOG.slice(21, 31), [
    { titleId: "title-pair-intellectImagination-low--agreeableness-high", label: "分かち合う同席者" },
    { titleId: "title-pair-intellectImagination-low--agreeableness-low", label: "標を示す表明者" },
    { titleId: "title-pair-intellectImagination-high--emotionalStability-high", label: "凪空を仰ぐ観望者" },
    { titleId: "title-pair-intellectImagination-high--emotionalStability-low", label: "鈴音に振り向く探訪者" },
    { titleId: "title-pair-intellectImagination-low--emotionalStability-high", label: "日だまりの静観者" },
    { titleId: "title-pair-intellectImagination-low--emotionalStability-low", label: "雨音に振り向く歩行者" },
    { titleId: "title-pair-conscientiousness-high--extraversion-high", label: "刻限に集う交流者" },
    { titleId: "title-pair-conscientiousness-high--extraversion-low", label: "灯下の記録者" },
    { titleId: "title-pair-conscientiousness-low--extraversion-high", label: "道草の合流者" },
    { titleId: "title-pair-conscientiousness-low--extraversion-low", label: "余白を楽しむ散策者" },
  ]);

  const t2TitleIds = new Set(Q006_TITLE_CATALOG.slice(21, 31).map(({ titleId }) => titleId));
  assert.deepEqual(
    Object.fromEntries(TitleResultTextDefinitions
      .filter(({ appliesTo }) => t2TitleIds.has(appliesTo.titleId))
      .map(({ id, text: resultText }) => [id, resultText])),
    {
      "title-pair-intellectImagination-low--agreeableness-high-subtitle":
        "身近な助け合いを大切にする協力派",
      "title-pair-intellectImagination-low--agreeableness-high-reason":
        "今回の回答では、身近で具体的な事柄を基準にする回答と相手との調和や助け合いを大切にする回答が比較的多く見られました。具体的な助け合いや共通の経験を通じて関係を築こうとする組み合わせから「分かち合う同席者」という称号になりました。",
      "title-pair-intellectImagination-low--agreeableness-low-subtitle":
        "具体的な事実をもとに判断する自分軸派",
      "title-pair-intellectImagination-low--agreeableness-low-reason":
        "今回の回答では、具体的な事実や経験を基準にする回答と周囲に合わせるより自分の判断を重視する回答が比較的多く見られました。実際に確認できる内容をもとに自分の考えを示す組み合わせから「標を示す表明者」という称号になりました。",
      "title-pair-intellectImagination-high--emotionalStability-high-subtitle":
        "広い視野で落ち着いて考える冷静派",
      "title-pair-intellectImagination-high--emotionalStability-high-reason":
        "今回の回答では、新しい可能性や複雑なテーマに関心を向ける回答と感情の揺れには左右されにくいことを示す回答が比較的多く見られました。落ち着いた状態で物事を広く捉える組み合わせから「凪空を仰ぐ観望者」という称号になりました。",
      "title-pair-intellectImagination-high--emotionalStability-low-subtitle":
        "多くの可能性や変化を感じ取る繊細派",
      "title-pair-intellectImagination-high--emotionalStability-low-reason":
        "今回の回答では、新しい考えや可能性に関心を向ける回答と周囲の変化や不確実さに敏感なことを示す回答が比較的多く見られました。多くの可能性と懸念の両方へ意識が向く組み合わせから「鈴音に振り向く探訪者」という称号になりました。",
      "title-pair-intellectImagination-low--emotionalStability-high-subtitle":
        "確かな情報をもとに落ち着いて進める堅実派",
      "title-pair-intellectImagination-low--emotionalStability-high-reason":
        "今回の回答では、具体的で確かめやすい情報を重視する回答と感情の揺れには左右されにくいことを示す回答が比較的多く見られました。身近な現実を落ち着いて受け止める組み合わせから「日だまりの静観者」という称号になりました。",
      "title-pair-intellectImagination-low--emotionalStability-low-subtitle":
        "身近な出来事や変化に気づく現実派",
      "title-pair-intellectImagination-low--emotionalStability-low-reason":
        "今回の回答では、具体的で身近な出来事を重視する回答と周囲の変化や不確実な状況に敏感なことを示す回答が比較的多く見られました。目の前で起きた変化に意識が向く組み合わせから「雨音に振り向く歩行者」という称号になりました。",
      "title-pair-conscientiousness-high--extraversion-high-subtitle":
        "計画性と社交性をあわせ持つ行動派",
      "title-pair-conscientiousness-high--extraversion-high-reason":
        "今回の回答では、計画や役割を意識して行動する回答と人との交流に積極的に参加する回答の両方が比較的多く見られました。周囲と関わりながら活動を前へ進めようとする組み合わせから「刻限に集う交流者」という称号になりました。",
      "title-pair-conscientiousness-high--extraversion-low-subtitle":
        "静かな環境で計画的に進めるコツコツ派",
      "title-pair-conscientiousness-high--extraversion-low-reason":
        "今回の回答では、落ち着いた環境を選ぶ回答と計画や手順を整えて物事を進める回答が比較的多く見られました。人前で積極的に働きかけるより自分の担当を丁寧に進める組み合わせから「灯下の記録者」という称号になりました。",
      "title-pair-conscientiousness-low--extraversion-high-subtitle":
        "人との交流に合わせて柔軟に動く自由派",
      "title-pair-conscientiousness-low--extraversion-high-reason":
        "今回の回答では、細かな計画に沿うことより人との交流やその場の流れに応じて行動を変える回答が比較的多く見られました。予定外の出来事や誘いにも柔軟に反応する組み合わせから「道草の合流者」という称号になりました。",
      "title-pair-conscientiousness-low--extraversion-low-subtitle":
        "細かな予定に縛られず静かに取り組むマイペース派",
      "title-pair-conscientiousness-low--extraversion-low-reason":
        "今回の回答では、細かな予定に縛られず静かな環境で自分のペースを保とうとする回答が比較的多く見られました。外部からの働きかけや期限よりその時の状態に合わせて動く組み合わせから「余白を楽しむ散策者」という称号になりました。",
    },
  );
});

test("Q-006 T-3 uses the approved title catalog No.32-41 copy", () => {
  assert.deepEqual(Q006_TITLE_CATALOG.slice(31, 41), [
    { titleId: "title-pair-conscientiousness-high--agreeableness-high", label: "輪を整える準備者" },
    { titleId: "title-pair-conscientiousness-high--agreeableness-low", label: "線を引く整頓者" },
    { titleId: "title-pair-conscientiousness-low--agreeableness-high", label: "寄り道をともにする同行者" },
    { titleId: "title-pair-conscientiousness-low--agreeableness-low", label: "自由な独行者" },
    { titleId: "title-pair-conscientiousness-high--emotionalStability-high", label: "凪の計画者" },
    { titleId: "title-pair-conscientiousness-high--emotionalStability-low", label: "揺れ灯の整頓者" },
    { titleId: "title-pair-conscientiousness-low--emotionalStability-high", label: "流れをゆく漂泊者" },
    { titleId: "title-pair-conscientiousness-low--emotionalStability-low", label: "揺れ影の遊歩者" },
    { titleId: "title-pair-extraversion-high--agreeableness-high", label: "輪舞へ踏み出す共演者" },
    { titleId: "title-pair-extraversion-high--agreeableness-low", label: "自分の色を掲げる表明者" },
  ]);

  const t3TitleIds = new Set(Q006_TITLE_CATALOG.slice(31, 41).map(({ titleId }) => titleId));
  assert.deepEqual(
    Object.fromEntries(TitleResultTextDefinitions
      .filter(({ appliesTo }) => t3TitleIds.has(appliesTo.titleId))
      .map(({ id, text: resultText }) => [id, resultText])),
    {
      "title-pair-conscientiousness-high--agreeableness-high-subtitle":
        "計画性と協調性をあわせ持つサポート派",
      "title-pair-conscientiousness-high--agreeableness-high-reason":
        "今回の回答では、計画や役割を丁寧に整える回答と周囲との協力を大切にする回答の両方が比較的多く見られました。全体が円滑に進むよう準備や調整に意識が向く組み合わせから「輪を整える準備者」という称号になりました。",
      "title-pair-conscientiousness-high--agreeableness-low-subtitle":
        "自分の基準に沿って着実に進める実務派",
      "title-pair-conscientiousness-high--agreeableness-low-reason":
        "今回の回答では、目標やルールを明確にする回答と周囲の希望より自分の基準を重視する回答が比較的多く見られました。目標やルールを定めながら自分の基準に沿って進める組み合わせから「線を引く整頓者」という称号になりました。",
      "title-pair-conscientiousness-low--agreeableness-high-subtitle":
        "計画より相手の希望を優先する柔軟派",
      "title-pair-conscientiousness-low--agreeableness-high-reason":
        "今回の回答では、細かな計画にこだわらない回答と相手の希望や状況に合わせようとする回答が比較的多く見られました。予定よりその場の関係や気持ちを優先する組み合わせから「寄り道をともにする同行者」という称号になりました。",
      "title-pair-conscientiousness-low--agreeableness-low-subtitle":
        "手順や周囲に縛られず動く自由派",
      "title-pair-conscientiousness-low--agreeableness-low-reason":
        "今回の回答では、決められた手順にこだわらない回答と周囲の期待より自分の判断を重視する回答が比較的多く見られました。その時々の必要性や関心を基準に方向を選ぶ組み合わせから「自由な独行者」という称号になりました。",
      "title-pair-conscientiousness-high--emotionalStability-high-subtitle":
        "計画を立てて落ち着いて進める安定派",
      "title-pair-conscientiousness-high--emotionalStability-high-reason":
        "今回の回答では、計画や責任を意識する回答と感情の揺れには左右されにくいことを示す回答が比較的多く見られました。予期しない状況でも手順を整理して落ち着いて対応する組み合わせから「凪の計画者」という称号になりました。",
      "title-pair-conscientiousness-high--emotionalStability-low-subtitle":
        "心配に備えて丁寧に準備を進める慎重派",
      "title-pair-conscientiousness-high--emotionalStability-low-reason":
        "今回の回答では、心配や緊張を感じやすいことを示す回答と計画や確認を丁寧に行う回答が比較的多く見られました。不確実さを減らすため準備を重ねる組み合わせから「揺れ灯の整頓者」という称号になりました。",
      "title-pair-conscientiousness-low--emotionalStability-high-subtitle":
        "予定にこだわらず落ち着いて行動する柔軟派",
      "title-pair-conscientiousness-low--emotionalStability-high-reason":
        "今回の回答では、細かな計画にこだわらない回答と感情の揺れには左右されにくいことを示す回答が比較的多く見られました。状況の変化を落ち着いて受け止めながら柔軟に動く組み合わせから「流れをゆく漂泊者」という称号になりました。",
      "title-pair-conscientiousness-low--emotionalStability-low-subtitle":
        "気持ちの変化に合わせて予定を見直す繊細派",
      "title-pair-conscientiousness-low--emotionalStability-low-reason":
        "今回の回答では、状況や感情の変化に反応しやすいことを示す回答と定めた計画よりその時の状態に応じて行動を変える回答が比較的多く見られました。負担を感じたときに予定を見直す傾向が見られる組み合わせから「揺れ影の遊歩者」という称号になりました。",
      "title-pair-extraversion-high--agreeableness-high-subtitle":
        "人との交流と場の調和を大切にする社交派",
      "title-pair-extraversion-high--agreeableness-high-reason":
        "今回の回答では、人との交流に積極的な回答と相手の立場や場の調和を大切にする回答の両方が比較的多く見られました。周囲と関わりながら協力的な雰囲気を作ろうとする組み合わせから「輪舞へ踏み出す共演者」という称号になりました。",
      "title-pair-extraversion-high--agreeableness-low-subtitle":
        "人と関わりながら自分の意見を示す発信派",
      "title-pair-extraversion-high--agreeableness-low-reason":
        "今回の回答では、人との関わりに積極的な回答と自分の意見や立場を率直に示す回答が比較的多く見られました。周囲の反応を待つより自ら話題を出して行動を起こす組み合わせから「自分の色を掲げる表明者」という称号になりました。",
    },
  );
});

test("Q-006 T-4 uses the approved title catalog No.42-51 copy", () => {
  assert.deepEqual(Q006_TITLE_CATALOG.slice(41, 51), [
    { titleId: "title-pair-extraversion-low--agreeableness-high", label: "寄り添う静観者" },
    { titleId: "title-pair-extraversion-low--agreeableness-low", label: "一席を選ぶ滞在者" },
    { titleId: "title-pair-extraversion-high--emotionalStability-high", label: "寛ぐ交遊者" },
    { titleId: "title-pair-extraversion-high--emotionalStability-low", label: "ざわめきへ振り向く参加者" },
    { titleId: "title-pair-extraversion-low--emotionalStability-high", label: "芽吹きを待つ滞在者" },
    { titleId: "title-pair-extraversion-low--emotionalStability-low", label: "薄明に耳を向ける逗留者" },
    { titleId: "title-pair-agreeableness-high--emotionalStability-high", label: "ふたつの杯の相席者" },
    { titleId: "title-pair-agreeableness-high--emotionalStability-low", label: "揺れ布に並ぶ同伴者" },
    { titleId: "title-pair-agreeableness-low--emotionalStability-high", label: "淡々たる表明者" },
    { titleId: "title-pair-agreeableness-low--emotionalStability-low", label: "風鳴る戸口の掲示者" },
  ]);

  const t4TitleIds = new Set(Q006_TITLE_CATALOG.slice(41, 51).map(({ titleId }) => titleId));
  assert.deepEqual(
    Object.fromEntries(TitleResultTextDefinitions
      .filter(({ appliesTo }) => t4TitleIds.has(appliesTo.titleId))
      .map(({ id, text: resultText }) => [id, resultText])),
    {
      "title-pair-extraversion-low--agreeableness-high-subtitle":
        "前に出るより静かに相手を支える聞き役",
      "title-pair-extraversion-low--agreeableness-high-reason":
        "今回の回答では、前に出て交流を広げるより落ち着いた関わりを選ぶ回答と相手を支えようとする回答が比較的多く見られました。言葉数より注意深く話を聞くことを重視する組み合わせから「寄り添う静観者」という称号になりました。",
      "title-pair-extraversion-low--agreeableness-low-subtitle":
        "自分に合う距離と居場所を選ぶマイペース派",
      "title-pair-extraversion-low--agreeableness-low-reason":
        "今回の回答では、広い交流を求めない回答と周囲との同調より自分の判断を重視する回答が比較的多く見られました。自分に合う距離や居場所を選びながら自分の基準を保つ組み合わせから「一席を選ぶ滞在者」という称号になりました。",
      "title-pair-extraversion-high--emotionalStability-high-subtitle":
        "人との交流を落ち着いて楽しむ社交派",
      "title-pair-extraversion-high--emotionalStability-high-reason":
        "今回の回答では、人との交流を好む回答と緊張や感情の揺れには左右されにくいことを示す回答が比較的多く見られました。活気のある場にも自然体で参加する組み合わせから「寛ぐ交遊者」という称号になりました。",
      "title-pair-extraversion-high--emotionalStability-low-subtitle":
        "交流を楽しみながら周囲の反応も感じ取る繊細派",
      "title-pair-extraversion-high--emotionalStability-low-reason":
        "今回の回答では、人との交流や周囲の動きに積極的に反応する回答と場の雰囲気や相手の反応に敏感なことを示す回答が比較的多く見られました。交流から刺激を受けながら評価や変化にも意識が向く組み合わせから「ざわめきへ振り向く参加者」という称号になりました。",
      "title-pair-extraversion-low--emotionalStability-high-subtitle":
        "静かな環境や一人の時間を大切にする安定派",
      "title-pair-extraversion-low--emotionalStability-high-reason":
        "今回の回答では、落ち着いた環境や一人の時間を好む回答と感情の揺れには左右されにくいことを示す回答が比較的多く見られました。急いで外へ働きかけるより適切な時機を待つ組み合わせから「芽吹きを待つ滞在者」という称号になりました。",
      "title-pair-extraversion-low--emotionalStability-low-subtitle":
        "静かな環境で周囲の変化に耳を澄ます繊細派",
      "title-pair-extraversion-low--emotionalStability-low-reason":
        "今回の回答では、静かな環境を選ぶ回答と周囲の変化や人からの反応に敏感なことを示す回答が比較的多く見られました。刺激の多い場面では慎重になり自分の内側で状況を確かめる組み合わせから「薄明に耳を向ける逗留者」という称号になりました。",
      "title-pair-agreeableness-high--emotionalStability-high-subtitle":
        "相手に配慮しながら穏やかに向き合う協調派",
      "title-pair-agreeableness-high--emotionalStability-high-reason":
        "今回の回答では、相手への配慮を大切にする回答と感情の揺れには左右されにくいことを示す回答が比較的多く見られました。対立する場面でも落ち着いて合意点を探す組み合わせから「ふたつの杯の相席者」という称号になりました。",
      "title-pair-agreeableness-high--emotionalStability-low-subtitle":
        "相手の気持ちや関係の変化を感じ取る共感派",
      "title-pair-agreeableness-high--emotionalStability-low-reason":
        "今回の回答では、相手の気持ちや関係の変化に敏感なことを示す回答と周囲との調和を大切にする回答が比較的多く見られました。周囲の負担や不満に早い段階で意識が向き関係を保とうとする組み合わせから「揺れ布に並ぶ同伴者」という称号になりました。",
      "title-pair-agreeableness-low--emotionalStability-high-subtitle":
        "自分の判断を落ち着いて示す自分軸派",
      "title-pair-agreeableness-low--emotionalStability-high-reason":
        "今回の回答では、周囲との調和より自分の判断を重視する回答と感情の揺れには左右されにくいことを示す回答が比較的多く見られました。対立や反対意見があっても冷静に自分の立場を保つ組み合わせから「淡々たる表明者」という称号になりました。",
      "title-pair-agreeableness-low--emotionalStability-low-subtitle":
        "違和感や問題の兆しを捉えてはっきり示す主張派",
      "title-pair-agreeableness-low--emotionalStability-low-reason":
        "今回の回答では、自分の立場や違和感を強く意識する回答と周囲の反応や不確実な状況に敏感なことを示す回答が比較的多く見られました。問題や対立の兆しに意識が向き自分の考えを明確に示そうとする組み合わせから「風鳴る戸口の掲示者」という称号になりました。",
    },
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
  assert.equal(ResultTextDefinitions.length, 390);
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
      resultTextVersion: "result-text-v2",
    }),
    true,
  );
  assert.equal(ResultTextDefinitions.every(({ version }) => version === "result-text-v2"), true);
  assert.equal(TitleReflectionDefinitions.length, 153);
  assert.deepEqual(
    ResultTextDefinitions.slice(-TitleReflectionDefinitions.length),
    TitleReflectionDefinitions,
  );
  assert.equal(new Set(ResultTextDefinitions.map(({ id }) => id)).size, 390);
});

test("Q-014 title reflections cover every title with three approved fixed-order prompts", () => {
  assert.equal(Object.isFrozen(TitleReflectionDefinitions), true);
  for (const { titleId } of TitleProfileDefinitions) {
    const expectedPrefix = `title-reflection-${titleId.slice("title-".length)}-`;
    const definitions = TitleReflectionDefinitions.filter(
      ({ appliesTo }) => appliesTo.titleId === titleId,
    );
    assert.equal(definitions.length, 3);
    assert.deepEqual(definitions.map(({ id }) => id), [
      `${expectedPrefix}1`,
      `${expectedPrefix}2`,
      `${expectedPrefix}3`,
    ]);
    assert.deepEqual(definitions.map(({ previewAllowed }) => previewAllowed), [true, false, false]);
    for (const definition of definitions) {
      assert.deepEqual(Object.keys(definition), [
        "id", "version", "appliesTo", "section", "claimKind", "text", "evidenceRefs", "previewAllowed",
      ]);
      assert.equal(definition.version, "result-text-v2");
      assert.equal(definition.section, "titleReflection");
      assert.equal(definition.claimKind, "reflectionPrompt");
      assert.deepEqual(definition.evidenceRefs, ["evidence-result-presentation-contract"]);
      assert.equal(Object.isFrozen(definition), true);
      assert.equal(Object.isFrozen(definition.appliesTo), true);
      assert.equal(Object.isFrozen(definition.evidenceRefs), true);
    }
  }
});

test("Q-014 title reflection runtime text exactly matches the approved review matrix", async () => {
  const review = await readFile(
    new URL("../../docs/research/2026-07-29-title-reflection-content-review.md", import.meta.url),
    "utf8",
  );
  const approvedRows = review
    .split(/\r?\n/)
    .filter((line) => /^\| `title-/.test(line))
    .map((line) => {
      const cells = line.split("|").map((cell) => cell.trim());
      return {
        titleId: cells[1].slice(1, -1),
        order: Number(cells[2]),
        text: cells[3],
        status: cells[5].slice(1, -1),
      };
    })
    .filter(({ status }) => status === "approved");
  assert.equal(approvedRows.length, 153);
  assert.deepEqual(
    TitleReflectionDefinitions.map(({ appliesTo, id, text }) => ({
      titleId: appliesTo.titleId,
      order: Number(id.at(-1)),
      text,
      status: "approved",
    })),
    approvedRows,
  );
});

test("Q-006 result-text-v2 projects v1 unchanged except the 27 approved E/F corrections", () => {
  const v1 = [...TitleResultTextDefinitions, ...FactorResultTextDefinitions];
  const v2Base = ResultTextDefinitions.slice(0, v1.length);
  const correctedIds = new Set([
    "preview20-intellectImagination-high-observation",
    "preview20-intellectImagination-middle-observation",
    "preview20-intellectImagination-low-observation",
    "detail50-intellectImagination-high-observation",
    "detail50-intellectImagination-middle-observation",
    "detail50-intellectImagination-low-observation",
    "detail50-conscientiousness-high-observation",
    "detail50-conscientiousness-middle-observation",
    "detail50-conscientiousness-low-observation",
    "detail50-intellectImagination-high-action",
    "detail50-intellectImagination-middle-action",
    "detail50-intellectImagination-low-action",
    "detail50-conscientiousness-high-action",
    "detail50-conscientiousness-middle-action",
    "detail50-conscientiousness-low-action",
    "detail50-extraversion-high-action",
    "detail50-extraversion-middle-action",
    "detail50-extraversion-low-action",
    "detail50-agreeableness-high-action",
    "detail50-agreeableness-middle-action",
    "detail50-agreeableness-low-action",
    "detail50-emotionalStability-high-action",
    "detail50-emotionalStability-middle-action",
    "detail50-emotionalStability-low-action",
    "detail50-intellectImagination-middle-work",
    "detail50-intellectImagination-low-stress",
    "detail50-agreeableness-low-strength",
  ]);
  assert.equal(correctedIds.size, 27);
  assert.deepEqual(v2Base.map(({ id }) => id), v1.map(({ id }) => id));
  for (let index = 0; index < v1.length; index += 1) {
    const projected = { ...v2Base[index], version: "result-text-v1" };
    if (correctedIds.has(v1[index].id)) {
      assert.notEqual(projected.text, v1[index].text, v1[index].id);
      projected.text = v1[index].text;
    }
    assert.deepEqual(projected, v1[index], v1[index].id);
  }
  const expectedCorrections = {
    "preview20-intellectImagination-high-observation": "今回の20問では、新しい考え方や発想への関心が尺度内で高めであるという傾向が見られました。",
    "preview20-intellectImagination-middle-observation": "今回の20問では、新しい考え方や発想への関心が尺度内の中間域にあるという傾向が見られました。",
    "preview20-intellectImagination-low-observation": "今回の20問では、新しい考え方や発想への関心が尺度内で低めであるという傾向が見られました。",
    "detail50-intellectImagination-high-observation": "今回の50問では、新しい考え方や発想への関心が尺度内で高めであるという傾向が見られました。",
    "detail50-intellectImagination-middle-observation": "今回の50問では、新しい考え方や発想への関心が尺度内の中間域にあるという傾向が見られました。",
    "detail50-intellectImagination-low-observation": "今回の50問では、新しい考え方や発想への関心が尺度内で低めであるという傾向が見られました。",
    "detail50-conscientiousness-high-observation": "今回の50問では、物事を準備や整理をしながら進める傾向が、尺度内で高めに見られました。",
    "detail50-conscientiousness-middle-observation": "今回の50問では、物事を準備や整理をしながら進める傾向が、尺度内の中間域にありました。",
    "detail50-conscientiousness-low-observation": "今回の50問では、物事を準備や整理をしながら進める傾向が、尺度内で低めに見られました。",
    "detail50-intellectImagination-high-action": "今日心に残った「キーワード」や「気づき」を、スマホや手帳に書き留めてみませんか。",
    "detail50-intellectImagination-middle-action": "最近気になっているテーマについて、「時間があれば調べてみたいこと」をメモしてみませんか。",
    "detail50-intellectImagination-low-action": "今日見聞きした少し難しい話を、「自分の生活で言うとどうなるか」に当てはめて考えてみませんか。",
    "detail50-conscientiousness-high-action": "明日取りかかることを決め、最初の一歩だけメモしてみませんか。",
    "detail50-conscientiousness-middle-action": "明日の予定から、先に決めておきたいことを選んでみませんか。",
    "detail50-conscientiousness-low-action": "今気になっていることから、まず手を動かせそうなものに取りかかってみませんか。",
    "detail50-extraversion-high-action": "今日話してみたい人へ、短いあいさつや一言を自分から伝えてみませんか。",
    "detail50-extraversion-middle-action": "今日は人と話したい気分か、静かに過ごしたい気分かを確かめてみませんか。",
    "detail50-extraversion-low-action": "伝えたい相手を思い浮かべ、話したいことを短くメモしてみませんか。",
    "detail50-agreeableness-high-action": "最近気になっている相手へ、「最近どう？」と短く声をかけてみませんか。",
    "detail50-agreeableness-middle-action": "会話の前に、相手に聞きたいことと自分から伝えたいことを整理してみませんか。",
    "detail50-agreeableness-low-action": "自分の意見を伝えるとき、いちばん大切な理由を添えてみませんか。",
    "detail50-emotionalStability-high-action": "最近落ち着いて対応できた場面と、そのとき役に立ったことを短くメモしてみませんか。",
    "detail50-emotionalStability-middle-action": "今日の気分と、そのきっかけになった出来事をそれぞれ短くメモしてみませんか。",
    "detail50-emotionalStability-low-action": "最近気持ちが揺れた場面と、そのとき少し安心できたことをそれぞれメモしてみませんか。",
    "detail50-intellectImagination-middle-work": "仕事や学びのなかで、慣れたやり方で確実に進めるか、時間をかけて新しい方法を試すかを考えた場面はありましたか。",
    "detail50-intellectImagination-low-stress": "考えることが増えたとき、「まずは目の前で確かめられることから決めよう」と、扱う内容を絞った場面はありましたか。",
    "detail50-agreeableness-low-strength": "最近、曖昧な状況のなかでも自分の考えをはっきり伝えた結果、話が整理された場面はありましたか。",
  };
  assert.deepEqual(
    Object.fromEntries(
      v2Base
        .filter(({ id }) => correctedIds.has(id))
        .map(({ id, text: correctedText }) => [id, correctedText]),
    ),
    expectedCorrections,
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

test("Q-006 E-5/F-5 uses the reviewed calmness wording for emotional stability observations", () => {
  const byId = new Map(FactorResultTextDefinitions.map((definition) => [
    definition.id,
    definition.text,
  ]));
  assert.deepEqual(
    Object.fromEntries([
      ...["preview20", "detail50"].flatMap((mode) => [
        [`${mode}-emotionalStability-high-observation`, byId.get(`${mode}-emotionalStability-high-observation`)],
        [`${mode}-emotionalStability-middle-observation`, byId.get(`${mode}-emotionalStability-middle-observation`)],
        [`${mode}-emotionalStability-low-observation`, byId.get(`${mode}-emotionalStability-low-observation`)],
      ]),
    ]),
    {
      "preview20-emotionalStability-high-observation":
        "今回の20問では、落ち着きを保ちやすく、気分も安定しやすい傾向が、尺度内で高めに見られました。",
      "preview20-emotionalStability-middle-observation":
        "今回の20問では、落ち着きを保ちやすく、気分も安定しやすい傾向が、尺度内の中間域にありました。",
      "preview20-emotionalStability-low-observation":
        "今回の20問では、落ち着きを保ちやすく、気分も安定しやすい傾向が、尺度内で低めに見られました。",
      "detail50-emotionalStability-high-observation":
        "今回の50問では、心配やストレスを感じたときにも落ち着きを保ちやすく、気分も安定しやすい傾向が、尺度内で高めに見られました。",
      "detail50-emotionalStability-middle-observation":
        "今回の50問では、心配やストレスを感じたときにも落ち着きを保ちやすく、気分も安定しやすい傾向が、尺度内の中間域にありました。",
      "detail50-emotionalStability-low-observation":
        "今回の50問では、心配やストレスを感じたときにも落ち着きを保ちやすく、気分も安定しやすい傾向が、尺度内で低めに見られました。",
    },
  );
});

test("Q-006 F-5 uses the reviewed high-band reflection prompts for emotional stability", () => {
  const highDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "emotionalStability"
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
        "最近、予想外の出来事があっても、状況を整理しながら落ち着いて対応できた場面はありましたか。",
      tradeoff:
        "周りから「大丈夫？」と声をかけられて、あとから自分の疲れや気持ちの変化に気づいた場面はありましたか。",
      work:
        "仕事や学びのなかで、急な変更があっても、まず状況を整理してから取り組めた場面はありましたか。",
      relationship:
        "人との会話で、意見が合わないときにも、落ち着いて相手の話を聞けた場面はありましたか。",
      stress:
        "負担が重なったときにも、「まずは一つずつ」と落ち着いて対処できた場面はありましたか。",
      question:
        "最近、心配なことがあっても、意識を別のことへ切り替えられた場面はありましたか。",
      action:
        "もしよければ、最近落ち着いて対応できた場面と、そのとき役に立ったことを一つだけメモしてみませんか。",
    },
  );
});

test("Q-006 F-5 uses the reviewed middle-band reflection prompts for emotional stability", () => {
  const middleDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "emotionalStability"
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
        "最近、同じような出来事でも、「落ち着いて対応できたとき」と「気持ちが揺れたとき」がありましたか。",
      tradeoff:
        "予想外のことが起きたとき、「まず状況を整理できた場面」と「気持ちが先に動いた場面」がありましたか。",
      work:
        "仕事や学びのなかで、急な変更を落ち着いて受け止められたときと、少し焦ったときの両方がありましたか。",
      relationship:
        "人との会話で、相手の言葉を落ち着いて聞けたときと、気持ちが大きく動いたときがありましたか。",
      stress:
        "負担が重なったとき、落ち着いて進められた日と、気持ちに余裕がなくなった日がありましたか。",
      question:
        "最近、「これがあると落ち着きやすい」「こうなると心配が強まりやすい」と感じたきっかけはありましたか。",
      action:
        "もしよければ、今日の気分と、そのきっかけになった出来事を、それぞれ短い言葉で一つずつメモしてみませんか。",
    },
  );
});

test("Q-006 F-5 uses the reviewed low-band reflection prompts for emotional stability", () => {
  const lowDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "emotionalStability"
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
        "最近、心配や気分の揺れに早めに気づいて、無理をする前に少し立ち止まれた場面はありましたか。",
      tradeoff:
        "心配なことが頭から離れず、目の前のことに集中しにくくなった場面はありましたか。",
      work:
        "仕事や学びのなかで、予定外の変更があると、「この先どうなるのだろう」と不安が強まった場面はありましたか。",
      relationship:
        "人との会話のあと、相手の言葉や表情を思い返して、「あの言い方はどういう意味だったのだろう」と考え続けたことはありませんか。",
      stress:
        "負担が重なったとき、普段なら気にならないことにもイライラしたり、気持ちが沈んだりしたことはありませんか。",
      question:
        "最近、心配や気分の揺れが強まる前に、考えがまとまりにくくなるなどの小さな変化に気づいたことはありましたか。",
      action:
        "もしよければ、最近気持ちが揺れた場面と、そのとき少し安心できたことを一つずつメモしてみませんか。",
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

test("Q-006 F-4 uses the reviewed middle-band reflection prompts for agreeableness", () => {
  const middleDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "agreeableness"
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
        "最近、「相手に合わせよう」と思った場面と、「今回は自分の意見を伝えよう」と思った場面がありましたか。",
      tradeoff:
        "意見が合わないとき、「相手の気持ちを大切にしたい」気持ちと「自分の考えもきちんと伝えたい」気持ちの間で迷ったことはありましたか。",
      work:
        "仕事や学びのなかで、「周りに協力を頼むか」「まずは自分で進めるか」で迷った場面はありましたか。",
      relationship:
        "人との会話で、「相手に合わせるか」「自分の希望を伝えるか」を、その場の関係や雰囲気に合わせて選んだことはありましたか。",
      stress:
        "意見が合わないとき、どこまで相手に譲り、どこから自分の考えを伝えるかで悩んだことはありませんか。",
      question:
        "最近、「相手に合わせてよかった」と感じた場面と、「自分の希望を伝えてよかった」と感じた場面はありましたか。",
      action:
        "もしよければ、次の会話で、相手に聞きたいこと、または、自分から伝えたいことを一つだけ決めてみませんか。",
    },
  );
});

test("Q-006 F-4 uses the reviewed low-band reflection prompts for agreeableness", () => {
  const lowDetail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
    appliesTo.mode === "detail50"
    && appliesTo.factorId === "agreeableness"
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
        "最近、曖昧な状況のなかで自分の考えをはっきり伝えたことにより、話が整理された場面はありましたか。",
      tradeoff:
        "自分の考えをはっきり伝えたあと、相手の反応を見て、「少し言い方を変えてもよかったかもしれない」と感じた場面はありましたか。",
      work:
        "仕事や学びのなかで、周りに合わせるよりも、必要だと思うことをはっきり伝えたことで、課題が明確になった場面はありましたか。",
      relationship:
        "人との会話で、自分の考えを率直に伝えたものの、相手がどう受け取ったか気になった場面はありましたか。",
      stress:
        "意見が合わないとき、「これ以上話してもまとまらない」と、早く結論を出したくなったことはありませんか。",
      question:
        "最近、自分とは違う考えを聞いて、「その見方もあるな」と思った場面はありましたか。",
      action:
        "もしよければ、次に自分の意見を伝えたあと、「あなたはどう思う？」と相手の考えを一つたずねてみませんか。",
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
  for (const band of BANDS) {
    const emotionalStability = byId.get(
      `preview20-emotionalStability-${band}-observation`,
    );
    assert.match(emotionalStability.text, /落ち着きを保ちやすく、気分も安定しやすい傾向/);
    assert.doesNotMatch(emotionalStability.text, /心配|ストレス/);
  }
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
