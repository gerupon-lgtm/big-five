# Q-012 Character Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce, validate, and integrate all 51 approved Q-012 cat character assets, beginning with a three-character pilot and ending with an exact, versioned manifest and one-character lazy loader.

**Architecture:** Keep production state and review evidence in a machine-validated ledger under `docs/`, keep transparent PNG masters out of the runtime bundle, and generate 1024×1024 transparent WebP delivery assets plus the runtime manifest from approved ledger rows. The manifest and loader form a small runtime interface; generation, conversion, inspection, and human approval remain build-time concerns.

**Tech Stack:** Node.js ES modules, `node:test`, Sharp for deterministic PNG/WebP inspection and conversion, JSON production ledger, static JavaScript manifest, browser `Image` decoding.

## Global Constraints

- Task/feature traceability: T-005 / F-016 / Q-012.
- Canonical title, character, prop, gaze, and pose source: `docs/title-character-catalog.md`.
- Canonical design: `docs/superpowers/specs/2026-07-25-t005-result-character-presentation-design.md`.
- Preserve a natural adult-cat skeleton and a medium-density watercolor/gouache style.
- Each asset contains one centered full-body cat and one or two props; do not crop the cat.
- Do not bake a background, text, card colors, palette colors, or scenery into the character asset.
- Source masters are square transparent PNG. Runtime files are 1024×1024 transparent WebP.
- 250,000 bytes per WebP is a target. Exceeding it produces a warning and requires human approval; it is not an automatic failure.
- Do not recolor a cat for a palette. Same-color separation belongs to the card layer through double outline, shadow, or a neutral plate.
- Never associate breed, coat, body shape, sex, or age with factors, ability, morality, intelligence, or rank.
- Load only the selected character. A missing or undecodable image must not remove the title, scores, result text, or share text.
- Do not put unapproved or incomplete assets in the 51-entry release manifest.
- Do not modify `prototype-big-five/`.

---

## File Structure

### Create

- `docs/assets/character-production/ledger.json` — 51-row production and approval ledger.
- `docs/assets/character-production/source-png/{characterId}.png` — approved transparent masters.
- `scripts/characters/character-contract.mjs` — ledger/manifest exact-schema validators and shared field constants.
- `scripts/characters/seed-ledger.mjs` — creates the initial 51-row ledger from the catalog and title definitions.
- `scripts/characters/validate-ledger.mjs` — validates stage-dependent ledger requirements.
- `scripts/characters/convert-characters.mjs` — converts approved PNG files using the fixed encoder settings.
- `scripts/characters/inspect-character.mjs` — reports dimensions, alpha, bounds, hash, and byte length.
- `scripts/characters/encoder-settings.json` — approved Sharp/WebP settings after the pilot gate.
- `scripts/characters/generate-manifest.mjs` — creates the release manifest from 51 released rows.
- `app/assets/characters/{characterId}.webp` — runtime images.
- `app/js/data/character-manifest.js` — generated immutable 51-entry manifest.
- `app/js/domain/character-manifest.js` — runtime manifest validation and entry resolution.
- `app/js/infrastructure/character-loader.js` — injected-decoder lazy loading and failure result.
- `app/tests/fixtures/character-manifest-pilot.fixture.js` — three-entry test-only fixture.
- `app/tests/character-ledger.test.js` — ledger and catalog contract tests.
- `app/tests/character-assets.test.js` — conversion and binary inspection tests.
- `app/tests/character-manifest.test.js` — release manifest tests.
- `app/tests/character-loader.test.js` — one-image loading and fallback tests.

### Modify

- `package.json` — add Sharp and `character:*` commands.
- `package-lock.json` — pin the installed encoder implementation.
- `app/js/config/app-meta.js` — keep `characterManifestVersion` synchronized with the generated manifest.
- `app/js/domain/definition-validator.js` — invoke the character manifest validator during definition validation.
- `docs/data-model.md` — record the implemented exact manifest and integrity contract.
- `docs/processing-design.md` — record the implemented conversion, inspection, and loader flow.
- `docs/tasks.md` — record Q-012 production counts and final verification evidence.

## Shared Interfaces

```js
validateCharacterLedger(ledger, titleProfiles)
// -> validated ledger; throws TypeError("CHARACTER_LEDGER_INVALID")

validateLedgerScope(ledger, scope)
// scope: "brief" | "pilot" | "pilot-converted" | "baseline11" |
//        "pair01" | "pair02" | "pair03" | "pair04" |
//        "release-assets" | "release"

inspectCharacterAsset(filePath)
// -> { width, height, format, hasAlpha, hasTransparentPixel,
//      boundsTouchEdge, byteLength, integrity }

convertCharacter({ inputPath, outputPath, settings })
// -> inspectCharacterAsset(outputPath)

generateCharacterManifest({ ledger, titleProfiles, characterManifestVersion })
// -> exact { characterManifestVersion, entries }

validateCharacterManifest(manifest, titleProfiles)
// -> validated manifest; throws TypeError("CHARACTER_MANIFEST_INVALID")

resolveCharacterEntry(manifest, characterId)
// -> CharacterManifestEntry; throws TypeError("CHARACTER_NOT_FOUND")

loadCharacterImage(entry, { decodeImage })
// -> Promise<{ status: "loaded", image, alt } |
//            { status: "unavailable", image: null, alt }>
```

The ledger root is exact `{ schemaVersion: 1, entries: CharacterProductionEntry[51] }`. Every entry has exactly:

```text
titleId, characterId, titleLabelAtBrief, assetVersion,
productionStatus, sceneIntent, catReferenceKind, catReferencePath,
referenceRightsNote, pose, gazeTarget, props,
prohibitedRepresentationCheck, sourcePngPath, sourceSha256,
deliveryWebpPath, deliverySha256, width, height, byteLength,
webpEncoder, webpSettings, alt, artReviewStatus,
anatomyReviewStatus, technicalReviewStatus,
accessibilityReviewStatus, approvedBy, approvedAt,
rejectionReason, notes
```

`productionStatus` is one of `brief`, `generated`, `art-approved`, `converted`, `technical-approved`, `released`. Output paths, hashes, dimensions, bytes, encoder data, and approval identity may be `null` until their owning stage; `validateLedgerScope` requires them at the corresponding gate.

---

### Task 1: Ledger Contract and 51-Row Seed

**Files:**

- Create: `scripts/characters/character-contract.mjs`
- Create: `scripts/characters/seed-ledger.mjs`
- Create: `scripts/characters/validate-ledger.mjs`
- Create: `docs/assets/character-production/ledger.json`
- Create: `app/tests/character-ledger.test.js`
- Modify: `package.json`

**Interfaces:**

- Consumes: `TitleProfileDefinitions` and the two numbered tables in `docs/title-character-catalog.md`.
- Produces: `validateCharacterLedger`, `validateLedgerScope`, and a fixed-order 51-row ledger.

- [ ] **Step 1: Write the failing ledger test**

```js
// app/tests/character-ledger.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import {
  CHARACTER_LEDGER_FIELDS,
  validateCharacterLedger,
} from "../../scripts/characters/character-contract.mjs";

const ledger = JSON.parse(await readFile(
  new URL("../../docs/assets/character-production/ledger.json", import.meta.url),
  "utf8",
));

test("T-005 F-016 ledger exactly covers the 51 title profiles", () => {
  assert.equal(validateCharacterLedger(ledger, TitleProfileDefinitions), ledger);
  assert.equal(ledger.entries.length, 51);
  assert.deepEqual(Object.keys(ledger.entries[0]), CHARACTER_LEDGER_FIELDS);
  assert.deepEqual(
    ledger.entries.map(({ characterId }) => characterId),
    TitleProfileDefinitions.map(({ characterId }) => characterId),
  );
});

test("T-005 F-016 ledger rejects an unknown field and three props", () => {
  const unknown = structuredClone(ledger);
  unknown.entries[0].unexpected = true;
  assert.throws(
    () => validateCharacterLedger(unknown, TitleProfileDefinitions),
    /CHARACTER_LEDGER_INVALID/,
  );

  const props = structuredClone(ledger);
  props.entries[0].props = ["a", "b", "c"];
  assert.throws(
    () => validateCharacterLedger(props, TitleProfileDefinitions),
    /CHARACTER_LEDGER_INVALID/,
  );
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```powershell
node --test app/tests/character-ledger.test.js
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/characters/character-contract.mjs`.

- [ ] **Step 3: Implement the exact contract and seeding script**

`character-contract.mjs` must export the field array in the order shown under Shared Interfaces and reject:

- root or entry unknown fields;
- a count other than 51;
- order, titleId, or characterId differing from `TitleProfileDefinitions`;
- duplicate IDs;
- `props` outside one or two non-empty strings;
- an empty pose, gaze target, scene intent, or alt;
- an invalid status;
- a non-null output field with the wrong primitive type.

`seed-ledger.mjs` must parse both numbered catalog tables, join each row to `TitleProfileDefinitions` by `titleId`, set the approved title, props, gaze, and pose, and form `alt` as a factual Japanese sentence from that visible pose, gaze, and props. It writes all unreached stage fields as `null` and must refuse to overwrite an existing ledger unless passed `--replace`.

```js
// scripts/characters/validate-ledger.mjs
import { readFile } from "node:fs/promises";
import { TitleProfileDefinitions } from "../../app/js/data/title-profile-definitions.js";
import {
  validateCharacterLedger,
  validateLedgerScope,
} from "./character-contract.mjs";

const scope = process.argv[2] ?? "brief";
const ledger = JSON.parse(await readFile(
  new URL("../../docs/assets/character-production/ledger.json", import.meta.url),
  "utf8",
));
validateLedgerScope(
  validateCharacterLedger(ledger, TitleProfileDefinitions),
  scope,
);
console.log(`character ledger ${scope}: PASS`);
```

Add:

```json
"character:ledger": "node scripts/characters/validate-ledger.mjs"
```

- [ ] **Step 4: Generate the ledger and verify pass**

Run:

```powershell
node scripts/characters/seed-ledger.mjs
node --test app/tests/character-ledger.test.js
npm.cmd run character:ledger
```

Expected:

```text
tests 2
pass 2
fail 0
character ledger brief: PASS
```

- [ ] **Step 5: Commit only the ledger contract files**

```powershell
git add -- package.json scripts/characters/character-contract.mjs scripts/characters/seed-ledger.mjs scripts/characters/validate-ledger.mjs docs/assets/character-production/ledger.json app/tests/character-ledger.test.js
git commit -m "feat: add character production ledger contract"
```

---

### Task 2: Generate and Approve the Three Transparent PNG Pilot Masters

**Files:**

- Create: `docs/assets/character-production/source-png/character-balanced.png`
- Create: `docs/assets/character-production/source-png/character-single-intellectImagination-high.png`
- Create: `docs/assets/character-production/source-png/character-single-intellectImagination-low.png`
- Modify: `docs/assets/character-production/ledger.json`

**Interfaces:**

- Consumes: the first three approved catalog rows and `docs/assets/character-style/monaka-character-anchor-v1.png`.
- Produces: three `art-approved` PNG masters and human approval evidence in the ledger.

- [ ] **Step 1: Prove the pilot gate is initially closed**

Run:

```powershell
node scripts/characters/validate-ledger.mjs pilot
```

Expected: FAIL with `CHARACTER_LEDGER_INVALID` because the three source PNGs and approval fields are absent.

- [ ] **Step 2: Generate the three masters**

Use the image generation tool once per character and save the returned original-resolution image to the exact paths above.

Prompts must include the Global Constraints and these row-specific instructions:

- `character-balanced`: five-leaf mobile; sitting centrally and looking upward.
- `character-single-intellectImagination-high`: Monaka appearance from the anchor; butterfly and small sketchbook; gaze and one front paw toward the butterfly.
- `character-single-intellectImagination-low`: nuts and a simple basket; walking while looking near its paws.

Do not instruct the generator to add a floor, scene, frame, label, title, gradient, or card background.

- [ ] **Step 3: Record human art and anatomy approval**

Review the three masters side by side on a transparency checker. Require all of:

- recognizably one visual series at medium watercolor/gouache density;
- natural adult-cat skull, muzzle, ears, four limbs, paws, tail, and seated/walking balance;
- centered full body with whiskers, ears, paws, tail, and props uncut;
- no background, text, card color, second cat, or third prop;
- comparable attractiveness without high/low/balanced rank cues;
- Monaka likeness without inferring personality or factor meaning from appearance.

For an approved row, set `productionStatus` to `art-approved`, both art review fields to `approved`, and record `approvedBy` and `approvedAt`. A rejected image retains `generated` and records a concrete `rejectionReason`; do not continue to conversion.

- [ ] **Step 4: Run the pilot ledger gate**

Run:

```powershell
node scripts/characters/validate-ledger.mjs pilot
```

Expected:

```text
character ledger pilot: PASS
```

- [ ] **Step 5: Commit only the three pilot masters and ledger**

```powershell
git add -- docs/assets/character-production/ledger.json docs/assets/character-production/source-png/character-balanced.png docs/assets/character-production/source-png/character-single-intellectImagination-high.png docs/assets/character-production/source-png/character-single-intellectImagination-low.png
git commit -m "feat: add approved three-character pilot masters"
```

---

### Task 3: WebP Conversion and Binary Inspection

**Files:**

- Create: `scripts/characters/convert-characters.mjs`
- Create: `scripts/characters/inspect-character.mjs`
- Create: `app/tests/character-assets.test.js`
- Modify: `package.json`
- Create or modify: `package-lock.json`

**Interfaces:**

- Consumes: an art-approved transparent PNG and explicit encoder settings.
- Produces: `convertCharacter` and `inspectCharacterAsset`.

- [ ] **Step 1: Write failing conversion and inspection tests**

```js
// app/tests/character-assets.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { convertCharacter } from "../../scripts/characters/convert-characters.mjs";
import { inspectCharacterAsset } from "../../scripts/characters/inspect-character.mjs";

test("T-005 F-016 converts a transparent square PNG to inspected WebP", async () => {
  const directory = await mkdtemp(join(tmpdir(), "q012-"));
  const inputPath = join(directory, "input.png");
  const outputPath = join(directory, "output.webp");
  try {
    const pixels = Buffer.alloc(32 * 32 * 4);
    for (let index = 8; index < 24; index += 1) {
      for (let column = 8; column < 24; column += 1) {
        const offset = (index * 32 + column) * 4;
        pixels.set([120, 90, 60, 255], offset);
      }
    }
    await sharp(pixels, { raw: { width: 32, height: 32, channels: 4 } })
      .png()
      .toFile(inputPath);
    await convertCharacter({
      inputPath,
      outputPath,
      size: 1024,
      settings: { quality: 82, alphaQuality: 100, effort: 6 },
    });
    const report = await inspectCharacterAsset(outputPath);
    assert.equal(report.format, "webp");
    assert.deepEqual([report.width, report.height], [1024, 1024]);
    assert.equal(report.hasAlpha, true);
    assert.equal(report.hasTransparentPixel, true);
    assert.equal(report.boundsTouchEdge, false);
    assert.match(report.integrity, /^sha256-[A-Za-z0-9+/]+={0,2}$/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```powershell
node --test app/tests/character-assets.test.js
```

Expected: FAIL because Sharp and the conversion module are not installed.

- [ ] **Step 3: Install and implement the converter**

Run:

```powershell
npm.cmd install --save-dev sharp
```

`convertCharacter` must:

1. inspect the PNG for a square canvas and alpha;
2. resize with `fit: "contain"` to 1024×1024 without flattening;
3. call `.webp({ quality, alphaQuality, effort })`;
4. omit `.withMetadata()` so metadata is not copied;
5. write the output and return its inspection report.

`inspectCharacterAsset` must use Sharp metadata and raw RGBA pixels, SHA-256 the file bytes, find the non-zero-alpha bounding box, and return the Shared Interfaces shape. It must throw `CHARACTER_ASSET_INVALID` for non-WebP, non-square output, missing alpha, no transparent pixel, or content touching any canvas edge. Byte length over 250,000 sets `sizeWarning: true` but does not throw.

Add:

```json
"character:convert": "node scripts/characters/convert-characters.mjs",
"character:inspect": "node scripts/characters/inspect-character.mjs"
```

- [ ] **Step 4: Run focused and full tests**

Run:

```powershell
node --test app/tests/character-assets.test.js
npm.cmd test
```

Expected: the focused test passes and the full suite reports `fail 0`.

- [ ] **Step 5: Commit only converter dependencies, scripts, and test**

```powershell
git add -- package.json package-lock.json scripts/characters/convert-characters.mjs scripts/characters/inspect-character.mjs app/tests/character-assets.test.js
git commit -m "feat: add deterministic character WebP pipeline"
```

---

### Task 4: Convert the Pilot and Freeze Encoder Settings

**Files:**

- Create: `scripts/characters/encoder-settings.json`
- Create: `app/assets/characters/character-balanced.webp`
- Create: `app/assets/characters/character-single-intellectImagination-high.webp`
- Create: `app/assets/characters/character-single-intellectImagination-low.webp`
- Create: `app/tests/fixtures/character-manifest-pilot.fixture.js`
- Modify: `docs/assets/character-production/ledger.json`

**Interfaces:**

- Consumes: three art-approved masters and the initial comparison settings.
- Produces: fixed settings and three technically approved delivery assets.

- [ ] **Step 1: Prove the technical pilot gate is closed**

Run:

```powershell
node scripts/characters/validate-ledger.mjs pilot-converted
```

Expected: FAIL with `CHARACTER_LEDGER_INVALID` because delivery hashes and encoder settings are absent.

- [ ] **Step 2: Convert using the initial approved comparison candidate**

Create:

```json
{
  "encoder": "sharp",
  "quality": 82,
  "alphaQuality": 100,
  "effort": 6,
  "metadata": "none",
  "size": 1024
}
```

Run:

```powershell
npm.cmd run character:convert -- --scope pilot --settings scripts/characters/encoder-settings.json
npm.cmd run character:inspect -- --scope pilot
```

Expected: three valid 1024×1024 transparent WebP reports. Files over 250,000 bytes print `WARNING character asset exceeds target bytes` without a non-zero exit.

- [ ] **Step 3: Complete the human conversion gate**

Compare PNG and WebP at 100%, 360px, and on light, mid-tone, and dark checker-backed cards. Approve only if watercolor edges, whiskers, eye detail, coat identity, prop identity, transparency, and full-body margins survive. If quality 82 is rejected, stop this plan and revise the approved T-005 design before choosing a different shared setting.

Record Sharp and libvips versions, the exact settings object, delivery hash, byte length, dimensions, technical approval, accessibility approval, approver, and time in each pilot row. Set pilot rows to `technical-approved`.

- [ ] **Step 4: Add the pilot fixture and verify the gate**

The fixture exports an exact three-entry manifest-like object using the real pilot paths, hashes, dimensions, and alt text; it is test-only and must not be imported by application code.

Run:

```powershell
node scripts/characters/validate-ledger.mjs pilot-converted
node --test app/tests/character-assets.test.js
```

Expected:

```text
character ledger pilot-converted: PASS
fail 0
```

- [ ] **Step 5: Commit only fixed settings, pilot outputs, fixture, and ledger**

```powershell
git add -- scripts/characters/encoder-settings.json docs/assets/character-production/ledger.json app/tests/fixtures/character-manifest-pilot.fixture.js app/assets/characters/character-balanced.webp app/assets/characters/character-single-intellectImagination-high.webp app/assets/characters/character-single-intellectImagination-low.webp
git commit -m "feat: freeze pilot character conversion settings"
```

---

### Task 5: Complete the Eleven-Character Baseline

**Files:**

- Create: the eight remaining single-factor PNG files under `docs/assets/character-production/source-png/`.
- Create: the matching eight WebP files under `app/assets/characters/`.
- Modify: `docs/assets/character-production/ledger.json`

**Interfaces:**

- Consumes: catalog rows 4–11 and the fixed encoder settings.
- Produces: 11 art- and technically approved baseline characters.

- [ ] **Step 1: Prove the baseline gate is closed**

Run:

```powershell
node scripts/characters/validate-ledger.mjs baseline11
```

Expected: FAIL with `CHARACTER_LEDGER_INVALID` naming the first unreleased single-factor row.

- [ ] **Step 2: Generate and art-review rows 4–11**

Generate each row from its exact catalog props and pose. Review the resulting 11-character sheet for natural anatomy, consistent rendering density, comparable visual appeal, distinct full scenes, one cat, one or two props, and no high/low rank coding. Mark only approved masters `art-approved`.

- [ ] **Step 3: Convert and technically review rows 4–11**

Run:

```powershell
npm.cmd run character:convert -- --scope baseline11 --settings scripts/characters/encoder-settings.json
npm.cmd run character:inspect -- --scope baseline11
```

Review all warnings. Record every hash, byte length, encoder version, alt, approval identity, and approval time; then set approved rows to `technical-approved`.

- [ ] **Step 4: Verify the 11-character gate**

Run:

```powershell
node scripts/characters/validate-ledger.mjs baseline11
node --test app/tests/character-assets.test.js
```

Expected:

```text
character ledger baseline11: PASS
fail 0
```

- [ ] **Step 5: Commit only baseline assets and ledger**

```powershell
git add -- docs/assets/character-production/ledger.json docs/assets/character-production/source-png app/assets/characters
git commit -m "feat: complete eleven-character baseline"
```

---

### Task 6: Produce Pair Batch 1, Catalog Rows 12–21

**Files:**

- Create: ten PNG masters for catalog rows 12–21.
- Create: ten matching WebP files.
- Modify: `docs/assets/character-production/ledger.json`

**Interfaces:**

- Consumes: catalog rows 12–21 and frozen settings.
- Produces: 21 cumulative approved characters.

- [ ] **Step 1: Run `node scripts/characters/validate-ledger.mjs pair01`**

Expected: FAIL naming catalog row 12.

- [ ] **Step 2: Generate rows 12–21 and perform human art/anatomy review**

Require the exact catalog prop/pose brief, one cat only, no scenery burn-in, no ability/morality/rank symbolism, and no prop duplication that makes two titles visually identical.

- [ ] **Step 3: Convert with `npm.cmd run character:convert -- --scope pair01 --settings scripts/characters/encoder-settings.json`**

Expected: ten inspection reports and warnings only for files above the target.

- [ ] **Step 4: Record approvals and run `node scripts/characters/validate-ledger.mjs pair01`**

Expected: `character ledger pair01: PASS` with 21 cumulative approved rows.

- [ ] **Step 5: Commit only batch 1 asset paths and ledger**

```powershell
git add -- docs/assets/character-production/ledger.json docs/assets/character-production/source-png app/assets/characters
git commit -m "feat: add first ten pair characters"
```

---

### Task 7: Produce Pair Batch 2, Catalog Rows 22–31

**Files:**

- Create: ten PNG masters for catalog rows 22–31.
- Create: ten matching WebP files.
- Modify: `docs/assets/character-production/ledger.json`

**Interfaces:**

- Consumes: catalog rows 22–31 and frozen settings.
- Produces: 31 cumulative approved characters and the first full-series review sheet.

- [ ] **Step 1: Run `node scripts/characters/validate-ledger.mjs pair02`**

Expected: FAIL naming catalog row 22.

- [ ] **Step 2: Generate rows 22–31 and complete row-level human review**

Require catalog fidelity, natural anatomy, transparent background, complete body, and no factor-value stereotype.

- [ ] **Step 3: Convert with `npm.cmd run character:convert -- --scope pair02 --settings scripts/characters/encoder-settings.json`**

Expected: ten valid reports; target-byte excess remains a warning requiring recorded approval.

- [ ] **Step 4: Review all 31 characters together and run the gate**

Check density, head/body proportions, prop scale, margins, repeated-title differentiation, and equal appeal.

Run:

```powershell
node scripts/characters/validate-ledger.mjs pair02
```

Expected: `character ledger pair02: PASS` with 31 cumulative approved rows.

- [ ] **Step 5: Commit only batch 2 asset paths and ledger**

```powershell
git add -- docs/assets/character-production/ledger.json docs/assets/character-production/source-png app/assets/characters
git commit -m "feat: add second ten pair characters"
```

---

### Task 8: Produce Pair Batch 3, Catalog Rows 32–41

**Files:**

- Create: ten PNG masters for catalog rows 32–41.
- Create: ten matching WebP files.
- Modify: `docs/assets/character-production/ledger.json`

**Interfaces:**

- Consumes: catalog rows 32–41 and frozen settings.
- Produces: 41 cumulative approved characters.

- [ ] **Step 1: Run `node scripts/characters/validate-ledger.mjs pair03`**

Expected: FAIL naming catalog row 32.

- [ ] **Step 2: Generate and human-review rows 32–41**

Require one cat, catalog props, natural anatomy, complete transparency, full-body margins, and explicit rejection of superiority, coldness, weakness, or isolation coding.

- [ ] **Step 3: Convert with `npm.cmd run character:convert -- --scope pair03 --settings scripts/characters/encoder-settings.json`**

Expected: ten valid reports using the unchanged settings file.

- [ ] **Step 4: Record approvals and run `node scripts/characters/validate-ledger.mjs pair03`**

Expected: `character ledger pair03: PASS` with 41 cumulative approved rows.

- [ ] **Step 5: Commit only batch 3 asset paths and ledger**

```powershell
git add -- docs/assets/character-production/ledger.json docs/assets/character-production/source-png app/assets/characters
git commit -m "feat: add third ten pair characters"
```

---

### Task 9: Produce Pair Batch 4, Catalog Rows 42–51

**Files:**

- Create: ten PNG masters for catalog rows 42–51.
- Create: ten matching WebP files.
- Modify: `docs/assets/character-production/ledger.json`

**Interfaces:**

- Consumes: catalog rows 42–51 and frozen settings.
- Produces: all 51 approved masters and delivery assets.

- [ ] **Step 1: Run `node scripts/characters/validate-ledger.mjs pair04`**

Expected: FAIL naming catalog row 42.

- [ ] **Step 2: Generate and human-review rows 42–51**

For interpersonal scenes, represent the second party only through approved props, footprints, or off-canvas gaze; never add a second cat. Convert scenery terms into catalog props and pose without adding a baked scene.

- [ ] **Step 3: Convert with `npm.cmd run character:convert -- --scope pair04 --settings scripts/characters/encoder-settings.json`**

Expected: ten valid reports and no changed encoder setting.

- [ ] **Step 4: Review the full 51-character sheet and run the release asset gate**

Require zero missing cats, repeated full compositions, anatomy failures, cropped parts, baked backgrounds, text, three-prop rows, or value stereotypes.

Run:

```powershell
node scripts/characters/validate-ledger.mjs release-assets
npm.cmd run character:inspect -- --scope release
```

Expected:

```text
character ledger release-assets: PASS
inspected 51 character assets
invalid 0
```

- [ ] **Step 5: Commit only batch 4 asset paths and ledger**

```powershell
git add -- docs/assets/character-production/ledger.json docs/assets/character-production/source-png app/assets/characters
git commit -m "feat: complete all fifty-one character assets"
```

---

### Task 10: Generate and Validate the 51-Entry Release Manifest

**Files:**

- Create: `scripts/characters/generate-manifest.mjs`
- Create: `scripts/characters/check-character-assets.mjs`
- Create: `app/js/data/character-manifest.js`
- Create: `app/js/domain/character-manifest.js`
- Create: `app/tests/character-manifest.test.js`
- Modify: `app/js/config/app-meta.js`
- Modify: `app/js/domain/definition-validator.js`
- Modify: `package.json`

**Interfaces:**

- Consumes: 51 released ledger rows, `TitleProfileDefinitions`, and `appMeta.characterManifestVersion`.
- Produces: `generateCharacterManifest`, `validateCharacterManifest`, and `resolveCharacterEntry`.

- [ ] **Step 1: Write the failing release manifest tests**

```js
// app/tests/character-manifest.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { appMeta } from "../js/config/app-meta.js";
import { CharacterManifest } from "../js/data/character-manifest.js";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import {
  resolveCharacterEntry,
  validateCharacterManifest,
} from "../js/domain/character-manifest.js";

test("T-005 F-016 release manifest exactly covers 51 profiles", () => {
  assert.equal(
    validateCharacterManifest(CharacterManifest, TitleProfileDefinitions),
    CharacterManifest,
  );
  assert.equal(CharacterManifest.characterManifestVersion, appMeta.characterManifestVersion);
  assert.equal(CharacterManifest.entries.length, 51);
  assert.deepEqual(Object.keys(CharacterManifest.entries[0]), [
    "characterId", "assetVersion", "imagePath", "width",
    "height", "alt", "integrity",
  ]);
  assert.deepEqual(
    CharacterManifest.entries.map(({ characterId }) => characterId),
    TitleProfileDefinitions.map(({ characterId }) => characterId),
  );
});

test("T-005 F-016 resolves one character and rejects missing IDs", () => {
  const entry = resolveCharacterEntry(CharacterManifest, "character-balanced");
  assert.equal(entry.imagePath, "assets/characters/character-balanced.webp");
  assert.throws(
    () => resolveCharacterEntry(CharacterManifest, "character-missing"),
    /CHARACTER_NOT_FOUND/,
  );
});

test("T-005 F-016 rejects unknown fields and duplicate paths", () => {
  const unknown = structuredClone(CharacterManifest);
  unknown.entries[0].unexpected = true;
  assert.throws(
    () => validateCharacterManifest(unknown, TitleProfileDefinitions),
    /CHARACTER_MANIFEST_INVALID/,
  );

  const duplicate = structuredClone(CharacterManifest);
  duplicate.entries[1].imagePath = duplicate.entries[0].imagePath;
  assert.throws(
    () => validateCharacterManifest(duplicate, TitleProfileDefinitions),
    /CHARACTER_MANIFEST_INVALID/,
  );
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```powershell
node --test app/tests/character-manifest.test.js
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `character-manifest.js`.

- [ ] **Step 3: Implement generation and runtime validation**

`generateCharacterManifest` must include only `released` rows, preserve title profile order, copy ledger asset version/path/dimensions/alt/integrity, and refuse any count other than 51. Generated entries are deeply frozen.

`validateCharacterManifest` must enforce:

- exact root and entry fields;
- manifest version equality at the caller seam;
- fixed order and exact character ID set;
- unique character IDs and image paths;
- same-origin relative `.webp` paths without query, fragment, or `..`;
- width and height exactly 1024;
- non-empty alt;
- `sha256-<Base64>` integrity.

Add:

```json
"character:manifest": "node scripts/characters/generate-manifest.mjs",
"character:check": "node scripts/characters/check-character-assets.mjs"
```

The existing `definition-validator.js` must call `validateCharacterManifest` with `TitleProfileDefinitions` and stop with `DEFINITION_INVALID` if it fails.

- [ ] **Step 4: Generate the manifest and run checks**

Run:

```powershell
npm.cmd run character:manifest
node --test app/tests/character-manifest.test.js
npm.cmd run character:check
npm.cmd test
```

Expected:

```text
character manifest entries 51
orphan assets 0
integrity mismatches 0
fail 0
```

Byte-target warnings may be present only when the corresponding ledger rows contain explicit human approval.

- [ ] **Step 5: Commit only manifest code, tests, configuration, and script**

```powershell
git add -- package.json app/js/config/app-meta.js app/js/domain/definition-validator.js app/js/data/character-manifest.js app/js/domain/character-manifest.js app/tests/character-manifest.test.js scripts/characters/generate-manifest.mjs scripts/characters/check-character-assets.mjs
git commit -m "feat: add validated character release manifest"
```

---

### Task 11: Add the One-Character Lazy Loader and Text-Preserving Fallback

**Files:**

- Create: `app/js/infrastructure/character-loader.js`
- Create: `app/tests/character-loader.test.js`

**Interfaces:**

- Consumes: one validated `CharacterManifestEntry` and injected `decodeImage(path)`.
- Produces: `loadCharacterImage(entry, { decodeImage })`.

- [ ] **Step 1: Write failing loader tests**

```js
// app/tests/character-loader.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { loadCharacterImage } from "../js/infrastructure/character-loader.js";

const entry = Object.freeze({
  characterId: "character-balanced",
  assetVersion: "character-balanced-v1",
  imagePath: "assets/characters/character-balanced.webp",
  width: 1024,
  height: 1024,
  alt: "五枚の葉のモビールを見上げる、自然な姿勢の猫。",
  integrity: "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
});

test("T-005 F-016 requests only the selected character path", async () => {
  const requested = [];
  const image = { width: 1024, height: 1024 };
  const result = await loadCharacterImage(entry, {
    decodeImage: async (path) => {
      requested.push(path);
      return image;
    },
  });
  assert.deepEqual(requested, [entry.imagePath]);
  assert.deepEqual(result, { status: "loaded", image, alt: entry.alt });
});

test("T-005 F-015 preserves alt instead of throwing on decode failure", async () => {
  const result = await loadCharacterImage(entry, {
    decodeImage: async () => {
      throw new Error("decode failed");
    },
  });
  assert.deepEqual(result, {
    status: "unavailable",
    image: null,
    alt: entry.alt,
  });
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```powershell
node --test app/tests/character-loader.test.js
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `character-loader.js`.

- [ ] **Step 3: Implement the injected-decoder loader**

```js
// app/js/infrastructure/character-loader.js
export async function loadCharacterImage(entry, { decodeImage }) {
  if (!entry || typeof entry.imagePath !== "string" || typeof entry.alt !== "string") {
    throw new TypeError("CHARACTER_ENTRY_INVALID");
  }
  if (typeof decodeImage !== "function") {
    throw new TypeError("CHARACTER_DECODER_INVALID");
  }
  try {
    const image = await decodeImage(entry.imagePath);
    return { status: "loaded", image, alt: entry.alt };
  } catch {
    return { status: "unavailable", image: null, alt: entry.alt };
  }
}
```

The presentation caller must resolve exactly one entry after title classification and invoke the loader only when the result character enters the viewport. It must retain its already-composed title, scores, result text, palette choices, and share text when status is `unavailable`.

- [ ] **Step 4: Run loader and full tests**

Run:

```powershell
node --test app/tests/character-loader.test.js
npm.cmd test
```

Expected: loader tests pass and the full suite reports `fail 0`.

- [ ] **Step 5: Commit only loader and test**

```powershell
git add -- app/js/infrastructure/character-loader.js app/tests/character-loader.test.js
git commit -m "feat: add resilient single-character loader"
```

---

### Task 12: Synchronize Design Records and Perform Final Q-012 Verification

**Files:**

- Modify: `docs/data-model.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/tasks.md`

**Interfaces:**

- Consumes: verified ledger, assets, manifest, loader, and test outputs.
- Produces: durable Q-012 completion evidence without changing the approved design.

- [ ] **Step 1: Update documents with confirmed implementation facts**

Record:

- the exact manifest fields and required integrity;
- the actual locked Sharp/libvips version and WebP settings;
- 51 approved source/delivery assets and any approved byte-target warnings;
- the manifest generation/check commands;
- loader success/fallback behavior;
- T-005 remains incomplete if Q-006 text or Q-013 content gates remain open.

- [ ] **Step 2: Run all automated verification**

Run:

```powershell
npm.cmd run character:ledger -- release
npm.cmd run character:check
npm.cmd run check
npm.cmd test
git diff --check
```

Expected:

```text
character ledger release: PASS
character manifest entries 51
orphan assets 0
integrity mismatches 0
static checks passed
fail 0
```

`git diff --check` exits 0 with no output.

- [ ] **Step 3: Run the browser verification**

Run:

```powershell
npm.cmd run dev
```

Verify:

1. Balanced, single-high/low, and pair fixtures each request only their selected WebP.
2. No character request occurs before the result character reaches its lazy-load point.
3. Every displayed image uses contain-style sizing and remains complete at 360px and 200% text.
4. A forced 404 and decode failure preserve title, scores, result text, palette choices, and share text.
5. Light, mid-tone, and dark same-color cards retain the selected palette and separate the cat with outline, shadow, or neutral plate.
6. No runtime PNG master, anchor image, second cat, baked background, or text appears.

Expected: all six checks pass; any failure keeps Q-012 open.

- [ ] **Step 4: Confirm only intended paths remain**

Run:

```powershell
git status --short
```

Expected: only the three design documents and this plan are uncommitted after prior task commits.

- [ ] **Step 5: Commit only synchronized documentation**

```powershell
git add -- docs/data-model.md docs/processing-design.md docs/tasks.md docs/superpowers/plans/2026-07-25-q012-character-assets.md
git commit -m "docs: record verified Q-012 character assets"
```

---

## Self-Review Checklist

- [ ] The plan preserves the catalog's exact 51 title/character order.
- [ ] The three-character pilot precedes encoder locking.
- [ ] The remaining eight single-factor characters complete the 11-character baseline.
- [ ] Pair rows are split into four explicit ten-character gates.
- [ ] A production manifest is impossible before all 51 rows are released.
- [ ] PNG masters stay outside the runtime asset directory.
- [ ] The Monaka anchor is reference-only and never copied into runtime assets.
- [ ] Byte target warnings require recorded human approval and never silently fail or pass.
- [ ] Every automated module begins with a failing focused test.
- [ ] Every task names its expected failure, pass result, and path-limited commit.
- [ ] Loader failure returns alt and never destroys the existing result model.
- [ ] Final documentation records only verified implementation facts.
