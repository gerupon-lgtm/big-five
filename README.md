# Big Five 自己理解支援ツール

Big Fiveを用いて、自分の傾向を振り返るためのスマートフォン向けWebアプリです。医療上の診断や、能力・適性・採用判断を目的とするものではありません。

## 現在の実装状態

- 正式版の基盤: `app/`
- 現在の版: `mvp-1.0.0`
- 実装済み: 20問簡易プレビュー、50問詳細結果、途中保存・再開、履歴・比較・削除、ココロパレット／ココロアロマ、共有カード・PNG保存
- 通常版の外部送信: 0件（CSP `connect-src 'none'`）
- 既存UIプロトタイプ: `prototype-big-five/`（正式版とは分離）

開始画面には展開式のツール紹介と現在版を表示します。全削除では結果履歴と途中回答に加え、同じ画面セッション内の再開状態も破棄するため、削除後に再開ボタンは表示されません。

## コマンド

```powershell
# 正式版を起動
npm.cmd run dev

# http://localhost:4174/#/start を開く

# 正式版と既存プロトタイプの全テスト
npm.cmd test

# 構文・版情報・正式版とプロトタイプの分離を検証
npm.cmd run check

# CSVコンテンツを検証
npm.cmd run content:validate

# 共有画像を含むQA用静的成果物を生成
npm.cmd run qa:preview:build

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
