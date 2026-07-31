import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("T-008A S-001 applies the approved shared frontend tone", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(styles, /--font-sans:\s*"Sawarabi Gothic",\s*"Hiragino Kaku Gothic ProN",\s*"Yu Gothic",\s*"Meiryo",\s*system-ui,\s*sans-serif/);
  assert.match(styles, /\.app-header\s*\{[^}]*gap:\s*12px[^}]*margin-bottom:\s*26px[^}]*padding-bottom:\s*18px[^}]*border-bottom:\s*1px solid #d6e4df/s);
  assert.match(styles, /\.app-mark\s*\{[^}]*display:\s*block[^}]*flex:\s*0 0 auto[^}]*width:\s*38px[^}]*height:\s*38px[^}]*object-fit:\s*contain/s);
  assert.match(styles, /\.app-brand-name\s*\{[^}]*font-size:\s*1\.02rem[^}]*font-weight:\s*700[^}]*letter-spacing:\s*0\.04em/s);
  assert.match(styles, /\.app-brand-subtitle\s*\{[^}]*font-size:\s*0\.68rem[^}]*letter-spacing:\s*0\.18em/s);
  assert.match(styles, /\.app-brand-copy\s*\{[^}]*min-width:\s*0/s);
  assert.match(styles, /\.app-header-action\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(styles, /\.screen-kicker\s*\{[^}]*color:\s*#26705c[^}]*font-size:\s*0\.75rem/s);
  assert.match(styles, /\.screen-title\s*\{[^}]*font-size:\s*clamp\(1\.375rem,\s*1\.25rem \+ 0\.6vw,\s*1\.5rem\)/s);
});

test("T-008A S-001 aligns start and resume actions with an equal-width responsive grid", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(
    styles,
    /\.start-actions\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(150px,\s*1fr\)\)[^}]*gap:\s*12px/s,
  );
  assert.match(
    styles,
    /\.start-actions\s*>\s*button\s*\{[^}]*width:\s*100%[^}]*margin:\s*0/s,
  );
});

test("T-005/T-006 result-history navigation uses the same button treatment as other actions", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(
    styles,
    /\.result-actions\s*>\s*a\.secondary-button\s*\{[^}]*display:\s*inline-flex[^}]*min-height:\s*44px[^}]*padding:\s*10px 16px[^}]*border:\s*1px solid #26705c[^}]*border-radius:\s*12px[^}]*background:\s*#fff[^}]*text-decoration:\s*none/s,
  );
});

test("T-008A keeps sticky header behavior without redefining brand geometry", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");
  const stickyHeader = styles.match(/\.app-header\.is-sticky\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(stickyHeader, /position:\s*sticky/);
  assert.match(stickyHeader, /top:\s*0/);
  assert.doesNotMatch(stickyHeader, /font-size:/);
  assert.doesNotMatch(styles, /\.app-header\.is-sticky\s+\.app-mark\s*\{/);
  assert.doesNotMatch(styles, /\.app-header\.is-sticky\s+\.app-brand-name\s*\{/);
  assert.doesNotMatch(styles, /\.app-header\.is-sticky\s+\.app-brand-subtitle\s*\{/);
});

test("T-008A preserves the approved 380px header contract", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");
  const narrowStyles = styles.slice(
    styles.indexOf("@media (max-width: 380px)"),
    styles.indexOf("@media (max-width: 340px)"),
  );

  assert.match(narrowStyles, /\.app-header\s*\{[^}]*gap:\s*6px[^}]*flex-wrap:\s*nowrap/s);
  assert.match(narrowStyles, /\.app-brand\s*\{[^}]*gap:\s*8px/s);
  assert.match(narrowStyles, /\.app-mark\s*\{[^}]*flex-basis:\s*34px[^}]*width:\s*34px[^}]*height:\s*34px/s);
  assert.match(narrowStyles, /\.app-brand-name\s*\{[^}]*font-size:\s*0\.84rem/s);
  assert.match(narrowStyles, /\.app-brand-subtitle\s*\{[^}]*font-size:\s*0\.55rem[^}]*letter-spacing:\s*0\.1em/s);
  assert.match(narrowStyles, /\.app-header-action\s*\{[^}]*padding-inline:\s*0[^}]*font-size:\s*0\.72rem[^}]*white-space:\s*nowrap/s);
});

test("T-008A uses the approved one-row 320px header fallback", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");
  const compactStyles = styles.slice(styles.indexOf("@media (max-width: 340px)"));

  assert.match(compactStyles, /\.app-header\s*\{[^}]*gap:\s*4px[^}]*flex-wrap:\s*nowrap/s);
  assert.match(compactStyles, /\.app-header\.is-sticky\s*\{[^}]*padding-inline:\s*0/s);
  assert.match(compactStyles, /\.app-brand\s*\{[^}]*gap:\s*6px/s);
  assert.match(compactStyles, /\.app-mark\s*\{[^}]*flex-basis:\s*32px[^}]*width:\s*32px[^}]*height:\s*32px/s);
  assert.match(compactStyles, /\.app-brand-name\s*\{[^}]*font-size:\s*0\.8rem/s);
  assert.match(compactStyles, /\.app-brand-subtitle\s*\{[^}]*font-size:\s*0\.52rem[^}]*letter-spacing:\s*0\.08em/s);
  assert.match(compactStyles, /\.app-header-action\s*\{[^}]*font-size:\s*0\.7rem[^}]*white-space:\s*nowrap/s);
});
