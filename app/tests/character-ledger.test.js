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
