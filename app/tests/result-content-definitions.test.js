import test from "node:test";
import assert from "node:assert/strict";

import { validateResultEvidenceDefinitions } from "../js/domain/result-evidence.js";
import {
  RESULT_CLAIM_KINDS,
  RESULT_TEXT_SECTIONS,
  validateResultTextDefinitions,
} from "../js/domain/result-text.js";
import { validateResultContentDefinitions } from "../js/domain/definition-validator.js";

const evidence = {
  evidenceId: "evidence-title-rule-v1",
  version: "result-evidence-v1",
  sourceType: "internal-contract",
  sourceLabel: "Title rule",
  locator: "docs/requirements/2026-07-20-big-five-self-understanding-requirements.md#831",
  supportedClaims: ["title-selection"],
};

const text = {
  id: "title-balanced-subtitle",
  version: "result-text-v1",
  appliesTo: { titleId: "title-balanced" },
  section: "titleSubtitle",
  claimKind: "entertainmentReason",
  text: "5因子がいずれも中間域にあるプロフィール",
  evidenceRefs: ["evidence-title-rule-v1"],
  previewAllowed: true,
};

const titleProfiles = [{ titleId: "title-balanced" }];

test("Q-006 schemas accept exact evidence and result text", () => {
  assert.equal(validateResultEvidenceDefinitions([evidence]).length, 1);
  assert.equal(validateResultTextDefinitions([text]).length, 1);
  assert.deepEqual(RESULT_TEXT_SECTIONS, [
    "titleSubtitle", "titleReason", "observation", "strength", "tradeoff",
    "work", "relationship", "stress", "question", "action",
  ]);
  assert.deepEqual(RESULT_CLAIM_KINDS, [
    "scaleObservation", "entertainmentReason", "reflectionPrompt", "actionHint",
  ]);
});

test("Q-006 schemas reject unknown fields and unsupported claim kinds", () => {
  assert.throws(
    () => validateResultEvidenceDefinitions([{ ...evidence, extra: true }]),
    /RESULT_EVIDENCE_DEFINITION_INVALID/,
  );
  assert.throws(
    () => validateResultTextDefinitions([{ ...text, claimKind: "abilityClaim" }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
});

test("Q-006 text schema requires the section-specific claim kind and preview-safe sections", () => {
  assert.throws(
    () => validateResultTextDefinitions([{ ...text, claimKind: "scaleObservation" }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
  assert.throws(
    () => validateResultTextDefinitions([{ ...text, section: "strength", claimKind: "scaleObservation", appliesTo: { mode: "preview20" } }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
  assert.throws(
    () => validateResultTextDefinitions([{ ...text, evidenceRefs: [evidence.evidenceId, evidence.evidenceId] }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
  assert.throws(
    () => validateResultTextDefinitions([{
      ...text,
      appliesTo: { factorId: "extraversion", band: "high" },
      section: "strength",
      claimKind: "scaleObservation",
      previewAllowed: true,
    }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
});

test("Q-006 cross-definition validation rejects unknown outer fields and broken references", () => {
  const valid = {
    evidenceDefinitions: [evidence],
    textDefinitions: [text],
    titleProfiles,
    resultTextVersion: "result-text-v1",
  };
  assert.equal(validateResultContentDefinitions(valid), true);
  assert.throws(
    () => validateResultContentDefinitions({ ...valid, extra: true }),
    /RESULT_CONTENT_INVALID/,
  );
  assert.throws(
    () => validateResultContentDefinitions({ ...valid, textDefinitions: [{ ...text, evidenceRefs: ["unknown"] }] }),
    /RESULT_CONTENT_INVALID/,
  );
  assert.throws(
    () => validateResultContentDefinitions({ ...valid, textDefinitions: [{ ...text, appliesTo: { titleId: "unknown" } }] }),
    /RESULT_CONTENT_INVALID/,
  );
});
