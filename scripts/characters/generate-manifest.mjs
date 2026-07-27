import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { appMeta } from "../../app/js/config/app-meta.js";
import { TitleProfileDefinitions } from "../../app/js/data/title-profile-definitions.js";
import { validateCharacterManifest } from "../../app/js/domain/character-manifest.js";

const LEDGER_PATH = new URL(
  "../../docs/assets/character-production/ledger.json",
  import.meta.url,
);
const MANIFEST_PATH = new URL(
  "../../app/js/data/character-manifest.js",
  import.meta.url,
);

function invalid() {
  throw new TypeError("CHARACTER_MANIFEST_INVALID");
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) {
      deepFreeze(nestedValue);
    }
  }
  return value;
}

function runtimeImagePath(deliveryWebpPath) {
  if (typeof deliveryWebpPath !== "string"
    || !deliveryWebpPath.startsWith("app/assets/characters/")) {
    invalid();
  }
  return deliveryWebpPath.slice("app/".length);
}

export function generateCharacterManifest({
  ledger,
  titleProfiles,
  characterManifestVersion,
} = {}) {
  if (!isRecord(ledger)
    || !Array.isArray(ledger.entries)
    || !Array.isArray(titleProfiles)
    || titleProfiles.length !== 51
    || typeof characterManifestVersion !== "string"
    || characterManifestVersion.trim() === "") {
    invalid();
  }

  const releasedRows = ledger.entries.filter(
    ({ productionStatus }) => productionStatus === "released",
  );
  if (releasedRows.length !== 51) invalid();

  const entries = titleProfiles.map((profile) => {
    if (!isRecord(profile)
      || typeof profile.titleId !== "string"
      || typeof profile.characterId !== "string") {
      invalid();
    }
    const matches = releasedRows.filter(
      (row) => row.titleId === profile.titleId
        && row.characterId === profile.characterId,
    );
    if (matches.length !== 1) invalid();
    const row = matches[0];
    return {
      characterId: row.characterId,
      assetVersion: row.assetVersion,
      imagePath: runtimeImagePath(row.deliveryWebpPath),
      width: row.width,
      height: row.height,
      alt: row.alt,
      integrity: row.deliverySha256,
    };
  });

  const manifest = {
    characterManifestVersion,
    entries,
  };
  validateCharacterManifest(
    manifest,
    titleProfiles,
    characterManifestVersion,
  );
  return deepFreeze(manifest);
}

function serializeManifest(manifest) {
  return [
    `const entries = Object.freeze(${JSON.stringify(manifest.entries, null, 2)}.map((entry) => Object.freeze(entry)));`,
    "",
    "export const CharacterManifest = Object.freeze({",
    `  characterManifestVersion: ${JSON.stringify(manifest.characterManifestVersion)},`,
    "  entries,",
    "});",
    "",
  ].join("\n");
}

async function main() {
  const ledger = JSON.parse(await readFile(LEDGER_PATH, "utf8"));
  const manifest = generateCharacterManifest({
    ledger,
    titleProfiles: TitleProfileDefinitions,
    characterManifestVersion: appMeta.characterManifestVersion,
  });
  await writeFile(MANIFEST_PATH, serializeManifest(manifest), "utf8");
  console.log(`character manifest entries ${manifest.entries.length}`);
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";

if (currentFile === invokedFile) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
