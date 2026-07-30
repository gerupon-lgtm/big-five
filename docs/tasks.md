# Big Five自己理解支援ツール 実装タスク

| 項目 | 内容 |
|---|---|
| 設計版 | 0.9 |
| 作成日 | 2026-07-20 |
| 更新日 | 2026-07-30 |
| 要件正典 | 要件定義書v1.14 |
| 初期リリース | `mvp-0.1.0` |

## 1. トレーサビリティ表（正典）

| 要件ID | 機能名 | 画面 | 処理 | データ | タスク | 状態 |
|---|---|---|---|---|---|---|
| F-001 | 開始・注意事項 | S-001, S-008 | 起動・説明モデル | AppMeta, DiagnosticDefinition | T-001, T-008A, T-008 | `Big Five 自己理解チェック`／`BIG FIVE SELF UNDERSTANDING`の共通ヘッダー、`SELF CHECK`／`自分のことを知る`／承認済みBig Five・IPIP説明、`このツールについて`、同幅の開始・再開操作を実装・browser smoke済み |
| F-002 | 尺度・設問版管理 | S-002, S-008 | 定義検証、採点、結果文根拠検証 | DiagnosticDefinition, QuestionDefinition, ResultEvidenceDefinition, ResultTextDefinition | T-002, T-005 | Q-006版付き定義実装済み。Content Approvalは2026-07-28に完了 |
| F-003 | 回答 | S-002 | questionnaire | ProgressRecord | T-004, T-008A | 他画面と同じ通常の共通ヘッダー、緑の進捗／設問`h1`、折り返さない`中断してトップへ`、設問20px・回答文字16px・回答ボタン高56pxを実装・320／360／414px browser smoke済み |
| F-004 | 途中保存・再開 | S-001, S-002 | storage-adapter | StorageEnvelope, ProgressRecord | T-004, T-008A | 状態別再開、preview終了、新規置換確認を保存成功・失敗・取消まで実装済み |
| F-005 | 基本結果 | S-003 | scoring, result-composer | ResultTextDefinition, TitleReflectionCommentDefinition, ResultSnapshot | T-003, T-005, T-008A | 現行`result-text-v2`で称号別ヒント1件を含む8件を表示・保存。不完全なヒント組は全件省略して7件へフォールバックし、称号・因子を維持 |
| F-006 | 詳細結果 | S-004 | scoring, result-composer | ResultTextDefinition, TitleReflectionCommentDefinition, ResultSnapshot | T-003, T-005, T-008A | 現行`result-text-v2`で称号別ヒント3件を含む45件を表示・保存し、1件＋追加2件を展開。不完全なヒント組は全件省略して42件へフォールバック |
| F-007 | 心理モデル表示 | S-001, S-003, S-004, S-008 | explanation model | DiagnosticDefinition | T-008 | 確定 |
| F-008 | 結果可視化 | S-003, S-004, S-007 | radar-renderer | FactorResult | T-005, T-008A | 名前付きレーダー、固定順5因子行・棒、同時1因子／1詳細の二段階開閉、設問構成sheetと4つの固定方法sheetを実装済み |
| F-009 | 結果履歴 | S-001, S-006 | history store | ResultSnapshot | T-006, T-008A | `HISTORY`／「診断結果の履歴」、ヘッダーの`トップ画面へ`、明示的な`履歴削除`、簡潔カード、保存済み結果への直接導線、固定比較導線、既存履歴管理dialogを実装・browser smoke済み |
| F-010 | 結果比較 | S-006, S-007 | compatibility, comparison | ResultSnapshot | T-006, T-008A | `COMPARISON`／「診断結果の比較」、ヘッダーの`履歴へ戻る`、互換2件だけのトグル選択と固定アクションバーからの明示比較を実装・browser smoke済み |
| F-011 | 共有プレビュー | S-005 | share-card preview | ShareViewModel | T-007 | Q-007待ち |
| F-012 | 共有・保存 | S-005 | share/download/clipboard | 一時Blob、共有テキスト | T-007 | Q-007待ち |
| F-013 | データ削除 | S-002, S-006 | storage delete | ProgressRecord, ResultSnapshot | T-004, T-006, T-008A | 省略記号ではなく`履歴削除`から開く既存履歴管理dialog、削除・preview終了、明示close・正確なbackdrop click・native／fallback Escape・focus入退場・fallback背景隔離・Tab containmentを実装済み |
| F-014 | バージョン表示 | 全画面・共有物 | version registry | AppMeta, VersionTuple | T-001, T-002, T-007 | 確定 |
| F-015 | エラー・代替動作 | 全画面 | error mapping, fallbacks | error codes | T-004, T-006, T-007, T-008, T-008A | 保存失敗時の中断・preview終了、live結果維持、履歴dialogのnative／fallback代替動作を実装済み。共有系fallbackはT-007 |
| F-016 | プロフィールキャラクター | S-003, S-004, S-005, S-006 | title-classifier, result-composer, character-loader | TitleProfileDefinition, ResultTextDefinition, CharacterManifest | T-003, T-005 | 51称号、Q-012 release資産・manifest・単一画像遅延loader・live／保存済み結果画面接続を実装。共有接続待ち |
| F-017 | ベータ匿名集計 | S-001, S-009, 結果・共有 | beta aggregation API、atomic upsert | beta_* masters/counts/idempotency | T-010 | 設計確定。公開前にQ-011運用値 |
| F-018 | 色・香り提案 | S-003, S-004, S-005 | presentation selector, share-card, color action aggregate | PaletteDefinition, FragranceSuggestion, FragranceMaterialDefinition, beta_color_card_action_counts | T-005, T-007, T-010 | Q-013設計済み。香り素材マスタを含む実データ待ち |
| NF-01 | 性能 | 全画面 | 遅延読込、計測 | asset manifest | T-005, T-011 | 確定 |
| NF-02 | 対応環境・レスポンシブ | 全画面 | browser smoke | - | T-008, T-012 | 確定 |
| NF-03 | アクセシビリティ | 全画面 | a11y checks | alt、代替テキスト | T-008, T-012 | 確定 |
| NF-04 | セキュリティ・プライバシー | 全画面 | CSP、通常版非送信、ベータ集計・ログ制限 | StorageEnvelope, beta_* | T-009, T-010, T-011, T-012 | Q-011運用値以外確定 |
| NF-05 | 正確性・表現品質 | 結果・説明 | authority fixtures, text rules | 全静的定義 | T-002, T-003, T-005, T-012 | Q-006実装レビュー・人手Content Approvalを2026-07-28に完了 |
| NF-06 | 運用・可用性 | - | deploy、監視、切戻し、API health・DB backup | release metadata, beta_* | T-010, T-011 | Q-008/Q-010/Q-011一部待ち |

### CSVコンテンツ作成基盤の実装記録（2026-07-26）

- 対応: Q-006およびT-005/F-002/F-005/F-006/F-016のコンテンツ作成基盤。`content/source/`のCSV、3つのrelease schema、4つのコンパイラ、決定的な7 JSON builder、atomic writer、CSV/ES Modules parity testを実装した。
- 初期状態: 50問、固定20問、51称号、`result-text-v1` 237結果文、6根拠。E-0は`approved`、E-1〜E-5は`draft`、T-0〜T-4/F-1〜F-5/X-1〜X-2は人手approval metadataなしの`reviewed`。現在の`result-text-v2`は基本237件＋TR-0〜TR-4承認済み`titleReflection`153件＝390件、結果文と根拠の対応行267件で、実行時根拠定義は引き続き6件である。v2基本文面には承認済み修正27件を含む。CSV上のQ-012/Q-013とrelease manifest/historyはヘッダーのみで開始した。その後Q-012画像は別の版付き制作台帳・runtime manifestで制作・技術実装済みとなったが、正式なapproved release選択は未完了である。Q-013とCSV approved releaseも未作成のままである。
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
| T-007 | 共有カード・保存・コピー | F-011, F-012, F-014, F-015, F-018 | `titleReflection`を除外する純粋な共有候補抽出境界だけ先行実装済み。実際の共有UI・画像・テキスト・段階代替はQ-007/Q-013待ち |
| T-008A | 結果・履歴・中断再開UI再整理 | F-001, F-003〜F-006, F-008〜F-010, F-013, F-015, F-018 | `titleReflection`の文面承認、runtime、snapshot、結果画面接続、全体回帰、320／360／960pxのローカル実ブラウザQAまで完了 |
| T-008 | 全画面統合・レスポンシブ・a11y | F-001〜F-016, F-018 | 主要フローを360px・PC・キーボードで完結 |
| T-009 | 説明・プライバシー・CSP | F-001, F-002, F-007, F-014, F-015 | 限界、非送信、削除、版、CSPを確認可能 |
| T-010 | ベータ匿名集計API・DB・事前説明 | F-017 | OCIへ匿名集計し、二重送信・通信失敗でも診断結果を維持 |
| T-011 | GitHub Pages CI/CD・運用 | F-014, NF-01, NF-04, NF-06 | テスト成功時だけPagesへ配信、切戻し可能。2026-07-28のQA一時プレビューは`codex/big-five-q006`から現行ES Modules runtimeだけを公開し、approved releaseの選択、JSON runtimeの有効化、T-011完了を意味しない |
| T-012 | MVP受入・ブラウザ検証 | 全機能/NF | 要件17.1と主要異常系を検証し記録 |

## 3. フェーズ

### フェーズA: 測定コア

T-001 → T-002 → T-003

### フェーズB: ローカル完結の診断

T-004 → T-005 → T-006 → T-008A

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
- 現在差分: T-003完了時に未実装だったQ-006の本番結果文・根拠対応表は、後続T-005/Q-006 workstreamで`result-text-v1`として実装され、2026-07-28に人手Content Approvalを完了した。現行`result-text-v2`では承認済みTR-0〜TR-4も実装済みである。保存済み結果画面・レーダー・Q-012キャラクター遅延読込、完答caller、live S-002も実装・独立レビュー・実ブラウザ検証済みである。共有、Q-013 production data、approved release選択は引き続きT-005以降で扱う。
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
- 保存契約: schema 1、破損JSON、将来schema、壊れた進捗、版不一致、読込不能、容量不足、削除失敗を安定コードへ変換し、既存値を不意に上書きしない。save/discard時は無関係な壊れた進捗・結果だけを除去し、保存失敗時もメモリ上の状態と50問終端回答を維持する。完答結果成立後のResultSnapshot保存とProgressRecord削除はT-005 live controllerへ接続済みである。
- 検証: 公開seam 14件成功（開始・固定順、入力汚染拒否、戻る置換、両20問出口、showPreview後の継続、hidden非露出、50問終端、自動保存、保存再開、破損/将来/版不一致、無関係データsanitize、保存/削除失敗）。詳細は `.superpowers/sdd/task-t004-report.md` を参照。
- S-002表示層（2026-07-26）: `renderQuestionnaireScreen`に設問、自然言語の5件法、現在位置、選択済み状態、戻る、破棄、20問分岐の二択を実装した。保存失敗は設問画面と20問分岐画面の両方でだけ`role="alert"`通知し、回答は継続できる。`preview-choice`は因子、スコア、称号、猫、色、共有データを入力にもDOMにも含めない。focused 10件、Spec/Standards独立レビュー、全359件、静的検証に成功した。router・state・storageとのlive接続は2026-07-27に完了した。
- 次タスク: T-005の残ゲート。承認済みQ-006文面を維持し、Q-013の色・香りproduction data完成後に代替色・香りUIを接続する。共有はT-007で進め、説明・注意事項を含むT-008Aの画面接続は実装済みである。

### T-005 結果画面・猫・レーダー・色香り

- 依存: T-003, T-004
- 対応機能: F-002, F-005, F-006, F-007, F-008, F-016, F-018
- 開始ゲート:
  - Q-006: `result-text-v1 initial reviewed copy`、根拠、合成、snapshotは実装済み。E-0〜E-5／F-1〜F-5／T-0〜T-4／X-1〜X-2はすべてapprovedとなり、Content Approvalを2026-07-28に完了
  - Q-012: 制作・技術実装済み。51体すべてについてproject-ownerの制作確認を経て、共通encoder設定、1024px正方形、透明余白、ハッシュ整合、runtime manifest、単一画像遅延loaderを固定済み。ただし正式なapproved release選択は未完了
  - Q-013: 構造と選択規則は確定。`presentation-v2`の全パレット・香調・香り素材・関連・用途色展開候補をdraftで作成済み。P-0〜P-6の人手承認とruntime接続は未完了
- 作業:
  - S-003/S-004の結果モデルと画面を実装。
  - `result-text-v2`の称号別振り返りヒントを20問1件、50問1〜3件で表示し、診断時snapshotへ保持する。
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

- 状態: DONE_WITH_CONCERNS。T-005のうちF-002/F-005/F-006/F-016に対応する`result-text-v1 initial reviewed copy`の全18 gateはapprovedで、Q-006のContent Approvalは2026-07-28に完了した。`result-text-v2`の文面、承認、domain、snapshot、結果画面接続も実装済みである。approved release未選択、Q-012正式release、Q-013 production data、T-007共有UI、新規部分のブラウザQAと全体回帰修正が残るため、T-005全体は未完了。
- schema: `ResultEvidenceDefinition`固定6件、`titleReflection`を含む11 section＋`claimKind`を持つ`ResultTextDefinition`。v2の結果文と根拠の対応行267件は、根拠定義数6件と区別する。
- 定義: `result-text-v1`はtitle 102件＋factor 135件＝237件の不変な履歴互換定義。現行`result-text-v2`は基本237件＋称号別ヒント153件＝390件で、基本文面には承認済み修正27件を含む。
- 合成: `composeResultTexts`がdefinitionの条件選択、欠落・重複・件数、`version`、section-first・固定factor順を検証し、v2の完全定義をpreview 8件／detail 45件の5フィールド`RenderedResultText`へ投影してdeep freezeする。不完全な称号別ヒント3件組は全件省略し、7件／42件へフォールバックする。
- snapshot: `createResultSnapshot`が各位置のexact production record IDを検証し、9フィールド`VersionTuple`と診断時文章を含む13フィールド`ResultSnapshot`を生成する。v2は8件／45件またはゼロ-reflection fallback 7件／42件を許可し、部分的なヒント組を拒否する。生回答、`diagnosisId`、結果定義、DOM・Canvas状態を含めず、`characterAssetVersion`と`characterManifestVersion`を分離する。
- gate: 根拠台帳ではE-0〜E-5がapprovedで、E-1〜E-5の承認日は2026-07-28。F-1〜F-5は各因子の20問観察文と50問8節について2026-07-28にapproved。T-0〜T-4は51称号の中立副題・称号理由・カタログ一致について2026-07-28にapproved。X-1は20問結果のtitle 2件＋5因子観察文＝7件の全体表示について2026-07-28にapproved。X-2は50問結果のtitle 2件＋5因子×8節＝42件の全体表示について2026-07-28にapproved。
- 解決状態: E-0〜E-5、T-0〜T-4、F-1〜F-5、X-1〜X-2の全18 gateがapprovedとなり、Q-006は2026-07-28に解決済み。
- 画面: live／保存済みS-003/S-004、5軸レーダー、境界・僅差補足、Canvas代替、Q-012の該当猫1体のviewport遅延読込と画像失敗時altを実装済み。共有と代替色・香りは後続T-007/Q-013統合。
- 永続化: 13フィールドproduction ResultSnapshot validatorと`saveResultSnapshot`に加え、回答完答からの本番callerをS-001/S-002へ接続済み。previewは進捗を保持し、detailは保存成否にかかわらずcaller-held回答参照を破棄する。
- live結果接続（2026-07-27完了）: `ResultSnapshot.characterAssetVersion`へ選択されたQ-012 manifest entryの`assetVersion`を、初期`selectedPaletteId`へ該当TitleProfileの`defaultPaletteId`を保存する。`VersionTuple.characterManifestVersion`の流用や仮値を禁止する。Q-013の代替色・香りUIは実データ承認まで保留する。
- T-005 live flow（2026-07-27）: `createDiagnosticResultSnapshot`が既存の採点・分類・文面合成・manifest解決・snapshot生成を純粋に合成する。`#/answer`のcontrollerは新規開始、互換再開、回答、戻る、破棄、20問分岐、preview継続、50問完答を既存state/storage APIへ接続した。`continueHidden`はresultIdを割り当てず21問目へ進む。保存済みpreviewはProgressRecordとVersionTupleが一致する場合だけ追加30問導線を表示する。結果保存失敗でもlive結果を維持し、詳細完答後は回答参照を破棄する。独立レビューは保存済みpreview無反応とhashchange二重描画を差し戻し、2回の修正後APPROVED。集中41件、全413件、静的検証に成功した。
- T-005 browser flow（2026-07-27）: 360pxで新規開始から20問preview、選択猫1体の遅延読込、追加30問、50問detailまで通過し、320pxの200%相当狭幅でも横overflowなし・42文面維持を確認した。強制storage失敗でも回答と7文面のpreviewを維持して指定通知を表示した。通常previewのasset inventoryは同一originだけで外部資産0件だった。
- Q-012制作台帳Task 1（2026-07-26）: 31フィールドexact schema、51称号とのtitleId・characterId・順序一致、1〜2小物、stage別production/review state、canonical source/delivery path、SHA-256、UTC approval timeを検証する制作台帳契約を実装した。seedは`docs/title-character-catalog.md`の2つの番号表をTitleProfileへjoinし、既存ledgerを`--replace`なしで上書きしない。初回reviewのImportant 1件をfix round 1で解消し、brief行の将来証跡はnull、到達stageの必須証跡は非空かつshape一致を双方向に保証した。Task 1完了時点の実台帳51行は全件`brief`で、hash・承認者・承認時刻・画像版を仮置きしていない。
- Q-012制作台帳Task 2〜4（2026-07-26）: `balanced`、`single-intellectImagination-high`、`single-intellectImagination-low`のPNG原画とWebP変換をproject-ownerが承認した。Sharp 0.35.3／libvips 8.18.3、quality 82、alphaQuality 100、effort 6、metadata none、1024pxを共通設定として固定し、3件を`technical-approved`へ更新した。delivery SHA-256・byteLength・寸法・実pathを記録し、alpha・透明画素・余白・250,000 bytes警告を自動検査する。アクセシビリティ承認は51体完成後のrelease gateまで`null`を維持する。
- Q-012制作台帳Task 5（2026-07-26）: 残り8体の単因子キャラクターをproject-ownerが原画・WebPともに承認し、11体ベースラインを`technical-approved`で完成した。全11体は同一encoder設定、1024×1024、alphaあり、透明画素あり、端接触なし、250,000 bytes以下である。高低を善悪・能力・序列へ結び付けず、各行のsource/delivery SHA-256、byteLength、承認時刻を記録した。残り40体とrelease accessibility gateは未完了である。
- Q-012制作台帳Task 6（2026-07-26）: 複合因子キャラクター第1便10体をproject-ownerが原画・WebPともに承認し、累計21体を`technical-approved`へ更新した。風見の方角文字を除去して画像内文字なしの契約へ適合させ、全10体は指定ポーズ・1〜2小物・猫1体・無背景を維持している。共通encoder設定で1024×1024へ変換し、alphaあり、透明画素あり、端接触なし、250,000 bytes以下、source/delivery SHA-256一致を確認した。残り30体とrelease accessibility gateは未完了である。
- Q-012制作台帳Task 7（2026-07-27）: project-owner承認済みの複合因子キャラクター第2便10体（catalog rows 22〜31）を`review-candidates/`に保持したまま正典source PNGへ昇格し、固定encoder設定でWebPへ変換した。全10体は1024×1024、alphaあり、透明画素あり、端接触なし、250,000 bytes以下で、source/delivery SHA-256とbyteLengthを台帳へ記録した。project-ownerのWebP比較承認後に`technical-approved`へ更新した。
- Q-012制作台帳Task 8（2026-07-27）: project-owner承認済みの複合因子キャラクター第3便10体（catalog rows 32〜41）も同じ非破壊手順で正典source PNGとWebPへ昇格した。全10体は固定encoder設定、1024×1024、alphaあり、透明画素あり、端接触なし、250,000 bytes以下で、source/delivery SHA-256とbyteLengthを台帳へ記録した。project-ownerのWebP比較承認後に`technical-approved`へ更新し、累計41体で`pair03`ゲートを通過した。残りはcatalog rows 42〜51の10体とrelease accessibility gateである。
- Q-012制作台帳Task 9（2026-07-27）: 複合因子キャラクター最終便10体（catalog rows 42〜51）をproject-ownerが原画・WebPともに承認した。承認済み候補PNGを制作来歴として保持し、byte-identicalな正典source PNGと固定encoder設定の1024×1024 WebPを保存した。全10体はalpha・透明画素あり、端接触なし、250,000 bytes以下で、source/delivery SHA-256・byteLength・承認時刻を台帳へ記録した。独立レビューのSpec/Quality verdictはいずれもPASS、Critical/Important/Minorは0件で、全51体を`technical-approved`へ更新し`release-assets`前提を満たした。続くrelease accessibility gateで全51件のaltと画像失敗時代替をproject-ownerが承認し、全行を`released`へ更新した。
- Q-012 catalog row 41再承認（2026-07-27）: `自分の色を掲げる表明者`は、猫が片方の前足だけで色札を垂直に持ち上げる表現を避けるため、project-ownerが代替A案を承認した。構図・猫・色札・円形の紐を大きく変えず、色札の下端を床で支持し、猫は上端へ前足を添える表現へ更新した。キャラクター資産版を`character-pair-extraversion-high--agreeableness-low-v2`へ上げ、正典source PNG、WebP、台帳の動作説明・alt・SHA-256・byteLength・承認時刻を同期した。
- Q-012再利用コンポーネント（2026-07-27）: `title-pair-conscientiousness-high--extraversion-high`の歩行猫、壁掛け時計、無地カード、正典首輪を版付き透過PNGとして`docs/assets/character-production/components/`へ分離した。猫は`pose-master`、時計・カードは`direct-overlay`、首輪は姿勢適合が必要な`style-reference`として区別し、寸法・byteLength・SHA-256をmanifestへ固定した。全4点は透明四隅、alphaあり、クロマキー残りなしを確認済み。最終画像の正典は引き続き`source-png/`とし、再構成画像はQ-012のart/anatomy/technical reviewを省略しない。
- Q-012制作台帳Task 10（2026-07-27）: released 51行だけから`character-manifest-v1`をTitleProfile固定順で生成し、exact 7フィールドentry、1024×1024、承認済みalt、`sha256-<Base64>` integrityを固定した。`npm.cmd run character:check`はruntimeディレクトリの非WebP項目を含む孤児、欠落、integrity不一致を検出し、manifest validatorはencoded pathを拒否する。51件、孤児0、integrity不一致0で独立レビューPASS。
- Q-012制作台帳Task 11（2026-07-27）: 保存済み結果画面はneutral frameへ承認済みaltを先に表示し、viewport進入後に選択済みWebP 1件だけをdecodeする。成功時は`contain`で全体表示し、404・decode失敗・未知characterIdでは画像なしへフォールバックして称号、5因子、結果文、palette metadata、actionを維持する。単体・presentation・app-shellの集中31件に成功し、独立レビューPASS。
- Q-012制作台帳Task 12（2026-07-27）: 実ブラウザで遅延前request 0件、viewport進入後の選択画像1件、1024×1024・`contain`、強制decode失敗時のaltと結果全体維持を確認した。360px・200%相当では`body min-width`により横スクロールが出る問題を検出し、`min-width: 0`と回帰テストで解消した。neutral frame・outline・shadowは猫を再配色しない。palette別カード合成・最終共有はQ-013/T-007/T-008へ残すため、T-005全体は未完了である。
- Q-013 P-0共有カード配色確認（2026-07-30、T-005／F-008・F-018、T-007／F-011・F-018）: `docs/palette-preview.html`を、51称号×3候補＝153件の縦横比3:5簡略カードとして再生成した。各draftパレットの解決済み`background`を主背景、`surface`を淡い装飾・香り欄・猫画像 unavailable plate、`accent`を香り欄の輪郭、`text`をカード内文字と外枠へ使用し、`chart`はP-0参照値としてカード外に表示する。5因子の棒は`chart`ではなくココロパレアのアイコンと共通する固定5色、香りはプレースホルダー、キャラクターは全カード共通の代表画像であり、欠落時も明示placeholderで配色確認を維持する。称号の短文は現行版付きTitleProfile結果副題をtitleIdで結合し、3配色で共通とする。これは共有カードの配色・情報量を人手確認する単一HTMLであり、S-003/S-004の結果グラフ、正式共有Canvas、称号別Q-012画像、runtimeの色・香り選択を変更しない。P-0〜P-6、`presentation-v2`の行status、承認metadataはすべて未承認のままである。
- 永続化契約解消（2026-07-26）: `resultId`はRFC 4122 UUID形状へ統一する。`preview20`保存では追加回答用ProgressRecordを保持し、`detail50`完答では履歴保存の成否にかかわらず生回答を破棄する。保存成功時はsnapshot追加と進捗削除を同一StorageEnvelope書込みで行い、保存失敗時も進捗削除をbest-effortで試みる。
- 検証: `app/tests/result-evidence-definitions.test.js`、`app/tests/result-content-definitions.test.js`、`app/tests/result-composer.test.js`、`app/tests/result-snapshot.test.js`。リポジトリ同期は`app/tests/project-contract.test.js`で検証する。

#### 保存済み結果画面統合記録（2026-07-26）

- `#/result?resultId=...`で保存履歴を再検証し、exact `resultId`のS-003/S-004を独立表示する。ID不足・削除済み・破損時は保存値を書き換えず履歴へ戻して通知する。
- v1またはv2のゼロ-reflection fallbackではpreview 7件／detail 42件、v2の完全結果ではpreview 8件／detail 45件の診断時文面を保存順に表示し、全5因子の表示整数、HTMLの「説明を見る」、根拠参照、境界・僅差補足、20問版の限界と50問で変わり得る旨を表示する。
- レーダーは5軸・25/50/75補助線を描き、Canvas未対応・描画例外時も5因子と全結果文を維持する。Q-012確定後はmanifestの該当画像だけを遅延読込し、失敗時は承認済みaltを表示する。
- `delegate-development`でpresentationとQ-012 loader統合を委譲し、Spec/Standards独立レビューを実施した。Specの境界補足・20問注意文P2は1回差し戻して解消した。character loaderと実ブラウザsmokeは完了し、継続・共有callbackはS-002／T-007／T-008の後続範囲として保持する。
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
- 残作業: T-007共有、Q-013の代替色・香り。本番caller、保存済みpreviewから追加30問へ戻るS-002接続、S-003/S-004と履歴カードからの独立画面遷移、レーダー、Q-012猫画像loader・失敗時alt表示は実装済み。
- レビュー: `delegate-development`で履歴・削除と比較を非重複委譲し、独立レビューを実施した。個別削除が非対象の破損データまでsanitizeするP1を1回差し戻し、対象1件以外を保持する修正後の再レビューは指摘なし。
- 画面レビュー: `implement`／`tdd`で公開シームをred→green実装し、`code-review`のStandards/Spec 2軸レビューを実施した。空履歴の全削除不能、比較選択取消不能、ID不足URL、依存方向、表示copy重複を修正した。独立結果画面遷移、完答caller、S-002接続は実装済みで、T-007共有、Q-013色香りを後続として保留する。
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
- 先行実装（2026-07-30）: `selectShareableResultTexts`はResultSnapshot由来の結果文から`section === "titleReflection"`を除外し、順序を維持したdeep-freeze済み候補を返す。これは将来の共有合成に対する純粋境界であり、S-005、共有画像、共有テキスト、Web Share、Download、Clipboardの実装完了を意味しない。
- 確認用先行物（2026-07-30、F-011・F-018）: T-005のQ-013 P-0記録にある`docs/palette-preview.html`は、正式共有Canvas実装前に共有カードの配色・情報量を確認するための簡略カードである。正式共有画像との一致、共有操作、保存・コピーの完了を意味せず、T-007の完了条件は未達のままである。

### T-008A 結果・履歴・中断再開UI再整理

- 依存: T-004、T-005、T-006
- 対応機能: F-001、F-003、F-004、F-005、F-006、F-008、F-009、F-010、F-013、F-015、F-018
- 正典: `docs/superpowers/specs/2026-07-27-result-history-resume-ui-design.md`
- 称号別ヒント正典: `docs/superpowers/specs/2026-07-28-title-reflection-comments-design.md`
- 回答中断・再開計画: `docs/superpowers/plans/2026-07-27-questionnaire-resume-interruption.md`
- 回答文字計画: `docs/superpowers/plans/2026-07-28-questionnaire-typography.md`
- 結果段階表示計画: `docs/superpowers/plans/2026-07-27-result-progressive-disclosure.md`
- 履歴・比較計画: `docs/superpowers/plans/2026-07-27-history-compact-comparison.md`
- フロントエンドトーン正典: `docs/superpowers/specs/2026-07-29-frontend-tone-and-shared-header-design.md`
- フロントエンドトーン計画: `docs/superpowers/plans/2026-07-29-frontend-tone-and-shared-header.md`
- AIリテラシー検定トンマナ整合正典: `docs/superpowers/specs/2026-07-30-ai-literacy-tone-alignment-design.md`
- モバイルヘッダー・開始操作追補正典: `docs/superpowers/specs/2026-07-30-mobile-header-start-actions-followup-design.md`
- モバイルヘッダー・開始操作追補計画: `docs/superpowers/plans/2026-07-30-mobile-header-start-actions-followup.md`
- 状態: DONE。既存Q-014画面の実ブラウザ検証に加え、`result-text-v2`の51称号×3件の文面承認、domain、snapshot、結果画面接続、全体回帰、320／360／414／960pxのローカル実ブラウザQA、AIリテラシー検定を基準にした共通ヘッダー寸法と開始画面の一枚パネル整合まで完了した。Pages上の再確認はT-011のQA一時プレビュー運用として別管理する
- 作業:
  - `Big Five 自己理解チェック`／`BIG FIVE SELF UNDERSTANDING`の共通ヘッダーと、緑のkicker／進捗＋`h1`の共通見出しを開始・回答・20問分岐・結果・履歴・比較へ適用する。
  - 回答・20問分岐だけにあったsticky変種を廃止し、通常の共通ヘッダーへ統一する。第一候補の`中断してトップへ`は320／360／414pxで重なり・折返し・横overflowなしを実測済み。
  - 開始画面の説明見出しを`このツールについて`へ改め、開始・再開操作を12px間隔の同幅レスポンシブgridへまとめる。
  - 全画面の控えめなアプリ名、設問のbalanced wrapping、回答画面固有の20〜22px設問文・16px選択肢・行間1.5・最低高56px、中断導線を実装する。
  - 20問選択前、簡易プレビュー表示後、21〜49問の状態別再開と、新規開始時の置換確認を実装する。
  - 簡易プレビューに追加30問、中断、20問で終了の3操作を実装し、結果保存失敗・進捗削除失敗を非破壊で扱う。
  - 結果を称号・猫・理由、任意の振り返りヒント、名前付きレーダー、5因子一覧、同時1因子／1詳細の段階展開へ再構成する。
  - 50問結果へトップの直接導線を追加し、未保存live結果だけ離脱確認する。
  - 因子ごとの正方向・逆方向項目数と、4つの固定説明を同一画面上のアクセシブルな展開UIで表示する。
  - 履歴カードを猫・称号・日時・20/50問・結果表示へ絞り、固定下部アクションバーの比較トグルと、個別削除・全削除・版情報を持つ管理モーダルを実装する。明示的な閉じる、背景タップ、Esc、フォーカス復帰を保証する。
- 変更禁止:
  - `result-text-v1`の237結果文と承認状態、既存ResultSnapshot、採点、称号判定、Q-012画像・altを上書きしない。称号別ヒントは別版`result-text-v2`として追加する。
  - Q-013の未承認パレット・香調を仮置きしない。
  - 中断と破棄を同一操作にしない。
- 完了条件:
  - 回答中断は進捗を保持し、破棄だけが確認後に進捗を削除する。
  - 20問の3操作、直近1件再開、新規開始確認が保存成功・保存失敗・取消で仕様どおり動く。
  - 称号・猫・理由が結果の先頭にあり、5因子と全保存済み結果文が段階展開から到達可能である。
  - 履歴から通常結果を開け、互換2件だけをトグル選択し、明示実行で比較できる。
  - 50問結果からトップへ直接戻れ、履歴管理を閉じるボタン・背景タップ・Escで閉じられる。
  - 360px、320pxの200%相当、キーボードで固定要素の被りと横スクロールがない。
  - 回答画面でトップ用の大見出し規則を継承せず、設問20〜22px、選択肢16px、最低高56pxを維持し、結果・履歴画面の文字スケールを変更しない。
  - 共通ヘッダー名・副題、画面別kicker／`h1`、履歴・比較のヘッダー操作、`履歴削除`が仕様どおりで、320px、360px、960pxの主要画面に横overflowがない。
- 検証方法:
  - presentation単体: questionnaire、start、result、history。
  - app-shell結合: 1〜19問、20問選択前、preview表示後、21〜49問、50問完答、新規開始取消／確定。
  - storage異常: 保存不可、preview snapshot未保存、progress削除失敗。
  - Q-006 snapshot v1 7件／42件、v2 8件／45件、v2ゼロ-reflection fallback 7件／42件、部分組拒否、Q-012該当画像1件、通常外部送信0件の回帰。
  - `npm.cmd test`、`npm.cmd run check`、`git diff --check`、実ブラウザsmoke。
- 実装記録（2026-07-27、第1バッチ）:
  - `app-header`を開始・回答へ接続し、設問中／20問分岐の`中断してトップへ`と破棄を分離した。開始画面は直近進捗の状態に応じて`途中から再開する`／`残り30問を再開する`を切り替え、新規開始は取消時無変更・確定時だけ進捗を置換する。
  - 保存済み20問previewでは追加30問、中断、簡易preview終了を分離した。preview終了はResultSnapshotを保持してProgressRecordだけを削除し、snapshot未保存時は操作を省略、削除失敗時は結果と進捗を保持して再試行通知を表示する。
  - S-006を猫サムネイル・称号・日時・20/50問・`結果を見る`へ簡潔化し、最大2件・互換結果のみ・明示実行の比較モード、管理メニューの個別削除・全削除・版情報へ接続した。
  - `createQuestionComposition`と`createResultDisclosureModel`を追加し、設問本文・回答を出さない正逆方向件数と、section-first snapshotからfactor-first表示モデルへの不変投影を実装した。レーダーの5因子名描画とアクセシブルなボトムシート基盤も追加した。
  - 全444テスト、静的検証44 JavaScript、`git diff --check`に成功した。残作業は結果hero、因子一覧・二段階展開、設問構成／方法情報の画面接続、50問トップ導線、履歴管理モーダル、称号別ヒント、最終全体responsive・keyboard browser smokeである。
  - Q-013素材例仕様（2026-07-28）: 香り素材を版付き独立マスタ、香調との関連を素材ID 1〜3件として管理し、通常結果だけに表示して共有から除外する設計を承認した。色はパレット単位マスタを維持する。ユーザー共有の評価コメント・象徴色・香り資料は51称号を網羅する候補検討資料としてハッシュを記録したが、直接移植・自動採用・承認済み扱いを禁止する。実装とproduction data作成はQ-013 release gate内の後続作業である。
  - Q-014追補（2026-07-28、2026-07-30同期）: `result-text-v2`で称号別の振り返りヒントを各3件追加し、20問は1件、50問は1件＋追加2件とする。50問結果のトップ導線、履歴管理モーダルの閉じる・背景タップ・Esc・フォーカス復帰も承認した。
  - Q-014回答文字追補（2026-07-28）: 外部のリリース済みアプリ画面は配色を移植せず、文字階層と余白だけの参考資料として扱う。回答画面固有で設問20px／広幅22px、選択肢16px、行間1.5、選択肢最低高56pxを採用し、結果・履歴へ一律適用しない。実装結果は次項へ記録する。
  - Q-014回答文字実装（2026-07-28）: 回答画面だけを設問20〜22px、行間1.5、選択肢16px・最低高56pxへ変更し、20問分岐を含む他画面の見出し規則から分離した。CSS契約テスト、360×800、960×900、320px・200%相当、キーボード、回答・中断・再開の実ブラウザ確認に成功した。配色、正式設問文、5件法ラベル、回答状態、保存処理は変更していない。
  - 結果・履歴UI実装（2026-07-28）: 結果heroと「この称号になった理由」を分離し、名前付きレーダーの下へ固定順5因子のコンパクトな行・棒・数値を表示した。20問7件／50問42件の保存済み結果文は、同時1因子・同一因子内1詳細だけを開く二段階開閉からすべて到達できる。因子別の正逆方向件数sheet、スコアや称号で変化しない4つの方法sheet、50問結果の`トップへ戻る`、履歴カードから保存済み結果を開く導線も画面接続した。保存結果の尺度・設問・採点版が登録済みtupleと完全一致する場合だけ該当方法情報を表示し、未登録版では現行件数・限界・出典を流用しない。
  - 履歴管理dialog実装（2026-07-28）: `データの管理`を閉じられるmodal/dialogへ変更した。明示的な`閉じる`、dialog自体だけのbackdrop click、native `cancel`とfallback keydownのEscape、closeへの初期focus、起動元へのfocus復帰を実装した。`showModal`なし／例外時は全viewport fallback surfaceと中央panelを表示し、背景分岐を`inert`＋`aria-hidden`で隔離する。Tab／Shift+Tabは閉じた`details`配下を除外し、実際に到達可能な操作だけで循環する。
  - 最終検証（2026-07-28）: 実ブラウザで320px、360px、960pxの結果・履歴を確認し、全幅で横overflowなし、360×800で履歴modal全体がviewport内に収まることを確認した。明示close、正確なbackdrop click、Escape、focus入場・復帰も通過し、console error／warningは0件だった。追加の自動回帰検証では、未登録の履歴診断版、ボトムシートのインラインfallback、保存結果を含む履歴fallback、承認済み結果開示ラベルを含む全465件、`npm.cmd run check`、`git diff --check`に成功した。
  - フロントエンドトーン実装・検証（2026-07-29）: 共通表示名を`Big Five 自己理解チェック`、副題を`BIG FIVE SELF UNDERSTANDING`へ統一し、全対象画面へ緑のkicker／進捗＋`h1`を適用した。開始画面は`SELF CHECK`／`自分のことを知る`と承認済みBig Five・IPIP説明、結果画面は`PREVIEW RESULT`／`DETAIL RESULT`、履歴はヘッダーの`トップ画面へ`と`履歴削除`、比較はヘッダーの`履歴へ戻る`を使用する。ブラウザでは20問回答→簡易プレビュー→残り30問→50問詳細結果、履歴、互換な50問結果2件の比較を通過し、320px、360px、960pxで主要画面の横overflowなしを確認した。360px回答画面は`中断してトップへ`がnowrap、設問20px、回答文字16px、回答ボタン高56pxである。`npm.cmd test`は511件成功・失敗0件、`npm.cmd run check`は46 JavaScript files・canonical runtime version 1件で成功、`npm.cmd run qa:preview:build`は100 files・6,631,601 bytesで成功した。
  - Chrome追加検証（2026-07-29）: 320×800、360×800、960×900の開始・回答・履歴・結果・比較で横overflowなしを確認した。共有ヘッダー高は52px、主見出し上端は131px相当で揃い、360pxのkicker／進捗上端は104px相当である。960px回答画面は設問22px、回答文字16px、回答ボタン高56px、他の主見出し24pxである。200%文字拡大は`devicePixelRatio` 2、CSS viewport 960×487で横overflowなし、ヘッダー操作のnowrap、回答文字16px・回答ボタン高56pxを維持した。キーボードでは開始、回答、結果展開、履歴管理dialogを操作でき、`Escape`後のfocus復帰と`:focus-visible`のsolid outlineを確認した。
  - `result-text-v2`実装（2026-07-30）: TR-0〜TR-4の153文をすべてユーザー承認済みとして版付きCSVとruntime定義へ反映し、基本237件と合わせた390件を現行runtimeにした。v1→v2の承認済み文面修正は27件である。preview 1件、detail 1件＋追加2件、ゼロ-reflection fallback、部分snapshot拒否、共有候補抽出での除外を実装した。domain集中78件、共有境界等の集中41件、result-screen集中18件は成功した。
  - 追加検証（2026-07-30）: 旧v1件数や版fixtureを前提にした36件を履歴互換契約を弱めず修正し、`npm.cmd test` 530件、最終独立focused review 150件、`npm.cmd run check`、`npm.cmd run content:validate`、`npm.cmd run qa:preview:build`、`git diff --check`に成功した。ローカル実ブラウザで20問previewから50問detailまで通し、preview 1件、detail 1件＋追加2件、称号理由→振り返り→5因子の順、native buttonのfocus／`aria-expanded`、320px・360px・960pxの横overflowなし、console error／warning 0件を確認した。
  - Pages確認（2026-07-30）: commit `2e8ac66`を`codex/big-five-q006`へpushし、Actions run `30467272599`のbuild／deploy成功を確認した。公開先の`app-meta.js`は`result-text-v2`、`title-reflection-definitions.js`は承認済みTR文面をHTTP 200で返す。
  - AIリテラシー検定トンマナ整合（2026-07-30）: 共通ヘッダーは標準のアイコン`38px`・アプリ名`1.02rem`・副題`0.68rem`、380px以下の`34px / 0.84rem / 0.55rem`、340px以下の`32px / 0.8rem / 0.52rem`最小fallbackを実装した。開始画面は`SELF CHECK`から開始・再開操作までを一つの白い`start-main-panel`へまとめ、履歴導線と診断情報を外へ置いた。回答、結果、履歴、比較へ同パネルを適用せず、既存文面・操作・結果順を維持した。
  - トンマナ整合検証（2026-07-30）: `npm.cmd test`は533件成功・失敗0件、`npm.cmd run check`は48 JavaScript files・canonical runtime version 1件、`npm.cmd run content:validate`は警告658件・エラー0件、`npm.cmd run qa:preview:build`は102 files・6,663,780 bytesで成功し、`git diff --check`も成功した。commit `7bb0503`のローカル実アプリでは、開始画面の`scrollWidth/clientWidth`が320×800で`305/305`、360×800で`360/360`、414×896で`414/414`、960×900で`960/960`だった。文書commit `eedbeba`での補足QAでは、360pxの20問完答分岐に進捗、見出し、簡易プレビュー、結果非表示で残り30問、回答へ戻るの3操作があり、横overflow・ヘッダー重なり・`start-main-panel`がなかった。current HEADの別tab QAでは、開始、回答21問目、20問完答分岐、結果、履歴、比較の横overflowなし、ヘッダー操作nowrap、console warning／error 0件を確認した。focus-visibleは各画面1操作（開始ボタン、中立選択肢、簡易プレビューボタン、ヒント展開、履歴ヘッダー操作、比較ヘッダー操作）でsolid 3pxを確認し、全focusable要素の走査とは扱わない。
  - トンマナ整合Pages確認（2026-07-30）: commit `e314cc2`のActions run `30482247470`ではbuild job `90679023727`（31秒）とdeploy job `90679164991`（21秒）が成功し、このdeployでは360×800の開始画面だけを確認した。commit `c03c47b`のActions run `30482618659`ではbuild job `90680317617`（22秒）とdeploy job `90680454340`（10秒）が成功し、このdeployで開始、回答、履歴を確認した。開始画面はdocument `360/360`で白い主パネルを維持し、回答画面は`345/345`で`中断してトップへ`のnowrap、ブランドとの間隔6px、設問20px、履歴画面は`360/360`で`トップ画面へ`のnowrap、ブランドとの間隔52.3pxを維持した。3画面とも重なりなし、console warning／error 0件でスクリーンショットを実見した。回答の保存不可通知は公開browser環境固有で非致命的だった。結果・比較等のPages確認は行っていない。run `30482247470`にはNode.js 20非推奨によりconfigure-pages／upload-artifact actionをNode 24へ強制した非失敗annotationが1件ある。
  - 結果・履歴UI再整合（2026-07-30）: 因子名・棒・数値・矢印・「詳しく見る」を一つの全幅ボタンにまとめ、単一因子／単一カテゴリの段階表示を維持した。20問の振り返りヒントへ簡易結果由来の参考情報注記を追加し、境界注意を「今回の結果について」、方法カードを「結果の見方について」として分離した。設問構成sheetへ20問／50問と非表示情報を明記し、方法sheetは上部固定の閉じる操作と本文スクロールを分離してbackdrop clickにも対応した。履歴管理は「診断時の情報を見る」、全幅削除ボタン、ブラウザ標準confirmを使わないアプリ内確認へ統一した。結果画面の内部選択色ID表示は削除した。
  - 結果・履歴UI再整合検証（2026-07-30）: ローカル実ブラウザの320px、360px、960pxで横overflowなし、閉じたsheet 0件、同時1因子、360pxの因子名1行、sheetの閉じる1行、本文スクロール、アプリ内の個別／全削除確認、ブラウザ標準confirm未使用、console warning／error 0件を確認した。
  - 残る懸念: approved release未選択、Q-012の正式release、Q-013 production data、T-007共有UIは未完了である。通常runtimeの外部送信0件と`connect-src 'none'`は維持する。

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
- 状態（2026-07-28）: QA一時プレビューは`codex/big-five-q006`から現行ES Modules runtimeだけを公開する。approved releaseの選択、JSON runtimeの有効化、T-011本番デプロイ完了を意味しない。
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
| Q-014結果・履歴・中断再開UI | 回答中断、preview終了、状態別再開、新規開始確認、結果hero、5因子行・棒、単一開閉の二段階展開、設問構成／4方法sheet、50問トップ導線、簡潔な履歴、固定比較導線、履歴管理dialog、`result-text-v2`の称号別ヒントを実装し、全体回帰と320／360／960pxのローカルQAまで完了 | T-008A完了。Pages再確認はT-011で管理 |
| 結果・履歴画面統合 | Q-006ドメイン、ResultSnapshot保存、S-001/S-002 live controller、完答caller、追加30問、S-003/S-004 live／保存済み画面、S-006履歴、S-007比較、Q-012猫画像遅延表示、Q-014の`titleReflection`を含むUIと追加QAまで実装済み。共有UI、Q-013代替色・香りは未完了 | T-005/T-007/T-008A/T-008 |
| 共有画像の最終仕様 | 寸法・文字量未決 | Q-007 |
| Pages公開方式の最終値 | リポジトリ・URL未決 | Q-008 |
| 51猫アセット | 全51体の正典source PNG・1024px WebP・制作来歴候補・再利用部品・台帳証跡・altを制作・技術確認済み。runtime manifest、整合検査、単一画像遅延loader、live／保存済み結果画面接続まで実装済み | Q-012の正式なapproved release選択は未完了。共有はT-007で接続 |
| 色・香り実データ | `presentation-v2`の153パレット、用途色、香調、香り素材、51称号との関連はdraft作成済み。P-0向け単一HTMLで実使用色を目視確認できる。P-0〜P-6の人手承認とruntime接続は未完了 | Q-013の各gateを順に人手承認 |

これは要件漏れではなく、要件書19章に期限付きで残る後続決定である。
