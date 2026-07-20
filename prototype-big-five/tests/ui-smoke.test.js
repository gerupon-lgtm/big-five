import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function readPrototypeFile(name) {
  return readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
}

test("app shell exposes the Japanese prototype notice and accessible screen host", () => {
  const html = readPrototypeFile("index.html");

  assert.match(html, /lang="ja"/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /体験用サンプル・正式な診断ではありません/);
  assert.match(html, /<main id="app"[^>]*aria-live="polite"/);
});

test("mobile visual system constrains the app at 360px without fixed wide content", () => {
  const css = readPrototypeFile("styles.css");

  assert.match(css, /\*\s*\{\s*box-sizing:\s*border-box;/);
  assert.match(css, /width:\s*min\(100%\s*-\s*32px,\s*480px\)/);
  assert.match(css, /\.radar[\s\S]*max-width:\s*100%/);
  assert.doesNotMatch(css, /min-width:\s*(?:3[6-9]\d|[4-9]\d\d|\d{4,})px/);
});

test("browser orchestration includes all Task 5 screens and local flow actions", () => {
  const script = readPrototypeFile("app.js");

  for (const renderer of [
    "renderStart",
    "renderQuestion",
    "renderResult",
    "renderHistory",
    "renderCompare",
  ]) {
    assert.match(script, new RegExp(`function ${renderer}\\(`));
  }
  for (const action of [
    "saveProgress",
    "saveResult",
    "deleteResult",
    "clearHistory",
    "compareResults",
  ]) {
    assert.match(script, new RegExp(`\\b${action}\\b`));
  }
  assert.match(script, /まったく当てはまらない/);
  assert.match(script, /とても当てはまる/);
  assert.match(script, /共有プレビューを開く/);
  assert.match(script, /\bshareResult\b/);
});
