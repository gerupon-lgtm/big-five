import test from "node:test";
import assert from "node:assert/strict";

import { appMeta } from "../js/config/app-meta.js";
import { DiagnosticDefinition } from "../js/data/diagnostic-definition.js";
import { ResultTextDefinitions } from "../js/data/result-text-definitions.js";
import {
  createShareVersionMetadata,
  createStartVersionViewModel,
} from "../js/domain/version-model.js";

test("AppMeta is the canonical mvp-1.0.0 normal-build metadata", () => {
  assert.equal(appMeta.appVersion, "mvp-1.0.0");
  assert.equal(appMeta.deploymentMode, "normal");
  assert.equal(appMeta.betaAggregationEnabled, false);
  assert.equal(appMeta.betaApiBaseUrl, null);
  assert.equal(appMeta.presentationDefinitionVersion, "presentation-v2");
  assert.equal(Object.isFrozen(appMeta), true);
  assert.equal(Object.isFrozen(appMeta.diagnosticVersions), true);
  assert.deepEqual(appMeta.brand, {
    version: "brand-v1",
    name: "ココロパレア",
    subtitle: "Big Five 自己理解支援ツール",
    cardSubtitle: "～Big Five 自己理解支援ツール～",
    publicOrigin: "https://kokoro.sikumilab.com",
    shareUrl: "",
    iconPath: "./assets/brand/kokoro-parea-mark.svg",
    cardIconPath: "./assets/brand/kokoro-parea-icon-512.png",
  });
  assert.equal(Object.isFrozen(appMeta.brand), true);
  assert.deepEqual(Object.keys(appMeta.brand).sort(), [
    "cardIconPath",
    "cardSubtitle",
    "iconPath",
    "name",
    "publicOrigin",
    "shareUrl",
    "subtitle",
    "version",
  ]);
});

test("diagnostic, start, and share models read the same canonical version registry", () => {
  const startModel = createStartVersionViewModel(appMeta);
  const shareMetadata = createShareVersionMetadata(appMeta);
  const expectedDiagnosticVersions = {
    scaleId: "ipip-ja-50",
    scaleVersion: "ipip-ja-50-v1",
    questionVersion: "ipip-ja-50-question-set-v1",
    scoringVersion: "ipip-ja-50-scoring-v1",
    resultTextVersion: "result-text-v2",
    titleRuleVersion: "title-rule-v1",
  };

  assert.deepEqual(startModel, {
    appVersion: "mvp-1.0.0",
    versionLabel: "バージョン mvp-1.0.0",
    diagnosticVersions: expectedDiagnosticVersions,
    diagnosticVersionLabel: "診断バージョン",
    diagnosticVersionItems: [
      "尺度: ipip-ja-50-v1",
      "設問: ipip-ja-50-question-set-v1",
      "採点: ipip-ja-50-scoring-v1",
    ],
  });
  assert.deepEqual(shareMetadata, {
    appVersion: "mvp-1.0.0",
    diagnosticVersions: expectedDiagnosticVersions,
  });
  assert.equal(Object.isFrozen(startModel.diagnosticVersionItems), true);
  assert.deepEqual(appMeta.diagnosticVersions, expectedDiagnosticVersions);
  assert.deepEqual(
    Object.fromEntries(Object.keys(expectedDiagnosticVersions).map((field) => [field, DiagnosticDefinition[field]])),
    expectedDiagnosticVersions,
  );
  assert.equal(ResultTextDefinitions.length, 390);
  assert.equal(
    ResultTextDefinitions.every(({ version }) =>
      version === expectedDiagnosticVersions.resultTextVersion),
    true,
  );
});

test("version models reject incomplete or contradictory metadata", () => {
  assert.throws(
    () => createStartVersionViewModel({ appVersion: "" }),
    /APP_META_INVALID/,
  );
  assert.throws(
    () =>
      createShareVersionMetadata({
        appVersion: "mvp-0.1.0",
        deploymentMode: "normal",
        betaAggregationEnabled: true,
        betaApiBaseUrl: "https://example.invalid",
      }),
    /APP_META_INVALID/,
  );
});
