# CSV Runtime Activation and GitHub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 承認済みCSV releaseから生成したJSONを正式アプリの実行時正典へ切り替え、検証成功時だけ完全な成果物をGitHub Pagesへ配布できるようにする。

**Architecture:** GitHub Actionsとローカル`predev`が同じrelease compilerを使い、`content-manifest.json`と版別JSONを生成する。ブラウザはmanifestと全resourceを同一オリジンから読み、SHA-256・exact schema・版・参照を検証した後だけアプリを開始する。Pages artifactは`app/`の実行ファイルと生成JSONだけから組み立て、source CSVと未承認データを除外する。

**Tech Stack:** Node.js ES Modules、Node標準`node:test`、Web Fetch API、Web Crypto API、GitHub Actions、GitHub Pages

## Global Constraints

- この計画は`docs/superpowers/plans/2026-07-26-csv-content-foundation.md`完了後に実行する。
- Q-006のE-0〜E-5、T-0〜T-4、F-1〜F-5、X-1〜X-2がすべて人手approvedであることを開始条件とする。
- Q-012の51キャラクター行・画像・4レビュー状態・承認者・承認日時・hashがapprovedであることを開始条件とする。
- Q-013の全パレット・固定3場面・各2香り候補・共有代表・51 selectorがapprovedであることを開始条件とする。
- Q-008とQ-010のGitHub Pages公開設定・既定ブランチ・公開URLが確定していることをproduction deploy開始条件とする。
- 通常版は外部ホストへ通信せず、同一オリジンの静的JSON取得だけを許可する。
- 生回答、結果履歴、draft、reviewed、rejected、承認メモ、source CSVをPages artifactへ含めない。
- 一部resourceだけの公開、旧版と新版の混在、公開済み版の上書きを禁止する。
- JSON、Canvas、画像、共有APIが失敗しても、既存の利用者向けフォールバック契約を弱めない。
- `prototype-big-five/`を変更しない。

---

## File Map

- `content/source/presentation/presentation-v1/*.csv` — 承認済みQ-013データ。
- `content/source/characters/character-manifest-v1/characters.csv` — 承認済みQ-012 manifest。
- `content/source/releases/release-manifest.csv` — approved release 1行。
- `content/source/releases/release-history.csv` — 追記専用release。
- `content/source/approvals/result-content-approvals.csv` — Q-006固定18 gateの人手承認記録。
- `app/js/domain/content-manifest.js` — manifest exact schemaとversion projection。
- `app/js/domain/content-bundle.js` — 全resourceのcross-reference validationとdeep freeze。
- `app/js/infrastructure/content-loader.js` — same-origin fetch、hash、all-or-nothing loading。
- `app/js/config/app-meta.js` — コード所有のapp/storage/deployment値だけを保持。
- `app/js/main.js` — content load成功後にrouteを開始し、失敗時は安全なエラー画面へ移る。
- `app/js/presentation/content-load-error-screen.js` — 利用者文言と内部コードを分離。
- `app/js/data/*.js` — JSON移行完了後に削除する旧静的定義。
- `scripts/content/assemble-pages.mjs` — 検証済みappとJSONだけを一時artifactへ組み立てる。
- `scripts/content/audit-release-history.mjs` — 公開済み版と履歴の書換え検出。
- `.github/workflows/pages.yml` — test/check/build/upload/deploy。
- `app/tests/content-loader.test.js` — fetch/hash/schema/atomicity。
- `app/tests/content-runtime-parity.test.js` — JSON版と移行前authority fixtureの一致。
- `app/tests/pages-artifact.test.js` — artifact allowlist。
- `app/tests/pages-workflow-contract.test.js` — workflow gate。

---

### Task 1: Import Approved Q-012/Q-013 Data and Select a Release

**Files:**
- Create: `content/source/presentation/presentation-v1/scenes.csv`
- Create: `content/source/presentation/presentation-v1/palettes.csv`
- Create: `content/source/presentation/presentation-v1/palette-usage-mappings.csv`
- Create: `content/source/presentation/presentation-v1/fragrances.csv`
- Create: `content/source/presentation/presentation-v1/presentation-selectors.csv`
- Create: `content/source/presentation/presentation-v1/selector-palettes.csv`
- Create: `content/source/presentation/presentation-v1/selector-fragrances.csv`
- Create: `content/source/characters/character-manifest-v1/characters.csv`
- Modify: `content/source/result-texts/result-text-v1/result-texts.csv`
- Modify: `content/source/approvals/result-content-approvals.csv`
- Modify: `content/source/releases/release-manifest.csv`
- Modify: `content/source/releases/release-history.csv`
- Create: `app/tests/approved-release-source.test.js`

**Interfaces:**
- Consumes: human approval ledgers for Q-006/Q-012/Q-013.
- Produces: one fully approved source release accepted by `compileRelease`.

- [ ] **Step 1: Write the failing approved-release test**

```js
test("production source has exactly one fully approved release", async () => {
  const compiled = await compileRelease({
    sourceDir: path.resolve("content/source"),
    releaseId: "release-mvp-0.1.0",
  });
  assert.equal(compiled.manifest.releaseId, "release-mvp-0.1.0");
  assert.deepEqual(
    compiled.manifest.resources.map(({ kind }) => kind),
    ["diagnosis", "questions", "titles", "result-texts", "evidence", "presentation", "characters"],
  );
});
```

- [ ] **Step 2: Run the test and confirm the approval gate**

Run: `node --test app/tests/approved-release-source.test.js`

Expected before approvals: FAIL with `RELEASE_NOT_SELECTED`, `CONTENT_APPROVAL_PENDING`, or missing Q-012/Q-013 resource. Stop this task if any required human approval record is absent; do not change status to make the test pass.

- [ ] **Step 3: Import only approved source rows**

Copy the approved Q-013 catalog and Q-012 manifest into the normalized CSVs without changing IDs, labels, colors, fragrance text, image paths, hashes, or review dates. Change Q-006 content rows and `result-content-approvals.csv` gate rows to `approved` only when each human approval actually exists. Record the real approving role/name and date; do not invent missing approval metadata.

- [ ] **Step 4: Select and record the release**

Add exactly one approved row to `release-manifest.csv` using:

```csv
release_id,app_version,diagnosis_id,diagnostic_definition_version,scale_version,question_version,scoring_version,result_evidence_version,result_text_version,title_rule_version,character_manifest_version,presentation_definition_version,card_template_version,status
release-mvp-0.1.0,mvp-0.1.0,big-five-ipip-ja,ipip-ja-50-definition-v1,ipip-ja-50-v1,ipip-ja-50-question-set-v1,ipip-ja-50-scoring-v1,result-evidence-v1,result-text-v1,title-rule-v1,character-manifest-v1,presentation-v1,card-template-v1,approved
```

Append the same immutable version tuple to `release-history.csv` with the schema-defined release sequence. Do not edit an existing history row.

- [ ] **Step 5: Run source and compiler verification**

Run: `npm.cmd run content:validate`

Expected: PASS with one approved selected release.

Run: `npm.cmd run content:build`

Expected: creates `app/content/content-manifest.json` and seven resource JSON files under `app/content/release-mvp-0.1.0/`.

- [ ] **Step 6: Commit**

```powershell
git add content/source app/tests/approved-release-source.test.js
git commit -m "feat: approve initial CSV content release"
```

---

### Task 2: Runtime Manifest, Hash, and Bundle Validation

**Files:**
- Create: `app/js/domain/content-manifest.js`
- Create: `app/js/domain/content-bundle.js`
- Create: `app/js/infrastructure/content-loader.js`
- Create: `app/tests/content-loader.test.js`

**Interfaces:**
- Produces: `validateContentManifest(value, expectedAppVersion) -> ContentManifest`
- Produces: `validateContentBundle({ manifest, resources }) -> ContentBundle`
- Produces: `loadContentBundle({ manifestUrl, baseUrl, fetchImpl, cryptoImpl, expectedAppVersion }) -> Promise<ContentBundle>`

- [ ] **Step 1: Write failing all-or-nothing loader tests**

```js
test("loads and validates every same-origin resource before returning", async () => {
  const fixture = approvedGeneratedFixture();
  const requests = [];
  const bundle = await loadContentBundle({
    manifestUrl: "./content/content-manifest.json",
    baseUrl: "https://example.test/app/index.html",
    expectedAppVersion: "mvp-0.1.0",
    fetchImpl: async (url) => {
      requests.push(String(url));
      return fixture.responseFor(url);
    },
    cryptoImpl: webcrypto,
  });
  assert.equal(bundle.manifest.releaseId, "release-mvp-0.1.0");
  assert.equal(requests.length, 8);
  assert.equal(bundle.questions.length, 50);
});

test("hash mismatch exposes no partial bundle", async () => {
  await assert.rejects(
    loadContentBundle(tamperedFixture()),
    (error) => error.code === "CONTENT_RESOURCE_HASH_MISMATCH",
  );
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test app/tests/content-loader.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `content-loader.js`.

- [ ] **Step 3: Implement exact manifest validation**

```js
const MANIFEST_FIELDS = [
  "schemaVersion", "releaseId", "appVersion", "diagnosisId", "versions", "resources",
];
const VERSION_FIELDS = [
  "diagnosticDefinitionVersion", "scaleVersion", "questionVersion",
  "scoringVersion", "resultEvidenceVersion", "resultTextVersion",
  "titleRuleVersion", "characterManifestVersion",
  "presentationDefinitionVersion", "cardTemplateVersion",
];
```

Require `schemaVersion === 1`, exact fields, exact resource kind order, lowercase 64-character SHA-256, unique relative paths below the manifest directory, and `appVersion === expectedAppVersion`.

- [ ] **Step 4: Implement same-origin fetch and Web Crypto verification**

```js
async function fetchAndVerify(manifestUrl, resource, fetchImpl, cryptoImpl) {
  const url = new URL(resource.path, manifestUrl);
  if (url.origin !== manifestUrl.origin) {
    throw contentLoadError("CONTENT_RESOURCE_ORIGIN_INVALID");
  }
  const response = await fetchImpl(url, { credentials: "same-origin", cache: "no-cache" });
  if (!response.ok) throw contentLoadError("CONTENT_RESOURCE_HTTP_ERROR");
  const bytes = new Uint8Array(await response.arrayBuffer());
  const digest = [...new Uint8Array(await cryptoImpl.subtle.digest("SHA-256", bytes))]
    .map((byte) => byte.toString(16).padStart(2, "0")).join("");
  if (digest !== resource.sha256) {
    throw contentLoadError("CONTENT_RESOURCE_HASH_MISMATCH");
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
```

Resolve the manifest URL once with `new URL(manifestUrl, baseUrl)` so a GitHub Pages project subpath is preserved. Use `Promise.all` internally but call `validateContentBundle` only after all fetch/hash/JSON operations succeed. Never return a partially populated object.

- [ ] **Step 5: Validate domain resources and freeze the bundle**

Call `validateDefinitionStructure`, `validateDefinitionAuthority`, `validateResultContentDefinitions`, `validateTitleProfileDefinitions`, `validatePresentationDefinitionSet`, and the character manifest validator with manifest versions. Reject unknown fields, count mismatch, broken cross-resource IDs, mixed versions, and title/character/palette references. Return a recursively frozen bundle.

- [ ] **Step 6: Run focused tests**

Run: `node --test app/tests/content-loader.test.js`

Expected: PASS for valid load, 404, invalid JSON, external URL, hash mismatch, version mismatch, missing resource, duplicate resource, and partial failure.

- [ ] **Step 7: Commit**

```powershell
git add app/js/domain/content-manifest.js app/js/domain/content-bundle.js app/js/infrastructure/content-loader.js app/tests/content-loader.test.js
git commit -m "feat: load validated content JSON"
```

---

### Task 3: Switch the Formal Runtime from Static Data Modules to JSON

**Files:**
- Modify: `app/js/config/app-meta.js`
- Modify: `app/js/main.js`
- Create: `app/js/presentation/content-load-error-screen.js`
- Modify: `app/js/domain/title-classifier.js`
- Modify: `app/js/domain/result-model.js`
- Modify: `app/js/domain/result-snapshot.js`
- Modify: `app/tests/scoring-title-contract.test.js`
- Modify: `app/tests/result-composer.test.js`
- Modify: `app/tests/result-snapshot.test.js`
- Delete after parity passes: `app/js/data/diagnostic-definition.js`
- Delete after parity passes: `app/js/data/title-profile-definitions.js`
- Delete after parity passes: `app/js/data/title-result-text-definitions.js`
- Delete after parity passes: `app/js/data/factor-result-text-definitions.js`
- Delete after parity passes: `app/js/data/result-text-definitions.js`
- Delete after parity passes: `app/js/data/result-evidence-definitions.js`
- Create: `app/tests/content-runtime-parity.test.js`
- Modify: tests that import deleted data modules to use the generated test bundle.

**Interfaces:**
- Consumes: `loadContentBundle`.
- Produces: `createRuntimeMeta(appMeta, contentBundle) -> RuntimeMeta`
- Produces: `startApp({ documentObject, historyObject, windowObject, loadContent }) -> Promise<void>`

- [ ] **Step 1: Write failing startup tests**

```js
test("app renders only after the complete content bundle loads", async () => {
  const fixture = createAppDom();
  let resolved = false;
  const start = startApp({
    ...fixture,
    loadContent: async () => {
      resolved = true;
      return validContentBundle();
    },
  });
  assert.equal(fixture.screenHost.textContent, "コンテンツを確認しています…");
  await start;
  assert.equal(resolved, true);
  assert.match(fixture.screenHost.textContent, /Big Five/);
});

test("content failure renders a retry path without starting diagnosis", async () => {
  const fixture = createAppDom();
  await startApp({
    ...fixture,
    loadContent: async () => { throw Object.assign(new Error(), { code: "CONTENT_RESOURCE_HASH_MISMATCH" }); },
  });
  assert.match(fixture.screenHost.textContent, /読み込めませんでした/);
  assert.match(fixture.screenHost.textContent, /再読み込み/);
});
```

- [ ] **Step 2: Run startup tests and verify they fail**

Run: `node --test app/tests/app-shell.test.js app/tests/content-runtime-parity.test.js`

Expected: FAIL because `startApp` is synchronous and imports static definitions.

- [ ] **Step 3: Separate bootstrap config from content versions**

Keep code-owned values in `appMeta`: `appVersion`, `storageSchemaVersion`, `releasedAt`, `deploymentMode`, `betaAggregationEnabled`, and `betaApiBaseUrl`. Build diagnostic/content versions from the validated manifest:

```js
export function createRuntimeMeta(appMeta, content) {
  const { manifest, diagnosis } = content;
  return Object.freeze({
    ...appMeta,
    cardTemplateVersion: manifest.versions.cardTemplateVersion,
    characterManifestVersion: manifest.versions.characterManifestVersion,
    presentationDefinitionVersion: manifest.versions.presentationDefinitionVersion,
    diagnosticVersions: Object.freeze({
      scaleId: diagnosis.diagnostic.scaleId,
      scaleVersion: manifest.versions.scaleVersion,
      questionVersion: manifest.versions.questionVersion,
      scoringVersion: manifest.versions.scoringVersion,
      resultTextVersion: manifest.versions.resultTextVersion,
      titleRuleVersion: manifest.versions.titleRuleVersion,
    }),
  });
}
```

Require manifest `appVersion` to match the code-owned app version; CSV cannot silently change executable code version.

- [ ] **Step 4: Make startup asynchronous with an explicit error screen**

```js
export async function startApp({
  documentObject = document,
  historyObject = history,
  windowObject = window,
  loadContent = () => loadContentBundle({
    manifestUrl: "./content/content-manifest.json",
    expectedAppVersion: appMeta.appVersion,
  }),
} = {}) {
  const screenHost = requireScreenHost(documentObject);
  renderContentLoadingScreen(screenHost);
  try {
    const content = await loadContent();
    const runtimeMeta = createRuntimeMeta(appMeta, content);
    attachRouter({ screenHost, historyObject, windowObject, runtimeMeta, content });
  } catch (error) {
    renderContentLoadErrorScreen(screenHost, {
      publicMessage: "診断データを読み込めませんでした。通信環境を確認して再読み込みしてください。",
      internalCode: normalizeContentErrorCode(error),
    });
  }
}
```

- [ ] **Step 5: Inject definitions and remove old modules**

Change `classifyTitle` to require `{ factorResults, questionCount, titleProfiles, titleRuleVersion }` and copy the supplied validated version into its classification. Change `composeResultModel` to require `{ factors, classification, renderedTexts, expectedTitleRuleVersion }` and validate the classification against that explicit version. Replace `result-snapshot.js`'s `Object.keys(createVersionTuple(appMeta))` with the exact nine VersionTuple fields already enforced by `response-state.js`, removing its `appMeta` import. Update the listed tests to pass manifest-derived versions and to load generated definition fixtures from a temporary directory. Delete each old data module only after the parity test proves its generated JSON equivalent.

- [ ] **Step 6: Run formal tests**

Run: `npm.cmd run test:formal`

Expected: PASS with no imports from deleted `app/js/data/` content modules and no browser global required by domain tests.

- [ ] **Step 7: Commit**

```powershell
git add app/js app/tests
git commit -m "refactor: use generated JSON as runtime content"
```

---

### Task 4: Local Build Integration and CSP

**Files:**
- Modify: `package.json`
- Modify: `app/index.html`
- Modify: `scripts/check-static.mjs`
- Modify: `app/tests/app-shell.test.js`
- Modify: `app/tests/static-server.test.js`
- Create: `app/tests/content-network-contract.test.js`

**Interfaces:**
- Produces: `predev` approved content build.
- Produces: same-origin-only runtime network contract.

- [ ] **Step 1: Write failing command and CSP tests**

```js
test("formal app builds content before local serving", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  assert.equal(packageJson.scripts.predev, "npm.cmd run content:build");
});

test("CSP permits same-origin JSON but no external connection", async () => {
  const html = await readFile("app/index.html", "utf8");
  assert.match(html, /connect-src 'self'/);
  assert.doesNotMatch(html, /connect-src[^;]*(?:https:|http:|\*)/);
});
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `node --test app/tests/app-shell.test.js app/tests/content-network-contract.test.js`

Expected: FAIL because CSP is `connect-src 'none'` and `predev` is absent.

- [ ] **Step 3: Add build-before-dev and same-origin CSP**

Set:

```json
{
  "predev": "npm.cmd run content:build",
  "dev": "node app/dev-server.mjs"
}
```

Change only `connect-src 'none'` to `connect-src 'self'`. Keep `default-src`, `script-src`, `style-src`, `img-src`, `base-uri`, and `form-action` restrictions unchanged.

- [ ] **Step 4: Verify local serving**

Run: `npm.cmd run dev`

Expected: content build succeeds, then the server reports `http://localhost:4174/#/start`.

Request:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:4174/content/content-manifest.json
```

Expected: HTTP 200, `Content-Type: application/json; charset=utf-8`, matching release ID and app version.

- [ ] **Step 5: Run focused and static tests**

Run: `node --test app/tests/static-server.test.js app/tests/content-network-contract.test.js`

Expected: PASS, including path traversal rejection and same-origin resource paths.

Run: `npm.cmd run check`

Expected: PASS with `connect-src 'self'` and no external host allowance.

- [ ] **Step 6: Commit**

```powershell
git add package.json app/index.html scripts/check-static.mjs app/tests/app-shell.test.js app/tests/static-server.test.js app/tests/content-network-contract.test.js
git commit -m "feat: build content before local startup"
```

---

### Task 5: Immutable Release Audit and Pages Artifact

**Files:**
- Create: `scripts/content/audit-release-history.mjs`
- Create: `scripts/content/assemble-pages.mjs`
- Create: `app/tests/pages-artifact.test.js`
- Create: `content/fixtures/invalid/release-history-rewrite/`
- Modify: `package.json`

**Interfaces:**
- Produces: `auditReleaseHistory({ currentDir, baseRef, readGitBlob }) -> true`
- Produces: `assemblePages({ appDir, contentDir, outputDir }) -> ArtifactReport`

- [ ] **Step 1: Write failing immutability and allowlist tests**

```js
test("published source rows and release history are append-only", async () => {
  await assert.rejects(
    auditReleaseHistory({
      currentDir: rewrittenCurrent(),
      baseRef: "0123456789abcdef0123456789abcdef01234567",
      readGitBlob: publishedBaseReader(),
    }),
    (error) => error.code === "PUBLISHED_CONTENT_MUTATED",
  );
});

test("Pages artifact contains app runtime and approved JSON only", async (t) => {
  const report = await assemblePages(validArtifactInput(t));
  assert.equal(report.csvFiles.length, 0);
  assert.equal(report.nonApprovedMarkers.length, 0);
  assert.deepEqual(report.releaseIds, ["release-mvp-0.1.0"]);
});
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `node --test app/tests/pages-artifact.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for artifact modules.

- [ ] **Step 3: Implement immutable comparison**

Compare released version directories byte-for-byte against the base commit. Allow new version directories and appended history rows only. Reject deletion, modification, reordering, or duplicate release ID. The CLI accepts explicit `--base-ref` and `--current-dir`, requires `baseRef` to match `/^[0-9a-f]{40}$/`, and reads base blobs with fixed `git show <sha>:<repository-relative-path>` argument arrays. It never constructs shell commands from CSV values.

- [ ] **Step 4: Implement artifact allowlist**

Copy these paths only:

- `app/index.html`
- `app/css/**`
- `app/js/**`
- `app/manifest/**` when present
- approved static assets referenced by generated JSON
- `app/content/content-manifest.json`
- the one selected `app/content/<releaseId>/**`

Reject `.csv`, `.md`, `.map`, source directories, unknown top-level paths, non-approved status literals, local absolute paths, and resource files not listed in the manifest.

- [ ] **Step 5: Add the Pages build command**

```json
{
  "content:audit": "node scripts/content/audit-release-history.mjs",
  "build:pages": "node scripts/content/build-content.mjs --source content/source --output app/content --allowed-parent app && node scripts/content/assemble-pages.mjs --app app --content app/content --out dist"
}
```

- [ ] **Step 6: Run artifact verification**

Run: `npm.cmd run build:pages`

Expected: `dist/` contains the formal app, one manifest, and exactly the seven resources for `release-mvp-0.1.0`; it contains no CSV or non-approved data.

Run: `node --test app/tests/pages-artifact.test.js`

Expected: PASS for allowlist and all rejection fixtures.

- [ ] **Step 7: Commit**

```powershell
git add scripts/content/audit-release-history.mjs scripts/content/assemble-pages.mjs app/tests/pages-artifact.test.js content/fixtures/invalid/release-history-rewrite package.json
git commit -m "feat: assemble immutable Pages artifacts"
```

---

### Task 6: GitHub Actions Pages Deployment

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `app/tests/pages-workflow-contract.test.js`

**Interfaces:**
- Consumes: `npm.cmd test`, `npm.cmd run check`, `npm.cmd run content:audit`, `npm.cmd run build:pages`.
- Produces: test-gated Pages artifact upload and deployment.

- [ ] **Step 1: Write the failing workflow contract test**

```js
test("Pages deployment depends on validation and uploads only dist", async () => {
  const workflow = await readFile(".github/workflows/pages.yml", "utf8");
  assert.match(workflow, /content:validate/);
  assert.match(workflow, /content-validation-report\.md/);
  assert.match(workflow, /actions\/upload-artifact@v4/);
  assert.match(workflow, /npm\.cmd test/);
  assert.match(workflow, /npm\.cmd run check/);
  assert.match(workflow, /npm\.cmd run content:audit/);
  assert.match(workflow, /npm\.cmd run build:pages/);
  assert.match(workflow, /path:\s*dist/);
  assert.match(workflow, /needs:\s*build/);
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test app/tests/pages-workflow-contract.test.js`

Expected: FAIL because `.github/workflows/pages.yml` does not exist.

- [ ] **Step 3: Create build and deploy jobs**

Use:

```yaml
name: Deploy formal app to Pages
on:
  pull_request:
  push:
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - id: content-validation
        run: npm.cmd run content:validate -- --report content-validation-report.md
      - if: always()
        uses: actions/upload-artifact@v4
        with:
          name: content-validation-report
          path: content-validation-report.md
          if-no-files-found: error
      - run: npm.cmd test
      - run: npm.cmd run check
      - id: audit-base
        shell: pwsh
        run: |
          $sha = '${{ github.event.pull_request.base.sha }}'
          if ($sha -notmatch '^[0-9a-f]{40}$') { $sha = '${{ github.event.before }}' }
          if ($sha -notmatch '^[0-9a-f]{40}$' -or $sha -eq ('0' * 40)) {
            $sha = git rev-parse HEAD^
          }
          "sha=$sha" | Add-Content -LiteralPath $env:GITHUB_OUTPUT
      - run: npm.cmd run content:audit -- --base-ref '${{ steps.audit-base.outputs.sha }}'
      - run: npm.cmd run build:pages
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    if: (github.event_name == 'push' && github.ref == format('refs/heads/{0}', github.event.repository.default_branch)) || github.event_name == 'workflow_dispatch'
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

The audit step selects an exact base commit: `${{ github.event.pull_request.base.sha }}` for a pull request, `${{ github.event.before }}` for a normal push, and `git rev-parse HEAD^` when neither is usable. It passes the validated 40-character SHA to `audit-release-history.mjs --base-ref`. The deploy condition reads `github.event.repository.default_branch`, so Q-008 does not require a hard-coded branch name in this workflow.

- [ ] **Step 4: Verify failure prevents deploy**

Add test fixtures or workflow assertions proving that build has no `continue-on-error`, deploy `needs: build`, PR does not deploy, and only push to the configured default branch or manual dispatch deploys.

- [ ] **Step 5: Run workflow and full local contracts**

Run: `node --test app/tests/pages-workflow-contract.test.js`

Expected: PASS.

Run: `npm.cmd test`

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```powershell
git add .github/workflows/pages.yml app/tests/pages-workflow-contract.test.js
git commit -m "ci: deploy validated content to Pages"
```

---

### Task 7: Canonical Documentation, Rollback, and Final Verification

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/基本設計サマリ.md`
- Modify: `docs/data-model.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/screens.md`
- Modify: `docs/tasks.md`
- Modify: `docs/content-authoring.md`
- Create: `docs/github-pages-content-release.md`
- Modify: `app/tests/project-contract.test.js`

**Interfaces:**
- Produces: operator-visible release and rollback procedure matching the implemented workflow.

- [ ] **Step 1: Write failing canonical-document tests**

```js
test("canonical docs identify CSV source, JSON runtime, and approval gate", async () => {
  const documents = await readCanonicalDocuments();
  for (const text of documents) {
    assert.match(text, /content\/source/);
    assert.match(text, /content-manifest\.json/);
    assert.match(text, /CP932/);
    assert.match(text, /approved/);
  }
});
```

- [ ] **Step 2: Run project contracts and verify they fail**

Run: `node --test app/tests/project-contract.test.js`

Expected: FAIL until all canonical documents describe the implemented pipeline.

- [ ] **Step 3: Synchronize architecture and version ownership**

Document:

- `app-meta.js` owns executable app/storage/deployment values.
- approved `release-manifest.csv` owns the active diagnostic/content version tuple.
- generated `content-manifest.json` is the runtime projection and must match `appVersion`.
- browser startup is blocked on all-or-nothing manifest/resource validation.
- CSP permits only same-origin static JSON in normal mode.
- old JS content definitions were removed after parity verification.

- [ ] **Step 4: Write exact release and rollback runbook**

`docs/github-pages-content-release.md` must give:

1. Excel CSV edit and encoding choice.
2. new version directory creation.
3. human approval record completion.
4. manifest/history update.
5. PR validation result and Markdown report location.
6. merge/deploy success confirmation.
7. published `content-manifest.json` release ID/hash verification.
8. rollback by selecting a previous approved immutable release and appending a new release-history action; never edit old source rows.

- [ ] **Step 5: Run the full verification matrix**

Run: `npm.cmd run content:validate`

Expected: PASS with one approved selected release.

Run: `npm.cmd run build:pages`

Expected: PASS and produce one complete release in `dist/`.

Run: `npm.cmd test`

Expected: all formal and prototype tests PASS.

Run: `npm.cmd run check`

Expected: PASS with no prototype imports, no external connection target, and no source CSV in artifact.

Run: `git diff --check`

Expected: no output.

- [ ] **Step 6: Browser smoke**

Start: `npm.cmd run dev`

Verify at `http://localhost:4174/#/start`:

- manifest and seven JSON requests return 200 from the same origin;
- no external request occurs;
- the displayed app/diagnostic/content versions match the manifest;
- tampering one local JSON hash produces the content error screen and no diagnosis start;
- restoring the generated JSON allows reload and start;
- end-user UI has no release/set selector.

- [ ] **Step 7: Commit**

```powershell
git add AGENTS.md docs/基本設計サマリ.md docs/data-model.md docs/processing-design.md docs/screens.md docs/tasks.md docs/content-authoring.md docs/github-pages-content-release.md app/tests/project-contract.test.js
git commit -m "docs: document CSV content release operations"
```

---

## Activation Completion Gate

Activation is complete only when:

- every production source row and required external approval gate is approved;
- one immutable approved release compiles to seven hashed JSON resources;
- the formal app starts only after same-origin fetch, hash, schema, version, and reference validation;
- existing static content modules are removed only after runtime parity passes;
- `connect-src 'self'` permits no external host;
- local dev automatically builds JSON, while tests use temporary outputs;
- Pages artifact contains no CSV, draft/reviewed/rejected content, approval notes, local paths, secrets, or personal data;
- PR validates without deploying, and default-branch success alone can deploy;
- a failed build leaves the current Pages deployment unchanged;
- documented rollback selects a previous immutable approved release without overwriting history;
- all tests, static checks, artifact checks, and browser smoke checks pass.
