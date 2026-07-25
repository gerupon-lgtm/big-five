# delegate-development baseline / candidate 比較契約

- 評価日: 2026-07-26
- baseline配布元: `C:\Users\user\Documents\skills-work\delegate-development`
- baseline commit: `20ff4a8`
- initial candidate commit: `164fcc8`
- final candidate commit: `d323b79`
- candidate正典: `tools/skills/delegate-development/`
- live production書込み: なし
- 相互出力の共有: なし

## 固定条件

- 同じ実タスク、対象リポジトリ、読取範囲、検索上限、出力上限を使う。
- 同じモデル系統・推論条件の新しい担当を使い、会話履歴を渡さない。
- baseline担当は配布元だけ、candidate担当は候補版だけを読む。
- アプリ、配布元、インストール済みスキルを変更しない。
- トークン使用量や実行時間を取得できない場合は推測しない。

## 実タスク

旧generic結果保存schemaをproduction 13-field `ResultSnapshot`へ統合し、完答後の結果保存callerと`ProgressRecord`削除境界を実装する次作業について、委譲可否、ブロッカー、分割、コンテキストパック、レビュー条件を作る。

S-003/S-004 UI、キャラクター画像、演出データは範囲外とする。生回答と`diagnosisId`を結果履歴へ含めない。正典にない承認状態を推測しない。

## 回帰ケース

候補版`evals/evals.json`の既存14件と追加9件を使う。追加ケースは次を対象とする。

1. 監督指示と正典の矛盾
2. 機械レビューと人手承認の分離
3. sectionとclaim kindの契約
4. 部分入力の許容範囲
5. レビュー指摘の所有分類
6. 長時間作業の進捗通知
7. 同じ担当への2回目の差し戻し
8. Windowsのshell・パス・文字コード差
9. includes成功後の表行・責務矛盾

## 採用条件

- Criticalを増やさない。
- 必須ゲート違反を増やさない。
- スコープ外変更を増やさない。
- 人手承認の誤認を増やさない。
- 品質を維持または改善する。
- 差し戻し、監督修正、実質時間のいずれかを改善する。
- 進捗通知を改善する。

比較結果は、改善、悪化、未評価、残リスクを分けて記録する。採用承認前に配布元またはインストール先へ書き戻さない。
