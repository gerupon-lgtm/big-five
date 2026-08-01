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
  appVersion = "mvp-1.0.0",
  cardTemplateVersion = "card-template-v2",
  modeLabel = "50問 詳細結果",
  disclaimer = "これは性格の優劣や心理学上の正式なタイプを示すものではありません。",
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
    modeLabel,
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
    disclaimer,
    versions: Object.freeze({
      appVersion,
      cardTemplateVersion,
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
      fill: () => operations.push([
        "fill",
        kind,
        context.fillStyle,
        context.globalAlpha,
      ]),
      stroke: () => operations.push([
        "stroke",
        kind,
        context.strokeStyle,
        context.globalAlpha,
        context.lineWidth,
      ]),
      fillRect: (...args) => operations.push(["fillRect", kind, ...args]),
      strokeRect: (...args) => operations.push(["strokeRect", kind, ...args]),
      fillText: (text, x, y) =>
        operations.push([
          "fillText",
          kind,
          text,
          x,
          y,
          context.fillStyle,
          context.font,
        ]),
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

function collectPaintedPathBounds(operations) {
  const paths = [];
  let points = null;

  for (const operation of operations) {
    if (operation[0] === "beginPath") {
      points = [];
      continue;
    }
    if (!points) continue;
    if (operation[0] === "moveTo" || operation[0] === "lineTo") {
      points.push({ x: operation[2], y: operation[3] });
      continue;
    }
    if (operation[0] === "bezierCurveTo") {
      points.push(
        { x: operation[2], y: operation[3] },
        { x: operation[4], y: operation[5] },
        { x: operation[6], y: operation[7] },
      );
      continue;
    }
    if (operation[0] === "arc") {
      const [, , x, y, radius] = operation;
      points.push(
        { x: x - radius, y: y - radius },
        { x: x + radius, y: y + radius },
      );
      continue;
    }
    if ((operation[0] === "fill" || operation[0] === "stroke") && points.length > 0) {
      const xs = points.map(({ x }) => x);
      const ys = points.map(({ y }) => y);
      paths.push({
        paint: operation[0],
        left: Math.min(...xs),
        right: Math.max(...xs),
        top: Math.min(...ys),
        bottom: Math.max(...ys),
      });
      points = null;
    }
  }

  return paths;
}

function intersects(bounds, rectangle) {
  return !(
    bounds.right < rectangle.left ||
    bounds.left > rectangle.right ||
    bounds.bottom < rectangle.top ||
    bounds.top > rectangle.bottom
  );
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
  const brandCharacters = operations
    .filter((operation) =>
      operation[0] === "fillText" &&
      operation[1] === "main" &&
      "ココロパレア".includes(operation[2]) &&
      operation[2].length === 1);
  assert.equal(brandCharacters.map((operation) => operation[2]).join(""), "ココロパレア");
  assert.ok(brandCharacters.at(-1)[3] > brandCharacters[0][3] + 180);
  assert.ok(operations.indexOf(brandCharacters[0]) <
    operations.findIndex((operation) =>
      operation[0] === "fillText" && operation[2] === "あなたの称号"));
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
  assert.ok(texts.includes("mvp-1.0.0"));
  assert.equal(texts.some((text) =>
    text.includes("card-template-v2") ||
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

test("T-007 F-011 reproduces the legacy v1 layout for v1 history", async () => {
  const { dependencies, operations } = recordingDependencies();

  const result = await renderShareCard(makeModel({
    appVersion: "mvp-0.1.0",
    cardTemplateVersion: "card-template-v1",
  }), dependencies);

  assert.equal(result.status, "ok");
  assert.ok(operations.some((operation) =>
    operation[0] === "fillText"
    && operation[1] === "main"
    && operation[2] === "ココロパレア"
    && operation[3] === 408
    && operation[4] === 100));
  assert.equal(operations.some((operation) =>
    operation[0] === "fillText"
    && operation[1] === "main"
    && operation[2].length === 1
    && "ココロパレア".includes(operation[2])), false);
  assert.ok(operations.some((operation) =>
    operation[0] === "arc"
    && operation[1] === "main"
    && operation[2] === 540
    && operation[3] === 650
    && operation[4] === 270));
  assert.ok(operations.some((operation) =>
    operation[0] === "stroke"
    && operation[1] === "main"
    && operation[3] === 0.16
    && operation[4] === 4));
});

test("T-007 F-015 rejects an unsupported historical card template safely", async () => {
  const { dependencies } = recordingDependencies();

  const result = await renderShareCard(makeModel({
    cardTemplateVersion: "card-template-v999",
  }), dependencies);

  assert.deepEqual(result, {
    status: "error",
    errorCode: "SHARE_CARD_TEMPLATE_UNSUPPORTED",
  });
});

test("T-008C F-011 renders the v2 plant-only open arch outside the protected cat center", async () => {
  const { dependencies, operations } = recordingDependencies({
    throwImageData: true,
  });

  const result = await renderShareCard(makeModel(), dependencies);

  assert.equal(result.status, "ok");
  assert.equal(operations.some((operation) =>
    operation[0] === "arc" &&
    operation[1] === "main" &&
    operation[2] === 540 &&
    operation[3] === 650 &&
    operation[4] === 270), false);

  const firstCharacterDraw = operations.findIndex((operation) =>
    operation[0] === "drawImage" &&
    operation[1] === "main" &&
    operation[2].endsWith(".webp"));
  const expectedAnchors = [
    [350, 850],
    [285, 680],
    [315, 505],
    [730, 850],
    [795, 680],
    [765, 505],
  ];
  const expectedAnchorKeys = new Set(expectedAnchors.map(([x, y]) => `${x}:${y}`));
  const actualAnchors = operations
    .slice(0, firstCharacterDraw)
    .filter((operation) =>
      operation[0] === "moveTo" &&
      operation[1] === "main" &&
      expectedAnchorKeys.has(`${operation[2]}:${operation[3]}`))
    .map((operation) => operation.slice(2));
  assert.deepEqual(actualAnchors, expectedAnchors);

  const firstArchAnchor = operations.findIndex((operation) =>
    operation[0] === "moveTo" &&
    operation[1] === "main" &&
    operation[2] === expectedAnchors[0][0] &&
    operation[3] === expectedAnchors[0][1]);
  assert.ok(firstArchAnchor > 0);
  const archOperations = operations.slice(firstArchAnchor - 1, firstCharacterDraw);
  const botanicalFills = archOperations.filter((operation) =>
    operation[0] === "fill" && operation[1] === "main");
  assert.ok(botanicalFills.length >= 36);

  const botanicalPaths = collectPaintedPathBounds(archOperations);
  const leftPaths = botanicalPaths.filter(({ right }) => right < 400);
  const rightPaths = botanicalPaths.filter(({ left }) => left > 680);
  assert.ok(leftPaths.filter(({ paint }) => paint === "fill").length >= 18);
  assert.ok(rightPaths.filter(({ paint }) => paint === "fill").length >= 18);

  const protectedCatCenter = { left: 390, right: 690, top: 430, bottom: 900 };
  assert.equal(
    botanicalPaths.some((bounds) => intersects(bounds, protectedCatCenter)),
    false,
  );
  const openCenterCorridor = { left: 400, right: 680, top: 330, bottom: 900 };
  assert.equal(
    botanicalPaths.some((bounds) => intersects(bounds, openCenterCorridor)),
    false,
  );

  assert.ok(Math.min(...botanicalPaths.map(({ left }) => left)) <= 250);
  assert.ok(Math.max(...botanicalPaths.map(({ right }) => right)) >= 830);
  assert.ok(Math.min(...botanicalPaths.map(({ top }) => top)) <= 350);
  assert.ok(Math.max(...botanicalPaths.map(({ bottom }) => bottom)) >= 850);

  const backdropArc = operations.findIndex((operation) =>
    operation[0] === "arc" &&
    operation[1] === "main" &&
    operation[2] === 540 &&
    operation[3] === 650 &&
    operation[4] === 244);
  assert.equal(backdropArc, -1);
});

test("T-007 F-011 fills aroma whitespace without overlapping footer copy", async () => {
  const { dependencies, operations } = recordingDependencies();

  const result = await renderShareCard(makeModel(), dependencies);

  assert.equal(result.status, "ok");
  const accordLabels = operations.filter((operation) =>
    operation[0] === "fillText"
    && operation[1] === "main"
    && operation[2].endsWith("の香調"));
  assert.equal(accordLabels.length, 3);
  assert.ok(accordLabels.every((operation) =>
    operation[6].includes("21px")));

  const aromaConnectors = operations.filter((operation) =>
    operation[0] === "arc"
    && operation[1] === "main"
    && operation[4] === 2.2
    && [1335, 1457, 1579].includes(operation[3]));
  for (const y of [1335, 1457, 1579]) {
    assert.ok(aromaConnectors.filter((operation) => operation[3] === y).length >= 2);
  }

  const aromaNote = operations.find((operation) =>
    operation[0] === "fillText"
    && operation[1] === "main"
    && operation[2] === "香りをイメージするための素材例です");
  const version = operations.find((operation) =>
    operation[0] === "fillText"
    && operation[1] === "main"
    && operation[2] === "mvp-1.0.0");
  assert.equal(aromaNote[4], 1649);
  assert.equal(version[4], 1756);
});

test("T-007 F-011 separates the preview note, two-line disclaimer, mode, and version", async () => {
  const disclaimer = [
    "これは性格の優劣や心理学上の正式なタイプを示すものではありません。",
    "20問の簡易プレビューであり、50問で結果が変わることがあります。",
  ].join("\n");
  const { dependencies, operations } = recordingDependencies();

  const result = await renderShareCard(makeModel({
    modeLabel: "20問 簡易プレビュー",
    disclaimer,
  }), dependencies);

  assert.equal(result.status, "ok");
  const textPositions = new Map(
    operations
      .filter((operation) => operation[0] === "fillText" && operation[1] === "main")
      .map((operation) => [operation[2], operation[4]]),
  );
  assert.equal(
    textPositions.get("香りをイメージするための素材例です"),
    1649,
  );
  assert.equal(textPositions.get(disclaimer.split("\n")[0]), 1670);
  assert.equal(textPositions.get(disclaimer.split("\n")[1]), 1690);
  assert.equal(textPositions.get("20問 簡易プレビュー"), 1728);
  assert.equal(textPositions.get("mvp-1.0.0"), 1756);
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

test("T-007 F-016 uses cat shadow separation without adding a white backdrop", async () => {
  const { dependencies, operations } = recordingDependencies({ throwImageData: true });

  const result = await renderShareCard(makeModel(), dependencies);

  assert.equal(result.status, "ok");
  const catDraws = operations.filter((operation) =>
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
    operation[3] === 650 &&
    operation[4] === 244);
  assert.equal(legacyPlateIndex, -1);
  assert.equal(circularWashIndex, -1);
  assert.equal(catDraws.length, 2);
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
