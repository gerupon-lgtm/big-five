import assert from "node:assert/strict";
import test from "node:test";

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
  assert.match(text, /character-balanced/);
  assert.match(text, /画像を利用できない場合も診断結果は有効です/);
  assert.match(text, /palette-default/);
  assert.doesNotMatch(text, /rawMean|answers/);

  const factorDetails = collectElements(host)
    .filter(({ className }) => className === "factor-result");
  assert.equal(factorDetails.length, 5);
  assert.deepEqual(
    factorDetails.map((element) => collectText(element).trim()),
    [
      "知性・想像力 75 / 100 説明を見る 新しい考えや体験への関心を表します。",
      "勤勉性 75 / 100 説明を見る 計画性や粘り強さの傾向を表します。",
      "外向性 50 / 100 説明を見る 人や活動へ向かう活発さを表します。",
      "協調性 25 / 100 説明を見る 他者への配慮や協力の傾向を表します。",
      "情緒安定性 25 / 100 説明を見る 感情の揺れに対する安定の傾向を表します。",
    ],
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
  buttons.find(({ textContent }) => textContent === "あと30問に回答する").dispatch("click");
  buttons.find(({ textContent }) => textContent === "結果を共有する").dispatch("click");
  assert.deepEqual(calls, [
    ["continue", snapshot],
    ["share", snapshot],
  ]);
});

test("T-005 S-004 renders all 42 saved detail texts once and in persisted order", () => {
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
    records.map(({ attributes }) => attributes.get("data-result-text-id")),
    snapshot.renderedTexts.map(({ id }) => id),
  );
  assert.equal(records.filter(({ textContent }) =>
    textContent === snapshot.renderedTexts[0].text).length, 1);
  assert.equal(records.filter(({ textContent }) =>
    textContent === snapshot.renderedTexts[1].text).length, 1);

  const text = collectText(host);
  assert.match(text, /50問詳細結果/);
  assert.match(text, /称号.*五つの風を見渡す観測者/);
  assert.doesNotMatch(text, /仮称号|あと30問|20問だけでは/);
  assert.match(
    text,
    /※因子名の「説明を見る」から、それぞれの意味を確認できます。/,
  );
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
    collectElements(host).filter(({ className }) => className === "factor-result").length,
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

    assert.equal(
      collectElements(host).filter(({ tagName }) => tagName === "button").length,
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
