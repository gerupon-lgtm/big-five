# 「今求めている感覚」に応じた香り提案機能の妥当性・安全性調査

- 作成日: 2026-07-20
- 対象: Big Five自己理解支援Webアプリ
- 調査範囲: 香り・嗅覚と気分／覚醒／ストレス／集中の関連、個人差、表示表現、安全性、初版仕様
- 位置づけ: 要件・基本設計判断のための調査資料。医療・獣医療上の助言ではない

## 1. 結論

機能化は可能であり、猫キャラクター・色選択に続く参加型コンテンツとして相性がよい。ただし、成立するのは「現在の心理状態を診断して効く精油を処方する機能」ではなく、ユーザーが自分で選んだ「今求めている感覚」を起点に、香りの方向性を2〜3案提示し、本人の好みで選ぶ**フレグランス・ナビゲーション**である。

推奨する基本原則は次のとおり。

1. Big Five得点から香りの効能を推定しない。
2. 「落ち着きたい」等は診断結果ではなく、ユーザーが任意選択した現在の希望として扱う。
3. 特定の精油を処方せず、まず「やわらかなフローラル」「明るいシトラス」のような香調を2〜3案提示する。
4. 最終決定は本人の「好き／苦手／思い出」に委ね、「選ばない・無香料」も同格の選択肢にする。
5. 「治す」「改善する」「集中力が上がる」ではなく、「雰囲気づくりの候補」「気分を切り替えるきっかけ」のように表現する。
6. アプリは摂取、皮膚塗布、DIY配合、滴数・濃度を案内しない。
7. 喘息・香料過敏、妊娠・授乳、乳幼児、猫・鳥などのペットがいる場合は安全分岐を設ける。
8. 猫・鳥がいる家庭には、初版ではディフューザー等の実使用を勧めず、「香りのイメージ提案」に留めるのが安全である。

## 2. エビデンスの整理

### 2.1 気分・生理・行動への影響

Herz（2009）は、厳しい実証基準を満たす18研究を詳しく検討し、においが気分・生理・行動へ影響し得ること自体には信頼できる証拠がある一方、薬理学的説明だけよりも、香りの意味、学習、期待などを含む心理学的説明の方が包括的だと結論づけた。文化、経験、性差、性格も媒介要因として挙げられている。したがって、香料成分から万人共通の心理効果を機械的に決める設計は支持されない。

- Herz RS. *Aromatherapy Facts and Fictions: A Scientific Analysis of Olfactory Effects on Mood, Physiology and Behavior*. Int J Neurosci. 2009;119(2):263-290. [PubMed](https://pubmed.ncbi.nlm.nih.gov/19125379/) / [DOI: 10.1080/00207450802333953](https://doi.org/10.1080/00207450802333953)

### 2.2 ストレス・不安

健康成人のストレスを対象とした2014年の系統的レビュー／メタ解析では、香りの吸入が主観的ストレスに有利な可能性が示された一方、対象は5件のRCTに限られ、多くが高バイアスリスクだった。コルチゾールの差は統計的に有意ではなく、著者も確定的結論には研究数・規模・質が不足するとしている。

- Hur MH, et al. *Aromatherapy for stress reduction in healthy adults: a systematic review and meta-analysis of randomized clinical trials*. Maturitas. 2014;79(4):362-369. [PubMed](https://pubmed.ncbi.nlm.nih.gov/25234160/) / [DOI: 10.1016/j.maturitas.2014.08.006](https://doi.org/10.1016/j.maturitas.2014.08.006)

不安を対象とした2020年のメタ解析（25論文、32試験）は吸入・マッサージによる不安尺度の低下を報告した。ただし対象者、状況、精油、投与法が混在し、適切な用量は未確定である。「研究で副作用が記載されなかった」ことは、安全性が十分評価されたことを意味しない。

- Gong M, et al. *Effects of aromatherapy on anxiety: A meta-analysis of randomized controlled trials*. J Affect Disord. 2020;274:1028-1040. [PubMed](https://pubmed.ncbi.nlm.nih.gov/32663929/) / [DOI: 10.1016/j.jad.2020.05.118](https://doi.org/10.1016/j.jad.2020.05.118)

**判断:** 「ストレスを下げる香り」「不安を改善する香り」と断定してはならない。「落ち着いた雰囲気を求める人が選びやすい候補」として提示する範囲なら成立する。

### 2.3 覚醒・注意・記憶・集中

ラベンダー吸入の認知影響を扱った2022年の系統的レビューでは、採択11研究で覚醒低下と持続的注意の上昇が報告された一方、記憶の結果は一貫しなかった。精油品質の評価不足、投与プロトコルの不均一性、プラセボ効果との分離困難が明記されている。

- Malloggi E, et al. *Lavender aromatherapy: A systematic review from essential oil quality and administration methods to cognitive enhancing effects*. Appl Psychol Health Well Being. 2022;14(2):663-690. [PubMed](https://pubmed.ncbi.nlm.nih.gov/34611999/) / [DOI: 10.1111/aphw.12310](https://doi.org/10.1111/aphw.12310)

健康成人144人を無作為にローズマリー、ラベンダー、無香条件へ割り付けた試験では、香りによって認知課題・気分への異なる急性影響が観察された。ただし、単一試験の短期効果を日常生活での確実な「集中力向上」に一般化できない。

- Moss M, et al. *Aromas of rosemary and lavender essential oils differentially affect cognition and mood in healthy adults*. Int J Neurosci. 2003;113(1):15-38. [PubMed](https://pubmed.ncbi.nlm.nih.gov/12690999/) / [DOI: 10.1080/00207450390161903](https://doi.org/10.1080/00207450390161903)

精油成分と注意を扱った実験でも、主観評価と客観成績の複雑な関係から、基本的注意への影響は主として心理学的である可能性が示されている。

- Ilmberger J, et al. *The influence of essential oils on human attention. I: alertness*. Chem Senses. 2001;26(3):239-245. [PubMed](https://pubmed.ncbi.nlm.nih.gov/11287383/) / [DOI: 10.1093/chemse/26.3.239](https://doi.org/10.1093/chemse/26.3.239)

**判断:** 「集中しやすい雰囲気にしたい」に対して、ハーバル、ミント、シトラス等の候補を示すことはできるが、「集中できる」「作業効率が上がる」と保証してはならない。

## 3. 個人差が中核になる理由

### 3.1 好み

2022年の異文化研究では、においの快さには文化を越えた共通性もあったが、個人の好みが大きな説明要因だった。2024年の追加研究も、一定の異文化共通性と同時に、親しみ、文化的背景、個人経験が組み合わさる複雑さを報告している。

- Arshamian A, et al. *The perception of odor pleasantness is shared across cultures*. Curr Biol. 2022;32(9):2061-2066.e3. [PubMed](https://pubmed.ncbi.nlm.nih.gov/35381183/) / [DOI: 10.1016/j.cub.2022.02.062](https://doi.org/10.1016/j.cub.2022.02.062)
- Sorokowska A, et al. *Is the perception of odour pleasantness shared across cultures and ecological conditions?* Proc R Soc B. 2024. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11285824/)

### 3.2 経験・記憶

本人にとって意味のある香りは、自伝的記憶を介して気分や生理反応に影響し得る。自己選択した「思い出の香り」が、一般的な快香や中性香より深くゆっくりした呼吸と関連した研究もレビューされている。これは、一般向け固定マッピングより本人選択を優先する根拠になる。

- Herz RS. *The Role of Odor-Evoked Memory in Psychological and Physiological Health*. Brain Sci. 2016;6(3):22. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5039451/) / [DOI: 10.3390/brainsci6030022](https://doi.org/10.3390/brainsci6030022)

### 3.3 期待・言葉・文脈

カモミール香を用いた健康成人80人の研究では、「覚醒させる」「鎮静させる」という事前情報を操作すると、気分・認知成績に期待の影響が現れた。刺激性への期待が、実際には刺激性のないにおいの知覚と嗅覚事象関連電位を変えた研究もある。

- Moss M, et al. *Expectancy and the aroma of Roman chamomile influence mood and cognition in healthy volunteers*. Int J Aromatherapy. 2006;16(2):63-73. [DOI: 10.1016/j.ijat.2006.04.002](https://doi.org/10.1016/j.ijat.2006.04.002)
- Bulsing PJ, et al. *Irritancy expectancy alters odor perception: evidence from olfactory event-related potential research*. J Neurophysiol. 2010. [PubMed](https://pubmed.ncbi.nlm.nih.gov/20844114/) / [DOI: 10.1152/jn.00754.2009](https://doi.org/10.1152/jn.00754.2009)

日本人とドイツ人の日常臭の比較や、香りのラベルが異文化間の感情反応へ及ぼす研究も、親しみ・経験・言語ラベルの影響を示す。

- Ayabe-Kanamura S, et al. *Differences in Perception of Everyday Odors: a Japanese-German Cross-cultural Study*. Chem Senses. 1998;23(1):31-38. [DOI: 10.1093/chemse/23.1.31](https://doi.org/10.1093/chemse/23.1.31)
- Ferdenzi C, et al. *Individual differences in verbal and non-verbal affective responses to smells: Influence of odor label across cultures*. Chem Senses. 2017. [DOI: 10.1093/chemse/bjw098](https://doi.org/10.1093/chemse/bjw098)

**設計上の帰結:** 強い効能コピーは、科学的に不適切なだけでなく期待効果を誘導する。候補理由を穏やかに説明し、本人の好みと記憶を必ず確認する。

## 4. 表現ガイド

### 4.1 使用してよい表現

- 「今ほしい雰囲気に合いそうな香りの候補」
- 「気分を切り替えるきっかけとして」
- 「やわらかく落ち着いた印象の香調」
- 「すっきりした印象を好む人が選びやすい香調」
- 「研究例はありますが、感じ方には個人差があります」
- 「香りの効果を保証するものではありません」
- 「一番心地よく感じるものを選んでください」
- 「どれも合わない／無香料を選ぶ」

### 4.2 避ける表現

- 「あなたに効く香り」
- 「不安・ストレスを治す／改善する」
- 「自律神経を整える」
- 「集中力・記憶力・生産性を高める」
- 「睡眠の質を上げる」
- 「この性格にはこの精油が必要」
- 「天然だから安全」
- 「副作用がない」

FDAは、香り製品が疾患の治療・予防、身体構造・機能への作用を意図して表示される場合、米国では医薬品クレームになり得ると説明している。また植物由来でも、毒性、刺激、アレルギーの可能性があるとしている。これは日本法の直接判断ではないが、自己理解支援ツールの表示境界を考える上で有用である。公開・商品連携時には日本の薬機法、景品表示法等を別途確認する。

- U.S. FDA. [Aromatherapy](https://www.fda.gov/cosmetics/cosmetic-products/aromatherapy)

## 5. 安全性

### 5.1 人への注意

精油は濃縮物であり、「自然」は安全を意味しない。皮膚刺激・発疹、アレルギー、誤飲による中毒、誤嚥性肺炎、薬との相互作用があり得る。製品の植物種、濃度、混入物が不明なこともある。

- アプリから摂取を勧めない。
- 原液の皮膚塗布を勧めない。
- DIYの希釈率、滴数、ブレンドレシピを出さない。
- 市販品は用途とラベルに従うよう案内する。
- 傷ついた皮膚には使用しない。
- 発疹、目・鼻・喉の刺激、咳、息苦しさ等が出たら直ちに中止し、新鮮な空気の場所へ移動する。呼吸困難は緊急対応を促す。
- 子どもやペットの手が届かない場所に保管する。

根拠:

- National Capital Poison Center. [Essential oils: Poisonous when misused](https://www.poison.org/articles/essential-oils)
- U.S. FDA. [Aromatherapy](https://www.fda.gov/cosmetics/cosmetic-products/aromatherapy)

### 5.2 喘息・香料過敏・アレルギー

香料は喘息を引き起こしたり悪化させたりする場合があり、皮膚アレルギーも起こり得る。喘息、香料過敏、既知のアレルギー、香りで頭痛・吐き気・咳が出る人には「無香料」を標準提案とし、アプリが試用を促さない設計が妥当である。

- California Department of Public Health / NIOSH. [Fragrances and Work-Related Asthma](https://stacks.cdc.gov/view/cdc/230975)
- National Capital Poison Center. [Essential oils: Poisonous when misused](https://www.poison.org/articles/essential-oils)

### 5.3 妊娠・授乳

妊娠中の「自然」な療法もすべて安全とは限らず、品質問題もある。NHSは、ハーブ・ホメオパシー・アロマテラピーを利用する場合、医師・助産師・薬剤師に伝え、資格を持つ専門家へ相談するよう案内している。アプリは妊娠・授乳中の個別精油推薦や使用法を出さず、医療従事者への確認を促す。

- NHS. [Medicines in pregnancy — Herbal and homeopathic remedies and aromatherapy](https://www.nhs.uk/pregnancy/keeping-well/medicines/)

### 5.4 猫・鳥などのペット

本アプリは猫をモチーフにするため、一般の診断アプリより猫の飼育者が集まりやすい可能性がある。ペット安全は補足ではなく必須要件とする。

Merck Veterinary Manualによると、精油は消化管、皮膚、肺、粘膜から吸収され、猫はグルクロン酸抱合に関わる能力の違いにより特に感受性が高い。猫の毛に付いた微粒子は、皮膚吸収やグルーミング時の摂取につながる。鳥も呼吸器の特性から高リスクである。

能動式（ネブライザー、超音波式）ディフューザーは油の微粒子を放出し、猫や鳥では吸入だけでなく被毛への付着が問題になる。受動式も、呼吸器刺激、転倒・接触・誤飲リスクがある。集中精油をペットへ直接塗布してはならない。

- Merck Veterinary Manual. [Toxicoses From Essential Oils in Animals](https://www.merckvetmanual.com/toxicology/toxicoses-from-household-hazards/toxicoses-from-essential-oils-in-animals)
- Pet Poison Helpline. [Essential Oils and Cats](https://www.petpoisonhelpline.com/uncategorized/essential-oils-cats/)
- ASPCA Animal Poison Control Center. [The Essentials of Essential Oils Around Pets](https://www.aspca.org/news/essentials-essential-oils-around-pets)

**初版の推奨措置:**

- 「猫・鳥が生活する空間ですか？」を安全確認に含める。
- 「はい」の場合はディフューザー、ルームスプレー、精油塗布等の実使用提案を表示しない。
- 香りの名称・イメージカードは閲覧できるが、「ペットと同じ空間での使用を勧めるものではありません」と明示する。
- ペットへ直接使用しない、舐めさせない、容器を届く場所に置かない旨を表示する。
- 曝露後に流涙、鼻水、よだれ、嘔吐、ふらつき、咳、喘鳴、呼吸困難等が見られた場合は、新鮮な空気の場所へ移し、速やかに獣医師へ連絡する。自己判断で吐かせない。

## 6. 推奨するアプリ仕様

### 6.1 画面フロー

1. Big Five診断・猫キャラクター・色選択を完了
2. 任意機能として「今の気分に香りを添えますか？」を表示
3. 「今求めている感覚」を1つ選択
4. 最小限の安全確認
5. 香調カードを3枚提示
6. 各候補に「好き」「少し気になる」「苦手」「思い出がある」を付けられる
7. 1案を選ぶ、または「今回は選ばない／無香料」
8. 選択した色・猫・香調で結果カードを完成
9. 履歴には心理状態ではなく「そのとき本人が選んだ希望と香り」として保存

### 6.2 安全確認

以下のいずれかに該当する場合、安全モードへ切り替える。

- 喘息、香料過敏、香りで咳・頭痛・吐き気等が出る
- 妊娠中・授乳中
- 乳幼児や子どもが生活する
- 猫・鳥・その他のペットが生活する
- 皮膚への使用や摂取を考えている

安全モードでは香りを「イメージ」としてのみ表示し、使用法、滴数、濃度、精油商品へのリンクを出さない。喘息・香料過敏の場合は無香料を第一候補にする。

### 6.3 提案ロジック

Big Five得点から直接決めず、本人が選んだ希望 `desired_feeling` を起点にする。候補は精油名より一段抽象化した `scent_family` で管理する。

| 今求めている感覚 | 候補A | 候補B | 候補C | 表示理由の例 |
|---|---|---|---|---|
| 落ち着きたい | やわらかなフローラル | 静かなウッディ | まろやかなティー／ハーバル | 「刺激の少ない、穏やかな印象の香調を集めました」 |
| 元気を出したい | 明るいシトラス | みずみずしいグリーン | 軽快なフルーティ | 「明るさや軽やかさを感じやすい香調です」 |
| 気持ちを切り替えたい | シトラス・ハーバル | 透明感のあるグリーン | すっきりしたミント調 | 「輪郭がはっきりした、切り替えの合図にしやすい香調です」 |
| 集中しやすい雰囲気にしたい | クリアなハーバル | 控えめなミント調 | ドライなウッディ | 「作業空間になじませやすい、すっきりした印象の候補です」 |
| 自分をいたわりたい | やわらかなフローラル | 温かいバニラ調 | 穏やかなティー調 | 「包まれるような印象を好む人が選びやすい候補です」 |

これは効果の強さ順ではなく、異なる方向性の比較である。具体的な植物名（ラベンダー、ローズマリー、ペパーミント等）は「代表的に連想される香り」として補助表示できるが、製品や精油の使用推奨にはしない。ペット安全モードでは、猫への毒性が問題になる個別精油名を積極提示せず、香調名に留める。

### 6.4 候補選択の説明文

> 研究では、香りが気分や注意に関係する例が報告されています。ただし、感じ方は好み、思い出、期待、体調、環境によって変わります。これは治療や効果を保証する提案ではありません。今のあなたが心地よいと感じる方向を選んでください。

選択後:

> あなたが選んだ香りで、今日のプロフィールが完成しました。この香りは「今求めていた雰囲気と、あなたの好みの記録」です。

安全モード:

> 香りが負担になる人や、妊娠・授乳中、猫・鳥などと暮らす人もいます。今回は香りのイメージとして楽しみ、実際に使用する場合は製品表示と専門家の助言を確認してください。

### 6.5 データ項目案

```text
desired_feeling
safety_flags[]
presented_scent_family_ids[]
selected_scent_family_id | null
selection_reaction: liked | curious | disliked | memory | none
free_note | null
selected_at
content_version
safety_copy_version
```

安全フラグはセンシティブ情報になり得るため、ローカル保存の必要性を最小化する。保存する場合も詳細な病名ではなく、`fragrance_caution`、`pregnancy_caution`、`pet_caution` 等の表示制御用フラグに留め、保存目的と削除方法を明示する。

## 7. MVPで採用する範囲

### 採用

- 任意参加
- 「今求めている感覚」5択程度
- 香調3案＋無香料
- 本人の好き／苦手／思い出フィードバック
- 色・猫・香調を合わせた共有カード
- 履歴への選択記録
- 安全確認と安全モード
- 根拠・限界・安全情報へのリンク

### MVPでは採用しない

- Big Five得点と特定精油の固定対応
- 心理状態の推定・診断
- 個別の精油製品推薦、購入リンク
- 使用量、濃度、滴数、DIYブレンド
- 摂取、皮膚塗布、入浴等の使用指示
- 「効いたか」の医療的評価
- 猫・鳥のいる空間でのディフューザー推奨

## 8. リスクと対策

| リスク | 対策 |
|---|---|
| 疑似科学・診断との混同 | 「本人が選んだ希望に対する香りの方向性」と明記し、Big Five判定と分離 |
| 効能の誇張 | 禁止表現リスト、コピー審査、根拠・限界表示 |
| 期待効果の過度な誘導 | 断定コピーを避け、3候補を同格表示 |
| 香りの個人差 | 本人選択、苦手・思い出、無香料を用意 |
| 喘息・アレルギー等 | 事前安全確認、安全モード、中止基準 |
| 妊娠・授乳 | 個別精油・使用法を提示せず、専門家確認 |
| 誤飲・皮膚障害 | 摂取・原液塗布・DIY配合を案内しない |
| 猫・鳥への曝露 | ペット分岐、実使用提案を停止、獣医情報を表示 |
| 収益化後の利益相反 | 商品ランキングと診断ロジックを分離し、広告・提携を明示 |

## 9. 総合評価

| 観点 | 評価 | 理由 |
|---|---|---|
| エンタメ性 | 高い | 猫・色・香りで結果カードを本人が完成できる |
| 参加感 | 高い | 診断後も好み・記憶による選択が入る |
| 心理学的妥当性 | 条件付き | 香りの影響例はあるが固定的な効能対応は不可 |
| 診断の信頼性への影響 | 低い | Big Five採点と完全に分離すれば保てる |
| 安全性 | 条件付き | 使用指示を避け、安全分岐、とくにペット対策が必要 |
| MVP適合性 | 中〜高 | 香調カードと選択記録は軽量。安全UI・文言レビューは必須 |

最終推奨は、機能名を「あなたに効くアロマ」ではなく、**「今の自分に添える香り」**または**「今日のフレグランス・ノート」**とし、色提案と同じく「アプリが決定する」のではなく「候補から本人が選んで完成させる」方式である。
