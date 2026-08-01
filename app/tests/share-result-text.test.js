import assert from "node:assert/strict";
import test from "node:test";

import {
  createShareResultText,
  selectShareableResultTexts,
} from "../js/domain/share-result-text.js";

function makeRecord(id, section, text) {
  return {
    id,
    version: "result-text-v2",
    section,
    text,
    evidenceRefs: [`evidence-${id}`],
  };
}

test("T-007 F-006 excludes title reflections from the future share candidate boundary", () => {
  const reflectionText = "共有してはいけない振り返り文";
  const input = [
    makeRecord("title-balanced-subtitle", "titleSubtitle", "バランス派"),
    makeRecord("title-balanced-reason", "titleReason", "称号理由"),
    makeRecord("title-reflection-balanced-1", "titleReflection", reflectionText),
    makeRecord("detail50-extraversion-middle-observation", "observation", "観察文"),
    makeRecord("title-reflection-balanced-2", "titleReflection", "非共有の二件目"),
  ];
  const before = structuredClone(input);

  const selected = selectShareableResultTexts(input);

  assert.deepEqual(input, before);
  assert.deepEqual(selected.map(({ id }) => id), [
    "title-balanced-subtitle",
    "title-balanced-reason",
    "detail50-extraversion-middle-observation",
  ]);
  assert.equal(selected.some(({ section }) => section === "titleReflection"), false);
  assert.doesNotMatch(JSON.stringify(selected), /title-reflection|共有してはいけない振り返り文|非共有の二件目/);
});

test("T-007 F-006 returns isolated deeply frozen records in deterministic source order", () => {
  const input = [
    makeRecord("first", "titleSubtitle", "一件目"),
    makeRecord("hidden", "titleReflection", "除外"),
    makeRecord("second", "observation", "二件目"),
  ];

  const first = selectShareableResultTexts(input);
  const second = selectShareableResultTexts(input);

  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  for (const record of first) {
    assert.equal(Object.isFrozen(record), true);
    assert.equal(Object.isFrozen(record.evidenceRefs), true);
  }
  assert.notStrictEqual(first[0], input[0]);
  assert.notStrictEqual(first[0].evidenceRefs, input[0].evidenceRefs);
  input[0].text = "後から変更";
  input[0].evidenceRefs.push("late-evidence");
  assert.equal(first[0].text, "一件目");
  assert.deepEqual(first[0].evidenceRefs, ["evidence-first"]);
});

test("T-007 F-006 rejects non-array input with the stable boundary error", () => {
  for (const input of [null, undefined, {}, "texts"]) {
    assert.throws(
      () => selectShareableResultTexts(input),
      { name: "TypeError", message: "INVALID_RESULT_TEXTS" },
    );
  }
});

const shareTextInput = {
  brandName: "ココロパレア",
  modeLabel: "50問 詳細結果",
  titleLabel: "寄り添う共鳴者",
  titleSubtitle: "多様な考えを受け止めて共通点を探す協調派",
  titleReason: "今回の回答では、多様な考えや新しい可能性への関心を示す回答と相手の立場や感情に配慮する回答の両方が比較的多く見られました。異なる意見の間に共通点を見つけようとする組み合わせから「寄り添う共鳴者」という称号になりました。",
  factors: [
    { factorId: "intellectImagination", label: "知性・想像力", displayScore: 95 },
    { factorId: "conscientiousness", label: "勤勉性", displayScore: 50 },
    { factorId: "extraversion", label: "外向性", displayScore: 68 },
    { factorId: "agreeableness", label: "協調性", displayScore: 73 },
    { factorId: "emotionalStability", label: "情緒安定性", displayScore: 28 },
  ],
  fragrances: [
    { sceneId: "pause", sceneLabel: "ひと息つきたい", accordLabel: "透明感のある花と柑橘の香調", materialNames: ["ネロリ"] },
    { sceneId: "reset", sceneLabel: "気持ちを切り替えたい", accordLabel: "透明感のある葉の香調", materialNames: ["ユーカリ", "ラディアータ"] },
    { sceneId: "quiet-focus", sceneLabel: "静かに取り組みたい", accordLabel: "ほろ苦く端正な柑橘の香調", materialNames: ["ベルガモット"] },
  ],
  disclaimer: "これは性格の優劣や心理学上の正式なタイプを示すものではありません。",
  shareUrl: "",
  rawAnswers: [1, 2, 3, 4, 5],
  titleReflection: "共有してはいけない振り返り文",
  version: "result-text-v2",
};

const expectedShareText = `ココロパレア
50問 詳細結果
称号：寄り添う共鳴者
多様な考えを受け止めて共通点を探す協調派
今回の回答では、多様な考えや新しい可能性への関心を示す回答と相手の立場や感情に配慮する回答の両方が比較的多く見られました。異なる意見の間に共通点を見つけようとする組み合わせから「寄り添う共鳴者」という称号になりました。

知性・想像力：95
勤勉性：50
外向性：68
協調性：73
情緒安定性：28

ココロアロマ
ひと息つきたい：透明感のある花と柑橘の香調
香りの素材例：ネロリ
気持ちを切り替えたい：透明感のある葉の香調
香りの素材例：ユーカリ・ラディアータ
静かに取り組みたい：ほろ苦く端正な柑橘の香調
香りの素材例：ベルガモット

これは性格の優劣や心理学上の正式なタイプを示すものではありません。`;

test("T-008C F-011 builds the approved URL-free share text exactly", () => {
  const text = createShareResultText(shareTextInput);

  assert.equal(text, expectedShareText);
  assert.doesNotMatch(text, /この称号になった理由|共有してはいけない振り返り文|result-text-v2|1,2,3,4,5/);
  assert.equal(Object.isFrozen(shareTextInput), false);
});

test("T-008C F-011 uses the approved preview mode label and preserves supplied factor order", () => {
  const text = createShareResultText({
    ...shareTextInput,
    modeLabel: "20問 簡易プレビュー",
    factors: [...shareTextInput.factors].reverse(),
  });

  assert.match(text, /^ココロパレア\n20問 簡易プレビュー\n称号：寄り添う共鳴者\n/);
  assert.ok(text.indexOf("情緒安定性：28") < text.indexOf("協調性：73"));
  assert.ok(text.indexOf("協調性：73") < text.indexOf("外向性：68"));
});

test("T-008C F-011 appends only a trimmed HTTPS share URL as a final block", () => {
  assert.equal(createShareResultText({ ...shareTextInput, shareUrl: "" }), expectedShareText);
  assert.equal(
    createShareResultText({ ...shareTextInput, shareUrl: "  https://example.test/kokoroparea  " }),
    `${expectedShareText}\n\nhttps://example.test/kokoroparea`,
  );
  assert.equal(
    createShareResultText({ ...shareTextInput, shareUrl: "https://example.test/a%20b" }),
    `${expectedShareText}\n\nhttps://example.test/a%20b`,
  );
});

test("T-008C F-011 rejects invalid share URL values with the domain error", () => {
  for (const shareUrl of [
    " ",
    "http://example.test",
    "https://user:password@example.test",
    "mailto:hello@example.test",
    "https://example.test/a b",
    "https://example.test/a\nb",
  ]) {
    assert.throws(
      () => createShareResultText({ ...shareTextInput, shareUrl }),
      { name: "TypeError", message: "INVALID_SHARE_RESULT_TEXT" },
    );
  }
});

test("T-008C F-011 requires the approved title subtitle and reason", () => {
  for (const missingField of ["titleSubtitle", "titleReason"]) {
    const input = { ...shareTextInput };
    delete input[missingField];

    assert.throws(
      () => createShareResultText(input),
      { name: "TypeError", message: "INVALID_SHARE_RESULT_TEXT" },
    );
  }
});

test("T-008C F-011 rejects null, undefined, and non-object inputs with the domain error", () => {
  for (const input of [null, undefined, 42, true, "share text"]) {
    assert.throws(
      () => createShareResultText(input),
      { name: "TypeError", message: "INVALID_SHARE_RESULT_TEXT" },
    );
  }
});

test("T-008C F-011 rejects malformed factor and fragrance members with the domain error", () => {
  for (const invalidMember of [null, undefined, 42, true, "entry"]) {
    assert.throws(
      () => createShareResultText({
        ...shareTextInput,
        factors: [invalidMember, ...shareTextInput.factors.slice(1)],
      }),
      { name: "TypeError", message: "INVALID_SHARE_RESULT_TEXT" },
    );
    assert.throws(
      () => createShareResultText({
        ...shareTextInput,
        fragrances: [invalidMember, ...shareTextInput.fragrances.slice(1)],
      }),
      { name: "TypeError", message: "INVALID_SHARE_RESULT_TEXT" },
    );
  }
});
