import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { validateResultEvidenceDefinitions } from "../js/domain/result-evidence.js";
import {
  RESULT_CLAIM_KINDS,
  RESULT_TEXT_SECTIONS,
  validateResultTextDefinitions,
} from "../js/domain/result-text.js";
import { validateResultContentDefinitions } from "../js/domain/definition-validator.js";
import { FACTOR_ORDER } from "../js/data/factor-order.js";
import { FactorResultTextDefinitions } from "../js/data/factor-result-text-definitions.js";
import { ResultEvidenceDefinitions } from "../js/data/result-evidence-definitions.js";
import { ResultTextDefinitions } from "../js/data/result-text-definitions.js";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { TitleResultTextDefinitions } from "../js/data/title-result-text-definitions.js";
import { Q006_TITLE_CATALOG } from "./fixtures/q006-title-catalog.fixture.js";

const BANDS = ["low", "middle", "high"];
const DETAIL_SECTIONS = [
  "observation", "strength", "tradeoff", "work",
  "relationship", "stress", "question", "action",
];
const SCALE_SECTIONS = new Set(["observation", "strength", "tradeoff"]);
const PROMPT_SECTIONS = new Set(["work", "relationship", "stress", "question", "action"]);

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

test("Q-006 title profiles match the approved 51-title catalog", () => {
  assert.equal(TitleProfileDefinitions.length, 51);
  assert.deepEqual(
    TitleProfileDefinitions.map(({ titleId, label }) => ({ titleId, label })),
    Q006_TITLE_CATALOG,
  );
});

test("every title has one subtitle and one reason", () => {
  assert.equal(TitleResultTextDefinitions.length, 102);
  for (const { titleId } of Q006_TITLE_CATALOG) {
    const sections = TitleResultTextDefinitions
      .filter(({ appliesTo }) => appliesTo.titleId === titleId)
      .map(({ section }) => section)
      .sort();
    assert.deepEqual(sections, ["titleReason", "titleSubtitle"]);
  }
});

test("factor content covers 5 factors, 3 bands, and both modes", () => {
  assert.equal(FactorResultTextDefinitions.length, 135);
  for (const factorId of FACTOR_ORDER) {
    for (const band of BANDS) {
      const preview = FactorResultTextDefinitions.filter(({ appliesTo }) =>
        appliesTo.mode === "preview20" &&
        appliesTo.factorId === factorId &&
        appliesTo.band === band);
      assert.deepEqual(preview.map(({ section }) => section), ["observation"]);

      const detail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
        appliesTo.mode === "detail50" &&
        appliesTo.factorId === factorId &&
        appliesTo.band === band);
      assert.deepEqual(detail.map(({ section }) => section), DETAIL_SECTIONS);
    }
  }
  assert.equal(ResultTextDefinitions.length, 237);
});

test("factor and aggregate content satisfy the result-content schemas", () => {
  assert.equal(
    validateResultTextDefinitions(FactorResultTextDefinitions),
    FactorResultTextDefinitions,
  );
  assert.equal(
    validateResultContentDefinitions({
      evidenceDefinitions: ResultEvidenceDefinitions,
      textDefinitions: ResultTextDefinitions,
      titleProfiles: TitleProfileDefinitions,
      resultTextVersion: "result-text-v1",
    }),
    true,
  );
  assert.deepEqual(
    ResultTextDefinitions.slice(0, TitleResultTextDefinitions.length),
    TitleResultTextDefinitions,
  );
  assert.deepEqual(
    ResultTextDefinitions.slice(TitleResultTextDefinitions.length),
    FactorResultTextDefinitions,
  );
});

test("20-question preview copy stays within the four-item observation contract", () => {
  const previewDefinitions = FactorResultTextDefinitions.filter(
    ({ appliesTo }) => appliesTo.mode === "preview20",
  );
  assert.equal(previewDefinitions.length, 15);
  for (const definition of previewDefinitions) {
    assert.equal(definition.appliesTo.questionCount, 20);
    assert.equal(definition.section, "observation");
    assert.equal(definition.claimKind, "scaleObservation");
    assert.equal(definition.previewAllowed, true);
    assert.match(definition.text, /^今回の20問では/);
    assert.doesNotMatch(
      definition.text,
      /仕事|職場|対人|人間関係|ストレス|強み|長所|弱み|短所|裏返り|行動|試して|してみ/,
    );
    assert.deepEqual(definition.evidenceRefs, [
      "evidence-ipip-japanese-markers",
      "evidence-mini-ipip-selection",
    ]);
  }
});

test("50-question detail copy separates scale observations from presentation prompts", () => {
  const detailDefinitions = FactorResultTextDefinitions.filter(
    ({ appliesTo }) => appliesTo.mode === "detail50",
  );
  assert.equal(detailDefinitions.length, 120);
  for (const definition of detailDefinitions) {
    assert.equal(definition.appliesTo.questionCount, 50);
    assert.equal(definition.previewAllowed, false);
    if (SCALE_SECTIONS.has(definition.section)) {
      assert.deepEqual(definition.evidenceRefs, [
        "evidence-ipip-japanese-markers",
        "evidence-ipip-50-item-scale",
      ]);
    }
    if (PROMPT_SECTIONS.has(definition.section)) {
      assert.deepEqual(
        definition.evidenceRefs,
        ["evidence-result-presentation-contract"],
      );
    }
    if (definition.section === "observation") {
      assert.match(definition.text, /^今回の50問では/);
    }
    if (["work", "relationship", "stress", "question"].includes(definition.section)) {
      assert.match(definition.text, /ましたか。$/);
    }
    if (definition.section === "action") {
      assert.match(definition.text, /^(?:よければ|無理のない範囲で|気が向けば)/);
      assert.match(definition.text, /みませんか。$/);
    }
  }
});

test("factor copy avoids prohibited labels, guarantees, and abstract wording", () => {
  for (const definition of FactorResultTextDefinitions) {
    assert.doesNotMatch(
      definition.text,
      /能力が高|能力が低|優れて|劣って|有能|才能|欠点|冷淡|弱い人|適職|向いている仕事|相性|治療|能力改善|前に出る傾向|連続したスコア/,
      definition.id,
    );
    if (definition.appliesTo.band === "middle") {
      assert.doesNotMatch(
        definition.text,
        /バランス|平均的|普通|理想/,
        definition.id,
      );
    }
    if (definition.section === "strength") {
      assert.match(definition.text, /面がうかがえます。$/, definition.id);
    }
    if (definition.section === "tradeoff") {
      assert.match(
        definition.text,
        /^場面によっては.*ありそうです。$/,
        definition.id,
      );
    }
  }
});

test("factor content is an explicit literal catalog without runtime generation", async () => {
  const source = await readFile(
    new URL("../js/data/factor-result-text-definitions.js", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    source,
    /\.(?:map|flatMap|reduce)\s*\(|\b(?:for|while)\s*\(|Array\.from|function\s|=>/,
  );
  assert.equal(Object.isFrozen(FactorResultTextDefinitions), true);
  assert.equal(Object.isFrozen(ResultTextDefinitions), true);
});
