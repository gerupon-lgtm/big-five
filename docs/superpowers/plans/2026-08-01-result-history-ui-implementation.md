# Result and History UI Follow-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved result-screen disclosure, palette, aroma, action, and 20-question history-continuation behavior without changing scoring, title selection, saved-result schema, or the existing share-preview zoom feature.

**Architecture:** Keep result-state decisions in `app/js/main.js`, keep reusable result DOM behavior in `app/js/presentation/result-screen.js`, and keep presentation styling in `app/css/styles.css`. Identify a saved 20-question preview and its resumable progress with the existing `progressId`/`resultId` values rather than adding a storage field or schema version. Factor panels and Kokoro Aroma share one presentation-only exclusive disclosure controller; Kokoro Palette remains outside that controller and is always visible when allowed by the result state.

**Tech Stack:** HTML, CSS, JavaScript ES Modules, browser `localStorage`, Canvas palette swatches, Node.js `node:test`.

**Task/feature traceability:** Implement as `T-008C` against `F-005`, `F-006`, `F-007`, `F-009`, `F-010`, `F-011`, `F-012`, and `F-013`. Do not mark Q-006, Q-012, Q-013, or any presentation release as newly approved.

## Global Constraints

- Preserve the IPIP question order, scoring, title rules, factor order, result content, selected cat, and selected fragrance records.
- Do not modify `prototype-big-five/` or generated files under `app/content/`.
- Keep `connect-src 'none'` and add no runtime network request.
- Do not add a `StorageEnvelope` field or bump its schema version.
- Do not guess a relationship between legacy 20-question snapshots and progress records whose IDs differ.
- Preserve the existing share-screen image action labeled `拡大して見る`; only the five-factor result area must not gain that action.
- Keep palette selection diagnostic-neutral. It changes only the share-card color treatment.
- Keep all result controls usable at 320 px width, 200% zoom, and with keyboard/screen-reader operation.

---

### Task 1: Bind new 20-question previews to their progress record

**Files:**

- Modify: `app/js/main.js`
- Modify: `app/tests/app-shell.test.js`

**Interfaces:**

- `createSnapshot({ ..., resultId })` accepts an optional explicit result ID.
- A newly created preview20 snapshot uses `currentProgress.progressId` as `snapshot.resultId`.
- A detail50 snapshot continues to use a fresh UUID.
- `isShownPreviewProgressForSnapshot(progress, snapshot)` additionally requires `progress.progressId === snapshot.resultId`.

- [ ] **Step 1: Add failing identity and continuation tests**

  Add tests covering all four contracts:

  ```js
  test("preview20 snapshot reuses the active progressId", async () => {
    const app = await createStartedApp();
    const progressId = readEnvelope().progress.progressId;

    await answerTwentyAndShowPreview(app);

    const [snapshot] = readEnvelope().results;
    assert.equal(snapshot.mode, "preview20");
    assert.equal(snapshot.resultId, progressId);
  });

  test("detail50 snapshot gets a new resultId", async () => {
    const app = await createStartedApp();
    const progressId = readEnvelope().progress.progressId;

    await answerFiftyAndShowResult(app);

    const snapshot = readEnvelope().results.find(({ mode }) => mode === "detail50");
    assert.notEqual(snapshot.resultId, progressId);
  });

  test("history preview resumes only the progress with the same ID", async () => {
    seedPreviewAndProgress({ resultId: "progress-current", progressId: "progress-current" });
    const app = await createHistoryDetailApp();
    assert.equal(app.querySelector("[data-action='continue-preview']")?.hidden, false);
  });

  test("legacy unrelated IDs are not relinked by answer count and version", async () => {
    seedPreviewAndProgress({ resultId: "legacy-result", progressId: "new-progress" });
    const app = await createHistoryDetailApp();
    assert.equal(app.querySelector("[data-action='continue-preview']"), null);
  });
  ```

- [ ] **Step 2: Run the focused shell tests and confirm RED**

  Run:

  ```powershell
  node --test app/tests/app-shell.test.js
  ```

  Expected: the new preview ID equality and mismatched-ID continuation assertions fail against the current implementation.

- [ ] **Step 3: Implement explicit preview identity**

  Change snapshot construction so the caller can supply the ID:

  ```js
  function createSnapshot({
    answers,
    questionCount,
    mode,
    resultId = uuidProvider(),
  }) {
    if (!currentProgress) throw new Error("APP_PROGRESS_MISSING");
    return createDiagnosticResultSnapshot({
      answers,
      questionCount,
      mode,
      resultId,
      completedAt: nowProvider(),
      versionTuple: currentProgress.versionTuple,
      questionDefinitions: QuestionDefinitions,
      titleProfiles: TitleProfileDefinitions,
      resultTextDefinitions: ResultTextDefinitions,
      resultTextVersion: appMeta.diagnosticVersions.resultTextVersion,
      characterManifest: CharacterManifest,
      cardTemplateVersion: appMeta.cardTemplateVersion,
    });
  }
  ```

  Pass `resultId: currentProgress.progressId` only when saving the preview20 snapshot. Leave the detail50 call without `resultId` so it gets a new UUID.

- [ ] **Step 4: Require exact identity when loading continuation**

  Add the ID check before the current mode/count/version checks:

  ```js
  if (progress.progressId !== snapshot.resultId) {
    return false;
  }
  ```

  Do not migrate or rewrite legacy saved records.

- [ ] **Step 5: Re-run the focused test**

  Run `node --test app/tests/app-shell.test.js` and require all old and new tests to pass.

---

### Task 2: Make the five factor disclosures one-tap and globally exclusive with Aroma

**Files:**

- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/tests/result-screen.test.js`

**Interfaces:**

- `createExclusiveResultPanelGroup()` registers factor and Aroma members with `isOpen()` and `close()`.
- Opening a factor reveals every saved category for that factor in one white panel.
- Opening a factor closes another factor or Aroma; opening Aroma closes any factor.
- Closing or opening keeps the activated heading in view with `scrollIntoView({ block: "nearest" })` when available.
- Palette does not register with this controller.

- [ ] **Step 1: Replace the old two-stage expectations with failing one-stage tests**

  Add assertions equivalent to:

  ```js
  test("a factor opens all of its saved categories in one action", () => {
    const screen = renderResultFixture();
    const trigger = screen.querySelector("[data-factor-disclosure-trigger='intellect']");
    trigger.click();

    const panel = screen.querySelector("[data-factor-disclosure-panel='intellect']");
    assert.equal(panel.hidden, false);
    assert.equal(panel.querySelectorAll("[data-factor-category]").length, 7);
    assert.equal(panel.querySelectorAll("[data-category-disclosure-trigger]").length, 0);
  });

  test("factor and aroma disclosures are mutually exclusive", () => {
    const screen = renderResultFixture();
    const factor = screen.querySelector("[data-factor-disclosure-trigger='intellect']");
    const aroma = screen.querySelector("[data-fragrance-disclosure-trigger]");

    factor.click();
    aroma.click();

    assert.equal(screen.querySelector("[data-factor-disclosure-panel='intellect']").hidden, true);
    assert.equal(screen.querySelector("[data-fragrance-disclosure-panel]").hidden, false);
  });
  ```

  Also assert all five factors and Aroma start closed and no factor action says `拡大して見る`.

- [ ] **Step 2: Run the result-screen test and confirm RED**

  Run:

  ```powershell
  node --test app/tests/result-screen.test.js
  ```

  Expected: failures from nested category triggers and independent factor/Aroma open states.

- [ ] **Step 3: Add the shared disclosure controller**

  Implement the controller near the result rendering helpers:

  ```js
  function createExclusiveResultPanelGroup() {
    const members = [];

    return {
      register(member) {
        members.push(member);
      },
      closeOthers(activeMember) {
        for (const member of members) {
          if (member !== activeMember && member.isOpen()) {
            member.close();
          }
        }
      },
    };
  }
  ```

  Use native buttons with `aria-expanded` and panels with `hidden`; do not rely on CSS-only state.

- [ ] **Step 4: Flatten each factor panel**

  For every saved category, render a heading and its saved text directly in the factor panel:

  ```html
  <section class="factor-category" data-factor-category="current-tendency">
    <h4>今の傾向</h4>
    <p>...</p>
  </section>
  ```

  Remove the category-level disclosure buttons/panels. Preserve content order and text exactly as provided by the snapshot model.

- [ ] **Step 5: Register factors and Aroma and preserve viewport position**

  Create one controller in `renderSavedResultScreen`, pass it to factor and Aroma rendering, and call:

  ```js
  trigger.scrollIntoView?.({ block: "nearest" });
  ```

  after state changes. Never register Palette.

- [ ] **Step 6: Re-run the focused result-screen tests**

  Require all factor, Aroma, keyboard, and legacy result rendering tests to pass.

---

### Task 3: Replace the Palette accordion with three result-dependent circular choices

**Files:**

- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/css/styles.css`
- Modify: `app/tests/result-screen.test.js`
- Modify: `app/tests/frontend-tone.test.js`

**Interfaces:**

- Palette is a visible `<section>` when allowed by state, not `<details>`.
- It renders the approved title, subtitle, and explanation.
- Each choice draws only its primary/base color in a circle.
- Visible labels are `パレット1`, `パレット2`, `パレット3`.
- Selection is shown by a highlighted outer ring and centered check mark; `aria-pressed` and an accessible selected label remain.
- Palette selection does not close any result disclosure.

- [ ] **Step 1: Add failing DOM and accessibility tests**

  Assert the following structure and behavior:

  ```js
  const palette = screen.querySelector("[data-palette-selector]");
  assert.ok(palette);
  assert.equal(palette.matches("details"), false);
  assert.match(palette.textContent, /～あなたらしさから着想した色～/);
  assert.match(palette.textContent, /共有カードの色合いに反映されます/);
  assert.deepEqual(
    [...palette.querySelectorAll("[data-palette-option-label]")].map(({ textContent }) => textContent),
    ["パレット1", "パレット2", "パレット3"],
  );
  assert.equal(palette.textContent.includes("標準"), false);
  assert.equal(palette.textContent.includes("代替"), false);
  assert.equal(palette.textContent.includes("選択中"), false);
  ```

  Click an unselected option and assert it receives `aria-pressed="true"`, a check mark, and the active ring class without closing an open factor.

- [ ] **Step 2: Run result and tone tests and confirm RED**

  Run:

  ```powershell
  node --test app/tests/result-screen.test.js app/tests/frontend-tone.test.js
  ```

  Expected: current `<details>`, multicolor swatches, legacy labels, and closing/rerender behavior violate the new tests.

- [ ] **Step 3: Render an always-visible Palette section**

  Replace the summary/details structure with semantic heading, subtitle, explanatory copy, and a three-item radiogroup-like button set. Keep current callback wiring but remove `paletteExpanded` from the rerender state.

  Draw one filled circle from each option's primary color. Retain a neutral inner contrast border so a pale color remains visible.

- [ ] **Step 4: Style the selection without visible status prose**

  Add styles for:

  ```css
  .palette-choice[aria-pressed="true"] .palette-choice__swatch {
    box-shadow: 0 0 0 3px var(--surface), 0 0 0 6px var(--accent-strong);
  }

  .palette-choice__check {
    position: absolute;
    inset: 50% auto auto 50%;
    transform: translate(-50%, -50%);
  }
  ```

  Use three equal columns at narrow widths; do not introduce horizontal scrolling.

- [ ] **Step 5: Remove obsolete palette disclosure state from the app shell**

  Delete `paletteExpanded`/`presentationState.paletteExpanded` plumbing in `app/js/main.js`. A palette click may rerender the result, but it must not request an open/closed Palette state.

- [ ] **Step 6: Re-run focused tests**

  Require the result-screen, app-shell, and frontend-tone tests to pass.

---

### Task 4: Turn Aroma into a closed teaser that reveals all six candidates at once

**Files:**

- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/css/styles.css`
- Modify: `app/tests/result-screen.test.js`

**Interfaces:**

- Closed Aroma shows `ココロアロマ`, its subtitle, and three representative transparent images.
- Representative asset mapping:
  - `pause` -> `assets/share-card/aroma-pause-v1.png`
  - `reset` -> `assets/share-card/aroma-reset-v1.png`
  - `quiet-focus` -> `assets/share-card/aroma-quiet-focus-v1.png`
- One open action reveals three scene sections and two selected candidates per section.
- No scene-level accordion remains.
- The existing common non-diagnostic Aroma note remains below the six candidates.

- [ ] **Step 1: Add failing teaser and flattened-content tests**

  Verify three lazy-loaded `<img>` elements, intrinsic dimensions, useful alt text, a closed initial panel, six candidate cards after opening, and zero inner `<details>` or scene disclosure triggers.

- [ ] **Step 2: Run `node --test app/tests/result-screen.test.js` and confirm RED**

  Expected: current inner scene accordions and missing closed-state images fail.

- [ ] **Step 3: Add a fixed local teaser-asset map**

  Define and freeze a presentation-only map:

  ```js
  const FRAGRANCE_TEASER_ASSETS = Object.freeze({
    pause: { src: "./assets/share-card/aroma-pause-v1.png", width: 994, height: 857 },
    reset: { src: "./assets/share-card/aroma-reset-v1.png", width: 1243, height: 848 },
    "quiet-focus": { src: "./assets/share-card/aroma-quiet-focus-v1.png", width: 875, height: 960 },
  });
  ```

  Resolve the label/alt from the existing scene model. Do not add network image URLs.

- [ ] **Step 4: Flatten the open Aroma content**

  Render scene headings and both candidate cards directly inside the single Aroma panel. Preserve accord label, material example, descriptive copy, and common note.

- [ ] **Step 5: Style the teaser and expanded cards**

  Keep images visually balanced and uncropped with `object-fit: contain`. Use a three-column teaser at standard mobile width and allow the candidate content to stack vertically without unnatural Japanese line breaks.

- [ ] **Step 6: Re-run result-screen and tone tests**

  Require no missing image dimensions, no nested disclosure, and no horizontal overflow selectors.

---

### Task 5: Implement the approved result-state action matrix and share CTA placement

**Files:**

- Modify: `app/js/main.js`
- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/css/styles.css`
- Modify: `app/tests/app-shell.test.js`
- Modify: `app/tests/result-screen.test.js`
- Modify: `app/tests/frontend-tone.test.js`

**Interfaces:**

- `renderResult` passes `historyPreviewInProgress: historyDetail && previewProgress !== null`.
- `renderShareCallToAction()` renders exactly one in-flow share section when sharing is allowed.
- The result-screen action matrix is:

  | Result state | Main actions | Palette | Aroma | Share | History return |
  |---|---|---:|---:|---:|---:|
  | 50 direct | share, top, retry | yes | yes | yes | no |
  | 50 history | history return | yes | yes | yes | header + bottom |
  | 20 direct | 50-question continue, finish preview | yes | yes | yes | no |
  | 20 history in progress | 50-question continue, history return | no | yes | no | header + bottom |
  | 20 history finalized | history return | yes | yes | yes | header + bottom |

- [ ] **Step 1: Encode the five-state matrix as failing tests**

  Create table-driven assertions for action labels and absence. Explicitly assert:

  - `50問へ進む` replaces `あと30問続ける`.
  - No result screen contains `中断してトップへ`.
  - Direct preview contains `簡易プレビューで終了する`.
  - History in-progress preview contains only `50問へ進む` and `履歴一覧に戻る` as bottom actions.
  - History finalized preview shows Palette and share.
  - The share CTA appears once and contains `今回の結果を残してみませんか` and `結果を共有する`.
  - It does not contain `画像やテキストで共有できます` and is not sticky/fixed.

- [ ] **Step 2: Run app-shell, result-screen, and tone tests and confirm RED**

  Run:

  ```powershell
  node --test app/tests/app-shell.test.js app/tests/result-screen.test.js app/tests/frontend-tone.test.js
  ```

- [ ] **Step 3: Pass an explicit in-progress history-preview state**

  Compute the boolean from the already validated continuation result. Do not infer it from answer count alone. Use it to hide Palette and share for only that state.

- [ ] **Step 4: Remove the result-screen pause action and normalize labels**

  Keep questionnaire-level pause behavior unchanged. On the result screen, delete `onPausePreview` rendering, change the continuation label to `50問へ進む`, and keep the approved finish action only for a direct 20-question preview.

- [ ] **Step 5: Add the single normal-flow share CTA**

  Move share initiation out of the mixed utility button group. Render one white CTA card before the final navigation actions, with subtle botanical decoration and primary button styling. Do not use `position: sticky` or `position: fixed`.

- [ ] **Step 6: Normalize button hierarchy and boundary-card tone**

  Use primary styling only for share and 50-question continuation. Use secondary styling for top/history/result return and preview finish. Keep `ほかのヒントを見る` as an in-card control. Add `.boundary-notices` to the established white-card surface styles and preserve its exact dynamic messages and hidden-on-zero behavior.

- [ ] **Step 7: Re-run the focused tests**

  Require all five state fixtures and existing history navigation tests to pass.

---

### Task 6: Align result-screen ordering and preserve existing share zoom

**Files:**

- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/tests/result-screen.test.js`
- Verify only: `app/js/presentation/share-screen.js`
- Modify: `app/tests/share-screen.test.js` only if no existing zoom regression assertion exists

**Interfaces:**

- Result order keeps the radar and five factors, then Palette and Aroma, then contextual notes/share/navigation according to the approved design.
- Factor area has no zoom action.
- Share preview retains its existing `拡大して見る` action and behavior.

- [ ] **Step 1: Add result-order and zoom-regression assertions**

  Compare element positions using the existing fake-DOM collection order and assert:

  ```js
  const elements = collectElements(host);
  assert.ok(elements.indexOf(radar) < elements.indexOf(palette));
  assert.ok(elements.indexOf(palette) < elements.indexOf(aroma));
  ```

  Add or retain a share-screen test that finds and activates `拡大して見る`.

- [ ] **Step 2: Run result-screen and share-screen tests and confirm the order test is RED**

  Run:

  ```powershell
  node --test app/tests/result-screen.test.js app/tests/share-screen.test.js
  ```

- [ ] **Step 3: Reorder composition without changing domain data**

  Move the Palette/Aroma render calls after radar/factors. Do not duplicate either section and do not change the share-screen implementation unless the regression test reveals a real defect.

- [ ] **Step 4: Re-run focused tests**

  Require the new order and existing zoom action to pass together.

---

### Task 7: Update canonical documentation and task traceability

**Files:**

- Modify: `docs/tasks.md`
- Modify: `docs/screens.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/data-model.md`
- Modify: `docs/基本設計サマリ.md`
- Modify: `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md`

**Interfaces:**

- Documents describe the implemented five-state action matrix, globally exclusive result disclosures, always-visible Palette, Aroma teaser, and exact-ID continuation rule.
- `docs/data-model.md` explicitly records that no schema field/version was added.
- `docs/tasks.md` records `T-008C` mappings and verification evidence without changing unresolved release gates.

- [ ] **Step 1: Search all affected documents for superseded behavior**

  Run:

  ```powershell
  rg -n "あと30問続ける|中断してトップへ|標準|代替1|代替2|カテゴリ.*展開|paletteExpanded|20問.*履歴|拡大して見る" docs
  ```

- [ ] **Step 2: Update the canonical descriptions**

  Record only approved behavior. Distinguish the prohibited factor zoom action from the retained share-image zoom. State that legacy unrelated preview/progress IDs are intentionally not relinked.

- [ ] **Step 3: Run documentation and static checks**

  Run:

  ```powershell
  npm.cmd run check
  ```

  Expected: all document links, static imports, and repository policy checks pass.

---

### Task 8: Complete regression and browser verification

**Files:**

- Modify only if failures expose a scoped defect: result/history UI files and tests listed above
- Verify: `app/` runtime and QA preview artifact

- [ ] **Step 1: Run focused result/history tests**

  ```powershell
  node --test app/tests/app-shell.test.js app/tests/result-screen.test.js app/tests/share-screen.test.js app/tests/frontend-tone.test.js
  ```

- [ ] **Step 2: Run the full automated suite**

  ```powershell
  npm.cmd test
  npm.cmd run check
  npm.cmd run qa:preview:build
  ```

- [ ] **Step 3: Perform browser smoke verification**

  Verify widths 320, 360, 414, and 960 px plus 200% zoom for all five result states. Confirm:

  - no horizontal overflow or unnatural label wrapping;
  - five factors and Aroma start closed;
  - opening one factor or Aroma closes the previous member and retains the activated heading in view;
  - Palette remains visible/independent and its selected ring/check are legible;
  - in-progress 20 history hides Palette/share and has only continue/history actions;
  - finalized 20 history shows Palette/share;
  - 50 history has header and bottom `履歴一覧に戻る` and no top/retry;
  - share preview still opens and `拡大して見る` still works.

- [ ] **Step 4: Inspect the final diff**

  Use `git diff --check` and `git diff --stat`. Confirm no change under `prototype-big-five/`, `app/content/`, `_verify/`, or `tools/skills/` is included in this implementation.
