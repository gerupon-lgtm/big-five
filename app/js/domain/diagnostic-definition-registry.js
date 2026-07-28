const DEFINITION_VERSION_FIELDS = Object.freeze([
  "scaleVersion",
  "questionVersion",
  "scoringVersion",
]);

function hasExactVersionTuple(versionTuple, registration) {
  return DEFINITION_VERSION_FIELDS.every(
    (field) =>
      typeof versionTuple?.[field] === "string"
      && versionTuple[field] === registration?.[field],
  );
}

export function resolveRegisteredDiagnosticDefinition(
  versionTuple,
  registrations,
) {
  if (!Array.isArray(registrations)) {
    throw new TypeError("DIAGNOSTIC_DEFINITION_REGISTRY_INVALID");
  }
  return registrations.find((registration) =>
    hasExactVersionTuple(versionTuple, registration)) ?? null;
}
