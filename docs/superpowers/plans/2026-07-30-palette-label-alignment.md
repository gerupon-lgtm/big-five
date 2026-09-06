# Palette Label Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align user-facing palette names with the existing B-preview background colors without changing palette HEX values, selection relations, or approval state.

**Architecture:** Treat `palettes.csv` as the human-authoring authority. Apply reviewed label-only corrections, regenerate the review catalog and standalone palette preview, and lock the corrected representative mappings and per-title uniqueness in tests.

**Tech Stack:** CSV authoring source, Node.js ES modules, `node:test`, deterministic HTML/Markdown generators.

## Global Constraints

- Preserve all palette IDs, row order, primary/secondary/accent HEX values, descriptions, and `draft` statuses.
- Preserve B preview intensity at background 84% and surface 90%.
- Preserve `palette-usage-mappings.csv`, selectors, result scores, titles, cats, and fragrances.
- Do not mark P-0〜P-6 approved.

---

### Task 1: Align reviewed labels

**Files:**
- Modify: `content/source/presentation/presentation-v2/palettes.csv`
- Test: `app/tests/palette-label-alignment.test.js`

- [x] Apply the reviewed label replacements from the design and user feedback.
- [x] Clear only mismatch notes resolved by those replacements.
- [x] Add tests for representative label/HEX pairs, unchanged structure, and unique labels/primary colors within every title.

### Task 2: Synchronize generated review artifacts

**Files:**
- Modify: `docs/presentation-content-catalog.md`
- Modify: `docs/palette-preview.html`
- Modify: `docs/content-authoring.md`
- Modify: `docs/tasks.md`
- Modify: `app/tests/presentation-review-report.test.js`

- [x] Update review-report expectations from unresolved mismatch notes to the aligned source rows.
- [x] Regenerate the presentation catalog and B palette preview.
- [x] Record that this is a label-alignment review change and not P-0 approval.

### Task 3: Verify and commit

- [x] Run focused label, review-report, preview, and content-schema tests.
- [x] Run `npm.cmd run content:validate`, `npm.cmd run check`, and `npm.cmd test`.
- [x] Regenerate artifacts once more, verify a clean deterministic diff, and commit.
