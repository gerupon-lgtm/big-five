export function selectShareableResultTexts(renderedTexts) {
  if (!Array.isArray(renderedTexts)) {
    throw new TypeError("INVALID_RESULT_TEXTS");
  }
  return Object.freeze(
    renderedTexts
      .filter(({ section }) => section !== "titleReflection")
      .map((record) => Object.freeze({
        ...record,
        evidenceRefs: Object.freeze([...record.evidenceRefs]),
      })),
  );
}
