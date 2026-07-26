# Big Five自己理解支援ツール 実装タスク

| 項目 | 内容 |
|---|---|
| 設計版 | 0.4 |
| 作成日 | 2026-07-20 |
| 更新日 | 2026-07-26 |
| 要件正典 | 要件定義書v1.9 |
| 初期リリース | `mvp-0.1.0` |

## 1. トレーサビリティ表（正典）

| 要件ID | 機能名 | 画面 | 処理 | データ | タスク | 状態 |
|---|---|---|---|---|---|---|
| F-001 | 開始・注意事項 | S-001, S-008 | 起動・説明モデル | AppMeta, DiagnosticDefinition | T-001, T-008 | 確定 |
| F-002 | 尺度・設問版管理 | S-002, S-008 | 定義検証、採点、結果文根拠検証 | DiagnosticDefinition, QuestionDefinition, ResultEvidenceDefinition, ResultTextDefinition | T-002, T-005 | Q-006版付き定義実装済み。Content Approval pending |
| F-003 | 回答 | S-002 | questionnaire | ProgressRecord | T-004 | 確定 |
| F-004 | 途中保存・再開 | S-001, S-002 | storage-adapter | StorageEnvelope, ProgressRecord | T-004 | 確定 |
| F-005 | 基本結果 | S-003 | scoring, result-composer | ResultTextDefinition, ResultSnapshot | T-003, T-005 | Q-006 preview定義・合成・snapshotと保存済み画面を実装。完答caller／Content Approval pending |
| F-006 | 詳細結果 | S-004 | scoring, result-composer | ResultTextDefinition, ResultSnapshot | T-003, T-005 | Q-006 detail定義・合成・snapshotと保存済み画面を実装。完答caller／Content Approval pending |
| F-007 | 心理モデル表示 | S-001, S-003, S-004, S-008 | explanation model | DiagnosticDefinition | T-008 | 確定 |
| F-008 | 結果可視化 | S-003, S-004, S-007 | radar-renderer | FactorResult | T-005 | 確定 |
| F-009 | 結果履歴 | S-001, S-006 | history store | ResultSnapshot | T-006 | 確定 |
| F-010 | 結果比較 | S-006, S-007 | compatibility, comparison | ResultSnapshot | T-006 | 確定 |
| F-011 | 共有プレビュー | S-005 | share-card preview | ShareViewModel | T-007 | Q-007待ち |
| F-012 | 共有・保存 | S-005 | share/download/clipboard | 一時Blob、共有テキスト | T-007 | Q-007待ち |
| F-013 | データ削除 | S-002, S-006 | storage delete | ProgressRecord, ResultSnapshot | T-004, T-006 | 確定 |
| F-014 | バージョン表示 | 全画面・共有物 | version registry | AppMeta, VersionTuple | T-001, T-002, T-007 | 確定 |
| F-015 | エラー・代替動作 | 全画面 | error mapping, fallbacks | error codes | T-004, T-006, T-007, T-008 | 確定 |
| F-016 | プロフィールキャラクター | S-003, S-004, S-005, S-006 | title-classifier, result-composer, character-loader | TitleProfileDefinition, ResultTextDefinition, CharacterManifest | T-003, T-005 | 51称号の副題・理由と保存済み画面の失敗時テキストを実装。Q-012アセット・loader待ち |
| F-017 | ベータ匿名集計 | S-001, S-009, 結果・共有 | beta aggregation API、atomic upsert | beta_* masters/counts/idempotency | T-010 | 設計確定。公開前にQ-011運用値 |
| F-018 | 色・香り提案 | S-003, S-004, S-005 | presentation selector, share-card, color action aggregate | PaletteDefinition, FragranceSuggestion, beta_color_card_action_counts | T-005, T-007, T-010 | Q-013設計済み。実データ待ち |
| NF-01 | 性能 | 全画面 | 遅延読込、計測 | asset manifest | T-005, T-011 | 確定 |
| NF-02 | 対応環境・レスポンシブ | 全画面 | browser smoke | - | T-008, T-012 | 確定 |
| NF-03 | アクセシビリティ | 全画面 | a11y checks | alt、代替テキスト | T-008, T-012 | 確定 |
| NF-04 | セキュリティ・プライバシー | 全画面 | CSP、通常版非送信、ベータ集計・ログ制限 | StorageEnvelope, beta_* | T-009, T-010, T-011, T-012 | Q-011運用値以外確定 |
| NF-05 | 正確性・表現品質 | 結果・説明 | authority fixtures, text rules | 全静的定義 | T-002, T-003, T-005, T-012 | Q-006実装レビュー済み。人手Content Approval pending |
| NF-06 | 運用・可用性 | - | deploy、監視、切戻し、API health・DB backup | release metadata, beta_* | T-010, T-011 | Q-008/Q-010/Q-011一部待ち |

### CSVコンテンツ作成基盤の実装記録（2026-07-26）

- 対応: Q-006およびT-005/F-002/F-005/F-006/F-016のコンテンツ作成基盤。`content/source/`のCSV、3つのrelease schema、4つのコンパイラ、決定的な7 JSON builder、atomic writer、CSV/ES Modules parity testを実装した。
- 初期状態: 50問、固定20問、51称号、237結果文、6根拠。E-0は`approved`、E-1〜E-5は`draft`、T-0〜T-4/F-1〜F-5/X-1〜X-2は人手approval metadataなしの`reviewed`。Q-012/Q-013は未作成で、release manifest/historyはヘッダーのみである。
- 運用: 人はコミット対象のCSVだけを編集し、`app/content/`の生成JSONを手編集・コミットしない。`npm.cmd run content:validate`で検証し、`npm.cmd run content:build`はapproved complete releaseがない現在`RELEASE_NOT_SELECTED`となる。
- 移行状態: ES Modulesがruntime compatibility authorityで、runtime JSON fetchとPages deploymentは未実装。通常モードの外部通信は0件、CSPは`connect-src 'none'`を維持する。activation後のActions validate/build/deployは`docs/superpowers/plans/2026-07-26-csv-content-activation-pages.md`で扱う。
- 検証: `node --test app/tests/content-artifact-contract.test.js`、`npm.cmd run content:validate`、`npm.cmd test`、`npm.cmd run check`。Task 6のwarning-order minorは非ブロッキングとして記録し、完了済みfoundationを再開しない。

要件F-001〜F-018に未対応行はない。Q待ちの項目は実装漏れではなく、各タスク開始条件として管理する。

## 2. 実装順

| ID | タスク | 対応機能ID | 完了条件（要約） |
|---|---|---|---|
| T-001 | 正式版の静的基盤と版管理 | F-001, F-014 | `app/`が起動し、版一致テストが通る |
| T-002 | IPIP固定定義と権威データ検証 | F-002, F-014 | 50問・20問集合・因子・方向を検証できる |
| T-003 | 採点・51分類・結果モデル | F-005, F-006, F-008, F-016 | `title-rule-v1`境界・同点を決定的に再現 |
| T-004 | 回答状態機械・途中保存・削除 | F-003, F-004, F-013, F-015 | 新規→20問分岐→50問、再開・破棄が動く |
| T-005 | 結果画面・猫・レーダー・色香り | F-002, F-005, F-006, F-007, F-008, F-016, F-018 | 基本・詳細結果を代替表示込みで閲覧可能 |
| T-006 | 履歴・比較・削除 | F-009, F-010, F-013, F-015 | 当時結果を保存し、互換2件だけ比較 |
| T-007 | 共有カード・保存・コピー | F-011, F-012, F-014, F-015, F-018 | 選択配色カードを保存・共有し段階代替 |
| T-008 | 全画面統合・レスポンシブ・a11y | F-001〜F-016, F-018 | 主要フローを360px・PC・キーボードで完結 |
| T-009 | 説明・プライバシー・CSP | F-001, F-002, F-007, F-014, F-015 | 限界、非送信、削除、版、CSPを確認可能 |
| T-010 | ベータ匿名集計API・DB・事前説明 | F-017 | OCIへ匿名集計し、二重送信・通信失敗でも診断結果を維持 |
| T-011 | GitHub Pages CI/CD・運用 | F-014, NF-01, NF-04, NF-06 | テスト成功時だけPagesへ配信、切戻し可能 |
| T-012 | MVP受入・ブラウザ検証 | 全機能/NF | 要件17.1と主要異常系を検証し記録 |

## 3. フェーズ

### フェーズA: 測定コア

T-001 → T-002 → T-003

### フェーズB: ローカル完結の診断

T-004 → T-005 → T-006

### フェーズC: 共有・品質・公開

T-007 → T-008 → T-009 → T-011 → T-012

### ベータ

T-010はMVP通常公開から分離して実装できる。外部ベータ公開はQ-009とQ-011の残運用値を確定してから行う。

## 4. タスク詳細

### T-001 正式版の静的基盤と版管理

- 実装状態: 完了（2026-07-20、`mvp-0.1.0`）
- 依存: なし
- 作業:
  - `app/`のHTML/CSS/JS ES Modules構成を作る。
  - ハッシュルーターの最小入口を作る。
  - AppMetaと`mvp-0.1.0`の正典を作る。
  - npm scriptsへ正式版起動、テスト、静的チェックを追加する。
  - prototypeの既存起動・テストを維持する。
- 完了条件:
  - ローカルサーバーで開始画面の骨格が表示される。
  - AppMetaの版を開始画面モデルと共有モデルから参照できる。
  - `prototype-big-five/`に差分がない。
- 検証方法:
  - `npm.cmd test`
  - `npm.cmd run check`
  - 直接`#/start`を開き、404にならない。
  - 不一致の版定義をテストで検出する。

### T-002 IPIP固定定義と権威データ検証

- 依存: T-001
- 作業:
  - 診断、質問、因子、採点鍵の版付き定義を作る。
  - 20問集合と50問集合を固定する。
  - 原項目ID・日本語訳・因子・正逆方向の根拠fixtureを用意する。
  - definition-validatorを実装する。
- 完了条件:
  - 50問が一意、20問が一意かつ50問に包含される。
  - 各因子が20問で4項目、50問で10項目。
  - ランダム抽出と実行時変更が存在しない。
  - 尺度名、出典、限界を取得できる。
- 検証方法:
  - 移植元一致ではなく、IPIP権威資料との代表値・全件対応テスト。
  - 1項目の因子・方向・IDを故意に壊し、テストが失敗する。
  - 独自言い換えや重複IDを検出する。


#### 完了記録（2026-07-21）

- 状態: 完了（F-002、およびT-002が担当するF-014の版レジストリ・開始／共有モデル契約）。要件v1.7因子定義、AppMeta診断版レジストリ、開始画面への診断版表示、50件の`QuestionDefinition`、自己整合を検証する独立authority fixtureと純粋バリデータを実装。
- 残作業: F-014の全消費先は未完了。実際の共有出力はT-007、結果・履歴を含む全画面統合はT-008、説明画面の版表示はT-009で実装・検証する。
- 検証: 開始画面公開seamの指定2テストファイル4件成功、静的検証成功、全66件成功、`git diff --check`成功。定義・authority契約21件を含む詳細コマンドは`.superpowers/sdd/task-t002-report.md`を参照。

### T-003 採点・51分類・結果モデル

- 依存: T-002
- 作業:
  - 逆転、因子平均、表示換算を純粋関数で実装。
  - `title-rule-v1`を実装。
  - 51件のTitleProfileDefinition検証を実装。
  - 固定結果文の条件選択構造を実装。
- 完了条件:
  - 同一回答と同一版から同一FactorResult、titleId、characterId、BoundaryFlagを返す。
  - 3番目以降の因子も結果モデルに残る。
  - 表示整数を称号判定に使用しない。
- 検証方法:
  - 正方向・逆方向が全1〜5の固定値で期待平均になる。
  - 内部平均2.5/3.5の境界を含む。
  - salient 0件、1件、2件、3件以上。
  - 50問の0.1、20問の0.25僅差。
  - 顕著度同点→支持数→分散→固定順の各段階。
  - 40＋10＋1全キーが1件だけに対応。

#### 完了記録（2026-07-23）

- 状態: 完了（F-005、F-006の版付き固定結果文構造・条件selector、F-008の`FactorResult`、F-016）。`scoreDiagnostic`、`title-rule-v1`、51件の不変`TitleProfileDefinition`、厳格な結果モデル合成を純粋関数として実装した。表示整数は採点有理数からhalf-upで算出し、判定は丸め前`rawMean`だけを使い、3番目以降の因子も結果モデルに残す。
- 現在差分: T-003完了時に未実装だったQ-006の本番結果文・根拠対応表は、後続T-005/Q-006 workstreamで`result-text-v1 initial reviewed copy`として実装・独立レビュー済みとなった。人手Content Approval、結果画面・レーダー・キャラクター読込は引き続きT-005、Q-012の猫画像はasset制作で扱う。
- 検証: 公開seam契約20件成功（half-up境界、全1〜5正逆採点、入力汚染・到達不能平均・分散・顕著度・統計組拒否、40＋10＋1、0/1/2/3+分類、整数顕著度・分散同点、20/50整数境界と閾値整合、固定結果文選択・矛盾条件拒否、結果モデル汚染拒否）、全86件成功、静的検証成功、`git diff --check`成功。詳細は`.superpowers/sdd/task-t003-report.md`を参照。

### T-004 回答状態機械・途中保存・削除

- 依存: T-001, T-002
- 作業:
  - 回答状態、戻る、変更、破棄、自動保存、再開を実装。
  - 20問完答時の結果表示前分岐を実装。
  - StorageEnvelope検証とエラー変換を実装。
- 完了条件:
  - 新規開始から20問分岐、簡易結果または21〜50問へ進める。
  - `continueHidden`で20問結果がDOM・共有モデルへ出ない。
  - 版不一致時は旧回答を混在させない。
  - 保存不可でも同セッションで完答できる。
- 検証方法:
  - 回答→再読込→同位置再開。
  - 前へ戻る→変更→採点へ反映。
  - 未回答、0/6/小数、未知questionIdを拒否。
  - localStorage例外、容量不足、破損JSON、将来schema。
  - 破棄確認の取消／確定。
  - 20問分岐の両出口をE2Eで通す。

#### 完了記録（2026-07-25）

- 状態: 完了（F-003、F-004、F-013、F-015のT-004範囲）。`response-state` に固定順の回答・戻る・置換・20問出口・50問終端を、`progress-storage` に正式キーの保存・再開・対象限定破棄・遷移直後の自動保存coordinatorを実装した。`continueHidden` は進捗だけを返し、20問の結果・称号・キャラクター・共有モデルを生成しない。`showPreview`後の詳細継続は表示済みdecisionを保持する。
- 保存契約: schema 1、破損JSON、将来schema、壊れた進捗、版不一致、読込不能、容量不足、削除失敗を安定コードへ変換し、既存値を不意に上書きしない。save/discard時は無関係な壊れた進捗・結果だけを除去し、保存失敗時もメモリ上の状態と50問終端回答を維持する。完答結果成立後のResultSnapshot保存とProgressRecord削除は後続永続化統合の責務である。
- 検証: 公開seam 14件成功（開始・固定順、入力汚染拒否、戻る置換、両20問出口、showPreview後の継続、hidden非露出、50問終端、自動保存、保存再開、破損/将来/版不一致、無関係データsanitize、保存/削除失敗）。詳細は `.superpowers/sdd/task-t004-report.md` を参照。
- S-002表示層（2026-07-26）: `renderQuestionnaireScreen`に設問、自然言語の5件法、現在位置、選択済み状態、戻る、破棄、20問分岐の二択を実装した。保存失敗は設問画面と20問分岐画面の両方でだけ`role="alert"`通知し、回答は継続できる。`preview-choice`は因子、スコア、称号、猫、色、共有データを入力にもDOMにも含めない。focused 10件、Spec/Standards独立レビュー、全359件、静的検証に成功した。router・state・storageとの接続は次の統合単位である。
- 次タスク: T-005。Q-012とQ-013の構造ゲートは解決済み。Q-006文面は実装済みだが人手Content Approval pending、3体パイロットと色・香り実データは制作ゲートとして維持する。

### T-005 結果画面・猫・レーダー・色香り

- 依存: T-003, T-004
- 対応機能: F-002, F-005, F-006, F-007, F-008, F-016, F-018
- 開始ゲート:
  - Q-006: `result-text-v1 initial reviewed copy`、根拠、合成、snapshotは実装済み。E-0〜E-5、T-0〜T-4、F-1〜F-5、X-1〜X-2の各gateに必要な人手approval recordが揃うまで`Content Approval pending`
  - Q-012: 仕様は確定。11体ベースラインと複合因子第1便10体、累計21体を技術承認し、共通encoder設定と1024px正方形・透明余白検査を固定済み。残り30体、release manifest、loaderは未完了
  - Q-013: 構造と選択規則は確定。全パレット・香調・用途色展開データ
- 作業:
  - S-003/S-004の結果モデルと画面を実装。
  - レーダー＋代替テキストを実装。
  - 該当猫1体の遅延読込と代替表示を実装。
  - 色候補と香調候補を追加質問なしで表示。
- 完了条件:
  - 20問は仮結果と限界、50問は詳細結果を表示。
  - 5因子、根拠、注意、境界補足が読める。
  - パレット選択で演出だけが変わる。
  - 猫・Canvas失敗でも結果価値を維持。
- 検証方法:
  - 20問／50問、balanced/single/pair、境界あり／なし。
  - 猫404、画像遅延、Canvas不可、無効パレット。
  - 51件のmanifest参照、重複・未参照検出。
  - 360px、200%文字拡大、色覚に依存しない表示。

#### Q-006ドメイン実装記録（2026-07-26）

- 状態: DONE_WITH_CONCERNS。T-005のうちF-002/F-005/F-006/F-016に対応する結果文ドメインは実装・独立レビュー済みで、文面は`result-text-v1 initial reviewed copy`かつ`Content Approval pending`である。T-005全体とQ-006人手承認は未完了。
- schema: `ResultEvidenceDefinition`固定6件、10 section＋`claimKind`を持つ`ResultTextDefinition`。
- 定義: title 102件＋factor 135件＝237件の`result-text-v1` literal定義。
- 合成: `composeResultTexts`がdefinitionの条件選択、欠落・重複・件数、`version`、section-first・固定factor順を検証し、preview 7件／detail 42件を5フィールド`RenderedResultText`へ投影してdeep freezeする。
- snapshot: `createResultSnapshot`が各位置のexact production record IDを検証し、9フィールド`VersionTuple`と診断時文章を含む13フィールド`ResultSnapshot`を生成する。生回答、`diagnosisId`、結果定義、DOM・Canvas状態を含めず、`characterAssetVersion`と`characterManifestVersion`を分離する。
- gate: 根拠台帳ではE-0のみapproved、E-1〜E-5は`draft`で承認日なし。T-0〜T-4／F-1〜F-5はimplementation auditと独立レビュー済みだが人手approval recordなし。X-1〜X-2も人手approval recordなし。したがって`Content Approval pending`を維持する。
- 完全解決条件: E-0〜E-5、T-0〜T-4、F-1〜F-5、X-1〜X-2の各gateについて必要な人手approval recordがすべて揃うこと。
- 画面: 保存済みS-003/S-004、5軸レーダー、境界・僅差補足、Canvas・猫画像未提供時のテキストフォールバックは実装済み。完答直後の接続、character loader、色香りは後続T-005統合。
- 永続化: 13フィールドproduction ResultSnapshot validatorと`saveResultSnapshot`は実装済み。回答完答からの本番callerは未実装で、後続T-005/S-002統合で接続する。
- live結果接続ゲート（2026-07-26）: `ResultSnapshot.characterAssetVersion`は選択されたQ-012 manifest entryの`assetVersion`であり、`VersionTuple.characterManifestVersion`の流用や仮値を禁止する。production manifest entryが未作成の現状ではvalid snapshotを正典どおり生成できないため、S-002表示層だけを先行し、完答callerとlive S-003/S-004接続はQ-012パイロット承認・manifest作成後に開始する。Q-013の初期`selectedPaletteId`は該当TitleProfileの`defaultPaletteId`を使えるが、代替色・香りUIは実データ承認まで保留する。
- Q-012制作台帳Task 1（2026-07-26）: 31フィールドexact schema、51称号とのtitleId・characterId・順序一致、1〜2小物、stage別production/review state、canonical source/delivery path、SHA-256、UTC approval timeを検証する制作台帳契約を実装した。seedは`docs/title-character-catalog.md`の2つの番号表をTitleProfileへjoinし、既存ledgerを`--replace`なしで上書きしない。初回reviewのImportant 1件をfix round 1で解消し、brief行の将来証跡はnull、到達stageの必須証跡は非空かつshape一致を双方向に保証した。Task 1完了時点の実台帳51行は全件`brief`で、hash・承認者・承認時刻・画像版を仮置きしていない。
- Q-012制作台帳Task 2〜4（2026-07-26）: `balanced`、`single-intellectImagination-high`、`single-intellectImagination-low`のPNG原画とWebP変換をproject-ownerが承認した。Sharp 0.35.3／libvips 8.18.3、quality 82、alphaQuality 100、effort 6、metadata none、1024pxを共通設定として固定し、3件を`technical-approved`へ更新した。delivery SHA-256・byteLength・寸法・実pathを記録し、alpha・透明画素・余白・250,000 bytes警告を自動検査する。アクセシビリティ承認は51体完成後のrelease gateまで`null`を維持する。
- Q-012制作台帳Task 5（2026-07-26）: 残り8体の単因子キャラクターをproject-ownerが原画・WebPともに承認し、11体ベースラインを`technical-approved`で完成した。全11体は同一encoder設定、1024×1024、alphaあり、透明画素あり、端接触なし、250,000 bytes以下である。高低を善悪・能力・序列へ結び付けず、各行のsource/delivery SHA-256、byteLength、承認時刻を記録した。残り40体とrelease accessibility gateは未完了である。
- Q-012制作台帳Task 6（2026-07-26）: 複合因子キャラクター第1便10体をproject-ownerが原画・WebPともに承認し、累計21体を`technical-approved`へ更新した。風見の方角文字を除去して画像内文字なしの契約へ適合させ、全10体は指定ポーズ・1〜2小物・猫1体・無背景を維持している。共通encoder設定で1024×1024へ変換し、alphaあり、透明画素あり、端接触なし、250,000 bytes以下、source/delivery SHA-256一致を確認した。残り30体とrelease accessibility gateは未完了である。
- Q-012再利用コンポーネント（2026-07-27）: `title-pair-conscientiousness-high--extraversion-high`の歩行猫、壁掛け時計、無地カード、正典首輪を版付き透過PNGとして`docs/assets/character-production/components/`へ分離した。猫は`pose-master`、時計・カードは`direct-overlay`、首輪は姿勢適合が必要な`style-reference`として区別し、寸法・byteLength・SHA-256をmanifestへ固定した。全4点は透明四隅、alphaあり、クロマキー残りなしを確認済み。最終画像の正典は引き続き`source-png/`とし、再構成画像はQ-012のart/anatomy/technical reviewを省略しない。
- 永続化契約解消（2026-07-26）: `resultId`はRFC 4122 UUID形状へ統一する。`preview20`保存では追加回答用ProgressRecordを保持し、`detail50`完答では履歴保存の成否にかかわらず生回答を破棄する。保存成功時はsnapshot追加と進捗削除を同一StorageEnvelope書込みで行い、保存失敗時も進捗削除をbest-effortで試みる。
- 検証: `app/tests/result-evidence-definitions.test.js`、`app/tests/result-content-definitions.test.js`、`app/tests/result-composer.test.js`、`app/tests/result-snapshot.test.js`。リポジトリ同期は`app/tests/project-contract.test.js`で検証する。

#### 保存済み結果画面統合記録（2026-07-26）

- `#/result?resultId=...`で保存履歴を再検証し、exact `resultId`のS-003/S-004を独立表示する。ID不足・削除済み・破損時は保存値を書き換えず履歴へ戻して通知する。
- preview 7件／detail 42件の診断時文面を保存順に表示し、全5因子の表示整数、HTMLの「説明を見る」、根拠参照、境界・僅差補足、20問版の限界と50問で変わり得る旨を表示する。
- レーダーは5軸・25/50/75補助線を描き、Canvas未対応・描画例外時も5因子と全結果文を維持する。Q-012アセット未確定のためcharacterIdと失敗時テキストだけを表示し、画像pathを推測しない。
- `delegate-development`で新規presentation 4ファイルを委譲し、Spec/Standards独立レビューを実施した。Specの境界補足・20問注意文P2は1回差し戻して解消した。character loader、継続・共有callback、実ブラウザsmokeはQ-012／S-002／T-007／T-008の後続範囲として保持する。
- 検証: 結果画面・route・履歴・app-shell・文書契約集中36件、全349件、`npm.cmd run check`、`git diff --check`成功。

### T-006 履歴・比較・削除

- 依存: T-003, T-004, T-005
- 作業:
  - ResultSnapshot保存、新しい順表示、当時文面表示。
  - 互換判定、古い→新しい比較、差の説明。
  - 個別削除、全削除、破損レコード隔離。
- 完了条件:
  - 完答履歴に生回答がない。
  - 件数・期限上限なしで保存する。
  - 互換2件だけ比較でき、非互換理由を示す。
  - 結果文更新後も過去文面が変わらない。
- 検証方法:
  - 同時刻の安定順、20/50不一致、各版不一致、NaN。
  - 1件破損しても残りを表示。
  - 個別削除の誤対象防止、全削除の取消／確定。
  - 容量不足でも現在結果を維持。

#### ResultSnapshot・履歴・比較基盤の実装記録（2026-07-26）

- 状態: 基盤とS-006/S-007初期画面統合完了。13フィールドexact validator、RFC 4122 UUID検証、結果保存、同一ID冪等、ID衝突拒否、`preview20`進捗保持、`detail50`の結果追加・進捗削除の原子的書込みを実装した。
- 履歴・削除: `loadResultHistory`が破損結果だけを除外し、実時刻の新しい順・同時刻resultId辞書順で有効snapshotを返す。`deleteResultSnapshot`は確認後に指定IDの有効な1件だけを削除し、途中回答と他の有効・破損結果を保持する。`deleteAllData`は確認後に途中回答と結果を全削除する。
- 比較: `compareResultSnapshots`が両snapshotを再検証し、尺度版・設問版・採点版・設問数・因子値の不一致を安定コードへ分離する。互換時は古い→新しい順、固定因子順の`beforeRawMean`・`afterRawMean`・`deltaRawMean`だけをdeep freezeして返す。
- S-006: `#/history`で新しい順の結果カード、端末ローカル日時、20問／50問、称号、猫ID、5因子、診断時文面・版を表示する。1件目の選択・取消後、互換結果だけを2件目候補として有効化する。履歴0件でも全削除へ到達でき、個別／全削除は確認後に公開storage APIへ委譲する。
- S-007: `#/compare?before=...&after=...`でIDを保存履歴から再検証し、古い→新しいrawMean差を0〜100相当へ表示時だけ丸め、増加・減少・変化なしを文言でも示す。変動注意文、表現版・個別猫アセット版差、非互換理由を表示し、ID不足は履歴へ戻す。
- 安全性: 対象ProgressRecordを現行定義・版で検証し、破損・版不一致・将来StorageEnvelopeを上書きしない。詳細結果の保存失敗時は対象進捗を再検証してbest-effort削除し、結果・履歴・比較の返却値へ生回答を含めない。履歴読込は保存値を書き換えない。
- 未実装: 回答完答からの本番caller、保存済みpreviewから追加30問へ戻るS-002接続、T-007共有、Q-012猫画像loader、Q-013色香り。S-003/S-004と履歴カードからの独立画面遷移、レーダー・失敗時テキスト表示は実装済み。
- レビュー: `delegate-development`で履歴・削除と比較を非重複委譲し、独立レビューを実施した。個別削除が非対象の破損データまでsanitizeするP1を1回差し戻し、対象1件以外を保持する修正後の再レビューは指摘なし。
- 画面レビュー: `implement`／`tdd`で公開シームをred→green実装し、`code-review`のStandards/Spec 2軸レビューを実施した。空履歴の全削除不能、比較選択取消不能、ID不足URL、依存方向、表示copy重複を修正した。独立結果画面遷移だけはT-005依存として明示保留する。
- 検証: 履歴・比較・保存済み結果画面・文書契約の集中36件、現行全363件、`npm.cmd run check`、`git diff --check`成功。

### T-007 共有カード・保存・コピー

- 依存: T-005
- 開始ゲート: Q-007、Q-013
- 作業:
  - S-005、カード描画、共有テキスト、能力判定を実装。
  - 選択／標準パレットをカードへ反映。
  - 猫と背景が同系色でも選択色を維持し、縁取り・影・背景プレートを決定的に適用する。
  - Web Share、Download、Clipboard、手動選択へ段階フォールバック。
- 完了条件:
  - 実際に出る画像と全文を実行前に確認できる。
  - 完成PNGを保存または対応端末で共有できる。
  - 共有物に生回答、氏名、端末情報、公開URLがない。
  - 猫なしでも破綻しない。
  - 同系色パレットでも猫の輪郭を識別でき、プレビューと完成PNGが一致する。
- 検証方法:
  - ファイル共有可／不可、ダウンロード可／不可、Clipboard許可／拒否。
  - 明色・中間色・暗色の猫と、同色・近似色背景の組合せを固定fixtureで検証する。
  - 視認性補助なし／二重縁取り／影／背景プレートの各分岐を画像スナップショットで確認する。
  - Canvas `toBlob`失敗、フォント未準備、ユーザーキャンセル。
  - PNG内のモード、称号、数値、注意、版、選択色を目視・自動確認。
  - 共有モデルの禁止フィールド検査。

### T-008 全画面統合・レスポンシブ・アクセシビリティ

- 依存: T-004〜T-007
- 作業:
  - S-001〜S-008を統合し、安全な直接アクセスと戻り先を実装。
  - 360px〜PC、キーボード、フォーカス、動き軽減を実装。
  - 利用者向けエラー文言と内部コードを分離。
- 完了条件:
  - 初回、再開、結果、履歴、比較、共有の全出口がある。
  - 360pxで横スクロールと操作不能がない。
  - 色なし・猫なし・Canvasなしでも内容を理解できる。
- 検証方法:
  - `docs/screens.md`の画面遷移完全性をE2E化。
  - 代表4ビューポート、200%文字拡大。
  - キーボードだけで回答・共有テキスト到達・削除取消。
  - 自動a11y検査＋主要箇所の手動読み上げ確認。

### T-009 説明・プライバシー・CSP

- 依存: T-001, T-002, T-008
- 作業:
  - S-008へ尺度、スコア、限界、端末保存、削除、版を実装。
  - CSP、混在コンテンツ防止、秘密情報検査を追加。
  - 通常公開で外部送信がないことを検証。
- 完了条件:
  - 「自己理解支援ツール」、非臨床、非能力・採用、非公式称号を確認できる。
  - 外部APIキー・秘密・分析送信がない。
- 検証方法:
  - 静的配布物の秘密パターンスキャン。
  - ブラウザネットワーク記録で通常フローの外部送信0件。
  - HTTP資産、inline script、CSP違反を検出。

### T-010 ベータ匿名集計API・DB・事前説明

- 依存: T-003, T-005, T-007, T-009
- 外部公開ゲート: Q-009、Q-011の残運用値
- 作業:
  - ベータ版限定の機能フラグ、API URL、S-001通知、S-009説明。
  - `docs/api-design.md`に従う完答集計・色付きカード利用集計クライアント。
  - OCI VPS上の匿名集計API、CORS、本文上限、安定エラーコード、health。
  - `docs/data-model.md`の集計マスタ、カウンター、短期冪等キーテーブルとマイグレーション。
  - 原子的UPSERT、完答時の一括トランザクション、期限切れ冪等キー削除ジョブ。
  - 対象APIのアクセスログ・アプリログからIP、User-Agent、Referer、本文、回答値、称号ID、色IDを除外。
  - Googleフォーム等への任意リンクはAPIと分離し、診断・集計キーを引き渡さない。
- 完了条件:
  - 通常版の回答・結果・共有フローは外部送信0件。
  - ベータ版は事前説明を確認でき、20問／50問完答ごとに設問選択肢、称号、完了数が各1回だけ加算される。
  - 色選択だけでは加算せず、色付きカード保存・OS共有成功時だけ操作別に1回加算される。
  - DBには集計行と短期冪等キーハッシュ以外の個人単位データが存在しない。
  - 通信失敗、API停止、DB停止、キャンセルで結果、履歴、共有カードを失わない。
  - APIキー、Cookie、アカウント認証を使わず、許可したベータオリジン以外のブラウザ要求を拒否する。
- 検証方法:
  - 正常系: 20問、50問、download、shareのカウントをDB固定値で確認。
  - 境界: 1・5、20・50件、未知版、未知ID、重複設問、余分なフィールド、16KB超過。
  - 二重送信: 同じ`requestId`を2回送って各カウントが1だけ増える。
  - 競合: 同じ集計キーへ100並列送信し、欠落更新がない。
  - 原子性: 回答1件を不正にし、設問・称号・完了・冪等キーの加算がすべて0件。
  - 障害: timeout、429、500、503、応答消失、DB停止後も結果を維持し、同一キー再試行で重複しない。
  - プライバシー: DB列、DB行、Nginxログ、アプリログ、バックアップ対象に禁止項目がないことを検査。
  - E2E: S-001通知→S-009説明→回答完了→結果表示→裏側集計、カード保存→集計、失敗→結果へ安全に戻る。

### T-011 GitHub Pages CI/CD・運用

- 依存: T-009
- 開始ゲート: Q-008、Q-010
- 作業:
  - GitHub Actionsでテスト・静的検証・Pagesデプロイ。
  - HTTPS、外形監視、リリース・切戻し手順。
  - デフォルトブランチの承認済み状態だけを公開。
- 完了条件:
  - テスト失敗時はデプロイしない。
  - 保存した正確なコミット成果物を配信する。
  - 直前の安全なコミットへ切り戻せる。
- 検証方法:
  - PRで成功／失敗workflow。
  - 公開URLのHTTPS、主要静的資産、版表示。
  - 外形監視の正常・失敗通知。

### T-012 MVP受入・ブラウザ検証

- 依存: T-001〜T-009, T-011
- 作業:
  - 要件17.1をテストケースへ対応付ける。
  - 対象ブラウザと代表端末で主要フローを通す。
  - 既知制限、テスト結果、公開判定を記録。
- 完了条件:
  - 重大な採点、保存、共有、キャラクター、プライバシー不具合0件。
  - 全F-IDとNF-IDに検証証跡がある。
- 検証方法:
  - 自動単体・結合・ブラウザスモーク。
  - iOS Safari、Android Chrome、PC Chrome/Edge/Safariの現行・1世代前。
  - 保存不可、破損、猫失敗、Canvas失敗、共有不可を含む。

## 5. 未対応・保留

| 項目 | 理由 | 着手条件 |
|---|---|---|
| F-017外部ベータ公開 | API・DB方式は確定。募集・保持・公開ドメイン等の運用値が未決 | Q-009/Q-011 |
| Q-006人手Content Approval | `result-text-v1 initial reviewed copy` 237件と根拠・合成・snapshotは実装済み。E-0〜E-5、T-0〜T-4、F-1〜F-5、X-1〜X-2の各gateに必要な人手approval recordがすべて揃うまで`Content Approval pending` | Q-006 |
| 結果・履歴画面統合 | Q-006ドメイン、ResultSnapshot保存、S-003/S-004保存済み画面、S-006履歴、S-007比較、独立結果画面遷移は実装済み。完答caller、追加30問S-002接続、共有、猫画像・色香りが未実装 | T-005/T-006/T-007/T-008 |
| 共有画像の最終仕様 | 寸法・文字量未決 | Q-007 |
| Pages公開方式の最終値 | リポジトリ・URL未決 | Q-008 |
| 51猫アセット | 量産仕様と共通WebP設定は確定。11体ベースラインと複合因子第1便10体、累計21体は技術承認済み。残り30体が未制作 | Q-012設計を基にT-005で制作 |
| 色・香り実データ | 候補数・分類・選択規則は確定。全パレット・香調・用途色が未制作 | Q-013設計を基にT-005で制作 |

これは要件漏れではなく、要件書19章に期限付きで残る後続決定である。
