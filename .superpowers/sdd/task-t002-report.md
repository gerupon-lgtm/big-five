# T-002 実装報告

## 実装概要

- F-002 / F-014として、版付きかつ深く不変な`DiagnosticDefinition`、50件の`QuestionDefinition`、5因子定義を`app/js/data/diagnostic-definition.js`へ追加した。
- IPIP公式日本語50項目、公式の項目別因子・キー、Donnellan et al. (2006) Appendix Aの20項目順を固定した。質問表示順は20項目プレビュー後に残り30項目を公式出典順で続け、`sourceItemId`を別保持する。
- `app/js/domain/definition-validator.js`へ、構造・未知フィールド・版参照・ID・順序・因子件数・プレビュー整合性・入れ子レコード・任意注入の独立authority fixtureを検証する純粋関数を追加した。エラーコードは`DEFINITION_INVALID`。
- 実行時定義を参照しない独立fixtureを`app/tests/fixtures/`へ追加し、50行全件、20項目順、改変検知、不変性、プロトタイプ非依存・非ランダムをテストした。
- `docs/tasks.md`にT-002の完了日・検証を記録し、`docs/基本設計サマリ.md`の次実装単位をT-003へ更新した。

## TDD証跡

1. 定義構造
   - RED: `node --test app/tests/definition-validator.test.js` → `ERR_MODULE_NOT_FOUND`（`app/js/data/diagnostic-definition.js`未作成）。
   - GREEN: 同コマンド → 1/1 pass。
2. 独立authority fixture
   - RED: 同コマンド → `ERR_MODULE_NOT_FOUND`（`app/tests/fixtures/ipip-ja-50-authority.fixture.js`未作成）。
   - GREEN: 同コマンド → 2/2 pass。
3. authority改変検知と不変性
   - RED: 同コマンド → `Missing expected exception`（独立fixture照合未実装）。
   - GREEN: 同コマンド → 5/5 pass。入れ子レコードの未知フィールド検知追加後は6/6 pass。

## 最終検証

- `node --test app/tests/definition-validator.test.js` → 6 passed, 0 failed。
- `npm.cmd run check` → `Static check passed (8 JavaScript files, one canonical runtime version).`
- `npm.cmd test` → 58 passed, 0 failed。
- `git diff --check` → 問題なし。

## 変更ファイル

- `app/js/data/diagnostic-definition.js`
- `app/js/domain/definition-validator.js`
- `app/tests/definition-validator.test.js`
- `app/tests/fixtures/ipip-ja-50-authority.fixture.js`
- `docs/tasks.md`
- `docs/基本設計サマリ.md`

## 自己レビュー

- 公式出典番号を表示順と混同せず、`sourceItemId`と`stagedOrder`を分離した。
- 実行時定義はテストfixtureをimportせず、authority fixtureは検証関数へ明示注入するため、通常アプリにテストデータを持ち込まない。
- `prototype-big-five/`へのimport・移植はしていない。ランダム選択・実行時変更も追加していない。
- `package-lock.json`は開始時点から未追跡だったため、本タスクのコミット対象から除外する。

## 懸念事項

- 当初ブリーフにあった「各因子5 positive / 5 negative」は公式項目別キーと一致しない。公式キーを優先する方針へブリーフが訂正済みであり、本実装は項目別の公式キーをそのまま保持する。
