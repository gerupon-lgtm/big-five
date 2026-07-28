import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("T-008A S-001 applies the approved shared frontend tone", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(styles, /--font-sans:\s*"Sawarabi Gothic",\s*"Hiragino Kaku Gothic ProN",\s*"Yu Gothic",\s*"Meiryo",\s*system-ui,\s*sans-serif/);
  assert.match(styles, /\.app-brand-name\s*\{[^}]*font-size:\s*0\.75rem/s);
  assert.match(styles, /\.app-brand-subtitle\s*\{[^}]*font-size:\s*0\.5rem/s);
  assert.match(styles, /\.app-brand-copy\s*\{[^}]*min-width:\s*0/s);
  assert.match(styles, /\.app-header-action\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(styles, /\.screen-kicker\s*\{[^}]*color:\s*#26705c[^}]*font-size:\s*0\.75rem/s);
  assert.match(styles, /\.screen-title\s*\{[^}]*font-size:\s*clamp\(1\.375rem,\s*1\.25rem \+ 0\.6vw,\s*1\.5rem\)/s);
});

test("T-008A S-001 keeps sticky and non-sticky headers aligned on narrow screens", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");
  const sharedHeader = styles.match(/\.app-header\s*\{([^}]*)\}/)?.[1] ?? "";
  const stickyHeader = styles.match(/\.app-header\.is-sticky\s*\{([^}]*)\}/)?.[1] ?? "";
  const narrowStyles = styles.slice(styles.indexOf("@media (max-width: 380px)"));

  assert.match(sharedHeader, /min-height:\s*52px/);
  assert.match(sharedHeader, /padding-block:\s*8px/);
  assert.match(sharedHeader, /flex-wrap:\s*nowrap/);
  assert.doesNotMatch(stickyHeader, /padding(?:-block)?:/);
  assert.doesNotMatch(stickyHeader, /border:/);
  assert.match(
    narrowStyles,
    /\.app-header\s*\{[^}]*flex-wrap:\s*nowrap/s,
  );
});
