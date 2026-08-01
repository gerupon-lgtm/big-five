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

const presentation = Object.freeze({
  palettes: Object.freeze({
    standard: Object.freeze({
      paletteId: "palette-default",
      label: "若葉の余白",
      baseColors: Object.freeze({
        primary: "#74A88C",
        secondary: "#DCEBDD",
        accent: "#D7985D",
      }),
    }),
    alternatives: Object.freeze([
      Object.freeze({
        paletteId: "palette-alternative-1",
        label: "朝空のリズム",
        baseColors: Object.freeze({
          primary: "#78A9C8",
          secondary: "#E6D7A4",
          accent: "#D87878",
        }),
      }),
      Object.freeze({
        paletteId: "palette-alternative-2",
        label: "木陰の灯り",
        baseColors: Object.freeze({
          primary: "#9886B8",
          secondary: "#C9D89D",
          accent: "#E3A55C",
        }),
      }),
    ]),
  }),
  fragranceScenes: Object.freeze([
    Object.freeze({
      sceneId: "pause",
      iconId: "aroma-pause",
      label: "ひと息つきたい",
      candidates: Object.freeze([
        Object.freeze({
          fragranceId: "fragrance-pause-camomile",
          accordLabel: "やわらかな草花の香調",
          description: "静かな余白を思わせる穏やかな香調です。",
          materialNames: Object.freeze(["ローマンカモミール"]),
        }),
        Object.freeze({
          fragranceId: "fragrance-pause-wood",
          accordLabel: "温かな木質の香調",
          description: "丸みのある木陰を思わせる香調です。",
          materialNames: Object.freeze(["サンダルウッド"]),
        }),
      ]),
    }),
    Object.freeze({
      sceneId: "reset",
      iconId: "aroma-reset",
      label: "気持ちを切り替えたい",
      candidates: Object.freeze([
        Object.freeze({
          fragranceId: "fragrance-reset-citrus",
          accordLabel: "明るい柑橘の香調",
          description: "軽やかな風景を思わせる香調です。",
          materialNames: Object.freeze(["グレープフルーツ", "ジンジャー"]),
        }),
        Object.freeze({
          fragranceId: "fragrance-reset-green",
          accordLabel: "みずみずしい緑の香調",
          description: "雨上がりの葉を思わせる香調です。",
          materialNames: Object.freeze(["プチグレン"]),
        }),
      ]),
    }),
    Object.freeze({
      sceneId: "quiet-focus",
      iconId: "aroma-quiet-focus",
      label: "静かに取り組みたい",
      candidates: Object.freeze([
        Object.freeze({
          fragranceId: "fragrance-focus-hinoki",
          accordLabel: "澄んだ木質の香調",
          description: "静かな森を思わせる香調です。",
          materialNames: Object.freeze(["ヒノキ", "フランキンセンス"]),
        }),
        Object.freeze({
          fragranceId: "fragrance-focus-herb",
          accordLabel: "清らかな草葉の香調",
          description: "整った庭を思わせる香調です。",
          materialNames: Object.freeze(["ローズマリー"]),
        }),
      ]),
    }),
  ]),
});

function resultTextRecords(host) {
  return collectElements(host)
    .filter(({ className }) => className.includes("result-text-record"));
}

function createReflectionSnapshot({
  questionCount = 50,
  reflectionCount = questionCount === 20 ? 1 : 3,
  resultId = questionCount === 20
    ? "00000000-0000-4000-8000-000000000080"
    : "00000000-0000-4000-8000-000000000081",
} = {}) {
  const snapshot = structuredClone(createTestResultSnapshot({
    resultId,
    questionCount,
  }));
  snapshot.versionTuple.resultTextVersion = "result-text-v2";
  for (const record of snapshot.renderedTexts) record.version = "result-text-v2";
  const reflections = Array.from({ length: reflectionCount }, (_, index) => ({
    id: `title-reflection-balanced-${index + 1}`,
    version: "result-text-v2",
    section: "titleReflection",
    text: `振り返りのヒント${index + 1}`,
    evidenceRefs: ["evidence-result-presentation-contract"],
  }));
  snapshot.renderedTexts.splice(2, 0, ...reflections);
  return snapshot;
}

test("T-005/T-006 result states follow the approved five-state action matrix", () => {
  const states = [
    {
      name: "50 direct",
      questionCount: 50,
      historyDetail: false,
      historyPreviewInProgress: false,
      bottomActions: ["トップへ戻る", "もう一度診断する"],
      bottomActionClasses: ["secondary-button", "secondary-button"],
      palette: true,
      share: true,
      historyReturns: 0,
    },
    {
      name: "50 history",
      questionCount: 50,
      historyDetail: true,
      historyPreviewInProgress: false,
      bottomActions: ["履歴一覧に戻る"],
      bottomActionClasses: ["secondary-button"],
      palette: true,
      share: true,
      historyReturns: 2,
    },
    {
      name: "20 direct",
      questionCount: 20,
      historyDetail: false,
      historyPreviewInProgress: false,
      bottomActions: ["50問へ進む", "簡易プレビューで終了する"],
      bottomActionClasses: ["primary-button", "secondary-button"],
      palette: true,
      share: true,
      historyReturns: 0,
    },
    {
      name: "20 history in progress",
      questionCount: 20,
      historyDetail: true,
      historyPreviewInProgress: true,
      bottomActions: ["50問へ進む", "履歴一覧に戻る"],
      bottomActionClasses: ["primary-button", "secondary-button"],
      palette: false,
      share: false,
      historyReturns: 2,
    },
    {
      name: "20 history finalized",
      questionCount: 20,
      historyDetail: true,
      historyPreviewInProgress: false,
      bottomActions: ["履歴一覧に戻る"],
      bottomActionClasses: ["secondary-button"],
      palette: true,
      share: true,
      historyReturns: 2,
    },
  ];

  for (const [index, state] of states.entries()) {
    const { host } = createFakeScreen();
    const snapshot = createTestResultSnapshot({
      resultId: `00000000-0000-4000-8000-${String(200 + index).padStart(12, "0")}`,
      questionCount: state.questionCount,
    });
    renderSavedResultScreen(host, snapshot, labels, {
      onContinueDetail() {},
      onFinishPreview() {},
      onPausePreview() {},
      onReturnToStart() {},
      onRetry() {},
      onShare() {},
      onSelectPalette() {},
    }, {
      presentation,
      historyDetail: state.historyDetail,
      historyPreviewInProgress: state.historyPreviewInProgress,
      drawRadar: () => ({ drawn: true, errorCode: null }),
    });

    const elements = collectElements(host);
    const bottomActions = elements.find(({ className }) => className === "result-actions");
    assert.deepEqual(
      bottomActions.children.map(({ textContent }) => textContent),
      state.bottomActions,
      `${state.name}: bottom actions`,
    );
    assert.deepEqual(
      bottomActions.children.map(({ className }) => className),
      state.bottomActionClasses,
      `${state.name}: button hierarchy`,
    );
    assert.equal(
      elements.filter(({ className }) => className === "result-palette-selector").length,
      state.palette ? 1 : 0,
      `${state.name}: Palette visibility`,
    );
    assert.equal(
      elements.filter(({ className }) => className === "result-fragrance-section").length,
      1,
      `${state.name}: Aroma visibility`,
    );
    assert.equal(
      elements.filter(({ className }) => className === "result-share-call-to-action").length,
      state.share ? 1 : 0,
      `${state.name}: share visibility`,
    );
    assert.equal(
      elements.filter(({ tagName, attributes, textContent }) =>
        tagName === "a"
        && attributes.get("href") === "#/history"
        && textContent === "履歴一覧に戻る").length,
      state.historyReturns,
      `${state.name}: history returns`,
    );
    assert.doesNotMatch(collectText(host), /あと30問続ける|中断してトップへ/);
  }
});

test("T-007 result sharing uses one primary normal-flow CTA with approved copy", () => {
  const { host } = createFakeScreen();
  renderSavedResultScreen(host, createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000210",
  }), labels, {
    onShare() {},
  }, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const elements = collectElements(host);
  const shareSections = elements.filter(({ className }) =>
    className === "result-share-call-to-action");
  assert.equal(shareSections.length, 1);
  assert.match(collectText(shareSections[0]), /今回の結果を残してみませんか/);
  assert.doesNotMatch(collectText(shareSections[0]), /画像やテキストで共有できます/);
  const shareButtons = collectElements(shareSections[0]).filter(({ tagName, textContent }) =>
    tagName === "button" && textContent === "結果を共有する");
  assert.equal(shareButtons.length, 1);
  assert.equal(shareButtons[0].className, "primary-button");
  assert.equal(
    elements.filter(({ tagName, textContent }) =>
      tagName === "button" && textContent === "結果を共有する").length,
    1,
  );
});

test("T-008A S-003/S-004 renders mode-specific result headings without header actions", () => {
  for (const [questionCount, kicker, title] of [
    [20, "PREVIEW RESULT", "20問簡易プレビュー"],
    [50, "DETAIL RESULT", "50問詳細結果"],
  ]) {
    const { host } = createFakeScreen();

    renderSavedResultScreen(
      host,
      createTestResultSnapshot({
        resultId: `00000000-0000-4000-8000-0000000000${questionCount}`,
        questionCount,
      }),
      labels,
    );

    const heading = collectElements(host)
      .find(({ className }) => className === "screen-heading");
    assert.match(collectText(heading), new RegExp(kicker));
    assert.match(collectText(heading), new RegExp(title));
    assert.equal(
      collectElements(host).filter(({ className }) => className === "app-header-action").length,
      0,
    );
  }
});

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
  assert.doesNotMatch(text, /palette-default|選択色ID/);
  assert.doesNotMatch(text, /rawMean|answers/);

  const factorDetails = collectElements(host)
    .filter(({ className }) => className === "factor-score-row");
  assert.equal(factorDetails.length, 5);
  assert.deepEqual(
    factorDetails.map((element) => collectText(element).trim().split(/\s+/)[0]),
    ["知性・想像力", "勤勉性", "外向性", "協調性", "情緒安定性"],
  );
  assert.equal(
    collectElements(host).some(({ tagName, attributes, textContent }) =>
      tagName === "a"
      && attributes.get("href") === "#/history"
      && textContent === "結果履歴を見る"),
    false,
  );

  assert.equal(resultTextRecords(host).length, 7);
  assert.deepEqual(
    resultTextRecords(host).map(({ attributes }) => attributes.get("data-result-text-id")),
    snapshot.renderedTexts.map(({ id }) => id),
  );
  assert.equal(
    collectElements(host).filter(({ className }) => className.includes("result-evidence")).length,
    0,
  );
  assert.equal(
    collectElements(host).filter(({ className }) => className === "boundary-notices").length,
    0,
  );
  for (const record of snapshot.renderedTexts) {
    assert.equal(resultTextRecords(host).filter(({ textContent }) =>
      textContent === record.text).length, 1);
    assert.doesNotMatch(text, new RegExp(record.evidenceRefs[0]));
  }

  const buttons = collectElements(host).filter(({ tagName }) => tagName === "button");
  buttons.find(({ textContent }) => textContent === "50問へ進む").dispatch("click");
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
  assert.equal(collectElements(host).some(({ tagName, attributes }) =>
    tagName === "a" && attributes.get("href") === "#/history"), false);

  collectElements(host).find(({ tagName, textContent }) =>
    tagName === "button" && textContent === "もう一度診断する").dispatch("click");
  assert.equal(retryCalls, 1);
});

test("T-006 S-004 history detail returns to the history list without fresh-result actions", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000053",
  });

  renderSavedResultScreen(host, snapshot, labels, {
    onReturnToStart() {},
    onRetry() {},
    onShare() {},
  }, {
    historyDetail: true,
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const elements = collectElements(host);
  const historyLinks = elements.filter(({ tagName, attributes, textContent }) =>
    tagName === "a"
    && attributes.get("href") === "#/history"
    && textContent === "履歴一覧に戻る");
  assert.equal(historyLinks.length, 2);
  assert.ok(historyLinks.some(({ className }) => className === "app-header-action"));
  assert.ok(historyLinks.some(({ className }) => className === "secondary-button"));
  assert.equal(elements.some(({ tagName, textContent }) =>
    tagName === "button" && textContent === "トップへ戻る"), false);
  assert.equal(elements.some(({ tagName, textContent }) =>
    tagName === "button" && textContent === "もう一度診断する"), false);
  assert.equal(elements.some(({ tagName, textContent }) =>
    tagName === "button" && textContent === "結果を共有する"), true);
  assert.doesNotMatch(collectText(host), /結果履歴を見る/);
});

test("T-008B S-003 history preview keeps only continuation and history return actions", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000054",
    questionCount: 20,
  });

  renderSavedResultScreen(host, snapshot, labels, {
    onContinueDetail() {},
    onPausePreview() {},
    onFinishPreview() {},
    onShare() {},
  }, {
    historyDetail: true,
    historyPreviewInProgress: true,
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const elements = collectElements(host);
  const actions = elements.find(({ className }) => className === "result-actions");
  const buttons = collectElements(actions)
    .filter(({ tagName }) => tagName === "button")
    .map(({ textContent }) => textContent);
  assert.deepEqual(buttons, ["50問へ進む"]);
  assert.equal(elements.filter(({ tagName, attributes, textContent }) =>
    tagName === "a"
    && attributes.get("href") === "#/history"
    && textContent === "履歴一覧に戻る").length, 2);
  assert.doesNotMatch(
    collectText(host),
    /中断してトップへ|簡易プレビューで終了する|結果を共有する/,
  );
});

test("T-008B F-018 renders three always-visible circular Palette choices", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000063",
  });
  const selected = [];

  renderSavedResultScreen(host, snapshot, labels, {
    onSelectPalette: (paletteId) => selected.push(paletteId),
  }, {
    presentation,
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const paletteChoices = collectElements(host).filter(({ tagName, attributes }) =>
    tagName === "button" && attributes.has("data-palette-id"));
  const palette = collectElements(host).find(({ className }) =>
    className === "result-palette-selector");
  assert.equal(palette.tagName, "section");
  assert.notEqual(palette.tagName, "details");
  assert.equal(palette.attributes.has("data-palette-selector"), true);
  assert.match(collectText(palette), /ココロパレット/);
  assert.match(collectText(palette), /～あなたらしさから着想した色～/);
  assert.match(collectText(palette), /共有カードの色合いに反映されます/);
  assert.deepEqual(
    collectElements(palette)
      .filter(({ attributes }) => attributes.has("data-palette-option-label"))
      .map(({ textContent }) => textContent),
    ["パレット1", "パレット2", "パレット3"],
  );
  assert.doesNotMatch(collectText(palette), /標準|代替|選択中/);
  assert.equal(paletteChoices.length, 3);
  assert.deepEqual(
    paletteChoices.map(({ attributes }) => attributes.get("data-palette-id")),
    [
      "palette-default",
      "palette-alternative-1",
      "palette-alternative-2",
    ],
  );
  assert.deepEqual(
    paletteChoices.map(({ attributes }) => attributes.get("aria-pressed")),
    ["true", "false", "false"],
  );
  assert.match(paletteChoices[0].attributes.get("aria-label"), /パレット1、選択中/);
  assert.match(paletteChoices[1].attributes.get("aria-label"), /パレット2/);
  assert.doesNotMatch(collectText(host), /若葉の余白|朝空のリズム|木陰の灯り/);
  const swatchFrame = paletteChoices[0].children[0];
  assert.equal(swatchFrame.className, "palette-choice__swatch-frame");
  const swatch = swatchFrame.children[0];
  assert.equal(swatch.tagName, "canvas");
  assert.equal(swatch.className, "palette-choice__swatch");
  assert.equal(swatch.attributes.get("width"), "72");
  assert.equal(swatch.attributes.get("height"), "72");
  assert.equal(swatchFrame.children[1].className, "palette-choice__check");

  const factorTrigger = collectElements(host).find(({ attributes }) =>
    attributes.has("data-factor-disclosure-trigger"));
  const factorPanel = collectElements(host).find(({ attributes }) =>
    attributes.has("data-factor-disclosure-panel"));
  factorTrigger.dispatch("click");
  paletteChoices[1].dispatch("click");
  assert.deepEqual(selected, ["palette-alternative-1"]);
  assert.equal(paletteChoices[1].attributes.get("aria-pressed"), "true");
  assert.match(paletteChoices[1].className, /palette-choice--selected/);
  assert.equal(paletteChoices[1].children[0].children[1].textContent, "✓");
  assert.equal(paletteChoices[1].children[0].children[1].hidden, false);
  assert.equal(factorPanel.hidden, false);
  assert.equal(factorTrigger.attributes.get("aria-expanded"), "true");
  assert.equal(snapshot.selectedPaletteId, "palette-default");
  assert.equal(
    collectElements(host).filter(({ className }) =>
      className === "factor-score-row").length,
    5,
  );
  assert.match(collectText(host), /五つの風を見渡す観測者/);
});

test("T-008B F-018 does not accept a Palette disclosure state", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000069",
  });

  renderSavedResultScreen(host, snapshot, labels, {
    onSelectPalette() {},
  }, {
    presentation,
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const palette = collectElements(host).find(({ className }) =>
    className === "result-palette-selector");
  const fragranceDisclosure = collectElements(host).find(({ className }) =>
    className === "result-fragrance-section");
  assert.equal(palette.tagName, "section");
  assert.equal(fragranceDisclosure.tagName, "section");
});

test("T-005 F-018 keeps Aroma closed with three local scene teasers", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000064",
  });

  renderSavedResultScreen(host, snapshot, labels, {
    onSelectPalette() {},
  }, {
    presentation,
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const fragranceDisclosure = collectElements(host).find(({ className }) =>
    className === "result-fragrance-section");
  assert.equal(fragranceDisclosure.tagName, "section");
  const fragranceTrigger = collectElements(fragranceDisclosure).find(({ attributes }) =>
    attributes.has("data-fragrance-disclosure-trigger"));
  const fragrancePanel = collectElements(fragranceDisclosure).find(({ attributes }) =>
    attributes.has("data-fragrance-disclosure-panel"));
  assert.equal(fragranceTrigger.tagName, "button");
  assert.equal(fragranceTrigger.attributes.get("aria-expanded"), "false");
  assert.equal(fragrancePanel.hidden, true);
  assert.match(
    collectText(fragranceTrigger),
    /ココロアロマ.*～あなたらしさから着想した香り～/,
  );
  const teasers = collectElements(fragranceTrigger).filter(({ tagName }) =>
    tagName === "img");
  assert.equal(teasers.length, 3);
  assert.deepEqual(
    teasers.map(({ attributes }) => ({
      src: attributes.get("src"),
      width: attributes.get("width"),
      height: attributes.get("height"),
      loading: attributes.get("loading"),
    })),
    [
      {
        src: "./assets/share-card/aroma-pause-v1.png",
        width: "994",
        height: "857",
        loading: "lazy",
      },
      {
        src: "./assets/share-card/aroma-reset-v1.png",
        width: "1243",
        height: "848",
        loading: "lazy",
      },
      {
        src: "./assets/share-card/aroma-quiet-focus-v1.png",
        width: "875",
        height: "960",
        loading: "lazy",
      },
    ],
  );
  assert.deepEqual(
    teasers.map(({ attributes }) => attributes.get("alt")),
    [
      "ひと息つきたいをイメージした香り",
      "気持ちを切り替えたいをイメージした香り",
      "静かに取り組みたいをイメージした香り",
    ],
  );
});

test("T-005 F-018 opens all six Aroma candidates in the fixed three-scene order", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000064",
  });

  renderSavedResultScreen(host, snapshot, labels, {
    onSelectPalette() {},
  }, {
    presentation,
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const text = collectText(host);
  const fragranceDisclosure = collectElements(host).find(({ className }) =>
    className === "result-fragrance-section");
  const fragranceTrigger = collectElements(fragranceDisclosure).find(({ attributes }) =>
    attributes.has("data-fragrance-disclosure-trigger"));
  const fragrancePanel = collectElements(fragranceDisclosure).find(({ attributes }) =>
    attributes.has("data-fragrance-disclosure-panel"));
  fragranceTrigger.dispatch("click");
  assert.equal(fragranceTrigger.attributes.get("aria-expanded"), "true");
  assert.equal(fragrancePanel.hidden, false);
  const scenes = collectElements(fragrancePanel).filter(({ className }) =>
    className === "result-fragrance-scene");
  assert.equal(scenes.length, 3);
  assert.ok(scenes.every(({ tagName }) => tagName === "section"));
  assert.deepEqual(
    scenes.map((scene) => scene.attributes.get("data-scene-id")),
    ["pause", "reset", "quiet-focus"],
  );
  assert.equal(
    collectElements(host).filter(({ className }) =>
      className === "result-fragrance-candidate").length,
    6,
  );
  for (const expected of [
    "ひと息つきたい",
    "気持ちを切り替えたい",
    "静かに取り組みたい",
    "ローマンカモミール",
    "グレープフルーツ・ジンジャー",
    "ヒノキ・フランキンセンス",
  ]) {
    assert.match(text, new RegExp(expected));
  }
  assert.match(text, /香りをイメージするための素材例です/);
  assert.match(text, /現在の心理状態や効果を示すものではありません/);
  assert.doesNotMatch(text, /fragrance-|material-/);
  assert.equal(
    collectElements(fragrancePanel).filter(({ tagName }) => tagName === "details").length,
    0,
  );
  assert.equal(
    collectElements(fragrancePanel).filter(({ attributes }) =>
      attributes.has("data-scene-disclosure-trigger")).length,
    0,
  );
});

test("T-008B F-018 keeps Palette independent while Aroma remains open", () => {
  const { host } = createFakeScreen();
  renderSavedResultScreen(
    host,
    createTestResultSnapshot({
      resultId: "00000000-0000-4000-8000-000000000065",
    }),
    labels,
    { onSelectPalette() {} },
    {
      presentation,
      drawRadar: () => ({ drawn: true, errorCode: null }),
    },
  );

  const elements = collectElements(host);
  const paletteChoice = elements.find(({ tagName, attributes }) =>
    tagName === "button" && attributes.has("data-palette-id"));
  const aroma = elements.find(({ className }) =>
    className === "result-fragrance-section");
  const aromaTrigger = elements.find(({ attributes }) =>
    attributes.has("data-fragrance-disclosure-trigger"));
  const aromaPanel = elements.find(({ attributes }) =>
    attributes.has("data-fragrance-disclosure-panel"));
  aromaTrigger.dispatch("click");

  paletteChoice.dispatch("click");
  assert.equal(aroma.tagName, "section");
  assert.equal(aromaPanel.hidden, false);
  assert.equal(aromaTrigger.attributes.get("aria-expanded"), "true");
});

test("T-006 F-018 places factors before Palette and Aroma", () => {
  const { host } = createFakeScreen();
  renderSavedResultScreen(
    host,
    createTestResultSnapshot({
      resultId: "00000000-0000-4000-8000-000000000082",
    }),
    labels,
    { onSelectPalette() {} },
    {
      presentation,
      drawRadar: () => ({ drawn: true, errorCode: null }),
    },
  );

  const elements = collectElements(host);
  const radar = elements.find(({ className }) => className === "result-radar");
  const palette = elements.find(({ className }) =>
    className === "result-palette-selector");
  const aroma = elements.find(({ className }) =>
    className === "result-fragrance-section");

  assert.ok(elements.indexOf(radar) < elements.indexOf(palette));
  assert.ok(elements.indexOf(palette) < elements.indexOf(aroma));
  assert.doesNotMatch(collectText(radar), /拡大して見る/);
});

test("T-008B F-005/F-018 keeps all factor and Aroma disclosures closed and mutually exclusive", () => {
  const { host } = createFakeScreen();
  renderSavedResultScreen(
    host,
    createTestResultSnapshot({
      resultId: "00000000-0000-4000-8000-000000000076",
    }),
    labels,
    { onSelectPalette() {} },
    {
      presentation,
      drawRadar: () => ({ drawn: true, errorCode: null }),
    },
  );

  const factorTriggers = collectElements(host).filter(({ attributes }) =>
    attributes.has("data-factor-disclosure-trigger"));
  const factorPanels = collectElements(host).filter(({ attributes }) =>
    attributes.has("data-factor-disclosure-panel"));
  const aromaTrigger = collectElements(host).find(({ attributes }) =>
    attributes.has("data-fragrance-disclosure-trigger"));
  const aromaPanel = collectElements(host).find(({ attributes }) =>
    attributes.has("data-fragrance-disclosure-panel"));

  assert.equal(factorTriggers.length, 5);
  assert.equal(factorPanels.length, 5);
  assert.ok(factorTriggers.every(({ attributes }) =>
    attributes.get("aria-expanded") === "false"));
  assert.ok(factorPanels.every(({ hidden }) => hidden));
  assert.equal(aromaTrigger.attributes.get("aria-expanded"), "false");
  assert.equal(aromaPanel.hidden, true);

  factorTriggers[0].dispatch("click");
  assert.equal(factorPanels[0].hidden, false);
  aromaTrigger.dispatch("click");
  assert.equal(factorPanels[0].hidden, true);
  assert.equal(aromaPanel.hidden, false);
  assert.equal(factorTriggers[0].attributes.get("aria-expanded"), "false");
  assert.equal(aromaTrigger.attributes.get("aria-expanded"), "true");
  let aromaScrollCalls = 0;
  aromaTrigger.scrollIntoView = (options) => {
    assert.deepEqual(options, { block: "nearest" });
    aromaScrollCalls += 1;
  };
  factorTriggers[1].dispatch("click");
  assert.equal(aromaPanel.hidden, true);
  assert.equal(aromaTrigger.attributes.get("aria-expanded"), "false");
  aromaTrigger.dispatch("click");
  assert.equal(aromaPanel.hidden, false);
  assert.equal(aromaScrollCalls, 1);
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
    assert.equal(
      collectElements(host).some(({ tagName, attributes }) =>
        tagName === "a" && attributes.get("href") === "#/history"),
      false,
    );
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
    collectElements(host).filter(({ className }) => className === "result-character-image").length,
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
    collectElements(host).filter(({ className }) => className === "result-character-image").length,
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
    .filter(({ className }) => className === "result-character-image");
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
  assert.doesNotMatch(text, /診断時の選択色ID|palette-default/);
  assert.equal(
    collectElements(host).filter(({ className }) => className === "result-character-image").length,
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
  assert.equal(collectElements(host).some(({ tagName, attributes }) =>
    tagName === "a" && attributes.get("href") === "#/history"), false);
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

test("T-008A F-005/F-006 shows one preview reflection between reason and factors without a disclosure control", () => {
  const { host } = createFakeScreen();
  const snapshot = createReflectionSnapshot({ questionCount: 20 });

  renderSavedResultScreen(host, snapshot, labels, {}, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const main = host.children[0];
  const sectionClasses = main.children.map(({ className }) => className);
  const reasonIndex = sectionClasses.indexOf("result-title-reason");
  const reflectionIndex = sectionClasses.indexOf("result-title-reflection");
  const factorsIndex = sectionClasses.indexOf("result-factors");
  assert.ok(reasonIndex < reflectionIndex && reflectionIndex < factorsIndex);
  const reflection = main.children[reflectionIndex];
  const heading = collectElements(reflection).find(({ tagName, textContent }) =>
    tagName === "h2" && textContent === "振り返りのヒント");
  assert.ok(heading);
  assert.equal(reflection.attributes.get("aria-labelledby"), heading.id);
  assert.deepEqual(
    resultTextRecords(reflection).map(({ textContent }) => textContent),
    ["振り返りのヒント1"],
  );
  assert.match(
    collectText(reflection),
    /20問の簡易結果をもとにした、振り返りの参考情報です。/,
  );
  assert.equal(
    collectElements(reflection).filter(({ className }) =>
      className === "title-reflection-trigger").length,
    0,
  );
  assert.doesNotMatch(collectText(reflection), /もし合いそうなら|参考にしてみてください/);
  assert.deepEqual(
    resultTextRecords(host).map(({ attributes }) =>
      attributes.get("data-result-text-id")),
    snapshot.renderedTexts.map(({ id }) => id),
  );
  const firstFactor = collectElements(host)
    .find(({ className }) => className === "factor-score-row");
  assert.deepEqual(
    resultTextRecords(firstFactor).map(({ attributes }) =>
      attributes.get("data-result-text-id")),
    ["preview20-intellectImagination-middle-observation"],
  );
});

test("T-008A F-005/F-006 progressively discloses two detail reflections with one native button", () => {
  const { host } = createFakeScreen();
  const snapshot = createReflectionSnapshot();

  renderSavedResultScreen(host, snapshot, labels, {}, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const reflection = collectElements(host)
    .find(({ className }) => className === "result-title-reflection");
  const trigger = collectElements(reflection)
    .find(({ className }) => className === "title-reflection-trigger");
  const extra = collectElements(reflection)
    .find(({ className }) => className === "title-reflection-extra");
  assert.equal(resultTextRecords(reflection).length, 3);
  assert.equal(trigger.tagName, "button");
  assert.equal(trigger.textContent, "ほかのヒントを見る");
  assert.equal(trigger.attributes.get("type"), "button");
  assert.equal(trigger.attributes.get("aria-expanded"), "false");
  assert.equal(trigger.attributes.get("aria-controls"), extra.id);
  assert.equal(extra.hidden, true);
  assert.deepEqual(
    resultTextRecords(host).map(({ attributes }) =>
      attributes.get("data-result-text-id")).sort(),
    snapshot.renderedTexts.map(({ id }) => id).sort(),
  );
  const firstFactor = collectElements(host)
    .find(({ className }) => className === "factor-score-row");
  assert.equal(resultTextRecords(firstFactor).length, 8);
  assert.ok(resultTextRecords(firstFactor).every(({ attributes }) =>
    attributes.get("data-result-text-id").includes("intellectImagination")));

  trigger.dispatch("click", { detail: 0 });
  assert.equal(trigger.attributes.get("aria-expanded"), "true");
  assert.equal(trigger.textContent, "閉じる");
  assert.equal(extra.hidden, false);

  const factorTrigger = collectElements(host)
    .find(({ className }) => className === "factor-disclosure-trigger");
  factorTrigger.dispatch("click");
  assert.equal(trigger.attributes.get("aria-expanded"), "true");
  assert.equal(extra.hidden, false);

  trigger.dispatch("click", { detail: 0 });
  assert.equal(trigger.attributes.get("aria-expanded"), "false");
  assert.equal(trigger.textContent, "ほかのヒントを見る");
  assert.equal(extra.hidden, true);
});

test("T-008A F-006 omits the reflection section for valid v1 and v2 zero-reflection snapshots", () => {
  for (const snapshot of [
    createReflectionSnapshot({
      reflectionCount: 0,
      resultId: "00000000-0000-4000-8000-000000000082",
    }),
    createTestResultSnapshot({
      resultId: "00000000-0000-4000-8000-000000000083",
    }),
  ]) {
    const { host } = createFakeScreen();
    renderSavedResultScreen(host, snapshot, labels, {}, {
      drawRadar: () => ({ drawn: true, errorCode: null }),
    });

    assert.equal(
      collectElements(host).filter(({ className }) =>
        className === "result-title-reflection").length,
      0,
    );
    assert.equal(
      collectElements(host).filter(({ className }) =>
        className === "result-title-reason").length,
      1,
    );
    assert.equal(
      collectElements(host).filter(({ className }) =>
        className === "factor-score-row").length,
      5,
    );
    assert.equal(resultTextRecords(host).length, 42);
  }
});

test("T-008A F-006 rejects a persisted snapshot with a partial reflection group", () => {
  const { host } = createFakeScreen();
  const snapshot = createReflectionSnapshot({
    reflectionCount: 2,
    resultId: "00000000-0000-4000-8000-000000000084",
  });

  assert.throws(
    () => renderSavedResultScreen(host, snapshot, labels, {}, {
      drawRadar: () => ({ drawn: true, errorCode: null }),
    }),
    { name: "TypeError", message: "RESULT_SCREEN_INVALID" },
  );
});

test("T-008A F-005 opens every detail category for a factor in one action", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000071",
  });

  renderSavedResultScreen(host, snapshot, labels, {}, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const factorTriggers = collectElements(host)
    .filter(({ className }) => className === "factor-disclosure-trigger");
  const categoryLabels = collectElements(host)
    .filter(({ className }) => className === "factor-category-label");
  const categorySummaries = collectElements(host)
    .filter(({ className }) => className === "factor-category-summary");
  const evidenceDisclosures = collectElements(host)
    .filter(({ className }) => className === "result-evidence");
  const factorPanels = collectElements(host)
    .filter(({ className }) => className === "factor-disclosure-panel");
  const scoreRows = collectElements(host)
    .filter(({ className }) => className === "factor-score-row");
  const bars = collectElements(host)
    .filter(({ className }) => className === "factor-score-bar");

  assert.equal(scoreRows.length, 5);
  assert.equal(bars.length, 5);
  assert.equal(factorTriggers.length, 5);
  assert.equal(evidenceDisclosures.length, 0);
  assert.deepEqual(
    factorTriggers.map(({ attributes }) => attributes.get("aria-label")),
    ["知性・想像力", "勤勉性", "外向性", "協調性", "情緒安定性"]
      .map((label, index) =>
        `${label}、スコア${bars[index].attributes.get("aria-valuenow")}点、詳しい結果を見る`
      ),
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
  assert.equal(categorySummaries.length, 0);
  assert.equal(
    collectElements(host).filter(({ className }) =>
      className === "category-disclosure-trigger").length,
    0,
  );
  assert.equal(
    collectElements(host).filter(({ textContent }) =>
      textContent === "因子を選ぶと、詳しい結果を確認できます。").length,
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
  for (const trigger of factorTriggers) {
    assert.equal(trigger.attributes.get("type"), "button");
    assert.equal(trigger.attributes.get("aria-expanded"), "false");
    assert.ok(trigger.attributes.get("aria-controls"));
    assert.ok(trigger.attributes.get("data-factor-disclosure-trigger"));
  }
  for (const bar of bars) {
    assert.equal(bar.tagName, "progress");
    assert.equal(bar.attributes.get("max"), "100");
    assert.equal(bar.attributes.get("value"), bar.attributes.get("aria-valuenow"));
    assert.equal(bar.attributes.has("style"), false);
  }

  let scrolled = 0;
  factorTriggers[0].scrollIntoView = (options) => {
    assert.deepEqual(options, { block: "nearest" });
    scrolled += 1;
  };
  factorTriggers[0].dispatch("click");
  assert.equal(factorTriggers[0].attributes.get("aria-expanded"), "true");
  assert.equal(factorPanels[0].hidden, false);
  assert.equal(
    collectElements(factorPanels[0]).filter(({ className }) =>
      className === "factor-category").length,
    7,
  );
  assert.equal(
    collectElements(factorPanels[0]).filter(({ className }) =>
      className === "result-text-record").length,
    8,
  );
  assert.equal(scrolled, 1);
  factorTriggers[1].dispatch("click");
  assert.equal(factorTriggers[0].attributes.get("aria-expanded"), "false");
  assert.equal(factorPanels[0].hidden, true);
  assert.equal(factorTriggers[1].attributes.get("aria-expanded"), "true");
  assert.equal(factorPanels[1].hidden, false);
  assert.doesNotMatch(collectText(host), /拡大して見る/);
});

test("T-008A F-005 opens the saved preview observation with its factor", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000072",
    questionCount: 20,
  });

  renderSavedResultScreen(host, snapshot, labels, {}, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
  });

  const categoryLabels = collectElements(host)
    .filter(({ className }) => className === "factor-category-label");
  const factorTriggers = collectElements(host)
    .filter(({ className }) => className === "factor-disclosure-trigger");
  const categorySummaries = collectElements(host)
    .filter(({ className }) => className === "factor-category-summary");
  const factorPanels = collectElements(host)
    .filter(({ className }) => className === "factor-disclosure-panel");
  assert.equal(categorySummaries.length, 0);
  assert.deepEqual(categoryLabels.map(({ textContent }) => textContent), Array(5).fill("今の傾向"));
  assert.equal(
    collectElements(host).filter(({ className }) =>
      className === "category-disclosure-trigger").length,
    0,
  );
  assert.equal(
    collectElements(host).filter(({ textContent }) =>
      textContent === "因子を選ぶと、詳しい結果を確認できます。").length,
    0,
  );
  assert.deepEqual(
    resultTextRecords(host).map(({ attributes }) => attributes.get("data-result-text-id")),
    snapshot.renderedTexts.map(({ id }) => id),
  );
  factorTriggers[0].dispatch("click");
  assert.equal(factorPanels[0].hidden, false);
  assert.equal(
    collectElements(factorPanels[0]).filter(({ className }) =>
      className === "result-text-record").length,
    1,
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
    .filter(({ className }) => className.split(" ").includes("bottom-sheet-launcher"));
  assert.deepEqual(
    launchers.map(({ textContent }) => textContent),
    ["因子ごとの設問構成を見る", "測定の土台", "スコアの計算方法", "この結果の限界", "出典・利用条件"],
  );
  assert.match(collectText(first.host), /結果の根拠と見方/);
  assert.match(
    collectText(first.host),
    /測定方法や、今回の結果を読むための補足情報です。/,
  );
  const compositionSheet = collectElements(first.host).find(
    ({ id }) => id === "question-composition",
  );
  assert.match(collectText(compositionSheet), /今回の結果：50問/);
  assert.match(
    collectText(compositionSheet),
    /設問本文や回答内容は表示しません。構成上の項目数だけを確認できます。/,
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

test("T-008A F-008 labels preview composition as the current 20-question result", () => {
  const { host } = createFakeScreen();
  const snapshot = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000075",
    questionCount: 20,
  });
  renderSavedResultScreen(host, snapshot, labels, {}, {
    drawRadar: () => ({ drawn: true, errorCode: null }),
    questionComposition: Object.freeze([
      Object.freeze({ factorId: "intellectImagination", positiveCount: 2, negativeCount: 2 }),
    ]),
    methodInfo: Object.freeze([]),
  });

  const compositionSheet = collectElements(host).find(
    ({ id }) => id === "question-composition",
  );
  assert.match(collectText(compositionSheet), /今回の結果：20問/);
});
