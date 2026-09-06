# Palette Variation Adjustment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase visible variation among the three B-preview backgrounds for nine reviewed titles.

**Architecture:** Keep the CSV as the authoring authority. Replace one cyclic color token per reviewed title, regenerate both review artifacts, and lock the exact triplets plus a minimum B-preview RGB distance in tests.

**Tech Stack:** CSV authoring source, Node.js ES modules, `node:test`, deterministic HTML/Markdown generators.

## Global Constraints

- Preserve IDs, labels, descriptions, row order, selectors, usage mappings, and `draft` status.
- Preserve B preview intensity at background 84% and surface 90%.
- Change one cyclic source color token per reviewed title.
- Do not approve P-0〜P-6.

---

### Task 1: Lock and apply the reviewed color triplets

**Files:**
- Modify: `app/tests/palette-label-alignment.test.js`
- Modify: `content/source/presentation/presentation-v2/palettes.csv`

**Interfaces:**
- Consumes: 153 authored palette rows grouped in display-order triples.
- Produces: Nine exact cyclic color triplets with B-preview minimum RGB distance of at least 7.

- [x] Add a failing test for the nine expected triplets, cyclic placement, and B-preview distance.
- [x] Run `node --test app/tests/palette-label-alignment.test.js` and confirm the old color values fail.
- [x] Replace one source color token in each reviewed title and preserve cyclic placement.
- [x] Update the representative exact-color assertion and rerun the focused test to green.

### Task 2: Synchronize review artifacts and verification

**Files:**
- Modify: `app/tests/palette-preview-tool.test.js`
- Modify: `app/tests/presentation-review-report.test.js`
- Modify: `docs/palette-preview.html`
- Modify: `docs/presentation-content-catalog.md`
- Modify: `docs/content-authoring.md`
- Modify: `docs/tasks.md`

**Interfaces:**
- Consumes: Updated authored palette rows.
- Produces: Deterministic B-preview HTML, review Markdown, and current test fixtures.

- [x] Regenerate the palette preview and presentation review catalog.
- [x] Update the first-card preview fixture and reviewed projection hash.
- [x] Record the variation adjustment without changing approval state.
- [x] Run focused tests, `npm.cmd run content:validate`, `npm.cmd run check`, and `npm.cmd test`.
- [x] Regenerate once more, verify the diff, and commit.
