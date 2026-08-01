# Share Text and Card Wreath Follow-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce the approved result-sharing text and configurable optional URL, and replace the card-template-v2 circle with a clean plant-only arch while preserving existing card content, image quality, download identity, and legacy card-template-v1 behavior.

**Architecture:** Extend the pure share-text and share-card model functions with the existing title subtitle/reason and one validated brand config value. Keep the share text independent from the Canvas layout so the preview20 card can retain its visual disclaimer while copied/shared text uses the approved single disclaimer. Draw the v2 wreath with existing Canvas botanical primitives and no circular stroke or backing plate; leave the legacy renderer path intact.

**Tech Stack:** JavaScript ES Modules, Canvas 2D, local transparent PNG assets, Web Share/Clipboard/Download, Node.js `node:test`.

**Task/feature traceability:** Implement as `T-008C` against `F-011`, `F-012`, `F-013`, and `F-018`. Do not change diagnostic results, palette selection rules, cat assignment, or presentation approval metadata.

## Global Constraints

- Preserve the exact approved share-text order, Japanese punctuation, factor order, blank lines, and disclaimer.
- Do not include raw answers, fragrance material names, title reflection, internal version identifiers, or the label `この称号になった理由` in share text.
- `shareUrl` is optional configuration: empty means no URL and no extra blank line; non-empty must be HTTPS.
- The URL affects share text only, not result-page presentation or the card image.
- Keep all runtime resources local and preserve `connect-src 'none'`.
- Use the existing transparent high-resolution cat and Aroma images without rasterizing SVG or introducing a white circular cover.
- The share preview and downloaded PNG must come from the same rendered Blob.
- Preserve 1080 × 1800 card output, title, cat, five factors, Kokoro Aroma cards, footer, and version layout.
- Keep card-template-v1's legacy circle; apply the plant-only arch only to card-template-v2.

---

### Task 1: Lock the exact approved share-text contract

**Files:**

- Modify: `app/js/domain/share-result-text.js`
- Modify: `app/tests/share-result-text.test.js`

**Interfaces:**

- `createShareResultText({ brandName, modeLabel, titleLabel, titleSubtitle, titleReason, factors, fragrances, disclaimer, shareUrl })` returns the exact approved text.
- `shareUrl` accepts `""` or an HTTPS URL string.
- Invalid or missing required content throws the existing `INVALID_SHARE_RESULT_TEXT` domain error.

- [ ] **Step 1: Replace the representative exact-string test with the approved format**

  Use this complete expected value:

  ```js
  const expected = `ココロパレア
50問 詳細結果
称号：寄り添う共鳴者
多様な考えを受け止めて共通点を探す協調派
今回の回答では、多様な考えや新しい可能性への関心を示す回答と相手の立場や感情に配慮する回答の両方が比較的多く見られました。異なる意見の間に共通点を見つけようとする組み合わせから「寄り添う共鳴者」という称号になりました。

知性・想像力：95
勤勉性：50
外向性：68
協調性：73
情緒安定性：28

ココロアロマ
ひと息つきたい：透明感のある花と柑橘の香調
気持ちを切り替えたい：透明感のある葉の香調
静かに取り組みたい：ほろ苦く端正な柑橘の香調

これは性格の優劣や心理学上の正式なタイプを示すものではありません。`;
  ```

  Add assertions that `20問 簡易プレビュー` is used for preview mode and that forbidden content is absent.

- [ ] **Step 2: Add URL validation and spacing tests**

  Cover:

  ```js
  assert.equal(createShareResultText({ ...input, shareUrl: "" }), expected);
  assert.equal(
    createShareResultText({ ...input, shareUrl: "https://example.test/kokoroparea" }),
    `${expected}\n\nhttps://example.test/kokoroparea`,
  );
  assert.throws(
    () => createShareResultText({ ...input, shareUrl: "http://example.test" }),
    { name: "TypeError", message: "INVALID_SHARE_RESULT_TEXT" },
  );
  ```

  Also reject whitespace-only strings, credentials, and non-HTTP schemes.

- [ ] **Step 3: Run the pure text test and confirm RED**

  Run:

  ```powershell
  node --test app/tests/share-result-text.test.js
  ```

  Expected: missing subtitle/reason, old title formatting, and missing URL contract fail.

- [ ] **Step 4: Implement line assembly and HTTPS validation**

  Validate required strings and build an array of semantic blocks:

  ```js
  const blocks = [
    [brandName, modeLabel, `称号：${titleLabel}`, titleSubtitle, titleReason],
    factors.map(({ label, displayScore }) => `${label}：${displayScore}`),
    ["ココロアロマ", ...fragrances.map(({ sceneLabel, accordLabel }) => `${sceneLabel}：${accordLabel}`)],
    [disclaimer],
  ];

  if (shareUrl !== "") {
    blocks.push([validateHttpsShareUrl(shareUrl)]);
  }

  return blocks.map((lines) => lines.join("\n")).join("\n\n");
  ```

  URL validation must parse with `new URL`, require `protocol === "https:"`, reject username/password, and return the original trimmed URL.

- [ ] **Step 5: Re-run the pure text test**

  Require exact equality including all blank lines.

---

### Task 2: Add optional `shareUrl` to the brand contract and share model

**Files:**

- Modify: `app/js/config/app-meta.js`
- Modify: `app/js/domain/share-card-model.js`
- Modify: `app/tests/share-card-model.test.js`
- Modify: `app/tests/version-contract.test.js`

**Interfaces:**

- `APP_META.brand.shareUrl` exists and defaults to `""`.
- The exact `BRAND_FIELDS` contract includes `shareUrl`.
- The share model resolves exactly one `titleSubtitle` and one `titleReason` for the selected title.
- The share-text builder receives the standard single disclaimer and optional URL.
- The Canvas model may retain the existing preview-specific disclaimer.

- [ ] **Step 1: Add failing config/model contract tests**

  Assert:

  ```js
  assert.equal(APP_META.brand.shareUrl, "");
  assert.deepEqual(Object.keys(APP_META.brand).sort(), [
    "cardIconPath",
    "cardSubtitle",
    "iconPath",
    "name",
    "publicOrigin",
    "shareUrl",
    "subtitle",
    "version",
  ]);
  ```

  Build a model fixture with title subtitle/reason and assert the exact `shareText`. Add missing/duplicate title subtitle and missing/duplicate title reason failure cases.

- [ ] **Step 2: Add disclaimer-decoupling tests**

  For preview20, assert:

  - `model.disclaimer` still contains the existing preview visual qualification used by Canvas;
  - `model.shareText` ends with only `これは性格の優劣や心理学上の正式なタイプを示すものではありません。` before an optional URL.

- [ ] **Step 3: Run model and version tests and confirm RED**

  Run:

  ```powershell
  node --test app/tests/share-card-model.test.js app/tests/version-contract.test.js
  ```

- [ ] **Step 4: Extend the config and exact brand-field validation**

  Add:

  ```js
  brand: Object.freeze({
    // existing values
    shareUrl: "",
  }),
  ```

  Include `shareUrl` in `BRAND_FIELDS`. Validate it through the share-text domain function rather than using `publicOrigin` as an implicit share URL.

- [ ] **Step 5: Resolve title subtitle/reason and build decoupled text**

  Reuse the current exact-one selection helper for both fields. Pass the base disclaimer constant, not the preview-card disclaimer, to `createShareResultText`. Do not add `titleReflection`, material labels, or version values to the text payload.

- [ ] **Step 6: Re-run model, text, and version tests**

  ```powershell
  node --test app/tests/share-result-text.test.js app/tests/share-card-model.test.js app/tests/version-contract.test.js
  ```

---

### Task 3: Replace the v2 circular wreath with a large plant-only open arch

**Files:**

- Modify: `app/js/presentation/share-card-renderer.js`
- Modify: `app/tests/share-card-renderer.test.js`

**Interfaces:**

- card-template-v2 draws no 270-radius circular stroke and no circular backdrop.
- Six mirrored botanical sprigs create an airy arch, open at top center and bottom center.
- The arch is slightly larger than the cat area and does not cross the face/body focus region.
- card-template-v1 retains its legacy circular treatment.

- [ ] **Step 1: Rewrite the renderer-spy test for the approved geometry**

  Replace the current v2 assertion that expects `arc(540, 650, 270, ...)` with assertions that:

  ```js
  assert.equal(
    calls.some(({ name, args }) => name === "arc" && args[0] === 540 && args[1] === 650 && args[2] === 270),
    false,
  );
  assert.ok(calls.filter(({ name }) => name === "fill").length >= 36);
  ```

  Keep a separate legacy test proving card-template-v1 still executes its circle path. Add bounds assertions that botanical drawing stays outside a protected center rectangle around the cat's face/body.

- [ ] **Step 2: Run the renderer test and confirm RED**

  Run:

  ```powershell
  node --test app/tests/share-card-renderer.test.js
  ```

  Expected: the existing v2 circle is detected and the old four-sprig layout does not meet arch density/position expectations.

- [ ] **Step 3: Branch the wreath renderer by template version**

  Keep the existing legacy path. For v2, do not call the circular `arc` at all and invoke the existing `drawBotanicalSprig` with these balanced anchors:

  ```js
  const archSprigs = [
    { x: 350, y: 850, length: 225, angle: -2.08, side: "left" },
    { x: 285, y: 680, length: 205, angle: -1.53, side: "left" },
    { x: 315, y: 505, length: 170, angle: -1.22, side: "left" },
    { x: 730, y: 850, length: 225, angle: -1.06, side: "right" },
    { x: 795, y: 680, length: 205, angle: -1.61, side: "right" },
    { x: 765, y: 505, length: 170, angle: -1.92, side: "right" },
  ];
  ```

  Use the current muted botanical color sets with moderate alpha. Do not add a white or neutral circular plate behind the cat.

- [ ] **Step 4: Preserve character compositing and card layout**

  Confirm v2's `drawCharacterBackdrop` remains a no-op for circular fill and that the cat is drawn after the plant arch. Do not alter cat asset dimensions, title position, factor bars, Aroma cards, footer label, or version placement in this task.

- [ ] **Step 5: Re-run the renderer test**

  Require both v1 legacy and v2 plant-only assertions to pass.

---

### Task 4: Verify preview/download identity and sharing fallbacks

**Files:**

- Verify/modify if required: `app/js/main.js`
- Verify/modify if required: `app/js/presentation/share-screen.js`
- Verify/modify if required: `app/js/infrastructure/share-delivery.js`
- Modify only if coverage is missing: `app/tests/app-shell.test.js`
- Modify only if coverage is missing: `app/tests/share-screen.test.js`
- Modify only if coverage is missing: `app/tests/share-delivery.test.js`

**Interfaces:**

- Preview image, Web Share attachment, and downloaded PNG reuse the same rendered Blob.
- Existing `拡大して見る` preview action remains.
- Canvas/Web Share failure still reaches text copy or selectable text.

- [ ] **Step 1: Audit existing identity and fallback tests**

  Run:

  ```powershell
  rg -n "Blob|download|navigator.share|clipboard|拡大して見る|selectable|renderShareCardProvider" app/tests/app-shell.test.js app/tests/share-screen.test.js app/tests/share-delivery.test.js
  ```

- [ ] **Step 2: Add only missing regression assertions**

  If absent, spy on the Blob object and assert the same object is passed to preview URL creation and download/share conversion. Retain tests for image-render failure falling back to text.

- [ ] **Step 3: Run share-flow tests**

  ```powershell
  node --test app/tests/app-shell.test.js app/tests/share-screen.test.js app/tests/share-delivery.test.js
  ```

  Make no production change if existing behavior already satisfies the assertions.

---

### Task 5: Update canonical sharing and asset documentation

**Files:**

- Modify: `docs/tasks.md`
- Modify: `docs/screens.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/data-model.md`
- Modify: `docs/基本設計サマリ.md`
- Modify: `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md`
- Modify: `docs/assets/share-card-production/README.md`
- Modify only if its current contract conflicts: existing share-card brand/template specification under `docs/`

**Interfaces:**

- Documents show exact share-text fields/order, optional HTTPS `shareUrl`, empty-value omission, and plant-only v2 arch.
- `publicOrigin` remains deployment metadata and is not silently used as `shareUrl`.
- Asset documentation states transparent source requirements and no circular white cover.
- `docs/tasks.md` records `T-008C` verification without changing Q-006/Q-012/Q-013 approval status.

- [ ] **Step 1: Locate superseded share contracts**

  Run:

  ```powershell
  rg -n "shareUrl|publicOrigin|この称号になった理由|共有テキスト|円|リース|card-template-v2|1080.*1800" docs
  ```

- [ ] **Step 2: Update all canonical descriptions consistently**

  Include the exact text order without copying raw answers or internal versions into shared content. Record that the title reason has no heading label. Record the URL as config-driven and omitted when empty.

- [ ] **Step 3: Record renderer and asset rules**

  Specify that v2 uses transparent raster assets at source quality and Canvas botanical primitives for the open arch, with no circular stroke/backdrop. Explicitly preserve legacy v1 behavior.

- [ ] **Step 4: Run static documentation checks**

  ```powershell
  npm.cmd run check
  ```

---

### Task 6: Complete share regression and visual verification

**Files:**

- Modify only if failures expose a scoped defect: share files and tests listed above
- Verify: generated QA preview and representative cards

- [ ] **Step 1: Run focused share tests**

  ```powershell
  node --test app/tests/share-result-text.test.js app/tests/share-card-model.test.js app/tests/share-card-renderer.test.js app/tests/share-screen.test.js app/tests/share-delivery.test.js app/tests/version-contract.test.js
  ```

- [ ] **Step 2: Run the complete suite and build QA preview**

  ```powershell
  npm.cmd test
  npm.cmd run check
  npm.cmd run qa:preview:build
  ```

- [ ] **Step 3: Perform representative card inspection**

  Render at least three cards using different cats, title lengths, score patterns, palettes, and Aroma selections. At 1080 × 1800 confirm:

  - no circular line or white circle remains around the cat in v2;
  - the six sprigs read as one airy open arch with the approved scale;
  - the arch does not obscure the cat's eyes, face, chest, body, or tail;
  - title, subtitle, factor labels/scores, Aroma text/images, footer disclaimer, result-mode pill, and `mvp-1.0.0` do not overlap;
  - transparent assets have no visible rectangular matte;
  - preview zoom and downloaded PNG match.

- [ ] **Step 4: Verify optional URL variants**

  With `shareUrl: ""`, confirm the disclaimer is the final line and no extra blank line exists. With a temporary test-only HTTPS value, confirm exactly one blank line and the URL are appended to copied/shared text while the result screen and card image remain unchanged. Restore config to `""` before committing.

- [ ] **Step 5: Inspect the final diff**

  Run `git diff --check` and `git diff --stat`. Confirm no change under `prototype-big-five/`, `app/content/`, `_verify/`, or `tools/skills/` is included.
