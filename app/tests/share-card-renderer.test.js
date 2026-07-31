import assert from "node:assert/strict";
import test from "node:test";

import { renderShareCard } from "../js/presentation/share-card-renderer.js";

function makeModel({
  character = {
  path: "./assets/characters/cat.webp",
  alt: "結果の猫",
  width: 1024,
  height: 1024,
  },
  titleReason = "五つの因子を見渡した結果です。",
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
    }),
    modeLabel: "50問 詳細結果",
    titleLabel: "五つの風を見渡す観測者",
    titleReason,
    character,
    factors: Object.freeze([
      ["intellectImagination", "知性・想像力", 75],
      ["conscientiousness", "勤勉性", 60],
      ["extraversion", "外向性", 50],
      ["agreeableness", "協調性", 40],
      ["emotionalStability", "情緒安定性", 25],
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
      fill: () => operations.push(["fill", kind]),
      stroke: () => operations.push(["stroke", kind]),
      fillRect: (...args) => operations.push(["fillRect", kind, ...args]),
      strokeRect: (...args) => operations.push(["strokeRect", kind, ...args]),
      fillText: (text, x, y) => operations.push(["fillText", kind, text, x, y]),
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
  assert.ok(texts.indexOf("ココロパレア") < texts.indexOf("五つの風を見渡す観測者"));
  assert.ok(texts.indexOf("五つの風を見渡す観測者") < texts.indexOf("知性・想像力"));
  assert.ok(texts.indexOf("情緒安定性") < texts.indexOf("ひと息つきたい"));
  assert.ok(texts.indexOf("ひと息つきたい") < texts.indexOf("ローマンカモミール"));
  assert.ok(texts.indexOf("ローマンカモミール") < texts.indexOf("気持ちを切り替えたい"));
  assert.ok(texts.indexOf("気持ちを切り替えたい") < texts.indexOf("グレープフルーツ・ジンジャー"));
  assert.ok(texts.indexOf("グレープフルーツ・ジンジャー") < texts.indexOf("静かに取り組みたい"));
  assert.ok(texts.indexOf("静かに取り組みたい") < texts.indexOf("ヒノキ・フランキンセンス"));
  assert.ok(texts.indexOf("静かに取り組みたい") < texts.indexOf("50問 詳細結果"));
  assert.ok(texts.includes("～Big Five 自己理解支援ツール～"));
  assert.ok(texts.includes("これは性格の優劣や心理学上の正式なタイプを示すものではありません。"));
  assert.ok(texts.some((text) =>
    text.includes("mvp-0.1.0") &&
    text.includes("card-template-v1") &&
    text.includes("presentation-v2") &&
    text.includes("result-text-v2")));
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
  assert.deepEqual(finalCatDraw.slice(3), [280, 420, 520, 520]);
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

test("T-007 F-011 wraps a long title reason inside the card width", async () => {
  const titleReason = "今回の回答では、".repeat(10);
  const { dependencies, operations } = recordingDependencies();

  const result = await renderShareCard(makeModel({ titleReason }), dependencies);

  assert.equal(result.status, "ok");
  const reasonLines = operations.filter((operation) =>
    operation[0] === "fillText" &&
    operation[1] === "main" &&
    operation[3] === 540 &&
    [338, 364, 390].includes(operation[4]));
  assert.equal(reasonLines.length, 3);
  assert.equal(reasonLines.map((operation) => operation[2]).join(""), titleReason);
  assert.equal(reasonLines.some((operation) => operation[2] === titleReason), false);
});

test("T-007 F-016 falls back to a neutral plate when cat pixels cannot be read", async () => {
  const { dependencies, operations } = recordingDependencies({ throwImageData: true });

  const result = await renderShareCard(makeModel(), dependencies);

  assert.equal(result.status, "ok");
  const catIndex = operations.findIndex((operation) =>
    operation[0] === "drawImage" &&
    operation[1] === "main" &&
    operation[2].endsWith(".webp"));
  const plateIndex = operations.findIndex((operation) =>
    operation[0] === "fillRect" &&
    operation[1] === "main" &&
    operation[2] === 244 &&
    operation[3] === 396);
  assert.ok(plateIndex >= 0 && plateIndex < catIndex);
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
