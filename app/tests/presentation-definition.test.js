import test from "node:test";
import assert from "node:assert/strict";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import {
  validatePresentationDefinitionSet,
  lintPresentationCopy,
} from "../js/domain/presentation-definition-validator.js";
import { makeValidPresentationDefinitionSet } from "./fixtures/presentation-valid.fixture.js";
import { invalidPresentationCases } from "./fixtures/presentation-invalid.fixture.js";

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

for (const { name, mutate, error } of invalidPresentationCases) {
  test(`T-005 F-018 rejects ${name}`, () => {
    const value = structuredClone(makeValidPresentationDefinitionSet(TitleProfileDefinitions));
    mutate(value);
    assert.throws(
      () => validatePresentationDefinitionSet(value, {
        titleProfiles: TitleProfileDefinitions,
        expectedVersion: "presentation-v1",
      }),
      error,
    );
  });
}
