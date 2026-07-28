# delegate-development Windows worktree helper correction instructions

## 結果

`delegate-development`の必須ヘルパーをWindows版Codexから実行したところ、標準の`bash.exe`はWSLを起動するため、Windows Gitで作られたworktreeの`.git`参照をWSL Gitが解決できず、`SDD_PLAN_NOT_IN_GIT_WORKTREE`で停止した。

## 再現条件

- OS: Windows
- worktree: Windows Gitで作成したlinked worktree
- 呼出元: PowerShell
- `bash`: `C:\WINDOWS\system32\bash.exe`（WSL）
- 実行対象: `scripts/sdd-workspace`、`scripts/task-brief`

Windowsパスを`/mnt/c/...`へ変換しても、linked worktreeの`.git`ファイルが保持するWindows形式のgitdir参照をWSL Gitが解決できない。

## 修正指示

1. PowerShell版の`sdd-workspace.ps1`、`task-brief.ps1`、`review-package.ps1`を同梱する。
2. WindowsではPowerShell版を正規経路とし、Git Bashが明示的に利用可能な場合だけ`.sh`版を許可する。
3. `.sh`版が`WSL_INTEROP`または`WSL_DISTRO_NAME`を検出し、対象がlinked worktreeなら、実行前にWindows形式のgitdirをWSLパスへ解決するか、`SDD_WINDOWS_LINKED_WORKTREE_UNSUPPORTED`としてPowerShell版の正確なコマンドを表示する。
4. `SDD_PLAN_NOT_IN_GIT_WORKTREE`へ畳み込まず、`git rev-parse`の失敗理由を診断出力へ残す。
5. Windows通常checkout、Windows linked worktree、Git Bash、WSL内ネイティブrepoの4ケースを回帰テストへ追加する。

## 暫定回避

PowerShellでplan見出しを抽出し、同じ`.superpowers/sdd/{plan-slug}/`へブリーフを生成する。Git差分パッケージもWindows Gitの`git log`、`git diff --stat`、`git diff -U10`から同形式で生成する。

## 変更ファイル

- 本書のみ。配布済みスキル本体は上書きしない。

## 実行した検証と結果

- `bash C:/.../sdd-workspace`: WSLからWindowsパスを参照できず失敗。
- `bash /mnt/c/.../sdd-workspace`: `SDD_PLAN_NOT_IN_GIT_WORKTREE`で失敗。
- 同じworktreeに対するWindows Gitの`rev-parse`と通常操作: 成功。

## 判断したこと

システム／配布済みスキルは直接上書きせず、修正指示を正典リポジトリへ記録する。本体開発では同等のPowerShell手順で継続する。

## 未解決・リスク

配布元へ修正が反映されるまで、Windows linked worktreeでは3ヘルパーの手動代替が必要である。

## 2026-07-28 Codex通常sandboxでの追加再現

### 結果

Windows Git Bashを絶対パスで明示して`delegate-development`同梱の
`sdd-workspace`をlinked worktreeから実行しても、Codex通常sandboxでは
worktree内の`.superpowers/sdd/`を作成できなかった。PowerShellで同じ
worktree内へ限定作成する暫定回避が必要だった。

### 再現コマンドと出力

```powershell
& 'C:\Program Files\Git\bin\bash.exe' `
  'C:\Users\user\.codex\skills\delegate-development\scripts\sdd-workspace' `
  'docs/superpowers/plans/2026-07-28-questionnaire-typography.md'
```

```text
/usr/bin/mkdir: cannot create directory ‘/c/Users/user’: Permission denied
```

同じ実行主体・worktreeで、`review-package`はsandbox外実行へ切り替えると
`.superpowers/sdd/2026-07-28-questionnaire-typography/`へ生成できた。

### 修正指示への追記

1. PowerShell版3 helperをWindowsの正規経路として同梱し、Codex通常sandboxで
   linked worktree内の生成先へ書き込める回帰を追加する。
2. `.sh`版がMSYS形式`/c/...`の生成先でpermission deniedになった場合は、
   一般的な`mkdir`失敗へ畳み込まず、PowerShell版の正確な代替コマンドと
   解決済みWindows pathを表示する。
3. Windows helperの成功条件へ「sandbox外権限を要求しない」を追加する。

### 判断

本件はアプリ実装の不具合へ読み替えず、配布済みskillを直接変更しない。
正典worktreeではPowerShellによる限定作成を使って本体作業を継続する。
