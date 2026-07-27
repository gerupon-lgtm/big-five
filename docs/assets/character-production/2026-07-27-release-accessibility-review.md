# Q-012 公開前アクセシビリティ確認

## 状態

- 対象: Q-012の配信WebP 51点と `docs/assets/character-production/ledger.json` の代替テキスト
- 現在の状態: **project-owner承認済み**
- 画像資産: 変更なし
- 代替テキスト: 実配信WebPとの初回照合で50点を修正し、row 41は現行文を維持
- 公開状態: 全51行を `released` / `accessibilityReviewStatus: approved` へ更新

## 承認条件

1. 各画像の代替テキストが空でなく、読み上げ時に自然で簡潔である。
2. 実配信WebPで見える猫の姿勢、視線、重要小物だけを記述する。
3. 称号、性格、能力、序列、価値判断、猫種を推測しない。
4. 画像は称号ごとに猫1体だけを配信し、背景焼き込みや全身・重要小物のトリミングがない。
5. 画像を読み込めない場合も、承認済み代替テキストを可視フォールバックとして表示し、称号・因子スコア・結果文・共有テキストを維持する。実装確認はTask 10以降のmanifest/loaderで行う。

## 確認結果

- `TitleProfileDefinition.characterId` → ledger → delivery WebPの対応: 51/51
- 一意なcharacter ID / delivery path: 51/51
- 猫1体・透明背景・非crop: 51/51
- WebP / 1024×1024 / alphaあり / 非透明画素の四辺接触なし: 51/51
- `node scripts/characters/validate-ledger.mjs release-assets`: PASS
- `npm.cmd run character:inspect -- --scope release`: PASS（51点）
- 結果画面の既存テキスト維持・フォールバックテスト: PASS
- 独立した3分割の初回目視監査: Critical 0、Important 50、Minor 0
- Important 50件は、制作指示調の重複、静止画から確認できない意図、実配信WebPとの視線・小物差分を代替テキストから除いて修正した。
- 修正後の独立した3分割再監査: PASS 51 / CHANGE 0、Critical 0、Important 0、Minor 0
- 修正後のfocused test: 29/29 PASS
- `node scripts/characters/validate-ledger.mjs release`: PASS

## 承認候補の代替テキスト

| Row | characterId | 承認候補alt |
|---:|---|---|
| 1 | character-balanced | 五枚の葉のモビールを見上げて座る猫。 |
| 2 | character-single-intellectImagination-high | 閉じたスケッチブックのそばで、蝶を見上げて前足を伸ばす猫。 |
| 3 | character-single-intellectImagination-low | 籠のそばで、足元の木の実を見ながら歩く猫。 |
| 4 | character-single-conscientiousness-high | 手帳のそばで、並んだ五枚の札を見下ろし、前足を一枚に置く猫。 |
| 5 | character-single-conscientiousness-low | 風見のそばで、舞う葉を見上げながら前足を上げる猫。 |
| 6 | character-single-extraversion-high | 吹き出し模様の五枚の札を囲む紐の輪のそばで、前足を上げて画面左上を見る猫。 |
| 7 | character-single-extraversion-low | 鉢植えと小さなカップの間で香箱座りをし、画面右上を見る猫。 |
| 8 | character-single-agreeableness-high | 肉球模様の二枚の札と結び紐のそばを歩き、画面左を見る猫。 |
| 9 | character-single-agreeableness-low | 二方向を示す道標のそばで、三角印の石に前足を置き、画面右を見る猫。 |
| 10 | character-single-emotionalStability-high | 方位磁針と浅い皿の間で、尾を前足に沿わせて座り、正面を見る猫。 |
| 11 | character-single-emotionalStability-low | 青い短冊が揺れる風鈴を見上げて座る猫。 |
| 12 | character-pair-intellectImagination-high--conscientiousness-high | ペンが置かれた星座盤を見下ろし、前足を添えて座る猫。 |
| 13 | character-pair-intellectImagination-high--conscientiousness-low | 風見のそばで、舞う紙片を見上げながら歩く猫。 |
| 14 | character-pair-intellectImagination-low--conscientiousness-high | 木の実が入った籠のそばで、散らばった木の実を見下ろし、前足で一つに触れる猫。 |
| 15 | character-pair-intellectImagination-low--conscientiousness-low | 布袋のそばで、一枚の葉を見下ろしながら前足を上げる猫。 |
| 16 | character-pair-intellectImagination-high--extraversion-high | 重ねた紙のそばで、飛ぶ紙飛行機を見上げながら歩く猫。 |
| 17 | character-pair-intellectImagination-high--extraversion-low | 小望遠鏡のそばで、星座盤に両前足を置いて見下ろす猫。 |
| 18 | character-pair-intellectImagination-low--extraversion-high | 丸い敷物の上に座り、左上を見る猫。前には日用品などを描いた六枚の絵札が並ぶ。 |
| 19 | character-pair-intellectImagination-low--extraversion-low | 鉢植えと小さなカップの横で香箱座りをし、斜め上を見る猫。 |
| 20 | character-pair-intellectImagination-high--agreeableness-high | 座って左上の蝶を見上げる猫。足元には二枚の葉がある。 |
| 21 | character-pair-intellectImagination-high--agreeableness-low | 分岐標の左向きの札に前足を添え、標を見る猫。足元には新芽がある。 |
| 22 | character-pair-intellectImagination-low--agreeableness-high | 座って木の実を見下ろし、二枚の小皿の片方へ前足で置く猫。横には木の実の籠がある。 |
| 23 | character-pair-intellectImagination-low--agreeableness-low | 座って、短い紐から下がる白い札を見下ろし、前足を添える猫。 |
| 24 | character-pair-intellectImagination-high--emotionalStability-high | 座って左上の三日月形モビールを見上げる猫。足元にはガラス玉がある。 |
| 25 | character-pair-intellectImagination-high--emotionalStability-low | 歩みかけて左上の鐘を見上げる猫。右下には三角柱のプリズムがある。 |
| 26 | character-pair-intellectImagination-low--emotionalStability-high | 日輪形の敷物の上で香箱座りをし、正面を向いて目を細める猫。横にはカップがある。 |
| 27 | character-pair-intellectImagination-low--emotionalStability-low | 前足を踏み出し、左後ろの雨粒と波紋を振り返る猫。進行方向には丸石がある。 |
| 28 | character-pair-conscientiousness-high--extraversion-high | 白い札を口にくわえて右へ歩き、進行方向を見る猫。左上には懐中時計が下がる。 |
| 29 | character-pair-conscientiousness-high--extraversion-low | 座って開いた方眼ノートを見下ろし、前足をページに置く猫。横には砂時計とランプがある。 |
| 30 | character-pair-conscientiousness-low--extraversion-high | 赤いリボンをまたいで幕付きの木枠へ歩き、枠に下がる鐘を見る猫。 |
| 31 | character-pair-conscientiousness-low--extraversion-low | 白紙の巻物の横を歩き、巻物を見下ろす猫。そばには羽根がある。 |
| 32 | character-pair-conscientiousness-high--agreeableness-high | 座って円形の紐を見下ろし、点の付いた丸札を一枚置く猫。横には丸札の束がある。 |
| 33 | character-pair-conscientiousness-high--agreeableness-low | 座って方眼板を見下ろし、白い四角い札に前足を添える猫。 |
| 34 | character-pair-conscientiousness-low--agreeableness-high | 右へ歩きながら斜め上を見る猫。足元には緩んだリボンと二枚の葉がある。 |
| 35 | character-pair-conscientiousness-low--agreeableness-low | 方向札のそばで前足を上げ、その札を見る猫。足元にほどけた結び紐がある。 |
| 36 | character-pair-conscientiousness-high--emotionalStability-high | 三枚の札の前に座り、右端の一枚へ前足を添えて見下ろす猫。そばに浅い水皿がある。 |
| 37 | character-pair-conscientiousness-high--emotionalStability-low | 小さな灯のそばに座り、一列の玉を見下ろして一つに前足を添える猫。 |
| 38 | character-pair-conscientiousness-low--emotionalStability-high | 羽根のそばで前足を踏み出し、綿毛の方を見る猫。 |
| 39 | character-pair-conscientiousness-low--emotionalStability-low | 小敷物の上で前足を上げ、左上のサンキャッチャーを見上げる猫。 |
| 40 | character-pair-extraversion-high--agreeableness-high | 二本の舞紐の間へ前足を踏み出し、正面を見る猫。そばに小太鼓がある。 |
| 41 | character-pair-extraversion-high--agreeableness-low | 床に立てた一枚の色札へ前足を添えて座り、正面を見る猫。足元に円形の紐がある。 |
| 42 | character-pair-extraversion-low--agreeableness-high | 開いた本に前足をのせて伏せ、斜め上を見る猫。色違いの栞が二枚垂れている。 |
| 43 | character-pair-extraversion-low--agreeableness-low | 座布団の上に座り、斜め上を見る猫。手前に金具付きの短い紐がある。 |
| 44 | character-pair-extraversion-high--emotionalStability-high | 招待札が置かれた輪形の紐へ前足を踏み出し、前を見る猫。 |
| 45 | character-pair-extraversion-high--emotionalStability-low | 紙飾りと参加札を首から下げ、前足を踏み出して斜め上を見る猫。 |
| 46 | character-pair-extraversion-low--emotionalStability-high | 敷物の上に座り、種の入った小鉢を見下ろす猫。 |
| 47 | character-pair-extraversion-low--emotionalStability-low | 折り布のそばで伏せ、上に吊られた貝殻の飾りを見る猫。 |
| 48 | character-pair-agreeableness-high--emotionalStability-high | 二つの小さな杯の間に座り、斜め上を見る猫。 |
| 49 | character-pair-agreeableness-high--emotionalStability-low | 揺れる小布に前足をのせて立ち、斜め上を見る猫。そばに二つの丸札がある。 |
| 50 | character-pair-agreeableness-low--emotionalStability-high | 座って足元の一本の紐を見下ろし、紐に通した一枚の札へ前足を添える猫。 |
| 51 | character-pair-agreeableness-low--emotionalStability-low | 戸口形の小枠のそばに座り、正面を見ながら吊り下げた名札へ前足を添える猫。 |

## 人手承認記録

- 承認者: project-owner
- 承認日時: 2026-07-27T01:19:13.977Z
- 承認対象: 配信WebP 51点、上記alt 51件、称号ごとの1対1対応、画像不在時の可視フォールバック契約
- 承認後の処理: ledger全51行を `productionStatus: released` / `accessibilityReviewStatus: approved` へ更新し、release承認者と承認時刻を記録して `node scripts/characters/validate-ledger.mjs release` を実行する。

## 未解決・後続

- project-ownerの明示承認によりQ-012 release gateを閉じる。
- Task 10のmanifestは、この文書で承認されたaltを改変せずに保持する。
- Task 10以降のloaderは画像読込失敗時に承認済みaltを可視表示し、診断結果本文と共有テキストを維持する。
