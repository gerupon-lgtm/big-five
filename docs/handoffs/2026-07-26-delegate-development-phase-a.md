# delegate-development Phase A完了・アプリ開発再開handoff

- 作成日: 2026-07-26
- 作業branch: `codex/big-five-q006`
- 採用スキルcommit: `bdc9af2`
- 配布記録: `_verify/skill-evals/delegate-development/reports/2026-07-26-distribution-record.md`
- 比較レポート: `_verify/skill-evals/delegate-development/reports/2026-07-26-baseline-candidate-comparison.md`
- Codex読取権限の修正指示: `_verify/skill-evals/delegate-development/reports/2026-07-26-codex-installed-skill-read-access-correction.md`
- Windows linked worktree helperの修正指示: `_verify/skill-evals/delegate-development/reports/2026-07-27-windows-wsl-worktree-helper-correction-instructions.md`
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
- Codexの通常sandboxからインストール済み`SKILL.md`を読めなかった原因は、
  配下17項目中11ファイルでWindows ACL継承が無効だったことである。2026-07-27に
  `C:\Users\user\.codex\skills\delegate-development`内だけで継承を有効化し、
  `SKILL.md`、必須references、必要scriptsの通常read全8件成功、
  ACL継承無効0件を確認した。platform側read-only権限伝播を実原因とした初期結論は
  失効し、修正・再発防止は
  `_verify/skill-evals/delegate-development/reports/2026-07-26-codex-installed-skill-read-access-correction.md`
  へ記録した。Claude配布先の通常sandbox読取りは別環境で未検証のままである。
- Windows版Codexの標準`bash.exe`はWSLを起動するため、Windows Gitで作成したlinked
  worktreeの`.git`参照をWSL Gitが解決できず、`sdd-workspace`、`task-brief`、
  `review-package`が`SDD_PLAN_NOT_IN_GIT_WORKTREE`で停止することを実運用で確認した。
  本体作業は同等のPowerShell手順で継続し、PowerShell helper同梱、失敗理由の分離、
  Windows linked worktree回帰を
  `_verify/skill-evals/delegate-development/reports/2026-07-27-windows-wsl-worktree-helper-correction-instructions.md`
  へ修正指示として記録した。配布済みスキル本体は上書きしていない。

## アプリ状態

- Q-006の実装・独立レビューは完了済み。
- Q-006の人手Content Approvalは引き続きpending。
- handoff作成時はS-003/S-004結果画面、本番完答caller、ResultSnapshot保存、旧`progress-storage` schema統合が未実装だった。再開後にResultSnapshot保存・履歴・削除・比較基盤、S-006/S-007、live／保存済みS-003/S-004、S-001/S-002 controller、本番完答callerまで実装した。保存済みpreviewの追加30問、保存失敗時live結果、完答時の回答参照破棄も接続済みである。T-007共有とQ-013の代替色・香りが残っている。
- Q-012は全51体についてproject-ownerの原画・WebP・alt承認、正典source PNG、固定条件の1024px WebP、SHA-256・寸法・容量を含む制作台帳を完成し、全行を`released`へ更新した。制作来歴候補と高度に生成した再利用可能コンポーネントも保管済みである。51件のrelease manifest、孤児・integrity検査、該当1体のviewport遅延loader、live／保存済み結果画面の成功・失敗表示、360px・200%相当の実ブラウザ確認まで完了した。Q-013演出データと共有は各計画と人手ゲートを維持する。

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

再開後、4件すべてを`docs/data-model.md`と`docs/processing-design.md`で契約化し、ResultSnapshotのexact validator、RFC 4122 UUID、結果保存、完答時の原子的削除・best-effort cleanup、履歴読込、個別・全削除、比較純粋関数、S-006/S-007、live／保存済みS-003/S-004、S-001/S-002 controllerを実装した。live callerは選択されたQ-012 manifest entryの`assetVersion`を使い、`characterManifestVersion`の流用や仮値を拒否する。TitleProfileの`defaultPaletteId`だけをQ-013前の初期色として使用する。delegate-developmentの独立レビューでは、入力manifest凍結、保存済みpreviewの無反応、hashchange二重描画を検出して修正し、集中41件・全413件・静的検証に成功した。360px／320px狭幅、選択猫1体、通常外部資産0件、強制storage失敗のlive結果維持を実ブラウザで確認した。残作業はT-007共有、Q-006人手Content Approval、Q-013実データ統合である。

## 再開手順

1. 新しい開発チャットで、インストール済み`delegate-development`の`SKILL.md`ハッシュが配布記録と一致することを確認する。
2. `docs/tasks.md`、`docs/data-model.md`、`docs/processing-design.md`、Q-012/Q-013/T-005計画を読む。
3. Q-006人手Content ApprovalとQ-013実データの入力品質ゲートを維持する。承認済みデータが揃うまで代替色・香りUIへ進めず、独立して進められるT-007共有またはT-008説明を次の実装単位にする。
4. 委譲する場合は、共有契約表、レビュー終了条件、約60秒の進捗通知、人手承認分離を使う。
5. 3〜5タスク後に、差し戻し、監督修正、スコープ外変更、進捗通知を再評価する。
