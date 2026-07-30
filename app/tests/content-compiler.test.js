import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { cp, mkdtemp, mkdir, readFile, rename, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

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
const presentationVersion = "presentation-v2";
const releaseId = "release-test-v1";
const execFileAsync = promisify(execFile);
const BASE_RESULT_TEXT_DEFINITIONS = ResultTextDefinitions.filter(
  ({ section }) => section !== "titleReflection",
);
const TITLE_REFLECTION_DEFINITIONS = ResultTextDefinitions.filter(
  ({ section }) => section === "titleReflection",
);
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

async function replaceInFile(filePath, from, to) {
  const text = await readFile(filePath, "utf8");
  assert.match(text, typeof from === "string" ? new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) : from);
  await writeFile(filePath, text.replace(from, to), "utf8");
}

async function copyQuestionVersion(sourceDir, fromVersion, toVersion) {
  const source = path.join(sourceDir, "questions", fromVersion);
  const target = path.join(sourceDir, "questions", toVersion);
  await cp(source, target, { recursive: true });
  for (const fileName of ["questions.csv", "preview-questions.csv"]) {
    const filePath = path.join(target, fileName);
    const text = await readFile(filePath, "utf8");
    await writeFile(filePath, text.replaceAll(fromVersion, toVersion), "utf8");
  }
}

async function copyCharacterVersion(sourceDir, fromVersion, toVersion) {
  const source = path.join(sourceDir, "characters", fromVersion);
  const target = path.join(sourceDir, "characters", toVersion);
  await cp(source, target, { recursive: true });
  const filePath = path.join(target, "characters.csv");
  const text = await readFile(filePath, "utf8");
  await writeFile(filePath, text.replaceAll(fromVersion, toVersion), "utf8");
}

function cloneCompiled(compiled) {
  return { manifest: structuredClone(compiled.manifest), resources: new Map(compiled.resources) };
}

function resultRows() {
  return {
    profiles: TitleProfileDefinitions.map((profile, index) => ({ title_id: profile.titleId, title_rule_version: appMeta.diagnosticVersions.titleRuleVersion, display_order: index + 1, label: profile.label, kind: profile.kind, character_id: profile.characterId, summary_text_id: profile.summaryTextId, default_palette_id: profile.defaultPaletteId, status: "approved" })),
    profileFactors: TitleProfileDefinitions.flatMap((profile) => profile.factors.map((factor, index) => ({ title_id: profile.titleId, display_order: index + 1, factor_id: factor.factorId, direction: factor.direction, status: "approved" }))),
    texts: BASE_RESULT_TEXT_DEFINITIONS.map((definition, index) => ({ text_id: definition.id, result_text_version: definition.version, display_order: index + 1, section: definition.section, claim_kind: definition.claimKind, mode: definition.appliesTo.mode ?? "", factor_id: definition.appliesTo.factorId ?? "", band: definition.appliesTo.band ?? "", title_id: definition.appliesTo.titleId ?? "", preview_allowed: String(definition.previewAllowed), text: definition.text, status: "approved" })),
    textEvidence: BASE_RESULT_TEXT_DEFINITIONS.flatMap((definition) => definition.evidenceRefs.map((evidence_id, index) => ({ text_id: definition.id, display_order: index + 1, evidence_id, status: "approved" }))),
    titleReflections: TitleProfileDefinitions.flatMap(({ titleId }) =>
      TITLE_REFLECTION_DEFINITIONS
        .filter(({ appliesTo }) => appliesTo.titleId === titleId)
        .map((definition, index) => ({
          text_id: definition.id,
          result_text_version: definition.version,
          title_id: titleId,
          display_order: index + 1,
          text: definition.text,
          status: "approved",
        }))),
    evidence: ResultEvidenceDefinitions.map((definition, index) => ({ evidence_id: definition.evidenceId, result_evidence_version: definition.version, display_order: index + 1, source_type: definition.sourceType, source_label: definition.sourceLabel, locator: definition.locator, status: "approved" })),
    evidenceClaims: ResultEvidenceDefinitions.flatMap((definition) => definition.supportedClaims.map((supported_claim, index) => ({ evidence_id: definition.evidenceId, display_order: index + 1, supported_claim, status: "approved" }))),
  };
}

function presentationRows() {
  const definition = makeValidPresentationDefinitionSet(TitleProfileDefinitions, {
    schemaVersion: 2,
    version: presentationVersion,
  });
  return {
    scenes: definition.scenes.map(({ sceneId, label }, index) => ({ scene_id: sceneId, presentation_definition_version: presentationVersion, display_order: index + 1, label, status: "approved" })),
    palettes: definition.palettes.map(({ paletteId, label, baseColors, description }, index) => ({ palette_id: paletteId, presentation_definition_version: presentationVersion, display_order: index + 1, label, primary_color: baseColors.primary, secondary_color: baseColors.secondary, accent_color: baseColors.accent, description, status: "approved" })),
    paletteUsage: definition.paletteUsageMappings.map(({ paletteId, roles, textCandidates }, index) => ({ palette_id: paletteId, presentation_definition_version: presentationVersion, display_order: index + 1, background_source: roles.background.source, background_mix_with: roles.background.mixWith, background_mix_percent: roles.background.mixPercent, surface_source: roles.surface.source, surface_mix_with: roles.surface.mixWith, surface_mix_percent: roles.surface.mixPercent, accent_source: roles.accent.source, accent_mix_with: roles.accent.mixWith, accent_mix_percent: roles.accent.mixPercent, chart_source: roles.chart.source, chart_mix_with: roles.chart.mixWith, chart_mix_percent: roles.chart.mixPercent, text_candidate_1: textCandidates[0], text_candidate_2: textCandidates[1], status: "approved" })),
    fragrances: definition.fragrances.map(({ fragranceId, sceneId, accordLabel, description, disclaimerId }, index) => ({ fragrance_id: fragranceId, presentation_definition_version: presentationVersion, display_order: index + 1, scene_id: sceneId, accord_label: accordLabel, description, disclaimer_id: disclaimerId, status: "approved" })),
    fragranceMaterials: definition.fragranceMaterials.map(({ materialId, displayName, materialKind }, index) => ({ material_id: materialId, presentation_definition_version: presentationVersion, display_order: index + 1, display_name: displayName, material_kind: materialKind, status: "approved" })),
    fragranceMaterialExamples: definition.fragrances.flatMap(({ fragranceId, materialIds }) => materialIds.map((material_id, index) => ({ fragrance_id: fragranceId, material_id, presentation_definition_version: presentationVersion, display_order: index + 1, status: "approved" }))),
    selectors: definition.titleSelectors.map(({ titleId }, index) => ({ title_id: titleId, presentation_definition_version: presentationVersion, display_order: index + 1, status: "approved" })),
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
    character_manifest_version: appMeta.characterManifestVersion, presentation_definition_version: presentationVersion, card_template_version: appMeta.cardTemplateVersion, status: manifestStatus,
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
  await Promise.all([writeTable(sourceDir, `titles/${release.title_rule_version}/title-profiles.csv`, result.profiles), writeTable(sourceDir, `titles/${release.title_rule_version}/title-profile-factors.csv`, result.profileFactors), writeTable(sourceDir, `result-texts/${release.result_text_version}/result-texts.csv`, result.texts), writeTable(sourceDir, `result-texts/${release.result_text_version}/result-text-evidence.csv`, result.textEvidence), writeTable(sourceDir, `result-texts/${release.result_text_version}/title-reflection-comments.csv`, result.titleReflections), writeTable(sourceDir, `evidence/${release.result_evidence_version}/result-evidence.csv`, result.evidence), writeTable(sourceDir, `evidence/${release.result_evidence_version}/result-evidence-claims.csv`, result.evidenceClaims)]);
  const presentation = presentationRows(); const p = `presentation/${release.presentation_definition_version}`;
  await Promise.all([writeTable(sourceDir, `${p}/scenes.csv`, presentation.scenes), writeTable(sourceDir, `${p}/palettes.csv`, presentation.palettes), writeTable(sourceDir, `${p}/palette-usage-mappings.csv`, presentation.paletteUsage), writeTable(sourceDir, `${p}/fragrances.csv`, presentation.fragrances), writeTable(sourceDir, `${p}/fragrance-materials.csv`, presentation.fragranceMaterials), writeTable(sourceDir, `${p}/fragrance-material-examples.csv`, presentation.fragranceMaterialExamples), writeTable(sourceDir, `${p}/presentation-selectors.csv`, presentation.selectors), writeTable(sourceDir, `${p}/selector-palettes.csv`, presentation.selectorPalettes), writeTable(sourceDir, `${p}/selector-fragrances.csv`, presentation.selectorFragrances)]);
  const characters = TitleProfileDefinitions.map((profile, index) => ({ title_id: profile.titleId, character_manifest_version: release.character_manifest_version, display_order: index + 1, character_id: profile.characterId, asset_version: "character-asset-v1", delivery_webp_path: `assets/characters/${index + 1}.webp`, delivery_sha256: "a".repeat(64), width: 1024, height: 1024, byte_length: 1, has_alpha: "true", alt: "全身が見える猫のイラスト", art_review_status: "approved", anatomy_review_status: "approved", technical_review_status: "approved", accessibility_review_status: "approved", approved_by: "reviewer", approved_at: "2026-07-26T00:00:00.000Z", status: "approved" }));
  await writeTable(sourceDir, `characters/${release.character_manifest_version}/characters.csv`, characters);
  return sourceDir;
}

test("T-006 loads the three exact release schemas", async () => {
  const manifestColumns = [
    ["release_id", "version", true], ["app_version", "version", true], ["diagnosis_id", "id", true],
    ["diagnostic_definition_version", "version", true], ["scale_version", "version", true], ["question_version", "version", true],
    ["scoring_version", "version", true], ["result_evidence_version", "version", true], ["result_text_version", "version", true],
    ["title_rule_version", "version", true], ["character_manifest_version", "version", true], ["presentation_definition_version", "version", true],
    ["card_template_version", "version", true], ["status", "enum", true, ["draft", "reviewed", "approved", "rejected"]],
  ].map(([name, type, required, values]) => values ? { name, type, required, values } : { name, type, required });
  const sequence = { name: "release_sequence", type: "integer", required: true, minimum: 1 };
  const approvalColumns = [
    { name: "gate_id", type: "reference", required: true },
    { name: "display_order", type: "integer", required: true, minimum: 1 },
    { name: "status", type: "enum", required: true, values: ["draft", "reviewed", "approved", "rejected"] },
    { name: "approved_by", type: "text", required: false },
    { name: "approved_on", type: "text", required: false },
    { name: "note", type: "text", required: false },
  ];
  for (const [name, fileName, columns] of [
    ["release-manifest", "release-manifest.csv", manifestColumns],
    ["release-history", "release-history.csv", [sequence, ...manifestColumns]],
    ["result-content-approvals", "result-content-approvals.csv", approvalColumns],
  ]) {
    assert.deepEqual(await loadTableSchema(path.join(ROOT, "content", "schemas", `${name}.schema.json`)), { schemaVersion: 1, fileName, columns });
  }
});

test("T-006 header-only manifest validates core catalogs and warns for no release, Q-012, and Q-013", async (t) => {
  const sourceDir = await createApprovedSourceTree(t);
  await writeTable(sourceDir, "releases/release-manifest.csv", []);
  await writeTable(sourceDir, "releases/release-history.csv", []);
  await rm(path.join(sourceDir, "presentation"), { recursive: true });
  await rm(path.join(sourceDir, "characters"), { recursive: true });
  const result = await validateAuthoringTree({ sourceDir });
  assert.deepEqual(Object.keys(result), ["catalogs", "warnings"]);
  assert.equal(result.catalogs.releaseManifest.rows.length, 0);
  assert.equal(result.catalogs.questionRows.rows.length, 50);
  assert.deepEqual(result.warnings.slice(-3).map(({ code }) => code), ["RELEASE_NOT_SELECTED", "PRESENTATION_CATALOG_PENDING", "CHARACTER_CATALOG_PENDING"]);
  await rm(path.join(sourceDir, "questions", appMeta.diagnosticVersions.questionVersion, "questions.csv"));
  await assert.rejects(() => validateAuthoringTree({ sourceDir }), (error) => error.code === "RELEASE_RESOURCE_MISSING");
});

test("T-006 header-only manifest validates multiple authored question versions without selecting a tuple", async (t) => {
  const sourceDir = await createApprovedSourceTree(t);
  const secondVersion = "ipip-ja-50-question-set-v2";
  await writeTable(sourceDir, "releases/release-manifest.csv", []);
  await writeTable(sourceDir, "releases/release-history.csv", []);
  await copyQuestionVersion(sourceDir, appMeta.diagnosticVersions.questionVersion, secondVersion);

  const result = await validateAuthoringTree({ sourceDir });

  assert.equal(result.catalogs.releaseManifest.rows.length, 0);
  assert.equal(result.warnings.at(-1).code, "RELEASE_NOT_SELECTED");
});

test("T-006 header-only authoring rejects duplicate question order in the second version", async (t) => {
  const sourceDir = await createApprovedSourceTree(t);
  const secondVersion = "ipip-ja-50-question-set-v2";
  await writeTable(sourceDir, "releases/release-manifest.csv", []);
  await writeTable(sourceDir, "releases/release-history.csv", []);
  await copyQuestionVersion(sourceDir, appMeta.diagnosticVersions.questionVersion, secondVersion);
  await replaceInFile(
    path.join(sourceDir, "questions", secondVersion, "questions.csv"),
    `"${secondVersion}","2"`,
    `"${secondVersion}","1"`,
  );

  await assert.rejects(
    () => validateAuthoringTree({ sourceDir }),
    (error) => error.code === "RELEASE_VERSION_REFERENCE_INVALID",
  );
});

test("T-006 draft release rejects duplicate question order in its unreferenced version", async (t) => {
  const sourceDir = await createApprovedSourceTree(t, { manifestStatus: "draft" });
  const secondVersion = "ipip-ja-50-question-set-v2";
  await copyQuestionVersion(sourceDir, appMeta.diagnosticVersions.questionVersion, secondVersion);
  await replaceInFile(
    path.join(sourceDir, "questions", secondVersion, "questions.csv"),
    `"${secondVersion}","2"`,
    `"${secondVersion}","1"`,
  );

  await assert.rejects(
    () => validateAuthoringTree({ sourceDir }),
    (error) => error.code === "RELEASE_VERSION_REFERENCE_INVALID",
  );
});

test("T-006 draft release rejects duplicate character mapping in an unreferenced character version", async (t) => {
  const sourceDir = await createApprovedSourceTree(t, { manifestStatus: "draft" });
  const secondVersion = "character-manifest-v2";
  await copyCharacterVersion(sourceDir, appMeta.characterManifestVersion, secondVersion);
  await replaceInFile(
    path.join(sourceDir, "characters", secondVersion, "characters.csv"),
    csv(TitleProfileDefinitions[1].characterId),
    csv(TitleProfileDefinitions[0].characterId),
  );

  await assert.rejects(
    () => validateAuthoringTree({ sourceDir }),
    (error) => error.code === "CHARACTER_CONTENT_INVALID",
  );
});

test("T-006 authoring validation rejects missing files in an unselected version", async (t) => {
  const sourceDir = await createApprovedSourceTree(t);
  const secondVersion = "ipip-ja-50-question-set-v2";
  await writeTable(sourceDir, "releases/release-manifest.csv", []);
  await writeTable(sourceDir, "releases/release-history.csv", []);
  await copyQuestionVersion(sourceDir, appMeta.diagnosticVersions.questionVersion, secondVersion);
  await rm(path.join(sourceDir, "questions", secondVersion, "preview-questions.csv"));

  await assert.rejects(
    () => validateAuthoringTree({ sourceDir }),
    (error) => error.code === "RELEASE_RESOURCE_MISSING",
  );
});

test("T-006 draft release validates an unreferenced version and rejects its directory-version mismatch", async (t) => {
  const sourceDir = await createApprovedSourceTree(t, { manifestStatus: "draft" });
  const secondVersion = "ipip-ja-50-question-set-v2";
  await copyQuestionVersion(sourceDir, appMeta.diagnosticVersions.questionVersion, secondVersion);
  await assert.doesNotReject(() => validateAuthoringTree({ sourceDir }));

  await replaceInFile(
    path.join(sourceDir, "questions", secondVersion, "questions.csv"),
    secondVersion,
    "ipip-ja-50-question-set-v9",
  );
  await assert.rejects(
    () => validateAuthoringTree({ sourceDir }),
    (error) => error.code === "RELEASE_VERSION_REFERENCE_INVALID",
  );
});

test("T-006 authoring validation rejects non-directory and symlinked version entries", async (t) => {
  const invalidEntrySource = await createApprovedSourceTree(t);
  await writeFile(path.join(invalidEntrySource, "questions", "question-set-v2"), "not a directory", "utf8");
  await assert.rejects(
    () => validateAuthoringTree({ sourceDir: invalidEntrySource }),
    (error) => error.code === "RELEASE_VERSION_REFERENCE_INVALID",
  );

  const symlinkSource = await createApprovedSourceTree(t);
  const original = path.join(symlinkSource, "questions", appMeta.diagnosticVersions.questionVersion);
  const linked = path.join(symlinkSource, "questions", "question-set-v2");
  await symlink(original, linked, process.platform === "win32" ? "junction" : "dir");
  await assert.rejects(
    () => validateAuthoringTree({ sourceDir: symlinkSource }),
    (error) => error.code === "RELEASE_VERSION_REFERENCE_INVALID",
  );
});

test("T-006 draft manifest treats missing Q-012 and Q-013 catalogs as pending warnings", async (t) => {
  const sourceDir = await createApprovedSourceTree(t, { manifestStatus: "draft" });
  await rm(path.join(sourceDir, "presentation"), { recursive: true });
  await rm(path.join(sourceDir, "characters"), { recursive: true });
  const { warnings } = await validateAuthoringTree({ sourceDir });
  assert.deepEqual(
    warnings.filter(({ code }) => code.endsWith("_CATALOG_PENDING")).map(({ code }) => code),
    ["PRESENTATION_CATALOG_PENDING", "CHARACTER_CATALOG_PENDING"],
  );
});

test("T-006 approved fixture compiles seven byte-identical resources and hashes", async (t) => {
  const sourceDir = await createApprovedSourceTree(t);
  const first = await compileRelease({ sourceDir });
  const second = await compileRelease({ sourceDir, releaseId });
  assert.deepEqual([...first.resources], [...second.resources]);
  assert.deepEqual([...first.resources.keys()], ["diagnosis", "questions", "titles", "result-texts", "evidence", "presentation", "characters"]);
  assert.deepEqual(Object.keys(first.manifest), ["schemaVersion", "releaseId", "appVersion", "diagnosisId", "versions", "resources"]);
  for (const resource of first.manifest.resources) assert.equal(resource.sha256, createHash("sha256").update(first.resources.get(resource.kind)).digest("hex"));
  const presentation = JSON.parse(first.resources.get("presentation"));
  assert.equal(presentation.schemaVersion, 2);
  assert.equal(first.manifest.versions.presentationDefinitionVersion, presentationVersion);
  assert.deepEqual(Object.keys(presentation), [
    "fragranceMaterials",
    "fragrances",
    "paletteUsageMappings",
    "palettes",
    "presentationDefinitionVersion",
    "scenes",
    "schemaVersion",
    "titleSelectors",
  ]);
  assert.equal(Object.hasOwn(presentation, "fragranceMaterialExamples"), false);
  assert.equal(first.manifest.resources.length, 7);
  assert.equal(first.manifest.resources[5].kind, "presentation");
  assert.doesNotMatch(first.resources.get("result-texts"), /reviewer|human note|approved_on/);
});

test("T-006 rejects unselected and unapproved releases", async (t) => {
  const empty = await createApprovedSourceTree(t);
  await writeTable(empty, "releases/release-manifest.csv", []);
  await writeTable(empty, "releases/release-history.csv", []);
  await assert.rejects(() => compileRelease({ sourceDir: empty }), (error) => error.code === "RELEASE_NOT_SELECTED");
  const sourceDir = await createApprovedSourceTree(t, { manifestStatus: "draft" });
  await assert.rejects(() => compileRelease({ sourceDir }), (error) => error.code === "RELEASE_CONTENT_NOT_APPROVED");
});

test("T-006 rejects approval order, approval metadata, and history tuple failures", async (t) => {
  for (const mutate of [
    (sourceDir) => replaceInFile(path.join(sourceDir, "approvals", "result-content-approvals.csv"), '"E-0","1"', '"E-1","1"'),
    (sourceDir) => replaceInFile(path.join(sourceDir, "approvals", "result-content-approvals.csv"), '"2026-07-26"', '"2026-02-30"'),
    (sourceDir) => replaceInFile(path.join(sourceDir, "approvals", "result-content-approvals.csv"), '"approved","reviewer","2026-07-26"', '"draft","reviewer","2026-07-26"'),
  ]) {
    const sourceDir = await createApprovedSourceTree(t); await mutate(sourceDir);
    await assert.rejects(() => validateAuthoringTree({ sourceDir }), (error) => error.code === "CONTENT_APPROVAL_PENDING");
  }
  const sourceDir = await createApprovedSourceTree(t);
  await replaceInFile(path.join(sourceDir, "releases", "release-history.csv"), appMeta.cardTemplateVersion, "card-template-v9");
  await assert.rejects(() => compileRelease({ sourceDir }), (error) => error.code === "RELEASE_HISTORY_MISMATCH");
});

test("T-006 rejects every selected diagnostic-definition version mismatch", async (t) => {
  for (const fileName of ["diagnosis-sets.csv", "diagnosis-sources.csv", "diagnosis-limitations.csv", "factor-definitions.csv"]) {
    const sourceDir = await createApprovedSourceTree(t);
    await replaceInFile(path.join(sourceDir, "diagnoses", diagnosticVersion, fileName), diagnosticVersion, "diagnostic-definition-v2");
    await assert.rejects(() => compileRelease({ sourceDir }), (error) => error.code === "RELEASE_VERSION_REFERENCE_INVALID", fileName);
  }
});

test("T-006 canonicalJson rejects all non-JSON and noncanonical structures", () => {
  const cycle = {}; cycle.self = cycle;
  const sparse = []; sparse[1] = "x";
  class Unsupported {}
  const symbolProperty = { valid: true }; symbolProperty[Symbol("hidden")] = "x";
  const accessor = {}; Object.defineProperty(accessor, "hidden", { enumerable: true, get: () => "x" });
  for (const value of [undefined, NaN, Infinity, 1n, Symbol("x"), () => {}, cycle, sparse, new Unsupported(), Object.create(null), symbolProperty, accessor]) {
    assert.throws(() => canonicalJson(value), /CANONICAL_JSON_INVALID/);
  }
  assert.equal(canonicalJson({ z: 1, a: 2 }), "{\n  \"a\": 2,\n  \"z\": 1\n}\n");
});

test("T-006 writer rejects manifest, record, version, and resource additions before replacement", async (t) => {
  const sourceDir = await createApprovedSourceTree(t); const compiled = await compileRelease({ sourceDir });
  const parent = await mkdtemp(path.join(os.tmpdir(), "big-five-exact-output-")); t.after(() => rm(parent, { recursive: true, force: true }));
  const output = path.join(parent, "release"); await mkdir(output); await writeFile(path.join(output, "marker.txt"), "prior", "utf8");
  const cases = [];
  const rootExtra = cloneCompiled(compiled); rootExtra.manifest.extra = true; cases.push(rootExtra);
  const versionExtra = cloneCompiled(compiled); versionExtra.manifest.versions.extra = "v1"; cases.push(versionExtra);
  const recordExtra = cloneCompiled(compiled); recordExtra.manifest.resources[0].status = "approved"; cases.push(recordExtra);
  const wrongSchema = cloneCompiled(compiled); wrongSchema.manifest.schemaVersion = 2; cases.push(wrongSchema);
  const noncanonical = cloneCompiled(compiled); noncanonical.resources.set("questions", ` ${noncanonical.resources.get("questions")}`); noncanonical.manifest.resources[1].sha256 = createHash("sha256").update(noncanonical.resources.get("questions")).digest("hex"); cases.push(noncanonical);
  const metadata = cloneCompiled(compiled); const titleValue = JSON.parse(metadata.resources.get("titles")); titleValue[0].status = "approved"; metadata.resources.set("titles", canonicalJson(titleValue)); metadata.manifest.resources[2].sha256 = createHash("sha256").update(metadata.resources.get("titles")).digest("hex"); cases.push(metadata);
  const invalidCharacter = cloneCompiled(compiled); const characterValue = JSON.parse(invalidCharacter.resources.get("characters")); characterValue.entries[0].integrity = "not-an-integrity"; invalidCharacter.resources.set("characters", canonicalJson(characterValue)); invalidCharacter.manifest.resources[6].sha256 = createHash("sha256").update(invalidCharacter.resources.get("characters")).digest("hex"); cases.push(invalidCharacter);
  for (const alt of ["   ", "第1位の猫", "#1 cat"]) {
    const forgedCharacter = cloneCompiled(compiled);
    const forgedValue = JSON.parse(forgedCharacter.resources.get("characters"));
    forgedValue.entries[0].alt = alt;
    forgedCharacter.resources.set("characters", canonicalJson(forgedValue));
    forgedCharacter.manifest.resources[6].sha256 = createHash("sha256").update(forgedCharacter.resources.get("characters")).digest("hex");
    cases.push(forgedCharacter);
  }
  for (const invalid of cases) {
    await assert.rejects(() => writeReleaseAtomically({ outputDir: output, allowedParentDir: parent, compiled: invalid }), (error) => error.code === "RELEASE_RESOURCE_MISSING");
    assert.equal(await readFile(path.join(output, "marker.txt"), "utf8"), "prior");
  }
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

test("T-006 writer rejects backup collisions and restores prior output after switch failure", async (t) => {
  const sourceDir = await createApprovedSourceTree(t); const compiled = await compileRelease({ sourceDir });
  const parent = await mkdtemp(path.join(os.tmpdir(), "big-five-rollback-")); t.after(() => rm(parent, { recursive: true, force: true }));
  const output = path.join(parent, "release"); await mkdir(output); await writeFile(path.join(output, "marker.txt"), "prior", "utf8");
  await mkdir(`${output}.previous`);
  await assert.rejects(() => writeReleaseAtomically({ outputDir: output, allowedParentDir: parent, compiled }), (error) => error.code === "CONTENT_BACKUP_ALREADY_EXISTS");
  assert.equal(await readFile(path.join(output, "marker.txt"), "utf8"), "prior");
  await rm(`${output}.previous`, { recursive: true });
  const failingOps = { rename: async (from, to) => { if (to === output && path.basename(from).startsWith(".content-build-")) throw new Error("injected switch failure"); return rename(from, to); } };
  await assert.rejects(
    () => writeReleaseAtomically({ outputDir: output, allowedParentDir: parent, compiled, _fileOps: failingOps }),
    (error) => error.code === "CONTENT_OUTPUT_WRITE_FAILED" && !error.message.includes("injected"),
  );
  assert.equal(await readFile(path.join(output, "marker.txt"), "utf8"), "prior");
  await assert.rejects(() => readFile(`${output}.previous`, "utf8"), { code: "ENOENT" });
});

test("T-006 validation CLI writes identical sanitized reports on success and failure", async (t) => {
  const sourceDir = await createApprovedSourceTree(t);
  const reportDir = await mkdtemp(path.join(os.tmpdir(), "big-five-report-")); t.after(() => rm(reportDir, { recursive: true, force: true }));
  const reportPath = path.join(reportDir, "report.md");
  const cli = path.join(ROOT, "scripts", "content", "validate-content.mjs");
  const success = await execFileAsync(process.execPath, [cli, "--source", sourceDir, "--report", reportPath]);
  assert.equal(await readFile(reportPath, "utf8"), success.stdout);
  await replaceInFile(path.join(sourceDir, "questions", appMeta.diagnosticVersions.questionVersion, "questions.csv"), '"question_id"', '"raw-secret-column"');
  const absoluteSecret = path.resolve(sourceDir);
  let failure;
  try { await execFileAsync(process.execPath, [cli, "--source", sourceDir, "--report", reportPath]); } catch (error) { failure = error; }
  assert.equal(failure.code, 1);
  assert.equal(await readFile(reportPath, "utf8"), failure.stdout);
  assert.doesNotMatch(failure.stdout, new RegExp(absoluteSecret.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(failure.stdout, /raw-secret-column/);
  let reportFailure;
  try { await execFileAsync(process.execPath, [cli, "--source", sourceDir, "--report", reportDir]); } catch (error) { reportFailure = error; }
  assert.equal(reportFailure.code, 1);
  assert.match(reportFailure.stdout, /CONTENT_REPORT_WRITE_FAILED/);
  assert.doesNotMatch(reportFailure.stdout, new RegExp(reportDir.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("T-006 build CLI rejects missing, duplicate, and unknown arguments safely", async () => {
  const cli = path.join(ROOT, "scripts", "content", "build-content.mjs");
  for (const args of [[], ["--source", "x", "--source", "y"], ["--unknown", "x"]]) {
    let failure; try { await execFileAsync(process.execPath, [cli, ...args]); } catch (error) { failure = error; }
    assert.equal(failure.code, 1);
    assert.match(failure.stderr, /CONTENT_CLI_ARGUMENT_INVALID/);
    assert.doesNotMatch(failure.stderr, /x|y/);
  }
});
