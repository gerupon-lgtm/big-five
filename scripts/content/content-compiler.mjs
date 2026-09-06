import { createHash } from "node:crypto";
import { lstat, mkdir, mkdtemp, readFile, readdir, realpath, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { appMeta } from "../../app/js/config/app-meta.js";
import { validateDefinitionStructure, validateResultContentDefinitions } from "../../app/js/domain/definition-validator.js";
import { validatePresentationDefinitionSet } from "../../app/js/domain/presentation-definition-validator.js";
import { validateTitleProfileDefinitions } from "../../app/js/domain/title-profile.js";
import { assertCharacterReleaseEligible, compileCharacterContent, isValidCharacterAlt } from "./compile-characters.mjs";
import { compileDiagnosisContent } from "./compile-diagnosis.mjs";
import { compilePresentationContent } from "./compile-presentation.mjs";
import { assertReleaseEligible, compileResultContent } from "./compile-result-content.mjs";
import { ContentError } from "./content-error.mjs";
import { loadTableSchema } from "./schema-loader.mjs";
import { loadCsvTable } from "./table-loader.mjs";

const ROOT_DIR = fileURLToPath(new URL("../../", import.meta.url));
const SCHEMA_DIR = path.join(ROOT_DIR, "content", "schemas");
const RESOURCE_KINDS = Object.freeze(["diagnosis", "questions", "titles", "result-texts", "evidence", "presentation", "characters"]);
const APPROVAL_IDS = Object.freeze(["E-0", "E-1", "E-2", "E-3", "E-4", "E-5", "T-0", "T-1", "T-2", "T-3", "T-4", "F-1", "F-2", "F-3", "F-4", "F-5", "X-1", "X-2"]);
const PRESENTATION_APPROVAL_GATES = Object.freeze([
  Object.freeze({ gateId: "P-0", scope: "palette-mapping-wcag" }),
  Object.freeze({ gateId: "P-1", scope: "fragrance-vocabulary-materials" }),
  Object.freeze({ gateId: "P-2", scope: "titles-balanced-and-single-01-11" }),
  Object.freeze({ gateId: "P-3", scope: "titles-pair-01-10" }),
  Object.freeze({ gateId: "P-4", scope: "titles-pair-11-20" }),
  Object.freeze({ gateId: "P-5", scope: "titles-pair-21-30" }),
  Object.freeze({ gateId: "P-6", scope: "titles-pair-31-40" }),
]);
const RELEASE_FIELDS = Object.freeze(["release_id", "app_version", "diagnosis_id", "diagnostic_definition_version", "scale_version", "question_version", "scoring_version", "result_evidence_version", "result_text_version", "title_rule_version", "character_manifest_version", "presentation_definition_version", "card_template_version", "status"]);
const VERSION_DIRS = Object.freeze({
  diagnostic_definition_version: "diagnoses",
  question_version: "questions",
  title_rule_version: "titles",
  result_text_version: "result-texts",
  result_evidence_version: "evidence",
  presentation_definition_version: "presentation",
  character_manifest_version: "characters",
});
const TABLES = Object.freeze([
  ["diagnosisRows", "diagnoses", "diagnostic_definition_version", "diagnosis-sets.csv"],
  ["sourceRows", "diagnoses", "diagnostic_definition_version", "diagnosis-sources.csv"],
  ["limitationRows", "diagnoses", "diagnostic_definition_version", "diagnosis-limitations.csv"],
  ["factorRows", "diagnoses", "diagnostic_definition_version", "factor-definitions.csv"],
  ["questionRows", "questions", "question_version", "questions.csv"],
  ["previewRows", "questions", "question_version", "preview-questions.csv"],
  ["profileRows", "titles", "title_rule_version", "title-profiles.csv"],
  ["profileFactorRows", "titles", "title_rule_version", "title-profile-factors.csv"],
  ["textRows", "result-texts", "result_text_version", "result-texts.csv"],
  ["textEvidenceRows", "result-texts", "result_text_version", "result-text-evidence.csv"],
  ["titleReflectionRows", "result-texts", "result_text_version", "title-reflection-comments.csv", true],
  ["evidenceRows", "evidence", "result_evidence_version", "result-evidence.csv"],
  ["evidenceClaimRows", "evidence", "result_evidence_version", "result-evidence-claims.csv"],
  ["sceneRows", "presentation", "presentation_definition_version", "scenes.csv"],
  ["paletteRows", "presentation", "presentation_definition_version", "palettes.csv"],
  ["paletteUsageRows", "presentation", "presentation_definition_version", "palette-usage-mappings.csv"],
  ["fragranceRows", "presentation", "presentation_definition_version", "fragrances.csv"],
  ["fragranceMaterialRows", "presentation", "presentation_definition_version", "fragrance-materials.csv"],
  ["fragranceMaterialExampleRows", "presentation", "presentation_definition_version", "fragrance-material-examples.csv"],
  ["selectorRows", "presentation", "presentation_definition_version", "presentation-selectors.csv"],
  ["selectorPaletteRows", "presentation", "presentation_definition_version", "selector-palettes.csv"],
  ["selectorFragranceRows", "presentation", "presentation_definition_version", "selector-fragrances.csv"],
  ["characterRows", "characters", "character_manifest_version", "characters.csv"],
]);
const CORE_TABLE_NAMES = new Set([
  "diagnosisRows", "sourceRows", "limitationRows", "factorRows", "questionRows",
  "previewRows", "profileRows", "profileFactorRows", "textRows", "textEvidenceRows", "titleReflectionRows",
  "evidenceRows", "evidenceClaimRows",
]);
const CORE_TABLES = TABLES.filter(([name]) => CORE_TABLE_NAMES.has(name));
const OPTIONAL_TABLES = TABLES.filter(([name]) => !CORE_TABLE_NAMES.has(name));
const PRESENTATION_TABLES = OPTIONAL_TABLES.filter(([, topDir]) => topDir === "presentation");
const CHARACTER_TABLES = OPTIONAL_TABLES.filter(([, topDir]) => topDir === "characters");
const VERSION_CATALOGS = Object.freeze([
  CORE_TABLES.filter(([, topDir]) => topDir === "diagnoses"),
  CORE_TABLES.filter(([, topDir]) => topDir === "questions"),
  CORE_TABLES.filter(([, topDir]) => topDir === "titles"),
  CORE_TABLES.filter(([, topDir]) => topDir === "result-texts"),
  CORE_TABLES.filter(([, topDir]) => topDir === "evidence"),
  PRESENTATION_TABLES,
  CHARACTER_TABLES,
]);
const MANIFEST_ORDER = ["schemaVersion", "releaseId", "appVersion", "diagnosisId", "versions", "resources"];
const VERSION_ORDER = ["diagnosticDefinitionVersion", "scaleVersion", "questionVersion", "scoringVersion", "resultEvidenceVersion", "resultTextVersion", "titleRuleVersion", "characterManifestVersion", "presentationDefinitionVersion", "cardTemplateVersion"];

function contentError(code, message = "コンテンツ定義を確認してください。", extra = {}) {
  return new ContentError({ code, message, ...extra });
}

function safeReleaseId(value) {
  return typeof value === "string" && /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(value) && !value.includes("..") && !/[\\/:?#]/.test(value);
}

function isWithin(parent, target) {
  const relative = path.relative(parent, target);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

async function exists(filePath) {
  try { await lstat(filePath); return true; } catch (error) { if (error.code === "ENOENT") return false; throw error; }
}

async function regularDirectory(filePath) {
  const info = await lstat(filePath);
  return info.isDirectory() && !info.isSymbolicLink();
}

async function safeSourcePath(sourceDir, segments) {
  const sourceReal = await realpath(sourceDir).catch(() => { throw contentError("RELEASE_RESOURCE_MISSING"); });
  const target = path.resolve(sourceReal, ...segments);
  if (!isWithin(sourceReal, target) && target !== sourceReal) throw contentError("RELEASE_VERSION_REFERENCE_INVALID");
  const targetReal = await realpath(target).catch(() => { throw contentError("RELEASE_RESOURCE_MISSING"); });
  if (!isWithin(sourceReal, targetReal)) throw contentError("RELEASE_VERSION_REFERENCE_INVALID");
  return targetReal;
}

async function loadSchema(name) {
  return loadTableSchema(path.join(SCHEMA_DIR, `${name.replace(/\.csv$/, "")}.schema.json`));
}

async function loadNamedTable(sourceDir, segments, schemaName) {
  const schema = await loadSchema(schemaName);
  const filePath = await safeSourcePath(sourceDir, [...segments, schema.fileName]);
  try {
    const table = await loadCsvTable({ filePath, schema });
    return { rows: table.rows, sourceName: path.posix.join(...segments, schema.fileName) };
  } catch (error) {
    if (error instanceof ContentError) throw error;
    throw contentError("RELEASE_RESOURCE_MISSING");
  }
}

async function loadOptionalNamedTable(sourceDir, segments, schemaName) {
  try {
    return await loadNamedTable(sourceDir, segments, schemaName);
  } catch (error) {
    if (!(error instanceof ContentError) || error.code !== "RELEASE_RESOURCE_MISSING") throw error;
    const schema = await loadSchema(schemaName);
    return {
      rows: [],
      sourceName: path.posix.join(...segments, schema.fileName),
    };
  }
}

async function discoverVersions(sourceDir, topDir, { optional = false } = {}) {
  let directory;
  try {
    directory = await safeSourcePath(sourceDir, [topDir]);
  } catch (error) {
    if (optional && error instanceof ContentError && error.code === "RELEASE_RESOURCE_MISSING") return [];
    throw error;
  }
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => {
    throw contentError("RELEASE_RESOURCE_MISSING");
  });
  entries.sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
  if (entries.length === 0 && optional) return [];
  if (entries.length === 0 || entries.some((entry) =>
    entry.isSymbolicLink() || !entry.isDirectory() || !safeReleaseId(entry.name))) {
    throw contentError("RELEASE_VERSION_REFERENCE_INVALID");
  }
  return entries.map(({ name }) => name);
}

function validateHistory(rows) {
  if (new Set(rows.map((row) => row.release_sequence)).size !== rows.length ||
    new Set(rows.map((row) => row.release_id)).size !== rows.length ||
    !rows.every((row, index) => row.release_sequence === index + 1 && row.status === "approved")) {
    throw contentError("RELEASE_HISTORY_MISMATCH", "公開履歴の連番または承認状態が不正です。");
  }
}

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function validateApprovals(rows) {
  if (rows.length !== APPROVAL_IDS.length || !rows.every((row, index) => row.gate_id === APPROVAL_IDS[index] && row.display_order === index + 1)) {
    throw contentError("CONTENT_APPROVAL_PENDING", "承認ゲートのIDまたは順序が不正です。");
  }
  for (const row of rows) {
    const hasApproval = row.approved_by.trim() !== "" || row.approved_on.trim() !== "";
    if (row.status === "approved") {
      if (!row.approved_by.trim() || !validDate(row.approved_on)) throw contentError("CONTENT_APPROVAL_PENDING", "承認済みゲートの承認者または日付が不正です。");
    } else if (hasApproval) {
      throw contentError("CONTENT_APPROVAL_PENDING", "未承認ゲートに承認者または日付を設定できません。");
    }
  }
}

function validatePresentationApprovals(rows) {
  if (rows.length !== PRESENTATION_APPROVAL_GATES.length || !rows.every((row, index) => {
    const gate = PRESENTATION_APPROVAL_GATES[index];
    return row.gate_id === gate.gateId &&
      row.display_order === index + 1 &&
      row.scope === gate.scope;
  })) {
    throw contentError("PRESENTATION_APPROVAL_PENDING", "Q-013承認ゲートのID、順序、または対象範囲が不正です。");
  }
  for (const row of rows) {
    const hasApproval = row.approved_by.trim() !== "" || row.approved_on.trim() !== "";
    if (row.status === "approved") {
      if (!row.approved_by.trim() || !validDate(row.approved_on)) {
        throw contentError("PRESENTATION_APPROVAL_PENDING", "承認済みQ-013ゲートの承認者または日付が不正です。");
      }
    } else if (hasApproval) {
      throw contentError("PRESENTATION_APPROVAL_PENDING", "未承認Q-013ゲートに承認者または日付を設定できません。");
    }
  }
}

function warningRows(catalogs) {
  return warningEntries(Object.entries(catalogs));
}

function warningEntries(entries) {
  const warnings = [];
  for (const [name, table] of entries) {
    if (!Array.isArray(table.rows)) continue;
    table.rows.forEach((row, index) => {
      if (Object.hasOwn(row, "status") && row.status !== "approved") {
        warnings.push(Object.freeze({ sourceName: table.sourceName, lineNumber: index + 2, code: "CONTENT_NOT_APPROVED", message: `${name} は未承認です。` }));
      }
    });
  }
  return Object.freeze(warnings);
}

function freezeCatalogs(catalogs) {
  return Object.freeze(Object.fromEntries(Object.entries(catalogs).map(([name, table]) => [name, Object.freeze({
    sourceName: table.sourceName,
    rows: Object.freeze(table.rows.map((row) => Object.freeze({ ...row }))),
  })])));
}

async function loadTables(sourceDir, row, definitions) {
  const result = {};
  for (const [name, topDir, versionField, fileName, optional] of definitions) {
    const version = row[versionField];
    if (!safeReleaseId(version)) throw contentError("RELEASE_VERSION_REFERENCE_INVALID");
    result[name] = optional
      ? await loadOptionalNamedTable(sourceDir, [topDir, version], fileName)
      : await loadNamedTable(sourceDir, [topDir, version], fileName);
  }
  return result;
}

function assertDirectoryVersion(catalogs, versionField, version) {
  if (!Object.values(catalogs).every(({ rows }) =>
    rows.every((row) => !Object.hasOwn(row, versionField) || row[versionField] === version))) {
    throw contentError("RELEASE_VERSION_REFERENCE_INVALID", "版ディレクトリと行の版参照が一致しません。");
  }
}

async function loadAuthoredVersions(sourceDir, definitions, { optional = false } = {}) {
  const [, topDir, versionField] = definitions[0];
  const versions = await discoverVersions(sourceDir, topDir, { optional });
  const catalogsByVersion = new Map();
  for (const version of versions) {
    const catalogs = await loadTables(sourceDir, { [versionField]: version }, definitions);
    assertDirectoryVersion(catalogs, versionField, version);
    catalogsByVersion.set(version, catalogs);
  }
  return { topDir, versionField, versions, catalogsByVersion };
}

function normalizedSemanticError(error) {
  if (error instanceof ContentError) return error;
  return contentError("RELEASE_VERSION_REFERENCE_INVALID", "コンテンツの版参照が不正です。");
}

function compileDiagnosisCatalogPair(diagnosisCatalogs, questionCatalogs, questionVersion = undefined) {
  const diagnosisRows = questionVersion === undefined
    ? diagnosisCatalogs.diagnosisRows.rows
    : diagnosisCatalogs.diagnosisRows.rows.map((row) => ({ ...row, question_version: questionVersion }));
  return compileDiagnosisContent({
    diagnosisRows,
    sourceRows: diagnosisCatalogs.sourceRows.rows,
    limitationRows: diagnosisCatalogs.limitationRows.rows,
    factorRows: diagnosisCatalogs.factorRows.rows,
    questionRows: questionCatalogs.questionRows.rows,
    previewRows: questionCatalogs.previewRows.rows,
  });
}

function validateDiagnosisAndQuestionVersions(diagnosisCatalog, questionCatalog) {
  for (const diagnosisVersion of diagnosisCatalog.versions) {
    const catalogs = diagnosisCatalog.catalogsByVersion.get(diagnosisVersion);
    const referencedQuestionVersion = catalogs.diagnosisRows.rows[0]?.question_version;
    const questionCatalogs = questionCatalog.catalogsByVersion.get(referencedQuestionVersion);
    if (!questionCatalogs) throw contentError("RELEASE_VERSION_REFERENCE_INVALID", "診断定義が参照する設問版が存在しません。");
    try {
      compileDiagnosisCatalogPair(catalogs, questionCatalogs);
    } catch (error) {
      throw normalizedSemanticError(error);
    }
  }

  for (const questionVersion of questionCatalog.versions) {
    const questionCatalogs = questionCatalog.catalogsByVersion.get(questionVersion);
    let firstFailure;
    let validated = false;
    for (const diagnosisVersion of diagnosisCatalog.versions) {
      const diagnosisCatalogs = diagnosisCatalog.catalogsByVersion.get(diagnosisVersion);
      try {
        compileDiagnosisCatalogPair(diagnosisCatalogs, questionCatalogs, questionVersion);
        validated = true;
        break;
      } catch (error) {
        firstFailure ??= error;
      }
    }
    if (!validated) throw normalizedSemanticError(firstFailure);
  }
}

function combinations(groups, visit, index = 0, current = []) {
  if (index === groups.length) {
    visit(current);
    return;
  }
  for (const version of groups[index].versions) {
    current.push(version);
    combinations(groups, visit, index + 1, current);
    current.pop();
  }
}

function validateResultVersions(titleCatalog, textCatalog, evidenceCatalog) {
  const groups = [titleCatalog, textCatalog, evidenceCatalog];
  const validated = groups.map(() => new Set());
  const firstFailures = groups.map(() => new Map());
  const titleProfileContexts = [];

  combinations(groups, (versions) => {
    if (versions.every((version, index) => validated[index].has(version))) return;
    const [titleVersion, textVersion, evidenceVersion] = versions;
    const titleCatalogs = titleCatalog.catalogsByVersion.get(titleVersion);
    const textCatalogs = textCatalog.catalogsByVersion.get(textVersion);
    const evidenceCatalogs = evidenceCatalog.catalogsByVersion.get(evidenceVersion);
    try {
      const compiled = compileResultContent({
        profileRows: titleCatalogs.profileRows.rows,
        profileFactorRows: titleCatalogs.profileFactorRows.rows,
        textRows: textCatalogs.textRows.rows,
        textEvidenceRows: textCatalogs.textEvidenceRows.rows,
        titleReflectionRows: textCatalogs.titleReflectionRows.rows,
        evidenceRows: evidenceCatalogs.evidenceRows.rows,
        evidenceClaimRows: evidenceCatalogs.evidenceClaimRows.rows,
        titleRuleVersion: titleVersion,
        resultTextVersion: textVersion,
      });
      versions.forEach((version, index) => validated[index].add(version));
      titleProfileContexts.push(compiled.titleProfiles);
    } catch (error) {
      versions.forEach((version, index) => {
        if (!firstFailures[index].has(version)) firstFailures[index].set(version, error);
      });
    }
  });

  for (const [index, group] of groups.entries()) {
    for (const version of group.versions) {
      if (!validated[index].has(version)) throw normalizedSemanticError(firstFailures[index].get(version));
    }
  }
  return titleProfileContexts;
}

function validateOptionalVersions(catalog, titleProfileContexts, compile) {
  for (const version of catalog.versions) {
    const catalogs = catalog.catalogsByVersion.get(version);
    let firstFailure;
    let validated = false;
    for (const titleProfiles of titleProfileContexts) {
      try {
        compile(catalogs, { [catalog.versionField]: version }, titleProfiles);
        validated = true;
        break;
      } catch (error) {
        firstFailure ??= error;
      }
    }
    if (!validated) throw normalizedSemanticError(firstFailure);
  }
}

function validateAllAuthoredSemantics(authoredByField) {
  const diagnosisCatalog = authoredByField.get("diagnostic_definition_version");
  const questionCatalog = authoredByField.get("question_version");
  const titleCatalog = authoredByField.get("title_rule_version");
  const textCatalog = authoredByField.get("result_text_version");
  const evidenceCatalog = authoredByField.get("result_evidence_version");
  validateDiagnosisAndQuestionVersions(diagnosisCatalog, questionCatalog);
  const titleProfileContexts = validateResultVersions(titleCatalog, textCatalog, evidenceCatalog);
  validateOptionalVersions(
    authoredByField.get("presentation_definition_version"),
    titleProfileContexts,
    compilePresentationCatalog,
  );
  validateOptionalVersions(
    authoredByField.get("character_manifest_version"),
    titleProfileContexts,
    compileCharacterCatalog,
  );
}

function compileCoreCatalogs(catalogs, row) {
  try {
    const get = (name) => catalogs[name].rows;
    const diagnosis = compileDiagnosisContent({
      diagnosisRows: get("diagnosisRows"), sourceRows: get("sourceRows"), limitationRows: get("limitationRows"), factorRows: get("factorRows"), questionRows: get("questionRows"), previewRows: get("previewRows"),
    });
    const result = compileResultContent({
      profileRows: get("profileRows"), profileFactorRows: get("profileFactorRows"), textRows: get("textRows"), textEvidenceRows: get("textEvidenceRows"), titleReflectionRows: get("titleReflectionRows"), evidenceRows: get("evidenceRows"), evidenceClaimRows: get("evidenceClaimRows"), titleRuleVersion: row.title_rule_version, resultTextVersion: row.result_text_version,
    });
    return { diagnosis, result };
  } catch (error) {
    if (error instanceof ContentError) throw error;
    throw contentError("RELEASE_VERSION_REFERENCE_INVALID", "コンテンツの版参照が不正です。");
  }
}

function compilePresentationCatalog(catalogs, row, titleProfiles) {
  const get = (name) => catalogs[name].rows;
  return compilePresentationContent({
    sceneRows: get("sceneRows"), paletteRows: get("paletteRows"), paletteUsageRows: get("paletteUsageRows"), fragranceRows: get("fragranceRows"), fragranceMaterialRows: get("fragranceMaterialRows"), fragranceMaterialExampleRows: get("fragranceMaterialExampleRows"), selectorRows: get("selectorRows"), selectorPaletteRows: get("selectorPaletteRows"), selectorFragranceRows: get("selectorFragranceRows"), titleProfiles,
  }, row.presentation_definition_version);
}

function compileCharacterCatalog(catalogs, row, titleProfiles) {
  return compileCharacterContent({ rows: catalogs.characterRows.rows, titleProfiles }, row.character_manifest_version);
}

function compileOptionalCatalogs(catalogs, row, core) {
  try {
    const presentation = compilePresentationCatalog(catalogs, row, core.result.titleProfiles);
    const characters = compileCharacterCatalog(catalogs, row, core.result.titleProfiles);
    return { ...core, presentation, characters };
  } catch (error) {
    if (error instanceof ContentError) throw error;
    throw contentError("RELEASE_VERSION_REFERENCE_INVALID", "コンテンツの版参照が不正です。");
  }
}

async function loadBaseCatalogs(sourceDir) {
  const releaseManifest = await loadNamedTable(sourceDir, ["releases"], "release-manifest.csv");
  if (releaseManifest.rows.length > 1) throw contentError("RELEASE_MULTIPLE_SELECTED", "リリース定義は0行または1行にしてください。");
  const releaseHistory = await loadNamedTable(sourceDir, ["releases"], "release-history.csv");
  validateHistory(releaseHistory.rows);
  const approvals = await loadNamedTable(sourceDir, ["approvals"], "result-content-approvals.csv");
  validateApprovals(approvals.rows);
  const presentationApprovals = await loadNamedTable(sourceDir, ["approvals"], "presentation-content-approvals.csv");
  validatePresentationApprovals(presentationApprovals.rows);
  return { releaseManifest, releaseHistory, approvals, presentationApprovals };
}

export async function validateAuthoringTree({ sourceDir }) {
  const base = await loadBaseCatalogs(sourceDir);
  const catalogs = {
    releaseManifest: base.releaseManifest,
    releaseHistory: base.releaseHistory,
    approvals: base.approvals,
    presentationApprovals: base.presentationApprovals,
  };
  const extraWarnings = [];
  const authored = [];
  for (const definitions of VERSION_CATALOGS) {
    const topDir = definitions[0][1];
    authored.push(await loadAuthoredVersions(sourceDir, definitions, {
      optional: topDir === "presentation" || topDir === "characters",
    }));
  }
  const authoredByField = new Map(authored.map((catalog) => [catalog.versionField, catalog]));
  validateAllAuthoredSemantics(authoredByField);
  const authoredEntries = authored.flatMap(({ versions, catalogsByVersion }) =>
    versions.flatMap((version) => Object.entries(catalogsByVersion.get(version))));
  const selectedRelease = base.releaseManifest.rows.length === 1;
  let release = selectedRelease ? { ...base.releaseManifest.rows[0] } : null;
  let core = null;

  if (selectedRelease) {
    for (const { versionField, catalogsByVersion } of authored.slice(0, 5)) {
      const selectedCatalogs = catalogsByVersion.get(release[versionField]);
      if (!selectedCatalogs) throw contentError("RELEASE_RESOURCE_MISSING");
      Object.assign(catalogs, selectedCatalogs);
    }
    core = compileCoreCatalogs(catalogs, release);
    assertReleaseVersionReferences(catalogs, core, release);
  } else if (authored.every(({ versions }) => versions.length <= 1)) {
    release = Object.fromEntries(authored.slice(0, 5).map(({ versionField, versions }) => [versionField, versions[0]]));
    for (const { versions, catalogsByVersion } of authored.slice(0, 5)) {
      Object.assign(catalogs, catalogsByVersion.get(versions[0]));
    }
    core = compileCoreCatalogs(catalogs, release);
  }

  if (base.releaseManifest.rows.length === 0) {
    extraWarnings.push({ sourceName: "releases/release-manifest.csv", lineNumber: 1, code: "RELEASE_NOT_SELECTED", message: "公開するリリースが選択されていません。" });
  }
  for (const [field, code, sourceName, compile] of [
    ["presentation_definition_version", "PRESENTATION_CATALOG_PENDING", "presentation", compilePresentationCatalog],
    ["character_manifest_version", "CHARACTER_CATALOG_PENDING", "characters", compileCharacterCatalog],
  ]) {
    const authoredCatalog = authoredByField.get(field);
    const version = selectedRelease ? release[field] : authoredCatalog.versions[0];
    const selectedCatalogs = authoredCatalog.catalogsByVersion.get(version);
    if (!selectedCatalogs) {
      if (selectedRelease && release.status === "approved") throw contentError("RELEASE_RESOURCE_MISSING");
      extraWarnings.push({ sourceName, code, message: "公開用カタログは準備中です。" });
    } else if (core && (selectedRelease || authoredCatalog.versions.length === 1)) {
      release[field] = version;
      Object.assign(catalogs, selectedCatalogs);
      try {
        compile(catalogs, release, core.result.titleProfiles);
      } catch (error) {
        if (error instanceof ContentError) throw error;
        throw contentError("RELEASE_VERSION_REFERENCE_INVALID", "コンテンツの版参照が不正です。");
      }
    }
  }
  const frozen = freezeCatalogs(catalogs);
  const selectedSources = new Set(Object.values(catalogs).map(({ sourceName }) => sourceName));
  const unselectedEntries = authoredEntries.filter(([, { sourceName }]) => !selectedSources.has(sourceName));
  return Object.freeze({
    catalogs: frozen,
    warnings: Object.freeze([
      ...warningRows(frozen),
      ...warningEntries(unselectedEntries),
      ...extraWarnings.map(Object.freeze),
    ]),
  });
}

function sameRelease(left, right) {
  return RELEASE_FIELDS.every((field) => left[field] === right[field]);
}

function assertApprovedRows(catalogs) {
  for (const [name, table] of Object.entries(catalogs)) {
    if (name === "releaseManifest" || name === "releaseHistory" ||
      name === "approvals" || name === "presentationApprovals") continue;
    if (!table.rows.every((row) => row.status === "approved")) throw contentError("RELEASE_CONTENT_NOT_APPROVED", "公開対象に未承認のコンテンツがあります。");
  }
}

function assertPresentationReleaseEligible(catalogs) {
  const gatesApproved = catalogs.presentationApprovals?.rows.length === PRESENTATION_APPROVAL_GATES.length &&
    catalogs.presentationApprovals.rows.every((row) => row.status === "approved");
  const rowsApproved = PRESENTATION_TABLES.every(([name]) =>
    Array.isArray(catalogs[name]?.rows) &&
    catalogs[name].rows.every((row) => row.status === "approved"));
  if (!gatesApproved || !rowsApproved) {
    throw contentError("PRESENTATION_APPROVAL_PENDING", "Q-013演出コンテンツの承認が完了していません。");
  }
}

function assertReleaseVersionReferences(catalogs, compiled, release) {
  const diagnostic = compiled.diagnosis.diagnostic;
  const diagnosisVersionRows = ["diagnosisRows", "sourceRows", "limitationRows", "factorRows"].flatMap((name) => catalogs[name].rows);
  if (!diagnosisVersionRows.every((row) => row.diagnostic_definition_version === release.diagnostic_definition_version) ||
    diagnostic.diagnosisId !== release.diagnosis_id ||
    diagnostic.scaleVersion !== release.scale_version ||
    diagnostic.questionVersion !== release.question_version ||
    diagnostic.scoringVersion !== release.scoring_version ||
    diagnostic.resultTextVersion !== release.result_text_version ||
    diagnostic.titleRuleVersion !== release.title_rule_version ||
    !catalogs.evidenceRows.rows.every((row) => row.result_evidence_version === release.result_evidence_version)) {
    throw contentError("RELEASE_VERSION_REFERENCE_INVALID", "リリースとコンテンツの版参照が一致しません。");
  }
}

function resourcePath(releaseId, kind) {
  if (!safeReleaseId(releaseId) || !RESOURCE_KINDS.includes(kind)) throw contentError("RELEASE_VERSION_REFERENCE_INVALID");
  return `./${releaseId}/${kind}.json`;
}

function hasExactKeys(value, keys) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype &&
    Object.keys(value).join(",") === keys.join(",");
}

function hasExactProperties(value, keys) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype &&
    Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function orderedObject(value) {
  if (value === null || typeof value !== "object") {
    if (typeof value === "number" && !Number.isFinite(value)) throw new TypeError("CANONICAL_JSON_INVALID");
    if (["string", "number", "boolean"].includes(typeof value)) return value;
    throw new TypeError("CANONICAL_JSON_INVALID");
  }
  if (Array.isArray(value)) {
    if (Object.keys(value).length !== value.length) throw new TypeError("CANONICAL_JSON_INVALID");
    return value.map(orderedObject);
  }
  if (Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError("CANONICAL_JSON_INVALID");
  const keys = Object.keys(value);
  const order = keys.length === MANIFEST_ORDER.length && MANIFEST_ORDER.every((key) => Object.hasOwn(value, key)) ? MANIFEST_ORDER
    : keys.length === VERSION_ORDER.length && VERSION_ORDER.every((key) => Object.hasOwn(value, key)) ? VERSION_ORDER
      : keys.sort();
  return Object.fromEntries(order.map((key) => [key, orderedObject(value[key])]));
}

export function canonicalJson(value) {
  const seen = new WeakSet();
  function guard(item) {
    if (item && typeof item === "object") {
      if (seen.has(item)) throw new TypeError("CANONICAL_JSON_INVALID");
      if (Object.getOwnPropertySymbols(item).length > 0) throw new TypeError("CANONICAL_JSON_INVALID");
      const descriptors = Object.getOwnPropertyDescriptors(item);
      const arrayValue = Array.isArray(item);
      if (arrayValue) {
        const expectedKeys = [...Array.from({ length: item.length }, (_, index) => String(index)), "length"];
        if (Reflect.ownKeys(item).join(",") !== expectedKeys.join(",")) throw new TypeError("CANONICAL_JSON_INVALID");
      } else if (Object.getPrototypeOf(item) !== Object.prototype) {
        throw new TypeError("CANONICAL_JSON_INVALID");
      }
      for (const [key, descriptor] of Object.entries(descriptors)) {
        if (!(arrayValue && key === "length") && (!descriptor.enumerable || !Object.hasOwn(descriptor, "value"))) {
          throw new TypeError("CANONICAL_JSON_INVALID");
        }
      }
      seen.add(item);
      for (const [key, descriptor] of Object.entries(descriptors)) {
        if (!(arrayValue && key === "length") && Object.hasOwn(descriptor, "value")) guard(descriptor.value);
      }
      seen.delete(item);
    }
  }
  guard(value);
  return `${JSON.stringify(orderedObject(value), null, 2)}\n`;
}

export async function compileRelease({ sourceDir, releaseId = undefined }) {
  const validated = await validateAuthoringTree({ sourceDir });
  const rows = validated.catalogs.releaseManifest.rows;
  if (rows.length === 0) throw contentError("RELEASE_NOT_SELECTED", "公開するリリースが選択されていません。");
  if (rows.length !== 1) throw contentError("RELEASE_MULTIPLE_SELECTED");
  const release = rows[0];
  if (!safeReleaseId(release.release_id) || (releaseId !== undefined && (!safeReleaseId(releaseId) || releaseId !== release.release_id))) throw contentError("RELEASE_NOT_SELECTED");
  if (release.status !== "approved") throw contentError("RELEASE_CONTENT_NOT_APPROVED");
  if (release.app_version !== appMeta.appVersion || release.card_template_version !== appMeta.cardTemplateVersion) throw contentError("RELEASE_VERSION_REFERENCE_INVALID");
  const history = validated.catalogs.releaseHistory.rows.find((row) => row.release_id === release.release_id);
  if (!history || !sameRelease(history, release)) throw contentError("RELEASE_HISTORY_MISMATCH");
  const approvalStatus = Object.fromEntries(validated.catalogs.approvals.rows.map((row) => [row.gate_id, row.status]));
  const contentRows = ["profileRows", "profileFactorRows", "textRows", "textEvidenceRows", "evidenceRows", "evidenceClaimRows"].flatMap((name) => validated.catalogs[name].rows);
  assertReleaseEligible({
    rows: contentRows,
    titleReflectionRows: validated.catalogs.titleReflectionRows.rows,
    approvals: approvalStatus,
  });
  assertPresentationReleaseEligible(validated.catalogs);
  assertCharacterReleaseEligible(validated.catalogs.characterRows.rows);
  assertApprovedRows(validated.catalogs);
  if (!validated.catalogs.sceneRows || !validated.catalogs.characterRows) throw contentError("RELEASE_RESOURCE_MISSING");
  const core = compileCoreCatalogs(validated.catalogs, release);
  const compiled = compileOptionalCatalogs(validated.catalogs, release, core);
  assertReleaseVersionReferences(validated.catalogs, compiled, release);
  const values = new Map([
    ["diagnosis", { diagnostic: compiled.diagnosis.diagnostic, factors: compiled.diagnosis.factors }],
    ["questions", compiled.diagnosis.questions],
    ["titles", compiled.result.titleProfiles],
    ["result-texts", compiled.result.textDefinitions],
    ["evidence", compiled.result.evidenceDefinitions],
    ["presentation", compiled.presentation],
    ["characters", compiled.characters],
  ]);
  const resources = new Map([...values].map(([kind, value]) => [kind, canonicalJson(value)]));
  const versions = {
    diagnosticDefinitionVersion: release.diagnostic_definition_version,
    scaleVersion: release.scale_version,
    questionVersion: release.question_version,
    scoringVersion: release.scoring_version,
    resultEvidenceVersion: release.result_evidence_version,
    resultTextVersion: release.result_text_version,
    titleRuleVersion: release.title_rule_version,
    characterManifestVersion: release.character_manifest_version,
    presentationDefinitionVersion: release.presentation_definition_version,
    cardTemplateVersion: release.card_template_version,
  };
  const manifest = {
    schemaVersion: 1,
    releaseId: release.release_id,
    appVersion: release.app_version,
    diagnosisId: release.diagnosis_id,
    versions,
    resources: RESOURCE_KINDS.map((kind) => ({ kind, path: resourcePath(release.release_id, kind), sha256: createHash("sha256").update(resources.get(kind)).digest("hex") })),
  };
  return Object.freeze({ manifest: Object.freeze(manifest), resources });
}

function assertCompiled(compiled) {
  if (!compiled || !(compiled.resources instanceof Map) || !compiled.manifest ||
    compiled.resources.size !== RESOURCE_KINDS.length || [...compiled.resources.keys()].join(",") !== RESOURCE_KINDS.join(",") ||
    !hasExactKeys(compiled.manifest, MANIFEST_ORDER) ||
    compiled.manifest.schemaVersion !== 1 ||
    !safeReleaseId(compiled.manifest.releaseId) ||
    !safeReleaseId(compiled.manifest.appVersion) ||
    typeof compiled.manifest.diagnosisId !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(compiled.manifest.diagnosisId) ||
    !hasExactKeys(compiled.manifest.versions, VERSION_ORDER) ||
    !VERSION_ORDER.every((field) => safeReleaseId(compiled.manifest.versions[field])) ||
    !Array.isArray(compiled.manifest.resources) ||
    Object.keys(compiled.manifest.resources).length !== RESOURCE_KINDS.length ||
    compiled.manifest.resources.length !== RESOURCE_KINDS.length) throw contentError("RELEASE_RESOURCE_MISSING");
  const parsedResources = new Map();
  for (const [index, kind] of RESOURCE_KINDS.entries()) {
    const resource = compiled.manifest.resources[index];
    const json = compiled.resources.get(kind);
    if (!hasExactKeys(resource, ["kind", "path", "sha256"]) ||
      resource.kind !== kind || resource.path !== resourcePath(compiled.manifest.releaseId, kind) ||
      !/^[a-f0-9]{64}$/.test(resource.sha256) || typeof json !== "string" ||
      resource.sha256 !== createHash("sha256").update(json).digest("hex")) throw contentError("RELEASE_RESOURCE_MISSING");
    let parsed;
    try {
      parsed = JSON.parse(json);
      if (canonicalJson(parsed) !== json) throw new TypeError("NONCANONICAL");
    } catch {
      throw contentError("RELEASE_RESOURCE_MISSING");
    }
    parsedResources.set(kind, parsed);
  }
  try {
    const diagnosis = parsedResources.get("diagnosis");
    const questions = parsedResources.get("questions");
    const titles = parsedResources.get("titles");
    const textDefinitions = parsedResources.get("result-texts");
    const evidenceDefinitions = parsedResources.get("evidence");
    const presentation = parsedResources.get("presentation");
    const characters = parsedResources.get("characters");
    if (!hasExactProperties(diagnosis, ["diagnostic", "factors"])) throw new TypeError("INVALID");
    validateDefinitionStructure({ diagnostic: diagnosis.diagnostic, factors: diagnosis.factors, questions }, {
      scaleId: diagnosis.diagnostic.scaleId,
      scaleVersion: compiled.manifest.versions.scaleVersion,
      questionVersion: compiled.manifest.versions.questionVersion,
      scoringVersion: compiled.manifest.versions.scoringVersion,
      resultTextVersion: compiled.manifest.versions.resultTextVersion,
      titleRuleVersion: compiled.manifest.versions.titleRuleVersion,
    });
    if (diagnosis.diagnostic.diagnosisId !== compiled.manifest.diagnosisId) throw new TypeError("INVALID");
    validateTitleProfileDefinitions(titles);
    validateResultContentDefinitions({
      evidenceDefinitions,
      textDefinitions,
      titleProfiles: titles,
      resultTextVersion: compiled.manifest.versions.resultTextVersion,
    });
    if (!evidenceDefinitions.every(({ version }) => version === compiled.manifest.versions.resultEvidenceVersion)) throw new TypeError("INVALID");
    validatePresentationDefinitionSet(presentation, {
      titleProfiles: titles,
      expectedVersion: compiled.manifest.versions.presentationDefinitionVersion,
    });
    const entryFields = ["characterId", "assetVersion", "imagePath", "width", "height", "alt", "integrity"];
    if (!hasExactProperties(characters, ["characterManifestVersion", "entries"]) ||
      characters.characterManifestVersion !== compiled.manifest.versions.characterManifestVersion ||
      !Array.isArray(characters.entries) || characters.entries.length !== 51 ||
      Object.keys(characters.entries).length !== characters.entries.length ||
      !characters.entries.every((entry) => hasExactProperties(entry, entryFields) &&
        typeof entry.characterId === "string" && entry.characterId !== "" &&
        safeReleaseId(entry.assetVersion) &&
        typeof entry.imagePath === "string" && entry.imagePath.endsWith(".webp") &&
        !entry.imagePath.startsWith("/") && !entry.imagePath.includes("\\") &&
        !entry.imagePath.includes("?") && !entry.imagePath.includes("#") &&
        !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(entry.imagePath) &&
        !entry.imagePath.split("/").some((segment) => segment === "" || segment === "..") &&
        isValidCharacterAlt(entry.alt) &&
        /^sha256-[A-Za-z0-9+/]{43}=$/.test(entry.integrity) &&
        entry.width === 1024 && entry.height === 1024) ||
      new Set(characters.entries.map(({ characterId }) => characterId)).size !== 51 ||
      new Set(characters.entries.map(({ imagePath }) => imagePath)).size !== 51 ||
      !characters.entries.every((entry, index) => entry.characterId === titles[index].characterId)) throw new TypeError("INVALID");
  } catch {
    throw contentError("RELEASE_RESOURCE_MISSING");
  }
}

async function assertSafeOutputPath(outputDir, allowedParentDir) {
  const allowed = path.resolve(allowedParentDir);
  if (!await exists(allowed) || !await regularDirectory(allowed)) throw contentError("CONTENT_OUTPUT_PATH_INVALID");
  const realAllowed = await realpath(allowed);
  const output = path.resolve(outputDir);
  const home = path.resolve(process.env.USERPROFILE ?? process.env.HOME ?? "");
  if (path.parse(realAllowed).root === realAllowed || realAllowed === home || path.parse(output).root === output || output === realAllowed || output === home || !isWithin(realAllowed, output)) throw contentError("CONTENT_OUTPUT_PATH_INVALID");
  const parent = path.dirname(output);
  const existingParent = await realpath(parent).catch(() => { throw contentError("CONTENT_OUTPUT_PATH_INVALID"); });
  if (!isWithin(realAllowed, existingParent) && existingParent !== realAllowed) throw contentError("CONTENT_OUTPUT_PATH_INVALID");
  if (await exists(output)) {
    const outputInfo = await lstat(output);
    if (!outputInfo.isDirectory() || outputInfo.isSymbolicLink()) throw contentError("CONTENT_OUTPUT_PATH_INVALID");
  }
  return { output, parent: existingParent };
}

async function verifyTree(directory, compiled) {
  const manifest = await readFile(path.join(directory, "content-manifest.json"), "utf8");
  if (manifest !== canonicalJson(compiled.manifest)) throw contentError("RELEASE_RESOURCE_MISSING");
  for (const kind of RESOURCE_KINDS) {
    const actual = await readFile(path.join(directory, compiled.manifest.releaseId, kind + ".json"), "utf8");
    if (actual !== compiled.resources.get(kind)) throw contentError("RELEASE_RESOURCE_MISSING");
  }
}

export async function writeReleaseAtomically({ outputDir, allowedParentDir, compiled, _fileOps = undefined }) {
  assertCompiled(compiled);
  const renameOperation = _fileOps?.rename ?? rename;
  const { output, parent } = await assertSafeOutputPath(outputDir, allowedParentDir);
  const backup = `${output}.previous`;
  if (await exists(backup)) throw contentError("CONTENT_BACKUP_ALREADY_EXISTS");
  const temp = await mkdtemp(path.join(parent, ".content-build-"));
  let movedPrevious = false;
  try {
    await writeFile(path.join(temp, "content-manifest.json"), canonicalJson(compiled.manifest), "utf8");
    const resourceDir = path.join(temp, compiled.manifest.releaseId);
    await mkdir(resourceDir);
    await Promise.all(RESOURCE_KINDS.map((kind) => writeFile(path.join(resourceDir, `${kind}.json`), compiled.resources.get(kind), "utf8")));
    await verifyTree(temp, compiled);
    if (await exists(output)) { await renameOperation(output, backup); movedPrevious = true; }
    await renameOperation(temp, output);
    if (movedPrevious) await rm(backup, { recursive: true, force: false });
  } catch (error) {
    try {
      if (movedPrevious && !await exists(output) && await exists(backup)) await renameOperation(backup, output);
      if (await exists(temp)) await rm(temp, { recursive: true, force: true });
    } catch {
      throw contentError("CONTENT_OUTPUT_WRITE_FAILED", "公開用ファイルを書き込めませんでした。");
    }
    if (error instanceof ContentError) throw error;
    throw contentError("CONTENT_OUTPUT_WRITE_FAILED", "公開用ファイルを書き込めませんでした。");
  }
}
