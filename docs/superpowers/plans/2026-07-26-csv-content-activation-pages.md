# CSV Runtime Activation and Production Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 承認済みCSVから既存の7 JSON releaseを生成し、ココロパレア正式runtimeを同一origin JSON loadingへ切り替え、`https://kokoroparea.gerupon.uk`へ検証済みのproduction Pages artifactとして公開する。

**Architecture:** 承認前に実装できるloader、hash validation、immutable release audit、artifact assemblerはfixture駆動で先に作る。正式release選択はQ-006、Q-012、Q-013の独立承認を満たすまで停止し、選択後は既存`compileRelease`、`canonicalJson`、7-resource manifest、SHA-256、atomic writerだけをbuild authorityとして使う。現在のbranch限定・noindexなQA Pages workflowはproduction cutoverまで維持し、production workflowとの二重deployを作らない。

**Tech Stack:** JavaScript ES Modules、Node.js 24、`node:test`、Web Crypto SHA-256、Fetch、GitHub Actions、GitHub Pages、HTTPS。

## Global Constraints

- 人が編集する正典は`content/source/**/*.csv`だけである。`app/content/`はignore済み生成物で、手編集・コミットしない。
- 既存resource順`diagnosis,questions,titles,result-texts,evidence,presentation,characters`を維持し、8番目のresourceや別writerを追加しない。
- 現行結果文は`result-text-v2`、Q-013はroot schema 2の`presentation-v2`である。activationを`result-text-v1`または`presentation-v1`へ戻さない。
- `presentation-v2`は`fragrance-materials.csv`と`fragrance-material-examples.csv`を含み、生成presentation JSONは`fragranceMaterials`と各香調の1〜3 `materialIds`を持つ。
- Q-013の素材名は通常結果だけに表示し、共有summary/card/textへ含めない。
- Q-013 ES Modules cutoverはP-0〜P-6承認後に別計画で完了していることをTask 4の開始条件とする。
- `result-content-approvals.csv`、`presentation-content-approvals.csv`、Q-012 character approval、全選択行status、release manifest/historyは別々のgateである。
- 現在の正式ブランドは`brand-v1`、名称は`ココロパレア`、`appMeta.brand.publicOrigin`は`https://kokoroparea.gerupon.uk`である。`app/index.html`のcanonical/OG URLは同originの末尾`/`である。
- 公開originのコード設定済みという事実を、DNS、GitHub Pages custom domain、HTTPSのlive完了と同一視しない。
- 現在の`.github/workflows/qa-preview-pages.yml`は`codex/big-five-q006`向け、`dist/qa-preview`、`noindex,nofollow`のQA専用deploymentである。production workflowが成功するまで削除しない。
- 通常runtimeの外部API送信は0件を維持する。JSON fetchのため`connect-src 'self'`だけを許可し、外部host、wildcard、`http:`、`https:` scheme allowanceを追加しない。
- release selector、公開結果URL、アカウント、生回答通信、分析送信を追加しない。
- PRはbuild/testまで、repository default branch成功または明示的manual dispatchだけがproduction deployできる。
- rollbackは過去source/historyを書き換えず、承認済みimmutable versionを参照する新releaseと新history行を追加する。
- 各実装タスクはRED→GREEN→focused regression→commitで完結させる。

## Phase Boundaries

1. **Technical groundwork — may run now:** Tasks 1〜2。
2. **Formal release selection — mandatory pause:** Task 3。Q-012 formal approvalまたは任意の承認が欠ければ停止する。
3. **JSON runtime cutover:** Tasks 4〜5。承認済みrelease build成功後だけ開始する。
4. **Production Pages:** Task 6。Q-008 repository/default branch/custom-domain authorityとartifactが揃ってから開始する。
5. **Live verification and documentation:** Task 7。DNS/HTTPS/Pagesは観測後だけ完了扱いにする。

## File Map

### Technical groundwork

- Create: `app/js/infrastructure/content-loader.js`
- Create: `app/tests/content-loader.test.js`
- Create: `scripts/content/audit-release-history.mjs`
- Create: `scripts/content/assemble-pages.mjs`
- Create: `app/tests/pages-artifact.test.js`
- Create: `content/fixtures/invalid/release-history-rewrite/`
- Modify: `package.json`

### Formal release gate

- Create after Q-012 approval: `content/source/characters/character-manifest-v1/characters.csv`
- Modify approved row statuses only with evidence:
  - `content/source/titles/title-rule-v1/title-profiles.csv`
  - `content/source/titles/title-rule-v1/title-profile-factors.csv`
  - `content/source/result-texts/result-text-v2/result-texts.csv`
  - `content/source/result-texts/result-text-v2/result-text-evidence.csv`
  - `content/source/result-texts/result-text-v2/title-reflection-comments.csv`
  - `content/source/evidence/result-evidence-v1/result-evidence.csv`
  - `content/source/evidence/result-evidence-v1/result-evidence-claims.csv`
- Modify: `content/source/releases/release-manifest.csv`
- Modify: `content/source/releases/release-history.csv`
- Modify: `app/tests/content-compiler.test.js`
- Modify: `app/tests/content-migration-parity.test.js`

### Runtime cutover

- Modify: `app/js/main.js`
- Modify: `app/js/config/app-meta.js`
- Modify: `app/js/infrastructure/router.js`
- Modify: `app/js/domain/title-classifier.js`
- Modify: `app/js/domain/result-model.js`
- Modify: `app/js/domain/result-snapshot.js`
- Modify: `app/tests/app-shell.test.js`
- Create: `app/tests/content-runtime-parity.test.js`
- Create: `app/tests/content-network-contract.test.js`
- Modify: `app/index.html`
- Modify: `scripts/check-static.mjs`
- Modify: `app/tests/static-server.test.js`

### Production Pages and operations

- Create: `.github/workflows/pages.yml`
- Create: `app/tests/pages-workflow-contract.test.js`
- Delete only at production cutover: `.github/workflows/qa-preview-pages.yml`
- Delete only at production cutover: `app/tests/qa-preview-workflow-contract.test.js`
- Modify: `AGENTS.md`
- Modify: `docs/基本設計サマリ.md`
- Modify: `docs/data-model.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/screens.md`
- Modify: `docs/tasks.md`
- Modify: `docs/content-authoring.md`
- Create: `docs/github-pages-content-release.md`
- Modify: `app/tests/project-contract.test.js`

---

### Task 1: Browser Manifest, Hash, and Bundle Validation

**Files:**
- Create: `app/js/infrastructure/content-loader.js`
- Create: `app/tests/content-loader.test.js`
- Modify: `app/tests/content-artifact-contract.test.js`

**Interfaces:**
- Produces: `loadContentBundle({ manifestUrl, expectedAppVersion, fetchImpl, cryptoSubtle }) -> Promise<Readonly<ContentBundle>>`.
- Produces: `validateContentManifest(value, expectedAppVersion) -> Readonly<ContentManifest>`.
- Produces stable codes: `CONTENT_MANIFEST_INVALID`, `CONTENT_RESOURCE_FETCH_FAILED`, `CONTENT_RESOURCE_HASH_MISMATCH`, `CONTENT_RESOURCE_INVALID`.
- Validates exactly seven resources and returns named properties `manifest,diagnosis,questions,titles,resultTexts,evidence,presentation,characters`.

- [ ] **Step 1: Write loader RED tests**

```js
test("loads the exact seven-resource bundle and validates presentation schema 2", async () => {
  const bundle = await loadContentBundle(validLoaderInput());
  assert.deepEqual(bundle.manifest.resources.map(({ kind }) => kind), [
    "diagnosis", "questions", "titles", "result-texts",
    "evidence", "presentation", "characters",
  ]);
  assert.equal(bundle.presentation.schemaVersion, 2);
  assert.equal(bundle.presentation.presentationDefinitionVersion, "presentation-v2");
  assert.equal(Object.isFrozen(bundle.presentation.fragranceMaterials), true);
});
```

Add rejection tests for unknown/missing/duplicate/reordered resources, external/cross-origin/absolute paths, `..`, query/fragment, non-lowercase SHA, wrong digest, wrong app/version tuple, schema 1 presentation under a v2 manifest, missing materials, partial fetch, JSON parse failure, and extra manifest fields.

- [ ] **Step 2: Run RED**

Run:

```powershell
node --test app/tests/content-loader.test.js app/tests/content-artifact-contract.test.js
```

Expected: FAIL because the browser loader does not exist.

- [ ] **Step 3: Implement all-or-nothing loading**

Resolve resource paths relative to the same-origin manifest URL, reject a different origin before fetch, fetch all seven bytes, hash exact bytes with injected `cryptoSubtle.digest("SHA-256", bytes)`, compare lowercase hex, parse JSON, then validate every resource and cross-reference. Expose no partially validated resource when any request fails.

- [ ] **Step 4: Reuse current validators**

Call the existing diagnosis/question/result/title/character validators and `validatePresentationDefinitionSet` with manifest `presentationDefinitionVersion`. Require presentation schema 2, `presentation-v2`, usage mappings, material library, 51 selectors, and `result-text-v2` in activation fixtures.

- [ ] **Step 5: Run GREEN**

Run:

```powershell
node --test app/tests/content-loader.test.js app/tests/content-artifact-contract.test.js
npm.cmd run test:formal
```

Expected: tests PASS without a selected repository release because all loader tests use isolated generated fixtures.

- [ ] **Step 6: Commit**

```powershell
git add app/js/infrastructure/content-loader.js app/tests/content-loader.test.js app/tests/content-artifact-contract.test.js
git commit -m "feat: validate generated content bundles"
```

---

### Task 2: Immutable Release Audit and Production Artifact Assembler

**Files:**
- Create: `scripts/content/audit-release-history.mjs`
- Create: `scripts/content/assemble-pages.mjs`
- Create: `app/tests/pages-artifact.test.js`
- Create: `content/fixtures/invalid/release-history-rewrite/`
- Modify: `package.json`

**Interfaces:**
- Produces: `auditReleaseHistory({ currentDir, baseRef, readGitBlob }) -> Promise<true>`.
- Produces: `assemblePages({ appDir, contentDir, outputDir, allowedParentDir, publicOrigin }) -> Promise<ArtifactReport>`.
- Adds scripts:
  - `content:audit = node scripts/content/audit-release-history.mjs`
  - `build:pages = node scripts/content/build-content.mjs --source content/source --output app/content --allowed-parent app && node scripts/content/assemble-pages.mjs --app app --content app/content --out dist --allowed-parent . --public-origin https://kokoroparea.gerupon.uk`

- [ ] **Step 1: Write immutable-history and allowlist RED tests**

```js
test("published source and history are append-only", async () => {
  await assert.rejects(
    auditReleaseHistory({
      currentDir: rewrittenCurrent(),
      baseRef: "0123456789abcdef0123456789abcdef01234567",
      readGitBlob: publishedBaseReader(),
    }),
    (error) => error.code === "PUBLISHED_CONTENT_MUTATED",
  );
});

test("production artifact contains one release and exact public-origin metadata", async (t) => {
  const report = await assemblePages(validArtifactInput(t));
  assert.deepEqual(report.releaseIds, ["release-mvp-0.1.0"]);
  assert.equal(report.resourceCount, 7);
  assert.equal(await readFile(join(report.outputDir, "CNAME"), "utf8"),
    "kokoroparea.gerupon.uk\n");
});
```

- [ ] **Step 2: Run RED**

Run:

```powershell
node --test app/tests/pages-artifact.test.js
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement append-only auditing**

Compare released version directories and release history against an exact 40-character base commit. Permit new version directories and appended history rows only. Reject modification, deletion, reorder, duplicate release ID, symlink/junction traversal, and a shell-constructed Git command. Use `git show` with a fixed argument array and repository-relative paths.

- [ ] **Step 4: Implement the production allowlist**

Copy only:

- `app/index.html`
- `app/css/**`
- runtime `app/js/**`
- `app/manifest/**`
- `app/assets/brand/**`
- approved character assets referenced by `characters.json`
- `app/content/content-manifest.json`
- the one selected `app/content/release-mvp-0.1.0/**`
- generated root `CNAME` containing exactly `kokoroparea.gerupon.uk\n`

Reject CSV, Markdown, tests, source maps, `dev-server.mjs`, QA robots files, `noindex`/`nofollow`, local absolute paths, unlisted assets/resources, symlinks, non-approved status markers, a canonical/OG origin other than `https://kokoroparea.gerupon.uk/`, or a manifest brand/app version mismatch.

- [ ] **Step 5: Prove deterministic artifacts with fixtures**

Run:

```powershell
node --test app/tests/pages-artifact.test.js
```

Expected: PASS for byte-identical repeated builds, seven resources, custom-domain metadata, and every rejection fixture. Do not run repository `build:pages` yet; without a selected release it must still fail.

- [ ] **Step 6: Commit**

```powershell
git add scripts/content/audit-release-history.mjs scripts/content/assemble-pages.mjs app/tests/pages-artifact.test.js content/fixtures/invalid/release-history-rewrite package.json
git commit -m "feat: assemble immutable production artifacts"
```

---

### Task 3: Select the First Formal Release Only After All Human Gates

**Gate:** Pause before file edits. Require Q-006 approvals and selected-row statuses, Q-012 formal character CSV approval, Q-013 P-0〜P-6 and row approvals, Q-013 deterministic ES Modules parity, and exact production asset hashes. A missing record stops this Task.

**Files:**
- Create after evidence review: `content/source/characters/character-manifest-v1/characters.csv`
- Modify the seven core CSV files listed in the File Map only where existing human approval supports status promotion.
- Modify: `content/source/releases/release-manifest.csv`
- Modify: `content/source/releases/release-history.csv`
- Modify: `app/tests/content-compiler.test.js`
- Modify: `app/tests/content-migration-parity.test.js`

**Interfaces:**
- Selects exactly `release-mvp-0.1.0`.
- Version tuple:
  - app `mvp-0.1.0`
  - diagnosis `ipip-ja-50-definition-v1`
  - scale `ipip-ja-50-v1`
  - questions `ipip-ja-50-question-set-v1`
  - scoring `ipip-ja-50-scoring-v1`
  - evidence `result-evidence-v1`
  - results `result-text-v2`
  - titles `title-rule-v1`
  - characters `character-manifest-v1`
  - presentation `presentation-v2`
  - card `card-template-v1`

- [ ] **Step 1: Write the release-eligibility RED test**

```js
await assert.rejects(
  () => compileRelease({ sourceDir: SOURCE }),
  (error) => [
    "RELEASE_NOT_SELECTED",
    "RELEASE_CONTENT_NOT_APPROVED",
    "CHARACTER_APPROVAL_PENDING",
    "PRESENTATION_APPROVAL_PENDING",
  ].includes(error.code),
);
```

Run:

```powershell
node --test app/tests/content-compiler.test.js app/tests/content-migration-parity.test.js
npm.cmd run content:build
```

Expected before formal approval: focused tests preserve the pending contract; build fails with the first truthful pending code. Do not change status merely to satisfy the test.

- [ ] **Step 2: Import only the approved Q-012 character release rows**

Generate `characters.csv` from the approved 51-entry production ledger/manifest without changing title IDs, character IDs, asset versions, paths, SHA-256, dimensions, byte lengths, alpha facts, alt text, reviewer identity, or dates. `assertCharacterReleaseEligible` must pass every row.

- [ ] **Step 3: Promote only evidence-backed core rows**

Set selected Q-006/Q-014 result/title/evidence rows to`approved` only where the existing E/F/T/X/TR user approval evidence covers the exact bytes. If any CSV byte differs from the approved review projection, return it to human review instead of promoting it.

- [ ] **Step 4: Add the exact manifest and append-only history rows**

`release-manifest.csv` receives:

```csv
release-mvp-0.1.0,mvp-0.1.0,big-five-ipip-ja,ipip-ja-50-definition-v1,ipip-ja-50-v1,ipip-ja-50-question-set-v1,ipip-ja-50-scoring-v1,result-evidence-v1,result-text-v2,title-rule-v1,character-manifest-v1,presentation-v2,card-template-v1,approved
```

`release-history.csv` receives the same values prefixed with `1,`. Do not rewrite either row after publication; correction requires a new immutable release ID and appended sequence.

- [ ] **Step 5: Compile twice and verify exact seven-resource output**

Run:

```powershell
npm.cmd run content:validate
npm.cmd run content:build
node --test app/tests/content-compiler.test.js app/tests/content-artifact-contract.test.js app/tests/content-migration-parity.test.js
```

Expected: validation has 0 errors and one approved selected release; build creates one manifest and exactly seven canonical JSON resources; a second build is byte-identical; presentation is root schema 2/result text version is v2; no material data appears in share-summary fixtures.

- [ ] **Step 6: Commit**

```powershell
git add content/source/characters/character-manifest-v1/characters.csv content/source/titles/title-rule-v1/title-profiles.csv content/source/titles/title-rule-v1/title-profile-factors.csv content/source/result-texts/result-text-v2/result-texts.csv content/source/result-texts/result-text-v2/result-text-evidence.csv content/source/result-texts/result-text-v2/title-reflection-comments.csv content/source/evidence/result-evidence-v1/result-evidence.csv content/source/evidence/result-evidence-v1/result-evidence-claims.csv content/source/releases/release-manifest.csv content/source/releases/release-history.csv app/tests/content-compiler.test.js app/tests/content-migration-parity.test.js
git commit -m "content: select first approved release"
```

---

### Task 4: Switch the Formal Runtime from ES Module Data to Generated JSON

**Gate:** `npm.cmd run content:build` passes for `release-mvp-0.1.0`, Q-013 Task 13 passed, and the current ES Modules/JSON parity test is green.

**Files:**
- Modify: `app/js/main.js`
- Modify: `app/js/config/app-meta.js`
- Modify: `app/js/infrastructure/router.js`
- Modify: `app/js/domain/title-classifier.js`
- Modify: `app/js/domain/result-model.js`
- Modify: `app/js/domain/result-snapshot.js`
- Modify: `app/tests/app-shell.test.js`
- Modify: `app/tests/scoring-title-contract.test.js`
- Modify: `app/tests/result-composer.test.js`
- Modify: `app/tests/result-snapshot.test.js`
- Create: `app/tests/content-runtime-parity.test.js`
- Delete only after parity passes:
  - `app/js/data/diagnostic-definition.js`
  - `app/js/data/title-profile-definitions.js`
  - `app/js/data/title-result-text-definitions.js`
  - `app/js/data/factor-result-text-definitions.js`
  - `app/js/data/result-text-definitions.js`
  - `app/js/data/result-evidence-definitions.js`
  - `app/js/data/presentation-definitions.js`

**Interfaces:**
- Consumes: `loadContentBundle`.
- Produces: `createRuntimeMeta(appMeta, contentBundle) -> Readonly<RuntimeMeta>`.
- Produces: `startApp({ documentObject, historyObject, windowObject, loadContent }) -> Promise<void>`.
- Keeps `appMeta.brand` code-owned and byte-equivalent.

- [ ] **Step 1: Write startup and parity RED tests**

```js
test("app renders only after the complete bundle loads", async () => {
  const fixture = createAppDom();
  const start = startApp({ ...fixture, loadContent: async () => validContentBundle() });
  assert.equal(fixture.screenHost.textContent, "コンテンツを確認しています…");
  await start;
  assert.match(fixture.screenHost.textContent, /ココロパレア/);
});

test("manifest failure renders retry without starting diagnosis", async () => {
  const fixture = createAppDom();
  await startApp({
    ...fixture,
    loadContent: async () => {
      throw Object.assign(new Error(), { code: "CONTENT_RESOURCE_HASH_MISMATCH" });
    },
  });
  assert.match(fixture.screenHost.textContent, /読み込めませんでした/);
  assert.match(fixture.screenHost.textContent, /再読み込み/);
});
```

- [ ] **Step 2: Run RED**

Run:

```powershell
node --test app/tests/app-shell.test.js app/tests/content-runtime-parity.test.js
```

Expected: FAIL because startup is synchronous and imports static data modules.

- [ ] **Step 3: Separate bootstrap metadata from release metadata**

Keep code-owned `appVersion`, storage/deployment flags, release timestamp, and the complete `brand-v1` object in `appMeta`. Build diagnostic/content/character/presentation/card versions from the validated manifest and require manifest app version to equal code app version. Preserve `appMeta.brand.publicOrigin === "https://kokoroparea.gerupon.uk"`.

- [ ] **Step 4: Make startup asynchronous and inject content**

Render a loading state, await the complete validated bundle, construct runtime meta, and attach the router only after success. Error UI exposes a public retry and a stable internal code but no URL, response body, answer, result, title, color, material, request ID, or user-agent detail.

- [ ] **Step 5: Replace static imports without changing domain outcomes**

Inject generated definitions into classification, result composition, Q-013 selection, Q-012 character loading, snapshot version creation, history, comparison, and share-card consumers. Do not add a release selector. Preserve every saved VersionTuple field and keep `result-text-v2`/`presentation-v2` exact.

- [ ] **Step 6: Delete ES Module data only after semantic parity**

`content-runtime-parity.test.js` compares each old module export to the selected release JSON, including 51 title profiles, 390 result-text-v2 definitions, six evidence definitions, 51 characters, root schema 2 presentation, usage mappings, fragrances, materials, selectors, and material-free share summaries. Delete the listed data modules only after this test passes against the pre-deletion snapshot fixture.

- [ ] **Step 7: Run GREEN and commit**

Run:

```powershell
node --test app/tests/app-shell.test.js app/tests/content-loader.test.js app/tests/content-runtime-parity.test.js app/tests/scoring-title-contract.test.js app/tests/result-composer.test.js app/tests/result-snapshot.test.js
npm.cmd run test:formal
```

Expected: all tests PASS; no deleted content module is imported by runtime code.

```powershell
git add app/js app/tests
git commit -m "refactor: load approved JSON content at runtime"
```

---

### Task 5: Build-Before-Serve and Same-Origin CSP

**Files:**
- Modify: `package.json`
- Modify: `app/index.html`
- Modify: `scripts/check-static.mjs`
- Modify: `app/tests/app-shell.test.js`
- Modify: `app/tests/static-server.test.js`
- Create: `app/tests/content-network-contract.test.js`

**Interfaces:**
- Adds `predev = npm.cmd run content:build`.
- Changes only the connection policy from `connect-src 'none'` to `connect-src 'self'`.
- Keeps canonical/OG URL `https://kokoroparea.gerupon.uk/`.

- [ ] **Step 1: Write command, CSP, and origin RED tests**

```js
test("formal dev builds selected content before serving", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  assert.equal(packageJson.scripts.predev, "npm.cmd run content:build");
});

test("CSP allows same-origin JSON and no external connection", async () => {
  const html = await readFile("app/index.html", "utf8");
  assert.match(html, /connect-src 'self'/);
  assert.doesNotMatch(html, /connect-src[^;]*(?:https:|http:|\*)/);
  assert.match(html, /https:\/\/kokoroparea\.gerupon\.uk\//);
});
```

- [ ] **Step 2: Run RED**

Run:

```powershell
node --test app/tests/app-shell.test.js app/tests/content-network-contract.test.js
```

Expected: FAIL because `predev` is absent and CSP is still `connect-src 'none'`.

- [ ] **Step 3: Add build-before-serve and exact CSP**

Keep all other CSP directives unchanged. Verify brand SVG, 51 local character assets, manifest, and seven JSON requests are same-origin. Assert normal-mode API/analytics requests remain zero.

- [ ] **Step 4: Verify local runtime**

Run:

```powershell
npm.cmd run dev
```

Expected: approved content builds, server reports `http://localhost:4174/#/start`, manifest and seven resources return HTTP 200 with JSON content type, and the diagnosis starts only after validation.

- [ ] **Step 5: Run GREEN and commit**

Run:

```powershell
node --test app/tests/static-server.test.js app/tests/content-network-contract.test.js app/tests/app-shell.test.js
npm.cmd run check
```

Expected: PASS; no external host is allowed.

```powershell
git add package.json app/index.html scripts/check-static.mjs app/tests/app-shell.test.js app/tests/static-server.test.js app/tests/content-network-contract.test.js
git commit -m "feat: serve approved same-origin content"
```

---

### Task 6: Replace QA Pages Deployment with Test-Gated Production Pages

**Gate:** Tasks 3〜5 pass, the repository/default-branch Pages authority is confirmed under Q-008, and `build:pages` produces the production artifact. Keep the QA workflow until this Task.

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `app/tests/pages-workflow-contract.test.js`
- Delete: `.github/workflows/qa-preview-pages.yml`
- Delete: `app/tests/qa-preview-workflow-contract.test.js`
- Modify: `app/tests/pages-artifact.test.js`

**Interfaces:**
- Uses `actions/checkout@v6`, `actions/setup-node@v7` with Node 24, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4`, and `actions/deploy-pages@v4`.
- Uploads only `dist`.
- Deploys only default-branch push or manual dispatch after the build job.

- [ ] **Step 1: Write production workflow RED tests**

```js
test("production Pages validates, audits, builds, and uploads only dist", async () => {
  const workflow = await readFile(".github/workflows/pages.yml", "utf8");
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run check/);
  assert.match(workflow, /npm run content:audit/);
  assert.match(workflow, /npm run build:pages/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /path:\s*dist/);
  assert.match(workflow, /needs:\s*build/);
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/);
});
```

Assert there is exactly one Pages deployment workflow after cutover and that production artifact contains neither QA `noindex` nor `robots.txt` disallow rules.

- [ ] **Step 2: Run RED**

Run:

```powershell
node --test app/tests/pages-workflow-contract.test.js app/tests/pages-artifact.test.js
```

Expected: FAIL because `pages.yml` does not exist and the QA Pages workflow still owns deployment.

- [ ] **Step 3: Create build and deploy jobs**

The build job runs on Ubuntu, installs with `npm ci`, writes/uploads a normal Actions validation report, runs tests/check/audit/build, configures Pages, and uploads only `dist`. Determine audit base from PR base SHA, push `before`, or `HEAD^`; validate exact 40 lowercase hex before passing it to the audit script.

The deploy job:

```yaml
if: (github.event_name == 'push' && github.ref == format('refs/heads/{0}', github.event.repository.default_branch)) || github.event_name == 'workflow_dispatch'
needs: build
environment:
  name: github-pages
  url: ${{ steps.deployment.outputs.page_url }}
```

No pull request deploys. A failed build leaves the existing deployment unchanged.

- [ ] **Step 4: Remove the competing QA Pages workflow in the same commit**

Delete the branch-specific QA deployment workflow and its workflow-contract test only after production workflow tests are green. Keep `qa:preview:build`, QA artifact code, and local QA tests available; they no longer deploy to the `github-pages` environment.

- [ ] **Step 5: Verify production workflow and artifact**

Run:

```powershell
npm.cmd run build:pages
node --test app/tests/pages-workflow-contract.test.js app/tests/pages-artifact.test.js
npm.cmd test
npm.cmd run check
```

Expected: `dist/` contains the formal shell, exact `CNAME`, brand assets, approved character assets, one manifest, and seven resources; it contains no CSV, draft/reviewed/rejected marker, QA search exclusion, test, local path, approval note, or personal data.

- [ ] **Step 6: Commit**

```powershell
git add .github/workflows/pages.yml app/tests/pages-workflow-contract.test.js app/tests/pages-artifact.test.js
git rm .github/workflows/qa-preview-pages.yml app/tests/qa-preview-workflow-contract.test.js
git commit -m "ci: deploy approved kokoro parea release"
```

---

### Task 7: Canonical Documentation, Live Origin Verification, and Rollback

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
- Produces the exact release, deploy, observation, and rollback runbook.
- Separates code-configured public origin from observed DNS/HTTPS/Pages status.

- [ ] **Step 1: Write canonical-document RED tests**

```js
test("canonical docs record current release and production origin without collapsing gates", async () => {
  const documents = await readCanonicalDocuments();
  for (const text of documents) {
    assert.match(text, /result-text-v2/);
    assert.match(text, /presentation-v2/);
    assert.match(text, /fragrance-materials\.csv/);
    assert.match(text, /fragrance-material-examples\.csv/);
    assert.match(text, /https:\/\/kokoroparea\.gerupon\.uk/);
    assert.match(text, /content-manifest\.json/);
  }
});
```

- [ ] **Step 2: Run RED**

Run:

```powershell
node --test app/tests/project-contract.test.js
```

Expected: FAIL until every canonical document reflects the implemented pipeline.

- [ ] **Step 3: Write the exact operator runbook**

`docs/github-pages-content-release.md` records:

1. CSV UTF-8/CP932 authoring and strict validation.
2. new immutable version directory creation.
3. Q-006/Q-012/Q-013 human approval evidence and status promotion.
4. release manifest selection and append-only history.
5. seven-resource canonical build and hash verification.
6. PR build without deploy.
7. default-branch production deploy and artifact contents.
8. public manifest/resource/hash/brand/canonical verification.
9. rollback through a new approved release/history row referencing previous immutable versions.

- [ ] **Step 4: Run the full local matrix**

Run:

```powershell
npm.cmd run content:validate
$auditBaseCommit = git rev-parse HEAD^
if ($auditBaseCommit -notmatch '^[0-9a-f]{40}$') { throw "INVALID_AUDIT_BASE_COMMIT" }
npm.cmd run content:audit -- --base-ref $auditBaseCommit
npm.cmd run build:pages
npm.cmd test
npm.cmd run check
git diff --check
```

Expected: all commands exit 0; the base commit argument is an observed Git SHA selected by the workflow/operator, not a value stored in content CSV.

- [ ] **Step 5: Verify the deployed public origin before marking it complete**

After the production workflow succeeds, verify:

```powershell
Resolve-DnsName kokoroparea.gerupon.uk
Invoke-WebRequest -UseBasicParsing https://kokoroparea.gerupon.uk/
Invoke-WebRequest -UseBasicParsing https://kokoroparea.gerupon.uk/content/content-manifest.json
```

Expected only after live configuration: DNS resolves to the configured GitHub Pages target, HTTPS succeeds without certificate warning, both requests return HTTP 200, HTML canonical/OG and `appMeta.brand.publicOrigin` match the origin, manifest identifies `release-mvp-0.1.0`, and all seven public resource hashes match downloaded bytes. Until those observations exist, documents say “public origin configured in code; DNS/HTTPS/production Pages not yet verified.”

- [ ] **Step 6: Browser smoke and failure checks**

At `https://kokoroparea.gerupon.uk/#/start`, verify:

- loading completes before start interaction;
- brand name/icon and result flow render;
- result-text-v2 and presentation-v2 versions are visible where designed;
- one selected palette and three fragrance share labels work while material examples stay out of share output;
- no release selector exists;
- no external API/analytics request occurs;
- a fixture deployment with one tampered resource shows retry and never starts diagnosis;
- character/Canvas/share failures retain result text and copy fallback.

- [ ] **Step 7: Synchronize facts and commit**

Record actual workflow run, commit, release ID, public checks, test counts, and rollback procedure. Do not claim a check that was not observed.

```powershell
git add AGENTS.md docs/基本設計サマリ.md docs/data-model.md docs/processing-design.md docs/screens.md docs/tasks.md docs/content-authoring.md docs/github-pages-content-release.md app/tests/project-contract.test.js
git commit -m "docs: record production content operations"
```

## Activation Completion Gate

- every selected source row and Q-006/Q-012/Q-013 approval gate is genuinely approved;
- the selected tuple uses `result-text-v2` and root-schema-2 `presentation-v2`;
- both fragrance material CSVs compile inside the existing `presentation` resource;
- one immutable release produces exactly seven canonical hashed resources through the existing atomic writer;
- runtime validates same-origin bytes, hashes, schemas, versions, and references before diagnosis starts;
- material examples remain absent from share summary/card/text;
- `brand-v1`, `ココロパレア`, canonical/OG URL, and `appMeta.brand.publicOrigin` agree on `https://kokoroparea.gerupon.uk`;
- CSP allows only same-origin JSON connections and normal-mode external sending remains zero;
- only one workflow can deploy to the production Pages environment;
- production artifact contains no authoring CSV, unapproved content, QA noindex files, local paths, secrets, or personal data;
- DNS, HTTPS, and Pages are complete only after live verification;
- rollback appends a new approved immutable release/history row;
- all local, workflow, artifact, public hash, and browser checks pass.
