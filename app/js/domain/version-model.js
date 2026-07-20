const APP_VERSION_PATTERN = /^(?:mvp-|beta-)?\d+\.\d+\.\d+$/;
const DEPLOYMENT_MODES = new Set(["normal", "beta"]);

export function validateAppMeta(meta) {
  if (
    !meta ||
    typeof meta !== "object" ||
    typeof meta.appVersion !== "string" ||
    !APP_VERSION_PATTERN.test(meta.appVersion) ||
    !DEPLOYMENT_MODES.has(meta.deploymentMode) ||
    typeof meta.betaAggregationEnabled !== "boolean"
  ) {
    throw new TypeError("APP_META_INVALID");
  }

  if (
    meta.deploymentMode === "normal" &&
    (meta.betaAggregationEnabled || meta.betaApiBaseUrl !== null)
  ) {
    throw new TypeError("APP_META_INVALID");
  }

  if (
    meta.deploymentMode === "beta" &&
    meta.betaAggregationEnabled &&
    (typeof meta.betaApiBaseUrl !== "string" ||
      !meta.betaApiBaseUrl.startsWith("https://"))
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
  });
}

export function createShareVersionMetadata(meta) {
  const validMeta = validateAppMeta(meta);

  return Object.freeze({
    appVersion: validMeta.appVersion,
  });
}
