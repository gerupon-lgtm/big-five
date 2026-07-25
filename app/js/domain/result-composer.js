import { FACTOR_ORDER } from "../data/factor-order.js";
import { isValidFactorResults } from "./factor-result.js";
import { selectResultTextDefinitions } from "./result-text.js";

const INPUT_FIELDS = ["definitions", "version", "mode", "questionCount", "factors", "titleId"];
const TITLE_SECTIONS = ["titleSubtitle", "titleReason"];
const SECTION_ORDER = [
  "titleSubtitle",
  "titleReason",
  "observation",
  "strength",
  "tradeoff",
  "work",
  "relationship",
  "stress",
  "question",
  "action",
];
const DETAIL_FACTOR_SECTIONS = SECTION_ORDER.slice(TITLE_SECTIONS.length);

function invalidComposition() {
  throw new TypeError("RESULT_COMPOSITION_INVALID");
}

function isExactRecord(value, fields) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).length === fields.length &&
    fields.every((field) => Object.hasOwn(value, field));
}

function expectedFactorSections(mode) {
  return mode === "preview20" ? ["observation"] : DETAIL_FACTOR_SECTIONS;
}

function indexSelectionBySection(selection, expectedSections, appliesExactly) {
  if (selection.length !== expectedSections.length || !selection.every(appliesExactly)) {
    invalidComposition();
  }

  const bySection = new Map();
  for (const definition of selection) {
    if (!expectedSections.includes(definition.section) || bySection.has(definition.section)) {
      invalidComposition();
    }
    bySection.set(definition.section, definition);
  }
  if (expectedSections.some((section) => !bySection.has(section))) invalidComposition();
  return bySection;
}

function toRendered({ id, version, section, text, evidenceRefs }) {
  return Object.freeze({
    id,
    version,
    section,
    text,
    evidenceRefs: Object.freeze([...evidenceRefs]),
  });
}

function compose(input) {
  if (!isExactRecord(input, INPUT_FIELDS)) invalidComposition();
  const { definitions, version, mode, questionCount, factors, titleId } = input;

  const expectedQuestionCount = mode === "preview20" ? 20 : mode === "detail50" ? 50 : null;
  if (
    expectedQuestionCount === null ||
    questionCount !== expectedQuestionCount ||
    typeof version !== "string" ||
    version.length === 0 ||
    typeof titleId !== "string" ||
    titleId.length === 0 ||
    !Array.isArray(definitions) ||
    definitions.length === 0 ||
    !definitions.every((definition) =>
      definition !== null &&
      typeof definition === "object" &&
      !Array.isArray(definition) &&
      definition.version === version) ||
    !isValidFactorResults(factors, questionCount)
  ) {
    invalidComposition();
  }

  const titleContext = { mode, questionCount, titleId };
  const titleSelection = selectResultTextDefinitions({
    definitions,
    version,
    context: titleContext,
  });
  const titleBySection = indexSelectionBySection(
    titleSelection,
    TITLE_SECTIONS,
    ({ appliesTo }) => appliesTo.titleId === titleId,
  );

  const factorSections = expectedFactorSections(mode);
  const factorSelections = new Map();
  for (const factor of factors) {
    const context = {
      mode,
      questionCount,
      factorId: factor.factorId,
      band: factor.band,
    };
    const selection = selectResultTextDefinitions({ definitions, version, context });
    factorSelections.set(
      factor.factorId,
      indexSelectionBySection(
        selection,
        factorSections,
        ({ appliesTo }) => Object.entries(context).every(
          ([field, value]) => appliesTo[field] === value,
        ),
      ),
    );
  }

  const rendered = TITLE_SECTIONS.map((section) => toRendered(titleBySection.get(section)));
  for (const section of factorSections) {
    for (const factorId of FACTOR_ORDER) {
      rendered.push(toRendered(factorSelections.get(factorId).get(section)));
    }
  }
  return Object.freeze(rendered);
}

export function composeResultTexts(input) {
  try {
    return compose(input);
  } catch {
    invalidComposition();
  }
}
