import test from "node:test";
import assert from "node:assert/strict";

import { ContentError } from "../../scripts/content/content-error.mjs";
import { compilePresentationContent } from "../../scripts/content/compile-presentation.mjs";
import {
  assertCharacterReleaseEligible,
  compileCharacterContent,
} from "../../scripts/content/compile-characters.mjs";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { makeValidPresentationDefinitionSet } from "./fixtures/presentation-valid.fixture.js";

const PRESENTATION_VERSION = "presentation-v1";
const CHARACTER_VERSION = "character-manifest-v1";

function validPresentationRows() {
  const definition = makeValidPresentationDefinitionSet(TitleProfileDefinitions);
  return {
    sceneRows: definition.scenes.map(({ sceneId, label }, index) => ({
      scene_id: sceneId,
      presentation_definition_version: PRESENTATION_VERSION,
      display_order: index + 1,
      label,
      status: "draft",
    })),
    paletteRows: definition.palettes.map(({ paletteId, label, description }, index) => ({
      palette_id: paletteId,
      presentation_definition_version: PRESENTATION_VERSION,
      display_order: index + 1,
      label,
      description,
      status: "draft",
    })),
    paletteUsageRows: definition.palettes.flatMap(({ paletteId, baseColors }) =>
      ["primary", "secondary", "accent"].map((usage, index) => ({
        palette_id: paletteId,
        display_order: index + 1,
        usage,
        color: baseColors[usage],
        status: "draft",
      }))),
    fragranceRows: definition.fragrances.map(({ fragranceId, sceneId, accordLabel, description, disclaimerId }, index) => ({
      fragrance_id: fragranceId,
      presentation_definition_version: PRESENTATION_VERSION,
      display_order: index + 1,
      scene_id: sceneId,
      accord_label: accordLabel,
      description,
      disclaimer_id: disclaimerId,
      status: "draft",
    })),
    selectorRows: definition.titleSelectors.map(({ titleId }, index) => ({
      title_id: titleId,
      presentation_definition_version: PRESENTATION_VERSION,
      display_order: index + 1,
      status: "draft",
    })),
    selectorPaletteRows: definition.titleSelectors.flatMap(({ titleId, alternativePaletteIds }) =>
      alternativePaletteIds.map((paletteId, index) => ({
        title_id: titleId,
        display_order: index + 1,
        palette_id: paletteId,
        status: "draft",
      }))),
    selectorFragranceRows: definition.titleSelectors.flatMap(({ titleId, fragranceScenes }) =>
      fragranceScenes.flatMap(({ sceneId, candidateFragranceIds, shareFragranceId }) =>
        candidateFragranceIds.map((fragranceId, index) => ({
          title_id: titleId,
          scene_id: sceneId,
          display_order: index + 1,
          fragrance_id: fragranceId,
          share_selected: String(fragranceId === shareFragranceId),
          status: "draft",
        })))),
    titleProfiles: TitleProfileDefinitions,
  };
}

function validCharacterRows() {
  return TitleProfileDefinitions.map((profile, index) => ({
    title_id: profile.titleId,
    character_manifest_version: CHARACTER_VERSION,
    display_order: index + 1,
    character_id: profile.characterId,
    asset_version: "character-asset-v1",
    delivery_webp_path: `assets/characters/${index + 1}.webp`,
    delivery_sha256: "a".repeat(64),
    width: 1024,
    height: 1024,
    byte_length: 1,
    has_alpha: "true",
    alt: "全身が見える猫のイラスト",
    art_review_status: "approved",
    anatomy_review_status: "approved",
    technical_review_status: "approved",
    accessibility_review_status: "approved",
    approved_by: "fixture-reviewer",
    approved_at: "2026-07-26T00:00:00.000Z",
    status: "approved",
  }));
}

function expectContentError(code) {
  return (error) => error instanceof ContentError && error.code === code;
}

test("T-005 F-018 Q-013 normalized CSVs compile to the exact presentation definition", () => {
  const compiled = compilePresentationContent(validPresentationRows(), PRESENTATION_VERSION);
  assert.deepEqual(compiled, makeValidPresentationDefinitionSet(TitleProfileDefinitions));
  assert.equal(Object.isFrozen(compiled), true);
});

test("T-005 F-018 rejects incomplete, unordered, orphaned, and unsafe normalized presentation rows", () => {
  const cases = [
    ["missing scene", (rows) => rows.sceneRows.pop()],
    ["duplicate palette usage order", (rows) => { rows.paletteUsageRows[1].display_order = 1; }],
    ["orphan palette", (rows) => { rows.selectorPaletteRows[0].palette_id = "palette-missing"; }],
    ["extra alternative", (rows) => rows.selectorPaletteRows.push({ ...rows.selectorPaletteRows[0], palette_id: "palette-default", display_order: 3 })],
    ["unsafe fragrance copy", (rows) => { rows.fragranceRows[0].description = "Use 2 drops in a diffuser."; }],
    ["duplicate title selector", (rows) => { rows.selectorRows[1].title_id = rows.selectorRows[0].title_id; }],
    ["wrong version", (rows) => { rows.paletteRows[0].presentation_definition_version = "presentation-v2"; }],
  ];

  for (const [, mutate] of cases) {
    const rows = validPresentationRows();
    mutate(rows);
    assert.throws(
      () => compilePresentationContent(rows, PRESENTATION_VERSION),
      expectContentError("PRESENTATION_CONTENT_INVALID"),
    );
  }
});

test("T-005 F-016 Q-012 compiler emits only the canonical character manifest fields", () => {
  const manifest = compileCharacterContent({ rows: validCharacterRows(), titleProfiles: TitleProfileDefinitions }, CHARACTER_VERSION);
  assert.deepEqual(Object.keys(manifest), ["characterManifestVersion", "entries"]);
  assert.equal(manifest.entries.length, 51);
  assert.deepEqual(Object.keys(manifest.entries[0]), [
    "characterId", "assetVersion", "imagePath", "width", "height", "alt", "integrity",
  ]);
  assert.equal(manifest.entries[0].integrity, `sha256-${Buffer.from("a".repeat(64), "hex").toString("base64")}`);
  assert.equal(Object.isFrozen(manifest.entries[0]), true);
});

test("T-005 F-016 rejects unsafe character paths, hashes, art constraints, and alt claims", () => {
  const cases = [
    ["external path", (rows) => { rows[0].delivery_webp_path = "https://example.invalid/cat.webp"; }],
    ["uppercase hash", (rows) => { rows[0].delivery_sha256 = "A".repeat(64); }],
    ["short hash", (rows) => { rows[0].delivery_sha256 = "a".repeat(63); }],
    ["wrong dimensions", (rows) => { rows[0].width = 512; }],
    ["non-alpha art", (rows) => { rows[0].has_alpha = "false"; }],
    ["title claim in alt", (rows) => { rows[0].alt = "最高ランクの猫"; }],
    ["duplicate title mapping", (rows) => { rows[1].title_id = rows[0].title_id; }],
  ];

  for (const [, mutate] of cases) {
    const rows = validCharacterRows();
    mutate(rows);
    assert.throws(
      () => compileCharacterContent({ rows, titleProfiles: TitleProfileDefinitions }, CHARACTER_VERSION),
      expectContentError("CHARACTER_CONTENT_INVALID"),
    );
  }
});

test("T-005 F-016 separates character approval from compilation", () => {
  const pendingRows = validCharacterRows();
  pendingRows[0].art_review_status = "pending";
  pendingRows[0].status = "draft";
  assert.doesNotThrow(() => compileCharacterContent({ rows: pendingRows, titleProfiles: TitleProfileDefinitions }, CHARACTER_VERSION));
  assert.throws(() => assertCharacterReleaseEligible(pendingRows), expectContentError("CHARACTER_APPROVAL_PENDING"));
  assert.throws(() => assertCharacterReleaseEligible([]), expectContentError("CHARACTER_APPROVAL_PENDING"));
  assert.equal(assertCharacterReleaseEligible(validCharacterRows()), true);
});
