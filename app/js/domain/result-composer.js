import { FACTOR_ORDER } from "../data/factor-order.js";
import { isValidFactorResults } from "./factor-result.js";
import { selectResultTextDefinitions } from "./result-text.js";

const INPUT_FIELDS = ["definitions", "version", "mode", "questionCount", "factors", "titleId"];
const TITLE_SECTIONS = ["titleSubtitle", "titleReason"];
const SECTION_ORDER = [
  "titleSubtitle",
  "titleReason",
  "titleReflection",
  "observation",
  "strength",
  "tradeoff",
  "work",
  "relationship",
  "stress",
  "question",
  "action",
];
const DETAIL_FACTOR_SECTIONS = SECTION_ORDER.slice(3);

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

function selectCompleteTitleReflections(definitions, version, titleId, mode) {
  const prefix = `title-reflection-${titleId.slice("title-".length)}-`;
  const reflections = definitions.filter((definition) =>
    definition.version === version &&
    definition.section === "titleReflection" &&
    definition.appliesTo.titleId === titleId);
  const expectedIds = [1, 2, 3].map((order) => `${prefix}${order}`);
  if (
    reflections.length !== expectedIds.length ||
    !reflections.every(({ id }, index) => id === expectedIds[index])
  ) {
    return [];
  }
  return mode === "preview20" ? reflections.slice(0, 1) : reflections;
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
  const titleRecords = titleSelection.filter(({ section }) => section !== "titleReflection");
  const titleBySection = indexSelectionBySection(
    titleRecords,
    TITLE_SECTIONS,
    ({ appliesTo }) => appliesTo.titleId === titleId,
  );
  const titleReflections = selectCompleteTitleReflections(
    definitions,
    version,
    titleId,
    mode,
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
  rendered.push(...titleReflections.map(toRendered));
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
