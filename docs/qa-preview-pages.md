# QA用GitHub Pages一時プレビュー

## 目的と範囲

このURLは現行のES Modules実装をブラウザ確認するためのQA一時公開である。Q-013のP-0〜P-6人手承認、`presentation-v2` ES Modules runtime、結果DOM、共有Canvasへの接続は完了しているが、approved JSON releaseの選択、JSON runtime、Q-012正式release、T-011本番デプロイの完了を意味しない。

## URL

https://gerupon-lgtm.github.io/big-five/

- 正式確認URL: https://kokoro.sikumilab.com/
- QA対象commit: `d1e761a4b09337e76517b187fd292cbe1166401e`
- branch: `main`
- Actions: https://github.com/gerupon-lgtm/big-five/actions/runs/34079171877
- 2026-09-07確認: PR #31をmainへマージし、build／deploy成功。最終連携IDの保存後に履歴DOMを更新せず外部遷移していたため、古いカード表示が復元される環境では手動更新が必要だった。通常履歴・連携用履歴ではID保存直後かつ外部遷移前に現在ルートを同期再描画するよう修正し、クリック直後・画面更新イベント前の`連携済`表示を回帰テストへ追加した。正式確認URLのHTML、`app-meta.js`、app shellがHTTP 200で、`mvp-1.3.4`と即時再描画処理を配信していることを確認した。ローカル対象5ファイル101件、静的検証、コンテンツ検証エラー0、QA成果物127ファイルを確認済み
- 直前の公開記録: commit `9d0db7db46e41a2cddeffa2eb9d329f49c41e808`、Actions run `34077112987`で`mvp-1.3.3`を公開。最後に渡した50問詳細結果1件だけへの`連携済`表示、アイコン配信、BFCache復元時の再描画を確認済み
- それ以前の公開記録: commit `301f0dcb49d47caddacea84f4bb3d5a2c8555c1c`、Actions run `34020401043`で`mvp-1.3.2`を公開。390×844の実ブラウザで回答進捗、50問完答までの遷移、横overflow 0、console error／warning 0を確認済み

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
- 50問完答確認からの結果確定、回答見直し、見直し中の任意位置からの「回答を完了する」
- 20問結果で`振り返りのヒント`が1件だけ表示され、展開操作がないこと
- 50問結果で1件目が表示され、`ほかのヒントを見る`から残り2件をまとめて開閉できること
- 振り返りがない旧履歴またはゼロ-reflection fallbackでも、称号・因子・7件／42件の結果文を維持すること
- レーダー、結果文、共有の代替表示、履歴結果、保存画面
- 履歴、途中保存、結果保存の表示確認と、互換結果2件の比較
- 個別削除、全削除
- 320px、360px、960px、keyboard、dialog、横overflow
- DevTools Networkで通常版の診断フローの外部通信0件
- console error・warning 0件

共有カード、共有テキスト、色・香りの結果DOM、approved JSON release選択、Q-012正式releaseは対象外とする。`presentation-v2` ES Modules runtime自体は生成・接続済みである。`titleReflection`は共有候補抽出の純粋境界で除外済みだが、実際の共有UIはT-007未実装のため、このQAでは共有物への非混入をブラウザ確認できない。

## `result-text-v2`追加QAの状態

`result-text-v2`のpreview 8件、detail 45件、ゼロ-reflection fallback 7件／42件、部分的な振り返りsnapshotの拒否は自動テストで確認済みである。2026-07-30のローカル実ブラウザQAでは、20問回答からpreview、追加30問、detailまで通し、previewはヒント1件だけ、detailは1件＋`ほかのヒントを見る`で追加2件を一括展開することを確認した。表示順は称号理由、振り返り、5因子で、開閉はnative button、`aria-expanded`、focusを維持する。320px、360px、960pxはいずれも横overflowなし、console error／warning 0件だった。共有候補からの除外は自動テストで確認済みだが、T-007共有UI未実装のため共有物のブラウザ確認は行っていない。commit `2e8ac66`のPages build／deployと公開assetのHTTP 200・v2内容を確認し、この追加QAを完了した。

## Redeploy

`main`は保護ルールに従ってPull Request経由で更新し、`Deploy QA preview to Pages`を`main`指定で手動起動してRedeployする。失敗したrunはActions画面から原因を確認する。

## 非公開

1. QA workflowのbranch push triggerを無効化またはworkflowを停止する。
2. `Settings` → `Pages`でサイトの公開を解除する。
3. 公開URLが利用できないことを確認する。

workflowファイルを無効化するだけでは最後のartifactが公開されたままになるため、Pagesの公開設定まで解除する。
