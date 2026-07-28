## 結果

T-008A / F-005 / F-006 / F-008 / F-015 の結果画面統合を完了した。称号と承認済みキャラクターをヒーローとして先頭に置き、5因子の二段階開示、設問構成と固定方法情報のボトムシート、詳細結果からのトップ復帰を提供する。

## 変更ファイル

- `app/js/presentation/result-screen.js`: ヒーロー、称号理由、5因子開示、設問構成、方法シート、詳細結果のトップ導線を統合した。
- `app/js/main.js`: モード別の不変な設問構成と固定方法情報を生成し、保存済み・未保存の詳細結果で異なるトップ復帰を接続した。
- `app/js/presentation/bottom-sheet.js`: 表などの追加コンテンツを安全に差し込める任意の `appendContent` を追加した。
- `app/css/styles.css`: ヒーロー、因子スコア行、開示パネル、設問構成表のレスポンシブ表示を追加した。
- `app/tests/result-screen.test.js`、`app/tests/app-shell.test.js`: 統合動作を追加・更新した。

## 実行した検証と結果

TDD RED:

```powershell
node --test app/tests/result-screen.test.js app/tests/app-shell.test.js
```

結果: 46件中37件成功、9件失敗。失敗は想定どおり、未実装の `.result-hero`、因子開示、方法シート、`トップへ戻る` 導線に起因した。

TDD GREEN / focused regression:

```powershell
node --test app/tests/question-composition.test.js app/tests/result-disclosure-model.test.js app/tests/bottom-sheet.test.js app/tests/radar-chart.test.js app/tests/result-screen.test.js app/tests/app-shell.test.js
```

結果: 65件成功。

最終検証:

```powershell
npm.cmd test
npm.cmd run check
git diff --check
```

結果: 全テスト451件成功。静的検証は `Static check passed (44 JavaScript files, one canonical runtime version).`。差分検査も成功。

## 判断したこと

- 既存の `createResultDisclosureModel` だけで記録の因子・カテゴリ分類を行い、画面側で再分類しない。
- 開閉状態は画面内だけで保持し、スナップショットやストレージには書き込まない。
- 設問構成は件数行だけを結果レンダラーへ渡し、設問本文・回答は渡さない。
- 未保存のライブ詳細結果は、復帰時に再表示できなくなる旨を確認してからトップへ移動する。保存済み詳細結果は確認なしで移動する。

## 未解決・リスク

- Q-006、Q-012、Q-013の承認待ちコンテンツや `result-text-v2` / `titleReflection` には触れていない。
- 実ブラウザのシートのEscape操作・スクロール・狭幅見た目は既存のブラウザスモーク対象だが、今回の追加UIについては今後の手動確認で補強できる。

## ブラウザ検証調整

360×800の実ブラウザ検証で、方法情報ダイアログを開いた後に実キー入力でEscapeを押しても5秒以内に閉じず、ランチャーが `aria-expanded="true"` のまま残る事象を確認した。ネイティブ既定動作だけに依存せず、`cancel` と `keydown` の両経路をアプリの閉じる契約へ接続した。同期的に `close` イベントが発生しても、閉じる処理とランチャーへのフォーカス復元は各1回だけ実行する。

TDD RED:

```powershell
node --test app/tests/bottom-sheet.test.js app/tests/result-screen.test.js
```

結果: 18件中16件成功、2件失敗。`cancel` が `defaultPrevented=false` のままで、`keydown` Escapeも処理されないという、明示ハンドラ欠落による期待どおりの失敗だった。

TDD GREEN:

```powershell
node --test app/tests/bottom-sheet.test.js app/tests/result-screen.test.js
```

結果: 18件成功、失敗0件。ネイティブ `cancel` と決定的な `keydown` Escapeフォールバックの両方で、ダイアログ閉鎖、`aria-expanded="false"`、ランチャーフォーカス復元を確認した。同期 `close` と後続 `cancel` を含めてもclose/focus呼出しは各1回だった。

ブラウザ調整後の最終検証は `npm.cmd test` が459件成功、`npm.cmd run check` が `Static check passed (44 JavaScript files, one canonical runtime version).`、`git diff --check` が成功した。
