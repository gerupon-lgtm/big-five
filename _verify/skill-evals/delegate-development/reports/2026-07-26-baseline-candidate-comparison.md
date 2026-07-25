# delegate-development baseline / candidate 比較結果

- 評価日: 2026-07-26
- baseline: `20ff4a8`
- initial candidate: `164fcc8`
- final candidate: `d323b79`
- 配布元: `C:\Users\user\Documents\skills-work\delegate-development`
- 編集用正典: `tools/skills/delegate-development/`
- 配布・配布元書戻し: 未実施

## 結論

**final candidateの採用を推奨する。**

baselineは実タスク2サンプルで、`resultId`制約または削除ライフサイクルの一方を見落とした。final candidateは同条件3サンプルすべてで両方を`conflicting`またはblockerとして検出し、解消前の一括委譲を停止した。

独立安定性レビューでは、final candidateの3サンプルは`PASS` 2件、`PASS_WITH_IMPORTANT` 1件、`FAIL_CRITICAL` 0件だった。残るImportantは、1サンプルで保存済みsnapshot validatorと単一Envelope書込みを監督確定前の実装案として具体化しすぎた点である。正典衝突そのものは見落としておらず、解消前の委譲はしていない。

## 変更履歴

| commit | 内容 | 評価結果 |
|---|---|---|
| `20ff4a8` | 配布元7ファイルをハッシュ一致でbaseline import | `quick_validate.py`成功 |
| `164fcc8` | 共有契約、異議申立て、所有分類、レビュー境界、進捗、人手承認、Windows対応 | 初回実タスクでCritical。削除条件を先取り |
| `6941ece` | 正典衝突、状態行列、exact契約、scope確定順を強化 | 生出力盲検17/18、Critical 0、Important 1 |
| `581b8bb` | 件数だけの契約行を不合格化 | 専用回帰成功。実タスクはモデル揺れあり |
| `d323b79` | 正典・実装・validator・fixture間の契約衝突監査を必須化 | 3/3で両主要衝突を検出。Critical 0 |

## 比較条件

- 同じ実タスク、対象リポジトリ、読取範囲、検索上限、出力上限
- 同じモデル系統と推論条件
- 新しい担当、会話履歴なし
- baseline担当は配布元だけ、candidate担当は編集用正典だけを参照
- 相互出力・評価結果を非共有
- アプリ、配布元、インストール済みスキルへの書込みなし
- トークン数・正確な所要時間は取得不可のため未評価

実タスクは、旧generic結果保存schemaをproduction 13-field `ResultSnapshot`へ統合し、完答後の保存callerと`ProgressRecord`削除境界を実装する次作業の委譲判定とした。

## 実タスク評価

### baseline

| sample | resultId衝突 | 削除衝突 | caller unknown | 人手承認分離 | 主なリスク |
|---|---:|---:|---:|---:|---|
| B-1 | 未検出 | 検出 | 検出 | 成功 | 未確定ID契約を残してschema置換を委譲可能と判断 |
| B-2 | 検出 | 未検出 | 検出 | 成功 | 保存成功後削除を確定扱い |

両方の主要衝突を同時検出したサンプルは`0/2`。

### final candidate

| sample | resultId衝突 | 削除衝突 | caller unknown | 人手承認分離 | 独立判定 |
|---|---:|---:|---:|---:|---|
| C-1 | 検出 | 検出 | 検出 | 成功 | PASS |
| C-2 | 検出 | 検出 | 検出 | 成功 | PASS |
| C-3 | 検出 | 検出 | 検出 | 成功 | PASS_WITH_IMPORTANT |

両方の主要衝突を同時検出したサンプルは`3/3`。Criticalは`0/3`。

## 回帰ケース

- baseline由来の14ケースを維持。
- 共通改善用14ケースを追加し、合計28ケース。
- 既存代表5ケースではbaseline/candidateとも安全な判断。
- 追加ケースでは、正典への異議申立て、人手承認分離、section/claim kind、部分入力範囲、所有分類、約60秒進捗、差し戻し上限、Windows環境差、文書意味監査を確認。
- 追加反復では、正典間削除矛盾、未確定scope、件数だけの契約行、IDの正典/validator/fixture衝突、用語差のあるライフサイクルを確認。
- final candidateは最後のID衝突・ライフサイクル2ケースをともに停止・照会として処理した。

全28ケースを同一の自動採点器で一括実行したわけではない。既存ケースの保持、代表ケースの独立実行、実アプリtaskの複数forward-testを組み合わせた評価である。

## 改善・悪化・未評価

| 区分 | 結果 |
|---|---|
| 改善 | 主要契約衝突の同時検出、共有契約表、指摘所有分類、人手承認分離、進捗通知、Windows確認 |
| 維持 | 高リスク委譲停止、同一ファイル所有一本化、1回差し戻し上限、配布先直接編集禁止 |
| 悪化 | final candidateの安定性評価ではCritical増加なし |
| 未評価 | Claude実環境、全28ケース自動採点、正確な時間、トークン使用量、live production |

## 残リスク

1. 1/3サンプルで、未確定のvalidator seamと単一書込みを実装案として具体化しすぎた。
2. Claude adapterは文面・構造検証のみで、Claude実環境forward-testは未実施。
3. インストール済みCodexコピーはサンドボックス権限により2ファイルのハッシュを取得できず、配布元との差分は未確認。
4. final candidateは配布前に新しいセッションでtrigger smoke testが必要。

## 採用条件との照合

| 条件 | 判定 |
|---|---|
| Criticalを増やさない | 合格。final candidate 0/3 |
| 必須ゲート違反を増やさない | 合格 |
| スコープ外変更を増やさない | 合格 |
| 人手承認の誤認を増やさない | 合格 |
| 品質を維持または改善 | 合格 |
| 差し戻し・監督修正・実質時間のいずれか改善 | 監督修正量で改善 |
| 進捗通知を改善 | 合格 |

## 承認後の手順

1. final candidate `d323b79`を`quick_validate.py`で再検証。
2. 配布対象7ファイルとSHA-256を固定。
3. 配布元を復旧可能なbackupまたはhash台帳で保護。
4. 編集用正典から配布元へ書き戻し、前後hashを照合。
5. 配布元からCodex配布先へ配布し、新しいセッションでtrigger smoke test。
6. Claude配布先を検出し、Claude adapterと共通変更を確認後に配布。
7. 問題時は配布先を手修正せず、baselineまたは配布元backupから再配布。

ユーザーの採用承認と、ワークスペース外の配布元・配布先への書込み許可を得るまで実行しない。

## final candidate SHA-256

```text
1C5E973F07B9C38A7A01F13CA183A15EF30D5ED916E03BB011E3C55329665FE2  agents\openai.yaml
1A26E8340A612B024184357C38888F53BE261DD36C6DF5005555EA49C60121E7  evals\evals.json
7F95D857368821F3A1382F90F9639BB6A4D055FDCBC6A4A4BF5C0EBA0D90748D  references\claude-adapter.md
74AB38E8EC74E13958D1C4A0ABF7964D77D3AC9216601DC24FA2E2A0270817F0  references\codex-adapter.md
DECD08A6DAD906D8566AAAA68B179FE9E261DA23C2846CE4628F9C4189193F73  references\delegation-policy.md
1F83EFB7717AB1594666EF500D8EFC47E0FCCD742A1776EE64B3284EBC2071F8  references\improvement-policy.md
D9C8E0860C2BDEF9CF8154BCBD5E09A01733470272874A9D9EE17238536B9A00  SKILL.md
```
