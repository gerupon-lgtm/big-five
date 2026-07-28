# Questionnaire Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** T-008A／F-003の回答画面だけを、承認済みの設問20〜22px・選択肢16px・行間1.5・選択肢最低高56pxへ変更し、狭幅・広幅・200%相当でも読みやすくする。

**Architecture:** DOM、回答状態、保存、配色は変更せず、`app/css/styles.css`のS-002固有セレクターだけを分離・上書きする。CSS契約をNodeテストで固定し、実ブラウザではcomputed style、横overflow、キーボード操作を確認する。

**Tech Stack:** HTML / CSS、Vanilla JavaScript ES Modules、Node.js `node:test`、既存静的dev server、Chrome

## Global Constraints

- 正典worktreeは`C:\Users\user\Documents\診断系アプリ開発\.worktrees\big-five-q006`、ブランチは`codex/big-five-q006`とする。
- 要件正典は`docs/requirements/2026-07-20-big-five-self-understanding-requirements.md` v1.13、画面正典は`docs/screens.md` 0.8、詳細仕様は`docs/superpowers/specs/2026-07-27-result-history-resume-ui-design.md`とする。
- ユーザー指定により監督役は`delegate-development`を使う。実装担当の書込み所有権はTask 1のCSSと新規テストだけに限定し、監督役が差分レビュー、Task 2の実ブラウザ検証、文書同期、完了判定を担う。
- 設問本文はスマートフォン20px相当、広い画面22px相当、太字、行間1.5とする。
- 5件法の選択肢は16px相当、行間1.5、最低高56px、上下14px・左右16px相当とする。
- 設問本文と選択肢群の間は24px相当、選択肢間は12px相当とする。
- 現在位置と全体数は14〜16px相当とし、設問本文より強くしない。
- 回答画面固有の変更とし、開始、20問分岐見出し、結果、履歴、比較の文字スケールを変更しない。
- 既存の色、角丸、影、選択状態、正式設問文、5件法ラベル、回答時の自動遷移、保存、中断、破棄の挙動を変更しない。
- 360px幅、320pxの200%相当で横スクロールを発生させず、主要操作をキーボードで完結できること。

---

### Task 1: S-002固有のCSS契約と実装

**Files:**
- Create: `app/tests/questionnaire-typography.test.js`
- Modify: `app/css/styles.css:640-668`

**Interfaces:**
- Consumes: `.questionnaire-screen`, `.questionnaire-question`, `.questionnaire-progress`, `.answer-options`, `.answer-option`, `.preview-decision-actions`, `.questionnaire-screen > h1`
- Produces: 設問用`clamp(1.25rem, 1.05rem + 0.8vw, 1.375rem)`、進捗用`clamp(0.875rem, 0.8rem + 0.4vw, 1rem)`、選択肢用`font-size: 1rem`／`min-height: 56px`
- Preserves: 20問分岐見出しの`clamp(1.8rem, 7vw, 3rem)`、分岐操作群の`margin-top: 32px`

- [ ] **Step 1: CSS契約の失敗テストを追加する**

`app/tests/questionnaire-typography.test.js`を次の内容で作成する。

```js
import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const stylesUrl = new URL("../css/styles.css", import.meta.url);

function declarationsFor(styles, selector) {
  for (const match of styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = match[1]
      .split(",")
      .map((candidate) => candidate.trim());
    if (selectors.includes(selector)) {
      return match[2];
    }
  }
  assert.fail(`missing CSS selector: ${selector}`);
}

test("T-008A F-003 keeps the approved questionnaire typography scoped to S-002", async () => {
  const styles = await readFile(stylesUrl, "utf8");
  const question = declarationsFor(styles, ".questionnaire-question");
  const progress = declarationsFor(styles, ".questionnaire-progress");
  const options = declarationsFor(styles, ".answer-options");
  const option = declarationsFor(styles, ".answer-option");
  const previewActions = declarationsFor(styles, ".preview-decision-actions");
  const previewHeading = declarationsFor(styles, ".questionnaire-screen > h1");

  assert.match(
    question,
    /font-size:\s*clamp\(1\.25rem,\s*1\.05rem \+ 0\.8vw,\s*1\.375rem\)/,
  );
  assert.match(question, /line-height:\s*1\.5/);
  assert.match(question, /font-weight:\s*700/);
  assert.match(question, /text-wrap:\s*balance/);

  assert.match(
    progress,
    /font-size:\s*clamp\(0\.875rem,\s*0\.8rem \+ 0\.4vw,\s*1rem\)/,
  );
  assert.match(progress, /line-height:\s*1\.5/);

  assert.match(options, /gap:\s*12px/);
  assert.match(options, /margin-top:\s*24px/);
  assert.match(option, /font-size:\s*1rem/);
  assert.match(option, /line-height:\s*1\.5/);
  assert.match(option, /min-height:\s*56px/);
  assert.match(option, /padding:\s*14px 16px/);

  assert.match(previewActions, /margin-top:\s*32px/);
  assert.match(
    previewHeading,
    /font-size:\s*clamp\(1\.8rem,\s*7vw,\s*3rem\)/,
  );
  assert.notEqual(question, previewHeading);
});
```

- [ ] **Step 2: テストが現行の過大な設問サイズで失敗することを確認する**

Run:

```powershell
node --test app/tests/questionnaire-typography.test.js
```

Expected: 1件FAIL。`.questionnaire-question`が`clamp(1.8rem, 7vw, 3rem)`を共有しており、承認済み`clamp(1.25rem, 1.05rem + 0.8vw, 1.375rem)`に一致しない。

- [ ] **Step 3: 回答画面固有のCSSへ分離する**

`app/css/styles.css`の既存`.questionnaire-question, .questionnaire-screen > h1`と`.answer-options, .preview-decision-actions`の共有ブロックを、次の独立ブロックへ置き換える。

```css
.questionnaire-screen > h1 {
  max-width: none;
  font-size: clamp(1.8rem, 7vw, 3rem);
  line-height: 1.25;
  text-wrap: balance;
}

.questionnaire-progress {
  font-size: clamp(0.875rem, 0.8rem + 0.4vw, 1rem);
  line-height: 1.5;
  letter-spacing: 0.04em;
}

.questionnaire-question {
  max-width: none;
  font-size: clamp(1.25rem, 1.05rem + 0.8vw, 1.375rem);
  line-height: 1.5;
  font-weight: 700;
  text-wrap: balance;
}

.answer-options {
  display: grid;
  gap: 12px;
  margin-top: 24px;
}

.preview-decision-actions {
  display: grid;
  gap: 12px;
  margin-top: 32px;
}

.answer-option {
  width: 100%;
  min-height: 56px;
  padding: 14px 16px;
  font-size: 1rem;
  line-height: 1.5;
  text-align: left;
}
```

`.answer-option[aria-pressed="true"]`以下の色・背景・太さは変更しない。

- [ ] **Step 4: 集中テストを実行する**

Run:

```powershell
node --test app/tests/questionnaire-typography.test.js app/tests/questionnaire-screen.test.js app/tests/project-contract.test.js
```

Expected: 全件PASS。設問・5件法ラベル・中断・破棄・20問分岐の既存presentation契約も維持される。

- [ ] **Step 5: Task 1差分を監督役がレビューする**

監督役は次を確認する。

```powershell
git diff -- app/css/styles.css app/tests/questionnaire-typography.test.js
git diff --check
```

受入れ条件:

- 変更ファイルが上記2件だけである。
- `questionnaire-screen.js`、回答状態、文言、配色へ差分がない。
- CSSテストが値だけでなく、20問分岐見出しとのスコープ分離を検証している。

- [ ] **Step 6: Task 1をコミットする**

```powershell
git add -- app/css/styles.css app/tests/questionnaire-typography.test.js
git commit -m "style: refine questionnaire typography"
```

Expected: CSSと回帰テストだけを含む1コミット。

---

### Task 2: 実ブラウザ検証、正典記録、統合回帰

**Files:**
- Modify: `docs/tasks.md:303-349`

**Interfaces:**
- Consumes: Task 1のCSS契約、`npm.cmd run dev`、`http://localhost:4174/#/start`
- Produces: 360px、960px、320px・200%相当、キーボード操作の検証記録
- Preserves: T-008Aの残作業である結果hero、因子二段階展開、方法情報、トップ導線、履歴管理モーダル、称号別ヒントを未完了のまま区別する

- [ ] **Step 1: 正典worktreeがTask 1コミット上にあることを確認する**

```powershell
git status --short --branch
git log -2 --oneline
```

Expected: `codex/big-five-q006`上で、Task 1コミット以外の未コミット差分がない。

- [ ] **Step 2: 正式版dev serverを起動する**

```powershell
npm.cmd run dev
```

Expected: `http://localhost:4174/`で待受ける。長時間実行セッションとして保持する。

- [ ] **Step 3: 360×800で回答画面を確認する**

Chromeで`http://localhost:4174/#/start`を開き、新規診断を開始してS-002の1問目を表示する。computed styleとレイアウトを次の値で確認する。

```text
.questionnaire-question font-size = 20px
.questionnaire-question line-height = 30px
.answer-option font-size = 16px
.answer-option line-height = 24px
.answer-option min-height = 56px
document.documentElement.scrollWidth <= window.innerWidth
```

5選択肢、`前へ`、`中断してトップへ`、`その他の操作`へ縦スクロールで到達でき、設問末尾に不自然な1語だけが残らないことを確認する。

- [ ] **Step 4: 960×900で広幅上限を確認する**

同じS-002を960×900で表示し、次を確認する。

```text
.questionnaire-question font-size = 22px
.questionnaire-question line-height = 33px
.answer-option font-size = 16px
.answer-option min-height = 56px
回答領域の最大幅 = 640px
```

開始画面、20問分岐、結果、履歴の見出しサイズがTask 1前の規則を維持していることも確認する。

- [ ] **Step 5: 320px・200%相当とキーボード操作を確認する**

320px幅、ブラウザズーム200%でS-002を表示し、次を確認する。

```text
横スクロールなし
設問本文と5選択肢が欠けずに折り返される
Tabで中断、各回答、前へ、その他の操作へ到達できる
フォーカスリングが表示される
EnterまたはSpaceで回答できる
```

回答後の自動遷移、中断後の開始画面、再開後の位置が既存仕様どおりであることを1往復確認する。

- [ ] **Step 6: `docs/tasks.md`へ実装記録を追記する**

T-008Aの実装記録末尾へ次の1項目を追加する。

```markdown
  - Q-014回答文字実装（2026-07-28）: 回答画面だけを設問20〜22px、行間1.5、選択肢16px・最低高56pxへ変更し、20問分岐を含む他画面の見出し規則から分離した。CSS契約テスト、360×800、960×900、320px・200%相当、キーボード、回答・中断・再開の実ブラウザ確認に成功した。配色、正式設問文、5件法ラベル、回答状態、保存処理は変更していない。
```

T-008Aの残作業記述から回答文字だけを完了扱いにし、結果hero、因子一覧・二段階展開、設問構成／方法情報、50問トップ導線、履歴管理モーダル、称号別ヒント、最終全体browser smokeは未完了として残す。

- [ ] **Step 7: 全回帰を実行する**

```powershell
npm.cmd test
npm.cmd run check
git diff --check
```

Expected:

- 445 tests、fail 0
- Static check passed（44 JavaScript files、one canonical runtime version）
- `git diff --check`のエラーなし

- [ ] **Step 8: Task 2をコミットしてpushする**

```powershell
git add -- docs/tasks.md
git commit -m "docs: record questionnaire typography verification"
git push origin codex/big-five-q006
git status --short --branch
```

Expected: `codex/big-five-q006...origin/codex/big-five-q006`、worktree clean。

- [ ] **Step 9: 次の実装単位を引き継ぐ**

回答文字完了後は、`docs/tasks.md`のT-008A残作業と次の既存計画を照合し、完了済み手順を再実行せず、結果画面統合の未完了部分から開始する。

```text
docs/superpowers/plans/2026-07-27-result-progressive-disclosure.md
docs/superpowers/plans/2026-07-27-history-compact-comparison.md
docs/superpowers/specs/2026-07-28-title-reflection-comments-design.md
```

新しい判断が必要になる条件は、承認済み20〜22px／16px／56pxが成立しない場合、既存配色・DOM・状態遷移の変更が必要になった場合、またはブラウザで横overflowをCSS固有変更だけでは解消できない場合とする。その場合は実装を止め、根拠と最小代替案をユーザーへ確認する。
