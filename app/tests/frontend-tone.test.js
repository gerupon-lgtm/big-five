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
  assert.match(styles, /\.screen-title\s*\{[^}]*font-size:\s*1\.5rem/s);
});

test("T-008C S-001 gives the start screen the approved card, sprout, and disabled-history treatment", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(styles, /\.start-main-panel\s*\{[^}]*border-radius:\s*28px/s);
  assert.match(styles, /\.start-introduction summary\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*56px minmax\(0,\s*1fr\) 20px/s);
  assert.match(styles, /\.start-introduction-icon\s*\{[^}]*width:\s*56px[^}]*height:\s*56px[^}]*border-radius:\s*50%/s);
  assert.match(styles, /\.start-introduction-phrase\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(styles, /\.start-history-link\s*\{[^}]*width:\s*100%[^}]*min-height:\s*44px[^}]*justify-content:\s*center/s);
  assert.match(styles, /\.start-history-link:disabled\s*\{[^}]*background:\s*#edf1ef[^}]*color:\s*#899691/s);
  assert.match(styles, /\.start-main-panel \.start-secondary-navigation\s*\{[^}]*margin-top:\s*17px[^}]*padding-top:\s*0[^}]*border-top:\s*0/s);
  assert.match(styles, /\.start-footer\s*\{[^}]*border-top:\s*1px solid #d6e4df[^}]*color:\s*#899691[^}]*font-size:\s*0\.72rem[^}]*text-align:\s*center/s);
});

test("T-008C S-006 aligns history management controls and compacts diagnostic metadata", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(styles, /\.history-management-toggle\s*\{[^}]*border:\s*1px solid #26705c[^}]*border-radius:\s*12px[^}]*background:\s*#fff[^}]*color:\s*#1f6955/s);
  assert.match(styles, /\.history-management-heading\s*\{[^}]*display:\s*flex[^}]*align-items:\s*center[^}]*justify-content:\s*space-between/s);
  assert.match(styles, /\.history-management-close\s*\{[^}]*min-height:\s*44px[^}]*padding:\s*10px 16px[^}]*border:\s*1px solid #26705c[^}]*border-radius:\s*12px[^}]*background:\s*#fff[^}]*color:\s*#1f6955/s);
  assert.match(styles, /\.history-management-title\s*\{[^}]*font-size:\s*1\.2rem/s);
  assert.match(styles, /\.history-management-list \.history-delete-button,[^}]*\.history-management-list > \.danger-button\s*\{[^}]*background:\s*#fff8f7[^}]*font-size:\s*0\.82rem/s);
  assert.match(styles, /\.history-information summary\s*\{[^}]*min-height:\s*44px[^}]*font-size:\s*0\.8rem/s);
  assert.match(styles, /\.history-information dl\s*\{[^}]*font-size:\s*0\.7rem[^}]*line-height:\s*1\.55/s);
});

test("T-008C S-003/S-005 softens result typography and keeps the share back control at a standard gap", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(styles, /\.result-screen-title\s*\{[^}]*color:\s*#29433d[^}]*font-size:\s*1\.5rem[^}]*font-weight:\s*650/s);
  assert.match(styles, /\.result-completed-at\s*\{[^}]*margin-top:\s*4px[^}]*font-size:\s*0\.72rem/s);
  assert.match(styles, /\.result-title-label\s*\{[^}]*color:\s*#668078[^}]*font-size:\s*0\.78rem/s);
  assert.match(styles, /\.result-hero-title\s*\{[^}]*color:\s*#29433d[^}]*font-weight:\s*650/s);
  assert.match(styles, /\.title-disclaimer\s*\{[^}]*font-size:\s*0\.75rem/s);
  assert.match(styles, /\.character-availability-note\s*\{[^}]*margin-top:\s*16px/s);
  assert.match(styles, /\.character-availability-note \+ \.title-disclaimer\s*\{[^}]*margin-top:\s*4px/s);
  assert.match(styles, /\.title-reflection-trigger\s*\{[^}]*font-size:\s*0\.8rem/s);
  assert.match(styles, /\.boundary-notices li\s*\{[^}]*font-size:\s*0\.84rem/s);
  assert.match(styles, /\.share-back-button\s*\{[^}]*margin-top:\s*10px/s);
});

test("T-008C S-006 keeps comparison selection controls in two mobile-safe rows", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(styles, /\.history-comparison-bar--selecting\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*1fr/s);
  assert.match(styles, /\.history-comparison-count\s*\{[^}]*text-align:\s*center/s);
  assert.match(styles, /\.history-comparison-actions\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*minmax\(88px,\s*auto\) minmax\(0,\s*1fr\)/s);
  assert.match(styles, /\.history-comparison-actions > button\s*\{[^}]*font-size:\s*0\.875rem[^}]*white-space:\s*nowrap/s);
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

test("T-008B S-007 centers the two-line integer delta in a fixed right column", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");
  const comparisonNarrowStyles = styles.slice(
    styles.indexOf("@media (max-width: 410px)"),
    styles.indexOf("@media (max-width: 380px)"),
  );

  assert.match(
    styles,
    /\.comparison-factor-list li\s*\{[^}]*grid-template-columns:\s*minmax\(10rem,\s*1fr\) auto 94px/s,
  );
  assert.match(
    styles,
    /\.display-delta\s*\{[^}]*width:\s*94px[^}]*min-width:\s*94px[^}]*justify-items:\s*center[^}]*text-align:\s*center/s,
  );
  assert.match(
    comparisonNarrowStyles,
    /\.comparison-factor-list li\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\) 94px/s,
  );
  assert.match(
    comparisonNarrowStyles,
    /\.comparison-factor-list li h2\s*\{[^}]*grid-column:\s*1 \/ -1/s,
  );
  assert.match(comparisonNarrowStyles, /\.raw-mean-transition\s*\{[^}]*grid-column:\s*1/s);
  assert.match(comparisonNarrowStyles, /\.display-delta\s*\{[^}]*grid-column:\s*2/s);
});

test("T-005/T-007 gives the title-card CTA the approved invitation treatment without making it sticky", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");
  const shareCard = styles.match(/\.result-share-call-to-action\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(shareCard, /margin-top:\s*28px/);
  assert.match(shareCard, /border:\s*2px solid #8fb9aa/);
  assert.match(shareCard, /background:\s*linear-gradient\(/);
  assert.doesNotMatch(shareCard, /position:\s*(?:sticky|fixed)/);
  assert.match(
    styles,
    /\.result-share-call-to-action__icon\s*\{[^}]*width:\s*44px[^}]*height:\s*44px[^}]*border-radius:\s*12px/s,
  );
  assert.match(
    styles,
    /\.boundary-notices\s*\{[^}]*margin-top:\s*28px[^}]*border:\s*1px solid #bed4cc[^}]*background:\s*rgb\(255 255 255 \/ 88%\)/s,
  );
  assert.match(
    styles,
    /\.result-fragrance-section\s*\{[^}]*border:\s*2px solid #8fb9aa/s,
  );
});

test("T-008B F-018 lays out three equal Palette choices without a narrow-screen override", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");
  const narrowStyles = styles.slice(styles.indexOf("@media (max-width: 380px)"));

  assert.match(
    styles,
    /\.result-palette-options\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s,
  );
  assert.match(
    styles,
    /\.palette-choice\[aria-pressed="true"\]\s+\.palette-choice__swatch\s*\{[^}]*box-shadow:\s*0 0 0 3px var\(--surface\),\s*0 0 0 6px var\(--accent-strong\)/s,
  );
  assert.match(
    styles,
    /\.palette-choice__swatch-frame\s*\{[^}]*position:\s*relative/s,
  );
  assert.match(
    styles,
    /\.palette-choice__check\s*\{[^}]*position:\s*absolute[^}]*inset:\s*50% auto auto 50%[^}]*transform:\s*translate\(-50%,\s*-50%\)[^}]*border:\s*2px solid #fff[^}]*background:\s*#26705c[^}]*color:\s*#fff/s,
  );
  assert.doesNotMatch(narrowStyles, /\.result-palette-options/);
  assert.match(
    styles,
    /\.result-presentation-description\s*\{[^}]*margin:\s*9px 0 0[^}]*font-size:\s*0\.75rem[^}]*line-height:\s*1\.45[^}]*text-align:\s*right/s,
  );
});

test("T-005 F-018 keeps Aroma teasers contained and candidate copy safe at 320px", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(
    styles,
    /\.result-fragrance-teasers\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)[^}]*min-width:\s*0/s,
  );
  assert.match(
    styles,
    /\.result-fragrance-teaser-image\s*\{[^}]*display:\s*block[^}]*width:\s*50%[^}]*max-width:\s*46px[^}]*height:\s*auto[^}]*object-fit:\s*contain/s,
  );
  const teaserImage = styles.match(/\.result-fragrance-teaser-image\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.doesNotMatch(teaserImage, /max-height:/);
  assert.match(
    styles,
    /\.result-fragrance-scene\s*\{[^}]*min-width:\s*0/s,
  );
  assert.match(
    styles,
    /\.result-fragrance-candidate\s*\{[^}]*min-width:\s*0/s,
  );
  assert.match(
    styles,
    /\.result-fragrance-description\s*\{[^}]*overflow-wrap:\s*anywhere/s,
  );
  assert.doesNotMatch(styles, /\.result-fragrance-scene\s*>\s*summary/);
  assert.doesNotMatch(styles, /\.result-fragrance-scene\[open\]/);
});

test("T-008B F-018 makes Aroma inviting and uses the shared chevron language", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(
    styles,
    /\.result-presentation-summary\s*\{[^}]*width:\s*calc\(100% \+ 32px\)[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\) 40px[^}]*margin:\s*-16px -16px 0[^}]*padding:\s*15px 0 13px 16px[^}]*border:\s*0[^}]*background:\s*linear-gradient\(/s,
  );
  assert.match(
    styles,
    /\.result-presentation-summary\[aria-expanded="false"\]\s*\{[^}]*margin-bottom:\s*-16px/s,
  );
  assert.match(
    styles,
    /\.result-presentation-summary::after\s*\{[^}]*content:\s*"›"[^}]*transition:\s*transform 160ms ease/s,
  );
  assert.match(
    styles,
    /\.result-presentation-summary\[aria-expanded="true"\]::after\s*\{[^}]*transform:\s*rotate\(90deg\)/s,
  );
  assert.doesNotMatch(styles, /\.result-presentation-summary::after\s*\{[^}]*content:\s*"[＋−]"/s);
  assert.doesNotMatch(styles, /details\[open\]\s*>\s*\.result-presentation-summary::after/);
});

test("T-008C F-005/F-018 keeps expanded factor and Aroma headings off their borders", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(
    styles,
    /\.factor-category-label\s*\{[^}]*margin:\s*0[^}]*padding:\s*10px 12px 8px/s,
  );
  assert.match(
    styles,
    /\.result-fragrance-scene\s*\{[^}]*margin-top:\s*14px/s,
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

test("T-007 S-005 keeps the initial share card inside the viewport", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(
    styles,
    /\.share-screen\s*\{[^}]*block-size:\s*100vh[^}]*block-size:\s*100dvh[^}]*overflow:\s*hidden/s,
  );
  assert.match(
    styles,
    /\.share-card-pane\s*\{[^}]*display:\s*flex[^}]*min-block-size:\s*0[^}]*overflow:\s*hidden/s,
  );
  assert.match(
    styles,
    /\.share-card-preview\s*\{[^}]*max-inline-size:\s*100%[^}]*max-block-size:\s*100%[^}]*aspect-ratio:\s*3\s*\/\s*5[^}]*object-fit:\s*contain/s,
  );
  assert.match(
    styles,
    /\.share-delivery-actions\s*>\s*button[^}]*\{[^}]*min-height:\s*44px/s,
  );
  assert.match(
    styles,
    /\.share-card-pane--card\s+\.share-card-preview\s*\{[^}]*min-block-size:\s*0[^}]*max-block-size:\s*calc\(100%\s*-\s*54px\)/s,
  );
  assert.match(
    styles,
    /@media\s*\(max-width:\s*420px\)\s*and\s*\(max-height:\s*600px\)[\s\S]*\.share-delivery-actions\s*\{[^}]*flex-wrap:\s*nowrap/s,
  );
  assert.match(
    styles,
    /@media\s*\(max-width:\s*420px\)\s*and\s*\(max-height:\s*600px\)[\s\S]*\.share-delivery-actions\s*>\s*button\s*\{[^}]*min-inline-size:\s*0[^}]*flex:\s*1/s,
  );
  assert.match(
    styles,
    /@media\s*\(min-width:\s*960px\)[\s\S]*\.share-screen--details\s+\.share-card-pane\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*3fr\)\s+minmax\(320px,\s*2fr\)/s,
  );
});
