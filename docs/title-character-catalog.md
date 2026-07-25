# 51称号・キャラクター演出カタログ

- 状態: 承認済みラフ
- 対象版: `title-rule-v1`
- 対象機能: F-006、F-016、T-005
- 更新日: 2026-07-25

本書は、51分類と承認済み称号ラフ、猫キャラクターの制作意図を対応付ける現行正典である。称号はBig Fiveの心理学上の正式タイプ名ではなく、結果を振り返りやすくするアプリ独自のエンタメ表現とする。

称号の詳細な表現は結果文制作時に再確認できるが、`titleId`、分類、現行称号ラフの対応を無断で入れ替えない。キャラクターは中央全身の猫1体と小物1〜2点で構成し、背景、文字、カード色をアセットへ焼き込まない。

## 1. 称号一覧

| No. | titleId | 属性 | 称号 |
|---:|---|---|---|
| 1 | `title-balanced` | バランス | 五つの風を見渡す観測者 |
| 2 | `title-single-intellectImagination-high` | 知性・想像力 高 | おいかける探究者 |
| 3 | `title-single-intellectImagination-low` | 知性・想像力 低 | 手ざわりをたどる散策者 |
| 4 | `title-single-conscientiousness-high` | 勤勉性 高 | 整然たる計画者 |
| 5 | `title-single-conscientiousness-low` | 勤勉性 低 | 風向きに道を変える漂泊者 |
| 6 | `title-single-extraversion-high` | 外向性 高 | にぎわいへ進む交遊者 |
| 7 | `title-single-extraversion-low` | 外向性 低 | 静謐なる滞在者 |
| 8 | `title-single-agreeableness-high` | 協調性 高 | 歩幅をそろえる同伴者 |
| 9 | `title-single-agreeableness-low` | 協調性 低 | 自分の歩幅で進む同行者 |
| 10 | `title-single-emotionalStability-high` | 情緒安定性 高 | 静かなる航行者 |
| 11 | `title-single-emotionalStability-low` | 情緒安定性 低 | そよ風に振り向く感受者 |
| 12 | `title-pair-intellectImagination-high--conscientiousness-high` | 知性・想像力 高 × 勤勉性 高 | 星座盤に印を置く記録者 |
| 13 | `title-pair-intellectImagination-high--conscientiousness-low` | 知性・想像力 高 × 勤勉性 低 | 風まかせの空想者 |
| 14 | `title-pair-intellectImagination-low--conscientiousness-high` | 知性・想像力 低 × 勤勉性 高 | 素朴な継続者 |
| 15 | `title-pair-intellectImagination-low--conscientiousness-low` | 知性・想像力 低 × 勤勉性 低 | 気ままな遊歩者 |
| 16 | `title-pair-intellectImagination-high--extraversion-high` | 知性・想像力 高 × 外向性 高 | 新風を運ぶ伝達者 |
| 17 | `title-pair-intellectImagination-high--extraversion-low` | 知性・想像力 高 × 外向性 低 | 静寂に星座盤を見つめる探索者 |
| 18 | `title-pair-intellectImagination-low--extraversion-high` | 知性・想像力 低 × 外向性 高 | にぎわいの談話者 |
| 19 | `title-pair-intellectImagination-low--extraversion-low` | 知性・想像力 低 × 外向性 低 | 窓辺の逗留者 |
| 20 | `title-pair-intellectImagination-high--agreeableness-high` | 知性・想像力 高 × 協調性 高 | 寄り添う共鳴者 |
| 21 | `title-pair-intellectImagination-high--agreeableness-low` | 知性・想像力 高 × 協調性 低 | 独歩の開拓者 |
| 22 | `title-pair-intellectImagination-low--agreeableness-high` | 知性・想像力 低 × 協調性 高 | 分かち合う同席者 |
| 23 | `title-pair-intellectImagination-low--agreeableness-low` | 知性・想像力 低 × 協調性 低 | 標を示す表明者 |
| 24 | `title-pair-intellectImagination-high--emotionalStability-high` | 知性・想像力 高 × 情緒安定性 高 | 凪空を仰ぐ観望者 |
| 25 | `title-pair-intellectImagination-high--emotionalStability-low` | 知性・想像力 高 × 情緒安定性 低 | 鈴音に振り向く探訪者 |
| 26 | `title-pair-intellectImagination-low--emotionalStability-high` | 知性・想像力 低 × 情緒安定性 高 | 日だまりの静観者 |
| 27 | `title-pair-intellectImagination-low--emotionalStability-low` | 知性・想像力 低 × 情緒安定性 低 | 雨音に振り向く歩行者 |
| 28 | `title-pair-conscientiousness-high--extraversion-high` | 勤勉性 高 × 外向性 高 | 刻限に集う交流者 |
| 29 | `title-pair-conscientiousness-high--extraversion-low` | 勤勉性 高 × 外向性 低 | 灯下の記録者 |
| 30 | `title-pair-conscientiousness-low--extraversion-high` | 勤勉性 低 × 外向性 高 | 道草の合流者 |
| 31 | `title-pair-conscientiousness-low--extraversion-low` | 勤勉性 低 × 外向性 低 | 余白を楽しむ散策者 |
| 32 | `title-pair-conscientiousness-high--agreeableness-high` | 勤勉性 高 × 協調性 高 | 輪を整える準備者 |
| 33 | `title-pair-conscientiousness-high--agreeableness-low` | 勤勉性 高 × 協調性 低 | 線を引く整頓者 |
| 34 | `title-pair-conscientiousness-low--agreeableness-high` | 勤勉性 低 × 協調性 高 | 寄り道をともにする同行者 |
| 35 | `title-pair-conscientiousness-low--agreeableness-low` | 勤勉性 低 × 協調性 低 | 自由な独行者 |
| 36 | `title-pair-conscientiousness-high--emotionalStability-high` | 勤勉性 高 × 情緒安定性 高 | 凪の計画者 |
| 37 | `title-pair-conscientiousness-high--emotionalStability-low` | 勤勉性 高 × 情緒安定性 低 | 揺れ灯の整頓者 |
| 38 | `title-pair-conscientiousness-low--emotionalStability-high` | 勤勉性 低 × 情緒安定性 高 | 流れをゆく漂泊者 |
| 39 | `title-pair-conscientiousness-low--emotionalStability-low` | 勤勉性 低 × 情緒安定性 低 | 揺れ影の遊歩者 |
| 40 | `title-pair-extraversion-high--agreeableness-high` | 外向性 高 × 協調性 高 | 輪舞へ踏み出す共演者 |
| 41 | `title-pair-extraversion-high--agreeableness-low` | 外向性 高 × 協調性 低 | 自分の色を掲げる表明者 |
| 42 | `title-pair-extraversion-low--agreeableness-high` | 外向性 低 × 協調性 高 | 寄り添う静観者 |
| 43 | `title-pair-extraversion-low--agreeableness-low` | 外向性 低 × 協調性 低 | 一席を選ぶ滞在者 |
| 44 | `title-pair-extraversion-high--emotionalStability-high` | 外向性 高 × 情緒安定性 高 | 寛ぐ交遊者 |
| 45 | `title-pair-extraversion-high--emotionalStability-low` | 外向性 高 × 情緒安定性 低 | ざわめきへ振り向く参加者 |
| 46 | `title-pair-extraversion-low--emotionalStability-high` | 外向性 低 × 情緒安定性 高 | 芽吹きを待つ滞在者 |
| 47 | `title-pair-extraversion-low--emotionalStability-low` | 外向性 低 × 情緒安定性 低 | 薄明に耳を向ける逗留者 |
| 48 | `title-pair-agreeableness-high--emotionalStability-high` | 協調性 高 × 情緒安定性 高 | ふたつの杯の相席者 |
| 49 | `title-pair-agreeableness-high--emotionalStability-low` | 協調性 高 × 情緒安定性 低 | 揺れ布に並ぶ同伴者 |
| 50 | `title-pair-agreeableness-low--emotionalStability-high` | 協調性 低 × 情緒安定性 高 | 淡々たる表明者 |
| 51 | `title-pair-agreeableness-low--emotionalStability-low` | 協調性 低 × 情緒安定性 低 | 風鳴る戸口の掲示者 |

## 2. 制作キュー

制作キューは称号の意味を心理学的に追加判定するものではない。小物、視線、姿勢でカード上の情景を作るための指示である。

| No. | 小物1〜2点 | 視線・姿勢 |
|---:|---|---|
| 1 | 五枚の葉のモビール | 中央で座り、上を見上げる |
| 2 | 蝶、スケッチブック | 蝶へ視線と前足を向ける |
| 3 | 木の実、素朴な籠 | 足もとを見ながら歩く |
| 4 | 手帳、順番札 | 座って札を一枚置く |
| 5 | 風見、舞う葉 | 枝道へ体を向ける |
| 6 | 輪形の紐、会話札 | 輪へ胸と視線を向ける |
| 7 | 鉢植え、小さなカップ | 香箱座りで画面外を見る |
| 8 | 対の足跡、結び紐 | 隣を意識して歩幅を合わせる |
| 9 | 自分の標、分かれ道札 | 一方の標へ前足を添える |
| 10 | 方位磁針、水面形の皿 | 尾を沿わせて正面を見る |
| 11 | 風鈴、細いリボン | 耳を上げて風鈴へ振り向く |
| 12 | 星座盤、印を置くペン | 星座盤へ前足を添える |
| 13 | 風見、舞う紙片 | 紙片を目で追う |
| 14 | 木の実、小籠 | 木の実を一つずつ置く |
| 15 | 一枚の葉、布袋 | 葉の前で歩みを止める |
| 16 | 紙飛行機、会話札 | 紙飛行機を輪の方へ見送る |
| 17 | 星座盤、小望遠鏡 | 伏せながら星座盤を見る |
| 18 | 日用品の絵札、丸い敷物 | 絵札を囲む輪へ身を向ける |
| 19 | 鉢植え、小さなカップ | 香箱座りで画面外を見る |
| 20 | 蝶、対の葉 | 隣を意識しながら蝶を見上げる |
| 21 | 分岐標、新芽 | 自分の標へ前足を添える |
| 22 | 木の実籠、二つの小皿 | 一粒を片方の皿へ置く |
| 23 | 名札、短い境界紐 | 自分側の札へ前足を添える |
| 24 | 三日月のモビール、ガラス玉 | 座って静かに見上げる |
| 25 | 小鈴、プリズム | 耳を立てて半身で振り向く |
| 26 | 日輪形の敷物、カップ | 香箱座りで足もとを見る |
| 27 | 雨粒の飾り、丸石 | 歩みながら横を向く |
| 28 | 懐中時計、招待札 | 札を携えて輪へ顔を向ける |
| 29 | 砂時計、予定札 | 座って砂の流れを見る |
| 30 | ほどけたリボン、祭鈴 | 進路を変えて輪を見る |
| 31 | 白紙の巻物、羽根 | 巻物の脇をゆっくり歩く |
| 32 | 円形の紐、番号札 | 一枚を輪へ置く |
| 33 | 仕切り札、方眼板 | 自分側へ札を置く |
| 34 | 緩んだリボン、対の葉 | 隣を意識して向きを変える |
| 35 | 方向札、ほどけた結び | 別の小径へ踏み出す |
| 36 | 浅い水皿、三枚の札 | 座って一枚へ前足を添える |
| 37 | 小さな灯、一列の玉 | 耳を立てて玉を一つ動かす |
| 38 | 羽根、綿毛 | 尾を緩めて体の向きを変える |
| 39 | サンキャッチャー、小敷物 | 揺れる光を見て横へ一歩移る |
| 40 | 二本の舞紐、小太鼓 | 輪へ前足を踏み出す |
| 41 | 一枚の色札、円形の紐 | 胸を起こして色札を掲げる |
| 42 | 開いた本、色違いの栞二枚 | 空いた側を意識して伏せる |
| 43 | 座布団、短い仕切り紐 | 間を取って座る |
| 44 | 輪形の紐、招待札 | 尾を下ろして輪へ歩く |
| 45 | 紙飾り、参加札 | 耳を立てて前足を踏み出す |
| 46 | 種の小鉢、敷物 | ゆったり座って小鉢を見る |
| 47 | 貝殻の飾り、折り布 | 伏せながら耳を飾りへ向ける |
| 48 | 二つの小さな杯 | 空いた側へ顔を向ける |
| 49 | 揺れる小布、二つの丸札 | 耳を上げて札の隣へ立つ |
| 50 | 一本の紐、一枚の札 | 座ったまま境目へ札を置く |
| 51 | 戸口形の小枠、名札 | 耳を立てて札へ前足を添える |

## 3. 横断ルール

- 完全同一称号は禁止する。現行51件に完全同一称号はない。
- 末尾の役割語は重複を許容するが、称号全文、カード小物、姿勢で識別できること。
- 難しい語や文学的表現は称号のエンタメ性として許容するが、中立副題と因子説明は平易な日本語にする。
- No.14、20、21、35、42、50は、能力、善良さ、優越、孤立、冷淡さへ読まれないよう、中立副題と称号理由で解釈範囲を明示する。
- 対人場面を表す場合も二匹目の猫を描かず、対の小物、足跡、画面外への視線で示す。
- 風景、空、群衆、窓景、日だまり、川、影、薄明は背景へ焼き込まず、小物と姿勢へ変換する。
- 星座盤は天体観察用として描き、黄道十二宮、生年月日、運勢表示を使わない。
- No.2のもなかキャラクターは、蝶とスケッチブックの2点へ絞る。若葉はカード装飾側で必要な場合だけ使用する。
- 毛色、猫種、体格、性別、年齢と因子、能力、善悪、序列を結び付けない。
