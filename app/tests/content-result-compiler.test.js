import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { appMeta } from "../js/config/app-meta.js";
import { FACTOR_ORDER as CONFIG_FACTOR_ORDER } from "../js/config/factor-order.js";
import { FACTOR_ORDER as DATA_FACTOR_ORDER } from "../js/data/factor-order.js";
import { ResultEvidenceDefinitions } from "../js/data/result-evidence-definitions.js";
import { ResultTextDefinitions } from "../js/data/result-text-definitions.js";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { validateTitleProfileDefinitions } from "../js/domain/title-profile.js";
import { validateResultContentDefinitions } from "../js/domain/definition-validator.js";
import { validateResultTextDefinitions } from "../js/domain/result-text.js";
import {
  assertReleaseEligible,
  compileResultContent,
} from "../../scripts/content/compile-result-content.mjs";

function validResultRows() {
  const profileRows = TitleProfileDefinitions.map((profile, index) => ({
    title_id: profile.titleId,
    title_rule_version: appMeta.diagnosticVersions.titleRuleVersion,
    display_order: index + 1,
    label: profile.label,
    kind: profile.kind,
    character_id: profile.characterId,
    summary_text_id: profile.summaryTextId,
    default_palette_id: profile.defaultPaletteId,
    status: "reviewed",
  }));
  const profileFactorRows = TitleProfileDefinitions.flatMap((profile, profileIndex) =>
    profile.factors.map((factor, factorIndex) => ({
      title_id: profile.titleId,
      display_order: factorIndex + 1,
      factor_id: factor.factorId,
      direction: factor.direction,
      status: "reviewed",
      source_order: profileIndex + 1,
    }))).map(({ source_order, ...row }) => row);
  const textRows = ResultTextDefinitions.map((definition, index) => ({
    text_id: definition.id,
    result_text_version: definition.version,
    display_order: index + 1,
    section: definition.section,
    claim_kind: definition.claimKind,
    mode: definition.appliesTo.mode ?? "",
    factor_id: definition.appliesTo.factorId ?? "",
    band: definition.appliesTo.band ?? "",
    title_id: definition.appliesTo.titleId ?? "",
    preview_allowed: String(definition.previewAllowed),
    text: definition.text,
    status: "reviewed",
  }));
  const textEvidenceRows = ResultTextDefinitions.flatMap((definition) =>
    definition.evidenceRefs.map((evidenceId, index) => ({
      text_id: definition.id,
      display_order: index + 1,
      evidence_id: evidenceId,
      status: "reviewed",
    })));
  const evidenceRows = ResultEvidenceDefinitions.map((definition, index) => ({
    evidence_id: definition.evidenceId,
    result_evidence_version: definition.version,
    display_order: index + 1,
    source_type: definition.sourceType,
    source_label: definition.sourceLabel,
    locator: definition.locator,
    status: "reviewed",
  }));
  const evidenceClaimRows = ResultEvidenceDefinitions.flatMap((definition) =>
    definition.supportedClaims.map((claim, index) => ({
      evidence_id: definition.evidenceId,
      display_order: index + 1,
      supported_claim: claim,
      status: "reviewed",
    })));
  return {
    profileRows,
    profileFactorRows,
    textRows,
    textEvidenceRows,
    evidenceRows,
    evidenceClaimRows,
    titleRuleVersion: appMeta.diagnosticVersions.titleRuleVersion,
    resultTextVersion: appMeta.diagnosticVersions.resultTextVersion,
  };
}

function assertCompileInvalid(rows) {
  assert.throws(
    () => compileResultContent(rows),
    (error) => error.code === "RESULT_CONTENT_INVALID",
  );
}

test("Q-006 title profile domain uses the config factor order authority", async () => {
  assert.deepEqual(CONFIG_FACTOR_ORDER, DATA_FACTOR_ORDER);
  const source = await readFile(new URL("../js/domain/title-profile.js", import.meta.url), "utf8");
  assert.match(source, /config\/factor-order\.js/);
  assert.doesNotMatch(source, /data\/factor-order\.js/);
});

test("Q-006 CSV compiler preserves 51 titles and 237 result literals", () => {
  const compiled = compileResultContent(validResultRows());

  assert.equal(compiled.titleProfiles.length, 51);
  assert.equal(compiled.textDefinitions.length, 237);
  assert.equal(compiled.evidenceDefinitions.length, 6);
  assert.equal(validateTitleProfileDefinitions(compiled.titleProfiles), compiled.titleProfiles);
  assert.equal(validateResultTextDefinitions(compiled.textDefinitions), compiled.textDefinitions);
  assert.equal(validateResultContentDefinitions(compiled), true);
  assert.deepEqual(compiled.titleProfiles, TitleProfileDefinitions);
  assert.deepEqual(compiled.textDefinitions, ResultTextDefinitions);
  assert.deepEqual(compiled.evidenceDefinitions, ResultEvidenceDefinitions);
});

test("Q-006 CSV compiler uses display_order for every projection and relation", () => {
  const rows = validResultRows();
  rows.profileRows.reverse();
  rows.textRows.reverse();
  rows.evidenceRows.reverse();
  rows.textEvidenceRows.reverse();
  rows.evidenceClaimRows.reverse();

  const compiled = compileResultContent(rows);

  assert.deepEqual(compiled.titleProfiles, TitleProfileDefinitions);
  assert.deepEqual(compiled.textDefinitions, ResultTextDefinitions);
  assert.deepEqual(compiled.evidenceDefinitions, ResultEvidenceDefinitions);
});

test("Q-006 CSV compiler accepts reviewed authoring rows but release gate requires approvals", () => {
  const rows = validResultRows();
  assert.equal(compileResultContent(rows).resultTextVersion, "result-text-v1");
  assert.throws(
    () => assertReleaseEligible({ rows: rows.textRows, approvals: { "E-0": "approved", "E-1": "draft" } }),
    (error) => error.code === "CONTENT_APPROVAL_PENDING",
  );
  assert.equal(
    assertReleaseEligible({
      rows: rows.textRows.map((row) => ({ ...row, status: "approved" })),
      approvals: Object.fromEntries([
        ...Array.from({ length: 6 }, (_, index) => `E-${index}`),
        ...Array.from({ length: 5 }, (_, index) => `T-${index}`),
        ...Array.from({ length: 5 }, (_, index) => `F-${index + 1}`),
        "X-1",
        "X-2",
      ].map((gate) => [gate, "approved"])),
    }),
    true,
  );
});

test("Q-006 CSV compiler rejects an unknown evidence relation", () => {
  const rows = validResultRows();
  rows.textEvidenceRows[0].evidence_id = "evidence-unknown";

  assert.throws(
    () => compileResultContent(rows),
    (error) => error.code === "RESULT_CONTENT_INVALID",
  );
});

test("Q-006 CSV compiler rejects wrong catalog counts", () => {
  const fiftyProfiles = validResultRows();
  fiftyProfiles.profileRows.pop();
  assertCompileInvalid(fiftyProfiles);

  const twoHundredThirtyEightTexts = validResultRows();
  twoHundredThirtyEightTexts.textRows.push({ ...twoHundredThirtyEightTexts.textRows[0], display_order: 238 });
  assertCompileInvalid(twoHundredThirtyEightTexts);
});

test("Q-006 CSV compiler rejects blank wildcard applicability", () => {
  const rows = validResultRows();
  const factorText = rows.textRows.find(({ section }) => section === "strength");
  factorText.factor_id = "";
  assertCompileInvalid(rows);
});

test("Q-006 CSV compiler rejects duplicate relations and unknown parents", () => {
  const duplicate = validResultRows();
  const relationIndex = duplicate.textEvidenceRows.findIndex((row, index, all) =>
    index > 0 && all[index - 1].text_id === row.text_id);
  duplicate.textEvidenceRows[relationIndex].evidence_id = duplicate.textEvidenceRows[relationIndex - 1].evidence_id;
  assertCompileInvalid(duplicate);

  const unknownTitle = validResultRows();
  unknownTitle.profileFactorRows[0].title_id = "title-unknown";
  assertCompileInvalid(unknownTitle);

  const unknownFactor = validResultRows();
  unknownFactor.profileFactorRows[0].factor_id = "unknown-factor";
  assertCompileInvalid(unknownFactor);
});

test("Q-006 CSV compiler rejects noncanonical profile factor order", () => {
  const rows = validResultRows();
  const pairTitleId = rows.profileRows.find(({ kind }) => kind === "pair").title_id;
  const factors = rows.profileFactorRows.filter(({ title_id }) => title_id === pairTitleId);
  [factors[0].display_order, factors[1].display_order] = [factors[1].display_order, factors[0].display_order];
  assertCompileInvalid(rows);
});

test("Q-006 CSV compiler rejects title rule version mismatches", () => {
  const rows = validResultRows();
  rows.profileRows[0].title_rule_version = "title-rule-v2";
  assertCompileInvalid(rows);
});

test("Q-006 CSV compiler rejects broken summary text references", () => {
  const rows = validResultRows();
  rows.profileRows[0].summary_text_id = "result-text-unknown";
  assertCompileInvalid(rows);
});

test("Q-006 CSV compiler rejects prohibited result and title copy", () => {
  for (const copy of [
    "ability", "superiority", "suitability", "compatibility", "diagnosis", "rank",
    "treatment", "improvement", "product", "essential-oil", "aroma", "ingestion",
    "application", "diffuser-use",
  ]) {
    const resultCopy = validResultRows();
    resultCopy.textRows[0].text = copy;
    assertCompileInvalid(resultCopy);
  }

  const titleCopy = validResultRows();
  titleCopy.profileRows[0].label = "ability";
  assertCompileInvalid(titleCopy);
});
