import test from "node:test";
import assert from "node:assert/strict";

import { appMeta } from "../js/config/app-meta.js";
import {
  createShareVersionMetadata,
  createStartVersionViewModel,
} from "../js/domain/version-model.js";

test("AppMeta is the canonical mvp-0.1.0 normal-build metadata", () => {
  assert.equal(appMeta.appVersion, "mvp-0.1.0");
  assert.equal(appMeta.deploymentMode, "normal");
  assert.equal(appMeta.betaAggregationEnabled, false);
  assert.equal(appMeta.betaApiBaseUrl, null);
  assert.equal(Object.isFrozen(appMeta), true);
});

test("start and share models read the same canonical app version", () => {
  const startModel = createStartVersionViewModel(appMeta);
  const shareMetadata = createShareVersionMetadata(appMeta);

  assert.deepEqual(startModel, {
    appVersion: "mvp-0.1.0",
    versionLabel: "バージョン mvp-0.1.0",
  });
  assert.deepEqual(shareMetadata, {
    appVersion: "mvp-0.1.0",
  });
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
