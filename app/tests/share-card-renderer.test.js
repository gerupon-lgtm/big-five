import assert from "node:assert/strict";
import test from "node:test";

import {
  PaletteDefinitions,
  PaletteUsageMappingDefinitions,
} from "../js/data/presentation-definitions.js";
import {
  contrastRatio,
  resolvePaletteUsage,
} from "../js/domain/palette-usage.js";
import { renderShareCard } from "../js/presentation/share-card-renderer.js";

function makeModel({
  character = {
  path: "./assets/characters/cat.webp",
  alt: "結果の猫",
  width: 1024,
  height: 1024,
  },
  titleReason = "五つの因子を見渡した結果です。",
  factorScores = [75, 60, 50, 40, 25],
} = {}) {
  return Object.freeze({
    width: 1080,
    height: 1800,
    mimeType: "image/png",
    filename: "kokoro-parea-result.png",
    brand: Object.freeze({
      name: "ココロパレア",
      cardSubtitle: "～Big Five 自己理解支援ツール～",
      iconPath: "./assets/brand/kokoro-parea-mark.svg",
      cardIconPath: "./assets/brand/kokoro-parea-icon-512.png",
    }),
    modeLabel: "50問 詳細結果",
    titleLabel: "五つの風を見渡す観測者",
    titleReason,
    character,
    factors: Object.freeze([
      ["intellectImagination", "知性・想像力", factorScores[0]],
      ["conscientiousness", "勤勉性", factorScores[1]],
      ["extraversion", "外向性", factorScores[2]],
      ["agreeableness", "協調性", factorScores[3]],
      ["emotionalStability", "情緒安定性", factorScores[4]],
    ].map(([factorId, label, displayScore]) =>
      Object.freeze({ factorId, label, displayScore }))),
    fragrances: Object.freeze([
      Object.freeze({ sceneId: "pause", sceneLabel: "ひと息つきたい", materialNames: Object.freeze(["ローマンカモミール"]), accordLabel: "草花の香調" }),
      Object.freeze({ sceneId: "reset", sceneLabel: "気持ちを切り替えたい", materialNames: Object.freeze(["グレープフルーツ", "ジンジャー"]), accordLabel: "柑橘の香調" }),
      Object.freeze({ sceneId: "quiet-focus", sceneLabel: "静かに取り組みたい", materialNames: Object.freeze(["ヒノキ", "フランキンセンス"]), accordLabel: "木質の香調" }),
    ]),
    disclaimer: "これは性格の優劣や心理学上の正式なタイプを示すものではありません。",
    versions: Object.freeze({
      appVersion: "mvp-0.1.0",
      cardTemplateVersion: "card-template-v1",
      presentationDefinitionVersion: "presentation-v2",
      resultTextVersion: "result-text-v2",
    }),
    palette: Object.freeze({
      paletteId: "palette-default",
      label: "朝凪",
      background: "#F4F7F8",
      surface: "#FBFCF7",
      accent: "#EEAABB",
      text: "#252A2D",
      chart: "#7799AA",
    }),
    shareText: "共有テキスト",
  });
}

function recordingDependencies({
  fontsReady = Promise.resolve(),
  pngBlob = new Blob(["png"], { type: "image/png" }),
  throwImageData = false,
  failCharacter = false,
  failCanvas = false,
} = {}) {
  const operations = [];
  let canvasCount = 0;
  const createCanvas = (width, height) => {
    if (failCanvas) throw new Error("canvas unavailable");
    canvasCount += 1;
    const kind = canvasCount === 1 ? "main" : "analysis";
    operations.push(["canvas", kind, width, height]);
    const context = {
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 0,
      font: "",
      textAlign: "start",
      textBaseline: "alphabetic",
      globalAlpha: 1,
      shadowColor: "",
      shadowBlur: 0,
      shadowOffsetY: 0,
      save: () => operations.push(["save", kind]),
      restore: () => operations.push(["restore", kind]),
      beginPath: () => operations.push(["beginPath", kind]),
      closePath: () => operations.push(["closePath", kind]),
      moveTo: (x, y) => operations.push(["moveTo", kind, x, y]),
      lineTo: (x, y) => operations.push(["lineTo", kind, x, y]),
      bezierCurveTo: (...args) => operations.push(["bezierCurveTo", kind, ...args]),
      arc: (...args) => operations.push(["arc", kind, ...args]),
      fill: () => operations.push(["fill", kind, context.fillStyle]),
      stroke: () => operations.push(["stroke", kind]),
      fillRect: (...args) => operations.push(["fillRect", kind, ...args]),
      strokeRect: (...args) => operations.push(["strokeRect", kind, ...args]),
      fillText: (text, x, y) =>
        operations.push(["fillText", kind, text, x, y, context.fillStyle]),
      measureText: (text) => ({ width: text.length * 24 }),
      clearRect: (...args) => operations.push(["clearRect", kind, ...args]),
      drawImage: (...args) => operations.push([
        "drawImage",
        kind,
        args[0].path,
        ...args.slice(1),
      ]),
      getImageData: () => {
        if (throwImageData) throw new Error("tainted");
        const data = new Uint8ClampedArray(64 * 64 * 4);
        for (let offset = 0; offset < data.length; offset += 4) {
          data[offset] = 238;
          data[offset + 1] = 238;
          data[offset + 2] = 238;
          data[offset + 3] = 255;
        }
        return { data, width: 64, height: 64 };
      },
    };
    return {
      width,
      height,
      getContext: () => context,
      toBlob: (callback, mimeType) => {
        operations.push(["toBlob", mimeType]);
        callback(pngBlob);
      },
    };
  };
  const loadImage = async (path) => {
    operations.push(["loadImage", path]);
    if (failCharacter && path.endsWith(".webp")) throw new Error("cat missing");
    return { path, naturalWidth: 1024, naturalHeight: 1024 };
  };
  return {
    dependencies: { createCanvas, loadImage, fontsReady },
    operations,
    pngBlob,
  };
}

test("T-007 F-011 renders the fixed card order, five bars, three aroma rows, and contained cat", async () => {
  const { dependencies, operations, pngBlob } = recordingDependencies();

  const result = await renderShareCard(makeModel(), dependencies);

  assert.deepEqual(result, { status: "ok", blob: pngBlob });
  assert.deepEqual(operations[0], ["canvas", "main", 1080, 1800]);
  assert.ok(operations.some((operation) =>
    operation[0] === "canvas" && operation[1] === "analysis" &&
    operation[2] === 64 && operation[3] === 64));
  const texts = operations
    .filter(([operation, kind]) => operation === "fillText" && kind === "main")
    .map(([, , text]) => text);
  assert.ok(texts.indexOf("ココロパレア") < texts.indexOf("あなたの称号"));
  assert.ok(texts.indexOf("あなたの称号") < texts.indexOf("五つの風を見渡す観測者"));
  assert.ok(texts.indexOf("五つの風を見渡す観測者") < texts.indexOf("知性・想像力"));
  assert.ok(texts.indexOf("情緒安定性") < texts.indexOf("ココロアロマ"));
  assert.ok(texts.indexOf("ココロアロマ") < texts.indexOf("～あなたらしさから着想した香り～"));
  assert.ok(texts.indexOf("～あなたらしさから着想した香り～") < texts.indexOf("ひと息つきたい"));
  assert.ok(texts.indexOf("ひと息つきたい") < texts.indexOf("ローマンカモミール"));
  assert.ok(texts.indexOf("ローマンカモミール") < texts.indexOf("気持ちを切り替えたい"));
  assert.ok(texts.indexOf("気持ちを切り替えたい") < texts.indexOf("グレープフルーツ・ジンジャー"));
  assert.ok(texts.indexOf("グレープフルーツ・ジンジャー") < texts.indexOf("静かに取り組みたい"));
  assert.ok(texts.indexOf("静かに取り組みたい") < texts.indexOf("ヒノキ・フランキンセンス"));
  assert.ok(texts.indexOf("ヒノキ・フランキンセンス") <
    texts.indexOf("香りをイメージするための素材例です"));
  assert.ok(texts.indexOf("静かに取り組みたい") < texts.indexOf("50問 詳細結果"));
  assert.ok(texts.includes("～Big Five 自己理解支援ツール～"));
  assert.ok(texts.includes("香りをイメージするための素材例です"));
  assert.ok(texts.includes("これは性格の優劣や心理学上の正式なタイプを示すものではありません。"));
  assert.ok(texts.includes("mvp-0.1.0"));
  assert.equal(texts.some((text) =>
    text.includes("card-template-v1") ||
    text.includes("presentation-v2") ||
    text.includes("result-text-v2")), false);
  assert.equal(texts.filter((text) => Object.values({
    intellectImagination: "知性・想像力",
    conscientiousness: "勤勉性",
    extraversion: "外向性",
    agreeableness: "協調性",
    emotionalStability: "情緒安定性",
  }).includes(text)).length, 5);
  assert.equal(texts.filter((text) =>
    ["ひと息つきたい", "気持ちを切り替えたい", "静かに取り組みたい"]
      .includes(text)).length, 3);
  const finalCatDraw = operations.find((operation) =>
    operation[0] === "drawImage" &&
    operation[1] === "main" &&
    operation[2].endsWith(".webp"));
  assert.deepEqual(finalCatDraw.slice(3), [225, 330, 630, 630]);
  assert.equal(operations.some((operation) =>
    operation[0] === "loadImage" &&
    operation[1] === "./assets/brand/kokoro-parea-icon-512.png"), true);
  assert.equal(operations.some((operation) =>
    operation[0] === "loadImage" &&
    operation[1] === "./assets/brand/kokoro-parea-mark.svg"), false);
  const aromaDraws = operations.filter((operation) =>
    operation[0] === "drawImage" &&
    operation[1] === "main" &&
    operation[2].startsWith("./assets/share-card/aroma-"));
  assert.deepEqual(aromaDraws.map((operation) => operation[2]), [
    "./assets/share-card/aroma-pause-v1.png",
    "./assets/share-card/aroma-reset-v1.png",
    "./assets/share-card/aroma-quiet-focus-v1.png",
  ]);
  assert.ok(operations.some((operation) =>
    operation[0] === "toBlob" && operation[1] === "image/png"));
});

test("T-007 F-015 preserves a text-complete card when the cat fails", async () => {
  const { dependencies, operations } = recordingDependencies({ failCharacter: true });

  const result = await renderShareCard(makeModel(), dependencies);

  assert.equal(result.status, "ok");
  assert.equal(operations.some((operation) =>
    operation[0] === "drawImage" &&
    operation[1] === "main" &&
    operation[2].endsWith(".webp")), false);
  assert.ok(operations.some((operation) =>
    operation[0] === "fillText" &&
    operation[2] === "五つの風を見渡す観測者"));
});

test("T-007 F-011 keeps zero scores visually empty and uses readable text colors", async () => {
  const { dependencies, operations } = recordingDependencies();

  const result = await renderShareCard(
    makeModel({ factorScores: [0, 1, 50, 99, 100] }),
    dependencies,
  );

  assert.equal(result.status, "ok");
  const factorFills = operations.filter((operation) =>
    operation[0] === "fill" &&
    operation[1] === "main" &&
    ["#EF6471", "#54A8D8", "#F2AA22", "#8AAF50", "#9475C4"]
      .includes(operation[2]));
  assert.equal(factorFills.length, 4);
  assert.equal(factorFills.some((operation) => operation[2] === "#EF6471"), false);

  const scoreColors = operations
    .filter((operation) =>
      operation[0] === "fillText" &&
      operation[1] === "main" &&
      ["0", "1", "50", "99", "100"].includes(operation[2]))
    .map((operation) => operation[5]);
  assert.deepEqual(scoreColors, [
    "#9B2837",
    "#1C648F",
    "#8A5200",
    "#466522",
    "#5B4086",
  ]);
  const accordColors = operations
    .filter((operation) =>
      operation[0] === "fillText" &&
      operation[1] === "main" &&
      operation[2].endsWith("の香調"))
    .map((operation) => operation[5]);
  assert.deepEqual(accordColors, ["#48632A", "#8A4D00", "#5B4674"]);

  for (const palette of PaletteDefinitions) {
    const mapping = PaletteUsageMappingDefinitions.find((candidate) =>
      candidate.paletteId === palette.paletteId);
    const usage = resolvePaletteUsage(palette, mapping);
    for (const color of scoreColors) {
      assert.ok(contrastRatio(color, usage.background) >= 4.5);
    }
    for (const color of accordColors) {
      assert.ok(contrastRatio(color, usage.surface) >= 4.5);
    }
  }
});

test("T-007 F-011 keeps the detailed title reason out of the approved compact card", async () => {
  const titleReason = "今回の回答では、".repeat(10);
  const { dependencies, operations } = recordingDependencies();

  const result = await renderShareCard(makeModel({ titleReason }), dependencies);

  assert.equal(result.status, "ok");
  const reasonLines = operations.filter((operation) =>
    operation[0] === "fillText" &&
    operation[1] === "main" &&
    operation[2].includes("今回の回答では、"));
  assert.equal(reasonLines.length, 0);
  assert.equal(operations.some((operation) =>
    operation[0] === "fillText" &&
    operation[1] === "main" &&
    operation[2] === "五つの風を見渡す観測者"), true);
});

test("T-007 F-016 falls back to a circular neutral wash without a rectangular cat plate", async () => {
  const { dependencies, operations } = recordingDependencies({ throwImageData: true });

  const result = await renderShareCard(makeModel(), dependencies);

  assert.equal(result.status, "ok");
  const catIndex = operations.findIndex((operation) =>
    operation[0] === "drawImage" &&
    operation[1] === "main" &&
    operation[2].endsWith(".webp"));
  const legacyPlateIndex = operations.findIndex((operation) =>
    operation[0] === "fillRect" &&
    operation[1] === "main" &&
    operation[2] === 244 &&
    operation[3] === 396);
  const circularWashIndex = operations.findIndex((operation) =>
    operation[0] === "arc" &&
    operation[1] === "main" &&
    operation[2] === 540 &&
    operation[3] === 650);
  assert.equal(legacyPlateIndex, -1);
  assert.ok(circularWashIndex >= 0 && circularWashIndex < catIndex);
});

test("T-007 F-015 returns stable renderer errors", async () => {
  const cases = [
    [recordingDependencies({ failCanvas: true }).dependencies, "SHARE_CANVAS_UNAVAILABLE"],
    [recordingDependencies({ fontsReady: Promise.reject(new Error("font")) }).dependencies, "SHARE_FONT_UNAVAILABLE"],
    [recordingDependencies({ pngBlob: null }).dependencies, "SHARE_PNG_UNAVAILABLE"],
  ];

  for (const [dependencies, errorCode] of cases) {
    assert.deepEqual(await renderShareCard(makeModel(), dependencies), {
      status: "error",
      errorCode,
    });
  }
});
