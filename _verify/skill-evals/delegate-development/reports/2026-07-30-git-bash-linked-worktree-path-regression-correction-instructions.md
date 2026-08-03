# delegate-development Windows Git Bash linked worktree path regression 修正指示書

- 検出日: 2026-07-30
- 対象skill: `delegate-development`
- 対象helper: `scripts/sdd-workspace`
- 実行環境: Windows版Codex、PowerShell、Git for Windows、linked worktree、日本語を含むworktree path
- 関連既知指示書: `2026-07-27-windows-wsl-worktree-helper-correction-instructions.md`

## 結論

配布済み`delegate-development`の`sdd-workspace`にpath正規化欠落はない。`bash -x`のtraceでは、`plan_root`と`current_root`が`C:/...`で始まり、既存の`sdd_normalize_path`が両方を正しく`/c/...`へ変換し、`root`、`base`、`dir`も対象linked worktree配下の正しいPOSIX absolute pathになっている。

失敗箇所は`/usr/bin/mkdir -p /c/...`であり、Windows pathとして許可済みのworkspaceと同一場所を指すPOSIX drive aliasがsandboxのwrite許可判定で同一視されず拒否される。一方、同じhelperを権限拡張付きで実行すると成功し、正確なPOSIX workspace pathを返した。原因はsandboxとWindows Git Bashのpath-alias authorization interoperabilityであり、`cygpath`不足ではない。

インストール済みskillを直接修正しない。恒久対応はsandbox側で`/c/...`を許可済み`C:\...`へcanonicalizeする。sandbox側を直せない場合だけ、`Permission denied`を検出して同じ契約を持つnative PowerShell helperへfallbackする。

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

`bash -x`の要点:

```text
+ git rev-parse --show-toplevel
+ plan_root=C:/Users/user/Documents/診断系アプリ開発/.worktrees/big-five-q006
+ current_root=C:/Users/user/Documents/診断系アプリ開発/.worktrees/big-five-q006
+ sdd_normalize_path C:/Users/user/Documents/診断系アプリ開発/.worktrees/big-five-q006
+ root=/c/Users/user/Documents/診断系アプリ開発/.worktrees/big-five-q006
+ base=/c/Users/user/Documents/診断系アプリ開発/.worktrees/big-five-q006/.superpowers/sdd
+ dir=/c/Users/user/Documents/診断系アプリ開発/.worktrees/big-five-q006/.superpowers/sdd/2026-07-30-ai-literacy-tone-alignment
+ /usr/bin/mkdir -p /c/Users/user/Documents/診断系アプリ開発/.worktrees/big-five-q006/.superpowers/sdd/2026-07-30-ai-literacy-tone-alignment
/usr/bin/mkdir: cannot create directory ‘/c/Users/user’: Permission denied
```

同一helperを権限拡張付きで実行した実証:

```text
/c/Users/user/Documents/診断系アプリ開発/.worktrees/big-five-q006/.superpowers/sdd/2026-07-30-ai-literacy-tone-alignment
```

## 原因

Git Bash内のpath処理は正しい。`sdd_normalize_path`はdrive-letter pathをPOSIX absolute pathへ変換し、`mkdir`も対象worktree配下の`/c/.../.superpowers/sdd/...`を受け取っている。

通常sandboxはwrite許可rootをWindows表記`C:\Users\user\Documents\診断系アプリ開発`として管理しているが、Git Bash processが渡す同一場所のPOSIX alias `/c/Users/user/Documents/診断系アプリ開発`を許可rootへcanonicalizeできない。このためsandbox内だけ`mkdir`が`/c/Users/user`から拒否される。権限拡張付きの同一helperが無変更で成功することが、helperの正規化やpath組立ではなくauthorization境界の問題である証拠になる。

## 影響

- plan別workspaceを自動作成できない。
- `task-brief`と`review-package`も同じroot解決に依存するため、後続の委譲artifact作成が不安定になる。
- helper失敗を理由に別worktreeやrepository rootへartifactを出すと、plan分離とledger回復契約を壊す。
- 実装コードの品質やアプリの動作には直接影響しないが、委譲・レビュー手順を開始できない。
- 不要な`cygpath`追加へ誘導すると、既に正しい正規化処理を重複させ、真のsandbox許可問題を残す。

## 期待動作

Windows版Codexでは次のいずれかを正規経路として提供する。

1. sandboxがGit BashのPOSIX drive alias `/c/...`をWindows canonical path `C:\...`へ変換してから、既存のworkspace write許可と照合する。
2. `/usr/bin/mkdir`が`Permission denied`になった場合だけ、`sdd-workspace.ps1`、`task-brief.ps1`、`review-package.ps1`等のWindows native経路へfallbackする。

成功時、`sdd-workspace`は必ず次だけを返す。

```text
C:\Users\user\Documents\診断系アプリ開発\.worktrees\big-five-q006\.superpowers\sdd\2026-07-30-ai-literacy-tone-alignment
```

またはGit Bash上の同一場所:

```text
/c/Users/user/Documents/診断系アプリ開発/.worktrees/big-five-q006/.superpowers/sdd/2026-07-30-ai-literacy-tone-alignment
```

## 修正案

### 推奨: sandboxのpath alias canonicalization

- Git Bash processから受け取った`/c/...`を、authorization判定前に`C:\...`へcanonicalizeする。
- canonical pathが許可済みworkspace root配下なら、通常権限のままwriteを許可する。
- `..`、symlink、junction、case差を解決した最終pathで境界判定し、別driveやworkspace外へ許可を広げない。
- `sdd-workspace`、`task-brief`、`review-package`の既存POSIX path契約と出力を変更しない。

### 代替: Permission denied時だけnative PowerShell fallback

- 既存Git Bash helperを最初に実行し、`mkdir`の`Permission denied`だけをsandbox alias不整合候補として扱う。
- fallbackは`[System.IO.Path]::GetFullPath()`と`Join-Path`で同一worktree配下のplan別directoryを解決する。
- resolved pathが`<worktree>\.superpowers\sdd`配下であること、`.gitignore`の`*`、plan basename、ledger identityを既存helperと同じように検証する。
- `ENOENT`、invalid plan、root mismatch等の別エラーをPowerShell fallbackで隠さない。
- 権限拡張は原因確認の実証に留め、通常運用の回避策にしない。

## 回帰テスト

少なくとも次を自動化する。

1. 通常checkout、ASCII path
2. linked worktree、ASCII path
3. linked worktree、日本語を含むpath
4. plan file名に日本語を含むpath
5. `git rev-parse --show-toplevel`が`C:/...`を返し、`sdd_normalize_path`が`/c/...`を返すGit Bash
6. `git rev-parse --show-toplevel`が`/c/...`を返すGit Bash
7. sandbox内の`/c/...`が許可済み`C:\...`へcanonicalizeされ、権限拡張なしで成功すること
8. 許可root外の別drive、sibling directory、`..`経由は拒否されること
9. Permission denied時のPowerShell fallbackがある場合、Git Bash helperと同じdirectoryを返すこと
10. sibling planのworkspaceとledgerを変更しないこと
11. `.superpowers/sdd/.gitignore`が`*`を維持すること
12. 出力先が必ず対象worktree配下であること

## 合格条件

- 上記12ケースがすべて成功する。
- `sdd-workspace`、`task-brief`、`review-package`が同じplan別directoryを解決する。
- 日本語pathで文字化けしない。
- worktree外、repository root直下、`C:`という相対directoryへ出力しない。
- 通常sandbox内で権限拡張なしに成功する。
- 既存の正しい`sdd_normalize_path`へ重複した`cygpath`処理を追加しない。
- installed skillへの直接編集を回避策にしない。
