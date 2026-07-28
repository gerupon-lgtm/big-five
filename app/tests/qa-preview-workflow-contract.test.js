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
