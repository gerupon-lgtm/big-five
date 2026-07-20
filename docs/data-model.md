# Big Five自己理解支援ツール データモデル

| 項目 | 内容 |
|---|---|
| 設計版 | 0.3 |
| 作成日 | 2026-07-20 |
| 更新日 | 2026-07-21 |
| 入力要件 | `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md` v1.7 |
| 永続化 | 静的配布物＋ブラウザ`localStorage`＋ベータ限定OCI PostgreSQL集計 |

## 1. 設計原則

- 通常公開版は実行時DBとアカウントを持たない。ベータ版だけはOCI PostgreSQLの集計専用テーブルを使用する。
- 尺度・採点・文章・称号・猫・演出は、版付きの読み取り専用定義として配布する。
- ブラウザへ永続化するのは途中回答と結果スナップショットだけとする。
- 生回答は途中回答にだけ保持し、完答時に削除する。結果履歴・共有物へ移さない。
- 過去結果は診断当時の文章・ID・版を保存し、現行定義による自動上書きを行わない。
- 保存不可・容量不足・部分破損でも、画面上の回答中状態または計算済み結果を維持する。

## 2. 静的定義

### 2.1 AppMeta

【想定】正典: `app/js/config/app-meta.js`

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| appVersion | string | ○ | `mvp-0.1.0`等 |
| storageSchemaVersion | integer | ○ | 端末保存スキーマ版 |
| cardTemplateVersion | string | ○ | 共有カード描画版 |
| characterManifestVersion | string | ○ | 猫アセット対応版 |
| presentationDefinitionVersion | string | ○ | 色・香り定義版 |
| diagnosticVersions | DiagnosticVersionRegistry | ○ | 診断定義が参照する正典版レジストリ |
| releasedAt | string | ○ | ISO 8601 |
| deploymentMode | `normal` \| `beta` | ○ | 通常版とベータ版を分離 |
| betaAggregationEnabled | boolean | ○ | 通常版は必ずfalse |
| betaApiBaseUrl | string \| null | ○ | ベータ版だけ公開API URL。秘密を含めない |

#### DiagnosticVersionRegistry

`app/js/config/app-meta.js`で深く不変な値として管理し、診断定義、開始画面モデル、共有モデルが同じ値を参照する。

| 項目 | 型 | 必須 | 値 |
|---|---|---|---|
| scaleId | string | ○ | `ipip-ja-50` |
| scaleVersion | string | ○ | `ipip-ja-50-v1` |
| questionVersion | string | ○ | `ipip-ja-50-question-set-v1` |
| scoringVersion | string | ○ | `ipip-ja-50-scoring-v1` |
| resultTextVersion | string | ○ | `result-text-v1` |
| titleRuleVersion | string | ○ | `title-rule-v1` |

### 2.2 DiagnosticDefinition

【想定】正典: `app/js/data/diagnostic-definition.js`
`scaleId`と5つの版フィールドは`AppMeta.diagnosticVersions`を参照し、独立したリテラルを持たない。


| 項目 | 型 | 必須 | 制約・説明 |
|---|---|---|---|
| diagnosisId | string | ○ | `big-five-ipip-ja` |
| scaleId | string | ○ | 採用尺度ID |
| scaleName | string | ○ | `IPIP日本語50項目版` |
| scaleVersion | string | ○ | 原尺度・日本語項目集合の版 |
| questionVersion | string | ○ | 文言・順序・20問集合の版 |
| scoringVersion | string | ○ | 因子割当・逆転・換算の版 |
| resultTextVersion | string | ○ | 結果文定義版 |
| titleRuleVersion | string | ○ | 初版は`title-rule-v1` |
| factorOrder | FactorId[5] | ○ | UI表示順を固定 |
| previewQuestionIds | string[20] | ○ | 固定20問。重複不可 |
| detailQuestionIds | string[50] | ○ | 固定50問。20問集合を包含 |
| source | SourceReference[] | ○ | 出典・利用条件 |
| limitations | string[] | ○ | 結果画面から参照する限界 |

起動時に次を検証する。

- 20問・50問の件数、一意性、包含関係
- 各因子の20問版4項目、50問版10項目
- 全質問が既知の因子と方向を持つ
- 参照する全バージョンが存在する

### 2.3 QuestionDefinition

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| id | string | ○ | 版内で一意 |
| order | integer | ○ | 固定出題順 |
| textJa | string | ○ | IPIP公式掲載の日本語訳 |
| factorId | FactorId | ○ | E/A/C/ES/O相当 |
| keyedDirection | `positive` \| `negative` | ○ | 逆転有無 |
| sourceItemId | string | ○ | 原項目との照合キー |
| previewIncluded | boolean | ○ | 固定20問への包含 |

### 2.4 FactorDefinition

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| id | `extraversion` \| `agreeableness` \| `conscientiousness` \| `emotionalStability` \| `intellectImagination` | ○ | 安定ID |
| displayName | string | ○ | 一般向け主表示 |
| academicName | string | ○ | 心理学上の対応名 |
| lowPole | string | ○ | 価値中立の低側説明 |
| highPole | string | ○ | 価値中立の高側説明 |
| description | string | ○ | 尺度範囲内の説明 |

### 2.5 ResultTextDefinition

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| id | string | ○ | 固定テンプレートID |
| version | string | ○ | 結果文版 |
| appliesTo | object | ○ | 因子、方向、区分、組合せ条件 |
| section | enum | ○ | summary/strength/tradeoff/work/relationship/stress/action |
| text | string | ○ | 表示文 |
| evidenceRefs | string[] | ○ | 根拠対応表の参照ID |
| previewAllowed | boolean | ○ | 20問結果で使用可能か |

Q-006確定前は構造だけを実装し、本番文面を仮生成しない。

### 2.6 TitleProfileDefinition

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| titleId | string | ○ | 51種類で一意 |
| label | string | ○ | 称号 |
| kind | `balanced` \| `single` \| `pair` | ○ | 分類 |
| factors | TitleFactorRule[] | ○ | 0、1、2因子とhigh/low |
| characterId | string | ○ | 猫と1対1 |
| summaryTextId | string | ○ | 結果文参照 |
| defaultPaletteId | string | ○ | 未選択時の共有配色 |

全51件、タイトルID重複なし、キャラクターID重複なし、40＋10＋1の組合せ網羅を自動検証する。

### 2.7 CharacterManifestEntry

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| characterId | string | ○ | TitleProfileDefinitionと一致 |
| assetVersion | string | ○ | アセット版 |
| imagePath | string | ○ | 同一オリジンの相対パス |
| width | integer | ○ | 元画像幅 |
| height | integer | ○ | 元画像高 |
| alt | string | ○ | 画像がなくても意味が通る代替文 |
| integrity | string | - | 【想定】ビルド時検証用ハッシュ |

Q-012確定前は`object-fit: contain`で全体表示し、共有カードでも比率を維持する。

### 2.8 PaletteDefinition

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| paletteId | string | ○ | 一意ID |
| version | string | ○ | 演出定義版 |
| label | string | ○ | 利用者向け名称 |
| colors | object | ○ | background/surface/primary/accent/text/chart |
| characterSeparation | object | ○ | 猫用の明暗縁取り、影、ニュートラル背景プレート候補。選択色そのものは変更しない |
| description | string | ○ | 象徴的な提案である説明 |
| contrastVerified | boolean | ○ | WCAG確認済みか |

同系色の猫を理由にPaletteDefinitionを無効化しない。共有カード描画はCharacterManifest、PaletteDefinition、cardTemplateVersionから視認性補助を決定し、猫の再配色や候補パレットの除外を行わない。

### 2.9 FragranceSuggestion

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| fragranceId | string | ○ | 一意ID |
| version | string | ○ | 演出定義版 |
| scene | string | ○ | 利用場面 |
| accordLabel | string | ○ | 香調名 |
| description | string | ○ | 雰囲気の説明 |
| disclaimerId | string | ○ | 共通注意書き |

商品、用量、滴数、配合、摂取、塗布、ディフューザー使用法の項目は持たない。

## 3. 端末内ストレージ

### 3.1 保存キー

【想定】`big-five-self-understanding:v1`

キーを版付きにし、プロトタイプの`bigFivePrototype:v1`と混在させない。

### 3.2 StorageEnvelope

```js
{
  schemaVersion: 1,
  updatedAt: "2026-07-20T12:34:56.789Z",
  progressByDiagnosis: {
    "big-five-ipip-ja": ProgressRecord
  },
  results: [ResultSnapshot]
}
```

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| schemaVersion | integer | ○ | 読込・移行判定 |
| updatedAt | string | ○ | ISO 8601 |
| progressByDiagnosis | object | ○ | 診断IDごとに最大1件 |
| results | ResultSnapshot[] | ○ | 上限・自動期限なし |

### 3.3 ProgressRecord

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| progressId | string | ○ | `crypto.randomUUID()` |
| diagnosisId | string | ○ | 診断定義参照 |
| mode | `preview20` \| `detail50` | ○ | 現在の回答段階 |
| versionTuple | VersionTuple | ○ | 再開互換性判定 |
| startedAt | string | ○ | ISO 8601 |
| updatedAt | string | ○ | ISO 8601 |
| currentIndex | integer | ○ | 0〜49 |
| answers | object | ○ | questionId -> 1..5 |
| previewDecision | `undecided` \| `showPreview` \| `continueHidden` | ○ | 20問後の分岐 |

制約:

- `answers`のキーは現在の定義に存在する質問だけ。
- 回答は整数1〜5。
- `currentIndex`より先の回答があっても、定義との整合が取れなければ破損扱い。
- VersionTuple不一致時は再開せず、再開始を案内する。
- 完答結果の保存成否にかかわらず、結果が画面上で成立した後に生回答を削除する。保存失敗時は当該画面セッションのメモリだけで結果を維持する。

### 3.4 VersionTuple

| 項目 | 型 | 説明 |
|---|---|---|
| scaleVersion | string | 尺度版 |
| questionVersion | string | 設問版 |
| scoringVersion | string | 採点版 |
| resultTextVersion | string | 結果文版 |
| titleRuleVersion | string | 称号判定版 |
| characterManifestVersion | string | 猫アセット版 |
| presentationDefinitionVersion | string | 色・香り版 |
| cardTemplateVersion | string | 共有カード版 |
| appVersion | string | アプリ版 |

### 3.5 ResultSnapshot

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| resultId | string | ○ | 一意ID |
| diagnosisId | string | ○ | 診断ID |
| completedAt | string | ○ | ISO 8601 |
| questionCount | 20 \| 50 | ○ | 精度区分 |
| mode | `preview20` \| `detail50` | ○ | 表示区分 |
| versionTuple | VersionTuple | ○ | 当時版 |
| factors | FactorResult[5] | ○ | 内部平均と表示スコア |
| titleId | string | ○ | 判定済み称号 |
| characterId | string | ○ | 当時の猫 |
| characterAssetVersion | string | ○ | 再現用 |
| boundaryFlags | BoundaryFlag[] | ○ | 境界・僅差表示 |
| renderedTexts | RenderedResultText[] | ○ | 当時文面を保存 |
| selectedPaletteId | string | ○ | 未選択時も標準ID |
| cardTemplateVersion | string | ○ | 再生成用 |

`answers`は持たない。`renderedTexts`は結果文更新後も当時表示を維持するため保存する。

### 3.6 FactorResult

| 項目 | 型 | 説明 |
|---|---|---|
| factorId | FactorId | 因子 |
| rawMean | number | 逆転後1〜5平均。判定・比較用 |
| displayScore | integer | 0〜100整数。表示専用 |
| band | `low` \| `middle` \| `high` | title-rule-v1 |
| salience | number | `abs(rawMean - 3)` |
| directionalSupportCount | integer | 同点解消用 |
| variance | number | 同点解消用 |

## 4. 比較互換性

次のすべてが一致する結果だけを直接比較可能とする。

- diagnosisId
- scaleVersion
- questionVersion
- scoringVersion
- questionCount
- 5因子がすべて有限値かつ1〜5範囲

結果文版、称号判定版、猫版、演出版が異なる場合でもスコア比較条件を満たせば比較できるが、表示表現が異なる旨を明示する。【想定】この扱いは基本設計段階の技術判断であり、要件8.5を満たす。

## 5. 更新・削除・復元

| 対象 | 生成 | 更新 | 削除 | 復元 |
|---|---|---|---|---|
| 静的定義 | リリース時 | 新しい版を追加 | 利用中の版は削除しない | Gitで復元 |
| 途中回答 | 新規開始時 | 回答ごと | 完答・破棄・全削除 | 提供しない |
| 結果履歴 | 完答時 | パレット選択だけ更新可 | 個別・全削除 | 提供しない |
| 共有物 | 明示操作時 | 再生成 | 生成物をアプリ内保持しない | 履歴から再生成 |
| ベータ集計値 | ベータ版の完答・カード利用時 | 原子的な加算だけ | Q-011に従い管理者が一括処理 | DBバックアップからの復旧。個人単位復元は非該当 |

## 6. 保存エラーと破損

安定した内部コード:

| コード | 条件 | 回復 |
|---|---|---|
| STORAGE_UNAVAILABLE | API無効・セキュリティ例外 | メモリで継続、保存不可を通知 |
| STORAGE_QUOTA_EXCEEDED | 容量不足 | 画面結果を維持、削除導線 |
| STORAGE_SCHEMA_UNSUPPORTED | 未対応の将来版 | 読込せず新規開始、既存値を上書きしない |
| STORAGE_RECORD_INVALID | 一部レコード破損 | 当該レコードだけ除外、残りを維持 |
| PROGRESS_VERSION_MISMATCH | 設問・尺度版不一致 | 継続不可理由と新規開始 |

エラーコードを利用者へそのまま表示せず、`docs/screens.md`の文言へ変換する。

## 7. ベータ匿名集計データ

F-017は通常公開から分離し、既存OCI PostgreSQLへ専用スキーマまたは専用テーブル群として追加する。設問・称号・色のマスタとカウンターを同一行へ混在させない。

### 7.1 beta_questions（集計対象設問マスタ）

| 列 | PostgreSQL型 | 必須 | 説明 |
|---|---|---|---|
| question_set_version | text | ○ | 複合PK。静的アプリ定義と一致 |
| question_id | text | ○ | 複合PK |
| preview_included | boolean | ○ | 固定20問への包含 |
| option_min | smallint | ○ | 初版1 |
| option_max | smallint | ○ | 初版5 |

設問本文と採点方向は集計APIに不要なため保存を必須にしない。ID・版・選択肢範囲を検証できる最小マスタとする。

### 7.2 beta_titles（集計対象称号マスタ）

| 列 | PostgreSQL型 | 必須 | 説明 |
|---|---|---|---|
| title_rule_version | text | ○ | 複合PK |
| question_count | smallint | ○ | 複合PK。20または50 |
| title_id | text | ○ | 複合PK。最大51種類 |

### 7.3 beta_colors（集計対象色マスタ）

| 列 | PostgreSQL型 | 必須 | 説明 |
|---|---|---|---|
| palette_version | text | ○ | 複合PK |
| color_id | text | ○ | 複合PK |

### 7.4 beta_question_choice_counts

| 列 | PostgreSQL型 | 必須 | 説明 |
|---|---|---|---|
| question_set_version | text | ○ | 複合PK、beta_questions参照 |
| question_count | smallint | ○ | 複合PK。20または50を分離集計 |
| question_id | text | ○ | 複合PK |
| option_value | smallint | ○ | 複合PK。1〜5 |
| answer_count | bigint | ○ | 0以上。原子的に加算 |
| updated_at | timestamptz | ○ | 最終加算時刻。個別回答時刻ではない |

同一人物の回答一式を復元できる行やイベントIDとの外部キーを設けない。

### 7.5 beta_title_counts

| 列 | PostgreSQL型 | 必須 | 説明 |
|---|---|---|---|
| scoring_version | text | ○ | 複合PK |
| title_rule_version | text | ○ | 複合PK |
| question_count | smallint | ○ | 複合PK |
| title_id | text | ○ | 複合PK、beta_titles参照 |
| result_count | bigint | ○ | 0以上 |
| updated_at | timestamptz | ○ | 最終加算時刻 |

### 7.6 beta_completion_counts

| 列 | PostgreSQL型 | 必須 | 説明 |
|---|---|---|---|
| question_set_version | text | ○ | 複合PK |
| question_count | smallint | ○ | 複合PK。20または50 |
| completion_count | bigint | ○ | 0以上 |
| updated_at | timestamptz | ○ | 最終加算時刻 |

### 7.7 beta_color_card_action_counts

| 列 | PostgreSQL型 | 必須 | 説明 |
|---|---|---|---|
| palette_version | text | ○ | 複合PK、beta_colors参照 |
| color_id | text | ○ | 複合PK |
| action_type | text | ○ | 複合PK。download/share |
| action_count | bigint | ○ | 0以上 |
| updated_at | timestamptz | ○ | 最終加算時刻 |

色の選択だけでは加算せず、選択配色カードの保存またはOS共有成功後だけ加算する。

### 7.8 beta_idempotency_keys

【想定】通信応答消失による二重加算を防ぐための短期テーブル。

| 列 | PostgreSQL型 | 必須 | 説明 |
|---|---|---|---|
| request_hash | char(64) | ○ | PK。ランダムrequestIdのSHA-256 |
| expires_at | timestamptz | ○ | 初期値は登録から24時間 |

- 回答、称号、色、IPアドレスとのリレーションを持たない。
- 定期ジョブで期限切れを削除する。
- 保持時間はQ-011で最終確定する。

## 8. 集計の整合性・保持

- 完答集計は設問選択肢、称号、完了数、冪等キーを1トランザクションで更新する。
- カウントは`INSERT ... ON CONFLICT ... DO UPDATE SET count = count + 1`相当の原子的UPSERTを使う。
- 1項目でも版・ID・件数・選択肢が不正なら全体をロールバックする。
- API・DBには個人単位イベント、生回答一式、結果履歴、IPアドレス、User-Agent、Refererを保存しない。
- Googleフォーム等の回答を本DBへ取り込まず、集計値と個人単位で結合しない。
- 【要確認: Q-011】集計値、冪等キー、バックアップの保持期間とベータ終了後の削除またはスナップショット方針。
