import assert from "node:assert/strict";
import test from "node:test";

import { loadCharacterImage } from "../js/infrastructure/character-loader.js";
import { renderSavedResultScreen } from "../js/presentation/result-screen.js";
import { collectElements, collectText, createFakeScreen } from "./helpers/fake-dom.js";
import { createTestResultSnapshot } from "./helpers/result-snapshot-fixture.js";

const labels = Object.freeze({
  factorLabels: Object.freeze({
    intellectImagination: "知性・想像力",
    conscientiousness: "勤勉性",
    extraversion: "外向性",
    agreeableness: "協調性",
    emotionalStability: "情緒安定性",
  }),
  factorDescriptions: Object.freeze({
    intellectImagination: "新しい考えや体験への関心を表します。",
    conscientiousness: "計画性や粘り強さの傾向を表します。",
    extraversion: "人や活動へ向かう活発さを表します。",
    agreeableness: "他者への配慮や協力の傾向を表します。",
    emotionalStability: "感情の揺れに対する安定の傾向を表します。",
  }),
  titleLabels: Object.freeze({
    "title-balanced": "五つの風を見渡す観測者",
  }),
});

const characterEntry = Object.freeze({
  characterId: "character-balanced",
  assetVersion: "character-balanced-v1",
  imagePath: "assets/characters/character-balanced.webp",
  width: 1024,
  height: 1024,
  alt: "五枚の葉のモビールを見上げて座る猫。",
  integrity: "sha256-gVfqsXoZbwa5AVZhAGwvT2via6MzHVbuVfrr3tK8seo=",
});

function resultTextRecords(host) {
  return collectElements(host)
    .filter(({ className }) => className.includes("result-text-record"));
}

test("T-005 S-003 renders the complete saved preview with factor help and the 30-question path", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000020",
    questionCount: 20,
    rawMeans: [4, 4, 3, 2, 2],
  });
  const calls = [];

  renderSavedResultScreen(host, snapshot, labels, {
    onContinueDetail: (selected) => calls.push(["continue", selected]),
    onShare: (selected) => calls.push(["share", selected]),
  }, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const text = collectText(host);
  assert.match(text, /20問簡易プレビュー/);
  assert.match(text, /仮称号.*五つの風を見渡す観測者/);
  assert.match(text, /20問だけでは捉えきれない/);
  assert.match(text, /あと30問/);
  assert.match(
    text,
    /20項目版は、独立した日本語版としての妥当性検証を受けていません。/,
  );
  assert.match(
    text,
    /50問では、スコア・仮称号・仮キャラクターが変わり得ます。/,
  );
  assert.match(text, /独自のプロフィール表現であり、心理学上の正式なタイプではありません/);
  assert.doesNotMatch(text, /character-balanced/);
  assert.match(text, /画像を利用できない場合も診断結果は有効です/);
  assert.match(text, /palette-default/);
  assert.doesNotMatch(text, /rawMean|answers/);

  const factorDetails = collectElements(host)
    .filter(({ className }) => className === "factor-score-row");
  assert.equal(factorDetails.length, 5);
  assert.deepEqual(
    factorDetails.map((element) => collectText(element).trim().split(/\s+/)[0]),
    ["知性・想像力", "勤勉性", "外向性", "協調性", "情緒安定性"],
  );
  assert.ok(collectElements(host).some(({ tagName, attributes }) =>
    tagName === "a" && attributes.get("href") === "#/history"));

  assert.equal(resultTextRecords(host).length, 7);
  assert.deepEqual(
    resultTextRecords(host).map(({ attributes }) => attributes.get("data-result-text-id")),
    snapshot.renderedTexts.map(({ id }) => id),
  );
  assert.equal(
    collectElements(host).filter(({ className }) => className.includes("result-evidence")).length,
    7,
  );
  assert.equal(
    collectElements(host).filter(({ className }) => className === "boundary-notices").length,
    0,
  );
  for (const record of snapshot.renderedTexts) {
    assert.equal(resultTextRecords(host).filter(({ textContent }) =>
      textContent === record.text).length, 1);
    assert.match(text, new RegExp(record.evidenceRefs[0]));
  }

  const buttons = collectElements(host).filter(({ tagName }) => tagName === "button");
  buttons.find(({ textContent }) => textContent === "あと30問続ける").dispatch("click");
  buttons.find(({ textContent }) => textContent === "結果を共有する").dispatch("click");
  assert.deepEqual(calls, [
    ["continue", snapshot],
    ["share", snapshot],
  ]);
});

test("T-005 S-004 renders all 42 saved detail texts exactly once", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000050",
    rawMeans: [4, 3, 3, 2, 2],
  });
  let retryCalls = 0;

  renderSavedResultScreen(host, snapshot, labels, {
    onRetry: () => { retryCalls += 1; },
  }, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const records = resultTextRecords(host);
  assert.equal(records.length, 42);
  assert.deepEqual(
    records.map(({ attributes }) => attributes.get("data-result-text-id")).sort(),
    snapshot.renderedTexts.map(({ id }) => id).sort(),
  );
  assert.equal(records.filter(({ textContent }) =>
    textContent === snapshot.renderedTexts[0].text).length, 1);
  assert.equal(records.filter(({ textContent }) =>
    textContent === snapshot.renderedTexts[1].text).length, 1);

  const text = collectText(host);
  assert.match(text, /50問詳細結果/);
  assert.match(text, /称号.*五つの風を見渡す観測者/);
  assert.doesNotMatch(text, /仮称号|あと30問|20問だけでは/);
  assert.ok(collectElements(host).some(({ tagName, attributes }) =>
    tagName === "a" && attributes.get("href") === "#/history"));

  collectElements(host).find(({ tagName, textContent }) =>
    tagName === "button" && textContent === "もう一度診断する").dispatch("click");
  assert.equal(retryCalls, 1);
});

test("T-005 F-006 keeps every text and factor reachable when radar drawing fails", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000051",
  });

  renderSavedResultScreen(host, snapshot, labels, {}, {
    drawRadar: () => ({ drawn: false, errorCode: "RADAR_CONTEXT_UNAVAILABLE" }),
  });

  assert.match(collectText(host), /レーダーチャートを表示できません/);
  assert.equal(
    collectElements(host).filter(({ className }) => className === "factor-score-row").length,
    5,
  );
  assert.equal(resultTextRecords(host).length, 42);
});

test("T-005 F-006 normalizes an invalid persisted result to RESULT_SCREEN_INVALID", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000052",
  });
  const invalid = structuredClone(snapshot);
  invalid.factors = invalid.factors.slice(0, 4);

  assert.throws(
    () => renderSavedResultScreen(host, invalid, labels),
    { name: "TypeError", message: "RESULT_SCREEN_INVALID" },
  );
});

test("T-005 S-003/S-004 omits action buttons whose callbacks were not provided", () => {
  for (const [resultId, questionCount] of [
    ["00000000-0000-4000-8000-000000000053", 20],
    ["00000000-0000-4000-8000-000000000054", 50],
  ]) {
    const { host } = createFakeScreen();
    const snapshot = createTestResultSnapshot({ resultId, questionCount });

    renderSavedResultScreen(host, snapshot, labels, {}, {
      drawRadar: () => ({ drawn: true, errorCode: null }),
    });

    const actions = collectElements(host).find(({ className }) =>
      className === "result-actions");
    assert.equal(
      collectElements(actions).filter(({ tagName }) => tagName === "button").length,
      0,
    );
    assert.ok(collectElements(host).some(({ tagName, attributes }) =>
      tagName === "a" && attributes.get("href") === "#/history"));
  }
});

test("T-005 S-003/S-004 explains both boundary flag types with factor names", () => {
  for (const [resultId, questionCount, threshold] of [
    ["00000000-0000-4000-8000-000000000055", 20, 0.25],
    ["00000000-0000-4000-8000-000000000056", 50, 0.1],
  ]) {
    const { host } = createFakeScreen();
    const snapshot = structuredClone(createTestResultSnapshot({
      resultId,
      questionCount,
    }));
    snapshot.boundaryFlags = [
      {
        type: "factor-near-band-boundary",
        factorId: "intellectImagination",
        boundary: 3.5,
        threshold,
        questionCount,
      },
      {
        type: "second-third-salience-near-tie",
        factorIds: ["extraversion", "agreeableness"],
        threshold,
        questionCount,
      },
    ];

    renderSavedResultScreen(host, snapshot, labels, {}, {
      drawRadar: () => ({ drawn: true, errorCode: null }),
    });

    const notices = collectElements(host)
      .filter(({ className }) => className === "boundary-notices");
    assert.equal(notices.length, 1);
    const text = collectText(notices[0]);
    assert.match(
      text,
      /知性・想像力は境界に近く、回答や状況により表示帯が変わり得ます。/,
    );
    assert.match(
      text,
      /称号の代表因子について、外向性と協調性が僅差です。/,
    );
    assert.doesNotMatch(
      text,
      /factor-near-band-boundary|second-third-salience-near-tie|intellectImagination/,
    );
  }
});

test("T-005 F-016 keeps the approved alt visible without decoding before viewport entry", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000057",
  });
  let decodeCalls = 0;
  let enterViewport;

  renderSavedResultScreen(host, snapshot, labels, {}, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
    characterEntry,
    decodeImage: async () => {
      decodeCalls += 1;
      return host.ownerDocument.createElement("img");
    },
    loadCharacterImage,
    observeViewport(_target, onEnter) {
      enterViewport = onEnter;
    },
  });

  assert.equal(decodeCalls, 0);
  assert.equal(typeof enterViewport, "function");
  assert.match(collectText(host), new RegExp(characterEntry.alt));
  assert.equal(
    collectElements(host).filter(({ tagName }) => tagName === "img").length,
    0,
  );
});

test("T-005 F-016 does not substitute a current character asset for an older snapshot version", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000060",
    characterAssetVersion: "character-balanced-v0",
  });
  let observed = 0;

  renderSavedResultScreen(host, snapshot, labels, {}, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
    characterEntry,
    decodeImage: async () => host.ownerDocument.createElement("img"),
    loadCharacterImage,
    observeViewport() {
      observed += 1;
    },
  });

  assert.equal(observed, 0);
  assert.equal(
    collectElements(host).filter(({ tagName }) => tagName === "img").length,
    0,
  );
  assert.match(collectText(host), /画像を利用できない場合も診断結果は有効です/);
});

test("T-005 F-016 decodes the selected path once and renders one contained image after entry", async () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000058",
  });
  const requested = [];
  let enterViewport;

  renderSavedResultScreen(host, snapshot, labels, {}, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
    characterEntry,
    decodeImage: async (path) => {
      requested.push(path);
      return host.ownerDocument.createElement("img");
    },
    loadCharacterImage,
    observeViewport(_target, onEnter) {
      enterViewport = onEnter;
    },
  });

  assert.equal(typeof enterViewport, "function");
  await enterViewport();
  await enterViewport();

  assert.deepEqual(requested, [characterEntry.imagePath]);
  const images = collectElements(host)
    .filter(({ tagName }) => tagName === "img");
  assert.equal(images.length, 1);
  assert.equal(images[0].attributes.get("alt"), characterEntry.alt);
  assert.equal(images[0].className, "result-character-image");
});

test("T-005 F-016 keeps approved alt and the complete result when decode fails", async () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000059",
  });
  let enterViewport;
  let retryCalls = 0;

  renderSavedResultScreen(host, snapshot, labels, {
    onRetry: () => { retryCalls += 1; },
  }, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
    characterEntry,
    decodeImage: async () => {
      throw new Error("forced decode failure");
    },
    loadCharacterImage,
    observeViewport(_target, onEnter) {
      enterViewport = onEnter;
    },
  });

  assert.equal(typeof enterViewport, "function");
  await enterViewport();

  const text = collectText(host);
  assert.match(text, /称号.*五つの風を見渡す観測者/);
  assert.match(text, new RegExp(characterEntry.alt));
  assert.match(text, /診断時の選択色ID：palette-default/);
  assert.equal(
    collectElements(host).filter(({ tagName }) => tagName === "img").length,
    0,
  );
  assert.equal(
    collectElements(host).filter(({ className }) => className === "factor-score-row").length,
    5,
  );
  assert.equal(resultTextRecords(host).length, 42);

  collectElements(host).find(({ tagName, textContent }) =>
    tagName === "button" && textContent === "もう一度診断する").dispatch("click");
  assert.equal(retryCalls, 1);
  assert.ok(collectElements(host).some(({ tagName, attributes }) =>
    tagName === "a" && attributes.get("href") === "#/history"));
});

test("T-008A F-005 renders the hero before the title reason and five factor rows without internal character metadata", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000070",
  });

  renderSavedResultScreen(host, snapshot, labels, {}, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const main = host.children[0];
  const sectionClasses = main.children.map(({ className }) => className);
  const heroIndex = sectionClasses.indexOf("result-hero");
  const reasonIndex = sectionClasses.indexOf("result-title-reason");
  const factorsIndex = sectionClasses.indexOf("result-factors");
  assert.deepEqual([heroIndex, reasonIndex, factorsIndex].map((index) => index >= 0), [true, true, true]);
  assert.ok(heroIndex < reasonIndex && reasonIndex < factorsIndex);
  assert.match(collectText(main.children[heroIndex]), /称号：/);
  assert.match(collectText(main.children[reasonIndex]), /この称号になった理由/);
  assert.doesNotMatch(collectText(host), /キャラクターID/);
});

test("T-008A F-005 keeps all detail records in one-factor and one-category disclosure panels", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000071",
  });

  renderSavedResultScreen(host, snapshot, labels, {}, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const factorTriggers = collectElements(host)
    .filter(({ className }) => className === "factor-disclosure-trigger");
  const categoryTriggers = collectElements(host)
    .filter(({ className }) => className === "category-disclosure-trigger");
  const categoryLabels = collectElements(host)
    .filter(({ className }) => className === "factor-category-label");
  const categorySummaries = collectElements(host)
    .filter(({ className }) => className === "factor-category-summary");
  const scoreRows = collectElements(host)
    .filter(({ className }) => className === "factor-score-row");
  const bars = collectElements(host)
    .filter(({ className }) => className === "factor-score-bar");

  assert.equal(scoreRows.length, 5);
  assert.equal(bars.length, 5);
  assert.equal(factorTriggers.length, 5);
  assert.equal(categoryTriggers.length, 35);
  assert.deepEqual(
    factorTriggers.map(({ textContent }) => textContent),
    Array(5).fill("説明を見る"),
  );
  assert.deepEqual(
    categoryTriggers.map(({ textContent }) => textContent),
    Array(35).fill("詳しく見る"),
  );
  assert.deepEqual(
    categoryLabels.slice(0, 7).map(({ textContent }) => textContent),
    [
      "今の傾向",
      "活かしやすい強み",
      "強みの裏返り",
      "仕事での現れ方",
      "人間関係での現れ方",
      "ストレス時の傾向",
      "振り返りと行動ヒント",
    ],
  );
  assert.equal(categoryLabels.length, 35);
  assert.equal(categorySummaries.length, 35);
  assert.equal(
    collectElements(host).filter(({ textContent }) =>
      textContent === "※因子名の「説明を見る」から、それぞれの意味を確認できます。").length,
    1,
  );
  assert.equal(
    collectElements(host).filter(({ textContent }) => textContent === "0–100").length,
    1,
  );
  assert.deepEqual(
    resultTextRecords(host).map(({ attributes }) => attributes.get("data-result-text-id")).sort(),
    snapshot.renderedTexts.map(({ id }) => id).sort(),
  );
  for (const trigger of [...factorTriggers, ...categoryTriggers]) {
    assert.equal(trigger.attributes.get("type"), "button");
    assert.equal(trigger.attributes.get("aria-expanded"), "false");
    assert.ok(trigger.attributes.get("aria-controls"));
  }

  let scrolled = 0;
  factorTriggers[0].scrollIntoView = (options) => {
    assert.deepEqual(options, { block: "nearest" });
    scrolled += 1;
  };
  factorTriggers[0].dispatch("click");
  assert.equal(factorTriggers[0].attributes.get("aria-expanded"), "true");
  assert.equal(scrolled, 1);
  categoryTriggers[0].dispatch("click");
  assert.equal(categoryTriggers[0].attributes.get("aria-expanded"), "true");
  factorTriggers[1].dispatch("click");
  assert.equal(factorTriggers[0].attributes.get("aria-expanded"), "false");
  assert.equal(categoryTriggers[0].attributes.get("aria-expanded"), "false");
  assert.equal(factorTriggers[1].attributes.get("aria-expanded"), "true");
});

test("T-008A F-005 limits preview disclosure to current observations while retaining every persisted record", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000072",
    questionCount: 20,
  });

  renderSavedResultScreen(host, snapshot, labels, {}, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const categoryTriggers = collectElements(host)
    .filter(({ className }) => className === "category-disclosure-trigger");
  const categoryLabels = collectElements(host)
    .filter(({ className }) => className === "factor-category-label");
  const factorTriggers = collectElements(host)
    .filter(({ className }) => className === "factor-disclosure-trigger");
  assert.equal(categoryTriggers.length, 5);
  assert.deepEqual(categoryTriggers.map(({ textContent }) => textContent), Array(5).fill("詳しく見る"));
  assert.deepEqual(categoryLabels.map(({ textContent }) => textContent), Array(5).fill("今の傾向"));
  assert.deepEqual(factorTriggers.map(({ textContent }) => textContent), Array(5).fill("説明を見る"));
  assert.equal(
    collectElements(host).filter(({ textContent }) =>
      textContent === "※因子名の「説明を見る」から、それぞれの意味を確認できます。").length,
    0,
  );
  assert.deepEqual(
    resultTextRecords(host).map(({ attributes }) => attributes.get("data-result-text-id")),
    snapshot.renderedTexts.map(({ id }) => id),
  );
});

test("T-008A F-008 renders count-only composition and fixed method sheets independent of a result title or score", () => {
  const methodInfo = Object.freeze([
    Object.freeze({ id: "basis", title: "測定の土台", body: "IPIP日本語50項目版を用いて、Big Fiveの5因子を確認します。" }),
    Object.freeze({ id: "scoring", title: "スコアの計算方法", body: "正方向・逆方向をそろえた1〜5の平均を、表示用に0〜100へ換算しています。" }),
    Object.freeze({ id: "limitations", title: "この結果の限界", body: "限界A 限界B" }),
    Object.freeze({ id: "sources", title: "出典・利用条件", body: "source A / source B" }),
  ]);
  const questionComposition = Object.freeze([
    Object.freeze({ factorId: "intellectImagination", positiveCount: 7, negativeCount: 3 }),
    Object.freeze({ factorId: "conscientiousness", positiveCount: 6, negativeCount: 4 }),
    Object.freeze({ factorId: "extraversion", positiveCount: 5, negativeCount: 5 }),
    Object.freeze({ factorId: "agreeableness", positiveCount: 6, negativeCount: 4 }),
    Object.freeze({ factorId: "emotionalStability", positiveCount: 2, negativeCount: 8 }),
  ]);
  const first = createFakeScreen();
  const second = createFakeScreen();
  const firstSnapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000073",
    rawMeans: [5, 4, 3, 2, 1],
  });
  const secondSnapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000074",
    rawMeans: [1, 2, 3, 4, 5],
  });
  const dependencies = {
    drawRadar: () => ({ drawn: true, errorCode: null }),
    questionComposition,
    methodInfo,
  };

  renderSavedResultScreen(first.host, firstSnapshot, labels, {}, dependencies);
  renderSavedResultScreen(second.host, secondSnapshot, labels, {}, dependencies);

  const launchers = collectElements(first.host)
    .filter(({ className }) => className === "bottom-sheet-launcher");
  assert.deepEqual(
    launchers.map(({ textContent }) => textContent),
    ["因子ごとの設問構成を見る", "測定の土台", "スコアの計算方法", "この結果の限界", "出典・利用条件"],
  );
  const compositionRows = collectElements(first.host)
    .filter(({ className }) => className === "question-composition-row");
  assert.equal(compositionRows.length, 5);
  assert.match(collectText(compositionRows[0]), /知性・想像力.*7.*3/);
  assert.doesNotMatch(collectText(first.host), /盛り上げ役である|answers/);
  const firstMethodBodies = collectElements(first.host)
    .filter(({ className }) => className === "bottom-sheet")
    .map((sheet) => collectText(sheet));
  const secondMethodBodies = collectElements(second.host)
    .filter(({ className }) => className === "bottom-sheet")
    .map((sheet) => collectText(sheet));
  assert.deepEqual(firstMethodBodies.slice(1), secondMethodBodies.slice(1));
});
