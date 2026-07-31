import {
  chooseCharacterTreatment,
  collectOpaqueEdgePixels,
} from "../domain/share-card-visibility.js";

const FACTOR_COLORS = Object.freeze([
  "#E98596",
  "#72AED0",
  "#F1B640",
  "#93B978",
  "#A68BC4",
]);

function errorResult(errorCode) {
  return Object.freeze({ status: "error", errorCode });
}

function setFont(context, size, weight = 400) {
  context.font = `${weight} ${size}px "Noto Sans JP", "Yu Gothic", sans-serif`;
}

function drawCenteredWrappedText(
  context,
  text,
  centerX,
  startY,
  maxWidth,
  lineHeight,
  maxLines,
) {
  const remaining = [...text];
  const lines = [];
  while (remaining.length > 0 && lines.length < maxLines) {
    let line = "";
    while (remaining.length > 0) {
      const candidate = `${line}${remaining[0]}`;
      if (line && context.measureText(candidate).width > maxWidth) break;
      line = candidate;
      remaining.shift();
    }
    lines.push(line);
  }
  if (remaining.length > 0) {
    const lastIndex = lines.length - 1;
    let lastLine = lines[lastIndex];
    while (
      lastLine.length > 0 &&
      context.measureText(`${lastLine}…`).width > maxWidth
    ) {
      lastLine = [...lastLine].slice(0, -1).join("");
    }
    lines[lastIndex] = `${lastLine}…`;
  }
  lines.forEach((line, index) => {
    context.fillText(line, centerX, startY + index * lineHeight);
  });
}

function drawBotanicalMotif(context, x, y, color, direction = 1) {
  context.save();
  context.strokeStyle = color;
  context.fillStyle = color;
  context.globalAlpha = 0.22;
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(x, y);
  context.bezierCurveTo(
    x + 30 * direction, y - 42,
    x + 45 * direction, y - 92,
    x + 70 * direction, y - 132,
  );
  context.stroke();
  for (let index = 0; index < 4; index += 1) {
    context.beginPath();
    context.arc(
      x + (18 + index * 15) * direction,
      y - 28 - index * 27,
      10 + index,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  context.restore();
}

function drawPaperTexture(context, color) {
  context.save();
  context.fillStyle = color;
  context.globalAlpha = 0.05;
  for (let y = 38; y < 1800; y += 92) {
    for (let x = 34 + (y % 184); x < 1080; x += 184) {
      context.beginPath();
      context.arc(x, y, 3, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();
}

function drawContainedImage(context, image, character, treatment) {
  const box = { x: 280, y: 420, width: 520, height: 520 };
  const ratio = Math.min(
    box.width / character.width,
    box.height / character.height,
  );
  const width = character.width * ratio;
  const height = character.height * ratio;
  const x = box.x + (box.width - width) / 2;
  const y = box.y + (box.height - height) / 2;

  if (treatment === "neutral-plate") {
    context.save();
    context.fillStyle = "#FFFDF7";
    context.globalAlpha = 0.94;
    context.fillRect(244, 396, 592, 568);
    context.restore();
  } else if (treatment === "shadow") {
    context.save();
    context.shadowColor = "rgba(35, 38, 42, 0.42)";
    context.shadowBlur = 18;
    context.shadowOffsetY = 8;
    context.drawImage(image, x, y, width, height);
    context.restore();
  } else if (treatment === "double-outline") {
    context.save();
    context.shadowColor = "rgba(255, 255, 255, 0.95)";
    context.shadowBlur = 18;
    context.drawImage(image, x, y, width, height);
    context.restore();
    context.save();
    context.shadowColor = "rgba(36, 40, 44, 0.75)";
    context.shadowBlur = 8;
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

function drawCard(context, model, assets, dependencies) {
  context.fillStyle = model.palette.background;
  context.fillRect(0, 0, model.width, model.height);
  drawPaperTexture(context, model.palette.text);
  drawBotanicalMotif(context, 110, 390, model.palette.chart, 1);
  drawBotanicalMotif(context, 970, 390, model.palette.accent, -1);

  if (assets.icon) context.drawImage(assets.icon, 76, 62, 92, 92);
  context.fillStyle = model.palette.text;
  context.textAlign = "left";
  setFont(context, 50, 700);
  context.fillText(model.brand.name, 190, 112);
  setFont(context, 28, 400);
  context.fillText(model.brand.cardSubtitle, 190, 153);

  context.textAlign = "center";
  setFont(context, 25, 500);
  context.fillText("あなたの称号", 540, 225);
  setFont(context, 52, 700);
  context.fillText(model.titleLabel, 540, 292);
  setFont(context, 20, 400);
  drawCenteredWrappedText(context, model.titleReason, 540, 338, 900, 26, 3);

  if (assets.character) {
    drawContainedImage(
      context,
      assets.character.image,
      model.character,
      assets.character.treatment,
    );
  }

  context.textAlign = "left";
  model.factors.forEach((factor, index) => {
    const y = 995 + index * 60;
    context.fillStyle = model.palette.text;
    setFont(context, 25, 600);
    context.fillText(factor.label, 112, y + 29);
    context.fillStyle = model.palette.surface;
    context.fillRect(340, y, 590, 32);
    context.fillStyle = FACTOR_COLORS[index];
    context.fillRect(340, y, 590 * factor.displayScore / 100, 32);
    context.strokeStyle = model.palette.chart;
    context.lineWidth = 2;
    context.strokeRect(340, y, 590, 32);
    context.fillStyle = model.palette.text;
    context.textAlign = "right";
    context.fillText(String(factor.displayScore), 978, y + 29);
    context.textAlign = "left";
  });

  context.textAlign = "center";
  setFont(context, 34, 700);
  context.fillStyle = model.palette.text;
  context.fillText("ココロアロマ", 540, 1318);
  model.fragrances.forEach((fragrance, index) => {
    const y = 1355 + index * 75;
    context.textAlign = "left";
    setFont(context, 19, 500);
    context.fillText(fragrance.sceneLabel, 120, y);
    setFont(context, 24, 700);
    context.fillText(fragrance.materialNames.join("・"), 330, y + 24);
    setFont(context, 18, 400);
    context.fillText(fragrance.accordLabel, 330, y + 48);
  });

  context.textAlign = "center";
  setFont(context, 25, 600);
  context.fillText(model.modeLabel, 540, 1600);
  setFont(context, 20, 400);
  model.disclaimer.split("\n").forEach((line, index) => {
    context.fillText(line, 540, 1650 + index * 30);
  });
  setFont(context, 17, 400);
  context.fillText([
    model.versions.appVersion,
    model.versions.cardTemplateVersion,
    model.versions.presentationDefinitionVersion,
    model.versions.resultTextVersion,
  ].join(" / "), 540, 1750);
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

export async function renderShareCard(model, dependencies) {
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

  let icon = null;
  try {
    icon = await dependencies.loadImage(model.brand.iconPath);
  } catch {
    icon = null;
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
    drawCard(context, model, { icon, character }, dependencies);
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
