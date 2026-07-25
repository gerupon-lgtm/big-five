const FIELDS = [
  "evidenceId", "version", "sourceType",
  "sourceLabel", "locator", "supportedClaims",
];

export function validateResultEvidenceDefinitions(definitions) {
  if (!Array.isArray(definitions) || !definitions.every((value) =>
    value && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).length === FIELDS.length &&
    FIELDS.every((field) => Object.hasOwn(value, field)) &&
    typeof value.evidenceId === "string" && value.evidenceId.length > 0 &&
    value.version === "result-evidence-v1" &&
    ["primary", "internal-contract"].includes(value.sourceType) &&
    typeof value.sourceLabel === "string" && value.sourceLabel.length > 0 &&
    typeof value.locator === "string" && value.locator.length > 0 &&
    Array.isArray(value.supportedClaims) && value.supportedClaims.length > 0 &&
    value.supportedClaims.every((claim) => typeof claim === "string" && claim.length > 0)
  )) throw new TypeError("RESULT_EVIDENCE_DEFINITION_INVALID");
  if (new Set(definitions.map(({ evidenceId }) => evidenceId)).size !== definitions.length) {
    throw new TypeError("RESULT_EVIDENCE_DEFINITION_INVALID");
  }
  return definitions;
}
