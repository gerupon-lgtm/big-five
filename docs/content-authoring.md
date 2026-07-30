# コンテンツ作成・更新手順

## 1. この手順の対象

人が編集する正典は、コミット対象の`content/source/`以下にあるCSVだけです。生成JSON（`app/content/`）は出力物であり、手編集・コミットをしません。現在はCSV、スキーマ、4つのコンパイラ、決定的な7 JSONビルダー、原子的writer、CSV/ES Modules parity testが存在しますが、実行時は引き続き既存のES Modulesを読みます。JSON buildは起動処理の一部ではありません。

Excelでは「CSV UTF-8」で保存することを推奨します。日本語版ExcelのANSI/CP932もstrict decoderが受理しますが、CP932に表現できず保存時に失われた文字は復元できません。編集前後で日本語・記号を確認し、CSV UTF-8へ戻してください。

## 2. ファイルと版の置き場

| 目的 | 編集場所 | 現在の版 |
| --- | --- | --- |
| 診断、出典、限界、因子 | `content/source/diagnoses/<diagnostic-definition-version>/` | `ipip-ja-50-definition-v1` |
| 50問と固定20問 | `content/source/questions/<question-version>/` | `ipip-ja-50-question-set-v1` |
| 称号と因子関係 | `content/source/titles/<title-rule-version>/` | `title-rule-v1` |
| 結果文、結果文根拠の対応、称号別振り返りヒント | `content/source/result-texts/<result-text-version>/` | `result-text-v2`（現行runtime）／`result-text-v1`（履歴互換） |
| 根拠と主張の対応 | `content/source/evidence/<result-evidence-version>/` | `result-evidence-v1` |
| 色・香り・用途色・称号別選択 | `content/source/presentation/<presentation-definition-version>/` | `presentation-v2`（P-0〜P-6承認待ち） |
| Q-006の人手承認台帳 | `content/source/approvals/result-content-approvals.csv` | 版横断の18行 gate |
| Q-013の人手承認台帳 | `content/source/approvals/presentation-content-approvals.csv` | P-0〜P-6の7行 gate |
| 公開候補と公開履歴 | `content/source/releases/release-manifest.csv`、`release-history.csv` | 現在は両方ヘッダーのみ |

設問集合を差し替えるときは、公開済みの版を上書きしません。新しい`questions/<new-version>/`へ一式をコピーし、CSV内の全ての内部version参照を新しい値へ更新し、50問・20問の固定順を維持します。既存版の行、公開履歴、過去のreleaseは変更しません。

## 3. statusと承認の扱い

行の`status`は`draft -> reviewed -> approved`で進め、採用しない行は`rejected`にします。`reviewed`は人手承認ではありません。行status、Q-006の18行`result-content-approvals.csv`、Q-013の7行`presentation-content-approvals.csv`、Q-012のキャラクター承認条件は、それぞれ独立したgateです。承認者、承認日、hashを推測して記入してはいけません。

初期状態は次のとおりです。

- E-0は`approved`、E-1〜E-5は`draft`です。
- T-0〜T-4、F-1〜F-5、X-1〜X-2は`reviewed`ですが、人手approval metadataはありません。
- Q-013の`presentation-v2`候補CSVは作成済みですが、P-0〜P-6はすべて`draft`で、承認者・承認日は空欄です。各gateはパレット/WCAG、香調語彙・素材、および51称号を5範囲に分けた演出候補を別々に承認します。
- Q-012の正式releaseと、Q-013の承認済みproduction演出データは未完成です。
- release CSVはヘッダーだけで、approved releaseはありません。

現在はQ-006のE-0〜E-5、T-0〜T-4、F-1〜F-5、X-1〜X-2の全18 gateがapprovedとなり、2026-07-28に`result-text-v1`のContent Approvalを完了しています。`result-text-v2`は、この不変な237件を履歴互換の基準として残しながら、ユーザー承認済みの文面修正27件を版内へ反映し、TR-0〜TR-4で承認済みの称号別`titleReflection`を51称号×3件＝153件追加した現行runtime版です。結果文は基本237件＋振り返り153件＝390件、結果文と根拠の対応行は267件です。実行時の`ResultEvidenceDefinition`自体は引き続き固定6件であり、267件は根拠定義数ではありません。

ただし、行statusと別gateは引き続き別契約であり、approved releaseは未選択です。Q-012正式releaseとQ-013 production dataも未完了のままです。`result-text-v2`を現行ES Modules runtimeで利用できることを、CSV/JSONの正式release選択と同一視しません。

releaseを選択するには、参照される全行と別gateが`approved`であり、Q-006、Q-012、Q-013の承認条件をすべて満たす必要があります。Q-013はP-0〜P-6の7 gateと、選択された`presentation-v2`全行の両方が`approved`でなければ`PRESENTATION_APPROVAL_PENDING`になります。authoring validationは未承認を警告として表示しますが、承認状態や承認者を自動補完しません。履歴は追記専用です。差し替えも切り戻しも新しい不変version/release行で行い、過去のapproved history/sourceを書き換えません。

## 4. ローカル検証と修正

CSVを編集したら、リポジトリのルートで次を実行します。

```powershell
npm.cmd run content:validate
```

現在はauthoring validationが成功しても、approved release未選択の警告を出します。これはreleaseを作らない現在の正しい状態です。修正時はAction Summaryに出るファイル名、行、列、codeだけを使い、値や個人情報を外部へ貼り付けません。

| 種別 | ファイル | 行 | 列 | code | 修正例 |
| --- | --- | ---: | --- | --- | --- |
| エラー | `questions.csv` | 18 | `factor_id` | `CSV_VALUE_INVALID` | 当該セルをschemaで許可された因子IDへ直し、再検証する。 |

生成は`npm.cmd run content:build`です。releaseが未選択の間は`RELEASE_NOT_SELECTED`で失敗します。承認済みreleaseでは全7 JSONをall-or-nothingで出力しますが、`app/content/`はignore済みであり、編集対象ではありません。

### P-0の共有カード用配色を目視確認する

`palettes.csv`または`palette-usage-mappings.csv`を変更したら、次のコマンドで単一HTMLのプレビューを再生成します。

```powershell
npm.cmd run content:preview:palettes
```

出力先は`docs/palette-preview.html`です。ブラウザで直接開くと、51称号×3候補＝153配色を、共有カードの背景色として確認できます。各カードは縦横比3:5の配色・情報量確認用の簡略カードであり、完成共有カードではありません。ブランドアイコン、アプリ名・副題、称号と現行版付き結果副題、代表キャラクター、固定5因子色の棒グラフ、香り候補のプレースホルダー、注意書き、版を含みます。同じ称号の3配色では称号短文を共通にし、パレット説明はカード外の編集メタ情報に表示します。固定5因子色はココロパレアのアイコンと同じ系統の色を使う表示確認用で、P-0のパレット由来の`chart`用途色ではありません。キャラクターは1体の代表画像を全カードで共用し、称号ごとの最終画像・トリミング・配置を決めるものではありません。代表画像を読み込めない場合も、明示的なplaceholderで153カードと配色確認を維持します。

このHTMLは共有カード専用の配色確認ツールです。正式な共有Canvasレンダラー、S-003/S-004の結果グラフ、runtimeの選択色・香りには接続しません。各パレットの解決済み`background`を主背景、`surface`を淡い装飾・香り欄・猫画像 unavailable plate、`accent`を香り欄の輪郭、`text`を文字と外枠へ使用します。`chart`はP-0参照値としてカード外に表示し、固定5因子色へ流用しません。単一ファイル内に必要なキャラクター画像を埋め込み、外部通信なしで確認できます。検索、「標準のみ」「要確認のみ」の絞り込みが使えます。

各カードの基調色はブラウザ上で一時変更でき、解決色と実表示に対応するWCAG比率がその場で再計算されます。カード内の通常文字は解決済み`text`を使い、`accent`を通常文字色には使いません。試した値は画面上の「変更一覧」に表示されますが、正典CSVへは書き戻しません。正式に採用する変更は`content/source/`のCSVへ反映し、検証・レビューMarkdown・本HTMLを再生成してください。P-0、`palettes.csv`、`palette-usage-mappings.csv`の行status、承認者、承認日は、この確認だけでは変更しません。

## 5. activation後の運用

JSON runtime loadingとGitHub Pages/Actionsのactivationは、この基盤とは別の[activation plan](superpowers/plans/2026-07-26-csv-content-activation-pages.md)で扱います。activation後はActionsがvalidation、build、deployを自動実行し、人はCSVだけをコミットします。buildが失敗した場合、現在のデプロイは変更されません。

この文書はfoundation時点の手順です。現在の通常モードは外部通信0件、CSPは`connect-src 'none'`のままであり、runtime JSON fetchやPages deploymentはまだ有効化されていません。

### Palette preview intensity note (2026-07-30)

The committed standalone preview currently uses comparison preset B: background white mix 84%, surface white mix 90%. This is a preview-only display override. The canonical `palette-usage-mappings.csv` remains unchanged at its A values (background 92%, surface 95%), and no production share-card or runtime color decision is implied.

### パレット色名レビュー（2026-07-30）

利用者レビューで指摘された70候補について、現在の基調色HEXとB表示を維持したまま、結果画面で表示する色名を実際の背景色へ整合しました。同じ称号の3候補は異なる名称とprimary HEXを維持しています。解消済みの確認注記は空へ戻しましたが、全行の`draft`、P-0〜P-6、正式共有カードおよびruntimeの承認状態は変更していません。
