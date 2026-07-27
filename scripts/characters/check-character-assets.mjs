import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { appMeta } from "../../app/js/config/app-meta.js";
import { CharacterManifest } from "../../app/js/data/character-manifest.js";
import { TitleProfileDefinitions } from "../../app/js/data/title-profile-definitions.js";
import { validateCharacterManifestDefinition } from "../../app/js/domain/definition-validator.js";
import {
  validateCharacterLedger,
  validateLedgerScope,
} from "./character-contract.mjs";
import { generateCharacterManifest } from "./generate-manifest.mjs";

const LEDGER_PATH = new URL(
  "../../docs/assets/character-production/ledger.json",
  import.meta.url,
);
const ASSET_DIRECTORY = new URL(
  "../../app/assets/characters/",
  import.meta.url,
);

function failCheck(message) {
  throw new Error(`CHARACTER_CHECK_FAILED: ${message}`);
}

function canonicalJson(value) {
  return JSON.stringify(value);
}

export function findOrphanRuntimeEntries(entryNames, manifestImagePaths) {
  const expectedPaths = new Set(manifestImagePaths);
  return entryNames.filter(
    (name) => !expectedPaths.has(`assets/characters/${name}`),
  );
}

async function inspectIntegrity(entries) {
  let mismatches = 0;
  for (const entry of entries) {
    try {
      const bytes = await readFile(new URL(`../../app/${entry.imagePath}`, import.meta.url));
      const integrity = `sha256-${createHash("sha256").update(bytes).digest("base64")}`;
      if (integrity !== entry.integrity) mismatches += 1;
    } catch {
      mismatches += 1;
    }
  }
  return mismatches;
}

async function main() {
  const ledger = JSON.parse(await readFile(LEDGER_PATH, "utf8"));
  validateLedgerScope(
    validateCharacterLedger(ledger, TitleProfileDefinitions),
    "release",
  );
  validateCharacterManifestDefinition(
    CharacterManifest,
    appMeta.characterManifestVersion,
  );

  const generated = generateCharacterManifest({
    ledger,
    titleProfiles: TitleProfileDefinitions,
    characterManifestVersion: appMeta.characterManifestVersion,
  });
  if (canonicalJson(generated) !== canonicalJson(CharacterManifest)) {
    failCheck("manifest differs from released ledger");
  }

  const expectedPaths = CharacterManifest.entries.map(
    ({ imagePath }) => imagePath,
  );
  const assetNames = await readdir(ASSET_DIRECTORY);
  const orphanAssets = findOrphanRuntimeEntries(
    assetNames,
    expectedPaths,
  );
  const integrityMismatches = await inspectIntegrity(CharacterManifest.entries);

  console.log(`character manifest entries ${CharacterManifest.entries.length}`);
  console.log(`orphan assets ${orphanAssets.length}`);
  console.log(`integrity mismatches ${integrityMismatches}`);

  if (orphanAssets.length !== 0 || integrityMismatches !== 0) {
    failCheck("asset coverage or integrity failed");
  }
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
