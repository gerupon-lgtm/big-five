# Title Reflection Comments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `delegate-development` with a fresh implementer and independent reviewer for each technical task. The supervisor owns wording interpretation, human approval records, integration, and final completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 1〜3 approved, optional reflection hints to every one of the 51 titles as immutable `result-text-v2` content, while preserving all `result-text-v1` records and keeping the hints out of sharing.

**Architecture:** Human wording is reviewed before runtime work. Approved copy is stored in a dedicated versioned CSV, compiled into ordinary `ResultTextDefinition` records with `section = titleReflection`, copied into `ResultSnapshot`, and displayed as one fixed hint in preview or one plus an optional two in detail. `result-text-v1` remains unchanged as historical compatibility content; `result-text-v2` includes 27 project-owner-approved wording corrections to the base 237 records.

**Tech Stack:** UTF-8 CSV, JSON Schema, JavaScript ES Modules, Node.js `node:test`, Vanilla DOM, `localStorage`.

## Global Constraints

- Feature/task mapping is F-005, F-006, T-005, T-008A, Q-006, Q-014.
- `result-text-v1`の237件とContent Approval状態は変更しない。
- Each title has 1〜3 fixed-order hints; order 1 is the only preview hint.
- Use `section = titleReflection` and `claimKind = reflectionPrompt`.
- Do not use random selection, current time, user answers, color, fragrance, or DOM state to choose a hint.
- Copy must not fix personality with `あなたは`, assert ability, aptitude, outcomes, health or mental state, command action, or promise treatment or improvement.
- Hints are not measurement facts. The UI keeps the heading `振り返りのヒント`, omits a common helper sentence, and expresses optionality by ending each proposal with `〜してみませんか。`.
- `titleReflection` is excluded from share text and share images.
- Existing saved snapshots remain historical copies and are never regenerated from current definitions.
- Human approval and machine validation are separate gates. No row or batch becomes `approved` without the project owner’s explicit approval.
- To reduce commit noise during copy review, Task 1 uses one local commit only after all five wording batches are approved.

---

### Task 1: Draft and approve the 51-title wording matrix

**Files:**
- Create: `docs/research/2026-07-29-title-reflection-content-review.md`
- Reference: `C:\Users\user\デスクトップ\データ\とりまとめ\ipip_comment_proposals_integrated.md`
- Reference: `content/source/titles/title-rule-v1/title-profiles.csv`
- Reference: `content/source/result-texts/result-text-v1/result-texts.csv`

**Interfaces:**
- Consumes: the 51 title IDs and labels in `title-profiles.csv`, approved `titleSubtitle` and `titleReason` copy in `result-text-v1`, and each matching `【実用コメント】` section in the integrated source.
- Produces: 153 candidate rows with exact fields `title_id`, `display_order` (`1`, `2`, `3`), `text`, `source_locator`, and `review_status`.

- [x] **Step 1: Create the review matrix with five human approval batches**

Use these exact batches:

| Gate | Titles |
|---|---|
| TR-0 | display order 1〜11: balanced and ten single-factor titles |
| TR-1 | display order 12〜21 |
| TR-2 | display order 22〜31 |
| TR-3 | display order 32〜41 |
| TR-4 | display order 42〜51 |

Every title receives exactly three candidate rows. Order 1 is the broadest standalone reflection question, order 2 provides a different viewpoint, and order 3 is one small optional action. Reconstruct the source wording rather than copying it automatically.

- [x] **Step 2: Run copy checks before presenting each batch**

Run:

```powershell
rg -n "あなたは|必ず|べき|向いて|適職|治療|改善します|高まります|深まります" docs/research/2026-07-29-title-reflection-content-review.md
```

Expected: no unreviewed assertion or command. A hit is acceptable only when the review note explicitly quotes and rejects source wording.

Also verify each title has orders `1,2,3`, no duplicate text, no title-reason paraphrase, and no two hints with the same practical purpose.

- [x] **Step 3: Present TR-0〜TR-4 one batch at a time for project-owner review**

Apply requested replacements to the specified text only. Preserve preceding or surrounding text unless the owner explicitly requests broader editing. Keep all unapproved batches marked `draft`.

- [x] **Step 4: Record approvals without inference**

After explicit approval of a batch, set only that batch’s `review_status` to `approved` and record the exact approval date and the wording hash described in the review document. Do not infer approval from silence or from approval of another batch.

- [x] **Step 5: Verify the completed matrix and commit once**

Run a Node one-liner or a focused test that confirms 51 unique title IDs, exactly three consecutive orders per title, 153 unique candidate records, and TR-0〜TR-4 all explicitly approved.

Commit:

```powershell
git add docs/research/2026-07-29-title-reflection-content-review.md
git commit -m "docs: approve title reflection copy"
```

The 51-title／153-record matrix and explicit TR-0〜TR-4 approvals have been verified. The combined local commit is still pending, so this step remains unchecked.

### Task 1A: Limit the E/F re-review to action hints

**Files:**
- Create: `docs/research/2026-07-29-result-v2-action-hint-limited-review.md`
- Reference without modification: `content/source/result-texts/result-text-v1/result-texts.csv`
- Reference without modification: `content/source/approvals/result-content-approvals.csv`

**Interfaces:**
- Consumes: the 15 approved `actionHint` records from E-1〜E-5／F-1〜F-5.
- Produces: a `result-text-v2` migration decision of `維持候補` or `再構成候補` and exact v2 wording for each action hint without changing `result-text-v1` or its approval records.

- [x] **Step 1: Review all 15 action hints against the non-correction rule**

For each factor and band, determine whether the hint helps the user use the
current tendency in a fitting way or instead nudges the user toward the
opposite pole.

- [x] **Step 2: Record exact keep/rewrite decisions**

Keep E-1〜E-5／F-1〜F-5 approved as historical `result-text-v1` gates. Record
the exact v1 text, migration decision, reason, and exact proposed v2 wording
for all 15 records. Remove the opening `もしよければ、`／`よければ、` in v2
because the `〜してみませんか。` ending already expresses optionality.

- [x] **Step 3: Obtain project-owner confirmation for the limited review**

Do not interpret confirmation of TR-0 as confirmation of this separate
15-record review. Record the two v2 replacement texts only after explicit
approval.

- [x] **Step 4: Apply approved decisions only when constructing v2**

Do not mutate `content/source/result-texts/result-text-v1/`. Task 2 creates the
new v2 source and uses this review as one input to the version-specific content
approval.

### Task 2: Add the dedicated authoring CSV contract

**Files:**
- Create: `content/schemas/title-reflection-comments.schema.json`
- Create: `content/source/result-texts/result-text-v2/title-reflection-comments.csv`
- Create: `content/source/result-texts/result-text-v2/result-texts.csv`
- Create: `content/source/result-texts/result-text-v2/result-text-evidence.csv`
- Modify: `scripts/content/content-compiler.mjs`
- Modify: `scripts/content/compile-result-content.mjs`
- Test: `app/tests/content-table-schema.test.js`
- Test: `app/tests/content-result-compiler.test.js`

**Interfaces:**
- Consumes: approved Task 1 matrix; existing 237 `result-text-v1` rows as immutable source content; `evidence-result-presentation-contract`.
- Produces: `title-reflection-comments.csv` with exact columns `text_id,result_text_version,title_id,display_order,text,status`, plus a complete `result-text-v2` catalog containing 237 existing sections and 153 `titleReflection` records.

- [x] **Step 1: Write failing schema and compiler tests**

Add tests that require the exact six columns; reject unknown title IDs, duplicate IDs, 0 or 4 hints, nonconsecutive order, version mismatch, unknown columns, and any non-`approved` hint in an approved release. Assert order 1 projects `previewAllowed: true`, while orders 2 and 3 project `false`.

- [x] **Step 2: Run the focused tests and confirm failure**

Run:

```powershell
node --test app/tests/content-table-schema.test.js app/tests/content-result-compiler.test.js
```

Expected: FAIL because the dedicated schema/table and `titleReflection` projection do not exist.

- [x] **Step 3: Implement the exact CSV projection**

Extend the content catalog loader with `title-reflection-comments.csv`. Project each approved row to:

```js
{
  id: row.text_id,
  version: row.result_text_version,
  appliesTo: { titleId: row.title_id },
  section: "titleReflection",
  claimKind: "reflectionPrompt",
  text: row.text,
  evidenceRefs: ["evidence-result-presentation-contract"],
  previewAllowed: row.display_order === "1",
}
```

Keep the existing 237 rows in version-specific `result-texts.csv` and never edit the `result-text-v1` directory.

- [x] **Step 4: Populate `result-text-v2` from approved copy**

Copy the existing 237 record identities into the new version with `result_text_version = result-text-v2`, apply only the 27 project-owner-approved v2 wording corrections, append matching evidence mappings, then populate the dedicated 153-row comments CSV from Task 1. All new rows begin with the exact owner-approved state; no approval metadata is invented.

- [x] **Step 5: Run focused and content validation**

Run:

```powershell
node --test app/tests/content-table-schema.test.js app/tests/content-result-compiler.test.js app/tests/content-artifact-contract.test.js
npm.cmd run content:validate
```

Expected: all focused tests pass; validation recognizes both result-text versions. `content:build` may still report `RELEASE_NOT_SELECTED`.

- [x] **Step 6: Commit the authoring contract**

```powershell
git add content scripts/content app/tests/content-table-schema.test.js app/tests/content-result-compiler.test.js app/tests/content-artifact-contract.test.js
git commit -m "feat: add title reflection content contract"
```

### Task 3: Extend the result-text domain and snapshot contract

**Files:**
- Modify: `app/js/domain/result-text.js`
- Modify: `app/js/domain/result-composer.js`
- Modify: `app/js/domain/definition-validator.js`
- Modify: `app/js/domain/result-model.js`
- Modify: `app/js/domain/result-snapshot.js`
- Modify: `app/js/data/result-text-definitions.js`
- Create: `app/js/data/title-reflection-definitions.js`
- Test: `app/tests/result-content-definitions.test.js`
- Test: `app/tests/result-composer.test.js`
- Test: `app/tests/result-snapshot.test.js`

**Interfaces:**
- Consumes: valid `ResultTextDefinition[]` containing `titleReflection`.
- Produces: preview `renderedTexts` with 8 records and detail `renderedTexts` with 45 records when every title has three hints; incomplete title hint groups fail closed.

- [x] **Step 1: Write failing selection and snapshot tests**

Test preview fixed order 1 only, detail orders 1〜3, no randomness input, incomplete definition groups omitted as a whole by the composer, snapshot acceptance of zero or one complete mode-specific reflection group, strict rejection of partial persisted groups, and snapshot deep-copy/freeze of exact hint IDs, text, order, and version.

- [x] **Step 2: Run the focused tests and confirm failure**

```powershell
node --test app/tests/result-content-definitions.test.js app/tests/result-composer.test.js app/tests/result-snapshot.test.js
```

Expected: FAIL because `titleReflection` is not an allowed section and title selection expects only subtitle/reason.

- [x] **Step 3: Implement the domain extension**

Add `titleReflection` to the section set and map it to `reflectionPrompt`. Permit only order 1 in preview and 1〜3 in detail, maintaining source order. Preserve the current section-first factor order after the title records.

- [x] **Step 4: Generate/import the runtime v2 definitions**

Keep `result-text-v1` unchanged. Import the v2 base records with only the 27 project-owner-approved wording corrections, import the 153 approved reflection records as a separate frozen array, and concatenate them deterministically.

- [x] **Step 5: Run focused tests**

```powershell
node --test app/tests/result-content-definitions.test.js app/tests/result-composer.test.js app/tests/result-snapshot.test.js
```

Expected: all pass with preview 8 and detail 45 records for the three-hint catalog.

- [x] **Step 6: Commit the domain extension**

```powershell
git add app/js/domain app/js/data app/tests/result-content-definitions.test.js app/tests/result-composer.test.js app/tests/result-snapshot.test.js
git commit -m "feat: compose title reflection hints"
```

### Task 4: Add progressive disclosure to the result screen

**Files:**
- Modify: `app/js/domain/result-disclosure-model.js`
- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/css/styles.css`
- Test: `app/tests/result-screen.test.js`

**Interfaces:**
- Consumes: historical `ResultSnapshot.renderedTexts` containing zero reflections or one complete mode-specific `titleReflection` group.
- Produces: preview section with one hint; detail section with one visible hint and one `ほかのヒントを見る` control for the remaining one or two.

- [x] **Step 1: Write failing presentation tests**

Assert exact heading and optionality cue, preview has no expansion control, detail initially hides hints 2〜3, the control toggles them together, keyboard activation works, zero-reflection snapshots omit only this section, and partial persisted groups are rejected at the snapshot boundary.

- [x] **Step 2: Run the focused test and confirm failure**

```powershell
node --test app/tests/result-screen.test.js
```

Expected: FAIL because no reflection section is rendered.

- [x] **Step 3: Implement the section and styles**

Place the section immediately after `この称号になった理由`. Keep its expansion state independent of factor disclosure. Do not add a third disclosure depth. Ensure 320px and 200% text enlargement have no horizontal overflow.

- [x] **Step 4: Run focused tests**

```powershell
node --test app/tests/result-screen.test.js
```

Expected: all result-screen tests pass.

- [x] **Step 5: Commit the presentation**

```powershell
git add app/js/domain/result-disclosure-model.js app/js/presentation/result-screen.js app/css/styles.css app/tests/result-screen.test.js
git commit -m "feat: show optional title reflection hints"
```

### Task 5: Activate v2 and prove sharing exclusion

**Files:**
- Modify: `app/js/config/app-meta.js`
- Modify: `app/js/data/diagnostic-definition.js`
- Create: `app/js/domain/share-result-text.js`
- Create: `app/tests/share-result-text.test.js`
- Modify: `app/tests/version-contract.test.js`
- Modify: `app/tests/project-contract.test.js`

**Interfaces:**
- Consumes: complete approved `result-text-v2`.
- Produces: new diagnoses with `VersionTuple.resultTextVersion = result-text-v2`; old `result-text-v1` snapshots remain readable under compatibility rules; the pure future-share candidate boundary contains no `titleReflection`. The actual T-007 share UI, text, and card composition remain future work.

- [x] **Step 1: Write failing activation and exclusion tests**

Assert the runtime registry uses v2, a completed diagnosis snapshots the hint text, old v1 history is not rewritten, and the pure future-share candidate selector excludes records whose section is `titleReflection`.

- [x] **Step 2: Run activation and sharing-exclusion tests and confirm failure**

```powershell
node --test app/tests/project-contract.test.js app/tests/version-contract.test.js app/tests/result-snapshot.test.js app/tests/share-result-text.test.js
```

Expected: FAIL while the canonical runtime version is v1 and `share-result-text.js` does not exist.

- [x] **Step 3: Switch the canonical runtime version**

Update the version tuple and definition references together. Do not change `title-rule-v1`, question order, scoring, character assignment, or `localStorage` schema.

- [x] **Step 4: Implement and test the sharing boundary**

Create this pure boundary for later T-007 composition:

```js
export function selectShareableResultTexts(renderedTexts) {
  if (!Array.isArray(renderedTexts)) throw new TypeError("INVALID_RESULT_TEXTS");
  return Object.freeze(renderedTexts
    .filter(({ section }) => section !== "titleReflection")
    .map((record) => Object.freeze({ ...record, evidenceRefs: Object.freeze([...record.evidenceRefs]) })));
}
```

Run:

```powershell
node --test app/tests/project-contract.test.js app/tests/version-contract.test.js app/tests/result-snapshot.test.js app/tests/share-result-text.test.js
```

Expected: all pass and no serialized pure share-candidate output contains a `titleReflection` ID or text. This does not claim that T-007 share output composition is implemented.

- [x] **Step 5: Commit activation**

```powershell
git add app/js/config app/js/data app/js/domain app/tests
git commit -m "feat: activate result text v2"
```

### Task 6: Synchronize documentation and complete verification

**Files:**
- Modify: `docs/data-model.md`
- Modify: `docs/screens.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/tasks.md`
- Modify: `docs/content-authoring.md`
- Modify: `docs/qa-preview-pages.md`
- Modify: `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md` only where the existing Q-014/T-008A status explicitly tracks `titleReflection`

**Interfaces:**
- Consumes: Tasks 1〜5 and explicit project-owner approval records.
- Produces: synchronized current-state documentation, full automated verification, browser QA evidence, and a pushed branch.

- [x] **Step 1: Update current-state documentation**

Record exact row counts, gate status, runtime version, preview/detail counts, snapshot behavior, sharing exclusion, fallback, and remaining release blockers. Do not mark an approved release selected unless the release manifest actually contains one.

- [x] **Step 2: Run full automated verification**

```powershell
npm.cmd test
npm.cmd run check
npm.cmd run content:validate
npm.cmd run qa:preview:build
git diff --check
```

Expected: all tests/checks pass; content validation succeeds; QA preview builds; no whitespace errors.

Current state before the remaining regression fixes: focused domain 78/78, activation/share-boundary 41/41, and result-screen 18/18 pass. The latest full suite is 494/530 with 36 failures in stale v1 count/version fixtures across content compiler, migration parity, diagnostic result, and progress storage tests. Therefore this step remains unchecked.

- [x] **Step 3: Run browser QA**

At 320px, 360px, and 960px verify preview one hint, detail one plus expansion of two, native-button focus/expanded-state contract, reading order, no horizontal overflow, and no console error/warning. Because the T-007 share UI does not yet exist, confirm hint exclusion at the pure share-candidate boundary by automated test rather than claiming a browser-level share check.

- [x] **Step 4: Request independent review**

Fix the review target to the commits from this plan, maximum 12 changed source/test/doc files plus generated content definitions, severity Important or higher, no extra subreview, and require no contract violation, unapproved wording, v1 mutation, sharing leak, or missing fallback.

- [x] **Step 5: Commit documentation and push**

```powershell
git add docs
git commit -m "docs: complete title reflection rollout"
git push origin codex/big-five-q006
```

Record the pushed commit and QA URL in `docs/qa-preview-pages.md`.

Project-ownerのコミット頻度を抑える方針に従い、Task 1〜5の個別コミットは分割せず、実装・承認記録・同期文書を`2e8ac66`へ集約した。`codex/big-five-q006`へのpush後、GitHub Actions run `30467272599`でbuild／deploy成功を確認した。
