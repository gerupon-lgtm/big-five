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
- Tests cover missing/duplicate/orphan/order/version/cardinality failures,
  prohibited fragrance copy, external paths, invalid hashes, dimensions,
  alpha, alt claims, pending approvals, and the canonical manifest field set.

## RED / GREEN evidence

- RED 1: `node --test app/tests/content-presentation-character-compiler.test.js`
  failed with `ERR_MODULE_NOT_FOUND` for the two new compiler modules.
- RED 2: the reference-loader test failed with `CSV_SCHEMA_INVALID` before
  `reference` was added to the generic schema loader.
- RED 3: release eligibility incorrectly accepted an empty row set; the
  regression failed with a missing expected approval exception.
- GREEN: focused presentation, character, table-schema, and presentation
  definition tests passed 76/76 after the minimal implementations.

## Verification

- Focused: `node --test app/tests/content-presentation-character-compiler.test.js app/tests/content-table-schema.test.js app/tests/presentation-definition.test.js` — 76 passed, 0 failed.
- Full: `npm.cmd test` — 254 passed, 0 failed.
- Static: `npm.cmd run check` — passed.
- New schemas: all eight descriptors loaded through `loadTableSchema`.
- `git diff --check` — passed.

## Concerns

None. Real Q-012 artwork inspection, approved production rows/assets, release
manifest generation, and generated runtime output remain deliberately outside
this task.
