const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/;
const PIXEL_FIELDS = Object.freeze(["r", "g", "b"]);
const INPUT_FIELDS = Object.freeze(["edgePixels", "backgroundHex"]);

function invalidVisibility() {
  throw new TypeError("SHARE_CARD_VISIBILITY_INVALID");
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactFields(value, fields) {
  return isRecord(value) &&
    Object.keys(value).length === fields.length &&
    fields.every((field) => Object.hasOwn(value, field));
}

function isDenseArray(value) {
  return Array.isArray(value) && Object.keys(value).length === value.length;
}

function isChannel(value) {
  return Number.isInteger(value) && value >= 0 && value <= 255;
}

function relativeLuminance({ r, g, b }) {
  const [red, green, blue] = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function contrastRatio(left, right) {
  const leftLuminance = relativeLuminance(left);
  const rightLuminance = relativeLuminance(right);
  return (Math.max(leftLuminance, rightLuminance) + 0.05) /
    (Math.min(leftLuminance, rightLuminance) + 0.05);
}

function hexPixel(value) {
  if (typeof value !== "string" || !HEX_COLOR_PATTERN.test(value)) {
    invalidVisibility();
  }
  return {
    r: Number.parseInt(value.slice(1, 3), 16),
    g: Number.parseInt(value.slice(3, 5), 16),
    b: Number.parseInt(value.slice(5, 7), 16),
  };
}

export function collectOpaqueEdgePixels(imageData, alphaThreshold = 192) {
  if (!isRecord(imageData) ||
    !Number.isInteger(imageData.width) ||
    imageData.width <= 0 ||
    !Number.isInteger(imageData.height) ||
    imageData.height <= 0 ||
    !(imageData.data instanceof Uint8ClampedArray) ||
    imageData.data.length !== imageData.width * imageData.height * 4 ||
    !Number.isInteger(alphaThreshold) ||
    alphaThreshold < 1 ||
    alphaThreshold > 255) {
    invalidVisibility();
  }

  const { data, width, height } = imageData;
  const alphaAt = (x, y) => data[(y * width + x) * 4 + 3];
  const pixels = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      if (data[offset + 3] < alphaThreshold) continue;
      const onImageBoundary = x === 0 || y === 0 ||
        x === width - 1 || y === height - 1;
      const besideTransparency = !onImageBoundary && [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ].some(([neighborX, neighborY]) =>
        alphaAt(neighborX, neighborY) < alphaThreshold);
      if (!onImageBoundary && !besideTransparency) continue;
      pixels.push(Object.freeze({
        r: data[offset],
        g: data[offset + 1],
        b: data[offset + 2],
      }));
    }
  }
  return Object.freeze(pixels);
}

export function chooseCharacterTreatment(input) {
  if (!hasExactFields(input, INPUT_FIELDS) ||
    !isDenseArray(input.edgePixels) ||
    !input.edgePixels.every((pixel) =>
      hasExactFields(pixel, PIXEL_FIELDS) &&
      PIXEL_FIELDS.every((field) => isChannel(pixel[field])))) {
    invalidVisibility();
  }
  const background = hexPixel(input.backgroundHex);
  if (input.edgePixels.length === 0) return "neutral-plate";

  const edgeContrast = Math.min(...input.edgePixels.map((pixel) =>
    contrastRatio(pixel, background)));
  if (edgeContrast >= 3) return "none";
  if (edgeContrast >= 2) return "shadow";
  if (edgeContrast >= 1.4) return "double-outline";
  return "neutral-plate";
}
