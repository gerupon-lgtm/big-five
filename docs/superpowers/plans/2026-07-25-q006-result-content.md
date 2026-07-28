# Q-006 Result Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `result-text-v1`として、根拠へ追跡できる20問簡易プレビュー・50問詳細結果、5因子×high/middle/low、51称号の中立副題と称号理由を、決定的に選択・保存できる版付き静的定義として完成させる。

**Architecture:** 内容は`data`、検証・選択・合成はDOMやブラウザAPIへ依存しない`domain`へ置き、`presentation -> domain <- data`の向きを守る。称号文は`titleId`、因子文は`mode/questionCount/factorId/band`で選び、表示済み文字列・順序・版・根拠IDを`ResultSnapshot.renderedTexts`へ複製して後日の文章更新から隔離する。

**Tech Stack:** HTML / CSS / JavaScript ES Modules、Node.js `node:test`、ブラウザ`localStorage`、既存の`appMeta.diagnosticVersions.resultTextVersion = "result-text-v1"`。

## Global Constraints

- 正典は`docs/requirements/2026-07-20-big-five-self-understanding-requirements.md`、`docs/data-model.md`、`docs/screens.md`、`docs/processing-design.md`、`docs/title-character-catalog.md`、`docs/superpowers/specs/2026-07-25-t005-result-character-presentation-design.md`とする。
- 20問は「簡易プレビュー」であり、日本語版Mini-IPIPとして妥当性検証済みと表示しない。
- 20問で`previewAllowed = false`の詳細節を選択しない。50問は全5因子を省略しない。
- 高傾向を能力保証、低傾向を能力不足・欠点・反対側の強み保証として書かない。
- 測定上の文は客観的な観察、仕事・人間関係・ストレス・行動は柔らかな振り返り・ヒントとして分離する。
- 称号は`docs/title-character-catalog.md`の`titleId`と称号を無断で入れ替えない。「本アプリ独自のプロフィール表現」「心理学上の正式タイプではない」を維持する。
- 固定文章を実行時生成AIで生成しない。文章、根拠、選択条件、版を静的定義へ明記する。
- `FactorResult.rawMean`と`band`を使用し、表示整数、生回答、猫の外見、色、香りを文章選択条件にしない。
- `ResultSnapshot`へ生回答を保存しない。診断時に表示した文章を順序・版ごと保存し、現行定義から再生成しない。
- 仕事・対人・ストレス文を尺度から直接判定した事実として断定しない。
- 1機能の変更はT-005、F-002、F-005、F-006、F-016、Q-006との対応を文書へ記録する。

---

## File Structure

### Create

- `docs/research/2026-07-25-q006-result-content-evidence.md` — 人向け根拠台帳と文章ルール対応表。
- `app/js/data/result-evidence-definitions.js` — 実行時に参照する版付き根拠ID。
- `app/js/domain/result-evidence.js` — 根拠定義のexact-schema検証。
- `app/js/data/title-result-text-definitions.js` — 51称号×中立副題・称号理由。
- `app/js/data/factor-result-text-definitions.js` — 5因子×3band×20/50の固定文章。
- `app/js/data/result-text-definitions.js` — 称号文・因子文の固定順集約。
- `app/js/domain/result-composer.js` — 文面選択、正規順序、`RenderedResultText`生成。
- `app/js/domain/result-snapshot.js` — 診断時文章の不変保存。
- `app/tests/result-evidence-definitions.test.js`
- `app/tests/result-content-definitions.test.js`
- `app/tests/result-composer.test.js`
- `app/tests/result-snapshot.test.js`
- `app/tests/fixtures/q006-title-catalog.fixture.js`

### Modify

- `app/js/data/title-profile-definitions.js` — `label`を承認済み51称号へ置換。
- `app/js/domain/result-text.js` — section、`claimKind`、根拠参照の検証を拡張。
- `app/js/domain/result-model.js` — 新sectionを受理し、文章完全性を検証。
- `app/js/domain/definition-validator.js` — 版一致、根拠参照、51称号、5×3bandの横断検証。
- `app/tests/definition-validator.test.js`
- `app/tests/project-contract.test.js`
- `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md`
- `docs/data-model.md`
- `docs/screens.md`
- `docs/processing-design.md`
- `docs/superpowers/specs/2026-07-25-t005-result-character-presentation-design.md`
- `docs/tasks.md`

## Stable Interfaces

```js
// app/js/data/result-evidence-definitions.js
export const ResultEvidenceDefinitions;

// ResultEvidenceDefinition
{
  evidenceId: string,
  version: "result-evidence-v1",
  sourceType: "primary" | "internal-contract",
  sourceLabel: string,
  locator: string,
  supportedClaims: string[],
}
```

```js
// ResultTextDefinition
{
  id: string,
  version: "result-text-v1",
  appliesTo: {
    mode?: "preview20" | "detail50",
    questionCount?: 20 | 50,
    factorId?: FactorId,
    band?: "low" | "middle" | "high",
    titleId?: string,
  },
  section:
    | "titleSubtitle" | "titleReason" | "observation"
    | "strength" | "tradeoff" | "work" | "relationship"
    | "stress" | "question" | "action",
  claimKind:
    | "scaleObservation" | "entertainmentReason"
    | "reflectionPrompt" | "actionHint",
  text: string,
  evidenceRefs: string[],
  previewAllowed: boolean,
}
```

```js
validateResultEvidenceDefinitions(definitions)
validateResultTextDefinitions(definitions)
validateResultContentDefinitions({
  evidenceDefinitions,
  textDefinitions,
  titleProfiles,
  resultTextVersion,
})

composeResultTexts({
  definitions,
  version,
  mode,
  questionCount,
  factors,
  titleId,
}) // ReadonlyArray<RenderedResultText>

createResultSnapshot({
  resultId,
  completedAt,
  questionCount,
  mode,
  versionTuple,
  resultModel,
  characterAssetVersion,
  selectedPaletteId,
  cardTemplateVersion,
}) // ResultSnapshot
```

## Content Approval Gates

| Gate | Batch | Acceptance |
|---|---|---|
| E-0 | 共通資料・20/50限界・非診断注意 | source label、locator、支持できる主張範囲をユーザー承認 |
| E-1〜E-5 | 知性・想像力、勤勉性、外向性、協調性、情緒安定性を1因子ずつ | high/middle/lowの語彙と根拠IDを承認 |
| T-0 | balanced＋single 10件 | 中立副題・称号理由・カタログ一致を11件同時比較 |
| T-1〜T-4 | pairを固定順10件ずつ | 各10件で能力・善悪・優越・低傾向否定がないことを承認 |
| F-1〜F-5 | 1因子×3band×20/50 | 20問の短さ、50問の8節、根拠対応を因子単位で承認 |
| X-1 | 20問全体 | 仮称号、5観察文、限界、詳細節抑制を確認 |
| X-2 | 50問全体 | 称号2節＋5因子×8節、表示順、問いかけ調を確認 |

---

### Task 1: Establish the Q-006 evidence ledger

**Files:**
- Create: `docs/research/2026-07-25-q006-result-content-evidence.md`
- Create: `app/js/data/result-evidence-definitions.js`
- Test: `app/tests/result-evidence-definitions.test.js`

**Interfaces:**
- Consumes: `DiagnosticDefinition.source`、要件8.3、8.3.1、T-005設計2.2。
- Produces: `ResultEvidenceDefinitions: ReadonlyArray<ResultEvidenceDefinition>`。

- [ ] **Step 1: Write the failing authority test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { ResultEvidenceDefinitions } from "../js/data/result-evidence-definitions.js";

test("Q-006 evidence ledger exposes the six fixed authority entries", () => {
  assert.deepEqual(
    ResultEvidenceDefinitions.map(({ evidenceId }) => evidenceId),
    [
      "evidence-ipip-japanese-markers",
      "evidence-ipip-50-item-scale",
      "evidence-mini-ipip-selection",
      "evidence-ipip-permission",
      "evidence-title-rule-v1",
      "evidence-result-presentation-contract",
    ],
  );
  assert.ok(ResultEvidenceDefinitions.every(({ version }) => version === "result-evidence-v1"));
});
```

- [ ] **Step 2: Run the test and confirm the missing module**

Run: `node --test app/tests/result-evidence-definitions.test.js`  
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `result-evidence-definitions.js`.

- [ ] **Step 3: Create the six-entry static ledger**

Use these exact IDs and locators:

```js
export const ResultEvidenceDefinitions = Object.freeze([
  Object.freeze({
    evidenceId: "evidence-ipip-japanese-markers",
    version: "result-evidence-v1",
    sourceType: "primary",
    sourceLabel: "IPIP Japanese Translation of the Lexical Big-Five Factor Markers",
    locator: "https://ipip.ori.org/JapaneseBig-FiveFactorMarkers.htm",
    supportedClaims: Object.freeze(["factor-item-meaning", "factor-pole-observation"]),
  }),
  Object.freeze({
    evidenceId: "evidence-ipip-50-item-scale",
    version: "result-evidence-v1",
    sourceType: "primary",
    sourceLabel: "IPIP Japanese 50-item scale",
    locator: "https://www.ipip.ori.org/New_IPIP-50-item-scale.htm",
    supportedClaims: Object.freeze(["factor-item-meaning", "detail50-observation"]),
  }),
  Object.freeze({
    evidenceId: "evidence-mini-ipip-selection",
    version: "result-evidence-v1",
    sourceType: "primary",
    sourceLabel: "Donnellan et al. (2006), Mini-IPIP Appendix A",
    locator: "https://doi.org/10.1037/1040-3590.18.2.192",
    supportedClaims: Object.freeze(["preview20-item-selection"]),
  }),
  Object.freeze({
    evidenceId: "evidence-ipip-permission",
    version: "result-evidence-v1",
    sourceType: "primary",
    sourceLabel: "IPIP permission statement",
    locator: "https://ipip.ori.org/newPermission.htm",
    supportedClaims: Object.freeze(["public-domain-use"]),
  }),
  Object.freeze({
    evidenceId: "evidence-title-rule-v1",
    version: "result-evidence-v1",
    sourceType: "internal-contract",
    sourceLabel: "Big Five自己理解支援ツール要件 8.3.1",
    locator: "docs/requirements/2026-07-20-big-five-self-understanding-requirements.md#831-称号キャラクター判定ルール",
    supportedClaims: Object.freeze(["title-selection", "band-boundaries", "preview-limit"]),
  }),
  Object.freeze({
    evidenceId: "evidence-result-presentation-contract",
    version: "result-evidence-v1",
    sourceType: "internal-contract",
    sourceLabel: "T-005結果・キャラクター・演出設計 2.2",
    locator: "docs/superpowers/specs/2026-07-25-t005-result-character-presentation-design.md#22-文面",
    supportedClaims: Object.freeze(["reflection-prompt", "action-hint", "non-diagnostic-copy"]),
  }),
]);
```

- [ ] **Step 4: Write the human-readable claim matrix and record gates E-0〜E-5 accurately**

In `docs/research/2026-07-25-q006-result-content-evidence.md`, record one row per evidence ID with source, locator, supported claim, unsupported claim, review status, and approval date when actually approved. For each factor, list the exact official items used to justify high/middle/low observation wording. Mark work, relationship, stress, question, and action sections as reflection prompts rather than measured facts. Record already approved wording decisions from gates E-0〜E-5 and mark every unreviewed factor wording gate `draft`; never invent an approval date. Task 4 moves a factor gate to `approved` only after its wording batch has been reviewed under the Content Approval Gates.

- [ ] **Step 5: Run the authority test**

Run: `node --test app/tests/result-evidence-definitions.test.js`  
Expected: PASS, 1 test.

- [ ] **Step 6: Commit only the evidence ledger files**

```bash
git add docs/research/2026-07-25-q006-result-content-evidence.md app/js/data/result-evidence-definitions.js app/tests/result-evidence-definitions.test.js
git commit -m "docs: add Q-006 result evidence ledger"
```

---

### Task 2: Define and validate result-content schemas

**Files:**
- Create: `app/js/domain/result-evidence.js`
- Modify: `app/js/domain/result-text.js`
- Modify: `app/js/domain/result-model.js`
- Modify: `app/js/domain/definition-validator.js`
- Test: `app/tests/result-content-definitions.test.js`
- Test: `app/tests/definition-validator.test.js`
- Test: `app/tests/scoring-title-contract.test.js`

**Interfaces:**
- Consumes: `ResultEvidenceDefinitions` from Task 1 and `FACTOR_ORDER`.
- Produces: `validateResultEvidenceDefinitions`、`validateResultTextDefinitions`、`validateResultContentDefinitions`。

- [ ] **Step 1: Write failing exact-schema and reference tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { validateResultEvidenceDefinitions } from "../js/domain/result-evidence.js";
import { validateResultTextDefinitions } from "../js/domain/result-text.js";

const evidence = {
  evidenceId: "evidence-title-rule-v1",
  version: "result-evidence-v1",
  sourceType: "internal-contract",
  sourceLabel: "Title rule",
  locator: "docs/requirements/2026-07-20-big-five-self-understanding-requirements.md#831-称号キャラクター判定ルール",
  supportedClaims: ["title-selection"],
};

const text = {
  id: "title-balanced-subtitle",
  version: "result-text-v1",
  appliesTo: { titleId: "title-balanced" },
  section: "titleSubtitle",
  claimKind: "entertainmentReason",
  text: "5因子がいずれも中間域にあるプロフィール",
  evidenceRefs: ["evidence-title-rule-v1"],
  previewAllowed: true,
};

test("Q-006 schemas accept exact evidence and result text", () => {
  assert.equal(validateResultEvidenceDefinitions([evidence]).length, 1);
  assert.equal(validateResultTextDefinitions([text]).length, 1);
});

test("Q-006 schemas reject unknown fields and unsupported claim kinds", () => {
  assert.throws(
    () => validateResultEvidenceDefinitions([{ ...evidence, extra: true }]),
    /RESULT_EVIDENCE_DEFINITION_INVALID/,
  );
  assert.throws(
    () => validateResultTextDefinitions([{ ...text, claimKind: "abilityClaim" }]),
    /RESULT_TEXT_DEFINITION_INVALID/,
  );
});
```

- [ ] **Step 2: Run the focused tests**

Run: `node --test app/tests/result-content-definitions.test.js`  
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `result-evidence.js` or rejection of the new text fields.

- [ ] **Step 3: Implement exact evidence validation**

In `app/js/domain/result-evidence.js`, require exactly:

```js
const FIELDS = [
  "evidenceId", "version", "sourceType",
  "sourceLabel", "locator", "supportedClaims",
];

export function validateResultEvidenceDefinitions(definitions) {
  if (!Array.isArray(definitions) || !definitions.every((value) =>
    value && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).length === FIELDS.length &&
    FIELDS.every((field) => Object.hasOwn(value, field)) &&
    typeof value.evidenceId === "string" && value.evidenceId.length > 0 &&
    value.version === "result-evidence-v1" &&
    ["primary", "internal-contract"].includes(value.sourceType) &&
    typeof value.sourceLabel === "string" && value.sourceLabel.length > 0 &&
    typeof value.locator === "string" && value.locator.length > 0 &&
    Array.isArray(value.supportedClaims) && value.supportedClaims.length > 0 &&
    value.supportedClaims.every((claim) => typeof claim === "string" && claim.length > 0)
  )) throw new TypeError("RESULT_EVIDENCE_DEFINITION_INVALID");
  if (new Set(definitions.map(({ evidenceId }) => evidenceId)).size !== definitions.length) {
    throw new TypeError("RESULT_EVIDENCE_DEFINITION_INVALID");
  }
  return definitions;
}
```

- [ ] **Step 4: Extend result-text and result-model enums**

Set `DEFINITION_FIELDS` to include `claimKind`. Replace the existing section set with:

```js
export const RESULT_TEXT_SECTIONS = Object.freeze([
  "titleSubtitle", "titleReason", "observation", "strength", "tradeoff",
  "work", "relationship", "stress", "question", "action",
]);

export const RESULT_CLAIM_KINDS = Object.freeze([
  "scaleObservation", "entertainmentReason", "reflectionPrompt", "actionHint",
]);
```

Enforce:

- `titleSubtitle` and `titleReason` use `entertainmentReason`.
- `observation`, `strength`, and `tradeoff` use `scaleObservation`.
- `work`, `relationship`, `stress`, and `question` use `reflectionPrompt`.
- `action` uses `actionHint`.
- Preview targets may contain only `titleSubtitle`、`titleReason`、`observation`.
- Every definition has at least one unique `evidenceRefs` value.

Import the same `RESULT_TEXT_SECTIONS` into `result-model.js`; do not duplicate an independent section list.

- [ ] **Step 5: Add cross-definition validation**

Implement:

```js
export function validateResultContentDefinitions({
  evidenceDefinitions,
  textDefinitions,
  titleProfiles,
  resultTextVersion,
}) {
  validateResultEvidenceDefinitions(evidenceDefinitions);
  validateResultTextDefinitions(textDefinitions);
  const evidenceIds = new Set(evidenceDefinitions.map(({ evidenceId }) => evidenceId));
  const titleIds = new Set(titleProfiles.map(({ titleId }) => titleId));
  if (resultTextVersion !== "result-text-v1") throw new TypeError("RESULT_CONTENT_INVALID");
  if (!textDefinitions.every(({ version, evidenceRefs, appliesTo }) =>
    version === resultTextVersion &&
    evidenceRefs.every((id) => evidenceIds.has(id)) &&
    (!appliesTo.titleId || titleIds.has(appliesTo.titleId))
  )) throw new TypeError("RESULT_CONTENT_INVALID");
  return true;
}
```

- [ ] **Step 6: Run schema and regression tests**

Migrate only the legacy result-text fixtures in `app/tests/scoring-title-contract.test.js` to the new contract: replace valid `summary` records with the appropriate new section, add the required `claimKind` to definition fixtures, and give valid records a non-empty test evidence reference. Keep explicit invalid fixtures for empty evidence references. Do not change scoring, title-classification, boundary, or immutability expectations.

Run: `node --test app/tests/result-content-definitions.test.js app/tests/definition-validator.test.js app/tests/scoring-title-contract.test.js`  
Expected: PASS for all tests.

- [ ] **Step 7: Commit only schema files**

```bash
git add app/js/domain/result-evidence.js app/js/domain/result-text.js app/js/domain/result-model.js app/js/domain/definition-validator.js app/tests/result-content-definitions.test.js app/tests/definition-validator.test.js app/tests/scoring-title-contract.test.js
git commit -m "feat: validate Q-006 result content schemas"
```

---

### Task 3: Add 51 title labels, neutral subtitles, and reasons

**Files:**
- Create: `app/tests/fixtures/q006-title-catalog.fixture.js`
- Create: `app/js/data/title-result-text-definitions.js`
- Modify: `app/js/data/title-profile-definitions.js`
- Test: `app/tests/result-content-definitions.test.js`

**Interfaces:**
- Consumes: the 51 fixed rows in `docs/title-character-catalog.md` and `ResultTextDefinition`.
- Produces: `TitleResultTextDefinitions: ReadonlyArray<ResultTextDefinition>` with exactly 102 records.

- [ ] **Step 1: Write the failing 51-title coverage test**

```js
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { TitleResultTextDefinitions } from "../js/data/title-result-text-definitions.js";
import { Q006_TITLE_CATALOG } from "./fixtures/q006-title-catalog.fixture.js";

test("Q-006 title profiles match the approved 51-title catalog", () => {
  assert.equal(TitleProfileDefinitions.length, 51);
  assert.deepEqual(
    TitleProfileDefinitions.map(({ titleId, label }) => ({ titleId, label })),
    Q006_TITLE_CATALOG,
  );
});

test("every title has one subtitle and one reason", () => {
  assert.equal(TitleResultTextDefinitions.length, 102);
  for (const { titleId } of Q006_TITLE_CATALOG) {
    const sections = TitleResultTextDefinitions
      .filter(({ appliesTo }) => appliesTo.titleId === titleId)
      .map(({ section }) => section)
      .sort();
    assert.deepEqual(sections, ["titleReason", "titleSubtitle"]);
  }
});
```

- [ ] **Step 2: Run the title coverage test**

Run: `node --test app/tests/result-content-definitions.test.js`  
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `title-result-text-definitions.js` or label mismatch because labels still equal IDs.

- [ ] **Step 3: Create the exact 51-row fixture and update profile labels**

Copy the 51 `titleId` and title strings from `docs/title-character-catalog.md` in its fixed order into `Q006_TITLE_CATALOG`. Change `makeProfile` to accept `label`, and construct each profile with the fixture-equivalent approved label. Keep `titleId`、`characterId`、`summaryTextId`、factor order and the 51-profile generation order unchanged.

- [ ] **Step 4: Author and approve the title text batches**

Create two definitions per title. Use this balanced example as the field contract:

```js
{
  id: "title-balanced-subtitle",
  version: "result-text-v1",
  appliesTo: { titleId: "title-balanced" },
  section: "titleSubtitle",
  claimKind: "entertainmentReason",
  text: "5因子がいずれも中間域にあるプロフィール",
  evidenceRefs: ["evidence-title-rule-v1"],
  previewAllowed: true,
},
{
  id: "title-balanced-reason",
  version: "result-text-v1",
  appliesTo: { titleId: "title-balanced" },
  section: "titleReason",
  claimKind: "entertainmentReason",
  text: "今回の回答では、5因子すべてが称号判定上の中間域に入りました。",
  evidenceRefs: ["evidence-title-rule-v1"],
  previewAllowed: true,
}
```

Complete approval gates T-0〜T-4. Single reasons name exactly one selected factor and direction; pair reasons name exactly two; balanced names no high/low factor. Do not claim skills, goodness, suitability, compatibility, diagnosis, or population rank.

- [ ] **Step 5: Run title-content tests**

Run: `node --test app/tests/result-content-definitions.test.js app/tests/scoring-title-contract.test.js`  
Expected: PASS with 51 profiles and 102 title-text records.

- [ ] **Step 6: Commit only title-content files**

```bash
git add app/tests/fixtures/q006-title-catalog.fixture.js app/js/data/title-result-text-definitions.js app/js/data/title-profile-definitions.js app/tests/result-content-definitions.test.js
git commit -m "feat: add Q-006 title result content"
```

---

### Task 4: Add five-factor high/middle/low content for preview and detail

**Files:**
- Create: `app/js/data/factor-result-text-definitions.js`
- Create: `app/js/data/result-text-definitions.js`
- Test: `app/tests/result-content-definitions.test.js`

**Interfaces:**
- Consumes: approved gates E-1〜E-5、F-1〜F-5、`FACTOR_ORDER`、`TitleResultTextDefinitions`。
- Produces: `FactorResultTextDefinitions` with exactly 135 records and `ResultTextDefinitions` with exactly 237 records.

- [ ] **Step 1: Write the failing factor matrix test**

```js
import { FACTOR_ORDER } from "../js/data/factor-order.js";
import { FactorResultTextDefinitions } from "../js/data/factor-result-text-definitions.js";
import { ResultTextDefinitions } from "../js/data/result-text-definitions.js";

const BANDS = ["low", "middle", "high"];
const DETAIL_SECTIONS = [
  "observation", "strength", "tradeoff", "work",
  "relationship", "stress", "question", "action",
];

test("factor content covers 5 factors, 3 bands, and both modes", () => {
  assert.equal(FactorResultTextDefinitions.length, 135);
  for (const factorId of FACTOR_ORDER) {
    for (const band of BANDS) {
      const preview = FactorResultTextDefinitions.filter(({ appliesTo }) =>
        appliesTo.mode === "preview20" &&
        appliesTo.factorId === factorId &&
        appliesTo.band === band);
      assert.deepEqual(preview.map(({ section }) => section), ["observation"]);

      const detail = FactorResultTextDefinitions.filter(({ appliesTo }) =>
        appliesTo.mode === "detail50" &&
        appliesTo.factorId === factorId &&
        appliesTo.band === band);
      assert.deepEqual(detail.map(({ section }) => section), DETAIL_SECTIONS);
    }
  }
  assert.equal(ResultTextDefinitions.length, 237);
});
```

- [ ] **Step 2: Run the factor matrix test**

Run: `node --test app/tests/result-content-definitions.test.js`  
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `factor-result-text-definitions.js`.

- [ ] **Step 3: Implement the preview contract**

Create exactly one `observation` for each factor×band in preview mode:

```js
{
  id: "preview20-intellectImagination-high-observation",
  version: "result-text-v1",
  appliesTo: {
    mode: "preview20",
    questionCount: 20,
    factorId: "intellectImagination",
    band: "high",
  },
  section: "observation",
  claimKind: "scaleObservation",
  text: "今回の20問では、新しい考え方や発想への関心は、尺度内で高めの傾向が見られました。",
  evidenceRefs: [
    "evidence-ipip-japanese-markers",
    "evidence-mini-ipip-selection",
  ],
  previewAllowed: true,
}
```

All 15 preview records must say「今回の20問では」and must not contain work, relationship, stress, strength, tradeoff, or action claims.

- [ ] **Step 4: Implement the detail contract in five approval batches**

For each factor×band, create the eight sections in `DETAIL_SECTIONS` order. Use this pattern:

```js
{
  id: "detail50-intellectImagination-high-observation",
  version: "result-text-v1",
  appliesTo: {
    mode: "detail50",
    questionCount: 50,
    factorId: "intellectImagination",
    band: "high",
  },
  section: "observation",
  claimKind: "scaleObservation",
  text: "今回の50問では、新しい考え方や発想への関心は、尺度内で高めの傾向が見られました。",
  evidenceRefs: [
    "evidence-ipip-japanese-markers",
    "evidence-ipip-50-item-scale",
  ],
  previewAllowed: false,
},
{
  id: "detail50-intellectImagination-high-work",
  version: "result-text-v1",
  appliesTo: {
    mode: "detail50",
    questionCount: 50,
    factorId: "intellectImagination",
    band: "high",
  },
  section: "work",
  claimKind: "reflectionPrompt",
  text: "仕事や学びのなかで、新しいやり方や考え方に「いいな」と惹かれた瞬間はありましたか。",
  evidenceRefs: ["evidence-result-presentation-contract"],
  previewAllowed: false,
}
```

Complete F-1〜F-5 in factor order. `middle` must describe the middle band directly; do not combine high and low paragraphs or label it balanced. `strength` and `tradeoff` remain tendencies, while `work/relationship/stress/question/action` remain prompts or hints.

- [ ] **Step 5: Aggregate definitions without reordering**

```js
import { TitleResultTextDefinitions } from "./title-result-text-definitions.js";
import { FactorResultTextDefinitions } from "./factor-result-text-definitions.js";

export const ResultTextDefinitions = Object.freeze([
  ...TitleResultTextDefinitions,
  ...FactorResultTextDefinitions,
]);
```

- [ ] **Step 6: Run content matrix and schema tests**

Run: `node --test app/tests/result-content-definitions.test.js app/tests/definition-validator.test.js`  
Expected: PASS with 135 factor records and 237 total records.

- [ ] **Step 7: Commit only factor-content files**

```bash
git add app/js/data/factor-result-text-definitions.js app/js/data/result-text-definitions.js app/tests/result-content-definitions.test.js
git commit -m "feat: add Q-006 factor result content"
```

---

### Task 5: Compose deterministic preview and detail text

**Files:**
- Create: `app/js/domain/result-composer.js`
- Test: `app/tests/result-composer.test.js`

**Interfaces:**
- Consumes: `selectResultTextDefinitions`、`ResultTextDefinitions`、`FactorResult[5]`、`FACTOR_ORDER`。
- Produces: `composeResultTexts(input): ReadonlyArray<RenderedResultText>`。

- [ ] **Step 1: Write failing preview/detail composition tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { ResultTextDefinitions } from "../js/data/result-text-definitions.js";
import { composeResultTexts } from "../js/domain/result-composer.js";

const makeFactor = (factorId, band, rawMean, itemCount) => ({
  factorId,
  rawMean,
  displayScore: Math.round((rawMean - 1) / 4 * 100),
  band,
  salience: Math.abs(rawMean - 3),
  directionalSupportCount: band === "middle" ? 0 : itemCount,
  variance: 0,
});

const makeFactors = (itemCount) => [
  makeFactor("intellectImagination", "high", 4, itemCount),
  makeFactor("conscientiousness", "middle", 3, itemCount),
  makeFactor("extraversion", "low", 2, itemCount),
  makeFactor("agreeableness", "middle", 3, itemCount),
  makeFactor("emotionalStability", "high", 4, itemCount),
];

const previewFactors = makeFactors(4);
const detailFactors = makeFactors(10);

test("preview composes two title records and five observations", () => {
  const rendered = composeResultTexts({
    definitions: ResultTextDefinitions,
    version: "result-text-v1",
    mode: "preview20",
    questionCount: 20,
    factors: previewFactors,
    titleId: "title-pair-intellectImagination-high--extraversion-low",
  });
  assert.equal(rendered.length, 7);
  assert.deepEqual(rendered.map(({ section }) => section), [
    "titleSubtitle", "titleReason",
    "observation", "observation", "observation", "observation", "observation",
  ]);
});

test("detail composes two title records and forty factor records", () => {
  const rendered = composeResultTexts({
    definitions: ResultTextDefinitions,
    version: "result-text-v1",
    mode: "detail50",
    questionCount: 50,
    factors: detailFactors,
    titleId: "title-pair-intellectImagination-high--extraversion-low",
  });
  assert.equal(rendered.length, 42);
  assert.equal(rendered.filter(({ section }) => section === "action").length, 5);
});
```

- [ ] **Step 2: Run composer tests**

Run: `node --test app/tests/result-composer.test.js`  
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `result-composer.js`.

- [ ] **Step 3: Implement exact input validation and selection**

Reject unknown input fields, mode/questionCount mismatch, factor arrays not accepted by `isValidFactorResults`, duplicate/missing factors, unknown title, and version mismatch. Select title sections once and factor sections once per `FACTOR_ORDER` factor.

```js
const TITLE_SECTIONS = new Set(["titleSubtitle", "titleReason"]);
const SECTION_ORDER = [
  "titleSubtitle", "titleReason", "observation", "strength", "tradeoff",
  "work", "relationship", "stress", "question", "action",
];

const toRendered = ({ id, version, section, text, evidenceRefs }) =>
  Object.freeze({ id, version, section, text, evidenceRefs: Object.freeze([...evidenceRefs]) });
```

Sort first by `SECTION_ORDER`, then by `FACTOR_ORDER`; title records precede factor records. Return a deeply frozen array. Do not pass `claimKind` or selection conditions into `RenderedResultText`.

- [ ] **Step 4: Add negative composer assertions**

```js
assert.throws(() => composeResultTexts({
  definitions: ResultTextDefinitions,
  version: "result-text-v1",
  mode: "preview20",
  questionCount: 50,
  factors: detailFactors,
  titleId: "title-balanced",
}), /RESULT_COMPOSITION_INVALID/);

assert.throws(() => composeResultTexts({
  definitions: ResultTextDefinitions,
  version: "result-text-v1",
  mode: "detail50",
  questionCount: 50,
  factors: detailFactors.slice(0, 4),
  titleId: "title-balanced",
}), /RESULT_COMPOSITION_INVALID/);
```

- [ ] **Step 5: Run composer and model tests**

Run: `node --test app/tests/result-composer.test.js app/tests/scoring-title-contract.test.js`  
Expected: PASS, including 7-record preview and 42-record detail assertions.

- [ ] **Step 6: Commit only composer files**

```bash
git add app/js/domain/result-composer.js app/tests/result-composer.test.js
git commit -m "feat: compose deterministic Q-006 result text"
```

---

### Task 6: Preserve displayed content in result snapshots

**Files:**
- Create: `app/js/domain/result-snapshot.js`
- Test: `app/tests/result-snapshot.test.js`
- Modify: `app/js/domain/result-model.js`

**Interfaces:**
- Consumes: `composeResultModel(...)` output and `VersionTuple`.
- Produces: `createResultSnapshot(...)` with immutable `renderedTexts` and no answers.

- [ ] **Step 1: Write the failing snapshot immutability test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createResultSnapshot } from "../js/domain/result-snapshot.js";

test("snapshot keeps displayed text and never stores answers", () => {
  const factors = Object.freeze([
    "intellectImagination",
    "conscientiousness",
    "extraversion",
    "agreeableness",
    "emotionalStability",
  ].map((factorId) => Object.freeze({
    factorId,
    rawMean: 3,
    displayScore: 50,
    band: "middle",
    salience: 0,
    directionalSupportCount: 0,
    variance: 0,
  })));
  const resultModel = Object.freeze({
    factors,
    titleId: "title-balanced",
    characterId: "character-balanced",
    boundaryFlags: Object.freeze([]),
    renderedTexts: Object.freeze([Object.freeze({
      id: "title-balanced-subtitle",
      version: "result-text-v1",
      section: "titleSubtitle",
      text: "5因子がいずれも中間域にあるプロフィール",
      evidenceRefs: Object.freeze(["evidence-title-rule-v1"]),
    })]),
  });

  const snapshot = createResultSnapshot({
    resultId: "result-1",
    completedAt: "2026-07-25T12:00:00+09:00",
    questionCount: 50,
    mode: "detail50",
    versionTuple: {
      scaleVersion: "ipip-ja-50-v1",
      questionVersion: "ipip-ja-50-question-set-v1",
      scoringVersion: "ipip-ja-50-scoring-v1",
      resultTextVersion: "result-text-v1",
      titleRuleVersion: "title-rule-v1",
      characterManifestVersion: "character-manifest-v1",
      presentationDefinitionVersion: "presentation-v1",
      cardTemplateVersion: "card-template-v1",
      appVersion: "mvp-0.1.0",
    },
    resultModel,
    characterAssetVersion: "character-manifest-v1",
    selectedPaletteId: "palette-default",
    cardTemplateVersion: "card-template-v1",
  });

  assert.equal(snapshot.renderedTexts[0].text, resultModel.renderedTexts[0].text);
  assert.equal(Object.hasOwn(snapshot, "answers"), false);
  assert.ok(Object.isFrozen(snapshot.renderedTexts));
});
```

- [ ] **Step 2: Run snapshot tests**

Run: `node --test app/tests/result-snapshot.test.js`  
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `result-snapshot.js`.

- [ ] **Step 3: Implement exact snapshot creation**

Validate the exact input fields shown above and the complete nine-field `VersionTuple` already produced by `createVersionTuple(appMeta)`. Require `(mode, questionCount)` to be `(preview20, 20)` or `(detail50, 50)`. Require every rendered record version to equal `versionTuple.resultTextVersion`. Copy every factor, boundary flag, rendered text, and evidence reference before deep freezing. Reject any `resultModel` or nested record with an `answers` field using `RESULT_SNAPSHOT_INVALID`.

- [ ] **Step 4: Add version and historical-text rejection tests**

```js
assert.throws(
  () => createResultSnapshot({
    ...validInput,
    versionTuple: { ...validInput.versionTuple, resultTextVersion: "result-text-v2" },
  }),
  /RESULT_SNAPSHOT_INVALID/,
);

const snapshot = createResultSnapshot(validInput);
const currentDefinitions = [{ text: "更新後の文章" }];
assert.notEqual(snapshot.renderedTexts[0].text, currentDefinitions[0].text);
```

- [ ] **Step 5: Run snapshot and result-model tests**

Run: `node --test app/tests/result-snapshot.test.js app/tests/result-composer.test.js`  
Expected: PASS with version mismatch, answers contamination, and historical-text assertions covered.

- [ ] **Step 6: Commit only snapshot files**

```bash
git add app/js/domain/result-snapshot.js app/js/domain/result-model.js app/tests/result-snapshot.test.js
git commit -m "feat: preserve Q-006 text in result snapshots"
```

---

### Task 7: Synchronize Q-006 contracts and close the content gate

**Files:**
- Modify: `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md`
- Modify: `docs/data-model.md`
- Modify: `docs/screens.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/superpowers/specs/2026-07-25-t005-result-character-presentation-design.md`
- Modify: `docs/tasks.md`
- Modify: `app/tests/project-contract.test.js`

**Interfaces:**
- Consumes: all implementation contracts and approved gates from Tasks 1〜6.
- Produces: synchronized Q-006/T-005 documentation and a repository-level contract test.

- [ ] **Step 1: Write the failing documentation contract test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Q-006 documents name the versioned content and snapshot contracts", async () => {
  const paths = [
    "docs/data-model.md",
    "docs/screens.md",
    "docs/processing-design.md",
    "docs/superpowers/specs/2026-07-25-t005-result-character-presentation-design.md",
    "docs/tasks.md",
  ];
  const text = (await Promise.all(paths.map((path) => readFile(path, "utf8")))).join("\n");
  for (const required of [
    "result-text-v1",
    "ResultEvidenceDefinition",
    "titleSubtitle",
    "titleReason",
    "reflectionPrompt",
    "composeResultTexts",
    "RenderedResultText",
  ]) assert.ok(text.includes(required), `missing ${required}`);
});
```

- [ ] **Step 2: Run the documentation contract**

Run: `node --test app/tests/project-contract.test.js`  
Expected: FAIL with `missing ResultEvidenceDefinition` or `missing titleSubtitle`.

- [ ] **Step 3: Update the data and processing contracts**

In `docs/data-model.md`, replace the old seven-section enum with the ten sections and add `claimKind`. Add `ResultEvidenceDefinition` exactly as implemented. State the 102 title records, 135 factor records, and 237 total records. In `docs/processing-design.md`, document `composeResultTexts`, 7 preview records, 42 detail records, fixed section/factor ordering, version matching, and snapshot copying.

- [ ] **Step 4: Update screen and requirement contracts**

In `docs/screens.md`, preserve the T-005 display order and explicitly state:

- preview: title subtitle, title reason, five observations, preview limitation;
- detail: title subtitle/reason, five observations, strength/tradeoff, work/relationship/stress prompts, question/action;
- 因子の「説明を見る」 and the approved post-reflection note remain available;
- title, text, and evidence access survive character and Canvas failure.

In requirements, move Q-006 from「一部解決」to resolved only after gates E-0〜E-5、T-0〜T-4、F-1〜F-5、X-1〜X-2 have approval records. Record the final evidence-ledger path and `result-text-v1`.

- [ ] **Step 5: Update the T-005 spec and task traceability**

Replace Q-006 in T-005「残作業」with the implemented file paths and verification commands. In `docs/tasks.md`, map the completed work to T-005 and F-002/F-005/F-006/F-016; retain Q-007, Q-012 asset production, and Q-013 content as separate gates.

- [ ] **Step 6: Run focused and full verification**

Run: `node --test app/tests/project-contract.test.js app/tests/result-evidence-definitions.test.js app/tests/result-content-definitions.test.js app/tests/result-composer.test.js app/tests/result-snapshot.test.js`  
Expected: PASS for all Q-006 and documentation contract tests.

Run: `npm.cmd test`  
Expected: exit code 0 with the complete Node test suite passing.

Run: `npm.cmd run check`  
Expected: exit code 0 with static validation passing.

- [ ] **Step 7: Commit only synchronized documents and their contract test**

```bash
git add docs/requirements/2026-07-20-big-five-self-understanding-requirements.md docs/data-model.md docs/screens.md docs/processing-design.md docs/superpowers/specs/2026-07-25-t005-result-character-presentation-design.md docs/tasks.md app/tests/project-contract.test.js
git commit -m "docs: close Q-006 result content contract"
```

---

## Plan Self-Review Checklist

- [ ] Every requirement for 5 factors, three bands, 20/50 separation, 51 titles, roots, snapshot preservation, and non-diagnostic wording maps to a task above.
- [ ] All interfaces use the same field names in data, validators, composer, snapshot, and docs.
- [ ] `result-text-v1` is the only result text version introduced.
- [ ] Preview produces exactly 7 records; detail produces exactly 42 records.
- [ ] Static definitions total exactly 237 records: 102 title + 135 factor.
- [ ] No runtime path receives raw answers, DOM, Canvas, localStorage, network, cat color, palette, or fragrance as a text-selection input.
- [ ] All commits stage only the files listed in their task.
- [ ] The completed plan contains no incomplete implementation markers or cross-task shorthand that requires guessing.
