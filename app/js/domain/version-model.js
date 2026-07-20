const APP_VERSION_PATTERN = /^(?:mvp-|beta-)?\d+\.\d+\.\d+$/;
const DEFINITION_VERSION_PATTERN = /^[a-z0-9][a-z0-9._-]*$/i;
const ISO_8601_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const DEPLOYMENT_MODES = new Set(["normal", "beta"]);
const DIAGNOSTIC_VERSION_FIELDS = [
  "scaleId",
  "scaleVersion",
  "questionVersion",
  "scoringVersion",
  "resultTextVersion",
  "titleRuleVersion",
];

export function isAppVersion(value) {
  return typeof value === "string" && APP_VERSION_PATTERN.test(value);
}

function hasDefinitionVersion(value) {
  return (
    typeof value === "string" &&
    DEFINITION_VERSION_PATTERN.test(value)
  );
}
function hasDiagnosticVersionRegistry(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === DIAGNOSTIC_VERSION_FIELDS.length &&
    DIAGNOSTIC_VERSION_FIELDS.every(
      (field) => Object.hasOwn(value, field) && hasDefinitionVersion(value[field]),
    )
  );
}

function copyDiagnosticVersions(value) {
  return Object.freeze(Object.fromEntries(
    DIAGNOSTIC_VERSION_FIELDS.map((field) => [field, value[field]]),
  ));
}


export function validateAppMeta(meta) {
  if (
    !meta ||
    typeof meta !== "object" ||
    Array.isArray(meta) ||
    !isAppVersion(meta.appVersion) ||
    !Number.isInteger(meta.storageSchemaVersion) ||
    meta.storageSchemaVersion < 1 ||
    !hasDefinitionVersion(meta.cardTemplateVersion) ||
    !hasDefinitionVersion(meta.characterManifestVersion) ||
    !hasDefinitionVersion(meta.presentationDefinitionVersion) ||
    typeof meta.releasedAt !== "string" ||
    !hasDiagnosticVersionRegistry(meta.diagnosticVersions) ||
    !ISO_8601_PATTERN.test(meta.releasedAt) ||
    Number.isNaN(Date.parse(meta.releasedAt)) ||
    !DEPLOYMENT_MODES.has(meta.deploymentMode) ||
    typeof meta.betaAggregationEnabled !== "boolean" ||
    (meta.betaApiBaseUrl !== null &&
      typeof meta.betaApiBaseUrl !== "string")
  ) {
    throw new TypeError("APP_META_INVALID");
  }

  const isBetaVersion = meta.appVersion.startsWith("beta-");
  if ((meta.deploymentMode === "beta") !== isBetaVersion) {
    throw new TypeError("APP_META_INVALID");
  }

  if (
    meta.deploymentMode === "normal" &&
    (meta.betaAggregationEnabled || meta.betaApiBaseUrl !== null)
  ) {
    throw new TypeError("APP_META_INVALID");
  }

  const hasSecureBetaApi =
    typeof meta.betaApiBaseUrl === "string" &&
    meta.betaApiBaseUrl.startsWith("https://");
  if (
    meta.deploymentMode === "beta" &&
    ((meta.betaAggregationEnabled && !hasSecureBetaApi) ||
      (!meta.betaAggregationEnabled && meta.betaApiBaseUrl !== null))
  ) {
    throw new TypeError("APP_META_INVALID");
  }

  return meta;
}

export function createStartVersionViewModel(meta) {
  const validMeta = validateAppMeta(meta);

  return Object.freeze({
    appVersion: validMeta.appVersion,
    versionLabel: `バージョン ${validMeta.appVersion}`,
    diagnosticVersions: copyDiagnosticVersions(validMeta.diagnosticVersions),
  });
}

export function createShareVersionMetadata(meta) {
  const validMeta = validateAppMeta(meta);

  return Object.freeze({
    appVersion: validMeta.appVersion,
    diagnosticVersions: copyDiagnosticVersions(validMeta.diagnosticVersions),
  });
}
