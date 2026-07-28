import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("T-008A S-001 applies the approved shared frontend tone", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(styles, /--font-sans:\s*"Sawarabi Gothic",\s*"Hiragino Kaku Gothic ProN",\s*"Yu Gothic",\s*"Meiryo",\s*system-ui,\s*sans-serif/);
  assert.match(styles, /\.app-brand-name\s*\{[^}]*font-size:\s*0\.75rem/s);
  assert.match(styles, /\.app-brand-subtitle\s*\{[^}]*font-size:\s*0\.5rem/s);
  assert.match(styles, /\.app-header-action\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(styles, /\.screen-kicker\s*\{[^}]*font-size:\s*0\.75rem/s);
  assert.match(styles, /\.screen-title\s*\{[^}]*font-size:\s*clamp\(1\.375rem,\s*1\.25rem \+ 0\.6vw,\s*1\.5rem\)/s);
});
