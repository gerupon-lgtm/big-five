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

const PRESENTATION_VERSION = "presentation-v2";
const CHARACTER_VERSION = "character-manifest-v1";

function validPresentationRows() {
  const definition = makeValidPresentationDefinitionSet(TitleProfileDefinitions, {
    schemaVersion: 2,
    version: PRESENTATION_VERSION,
  });
  return {
    sceneRows: definition.scenes.map(({ sceneId, label, iconId }, index) => ({
      scene_id: sceneId,
      presentation_definition_version: PRESENTATION_VERSION,
      display_order: index + 1,
      label,
      icon_id: iconId,
      status: "draft",
    })),
    paletteRows: definition.palettes.map(({ paletteId, label, baseColors, description }, index) => ({
      palette_id: paletteId,
      presentation_definition_version: PRESENTATION_VERSION,
      display_order: index + 1,
      label,
      primary_color: baseColors.primary,
      secondary_color: baseColors.secondary,
      accent_color: baseColors.accent,
      description,
      content_review_note: index === 0 ? "承認レビュー専用注記" : "",
      status: "draft",
    })),
    paletteUsageRows: definition.paletteUsageMappings.map(({ paletteId, roles, textCandidates }, index) => ({
      palette_id: paletteId,
      presentation_definition_version: PRESENTATION_VERSION,
      display_order: index + 1,
      background_source: roles.background.source,
      background_mix_with: roles.background.mixWith,
      background_mix_percent: roles.background.mixPercent,
      surface_source: roles.surface.source,
      surface_mix_with: roles.surface.mixWith,
      surface_mix_percent: roles.surface.mixPercent,
      accent_source: roles.accent.source,
      accent_mix_with: roles.accent.mixWith,
      accent_mix_percent: roles.accent.mixPercent,
      chart_source: roles.chart.source,
      chart_mix_with: roles.chart.mixWith,
      chart_mix_percent: roles.chart.mixPercent,
      text_candidate_1: textCandidates[0],
      text_candidate_2: textCandidates[1],
      status: "draft",
    })),
    fragranceRows: definition.fragrances.map(({ fragranceId, sceneId, familyId, accordLabel, description, disclaimerId }, index) => ({
      fragrance_id: fragranceId,
      presentation_definition_version: PRESENTATION_VERSION,
      display_order: index + 1,
      scene_id: sceneId,
      family_id: familyId,
      accord_label: accordLabel,
      description,
      disclaimer_id: disclaimerId,
      status: "draft",
    })),
    fragranceMaterialRows: definition.fragranceMaterials.map(({ materialId, displayName, materialKind }, index) => ({
      material_id: materialId,
      presentation_definition_version: PRESENTATION_VERSION,
      display_order: index + 1,
      display_name: displayName,
      material_kind: materialKind,
      status: "draft",
    })),
    fragranceMaterialExampleRows: definition.fragrances.flatMap(({ fragranceId, materialIds }) =>
      materialIds.map((materialId, index) => ({
        fragrance_id: fragranceId,
        material_id: materialId,
        presentation_definition_version: PRESENTATION_VERSION,
        display_order: index + 1,
        status: "draft",
      }))),
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

test("T-005 F-018 keeps palette authoring review notes outside the runtime definition", () => {
  const rows = validPresentationRows();
  const compiled = compilePresentationContent(rows, PRESENTATION_VERSION);

  assert.equal(Object.hasOwn(compiled.palettes[0], "contentReviewNote"), false);
  assert.equal(Object.hasOwn(compiled.palettes[0], "content_review_note"), false);
  assert.deepEqual(Object.keys(compiled.palettes[0]), [
    "paletteId",
    "version",
    "label",
    "baseColors",
    "description",
  ]);
});

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

function assertPresentationRejected(mutate) {
  const rows = validPresentationRows();
  mutate(rows);
  assert.throws(
    () => compilePresentationContent(rows, PRESENTATION_VERSION),
    expectContentError("PRESENTATION_CONTENT_INVALID"),
  );
}

test("T-005 F-018 Q-013 normalized CSVs compile to the exact presentation definition", () => {
  const compiled = compilePresentationContent(validPresentationRows(), PRESENTATION_VERSION);
  assert.deepEqual(compiled, makeValidPresentationDefinitionSet(TitleProfileDefinitions, {
    schemaVersion: 2,
    version: PRESENTATION_VERSION,
  }));
  assert.deepEqual(Object.keys(compiled), [
    "schemaVersion",
    "presentationDefinitionVersion",
    "scenes",
    "palettes",
    "paletteUsageMappings",
    "fragrances",
    "fragranceMaterials",
    "titleSelectors",
  ]);
  assert.equal(compiled.schemaVersion, 2);
  assert.equal(compiled.fragrances[0].materialIds.length >= 1, true);
  assert.equal(compiled.fragrances[0].materialIds.length <= 2, true);
  assert.deepEqual(compiled.scenes.map(({ iconId }) => iconId), [
    "aroma-pause", "aroma-reset", "aroma-quiet-focus",
  ]);
  assert.equal(compiled.fragrances[0].familyId, "floral");
  assert.equal(Object.isFrozen(compiled), true);
});

test("T-005 F-018 Q-013 schema 2 compiler rejects presentation-v1 as its expected version", () => {
  const rows = validPresentationRows();
  for (const rowSetName of [
    "sceneRows",
    "paletteRows",
    "paletteUsageRows",
    "fragranceRows",
    "fragranceMaterialRows",
    "fragranceMaterialExampleRows",
    "selectorRows",
  ]) {
    rows[rowSetName].forEach((row) => {
      row.presentation_definition_version = "presentation-v1";
    });
  }
  assert.throws(
    () => compilePresentationContent(rows, "presentation-v1"),
    expectContentError("PRESENTATION_CONTENT_INVALID"),
  );
});

test("T-005 F-018 Q-013 fragrance material relation order is canonical and independent of library order", () => {
  const rows = validPresentationRows();
  const first = rows.fragranceMaterialExampleRows[0];
  const second = rows.fragranceMaterialExampleRows[1];
  [first.material_id, second.material_id] = [second.material_id, first.material_id];

  const compiled = compilePresentationContent(rows, PRESENTATION_VERSION);
  assert.deepEqual(compiled.fragrances[0].materialIds, [first.material_id, second.material_id]);
});

test("T-005 F-018 Q-013 graph invariants allow shared palette, fragrance, and material records", () => {
  const rows = validPresentationRows();
  const sharedPaletteIds = ["palette-shared-a", "palette-shared-b"];
  rows.paletteRows = rows.paletteRows.slice(0, 3);
  rows.paletteUsageRows = rows.paletteUsageRows.slice(0, 3);
  sharedPaletteIds.forEach((paletteId, index) => {
    rows.paletteRows[index + 1].palette_id = paletteId;
    rows.paletteUsageRows[index + 1].palette_id = paletteId;
  });
  rows.selectorPaletteRows.forEach((row) => {
    row.palette_id = sharedPaletteIds[row.display_order - 1];
  });

  const sharedFragranceIdsByScene = new Map();
  for (const row of rows.selectorFragranceRows.slice(0, 6)) {
    if (!sharedFragranceIdsByScene.has(row.scene_id)) sharedFragranceIdsByScene.set(row.scene_id, []);
    sharedFragranceIdsByScene.get(row.scene_id).push(row.fragrance_id);
  }
  rows.selectorFragranceRows.forEach((row) => {
    row.fragrance_id = sharedFragranceIdsByScene.get(row.scene_id)[row.display_order - 1];
    row.share_selected = String(row.display_order === 1);
  });
  rows.fragranceRows = rows.fragranceRows.slice(0, 6);
  rows.fragranceMaterialExampleRows = rows.fragranceMaterialExampleRows.slice(0, 12);
  rows.fragranceMaterialRows = rows.fragranceMaterialRows.slice(0, 12);

  const compiled = compilePresentationContent(rows, PRESENTATION_VERSION);
  assert.equal(compiled.palettes.length, 3);
  assert.equal(compiled.fragrances.length, 6);
  assert.equal(compiled.fragranceMaterials.length, 12);
});

test("T-005 F-018 rejects incomplete, unordered, orphaned, and unsafe normalized presentation rows", () => {
  const cases = [
    ["missing scene", (rows) => rows.sceneRows.pop()],
    ["unknown scene icon", (rows) => { rows.sceneRows[0].icon_id = "aroma-missing"; }],
    ["unknown fragrance family", (rows) => { rows.fragranceRows[0].family_id = "missing"; }],
    ["duplicate palette usage order", (rows) => { rows.paletteUsageRows[1].display_order = 1; }],
    ["palette mapping order mismatch", (rows) => {
      [rows.paletteUsageRows[0].display_order, rows.paletteUsageRows[1].display_order] =
        [rows.paletteUsageRows[1].display_order, rows.paletteUsageRows[0].display_order];
    }],
    ["non-uppercase palette HEX", (rows) => { rows.paletteRows[0].secondary_color = "#abcdef"; }],
    ["nonzero none mix", (rows) => { rows.paletteUsageRows[0].accent_mix_percent = 1; }],
    ["mix over 100 percent", (rows) => { rows.paletteUsageRows[0].chart_mix_percent = 101; }],
    ["duplicate text candidates", (rows) => { rows.paletteUsageRows[0].text_candidate_2 = rows.paletteUsageRows[0].text_candidate_1; }],
    ["orphan palette", (rows) => { rows.selectorPaletteRows[0].palette_id = "palette-missing"; }],
    ["orphan material", (rows) => { rows.fragranceMaterialExampleRows[0].material_id = "material-missing"; }],
    ["extra alternative", (rows) => rows.selectorPaletteRows.push({ ...rows.selectorPaletteRows[0], palette_id: "palette-default", display_order: 3 })],
    ["unsafe fragrance copy", (rows) => { rows.fragranceRows[0].description = "Use 2 drops in a diffuser."; }],
    ["duplicate title selector", (rows) => { rows.selectorRows[1].title_id = rows.selectorRows[0].title_id; }],
    ["wrong version", (rows) => { rows.paletteRows[0].presentation_definition_version = "presentation-v1"; }],
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

test("T-005 F-018 rejects an invalid count in each normalized presentation input set", () => {
  for (const rowSetName of [
    "sceneRows",
    "paletteRows",
    "paletteUsageRows",
    "fragranceRows",
    "fragranceMaterialRows",
    "fragranceMaterialExampleRows",
    "selectorRows",
    "selectorPaletteRows",
    "selectorFragranceRows",
  ]) {
    assertPresentationRejected((rows) => rows[rowSetName].pop());
  }
});

test("T-005 F-018 rejects duplicate relation-group orders and selector-fragrance orphans", () => {
  const cases = [
    ["palette usage order", (rows) => { rows.paletteUsageRows[1].display_order = 1; }],
    ["selector palette order", (rows) => { rows.selectorPaletteRows[1].display_order = 1; }],
    ["selector fragrance order", (rows) => { rows.selectorFragranceRows[1].display_order = 1; }],
    ["selector fragrance parent", (rows) => { rows.selectorFragranceRows[0].title_id = "title-missing"; }],
    ["selector fragrance child", (rows) => { rows.selectorFragranceRows[0].fragrance_id = "fragrance-pause-missing"; }],
    ["selector fragrance unknown scene", (rows) => {
      rows.selectorFragranceRows.push({
        ...rows.selectorFragranceRows[0],
        scene_id: "unknown-scene",
      });
    }],
    ["fragrance material order", (rows) => { rows.fragranceMaterialExampleRows[1].display_order = 1; }],
  ];
  for (const [, mutate] of cases) assertPresentationRejected(mutate);
});

test("T-005 F-018 rejects relation cardinality violations without changing global row counts", () => {
  const cases = [
    ["one mapping per palette", (rows) => { rows.paletteUsageRows[0].palette_id = rows.paletteUsageRows[1].palette_id; }],
    ["two selector palettes", (rows) => { rows.selectorPaletteRows[0].title_id = rows.selectorPaletteRows[2].title_id; }],
    ["three fragrance scenes", (rows) => {
      rows.selectorFragranceRows[0].title_id = rows.selectorFragranceRows[6].title_id;
      rows.selectorFragranceRows[1].title_id = rows.selectorFragranceRows[6].title_id;
    }],
    ["two fragrance candidates", (rows) => { rows.selectorFragranceRows[0].title_id = rows.selectorFragranceRows[6].title_id; }],
    ["one shared fragrance", (rows) => { rows.selectorFragranceRows[0].share_selected = "false"; }],
    ["one to two materials", (rows) => {
      rows.fragranceMaterialExampleRows[0].fragrance_id = rows.fragranceMaterialExampleRows[2].fragrance_id;
    }],
  ];
  for (const [, mutate] of cases) assertPresentationRejected(mutate);
});

test("T-005 F-018 rejects version mismatches in every versioned presentation catalog", () => {
  const cases = [
    (rows) => { rows.sceneRows[0].presentation_definition_version = "presentation-v1"; },
    (rows) => { rows.paletteRows[0].presentation_definition_version = "presentation-v1"; },
    (rows) => { rows.paletteUsageRows[0].presentation_definition_version = "presentation-v1"; },
    (rows) => { rows.fragranceRows[0].presentation_definition_version = "presentation-v1"; },
    (rows) => { rows.fragranceMaterialRows[0].presentation_definition_version = "presentation-v1"; },
    (rows) => { rows.fragranceMaterialExampleRows[0].presentation_definition_version = "presentation-v1"; },
    (rows) => { rows.selectorRows[0].presentation_definition_version = "presentation-v1"; },
  ];
  for (const mutate of cases) assertPresentationRejected(mutate);
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

test("T-005 F-016 rejects Japanese and English title, personality, ability, rank, and breed claims in alt text", () => {
  const prohibitedClaims = [
    "第1位の猫",
    "賢い猫",
    "特別な称号の猫",
    "外交的なタイプの猫",
    "明るい性格の猫",
    "優れた人格の猫",
    "能力が高い猫",
    "才能ある猫",
    "知性の高い猫",
    "頭が良い猫",
    "順位が高い猫",
    "一位の猫",
    "トップの猫",
    "最上の猫",
    "優秀な猫",
    "他より劣る猫",
    "特定の猫種の猫",
    "特定の品種の猫",
    "smart cat",
    "intelligent cat",
    "best cat",
    "worst cat",
    "first place cat",
    "number one cat",
    "No.1 cat",
    "No 1 cat",
    "#1 cat",
    "1st place cat",
    "top cat",
    "top-ranked cat",
    "the highest ranked cat",
    "the lowest ranked cat",
  ];
  for (const alt of prohibitedClaims) {
    const rows = validCharacterRows();
    rows[0].alt = alt;
    assert.throws(
      () => compileCharacterContent({ rows, titleProfiles: TitleProfileDefinitions }, CHARACTER_VERSION),
      expectContentError("CHARACTER_CONTENT_INVALID"),
      alt,
    );
  }

  for (const alt of ["前足をそろえて座る猫", "青い首輪を付けて左を見る猫", "A seated cat looking left"]) {
    const rows = validCharacterRows();
    rows[0].alt = alt;
    assert.doesNotThrow(
      () => compileCharacterContent({ rows, titleProfiles: TitleProfileDefinitions }, CHARACTER_VERSION),
      alt,
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
  const nonAlphaRows = validCharacterRows();
  nonAlphaRows[0].has_alpha = "false";
  assert.throws(() => assertCharacterReleaseEligible(nonAlphaRows), expectContentError("CHARACTER_APPROVAL_PENDING"));
  assert.equal(assertCharacterReleaseEligible(validCharacterRows()), true);
});

test("T-005 F-016/F-018 convert malformed compiler roots to stable content errors", () => {
  for (const root of [undefined, null]) {
    assert.throws(
      () => compilePresentationContent(root, PRESENTATION_VERSION),
      expectContentError("PRESENTATION_CONTENT_INVALID"),
    );
    assert.throws(
      () => compileCharacterContent(root, CHARACTER_VERSION),
      expectContentError("CHARACTER_CONTENT_INVALID"),
    );
  }
});
