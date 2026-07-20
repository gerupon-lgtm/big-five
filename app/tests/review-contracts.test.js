import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { isPathWithinRoot } from "../dev-server.mjs";
import { appMeta } from "../js/config/app-meta.js";
import { validateAppMeta } from "../js/domain/version-model.js";
import { inspectCanonicalRuntimeVersion } from "../../scripts/check-static.mjs";

test("AppMeta validates every required version field and release timestamp", () => {
  const requiredFields = [
    "storageSchemaVersion",
    "cardTemplateVersion",
    "characterManifestVersion",
    "presentationDefinitionVersion",
    "releasedAt",
  ];

  for (const field of requiredFields) {
    const invalidMeta = { ...appMeta };
    delete invalidMeta[field];
    assert.throws(() => validateAppMeta(invalidMeta), /APP_META_INVALID/);
  }

  assert.throws(
    () => validateAppMeta({ ...appMeta, releasedAt: "not-a-date" }),
    /APP_META_INVALID/,
  );
});

test("AppMeta rejects phase contradictions and accepts each version phase", () => {
  assert.throws(
    () =>
      validateAppMeta({
        ...appMeta,
        appVersion: "beta-0.1.0",
        deploymentMode: "normal",
      }),
    /APP_META_INVALID/,
  );

  assert.throws(
    () =>
      validateAppMeta({
        ...appMeta,
        appVersion: "beta-0.1.0",
        deploymentMode: "beta",
        betaAggregationEnabled: true,
        betaApiBaseUrl: null,
      }),
    /APP_META_INVALID/,
  );
  assert.doesNotThrow(() =>
    validateAppMeta({
      ...appMeta,
      appVersion: "beta-0.1.0",
      deploymentMode: "beta",
      betaAggregationEnabled: true,
      betaApiBaseUrl: "https://example.invalid",
    }),
  );
  assert.doesNotThrow(() =>
    validateAppMeta({
      ...appMeta,
      appVersion: "1.0.0",
    }),
  );
});

test("static version inspection supports MVP, beta, and formal releases", () => {
  for (const version of ["mvp-0.1.0", "beta-0.1.0", "1.0.0"]) {
    assert.equal(
      inspectCanonicalRuntimeVersion([
        `export const appMeta = { appVersion: "${version}" };`,
      ]),
      version,
    );
  }

  assert.throws(
    () =>
      inspectCanonicalRuntimeVersion([
        'const first = { appVersion: "mvp-0.1.0" };',
        'const second = { appVersion: "mvp-0.1.1" };',
      ]),
    /STATIC_CHECK_FAILED/,
  );
});

test("static server rejects a case-colliding sibling on case-sensitive filesystems", () => {
  assert.equal(
    isPathWithinRoot("/srv/app", "/srv/App/secret.txt", path.posix),
    false,
  );
  assert.equal(
    isPathWithinRoot("/srv/app", "/srv/app/index.html", path.posix),
    true,
  );
});
