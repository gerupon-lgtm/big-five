import { drawRadar } from "./radar-chart.js";

const FACTOR_LABELS = {
  O: "開放性",
  C: "勤勉性",
  E: "外向性",
  A: "協調性",
  N: "感情反応性",
};
const FACTOR_ORDER = ["O", "C", "E", "A", "N"];
const SHARE_DISCLAIMER = "体験用サンプル・尺度内スコア・正式な診断ではありません";

function scoreRows(scores) {
  return FACTOR_ORDER.map((factor) => `${FACTOR_LABELS[factor]} ${scores[factor]}`);
}

function drawWrappedText(context, value, x, y, maxWidth, lineHeight) {
  const characters = Array.from(value);
  let line = "";
  let lineCount = 0;

  for (const character of characters) {
    const nextLine = `${line}${character}`;
    if (line && context.measureText(nextLine).width > maxWidth) {
      context.fillText(line, x, y + lineCount * lineHeight);
      line = character;
      lineCount += 1;
    } else {
      line = nextLine;
    }
  }

  if (line) {
    context.fillText(line, x, y + lineCount * lineHeight);
    lineCount += 1;
  }
  return lineCount;
}

export function buildShareText(result) {
  return [
    `Big Five 体験用サンプル ${result.answerCount}問版`,
    result.title,
    scoreRows(result.scores).join(" / "),
    SHARE_DISCLAIMER,
  ].join("\n");
}

export function drawShareCard(canvas, result) {
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("共有画像を生成できませんでした");

  context.fillStyle = "#f4f6f5";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#172d3b";
  context.font = "700 44px system-ui";
  context.fillText(`BIG FIVE / ${result.answerCount}問版`, 80, 100);
  context.font = "800 72px system-ui";
  drawWrappedText(context, result.title, 80, 210, 920, 88);

  const radar = document.createElement("canvas");
  radar.width = 480;
  radar.height = 480;
  drawRadar(radar, result.scores);
  context.drawImage(radar, 300, 300);

  context.font = "500 34px system-ui";
  scoreRows(result.scores).forEach((row, index) => {
    context.fillText(row, 120, 860 + index * 62);
  });

  if (result.summary) {
    context.font = "500 30px system-ui";
    context.fillStyle = "#40515a";
    drawWrappedText(context, result.summary, 120, 1190, 840, 42);
  }
  context.font = "500 26px system-ui";
  context.fillStyle = "#5e6b67";
  context.fillText(SHARE_DISCLAIMER, 80, 1280);
}

export function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("画像を生成できませんでした"));
    }, "image/png");
  });
}

function getNavigator() {
  return typeof navigator === "undefined" ? null : navigator;
}

async function copyText(text) {
  const browser = getNavigator();
  if (!browser?.clipboard || typeof browser.clipboard.writeText !== "function") return false;
  try {
    await browser.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function downloadBlob(blob, filename) {
  if (
    typeof document === "undefined" ||
    typeof URL === "undefined" ||
    typeof URL.createObjectURL !== "function"
  ) return false;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  if (typeof URL.revokeObjectURL === "function") {
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
  return true;
}

export async function shareResult(result, canvas) {
  const text = buildShareText(result);
  let blob;

  try {
    blob = await canvasToBlob(canvas);
  } catch {
    return { kind: "text", text, copied: await copyText(text) };
  }

  const browser = getNavigator();
  const filename = `big-five-sample-${result.answerCount}.png`;
  if (typeof File === "function" && typeof browser?.canShare === "function" && typeof browser?.share === "function") {
    const file = new File([blob], filename, { type: "image/png" });
    try {
      if (browser.canShare({ files: [file] })) {
        await browser.share({ files: [file], text });
        return { kind: "shared", text };
      }
    } catch (error) {
      if (error?.name === "AbortError") return { kind: "cancelled", text };
    }
  }

  try {
    const downloaded = downloadBlob(blob, filename);
    const copied = await copyText(text);
    return downloaded
      ? { kind: "downloaded", text, copied }
      : { kind: "text", text, copied };
  } catch {
    return { kind: "text", text, copied: await copyText(text) };
  }
}

export { SHARE_DISCLAIMER };
