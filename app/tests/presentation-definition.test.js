import test from "node:test";
import assert from "node:assert/strict";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import {
  validatePresentationDefinitionSet,
  lintPresentationCopy,
} from "../js/domain/presentation-definition-validator.js";
import { makeValidPresentationDefinitionSet } from "./fixtures/presentation-valid.fixture.js";
import {
  invalidPresentationCases,
  invalidPresentationSchema2Cases,
} from "./fixtures/presentation-invalid.fixture.js";

test("T-005 F-018 validates the complete 51-title Q-013 graph", () => {
  const set = makeValidPresentationDefinitionSet(TitleProfileDefinitions);
  const validated = validatePresentationDefinitionSet(set, {
    titleProfiles: TitleProfileDefinitions,
    expectedVersion: "presentation-v1",
  });
  assert.equal(validated.titleSelectors.length, 51);
  assert.deepEqual(validated.scenes.map(({ sceneId }) => sceneId), [
    "pause", "reset", "quiet-focus",
  ]);
  assert.equal(lintPresentationCopy(validated).length, 0);
});

test("T-005 F-018 returns a recursively frozen definition graph", () => {
  const validated = validatePresentationDefinitionSet(makeValidPresentationDefinitionSet(TitleProfileDefinitions), {
    titleProfiles: TitleProfileDefinitions,
    expectedVersion: "presentation-v1",
  });
  assert.equal(Object.isFrozen(validated), true);
  assert.equal(Object.isFrozen(validated.palettes[0].baseColors), true);
  assert.equal(Object.isFrozen(validated.titleSelectors[0].fragranceScenes[0].candidateFragranceIds), true);
});

test("T-005 F-018 validates schema 2 usage mappings, materials, and ordered references", () => {
  const value = makeValidPresentationDefinitionSet(TitleProfileDefinitions, {
    schemaVersion: 2,
    version: "presentation-v2",
  });
  const validated = validatePresentationDefinitionSet(value, {
    titleProfiles: TitleProfileDefinitions,
    expectedVersion: "presentation-v2",
  });
  assert.equal(validated.schemaVersion, 2);
  assert.equal(validated.paletteUsageMappings.length, validated.palettes.length);
  assert.ok(validated.fragrances.every(({ materialIds }) => materialIds.length >= 1 && materialIds.length <= 3));
  assert.equal(Object.isFrozen(validated.fragranceMaterials[0]), true);
  assert.equal(lintPresentationCopy(validated).length, 0);
});

test("T-005 F-018 schema 2 preserves per-fragrance material order independently of the material catalog", () => {
  const value = makeValidPresentationDefinitionSet(TitleProfileDefinitions, {
    schemaVersion: 2,
    version: "presentation-v2",
  });
  value.fragrances[0].materialIds.reverse();
  const validated = validatePresentationDefinitionSet(value, {
    titleProfiles: TitleProfileDefinitions,
    expectedVersion: "presentation-v2",
  });
  assert.deepEqual(validated.fragrances[0].materialIds, value.fragrances[0].materialIds);
});

test("T-005 F-018 keeps schema 1 valid without schema 2 fields", () => {
  assert.doesNotThrow(() => validatePresentationDefinitionSet(
    makeValidPresentationDefinitionSet(TitleProfileDefinitions),
    { titleProfiles: TitleProfileDefinitions, expectedVersion: "presentation-v1" },
  ));
});

for (const { name, mutate, error, finding } of invalidPresentationCases) {
  test(`T-005 F-018 rejects ${name}`, () => {
    const value = structuredClone(makeValidPresentationDefinitionSet(TitleProfileDefinitions));
    mutate(value);
    if (finding) assert.deepEqual(lintPresentationCopy(value), [finding]);
    assert.throws(
      () => validatePresentationDefinitionSet(value, {
        titleProfiles: TitleProfileDefinitions,
        expectedVersion: "presentation-v1",
      }),
      error,
    );
  });
}

for (const { name, schemaVersion = 2, mutate, error, finding } of invalidPresentationSchema2Cases) {
  test(`T-005 F-018 rejects schema ${schemaVersion} ${name}`, () => {
    const value = structuredClone(makeValidPresentationDefinitionSet(TitleProfileDefinitions, {
      schemaVersion,
      version: schemaVersion === 2 ? "presentation-v2" : "presentation-v1",
    }));
    mutate(value);
    if (finding) assert.deepEqual(lintPresentationCopy(value), [finding]);
    assert.throws(
      () => validatePresentationDefinitionSet(value, {
        titleProfiles: TitleProfileDefinitions,
        expectedVersion: schemaVersion === 2 ? "presentation-v2" : "presentation-v1",
      }),
      error,
    );
  });
}
