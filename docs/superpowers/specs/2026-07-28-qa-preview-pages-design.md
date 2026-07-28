# QA用GitHub Pages一時プレビュー設計

**状態:** ユーザー承認済み
**承認日:** 2026-07-28
**対象ブランチ:** `codex/big-five-q006`

## 1. 目的

現在のES Modules版正式アプリをGitHub Pages上の公開URLで動かし、実装済みの診断本体、結果、履歴、比較、削除をPCとスマートフォンの実ブラウザで一通り確認できるようにする。

このプレビューはQA専用であり、approved release、JSON runtime、正式なPages CI/CD、監視、切り戻しを成立させるT-011のproduction deploymentではない。

## 2. 公開範囲

- URLを知っている人は閲覧できる公開プレビューとする。
- 回答、途中経過、診断結果、履歴はブラウザの`localStorage`だけに保存する。
- 通常モードの`betaAggregationEnabled: false`、`betaApiBaseUrl: null`、CSPの`connect-src 'none'`を維持する。
- `robots.txt`の全拒否と`<meta name="robots" content="noindex,nofollow">`を配布時に追加し、検索エンジンへの掲載を抑制する。ただし、アクセス制御としては扱わない。

## 3. 対象範囲

### 3.1 QA対象

- 診断開始、途中保存、再開、新規開始
- 20問回答と「簡易プレビューを見る」「結果を見ず50問へ進む」の分岐
- 20問簡易プレビューと追加30問への継続
- 50問詳細結果
- 採点、称号判定、承認済み`result-text-v1`
- レーダーチャート、5因子表示、結果文の開閉
- 該当キャラクター1体の遅延読込と画像失敗時の代替表示
- 結果履歴、保存済み結果の再表示、互換結果2件の比較
- 個別削除、全データ削除
- 320px、360px、960pxを代表とするレスポンシブ表示
- キーボード操作、focus復帰、dialog fallbackなど実ブラウザで到達できるアクセシビリティ挙動

### 3.2 QA対象外

- 共有カード、画像保存、Web Share、Clipboard
- Q-013の色・香り
- `result-text-v2`の`titleReflection`
- ベータ匿名集計API
- approved CSV releaseからのJSON runtime
- production Pagesの監視、正式な切り戻し、カスタムドメイン
- 意図的な保存失敗、Canvas失敗、破損データなど通常操作で再現できない異常系

QA対象外の異常系は既存の自動テストで検証し、一時プレビューだけでMVP受入完了とは判定しない。

## 4. 採用方式

QA専用GitHub Actions workflowが検証済みartifactをGitHub Pagesへ配置する。

ブランチ直下をPagesの公開元にする方式は採用しない。リポジトリ直下には`content/source/`、文書、テスト、承認記録が含まれ、QAに不要なファイルまで配信対象になり得るためである。

外部プレビューサービスも使用しない。今回の目的はGitHubからのホスティング確認であり、サービスと運用経路を増やさない。

## 5. 構成

### 5.1 Artifact assembler

QA専用assemblerは次の入力だけを一時出力ディレクトリへコピーする。

| 入力 | 出力 | 許容内容 |
|---|---|---|
| `app/index.html` | `index.html` | `noindex,nofollow`を追加したHTML |
| `app/css/` | `css/` | `.css` |
| `app/js/` | `js/` | `.js` |
| `app/assets/characters/` | `assets/characters/` | `.webp` |

assembler自身が`.nojekyll`と次の`robots.txt`を生成する。

```text
User-agent: *
Disallow: /
```

次をartifactへ含めない。

- `content/`とCSV
- `docs/`
- `app/tests/`
- `app/dev-server.mjs`
- 制作元PNG、制作台帳、承認メモ
- Git管理情報、ローカルパス、秘密情報
- source map、ログ、一時ファイル

assemblerは出力先を毎回空の一時ディレクトリとして作り、許容外の拡張子、symlink、出力先外への解決、必須ファイル不足をエラーにする。生成後にartifact全体を再走査し、許容pathだけであることを確認する。

### 5.2 GitHub Actions

`.github/workflows/qa-preview-pages.yml`を追加する。

- `codex/big-five-q006`へのpushで実行する。
- 現在ブランチではpushを初回deploymentの起点とし、失敗した同一runはGitHub Actions画面から再実行する。
- `workflow_dispatch`も定義するが、workflowがdefault branchに存在しない間は手動起動の主経路として扱わない。
- `contents: read`、`pages: write`、`id-token: write`だけを付与する。
- Node.jsの固定major版を指定する。
- `npm test`、`npm run check`、QA artifact test、artifact assemblyの順で実行する。
- 検証またはassemblyが失敗した場合はuploadとdeployを行わない。
- `actions/upload-pages-artifact`へQA出力ディレクトリだけを渡す。
- deploy jobはverify/build jobの成功へ依存させる。
- GitHub Pagesの`github-pages` environmentとdeployment URLを使用する。
- 同一ブランチの古い実行をconcurrencyで取消し、最新の成功だけを公開候補にする。

GitHub Pagesの公開元がGitHub Actionsになっていない場合、最初のdeployment前にRepository Settingsで設定する。既存のPagesサイトが存在する場合、このQA deploymentが同じproject siteを置き換えるため、既存公開物の有無を確認してから有効化する。

### 5.3 URLとsubpath

Pages project siteの`/big-five/`配下で動作することを前提とする。`index.html`のCSSとmodule参照、ES Modules間のimport、キャラクターpathは相対URLを維持する。画面遷移は既存のhash routingを使い、GitHub Pagesへのサーバー側route要求を発生させない。

## 6. データとセキュリティ

- QA workflowはsecretを要求しない。
- 通常版は外部へ回答、結果、履歴を送信しない。
- Pages artifactへ生回答や利用者データを含めない。
- 診断中のデータは利用者のブラウザorigin単位の`localStorage`へ保存する。
- 別端末、別ブラウザ、別originの間で履歴を共有しない。
- ブラウザのサイトデータ削除またはアプリ内の全削除で端末内データを削除できる。

## 7. 失敗時処理

- test、check、assembly、artifact auditのいずれかが失敗した場合、Pages deploymentを実行しない。
- GitHub Pages設定不足でdeploymentが失敗した場合、コードを変更せず設定を確認して同じcommitを再実行する。
- 公開後に不具合が見つかった場合、安全なcommitへ戻して再deployする。
- 一時プレビューを終了する場合はworkflowの自動実行を停止し、GitHub Pages設定から公開を解除する。workflow削除だけでは最後の公開artifactが消えないため、公開解除を終了条件に含める。

## 8. 検証

### 8.1 自動検証

- assemblerの許可path、禁止path、必須ファイル、symlink、決定性
- `noindex,nofollow`、`robots.txt`、`.nojekyll`
- workflowのtrigger、最小権限、検証依存、upload対象、deploy依存
- `npm test`
- `npm run check`
- `git diff --check`

### 8.2 ローカルartifact smoke

生成artifactだけを静的serverで配信し、次を確認する。

- `/`が200でHTMLを返す。
- CSSとmain moduleが取得できる。
- hash routeで開始画面を表示できる。
- キャラクターWebPを1件取得できる。
- artifact外の`/content/source/`、`/docs/`、`/tests/`が取得できない。

### 8.3 公開後QA

- PCとスマートフォンで開始から20問結果まで完走する。
- 20問結果を見ずに50問へ進む経路を完走する。
- 20問結果を見てから追加30問へ進む経路を完走する。
- 途中保存、再読込、再開を確認する。
- 20問と50問の履歴を保存し、保存結果を再表示する。
- 互換結果2件を比較する。
- 個別削除と全削除を確認する。
- 画面幅、keyboard、dialog、横overflow、console errorを確認する。
- Networkで回答・結果の外部送信がないことを確認する。

## 9. 文書同期

- QA URL、公開手順、確認項目、停止手順を`docs/qa-preview-pages.md`へ記録する。
- `docs/tasks.md`へQA一時プレビューの実装状態を追記し、T-011 production deploymentとは分離する。
- `docs/tasks.md`のF-005／F-006に残る`result-text-v1 Content Approval pending`を、2026-07-28完了へ同期する。`titleReflection` pendingは維持する。
- approved release未選択、Q-012正式release未完了、Q-013 production data未作成を変更しない。

## 10. 完了条件

- QA artifactが許容runtimeファイルだけで構成されている。
- 全自動検証が成功している。
- `codex/big-five-q006`のcommitからGitHub Pages deploymentが成功している。
- 公開URLで開始、回答、20問／50問結果、履歴、比較、削除を確認できる。
- 外部送信0件と`localStorage`保存を確認できる。
- 未実装機能とproduction releaseを完了扱いにしていない。
- QA URL、確認結果、停止方法が文書化されている。
