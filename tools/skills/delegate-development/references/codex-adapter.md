# Codex アダプター

## 機能を検出する

開始時に、利用可能なツール一覧とプロジェクト指示を確認する。サブエージェント機能、利用可能な役割または推論設定、作業ディレクトリの共有有無、並列数、テスト実行権限を確認する。利用できる具体的な作業モデルは、その実行環境で表示された選択肢だけから選ぶ。

## 委譲する

監督役として、タスク、コンテキストパック、変更所有権、完了条件、検証、報告契約を明記して起動する。共有作業ディレクトリでは書込み範囲を重複させない。調査と実装を分ける場合は、調査結果を確認してから実装を起動する。

長時間の実装・レビュー・待機中は、ユーザー向けcommentaryを約60秒ごとに更新する。active agent、完了済み範囲、残作業、ブロッカーを簡潔に示し、active agentがいない場合も明示する。担当の完了報告を待つだけで監督役の状態通知を止めない。

サブエージェント起動ツールがモデル上書きを公開している場合だけ、表示された候補から明示的に作業モデルを選ぶ。モデル上書きと全会話履歴の継承を同時に指定できないツールでは、全履歴を渡さず、独立コンテキストまたは必要な直近ターンだけを渡す。ツールのスキーマにないモデル名、履歴モード、推論設定を推測しない。

特定の作業モデルを選択できない場合は、ツールが公開していれば同じ実行主体で低い推論設定を選ぶか、監督役が単独で実行する。機能名、モデル名、トークン使用量を取得できない場合は推測せず、取得できた品質・時間・再試行の指標だけを記録する。

## Windowsで実行する

Windows、PowerShell、Git Bash、WSLでは、同じ補助スクリプトでもパス変換、実行権限、既定文字コードが異なる。補助スクリプトの失敗だけで、対象リポジトリや成果物の不良と断定しない。

- plan別workspace、task brief、review packageには、本skillの`scripts/sdd-workspace`、`scripts/task-brief`、`scripts/review-package`を優先する。plugin cache内の別skillのhelperを正典として直接呼ばない。
- 同梱helperはWindows drive-letter pathをGit BashのPOSIX pathへ正規化する。PowerShellからはplan・出力先を1引数として渡し、日本語・空白をshell文字列分割しない。
- helperが`SDD_PATH_CONVERSION_FAILED`を返した場合、エラー内のshellと未変換pathを記録し、同じworktree内の`.superpowers/sdd/<plan>/`へPowerShellの`New-Item`で限定作成する。別worktree、repository root、`C:`という相対directoryへ出力しない。
- `review-package`のbyte数は任意統計である。`wc`がない環境でも、出力ファイルの存在・非0byteとcommit数を確認できればpackage生成を成功とし、不完全な`bytes`表示を成功扱いしない。
- 失敗したshell、コマンド、解決済み絶対パス、権限エラーを記録する。
- PowerShellなど、その環境で利用できるネイティブ手段へ切り替える。
- 出力先が意図したworktreeまたは評価領域内か確認する。
- 日本語の表示文字化けだけでファイル破損と断定せず、UTF-8を明示した読取りと実バイトまたは別経路で照合する。

環境固有の回避策を共通の製品要件や成果物変更へ混入させない。

## Skill本文の権限を確認する

`delegate-development`は監督役が適用するcontroller skillである。実装担当・レビュー担当のpromptへ`$delegate-development`の再適用や、controller skill packageの再読を要求しない。担当へはtask brief、共有契約表、report path、review packageだけを渡す。

監督役自身または、別skillを実際に適用する担当が選択済みskill本文を読めない場合、適用成功として継続しない。次を`DELEGATE_SKILL_ACCESS_DENIED`として報告し、読めないskillに依存する委譲を止める。

- skill名と解決済み絶対path
- root／implementer／reviewerの別
- permission profile
- 失敗したread operationと例外種別

skill packageのwrite権限を付与して回避しない。これはCodex adapter／sandboxが選択済みskill packageへread-only accessを伝播すべき外部境界であり、本skillは権限自体を変更しない。監督役が既にskillを正規のskill loaderから完全に読了しており、子担当がcontroller skillを必要としない場合だけ、exactなtask artifactを渡して継続できる。

## 回収して統合する

担当の最終報告と実ファイルの差分を回収する。報告契約を満たさない場合は、不足項目を一度だけ補足させるか、監督役が差分と検証結果から補う。インストール済みスキルに修正が必要と分かっても、正典へ提案または変更を戻し、配布コピーを直接編集しない。
