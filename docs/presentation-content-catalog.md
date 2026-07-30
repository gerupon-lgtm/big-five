# Q-013 Presentation v2 承認レビュー

正典: content/source/presentation/presentation-v2/*.csv

本書は承認用の生成ビューであり、手編集しない。

承認状況: approved=なし; draft=P-0, P-1, P-2, P-3, P-4, P-5, P-6

各セクションのstatusは承認台帳の現在値を表示する。本書の生成は承認またはruntime有効化を意味しない。

## P-0 パレットと用途色（draft）

色見本はHEXコードを併記し、淡色も判別できるよう外枠を付けている。WCAG判定はコントラスト要件、内容確認はラベルと色の意味対応を、それぞれ独立して確認する。

| ID | ラベル | 基調色 primary / secondary / accent | 用途色レシピ | 解決色 background / surface / accent / chart / text | 比率 text-bg / text-surface / accent-surface / chart-bg | WCAG判定 | 内容確認 | 説明 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `palette-balanced-1` | 澄み切った空色 | <span role="img" aria-label="primary color #7C8791" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7C8791;"></span> <code>#7C8791</code><br><span role="img" aria-label="secondary color #8FAFC1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8FAFC1;"></span> <code>#8FAFC1</code><br><span role="img" aria-label="accent color #A8B7A1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A8B7A1;"></span> <code>#A8B7A1</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F5F6;"></span> <code>#F5F5F6</code><br><span role="img" aria-label="surface color #F9FBFC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FBFC;"></span> <code>#F9FBFC</code><br><span role="img" aria-label="accent color #5C6559" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5C6559;"></span> <code>#5C6559</code><br><span role="img" aria-label="chart color #444A50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#444A50;"></span> <code>#444A50</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.242 / 14.951 / 5.846 / 8.233 | 適合 | 確認事項なし | 複数の方向を等しく見渡す中立的な印象。 |
| `palette-balanced-2` | 静謐な淡いブルー | <span role="img" aria-label="primary color #8FAFC1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8FAFC1;"></span> <code>#8FAFC1</code><br><span role="img" aria-label="secondary color #A8B7A1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A8B7A1;"></span> <code>#A8B7A1</code><br><span role="img" aria-label="accent color #7C8791" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7C8791;"></span> <code>#7C8791</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F9FA;"></span> <code>#F6F9FA</code><br><span role="img" aria-label="surface color #FBFBFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBFBFA;"></span> <code>#FBFBFA</code><br><span role="img" aria-label="accent color #444A50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#444A50;"></span> <code>#444A50</code><br><span role="img" aria-label="chart color #4F606A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F606A;"></span> <code>#4F606A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.667 / 14.987 / 8.663 / 6.176 | 適合 | 確認事項なし | 状況に応じて表情を変える静かな空のイメージ。 |
| `palette-balanced-3` | 穏やかな草原の緑 | <span role="img" aria-label="primary color #A8B7A1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A8B7A1;"></span> <code>#A8B7A1</code><br><span role="img" aria-label="secondary color #7C8791" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7C8791;"></span> <code>#7C8791</code><br><span role="img" aria-label="accent color #8FAFC1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8FAFC1;"></span> <code>#8FAFC1</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F8F9F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9F7;"></span> <code>#F8F9F7</code><br><span role="img" aria-label="surface color #F8F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9FA;"></span> <code>#F8F9FA</code><br><span role="img" aria-label="accent color #4F606A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F606A;"></span> <code>#4F606A</code><br><span role="img" aria-label="chart color #5C6559" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5C6559;"></span> <code>#5C6559</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.694 / 14.721 / 6.199 / 5.746 | 適合 | 確認事項なし | 偏りを強調せず、穏やかに全体をつなぐ色。 |
| `palette-single-intellectimagination-high-1` | 深い知性の紺色 | <span role="img" aria-label="primary color #4E5D94" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E5D94;"></span> <code>#4E5D94</code><br><span role="img" aria-label="secondary color #7567A8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7567A8;"></span> <code>#7567A8</code><br><span role="img" aria-label="accent color #4FA8B8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4FA8B8;"></span> <code>#4FA8B8</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F1F2F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F1F2F6;"></span> <code>#F1F2F6</code><br><span role="img" aria-label="surface color #F8F7FB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7FB;"></span> <code>#F8F7FB</code><br><span role="img" aria-label="accent color #2B5C65" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B5C65;"></span> <code>#2B5C65</code><br><span role="img" aria-label="chart color #2B3351" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B3351;"></span> <code>#2B3351</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.871 / 14.549 / 6.978 / 11.074 | 適合 | 確認事項なし | 未知のテーマへ視線を伸ばす深い青紫。 |
| `palette-single-intellectimagination-high-2` | 閃きを象徴する星影の紫 | <span role="img" aria-label="primary color #7567A8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7567A8;"></span> <code>#7567A8</code><br><span role="img" aria-label="secondary color #4FA8B8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4FA8B8;"></span> <code>#4FA8B8</code><br><span role="img" aria-label="accent color #4E5D94" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E5D94;"></span> <code>#4E5D94</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F3F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F3F8;"></span> <code>#F4F3F8</code><br><span role="img" aria-label="surface color #F6FBFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6FBFB;"></span> <code>#F6FBFB</code><br><span role="img" aria-label="accent color #2B3351" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B3351;"></span> <code>#2B3351</code><br><span role="img" aria-label="chart color #40395C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#40395C;"></span> <code>#40395C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.056 / 14.860 / 11.864 / 9.716 | 適合 | 確認事項なし | 発想や概念が広がる星図のような色。 |
| `palette-single-intellectimagination-high-3` | 未知への好奇心を誘うターコイズ | <span role="img" aria-label="primary color #4FA8B8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4FA8B8;"></span> <code>#4FA8B8</code><br><span role="img" aria-label="secondary color #4E5D94" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E5D94;"></span> <code>#4E5D94</code><br><span role="img" aria-label="accent color #7567A8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7567A8;"></span> <code>#7567A8</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F1F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F1F8F9;"></span> <code>#F1F8F9</code><br><span role="img" aria-label="surface color #F6F7FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7FA;"></span> <code>#F6F7FA</code><br><span role="img" aria-label="accent color #40395C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#40395C;"></span> <code>#40395C</code><br><span role="img" aria-label="chart color #2B5C65" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B5C65;"></span> <code>#2B5C65</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.435 / 14.486 / 10.013 / 6.924 | 適合 | 確認事項なし | 新しい着想がひらく瞬間を思わせる色。 |
| `palette-single-intellectimagination-low-1` | 大地の温もりを宿す茶色 | <span role="img" aria-label="primary color #8C735B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C735B;"></span> <code>#8C735B</code><br><span role="img" aria-label="secondary color #8B8D88" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8D88;"></span> <code>#8B8D88</code><br><span role="img" aria-label="accent color #89956B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#89956B;"></span> <code>#89956B</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F4F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F2;"></span> <code>#F6F4F2</code><br><span role="img" aria-label="surface color #F9F9F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F9F9;"></span> <code>#F9F9F9</code><br><span role="img" aria-label="accent color #4B523B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B523B;"></span> <code>#4B523B</code><br><span role="img" aria-label="chart color #4D3F32" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D3F32;"></span> <code>#4D3F32</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.144 / 14.739 / 7.763 / 9.235 | 適合 | 確認事項なし | 具体的な手ざわりと足元の道を表す色。 |
| `palette-single-intellectimagination-low-2` | 柔らかな陽だまりのグレージュ | <span role="img" aria-label="primary color #8B8D88" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8D88;"></span> <code>#8B8D88</code><br><span role="img" aria-label="secondary color #89956B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#89956B;"></span> <code>#89956B</code><br><span role="img" aria-label="accent color #8C735B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C735B;"></span> <code>#8C735B</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F6F5;"></span> <code>#F6F6F5</code><br><span role="img" aria-label="surface color #F9FAF8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FAF8;"></span> <code>#F9FAF8</code><br><span role="img" aria-label="accent color #4D3F32" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D3F32;"></span> <code>#4D3F32</code><br><span role="img" aria-label="chart color #4C4E4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C4E4B;"></span> <code>#4C4E4B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.350 / 14.821 / 9.677 / 7.772 | 適合 | 確認事項なし | 確かめられるものを一つずつ辿る印象。 |
| `palette-single-intellectimagination-low-3` | 落ち着いたモスグリーン | <span role="img" aria-label="primary color #89956B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#89956B;"></span> <code>#89956B</code><br><span role="img" aria-label="secondary color #8C735B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C735B;"></span> <code>#8C735B</code><br><span role="img" aria-label="accent color #8B8D88" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8D88;"></span> <code>#8B8D88</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F7F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F3;"></span> <code>#F6F7F3</code><br><span role="img" aria-label="surface color #F9F8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F8F7;"></span> <code>#F9F8F7</code><br><span role="img" aria-label="accent color #4C4E4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C4E4B;"></span> <code>#4C4E4B</code><br><span role="img" aria-label="chart color #4B523B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B523B;"></span> <code>#4B523B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.422 / 14.630 / 7.923 / 7.596 | 適合 | 確認事項なし | 身近な経験や現実感を象徴する落ち着いた緑。 |
| `palette-single-conscientiousness-high-1` | 規律ある濃紺 | <span role="img" aria-label="primary color #40566F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#40566F;"></span> <code>#40566F</code><br><span role="img" aria-label="secondary color #6986A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6986A3;"></span> <code>#6986A3</code><br><span role="img" aria-label="accent color #6E7881" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E7881;"></span> <code>#6E7881</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F1F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F1F3;"></span> <code>#F0F1F3</code><br><span role="img" aria-label="surface color #F8F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9FA;"></span> <code>#F8F9FA</code><br><span role="img" aria-label="accent color #3D4247" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D4247;"></span> <code>#3D4247</code><br><span role="img" aria-label="chart color #232F3D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#232F3D;"></span> <code>#232F3D</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.731 / 14.721 / 9.630 / 12.023 | 適合 | 確認事項なし | 計画や段取りを整える端正な印象。 |
| `palette-single-conscientiousness-high-2` | 静止した空気のグレー | <span role="img" aria-label="primary color #6986A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6986A3;"></span> <code>#6986A3</code><br><span role="img" aria-label="secondary color #6E7881" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E7881;"></span> <code>#6E7881</code><br><span role="img" aria-label="accent color #40566F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#40566F;"></span> <code>#40566F</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F5F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F5F8;"></span> <code>#F3F5F8</code><br><span role="img" aria-label="surface color #F8F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F8F9;"></span> <code>#F8F8F9</code><br><span role="img" aria-label="accent color #232F3D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#232F3D;"></span> <code>#232F3D</code><br><span role="img" aria-label="chart color #3A4A5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A4A5A;"></span> <code>#3A4A5A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.208 / 14.621 / 12.803 / 8.334 | 適合 | 確認事項なし | 区切りと見通しを感じさせる実務的な青。 |
| `palette-single-conscientiousness-high-3` | 誠実な白磁色 | <span role="img" aria-label="primary color #6E7881" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E7881;"></span> <code>#6E7881</code><br><span role="img" aria-label="secondary color #40566F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#40566F;"></span> <code>#40566F</code><br><span role="img" aria-label="accent color #6986A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6986A3;"></span> <code>#6986A3</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F4F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F4F5;"></span> <code>#F3F4F5</code><br><span role="img" aria-label="surface color #F5F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F7F8;"></span> <code>#F5F7F8</code><br><span role="img" aria-label="accent color #3A4A5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A4A5A;"></span> <code>#3A4A5A</code><br><span role="img" aria-label="chart color #3D4247" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D4247;"></span> <code>#3D4247</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.091 / 14.441 / 8.471 / 9.218 | 適合 | 確認事項なし | 秩序立てて積み重ねる姿を表す色。 |
| `palette-single-conscientiousness-low-1` | 自由な風のスカイブルー | <span role="img" aria-label="primary color #4F9C98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F9C98;"></span> <code>#4F9C98</code><br><span role="img" aria-label="secondary color #7FA36B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7FA36B;"></span> <code>#7FA36B</code><br><span role="img" aria-label="accent color #C2AA84" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C2AA84;"></span> <code>#C2AA84</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F1F7F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F1F7F7;"></span> <code>#F1F7F7</code><br><span role="img" aria-label="surface color #F9FAF8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FAF8;"></span> <code>#F9FAF8</code><br><span role="img" aria-label="accent color #6B5E49" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B5E49;"></span> <code>#6B5E49</code><br><span role="img" aria-label="chart color #2B5654" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B5654;"></span> <code>#2B5654</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.326 / 14.821 / 6.037 / 7.568 | 適合 | 確認事項なし | 流れに応じて方向を変える軽やかな青緑。 |
| `palette-single-conscientiousness-low-2` | 移ろいゆく風の若草色 | <span role="img" aria-label="primary color #7FA36B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7FA36B;"></span> <code>#7FA36B</code><br><span role="img" aria-label="secondary color #C2AA84" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C2AA84;"></span> <code>#C2AA84</code><br><span role="img" aria-label="accent color #4F9C98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F9C98;"></span> <code>#4F9C98</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F8F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F8F3;"></span> <code>#F5F8F3</code><br><span role="img" aria-label="surface color #FCFBF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCFBF9;"></span> <code>#FCFBF9</code><br><span role="img" aria-label="accent color #2B5654" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B5654;"></span> <code>#2B5654</code><br><span role="img" aria-label="chart color #465A3B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#465A3B;"></span> <code>#465A3B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.486 / 15.005 / 7.926 / 7.036 | 適合 | 確認事項なし | 決めすぎず自然に進む柔軟な印象。 |
| `palette-single-conscientiousness-low-3` | 軽やかな雲のサンドベージュ | <span role="img" aria-label="primary color #C2AA84" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C2AA84;"></span> <code>#C2AA84</code><br><span role="img" aria-label="secondary color #4F9C98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F9C98;"></span> <code>#4F9C98</code><br><span role="img" aria-label="accent color #7FA36B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7FA36B;"></span> <code>#7FA36B</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAF8F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF8F5;"></span> <code>#FAF8F5</code><br><span role="img" aria-label="surface color #F6FAFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6FAFA;"></span> <code>#F6FAFA</code><br><span role="img" aria-label="accent color #465A3B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#465A3B;"></span> <code>#465A3B</code><br><span role="img" aria-label="chart color #6B5E49" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B5E49;"></span> <code>#6B5E49</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.639 / 14.759 / 7.169 / 5.963 | 適合 | 確認事項なし | 行き先を固定しない広い余白を象徴する色。 |
| `palette-single-extraversion-high-1` | 陽気なコーラルピンク | <span role="img" aria-label="primary color #E07868" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E07868;"></span> <code>#E07868</code><br><span role="img" aria-label="secondary color #E69A4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E69A4B;"></span> <code>#E69A4B</code><br><span role="img" aria-label="accent color #38A8A0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#38A8A0;"></span> <code>#38A8A0</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FDF4F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDF4F3;"></span> <code>#FDF4F3</code><br><span role="img" aria-label="surface color #FEFAF6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FEFAF6;"></span> <code>#FEFAF6</code><br><span role="img" aria-label="accent color #1F5C58" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F5C58;"></span> <code>#1F5C58</code><br><span role="img" aria-label="chart color #7B4239" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7B4239;"></span> <code>#7B4239</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.344 / 14.941 / 7.406 / 7.241 | 適合 | 確認事項なし | 人の輪へ自然に進む温かい活気。 |
| `palette-single-extraversion-high-2` | 活気に満ちたオレンジ | <span role="img" aria-label="primary color #E69A4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E69A4B;"></span> <code>#E69A4B</code><br><span role="img" aria-label="secondary color #38A8A0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#38A8A0;"></span> <code>#38A8A0</code><br><span role="img" aria-label="accent color #E07868" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E07868;"></span> <code>#E07868</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FDF7F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDF7F1;"></span> <code>#FDF7F1</code><br><span role="img" aria-label="surface color #F5FBFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5FBFA;"></span> <code>#F5FBFA</code><br><span role="img" aria-label="accent color #7B4239" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7B4239;"></span> <code>#7B4239</code><br><span role="img" aria-label="chart color #7F5529" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7F5529;"></span> <code>#7F5529</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.595 / 14.824 / 7.484 / 6.108 | 適合 | 確認事項なし | にぎわいと開放感を表す明るい色。 |
| `palette-single-extraversion-high-3` | 交流をひらくターコイズ | <span role="img" aria-label="primary color #38A8A0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#38A8A0;"></span> <code>#38A8A0</code><br><span role="img" aria-label="secondary color #E07868" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E07868;"></span> <code>#E07868</code><br><span role="img" aria-label="accent color #E69A4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E69A4B;"></span> <code>#E69A4B</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EFF8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EFF8F7;"></span> <code>#EFF8F7</code><br><span role="img" aria-label="surface color #FDF8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDF8F7;"></span> <code>#FDF8F7</code><br><span role="img" aria-label="accent color #7F5529" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7F5529;"></span> <code>#7F5529</code><br><span role="img" aria-label="chart color #1F5C58" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F5C58;"></span> <code>#1F5C58</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.365 / 14.739 / 6.168 / 7.121 | 適合 | 確認事項なし | 交流の流れと軽快さを象徴する青緑。 |
| `palette-single-extraversion-low-1` | 深い夜のミッドナイトブルー | <span role="img" aria-label="primary color #394A63" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#394A63;"></span> <code>#394A63</code><br><span role="img" aria-label="secondary color #596F86" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#596F86;"></span> <code>#596F86</code><br><span role="img" aria-label="accent color #6E687E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E687E;"></span> <code>#6E687E</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EFF1F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EFF1F3;"></span> <code>#EFF1F3</code><br><span role="img" aria-label="surface color #F7F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F8F9;"></span> <code>#F7F8F9</code><br><span role="img" aria-label="accent color #3D3945" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D3945;"></span> <code>#3D3945</code><br><span role="img" aria-label="chart color #1F2936" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2936;"></span> <code>#1F2936</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.705 / 14.594 / 10.564 / 12.981 | 適合 | 確認事項なし | 静かな環境に長く留まる深い青。 |
| `palette-single-extraversion-low-2` | 静寂を纏うシルバーグレー | <span role="img" aria-label="primary color #596F86" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#596F86;"></span> <code>#596F86</code><br><span role="img" aria-label="secondary color #6E687E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E687E;"></span> <code>#6E687E</code><br><span role="img" aria-label="accent color #394A63" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#394A63;"></span> <code>#394A63</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F2F3F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F2F3F5;"></span> <code>#F2F3F5</code><br><span role="img" aria-label="surface color #F8F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F9;"></span> <code>#F8F7F9</code><br><span role="img" aria-label="accent color #1F2936" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2936;"></span> <code>#1F2936</code><br><span role="img" aria-label="chart color #313D4A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#313D4A;"></span> <code>#313D4A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.976 / 14.530 / 13.763 / 9.971 | 適合 | 確認事項なし | 外を眺めながら内側を整える色。 |
| `palette-single-extraversion-low-3` | 落ち着いた藤色 | <span role="img" aria-label="primary color #6E687E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E687E;"></span> <code>#6E687E</code><br><span role="img" aria-label="secondary color #394A63" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#394A63;"></span> <code>#394A63</code><br><span role="img" aria-label="accent color #596F86" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#596F86;"></span> <code>#596F86</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F3F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F3F5;"></span> <code>#F3F3F5</code><br><span role="img" aria-label="surface color #F5F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F6F7;"></span> <code>#F5F6F7</code><br><span role="img" aria-label="accent color #313D4A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#313D4A;"></span> <code>#313D4A</code><br><span role="img" aria-label="chart color #3D3945" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D3945;"></span> <code>#3D3945</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.003 / 14.341 / 10.231 / 10.136 | 適合 | 確認事項なし | 控えめな存在感と落ち着きを表す紫灰。 |
| `palette-single-agreeableness-high-1` | 温かなパステルピンク | <span role="img" aria-label="primary color #C98591" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C98591;"></span> <code>#C98591</code><br><span role="img" aria-label="secondary color #91A98F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#91A98F;"></span> <code>#91A98F</code><br><span role="img" aria-label="accent color #C8B49A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C8B49A;"></span> <code>#C8B49A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FBF5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF5F6;"></span> <code>#FBF5F6</code><br><span role="img" aria-label="surface color #FAFBF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAFBF9;"></span> <code>#FAFBF9</code><br><span role="img" aria-label="accent color #6E6355" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E6355;"></span> <code>#6E6355</code><br><span role="img" aria-label="chart color #6F4950" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F4950;"></span> <code>#6F4950</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.405 / 14.950 / 5.653 / 7.102 | 適合 | 確認事項なし | 歩幅を合わせる温かな関わりを象徴。 |
| `palette-single-agreeableness-high-2` | 包容力のあるミントグリーン | <span role="img" aria-label="primary color #91A98F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#91A98F;"></span> <code>#91A98F</code><br><span role="img" aria-label="secondary color #C8B49A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C8B49A;"></span> <code>#C8B49A</code><br><span role="img" aria-label="accent color #C98591" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C98591;"></span> <code>#C98591</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F8F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F8F6;"></span> <code>#F6F8F6</code><br><span role="img" aria-label="surface color #FCFBFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCFBFA;"></span> <code>#FCFBFA</code><br><span role="img" aria-label="accent color #6F4950" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F4950;"></span> <code>#6F4950</code><br><span role="img" aria-label="chart color #505D4F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#505D4F;"></span> <code>#505D4F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.540 / 15.014 / 7.403 / 6.516 | 適合 | 確認事項なし | 周囲との調和をやわらかく支える緑。 |
| `palette-single-agreeableness-high-3` | 穏やかなアイボリー | <span role="img" aria-label="primary color #C8B49A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C8B49A;"></span> <code>#C8B49A</code><br><span role="img" aria-label="secondary color #C98591" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C98591;"></span> <code>#C98591</code><br><span role="img" aria-label="accent color #91A98F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#91A98F;"></span> <code>#91A98F</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FBF9F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF9F7;"></span> <code>#FBF9F7</code><br><span role="img" aria-label="surface color #FCF9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF9FA;"></span> <code>#FCF9FA</code><br><span role="img" aria-label="accent color #505D4F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#505D4F;"></span> <code>#505D4F</code><br><span role="img" aria-label="chart color #6E6355" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E6355;"></span> <code>#6E6355</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.775 / 14.830 / 6.646 / 5.587 | 適合 | 確認事項なし | 相手を受け止める穏やかな印象。 |
| `palette-single-agreeableness-low-1` | 意志ある深い赤 | <span role="img" aria-label="primary color #A65F4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A65F4B;"></span> <code>#A65F4B</code><br><span role="img" aria-label="secondary color #495A72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#495A72;"></span> <code>#495A72</code><br><span role="img" aria-label="accent color #B58A4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B58A4C;"></span> <code>#B58A4C</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F8F2F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F2F1;"></span> <code>#F8F2F1</code><br><span role="img" aria-label="surface color #F6F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F8;"></span> <code>#F6F7F8</code><br><span role="img" aria-label="accent color #644C2A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#644C2A;"></span> <code>#644C2A</code><br><span role="img" aria-label="chart color #5B3429" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5B3429;"></span> <code>#5B3429</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.012 / 14.467 / 7.504 / 9.635 | 適合 | 確認事項なし | 自分の歩幅を保つ確かな存在感。 |
| `palette-single-agreeableness-low-2` | 独立心を示す深いブルーグレー | <span role="img" aria-label="primary color #495A72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#495A72;"></span> <code>#495A72</code><br><span role="img" aria-label="secondary color #B58A4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B58A4C;"></span> <code>#B58A4C</code><br><span role="img" aria-label="accent color #A65F4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A65F4B;"></span> <code>#A65F4B</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F2F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F2F4;"></span> <code>#F0F2F4</code><br><span role="img" aria-label="surface color #FBF9F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF9F6;"></span> <code>#FBF9F6</code><br><span role="img" aria-label="accent color #5B3429" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5B3429;"></span> <code>#5B3429</code><br><span role="img" aria-label="chart color #28323F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#28323F;"></span> <code>#28323F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.827 / 14.766 / 10.154 / 11.563 | 適合 | 確認事項なし | 自分の基準や距離感を示す青。 |
| `palette-single-agreeableness-low-3` | 揺るがない鉄錆色 | <span role="img" aria-label="primary color #B58A4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B58A4C;"></span> <code>#B58A4C</code><br><span role="img" aria-label="secondary color #A65F4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A65F4B;"></span> <code>#A65F4B</code><br><span role="img" aria-label="accent color #495A72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#495A72;"></span> <code>#495A72</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9F6F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F6F1;"></span> <code>#F9F6F1</code><br><span role="img" aria-label="surface color #FBF7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF7F6;"></span> <code>#FBF7F6</code><br><span role="img" aria-label="accent color #28323F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#28323F;"></span> <code>#28323F</code><br><span role="img" aria-label="chart color #644C2A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#644C2A;"></span> <code>#644C2A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.395 / 14.584 / 12.197 / 7.466 | 適合 | 確認事項なし | 率直さと現実的な判断を思わせる色。 |
| `palette-single-emotionalstability-high-1` | 凪いだ海の深い青 | <span role="img" aria-label="primary color #5F86A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5F86A3;"></span> <code>#5F86A3</code><br><span role="img" aria-label="secondary color #405D73" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#405D73;"></span> <code>#405D73</code><br><span role="img" aria-label="accent color #6D9287" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6D9287;"></span> <code>#6D9287</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F2F5F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F2F5F8;"></span> <code>#F2F5F8</code><br><span role="img" aria-label="surface color #F5F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F7F8;"></span> <code>#F5F7F8</code><br><span role="img" aria-label="accent color #3C504A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3C504A;"></span> <code>#3C504A</code><br><span role="img" aria-label="chart color #344A5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#344A5A;"></span> <code>#344A5A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.182 / 14.441 / 8.014 / 8.443 | 適合 | 確認事項なし | 波立ちの少ない水面を思わせる青。 |
| `palette-single-emotionalstability-high-2` | 安らぎを運ぶ淡い水色 | <span role="img" aria-label="primary color #405D73" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#405D73;"></span> <code>#405D73</code><br><span role="img" aria-label="secondary color #6D9287" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6D9287;"></span> <code>#6D9287</code><br><span role="img" aria-label="accent color #5F86A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5F86A3;"></span> <code>#5F86A3</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F2F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F2F4;"></span> <code>#F0F2F4</code><br><span role="img" aria-label="surface color #F8FAF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8FAF9;"></span> <code>#F8FAF9</code><br><span role="img" aria-label="accent color #344A5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#344A5A;"></span> <code>#344A5A</code><br><span role="img" aria-label="chart color #23333F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#23333F;"></span> <code>#23333F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.827 / 14.803 / 8.813 / 11.574 | 適合 | 確認事項なし | 落ち着いて進む航路を象徴する色。 |
| `palette-single-emotionalstability-high-3` | 静穏な青磁色 | <span role="img" aria-label="primary color #6D9287" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6D9287;"></span> <code>#6D9287</code><br><span role="img" aria-label="secondary color #5F86A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5F86A3;"></span> <code>#5F86A3</code><br><span role="img" aria-label="accent color #405D73" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#405D73;"></span> <code>#405D73</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F6F5;"></span> <code>#F3F6F5</code><br><span role="img" aria-label="surface color #F7F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F9FA;"></span> <code>#F7F9FA</code><br><span role="img" aria-label="accent color #23333F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#23333F;"></span> <code>#23333F</code><br><span role="img" aria-label="chart color #3C504A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3C504A;"></span> <code>#3C504A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.270 / 14.694 / 12.300 / 7.920 | 適合 | 確認事項なし | 穏やかな持続感を表す青緑。 |
| `palette-single-emotionalstability-low-1` | 移ろう光の淡い紫 | <span role="img" aria-label="primary color #9A83AD" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A83AD;"></span> <code>#9A83AD</code><br><span role="img" aria-label="secondary color #86A8B8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#86A8B8;"></span> <code>#86A8B8</code><br><span role="img" aria-label="accent color #C99AA3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C99AA3;"></span> <code>#C99AA3</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F7F5F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F5F8;"></span> <code>#F7F5F8</code><br><span role="img" aria-label="surface color #F9FBFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FBFB;"></span> <code>#F9FBFB</code><br><span role="img" aria-label="accent color #6F555A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F555A;"></span> <code>#6F555A</code><br><span role="img" aria-label="chart color #55485F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#55485F;"></span> <code>#55485F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.314 / 14.941 / 6.475 / 7.816 | 適合 | 確認事項なし | 小さな変化を受け取る繊細な紫。 |
| `palette-single-emotionalstability-low-2` | 揺れる水面の淡い青 | <span role="img" aria-label="primary color #86A8B8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#86A8B8;"></span> <code>#86A8B8</code><br><span role="img" aria-label="secondary color #C99AA3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C99AA3;"></span> <code>#C99AA3</code><br><span role="img" aria-label="accent color #9A83AD" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A83AD;"></span> <code>#9A83AD</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F8F9;"></span> <code>#F5F8F9</code><br><span role="img" aria-label="surface color #FCFAFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCFAFA;"></span> <code>#FCFAFA</code><br><span role="img" aria-label="accent color #55485F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#55485F;"></span> <code>#55485F</code><br><span role="img" aria-label="chart color #4A5C65" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A5C65;"></span> <code>#4A5C65</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.540 / 14.922 / 8.148 / 6.537 | 適合 | 確認事項なし | 周囲の気配に振り向く軽い青。 |
| `palette-single-emotionalstability-low-3` | 繊細な薄紅色の花びら | <span role="img" aria-label="primary color #C99AA3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C99AA3;"></span> <code>#C99AA3</code><br><span role="img" aria-label="secondary color #9A83AD" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A83AD;"></span> <code>#9A83AD</code><br><span role="img" aria-label="accent color #86A8B8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#86A8B8;"></span> <code>#86A8B8</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FBF7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF7F8;"></span> <code>#FBF7F8</code><br><span role="img" aria-label="surface color #FAF9FB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF9FB;"></span> <code>#FAF9FB</code><br><span role="img" aria-label="accent color #4A5C65" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A5C65;"></span> <code>#4A5C65</code><br><span role="img" aria-label="chart color #6F555A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F555A;"></span> <code>#6F555A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.603 / 14.785 / 6.647 / 6.328 | 適合 | 確認事項なし | 細やかな反応をやわらかく表す色。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-high-1` | 星夜の深い紺 | <span role="img" aria-label="primary color #344A72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#344A72;"></span> <code>#344A72</code><br><span role="img" aria-label="secondary color #B8954F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B8954F;"></span> <code>#B8954F</code><br><span role="img" aria-label="accent color #665B94" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665B94;"></span> <code>#665B94</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EFF1F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EFF1F4;"></span> <code>#EFF1F4</code><br><span role="img" aria-label="surface color #FBFAF6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBFAF6;"></span> <code>#FBFAF6</code><br><span role="img" aria-label="accent color #383251" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#383251;"></span> <code>#383251</code><br><span role="img" aria-label="chart color #1D293F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1D293F;"></span> <code>#1D293F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.714 / 14.858 / 11.534 / 12.877 | 適合 | 確認事項なし | 構想と記録を同時に支える深い青。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-high-2` | 精緻な記録の黄金色 | <span role="img" aria-label="primary color #B8954F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B8954F;"></span> <code>#B8954F</code><br><span role="img" aria-label="secondary color #665B94" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665B94;"></span> <code>#665B94</code><br><span role="img" aria-label="accent color #344A72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#344A72;"></span> <code>#344A72</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9F7F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F1;"></span> <code>#F9F7F1</code><br><span role="img" aria-label="surface color #F7F7FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7FA;"></span> <code>#F7F7FA</code><br><span role="img" aria-label="accent color #1D293F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1D293F;"></span> <code>#1D293F</code><br><span role="img" aria-label="chart color #65522B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#65522B;"></span> <code>#65522B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.485 / 14.512 / 13.627 / 7.013 | 適合 | 確認事項なし | 印を置き積み重ねる行為を象徴。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-high-3` | 冷静な思考の白 | <span role="img" aria-label="primary color #665B94" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665B94;"></span> <code>#665B94</code><br><span role="img" aria-label="secondary color #344A72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#344A72;"></span> <code>#344A72</code><br><span role="img" aria-label="accent color #B8954F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B8954F;"></span> <code>#B8954F</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F2F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F2F6;"></span> <code>#F3F2F6</code><br><span role="img" aria-label="surface color #F5F6F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F6F8;"></span> <code>#F5F6F8</code><br><span role="img" aria-label="accent color #65522B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#65522B;"></span> <code>#65522B</code><br><span role="img" aria-label="chart color #383251" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#383251;"></span> <code>#383251</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.923 / 14.350 / 6.948 / 10.809 | 適合 | 確認事項なし | 発想を構造へ落とし込む紫。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-low-1` | 夢幻的なペールバイオレット | <span role="img" aria-label="primary color #9A83C1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A83C1;"></span> <code>#9A83C1</code><br><span role="img" aria-label="secondary color #6F9FBB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F9FBB;"></span> <code>#6F9FBB</code><br><span role="img" aria-label="accent color #7FB7A5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7FB7A5;"></span> <code>#7FB7A5</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F7F5FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F5FA;"></span> <code>#F7F5FA</code><br><span role="img" aria-label="surface color #F8FAFC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8FAFC;"></span> <code>#F8FAFC</code><br><span role="img" aria-label="accent color #46655B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#46655B;"></span> <code>#46655B</code><br><span role="img" aria-label="chart color #55486A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#55486A;"></span> <code>#55486A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.333 / 14.831 / 6.132 / 7.693 | 適合 | 確認事項なし | 自由に広がる想像の余白。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-low-2` | 自由な空の淡い青 | <span role="img" aria-label="primary color #6F9FBB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F9FBB;"></span> <code>#6F9FBB</code><br><span role="img" aria-label="secondary color #7FB7A5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7FB7A5;"></span> <code>#7FB7A5</code><br><span role="img" aria-label="accent color #9A83C1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A83C1;"></span> <code>#9A83C1</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F7FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F7FA;"></span> <code>#F3F7FA</code><br><span role="img" aria-label="surface color #F9FBFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FBFB;"></span> <code>#F9FBFB</code><br><span role="img" aria-label="accent color #55486A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#55486A;"></span> <code>#55486A</code><br><span role="img" aria-label="chart color #3D5767" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D5767;"></span> <code>#3D5767</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.406 / 14.941 / 8.020 / 7.070 | 適合 | 確認事項なし | 形を変えながら流れる発想を表す青。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-low-3` | 想像力を刺激するミントグリーン | <span role="img" aria-label="primary color #7FB7A5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7FB7A5;"></span> <code>#7FB7A5</code><br><span role="img" aria-label="secondary color #9A83C1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A83C1;"></span> <code>#9A83C1</code><br><span role="img" aria-label="accent color #6F9FBB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F9FBB;"></span> <code>#6F9FBB</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F9F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F9F8;"></span> <code>#F5F9F8</code><br><span role="img" aria-label="surface color #FAF9FC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF9FC;"></span> <code>#FAF9FC</code><br><span role="img" aria-label="accent color #3D5767" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D5767;"></span> <code>#3D5767</code><br><span role="img" aria-label="chart color #46655B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#46655B;"></span> <code>#46655B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.622 / 14.794 / 7.260 / 6.046 | 適合 | 確認事項なし | 軽やかに方向を変える青緑。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-high-1` | 実直なオリーブ色 | <span role="img" aria-label="primary color #7C875A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7C875A;"></span> <code>#7C875A</code><br><span role="img" aria-label="secondary color #8E735E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8E735E;"></span> <code>#8E735E</code><br><span role="img" aria-label="accent color #94928A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#94928A;"></span> <code>#94928A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F5F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F5F2;"></span> <code>#F5F5F2</code><br><span role="img" aria-label="surface color #F9F8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F8F7;"></span> <code>#F9F8F7</code><br><span role="img" aria-label="accent color #51504C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#51504C;"></span> <code>#51504C</code><br><span role="img" aria-label="chart color #444A32" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#444A32;"></span> <code>#444A32</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.207 / 14.630 / 7.610 / 8.464 | 適合 | 確認事項なし | 具体的な歩みを着実に重ねる色。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-high-2` | 誠実な土のブラウン | <span role="img" aria-label="primary color #8E735E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8E735E;"></span> <code>#8E735E</code><br><span role="img" aria-label="secondary color #94928A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#94928A;"></span> <code>#94928A</code><br><span role="img" aria-label="accent color #7C875A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7C875A;"></span> <code>#7C875A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F4F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F2;"></span> <code>#F6F4F2</code><br><span role="img" aria-label="surface color #FAFAF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAFAF9;"></span> <code>#FAFAF9</code><br><span role="img" aria-label="accent color #444A32" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#444A32;"></span> <code>#444A32</code><br><span role="img" aria-label="chart color #4E3F34" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E3F34;"></span> <code>#4E3F34</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.144 / 14.858 / 8.852 / 9.182 | 適合 | 確認事項なし | 手を動かし続ける実直な印象。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-high-3` | 飾らないストーングレー | <span role="img" aria-label="primary color #94928A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#94928A;"></span> <code>#94928A</code><br><span role="img" aria-label="secondary color #7C875A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7C875A;"></span> <code>#7C875A</code><br><span role="img" aria-label="accent color #8E735E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8E735E;"></span> <code>#8E735E</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F6F6;"></span> <code>#F6F6F6</code><br><span role="img" aria-label="surface color #F8F9F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9F7;"></span> <code>#F8F9F7</code><br><span role="img" aria-label="accent color #4E3F34" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E3F34;"></span> <code>#4E3F34</code><br><span role="img" aria-label="chart color #51504C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#51504C;"></span> <code>#51504C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.359 / 14.694 / 9.539 / 7.469 | 適合 | 確認事項なし | 飾らず続ける姿勢を象徴。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-low-1` | 陽光を浴びた淡い黄色 | <span role="img" aria-label="primary color #C3A980" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C3A980;"></span> <code>#C3A980</code><br><span role="img" aria-label="secondary color #94B79E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#94B79E;"></span> <code>#94B79E</code><br><span role="img" aria-label="accent color #89A6B1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#89A6B1;"></span> <code>#89A6B1</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAF8F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF8F5;"></span> <code>#FAF8F5</code><br><span role="img" aria-label="surface color #FAFBFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAFBFA;"></span> <code>#FAFBFA</code><br><span role="img" aria-label="accent color #4B5B61" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B5B61;"></span> <code>#4B5B61</code><br><span role="img" aria-label="chart color #6B5D46" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B5D46;"></span> <code>#6B5D46</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.639 / 14.959 / 6.820 / 6.041 | 適合 | 確認事項なし | 気ままに歩く道の余白。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-low-2` | 気ままな風のミントグリーン | <span role="img" aria-label="primary color #94B79E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#94B79E;"></span> <code>#94B79E</code><br><span role="img" aria-label="secondary color #89A6B1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#89A6B1;"></span> <code>#89A6B1</code><br><span role="img" aria-label="accent color #C3A980" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C3A980;"></span> <code>#C3A980</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F9F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F9F7;"></span> <code>#F6F9F7</code><br><span role="img" aria-label="surface color #F9FBFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FBFB;"></span> <code>#F9FBFB</code><br><span role="img" aria-label="accent color #6B5D46" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B5D46;"></span> <code>#6B5D46</code><br><span role="img" aria-label="chart color #516557" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#516557;"></span> <code>#516557</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.640 / 14.941 / 6.166 / 5.916 | 適合 | 確認事項なし | その場の流れへ自然に馴染む色。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-low-3` | 柔らかな砂の色 | <span role="img" aria-label="primary color #89A6B1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#89A6B1;"></span> <code>#89A6B1</code><br><span role="img" aria-label="secondary color #C3A980" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C3A980;"></span> <code>#C3A980</code><br><span role="img" aria-label="accent color #94B79E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#94B79E;"></span> <code>#94B79E</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F8F9;"></span> <code>#F6F8F9</code><br><span role="img" aria-label="surface color #FCFBF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCFBF9;"></span> <code>#FCFBF9</code><br><span role="img" aria-label="accent color #516557" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#516557;"></span> <code>#516557</code><br><span role="img" aria-label="chart color #4B5B61" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B5B61;"></span> <code>#4B5B61</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.567 / 15.005 / 6.063 / 6.642 | 適合 | 確認事項なし | 決めすぎない穏やかな移動感。 |
| `palette-pair-intellectimagination-high-and-extraversion-high-1` | 鮮やかなターコイズブルー | <span role="img" aria-label="primary color #27A9B8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#27A9B8;"></span> <code>#27A9B8</code><br><span role="img" aria-label="secondary color #DF7168" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DF7168;"></span> <code>#DF7168</code><br><span role="img" aria-label="accent color #D9B54A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D9B54A;"></span> <code>#D9B54A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EEF8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EEF8F9;"></span> <code>#EEF8F9</code><br><span role="img" aria-label="surface color #FDF8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDF8F7;"></span> <code>#FDF8F7</code><br><span role="img" aria-label="accent color #776429" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#776429;"></span> <code>#776429</code><br><span role="img" aria-label="chart color #155D65" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#155D65;"></span> <code>#155D65</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.358 / 14.739 / 5.481 / 6.975 | 適合 | 確認事項なし | 新しい考えを外へ運ぶ鮮やかな青。 |
| `palette-pair-intellectimagination-high-and-extraversion-high-2` | 活力を運ぶオレンジゴールド | <span role="img" aria-label="primary color #DF7168" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DF7168;"></span> <code>#DF7168</code><br><span role="img" aria-label="secondary color #D9B54A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D9B54A;"></span> <code>#D9B54A</code><br><span role="img" aria-label="accent color #27A9B8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#27A9B8;"></span> <code>#27A9B8</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FCF4F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF4F3;"></span> <code>#FCF4F3</code><br><span role="img" aria-label="surface color #FDFBF6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDFBF6;"></span> <code>#FDFBF6</code><br><span role="img" aria-label="accent color #155D65" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#155D65;"></span> <code>#155D65</code><br><span role="img" aria-label="chart color #7B3E39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7B3E39;"></span> <code>#7B3E39</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.316 / 15.005 / 7.290 / 7.479 | 適合 | 確認事項なし | 言葉や交流の熱を象徴する色。 |
| `palette-pair-intellectimagination-high-and-extraversion-high-3` | 知的な輝きのゴールド | <span role="img" aria-label="primary color #D9B54A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D9B54A;"></span> <code>#D9B54A</code><br><span role="img" aria-label="secondary color #27A9B8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#27A9B8;"></span> <code>#27A9B8</code><br><span role="img" aria-label="accent color #DF7168" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DF7168;"></span> <code>#DF7168</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FCF9F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF9F1;"></span> <code>#FCF9F1</code><br><span role="img" aria-label="surface color #F4FBFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4FBFB;"></span> <code>#F4FBFB</code><br><span role="img" aria-label="accent color #7B3E39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7B3E39;"></span> <code>#7B3E39</code><br><span role="img" aria-label="chart color #776429" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#776429;"></span> <code>#776429</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.749 / 14.807 / 7.736 / 5.484 | 適合 | 確認事項なし | 着想が人の輪に届く明るさ。 |
| `palette-pair-intellectimagination-high-and-extraversion-low-1` | 静寂を極めた深い黒 | <span role="img" aria-label="primary color #3F4B78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F4B78;"></span> <code>#3F4B78</code><br><span role="img" aria-label="secondary color #665C91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665C91;"></span> <code>#665C91</code><br><span role="img" aria-label="accent color #5E91A4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5E91A4;"></span> <code>#5E91A4</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F1F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F1F4;"></span> <code>#F0F1F4</code><br><span role="img" aria-label="surface color #F7F7FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7FA;"></span> <code>#F7F7FA</code><br><span role="img" aria-label="accent color #34505A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#34505A;"></span> <code>#34505A</code><br><span role="img" aria-label="chart color #232942" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#232942;"></span> <code>#232942</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.739 / 14.512 / 8.045 / 12.672 | 適合 | 確認事項なし | 静かな場所で思索を深める色。 |
| `palette-pair-intellectimagination-high-and-extraversion-low-2` | 宇宙の深淵を映す紫 | <span role="img" aria-label="primary color #665C91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665C91;"></span> <code>#665C91</code><br><span role="img" aria-label="secondary color #5E91A4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5E91A4;"></span> <code>#5E91A4</code><br><span role="img" aria-label="accent color #3F4B78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F4B78;"></span> <code>#3F4B78</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F2F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F2F6;"></span> <code>#F3F2F6</code><br><span role="img" aria-label="surface color #F7FAFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7FAFA;"></span> <code>#F7FAFA</code><br><span role="img" aria-label="accent color #232942" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#232942;"></span> <code>#232942</code><br><span role="img" aria-label="chart color #383350" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#383350;"></span> <code>#383350</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.923 / 14.786 / 13.637 / 10.721 | 適合 | 確認事項なし | 内側で広がる星図を思わせる紫。 |
| `palette-pair-intellectimagination-high-and-extraversion-low-3` | 遠い星の淡い光色 | <span role="img" aria-label="primary color #5E91A4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5E91A4;"></span> <code>#5E91A4</code><br><span role="img" aria-label="secondary color #3F4B78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F4B78;"></span> <code>#3F4B78</code><br><span role="img" aria-label="accent color #665C91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665C91;"></span> <code>#665C91</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F2F6F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F2F6F8;"></span> <code>#F2F6F8</code><br><span role="img" aria-label="surface color #F5F6F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F6F8;"></span> <code>#F5F6F8</code><br><span role="img" aria-label="accent color #383350" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#383350;"></span> <code>#383350</code><br><span role="img" aria-label="chart color #34505A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#34505A;"></span> <code>#34505A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.271 / 14.350 / 11.050 / 7.912 | 適合 | 確認事項なし | 静寂の中に見つかる新しい視点。 |
| `palette-pair-intellectimagination-low-and-extraversion-high-1` | 賑やかな明るい黄色 | <span role="img" aria-label="primary color #D88A45" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D88A45;"></span> <code>#D88A45</code><br><span role="img" aria-label="secondary color #D56F67" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D56F67;"></span> <code>#D56F67</code><br><span role="img" aria-label="accent color #459B98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#459B98;"></span> <code>#459B98</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FCF6F0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF6F0;"></span> <code>#FCF6F0</code><br><span role="img" aria-label="surface color #FDF8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDF8F7;"></span> <code>#FDF8F7</code><br><span role="img" aria-label="accent color #265554" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#265554;"></span> <code>#265554</code><br><span role="img" aria-label="chart color #774C26" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#774C26;"></span> <code>#774C26</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.468 / 14.739 / 7.947 / 6.879 | 適合 | 確認事項なし | 身近な話題を囲む温かな活気。 |
| `palette-pair-intellectimagination-low-and-extraversion-high-2` | 親しみやすいアプリコット | <span role="img" aria-label="primary color #D56F67" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D56F67;"></span> <code>#D56F67</code><br><span role="img" aria-label="secondary color #459B98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#459B98;"></span> <code>#459B98</code><br><span role="img" aria-label="accent color #D88A45" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D88A45;"></span> <code>#D88A45</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FCF3F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF3F3;"></span> <code>#FCF3F3</code><br><span role="img" aria-label="surface color #F6FAFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6FAFA;"></span> <code>#F6FAFA</code><br><span role="img" aria-label="accent color #774C26" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#774C26;"></span> <code>#774C26</code><br><span role="img" aria-label="chart color #753D39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#753D39;"></span> <code>#753D39</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.227 / 14.759 / 7.018 / 7.754 | 適合 | 確認事項なし | 人と人の距離を縮める明るい色。 |
| `palette-pair-intellectimagination-low-and-extraversion-high-3` | 活気ある明るい緑 | <span role="img" aria-label="primary color #459B98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#459B98;"></span> <code>#459B98</code><br><span role="img" aria-label="secondary color #D88A45" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D88A45;"></span> <code>#D88A45</code><br><span role="img" aria-label="accent color #D56F67" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D56F67;"></span> <code>#D56F67</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F7F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F7F7;"></span> <code>#F0F7F7</code><br><span role="img" aria-label="surface color #FDF9F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDF9F6;"></span> <code>#FDF9F6</code><br><span role="img" aria-label="accent color #753D39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#753D39;"></span> <code>#753D39</code><br><span role="img" aria-label="chart color #265554" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#265554;"></span> <code>#265554</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.300 / 14.821 / 8.078 / 7.711 | 適合 | 確認事項なし | にぎわいの中を軽快に行き交う印象。 |
| `palette-pair-intellectimagination-low-and-extraversion-low-1` | 午後の静けさを映すグレー | <span role="img" aria-label="primary color #7E8589" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7E8589;"></span> <code>#7E8589</code><br><span role="img" aria-label="secondary color #667C8B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#667C8B;"></span> <code>#667C8B</code><br><span role="img" aria-label="accent color #8C7562" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C7562;"></span> <code>#8C7562</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F5F6;"></span> <code>#F5F5F6</code><br><span role="img" aria-label="surface color #F7F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F8F9;"></span> <code>#F7F8F9</code><br><span role="img" aria-label="accent color #4D4036" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D4036;"></span> <code>#4D4036</code><br><span role="img" aria-label="chart color #45494B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45494B;"></span> <code>#45494B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.242 / 14.594 / 9.395 / 8.352 | 適合 | 確認事項なし | 静かな室内と外の景色の境界。 |
| `palette-pair-intellectimagination-low-and-extraversion-low-2` | 穏やかな窓辺の薄青 | <span role="img" aria-label="primary color #667C8B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#667C8B;"></span> <code>#667C8B</code><br><span role="img" aria-label="secondary color #8C7562" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C7562;"></span> <code>#8C7562</code><br><span role="img" aria-label="accent color #7E8589" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7E8589;"></span> <code>#7E8589</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F5F6;"></span> <code>#F3F5F6</code><br><span role="img" aria-label="surface color #F9F8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F8F7;"></span> <code>#F9F8F7</code><br><span role="img" aria-label="accent color #45494B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45494B;"></span> <code>#45494B</code><br><span role="img" aria-label="chart color #38444C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#38444C;"></span> <code>#38444C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.190 / 14.630 / 8.579 / 9.147 | 適合 | 確認事項なし | 慣れた場所に留まる落ち着き。 |
| `palette-pair-intellectimagination-low-and-extraversion-low-3` | 静かな時間の色である淡いグレー | <span role="img" aria-label="primary color #8C7562" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C7562;"></span> <code>#8C7562</code><br><span role="img" aria-label="secondary color #7E8589" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7E8589;"></span> <code>#7E8589</code><br><span role="img" aria-label="accent color #667C8B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#667C8B;"></span> <code>#667C8B</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F4F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F2;"></span> <code>#F6F4F2</code><br><span role="img" aria-label="surface color #F9F9F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F9F9;"></span> <code>#F9F9F9</code><br><span role="img" aria-label="accent color #38444C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#38444C;"></span> <code>#38444C</code><br><span role="img" aria-label="chart color #4D4036" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D4036;"></span> <code>#4D4036</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.144 / 14.739 / 9.501 / 9.105 | 適合 | 確認事項なし | 身近で具体的な環境を象徴する色。 |
| `palette-pair-intellectimagination-high-and-agreeableness-high-1` | 共鳴し合う淡いピンク | <span role="img" aria-label="primary color #B87C96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B87C96;"></span> <code>#B87C96</code><br><span role="img" aria-label="secondary color #77659A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#77659A;"></span> <code>#77659A</code><br><span role="img" aria-label="accent color #74A9A4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#74A9A4;"></span> <code>#74A9A4</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9F5F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F5F7;"></span> <code>#F9F5F7</code><br><span role="img" aria-label="surface color #F8F7FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7FA;"></span> <code>#F8F7FA</code><br><span role="img" aria-label="accent color #405D5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#405D5A;"></span> <code>#405D5A</code><br><span role="img" aria-label="chart color #654453" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#654453;"></span> <code>#654453</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.359 / 14.539 / 6.712 / 7.757 | 適合 | 確認事項なし | 相手の考えに響き合う柔らかな色。 |
| `palette-pair-intellectimagination-high-and-agreeableness-high-2` | 包み込むような深い紫 | <span role="img" aria-label="primary color #77659A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#77659A;"></span> <code>#77659A</code><br><span role="img" aria-label="secondary color #74A9A4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#74A9A4;"></span> <code>#74A9A4</code><br><span role="img" aria-label="accent color #B87C96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B87C96;"></span> <code>#B87C96</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F3F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F3F7;"></span> <code>#F4F3F7</code><br><span role="img" aria-label="surface color #F8FBFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8FBFA;"></span> <code>#F8FBFA</code><br><span role="img" aria-label="accent color #654453" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#654453;"></span> <code>#654453</code><br><span role="img" aria-label="chart color #413855" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#413855;"></span> <code>#413855</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.047 / 14.905 / 8.052 / 9.893 | 適合 | 確認事項なし | 多様な視点をつなぐ紫。 |
| `palette-pair-intellectimagination-high-and-agreeableness-high-3` | 調和を促すソフトブルー | <span role="img" aria-label="primary color #74A9A4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#74A9A4;"></span> <code>#74A9A4</code><br><span role="img" aria-label="secondary color #B87C96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B87C96;"></span> <code>#B87C96</code><br><span role="img" aria-label="accent color #77659A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#77659A;"></span> <code>#77659A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F8F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F8F8;"></span> <code>#F4F8F8</code><br><span role="img" aria-label="surface color #FBF8FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF8FA;"></span> <code>#FBF8FA</code><br><span role="img" aria-label="accent color #413855" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#413855;"></span> <code>#413855</code><br><span role="img" aria-label="chart color #405D5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#405D5A;"></span> <code>#405D5A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.505 / 14.712 / 10.361 / 6.696 | 適合 | 確認事項なし | 理解と共感が広がる青緑。 |
| `palette-pair-intellectimagination-high-and-agreeableness-low-1` | 強い意志を宿す深い青 | <span role="img" aria-label="primary color #315E87" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#315E87;"></span> <code>#315E87</code><br><span role="img" aria-label="secondary color #694C91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#694C91;"></span> <code>#694C91</code><br><span role="img" aria-label="accent color #C46F3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C46F3F;"></span> <code>#C46F3F</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EFF2F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EFF2F5;"></span> <code>#EFF2F5</code><br><span role="img" aria-label="surface color #F8F6FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F6FA;"></span> <code>#F8F6FA</code><br><span role="img" aria-label="accent color #6C3D23" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C3D23;"></span> <code>#6C3D23</code><br><span role="img" aria-label="chart color #1B344A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1B344A;"></span> <code>#1B344A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.810 / 14.449 / 8.394 / 11.419 | 適合 | 確認事項なし | 未知へ踏み出す独立した視線。 |
| `palette-pair-intellectimagination-high-and-agreeableness-low-2` | 未踏の地を拓く深い紫 | <span role="img" aria-label="primary color #694C91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#694C91;"></span> <code>#694C91</code><br><span role="img" aria-label="secondary color #C46F3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C46F3F;"></span> <code>#C46F3F</code><br><span role="img" aria-label="accent color #315E87" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#315E87;"></span> <code>#315E87</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F1F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F1F6;"></span> <code>#F3F1F6</code><br><span role="img" aria-label="surface color #FCF8F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF8F5;"></span> <code>#FCF8F5</code><br><span role="img" aria-label="accent color #1B344A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1B344A;"></span> <code>#1B344A</code><br><span role="img" aria-label="chart color #3A2A50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A2A50;"></span> <code>#3A2A50</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.836 / 14.693 / 12.149 / 11.509 | 適合 | 確認事項なし | 既存の枠から離れる発想を象徴。 |
| `palette-pair-intellectimagination-high-and-agreeableness-low-3` | 鋭い理性を照らすオレンジ | <span role="img" aria-label="primary color #C46F3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C46F3F;"></span> <code>#C46F3F</code><br><span role="img" aria-label="secondary color #315E87" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#315E87;"></span> <code>#315E87</code><br><span role="img" aria-label="accent color #694C91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#694C91;"></span> <code>#694C91</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAF3F0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF3F0;"></span> <code>#FAF3F0</code><br><span role="img" aria-label="surface color #F5F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F7F9;"></span> <code>#F5F7F9</code><br><span role="img" aria-label="accent color #3A2A50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A2A50;"></span> <code>#3A2A50</code><br><span role="img" aria-label="chart color #6C3D23" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C3D23;"></span> <code>#6C3D23</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.146 / 14.450 / 12.019 / 8.218 | 適合 | 確認事項なし | 自分の道を切り開く力強い差し色。 |
| `palette-pair-intellectimagination-low-and-agreeableness-high-1` | 温かなサンドベージュ | <span role="img" aria-label="primary color #C3AD91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C3AD91;"></span> <code>#C3AD91</code><br><span role="img" aria-label="secondary color #8FA487" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8FA487;"></span> <code>#8FA487</code><br><span role="img" aria-label="accent color #C88F8B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C88F8B;"></span> <code>#C88F8B</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAF8F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF8F6;"></span> <code>#FAF8F6</code><br><span role="img" aria-label="surface color #F9FAF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FAF9;"></span> <code>#F9FAF9</code><br><span role="img" aria-label="accent color #6E4F4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E4F4C;"></span> <code>#6E4F4C</code><br><span role="img" aria-label="chart color #6B5F50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B5F50;"></span> <code>#6B5F50</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.648 / 14.831 / 6.955 / 5.868 | 適合 | 確認事項なし | 身近な経験を分かち合う温かさ。 |
| `palette-pair-intellectimagination-low-and-agreeableness-high-2` | 安らぎを分かつセージグリーン | <span role="img" aria-label="primary color #8FA487" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8FA487;"></span> <code>#8FA487</code><br><span role="img" aria-label="secondary color #C88F8B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C88F8B;"></span> <code>#C88F8B</code><br><span role="img" aria-label="accent color #C3AD91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C3AD91;"></span> <code>#C3AD91</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F8F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F8F5;"></span> <code>#F6F8F5</code><br><span role="img" aria-label="surface color #FCF9F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF9F9;"></span> <code>#FCF9F9</code><br><span role="img" aria-label="accent color #6B5F50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B5F50;"></span> <code>#6B5F50</code><br><span role="img" aria-label="chart color #4F5A4A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F5A4A;"></span> <code>#4F5A4A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.531 / 14.821 / 5.938 / 6.795 | 適合 | 確認事項なし | 実際的な支え合いを象徴する緑。 |
| `palette-pair-intellectimagination-low-and-agreeableness-high-3` | 穏やかなピーチピンク | <span role="img" aria-label="primary color #C88F8B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C88F8B;"></span> <code>#C88F8B</code><br><span role="img" aria-label="secondary color #C3AD91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C3AD91;"></span> <code>#C3AD91</code><br><span role="img" aria-label="accent color #8FA487" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8FA487;"></span> <code>#8FA487</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FBF6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF6F6;"></span> <code>#FBF6F6</code><br><span role="img" aria-label="surface color #FCFBFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCFBFA;"></span> <code>#FCFBFA</code><br><span role="img" aria-label="accent color #4F5A4A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F5A4A;"></span> <code>#4F5A4A</code><br><span role="img" aria-label="chart color #6E4F4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E4F4C;"></span> <code>#6E4F4C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.494 / 15.014 / 7.021 / 6.797 | 適合 | 確認事項なし | 同じ場を囲む親しみの色。 |
| `palette-pair-intellectimagination-low-and-agreeableness-low-1` | 断定的なオーカー | <span role="img" aria-label="primary color #B27F3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B27F3F;"></span> <code>#B27F3F</code><br><span role="img" aria-label="secondary color #45566E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45566E;"></span> <code>#45566E</code><br><span role="img" aria-label="accent color #747A78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#747A78;"></span> <code>#747A78</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9F5F0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F5F0;"></span> <code>#F9F5F0</code><br><span role="img" aria-label="surface color #F6F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F8;"></span> <code>#F6F7F8</code><br><span role="img" aria-label="accent color #404342" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#404342;"></span> <code>#404342</code><br><span role="img" aria-label="chart color #624623" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#624623;"></span> <code>#624623</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.296 / 14.467 / 9.325 / 7.996 | 適合 | 確認事項なし | 具体的な基準を示す明確な色。 |
| `palette-pair-intellectimagination-low-and-agreeableness-low-2` | 明確な視界の深い青 | <span role="img" aria-label="primary color #45566E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45566E;"></span> <code>#45566E</code><br><span role="img" aria-label="secondary color #747A78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#747A78;"></span> <code>#747A78</code><br><span role="img" aria-label="accent color #B27F3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B27F3F;"></span> <code>#B27F3F</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F1F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F1F3;"></span> <code>#F0F1F3</code><br><span role="img" aria-label="surface color #F8F8F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F8F8;"></span> <code>#F8F8F8</code><br><span role="img" aria-label="accent color #624623" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#624623;"></span> <code>#624623</code><br><span role="img" aria-label="chart color #262F3D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#262F3D;"></span> <code>#262F3D</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.731 / 14.612 / 8.172 / 11.939 | 適合 | 確認事項なし | 自分の判断を落ち着いて掲げる青。 |
| `palette-pair-intellectimagination-low-and-agreeableness-low-3` | 揺るぎないスレートグレー | <span role="img" aria-label="primary color #747A78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#747A78;"></span> <code>#747A78</code><br><span role="img" aria-label="secondary color #B27F3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B27F3F;"></span> <code>#B27F3F</code><br><span role="img" aria-label="accent color #45566E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45566E;"></span> <code>#45566E</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F4F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F4F4;"></span> <code>#F4F4F4</code><br><span role="img" aria-label="surface color #FBF9F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF9F5;"></span> <code>#FBF9F5</code><br><span role="img" aria-label="accent color #262F3D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#262F3D;"></span> <code>#262F3D</code><br><span role="img" aria-label="chart color #404342" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#404342;"></span> <code>#404342</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.109 / 14.757 / 12.831 / 9.094 | 適合 | 確認事項なし | 事実に基づく硬質な印象。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-high-1` | 凪いだ空のライトブルー | <span role="img" aria-label="primary color #6A96B3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6A96B3;"></span> <code>#6A96B3</code><br><span role="img" aria-label="secondary color #4E6188" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E6188;"></span> <code>#4E6188</code><br><span role="img" aria-label="accent color #78A99E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#78A99E;"></span> <code>#78A99E</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F7F9;"></span> <code>#F3F7F9</code><br><span role="img" aria-label="surface color #F6F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F9;"></span> <code>#F6F7F9</code><br><span role="img" aria-label="accent color #425D57" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#425D57;"></span> <code>#425D57</code><br><span role="img" aria-label="chart color #3A5362" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A5362;"></span> <code>#3A5362</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.397 / 14.476 / 6.675 / 7.512 | 適合 | 確認事項なし | 広い視野と静かな安定を表す青。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-high-2` | 静観する深い紺色 | <span role="img" aria-label="primary color #4E6188" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E6188;"></span> <code>#4E6188</code><br><span role="img" aria-label="secondary color #78A99E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#78A99E;"></span> <code>#78A99E</code><br><span role="img" aria-label="accent color #6A96B3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6A96B3;"></span> <code>#6A96B3</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F1F2F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F1F2F5;"></span> <code>#F1F2F5</code><br><span role="img" aria-label="surface color #F8FBFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8FBFA;"></span> <code>#F8FBFA</code><br><span role="img" aria-label="accent color #3A5362" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A5362;"></span> <code>#3A5362</code><br><span role="img" aria-label="chart color #2B354B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B354B;"></span> <code>#2B354B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.862 / 14.905 / 7.777 / 10.948 | 適合 | 確認事項なし | 遠くまで考えを伸ばす深い色。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-high-3` | 澄み切ったミントグリーン | <span role="img" aria-label="primary color #78A99E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#78A99E;"></span> <code>#78A99E</code><br><span role="img" aria-label="secondary color #6A96B3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6A96B3;"></span> <code>#6A96B3</code><br><span role="img" aria-label="accent color #4E6188" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E6188;"></span> <code>#4E6188</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F8F7;"></span> <code>#F4F8F7</code><br><span role="img" aria-label="surface color #F8FAFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8FAFB;"></span> <code>#F8FAFB</code><br><span role="img" aria-label="accent color #2B354B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B354B;"></span> <code>#2B354B</code><br><span role="img" aria-label="chart color #425D57" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#425D57;"></span> <code>#425D57</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.496 / 14.822 / 11.706 / 6.684 | 適合 | 確認事項なし | 落ち着いた広がりを象徴する青緑。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-low-1` | 震える心の色である淡い紫 | <span role="img" aria-label="primary color #9C83B3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9C83B3;"></span> <code>#9C83B3</code><br><span role="img" aria-label="secondary color #5B9FB0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5B9FB0;"></span> <code>#5B9FB0</code><br><span role="img" aria-label="accent color #C58B9C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C58B9C;"></span> <code>#C58B9C</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F7F5F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F5F9;"></span> <code>#F7F5F9</code><br><span role="img" aria-label="surface color #F7FAFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7FAFB;"></span> <code>#F7FAFB</code><br><span role="img" aria-label="accent color #6C4C56" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C4C56;"></span> <code>#6C4C56</code><br><span role="img" aria-label="chart color #564862" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#564862;"></span> <code>#564862</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.323 / 14.795 / 7.136 / 7.757 | 適合 | 確認事項なし | 細やかな気配へ反応する紫。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-low-2` | 瑞々しい朝の緑 | <span role="img" aria-label="primary color #5B9FB0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5B9FB0;"></span> <code>#5B9FB0</code><br><span role="img" aria-label="secondary color #C58B9C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C58B9C;"></span> <code>#C58B9C</code><br><span role="img" aria-label="accent color #9C83B3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9C83B3;"></span> <code>#9C83B3</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F2F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F2F7F9;"></span> <code>#F2F7F9</code><br><span role="img" aria-label="surface color #FCF9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF9FA;"></span> <code>#FCF9FA</code><br><span role="img" aria-label="accent color #564862" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#564862;"></span> <code>#564862</code><br><span role="img" aria-label="chart color #325761" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#325761;"></span> <code>#325761</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.371 / 14.830 / 8.031 / 7.280 | 適合 | 確認事項なし | 新しい方向へ視線を動かす青。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-low-3` | 繊細な光のローズピンク | <span role="img" aria-label="primary color #C58B9C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C58B9C;"></span> <code>#C58B9C</code><br><span role="img" aria-label="secondary color #9C83B3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9C83B3;"></span> <code>#9C83B3</code><br><span role="img" aria-label="accent color #5B9FB0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5B9FB0;"></span> <code>#5B9FB0</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAF6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF6F7;"></span> <code>#FAF6F7</code><br><span role="img" aria-label="surface color #FAF9FB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF9FB;"></span> <code>#FAF9FB</code><br><span role="img" aria-label="accent color #325761" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#325761;"></span> <code>#325761</code><br><span role="img" aria-label="chart color #6C4C56" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C4C56;"></span> <code>#6C4C56</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.476 / 14.785 / 7.489 / 6.982 | 適合 | 確認事項なし | 感受性と好奇心が重なる柔らかな色。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-high-1` | 暖かな陽だまりの黄色 | <span role="img" aria-label="primary color #D0B58D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D0B58D;"></span> <code>#D0B58D</code><br><span role="img" aria-label="secondary color #92A083" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#92A083;"></span> <code>#92A083</code><br><span role="img" aria-label="accent color #B99A5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B99A5A;"></span> <code>#B99A5A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FBF9F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF9F6;"></span> <code>#FBF9F6</code><br><span role="img" aria-label="surface color #FAFAF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAFAF9;"></span> <code>#FAFAF9</code><br><span role="img" aria-label="accent color #665532" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665532;"></span> <code>#665532</code><br><span role="img" aria-label="chart color #72644E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#72644E;"></span> <code>#72644E</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.766 / 14.858 / 6.909 / 5.477 | 適合 | 確認事項なし | 穏やかで具体的な安心感。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-high-2` | 穏やかな午後のセージグリーン | <span role="img" aria-label="primary color #92A083" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#92A083;"></span> <code>#92A083</code><br><span role="img" aria-label="secondary color #B99A5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B99A5A;"></span> <code>#B99A5A</code><br><span role="img" aria-label="accent color #D0B58D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D0B58D;"></span> <code>#D0B58D</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F7F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F5;"></span> <code>#F6F7F5</code><br><span role="img" aria-label="surface color #FCFAF7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCFAF7;"></span> <code>#FCFAF7</code><br><span role="img" aria-label="accent color #72644E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#72644E;"></span> <code>#72644E</code><br><span role="img" aria-label="chart color #505848" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#505848;"></span> <code>#505848</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.440 / 14.894 / 5.525 / 6.904 | 適合 | 確認事項なし | 身近な現実を落ち着いて眺める緑。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-high-3` | 安静な庭のオーカー | <span role="img" aria-label="primary color #B99A5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B99A5A;"></span> <code>#B99A5A</code><br><span role="img" aria-label="secondary color #D0B58D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D0B58D;"></span> <code>#D0B58D</code><br><span role="img" aria-label="accent color #92A083" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#92A083;"></span> <code>#92A083</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9F7F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F2;"></span> <code>#F9F7F2</code><br><span role="img" aria-label="surface color #FDFBF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDFBF9;"></span> <code>#FDFBF9</code><br><span role="img" aria-label="accent color #505848" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#505848;"></span> <code>#505848</code><br><span role="img" aria-label="chart color #665532" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665532;"></span> <code>#665532</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.494 / 15.032 / 7.187 / 6.739 | 適合 | 確認事項なし | 変化を急がず時間を重ねる色。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-low-1` | しっとりとした雨のグレー | <span role="img" aria-label="primary color #708EA3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#708EA3;"></span> <code>#708EA3</code><br><span role="img" aria-label="secondary color #7E858A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7E858A;"></span> <code>#7E858A</code><br><span role="img" aria-label="accent color #748C78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#748C78;"></span> <code>#748C78</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F6F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F6F8;"></span> <code>#F4F6F8</code><br><span role="img" aria-label="surface color #F9F9F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F9F9;"></span> <code>#F9F9F9</code><br><span role="img" aria-label="accent color #404D42" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#404D42;"></span> <code>#404D42</code><br><span role="img" aria-label="chart color #3E4E5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3E4E5A;"></span> <code>#3E4E5A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.324 / 14.739 / 8.458 / 7.937 | 適合 | 確認事項なし | 小さな変化に気づく静かな青。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-low-2` | 濡れた葉の深い緑 | <span role="img" aria-label="primary color #7E858A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7E858A;"></span> <code>#7E858A</code><br><span role="img" aria-label="secondary color #748C78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#748C78;"></span> <code>#748C78</code><br><span role="img" aria-label="accent color #708EA3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#708EA3;"></span> <code>#708EA3</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F5F6;"></span> <code>#F5F5F6</code><br><span role="img" aria-label="surface color #F8F9F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9F8;"></span> <code>#F8F9F8</code><br><span role="img" aria-label="accent color #3E4E5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3E4E5A;"></span> <code>#3E4E5A</code><br><span role="img" aria-label="chart color #45494C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45494C;"></span> <code>#45494C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.242 / 14.703 / 8.147 / 8.342 | 適合 | 確認事項なし | 足元を確かめながら進む色。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-low-3` | 憂いを帯びた淡いブルー | <span role="img" aria-label="primary color #748C78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#748C78;"></span> <code>#748C78</code><br><span role="img" aria-label="secondary color #708EA3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#708EA3;"></span> <code>#708EA3</code><br><span role="img" aria-label="accent color #7E858A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7E858A;"></span> <code>#7E858A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F6F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F6F4;"></span> <code>#F4F6F4</code><br><span role="img" aria-label="surface color #F8F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9FA;"></span> <code>#F8F9FA</code><br><span role="img" aria-label="accent color #45494C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45494C;"></span> <code>#45494C</code><br><span role="img" aria-label="chart color #404D42" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#404D42;"></span> <code>#404D42</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.288 / 14.721 / 8.623 / 8.199 | 適合 | 確認事項なし | 身近な環境の変化を象徴する緑。 |
| `palette-pair-conscientiousness-high-and-extraversion-high-1` | 効率的な深い青 | <span role="img" aria-label="primary color #3F5B77" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5B77;"></span> <code>#3F5B77</code><br><span role="img" aria-label="secondary color #DD8444" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DD8444;"></span> <code>#DD8444</code><br><span role="img" aria-label="accent color #B9964D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B9964D;"></span> <code>#B9964D</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F2F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F2F4;"></span> <code>#F0F2F4</code><br><span role="img" aria-label="surface color #FDF9F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDF9F6;"></span> <code>#FDF9F6</code><br><span role="img" aria-label="accent color #66532A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#66532A;"></span> <code>#66532A</code><br><span role="img" aria-label="chart color #233241" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#233241;"></span> <code>#233241</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.827 / 14.821 / 7.073 / 11.666 | 適合 | 確認事項なし | 予定と役割を明確にする青。 |
| `palette-pair-conscientiousness-high-and-extraversion-high-2` | 社交的な明るいオレンジ | <span role="img" aria-label="primary color #DD8444" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DD8444;"></span> <code>#DD8444</code><br><span role="img" aria-label="secondary color #B9964D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B9964D;"></span> <code>#B9964D</code><br><span role="img" aria-label="accent color #3F5B77" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5B77;"></span> <code>#3F5B77</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FCF5F0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF5F0;"></span> <code>#FCF5F0</code><br><span role="img" aria-label="surface color #FCFAF6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCFAF6;"></span> <code>#FCFAF6</code><br><span role="img" aria-label="accent color #233241" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#233241;"></span> <code>#233241</code><br><span role="img" aria-label="chart color #7A4925" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7A4925;"></span> <code>#7A4925</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.378 / 14.885 / 12.558 / 6.931 | 適合 | 確認事項なし | 人の輪へ働きかける明るさ。 |
| `palette-pair-conscientiousness-high-and-extraversion-high-3` | 整理された白 | <span role="img" aria-label="primary color #B9964D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B9964D;"></span> <code>#B9964D</code><br><span role="img" aria-label="secondary color #3F5B77" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5B77;"></span> <code>#3F5B77</code><br><span role="img" aria-label="accent color #DD8444" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DD8444;"></span> <code>#DD8444</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9F7F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F1;"></span> <code>#F9F7F1</code><br><span role="img" aria-label="surface color #F5F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F7F8;"></span> <code>#F5F7F8</code><br><span role="img" aria-label="accent color #7A4925" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7A4925;"></span> <code>#7A4925</code><br><span role="img" aria-label="chart color #66532A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#66532A;"></span> <code>#66532A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.485 / 14.441 / 6.961 / 6.913 | 適合 | 確認事項なし | 時間を意識して動く印象。 |
| `palette-pair-conscientiousness-high-and-extraversion-low-1` | 集中を高める温かな琥珀色 | <span role="img" aria-label="primary color #B47B3E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B47B3E;"></span> <code>#B47B3E</code><br><span role="img" aria-label="secondary color #45556C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45556C;"></span> <code>#45556C</code><br><span role="img" aria-label="accent color #8B8983" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8983;"></span> <code>#8B8983</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9F4F0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F4F0;"></span> <code>#F9F4F0</code><br><span role="img" aria-label="surface color #F6F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F8;"></span> <code>#F6F7F8</code><br><span role="img" aria-label="accent color #4C4B48" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C4B48;"></span> <code>#4C4B48</code><br><span role="img" aria-label="chart color #634422" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#634422;"></span> <code>#634422</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.207 / 14.467 / 8.133 / 8.077 | 適合 | 確認事項なし | 静かな机上を照らす灯りの色。 |
| `palette-pair-conscientiousness-high-and-extraversion-low-2` | 灯火を見守る深い青 | <span role="img" aria-label="primary color #45556C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45556C;"></span> <code>#45556C</code><br><span role="img" aria-label="secondary color #8B8983" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8983;"></span> <code>#8B8983</code><br><span role="img" aria-label="accent color #B47B3E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B47B3E;"></span> <code>#B47B3E</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F1F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F1F3;"></span> <code>#F0F1F3</code><br><span role="img" aria-label="surface color #F9F9F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F9F9;"></span> <code>#F9F9F9</code><br><span role="img" aria-label="accent color #634422" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#634422;"></span> <code>#634422</code><br><span role="img" aria-label="chart color #262F3B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#262F3B;"></span> <code>#262F3B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.731 / 14.739 / 8.379 / 11.971 | 適合 | 確認事項なし | 丁寧な作業と集中を象徴する青。 |
| `palette-pair-conscientiousness-high-and-extraversion-low-3` | 紙のような淡いアイボリー | <span role="img" aria-label="primary color #8B8983" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8983;"></span> <code>#8B8983</code><br><span role="img" aria-label="secondary color #B47B3E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B47B3E;"></span> <code>#B47B3E</code><br><span role="img" aria-label="accent color #45556C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45556C;"></span> <code>#45556C</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F6F5;"></span> <code>#F6F6F5</code><br><span role="img" aria-label="surface color #FBF8F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF8F5;"></span> <code>#FBF8F5</code><br><span role="img" aria-label="accent color #262F3B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#262F3B;"></span> <code>#262F3B</code><br><span role="img" aria-label="chart color #4C4B48" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C4B48;"></span> <code>#4C4B48</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.350 / 14.666 / 12.787 / 8.067 | 適合 | 確認事項なし | 積み重なる記録の落ち着いた色。 |
| `palette-pair-conscientiousness-low-and-extraversion-high-1` | 軽やかなコーラルピンク | <span role="img" aria-label="primary color #D97666" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D97666;"></span> <code>#D97666</code><br><span role="img" aria-label="secondary color #8DA65E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8DA65E;"></span> <code>#8DA65E</code><br><span role="img" aria-label="accent color #75A2B4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#75A2B4;"></span> <code>#75A2B4</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FCF4F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF4F3;"></span> <code>#FCF4F3</code><br><span role="img" aria-label="surface color #F9FBF7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FBF7;"></span> <code>#F9FBF7</code><br><span role="img" aria-label="accent color #405963" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#405963;"></span> <code>#405963</code><br><span role="img" aria-label="chart color #774138" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#774138;"></span> <code>#774138</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.316 / 14.904 / 7.134 / 7.458 | 適合 | 確認事項なし | 予定外の出会いを楽しむ温かさ。 |
| `palette-pair-conscientiousness-low-and-extraversion-high-2` | 偶然を象徴する明るい若葉色 | <span role="img" aria-label="primary color #8DA65E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8DA65E;"></span> <code>#8DA65E</code><br><span role="img" aria-label="secondary color #75A2B4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#75A2B4;"></span> <code>#75A2B4</code><br><span role="img" aria-label="accent color #D97666" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D97666;"></span> <code>#D97666</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F8F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F8F2;"></span> <code>#F6F8F2</code><br><span role="img" aria-label="surface color #F8FAFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8FAFB;"></span> <code>#F8FAFB</code><br><span role="img" aria-label="accent color #774138" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#774138;"></span> <code>#774138</code><br><span role="img" aria-label="chart color #4E5B34" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E5B34;"></span> <code>#4E5B34</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.504 / 14.822 / 7.722 / 6.839 | 適合 | 確認事項なし | 寄り道と柔軟な動きを表す緑。 |
| `palette-pair-conscientiousness-low-and-extraversion-high-3` | 自由な空の青 | <span role="img" aria-label="primary color #75A2B4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#75A2B4;"></span> <code>#75A2B4</code><br><span role="img" aria-label="secondary color #D97666" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D97666;"></span> <code>#D97666</code><br><span role="img" aria-label="accent color #8DA65E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8DA65E;"></span> <code>#8DA65E</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F8F9;"></span> <code>#F4F8F9</code><br><span role="img" aria-label="surface color #FDF8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDF8F7;"></span> <code>#FDF8F7</code><br><span role="img" aria-label="accent color #4E5B34" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E5B34;"></span> <code>#4E5B34</code><br><span role="img" aria-label="chart color #405963" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#405963;"></span> <code>#405963</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.514 / 14.739 / 6.950 / 6.948 | 適合 | 確認事項なし | 人の流れへ軽やかに合流する青。 |
| `palette-pair-conscientiousness-low-and-extraversion-low-1` | 贅沢な余白の白 | <span role="img" aria-label="primary color #D7D0C2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D7D0C2;"></span> <code>#D7D0C2</code><br><span role="img" aria-label="secondary color #9BAA91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9BAA91;"></span> <code>#9BAA91</code><br><span role="img" aria-label="accent color #91A5AF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#91A5AF;"></span> <code>#91A5AF</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FCFBFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCFBFA;"></span> <code>#FCFBFA</code><br><span role="img" aria-label="surface color #FAFBFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAFBFA;"></span> <code>#FAFBFA</code><br><span role="img" aria-label="accent color #505B60" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#505B60;"></span> <code>#505B60</code><br><span role="img" aria-label="chart color #76726B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#76726B;"></span> <code>#76726B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 15.014 / 14.959 / 6.734 / 4.629 | 適合 | 確認事項なし | 空白をそのまま楽しむ穏やかな色。 |
| `palette-pair-conscientiousness-low-and-extraversion-low-2` | 穏やかな散策のライトグリーン | <span role="img" aria-label="primary color #9BAA91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9BAA91;"></span> <code>#9BAA91</code><br><span role="img" aria-label="secondary color #91A5AF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#91A5AF;"></span> <code>#91A5AF</code><br><span role="img" aria-label="accent color #D7D0C2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D7D0C2;"></span> <code>#D7D0C2</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F7F8F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F8F6;"></span> <code>#F7F8F6</code><br><span role="img" aria-label="surface color #FAFBFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAFBFB;"></span> <code>#FAFBFB</code><br><span role="img" aria-label="accent color #76726B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#76726B;"></span> <code>#76726B</code><br><span role="img" aria-label="chart color #555E50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#555E50;"></span> <code>#555E50</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.566 / 14.968 / 4.615 / 6.352 | 適合 | 確認事項なし | 静かな自分のペースを表す緑。 |
| `palette-pair-conscientiousness-low-and-extraversion-low-3` | 心を解き放つ淡い水色 | <span role="img" aria-label="primary color #91A5AF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#91A5AF;"></span> <code>#91A5AF</code><br><span role="img" aria-label="secondary color #D7D0C2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D7D0C2;"></span> <code>#D7D0C2</code><br><span role="img" aria-label="accent color #9BAA91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9BAA91;"></span> <code>#9BAA91</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F8F9;"></span> <code>#F6F8F9</code><br><span role="img" aria-label="surface color #FDFDFC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDFDFC;"></span> <code>#FDFDFC</code><br><span role="img" aria-label="accent color #555E50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#555E50;"></span> <code>#555E50</code><br><span role="img" aria-label="chart color #505B60" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#505B60;"></span> <code>#505B60</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.567 / 15.246 / 6.649 / 6.557 | 適合 | 確認事項なし | 急がず漂う時間を象徴する青灰。 |
| `palette-pair-conscientiousness-high-and-agreeableness-high-1` | 調和を司るミントグリーン | <span role="img" aria-label="primary color #829A7D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#829A7D;"></span> <code>#829A7D</code><br><span role="img" aria-label="secondary color #657F96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#657F96;"></span> <code>#657F96</code><br><span role="img" aria-label="accent color #C38A88" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C38A88;"></span> <code>#C38A88</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F7F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F7F5;"></span> <code>#F5F7F5</code><br><span role="img" aria-label="surface color #F7F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F9FA;"></span> <code>#F7F9FA</code><br><span role="img" aria-label="accent color #6B4C4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B4C4B;"></span> <code>#6B4C4B</code><br><span role="img" aria-label="chart color #485545" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#485545;"></span> <code>#485545</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.413 / 14.694 / 7.204 / 7.330 | 適合 | 確認事項なし | 周囲を整える穏やかな緑。 |
| `palette-pair-conscientiousness-high-and-agreeableness-high-2` | 責任感ある深い紺 | <span role="img" aria-label="primary color #657F96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#657F96;"></span> <code>#657F96</code><br><span role="img" aria-label="secondary color #C38A88" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C38A88;"></span> <code>#C38A88</code><br><span role="img" aria-label="accent color #829A7D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#829A7D;"></span> <code>#829A7D</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F5F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F5F7;"></span> <code>#F3F5F7</code><br><span role="img" aria-label="surface color #FCF9F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF9F9;"></span> <code>#FCF9F9</code><br><span role="img" aria-label="accent color #485545" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#485545;"></span> <code>#485545</code><br><span role="img" aria-label="chart color #384653" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#384653;"></span> <code>#384653</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.199 / 14.821 / 7.538 / 8.858 | 適合 | 確認事項なし | 役割や段取りを見通しよくする青。 |
| `palette-pair-conscientiousness-high-and-agreeableness-high-3` | 準備を整えるローズベージュ | <span role="img" aria-label="primary color #C38A88" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C38A88;"></span> <code>#C38A88</code><br><span role="img" aria-label="secondary color #829A7D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#829A7D;"></span> <code>#829A7D</code><br><span role="img" aria-label="accent color #657F96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#657F96;"></span> <code>#657F96</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAF6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF6F5;"></span> <code>#FAF6F5</code><br><span role="img" aria-label="surface color #F9FAF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FAF9;"></span> <code>#F9FAF9</code><br><span role="img" aria-label="accent color #384653" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#384653;"></span> <code>#384653</code><br><span role="img" aria-label="chart color #6B4C4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B4C4B;"></span> <code>#6B4C4B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.458 / 14.831 / 9.253 / 7.088 | 適合 | 確認事項なし | 人を迎える温かさを添える色。 |
| `palette-pair-conscientiousness-high-and-agreeableness-low-1` | 厳格な境界線の黒 | <span role="img" aria-label="primary color #5F6A73" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5F6A73;"></span> <code>#5F6A73</code><br><span role="img" aria-label="secondary color #3F5268" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5268;"></span> <code>#3F5268</code><br><span role="img" aria-label="accent color #A57B42" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A57B42;"></span> <code>#A57B42</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F2F3F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F2F3F4;"></span> <code>#F2F3F4</code><br><span role="img" aria-label="surface color #F5F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F6F7;"></span> <code>#F5F6F7</code><br><span role="img" aria-label="accent color #5B4424" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5B4424;"></span> <code>#5B4424</code><br><span role="img" aria-label="chart color #343A3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#343A3F;"></span> <code>#343A3F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.967 / 14.341 / 8.449 / 10.369 | 適合 | 確認事項なし | 線引きと一貫性を表す灰青。 |
| `palette-pair-conscientiousness-high-and-agreeableness-low-2` | 理知的な冷たい青 | <span role="img" aria-label="primary color #3F5268" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5268;"></span> <code>#3F5268</code><br><span role="img" aria-label="secondary color #A57B42" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A57B42;"></span> <code>#A57B42</code><br><span role="img" aria-label="accent color #5F6A73" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5F6A73;"></span> <code>#5F6A73</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F1F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F1F3;"></span> <code>#F0F1F3</code><br><span role="img" aria-label="surface color #FBF8F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF8F6;"></span> <code>#FBF8F6</code><br><span role="img" aria-label="accent color #343A3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#343A3F;"></span> <code>#343A3F</code><br><span role="img" aria-label="chart color #232D39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#232D39;"></span> <code>#232D39</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.731 / 14.675 / 10.894 / 12.339 | 適合 | 確認事項なし | 秩序を保つ端正な青。 |
| `palette-pair-conscientiousness-high-and-agreeableness-low-3` | 秩序を示すオーカー | <span role="img" aria-label="primary color #A57B42" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A57B42;"></span> <code>#A57B42</code><br><span role="img" aria-label="secondary color #5F6A73" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5F6A73;"></span> <code>#5F6A73</code><br><span role="img" aria-label="accent color #3F5268" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5268;"></span> <code>#3F5268</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F8F4F0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F4F0;"></span> <code>#F8F4F0</code><br><span role="img" aria-label="surface color #F7F8F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F8F8;"></span> <code>#F7F8F8</code><br><span role="img" aria-label="accent color #232D39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#232D39;"></span> <code>#232D39</code><br><span role="img" aria-label="chart color #5B4424" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5B4424;"></span> <code>#5B4424</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.180 / 14.585 / 13.107 / 8.354 | 適合 | 確認事項なし | 基準を明確に示す落ち着いた黄褐色。 |
| `palette-pair-conscientiousness-low-and-agreeableness-high-1` | 温かな友情の若草色 | <span role="img" aria-label="primary color #95A982" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#95A982;"></span> <code>#95A982</code><br><span role="img" aria-label="secondary color #CF8774" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#CF8774;"></span> <code>#CF8774</code><br><span role="img" aria-label="accent color #C7B092" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C7B092;"></span> <code>#C7B092</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F7F8F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F8F5;"></span> <code>#F7F8F5</code><br><span role="img" aria-label="surface color #FDF9F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDF9F8;"></span> <code>#FDF9F8</code><br><span role="img" aria-label="accent color #6D6150" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6D6150;"></span> <code>#6D6150</code><br><span role="img" aria-label="chart color #525D48" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#525D48;"></span> <code>#525D48</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.557 / 14.840 / 5.777 / 6.527 | 適合 | 確認事項なし | 相手に合わせる柔らかな緑。 |
| `palette-pair-conscientiousness-low-and-agreeableness-high-2` | 緩やかな時間のコーラル | <span role="img" aria-label="primary color #CF8774" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#CF8774;"></span> <code>#CF8774</code><br><span role="img" aria-label="secondary color #C7B092" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C7B092;"></span> <code>#C7B092</code><br><span role="img" aria-label="accent color #95A982" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#95A982;"></span> <code>#95A982</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FBF5F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF5F4;"></span> <code>#FBF5F4</code><br><span role="img" aria-label="surface color #FCFBFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCFBFA;"></span> <code>#FCFBFA</code><br><span role="img" aria-label="accent color #525D48" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#525D48;"></span> <code>#525D48</code><br><span role="img" aria-label="chart color #724A40" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#724A40;"></span> <code>#724A40</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.387 / 15.014 / 6.732 / 7.031 | 適合 | 確認事項なし | 予定外の時間を共に楽しむ色。 |
| `palette-pair-conscientiousness-low-and-agreeableness-high-3` | 包容力ある淡いオレンジ | <span role="img" aria-label="primary color #C7B092" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C7B092;"></span> <code>#C7B092</code><br><span role="img" aria-label="secondary color #95A982" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#95A982;"></span> <code>#95A982</code><br><span role="img" aria-label="accent color #CF8774" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#CF8774;"></span> <code>#CF8774</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FBF9F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF9F6;"></span> <code>#FBF9F6</code><br><span role="img" aria-label="surface color #FAFBF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAFBF9;"></span> <code>#FAFBF9</code><br><span role="img" aria-label="accent color #724A40" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#724A40;"></span> <code>#724A40</code><br><span role="img" aria-label="chart color #6D6150" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6D6150;"></span> <code>#6D6150</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.766 / 14.950 / 7.306 / 5.749 | 適合 | 確認事項なし | 無理なく続く関わりを象徴。 |
| `palette-pair-conscientiousness-low-and-agreeableness-low-1` | 誰にも染まらないレンガ色 | <span role="img" aria-label="primary color #A8644F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A8644F;"></span> <code>#A8644F</code><br><span role="img" aria-label="secondary color #4C9690" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C9690;"></span> <code>#4C9690</code><br><span role="img" aria-label="accent color #B89E78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B89E78;"></span> <code>#B89E78</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F8F3F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F3F1;"></span> <code>#F8F3F1</code><br><span role="img" aria-label="surface color #F6FAF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6FAF9;"></span> <code>#F6FAF9</code><br><span role="img" aria-label="accent color #655742" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#655742;"></span> <code>#655742</code><br><span role="img" aria-label="chart color #5C372B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5C372B;"></span> <code>#5C372B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.100 / 14.750 / 6.664 / 9.370 | 適合 | 確認事項なし | 自分の判断で進む大地の色。 |
| `palette-pair-conscientiousness-low-and-agreeableness-low-2` | 独立した精神の深い青 | <span role="img" aria-label="primary color #4C9690" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C9690;"></span> <code>#4C9690</code><br><span role="img" aria-label="secondary color #B89E78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B89E78;"></span> <code>#B89E78</code><br><span role="img" aria-label="accent color #A8644F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A8644F;"></span> <code>#A8644F</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F1F7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F1F7F6;"></span> <code>#F1F7F6</code><br><span role="img" aria-label="surface color #FBFAF8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBFAF8;"></span> <code>#FBFAF8</code><br><span role="img" aria-label="accent color #5C372B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5C372B;"></span> <code>#5C372B</code><br><span role="img" aria-label="chart color #2A534F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2A534F;"></span> <code>#2A534F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.317 / 14.876 / 9.886 / 7.913 | 適合 | 確認事項なし | 決められた枠から離れる青緑。 |
| `palette-pair-conscientiousness-low-and-agreeableness-low-3` | 自由な風のサンドベージュ | <span role="img" aria-label="primary color #B89E78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B89E78;"></span> <code>#B89E78</code><br><span role="img" aria-label="secondary color #A8644F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A8644F;"></span> <code>#A8644F</code><br><span role="img" aria-label="accent color #4C9690" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C9690;"></span> <code>#4C9690</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9F7F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F4;"></span> <code>#F9F7F4</code><br><span role="img" aria-label="surface color #FBF7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF7F6;"></span> <code>#FBF7F6</code><br><span role="img" aria-label="accent color #2A534F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2A534F;"></span> <code>#2A534F</code><br><span role="img" aria-label="chart color #655742" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#655742;"></span> <code>#655742</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.512 / 14.584 / 8.060 / 6.556 | 適合 | 確認事項なし | 広い裁量と余白を表す色。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-high-1` | 安定した深い青 | <span role="img" aria-label="primary color #415C70" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#415C70;"></span> <code>#415C70</code><br><span role="img" aria-label="secondary color #678B9C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#678B9C;"></span> <code>#678B9C</code><br><span role="img" aria-label="accent color #80968A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#80968A;"></span> <code>#80968A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F2F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F2F4;"></span> <code>#F0F2F4</code><br><span role="img" aria-label="surface color #F7F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F9FA;"></span> <code>#F7F9FA</code><br><span role="img" aria-label="accent color #46534C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#46534C;"></span> <code>#46534C</code><br><span role="img" aria-label="chart color #24333E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#24333E;"></span> <code>#24333E</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.827 / 14.694 / 7.642 / 11.564 | 適合 | 確認事項なし | 計画と落ち着きが同居する深い青。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-high-2` | 凪いだ海の白 | <span role="img" aria-label="primary color #678B9C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#678B9C;"></span> <code>#678B9C</code><br><span role="img" aria-label="secondary color #80968A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#80968A;"></span> <code>#80968A</code><br><span role="img" aria-label="accent color #415C70" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#415C70;"></span> <code>#415C70</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F6F7;"></span> <code>#F3F6F7</code><br><span role="img" aria-label="surface color #F9FAF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FAF9;"></span> <code>#F9FAF9</code><br><span role="img" aria-label="accent color #24333E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#24333E;"></span> <code>#24333E</code><br><span role="img" aria-label="chart color #394C56" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#394C56;"></span> <code>#394C56</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.288 / 14.831 / 12.403 / 8.256 | 適合 | 確認事項なし | 安定した流れを象徴する青灰。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-high-3` | 冷静な判断のセージグレー | <span role="img" aria-label="primary color #80968A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#80968A;"></span> <code>#80968A</code><br><span role="img" aria-label="secondary color #415C70" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#415C70;"></span> <code>#415C70</code><br><span role="img" aria-label="accent color #678B9C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#678B9C;"></span> <code>#678B9C</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F7F6;"></span> <code>#F5F7F6</code><br><span role="img" aria-label="surface color #F6F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F8;"></span> <code>#F6F7F8</code><br><span role="img" aria-label="accent color #394C56" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#394C56;"></span> <code>#394C56</code><br><span role="img" aria-label="chart color #46534C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#46534C;"></span> <code>#46534C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.422 / 14.467 / 8.359 / 7.501 | 適合 | 確認事項なし | 無理なく続く秩序を表す緑。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-low-1` | 揺らぐ感情を照らす琥珀色 | <span role="img" aria-label="primary color #B77D45" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B77D45;"></span> <code>#B77D45</code><br><span role="img" aria-label="secondary color #5D748A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5D748A;"></span> <code>#5D748A</code><br><span role="img" aria-label="accent color #8B8191" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8191;"></span> <code>#8B8191</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9F5F0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F5F0;"></span> <code>#F9F5F0</code><br><span role="img" aria-label="surface color #F7F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F8F9;"></span> <code>#F7F8F9</code><br><span role="img" aria-label="accent color #4C4750" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C4750;"></span> <code>#4C4750</code><br><span role="img" aria-label="chart color #654526" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#654526;"></span> <code>#654526</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.296 / 14.594 / 8.497 / 7.953 | 適合 | 確認事項なし | 気づきと準備を照らす灯りの色。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-low-2` | 整頓しようとする深い青 | <span role="img" aria-label="primary color #5D748A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5D748A;"></span> <code>#5D748A</code><br><span role="img" aria-label="secondary color #8B8191" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8191;"></span> <code>#8B8191</code><br><span role="img" aria-label="accent color #B77D45" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B77D45;"></span> <code>#B77D45</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F2F4F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F2F4F6;"></span> <code>#F2F4F6</code><br><span role="img" aria-label="surface color #F9F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F9FA;"></span> <code>#F9F9FA</code><br><span role="img" aria-label="accent color #654526" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#654526;"></span> <code>#654526</code><br><span role="img" aria-label="chart color #33404C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#33404C;"></span> <code>#33404C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.074 / 14.748 / 8.205 / 9.627 | 適合 | 確認事項なし | 不確実さを段取りで整理する青。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-low-3` | 灯火の淡い黄色 | <span role="img" aria-label="primary color #8B8191" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8191;"></span> <code>#8B8191</code><br><span role="img" aria-label="secondary color #B77D45" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B77D45;"></span> <code>#B77D45</code><br><span role="img" aria-label="accent color #5D748A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5D748A;"></span> <code>#5D748A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F5F6;"></span> <code>#F6F5F6</code><br><span role="img" aria-label="surface color #FBF9F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF9F6;"></span> <code>#FBF9F6</code><br><span role="img" aria-label="accent color #33404C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#33404C;"></span> <code>#33404C</code><br><span role="img" aria-label="chart color #4C4750" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C4750;"></span> <code>#4C4750</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.269 / 14.766 / 10.100 / 8.308 | 適合 | 確認事項なし | 繊細さと規律が重なる色。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-high-1` | 流れる水の淡いブルー | <span role="img" aria-label="primary color #6DA6A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6DA6A3;"></span> <code>#6DA6A3</code><br><span role="img" aria-label="secondary color #7193A5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7193A5;"></span> <code>#7193A5</code><br><span role="img" aria-label="accent color #B9A17D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B9A17D;"></span> <code>#B9A17D</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F8F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F8F8;"></span> <code>#F3F8F8</code><br><span role="img" aria-label="surface color #F8FAFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8FAFB;"></span> <code>#F8FAFB</code><br><span role="img" aria-label="accent color #665945" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665945;"></span> <code>#665945</code><br><span role="img" aria-label="chart color #3C5B5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3C5B5A;"></span> <code>#3C5B5A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.478 / 14.822 / 6.513 / 6.908 | 適合 | 確認事項なし | 流れに合わせて形を変える青緑。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-high-2` | 軽やかな風の若草色 | <span role="img" aria-label="primary color #7193A5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7193A5;"></span> <code>#7193A5</code><br><span role="img" aria-label="secondary color #B9A17D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B9A17D;"></span> <code>#B9A17D</code><br><span role="img" aria-label="accent color #6DA6A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6DA6A3;"></span> <code>#6DA6A3</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F6F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F6F8;"></span> <code>#F4F6F8</code><br><span role="img" aria-label="surface color #FCFAF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCFAF9;"></span> <code>#FCFAF9</code><br><span role="img" aria-label="accent color #3C5B5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3C5B5A;"></span> <code>#3C5B5A</code><br><span role="img" aria-label="chart color #3E515B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3E515B;"></span> <code>#3E515B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.324 / 14.913 / 7.116 / 7.653 | 適合 | 確認事項なし | 落ち着いて移動する空気感。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-high-3` | 漂う雲の白 | <span role="img" aria-label="primary color #B9A17D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B9A17D;"></span> <code>#B9A17D</code><br><span role="img" aria-label="secondary color #6DA6A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6DA6A3;"></span> <code>#6DA6A3</code><br><span role="img" aria-label="accent color #7193A5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7193A5;"></span> <code>#7193A5</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9F7F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F5;"></span> <code>#F9F7F5</code><br><span role="img" aria-label="surface color #F8FBFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8FBFA;"></span> <code>#F8FBFA</code><br><span role="img" aria-label="accent color #3E515B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3E515B;"></span> <code>#3E515B</code><br><span role="img" aria-label="chart color #665945" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665945;"></span> <code>#665945</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.521 / 14.905 / 7.964 / 6.380 | 適合 | 確認事項なし | 成り行きを受け止める穏やかな色。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-low-1` | 揺れる影の深い紫灰 | <span role="img" aria-label="primary color #8E738A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8E738A;"></span> <code>#8E738A</code><br><span role="img" aria-label="secondary color #758EA0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#758EA0;"></span> <code>#758EA0</code><br><span role="img" aria-label="accent color #8F796B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8F796B;"></span> <code>#8F796B</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F4F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F6;"></span> <code>#F6F4F6</code><br><span role="img" aria-label="surface color #F8F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9FA;"></span> <code>#F8F9FA</code><br><span role="img" aria-label="accent color #4F433B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F433B;"></span> <code>#4F433B</code><br><span role="img" aria-label="chart color #4E3F4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E3F4C;"></span> <code>#4E3F4C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.180 / 14.721 / 9.062 / 8.970 | 適合 | 確認事項なし | 感情や状況の揺らぎを象徴する紫灰。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-low-2` | 繊細な感性の淡いブルーグレー | <span role="img" aria-label="primary color #758EA0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#758EA0;"></span> <code>#758EA0</code><br><span role="img" aria-label="secondary color #8F796B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8F796B;"></span> <code>#8F796B</code><br><span role="img" aria-label="accent color #8E738A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8E738A;"></span> <code>#8E738A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F6F7;"></span> <code>#F4F6F7</code><br><span role="img" aria-label="surface color #F9F8F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F8F8;"></span> <code>#F9F8F8</code><br><span role="img" aria-label="accent color #4E3F4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E3F4C;"></span> <code>#4E3F4C</code><br><span role="img" aria-label="chart color #404E58" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#404E58;"></span> <code>#404E58</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.315 / 14.639 / 9.260 / 7.911 | 適合 | 確認事項なし | 定まらない歩みを静かに表す青。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-low-3` | 儚い光のベージュ | <span role="img" aria-label="primary color #8F796B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8F796B;"></span> <code>#8F796B</code><br><span role="img" aria-label="secondary color #8E738A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8E738A;"></span> <code>#8E738A</code><br><span role="img" aria-label="accent color #758EA0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#758EA0;"></span> <code>#758EA0</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F4F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F3;"></span> <code>#F6F4F3</code><br><span role="img" aria-label="surface color #F9F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F8F9;"></span> <code>#F9F8F9</code><br><span role="img" aria-label="accent color #404E58" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#404E58;"></span> <code>#404E58</code><br><span role="img" aria-label="chart color #4F433B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F433B;"></span> <code>#4F433B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.153 / 14.648 / 8.095 / 8.712 | 適合 | 確認事項なし | 夕暮れの曖昧な輪郭を思わせる色。 |
| `palette-pair-extraversion-high-and-agreeableness-high-1` | 華やかなコーラルピンク | <span role="img" aria-label="primary color #D96F67" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D96F67;"></span> <code>#D96F67</code><br><span role="img" aria-label="secondary color #3F9C98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F9C98;"></span> <code>#3F9C98</code><br><span role="img" aria-label="accent color #D0A24C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D0A24C;"></span> <code>#D0A24C</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FCF3F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF3F3;"></span> <code>#FCF3F3</code><br><span role="img" aria-label="surface color #F5FAFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5FAFA;"></span> <code>#F5FAFA</code><br><span role="img" aria-label="accent color #72592A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#72592A;"></span> <code>#72592A</code><br><span role="img" aria-label="chart color #773D39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#773D39;"></span> <code>#773D39</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.227 / 14.732 / 6.274 / 7.668 | 適合 | 確認事項なし | 人と一緒に場へ踏み出す温かい色。 |
| `palette-pair-extraversion-high-and-agreeableness-high-2` | 共演する明るいターコイズ | <span role="img" aria-label="primary color #3F9C98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F9C98;"></span> <code>#3F9C98</code><br><span role="img" aria-label="secondary color #D0A24C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D0A24C;"></span> <code>#D0A24C</code><br><span role="img" aria-label="accent color #D96F67" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D96F67;"></span> <code>#D96F67</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F7F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F7F7;"></span> <code>#F0F7F7</code><br><span role="img" aria-label="surface color #FDFAF6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDFAF6;"></span> <code>#FDFAF6</code><br><span role="img" aria-label="accent color #773D39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#773D39;"></span> <code>#773D39</code><br><span role="img" aria-label="chart color #235654" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#235654;"></span> <code>#235654</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.300 / 14.913 / 8.037 / 7.647 | 適合 | 確認事項なし | 協力しながら動く軽快な青緑。 |
| `palette-pair-extraversion-high-and-agreeableness-high-3` | 活気ある黄金色 | <span role="img" aria-label="primary color #D0A24C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D0A24C;"></span> <code>#D0A24C</code><br><span role="img" aria-label="secondary color #D96F67" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D96F67;"></span> <code>#D96F67</code><br><span role="img" aria-label="accent color #3F9C98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F9C98;"></span> <code>#3F9C98</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FBF8F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF8F1;"></span> <code>#FBF8F1</code><br><span role="img" aria-label="surface color #FDF8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDF8F7;"></span> <code>#FDF8F7</code><br><span role="img" aria-label="accent color #235654" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#235654;"></span> <code>#235654</code><br><span role="img" aria-label="chart color #72592A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#72592A;"></span> <code>#72592A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.630 / 14.739 / 7.882 / 6.230 | 適合 | 確認事項なし | 共有される喜びを象徴する色。 |
| `palette-pair-extraversion-high-and-agreeableness-low-1` | 強烈な個性の赤 | <span role="img" aria-label="primary color #C8564F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C8564F;"></span> <code>#C8564F</code><br><span role="img" aria-label="secondary color #3E6485" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3E6485;"></span> <code>#3E6485</code><br><span role="img" aria-label="accent color #A94F7A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A94F7A;"></span> <code>#A94F7A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FBF1F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF1F1;"></span> <code>#FBF1F1</code><br><span role="img" aria-label="surface color #F5F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F7F9;"></span> <code>#F5F7F9</code><br><span role="img" aria-label="accent color #5D2B43" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5D2B43;"></span> <code>#5D2B43</code><br><span role="img" aria-label="chart color #6E2F2B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E2F2B;"></span> <code>#6E2F2B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.006 / 14.450 / 10.335 / 9.007 | 適合 | 確認事項なし | 自分の色を明確に掲げる赤。 |
| `palette-pair-extraversion-high-and-agreeableness-low-2` | 鮮やかな対比の深い青 | <span role="img" aria-label="primary color #3E6485" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3E6485;"></span> <code>#3E6485</code><br><span role="img" aria-label="secondary color #A94F7A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A94F7A;"></span> <code>#A94F7A</code><br><span role="img" aria-label="accent color #C8564F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C8564F;"></span> <code>#C8564F</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F3F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F3F5;"></span> <code>#F0F3F5</code><br><span role="img" aria-label="surface color #FBF6F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF6F8;"></span> <code>#FBF6F8</code><br><span role="img" aria-label="accent color #6E2F2B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E2F2B;"></span> <code>#6E2F2B</code><br><span role="img" aria-label="chart color #223749" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#223749;"></span> <code>#223749</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.924 / 14.512 / 9.332 / 11.015 | 適合 | 確認事項なし | 周囲に流されない判断を表す青。 |
| `palette-pair-extraversion-high-and-agreeableness-low-3` | 揺るがない信念のマゼンタ | <span role="img" aria-label="primary color #A94F7A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A94F7A;"></span> <code>#A94F7A</code><br><span role="img" aria-label="secondary color #C8564F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C8564F;"></span> <code>#C8564F</code><br><span role="img" aria-label="accent color #3E6485" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3E6485;"></span> <code>#3E6485</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F8F1F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F1F4;"></span> <code>#F8F1F4</code><br><span role="img" aria-label="surface color #FCF7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF7F6;"></span> <code>#FCF7F6</code><br><span role="img" aria-label="accent color #223749" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#223749;"></span> <code>#223749</code><br><span role="img" aria-label="chart color #5D2B43" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5D2B43;"></span> <code>#5D2B43</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.951 / 14.612 / 11.559 / 9.979 | 適合 | 確認事項なし | 存在感のある主張を象徴する色。 |
| `palette-pair-extraversion-low-and-agreeableness-high-1` | 寄り添う淡いセージグリーン | <span role="img" aria-label="primary color #8FA18A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8FA18A;"></span> <code>#8FA18A</code><br><span role="img" aria-label="secondary color #728C9B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#728C9B;"></span> <code>#728C9B</code><br><span role="img" aria-label="accent color #C5A0A2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C5A0A2;"></span> <code>#C5A0A2</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F6;"></span> <code>#F6F7F6</code><br><span role="img" aria-label="surface color #F8F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9FA;"></span> <code>#F8F9FA</code><br><span role="img" aria-label="accent color #6C5859" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C5859;"></span> <code>#6C5859</code><br><span role="img" aria-label="chart color #4F594C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F594C;"></span> <code>#4F594C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.449 / 14.721 / 6.269 / 6.823 | 適合 | 確認事項なし | 静かな場所から相手を見守る緑。 |
| `palette-pair-extraversion-low-and-agreeableness-high-2` | 静観するブルーグレー | <span role="img" aria-label="primary color #728C9B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#728C9B;"></span> <code>#728C9B</code><br><span role="img" aria-label="secondary color #C5A0A2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C5A0A2;"></span> <code>#C5A0A2</code><br><span role="img" aria-label="accent color #8FA18A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8FA18A;"></span> <code>#8FA18A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F6F7;"></span> <code>#F4F6F7</code><br><span role="img" aria-label="surface color #FCFAFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCFAFA;"></span> <code>#FCFAFA</code><br><span role="img" aria-label="accent color #4F594C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F594C;"></span> <code>#4F594C</code><br><span role="img" aria-label="chart color #3F4D55" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F4D55;"></span> <code>#3F4D55</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.315 / 14.922 / 7.047 / 8.058 | 適合 | 確認事項なし | 控えめな支えを表す青灰。 |
| `palette-pair-extraversion-low-and-agreeableness-high-3` | 安らぎのパールホワイト | <span role="img" aria-label="primary color #C5A0A2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C5A0A2;"></span> <code>#C5A0A2</code><br><span role="img" aria-label="secondary color #8FA18A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8FA18A;"></span> <code>#8FA18A</code><br><span role="img" aria-label="accent color #728C9B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#728C9B;"></span> <code>#728C9B</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAF7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF7F8;"></span> <code>#FAF7F8</code><br><span role="img" aria-label="surface color #F9FAF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FAF9;"></span> <code>#F9FAF9</code><br><span role="img" aria-label="accent color #3F4D55" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F4D55;"></span> <code>#3F4D55</code><br><span role="img" aria-label="chart color #6C5859" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C5859;"></span> <code>#6C5859</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.575 / 14.831 / 8.348 / 6.207 | 適合 | 確認事項なし | 言葉にしすぎない温かさ。 |
| `palette-pair-extraversion-low-and-agreeableness-low-1` | 孤独を愛する深い紺 | <span role="img" aria-label="primary color #465469" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#465469;"></span> <code>#465469</code><br><span role="img" aria-label="secondary color #777C7E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#777C7E;"></span> <code>#777C7E</code><br><span role="img" aria-label="accent color #826F61" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#826F61;"></span> <code>#826F61</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F1F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F1F3;"></span> <code>#F0F1F3</code><br><span role="img" aria-label="surface color #F8F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F8F9;"></span> <code>#F8F8F9</code><br><span role="img" aria-label="accent color #483D35" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#483D35;"></span> <code>#483D35</code><br><span role="img" aria-label="chart color #272E3A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#272E3A;"></span> <code>#272E3A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.731 / 14.621 / 9.921 / 12.080 | 適合 | 確認事項なし | 自分に合う距離を選ぶ深い青。 |
| `palette-pair-extraversion-low-and-agreeableness-low-2` | 自分の席を守るグレー | <span role="img" aria-label="primary color #777C7E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#777C7E;"></span> <code>#777C7E</code><br><span role="img" aria-label="secondary color #826F61" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#826F61;"></span> <code>#826F61</code><br><span role="img" aria-label="accent color #465469" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#465469;"></span> <code>#465469</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F5F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F5F5;"></span> <code>#F4F5F5</code><br><span role="img" aria-label="surface color #F9F8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F8F7;"></span> <code>#F9F8F7</code><br><span role="img" aria-label="accent color #272E3A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#272E3A;"></span> <code>#272E3A</code><br><span role="img" aria-label="chart color #414445" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#414445;"></span> <code>#414445</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.207 / 14.630 / 12.871 / 8.994 | 適合 | 確認事項なし | 必要な場所に静かに留まる色。 |
| `palette-pair-extraversion-low-and-agreeableness-low-3` | 静寂を湛えるブラウン | <span role="img" aria-label="primary color #826F61" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#826F61;"></span> <code>#826F61</code><br><span role="img" aria-label="secondary color #465469" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#465469;"></span> <code>#465469</code><br><span role="img" aria-label="accent color #777C7E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#777C7E;"></span> <code>#777C7E</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F3F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F3F2;"></span> <code>#F5F3F2</code><br><span role="img" aria-label="surface color #F6F6F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F6F8;"></span> <code>#F6F6F8</code><br><span role="img" aria-label="accent color #414445" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#414445;"></span> <code>#414445</code><br><span role="img" aria-label="chart color #483D35" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#483D35;"></span> <code>#483D35</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.029 / 14.377 / 9.102 / 9.519 | 適合 | 確認事項なし | 自分の居場所を象徴する木の色。 |
| `palette-pair-extraversion-high-and-emotionalstability-high-1` | 心を寛げる明るいターコイズ | <span role="img" aria-label="primary color #4B9C96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B9C96;"></span> <code>#4B9C96</code><br><span role="img" aria-label="secondary color #D97A6B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D97A6B;"></span> <code>#D97A6B</code><br><span role="img" aria-label="accent color #6C9BB5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C9BB5;"></span> <code>#6C9BB5</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F1F7F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F1F7F7;"></span> <code>#F1F7F7</code><br><span role="img" aria-label="surface color #FDF8F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDF8F8;"></span> <code>#FDF8F8</code><br><span role="img" aria-label="accent color #3B5564" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3B5564;"></span> <code>#3B5564</code><br><span role="img" aria-label="chart color #295653" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#295653;"></span> <code>#295653</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.326 / 14.748 / 7.477 / 7.602 | 適合 | 確認事項なし | 交流の中でも自然体でいる青緑。 |
| `palette-pair-extraversion-high-and-emotionalstability-high-2` | 安定した社交のコーラル | <span role="img" aria-label="primary color #D97A6B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D97A6B;"></span> <code>#D97A6B</code><br><span role="img" aria-label="secondary color #6C9BB5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C9BB5;"></span> <code>#6C9BB5</code><br><span role="img" aria-label="accent color #4B9C96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B9C96;"></span> <code>#4B9C96</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FCF4F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF4F3;"></span> <code>#FCF4F3</code><br><span role="img" aria-label="surface color #F8FAFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8FAFB;"></span> <code>#F8FAFB</code><br><span role="img" aria-label="accent color #295653" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#295653;"></span> <code>#295653</code><br><span role="img" aria-label="chart color #77433B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#77433B;"></span> <code>#77433B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.316 / 14.822 / 7.865 / 7.310 | 適合 | 確認事項なし | 穏やかな活気を表す色。 |
| `palette-pair-extraversion-high-and-emotionalstability-high-3` | 包容力あるスカイブルー | <span role="img" aria-label="primary color #6C9BB5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C9BB5;"></span> <code>#6C9BB5</code><br><span role="img" aria-label="secondary color #4B9C96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B9C96;"></span> <code>#4B9C96</code><br><span role="img" aria-label="accent color #D97A6B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D97A6B;"></span> <code>#D97A6B</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F7F9;"></span> <code>#F3F7F9</code><br><span role="img" aria-label="surface color #F6FAFA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6FAFA;"></span> <code>#F6FAFA</code><br><span role="img" aria-label="accent color #77433B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#77433B;"></span> <code>#77433B</code><br><span role="img" aria-label="chart color #3B5564" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3B5564;"></span> <code>#3B5564</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.397 / 14.759 / 7.536 / 7.299 | 適合 | 確認事項なし | 開放感と落ち着きが重なる青。 |
| `palette-pair-extraversion-high-and-emotionalstability-low-1` | ざわめきを象徴する鮮やかなコーラル | <span role="img" aria-label="primary color #CF6F72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#CF6F72;"></span> <code>#CF6F72</code><br><span role="img" aria-label="secondary color #4D9FAD" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D9FAD;"></span> <code>#4D9FAD</code><br><span role="img" aria-label="accent color #9A7FA9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A7FA9;"></span> <code>#9A7FA9</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FBF3F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF3F4;"></span> <code>#FBF3F4</code><br><span role="img" aria-label="surface color #F6FAFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6FAFB;"></span> <code>#F6FAFB</code><br><span role="img" aria-label="accent color #55465D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#55465D;"></span> <code>#55465D</code><br><span role="img" aria-label="chart color #723D3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#723D3F;"></span> <code>#723D3F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.209 / 14.768 / 8.257 / 7.833 | 適合 | 確認事項なし | 人の反応へ敏感に振り向く色。 |
| `palette-pair-extraversion-high-and-emotionalstability-low-2` | 揺らぐ感情のターコイズ | <span role="img" aria-label="primary color #4D9FAD" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D9FAD;"></span> <code>#4D9FAD</code><br><span role="img" aria-label="secondary color #9A7FA9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A7FA9;"></span> <code>#9A7FA9</code><br><span role="img" aria-label="accent color #CF6F72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#CF6F72;"></span> <code>#CF6F72</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F1F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F1F7F8;"></span> <code>#F1F7F8</code><br><span role="img" aria-label="surface color #FAF9FB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF9FB;"></span> <code>#FAF9FB</code><br><span role="img" aria-label="accent color #723D3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#723D3F;"></span> <code>#723D3F</code><br><span role="img" aria-label="chart color #2A575F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2A575F;"></span> <code>#2A575F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.335 / 14.785 / 8.151 / 7.385 | 適合 | 確認事項なし | 交流へ踏み出す軽快な青。 |
| `palette-pair-extraversion-high-and-emotionalstability-low-3` | 参加意欲を包む淡い紫 | <span role="img" aria-label="primary color #9A7FA9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A7FA9;"></span> <code>#9A7FA9</code><br><span role="img" aria-label="secondary color #CF6F72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#CF6F72;"></span> <code>#CF6F72</code><br><span role="img" aria-label="accent color #4D9FAD" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D9FAD;"></span> <code>#4D9FAD</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F7F5F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F5F8;"></span> <code>#F7F5F8</code><br><span role="img" aria-label="surface color #FDF8F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FDF8F8;"></span> <code>#FDF8F8</code><br><span role="img" aria-label="accent color #2A575F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2A575F;"></span> <code>#2A575F</code><br><span role="img" aria-label="chart color #55465D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#55465D;"></span> <code>#55465D</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.314 / 14.748 / 7.598 / 8.003 | 適合 | 確認事項なし | 周囲の気配が残る余韻を表す紫。 |
| `palette-pair-extraversion-low-and-emotionalstability-high-1` | 芽吹きを待つ若葉色 | <span role="img" aria-label="primary color #879C78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#879C78;"></span> <code>#879C78</code><br><span role="img" aria-label="secondary color #6D8492" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6D8492;"></span> <code>#6D8492</code><br><span role="img" aria-label="accent color #C2AD8E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C2AD8E;"></span> <code>#C2AD8E</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F7F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F7F4;"></span> <code>#F5F7F4</code><br><span role="img" aria-label="surface color #F8F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9FA;"></span> <code>#F8F9FA</code><br><span role="img" aria-label="accent color #6B5F4E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B5F4E;"></span> <code>#6B5F4E</code><br><span role="img" aria-label="chart color #4A5642" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A5642;"></span> <code>#4A5642</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.404 / 14.721 / 5.908 / 7.217 | 適合 | 確認事項なし | 静かに時機を待つ若葉の色。 |
| `palette-pair-extraversion-low-and-emotionalstability-high-2` | 安定した待機の深い緑 | <span role="img" aria-label="primary color #6D8492" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6D8492;"></span> <code>#6D8492</code><br><span role="img" aria-label="secondary color #C2AD8E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C2AD8E;"></span> <code>#C2AD8E</code><br><span role="img" aria-label="accent color #879C78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#879C78;"></span> <code>#879C78</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F5F6;"></span> <code>#F3F5F6</code><br><span role="img" aria-label="surface color #FCFBF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCFBF9;"></span> <code>#FCFBF9</code><br><span role="img" aria-label="accent color #4A5642" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A5642;"></span> <code>#4A5642</code><br><span role="img" aria-label="chart color #3C4950" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3C4950;"></span> <code>#3C4950</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.190 / 15.005 / 7.518 / 8.493 | 適合 | 確認事項なし | 落ち着いた場所に留まる青灰。 |
| `palette-pair-extraversion-low-and-emotionalstability-high-3` | 静かな期待の白 | <span role="img" aria-label="primary color #C2AD8E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C2AD8E;"></span> <code>#C2AD8E</code><br><span role="img" aria-label="secondary color #879C78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#879C78;"></span> <code>#879C78</code><br><span role="img" aria-label="accent color #6D8492" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6D8492;"></span> <code>#6D8492</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAF8F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF8F6;"></span> <code>#FAF8F6</code><br><span role="img" aria-label="surface color #F9FAF8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FAF8;"></span> <code>#F9FAF8</code><br><span role="img" aria-label="accent color #3C4950" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3C4950;"></span> <code>#3C4950</code><br><span role="img" aria-label="chart color #6B5F4E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B5F4E;"></span> <code>#6B5F4E</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.648 / 14.821 / 8.871 / 5.878 | 適合 | 確認事項なし | ゆっくり始まる変化を象徴する色。 |
| `palette-pair-extraversion-low-and-emotionalstability-low-1` | 薄明のスレートブルー | <span role="img" aria-label="primary color #667D91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#667D91;"></span> <code>#667D91</code><br><span role="img" aria-label="secondary color #88798C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#88798C;"></span> <code>#88798C</code><br><span role="img" aria-label="accent color #778D82" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#778D82;"></span> <code>#778D82</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F5F6;"></span> <code>#F3F5F6</code><br><span role="img" aria-label="surface color #F9F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F8F9;"></span> <code>#F9F8F9</code><br><span role="img" aria-label="accent color #414E48" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#414E48;"></span> <code>#414E48</code><br><span role="img" aria-label="chart color #384550" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#384550;"></span> <code>#384550</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.190 / 14.648 / 8.232 / 8.993 | 適合 | 確認事項なし | 夜と朝の境界に耳を澄ます青。 |
| `palette-pair-extraversion-low-and-emotionalstability-low-2` | 繊細な夜明けの紫灰 | <span role="img" aria-label="primary color #88798C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#88798C;"></span> <code>#88798C</code><br><span role="img" aria-label="secondary color #778D82" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#778D82;"></span> <code>#778D82</code><br><span role="img" aria-label="accent color #667D91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#667D91;"></span> <code>#667D91</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F4F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F4F6;"></span> <code>#F5F4F6</code><br><span role="img" aria-label="surface color #F8F9F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9F9;"></span> <code>#F8F9F9</code><br><span role="img" aria-label="accent color #384550" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#384550;"></span> <code>#384550</code><br><span role="img" aria-label="chart color #4B434D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B434D;"></span> <code>#4B434D</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.153 / 14.712 / 9.324 / 8.670 | 適合 | 確認事項なし | 静けさと繊細さが重なる紫灰。 |
| `palette-pair-extraversion-low-and-emotionalstability-low-3` | 静寂を湛えるセージグレー | <span role="img" aria-label="primary color #778D82" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#778D82;"></span> <code>#778D82</code><br><span role="img" aria-label="secondary color #667D91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#667D91;"></span> <code>#667D91</code><br><span role="img" aria-label="accent color #88798C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#88798C;"></span> <code>#88798C</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F6F5;"></span> <code>#F4F6F5</code><br><span role="img" aria-label="surface color #F7F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F9FA;"></span> <code>#F7F9FA</code><br><span role="img" aria-label="accent color #4B434D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B434D;"></span> <code>#4B434D</code><br><span role="img" aria-label="chart color #414E48" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#414E48;"></span> <code>#414E48</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.297 / 14.694 / 9.001 / 8.034 | 適合 | 確認事項なし | 刺激を抑えた森の気配を表す色。 |
| `palette-pair-agreeableness-high-and-emotionalstability-high-1` | 調和する淡いピンク | <span role="img" aria-label="primary color #C58C91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C58C91;"></span> <code>#C58C91</code><br><span role="img" aria-label="secondary color #899E8A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#899E8A;"></span> <code>#899E8A</code><br><span role="img" aria-label="accent color #6E909E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E909E;"></span> <code>#6E909E</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAF6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF6F6;"></span> <code>#FAF6F6</code><br><span role="img" aria-label="surface color #F9FAF9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9FAF9;"></span> <code>#F9FAF9</code><br><span role="img" aria-label="accent color #3D4F57" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D4F57;"></span> <code>#3D4F57</code><br><span role="img" aria-label="chart color #6C4D50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C4D50;"></span> <code>#6C4D50</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.467 / 14.831 / 8.177 / 6.955 | 適合 | 確認事項なし | 穏やかに向かい合う温かな色。 |
| `palette-pair-agreeableness-high-and-emotionalstability-high-2` | 穏やかな共有のミントグリーン | <span role="img" aria-label="primary color #899E8A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#899E8A;"></span> <code>#899E8A</code><br><span role="img" aria-label="secondary color #6E909E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E909E;"></span> <code>#6E909E</code><br><span role="img" aria-label="accent color #C58C91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C58C91;"></span> <code>#C58C91</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F6;"></span> <code>#F6F7F6</code><br><span role="img" aria-label="surface color #F8F9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9FA;"></span> <code>#F8F9FA</code><br><span role="img" aria-label="accent color #6C4D50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C4D50;"></span> <code>#6C4D50</code><br><span role="img" aria-label="chart color #4B574C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B574C;"></span> <code>#4B574C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.449 / 14.721 / 7.077 / 7.067 | 適合 | 確認事項なし | 落ち着いた協調を象徴する緑。 |
| `palette-pair-agreeableness-high-and-emotionalstability-high-3` | 安定した共存のブルーグレー | <span role="img" aria-label="primary color #6E909E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E909E;"></span> <code>#6E909E</code><br><span role="img" aria-label="secondary color #C58C91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C58C91;"></span> <code>#C58C91</code><br><span role="img" aria-label="accent color #899E8A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#899E8A;"></span> <code>#899E8A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F6F7;"></span> <code>#F3F6F7</code><br><span role="img" aria-label="surface color #FCF9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF9FA;"></span> <code>#FCF9FA</code><br><span role="img" aria-label="accent color #4B574C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B574C;"></span> <code>#4B574C</code><br><span role="img" aria-label="chart color #3D4F57" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D4F57;"></span> <code>#3D4F57</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.288 / 14.830 / 7.254 / 7.878 | 適合 | 確認事項なし | 感情に流されず関係を保つ青。 |
| `palette-pair-agreeableness-high-and-emotionalstability-low-1` | 共鳴し揺れるローズピンク | <span role="img" aria-label="primary color #BE8695" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BE8695;"></span> <code>#BE8695</code><br><span role="img" aria-label="secondary color #9A86A7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A86A7;"></span> <code>#9A86A7</code><br><span role="img" aria-label="accent color #7A97A5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7A97A5;"></span> <code>#7A97A5</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAF5F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF5F7;"></span> <code>#FAF5F7</code><br><span role="img" aria-label="surface color #FAF9FB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF9FB;"></span> <code>#FAF9FB</code><br><span role="img" aria-label="accent color #43535B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#43535B;"></span> <code>#43535B</code><br><span role="img" aria-label="chart color #694A52" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#694A52;"></span> <code>#694A52</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.386 / 14.785 / 7.616 / 7.205 | 適合 | 確認事項なし | 相手の気配を細やかに受け取る色。 |
| `palette-pair-agreeableness-high-and-emotionalstability-low-2` | 温かな寄り添いの淡い紫 | <span role="img" aria-label="primary color #9A86A7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A86A7;"></span> <code>#9A86A7</code><br><span role="img" aria-label="secondary color #7A97A5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7A97A5;"></span> <code>#7A97A5</code><br><span role="img" aria-label="accent color #BE8695" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BE8695;"></span> <code>#BE8695</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F7F5F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F5F8;"></span> <code>#F7F5F8</code><br><span role="img" aria-label="surface color #F8FAFB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8FAFB;"></span> <code>#F8FAFB</code><br><span role="img" aria-label="accent color #694A52" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#694A52;"></span> <code>#694A52</code><br><span role="img" aria-label="chart color #554A5C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#554A5C;"></span> <code>#554A5C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.314 / 14.822 / 7.424 / 7.686 | 適合 | 確認事項なし | 関係の揺らぎに寄り添う紫。 |
| `palette-pair-agreeableness-high-and-emotionalstability-low-3` | 繊細な調和のライトブルー | <span role="img" aria-label="primary color #7A97A5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7A97A5;"></span> <code>#7A97A5</code><br><span role="img" aria-label="secondary color #BE8695" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BE8695;"></span> <code>#BE8695</code><br><span role="img" aria-label="accent color #9A86A7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A86A7;"></span> <code>#9A86A7</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F7F8;"></span> <code>#F4F7F8</code><br><span role="img" aria-label="surface color #FCF9FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF9FA;"></span> <code>#FCF9FA</code><br><span role="img" aria-label="accent color #554A5C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#554A5C;"></span> <code>#554A5C</code><br><span role="img" aria-label="chart color #43535B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#43535B;"></span> <code>#43535B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.414 / 14.830 / 7.963 / 7.425 | 適合 | 確認事項なし | 周囲の変化を映す柔らかな青。 |
| `palette-pair-agreeableness-low-and-emotionalstability-high-1` | 淡々とした理性のグレー | <span role="img" aria-label="primary color #5E6A70" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5E6A70;"></span> <code>#5E6A70</code><br><span role="img" aria-label="secondary color #3F5368" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5368;"></span> <code>#3F5368</code><br><span role="img" aria-label="accent color #8A7363" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8A7363;"></span> <code>#8A7363</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F2F3F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F2F3F4;"></span> <code>#F2F3F4</code><br><span role="img" aria-label="surface color #F5F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F6F7;"></span> <code>#F5F6F7</code><br><span role="img" aria-label="accent color #4C3F36" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C3F36;"></span> <code>#4C3F36</code><br><span role="img" aria-label="chart color #343A3E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#343A3E;"></span> <code>#343A3E</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.967 / 14.341 / 9.369 / 10.381 | 適合 | 確認事項なし | 感情に流されず立場を示す灰青。 |
| `palette-pair-agreeableness-low-and-emotionalstability-high-2` | 揺るがない安定の深い青 | <span role="img" aria-label="primary color #3F5368" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5368;"></span> <code>#3F5368</code><br><span role="img" aria-label="secondary color #8A7363" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8A7363;"></span> <code>#8A7363</code><br><span role="img" aria-label="accent color #5E6A70" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5E6A70;"></span> <code>#5E6A70</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F1F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F1F3;"></span> <code>#F0F1F3</code><br><span role="img" aria-label="surface color #F9F8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F8F7;"></span> <code>#F9F8F7</code><br><span role="img" aria-label="accent color #343A3E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#343A3E;"></span> <code>#343A3E</code><br><span role="img" aria-label="chart color #232E39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#232E39;"></span> <code>#232E39</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.731 / 14.630 / 10.873 / 12.214 | 適合 | 確認事項なし | 静かな確かさを持つ青。 |
| `palette-pair-agreeableness-low-and-emotionalstability-high-3` | 明快な表明のトープ | <span role="img" aria-label="primary color #8A7363" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8A7363;"></span> <code>#8A7363</code><br><span role="img" aria-label="secondary color #5E6A70" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5E6A70;"></span> <code>#5E6A70</code><br><span role="img" aria-label="accent color #3F5368" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5368;"></span> <code>#3F5368</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F4F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F3;"></span> <code>#F6F4F3</code><br><span role="img" aria-label="surface color #F7F8F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F8F8;"></span> <code>#F7F8F8</code><br><span role="img" aria-label="accent color #232E39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#232E39;"></span> <code>#232E39</code><br><span role="img" aria-label="chart color #4C3F36" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C3F36;"></span> <code>#4C3F36</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.153 / 14.585 / 12.974 / 9.246 | 適合 | 確認事項なし | 現実的で率直な印象を表す色。 |
| `palette-pair-agreeableness-low-and-emotionalstability-low-1` | 情熱的に鳴る深い赤 | <span role="img" aria-label="primary color #854E5E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#854E5E;"></span> <code>#854E5E</code><br><span role="img" aria-label="secondary color #44556A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#44556A;"></span> <code>#44556A</code><br><span role="img" aria-label="accent color #866F82" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#866F82;"></span> <code>#866F82</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F1F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F1F2;"></span> <code>#F5F1F2</code><br><span role="img" aria-label="surface color #F6F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F8;"></span> <code>#F6F7F8</code><br><span role="img" aria-label="accent color #4A3D48" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A3D48;"></span> <code>#4A3D48</code><br><span role="img" aria-label="chart color #492B34" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#492B34;"></span> <code>#492B34</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.853 / 14.467 / 9.540 / 11.169 | 適合 | 確認事項なし | 緊張感を含んだ明確な表明の色。 |
| `palette-pair-agreeableness-low-and-emotionalstability-low-2` | 嵐を見渡す深い青 | <span role="img" aria-label="primary color #44556A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#44556A;"></span> <code>#44556A</code><br><span role="img" aria-label="secondary color #866F82" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#866F82;"></span> <code>#866F82</code><br><span role="img" aria-label="accent color #854E5E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#854E5E;"></span> <code>#854E5E</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F0F1F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F0F1F3;"></span> <code>#F0F1F3</code><br><span role="img" aria-label="surface color #F9F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F8F9;"></span> <code>#F9F8F9</code><br><span role="img" aria-label="accent color #492B34" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#492B34;"></span> <code>#492B34</code><br><span role="img" aria-label="chart color #252F3A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#252F3A;"></span> <code>#252F3A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.731 / 14.648 / 11.810 / 12.016 | 適合 | 確認事項なし | 境界に立ち周囲を見渡す青。 |
| `palette-pair-agreeableness-low-and-emotionalstability-low-3` | 強い意志を示すプラム | <span role="img" aria-label="primary color #866F82" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#866F82;"></span> <code>#866F82</code><br><span role="img" aria-label="secondary color #854E5E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#854E5E;"></span> <code>#854E5E</code><br><span role="img" aria-label="accent color #44556A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#44556A;"></span> <code>#44556A</code> | background=primary/white/92%; surface=secondary/white/95%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F3F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F3F5;"></span> <code>#F5F3F5</code><br><span role="img" aria-label="surface color #F9F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F6F7;"></span> <code>#F9F6F7</code><br><span role="img" aria-label="accent color #252F3A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#252F3A;"></span> <code>#252F3A</code><br><span role="img" aria-label="chart color #4A3D48" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A3D48;"></span> <code>#4A3D48</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.056 / 14.449 / 12.645 / 9.269 | 適合 | 確認事項なし | 細やかな反応と自己主張が重なる紫灰。 |

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
- 代替パレット1: 静謐な淡いブルー (`palette-balanced-2`)
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
- 代替パレット1: 閃きを象徴する星影の紫 (`palette-single-intellectimagination-high-2`)
- 代替パレット2: 未知への好奇心を誘うターコイズ (`palette-single-intellectimagination-high-3`)

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
- 代替パレット1: 柔らかな陽だまりのグレージュ (`palette-single-intellectimagination-low-2`)
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
- 代替パレット1: 移ろいゆく風の若草色 (`palette-single-conscientiousness-low-2`)
- 代替パレット2: 軽やかな雲のサンドベージュ (`palette-single-conscientiousness-low-3`)

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

- 標準パレット: 陽気なコーラルピンク (`palette-single-extraversion-high-1`)
- 代替パレット1: 活気に満ちたオレンジ (`palette-single-extraversion-high-2`)
- 代替パレット2: 交流をひらくターコイズ (`palette-single-extraversion-high-3`)

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
- 代替パレット1: 独立心を示す深いブルーグレー (`palette-single-agreeableness-low-2`)
- 代替パレット2: 揺るがない鉄錆色 (`palette-single-agreeableness-low-3`)

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
- 代替パレット2: 静穏な青磁色 (`palette-single-emotionalstability-high-3`)

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

- 標準パレット: 移ろう光の淡い紫 (`palette-single-emotionalstability-low-1`)
- 代替パレット1: 揺れる水面の淡い青 (`palette-single-emotionalstability-low-2`)
- 代替パレット2: 繊細な薄紅色の花びら (`palette-single-emotionalstability-low-3`)

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
- 代替パレット2: 想像力を刺激するミントグリーン (`palette-pair-intellectimagination-high-and-conscientiousness-low-3`)

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

- 標準パレット: 実直なオリーブ色 (`palette-pair-intellectimagination-low-and-conscientiousness-high-1`)
- 代替パレット1: 誠実な土のブラウン (`palette-pair-intellectimagination-low-and-conscientiousness-high-2`)
- 代替パレット2: 飾らないストーングレー (`palette-pair-intellectimagination-low-and-conscientiousness-high-3`)

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
- 代替パレット2: 知的な輝きのゴールド (`palette-pair-intellectimagination-high-and-extraversion-high-3`)

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

- 標準パレット: 午後の静けさを映すグレー (`palette-pair-intellectimagination-low-and-extraversion-low-1`)
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
- 代替パレット1: 包み込むような深い紫 (`palette-pair-intellectimagination-high-and-agreeableness-high-2`)
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

- 標準パレット: 強い意志を宿す深い青 (`palette-pair-intellectimagination-high-and-agreeableness-low-1`)
- 代替パレット1: 未踏の地を拓く深い紫 (`palette-pair-intellectimagination-high-and-agreeableness-low-2`)
- 代替パレット2: 鋭い理性を照らすオレンジ (`palette-pair-intellectimagination-high-and-agreeableness-low-3`)

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

- 標準パレット: 温かなサンドベージュ (`palette-pair-intellectimagination-low-and-agreeableness-high-1`)
- 代替パレット1: 安らぎを分かつセージグリーン (`palette-pair-intellectimagination-low-and-agreeableness-high-2`)
- 代替パレット2: 穏やかなピーチピンク (`palette-pair-intellectimagination-low-and-agreeableness-high-3`)

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

- 標準パレット: 断定的なオーカー (`palette-pair-intellectimagination-low-and-agreeableness-low-1`)
- 代替パレット1: 明確な視界の深い青 (`palette-pair-intellectimagination-low-and-agreeableness-low-2`)
- 代替パレット2: 揺るぎないスレートグレー (`palette-pair-intellectimagination-low-and-agreeableness-low-3`)

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
- 代替パレット2: 澄み切ったミントグリーン (`palette-pair-intellectimagination-high-and-emotionalstability-high-3`)

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
- 代替パレット2: 繊細な光のローズピンク (`palette-pair-intellectimagination-high-and-emotionalstability-low-3`)

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
- 代替パレット1: 穏やかな午後のセージグリーン (`palette-pair-intellectimagination-low-and-emotionalstability-high-2`)
- 代替パレット2: 安静な庭のオーカー (`palette-pair-intellectimagination-low-and-emotionalstability-high-3`)

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

- 標準パレット: 集中を高める温かな琥珀色 (`palette-pair-conscientiousness-high-and-extraversion-low-1`)
- 代替パレット1: 灯火を見守る深い青 (`palette-pair-conscientiousness-high-and-extraversion-low-2`)
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

- 標準パレット: 軽やかなコーラルピンク (`palette-pair-conscientiousness-low-and-extraversion-high-1`)
- 代替パレット1: 偶然を象徴する明るい若葉色 (`palette-pair-conscientiousness-low-and-extraversion-high-2`)
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
- 代替パレット2: 準備を整えるローズベージュ (`palette-pair-conscientiousness-high-and-agreeableness-high-3`)

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
- 代替パレット2: 秩序を示すオーカー (`palette-pair-conscientiousness-high-and-agreeableness-low-3`)

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

- 標準パレット: 温かな友情の若草色 (`palette-pair-conscientiousness-low-and-agreeableness-high-1`)
- 代替パレット1: 緩やかな時間のコーラル (`palette-pair-conscientiousness-low-and-agreeableness-high-2`)
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

- 標準パレット: 誰にも染まらないレンガ色 (`palette-pair-conscientiousness-low-and-agreeableness-low-1`)
- 代替パレット1: 独立した精神の深い青 (`palette-pair-conscientiousness-low-and-agreeableness-low-2`)
- 代替パレット2: 自由な風のサンドベージュ (`palette-pair-conscientiousness-low-and-agreeableness-low-3`)

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
- 代替パレット2: 冷静な判断のセージグレー (`palette-pair-conscientiousness-high-and-emotionalstability-high-3`)

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

- 標準パレット: 揺らぐ感情を照らす琥珀色 (`palette-pair-conscientiousness-high-and-emotionalstability-low-1`)
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

- 標準パレット: 揺れる影の深い紫灰 (`palette-pair-conscientiousness-low-and-emotionalstability-low-1`)
- 代替パレット1: 繊細な感性の淡いブルーグレー (`palette-pair-conscientiousness-low-and-emotionalstability-low-2`)
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

- 標準パレット: 華やかなコーラルピンク (`palette-pair-extraversion-high-and-agreeableness-high-1`)
- 代替パレット1: 共演する明るいターコイズ (`palette-pair-extraversion-high-and-agreeableness-high-2`)
- 代替パレット2: 活気ある黄金色 (`palette-pair-extraversion-high-and-agreeableness-high-3`)

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
- 代替パレット1: 鮮やかな対比の深い青 (`palette-pair-extraversion-high-and-agreeableness-low-2`)
- 代替パレット2: 揺るがない信念のマゼンタ (`palette-pair-extraversion-high-and-agreeableness-low-3`)

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

- 標準パレット: 寄り添う淡いセージグリーン (`palette-pair-extraversion-low-and-agreeableness-high-1`)
- 代替パレット1: 静観するブルーグレー (`palette-pair-extraversion-low-and-agreeableness-high-2`)
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
- 代替パレット2: 静寂を湛えるブラウン (`palette-pair-extraversion-low-and-agreeableness-low-3`)

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

- 標準パレット: 心を寛げる明るいターコイズ (`palette-pair-extraversion-high-and-emotionalstability-high-1`)
- 代替パレット1: 安定した社交のコーラル (`palette-pair-extraversion-high-and-emotionalstability-high-2`)
- 代替パレット2: 包容力あるスカイブルー (`palette-pair-extraversion-high-and-emotionalstability-high-3`)

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

- 標準パレット: ざわめきを象徴する鮮やかなコーラル (`palette-pair-extraversion-high-and-emotionalstability-low-1`)
- 代替パレット1: 揺らぐ感情のターコイズ (`palette-pair-extraversion-high-and-emotionalstability-low-2`)
- 代替パレット2: 参加意欲を包む淡い紫 (`palette-pair-extraversion-high-and-emotionalstability-low-3`)

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

- 標準パレット: 薄明のスレートブルー (`palette-pair-extraversion-low-and-emotionalstability-low-1`)
- 代替パレット1: 繊細な夜明けの紫灰 (`palette-pair-extraversion-low-and-emotionalstability-low-2`)
- 代替パレット2: 静寂を湛えるセージグレー (`palette-pair-extraversion-low-and-emotionalstability-low-3`)

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
- 代替パレット2: 安定した共存のブルーグレー (`palette-pair-agreeableness-high-and-emotionalstability-high-3`)

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

- 標準パレット: 共鳴し揺れるローズピンク (`palette-pair-agreeableness-high-and-emotionalstability-low-1`)
- 代替パレット1: 温かな寄り添いの淡い紫 (`palette-pair-agreeableness-high-and-emotionalstability-low-2`)
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
- 代替パレット2: 明快な表明のトープ (`palette-pair-agreeableness-low-and-emotionalstability-high-3`)

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
- 代替パレット1: 嵐を見渡す深い青 (`palette-pair-agreeableness-low-and-emotionalstability-low-2`)
- 代替パレット2: 強い意志を示すプラム (`palette-pair-agreeableness-low-and-emotionalstability-low-3`)

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
