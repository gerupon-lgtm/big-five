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

## 6. 再開後に完了した検証

- ココロパレア正式版は66ファイルを最大5ファイルずつ実行し、705件成功・失敗0・全バッチ終了コード0を取得した。
- ココロパレアのプロトタイプは7ファイルを最大5ファイルずつ実行し、39件成功・失敗0・全バッチ終了コード0を取得した。正式版との合計は744件。
- `palette-label-alignment.test.js`は2件成功、`palette-preview-tool.test.js`は生成物を同期した後に10件成功・失敗0。後者はメモリ枯渇の再発防止変更後にも10件成功・失敗0・約1.5秒で終了した。
- ココロパレアの`check`、`content:validate`、`qa:preview:build`、`character:check`を再確認し、終了コード0を取得した。コンテンツ検証は既知の警告657・エラー0、QA artifactは125ファイル・10,773,354 bytes。
- シゴトソケットは33ファイルを最大5ファイルずつ再実行し、278件成功・失敗0・全バッチ終了コード0を取得した。`check`、`version:check`、`items:check`、`character:check`も終了コード0。
- 両リポジトリで`git diff --check`を通し、仕様観点と実装規約観点の差分レビューを行った。旧ボタン文言、設問文字トークン、タスクと機能IDの対応、テスト件数、重複CSSを修正し、破棄時に保存済み結果を残すテストを強化した。再レビュー後に未解決指摘はない。

## 7. 実施した再開手順

以下は2026-09-06にすべて完了した。将来同じ状態から再開する場合の順序として残す。

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

## 9. 長時間コマンドとCodex不安定化の原因・対処

### 確認できた原因

`app/tests/palette-preview-tool.test.js`は、生成した約2.7MBのHTMLとコミット済み`docs/palette-preview.html`を`assert.deepEqual`で比較していた。アプリ版を`mvp-1.3.2`へ上げた一方、コミット済みHTMLには旧版`mvp-1.3.1`が153か所残っていたため、この比較が失敗した。失敗内容を表示するために大きなBuffer全体の差分を組み立て続け、テスト本体ではなく失敗診断の生成で`node.exe`のメモリが急増した。

Windowsイベントログ（System、Resource-Exhaustion-Detector、イベントID 2004）には、2026-09-06 15:46:36に`node.exe`が41,956,384,768 bytes、15:52:55に42,079,928,320 bytesの仮想メモリを消費した記録がある。その直後の15:46:53と15:52:59には、Applicationログへ`codex.exe`のクラッシュ（イベントID 1000）が記録されている。コマンド実行側でも`CreateProcessWithLogonW failed: 1455`を確認した。エラー1455は仮想メモリ／ページファイル不足で新しいプロセスを作れない状態を表す。

したがって、テスト失敗時の異常なメモリ消費がWindows全体の仮想メモリを圧迫し、Codexのコマンドセッション消失、進捗表示停止、`codex.exe`のクラッシュを起こしたことは確認できた。利用者が確認した約2時間分の会話履歴欠落についても、このクラッシュで未同期または未永続化の履歴が失われた可能性が高い。ただし、会話保存処理そのもののログは取得できていないため、履歴欠落の直接原因だけは【推定】とする。

### 実施した対処

1. CPUとメモリが増え続けていた対象のNodeテストだけを停止し、他の作業ツリーや利用者ファイルには触れなかった。
2. 一時生成HTMLとコミット済みHTMLのサイズ、SHA-256、版文字列を比較し、旧版生成物だけが不一致であることを特定した。
3. 正規コマンド`npm.cmd run content:preview:palettes`で`docs/palette-preview.html`を再生成した。
4. 対象テストを単独で再実行し、10件成功・失敗0・約2秒で終了することを確認した。
5. 大容量Bufferの`deepEqual`をSHA-256の文字列比較へ変更した。内容一致の検証は維持し、不一致時の診断出力を64文字のハッシュへ制限した。変更後も対象10件は約1.5秒で成功した。
6. 残りのテストは最大5ファイルずつ実行し、各プロセスの出力、CPU、メモリ、終了コードを確認した。停止時はその組だけを切り分ける運用にした。

### 今後の運用知識

- 版数やコンテンツを変更したら、全テストより先にコミット対象の生成物を正規コマンドで再生成する。
- 数MB以上の生成物をテストする場合、Bufferや巨大文字列を`deepEqual`へ直接渡さない。長さとSHA-256、または差分量を制限した専用エラーで比較する。
- テストが通常時間を超えたら、出力の有無だけでなくNodeプロセスのCPU、Working Set、Private Memoryも確認する。メモリが増え続ける場合は待ち続けない。
- 停止は問題のあるテストプロセスだけを対象にし、全Nodeプロセスの一括終了や作業ツリーの削除はしない。
- 長い検証は最大5ファイル単位にし、各単位の終了コードを記録する。利用者への進捗報告は遅くとも10分以内に行う。
- エラー1455、イベントID 2004、`codex.exe`のイベントID 1000が同時期に出た場合は、アプリの表示不具合より先に仮想メモリ枯渇を疑う。

## 10. デプロイと公開確認の完了記録

### ココロパレア

- 実装コミット: `5e3c32c`、再発防止コミット: `90d3737`
- Pull Request: https://github.com/gerupon-lgtm/big-five/pull/27
- main merge commit: `301f0dcb49d47caddacea84f4bb3d5a2c8555c1c`
- Pages workflow: https://github.com/gerupon-lgtm/big-five/actions/runs/34020401043（build／deploy成功）
- 公開URL: https://kokoro.sikumilab.com/
- HTTPで`mvp-1.3.2`と新しい回答画面ソースを確認した。390×844の実ブラウザで20問から50問完答・見直しまで通し、太字の回答数、緑の進捗、ARIA、前問文言、見直し操作順、横overflow 0、console error／warning 0を確認した。

### シゴトソケット

- 実装コミット／main fast-forward: `775663bb8e982dce6725d464a3063ac0516852ab`
- 実装Pages workflow: https://github.com/gerupon-lgtm/sigotosocket/actions/runs/34019875438（成功）
- 公開記録コミット: `98058080310426ce70d76f4707d77bb8df919dee`
- 記録コミット後の最終Pages workflow: https://github.com/gerupon-lgtm/sigotosocket/actions/runs/34020195860（成功）
- 公開URL: https://sigotosocket.sikumilab.com/
- HTTPで`v0.2.5`と新しい回答画面ソースを確認した。390×844の実ブラウザで45問完答・見直しまで通し、太字の回答数、ARIA、5件法文言、前問・破棄文言、見直し操作順、透明なヘッダー、破棄キャンセル時の進捗維持、横overflow 0、console error／warning 0を確認した。

公開確認スクリプトと画像は`C:\Users\user\.codex\visualizations\2026\09\06\01a07592-9e40-7f70-a764-f565dc1dfb33`に保存した。リポジトリ外の検証成果物であり、コミット対象にはしない。
