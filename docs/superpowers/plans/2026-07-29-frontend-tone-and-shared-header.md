# Frontend Tone and Shared Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `delegate-development` as the supervising controller and the `superpowers:subagent-driven-development` execution pattern to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 全画面へ小さな共通ブランドヘッダーと共通見出し位置を導入し、開始・回答・履歴・比較・結果画面を承認済みの文字階層と操作配置へ統一する。

**Architecture:** `app-header.js`はブランド表示と任意の右操作だけを担当し、新規`screen-heading.js`が英字見出し／進捗と主見出しの二段構造を提供する。各presentationは既存の状態・イベント・保存契約を変えず、この2部品を組み立てる。`styles.css`では共通トークンと開始位置を定義し、回答、履歴、結果の固有文字階層を画面スコープで維持する。

**Tech Stack:** HTML / CSS、Vanilla JavaScript ES Modules、Node.js `node:test`、既存静的dev server、Chrome

## Global Constraints

- 正典worktreeは`C:\Users\user\Documents\診断系アプリ開発\.worktrees\big-five-ui-tone-refresh`、ブランチは`codex/big-five-ui-tone-refresh`とする。
- 要件正典は`docs/requirements/2026-07-20-big-five-self-understanding-requirements.md`、画面正典は`docs/screens.md`、承認済み詳細仕様は`docs/superpowers/specs/2026-07-29-frontend-tone-and-shared-header-design.md`とする。
- 表示アプリ名は`Big Five 自己理解チェック`、英字副題は`BIG FIVE SELF UNDERSTANDING`とする。
- フォントは`"Sawarabi Gothic", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", system-ui, sans-serif`とし、外部フォント通信を追加しない。
- 開始画面は`SELF CHECK`、`自分のことを知る`、承認済みBig Five／IPIP説明文を表示する。
- `5つの傾向`、右上の`はじめる`、`正式版MVPを準備中です`、右上の現在地表示`履歴`は表示しない。
- 回答と20問分岐の右操作は`中断してトップへ`、履歴は`トップ画面へ`、比較は`履歴へ戻る`とする。
- 結果画面の英字見出しは20問が`PREVIEW RESULT`、50問が`DETAIL RESULT`とする。結果下部の既存操作はヘッダーへ移動しない。
- 回答設問は20〜22px、行間1.5、回答選択肢は16px、最低高56pxを維持する。
- 320px、360px、960px、200%文字拡大で横スクロール、文字切れ、固定要素による隠れを発生させない。
- IPIP設問、採点、判定、称号、副題、称号理由、因子別結果文、保存形式、状態遷移を変更しない。
- `connect-src 'none'`と通常版外部送信0件を維持する。
- ユーザー指定により監督役は`delegate-development`を使う。同一ファイルを変更するTaskは直列化し、各Taskの実装担当は指定ファイルだけを所有する。
- `delegate-development`本体、helper、adapterに起因する不具合が判明した場合、インストール済みコピーを変更せず、`_verify/skill-evals/delegate-development/reports/2026-07-29-<slug>-correction-instructions.md`へ再現、影響、期待動作、修正案、回帰テストを記録する。

## Shared Contract Table

| 契約種別 | exactな値 | 根拠 | 状態 |
|---|---|---|---|
| 表示名称 | `Big Five 自己理解チェック` | 承認済み設計3.1 | confirmed |
| 英字副題 | `BIG FIVE SELF UNDERSTANDING` | 承認済み設計3.1 | confirmed |
| 開始見出し | kicker=`SELF CHECK`、title=`自分のことを知る` | 承認済み設計3.2 | confirmed |
| 開始説明 | `Big Fiveは、性格傾向を5つの因子から捉える考え方です。本チェックではIPIP日本語50項目版を使用し、回答から現在の傾向を振り返ります。` | 承認済み設計3.2 | confirmed |
| ヘッダー操作 | start/result=`null`、question/preview-choice=`{label:"中断してトップへ", onClick: actions.onPause}`、history=`{label:"トップ画面へ", href:"#/start"}`、comparison=`{label:"履歴へ戻る", href:"#/history"}` | 承認済み設計5.2、7章 | confirmed |
| 画面見出し | history=`HISTORY`/`診断結果の履歴`、question=`N / total問`/正式設問文、preview-choice=`20 / 20問`/`20問の回答が完了しました`、result=`PREVIEW RESULT`または`DETAIL RESULT`/既存結果見出し、comparison=`COMPARISON`/`診断結果の比較` | 承認済み設計6、7章 | confirmed |
| 履歴管理 | launcher text=`履歴削除`、`aria-label="履歴の管理"`、既存dialogの個別削除・全削除・版情報・focus契約を維持 | 承認済み設計7.3、現行`history-screen.js` | confirmed |
| 回答操作 | `前へ`、`その他の操作`、`回答を破棄`を維持 | 承認済み設計7.2 | confirmed |
| 結果内容 | ResultSnapshot内の称号、猫、副題、理由、因子結果、42/7件の結果文、結果下部操作を変更しない | 承認済み設計2、7.4 | confirmed |
| 承認状態 | 本設計は2026-07-29にユーザー承認済み。自動テストを別の文面・公開承認へ読み替えない | 設計書ヘッダー、会話承認 | confirmed |

## Delegate Review Contract

各実装担当は次の順で短く報告する。

```markdown
## 結果
## 変更ファイル
## 実行した検証と結果
## 判断したこと
## 未解決・リスク
```

各Taskの監督レビューは対象Taskのcommitと指定ファイルだけを対象とし、最大12ファイル、`git diff`と関連正典・テストの範囲に探索を制限する。報告対象はCritical、Important、Minor。追加subreviewは監督役が明示した1回だけ許可する。今回の完了条件または安全性に関わるCritical／Importantはblocker、次Taskの明示範囲は次タスク、その他は別所有タスクへ分類する。範囲内の明確な不合格は同じ担当へ1回だけ差し戻す。

---

### Task 1: 共通ヘッダーと二段見出しの基盤

**Files:**
- Create: `app/js/presentation/screen-heading.js`
- Create: `app/tests/screen-heading.test.js`
- Create: `app/tests/frontend-tone.test.js`
- Modify: `app/js/presentation/app-header.js`
- Modify: `app/tests/app-header.test.js`
- Modify: `app/css/styles.css:1-135`

**Interfaces:**
- Consumes: `appendTextElement(parent, tagName, text, className?)`
- Produces: `appendAppHeader(parent, { action?: { label: string, href?: string, onClick?: Function }, sticky?: boolean }): HTMLElement`
- Produces: `appendScreenHeading(parent, { kicker: string, title: string, titleClassName?: string }): HTMLElement`
- Preserves: button actionは`type="button"`で1回だけ`onClick`へ委譲し、link actionは指定`href`へ遷移する

- [ ] **Step 1: 共通ヘッダーの失敗テストへ置き換える**

`app/tests/app-header.test.js`のブランド期待値を更新し、buttonとlinkの両契約を固定する。

```js
test("T-008A renders the compact shared brand without a screen label", () => {
  const { host } = createFakeScreen();
  const header = appendAppHeader(host, { sticky: true });

  assert.equal(header.className, "app-header is-sticky");
  assert.equal(
    collectElements(header).find(({ className }) => className === "app-brand-name").textContent,
    "Big Five 自己理解チェック",
  );
  assert.equal(
    collectElements(header).find(({ className }) => className === "app-brand-subtitle").textContent,
    "BIG FIVE SELF UNDERSTANDING",
  );
  assert.equal(
    collectElements(header).filter(({ className }) => className === "app-screen-label").length,
    0,
  );
});

test("T-008A renders a header navigation action as a link", () => {
  const { host } = createFakeScreen();
  const header = appendAppHeader(host, {
    action: { label: "トップ画面へ", href: "#/start" },
  });
  const action = collectElements(header)
    .find(({ className }) => className === "app-header-action");
  assert.equal(action.tagName, "a");
  assert.equal(action.textContent, "トップ画面へ");
  assert.equal(action.attributes.get("href"), "#/start");
});
```

既存のbutton委譲テストは`中断してトップへ`、`type="button"`、click 1回を維持する。

- [ ] **Step 2: 二段見出しの失敗テストを作る**

`app/tests/screen-heading.test.js`:

```js
import assert from "node:assert/strict";
import test from "node:test";

import { appendScreenHeading } from "../js/presentation/screen-heading.js";
import { collectElements, createFakeScreen } from "./helpers/fake-dom.js";

test("T-008A renders one shared kicker and h1", () => {
  const { host } = createFakeScreen();
  const heading = appendScreenHeading(host, {
    kicker: "HISTORY",
    title: "診断結果の履歴",
    titleClassName: "history-title",
  });

  assert.equal(heading.className, "screen-heading");
  assert.equal(
    collectElements(heading).find(({ className }) => className === "screen-kicker").textContent,
    "HISTORY",
  );
  const title = collectElements(heading).find(({ tagName }) => tagName === "h1");
  assert.equal(title.textContent, "診断結果の履歴");
  assert.match(title.className, /screen-title/);
  assert.match(title.className, /history-title/);
});
```

- [ ] **Step 3: 集中テストが未実装で失敗することを確認する**

```powershell
node --test app/tests/app-header.test.js app/tests/screen-heading.test.js
```

Expected: 新しいブランド、link action、`screen-heading.js`未作成によりFAIL。

- [ ] **Step 4: 共通DOM部品を実装する**

`app/js/presentation/app-header.js`は`screenLabel`を廃止し、次の構造を出力する。

```js
export function appendAppHeader(parent, {
  action = null,
  sticky = false,
} = {}) {
  const documentObject = parent.ownerDocument ?? document;
  const header = documentObject.createElement("header");
  header.className = sticky ? "app-header is-sticky" : "app-header";

  const brand = documentObject.createElement("div");
  brand.className = "app-brand";
  const mark = appendTextElement(brand, "span", "5", "app-mark");
  mark.setAttribute("aria-hidden", "true");
  const copy = documentObject.createElement("span");
  copy.className = "app-brand-copy";
  appendTextElement(copy, "span", "Big Five 自己理解チェック", "app-brand-name");
  appendTextElement(copy, "span", "BIG FIVE SELF UNDERSTANDING", "app-brand-subtitle");
  brand.append(copy);
  header.append(brand);

  if (action?.href) {
    const link = appendTextElement(header, "a", action.label, "app-header-action");
    link.setAttribute("href", action.href);
  } else if (action) {
    const button = appendTextElement(header, "button", action.label, "app-header-action");
    button.setAttribute("type", "button");
    button.addEventListener("click", action.onClick);
  }
  parent.append(header);
  return header;
}
```

`app/js/presentation/screen-heading.js`:

```js
import { appendTextElement } from "./screen-helpers.js";

export function appendScreenHeading(parent, {
  kicker,
  title,
  titleClassName = "",
}) {
  const documentObject = parent.ownerDocument ?? document;
  const heading = documentObject.createElement("header");
  heading.className = "screen-heading";
  appendTextElement(heading, "p", kicker, "screen-kicker");
  appendTextElement(
    heading,
    "h1",
    title,
    `screen-title${titleClassName ? ` ${titleClassName}` : ""}`,
  );
  parent.append(heading);
  return heading;
}
```

- [ ] **Step 5: フォント・ヘッダー・見出しCSS契約をテストする**

`app/tests/frontend-tone.test.js`で`styles.css`をUTF-8読込し、次を正規表現で検証する。

```js
assert.match(styles, /--font-sans:\s*"Sawarabi Gothic",\s*"Hiragino Kaku Gothic ProN",\s*"Yu Gothic",\s*"Meiryo",\s*system-ui,\s*sans-serif/);
assert.match(styles, /\.app-brand-name\s*\{[^}]*font-size:\s*0\.75rem/s);
assert.match(styles, /\.app-brand-subtitle\s*\{[^}]*font-size:\s*0\.5rem/s);
assert.match(styles, /\.app-header-action\s*\{[^}]*white-space:\s*nowrap/s);
assert.match(styles, /\.screen-kicker\s*\{[^}]*font-size:\s*0\.75rem/s);
assert.match(styles, /\.screen-title\s*\{[^}]*font-size:\s*clamp\(1\.375rem,\s*1\.25rem \+ 0\.6vw,\s*1\.5rem\)/s);
```

- [ ] **Step 6: 共通CSSを実装する**

`styles.css`へ次の責務を反映する。

```css
:root {
  --font-sans: "Sawarabi Gothic", "Hiragino Kaku Gothic ProN",
    "Yu Gothic", "Meiryo", system-ui, sans-serif;
  font-family: var(--font-sans);
}

.app-shell {
  width: min(100% - 32px, 720px);
  margin-inline: auto;
  padding-block: 24px 40px;
}

.app-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.app-brand {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}

.app-mark {
  display: grid;
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 9px;
  background: #26705c;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
}

.app-brand-copy,
.app-brand-name,
.app-brand-subtitle {
  display: block;
}

.app-brand-name {
  color: #19332f;
  font-size: 0.75rem;
  font-weight: 750;
  line-height: 1.35;
  white-space: nowrap;
}

.app-brand-subtitle {
  color: #526b66;
  font-size: 0.5rem;
  line-height: 1.2;
  letter-spacing: 0.14em;
  white-space: nowrap;
}

.app-header-action {
  flex: 0 0 auto;
  min-height: 36px;
  margin-inline-start: auto;
  white-space: nowrap;
}

.screen-heading {
  margin: 0;
}

.screen-kicker {
  min-height: 1.4em;
  margin: 0 0 10px;
  color: #26705c;
  font-size: 0.75rem;
  font-weight: 750;
  line-height: 1.4;
  letter-spacing: 0.12em;
}

.screen-title {
  max-width: none;
  margin: 0;
  font-size: clamp(1.375rem, 1.25rem + 0.6vw, 1.5rem);
  line-height: 1.4;
  letter-spacing: 0;
}
```

既存のfocus-visible、配色、sticky背景、safe areaを維持する。320px media queryでヘッダーを折り返さず、`.app-brand-copy`を`min-width: 0`、必要なら字間だけを狭める。

- [ ] **Step 7: Task 1テストと差分レビューを行う**

```powershell
node --test app/tests/app-header.test.js app/tests/screen-heading.test.js app/tests/frontend-tone.test.js
git diff --check
git diff -- app/js/presentation/app-header.js app/js/presentation/screen-heading.js app/css/styles.css app/tests/app-header.test.js app/tests/screen-heading.test.js app/tests/frontend-tone.test.js
```

Expected: 集中テスト全件PASS。指定6ファイル以外に差分なし。

- [ ] **Step 8: Task 1をコミットする**

```powershell
git add -- app/js/presentation/app-header.js app/js/presentation/screen-heading.js app/css/styles.css app/tests/app-header.test.js app/tests/screen-heading.test.js app/tests/frontend-tone.test.js
git commit -m "style: add shared app chrome"
```

---

### Task 2: 開始画面と回答フローの情報階層

**Files:**
- Modify: `app/js/presentation/start-screen.js`
- Modify: `app/js/presentation/questionnaire-screen.js`
- Modify: `app/tests/start-screen.test.js`
- Modify: `app/tests/questionnaire-screen.test.js`
- Modify: `app/tests/app-shell.test.js`
- Modify: `app/css/styles.css`

**Interfaces:**
- Consumes: Task 1の`appendAppHeader`、`appendScreenHeading`
- Produces: S-001=`SELF CHECK`/`自分のことを知る`、S-002=`N / total問`/設問、20問分岐=`20 / 20問`/`20問の回答が完了しました`
- Preserves: `onStartNew`、`onResume`、`onAnswer`、`onBack`、`onPause`、`onDiscard`、`onPreviewDecision`の呼出し回数と引数

- [ ] **Step 1: 開始画面の失敗テストを追加する**

`app/tests/start-screen.test.js`の旧見出しテストを次の契約へ更新する。

```js
test("T-008A S-001 renders the approved self-check hierarchy", () => {
  const { host } = createFakeScreen();
  renderStartScreen(host, versionModel, {});
  const text = collectText(host);

  assert.match(text, /Big Five 自己理解チェック/);
  assert.match(text, /SELF CHECK/);
  assert.match(text, /自分のことを知る/);
  assert.match(text, /Big Fiveは、性格傾向を5つの因子から捉える考え方です/);
  assert.match(text, /IPIP日本語50項目版/);
  assert.doesNotMatch(text, /5つの傾向/);
  assert.doesNotMatch(text, /正式版MVPを準備中です/);
  assert.equal(
    collectElements(host).filter(({ className }) => className === "app-header-action").length,
    0,
  );
});

test("T-008A S-001 separates history from the primary start card", () => {
  const { host } = createFakeScreen();
  renderStartScreen(host, versionModel, { onStartNew() {} });
  const navigation = collectElements(host)
    .find(({ className }) => className === "start-secondary-navigation");
  const history = collectElements(navigation)
    .find(({ textContent }) => textContent === "診断結果の履歴を見る");
  assert.equal(history.className, "text-link start-history-link");
});
```

- [ ] **Step 2: 回答・分岐画面の失敗テストを追加する**

`app/tests/questionnaire-screen.test.js`へ次を追加する。

```js
test("T-008A S-002 aligns progress and question through the shared heading", () => {
  const { host } = createFakeScreen();
  renderQuestionnaireScreen(
    host,
    questionViewModel({ questionText: "盛り上げ役である" }),
    questionActions(),
  );
  const heading = collectElements(host)
    .find(({ className }) => className === "screen-heading");
  assert.ok(heading);
  assert.match(collectText(heading), /1 \/ 20問/);
  assert.match(collectText(heading), /盛り上げ役である/);
  assert.ok(collectElements(host).some(({ textContent }) => textContent === "前へ"));
  assert.ok(collectElements(host).some(({ textContent }) => textContent === "その他の操作"));
  assert.ok(collectElements(host).some(({ textContent }) => textContent === "回答を破棄"));
});

test("T-008A S-002 gives the preview choice the same heading stack", () => {
  const { host } = createFakeScreen();
  renderQuestionnaireScreen(host, previewViewModel(), previewActions());
  const heading = collectElements(host)
    .find(({ className }) => className === "screen-heading");
  assert.match(collectText(heading), /20 \/ 20問/);
  assert.match(collectText(heading), /20問の回答が完了しました/);
});
```

- [ ] **Step 3: 集中テストが旧DOMで失敗することを確認する**

```powershell
node --test app/tests/start-screen.test.js app/tests/questionnaire-screen.test.js
```

Expected: 新しい文面、外部履歴導線、共通見出し構造が存在しないためFAIL。

- [ ] **Step 4: S-001を実装する**

`start-screen.js`で`appendScreenHeading`をimportし、次の構造へ置換する。

```js
main.className = "app-shell start-screen";
appendAppHeader(main);
appendScreenHeading(main, {
  kicker: "SELF CHECK",
  title: "自分のことを知る",
});
appendTextElement(
  main,
  "p",
  "Big Fiveは、性格傾向を5つの因子から捉える考え方です。本チェックではIPIP日本語50項目版を使用し、回答から現在の傾向を振り返ります。",
  "lead start-lead",
);
```

カードは`start-overview-card`とし、`h2`=`Big Fiveについて`、既存の20問／50問説明、開始・再開ボタンを保持する。履歴リンクはカード外の`nav.start-secondary-navigation`へ移す。

版情報は次の`details`へ入れ、値を削除しない。

```js
const details = documentObject.createElement("details");
details.className = "diagnostic-version";
appendTextElement(details, "summary", "この診断について");
appendTextElement(details, "p", versionModel.versionLabel, "version");
appendTextElement(details, "h2", versionModel.diagnosticVersionLabel);
```

- [ ] **Step 5: S-002と20問分岐を実装する**

`questionnaire-screen.js`で`screenLabel`を削除し、次を使う。

```js
appendAppHeader(main, {
  sticky: true,
  action: { label: "中断してトップへ", onClick: actions.onPause },
});
appendScreenHeading(main, {
  kicker: `${viewModel.currentIndex + 1} / ${viewModel.totalCount}問`,
  title: viewModel.questionText,
  titleClassName: "questionnaire-question",
});
```

preview-choiceでは次を使う。

```js
appendScreenHeading(main, {
  kicker: "20 / 20問",
  title: "20問の回答が完了しました",
  titleClassName: "preview-choice-title",
});
```

5回答、`前へ`、`回答へ戻る`、`その他の操作`、`回答を破棄`の既存DOMとevent delegationは変更しない。

- [ ] **Step 6: S-001/S-002固有CSSを実装する**

`styles.css`でグローバル`h1`の過大な`clamp(2rem, 9vw, 4.5rem)`依存を外し、次を追加する。

```css
.start-lead {
  margin-top: 18px;
}

.start-overview-card {
  margin-top: 28px;
}

.start-secondary-navigation {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #d6e4df;
}

.start-history-link {
  margin-top: 0;
}

.diagnostic-version {
  margin-top: 32px;
  color: #526b66;
  font-size: 0.875rem;
}

.questionnaire-question {
  font-size: clamp(1.25rem, 1.05rem + 0.8vw, 1.375rem);
  line-height: 1.5;
  font-weight: 700;
  text-wrap: balance;
}

.preview-choice-title {
  font-size: clamp(1.375rem, 1.25rem + 0.6vw, 1.5rem);
}
```

`.answer-option`の16px、56px、14px 16pxと、選択肢間12pxを維持する。

- [ ] **Step 7: Task 2の集中回帰と差分レビューを行う**

```powershell
node --test app/tests/start-screen.test.js app/tests/questionnaire-screen.test.js app/tests/app-shell.test.js app/tests/questionnaire-typography.test.js
git diff --check
git diff -- app/js/presentation/start-screen.js app/js/presentation/questionnaire-screen.js app/css/styles.css app/tests/start-screen.test.js app/tests/questionnaire-screen.test.js app/tests/app-shell.test.js
```

Expected: 対象テスト全件PASS。状態・保存・回答データを扱うdomain/infrastructureに差分なし。

- [ ] **Step 8: Task 2をコミットする**

```powershell
git add -- app/js/presentation/start-screen.js app/js/presentation/questionnaire-screen.js app/css/styles.css app/tests/start-screen.test.js app/tests/questionnaire-screen.test.js app/tests/app-shell.test.js
git commit -m "style: refine start and answer hierarchy"
```

---

### Task 3: 履歴と比較のナビゲーション・管理表示

**Files:**
- Modify: `app/js/presentation/history-screen.js`
- Modify: `app/js/presentation/comparison-screen.js`
- Modify: `app/tests/history-screen.test.js`
- Modify: `app/tests/comparison-screen.test.js`
- Modify: `app/css/styles.css`

**Interfaces:**
- Consumes: Task 1のlink actionと`appendScreenHeading`
- Produces: history header action=`トップ画面へ`、launcher=`履歴削除`、comparison header action=`履歴へ戻る`
- Preserves: `onDeleteOne(resultId)`、`onDeleteAll()`、`onEnterComparison()`、`onToggle(resultId)`、`onExecute()`とdialog focus／Escape／fallback契約

- [ ] **Step 1: 履歴の失敗テストを追加する**

`app/tests/history-screen.test.js`へ次の表示契約を追加し、既存`…`期待値を`履歴削除`へ更新する。

```js
test("T-008A S-006 moves start navigation into the shared header", () => {
  const { host } = createFakeScreen();
  renderHistoryScreen(host, { status: "ok", results: [] }, historyActions());
  const headerAction = collectElements(host)
    .find(({ className }) => className === "app-header-action");
  assert.equal(headerAction.tagName, "a");
  assert.equal(headerAction.textContent, "トップ画面へ");
  assert.equal(headerAction.attributes.get("href"), "#/start");
  assert.equal(
    collectElements(host).filter(({ textContent }) => textContent === "開始画面へ戻る").length,
    0,
  );
  assert.match(collectText(host), /HISTORY/);
  assert.match(collectText(host), /診断結果の履歴/);
});

test("T-008A F-013 exposes history management as 履歴削除", () => {
  const { host } = createFakeScreen();
  renderHistoryScreen(host, { status: "ok", results: [] }, historyActions());
  const launcher = collectElements(host)
    .find(({ className }) => className === "history-management-toggle");
  assert.equal(launcher.textContent, "履歴削除");
  assert.equal(launcher.attributes.get("aria-label"), "履歴の管理");
});
```

- [ ] **Step 2: 比較の失敗テストを追加する**

`app/tests/comparison-screen.test.js`の正常・失敗状態それぞれで次を検証する。

```js
const headerAction = collectElements(host)
  .find(({ className }) => className === "app-header-action");
assert.equal(headerAction.textContent, "履歴へ戻る");
assert.equal(headerAction.attributes.get("href"), "#/history");
assert.match(collectText(host), /COMPARISON/);
assert.match(collectText(host), /診断結果の比較/);
```

- [ ] **Step 3: 集中テストが旧配置で失敗することを確認する**

```powershell
node --test app/tests/history-screen.test.js app/tests/comparison-screen.test.js
```

Expected: 旧`screenLabel`、本文の戻るリンク、`…`、比較画面の共通部品未使用によりFAIL。

- [ ] **Step 4: S-006を実装する**

`history-screen.js`で次を使用する。

```js
appendAppHeader(main, {
  action: { label: "トップ画面へ", href: "#/start" },
});
appendScreenHeading(main, {
  kicker: "HISTORY",
  title: "診断結果の履歴",
  titleClassName: "history-title",
});
appendTextElement(
  main,
  "p",
  "結果はこの端末のブラウザ内にだけ保存されます。",
  "lead compact-lead history-lead",
);
```

本文の`開始画面へ戻る`を削除する。`renderHistoryHeader`から見出し生成を外し、既存管理dialogのlauncher textだけを`履歴削除`へ変更する。`historyState.status !== "ok"`では危険操作を表示しない既存分岐を維持する。

- [ ] **Step 5: S-007を実装する**

`comparison-screen.js`へ`appendAppHeader`と`appendScreenHeading`をimportし、本文先頭を次へ置換する。

```js
appendAppHeader(main, {
  action: { label: "履歴へ戻る", href: "#/history" },
});
appendScreenHeading(main, {
  kicker: "COMPARISON",
  title: "診断結果の比較",
  titleClassName: "comparison-title",
});
```

失敗状態の`履歴で比較対象を選び直す`は、具体的な復旧操作として本文に維持する。

- [ ] **Step 6: 履歴・比較CSSを実装する**

```css
.history-title,
.comparison-title {
  font-size: clamp(1.375rem, 1.25rem + 0.6vw, 1.5rem);
}

.history-lead {
  margin-top: 12px;
}

.history-management-toggle {
  margin-top: 18px;
  font-size: 0.875rem;
  font-weight: 700;
}
```

旧`.history-header h1`の大きな`clamp()`と`…`用font-sizeを削除する。履歴カード、管理dialog、固定比較バー、safe areaは変更しない。

- [ ] **Step 7: Task 3の集中回帰と差分レビューを行う**

```powershell
node --test app/tests/history-screen.test.js app/tests/comparison-screen.test.js app/tests/app-shell.test.js
git diff --check
git diff -- app/js/presentation/history-screen.js app/js/presentation/comparison-screen.js app/css/styles.css app/tests/history-screen.test.js app/tests/comparison-screen.test.js
```

Expected: 履歴管理のnative／fallback、個別削除、全削除、比較選択を含め全件PASS。

- [ ] **Step 8: Task 3をコミットする**

```powershell
git add -- app/js/presentation/history-screen.js app/js/presentation/comparison-screen.js app/css/styles.css app/tests/history-screen.test.js app/tests/comparison-screen.test.js
git commit -m "style: clarify history and comparison navigation"
```

---

### Task 4: 結果画面の共通見出しと回帰保護

**Files:**
- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/tests/result-screen.test.js`
- Modify: `app/css/styles.css`

**Interfaces:**
- Consumes: Task 1の`appendAppHeader`、`appendScreenHeading`
- Produces: preview20=`PREVIEW RESULT`/`20問簡易プレビュー`、detail50=`DETAIL RESULT`/`50問詳細結果`
- Preserves: `renderResultHero`、`renderTitleReason`、`renderRadarAndFactors`、`renderMethodInformation`、`renderActions`の順序と全ResultSnapshot表示

- [ ] **Step 1: 結果見出しの失敗テストを追加する**

`app/tests/result-screen.test.js`のpreview/detail fixtureを使い、次を追加する。

```js
test("T-008A S-003/S-004 uses the shared result heading without moving actions", () => {
  for (const [mode, kicker, title] of [
    ["preview20", "PREVIEW RESULT", "20問簡易プレビュー"],
    ["detail50", "DETAIL RESULT", "50問詳細結果"],
  ]) {
    const { host } = createFakeScreen();
    renderSavedResultScreen(
      host,
      createTestResultSnapshot({ questionCount: mode === "preview20" ? 20 : 50 }),
      factorLabels,
    );
    const heading = collectElements(host)
      .find(({ className }) => className === "screen-heading");
    assert.match(collectText(heading), new RegExp(kicker));
    assert.match(collectText(heading), new RegExp(title));
    assert.equal(
      collectElements(host).filter(({ className }) => className === "app-header-action").length,
      0,
    );
  }
});
```

既存テストの7件preview結果文、42件detail結果文、猫、称号理由、因子開閉、方法sheet、結果下部操作の期待値を変更しない。

- [ ] **Step 2: テストが旧screenLabel／直下h1で失敗することを確認する**

```powershell
node --test app/tests/result-screen.test.js
```

Expected: `.screen-heading`と英字見出しがなくFAIL。

- [ ] **Step 3: S-003/S-004を実装する**

`result-screen.js`で次へ置換する。

```js
appendAppHeader(main);
appendScreenHeading(main, {
  kicker: savedSnapshot.mode === "preview20" ? "PREVIEW RESULT" : "DETAIL RESULT",
  title: savedSnapshot.mode === "preview20"
    ? "20問簡易プレビュー"
    : "50問詳細結果",
  titleClassName: "result-screen-title",
});
```

この直後のnotice、hero、称号理由、レーダー、結果文、日時、注意、方法情報、操作の順序を維持する。

- [ ] **Step 4: 結果固有CSSを縮小する**

```css
.result-screen-title {
  font-size: clamp(1.375rem, 1.25rem + 0.6vw, 1.5rem);
}

.screen-heading + .result-hero,
.screen-heading + .result-storage-error + .result-hero {
  margin-top: 28px;
}
```

旧`.result-screen > h1`の`clamp(2rem, 8vw, 3.8rem)`を削除する。結果hero以降のカード、猫の`object-fit: contain`、結果文、操作は変更しない。

- [ ] **Step 5: Task 4の集中回帰と差分レビューを行う**

```powershell
node --test app/tests/result-screen.test.js app/tests/project-contract.test.js app/tests/app-shell.test.js
git diff --check
git diff -- app/js/presentation/result-screen.js app/css/styles.css app/tests/result-screen.test.js
```

Expected: 対象テスト全件PASS。結果fixture、domain、content、character assetに差分なし。

- [ ] **Step 6: Task 4をコミットする**

```powershell
git add -- app/js/presentation/result-screen.js app/css/styles.css app/tests/result-screen.test.js
git commit -m "style: align result screen heading"
```

---

### Task 5: 文書同期、実ブラウザ検証、統合回帰

**Files:**
- Modify: `docs/screens.md`
- Modify: `docs/tasks.md`
- Modify: `docs/superpowers/plans/2026-07-29-frontend-tone-and-shared-header.md`
- Generated but do not commit: `dist/qa-preview/`

**Interfaces:**
- Consumes: Task 1〜4のDOM/CSS、`npm.cmd run dev`、`npm.cmd run qa:preview:build`
- Produces: 320/360/960px、200%文字拡大、キーボード、主要画面の検証記録
- Preserves: approved release未選択、Q-012/Q-013/T-007等の既存gate状態

- [x] **Step 1: 画面正典を実装済み契約へ同期する**

`docs/screens.md`の共通UI、S-001、S-002、S-003/S-004、S-006、S-007へ次を明記する。

```text
共通表示名: Big Five 自己理解チェック
英字副題: BIG FIVE SELF UNDERSTANDING
共通見出し: 緑のkicker／進捗、その下のh1
開始: SELF CHECK／自分のことを知る／Big Five・IPIP説明
回答: 中断してトップへをnowrap、前へ・その他の操作・回答を破棄を維持
履歴: トップ画面へをヘッダー、履歴削除から既存管理dialog
結果: PREVIEW RESULTまたはDETAIL RESULT、結果内容・下部操作は不変
比較: COMPARISON、履歴へ戻るをヘッダー
```

- [x] **Step 2: タスク台帳を実装・検証事実へ同期する**

`docs/tasks.md`のT-008AおよびF-001/F-003/F-005/F-006/F-009/F-010/F-013へ、共通表示名称、縦位置、履歴削除、狭幅確認を追記する。未完了gateを完了へ変更しない。

- [x] **Step 3: 全自動検証を実行する**

```powershell
npm.cmd test
npm.cmd run check
npm.cmd run qa:preview:build
git diff --check
```

Expected:

```text
505件以上、fail 0
Static check passed
QA preview artifact build成功
whitespace errorなし
```

- [x] **Step 4: dev serverを起動する**

```powershell
npm.cmd run dev
```

Expected: `http://localhost:4174/`で正式版が待受ける。検証終了後に同セッションを停止する。

- [ ] **Step 5: 360×800で主要フローを確認する**

Chromeで開始から20問分岐まで進め、履歴、20問結果、保存済み50問結果、比較を開く。

```text
ヘッダー名12px、英字副題8px相当
SELF CHECK/HISTORY/1 / 20問/PREVIEW RESULT/DETAIL RESULT/COMPARISONの上端が同じ
各h1または設問の上端が同じ
中断してトップへが1行
診断を始めると履歴導線が別の区画
履歴削除が表示され、dialogを開くだけで即削除しない
前へ、その他の操作、回答を破棄が到達可能
横overflowなし
```

- [ ] **Step 6: 320×800と200%文字拡大を確認する**

```text
共通ヘッダーが横overflowしない
中断してトップへが折り返されない
設問は20px相当を維持し、5回答が欠けない
履歴カードと履歴削除が切れない
結果の称号、猫、理由、因子開閉、下部操作へ到達できる
固定比較バーが本文とsafe areaを隠さない
```

- [ ] **Step 7: 960×900とキーボードを確認する**

```text
本文最大幅が維持され、主見出しが24pxを超えて拡大しない
設問は22px相当、回答選択肢は16px／最低56px
Tabでヘッダー操作、回答、前へ、その他の操作、履歴削除、dialog、結果開閉、比較へ到達
focus-visibleが常に確認できる
Escape後のdialog focusが履歴削除へ戻る
```

- [x] **Step 8: delegate-developmentの最終独立レビューを行う**

Spec reviewerは設計書の3〜12章、Standards reviewerはAGENTS.md、`docs/screens.md`、変更diffだけを確認する。最大12ファイル、Critical／Important／Minorのみ報告し、追加subreviewは禁止する。

受入れ条件:

- Critical／Importantなし
- Minorは完了条件へ影響しないか監督役が分類済み
- 文面承認を自動テスト承認へ読み替えていない
- domain、content、storage schema、GitHub Pages権限に差分なし

- [x] **Step 9: 実装計画へ実績を記録してコミットする**

本Taskのチェックボックス、検証件数、ブラウザ確認日、レビュー結果をこの計画末尾へ追記する。

```powershell
git add -- docs/screens.md docs/tasks.md docs/superpowers/plans/2026-07-29-frontend-tone-and-shared-header.md
git commit -m "docs: record frontend tone verification"
```

- [x] **Step 10: push前の最終状態を確認する**

```powershell
git status --short --branch
git log --oneline main..HEAD
git diff --stat main...HEAD
npm.cmd test
npm.cmd run check
```

Expected: worktree clean、計画したcommitだけ、全テスト／静的検証成功。

- [x] **Step 11: originへpushする**

```powershell
git push -u origin codex/big-five-ui-tone-refresh
```

Expected: `origin/codex/big-five-ui-tone-refresh`が作成または更新され、GitHub上からQA preview更新用の後続操作へ進める。

## Task 5実績（2026-07-29）

- 文書同期: `docs/screens.md`と`docs/tasks.md`へ共通表示名`Big Five 自己理解チェック`、英字副題`BIG FIVE SELF UNDERSTANDING`、緑のkicker／進捗＋`h1`の共通見出し、画面別のヘッダー操作と`履歴削除`を反映した。Q-006、Q-012、Q-013およびapproved releaseの既存gate状態は変更していない。
- 自動検証: `npm.cmd test`は511 tests、511 pass、0 fail。`npm.cmd run check`は46 JavaScript filesとcanonical runtime version 1件で成功。`npm.cmd run qa:preview:build`は100 files、6,631,601 bytesで成功。
- ブラウザ実フロー: 20問回答→簡易プレビュー、簡易プレビュー→残り30問→50問詳細結果、履歴表示、互換な50問結果2件の選択→比較表示を確認した。
- 狭幅・広幅: 320px、360px、960px幅の主要画面で横overflowなし。360px回答画面は`中断してトップへ`が`white-space: nowrap`、設問20px、回答文字16px、回答ボタン高56px。
- 記録境界: dev serverの起動・停止、アプリ内ブラウザでの360×800主要フロー、幅別の横overflow、最終独立レビュー、push前状態を確認した。Step 5のChrome指定、Step 6の200%文字拡大、Step 7のキーボード確認は、この2026-07-29検証で全項目を完走した事実がないため未完了表示を維持する。Step 11のpushはこの時点では未実施である。
- 最終レビュー補正: 380px以下でも共通ヘッダーを1行に保ち、mark・ブランド文字・gap・右操作余白だけを縮小した。sticky／non-stickyは共通の`min-height`とblock paddingを使い、sticky固有borderを外してkicker／進捗と`h1`の開始位置をそろえた。`.screen-kicker`はブランド緑を明示し、開始画面の履歴導線とF-005/F-006のコンテンツgate参照を現行実装・AGENTS.mdへ同期した。
- 最終レビュー補正の検証: `app/tests/frontend-tone.test.js`はREDで2件失敗後、GREENで2件成功。集中48件、`npm.cmd test` 511件、`npm.cmd run check`、`git diff --check`に成功した。200%文字拡大・キーボードを新たに確認済みとはしていない。
- 最終独立再レビュー: Spec／Standardsの両担当が補正commit `e07271a`を再確認し、Critical／Important／MinorなしでPASSとした。360px実測では開始・回答ともヘッダー高52px、kicker上端104px、主見出し上端131pxで一致した。
- origin同期: `codex/big-five-ui-tone-refresh`をoriginへpushし、upstream trackingを設定した。
