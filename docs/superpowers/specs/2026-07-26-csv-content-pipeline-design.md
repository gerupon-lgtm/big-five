# Big Five CSVコンテンツ管理・JSON配布設計

- 作成日: 2026-07-26
- 対象: T-002 / T-005 / T-008 / T-011 / F-002 / F-005 / F-006 / F-014 / F-016 / F-018
- 状態: ユーザー対話で設計承認済み。文書レビュー待ち
- 対象worktree: `codex/big-five-q006`

## 1. 目的

称号、結果コメント、設問、根拠、色、香り、キャラクター対応などの静的コンテンツを、人がExcelでCSVだけを編集すれば更新できる構成へ変更する。

通常公開版のバックエンドなし・GitHub Pages配信を維持し、CSVから検証済みJSONを自動生成する。一般ユーザーは管理者が公開指定した1つの診断セットを利用し、診断セットを選択しない。

## 2. 決定事項

- 人が編集する正典は用途別・版別のCSVとする。
- アプリが実行時に読む配布物は生成済みJSONとする。
- CSVと生成JSONを実行時DBへ保存しない。
- 生成JSONは手編集せず、ローカル処理とGitHub Actionsで決定的に再生成する。
- GitHub Pagesの配布成果物にはCSVを含めず、検証済みJSONだけを含める。
- 管理者は公開する版をCSVで指定する。一般ユーザーへ版選択UIを提供しない。
- 公開済みの版を上書きしない。変更時は新しい版を作成する。
- 旧版を保持し、公開manifestの切替で新版公開と切り戻しを行う。
- 初期CSVは現行の版付き定義から移植し、人による再入力を要求しない。
- 通常版の外部通信は同一オリジンの静的JSON取得だけとし、外部API、認証、DB、分析送信を追加しない。

## 3. 対象と対象外

### 3.1 CSV管理対象

- 診断セットと構成版
- 設問文、固定順、因子割当、正逆方向
- 20問プレビュー集合と固定順
- 称号、分類種別、因子・方向の対応
- 称号の副題と判定理由
- 因子別の観察、強み、注意点、仕事、対人関係、ストレス、問い、行動コメント
- 結果文の根拠参照
- 色候補、用途色設定
- 香り候補、場面、共有代表
- 称号と色・香りの対応
- キャラクターID、画像版、alt、画像パス、integrityなどのメタデータ
- 公開する各定義版の組合せ

### 3.2 CSV管理対象外

- 猫のPNG・WebP本体
- 採点アルゴリズムの実装
- `title-rule-v1`の判定アルゴリズム
- Canvas、共有、画面、保存などのプログラム
- 生回答、結果履歴、利用者情報
- GitHub、OCIなどの秘密情報

採点・判定アルゴリズムはコードで管理し、CSVは使用するアルゴリズム版IDだけを参照する。アルゴリズム変更は従来どおりコード、設計、テスト、版を同時に更新する。

## 4. ディレクトリ構成

```text
content/
  source/
    releases/
      release-manifest.csv
      release-history.csv
    diagnoses/<diagnosticDefinitionVersion>/
      diagnosis-sets.csv
      diagnosis-sources.csv
      diagnosis-limitations.csv
      factor-definitions.csv
    questions/<questionVersion>/
      questions.csv
      preview-questions.csv
    titles/<titleRuleVersion>/
      title-profiles.csv
      title-profile-factors.csv
    result-texts/<resultTextVersion>/
      result-texts.csv
      result-text-evidence.csv
    evidence/<resultEvidenceVersion>/
      result-evidence.csv
      result-evidence-claims.csv
    presentation/<presentationDefinitionVersion>/
      scenes.csv
      palettes.csv
      palette-usage-mappings.csv
      fragrances.csv
      presentation-selectors.csv
      selector-palettes.csv
      selector-fragrances.csv
    characters/<characterManifestVersion>/
      characters.csv
  schemas/
    *.schema.json
  fixtures/
    invalid/

scripts/
  content/
    build-content.mjs
    validate-content.mjs
    encoding.mjs
    csv-parser.mjs

app/
  content/                  # ローカル・CI生成先。Git管理しない
    content-manifest.json
    <releaseId>/
      diagnosis.json
      questions.json
      titles.json
      result-texts.json
      evidence.json
      presentation.json
      characters.json
```

`app/content/`はローカル生成物としてignoreし、GitHub Pages成果物を作る際に生成する。テストは一時ディレクトリへ生成し、作業ツリーを変更しない。

## 5. CSVの基本規約

### 5.1 Excel互換

- RFC 4180相当のカンマ区切りCSVを受け付ける。
- ダブルクォートで囲まれたカンマ、ダブルクォート、セル内改行を保持する。
- 改行コードはCRLFとLFを受け付ける。
- 先頭・末尾空白を値の一部として扱い、変換側で暗黙にtrimしない。
- ID、版、日時、数値は列schemaに従って検証し、Excelの表示形式を正典にしない。
- 新規の人向けIDは小文字kebabの`id`型を使う。既存runtime IDを参照する列は`reference`型を使い、lowerCamelCase部分と称号pairの`--`を保持する。空白、スラッシュ、先頭・末尾ハイフン、3連続以上のハイフンは許可しない。
- 配列や複数参照を1セルへ区切り文字で詰め込まない。対応表CSVへ分離する。
- 未知列を拒否する。
- 列順は固定する。生成JSONの決定性とExcel上の比較可能性を保つ。

### 5.2 文字コード

対応する入力文字コード:

1. UTF-8 BOM付き
2. UTF-8 BOMなし
3. CP932（Windows-31J。日本語Windows Excelの「ANSI」）

判定順:

1. UTF-8 BOMがあれば、BOMを除いてstrict UTF-8で復号する。
2. BOMがなく、全バイトをstrict UTF-8で復号できればUTF-8とする。
3. UTF-8でなければ、全バイトをstrict CP932で復号する。
4. 置換文字を発生させる復号や、どちらでも復号できない入力を拒否する。
5. ASCIIだけの入力はUTF-8として扱う。

1ファイルへ複数文字コードを混在させる運用はサポートしない。混在を検出できた場合は拒否する。任意のバイト列について混在を完全判定することはできないため、復号後のschema検証、固定ID・固定列検証、文字品質検査も併用する。

CP932へ存在しない絵文字・特殊文字は、Excel保存時点で情報が失われる可能性がある。変換処理は失われた元文字を復元しない。絵文字・特殊文字を含むCSVにはExcelの「CSV UTF-8」を使用する。

生成JSONはBOMなしUTF-8、改行LF、末尾改行ありへ統一する。

### 5.3 共通値

- `id`: kebab-caseまたは既存の確定ID形式
- `version`: 対象定義の版ID
- `display_order`: 1始まりの整数。対象集合内で重複不可
- `status`: `draft` / `reviewed` / `approved` / `rejected`

公開releaseから参照できるのは`approved`だけである。`status`は人手承認記録を代替しない。Q-006など別の承認台帳を持つコンテンツは、台帳上の必要な承認記録も満たすまで公開可能と判定しない。

## 6. 主要CSV契約

### 6.1 設問

`questions.csv`:

```text
question_id,question_version,display_order,text,factor_id,direction,source_ref,status
```

- `direction`: `positive` / `reverse`
- 生成時は`positive`をruntimeの`positive`、`reverse`をruntimeの`negative`へ明示的に変換する。
- 同じ`questionVersion`で50件固定
- ID、文面、順序、因子、方向を同じ版の中で変更しない

`preview-questions.csv`:

```text
question_version,display_order,question_id,status
```

- 20件固定
- すべて`questions.csv`に存在する
- 固定順を保持する

設問変更時は新しい`questionVersion`を作成する。現行のIPIP日本語50項目版を同じ版のまま言い換え、並べ替え、ランダム抽出しない。

### 6.2 称号

`title-profiles.csv`:

```text
title_id,title_rule_version,display_order,label,kind,character_id,summary_text_id,default_palette_id,status
```

- `kind`: `balanced` / `single` / `pair`
- 51件固定

`title-profile-factors.csv`:

```text
title_id,display_order,factor_id,direction,status
```

- balancedは0件、singleは1件、pairは2件
- `direction`: `high` / `low`
- `title-rule-v1`の40＋10＋1を完全に網羅する

### 6.3 結果文

`result-texts.csv`:

```text
text_id,result_text_version,display_order,section,claim_kind,mode,factor_id,band,title_id,preview_allowed,text,status
```

空欄可能列はsectionごとのschemaで限定する。空欄をワイルドカードとして推測しない。

`result-text-evidence.csv`:

```text
text_id,display_order,evidence_id,status
```

現行`result-text-v1`の初期データは、51称号×2節の102件と因子定義135件、合計237件を移植する。

`result-evidence.csv`:

```text
evidence_id,result_evidence_version,display_order,source_type,source_label,locator,status
```

`result-evidence-claims.csv`:

```text
evidence_id,display_order,supported_claim,status
```

1根拠が複数のclaimを支持する場合も、claim一覧を1セルへ詰めず対応表で保持する。

### 6.4 色・香り・演出

パレット、用途色、香り、selectorはQ-013のexact schemaをCSVの行へ正規化する。標準パレット、代替2件、固定3場面、各2候補、共有代表1件の関係を対応表で保持する。

`scenes.csv`:

```text
scene_id,presentation_definition_version,display_order,label,status
```

`palettes.csv`:

```text
palette_id,presentation_definition_version,display_order,label,description,status
```

`palette-usage-mappings.csv`:

```text
palette_id,display_order,usage,color,status
```

`usage`は`primary`、`secondary`、`accent`の3件を固定順で持つ。

`fragrances.csv`:

```text
fragrance_id,presentation_definition_version,display_order,scene_id,accord_label,description,disclaimer_id,status
```

`presentation-selectors.csv`:

```text
title_id,presentation_definition_version,display_order,status
```

`selector-palettes.csv`:

```text
title_id,display_order,palette_id,status
```

`selector-fragrances.csv`:

```text
title_id,scene_id,display_order,fragrance_id,share_selected,status
```

色選択はカード演出だけを変更し、スコア、称号、文章、猫、香り候補を変更しない。商品、精油量、使用法、治療・改善・能力効果を示す文言を拒否する。

### 6.5 キャラクター

`characters.csv`は画像本体ではなく、版付きmanifestメタデータを保持する。

```text
title_id,character_manifest_version,display_order,character_id,asset_version,delivery_webp_path,delivery_sha256,width,height,byte_length,has_alpha,alt,art_review_status,anatomy_review_status,technical_review_status,accessibility_review_status,approved_by,approved_at,status
```

51称号と51キャラクターの1対1、WebP寸法、alpha、integrity、alt、パスを検証する。公開未承認の画像を生成manifestへ含めない。生成する`CharacterManifest`は`docs/data-model.md`のexact schemaを正とし、`titleId`、byte数、alpha、承認情報をruntime JSONへ重複保持しない。

## 7. 公開release

`release-manifest.csv`は公開候補1行だけを保持する。

```text
release_id,app_version,diagnosis_id,diagnostic_definition_version,scale_version,question_version,scoring_version,result_evidence_version,result_text_version,title_rule_version,character_manifest_version,presentation_definition_version,card_template_version,status
```

- `status`は`approved`だけを公開できる。
- 一般ユーザーへ`release_id`や設問セットの選択UIを表示しない。
- 参照する全コンテンツ版が存在し、必要行がすべてapprovedでなければ生成を失敗させる。
- 設問、採点、称号判定、結果文などの互換条件をrelease単位で検証する。

`release-history.csv`は追記専用とし、過去のapproved releaseを保持する。公開済み版を参照するCSVへの変更は、PRまたはpush時に直前の既定ブランチ／直前commitと比較して拒否する。

## 8. 生成JSON

### 8.1 決定性

- 同じ入力バイト列と変換器版から同じJSONバイト列を生成する。
- JSONのプロパティ順と配列順をschemaで固定する。
- JSONへ生成日時、端末パス、ユーザー名などの非決定値を入れない。
- manifestへ各JSONのSHA-256を含める。
- ID、版、件数、参照、hashを生成後にも再検証する。

### 8.2 manifest

`content-manifest.json`:

```json
{
  "schemaVersion": 1,
  "releaseId": "release-mvp-0.1.0",
  "appVersion": "mvp-0.1.0",
  "diagnosisId": "big-five-ipip-ja",
  "versions": {},
  "resources": [
    {
      "kind": "questions",
      "path": "./release-mvp-0.1.0/questions.json",
      "sha256": "<lowercase hex>"
    }
  ]
}
```

`versions`はrelease CSVの全版IDをexact schemaで保持する。`resources`は固定kind順とし、未知kind、重複path、hash不一致を拒否する。

## 9. 自動処理

管理者が行うコンテンツ操作はCSVの追加・編集と、公開時の`release-manifest.csv`更新だけとする。JSON変換コマンドの手動実行を要求しない。

GitHub Actions:

1. CSVをバイト列として読む。
2. 文字コードを判定し、Unicodeへ復号する。
3. CSV構文を解析する。
4. 列schema、行、型、値、件数を検証する。
5. ファイル間参照、版、固定順、状態、公開承認を検証する。
6. 公開済み版の変更を監査する。
7. 一時ディレクトリへJSONを生成する。
8. 生成JSONを再読込し、runtime validatorで検証する。
9. 全テスト、静的検証、配布物検査を行う。
10. 全工程成功時だけPages artifactへJSONを含めてdeployする。

ローカル:

- `npm.cmd run dev`、`npm.cmd test`、`npm.cmd run check`は必要なコンテンツ生成を自動実行する。
- 変換器のfocusedコマンドも提供するが、通常編集者へ実行を要求しない。
- テスト生成物は一時ディレクトリへ出力する。

## 10. エラー処理

検証エラー:

```text
result-texts.csv: 18行目 / text
必須の結果文が空欄です。

questions.csv: 42行目 / factor_id
存在しない因子ID「openness」を参照しています。
正しいID候補: intellectImagination
```

- ファイル、1始まりの行番号、列名、安定した内部コード、日本語説明を保持する。
- 構文エラー後も安全に解析できる範囲で複数エラーを集約する。
- Action Summaryとダウンロード可能なMarkdown reportへ出力する。
- エラー時はPages deployを行わず、現在の公開版を維持する。
- JSONやmanifestの一部だけを公開しない。
- ログへ秘密情報、生回答、結果履歴を含めない。

実行時:

- 同一オリジンの`content-manifest.json`を最初に読む。
- manifestと各JSONをexact schema、版、件数、参照、hashで検証する。
- すべて成功してから診断開始を許可する。
- 読込または検証失敗時は診断を開始せず、再読込案内と内部エラーコードを分離して表示する。
- CSVへフォールバックしない。
- 部分的な新版と旧版を混ぜない。

## 11. 履歴・互換性

- 結果履歴は診断時のVersionTuple、称号ID、キャラクターID・個別版、表示文章をsnapshotとして保持する。
- 旧JSONを読み直して過去の表示文を再構成しない。
- `scaleVersion`、`questionVersion`、`scoringVersion`、questionCount、5因子スコアが有効かつ一致する結果だけを比較する。
- 設問セットを変更した新版は、互換条件を明示的に満たさない限り旧版と比較しない。
- release切り戻しは新規診断へ適用し、保存済み履歴を上書きしない。

## 12. セキュリティ・プライバシー

- CSVとJSONは静的マスタ専用とし、生回答や個人データを入力しない。
- 通常公開版は外部API、認証、分析、DBを使用しない。
- 配布artifactにsource CSV、draft、rejected、承認メモを含めない。
- CSVセルをコマンド、式、JavaScriptとして評価しない。
- パス列は同一オリジン相対パスだけを許可し、`..`、絶対パス、URLを拒否する。
- エラーログにCSV全文を出さず、必要な行・列と安全な値だけを示す。
- 生成JSONへ秘密情報、ローカルパス、GitHub tokenを含めない。

## 13. テスト

### 13.1 文字コード・CSV

- UTF-8 BOM、UTF-8 BOMなし、CP932から同一のUnicodeモデルを生成する。
- ASCIIのみのCSVをUTF-8として扱う。
- 不正バイト、復号置換、壊れた引用符を拒否する。
- カンマ、引用符、セル内CRLF/LFを保持する。
- CP932非対応文字の情報損失を自動復元しない。

### 13.2 schema・参照

- 必須列不足、未知列、型不正、空欄、重複ID、重複順序を拒否する。
- 50問、20問集合、5因子、正逆方向、51称号、237初期結果文を独立fixtureで検証する。
- 称号、結果文、根拠、色、香り、猫の参照切れ・孤立を拒否する。
- draft、reviewed、rejectedを含むreleaseを拒否する。
- 公開済み版の変更とrelease-historyの削除・書換えを拒否する。

### 13.3 生成・runtime

- 同じCSVからバイト一致するJSONを生成する。
- 生成JSONを既存domain validatorへ通す。
- manifestの固定順、path、hash、版一致を検証する。
- manifestまたは1資源失敗時に診断を開始しない。
- 一般ユーザーへ診断セット選択を表示しない。
- 通常版の通信先が同一オリジン静的JSONだけである。
- CSV、draft、rejected、生回答がPages artifactへ含まれない。

### 13.4 CI

- 変換失敗、テスト失敗、静的検証失敗でdeploy jobを実行しない。
- 成功時だけ完全な1releaseをartifactへ含める。
- 失敗時に現在公開中のdeploymentを変更しない。
- Action SummaryとMarkdown reportへ同じエラー件数・コードを出力する。

## 14. 初期移行

1. 現行ES ModulesからCSVを機械生成する移行スクリプトを作る。
2. 50設問、20問集合、51称号、237結果文、根拠定義を独立fixtureと照合する。
3. Q-013とQ-012は人手承認済みデータだけをCSVへ移す。未承認データをapprovedにしない。
4. CSVから生成したJSONと現行定義の意味的等価性をテストする。
5. アプリの同期importをJSON loaderへ切り替える。
6. JSON loader移行後に旧JSデータ定義を削除する。移行中は二重正典にせず、互換adapterを一時利用する。
7. 全テストとブラウザsmoke成功後に公開manifestをCSV生成版へ切り替える。

## 15. 文書同期

実装計画では、少なくとも次を同じ変更系列で更新する。

- `AGENTS.md`
- `docs/基本設計サマリ.md`
- `docs/data-model.md`
- `docs/processing-design.md`
- `docs/screens.md`
- `docs/tasks.md`
- GitHub Pages / Actionsの運用手順

## 16. 完了条件

- 管理者がExcelでCSVだけを編集できる。
- UTF-8と日本語Windows ExcelのCP932を受け付ける。
- 検証済みJSONが自動生成され、CSVと生成前データは公開されない。
- 一般ユーザーは管理者が指定した1つの診断セットを利用する。
- 設問セットを版単位で差し替え・切り戻しできる。
- 公開済み版と過去結果を上書きしない。
- 初期データは現行実装から移植され、管理者による再入力を必要としない。
- 検証・テスト失敗時に公開版を変更しない。
- 通常版の外部送信0件と、生回答非保存を維持する。
