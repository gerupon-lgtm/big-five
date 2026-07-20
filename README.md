# Big Five 自己理解支援ツール

Big Fiveを用いて、自分の傾向を振り返るためのスマートフォン向けWebアプリです。医療上の診断や、能力・適性・採用判断を目的とするものではありません。

## 現在の実装状態

- 正式版の基盤: `app/`
- 現在の版: `mvp-0.1.0`
- 完了タスク: T-001（静的基盤、ハッシュルーター、版管理、テスト基盤）
- 次のタスク: T-002（IPIP固定定義と権威データ検証）
- 既存UIプロトタイプ: `prototype-big-five/`（正式版とは分離）

現時点の正式版には開始画面の骨格だけがあり、診断機能はまだ実装されていません。

## コマンド

```powershell
# 正式版を起動
npm.cmd run dev

# http://localhost:4174/#/start を開く

# 正式版と既存プロトタイプの全テスト
npm.cmd test

# 構文・版情報・正式版とプロトタイプの分離を検証
npm.cmd run check

# 既存UIプロトタイプを起動
npm.cmd run prototype
```

## 設計資料

- 要件定義: `docs/requirements/`
- 基本設計サマリ: `docs/基本設計サマリ.md`
- 実装タスクと完了条件: `docs/tasks.md`
- データ設計: `docs/data-model.md`
- 画面設計: `docs/screens.md`
- 処理設計: `docs/processing-design.md`
- ベータ匿名集計API: `docs/api-design.md`

Q-011のベータ運用値は、MVP通常公開の完成後、外部ベータ公開へ進む前に確定します。
