import { mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { inspectCharacterAsset } from "./inspect-character.mjs";

const DEFAULT_SIZE = 1024;
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
const SETTING_FIELDS = Object.freeze(["quality", "alphaQuality", "effort"]);
const ENCODER_SETTING_FIELDS = Object.freeze([
  "encoder",
  "quality",
  "alphaQuality",
  "effort",
  "metadata",
  "size",
]);

function invalid(reason) {
  throw new TypeError(`CHARACTER_ASSET_INVALID: ${reason}`);
}

function validateSettings(settings) {
  if (!settings
    || typeof settings !== "object"
    || Array.isArray(settings)
    || Object.keys(settings).length !== SETTING_FIELDS.length
    || !SETTING_FIELDS.every((field) => Number.isInteger(settings[field]))) {
    invalid("settings must contain integer quality, alphaQuality, and effort");
  }
  return settings;
}

export function normalizeEncoderSettings(settings) {
  if (!settings
    || typeof settings !== "object"
    || Array.isArray(settings)
    || Object.keys(settings).length !== ENCODER_SETTING_FIELDS.length
    || ENCODER_SETTING_FIELDS.some(
      (field, index) => Object.keys(settings)[index] !== field,
    )
    || settings.encoder !== "sharp"
    || settings.metadata !== "none"
    || settings.size !== DEFAULT_SIZE) {
    invalid("encoder settings must use sharp, no metadata, and size 1024");
  }
  return {
    size: settings.size,
    settings: validateSettings({
      quality: settings.quality,
      alphaQuality: settings.alphaQuality,
      effort: settings.effort,
    }),
  };
}

export async function convertCharacter({
  inputPath,
  outputPath,
  size = DEFAULT_SIZE,
  settings,
}) {
  if (typeof inputPath !== "string" || inputPath.length === 0) {
    invalid("inputPath is required");
  }
  if (typeof outputPath !== "string" || outputPath.length === 0) {
    invalid("outputPath is required");
  }
  if (size !== DEFAULT_SIZE) invalid(`size must be exactly ${DEFAULT_SIZE}`);
  validateSettings(settings);

  let metadata;
  try {
    metadata = await sharp(inputPath).metadata();
  } catch (error) {
    invalid(error instanceof Error ? error.message : "unreadable source PNG");
  }
  if (metadata.format !== "png") {
    invalid(`expected PNG input, received ${metadata.format ?? "unknown"}`);
  }
  if (metadata.width !== metadata.height) {
    invalid(
      `expected square PNG, received ${metadata.width ?? "?"}x${metadata.height ?? "?"}`,
    );
  }
  if (metadata.hasAlpha !== true) invalid("source PNG alpha channel is required");

  await mkdir(dirname(outputPath), { recursive: true });
  await sharp(inputPath)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({
      quality: settings.quality,
      alphaQuality: settings.alphaQuality,
      effort: settings.effort,
    })
    .toFile(outputPath);

  return inspectCharacterAsset(outputPath);
}

function optionValue(arguments_, name) {
  const index = arguments_.indexOf(name);
  if (index < 0) return null;
  const value = arguments_[index + 1];
  if (!value || value.startsWith("--")) {
    invalid(`${name} requires a value`);
  }
  return value;
}

async function entriesForScope(scope) {
  const range = SCOPE_RANGES[scope];
  if (!range) invalid(`unknown scope ${scope}`);
  const ledger = JSON.parse(await readFile(LEDGER_PATH, "utf8"));
  return ledger.entries.slice(...range);
}

async function runCli(arguments_) {
  const scope = optionValue(arguments_, "--scope");
  const settingsPath = optionValue(arguments_, "--settings");
  const sizeText = optionValue(arguments_, "--size");
  if (!scope || !settingsPath) {
    invalid("--scope <scope> and --settings <json-path> are required");
  }
  const encoderSettings = normalizeEncoderSettings(
    JSON.parse(await readFile(resolve(settingsPath), "utf8")),
  );
  const size = sizeText === null ? encoderSettings.size : Number(sizeText);
  const settings = encoderSettings.settings;
  const entries = await entriesForScope(scope);

  for (const entry of entries) {
    if (typeof entry.sourcePngPath !== "string") {
      invalid(`${entry.characterId} has no sourcePngPath`);
    }
    const outputPath = entry.deliveryWebpPath
      ?? `app/assets/characters/${entry.characterId}.webp`;
    const report = await convertCharacter({
      inputPath: resolve(entry.sourcePngPath),
      outputPath: resolve(outputPath),
      size,
      settings,
    });
    console.log(JSON.stringify({ characterId: entry.characterId, outputPath, ...report }));
  }
  console.log(`converted ${entries.length} character assets`);
}

if (process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  runCli(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
