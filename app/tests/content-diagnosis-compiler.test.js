import test from "node:test";
import assert from "node:assert/strict";

import { appMeta } from "../js/config/app-meta.js";
import {
  validateDefinitionAuthority,
  validateDefinitionStructure,
} from "../js/domain/definition-validator.js";
import { IPIP_JA_50_AUTHORITY_FIXTURE } from "./fixtures/ipip-ja-50-authority.fixture.js";
import { compileDiagnosisContent } from "../../scripts/content/compile-diagnosis.mjs";

const definitionVersions = appMeta.diagnosticVersions;
const FACTOR_DETAILS = Object.freeze({
  intellectImagination: ["知性・想像力", "Intellect/Imagination", "控えめ", "好奇心が強い", "Big Fiveの開放性に対応する特性です。"],
  conscientiousness: ["勤勉性", "Conscientiousness", "柔軟", "計画的", "計画と自己管理に関する特性です。"],
  extraversion: ["外向性", "Extraversion", "静か", "社交的", "人との関わり方に関する特性です。"],
  agreeableness: ["協調性", "Agreeableness", "率直", "協力的", "他者との協働に関する特性です。"],
  emotionalStability: ["情緒安定性", "Emotional Stability", "心配しやすい", "落ち着いている", "神経症傾向の逆方向を表す特性です。"],
});

function validRows() {
  const diagnostic_definition_version = "diagnostic-definition-v1";
  const question_version = definitionVersions.questionVersion;
  return {
    diagnosisRows: [{
      diagnosis_id: "big-five-ipip-ja",
      diagnostic_definition_version,
      scale_id: definitionVersions.scaleId,
      scale_name: "IPIP日本語50項目版",
      scale_version: definitionVersions.scaleVersion,
      question_version,
      scoring_version: definitionVersions.scoringVersion,
      result_text_version: definitionVersions.resultTextVersion,
      title_rule_version: definitionVersions.titleRuleVersion,
      status: "approved",
    }],
    sourceRows: [
      ["ipip-japanese-markers", "https://ipip.ori.org/JapaneseBig-FiveFactorMarkers.htm", "IPIP Japanese Translation"],
      ["ipip-50-item-scale", "https://www.ipip.ori.org/New_IPIP-50-item-scale.htm", "IPIP Japanese 50-item scale"],
      ["donnellan-2006-mini-ipip", "https://doi.org/10.1037/1040-3590.18.2.192", "Donnellan et al. (2006)"],
      ["ipip-permission", "https://ipip.ori.org/newPermission.htm", "IPIP materials are public domain."],
    ].map(([source_id, url, label], index) => ({
      diagnostic_definition_version,
      display_order: index + 1,
      source_id,
      url,
      label,
      status: "approved",
    })),
    limitationRows: [
      "この診断は医療的な診断を目的としません。",
      "20問の簡易プレビューは正式な短縮尺度として検証済みではありません。",
      "結果は自己理解のための目安です。",
    ].map((text, index) => ({
      diagnostic_definition_version,
      display_order: index + 1,
      text,
      status: "approved",
    })),
    factorRows: definitionVersions && [
      "intellectImagination",
      "conscientiousness",
      "extraversion",
      "agreeableness",
      "emotionalStability",
    ].map((factor_id, index) => {
      const [display_name, academic_name, low_pole, high_pole, description] = FACTOR_DETAILS[factor_id];
      return {
        diagnostic_definition_version,
        display_order: index + 1,
        factor_id,
        display_name,
        academic_name,
        low_pole,
        high_pole,
        description,
        status: "approved",
      };
    }),
    questionRows: IPIP_JA_50_AUTHORITY_FIXTURE.rows.map((row, index) => ({
      question_id: `ipip-ja-${row.sourceItemId.padStart(2, "0")}`,
      question_version,
      display_order: index + 1,
      text: row.textJa,
      factor_id: row.factorId,
      direction: row.keyedDirection === "negative" ? "reverse" : "positive",
      source_ref: row.sourceItemId,
      status: "approved",
    })),
    previewRows: IPIP_JA_50_AUTHORITY_FIXTURE.previewQuestionIds.map((question_id, index) => ({
      question_version,
      display_order: index + 1,
      question_id,
      status: "approved",
    })),
  };
}

function compile(rows = validRows()) {
  return compileDiagnosisContent(structuredClone(rows));
}

test("T-002 CSV compiler produces the fixed 50 questions and 20-question subset", () => {
  const compiled = compile();

  assert.deepEqual(Object.keys(compiled), ["diagnostic", "factors", "questions"]);
  assert.equal(compiled.questions.length, 50);
  assert.deepEqual(compiled.diagnostic.previewQuestionIds, IPIP_JA_50_AUTHORITY_FIXTURE.previewQuestionIds);
  assert.deepEqual(
    compiled.questions.map(({ sourceItemId }) => sourceItemId),
    [
      ...IPIP_JA_50_AUTHORITY_FIXTURE.previewSourceItemIds,
      ...Array.from({ length: 50 }, (_, index) => String(index + 1)).filter(
        (sourceItemId) => !IPIP_JA_50_AUTHORITY_FIXTURE.previewSourceItemIds.includes(sourceItemId),
      ),
    ],
  );
  assert.equal(validateDefinitionStructure(compiled, definitionVersions), compiled);
  assert.equal(
    validateDefinitionAuthority(compiled, definitionVersions, IPIP_JA_50_AUTHORITY_FIXTURE),
    compiled,
  );
});

test("T-002 compiler rejects a question count other than 50", () => {
  for (const questionRows of [validRows().questionRows.slice(1), [...validRows().questionRows, validRows().questionRows[0]]]) {
    assert.throws(
      () => compile({ ...validRows(), questionRows }),
      /QUESTION_COUNT_INVALID/,
    );
  }
});

test("T-002 compiler rejects a preview count other than 20", () => {
  for (const previewRows of [validRows().previewRows.slice(1), [...validRows().previewRows, validRows().previewRows[0]]]) {
    assert.throws(
      () => compile({ ...validRows(), previewRows }),
      /PREVIEW_QUESTION_COUNT_INVALID/,
    );
  }
});

test("T-002 compiler rejects duplicate question IDs and display orders", () => {
  for (const mutate of [
    (rows) => { rows.questionRows[1].question_id = rows.questionRows[0].question_id; },
    (rows) => { rows.questionRows[1].display_order = rows.questionRows[0].display_order; },
  ]) {
    const rows = validRows();
    mutate(rows);
    assert.throws(() => compile(rows), /DIAGNOSIS_CONTENT_INVALID/);
  }
});

test("T-002 compiler rejects an unknown factor and direction", () => {
  for (const mutate of [
    (rows) => { rows.questionRows[0].factor_id = "unknown-factor"; },
    (rows) => { rows.questionRows[0].direction = "sideways"; },
  ]) {
    const rows = validRows();
    mutate(rows);
    assert.throws(() => compile(rows), /DIAGNOSIS_CONTENT_INVALID/);
  }
});

test("T-002 compiler rejects a preview reference outside the 50 questions", () => {
  const rows = validRows();
  rows.previewRows[0].question_id = "ipip-ja-99";
  assert.throws(() => compile(rows), /QUESTION_REFERENCE_UNKNOWN/);
});

test("T-002 compiler rejects inconsistent question versions", () => {
  const rows = validRows();
  rows.questionRows[0].question_version = "ipip-ja-50-question-set-v2";
  assert.throws(() => compile(rows), /DIAGNOSIS_CONTENT_INVALID/);
});

test("T-002 compiler leaves authority literal validation independent", () => {
  const rows = validRows();
  rows.questionRows[0].text = "変更された設問文";
  const compiled = compile(rows);
  assert.equal(validateDefinitionStructure(compiled, definitionVersions), compiled);
  assert.throws(
    () => validateDefinitionAuthority(compiled, definitionVersions, IPIP_JA_50_AUTHORITY_FIXTURE),
    /DEFINITION_AUTHORITY_INVALID/,
  );
});

test("T-002 compiler rejects diagnosis, factor, source, and limitation version mismatches", () => {
  for (const mutate of [
    (rows) => { rows.diagnosisRows.push({ ...rows.diagnosisRows[0], diagnosis_id: "another-diagnosis" }); },
    (rows) => { rows.factorRows[0].diagnostic_definition_version = "diagnostic-definition-v2"; },
    (rows) => { rows.sourceRows[0].diagnostic_definition_version = "diagnostic-definition-v2"; },
    (rows) => { rows.limitationRows[0].diagnostic_definition_version = "diagnostic-definition-v2"; },
  ]) {
    const rows = validRows();
    mutate(rows);
    assert.throws(() => compile(rows), /DIAGNOSIS_CONTENT_INVALID/);
  }
});
