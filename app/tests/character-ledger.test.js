import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import {
  CHARACTER_LEDGER_FIELDS,
  validateCharacterLedger,
  validateLedgerScope,
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

function validateScope(candidate, scope) {
  return validateLedgerScope(
    validateCharacterLedger(candidate, TitleProfileDefinitions),
    scope,
  );
}

function approvedPilotLedger() {
  const candidate = structuredClone(ledger);
  for (const entry of candidate.entries.slice(0, 3)) {
    entry.productionStatus = "art-approved";
    entry.sourcePngPath = `docs/assets/character-production/source-png/${entry.characterId}.png`;
    entry.sourceSha256 = `sha256-${"a".repeat(43)}=`;
    entry.artReviewStatus = "approved";
    entry.anatomyReviewStatus = "approved";
    entry.approvedBy = "reviewer";
    entry.approvedAt = "2026-07-26T00:00:00.000Z";
  }
  return candidate;
}

function technicallyApprovedPilotLedger() {
  const candidate = approvedPilotLedger();
  for (const entry of candidate.entries.slice(0, 3)) {
    entry.productionStatus = "technical-approved";
    entry.deliveryWebpPath = `app/assets/characters/${entry.characterId}.webp`;
    entry.deliverySha256 = `sha256-${"b".repeat(43)}=`;
    entry.width = 1024;
    entry.height = 1024;
    entry.byteLength = 1234;
    entry.webpEncoder = "sharp@0.34.0";
    entry.webpSettings = "quality=82;alpha=100;effort=6;metadata=none";
    entry.technicalReviewStatus = "approved";
  }
  return candidate;
}

test("T-005 F-016 brief gate rejects premature production evidence", () => {
  const mutations = [
    ["sourcePngPath", "docs/assets/character-production/source-png/character-balanced.png"],
    ["sourceSha256", `sha256-${"a".repeat(43)}=`],
    ["artReviewStatus", "approved"],
    ["approvedBy", "reviewer"],
    ["approvedAt", "2026-07-26T00:00:00.000Z"],
  ];

  for (const [field, value] of mutations) {
    const candidate = structuredClone(ledger);
    candidate.entries[0][field] = value;
    assert.throws(
      () => validateScope(candidate, "brief"),
      /CHARACTER_LEDGER_INVALID/,
      `brief must reject premature ${field}`,
    );
  }
});

test("T-005 F-016 reached gates reject empty required evidence", () => {
  for (const field of ["sourcePngPath", "sourceSha256", "approvedBy", "approvedAt"]) {
    const candidate = approvedPilotLedger();
    candidate.entries[0][field] = "";
    assert.throws(
      () => validateScope(candidate, "pilot"),
      /CHARACTER_LEDGER_INVALID/,
      `pilot must reject empty ${field}`,
    );
  }

  for (const field of ["deliveryWebpPath", "deliverySha256", "webpEncoder", "webpSettings"]) {
    const candidate = technicallyApprovedPilotLedger();
    candidate.entries[0][field] = "";
    assert.throws(
      () => validateScope(candidate, "pilot-converted"),
      /CHARACTER_LEDGER_INVALID/,
      `pilot-converted must reject empty ${field}`,
    );
  }
});
