# Q-013 パレット色名整合設計

## 目的

利用者レビューで指摘されたパレット名と実際の背景色の不一致を解消する。共有カード背景として確認済みのB表示（background白混合84%、surface白混合90%）と現在の基調色HEXは維持し、利用者が結果画面で色候補を選ぶ際の名称を実色へ合わせる。

## 決定

- `palettes.csv`の`palette_id`、表示順、3つの基調色HEX、説明、statusは変更しない。
- `palette-usage-mappings.csv`とB表示設定は変更しない。
- 利用者が指摘した候補は、現在の`primary_color`から得られる背景色に合わせて`label`を変更する。
- 同じ称号の3候補では、紺・紫・青緑、赤・橙・青緑のように色相の違いが名称から分かるようにし、近接した同義名を付けない。
- 実色とすでに一致している「深い夜のミッドナイトブルー」「孤独を愛する深い紺」「自分の席を守るグレー」は維持する。
- 「移ろう光の淡い紫」と「繊細な薄紅色の花びら」は、同じ称号内の実色へ合うよう名称を入れ替える。
- 修正済みの`content_review_note`は空に戻すが、P-0〜P-6および全行の`draft`は変更しない。これは承認ではない。

## 表示例

| palette_id | 変更後 |
|---|---|
| `palette-single-intellectimagination-high-2` | 閃きを象徴する星影の紫 |
| `palette-single-intellectimagination-high-3` | 未知への好奇心を誘うターコイズ |
| `palette-single-extraversion-high-1` | 陽気なコーラルピンク |
| `palette-single-extraversion-high-2` | 活気に満ちたオレンジ |
| `palette-single-extraversion-high-3` | 交流をひらくターコイズ |
| `palette-pair-intellectimagination-high-and-agreeableness-low-1` | 強い意志を宿す深い青 |
| `palette-pair-intellectimagination-high-and-agreeableness-low-2` | 未踏の地を拓く深い紫 |
| `palette-pair-intellectimagination-high-and-agreeableness-low-3` | 鋭い理性を照らすオレンジ |

## 検証

- 153候補、51称号、各称号3候補を維持する。
- 変更対象の`primary_color`が変更前と同一であることをテストする。
- 同一称号内の3つのlabelとprimary HEXが重複しないことをテストする。
- 生成プレビューがB表示を維持し、正典CSVと決定的に一致することを確認する。
- `content:validate`、静的検証、全テストを通す。
