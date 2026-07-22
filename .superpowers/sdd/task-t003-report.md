# T-003 report

## Status

- Task: T-003 採点・51分類・結果モデル
- Feature IDs: F-005, F-006, F-008, F-016
- Date: 2026-07-23
- Status: complete after independent-review remediation
- Initial commit: `5a14c19274cdb1fead18e420b28e3205425f75b0`
- Review-fix commit: the commit containing this tracked report

## RED → GREEN

- RED: `app/tests/scoring-title-contract.test.js` was added before production modules. The first execution failed with `ERR_MODULE_NOT_FOUND` for `app/js/domain/scoring.js`, confirming the public seam had no implementation.
- GREEN: Added pure scoring, title-profile definition/validation, title classification, and result-model composition modules. The public seam test file now passes 9/9.

## Implemented public seams

- `scoreDiagnostic({ questionDefinitions, answers, questionCount })` returns five immutable `FactorResult` records and rejects incomplete, invalid, or unsupported input.
- `TitleProfileDefinitions` exposes 51 deeply immutable profiles; `validateTitleProfileDefinitions` rejects duplicate, missing, and unknown combinations.
- `classifyTitle({ factorResults, questionCount, titleProfiles })` implements `title-rule-v1`, deterministic tie breaking, and 20/50 boundary flags.
- `composeResultModel({ factors, classification, renderedTexts })` preserves all five factors and caller-provided rendered text records without retaining raw answers or producing prose.

## Verification

- `node --test app/tests/scoring-title-contract.test.js`: 9 passed, 0 failed.
- `npm.cmd test`: 75 passed, 0 failed.
- `npm.cmd run check`: passed (12 JavaScript files, one canonical runtime version).
- `git diff --check`: passed.

## Explicit exclusions

- Q-006: no production result prose, evidence claims, or placeholder prose presented as final.
- Q-012: no cat imagery, art direction, or asset manifest; only stable 1:1 character IDs.
- No changes under `prototype-big-five/`.

## Independent review remediation

- RED: rational display scores 1.9/2.3/3.3/4.1 produced 22/32/57/77 instead of half-up 23/33/58/78.
- GREEN: display scores now round directly from `keyedSum/itemCount`; no fields were added to `FactorResult`.
- RED: mathematically equal salience at 1.7 and 4.3 was ordered by floating-point noise before support count.
- GREEN: keyed-answer integer salience advances true ties to support, integer variance numerator, then `factor-order-v1`.
- RED: exact 50-item 0.1 boundary/tie distances were excluded by binary representation.
- GREEN: 50-item 0.1 and 20-item 0.25 inclusive boundaries are covered at factor and second/third-rank seams.
- RED: result-text module was absent (`ERR_MODULE_NOT_FOUND`), and result composition accepted raw-answer/unknown-field contamination.
- GREEN: added exact-schema versioned result-text validation and deterministic selection; preview suppression, evidence/ID checks, strict result composition, deep copying, and uniform result-model errors are covered.
- GREEN: scoring rejects null questions, inherited answer maps, and non-exact own key sets with `SCORING_INPUT_INVALID`.
- GREEN: title rule version reads `appMeta`; factor order is shared from versioned `FactorOrderDefinition`.

## Review verification

- `node --test app/tests/scoring-title-contract.test.js`: 15 passed, 0 failed.
- `npm.cmd test`: 81 passed, 0 failed.
- `npm.cmd run check`: passed (15 JavaScript files, one canonical runtime version).
- `git diff --check`: passed.

## P2 re-review remediation

- RED: `rawMean = 4.000000000005` passed 50-item classification although no 10 keyed answers can produce it.
- GREEN: classification reconstructs `keyedSum` and requires strict identity with `keyedSum / itemCount`; no epsilon is used.
- RED: result composition accepted BoundaryFlags with 50/0.25 and 20/0.1 pairs.
- GREEN: only 50/0.1 and 20/0.25 threshold pairs are valid.
- RED: fixed-text definitions accepted contradictory mode/questionCount and preview-targeted definitions disabled for preview.
- GREEN: preview20/20 and detail50/50 consistency and preview reachability are enforced; generic detail-capable definitions may remain preview-disabled.
- RED: selector null and unknown-field inputs escaped the stable definition error contract.
- GREEN: selector validates an exact `{ definitions, version, context }` record before destructuring.
- RED: diagnostic definition and validator retained separate factor-order literals.
- GREEN: diagnostic definitions, validation, scoring, classification, and title profiles share `FactorOrderDefinition.factorIds`; existing T-002 contracts remain green.

## P2 verification

- `node --test app/tests/scoring-title-contract.test.js`: 18 passed, 0 failed.
- `node --test app/tests/definition-validator.test.js`: 13 passed, 0 failed.
- `npm.cmd test`: 84 passed, 0 failed.
- `npm.cmd run check`: passed (15 JavaScript files, one canonical runtime version).
- `git diff --check`: passed.

## Final P2 remediation

- RED: a 50-item `rawMean = 4.000000000005` remained inside the former epsilon and reached title classification.
- GREEN: reachable raw means use strict rational reconstruction; scored 1.7, 3.3, and 4.3 remain valid.
- RED: a tiny mutation of a scored variance or salience still passed the FactorResult validator.
- GREEN: scoring generates variance from an integer numerator, and validation strictly reconstructs variance and salience without changing the FactorResult schema.
- GREEN: title ranking uses integer `abs(keyedSum - 3 * itemCount)`, variance uses its integer numerator, and both band-boundary and second/third near-tie flags use a one-unit inclusive integer threshold for 20 and 50 items.

## Final P2 verification

- `node --test app/tests/scoring-title-contract.test.js app/tests/definition-validator.test.js`: 32 passed, 0 failed.
- `npm.cmd test`: 85 passed, 0 failed.
- `npm.cmd run check`: passed (15 JavaScript files, one canonical runtime version).
- `git diff --check`: passed.

## Residual P2 remediation

- RED: a 50-item middle-band record with `rawMean = 3`, `variance = 0.01`, and support 0 passed independent rational checks although no ten 1-to-5 answers can jointly produce those statistics.
- GREEN: validation caches all reachable `(keyedSum, varianceNumerator, directionalSupportCount)` tuples for item counts 4 and 10 and requires a joint tuple match.
- GREEN: when question count is absent and a mean fits both item counts, every candidate is checked; a valid 10-item-only statistics tuple is not rejected by the 4-item candidate.
- GREEN: classification fixtures now derive statistics from concrete answer-count combinations, removing previously impossible hand-authored support/variance pairs while preserving each rule assertion.

## Residual P2 verification

- `node --test app/tests/scoring-title-contract.test.js app/tests/definition-validator.test.js`: 33 passed, 0 failed.
- `npm.cmd test`: 86 passed, 0 failed.
- `npm.cmd run check`: passed (15 JavaScript files, one canonical runtime version).
- `git diff --check`: passed.
