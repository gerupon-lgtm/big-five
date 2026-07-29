import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { inspectArtifact } from "../../scripts/check-static.mjs";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const EVIDENCE_URL = "https://ipip.ori.org/JapaneseBig-FiveFactorMarkers.htm";

async function withArtifactFixture(entries, callback) {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "big-five-artifact-"));
  try {
    for (const [relativePath, contents] of Object.entries(entries)) {
      const filePath = path.join(rootDir, relativePath);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, contents, "utf8");
    }
    await callback(rootDir);
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
}

async function assertArtifactRejected(entries, pattern) {
  await withArtifactFixture(entries, async (rootDir) => {
    assert.throws(() => inspectArtifact(rootDir), pattern);
  });
}

test("content commands are explicit and generated JSON is ignored", async () => {
  const packageJson = JSON.parse(await readFile(path.join(ROOT, "package.json"), "utf8"));
  const gitignore = await readFile(path.join(ROOT, ".gitignore"), "utf8");

  assert.equal(
    packageJson.scripts["content:validate"],
    "node scripts/content/validate-content.mjs --source content/source",
  );
  assert.equal(
    packageJson.scripts["content:build"],
    "node scripts/content/build-content.mjs --source content/source --output app/content --allowed-parent app",
  );
  assert.match(gitignore, /^app\/content\/$/m);
  assert.doesNotMatch(gitignore, /^content\/source\/$/m);
});

test("artifact inspector accepts generated JSON with an approved evidence locator", async () => {
  await withArtifactFixture({
    "diagnosis.json": JSON.stringify({
      sources: [{ url: EVIDENCE_URL }],
      evidence: [{ locator: "docs/requirements/2026-07-20-big-five-self-understanding-requirements.md#831" }],
      previewAllowed: false,
      safeProse: "review、approval、note、status は利用者向けの通常文言です。",
      copy: "レビュー前の表示ではありません。",
    }),
    "nested/runtime.json": JSON.stringify({ status: "approved" }),
    "readme.txt": "runtime artifact",
  }, async (rootDir) => {
    assert.deepEqual(inspectArtifact(rootDir), { checkedFiles: 3, checkedJsonFiles: 2 });
  });
});

test("artifact inspector rejects prohibited artifact file types and authoring paths", async () => {
  await assertArtifactRejected({ "source.csv": "id,status" }, /ARTIFACT_INSPECTION_FAILED.*\.csv/);
  await assertArtifactRejected({ "notes.md": "draft notes" }, /ARTIFACT_INSPECTION_FAILED.*\.md/);
  await assertArtifactRejected({ "bundle.js.map": "{}" }, /ARTIFACT_INSPECTION_FAILED.*\.map/);
  await assertArtifactRejected({ "content/source/definitions.json": "{}" }, /ARTIFACT_INSPECTION_FAILED.*content.source/);
});

test("artifact inspector rejects each unapproved authoring status structurally", async () => {
  for (const status of ["draft", "reviewed", "rejected"]) {
    await assertArtifactRejected(
      { "runtime.json": JSON.stringify({ status }) },
      new RegExp(`ARTIFACT_INSPECTION_FAILED.*${status}`),
    );
  }
});

test("artifact inspector normalizes authoring metadata and status key naming variants", async () => {
  for (const [key, value] of [
    ["approvalDate", "2026-07-26"],
    ["approvalMetadata", { approver: "user" }],
    ["approvalMetadataHash", "sha256:example"],
    ["approvedAt", "2026-07-26T12:00:00Z"],
    ["notes", "authoring note"],
    ["review_note", "human review"],
    ["review-note", "human review"],
    ["reviewMetadata", { reviewer: "user" }],
    ["reviewedAt", "2026-07-26T12:00:00Z"],
    ["Status", "draft"],
  ]) {
    await assertArtifactRejected(
      { "runtime.json": JSON.stringify({ [key]: value }) },
      /ARTIFACT_INSPECTION_FAILED/,
    );
  }
});

test("artifact inspector rejects approval metadata and notes structurally", async () => {
  await assertArtifactRejected(
    { "runtime.json": JSON.stringify({ approval: { approved_by: "user" } }) },
    /ARTIFACT_INSPECTION_FAILED.*approval/,
  );
  await assertArtifactRejected(
    { "runtime.json": JSON.stringify({ review_note: "human review" }) },
    /ARTIFACT_INSPECTION_FAILED.*review_note/,
  );
});

test("artifact inspector rejects local paths, credentials, and undisclosed external URLs", async () => {
  for (const value of ["C:\\private\\artifact.json", "/srv/private/artifact.json", "file:///tmp/artifact.json", "api_token=secret-value", "https://example.invalid/data"]) {
    await assertArtifactRejected(
      { "runtime.json": JSON.stringify({ value }) },
      /ARTIFACT_INSPECTION_FAILED/,
    );
  }
});

test("artifact inspector rejects realistic standalone tokens without exposing their values", async () => {
  const tokens = [
    "ghp_1234567890abcdefghijklmnopqrstuvwxyz",
    "github_pat_1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghij",
    "sk-proj-1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "sk-1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ];

  for (const token of tokens) {
    for (const [relativePath, contents] of [
      ["runtime.json", JSON.stringify({ value: token })],
      ["copy.txt", `Generated artifact copy contains ${token} for this fixture.`],
    ]) {
      await withArtifactFixture({ [relativePath]: contents }, async (rootDir) => {
        assert.throws(
          () => inspectArtifact(rootDir),
          (error) => {
            assert.match(error.message, /ARTIFACT_INSPECTION_FAILED.*credential-like value/);
            assert.equal(error.message.includes(token), false);
            return true;
          },
        );
      });
    }
  }
});

test("artifact inspector permits short token examples and ordinary identifiers in safe prose", async () => {
  await withArtifactFixture({
    "copy.txt": "Examples: ghp_..., github_pat_..., sk-proj-..., and sk-... are redacted placeholders. Build ID: sk-preview-build-2026-release-candidate-identifier.",
  }, async (rootDir) => {
    assert.deepEqual(inspectArtifact(rootDir), { checkedFiles: 1, checkedJsonFiles: 0 });
  });
});

test("artifact inspector rejects embedded local paths without rejecting legal locators", async () => {
  await withArtifactFixture({
    "runtime.json": JSON.stringify({
      locator: "docs/requirements/2026-07-20-big-five-self-understanding-requirements.md#831",
      sourceUrl: EVIDENCE_URL,
      copy: "通常の説明文です。",
    }),
  }, async (rootDir) => {
    assert.deepEqual(inspectArtifact(rootDir), { checkedFiles: 1, checkedJsonFiles: 1 });
  });

  for (const value of [
    "private artifact is file:///tmp/private.json",
    "private artifact is C:\\private\\artifact.json",
    "private artifact is /srv/private/artifact.json",
  ]) {
    await assertArtifactRejected(
      { "runtime.json": JSON.stringify({ value }) },
      /ARTIFACT_INSPECTION_FAILED/,
    );
  }
});

test("artifact inspector rejects invalid JSON and symlinks without following them", async (t) => {
  await assertArtifactRejected({ "runtime.json": "{not json" }, /ARTIFACT_INSPECTION_FAILED.*invalid JSON/);

  const invalidUtf8Root = await mkdtemp(path.join(os.tmpdir(), "big-five-artifact-utf8-"));
  try {
    await writeFile(path.join(invalidUtf8Root, "runtime.json"), Buffer.from([0xc3, 0x28]));
    assert.throws(() => inspectArtifact(invalidUtf8Root), /ARTIFACT_INSPECTION_FAILED.*invalid UTF-8/);
  } finally {
    await rm(invalidUtf8Root, { recursive: true, force: true });
  }

  const rootDir = await mkdtemp(path.join(os.tmpdir(), "big-five-artifact-symlink-"));
  const target = path.join(rootDir, "target.json");
  const link = path.join(rootDir, "link.json");
  await writeFile(target, "{}", "utf8");
  try {
    await symlink(target, link, "file");
  } catch (error) {
    if (error?.code === "EPERM") {
      t.skip("symlink creation is not permitted in this environment");
      return;
    }
    throw error;
  }
  try {
    assert.throws(() => inspectArtifact(rootDir), /ARTIFACT_INSPECTION_FAILED.*symlink/);
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
});

test("canonical documents state the CSV authoring foundation without activation claims", async () => {
  const paths = [
    "AGENTS.md",
    "docs/基本設計サマリ.md",
    "docs/data-model.md",
    "docs/processing-design.md",
    "docs/screens.md",
    "docs/tasks.md",
    "docs/content-authoring.md",
  ];
  const documents = await Promise.all(paths.map((relativePath) => readFile(path.join(ROOT, relativePath), "utf8")));
  for (const text of documents) {
    assert.match(text, /content\/source|CSV/);
  }
  const joined = documents.join("\n");
  assert.match(joined, /Q-006.*Content Approval.*(?:完了|approved)|Content Approval.*(?:完了|approved).*Q-006/);
  assert.match(joined, /TR-0〜TR-4.*(?:承認|approved)/);
  assert.match(joined, /approved release.*(?:未選択|ありません)/);
  assert.match(joined, /connect-src 'none'/);
  assert.match(joined, /2026-07-26-csv-content-activation-pages\.md/);
  assert.match(joined, /ES Modules/);
  assert.doesNotMatch(joined, /runtime JSON loading is complete/i);
});
