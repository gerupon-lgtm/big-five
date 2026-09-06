import { ContentError } from "./content-error.mjs";
import { validateResultContentDefinitions } from "../../app/js/domain/definition-validator.js";
import { validateResultEvidenceDefinitions } from "../../app/js/domain/result-evidence.js";
import { RESULT_TEXT_SECTIONS, validateResultTextDefinitions } from "../../app/js/domain/result-text.js";
import { validateTitleProfileDefinitions } from "../../app/js/domain/title-profile.js";

const APPROVAL_GATES = Object.freeze([
  ...Array.from({ length: 6 }, (_, index) => `E-${index}`),
  ...Array.from({ length: 5 }, (_, index) => `T-${index}`),
  ...Array.from({ length: 5 }, (_, index) => `F-${index + 1}`),
  "X-1",
  "X-2",
]);
const STATUSES = new Set(["draft", "reviewed", "approved", "rejected"]);
const TITLE_SECTIONS = new Set(["titleSubtitle", "titleReason"]);
const FACTOR_SECTIONS = new Set(["observation", "strength", "tradeoff", "work", "relationship", "stress", "question", "action"]);
const COPY_PROHIBITIONS = [
  /\b(?:ability|superiority|superior|suitability|compatible|compatibility|diagnos(?:is|tic)|rank(?:ing)?|treat(?:ment)?|cure|heal|improve(?:ment)?|product|essential[-\s]*oil|aroma|ingest(?:ion)?|appl(?:y|ication)|diffuser)\b/i,
  /能力|優越|適性|相性|診断|順位|治療|改善|製品|精油|アロマ|摂取|塗布|ディフューザー/,
];

function invalid() {
  throw new Error("RESULT_CONTENT_INVALID");
}

function assertRows(rows, count) {
  if (!Array.isArray(rows) || (count !== undefined && rows.length !== count)) invalid();
}

function assertUnique(rows, key) {
  if (new Set(rows.map(key)).size !== rows.length) invalid();
}

function ordered(rows) {
  if (!rows.every(({ display_order }) => Number.isInteger(display_order) && display_order >= 1)) invalid();
  assertUnique(rows, ({ display_order }) => display_order);
  return [...rows].sort((left, right) => left.display_order - right.display_order);
}

function groupOrdered(rows, parentField) {
  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row[parentField])) groups.set(row[parentField], []);
    groups.get(row[parentField]).push(row);
  }
  for (const [parent, group] of groups) groups.set(parent, ordered(group));
  return groups;
}

function appliesToFromRow(row) {
  const entries = [
    ["mode", row.mode],
    ["questionCount", row.mode === "preview20" ? 20 : row.mode === "detail50" ? 50 : ""],
    ["factorId", row.factor_id],
    ["band", row.band],
    ["titleId", row.title_id],
  ].filter(([, value]) => value !== "");
  return Object.fromEntries(entries);
}

function assertTextApplicability(row) {
  const factorTarget = row.mode !== "" || row.factor_id !== "" || row.band !== "";
  if (TITLE_SECTIONS.has(row.section)) {
    if (row.title_id === "" || factorTarget || row.preview_allowed !== "true") invalid();
    return;
  }
  if (!FACTOR_SECTIONS.has(row.section) || row.title_id !== "" || row.mode === "" || row.factor_id === "" || row.band === "") invalid();
  if (row.section === "observation") {
    if (!((row.mode === "preview20" && row.preview_allowed === "true") ||
      (row.mode === "detail50" && row.preview_allowed === "false"))) invalid();
    return;
  }
  if (row.mode !== "detail50" || row.preview_allowed !== "false") invalid();
}

function assertStatuses(rowSets) {
  if (!rowSets.every((rows) => rows.every(({ status }) => STATUSES.has(status)))) invalid();
}

function assertCopySafe(profileRows, textRows) {
  const copies = [
    ...profileRows.map(({ label }) => label),
    ...textRows.map(({ text }) => text),
  ];
  if (copies.some((copy) => COPY_PROHIBITIONS.some((pattern) => pattern.test(copy)))) invalid();
}

function projectTitleProfiles(profileRows, profileFactorRows, titleRuleVersion) {
  assertRows(profileRows, 51);
  assertRows(profileFactorRows, 90);
  if (!profileRows.every(({ title_rule_version }) => title_rule_version === titleRuleVersion)) invalid();
  assertUnique(profileRows, ({ title_id }) => title_id);
  assertUnique(profileFactorRows, ({ title_id, factor_id }) => `${title_id}:${factor_id}`);
  const factorsByTitleId = groupOrdered(profileFactorRows, "title_id");
  const profileIds = new Set(profileRows.map(({ title_id }) => title_id));
  if (![...factorsByTitleId.keys()].every((titleId) => profileIds.has(titleId))) invalid();
  const titleProfiles = ordered(profileRows).map((row) => ({
    titleId: row.title_id,
    label: row.label,
    kind: row.kind,
    factors: (factorsByTitleId.get(row.title_id) ?? []).map(({ factor_id, direction }) => ({ factorId: factor_id, direction })),
    characterId: row.character_id,
    summaryTextId: row.summary_text_id,
    defaultPaletteId: row.default_palette_id,
  }));
  validateTitleProfileDefinitions(titleProfiles);
  return titleProfiles;
}

function projectEvidence(evidenceRows, evidenceClaimRows) {
  assertRows(evidenceRows, 6);
  assertRows(evidenceClaimRows, 12);
  assertUnique(evidenceRows, ({ evidence_id }) => evidence_id);
  assertUnique(evidenceClaimRows, ({ evidence_id, supported_claim }) => `${evidence_id}:${supported_claim}`);
  const claimsByEvidenceId = groupOrdered(evidenceClaimRows, "evidence_id");
  const evidenceIds = new Set(evidenceRows.map(({ evidence_id }) => evidence_id));
  if (![...claimsByEvidenceId.keys()].every((evidenceId) => evidenceIds.has(evidenceId))) invalid();
  const evidenceDefinitions = ordered(evidenceRows).map((row) => ({
    evidenceId: row.evidence_id,
    version: row.result_evidence_version,
    sourceType: row.source_type,
    sourceLabel: row.source_label,
    locator: row.locator,
    supportedClaims: (claimsByEvidenceId.get(row.evidence_id) ?? []).map(({ supported_claim }) => supported_claim),
  }));
  validateResultEvidenceDefinitions(evidenceDefinitions);
  return evidenceDefinitions;
}

function projectTexts(textRows, textEvidenceRows, evidenceDefinitions, resultTextVersion) {
  assertRows(textRows, 237);
  assertRows(textEvidenceRows, 267);
  assertUnique(textRows, ({ text_id }) => text_id);
  assertUnique(textEvidenceRows, ({ text_id, evidence_id }) => `${text_id}:${evidence_id}`);
  const evidenceByTextId = groupOrdered(textEvidenceRows, "text_id");
  const textIds = new Set(textRows.map(({ text_id }) => text_id));
  const evidenceIds = new Set(evidenceDefinitions.map(({ evidenceId }) => evidenceId));
  if (![...evidenceByTextId.keys()].every((textId) => textIds.has(textId)) ||
    textEvidenceRows.some(({ evidence_id }) => !evidenceIds.has(evidence_id)) ||
    !textRows.every(({ result_text_version }) => result_text_version === resultTextVersion) ||
    !textRows.every((row) => RESULT_TEXT_SECTIONS.includes(row.section))) invalid();
  textRows.forEach(assertTextApplicability);
  const textDefinitions = ordered(textRows).map((row) => ({
    id: row.text_id,
    version: row.result_text_version,
    appliesTo: appliesToFromRow(row),
    section: row.section,
    claimKind: row.claim_kind,
    text: row.text,
    evidenceRefs: (evidenceByTextId.get(row.text_id) ?? []).map(({ evidence_id }) => evidence_id),
    previewAllowed: row.preview_allowed === "true",
  }));
  validateResultTextDefinitions(textDefinitions);
  return textDefinitions;
}

export function projectTitleReflectionComments({ rows, titleIds, resultTextVersion }) {
  try {
    assertRows(rows);
    if (rows.length === 0) {
      if (resultTextVersion === "result-text-v1") return [];
      invalid();
    }
    if (!Array.isArray(titleIds) || titleIds.length !== 51 ||
      typeof resultTextVersion !== "string" || resultTextVersion.length === 0) invalid();
    assertUnique(rows, ({ text_id }) => text_id);
    const knownTitleIds = new Set(titleIds);
    if (knownTitleIds.size !== titleIds.length ||
      rows.length !== titleIds.length * 3 ||
      rows.some((row) => !knownTitleIds.has(row.title_id) ||
        row.result_text_version !== resultTextVersion ||
        !STATUSES.has(row.status))) invalid();

    const rowsByTitleId = groupOrdered(rows, "title_id");
    if (rowsByTitleId.size !== titleIds.length) invalid();
    const definitions = [];
    for (const titleId of titleIds) {
      const titleRows = rowsByTitleId.get(titleId);
      if (!titleRows || titleRows.length !== 3 ||
        !titleRows.every((row, index) =>
          row.display_order === index + 1 &&
          row.text_id === `title-reflection-${titleId.slice("title-".length)}-${index + 1}`)) invalid();
      for (const row of titleRows) {
        definitions.push({
          id: row.text_id,
          version: row.result_text_version,
          appliesTo: { titleId: row.title_id },
          section: "titleReflection",
          claimKind: "reflectionPrompt",
          text: row.text,
          evidenceRefs: ["evidence-result-presentation-contract"],
          previewAllowed: row.display_order === 1,
        });
      }
    }
    return definitions;
  } catch {
    throw new ContentError({
      code: "RESULT_CONTENT_INVALID",
      message: "称号別振り返りコメントのCSV定義が不正です。",
    });
  }
}

function assertTitleTextReferences(titleProfiles, textDefinitions) {
  for (const { titleId, summaryTextId } of titleProfiles) {
    if (!titleId.startsWith("title-") || summaryTextId !== `result-text-${titleId.slice("title-".length)}`) invalid();
    const titleTexts = textDefinitions.filter(({ appliesTo }) => appliesTo.titleId === titleId);
    if (titleTexts.filter(({ section }) => section === "titleSubtitle").length !== 1 ||
      titleTexts.filter(({ section }) => section === "titleReason").length !== 1) invalid();
  }
}

export function compileResultContent({
  profileRows,
  profileFactorRows,
  textRows,
  textEvidenceRows,
  evidenceRows,
  evidenceClaimRows,
  titleReflectionRows = [],
  titleRuleVersion,
  resultTextVersion,
}) {
  try {
    if (typeof titleRuleVersion !== "string" || titleRuleVersion.length === 0 ||
      typeof resultTextVersion !== "string" || resultTextVersion.length === 0) invalid();
    assertStatuses([profileRows, profileFactorRows, textRows, textEvidenceRows, evidenceRows, evidenceClaimRows, titleReflectionRows]);
    assertCopySafe(profileRows, [...textRows, ...titleReflectionRows]);
    const titleProfiles = projectTitleProfiles(profileRows, profileFactorRows, titleRuleVersion);
    const evidenceDefinitions = projectEvidence(evidenceRows, evidenceClaimRows);
    const textDefinitions = [
      ...projectTexts(textRows, textEvidenceRows, evidenceDefinitions, resultTextVersion),
      ...projectTitleReflectionComments({
        rows: titleReflectionRows,
        titleIds: titleProfiles.map(({ titleId }) => titleId),
        resultTextVersion,
      }),
    ];
    if (titleReflectionRows.length > 0 &&
      !evidenceDefinitions.some(({ evidenceId }) => evidenceId === "evidence-result-presentation-contract")) invalid();
    validateResultTextDefinitions(textDefinitions);
    assertTitleTextReferences(titleProfiles, textDefinitions);
    const compiled = { titleProfiles, textDefinitions, evidenceDefinitions, resultTextVersion };
    validateResultContentDefinitions(compiled);
    return compiled;
  } catch {
    throw new ContentError({
      code: "RESULT_CONTENT_INVALID",
      message: "結果コンテンツのCSV定義が不正です。",
    });
  }
}

export function assertReleaseEligible({ rows, titleReflectionRows = [], approvals }) {
  if (!Array.isArray(rows) || !rows.every((row) => row && row.status === "approved") ||
    !Array.isArray(titleReflectionRows) || !titleReflectionRows.every((row) => row && row.status === "approved") ||
    !approvals || typeof approvals !== "object" || APPROVAL_GATES.some((gate) => approvals[gate] !== "approved")) {
    throw new ContentError({ code: "CONTENT_APPROVAL_PENDING", message: "結果コンテンツの承認が完了していません。" });
  }
  return true;
}
