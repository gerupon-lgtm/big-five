import test from "node:test";
import assert from "node:assert/strict";

import { appMeta } from "../js/config/app-meta.js";
import { CharacterManifest } from "../js/data/character-manifest.js";
import { QuestionDefinitions } from "../js/data/diagnostic-definition.js";
import { ResultTextDefinitions } from "../js/data/result-text-definitions.js";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { createVersionTuple } from "../js/domain/response-state.js";
import { createDiagnosticResultSnapshot } from "../js/domain/diagnostic-result.js";

const VERSION_TUPLE = createVersionTuple(appMeta);
const COMPLETED_AT = "2026-07-27T12:00:00+09:00";
const RESULT_ID = "123e4567-e89b-42d3-a456-426614174000";

function answersFor(questionCount) {
  return Object.fromEntries(QuestionDefinitions.slice(0, questionCount).map(({ id }) => [id, 3]));
}

function inputFor({ questionCount = 20, ...overrides } = {}) {
  return {
    answers: answersFor(questionCount),
    questionCount,
    mode: questionCount === 20 ? "preview20" : "detail50",
    resultId: RESULT_ID,
    completedAt: COMPLETED_AT,
    versionTuple: { ...VERSION_TUPLE },
    questionDefinitions: QuestionDefinitions,
    titleProfiles: TitleProfileDefinitions,
    resultTextDefinitions: ResultTextDefinitions,
    resultTextVersion: VERSION_TUPLE.resultTextVersion,
    characterManifest: CharacterManifest,
    cardTemplateVersion: VERSION_TUPLE.cardTemplateVersion,
    ...overrides,
  };
}

function containsAnswers(value, seen = new Set()) {
  if (value === null || typeof value !== "object" || seen.has(value)) return false;
  seen.add(value);
  return Reflect.ownKeys(value).some((key) => key === "answers" || containsAnswers(value[key], seen));
}

test("T-005 F-005 preview completion produces the all-middle snapshot without retaining answers", () => {
  const snapshot = createDiagnosticResultSnapshot(inputFor());

  assert.equal(snapshot.mode, "preview20");
  assert.equal(snapshot.questionCount, 20);
  assert.equal(snapshot.factors.length, 5);
  assert.equal(snapshot.renderedTexts.length, 7);
  assert.equal(snapshot.selectedPaletteId, "palette-default");
  assert.equal(snapshot.characterAssetVersion, "character-balanced-v1");
  assert.equal(containsAnswers(snapshot), false);
});

test("T-005 F-005 detail completion produces all 42 rendered texts", () => {
  const snapshot = createDiagnosticResultSnapshot(inputFor({ questionCount: 50 }));

  assert.equal(snapshot.mode, "detail50");
  assert.equal(snapshot.questionCount, 50);
  assert.equal(snapshot.factors.length, 5);
  assert.equal(snapshot.renderedTexts.length, 42);
});

test("T-005 F-006 completion preserves caller identity, completion time, versions, and card template", () => {
  const versionTuple = { ...VERSION_TUPLE };
  const snapshot = createDiagnosticResultSnapshot(inputFor({ versionTuple }));

  assert.equal(snapshot.resultId, RESULT_ID);
  assert.equal(snapshot.completedAt, COMPLETED_AT);
  assert.deepEqual(snapshot.versionTuple, versionTuple);
  assert.equal(snapshot.cardTemplateVersion, VERSION_TUPLE.cardTemplateVersion);
});

test("T-005 F-005 normalizes invalid completion inputs", () => {
  const incomplete = answersFor(20);
  delete incomplete[QuestionDefinitions[0].id];
  const extra = { ...answersFor(20), extra: 3 };
  const swappedProfiles = structuredClone(TitleProfileDefinitions);
  [swappedProfiles[0].characterId, swappedProfiles[1].characterId] = [
    swappedProfiles[1].characterId,
    swappedProfiles[0].characterId,
  ];
  const missingCharacterManifest = structuredClone(CharacterManifest);
  missingCharacterManifest.entries = missingCharacterManifest.entries.filter(
    ({ characterId }) => characterId !== "character-balanced",
  );
  const malformedManifest = { ...CharacterManifest, entries: "invalid" };

  const invalidInputs = [
    inputFor({ mode: "detail50" }),
    inputFor({ answers: incomplete }),
    inputFor({ answers: extra }),
    { ...inputFor(), unknown: true },
    inputFor({ titleProfiles: swappedProfiles }),
    inputFor({ characterManifest: missingCharacterManifest }),
    inputFor({ characterManifest: malformedManifest }),
    inputFor({ resultId: "not-a-uuid" }),
    inputFor({ completedAt: "not-a-time" }),
    inputFor({ versionTuple: { ...VERSION_TUPLE, appVersion: "" } }),
  ];

  for (const invalidInput of invalidInputs) {
    assert.throws(() => createDiagnosticResultSnapshot(invalidInput), /DIAGNOSTIC_RESULT_INVALID/);
  }
});

test("T-005 F-005 completion does not mutate answers or source definition arrays", () => {
  const answers = answersFor(20);
  const questionDefinitions = [...QuestionDefinitions];
  const titleProfiles = [...TitleProfileDefinitions];
  const resultTextDefinitions = [...ResultTextDefinitions];
  const characterEntries = [...CharacterManifest.entries];
  const before = structuredClone({ answers, questionDefinitions, titleProfiles, resultTextDefinitions, characterEntries });

  createDiagnosticResultSnapshot(inputFor({
    answers,
    questionDefinitions,
    titleProfiles,
    resultTextDefinitions,
    characterManifest: { ...CharacterManifest, entries: characterEntries },
  }));

  assert.deepEqual({ answers, questionDefinitions, titleProfiles, resultTextDefinitions, characterEntries }, before);
});

test("T-005 F-005 completion does not freeze or alter caller-owned character manifest descriptors", () => {
  const characterManifest = structuredClone(CharacterManifest);
  const entry = characterManifest.entries[0];
  const before = structuredClone(characterManifest);
  const rootDescriptors = Object.getOwnPropertyDescriptors(characterManifest);
  const entriesDescriptors = Object.getOwnPropertyDescriptors(characterManifest.entries);
  const entryDescriptors = Object.getOwnPropertyDescriptors(entry);

  createDiagnosticResultSnapshot(inputFor({ characterManifest }));

  assert.equal(Object.isFrozen(characterManifest), false);
  assert.equal(Object.isFrozen(characterManifest.entries), false);
  assert.equal(Object.isFrozen(entry), false);
  assert.deepEqual(Object.getOwnPropertyDescriptors(characterManifest), rootDescriptors);
  assert.deepEqual(Object.getOwnPropertyDescriptors(characterManifest.entries), entriesDescriptors);
  assert.deepEqual(Object.getOwnPropertyDescriptors(entry), entryDescriptors);
  assert.deepEqual(characterManifest, before);
});

test("T-005 F-005 rejects symbol and non-enumerable unknown own input fields", () => {
  const symbolUnknown = inputFor();
  symbolUnknown[Symbol("unknown")] = true;
  const hiddenUnknown = inputFor();
  Object.defineProperty(hiddenUnknown, "unknown", { value: true, enumerable: false });

  for (const invalidInput of [symbolUnknown, hiddenUnknown]) {
    assert.throws(() => createDiagnosticResultSnapshot(invalidInput), /DIAGNOSTIC_RESULT_INVALID/);
  }
});
