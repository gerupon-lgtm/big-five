# 回答画面統一・デプロイ引継ぎ（2026-09-06）

## 1. この資料の目的

ココロパレアとシゴトソケットの回答画面統一を完了し、両方をデプロイするための再開地点を固定する。

元チャットではCodexデスクトップの長時間コマンド表示とセッション終了通知が繰り返し不安定になり、会話履歴も大幅に欠落した。アプリ実装のクラッシュとは区別すること。以後はテストを最大5ファイル単位で実行し、実行中も10〜30秒単位で出力とプロセスを確認する。利用者へは最低10分に1回、工程・経過・失敗有無を報告する。

## 2. 利用者が承認した最終仕様

### 両アプリ共通

- 通常回答と完答確認後の見直し回答の前問操作は、どちらも「前の質問」。
- 見直し時の操作列は、左端に「前の質問」、右端に「回答を完了する」。
- 「合わせる」は見た目を似せて別実装する意味ではない。参照できるココロパレアの既存ソースを基準として踏襲する。
- 各アプリ固有の色は維持する。ココロパレアは緑、シゴトソケットは紺。

### ココロパレア

- シゴトソケットの進捗バー構造を回答画面へ移植する。
- `n / 20問`または`n / 50問`を太字にする。
- 緑のプログレスバーを回答数の直前へ表示する。分母は現在の診断区分（20または50）。
- 通常回答・見直しとも「前の質問」を使う。

### シゴトソケット

- 設問文字、5件法の回答選択肢、前問ボタン、破棄ボタンをココロパレアの既存寸法・構造へ揃える。色は紺。
- `45 / 45問`を含む質問数の形式はシゴトソケット側を維持し、太字にする。
- 回答画面と完了確認へ、既定で閉じた「その他の操作」を追加し、その中へ「回答を破棄」を置く。
- 破棄前に確認する。確定時は途中回答だけを消し、保存済み結果は残してトップへ戻る。キャンセル時は変更しない。
- ヘッダーはココロパレアの文字組み・配置を踏襲する。ただし外枠、囲い面、角丸、影は付けず、下罫線だけとする。色は紺。

## 3. リポジトリとブランチ

### ココロパレア

- フォルダ: `C:\Users\user\Documents\診断系アプリ開発`
- リモート: `https://github.com/gerupon-lgtm/big-five.git`
- 作業ブランチ: `codex/kokoroparea-questionnaire-ui-sync`
- 作業開始時HEAD: `e25237e`
- 予定版: `mvp-1.3.2`
- 要件版: `1.46`
- タスク: `T-037`
- Pages workflow: `.github/workflows/qa-preview-pages.yml`
- `main`は保護されているため、ブランチpush → PR → merge → workflow手動実行の順で進める。
- **既存の未追跡フォルダ `_verify/delegate-helper-forward-fixture/` は利用者のもの。追加・削除・コミットしない。**

### シゴトソケット

- フォルダ: `C:\Users\user\Documents\project\診断系アプリ検討\sigotosocket`
- リモート: `https://github.com/gerupon-lgtm/sigotosocket.git`
- 作業ブランチ: `codex/sigotosocket-questionnaire-ui-sync`
- 作業開始時HEAD: `60c5908`
- 予定版: `v0.2.5`
- 要件版: `1.32`
- タスク: `T-045`
- 決定ログ: `D-32`
- Pages workflow: `.github/workflows/pages.yml`（main pushで起動）
- 従来どおり、検証後に作業ブランチをpushし、ローカルmainへfast-forwardしてmainをpushできる。

## 4. 実装済み変更

### ココロパレア

- `app/js/presentation/questionnaire-screen.js`
  - ARIA付きプログレスバーを追加。
  - 回答数へ太字用classを追加。
  - 前問文言を「前の質問」へ変更。
  - 見直し操作列を左「前の質問」／右「回答を完了する」に変更。
- `app/css/styles.css`
  - 回答数太字、緑の進捗バー、高さ12px、下余白8px、見直し操作の両端配置。
- `app/tests/helpers/fake-dom.js`
  - CSSOMの`style`をテストDOMへ追加。
- `app/tests/questionnaire-screen.test.js`、`questionnaire-typography.test.js`、`app-shell.test.js`
  - 新しい文言、順序、進捗、ARIA、CSS契約へ更新。
- `app/js/config/app-meta.js`と版契約テストを`mvp-1.3.2`へ更新。
- 要件・基本設計・画面・処理・データ・API・tasks・README・AGENTSを同期。旧「前へ」と数値のみの進捗を仕様変更として明示的に置換。

### シゴトソケット

- `app/js/presentation/questionnaire-screen.js`
  - ココロパレア型の回答部品classを付与。
  - 前問を「前の質問」へ変更し左へ配置。
  - 見直し時の「回答を完了する」を右へ配置。
  - 回答画面・完了確認へ「その他の操作／回答を破棄」を追加。
- `app/js/main.js`
  - 破棄確認、途中回答だけの削除、見直し状態解除、トップ遷移を接続。
- `app/css/style.css`
  - 設問文字、回答選択肢、前問／破棄ボタンをココロパレアの寸法・構造へ同期し、色を紺に維持。
  - stickyヘッダーを外枠・面・影なしへ変更。
- `app/tests/questionnaire-ui-parity.test.js`、`discard-navigation.test.js`を追加。
- `app/tests/screens.test.js`を更新。
- `app/js/config/app-meta.js`を`v0.2.5`へ更新。
- 要件・基本設計・画面・処理・データ・API・tasks・AGENTS・引継ぎメモを同期。
- 親フォルダの追記専用`構想たたき台_シゴトソケット.md`へD-32を追記。D-27/C-5の「部品の見た目を相手側へ寄せない」は、回答画面・ヘッダー範囲に限り明示的に失効とした。

## 5. 確認済み

### 実ブラウザ（ローカル、Chrome、390×844）

両アプリの実コードで以下を確認済み。

- 通常画面の回答数は太字（computed `font-weight: 700`）。
- プログレスバーのARIA値は1問目で現在値1、最大値はココロパレア20、シゴトソケット45。
- 1問目の「前の質問」は無効。
- 見直し時は左「前の質問」、右「回答を完了する」。
- 横方向overflowは両方0px。
- シゴトソケットのヘッダーは透明、角丸0、影なし。
- シゴトソケットの破棄キャンセルで進捗を維持。

実コードの確認画像:

- `C:\Users\user\.codex\visualizations\2026\09\05\01a07204-5576-7832-81d6-5b1e9f2a242c\kokoro-review-actual.png`
- `C:\Users\user\.codex\visualizations\2026\09\05\01a07204-5576-7832-81d6-5b1e9f2a242c\sigotosocket-review-actual.png`
- 検証スクリプト: 同フォルダの`verify-live-questionnaire.mjs`（リポジトリ外。コミットしない）

### シゴトソケット

- `npm.cmd test`: **278件成功、失敗0**。
- `npm.cmd run check`: 成功。
- `npm.cmd run version:check`: `v0.2.5`で成功。
- `npm.cmd run items:check`: 45問、隣接同一尺度0、昇順で成功。
- `npm.cmd run character:check`: 18枚で成功。
- 変更対象の4テストだけの再実行も44件成功。

### ココロパレア

- 変更対象テスト: 15件成功。
- `app-shell.test.js`: 版・文言の旧期待値を修正後、49件成功。
- `npm.cmd run check`: 62 JavaScript、正典版1件で成功。
- `npm.cmd run content:validate`: エラー0、既知の警告657。
- `npm.cmd run qa:preview:build`: 125ファイル、10,773,354 bytesで成功。
- `npm.cmd run character:check`: manifest 51、orphan 0、integrity mismatch 0。
- 再起動後の小分けテストで、先頭25ファイル（`app-header.test.js`〜`kokoro-aroma-review.test.js`）は各終了コード0。
- `palette-usage.test.js`、`palette-variation.test.js`、`presentation-approval-stage.test.js`は個別に終了コード0。

## 6. 未完了・成功扱いにしてはいけない項目

- ココロパレアの一括`npm.cmd test`は、テスト出力上は進行したがCodexの実行セッションが完了直後に消え、最終終了コードを取得できなかった。**成功扱いにしない。**
- `palette-label-alignment.test.js`と`palette-preview-tool.test.js`は再起動後の小分け実行で成功ドットを確認したが、その5ファイル組全体の最終終了コードをセッション消失により取得できなかった。必要なら2ファイルを個別再実行する。
- ココロパレアの残りappテスト（`presentation-definition.test.js`以降）と`prototype-big-five/tests/*.test.js`を、最大5ファイルずつ実行して各終了コード0を取得する。
- 差分全体の最終レビュー、コミット、push、PR／merge、Pagesデプロイ、公開URL確認、デプロイ記録更新は未実施。

## 7. 推奨する再開手順

1. 両フォルダで`git status --short`を確認し、この資料記載の変更が残っていることを確認する。
2. ココロパレアの未確認テストを最大5ファイル単位で実行する。30秒を超えたら10秒単位で出力をpollする。出力とCPUが止まった場合だけ、その組を停止し1ファイルずつ実行する。
3. `palette-label-alignment.test.js`と`palette-preview-tool.test.js`を個別に再実行する。
4. `prototype-big-five/tests/*.test.js`を実行する。
5. ココロパレアの`check`、`content:validate`、`qa:preview:build`、`character:check`は既に成功しているが、コミット直前に変更が増えた場合だけ再実行する。
6. シゴトソケットは全検証済み。変更を加えた場合だけ該当検証と全278件を再実行する。
7. `git diff --check`、`git diff`、`git status`で余計な変更がないか確認する。ココロパレアの既存未追跡fixtureは除外する。
8. 各ブランチで変更をコミットする。
9. ココロパレア: branch push → PR作成 → checks確認 → merge → `qa-preview-pages.yml`を手動実行 → run成功と公開版`mvp-1.3.2`を確認。
10. シゴトソケット: branch push → mainへfast-forward → main push → `pages.yml`成功 → 公開版`v0.2.5`と回答導線を確認。
11. 実際のcommit SHA・run ID・公開確認結果を`docs/qa-preview-pages.md`（ココロパレア）と`docs/引き継ぎメモ.md`（シゴトソケット）へ追記する。記録だけの追加デプロイが発生した場合は、その最終runも成功確認する。

## 8. 新しいチャットへ送る文面

以下をそのまま送る。

> `C:\Users\user\Documents\診断系アプリ開発\docs\handoffs\2026-09-06-questionnaire-ui-deploy-handoff.md`を最初に全文確認し、記載の作業ツリーから継続してください。会話履歴と長時間コマンドが不安定だったため、テストは最大5ファイル単位で実行し、実行中も出力・プロセス状態を確認してください。最低10分に1回は進捗を報告し、停止を検知したら対象テストだけを切り分けてください。両アプリの未完了検証を完了し、差分レビュー後、資料記載の手順で両方をデプロイして公開確認まで行ってください。
