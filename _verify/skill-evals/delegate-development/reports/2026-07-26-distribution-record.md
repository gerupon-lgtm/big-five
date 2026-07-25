# delegate-development 配布記録

- 配布日: 2026-07-26
- 採用candidate commit: `d323b79`
- 比較レポートcommit: `cadeb54`
- 配布対象: 7ファイル

## 配布経路

1. 編集用正典  
   `C:\Users\user\Documents\診断系アプリ開発\.worktrees\big-five-q006\tools\skills\delegate-development`
2. 配布元  
   `C:\Users\user\Documents\skills-work\delegate-development`
3. Codex配布先  
   `C:\Users\user\.codex\skills\delegate-development`
4. Claude配布先  
   `C:\Users\user\.claude\skills\delegate-development`

編集用正典から配布元へ書き戻し、配布元からCodex・Claudeへ配布した。配布前後で対象ディレクトリの削除は行わず、確認済み7ファイルだけを上書きした。

## backup

配布前の配布元・Codex・Claude各コピー:

`C:\Users\user\Documents\skills-work\_backups\delegate-development\2026-07-26-before-d323b79`

backupは配布前baselineと同じ7ファイルを、`source`、`codex`、`claude`へ分けて保持する。

## 検証

- 配布前の3コピーはbaseline SHA-256と一致。
- 配布後の配布元・Codex・Claudeは、final candidateの7ファイルとすべてSHA-256一致。
- 配布元に対する`quick_validate.py`: `Skill is valid!`
- Codex新規実行主体smoke:
  - 基本設計なしの認証・DB移行を委譲しない。
  - UUID／非空文字列／fixtureの識別子衝突を検出する。
  - 生回答／進捗削除のライフサイクルを`conflicting/unknown`として扱う。
  - 衝突解消前のschema置換を委譲しない。
  - 読み取った`SKILL.md` SHA-256は`D9C8E0860C2BDEF9CF8154BCBD5E09A01733470272874A9D9EE17238536B9A00`。
- Claude配布先は構造・ハッシュ一致まで確認。Claude実環境でのtrigger smokeは未実施。

## 配布後SHA-256

```text
D9C8E0860C2BDEF9CF8154BCBD5E09A01733470272874A9D9EE17238536B9A00  SKILL.md
1C5E973F07B9C38A7A01F13CA183A15EF30D5ED916E03BB011E3C55329665FE2  agents\openai.yaml
1A26E8340A612B024184357C38888F53BE261DD36C6DF5005555EA49C60121E7  evals\evals.json
7F95D857368821F3A1382F90F9639BB6A4D055FDCBC6A4A4BF5C0EBA0D90748D  references\claude-adapter.md
74AB38E8EC74E13958D1C4A0ABF7964D77D3AC9216601DC24FA2E2A0270817F0  references\codex-adapter.md
DECD08A6DAD906D8566AAAA68B179FE9E261DA23C2846CE4628F9C4189193F73  references\delegation-policy.md
1F83EFB7717AB1594666EF500D8EFC47E0FCCD742A1776EE64B3284EBC2071F8  references\improvement-policy.md
```

## rollback

問題が発生した場合は、配布先を個別に手修正しない。

1. backupの`source` 7ファイルを配布元へ再配布する。
2. 配布元からCodex・Claudeへ同じ7ファイルを再配布する。
3. baseline SHA-256へ戻ったことを3か所で照合する。
4. 配布元へ`quick_validate.py`を実行する。
5. 新しいCodex実行主体で主要triggerをsmoke testする。

