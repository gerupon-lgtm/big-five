import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const stylesUrl = new URL("../css/styles.css", import.meta.url);

function declarationsFor(styles, selector) {
  for (const match of styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = match[1]
      .split(",")
      .map((candidate) => candidate.trim());
    if (selectors.includes(selector)) {
      return match[2];
    }
  }
  assert.fail(`missing CSS selector: ${selector}`);
}

test("T-008A F-003 keeps the approved questionnaire typography scoped to S-002", async () => {
  const styles = await readFile(stylesUrl, "utf8");
  const question = declarationsFor(styles, ".questionnaire-question");
  const progress = declarationsFor(styles, ".questionnaire-progress");
  const options = declarationsFor(styles, ".answer-options");
  const option = declarationsFor(styles, ".answer-option");
  const previewActions = declarationsFor(styles, ".preview-decision-actions");
  const previewHeading = declarationsFor(styles, ".questionnaire-screen > h1");

  assert.match(
    question,
    /font-size:\s*clamp\(1\.25rem,\s*1\.05rem \+ 0\.8vw,\s*1\.375rem\)/,
  );
  assert.match(question, /line-height:\s*1\.5/);
  assert.match(question, /font-weight:\s*700/);
  assert.match(question, /text-wrap:\s*balance/);

  assert.match(
    progress,
    /font-size:\s*clamp\(0\.875rem,\s*0\.8rem \+ 0\.4vw,\s*1rem\)/,
  );
  assert.match(progress, /line-height:\s*1\.5/);

  assert.match(options, /gap:\s*12px/);
  assert.match(options, /margin-top:\s*24px/);
  assert.match(option, /font-size:\s*1rem/);
  assert.match(option, /line-height:\s*1\.5/);
  assert.match(option, /min-height:\s*56px/);
  assert.match(option, /padding:\s*14px 16px/);

  assert.match(previewActions, /margin-top:\s*32px/);
  assert.match(
    previewHeading,
    /font-size:\s*clamp\(1\.8rem,\s*7vw,\s*3rem\)/,
  );
  assert.notEqual(question, previewHeading);
});
