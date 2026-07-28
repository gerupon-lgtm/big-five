# QA Preview GitHub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 現在のES Modules版正式アプリだけを検証済みartifactへ組み立て、`codex/big-five-q006`からGitHub Pagesの公開QA URLへ安全に配信する。

**Architecture:** Node.jsのQA専用assemblerが`app/`から許可済みruntimeファイルだけを`dist/qa-preview/`へ決定的にコピーし、生成後にpath・拡張子・symlink・検索除外設定を再監査する。GitHub Actionsは全テストと静的検証に成功したartifactだけをGitHub Pagesへupload/deployし、production CSV activationやT-011の正式完了とは分離する。

**Tech Stack:** Node.js 24 ES Modules、`node:test`、GitHub Actions、GitHub Pages、`actions/checkout@v6`、`actions/setup-node@v7`、`actions/configure-pages@v5`、`actions/upload-pages-artifact@v4`、`actions/deploy-pages@v4`

## Global Constraints

- 正典worktreeは`C:\Users\user\Documents\診断系アプリ開発\.worktrees\big-five-q006`、対象ブランチは`codex/big-five-q006`とする。
- QA URLは`https://gerupon-lgtm.github.io/big-five/`とし、URLを知っている人が閲覧できる公開プレビューとする。
- 通常モードの`betaAggregationEnabled: false`、`betaApiBaseUrl: null`、CSPの`connect-src 'none'`を変更しない。
- 回答、途中経過、結果、履歴はブラウザの`localStorage`だけに保存し、外部送信しない。
- artifactへ`content/`、CSV、`docs/`、`app/tests/`、`app/dev-server.mjs`、制作元PNG、制作台帳、承認メモ、source map、ログを含めない。
- artifactに含めてよいのは`index.html`、`robots.txt`、`.nojekyll`、`css/**/*.css`、`js/**/*.js`、`assets/characters/*.webp`だけとする。
- QAプレビューはapproved release、JSON runtime、Q-012正式release、Q-013 production data、T-011 production deploymentを完了扱いにしない。
- `robots.txt`と`noindex,nofollow`は検索掲載抑制であり、アクセス制御とは表現しない。
- 既存Pagesサイトが存在する場合は同じproject siteを置き換えるため、GitHub Pages設定を有効化する前に既存公開物の有無を確認する。

---

## File Map

| File | Responsibility |
|---|---|
| `scripts/qa/qa-preview-artifact.mjs` | runtime allowlistの収集、symlink拒否、HTMLへのnoindex追加、決定的なartifact生成、生成後監査 |
| `scripts/qa/build-qa-preview.mjs` | `--app`、`--output`、`--allowed-parent`のexact CLIと安定エラー出力 |
| `app/tests/qa-preview-artifact.test.js` | assemblerの正常系、禁止path、unsafe output、symlink、決定性、静的配信smoke |
| `package.json` | `qa:preview:build`標準コマンド |
| `.github/workflows/qa-preview-pages.yml` | branch pushの検証、artifact upload、Pages deploy |
| `app/tests/qa-preview-workflow-contract.test.js` | workflowのtrigger、action版、最小権限、job依存、upload対象の契約検証 |
| `docs/qa-preview-pages.md` | QA URL、GitHub設定、確認手順、再deploy、停止手順 |
| `docs/tasks.md` | QA previewのT-011分離記録とF-005／F-006のQ-006承認状態同期 |
| `app/tests/project-contract.test.js` | runbookとtasksの状態表現が後退しない文書契約 |

---

### Task 1: Deterministic QA Preview Artifact

**Files:**
- Create: `scripts/qa/qa-preview-artifact.mjs`
- Create: `scripts/qa/build-qa-preview.mjs`
- Create: `app/tests/qa-preview-artifact.test.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: `app/index.html`、`app/css/**/*.css`、`app/js/**/*.js`、`app/assets/characters/*.webp`
- Produces: `assembleQaPreview({ appDir, outputDir, allowedParentDir }) -> Promise<{ files: string[], totalBytes: number }>`
- Produces: `auditQaPreviewArtifact(outputDir) -> Promise<{ files: string[], totalBytes: number }>`
- Produces: CLI `node scripts/qa/build-qa-preview.mjs --app app --output dist/qa-preview --allowed-parent .`
- Error contract: public functions and CLI use `QA_PREVIEW_INPUT_INVALID`、`QA_PREVIEW_SOURCE_INVALID`、`QA_PREVIEW_OUTPUT_INVALID`、`QA_PREVIEW_ARTIFACT_INVALID`

- [ ] **Step 1: Write the failing artifact tests**

Create `app/tests/qa-preview-artifact.test.js` with actual-repository and isolated-fixture coverage:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  assembleQaPreview,
  auditQaPreviewArtifact,
} from "../../scripts/qa/qa-preview-artifact.mjs";

async function tempDirectory(t, prefix) {
  const directory = await mkdtemp(join(tmpdir(), prefix));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test("QA artifact contains only the approved runtime allowlist", async (t) => {
  const parent = await tempDirectory(t, "big-five-qa-pages-");
  const output = join(parent, "site");
  const report = await assembleQaPreview({
    appDir: resolve("app"),
    outputDir: output,
    allowedParentDir: parent,
  });

  assert.equal(report.files[0], ".nojekyll");
  assert.equal(report.files.includes("index.html"), true);
  assert.equal(report.files.includes("robots.txt"), true);
  assert.equal(report.files.filter((path) => path.endsWith(".webp")).length, 51);
  assert.equal(report.files.some((path) =>
    /(?:^|\/)(?:content|docs|tests)(?:\/|$)/.test(path)), false);
  assert.equal(report.files.includes("dev-server.mjs"), false);

  const html = await readFile(join(output, "index.html"), "utf8");
  assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
  assert.equal(
    (html.match(/name="robots"/g) ?? []).length,
    1,
  );
  assert.equal(
    await readFile(join(output, "robots.txt"), "utf8"),
    "User-agent: *\nDisallow: /\n",
  );
});

test("QA artifact is byte-identical across two builds", async (t) => {
  const parent = await tempDirectory(t, "big-five-qa-repeat-");
  const first = join(parent, "first");
  const second = join(parent, "second");
  const firstReport = await assembleQaPreview({
    appDir: resolve("app"),
    outputDir: first,
    allowedParentDir: parent,
  });
  const secondReport = await assembleQaPreview({
    appDir: resolve("app"),
    outputDir: second,
    allowedParentDir: parent,
  });
  assert.deepEqual(firstReport, secondReport);
  for (const path of firstReport.files) {
    assert.deepEqual(
      await readFile(join(first, ...path.split("/"))),
      await readFile(join(second, ...path.split("/"))),
    );
  }
});

test("QA artifact rejects an output outside the allowed parent", async (t) => {
  const parent = await tempDirectory(t, "big-five-qa-safe-");
  await assert.rejects(
    () => assembleQaPreview({
      appDir: resolve("app"),
      outputDir: join(parent, "..", "escape"),
      allowedParentDir: parent,
    }),
    (error) => error?.code === "QA_PREVIEW_OUTPUT_INVALID",
  );
});

test("QA artifact rejects symlinks without following them", async (t) => {
  const root = await tempDirectory(t, "big-five-qa-link-");
  const app = join(root, "app");
  await mkdir(join(app, "css"), { recursive: true });
  await mkdir(join(app, "js"), { recursive: true });
  await mkdir(join(app, "assets", "characters"), { recursive: true });
  await writeFile(join(app, "index.html"), "<html><head></head><body></body></html>");
  await writeFile(join(app, "css", "styles.css"), "");
  await writeFile(join(app, "js", "main.js"), "");
  const target = join(root, "cat.webp");
  await writeFile(target, "not-an-image");
  try {
    await symlink(target, join(app, "assets", "characters", "cat.webp"), "file");
  } catch (error) {
    if (error?.code === "EPERM") {
      t.skip("symlink creation is not permitted in this environment");
      return;
    }
    throw error;
  }
  await assert.rejects(
    () => assembleQaPreview({
      appDir: app,
      outputDir: join(root, "out"),
      allowedParentDir: root,
    }),
    (error) => error?.code === "QA_PREVIEW_SOURCE_INVALID",
  );
});

test("generated QA artifact serves the shell, module, CSS, and one character only", async (t) => {
  const parent = await tempDirectory(t, "big-five-qa-smoke-");
  const output = join(parent, "site");
  await assembleQaPreview({
    appDir: resolve("app"),
    outputDir: output,
    allowedParentDir: parent,
  });
  const audit = await auditQaPreviewArtifact(output);
  assert.equal(audit.files.includes("js/main.js"), true);
  assert.equal(audit.files.includes("css/styles.css"), true);
  assert.equal(
    audit.files.includes("assets/characters/character-balanced.webp"),
    true,
  );

  const server = createServer(async (request, response) => {
    const relative = request.url === "/" ? "index.html" : request.url.slice(1);
    if (!audit.files.includes(relative)) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200).end(await readFile(join(output, ...relative.split("/"))));
  });
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  t.after(() => new Promise((resolveClose) => server.close(resolveClose)));
  const { port } = server.address();
  for (const path of [
    "/",
    "/css/styles.css",
    "/js/main.js",
    "/assets/characters/character-balanced.webp",
  ]) {
    assert.equal((await fetch(`http://127.0.0.1:${port}${path}`)).status, 200);
  }
  for (const path of ["/content/source/", "/docs/", "/tests/"]) {
    assert.equal((await fetch(`http://127.0.0.1:${port}${path}`)).status, 404);
  }
});
```

- [ ] **Step 2: Run the tests and verify the missing-module failure**

Run:

```powershell
node --test app/tests/qa-preview-artifact.test.js
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/qa/qa-preview-artifact.mjs`.

- [ ] **Step 3: Implement the artifact library**

Create `scripts/qa/qa-preview-artifact.mjs` using only Node built-ins. Implement the exact allowlist and safe-output boundary:

```js
import {
  cp,
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

const STATIC_FILES = new Set(["index.html", "robots.txt", ".nojekyll"]);
const ALLOWED_PATTERNS = [
  /^css\/.+\.css$/,
  /^js\/.+\.js$/,
  /^assets\/characters\/[^/]+\.webp$/,
];

function qaError(code) {
  return Object.assign(new Error(code), { code });
}

function normalizeRelative(filePath) {
  return filePath.split(path.sep).join("/");
}

function isAllowedArtifactPath(relativePath) {
  return STATIC_FILES.has(relativePath) ||
    ALLOWED_PATTERNS.some((pattern) => pattern.test(relativePath));
}

async function collectFiles(root, current = root) {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    const absolute = path.join(current, entry.name);
    const info = await lstat(absolute);
    if (info.isSymbolicLink()) throw qaError("QA_PREVIEW_ARTIFACT_INVALID");
    if (info.isDirectory()) files.push(...await collectFiles(root, absolute));
    else if (info.isFile()) files.push(normalizeRelative(path.relative(root, absolute)));
    else throw qaError("QA_PREVIEW_ARTIFACT_INVALID");
  }
  return files;
}

async function assertSafeOutput(outputDir, allowedParentDir) {
  const parent = await realpath(path.resolve(allowedParentDir))
    .catch(() => { throw qaError("QA_PREVIEW_OUTPUT_INVALID"); });
  const output = path.resolve(outputDir);
  const relative = path.relative(parent, output);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw qaError("QA_PREVIEW_OUTPUT_INVALID");
  }
  return { output, parent };
}

function addNoIndex(html) {
  if (typeof html !== "string" || !html.includes("</head>")) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  if (/name=["']robots["']/i.test(html)) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  return html.replace(
    "</head>",
    '    <meta name="robots" content="noindex,nofollow">\n  </head>',
  );
}

async function copyTree({ source, destination, extension }) {
  const rootInfo = await lstat(source)
    .catch(() => { throw qaError("QA_PREVIEW_SOURCE_INVALID"); });
  if (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  const entries = await readdir(source, { withFileTypes: true })
    .catch(() => { throw qaError("QA_PREVIEW_SOURCE_INVALID"); });
  for (const entry of entries.sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    const info = await lstat(sourcePath);
    if (info.isSymbolicLink()) throw qaError("QA_PREVIEW_SOURCE_INVALID");
    if (info.isDirectory()) {
      await mkdir(destinationPath, { recursive: true });
      await copyTree({ source: sourcePath, destination: destinationPath, extension });
    } else if (info.isFile() && path.extname(entry.name) === extension) {
      await cp(sourcePath, destinationPath, { force: false });
    } else {
      throw qaError("QA_PREVIEW_SOURCE_INVALID");
    }
  }
}

export async function auditQaPreviewArtifact(outputDir) {
  const files = await collectFiles(path.resolve(outputDir));
  if (files.length === 0 ||
      files.some((file) => !isAllowedArtifactPath(file)) ||
      !files.includes("index.html") ||
      !files.includes("robots.txt") ||
      !files.includes(".nojekyll") ||
      !files.some((file) => file.startsWith("css/")) ||
      !files.some((file) => file.startsWith("js/")) ||
      !files.some((file) => file.startsWith("assets/characters/"))) {
    throw qaError("QA_PREVIEW_ARTIFACT_INVALID");
  }
  let totalBytes = 0;
  for (const file of files) {
    totalBytes += (await stat(path.join(outputDir, ...file.split("/")))).size;
  }
  return Object.freeze({ files: Object.freeze(files), totalBytes });
}

export async function assembleQaPreview({ appDir, outputDir, allowedParentDir }) {
  if (![appDir, outputDir, allowedParentDir].every(
    (value) => typeof value === "string" && value.length > 0,
  )) {
    throw qaError("QA_PREVIEW_INPUT_INVALID");
  }
  const requestedApp = path.resolve(appDir);
  const appInfo = await lstat(requestedApp)
    .catch(() => { throw qaError("QA_PREVIEW_SOURCE_INVALID"); });
  if (!appInfo.isDirectory() || appInfo.isSymbolicLink()) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  const app = await realpath(requestedApp)
    .catch(() => { throw qaError("QA_PREVIEW_SOURCE_INVALID"); });
  const { output } = await assertSafeOutput(outputDir, allowedParentDir);
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: false });

  const indexInfo = await lstat(path.join(app, "index.html"))
    .catch(() => { throw qaError("QA_PREVIEW_SOURCE_INVALID"); });
  if (!indexInfo.isFile() || indexInfo.isSymbolicLink()) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  await writeFile(
    path.join(output, "index.html"),
    addNoIndex(await readFile(path.join(app, "index.html"), "utf8")),
    "utf8",
  );
  await mkdir(path.join(output, "css"));
  await copyTree({
    source: path.join(app, "css"),
    destination: path.join(output, "css"),
    extension: ".css",
  });
  await mkdir(path.join(output, "js"));
  await copyTree({
    source: path.join(app, "js"),
    destination: path.join(output, "js"),
    extension: ".js",
  });
  await mkdir(path.join(output, "assets", "characters"), { recursive: true });
  await copyTree({
    source: path.join(app, "assets", "characters"),
    destination: path.join(output, "assets", "characters"),
    extension: ".webp",
  });
  await writeFile(path.join(output, ".nojekyll"), "", "utf8");
  await writeFile(
    path.join(output, "robots.txt"),
    "User-agent: *\nDisallow: /\n",
    "utf8",
  );
  return auditQaPreviewArtifact(output);
}
```

During implementation, preserve these invariants even if the code is refactored:

- `lstat` every source and output entry before following it.
- Resolve and validate `allowedParentDir` before recursive removal.
- Reject unexpected files in runtime input roots rather than silently publishing or silently omitting them.
- Sort every directory traversal before reporting or copying.

- [ ] **Step 4: Implement the exact CLI**

Create `scripts/qa/build-qa-preview.mjs`:

```js
import { assembleQaPreview } from "./qa-preview-artifact.mjs";

function cliError() {
  return Object.assign(
    new Error("QA_PREVIEW_INPUT_INVALID"),
    { code: "QA_PREVIEW_INPUT_INVALID" },
  );
}

function parseArguments(argv) {
  const allowed = new Set(["--app", "--output", "--allowed-parent"]);
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!allowed.has(key) ||
        Object.hasOwn(values, key) ||
        index + 1 >= argv.length ||
        argv[index + 1].startsWith("--")) {
      throw cliError();
    }
    values[key] = argv[++index];
  }
  if (!values["--app"] || !values["--output"] || !values["--allowed-parent"]) {
    throw cliError();
  }
  return values;
}

try {
  const args = parseArguments(process.argv.slice(2));
  const report = await assembleQaPreview({
    appDir: args["--app"],
    outputDir: args["--output"],
    allowedParentDir: args["--allowed-parent"],
  });
  process.stdout.write(
    `QA preview artifact: ${report.files.length} files, ${report.totalBytes} bytes\n`,
  );
} catch (error) {
  const code = typeof error?.code === "string"
    ? error.code
    : "QA_PREVIEW_ARTIFACT_INVALID";
  process.stderr.write(`[${code}] QA preview artifactを生成できませんでした。\n`);
  process.exitCode = 1;
}
```

- [ ] **Step 5: Add the package command**

Add this exact script to `package.json`:

```json
"qa:preview:build": "node scripts/qa/build-qa-preview.mjs --app app --output dist/qa-preview --allowed-parent ."
```

Keep `dist/` in `.gitignore`; do not commit generated artifacts.

- [ ] **Step 6: Run focused tests and the actual build**

Run:

```powershell
node --test app/tests/qa-preview-artifact.test.js
npm.cmd run qa:preview:build
git status --short
```

Expected:

- Artifact tests PASS.
- Build reports a non-zero file and byte count.
- `git status --short` does not list `dist/qa-preview/`.

- [ ] **Step 7: Commit Task 1**

```powershell
git add scripts/qa/qa-preview-artifact.mjs scripts/qa/build-qa-preview.mjs app/tests/qa-preview-artifact.test.js package.json
git commit -m "feat: assemble QA Pages preview"
```

---

### Task 2: Test-Gated GitHub Pages Workflow

**Files:**
- Create: `.github/workflows/qa-preview-pages.yml`
- Create: `app/tests/qa-preview-workflow-contract.test.js`

**Interfaces:**
- Consumes: `npm test`、`npm run check`、`npm run qa:preview:build`
- Consumes: `dist/qa-preview/`
- Produces: GitHub Pages artifact named by `actions/upload-pages-artifact`
- Produces: deployment URL from `steps.deployment.outputs.page_url`
- Trigger contract: push to `codex/big-five-q006`; `workflow_dispatch` is declared but is not the primary trigger while the workflow is absent from the default branch

- [ ] **Step 1: Write the failing workflow contract test**

Create `app/tests/qa-preview-workflow-contract.test.js`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("QA Pages workflow verifies and uploads only dist/qa-preview", async () => {
  const workflow = await readFile(
    ".github/workflows/qa-preview-pages.yml",
    "utf8",
  );
  assert.match(workflow, /codex\/big-five-q006/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /permissions:\s*\n\s*contents: read/);
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
  assert.match(workflow, /actions\/checkout@v6/);
  assert.match(workflow, /actions\/setup-node@v7/);
  assert.match(workflow, /node-version:\s*24/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run check/);
  assert.match(workflow, /npm run qa:preview:build/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /path:\s*dist\/qa-preview/);
  assert.match(workflow, /needs:\s*build/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.doesNotMatch(workflow, /content\/source|app\/content|path:\s*\./);
});
```

- [ ] **Step 2: Run the test and verify the missing-workflow failure**

Run:

```powershell
node --test app/tests/qa-preview-workflow-contract.test.js
```

Expected: FAIL with `ENOENT` for `.github/workflows/qa-preview-pages.yml`.

- [ ] **Step 3: Create the workflow**

Create `.github/workflows/qa-preview-pages.yml`:

```yaml
name: Deploy QA preview to Pages

on:
  push:
    branches:
      - codex/big-five-q006
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: qa-pages-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6
      - name: Use Node.js 24
        uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Run all tests
        run: npm test
      - name: Run static checks
        run: npm run check
      - name: Build QA preview artifact
        run: npm run qa:preview:build
      - name: Configure GitHub Pages
        uses: actions/configure-pages@v5
      - name: Upload QA preview artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: dist/qa-preview

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy QA preview
        id: deployment
        uses: actions/deploy-pages@v4
```

Do not add `pull_request` deployment. Do not upload the repository root or `app/`.

- [ ] **Step 4: Run the workflow contract and full formal tests**

Run:

```powershell
node --test app/tests/qa-preview-workflow-contract.test.js
npm.cmd run test:formal
npm.cmd run check
```

Expected: all commands PASS.

- [ ] **Step 5: Commit Task 2**

```powershell
git add .github/workflows/qa-preview-pages.yml app/tests/qa-preview-workflow-contract.test.js
git commit -m "ci: deploy QA preview to Pages"
```

---

### Task 3: QA Runbook and Canonical Status Sync

**Files:**
- Create: `docs/qa-preview-pages.md`
- Modify: `docs/tasks.md`
- Modify: `app/tests/project-contract.test.js`

**Interfaces:**
- Consumes: QA URL `https://gerupon-lgtm.github.io/big-five/`
- Consumes: workflow name `Deploy QA preview to Pages`
- Produces: exact GitHub setting, QA checklist, redeploy and unpublish procedures
- Status contract: `result-text-v1` Content Approval complete on 2026-07-28; `titleReflection` pending; T-011 production deployment incomplete

- [ ] **Step 1: Add failing documentation contract tests**

Append focused assertions to `app/tests/project-contract.test.js`:

```js
test("QA Pages runbook separates preview deployment from production release", async () => {
  const [runbook, tasks] = await Promise.all([
    readFile("docs/qa-preview-pages.md", "utf8"),
    readFile("docs/tasks.md", "utf8"),
  ]);
  assert.match(runbook, /https:\/\/gerupon-lgtm\.github\.io\/big-five\//);
  assert.match(runbook, /Settings.*Pages.*GitHub Actions/s);
  assert.match(runbook, /localStorage/);
  assert.match(runbook, /外部送信0件/);
  assert.match(runbook, /公開を解除/);
  assert.match(runbook, /T-011.*完了.*ではない/s);
  assert.match(tasks, /F-005.*result-text-v1.*2026-07-28.*完了/);
  assert.match(tasks, /F-006.*result-text-v1.*2026-07-28.*完了/);
  assert.match(tasks, /titleReflection.*pending/);
  assert.match(tasks, /QA一時プレビュー.*T-011.*完了.*扱わない/s);
});
```

If `readFile` is already imported, reuse the existing import rather than adding a duplicate.

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```powershell
node --test app/tests/project-contract.test.js
```

Expected: FAIL because `docs/qa-preview-pages.md` does not exist and F-005／F-006 still contain stale pending copy.

- [ ] **Step 3: Write the runbook**

Create `docs/qa-preview-pages.md` with these exact sections and facts:

```markdown
# QA用GitHub Pages一時プレビュー

## 位置づけ

このURLは現在のES Modules版を実ブラウザ確認するQA専用公開物である。approved release、JSON runtime、Q-012正式release、Q-013 production data、T-011 production deploymentの完了を意味しない。

## URL

https://gerupon-lgtm.github.io/big-five/

## 初回設定

1. GitHubの`gerupon-lgtm/big-five`を開く。
2. `Settings` → `Pages`を開く。
3. `Build and deployment`のSourceを`GitHub Actions`にする。
4. `Actions`で`Deploy QA preview to Pages`の最新runを確認する。
5. `build`と`deploy`が成功した後、deployment URLを開く。

既存Pagesサイトがある場合は同じURLが置き換わるため、設定変更前に既存公開物を確認する。

## 保存と通信

回答、途中経過、結果、履歴はブラウザの`localStorage`だけに保存する。通常版は外部送信0件で、別端末や別ブラウザへ履歴を同期しない。

## QAチェック

- 新規開始、途中保存、再読込、再開
- 20問簡易プレビュー
- 結果を見ず50問へ進む経路
- 20問結果から追加30問へ進む経路
- 50問詳細結果
- 称号、結果文、レーダー、5因子詳細、猫画像
- 履歴、保存結果の再表示、互換結果2件の比較
- 個別削除、全削除
- 320px、360px、960px、keyboard、dialog、横overflow
- DevTools Networkで回答・結果の外部送信0件
- console error／warning 0件

共有カード、色・香り、`titleReflection`、ベータ匿名集計は未実装のため対象外とする。

## 再deploy

`codex/big-five-q006`へQA対象変更をpushすると、全テスト成功後に再deployする。失敗したrunはActions画面から再実行する。

## 終了

1. QA workflowのbranch push triggerを削除またはworkflowを無効化する。
2. `Settings` → `Pages`でサイトの公開を解除する。
3. 公開URLが利用できないことを確認する。

workflowファイルを削除するだけでは最後のartifactが公開されたままになるため、Pagesの公開解除までを終了条件とする。
```

- [ ] **Step 4: Synchronize `docs/tasks.md`**

Make these exact status corrections:

- F-005: replace the stale statement that both `result-text-v1` and `titleReflection` are pending with “`result-text-v1` Content Approvalは2026-07-28に完了。`titleReflection`作成・承認はpending”。
- F-006: make the same split.
- T-011: add a dated note that the QA Pages preview publishes only the current ES Modules runtime from `codex/big-five-q006`; it does not select an approved release, activate JSON runtime, or complete T-011.
- Keep Q-012 formal release, Q-013 production data, Q-007 sharing, Q-008 production Pages decisions, and `titleReflection` pending.

- [ ] **Step 5: Run documentation and full tests**

Run:

```powershell
node --test app/tests/project-contract.test.js
npm.cmd test
npm.cmd run check
git diff --check
```

Expected: all commands PASS.

- [ ] **Step 6: Commit Task 3**

```powershell
git add docs/qa-preview-pages.md docs/tasks.md app/tests/project-contract.test.js
git commit -m "docs: add QA Pages runbook"
```

---

### Task 4: Final Local Audit and Origin Push

**Files:**
- Verify only; no new files expected

**Interfaces:**
- Consumes: Tasks 1–3 commits
- Produces: pushed `codex/big-five-q006` branch and a Pages workflow run

- [ ] **Step 1: Run the final local quality gate**

Run:

```powershell
npm.cmd test
npm.cmd run check
npm.cmd run content:validate
npm.cmd run qa:preview:build
git diff --check
git status --short --branch
```

Expected:

- All tests PASS.
- Static check PASS.
- Content validation reports error 0; known release/Q-012/Q-013 warnings remain non-blocking.
- QA artifact build succeeds.
- No uncommitted source changes remain.

- [ ] **Step 2: Audit the generated artifact directly**

Run:

```powershell
node -e "import('./scripts/qa/qa-preview-artifact.mjs').then(async ({auditQaPreviewArtifact}) => { const r = await auditQaPreviewArtifact('dist/qa-preview'); console.log(JSON.stringify(r)); })"
```

Expected:

- `files` contains only the Global Constraints allowlist.
- 51 `.webp` files are present.
- `totalBytes` is greater than zero.

- [ ] **Step 3: Push the branch**

Run:

```powershell
git push origin codex/big-five-q006
```

Expected: origin advances to the local HEAD and the `Deploy QA preview to Pages` push workflow starts.

- [ ] **Step 4: Inspect the workflow run**

If GitHub CLI authentication is available:

```powershell
gh run list --repo gerupon-lgtm/big-five --workflow qa-preview-pages.yml --limit 3
gh run watch --repo gerupon-lgtm/big-five
```

If authentication is unavailable, open the repository Actions page and inspect `Deploy QA preview to Pages`.

Expected:

- `build` succeeds before `deploy`.
- Uploaded artifact path is `dist/qa-preview`.
- No job uploads the repository root, `app/`, `content/`, or `docs/`.

- [ ] **Step 5: Handle the only expected settings blocker**

If `configure-pages` or `deploy-pages` reports that Pages is not configured:

1. Stop without changing application code.
2. Ask the repository owner to open `Settings` → `Pages`.
3. Set Source to `GitHub Actions`.
4. Confirm that no existing production Pages site will be displaced.
5. Re-run the same failed workflow run.

Do not change the workflow to branch-source publishing.

---

### Task 5: Published URL Smoke and QA Handoff

**Files:**
- Modify: `docs/qa-preview-pages.md` only if the actual URL or GitHub setting differs from the documented value

**Interfaces:**
- Consumes: successful Pages deployment
- Produces: verified public QA URL and user QA instructions

- [ ] **Step 1: Verify public runtime files**

Open `https://gerupon-lgtm.github.io/big-five/` and verify:

- `/` returns the app shell.
- `/css/styles.css` and `/js/main.js` return 200.
- `/assets/characters/character-balanced.webp` returns 200.
- `/content/source/`、`/docs/`、`/tests/` do not expose repository content.
- HTML contains `noindex,nofollow`.
- `/robots.txt` contains `Disallow: /`.

- [ ] **Step 2: Run the minimum live browser smoke**

In a real browser:

1. Open the start screen.
2. Start a diagnosis and answer at least one question.
3. Reload and confirm resume is offered.
4. Open history and confirm its current empty or saved state.
5. Inspect DevTools console for error／warning 0件.
6. Inspect Network and confirm no answer or result is sent outside the Pages origin.

Do not treat this minimum smoke as the complete manual QA checklist.

- [ ] **Step 3: Hand off the full QA checklist**

Provide the user:

- Public QA URL.
- Git commit hash deployed.
- Actions run result.
- Automated verification result.
- The checklist in `docs/qa-preview-pages.md`.
- Explicit exclusions: sharing, Q-013 color/fragrance, `titleReflection`, beta API, production release.
- Stop/unpublish procedure.

- [ ] **Step 4: Record deviations only when observed**

If the actual Pages URL, environment name, or required setting differs from this plan, update only the observed fact in `docs/qa-preview-pages.md`, rerun `app/tests/project-contract.test.js`, commit the factual correction, push, and reverify. Do not broaden QA preview into production activation.

---

## Final Verification Matrix

| Gate | Command or evidence | Pass condition |
|---|---|---|
| Artifact unit tests | `node --test app/tests/qa-preview-artifact.test.js` | all pass |
| Workflow contract | `node --test app/tests/qa-preview-workflow-contract.test.js` | all pass |
| Documentation contract | `node --test app/tests/project-contract.test.js` | all pass |
| Full regression | `npm.cmd test` | all pass |
| Static validation | `npm.cmd run check` | pass |
| Content validation | `npm.cmd run content:validate` | error 0 |
| Artifact build | `npm.cmd run qa:preview:build` | non-zero allowlisted report |
| Diff hygiene | `git diff --check` | no errors |
| Pages build | GitHub Actions `build` job | success |
| Pages deploy | GitHub Actions `deploy` job | success |
| Public smoke | QA URL and assets | expected 200/404 behavior |
| Privacy smoke | Browser Network | answer/result external transmission 0 |

## Official GitHub References Used

- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs
