# Independent Palette Variation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace cyclic three-color rotations with 153 independent palette compositions while keeping the share-card preview pale and readable.

**Architecture:** Add pure palette color metrics and a deterministic one-time migration. Audit all 51 title groups in tests, migrate only machine-critical primary colors, derive role-specific companion colors, and regenerate the standalone preview and review catalog.

**Tech Stack:** CSV authoring source, Node.js ES modules, `node:test`, OKLab color metrics, deterministic HTML/Markdown generators.

## Global Constraints

- Preserve palette IDs, labels, descriptions, row order, selectors, and `draft` status.
- Preserve B preview intensity at background 84% and surface 90%.
- Keep every resolved upper-right surface at relative luminance 0.90 or higher.
- Preserve `palette-usage-mappings.csv`, cats, fragrances, factor colors, and result content.
- Do not approve P-0〜P-6.

---

### Task 1: Add full-catalog variation auditing

**Files:**
- Create: `scripts/content/palette-variation.mjs`
- Create: `app/tests/palette-variation.test.js`

**Interfaces:**
- Produces: `hexToRgb(hex)`, `mixHex(first, second, secondWeight)`, `mixWithWhite(hex, percent)`, `relativeLuminance(hex)`, `oklabDistance(first, second)`, `auditTitlePaletteGroups(rows)`.
- Consumes: Authored `palettes.csv` rows in display order.

- [x] Write tests that require 51 non-cyclic groups, minimum B-background OKLab distance 1.0, unique color triples, and surface luminance 0.90.
- [x] Run `node --test app/tests/palette-variation.test.js` and confirm failure against the cyclic source.
- [x] Implement the pure color and audit functions.
- [x] Re-run the test and confirm it still fails only on current source data.

### Task 2: Migrate critical primaries and independent companions

**Files:**
- Create: `scripts/content/migrate-independent-palettes.mjs`
- Modify: `content/source/presentation/presentation-v2/palettes.csv`
- Modify: `app/tests/palette-label-alignment.test.js`

**Interfaces:**
- Consumes: Pure color helpers from Task 1 and fixed role anchors from the design.
- Produces: Updated 153-row CSV with corrected critical primary colors and independently derived secondary/accent colors.

- [x] Add a migration test proving deterministic output, preserved non-color fields, exact critical overrides, and no cyclic groups.
- [x] Run the migration test and confirm it fails before the migration module exists.
- [x] Implement the migration and apply it once to the authoring CSV.
- [x] Replace the old cyclic-triplet assertion with full-catalog variation assertions.
- [x] Run both palette test files and confirm success.

### Task 3: Synchronize requirements, preview, and review artifacts

**Files:**
- Modify: `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md`
- Modify: `docs/screens.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/content-authoring.md`
- Modify: `docs/tasks.md`
- Modify: `docs/palette-preview.html`
- Modify: `docs/presentation-content-catalog.md`
- Modify: affected preview/report fixtures under `app/tests/`

**Interfaces:**
- Consumes: Migrated authoring CSV.
- Produces: Updated B-preview HTML, review catalog, and canonical documentation.

- [x] Record the pale upper-right decoration and independent palette requirements without approving Q-013 gates.
- [x] Regenerate the presentation review and palette preview.
- [x] Update deterministic fixtures and hashes changed by the authored colors.
- [x] Run focused tests, `npm.cmd run content:validate`, `npm.cmd run check`, and `npm.cmd test`.
- [x] Regenerate once more, verify only authorized fields changed, and commit.
