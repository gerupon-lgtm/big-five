import assert from "node:assert/strict";
import test from "node:test";
import { lstat, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
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

test("QA artifact creates a missing output parent inside the allowed parent", async (t) => {
  const parent = await tempDirectory(t, "big-five-qa-output-parent-");
  const output = join(parent, "dist", "site");
  const report = await assembleQaPreview({
    appDir: resolve("app"),
    outputDir: output,
    allowedParentDir: parent,
  });

  assert.equal(report.files.includes("index.html"), true);
});

test("QA artifact rejects a symlinked existing output without following it", async (t) => {
  const root = await tempDirectory(t, "big-five-qa-output-link-");
  const output = join(root, "site");
  const target = join(root, "outside");
  await mkdir(target);
  try {
    await symlink(target, output, "junction");
  } catch (error) {
    if (error?.code === "EPERM") {
      t.skip("symlink creation is not permitted in this environment");
      return;
    }
    throw error;
  }
  await assert.rejects(
    () => assembleQaPreview({
      appDir: resolve("app"),
      outputDir: output,
      allowedParentDir: root,
    }),
    (error) => error?.code === "QA_PREVIEW_OUTPUT_INVALID",
  );
  assert.equal((await lstat(output)).isSymbolicLink(), true);
});

test("QA artifact audit reports a stable error for a missing output", async (t) => {
  const root = await tempDirectory(t, "big-five-qa-audit-");
  await assert.rejects(
    () => auditQaPreviewArtifact(join(root, "missing")),
    (error) => error?.code === "QA_PREVIEW_ARTIFACT_INVALID",
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
