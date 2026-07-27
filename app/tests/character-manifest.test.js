import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { findOrphanRuntimeEntries } from "../../scripts/characters/check-character-assets.mjs";
import { generateCharacterManifest } from "../../scripts/characters/generate-manifest.mjs";
import { appMeta } from "../js/config/app-meta.js";
import { CharacterManifest } from "../js/data/character-manifest.js";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { validateCharacterManifestDefinition } from "../js/domain/definition-validator.js";
import {
  resolveCharacterEntry,
  validateCharacterManifest,
} from "../js/domain/character-manifest.js";

const ledger = JSON.parse(await readFile(
  new URL("../../docs/assets/character-production/ledger.json", import.meta.url),
  "utf8",
));

test("T-005 F-016 release manifest exactly covers 51 profiles", () => {
  assert.equal(
    validateCharacterManifest(CharacterManifest, TitleProfileDefinitions),
    CharacterManifest,
  );
  assert.equal(
    CharacterManifest.characterManifestVersion,
    appMeta.characterManifestVersion,
  );
  assert.equal(CharacterManifest.entries.length, 51);
  assert.deepEqual(Object.keys(CharacterManifest.entries[0]), [
    "characterId",
    "assetVersion",
    "imagePath",
    "width",
    "height",
    "alt",
    "integrity",
  ]);
  assert.deepEqual(
    CharacterManifest.entries.map(({ characterId }) => characterId),
    TitleProfileDefinitions.map(({ characterId }) => characterId),
  );
});

test("T-005 F-016 generation uses only 51 released rows in title order and freezes output", () => {
  const reorderedLedger = structuredClone(ledger);
  [reorderedLedger.entries[0], reorderedLedger.entries[50]] = [
    reorderedLedger.entries[50],
    reorderedLedger.entries[0],
  ];

  const generated = generateCharacterManifest({
    ledger: reorderedLedger,
    titleProfiles: TitleProfileDefinitions,
    characterManifestVersion: appMeta.characterManifestVersion,
  });

  assert.deepEqual(
    generated.entries.map(({ characterId }) => characterId),
    TitleProfileDefinitions.map(({ characterId }) => characterId),
  );
  assert.equal(generated.entries[0].alt, ledger.entries[0].alt);
  assert.equal(
    generated.entries[0].imagePath,
    "assets/characters/character-balanced.webp",
  );
  assert.equal(
    generated.entries[0].integrity,
    ledger.entries[0].deliverySha256,
  );
  assert.equal(Object.isFrozen(generated), true);
  assert.equal(Object.isFrozen(generated.entries), true);
  assert.equal(Object.isFrozen(generated.entries[0]), true);

  const incomplete = structuredClone(ledger);
  incomplete.entries[0].productionStatus = "technical-approved";
  assert.throws(
    () => generateCharacterManifest({
      ledger: incomplete,
      titleProfiles: TitleProfileDefinitions,
      characterManifestVersion: appMeta.characterManifestVersion,
    }),
    /CHARACTER_MANIFEST_INVALID/,
  );
});

test("T-005 F-016 resolves one character and rejects missing IDs", () => {
  const entry = resolveCharacterEntry(
    CharacterManifest,
    "character-balanced",
  );
  assert.equal(
    entry.imagePath,
    "assets/characters/character-balanced.webp",
  );
  assert.throws(
    () => resolveCharacterEntry(CharacterManifest, "character-missing"),
    /CHARACTER_NOT_FOUND/,
  );
});

test("T-005 F-016 rejects unknown fields, wrong versions, and duplicate IDs or paths", () => {
  const unknown = structuredClone(CharacterManifest);
  unknown.entries[0].unexpected = true;
  assert.throws(
    () => validateCharacterManifest(
      unknown,
      TitleProfileDefinitions,
      appMeta.characterManifestVersion,
    ),
    /CHARACTER_MANIFEST_INVALID/,
  );

  assert.throws(
    () => validateCharacterManifest(
      CharacterManifest,
      TitleProfileDefinitions,
      "character-manifest-v2",
    ),
    /CHARACTER_MANIFEST_INVALID/,
  );

  const duplicateId = structuredClone(CharacterManifest);
  duplicateId.entries[1].characterId = duplicateId.entries[0].characterId;
  assert.throws(
    () => validateCharacterManifest(
      duplicateId,
      TitleProfileDefinitions,
      appMeta.characterManifestVersion,
    ),
    /CHARACTER_MANIFEST_INVALID/,
  );

  const duplicate = structuredClone(CharacterManifest);
  duplicate.entries[1].imagePath = duplicate.entries[0].imagePath;
  assert.throws(
    () => validateCharacterManifest(
      duplicate,
      TitleProfileDefinitions,
      appMeta.characterManifestVersion,
    ),
    /CHARACTER_MANIFEST_INVALID/,
  );
});

test("T-005 F-016 rejects unsafe paths, invalid dimensions, alt, and integrity", () => {
  for (const imagePath of [
    "/assets/characters/character-balanced.webp",
    "https://example.com/character-balanced.webp",
    "assets\\characters\\character-balanced.webp",
    "assets/characters/../character-balanced.webp",
    "assets/characters/%2e%2e/evil.webp",
    "assets/characters/character-balanced.webp?x=1",
    "assets/characters/character-balanced.webp#x",
    "assets/characters/character-balanced.png",
  ]) {
    const invalid = structuredClone(CharacterManifest);
    invalid.entries[0].imagePath = imagePath;
    assert.throws(
      () => validateCharacterManifest(
        invalid,
        TitleProfileDefinitions,
        appMeta.characterManifestVersion,
      ),
      /CHARACTER_MANIFEST_INVALID/,
      imagePath,
    );
  }

  for (const [field, value] of [
    ["width", 512],
    ["height", 512],
    ["alt", " "],
    ["integrity", "sha256-invalid"],
  ]) {
    const invalid = structuredClone(CharacterManifest);
    invalid.entries[0][field] = value;
    assert.throws(
      () => validateCharacterManifest(
        invalid,
        TitleProfileDefinitions,
        appMeta.characterManifestVersion,
      ),
      /CHARACTER_MANIFEST_INVALID/,
      field,
    );
  }
});

test("T-005 F-016 rejects missing profiles and out-of-order entries", () => {
  const missing = structuredClone(CharacterManifest);
  missing.entries.pop();
  assert.throws(
    () => validateCharacterManifest(
      missing,
      TitleProfileDefinitions,
      appMeta.characterManifestVersion,
    ),
    /CHARACTER_MANIFEST_INVALID/,
  );

  const outOfOrder = structuredClone(CharacterManifest);
  [outOfOrder.entries[0], outOfOrder.entries[1]] = [
    outOfOrder.entries[1],
    outOfOrder.entries[0],
  ];
  assert.throws(
    () => validateCharacterManifest(
      outOfOrder,
      TitleProfileDefinitions,
      appMeta.characterManifestVersion,
    ),
    /CHARACTER_MANIFEST_INVALID/,
  );
});

test("T-005 F-016 definition validator converts manifest failure", () => {
  assert.equal(
    validateCharacterManifestDefinition(
      CharacterManifest,
      appMeta.characterManifestVersion,
    ),
    CharacterManifest,
  );

  const invalid = structuredClone(CharacterManifest);
  invalid.entries[0].alt = "";
  assert.throws(
    () => validateCharacterManifestDefinition(
      invalid,
      appMeta.characterManifestVersion,
    ),
    /DEFINITION_INVALID/,
  );
});

test("T-005 F-016 asset check treats every non-manifest runtime entry as orphaned", () => {
  assert.deepEqual(
    findOrphanRuntimeEntries(
      [
        "character-balanced.webp",
        "master.png",
        "nested-directory",
      ],
      ["assets/characters/character-balanced.webp"],
    ),
    ["master.png", "nested-directory"],
  );
});
