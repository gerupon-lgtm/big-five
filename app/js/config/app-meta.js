const diagnosticVersions = Object.freeze({
  scaleId: "ipip-ja-50",
  scaleVersion: "ipip-ja-50-v1",
  questionVersion: "ipip-ja-50-question-set-v1",
  scoringVersion: "ipip-ja-50-scoring-v1",
  resultTextVersion: "result-text-v2",
  titleRuleVersion: "title-rule-v1",
});

const brand = Object.freeze({
  version: "brand-v1",
  name: "ココロパレア",
  subtitle: "Big Five 自己理解支援ツール",
  cardSubtitle: "～Big Five 自己理解支援ツール～",
  publicOrigin: "https://kokoroparea.gerupon.uk",
  iconPath: "./assets/brand/kokoro-parea-mark.svg",
});

export const appMeta = Object.freeze({
  appVersion: "mvp-0.1.0",
  storageSchemaVersion: 1,
  cardTemplateVersion: "card-template-v1",
  characterManifestVersion: "character-manifest-v1",
  presentationDefinitionVersion: "presentation-v2",
  diagnosticVersions,
  brand,
  releasedAt: "2026-07-20T00:00:00+09:00",
  deploymentMode: "normal",
  betaAggregationEnabled: false,
  betaApiBaseUrl: null,
});
