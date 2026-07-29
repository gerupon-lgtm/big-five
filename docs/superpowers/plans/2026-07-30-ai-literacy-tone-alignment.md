# AI Literacy Tone Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 現在のBig Fiveアプリの配色・文面・機能を維持したまま、AIリテラシー検定の実装済みフロントエンドを基準に全画面共通ヘッダーの寸法と配置を整え、開始画面の主要内容だけを一つの白いパネルへまとめる。

**Architecture:** 既存の`appendAppHeader`が生成するDOMと画面別アクション契約は変更せず、共通ヘッダーの視覚契約をCSSで更新する。開始画面だけは`renderStartScreen`内に`start-main-panel`と`start-overview`を設け、見出し・説明・開始操作を一つの白いパネルへまとめる。履歴導線と診断情報はパネル外に残し、回答・結果・履歴・比較の本文構造およびdomain/infrastructure層には触れない。

**Tech Stack:** HTML/CSS、Vanilla JavaScript ES Modules、Node.js `node:test`、既存Fake DOMテスト、実ブラウザによる320px／360px／414px／960px QA

## Global Constraints

- 正典worktreeは`C:\Users\user\Documents\診断系アプリ開発\.worktrees\big-five-q006`、対象ブランチは`codex/big-five-q006`とする。
- 参照元は`C:\Users\user\Claude\Projects\AIリテラシー検定\ai-literacy-test\public\index.html`と`public/assets/css/style.css`であり、参照専用として変更しない。
- 現在の緑系アクセント、濃い文字色、淡い緑背景、`--font-sans`、表示文面、設問、採点、称号、猫、履歴、比較、保存、ルーティングを変更しない。
- AIリテラシー検定の青い配色、グラデーション、アイコン図形、表示文面は移植しない。
- 共通ヘッダーの基準値は、要素間`12px`、下padding`18px`、下margin`26px`、アイコン`38px × 38px`・角丸`10px`、アプリ名`1.02rem`・weight`700`・字間`0.04em`、副題`0.68rem`・字間`0.18em`とする。
- 開始画面の白い主パネルは角丸`14px`、内側余白`clamp(20px, 4vw, 34px)`とし、回答・20問分岐・結果・履歴・比較の本文全体を白いパネルで囲まない。
- 回答画面のstickyヘッダー、`中断してトップへ`、履歴の`トップ画面へ`、比較の`履歴へ戻る`を維持し、右側操作は1行表示とする。
- 320pxで共通ヘッダーを極端に縮小せず、横overflowとヘッダー行の折り返しを発生させない。
- 仮モックではなく実際のアプリを320px、360px、414px、960pxで表示し、開始・回答・結果・履歴・比較を確認する。
- `app/js/presentation/app-header.js`のDOM構造と公開関数`appendAppHeader(parent, { action, sticky })`は変更しない。
- `app/js/data/`、`content/source/`、`app/content/`、domain層、infrastructure層は変更しない。
- 実装はテストを先に失敗させ、各タスクの集中テストを通してからコミットする。

---

## File Map

| Path | Responsibility | Planned change |
|---|---|---|
| `app/js/presentation/app-header.js` | 全画面共通ヘッダーDOMと画面別アクション | 変更しない。既存DOMをCSSの契約対象として利用 |
| `app/css/styles.css` | 共通ヘッダー、開始画面主パネル、狭幅調整 | 基準寸法、開始画面パネル、320px向け縮小の下限を実装 |
| `app/js/presentation/start-screen.js` | S-001のDOM構成と開始・再開操作 | 見出し・説明・概要・操作を`start-main-panel`へまとめる |
| `app/tests/frontend-tone.test.js` | CSSの静的契約 | 参照値、狭幅下限、sticky・nowrap契約へ更新 |
| `app/tests/start-screen.test.js` | 開始画面DOM・文面・操作 | 主パネル内外の所属と二重カード防止を追加 |
| `app/tests/app-header.test.js` | 共通ヘッダーDOM・操作の回帰 | 変更せず集中テストに含める |
| `app/tests/questionnaire-screen.test.js` | sticky回答ヘッダーの回帰 | 変更せず集中テストに含める |
| `app/tests/result-screen.test.js` | 結果画面ヘッダー・本文の回帰 | 変更せず集中テストに含める |
| `app/tests/history-screen.test.js` | 履歴ヘッダー・操作の回帰 | 変更せず集中テストに含める |
| `app/tests/comparison-screen.test.js` | 比較ヘッダー・操作の回帰 | 変更せず集中テストに含める |
| `docs/superpowers/specs/2026-07-30-ai-literacy-tone-alignment-design.md` | 承認済みデザイン正典 | 実装・検証結果を追記 |
| `docs/screens.md` | 現行画面仕様 | 共通ヘッダーとS-001パネルの成立状態を同期 |
| `docs/tasks.md` | T-008Aトレーサビリティ | 実装、検証、commit、Pages確認を追記 |
| `.superpowers/sdd/2026-07-30-ai-literacy-tone-alignment/browser-smoke.md` | 実画面QA証跡 | 幅別・画面別の測定値、overflow、console結果を記録 |

### Task 1: 共通ヘッダーを参照実装の寸法体系へ合わせる

**Files:**
- Modify: `app/tests/frontend-tone.test.js:5-37`
- Modify: `app/css/styles.css:66-142`
- Modify: `app/css/styles.css:975-1026`
- Verify unchanged: `app/js/presentation/app-header.js`
- Verify unchanged: `app/tests/app-header.test.js`
- Verify unchanged: `app/tests/questionnaire-screen.test.js`
- Verify unchanged: `app/tests/result-screen.test.js`
- Verify unchanged: `app/tests/history-screen.test.js`
- Verify unchanged: `app/tests/comparison-screen.test.js`

**Interfaces:**
- Consumes: `appendAppHeader(parent, { action = null, sticky = false } = {})`
- Consumes: 既存class `.app-header`、`.app-brand`、`.app-mark`、`.app-brand-copy`、`.app-brand-name`、`.app-brand-subtitle`、`.app-header-action`
- Produces: 全画面で共有する同一DOMの寸法契約。画面別ラベル、href、click handler、sticky指定は変えない

- [ ] **Step 1: 現在の基準を記録する**

Run:

```powershell
git status --short --branch
git log -3 --oneline
```

Expected:

- branchは`codex/big-five-q006`
- `d366bdd docs: define AI literacy tone alignment`を含む
- この計画書以外に未説明の変更がない

- [ ] **Step 2: 共通ヘッダーの新しいCSS契約テストを書く**

`app/tests/frontend-tone.test.js`の2テストを次の3テストへ置き換える。

```js
test("T-008A S-001 applies the approved shared frontend tone", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");

  assert.match(styles, /--font-sans:\s*"Sawarabi Gothic",\s*"Hiragino Kaku Gothic ProN",\s*"Yu Gothic",\s*"Meiryo",\s*system-ui,\s*sans-serif/);
  assert.match(styles, /\.app-header\s*\{[^}]*gap:\s*12px[^}]*margin-bottom:\s*26px[^}]*padding-bottom:\s*18px[^}]*border-bottom:\s*1px solid #d6e4df/s);
  assert.match(styles, /\.app-mark\s*\{[^}]*flex:\s*0 0 38px[^}]*width:\s*38px[^}]*height:\s*38px[^}]*border-radius:\s*10px/s);
  assert.match(styles, /\.app-brand-name\s*\{[^}]*font-size:\s*1\.02rem[^}]*font-weight:\s*700[^}]*letter-spacing:\s*0\.04em/s);
  assert.match(styles, /\.app-brand-subtitle\s*\{[^}]*font-size:\s*0\.68rem[^}]*letter-spacing:\s*0\.18em/s);
  assert.match(styles, /\.app-brand-copy\s*\{[^}]*min-width:\s*0/s);
  assert.match(styles, /\.app-header-action\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(styles, /\.screen-kicker\s*\{[^}]*color:\s*#26705c[^}]*font-size:\s*0\.75rem/s);
  assert.match(styles, /\.screen-title\s*\{[^}]*font-size:\s*clamp\(1\.375rem,\s*1\.25rem \+ 0\.6vw,\s*1\.5rem\)/s);
});

test("T-008A keeps sticky header behavior without redefining brand geometry", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");
  const stickyHeader = styles.match(/\.app-header\.is-sticky\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(stickyHeader, /position:\s*sticky/);
  assert.match(stickyHeader, /top:\s*0/);
  assert.doesNotMatch(stickyHeader, /font-size:/);
  assert.doesNotMatch(stickyHeader, /\.app-mark/);
  assert.doesNotMatch(stickyHeader, /\.app-brand-name/);
  assert.doesNotMatch(stickyHeader, /\.app-brand-subtitle/);
});

test("T-008A keeps a readable narrow header and a single-line action", async () => {
  const styles = await readFile(new URL("../css/styles.css", import.meta.url), "utf8");
  const narrowStyles = styles.slice(styles.indexOf("@media (max-width: 380px)"));

  assert.match(narrowStyles, /\.app-header\s*\{[^}]*gap:\s*6px[^}]*flex-wrap:\s*nowrap/s);
  assert.match(narrowStyles, /\.app-mark\s*\{[^}]*flex-basis:\s*34px[^}]*width:\s*34px[^}]*height:\s*34px/s);
  assert.match(narrowStyles, /\.app-brand-name\s*\{[^}]*font-size:\s*0\.84rem/s);
  assert.match(narrowStyles, /\.app-brand-subtitle\s*\{[^}]*font-size:\s*0\.55rem/s);
  assert.match(narrowStyles, /\.app-header-action\s*\{[^}]*padding-inline:\s*0[^}]*font-size:\s*0\.72rem[^}]*white-space:\s*nowrap/s);
});
```

- [ ] **Step 3: テストが旧CSSを拒否することを確認する**

Run:

```powershell
node --test app/tests/frontend-tone.test.js
```

Expected: FAIL。少なくとも`.app-header`の`12px`、`.app-mark`の`38px`、`.app-brand-name`の`1.02rem`のいずれかが一致しない。

- [ ] **Step 4: 共通ヘッダーの基準CSSを実装する**

`app/css/styles.css`の共通ヘッダー規則を次へ更新する。

```css
.app-header {
  display: flex;
  width: 100%;
  min-height: 56px;
  align-items: center;
  gap: 12px;
  margin-bottom: 26px;
  padding-bottom: 18px;
  border-bottom: 1px solid #d6e4df;
  color: #45635d;
  flex-wrap: nowrap;
}

.app-header.is-sticky {
  position: sticky;
  z-index: 10;
  top: 0;
  padding-top: 12px;
  padding-inline: 12px;
  border-radius: 0 0 14px 14px;
  background: rgb(243 247 244 / 94%);
  box-shadow: 0 8px 24px rgb(42 81 69 / 8%);
  backdrop-filter: blur(10px);
}

.app-brand {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
  color: #1f6955;
}

.app-mark {
  display: grid;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 10px;
  background: #26705c;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
}

.app-brand-copy {
  display: grid;
  min-width: 0;
  gap: 1px;
  line-height: 1.2;
}

.app-brand-name {
  font-size: 1.02rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.app-brand-subtitle {
  color: #526b66;
  font-size: 0.68rem;
  line-height: 1.2;
  letter-spacing: 0.18em;
  white-space: nowrap;
}

.app-header-action {
  flex: 0 0 auto;
  min-height: 36px;
  margin-inline-start: auto;
  padding: 6px 10px;
  border: 0;
  background: transparent;
  color: #1f6955;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}
```

`.app-header.is-sticky`はbrandの寸法を再定義しない。`padding-top`と背景は回答中にviewport上端へ固定されたときの視認性だけを担う。

- [ ] **Step 5: 380px以下の極端な縮小を、読みやすい下限へ置き換える**

既存`@media (max-width: 380px)`内のheader関連規則だけを次へ置き換える。

```css
  .app-header {
    gap: 6px;
    flex-wrap: nowrap;
  }

  .app-header.is-sticky {
    padding-inline: 8px;
  }

  .app-brand {
    gap: 8px;
  }

  .app-mark {
    flex-basis: 34px;
    width: 34px;
    height: 34px;
    border-radius: 9px;
  }

  .app-brand-name {
    font-size: 0.84rem;
  }

  .app-brand-subtitle {
    font-size: 0.55rem;
    letter-spacing: 0.1em;
  }

  .app-header-action {
    margin-inline-start: auto;
    padding-inline: 0;
    font-size: 0.72rem;
    white-space: nowrap;
  }
```

現行の`24px`アイコン、`0.625rem`アプリ名、`0.4rem`副題は削除する。

- [ ] **Step 6: 共通ヘッダーと全利用画面の集中テストを通す**

Run:

```powershell
node --test app/tests/frontend-tone.test.js app/tests/app-header.test.js app/tests/questionnaire-screen.test.js app/tests/result-screen.test.js app/tests/history-screen.test.js app/tests/comparison-screen.test.js
```

Expected: 全件PASS。`appendAppHeader`の表示名、副題、href、click handler、sticky classに回帰がない。

- [ ] **Step 7: Task 1をコミットする**

```powershell
git add -- app/css/styles.css app/tests/frontend-tone.test.js
git commit -m "style: align shared header geometry"
```

Expected: commit成功。`app-header.js`と各画面presentationは変更されていない。

### Task 2: 開始画面の主要内容を一つの白いパネルへまとめる

**Files:**
- Modify: `app/tests/start-screen.test.js:9-90`
- Modify: `app/js/presentation/start-screen.js:8-55`
- Modify: `app/css/styles.css:144-225`
- Verify unchanged: `app/tests/app-shell.test.js`

**Interfaces:**
- Consumes: `appendAppHeader(main)`、`appendScreenHeading(parent, { kicker, title })`、`appendTextElement(parent, tagName, text, className)`
- Produces: `.start-main-panel`直下に`.screen-heading`、`.start-lead`、`.start-overview`を持つS-001 DOM
- Preserves: `actions.onStartNew()`、`actions.onResume()`、`options.resumeLabel`、`#/history`、`.diagnostic-version`

- [ ] **Step 1: 主パネル内外のDOM契約テストを書く**

`app/tests/start-screen.test.js`へ次のテストを追加する。

```js
test("T-008A S-001 groups primary start content into one panel without nesting a status card", () => {
  const { host } = createFakeScreen();

  renderStartScreen(host, versionModel, {
    onStartNew() {},
    onResume() {},
  });

  const main = host.children[0];
  const panel = collectElements(main)
    .find(({ className }) => className === "start-main-panel");
  const overview = collectElements(panel)
    .find(({ className }) => className === "start-overview");
  const secondaryNavigation = collectElements(main)
    .find(({ className }) => className === "start-secondary-navigation");
  const diagnosticVersion = collectElements(main)
    .find(({ className }) => className === "diagnostic-version");

  assert.ok(panel);
  assert.ok(overview);
  assert.equal(
    collectElements(panel)
      .filter(({ className }) => className === "screen-heading").length,
    1,
  );
  assert.equal(
    collectElements(panel)
      .filter(({ className }) => className === "lead start-lead").length,
    1,
  );
  assert.equal(
    collectElements(panel)
      .filter(({ className }) => className.includes("status-card")).length,
    0,
  );
  assert.equal(panel.children.includes(secondaryNavigation), false);
  assert.equal(panel.children.includes(diagnosticVersion), false);
  assert.equal(main.children.includes(secondaryNavigation), true);
  assert.equal(main.children.includes(diagnosticVersion), true);
});
```

- [ ] **Step 2: 新しいテストが開始画面の旧DOMを拒否することを確認する**

Run:

```powershell
node --test app/tests/start-screen.test.js
```

Expected: FAIL。`.start-main-panel`が見つからない。

- [ ] **Step 3: `renderStartScreen`を一枚パネル構造へ変更する**

`app/js/presentation/start-screen.js`で`appendAppHeader(main)`より後、secondary navigationより前を次の構成へ置き換える。文面、button label、callbackは変更しない。

```js
  appendAppHeader(main);

  const panel = documentObject.createElement("section");
  panel.className = "start-main-panel";
  appendScreenHeading(panel, {
    kicker: "SELF CHECK",
    title: "自分のことを知る",
  });
  appendTextElement(
    panel,
    "p",
    "Big Fiveは、性格傾向を5つの因子から捉える考え方です。本チェックではIPIP日本語50項目版を使用し、回答から現在の傾向を振り返ります。",
    "lead start-lead",
  );

  const overview = documentObject.createElement("section");
  overview.className = "start-overview";
  overview.setAttribute("aria-labelledby", "build-status-title");
  const statusTitle = appendTextElement(
    overview,
    "h2",
    "Big Fiveについて",
  );
  statusTitle.id = "build-status-title";
  appendTextElement(
    overview,
    "p",
    "20問の簡易プレビューから始め、希望に応じて50問の詳しい結果まで進められます。",
  );
  if (typeof actions.onStartNew === "function") {
    const startButton = appendTextElement(
      overview,
      "button",
      "診断を始める",
      "primary-button",
    );
    startButton.setAttribute("type", "button");
    startButton.addEventListener("click", actions.onStartNew);
  }
  if (typeof actions.onResume === "function") {
    const resumeLabel = options.resumeLabel === "残り30問を再開する"
      ? options.resumeLabel
      : "途中から再開する";
    const resumeButton = appendTextElement(
      overview,
      "button",
      resumeLabel,
      "secondary-button",
    );
    resumeButton.setAttribute("type", "button");
    resumeButton.addEventListener("click", actions.onResume);
  }
  panel.append(overview);
  main.append(panel);
```

既存の`status`変数、`start-overview-card status-card` class、`main.append(status)`は削除する。`secondaryNavigation`と`diagnosticVersion`の生成順、文面、hrefは維持する。

- [ ] **Step 4: 主パネルと内部概要のCSSを実装する**

`app/css/styles.css`の`.start-lead`、`.start-overview-card`周辺を次へ置き換える。共用`.status-card`は他画面のため変更しない。

```css
.start-main-panel {
  padding: clamp(20px, 4vw, 34px);
  border: 1px solid #bed4cc;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 30px rgb(42 81 69 / 10%);
}

.start-main-panel .screen-heading {
  margin-top: 0;
}

.start-lead {
  margin-top: 18px;
}

.start-overview {
  margin-top: 24px;
  padding-top: 22px;
  border-top: 1px solid #d6e4df;
}

.start-overview h2 {
  margin: 0;
  font-size: clamp(1.125rem, 1rem + 0.5vw, 1.35rem);
}

.start-overview p {
  margin: 12px 0 0;
  color: #526b66;
  line-height: 1.75;
}

.start-overview .primary-button,
.start-overview .secondary-button {
  margin-top: 18px;
}
```

既存の`.start-overview-card { margin-top: 28px; }`を削除する。`@media (max-width: 380px)`内の`.status-card`規則は他画面用として残し、`.start-main-panel`へ大きな角丸を再付与しない。

- [ ] **Step 5: 開始画面とアプリ結合テストを通す**

Run:

```powershell
node --test app/tests/start-screen.test.js app/tests/app-shell.test.js app/tests/frontend-tone.test.js
```

Expected:

- 全件PASS
- 新規開始と再開callbackが従来どおり1回だけ呼ばれる
- `SELF CHECK`と`自分のことを知る`は各1件
- 履歴リンクと`この診断について`は主パネル外
- `.status-card`の二重カードが主パネル内に存在しない

- [ ] **Step 6: Task 2をコミットする**

```powershell
git add -- app/js/presentation/start-screen.js app/css/styles.css app/tests/start-screen.test.js
git commit -m "style: frame start content in one panel"
```

Expected: commit成功。データ・domain・storage・routingファイルは変更されていない。

### Task 3: 実画面QA、文書同期、originへのpushを完了する

**Files:**
- Create: `.superpowers/sdd/2026-07-30-ai-literacy-tone-alignment/browser-smoke.md`
- Modify: `docs/superpowers/specs/2026-07-30-ai-literacy-tone-alignment-design.md`
- Modify: `docs/screens.md:67-110`
- Modify: `docs/screens.md:380-390`
- Modify: `docs/tasks.md:304-365`
- Verify: all files changed by Tasks 1-2

**Interfaces:**
- Consumes: Tasks 1-2のCSS/DOM、`npm.cmd run dev`、`npm.cmd run qa:preview:build`
- Produces: 実画面の幅別検証記録、現行仕様へ同期した文書、`origin/codex/big-five-q006`
- Preserves: T-007共有UI、Q-013カード背景色・香り提案を未完了のまま扱い、今回の完了に含めない

- [ ] **Step 1: 自動検証を実行する**

Run:

```powershell
npm.cmd test
npm.cmd run check
npm.cmd run content:validate
npm.cmd run qa:preview:build
git diff --check
```

Expected:

- `npm.cmd test`: 全件PASS、fail 0
- `npm.cmd run check`: exit code 0
- `npm.cmd run content:validate`: exit code 0。approved release未選択は既知の別gateとして維持
- `npm.cmd run qa:preview:build`: allowlist内の静的成果物を生成してexit code 0
- `git diff --check`: 出力なし

- [ ] **Step 2: 実アプリを起動する**

Run:

```powershell
npm.cmd run dev
```

Expected: `#/start`へアクセスできるローカルURLが表示される。このプロセスは実ブラウザQAが終わるまで維持する。

- [ ] **Step 3: 開始画面を4幅で検証する**

実ブラウザで`#/start`を320×800、360×800、414×896、960×900の順に表示し、各幅で次を確認する。

1. 緑の`5`アイコン、`Big Five 自己理解チェック`、`BIG FIVE SELF UNDERSTANDING`が同じ縦位置関係を保つ。
2. 414pxと960pxではアイコン38px、アプリ名`1.02rem`、副題`0.68rem`である。
3. 320pxと360pxではアイコン34px、アプリ名`0.84rem`、副題`0.55rem`を下限とし、文字切れがない。
4. ヘッダー下に1pxの区切り線と26pxの本文間隔がある。
5. `SELF CHECK`から開始・再開操作までが一つの白い主パネル内にある。
6. `Big Fiveについて`の周囲に別の大きな白カード、角丸、影がない。
7. `診断結果の履歴を見る`と`この診断について`は主パネル外にある。
8. `document.documentElement.scrollWidth === document.documentElement.clientWidth`。
9. console error 0、console warning 0。

- [ ] **Step 4: 回答・結果・履歴・比較の共通ヘッダーを検証する**

360×800を基準に実際の操作で次の画面へ遷移する。

| Screen | Route/state | Verify |
|---|---|---|
| 回答 | `#/answer` 1問目 | stickyヘッダー、右の`中断してトップへ`が1行、設問20px、回答文字16px、回答ボタン最低56px |
| 20問分岐 | 20問完答直後 | 共通ヘッダーのbrand寸法、右操作、既存3分岐 |
| 結果 | 20問previewまたは保存済みresult | 共通ヘッダーだけが変更され、称号・猫・理由・振り返り・5因子の順序は不変 |
| 履歴 | `#/history` | 右の`トップ画面へ`が1行、`履歴削除`とカード構造は不変 |
| 比較 | 互換な50問結果2件を選択 | 右の`履歴へ戻る`が1行、比較内容は不変 |

各画面で横overflow、固定要素の重なり、focus-visible、console error/warningを確認する。結果・履歴・比較の本文全体に新しい白い主パネルが付いていたら不合格とする。

- [ ] **Step 5: 320pxで右側操作が収まらない場合だけ、定義済み狭幅値を適用して再検証する**

Task 1の狭幅CSSを適用済みでもoverflowがある場合、文面やbrand名を変えず、`@media (max-width: 380px)`内を次の最小値までに限定して調整する。

```css
  .app-header {
    gap: 4px;
  }

  .app-brand {
    gap: 6px;
  }

  .app-mark {
    flex-basis: 32px;
    width: 32px;
    height: 32px;
  }

  .app-brand-name {
    font-size: 0.8rem;
  }

  .app-brand-subtitle {
    font-size: 0.52rem;
    letter-spacing: 0.08em;
  }

  .app-header-action {
    font-size: 0.7rem;
  }
```

この下限でもoverflowする場合は、文字省略・文面変更・折り返しで回避せず作業を止め、測定した`scrollWidth`、`clientWidth`、各要素幅を記録してユーザーへ承認を求める。

- [ ] **Step 6: 実ブラウザ証跡を書く**

`.superpowers/sdd/2026-07-30-ai-literacy-tone-alignment/browser-smoke.md`を作成する。commit欄には`git rev-parse --short HEAD`の出力、browser欄にはDevToolsの`navigator.userAgent`の出力を転記する。表の`scrollWidth/clientWidth`はDevToolsで取得した整数を記録し、同値であることを示す。

```markdown
# AI Literacy Tone Alignment Browser Smoke

- Date: 2026-07-30
- Branch: codex/big-five-q006
- Commit: `git rev-parse --short HEAD`で取得した検証対象
- Browser: `navigator.userAgent`で取得した実ブラウザ

| Viewport | Screen | Header mark/name/subtitle | scrollWidth/clientWidth | Console | Result |
|---|---|---|---|---|---|
| 320x800 | start | 34px / 13.44px / 8.8px | DevTools実測の同値整数 | 0 errors / 0 warnings | PASS |
| 360x800 | start | 34px / 13.44px / 8.8px | DevTools実測の同値整数 | 0 errors / 0 warnings | PASS |
| 414x896 | start | 38px / 16.32px / 10.88px | DevTools実測の同値整数 | 0 errors / 0 warnings | PASS |
| 960x900 | start | 38px / 16.32px / 10.88px | DevTools実測の同値整数 | 0 errors / 0 warnings | PASS |
| 360x800 | answer | 34px / 13.44px / 8.8px | DevTools実測の同値整数 | 0 errors / 0 warnings | PASS |
| 360x800 | result | 34px / 13.44px / 8.8px | DevTools実測の同値整数 | 0 errors / 0 warnings | PASS |
| 360x800 | history | 34px / 13.44px / 8.8px | DevTools実測の同値整数 | 0 errors / 0 warnings | PASS |
| 360x800 | compare | 34px / 13.44px / 8.8px | DevTools実測の同値整数 | 0 errors / 0 warnings | PASS |

## Confirmed invariants

- Common header labels and right-side actions are unchanged.
- Only the start screen has the new white main panel.
- Result, history, and comparison content structures are unchanged.
- Questionnaire typography and answer controls are unchanged.
- T-007 share UI and Q-013 palette/fragrance remain out of scope.
```

Step 5の狭幅下限を使用した場合は、320px／360px行のcomputed値を32px／12.8px／8.32pxへ更新し、理由を表の直後へ記録する。commitとbrowserの行は説明文のまま残さず、取得した実値へ置き換える。

- [ ] **Step 7: 正典文書を現在状態へ同期する**

次の内容を反映する。

1. `docs/superpowers/specs/2026-07-30-ai-literacy-tone-alignment-design.md`
   - 状態を`実装・検証済み`へ更新
   - 実際に採用した狭幅値を記録
   - 自動検証件数、実ブラウザ幅、console結果を記録
2. `docs/screens.md`
   - 共通レイアウトへ参照実装由来のheader寸法を追記
   - S-001へ「主要内容は一つの白い`start-main-panel`、履歴と診断情報は外」を追記
   - 既存の結果・履歴・比較本文は白い全面パネル化していないことを明記
3. `docs/tasks.md`
   - T-008Aへ2026-07-30トーン再調整の実装記録を追記
   - 自動検証結果、320／360／414／960px実ブラウザ結果を追記
   - T-007共有UI、Q-013カード背景色・香り提案は未完了のまま残す

- [ ] **Step 8: 文書同期を含む最終回帰を行う**

Run:

```powershell
npm.cmd test
npm.cmd run check
npm.cmd run content:validate
npm.cmd run qa:preview:build
git diff --check
git status --short
```

Expected:

- 自動検証はStep 1と同様に全件成功
- `git diff --check`は出力なし
- statusにはTask 3の証跡・文書変更だけが残る
- `dist/qa-preview`の生成物は既存ignore方針に従い、意図せずstageしない

- [ ] **Step 9: Task 3をコミットする**

```powershell
git add -- docs/superpowers/specs/2026-07-30-ai-literacy-tone-alignment-design.md docs/screens.md docs/tasks.md .superpowers/sdd/2026-07-30-ai-literacy-tone-alignment/browser-smoke.md
git commit -m "docs: record tone alignment verification"
```

Expected: commit成功。working treeがcleanになる。

- [ ] **Step 10: commit列と差分範囲を最終確認する**

Run:

```powershell
git status --short --branch
git log --oneline --decorate -6
git diff --stat origin/codex/big-five-q006...HEAD
```

Expected:

- branchは`codex/big-five-q006`
- design commit、plan commit、Tasks 1-3のcommitが並ぶ
- 差分はplan/spec、CSS、開始画面presentation、対応テスト、QA証跡、`docs/screens.md`、`docs/tasks.md`に限定される

- [ ] **Step 11: originへpushする**

Run:

```powershell
git push origin codex/big-five-q006
```

Expected: `origin/codex/big-five-q006`がHEADまで更新される。

- [ ] **Step 12: GitHub PagesのQA一時プレビューを確認する**

対象branchの最新Actions runが完了するまで確認し、公開されたQA一時プレビューで最低限次を再確認する。

1. 360pxの開始画面で共通ヘッダーと一枚の白い主パネルが表示される。
2. 360pxの回答画面で`中断してトップへ`が1行である。
3. 360pxの履歴画面で`トップ画面へ`が1行である。
4. 横overflowがなく、console error/warningが0件である。

Pagesだけで再現する不具合があれば、公開成功とはせず、localとの差分、asset URL、cache状態、Actions runを記録して修正する。

---

## Self-Review

- Spec coverage: 共通ヘッダー、開始画面だけの白いパネル、二重カード解消、右操作維持、320／360／414／960px実画面QA、文書同期、push、Pages確認をTasks 1-3へ割り当てた。
- Scope protection: 配色、文面、診断ロジック、結果本文、履歴・比較動作、storage、routing、共有、カード背景色、香りを変更対象から除外した。
- Placeholder scan: 実装手順に未定義関数や将来記入用の山括弧はなく、browser-smokeへ記録する値は取得コマンド、基準computed値、狭幅fallback値まで定義した。
- Type/name consistency: `start-main-panel`、`start-overview`、`appendAppHeader`、`appendScreenHeading`、`appendTextElement`は全タスクで同じ名前を使用している。
- Verification integrity: 仮モックではなく実アプリの画面と実測値を完了条件にし、結果・履歴・比較の本文構造が変わっていないことも確認対象に含めた。
