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
- 20問結果で`振り返りのヒント`が1件だけ表示され、展開操作がないこと
- 50問結果で1件目が表示され、`ほかのヒントを見る`から残り2件をまとめて開閉できること
- 振り返りがない旧履歴またはゼロ-reflection fallbackでも、称号・因子・7件／42件の結果文を維持すること
- レーダー、結果文、共有の代替表示、履歴結果、保存画面
- 履歴、途中保存、結果保存の表示確認と、互換結果2件の比較
- 個別削除、全削除
- 320px、360px、960px、keyboard、dialog、横overflow
- DevTools Networkで通常版の診断フローの外部通信0件
- console error・warning 0件

共有カード、共有テキスト、香り、approved release選択、Q-012正式release、Q-013 production dataは対象外とする。`titleReflection`は共有候補抽出の純粋境界で除外済みだが、実際の共有UIはT-007未実装のため、このQAでは共有物への非混入をブラウザ確認できない。

## `result-text-v2`追加QAの状態

`result-text-v2`のpreview 8件、detail 45件、ゼロ-reflection fallback 7件／42件、部分的な振り返りsnapshotの拒否は自動テストで確認済みである。2026-07-30のローカル実ブラウザQAでは、20問回答からpreview、追加30問、detailまで通し、previewはヒント1件だけ、detailは1件＋`ほかのヒントを見る`で追加2件を一括展開することを確認した。表示順は称号理由、振り返り、5因子で、開閉はnative button、`aria-expanded`、focusを維持する。320px、360px、960pxはいずれも横overflowなし、console error／warning 0件だった。共有候補からの除外は自動テストで確認済みだが、T-007共有UI未実装のため共有物のブラウザ確認は行っていない。QA対象変更をpushし、最新のPages deploymentで再確認してから公開URLの確認を完了扱いにする。

## Redeploy

`codex/big-five-q006`へQA対象の変更をpushすると、対象ブランチの更新後にRedeployする。失敗したrunはActions画面から原因を確認する。

## 非公開

1. QA workflowのbranch push triggerを無効化またはworkflowを停止する。
2. `Settings` → `Pages`でサイトの公開を解除する。
3. 公開URLが利用できないことを確認する。

workflowファイルを無効化するだけでは最後のartifactが公開されたままになるため、Pagesの公開設定まで解除する。
