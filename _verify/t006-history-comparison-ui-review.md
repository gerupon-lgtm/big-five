# T-006 S-006/S-007画面統合レビュー

- 実施日: 2026-07-26
- 開始commit: `dd1ac02`
- 対象: T-006 / F-009 / F-010 / F-013 / F-015 / S-006 / S-007
- 使用スキル: `implement`、`tdd`、`code-review`

## TDD公開シーム

- `resolveRoute`
- `startApp`
- `loadResultHistory`、`deleteResultSnapshot`、`deleteAllData`
- `compareResultSnapshots`
- S-006/S-007の利用者表示と操作

ハッシュルート、空履歴、結果カード、比較候補、個別・全削除、比較表示、直接URLエラーを縦方向のred→greenで追加した。内部helperの形はテスト契約にしない。

## 2軸独立レビュー

| 軸 | 初回finding | 対応 |
|---|---:|---|
| Standards | P1 2件、P2 2件、P3 1件 | presentationのdata直接依存をcomposition root注入へ変更。正典を同期。表示helperと比較エラーcopyを共通化 |
| Spec | P1 1件、P2 3件 | 空履歴でも全削除可能、比較選択取消、ID不足URLの履歴復帰を実装 |

Specの「履歴から独立結果画面を開く」はS-003/S-004が未実装のためT-005依存として残す。履歴内では診断時文面を「詳細を開く」で展開できる。未実装を完了扱いにせず`docs/tasks.md`へ記録した。

再レビュー後に残った非ブロッキングのcontroller責務集中、fake DOM重複、薄いtest setupもreview-stage refactorで解消した。最終結果はStandards/Specともcleanである。

## 最終確認

- presentationはdomainだけを参照し、因子名・称号名はcomposition rootから注入する。
- 履歴0件でも途中回答を全削除できる。
- 比較1件目を再読込なしで解除できる。
- ID不足の`#/compare`は`#/history`へ戻る。
- 個別猫アセット版の差も表示表現差として示す。
- 生回答と内部エラーコードを画面へ露出しない。
