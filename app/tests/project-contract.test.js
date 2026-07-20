import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateProject } from "../../scripts/check-static.mjs";

const projectRoot = fileURLToPath(new URL("../..", import.meta.url));

test("formal app satisfies the static project contract", async () => {
  const result = await validateProject(projectRoot);

  assert.equal(result.runtimeVersionOccurrences, 1);
  assert.ok(result.checkedJavaScriptFiles >= 5);
  assert.equal(result.prototypeImports, 0);
});
