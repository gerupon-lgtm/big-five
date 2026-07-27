# Questionnaire Resume and Interruption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved common app header, balanced question layout, non-destructive interruption, state-aware single-progress resume, and confirmed replacement of an existing progress record.

**Architecture:** Keep `ProgressRecord` and `response-state.js` unchanged. Presentation receives separate `onPause` and `onDiscard` callbacks, while `main.js` coordinates routing and persistence. A small shared header helper establishes the official app name without coupling screen modules to routing or storage.

**Tech Stack:** HTML DOM APIs, CSS, JavaScript ES Modules, `localStorage`, Node `node:test`, fake DOM integration tests.

## Global Constraints

- Requirements authority: `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md` v1.10.
- Design authority: `docs/superpowers/specs/2026-07-27-result-history-resume-ui-design.md`.
- Task trace: T-008A / F-003 / F-004 / F-013 / F-015.
- Preserve the exact IPIP question text, order, answer values, `ProgressRecord` schema, and `continueHidden` behavior.
- Keep pause and discard as separate actions: pause performs no delete; discard requires confirmation and deletes only the current diagnosis progress.
- Resume only the most recent compatible progress for `big-five-ipip-ja`.
- Do not modify Q-006 result text, Q-012 assets, Q-013 content, scoring, title classification, or `prototype-big-five/`.
- Every code task follows red → green → focused regression → commit.

---

## File Structure

- Create `app/js/presentation/app-header.js`: shared official app-name header with an optional screen label and optional action.
- Modify `app/js/presentation/start-screen.js`: use the shared header and accept the state-aware resume label through presentation options.
- Modify `app/js/presentation/questionnaire-screen.js`: add `onPause`, retain `onDiscard`, and move discard into a secondary management disclosure.
- Modify `app/js/main.js`: coordinate pause, in-memory resume, shown-preview resume, and confirmed progress replacement.
- Modify `app/css/styles.css`: shared header, balanced question text, sticky questionnaire header, and management disclosure.
- Modify `app/tests/start-screen.test.js`: header and resume-label presentation contract.
- Modify `app/tests/questionnaire-screen.test.js`: exact callback and non-destructive pause UI contract.
- Modify `app/tests/app-shell.test.js`: state transitions, storage failures, and replacement confirmation.

### Task 1: Shared App Header and State-Aware Start Screen

**Files:**
- Create: `app/js/presentation/app-header.js`
- Modify: `app/js/presentation/start-screen.js`
- Modify: `app/css/styles.css`
- Test: `app/tests/start-screen.test.js`

**Interfaces:**
- Produces: `appendAppHeader(parent, { screenLabel = "", action = null, sticky = false }) -> HTMLElement`
- Produces: `renderStartScreen(host, versionModel, actions = {}, options = {})`, where `options.resumeLabel` is either `途中から再開する` or `残り30問を再開する`.
- Consumes later: result, history, and questionnaire presentation plans import `appendAppHeader`.

- [ ] **Step 1: Write failing tests for the official header and resume label**

Add tests equivalent to:

```js
test("T-008A S-001 renders the official app name without an arbitrary text split", () => {
  const { host } = createFakeScreen();
  renderStartScreen(host, versionModel, {});

  const brandParts = collectElements(host)
    .filter(({ className }) => className === "app-brand-part")
    .map(({ textContent }) => textContent);

  assert.deepEqual(brandParts, ["Big Five｜", "自己理解支援ツール"]);
});

test("T-008A F-004 renders the state-aware resume label once", () => {
  const { host } = createFakeScreen();
  renderStartScreen(host, versionModel, { onResume() {} }, {
    resumeLabel: "残り30問を再開する",
  });

  assert.equal(
    collectElements(host).filter(({ tagName, textContent }) =>
      tagName === "button" && textContent === "残り30問を再開する").length,
    1,
  );
});
```

- [ ] **Step 2: Run the focused test and verify the new contract fails**

Run:

```powershell
node --test app/tests/start-screen.test.js
```

Expected: FAIL because `app-header.js`, `app-brand-part`, and the fourth `options` argument are not implemented.

- [ ] **Step 3: Implement the shared header**

Create `app/js/presentation/app-header.js` with this public shape:

```js
import { appendTextElement } from "./screen-helpers.js";

export function appendAppHeader(parent, {
  screenLabel = "",
  action = null,
  sticky = false,
} = {}) {
  const header = parent.ownerDocument.createElement("header");
  header.className = sticky ? "app-header is-sticky" : "app-header";

  const brand = parent.ownerDocument.createElement("a");
  brand.className = "app-brand";
  brand.setAttribute("href", "#/start");
  appendTextElement(brand, "span", "Big Five｜", "app-brand-part");
  appendTextElement(brand, "span", "自己理解支援ツール", "app-brand-part");
  header.append(brand);

  if (screenLabel) {
    appendTextElement(header, "span", screenLabel, "app-screen-label");
  }
  if (action) {
    const button = appendTextElement(header, "button", action.label, "app-header-action");
    button.setAttribute("type", "button");
    button.addEventListener("click", action.onClick);
  }
  parent.append(header);
  return header;
}
```

Update `renderStartScreen` to call `appendAppHeader(main, { screenLabel: "はじめる" })`, replace the old app-name `h1` with `5つの傾向`, and use:

```js
const resumeLabel = options.resumeLabel === "残り30問を再開する"
  ? options.resumeLabel
  : "途中から再開する";
```

- [ ] **Step 4: Add non-breaking header and wrapping CSS**

Add focused rules:

```css
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 28px;
}

.app-header.is-sticky {
  position: sticky;
  z-index: 10;
  top: 0;
  padding-block: max(10px, env(safe-area-inset-top)) 10px;
  background: rgb(243 247 244 / 94%);
  backdrop-filter: blur(10px);
}

.app-brand {
  display: inline-flex;
  flex-wrap: wrap;
  color: #19332f;
  font-size: 0.78rem;
  font-weight: 750;
  letter-spacing: 0.04em;
  text-decoration: none;
}

.app-brand-part {
  white-space: nowrap;
}
```

- [ ] **Step 5: Run the focused test**

Run:

```powershell
node --test app/tests/start-screen.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit Task 1**

```powershell
git add app/js/presentation/app-header.js app/js/presentation/start-screen.js app/css/styles.css app/tests/start-screen.test.js
git commit -m "feat: add shared app header"
```

### Task 2: Separate Pause and Discard in the Questionnaire

**Files:**
- Modify: `app/js/presentation/questionnaire-screen.js`
- Modify: `app/css/styles.css`
- Test: `app/tests/questionnaire-screen.test.js`

**Interfaces:**
- Consumes: `appendAppHeader`.
- Produces question actions: exact `{ onAnswer, onBack, onPause, onDiscard }`.
- Produces preview-choice actions: exact `{ onPreviewDecision, onBack, onPause, onDiscard }`.
- `onPause()` never implies deletion; `onDiscard()` remains destructive and separately labeled.

- [ ] **Step 1: Update tests to require separate pause and discard callbacks**

Add or replace assertions with:

```js
const calls = [];
renderQuestionnaireScreen(
  host,
  questionViewModel(),
  questionActions({
    onPause: () => calls.push("pause"),
    onDiscard: () => calls.push("discard"),
  }),
);

const buttons = collectElements(host).filter(({ tagName }) => tagName === "button");
buttons.find(({ textContent }) => textContent === "中断してトップへ").dispatch("click");
buttons.find(({ textContent }) => textContent === "回答を破棄").dispatch("click");
assert.deepEqual(calls, ["pause", "discard"]);
```

Also assert both buttons have `type="button"` and that omission or an extra action key throws `QUESTIONNAIRE_SCREEN_INVALID`.

- [ ] **Step 2: Run the questionnaire test and verify failure**

Run:

```powershell
node --test app/tests/questionnaire-screen.test.js
```

Expected: FAIL because `onPause` is not part of the exact action contract.

- [ ] **Step 3: Implement the exact action contracts and sticky pause action**

Change the action key arrays to:

```js
const QUESTION_ACTION_KEYS = Object.freeze([
  "onAnswer",
  "onBack",
  "onPause",
  "onDiscard",
]);
const PREVIEW_ACTION_KEYS = Object.freeze([
  "onPreviewDecision",
  "onBack",
  "onPause",
  "onDiscard",
]);
```

Immediately after creating `main`, call:

```js
appendAppHeader(main, {
  screenLabel: viewModel.phase === "question" ? "回答中" : "20問完了",
  sticky: true,
  action: {
    label: "中断してトップへ",
    onClick: actions.onPause,
  },
});
```

Keep `回答を破棄` reachable in a low-emphasis management disclosure:

```js
const management = main.ownerDocument.createElement("details");
management.className = "questionnaire-management";
appendTextElement(management, "summary", "その他の操作");
addButton(management, "回答を破棄", "danger-button", actions.onDiscard);
main.append(management);
```

Remove the duplicate danger button from `.questionnaire-navigation`.

- [ ] **Step 4: Add balanced question styles**

Add:

```css
.questionnaire-question {
  max-width: 24em;
  font-size: clamp(1.35rem, 6vw, 2.1rem);
  line-height: 1.45;
  letter-spacing: -0.02em;
  text-align: left;
  text-wrap: balance;
}

.questionnaire-management {
  margin-top: 20px;
}
```

- [ ] **Step 5: Run the focused presentation test**

Run:

```powershell
node --test app/tests/questionnaire-screen.test.js
```

Expected: PASS, including exact-key rejection, single callback dispatch, non-submit buttons, and storage-error rendering.

- [ ] **Step 6: Commit Task 2**

```powershell
git add app/js/presentation/questionnaire-screen.js app/css/styles.css app/tests/questionnaire-screen.test.js
git commit -m "feat: add questionnaire pause action"
```

### Task 3: Coordinate Pause, Resume, and Confirmed Replacement

**Files:**
- Modify: `app/js/main.js`
- Test: `app/tests/app-shell.test.js`

**Interfaces:**
- Consumes: the separate `onPause`/`onDiscard` actions and `renderStartScreen(..., options)`.
- Produces: `pauseCurrentProgress()` with no storage mutation.
- Produces: state-aware resume label and existing `continueAfterPreview(...)` shown-preview conversion.
- Keeps: `discardCurrentProgress()` and `discardProgress(...)` unchanged as the destructive path.

- [ ] **Step 1: Add failing integration tests for pause and in-memory resume**

Add:

```js
test("T-008A F-004 pauses to start without deleting compatible progress", () => {
  let raw = null;
  const { host, windowObject } = createAppHarness({
    storage: { getItem: () => raw, setItem(_key, value) { raw = value; } },
  });
  clickButton(host, "診断を始める");
  answerCurrent(host);
  const beforePause = raw;

  clickButton(host, "中断してトップへ");

  assert.equal(windowObject.location.hash, "#/start");
  assert.equal(raw, beforePause);
  assert.match(collectText(host), /途中から再開する/);
  clickButton(host, "途中から再開する");
  assert.match(collectText(host), /2 \/ 20問/);
});

test("T-008A F-004 keeps an unsaved progress resumable in the same session", () => {
  const { host } = createAppHarness({
    storage: { getItem: () => null, setItem() { throw new Error("write failed"); } },
    confirmProvider: () => true,
  });
  clickButton(host, "診断を始める");
  answerCurrent(host);
  clickButton(host, "中断してトップへ");
  assert.match(collectText(host), /途中から再開する/);
  clickButton(host, "途中から再開する");
  assert.match(collectText(host), /2 \/ 20問/);
});
```

- [ ] **Step 2: Add failing integration tests for new-start cancellation and confirmation**

Use a queued confirmation result and assert cancellation has zero writes and zero UUID creation:

```js
test("T-008A S-001 confirms before replacing the recent progress", () => {
  const existing = createProgressRecord({
    definition: DiagnosticDefinition,
    meta: appMeta,
    progressId: "00000000-0000-4000-8000-000000000198",
    now: "2026-07-27T12:00:00.000Z",
  });
  let raw = JSON.stringify({
    schemaVersion: 1,
    updatedAt: "2026-07-27T12:00:00.000Z",
    progressByDiagnosis: {
      [DiagnosticDefinition.diagnosisId]: existing,
    },
    results: [],
  });
  let confirmed = false;
  let writes = 0;
  let uuidCalls = 0;
  const { host } = createAppHarness({
    storage: {
      getItem: () => raw,
      setItem(_key, value) { writes += 1; raw = value; },
    },
    confirmProvider: () => confirmed,
    uuidProvider: () => {
      uuidCalls += 1;
      return "00000000-0000-4000-8000-000000000199";
    },
  });

  clickButton(host, "診断を始める");
  assert.equal(writes, 0);
  assert.equal(uuidCalls, 0);
  assert.match(collectText(host), /途中から再開する/);

  confirmed = true;
  clickButton(host, "診断を始める");
  assert.equal(writes, 1);
  assert.equal(uuidCalls, 1);
  assert.match(collectText(host), /1 \/ 20問/);
});
```

Extend the local test harness signature so the UUID spy is actually injected:

```diff
-function createAppHarness({ hash = "#/start", storage, confirmProvider = () => true } = {}) {
+function createAppHarness({
+  hash = "#/start",
+  storage,
+  confirmProvider = () => true,
+  uuidProvider,
+} = {}) {
-    uuidProvider: () => `00000000-0000-4000-8000-${String(uuid++).padStart(12, "0")}`,
+    uuidProvider: uuidProvider ??
+      (() => `00000000-0000-4000-8000-${String(uuid++).padStart(12, "0")}`),
```

- [ ] **Step 3: Run the integration tests and verify failure**

Run:

```powershell
node --test app/tests/app-shell.test.js
```

Expected: FAIL because questionnaire actions do not yet pass `onPause`, start ignores `currentProgress`, and new start overwrites without confirmation.

- [ ] **Step 4: Implement pause and state-aware start rendering**

Add:

```js
function pauseCurrentProgress() {
  if (!currentProgress) {
    setRoute("#/start");
    return;
  }
  if (
    questionnaireStorageStatus === "error" &&
    !requestConfirmation(
      "この回答は端末に保存されていません。再読み込みやブラウザを閉じると失われます。トップへ戻りますか？",
    )
  ) {
    return;
  }
  setRoute("#/start");
}
```

Pass `onPause: pauseCurrentProgress` in both questionnaire phases. Do not remove `onDiscard`.

At the start route, prefer the live value only when present:

```js
const storedProgress = loaded.status === "ok" ? loaded.progress : null;
const resumeProgress = currentProgress ?? storedProgress;
const resumeLabel = resumeProgress?.mode === "preview20"
  && resumeProgress.previewDecision === "showPreview"
  && Object.keys(resumeProgress.answers).length === 20
  ? "残り30問を再開する"
  : "途中から再開する";
```

Pass `{ resumeLabel }` as the fourth argument to `renderStartScreen`.

- [ ] **Step 5: Confirm before replacing the recent progress**

Change `onStartNew` so all side effects happen after confirmation:

```js
onStartNew() {
  if (
    resumeProgress &&
    !requestConfirmation("現在の途中回答は破棄されます。新しく診断を始めますか？")
  ) {
    return;
  }
  const progress = createProgressRecord({
    definition: DiagnosticDefinition,
    meta: appMeta,
    progressId: uuidProvider(),
    now: nowProvider(),
  });
  liveResult = null;
  persistProgress(progress);
  setRoute("#/answer");
},
```

Keep the existing shown-preview branch in `onResume`; it remains the only place that transforms `preview20/showPreview` to question 21.

- [ ] **Step 6: Run focused regressions**

Run:

```powershell
node --test app/tests/start-screen.test.js app/tests/questionnaire-screen.test.js app/tests/app-shell.test.js
```

Expected: PASS. Existing `continueHidden`, discard cancellation, preview continuation, and 50-question completion tests remain green.

- [ ] **Step 7: Commit Task 3**

```powershell
git add app/js/main.js app/tests/app-shell.test.js
git commit -m "feat: preserve and resume paused answers"
```

### Task 4: Responsive and Keyboard Verification

**Files:**
- Modify if required: `app/css/styles.css`
- Test: `app/tests/project-contract.test.js`
- Document evidence: `.superpowers/sdd/2026-07-27-questionnaire-resume-interruption/browser-smoke.md`

**Interfaces:**
- Verifies the completed questionnaire/start subsystem without changing domain or storage schemas.

- [ ] **Step 1: Run all automated checks**

```powershell
npm.cmd test
npm.cmd run check
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 2: Verify the approved state matrix in a real browser**

At 360×800 and 320px with 200% equivalent text sizing, verify:

1. Pause after question 1 returns to start and resumes at question 2.
2. Pause at the 20-question choice returns to the choice.
3. A shown preview exposes `残り30問を再開する` and resumes at question 21.
4. Pause at questions 21–49 resumes at the first unanswered question.
5. A cancelled new start preserves the prior progress; a confirmed start replaces only that progress.
6. The header does not cover the question or answer options.
7. The official app name wraps only between its two `.app-brand-part` spans.
8. Keyboard focus reaches pause, answers, back, and discard without being trapped.

- [ ] **Step 3: Record exact browser evidence**

Create the smoke file with viewport, route, observed resume label/index, storage status, and pass/fail for each item. Do not record answer values.

- [ ] **Step 4: Commit verification adjustments and evidence**

```powershell
git add app/css/styles.css app/tests/project-contract.test.js .superpowers/sdd/2026-07-27-questionnaire-resume-interruption/browser-smoke.md
git commit -m "test: verify questionnaire interruption flow"
```

## Self-Review

- Spec coverage: common header, balanced wrapping, pause, separate discard, 20-choice resume, shown-preview resume, question 21–49 resume, storage failure, and confirmed replacement each have a task and test.
- Completeness scan: every step names its target interface, expected failure, and error-handling behavior.
- Type consistency: `appendAppHeader`, `renderStartScreen(..., options)`, `onPause`, and `pauseCurrentProgress` use the same names in all tasks.
- Scope: this plan deliberately excludes preview-finalization, result disclosure, compact history, Q-013 data, and sharing; those are separate plans.
