import { readFile } from "node:fs/promises";
import { TitleProfileDefinitions } from "../../app/js/data/title-profile-definitions.js";
import {
  validateCharacterLedger,
  validateLedgerScope,
} from "./character-contract.mjs";

const scope = process.argv[2] ?? "brief";
const ledger = JSON.parse(await readFile(
  new URL("../../docs/assets/character-production/ledger.json", import.meta.url),
  "utf8",
));
validateLedgerScope(
  validateCharacterLedger(ledger, TitleProfileDefinitions),
  scope,
);
console.log(`character ledger ${scope}: PASS`);
