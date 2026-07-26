# Codexインストール済みskill read-only権限 修正指示書

- 作成日: 2026-07-26
- 対象境界: Codex skill loader / sandbox permission propagation
- 安定エラーコード: `DELEGATE_SKILL_ACCESS_DENIED`
- 今回の再現主体: `root`
- 状態: platform側未解消

## 位置付け

本書は、配布済み`delegate-development`の正典やインストール済みコピーを
修正する指示ではない。選択済みskill packageを通常sandboxから読めるようにする、
Codexのplatform adapter境界に対する修正指示である。

`delegate-development`側には、controller skillを子担当へ再読させない契約と、
実際に必要なskillを読めない場合に`DELEGATE_SKILL_ACCESS_DENIED`で停止する契約が
すでにある。しかし、skill自身はworkspace外の権限を変更できない。

## 症状

Codexへインストール済みの次のskill本文を、`workspace-write`の通常sandboxで
rootが読み取れない。

```text
C:\Users\user\.codex\skills\delegate-development\SKILL.md
```

同一ファイルに対する`Get-Item`等で存在を確認できる場合でも、
本文の`Get-Content`は`UnauthorizedAccessException` / `PermissionDenied`となる。
`require_escalated`で同一read operationを実行すると成功し、`SKILL.md`と
そこから必須指定されたreferencesを読了できる。

配布記録とhandoffにも同種事象が記録済みであり、今回の再現は少なくとも2回目で
ある。偶発的な一度限りの失敗として扱わない。

## 再現条件

- OS / shell: Windows / PowerShell
- cwd:
  `C:\Users\user\Documents\診断系アプリ開発`
- permission profile: `workspace-write`
- 通常read roots: workspaceと明示された一部read roots
- 対象role: `root`
- 対象skill: 選択済みのインストール済み`delegate-development`

今回失敗した対象は
`C:\Users\user\.codex\skills\delegate-development\SKILL.md`であり、パスはASCIIだけで
構成されている。cwdには日本語が含まれるが、ASCIIのinstalled pathでも同じ
権限エラーが発生するため、Windows日本語pathや文字コードを原因としない。
helperのdrive-letter / POSIX path変換問題とも別件である。

## 再現手順

1. `workspace-write`かつworkspace外の一般readを許可しない通常sandboxでCodexを
   起動する。
2. `delegate-development`を選択済みskillとして解決する。
3. rootから、昇格せずに次を実行する。

   ```powershell
   Get-Content -Raw -Encoding UTF8 -LiteralPath 'C:\Users\user\.codex\skills\delegate-development\SKILL.md'
   ```

4. `UnauthorizedAccessException` / `PermissionDenied`になることを確認する。
5. 同じpath、同じread operationを`require_escalated`で実行する。
6. 本文を読み取れること、および本文が必須指定するreferencesも読み取れることを
   確認する。

## 期待結果と実際の結果

### 期待結果

skill loaderが選択・解決したskill packageについて、rootの通常sandboxへ、その
package内だけの再帰的なread-only accessが伝播する。rootは昇格なしで
`SKILL.md`と必須referencesを読み、適用手順を遵守できる。書込み権限は付与されない。

### 実際の結果

skillは選択済みでも、workspace外にあるインストール済みpackageの本文readが
通常sandboxで拒否される。昇格すれば読めるため、ファイル欠落、配布不良、
文字コード不良ではなく、通常sandboxへread permissionが伝播していない。

## 影響

- rootが選択済みskillを完全に読めず、skill適用の開始条件を満たせない。
- 読めないまま適用成功として続行すると、必須references、禁止事項、報告契約を
  取りこぼすおそれがある。
- 毎回昇格readを要求すると、read-onlyで完結すべき標準skill利用が不要な承認へ
  依存する。
- 実際に別skillを必要とするimplementer / reviewerでも同じ権限伝播欠落があれば、
  担当作業を開始できない。
- controller skillである`delegate-development`を子担当へ再読させない契約自体は
  正しく、この不具合を理由に子担当へ再適用させてはならない。

## 暫定回避

根本修正まで、次の限定的な回避を認める。

1. rootが選択済みskillを正規loader経由で完全に読めない場合は、適用成功として
   続けず、`DELEGATE_SKILL_ACCESS_DENIED`で報告する。
2. 報告にはskill名、解決済み絶対path、role、permission profile、失敗したread
   operation、例外種別を含める。今回のroleは`root`とする。
3. rootがすでに`SKILL.md`と必須referencesを完全に読了済みであり、子担当が
   controller skillを必要としない場合だけ、task brief、共有契約表、report path、
   review packageなどのexactなtask artifactを渡して継続できる。
4. 読了に昇格readが必要な環境では、許可された`require_escalated`をreadだけに
   限定して使用する。
5. インストール済みskillを編集、複製、workspaceへ持ち込み、権限変更して回避しない。

## 根本修正案

修正箇所はCodex skill loaderとsandbox permission propagationの接続部とする。

1. skill loaderが選択済みskillを解決した時点で、package rootの正規化済み絶対pathを
   sandbox policy builderへ渡す。
2. sandbox policy builderは、その実行主体が実際に適用する選択済みpackage rootに
   限り、再帰的read-only allow ruleを生成する。
3. allow ruleは少なくとも`SKILL.md`、本文から参照される`references/`、必要な
   `scripts/`、`templates/`、`assets/`を同一package root内で読めるようにする。
4. symlink / junction / `..`によるpackage root外への逸脱を正規化後に拒否する。
5. read-only ruleをroot、implementer、reviewerへ一律にばらまかず、各実行主体が
   実際に選択・適用するskillだけへ付与する。controller skillを必要としない子担当へ
   `delegate-development`の再読を要求しない。
6. loaderで選択済みなのにpackage readを付与できない場合は、
   `DELEGATE_SKILL_ACCESS_DENIED`を安定して返し、skill名、解決済み絶対path、
   role、permission profile、read operation、例外種別を診断情報へ含める。
7. 診断情報にはファイル本文、機密、認証情報を含めない。取得できないtoken量や
   利用量を推測・記録しない。

## 拒否する修正

- `workspace-write`をホームディレクトリ全体や`.codex`全体へ拡張する。
- skill packageへwrite権限を与える。
- インストール済み`SKILL.md`やreferencesを直接編集する。
- packageをworkspaceへコピーし、別の正典として読む。
- controller skillをrootからimplementer / reviewerへ再適用・再読させる。
- 日本語path対応やhelper修正だけで本件を解消済みとする。

必要なのは、選択済みの正確なskill packageだけを読める最小権限であり、一般的な
workspace-write範囲の拡大ではない。

## 受入テスト

### A. 通常sandbox read

1. `workspace-write`の通常sandboxで`delegate-development`を選択する。
2. rootが昇格なしでinstalled `SKILL.md`をUTF-8 readできる。
3. rootが本文で必須指定されたpackage内referencesを昇格なしで読める。
4. 同じテストをASCII cwdと日本語を含むcwdで行い、どちらも成功する。
5. 未選択の別skill packageやpackage root外へのreadは、既存policyどおり許可されない。

合格条件: 通常sandbox readが成功し、`require_escalated`を必要としない。

### B. read-only保証

1. disposableなinstalled-skill fixtureを選択済みpackageとして用意する。
2. fixture内の`SKILL.md`と必須referenceのreadが成功する。
3. fixture内の既存ファイル更新、新規ファイル作成、削除、renameがすべて拒否される。
4. symlink / junctionでpackage root外を指すreadが拒否される。

合格条件: package内readだけが増え、write権限とpackage外read権限は増えない。
実配布コピーをwrite probeで変更しない。

### C. roleとcontroller契約

1. rootが`delegate-development`を選択し、通常sandboxで読了できる。
2. implementer / reviewerへはtask artifactだけを渡す。
3. implementer / reviewerがcontroller skillを再選択・再読しなくても、担当作業と
   報告契約を完了できる。
4. implementerまたはreviewerが別skillを実際に選択した場合は、その担当に限って
   選択済みpackageのread-only accessが付与される。
5. 意図的にread rule付与を失敗させ、role別に
   `DELEGATE_SKILL_ACCESS_DENIED`が安定して返ることを確認する。

合格条件: 今回のroot再現が解消し、子担当へcontroller skill再読を要求しない。

### D. 既存helper回帰

配布済みhelper hardeningの回帰一式を再実行する。

- Windows absolute helper path
- 日本語pathを含むlinked worktree
- planとcurrent worktreeの不一致拒否
- 1未満または非整数のTask番号拒否
- 空commit range / 空diff拒否
- `wc` / `tr`なしでのreview package本体検証
- WSLとMSYS / MINGW / Cygwinのdrive path mapping分離
- 正規配布元、Codex配布先、Claude配布先の対象ファイル整合

合格条件: 既存helper回帰がすべて成功し、今回のread-only rule追加がpath正規化、
helper起動、review package生成、配布整合を壊さない。

### E. エラー契約

1. package不存在、package root解決失敗、policy伝播失敗、read拒否を個別fixtureで
   発生させる。
2. 選択済みskillを読めないケースは`DELEGATE_SKILL_ACCESS_DENIED`へ正規化する。
3. 診断情報にskill名、絶対path、role、permission profile、read operation、
   例外種別があることを確認する。
4. 診断情報にskill本文、機密、認証情報、推測したtoken量がないことを確認する。

合格条件: 呼出側が文字列解析なしで同じ失敗を判定でき、安全な診断情報だけを
取得できる。

## 完了判定

次をすべて満たしたときだけplatform側解消とする。

- rootが通常sandboxから選択済みinstalled skill packageを読める。
- packageはread-onlyのままで、workspace-writeやホーム全体の権限を広げていない。
- implementer / reviewerへcontroller skillの再読を要求しない。
- `DELEGATE_SKILL_ACCESS_DENIED`の安定エラー契約がある。
- 既存helper回帰が成功する。
- 配布済みskillの正典・インストール済みコピーを変更していない。
