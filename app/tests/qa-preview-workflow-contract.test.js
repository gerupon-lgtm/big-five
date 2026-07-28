import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function readQaPreviewWorkflow() {
  const workflow = await readFile(
    ".github/workflows/qa-preview-pages.yml",
    "utf8",
  );
  return workflow.replaceAll("\r\n", "\n");
}

function extractTopLevelBlock(workflow, key) {
  const lines = workflow.replaceAll("\r\n", "\n").split("\n");
  const start = lines.indexOf(`${key}:`);
  assert.notEqual(start, -1, `missing top-level ${key} block`);
  let end = start + 1;

  while (
    end < lines.length
    && (lines[end] === "" || /^\s/.test(lines[end]))
  ) {
    end += 1;
  }

  return lines.slice(start, end).join("\n").trimEnd();
}

function extractActionStep(workflow, action) {
  const lines = workflow.replaceAll("\r\n", "\n").split("\n");
  const actionLine = `        uses: ${action}`;
  const actionIndex = lines.indexOf(actionLine);
  assert.notEqual(actionIndex, -1, `missing action ${action}`);
  let start = actionIndex;

  while (start >= 0 && !/^ {6}- /.test(lines[start])) {
    start -= 1;
  }
  assert.notEqual(start, -1, `missing step for ${action}`);

  let end = actionIndex + 1;
  while (
    end < lines.length
    && (
      lines[end] === ""
      || (!/^ {6}- /.test(lines[end]) && !/^ {0,6}\S/.test(lines[end]))
    )
  ) {
    end += 1;
  }

  return lines.slice(start, end).join("\n").trimEnd();
}

function assertWorkflowContract(workflow) {
  assert.equal(
    extractTopLevelBlock(workflow, "on"),
    [
      "on:",
      "  push:",
      "    branches:",
      "      - codex/big-five-q006",
      "  workflow_dispatch:",
    ].join("\n"),
  );
  assert.equal(
    extractTopLevelBlock(workflow, "permissions"),
    [
      "permissions:",
      "  contents: read",
      "  pages: write",
      "  id-token: write",
    ].join("\n"),
  );
  assert.deepEqual(
    workflow.match(/^[ \t]*permissions[ \t]*:/gm),
    ["permissions:"],
  );
  assert.match(workflow, /actions\/checkout@v6/);
  assert.match(workflow, /actions\/setup-node@v7/);
  assert.match(workflow, /node-version:\s*24/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run check/);
  assert.match(workflow, /npm run qa:preview:build/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.deepEqual(
    workflow.match(/actions\/upload-pages-artifact@[^\s]+/g),
    ["actions/upload-pages-artifact@v4"],
  );
  assert.equal(
    extractActionStep(workflow, "actions/upload-pages-artifact@v4"),
    [
      "      - name: Upload QA preview artifact",
      "        uses: actions/upload-pages-artifact@v4",
      "        with:",
      "          path: dist/qa-preview",
    ].join("\n"),
  );
  assert.match(
    workflow,
    /^  deploy:\n    environment:\n      name: github-pages\n      url: \$\{\{ steps\.deployment\.outputs\.page_url \}\}\n    runs-on: ubuntu-latest$/m,
  );
  assert.match(workflow, /needs:\s*build/);
  assert.equal(
    extractActionStep(workflow, "actions/deploy-pages@v4"),
    [
      "      - name: Deploy QA preview",
      "        id: deployment",
      "        uses: actions/deploy-pages@v4",
    ].join("\n"),
  );
  assert.doesNotMatch(workflow, /content\/source|app\/content|path:\s*\./);
}

test("QA Pages workflow verifies and uploads only dist/qa-preview", async () => {
  const workflow = await readQaPreviewWorkflow();
  assertWorkflowContract(workflow);
});

test("QA Pages workflow contract rejects broadened deployment authority", async () => {
  const workflow = await readQaPreviewWorkflow();
  const mutations = [
    {
      name: "pull_request trigger",
      workflow: workflow.replace(
        "  workflow_dispatch:",
        "  pull_request:\n  workflow_dispatch:",
      ),
    },
    {
      name: "additional permission",
      workflow: workflow.replace(
        "  id-token: write",
        "  id-token: write\n  issues: write",
      ),
    },
    {
      name: "job-level permissions",
      workflow: workflow.replace(
        "  build:\n    runs-on: ubuntu-latest",
        [
          "  build:",
          "    permissions:",
          "      issues: write",
          "    runs-on: ubuntu-latest",
        ].join("\n"),
      ),
    },
    {
      name: "second artifact upload",
      workflow: workflow.replace(
        "\n\n  deploy:",
        [
          "",
          "      - name: Upload forbidden artifact",
          "        uses: actions/upload-pages-artifact@v4",
          "        with:",
          "          path: app",
          "",
          "  deploy:",
        ].join("\n"),
      ),
    },
    {
      name: "missing deployment environment",
      workflow: workflow.replace(
        [
          "    environment:",
          "      name: github-pages",
          "      url: ${{ steps.deployment.outputs.page_url }}",
        ].join("\n"),
        "",
      ),
    },
  ];

  for (const mutation of mutations) {
    const mutatedWorkflow = mutation.workflow;
    assert.notEqual(mutatedWorkflow, workflow);
    assert.throws(
      () => assertWorkflowContract(mutatedWorkflow),
      { name: "AssertionError" },
      `${mutation.name} should be rejected`,
    );
  }
});
