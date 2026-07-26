import { lstat, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { DiagnosticDefinition, FactorDefinitions, QuestionDefinitions } from "../../app/js/data/diagnostic-definition.js";
import { ResultEvidenceDefinitions } from "../../app/js/data/result-evidence-definitions.js";
import { ResultTextDefinitions } from "../../app/js/data/result-text-definitions.js";
import { TitleProfileDefinitions } from "../../app/js/data/title-profile-definitions.js";
import { ContentError } from "./content-error.mjs";
import { serializeCsv } from "./csv-writer.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const DIAGNOSTIC_DEFINITION_VERSION = "ipip-ja-50-definition-v1";
const APPROVAL_GATES = Object.freeze([
  "E-0", "E-1", "E-2", "E-3", "E-4", "E-5",
  "T-0", "T-1", "T-2", "T-3", "T-4",
  "F-1", "F-2", "F-3", "F-4", "F-5", "X-1", "X-2",
]);

function statusForEvidence(evidenceId) {
  return evidenceId === "evidence-title-rule-v1" || evidenceId === "evidence-result-presentation-contract"
    ? "approved"
    : "reviewed";
}

function hasValue(value) {
  return value !== undefined && value !== null ? value : "";
}

function table(relativePath, headers, rows) {
  return Object.freeze({ relativePath, headers: Object.freeze(headers), rows: Object.freeze(rows) });
}

function sourceTables() {
  const diagnosticVersion = DIAGNOSTIC_DEFINITION_VERSION;
  const questionVersion = DiagnosticDefinition.questionVersion;
  const titleRuleVersion = DiagnosticDefinition.titleRuleVersion;
  const resultTextVersion = DiagnosticDefinition.resultTextVersion;
  const evidenceVersion = ResultEvidenceDefinitions[0].version;
  const evidenceStatus = new Map(ResultEvidenceDefinitions.map(({ evidenceId }) => [evidenceId, statusForEvidence(evidenceId)]));

  return [
    table("releases/release-manifest.csv", ["release_id", "app_version", "diagnosis_id", "diagnostic_definition_version", "scale_version", "question_version", "scoring_version", "result_evidence_version", "result_text_version", "title_rule_version", "character_manifest_version", "presentation_definition_version", "card_template_version", "status"], []),
    table("releases/release-history.csv", ["release_sequence", "release_id", "app_version", "diagnosis_id", "diagnostic_definition_version", "scale_version", "question_version", "scoring_version", "result_evidence_version", "result_text_version", "title_rule_version", "character_manifest_version", "presentation_definition_version", "card_template_version", "status"], []),
    table("approvals/result-content-approvals.csv", ["gate_id", "display_order", "status", "approved_by", "approved_on", "note"], APPROVAL_GATES.map((gateId, index) => [
      gateId,
      index + 1,
      gateId === "E-0" ? "approved" : index < 6 ? "draft" : "reviewed",
      gateId === "E-0" ? "user" : "",
      gateId === "E-0" ? "2026-07-20" : "",
      gateId === "E-0" ? "要件で承認済みの共通資料・20/50の限界・非診断注意。" : "",
    ])),
    table(`diagnoses/${diagnosticVersion}/diagnosis-sets.csv`, ["diagnosis_id", "diagnostic_definition_version", "scale_id", "scale_name", "scale_version", "question_version", "scoring_version", "result_text_version", "title_rule_version", "status"], [[
      DiagnosticDefinition.diagnosisId, diagnosticVersion, DiagnosticDefinition.scaleId, DiagnosticDefinition.scaleName,
      DiagnosticDefinition.scaleVersion, questionVersion, DiagnosticDefinition.scoringVersion,
      resultTextVersion, titleRuleVersion, "approved",
    ]]),
    table(`diagnoses/${diagnosticVersion}/diagnosis-sources.csv`, ["diagnostic_definition_version", "display_order", "source_id", "url", "label", "status"], DiagnosticDefinition.source.map((source, index) => [
      diagnosticVersion, index + 1, source.id, source.url, source.label, "approved",
    ])),
    table(`diagnoses/${diagnosticVersion}/diagnosis-limitations.csv`, ["diagnostic_definition_version", "display_order", "text", "status"], DiagnosticDefinition.limitations.map((text, index) => [
      diagnosticVersion, index + 1, text, "approved",
    ])),
    table(`diagnoses/${diagnosticVersion}/factor-definitions.csv`, ["diagnostic_definition_version", "display_order", "factor_id", "display_name", "academic_name", "low_pole", "high_pole", "description", "status"], FactorDefinitions.map((factor, index) => [
      diagnosticVersion, index + 1, factor.id, factor.displayName, factor.academicName, factor.lowPole, factor.highPole, factor.description, "approved",
    ])),
    table(`questions/${questionVersion}/questions.csv`, ["question_id", "question_version", "display_order", "text", "factor_id", "direction", "source_ref", "status"], QuestionDefinitions.map((question, index) => [
      question.id, questionVersion, index + 1, question.textJa, question.factorId,
      question.keyedDirection === "negative" ? "reverse" : "positive", question.sourceItemId, "approved",
    ])),
    table(`questions/${questionVersion}/preview-questions.csv`, ["question_version", "display_order", "question_id", "status"], DiagnosticDefinition.previewQuestionIds.map((questionId, index) => [
      questionVersion, index + 1, questionId, "approved",
    ])),
    table(`titles/${titleRuleVersion}/title-profiles.csv`, ["title_id", "title_rule_version", "display_order", "label", "kind", "character_id", "summary_text_id", "default_palette_id", "status"], TitleProfileDefinitions.map((profile, index) => [
      profile.titleId, titleRuleVersion, index + 1, profile.label, profile.kind, profile.characterId, profile.summaryTextId, profile.defaultPaletteId, "reviewed",
    ])),
    table(`titles/${titleRuleVersion}/title-profile-factors.csv`, ["title_id", "display_order", "factor_id", "direction", "status"], TitleProfileDefinitions.flatMap((profile) => profile.factors.map((factor, index) => [
      profile.titleId, index + 1, factor.factorId, factor.direction, "reviewed",
    ]))),
    table(`result-texts/${resultTextVersion}/result-texts.csv`, ["text_id", "result_text_version", "display_order", "section", "claim_kind", "mode", "factor_id", "band", "title_id", "preview_allowed", "text", "status"], ResultTextDefinitions.map((definition, index) => [
      definition.id, definition.version, index + 1, definition.section, definition.claimKind,
      hasValue(definition.appliesTo.mode), hasValue(definition.appliesTo.factorId), hasValue(definition.appliesTo.band), hasValue(definition.appliesTo.titleId),
      String(definition.previewAllowed), definition.text, "reviewed",
    ])),
    table(`result-texts/${resultTextVersion}/result-text-evidence.csv`, ["text_id", "display_order", "evidence_id", "status"], ResultTextDefinitions.flatMap((definition) => definition.evidenceRefs.map((evidenceId, index) => [
      definition.id, index + 1, evidenceId, "reviewed",
    ]))),
    table(`evidence/${evidenceVersion}/result-evidence.csv`, ["evidence_id", "result_evidence_version", "display_order", "source_type", "source_label", "locator", "status"], ResultEvidenceDefinitions.map((definition, index) => [
      definition.evidenceId, definition.version, index + 1, definition.sourceType, definition.sourceLabel, definition.locator, statusForEvidence(definition.evidenceId),
    ])),
    table(`evidence/${evidenceVersion}/result-evidence-claims.csv`, ["evidence_id", "display_order", "supported_claim", "status"], ResultEvidenceDefinitions.flatMap((definition) => definition.supportedClaims.map((supportedClaim, index) => [
      definition.evidenceId, index + 1, supportedClaim, evidenceStatus.get(definition.evidenceId),
    ]))),
  ];
}

async function pathExists(target) {
  try {
    await lstat(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function summaryFor(tables) {
  const count = (relativePath) => tables.find((candidate) => candidate.relativePath === relativePath).rows.length;
  return Object.freeze({
    diagnosisSets: count(`diagnoses/${DIAGNOSTIC_DEFINITION_VERSION}/diagnosis-sets.csv`),
    diagnosisSources: count(`diagnoses/${DIAGNOSTIC_DEFINITION_VERSION}/diagnosis-sources.csv`),
    diagnosisLimitations: count(`diagnoses/${DIAGNOSTIC_DEFINITION_VERSION}/diagnosis-limitations.csv`),
    factors: count(`diagnoses/${DIAGNOSTIC_DEFINITION_VERSION}/factor-definitions.csv`),
    questions: count(`questions/${DiagnosticDefinition.questionVersion}/questions.csv`),
    previewMappings: count(`questions/${DiagnosticDefinition.questionVersion}/preview-questions.csv`),
    titles: count(`titles/${DiagnosticDefinition.titleRuleVersion}/title-profiles.csv`),
    titleFactors: count(`titles/${DiagnosticDefinition.titleRuleVersion}/title-profile-factors.csv`),
    resultTexts: count(`result-texts/${DiagnosticDefinition.resultTextVersion}/result-texts.csv`),
    resultTextEvidence: count(`result-texts/${DiagnosticDefinition.resultTextVersion}/result-text-evidence.csv`),
    evidenceDefinitions: count(`evidence/${ResultEvidenceDefinitions[0].version}/result-evidence.csv`),
    evidenceClaims: count(`evidence/${ResultEvidenceDefinitions[0].version}/result-evidence-claims.csv`),
    approvals: count("approvals/result-content-approvals.csv"),
  });
}

export async function exportCurrentContent({ outputDir }) {
  if (typeof outputDir !== "string" || outputDir.length === 0) {
    throw new TypeError("outputDir is required");
  }
  const tables = sourceTables();
  const resolvedOutputDir = path.resolve(outputDir);
  const targets = tables.map(({ relativePath }) => path.join(resolvedOutputDir, relativePath));
  for (const target of targets) {
    if (await pathExists(target)) {
      throw new ContentError({
        code: "MIGRATION_TARGET_EXISTS",
        sourceName: target,
        message: "既存のCSVを上書きできません。",
      });
    }
  }
  for (const { relativePath, headers, rows } of tables) {
    const target = path.join(resolvedOutputDir, relativePath);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, serializeCsv(headers, rows), "utf8");
  }
  return summaryFor(tables);
}

function outputArgument(argumentsList) {
  const index = argumentsList.indexOf("--output");
  if (index === -1) return path.join(ROOT, "content", "source");
  if (index === argumentsList.length - 1 || argumentsList[index + 1].startsWith("--")) {
    throw new TypeError("--output requires a directory");
  }
  if (argumentsList.length !== 2) throw new TypeError("unknown argument");
  return argumentsList[index + 1];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const summary = await exportCurrentContent({ outputDir: outputArgument(process.argv.slice(2)) });
    console.log(`CSV移行を作成しました: ${summary.questions} questions, ${summary.previewMappings} preview mappings, ${summary.titles} titles, ${summary.resultTexts} result texts, ${summary.evidenceDefinitions} evidence definitions`);
  } catch (error) {
    if (error instanceof ContentError) console.error(`${error.code}: ${error.message}`);
    else console.error(error.message);
    process.exitCode = 1;
  }
}
