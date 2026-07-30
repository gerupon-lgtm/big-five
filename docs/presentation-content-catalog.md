# Q-013 Presentation v2 承認レビュー

正典: content/source/presentation/presentation-v2/*.csv

本書は承認用の生成ビューであり、手編集しない。

承認状況: approved=P-0, P-1, P-2, P-3; draft=P-4, P-5, P-6

各セクションのstatusは承認台帳の現在値を表示する。本書の生成は承認またはruntime有効化を意味しない。

## P-0 パレットと用途色（approved）

色見本はHEXコードを併記し、淡色も判別できるよう外枠を付けている。WCAG判定はコントラスト要件、内容確認はラベルと色の意味対応を、それぞれ独立して確認する。

| ID | ラベル | 基調色 primary / secondary / accent | 用途色レシピ | 解決色 background / surface / accent / chart / text | 比率 text-bg / text-surface / accent-surface / chart-bg | WCAG判定 | 内容確認 | 説明 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `palette-balanced-1` | 澄み切った空色 | <span role="img" aria-label="primary color #7C8791" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7C8791;"></span> <code>#7C8791</code><br><span role="img" aria-label="secondary color #98B0AA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#98B0AA;"></span> <code>#98B0AA</code><br><span role="img" aria-label="accent color #667B7A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#667B7A;"></span> <code>#667B7A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EAECED" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EAECED;"></span> <code>#EAECED</code><br><span role="img" aria-label="surface color #F5F7F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F7F7;"></span> <code>#F5F7F7</code><br><span role="img" aria-label="accent color #384443" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#384443;"></span> <code>#384443</code><br><span role="img" aria-label="chart color #444A50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#444A50;"></span> <code>#444A50</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.094 / 14.431 / 9.407 / 7.569 | 適合 | 確認事項なし | 複数の方向を等しく見渡す中立的な印象。 |
| `palette-balanced-2` | 静謐な淡いブルー | <span role="img" aria-label="primary color #8FAFC1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8FAFC1;"></span> <code>#8FAFC1</code><br><span role="img" aria-label="secondary color #BEB4A9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BEB4A9;"></span> <code>#BEB4A9</code><br><span role="img" aria-label="accent color #8B8484" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8484;"></span> <code>#8B8484</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EDF2F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EDF2F5;"></span> <code>#EDF2F5</code><br><span role="img" aria-label="surface color #F9F8F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F8F6;"></span> <code>#F9F8F6</code><br><span role="img" aria-label="accent color #4C4949" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C4949;"></span> <code>#4C4949</code><br><span role="img" aria-label="chart color #4F606A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F606A;"></span> <code>#4F606A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.759 / 14.620 / 8.396 / 5.794 | 適合 | 確認事項なし | 状況に応じて表情を変える静かな空のイメージ。 |
| `palette-balanced-3` | 穏やかな草原の緑 | <span role="img" aria-label="primary color #4F9B58" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F9B58;"></span> <code>#4F9B58</code><br><span role="img" aria-label="secondary color #98A8A8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#98A8A8;"></span> <code>#98A8A8</code><br><span role="img" aria-label="accent color #597668" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#597668;"></span> <code>#597668</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E3EFE4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E3EFE4;"></span> <code>#E3EFE4</code><br><span role="img" aria-label="surface color #F5F6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F6F6;"></span> <code>#F5F6F6</code><br><span role="img" aria-label="accent color #314139" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#314139;"></span> <code>#314139</code><br><span role="img" aria-label="chart color #2B5530" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B5530;"></span> <code>#2B5530</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.104 / 14.332 / 9.968 / 7.253 | 適合 | 確認事項なし | 偏りを強調せず、穏やかに全体をつなぐ色。 |
| `palette-single-intellectimagination-high-1` | 深い知性の紺色 | <span role="img" aria-label="primary color #4E5D94" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E5D94;"></span> <code>#4E5D94</code><br><span role="img" aria-label="secondary color #88A1AB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#88A1AB;"></span> <code>#88A1AB</code><br><span role="img" aria-label="accent color #4F667C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F667C;"></span> <code>#4F667C</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E3E5EE" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E3E5EE;"></span> <code>#E3E5EE</code><br><span role="img" aria-label="surface color #F3F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F6F7;"></span> <code>#F3F6F7</code><br><span role="img" aria-label="accent color #2B3844" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B3844;"></span> <code>#2B3844</code><br><span role="img" aria-label="chart color #2B3351" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B3351;"></span> <code>#2B3351</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.347 / 14.288 / 11.038 / 9.857 | 適合 | 確認事項なし | 未知のテーマへ視線を伸ばす深い青紫。 |
| `palette-single-intellectimagination-high-2` | 閃きを象徴する星影の紫 | <span role="img" aria-label="primary color #7567A8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7567A8;"></span> <code>#7567A8</code><br><span role="img" aria-label="secondary color #B59AA0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B59AA0;"></span> <code>#B59AA0</code><br><span role="img" aria-label="accent color #7E6077" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7E6077;"></span> <code>#7E6077</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E9E7F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E9E7F1;"></span> <code>#E9E7F1</code><br><span role="img" aria-label="surface color #F8F5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F5F6;"></span> <code>#F8F5F6</code><br><span role="img" aria-label="accent color #453541" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#453541;"></span> <code>#453541</code><br><span role="img" aria-label="chart color #40395C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#40395C;"></span> <code>#40395C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.684 / 14.323 / 10.542 / 8.768 | 適合 | 確認事項なし | 発想や概念が広がる星図のような色。 |
| `palette-single-intellectimagination-high-3` | 未知への好奇心を誘うターコイズ | <span role="img" aria-label="primary color #4FA8B8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4FA8B8;"></span> <code>#4FA8B8</code><br><span role="img" aria-label="secondary color #98ADCA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#98ADCA;"></span> <code>#98ADCA</code><br><span role="img" aria-label="accent color #597D98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#597D98;"></span> <code>#597D98</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E3F1F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E3F1F4;"></span> <code>#E3F1F4</code><br><span role="img" aria-label="surface color #F5F7FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F7FA;"></span> <code>#F5F7FA</code><br><span role="img" aria-label="accent color #314554" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#314554;"></span> <code>#314554</code><br><span role="img" aria-label="chart color #2B5C65" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B5C65;"></span> <code>#2B5C65</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.415 / 14.459 / 9.274 / 6.434 | 適合 | 確認事項なし | 新しい着想がひらく瞬間を思わせる色。 |
| `palette-single-intellectimagination-low-1` | 大地の温もりを宿す茶色 | <span role="img" aria-label="primary color #8C735B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C735B;"></span> <code>#8C735B</code><br><span role="img" aria-label="secondary color #9EA997" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9EA997;"></span> <code>#9EA997</code><br><span role="img" aria-label="accent color #6E715F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E715F;"></span> <code>#6E715F</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EDE9E5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EDE9E5;"></span> <code>#EDE9E5</code><br><span role="img" aria-label="surface color #F5F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F6F5;"></span> <code>#F5F6F5</code><br><span role="img" aria-label="accent color #3D3E34" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D3E34;"></span> <code>#3D3E34</code><br><span role="img" aria-label="chart color #4D3F32" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D3F32;"></span> <code>#4D3F32</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.849 / 14.323 / 10.007 / 8.389 | 適合 | 確認事項なし | 具体的な手ざわりと足元の道を表す色。 |
| `palette-single-intellectimagination-low-2` | 柔らかな陽だまりのグレージュ | <span role="img" aria-label="primary color #8B8D88" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8D88;"></span> <code>#8B8D88</code><br><span role="img" aria-label="secondary color #BCA895" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BCA895;"></span> <code>#BCA895</code><br><span role="img" aria-label="accent color #897367" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#897367;"></span> <code>#897367</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #ECEDEC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ECEDEC;"></span> <code>#ECEDEC</code><br><span role="img" aria-label="surface color #F8F6F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F6F4;"></span> <code>#F8F6F4</code><br><span role="img" aria-label="accent color #4B3F39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B3F39;"></span> <code>#4B3F39</code><br><span role="img" aria-label="chart color #4C4E4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C4E4B;"></span> <code>#4C4E4B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.221 / 14.394 / 9.414 / 7.160 | 適合 | 確認事項なし | 確かめられるものを一つずつ辿る印象。 |
| `palette-single-intellectimagination-low-3` | 落ち着いたモスグリーン | <span role="img" aria-label="primary color #5F8457" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5F8457;"></span> <code>#5F8457</code><br><span role="img" aria-label="secondary color #9DA0A8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9DA0A8;"></span> <code>#9DA0A8</code><br><span role="img" aria-label="accent color #616B67" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#616B67;"></span> <code>#616B67</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E5EBE4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E5EBE4;"></span> <code>#E5EBE4</code><br><span role="img" aria-label="surface color #F5F6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F6F6;"></span> <code>#F5F6F6</code><br><span role="img" aria-label="accent color #353B39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#353B39;"></span> <code>#353B39</code><br><span role="img" aria-label="chart color #344930" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#344930;"></span> <code>#344930</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.810 / 14.332 / 10.564 / 8.094 | 適合 | 確認事項なし | 身近な経験や現実感を象徴する落ち着いた緑。 |
| `palette-single-conscientiousness-high-1` | 規律ある濃紺 | <span role="img" aria-label="primary color #40566F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#40566F;"></span> <code>#40566F</code><br><span role="img" aria-label="secondary color #839F9E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#839F9E;"></span> <code>#839F9E</code><br><span role="img" aria-label="accent color #486369" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#486369;"></span> <code>#486369</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E0E4E8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E0E4E8;"></span> <code>#E0E4E8</code><br><span role="img" aria-label="surface color #F3F5F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F5F5;"></span> <code>#F3F5F5</code><br><span role="img" aria-label="accent color #28363A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#28363A;"></span> <code>#28363A</code><br><span role="img" aria-label="chart color #232F3D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#232F3D;"></span> <code>#232F3D</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.142 / 14.181 / 11.430 / 10.633 | 適合 | 確認事項なし | 計画や段取りを整える端正な印象。 |
| `palette-single-conscientiousness-high-2` | 静止した空気のグレー | <span role="img" aria-label="primary color #6986A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6986A3;"></span> <code>#6986A3</code><br><span role="img" aria-label="secondary color #B1A59E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B1A59E;"></span> <code>#B1A59E</code><br><span role="img" aria-label="accent color #786F75" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#786F75;"></span> <code>#786F75</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E7ECF0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E7ECF0;"></span> <code>#E7ECF0</code><br><span role="img" aria-label="surface color #F7F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F6F5;"></span> <code>#F7F6F5</code><br><span role="img" aria-label="accent color #423D40" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#423D40;"></span> <code>#423D40</code><br><span role="img" aria-label="chart color #3A4A5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A4A5A;"></span> <code>#3A4A5A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.045 / 14.377 / 9.860 / 7.652 | 適合 | 確認事項なし | 区切りと見通しを感じさせる実務的な青。 |
| `palette-single-conscientiousness-high-3` | 誠実な白磁色 | <span role="img" aria-label="primary color #B5A786" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B5A786;"></span> <code>#B5A786</code><br><span role="img" aria-label="secondary color #BCACB8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BCACB8;"></span> <code>#BCACB8</code><br><span role="img" aria-label="accent color #8C7C7F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C7C7F;"></span> <code>#8C7C7F</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F1EC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F1EC;"></span> <code>#F3F1EC</code><br><span role="img" aria-label="surface color #F8F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F8;"></span> <code>#F8F7F8</code><br><span role="img" aria-label="accent color #4D4446" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D4446;"></span> <code>#4D4446</code><br><span role="img" aria-label="chart color #645C4A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#645C4A;"></span> <code>#645C4A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.747 / 14.521 / 8.809 / 5.866 | 適合 | 確認事項なし | 秩序立てて積み重ねる姿を表す色。 |
| `palette-single-conscientiousness-low-1` | 自由な風のスカイブルー | <span role="img" aria-label="primary color #4F9C98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F9C98;"></span> <code>#4F9C98</code><br><span role="img" aria-label="secondary color #88B7AD" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#88B7AD;"></span> <code>#88B7AD</code><br><span role="img" aria-label="accent color #4F867E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F867E;"></span> <code>#4F867E</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E3EFEF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E3EFEF;"></span> <code>#E3EFEF</code><br><span role="img" aria-label="surface color #F3F8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F8F7;"></span> <code>#F3F8F7</code><br><span role="img" aria-label="accent color #2B4A45" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B4A45;"></span> <code>#2B4A45</code><br><span role="img" aria-label="chart color #2B5654" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B5654;"></span> <code>#2B5654</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.197 / 14.469 / 9.031 / 6.971 | 適合 | 確認事項なし | 流れに応じて方向を変える軽やかな青緑。 |
| `palette-single-conscientiousness-low-2` | 移ろいゆく風の若草色 | <span role="img" aria-label="primary color #7FA36B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7FA36B;"></span> <code>#7FA36B</code><br><span role="img" aria-label="secondary color #B8AF8B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B8AF8B;"></span> <code>#B8AF8B</code><br><span role="img" aria-label="accent color #837E59" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#837E59;"></span> <code>#837E59</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EBF0E7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EBF0E7;"></span> <code>#EBF0E7</code><br><span role="img" aria-label="surface color #F8F7F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F3;"></span> <code>#F8F7F3</code><br><span role="img" aria-label="accent color #484531" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#484531;"></span> <code>#484531</code><br><span role="img" aria-label="chart color #465A3B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#465A3B;"></span> <code>#465A3B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.412 / 14.476 / 9.023 / 6.515 | 適合 | 確認事項なし | 決めすぎず自然に進む柔軟な印象。 |
| `palette-single-conscientiousness-low-3` | 軽やかな雲のサンドベージュ | <span role="img" aria-label="primary color #C2AA84" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C2AA84;"></span> <code>#C2AA84</code><br><span role="img" aria-label="secondary color #C0ADB7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C0ADB7;"></span> <code>#C0ADB7</code><br><span role="img" aria-label="accent color #927E7E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#927E7E;"></span> <code>#927E7E</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F1EB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F1EB;"></span> <code>#F5F1EB</code><br><span role="img" aria-label="surface color #F9F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F8;"></span> <code>#F9F7F8</code><br><span role="img" aria-label="accent color #504545" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#504545;"></span> <code>#504545</code><br><span role="img" aria-label="chart color #6B5E49" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B5E49;"></span> <code>#6B5E49</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.792 / 14.548 / 8.641 / 5.618 | 適合 | 確認事項なし | 行き先を固定しない広い余白を象徴する色。 |
| `palette-single-extraversion-high-1` | 陽気なコーラルピンク | <span role="img" aria-label="primary color #E07868" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E07868;"></span> <code>#E07868</code><br><span role="img" aria-label="secondary color #BBAB9C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BBAB9C;"></span> <code>#BBAB9C</code><br><span role="img" aria-label="accent color #987466" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#987466;"></span> <code>#987466</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAE9E7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAE9E7;"></span> <code>#FAE9E7</code><br><span role="img" aria-label="surface color #F8F7F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F5;"></span> <code>#F8F7F5</code><br><span role="img" aria-label="accent color #544038" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#544038;"></span> <code>#544038</code><br><span role="img" aria-label="chart color #7B4239" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7B4239;"></span> <code>#7B4239</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.208 / 14.494 / 9.049 / 6.668 | 適合 | 確認事項なし | 人の輪へ自然に進む温かい活気。 |
| `palette-single-extraversion-high-2` | 活気に満ちたオレンジ | <span role="img" aria-label="primary color #E69A4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E69A4B;"></span> <code>#E69A4B</code><br><span role="img" aria-label="secondary color #DCAC80" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DCAC80;"></span> <code>#DCAC80</code><br><span role="img" aria-label="accent color #B77949" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B77949;"></span> <code>#B77949</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FBEFE2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBEFE2;"></span> <code>#FBEFE2</code><br><span role="img" aria-label="surface color #FCF7F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FCF7F2;"></span> <code>#FCF7F2</code><br><span role="img" aria-label="accent color #654328" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#654328;"></span> <code>#654328</code><br><span role="img" aria-label="chart color #7F5529" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7F5529;"></span> <code>#7F5529</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.705 / 14.576 / 8.264 / 5.735 | 適合 | 確認事項なし | にぎわいと開放感を表す明るい色。 |
| `palette-single-extraversion-high-3` | 交流をひらくターコイズ | <span role="img" aria-label="primary color #38A8A0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#38A8A0;"></span> <code>#38A8A0</code><br><span role="img" aria-label="secondary color #90ADC1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#90ADC1;"></span> <code>#90ADC1</code><br><span role="img" aria-label="accent color #4D7D8C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D7D8C;"></span> <code>#4D7D8C</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #DFF1F0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DFF1F0;"></span> <code>#DFF1F0</code><br><span role="img" aria-label="surface color #F4F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F7F9;"></span> <code>#F4F7F9</code><br><span role="img" aria-label="accent color #2A454D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2A454D;"></span> <code>#2A454D</code><br><span role="img" aria-label="chart color #1F5C58" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F5C58;"></span> <code>#1F5C58</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.285 / 14.423 / 9.490 / 6.585 | 適合 | 確認事項なし | 交流の流れと軽快さを象徴する青緑。 |
| `palette-single-extraversion-low-1` | 深い夜のミッドナイトブルー | <span role="img" aria-label="primary color #394A63" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#394A63;"></span> <code>#394A63</code><br><span role="img" aria-label="secondary color #819B9A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#819B9A;"></span> <code>#819B9A</code><br><span role="img" aria-label="accent color #445D63" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#445D63;"></span> <code>#445D63</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #DFE2E6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DFE2E6;"></span> <code>#DFE2E6</code><br><span role="img" aria-label="surface color #F2F5F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F2F5F5;"></span> <code>#F2F5F5</code><br><span role="img" aria-label="accent color #253336" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#253336;"></span> <code>#253336</code><br><span role="img" aria-label="chart color #1F2936" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2936;"></span> <code>#1F2936</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 11.940 / 14.154 / 11.931 / 11.310 | 適合 | 確認事項なし | 静かな環境に長く留まる深い青。 |
| `palette-single-extraversion-low-2` | 静寂を纏うシルバーグレー | <span role="img" aria-label="primary color #596F86" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#596F86;"></span> <code>#596F86</code><br><span role="img" aria-label="secondary color #AB9D94" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#AB9D94;"></span> <code>#AB9D94</code><br><span role="img" aria-label="accent color #706466" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#706466;"></span> <code>#706466</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E4E8EC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E4E8EC;"></span> <code>#E4E8EC</code><br><span role="img" aria-label="surface color #F7F5F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F5F4;"></span> <code>#F7F5F4</code><br><span role="img" aria-label="accent color #3E3738" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3E3738;"></span> <code>#3E3738</code><br><span role="img" aria-label="chart color #313D4A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#313D4A;"></span> <code>#313D4A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.601 / 14.278 / 10.685 / 8.989 | 適合 | 確認事項なし | 外を眺めながら内側を整える色。 |
| `palette-single-extraversion-low-3` | 落ち着いた藤色 | <span role="img" aria-label="primary color #8B58A6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B58A6;"></span> <code>#8B58A6</code><br><span role="img" aria-label="secondary color #AD91C3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#AD91C3;"></span> <code>#AD91C3</code><br><span role="img" aria-label="accent color #77558F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#77558F;"></span> <code>#77558F</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #ECE4F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ECE4F1;"></span> <code>#ECE4F1</code><br><span role="img" aria-label="surface color #F7F4F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F4F9;"></span> <code>#F7F4F9</code><br><span role="img" aria-label="accent color #412F4F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#412F4F;"></span> <code>#412F4F</code><br><span role="img" aria-label="chart color #4C305B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C305B;"></span> <code>#4C305B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.513 / 14.234 / 11.044 / 9.002 | 適合 | 確認事項なし | 控えめな存在感と落ち着きを表す紫灰。 |
| `palette-single-agreeableness-high-1` | 温かなパステルピンク | <span role="img" aria-label="primary color #C98591" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C98591;"></span> <code>#C98591</code><br><span role="img" aria-label="secondary color #B3AFAA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B3AFAA;"></span> <code>#B3AFAA</code><br><span role="img" aria-label="accent color #8C7A7A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C7A7A;"></span> <code>#8C7A7A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6EBED" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6EBED;"></span> <code>#F6EBED</code><br><span role="img" aria-label="surface color #F7F7F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7F7;"></span> <code>#F7F7F7</code><br><span role="img" aria-label="accent color #4D4343" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D4343;"></span> <code>#4D4343</code><br><span role="img" aria-label="chart color #6F4950" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F4950;"></span> <code>#6F4950</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.319 / 14.485 / 8.912 / 6.567 | 適合 | 確認事項なし | 歩幅を合わせる温かな関わりを象徴。 |
| `palette-single-agreeableness-high-2` | 包容力のあるミントグリーン | <span role="img" aria-label="primary color #91A98F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#91A98F;"></span> <code>#91A98F</code><br><span role="img" aria-label="secondary color #BFB197" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BFB197;"></span> <code>#BFB197</code><br><span role="img" aria-label="accent color #8C816B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C816B;"></span> <code>#8C816B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EDF1ED" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EDF1ED;"></span> <code>#EDF1ED</code><br><span role="img" aria-label="surface color #F9F7F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F5;"></span> <code>#F9F7F5</code><br><span role="img" aria-label="accent color #4D473B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D473B;"></span> <code>#4D473B</code><br><span role="img" aria-label="chart color #505D4F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#505D4F;"></span> <code>#505D4F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.601 / 14.521 / 8.619 / 6.095 | 適合 | 確認事項なし | 周囲との調和をやわらかく支える緑。 |
| `palette-single-agreeableness-high-3` | 穏やかなアイボリー | <span role="img" aria-label="primary color #C8B49A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C8B49A;"></span> <code>#C8B49A</code><br><span role="img" aria-label="secondary color #C2B1BF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C2B1BF;"></span> <code>#C2B1BF</code><br><span role="img" aria-label="accent color #958389" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#958389;"></span> <code>#958389</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F3EF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F3EF;"></span> <code>#F6F3EF</code><br><span role="img" aria-label="surface color #F9F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F9;"></span> <code>#F9F7F9</code><br><span role="img" aria-label="accent color #52484B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#52484B;"></span> <code>#52484B</code><br><span role="img" aria-label="chart color #6E6355" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E6355;"></span> <code>#6E6355</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.029 / 14.557 / 8.252 / 5.305 | 適合 | 確認事項なし | 相手を受け止める穏やかな印象。 |
| `palette-single-agreeableness-low-1` | 意志ある深い赤 | <span role="img" aria-label="primary color #A65F4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A65F4B;"></span> <code>#A65F4B</code><br><span role="img" aria-label="secondary color #A7A292" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A7A292;"></span> <code>#A7A292</code><br><span role="img" aria-label="accent color #7B6757" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7B6757;"></span> <code>#7B6757</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F1E5E2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F1E5E2;"></span> <code>#F1E5E2</code><br><span role="img" aria-label="surface color #F6F6F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F6F4;"></span> <code>#F6F6F4</code><br><span role="img" aria-label="accent color #443930" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#443930;"></span> <code>#443930</code><br><span role="img" aria-label="chart color #5B3429" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5B3429;"></span> <code>#5B3429</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.596 / 14.341 / 10.358 / 8.661 | 適合 | 確認事項なし | 自分の歩幅を保つ確かな存在感。 |
| `palette-single-agreeableness-low-2` | 独立心を示す深いブルーグレー | <span role="img" aria-label="primary color #495A72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#495A72;"></span> <code>#495A72</code><br><span role="img" aria-label="secondary color #A5968D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A5968D;"></span> <code>#A5968D</code><br><span role="img" aria-label="accent color #68595C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#68595C;"></span> <code>#68595C</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E2E5E8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E2E5E8;"></span> <code>#E2E5E8</code><br><span role="img" aria-label="surface color #F6F5F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F5F4;"></span> <code>#F6F5F4</code><br><span role="img" aria-label="accent color #393133" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#393133;"></span> <code>#393133</code><br><span role="img" aria-label="chart color #28323F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#28323F;"></span> <code>#28323F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.271 / 14.251 / 11.610 / 10.262 | 適合 | 確認事項なし | 自分の基準や距離感を示す青。 |
| `palette-single-agreeableness-low-3` | 揺るがない鉄錆色 | <span role="img" aria-label="primary color #B58A4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B58A4C;"></span> <code>#B58A4C</code><br><span role="img" aria-label="secondary color #BCA2A4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BCA2A4;"></span> <code>#BCA2A4</code><br><span role="img" aria-label="accent color #8C6E62" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C6E62;"></span> <code>#8C6E62</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3ECE2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3ECE2;"></span> <code>#F3ECE2</code><br><span role="img" aria-label="surface color #F8F6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F6F6;"></span> <code>#F8F6F6</code><br><span role="img" aria-label="accent color #4D3D36" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D3D36;"></span> <code>#4D3D36</code><br><span role="img" aria-label="chart color #644C2A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#644C2A;"></span> <code>#644C2A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.232 / 14.413 / 9.578 / 6.863 | 適合 | 確認事項なし | 率直さと現実的な判断を思わせる色。 |
| `palette-single-emotionalstability-high-1` | 凪いだ海の深い青 | <span role="img" aria-label="primary color #5F86A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5F86A3;"></span> <code>#5F86A3</code><br><span role="img" aria-label="secondary color #8EB0B1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8EB0B1;"></span> <code>#8EB0B1</code><br><span role="img" aria-label="accent color #577B83" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#577B83;"></span> <code>#577B83</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E5ECF0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E5ECF0;"></span> <code>#E5ECF0</code><br><span role="img" aria-label="surface color #F4F7F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F7F7;"></span> <code>#F4F7F7</code><br><span role="img" aria-label="accent color #304448" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#304448;"></span> <code>#304448</code><br><span role="img" aria-label="chart color #344A5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#344A5A;"></span> <code>#344A5A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.996 / 14.405 / 9.527 / 7.737 | 適合 | 確認事項なし | 波立ちの少ない水面を思わせる青。 |
| `palette-single-emotionalstability-high-2` | 安らぎを運ぶ淡い水色 | <span role="img" aria-label="primary color #405D73" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#405D73;"></span> <code>#405D73</code><br><span role="img" aria-label="secondary color #A2978E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A2978E;"></span> <code>#A2978E</code><br><span role="img" aria-label="accent color #645B5D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#645B5D;"></span> <code>#645B5D</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E0E5E9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E0E5E9;"></span> <code>#E0E5E9</code><br><span role="img" aria-label="surface color #F6F5F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F5F4;"></span> <code>#F6F5F4</code><br><span role="img" aria-label="accent color #373233" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#373233;"></span> <code>#373233</code><br><span role="img" aria-label="chart color #23333F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#23333F;"></span> <code>#23333F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.232 / 14.251 / 11.573 / 10.239 | 適合 | 確認事項なし | 落ち着いて進む航路を象徴する色。 |
| `palette-single-emotionalstability-high-3` | 静穏な青磁色 | <span role="img" aria-label="primary color #41966E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#41966E;"></span> <code>#41966E</code><br><span role="img" aria-label="secondary color #93A6B0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#93A6B0;"></span> <code>#93A6B0</code><br><span role="img" aria-label="accent color #527473" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#527473;"></span> <code>#527473</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E1EEE8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E1EEE8;"></span> <code>#E1EEE8</code><br><span role="img" aria-label="surface color #F4F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F6F7;"></span> <code>#F4F6F7</code><br><span role="img" aria-label="accent color #2D403F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2D403F;"></span> <code>#2D403F</code><br><span role="img" aria-label="chart color #24533D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#24533D;"></span> <code>#24533D</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.003 / 14.315 / 10.107 / 7.394 | 適合 | 確認事項なし | 穏やかな持続感を表す青緑。 |
| `palette-single-emotionalstability-low-1` | 移ろう光の淡い紫 | <span role="img" aria-label="primary color #9A83AD" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A83AD;"></span> <code>#9A83AD</code><br><span role="img" aria-label="secondary color #A2AFB4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A2AFB4;"></span> <code>#A2AFB4</code><br><span role="img" aria-label="accent color #757988" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#757988;"></span> <code>#757988</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EFEBF2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EFEBF2;"></span> <code>#EFEBF2</code><br><span role="img" aria-label="surface color #F6F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F8;"></span> <code>#F6F7F8</code><br><span role="img" aria-label="accent color #40434B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#40434B;"></span> <code>#40434B</code><br><span role="img" aria-label="chart color #55485F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#55485F;"></span> <code>#55485F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.179 / 14.467 / 9.224 / 7.196 | 適合 | 確認事項なし | 小さな変化を受け取る繊細な紫。 |
| `palette-single-emotionalstability-low-2` | 揺れる水面の淡い青 | <span role="img" aria-label="primary color #86A8B8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#86A8B8;"></span> <code>#86A8B8</code><br><span role="img" aria-label="secondary color #BBB1A6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BBB1A6;"></span> <code>#BBB1A6</code><br><span role="img" aria-label="accent color #87807F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#87807F;"></span> <code>#87807F</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #ECF1F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ECF1F4;"></span> <code>#ECF1F4</code><br><span role="img" aria-label="surface color #F8F7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F6;"></span> <code>#F8F7F6</code><br><span role="img" aria-label="accent color #4A4646" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A4646;"></span> <code>#4A4646</code><br><span role="img" aria-label="chart color #4A5C65" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A5C65;"></span> <code>#4A5C65</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.637 / 14.503 / 8.701 / 6.131 | 適合 | 確認事項なし | 周囲の気配に振り向く軽い青。 |
| `palette-single-emotionalstability-low-3` | 繊細な薄紅色の花びら | <span role="img" aria-label="primary color #C99AA3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C99AA3;"></span> <code>#C99AA3</code><br><span role="img" aria-label="secondary color #C3A8C2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C3A8C2;"></span> <code>#C3A8C2</code><br><span role="img" aria-label="accent color #96768D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#96768D;"></span> <code>#96768D</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6EFF0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6EFF0;"></span> <code>#F6EFF0</code><br><span role="img" aria-label="surface color #F9F6F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F6F9;"></span> <code>#F9F6F9</code><br><span role="img" aria-label="accent color #53414E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#53414E;"></span> <code>#53414E</code><br><span role="img" aria-label="chart color #6F555A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F555A;"></span> <code>#6F555A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.688 / 14.467 / 8.764 / 5.931 | 適合 | 確認事項なし | 細やかな反応をやわらかく表す色。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-high-1` | 星夜の深い紺 | <span role="img" aria-label="primary color #344A72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#344A72;"></span> <code>#344A72</code><br><span role="img" aria-label="secondary color #7F9BA0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7F9BA0;"></span> <code>#7F9BA0</code><br><span role="img" aria-label="accent color #425D6B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#425D6B;"></span> <code>#425D6B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #DFE2E8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DFE2E8;"></span> <code>#DFE2E8</code><br><span role="img" aria-label="surface color #F2F5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F2F5F6;"></span> <code>#F2F5F6</code><br><span role="img" aria-label="accent color #24333B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#24333B;"></span> <code>#24333B</code><br><span role="img" aria-label="chart color #1D293F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1D293F;"></span> <code>#1D293F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 11.957 / 14.163 / 11.893 / 11.228 | 適合 | 確認事項なし | 構想と記録を同時に支える深い青。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-high-2` | 精緻な記録の黄金色 | <span role="img" aria-label="primary color #B8954F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B8954F;"></span> <code>#B8954F</code><br><span role="img" aria-label="secondary color #CCAA81" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#CCAA81;"></span> <code>#CCAA81</code><br><span role="img" aria-label="accent color #A0774B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A0774B;"></span> <code>#A0774B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4EEE3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4EEE3;"></span> <code>#F4EEE3</code><br><span role="img" aria-label="surface color #FAF7F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF7F2;"></span> <code>#FAF7F2</code><br><span role="img" aria-label="accent color #584129" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#584129;"></span> <code>#584129</code><br><span role="img" aria-label="chart color #65522B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#65522B;"></span> <code>#65522B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.438 / 14.521 / 8.920 / 6.506 | 適合 | 確認事項なし | 印を置き積み重ねる行為を象徴。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-high-3` | 冷静な思考の白 | <span role="img" aria-label="primary color #665B94" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665B94;"></span> <code>#665B94</code><br><span role="img" aria-label="secondary color #A092BD" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A092BD;"></span> <code>#A092BD</code><br><span role="img" aria-label="accent color #645686" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#645686;"></span> <code>#645686</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E7E5EE" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E7E5EE;"></span> <code>#E7E5EE</code><br><span role="img" aria-label="surface color #F6F4F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F8;"></span> <code>#F6F4F8</code><br><span role="img" aria-label="accent color #372F4A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#372F4A;"></span> <code>#372F4A</code><br><span role="img" aria-label="chart color #383251" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#383251;"></span> <code>#383251</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.444 / 14.198 / 11.520 / 9.660 | 適合 | 確認事項なし | 発想を構造へ落とし込む紫。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-low-1` | 夢幻的なペールバイオレット | <span role="img" aria-label="primary color #9A83C1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A83C1;"></span> <code>#9A83C1</code><br><span role="img" aria-label="secondary color #A2AFBB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A2AFBB;"></span> <code>#A2AFBB</code><br><span role="img" aria-label="accent color #757992" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#757992;"></span> <code>#757992</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EFEBF5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EFEBF5;"></span> <code>#EFEBF5</code><br><span role="img" aria-label="surface color #F6F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F8;"></span> <code>#F6F7F8</code><br><span role="img" aria-label="accent color #404350" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#404350;"></span> <code>#404350</code><br><span role="img" aria-label="chart color #55486A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#55486A;"></span> <code>#55486A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.206 / 14.467 / 9.163 / 7.088 | 適合 | 確認事項なし | 自由に広がる想像の余白。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-low-2` | 自由な空の淡い青 | <span role="img" aria-label="primary color #6F9FBB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F9FBB;"></span> <code>#6F9FBB</code><br><span role="img" aria-label="secondary color #B3AEA7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B3AEA7;"></span> <code>#B3AEA7</code><br><span role="img" aria-label="accent color #7B7C81" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7B7C81;"></span> <code>#7B7C81</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E8F0F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E8F0F4;"></span> <code>#E8F0F4</code><br><span role="img" aria-label="surface color #F7F7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7F6;"></span> <code>#F7F7F6</code><br><span role="img" aria-label="accent color #444447" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#444447;"></span> <code>#444447</code><br><span role="img" aria-label="chart color #3D5767" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D5767;"></span> <code>#3D5767</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.450 / 14.476 / 9.054 / 6.601 | 適合 | 確認事項なし | 形を変えながら流れる発想を表す青。 |
| `palette-pair-intellectimagination-high-and-conscientiousness-low-3` | 想像力を刺激するミントグリーン | <span role="img" aria-label="primary color #7FB7A5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7FB7A5;"></span> <code>#7FB7A5</code><br><span role="img" aria-label="secondary color #A9B2C3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A9B2C3;"></span> <code>#A9B2C3</code><br><span role="img" aria-label="accent color #71848E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#71848E;"></span> <code>#71848E</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EBF3F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EBF3F1;"></span> <code>#EBF3F1</code><br><span role="img" aria-label="surface color #F6F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F9;"></span> <code>#F6F7F9</code><br><span role="img" aria-label="accent color #3E494E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3E494E;"></span> <code>#3E494E</code><br><span role="img" aria-label="chart color #46655B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#46655B;"></span> <code>#46655B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.761 / 14.476 / 8.638 / 5.690 | 適合 | 確認事項なし | 軽やかに方向を変える青緑。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-high-1` | 実直なオリーブ色 | <span role="img" aria-label="primary color #7C875A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7C875A;"></span> <code>#7C875A</code><br><span role="img" aria-label="secondary color #98B097" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#98B097;"></span> <code>#98B097</code><br><span role="img" aria-label="accent color #667B5F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#667B5F;"></span> <code>#667B5F</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EAECE5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EAECE5;"></span> <code>#EAECE5</code><br><span role="img" aria-label="surface color #F5F7F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F7F5;"></span> <code>#F5F7F5</code><br><span role="img" aria-label="accent color #384434" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#384434;"></span> <code>#384434</code><br><span role="img" aria-label="chart color #444A32" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#444A32;"></span> <code>#444A32</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.026 / 14.413 / 9.540 / 7.761 | 適合 | 確認事項なし | 具体的な歩みを着実に重ねる色。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-high-2` | 誠実な土のブラウン | <span role="img" aria-label="primary color #A5684F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A5684F;"></span> <code>#A5684F</code><br><span role="img" aria-label="secondary color #C69B81" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C69B81;"></span> <code>#C69B81</code><br><span role="img" aria-label="accent color #96604B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#96604B;"></span> <code>#96604B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F1E7E3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F1E7E3;"></span> <code>#F1E7E3</code><br><span role="img" aria-label="surface color #F9F5F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F5F2;"></span> <code>#F9F5F2</code><br><span role="img" aria-label="accent color #533529" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#533529;"></span> <code>#533529</code><br><span role="img" aria-label="chart color #5B392B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5B392B;"></span> <code>#5B392B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.769 / 14.314 / 10.147 / 8.368 | 適合 | 確認事項なし | 手を動かし続ける実直な印象。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-high-3` | 飾らないストーングレー | <span role="img" aria-label="primary color #94928A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#94928A;"></span> <code>#94928A</code><br><span role="img" aria-label="secondary color #B0A5B9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B0A5B9;"></span> <code>#B0A5B9</code><br><span role="img" aria-label="accent color #7B7281" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7B7281;"></span> <code>#7B7281</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EEEEEC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EEEEEC;"></span> <code>#EEEEEC</code><br><span role="img" aria-label="surface color #F7F6F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F6F8;"></span> <code>#F7F6F8</code><br><span role="img" aria-label="accent color #443F47" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#443F47;"></span> <code>#443F47</code><br><span role="img" aria-label="chart color #51504C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#51504C;"></span> <code>#51504C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.357 / 14.404 / 9.519 / 6.948 | 適合 | 確認事項なし | 飾らず続ける姿勢を象徴。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-low-1` | 陽光を浴びた淡い黄色 | <span role="img" aria-label="primary color #D4B64C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D4B64C;"></span> <code>#D4B64C</code><br><span role="img" aria-label="secondary color #B7C092" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B7C092;"></span> <code>#B7C092</code><br><span role="img" aria-label="accent color #929358" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#929358;"></span> <code>#929358</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F8F3E2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F3E2;"></span> <code>#F8F3E2</code><br><span role="img" aria-label="surface color #F8F9F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9F4;"></span> <code>#F8F9F4</code><br><span role="img" aria-label="accent color #505130" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#505130;"></span> <code>#505130</code><br><span role="img" aria-label="chart color #75642A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#75642A;"></span> <code>#75642A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.973 / 14.666 / 7.751 / 5.234 | 適合 | 確認事項なし | 気ままに歩く道の余白。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-low-2` | 気ままな風のミントグリーン | <span role="img" aria-label="primary color #7CAB8A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7CAB8A;"></span> <code>#7CAB8A</code><br><span role="img" aria-label="secondary color #B7B296" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B7B296;"></span> <code>#B7B296</code><br><span role="img" aria-label="accent color #828268" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#828268;"></span> <code>#828268</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EAF2EC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EAF2EC;"></span> <code>#EAF2EC</code><br><span role="img" aria-label="surface color #F8F7F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F5;"></span> <code>#F8F7F5</code><br><span role="img" aria-label="accent color #484839" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#484839;"></span> <code>#484839</code><br><span role="img" aria-label="chart color #445E4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#445E4C;"></span> <code>#445E4C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.604 / 14.494 / 8.673 / 6.238 | 適合 | 確認事項なし | その場の流れへ自然に馴染む色。 |
| `palette-pair-intellectimagination-low-and-conscientiousness-low-3` | 柔らかな砂の色 | <span role="img" aria-label="primary color #B6A184" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B6A184;"></span> <code>#B6A184</code><br><span role="img" aria-label="secondary color #BCAAB7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BCAAB7;"></span> <code>#BCAAB7</code><br><span role="img" aria-label="accent color #8C797E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C797E;"></span> <code>#8C797E</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F0EB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F0EB;"></span> <code>#F3F0EB</code><br><span role="img" aria-label="surface color #F8F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F8;"></span> <code>#F8F7F8</code><br><span role="img" aria-label="accent color #4D4345" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D4345;"></span> <code>#4D4345</code><br><span role="img" aria-label="chart color #645949" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#645949;"></span> <code>#645949</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.652 / 14.521 / 8.915 / 6.024 | 適合 | 確認事項なし | 決めすぎない穏やかな移動感。 |
| `palette-pair-intellectimagination-high-and-extraversion-high-1` | 鮮やかなターコイズブルー | <span role="img" aria-label="primary color #27A9B8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#27A9B8;"></span> <code>#27A9B8</code><br><span role="img" aria-label="secondary color #7ABCB8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7ABCB8;"></span> <code>#7ABCB8</code><br><span role="img" aria-label="accent color #3B8C8E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3B8C8E;"></span> <code>#3B8C8E</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #DCF1F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DCF1F4;"></span> <code>#DCF1F4</code><br><span role="img" aria-label="surface color #F2F8F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F2F8F8;"></span> <code>#F2F8F8</code><br><span role="img" aria-label="accent color #204D4E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#204D4E;"></span> <code>#204D4E</code><br><span role="img" aria-label="chart color #155D65" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#155D65;"></span> <code>#155D65</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.250 / 14.452 / 8.759 / 6.437 | 適合 | 確認事項なし | 新しい考えを外へ運ぶ鮮やかな青。 |
| `palette-pair-intellectimagination-high-and-extraversion-high-2` | 活力を運ぶオレンジゴールド | <span role="img" aria-label="primary color #DF7168" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DF7168;"></span> <code>#DF7168</code><br><span role="img" aria-label="secondary color #DA9E8A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DA9E8A;"></span> <code>#DA9E8A</code><br><span role="img" aria-label="accent color #B36557" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B36557;"></span> <code>#B36557</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAE8E7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAE8E7;"></span> <code>#FAE8E7</code><br><span role="img" aria-label="surface color #FBF5F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF5F3;"></span> <code>#FBF5F3</code><br><span role="img" aria-label="accent color #623830" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#623830;"></span> <code>#623830</code><br><span role="img" aria-label="chart color #7B3E39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7B3E39;"></span> <code>#7B3E39</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.125 / 14.378 / 9.145 / 6.857 | 適合 | 確認事項なし | 言葉や交流の熱を象徴する色。 |
| `palette-pair-intellectimagination-high-and-extraversion-high-3` | 知的な輝きのゴールド | <span role="img" aria-label="primary color #D9B54A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D9B54A;"></span> <code>#D9B54A</code><br><span role="img" aria-label="secondary color #C8B1A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C8B1A3;"></span> <code>#C8B1A3</code><br><span role="img" aria-label="accent color #9E8361" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9E8361;"></span> <code>#9E8361</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9F3E2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F3E2;"></span> <code>#F9F3E2</code><br><span role="img" aria-label="surface color #FAF7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF7F6;"></span> <code>#FAF7F6</code><br><span role="img" aria-label="accent color #574835" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#574835;"></span> <code>#574835</code><br><span role="img" aria-label="chart color #776429" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#776429;"></span> <code>#776429</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.000 / 14.557 / 8.265 / 5.206 | 適合 | 確認事項なし | 着想が人の輪に届く明るさ。 |
| `palette-pair-intellectimagination-high-and-extraversion-low-1` | 静寂を極めた深い黒 | <span role="img" aria-label="primary color #3F4B78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F4B78;"></span> <code>#3F4B78</code><br><span role="img" aria-label="secondary color #839BA2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#839BA2;"></span> <code>#839BA2</code><br><span role="img" aria-label="accent color #475D6E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#475D6E;"></span> <code>#475D6E</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E0E2E9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E0E2E9;"></span> <code>#E0E2E9</code><br><span role="img" aria-label="surface color #F3F5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F5F6;"></span> <code>#F3F5F6</code><br><span role="img" aria-label="accent color #27333D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#27333D;"></span> <code>#27333D</code><br><span role="img" aria-label="chart color #232942" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#232942;"></span> <code>#232942</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 11.989 / 14.190 / 11.801 / 11.057 | 適合 | 確認事項なし | 静かな場所で思索を深める色。 |
| `palette-pair-intellectimagination-high-and-extraversion-low-2` | 宇宙の深淵を映す紫 | <span role="img" aria-label="primary color #665C91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665C91;"></span> <code>#665C91</code><br><span role="img" aria-label="secondary color #AF9798" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#AF9798;"></span> <code>#AF9798</code><br><span role="img" aria-label="accent color #775A6C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#775A6C;"></span> <code>#775A6C</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E7E5ED" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E7E5ED;"></span> <code>#E7E5ED</code><br><span role="img" aria-label="surface color #F7F5F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F5F5;"></span> <code>#F7F5F5</code><br><span role="img" aria-label="accent color #41323B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#41323B;"></span> <code>#41323B</code><br><span role="img" aria-label="chart color #383350" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#383350;"></span> <code>#383350</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.435 / 14.287 / 11.085 / 9.575 | 適合 | 確認事項なし | 内側で広がる星図を思わせる紫。 |
| `palette-pair-intellectimagination-high-and-extraversion-low-3` | 遠い星の淡い光色 | <span role="img" aria-label="primary color #5E91A4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5E91A4;"></span> <code>#5E91A4</code><br><span role="img" aria-label="secondary color #9DA5C3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9DA5C3;"></span> <code>#9DA5C3</code><br><span role="img" aria-label="accent color #60718E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#60718E;"></span> <code>#60718E</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E5EDF0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E5EDF0;"></span> <code>#E5EDF0</code><br><span role="img" aria-label="surface color #F5F6F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F6F9;"></span> <code>#F5F6F9</code><br><span role="img" aria-label="accent color #353E4E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#353E4E;"></span> <code>#353E4E</code><br><span role="img" aria-label="chart color #34505A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#34505A;"></span> <code>#34505A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.082 / 14.360 / 9.963 / 7.252 | 適合 | 確認事項なし | 静寂の中に見つかる新しい視点。 |
| `palette-pair-intellectimagination-low-and-extraversion-high-1` | 賑やかな明るい黄色 | <span role="img" aria-label="primary color #D88A45" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D88A45;"></span> <code>#D88A45</code><br><span role="img" aria-label="secondary color #B8B190" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B8B190;"></span> <code>#B8B190</code><br><span role="img" aria-label="accent color #947D54" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#947D54;"></span> <code>#947D54</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9ECE1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9ECE1;"></span> <code>#F9ECE1</code><br><span role="img" aria-label="surface color #F8F7F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F4;"></span> <code>#F8F7F4</code><br><span role="img" aria-label="accent color #51452E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#51452E;"></span> <code>#51452E</code><br><span role="img" aria-label="chart color #774C26" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#774C26;"></span> <code>#774C26</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.385 / 14.485 / 8.749 / 6.364 | 適合 | 確認事項なし | 身近な話題を囲む温かな活気。 |
| `palette-pair-intellectimagination-low-and-extraversion-high-2` | 親しみやすいアプリコット | <span role="img" aria-label="primary color #D56F67" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D56F67;"></span> <code>#D56F67</code><br><span role="img" aria-label="secondary color #D69D89" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D69D89;"></span> <code>#D69D89</code><br><span role="img" aria-label="accent color #AE6457" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#AE6457;"></span> <code>#AE6457</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F8E8E7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8E8E7;"></span> <code>#F8E8E7</code><br><span role="img" aria-label="surface color #FBF5F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF5F3;"></span> <code>#FBF5F3</code><br><span role="img" aria-label="accent color #603730" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#603730;"></span> <code>#603730</code><br><span role="img" aria-label="chart color #753D39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#753D39;"></span> <code>#753D39</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.070 / 14.378 / 9.325 / 7.124 | 適合 | 確認事項なし | 人と人の距離を縮める明るい色。 |
| `palette-pair-intellectimagination-low-and-extraversion-high-3` | 活気ある明るい緑 | <span role="img" aria-label="primary color #459B98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#459B98;"></span> <code>#459B98</code><br><span role="img" aria-label="secondary color #94A8BE" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#94A8BE;"></span> <code>#94A8BE</code><br><span role="img" aria-label="accent color #547688" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#547688;"></span> <code>#547688</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E1EFEF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E1EFEF;"></span> <code>#E1EFEF</code><br><span role="img" aria-label="surface color #F4F6F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F6F9;"></span> <code>#F4F6F9</code><br><span role="img" aria-label="accent color #2E414B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2E414B;"></span> <code>#2E414B</code><br><span role="img" aria-label="chart color #265554" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#265554;"></span> <code>#265554</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.149 / 14.333 / 9.827 / 7.090 | 適合 | 確認事項なし | にぎわいの中を軽快に行き交う印象。 |
| `palette-pair-intellectimagination-low-and-extraversion-low-1` | 午後の静けさを映すグレー | <span role="img" aria-label="primary color #7A7E82" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7A7E82;"></span> <code>#7A7E82</code><br><span role="img" aria-label="secondary color #97ADA5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#97ADA5;"></span> <code>#97ADA5</code><br><span role="img" aria-label="accent color #657773" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#657773;"></span> <code>#657773</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EAEAEB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EAEAEB;"></span> <code>#EAEAEB</code><br><span role="img" aria-label="surface color #F5F7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F7F6;"></span> <code>#F5F7F6</code><br><span role="img" aria-label="accent color #38413F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#38413F;"></span> <code>#38413F</code><br><span role="img" aria-label="chart color #434548" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#434548;"></span> <code>#434548</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.907 / 14.422 / 9.778 / 8.000 | 適合 | 確認事項なし | 静かな室内と外の景色の境界。 |
| `palette-pair-intellectimagination-low-and-extraversion-low-2` | 穏やかな窓辺の薄青 | <span role="img" aria-label="primary color #4F84A8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F84A8;"></span> <code>#4F84A8</code><br><span role="img" aria-label="secondary color #A7A5A0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A7A5A0;"></span> <code>#A7A5A0</code><br><span role="img" aria-label="accent color #6B6E77" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B6E77;"></span> <code>#6B6E77</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E3EBF1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E3EBF1;"></span> <code>#E3EBF1</code><br><span role="img" aria-label="surface color #F6F6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F6F6;"></span> <code>#F6F6F6</code><br><span role="img" aria-label="accent color #3B3D41" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3B3D41;"></span> <code>#3B3D41</code><br><span role="img" aria-label="chart color #2B495C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B495C;"></span> <code>#2B495C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.872 / 14.359 / 10.069 / 7.881 | 適合 | 確認事項なし | 慣れた場所に留まる落ち着き。 |
| `palette-pair-intellectimagination-low-and-extraversion-low-3` | 静かな時間の色である淡いグレー | <span role="img" aria-label="primary color #B5A89C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B5A89C;"></span> <code>#B5A89C</code><br><span role="img" aria-label="secondary color #BCADC0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BCADC0;"></span> <code>#BCADC0</code><br><span role="img" aria-label="accent color #8C7D8A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C7D8A;"></span> <code>#8C7D8A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3F1EF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F1EF;"></span> <code>#F3F1EF</code><br><span role="img" aria-label="surface color #F8F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F9;"></span> <code>#F8F7F9</code><br><span role="img" aria-label="accent color #4D454C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D454C;"></span> <code>#4D454C</code><br><span role="img" aria-label="chart color #645C56" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#645C56;"></span> <code>#645C56</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.773 / 14.530 / 8.658 / 5.812 | 適合 | 確認事項なし | 身近で具体的な環境を象徴する色。 |
| `palette-pair-intellectimagination-high-and-agreeableness-high-1` | 共鳴し合う淡いピンク | <span role="img" aria-label="primary color #B87C96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B87C96;"></span> <code>#B87C96</code><br><span role="img" aria-label="secondary color #ADACAC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ADACAC;"></span> <code>#ADACAC</code><br><span role="img" aria-label="accent color #84767D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#84767D;"></span> <code>#84767D</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4EAEE" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4EAEE;"></span> <code>#F4EAEE</code><br><span role="img" aria-label="surface color #F7F7F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7F7;"></span> <code>#F7F7F7</code><br><span role="img" aria-label="accent color #494145" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#494145;"></span> <code>#494145</code><br><span role="img" aria-label="chart color #654453" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#654453;"></span> <code>#654453</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.190 / 14.485 / 9.223 / 7.126 | 適合 | 確認事項なし | 相手の考えに響き合う柔らかな色。 |
| `palette-pair-intellectimagination-high-and-agreeableness-high-2` | 包み込むような深い紫 | <span role="img" aria-label="primary color #77659A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#77659A;"></span> <code>#77659A</code><br><span role="img" aria-label="secondary color #B59A9B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B59A9B;"></span> <code>#B59A9B</code><br><span role="img" aria-label="accent color #7F5F70" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7F5F70;"></span> <code>#7F5F70</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E9E6EF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E9E6EF;"></span> <code>#E9E6EF</code><br><span role="img" aria-label="surface color #F8F5F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F5F5;"></span> <code>#F8F5F5</code><br><span role="img" aria-label="accent color #46343E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#46343E;"></span> <code>#46343E</code><br><span role="img" aria-label="chart color #413855" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#413855;"></span> <code>#413855</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.584 / 14.314 / 10.636 / 8.862 | 適合 | 確認事項なし | 多様な視点をつなぐ紫。 |
| `palette-pair-intellectimagination-high-and-agreeableness-high-3` | 調和を促すソフトブルー | <span role="img" aria-label="primary color #74A9A4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#74A9A4;"></span> <code>#74A9A4</code><br><span role="img" aria-label="secondary color #A5ADC3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A5ADC3;"></span> <code>#A5ADC3</code><br><span role="img" aria-label="accent color #6B7D8E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B7D8E;"></span> <code>#6B7D8E</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E9F1F0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E9F1F0;"></span> <code>#E9F1F0</code><br><span role="img" aria-label="surface color #F6F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F9;"></span> <code>#F6F7F9</code><br><span role="img" aria-label="accent color #3B454E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3B454E;"></span> <code>#3B454E</code><br><span role="img" aria-label="chart color #405D5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#405D5A;"></span> <code>#405D5A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.526 / 14.476 / 9.124 / 6.245 | 適合 | 確認事項なし | 理解と共感が広がる青緑。 |
| `palette-pair-intellectimagination-high-and-agreeableness-low-1` | 強い意志を宿す深い青 | <span role="img" aria-label="primary color #315E87" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#315E87;"></span> <code>#315E87</code><br><span role="img" aria-label="secondary color #7EA2A7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7EA2A7;"></span> <code>#7EA2A7</code><br><span role="img" aria-label="accent color #406775" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#406775;"></span> <code>#406775</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #DEE5EC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DEE5EC;"></span> <code>#DEE5EC</code><br><span role="img" aria-label="surface color #F2F6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F2F6F6;"></span> <code>#F2F6F6</code><br><span role="img" aria-label="accent color #233940" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#233940;"></span> <code>#233940</code><br><span role="img" aria-label="chart color #1B344A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1B344A;"></span> <code>#1B344A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.211 / 14.253 / 11.145 / 10.097 | 適合 | 確認事項なし | 未知へ踏み出す独立した視線。 |
| `palette-pair-intellectimagination-high-and-agreeableness-low-2` | 未踏の地を拓く深い紫 | <span role="img" aria-label="primary color #694C91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#694C91;"></span> <code>#694C91</code><br><span role="img" aria-label="secondary color #B19198" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B19198;"></span> <code>#B19198</code><br><span role="img" aria-label="accent color #78526C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#78526C;"></span> <code>#78526C</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E7E2ED" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E7E2ED;"></span> <code>#E7E2ED</code><br><span role="img" aria-label="surface color #F7F4F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F4F5;"></span> <code>#F7F4F5</code><br><span role="img" aria-label="accent color #422D3B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#422D3B;"></span> <code>#422D3B</code><br><span role="img" aria-label="chart color #3A2A50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A2A50;"></span> <code>#3A2A50</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.192 / 14.198 / 11.504 / 10.141 | 適合 | 確認事項なし | 既存の枠から離れる発想を象徴。 |
| `palette-pair-intellectimagination-high-and-agreeableness-low-3` | 鋭い理性を照らすオレンジ | <span role="img" aria-label="primary color #C46F3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C46F3F;"></span> <code>#C46F3F</code><br><span role="img" aria-label="secondary color #C1999F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C1999F;"></span> <code>#C1999F</code><br><span role="img" aria-label="accent color #93605B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#93605B;"></span> <code>#93605B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6E8E0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6E8E0;"></span> <code>#F6E8E0</code><br><span role="img" aria-label="surface color #F9F5F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F5F5;"></span> <code>#F9F5F5</code><br><span role="img" aria-label="accent color #513532" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#513532;"></span> <code>#513532</code><br><span role="img" aria-label="chart color #6C3D23" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C3D23;"></span> <code>#6C3D23</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.959 / 14.341 / 10.187 / 7.529 | 適合 | 確認事項なし | 自分の道を切り開く力強い差し色。 |
| `palette-pair-intellectimagination-low-and-agreeableness-high-1` | 温かなサンドベージュ | <span role="img" aria-label="primary color #C3AD91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C3AD91;"></span> <code>#C3AD91</code><br><span role="img" aria-label="secondary color #B1BDAA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B1BDAA;"></span> <code>#B1BDAA</code><br><span role="img" aria-label="accent color #898E7A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#898E7A;"></span> <code>#898E7A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F2ED" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F2ED;"></span> <code>#F5F2ED</code><br><span role="img" aria-label="surface color #F7F8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F8F7;"></span> <code>#F7F8F7</code><br><span role="img" aria-label="accent color #4B4E43" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B4E43;"></span> <code>#4B4E43</code><br><span role="img" aria-label="chart color #6B5F50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B5F50;"></span> <code>#6B5F50</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.897 / 14.575 / 7.986 / 5.567 | 適合 | 確認事項なし | 身近な経験を分かち合う温かさ。 |
| `palette-pair-intellectimagination-low-and-agreeableness-high-2` | 安らぎを分かつセージグリーン | <span role="img" aria-label="primary color #8FA487" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8FA487;"></span> <code>#8FA487</code><br><span role="img" aria-label="secondary color #BEB095" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BEB095;"></span> <code>#BEB095</code><br><span role="img" aria-label="accent color #8B7E67" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B7E67;"></span> <code>#8B7E67</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EDF0EC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EDF0EC;"></span> <code>#EDF0EC</code><br><span role="img" aria-label="surface color #F9F7F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F4;"></span> <code>#F9F7F4</code><br><span role="img" aria-label="accent color #4C4539" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C4539;"></span> <code>#4C4539</code><br><span role="img" aria-label="chart color #4F5A4A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F5A4A;"></span> <code>#4F5A4A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.505 / 14.512 / 8.856 / 6.316 | 適合 | 確認事項なし | 実際的な支え合いを象徴する緑。 |
| `palette-pair-intellectimagination-low-and-agreeableness-high-3` | 穏やかなピーチピンク | <span role="img" aria-label="primary color #C88F8B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C88F8B;"></span> <code>#C88F8B</code><br><span role="img" aria-label="secondary color #C2A4BA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C2A4BA;"></span> <code>#C2A4BA</code><br><span role="img" aria-label="accent color #957081" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#957081;"></span> <code>#957081</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6EDEC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6EDEC;"></span> <code>#F6EDEC</code><br><span role="img" aria-label="surface color #F9F6F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F6F8;"></span> <code>#F9F6F8</code><br><span role="img" aria-label="accent color #523E47" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#523E47;"></span> <code>#523E47</code><br><span role="img" aria-label="chart color #6E4F4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E4F4C;"></span> <code>#6E4F4C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.481 / 14.458 / 9.148 / 6.322 | 適合 | 確認事項なし | 同じ場を囲む親しみの色。 |
| `palette-pair-intellectimagination-low-and-agreeableness-low-1` | 断定的なオーカー | <span role="img" aria-label="primary color #B27F3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B27F3F;"></span> <code>#B27F3F</code><br><span role="img" aria-label="secondary color #ABAD8E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ABAD8E;"></span> <code>#ABAD8E</code><br><span role="img" aria-label="accent color #817751" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#817751;"></span> <code>#817751</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3EBE0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3EBE0;"></span> <code>#F3EBE0</code><br><span role="img" aria-label="surface color #F7F7F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7F4;"></span> <code>#F7F7F4</code><br><span role="img" aria-label="accent color #47412D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#47412D;"></span> <code>#47412D</code><br><span role="img" aria-label="chart color #624623" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#624623;"></span> <code>#624623</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.131 / 14.458 / 9.489 / 7.344 | 適合 | 確認事項なし | 具体的な基準を示す明確な色。 |
| `palette-pair-intellectimagination-low-and-agreeableness-low-2` | 明確な視界の深い青 | <span role="img" aria-label="primary color #45566E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45566E;"></span> <code>#45566E</code><br><span role="img" aria-label="secondary color #A4948C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A4948C;"></span> <code>#A4948C</code><br><span role="img" aria-label="accent color #66575A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#66575A;"></span> <code>#66575A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E1E4E8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E1E4E8;"></span> <code>#E1E4E8</code><br><span role="img" aria-label="surface color #F6F4F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F4;"></span> <code>#F6F4F4</code><br><span role="img" aria-label="accent color #383032" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#383032;"></span> <code>#383032</code><br><span role="img" aria-label="chart color #262F3D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#262F3D;"></span> <code>#262F3D</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.166 / 14.162 / 11.708 / 10.578 | 適合 | 確認事項なし | 自分の判断を落ち着いて掲げる青。 |
| `palette-pair-intellectimagination-low-and-agreeableness-low-3` | 揺るぎないスレートグレー | <span role="img" aria-label="primary color #747A78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#747A78;"></span> <code>#747A78</code><br><span role="img" aria-label="secondary color #A59CB3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A59CB3;"></span> <code>#A59CB3</code><br><span role="img" aria-label="accent color #6B6678" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B6678;"></span> <code>#6B6678</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E9EAE9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E9EAE9;"></span> <code>#E9EAE9</code><br><span role="img" aria-label="surface color #F6F5F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F5F7;"></span> <code>#F6F5F7</code><br><span role="img" aria-label="accent color #3B3842" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3B3842;"></span> <code>#3B3842</code><br><span role="img" aria-label="chart color #404342" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#404342;"></span> <code>#404342</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.865 / 14.278 / 10.557 / 8.293 | 適合 | 確認事項なし | 事実に基づく硬質な印象。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-high-1` | 凪いだ空のライトブルー | <span role="img" aria-label="primary color #6A96B3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6A96B3;"></span> <code>#6A96B3</code><br><span role="img" aria-label="secondary color #92B5B6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#92B5B6;"></span> <code>#92B5B6</code><br><span role="img" aria-label="accent color #5D838B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5D838B;"></span> <code>#5D838B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E7EEF3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E7EEF3;"></span> <code>#E7EEF3</code><br><span role="img" aria-label="surface color #F4F8F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F8F8;"></span> <code>#F4F8F8</code><br><span role="img" aria-label="accent color #33484C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#33484C;"></span> <code>#33484C</code><br><span role="img" aria-label="chart color #3A5362" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A5362;"></span> <code>#3A5362</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.243 / 14.505 / 9.037 / 6.910 | 適合 | 確認事項なし | 広い視野と静かな安定を表す青。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-high-2` | 静観する深い紺色 | <span role="img" aria-label="primary color #4E6188" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E6188;"></span> <code>#4E6188</code><br><span role="img" aria-label="secondary color #A79895" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A79895;"></span> <code>#A79895</code><br><span role="img" aria-label="accent color #6B5D67" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B5D67;"></span> <code>#6B5D67</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E3E6EC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E3E6EC;"></span> <code>#E3E6EC</code><br><span role="img" aria-label="surface color #F6F5F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F5F4;"></span> <code>#F6F5F4</code><br><span role="img" aria-label="accent color #3B3339" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3B3339;"></span> <code>#3B3339</code><br><span role="img" aria-label="chart color #2B354B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2B354B;"></span> <code>#2B354B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.411 / 14.251 / 11.222 / 9.802 | 適合 | 確認事項なし | 遠くまで考えを伸ばす深い色。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-high-3` | 澄み切ったミントグリーン | <span role="img" aria-label="primary color #78A99E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#78A99E;"></span> <code>#78A99E</code><br><span role="img" aria-label="secondary color #A6ADC0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A6ADC0;"></span> <code>#A6ADC0</code><br><span role="img" aria-label="accent color #6D7D8B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6D7D8B;"></span> <code>#6D7D8B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E9F1EF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E9F1EF;"></span> <code>#E9F1EF</code><br><span role="img" aria-label="surface color #F6F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F9;"></span> <code>#F6F7F9</code><br><span role="img" aria-label="accent color #3C454C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3C454C;"></span> <code>#3C454C</code><br><span role="img" aria-label="chart color #425D57" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#425D57;"></span> <code>#425D57</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.518 / 14.476 / 9.122 / 6.233 | 適合 | 確認事項なし | 落ち着いた広がりを象徴する青緑。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-low-1` | 震える心の色である淡い紫 | <span role="img" aria-label="primary color #9C83B3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9C83B3;"></span> <code>#9C83B3</code><br><span role="img" aria-label="secondary color #A3AFB6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A3AFB6;"></span> <code>#A3AFB6</code><br><span role="img" aria-label="accent color #76798B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#76798B;"></span> <code>#76798B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EFEBF3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EFEBF3;"></span> <code>#EFEBF3</code><br><span role="img" aria-label="surface color #F6F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F8;"></span> <code>#F6F7F8</code><br><span role="img" aria-label="accent color #41434C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#41434C;"></span> <code>#41434C</code><br><span role="img" aria-label="chart color #564862" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#564862;"></span> <code>#564862</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.188 / 14.467 / 9.183 / 7.142 | 適合 | 確認事項なし | 細やかな気配へ反応する紫。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-low-2` | 瑞々しい朝の緑 | <span role="img" aria-label="primary color #5B9FB0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5B9FB0;"></span> <code>#5B9FB0</code><br><span role="img" aria-label="secondary color #ACAEA3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ACAEA3;"></span> <code>#ACAEA3</code><br><span role="img" aria-label="accent color #717C7B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#717C7B;"></span> <code>#717C7B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E5F0F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E5F0F2;"></span> <code>#E5F0F2</code><br><span role="img" aria-label="surface color #F7F7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7F6;"></span> <code>#F7F7F6</code><br><span role="img" aria-label="accent color #3E4444" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3E4444;"></span> <code>#3E4444</code><br><span role="img" aria-label="chart color #325761" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#325761;"></span> <code>#325761</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.358 / 14.476 / 9.262 / 6.767 | 適合 | 確認事項なし | 新しい方向へ視線を動かす青。 |
| `palette-pair-intellectimagination-high-and-emotionalstability-low-3` | 繊細な光のローズピンク | <span role="img" aria-label="primary color #C58B9C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C58B9C;"></span> <code>#C58B9C</code><br><span role="img" aria-label="secondary color #C1A2C0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C1A2C0;"></span> <code>#C1A2C0</code><br><span role="img" aria-label="accent color #946E8A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#946E8A;"></span> <code>#946E8A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6ECEF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6ECEF;"></span> <code>#F6ECEF</code><br><span role="img" aria-label="surface color #F9F6F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F6F9;"></span> <code>#F9F6F9</code><br><span role="img" aria-label="accent color #513D4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#513D4C;"></span> <code>#513D4C</code><br><span role="img" aria-label="chart color #6C4C56" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C4C56;"></span> <code>#6C4C56</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.421 / 14.467 / 9.227 / 6.473 | 適合 | 確認事項なし | 感受性と好奇心が重なる柔らかな色。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-high-1` | 暖かな陽だまりの黄色 | <span role="img" aria-label="primary color #D0B58D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D0B58D;"></span> <code>#D0B58D</code><br><span role="img" aria-label="secondary color #B5C0A9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B5C0A9;"></span> <code>#B5C0A9</code><br><span role="img" aria-label="accent color #909278" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#909278;"></span> <code>#909278</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F7F3ED" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F3ED;"></span> <code>#F7F3ED</code><br><span role="img" aria-label="surface color #F8F9F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F9F6;"></span> <code>#F8F9F6</code><br><span role="img" aria-label="accent color #4F5042" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F5042;"></span> <code>#4F5042</code><br><span role="img" aria-label="chart color #72644E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#72644E;"></span> <code>#72644E</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.038 / 14.684 / 7.767 / 5.207 | 適合 | 確認事項なし | 穏やかで具体的な安心感。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-high-2` | 穏やかな午後のセージグリーン | <span role="img" aria-label="primary color #92A083" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#92A083;"></span> <code>#92A083</code><br><span role="img" aria-label="secondary color #BFAE93" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BFAE93;"></span> <code>#BFAE93</code><br><span role="img" aria-label="accent color #8D7C65" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8D7C65;"></span> <code>#8D7C65</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EEF0EB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EEF0EB;"></span> <code>#EEF0EB</code><br><span role="img" aria-label="surface color #F9F7F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F4;"></span> <code>#F9F7F4</code><br><span role="img" aria-label="accent color #4E4438" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E4438;"></span> <code>#4E4438</code><br><span role="img" aria-label="chart color #505848" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#505848;"></span> <code>#505848</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.522 / 14.512 / 8.895 / 6.465 | 適合 | 確認事項なし | 身近な現実を落ち着いて眺める緑。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-high-3` | 安静な庭のオーカー | <span role="img" aria-label="primary color #C08A3E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C08A3E;"></span> <code>#C08A3E</code><br><span role="img" aria-label="secondary color #BFA29F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BFA29F;"></span> <code>#BFA29F</code><br><span role="img" aria-label="accent color #916E5B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#916E5B;"></span> <code>#916E5B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5ECE0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5ECE0;"></span> <code>#F5ECE0</code><br><span role="img" aria-label="surface color #F9F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F6F5;"></span> <code>#F9F6F5</code><br><span role="img" aria-label="accent color #503D32" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#503D32;"></span> <code>#503D32</code><br><span role="img" aria-label="chart color #6A4C22" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6A4C22;"></span> <code>#6A4C22</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.269 / 14.431 / 9.505 / 6.726 | 適合 | 確認事項なし | 変化を急がず時間を重ねる色。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-low-1` | しっとりとした雨のグレー | <span role="img" aria-label="primary color #737F88" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#737F88;"></span> <code>#737F88</code><br><span role="img" aria-label="secondary color #95ADA7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#95ADA7;"></span> <code>#95ADA7</code><br><span role="img" aria-label="accent color #617776" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#617776;"></span> <code>#617776</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E9EBEC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E9EBEC;"></span> <code>#E9EBEC</code><br><span role="img" aria-label="surface color #F4F7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F7F6;"></span> <code>#F4F7F6</code><br><span role="img" aria-label="accent color #354141" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#354141;"></span> <code>#354141</code><br><span role="img" aria-label="chart color #3F464B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F464B;"></span> <code>#3F464B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.975 / 14.396 / 9.820 / 8.022 | 適合 | 確認事項なし | 小さな変化に気づく静かな青。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-low-2` | 濡れた葉の深い緑 | <span role="img" aria-label="primary color #3F704A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F704A;"></span> <code>#3F704A</code><br><span role="img" aria-label="secondary color #A29E7F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A29E7F;"></span> <code>#A29E7F</code><br><span role="img" aria-label="accent color #636448" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#636448;"></span> <code>#636448</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E0E8E2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E0E8E2;"></span> <code>#E0E8E2</code><br><span role="img" aria-label="surface color #F6F5F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F5F2;"></span> <code>#F6F5F2</code><br><span role="img" aria-label="accent color #363728" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#363728;"></span> <code>#363728</code><br><span role="img" aria-label="chart color #233E29" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#233E29;"></span> <code>#233E29</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.422 / 14.233 / 11.108 / 9.378 | 適合 | 確認事項なし | 足元を確かめながら進む色。 |
| `palette-pair-intellectimagination-low-and-emotionalstability-low-3` | 憂いを帯びた淡いブルー | <span role="img" aria-label="primary color #6E9FC3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E9FC3;"></span> <code>#6E9FC3</code><br><span role="img" aria-label="secondary color #A3A9CD" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A3A9CD;"></span> <code>#A3A9CD</code><br><span role="img" aria-label="accent color #68789D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#68789D;"></span> <code>#68789D</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E8F0F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E8F0F5;"></span> <code>#E8F0F5</code><br><span role="img" aria-label="surface color #F6F6FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F6FA;"></span> <code>#F6F6FA</code><br><span role="img" aria-label="accent color #394256" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#394256;"></span> <code>#394256</code><br><span role="img" aria-label="chart color #3D576B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D576B;"></span> <code>#3D576B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.459 / 14.395 / 9.332 / 6.566 | 適合 | 確認事項なし | 身近な環境の変化を象徴する緑。 |
| `palette-pair-conscientiousness-high-and-extraversion-high-1` | 効率的な深い青 | <span role="img" aria-label="primary color #3F5B77" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5B77;"></span> <code>#3F5B77</code><br><span role="img" aria-label="secondary color #83A1A1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#83A1A1;"></span> <code>#83A1A1</code><br><span role="img" aria-label="accent color #47656D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#47656D;"></span> <code>#47656D</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E0E5E9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E0E5E9;"></span> <code>#E0E5E9</code><br><span role="img" aria-label="surface color #F3F6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F6F6;"></span> <code>#F3F6F6</code><br><span role="img" aria-label="accent color #27383C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#27383C;"></span> <code>#27383C</code><br><span role="img" aria-label="chart color #233241" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#233241;"></span> <code>#233241</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.232 / 14.279 / 11.253 / 10.320 | 適合 | 確認事項なし | 予定と役割を明確にする青。 |
| `palette-pair-conscientiousness-high-and-extraversion-high-2` | 社交的な明るいオレンジ | <span role="img" aria-label="primary color #DD8444" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#DD8444;"></span> <code>#DD8444</code><br><span role="img" aria-label="secondary color #D9A57D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D9A57D;"></span> <code>#D9A57D</code><br><span role="img" aria-label="accent color #B26E45" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B26E45;"></span> <code>#B26E45</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #FAEBE1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAEBE1;"></span> <code>#FAEBE1</code><br><span role="img" aria-label="surface color #FBF6F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF6F2;"></span> <code>#FBF6F2</code><br><span role="img" aria-label="accent color #623D26" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#623D26;"></span> <code>#623D26</code><br><span role="img" aria-label="chart color #7A4925" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7A4925;"></span> <code>#7A4925</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.327 / 14.458 / 8.834 / 6.425 | 適合 | 確認事項なし | 人の輪へ働きかける明るさ。 |
| `palette-pair-conscientiousness-high-and-extraversion-high-3` | 整理された白 | <span role="img" aria-label="primary color #C9C2B5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C9C2B5;"></span> <code>#C9C2B5</code><br><span role="img" aria-label="secondary color #C3B6C9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C3B6C9;"></span> <code>#C3B6C9</code><br><span role="img" aria-label="accent color #968A96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#968A96;"></span> <code>#968A96</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F5F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F5F3;"></span> <code>#F6F5F3</code><br><span role="img" aria-label="surface color #F9F8FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F8FA;"></span> <code>#F9F8FA</code><br><span role="img" aria-label="accent color #534C53" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#534C53;"></span> <code>#534C53</code><br><span role="img" aria-label="chart color #6F6B64" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F6B64;"></span> <code>#6F6B64</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.242 / 14.657 / 7.851 / 4.863 | 適合 | 確認事項なし | 時間を意識して動く印象。 |
| `palette-pair-conscientiousness-high-and-extraversion-low-1` | 集中を高める温かな琥珀色 | <span role="img" aria-label="primary color #B47B3E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B47B3E;"></span> <code>#B47B3E</code><br><span role="img" aria-label="secondary color #ACAC8D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ACAC8D;"></span> <code>#ACAC8D</code><br><span role="img" aria-label="accent color #827551" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#827551;"></span> <code>#827551</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3EAE0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3EAE0;"></span> <code>#F3EAE0</code><br><span role="img" aria-label="surface color #F7F7F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7F4;"></span> <code>#F7F7F4</code><br><span role="img" aria-label="accent color #48402D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#48402D;"></span> <code>#48402D</code><br><span role="img" aria-label="chart color #634422" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#634422;"></span> <code>#634422</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.047 / 14.458 / 9.559 / 7.417 | 適合 | 確認事項なし | 静かな机上を照らす灯りの色。 |
| `palette-pair-conscientiousness-high-and-extraversion-low-2` | 灯火を見守る深い青 | <span role="img" aria-label="primary color #45556C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45556C;"></span> <code>#45556C</code><br><span role="img" aria-label="secondary color #A4948B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A4948B;"></span> <code>#A4948B</code><br><span role="img" aria-label="accent color #665759" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665759;"></span> <code>#665759</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E1E4E7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E1E4E7;"></span> <code>#E1E4E7</code><br><span role="img" aria-label="surface color #F6F4F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F3;"></span> <code>#F6F4F3</code><br><span role="img" aria-label="accent color #383031" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#383031;"></span> <code>#383031</code><br><span role="img" aria-label="chart color #262F3B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#262F3B;"></span> <code>#262F3B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.158 / 14.153 / 11.712 / 10.600 | 適合 | 確認事項なし | 丁寧な作業と集中を象徴する青。 |
| `palette-pair-conscientiousness-high-and-extraversion-low-3` | 紙のような淡いアイボリー | <span role="img" aria-label="primary color #8B8983" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8983;"></span> <code>#8B8983</code><br><span role="img" aria-label="secondary color #ADA2B7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ADA2B7;"></span> <code>#ADA2B7</code><br><span role="img" aria-label="accent color #776D7D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#776D7D;"></span> <code>#776D7D</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #ECECEB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ECECEB;"></span> <code>#ECECEB</code><br><span role="img" aria-label="surface color #F7F6F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F6F8;"></span> <code>#F7F6F8</code><br><span role="img" aria-label="accent color #413C45" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#413C45;"></span> <code>#413C45</code><br><span role="img" aria-label="chart color #4C4B48" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C4B48;"></span> <code>#4C4B48</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.127 / 14.404 / 9.960 / 7.379 | 適合 | 確認事項なし | 積み重なる記録の落ち着いた色。 |
| `palette-pair-conscientiousness-low-and-extraversion-high-1` | 軽やかなコーラルピンク | <span role="img" aria-label="primary color #D97666" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D97666;"></span> <code>#D97666</code><br><span role="img" aria-label="secondary color #B9AA9B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B9AA9B;"></span> <code>#B9AA9B</code><br><span role="img" aria-label="accent color #947365" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#947365;"></span> <code>#947365</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9E9E7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9E9E7;"></span> <code>#F9E9E7</code><br><span role="img" aria-label="surface color #F8F7F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F5;"></span> <code>#F8F7F5</code><br><span role="img" aria-label="accent color #513F38" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#513F38;"></span> <code>#513F38</code><br><span role="img" aria-label="chart color #774138" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#774138;"></span> <code>#774138</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.181 / 14.494 / 9.261 / 6.867 | 適合 | 確認事項なし | 予定外の出会いを楽しむ温かさ。 |
| `palette-pair-conscientiousness-low-and-extraversion-high-2` | 偶然を象徴する明るい若葉色 | <span role="img" aria-label="primary color #8DA65E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8DA65E;"></span> <code>#8DA65E</code><br><span role="img" aria-label="secondary color #BDB086" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BDB086;"></span> <code>#BDB086</code><br><span role="img" aria-label="accent color #8A7F52" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8A7F52;"></span> <code>#8A7F52</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EDF1E5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EDF1E5;"></span> <code>#EDF1E5</code><br><span role="img" aria-label="surface color #F8F7F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F3;"></span> <code>#F8F7F3</code><br><span role="img" aria-label="accent color #4C462D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C462D;"></span> <code>#4C462D</code><br><span role="img" aria-label="chart color #4E5B34" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E5B34;"></span> <code>#4E5B34</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.533 / 14.476 / 8.819 / 6.381 | 適合 | 確認事項なし | 寄り道と柔軟な動きを表す緑。 |
| `palette-pair-conscientiousness-low-and-extraversion-high-3` | 自由な空の青 | <span role="img" aria-label="primary color #75A2B4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#75A2B4;"></span> <code>#75A2B4</code><br><span role="img" aria-label="secondary color #A5AAC8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A5AAC8;"></span> <code>#A5AAC8</code><br><span role="img" aria-label="accent color #6C7A96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C7A96;"></span> <code>#6C7A96</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E9F0F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E9F0F3;"></span> <code>#E9F0F3</code><br><span role="img" aria-label="surface color #F6F7FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7FA;"></span> <code>#F6F7FA</code><br><span role="img" aria-label="accent color #3B4353" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3B4353;"></span> <code>#3B4353</code><br><span role="img" aria-label="chart color #405963" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#405963;"></span> <code>#405963</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.466 / 14.486 / 9.274 / 6.446 | 適合 | 確認事項なし | 人の流れへ軽やかに合流する青。 |
| `palette-pair-conscientiousness-low-and-extraversion-low-1` | 贅沢な余白の白 | <span role="img" aria-label="primary color #D7D0C2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D7D0C2;"></span> <code>#D7D0C2</code><br><span role="img" aria-label="secondary color #B8CABC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B8CABC;"></span> <code>#B8CABC</code><br><span role="img" aria-label="accent color #93A093" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#93A093;"></span> <code>#93A093</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9F7F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F5;"></span> <code>#F9F7F5</code><br><span role="img" aria-label="surface color #F8FAF8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8FAF8;"></span> <code>#F8FAF8</code><br><span role="img" aria-label="accent color #515851" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#515851;"></span> <code>#515851</code><br><span role="img" aria-label="chart color #76726B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#76726B;"></span> <code>#76726B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.521 / 14.794 / 6.989 / 4.477 | 適合 | 確認事項なし | 空白をそのまま楽しむ穏やかな色。 |
| `palette-pair-conscientiousness-low-and-extraversion-low-2` | 穏やかな散策のライトグリーン | <span role="img" aria-label="primary color #6F9A67" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F9A67;"></span> <code>#6F9A67</code><br><span role="img" aria-label="secondary color #B3AC89" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B3AC89;"></span> <code>#B3AC89</code><br><span role="img" aria-label="accent color #7B7957" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7B7957;"></span> <code>#7B7957</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E8EFE7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E8EFE7;"></span> <code>#E8EFE7</code><br><span role="img" aria-label="surface color #F7F7F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7F3;"></span> <code>#F7F7F3</code><br><span role="img" aria-label="accent color #444330" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#444330;"></span> <code>#444330</code><br><span role="img" aria-label="chart color #3D5539" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D5539;"></span> <code>#3D5539</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.250 / 14.449 / 9.350 / 7.013 | 適合 | 確認事項なし | 静かな自分のペースを表す緑。 |
| `palette-pair-conscientiousness-low-and-extraversion-low-3` | 心を解き放つ淡い水色 | <span role="img" aria-label="primary color #739BB4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#739BB4;"></span> <code>#739BB4</code><br><span role="img" aria-label="secondary color #A4A8C8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A4A8C8;"></span> <code>#A4A8C8</code><br><span role="img" aria-label="accent color #6B7696" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B7696;"></span> <code>#6B7696</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E9EFF3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E9EFF3;"></span> <code>#E9EFF3</code><br><span role="img" aria-label="surface color #F6F6FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F6FA;"></span> <code>#F6F6FA</code><br><span role="img" aria-label="accent color #3B4153" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3B4153;"></span> <code>#3B4153</code><br><span role="img" aria-label="chart color #3F5563" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5563;"></span> <code>#3F5563</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.379 / 14.395 / 9.425 / 6.728 | 適合 | 確認事項なし | 急がず漂う時間を象徴する青灰。 |
| `palette-pair-conscientiousness-high-and-agreeableness-high-1` | 調和を司るミントグリーン | <span role="img" aria-label="primary color #829A7D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#829A7D;"></span> <code>#829A7D</code><br><span role="img" aria-label="secondary color #9AB7A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9AB7A3;"></span> <code>#9AB7A3</code><br><span role="img" aria-label="accent color #698570" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#698570;"></span> <code>#698570</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EBEFEA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EBEFEA;"></span> <code>#EBEFEA</code><br><span role="img" aria-label="surface color #F5F8F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F8F6;"></span> <code>#F5F8F6</code><br><span role="img" aria-label="accent color #3A493E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A493E;"></span> <code>#3A493E</code><br><span role="img" aria-label="chart color #485545" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#485545;"></span> <code>#485545</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.351 / 14.513 / 8.917 / 6.790 | 適合 | 確認事項なし | 周囲を整える穏やかな緑。 |
| `palette-pair-conscientiousness-high-and-agreeableness-high-2` | 責任感ある深い紺 | <span role="img" aria-label="primary color #657F96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#657F96;"></span> <code>#657F96</code><br><span role="img" aria-label="secondary color #AFA39A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#AFA39A;"></span> <code>#AFA39A</code><br><span role="img" aria-label="accent color #766C6E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#766C6E;"></span> <code>#766C6E</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E6EBEE" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E6EBEE;"></span> <code>#E6EBEE</code><br><span role="img" aria-label="surface color #F7F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F6F5;"></span> <code>#F7F6F5</code><br><span role="img" aria-label="accent color #413B3D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#413B3D;"></span> <code>#413B3D</code><br><span role="img" aria-label="chart color #384653" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#384653;"></span> <code>#384653</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.919 / 14.377 / 10.145 / 8.060 | 適合 | 確認事項なし | 役割や段取りを見通しよくする青。 |
| `palette-pair-conscientiousness-high-and-agreeableness-high-3` | 準備を整えるローズベージュ | <span role="img" aria-label="primary color #C38A88" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C38A88;"></span> <code>#C38A88</code><br><span role="img" aria-label="secondary color #C0A2B9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C0A2B9;"></span> <code>#C0A2B9</code><br><span role="img" aria-label="accent color #936E80" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#936E80;"></span> <code>#936E80</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5ECEC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5ECEC;"></span> <code>#F5ECEC</code><br><span role="img" aria-label="surface color #F9F6F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F6F8;"></span> <code>#F9F6F8</code><br><span role="img" aria-label="accent color #513D46" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#513D46;"></span> <code>#513D46</code><br><span role="img" aria-label="chart color #6B4C4B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B4C4B;"></span> <code>#6B4C4B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.369 / 14.458 / 9.291 / 6.554 | 適合 | 確認事項なし | 人を迎える温かさを添える色。 |
| `palette-pair-conscientiousness-high-and-agreeableness-low-1` | 厳格な境界線の黒 | <span role="img" aria-label="primary color #5F6A73" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5F6A73;"></span> <code>#5F6A73</code><br><span role="img" aria-label="secondary color #8EA6A0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8EA6A0;"></span> <code>#8EA6A0</code><br><span role="img" aria-label="accent color #576D6B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#576D6B;"></span> <code>#576D6B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E5E7E9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E5E7E9;"></span> <code>#E5E7E9</code><br><span role="img" aria-label="surface color #F4F6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F6F6;"></span> <code>#F4F6F6</code><br><span role="img" aria-label="accent color #303C3B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#303C3B;"></span> <code>#303C3B</code><br><span role="img" aria-label="chart color #343A3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#343A3F;"></span> <code>#343A3F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.517 / 14.306 / 10.549 / 9.292 | 適合 | 確認事項なし | 線引きと一貫性を表す灰青。 |
| `palette-pair-conscientiousness-high-and-agreeableness-low-2` | 理知的な冷たい青 | <span role="img" aria-label="primary color #3F5268" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5268;"></span> <code>#3F5268</code><br><span role="img" aria-label="secondary color #A2938A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A2938A;"></span> <code>#A2938A</code><br><span role="img" aria-label="accent color #635557" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#635557;"></span> <code>#635557</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E0E3E7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E0E3E7;"></span> <code>#E0E3E7</code><br><span role="img" aria-label="surface color #F6F4F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F3;"></span> <code>#F6F4F3</code><br><span role="img" aria-label="accent color #362F30" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#362F30;"></span> <code>#362F30</code><br><span role="img" aria-label="chart color #232D39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#232D39;"></span> <code>#232D39</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.053 / 14.153 / 11.925 / 10.831 | 適合 | 確認事項なし | 秩序を保つ端正な青。 |
| `palette-pair-conscientiousness-high-and-agreeableness-low-3` | 秩序を示すオーカー | <span role="img" aria-label="primary color #A57B42" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A57B42;"></span> <code>#A57B42</code><br><span role="img" aria-label="secondary color #B69DA0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B69DA0;"></span> <code>#B69DA0</code><br><span role="img" aria-label="accent color #84665D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#84665D;"></span> <code>#84665D</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F1EAE1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F1EAE1;"></span> <code>#F1EAE1</code><br><span role="img" aria-label="surface color #F8F5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F5F6;"></span> <code>#F8F5F6</code><br><span role="img" aria-label="accent color #493833" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#493833;"></span> <code>#493833</code><br><span role="img" aria-label="chart color #5B4424" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5B4424;"></span> <code>#5B4424</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.003 / 14.323 / 10.219 / 7.660 | 適合 | 確認事項なし | 基準を明確に示す落ち着いた黄褐色。 |
| `palette-pair-conscientiousness-low-and-agreeableness-high-1` | 温かな友情の若草色 | <span role="img" aria-label="primary color #95A982" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#95A982;"></span> <code>#95A982</code><br><span role="img" aria-label="secondary color #A1BCA5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A1BCA5;"></span> <code>#A1BCA5</code><br><span role="img" aria-label="accent color #728C73" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#728C73;"></span> <code>#728C73</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EEF1EB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EEF1EB;"></span> <code>#EEF1EB</code><br><span role="img" aria-label="surface color #F6F8F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F8F6;"></span> <code>#F6F8F6</code><br><span role="img" aria-label="accent color #3F4D3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F4D3F;"></span> <code>#3F4D3F</code><br><span role="img" aria-label="chart color #525D48" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#525D48;"></span> <code>#525D48</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.609 / 14.540 / 8.392 / 6.102 | 適合 | 確認事項なし | 相手に合わせる柔らかな緑。 |
| `palette-pair-conscientiousness-low-and-agreeableness-high-2` | 緩やかな時間のコーラル | <span role="img" aria-label="primary color #CF8774" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#CF8774;"></span> <code>#CF8774</code><br><span role="img" aria-label="secondary color #D4A68E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D4A68E;"></span> <code>#D4A68E</code><br><span role="img" aria-label="accent color #AB705D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#AB705D;"></span> <code>#AB705D</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F7ECE9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7ECE9;"></span> <code>#F7ECE9</code><br><span role="img" aria-label="surface color #FBF6F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF6F4;"></span> <code>#FBF6F4</code><br><span role="img" aria-label="accent color #5E3E33" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5E3E33;"></span> <code>#5E3E33</code><br><span role="img" aria-label="chart color #724A40" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#724A40;"></span> <code>#724A40</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.397 / 14.476 / 8.853 / 6.547 | 適合 | 確認事項なし | 予定外の時間を共に楽しむ色。 |
| `palette-pair-conscientiousness-low-and-agreeableness-high-3` | 包容力ある淡いオレンジ | <span role="img" aria-label="primary color #C7B092" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C7B092;"></span> <code>#C7B092</code><br><span role="img" aria-label="secondary color #C2AFBC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C2AFBC;"></span> <code>#C2AFBC</code><br><span role="img" aria-label="accent color #958185" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#958185;"></span> <code>#958185</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F2EE" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F2EE;"></span> <code>#F6F2EE</code><br><span role="img" aria-label="surface color #F9F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F8;"></span> <code>#F9F7F8</code><br><span role="img" aria-label="accent color #524749" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#524749;"></span> <code>#524749</code><br><span role="img" aria-label="chart color #6D6150" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6D6150;"></span> <code>#6D6150</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.932 / 14.548 / 8.355 / 5.424 | 適合 | 確認事項なし | 無理なく続く関わりを象徴。 |
| `palette-pair-conscientiousness-low-and-agreeableness-low-1` | 誰にも染まらないレンガ色 | <span role="img" aria-label="primary color #A8644F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A8644F;"></span> <code>#A8644F</code><br><span role="img" aria-label="secondary color #A7A493" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A7A493;"></span> <code>#A7A493</code><br><span role="img" aria-label="accent color #7C6A59" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7C6A59;"></span> <code>#7C6A59</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F1E6E3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F1E6E3;"></span> <code>#F1E6E3</code><br><span role="img" aria-label="surface color #F6F6F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F6F4;"></span> <code>#F6F6F4</code><br><span role="img" aria-label="accent color #443A31" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#443A31;"></span> <code>#443A31</code><br><span role="img" aria-label="chart color #5C372B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5C372B;"></span> <code>#5C372B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.686 / 14.341 / 10.239 / 8.431 | 適合 | 確認事項なし | 自分の判断で進む大地の色。 |
| `palette-pair-conscientiousness-low-and-agreeableness-low-2` | 独立した精神の深い青 | <span role="img" aria-label="primary color #4C9690" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C9690;"></span> <code>#4C9690</code><br><span role="img" aria-label="secondary color #A6AB98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A6AB98;"></span> <code>#A6AB98</code><br><span role="img" aria-label="accent color #6A776B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6A776B;"></span> <code>#6A776B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E2EEED" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E2EEED;"></span> <code>#E2EEED</code><br><span role="img" aria-label="surface color #F6F7F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F5;"></span> <code>#F6F7F5</code><br><span role="img" aria-label="accent color #3A413B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A413B;"></span> <code>#3A413B</code><br><span role="img" aria-label="chart color #2A534F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2A534F;"></span> <code>#2A534F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.069 / 14.440 / 9.775 / 7.223 | 適合 | 確認事項なし | 決められた枠から離れる青緑。 |
| `palette-pair-conscientiousness-low-and-agreeableness-low-3` | 自由な風のサンドベージュ | <span role="img" aria-label="primary color #B89E78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B89E78;"></span> <code>#B89E78</code><br><span role="img" aria-label="secondary color #BDA9B3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BDA9B3;"></span> <code>#BDA9B3</code><br><span role="img" aria-label="accent color #8D7878" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8D7878;"></span> <code>#8D7878</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4EFE9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4EFE9;"></span> <code>#F4EFE9</code><br><span role="img" aria-label="surface color #F8F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F6F7;"></span> <code>#F8F6F7</code><br><span role="img" aria-label="accent color #4E4242" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E4242;"></span> <code>#4E4242</code><br><span role="img" aria-label="chart color #655742" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#655742;"></span> <code>#655742</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.574 / 14.422 / 8.945 / 6.133 | 適合 | 確認事項なし | 広い裁量と余白を表す色。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-high-1` | 安定した深い青 | <span role="img" aria-label="primary color #415C70" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#415C70;"></span> <code>#415C70</code><br><span role="img" aria-label="secondary color #83A19F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#83A19F;"></span> <code>#83A19F</code><br><span role="img" aria-label="accent color #48666A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#48666A;"></span> <code>#48666A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E1E5E8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E1E5E8;"></span> <code>#E1E5E8</code><br><span role="img" aria-label="surface color #F3F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F6F5;"></span> <code>#F3F6F5</code><br><span role="img" aria-label="accent color #28383A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#28383A;"></span> <code>#28383A</code><br><span role="img" aria-label="chart color #24333E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#24333E;"></span> <code>#24333E</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.248 / 14.270 / 11.247 / 10.243 | 適合 | 確認事項なし | 計画と落ち着きが同居する深い青。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-high-2` | 凪いだ海の白 | <span role="img" aria-label="primary color #C7D5D8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C7D5D8;"></span> <code>#C7D5D8</code><br><span role="img" aria-label="secondary color #D1C1B1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D1C1B1;"></span> <code>#D1C1B1</code><br><span role="img" aria-label="accent color #A7978F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A7978F;"></span> <code>#A7978F</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F8F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F8F9;"></span> <code>#F6F8F9</code><br><span role="img" aria-label="surface color #FAF9F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FAF9F7;"></span> <code>#FAF9F7</code><br><span role="img" aria-label="accent color #5C534F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5C534F;"></span> <code>#5C534F</code><br><span role="img" aria-label="chart color #6D7577" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6D7577;"></span> <code>#6D7577</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 14.567 / 14.748 / 7.115 / 4.419 | 適合 | 確認事項なし | 安定した流れを象徴する青灰。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-high-3` | 冷静な判断のセージグレー | <span role="img" aria-label="primary color #5E8B6E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5E8B6E;"></span> <code>#5E8B6E</code><br><span role="img" aria-label="secondary color #9DA2B0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9DA2B0;"></span> <code>#9DA2B0</code><br><span role="img" aria-label="accent color #606E73" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#606E73;"></span> <code>#606E73</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E5ECE8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E5ECE8;"></span> <code>#E5ECE8</code><br><span role="img" aria-label="surface color #F5F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F6F7;"></span> <code>#F5F6F7</code><br><span role="img" aria-label="accent color #353D3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#353D3F;"></span> <code>#353D3F</code><br><span role="img" aria-label="chart color #344C3D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#344C3D;"></span> <code>#344C3D</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.928 / 14.341 / 10.265 / 7.785 | 適合 | 確認事項なし | 無理なく続く秩序を表す緑。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-low-1` | 揺らぐ感情を照らす琥珀色 | <span role="img" aria-label="primary color #B77D45" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B77D45;"></span> <code>#B77D45</code><br><span role="img" aria-label="secondary color #ADAC90" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ADAC90;"></span> <code>#ADAC90</code><br><span role="img" aria-label="accent color #837654" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#837654;"></span> <code>#837654</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3EAE1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3EAE1;"></span> <code>#F3EAE1</code><br><span role="img" aria-label="surface color #F7F7F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7F4;"></span> <code>#F7F7F4</code><br><span role="img" aria-label="accent color #48412E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#48412E;"></span> <code>#48412E</code><br><span role="img" aria-label="chart color #654526" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#654526;"></span> <code>#654526</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.055 / 14.458 / 9.447 / 7.263 | 適合 | 確認事項なし | 気づきと準備を照らす灯りの色。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-low-2` | 整頓しようとする深い青 | <span role="img" aria-label="primary color #5D748A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5D748A;"></span> <code>#5D748A</code><br><span role="img" aria-label="secondary color #AC9F96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#AC9F96;"></span> <code>#AC9F96</code><br><span role="img" aria-label="accent color #726668" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#726668;"></span> <code>#726668</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E5E9EC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E5E9EC;"></span> <code>#E5E9EC</code><br><span role="img" aria-label="surface color #F7F5F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F5F5;"></span> <code>#F7F5F5</code><br><span role="img" aria-label="accent color #3F3839" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F3839;"></span> <code>#3F3839</code><br><span role="img" aria-label="chart color #33404C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#33404C;"></span> <code>#33404C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.709 / 14.287 / 10.530 / 8.693 | 適合 | 確認事項なし | 不確実さを段取りで整理する青。 |
| `palette-pair-conscientiousness-high-and-emotionalstability-low-3` | 灯火の淡い黄色 | <span role="img" aria-label="primary color #8B8191" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8B8191;"></span> <code>#8B8191</code><br><span role="img" aria-label="secondary color #AD9FBC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#AD9FBC;"></span> <code>#AD9FBC</code><br><span role="img" aria-label="accent color #776984" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#776984;"></span> <code>#776984</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #ECEBED" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ECEBED;"></span> <code>#ECEBED</code><br><span role="img" aria-label="surface color #F7F5F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F5F8;"></span> <code>#F7F5F8</code><br><span role="img" aria-label="accent color #413A49" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#413A49;"></span> <code>#413A49</code><br><span role="img" aria-label="chart color #4C4750" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C4750;"></span> <code>#4C4750</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.059 / 14.314 / 10.057 / 7.603 | 適合 | 確認事項なし | 繊細さと規律が重なる色。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-high-1` | 流れる水の淡いブルー | <span role="img" aria-label="primary color #6DA6A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6DA6A3;"></span> <code>#6DA6A3</code><br><span role="img" aria-label="secondary color #93BBB1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#93BBB1;"></span> <code>#93BBB1</code><br><span role="img" aria-label="accent color #5E8B83" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5E8B83;"></span> <code>#5E8B83</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E8F1F0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E8F1F0;"></span> <code>#E8F1F0</code><br><span role="img" aria-label="surface color #F4F8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F8F7;"></span> <code>#F4F8F7</code><br><span role="img" aria-label="accent color #344C48" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#344C48;"></span> <code>#344C48</code><br><span role="img" aria-label="chart color #3C5B5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3C5B5A;"></span> <code>#3C5B5A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.502 / 14.496 / 8.629 / 6.442 | 適合 | 確認事項なし | 流れに合わせて形を変える青緑。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-high-2` | 軽やかな風の若草色 | <span role="img" aria-label="primary color #78A665" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#78A665;"></span> <code>#78A665</code><br><span role="img" aria-label="secondary color #B6B089" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B6B089;"></span> <code>#B6B089</code><br><span role="img" aria-label="accent color #807F56" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#807F56;"></span> <code>#807F56</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E9F1E6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E9F1E6;"></span> <code>#E9F1E6</code><br><span role="img" aria-label="surface color #F8F7F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F3;"></span> <code>#F8F7F3</code><br><span role="img" aria-label="accent color #46462F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#46462F;"></span> <code>#46462F</code><br><span role="img" aria-label="chart color #425B38" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#425B38;"></span> <code>#425B38</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.441 / 14.476 / 8.996 / 6.531 | 適合 | 確認事項なし | 落ち着いて移動する空気感。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-high-3` | 漂う雲の白 | <span role="img" aria-label="primary color #B9A17D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B9A17D;"></span> <code>#B9A17D</code><br><span role="img" aria-label="secondary color #BDAAB5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BDAAB5;"></span> <code>#BDAAB5</code><br><span role="img" aria-label="accent color #8E797A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8E797A;"></span> <code>#8E797A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F4F0EA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F0EA;"></span> <code>#F4F0EA</code><br><span role="img" aria-label="surface color #F8F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F7F8;"></span> <code>#F8F7F8</code><br><span role="img" aria-label="accent color #4E4343" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E4343;"></span> <code>#4E4343</code><br><span role="img" aria-label="chart color #665945" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665945;"></span> <code>#665945</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.669 / 14.521 / 8.901 / 6.006 | 適合 | 確認事項なし | 成り行きを受け止める穏やかな色。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-low-1` | 揺れる影の深い紫灰 | <span role="img" aria-label="primary color #8E738A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8E738A;"></span> <code>#8E738A</code><br><span role="img" aria-label="secondary color #9EA9A8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9EA9A8;"></span> <code>#9EA9A8</code><br><span role="img" aria-label="accent color #6F7177" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F7177;"></span> <code>#6F7177</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EDE9EC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EDE9EC;"></span> <code>#EDE9EC</code><br><span role="img" aria-label="surface color #F5F6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F6F6;"></span> <code>#F5F6F6</code><br><span role="img" aria-label="accent color #3D3E41" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D3E41;"></span> <code>#3D3E41</code><br><span role="img" aria-label="chart color #4E3F4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4E3F4C;"></span> <code>#4E3F4C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.908 / 14.332 / 9.877 / 8.165 | 適合 | 確認事項なし | 感情や状況の揺らぎを象徴する紫灰。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-low-2` | 繊細な感性の淡いブルーグレー | <span role="img" aria-label="primary color #758EA0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#758EA0;"></span> <code>#758EA0</code><br><span role="img" aria-label="secondary color #B5A89D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B5A89D;"></span> <code>#B5A89D</code><br><span role="img" aria-label="accent color #7E7373" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7E7373;"></span> <code>#7E7373</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E9EDF0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E9EDF0;"></span> <code>#E9EDF0</code><br><span role="img" aria-label="surface color #F8F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F6F5;"></span> <code>#F8F6F5</code><br><span role="img" aria-label="accent color #453F3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#453F3F;"></span> <code>#453F3F</code><br><span role="img" aria-label="chart color #404E58" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#404E58;"></span> <code>#404E58</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.180 / 14.403 / 9.575 / 7.284 | 適合 | 確認事項なし | 定まらない歩みを静かに表す青。 |
| `palette-pair-conscientiousness-low-and-emotionalstability-low-3` | 儚い光のベージュ | <span role="img" aria-label="primary color #B69A72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B69A72;"></span> <code>#B69A72</code><br><span role="img" aria-label="secondary color #BCA8B1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BCA8B1;"></span> <code>#BCA8B1</code><br><span role="img" aria-label="accent color #8C7675" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C7675;"></span> <code>#8C7675</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F3EFE8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3EFE8;"></span> <code>#F3EFE8</code><br><span role="img" aria-label="surface color #F8F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F6F7;"></span> <code>#F8F6F7</code><br><span role="img" aria-label="accent color #4D4140" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D4140;"></span> <code>#4D4140</code><br><span role="img" aria-label="chart color #64553F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#64553F;"></span> <code>#64553F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.539 / 14.422 / 9.096 / 6.290 | 適合 | 確認事項なし | 夕暮れの曖昧な輪郭を思わせる色。 |
| `palette-pair-extraversion-high-and-agreeableness-high-1` | 華やかなコーラルピンク | <span role="img" aria-label="primary color #D96F67" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D96F67;"></span> <code>#D96F67</code><br><span role="img" aria-label="secondary color #B9A89C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B9A89C;"></span> <code>#B9A89C</code><br><span role="img" aria-label="accent color #946F65" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#946F65;"></span> <code>#946F65</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9E8E7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9E8E7;"></span> <code>#F9E8E7</code><br><span role="img" aria-label="surface color #F8F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F6F5;"></span> <code>#F8F6F5</code><br><span role="img" aria-label="accent color #513D38" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#513D38;"></span> <code>#513D38</code><br><span role="img" aria-label="chart color #773D39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#773D39;"></span> <code>#773D39</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.097 / 14.403 / 9.396 / 7.059 | 適合 | 確認事項なし | 人と一緒に場へ踏み出す温かい色。 |
| `palette-pair-extraversion-high-and-agreeableness-high-2` | 共演する明るいターコイズ | <span role="img" aria-label="primary color #3F9C98" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F9C98;"></span> <code>#3F9C98</code><br><span role="img" aria-label="secondary color #A2AD9B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A2AD9B;"></span> <code>#A2AD9B</code><br><span role="img" aria-label="accent color #637A6F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#637A6F;"></span> <code>#637A6F</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E0EFEF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E0EFEF;"></span> <code>#E0EFEF</code><br><span role="img" aria-label="surface color #F6F7F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F5;"></span> <code>#F6F7F5</code><br><span role="img" aria-label="accent color #36433D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#36433D;"></span> <code>#36433D</code><br><span role="img" aria-label="chart color #235654" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#235654;"></span> <code>#235654</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.125 / 14.440 / 9.640 / 7.019 | 適合 | 確認事項なし | 協力しながら動く軽快な青緑。 |
| `palette-pair-extraversion-high-and-agreeableness-high-3` | 活気ある黄金色 | <span role="img" aria-label="primary color #D0A24C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D0A24C;"></span> <code>#D0A24C</code><br><span role="img" aria-label="secondary color #C5AAA4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C5AAA4;"></span> <code>#C5AAA4</code><br><span role="img" aria-label="accent color #997A62" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#997A62;"></span> <code>#997A62</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F7F0E2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F0E2;"></span> <code>#F7F0E2</code><br><span role="img" aria-label="surface color #F9F7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F6;"></span> <code>#F9F7F6</code><br><span role="img" aria-label="accent color #544336" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#544336;"></span> <code>#544336</code><br><span role="img" aria-label="chart color #72592A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#72592A;"></span> <code>#72592A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.683 / 14.530 / 8.805 / 5.827 | 適合 | 確認事項なし | 共有される喜びを象徴する色。 |
| `palette-pair-extraversion-high-and-agreeableness-low-1` | 強烈な個性の赤 | <span role="img" aria-label="primary color #C8564F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C8564F;"></span> <code>#C8564F</code><br><span role="img" aria-label="secondary color #B39F93" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B39F93;"></span> <code>#B39F93</code><br><span role="img" aria-label="accent color #8C6359" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8C6359;"></span> <code>#8C6359</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6E4E3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6E4E3;"></span> <code>#F6E4E3</code><br><span role="img" aria-label="surface color #F7F5F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F5F4;"></span> <code>#F7F5F4</code><br><span role="img" aria-label="accent color #4D3631" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D3631;"></span> <code>#4D3631</code><br><span role="img" aria-label="chart color #6E2F2B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E2F2B;"></span> <code>#6E2F2B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.654 / 14.278 / 10.236 / 8.137 | 適合 | 確認事項なし | 自分の色を明確に掲げる赤。 |
| `palette-pair-extraversion-high-and-agreeableness-low-2` | 鮮やかな対比の深い青 | <span role="img" aria-label="primary color #3E6485" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3E6485;"></span> <code>#3E6485</code><br><span role="img" aria-label="secondary color #A19994" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A19994;"></span> <code>#A19994</code><br><span role="img" aria-label="accent color #635E66" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#635E66;"></span> <code>#635E66</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E0E6EB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E0E6EB;"></span> <code>#E0E6EB</code><br><span role="img" aria-label="surface color #F6F5F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F5F4;"></span> <code>#F6F5F4</code><br><span role="img" aria-label="accent color #363438" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#363438;"></span> <code>#363438</code><br><span role="img" aria-label="chart color #223749" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#223749;"></span> <code>#223749</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.331 / 14.251 / 11.310 / 9.755 | 適合 | 確認事項なし | 周囲に流されない判断を表す青。 |
| `palette-pair-extraversion-high-and-agreeableness-low-3` | 揺るがない信念のマゼンタ | <span role="img" aria-label="primary color #A94F7A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A94F7A;"></span> <code>#A94F7A</code><br><span role="img" aria-label="secondary color #B78DB4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B78DB4;"></span> <code>#B78DB4</code><br><span role="img" aria-label="accent color #865079" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#865079;"></span> <code>#865079</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F1E3EA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F1E3EA;"></span> <code>#F1E3EA</code><br><span role="img" aria-label="surface color #F8F4F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F4F8;"></span> <code>#F8F4F8</code><br><span role="img" aria-label="accent color #4A2C43" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A2C43;"></span> <code>#4A2C43</code><br><span role="img" aria-label="chart color #5D2B43" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5D2B43;"></span> <code>#5D2B43</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.500 / 14.252 / 11.133 / 8.941 | 適合 | 確認事項なし | 存在感のある主張を象徴する色。 |
| `palette-pair-extraversion-low-and-agreeableness-high-1` | 寄り添う淡いセージグリーン | <span role="img" aria-label="primary color #8FA18A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8FA18A;"></span> <code>#8FA18A</code><br><span role="img" aria-label="secondary color #9FB9A8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9FB9A8;"></span> <code>#9FB9A8</code><br><span role="img" aria-label="accent color #6F8877" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6F8877;"></span> <code>#6F8877</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EDF0EC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EDF0EC;"></span> <code>#EDF0EC</code><br><span role="img" aria-label="surface color #F5F8F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F8F6;"></span> <code>#F5F8F6</code><br><span role="img" aria-label="accent color #3D4B41" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D4B41;"></span> <code>#3D4B41</code><br><span role="img" aria-label="chart color #4F594C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F594C;"></span> <code>#4F594C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.505 / 14.513 / 8.610 / 6.377 | 適合 | 確認事項なし | 静かな場所から相手を見守る緑。 |
| `palette-pair-extraversion-low-and-agreeableness-high-2` | 静観するブルーグレー | <span role="img" aria-label="primary color #728C9B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#728C9B;"></span> <code>#728C9B</code><br><span role="img" aria-label="secondary color #B4A79C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B4A79C;"></span> <code>#B4A79C</code><br><span role="img" aria-label="accent color #7D7271" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7D7271;"></span> <code>#7D7271</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E8EDEF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E8EDEF;"></span> <code>#E8EDEF</code><br><span role="img" aria-label="surface color #F8F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F6F5;"></span> <code>#F8F6F5</code><br><span role="img" aria-label="accent color #453F3E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#453F3E;"></span> <code>#453F3E</code><br><span role="img" aria-label="chart color #3F4D55" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F4D55;"></span> <code>#3F4D55</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.147 / 14.403 / 9.585 / 7.400 | 適合 | 確認事項なし | 控えめな支えを表す青灰。 |
| `palette-pair-extraversion-low-and-agreeableness-high-3` | 安らぎのパールホワイト | <span role="img" aria-label="primary color #C5A0A2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C5A0A2;"></span> <code>#C5A0A2</code><br><span role="img" aria-label="secondary color #C1AAC2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C1AAC2;"></span> <code>#C1AAC2</code><br><span role="img" aria-label="accent color #94798D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#94798D;"></span> <code>#94798D</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6F0F0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F0F0;"></span> <code>#F6F0F0</code><br><span role="img" aria-label="surface color #F9F7F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F9;"></span> <code>#F9F7F9</code><br><span role="img" aria-label="accent color #51434E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#51434E;"></span> <code>#51434E</code><br><span role="img" aria-label="chart color #6C5859" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C5859;"></span> <code>#6C5859</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.774 / 14.557 / 8.706 / 5.866 | 適合 | 確認事項なし | 言葉にしすぎない温かさ。 |
| `palette-pair-extraversion-low-and-agreeableness-low-1` | 孤独を愛する深い紺 | <span role="img" aria-label="primary color #465469" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#465469;"></span> <code>#465469</code><br><span role="img" aria-label="secondary color #859E9C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#859E9C;"></span> <code>#859E9C</code><br><span role="img" aria-label="accent color #4B6266" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B6266;"></span> <code>#4B6266</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E1E4E7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E1E4E7;"></span> <code>#E1E4E7</code><br><span role="img" aria-label="surface color #F3F5F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F5F5;"></span> <code>#F3F5F5</code><br><span role="img" aria-label="accent color #293638" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#293638;"></span> <code>#293638</code><br><span role="img" aria-label="chart color #272E3A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#272E3A;"></span> <code>#272E3A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.158 / 14.181 / 11.429 / 10.696 | 適合 | 確認事項なし | 自分に合う距離を選ぶ深い青。 |
| `palette-pair-extraversion-low-and-agreeableness-low-2` | 自分の席を守るグレー | <span role="img" aria-label="primary color #777C7E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#777C7E;"></span> <code>#777C7E</code><br><span role="img" aria-label="secondary color #B5A292" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B5A292;"></span> <code>#B5A292</code><br><span role="img" aria-label="accent color #7F6A62" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7F6A62;"></span> <code>#7F6A62</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E9EAEA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E9EAEA;"></span> <code>#E9EAEA</code><br><span role="img" aria-label="surface color #F8F6F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F6F4;"></span> <code>#F8F6F4</code><br><span role="img" aria-label="accent color #463A36" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#463A36;"></span> <code>#463A36</code><br><span role="img" aria-label="chart color #414445" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#414445;"></span> <code>#414445</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.874 / 14.394 / 10.152 / 8.150 | 適合 | 確認事項なし | 必要な場所に静かに留まる色。 |
| `palette-pair-extraversion-low-and-agreeableness-low-3` | 静寂を湛えるブラウン | <span role="img" aria-label="primary color #9A644A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A644A;"></span> <code>#9A644A</code><br><span role="img" aria-label="secondary color #B295A3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B295A3;"></span> <code>#B295A3</code><br><span role="img" aria-label="accent color #7E5B61" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7E5B61;"></span> <code>#7E5B61</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EFE6E2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EFE6E2;"></span> <code>#EFE6E2</code><br><span role="img" aria-label="surface color #F7F4F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F4F6;"></span> <code>#F7F4F6</code><br><span role="img" aria-label="accent color #453235" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#453235;"></span> <code>#453235</code><br><span role="img" aria-label="chart color #553729" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#553729;"></span> <code>#553729</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.626 / 14.207 / 10.920 / 8.697 | 適合 | 確認事項なし | 自分の居場所を象徴する木の色。 |
| `palette-pair-extraversion-high-and-emotionalstability-high-1` | 心を寛げる明るいターコイズ | <span role="img" aria-label="primary color #4B9C96" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4B9C96;"></span> <code>#4B9C96</code><br><span role="img" aria-label="secondary color #87B7AC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#87B7AC;"></span> <code>#87B7AC</code><br><span role="img" aria-label="accent color #4D867D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D867D;"></span> <code>#4D867D</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E2EFEE" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E2EFEE;"></span> <code>#E2EFEE</code><br><span role="img" aria-label="surface color #F3F8F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F3F8F7;"></span> <code>#F3F8F7</code><br><span role="img" aria-label="accent color #2A4A45" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2A4A45;"></span> <code>#2A4A45</code><br><span role="img" aria-label="chart color #295653" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#295653;"></span> <code>#295653</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.164 / 14.469 / 9.049 / 6.985 | 適合 | 確認事項なし | 交流の中でも自然体でいる青緑。 |
| `palette-pair-extraversion-high-and-emotionalstability-high-2` | 安定した社交のコーラル | <span role="img" aria-label="primary color #D97A6B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D97A6B;"></span> <code>#D97A6B</code><br><span role="img" aria-label="secondary color #D8A18B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#D8A18B;"></span> <code>#D8A18B</code><br><span role="img" aria-label="accent color #B06959" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B06959;"></span> <code>#B06959</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F9EAE7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9EAE7;"></span> <code>#F9EAE7</code><br><span role="img" aria-label="surface color #FBF6F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#FBF6F3;"></span> <code>#FBF6F3</code><br><span role="img" aria-label="accent color #613A31" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#613A31;"></span> <code>#613A31</code><br><span role="img" aria-label="chart color #77433B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#77433B;"></span> <code>#77433B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.265 / 14.467 / 9.073 / 6.773 | 適合 | 確認事項なし | 穏やかな活気を表す色。 |
| `palette-pair-extraversion-high-and-emotionalstability-high-3` | 包容力あるスカイブルー | <span role="img" aria-label="primary color #557FBD" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#557FBD;"></span> <code>#557FBD</code><br><span role="img" aria-label="secondary color #9A9ECB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A9ECB;"></span> <code>#9A9ECB</code><br><span role="img" aria-label="accent color #5C689A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5C689A;"></span> <code>#5C689A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E4EBF4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E4EBF4;"></span> <code>#E4EBF4</code><br><span role="img" aria-label="surface color #F5F5FA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F5FA;"></span> <code>#F5F5FA</code><br><span role="img" aria-label="accent color #333955" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#333955;"></span> <code>#333955</code><br><span role="img" aria-label="chart color #2F4668" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2F4668;"></span> <code>#2F4668</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.923 / 14.279 / 10.405 / 7.961 | 適合 | 確認事項なし | 開放感と落ち着きが重なる青。 |
| `palette-pair-extraversion-high-and-emotionalstability-low-1` | ざわめきを象徴する鮮やかなコーラル | <span role="img" aria-label="primary color #CF6F72" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#CF6F72;"></span> <code>#CF6F72</code><br><span role="img" aria-label="secondary color #B5A8A0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B5A8A0;"></span> <code>#B5A8A0</code><br><span role="img" aria-label="accent color #8F6F6B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8F6F6B;"></span> <code>#8F6F6B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F7E8E8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7E8E8;"></span> <code>#F7E8E8</code><br><span role="img" aria-label="surface color #F8F6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F6F6;"></span> <code>#F8F6F6</code><br><span role="img" aria-label="accent color #4F3D3B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4F3D3B;"></span> <code>#4F3D3B</code><br><span role="img" aria-label="chart color #723D3F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#723D3F;"></span> <code>#723D3F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.052 / 14.413 / 9.454 / 7.195 | 適合 | 確認事項なし | 人の反応へ敏感に振り向く色。 |
| `palette-pair-extraversion-high-and-emotionalstability-low-2` | 揺らぐ感情のターコイズ | <span role="img" aria-label="primary color #4D9FAD" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4D9FAD;"></span> <code>#4D9FAD</code><br><span role="img" aria-label="secondary color #A7AEA2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A7AEA2;"></span> <code>#A7AEA2</code><br><span role="img" aria-label="accent color #6A7C7A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6A7C7A;"></span> <code>#6A7C7A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E3F0F2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E3F0F2;"></span> <code>#E3F0F2</code><br><span role="img" aria-label="surface color #F6F7F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F7F6;"></span> <code>#F6F7F6</code><br><span role="img" aria-label="accent color #3A4443" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A4443;"></span> <code>#3A4443</code><br><span role="img" aria-label="chart color #2A575F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2A575F;"></span> <code>#2A575F</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.310 / 14.449 / 9.366 / 6.857 | 適合 | 確認事項なし | 交流へ踏み出す軽快な青。 |
| `palette-pair-extraversion-high-and-emotionalstability-low-3` | 参加意欲を包む淡い紫 | <span role="img" aria-label="primary color #9A7FA9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9A7FA9;"></span> <code>#9A7FA9</code><br><span role="img" aria-label="secondary color #B29EC4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B29EC4;"></span> <code>#B29EC4</code><br><span role="img" aria-label="accent color #7E6890" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7E6890;"></span> <code>#7E6890</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EFEBF1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EFEBF1;"></span> <code>#EFEBF1</code><br><span role="img" aria-label="surface color #F7F5F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F5F9;"></span> <code>#F7F5F9</code><br><span role="img" aria-label="accent color #45394F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#45394F;"></span> <code>#45394F</code><br><span role="img" aria-label="chart color #55465D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#55465D;"></span> <code>#55465D</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.171 / 14.323 / 9.934 / 7.364 | 適合 | 確認事項なし | 周囲の気配が残る余韻を表す紫。 |
| `palette-pair-extraversion-low-and-emotionalstability-high-1` | 芽吹きを待つ若葉色 | <span role="img" aria-label="primary color #879C78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#879C78;"></span> <code>#879C78</code><br><span role="img" aria-label="secondary color #9CB7A2" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9CB7A2;"></span> <code>#9CB7A2</code><br><span role="img" aria-label="accent color #6B866E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B866E;"></span> <code>#6B866E</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #ECEFE9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ECEFE9;"></span> <code>#ECEFE9</code><br><span role="img" aria-label="surface color #F5F8F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F8F6;"></span> <code>#F5F8F6</code><br><span role="img" aria-label="accent color #3B4A3D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3B4A3D;"></span> <code>#3B4A3D</code><br><span role="img" aria-label="chart color #4A5642" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A5642;"></span> <code>#4A5642</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.367 / 14.513 / 8.796 / 6.698 | 適合 | 確認事項なし | 静かに時機を待つ若葉の色。 |
| `palette-pair-extraversion-low-and-emotionalstability-high-2` | 安定した待機の深い緑 | <span role="img" aria-label="primary color #6D8492" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6D8492;"></span> <code>#6D8492</code><br><span role="img" aria-label="secondary color #B2A599" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B2A599;"></span> <code>#B2A599</code><br><span role="img" aria-label="accent color #7A6E6C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7A6E6C;"></span> <code>#7A6E6C</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E8EBEE" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E8EBEE;"></span> <code>#E8EBEE</code><br><span role="img" aria-label="surface color #F7F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F6F5;"></span> <code>#F7F6F5</code><br><span role="img" aria-label="accent color #433D3B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#433D3B;"></span> <code>#433D3B</code><br><span role="img" aria-label="chart color #3C4950" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3C4950;"></span> <code>#3C4950</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.968 / 14.377 / 9.879 / 7.762 | 適合 | 確認事項なし | 落ち着いた場所に留まる青灰。 |
| `palette-pair-extraversion-low-and-emotionalstability-high-3` | 静かな期待の白 | <span role="img" aria-label="primary color #C2AD8E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C2AD8E;"></span> <code>#C2AD8E</code><br><span role="img" aria-label="secondary color #C0AEBB" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C0AEBB;"></span> <code>#C0AEBB</code><br><span role="img" aria-label="accent color #927F83" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#927F83;"></span> <code>#927F83</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5F2ED" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F2ED;"></span> <code>#F5F2ED</code><br><span role="img" aria-label="surface color #F9F7F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F9F7F8;"></span> <code>#F9F7F8</code><br><span role="img" aria-label="accent color #504648" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#504648;"></span> <code>#504648</code><br><span role="img" aria-label="chart color #6B5F4E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6B5F4E;"></span> <code>#6B5F4E</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.897 / 14.548 / 8.520 / 5.577 | 適合 | 確認事項なし | ゆっくり始まる変化を象徴する色。 |
| `palette-pair-extraversion-low-and-emotionalstability-low-1` | 薄明のスレートブルー | <span role="img" aria-label="primary color #5C748B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5C748B;"></span> <code>#5C748B</code><br><span role="img" aria-label="secondary color #8DA9A8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8DA9A8;"></span> <code>#8DA9A8</code><br><span role="img" aria-label="accent color #567277" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#567277;"></span> <code>#567277</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E5E9EC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E5E9EC;"></span> <code>#E5E9EC</code><br><span role="img" aria-label="surface color #F4F6F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F6F6;"></span> <code>#F4F6F6</code><br><span role="img" aria-label="accent color #2F3F41" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#2F3F41;"></span> <code>#2F3F41</code><br><span role="img" aria-label="chart color #33404C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#33404C;"></span> <code>#33404C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.709 / 14.306 / 10.146 / 8.693 | 適合 | 確認事項なし | 夜と朝の境界に耳を澄ます青。 |
| `palette-pair-extraversion-low-and-emotionalstability-low-2` | 繊細な夜明けの紫灰 | <span role="img" aria-label="primary color #8566A1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8566A1;"></span> <code>#8566A1</code><br><span role="img" aria-label="secondary color #BA9A9E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BA9A9E;"></span> <code>#BA9A9E</code><br><span role="img" aria-label="accent color #865F74" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#865F74;"></span> <code>#865F74</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EBE7F0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EBE7F0;"></span> <code>#EBE7F0</code><br><span role="img" aria-label="surface color #F8F5F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F5F5;"></span> <code>#F8F5F5</code><br><span role="img" aria-label="accent color #4A3440" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A3440;"></span> <code>#4A3440</code><br><span role="img" aria-label="chart color #493859" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#493859;"></span> <code>#493859</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.725 / 14.314 / 10.435 / 8.640 | 適合 | 確認事項なし | 静けさと繊細さが重なる紫灰。 |
| `palette-pair-extraversion-low-and-emotionalstability-low-3` | 静寂を湛えるセージグレー | <span role="img" aria-label="primary color #5D8870" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5D8870;"></span> <code>#5D8870</code><br><span role="img" aria-label="secondary color #9DA1B0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9DA1B0;"></span> <code>#9DA1B0</code><br><span role="img" aria-label="accent color #606D74" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#606D74;"></span> <code>#606D74</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E5ECE8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E5ECE8;"></span> <code>#E5ECE8</code><br><span role="img" aria-label="surface color #F5F6F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F6F7;"></span> <code>#F5F6F7</code><br><span role="img" aria-label="accent color #353C40" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#353C40;"></span> <code>#353C40</code><br><span role="img" aria-label="chart color #334B3E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#334B3E;"></span> <code>#334B3E</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.928 / 14.341 / 10.369 / 7.892 | 適合 | 確認事項なし | 刺激を抑えた森の気配を表す色。 |
| `palette-pair-agreeableness-high-and-emotionalstability-high-1` | 調和する淡いピンク | <span role="img" aria-label="primary color #C58C91" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#C58C91;"></span> <code>#C58C91</code><br><span role="img" aria-label="secondary color #B2B2AA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#B2B2AA;"></span> <code>#B2B2AA</code><br><span role="img" aria-label="accent color #8A7E7A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8A7E7A;"></span> <code>#8A7E7A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F6EDED" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6EDED;"></span> <code>#F6EDED</code><br><span role="img" aria-label="surface color #F7F7F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7F7;"></span> <code>#F7F7F7</code><br><span role="img" aria-label="accent color #4C4543" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C4543;"></span> <code>#4C4543</code><br><span role="img" aria-label="chart color #6C4D50" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C4D50;"></span> <code>#6C4D50</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.489 / 14.485 / 8.753 / 6.485 | 適合 | 確認事項なし | 穏やかに向かい合う温かな色。 |
| `palette-pair-agreeableness-high-and-emotionalstability-high-2` | 穏やかな共有のミントグリーン | <span role="img" aria-label="primary color #659B6D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#659B6D;"></span> <code>#659B6D</code><br><span role="img" aria-label="secondary color #AFAD8C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#AFAD8C;"></span> <code>#AFAD8C</code><br><span role="img" aria-label="accent color #767A5A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#767A5A;"></span> <code>#767A5A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E6EFE8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E6EFE8;"></span> <code>#E6EFE8</code><br><span role="img" aria-label="surface color #F7F7F4" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7F4;"></span> <code>#F7F7F4</code><br><span role="img" aria-label="accent color #414332" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#414332;"></span> <code>#414332</code><br><span role="img" aria-label="chart color #38553C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#38553C;"></span> <code>#38553C</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.210 / 14.458 / 9.435 / 7.058 | 適合 | 確認事項なし | 落ち着いた協調を象徴する緑。 |
| `palette-pair-agreeableness-high-and-emotionalstability-high-3` | 安定した共存のブルーグレー | <span role="img" aria-label="primary color #6E909E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E909E;"></span> <code>#6E909E</code><br><span role="img" aria-label="secondary color #A3A4C0" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A3A4C0;"></span> <code>#A3A4C0</code><br><span role="img" aria-label="accent color #68718B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#68718B;"></span> <code>#68718B</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E8EDEF" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E8EDEF;"></span> <code>#E8EDEF</code><br><span role="img" aria-label="surface color #F6F6F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F6F9;"></span> <code>#F6F6F9</code><br><span role="img" aria-label="accent color #393E4C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#393E4C;"></span> <code>#393E4C</code><br><span role="img" aria-label="chart color #3D4F57" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D4F57;"></span> <code>#3D4F57</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.147 / 14.386 / 9.896 / 7.249 | 適合 | 確認事項なし | 感情に流されず関係を保つ青。 |
| `palette-pair-agreeableness-high-and-emotionalstability-low-1` | 共鳴し揺れるローズピンク | <span role="img" aria-label="primary color #BE8695" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BE8695;"></span> <code>#BE8695</code><br><span role="img" aria-label="secondary color #AFB0AC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#AFB0AC;"></span> <code>#AFB0AC</code><br><span role="img" aria-label="accent color #877B7C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#877B7C;"></span> <code>#877B7C</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #F5ECEE" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5ECEE;"></span> <code>#F5ECEE</code><br><span role="img" aria-label="surface color #F7F7F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F7F7;"></span> <code>#F7F7F7</code><br><span role="img" aria-label="accent color #4A4444" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A4444;"></span> <code>#4A4444</code><br><span role="img" aria-label="chart color #694A52" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#694A52;"></span> <code>#694A52</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.386 / 14.485 / 8.904 / 6.704 | 適合 | 確認事項なし | 相手の気配を細やかに受け取る色。 |
| `palette-pair-agreeableness-high-and-emotionalstability-low-2` | 温かな寄り添いの淡い紫 | <span role="img" aria-label="primary color #8464AA" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8464AA;"></span> <code>#8464AA</code><br><span role="img" aria-label="secondary color #BA99A1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#BA99A1;"></span> <code>#BA99A1</code><br><span role="img" aria-label="accent color #865E78" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#865E78;"></span> <code>#865E78</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EBE6F1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EBE6F1;"></span> <code>#EBE6F1</code><br><span role="img" aria-label="surface color #F8F5F6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F8F5F6;"></span> <code>#F8F5F6</code><br><span role="img" aria-label="accent color #4A3442" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4A3442;"></span> <code>#4A3442</code><br><span role="img" aria-label="chart color #49375E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#49375E;"></span> <code>#49375E</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.652 / 14.323 / 10.415 / 8.598 | 適合 | 確認事項なし | 関係の揺らぎに寄り添う紫。 |
| `palette-pair-agreeableness-high-and-emotionalstability-low-3` | 繊細な調和のライトブルー | <span role="img" aria-label="primary color #7A97A5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#7A97A5;"></span> <code>#7A97A5</code><br><span role="img" aria-label="secondary color #A7A7C3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A7A7C3;"></span> <code>#A7A7C3</code><br><span role="img" aria-label="accent color #6E748E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6E748E;"></span> <code>#6E748E</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EAEEF1" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EAEEF1;"></span> <code>#EAEEF1</code><br><span role="img" aria-label="surface color #F6F6F9" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F6F9;"></span> <code>#F6F6F9</code><br><span role="img" aria-label="accent color #3D404E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3D404E;"></span> <code>#3D404E</code><br><span role="img" aria-label="chart color #43535B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#43535B;"></span> <code>#43535B</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 13.300 / 14.386 / 9.535 / 6.851 | 適合 | 確認事項なし | 周囲の変化を映す柔らかな青。 |
| `palette-pair-agreeableness-low-and-emotionalstability-high-1` | 淡々とした理性のグレー | <span role="img" aria-label="primary color #5E6A70" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#5E6A70;"></span> <code>#5E6A70</code><br><span role="img" aria-label="secondary color #8DA69F" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8DA69F;"></span> <code>#8DA69F</code><br><span role="img" aria-label="accent color #576D6A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#576D6A;"></span> <code>#576D6A</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E5E7E8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E5E7E8;"></span> <code>#E5E7E8</code><br><span role="img" aria-label="surface color #F4F6F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F4F6F5;"></span> <code>#F4F6F5</code><br><span role="img" aria-label="accent color #303C3A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#303C3A;"></span> <code>#303C3A</code><br><span role="img" aria-label="chart color #343A3E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#343A3E;"></span> <code>#343A3E</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.508 / 14.297 / 10.554 / 9.297 | 適合 | 確認事項なし | 感情に流されず立場を示す灰青。 |
| `palette-pair-agreeableness-low-and-emotionalstability-high-2` | 揺るがない安定の深い青 | <span role="img" aria-label="primary color #3F5368" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3F5368;"></span> <code>#3F5368</code><br><span role="img" aria-label="secondary color #A2938A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A2938A;"></span> <code>#A2938A</code><br><span role="img" aria-label="accent color #635657" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#635657;"></span> <code>#635657</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E0E3E7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E0E3E7;"></span> <code>#E0E3E7</code><br><span role="img" aria-label="surface color #F6F4F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F3;"></span> <code>#F6F4F3</code><br><span role="img" aria-label="accent color #362F30" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#362F30;"></span> <code>#362F30</code><br><span role="img" aria-label="chart color #232E39" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#232E39;"></span> <code>#232E39</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.053 / 14.153 / 11.925 / 10.721 | 適合 | 確認事項なし | 静かな確かさを持つ青。 |
| `palette-pair-agreeableness-low-and-emotionalstability-high-3` | 明快な表明のトープ | <span role="img" aria-label="primary color #8A7363" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#8A7363;"></span> <code>#8A7363</code><br><span role="img" aria-label="secondary color #AC9AAC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#AC9AAC;"></span> <code>#AC9AAC</code><br><span role="img" aria-label="accent color #76626D" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#76626D;"></span> <code>#76626D</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #ECE9E6" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#ECE9E6;"></span> <code>#ECE9E6</code><br><span role="img" aria-label="surface color #F7F5F7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F7F5F7;"></span> <code>#F7F5F7</code><br><span role="img" aria-label="accent color #41363C" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#41363C;"></span> <code>#41363C</code><br><span role="img" aria-label="chart color #4C3F36" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#4C3F36;"></span> <code>#4C3F36</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.832 / 14.305 / 10.650 / 8.382 | 適合 | 確認事項なし | 現実的で率直な印象を表す色。 |
| `palette-pair-agreeableness-low-and-emotionalstability-low-1` | 情熱的に鳴る深い赤 | <span role="img" aria-label="primary color #854E5E" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#854E5E;"></span> <code>#854E5E</code><br><span role="img" aria-label="secondary color #9B9C99" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#9B9C99;"></span> <code>#9B9C99</code><br><span role="img" aria-label="accent color #6A5F61" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6A5F61;"></span> <code>#6A5F61</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #EBE3E5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#EBE3E5;"></span> <code>#EBE3E5</code><br><span role="img" aria-label="surface color #F5F5F5" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F5F5F5;"></span> <code>#F5F5F5</code><br><span role="img" aria-label="accent color #3A3435" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3A3435;"></span> <code>#3A3435</code><br><span role="img" aria-label="chart color #492B34" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#492B34;"></span> <code>#492B34</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.304 / 14.233 / 11.182 / 9.921 | 適合 | 確認事項なし | 緊張感を含んだ明確な表明の色。 |
| `palette-pair-agreeableness-low-and-emotionalstability-low-2` | 嵐を見渡す深い青 | <span role="img" aria-label="primary color #44556A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#44556A;"></span> <code>#44556A</code><br><span role="img" aria-label="secondary color #A4948B" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A4948B;"></span> <code>#A4948B</code><br><span role="img" aria-label="accent color #665758" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#665758;"></span> <code>#665758</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E1E4E7" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E1E4E7;"></span> <code>#E1E4E7</code><br><span role="img" aria-label="surface color #F6F4F3" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F3;"></span> <code>#F6F4F3</code><br><span role="img" aria-label="accent color #383030" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#383030;"></span> <code>#383030</code><br><span role="img" aria-label="chart color #252F3A" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#252F3A;"></span> <code>#252F3A</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.158 / 14.153 / 11.724 / 10.640 | 適合 | 確認事項なし | 境界に立ち周囲を見渡す青。 |
| `palette-pair-agreeableness-low-and-emotionalstability-low-3` | 強い意志を示すプラム | <span role="img" aria-label="primary color #765792" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#765792;"></span> <code>#765792</code><br><span role="img" aria-label="secondary color #A590BC" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#A590BC;"></span> <code>#A590BC</code><br><span role="img" aria-label="accent color #6C5485" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#6C5485;"></span> <code>#6C5485</code> | background=primary/white/84%; surface=secondary/white/90%; accent=accent/black/45%; chart=primary/black/45% | <span role="img" aria-label="background color #E9E4EE" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#E9E4EE;"></span> <code>#E9E4EE</code><br><span role="img" aria-label="surface color #F6F4F8" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#F6F4F8;"></span> <code>#F6F4F8</code><br><span role="img" aria-label="accent color #3B2E49" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#3B2E49;"></span> <code>#3B2E49</code><br><span role="img" aria-label="chart color #413050" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#413050;"></span> <code>#413050</code><br><span role="img" aria-label="text color #1F2430" style="display:inline-block;width:1.25rem;height:1.25rem;vertical-align:middle;border:1px solid #1F2430;border-radius:0.2rem;background-color:#1F2430;"></span> <code>#1F2430</code> | 12.412 / 14.198 / 11.485 / 9.525 | 適合 | 確認事項なし | 細やかな反応と自己主張が重なる紫灰。 |

## P-1 香調語彙と素材（approved）

### まろやかな甘みの草花の香調（`fragrance-pause-roman-chamomile`）

- 場面: ひと息つきたい
- 系統: `floral`
- 説明: まろやかな甘みとやわらかな草花の気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: ローマンカモミール
- 共有投影: ローマンカモミール｜まろやかな甘みの草花の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 温かく穏やかな木質の香調（`fragrance-pause-sandalwood`）

- 場面: ひと息つきたい
- 系統: `woody`
- 説明: 温かみと丸みを帯びた木質の気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: サンダルウッド
- 共有投影: サンダルウッド｜温かく穏やかな木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### ほろ苦く明るい柑橘の香調（`fragrance-reset-grapefruit`）

- 場面: 気持ちを切り替えたい
- 系統: `citrus`
- 説明: ほろ苦さと明るさが重なる柑橘の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: グレープフルーツ
- 共有投影: グレープフルーツ｜ほろ苦く明るい柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### レモンを思わせる青い草の香調（`fragrance-reset-lemongrass`）

- 場面: 気持ちを切り替えたい
- 系統: `herbal`
- 説明: レモンを思わせる青い草の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: レモングラス
- 共有投影: レモングラス｜レモンを思わせる青い草の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### ほろ苦く端正な柑橘の香調（`fragrance-quiet-focus-bergamot`）

- 場面: 静かに取り組みたい
- 系統: `citrus`
- 説明: ほろ苦さと端正な輪郭を持つ柑橘の気配が、落ち着いた机辺と静かな時間を思わせる香調です。
- 素材例: ベルガモット
- 共有投影: ベルガモット｜ほろ苦く端正な柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 静かな樹脂の輪郭を含む木質の香調（`fragrance-quiet-focus-frankincense`）

- 場面: 静かに取り組みたい
- 系統: `resinous`
- 説明: 乾いた木質に静かな樹脂の輪郭が重なる気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: フランキンセンス
- 共有投影: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### やわらかな甘みの柑橘の香調（`fragrance-pause-sweet-orange`）

- 場面: ひと息つきたい
- 系統: `citrus`
- 説明: 丸みのある柑橘の明るさが、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: スイートオレンジ
- 共有投影: スイートオレンジ｜やわらかな甘みの柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 温かく穏やかなハーブの香調（`fragrance-pause-marjoram`）

- 場面: ひと息つきたい
- 系統: `herbal`
- 説明: 温かみのある穏やかな葉の気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: マジョラム
- 共有投影: マジョラム｜温かく穏やかなハーブの香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 青い葉と柑橘の香調（`fragrance-reset-petitgrain`）

- 場面: 気持ちを切り替えたい
- 系統: `citrus`
- 説明: 青い葉とほろ苦い柑橘が重なる気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: プチグレン
- 共有投影: プチグレン｜青い葉と柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 鮮やかで明るい柑橘の香調（`fragrance-reset-lemon`）

- 場面: 気持ちを切り替えたい
- 系統: `citrus`
- 説明: 鮮やかな明るさと軽い酸味を持つ柑橘の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: レモン
- 共有投影: レモン｜鮮やかで明るい柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 青く端正なハーブの香調（`fragrance-quiet-focus-rosemary`）

- 場面: 静かに取り組みたい
- 系統: `herbal`
- 説明: 青々とした葉と端正な輪郭を持つ気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: ローズマリー
- 共有投影: ローズマリー｜青く端正なハーブの香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 澄んだ針葉樹と青い実の香調（`fragrance-quiet-focus-juniper-berry`）

- 場面: 静かに取り組みたい
- 系統: `fresh`
- 説明: 澄んだ針葉樹と青い実を思わせる気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: ジュニパーベリー
- 共有投影: ジュニパーベリー｜澄んだ針葉樹と青い実の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 静かな森を思わせる木質の香調（`fragrance-pause-hinoki`）

- 場面: ひと息つきたい
- 系統: `woody`
- 説明: 穏やかな木の質感と静かな森を思わせる気配が、静かな余白のある情景を思わせる香調です。
- 素材例: ヒノキ
- 共有投影: ヒノキ｜静かな森を思わせる木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 透明感のある花と柑橘の香調（`fragrance-pause-neroli`）

- 場面: ひと息つきたい
- 系統: `floral`
- 説明: 繊細な花と明るい柑橘が重なる気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: ネロリ
- 共有投影: ネロリ｜透明感のある花と柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 風を受ける青い葉のハーブの香調（`fragrance-reset-rosemary`）

- 場面: 気持ちを切り替えたい
- 系統: `herbal`
- 説明: 青い葉が風を受ける気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: ローズマリー
- 共有投影: ローズマリー｜風を受ける青い葉のハーブの香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 軽快で透明な柑橘の香調（`fragrance-reset-lime`）

- 場面: 気持ちを切り替えたい
- 系統: `citrus`
- 説明: 軽快な酸味と透明感を持つ柑橘の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: ライム
- 共有投影: ライム｜軽快で透明な柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 湿り気を含む土と葉の香調（`fragrance-quiet-focus-patchouli`）

- 場面: 静かに取り組みたい
- 系統: `earthy`
- 説明: 湿った土と葉を思わせる深みのある気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: パチュリ
- 共有投影: パチュリ｜湿り気を含む土と葉の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 端正で清涼な木質の香調（`fragrance-quiet-focus-cypress`）

- 場面: 静かに取り組みたい
- 系統: `woody`
- 説明: 細身の木立を思わせる端正で清涼な気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: サイプレス
- 共有投影: サイプレス｜端正で清涼な木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 静かな甘みを含む花の香調（`fragrance-pause-true-lavender`）

- 場面: ひと息つきたい
- 系統: `floral`
- 説明: 静かな甘みと乾いた花を思わせる気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: 真正ラベンダー
- 共有投影: 真正ラベンダー｜静かな甘みを含む花の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### やわらかな花を含む木質の香調（`fragrance-pause-ho-wood`）

- 場面: ひと息つきたい
- 系統: `woody`
- 説明: なめらかな木質にやわらかな花のニュアンスが重なる気配が、静かな余白のある情景を思わせる穏やかな香調です。
- 素材例: ホーウッド
- 共有投影: ホーウッド｜やわらかな花を含む木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 明るく軽快な柑橘の香調（`fragrance-reset-bergamot`）

- 場面: 気持ちを切り替えたい
- 系統: `citrus`
- 説明: 明るい柑橘のほろ苦さが、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: ベルガモット
- 共有投影: ベルガモット｜明るく軽快な柑橘の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 鋭く澄んだ清涼の香調（`fragrance-reset-peppermint`）

- 場面: 気持ちを切り替えたい
- 系統: `fresh`
- 説明: ひんやりと澄んだ輪郭を持つ気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: ペパーミント
- 共有投影: ペパーミント｜鋭く澄んだ清涼の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 乾いた深みのある木質の香調（`fragrance-quiet-focus-cedarwood`）

- 場面: 静かに取り組みたい
- 系統: `woody`
- 説明: 乾いた木の質感を思わせる落ち着いた気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: シダーウッド
- 共有投影: シダーウッド｜乾いた深みのある木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 根と土を思わせる重厚な香調（`fragrance-quiet-focus-vetiver`）

- 場面: 静かに取り組みたい
- 系統: `earthy`
- 説明: 乾いた根と土の層を思わせる気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: ベチバー
- 共有投影: ベチバー｜根と土を思わせる重厚な香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 丸みのあるやさしい切替の香調（`fragrance-reset-mandarin`）

- 場面: 気持ちを切り替えたい
- 系統: `citrus`
- 説明: 丸みのある甘さと明るさが、丸みのあるやさしい切替を思わせる香調です。
- 素材例: マンダリン
- 共有投影: マンダリン｜丸みのあるやさしい切替の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 端正で澄んだ木質の香調（`fragrance-quiet-focus-hinoki`）

- 場面: 静かに取り組みたい
- 系統: `woody`
- 説明: 乾いた木の質感と澄んだ輪郭が、落ち着いた机辺と静かな時間を思わせる端正な香調です。
- 素材例: ヒノキ
- 共有投影: ヒノキ｜端正で澄んだ木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### やわらかな樹脂と木質の香調（`fragrance-pause-frankincense`）

- 場面: ひと息つきたい
- 系統: `resinous`
- 説明: 穏やかな樹脂と乾いた木質が重なる気配が、静かな余白のある情景を思わせる香調です。
- 素材例: フランキンセンス
- 共有投影: フランキンセンス｜やわらかな樹脂と木質の香調
- 注意書きID: `disclaimer-aroma-symbolic`

### すっきりした辛みを含む香調（`fragrance-reset-ginger`）

- 場面: 気持ちを切り替えたい
- 系統: `spicy`
- 説明: 軽い辛みと明るさが交わる気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: ジンジャー
- 共有投影: ジンジャー｜すっきりした辛みを含む香調
- 注意書きID: `disclaimer-aroma-symbolic`

### 透明感のある葉の香調（`fragrance-reset-eucalyptus-radiata`）

- 場面: 気持ちを切り替えたい
- 系統: `fresh`
- 説明: 透明感とすっきりした輪郭を持つ葉の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。
- 素材例: ユーカリ・ラディアータ
- 共有投影: ユーカリ・ラディアータ｜透明感のある葉の香調
- 注意書きID: `disclaimer-aroma-symbolic`

## P-2 バランス・単一因子称号（approved）

### 1. 五つの風を見渡す観測者 (`title-balanced`)

- 標準パレット: 澄み切った空色 (`palette-balanced-1`)
- 代替パレット1: 静謐な淡いブルー (`palette-balanced-2`)
- 代替パレット2: 穏やかな草原の緑 (`palette-balanced-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: ローマンカモミール｜まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 素材例: レモングラス
- 共有サマリ: グレープフルーツ｜ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 素材例: ベルガモット
- 香り候補: 静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: ベルガモット｜ほろ苦く端正な柑橘の香調

### 2. おいかける探究者 (`title-single-intellectImagination-high`)

- 標準パレット: 深い知性の紺色 (`palette-single-intellectimagination-high-1`)
- 代替パレット1: 閃きを象徴する星影の紫 (`palette-single-intellectimagination-high-2`)
- 代替パレット2: 未知への好奇心を誘うターコイズ (`palette-single-intellectimagination-high-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 素材例: スイートオレンジ
- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 共有サマリ: マジョラム｜温かく穏やかなハーブの香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 共有サマリ: プチグレン｜青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 共有サマリ: ジュニパーベリー｜澄んだ針葉樹と青い実の香調

### 3. 手ざわりをたどる散策者 (`title-single-intellectImagination-low`)

- 標準パレット: 大地の温もりを宿す茶色 (`palette-single-intellectimagination-low-1`)
- 代替パレット1: 柔らかな陽だまりのグレージュ (`palette-single-intellectimagination-low-2`)
- 代替パレット2: 落ち着いたモスグリーン (`palette-single-intellectimagination-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: ヒノキ｜静かな森を思わせる木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 共有サマリ: ペパーミント｜鋭く澄んだ清涼の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: ローズマリー｜青く端正なハーブの香調

### 4. 整然たる計画者 (`title-single-conscientiousness-high`)

- 標準パレット: 規律ある濃紺 (`palette-single-conscientiousness-high-1`)
- 代替パレット1: 静止した空気のグレー (`palette-single-conscientiousness-high-2`)
- 代替パレット2: 誠実な白磁色 (`palette-single-conscientiousness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 共有サマリ: ホーウッド｜やわらかな花を含む木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 香り候補: すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 素材例: ジンジャー
- 共有サマリ: ジンジャー｜すっきりした辛みを含む香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: パチュリ｜湿り気を含む土と葉の香調

### 5. 風向きに道を変える漂泊者 (`title-single-conscientiousness-low`)

- 標準パレット: 自由な風のスカイブルー (`palette-single-conscientiousness-low-1`)
- 代替パレット1: 移ろいゆく風の若草色 (`palette-single-conscientiousness-low-2`)
- 代替パレット2: 軽やかな雲のサンドベージュ (`palette-single-conscientiousness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 香り候補: やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: フランキンセンス｜やわらかな樹脂と木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: ベルガモット｜明るく軽快な柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 共有サマリ: シダーウッド｜乾いた深みのある木質の香調

### 6. にぎわいへ進む交遊者 (`title-single-extraversion-high`)

- 標準パレット: 陽気なコーラルピンク (`palette-single-extraversion-high-1`)
- 代替パレット1: 活気に満ちたオレンジ (`palette-single-extraversion-high-2`)
- 代替パレット2: 交流をひらくターコイズ (`palette-single-extraversion-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: ヒノキ｜静かな森を思わせる木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 香り候補: 丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: マンダリン｜丸みのあるやさしい切替の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: サイプレス｜端正で清涼な木質の香調

### 7. 静謐なる滞在者 (`title-single-extraversion-low`)

- 標準パレット: 深い夜のミッドナイトブルー (`palette-single-extraversion-low-1`)
- 代替パレット1: 静寂を纏うシルバーグレー (`palette-single-extraversion-low-2`)
- 代替パレット2: 落ち着いた藤色 (`palette-single-extraversion-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: ネロリ｜透明感のある花と柑橘の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: ユーカリ・ラディアータ｜透明感のある葉の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: ヒノキ｜端正で澄んだ木質の香調

### 8. 歩幅をそろえる同伴者 (`title-single-agreeableness-high`)

- 標準パレット: 温かなパステルピンク (`palette-single-agreeableness-high-1`)
- 代替パレット1: 包容力のあるミントグリーン (`palette-single-agreeableness-high-2`)
- 代替パレット2: 穏やかなアイボリー (`palette-single-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 素材例: スイートオレンジ
- 共有サマリ: スイートオレンジ｜やわらかな甘みの柑橘の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 香り候補: レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 素材例: レモングラス
- 共有サマリ: レモングラス｜レモンを思わせる青い草の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 香り候補: ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 素材例: ベルガモット
- 共有サマリ: ベルガモット｜ほろ苦く端正な柑橘の香調

### 9. 自分の歩幅で進む同行者 (`title-single-agreeableness-low`)

- 標準パレット: 意志ある深い赤 (`palette-single-agreeableness-low-1`)
- 代替パレット1: 独立心を示す深いブルーグレー (`palette-single-agreeableness-low-2`)
- 代替パレット2: 揺るがない鉄錆色 (`palette-single-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 香り候補: やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: ホーウッド｜やわらかな花を含む木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 素材例: ジンジャー
- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 共有サマリ: ジンジャー｜すっきりした辛みを含む香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 共有サマリ: ジュニパーベリー｜澄んだ針葉樹と青い実の香調

### 10. 静かなる航行者 (`title-single-emotionalStability-high`)

- 標準パレット: 凪いだ海の深い青 (`palette-single-emotionalstability-high-1`)
- 代替パレット1: 安らぎを運ぶ淡い水色 (`palette-single-emotionalstability-high-2`)
- 代替パレット2: 静穏な青磁色 (`palette-single-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 真正ラベンダー｜静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 共有サマリ: ローズマリー｜風を受ける青い葉のハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: パチュリ｜湿り気を含む土と葉の香調

### 11. そよ風に振り向く感受者 (`title-single-emotionalStability-low`)

- 標準パレット: 移ろう光の淡い紫 (`palette-single-emotionalstability-low-1`)
- 代替パレット1: 揺れる水面の淡い青 (`palette-single-emotionalstability-low-2`)
- 代替パレット2: 繊細な薄紅色の花びら (`palette-single-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: サンダルウッド｜温かく穏やかな木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: レモン｜鮮やかで明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調

## P-3 ペア称号 1〜10（approved）

### 12. 星座盤に印を置く記録者 (`title-pair-intellectImagination-high--conscientiousness-high`)

- 標準パレット: 星夜の深い紺 (`palette-pair-intellectimagination-high-and-conscientiousness-high-1`)
- 代替パレット1: 精緻な記録の黄金色 (`palette-pair-intellectimagination-high-and-conscientiousness-high-2`)
- 代替パレット2: 冷静な思考の白 (`palette-pair-intellectimagination-high-and-conscientiousness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 素材例: スイートオレンジ
- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 共有サマリ: マジョラム｜温かく穏やかなハーブの香調

#### 気持ちを切り替えたい（reset）

- 香り候補: レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 素材例: レモングラス
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: ライム｜軽快で透明な柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 香り候補: 端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: ベチバー｜根と土を思わせる重厚な香調

### 13. 風まかせの空想者 (`title-pair-intellectImagination-high--conscientiousness-low`)

- 標準パレット: 夢幻的なペールバイオレット (`palette-pair-intellectimagination-high-and-conscientiousness-low-1`)
- 代替パレット1: 自由な空の淡い青 (`palette-pair-intellectimagination-high-and-conscientiousness-low-2`)
- 代替パレット2: 想像力を刺激するミントグリーン (`palette-pair-intellectimagination-high-and-conscientiousness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: ネロリ｜透明感のある花と柑橘の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 共有サマリ: プチグレン｜青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 素材例: ベルガモット
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: サイプレス｜端正で清涼な木質の香調

### 14. 素朴な継続者 (`title-pair-intellectImagination-low--conscientiousness-high`)

- 標準パレット: 実直なオリーブ色 (`palette-pair-intellectimagination-low-and-conscientiousness-high-1`)
- 代替パレット1: 誠実な土のブラウン (`palette-pair-intellectimagination-low-and-conscientiousness-high-2`)
- 代替パレット2: 飾らないストーングレー (`palette-pair-intellectimagination-low-and-conscientiousness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 素材例: スイートオレンジ
- 香り候補: やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 共有サマリ: スイートオレンジ｜やわらかな甘みの柑橘の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 共有サマリ: レモン｜鮮やかで明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 素材例: ベルガモット
- 共有サマリ: ローズマリー｜青く端正なハーブの香調

### 15. 気ままな遊歩者 (`title-pair-intellectImagination-low--conscientiousness-low`)

- 標準パレット: 陽光を浴びた淡い黄色 (`palette-pair-intellectimagination-low-and-conscientiousness-low-1`)
- 代替パレット1: 気ままな風のミントグリーン (`palette-pair-intellectimagination-low-and-conscientiousness-low-2`)
- 代替パレット2: 柔らかな砂の色 (`palette-pair-intellectimagination-low-and-conscientiousness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 共有サマリ: サンダルウッド｜温かく穏やかな木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 香り候補: すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 素材例: ジンジャー
- 共有サマリ: ライム｜軽快で透明な柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 共有サマリ: ジュニパーベリー｜澄んだ針葉樹と青い実の香調

### 16. 新風を運ぶ伝達者 (`title-pair-intellectImagination-high--extraversion-high`)

- 標準パレット: 鮮やかなターコイズブルー (`palette-pair-intellectimagination-high-and-extraversion-high-1`)
- 代替パレット1: 活力を運ぶオレンジゴールド (`palette-pair-intellectimagination-high-and-extraversion-high-2`)
- 代替パレット2: 知的な輝きのゴールド (`palette-pair-intellectimagination-high-and-extraversion-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: ローマンカモミール｜まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: マンダリン｜丸みのあるやさしい切替の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 共有サマリ: シダーウッド｜乾いた深みのある木質の香調

### 17. 静寂に星座盤を見つめる探索者 (`title-pair-intellectImagination-high--extraversion-low`)

- 標準パレット: 静寂を極めた深い黒 (`palette-pair-intellectimagination-high-and-extraversion-low-1`)
- 代替パレット1: 宇宙の深淵を映す紫 (`palette-pair-intellectimagination-high-and-extraversion-low-2`)
- 代替パレット2: 遠い星の淡い光色 (`palette-pair-intellectimagination-high-and-extraversion-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: ヒノキ｜静かな森を思わせる木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 素材例: レモングラス
- 共有サマリ: ベルガモット｜明るく軽快な柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 香り候補: 静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: ベチバー｜根と土を思わせる重厚な香調

### 18. にぎわいの談話者 (`title-pair-intellectImagination-low--extraversion-high`)

- 標準パレット: 賑やかな明るい黄色 (`palette-pair-intellectimagination-low-and-extraversion-high-1`)
- 代替パレット1: 親しみやすいアプリコット (`palette-pair-intellectimagination-low-and-extraversion-high-2`)
- 代替パレット2: 活気ある明るい緑 (`palette-pair-intellectimagination-low-and-extraversion-high-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 香り候補: やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: フランキンセンス｜やわらかな樹脂と木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 共有サマリ: ペパーミント｜鋭く澄んだ清涼の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 共有サマリ: ヒノキ｜端正で澄んだ木質の香調

### 19. 窓辺の逗留者 (`title-pair-intellectImagination-low--extraversion-low`)

- 標準パレット: 午後の静けさを映すグレー (`palette-pair-intellectimagination-low-and-extraversion-low-1`)
- 代替パレット1: 穏やかな窓辺の薄青 (`palette-pair-intellectimagination-low-and-extraversion-low-2`)
- 代替パレット2: 静かな時間の色である淡いグレー (`palette-pair-intellectimagination-low-and-extraversion-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 共有サマリ: マジョラム｜温かく穏やかなハーブの香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 香り候補: すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 素材例: ジンジャー
- 共有サマリ: ジンジャー｜すっきりした辛みを含む香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調

### 20. 寄り添う共鳴者 (`title-pair-intellectImagination-high--agreeableness-high`)

- 標準パレット: 共鳴し合う淡いピンク (`palette-pair-intellectimagination-high-and-agreeableness-high-1`)
- 代替パレット1: 包み込むような深い紫 (`palette-pair-intellectimagination-high-and-agreeableness-high-2`)
- 代替パレット2: 調和を促すソフトブルー (`palette-pair-intellectimagination-high-and-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 香り候補: やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 素材例: スイートオレンジ
- 共有サマリ: ネロリ｜透明感のある花と柑橘の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 共有サマリ: ユーカリ・ラディアータ｜透明感のある葉の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 香り候補: ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 素材例: ベルガモット
- 共有サマリ: ベルガモット｜ほろ苦く端正な柑橘の香調

### 21. 独歩の開拓者 (`title-pair-intellectImagination-high--agreeableness-low`)

- 標準パレット: 強い意志を宿す深い青 (`palette-pair-intellectimagination-high-and-agreeableness-low-1`)
- 代替パレット1: 未踏の地を拓く深い紫 (`palette-pair-intellectimagination-high-and-agreeableness-low-2`)
- 代替パレット2: 鋭い理性を照らすオレンジ (`palette-pair-intellectimagination-high-and-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: 真正ラベンダー｜静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 共有サマリ: ユーカリ・ラディアータ｜透明感のある葉の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: サイプレス｜端正で清涼な木質の香調

## P-4 ペア称号 11〜20（draft）

### 22. 分かち合う同席者 (`title-pair-intellectImagination-low--agreeableness-high`)

- 標準パレット: 温かなサンドベージュ (`palette-pair-intellectimagination-low-and-agreeableness-high-1`)
- 代替パレット1: 安らぎを分かつセージグリーン (`palette-pair-intellectimagination-low-and-agreeableness-high-2`)
- 代替パレット2: 穏やかなピーチピンク (`palette-pair-intellectimagination-low-and-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: ローマンカモミール｜まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 素材例: レモングラス
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: レモングラス｜レモンを思わせる青い草の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: ベチバー｜根と土を思わせる重厚な香調

### 23. 標を示す表明者 (`title-pair-intellectImagination-low--agreeableness-low`)

- 標準パレット: 断定的なオーカー (`palette-pair-intellectimagination-low-and-agreeableness-low-1`)
- 代替パレット1: 明確な視界の深い青 (`palette-pair-intellectimagination-low-and-agreeableness-low-2`)
- 代替パレット2: 揺るぎないスレートグレー (`palette-pair-intellectimagination-low-and-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 香り候補: やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: ホーウッド｜やわらかな花を含む木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: ローズマリー｜風を受ける青い葉のハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 香り候補: 端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: ヒノキ｜端正で澄んだ木質の香調

### 24. 凪空を仰ぐ観望者 (`title-pair-intellectImagination-high--emotionalStability-high`)

- 標準パレット: 凪いだ空のライトブルー (`palette-pair-intellectimagination-high-and-emotionalstability-high-1`)
- 代替パレット1: 静観する深い紺色 (`palette-pair-intellectimagination-high-and-emotionalstability-high-2`)
- 代替パレット2: 澄み切ったミントグリーン (`palette-pair-intellectimagination-high-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 共有サマリ: フランキンセンス｜やわらかな樹脂と木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 共有サマリ: ベルガモット｜明るく軽快な柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 香り候補: 澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: ヒノキ｜端正で澄んだ木質の香調

### 25. 鈴音に振り向く探訪者 (`title-pair-intellectImagination-high--emotionalStability-low`)

- 標準パレット: 震える心の色である淡い紫 (`palette-pair-intellectimagination-high-and-emotionalstability-low-1`)
- 代替パレット1: 瑞々しい朝の緑 (`palette-pair-intellectimagination-high-and-emotionalstability-low-2`)
- 代替パレット2: 繊細な光のローズピンク (`palette-pair-intellectimagination-high-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: サンダルウッド｜温かく穏やかな木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 素材例: ジンジャー
- 共有サマリ: プチグレン｜青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 素材例: ベルガモット
- 共有サマリ: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調

### 26. 日だまりの静観者 (`title-pair-intellectImagination-low--emotionalStability-high`)

- 標準パレット: 暖かな陽だまりの黄色 (`palette-pair-intellectimagination-low-and-emotionalstability-high-1`)
- 代替パレット1: 穏やかな午後のセージグリーン (`palette-pair-intellectimagination-low-and-emotionalstability-high-2`)
- 代替パレット2: 安静な庭のオーカー (`palette-pair-intellectimagination-low-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 素材例: スイートオレンジ
- 香り候補: 静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: スイートオレンジ｜やわらかな甘みの柑橘の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: レモン｜鮮やかで明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 共有サマリ: パチュリ｜湿り気を含む土と葉の香調

### 27. 雨音に振り向く歩行者 (`title-pair-intellectImagination-low--emotionalStability-low`)

- 標準パレット: しっとりとした雨のグレー (`palette-pair-intellectimagination-low-and-emotionalstability-low-1`)
- 代替パレット1: 濡れた葉の深い緑 (`palette-pair-intellectimagination-low-and-emotionalstability-low-2`)
- 代替パレット2: 憂いを帯びた淡いブルー (`palette-pair-intellectimagination-low-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 共有サマリ: 真正ラベンダー｜静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: マンダリン｜丸みのあるやさしい切替の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: パチュリ｜湿り気を含む土と葉の香調

### 28. 刻限に集う交流者 (`title-pair-conscientiousness-high--extraversion-high`)

- 標準パレット: 効率的な深い青 (`palette-pair-conscientiousness-high-and-extraversion-high-1`)
- 代替パレット1: 社交的な明るいオレンジ (`palette-pair-conscientiousness-high-and-extraversion-high-2`)
- 代替パレット2: 整理された白 (`palette-pair-conscientiousness-high-and-extraversion-high-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 素材例: スイートオレンジ
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: ネロリ｜透明感のある花と柑橘の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 素材例: レモングラス
- 共有サマリ: レモングラス｜レモンを思わせる青い草の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: シダーウッド｜乾いた深みのある木質の香調

### 29. 灯下の記録者 (`title-pair-conscientiousness-high--extraversion-low`)

- 標準パレット: 集中を高める温かな琥珀色 (`palette-pair-conscientiousness-high-and-extraversion-low-1`)
- 代替パレット1: 灯火を見守る深い青 (`palette-pair-conscientiousness-high-and-extraversion-low-2`)
- 代替パレット2: 紙のような淡いアイボリー (`palette-pair-conscientiousness-high-and-extraversion-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: マジョラム｜温かく穏やかなハーブの香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: ペパーミント｜鋭く澄んだ清涼の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 共有サマリ: ローズマリー｜青く端正なハーブの香調

### 30. 道草の合流者 (`title-pair-conscientiousness-low--extraversion-high`)

- 標準パレット: 軽やかなコーラルピンク (`palette-pair-conscientiousness-low-and-extraversion-high-1`)
- 代替パレット1: 偶然を象徴する明るい若葉色 (`palette-pair-conscientiousness-low-and-extraversion-high-2`)
- 代替パレット2: 自由な空の青 (`palette-pair-conscientiousness-low-and-extraversion-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: ヒノキ｜静かな森を思わせる木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 素材例: ジンジャー
- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 共有サマリ: グレープフルーツ｜ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 素材例: ベルガモット
- 香り候補: 澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: ジュニパーベリー｜澄んだ針葉樹と青い実の香調

### 31. 余白を楽しむ散策者 (`title-pair-conscientiousness-low--extraversion-low`)

- 標準パレット: 贅沢な余白の白 (`palette-pair-conscientiousness-low-and-extraversion-low-1`)
- 代替パレット1: 穏やかな散策のライトグリーン (`palette-pair-conscientiousness-low-and-extraversion-low-2`)
- 代替パレット2: 心を解き放つ淡い水色 (`palette-pair-conscientiousness-low-and-extraversion-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 共有サマリ: 真正ラベンダー｜静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 素材例: ジンジャー
- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 共有サマリ: プチグレン｜青い葉と柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: サイプレス｜端正で清涼な木質の香調

## P-5 ペア称号 21〜30（draft）

### 32. 輪を整える準備者 (`title-pair-conscientiousness-high--agreeableness-high`)

- 標準パレット: 調和を司るミントグリーン (`palette-pair-conscientiousness-high-and-agreeableness-high-1`)
- 代替パレット1: 責任感ある深い紺 (`palette-pair-conscientiousness-high-and-agreeableness-high-2`)
- 代替パレット2: 準備を整えるローズベージュ (`palette-pair-conscientiousness-high-and-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 香り候補: やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: フランキンセンス｜やわらかな樹脂と木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 共有サマリ: グレープフルーツ｜ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 共有サマリ: シダーウッド｜乾いた深みのある木質の香調

### 33. 線を引く整頓者 (`title-pair-conscientiousness-high--agreeableness-low`)

- 標準パレット: 厳格な境界線の黒 (`palette-pair-conscientiousness-high-and-agreeableness-low-1`)
- 代替パレット1: 理知的な冷たい青 (`palette-pair-conscientiousness-high-and-agreeableness-low-2`)
- 代替パレット2: 秩序を示すオーカー (`palette-pair-conscientiousness-high-and-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: サンダルウッド｜温かく穏やかな木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 素材例: レモングラス
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: レモングラス｜レモンを思わせる青い草の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: パチュリ｜湿り気を含む土と葉の香調

### 34. 寄り道をともにする同行者 (`title-pair-conscientiousness-low--agreeableness-high`)

- 標準パレット: 温かな友情の若草色 (`palette-pair-conscientiousness-low-and-agreeableness-high-1`)
- 代替パレット1: 緩やかな時間のコーラル (`palette-pair-conscientiousness-low-and-agreeableness-high-2`)
- 代替パレット2: 包容力ある淡いオレンジ (`palette-pair-conscientiousness-low-and-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: ホーウッド｜やわらかな花を含む木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: ローズマリー｜風を受ける青い葉のハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: ベチバー｜根と土を思わせる重厚な香調

### 35. 自由な独行者 (`title-pair-conscientiousness-low--agreeableness-low`)

- 標準パレット: 誰にも染まらないレンガ色 (`palette-pair-conscientiousness-low-and-agreeableness-low-1`)
- 代替パレット1: 独立した精神の深い青 (`palette-pair-conscientiousness-low-and-agreeableness-low-2`)
- 代替パレット2: 自由な風のサンドベージュ (`palette-pair-conscientiousness-low-and-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 香り候補: やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 素材例: スイートオレンジ
- 共有サマリ: スイートオレンジ｜やわらかな甘みの柑橘の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 共有サマリ: ペパーミント｜鋭く澄んだ清涼の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 香り候補: 澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: ヒノキ｜端正で澄んだ木質の香調

### 36. 凪の計画者 (`title-pair-conscientiousness-high--emotionalStability-high`)

- 標準パレット: 安定した深い青 (`palette-pair-conscientiousness-high-and-emotionalstability-high-1`)
- 代替パレット1: 凪いだ海の白 (`palette-pair-conscientiousness-high-and-emotionalstability-high-2`)
- 代替パレット2: 冷静な判断のセージグレー (`palette-pair-conscientiousness-high-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 香り候補: 静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: ヒノキ｜静かな森を思わせる木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: マンダリン｜丸みのあるやさしい切替の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 素材例: ベルガモット
- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 共有サマリ: ベルガモット｜ほろ苦く端正な柑橘の香調

### 37. 揺れ灯の整頓者 (`title-pair-conscientiousness-high--emotionalStability-low`)

- 標準パレット: 揺らぐ感情を照らす琥珀色 (`palette-pair-conscientiousness-high-and-emotionalstability-low-1`)
- 代替パレット1: 整頓しようとする深い青 (`palette-pair-conscientiousness-high-and-emotionalstability-low-2`)
- 代替パレット2: 灯火の淡い黄色 (`palette-pair-conscientiousness-high-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: ローマンカモミール｜まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 香り候補: レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 素材例: レモングラス
- 共有サマリ: ライム｜軽快で透明な柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調

### 38. 流れをゆく漂泊者 (`title-pair-conscientiousness-low--emotionalStability-high`)

- 標準パレット: 流れる水の淡いブルー (`palette-pair-conscientiousness-low-and-emotionalstability-high-1`)
- 代替パレット1: 軽やかな風の若草色 (`palette-pair-conscientiousness-low-and-emotionalstability-high-2`)
- 代替パレット2: 漂う雲の白 (`palette-pair-conscientiousness-low-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 素材例: スイートオレンジ
- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 共有サマリ: スイートオレンジ｜やわらかな甘みの柑橘の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 共有サマリ: ベルガモット｜明るく軽快な柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 香り候補: 端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: ローズマリー｜青く端正なハーブの香調

### 39. 揺れ影の遊歩者 (`title-pair-conscientiousness-low--emotionalStability-low`)

- 標準パレット: 揺れる影の深い紫灰 (`palette-pair-conscientiousness-low-and-emotionalstability-low-1`)
- 代替パレット1: 繊細な感性の淡いブルーグレー (`palette-pair-conscientiousness-low-and-emotionalstability-low-2`)
- 代替パレット2: 儚い光のベージュ (`palette-pair-conscientiousness-low-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: ネロリ｜透明感のある花と柑橘の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 香り候補: すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 素材例: ジンジャー
- 共有サマリ: ジンジャー｜すっきりした辛みを含む香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: ジュニパーベリー｜澄んだ針葉樹と青い実の香調

### 40. 輪舞へ踏み出す共演者 (`title-pair-extraversion-high--agreeableness-high`)

- 標準パレット: 華やかなコーラルピンク (`palette-pair-extraversion-high-and-agreeableness-high-1`)
- 代替パレット1: 共演する明るいターコイズ (`palette-pair-extraversion-high-and-agreeableness-high-2`)
- 代替パレット2: 活気ある黄金色 (`palette-pair-extraversion-high-and-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 共有サマリ: ホーウッド｜やわらかな花を含む木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 共有サマリ: グレープフルーツ｜ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 素材例: ベルガモット
- 共有サマリ: ベルガモット｜ほろ苦く端正な柑橘の香調

### 41. 自分の色を掲げる表明者 (`title-pair-extraversion-high--agreeableness-low`)

- 標準パレット: 強烈な個性の赤 (`palette-pair-extraversion-high-and-agreeableness-low-1`)
- 代替パレット1: 鮮やかな対比の深い青 (`palette-pair-extraversion-high-and-agreeableness-low-2`)
- 代替パレット2: 揺るがない信念のマゼンタ (`palette-pair-extraversion-high-and-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 香り候補: やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: マジョラム｜温かく穏やかなハーブの香調

#### 気持ちを切り替えたい（reset）

- 香り候補: すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 素材例: ジンジャー
- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 共有サマリ: ジンジャー｜すっきりした辛みを含む香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 共有サマリ: ベチバー｜根と土を思わせる重厚な香調

## P-6 ペア称号 31〜40（draft）

### 42. 寄り添う静観者 (`title-pair-extraversion-low--agreeableness-high`)

- 標準パレット: 寄り添う淡いセージグリーン (`palette-pair-extraversion-low-and-agreeableness-high-1`)
- 代替パレット1: 静観するブルーグレー (`palette-pair-extraversion-low-and-agreeableness-high-2`)
- 代替パレット2: 安らぎのパールホワイト (`palette-pair-extraversion-low-and-agreeableness-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 共有サマリ: ローマンカモミール｜まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: ユーカリ・ラディアータ｜透明感のある葉の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 素材例: ベルガモット
- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 共有サマリ: ベルガモット｜ほろ苦く端正な柑橘の香調

### 43. 一席を選ぶ滞在者 (`title-pair-extraversion-low--agreeableness-low`)

- 標準パレット: 孤独を愛する深い紺 (`palette-pair-extraversion-low-and-agreeableness-low-1`)
- 代替パレット1: 自分の席を守るグレー (`palette-pair-extraversion-low-and-agreeableness-low-2`)
- 代替パレット2: 静寂を湛えるブラウン (`palette-pair-extraversion-low-and-agreeableness-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: サンダルウッド｜温かく穏やかな木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 素材例: グレープフルーツ
- 香り候補: レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 素材例: レモングラス
- 共有サマリ: レモングラス｜レモンを思わせる青い草の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調

### 44. 寛ぐ交遊者 (`title-pair-extraversion-high--emotionalStability-high`)

- 標準パレット: 心を寛げる明るいターコイズ (`palette-pair-extraversion-high-and-emotionalstability-high-1`)
- 代替パレット1: 安定した社交のコーラル (`palette-pair-extraversion-high-and-emotionalstability-high-2`)
- 代替パレット2: 包容力あるスカイブルー (`palette-pair-extraversion-high-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 素材例: スイートオレンジ
- 共有サマリ: 真正ラベンダー｜静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 素材例: プチグレン
- 香り候補: 風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 共有サマリ: ローズマリー｜風を受ける青い葉のハーブの香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: サイプレス｜端正で清涼な木質の香調

### 45. ざわめきへ振り向く参加者 (`title-pair-extraversion-high--emotionalStability-low`)

- 標準パレット: ざわめきを象徴する鮮やかなコーラル (`palette-pair-extraversion-high-and-emotionalstability-low-1`)
- 代替パレット1: 揺らぐ感情のターコイズ (`palette-pair-extraversion-high-and-emotionalstability-low-2`)
- 代替パレット2: 参加意欲を包む淡い紫 (`palette-pair-extraversion-high-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 香り候補: やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: フランキンセンス｜やわらかな樹脂と木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 共有サマリ: レモン｜鮮やかで明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 共有サマリ: ローズマリー｜青く端正なハーブの香調

### 46. 芽吹きを待つ滞在者 (`title-pair-extraversion-low--emotionalStability-high`)

- 標準パレット: 芽吹きを待つ若葉色 (`palette-pair-extraversion-low-and-emotionalstability-high-1`)
- 代替パレット1: 安定した待機の深い緑 (`palette-pair-extraversion-low-and-emotionalstability-high-2`)
- 代替パレット2: 静かな期待の白 (`palette-pair-extraversion-low-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 香り候補: やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 素材例: フランキンセンス
- 共有サマリ: 真正ラベンダー｜静かな甘みを含む花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 素材例: レモングラス
- 香り候補: 丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 素材例: マンダリン
- 共有サマリ: マンダリン｜丸みのあるやさしい切替の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 素材例: シダーウッド
- 香り候補: 青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 素材例: ローズマリー
- 共有サマリ: シダーウッド｜乾いた深みのある木質の香調

### 47. 薄明に耳を向ける逗留者 (`title-pair-extraversion-low--emotionalStability-low`)

- 標準パレット: 薄明のスレートブルー (`palette-pair-extraversion-low-and-emotionalstability-low-1`)
- 代替パレット1: 繊細な夜明けの紫灰 (`palette-pair-extraversion-low-and-emotionalstability-low-2`)
- 代替パレット2: 静寂を湛えるセージグレー (`palette-pair-extraversion-low-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 素材例: ローマンカモミール
- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 共有サマリ: ローマンカモミール｜まろやかな甘みの草花の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 素材例: ローズマリー
- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 共有サマリ: ライム｜軽快で透明な柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 香り候補: ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 素材例: ベルガモット
- 共有サマリ: ヒノキ｜端正で澄んだ木質の香調

### 48. ふたつの杯の相席者 (`title-pair-agreeableness-high--emotionalStability-high`)

- 標準パレット: 調和する淡いピンク (`palette-pair-agreeableness-high-and-emotionalstability-high-1`)
- 代替パレット1: 穏やかな共有のミントグリーン (`palette-pair-agreeableness-high-and-emotionalstability-high-2`)
- 代替パレット2: 安定した共存のブルーグレー (`palette-pair-agreeableness-high-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 素材例: スイートオレンジ
- 香り候補: 温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 素材例: マジョラム
- 共有サマリ: マジョラム｜温かく穏やかなハーブの香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 共有サマリ: ペパーミント｜鋭く澄んだ清涼の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 素材例: フランキンセンス
- 香り候補: 澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 共有サマリ: ジュニパーベリー｜澄んだ針葉樹と青い実の香調

### 49. 揺れ布に並ぶ同伴者 (`title-pair-agreeableness-high--emotionalStability-low`)

- 標準パレット: 共鳴し揺れるローズピンク (`palette-pair-agreeableness-high-and-emotionalstability-low-1`)
- 代替パレット1: 温かな寄り添いの淡い紫 (`palette-pair-agreeableness-high-and-emotionalstability-low-2`)
- 代替パレット2: 繊細な調和のライトブルー (`palette-pair-agreeableness-high-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 素材例: ヒノキ
- 香り候補: 透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 素材例: ネロリ
- 共有サマリ: ヒノキ｜静かな森を思わせる木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 素材例: ライム
- 香り候補: すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 素材例: ジンジャー
- 共有サマリ: ライム｜軽快で透明な柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 素材例: サイプレス
- 共有サマリ: パチュリ｜湿り気を含む土と葉の香調

### 50. 淡々たる表明者 (`title-pair-agreeableness-low--emotionalStability-high`)

- 標準パレット: 淡々とした理性のグレー (`palette-pair-agreeableness-low-and-emotionalstability-high-1`)
- 代替パレット1: 揺るがない安定の深い青 (`palette-pair-agreeableness-low-and-emotionalstability-high-2`)
- 代替パレット2: 明快な表明のトープ (`palette-pair-agreeableness-low-and-emotionalstability-high-3`)

#### ひと息つきたい（pause）

- 香り候補: やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 素材例: スイートオレンジ
- 香り候補: やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 素材例: ホーウッド
- 共有サマリ: スイートオレンジ｜やわらかな甘みの柑橘の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 素材例: ベルガモット
- 香り候補: 透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 素材例: ユーカリ・ラディアータ
- 共有サマリ: ベルガモット｜明るく軽快な柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 素材例: ジュニパーベリー
- 香り候補: 根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 素材例: ベチバー
- 共有サマリ: ベチバー｜根と土を思わせる重厚な香調

### 51. 風鳴る戸口の掲示者 (`title-pair-agreeableness-low--emotionalStability-low`)

- 標準パレット: 情熱的に鳴る深い赤 (`palette-pair-agreeableness-low-and-emotionalstability-low-1`)
- 代替パレット1: 嵐を見渡す深い青 (`palette-pair-agreeableness-low-and-emotionalstability-low-2`)
- 代替パレット2: 強い意志を示すプラム (`palette-pair-agreeableness-low-and-emotionalstability-low-3`)

#### ひと息つきたい（pause）

- 香り候補: 温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 素材例: サンダルウッド
- 香り候補: 静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 素材例: 真正ラベンダー
- 共有サマリ: サンダルウッド｜温かく穏やかな木質の香調

#### 気持ちを切り替えたい（reset）

- 香り候補: 鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 素材例: ペパーミント
- 香り候補: 鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 素材例: レモン
- 共有サマリ: レモン｜鮮やかで明るい柑橘の香調

#### 静かに取り組みたい（quiet-focus）

- 香り候補: 湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 素材例: パチュリ
- 香り候補: 端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 素材例: ヒノキ
- 共有サマリ: パチュリ｜湿り気を含む土と葉の香調
