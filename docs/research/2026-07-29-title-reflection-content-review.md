# 称号別「振り返りのヒント」文案レビュー

## 目的と非承認の扱い

F-005、F-006、T-005、T-008A、Q-006、Q-014に対応し、称号ごとの`titleReflection`候補を人手で確認するための文書である。候補は統合候補資料の各称号に対応する`【実用コメント】`だけを材料として再構成した。

各候補の状態は`review_status`で管理する。プロジェクトオーナーが明示的に承認したバッチだけを`approved`とし、それ以外は`draft`のままCSV、実装、承認メタデータへ反映しない。

## 文案ルール

- 1件目は単独で読める広い振り返りの問いにする。
- 2件目は1件目の言い換えではない別の視点にする。
- 3件目は実行しなくてもよい小さな行動の選択肢にする。
- high／middle／lowを善悪や改善段階として扱わず、反対側の傾向へ寄せることを目的にしない。
- その傾向を本人に合う形で活かす場面、心地よい過ごし方、判断の基準を振り返る。
- 測定事実として断定せず、人格、能力、適性、成果、健康状態、心理状態を固定しない。
- 命令、義務、達成保証、医療的な働きかけや効果の約束を含めない。
- 承認済みの`titleSubtitle`、`titleReason`、因子別結果文と実質的に重複させない。
- `source_locator`は統合候補資料の節と箇条書き番号を示す。本文は自動転記せず、表現境界に合わせて再構成する。

## 承認記録

文面ハッシュは、対象行を`title_id<TAB>display_order<TAB>text<LF>`の順に連結したUTF-8文字列のSHA-256とする。

| gate | 対象 | 状態 | 承認日 | 文面SHA-256 |
|---|---|---|---|---|
| TR-0 | 表示順1〜11・33件 | `approved` | 2026-07-29 | `f672948c10874974aee163fc38303405a67e32bf7aa4e28609ac7a06626ca800` |
| TR-1 | 表示順12〜21・30件 | `approved` | 2026-07-29 | `0d284b16f86ceeedf54b4b4ed5ebd9c33c91d55d33b0e94e2dd0853c5392fa11` |
| TR-2 | 表示順22〜31・30件 | `approved` | 2026-07-29 | `ed5222aa80da766ede4d2fccace4ea982653200adf7af103866abe98e89b85a0` |
| TR-3 | 表示順32〜41・30件 | `approved` | 2026-07-29 | `c9a25661cd7dee998f83540b6fc401c64920bcba3a9739b38497d3a8a95e5996` |
| TR-4 | 表示順42〜51・30件 | `approved` | 2026-07-29 | `f6d3ae55d6b6d39a6d277418590593822b1fe7bf5346cc476fce0ed7f0791a31` |

## TR-0（表示順1〜11）

### 1. 五つの風を見渡す観測者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-balanced` | 1 | 最近、状況に合わせて対応を変えたのはどんなときでしたか。 | 統合候補 §1【実用コメント】1（再構成） | `approved` |
| `title-balanced` | 2 | 選択肢がいくつもあるとき、最も優先したい条件は何でしょうか。 | 統合候補 §1【実用コメント】1（再構成） | `approved` |
| `title-balanced` | 3 | 今日選んだものを一つ取り上げ、その理由を短くメモしてみませんか。 | 統合候補 §1【実用コメント】3（再構成） | `approved` |

### 2. おいかける探究者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-single-intellectImagination-high` | 1 | 最近、考えるたびに新たな疑問が浮かんだテーマはありましたか。 | 統合候補 §2【実用コメント】2（再構成） | `approved` |
| `title-single-intellectImagination-high` | 2 | 広がった発想から試すものを一つ選ぶとしたら、何を優先しますか。 | 統合候補 §2【実用コメント】1（再構成） | `approved` |
| `title-single-intellectImagination-high` | 3 | 気になるテーマに関連する本を一冊探してみませんか。 | 統合候補 §2【実用コメント】3（再構成） | `approved` |

レビュー注: 元文にあった内面を推測する比喩と効果の断定は採用せず、問いと任意行動に再構成した。

### 3. 手ざわりをたどる散策者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-single-intellectImagination-low` | 1 | 何かを選ぶとき、写真や説明だけでなく、実物を見て決めたことはありましたか。 | 統合候補 §3【実用コメント】1（再構成） | `approved` |
| `title-single-intellectImagination-low` | 2 | 身近なものの中で、特に見た目や手ざわりが気に入っているものはありますか。 | 統合候補 §3【実用コメント】2（再構成） | `approved` |
| `title-single-intellectImagination-low` | 3 | 気になっている場所を一つ選び、実際に足を運んでみませんか。 | 統合候補 §3【実用コメント】3（再構成） | `approved` |

レビュー注: 元文の活動範囲の指定と学習効果の断定は採用せず、実物や場所を自分で確かめる問いと任意行動に再構成した。

### 4. 整然たる計画者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-single-conscientiousness-high` | 1 | 予定を立てるとき、どこまで決めておくと安心して始められますか。 | 統合候補 §4【実用コメント】1（再構成） | `approved` |
| `title-single-conscientiousness-high` | 2 | 自分のための時間も含めて予定を組めた日はありましたか。 | 統合候補 §4【実用コメント】2（再構成） | `approved` |
| `title-single-conscientiousness-high` | 3 | 次の予定に「見直しの時間」を5分だけ加えてみませんか。 | 統合候補 §4【実用コメント】1（再構成） | `approved` |

レビュー注: 元文の自己評価を促す表現と達成効果の断定は採用せず、予定を見直す小さな選択肢に置き換えた。

### 5. 風向きに道を変える漂泊者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-single-conscientiousness-low` | 1 | その日の気分で動いたことで、思いがけない出会いや発見につながったことはありましたか。 | 統合候補 §5【実用コメント】2（再構成） | `approved` |
| `title-single-conscientiousness-low` | 2 | 予定を決めない日でも、自然とやりたくなることは何ですか。 | 統合候補 §5【実用コメント】2（再構成） | `approved` |
| `title-single-conscientiousness-low` | 3 | 次の休日に自由に過ごせる時間を少しだけ作ってみませんか。 | 統合候補 §5【実用コメント】3（再構成） | `approved` |

レビュー注: 元文の内面を決める比喩と発見の保証は採用しなかった。

### 6. にぎわいへ進む交遊者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-single-extraversion-high` | 1 | 人と話しているうちに、自分の考えがまとまったことはありましたか。 | 統合候補 §6【実用コメント】1（再構成） | `approved` |
| `title-single-extraversion-high` | 2 | 誰かと笑い合った時間の中で、特に心に残っている場面はありますか。 | 統合候補 §6【実用コメント】2（再構成） | `approved` |
| `title-single-extraversion-high` | 3 | 気になるイベントや集まりに参加してみませんか。 | 統合候補 §6【実用コメント】3（再構成） | `approved` |

レビュー注: 元文の二人称による内面の表現と交流結果の保証は採用しなかった。

### 7. 静謐なる滞在者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-single-extraversion-low` | 1 | 静かな時間を過ごすなら、どんな場所や過ごし方が心地よいですか。 | 統合候補 §7【実用コメント】2（再構成） | `approved` |
| `title-single-extraversion-low` | 2 | 人と会った後は、一人の時間をどんなふうに過ごしたいですか。 | 統合候補 §7【実用コメント】2（再構成） | `approved` |
| `title-single-extraversion-low` | 3 | 次の休日に読みたい本や聴きたい音楽を一つ選んでみませんか。 | 統合候補 §7【実用コメント】3（再構成） | `approved` |

レビュー注: 元文の二人称による安心感の推測と休息効果の断定は採用せず、静かな時間の過ごし方と任意行動に再構成した。

### 8. 歩幅をそろえる同伴者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-single-agreeableness-high` | 1 | 誰かに予定を合わせたことで、相手がほっとしたように見えたことはありましたか。 | 統合候補 §8【実用コメント】2（再構成） | `approved` |
| `title-single-agreeableness-high` | 2 | 誰かの話を聞いて、その人が大切にしていることが伝わってきた場面はありましたか。 | 統合候補 §8【実用コメント】3（再構成） | `approved` |
| `title-single-agreeableness-high` | 3 | 次に会ったとき「一番大切にしたいことは何？」と尋ねてみませんか。 | 統合候補 §8【実用コメント】3（再構成） | `approved` |

レビュー注: 元文の周囲への効果や信頼向上は断定せず、実際に見えた場面、相手の大切にしていること、短い問いかけに分けた。

### 9. 自分の歩幅で進む同行者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-single-agreeableness-low` | 1 | 自分の考えを譲りたくないと感じたことはありましたか。 | 統合候補 §9【実用コメント】1（再構成） | `approved` |
| `title-single-agreeableness-low` | 2 | 意見が違う相手には、自分の考えをどのように伝えていますか。 | 統合候補 §9【実用コメント】2（再構成） | `approved` |
| `title-single-agreeableness-low` | 3 | 自分の考えを譲りたくなかった場面を振り返り、大切にしていたことをメモしてみませんか。 | 統合候補 §9【実用コメント】1（再構成） | `approved` |

レビュー注: 元文の人格や内面の断定、視野や結果への効果は採用しなかった。

### 10. 静かなる航行者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-single-emotionalStability-high` | 1 | 何も予定がない穏やかな時間は、どんなふうに過ごしたいですか。 | 統合候補 §10【実用コメント】2（再構成） | `approved` |
| `title-single-emotionalStability-high` | 2 | 普段と少し違う気持ちに気づいて、「こんな日もある」と思えたことはありましたか。 | 統合候補 §10【実用コメント】2（再構成） | `approved` |
| `title-single-emotionalStability-high` | 3 | 予定の合間に一度だけ深呼吸する時間を取ってみませんか。 | 統合候補 §10【実用コメント】3（再構成） | `approved` |

レビュー注: 元文の心身への効果は採用せず、穏やかな時間の過ごし方、気持ちの受け止め方、短い任意行動に分けた。

### 11. そよ風に振り向く感受者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-single-emotionalStability-low` | 1 | 気になることがあるとき、どんな情報が分かると少し安心できますか。 | 統合候補 §11【実用コメント】1（再構成） | `approved` |
| `title-single-emotionalStability-low` | 2 | 小さな変化に早めに気づいたことで、準備しておいてよかったと思ったことはありますか。 | 統合候補 §11【実用コメント】1（再構成） | `approved` |
| `title-single-emotionalStability-low` | 3 | 気持ちが揺れたときに落ち着いて過ごせる場所を一つ思い浮かべてみませんか。 | 統合候補 §11【実用コメント】2（再構成） | `approved` |

レビュー注: 元文の能力の含意、感情に関する比喩的な断定、整理効果の断定は採用しなかった。

## TR-1（表示順12〜21）

### 12. 星座盤に印を置く記録者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-high--conscientiousness-high` | 1 | 思いついたことを実行に移すとき、最初に何から決めていますか。 | 統合候補 §12【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-high--conscientiousness-high` | 2 | 予定を立てる中で、あえて余白を残したことはありましたか。 | 統合候補 §12【実用コメント】2（再構成） | `approved` |
| `title-pair-intellectImagination-high--conscientiousness-high` | 3 | 今日浮かんだアイデアを一つメモし、最初に試したいことも書いてみませんか。 | 統合候補 §12【実用コメント】3（再構成） | `approved` |

レビュー注: 構想を計画へつなぐ着眼点と計画に余白を持たせる提案を活かし、複雑化や成果を断定しない問いへ整えた。

### 13. 風まかせの空想者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-high--conscientiousness-low` | 1 | 思いついたことをすぐ試してみたくなったのはどんなときでしたか。 | 統合候補 §13【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-high--conscientiousness-low` | 2 | 興味が薄れてしまったテーマの中に、もう一度考えてみたいものはありますか。 | 統合候補 §13【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-high--conscientiousness-low` | 3 | 気になっているテーマについて、思いついた方法を試してみませんか。 | 統合候補 §13【実用コメント】1（再構成） | `approved` |

レビュー注: 広がった発想をそのまま試す着眼点を活かし、計画性を高めるための目標設定にはしなかった。

### 14. 素朴な継続者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-low--conscientiousness-high` | 1 | 慣れた手順を続けたことで、安心して進められた場面はありましたか。 | 統合候補 §14【実用コメント】2（再構成） | `approved` |
| `title-pair-intellectImagination-low--conscientiousness-high` | 2 | いつもの方法が今の状況にも合っているか、確かめたことはありましたか。 | 統合候補 §14【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-low--conscientiousness-high` | 3 | よく使う手順を一つ選び、今も続けたい理由をメモしてみませんか。 | 統合候補 §14【実用コメント】1（再構成） | `approved` |

レビュー注: 慣れた方法を続ける良さと現在の状況に合うか確かめる視点を残し、新しさや効率を求める提案にはしなかった。

### 15. 気ままな遊歩者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-low--conscientiousness-low` | 1 | その場の状況を見ながら方針を決めたのはどんなときでしたか。 | 統合候補 §15【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-low--conscientiousness-low` | 2 | 予定を決めずに過ごした日は、自然とどこへ足が向きましたか。 | 統合候補 §15【実用コメント】2（再構成） | `approved` |
| `title-pair-intellectImagination-low--conscientiousness-low` | 3 | 身近な疑問を、実際に確かめてみませんか。 | 統合候補 §15【実用コメント】1（再構成） | `approved` |

レビュー注: その場の流れと身近な状況から行動を選ぶ視点を活かし、計画や新しい経験を義務にしなかった。

### 16. 新風を運ぶ伝達者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-high--extraversion-high` | 1 | アイデアを誰かに話すとき、相手の反応を確かめるために何を意識していますか。 | 統合候補 §16【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-high--extraversion-high` | 2 | 人と話した後で、考え直したくなったテーマはありますか。 | 統合候補 §16【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-high--extraversion-high` | 3 | 気になっているテーマを一つ選び、誰かに話したい要点を一文にしてみませんか。 | 統合候補 §16【実用コメント】3（再構成） | `approved` |

レビュー注: アイデアを伝える際に相手の反応を確かめる着眼点を活かし、対話の成果や発想の向上は約束しなかった。

### 17. 静寂に星座盤を見つめる探索者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-high--extraversion-low` | 1 | 一人で考えているうちに、見方が大きく変わったテーマはありましたか。 | 統合候補 §17【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-high--extraversion-low` | 2 | 考えを深めるとき、どんな場所や時間なら集中しやすいですか。 | 統合候補 §17【実用コメント】2（再構成） | `approved` |
| `title-pair-intellectImagination-high--extraversion-low` | 3 | 最近考えていたことを一つ選び、今の時点でまとまっている考えを短く書いてみませんか。 | 統合候補 §17【実用コメント】3（再構成） | `approved` |

レビュー注: 静かな環境で考えを深める過ごし方と学びを言葉にする提案を活かし、交流を増やす方向へは寄せなかった。

### 18. にぎわいの談話者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-low--extraversion-high` | 1 | 最近、人と話して盛り上がった身近な話題は何でしたか。 | 統合候補 §18【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-low--extraversion-high` | 2 | 誰かの体験談を聞いて、自分も試したくなったことはありましたか。 | 統合候補 §18【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-low--extraversion-high` | 3 | 最近知ったことを一つ選び、次の会話で話題にしてみませんか。 | 統合候補 §18【実用コメント】3（再構成） | `approved` |

レビュー注: 身近な話題や実際の経験を会話に活かす視点を残し、抽象的な話題へ関心を広げる提案にはしなかった。

### 19. 窓辺の逗留者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-low--extraversion-low` | 1 | 慣れた場所で静かに過ごすなら、何をしている時間が心地よいですか。 | 統合候補 §19【実用コメント】2（再構成） | `approved` |
| `title-pair-intellectImagination-low--extraversion-low` | 2 | いつもの場所から見える景色に、最近何か変化はありましたか。 | 統合候補 §19【実用コメント】3（再構成） | `approved` |
| `title-pair-intellectImagination-low--extraversion-low` | 3 | 好きな場所で、目に入ったものを一つだけメモしてみませんか。 | 統合候補 §19【実用コメント】3（再構成） | `approved` |

レビュー注: 心地よい距離感と身近なものを観察する着眼点を活かし、人との関わりや新しい刺激を増やす提案にはしなかった。

### 20. 寄り添う共鳴者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-high--agreeableness-high` | 1 | 意見が違う相手の話を聞いて、思いがけない共通点に気づいたことはありましたか。 | 統合候補 §20【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-high--agreeableness-high` | 2 | 自分の考えを大切にしながら、相手の考えにも共感できた場面はありましたか。 | 統合候補 §20【実用コメント】2（再構成） | `approved` |
| `title-pair-intellectImagination-high--agreeableness-high` | 3 | 最近聞いた意見を一つ選び、共感した点と自分の考えを分けて書いてみませんか。 | 統合候補 §20【実用コメント】1（再構成） | `approved` |

レビュー注: 共感した点と自分の立場を分けて考える着眼点を活かし、共感の強さや相乗効果は断定しなかった。

### 21. 独歩の開拓者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-high--agreeableness-low` | 1 | 周囲と意見が違っても、自分の考えを深めたくなったのはどんなときでしたか。 | 統合候補 §21【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-high--agreeableness-low` | 2 | 独自の考えを伝えるとき、どんな背景や理由を最初に伝えていますか。 | 統合候補 §21【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-high--agreeableness-low` | 3 | 周囲とは違う発想について、さらに確かめたいことを書いてみませんか。 | 統合候補 §21【実用コメント】1（再構成） | `approved` |

レビュー注: 独自の考えを守りながらさらに確かめたいことを言葉にする着眼点を活かし、周囲へ合わせることを目的にしなかった。

## TR-2（表示順22〜31）

### 22. 分かち合う同席者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-low--agreeableness-high` | 1 | 誰かを手伝うとき、無理なくできる範囲をどう決めていますか。 | 統合候補 §22【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-low--agreeableness-high` | 2 | 誰かと過ごす中で、自分が望んでいることに気づいたのはどんなときでしたか。 | 統合候補 §22【実用コメント】2（再構成） | `approved` |
| `title-pair-intellectImagination-low--agreeableness-high` | 3 | 身近な人のためにできることを一つ思い浮かべ、必要かどうかその人に尋ねてみませんか。 | 統合候補 §22【実用コメント】3（再構成） | `approved` |

レビュー注: 相手を支える姿勢と自分の負担や希望を具体的に確かめる視点を活かし、自己犠牲や支援の成果は前提にしなかった。

### 23. 標を示す表明者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-low--agreeableness-low` | 1 | 自分の判断を伝えるとき、どんな事実や経験を根拠にしていますか。 | 統合候補 §23【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-low--agreeableness-low` | 2 | 相手と前提が違うと気づいたのは、どんなときでしたか。 | 統合候補 §23【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-low--agreeableness-low` | 3 | 次に誰かと意見を交わすとき、「確認できた事実」と「自分の考え」を分けて伝えてみませんか。 | 統合候補 §23【実用コメント】1（再構成） | `approved` |

レビュー注: 具体的な根拠をもとに判断する特徴を活かし、相手へ合わせるのではなく事実と解釈を分ける提案にした。

### 24. 凪空を仰ぐ観望者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-high--emotionalStability-high` | 1 | 考えを広げている途中で、いったん現状を確かめたことはありましたか。 | 統合候補 §24【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-high--emotionalStability-high` | 2 | 落ち着いて考えたいとき、どんな場所や時間を選んでいますか。 | 統合候補 §24【実用コメント】2（再構成） | `approved` |
| `title-pair-intellectImagination-high--emotionalStability-high` | 3 | 外の景色を眺めながら、次に試したいアイデアを一つ思い浮かべてみませんか。 | 統合候補 §24【実用コメント】3（再構成） | `approved` |

レビュー注: 広い構想と現在の状況を行き来する着眼点を活かし、緊急性の見落としや感情のあり方は決めつけなかった。

### 25. 鈴音に振り向く探訪者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-high--emotionalStability-low` | 1 | いくつもの可能性が浮かんだとき、何を優先して確かめますか。 | 統合候補 §25【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-high--emotionalStability-low` | 2 | 音や景色の小さな変化が、いつもより気になったことはありましたか。 | 統合候補 §25【実用コメント】2（再構成） | `approved` |
| `title-pair-intellectImagination-high--emotionalStability-low` | 3 | 今気になっていることを一つ選び、確認できている事実だけをまとめてみませんか。 | 統合候補 §25【実用コメント】1（再構成） | `approved` |

レビュー注: 多くの可能性や変化に気づく視点を活かし、不安を減らす目的ではなく確認済みの事実を見分ける提案にした。

### 26. 日だまりの静観者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-low--emotionalStability-high` | 1 | 身近な事実を確かめたことで、落ち着いて判断できた場面はありましたか。 | 統合候補 §26【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-low--emotionalStability-high` | 2 | いつもの方法が今の状況にも合っているか、何を軸にして判断していますか。 | 統合候補 §26【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-low--emotionalStability-high` | 3 | 今日うまく進んだことを一つ選び、その理由を短くメモしてみませんか。 | 統合候補 §26【実用コメント】3（再構成） | `approved` |

レビュー注: 身近な事実と安定した方法を振り返る視点を活かし、未知のものへ関心を向けることや肯定的な感情を求めなかった。

### 27. 雨音に振り向く歩行者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-intellectImagination-low--emotionalStability-low` | 1 | 身近な変化に気づいて、早めに対応したことはありましたか。 | 統合候補 §27【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-low--emotionalStability-low` | 2 | 周囲の変化の中で、特に気になりやすいのはどんなことですか。 | 統合候補 §27【実用コメント】1（再構成） | `approved` |
| `title-pair-intellectImagination-low--emotionalStability-low` | 3 | 今気になっていることをいくつか挙げ、「対応する」「様子を見る」に振り分けてみませんか。 | 統合候補 §27【実用コメント】1（再構成） | `approved` |

レビュー注: 身近な変化へ早く気づく特徴を活かし、感情を整えるのではなく対応の優先順位を本人が選ぶ提案にした。

### 28. 刻限に集う交流者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-conscientiousness-high--extraversion-high` | 1 | 人と一緒に進める予定を立てるとき、自分の役割をどのように決めていますか。 | 統合候補 §28【実用コメント】3（再構成） | `approved` |
| `title-pair-conscientiousness-high--extraversion-high` | 2 | いくつもの予定や作業が重なる中でも、自分のペースを保てたのはどんなときでしたか。 | 統合候補 §28【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-high--extraversion-high` | 3 | 次に誰かと作業するとき、事前に共有したいことを一つメモしてみませんか。 | 統合候補 §28【実用コメント】3（再構成） | `approved` |

レビュー注: 人と進める予定や役割を具体的に捉える視点を活かし、すべての役割を担うことや成果を前提にしなかった。

### 29. 灯下の記録者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-conscientiousness-high--extraversion-low` | 1 | 一人で作業を進めるとき、どこまで準備してから始めていますか。 | 統合候補 §29【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-high--extraversion-low` | 2 | 作業の途中で、どの段階まで進めば周囲と共有しやすいですか。 | 統合候補 §29【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-high--extraversion-low` | 3 | 今日進めていることを一つ選び、途中経過を一文でまとめてみませんか。 | 統合候補 §29【実用コメント】1（再構成） | `approved` |

レビュー注: 自分のペースで準備や作業を進める特徴を活かし、交流量を増やすのではなく伝えやすい時点を考える提案にした。

### 30. 道草の合流者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-conscientiousness-low--extraversion-high` | 1 | 人からの誘いで予定を変えた日は、どんなふうに過ごしましたか。 | 統合候補 §30【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-low--extraversion-high` | 2 | その場の流れに応じて予定を変えるときも、大切にしていることはありますか。 | 統合候補 §30【実用コメント】2（再構成） | `approved` |
| `title-pair-conscientiousness-low--extraversion-high` | 3 | 最近の会話から、心に残ったことを一つメモしてみませんか。 | 統合候補 §30【実用コメント】3（再構成） | `approved` |

レビュー注: 予定外の誘いや交流を楽しむ視点と、その中で大切にしたいことを振り返る問いを活かし、計画性を高める提案にはしなかった。

### 31. 余白を楽しむ散策者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-conscientiousness-low--extraversion-low` | 1 | 何も予定を入れない時間に、自然としたくなることは何ですか。 | 統合候補 §31【実用コメント】2（再構成） | `approved` |
| `title-pair-conscientiousness-low--extraversion-low` | 2 | 静かな時間の中で、思いがけない考えが浮かんだことはありましたか。 | 統合候補 §31【実用コメント】2（再構成） | `approved` |
| `title-pair-conscientiousness-low--extraversion-low` | 3 | 今日、何もしない時間を10分だけ作ってみませんか。 | 統合候補 §31【実用コメント】3（再構成） | `approved` |

レビュー注: 誰にも邪魔されない静かな時間という着眼点を活かし、着手や生産性を求めず余白そのものを選べる提案にした。

## TR-3（表示順32〜41）

### 32. 輪を整える準備者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-conscientiousness-high--agreeableness-high` | 1 | 周囲の人と一緒に作業を進めるとき、役割や期限をどのように共有していますか。 | 統合候補 §32【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-high--agreeableness-high` | 2 | 周囲の人を手助けするうちに、自分の作業を抱えすぎてしまったことはありますか。 | 統合候補 §32【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-high--agreeableness-high` | 3 | 他の人の協力が必要な予定について、誰に相談したいか考えてみませんか。 | 統合候補 §32【実用コメント】3（再構成） | `approved` |

レビュー注: 役割や期限を共有して協力を受け取る着眼点を活かし、周囲のために多くを抱えることは前提にしなかった。

### 33. 線を引く整頓者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-conscientiousness-high--agreeableness-low` | 1 | 目標やルールを決めるとき、どんな基準を優先していますか。 | 統合候補 §33【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-high--agreeableness-low` | 2 | 同じ進め方ではうまくいかないと感じたのは、どんな場面でしたか。 | 統合候補 §33【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-high--agreeableness-low` | 3 | 基準を決めるとき、例外にする条件も書き添えてみませんか。 | 統合候補 §33【実用コメント】1（再構成） | `approved` |

レビュー注: 明確な基準と一貫性を活かし、周囲へ合わせるのではなく例外も含めて自分のルールを決める提案にした。

### 34. 寄り道をともにする同行者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-conscientiousness-low--agreeableness-high` | 1 | 相手の希望に合わせて予定を変えたのは、どんなときでしたか。 | 統合候補 §34【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-low--agreeableness-high` | 2 | 誰かと過ごす中で、自分の希望も伝えられた場面はありましたか。 | 統合候補 §34【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-low--agreeableness-high` | 3 | 誰かとともに過ごすとき、相手のやりたいことを尋ねてみませんか。 | 統合候補 §34【実用コメント】3（再構成） | `approved` |

レビュー注: 相手の希望に合わせる柔軟さを活かし、自分の希望を伝えることも選べる問いと提案にした。

### 35. 自由な独行者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-conscientiousness-low--agreeableness-low` | 1 | 状況に応じた判断が必要なとき、自分の考えをどのように伝えていますか。 | 統合候補 §35【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-low--agreeableness-low` | 2 | 周囲に合わせずに動いたことで、自分のペースを保てた場面はありましたか。 | 統合候補 §35【実用コメント】2（再構成） | `approved` |
| `title-pair-conscientiousness-low--agreeableness-low` | 3 | 今日やりたいことの中から、今の気分に合うものを選んでみませんか。 | 統合候補 §35【実用コメント】3（再構成） | `approved` |

レビュー注: 自分の判断とその時々の関心を基準にする特徴を活かし、予定の共有や周囲との一致を求めなかった。

### 36. 凪の計画者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-conscientiousness-high--emotionalStability-high` | 1 | 予定外のことが起きたとき、手順をどのように組み直しましたか。 | 統合候補 §36【実用コメント】2（再構成） | `approved` |
| `title-pair-conscientiousness-high--emotionalStability-high` | 2 | 順調に進んでいるとき、負担や余力をどう確かめていますか。 | 統合候補 §36【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-high--emotionalStability-high` | 3 | 取り組む予定を、いくつかの小さな作業に分けてみませんか。 | 統合候補 §36【実用コメント】3（再構成） | `approved` |

レビュー注: 予定外の状況でも手順を整理する特徴と負担や余力を確かめる視点を活かし、混乱を経験することは勧めなかった。

### 37. 揺れ灯の整頓者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-conscientiousness-high--emotionalStability-low` | 1 | 心配なことに備えるとき、何から準備していますか。 | 統合候補 §37【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-high--emotionalStability-low` | 2 | 何度か確認したことで、安心して進められた場面はありましたか。 | 統合候補 §37【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-high--emotionalStability-low` | 3 | 今準備していることについて、「ここまでできたら十分」という基準を書いてみませんか。 | 統合候補 §37【実用コメント】1（再構成） | `approved` |

レビュー注: 準備や確認を重ねる特徴を活かし、確認を減らすのではなく本人が十分と思える基準を振り返る構成にした。

### 38. 流れをゆく漂泊者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-conscientiousness-low--emotionalStability-high` | 1 | 予定外のことが起きても、流れに合わせて動けた場面はありましたか。 | 統合候補 §38【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-low--emotionalStability-high` | 2 | 成り行きに任せる中でも、守ろうとした期限や条件はありましたか。 | 統合候補 §38【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-low--emotionalStability-high` | 3 | 最近の予定外の出来事から、心に残った発見をメモしてみませんか。 | 統合候補 §38【実用コメント】3（再構成） | `approved` |

レビュー注: 予定外の出来事へ柔軟に対応する特徴を活かし、細かな計画を求めず守りたい条件だけを振り返る構成にした。

### 39. 揺れ影の遊歩者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-conscientiousness-low--emotionalStability-low` | 1 | その日の気持ちに合わせて、予定を変えたことはありましたか。 | 統合候補 §39【実用コメント】1（再構成） | `approved` |
| `title-pair-conscientiousness-low--emotionalStability-low` | 2 | 負担を感じたとき、どのような場所や過ごし方で気持ちを整えていますか。 | 統合候補 §39【実用コメント】2（再構成） | `approved` |
| `title-pair-conscientiousness-low--emotionalStability-low` | 3 | 気がかりが重なったとき、今は扱わないことを決めてみませんか。 | 統合候補 §39【実用コメント】1（再構成） | `approved` |

レビュー注: 気持ちや負担に合わせて予定を見直す特徴を活かし、計画性を高めず今は扱わない範囲も選べる提案にした。

### 40. 輪舞へ踏み出す共演者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-extraversion-high--agreeableness-high` | 1 | 人が集まる場では、どのような役割やふるまい方がしっくりきますか。 | 統合候補 §40【実用コメント】3（再構成） | `approved` |
| `title-pair-extraversion-high--agreeableness-high` | 2 | 場を盛り上げながら、自分の希望も伝えられたことはありましたか。 | 統合候補 §40【実用コメント】1（再構成） | `approved` |
| `title-pair-extraversion-high--agreeableness-high` | 3 | 参加する集まりで、誰とどんな話をしたいか考えてみませんか。 | 統合候補 §40【実用コメント】3（再構成） | `approved` |

レビュー注: 人との交流と場の調和を楽しむ特徴を活かし、自分の希望や話したい相手も選べる構成にした。

### 41. 自分の色を掲げる表明者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-extraversion-high--agreeableness-low` | 1 | 自分の意見を率直に伝えたことで、話が進んだ場面はありましたか。 | 統合候補 §41【実用コメント】1（再構成） | `approved` |
| `title-pair-extraversion-high--agreeableness-low` | 2 | 相手と意見が違ったとき、どのように話を進めていますか。 | 統合候補 §41【実用コメント】3（再構成） | `approved` |
| `title-pair-extraversion-high--agreeableness-low` | 3 | 相手と意見が違うとき、話のどこから切り出すか考えてみませんか。 | 統合候補 §41【実用コメント】1（再構成） | `approved` |

レビュー注: 率直な発信と自分の判断を活かし、相手へ合わせることを目的にせず話の切り出し方を選べる提案にした。

## TR-4（表示順42〜51）

### 42. 寄り添う静観者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-extraversion-low--agreeableness-high` | 1 | 誰かの話を聞くとき、相手が話しやすいように意識していることはありますか。 | 統合候補 §42【実用コメント】1（再構成） | `approved` |
| `title-pair-extraversion-low--agreeableness-high` | 2 | 相手の話を聞く中で、自分の考えも伝えたいと思ったのはどんなときでしたか。 | 統合候補 §42【実用コメント】1（再構成） | `approved` |
| `title-pair-extraversion-low--agreeableness-high` | 3 | 身近な人の話を聞いたあと、自分が理解したことを短く伝えてみませんか。 | 統合候補 §42【実用コメント】1（再構成） | `approved` |

レビュー注: 注意深く話を聞く姿勢と短い言葉で応じる着眼点を活かし、静かに寄り添うことで相手を救えるとは断定しなかった。

### 43. 一席を選ぶ滞在者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-extraversion-low--agreeableness-low` | 1 | 人と関わるとき、自分に合う距離をどう決めていますか。 | 統合候補 §43【実用コメント】1（再構成） | `approved` |
| `title-pair-extraversion-low--agreeableness-low` | 2 | 一人で過ごしたことで、考えが整理された場面はありましたか。 | 統合候補 §43【実用コメント】2（再構成） | `approved` |
| `title-pair-extraversion-low--agreeableness-low` | 3 | 落ち着いて過ごせる場所で、好きなことをしてみませんか。 | 統合候補 §43【実用コメント】3（再構成） | `approved` |

レビュー注: 自分に合う距離や場所を選ぶ特徴を活かし、人との関わりを広げることや支援を求めることは目的にしなかった。

### 44. 寛ぐ交遊者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-extraversion-high--emotionalStability-high` | 1 | 人が多い場所でも、自然体で過ごせたのはどんなときでしたか。 | 統合候補 §44【実用コメント】1（再構成） | `approved` |
| `title-pair-extraversion-high--emotionalStability-high` | 2 | 周囲が緊張しているとき、雰囲気を和らげるためにどのような声をかけていますか。 | 統合候補 §44【実用コメント】1（再構成） | `approved` |
| `title-pair-extraversion-high--emotionalStability-high` | 3 | しばらく会っていない人に、最近の様子を尋ねてみませんか。 | 統合候補 §44【実用コメント】3（再構成） | `approved` |

レビュー注: 活気のある場で自然体に交流する特徴を活かし、弱さを見せることや新しい相手との交流は求めなかった。

### 45. ざわめきへ振り向く参加者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-extraversion-high--emotionalStability-low` | 1 | 人と話した後、相手の反応が気になって会話を振り返ったことはありますか。 | 統合候補 §45【実用コメント】1（再構成） | `approved` |
| `title-pair-extraversion-high--emotionalStability-low` | 2 | 人が多い場で刺激が強いと感じたとき、過ごし方をどう変えていますか。 | 統合候補 §45【実用コメント】2（再構成） | `approved` |
| `title-pair-extraversion-high--emotionalStability-low` | 3 | 会話の後に気になったことを、「実際の反応」と「自分の想像」に分けて書いてみませんか。 | 統合候補 §45【実用コメント】1（再構成） | `approved` |

レビュー注: 相手の反応や場の刺激に意識が向く特徴を活かし、不安や負担を減らせるとは断定しなかった。

### 46. 芽吹きを待つ滞在者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-extraversion-low--emotionalStability-high` | 1 | 何かを始めるとき、タイミングをどのように見極めていますか。 | 統合候補 §46【実用コメント】1（再構成） | `approved` |
| `title-pair-extraversion-low--emotionalStability-high` | 2 | 一人で静かに過ごす中で、やってみたいことが浮かんだことはありますか。 | 統合候補 §46【実用コメント】2（再構成） | `approved` |
| `title-pair-extraversion-low--emotionalStability-high` | 3 | これから始めたいことについて、必要な情報を調べてみませんか。 | 統合候補 §46【実用コメント】3（再構成） | `approved` |

レビュー注: 落ち着いて時機を見極める特徴と情報収集の着眼点を活かし、外へ踏み出すことや期限を設けることは求めなかった。

### 47. 薄明に耳を向ける逗留者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-extraversion-low--emotionalStability-low` | 1 | 刺激の多い場所で疲れを感じたとき、その後をどのように過ごしていますか。 | 統合候補 §47【実用コメント】1（再構成） | `approved` |
| `title-pair-extraversion-low--emotionalStability-low` | 2 | 周囲の反応が気になったとき、どんな相手なら安心して話せますか。 | 統合候補 §47【実用コメント】1（再構成） | `approved` |
| `title-pair-extraversion-low--emotionalStability-low` | 3 | 気持ちが落ち着かないとき、好きな音楽を聴く時間を作ってみませんか。 | 統合候補 §47【実用コメント】3（再構成） | `approved` |

レビュー注: 刺激から距離を置くことや安心できる相手を選ぶ着眼点を活かし、敏感さを問題や能力として扱わなかった。

### 48. ふたつの杯の相席者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-agreeableness-high--emotionalStability-high` | 1 | 意見が分かれたとき、お互いが納得できる点をどのように探していますか。 | 統合候補 §48【実用コメント】1（再構成） | `approved` |
| `title-pair-agreeableness-high--emotionalStability-high` | 2 | 相手に配慮しながら、自分にとって大切なことも伝えられた場面はありましたか。 | 統合候補 §48【実用コメント】2（再構成） | `approved` |
| `title-pair-agreeableness-high--emotionalStability-high` | 3 | 話し合いの場で、出てきた意見を短くまとめてみませんか。 | 統合候補 §48【実用コメント】3（再構成） | `approved` |

レビュー注: 落ち着いて合意点を探す特徴と自分の大切な点も言葉にする視点を活かし、対立を避けることは目的にしなかった。

### 49. 揺れ布に並ぶ同伴者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-agreeableness-high--emotionalStability-low` | 1 | 相手の表情や声の変化に気づいたのは、どんなときでしたか。 | 統合候補 §49【実用コメント】1（再構成） | `approved` |
| `title-pair-agreeableness-high--emotionalStability-low` | 2 | 誰かの気持ちを気にかける中で、自分まで疲れてしまったことはありますか。 | 統合候補 §49【実用コメント】1（再構成） | `approved` |
| `title-pair-agreeableness-high--emotionalStability-low` | 3 | 相手を気にかけているとき、自分にできることと相手に任せることを分けて考えてみませんか。 | 統合候補 §49【実用コメント】1（再構成） | `approved` |

レビュー注: 相手や関係の変化に気づく特徴を活かし、相手の感情を自分の責任として扱わないための見分け方を提案した。

### 50. 淡々たる表明者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-agreeableness-low--emotionalStability-high` | 1 | 反対意見が出たとき、落ち着いて自分の立場を伝えられた場面はありましたか。 | 統合候補 §50【実用コメント】1（再構成） | `approved` |
| `title-pair-agreeableness-low--emotionalStability-high` | 2 | 相手が強く反応したとき、そのまま話を続けるか、いったん区切るかをどう決めていますか。 | 統合候補 §50【実用コメント】1（再構成） | `approved` |
| `title-pair-agreeableness-low--emotionalStability-high` | 3 | 意見が分かれた話題について、自分が重視する点を短く整理してみませんか。 | 統合候補 §50【実用コメント】1（再構成） | `approved` |

レビュー注: 反対意見があっても冷静に立場を保つ特徴を活かし、相手へ合わせることや同意を得ることは目的にしなかった。

### 51. 風鳴る戸口の掲示者

| title_id | display_order | text | source_locator | review_status |
|---|---:|---|---|---|
| `title-pair-agreeableness-low--emotionalStability-low` | 1 | 問題に気づいたとき、どのようなタイミングで周囲に伝えていますか。 | 統合候補 §51【実用コメント】1（再構成） | `approved` |
| `title-pair-agreeableness-low--emotionalStability-low` | 2 | 強い違和感を覚えたとき、何を確かめてから言葉にしていますか。 | 統合候補 §51【実用コメント】1（再構成） | `approved` |
| `title-pair-agreeableness-low--emotionalStability-low` | 3 | 気になっている問題を、「確認できた事実」「自分の受け止め」「望んでいること」に分けて書いてみませんか。 | 統合候補 §51【実用コメント】1（再構成） | `approved` |

レビュー注: 問題や対立の兆しに気づき率直に示す特徴を活かし、伝える前に事実、受け止め、希望を整理する提案にした。

## 保留中のバッチ

- なし。TR-0〜TR-4はすべてプロジェクトオーナー承認済み。
