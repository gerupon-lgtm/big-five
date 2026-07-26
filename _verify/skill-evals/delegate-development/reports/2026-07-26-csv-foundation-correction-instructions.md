# delegate-development 修正指示 — CSV foundation実行

## 対象

- skill: `delegate-development`
- adapter: Codex / Windows / PowerShell + Git Bash
- project shape: 日本語を含む絶対パス配下のlinked Git worktree
- observed on: 2026-07-26

## 確認済み不具合

`superpowers:subagent-driven-development`の既定workspace helperを
`delegate-development`のCodex adapterから利用した際、Git Bash内で取得した
Windows形式のrepository pathがPOSIX pathへ正規化されず、workspace作成が
失敗した。

確認した失敗の要点:

```text
sdd-workspace
mkdir: cannot create directory 'C:/Users/user': Permission denied
```

対象worktreeは有効なlinked worktreeで、アプリ実装、Git操作、明示した
`/c/Users/...`形式のtask brief・review package出力は正常だった。したがって
repository不良ではなく、Windows pathをPOSIX helperへ渡すadapter境界の問題と
分類する。

## 暫定回避

今回の実行では次で継続できた。

1. worktree内の`.superpowers/sdd/<plan>/`を明示的に作成する。
2. `task-brief`と`review-package`へ`/c/Users/...`形式の入力・出力パスを明示する。
3. ledgerとcontract artifactはworktree内へ限定する。

この回避はproject sourceや生成物の契約を変更しなかった。

## candidateへの修正指示

1. Codex adapterはWindowsでPOSIX shell helperを呼ぶ前に、drive-letter pathを
   `cygpath -u`相当で`/c/...`へ変換する。
2. `sdd-workspace`は`MSYS`/`MINGW`を検出し、`git rev-parse --show-toplevel`
   が`C:/...`を返した場合もPOSIX absolute pathへ正規化してから`mkdir`する。
3. path変換不能時はrepository不良と誤分類せず、PowerShell fallbackまたは
   明示`OUTFILE`利用手順を含む安定したadapter errorを返す。
4. 日本語・空白を含むpathを文字列分割せず、常に1引数として扱う。
5. helperの失敗後も、対象worktree・plan・output pathをread-only確認してから
   fallbackする。別worktreeやrepository rootへartifactを作らない。

## 回帰ケース

同一candidateで次を固定して検証する。

- Windows 11
- PowerShellからGit Bash helperを起動
- `C:\Users\user\Documents\診断系アプリ開発\.worktrees\big-five-q006`
- linked Git worktree
- 日本語を含むplan path

合格条件:

1. `sdd-workspace PLAN`がworktree内の
   `.superpowers/sdd/<plan-basename>/`を返す。
2. directory作成が成功し、repository rootや`C:`という相対directoryを作らない。
3. `task-brief`と`review-package`が既定出力先・明示出力先の両方で成功する。
4. Linux/macOSの既存POSIX path動作を回帰させない。
5. 失敗時のメッセージがshell、未変換path、fallback手順を示し、repository
   不良と断定しない。

## 採用境界

これは実行事実に基づくcandidate修正指示であり、インストール済みskillへの
直接変更ではない。現行版とcandidateを同じtask・モデル・権限・停止条件で
比較し、Windows回帰と非Windows回帰の両方が通った後にだけ配布候補とする。

## 追加確認: review-packageの暗黙coreutils依存

Task 5bの再レビューpackageを、Windowsの
`C:\Program Files\Git\bin\bash.exe`から明示output path付きで生成したところ、
diffファイル本体は正常に生成されたが、完了表示で次が発生した。

```text
review-package: line 46: wc: command not found
review-package: line 46: tr: command not found
wrote ...: 1 commit(s),  bytes
```

helperは終了コード0を返したため、呼出側は失敗を検知できず、出力バイト数だけが
欠落した。この環境ではGitとbashは利用可能でも、直接起動したbashの`PATH`に
coreutilsが入るとは限らない。

candidateでは次を満たすこと。

1. `wc`と`tr`を必須処理にしない。存在確認後に利用し、なければcommit数と
   output pathだけを表示して正常終了する。
2. 必須のpackage生成と任意の統計表示を分離する。package生成に失敗した場合だけ
   非0、統計取得だけ失敗した場合は明示したwarningまたは統計省略とする。
3. 成功時もoutput fileの存在と非0byteをhelper内部で確認する。
4. Windows Git Bashの最小`PATH`、通常Git Bash、Linux/macOSで回帰させる。
5. `wc`/`tr`がない環境で、` bytes`のような不完全な成功メッセージを出さない。

## 追加確認: 委譲先から配布済みskill本文を読めない

Task 8の実装担当をspawnした際、実装開始前に必須の
`delegate-development/SKILL.md`を読み取れないと報告された。監督者側でも
同じ絶対パスをPowerShellで確認すると、metadataは取得できる一方、本文読込は
次のエラーで再現した。

```text
Get-Item C:\Users\user\.codex\skills\delegate-development\SKILL.md
# success: file metadata is visible

Get-Content -LiteralPath C:\Users\user\.codex\skills\delegate-development\SKILL.md -Encoding UTF8
GetContentReaderUnauthorizedAccessError
UnauthorizedAccessException
```

対象skillはこのタスクでユーザーが明示した配布済みskillであり、選択済みskillの
`SKILL.md`を各担当が完全に読むという実行規約を満たせない。repositoryやtask
sourceの権限不足ではなく、workspace外に置かれたskill packageへのread-only
権限を子agentへ伝播できていないadapter/sandbox境界の問題と分類する。

### 暫定回避

1. 監督者が事前に読了したskill規約を維持する。
2. worktree内へ作成済みのtask brief、exact contract、review constraintだけを
   委譲先へ渡し、対象ファイルと停止条件を狭く固定する。
3. 委譲先からskill本文を推測させず、読込不能の事実と再現情報を報告させる。
4. インストール済みskillは直接変更しない。

### candidateへの修正指示

1. Codex adapterは、親agentが選択した配布済みskillのpackage rootへ、spawnした
   子agentにも同等のread-only accessを付与する。
2. 最低限、`SKILL.md`とそこから直接参照されるinstructions、scripts、templatesを
   読めるようにし、project sourceへのwrite権限とは分離する。
3. skill packageへのwrite権限は付与せず、read-onlyのまま維持する。
4. 読込不能時はsilent fallbackせず、skill名、解決済み絶対パス、agent種別、
   permission profile、失敗したread operationを含む安定エラーを返す。
5. 親agentだけ読めて子agentが読めない状態を、skill適用成功として扱わない。

### 回帰ケース

- Windows 11 / PowerShell
- skill path:
  `C:\Users\user\.codex\skills\delegate-development\SKILL.md`
- canonical repositoryは日本語path配下のlinked worktree
- root agentとspawnしたimplementer/reviewerの双方

合格条件:

1. root、implementer、reviewerが同じ`SKILL.md`を完全にread-onlyで読める。
2. referenced script/templateも同じ権限境界で読める。
3. skill packageへの作成・変更・削除は拒否される。
4. 読込失敗時はrepository不良と誤分類せず、権限境界を明示する。
5. Linux/macOSとworkspace内skillの既存動作を回帰させない。

## 2026-07-26 candidate実装・検証結果

リポジトリ内candidateへ次を実装した。

- `scripts/sdd-common.sh`でWindows drive-letter pathを`cygpath`優先、
  pure Bash fallbackでPOSIX absolute pathへ正規化する。
- `scripts/sdd-workspace`、`scripts/task-brief`、`scripts/review-package`を
  skillへ同梱し、plugin cacheの別skillへ依存しない。
- Git BashのPATHへcoreutilsが入らない場合も、`mkdir`と`awk`は
  `/usr/bin`を限定fallbackとして解決する。
- `review-package`は成果物の存在・非0byteを必須条件とし、`wc`がない場合は
  `REVIEW_PACKAGE_BYTE_COUNT_UNAVAILABLE`を返してbyte統計だけを省略する。
- Codex/Claude adapterは`delegate-development`をcontroller skillとして扱い、
  子担当へ再適用・再読込を要求せず、task brief、共有契約表、report path、
  review packageを渡す。
- 実際に必要なskill本文が読めない場合は
  `DELEGATE_SKILL_ACCESS_DENIED`として停止し、write権限追加で回避しない。

candidateの自動回帰では、日本語名を含む一時Git repositoryとlinked worktreeを
作り、Windows drive-letter入力、workspace作成、task brief抽出、通常のreview
package生成、`wc`/`tr`なしの最小PATH、POSIX path非回帰を確認した。
`skill-creator`の`quick_validate.py`もUTF-8モードで合格した。

### skill読込境界の残課題

親・子agentへworkspace外のインストール済みskill packageのread-only accessを
付与することは、skill本文やadapter文書から実装できないCodex sandbox側の責務で
ある。このためcandidateでは、controller skillを子担当へ不要に再読込させない
運用と、必要skillが読めない場合の安定した停止契約までを実装対象とした。

配布後もroot／implementer／reviewerが同じインストール済み`SKILL.md`を直接
読めるかは、配布ハッシュ確認とは分けて実環境で再確認する。読込不能が残る場合、
issue 1・2は修正済み、issue 3はskill側mitigation済み／platform側未解消として
記録し、解消済みとは扱わない。

## 2026-07-26 独立レビュー追補

初回candidateの配布前レビューでCritical 0、Important 4とforward test blocker 1を
検出したため、配布を止めて次を追加修正した。

1. PowerShellからhelper自身をWindows absolute pathでGit Bashへ渡した場合も、
   `BASH_SOURCE`をPOSIX化して同梱`sdd-common.sh`を解決する。
2. planのGit rootとcurrent linked worktree rootを比較し、異なる場合は
   `SDD_PLAN_WORKTREE_MISMATCH`で停止する。
3. WSLは`/mnt/<drive>/...`、MSYS/MINGW/Cygwinは`/<drive>/...`へ分け、
   未対応shellのdrive-letter pathを推測変換しない。
4. `TASK_NUMBER`を1以上の10進整数へ限定し、正規表現値やpath値を拒否する。
5. review packageの固定見出しではなく、commit範囲と実file diffを検証し、
   空rangeは`REVIEW_PACKAGE_EMPTY_RANGE`、空diffは
   `REVIEW_PACKAGE_EMPTY_DIFF`で停止する。

回帰fixtureはWindows absolute helper path、別worktree plan、不正Task番号、
空review range、WSL path mappingを追加した。修正後の同一回帰は成功した。

## 2026-07-26 配布結果

candidate commit `bdc9af2`を正規配布元
`C:\Users\user\Documents\skills-work\delegate-development`へ展開し、
そこからCodex／Claudeへ同期した。正規配布元と2配布先の対象13ファイルは
`skill_sync.py check`で全件`MATCH`となった。

正規配布元、Codex配布先、Claude配布先のそれぞれから
`evals/helper-regression.ps1`を実行し、全て成功した。SHA-256 manifestは
`C:\Users\user\Documents\skills-work\_verify\delegate-development-manifest-2026-07-26.json`
へ保存した。

通常sandboxからインストール済みCodex／Claudeの`SKILL.md`を直接読む操作は
引き続き`UnauthorizedAccessException`となる。配布自体とskill側mitigationは
完了したが、read-only権限伝播はplatform側未解消として残す。
