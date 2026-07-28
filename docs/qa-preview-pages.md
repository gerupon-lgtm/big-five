# QA用GitHub Pages一時プレビュー

## 目的と範囲

このURLは現行のES Modules実装をブラウザ確認するためのQA一時公開である。approved releaseの選択、JSON runtime、Q-012正式release、Q-013 production data、T-011本番デプロイの完了を意味しない。

## URL

https://gerupon-lgtm.github.io/big-five/

## 初期設定

1. GitHubの`gerupon-lgtm/big-five`を開く。
2. `Settings` → `Pages`を開く。
3. `Build and deployment`のSourceを`GitHub Actions`にする。
4. `Actions`で`Deploy QA preview to Pages`の最新runを確認する。
5. `build`と`deploy`が成功した後、Deployment URLを開く。

既存のPagesサイトがある場合も、上記URLが表示されることを確認してからQAを始める。

## 前提と注意

回答、途中保存、履歴はブラウザの`localStorage`だけに保存する。通常版の診断フローでは外部通信0件であり、検証ブラウザへ既存データを残さない。

## QAチェック

- 新規開始、途中保存、再開、破棄
- 20問回答後のプレビュー選択
- 結果を見ずに50問へ進む動作
- 20問結果から追加30問へ進む動作
- 50問完答後の詳細結果
- レーダー、結果文、共有の代替表示、履歴結果、保存画面
- 履歴、途中保存、結果保存の表示確認と、互換結果2件の比較
- 個別削除、全削除
- 320px、360px、960px、keyboard、dialog、横overflow
- DevTools Networkで通常版の診断フローの外部通信0件
- console error・warning 0件

共有カード、香り、`titleReflection`、データ承認の未完了事項は対象外とする。

## Redeploy

`codex/big-five-q006`へQA対象の変更をpushすると、対象ブランチの更新後にRedeployする。失敗したrunはActions画面から原因を確認する。

## 非公開

1. QA workflowのbranch push triggerを無効化またはworkflowを停止する。
2. `Settings` → `Pages`でサイトの公開を解除する。
3. 公開URLが利用できないことを確認する。

workflowファイルを無効化するだけでは最後のartifactが公開されたままになるため、Pagesの公開設定まで解除する。
