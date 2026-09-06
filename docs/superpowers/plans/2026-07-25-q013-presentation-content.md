# Q-013 Presentation v2 Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `presentation-v2`の共有パレット、用途色レシピ、香調、香り素材、51称号selectorを版付きCSVで制作・承認し、正式releaseを選択せずに既存ES Modules runtimeへ決定的に有効化して、後続の共有カード実装ゲートを満たす。

**Architecture:** 人が編集する正典は`content/source/presentation/presentation-v2/`のCSVと、標準パレットを所有する`content/source/titles/title-rule-v1/title-profiles.csv`だけにする。既存のschema 1 validator、fixtures、7-resource compiler、canonical JSON、SHA-256、atomic writerをschema 2へ拡張し、承認済みCSVからES Modulesを決定的に生成する。`app/content/`は引き続きignore済み生成物であり、正式release・JSON runtime・Pagesは別計画まで有効化しない。

**Tech Stack:** CSV UTF-8/CP932 strict decode、JSON table schema、JavaScript ES Modules、Node.js `node:test`、既存content compiler、WCAG 2.1 contrast calculation。

## Global Constraints

- 対応機能は`F-018`、対応実装タスクは`T-005`、後続共有は`T-007`とする。
- 現在のruntimeは`PresentationDefinitionSet.schemaVersion = 1`、`appMeta.presentationDefinitionVersion = "presentation-v1"`である。Task 13の全承認・parity gateまで変更しない。
- 人手編集正典は版付きCSVである。`app/content/`のJSONは手編集・コミットせず、生成ES Modulesも手編集しない。
- `PaletteDefinition`、`PaletteUsageMappingDefinition`、`FragranceSuggestion`、`FragranceMaterialDefinition`は共有ライブラリレコードとし、同一内容を称号ごとに複製しない。称号selectorは安定IDだけを参照する。
- `palettes.csv`が`primary`、`secondary`、`accent`の大文字6桁HEXを所有する。
- `palette-usage-mappings.csv`はパレットごとに正確に1行のwide recipeとし、背景・表面・アクセント・チャートのsource/mix、文字色候補2件、版、固定順、statusを所有する。
- schema 2はrootに`paletteUsageMappings`と`fragranceMaterials`を持ち、すべての`FragranceSuggestion`は固定順1〜3件の`materialIds`を持つ。schema 1/v1互換検証は残す。
- `fragrance-materials.csv`だけが香り素材の一般名称を所有する。`fragrance-material-examples.csv`は香調、素材ID、版、固定順、statusだけを持つ。
- 素材例は通常結果用であり、`summarizeFragrances`、共有カード、共有テキストへ含めない。
- 固定場面順は`pause`、`reset`、`quiet-focus`である。各称号・各場面は香調候補2件、共有代表1件を持つ。
- 各称号は`TitleProfileDefinition.defaultPaletteId`の標準1件と、selectorの代替2件を持つ。selectorへ標準IDを重複保持しない。
- パレット選択は診断得点、称号、結果文、猫、香調候補を変更しない。同系色の猫を理由にパレットを除外・差替えせず、猫を再配色しない。
- 香りコピーへ商品、ブランド、購入URL、量、滴数、濃度、配合、摂取、塗布、ディフューザー使用法、治療・改善・能力向上効果を入れない。植物・精油名は素材マスタの`displayName`だけに許可する。
- P-0〜P-6は別々の人手承認である。実際のユーザー承認前に行statusを`approved`へ変更せず、`approved_by`と`approved_on`を記入しない。
- Q-013完了はformal CSV release、Q-012 formal release、DNS、HTTPS、production Pagesの完了を意味しない。
- 各実装タスクはRED→GREEN→focused regression→commitの順で行い、そのタスクのFilesにない変更を混ぜない。

## Phase and File Map

### Technical work that may run immediately

- Modify: `app/js/domain/presentation-definition-validator.js`
- Modify: `app/tests/fixtures/presentation-valid.fixture.js`
- Modify: `app/tests/fixtures/presentation-invalid.fixture.js`
- Modify: `app/tests/presentation-definition.test.js`
- Create: `app/js/domain/palette-usage.js`
- Create: `app/js/domain/presentation-selector.js`
- Create: `app/js/domain/share-fragrance-summary.js`
- Create: `app/tests/palette-usage.test.js`
- Create: `app/tests/presentation-selector.test.js`
- Modify: `content/schemas/palettes.schema.json`
- Modify: `content/schemas/palette-usage-mappings.schema.json`
- Create: `content/schemas/fragrance-materials.schema.json`
- Create: `content/schemas/fragrance-material-examples.schema.json`
- Create: `content/schemas/presentation-content-approvals.schema.json`
- Modify: `scripts/content/compile-presentation.mjs`
- Modify: `scripts/content/content-compiler.mjs`
- Modify: `app/tests/content-table-schema.test.js`
- Modify: `app/tests/content-presentation-character-compiler.test.js`
- Modify: `app/tests/content-compiler.test.js`
- Modify: `app/tests/content-artifact-contract.test.js`

### Draft authoring, then mandatory human pauses

- Create: `content/source/approvals/presentation-content-approvals.csv`
- Create: `content/source/presentation/presentation-v2/scenes.csv`
- Create: `content/source/presentation/presentation-v2/palettes.csv`
- Create: `content/source/presentation/presentation-v2/palette-usage-mappings.csv`
- Create: `content/source/presentation/presentation-v2/fragrances.csv`
- Create: `content/source/presentation/presentation-v2/fragrance-materials.csv`
- Create: `content/source/presentation/presentation-v2/fragrance-material-examples.csv`
- Create: `content/source/presentation/presentation-v2/presentation-selectors.csv`
- Create: `content/source/presentation/presentation-v2/selector-palettes.csv`
- Create: `content/source/presentation/presentation-v2/selector-fragrances.csv`
- Create: `scripts/content/render-presentation-review.mjs`
- Create: `app/tests/presentation-review-report.test.js`
- Create: `docs/presentation-content-catalog.md` as a generated, non-authoritative review projection.

### ES Modules runtime cutover after P-0 through P-6

- Create: `scripts/content/generate-presentation-runtime.mjs`
- Create: `app/js/data/presentation-definitions.js` as generated output.
- Create: `app/tests/presentation-runtime-generation.test.js`
- Read/verify: `content/source/titles/title-rule-v1/title-profiles.csv`
- Modify: `app/js/data/title-profile-definitions.js` through the generator only.
- Modify: `app/js/config/app-meta.js`
- Modify: `app/tests/content-migration-parity.test.js`
- Modify: `app/tests/version-contract.test.js`
- Modify: `docs/content-authoring.md`
- Modify: `docs/data-model.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/screens.md`
- Modify: `docs/tasks.md`

---

### Task 1: Extend the Existing Validator and Fixtures to Root Schema 2

**Files:**
- Modify: `app/js/domain/presentation-definition-validator.js`
- Modify: `app/tests/fixtures/presentation-valid.fixture.js`
- Modify: `app/tests/fixtures/presentation-invalid.fixture.js`
- Modify: `app/tests/presentation-definition.test.js`

**Interfaces:**
- Retains: `validatePresentationDefinitionSet(value, { titleProfiles, expectedVersion })`.
- Retains: `lintPresentationCopy(value) -> Array<{ definitionId, field, code }>`.
- Schema 1 exact root: `schemaVersion,presentationDefinitionVersion,scenes,palettes,fragrances,titleSelectors`.
- Schema 2 exact root: `schemaVersion,presentationDefinitionVersion,scenes,palettes,paletteUsageMappings,fragrances,fragranceMaterials,titleSelectors`.
- Schema 2 exact fragrance fields: `fragranceId,version,sceneId,accordLabel,description,materialIds,disclaimerId`.
- Exact material fields: `materialId,version,displayName,materialKind`.
- Error contracts remain `TypeError("PRESENTATION_DEFINITION_INVALID")` and `TypeError("PRESENTATION_COPY_INVALID")`.

- [ ] **Step 1: Write schema 2 RED tests while preserving schema 1**

```js
test("schema 2 requires usage mappings, material library, and relation-ordered material references", () => {
  const value = makeValidPresentationDefinitionSet(TitleProfileDefinitions, {
    schemaVersion: 2,
    version: "presentation-v2",
  });
  const validated = validatePresentationDefinitionSet(value, {
    titleProfiles: TitleProfileDefinitions,
    expectedVersion: "presentation-v2",
  });
  assert.equal(validated.schemaVersion, 2);
  assert.equal(validated.paletteUsageMappings.length, validated.palettes.length);
  assert.ok(validated.fragrances.every(({ materialIds }) =>
    materialIds.length >= 1 && materialIds.length <= 3));
});

test("schema 1 remains valid without schema 2 fields", () => {
  assert.doesNotThrow(() => validatePresentationDefinitionSet(
    makeValidPresentationDefinitionSet(TitleProfileDefinitions),
    { titleProfiles: TitleProfileDefinitions, expectedVersion: "presentation-v1" },
  ));
});
```

Add named invalid mutations for a missing/extra root field, duplicate/orphan material, 0 or 4 material IDs, duplicate material ID, mismatched version, absent mapping, orphan mapping, malformed recipe, and a material field leaking into schema 1.

- [ ] **Step 2: Run RED**

Run:

```powershell
node --test app/tests/presentation-definition.test.js
```

Expected: FAIL because the existing validator accepts only schema 1 and has no material or usage-mapping fields.

- [ ] **Step 3: Implement the version-discriminated exact validator**

Use separate exact-field arrays for schema 1 and schema 2. In schema 2, validate one mapping per palette, unique material IDs, every material referenced at least once, every fragrance referencing 1〜3 unique material IDs, version equality, and preserve the per-fragrance relation order emitted by the compiler without coupling it to global material-library order. Permit plant/essential-oil names only when lint visits `FragranceMaterialDefinition.displayName`; keep every other palette/fragrance field under the existing copy prohibitions.

- [ ] **Step 4: Run GREEN and regression**

Run:

```powershell
node --test app/tests/presentation-definition.test.js
node --test app/tests/content-presentation-character-compiler.test.js
```

Expected: both commands PASS; schema 1 fixture coverage remains green and schema 2 invalid mutations fail with stable errors.

- [ ] **Step 5: Commit**

```powershell
git add app/js/domain/presentation-definition-validator.js app/tests/fixtures/presentation-valid.fixture.js app/tests/fixtures/presentation-invalid.fixture.js app/tests/presentation-definition.test.js
git commit -m "test: extend presentation contracts to schema 2"
```

---

### Task 2: Add Pure Palette, Selector, and Share-Summary Functions

**Files:**
- Create: `app/js/domain/palette-usage.js`
- Create: `app/js/domain/presentation-selector.js`
- Create: `app/js/domain/share-fragrance-summary.js`
- Create: `app/tests/palette-usage.test.js`
- Create: `app/tests/presentation-selector.test.js`

**Interfaces:**
- Produces: `resolvePaletteUsage(palette, mapping) -> Readonly<{ background, surface, accent, text, chart }>`.
- Produces: `contrastRatio(foreground, background) -> number`.
- Produces: `validatePaletteContrast(resolved) -> Readonly<{ valid, failures }>` using 4.5:1 text and 3:1 non-text gates.
- Produces: `selectPresentation(titleProfile, definitionSet) -> Readonly<TitlePresentation>`.
- Produces: `summarizeFragrances(fragranceScenes) -> Readonly<[ShareFragrance, ShareFragrance, ShareFragrance]>`.

`PaletteUsageMappingDefinition` is exact:

```js
{
  paletteId: "palette-example",
  version: "presentation-v2",
  roles: {
    background: { source: "primary", mixWith: "white", mixPercent: 88 },
    surface: { source: "secondary", mixWith: "white", mixPercent: 94 },
    accent: { source: "accent", mixWith: "none", mixPercent: 0 },
    chart: { source: "primary", mixWith: "black", mixPercent: 12 },
  },
  textCandidates: ["#1F2430", "#FFFFFF"],
}
```

- [ ] **Step 1: Write palette and sharing RED tests**

```js
test("resolves deterministic usage colors and WCAG evidence", () => {
  const first = resolvePaletteUsage(palette, mapping);
  assert.deepEqual(first, resolvePaletteUsage(palette, mapping));
  assert.equal(validatePaletteContrast(first).valid, true);
  assert.ok(contrastRatio(first.text, first.background) >= 4.5);
  assert.ok(contrastRatio(first.chart, first.background) >= 3);
});

test("share summary exposes three accord labels and no material data", () => {
  const selection = selectPresentation(titleProfile, schema2DefinitionSet);
  const summary = summarizeFragrances(selection.fragranceScenes);
  assert.equal(summary.length, 3);
  assert.deepEqual(Object.keys(summary[0]), ["sceneId", "label", "accordLabel"]);
  assert.doesNotMatch(JSON.stringify(summary), /materialId|displayName/);
});
```

- [ ] **Step 2: Run RED**

Run:

```powershell
node --test app/tests/palette-usage.test.js app/tests/presentation-selector.test.js
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for the new domain modules.

- [ ] **Step 3: Implement deterministic pure functions**

Parse uppercase HEX, mix sRGB channel integers with an explicit `0..100` percentage, choose the text candidate with the higher minimum contrast against background and surface, and deep-freeze all outputs. `selectPresentation` accepts only a title profile and validated definition set; it returns standard palette separately, two ordered alternatives, three ordered scenes, two fragrance candidates per scene, and the declared representative. `summarizeFragrances` copies only `sceneId`, scene `label`, and representative `accordLabel`.

- [ ] **Step 4: Add boundary and invariance cases**

Cover exact 4.5/3.0 thresholds, invalid source/mix combinations, version mismatch, standard/alternative duplication, missing representative, score/answer/character input rejection, same-hue character irrelevance, and material exclusion from JSON/string snapshots.

- [ ] **Step 5: Run GREEN**

Run:

```powershell
node --test app/tests/palette-usage.test.js app/tests/presentation-selector.test.js
npm.cmd run test:formal
```

Expected: both commands PASS.

- [ ] **Step 6: Commit**

```powershell
git add app/js/domain/palette-usage.js app/js/domain/presentation-selector.js app/js/domain/share-fragrance-summary.js app/tests/palette-usage.test.js app/tests/presentation-selector.test.js
git commit -m "feat: add pure presentation selection functions"
```

---

### Task 3: Migrate the CSV Schemas and Existing Seven-Resource Compiler

**Files:**
- Modify: `content/schemas/palettes.schema.json`
- Modify: `content/schemas/palette-usage-mappings.schema.json`
- Create: `content/schemas/fragrance-materials.schema.json`
- Create: `content/schemas/fragrance-material-examples.schema.json`
- Modify: `scripts/content/compile-presentation.mjs`
- Modify: `scripts/content/content-compiler.mjs`
- Modify: `app/tests/content-table-schema.test.js`
- Modify: `app/tests/content-presentation-character-compiler.test.js`
- Modify: `app/tests/content-compiler.test.js`
- Modify: `app/tests/content-artifact-contract.test.js`

**Interfaces:**
- Retains: `compilePresentationContent(input, expectedVersion)`.
- Adds input row sets: `fragranceMaterialRows` and `fragranceMaterialExampleRows`.
- Retains: `validateAuthoringTree`, `canonicalJson`, `compileRelease`, `writeReleaseAtomically`.
- Retains exactly seven resource kinds in order: `diagnosis,questions,titles,result-texts,evidence,presentation,characters`.

The migrated `palettes.csv` columns are exact:

```text
palette_id,presentation_definition_version,display_order,label,primary_color,secondary_color,accent_color,description,status
```

The one-row-per-palette `palette-usage-mappings.csv` columns are exact:

```text
palette_id,presentation_definition_version,display_order,background_source,background_mix_with,background_mix_percent,surface_source,surface_mix_with,surface_mix_percent,accent_source,accent_mix_with,accent_mix_percent,chart_source,chart_mix_with,chart_mix_percent,text_candidate_1,text_candidate_2,status
```

The two material tables are exact:

```text
material_id,presentation_definition_version,display_order,display_name,material_kind,status
fragrance_id,material_id,presentation_definition_version,display_order,status
```

- [ ] **Step 1: Write schema and compiler RED tests**

Assert exact column order, uppercase HEX for palette and text candidate values, source enum `primary|secondary|accent`, mix enum `none|white|black`, integer percentage `0..100`, exactly one mapping per palette, and exact material relation columns. Extend compiler fixtures with shared palette/fragrance/material records rather than title-specific duplicates.

```js
assert.deepEqual(Object.keys(compiled), [
  "schemaVersion",
  "presentationDefinitionVersion",
  "scenes",
  "palettes",
  "paletteUsageMappings",
  "fragrances",
  "fragranceMaterials",
  "titleSelectors",
]);
assert.equal(compiled.schemaVersion, 2);
assert.equal(compiled.fragrances[0].materialIds.length >= 1, true);
assert.equal(compiled.fragrances[0].materialIds.length <= 3, true);
```

- [ ] **Step 2: Run RED**

Run:

```powershell
node --test app/tests/content-table-schema.test.js app/tests/content-presentation-character-compiler.test.js app/tests/content-artifact-contract.test.js
```

Expected: FAIL because palettes currently receive colors from three narrow usage rows, material tables are unregistered, and the compiler emits schema 1.

- [ ] **Step 3: Replace narrow usage normalization with the wide recipe**

Read `baseColors` directly from `palettes.csv`. Compile each wide usage row into one exact `PaletteUsageMappingDefinition`. Reject duplicate/missing mappings, version/order/status errors, malformed HEX, `mixWith = none` with nonzero percent, and any orphan mapping.

- [ ] **Step 4: Join fragrance materials into schema 2**

Register both material tables in the existing `TABLES`/`PRESENTATION_TABLES`, pass both row sets through `compilePresentationCatalog`, compile an ordered shared material library, and replace each fragrance relation group with a fixed `materialIds` array that preserves that fragrance's relation `display_order`. Do not emit the relation table itself and do not force relation order to match global material-library order.

- [ ] **Step 5: Replace obsolete global cardinalities with graph invariants**

Keep exactly 3 scenes and 51 selectors. Require 2 alternative palettes per title, 2 fragrance candidates per title/scene, 1 share representative per title/scene, 1 mapping per palette, 1〜3 material relations per fragrance, contiguous per-group `display_order`, matching versions, and no orphan palette/fragrance/material library or unknown-scene relation row. Require schema 2 compilation to use `presentation-v2`; schema 1/v1 remains the existing runtime-only compatibility path. Remove the hardcoded 103 palettes, 309 color rows, and 306 fragrances.

- [ ] **Step 6: Prove the seven-resource writer is unchanged**

Assert `RESOURCE_KINDS.length === 7`, presentation remains the sixth resource, `canonicalJson` is byte-identical for repeated input, every manifest SHA-256 matches, and injected writer failure leaves no partial release. Do not introduce an eighth resource, second manifest, or parallel writer.

- [ ] **Step 7: Run GREEN**

Run:

```powershell
node --test app/tests/content-table-schema.test.js app/tests/content-presentation-character-compiler.test.js app/tests/content-compiler.test.js app/tests/content-artifact-contract.test.js
npm.cmd run content:validate
```

Expected: focused tests PASS. Before Task 5, validation reports 0 structural errors plus the existing `PRESENTATION_CATALOG_PENDING`, `RELEASE_NOT_SELECTED`, and independent character/release warnings.

- [ ] **Step 8: Commit**

```powershell
git add content/schemas/palettes.schema.json content/schemas/palette-usage-mappings.schema.json content/schemas/fragrance-materials.schema.json content/schemas/fragrance-material-examples.schema.json scripts/content/compile-presentation.mjs scripts/content/content-compiler.mjs app/tests/content-table-schema.test.js app/tests/content-presentation-character-compiler.test.js app/tests/content-compiler.test.js app/tests/content-artifact-contract.test.js
git commit -m "feat: compile presentation v2 CSV"
```

---

### Task 4: Add the Separate Q-013 Approval Ledger

**Files:**
- Create: `content/schemas/presentation-content-approvals.schema.json`
- Create: `content/source/approvals/presentation-content-approvals.csv`
- Modify: `scripts/content/content-compiler.mjs`
- Modify: `app/tests/content-table-schema.test.js`
- Modify: `app/tests/content-compiler.test.js`
- Modify: `docs/content-authoring.md`

**Interfaces:**
- Exact columns: `gate_id,display_order,scope,status,approved_by,approved_on,note`.
- Exact gate order: `P-0,P-1,P-2,P-3,P-4,P-5,P-6`.
- Produces release error `PRESENTATION_APPROVAL_PENDING` when any gate or selected presentation row is not approved.
- Draft authoring validation remains available and reports warnings rather than inventing approval.

- [ ] **Step 1: Write ledger RED tests**

```js
assert.deepEqual(
  approvals.map(({ gate_id, display_order, status, approved_by, approved_on }) =>
    [gate_id, display_order, status, approved_by, approved_on]),
  [
    ["P-0", 1, "draft", "", ""],
    ["P-1", 2, "draft", "", ""],
    ["P-2", 3, "draft", "", ""],
    ["P-3", 4, "draft", "", ""],
    ["P-4", 5, "draft", "", ""],
    ["P-5", 6, "draft", "", ""],
    ["P-6", 7, "draft", "", ""],
  ],
);
```

Reject missing/reordered/duplicate gates, unknown scope, approval metadata on a non-approved gate, an approved gate without both real approver and ISO date, and a formal release with one pending gate.

- [ ] **Step 2: Run RED**

Run:

```powershell
node --test app/tests/content-table-schema.test.js app/tests/content-compiler.test.js
```

Expected: FAIL because the Q-013 approval schema/ledger and compiler gate do not exist.

- [ ] **Step 3: Create the exact initial ledger**

```csv
gate_id,display_order,scope,status,approved_by,approved_on,note
P-0,1,palette-mapping-wcag,draft,,,
P-1,2,fragrance-vocabulary-materials,draft,,,
P-2,3,titles-balanced-and-single-01-11,draft,,,
P-3,4,titles-pair-01-10,draft,,,
P-4,5,titles-pair-11-20,draft,,,
P-5,6,titles-pair-21-30,draft,,,
P-6,7,titles-pair-31-40,draft,,,
```

The table schema restricts `scope` to those seven literals. Keep both approval metadata fields and notes blank.

- [ ] **Step 4: Load and enforce the ledger**

Load it beside, not instead of, `result-content-approvals.csv`. `validateAuthoringTree` exposes its draft warnings. `compileRelease` requires all seven Q-013 gates, all selected presentation rows, all Q-006 gates, and Q-012 character eligibility independently.

- [ ] **Step 5: Run GREEN**

Run:

```powershell
node --test app/tests/content-table-schema.test.js app/tests/content-compiler.test.js
npm.cmd run content:validate
```

Expected: tests PASS; validation has no ledger structural error and reports seven unapproved Q-013 gates plus `RELEASE_NOT_SELECTED`.

- [ ] **Step 6: Commit**

```powershell
git add content/schemas/presentation-content-approvals.schema.json content/source/approvals/presentation-content-approvals.csv scripts/content/content-compiler.mjs app/tests/content-table-schema.test.js app/tests/content-compiler.test.js docs/content-authoring.md
git commit -m "feat: add q013 approval ledger"
```

---

### Task 5: Author Draft Presentation v2 CSV and Generate the Review Projection

**Files:**
- Create: all nine CSV files under `content/source/presentation/presentation-v2/` listed in the Phase and File Map.
- Modify: `content/schemas/palettes.schema.json`
- Modify only: `default_palette_id` in `content/source/titles/title-rule-v1/title-profiles.csv`; all other title-profile columns remain byte-equivalent.
- Create: `scripts/content/render-presentation-review.mjs`
- Create: `app/tests/presentation-review-report.test.js`
- Create: `app/tests/presentation-approval-stage.test.js`
- Modify: `app/tests/content-presentation-character-compiler.test.js`
- Modify: `app/tests/content-table-schema.test.js`
- Modify: `app/tests/content-migration-parity.test.js`
- Create: `docs/presentation-content-catalog.md`

**Interfaces:**
- Produces: structurally valid draft `presentation-v2` CSV.
- Produces: `renderPresentationReview({ definitionSet, titleProfiles, contrastReports, approvals }) -> string`.
- The Markdown report is a deterministic review projection and explicitly says the CSV is authority.

- [ ] **Step 1: Verify the non-canonical candidate inputs before manual use**

Run `Get-FileHash -Algorithm SHA256` on the user-held files and require these exact hashes:

```text
ipip_symbolic_colors_file1_style.md D70813832584CFCB914720C279225BB50FB96CD04485743BDA24DC9D2A18C660
ipip_comment_proposals_integrated.md 3CE057115205ED5FF0FBC9A639ED06F23D42F5296DD73E4C02C99A36CDB50D86
ipip_aroma_proposals_integrated.md 4D39A7C11BED7E4D230B189C9FC3D5E882F4F0A89220B9477D80D708669B277A
```

Expected: all three hashes match. If a hash differs, stop authoring and retain the empty `presentation-v2` directory state; do not auto-adopt text from the mismatched file.

- [ ] **Step 2: Write the nine CSVs as draft authority**

Manually join candidate rows to the exact 51 `title_id` values and `display_order` in `title-profiles.csv`; never join on the Japanese label alone. Consolidate identical palette, fragrance, and material proposals into one stable shared record and reference it from relations. Keep human review notes such as label/HEX mismatches in the schema-backed `palettes.csv.content_review_note` column, never in renderer code; this review-only metadata must not enter the runtime Palette shape. Write each proposed standard palette directly to the matching authoritative `title-profiles.csv.default_palette_id`; leave title labels, factors, character IDs, result text IDs, title-rule version, and row status byte-equivalent. These IDs are draft Q-013 proposals until their P-2〜P-6 gate is approved and must not activate runtime. Keep all presentation-v2 source rows `draft`, uppercase every HEX, use contiguous ordering, and rewrite unsafe fragrance descriptions before they enter CSV.

- [ ] **Step 3: Write report-generator RED tests**

Assert the report has P-0 through P-6 sections, fixed 51-title order, accessible color swatches, separate WCAG/content-review columns, palette recipe and exact contrast ratios, six fragrance candidates/three representatives per title, 1〜3 material display names per fragrance for ordinary-result review, and no material name in its share-summary projection. Assert the renderer accepts valid mixed approval stages, rejects inconsistent approval metadata, and remains byte-equivalent to the committed review projection.

Run:

```powershell
node --test app/tests/presentation-review-report.test.js
```

Expected: FAIL because the renderer does not exist.

- [ ] **Step 4: Implement and run the deterministic review renderer**

The report header must say `正典: content/source/presentation/presentation-v2/*.csv` and `本書は承認用の生成ビューであり、手編集しない`. P-2 covers title rows 1〜11; P-3 through P-6 cover pair-title rows 12〜21, 22〜31, 32〜41, and 42〜51.

Run:

```powershell
node scripts/content/render-presentation-review.mjs --source content/source --output docs/presentation-content-catalog.md
node --test app/tests/presentation-review-report.test.js
npm.cmd run content:validate
```

Expected: renderer is byte-identical across two runs and the committed review projection; tests PASS; validation reports 0 errors, draft-content warnings, seven draft approval gates, and `RELEASE_NOT_SELECTED`. Runtime-v1 remains active while the draft title-profile palette IDs are validated against the presentation-v2 catalog.

- [ ] **Step 5: Commit the draft without approval claims**

```powershell
git add content/schemas/palettes.schema.json content/source/presentation/presentation-v2 content/source/titles/title-rule-v1/title-profiles.csv scripts/content/render-presentation-review.mjs app/tests/presentation-review-report.test.js app/tests/presentation-approval-stage.test.js app/tests/content-presentation-character-compiler.test.js app/tests/content-table-schema.test.js app/tests/content-migration-parity.test.js docs/presentation-content-catalog.md
git commit -m "content: add q013 presentation v2 draft"
```

---

### Task 6: Human Approval P-0 — Palette Mapping and WCAG

**Files:**
- Modify: `content/source/presentation/presentation-v2/palettes.csv`
- Modify: `content/source/presentation/presentation-v2/palette-usage-mappings.csv`
- Modify: `content/source/approvals/presentation-content-approvals.csv`
- Create: `scripts/content/render-palette-preview.mjs`
- Create: `app/tests/palette-preview-tool.test.js`
- Create/Regenerate: `docs/palette-preview.html`
- Modify: `package.json`
- Modify: `docs/content-authoring.md`
- Modify: `docs/tasks.md`
- Regenerate: `docs/presentation-content-catalog.md`

**Interfaces:**
- P-0 scope: the complete shared palette library, one wide recipe per palette, and exact 4.5:1/3:1 evidence.

- [x] **Step 1: Pause and present P-0**

Show the generated P-0 table with base HEX, resolved background/surface/accent/chart/text, all tested contrast pairs, and palette descriptions. Also generate the standalone `docs/palette-preview.html`, which shows all 153 palettes as 3:5 simplified shared-card previews. Each preview uses the resolved palette as its card background, plus the fixed five-factor display colors selected for the ココロパレア icon family; the factor bars are not the palette `chart` role. Use one representative character only for layout and color-visibility review, not as a title-specific Q-012 decision. The standalone file must have no runtime network dependency. It may support temporary browser-side base-color edits and a change list, but it must never write to the authority CSV or imply P-0 approval. Do not edit statuses while awaiting an explicit user decision.

- [x] **Step 2: Record only the actual decision**

If the user approves the complete batch, set its palette and mapping rows to`approved`, set P-0 to`approved`, and record the actual approver and date. If the user requests changes, keep P-0 non-approved, edit the affected draft rows, regenerate the report, rerun WCAG tests, and present the complete P-0 batch again.

- [x] **Step 3: Verify and commit P-0**

Run:

```powershell
node --test app/tests/palette-usage.test.js app/tests/presentation-review-report.test.js app/tests/palette-preview-tool.test.js
npm.cmd run content:preview:palettes
npm.cmd run content:validate
```

Expected after approval: tests PASS; P-0 is the only approved Q-013 gate and P-1〜P-6 retain blank approval metadata.

2026-07-31 decision: the user explicitly approved comparison B as the formal P-0 mapping. The canonical recipe is background white mix 84% and surface white mix 90%. These values remain centralized in the two versioned mix columns so a later change can use a new version and the same P-0 review path.

```powershell
git add content/source/presentation/presentation-v2/palettes.csv content/source/presentation/presentation-v2/palette-usage-mappings.csv content/source/approvals/presentation-content-approvals.csv scripts/content/render-palette-preview.mjs app/tests/palette-preview-tool.test.js docs/palette-preview.html docs/presentation-content-catalog.md package.json docs/content-authoring.md docs/tasks.md
git commit -m "content: record q013 p0 approval"
```

---

### Task 7: Human Approval P-1 — Fragrance Vocabulary and Materials

**Files:**
- Modify: `content/source/presentation/presentation-v2/scenes.csv`
- Modify: `content/source/presentation/presentation-v2/fragrances.csv`
- Modify: `content/source/presentation/presentation-v2/fragrance-materials.csv`
- Modify: `content/source/presentation/presentation-v2/fragrance-material-examples.csv`
- Modify: `content/source/approvals/presentation-content-approvals.csv`
- Regenerate: `docs/presentation-content-catalog.md`

**Interfaces:**
- P-1 scope: fixed scene vocabulary, complete shared fragrance library, complete shared material library, and ordered material relations.

- [x] **Step 1: Pause and present P-1**

Show each scene, accord label, neutral description, disclaimer, ordered 1〜3 material examples, and the material-excluded share projection. Include prohibited-copy lint results. Do not edit statuses while awaiting an explicit user decision.

- [x] **Step 2: Record only the actual decision**

On full approval, approve the four source tables and P-1 with the real approver/date. On requested changes, retain non-approved status, update draft rows, regenerate and re-present all P-1 records.

- [x] **Step 3: Verify and commit P-1**

Run:

```powershell
node --test app/tests/presentation-definition.test.js app/tests/presentation-selector.test.js app/tests/presentation-review-report.test.js
npm.cmd run content:validate
```

Expected after approval: tests PASS; P-0/P-1 are approved; P-2〜P-6 remain non-approved with blank metadata.

```powershell
git add content/source/presentation/presentation-v2/scenes.csv content/source/presentation/presentation-v2/fragrances.csv content/source/presentation/presentation-v2/fragrance-materials.csv content/source/presentation/presentation-v2/fragrance-material-examples.csv content/source/approvals/presentation-content-approvals.csv docs/presentation-content-catalog.md
git commit -m "content: record q013 p1 approval"
```

---

### Task 8: Human Approval P-2 — Balanced and Ten Single-Factor Titles

**Files:**
- Modify only `default_palette_id` for title display-order 1〜11 in `content/source/titles/title-rule-v1/title-profiles.csv` when the user requests a standard-palette change.
- Modify only title display-order 1〜11 rows in `content/source/presentation/presentation-v2/presentation-selectors.csv`.
- Modify only title display-order 1〜11 relations in `content/source/presentation/presentation-v2/selector-palettes.csv`.
- Modify only title display-order 1〜11 relations in `content/source/presentation/presentation-v2/selector-fragrances.csv`.
- Modify: `content/source/approvals/presentation-content-approvals.csv`
- Regenerate: `docs/presentation-content-catalog.md`

**Interfaces:**
- P-2 title scope: `title-profiles.csv` display order 1〜11.

- [x] **Step 1: Pause and present all 11 title rows**

For every title, show standard palette, two alternatives, three scenes×two fragrance candidates, and the three declared share representatives. Do not edit status while awaiting an explicit user decision.

- [x] **Step 2: Record only the actual decision**

Approve exactly the standard `default_palette_id`, selector/relation rows belonging to display order 1〜11, and P-2 only after full-batch approval. Requested edits keep the whole P-2 gate non-approved until the revised complete batch is accepted.

- [x] **Step 3: Verify and commit**

Run:

```powershell
npm.cmd run content:validate
node --test app/tests/presentation-review-report.test.js
```

Expected: 51-selector structure still passes; only the P-2 selector subset is approved.

```powershell
git add content/source/titles/title-rule-v1/title-profiles.csv content/source/presentation/presentation-v2/presentation-selectors.csv content/source/presentation/presentation-v2/selector-palettes.csv content/source/presentation/presentation-v2/selector-fragrances.csv content/source/approvals/presentation-content-approvals.csv docs/presentation-content-catalog.md
git commit -m "content: record q013 p2 approval"
```

---

### Task 9: Human Approval P-3 — Pair Titles 1 Through 10

**Files:**
- Modify only `default_palette_id` for title display-order 12〜21 in `content/source/titles/title-rule-v1/title-profiles.csv` when the user requests a standard-palette change.
- Modify only title display-order 12〜21 rows in `content/source/presentation/presentation-v2/presentation-selectors.csv`.
- Modify only title display-order 12〜21 relations in `content/source/presentation/presentation-v2/selector-palettes.csv`.
- Modify only title display-order 12〜21 relations in `content/source/presentation/presentation-v2/selector-fragrances.csv`.
- Modify: `content/source/approvals/presentation-content-approvals.csv`
- Regenerate: `docs/presentation-content-catalog.md`

**Interfaces:** P-3 title scope is `title-profiles.csv` display order 12〜21.

- [x] **Step 1: Pause and present all ten title rows**

For every title, show standard palette, two alternatives, three scenes×two fragrance candidates, and three share representatives. Do not edit status while awaiting an explicit user decision.

- [x] **Step 2: Record only the actual decision**

Approve exactly the standard `default_palette_id`, selector/relation rows belonging to display order 12〜21, and P-3 only after full-batch approval. Requested edits keep P-3 non-approved until the revised complete ten-title batch is accepted.

- [x] **Step 3: Verify**

```powershell
npm.cmd run content:validate
node --test app/tests/presentation-review-report.test.js
```

Expected: tests PASS; P-4〜P-6 remain non-approved with blank metadata.

- [x] **Step 4: Commit**

```powershell
git add content/source/titles/title-rule-v1/title-profiles.csv content/source/presentation/presentation-v2/presentation-selectors.csv content/source/presentation/presentation-v2/selector-palettes.csv content/source/presentation/presentation-v2/selector-fragrances.csv content/source/approvals/presentation-content-approvals.csv docs/presentation-content-catalog.md
git commit -m "content: record q013 p3 approval"
```

---

### Task 10: Human Approval P-4 — Pair Titles 11 Through 20

**Files:**
- Modify only `default_palette_id` for title display-order 22〜31 in `content/source/titles/title-rule-v1/title-profiles.csv` when the user requests a standard-palette change.
- Modify only title display-order 22〜31 rows in `content/source/presentation/presentation-v2/presentation-selectors.csv`.
- Modify only title display-order 22〜31 relations in `content/source/presentation/presentation-v2/selector-palettes.csv`.
- Modify only title display-order 22〜31 relations in `content/source/presentation/presentation-v2/selector-fragrances.csv`.
- Modify: `content/source/approvals/presentation-content-approvals.csv`
- Regenerate: `docs/presentation-content-catalog.md`

**Interfaces:** P-4 title scope is `title-profiles.csv` display order 22〜31.

- [x] **Step 1: Pause and present all ten title rows**

For every title, show standard palette, two alternatives, three scenes×two fragrance candidates, and three share representatives. Do not edit status while awaiting an explicit user decision.

- [x] **Step 2: Record only the actual decision**

Approve exactly the standard `default_palette_id`, selector/relation rows belonging to display order 22〜31, and P-4 only after full-batch approval. Requested edits keep P-4 non-approved until the revised complete ten-title batch is accepted.

- [x] **Step 3: Verify**

```powershell
npm.cmd run content:validate
node --test app/tests/presentation-review-report.test.js
```

Expected: tests PASS; P-5/P-6 remain non-approved with blank metadata.

- [x] **Step 4: Commit**

```powershell
git add content/source/titles/title-rule-v1/title-profiles.csv content/source/presentation/presentation-v2/presentation-selectors.csv content/source/presentation/presentation-v2/selector-palettes.csv content/source/presentation/presentation-v2/selector-fragrances.csv content/source/approvals/presentation-content-approvals.csv docs/presentation-content-catalog.md
git commit -m "content: record q013 p4 approval"
```

---

### Task 11: Human Approval P-5 — Pair Titles 21 Through 30

**Files:**
- Modify only `default_palette_id` for title display-order 32〜41 in `content/source/titles/title-rule-v1/title-profiles.csv` when the user requests a standard-palette change.
- Modify only title display-order 32〜41 rows in `content/source/presentation/presentation-v2/presentation-selectors.csv`.
- Modify only title display-order 32〜41 relations in `content/source/presentation/presentation-v2/selector-palettes.csv`.
- Modify only title display-order 32〜41 relations in `content/source/presentation/presentation-v2/selector-fragrances.csv`.
- Modify: `content/source/approvals/presentation-content-approvals.csv`
- Regenerate: `docs/presentation-content-catalog.md`

**Interfaces:** P-5 title scope is `title-profiles.csv` display order 32〜41.

- [x] **Step 1: Pause and present all ten title rows**

For every title, show standard palette, two alternatives, three scenes×two fragrance candidates, and three share representatives. Do not edit status while awaiting an explicit user decision.

- [x] **Step 2: Record only the actual decision**

Approve exactly the standard `default_palette_id`, selector/relation rows belonging to display order 32〜41, and P-5 only after full-batch approval. Requested edits keep P-5 non-approved until the revised complete ten-title batch is accepted.

- [x] **Step 3: Verify**

```powershell
npm.cmd run content:validate
node --test app/tests/presentation-review-report.test.js
```

Expected: tests PASS; P-6 remains non-approved with blank metadata.

- [x] **Step 4: Commit**

```powershell
git add content/source/titles/title-rule-v1/title-profiles.csv content/source/presentation/presentation-v2/presentation-selectors.csv content/source/presentation/presentation-v2/selector-palettes.csv content/source/presentation/presentation-v2/selector-fragrances.csv content/source/approvals/presentation-content-approvals.csv docs/presentation-content-catalog.md
git commit -m "content: record q013 p5 approval"
```

---

### Task 12: Human Approval P-6 — Pair Titles 31 Through 40

**Files:**
- Modify only `default_palette_id` for title display-order 42〜51 in `content/source/titles/title-rule-v1/title-profiles.csv` when the user requests a standard-palette change.
- Modify only title display-order 42〜51 rows in `content/source/presentation/presentation-v2/presentation-selectors.csv`.
- Modify only title display-order 42〜51 relations in `content/source/presentation/presentation-v2/selector-palettes.csv`.
- Modify only title display-order 42〜51 relations in `content/source/presentation/presentation-v2/selector-fragrances.csv`.
- Modify: `content/source/approvals/presentation-content-approvals.csv`
- Regenerate: `docs/presentation-content-catalog.md`

**Interfaces:** P-6 title scope is `title-profiles.csv` display order 42〜51.

- [x] **Step 1: Pause and present all ten title rows**

For every title, show standard palette, two alternatives, three scenes×two fragrance candidates, and three share representatives. Do not edit status while awaiting an explicit user decision.

- [x] **Step 2: Record only the actual decision**

Approve exactly the standard `default_palette_id`, selector/relation rows belonging to display order 42〜51, and P-6 only after full-batch approval. Requested edits keep P-6 non-approved until the revised complete ten-title batch is accepted.

- [x] **Step 3: Verify**

```powershell
npm.cmd run content:validate
node --test app/tests/presentation-review-report.test.js
```

Expected after approval: all presentation source rows and P-0〜P-6 are approved with real metadata; no formal release row exists.

- [x] **Step 4: Commit**

```powershell
git add content/source/titles/title-rule-v1/title-profiles.csv content/source/presentation/presentation-v2/presentation-selectors.csv content/source/presentation/presentation-v2/selector-palettes.csv content/source/presentation/presentation-v2/selector-fragrances.csv content/source/approvals/presentation-content-approvals.csv docs/presentation-content-catalog.md
git commit -m "content: record q013 p6 approval"
```

---

### Task 13: Generate and Activate the Approved ES Modules Runtime

**Gate:** Start only when P-0〜P-6 are approved, every selected Q-013 row is approved, and the generated review report matches the CSV byte-for-byte projection.

**Files:**
- Create: `scripts/content/generate-presentation-runtime.mjs`
- Create: `app/js/data/presentation-definitions.js`
- Create: `app/tests/presentation-runtime-generation.test.js`
- Read/verify: `content/source/titles/title-rule-v1/title-profiles.csv`
- Modify through generator: `app/js/data/title-profile-definitions.js`
- Modify: `app/js/config/app-meta.js`
- Modify: `app/tests/content-migration-parity.test.js`
- Modify: `app/tests/version-contract.test.js`
- Modify: `docs/content-authoring.md`
- Modify: `docs/data-model.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/screens.md`
- Modify: `docs/tasks.md`

**Interfaces:**
- Produces: `generatePresentationRuntime({ sourceDir, outputPaths }) -> Promise<{ presentationSha256, titleProfilesSha256 }>` using temp files plus rename.
- Generated exports: `PresentationDefinitionSet`, `PaletteDefinitions`, `PaletteUsageMappingDefinitions`, `FragranceSuggestions`, `FragranceMaterialDefinitions`.
- Generated title-profile module remains the source-compatible `TitleProfileDefinitions` export.
- Formal JSON release remains unselected.

- [x] **Step 1: Write generation/parity RED tests**

```js
test("approved CSV generates byte-identical ES Modules twice", async (t) => {
  const first = await generateIntoTemp(t);
  const second = await generateIntoTemp(t);
  assert.deepEqual(first.bytes, second.bytes);
  assert.deepEqual(first.hashes, second.hashes);
});

test("generated runtime exposes the sharing-card gate", async () => {
  assert.equal(PresentationDefinitionSet.schemaVersion, 2);
  assert.equal(appMeta.presentationDefinitionVersion, "presentation-v2");
  assert.equal(PaletteDefinitions.length, PaletteUsageMappingDefinitions.length);
  assert.equal(FragranceMaterialDefinitions.length > 0, true);
  assert.equal(PresentationDefinitionSet.titleSelectors.length, 51);
});
```

Also assert generation refuses any draft gate/row, unknown field, non-canonical order, material ID leak into `summarizeFragrances`, and an output path outside the exact two approved module paths. `materialNames`は共有カード画像用に保持し、共有テキスト生成境界で除外する。

- [x] **Step 2: Run RED**

Run:

```powershell
node --test app/tests/presentation-runtime-generation.test.js app/tests/content-migration-parity.test.js app/tests/version-contract.test.js
```

Expected: FAIL because the generator and generated presentation module do not exist and AppMeta is still `presentation-v1`.

- [x] **Step 3: Verify approved standard palette IDs**

Verify the 51 authoritative `title-profiles.csv.default_palette_id` values are already the exact standard IDs shown in the approved P-2〜P-6 review projection, in fixed order. They were authored in Task 5 and could only be revised inside their unapproved P-2〜P-6 gate. Abort generation on any mismatch; Task 13 must not introduce or silently rewrite a standard palette decision.

- [x] **Step 4: Implement the deterministic generator**

Load CSV through the existing schemas/loaders, compile through `compileResultContent` and `compilePresentationContent`, require P-0〜P-6 plus all selected rows approved, serialize payloads with existing `canonicalJson`, and emit fixed module templates. Deep-freeze generated exports at module load. Write both outputs to sibling temp files, verify both generated hashes, then rename both; failure must leave both previous modules unchanged.

- [x] **Step 5: Generate modules and switch AppMeta**

Run:

```powershell
node scripts/content/generate-presentation-runtime.mjs --source content/source --presentation-output app/js/data/presentation-definitions.js --titles-output app/js/data/title-profile-definitions.js
```

Then set only:

```js
presentationDefinitionVersion: "presentation-v2",
```

Do not add a release row and do not write `app/content/`.

- [x] **Step 6: Prove CSV-to-runtime parity and sharing exclusion**

`content-migration-parity.test.js` must compile `result-text-v2`, `title-rule-v1`, and `presentation-v2`, then deep-equal the generated ES Module exports. It must assert all five library/selector exports, 51 selectors, schema 2, version equality, deterministic order, and that `summarizeFragrances` contains no material IDs. Material names remain available for the share-card image; share text excludes them at its own boundary.

- [x] **Step 7: Synchronize current-state documentation**

Record that Q-013 ES Modules runtime is active only after P-0〜P-6; `app/content/` remains generated/ignored; `release-manifest.csv` and `release-history.csv` remain header-only; JSON runtime, Q-012 formal release, DNS, HTTPS, and production Pages remain separate gates.

- [x] **Step 8: Run the final Q-013 verification**

Run:

```powershell
node --test app/tests/presentation-definition.test.js app/tests/palette-usage.test.js app/tests/presentation-selector.test.js app/tests/content-presentation-character-compiler.test.js app/tests/content-table-schema.test.js app/tests/content-compiler.test.js app/tests/content-artifact-contract.test.js app/tests/presentation-runtime-generation.test.js app/tests/content-migration-parity.test.js app/tests/version-contract.test.js
npm.cmd run content:validate
npm.cmd run test:formal
npm.cmd run check
git diff --check
```

Expected: all tests/checks PASS; `content:validate` has 0 errors and no Q-013 approval warning, while `RELEASE_NOT_SELECTED` and independent formal release/Q-012 warnings remain accurate. `npm.cmd run content:build` still fails with `RELEASE_NOT_SELECTED`.

- [x] **Step 9: Commit**

```powershell
git add scripts/content/generate-presentation-runtime.mjs app/js/data/presentation-definitions.js app/js/data/title-profile-definitions.js app/js/config/app-meta.js app/tests/presentation-runtime-generation.test.js app/tests/content-migration-parity.test.js app/tests/version-contract.test.js docs/content-authoring.md docs/data-model.md docs/processing-design.md docs/screens.md docs/tasks.md
git commit -m "feat: activate approved presentation v2 runtime"
```

## Downstream Sharing-Card Gate

- root schema 2
- `appMeta.presentationDefinitionVersion === "presentation-v2"`
- approved `PaletteDefinitions`
- approved `PaletteUsageMappingDefinitions`
- approved `FragranceSuggestions`
- approved `FragranceMaterialDefinitions`
- 51 approved selectors
- `selectPresentation(titleProfile, definitionSet)`
- `resolvePaletteUsage(palette, mapping)`
- `summarizeFragrances(fragranceScenes)`
