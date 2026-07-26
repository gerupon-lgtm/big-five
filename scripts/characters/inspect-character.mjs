import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const BYTE_TARGET = 250_000;
const LEDGER_PATH = new URL(
  "../../docs/assets/character-production/ledger.json",
  import.meta.url,
);
const SCOPE_RANGES = Object.freeze({
  pilot: [0, 3],
  "pilot-converted": [0, 3],
  baseline11: [3, 11],
  pair01: [11, 21],
  pair02: [21, 31],
  pair03: [31, 41],
  pair04: [41, 51],
  "release-assets": [0, 51],
  release: [0, 51],
});

function invalid(reason) {
  throw new TypeError(`CHARACTER_ASSET_INVALID: ${reason}`);
}

export async function inspectCharacterAsset(filePath) {
  let metadata;
  let bytes;
  let raw;
  try {
    bytes = await readFile(filePath);
    [metadata, raw] = await Promise.all([
      sharp(bytes).metadata(),
      sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    ]);
  } catch (error) {
    invalid(error instanceof Error ? error.message : "unreadable asset");
  }

  const {
    width,
    height,
    format,
    hasAlpha,
  } = metadata;
  if (format !== "webp") invalid(`expected WebP, received ${format ?? "unknown"}`);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width !== height) {
    invalid(`expected square canvas, received ${width ?? "?"}x${height ?? "?"}`);
  }
  if (hasAlpha !== true) invalid("alpha channel is required");

  const channels = raw.info.channels;
  const alphaChannel = channels - 1;
  let hasTransparentPixel = false;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = raw.data[(y * width + x) * channels + alphaChannel];
      if (alpha < 255) hasTransparentPixel = true;
      if (alpha > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (!hasTransparentPixel) invalid("at least one transparent pixel is required");
  if (maxX < 0) invalid("non-zero alpha content is required");

  const boundsTouchEdge = minX === 0
    || minY === 0
    || maxX === width - 1
    || maxY === height - 1;
  if (boundsTouchEdge) invalid("non-zero alpha bounds touch the canvas edge");

  return {
    width,
    height,
    format,
    hasAlpha,
    hasTransparentPixel,
    boundsTouchEdge,
    byteLength: bytes.byteLength,
    integrity: `sha256-${createHash("sha256").update(bytes).digest("base64")}`,
    sizeWarning: bytes.byteLength > BYTE_TARGET,
  };
}

function optionValue(arguments_, name) {
  const index = arguments_.indexOf(name);
  if (index < 0) return null;
  const value = arguments_[index + 1];
  if (!value || value.startsWith("--")) {
    throw new TypeError(`CHARACTER_ASSET_INVALID: ${name} requires a value`);
  }
  return value;
}

async function pathsForScope(scope) {
  const range = SCOPE_RANGES[scope];
  if (!range) invalid(`unknown scope ${scope}`);
  const ledger = JSON.parse(await readFile(LEDGER_PATH, "utf8"));
  return ledger.entries.slice(...range).map((entry) => (
    entry.deliveryWebpPath
      ?? `app/assets/characters/${entry.characterId}.webp`
  ));
}

async function runCli(arguments_) {
  const scope = optionValue(arguments_, "--scope");
  const paths = scope
    ? await pathsForScope(scope)
    : arguments_.filter((value) => !value.startsWith("--"));
  if (paths.length === 0) {
    throw new TypeError(
      "CHARACTER_ASSET_INVALID: pass a WebP path or --scope <scope>",
    );
  }

  for (const filePath of paths) {
    const report = await inspectCharacterAsset(resolve(filePath));
    console.log(JSON.stringify({ filePath, ...report }));
  }
  console.log(`inspected ${paths.length} character assets`);
}

if (process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  runCli(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
