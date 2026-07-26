import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { appMeta } from "../js/config/app-meta.js";
import { ResultEvidenceDefinitions } from "../js/data/result-evidence-definitions.js";
import { ResultTextDefinitions } from "../js/data/result-text-definitions.js";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { IPIP_JA_50_AUTHORITY_FIXTURE } from "./fixtures/ipip-ja-50-authority.fixture.js";
import { makeValidPresentationDefinitionSet } from "./fixtures/presentation-valid.fixture.js";
import {
  canonicalJson,
  compileRelease,
  validateAuthoringTree,
  writeReleaseAtomically,
} from "../../scripts/content/content-compiler.mjs";
import { loadTableSchema } from "../../scripts/content/schema-loader.mjs";

test("T-006 compiler exports the deterministic release interfaces", () => {
  assert.equal(typeof canonicalJson, "function");
  assert.equal(typeof compileRelease, "function");
  assert.equal(typeof validateAuthoringTree, "function");
  assert.equal(typeof writeReleaseAtomically, "function");
});

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const APPROVAL_IDS = ["E-0", "E-1", "E-2", "E-3", "E-4", "E-5", "T-0", "T-1", "T-2", "T-3", "T-4", "F-1", "F-2", "F-3", "F-4", "F-5", "X-1", "X-2"];
const diagnosticVersion = "diagnostic-definition-v1";
const releaseId = "release-test-v1";
const factorDetails = {
  intellectImagination: ["知性・想像力", "Intellect/Imagination", "控えめ", "好奇心が強い", "Big Fiveの開放性に対応する特性です。"],
  conscientiousness: ["勤勉性", "Conscientiousness", "柔軟", "計画的", "計画と自己管理に関する特性です。"],
  extraversion: ["外向性", "Extraversion", "静か", "社交的", "人との関わり方に関する特性です。"],
  agreeableness: ["協調性", "Agreeableness", "率直", "協力的", "他者との協働に関する特性です。"],
  emotionalStability: ["情緒安定性", "Emotional Stability", "心配しやすい", "落ち着いている", "神経症傾向の逆方向を表す特性です。"],
};

function csv(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

async function writeTable(sourceDir, relative, rows) {
  const fileName = path.basename(relative);
  const schema = await loadTableSchema(path.join(ROOT, "content", "schemas", `${fileName.replace(".csv", ".schema.json")}`));
  const target = path.join(sourceDir, relative);
  await mkdir(path.dirname(target), { recursive: true });
  const lines = [schema.columns.map((column) => csv(column.name)).join(","), ...rows.map((row) => schema.columns.map((column) => csv(row[column.name] ?? "")).join(","))];
  await writeFile(target, `${lines.join("\n")}\n`, "utf8");
}

function resultRows() {
  return {
    profiles: TitleProfileDefinitions.map((profile, index) => ({ title_id: profile.titleId, title_rule_version: appMeta.diagnosticVersions.titleRuleVersion, display_order: index + 1, label: profile.label, kind: profile.kind, character_id: profile.characterId, summary_text_id: profile.summaryTextId, default_palette_id: profile.defaultPaletteId, status: "approved" })),
    profileFactors: TitleProfileDefinitions.flatMap((profile) => profile.factors.map((factor, index) => ({ title_id: profile.titleId, display_order: index + 1, factor_id: factor.factorId, direction: factor.direction, status: "approved" }))),
    texts: ResultTextDefinitions.map((definition, index) => ({ text_id: definition.id, result_text_version: definition.version, display_order: index + 1, section: definition.section, claim_kind: definition.claimKind, mode: definition.appliesTo.mode ?? "", factor_id: definition.appliesTo.factorId ?? "", band: definition.appliesTo.band ?? "", title_id: definition.appliesTo.titleId ?? "", preview_allowed: String(definition.previewAllowed), text: definition.text, status: "approved" })),
    textEvidence: ResultTextDefinitions.flatMap((definition) => definition.evidenceRefs.map((evidence_id, index) => ({ text_id: definition.id, display_order: index + 1, evidence_id, status: "approved" }))),
    evidence: ResultEvidenceDefinitions.map((definition, index) => ({ evidence_id: definition.evidenceId, result_evidence_version: definition.version, display_order: index + 1, source_type: definition.sourceType, source_label: definition.sourceLabel, locator: definition.locator, status: "approved" })),
    evidenceClaims: ResultEvidenceDefinitions.flatMap((definition) => definition.supportedClaims.map((supported_claim, index) => ({ evidence_id: definition.evidenceId, display_order: index + 1, supported_claim, status: "approved" }))),
  };
}

function presentationRows() {
  const definition = makeValidPresentationDefinitionSet(TitleProfileDefinitions);
  return {
    scenes: definition.scenes.map(({ sceneId, label }, index) => ({ scene_id: sceneId, presentation_definition_version: appMeta.presentationDefinitionVersion, display_order: index + 1, label, status: "approved" })),
    palettes: definition.palettes.map(({ paletteId, label, description }, index) => ({ palette_id: paletteId, presentation_definition_version: appMeta.presentationDefinitionVersion, display_order: index + 1, label, description, status: "approved" })),
    paletteUsage: definition.palettes.flatMap(({ paletteId, baseColors }) => ["primary", "secondary", "accent"].map((usage, index) => ({ palette_id: paletteId, display_order: index + 1, usage, color: baseColors[usage], status: "approved" }))),
    fragrances: definition.fragrances.map(({ fragranceId, sceneId, accordLabel, description, disclaimerId }, index) => ({ fragrance_id: fragranceId, presentation_definition_version: appMeta.presentationDefinitionVersion, display_order: index + 1, scene_id: sceneId, accord_label: accordLabel, description, disclaimer_id: disclaimerId, status: "approved" })),
    selectors: definition.titleSelectors.map(({ titleId }, index) => ({ title_id: titleId, presentation_definition_version: appMeta.presentationDefinitionVersion, display_order: index + 1, status: "approved" })),
    selectorPalettes: definition.titleSelectors.flatMap(({ titleId, alternativePaletteIds }) => alternativePaletteIds.map((palette_id, index) => ({ title_id: titleId, display_order: index + 1, palette_id, status: "approved" }))),
    selectorFragrances: definition.titleSelectors.flatMap(({ titleId, fragranceScenes }) => fragranceScenes.flatMap(({ sceneId, candidateFragranceIds, shareFragranceId }) => candidateFragranceIds.map((fragrance_id, index) => ({ title_id: titleId, scene_id: sceneId, display_order: index + 1, fragrance_id, share_selected: String(fragrance_id === shareFragranceId), status: "approved" })))),
  };
}

async function createApprovedSourceTree(t, { manifestStatus = "approved" } = {}) {
  const sourceDir = await mkdtemp(path.join(os.tmpdir(), "big-five-content-"));
  t.after(() => rm(sourceDir, { recursive: true, force: true }));
  const release = {
    release_id: releaseId, app_version: appMeta.appVersion, diagnosis_id: "big-five-ipip-ja", diagnostic_definition_version: diagnosticVersion,
    scale_version: appMeta.diagnosticVersions.scaleVersion, question_version: appMeta.diagnosticVersions.questionVersion, scoring_version: appMeta.diagnosticVersions.scoringVersion,
    result_evidence_version: ResultEvidenceDefinitions[0].version, result_text_version: appMeta.diagnosticVersions.resultTextVersion, title_rule_version: appMeta.diagnosticVersions.titleRuleVersion,
    character_manifest_version: appMeta.characterManifestVersion, presentation_definition_version: appMeta.presentationDefinitionVersion, card_template_version: appMeta.cardTemplateVersion, status: manifestStatus,
  };
  await writeTable(sourceDir, "releases/release-manifest.csv", [release]);
  await writeTable(sourceDir, "releases/release-history.csv", [{ release_sequence: 1, ...release, status: "approved" }]);
  await writeTable(sourceDir, "approvals/result-content-approvals.csv", APPROVAL_IDS.map((gate_id, index) => ({ gate_id, display_order: index + 1, status: "approved", approved_by: "reviewer", approved_on: "2026-07-26", note: "human note" })));
  const diagnosis = {
    diagnosis: [{ diagnosis_id: release.diagnosis_id, diagnostic_definition_version: diagnosticVersion, scale_id: appMeta.diagnosticVersions.scaleId, scale_name: "IPIP日本語50項目版", scale_version: release.scale_version, question_version: release.question_version, scoring_version: release.scoring_version, result_text_version: release.result_text_version, title_rule_version: release.title_rule_version, status: "approved" }],
    sources: [["ipip-japanese-markers", "https://ipip.ori.org/JapaneseBig-FiveFactorMarkers.htm", "IPIP Japanese Translation"], ["ipip-50-item-scale", "https://www.ipip.ori.org/New_IPIP-50-item-scale.htm", "IPIP Japanese 50-item scale"], ["donnellan-2006-mini-ipip", "https://doi.org/10.1037/1040-3590.18.2.192", "Donnellan et al. (2006)"], ["ipip-permission", "https://ipip.ori.org/newPermission.htm", "IPIP materials are public domain."]].map(([source_id, url, label], index) => ({ diagnostic_definition_version: diagnosticVersion, display_order: index + 1, source_id, url, label, status: "approved" })),
    limitations: ["この診断は医療的な診断を目的としません。", "20問の簡易プレビューは正式な短縮尺度として検証済みではありません。", "結果は自己理解のための目安です。"].map((text, index) => ({ diagnostic_definition_version: diagnosticVersion, display_order: index + 1, text, status: "approved" })),
    factors: ["intellectImagination", "conscientiousness", "extraversion", "agreeableness", "emotionalStability"].map((factor_id, index) => { const [display_name, academic_name, low_pole, high_pole, description] = factorDetails[factor_id]; return { diagnostic_definition_version: diagnosticVersion, display_order: index + 1, factor_id, display_name, academic_name, low_pole, high_pole, description, status: "approved" }; }),
    questions: IPIP_JA_50_AUTHORITY_FIXTURE.rows.map((row, index) => ({ question_id: `ipip-ja-${row.sourceItemId.padStart(2, "0")}`, question_version: release.question_version, display_order: index + 1, text: row.textJa, factor_id: row.factorId, direction: row.keyedDirection === "negative" ? "reverse" : "positive", source_ref: row.sourceItemId, status: "approved" })),
    previews: IPIP_JA_50_AUTHORITY_FIXTURE.previewQuestionIds.map((question_id, index) => ({ question_version: release.question_version, display_order: index + 1, question_id, status: "approved" })),
  };
  const d = `diagnoses/${diagnosticVersion}`;
  await Promise.all([writeTable(sourceDir, `${d}/diagnosis-sets.csv`, diagnosis.diagnosis), writeTable(sourceDir, `${d}/diagnosis-sources.csv`, diagnosis.sources), writeTable(sourceDir, `${d}/diagnosis-limitations.csv`, diagnosis.limitations), writeTable(sourceDir, `${d}/factor-definitions.csv`, diagnosis.factors)]);
  await Promise.all([writeTable(sourceDir, `questions/${release.question_version}/questions.csv`, diagnosis.questions), writeTable(sourceDir, `questions/${release.question_version}/preview-questions.csv`, diagnosis.previews)]);
  const result = resultRows();
  await Promise.all([writeTable(sourceDir, `titles/${release.title_rule_version}/title-profiles.csv`, result.profiles), writeTable(sourceDir, `titles/${release.title_rule_version}/title-profile-factors.csv`, result.profileFactors), writeTable(sourceDir, `result-texts/${release.result_text_version}/result-texts.csv`, result.texts), writeTable(sourceDir, `result-texts/${release.result_text_version}/result-text-evidence.csv`, result.textEvidence), writeTable(sourceDir, `evidence/${release.result_evidence_version}/result-evidence.csv`, result.evidence), writeTable(sourceDir, `evidence/${release.result_evidence_version}/result-evidence-claims.csv`, result.evidenceClaims)]);
  const presentation = presentationRows(); const p = `presentation/${release.presentation_definition_version}`;
  await Promise.all([writeTable(sourceDir, `${p}/scenes.csv`, presentation.scenes), writeTable(sourceDir, `${p}/palettes.csv`, presentation.palettes), writeTable(sourceDir, `${p}/palette-usage-mappings.csv`, presentation.paletteUsage), writeTable(sourceDir, `${p}/fragrances.csv`, presentation.fragrances), writeTable(sourceDir, `${p}/presentation-selectors.csv`, presentation.selectors), writeTable(sourceDir, `${p}/selector-palettes.csv`, presentation.selectorPalettes), writeTable(sourceDir, `${p}/selector-fragrances.csv`, presentation.selectorFragrances)]);
  const characters = TitleProfileDefinitions.map((profile, index) => ({ title_id: profile.titleId, character_manifest_version: release.character_manifest_version, display_order: index + 1, character_id: profile.characterId, asset_version: "character-asset-v1", delivery_webp_path: `assets/characters/${index + 1}.webp`, delivery_sha256: "a".repeat(64), width: 1024, height: 1024, byte_length: 1, has_alpha: "true", alt: "全身が見える猫のイラスト", art_review_status: "approved", anatomy_review_status: "approved", technical_review_status: "approved", accessibility_review_status: "approved", approved_by: "reviewer", approved_at: "2026-07-26T00:00:00.000Z", status: "approved" }));
  await writeTable(sourceDir, `characters/${release.character_manifest_version}/characters.csv`, characters);
  return sourceDir;
}

test("T-006 loads the three exact release schemas", async () => {
  for (const name of ["release-manifest", "release-history", "result-content-approvals"]) {
    const schema = await loadTableSchema(path.join(ROOT, "content", "schemas", `${name}.schema.json`));
    assert.equal(schema.schemaVersion, 1);
  }
});

test("T-006 header-only manifest is valid authoring input", async (t) => {
  const sourceDir = await mkdtemp(path.join(os.tmpdir(), "big-five-empty-")); t.after(() => rm(sourceDir, { recursive: true, force: true }));
  await writeTable(sourceDir, "releases/release-manifest.csv", []);
  await writeTable(sourceDir, "releases/release-history.csv", []);
  await writeTable(sourceDir, "approvals/result-content-approvals.csv", APPROVAL_IDS.map((gate_id, index) => ({ gate_id, display_order: index + 1, status: "draft", approved_by: "", approved_on: "", note: "" })));
  const result = await validateAuthoringTree({ sourceDir });
  assert.deepEqual(Object.keys(result), ["catalogs", "warnings"]);
  assert.equal(result.catalogs.releaseManifest.rows.length, 0);
});

test("T-006 approved fixture compiles seven byte-identical resources and hashes", async (t) => {
  const sourceDir = await createApprovedSourceTree(t);
  const first = await compileRelease({ sourceDir });
  const second = await compileRelease({ sourceDir, releaseId });
  assert.deepEqual([...first.resources], [...second.resources]);
  assert.deepEqual([...first.resources.keys()], ["diagnosis", "questions", "titles", "result-texts", "evidence", "presentation", "characters"]);
  assert.deepEqual(Object.keys(first.manifest), ["schemaVersion", "releaseId", "appVersion", "diagnosisId", "versions", "resources"]);
  for (const resource of first.manifest.resources) assert.equal(resource.sha256, createHash("sha256").update(first.resources.get(resource.kind)).digest("hex"));
  assert.doesNotMatch(first.resources.get("result-texts"), /reviewer|human note|approved_on/);
});

test("T-006 rejects unselected and unapproved releases", async (t) => {
  const empty = await mkdtemp(path.join(os.tmpdir(), "big-five-no-release-")); t.after(() => rm(empty, { recursive: true, force: true }));
  await writeTable(empty, "releases/release-manifest.csv", []); await writeTable(empty, "releases/release-history.csv", []); await writeTable(empty, "approvals/result-content-approvals.csv", APPROVAL_IDS.map((gate_id, index) => ({ gate_id, display_order: index + 1, status: "draft", approved_by: "", approved_on: "", note: "" })));
  await assert.rejects(() => compileRelease({ sourceDir: empty }), (error) => error.code === "RELEASE_NOT_SELECTED");
  const sourceDir = await createApprovedSourceTree(t, { manifestStatus: "draft" });
  await assert.rejects(() => compileRelease({ sourceDir }), (error) => error.code === "RELEASE_CONTENT_NOT_APPROVED");
});

test("T-006 atomically replaces only complete verified releases beneath the allowed parent", async (t) => {
  const sourceDir = await createApprovedSourceTree(t); const compiled = await compileRelease({ sourceDir });
  const parent = await mkdtemp(path.join(os.tmpdir(), "big-five-output-")); t.after(() => rm(parent, { recursive: true, force: true }));
  const output = path.join(parent, "release"); await mkdir(output); await writeFile(path.join(output, "stale.txt"), "old");
  await writeReleaseAtomically({ outputDir: output, allowedParentDir: parent, compiled });
  assert.equal(await readFile(path.join(output, releaseId, "questions.json"), "utf8"), compiled.resources.get("questions"));
  await assert.rejects(() => writeReleaseAtomically({ outputDir: path.join(parent, "..", "escape"), allowedParentDir: parent, compiled }), (error) => error.code === "CONTENT_OUTPUT_PATH_INVALID");
  const broken = { manifest: structuredClone(compiled.manifest), resources: new Map(compiled.resources) }; broken.resources.set("questions", "{}\n");
  await assert.rejects(() => writeReleaseAtomically({ outputDir: output, allowedParentDir: parent, compiled: broken }), (error) => error.code === "RELEASE_RESOURCE_MISSING");
  assert.equal(await readFile(path.join(output, releaseId, "questions.json"), "utf8"), compiled.resources.get("questions"));
});
