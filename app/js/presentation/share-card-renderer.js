import {
  chooseCharacterTreatment,
  collectOpaqueEdgePixels,
} from "../domain/share-card-visibility.js";

const FACTOR_COLORS = Object.freeze([
  "#EF6471",
  "#54A8D8",
  "#F2AA22",
  "#8AAF50",
  "#9475C4",
]);
const FACTOR_TEXT_COLORS = Object.freeze([
  "#9B2837",
  "#1C648F",
  "#8A5200",
  "#466522",
  "#5B4086",
]);
const AROMA_COLORS = Object.freeze(["#7FA650", "#EB9B2D", "#9980B9"]);
const AROMA_TEXT_COLORS = Object.freeze(["#48632A", "#8A4D00", "#5B4674"]);
const AROMA_ASSET_PATHS = Object.freeze({
  pause: "./assets/share-card/aroma-pause-v1.png",
  reset: "./assets/share-card/aroma-reset-v1.png",
  "quiet-focus": "./assets/share-card/aroma-quiet-focus-v1.png",
});
const AROMA_SUBTITLE = "～あなたらしさから着想した香り～";
const AROMA_NOTE = "香りをイメージするための素材例です";

function errorResult(errorCode) {
  return Object.freeze({ status: "error", errorCode });
}

function setSansFont(context, size, weight = 400) {
  context.font = `${weight} ${size}px "Noto Sans JP", "Yu Gothic", sans-serif`;
}

function setSerifFont(context, size, weight = 500) {
  context.font = `${weight} ${size}px "Noto Serif JP", "Yu Mincho", serif`;
}

function roundedRectPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  const handle = safeRadius * 0.5522847498;
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.bezierCurveTo(
    x + width - safeRadius + handle,
    y,
    x + width,
    y + safeRadius - handle,
    x + width,
    y + safeRadius,
  );
  context.lineTo(x + width, y + height - safeRadius);
  context.bezierCurveTo(
    x + width,
    y + height - safeRadius + handle,
    x + width - safeRadius + handle,
    y + height,
    x + width - safeRadius,
    y + height,
  );
  context.lineTo(x + safeRadius, y + height);
  context.bezierCurveTo(
    x + safeRadius - handle,
    y + height,
    x,
    y + height - safeRadius + handle,
    x,
    y + height - safeRadius,
  );
  context.lineTo(x, y + safeRadius);
  context.bezierCurveTo(
    x,
    y + safeRadius - handle,
    x + safeRadius - handle,
    y,
    x + safeRadius,
    y,
  );
  context.closePath();
}

function fillRoundedRect(context, x, y, width, height, radius) {
  roundedRectPath(context, x, y, width, height, radius);
  context.fill();
}

function strokeRoundedRect(context, x, y, width, height, radius) {
  roundedRectPath(context, x, y, width, height, radius);
  context.stroke();
}

function drawPaperTexture(context, color) {
  context.save();
  context.fillStyle = color;
  context.globalAlpha = 0.035;
  for (let y = 42; y < 1800; y += 104) {
    for (let x = 38 + (y % 208); x < 1080; x += 208) {
      context.beginPath();
      context.arc(x, y, 2.2, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();
}

function drawLeaf(context, x, y, length, angle, color, alpha = 0.58) {
  const directionX = Math.cos(angle);
  const directionY = Math.sin(angle);
  const normalX = -directionY;
  const normalY = directionX;
  const tipX = x + directionX * length;
  const tipY = y + directionY * length;
  const halfWidth = length * 0.28;

  context.save();
  context.fillStyle = color;
  context.globalAlpha = alpha;
  context.beginPath();
  context.moveTo(x, y);
  context.bezierCurveTo(
    x + directionX * length * 0.28 + normalX * halfWidth,
    y + directionY * length * 0.28 + normalY * halfWidth,
    tipX - directionX * length * 0.28 + normalX * halfWidth * 0.35,
    tipY - directionY * length * 0.28 + normalY * halfWidth * 0.35,
    tipX,
    tipY,
  );
  context.bezierCurveTo(
    tipX - directionX * length * 0.28 - normalX * halfWidth * 0.35,
    tipY - directionY * length * 0.28 - normalY * halfWidth * 0.35,
    x + directionX * length * 0.28 - normalX * halfWidth,
    y + directionY * length * 0.28 - normalY * halfWidth,
    x,
    y,
  );
  context.fill();
  context.restore();
}

function drawSprig(
  context,
  x,
  y,
  length,
  angle,
  color,
  direction = 1,
  alpha = 0.56,
) {
  const directionX = Math.cos(angle);
  const directionY = Math.sin(angle);
  const endX = x + directionX * length;
  const endY = y + directionY * length;

  context.save();
  context.strokeStyle = color;
  context.globalAlpha = alpha;
  context.lineWidth = 2.5;
  context.beginPath();
  context.moveTo(x, y);
  context.bezierCurveTo(
    x + directionX * length * 0.34,
    y + directionY * length * 0.34 - 8 * direction,
    x + directionX * length * 0.7,
    y + directionY * length * 0.7 + 6 * direction,
    endX,
    endY,
  );
  context.stroke();
  context.restore();

  [0.24, 0.43, 0.62, 0.79].forEach((progress, index) => {
    const leafX = x + directionX * length * progress;
    const leafY = y + directionY * length * progress;
    const side = index % 2 === 0 ? direction : -direction;
    drawLeaf(
      context,
      leafX,
      leafY,
      24 - index * 1.5,
      angle + side * 0.95,
      color,
      alpha,
    );
  });
}

function drawDot(context, x, y, radius, color, alpha = 0.8) {
  context.save();
  context.fillStyle = color;
  context.globalAlpha = alpha;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawHeaderDecoration(context, model) {
  context.save();
  context.strokeStyle = model.palette.chart;
  context.globalAlpha = 0.52;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(300, 154);
  context.lineTo(488, 154);
  context.moveTo(592, 154);
  context.lineTo(780, 154);
  context.stroke();
  context.restore();
  drawSprig(context, 285, 153, 84, Math.PI + 0.12, model.palette.chart, 1, 0.55);
  drawSprig(context, 795, 153, 84, -0.12, model.palette.chart, -1, 0.55);
  drawDot(context, 275, 144, 4, "#EB8A3A");
  drawDot(context, 805, 144, 4, "#EB8A3A");
  drawDot(context, 540, 154, 5, model.palette.accent, 0.72);
}

function drawWreath(context, model, templateVersion) {
  const legacy = templateVersion === "card-template-v1";
  context.save();
  context.strokeStyle = model.palette.chart;
  context.globalAlpha = legacy ? 0.16 : 0.56;
  context.lineWidth = legacy ? 4 : 5.5;
  context.beginPath();
  context.arc(540, 650, 270, 0, Math.PI * 2);
  context.stroke();
  context.restore();

  const sprigAlpha = legacy ? 0.48 : 0.66;
  drawSprig(context, 322, 777, 128, -2.18, model.palette.chart, 1, sprigAlpha);
  drawSprig(context, 300, 610, 92, -1.72, model.palette.chart, -1, legacy ? 0.45 : 0.62);
  drawSprig(context, 758, 790, 132, -0.95, model.palette.accent, -1, legacy ? 0.47 : 0.65);
  drawSprig(context, 785, 610, 94, -1.42, model.palette.accent, 1, legacy ? 0.44 : 0.61);
  drawDot(context, 308, 718, 4, "#EB8A3A", 0.75);
  drawDot(context, 772, 713, 4, "#EB8A3A", 0.75);
}

function drawCharacterBackdrop(context, model, treatment, templateVersion) {
  context.save();
  context.fillStyle = model.palette.surface;
  context.globalAlpha = templateVersion === "card-template-v1"
    ? treatment === "neutral-plate" ? 0.82 : 0.38
    : treatment === "neutral-plate" ? 0.14 : 0.04;
  context.beginPath();
  context.arc(540, 650, 244, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawContainedImage(context, image, character, treatment) {
  const box = { x: 225, y: 330, width: 630, height: 630 };
  const ratio = Math.min(
    box.width / character.width,
    box.height / character.height,
  );
  const width = character.width * ratio;
  const height = character.height * ratio;
  const x = box.x + (box.width - width) / 2;
  const y = box.y + (box.height - height) / 2;

  if (treatment === "shadow" || treatment === "neutral-plate") {
    context.save();
    context.shadowColor = "rgba(54, 45, 36, 0.28)";
    context.shadowBlur = treatment === "neutral-plate" ? 14 : 18;
    context.shadowOffsetY = 7;
    context.drawImage(image, x, y, width, height);
    context.restore();
  } else if (treatment === "double-outline") {
    context.save();
    context.shadowColor = "rgba(255, 255, 255, 0.96)";
    context.shadowBlur = 16;
    context.drawImage(image, x, y, width, height);
    context.restore();
    context.save();
    context.shadowColor = "rgba(54, 45, 36, 0.52)";
    context.shadowBlur = 7;
    context.drawImage(image, x, y, width, height);
    context.restore();
  }
  context.drawImage(image, x, y, width, height);
}

function analyzeCharacter(image, character, dependencies) {
  try {
    const canvas = dependencies.createCanvas(64, 64);
    const context = canvas?.getContext?.("2d", { willReadFrequently: true });
    if (!context) return "neutral-plate";
    context.clearRect(0, 0, 64, 64);
    const ratio = Math.min(64 / character.width, 64 / character.height);
    const width = character.width * ratio;
    const height = character.height * ratio;
    context.drawImage(
      image,
      (64 - width) / 2,
      (64 - height) / 2,
      width,
      height,
    );
    const imageData = context.getImageData(0, 0, 64, 64);
    return chooseCharacterTreatment({
      edgePixels: collectOpaqueEdgePixels(imageData),
      backgroundHex: dependencies.backgroundHex,
    });
  } catch {
    return "neutral-plate";
  }
}

function drawImageContain(context, image, x, y, width, height) {
  const sourceWidth = image.naturalWidth || image.width || width;
  const sourceHeight = image.naturalHeight || image.height || height;
  const ratio = Math.min(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * ratio;
  const drawHeight = sourceHeight * ratio;
  context.drawImage(
    image,
    x + (width - drawWidth) / 2,
    y + (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
}

function drawFitText(
  context,
  text,
  x,
  y,
  maxWidth,
  initialSize,
  minimumSize,
  weight = 400,
  family = "sans",
) {
  let size = initialSize;
  const applyFont = family === "serif" ? setSerifFont : setSansFont;
  applyFont(context, size, weight);
  while (size > minimumSize && context.measureText(text).width > maxWidth) {
    size -= 1;
    applyFont(context, size, weight);
  }
  context.fillText(text, x, y);
  return context.measureText(text).width;
}

function drawTrackedText(context, text, x, y, targetWidth) {
  const characters = [...text];
  const widths = characters.map(
    (character) => context.measureText(character).width,
  );
  const naturalWidth = widths.reduce((sum, width) => sum + width, 0);
  const tracking = characters.length > 1
    ? Math.max(0, targetWidth - naturalWidth) / (characters.length - 1)
    : 0;
  let cursor = x;
  characters.forEach((character, index) => {
    context.fillText(character, cursor, y);
    cursor += widths[index] + tracking;
  });
}

function drawFrame(context, model) {
  context.save();
  context.strokeStyle = model.palette.text;
  context.globalAlpha = 0.22;
  context.lineWidth = 3;
  strokeRoundedRect(context, 18, 18, 1044, 1764, 46);
  context.globalAlpha = 0.12;
  context.lineWidth = 2;
  strokeRoundedRect(context, 28, 28, 1024, 1744, 38);
  context.restore();
}

function drawBrand(context, model, icon, templateVersion) {
  context.fillStyle = model.palette.text;
  context.textAlign = "left";
  if (templateVersion === "card-template-v1") {
    if (icon) drawImageContain(context, icon, 292, 50, 94, 94);
    setSansFont(context, 48, 600);
    context.fillText(model.brand.name, 408, 100);
    setSansFont(context, 23, 400);
    context.fillText(model.brand.cardSubtitle, 408, 137);
    drawHeaderDecoration(context, model);
    return;
  }
  setSansFont(context, 23, 400);
  const subtitleWidth = context.measureText(model.brand.cardSubtitle).width;
  setSansFont(context, 48, 600);
  const naturalTitleWidth = [...model.brand.name].reduce(
    (width, character) => width + context.measureText(character).width,
    0,
  );
  const titleWidth = Math.max(
    naturalTitleWidth,
    Math.min(360, subtitleWidth),
  );
  const groupWidth = 94 + 22 + titleWidth;
  const groupX = (1080 - groupWidth) / 2;
  const textX = groupX + 116;
  if (icon) drawImageContain(context, icon, groupX, 50, 94, 94);
  drawTrackedText(context, model.brand.name, textX, 100, titleWidth);
  setSansFont(context, 23, 400);
  context.fillText(model.brand.cardSubtitle, textX, 137);
  drawHeaderDecoration(context, model);
}

function drawTitle(context, model) {
  context.textAlign = "center";
  context.fillStyle = model.palette.surface;
  context.globalAlpha = 0.9;
  fillRoundedRect(context, 368, 178, 344, 52, 26);
  context.globalAlpha = 1;
  context.fillStyle = model.palette.text;
  setSerifFont(context, 27, 500);
  context.fillText("あなたの称号", 540, 214);
  drawFitText(
    context,
    model.titleLabel,
    540,
    292,
    890,
    52,
    38,
    600,
    "serif",
  );
}

function drawFactors(context, model) {
  model.factors.forEach((factor, index) => {
    const y = 965 + index * 45;
    context.textAlign = "left";
    context.fillStyle = model.palette.text;
    setSansFont(context, 25, 600);
    context.fillText(factor.label, 138, y + 25);

    context.fillStyle = model.palette.surface;
    context.globalAlpha = 0.78;
    fillRoundedRect(context, 350, y + 3, 520, 23, 12);
    context.globalAlpha = 1;
    if (factor.displayScore > 0) {
      context.fillStyle = FACTOR_COLORS[index];
      fillRoundedRect(
        context,
        350,
        y + 3,
        520 * factor.displayScore / 100,
        23,
        12,
      );
    }

    context.textAlign = "right";
    context.fillStyle = FACTOR_TEXT_COLORS[index];
    setSerifFont(context, 29, 600);
    context.fillText(String(factor.displayScore), 936, y + 26);
  });
}

function drawAromaHeading(context, model, templateVersion) {
  context.textAlign = "center";
  context.fillStyle = model.palette.text;
  setSansFont(context, 38, 700);
  context.fillText("ココロアロマ", 540, 1217);
  if (templateVersion === "card-template-v1") {
    drawSprig(context, 330, 1207, 70, Math.PI + 0.08, "#739A58", 1, 0.56);
    drawSprig(context, 750, 1207, 70, -0.08, "#739A58", -1, 0.56);
    drawDot(context, 317, 1200, 4, "#EB8A3A");
    drawDot(context, 763, 1200, 4, "#EB8A3A");
  } else {
    drawSprig(context, 386, 1207, 58, Math.PI + 0.08, "#739A58", 1, 0.56);
    drawSprig(context, 694, 1207, 58, -0.08, "#739A58", -1, 0.56);
    drawDot(context, 375, 1200, 4, "#EB8A3A");
    drawDot(context, 705, 1200, 4, "#EB8A3A");
  }
  setSansFont(context, 20, 400);
  context.fillText(AROMA_SUBTITLE, 540, 1255);
}

function drawAromaRow(
  context,
  fragrance,
  index,
  image,
  model,
  templateVersion,
) {
  const y = 1270 + index * 122;
  const legacy = templateVersion === "card-template-v1";
  const cardX = legacy ? 90 : 120;
  const cardWidth = legacy ? 900 : 840;
  const imageX = legacy ? 105 : 134;
  const imageWidth = legacy ? 148 : 136;
  const textX = legacy ? 270 : 286;
  const textWidth = legacy ? 410 : 390;
  const rightX = legacy ? 958 : 936;
  const rightWidth = legacy ? 275 : 250;
  context.save();
  context.fillStyle = model.palette.surface;
  context.globalAlpha = 0.74;
  fillRoundedRect(context, cardX, y, cardWidth, 108, 24);
  context.restore();
  context.save();
  context.strokeStyle = AROMA_COLORS[index];
  context.globalAlpha = 0.8;
  context.lineWidth = 2;
  strokeRoundedRect(context, cardX, y, cardWidth, 108, 24);
  context.restore();

  if (image) drawImageContain(context, image, imageX, y + 8, imageWidth, 92);

  context.textAlign = "left";
  context.fillStyle = model.palette.text;
  setSansFont(context, 18, 500);
  context.fillText(fragrance.sceneLabel, textX, y + 32);
  const materialWidth = drawFitText(
    context,
    fragrance.materialNames.join("・"),
    textX,
    y + 70,
    textWidth,
    27,
    20,
    700,
  );

  context.textAlign = "right";
  context.fillStyle = AROMA_TEXT_COLORS[index];
  const accordWidth = drawFitText(
    context,
    fragrance.accordLabel,
    rightX,
    y + 71,
    rightWidth,
    legacy ? 18 : 21,
    legacy ? 14 : 16,
    600,
  );

  if (!legacy) {
    const connectorStart = textX + Math.min(materialWidth, textWidth) + 18;
    const connectorEnd = rightX - Math.min(accordWidth, rightWidth) - 18;
    for (let x = connectorStart; x <= connectorEnd; x += 18) {
      drawDot(context, x, y + 65, 2.2, AROMA_COLORS[index], 0.42);
    }
  }

  context.save();
  context.strokeStyle = AROMA_COLORS[index];
  context.globalAlpha = 0.28;
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(textX, y + 89);
  context.lineTo(rightX, y + 89);
  context.stroke();
  context.restore();
}

function drawFooter(context, model, templateVersion) {
  const legacy = templateVersion === "card-template-v1";
  context.textAlign = "center";
  context.fillStyle = model.palette.text;
  setSansFont(context, legacy ? 17 : 16, 400);
  context.fillText(AROMA_NOTE, 540, legacy ? 1645 : 1649);

  const disclaimerLines = model.disclaimer.split("\n");
  setSansFont(context, legacy ? 17 : 15, 400);
  const disclaimerStartY = legacy
    ? disclaimerLines.length > 1 ? 1668 : 1677
    : disclaimerLines.length > 1 ? 1670 : 1678;
  disclaimerLines.forEach((line, index) => {
    context.fillText(line, 540, disclaimerStartY + index * (legacy ? 24 : 20));
  });

  const modeBoxY = legacy
    ? 1710
    : disclaimerLines.length > 1 ? 1703 : 1708;
  context.fillStyle = model.palette.surface;
  context.globalAlpha = 0.9;
  fillRoundedRect(
    context,
    382,
    modeBoxY,
    316,
    legacy ? 44 : 34,
    legacy ? 22 : 17,
  );
  context.globalAlpha = 1;
  context.fillStyle = model.palette.text;
  setSerifFont(context, legacy ? 26 : 24, 500);
  context.fillText(model.modeLabel, 540, legacy ? 1741 : modeBoxY + 25);
  setSansFont(context, legacy ? 16 : 13, 400);
  context.globalAlpha = 0.72;
  context.fillText(model.versions.appVersion, 540, legacy ? 1765 : 1756);
  context.globalAlpha = 1;
}

function drawCard(context, model, assets) {
  const templateVersion = model.versions.cardTemplateVersion;
  context.fillStyle = model.palette.background;
  context.fillRect(0, 0, model.width, model.height);
  drawPaperTexture(context, model.palette.text);
  drawFrame(context, model);
  drawBrand(context, model, assets.icon, templateVersion);
  drawTitle(context, model);
  drawCharacterBackdrop(
    context,
    model,
    assets.character?.treatment ?? "neutral-plate",
    templateVersion,
  );
  drawWreath(context, model, templateVersion);
  if (assets.character) {
    drawContainedImage(
      context,
      assets.character.image,
      model.character,
      assets.character.treatment,
    );
  }
  drawFactors(context, model);
  drawAromaHeading(context, model, templateVersion);
  model.fragrances.forEach((fragrance, index) => {
    drawAromaRow(
      context,
      fragrance,
      index,
      assets.aromas.get(fragrance.sceneId) ?? null,
      model,
      templateVersion,
    );
  });
  drawFooter(context, model, templateVersion);
}

function canvasToBlob(canvas, mimeType) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("SHARE_PNG_UNAVAILABLE"));
      }, mimeType);
    } catch {
      reject(new Error("SHARE_PNG_UNAVAILABLE"));
    }
  });
}

async function loadOptionalImage(path, dependencies) {
  try {
    return await dependencies.loadImage(path);
  } catch {
    return null;
  }
}

export async function renderShareCard(model, dependencies) {
  if (
    !["card-template-v1", "card-template-v2"].includes(
      model?.versions?.cardTemplateVersion,
    )
  ) {
    return errorResult("SHARE_CARD_TEMPLATE_UNSUPPORTED");
  }
  let canvas;
  let context;
  try {
    canvas = dependencies?.createCanvas?.(model?.width, model?.height);
    context = canvas?.getContext?.("2d");
    if (!canvas || !context || typeof canvas.toBlob !== "function") {
      throw new Error("canvas");
    }
  } catch {
    return errorResult("SHARE_CANVAS_UNAVAILABLE");
  }

  try {
    await dependencies.fontsReady;
  } catch {
    return errorResult("SHARE_FONT_UNAVAILABLE");
  }

  const icon = await loadOptionalImage(model.brand.cardIconPath, dependencies);
  const aromas = new Map();
  for (const [sceneId, path] of Object.entries(AROMA_ASSET_PATHS)) {
    aromas.set(sceneId, await loadOptionalImage(path, dependencies));
  }

  let character = null;
  if (model.character) {
    try {
      const image = await dependencies.loadImage(model.character.path);
      character = {
        image,
        treatment: analyzeCharacter(image, model.character, {
          ...dependencies,
          backgroundHex: model.palette.background,
        }),
      };
    } catch {
      character = null;
    }
  }

  try {
    drawCard(context, model, { icon, aromas, character });
  } catch {
    return errorResult("SHARE_CANVAS_UNAVAILABLE");
  }

  try {
    const blob = await canvasToBlob(canvas, model.mimeType);
    return Object.freeze({ status: "ok", blob });
  } catch {
    return errorResult("SHARE_PNG_UNAVAILABLE");
  }
}
