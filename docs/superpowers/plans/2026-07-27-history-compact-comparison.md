# T-008A History Compact Cards and Explicit Comparison Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 履歴カードを猫・称号・日時・20/50問・結果表示だけへ絞り、固定比較バーから互換2件を明示実行で比較できる履歴サブシステムを実装する。

**Architecture:** `main.js`は保存履歴、Q-012 manifest、画像adapter、route callbackを合成するcomposition rootのままとする。`renderHistoryScreen`の既存3引数interfaceを維持し、猫遅延読込に限って任意の第4引数`dependencies`を追加する。比較モード、最大2件の選択、互換表示、管理メニューの開閉はpresentation内の一時UI状態に閉じ、ResultSnapshot、保存履歴、比較純粋関数、storage interfaceは変更しない。

**Tech Stack:** HTML / CSS / JavaScript ES Modules、Node.js `node:test`、既存Fake DOM、Canvasや外部ライブラリの追加なし

## Global Constraints

- 対応タスク・機能はT-008A / F-009 / F-010 / F-013 / F-015とする。
- 通常カードの初期表示は、小さな猫サムネイル、称号、実施日時、20問／50問badge、`結果を見る`だけとする。
- 通常カードへ5因子スコア、全結果文、内部`characterId`、版情報、個別削除を並べない。
- `結果を見る`は保存済みResultSnapshotを使って通常結果画面を開き、診断時文章を現在定義から再生成しない。
- 履歴下部へ比較用の固定action barを置く。通常時は`結果を比較する`を表示する。
- 比較モードではカード全体を選択toggleとし、最大2件、1件目と互換な結果だけを2件目候補として有効にする。
- 非互換カードへ既存`comparisonErrorMessage(code)`の理由を表示する。
- 2件選択しても自動遷移せず、`選択した2件を比較`の明示操作だけが`actions.onCompare(comparison)`を呼ぶ。
- 比較モードでは`キャンセル`と選択件数を表示する。
- headerの`…`管理メニューへ日時・20問／50問で識別できる個別削除、全削除、診断時version情報をまとめ、個別削除と全削除は既存main coordinatorの確認を必須とする。
- 固定header／固定footerはsafe areaを考慮し、本文末尾へ十分なpaddingを確保する。
- Q-012は各履歴カードに対応するmanifest entry 1件だけをviewport進入後に読み込み、approved altと画像失敗fallbackを維持する。
- `renderHistoryScreen(host, historyState, actions)`の先頭3引数と`data-result-id`を維持する。
- `compareResultSnapshots`、`loadResultHistory`、`deleteAllData`、既存route coordinatorを再利用する。
- Q-006の237結果文、診断時文章、ResultSnapshot schema、採点、称号判定、Q-012画像・altを変更しない。
- Q-013の未承認palette・香調を追加しない。
- 通常版へ外部送信処理を追加しない。
- 360px、320pxの200%相当、キーボード操作で固定要素の被りと横scrollを発生させない。

---

## File Structure

- Modify: `app/js/presentation/history-screen.js`
  - compact card、Q-012 thumbnail、比較UI状態、固定action bar、管理メニューを描画する。
- Modify: `app/js/main.js`
  - 保存履歴とroute callbackに、既存のQ-012画像adapterを加えてhistory presentationへ渡す。
- Modify: `app/css/styles.css`
  - compact card、thumbnail、管理header、固定比較bar、safe-area、本文bottom paddingを定義する。
- Modify: `app/tests/history-screen.test.js`
  - presentation interface、DOM、lazy image、比較状態、管理メニューを公開seamから検証する。
- Modify: `app/tests/app-shell.test.js`
  - 実storage→main coordinator→history→result/compare/deleteの結合動作を検証する。
- Modify: `app/tests/project-contract.test.js`
  - fixed action barとsafe-area CSSの静的契約を検証する。新しいtest fileは作らない。

## Shared Interfaces

```js
renderHistoryScreen(
  host,
  {
    status: "ok" | "error",
    results: ResultSnapshot[],
    factorLabels,
    titleLabels,
  },
  {
    operationNotice?,
    onOpenResult?(resultId),
    onCompare?(comparison),
    onDeleteResult?(resultId),
    onDeleteAll?(),
  },
  {
    resolveCharacterEntry?(characterId),
    loadCharacterImage?,
    decodeImage?,
    observeViewport?,
  } = {},
)
```

先頭3引数は既存interfaceを維持する。第4引数は任意であり、既存の3引数callerとpresentation testは引き続き有効とする。`onDeleteResult`とResultSnapshot削除interfaceを維持し、通常カードではなく管理メニューから呼び出す。

```js
// presentation内だけで保持し、storageへ保存しない。
{
  comparisonMode: boolean,
  selectedResultIds: string[], // 0..2
}
```

---

### Task 1: Compact History Cards with One Lazy Q-012 Thumbnail

**Files:**
- Modify: `app/js/presentation/history-screen.js:5-71`
- Modify: `app/js/main.js:198-243`
- Test: `app/tests/history-screen.test.js:9-134`
- Test: `app/tests/app-shell.test.js:43-140`

**Interfaces:**
- Consumes: `ResultSnapshot.characterId`, `ResultSnapshot.characterAssetVersion`, `actions.onOpenResult(resultId)`, validated `CharacterManifest`, existing `loadCharacterImage(entry, { decodeImage })`
- Produces: backwards-compatible `renderHistoryScreen(host, historyState, actions, dependencies = {})`; `.history-card[data-result-id]`; `.history-character-frame[data-character-state]`; one `結果を見る` action

- [ ] **Step 1: Replace the broad card assertion with a failing compact-card contract**

```js
test("T-008A F-009 renders only the compact normal-card contract", () => {
  const { host } = createFakeScreen();
  const target = snapshot({
    resultId: "00000000-0000-4000-8000-000000000101",
    completedAt: "2026-07-27T12:00:00.000Z",
    questionCount: 50,
  });
  const opened = [];

  renderHistoryScreen(
    host,
    { status: "ok", results: [target], ...screenLabels },
    { onOpenResult: (resultId) => opened.push(resultId) },
  );

  const card = collectElements(host).find(
    ({ className }) => className === "history-card",
  );
  const text = collectText(card);
  assert.equal(card.attributes.get("data-result-id"), target.resultId);
  assert.match(text, /五つの風を見渡す観測者/);
  assert.match(text, /50問 詳細結果/);
  assert.match(text, /結果を見る/);
  assert.doesNotMatch(
    text,
    /知性・想像力|診断時の副題|character-balanced|ipip-ja-50-v1|この結果を削除/,
  );

  collectElements(card).find(
    ({ tagName, textContent }) =>
      tagName === "button" && textContent === "結果を見る",
  ).dispatch("click");
  assert.deepEqual(opened, [target.resultId]);
});
```

- [ ] **Step 2: Run the compact-card test and verify red**

Run:

```powershell
node --test --test-name-pattern="compact normal-card contract" app/tests/history-screen.test.js
```

Expected: FAIL because the current card still renders factor scores, diagnostic texts, internal character ID, versions, and individual deletion.

- [ ] **Step 3: Replace `renderResultCard` with the minimal compact normal card**

```js
function appendCardIdentity(parent, snapshot, labels) {
  appendTextElement(
    parent,
    "h2",
    labels.titleLabels[snapshot.titleId] ?? snapshot.titleId,
    "history-title",
  );
  const metadata = parent.ownerDocument.createElement("p");
  metadata.className = "history-metadata";
  const time = appendTextElement(
    metadata,
    "time",
    formatCompletedAt(snapshot.completedAt),
  );
  time.setAttribute("datetime", snapshot.completedAt);
  appendTextElement(
    metadata,
    "span",
    snapshot.questionCount === 20 ? "20問 簡易プレビュー" : "50問 詳細結果",
    "history-mode-badge",
  );
  parent.append(metadata);
}

function renderResultCard(parent, snapshot, labels, actions, dependencies) {
  const card = parent.ownerDocument.createElement("article");
  card.className = "history-card";
  card.setAttribute("data-result-id", snapshot.resultId);
  renderHistoryThumbnail(card, snapshot, dependencies);
  appendCardIdentity(card, snapshot, labels);

  const openButton = appendTextElement(
    card,
    "button",
    "結果を見る",
    "primary-button history-open-result",
  );
  openButton.setAttribute("type", "button");
  openButton.addEventListener(
    "click",
    () => actions.onOpenResult?.(snapshot.resultId),
  );
  parent.append(card);
}
```

Delete the normal-card calls that render `factor-score-list`, all `renderedTexts`, per-card `renderVersions`, `この結果を削除`, and per-card comparison buttons. Do not delete the snapshot fields or storage operations.

- [ ] **Step 4: Run the compact-card test and verify green**

Run:

```powershell
node --test --test-name-pattern="compact normal-card contract" app/tests/history-screen.test.js
```

Expected: PASS.

- [ ] **Step 5: Move individual deletion out of normal cards without removing F-013**

Replace the existing per-card deletion assertion with this management-only contract:

```js
test("T-008A F-013 exposes individual deletion only through history management", () => {
  const { host } = createFakeScreen();
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000104",
  });
  const deleted = [];

  renderHistoryScreen(
    host,
    { status: "ok", results: [target], ...screenLabels },
    { onDeleteResult: (resultId) => deleted.push(resultId) },
  );

  const card = collectElements(host).find(
    ({ className }) => className === "history-card",
  );
  assert.doesNotMatch(collectText(card), /削除/);
  const deleteButton = collectElements(host).find(
    ({ tagName, textContent }) =>
      tagName === "button" && textContent.endsWith("この結果を削除"),
  );
  deleteButton.dispatch("click");
  assert.deepEqual(deleted, [target.resultId]);
});
```

Add the temporary accessible management disclosure immediately before the existing page-level delete-all action:

```js
function renderIndividualDeleteMenu(parent, results, actions) {
  const details = parent.ownerDocument.createElement("details");
  details.className = "history-individual-management";
  appendTextElement(details, "summary", "履歴を整理");
  for (const snapshot of results) {
    const button = appendTextElement(
      details,
      "button",
      `${formatCompletedAt(snapshot.completedAt)} ${
        snapshot.questionCount === 20 ? "20問" : "50問"
      } この結果を削除`,
      "danger-button",
    );
    button.setAttribute("type", "button");
    button.addEventListener(
      "click",
      () => actions.onDeleteResult?.(snapshot.resultId),
    );
  }
  parent.append(details);
}
```

Keep the existing `main.js` confirmation and `deleteResultSnapshot(...)` callback. In `app-shell.test.js`, open `履歴を整理`, click the dated delete button, and retain the existing cancellation/success assertions. Task 3 folds this temporary disclosure into the final `…` header menu.

The normal-card assertion remains:

```js
  assert.equal(
    collectElements(card).filter(
      ({ tagName, textContent }) =>
        tagName === "button" && textContent.includes("削除"),
    ).length,
    0,
  );
```

- [ ] **Step 6: Add a failing thumbnail lazy-load test**

```js
test("T-008A F-009 loads only the matching Q-012 thumbnail after viewport entry", async () => {
  const { host } = createFakeScreen();
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000102",
  });
  const image = host.ownerDocument.createElement("img");
  let onEnter;
  let requests = 0;

  renderHistoryScreen(
    host,
    { status: "ok", results: [target], ...screenLabels },
    {},
    {
      resolveCharacterEntry: () => characterEntry,
      observeViewport(_frame, callback) { onEnter = callback; },
      decodeImage: async () => image,
      async loadCharacterImage(entry, { decodeImage }) {
        requests += 1;
        assert.equal(entry.characterId, target.characterId);
        return { status: "loaded", image: await decodeImage(entry.imagePath), alt: entry.alt };
      },
    },
  );

  const frame = collectElements(host).find(
    ({ className }) => className === "history-character-frame",
  );
  assert.equal(frame.attributes.get("data-character-state"), "pending");
  assert.equal(requests, 0);
  assert.equal(typeof onEnter, "function");

  await onEnter();

  assert.equal(requests, 1);
  assert.equal(frame.attributes.get("data-character-state"), "loaded");
  assert.equal(
    collectElements(frame).filter(({ tagName }) => tagName === "img").length,
    1,
  );
});
```

Use this exact manifest fixture at the top of `history-screen.test.js`:

```js
const characterEntry = Object.freeze({
  characterId: "character-balanced",
  assetVersion: "character-balanced-v1",
  imagePath: "assets/characters/character-balanced.webp",
  width: 1024,
  height: 1024,
  alt: "五枚の葉のモビールを見上げて座る猫。",
  integrity: "sha256-gVfqsXoZbwa5AVZhAGwvT2via6MzHVbuVfrr3tK8seo=",
});
```

- [ ] **Step 7: Run the thumbnail test and verify red**

Run:

```powershell
node --test --test-name-pattern="matching Q-012 thumbnail" app/tests/history-screen.test.js
```

Expected: FAIL because `renderHistoryScreen` does not yet accept thumbnail dependencies or render a thumbnail frame.

- [ ] **Step 8: Implement the one-entry lazy thumbnail helper**

```js
function renderHistoryThumbnail(parent, snapshot, dependencies) {
  const frame = parent.ownerDocument.createElement("div");
  frame.className = "history-character-frame";
  frame.setAttribute("data-character-state", "unavailable");
  parent.append(frame);

  let entry = null;
  try {
    entry = dependencies.resolveCharacterEntry?.(snapshot.characterId) ?? null;
  } catch {
    entry = null;
  }
  if (
    !entry
    || entry.characterId !== snapshot.characterId
    || entry.assetVersion !== snapshot.characterAssetVersion
    || typeof dependencies.observeViewport !== "function"
    || typeof dependencies.loadCharacterImage !== "function"
    || typeof dependencies.decodeImage !== "function"
  ) {
    appendTextElement(
      frame,
      "span",
      "猫画像を利用できません",
      "history-character-fallback",
    );
    return;
  }

  frame.setAttribute("data-character-state", "pending");
  appendTextElement(
    frame,
    "span",
    entry.alt,
    "history-character-fallback",
  );
  let started = false;
  const loadOnEntry = async () => {
    if (started) return;
    started = true;
    try {
      const result = await dependencies.loadCharacterImage(entry, {
        decodeImage: dependencies.decodeImage,
      });
      if (result.status === "loaded") {
        result.image.className = "history-character-image";
        result.image.setAttribute("alt", result.alt);
        result.image.setAttribute("width", String(entry.width));
        result.image.setAttribute("height", String(entry.height));
        frame.setAttribute("data-character-state", "loaded");
        frame.replaceChildren(result.image);
        return;
      }
    } catch {
      // Approved alt remains visible.
    }
    frame.setAttribute("data-character-state", "unavailable");
  };
  try {
    dependencies.observeViewport(frame, loadOnEntry);
  } catch {
    frame.setAttribute("data-character-state", "unavailable");
  }
}
```

Update only the additive function parameter:

```js
export function renderHistoryScreen(
  host,
  historyState,
  actions = {},
  dependencies = {},
) {
  // Existing first three arguments keep their meaning.
}
```

- [ ] **Step 9: Run the compact and thumbnail presentation tests**

Run:

```powershell
node --test --test-name-pattern="compact normal-card contract|matching Q-012 thumbnail" app/tests/history-screen.test.js
```

Expected: 2 tests PASS.

- [ ] **Step 10: Add a failing app-shell test for production thumbnail wiring**

```js
test("T-008A F-009 wires one history thumbnail through the Q-012 adapters", async () => {
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000103",
  });
  let onEnter;
  const requested = [];
  const harness = createAppHarness({
    hash: "#/history",
    storage: {
      getItem: () => JSON.stringify({
        schemaVersion: 1,
        updatedAt: "2026-07-27T12:00:00.000Z",
        progressByDiagnosis: {},
        results: [target],
      }),
    },
    observeViewport(_frame, callback) { onEnter = callback; },
    decodeImage: async (path) => {
      requested.push(path);
      return harness.host.ownerDocument.createElement("img");
    },
  });

  assert.deepEqual(requested, []);
  await onEnter();
  assert.equal(requested.length, 1);
  assert.match(requested[0], /character-balanced\.webp$/);
});
```

Extend `createAppHarness` with optional `decodeImage` and `observeViewport` arguments and pass them unchanged to `startApp`.

- [ ] **Step 11: Run the production-wiring test and verify red**

Run:

```powershell
node --test --test-name-pattern="wires one history thumbnail" app/tests/app-shell.test.js
```

Expected: FAIL because `renderHistoryRoute` does not pass the existing image adapters to `renderHistoryScreen`.

- [ ] **Step 12: Pass the existing adapters from the history coordinator**

```js
  function resolveHistoryCharacterEntry(characterId) {
    try {
      return resolveCharacterEntry(validatedCharacterManifest, characterId);
    } catch {
      return null;
    }
  }

  function renderHistoryRoute() {
    const effectiveStorage = getStorage();
    const operationNotice = historyNotice;
    historyNotice = null;
    renderHistoryScreen(
      screenHost,
      {
        ...loadResultHistory({ storage: effectiveStorage, now: nowProvider() }),
        factorLabels,
        titleLabels,
      },
      {
        operationNotice,
        onDeleteAll() {
          if (!requestConfirmation(
            "途中回答と診断結果をすべて削除します。削除後は復元できません。",
          )) return;
          const outcome = deleteAllData({
            storage: effectiveStorage,
            confirmed: true,
            now: nowProvider(),
          });
          historyNotice = outcome.status === "ok"
            ? { kind: "success", text: "端末内の途中回答と診断結果をすべて削除しました。" }
            : { kind: "error", text: "端末内データを削除できませんでした。もう一度お試しください。" };
          renderCurrentRoute();
        },
        onCompare(comparison) {
          setRoute(
            `#/compare?before=${encodeURIComponent(comparison.beforeResultId)}&after=${encodeURIComponent(comparison.afterResultId)}`,
          );
        },
        onOpenResult(resultId) {
          setRoute(`#/result?resultId=${encodeURIComponent(resultId)}`);
        },
      },
      {
        resolveCharacterEntry: resolveHistoryCharacterEntry,
        loadCharacterImage,
        decodeImage: effectiveDecodeImage,
        observeViewport: effectiveObserveViewport,
      },
    );
  }
```

Keep the current bodies of `onDeleteResult`, `onDeleteAll`, `onCompare`, and `onOpenResult`. Presentation moves `onDeleteResult` from each normal card into the management menu.

- [ ] **Step 13: Run Task 1 tests**

Run:

```powershell
node --test app/tests/history-screen.test.js app/tests/app-shell.test.js
```

Expected: all tests PASS, including normal-card individual-delete omission, management-only individual deletion, saved-result routing, missing-result fallback, comparison compatibility, delete-all confirmation, and single-observer tests.

- [ ] **Step 14: Commit compact cards and thumbnail wiring**

```powershell
git add app/js/presentation/history-screen.js app/js/main.js app/tests/history-screen.test.js app/tests/app-shell.test.js
git commit -m "feat: compact history result cards"
```

---

### Task 2: Explicit Two-Result Comparison Mode

**Files:**
- Modify: `app/js/presentation/history-screen.js:73-182`
- Test: `app/tests/history-screen.test.js:151-222`
- Test: `app/tests/app-shell.test.js:188-239`

**Interfaces:**
- Consumes: `compareResultSnapshots(first, second)`, `comparisonErrorMessage(code)`, `actions.onCompare(comparison)`
- Produces: `.history-comparison-bar`; normal `結果を比較する`; compare-mode `.history-card-select-toggle`; `aria-pressed`; `キャンセル`; `選択した2件を比較`; selected count 0..2

- [ ] **Step 1: Replace the auto-transition comparison test with a failing explicit-action test**

```js
test("T-008A F-010 selects at most two compatible cards and compares only on explicit action", () => {
  const { host } = createFakeScreen();
  const newest = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000111",
    completedAt: "2026-07-27T12:00:00.000Z",
  });
  const older = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000112",
    completedAt: "2026-07-26T12:00:00.000Z",
  });
  const incompatible = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000113",
    questionCount: 20,
  });
  const comparisons = [];

  renderHistoryScreen(
    host,
    {
      status: "ok",
      results: [newest, older, incompatible],
      ...screenLabels,
    },
    { onCompare: (comparison) => comparisons.push(comparison) },
  );

  clickButton(host, "結果を比較する");
  let toggles = collectElements(host).filter(
    ({ className }) => className === "history-card-select-toggle",
  );
  assert.equal(toggles.length, 3);
  toggles[0].dispatch("click");

  toggles = collectElements(host).filter(
    ({ className }) => className === "history-card-select-toggle",
  );
  assert.equal(toggles[0].attributes.get("aria-pressed"), "true");
  assert.equal(toggles[1].disabled, false);
  assert.equal(toggles[2].disabled, true);
  assert.match(collectText(host), /設問数が異なるため比較できません/);

  toggles[1].dispatch("click");
  assert.deepEqual(comparisons, []);
  assert.match(collectText(host), /2件選択中/);

  clickButton(host, "選択した2件を比較");
  assert.equal(comparisons.length, 1);
  assert.equal(comparisons[0].beforeResultId, older.resultId);
  assert.equal(comparisons[0].afterResultId, newest.resultId);
});
```

Add this helper once in `history-screen.test.js`:

```js
function clickButton(host, label) {
  const button = collectElements(host).find(
    ({ tagName, textContent }) =>
      tagName === "button" && textContent === label,
  );
  assert.ok(button, `missing button: ${label}`);
  button.dispatch("click");
}
```

- [ ] **Step 2: Run the explicit-action test and verify red**

Run:

```powershell
node --test --test-name-pattern="compares only on explicit action" app/tests/history-screen.test.js
```

Expected: FAIL because the existing second selection immediately calls `onCompare` and has no fixed action bar.

- [ ] **Step 3: Add presentation-local comparison state and pure helpers**

```js
export function renderHistoryScreen(
  host,
  historyState,
  actions = {},
  dependencies = {},
) {
  let comparisonMode = false;
  let selectedResultIds = [];

  function selectedSnapshots() {
    return selectedResultIds.map((resultId) =>
      historyState.results.find((snapshot) => snapshot.resultId === resultId)
    );
  }

  function comparisonAgainstFirst(snapshot) {
    const [first] = selectedSnapshots();
    return first ? compareResultSnapshots(first, snapshot) : null;
  }

  function toggleResult(snapshot) {
    if (selectedResultIds.includes(snapshot.resultId)) {
      selectedResultIds = selectedResultIds.filter(
        (resultId) => resultId !== snapshot.resultId,
      );
    } else if (
      selectedResultIds.length < 2
      && comparisonAgainstFirst(snapshot)?.compatible !== false
    ) {
      selectedResultIds = [...selectedResultIds, snapshot.resultId];
    }
    render();
  }

  function cancelComparison() {
    comparisonMode = false;
    selectedResultIds = [];
    render();
  }

  function executeComparison() {
    if (selectedResultIds.length !== 2) return;
    const [first, second] = selectedSnapshots();
    const comparison = compareResultSnapshots(first, second);
    if (comparison.compatible) actions.onCompare?.(comparison);
  }

  function render() {
    const documentObject = host.ownerDocument ?? document;
    const main = documentObject.createElement("main");
    main.className = "app-shell history-screen";
    const backLink = appendTextElement(
      main,
      "a",
      "開始画面へ戻る",
      "text-link",
    );
    backLink.setAttribute("href", "#/start");
    appendTextElement(main, "h1", "診断結果の履歴");
    appendTextElement(
      main,
      "p",
      "結果はこの端末のブラウザ内にだけ保存されます。",
      "lead compact-lead",
    );
    if (actions.operationNotice) {
      const notice = appendTextElement(
        main,
        "p",
        actions.operationNotice.text,
        `notice ${actions.operationNotice.kind}-notice`,
      );
      notice.setAttribute(
        "role",
        actions.operationNotice.kind === "error" ? "alert" : "status",
      );
    }

    if (historyState.status === "error") {
      const error = appendTextElement(
        main,
        "p",
        "保存データを読み込めませんでした。既存データは変更していません。",
        "notice error-notice",
      );
      error.setAttribute("role", "alert");
    } else if (historyState.results.length === 0) {
      const empty = documentObject.createElement("section");
      empty.className = "status-card empty-state";
      appendTextElement(empty, "h2", "まだ結果がありません");
      appendTextElement(
        empty,
        "p",
        "診断が完了すると、この端末で過去の結果を振り返れます。",
      );
      main.append(empty);
    } else {
      const list = documentObject.createElement("div");
      list.className = "history-list";
      const [first] = selectedSnapshots();
      for (const snapshot of historyState.results) {
        if (!comparisonMode) {
          renderResultCard(
            list,
            snapshot,
            historyState,
            actions,
            dependencies,
          );
          continue;
        }
        const comparison = first && first.resultId !== snapshot.resultId
          ? compareResultSnapshots(first, snapshot)
          : null;
        renderSelectableCard(
          list,
          snapshot,
          historyState,
          dependencies,
          selectedResultIds,
          comparison,
          toggleResult,
        );
      }
      main.append(list);
    }

    if (historyState.status === "ok" && historyState.results.length > 0) {
      renderComparisonBar(
        main,
        comparisonMode,
        selectedResultIds.length,
        {
          onEnter() {
            comparisonMode = true;
            selectedResultIds = [];
            render();
          },
          onCancel: cancelComparison,
          onExecute: executeComparison,
        },
      );
    }
    host.replaceChildren(main);
  }

  render();
}
```

The UI state must not be added to `historyState`, ResultSnapshot, localStorage, URL, or `main.js`.

- [ ] **Step 4: Render a real full-card button in comparison mode**

```js
function renderSelectableCard(
  parent,
  snapshot,
  labels,
  dependencies,
  selectedResultIds,
  comparison,
  onToggle,
) {
  const card = parent.ownerDocument.createElement("article");
  card.className = "history-card comparison-mode";
  card.setAttribute("data-result-id", snapshot.resultId);

  const toggle = card.ownerDocument.createElement("button");
  toggle.className = "history-card-select-toggle";
  toggle.setAttribute("type", "button");
  const selected = selectedResultIds.includes(snapshot.resultId);
  toggle.setAttribute(
    "aria-pressed",
    selected ? "true" : "false",
  );
  toggle.disabled = comparison?.compatible === false
    || (selectedResultIds.length === 2 && !selected);
  renderHistoryThumbnail(toggle, snapshot, dependencies);
  appendCardIdentity(toggle, snapshot, labels);
  toggle.addEventListener("click", () => onToggle(snapshot));
  card.append(toggle);

  if (comparison?.compatible === false) {
    appendTextElement(
      card,
      "p",
      comparisonErrorMessage(comparison.code),
      "comparison-reason",
    );
  }
  parent.append(card);
}
```

Using a native `button` makes the complete visible card the toggle without placing interactive descendants inside an interactive container.

- [ ] **Step 5: Add the fixed comparison action bar**

```js
function renderComparisonBar(
  parent,
  comparisonMode,
  selectedCount,
  actions,
) {
  const bar = parent.ownerDocument.createElement("nav");
  bar.className = "history-comparison-bar";
  bar.setAttribute("aria-label", "診断結果の比較");

  if (!comparisonMode) {
    const enter = appendTextElement(
      bar,
      "button",
      "結果を比較する",
      "primary-button",
    );
    enter.setAttribute("type", "button");
    enter.addEventListener("click", actions.onEnter);
  } else {
    appendTextElement(
      bar,
      "p",
      `${selectedCount}件選択中`,
      "history-comparison-count",
    );
    const cancel = appendTextElement(
      bar,
      "button",
      "キャンセル",
      "secondary-button",
    );
    cancel.setAttribute("type", "button");
    cancel.addEventListener("click", actions.onCancel);
    const compare = appendTextElement(
      bar,
      "button",
      "選択した2件を比較",
      "primary-button",
    );
    compare.setAttribute("type", "button");
    compare.disabled = selectedCount !== 2;
    compare.addEventListener("click", actions.onExecute);
  }
  parent.append(bar);
}
```

Do not call `executeComparison` from `toggleResult`.

- [ ] **Step 6: Run the explicit-action test and verify green**

Run:

```powershell
node --test --test-name-pattern="compares only on explicit action" app/tests/history-screen.test.js
```

Expected: PASS.

- [ ] **Step 7: Add a failing cancel-and-reset test**

```js
test("T-008A F-010 cancels comparison and restores normal result cards", () => {
  const { host } = createFakeScreen();
  const first = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000114",
  });

  renderHistoryScreen(
    host,
    { status: "ok", results: [first], ...screenLabels },
    {},
  );
  clickButton(host, "結果を比較する");
  collectElements(host).find(
    ({ className }) => className === "history-card-select-toggle",
  ).dispatch("click");
  clickButton(host, "キャンセル");

  assert.equal(
    collectElements(host).filter(
      ({ className }) => className === "history-card-select-toggle",
    ).length,
    0,
  );
  assert.match(collectText(host), /結果を見る/);
  assert.match(collectText(host), /結果を比較する/);
  assert.doesNotMatch(collectText(host), /件選択中/);
});
```

- [ ] **Step 8: Run both comparison tests**

Run:

```powershell
node --test --test-name-pattern="T-008A F-010" app/tests/history-screen.test.js
```

Expected: both tests PASS.

- [ ] **Step 9: Replace the app-shell auto-route test with an explicit-route test**

```js
test("T-008A F-010 changes route only after explicit comparison execution", () => {
  const before = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000115",
    completedAt: "2026-07-26T12:00:00.000Z",
  });
  const after = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000116",
    completedAt: "2026-07-27T12:00:00.000Z",
  });
  const { host, windowObject } = createAppHarness({
    hash: "#/history",
    storage: {
      getItem: () => JSON.stringify({
        schemaVersion: 1,
        updatedAt: "2026-07-27T12:00:00.000Z",
        progressByDiagnosis: {},
        results: [after, before],
      }),
    },
  });

  clickButton(host, "結果を比較する");
  const toggles = collectElements(host).filter(
    ({ className }) => className === "history-card-select-toggle",
  );
  toggles[0].dispatch("click");
  toggles[1].dispatch("click");
  assert.equal(windowObject.location.hash, "#/history");

  clickButton(host, "選択した2件を比較");
  assert.equal(
    windowObject.location.hash,
    `#/compare?before=${before.resultId}&after=${after.resultId}`,
  );
});
```

- [ ] **Step 10: Run the app-shell comparison test**

Run:

```powershell
node --test --test-name-pattern="explicit comparison execution" app/tests/app-shell.test.js
```

Expected: PASS without changing the existing `main.js` `onCompare(comparison)` callback body.

- [ ] **Step 11: Run Task 2 regression tests**

Run:

```powershell
node --test app/tests/history-screen.test.js app/tests/app-shell.test.js
```

Expected: all tests PASS. No comparison route is created until explicit execution.

- [ ] **Step 12: Commit explicit comparison mode**

```powershell
git add app/js/presentation/history-screen.js app/tests/history-screen.test.js app/tests/app-shell.test.js
git commit -m "feat: add explicit history comparison mode"
```

---

### Task 3: Header Management Menu, Safe Areas, and Final Verification

**Files:**
- Modify: `app/js/presentation/history-screen.js:73-182`
- Modify: `app/css/styles.css:154-228`
- Modify: `app/css/styles.css:470-516`
- Modify: `app/tests/history-screen.test.js:92-149`
- Modify: `app/tests/app-shell.test.js:82-187`
- Modify: `app/tests/project-contract.test.js`

**Interfaces:**
- Consumes: `actions.onDeleteResult(resultId)`, `actions.onDeleteAll()`, each saved `ResultSnapshot.versionTuple`, existing main confirmation copies, `deleteResultSnapshot`, and `deleteAllData`
- Produces: `.history-header`; `button.history-management-toggle[aria-expanded]`; `.history-management-menu`; fixed `.history-comparison-bar`; safe-area CSS contract

- [ ] **Step 1: Add a failing management-menu presentation test**

```js
test("T-008A F-013 moves individual delete, delete-all, and versions into the header management menu", () => {
  const { host } = createFakeScreen();
  const target = createTestResultSnapshot({
    resultId: "00000000-0000-4000-8000-000000000121",
  });
  const deleted = [];
  let deleteAllCalls = 0;

  renderHistoryScreen(
    host,
    { status: "ok", results: [target], ...screenLabels },
    {
      onDeleteResult: (resultId) => deleted.push(resultId),
      onDeleteAll: () => { deleteAllCalls += 1; },
    },
  );

  const toggle = collectElements(host).find(
    ({ className }) => className === "history-management-toggle",
  );
  assert.equal(toggle.textContent, "…");
  assert.equal(toggle.attributes.get("aria-label"), "履歴の管理");
  assert.equal(toggle.attributes.get("aria-expanded"), "false");
  const menu = collectElements(host).find(
    ({ className }) => className === "history-management-menu",
  );
  assert.equal(menu.hidden, true);

  toggle.dispatch("click");

  assert.equal(toggle.attributes.get("aria-expanded"), "true");
  assert.equal(menu.hidden, false);
  assert.match(collectText(menu), /この結果を削除/);
  assert.match(collectText(menu), /端末内データをすべて削除/);
  assert.match(collectText(menu), /診断時のバージョン/);
  assert.match(collectText(menu), /mvp-0.1.0/);
  collectElements(menu).find(
    ({ tagName, textContent }) =>
      tagName === "button" && textContent.endsWith("この結果を削除"),
  ).dispatch("click");
  assert.deepEqual(deleted, [target.resultId]);
  clickButton(host, "端末内データをすべて削除");
  assert.equal(deleteAllCalls, 1);
});
```

- [ ] **Step 2: Run the management-menu test and verify red**

Run:

```powershell
node --test --test-name-pattern="header management menu" app/tests/history-screen.test.js
```

Expected: FAIL because delete-all is currently a page-bottom button and version details are rendered inside each card.

- [ ] **Step 3: Implement the header and hidden management menu**

```js
function renderHistoryHeader(parent, historyState, actions) {
  const header = parent.ownerDocument.createElement("header");
  header.className = "history-header";
  const headingGroup = header.ownerDocument.createElement("div");
  appendTextElement(headingGroup, "h1", "診断結果の履歴");
  appendTextElement(
    headingGroup,
    "p",
    "結果はこの端末のブラウザ内にだけ保存されます。",
    "lead compact-lead",
  );
  header.append(headingGroup);

  if (historyState.status !== "ok") {
    parent.append(header);
    return;
  }

  const toggle = appendTextElement(
    header,
    "button",
    "…",
    "history-management-toggle",
  );
  toggle.setAttribute("type", "button");
  toggle.setAttribute("aria-label", "履歴の管理");
  toggle.setAttribute("aria-expanded", "false");

  const menu = header.ownerDocument.createElement("div");
  menu.className = "history-management-menu";
  menu.hidden = true;
  const deleteAll = appendTextElement(
    menu,
    "button",
    "端末内データをすべて削除",
    "danger-button",
  );
  deleteAll.setAttribute("type", "button");
  deleteAll.addEventListener("click", () => actions.onDeleteAll?.());

  for (const snapshot of historyState.results ?? []) {
    const details = menu.ownerDocument.createElement("details");
    appendTextElement(
      details,
      "summary",
      `${formatCompletedAt(snapshot.completedAt)} ${
        snapshot.questionCount === 20 ? "20問" : "50問"
      } 診断時のバージョン`,
    );
    const list = details.ownerDocument.createElement("dl");
    for (const [name, value] of Object.entries(snapshot.versionTuple)) {
      appendTextElement(list, "dt", name);
      appendTextElement(list, "dd", value);
    }
    const deleteOne = appendTextElement(
      details,
      "button",
      `${formatCompletedAt(snapshot.completedAt)} ${
        snapshot.questionCount === 20 ? "20問" : "50問"
      } この結果を削除`,
      "danger-button",
    );
    deleteOne.setAttribute("type", "button");
    deleteOne.addEventListener(
      "click",
      () => actions.onDeleteResult?.(snapshot.resultId),
    );
    details.append(list);
    details.append(deleteOne);
    menu.append(details);
  }

  toggle.addEventListener("click", () => {
    menu.hidden = !menu.hidden;
    toggle.setAttribute("aria-expanded", menu.hidden ? "false" : "true");
  });
  header.append(toggle);
  header.append(menu);
  parent.append(header);
}
```

In `render()`, keep the existing back link, replace the direct `h1` and lead
paragraph calls with the header helper, and then continue with the existing
notice/error/list rendering:

```js
const backLink = appendTextElement(
  main,
  "a",
  "開始画面へ戻る",
  "text-link",
);
backLink.href = "#/start";
renderHistoryHeader(main, historyState, actions);
```

For empty history, keep delete-all in the menu so stored progress can still be deleted. When `historyState.status === "error"`, show the existing read error and do not expose a destructive button.

- [ ] **Step 4: Run the management-menu test and verify green**

Run:

```powershell
node --test --test-name-pattern="header management menu" app/tests/history-screen.test.js
```

Expected: PASS.

- [ ] **Step 5: Update the existing app-shell individual/all delete tests to open the menu first**

```js
function openHistoryManagement(host) {
  const management = collectElements(host).find(
    ({ className }) => className === "history-management-toggle",
  );
  management.dispatch("click");
}

openHistoryManagement(host);
const deleteOne = collectElements(host).find(
  ({ tagName, textContent }) =>
    tagName === "button" && textContent.endsWith("この結果を削除"),
);
deleteOne.dispatch("click");
```

Place the helper at module scope. Keep the existing individual-delete cancellation/success assertions. In the separate existing all-delete test, open that test's own `host` before locating the button:

```js
openHistoryManagement(host);
const deleteAll = collectElements(host).find(
  ({ tagName, textContent }) =>
    tagName === "button" && textContent === "端末内データをすべて削除",
);
deleteAll.dispatch("click");
```

Keep the existing assertions:

```js
assert.equal(confirmations.length, 1);
assert.deepEqual(JSON.parse(raw).progressByDiagnosis, {});
assert.deepEqual(JSON.parse(raw).results, []);
```

- [ ] **Step 6: Run delete-all integration tests**

Run:

```powershell
node --test --test-name-pattern="deletes one saved result|clears progress and history|individual deletion only through history management|all-data deletion reachable" app/tests/app-shell.test.js app/tests/history-screen.test.js
```

Expected: PASS. The confirmation remains in `main.js`; presentation never deletes directly.

- [ ] **Step 7: Add failing static CSS assertions for fixed bars and safe areas**

Append to `app/tests/project-contract.test.js`:

```js
test("T-008A history fixed controls preserve safe areas and body clearance", async () => {
  const styles = await readProjectDocument("app/css/styles.css");
  const actionBar = styles.match(
    /\.history-comparison-bar\s*\{[\s\S]*?\}/,
  )?.[0] ?? "";
  const historyScreen = styles.match(
    /\.history-screen\s*\{[\s\S]*?\}/,
  )?.[0] ?? "";
  const management = styles.match(
    /\.history-management-menu\s*\{[\s\S]*?\}/,
  )?.[0] ?? "";

  assert.match(actionBar, /position:\s*fixed/);
  assert.match(actionBar, /env\(safe-area-inset-bottom\)/);
  assert.match(historyScreen, /padding-bottom:\s*calc\(/);
  assert.match(historyScreen, /env\(safe-area-inset-bottom\)/);
  assert.match(management, /position:\s*absolute/);
  assert.doesNotMatch(styles, /min-width:\s*3[2-9]\dpx/);
});
```

- [ ] **Step 8: Run the CSS contract test and verify red**

Run:

```powershell
node --test --test-name-pattern="history fixed controls" app/tests/project-contract.test.js
```

Expected: FAIL because the fixed comparison bar, management menu, and safe-area padding styles do not exist.

- [ ] **Step 9: Implement compact layout, fixed action bar, and safe-area clearance**

```css
.history-screen {
  position: relative;
  padding-bottom: calc(112px + env(safe-area-inset-bottom));
}

.history-header {
  position: sticky;
  z-index: 20;
  top: 0;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: max(12px, env(safe-area-inset-top));
  background: rgb(246 251 248 / 96%);
}

.history-management-toggle {
  flex: 0 0 auto;
  min-width: 44px;
  min-height: 44px;
}

.history-management-menu {
  position: absolute;
  z-index: 30;
  top: calc(100% + 8px);
  right: 0;
  width: min(320px, calc(100vw - 32px));
  max-height: min(70vh, 560px);
  overflow: auto;
  padding: 16px;
  border: 1px solid #bed4cc;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 16px 40px rgb(42 81 69 / 18%);
}

.history-card {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  padding: 16px;
}

.history-character-frame {
  display: grid;
  place-items: center;
  width: 72px;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 14px;
  background: #eef5f1;
}

.history-character-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.history-open-result {
  grid-column: 1 / -1;
}

.history-card-select-toggle {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  grid-column: 1 / -1;
  gap: 14px;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
}

.history-comparison-bar {
  position: fixed;
  z-index: 40;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 12px 16px max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid #bed4cc;
  background: rgb(255 255 255 / 97%);
}

@media (max-width: 420px) {
  .history-card,
  .history-card-select-toggle {
    grid-template-columns: 60px minmax(0, 1fr);
  }

  .history-character-frame {
    width: 60px;
  }

  .history-comparison-bar {
    flex-wrap: wrap;
  }
}
```

Do not add a body or card `min-width`. Keep touch targets at least 44px.

- [ ] **Step 10: Run the CSS contract test and verify green**

Run:

```powershell
node --test --test-name-pattern="history fixed controls" app/tests/project-contract.test.js
```

Expected: PASS.

- [ ] **Step 11: Run all focused history tests**

Run:

```powershell
node --test app/tests/history-screen.test.js app/tests/app-shell.test.js app/tests/project-contract.test.js
```

Expected: all tests PASS, including compact cards, one-entry thumbnail loading, explicit comparison, cancel, result routing, delete-all confirmation, missing-result fallback, and CSS safe-area contract.

- [ ] **Step 12: Run the full automated verification**

Run:

```powershell
npm.cmd test
npm.cmd run check
git diff --check
```

Expected:

- all Node tests PASS;
- static project validation PASS;
- `git diff --check` exits 0;
- only existing line-ending warnings may appear.

- [ ] **Step 13: Run the 360px and 320px browser smoke**

Run:

```powershell
npm.cmd run dev
```

At `#/history`, verify in the browser:

1. 360px: normal cards show one lazy cat thumbnail, title, date, badge, and `結果を見る`; no horizontal scroll.
2. Before each card enters the viewport, its character request count is 0; after entry, that card requests only its selected WebP.
3. `結果を見る` opens `#/result?resultId=<UUID>` and displays the saved diagnostic text.
4. The fixed comparison bar does not cover the last card.
5. Compare mode is reachable by keyboard, each full card toggle exposes `aria-pressed`, and only compatible second results remain enabled.
6. Selecting two cards does not navigate; `選択した2件を比較` does.
7. `キャンセル` returns to normal cards and clears the selected count.
8. The `…` menu is keyboard reachable, reports `aria-expanded`, and exposes date/mode-labelled individual deletion, version details, and delete-all.
9. Individual-delete cancellation preserves the target, confirmation removes only that result, delete-all cancellation preserves progress/results, and delete-all confirmation clears both.
10. Repeat at 320px with 200% text zoom; header, menu, cards, and fixed bar do not overlap or create horizontal scroll.
11. Network inventory contains only same-origin static assets and the selected Q-012 thumbnail images.

Stop the local server after the smoke.

- [ ] **Step 14: Commit management, safe-area, and verification contracts**

```powershell
git add app/js/presentation/history-screen.js app/css/styles.css app/tests/history-screen.test.js app/tests/app-shell.test.js app/tests/project-contract.test.js
git commit -m "feat: finish compact history management"
```

---

## Plan Self-Review Results

- Spec 8.1 maps to Task 1 compact cards, saved-result routing, historical text preservation, and one-entry Q-012 thumbnail.
- Spec 8.2 maps to Task 2 fixed comparison bar, full-card native button toggles, maximum 2, compatibility reason, cancel, count, and explicit execution.
- Spec 8.3 maps to Task 3 header management menu, individual-delete and delete-all confirmation integration, version relocation, safe-area styles, and bottom clearance.
- Spec 12 history acceptance maps to Task 2 focused tests plus Task 3 360px/320px keyboard smoke.
- T-008A prohibitions are preserved: ResultSnapshot, Q-006 text/order, scoring, classification, Q-012 assets/alt, and Q-013 data are outside all edit lists.
- Interface names are consistent across tasks: `renderHistoryScreen`, `onOpenResult`, `onCompare`, `onDeleteResult`, `onDeleteAll`, `resolveCharacterEntry`, `loadCharacterImage`, `decodeImage`, `observeViewport`.
- No new persistence shape, comparison implementation, delete interface, route, package, or test file is introduced; the existing individual-delete interface is retained and moved into management.
