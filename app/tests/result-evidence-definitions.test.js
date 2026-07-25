import test from "node:test";
import assert from "node:assert/strict";
import { ResultEvidenceDefinitions } from "../js/data/result-evidence-definitions.js";

test("Q-006 evidence ledger exposes the six fixed authority entries", () => {
  assert.deepEqual(
    ResultEvidenceDefinitions.map(({ evidenceId }) => evidenceId),
    [
      "evidence-ipip-japanese-markers",
      "evidence-ipip-50-item-scale",
      "evidence-mini-ipip-selection",
      "evidence-ipip-permission",
      "evidence-title-rule-v1",
      "evidence-result-presentation-contract",
    ],
  );
  assert.ok(ResultEvidenceDefinitions.every(({ version }) => version === "result-evidence-v1"));
});
