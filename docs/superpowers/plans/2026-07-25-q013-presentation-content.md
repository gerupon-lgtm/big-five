# Q-013 Presentation Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved Q-013 palette, fragrance, selector, WCAG, and share-summary contracts for all 51 title profiles without changing diagnostic results.

**Architecture:** Keep authored base palettes and fragrance copy in versioned read-only data modules. Validate the complete definition graph at one pure domain seam, resolve palette usage colors and title presentation through pure functions, and attach the resulting presentation model to the existing result model without introducing browser or scoring dependencies.

**Tech Stack:** HTML/CSS/JavaScript ES Modules, Node.js `node:test`, static browser delivery, existing `appMeta.presentationDefinitionVersion`.

## Global Constraints

- Each of the 51 title profiles has exactly three palettes: one `TitleProfileDefinition.defaultPaletteId` plus two alternatives.
- Every palette has exactly three base colors: `primary`, `secondary`, and `accent`, each an uppercase six-digit HEX value.
- Scene order and labels are fixed: `pause = ひと息つきたい`, `reset = 気持ちを切り替えたい`, `quiet-focus = 静かに取り組みたい`.
- Each scene has exactly two fragrance suggestions; the result shows all six and sharing uses one declared representative per scene, exactly three total.
- The app asks no additional color, fragrance, health, animal, or preference questions. Do not add a safety mode or unscented branch.
- Palette selection changes only `selectedPaletteId` and card presentation. It never changes scores, title, text, character, or fragrance candidates.
- A palette may not be excluded or replaced because it resembles the character color, and the character may not be recolored.
- Definitions and copy must not contain products, brands, purchase URLs, plant or essential-oil recommendations, quantities, drops, concentrations, recipes, ingestion, skin application, diffuser instructions, treatment claims, improvement claims, or ability/performance claims.
- All production definitions and nested records use exact schemas and reject unknown fields.
- Use TDD for every executable task. Stage and commit only the paths listed in that task.

---

## File Structure

**Create**

- `app/js/data/palette-definitions.js` — immutable, versioned palette library.
- `app/js/data/palette-usage-mapping.js` — immutable per-palette role recipes.
- `app/js/data/fragrance-suggestions.js` — immutable fragrance library.
- `app/js/data/presentation-definition-set.js` — fixed scenes and 51 title selectors.
- `app/js/domain/presentation-definition-validator.js` — exact-schema and graph validation.
- `app/js/domain/palette-usage.js` — HEX mixing, deterministic role resolution, and WCAG checks.
- `app/js/domain/presentation-selector.js` — title-to-presentation resolution.
- `app/js/domain/share-fragrance-summary.js` — fixed three-item share reduction.
- `app/tests/fixtures/presentation-valid.fixture.js` — independent valid authority fixture builders.
- `app/tests/fixtures/presentation-invalid.fixture.js` — named invalid mutations.
- `app/tests/presentation-definition.test.js` — definition and copy-lint contract tests.
- `app/tests/palette-usage.test.js` — color resolution and contrast tests.
- `app/tests/presentation-selector.test.js` — selector and share-summary tests.
- `docs/presentation-content-catalog.md` — user-reviewed palette and fragrance authoring ledger.

**Modify**

- `app/js/data/title-profile-definitions.js` — replace generic defaults with approved palette IDs.
- `app/js/domain/result-model.js` — add a pure presented-result composition seam.
- `app/tests/scoring-title-contract.test.js` — verify presentation attachment preserves the existing result.
- `app/tests/version-contract.test.js` — verify definition-set and AppMeta version equality.
- `docs/data-model.md` — record the exact usage-mapping and selector-output contracts.
- `docs/processing-design.md` — record validation, resolution, WCAG, and fallback order.
- `docs/screens.md` — record standard-first palette order and shared fragrance reduction.
- `docs/tasks.md` — record the Q-013 content completion and verification evidence.

---

### Task 1: Exact schemas and independent authority fixtures

**Files:**
- Create: `app/js/domain/presentation-definition-validator.js`
- Create: `app/tests/fixtures/presentation-valid.fixture.js`
- Create: `app/tests/fixtures/presentation-invalid.fixture.js`
- Create: `app/tests/presentation-definition.test.js`

**Interfaces:**
- Consumes: `validateTitleProfileDefinitions(titleProfiles)` and `appMeta.presentationDefinitionVersion`.
- Produces: `validatePresentationDefinitionSet(value, { titleProfiles, expectedVersion }) -> Readonly<PresentationDefinitionSet>`.
- Produces: `lintPresentationCopy(value) -> Array<{ definitionId, field, code }>`.
- Error contract: invalid structure or graph throws `TypeError("PRESENTATION_DEFINITION_INVALID")`; forbidden copy throws `TypeError("PRESENTATION_COPY_INVALID")`.

- [ ] **Step 1: Write the failing exact-schema and graph tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import {
  validatePresentationDefinitionSet,
  lintPresentationCopy,
} from "../js/domain/presentation-definition-validator.js";
import { makeValidPresentationDefinitionSet } from "./fixtures/presentation-valid.fixture.js";
import { invalidPresentationCases } from "./fixtures/presentation-invalid.fixture.js";

test("validates the complete 51-title Q-013 graph", () => {
  const set = makeValidPresentationDefinitionSet(TitleProfileDefinitions);
  const validated = validatePresentationDefinitionSet(set, {
    titleProfiles: TitleProfileDefinitions,
    expectedVersion: "presentation-v1",
  });
  assert.equal(validated.titleSelectors.length, 51);
  assert.deepEqual(validated.scenes.map(({ sceneId }) => sceneId), [
    "pause", "reset", "quiet-focus",
  ]);
  assert.equal(lintPresentationCopy(validated).length, 0);
});

for (const { name, mutate, error } of invalidPresentationCases) {
  test(`rejects ${name}`, () => {
    const value = structuredClone(makeValidPresentationDefinitionSet(TitleProfileDefinitions));
    mutate(value);
    assert.throws(
      () => validatePresentationDefinitionSet(value, {
        titleProfiles: TitleProfileDefinitions,
        expectedVersion: "presentation-v1",
      }),
      error,
    );
  });
}
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `node --test app/tests/presentation-definition.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `presentation-definition-validator.js`.

- [ ] **Step 3: Add fixture builders with concrete valid values and named invalid mutations**

The valid fixture must create 51 selectors from `TitleProfileDefinitions`, three fixed scene records, three distinct fixture palettes per title, two fixture fragrances per scene and title, and a share ID contained in each pair. The invalid fixture must export cases for:

- unknown outer and nested fields;
- 50 and 52 selectors;
- duplicate and missing title IDs;
- missing, duplicate, and orphan palette/fragrance IDs;
- mismatched versions;
- one or three alternative palettes;
- standard/alternative and alternative/alternative duplication;
- missing or extra base colors and malformed HEX;
- missing, reordered, or duplicated scenes;
- one or three fragrance candidates;
- fragrance/scene mismatch;
- share ID outside its two candidates;
- `answers`, `score`, `band`, `characterColor`, `replacementPaletteId`, and `recolor`;
- forbidden product, essential-oil, usage, and effect copy.

- [ ] **Step 4: Implement the minimal recursive exact validator and copy lint**

Use explicit field arrays for every record. Validate 51 selectors against the title-profile fixed order. Validate `defaultPaletteId` from the title profile plus two distinct alternatives, but do not duplicate the standard ID inside a selector. Freeze the validated graph recursively before returning it.

- [ ] **Step 5: Run focused and full formal tests**

Run: `node --test app/tests/presentation-definition.test.js`
Expected: PASS for every valid and invalid fixture.

Run: `npm.cmd run test:formal`
Expected: PASS for the new tests and all existing formal tests.

- [ ] **Step 6: Commit only Task 1 paths**

```powershell
git add app/js/domain/presentation-definition-validator.js app/tests/fixtures/presentation-valid.fixture.js app/tests/fixtures/presentation-invalid.fixture.js app/tests/presentation-definition.test.js
git commit -m "test: define Q-013 presentation contracts"
```

---

### Task 2: Palette usage mapping and WCAG validation

**Files:**
- Create: `app/js/domain/palette-usage.js`
- Create: `app/tests/palette-usage.test.js`

**Interfaces:**
- Consumes: `PaletteDefinition` and a matching `PaletteUsageMappingDefinition`.
- Produces: `resolvePaletteUsage(palette, mapping) -> Readonly<{ background, surface, accent, text, chart }>`.
- Produces: `contrastRatio(foreground, background) -> number`.
- Produces: `validatePaletteContrast(resolved) -> { valid, failures: Array<{ pair, ratio, required }> }`.

`PaletteUsageMappingDefinition` is exact:

```js
{
  paletteId: "palette-example",
  version: "presentation-v1",
  roles: {
    background: { source: "primary", mixWith: "white", mixPercent: 88 },
    surface: { source: "secondary", mixWith: "white", mixPercent: 94 },
    accent: { source: "accent", mixWith: "none", mixPercent: 0 },
    chart: { source: "primary", mixWith: "black", mixPercent: 12 },
  },
  textCandidates: ["#1F2430", "#FFFFFF"],
}
```

- [ ] **Step 1: Write failing deterministic-color and WCAG tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  contrastRatio,
  resolvePaletteUsage,
  validatePaletteContrast,
} from "../js/domain/palette-usage.js";

const palette = {
  paletteId: "palette-fixture",
  version: "presentation-v1",
  label: "fixture",
  baseColors: { primary: "#406080", secondary: "#D0D8E0", accent: "#A04020" },
  description: "雰囲気を添える配色候補です。",
};
const mapping = {
  paletteId: "palette-fixture",
  version: "presentation-v1",
  roles: {
    background: { source: "primary", mixWith: "white", mixPercent: 88 },
    surface: { source: "secondary", mixWith: "white", mixPercent: 94 },
    accent: { source: "accent", mixWith: "none", mixPercent: 0 },
    chart: { source: "primary", mixWith: "black", mixPercent: 12 },
  },
  textCandidates: ["#1F2430", "#FFFFFF"],
};

test("resolves the same usage colors for the same inputs", () => {
  assert.deepEqual(resolvePaletteUsage(palette, mapping), resolvePaletteUsage(palette, mapping));
});

test("enforces 4.5:1 text and 3:1 non-text contrast", () => {
  const resolved = resolvePaletteUsage(palette, mapping);
  const report = validatePaletteContrast(resolved);
  assert.equal(report.valid, true);
  assert.ok(contrastRatio(resolved.text, resolved.background) >= 4.5);
  assert.ok(contrastRatio(resolved.text, resolved.surface) >= 4.5);
  assert.ok(contrastRatio(resolved.chart, resolved.background) >= 3);
  assert.ok(contrastRatio(resolved.accent, resolved.background) >= 3);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test app/tests/palette-usage.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `palette-usage.js`.

- [ ] **Step 3: Implement HEX parsing, sRGB relative luminance, contrast ratio, mixing, and role resolution**

Reject mismatched `paletteId` or version, unknown role fields, non-integer mix percentages, percentages outside `0..100`, and `mixWith: "none"` with a non-zero percentage. Select the text candidate with the higher minimum contrast against both background and surface.

- [ ] **Step 4: Add light, dark, exact-threshold, and failing-contrast fixtures**

Assert normal text at `4.5:1` passes, any lower value fails, non-text at `3:1` passes, and any lower value fails. Assert no function accepts character colors or returns replacement palette IDs.

- [ ] **Step 5: Run focused and full formal tests**

Run: `node --test app/tests/palette-usage.test.js`
Expected: PASS for deterministic output and all WCAG boundaries.

Run: `npm.cmd run test:formal`
Expected: PASS.

- [ ] **Step 6: Commit only Task 2 paths**

```powershell
git add app/js/domain/palette-usage.js app/tests/palette-usage.test.js
git commit -m "feat: resolve accessible palette usage colors"
```

---

### Task 3: User-reviewed presentation content catalog

**Files:**
- Create: `docs/presentation-content-catalog.md`

**Interfaces:**
- Consumes: the 51 title IDs in `TitleProfileDefinitions`, fixed scene definitions, the usage-mapping contract, and prohibited-copy rules.
- Produces: one approved catalog row per title with `defaultPaletteId`, two ordered alternative palette IDs, six ordered fragrance IDs, and three declared share IDs.
- Produces: approved palette records containing label, three base colors, description, and role recipes.
- Produces: approved fragrance records containing scene, accord label, description, and disclaimer ID.

- [ ] **Step 1: Create the catalog header, schema legend, and review states**

Use only `draft`, `reviewed`, `approved`, and `rejected` as review states. Include the fixed scene-ID/display-name table and the complete prohibited field/copy checklist.

- [ ] **Step 2: Conduct Batch 0 — usage mapping and representative palettes**

Present one light, one mid-tone, and one dark candidate with resolved usage colors and exact WCAG ratios. Record the selected recipe fields and rejection reasons.
Expected gate: all four contrast pairs pass and the user approves one deterministic mapping approach without character-color input.

- [ ] **Step 3: Conduct Batch 1 — fragrance vocabulary**

Present the two accord labels and descriptions for each fixed scene, plus the proposed representative for sharing.
Expected gate: six candidates and three representatives are approved; none contains a prohibited effect, product, oil, quantity, recipe, or usage statement.

- [ ] **Step 4: Conduct Batch 2 — balanced and ten single-factor titles**

For each of the 11 titles, present standard plus two alternatives, three base colors per palette, six fragrance references, and three share references in one comparison block.
Expected gate: 11 rows are `approved`; palettes remain symbolic presentation and fragrance remains an atmosphere/impression suggestion.

- [ ] **Step 5: Conduct Batches 3–6 — pair titles in fixed groups of ten**

Use TitleProfileDefinitions order: pair rows 1–10, 11–20, 21–30, and 31–40. Keep the same comparison block and approval checklist as Batch 2.
Expected gate: all 40 pair rows are `approved`, giving 51 approved title rows total.

- [ ] **Step 6: Audit the completed catalog**

Count exactly 51 approved title rows. Confirm every row has one standard ID, two distinct alternatives, six fragrance IDs in fixed scene order, and three share IDs contained in their scene pairs. Confirm every referenced palette and fragrance has one approved library record.

- [ ] **Step 7: Commit only the approved catalog**

```powershell
git add docs/presentation-content-catalog.md
git commit -m "docs: approve Q-013 presentation content"
```

---

### Task 4: Production libraries and all 51 selectors

**Files:**
- Create: `app/js/data/palette-definitions.js`
- Create: `app/js/data/palette-usage-mapping.js`
- Create: `app/js/data/fragrance-suggestions.js`
- Create: `app/js/data/presentation-definition-set.js`
- Modify: `app/js/data/title-profile-definitions.js`
- Modify: `app/tests/presentation-definition.test.js`
- Modify: `app/tests/palette-usage.test.js`

**Interfaces:**
- Produces: `PaletteDefinitions`, `PaletteUsageMappingDefinitions`, `FragranceSuggestions`, and `PresentationDefinitionSet`.
- Produces: `TitleProfileDefinitions` with an approved `defaultPaletteId` for each title.
- All exports are deeply frozen and share `appMeta.presentationDefinitionVersion`.

- [ ] **Step 1: Add failing production-data completeness tests**

```js
import { appMeta } from "../js/config/app-meta.js";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { PresentationDefinitionSet } from "../js/data/presentation-definition-set.js";
import { PaletteUsageMappingDefinitions } from "../js/data/palette-usage-mapping.js";
import {
  validatePresentationDefinitionSet,
  lintPresentationCopy,
} from "../js/domain/presentation-definition-validator.js";
import { resolvePaletteUsage, validatePaletteContrast } from "../js/domain/palette-usage.js";

test("production Q-013 content covers every title and passes WCAG", () => {
  const set = validatePresentationDefinitionSet(PresentationDefinitionSet, {
    titleProfiles: TitleProfileDefinitions,
    expectedVersion: appMeta.presentationDefinitionVersion,
  });
  assert.equal(set.titleSelectors.length, 51);
  assert.deepEqual(lintPresentationCopy(set), []);
  for (const palette of set.palettes) {
    const mapping = PaletteUsageMappingDefinitions.find(({ paletteId }) => paletteId === palette.paletteId);
    assert.equal(validatePaletteContrast(resolvePaletteUsage(palette, mapping)).valid, true);
  }
});
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test app/tests/presentation-definition.test.js app/tests/palette-usage.test.js`
Expected: FAIL because the production data modules do not exist.

- [ ] **Step 3: Transcribe only approved catalog records into the production libraries**

Use stable kebab-case IDs: `palette-<slug>` and `fragrance-<scene>-<slug>`. Do not include review status, author notes, rejected copy, or user discussion in runtime modules.

- [ ] **Step 4: Add all 51 selectors and approved default palette IDs**

Keep selectors in `TitleProfileDefinitions` fixed order. A selector contains only `titleId`, two `alternativePaletteIds`, and the three exact `fragranceScenes`. The standard palette remains solely in `TitleProfileDefinition.defaultPaletteId`.

- [ ] **Step 5: Run focused, full, and static checks**

Run: `node --test app/tests/presentation-definition.test.js app/tests/palette-usage.test.js`
Expected: PASS with 51 selectors, no forbidden copy, no missing mappings, and every palette passing WCAG.

Run: `npm.cmd test`
Expected: PASS.

Run: `npm.cmd run check`
Expected: PASS.

- [ ] **Step 6: Commit only Task 4 paths**

```powershell
git add app/js/data/palette-definitions.js app/js/data/palette-usage-mapping.js app/js/data/fragrance-suggestions.js app/js/data/presentation-definition-set.js app/js/data/title-profile-definitions.js app/tests/presentation-definition.test.js app/tests/palette-usage.test.js
git commit -m "feat: add approved Q-013 content libraries"
```

---

### Task 5: Pure title selector and three-item share summary

**Files:**
- Create: `app/js/domain/presentation-selector.js`
- Create: `app/js/domain/share-fragrance-summary.js`
- Create: `app/tests/presentation-selector.test.js`

**Interfaces:**
- Consumes: `selectPresentation(titleProfile, definitionSet)`.
- Produces:

```js
{
  titleId: string,
  palettes: {
    standard: PaletteDefinition,
    alternatives: [PaletteDefinition, PaletteDefinition],
  },
  fragranceScenes: [
    {
      sceneId: "pause" | "reset" | "quiet-focus",
      label: string,
      candidates: [FragranceSuggestion, FragranceSuggestion],
      shareRepresentative: FragranceSuggestion,
    },
  ],
}
```

- Produces: `summarizeFragrances(fragranceScenes) -> Readonly<[ShareFragrance, ShareFragrance, ShareFragrance]>`.
- Error contract: missing or invalid references throw `TypeError("PRESENTATION_SELECTION_INVALID")`; invalid sharing input throws `TypeError("SHARE_FRAGRANCE_INVALID")`.

- [ ] **Step 1: Write failing selector and share tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { PresentationDefinitionSet } from "../js/data/presentation-definition-set.js";
import { selectPresentation } from "../js/domain/presentation-selector.js";
import { summarizeFragrances } from "../js/domain/share-fragrance-summary.js";

test("returns standard first, two alternatives, six candidates, and three share items", () => {
  const selection = selectPresentation(TitleProfileDefinitions[0], PresentationDefinitionSet);
  assert.equal(selection.palettes.standard.paletteId, TitleProfileDefinitions[0].defaultPaletteId);
  assert.equal(selection.palettes.alternatives.length, 2);
  assert.deepEqual(selection.fragranceScenes.map(({ sceneId }) => sceneId), [
    "pause", "reset", "quiet-focus",
  ]);
  assert.equal(selection.fragranceScenes.flatMap(({ candidates }) => candidates).length, 6);
  assert.equal(summarizeFragrances(selection.fragranceScenes).length, 3);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test app/tests/presentation-selector.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `presentation-selector.js`.

- [ ] **Step 3: Implement deterministic reference resolution**

Accept only the title profile and definition set. Do not accept answers, factors, bands, scores, selected palette, character data, DOM, Canvas, storage, or network dependencies. Return standard separately from the ordered alternative tuple and deep-freeze the result.

- [ ] **Step 4: Implement fixed share reduction**

Require exactly the three fixed scenes in order. Copy only `sceneId`, scene display `label`, and representative `accordLabel`; exclude the other three candidates and all diagnostic values.

- [ ] **Step 5: Add invariance and invalid-reference tests**

Run the same title through preview20 and detail50 harness values without passing either value into the selector; assert deep equality. Assert a simulated selected palette change does not mutate the selection. Assert same-hue character metadata cannot be supplied because it is not part of either function interface.

- [ ] **Step 6: Run focused and full formal tests**

Run: `node --test app/tests/presentation-selector.test.js`
Expected: PASS.

Run: `npm.cmd run test:formal`
Expected: PASS.

- [ ] **Step 7: Commit only Task 5 paths**

```powershell
git add app/js/domain/presentation-selector.js app/js/domain/share-fragrance-summary.js app/tests/presentation-selector.test.js
git commit -m "feat: select title presentation and share fragrance summary"
```

---

### Task 6: Result model, version contract, and design documentation

**Files:**
- Modify: `app/js/domain/result-model.js`
- Modify: `app/tests/scoring-title-contract.test.js`
- Modify: `app/tests/version-contract.test.js`
- Modify: `docs/data-model.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/screens.md`
- Modify: `docs/tasks.md`

**Interfaces:**
- Consumes: an existing frozen core result and a validated selection.
- Produces: `composePresentedResultModel({ result, presentation }) -> Readonly<PresentedResultModel>`.
- Invariant: the returned model deep-copies presentation data while preserving every existing score, title, character, boundary flag, and rendered text byte-for-byte.

- [ ] **Step 1: Write the failing result-preservation test**

```js
test("attaches presentation without changing the diagnostic result", () => {
  const factors = factorResults([1, 2, 3, 4, 5], {
    intellectImagination: { directionalSupportCount: 10 },
    conscientiousness: { directionalSupportCount: 5 },
    extraversion: { directionalSupportCount: 0 },
    agreeableness: { directionalSupportCount: 5 },
    emotionalStability: { directionalSupportCount: 10 },
  });
  const classification = classifyTitle({
    factorResults: factors,
    questionCount: 50,
    titleProfiles: TitleProfileDefinitions,
  });
  const renderedTexts = [{
    id: "caller-approved-text-id",
    version: "result-text-v1",
    section: "titleSubtitle",
    text: "承認済みの表示文",
    evidenceRefs: ["evidence-title-rule-v1"],
  }];
  const core = composeResultModel({ factors, classification, renderedTexts });
  const presentation = selectPresentation(TitleProfileDefinitions[0], PresentationDefinitionSet);
  const presented = composePresentedResultModel({ result: core, presentation });
  assert.deepEqual(
    {
      factors: presented.factors,
      titleId: presented.titleId,
      characterId: presented.characterId,
      boundaryFlags: presented.boundaryFlags,
      renderedTexts: presented.renderedTexts,
    },
    core,
  );
  assert.equal(presented.presentation.palettes.standard.paletteId, TitleProfileDefinitions[0].defaultPaletteId);
  assert.equal(Object.isFrozen(presented.presentation), true);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test app/tests/scoring-title-contract.test.js`
Expected: FAIL because `composePresentedResultModel` is not exported.

- [ ] **Step 3: Implement the presented-result composition seam**

Keep `composeResultModel` unchanged for the measurement core. Add an exact two-field input validator for `{ result, presentation }`, reject `answers` and unknown fields, deep-copy both sides, and deep-freeze the returned model.

- [ ] **Step 4: Add the definition-version test**

Assert `PresentationDefinitionSet.presentationDefinitionVersion === appMeta.presentationDefinitionVersion`, every palette/fragrance/mapping version matches it, and the same value reaches the saved `VersionTuple`.

- [ ] **Step 5: Update the four design documents**

Record:

- recursive exact schemas, including `PaletteUsageMappingDefinition`;
- `selectPresentation`, `resolvePaletteUsage`, `validatePaletteContrast`, and `summarizeFragrances`;
- standard-first display order and fixed scene labels;
- 4.5:1 text and 3:1 non-text gates;
- all 51 selectors, six displayed fragrances, and three shared representatives;
- copy prohibitions and the absence of extra questions, safety mode, and unscented branching;
- final test commands and Q-013 content completion evidence.

- [ ] **Step 6: Run all verification**

Run: `npm.cmd test`
Expected: PASS for formal and prototype suites.

Run: `npm.cmd run check`
Expected: PASS with no missing modules or static-contract violations.

Run: `git diff --check`
Expected: no output and exit code 0.

- [ ] **Step 7: Commit only Task 6 paths**

```powershell
git add app/js/domain/result-model.js app/tests/scoring-title-contract.test.js app/tests/version-contract.test.js docs/data-model.md docs/processing-design.md docs/screens.md docs/tasks.md
git commit -m "feat: integrate Q-013 presentation model"
```

---

## Final Verification Gate

- [ ] `PresentationDefinitionSet` validates recursively with exactly 51 selectors.
- [ ] Every title resolves one standard and two distinct alternative palettes, with the standard in the dedicated first position.
- [ ] Every palette has one matching mapping and passes 4.5:1 text and 3:1 non-text contrast.
- [ ] Every result exposes fixed-order `pause`, `reset`, and `quiet-focus`, two candidates per scene, and exactly three shared representatives.
- [ ] Selecting a palette leaves factors, title, result text, character, and fragrance candidates unchanged.
- [ ] Same-hue character combinations retain the selected palette and never recolor the character.
- [ ] Forbidden-field and forbidden-copy fixtures fail with stable internal error codes.
- [ ] No app flow adds questions, a safety mode, an unscented branch, products, essential-oil amounts, recipes, usage instructions, or effect claims.
- [ ] `npm.cmd test`, `npm.cmd run check`, and `git diff --check` all succeed.
