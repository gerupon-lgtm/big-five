import { FACTOR_ORDER } from "../data/factor-order.js";

const DEFINITION_FIELDS = ["id", "version", "appliesTo", "section", "claimKind", "text", "evidenceRefs", "previewAllowed"];
const CONDITION_FIELDS = ["mode", "questionCount", "factorId", "band", "titleId"];
export const RESULT_TEXT_SECTIONS = Object.freeze([
  "titleSubtitle", "titleReason", "titleReflection", "observation", "strength", "tradeoff",
  "work", "relationship", "stress", "question", "action",
]);
export const RESULT_CLAIM_KINDS = Object.freeze([
  "scaleObservation", "entertainmentReason", "reflectionPrompt", "actionHint",
]);
const CLAIM_KIND_BY_SECTION = Object.freeze({
  titleSubtitle: "entertainmentReason",
  titleReason: "entertainmentReason",
  titleReflection: "reflectionPrompt",
  observation: "scaleObservation",
  strength: "reflectionPrompt",
  tradeoff: "reflectionPrompt",
  work: "reflectionPrompt",
  relationship: "reflectionPrompt",
  stress: "reflectionPrompt",
  question: "reflectionPrompt",
  action: "actionHint",
});
const MODES = new Set(["preview20", "detail50"]);
const QUESTION_COUNTS = new Set([20, 50]);
const BANDS = new Set(["low", "middle", "high"]);

function invalidDefinition() {
  throw new TypeError("RESULT_TEXT_DEFINITION_INVALID");
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactFields(value, fields) {
  return isRecord(value) && Object.keys(value).length === fields.length && fields.every((field) => Object.hasOwn(value, field));
}

function validCondition(field, value) {
  if (field === "mode") return MODES.has(value);
  if (field === "questionCount") return QUESTION_COUNTS.has(value);
  if (field === "factorId") return FACTOR_ORDER.includes(value);
  if (field === "band") return BANDS.has(value);
  return field === "titleId" && typeof value === "string" && value.length > 0;
}

function validAppliesTo(value) {
  return isRecord(value) && Object.keys(value).every((field) =>
    CONDITION_FIELDS.includes(field) && validCondition(field, value[field]));
}

function validDefinitionReachability(appliesTo, previewAllowed) {
  if (Object.hasOwn(appliesTo, "mode") && Object.hasOwn(appliesTo, "questionCount") &&
    ((appliesTo.mode === "preview20") !== (appliesTo.questionCount === 20))) return false;
  const targetsPreview = appliesTo.mode === "preview20" || appliesTo.questionCount === 20;
  return !targetsPreview || previewAllowed;
}

function validPreviewSection(previewAllowed, section) {
  return !previewAllowed ||
    ["titleSubtitle", "titleReason", "titleReflection", "observation"].includes(section);
}

function validTitleReflection(definition) {
  if (definition.section !== "titleReflection") return true;
  const { id, appliesTo, previewAllowed } = definition;
  if (Object.keys(appliesTo).length !== 1 || !Object.hasOwn(appliesTo, "titleId")) return false;
  const prefix = `title-reflection-${appliesTo.titleId.slice("title-".length)}-`;
  const match = id.startsWith(prefix) ? id.slice(prefix.length).match(/^[123]$/) : null;
  return match !== null && previewAllowed === (match[0] === "1");
}

export function validateResultTextDefinitions(definitions) {
  if (!Array.isArray(definitions) || !definitions.every((definition) => hasExactFields(definition, DEFINITION_FIELDS))) invalidDefinition();

  if (!definitions.every(({ id, version, appliesTo, section, claimKind, text, evidenceRefs, previewAllowed }) =>
    typeof id === "string" && id.length > 0 &&
    typeof version === "string" && version.length > 0 &&
    validAppliesTo(appliesTo) &&
    validDefinitionReachability(appliesTo, previewAllowed) &&
    validPreviewSection(previewAllowed, section) &&
    validTitleReflection({ id, appliesTo, section, previewAllowed }) &&
    RESULT_TEXT_SECTIONS.includes(section) &&
    RESULT_CLAIM_KINDS.includes(claimKind) && CLAIM_KIND_BY_SECTION[section] === claimKind &&
    typeof text === "string" &&
    Array.isArray(evidenceRefs) && evidenceRefs.length > 0 &&
    evidenceRefs.every((reference) => typeof reference === "string" && reference.length > 0) &&
    new Set(evidenceRefs).size === evidenceRefs.length &&
    typeof previewAllowed === "boolean")) invalidDefinition();
  const ids = definitions.map(({ id }) => id);
  if (new Set(ids).size !== ids.length) invalidDefinition();
  return definitions;
}

function validateSelectionInput(version, context) {
  if (typeof version !== "string" || version.length === 0 || !isRecord(context)) invalidDefinition();
  if (!Object.keys(context).every((field) => CONDITION_FIELDS.includes(field)) ||
    !Object.hasOwn(context, "mode") || !Object.hasOwn(context, "questionCount") ||
    !Object.entries(context).every(([field, value]) => validCondition(field, value))) invalidDefinition();
  if ((context.mode === "preview20") !== (context.questionCount === 20)) invalidDefinition();
}

export function selectResultTextDefinitions(input) {
  if (!hasExactFields(input, ["definitions", "version", "context"])) invalidDefinition();
  const { definitions, version, context } = input;
  validateResultTextDefinitions(definitions);
  validateSelectionInput(version, context);
  const isPreview = context.mode === "preview20";
  return Object.freeze(definitions.filter((definition) =>
    definition.version === version &&
    (!isPreview || definition.previewAllowed) &&
    Object.entries(definition.appliesTo).every(([field, value]) => context[field] === value)));
}
