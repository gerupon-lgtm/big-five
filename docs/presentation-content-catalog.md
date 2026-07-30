# Q-013 Presentation v2 承認レビュー

正典: content/source/presentation/presentation-v2/*.csv

本書は承認用の生成ビューであり、手編集しない。

すべての行とP-0〜P-6は未承認のドラフトであり、本書の生成は承認またはruntime有効化を意味しない。

## P-0 パレットと用途色（draft）

| ID | ラベル | 基調色 primary / secondary / accent | 用途色レシピ | 解決色 background / surface / accent / chart / text | 比率 text-bg / text-surface / accent-surface / chart-bg | 判定 | 説明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `palette-balanced-1` | 澄み切った空色 | #7C8791 / #8FAFC1 / #A8B7A1 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F5F6 / #F9FBFC / #5C6559 / #444A50 / #1F2430 | 14.242 / 14.951 / 5.846 / 8.233 | 適合 | 複数の方向を等しく見渡す中立的な印象。 |
| `palette-balanced-2` | 静謐な白 | #8FAFC1 / #A8B7A1 / #7C8791 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F9FA / #FBFBFA / #444A50 / #4F606A / #1F2430 | 14.667 / 14.987 / 8.663 / 6.176 | 適合 | 状況に応じて表情を変える静かな空のイメージ。 |
| `palette-balanced-3` | 穏やかな草原の緑 | #A8B7A1 / #7C8791 / #8FAFC1 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F8F9F7 / #F8F9FA / #4F606A / #5C6559 / #1F2430 | 14.694 / 14.721 / 6.199 / 5.746 | 適合 | 偏りを強調せず、穏やかに全体をつなぐ色。 |
| `palette-single-intellectimagination-high-1` | 深い知性の紺色 | #4E5D94 / #7567A8 / #4FA8B8 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F1F2F6 / #F8F7FB / #2B5C65 / #2B3351 / #1F2430 | 13.871 / 14.549 / 6.978 / 11.074 | 適合 | 未知のテーマへ視線を伸ばす深い青紫。 |
| `palette-single-intellectimagination-high-2` | 閃きを象徴する金黄色 | #7567A8 / #4FA8B8 / #4E5D94 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F3F8 / #F6FBFB / #2B3351 / #40395C / #1F2430 | 14.056 / 14.860 / 11.864 / 9.716 | 適合 | 発想や概念が広がる星図のような色。 |
| `palette-single-intellectimagination-high-3` | 未知への好奇心を誘う紫 | #4FA8B8 / #4E5D94 / #7567A8 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F1F8F9 / #F6F7FA / #40395C / #2B5C65 / #1F2430 | 14.435 / 14.486 / 10.013 / 6.924 | 適合 | 新しい着想がひらく瞬間を思わせる色。 |
| `palette-single-intellectimagination-low-1` | 大地の温もりを宿す茶色 | #8C735B / #8B8D88 / #89956B | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F4F2 / #F9F9F9 / #4B523B / #4D3F32 / #1F2430 | 14.144 / 14.739 / 7.763 / 9.235 | 適合 | 具体的な手ざわりと足元の道を表す色。 |
| `palette-single-intellectimagination-low-2` | 柔らかな陽だまりのベージュ | #8B8D88 / #89956B / #8C735B | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F6F5 / #F9FAF8 / #4D3F32 / #4C4E4B / #1F2430 | 14.350 / 14.821 / 9.677 / 7.772 | 適合 | 確かめられるものを一つずつ辿る印象。 |
| `palette-single-intellectimagination-low-3` | 落ち着いたモスグリーン | #89956B / #8C735B / #8B8D88 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F7F3 / #F9F8F7 / #4C4E4B / #4B523B / #1F2430 | 14.422 / 14.630 / 7.923 / 7.596 | 適合 | 身近な経験や現実感を象徴する落ち着いた緑。 |
| `palette-single-conscientiousness-high-1` | 規律ある濃紺 | #40566F / #6986A3 / #6E7881 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F1F3 / #F8F9FA / #3D4247 / #232F3D / #1F2430 | 13.731 / 14.721 / 9.630 / 12.023 | 適合 | 計画や段取りを整える端正な印象。 |
| `palette-single-conscientiousness-high-2` | 静止した空気のグレー | #6986A3 / #6E7881 / #40566F | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F5F8 / #F8F8F9 / #232F3D / #3A4A5A / #1F2430 | 14.208 / 14.621 / 12.803 / 8.334 | 適合 | 区切りと見通しを感じさせる実務的な青。 |
| `palette-single-conscientiousness-high-3` | 誠実な白磁色 | #6E7881 / #40566F / #6986A3 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F4F5 / #F5F7F8 / #3A4A5A / #3D4247 / #1F2430 | 14.091 / 14.441 / 8.471 / 9.218 | 適合 | 秩序立てて積み重ねる姿を表す色。 |
| `palette-single-conscientiousness-low-1` | 自由な風のスカイブルー | #4F9C98 / #7FA36B / #C2AA84 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F1F7F7 / #F9FAF8 / #6B5E49 / #2B5654 / #1F2430 | 14.326 / 14.821 / 6.037 / 7.568 | 適合 | 流れに応じて方向を変える軽やかな青緑。 |
| `palette-single-conscientiousness-low-2` | 移ろいゆく雲の白 | #7FA36B / #C2AA84 / #4F9C98 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F8F3 / #FCFBF9 / #2B5654 / #465A3B / #1F2430 | 14.486 / 15.005 / 7.926 / 7.036 | 適合 | 決めすぎず自然に進む柔軟な印象。 |
| `palette-single-conscientiousness-low-3` | 軽やかな若草色 | #C2AA84 / #4F9C98 / #7FA36B | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FAF8F5 / #F6FAFA / #465A3B / #6B5E49 / #1F2430 | 14.639 / 14.759 / 7.169 / 5.963 | 適合 | 行き先を固定しない広い余白を象徴する色。 |
| `palette-single-extraversion-high-1` | 陽気なサンフラワーイエロー | #E07868 / #E69A4B / #38A8A0 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FDF4F3 / #FEFAF6 / #1F5C58 / #7B4239 / #1F2430 | 14.344 / 14.941 / 7.406 / 7.241 | 適合 | 人の輪へ自然に進む温かい活気。 |
| `palette-single-extraversion-high-2` | 情熱的なコーラルピンク | #E69A4B / #38A8A0 / #E07868 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FDF7F1 / #F5FBFA / #7B4239 / #7F5529 / #1F2430 | 14.595 / 14.824 / 7.484 / 6.108 | 適合 | にぎわいと開放感を表す明るい色。 |
| `palette-single-extraversion-high-3` | 活気に満ちたオレンジ | #38A8A0 / #E07868 / #E69A4B | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #EFF8F7 / #FDF8F7 / #7F5529 / #1F5C58 / #1F2430 | 14.365 / 14.739 / 6.168 / 7.121 | 適合 | 交流の流れと軽快さを象徴する青緑。 |
| `palette-single-extraversion-low-1` | 深い夜のミッドナイトブルー | #394A63 / #596F86 / #6E687E | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #EFF1F3 / #F7F8F9 / #3D3945 / #1F2936 / #1F2430 | 13.705 / 14.594 / 10.564 / 12.981 | 適合 | 静かな環境に長く留まる深い青。 |
| `palette-single-extraversion-low-2` | 静寂を纏うシルバーグレー | #596F86 / #6E687E / #394A63 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F2F3F5 / #F8F7F9 / #1F2936 / #313D4A / #1F2430 | 13.976 / 14.530 / 13.763 / 9.971 | 適合 | 外を眺めながら内側を整える色。 |
| `palette-single-extraversion-low-3` | 落ち着いた藤色 | #6E687E / #394A63 / #596F86 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F3F5 / #F5F6F7 / #313D4A / #3D3945 / #1F2430 | 14.003 / 14.341 / 10.231 / 10.136 | 適合 | 控えめな存在感と落ち着きを表す紫灰。 |
| `palette-single-agreeableness-high-1` | 温かなパステルピンク | #C98591 / #91A98F / #C8B49A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FBF5F6 / #FAFBF9 / #6E6355 / #6F4950 / #1F2430 | 14.405 / 14.950 / 5.653 / 7.102 | 適合 | 歩幅を合わせる温かな関わりを象徴。 |
| `palette-single-agreeableness-high-2` | 包容力のあるミントグリーン | #91A98F / #C8B49A / #C98591 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F8F6 / #FCFBFA / #6F4950 / #505D4F / #1F2430 | 14.540 / 15.014 / 7.403 / 6.516 | 適合 | 周囲との調和をやわらかく支える緑。 |
| `palette-single-agreeableness-high-3` | 穏やかなアイボリー | #C8B49A / #C98591 / #91A98F | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FBF9F7 / #FCF9FA / #505D4F / #6E6355 / #1F2430 | 14.775 / 14.830 / 6.646 / 5.587 | 適合 | 相手を受け止める穏やかな印象。 |
| `palette-single-agreeableness-low-1` | 意志ある深い赤 | #A65F4B / #495A72 / #B58A4C | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F8F2F1 / #F6F7F8 / #644C2A / #5B3429 / #1F2430 | 14.012 / 14.467 / 7.504 / 9.635 | 適合 | 自分の歩幅を保つ確かな存在感。 |
| `palette-single-agreeableness-low-2` | 独立心を示す深い緑 | #495A72 / #B58A4C / #A65F4B | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F2F4 / #FBF9F6 / #5B3429 / #28323F / #1F2430 | 13.827 / 14.766 / 10.154 / 11.563 | 適合 | 自分の基準や距離感を示す青。 |
| `palette-single-agreeableness-low-3` | 揺るがない鉄灰色 | #B58A4C / #A65F4B / #495A72 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F9F6F1 / #FBF7F6 / #28323F / #644C2A / #1F2430 | 14.395 / 14.584 / 12.197 / 7.466 | 適合 | 率直さと現実的な判断を思わせる色。 |
| `palette-single-emotionalstability-high-1` | 凪いだ海の深い青 | #5F86A3 / #405D73 / #6D9287 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F2F5F8 / #F5F7F8 / #3C504A / #344A5A / #1F2430 | 14.182 / 14.441 / 8.014 / 8.443 | 適合 | 波立ちの少ない水面を思わせる青。 |
| `palette-single-emotionalstability-high-2` | 安らぎを運ぶ淡い水色 | #405D73 / #6D9287 / #5F86A3 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F2F4 / #F8FAF9 / #344A5A / #23333F / #1F2430 | 13.827 / 14.803 / 8.813 / 11.574 | 適合 | 落ち着いて進む航路を象徴する色。 |
| `palette-single-emotionalstability-high-3` | 静穏なパールホワイト | #6D9287 / #5F86A3 / #405D73 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F6F5 / #F7F9FA / #23333F / #3C504A / #1F2430 | 14.270 / 14.694 / 12.300 / 7.920 | 適合 | 穏やかな持続感を表す青緑。 |
| `palette-single-emotionalstability-low-1` | 繊細な薄紅色の花びら | #9A83AD / #86A8B8 / #C99AA3 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F7F5F8 / #F9FBFB / #6F555A / #55485F / #1F2430 | 14.314 / 14.941 / 6.475 / 7.816 | 適合 | 小さな変化を受け取る繊細な紫。 |
| `palette-single-emotionalstability-low-2` | 揺れる水面の淡い青 | #86A8B8 / #C99AA3 / #9A83AD | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F8F9 / #FCFAFA / #55485F / #4A5C65 / #1F2430 | 14.540 / 14.922 / 8.148 / 6.537 | 適合 | 周囲の気配に振り向く軽い青。 |
| `palette-single-emotionalstability-low-3` | 移ろう光の淡い紫 | #C99AA3 / #9A83AD / #86A8B8 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FBF7F8 / #FAF9FB / #4A5C65 / #6F555A / #1F2430 | 14.603 / 14.785 / 6.647 / 6.328 | 適合 | 細やかな反応をやわらかく表す色。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-high-1` | 星夜の深い紺 | #344A72 / #B8954F / #665B94 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #EFF1F4 / #FBFAF6 / #383251 / #1D293F / #1F2430 | 13.714 / 14.858 / 11.534 / 12.877 | 適合 | 構想と記録を同時に支える深い青。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-high-2` | 精緻な記録の黄金色 | #B8954F / #665B94 / #344A72 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F9F7F1 / #F7F7FA / #1D293F / #65522B / #1F2430 | 14.485 / 14.512 / 13.627 / 7.013 | 適合 | 印を置き積み重ねる行為を象徴。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-high-3` | 冷静な思考の白 | #665B94 / #344A72 / #B8954F | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F2F6 / #F5F6F8 / #65522B / #383251 / #1F2430 | 13.923 / 14.350 / 6.948 / 10.809 | 適合 | 発想を構造へ落とし込む紫。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-low-1` | 夢幻的なペールバイオレット | #9A83C1 / #6F9FBB / #7FB7A5 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F7F5FA / #F8FAFC / #46655B / #55486A / #1F2430 | 14.333 / 14.831 / 6.132 / 7.693 | 適合 | 自由に広がる想像の余白。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-low-2` | 自由な空の淡い青 | #6F9FBB / #7FB7A5 / #9A83C1 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F7FA / #F9FBFB / #55486A / #3D5767 / #1F2430 | 14.406 / 14.941 / 8.020 / 7.070 | 適合 | 形を変えながら流れる発想を表す青。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-low-3` | 想像力を刺激する琥珀色 | #7FB7A5 / #9A83C1 / #6F9FBB | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F9F8 / #FAF9FC / #3D5767 / #46655B / #1F2430 | 14.622 / 14.794 / 7.260 / 6.046 | 適合 | 軽やかに方向を変える青緑。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-high-1` | 実直な土の色 | #7C875A / #8E735E / #94928A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F5F2 / #F9F8F7 / #51504C / #444A32 / #1F2430 | 14.207 / 14.630 / 7.610 / 8.464 | 適合 | 具体的な歩みを着実に重ねる色。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-high-2` | 誠実な深い緑 | #8E735E / #94928A / #7C875A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F4F2 / #FAFAF9 / #444A32 / #4E3F34 / #1F2430 | 14.144 / 14.858 / 8.852 / 9.182 | 適合 | 手を動かし続ける実直な印象。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-high-3` | 飾らない生成り色 | #94928A / #7C875A / #8E735E | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F6F6 / #F8F9F7 / #4E3F34 / #51504C / #1F2430 | 14.359 / 14.694 / 9.539 / 7.469 | 適合 | 飾らず続ける姿勢を象徴。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-low-1` | 陽光を浴びた淡い黄色 | #C3A980 / #94B79E / #89A6B1 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FAF8F5 / #FAFBFA / #4B5B61 / #6B5D46 / #1F2430 | 14.639 / 14.959 / 6.820 / 6.041 | 適合 | 気ままに歩く道の余白。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-low-2` | 気ままな風のミントグリーン | #94B79E / #89A6B1 / #C3A980 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F9F7 / #F9FBFB / #6B5D46 / #516557 / #1F2430 | 14.640 / 14.941 / 6.166 / 5.916 | 適合 | その場の流れへ自然に馴染む色。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-low-3` | 柔らかな砂の色 | #89A6B1 / #C3A980 / #94B79E | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F8F9 / #FCFBF9 / #516557 / #4B5B61 / #1F2430 | 14.567 / 15.005 / 6.063 / 6.642 | 適合 | 決めすぎない穏やかな移動感。 |
| `palette-pair-intellectimagination-high-and-extraversion-high-1` | 鮮やかなターコイズブルー | #27A9B8 / #DF7168 / #D9B54A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #EEF8F9 / #FDF8F7 / #776429 / #155D65 / #1F2430 | 14.358 / 14.739 / 5.481 / 6.975 | 適合 | 新しい考えを外へ運ぶ鮮やかな青。 |
| `palette-pair-intellectimagination-high-and-extraversion-high-2` | 活力を運ぶオレンジゴールド | #DF7168 / #D9B54A / #27A9B8 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FCF4F3 / #FDFBF6 / #155D65 / #7B3E39 / #1F2430 | 14.316 / 15.005 / 7.290 / 7.479 | 適合 | 言葉や交流の熱を象徴する色。 |
| `palette-pair-intellectimagination-high-and-extraversion-high-3` | 知的な輝きの白 | #D9B54A / #27A9B8 / #DF7168 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FCF9F1 / #F4FBFB / #7B3E39 / #776429 / #1F2430 | 14.749 / 14.807 / 7.736 / 5.484 | 適合 | 着想が人の輪に届く明るさ。 |
| `palette-pair-intellectimagination-high-and-extraversion-low-1` | 静寂を極めた深い黒 | #3F4B78 / #665C91 / #5E91A4 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F1F4 / #F7F7FA / #34505A / #232942 / #1F2430 | 13.739 / 14.512 / 8.045 / 12.672 | 適合 | 静かな場所で思索を深める色。 |
| `palette-pair-intellectimagination-high-and-extraversion-low-2` | 宇宙の深淵を映す紫 | #665C91 / #5E91A4 / #3F4B78 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F2F6 / #F7FAFA / #232942 / #383350 / #1F2430 | 13.923 / 14.786 / 13.637 / 10.721 | 適合 | 内側で広がる星図を思わせる紫。 |
| `palette-pair-intellectimagination-high-and-extraversion-low-3` | 遠い星の淡い光色 | #5E91A4 / #3F4B78 / #665C91 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F2F6F8 / #F5F6F8 / #383350 / #34505A / #1F2430 | 14.271 / 14.350 / 11.050 / 7.912 | 適合 | 静寂の中に見つかる新しい視点。 |
| `palette-pair-intellectimagination-low-and-extraversion-high-1` | 賑やかな明るい黄色 | #D88A45 / #D56F67 / #459B98 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FCF6F0 / #FDF8F7 / #265554 / #774C26 / #1F2430 | 14.468 / 14.739 / 7.947 / 6.879 | 適合 | 身近な話題を囲む温かな活気。 |
| `palette-pair-intellectimagination-low-and-extraversion-high-2` | 親しみやすいアプリコット | #D56F67 / #459B98 / #D88A45 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FCF3F3 / #F6FAFA / #774C26 / #753D39 / #1F2430 | 14.227 / 14.759 / 7.018 / 7.754 | 適合 | 人と人の距離を縮める明るい色。 |
| `palette-pair-intellectimagination-low-and-extraversion-high-3` | 活気ある明るい緑 | #459B98 / #D88A45 / #D56F67 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F7F7 / #FDF9F6 / #753D39 / #265554 / #1F2430 | 14.300 / 14.821 / 8.078 / 7.711 | 適合 | にぎわいの中を軽快に行き交う印象。 |
| `palette-pair-intellectimagination-low-and-extraversion-low-1` | 午後の日差しのベージュ | #7E8589 / #667C8B / #8C7562 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F5F6 / #F7F8F9 / #4D4036 / #45494B / #1F2430 | 14.242 / 14.594 / 9.395 / 8.352 | 適合 | 静かな室内と外の景色の境界。 |
| `palette-pair-intellectimagination-low-and-extraversion-low-2` | 穏やかな窓辺の薄青 | #667C8B / #8C7562 / #7E8589 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F5F6 / #F9F8F7 / #45494B / #38444C / #1F2430 | 14.190 / 14.630 / 8.579 / 9.147 | 適合 | 慣れた場所に留まる落ち着き。 |
| `palette-pair-intellectimagination-low-and-extraversion-low-3` | 静かな時間の色である淡いグレー | #8C7562 / #7E8589 / #667C8B | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F4F2 / #F9F9F9 / #38444C / #4D4036 / #1F2430 | 14.144 / 14.739 / 9.501 / 9.105 | 適合 | 身近で具体的な環境を象徴する色。 |
| `palette-pair-intellectimagination-high-and-agreeableness-high-1` | 共鳴し合う淡いピンク | #B87C96 / #77659A / #74A9A4 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F9F5F7 / #F8F7FA / #405D5A / #654453 / #1F2430 | 14.359 / 14.539 / 6.712 / 7.757 | 適合 | 相手の考えに響き合う柔らかな色。 |
| `palette-pair-intellectimagination-high-and-agreeableness-high-2` | 包み込むような若草色 | #77659A / #74A9A4 / #B87C96 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F3F7 / #F8FBFA / #654453 / #413855 / #1F2430 | 14.047 / 14.905 / 8.052 / 9.893 | 適合 | 多様な視点をつなぐ紫。 |
| `palette-pair-intellectimagination-high-and-agreeableness-high-3` | 調和を促すソフトブルー | #74A9A4 / #B87C96 / #77659A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F8F8 / #FBF8FA / #413855 / #405D5A / #1F2430 | 14.505 / 14.712 / 10.361 / 6.696 | 適合 | 理解と共感が広がる青緑。 |
| `palette-pair-intellectimagination-high-and-agreeableness-low-1` | 強い意志を宿す深い赤 | #315E87 / #694C91 / #C46F3F | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #EFF2F5 / #F8F6FA / #6C3D23 / #1B344A / #1F2430 | 13.810 / 14.449 / 8.394 / 11.419 | 適合 | 未知へ踏み出す独立した視線。 |
| `palette-pair-intellectimagination-high-and-agreeableness-low-2` | 未踏の地を拓く深い青 | #694C91 / #C46F3F / #315E87 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F1F6 / #FCF8F5 / #1B344A / #3A2A50 / #1F2430 | 13.836 / 14.693 / 12.149 / 11.509 | 適合 | 既存の枠から離れる発想を象徴。 |
| `palette-pair-intellectimagination-high-and-agreeableness-low-3` | 鋭い理性の白 | #C46F3F / #315E87 / #694C91 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FAF3F0 / #F5F7F9 / #3A2A50 / #6C3D23 / #1F2430 | 14.146 / 14.450 / 12.019 / 8.218 | 適合 | 自分の道を切り開く力強い差し色。 |
| `palette-pair-intellectimagination-low-and-agreeableness-high-1` | 温かなピーチピンク | #C3AD91 / #8FA487 / #C88F8B | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FAF8F6 / #F9FAF9 / #6E4F4C / #6B5F50 / #1F2430 | 14.648 / 14.831 / 6.955 / 5.868 | 適合 | 身近な経験を分かち合う温かさ。 |
| `palette-pair-intellectimagination-low-and-agreeableness-high-2` | 安らぎを分かつセージグリーン | #8FA487 / #C88F8B / #C3AD91 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F8F5 / #FCF9F9 / #6B5F50 / #4F5A4A / #1F2430 | 14.531 / 14.821 / 5.938 / 6.795 | 適合 | 実際的な支え合いを象徴する緑。 |
| `palette-pair-intellectimagination-low-and-agreeableness-high-3` | 穏やかなクリーム色 | #C88F8B / #C3AD91 / #8FA487 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FBF6F6 / #FCFBFA / #4F5A4A / #6E4F4C / #1F2430 | 14.494 / 15.014 / 7.021 / 6.797 | 適合 | 同じ場を囲む親しみの色。 |
| `palette-pair-intellectimagination-low-and-agreeableness-low-1` | 断定的な濃い赤 | #B27F3F / #45566E / #747A78 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F9F5F0 / #F6F7F8 / #404342 / #624623 / #1F2430 | 14.296 / 14.467 / 9.325 / 7.996 | 適合 | 具体的な基準を示す明確な色。 |
| `palette-pair-intellectimagination-low-and-agreeableness-low-2` | 明確な視界の白 | #45566E / #747A78 / #B27F3F | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F1F3 / #F8F8F8 / #624623 / #262F3D / #1F2430 | 13.731 / 14.612 / 8.172 / 11.939 | 適合 | 自分の判断を落ち着いて掲げる青。 |
| `palette-pair-intellectimagination-low-and-agreeableness-low-3` | 揺るぎない黒 | #747A78 / #B27F3F / #45566E | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F4F4 / #FBF9F5 / #262F3D / #404342 / #1F2430 | 14.109 / 14.757 / 12.831 / 9.094 | 適合 | 事実に基づく硬質な印象。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-high-1` | 凪いだ空のライトブルー | #6A96B3 / #4E6188 / #78A99E | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F7F9 / #F6F7F9 / #425D57 / #3A5362 / #1F2430 | 14.397 / 14.476 / 6.675 / 7.512 | 適合 | 広い視野と静かな安定を表す青。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-high-2` | 静観する深い紺色 | #4E6188 / #78A99E / #6A96B3 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F1F2F5 / #F8FBFA / #3A5362 / #2B354B / #1F2430 | 13.862 / 14.905 / 7.777 / 10.948 | 適合 | 遠くまで考えを伸ばす深い色。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-high-3` | 澄み切ったクリスタルホワイト | #78A99E / #6A96B3 / #4E6188 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F8F7 / #F8FAFB / #2B354B / #425D57 / #1F2430 | 14.496 / 14.822 / 11.706 / 6.684 | 適合 | 落ち着いた広がりを象徴する青緑。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-low-1` | 震える心の色である淡い紫 | #9C83B3 / #5B9FB0 / #C58B9C | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F7F5F9 / #F7FAFB / #6C4C56 / #564862 / #1F2430 | 14.323 / 14.795 / 7.136 / 7.757 | 適合 | 細やかな気配へ反応する紫。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-low-2` | 瑞々しい朝の緑 | #5B9FB0 / #C58B9C / #9C83B3 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F2F7F9 / #FCF9FA / #564862 / #325761 / #1F2430 | 14.371 / 14.830 / 8.031 / 7.280 | 適合 | 新しい方向へ視線を動かす青。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-low-3` | 繊細な光のシルバー | #C58B9C / #9C83B3 / #5B9FB0 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FAF6F7 / #FAF9FB / #325761 / #6C4C56 / #1F2430 | 14.476 / 14.785 / 7.489 / 6.982 | 適合 | 感受性と好奇心が重なる柔らかな色。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-high-1` | 暖かな陽だまりの黄色 | #D0B58D / #92A083 / #B99A5A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FBF9F6 / #FAFAF9 / #665532 / #72644E / #1F2430 | 14.766 / 14.858 / 6.909 / 5.477 | 適合 | 穏やかで具体的な安心感。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-high-2` | 穏やかな午後のベージュ | #92A083 / #B99A5A / #D0B58D | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F7F5 / #FCFAF7 / #72644E / #505848 / #1F2430 | 14.440 / 14.894 / 5.525 / 6.904 | 適合 | 身近な現実を落ち着いて眺める緑。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-high-3` | 安静な庭の緑 | #B99A5A / #D0B58D / #92A083 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F9F7F2 / #FDFBF9 / #505848 / #665532 / #1F2430 | 14.494 / 15.032 / 7.187 / 6.739 | 適合 | 変化を急がず時間を重ねる色。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-low-1` | しっとりとした雨のグレー | #708EA3 / #7E858A / #748C78 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F6F8 / #F9F9F9 / #404D42 / #3E4E5A / #1F2430 | 14.324 / 14.739 / 8.458 / 7.937 | 適合 | 小さな変化に気づく静かな青。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-low-2` | 濡れた葉の深い緑 | #7E858A / #748C78 / #708EA3 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F5F6 / #F8F9F8 / #3E4E5A / #45494C / #1F2430 | 14.242 / 14.703 / 8.147 / 8.342 | 適合 | 足元を確かめながら進む色。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-low-3` | 憂いを帯びた淡いブルー | #748C78 / #708EA3 / #7E858A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F6F4 / #F8F9FA / #45494C / #404D42 / #1F2430 | 14.288 / 14.721 / 8.623 / 8.199 | 適合 | 身近な環境の変化を象徴する緑。 |
| `palette-pair-conscientiousness-high-and-extraversion-high-1` | 効率的な深い青 | #3F5B77 / #DD8444 / #B9964D | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F2F4 / #FDF9F6 / #66532A / #233241 / #1F2430 | 13.827 / 14.821 / 7.073 / 11.666 | 適合 | 予定と役割を明確にする青。 |
| `palette-pair-conscientiousness-high-and-extraversion-high-2` | 社交的な明るいオレンジ | #DD8444 / #B9964D / #3F5B77 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FCF5F0 / #FCFAF6 / #233241 / #7A4925 / #1F2430 | 14.378 / 14.885 / 12.558 / 6.931 | 適合 | 人の輪へ働きかける明るさ。 |
| `palette-pair-conscientiousness-high-and-extraversion-high-3` | 整理された白 | #B9964D / #3F5B77 / #DD8444 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F9F7F1 / #F5F7F8 / #7A4925 / #66532A / #1F2430 | 14.485 / 14.441 / 6.961 / 6.913 | 適合 | 時間を意識して動く印象。 |
| `palette-pair-conscientiousness-high-and-extraversion-low-1` | 集中を高める深い黒 | #B47B3E / #45556C / #8B8983 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F9F4F0 / #F6F7F8 / #4C4B48 / #634422 / #1F2430 | 14.207 / 14.467 / 8.133 / 8.077 | 適合 | 静かな机上を照らす灯りの色。 |
| `palette-pair-conscientiousness-high-and-extraversion-low-2` | 灯火の温かな琥珀色 | #45556C / #8B8983 / #B47B3E | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F1F3 / #F9F9F9 / #634422 / #262F3B / #1F2430 | 13.731 / 14.739 / 8.379 / 11.971 | 適合 | 丁寧な作業と集中を象徴する青。 |
| `palette-pair-conscientiousness-high-and-extraversion-low-3` | 紙のような淡いアイボリー | #8B8983 / #B47B3E / #45556C | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F6F5 / #FBF8F5 / #262F3B / #4C4B48 / #1F2430 | 14.350 / 14.666 / 12.787 / 8.067 | 適合 | 積み重なる記録の落ち着いた色。 |
| `palette-pair-conscientiousness-low-and-extraversion-high-1` | 軽やかな若葉色 | #D97666 / #8DA65E / #75A2B4 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FCF4F3 / #F9FBF7 / #405963 / #774138 / #1F2430 | 14.316 / 14.904 / 7.134 / 7.458 | 適合 | 予定外の出会いを楽しむ温かさ。 |
| `palette-pair-conscientiousness-low-and-extraversion-high-2` | 偶然を象徴する明るい黄色 | #8DA65E / #75A2B4 / #D97666 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F8F2 / #F8FAFB / #774138 / #4E5B34 / #1F2430 | 14.504 / 14.822 / 7.722 / 6.839 | 適合 | 寄り道と柔軟な動きを表す緑。 |
| `palette-pair-conscientiousness-low-and-extraversion-high-3` | 自由な空の青 | #75A2B4 / #D97666 / #8DA65E | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F8F9 / #FDF8F7 / #4E5B34 / #405963 / #1F2430 | 14.514 / 14.739 / 6.950 / 6.948 | 適合 | 人の流れへ軽やかに合流する青。 |
| `palette-pair-conscientiousness-low-and-extraversion-low-1` | 贅沢な余白の白 | #D7D0C2 / #9BAA91 / #91A5AF | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FCFBFA / #FAFBFA / #505B60 / #76726B / #1F2430 | 15.014 / 14.959 / 6.734 / 4.629 | 適合 | 空白をそのまま楽しむ穏やかな色。 |
| `palette-pair-conscientiousness-low-and-extraversion-low-2` | 穏やかな散策のライトグリーン | #9BAA91 / #91A5AF / #D7D0C2 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F7F8F6 / #FAFBFB / #76726B / #555E50 / #1F2430 | 14.566 / 14.968 / 4.615 / 6.352 | 適合 | 静かな自分のペースを表す緑。 |
| `palette-pair-conscientiousness-low-and-extraversion-low-3` | 心を解き放つ淡い水色 | #91A5AF / #D7D0C2 / #9BAA91 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F8F9 / #FDFDFC / #555E50 / #505B60 / #1F2430 | 14.567 / 15.246 / 6.649 / 6.557 | 適合 | 急がず漂う時間を象徴する青灰。 |
| `palette-pair-conscientiousness-high-and-agreeableness-high-1` | 調和を司るミントグリーン | #829A7D / #657F96 / #C38A88 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F7F5 / #F7F9FA / #6B4C4B / #485545 / #1F2430 | 14.413 / 14.694 / 7.204 / 7.330 | 適合 | 周囲を整える穏やかな緑。 |
| `palette-pair-conscientiousness-high-and-agreeableness-high-2` | 責任感ある深い紺 | #657F96 / #C38A88 / #829A7D | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F5F7 / #FCF9F9 / #485545 / #384653 / #1F2430 | 14.199 / 14.821 / 7.538 / 8.858 | 適合 | 役割や段取りを見通しよくする青。 |
| `palette-pair-conscientiousness-high-and-agreeableness-high-3` | 準備を整えるベージュ | #C38A88 / #829A7D / #657F96 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FAF6F5 / #F9FAF9 / #384653 / #6B4C4B / #1F2430 | 14.458 / 14.831 / 9.253 / 7.088 | 適合 | 人を迎える温かさを添える色。 |
| `palette-pair-conscientiousness-high-and-agreeableness-low-1` | 厳格な境界線の黒 | #5F6A73 / #3F5268 / #A57B42 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F2F3F4 / #F5F6F7 / #5B4424 / #343A3F / #1F2430 | 13.967 / 14.341 / 8.449 / 10.369 | 適合 | 線引きと一貫性を表す灰青。 |
| `palette-pair-conscientiousness-high-and-agreeableness-low-2` | 理知的な冷たい青 | #3F5268 / #A57B42 / #5F6A73 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F1F3 / #FBF8F6 / #343A3F / #232D39 / #1F2430 | 13.731 / 14.675 / 10.894 / 12.339 | 適合 | 秩序を保つ端正な青。 |
| `palette-pair-conscientiousness-high-and-agreeableness-low-3` | 秩序ある白 | #A57B42 / #5F6A73 / #3F5268 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F8F4F0 / #F7F8F8 / #232D39 / #5B4424 / #1F2430 | 14.180 / 14.585 / 13.107 / 8.354 | 適合 | 基準を明確に示す落ち着いた黄褐色。 |
| `palette-pair-conscientiousness-low-and-agreeableness-high-1` | 温かな友情のピンク | #95A982 / #CF8774 / #C7B092 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F7F8F5 / #FDF9F8 / #6D6150 / #525D48 / #1F2430 | 14.557 / 14.840 / 5.777 / 6.527 | 適合 | 相手に合わせる柔らかな緑。 |
| `palette-pair-conscientiousness-low-and-agreeableness-high-2` | 緩やかな時間の黄緑色 | #CF8774 / #C7B092 / #95A982 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FBF5F4 / #FCFBFA / #525D48 / #724A40 / #1F2430 | 14.387 / 15.014 / 6.732 / 7.031 | 適合 | 予定外の時間を共に楽しむ色。 |
| `palette-pair-conscientiousness-low-and-agreeableness-high-3` | 包容力ある淡いオレンジ | #C7B092 / #95A982 / #CF8774 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FBF9F6 / #FAFBF9 / #724A40 / #6D6150 / #1F2430 | 14.766 / 14.950 / 7.306 / 5.749 | 適合 | 無理なく続く関わりを象徴。 |
| `palette-pair-conscientiousness-low-and-agreeableness-low-1` | 誰にも染まらない深い紫 | #A8644F / #4C9690 / #B89E78 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F8F3F1 / #F6FAF9 / #655742 / #5C372B / #1F2430 | 14.100 / 14.750 / 6.664 / 9.370 | 適合 | 自分の判断で進む大地の色。 |
| `palette-pair-conscientiousness-low-and-agreeableness-low-2` | 独立した精神の深い青 | #4C9690 / #B89E78 / #A8644F | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F1F7F6 / #FBFAF8 / #5C372B / #2A534F / #1F2430 | 14.317 / 14.876 / 9.886 / 7.913 | 適合 | 決められた枠から離れる青緑。 |
| `palette-pair-conscientiousness-low-and-agreeableness-low-3` | 自由な風のシルバーグレー | #B89E78 / #A8644F / #4C9690 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F9F7F4 / #FBF7F6 / #2A534F / #655742 / #1F2430 | 14.512 / 14.584 / 8.060 / 6.556 | 適合 | 広い裁量と余白を表す色。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-high-1` | 安定した深い青 | #415C70 / #678B9C / #80968A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F2F4 / #F7F9FA / #46534C / #24333E / #1F2430 | 13.827 / 14.694 / 7.642 / 11.564 | 適合 | 計画と落ち着きが同居する深い青。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-high-2` | 凪いだ海の白 | #678B9C / #80968A / #415C70 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F6F7 / #F9FAF9 / #24333E / #394C56 / #1F2430 | 14.288 / 14.831 / 12.403 / 8.256 | 適合 | 安定した流れを象徴する青灰。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-high-3` | 冷静な判断のグレー | #80968A / #415C70 / #678B9C | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F7F6 / #F6F7F8 / #394C56 / #46534C / #1F2430 | 14.422 / 14.467 / 8.359 / 7.501 | 適合 | 無理なく続く秩序を表す緑。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-low-1` | 揺らぐ感情の薄紫 | #B77D45 / #5D748A / #8B8191 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F9F5F0 / #F7F8F9 / #4C4750 / #654526 / #1F2430 | 14.296 / 14.594 / 8.497 / 7.953 | 適合 | 気づきと準備を照らす灯りの色。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-low-2` | 整頓しようとする深い青 | #5D748A / #8B8191 / #B77D45 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F2F4F6 / #F9F9FA / #654526 / #33404C / #1F2430 | 14.074 / 14.748 / 8.205 / 9.627 | 適合 | 不確実さを段取りで整理する青。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-low-3` | 灯火の淡い黄色 | #8B8191 / #B77D45 / #5D748A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F5F6 / #FBF9F6 / #33404C / #4C4750 / #1F2430 | 14.269 / 14.766 / 10.100 / 8.308 | 適合 | 繊細さと規律が重なる色。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-high-1` | 流れる水の淡いブルー | #6DA6A3 / #7193A5 / #B9A17D | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F8F8 / #F8FAFB / #665945 / #3C5B5A / #1F2430 | 14.478 / 14.822 / 6.513 / 6.908 | 適合 | 流れに合わせて形を変える青緑。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-high-2` | 軽やかな風の若草色 | #7193A5 / #B9A17D / #6DA6A3 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F6F8 / #FCFAF9 / #3C5B5A / #3E515B / #1F2430 | 14.324 / 14.913 / 7.116 / 7.653 | 適合 | 落ち着いて移動する空気感。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-high-3` | 漂う雲の白 | #B9A17D / #6DA6A3 / #7193A5 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F9F7F5 / #F8FBFA / #3E515B / #665945 / #1F2430 | 14.521 / 14.905 / 7.964 / 6.380 | 適合 | 成り行きを受け止める穏やかな色。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-low-1` | 揺れる影の深いグレー | #8E738A / #758EA0 / #8F796B | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F4F6 / #F8F9FA / #4F433B / #4E3F4C / #1F2430 | 14.180 / 14.721 / 9.062 / 8.970 | 適合 | 感情や状況の揺らぎを象徴する紫灰。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-low-2` | 繊細な感性の淡い紫 | #758EA0 / #8F796B / #8E738A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F6F7 / #F9F8F8 / #4E3F4C / #404E58 / #1F2430 | 14.315 / 14.639 / 9.260 / 7.911 | 適合 | 定まらない歩みを静かに表す青。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-low-3` | 儚い光のベージュ | #8F796B / #8E738A / #758EA0 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F4F3 / #F9F8F9 / #404E58 / #4F433B / #1F2430 | 14.153 / 14.648 / 8.095 / 8.712 | 適合 | 夕暮れの曖昧な輪郭を思わせる色。 |
| `palette-pair-extraversion-high-and-agreeableness-high-1` | 華やかな黄金色 | #D96F67 / #3F9C98 / #D0A24C | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FCF3F3 / #F5FAFA / #72592A / #773D39 / #1F2430 | 14.227 / 14.732 / 6.274 / 7.668 | 適合 | 人と一緒に場へ踏み出す温かい色。 |
| `palette-pair-extraversion-high-and-agreeableness-high-2` | 共演する明るいピンク | #3F9C98 / #D0A24C / #D96F67 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F7F7 / #FDFAF6 / #773D39 / #235654 / #1F2430 | 14.300 / 14.913 / 8.037 / 7.647 | 適合 | 協力しながら動く軽快な青緑。 |
| `palette-pair-extraversion-high-and-agreeableness-high-3` | 活気ある鮮やかな緑 | #D0A24C / #D96F67 / #3F9C98 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FBF8F1 / #FDF8F7 / #235654 / #72592A / #1F2430 | 14.630 / 14.739 / 7.882 / 6.230 | 適合 | 共有される喜びを象徴する色。 |
| `palette-pair-extraversion-high-and-agreeableness-low-1` | 強烈な個性の赤 | #C8564F / #3E6485 / #A94F7A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FBF1F1 / #F5F7F9 / #5D2B43 / #6E2F2B / #1F2430 | 14.006 / 14.450 / 10.335 / 9.007 | 適合 | 自分の色を明確に掲げる赤。 |
| `palette-pair-extraversion-high-and-agreeableness-low-2` | 鮮やかな対比の黄色 | #3E6485 / #A94F7A / #C8564F | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F3F5 / #FBF6F8 / #6E2F2B / #223749 / #1F2430 | 13.924 / 14.512 / 9.332 / 11.015 | 適合 | 周囲に流されない判断を表す青。 |
| `palette-pair-extraversion-high-and-agreeableness-low-3` | 揺るがない信念の黒 | #A94F7A / #C8564F / #3E6485 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F8F1F4 / #FCF7F6 / #223749 / #5D2B43 / #1F2430 | 13.951 / 14.612 / 11.559 / 9.979 | 適合 | 存在感のある主張を象徴する色。 |
| `palette-pair-extraversion-low-and-agreeableness-high-1` | 寄り添う淡いピンク | #8FA18A / #728C9B / #C5A0A2 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F7F6 / #F8F9FA / #6C5859 / #4F594C / #1F2430 | 14.449 / 14.721 / 6.269 / 6.823 | 適合 | 静かな場所から相手を見守る緑。 |
| `palette-pair-extraversion-low-and-agreeableness-high-2` | 静観する深い緑 | #728C9B / #C5A0A2 / #8FA18A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F6F7 / #FCFAFA / #4F594C / #3F4D55 / #1F2430 | 14.315 / 14.922 / 7.047 / 8.058 | 適合 | 控えめな支えを表す青灰。 |
| `palette-pair-extraversion-low-and-agreeableness-high-3` | 安らぎのパールホワイト | #C5A0A2 / #8FA18A / #728C9B | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FAF7F8 / #F9FAF9 / #3F4D55 / #6C5859 / #1F2430 | 14.575 / 14.831 / 8.348 / 6.207 | 適合 | 言葉にしすぎない温かさ。 |
| `palette-pair-extraversion-low-and-agreeableness-low-1` | 孤独を愛する深い紺 | #465469 / #777C7E / #826F61 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F1F3 / #F8F8F9 / #483D35 / #272E3A / #1F2430 | 13.731 / 14.621 / 9.921 / 12.080 | 適合 | 自分に合う距離を選ぶ深い青。 |
| `palette-pair-extraversion-low-and-agreeableness-low-2` | 自分の席を守るグレー | #777C7E / #826F61 / #465469 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F5F5 / #F9F8F7 / #272E3A / #414445 / #1F2430 | 14.207 / 14.630 / 12.871 / 8.994 | 適合 | 必要な場所に静かに留まる色。 |
| `palette-pair-extraversion-low-and-agreeableness-low-3` | 静寂を湛える淡い青 | #826F61 / #465469 / #777C7E | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F3F2 / #F6F6F8 / #414445 / #483D35 / #1F2430 | 14.029 / 14.377 / 9.102 / 9.519 | 適合 | 自分の居場所を象徴する木の色。 |
| `palette-pair-extraversion-high-and-emotionalstability-high-1` | 心を寛げる明るいオレンジ | #4B9C96 / #D97A6B / #6C9BB5 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F1F7F7 / #FDF8F8 / #3B5564 / #295653 / #1F2430 | 14.326 / 14.748 / 7.477 / 7.602 | 適合 | 交流の中でも自然体でいる青緑。 |
| `palette-pair-extraversion-high-and-emotionalstability-high-2` | 安定した社交の青 | #D97A6B / #6C9BB5 / #4B9C96 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FCF4F3 / #F8FAFB / #295653 / #77433B / #1F2430 | 14.316 / 14.822 / 7.865 / 7.310 | 適合 | 穏やかな活気を表す色。 |
| `palette-pair-extraversion-high-and-emotionalstability-high-3` | 包容力あるクリーム色 | #6C9BB5 / #4B9C96 / #D97A6B | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F7F9 / #F6FAFA / #77433B / #3B5564 / #1F2430 | 14.397 / 14.759 / 7.536 / 7.299 | 適合 | 開放感と落ち着きが重なる青。 |
| `palette-pair-extraversion-high-and-emotionalstability-low-1` | ざわめきを象徴する鮮やかな黄色 | #CF6F72 / #4D9FAD / #9A7FA9 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FBF3F4 / #F6FAFB / #55465D / #723D3F / #1F2430 | 14.209 / 14.768 / 8.257 / 7.833 | 適合 | 人の反応へ敏感に振り向く色。 |
| `palette-pair-extraversion-high-and-emotionalstability-low-2` | 揺らぐ感情の淡い紫 | #4D9FAD / #9A7FA9 / #CF6F72 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F1F7F8 / #FAF9FB / #723D3F / #2A575F / #1F2430 | 14.335 / 14.785 / 8.151 / 7.385 | 適合 | 交流へ踏み出す軽快な青。 |
| `palette-pair-extraversion-high-and-emotionalstability-low-3` | 参加意欲のある明るい赤 | #9A7FA9 / #CF6F72 / #4D9FAD | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F7F5F8 / #FDF8F8 / #2A575F / #55465D / #1F2430 | 14.314 / 14.748 / 7.598 / 8.003 | 適合 | 周囲の気配が残る余韻を表す紫。 |
| `palette-pair-extraversion-low-and-emotionalstability-high-1` | 芽吹きを待つ若葉色 | #879C78 / #6D8492 / #C2AD8E | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F7F4 / #F8F9FA / #6B5F4E / #4A5642 / #1F2430 | 14.404 / 14.721 / 5.908 / 7.217 | 適合 | 静かに時機を待つ若葉の色。 |
| `palette-pair-extraversion-low-and-emotionalstability-high-2` | 安定した待機の深い緑 | #6D8492 / #C2AD8E / #879C78 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F5F6 / #FCFBF9 / #4A5642 / #3C4950 / #1F2430 | 14.190 / 15.005 / 7.518 / 8.493 | 適合 | 落ち着いた場所に留まる青灰。 |
| `palette-pair-extraversion-low-and-emotionalstability-high-3` | 静かな期待の白 | #C2AD8E / #879C78 / #6D8492 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FAF8F6 / #F9FAF8 / #3C4950 / #6B5F4E / #1F2430 | 14.648 / 14.821 / 8.871 / 5.878 | 適合 | ゆっくり始まる変化を象徴する色。 |
| `palette-pair-extraversion-low-and-emotionalstability-low-1` | 薄明の深い紫 | #667D91 / #88798C / #778D82 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F5F6 / #F9F8F9 / #414E48 / #384550 / #1F2430 | 14.190 / 14.648 / 8.232 / 8.993 | 適合 | 夜と朝の境界に耳を澄ます青。 |
| `palette-pair-extraversion-low-and-emotionalstability-low-2` | 繊細な夜明けの淡い青 | #88798C / #778D82 / #667D91 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F4F6 / #F8F9F9 / #384550 / #4B434D / #1F2430 | 14.153 / 14.712 / 9.324 / 8.670 | 適合 | 静けさと繊細さが重なる紫灰。 |
| `palette-pair-extraversion-low-and-emotionalstability-low-3` | 静寂を湛えるチャコールグレー | #778D82 / #667D91 / #88798C | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F6F5 / #F7F9FA / #4B434D / #414E48 / #1F2430 | 14.297 / 14.694 / 9.001 / 8.034 | 適合 | 刺激を抑えた森の気配を表す色。 |
| `palette-pair-agreeableness-high-and-emotionalstability-high-1` | 調和する淡いピンク | #C58C91 / #899E8A / #6E909E | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FAF6F6 / #F9FAF9 / #3D4F57 / #6C4D50 / #1F2430 | 14.467 / 14.831 / 8.177 / 6.955 | 適合 | 穏やかに向かい合う温かな色。 |
| `palette-pair-agreeableness-high-and-emotionalstability-high-2` | 穏やかな共有のミントグリーン | #899E8A / #6E909E / #C58C91 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F7F6 / #F8F9FA / #6C4D50 / #4B574C / #1F2430 | 14.449 / 14.721 / 7.077 / 7.067 | 適合 | 落ち着いた協調を象徴する緑。 |
| `palette-pair-agreeableness-high-and-emotionalstability-high-3` | 安定した共存のベージュ | #6E909E / #C58C91 / #899E8A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F3F6F7 / #FCF9FA / #4B574C / #3D4F57 / #1F2430 | 14.288 / 14.830 / 7.254 / 7.878 | 適合 | 感情に流されず関係を保つ青。 |
| `palette-pair-agreeableness-high-and-emotionalstability-low-1` | 共鳴し揺れる淡い紫 | #BE8695 / #9A86A7 / #7A97A5 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #FAF5F7 / #FAF9FB / #43535B / #694A52 / #1F2430 | 14.386 / 14.785 / 7.616 / 7.205 | 適合 | 相手の気配を細やかに受け取る色。 |
| `palette-pair-agreeableness-high-and-emotionalstability-low-2` | 温かな寄り添いのピンク | #9A86A7 / #7A97A5 / #BE8695 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F7F5F8 / #F8FAFB / #694A52 / #554A5C / #1F2430 | 14.314 / 14.822 / 7.424 / 7.686 | 適合 | 関係の揺らぎに寄り添う紫。 |
| `palette-pair-agreeableness-high-and-emotionalstability-low-3` | 繊細な調和のライトブルー | #7A97A5 / #BE8695 / #9A86A7 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F4F7F8 / #FCF9FA / #554A5C / #43535B / #1F2430 | 14.414 / 14.830 / 7.963 / 7.425 | 適合 | 周囲の変化を映す柔らかな青。 |
| `palette-pair-agreeableness-low-and-emotionalstability-high-1` | 淡々とした理性のグレー | #5E6A70 / #3F5368 / #8A7363 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F2F3F4 / #F5F6F7 / #4C3F36 / #343A3E / #1F2430 | 13.967 / 14.341 / 9.369 / 10.381 | 適合 | 感情に流されず立場を示す灰青。 |
| `palette-pair-agreeableness-low-and-emotionalstability-high-2` | 揺るがない安定の深い青 | #3F5368 / #8A7363 / #5E6A70 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F1F3 / #F9F8F7 / #343A3E / #232E39 / #1F2430 | 13.731 / 14.630 / 10.873 / 12.214 | 適合 | 静かな確かさを持つ青。 |
| `palette-pair-agreeableness-low-and-emotionalstability-high-3` | 明快な表明の白 | #8A7363 / #5E6A70 / #3F5368 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F6F4F3 / #F7F8F8 / #232E39 / #4C3F36 / #1F2430 | 14.153 / 14.585 / 12.974 / 9.246 | 適合 | 現実的で率直な印象を表す色。 |
| `palette-pair-agreeableness-low-and-emotionalstability-low-1` | 情熱的に鳴る深い赤 | #854E5E / #44556A / #866F82 | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F1F2 / #F6F7F8 / #4A3D48 / #492B34 / #1F2430 | 13.853 / 14.467 / 9.540 / 11.169 | 適合 | 緊張感を含んだ明確な表明の色。 |
| `palette-pair-agreeableness-low-and-emotionalstability-low-2` | 嵐のような激しい紫 | #44556A / #866F82 / #854E5E | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F0F1F3 / #F9F8F9 / #492B34 / #252F3A / #1F2430 | 13.731 / 14.648 / 11.810 / 12.016 | 適合 | 境界に立ち周囲を見渡す青。 |
| `palette-pair-agreeableness-low-and-emotionalstability-low-3` | 強い意志を示す黒 | #866F82 / #854E5E / #44556A | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | #F5F3F5 / #F9F6F7 / #252F3A / #4A3D48 / #1F2430 | 14.056 / 14.449 / 12.645 / 9.269 | 適合 | 細やかな反応と自己主張が重なる紫灰。 |

## P-1 香調語彙と素材（draft）

### まろやかな甘みの草花の香調（`fragrance-pause-roman-chamomile`）

- 場面: ひと息つきたい
- 説明: まろやかな甘みとやわらかな草花の気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: ローマンカモミール
- 共有投影: まろやかな甘みの草花の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 温かく穏やかな木質の香調（`fragrance-pause-sandalwood`）

- 場面: ひと息つきたい
- 説明: 温かみと丸みを帯びた木質の気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: サンダルウッド
- 共有投影: 温かく穏やかな木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### ほろ苦く明るい柑橘の香調（`fragrance-reset-grapefruit`）

- 場面: 気持ちを切り替えたい
- 説明: ほろ苦さと明るさが重なる柑橘の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: グレープフルーツ
- 共有投影: ほろ苦く明るい柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 瑞々しい草と柑橘の香調（`fragrance-reset-lemongrass`）

- 場面: 気持ちを切り替えたい
- 説明: 瑞々しい草と明るい柑橘が重なる気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: レモングラス
- 共有投影: 瑞々しい草と柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### ほのかな甘みの柑橘の香調（`fragrance-quiet-focus-bergamot`）

- 場面: 静かに取り組みたい
- 説明: 明るい柑橘にほのかな甘みが重なる気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: ベルガモット
- 共有投影: ほのかな甘みの柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 静かな樹脂と木質の香調（`fragrance-quiet-focus-frankincense`）

- 場面: 静かに取り組みたい
- 説明: 深い樹脂と乾いた木質を思わせる気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: フランキンセンス
- 共有投影: 静かな樹脂と木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 濃密で甘やかな花の香調（`fragrance-pause-ylang-ylang`）

- 場面: ひと息つきたい
- 説明: 濃密な甘みと丸みのある花の気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: イランイラン
- 共有投影: 濃密で甘やかな花の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 温かく穏やかなハーブの香調（`fragrance-pause-marjoram`）

- 場面: ひと息つきたい
- 説明: 温かみのある穏やかな葉の気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: マジョラム
- 共有投影: 温かく穏やかなハーブの香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 青い葉と柑橘の香調（`fragrance-reset-petitgrain`）

- 場面: 気持ちを切り替えたい
- 説明: 青い葉とほろ苦い柑橘が重なる気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: プチグレン
- 共有投影: 青い葉と柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 鮮やかで明るい柑橘の香調（`fragrance-reset-lemon`）

- 場面: 気持ちを切り替えたい
- 説明: 鮮やかな明るさと軽い酸味を持つ柑橘の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: レモン
- 共有投影: 鮮やかで明るい柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 青く端正なハーブの香調（`fragrance-quiet-focus-rosemary`）

- 場面: 静かに取り組みたい
- 説明: 青々とした葉と端正な輪郭を持つ気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: ローズマリー
- 共有投影: 青く端正なハーブの香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 澄んだ樹木と果実の香調（`fragrance-quiet-focus-juniper-berry`）

- 場面: 静かに取り組みたい
- 説明: 澄んだ空気と小さな果実を思わせる気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: ジュニパーベリー
- 共有投影: 澄んだ樹木と果実の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 清らかで乾いた木質の香調（`fragrance-pause-hinoki`）

- 場面: ひと息つきたい
- 説明: 乾いた木の質感と静かな森を思わせる気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: ヒノキ
- 共有投影: 清らかで乾いた木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 透明感のある花と柑橘の香調（`fragrance-pause-neroli`）

- 場面: ひと息つきたい
- 説明: 繊細な花と明るい柑橘が重なる気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: ネロリ
- 共有投影: 透明感のある花と柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 青く端正なハーブの香調（`fragrance-reset-rosemary`）

- 場面: 気持ちを切り替えたい
- 説明: 青々とした葉と端正な輪郭を持つ気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: ローズマリー
- 共有投影: 青く端正なハーブの香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 軽快で透明な柑橘の香調（`fragrance-reset-lime`）

- 場面: 気持ちを切り替えたい
- 説明: 軽快な酸味と透明感を持つ柑橘の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: ライム
- 共有投影: 軽快で透明な柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 湿り気を含む土と葉の香調（`fragrance-quiet-focus-patchouli`）

- 場面: 静かに取り組みたい
- 説明: 湿った土と葉を思わせる深みのある気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: パチュリ
- 共有投影: 湿り気を含む土と葉の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 端正で清涼な木質の香調（`fragrance-quiet-focus-cypress`）

- 場面: 静かに取り組みたい
- 説明: 細身の木立を思わせる端正で清涼な気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: サイプレス
- 共有投影: 端正で清涼な木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 静かな甘みを含む花の香調（`fragrance-pause-true-lavender`）

- 場面: ひと息つきたい
- 説明: 静かな甘みと乾いた花を思わせる気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: 真正ラベンダー
- 共有投影: 静かな甘みを含む花の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### やさしい甘みの木質の香調（`fragrance-pause-ho-wood`）

- 場面: ひと息つきたい
- 説明: やさしい甘みと滑らかな木質が重なる気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: ホーウッド
- 共有投影: やさしい甘みの木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### ほのかな甘みの柑橘の香調（`fragrance-reset-bergamot`）

- 場面: 気持ちを切り替えたい
- 説明: 明るい柑橘にほのかな甘みが重なる気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: ベルガモット
- 共有投影: ほのかな甘みの柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 鋭く澄んだ清涼の香調（`fragrance-reset-peppermint`）

- 場面: 気持ちを切り替えたい
- 説明: ひんやりと澄んだ輪郭を持つ気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: ペパーミント
- 共有投影: 鋭く澄んだ清涼の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 乾いた深みのある木質の香調（`fragrance-quiet-focus-cedarwood`）

- 場面: 静かに取り組みたい
- 説明: 乾いた木の質感を思わせる落ち着いた気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: シダーウッド
- 共有投影: 乾いた深みのある木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 根と土を思わせる重厚な香調（`fragrance-quiet-focus-vetiver`）

- 場面: 静かに取り組みたい
- 説明: 乾いた根と土の層を思わせる気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: ベチバー
- 共有投影: 根と土を思わせる重厚な香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 丸みのある甘い柑橘の香調（`fragrance-reset-mandarin`）

- 場面: 気持ちを切り替えたい
- 説明: 丸みのある甘さと明るさを持つ柑橘の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: マンダリン
- 共有投影: 丸みのある甘い柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 清らかで乾いた木質の香調（`fragrance-quiet-focus-hinoki`）

- 場面: 静かに取り組みたい
- 説明: 乾いた木の質感と静かな森を思わせる気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: ヒノキ
- 共有投影: 清らかで乾いた木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 静かな樹脂と木質の香調（`fragrance-pause-frankincense`）

- 場面: ひと息つきたい
- 説明: 深い樹脂と乾いた木質を思わせる気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: フランキンセンス
- 共有投影: 静かな樹脂と木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 青さを含む軽快な香調（`fragrance-reset-citronella`）

- 場面: 気持ちを切り替えたい
- 説明: 青さと明るさが交わる軽快な気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: シトロネラ
- 共有投影: 青さを含む軽快な香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 透明感のある葉の香調（`fragrance-reset-eucalyptus-radiata`）

- 場面: 気持ちを切り替えたい
- 説明: 透明感とすっきりした輪郭を持つ葉の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: ユーカリ・ラディアータ
- 共有投影: 透明感のある葉の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### やわらかな草花の香調（`fragrance-pause-chamomile`）

- 場面: ひと息つきたい
- 説明: ほのかな甘みを含むやわらかな草花の気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: カモミール
- 共有投影: やわらかな草花の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 湿り気を含む土と葉の香調（`fragrance-pause-patchouli`）

- 場面: ひと息つきたい
- 説明: 湿った土と葉を思わせる深みのある気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: パチュリ
- 共有投影: 湿り気を含む土と葉の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### やさしい余韻を含む草花の香調（`fragrance-pause-roman-chamomile-soft`）

- 場面: ひと息つきたい
- 説明: やさしい甘みと静かな余韻を含む草花の気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: ローマンカモミール
- 共有投影: やさしい余韻を含む草花の香調
- 注意書きID: `disclaimer-aroma-symbolic`

## P-2 バランス・単一因子称号（draft）

### 1. 五つの風を見渡す観測者 (`title-balanced`)

- 標準パレット: 澄み切った空色 (`palette-balanced-1`)
- 代替パレット1: 静謐な白 (`palette-balanced-2`)
- 代替パレット2: 穏やかな草原の緑 (`palette-balanced-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: 瑞々しい草と柑橘の香調 (`fragrance-reset-lemongrass`)
- 素材例: レモングラス
- 共有サマリ: ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: ほのかな甘みの柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 素材例: ベルガモット
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: ほのかな甘みの柑橘の香調

### 2. おいかける探究者 (`title-single-intellectImagination-high`)

- 標準パレット: 深い知性の紺色 (`palette-single-intellectimagination-high-1`)
- 代替パレット1: 閃きを象徴する金黄色 (`palette-single-intellectimagination-high-2`)
- 代替パレット2: 未知への好奇心を誘う紫 (`palette-single-intellectimagination-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 濃密で甘やかな花の香調 (`fragrance-pause-ylang-ylang`)
- 素材例: イランイラン
- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 共有サマリ: 濃密で甘やかな花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: 青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 青く端正なハーブの香調

### 3. 手ざわりをたどる散策者 (`title-single-intellectImagination-low`)

- 標準パレット: 大地の温もりを宿す茶色 (`palette-single-intellectimagination-low-1`)
- 代替パレット1: 柔らかな陽だまりのベージュ (`palette-single-intellectimagination-low-2`)
- 代替パレット2: 落ち着いたモスグリーン (`palette-single-intellectimagination-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 湿り気を含む土と葉の香調

### 4. 整然たる計画者 (`title-single-conscientiousness-high`)

- 標準パレット: 規律ある濃紺 (`palette-single-conscientiousness-high-1`)
- 代替パレット1: 静止した空気のグレー (`palette-single-conscientiousness-high-2`)
- 代替パレット2: 誠実な白磁色 (`palette-single-conscientiousness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: やさしい甘みの木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほのかな甘みの柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 共有サマリ: ほのかな甘みの柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: 乾いた深みのある木質の香調

### 5. 風向きに道を変える漂泊者 (`title-single-conscientiousness-low`)

- 標準パレット: 自由な風のスカイブルー (`palette-single-conscientiousness-low-1`)
- 代替パレット1: 移ろいゆく雲の白 (`palette-single-conscientiousness-low-2`)
- 代替パレット2: 軽やかな若草色 (`palette-single-conscientiousness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: 丸みのある甘い柑橘の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂と木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 清らかで乾いた木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: 静かな樹脂と木質の香調

### 6. にぎわいへ進む交遊者 (`title-single-extraversion-high`)

- 標準パレット: 陽気なサンフラワーイエロー (`palette-single-extraversion-high-1`)
- 代替パレット1: 情熱的なコーラルピンク (`palette-single-extraversion-high-2`)
- 代替パレット2: 活気に満ちたオレンジ (`palette-single-extraversion-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青さを含む軽快な香調 (`fragrance-reset-citronella`)
- 素材例: シトロネラ
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: 青さを含む軽快な香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 青く端正なハーブの香調

### 7. 静謐なる滞在者 (`title-single-extraversion-low`)

- 標準パレット: 深い夜のミッドナイトブルー (`palette-single-extraversion-low-1`)
- 代替パレット1: 静寂を纏うシルバーグレー (`palette-single-extraversion-low-2`)
- 代替パレット2: 落ち着いた藤色 (`palette-single-extraversion-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 湿り気を含む土と葉の香調

### 8. 歩幅をそろえる同伴者 (`title-single-agreeableness-high`)

- 標準パレット: 温かなパステルピンク (`palette-single-agreeableness-high-1`)
- 代替パレット1: 包容力のあるミントグリーン (`palette-single-agreeableness-high-2`)
- 代替パレット2: 穏やかなアイボリー (`palette-single-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: やわらかな草花の香調 (`fragrance-pause-chamomile`)
- 素材例: カモミール
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほのかな甘みの柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: ほのかな甘みの柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: 乾いた深みのある木質の香調

### 9. 自分の歩幅で進む同行者 (`title-single-agreeableness-low`)

- 標準パレット: 意志ある深い赤 (`palette-single-agreeableness-low-1`)
- 代替パレット1: 独立心を示す深い緑 (`palette-single-agreeableness-low-2`)
- 代替パレット2: 揺るがない鉄灰色 (`palette-single-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-pause-patchouli`)
- 素材例: パチュリ
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: 湿り気を含む土と葉の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: 丸みのある甘い柑橘の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂と木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 清らかで乾いた木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: 静かな樹脂と木質の香調

### 10. 静かなる航行者 (`title-single-emotionalStability-high`)

- 標準パレット: 凪いだ海の深い青 (`palette-single-emotionalstability-high-1`)
- 代替パレット1: 安らぎを運ぶ淡い水色 (`palette-single-emotionalstability-high-2`)
- 代替パレット2: 静穏なパールホワイト (`palette-single-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 温かく穏やかなハーブの香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: 青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 青く端正なハーブの香調

### 11. そよ風に振り向く感受者 (`title-single-emotionalStability-low`)

- 標準パレット: 繊細な薄紅色の花びら (`palette-single-emotionalstability-low-1`)
- 代替パレット1: 揺れる水面の淡い青 (`palette-single-emotionalstability-low-2`)
- 代替パレット2: 移ろう光の淡い紫 (`palette-single-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 湿り気を含む土と葉の香調

## P-3 ペア称号 1〜10（draft）

### 12. 星座盤に印を置く記録者 (`title-pair-intellectImagination-high--conscientiousness-high`)

- 標準パレット: 星夜の深い紺 (`palette-pair-intellectimagination-high-and-conscientiousness-high-1`)
- 代替パレット1: 精緻な記録の黄金色 (`palette-pair-intellectimagination-high-and-conscientiousness-high-2`)
- 代替パレット2: 冷静な思考の白 (`palette-pair-intellectimagination-high-and-conscientiousness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 濃密で甘やかな花の香調 (`fragrance-pause-ylang-ylang`)
- 素材例: イランイラン
- 香り候補: やさしい甘みの木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 共有サマリ: 濃密で甘やかな花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 共有サマリ: 青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: 青く端正なハーブの香調

### 13. 風まかせの空想者 (`title-pair-intellectImagination-high--conscientiousness-low`)

- 標準パレット: 夢幻的なペールバイオレット (`palette-pair-intellectimagination-high-and-conscientiousness-low-1`)
- 代替パレット1: 自由な空の淡い青 (`palette-pair-intellectimagination-high-and-conscientiousness-low-2`)
- 代替パレット2: 想像力を刺激する琥珀色 (`palette-pair-intellectimagination-high-and-conscientiousness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 濃密で甘やかな花の香調 (`fragrance-pause-ylang-ylang`)
- 素材例: イランイラン
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: 濃密で甘やかな花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 丸みのある甘い柑橘の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: 青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 清らかで乾いた木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: 青く端正なハーブの香調

### 14. 素朴な継続者 (`title-pair-intellectImagination-low--conscientiousness-high`)

- 標準パレット: 実直な土の色 (`palette-pair-intellectimagination-low-and-conscientiousness-high-1`)
- 代替パレット1: 誠実な深い緑 (`palette-pair-intellectimagination-low-and-conscientiousness-high-2`)
- 代替パレット2: 飾らない生成り色 (`palette-pair-intellectimagination-low-and-conscientiousness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: やさしい甘みの木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: 湿り気を含む土と葉の香調

### 15. 気ままな遊歩者 (`title-pair-intellectImagination-low--conscientiousness-low`)

- 標準パレット: 陽光を浴びた淡い黄色 (`palette-pair-intellectimagination-low-and-conscientiousness-low-1`)
- 代替パレット1: 気ままな風のミントグリーン (`palette-pair-intellectimagination-low-and-conscientiousness-low-2`)
- 代替パレット2: 柔らかな砂の色 (`palette-pair-intellectimagination-low-and-conscientiousness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 丸みのある甘い柑橘の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 清らかで乾いた木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: 湿り気を含む土と葉の香調

### 16. 新風を運ぶ伝達者 (`title-pair-intellectImagination-high--extraversion-high`)

- 標準パレット: 鮮やかなターコイズブルー (`palette-pair-intellectimagination-high-and-extraversion-high-1`)
- 代替パレット1: 活力を運ぶオレンジゴールド (`palette-pair-intellectimagination-high-and-extraversion-high-2`)
- 代替パレット2: 知的な輝きの白 (`palette-pair-intellectimagination-high-and-extraversion-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 濃密で甘やかな花の香調 (`fragrance-pause-ylang-ylang`)
- 素材例: イランイラン
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 濃密で甘やかな花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: 青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 青く端正なハーブの香調

### 17. 静寂に星座盤を見つめる探索者 (`title-pair-intellectImagination-high--extraversion-low`)

- 標準パレット: 静寂を極めた深い黒 (`palette-pair-intellectimagination-high-and-extraversion-low-1`)
- 代替パレット1: 宇宙の深淵を映す紫 (`palette-pair-intellectimagination-high-and-extraversion-low-2`)
- 代替パレット2: 遠い星の淡い光色 (`palette-pair-intellectimagination-high-and-extraversion-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 濃密で甘やかな花の香調 (`fragrance-pause-ylang-ylang`)
- 素材例: イランイラン
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: 濃密で甘やかな花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: 青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 青く端正なハーブの香調

### 18. にぎわいの談話者 (`title-pair-intellectImagination-low--extraversion-high`)

- 標準パレット: 賑やかな明るい黄色 (`palette-pair-intellectimagination-low-and-extraversion-high-1`)
- 代替パレット1: 親しみやすいアプリコット (`palette-pair-intellectimagination-low-and-extraversion-high-2`)
- 代替パレット2: 活気ある明るい緑 (`palette-pair-intellectimagination-low-and-extraversion-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 湿り気を含む土と葉の香調

### 19. 窓辺の逗留者 (`title-pair-intellectImagination-low--extraversion-low`)

- 標準パレット: 午後の日差しのベージュ (`palette-pair-intellectimagination-low-and-extraversion-low-1`)
- 代替パレット1: 穏やかな窓辺の薄青 (`palette-pair-intellectimagination-low-and-extraversion-low-2`)
- 代替パレット2: 静かな時間の色である淡いグレー (`palette-pair-intellectimagination-low-and-extraversion-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 湿り気を含む土と葉の香調

### 20. 寄り添う共鳴者 (`title-pair-intellectImagination-high--agreeableness-high`)

- 標準パレット: 共鳴し合う淡いピンク (`palette-pair-intellectimagination-high-and-agreeableness-high-1`)
- 代替パレット1: 包み込むような若草色 (`palette-pair-intellectimagination-high-and-agreeableness-high-2`)
- 代替パレット2: 調和を促すソフトブルー (`palette-pair-intellectimagination-high-and-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 濃密で甘やかな花の香調 (`fragrance-pause-ylang-ylang`)
- 素材例: イランイラン
- 香り候補: やわらかな草花の香調 (`fragrance-pause-chamomile`)
- 素材例: カモミール
- 共有サマリ: 濃密で甘やかな花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: 青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: 青く端正なハーブの香調

### 21. 独歩の開拓者 (`title-pair-intellectImagination-high--agreeableness-low`)

- 標準パレット: 強い意志を宿す深い赤 (`palette-pair-intellectimagination-high-and-agreeableness-low-1`)
- 代替パレット1: 未踏の地を拓く深い青 (`palette-pair-intellectimagination-high-and-agreeableness-low-2`)
- 代替パレット2: 鋭い理性の白 (`palette-pair-intellectimagination-high-and-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 濃密で甘やかな花の香調 (`fragrance-pause-ylang-ylang`)
- 素材例: イランイラン
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: 濃密で甘やかな花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 丸みのある甘い柑橘の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: 青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 清らかで乾いた木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: 青く端正なハーブの香調

## P-4 ペア称号 11〜20（draft）

### 22. 分かち合う同席者 (`title-pair-intellectImagination-low--agreeableness-high`)

- 標準パレット: 温かなピーチピンク (`palette-pair-intellectimagination-low-and-agreeableness-high-1`)
- 代替パレット1: 安らぎを分かつセージグリーン (`palette-pair-intellectimagination-low-and-agreeableness-high-2`)
- 代替パレット2: 穏やかなクリーム色 (`palette-pair-intellectimagination-low-and-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: やわらかな草花の香調 (`fragrance-pause-chamomile`)
- 素材例: カモミール
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: 湿り気を含む土と葉の香調

### 23. 標を示す表明者 (`title-pair-intellectImagination-low--agreeableness-low`)

- 標準パレット: 断定的な濃い赤 (`palette-pair-intellectimagination-low-and-agreeableness-low-1`)
- 代替パレット1: 明確な視界の白 (`palette-pair-intellectimagination-low-and-agreeableness-low-2`)
- 代替パレット2: 揺るぎない黒 (`palette-pair-intellectimagination-low-and-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 丸みのある甘い柑橘の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 清らかで乾いた木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: 湿り気を含む土と葉の香調

### 24. 凪空を仰ぐ観望者 (`title-pair-intellectImagination-high--emotionalStability-high`)

- 標準パレット: 凪いだ空のライトブルー (`palette-pair-intellectimagination-high-and-emotionalstability-high-1`)
- 代替パレット1: 静観する深い紺色 (`palette-pair-intellectimagination-high-and-emotionalstability-high-2`)
- 代替パレット2: 澄み切ったクリスタルホワイト (`palette-pair-intellectimagination-high-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 濃密で甘やかな花の香調 (`fragrance-pause-ylang-ylang`)
- 素材例: イランイラン
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 濃密で甘やかな花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: 青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 青く端正なハーブの香調

### 25. 鈴音に振り向く探訪者 (`title-pair-intellectImagination-high--emotionalStability-low`)

- 標準パレット: 震える心の色である淡い紫 (`palette-pair-intellectimagination-high-and-emotionalstability-low-1`)
- 代替パレット1: 瑞々しい朝の緑 (`palette-pair-intellectimagination-high-and-emotionalstability-low-2`)
- 代替パレット2: 繊細な光のシルバー (`palette-pair-intellectimagination-high-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 濃密で甘やかな花の香調 (`fragrance-pause-ylang-ylang`)
- 素材例: イランイラン
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: 濃密で甘やかな花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: 青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 青く端正なハーブの香調

### 26. 日だまりの静観者 (`title-pair-intellectImagination-low--emotionalStability-high`)

- 標準パレット: 暖かな陽だまりの黄色 (`palette-pair-intellectimagination-low-and-emotionalstability-high-1`)
- 代替パレット1: 穏やかな午後のベージュ (`palette-pair-intellectimagination-low-and-emotionalstability-high-2`)
- 代替パレット2: 安静な庭の緑 (`palette-pair-intellectimagination-low-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 湿り気を含む土と葉の香調

### 27. 雨音に振り向く歩行者 (`title-pair-intellectImagination-low--emotionalStability-low`)

- 標準パレット: しっとりとした雨のグレー (`palette-pair-intellectimagination-low-and-emotionalstability-low-1`)
- 代替パレット1: 濡れた葉の深い緑 (`palette-pair-intellectimagination-low-and-emotionalstability-low-2`)
- 代替パレット2: 憂いを帯びた淡いブルー (`palette-pair-intellectimagination-low-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 湿り気を含む土と葉の香調

### 28. 刻限に集う交流者 (`title-pair-conscientiousness-high--extraversion-high`)

- 標準パレット: 効率的な深い青 (`palette-pair-conscientiousness-high-and-extraversion-high-1`)
- 代替パレット1: 社交的な明るいオレンジ (`palette-pair-conscientiousness-high-and-extraversion-high-2`)
- 代替パレット2: 整理された白 (`palette-pair-conscientiousness-high-and-extraversion-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほのかな甘みの柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: ほのかな甘みの柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 乾いた深みのある木質の香調

### 29. 灯下の記録者 (`title-pair-conscientiousness-high--extraversion-low`)

- 標準パレット: 集中を高める深い黒 (`palette-pair-conscientiousness-high-and-extraversion-low-1`)
- 代替パレット1: 灯火の温かな琥珀色 (`palette-pair-conscientiousness-high-and-extraversion-low-2`)
- 代替パレット2: 紙のような淡いアイボリー (`palette-pair-conscientiousness-high-and-extraversion-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほのかな甘みの柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: ほのかな甘みの柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 乾いた深みのある木質の香調

### 30. 道草の合流者 (`title-pair-conscientiousness-low--extraversion-high`)

- 標準パレット: 軽やかな若葉色 (`palette-pair-conscientiousness-low-and-extraversion-high-1`)
- 代替パレット1: 偶然を象徴する明るい黄色 (`palette-pair-conscientiousness-low-and-extraversion-high-2`)
- 代替パレット2: 自由な空の青 (`palette-pair-conscientiousness-low-and-extraversion-high-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂と木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 静かな樹脂と木質の香調

### 31. 余白を楽しむ散策者 (`title-pair-conscientiousness-low--extraversion-low`)

- 標準パレット: 贅沢な余白の白 (`palette-pair-conscientiousness-low-and-extraversion-low-1`)
- 代替パレット1: 穏やかな散策のライトグリーン (`palette-pair-conscientiousness-low-and-extraversion-low-2`)
- 代替パレット2: 心を解き放つ淡い水色 (`palette-pair-conscientiousness-low-and-extraversion-low-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂と木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 静かな樹脂と木質の香調

## P-5 ペア称号 21〜30（draft）

### 32. 輪を整える準備者 (`title-pair-conscientiousness-high--agreeableness-high`)

- 標準パレット: 調和を司るミントグリーン (`palette-pair-conscientiousness-high-and-agreeableness-high-1`)
- 代替パレット1: 責任感ある深い紺 (`palette-pair-conscientiousness-high-and-agreeableness-high-2`)
- 代替パレット2: 準備を整えるベージュ (`palette-pair-conscientiousness-high-and-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: やわらかな草花の香調 (`fragrance-pause-chamomile`)
- 素材例: カモミール
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほのかな甘みの柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: ほのかな甘みの柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: 乾いた深みのある木質の香調

### 33. 線を引く整頓者 (`title-pair-conscientiousness-high--agreeableness-low`)

- 標準パレット: 厳格な境界線の黒 (`palette-pair-conscientiousness-high-and-agreeableness-low-1`)
- 代替パレット1: 理知的な冷たい青 (`palette-pair-conscientiousness-high-and-agreeableness-low-2`)
- 代替パレット2: 秩序ある白 (`palette-pair-conscientiousness-high-and-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほのかな甘みの柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 丸みのある甘い柑橘の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: ほのかな甘みの柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 清らかで乾いた木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: 乾いた深みのある木質の香調

### 34. 寄り道をともにする同行者 (`title-pair-conscientiousness-low--agreeableness-high`)

- 標準パレット: 温かな友情のピンク (`palette-pair-conscientiousness-low-and-agreeableness-high-1`)
- 代替パレット1: 緩やかな時間の黄緑色 (`palette-pair-conscientiousness-low-and-agreeableness-high-2`)
- 代替パレット2: 包容力ある淡いオレンジ (`palette-pair-conscientiousness-low-and-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: やわらかな草花の香調 (`fragrance-pause-chamomile`)
- 素材例: カモミール
- 共有サマリ: まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂と木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: 静かな樹脂と木質の香調

### 35. 自由な独行者 (`title-pair-conscientiousness-low--agreeableness-low`)

- 標準パレット: 誰にも染まらない深い紫 (`palette-pair-conscientiousness-low-and-agreeableness-low-1`)
- 代替パレット1: 独立した精神の深い青 (`palette-pair-conscientiousness-low-and-agreeableness-low-2`)
- 代替パレット2: 自由な風のシルバーグレー (`palette-pair-conscientiousness-low-and-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: 丸みのある甘い柑橘の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂と木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 清らかで乾いた木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: 静かな樹脂と木質の香調

### 36. 凪の計画者 (`title-pair-conscientiousness-high--emotionalStability-high`)

- 標準パレット: 安定した深い青 (`palette-pair-conscientiousness-high-and-emotionalstability-high-1`)
- 代替パレット1: 凪いだ海の白 (`palette-pair-conscientiousness-high-and-emotionalstability-high-2`)
- 代替パレット2: 冷静な判断のグレー (`palette-pair-conscientiousness-high-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほのかな甘みの柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: ほのかな甘みの柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 乾いた深みのある木質の香調

### 37. 揺れ灯の整頓者 (`title-pair-conscientiousness-high--emotionalStability-low`)

- 標準パレット: 揺らぐ感情の薄紫 (`palette-pair-conscientiousness-high-and-emotionalstability-low-1`)
- 代替パレット1: 整頓しようとする深い青 (`palette-pair-conscientiousness-high-and-emotionalstability-low-2`)
- 代替パレット2: 灯火の淡い黄色 (`palette-pair-conscientiousness-high-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほのかな甘みの柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: ほのかな甘みの柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 乾いた深みのある木質の香調

### 38. 流れをゆく漂泊者 (`title-pair-conscientiousness-low--emotionalStability-high`)

- 標準パレット: 流れる水の淡いブルー (`palette-pair-conscientiousness-low-and-emotionalstability-high-1`)
- 代替パレット1: 軽やかな風の若草色 (`palette-pair-conscientiousness-low-and-emotionalstability-high-2`)
- 代替パレット2: 漂う雲の白 (`palette-pair-conscientiousness-low-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂と木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 静かな樹脂と木質の香調

### 39. 揺れ影の遊歩者 (`title-pair-conscientiousness-low--emotionalStability-low`)

- 標準パレット: 揺れる影の深いグレー (`palette-pair-conscientiousness-low-and-emotionalstability-low-1`)
- 代替パレット1: 繊細な感性の淡い紫 (`palette-pair-conscientiousness-low-and-emotionalstability-low-2`)
- 代替パレット2: 儚い光のベージュ (`palette-pair-conscientiousness-low-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: やさしい余韻を含む草花の香調 (`fragrance-pause-roman-chamomile-soft`)
- 素材例: ローマンカモミール
- 共有サマリ: まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂と木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 静かな樹脂と木質の香調

### 40. 輪舞へ踏み出す共演者 (`title-pair-extraversion-high--agreeableness-high`)

- 標準パレット: 華やかな黄金色 (`palette-pair-extraversion-high-and-agreeableness-high-1`)
- 代替パレット1: 共演する明るいピンク (`palette-pair-extraversion-high-and-agreeableness-high-2`)
- 代替パレット2: 活気ある鮮やかな緑 (`palette-pair-extraversion-high-and-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: やわらかな草花の香調 (`fragrance-pause-chamomile`)
- 素材例: カモミール
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青さを含む軽快な香調 (`fragrance-reset-citronella`)
- 素材例: シトロネラ
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: 青さを含む軽快な香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: 青く端正なハーブの香調

### 41. 自分の色を掲げる表明者 (`title-pair-extraversion-high--agreeableness-low`)

- 標準パレット: 強烈な個性の赤 (`palette-pair-extraversion-high-and-agreeableness-low-1`)
- 代替パレット1: 鮮やかな対比の黄色 (`palette-pair-extraversion-high-and-agreeableness-low-2`)
- 代替パレット2: 揺るがない信念の黒 (`palette-pair-extraversion-high-and-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青さを含む軽快な香調 (`fragrance-reset-citronella`)
- 素材例: シトロネラ
- 香り候補: 丸みのある甘い柑橘の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: 青さを含む軽快な香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 清らかで乾いた木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: 青く端正なハーブの香調

## P-6 ペア称号 31〜40（draft）

### 42. 寄り添う静観者 (`title-pair-extraversion-low--agreeableness-high`)

- 標準パレット: 寄り添う淡いピンク (`palette-pair-extraversion-low-and-agreeableness-high-1`)
- 代替パレット1: 静観する深い緑 (`palette-pair-extraversion-low-and-agreeableness-high-2`)
- 代替パレット2: 安らぎのパールホワイト (`palette-pair-extraversion-low-and-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: やわらかな草花の香調 (`fragrance-pause-chamomile`)
- 素材例: カモミール
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: 湿り気を含む土と葉の香調

### 43. 一席を選ぶ滞在者 (`title-pair-extraversion-low--agreeableness-low`)

- 標準パレット: 孤独を愛する深い紺 (`palette-pair-extraversion-low-and-agreeableness-low-1`)
- 代替パレット1: 自分の席を守るグレー (`palette-pair-extraversion-low-and-agreeableness-low-2`)
- 代替パレット2: 静寂を湛える淡い青 (`palette-pair-extraversion-low-and-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 丸みのある甘い柑橘の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 清らかで乾いた木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: 湿り気を含む土と葉の香調

### 44. 寛ぐ交遊者 (`title-pair-extraversion-high--emotionalStability-high`)

- 標準パレット: 心を寛げる明るいオレンジ (`palette-pair-extraversion-high-and-emotionalstability-high-1`)
- 代替パレット1: 安定した社交の青 (`palette-pair-extraversion-high-and-emotionalstability-high-2`)
- 代替パレット2: 包容力あるクリーム色 (`palette-pair-extraversion-high-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青さを含む軽快な香調 (`fragrance-reset-citronella`)
- 素材例: シトロネラ
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: 青さを含む軽快な香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 青く端正なハーブの香調

### 45. ざわめきへ振り向く参加者 (`title-pair-extraversion-high--emotionalStability-low`)

- 標準パレット: ざわめきを象徴する鮮やかな黄色 (`palette-pair-extraversion-high-and-emotionalstability-low-1`)
- 代替パレット1: 揺らぐ感情の淡い紫 (`palette-pair-extraversion-high-and-emotionalstability-low-2`)
- 代替パレット2: 参加意欲のある明るい赤 (`palette-pair-extraversion-high-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青さを含む軽快な香調 (`fragrance-reset-citronella`)
- 素材例: シトロネラ
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: 青さを含む軽快な香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 青く端正なハーブの香調

### 46. 芽吹きを待つ滞在者 (`title-pair-extraversion-low--emotionalStability-high`)

- 標準パレット: 芽吹きを待つ若葉色 (`palette-pair-extraversion-low-and-emotionalstability-high-1`)
- 代替パレット1: 安定した待機の深い緑 (`palette-pair-extraversion-low-and-emotionalstability-high-2`)
- 代替パレット2: 静かな期待の白 (`palette-pair-extraversion-low-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 湿り気を含む土と葉の香調

### 47. 薄明に耳を向ける逗留者 (`title-pair-extraversion-low--emotionalStability-low`)

- 標準パレット: 薄明の深い紫 (`palette-pair-extraversion-low-and-emotionalstability-low-1`)
- 代替パレット1: 繊細な夜明けの淡い青 (`palette-pair-extraversion-low-and-emotionalstability-low-2`)
- 代替パレット2: 静寂を湛えるチャコールグレー (`palette-pair-extraversion-low-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 清らかで乾いた木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: 清らかで乾いた木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青く端正なハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: 青く端正なハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 湿り気を含む土と葉の香調

### 48. ふたつの杯の相席者 (`title-pair-agreeableness-high--emotionalStability-high`)

- 標準パレット: 調和する淡いピンク (`palette-pair-agreeableness-high-and-emotionalstability-high-1`)
- 代替パレット1: 穏やかな共有のミントグリーン (`palette-pair-agreeableness-high-and-emotionalstability-high-2`)
- 代替パレット2: 安定した共存のベージュ (`palette-pair-agreeableness-high-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほのかな甘みの柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: ほのかな甘みの柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 乾いた深みのある木質の香調

### 49. 揺れ布に並ぶ同伴者 (`title-pair-agreeableness-high--emotionalStability-low`)

- 標準パレット: 共鳴し揺れる淡い紫 (`palette-pair-agreeableness-high-and-emotionalstability-low-1`)
- 代替パレット1: 温かな寄り添いのピンク (`palette-pair-agreeableness-high-and-emotionalstability-low-2`)
- 代替パレット2: 繊細な調和のライトブルー (`palette-pair-agreeableness-high-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: 静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほのかな甘みの柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: ほのかな甘みの柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 乾いた深みのある木質の香調

### 50. 淡々たる表明者 (`title-pair-agreeableness-low--emotionalStability-high`)

- 標準パレット: 淡々とした理性のグレー (`palette-pair-agreeableness-low-and-emotionalstability-high-1`)
- 代替パレット1: 揺るがない安定の深い青 (`palette-pair-agreeableness-low-and-emotionalstability-high-2`)
- 代替パレット2: 明快な表明の白 (`palette-pair-agreeableness-low-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-pause-patchouli`)
- 素材例: パチュリ
- 香り候補: 静かな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 湿り気を含む土と葉の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂と木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 澄んだ樹木と果実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: 静かな樹脂と木質の香調

### 51. 風鳴る戸口の掲示者 (`title-pair-agreeableness-low--emotionalStability-low`)

- 標準パレット: 情熱的に鳴る深い赤 (`palette-pair-agreeableness-low-and-emotionalstability-low-1`)
- 代替パレット1: 嵐のような激しい紫 (`palette-pair-agreeableness-low-and-emotionalstability-low-2`)
- 代替パレット2: 強い意志を示す黒 (`palette-pair-agreeableness-low-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-pause-patchouli`)
- 素材例: パチュリ
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: 湿り気を含む土と葉の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂と木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: 静かな樹脂と木質の香調
