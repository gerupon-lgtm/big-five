import test from "node:test";
import assert from "node:assert/strict";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { validatePresentationDefinitionSet } from "../js/domain/presentation-definition-validator.js";
import { selectPresentation } from "../js/domain/presentation-selector.js";
import { summarizeFragrances } from "../js/domain/share-fragrance-summary.js";
import { makeValidPresentationDefinitionSet } from "./fixtures/presentation-valid.fixture.js";

function validatedSchema2DefinitionSet() {
  return validatePresentationDefinitionSet(
    makeValidPresentationDefinitionSet(TitleProfileDefinitions, {
      schemaVersion: 2,
      version: "presentation-v2",
    }),
    {
      titleProfiles: TitleProfileDefinitions,
      expectedVersion: "presentation-v2",
    },
  );
}

test("T-005 F-018 selects the standard palette, ordered alternatives, and ordered fragrance scenes", () => {
  const definitionSet = validatedSchema2DefinitionSet();
  const titleProfile = TitleProfileDefinitions[0];
  const selector = definitionSet.titleSelectors[0];
  const selection = selectPresentation(titleProfile, definitionSet);

  assert.equal(selection.palettes.standard.paletteId, titleProfile.defaultPaletteId);
  assert.deepEqual(
    selection.palettes.alternatives.map(({ paletteId }) => paletteId),
    selector.alternativePaletteIds,
  );
  assert.deepEqual(
    selection.fragranceScenes.map(({ sceneId }) => sceneId),
    ["pause", "reset", "quiet-focus"],
  );
  for (const [index, scene] of selection.fragranceScenes.entries()) {
    assert.equal(scene.label, definitionSet.scenes[index].label);
    assert.deepEqual(
      scene.candidates.map(({ fragranceId }) => fragranceId),
      selector.fragranceScenes[index].candidateFragranceIds,
    );
    assert.equal(
      scene.shareRepresentative.fragranceId,
      selector.fragranceScenes[index].shareFragranceId,
    );
  }
  assert.equal(Object.isFrozen(selection), true);
  assert.equal(Object.isFrozen(selection.palettes.alternatives), true);
  assert.equal(Object.isFrozen(selection.fragranceScenes[0].candidates), true);
});

test("T-005 F-018 share summary exposes three accord labels and no material data", () => {
  const definitionSet = validatedSchema2DefinitionSet();
  const selection = selectPresentation(TitleProfileDefinitions[0], definitionSet);
  const summary = summarizeFragrances(selection.fragranceScenes);

  assert.equal(summary.length, 3);
  assert.deepEqual(Object.keys(summary[0]), ["sceneId", "label", "accordLabel"]);
  assert.deepEqual(
    summary.map(({ sceneId, accordLabel }) => ({ sceneId, accordLabel })),
    selection.fragranceScenes.map(({ sceneId, shareRepresentative }) => ({
      sceneId,
      accordLabel: shareRepresentative.accordLabel,
    })),
  );
  assert.doesNotMatch(JSON.stringify(summary), /materialId|displayName|Lavender/);
  assert.equal(Object.isFrozen(summary), true);
  assert.ok(summary.every(Object.isFrozen));
});

test("T-005 F-018 rejects version mismatch, duplicate palettes, and missing representatives", () => {
  const base = validatedSchema2DefinitionSet();
  const cases = [
    (value) => { value.presentationDefinitionVersion = "presentation-v1"; },
    (value) => {
      value.titleSelectors[0].alternativePaletteIds[0] =
        TitleProfileDefinitions[0].defaultPaletteId;
    },
    (value) => {
      value.titleSelectors[0].alternativePaletteIds[1] =
        value.titleSelectors[0].alternativePaletteIds[0];
    },
    (value) => {
      value.titleSelectors[0].fragranceScenes[0].shareFragranceId =
        "fragrance-pause-missing";
    },
  ];

  for (const mutate of cases) {
    const value = structuredClone(base);
    mutate(value);
    Object.freeze(value);
    assert.throws(
      () => selectPresentation(TitleProfileDefinitions[0], value),
      { name: "TypeError", message: "PRESENTATION_SELECTION_INVALID" },
    );
  }
});

test("T-005 F-018 rejects shallow-frozen schema 2 nested arrays and versions", () => {
  const base = validatedSchema2DefinitionSet();
  const shallowFrozen = structuredClone(base);
  Object.freeze(shallowFrozen);
  assert.throws(
    () => selectPresentation(TitleProfileDefinitions[0], shallowFrozen),
    { name: "TypeError", message: "PRESENTATION_SELECTION_INVALID" },
  );

  const cases = [
    (value) => { value.paletteUsageMappings[0].version = "presentation-v1"; },
    (value) => { value.fragranceMaterials[0].version = "presentation-v1"; },
    (value) => { value.paletteUsageMappings[0].roles.background.source = "text"; },
    (value) => { value.fragranceMaterials[0].displayName = ""; },
  ];

  for (const mutate of cases) {
    const value = structuredClone(base);
    mutate(value);
    recursivelyFreeze(value);
    assert.throws(
      () => selectPresentation(TitleProfileDefinitions[0], value),
      { name: "TypeError", message: "PRESENTATION_SELECTION_INVALID" },
    );
  }
});

test("T-005 F-018 rejects score, answer, character, and same-hue character inputs", () => {
  const definitionSet = validatedSchema2DefinitionSet();
  const titleProfile = TitleProfileDefinitions[0];

  for (const field of ["score", "answers", "character", "characterColor"]) {
    const pollutedProfile = { ...titleProfile, [field]: field === "score" ? 80 : {} };
    assert.throws(
      () => selectPresentation(pollutedProfile, definitionSet),
      { name: "TypeError", message: "PRESENTATION_SELECTION_INVALID" },
    );
  }
  assert.throws(
    () => selectPresentation(titleProfile, definitionSet, {
      character: { color: primaryColor(definitionSet.palettes[0]) },
    }),
    { name: "TypeError", message: "PRESENTATION_SELECTION_INVALID" },
  );
});

test("T-005 F-018 rejects invalid title factor shape and nested input contamination", () => {
  const definitionSet = validatedSchema2DefinitionSet();
  const singleProfile = TitleProfileDefinitions.find(({ kind }) => kind === "single");
  const pairProfile = TitleProfileDefinitions.find(({ kind }) => kind === "pair");
  const cases = [
    { ...singleProfile, factors: [{ ...singleProfile.factors[0], score: 80 }] },
    { ...singleProfile, factors: [{ ...singleProfile.factors[0], answers: {} }] },
    { ...singleProfile, factors: [{ ...singleProfile.factors[0], character: {} }] },
    { ...singleProfile, factors: [] },
    { ...singleProfile, factors: [{ factorId: "unknown", direction: "high" }] },
    { ...pairProfile, factors: [...pairProfile.factors].reverse() },
  ];

  for (const value of cases) {
    assert.throws(
      () => selectPresentation(value, definitionSet),
      { name: "TypeError", message: "PRESENTATION_SELECTION_INVALID" },
    );
  }
});

test("T-005 F-018 rejects malformed fragrance summaries", () => {
  const selection = selectPresentation(
    TitleProfileDefinitions[0],
    validatedSchema2DefinitionSet(),
  );
  const cases = [
    selection.fragranceScenes.slice(0, 2),
    [
      selection.fragranceScenes[0],
      selection.fragranceScenes[0],
      selection.fragranceScenes[2],
    ],
    [
      selection.fragranceScenes[1],
      selection.fragranceScenes[0],
      selection.fragranceScenes[2],
    ],
    selection.fragranceScenes.map((scene) => ({ ...scene, score: 1 })),
    selection.fragranceScenes.map((scene) => ({
      ...scene,
      shareRepresentative: { ...scene.shareRepresentative, accordLabel: "" },
    })),
  ];

  for (const value of cases) {
    assert.throws(
      () => summarizeFragrances(value),
      { name: "TypeError", message: "SHARE_FRAGRANCE_SUMMARY_INVALID" },
    );
  }
});

function primaryColor(palette) {
  return palette.baseColors.primary;
}

function recursivelyFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) recursivelyFreeze(nested);
  }
  return value;
}
