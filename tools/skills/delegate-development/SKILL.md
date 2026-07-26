---
name: delegate-development
description: Use when delegating a software-development task to subagents or lower-cost workers, or when an implementation request has complete requirements and basic design that may be safely split.
---

# 開発委譲

監督役として、設計済みの低〜中リスク作業だけを分割し、成果物を統合して検証する。共通の判断は [委譲方針](references/delegation-policy.md) を読む。

## 実行手順

1. 要件定義、基本設計、実装の現状、およびプロジェクト指示を読み、入力品質ゲートを通す。識別子・値制約、schema、状態遷移、失敗時処理、所有・承認を正典・実装・validator・test fixture間で照合する。契約が異なる場合は共有契約表へ根拠別に並べ、矛盾またはunknownへ触れる部分を委譲しない。ゲート不合格なら委譲を止め、不足・影響・次の選択肢を報告する。
2. タスクを分類し、範囲、書込み所有権、完了条件、検証を固定する。同じファイルを変更する作業は並列化しない。
3. 各担当へ最小限のコンテキストパック、共有契約表、報告契約を渡す。関数シグネチャ、exact schema、分類対応、対象入力範囲、人手承認状態のうち該当する契約を、別名だけでなく値・フィールド・型・根拠・確定状態まで明記する。高リスク作業、曖昧な原因調査、統合、完了判定は監督役が担う。渡す文脈は該当範囲・ログ抜粋だけに絞り、横断探索はサブエージェントに投げて結論だけ受け取り、報告は差分・結論に限らせる（コンテキスト経済。詳細は委譲方針を参照）。
4. 実行環境を確認し、利用可能なアダプターを読む。Codex は [Codex アダプター](references/codex-adapter.md)、Claude（Claude Code・Cowork・Claude.ai など）は [Claude アダプター](references/claude-adapter.md) を読む。plan別workspace・task brief・review packageが必要なら、plugin cacheのコピーではなく本skill同梱の`scripts/`を使う。サブエージェント起動機能を利用できなければメイン単独実行へ切り替える。
5. 担当の報告だけに依存せず、対象diff、探索上限、severity、追加subreviewの可否、完了報告形式を固定してレビューする。差分、スコープ、要件・設計との整合、重要テスト、文書同期を確認し、指摘を「今回のblocker」「次タスク」「別所有タスク」へ分類する。不合格の範囲内修正は同じ担当へ一度だけ差し戻し、再失敗または判断不足は監督役が引き取る。
6. 効率と品質を記録し、改善の要否は [改善方針](references/improvement-policy.md) に従って判断する。

## 守る境界

- 編集・検証用の正典だけを更新する。Codex または Claude のインストール済みコピーを直接編集しない。緊急性、締切、権威者の指示、事前承認は例外にしない。
- 監督指示と正典が矛盾する場合、担当へ推測で指示を優先させない。該当する正典の根拠を示して停止・照会させ、監督役が解消する。
- 自動テスト、機械レビュー、独立レビューの成功を、人手による文面・デザイン・法務・公開承認などの承認記録へ読み替えない。
- 基本設計または同等の入力品質が不足する場合、認証、権限、機密情報、破壊的操作、データ移行などの高リスク作業を委譲しない。締切圧力があっても前工程へ戻すか、監督役が安全な範囲を単独で扱う。
- 要件定義や基本設計そのものを委譲で代替しない。低品質を前提にコストを削減しない。
- 実装中に「確定していた要件が成立しない」と判明しても、要件定義書・基本設計を黙って書き換えない。上流工程（`requirements-definition`／`basic-design`）へ戻し、該当機能に **【失効】**（確定/【想定】/【要確認】に次ぐ4つ目の区分。行を消さず取り消し線＋失効日・起点・理由・置換先を併記）を付け、改訂履歴を**追記専用**で更新させる。反映の可否判断は人が行う。書式は要件定義書テンプレートの20章を参照。

## 参照

- リスク分類、ゲート、コンテキストパック、報告契約、差し戻し: [delegation-policy.md](references/delegation-policy.md)
- Codex の機能検出とフォールバック: [codex-adapter.md](references/codex-adapter.md)
- Claude の機能検出とフォールバック: [claude-adapter.md](references/claude-adapter.md)
- Windows/POSIX対応の委譲補助: `scripts/sdd-workspace`、`scripts/task-brief`、`scripts/review-package`
- 記録、効率評価、改善候補と採否: [improvement-policy.md](references/improvement-policy.md)
