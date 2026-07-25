# Task 5 report: presentation and character CSV compilers

## Status

Complete. Commit: `feat: compile presentation and character CSVs`.

## Implementation

- Added `compilePresentationContent` to join the seven normalized Q-013 row
  sets into the exact existing `PresentationDefinitionSet` runtime contract.
  It uses explicit `display_order` for every catalog/relation group, validates
  all relations and cardinalities, and delegates prohibited-copy enforcement
  and exact runtime shape checks to `validatePresentationDefinitionSet`.
- Added `compileCharacterContent` to emit the canonical two-field
  `CharacterManifest` with the exact seven-field entry shape from
  `docs/data-model.md`. It converts lowercase hex delivery hashes to
  `sha256-<Base64>`, verifies safe relative WebP paths, and freezes output.
- Added the independent `assertCharacterReleaseEligible` gate. Compilation
  accepts valid authoring statuses; release requires 51 rows, every review and
  source status approved, plus a non-empty approver and valid UTC timestamp.
- Added the generic `reference` column type without weakening lowercase
  `id`, updated existing runtime-ID columns, and added all eight new schema
  descriptors. No production Q-012/Q-013 CSV rows, assets, approvals, or
  hashes were created.

## Contract coverage

- Presentation requires exactly 3 scenes, 103 palettes, 309 palette-usage
  mappings, 306 fragrances, 51 selectors, 102 selector-palette rows, and 306
  selector-fragrance rows.
- Character compilation requires 51 ordered title/character mappings, 1024px
  square alpha art metadata, safe relative `.webp` delivery paths, non-empty
  non-claiming alt text, and a 64-character lowercase SHA-256 value.
- Tests cover count failures in all seven presentation input sets, orphaned
  selector-fragrance parents and children, duplicate order in all three
  relation kinds, each palette/selector/fragrance cardinality rule, and
  version mismatches in every versioned presentation catalog.
- Character negatives cover prohibited Japanese and English title/type,
  personality, ability/intelligence, rank, and breed claims while retaining
  observable pose, accessory, gaze, and direction descriptions. External
  paths, invalid hashes, dimensions, alpha, pending approvals, and the exact
  canonical manifest field set remain covered.

## RED / GREEN evidence

- RED 1: `node --test app/tests/content-presentation-character-compiler.test.js`
  failed with `ERR_MODULE_NOT_FOUND` for the two new compiler modules.
- RED 2: the reference-loader test failed with `CSV_SCHEMA_INVALID` before
  `reference` was added to the generic schema loader.
- RED 3: release eligibility incorrectly accepted an empty row set; the
  regression failed with a missing expected approval exception.
- GREEN: focused presentation, character, table-schema, and presentation
  definition tests passed after the minimal implementations.

## Verification

- Focused: `node --test app/tests/content-presentation-character-compiler.test.js app/tests/content-table-schema.test.js app/tests/presentation-definition.test.js` — 81 passed, 0 failed.
- Full: `npm.cmd test` — 259 passed, 0 failed.
- Static: `npm.cmd run check` — passed.
- New schemas: all eight descriptors loaded through `loadTableSchema`.
- `git diff --check` — passed.

## Concerns

None. Real Q-012 artwork inspection, approved production rows/assets, release
manifest generation, and generated runtime output remain deliberately outside
this task.

## Task 5b corrective evidence

- The independent `assertCharacterReleaseEligible` gate now requires the
  source `has_alpha` value to be exactly `"true"`, independently of regular
  compilation validation. An otherwise fully approved row marked
  `has_alpha="false"` now returns the stable
  `CHARACTER_APPROVAL_PENDING` error.
- Character alt validation now rejects each required English rank/superiority
  form: `No.1 cat`, `No 1 cat`, `#1 cat`, `1st place cat`, `top cat`,
  `top-ranked cat`, `the highest ranked cat`, and `the lowest ranked cat`.
  Existing ordinary observable descriptions, including `A seated cat looking
  left`, still compile.
- Both public compilers destructure input only inside their protected error
  boundary. `undefined` and `null` roots now produce the stable
  `PRESENTATION_CONTENT_INVALID` and `CHARACTER_CONTENT_INVALID` errors as
  applicable; nested validation behavior and runtime projections are
  unchanged.

### Task 5b RED / GREEN evidence

- RED: `node --test app/tests/content-presentation-character-compiler.test.js`
  failed 3 targeted regressions before the fixes: `No.1 cat` compiled, the
  all-approved non-alpha row passed the release gate, and an `undefined`
  presentation root escaped as a JavaScript `TypeError` instead of the stable
  content error.
- GREEN: the same compiler test passed 11/11 after the minimal guard and error
  boundary fixes.

### Task 5b verification

- Focused: `node --test app/tests/content-presentation-character-compiler.test.js app/tests/content-table-schema.test.js app/tests/presentation-definition.test.js` — 82 passed, 0 failed.
- Full: `npm.cmd test` — 260 passed, 0 failed.
- Static: `npm.cmd run check` — passed (28 JavaScript files).
- Diff: `git diff --check` — passed.

### Task 5b concerns

None. The change is limited to the specified compiler guards, regression
tests, and this evidence; no schema, source CSV, production approval, or
runtime contract was changed.

## Review fix round

- Expanded the alt-copy gate to reject the concrete Japanese forms `第1位の猫`
  and `賢い猫`, numbered/ordinal and superiority claims, plus the contracted
  Japanese and English title/type, personality, ability/intelligence, rank,
  and breed vocabulary. Ordinary observable alt text remains accepted.
- Added explicit table-driven negatives for every presentation input count,
  selector-fragrance orphan direction, all relation-group duplicate orders,
  palette usage, selector palette, and selector fragrance cardinalities, and
  every versioned catalog.
- Review RED: the concrete `第1位の猫` fixture compiled without an exception
  before the alt gate was expanded. The presentation coverage cases already
  passed against the implemented gates and now protect those branches.
- Review GREEN: compiler tests passed 10/10; the final focused suite passed
  81/81 and the full suite passed 259/259. Static check and all eight schema
  loads passed; final diff validation is recorded before the fix commit.
- No production Q-012/Q-013 row, approval, asset, or hash was added or changed.
