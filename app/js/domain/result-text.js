import { FACTOR_ORDER } from "../data/factor-order.js";

const DEFINITION_FIELDS = ["id", "version", "appliesTo", "section", "text", "evidenceRefs", "previewAllowed"];
const CONDITION_FIELDS = ["mode", "questionCount", "factorId", "band", "titleId"];
const SECTIONS = new Set(["summary", "strength", "tradeoff", "work", "relationship", "stress", "action"]);
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

export function validateResultTextDefinitions(definitions) {
  if (!Array.isArray(definitions) || !definitions.every((definition) => hasExactFields(definition, DEFINITION_FIELDS))) invalidDefinition();
  if (!definitions.every(({ id, version, appliesTo, section, text, evidenceRefs, previewAllowed }) =>
    typeof id === "string" && id.length > 0 &&
    typeof version === "string" && version.length > 0 &&
    validAppliesTo(appliesTo) &&
    SECTIONS.has(section) &&
    typeof text === "string" &&
    Array.isArray(evidenceRefs) &&
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

export function selectResultTextDefinitions({ definitions, version, context }) {
  validateResultTextDefinitions(definitions);
  validateSelectionInput(version, context);
  const isPreview = context.mode === "preview20";
  return Object.freeze(definitions.filter((definition) =>
    definition.version === version &&
    (!isPreview || definition.previewAllowed) &&
    Object.entries(definition.appliesTo).every(([field, value]) => context[field] === value)));
}
