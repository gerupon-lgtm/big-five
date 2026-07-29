# delegate-development Windows Git Bash linked worktree path regression 修正指示書

- 検出日: 2026-07-30
- 対象skill: `delegate-development`
- 対象helper: `scripts/sdd-workspace`
- 実行環境: Windows版Codex、PowerShell、Git for Windows、linked worktree、日本語を含むworktree path
- 関連既知指示書: `2026-07-27-windows-wsl-worktree-helper-correction-instructions.md`

## 結論

配布済み`delegate-development`の`sdd-workspace`は、Windows Git Bashからlinked worktree内のplanを指定した場合、`git rev-parse --show-toplevel`が返すWindows形式pathをPOSIX形式へ正規化できず、workspace作成に失敗する。2026-07-27の修正指示で要求したPowerShell版helperまたは同等のWindows native経路が、2026-07-30時点の配布済みskillにまだ存在しない。

インストール済みコピーは直接修正しない。今回のアプリ開発では、同じplan basename、自己無視、ledger identity契約を維持したPowerShell fallbackで継続する。

## 再現手順

対象worktree:

```text
C:\Users\user\Documents\診断系アプリ開発\.worktrees\big-five-q006
```

対象plan:

```text
docs/superpowers/plans/2026-07-30-ai-literacy-tone-alignment.md
```

PowerShellからGit Bashを明示して実行:

```powershell
& 'C:\Program Files\Git\bin\bash.exe' -lc 'cd "/c/Users/user/Documents/診断系アプリ開発/.worktrees/big-five-q006" && "/c/Users/user/.codex/skills/delegate-development/scripts/sdd-workspace" "docs/superpowers/plans/2026-07-30-ai-literacy-tone-alignment.md"'
```

実出力:

```text
/usr/bin/mkdir: cannot create directory ‘/c/Users/user’: Permission denied
```

## 原因

`sdd-workspace`は次の値を直接連結する。

```sh
root=$(git rev-parse --show-toplevel)
base="$root/.superpowers/sdd"
```

Windows Gitが`root`へ`C:/Users/user/...`を返した場合、Git Bash上の`mkdir`はこれを`/c/Users/user/...`ではなく現在位置配下の`C:/Users/user/...`相当として扱う。結果としてworktree内ではなく`/c/Users/user`の作成を試み、通常sandboxで拒否される。

## 影響

- plan別workspaceを自動作成できない。
- `task-brief`と`review-package`も同じroot解決に依存するため、後続の委譲artifact作成が不安定になる。
- helper失敗を理由に別worktreeやrepository rootへartifactを出すと、plan分離とledger回復契約を壊す。
- 実装コードの品質やアプリの動作には直接影響しないが、委譲・レビュー手順を開始できない。

## 期待動作

Windows版Codexでは次のいずれかを正規経路として提供する。

1. `sdd-workspace.ps1`、`task-brief.ps1`、`review-package.ps1`
2. shell内で`cygpath -u -- "$root"`を用い、drive-letter pathをPOSIX absolute pathへ変換する経路

成功時、`sdd-workspace`は必ず次だけを返す。

```text
C:\Users\user\Documents\診断系アプリ開発\.worktrees\big-five-q006\.superpowers\sdd\2026-07-30-ai-literacy-tone-alignment
```

またはGit Bash上の同一場所:

```text
/c/Users/user/Documents/診断系アプリ開発/.worktrees/big-five-q006/.superpowers/sdd/2026-07-30-ai-literacy-tone-alignment
```

## 修正案

### 推奨: PowerShell版helper

- `git rev-parse --show-toplevel`の出力を`[System.IO.Path]::GetFullPath()`で正規化する。
- `Join-Path`で`.superpowers\sdd\<plan-basename>`を組み立てる。
- `New-Item -ItemType Directory -Force`でplan別directoryだけを作成する。
- `.superpowers\sdd\.gitignore`へ`*`を保存する。
- 出力前にresolved pathが`<worktree>\.superpowers\sdd`配下であることを検証する。
- `task-brief.ps1`と`review-package.ps1`も同じresolverを共有する。

### Git Bash fallback

```sh
root=$(git rev-parse --show-toplevel)
case "$root" in
  [A-Za-z]:/*) root=$(cygpath -u -- "$root") ;;
esac
```

変換後、`mkdir -p "$root/.superpowers/sdd/$slug"`を実行する。`cygpath`が存在しない環境では黙って続行せず、shell種別、変換前path、推奨PowerShell helperを含む安定エラーを返す。

## 回帰テスト

少なくとも次を自動化する。

1. 通常checkout、ASCII path
2. linked worktree、ASCII path
3. linked worktree、日本語を含むpath
4. plan file名に日本語を含むpath
5. `git rev-parse --show-toplevel`が`C:/...`を返すGit Bash
6. `git rev-parse --show-toplevel`が`/c/...`を返すGit Bash
7. PowerShellからhelperを起動する経路
8. sibling planのworkspaceとledgerを変更しないこと
9. `.superpowers/sdd/.gitignore`が`*`を維持すること
10. 出力先が必ず対象worktree配下であること

## 合格条件

- 上記10ケースがすべて成功する。
- `sdd-workspace`、`task-brief`、`review-package`が同じplan別directoryを解決する。
- 日本語pathで文字化けしない。
- worktree外、repository root直下、`C:`という相対directoryへ出力しない。
- 権限拡張やinstalled skillへの直接編集を回避策にしない。
