# Big Five自己理解支援ツール

## 概要

18歳以上の一般ユーザーが、スマートフォンを中心に一人で利用するBig Five自己理解支援Webアプリ。IPIP日本語50項目版を固定尺度として使い、20問簡易プレビューと50問詳細結果、履歴・比較・共有を提供する。

要件の正典は `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md`。機能ID、測定・判定・保存・共有・表現のルールはこの要件書を優先する。

## 前提（仮置き）

- 【想定】正式版は `app/` に新設し、`prototype-big-five/` は検証済みUIプロトタイプとして変更しない。
- 【想定】フロントエンドはVanilla JavaScriptのES Modulesを使う。通常版は実行時バックエンドを導入せず、ベータ版だけOCI匿名集計APIへ接続する。
- 【想定】GitHub Pagesには `app/` の静的成果物をGitHub Actionsで配置する。
- 【想定】画面遷移はGitHub Pagesで404を起こさないハッシュルーティングを使う。
- 【想定】単体テストはNode標準の `node:test` を中心にし、ブラウザスモークを併用する。

これらを変更する場合は、`基本設計サマリ.md`、`docs/data-model.md`、`docs/screens.md`、`docs/processing-design.md`、`docs/tasks.md`を同時に更新する。

## 技術スタック

- 言語: HTML / CSS / JavaScript（ES Modules）
- 永続化: ブラウザ `localStorage`。ベータ集計のみOCI PostgreSQL
- ベータAPI: 【想定】Node.js、PostgreSQL、Nginx。既存VPS構成確認後に最終化
- 描画・共有: Canvas、Web Share、Clipboard、Download
- 実行時API・DB・認証: 通常版はなし。ベータ版だけ匿名集計API・DBを使用し、利用者認証はなし
- テスト: Node.js `node:test`、対象ブラウザのスモークテスト
- デプロイ: GitHub Pages / GitHub Actions / HTTPS

## 計画ディレクトリ

```text
app/
  index.html
  assets/
    characters/
  css/
  js/
    config/
    data/
    domain/
    infrastructure/
    presentation/
  manifest/
  tests/
beta-api/               # ベータ匿名集計API・DBマイグレーション【想定】
prototype-big-five/      # 破棄前提の検証用。正式データの移植元にしない
docs/
  requirements/
  research/
  data-model.md
  screens.md
  processing-design.md
  api-design.md
  tasks.md
```

依存方向は `presentation -> domain <- infrastructure` とする。採点・称号判定・比較互換判定・共有モデル生成はDOMやブラウザAPIへ依存しない純粋関数にする。

## 規約

- 1機能の実装・修正は `docs/tasks.md` のタスクIDと対応機能IDを明記する。
- 尺度、設問、採点、結果文、称号判定、キャラクター、演出、カードテンプレート、アプリを独立してバージョン管理する。
- 固定設問や判定表はコードへ散在させず、版付き定義と検証スキーマを持たせる。
- 利用者向け文言と内部エラーコードを分離する。
- 例外を握りつぶさず、結果表示を維持できるフォールバックへ変換する。
- 画像は縦横比を維持する。Q-012確定前は全体表示を既定とし、無断でトリミングしない。
- `localStorage`の読込値は常に検証し、壊れたレコードだけを隔離または無視する。
- 生回答は完答履歴・共有物・通常公開の通信へ含めない。ベータ完答時は集計APIの検証とカウンター加算にだけ使用し、個人単位イベントとしてDB・ログへ保存しない。
- 設問・称号・色のマスタ行へカウンター列を追加せず、版付き集計専用テーブルへ原子的に加算する。
- ベータAPIのアクセスログ・アプリログへIP、User-Agent、Referer、本文、回答値、称号ID、色ID、requestIdを残さない。
- 通常版とベータ版の機能フラグをテストし、通常版の診断フローで外部送信0件を維持する。
- コンテンツの人手編集正典はコミット対象の`content/source/`以下のCSVであり、生成JSONの`app/content/`は手編集・コミットしない。詳細な作成手順は`docs/content-authoring.md`を参照する。
- CSV、3つのrelease schema、4つのコンパイラ、決定的な7 JSON builder、atomic writer、CSV/ES Modules parity testは実装済み。Q-013は承認済みCSVから`presentation-v2` ES Modulesを決定的に生成して通常runtimeへ接続済みで、`connect-src 'none'`を維持する。ただしapproved JSON releaseはなく、JSON runtime/Pages activationは`docs/superpowers/plans/2026-07-26-csv-content-activation-pages.md`の別計画である。
- Q-006のE-0〜E-5、F-1〜F-5、T-0〜T-4、X-1〜X-2は2026-07-28に承認済みである。現行`result-text-v2`のTR-0〜TR-4（51称号×3件）も2026-07-30までに承認・実装済みである。Q-013は2026-07-31にP-0（153パレット、正式用途色Bの背景84%・表面90%、WCAG）、P-1（固定3場面、29香調、25素材、29素材関連、安全表現）、P-2〜P-6（全51称号の標準1＋代替2パレット、3場面×各2香調、共有代表）を承認し、同日`presentation-v2` ES Modules runtimeを生成・接続済みである。approved JSON releaseの選択とQ-012の正式releaseは未完了のrelease gateとして維持し、承認事実を補完してはならない。

## バージョン管理

- 現在版: `mvp-1.0.0`
- MVP: `mvp-MAJOR.MINOR.PATCH`
- ベータ: `beta-MAJOR.MINOR.PATCH`
- 正式版: `MAJOR.MINOR.PATCH`
- PATCH: 後方互換のある小修正
- MINOR: 後方互換のある機能追加・中規模変更
- MAJOR: 保存形式・公開契約等の破壊的変更
- MINOR更新時はPATCHを0、MAJOR更新時はMINOR/PATCHを0へ戻す。
- 【想定】アプリ版の正典は `app/js/config/app-meta.js` とする。
- 診断関連版は同ファイルから版付き定義を参照し、開始画面、説明画面、結果履歴、共有物へ反映する。
- テストで正典、画面モデル、共有モデルの版一致を検証する。

## コマンド

T-001完了後の標準コマンド:

- 正式版ローカル起動: `npm.cmd run dev`
- 全テスト: `npm.cmd test`
- 静的検証: `npm.cmd run check`
- コンテンツ検証: `npm.cmd run content:validate`
- 承認済みreleaseの生成: `npm.cmd run content:build`（現在はrelease未選択のため`RELEASE_NOT_SELECTED`）
- 既存プロトタイプ起動: `npm.cmd run prototype`

## 実装上の注意

- 20問回答後、結果表示前に「簡易プレビューを見る」「結果を見ず50問へ進む」を選ばせる。後者では20問スコア・仮称号・仮猫を表示しない。
- 採点は逆転処理後の1〜5平均を正とし、0〜100整数は表示専用。判定・比較に表示整数を使わない。
- `title-rule-v1`は要件8.3.1をそのまま実装し、完全同点まで決定的に解決する。
- ベータ集計は結果表示を先に成立させ、送信失敗・DB停止・タイムアウトで診断、履歴、共有を阻害しない。
- 同一集計要求は短期冪等キーハッシュで1回だけ加算し、完答集計は1トランザクションで全件成功または全件ロールバックする。
- 51称号・猫はエンタメ表現であり、心理学上の正式タイプと表示しない。
- 色・香りは追加質問なしで複数候補を提示する。色選択はカードの演出だけを変え、診断結果を変えない。
- 選択色と猫が同系色でもパレットを除外・差し替え・猫を再配色せず、明暗二重縁取りまたは影で共有カード上の視認性を維持する。現行`card-template-v2`では猫の背後へ白色・ニュートラル色の円形面や矩形プレートを置かない。
- 香りについて商品、精油量、DIY配合、摂取、塗布、ディフューザー使用法や治療効果を案内しない。
- キャラクターは該当1体だけを遅延読込し、失敗時も称号・スコア・文章・共有テキストを維持する。
- Canvasや共有APIが失敗しても、テキストコピーまたは選択可能テキストへ到達できるようにする。

## 変更禁止事項（根拠つき）

- `prototype-big-five/sample-questions.js`、`sample-scoring.js`、`sample-results.js`を正式データとして移植しない。要件13章で禁止されている。
- IPIP設問をランダム抽出、独自言い換え、無断並べ替えしない。固定尺度の再現性と20問集合の同一性を壊す。
- 20問を日本語版Mini-IPIPとして妥当性検証済みと表示しない。独立した日本語版検証がない。
- 母集団データ採用前に偏差値、パーセンタイル、上位率を表示しない。0〜100は尺度内スコアである。
- 完答後の履歴へ生回答を残さない。プライバシー要件と通常公開の非送信方針に反する。
- 公開結果URL、アカウント、通常公開版の実行時DB・分析送信をMVPへ追加しない。ベータ匿名集計はF-017と`docs/api-design.md`の範囲だけを例外とする。
- 称号境界、同点処理、固定因子順を「改善」と称して変更しない。変更時は `title-rule-v2` 以降を採番し、要件とテストを更新する。
- 猫の毛色・体格・猫種を善悪、知性、能力、序列へ結び付けない。

## 検証済みの事実

| 事実 | 検証方法 | 根拠 | 確認日 |
|---|---|---|---|
| 20問相当の体験は入口として短く感じられる | ユーザーによるプロトタイプ試用 | 要件2.4 | 2026-07-20 |
| 回答、途中保存、履歴、比較、共有の状態遷移を静的Webで実現できる | プロトタイプ実装とテスト | `prototype-big-five/`、`prototype-big-five/NOTES.md` | 2026-07-20 |
| IPIP日本語50項目版を利用する方針 | 利用条件・尺度調査 | 要件Q-001、`docs/research/2026-07-20-big-five-scale-selection-research.md` | 2026-07-20 |
| 51分類と境界・同点ルールが確定済み | ユーザー承認 | 要件8.3.1、Q-005 | 2026-07-20 |

## 参照

- 要件正典: `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md`
- 人向け設計: `基本設計サマリ.md`
- データ: `docs/data-model.md`
- 画面: `docs/screens.md`
- 処理: `docs/processing-design.md`
- API: `docs/api-design.md`
- タスク・トレーサビリティ: `docs/tasks.md`
