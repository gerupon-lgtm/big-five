# Palette Preview B Intensity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the user-selected B intensity to the existing standalone palette comparison tool while preserving A as the canonical and production candidate.

**Architecture:** Keep `content/source/presentation/presentation-v2/palette-usage-mappings.csv` unchanged at its current A values (background white92%, surface white95%). Add an explicit preview-only intensity preset to `scripts/content/render-palette-preview.mjs`; the default generated `docs/palette-preview.html` uses B (background white84%, surface white90%), while the source definitions and formal runtime remain unchanged. The browser-side calculator receives the same preview mapping so editor changes and contrast labels remain deterministic.

**Tech Stack:** Node.js ES modules, Node `node:test`, deterministic standalone HTML generator, CSV source catalogs.

## Global Constraints

- B is a comparison-tool display choice, not an approval of the formal palette mappings or production share-card Canvas.
- Canonical source CSV, formal runtime modules, result radar, and Q-012/Q-013 approval metadata remain unchanged.
- B exact values are background `mixPercent: 84` and surface `mixPercent: 90`; accent/chart recipes remain sourced from the canonical mapping.
- Regeneration must remain deterministic and offline; the committed `docs/palette-preview.html` must equal renderer output.
- The existing 153-card count, 3:5 card shape, filters, editor, change list, reset, calculator, fixed factor colors, representative cat, and fragrance placeholders remain intact.

---

### Task 1: Add an explicit preview intensity preset

**Files:**
- Modify: `scripts/content/render-palette-preview.mjs`
- Test: `app/tests/palette-preview-tool.test.js`

**Interfaces:**
- `buildPreviewModel({ sourceDir, previewIntensity })` accepts `previewIntensity: "b"` for the generated comparison tool.
- `renderPreview({ sourceDir, outputPath, previewIntensity })` applies the same preset before embedding the model.
- The source mapping object remains available for editor metadata, while the resolved preview mapping contains B background/surface percentages.

- [x] **Step 1: Write the failing test**

  Add assertions that the first generated entry resolves to background `#EAECED` and surface `#F4F7F9`, that its mapping has background `mixPercent: 84` and surface `mixPercent: 90`, and that `content/source/presentation/presentation-v2/palette-usage-mappings.csv` is byte-identical before and after model generation.

- [x] **Step 2: Run the focused test to verify the new expectation fails**

  Run: `node --test app/tests/palette-preview-tool.test.js`

  Expected: the new B-intensity assertions fail against the current A output.

- [x] **Step 3: Implement the minimal preset**

  Add a frozen preview-only preset map in the renderer:

  ```js
  const PREVIEW_INTENSITIES = Object.freeze({
    b: Object.freeze({ backgroundMixPercent: 84, surfaceMixPercent: 90 }),
  });
  ```

  Clone each mapping before changing only the background and surface `mixPercent` fields. Preserve source CSV values, accent/chart roles, text candidates, and all version/status fields. Make the CLI default to `b`, and reject unknown intensity values with the existing stable preview error pattern.

- [x] **Step 4: Run focused tests to verify the preset passes**

  Run: `node --test app/tests/palette-preview-tool.test.js`

  Expected: all palette-preview tests pass, including B resolved colors and source-byte parity.

- [x] **Step 5: Commit the implementation**

  ```powershell
  git add scripts/content/render-palette-preview.mjs app/tests/palette-preview-tool.test.js
  git commit -m "feat: apply B intensity to palette preview"
  ```

### Task 2: Regenerate and document the B comparison tool

**Files:**
- Modify: `docs/palette-preview.html`
- Modify: `docs/content-authoring.md`
- Modify: `docs/tasks.md`
- Test: `app/tests/palette-preview-tool.test.js`

**Interfaces:**
- `npm.cmd run content:preview:palettes` regenerates the existing preview path with B intensity.
- The page header and generated metadata state that B is a preview-only display setting and that canonical/prod mapping remains separate.

- [x] **Step 1: Add the generated-output assertions**

  Assert that the committed HTML includes B resolved swatches (`#EAECED`, `#F4F7F9`), identifies the preview intensity as B, and still contains exactly 153 cards, 765 factor rows, 459 fragrance rows, one cat Data URL, and no external URLs.

- [x] **Step 2: Regenerate the standalone HTML**

  Run: `npm.cmd run content:preview:palettes`

  Expected: `docs/palette-preview.html` is rewritten deterministically with B intensity.

- [x] **Step 3: Synchronize authoring/task documentation**

  State explicitly that the preview tool currently uses B (background84/surface90) for visual comparison only, while the canonical mapping CSV remains A (background92/surface95) until a separate production decision. Keep Q-012/Q-013 and approval statuses unchanged.

- [x] **Step 4: Run the focused regression suite**

  Run: `node --test app/tests/palette-preview-tool.test.js app/tests/palette-usage.test.js app/tests/presentation-review-report.test.js`

  Expected: all focused tests pass and repeated generation is byte-identical.

- [x] **Step 5: Commit the generated output and docs**

  ```powershell
  git add docs/palette-preview.html docs/content-authoring.md docs/tasks.md app/tests/palette-preview-tool.test.js
  git commit -m "docs: record B intensity as palette preview setting"
  ```

### Task 3: Final verification

**Files:**
- Read-only verification of the files above and canonical source CSV.

- [x] **Step 1: Run the full suite**

  Run: `npm.cmd test`

  Expected: zero failures.

- [x] **Step 2: Run static/content checks**

  Run: `npm.cmd run check` and `npm.cmd run content:validate`

  Expected: static check passes and content validation reports zero errors; existing unapproved-content warnings remain warnings.

- [x] **Step 3: Verify deterministic output and clean diff**

  Run: `npm.cmd run content:preview:palettes` again, then `git diff --check` and `git status --short`.

  Expected: no diff after regeneration and no whitespace errors; only the intended commits are present.

## Superseding decision (2026-07-31)

The user subsequently approved B for formal P-0. This supersedes this plan's preview-only/A-canonical constraint for the current state: `palette-usage-mappings.csv` now canonically uses background white mix 84% and surface white mix 90%. Future intensity changes remain isolated to those two versioned mapping columns and require the P-0 verification/approval path again.
