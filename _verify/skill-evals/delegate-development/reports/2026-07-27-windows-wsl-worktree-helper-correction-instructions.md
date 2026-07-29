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

## 2026-07-28 Windows `bash` 自動選択時の追加再現

### 結果

PowerShellからPATH上の`bash`を使って`sdd-workspace`を実行すると、
`C:\Windows\System32\bash.exe`（WSL launcher）が選択され、スクリプトへ
到達する前にWSL instance作成が`Bash/Service/CreateInstance/E_ACCESSDENIED`
で失敗した。

### 再現コマンドと出力

```powershell
where.exe bash
bash 'C:/Users/user/.codex/skills/delegate-development/scripts/sdd-workspace' `
  'docs/superpowers/plans/2026-07-27-result-progressive-disclosure.md'
```

```text
C:\Windows\System32\bash.exe
Bash/Service/CreateInstance/E_ACCESSDENIED
```

同じ環境には`C:\Program Files\Git\bin\bash.exe`が存在するため、PATH上の
`bash`を無条件に実行するだけでは、Git BashとWSL launcherを区別できない。

### 修正指示への追記

1. WindowsではPATH上の`bash`を正規経路にせず、PowerShell版helperを優先する。
2. `.sh`版を使う場合は、実行前に解決済み実体がGit BashかWSL launcherかを
   判定し、`System32\bash.exe`を自動選択しない。
3. WSL launcherの起動失敗をhelper本体の失敗へ畳み込まず、選択したshellの
   絶対path、`E_ACCESSDENIED`、PowerShell版の代替コマンドを表示する。
4. PATHの先頭が`C:\Windows\System32`で、Git Bashも別pathに存在する
   Windows環境を回帰ケースへ追加する。

### 判断

配布済みskillは変更せず、本作業では同じlinked worktree内だけを対象にした
PowerShell手順でworkspace、brief、review packageを生成する。

## 2026-07-29 UIトーン再設計worktreeでの再発

### 結果

設計承認済みの
`docs/superpowers/plans/2026-07-29-frontend-tone-and-shared-header.md`
を対象に、Git Bashの絶対pathを指定して配布済み`sdd-workspace`を実行したが、
2026-07-28と同じMSYS pathへの権限エラーが再発した。

### 再現環境

- worktree:
  `C:\Users\user\Documents\診断系アプリ開発\.worktrees\big-five-ui-tone-refresh`
- branch: `codex/big-five-ui-tone-refresh`
- shell: `C:\Program Files\Git\bin\bash.exe`
- helper:
  `C:\Users\user\.codex\skills\delegate-development\scripts\sdd-workspace`

### 再現コマンドと出力

```powershell
& 'C:\Program Files\Git\bin\bash.exe' `
  'C:\Users\user\.codex\skills\delegate-development\scripts\sdd-workspace' `
  'docs/superpowers/plans/2026-07-29-frontend-tone-and-shared-header.md'
```

```text
/usr/bin/mkdir: cannot create directory ‘/c/Users/user’: Permission denied
```

### 影響

- plan別workspaceとledgerをhelperで初期化できない。
- 同じ仕組みを使う`task-brief`と`review-package`も、Windows linked
  worktreeの通常sandboxでは同種の失敗が見込まれる。
- アプリの設計、実装、テストの不具合ではない。

### 修正指示

1. Windows正規経路となるPowerShell版`sdd-workspace.ps1`、
   `task-brief.ps1`、`review-package.ps1`を配布物へ追加する。
2. `.sh`版が解決した作成先をWindows pathとMSYS pathの両方で診断表示し、
   `mkdir`実行前に書込み可能性を確認する。
3. `/c/...`への`permission denied`を一般的なmkdir失敗にせず、
   `SDD_WINDOWS_SANDBOX_WRITE_DENIED`等の安定コード、解決済みWindows path、
   PowerShell版の正確な代替コマンドを出力する。
4. Codexの`workspace-write`環境で、通常checkoutとlinked worktreeの双方から
   `.superpowers/sdd/<plan>/`を追加権限なしで作成できる回帰テストを加える。

### 暫定回避と判断

配布済みskillは直接変更しない。アプリworktree内の
`.superpowers/sdd/2026-07-29-frontend-tone-and-shared-header/`だけを
PowerShellで限定作成し、briefとreview packageも同じworkspaceへ生成する。

## 2026-07-29 正典worktreeフォルダーのorphan化を検出

### 結果

後続作業の再開時、正典として指定されていた
`C:\Users\user\Documents\診断系アプリ開発\.worktrees\big-five-q006`
にはプロジェクトファイルとローカル生成物が残っていたが、`.git`管理情報が
存在せず、`git worktree list --porcelain`にも登録されていなかった。

この状態で同フォルダーから`git rev-parse --show-toplevel`を実行すると、
親の通常checkout
`C:\Users\user\Documents\診断系アプリ開発`
が返り、意図した`codex/big-five-q006`ではなく`main`を操作し得る状態だった。
orphan化の発生主体は現存証跡だけでは確定できないため、helperが直接削除した
とは断定しない。

### 影響

- plan別workspace、brief、review packageを誤ったcheckoutへ生成するおそれがある。
- status、commit、pushの対象branchを誤認するおそれがある。
- orphanフォルダー内の`.superpowers`、画像生成物、評価記録などを、空の
  worktree障害物として削除すると未追跡成果物を失う。

### 修正指示への追記

1. helperの開始時に、対象ディレクトリ直下の`.git`が存在すること、
   `git rev-parse --show-toplevel`の解決済みpathが対象ディレクトリと完全一致
   すること、`git worktree list --porcelain`に同じpathが存在することを確認する。
2. 対象ディレクトリが存在する一方で上記3条件のいずれかを満たさない場合、
   親リポジトリへフォールバックせず
   `SDD_ORPHAN_WORKTREE_DIRECTORY`で停止する。
3. 診断には対象path、検出した`.git`種別、解決されたtop-level、worktree登録
   有無を含める。復旧処理は自動実行せず、既存内容の退避を促す。
4. worktree作成・再利用helperでは、作成後にも同じ3条件と期待branchを
   postconditionとして検証する。失敗時は既存ディレクトリを削除しない。
5. 「内容のあるorphanディレクトリ」「親repo配下で`.git`なし」
   「登録済みlinked worktree」の3ケースをWindows回帰テストへ追加する。

### 暫定復旧と検証

ユーザー承認後、既存フォルダーを
`big-five-q006-orphan-backup-2026-07-29`へ削除せず退避し、元のpathへ
`origin/codex/big-five-q006`を追跡する正規worktreeを再作成した。

- `git worktree list --porcelain`: 正典pathと
  `refs/heads/codex/big-five-q006`の登録を確認。
- `git status --short --branch`: local branchとremote trackingの一致を確認。
- `git rev-parse HEAD`: `1b934b9d129f18cffae3edceb7fc50bdf53a045d`。
- orphan内だけにあったローカル生成物は退避先へ保持し、削除・上書きしていない。

### 判断

本件もアプリ不具合へ読み替えず、配布済みskillは直接変更しない。以後の作業は
復旧済み正典worktreeで行い、helper利用前にexact top-levelとworktree登録を
監督役が確認する。
