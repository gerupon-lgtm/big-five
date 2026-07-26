# delegate-development Phase A完了・アプリ開発再開handoff

- 作成日: 2026-07-26
- 作業branch: `codex/big-five-q006`
- 採用スキルcommit: `bdc9af2`
- 配布記録: `_verify/skill-evals/delegate-development/reports/2026-07-26-distribution-record.md`
- 比較レポート: `_verify/skill-evals/delegate-development/reports/2026-07-26-baseline-candidate-comparison.md`
- Codex読取権限の修正指示: `_verify/skill-evals/delegate-development/reports/2026-07-26-codex-installed-skill-read-access-correction.md`
- 再利用画像パーツ保管のスキル横断修正指示: `_verify/skill-evals/cross-skill/reports/2026-07-27-reusable-image-component-retention-correction-instructions.md`

## Phase A完了状態

- 配布元、Codex、Claudeへhelper hardening後のfinal candidateを配布済み。
- 3か所の13ファイルは同期ツール上でSHA-256一致。
- `quick_validate.py`成功。
- 正規配布元、Codex配布先、Claude配布先の各実体でWindows helper回帰成功。
- Codex新規実行主体のtrigger・契約衝突smoke成功。
- Claude実環境smokeは未実施。
- 配布前baselineは`C:\Users\user\Documents\skills-work\_backups\delegate-development\2026-07-26-before-d323b79`へ保存。
- 配布manifestは`C:\Users\user\Documents\skills-work\_verify\delegate-development-manifest-2026-07-26.json`。
- アプリ全テストは297件成功、静的検証成功。

## helper hardening追補

- Windows absolute helper path、日本語path、linked worktreeを同梱回帰で検証した。
- planとcurrent worktreeが異なる場合は`SDD_PLAN_WORKTREE_MISMATCH`で停止する。
- Task番号は1以上の整数へ限定し、空commit range・空diffを成功扱いしない。
- `wc`/`tr`がない場合もreview package本体を検証し、byte統計だけを明示省略する。
- WSLのdrive pathは`/mnt/<drive>/...`、MSYS/MINGW/Cygwinは
  `/<drive>/...`として分離する。
- controller skillを子担当へ再読込させない。実際に必要なskillが読めない場合は
  `DELEGATE_SKILL_ACCESS_DENIED`で停止する。
- 通常sandboxからworkspace外のインストール済み`SKILL.md`を直接読む操作は、
  Codex/Claudeとも`UnauthorizedAccessException`のまま。配布hashと実体回帰は
  escalated readで確認済みだが、read-only権限伝播はplatform側の残課題である。

## アプリ状態

- Q-006の実装・独立レビューは完了済み。
- Q-006の人手Content Approvalは引き続きpending。
- handoff作成時はS-003/S-004結果画面、本番完答caller、ResultSnapshot保存、旧`progress-storage` schema統合が未実装だった。再開後にResultSnapshot保存・履歴・削除・比較基盤、S-006/S-007初期画面、保存済みsnapshotの独立S-003/S-004表示、S-002の独立表示層まで実装した。router・state・storageへのS-002接続、完答caller、T-007共有が残っている。
- Q-012は51行制作台帳契約とbrief-stage実台帳まで実装・review済み。3体の透明PNGパイロットは生成・alpha確認済みだが、人手art/anatomy承認前なのでledger更新・commit・manifest登録を行っていない。Q-013演出データ、T-005 UIは各計画と人手ゲートを維持する。

## forward-testで検出した実装前blocker（再開後に解消）

ResultSnapshot永続化へ進む前に、次を正典・実装・test間で解消する。

1. `resultId`
   - データ設計・旧storage validator: RFC 4122 UUID
   - `createResultSnapshot`・正常test fixture: 任意の非空文字列
2. 保存失敗時の生データ
   - データ設計: 結果成立後、保存成否にかかわらず生回答を削除
   - 処理設計: 結果保存成功後にProgressRecordを削除し、失敗時はメモリ上の生回答を破棄
3. 保存済み13-field ResultSnapshotを検証する公開契約
4. 結果保存API、本番完答caller、戻り値、重複・保存失敗・削除失敗の状態行列

上記を推測で解決せず、共有契約表へ`confirmed / conflicting / unknown`で整理してから実装タスクを委譲する。

再開後、4件すべてを`docs/data-model.md`と`docs/processing-design.md`で契約化し、ResultSnapshotのexact validator、RFC 4122 UUID、結果保存、完答時の原子的削除・best-effort cleanup、履歴読込、個別・全削除、比較純粋関数、S-006/S-007初期画面、保存済みS-003/S-004と独立結果画面遷移、S-002表示層を実装した。追加調査でlive resultには選択されたQ-012 manifest entryの`assetVersion`が必須であり、`characterManifestVersion`の流用や仮値では正典準拠のsnapshotを作れないと確定した。残作業はQ-012パイロット・manifest作成後の本番caller、router・state・storageへのS-002接続、T-007共有、Q-013実データ統合である。

## 再開手順

1. 新しい開発チャットで、インストール済み`delegate-development`の`SKILL.md`ハッシュが配布記録と一致することを確認する。
2. `docs/tasks.md`、`docs/data-model.md`、`docs/processing-design.md`、Q-012/Q-013/T-005計画を読む。
3. 生成済みQ-012 3体パイロットを人手art/anatomy承認し、承認結果を制作台帳へ記録する。承認後にWebP変換・manifest entryの`assetVersion`を確定し、完答callerとrouter・state・storageへのS-002接続を実装する。Q-012/Q-013の未確定データへ触れる作業は入力品質ゲートで委譲せず、各制作・承認後に開始する。
4. 委譲する場合は、共有契約表、レビュー終了条件、約60秒の進捗通知、人手承認分離を使う。
5. 3〜5タスク後に、差し戻し、監督修正、スコープ外変更、進捗通知を再評価する。
