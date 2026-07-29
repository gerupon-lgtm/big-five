import assert from "node:assert/strict";
import test from "node:test";

import { selectShareableResultTexts } from "../js/domain/share-result-text.js";

function makeRecord(id, section, text) {
  return {
    id,
    version: "result-text-v2",
    section,
    text,
    evidenceRefs: [`evidence-${id}`],
  };
}

test("T-007 F-006 excludes title reflections from the future share candidate boundary", () => {
  const reflectionText = "共有してはいけない振り返り文";
  const input = [
    makeRecord("title-balanced-subtitle", "titleSubtitle", "バランス派"),
    makeRecord("title-balanced-reason", "titleReason", "称号理由"),
    makeRecord("title-reflection-balanced-1", "titleReflection", reflectionText),
    makeRecord("detail50-extraversion-middle-observation", "observation", "観察文"),
    makeRecord("title-reflection-balanced-2", "titleReflection", "非共有の二件目"),
  ];
  const before = structuredClone(input);

  const selected = selectShareableResultTexts(input);

  assert.deepEqual(input, before);
  assert.deepEqual(selected.map(({ id }) => id), [
    "title-balanced-subtitle",
    "title-balanced-reason",
    "detail50-extraversion-middle-observation",
  ]);
  assert.equal(selected.some(({ section }) => section === "titleReflection"), false);
  assert.doesNotMatch(JSON.stringify(selected), /title-reflection|共有してはいけない振り返り文|非共有の二件目/);
});

test("T-007 F-006 returns isolated deeply frozen records in deterministic source order", () => {
  const input = [
    makeRecord("first", "titleSubtitle", "一件目"),
    makeRecord("hidden", "titleReflection", "除外"),
    makeRecord("second", "observation", "二件目"),
  ];

  const first = selectShareableResultTexts(input);
  const second = selectShareableResultTexts(input);

  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  for (const record of first) {
    assert.equal(Object.isFrozen(record), true);
    assert.equal(Object.isFrozen(record.evidenceRefs), true);
  }
  assert.notStrictEqual(first[0], input[0]);
  assert.notStrictEqual(first[0].evidenceRefs, input[0].evidenceRefs);
  input[0].text = "後から変更";
  input[0].evidenceRefs.push("late-evidence");
  assert.equal(first[0].text, "一件目");
  assert.deepEqual(first[0].evidenceRefs, ["evidence-first"]);
});

test("T-007 F-006 rejects non-array input with the stable boundary error", () => {
  for (const input of [null, undefined, {}, "texts"]) {
    assert.throws(
      () => selectShareableResultTexts(input),
      { name: "TypeError", message: "INVALID_RESULT_TEXTS" },
    );
  }
});
