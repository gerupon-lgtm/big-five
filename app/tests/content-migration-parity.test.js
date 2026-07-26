import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { DiagnosticDefinition, FactorDefinitions, QuestionDefinitions } from "../js/data/diagnostic-definition.js";
import { ResultEvidenceDefinitions } from "../js/data/result-evidence-definitions.js";
import { ResultTextDefinitions } from "../js/data/result-text-definitions.js";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { compileDiagnosisContent } from "../../scripts/content/compile-diagnosis.mjs";
import { compileResultContent } from "../../scripts/content/compile-result-content.mjs";
import { compileRelease, validateAuthoringTree } from "../../scripts/content/content-compiler.mjs";
import { loadTableSchema } from "../../scripts/content/schema-loader.mjs";
import { loadCsvTable } from "../../scripts/content/table-loader.mjs";
import { exportCurrentContent } from "../../scripts/content/export-current-content.mjs";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SOURCE = path.join(ROOT, "content", "source");
const SCHEMAS = path.join(ROOT, "content", "schemas");
const APPROVAL_IDS = ["E-0", "E-1", "E-2", "E-3", "E-4", "E-5", "T-0", "T-1", "T-2", "T-3", "T-4", "F-1", "F-2", "F-3", "F-4", "F-5", "X-1", "X-2"];

async function table(sourceDir, relative) {
  const schema = await loadTableSchema(path.join(SCHEMAS, `${path.basename(relative, ".csv")}.schema.json`));
  return loadCsvTable({ filePath: path.join(sourceDir, relative), schema });
}

async function loadAndCompileDiagnosis(sourceDir) {
  const diagnosisVersion = "ipip-ja-50-definition-v1";
  const questionVersion = "ipip-ja-50-question-set-v1";
  const [diagnosisRows, sourceRows, limitationRows, factorRows, questionRows, previewRows] = await Promise.all([
    table(sourceDir, `diagnoses/${diagnosisVersion}/diagnosis-sets.csv`),
    table(sourceDir, `diagnoses/${diagnosisVersion}/diagnosis-sources.csv`),
    table(sourceDir, `diagnoses/${diagnosisVersion}/diagnosis-limitations.csv`),
    table(sourceDir, `diagnoses/${diagnosisVersion}/factor-definitions.csv`),
    table(sourceDir, `questions/${questionVersion}/questions.csv`),
    table(sourceDir, `questions/${questionVersion}/preview-questions.csv`),
  ]);
  return compileDiagnosisContent({
    diagnosisRows: diagnosisRows.rows,
    sourceRows: sourceRows.rows,
    limitationRows: limitationRows.rows,
    factorRows: factorRows.rows,
    questionRows: questionRows.rows,
    previewRows: previewRows.rows,
  });
}

async function loadAndCompileResultContent(sourceDir) {
  const titleVersion = "title-rule-v1";
  const resultTextVersion = "result-text-v1";
  const evidenceVersion = "result-evidence-v1";
  const [profileRows, profileFactorRows, textRows, textEvidenceRows, evidenceRows, evidenceClaimRows] = await Promise.all([
    table(sourceDir, `titles/${titleVersion}/title-profiles.csv`),
    table(sourceDir, `titles/${titleVersion}/title-profile-factors.csv`),
    table(sourceDir, `result-texts/${resultTextVersion}/result-texts.csv`),
    table(sourceDir, `result-texts/${resultTextVersion}/result-text-evidence.csv`),
    table(sourceDir, `evidence/${evidenceVersion}/result-evidence.csv`),
    table(sourceDir, `evidence/${evidenceVersion}/result-evidence-claims.csv`),
  ]);
  return compileResultContent({
    profileRows: profileRows.rows,
    profileFactorRows: profileFactorRows.rows,
    textRows: textRows.rows,
    textEvidenceRows: textEvidenceRows.rows,
    evidenceRows: evidenceRows.rows,
    evidenceClaimRows: evidenceClaimRows.rows,
    titleRuleVersion: titleVersion,
    resultTextVersion,
  });
}

test("T-007 exporter creates an isolated normalized source tree once and never overwrites it", async (t) => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), "big-five-csv-migration-"));
  t.after(() => rm(outputDir, { recursive: true, force: true }));

  const summary = await exportCurrentContent({ outputDir });
  assert.deepEqual(summary, {
    diagnosisSets: 1,
    diagnosisSources: 4,
    diagnosisLimitations: 3,
    factors: 5,
    questions: 50,
    previewMappings: 20,
    titles: 51,
    titleFactors: 90,
    resultTexts: 237,
    resultTextEvidence: 267,
    evidenceDefinitions: 6,
    evidenceClaims: 12,
    approvals: 18,
  });
  const before = await readFile(path.join(outputDir, "questions", "ipip-ja-50-question-set-v1", "questions.csv"));
  await assert.rejects(
    () => exportCurrentContent({ outputDir }),
    (error) => error.code === "MIGRATION_TARGET_EXISTS",
  );
  assert.deepEqual(await readFile(path.join(outputDir, "questions", "ipip-ja-50-question-set-v1", "questions.csv")), before);
});

test("T-007 exporter refuses before directory creation when any target already exists", async (t) => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), "big-five-csv-migration-existing-"));
  t.after(() => rm(outputDir, { recursive: true, force: true }));
  const existing = path.join(outputDir, "questions", "ipip-ja-50-question-set-v1");
  await mkdir(existing, { recursive: true });
  await writeFile(path.join(existing, "questions.csv"), "human-edited\r\n", "utf8");

  await assert.rejects(
    () => exportCurrentContent({ outputDir }),
    (error) => error.code === "MIGRATION_TARGET_EXISTS",
  );
  assert.equal(await readFile(path.join(existing, "questions.csv"), "utf8"), "human-edited\r\n");
  await assert.rejects(readFile(path.join(outputDir, "releases", "release-manifest.csv")));
});

test("T-007 migrated CSV deep-equals the current formal definitions through loaders and compilers", async () => {
  const diagnosis = await loadAndCompileDiagnosis(SOURCE);
  assert.deepEqual(diagnosis.questions, QuestionDefinitions);
  assert.deepEqual(diagnosis.factors, FactorDefinitions);
  assert.deepEqual(diagnosis.diagnostic, DiagnosticDefinition);

  const result = await loadAndCompileResultContent(SOURCE);
  assert.deepEqual(result.titleProfiles, TitleProfileDefinitions);
  assert.deepEqual(result.textDefinitions, ResultTextDefinitions);
  assert.deepEqual(result.evidenceDefinitions, ResultEvidenceDefinitions);
});

test("T-007 production source records exact statuses and remains authorable without a release", async () => {
  const approvals = await table(SOURCE, "approvals/result-content-approvals.csv");
  assert.deepEqual(approvals.rows.map(({ gate_id, display_order }) => [gate_id, display_order]), APPROVAL_IDS.map((gateId, index) => [gateId, index + 1]));
  assert.deepEqual(approvals.rows[0], {
    gate_id: "E-0", display_order: 1, status: "approved", approved_by: "user", approved_on: "2026-07-20", note: "要件で承認済みの共通資料・20/50の限界・非診断注意。",
  });
  assert.ok(approvals.rows.slice(1, 6).every((row) => row.status === "draft" && row.approved_by === "" && row.approved_on === ""));
  assert.ok(approvals.rows.slice(6).every((row) => row.status === "reviewed" && row.approved_by === "" && row.approved_on === ""));

  const result = await loadAndCompileResultContent(SOURCE);
  const evidence = await table(SOURCE, "evidence/result-evidence-v1/result-evidence.csv");
  const claims = await table(SOURCE, "evidence/result-evidence-v1/result-evidence-claims.csv");
  const statusByEvidenceId = new Map(evidence.rows.map((row) => [row.evidence_id, row.status]));
  assert.ok(evidence.rows.slice(0, 4).every((row) => row.status === "reviewed"));
  assert.ok(evidence.rows.slice(4).every((row) => row.status === "approved"));
  assert.ok(claims.rows.every((row) => row.status === statusByEvidenceId.get(row.evidence_id)));
  assert.equal(result.titleProfiles.length, 51);
  assert.equal(result.textDefinitions.length, 237);
  assert.equal(result.evidenceDefinitions.length, 6);

  for (const relative of ["releases/release-manifest.csv", "releases/release-history.csv"]) {
    const bytes = await readFile(path.join(SOURCE, relative));
    assert.ok(bytes.toString("utf8").endsWith("\r\n"));
    assert.equal((await table(SOURCE, relative)).rows.length, 0);
  }
  const authoring = await validateAuthoringTree({ sourceDir: SOURCE });
  assert.ok(authoring.warnings.some(({ code }) => code === "RELEASE_NOT_SELECTED"));
  assert.ok(authoring.warnings.some(({ code }) => code === "PRESENTATION_CATALOG_PENDING"));
  assert.ok(authoring.warnings.some(({ code }) => code === "CHARACTER_CATALOG_PENDING"));
  await assert.rejects(() => compileRelease({ sourceDir: SOURCE }), (error) => error.code === "RELEASE_NOT_SELECTED");
});
