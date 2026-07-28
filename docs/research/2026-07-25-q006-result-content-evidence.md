# Q-006 結果文章の根拠台帳

- 対象: T-005 / F-002 / F-005 / F-006 / F-016 / Q-006
- 台帳版: `result-evidence-v1`
- 作成日: 2026-07-25
- 範囲: 結果文の根拠ID、主張できる範囲、因子別の公式項目、コンテンツ承認ゲート。固定6件以外の実行時根拠は追加しない。

## 読み方

この台帳の「支持する主張」は、結果文が使える根拠の範囲であり、能力、適性、診断、人口内順位、因果、仕事・人間関係・ストレスの事実認定を支持しない。`high` / `middle` / `low` は要件8.3.1の尺度内bandであり、表示用0〜100整数や生回答から直接選ぶものではない。

仕事、関係性、ストレス、問いかけ、行動の節は、測定された事実ではなく `reflectionPrompt` または `actionHint` として扱う。結果文では「今回の回答では」「この因子では」を用い、人格の固定、能力保証、低傾向の欠点化をしない。

## 根拠ID・主張対応表

| evidence ID | 出典 | locator | 支持する主張 | 支持しない主張 | レビュー状態 | 承認日 |
|---|---|---|---|---|---|---|
| `evidence-ipip-japanese-markers` | IPIP Japanese Translation of the Lexical Big-Five Factor Markers | https://ipip.ori.org/JapaneseBig-FiveFactorMarkers.htm | 因子項目の意味、因子両極の観察 | 知能、学力、創造的能力、適職、臨床診断、人口順位 | 既存の`DiagnosticDefinition.source`と公式項目へ照合済み | — |
| `evidence-ipip-50-item-scale` | IPIP Japanese 50-item scale | https://www.ipip.ori.org/New_IPIP-50-item-scale.htm | 50問詳細結果の項目由来の観察 | 日本語版の心理測定的妥当性保証、因果、能力評価 | 既存の`DiagnosticDefinition.source`と尺度構成へ照合済み | — |
| `evidence-mini-ipip-selection` | Donnellan et al. (2006), Mini-IPIP Appendix A | https://doi.org/10.1037/1040-3590.18.2.192 | 20問プレビューの原版選定対応 | 日本語版Mini-IPIPとしての独立した妥当性検証、詳細結果相当の断定 | 既存の`DiagnosticDefinition.source`と20問選定へ照合済み | — |
| `evidence-ipip-permission` | IPIP permission statement | https://ipip.ori.org/newPermission.htm | IPIP項目・尺度のpublic-domain利用 | 日本語訳の心理測定品質、結果文の内容妥当性 | 既存の`DiagnosticDefinition.source`と利用条件へ照合済み | — |
| `evidence-title-rule-v1` | Big Five自己理解支援ツール要件 8.3.1 | `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md#831-称号キャラクター判定ルール` | 称号選択、high/middle/low境界、20問プレビュー制限 | 称号が心理学上の正式タイプ、能力・善悪・適性の判定 | 要件正典の承認済み契約 | 2026-07-20 |
| `evidence-result-presentation-contract` | T-005結果・キャラクター・演出設計 2.2 | `docs/superpowers/specs/2026-07-25-t005-result-character-presentation-design.md#22-文面` | 振り返り問いかけ、行動ヒント、非診断的文面 | 仕事・関係性・ストレスを測定事実として断定する文面 | 設計承認済み契約 | 2026-07-25 |

## 因子別・公式項目対応

項目本文は`app/js/data/diagnostic-definition.js`の`SOURCE_ITEMS`に固定された公式日本語項目をそのまま転記する。各因子で、high観察候補は正方向項目、low観察候補は逆転する負方向項目に限定する。middle観察候補は高低いずれか一方の性質を断定せず、同じ10項目全体に対する中間域という採点上の記述に限定する。

### 知性・想像力（`intellectImagination`）— E-1

- high: 5「語彙が豊富である」、15「想像力が豊かである」、25「素晴らしいアイディアを持っている」、35「ものわかりが良いほうだ」、40「難しい言葉を使うほうだ」、45「いろんなことを反省しては時間を過ごす」、50「アイディアが豊富である」。
- low: 10「抽象的な考えを理解するのが苦手だ」、20「抽象的な考えには興味がない」、30「アイディアが乏しいほうだ」。
- middle: 上記10項目全体。中間域は片極の項目内容を利用者へ帰属せず、尺度内の中間bandだけを記述する。

### 勤勉性（`conscientiousness`）— E-2

- high: 3「いつも用意周到である」、13「細かいことに気がつく」、23「すぐに雑用を済ませる」、33「整頓するのが好きである」、43「予定に従うほうだ」、48「張り切って仕事や学習に取り組むほうだ」。
- low: 8「持ち物が整理できないほうだ」、18「無茶なことをする」、28「整理整頓を怠りがち」、38「仕事や学習をさぼることが多い」。
- middle: 上記10項目全体。中間域は片極の項目内容を利用者へ帰属せず、尺度内の中間bandだけを記述する。

### 外向性（`extraversion`）— E-3

- high: 1「盛り上げ役である」、11「人前でもあがらない」、21「自分から話しかけるほうである」、31「パーティでは色々な人と話すほうだ」、41「注目の的になるのは嫌ではない」。
- low: 6「おしゃべりではない」、16「引っ込み思案である」、26「あまり話すことがない」、36「人から注目を浴びるのは好きではない」、46「人見知りする」。
- middle: 上記10項目全体。中間域は片極の項目内容を利用者へ帰属せず、尺度内の中間bandだけを記述する。

### 協調性（`agreeableness`）— E-4

- high: 7「他人に興味がある」、17「人に共感しやすい」、27「優しい心を持っている」、37「他の人のために時間を割くほうだ」、42「他の人の気持ちがわかる」、47「人を安心させる」。
- low: 2「他人を気づかうことはない」、12「人を馬鹿にするほうだ」、22「他人の問題には興味がない」、32「他人にはまったく興味がない」。
- middle: 上記10項目全体。中間域は片極の項目内容を利用者へ帰属せず、尺度内の中間bandだけを記述する。

### 情緒安定性（`emotionalStability`）— E-5

- high: 9「いつもリラックスしていることが多い」、19「落ち込むことはめったにない」。
- low: 4「すぐにストレスがたまってしまう」、14「心配性である」、24「動揺しやすい」、29「慌てやすい」、34「気分をコロコロ変える」、39「気分が著しく変化するほうだ」、44「イライラしやすい」、49「落ち込むことが多い」。
- middle: 上記10項目全体。中間域は片極の項目内容を利用者へ帰属せず、尺度内の中間bandだけを記述する。

## Content Approval Gates（E-0〜E-5）

| Gate | 対象 | 既承認の決定 | 状態 | 承認日 | Task 4で必要なこと |
|---|---|---|---|---|---|
| E-0 | 共通資料、20/50の限界、非診断注意 | IPIP日本語50項目版、20問は簡易プレビュー、20問日本語版Mini-IPIPの独立妥当性は未検証、称号は非公式、振り返り・行動は測定事実でない | approved | 2026-07-20（要件）、2026-07-25（T-005文面契約） | source label、locator、支持範囲のユーザー承認記録をこの台帳に追記する |
| E-1 | 知性・想像力のhigh/middle/low語彙と根拠ID | 20問・50問の観察文6件と、50問のstrength／tradeoff／work／relationship／stress／question／action各3 band、計27文をユーザー承認。観察文は尺度内の傾向だけを述べ、残り21文は測定事実ではなく振り返り・行動ヒントとして`evidence-result-presentation-contract`に限定する | approved | 2026-07-28 | 承認済み27文と、尺度観察／振り返り・行動ヒントの根拠境界を維持する |
| E-2 | 勤勉性のhigh/middle/low語彙と根拠ID | 20問・50問の観察文6件と、50問のstrength／tradeoff／work／relationship／stress／question／action各3 band、計27文をユーザー承認。観察文は尺度内の傾向だけを述べ、残り21文は測定事実ではなく振り返り・行動ヒントとして`evidence-result-presentation-contract`に限定する | approved | 2026-07-28 | 承認済み27文と、尺度観察／振り返り・行動ヒントの根拠境界を維持する |
| E-3 | 外向性のhigh/middle/low語彙と根拠ID | 20問・50問の観察文6件と、50問のstrength／tradeoff／work／relationship／stress／question／action各3 band、計27文をユーザー承認。観察文は尺度内の傾向だけを述べ、残り21文は測定事実ではなく振り返り・行動ヒントとして`evidence-result-presentation-contract`に限定する | approved | 2026-07-28 | 承認済み27文と、尺度観察／振り返り・行動ヒントの根拠境界を維持する |
| E-4 | 協調性のhigh/middle/low語彙と根拠ID | 20問・50問の観察文6件と、50問のstrength／tradeoff／work／relationship／stress／question／action各3 band、計27文をユーザー承認。観察文は尺度内の傾向だけを述べ、残り21文は測定事実ではなく振り返り・行動ヒントとして`evidence-result-presentation-contract`に限定する | approved | 2026-07-28 | 承認済み27文と、尺度観察／振り返り・行動ヒントの根拠境界を維持する |
| E-5 | 情緒安定性のhigh/middle/low語彙と根拠ID | 20問・50問の観察文6件と、50問のstrength／tradeoff／work／relationship／stress／question／action各3 band、計27文をユーザー承認。観察文は尺度内の傾向だけを述べ、残り21文は測定事実ではなく振り返り・行動ヒントとして`evidence-result-presentation-contract`に限定する | approved | 2026-07-28 | 承認済み27文と、尺度観察／振り返り・行動ヒントの根拠境界を維持する |

E-1は知性・想像力、E-2は勤勉性、E-3は外向性、E-4は協調性、E-5は情緒安定性のhigh/middle/low語彙、根拠ID、20問・50問の対象各27文をContent Approval Gatesでレビューし、2026-07-28にユーザー承認された。

F-1は知性・想像力、F-2は勤勉性、F-3は外向性、F-4は協調性、F-5は情緒安定性の20問観察文と50問8節について、対応するE gateと同じ対象各27文を2026-07-28にユーザー承認した。T-0〜T-4、X-1〜X-2は`reviewed`だが人手approval recordがなく、Q-006全体は`Content Approval pending`のままである。

## 結果節の主張種別

| 節 | 主張種別 | 根拠上の扱い |
|---|---|---|
| observation | `scaleObservation` | 上の公式項目と尺度内bandに限定する |
| strength / tradeoff | `reflectionPrompt` | 能力・善悪・結果保証として扱わない |
| work / relationship / stress | `reflectionPrompt` | 測定された仕事・対人・ストレスの事実ではない |
| question | `reflectionPrompt` | 利用者の振り返りを促す問い。回答内容の断定ではない |
| action | `actionHint` | 選択可能な小さなヒント。治療、能力改善、適職保証ではない |
