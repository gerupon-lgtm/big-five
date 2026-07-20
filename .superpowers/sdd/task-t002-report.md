# T-002 実装報告

## 実装概要

- F-002 / F-014として、版付きかつ深く不変な`DiagnosticDefinition`、50件の`QuestionDefinition`、5因子定義を`app/js/data/diagnostic-definition.js`へ追加した。
- IPIP公式日本語50項目、公式の項目別因子・キー、Donnellan et al. (2006) Appendix Aの20項目順を固定した。質問表示順は20項目プレビュー後に残り30項目を公式出典順で続け、`sourceItemId`を別保持する。
- `app/js/domain/definition-validator.js`へ、構造・未知フィールド・版参照・ID・順序・因子件数・プレビュー整合性・入れ子レコード・明示注入を必須とする独立authority fixtureを検証する純粋関数を追加した。エラーコードは`DEFINITION_INVALID`。
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

## レビュー修正（2026-07-21）

### 修正内容

- `docs/data-model.md` 2.2〜2.4を正典として、公開`DiagnosticDefinition`を13フィールド、`QuestionDefinition`を7フィールド、`FactorDefinition`を6フィールドへ厳密に合わせた。`order`は段階出題順、`sourceItemId`は文字列の公式項目IDである。
- 尺度名は`DiagnosticDefinition.scaleName`、出典・IPIPパブリックドメイン条件は`source`、限界は文字列配列`limitations`から取得できる。permission sourceを`source`へ含めた。
- `validateDefinitionStructure`と`validateDefinitionAuthority`を公開した。両者はAppMetaのcanonical version registryを必須とし、後者は独立fixtureの自己整合性を検証してから50行・20項目順・文言・因子・キー・プレビュー包含を照合する。
- FactorDefinitionへ価値中立の日本語表示、学術名称、両極説明、説明文を追加した。
- import契約テストを強化し、runtime definition/validatorからtest fixture、prototype、乱数、ブラウザAPIへの依存がないことを確認する。AST解析は不要な過剰実装と判断した。
- `docs/基本設計サマリ.md`の現状記述をすべてT-002完了、次実装T-003へ同期した。

### 修正後の検証

- `node --test app/tests/definition-validator.test.js` → 8 passed, 0 failed。
- `npm.cmd run check` → `Static check passed (8 JavaScript files, one canonical runtime version).`
- `npm.cmd test` → 60 passed, 0 failed。
- `git diff --check` → 問題なし。

### 修正ファイルと自己レビュー

- 更新: `app/js/data/diagnostic-definition.js`、`app/js/domain/definition-validator.js`、`app/tests/definition-validator.test.js`、`app/tests/fixtures/ipip-ja-50-authority.fixture.js`、`docs/基本設計サマリ.md`、本報告。
- 確認: runtime definitionはtest fixtureをimportせず、診断版は`AppMeta.diagnosticVersions`だけを正典として参照する。
- `git diff --check` → 問題なし。

## 変更ファイル

- `app/js/data/diagnostic-definition.js`
- `app/js/domain/definition-validator.js`
- `app/tests/definition-validator.test.js`
- `app/tests/fixtures/ipip-ja-50-authority.fixture.js`
- `docs/tasks.md`
- `docs/基本設計サマリ.md`

## 自己レビュー

- 公式出典番号を表示順と混同せず、`sourceItemId`と`order`を分離した。
- 実行時定義はテストfixtureをimportせず、authority fixtureは検証関数へ明示注入するため、通常アプリにテストデータを持ち込まない。
- `prototype-big-five/`へのimport・移植はしていない。ランダム選択・実行時変更も追加していない。
- `package-lock.json`は開始時点から未追跡だったため、本タスクのコミット対象から除外する。

## 懸念事項

- 当初ブリーフにあった「各因子5 positive / 5 negative」は公式項目別キーと一致しない。公式キーを優先する方針へブリーフが訂正済みであり、本実装は項目別の公式キーをそのまま保持する。

## scaleName review repair (2026-07-21)

- Finding: T-002 requires retrieval of the diagnostic scale name, but the canonical `DiagnosticDefinition` schema did not expose `scaleName`.
- Resolution: Added required `scaleName` to `docs/data-model.md` section 2.2, the immutable runtime `DiagnosticDefinition`, the exact-field validator, and the schema regression test. The value is `IPIP日本語50項目版`.
- Verification:
  - `node --test app/tests/definition-validator.test.js` -> 8 passed, 0 failed
  - `npm.cmd run check` -> Static check passed (8 JavaScript files, one canonical runtime version).
  - `npm.cmd test` -> 60 passed, 0 failed
  - `git diff --check` -> no issues
## 最終レビュー修正（2026-07-21）

### 指摘と解決

- 要件v1.7の因子表示名・固定順へ修正し、情緒安定性と神経症傾向の逆方向関係、知性・想像力とBig Five開放性の対応を説明文へ明記した。
- `FACTORS`と`FACTOR_METADATA`の重複配列を、名前付きオブジェクトの`FACTOR_DEFINITION_TABLE`へ統合し、表自体と公開定義を深く不変にした。
- `AppMeta.diagnosticVersions`を診断版の唯一の正典とし、`DiagnosticDefinition`、開始画面モデル、共有モデルが同じ6項目を参照するようにした。構造・authority検証はこのレジストリの明示注入と完全一致を必須とし、空`scaleId`と形式上有効な無関係`*-v1`を拒否する。
- authority fixtureはトップレベル3フィールド、公式ID 1〜50の完全かつ一意な行集合、20件の一意なpreview配列、質問IDと出典IDの対応、各行の`previewIncluded`整合をruntime比較前に検証する。
- fixtureに依存しない代表公式値として出典ID 1・24・50の日本語文言、因子、方向、preview包含をハードコードした。

### TDD証跡

- RED: `node --test app/tests/definition-validator.test.js app/tests/version-contract.test.js app/tests/review-contracts.test.js` → 21 tests、14 passed、7 failed。旧因子順、診断版レジストリ未実装、開始・共有モデルの版欠落、明示版比較未実装を検出した。
- GREEN: 同コマンド → 21 passed、0 failed。

### 最終検証

- `node --test app/tests/definition-validator.test.js app/tests/version-contract.test.js app/tests/review-contracts.test.js` → 21 passed、0 failed。
- `npm.cmd run check` → `Static check passed (8 JavaScript files, one canonical runtime version).`
- `npm.cmd test` → 66 passed、0 failed。
- `git diff --check` → 問題なし。

### 最終変更ファイル

- `app/js/config/app-meta.js`
- `app/js/data/diagnostic-definition.js`
- `app/js/domain/definition-validator.js`
- `app/js/domain/version-model.js`
- `app/tests/definition-validator.test.js`
- `app/tests/version-contract.test.js`
- `app/tests/review-contracts.test.js`
- `docs/data-model.md`
- `docs/tasks.md`
- 本報告

### 最終自己レビュー

- runtimeの診断版リテラル重複、因子メタデータの位置依存配列、fixtureとの循環参照はない。
- 通常版の外部送信、ブラウザAPI依存、ランダム抽出、`prototype-big-five/`の変更・移植はない。
- `package-lock.json`は開始時点からの未追跡ファイルであり、コミット対象外とする。
