# Result Progressive Disclosure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the title and approved cat the result hero, add a labeled radar and compact factor scores, expose all persisted result texts through one-factor/one-category progressive disclosure, and complete the 20-question continue/pause/finish flow.

**Architecture:** `ResultSnapshot` remains the immutable historical authority. New pure view-model functions project its section-first records into factor-first UI groups without changing stored order or content. Presentation owns transient accordion and bottom-sheet state; `main.js` owns progress deletion and routing.

**Tech Stack:** JavaScript ES Modules, Canvas 2D, HTML DOM APIs, CSS, Node `node:test`, fake DOM integration tests.

## Global Constraints

- Requirements authority: `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md` v1.10.
- Design authority: `docs/superpowers/specs/2026-07-27-result-history-resume-ui-design.md`.
- Task trace: T-008A / F-005 / F-006 / F-008 / F-013 / F-015 / F-018.
- Preserve all 7 preview and 42 detail `RenderedResultText` records, IDs, text, evidence refs, and the ResultSnapshot schema.
- Preserve Q-012 approved asset path, alt, one-image lazy loading, neutral fallback, and no cat recoloring.
- Do not add provisional Q-013 palettes or fragrance copy. Only leave stable placement hooks for the later approved data.
- The factor order is exactly: `intellectImagination`, `conscientiousness`, `extraversion`, `agreeableness`, `emotionalStability`.
- At most one factor and one category detail are open. No third disclosure layer.
- `簡易プレビューで終了する` is available only when the preview snapshot is persisted and a matching shown-preview ProgressRecord exists.
- Every code task follows red → green → focused regression → commit.

---

## File Structure

- Create `app/js/domain/question-composition.js`: pure positive/reverse-keyed count model with no question text or answers.
- Create `app/js/presentation/result-disclosure-model.js`: immutable factor-first projection of persisted result records.
- Create `app/js/presentation/bottom-sheet.js`: accessible fixed-information launcher and sheet.
- Modify `app/js/presentation/radar-chart.js`: draw five factor labels.
- Modify `app/js/presentation/result-screen.js`: hero, score table, progressive disclosure, question composition, fixed methods, and preview actions.
- Modify `app/js/main.js`: inject composition/method models and coordinate pause/finish.
- Modify `app/css/styles.css`: hero, factor rows, bars, accordion, bottom sheet, and mobile layout.
- Create `app/tests/question-composition.test.js`.
- Create `app/tests/result-disclosure-model.test.js`.
- Create `app/tests/bottom-sheet.test.js`.
- Modify `app/tests/radar-chart.test.js`.
- Modify `app/tests/result-screen.test.js`.
- Modify `app/tests/app-shell.test.js`.

### Task 1: Pure Question-Composition and Result-Disclosure Models

**Files:**
- Create: `app/js/domain/question-composition.js`
- Create: `app/js/presentation/result-disclosure-model.js`
- Create: `app/tests/question-composition.test.js`
- Create: `app/tests/result-disclosure-model.test.js`

**Interfaces:**
- Produces: `createQuestionComposition({ mode, definition, questionDefinitions }) -> readonly { factorId, positiveCount, negativeCount }[5]`
- Produces: `createResultDisclosureModel(snapshot, labels) -> readonly FactorDisclosure[5]`
- `FactorDisclosure = { factorId, label, description, displayScore, categories }`
- `CategoryDisclosure = { categoryId, label, summary, records }`

- [ ] **Step 1: Write failing exact-count tests for question composition**

Create tests with the production definitions:

```js
test("T-008A F-002 counts preview directions without exposing question text", () => {
  const model = createQuestionComposition({
    mode: "preview20",
    definition: DiagnosticDefinition,
    questionDefinitions: QuestionDefinitions,
  });

  assert.deepEqual(model, [
    { factorId: "intellectImagination", positiveCount: 1, negativeCount: 3 },
    { factorId: "conscientiousness", positiveCount: 2, negativeCount: 2 },
    { factorId: "extraversion", positiveCount: 2, negativeCount: 2 },
    { factorId: "agreeableness", positiveCount: 2, negativeCount: 2 },
    { factorId: "emotionalStability", positiveCount: 2, negativeCount: 2 },
  ]);
  assert.doesNotMatch(JSON.stringify(model), /textJa|answers|sourceItemId/);
  assert.ok(Object.isFrozen(model));
});
```

Add the exact detail counts:

```js
[
  ["intellectImagination", 7, 3],
  ["conscientiousness", 6, 4],
  ["extraversion", 5, 5],
  ["agreeableness", 6, 4],
  ["emotionalStability", 2, 8],
]
```

Reject an unknown mode, missing question ID, duplicate ID, and unknown `keyedDirection` with `QUESTION_COMPOSITION_INVALID`.

- [ ] **Step 2: Write failing grouping tests for preview and detail snapshots**

Use `createTestResultSnapshot` and assert:

```js
const model = createResultDisclosureModel(snapshot, labels);
assert.deepEqual(model.map(({ factorId }) => factorId), snapshot.factors.map(({ factorId }) => factorId));
assert.deepEqual(
  model[0].categories.map(({ categoryId }) => categoryId),
  ["observation", "strength", "tradeoff", "work", "relationship", "stress", "reflectionAction"],
);
assert.deepEqual(
  model[0].categories.at(-1).records.map(({ section }) => section),
  ["question", "action"],
);
assert.deepEqual(
  model.flatMap(({ categories }) => categories.flatMap(({ records }) => records))
    .map(({ id }) => id)
    .sort(),
  snapshot.renderedTexts.slice(2).map(({ id }) => id).sort(),
);
```

For preview, assert every factor has only `observation`. Assert input snapshot remains deeply equal to its pre-call clone.

- [ ] **Step 3: Run model tests and verify failure**

```powershell
node --test app/tests/question-composition.test.js app/tests/result-disclosure-model.test.js
```

Expected: FAIL because both modules are missing.

- [ ] **Step 4: Implement exact direction counting**

Use `FACTOR_ORDER` and the mode-specific fixed IDs:

```js
export function createQuestionComposition({ mode, definition, questionDefinitions }) {
  const ids = mode === "preview20"
    ? definition.previewQuestionIds
    : mode === "detail50"
      ? definition.detailQuestionIds
      : null;
  if (!ids || !Array.isArray(questionDefinitions)) {
    throw new TypeError("QUESTION_COMPOSITION_INVALID");
  }

  const byId = new Map(questionDefinitions.map((question) => [question.id, question]));
  if (byId.size !== questionDefinitions.length) {
    throw new TypeError("QUESTION_COMPOSITION_INVALID");
  }
  const counts = new Map(FACTOR_ORDER.map((factorId) => [
    factorId,
    { factorId, positiveCount: 0, negativeCount: 0 },
  ]));
  for (const id of ids) {
    const question = byId.get(id);
    const row = question && counts.get(question.factorId);
    if (!row || !["positive", "negative"].includes(question.keyedDirection)) {
      throw new TypeError("QUESTION_COMPOSITION_INVALID");
    }
    row[question.keyedDirection === "positive" ? "positiveCount" : "negativeCount"] += 1;
  }
  return Object.freeze(FACTOR_ORDER.map((factorId) =>
    Object.freeze({ ...counts.get(factorId) })));
}
```

- [ ] **Step 5: Implement factor-first disclosure projection**

Define immutable category metadata:

```js
const CATEGORY_DEFINITIONS = Object.freeze([
  { categoryId: "observation", sections: ["observation"], label: "今の傾向", summary: "回答から見える現在の傾向を短くまとめます。" },
  { categoryId: "strength", sections: ["strength"], label: "活かしやすい強み", summary: "活かしやすい場面を振り返ります。" },
  { categoryId: "tradeoff", sections: ["tradeoff"], label: "強みの裏返り", summary: "負担になりやすい場面を振り返ります。" },
  { categoryId: "work", sections: ["work"], label: "仕事での現れ方", summary: "仕事や学びでの現れ方を確認します。" },
  { categoryId: "relationship", sections: ["relationship"], label: "人間関係での現れ方", summary: "人との関わりでの現れ方を確認します。" },
  { categoryId: "stress", sections: ["stress"], label: "ストレス時の傾向", summary: "負担がかかった場面を振り返ります。" },
  { categoryId: "reflectionAction", sections: ["question", "action"], label: "振り返りと行動ヒント", summary: "振り返りの問いと小さな行動を確認します。" },
]);
```

Assign `snapshot.renderedTexts.slice(2)` by `recordIndex % snapshot.factors.length`, retain only categories with records, clone no text, and deep-freeze the returned arrays/objects.

- [ ] **Step 6: Run model tests**

```powershell
node --test app/tests/question-composition.test.js app/tests/result-disclosure-model.test.js
```

Expected: PASS.

- [ ] **Step 7: Commit Task 1**

```powershell
git add app/js/domain/question-composition.js app/js/presentation/result-disclosure-model.js app/tests/question-composition.test.js app/tests/result-disclosure-model.test.js
git commit -m "feat: project result disclosure models"
```

### Task 2: Result Hero and Labeled Radar

**Files:**
- Modify: `app/js/presentation/radar-chart.js`
- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/css/styles.css`
- Modify: `app/tests/radar-chart.test.js`
- Modify: `app/tests/result-screen.test.js`

**Interfaces:**
- Changes: `drawResultRadar(canvas, factors, { factorLabels = {} } = {})`.
- Produces DOM order: common header → result kind → `.result-hero` → `.result-title-reason` → `.result-factors`.
- Keeps: Q-012 `data-character-state`, approved alt, one lazy-loaded image, and failure fallback.

- [ ] **Step 1: Write a failing radar-label test**

Extend the recording context with `fillText`, `measureText`, and writable font/alignment fields, then assert:

```js
const factorLabels = Object.fromEntries(
  FACTOR_ORDER.map((factorId) => [factorId, factorId]),
);
assert.deepEqual(drawResultRadar(canvas, factors(), { factorLabels }), {
  drawn: true,
  errorCode: null,
});
assert.deepEqual(
  calls.filter(([name]) => name === "fillText").map(([, label]) => label),
  FACTOR_ORDER,
);
```

- [ ] **Step 2: Write a failing result-hero DOM-order test**

Render with a character entry and assert:

```js
const sections = collectElements(host)
  .filter(({ className }) => ["result-hero", "result-title-reason", "result-factors"].includes(className))
  .map(({ className }) => className);
assert.deepEqual(sections, ["result-hero", "result-title-reason", "result-factors"]);
assert.doesNotMatch(collectText(host), /キャラクターID：/);
assert.match(collectText(host), /この称号になった理由/);
assert.equal(resultTextRecords(host).filter(({ attributes }) =>
  attributes.get("data-result-text-id") === snapshot.renderedTexts[1].id).length, 1);
```

- [ ] **Step 3: Run focused tests and verify failure**

```powershell
node --test app/tests/radar-chart.test.js app/tests/result-screen.test.js
```

Expected: FAIL because the radar does not draw labels and title/cat are separate peer sections.

- [ ] **Step 4: Draw labels around the radar**

Reduce the polygon radius to leave label space, set a system font, and call:

```js
context.font = "600 11px system-ui, sans-serif";
context.fillStyle = "#365b52";
context.textAlign = "center";
context.textBaseline = "middle";
for (let index = 0; index < AXIS_COUNT; index += 1) {
  const labelPoint = point(centerX, centerY, maximumRadius + 28, index);
  const factorId = factors[index].factorId;
  context.fillText(
    factorLabels[factorId] ?? factorId,
    labelPoint.x,
    labelPoint.y,
  );
}
```

Keep the existing stable error returns.

- [ ] **Step 5: Refactor title and character into the result hero**

Import `appendAppHeader`, append it before the result-kind heading, and replace `renderTitle`/`renderCharacterMetadata` peer sections with:

```js
function renderResultHero(parent, snapshot, labels, dependencies) {
  const hero = parent.ownerDocument.createElement("section");
  hero.className = "result-hero";
  const prefix = snapshot.mode === "preview20" ? "仮称号" : "称号";
  appendTextElement(
    hero,
    "h2",
    `${prefix}：${labels.titleLabels[snapshot.titleId] ?? snapshot.titleId}`,
  );
  renderCharacterFrame(hero, snapshot, dependencies);
  appendRenderedText(hero, snapshot.renderedTexts[0]);
  appendTextElement(
    hero,
    "p",
    "この称号は本アプリ独自のプロフィール表現であり、心理学上の正式なタイプではありません。",
    "notice title-disclaimer",
  ).setAttribute("role", "note");
  parent.append(hero);

  const reason = parent.ownerDocument.createElement("section");
  reason.className = "result-title-reason";
  appendTextElement(reason, "h2", "この称号になった理由");
  appendRenderedText(reason, snapshot.renderedTexts[1]);
  parent.append(reason);
}
```

Move the existing lazy-load frame logic into `renderCharacterFrame` without changing the entry checks, alt, observer, decoder, or `data-character-state`.

- [ ] **Step 6: Add hero styles without recoloring the cat**

Use a neutral card and keep `object-fit: contain`:

```css
.result-hero {
  margin-top: 20px;
  padding: clamp(20px, 5vw, 32px);
  border: 1px solid #bed4cc;
  border-radius: 24px;
  background: rgb(255 255 255 / 90%);
}

.result-hero .result-character-frame {
  width: min(100%, 460px);
}

.result-title-reason {
  margin-top: 20px;
  padding: 20px;
  border-left: 3px solid #69a58f;
  background: rgb(255 255 255 / 76%);
}
```

- [ ] **Step 7: Run focused tests and commit**

```powershell
node --test app/tests/radar-chart.test.js app/tests/result-screen.test.js
git add app/js/presentation/radar-chart.js app/js/presentation/result-screen.js app/css/styles.css app/tests/radar-chart.test.js app/tests/result-screen.test.js
git commit -m "feat: make title and cat the result hero"
```

Expected: tests PASS before commit.

### Task 3: Compact Factor Rows and Two-Level Progressive Disclosure

**Files:**
- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/css/styles.css`
- Modify: `app/tests/result-screen.test.js`

**Interfaces:**
- Consumes: `createResultDisclosureModel(snapshot, labels)`.
- Produces: exactly five `.factor-score-row` elements in saved factor order.
- Produces transient DOM state through `aria-expanded` and `hidden`; it writes nothing to ResultSnapshot or storage.

- [ ] **Step 1: Replace persisted-order DOM assertions with reachability assertions**

Keep exact record identity, but no longer require factor-first DOM order to equal section-first snapshot order:

```js
const records = resultTextRecords(host);
assert.equal(records.length, 42);
assert.deepEqual(
  records.map(({ attributes }) => attributes.get("data-result-text-id")).sort(),
  snapshot.renderedTexts.map(({ id }) => id).sort(),
);
```

Add assertions for five names, five bars, and one `0–100` score-column heading.

- [ ] **Step 2: Write failing single-open-state tests**

Use the fake DOM click dispatcher:

```js
const factorButtons = collectElements(host)
  .filter(({ className }) => className === "factor-disclosure-trigger");
factorButtons[0].dispatch("click");
assert.equal(factorButtons[0].attributes.get("aria-expanded"), "true");
factorButtons[1].dispatch("click");
assert.equal(factorButtons[0].attributes.get("aria-expanded"), "false");
assert.equal(factorButtons[1].attributes.get("aria-expanded"), "true");

const detailButtons = collectElements(host)
  .filter(({ className }) => className === "category-disclosure-trigger");
detailButtons[0].dispatch("click");
detailButtons[1].dispatch("click");
assert.equal(detailButtons[0].attributes.get("aria-expanded"), "false");
assert.equal(detailButtons[1].attributes.get("aria-expanded"), "true");
```

For preview, assert each factor contains only `今の傾向` and all 7 records remain reachable.

- [ ] **Step 3: Run result-screen tests and verify failure**

```powershell
node --test app/tests/result-screen.test.js
```

Expected: FAIL because the current independent `<details>` elements permit multiple open factors and render a separate section-first text list.

- [ ] **Step 4: Render compact factor score rows**

For each factor model, render:

```js
const row = documentObject.createElement("section");
row.className = "factor-score-row";
row.setAttribute("data-factor-id", factor.factorId);

const trigger = appendTextElement(
  row,
  "button",
  "説明を見る",
  "factor-disclosure-trigger",
);
trigger.setAttribute("type", "button");
trigger.setAttribute("aria-expanded", "false");
trigger.setAttribute("aria-controls", panelId);

const meter = documentObject.createElement("span");
meter.className = "factor-score-track";
const fill = documentObject.createElement("span");
fill.className = "factor-score-fill";
fill.setAttribute("style", `--factor-score: ${factor.displayScore}%`);
meter.append(fill);
```

Include factor name and numeric score as separate text nodes, with a single `0–100` header aligned above `.factor-score-value`.

- [ ] **Step 5: Render factor panels and category panels**

Create every persisted record in the DOM under its factor/category, initially hidden. A category trigger controls one panel:

```js
trigger.addEventListener("click", () => {
  for (const other of factorControllers) {
    if (other !== controller) other.close();
  }
  controller.toggle();
  trigger.scrollIntoView?.({ block: "nearest" });
});
```

Within an opened factor, apply the same controller pattern to category triggers. Render the fixed category summary outside the hidden detail and render `appendRenderedText` for the original records inside it. The `reflectionAction` panel renders `question` then `action`.

Remove the separate `renderResultTexts` output so each record appears exactly once.

- [ ] **Step 6: Add responsive factor-table styles**

```css
.factor-score-row {
  display: grid;
  grid-template-columns: minmax(7rem, 1fr) minmax(5rem, 1fr) 3rem;
  gap: 10px;
  align-items: center;
  padding-block: 14px;
  border-top: 1px solid #dbe7e2;
}

.factor-score-track {
  height: 6px;
  border-radius: 999px;
  background: #dce9e4;
  overflow: hidden;
}

.factor-score-fill {
  display: block;
  width: var(--factor-score);
  height: 100%;
  background: #5f9d88;
}

.factor-disclosure-trigger,
.category-disclosure-trigger {
  min-height: 44px;
  padding-inline: 0;
  border: 0;
  background: transparent;
  color: #1f6955;
  font-size: 0.82rem;
}
```

At 360px, allow the trigger to span the full row rather than shrinking the name or score.

- [ ] **Step 7: Run tests and commit**

```powershell
node --test app/tests/result-disclosure-model.test.js app/tests/result-screen.test.js app/tests/radar-chart.test.js
git add app/js/presentation/result-screen.js app/css/styles.css app/tests/result-screen.test.js
git commit -m "feat: add progressive result disclosure"
```

Expected: PASS before commit.

### Task 4: Question Composition and Fixed Method Bottom Sheets

**Files:**
- Create: `app/js/presentation/bottom-sheet.js`
- Create: `app/tests/bottom-sheet.test.js`
- Modify: `app/tests/helpers/fake-dom.js`
- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/js/main.js`
- Modify: `app/css/styles.css`
- Modify: `app/tests/result-screen.test.js`

**Interfaces:**
- Produces: `appendBottomSheetLauncher(parent, { id, label, title, body })`.
- Consumes: `questionComposition` and `methodInfo` through `renderSavedResultScreen(..., dependencies)`.
- `methodInfo` is fixed by the diagnostic definition/mode, never by title or score.

- [ ] **Step 1: Write failing bottom-sheet interaction tests**

First extend the shared fake DOM with the standard attribute removal used by
the production dialog fallback:

```js
removeAttribute(name) {
  this.attributes.delete(name);
}
```

Assert open/close semantics:

```js
const launcher = appendBottomSheetLauncher(host, {
  id: "method-basis",
  label: "測定の土台",
  title: "測定の土台",
  body: "Big Fiveの5因子を測定の土台にしています。",
});
const [button] = collectElements(host).filter(({ tagName }) => tagName === "button");
const dialog = collectElements(host).find(({ tagName }) => tagName === "dialog");
button.dispatch("click");
assert.equal(button.attributes.get("aria-expanded"), "true");
assert.equal(dialog.attributes.has("open"), true);
```

Close must restore `aria-expanded="false"` and remove `open`. Native-dialog cancel/Escape handling is covered in browser smoke.

- [ ] **Step 2: Write failing composition and fixed-method rendering tests**

Assert the result screen contains:

- one `因子ごとの設問構成を見る` launcher;
- five count rows with no question text or answers;
- four method launchers in this order: `測定の土台`, `スコアの計算方法`, `この結果の限界`, `出典・利用条件`;
- identical method copy for two snapshots with different scores/title IDs in the same mode.

- [ ] **Step 3: Run focused tests and verify failure**

```powershell
node --test app/tests/bottom-sheet.test.js app/tests/result-screen.test.js
```

Expected: FAIL because the launcher and dependencies do not exist.

- [ ] **Step 4: Implement the accessible sheet**

Use a button and a native dialog, with an `open`-attribute fallback for the fake DOM and older engines:

```js
export function appendBottomSheetLauncher(parent, { id, label, title, body }) {
  const button = appendTextElement(parent, "button", label, "bottom-sheet-launcher");
  button.setAttribute("type", "button");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", id);

  const sheet = parent.ownerDocument.createElement("dialog");
  sheet.id = id;
  sheet.className = "bottom-sheet";
  sheet.setAttribute("aria-labelledby", `${id}-title`);
  const heading = appendTextElement(sheet, "h2", title);
  heading.id = `${id}-title`;
  appendTextElement(sheet, "p", body);
  const close = appendTextElement(sheet, "button", "閉じる", "secondary-button");
  close.setAttribute("type", "button");

  function openSheet() {
    if (typeof sheet.showModal === "function") sheet.showModal();
    else sheet.setAttribute("open", "");
    button.setAttribute("aria-expanded", "true");
  }
  function closeSheet() {
    if (typeof sheet.close === "function" && sheet.open) sheet.close();
    else sheet.removeAttribute("open");
    button.setAttribute("aria-expanded", "false");
    button.focus?.();
  }
  button.addEventListener("click", openSheet);
  close.addEventListener("click", closeSheet);
  sheet.addEventListener("close", () => {
    button.setAttribute("aria-expanded", "false");
    button.focus?.();
  });
  parent.append(sheet);
  return button;
}
```

Add an overlay/background style and a no-fixed-position fallback under narrow/zoomed media conditions if the sheet would cover its close button.

- [ ] **Step 5: Inject fixed composition and method models from main**

Precompute:

```js
const questionCompositionByMode = Object.freeze({
  preview20: createQuestionComposition({
    mode: "preview20",
    definition: DiagnosticDefinition,
    questionDefinitions: QuestionDefinitions,
  }),
  detail50: createQuestionComposition({
    mode: "detail50",
    definition: DiagnosticDefinition,
    questionDefinitions: QuestionDefinitions,
  }),
});
```

Pass the selected rows plus fixed method copy:

```js
questionComposition: questionCompositionByMode[snapshot.mode],
methodInfo: [
  { id: "basis", title: "測定の土台", body: `${DiagnosticDefinition.scaleName}を用いて、Big Fiveの5因子を確認します。` },
  { id: "scoring", title: "スコアの計算方法", body: "正方向・逆方向をそろえた1〜5の平均を、表示用に0〜100へ換算しています。" },
  {
    id: "limitations",
    title: "この結果の限界",
    body: (snapshot.mode === "preview20"
      ? DiagnosticDefinition.limitations
      : [DiagnosticDefinition.limitations[0], DiagnosticDefinition.limitations[2]]
    ).join(" "),
  },
  { id: "sources", title: "出典・利用条件", body: DiagnosticDefinition.source.map(({ label }) => label).join(" / ") },
],
```

- [ ] **Step 6: Render composition above method launchers**

Render positive/reverse counts only. Do not pass `QuestionDefinitions` or answers into `result-screen.js`.

- [ ] **Step 7: Run tests and commit**

```powershell
node --test app/tests/question-composition.test.js app/tests/bottom-sheet.test.js app/tests/result-screen.test.js app/tests/app-shell.test.js
git add app/js/presentation/bottom-sheet.js app/js/presentation/result-screen.js app/js/main.js app/css/styles.css app/tests/helpers/fake-dom.js app/tests/bottom-sheet.test.js app/tests/result-screen.test.js
git commit -m "feat: explain result measurement basis"
```

Expected: PASS before commit.

### Task 5: Preview Continue, Pause, and Finish

**Files:**
- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/js/main.js`
- Modify: `app/tests/result-screen.test.js`
- Modify: `app/tests/app-shell.test.js`

**Interfaces:**
- Adds optional result actions: `onPausePreview()` and `onFinishPreview()`.
- Keeps optional `onContinueDetail(snapshot)`.
- Uses existing `discardProgress({ storage, diagnosisId, confirmed: true, now })`.
- `onFinishPreview` is omitted when `persistenceFailed` is true or no matching shown-preview progress exists.

- [ ] **Step 1: Write failing presentation tests for the three preview actions**

Render a preview with all three callbacks and assert exact labels and one dispatch each:

```js
assert.deepEqual(
  buttons.map(({ textContent }) => textContent),
  ["あと30問続ける", "中断してトップへ", "簡易プレビューで終了する"],
);
```

Render without `onFinishPreview` and assert the finish button is absent while continue/pause remain.

- [ ] **Step 2: Write failing app-shell tests for successful finish and deletion failure**

Successful finish:

```js
clickButton(host, "20問の簡易プレビューを見る");
const resultId = JSON.parse(raw).results[0].resultId;
clickButton(host, "簡易プレビューで終了する");
const envelope = JSON.parse(raw);
assert.deepEqual(envelope.progressByDiagnosis, {});
assert.equal(envelope.results[0].resultId, resultId);
assert.equal(windowObject.location.hash, "#/start");
```

Deletion failure must remain on the result route, retain the progress, retain the result, and show a retryable error notice.

Also extend the existing snapshot-save-failure test to assert the finish button is absent. Add a saved-preview route with no matching shown-preview ProgressRecord and assert that both continuation and finish are absent, no storage write occurs, and the saved ResultSnapshot remains available.

- [ ] **Step 3: Run focused tests and verify failure**

```powershell
node --test app/tests/result-screen.test.js app/tests/app-shell.test.js
```

Expected: FAIL because only `onContinueDetail` exists.

- [ ] **Step 4: Add result action buttons**

Change the primary label to `あと30問続ける`. When callbacks exist, render:

```js
addAction(controls, "中断してトップへ", "secondary-button", actions.onPausePreview);
addAction(
  controls,
  "簡易プレビューで終了する",
  "text-button",
  actions.onFinishPreview,
);
```

Do not render disabled dead-end buttons; omit actions whose callbacks are absent.

- [ ] **Step 5: Coordinate pause and finish in main**

Add transient `resultActionNotice`. `renderResult` already receives `previewProgress` only after `isShownPreviewProgressForSnapshot` or `loadPreviewContinuation` has validated the mode, 20 answers, `showPreview`, and exact VersionTuple. Derive the exact finish guard once:

```js
const canFinishPreview = !persistenceFailed && previewProgress !== null;
const previewActions = previewProgress ? {
  onPausePreview() {
    currentProgress = previewProgress;
    setRoute("#/start");
  },
  ...(canFinishPreview ? {
    onFinishPreview() {
      const outcome = discardProgress({
        storage: getStorage(),
        diagnosisId: DiagnosticDefinition.diagnosisId,
        confirmed: true,
        now: nowProvider(),
      });
      if (outcome.status !== "ok") {
        resultActionNotice = "簡易プレビューを終了できませんでした。もう一度お試しください。";
        renderResult(snapshot, false, previewProgress);
        return;
      }
      currentProgress = null;
      liveResult = null;
      resultActionNotice = null;
      setRoute("#/start");
    },
  } : {}),
} : {};
```

Spread `previewActions` into the result action object. Pass `resultActionNotice` ahead of the generic persistence notice, then clear it when leaving the result or after success.

- [ ] **Step 6: Run focused and full tests**

```powershell
node --test app/tests/result-screen.test.js app/tests/app-shell.test.js
npm.cmd test
npm.cmd run check
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 7: Commit Task 5**

```powershell
git add app/js/presentation/result-screen.js app/js/main.js app/tests/result-screen.test.js app/tests/app-shell.test.js
git commit -m "feat: complete preview exit choices"
```

### Task 6: Browser and Accessibility Verification

**Files:**
- Modify if required: `app/css/styles.css`
- Document evidence: `.superpowers/sdd/2026-07-27-result-progressive-disclosure/browser-smoke.md`

**Interfaces:**
- Verifies the completed result subsystem; does not approve Q-006 text or Q-013 content.

- [ ] **Step 1: Verify at 360×800 and 320px/200% equivalent**

Check:

1. App name is restrained; result kind, title, cat, subtitle, and reason appear before scores.
2. Only the selected cat is requested and it remains fully contained.
3. All five radar labels are readable without clipping.
4. `0–100` aligns above the numeric column.
5. Opening a second factor closes the first.
6. Opening a second category closes the first and keeps the new heading visible.
7. All 7 preview and all 42 detail text IDs are reachable.
8. Question composition shows counts only.
9. Every method sheet opens, closes, traps no focus, and restores focus.
10. Canvas and cat failures preserve the factor list, texts, and exit actions.
11. Preview finish retains the saved result; unsaved preview omits finish.

- [ ] **Step 2: Verify keyboard-only behavior**

Tab through the factor rows, category rows, bottom sheets, continue, pause, and finish. Confirm visible focus, correct `aria-expanded`, no hidden focusable content, and Escape/close-button recovery.

- [ ] **Step 3: Record evidence and run final commands**

```powershell
npm.cmd test
npm.cmd run check
git diff --check
```

Record viewport, mode, factor/category opened, fallback injected, observed result-text count, network image count, and pass/fail. Do not record answers.

- [ ] **Step 4: Commit verification adjustments and evidence**

```powershell
git add app/css/styles.css .superpowers/sdd/2026-07-27-result-progressive-disclosure/browser-smoke.md
git commit -m "test: verify progressive result UI"
```

## Self-Review

- Spec coverage: hero priority, title reason, labeled radar, score bars, one-factor/one-category disclosure, 7-category grouping, count-only composition, four fixed explanations, preview continue/pause/finish, save/delete failures, and mobile/a11y verification each have an explicit task.
- Completeness scan: every step names its target interface, validation, and error-handling behavior.
- Type consistency: `createQuestionComposition`, `createResultDisclosureModel`, `appendBottomSheetLauncher`, `onPausePreview`, and `onFinishPreview` use the same names throughout.
- Historical integrity: the plan changes DOM projection only; it never rewrites ResultSnapshot or Q-006 records.
- Scope: compact history and comparison controls are deliberately in a separate plan; Q-013 data and T-007 sharing remain gated.
