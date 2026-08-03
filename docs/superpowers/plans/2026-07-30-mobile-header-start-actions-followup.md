# Mobile Header and Start Actions Follow-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 回答画面を他画面と同じ通常ヘッダへ統一し、優先順位の高い中断文言を維持できる範囲で重なりを解消するとともに、開始画面の説明見出しと開始・再開ボタン配置を修正する。

**Architecture:** `appendAppHeader`自体の共通契約は変更せず、回答画面から画面固有の`sticky`指定を外す。開始画面では操作ボタンだけを`start-actions`へ集約し、CSS Gridの`auto-fit`で十分な幅では同幅2列、狭い幅では同幅1列にする。

**Tech Stack:** HTML / CSS / JavaScript ES Modules、Node.js `node:test`、Codex in-app Chromiumによる実画面QA

## Global Constraints

- 対応タスクはT-008A、対応機能はF-001、F-003、F-004とする。
- 中断文言は`中断してトップへ`、`回答を中断する`、`回答を中断`の順で、320px、360px、414pxすべてに成立する最初の候補を採用する。
- 回答途中の保存、中断、再開、20問分岐、破棄の既存動作は変更しない。
- 開始、結果、履歴、比較と同じ通常ヘッダを回答画面にも使用する。
- 結果画面の別途承認済み仕様、採点、保存形式、共有、Q-012、Q-013は変更しない。

---

### Task 1: 回答画面を通常ヘッダへ統一する

**Files:**
- Modify: `app/tests/questionnaire-screen.test.js`
- Modify: `app/js/presentation/questionnaire-screen.js`
- Verify: `app/js/presentation/app-header.js`

**Interfaces:**
- Consumes: `appendAppHeader(parent, { action })`
- Produces: 設問回答中と20問完答分岐で、通常の`.app-header`と同一の中断操作
- Preserves: `actions.onPause()`、`actions.onAnswer()`、`actions.onBack()`、`actions.onDiscard()`

- [ ] **Step 1: 通常ヘッダを要求する失敗テストを書く**

`app/tests/questionnaire-screen.test.js`の既存T-008Aヘッダテストを、次の契約へ変更する。

```js
test("T-008A S-002 uses the standard shared header and keeps discard in secondary management", () => {
  for (const [viewModel, actions] of [
    [questionViewModel(), questionActions()],
    [previewViewModel(), previewActions()],
  ]) {
    const { host } = createFakeScreen();
    renderQuestionnaireScreen(host, viewModel, actions);

    const header = collectElements(host)
      .find(({ className }) => className === "app-header");
    assert.ok(header);
    assert.equal(
      collectElements(host)
        .filter(({ className }) => className === "app-header is-sticky").length,
      0,
    );
    assert.equal(
      collectElements(header)
        .find(({ className }) => className === "app-header-action")
        .textContent,
      "中断してトップへ",
    );
    const management = collectElements(host)
      .find(({ className }) => className === "questionnaire-management");
    assert.ok(management);
    assert.equal(management.tagName, "details");
    assert.match(collectText(management), /その他の操作.*回答を破棄/);
  }
});
```

- [ ] **Step 2: 失敗を確認する**

Run:

```powershell
node --test app/tests/questionnaire-screen.test.js
```

Expected: `app-header`が見つからずFAIL。現在は`app-header is-sticky`であることを確認する。

- [ ] **Step 3: 設問中と20問分岐からsticky指定を外す**

`app/js/presentation/questionnaire-screen.js`の2か所を次へ変更する。

```js
appendAppHeader(main, {
  action: {
    label: "中断してトップへ",
    onClick: actions.onPause,
  },
});
```

`sticky: true`だけを削除し、文言とcallbackは維持する。

- [ ] **Step 4: 集中テストを通す**

Run:

```powershell
node --test app/tests/questionnaire-screen.test.js app/tests/app-header.test.js app/tests/frontend-tone.test.js
```

Expected: 全件PASS。`app-header.js`に変更がないことを`git diff -- app/js/presentation/app-header.js`で確認する。

- [ ] **Step 5: 320px、360px、414pxで文言候補を判定する**

実アプリの設問回答画面と20問分岐画面で、各幅について次を記録する。

```js
{
  documentWidth: [document.documentElement.scrollWidth, document.documentElement.clientWidth],
  brandRight: document.querySelector(".app-brand").getBoundingClientRect().right,
  actionLeft: document.querySelector(".app-header-action").getBoundingClientRect().left,
  noOverlap:
    document.querySelector(".app-brand").getBoundingClientRect().right <=
    document.querySelector(".app-header-action").getBoundingClientRect().left
}
```

`中断してトップへ`で3幅すべて`noOverlap: true`なら文言を維持する。1幅でも成立しない場合だけ、テストと実装の文言を`回答を中断する`へ変更して再測定し、それでも成立しない場合だけ`回答を中断`へ変更する。

- [ ] **Step 6: Task 1をコミットする**

```powershell
git add -- app/tests/questionnaire-screen.test.js app/js/presentation/questionnaire-screen.js
git commit -m "fix: unify questionnaire header"
```

### Task 2: 開始画面の見出しと操作配置を修正する

**Files:**
- Modify: `app/tests/start-screen.test.js`
- Modify: `app/tests/frontend-tone.test.js`
- Modify: `app/js/presentation/start-screen.js`
- Modify: `app/css/styles.css`
- Modify: `docs/screens.md`
- Modify: `docs/tasks.md`
- Modify: `docs/superpowers/specs/2026-07-30-ai-literacy-tone-alignment-design.md`

**Interfaces:**
- Consumes: `actions.onStartNew()`、`actions.onResume()`、`options.resumeLabel`
- Produces: `#start-tool-overview-title`、`.start-actions`
- Preserves: `診断を始める`、`途中から再開する`、`残り30問を再開する`のcallbackと条件分岐

- [ ] **Step 1: 新しい見出しと操作グループを要求する失敗テストを書く**

`app/tests/start-screen.test.js`へ次の検証を追加する。

```js
test("T-008A S-001 labels the tool overview and groups equal-width start actions", () => {
  const { host } = createFakeScreen();

  renderStartScreen(host, versionModel, {
    onStartNew() {},
    onResume() {},
  });

  const overview = collectElements(host)
    .find(({ className }) => className === "start-overview");
  const actions = collectElements(overview)
    .find(({ className }) => className === "start-actions");
  const actionButtons = collectElements(actions)
    .filter(({ tagName }) => tagName === "button");

  assert.equal(overview.attributes.get("aria-labelledby"), "start-tool-overview-title");
  assert.equal(
    collectElements(overview)
      .find(({ tagName }) => tagName === "h2")
      .textContent,
    "このツールについて",
  );
  assert.equal(actionButtons.length, 2);
  assert.deepEqual(
    actionButtons.map(({ textContent }) => textContent),
    ["診断を始める", "途中から再開する"],
  );
  assert.doesNotMatch(collectText(overview), /Big Fiveについて/);
});
```

`app/tests/frontend-tone.test.js`へ次のCSS契約を追加する。

```js
test("T-008A gives start actions equal tracks with visible spacing and a narrow fallback", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");
  assert.match(
    styles,
    /\.start-actions\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(150px,\s*1fr\)\)[^}]*gap:\s*12px/s,
  );
  assert.match(
    styles,
    /\.start-actions\s+\.primary-button,\s*\.start-actions\s+\.secondary-button\s*\{[^}]*width:\s*100%[^}]*margin:\s*0/s,
  );
});
```

- [ ] **Step 2: 失敗を確認する**

Run:

```powershell
node --test app/tests/start-screen.test.js app/tests/frontend-tone.test.js
```

Expected: `このツールについて`、`.start-actions`、対応CSSがないためFAIL。

- [ ] **Step 3: 見出しと操作グループを実装する**

`app/js/presentation/start-screen.js`で見出しを変更する。

```js
overview.setAttribute("aria-labelledby", "start-tool-overview-title");
const overviewTitle = appendTextElement(
  overview,
  "h2",
  "このツールについて",
);
overviewTitle.id = "start-tool-overview-title";
```

説明文の後に操作グループを作り、開始・再開ボタンをその子にする。

```js
const startActions = documentObject.createElement("div");
startActions.className = "start-actions";

// 既存の開始・再開ボタン生成をstartActionsへ追加する。

overview.append(startActions);
```

button label、`type="button"`、click callback、`resumeLabel`のfallbackは変更しない。

- [ ] **Step 4: 同幅2列と狭幅1列のCSSを実装する**

`app/css/styles.css`の開始画面規則を次へ変更する。

```css
.start-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.start-actions .primary-button,
.start-actions .secondary-button {
  width: 100%;
  margin: 0;
}
```

既存の`.start-overview .primary-button, .start-overview .secondary-button`の`margin-top`規則は削除する。

- [ ] **Step 5: 集中テストを通す**

Run:

```powershell
node --test app/tests/start-screen.test.js app/tests/frontend-tone.test.js app/tests/app-shell.test.js
```

Expected: 全件PASS。開始だけ、再開あり、残り30問再開の既存テストもPASS。

- [ ] **Step 6: 320px、360px、414pxで開始操作を確認する**

各幅の実画面で次を確認する。

- `このツールについて`と説明文が対応している。
- 2列表示時は両ボタンの`getBoundingClientRect().width`が同じで、左右間隔が12pxである。
- 狭幅で1列になった場合も両ボタンの幅が同じで、縦間隔が12pxである。
- 開始ボタンだけの場合は操作領域の利用可能幅を使う。
- documentの`scrollWidth === clientWidth`である。

- [ ] **Step 7: 文書を同期する**

次を現在実装へ合わせて更新する。

- `docs/screens.md`: 回答画面は通常ヘッダ、採用した中断文言、`このツールについて`、同幅操作
- `docs/tasks.md`: T-008Aの追補実装・検証
- `docs/superpowers/specs/2026-07-30-ai-literacy-tone-alignment-design.md`: 旧`Big Fiveについて`・sticky回答ヘッダ記述

- [ ] **Step 8: 全体検証を行う**

Run:

```powershell
npm.cmd test
npm.cmd run check
npm.cmd run content:validate
npm.cmd run qa:preview:build
git diff --check
```

Expected: 全コマンドexit 0。approved release、Q-012、Q-013、T-007の既知gateは未完了のまま維持する。

- [ ] **Step 9: Task 2をコミットする**

```powershell
git add -- app/tests/start-screen.test.js app/tests/frontend-tone.test.js app/js/presentation/start-screen.js app/css/styles.css docs/screens.md docs/tasks.md docs/superpowers/specs/2026-07-30-ai-literacy-tone-alignment-design.md
git commit -m "fix: refine mobile header and start actions"
```

### Task 3: レビュー・Pages確認・push

**Files:**
- Verify: all files changed by Tasks 1-2

**Interfaces:**
- Consumes: Tasks 1-2のコミットと実ブラウザQA
- Produces: レビュー済み`codex/big-five-q006`とQA Pages

- [ ] **Step 1: 計画全体の独立レビューを行う**

基準コミット`837f10c`からHEADまでを、追補設計と本計画に照らしてレビューする。Important以上を解消してから進む。

- [ ] **Step 2: originへpushする**

```powershell
git push origin codex/big-five-q006
```

- [ ] **Step 3: GitHub ActionsとPagesを確認する**

`Deploy QA preview to Pages`のbuild・deploy成功を確認し、公開先の360pxと414pxで開始・回答画面を確認する。回答ヘッダの重なりなし、採用文言、開始ボタン同幅・12px間隔、console warning／error 0件を記録する。

