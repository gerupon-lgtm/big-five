import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import {
  auditFragranceVariation,
  FRAGRANCE_VARIATION_CODES,
  FRAGRANCE_VARIATION_LIMITS,
} from "../../scripts/content/audit-fragrance-variation.mjs";
import {
  loadPresentationReviewModel,
} from "../../scripts/content/render-presentation-review.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SOURCE_DIR = path.join(ROOT, "content/source");

function clone(value) {
  return structuredClone(value);
}

function fixture() {
  const scenes = [
    { sceneId: "pause", label: "Pause", iconId: "aroma-pause" },
    { sceneId: "reset", label: "Reset", iconId: "aroma-reset" },
    { sceneId: "quiet-focus", label: "Focus", iconId: "aroma-quiet-focus" },
  ];
  const families = ["floral", "woody", "citrus", "spicy", "herbal", "fresh"];
  const fragrances = [];
  const fragranceMaterials = [];
  for (const [sceneIndex, scene] of scenes.entries()) {
    for (let candidateIndex = 0; candidateIndex < 2; candidateIndex += 1) {
      const suffix = `${sceneIndex}-${candidateIndex}`;
      const materialId = `material-${suffix}`;
      fragranceMaterials.push({
        materialId,
        version: "presentation-v2",
        displayName: `素材${suffix}`,
        materialKind: "plant-name",
      });
      fragrances.push({
        fragranceId: `fragrance-${scene.sceneId}-${suffix}`,
        version: "presentation-v2",
        sceneId: scene.sceneId,
        familyId: families[sceneIndex * 2 + candidateIndex],
        accordLabel: `香調${suffix}`,
        description: `情景${suffix}`,
        materialIds: [materialId],
        disclaimerId: "disclaimer-aroma-symbolic",
      });
    }
  }
  return {
    schemaVersion: 2,
    presentationDefinitionVersion: "presentation-v2",
    scenes,
    palettes: [],
    paletteUsageMappings: [],
    fragrances,
    fragranceMaterials,
    titleSelectors: [{
      titleId: "title-1",
      alternativePaletteIds: [],
      fragranceScenes: scenes.map(({ sceneId }, sceneIndex) => ({
        sceneId,
        candidateFragranceIds: [
          fragrances[sceneIndex * 2].fragranceId,
          fragrances[sceneIndex * 2 + 1].fragranceId,
        ],
        shareFragranceId: fragrances[sceneIndex * 2].fragranceId,
      })),
    }],
  };
}

function codes(value) {
  return auditFragranceVariation(value).findings.map(({ code }) => code);
}

test("T-005 F-018 fragrance audit exports fixed limits and a deeply frozen report", () => {
  const report = auditFragranceVariation(fixture());
  assert.equal(report.valid, true);
  assert.deepEqual(report.findings, []);
  assert.equal(Object.isFrozen(report), true);
  assert.equal(Object.isFrozen(report.usage.fragrances[0]), true);
  assert.deepEqual(FRAGRANCE_VARIATION_CODES, [
    "FRAGRANCE_TITLE_MATERIAL_DUPLICATE",
    "FRAGRANCE_TITLE_SET_DUPLICATE",
    "FRAGRANCE_SCENE_FAMILY_DUPLICATE",
    "FRAGRANCE_SHARE_TRIPLE_OVERUSED",
    "FRAGRANCE_USAGE_OVER_LIMIT",
    "FRAGRANCE_SCENE_REUSE_OVER_LIMIT",
    "FRAGRANCE_SCENE_COPY_DUPLICATE",
    "FRAGRANCE_PROHIBITED_COPY",
    "FRAGRANCE_SHARE_COPY_OVERFLOW",
  ]);
  assert.deepEqual(FRAGRANCE_VARIATION_LIMITS, {
    shareTripleTitles: 3,
    candidateTitlesPerFragrance: 12,
    shareTitlesPerFragrance: 8,
    scenesPerMaterial: 2,
    shareMaterialCodePoints: 22,
    shareAccordCodePoints: 22,
  });
});

test("T-005 F-018 fragrance audit classifies the nine stable finding codes", () => {
  const materialDuplicate = fixture();
  materialDuplicate.fragrances[1].materialIds =
    [...materialDuplicate.fragrances[0].materialIds];
  assert.ok(codes(materialDuplicate).includes(
    "FRAGRANCE_TITLE_MATERIAL_DUPLICATE"));

  const setDuplicate = fixture();
  setDuplicate.titleSelectors.push({
    ...clone(setDuplicate.titleSelectors[0]),
    titleId: "title-2",
  });
  assert.ok(codes(setDuplicate).includes("FRAGRANCE_TITLE_SET_DUPLICATE"));

  const familyDuplicate = fixture();
  familyDuplicate.fragrances[1].familyId =
    familyDuplicate.fragrances[0].familyId;
  assert.ok(codes(familyDuplicate).includes(
    "FRAGRANCE_SCENE_FAMILY_DUPLICATE"));

  const tripleOveruse = fixture();
  for (let index = 2; index <= 4; index += 1) {
    tripleOveruse.titleSelectors.push({
      ...clone(tripleOveruse.titleSelectors[0]),
      titleId: `title-${index}`,
    });
  }
  assert.ok(codes(tripleOveruse).includes(
    "FRAGRANCE_SHARE_TRIPLE_OVERUSED"));

  const usageOver = fixture();
  for (let index = 2; index <= 13; index += 1) {
    usageOver.titleSelectors.push({
      ...clone(usageOver.titleSelectors[0]),
      titleId: `title-${index}`,
    });
  }
  assert.ok(codes(usageOver).includes("FRAGRANCE_USAGE_OVER_LIMIT"));

  const sceneReuse = fixture();
  sceneReuse.fragrances[2].materialIds =
    [...sceneReuse.fragrances[0].materialIds];
  sceneReuse.fragrances[4].materialIds =
    [...sceneReuse.fragrances[0].materialIds];
  assert.ok(codes(sceneReuse).includes(
    "FRAGRANCE_SCENE_REUSE_OVER_LIMIT"));

  const copyDuplicate = fixture();
  copyDuplicate.fragrances[2].accordLabel =
    copyDuplicate.fragrances[0].accordLabel;
  copyDuplicate.fragrances[2].description =
    copyDuplicate.fragrances[0].description;
  assert.ok(codes(copyDuplicate).includes(
    "FRAGRANCE_SCENE_COPY_DUPLICATE"));

  const prohibited = fixture();
  prohibited.fragrances[0].description = "治療に使う香り";
  assert.ok(codes(prohibited).includes("FRAGRANCE_PROHIBITED_COPY"));

  const overflow = fixture();
  overflow.fragrances[0].accordLabel = "あ".repeat(23);
  assert.ok(codes(overflow).includes("FRAGRANCE_SHARE_COPY_OVERFLOW"));
});

test("T-005 F-018 current draft passes every deterministic variation rule after rebalance", async () => {
  const model = await loadPresentationReviewModel({ sourceDir: SOURCE_DIR });
  const first = auditFragranceVariation(model.definitionSet);
  const second = auditFragranceVariation(model.definitionSet);
  assert.deepEqual(first, second);
  assert.deepEqual(first.findings, []);
  assert.equal(first.valid, true);
  assert.ok(first.usage.fragrances.every(({ candidateTitleCount, shareTitleCount }) =>
    Number.isInteger(candidateTitleCount) &&
    candidateTitleCount <= FRAGRANCE_VARIATION_LIMITS.candidateTitlesPerFragrance &&
    Number.isInteger(shareTitleCount) &&
    shareTitleCount <= FRAGRANCE_VARIATION_LIMITS.shareTitlesPerFragrance));
});
