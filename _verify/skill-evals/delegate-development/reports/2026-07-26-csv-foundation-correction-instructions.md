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
