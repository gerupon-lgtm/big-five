# ココロアロマ確認資料

正典: `content/source/presentation/presentation-v2/*.csv`

本書は香りの語彙・素材・称号別割り当てを確認する決定的な生成ビューです。生成しただけでは承認やruntime接続を意味しません。

香りは称号から着想した非診断的な演出であり、効果・適合・商品・使用方法の案内ではありません。

## マスタ変更前後

| 変更前 | 変更後 | 理由 |
| --- | --- | --- |
| fragrance-pause-roman-chamomile-soft | fragrance-pause-roman-chamomileへ統合 | 同一素材・近接表現の重複 |
| fragrance-pause-chamomile / material-chamomile | 削除 | カモミール種別が曖昧 |
| fragrance-pause-ylang-ylang | fragrance-pause-sweet-orange | pauseには濃厚すぎる |
| fragrance-reset-citronella | fragrance-reset-ginger | 虫よけ用品の連想を避ける |
| fragrance-pause-patchouli | 削除（quiet-focusだけ維持） | 深く落ち着く香りをquiet-focusへ限定 |

## 3場面

| 順 | scene ID | 表示名 | icon ID |
| --- | --- | --- | --- |
| 1 | `pause` | ひと息つきたい | `aroma-pause` |
| 2 | `reset` | 気持ちを切り替えたい | `aroma-reset` |
| 3 | `quiet-focus` | 静かに取り組みたい | `aroma-quiet-focus` |

## 香調マスタ（29件）

| 順 | 香調ID | 場面 | family | 素材例 | 短い印象 | 説明 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `fragrance-pause-roman-chamomile` | ひと息つきたい | `floral` | ローマンカモミール | まろやかな甘みの草花の香調 | まろやかな甘みとやわらかな草花の気配が、静かな余白のある情景を思わせる穏やかな香調です。 |
| 2 | `fragrance-pause-sandalwood` | ひと息つきたい | `woody` | サンダルウッド | 温かく穏やかな木質の香調 | 温かみと丸みを帯びた木質の気配が、静かな余白のある情景を思わせる穏やかな香調です。 |
| 3 | `fragrance-reset-grapefruit` | 気持ちを切り替えたい | `citrus` | グレープフルーツ | ほろ苦く明るい柑橘の香調 | ほろ苦さと明るさが重なる柑橘の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。 |
| 4 | `fragrance-reset-lemongrass` | 気持ちを切り替えたい | `herbal` | レモングラス | レモンを思わせる青い草の香調 | レモンを思わせる青い草の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。 |
| 5 | `fragrance-quiet-focus-bergamot` | 静かに取り組みたい | `citrus` | ベルガモット | ほろ苦く端正な柑橘の香調 | ほろ苦さと端正な輪郭を持つ柑橘の気配が、落ち着いた机辺と静かな時間を思わせる香調です。 |
| 6 | `fragrance-quiet-focus-frankincense` | 静かに取り組みたい | `resinous` | フランキンセンス | 静かな樹脂の輪郭を含む木質の香調 | 乾いた木質に静かな樹脂の輪郭が重なる気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。 |
| 7 | `fragrance-pause-sweet-orange` | ひと息つきたい | `citrus` | スイートオレンジ | やわらかな甘みの柑橘の香調 | 丸みのある柑橘の明るさが、静かな余白のある情景を思わせる穏やかな香調です。 |
| 8 | `fragrance-pause-marjoram` | ひと息つきたい | `herbal` | マジョラム | 温かく穏やかなハーブの香調 | 温かみのある穏やかな葉の気配が、静かな余白のある情景を思わせる穏やかな香調です。 |
| 9 | `fragrance-reset-petitgrain` | 気持ちを切り替えたい | `citrus` | プチグレン | 青い葉と柑橘の香調 | 青い葉とほろ苦い柑橘が重なる気配が、空気の流れが変わる情景を思わせる軽やかな香調です。 |
| 10 | `fragrance-reset-lemon` | 気持ちを切り替えたい | `citrus` | レモン | 鮮やかで明るい柑橘の香調 | 鮮やかな明るさと軽い酸味を持つ柑橘の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。 |
| 11 | `fragrance-quiet-focus-rosemary` | 静かに取り組みたい | `herbal` | ローズマリー | 青く端正なハーブの香調 | 青々とした葉と端正な輪郭を持つ気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。 |
| 12 | `fragrance-quiet-focus-juniper-berry` | 静かに取り組みたい | `fresh` | ジュニパーベリー | 澄んだ針葉樹と青い実の香調 | 澄んだ針葉樹と青い実を思わせる気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。 |
| 13 | `fragrance-pause-hinoki` | ひと息つきたい | `woody` | ヒノキ | 静かな森を思わせる木質の香調 | 穏やかな木の質感と静かな森を思わせる気配が、静かな余白のある情景を思わせる香調です。 |
| 14 | `fragrance-pause-neroli` | ひと息つきたい | `floral` | ネロリ | 透明感のある花と柑橘の香調 | 繊細な花と明るい柑橘が重なる気配が、静かな余白のある情景を思わせる穏やかな香調です。 |
| 15 | `fragrance-reset-rosemary` | 気持ちを切り替えたい | `herbal` | ローズマリー | 風を受ける青い葉のハーブの香調 | 青い葉が風を受ける気配が、空気の流れが変わる情景を思わせる軽やかな香調です。 |
| 16 | `fragrance-reset-lime` | 気持ちを切り替えたい | `citrus` | ライム | 軽快で透明な柑橘の香調 | 軽快な酸味と透明感を持つ柑橘の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。 |
| 17 | `fragrance-quiet-focus-patchouli` | 静かに取り組みたい | `earthy` | パチュリ | 湿り気を含む土と葉の香調 | 湿った土と葉を思わせる深みのある気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。 |
| 18 | `fragrance-quiet-focus-cypress` | 静かに取り組みたい | `woody` | サイプレス | 端正で清涼な木質の香調 | 細身の木立を思わせる端正で清涼な気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。 |
| 19 | `fragrance-pause-true-lavender` | ひと息つきたい | `floral` | 真正ラベンダー | 静かな甘みを含む花の香調 | 静かな甘みと乾いた花を思わせる気配が、静かな余白のある情景を思わせる穏やかな香調です。 |
| 20 | `fragrance-pause-ho-wood` | ひと息つきたい | `woody` | ホーウッド | やわらかな花を含む木質の香調 | なめらかな木質にやわらかな花のニュアンスが重なる気配が、静かな余白のある情景を思わせる穏やかな香調です。 |
| 21 | `fragrance-reset-bergamot` | 気持ちを切り替えたい | `citrus` | ベルガモット | 明るく軽快な柑橘の香調 | 明るい柑橘のほろ苦さが、空気の流れが変わる情景を思わせる軽やかな香調です。 |
| 22 | `fragrance-reset-peppermint` | 気持ちを切り替えたい | `fresh` | ペパーミント | 鋭く澄んだ清涼の香調 | ひんやりと澄んだ輪郭を持つ気配が、空気の流れが変わる情景を思わせる軽やかな香調です。 |
| 23 | `fragrance-quiet-focus-cedarwood` | 静かに取り組みたい | `woody` | シダーウッド | 乾いた深みのある木質の香調 | 乾いた木の質感を思わせる落ち着いた気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。 |
| 24 | `fragrance-quiet-focus-vetiver` | 静かに取り組みたい | `earthy` | ベチバー | 根と土を思わせる重厚な香調 | 乾いた根と土の層を思わせる気配が、落ち着いた机辺と静かな時間を思わせる端正な香調です。 |
| 25 | `fragrance-reset-mandarin` | 気持ちを切り替えたい | `citrus` | マンダリン | 丸みのあるやさしい切替の香調 | 丸みのある甘さと明るさが、丸みのあるやさしい切替を思わせる香調です。 |
| 26 | `fragrance-quiet-focus-hinoki` | 静かに取り組みたい | `woody` | ヒノキ | 端正で澄んだ木質の香調 | 乾いた木の質感と澄んだ輪郭が、落ち着いた机辺と静かな時間を思わせる端正な香調です。 |
| 27 | `fragrance-pause-frankincense` | ひと息つきたい | `resinous` | フランキンセンス | やわらかな樹脂と木質の香調 | 穏やかな樹脂と乾いた木質が重なる気配が、静かな余白のある情景を思わせる香調です。 |
| 28 | `fragrance-reset-ginger` | 気持ちを切り替えたい | `spicy` | ジンジャー | すっきりした辛みを含む香調 | 軽い辛みと明るさが交わる気配が、空気の流れが変わる情景を思わせる軽やかな香調です。 |
| 29 | `fragrance-reset-eucalyptus-radiata` | 気持ちを切り替えたい | `fresh` | ユーカリ・ラディアータ | 透明感のある葉の香調 | 透明感とすっきりした輪郭を持つ葉の気配が、空気の流れが変わる情景を思わせる軽やかな香調です。 |

## 香り素材（25件）

| 順 | 素材ID | 表示名 | 使用場面 |
| --- | --- | --- | --- |
| 1 | `material-roman-chamomile` | ローマンカモミール | ひと息つきたい |
| 2 | `material-sandalwood` | サンダルウッド | ひと息つきたい |
| 3 | `material-grapefruit` | グレープフルーツ | 気持ちを切り替えたい |
| 4 | `material-lemongrass` | レモングラス | 気持ちを切り替えたい |
| 5 | `material-bergamot` | ベルガモット | 気持ちを切り替えたい・静かに取り組みたい |
| 6 | `material-frankincense` | フランキンセンス | ひと息つきたい・静かに取り組みたい |
| 7 | `material-sweet-orange` | スイートオレンジ | ひと息つきたい |
| 8 | `material-marjoram` | マジョラム | ひと息つきたい |
| 9 | `material-petitgrain` | プチグレン | 気持ちを切り替えたい |
| 10 | `material-lemon` | レモン | 気持ちを切り替えたい |
| 11 | `material-rosemary` | ローズマリー | 気持ちを切り替えたい・静かに取り組みたい |
| 12 | `material-juniper-berry` | ジュニパーベリー | 静かに取り組みたい |
| 13 | `material-hinoki` | ヒノキ | ひと息つきたい・静かに取り組みたい |
| 14 | `material-neroli` | ネロリ | ひと息つきたい |
| 15 | `material-lime` | ライム | 気持ちを切り替えたい |
| 16 | `material-patchouli` | パチュリ | 静かに取り組みたい |
| 17 | `material-cypress` | サイプレス | 静かに取り組みたい |
| 18 | `material-true-lavender` | 真正ラベンダー | ひと息つきたい |
| 19 | `material-ho-wood` | ホーウッド | ひと息つきたい |
| 20 | `material-peppermint` | ペパーミント | 気持ちを切り替えたい |
| 21 | `material-cedarwood` | シダーウッド | 静かに取り組みたい |
| 22 | `material-vetiver` | ベチバー | 静かに取り組みたい |
| 23 | `material-mandarin` | マンダリン | 気持ちを切り替えたい |
| 24 | `material-ginger` | ジンジャー | 気持ちを切り替えたい |
| 25 | `material-eucalyptus-radiata` | ユーカリ・ラディアータ | 気持ちを切り替えたい |

## 51称号の候補と共有カード代表

### 1. 五つの風を見渡す観測者 (`title-balanced`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ローマンカモミール｜まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 候補: サンダルウッド｜温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 共有カード: ローマンカモミール｜まろやかな甘みの草花の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: グレープフルーツ｜ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 候補: レモングラス｜レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 共有カード: グレープフルーツ｜ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ベルガモット｜ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 候補: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 共有カード: ベルガモット｜ほろ苦く端正な柑橘の香調

### 2. おいかける探究者 (`title-single-intellectImagination-high`)

#### ひと息つきたい (`pause`)

- 候補: スイートオレンジ｜やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- ★ 共有代表: マジョラム｜温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 共有カード: マジョラム｜温かく穏やかなハーブの香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: プチグレン｜青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 候補: ローズマリー｜風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 共有カード: プチグレン｜青い葉と柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ジュニパーベリー｜澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 候補: パチュリ｜湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 共有カード: ジュニパーベリー｜澄んだ針葉樹と青い実の香調

### 3. 手ざわりをたどる散策者 (`title-single-intellectImagination-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ヒノキ｜静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 候補: ネロリ｜透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 共有カード: ヒノキ｜静かな森を思わせる木質の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: レモン｜鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- ★ 共有代表: ペパーミント｜鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 共有カード: ペパーミント｜鋭く澄んだ清涼の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ローズマリー｜青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 候補: ベチバー｜根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 共有カード: ローズマリー｜青く端正なハーブの香調

### 4. 整然たる計画者 (`title-single-conscientiousness-high`)

#### ひと息つきたい (`pause`)

- 候補: 真正ラベンダー｜静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- ★ 共有代表: ホーウッド｜やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 共有カード: ホーウッド｜やわらかな花を含む木質の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ライム｜軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- ★ 共有代表: ジンジャー｜すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 共有カード: ジンジャー｜すっきりした辛みを含む香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: パチュリ｜湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 候補: サイプレス｜端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 共有カード: パチュリ｜湿り気を含む土と葉の香調

### 5. 風向きに道を変える漂泊者 (`title-single-conscientiousness-low`)

#### ひと息つきたい (`pause`)

- 候補: マジョラム｜温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- ★ 共有代表: フランキンセンス｜やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 共有カード: フランキンセンス｜やわらかな樹脂と木質の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ベルガモット｜明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 候補: ユーカリ・ラディアータ｜透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 共有カード: ベルガモット｜明るく軽快な柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: シダーウッド｜乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 候補: ローズマリー｜青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 共有カード: シダーウッド｜乾いた深みのある木質の香調

### 6. にぎわいへ進む交遊者 (`title-single-extraversion-high`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ヒノキ｜静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 候補: ローマンカモミール｜まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 共有カード: ヒノキ｜静かな森を思わせる木質の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ペパーミント｜鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- ★ 共有代表: マンダリン｜丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 共有カード: マンダリン｜丸みのあるやさしい切替の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: ベチバー｜根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- ★ 共有代表: サイプレス｜端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 共有カード: サイプレス｜端正で清涼な木質の香調

### 7. 静謐なる滞在者 (`title-single-extraversion-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ネロリ｜透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 候補: サンダルウッド｜温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 共有カード: ネロリ｜透明感のある花と柑橘の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ベルガモット｜明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- ★ 共有代表: ユーカリ・ラディアータ｜透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 共有カード: ユーカリ・ラディアータ｜透明感のある葉の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- ★ 共有代表: ヒノキ｜端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 共有カード: ヒノキ｜端正で澄んだ木質の香調

### 8. 歩幅をそろえる同伴者 (`title-single-agreeableness-high`)

#### ひと息つきたい (`pause`)

- 候補: 真正ラベンダー｜静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- ★ 共有代表: スイートオレンジ｜やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 共有カード: スイートオレンジ｜やわらかな甘みの柑橘の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: マンダリン｜丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- ★ 共有代表: レモングラス｜レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 共有カード: レモングラス｜レモンを思わせる青い草の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: ジュニパーベリー｜澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- ★ 共有代表: ベルガモット｜ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 共有カード: ベルガモット｜ほろ苦く端正な柑橘の香調

### 9. 自分の歩幅で進む同行者 (`title-single-agreeableness-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ホーウッド｜やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 候補: フランキンセンス｜やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 共有カード: ホーウッド｜やわらかな花を含む木質の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ジンジャー｜すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 候補: グレープフルーツ｜ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 共有カード: ジンジャー｜すっきりした辛みを含む香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ジュニパーベリー｜澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 候補: シダーウッド｜乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 共有カード: ジュニパーベリー｜澄んだ針葉樹と青い実の香調

### 10. 静かなる航行者 (`title-single-emotionalStability-high`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: 真正ラベンダー｜静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 候補: フランキンセンス｜やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 共有カード: 真正ラベンダー｜静かな甘みを含む花の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: プチグレン｜青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- ★ 共有代表: ローズマリー｜風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 共有カード: ローズマリー｜風を受ける青い葉のハーブの香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: パチュリ｜湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 候補: ヒノキ｜端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 共有カード: パチュリ｜湿り気を含む土と葉の香調

### 11. そよ風に振り向く感受者 (`title-single-emotionalStability-low`)

#### ひと息つきたい (`pause`)

- 候補: ローマンカモミール｜まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- ★ 共有代表: サンダルウッド｜温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 共有カード: サンダルウッド｜温かく穏やかな木質の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ユーカリ・ラディアータ｜透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- ★ 共有代表: レモン｜鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 共有カード: レモン｜鮮やかで明るい柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: シダーウッド｜乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- ★ 共有代表: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 共有カード: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調

### 12. 星座盤に印を置く記録者 (`title-pair-intellectImagination-high--conscientiousness-high`)

#### ひと息つきたい (`pause`)

- 候補: スイートオレンジ｜やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- ★ 共有代表: マジョラム｜温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 共有カード: マジョラム｜温かく穏やかなハーブの香調

#### 気持ちを切り替えたい (`reset`)

- 候補: レモングラス｜レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- ★ 共有代表: ライム｜軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 共有カード: ライム｜軽快で透明な柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ベチバー｜根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 候補: ヒノキ｜端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 共有カード: ベチバー｜根と土を思わせる重厚な香調

### 13. 風まかせの空想者 (`title-pair-intellectImagination-high--conscientiousness-low`)

#### ひと息つきたい (`pause`)

- 候補: ヒノキ｜静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- ★ 共有代表: ネロリ｜透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 共有カード: ネロリ｜透明感のある花と柑橘の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: プチグレン｜青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 候補: ローズマリー｜風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 共有カード: プチグレン｜青い葉と柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: ベルガモット｜ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- ★ 共有代表: サイプレス｜端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 共有カード: サイプレス｜端正で清涼な木質の香調

### 14. 素朴な継続者 (`title-pair-intellectImagination-low--conscientiousness-high`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: スイートオレンジ｜やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 候補: ホーウッド｜やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 共有カード: スイートオレンジ｜やわらかな甘みの柑橘の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: レモン｜鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 候補: ペパーミント｜鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 共有カード: レモン｜鮮やかで明るい柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ローズマリー｜青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 候補: ベルガモット｜ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 共有カード: ローズマリー｜青く端正なハーブの香調

### 15. 気ままな遊歩者 (`title-pair-intellectImagination-low--conscientiousness-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: サンダルウッド｜温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 候補: 真正ラベンダー｜静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 共有カード: サンダルウッド｜温かく穏やかな木質の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ライム｜軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 候補: ジンジャー｜すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 共有カード: ライム｜軽快で透明な柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ジュニパーベリー｜澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 候補: ローズマリー｜青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 共有カード: ジュニパーベリー｜澄んだ針葉樹と青い実の香調

### 16. 新風を運ぶ伝達者 (`title-pair-intellectImagination-high--extraversion-high`)

#### ひと息つきたい (`pause`)

- 候補: マジョラム｜温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- ★ 共有代表: ローマンカモミール｜まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 共有カード: ローマンカモミール｜まろやかな甘みの草花の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ローズマリー｜風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- ★ 共有代表: マンダリン｜丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 共有カード: マンダリン｜丸みのあるやさしい切替の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: パチュリ｜湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- ★ 共有代表: シダーウッド｜乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 共有カード: シダーウッド｜乾いた深みのある木質の香調

### 17. 静寂に星座盤を見つめる探索者 (`title-pair-intellectImagination-high--extraversion-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ヒノキ｜静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 候補: ネロリ｜透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 共有カード: ヒノキ｜静かな森を思わせる木質の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ベルガモット｜明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 候補: レモングラス｜レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 共有カード: ベルガモット｜明るく軽快な柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ベチバー｜根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 候補: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 共有カード: ベチバー｜根と土を思わせる重厚な香調

### 18. にぎわいの談話者 (`title-pair-intellectImagination-low--extraversion-high`)

#### ひと息つきたい (`pause`)

- 候補: ホーウッド｜やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- ★ 共有代表: フランキンセンス｜やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 共有カード: フランキンセンス｜やわらかな樹脂と木質の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ペパーミント｜鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 候補: グレープフルーツ｜ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 共有カード: ペパーミント｜鋭く澄んだ清涼の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ヒノキ｜端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 候補: ローズマリー｜青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 共有カード: ヒノキ｜端正で澄んだ木質の香調

### 19. 窓辺の逗留者 (`title-pair-intellectImagination-low--extraversion-low`)

#### ひと息つきたい (`pause`)

- 候補: ヒノキ｜静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- ★ 共有代表: マジョラム｜温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 共有カード: マジョラム｜温かく穏やかなハーブの香調

#### 気持ちを切り替えたい (`reset`)

- 候補: マンダリン｜丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- ★ 共有代表: ジンジャー｜すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 共有カード: ジンジャー｜すっきりした辛みを含む香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 候補: サイプレス｜端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 共有カード: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調

### 20. 寄り添う共鳴者 (`title-pair-intellectImagination-high--agreeableness-high`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ネロリ｜透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 候補: スイートオレンジ｜やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 共有カード: ネロリ｜透明感のある花と柑橘の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ユーカリ・ラディアータ｜透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 候補: グレープフルーツ｜ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 共有カード: ユーカリ・ラディアータ｜透明感のある葉の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: ジュニパーベリー｜澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- ★ 共有代表: ベルガモット｜ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 共有カード: ベルガモット｜ほろ苦く端正な柑橘の香調

### 21. 独歩の開拓者 (`title-pair-intellectImagination-high--agreeableness-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: 真正ラベンダー｜静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 候補: サンダルウッド｜温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 共有カード: 真正ラベンダー｜静かな甘みを含む花の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ユーカリ・ラディアータ｜透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 候補: プチグレン｜青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 共有カード: ユーカリ・ラディアータ｜透明感のある葉の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: パチュリ｜湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- ★ 共有代表: サイプレス｜端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 共有カード: サイプレス｜端正で清涼な木質の香調

### 22. 分かち合う同席者 (`title-pair-intellectImagination-low--agreeableness-high`)

#### ひと息つきたい (`pause`)

- 候補: ホーウッド｜やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- ★ 共有代表: ローマンカモミール｜まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 共有カード: ローマンカモミール｜まろやかな甘みの草花の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: レモングラス｜レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 候補: レモン｜鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 共有カード: レモングラス｜レモンを思わせる青い草の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: シダーウッド｜乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- ★ 共有代表: ベチバー｜根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 共有カード: ベチバー｜根と土を思わせる重厚な香調

### 23. 標を示す表明者 (`title-pair-intellectImagination-low--agreeableness-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ホーウッド｜やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 候補: フランキンセンス｜やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 共有カード: ホーウッド｜やわらかな花を含む木質の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ローズマリー｜風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 候補: ライム｜軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 共有カード: ローズマリー｜風を受ける青い葉のハーブの香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: ベチバー｜根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- ★ 共有代表: ヒノキ｜端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 共有カード: ヒノキ｜端正で澄んだ木質の香調

### 24. 凪空を仰ぐ観望者 (`title-pair-intellectImagination-high--emotionalStability-high`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: フランキンセンス｜やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 候補: マジョラム｜温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 共有カード: フランキンセンス｜やわらかな樹脂と木質の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ベルガモット｜明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 候補: ペパーミント｜鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 共有カード: ベルガモット｜明るく軽快な柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ヒノキ｜端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 候補: ジュニパーベリー｜澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 共有カード: ヒノキ｜端正で澄んだ木質の香調

### 25. 鈴音に振り向く探訪者 (`title-pair-intellectImagination-high--emotionalStability-low`)

#### ひと息つきたい (`pause`)

- 候補: ローマンカモミール｜まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- ★ 共有代表: サンダルウッド｜温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 共有カード: サンダルウッド｜温かく穏やかな木質の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: プチグレン｜青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 候補: ジンジャー｜すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 共有カード: プチグレン｜青い葉と柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 候補: ベルガモット｜ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 共有カード: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調

### 26. 日だまりの静観者 (`title-pair-intellectImagination-low--emotionalStability-high`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: スイートオレンジ｜やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 候補: ヒノキ｜静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 共有カード: スイートオレンジ｜やわらかな甘みの柑橘の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: レモン｜鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 候補: ユーカリ・ラディアータ｜透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 共有カード: レモン｜鮮やかで明るい柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: ローズマリー｜青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- ★ 共有代表: パチュリ｜湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 共有カード: パチュリ｜湿り気を含む土と葉の香調

### 27. 雨音に振り向く歩行者 (`title-pair-intellectImagination-low--emotionalStability-low`)

#### ひと息つきたい (`pause`)

- 候補: サンダルウッド｜温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- ★ 共有代表: 真正ラベンダー｜静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 共有カード: 真正ラベンダー｜静かな甘みを含む花の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ローズマリー｜風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- ★ 共有代表: マンダリン｜丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 共有カード: マンダリン｜丸みのあるやさしい切替の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: パチュリ｜湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 候補: サイプレス｜端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 共有カード: パチュリ｜湿り気を含む土と葉の香調

### 28. 刻限に集う交流者 (`title-pair-conscientiousness-high--extraversion-high`)

#### ひと息つきたい (`pause`)

- 候補: スイートオレンジ｜やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- ★ 共有代表: ネロリ｜透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 共有カード: ネロリ｜透明感のある花と柑橘の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ベルガモット｜明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- ★ 共有代表: レモングラス｜レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 共有カード: レモングラス｜レモンを思わせる青い草の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: シダーウッド｜乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 候補: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 共有カード: シダーウッド｜乾いた深みのある木質の香調

### 29. 灯下の記録者 (`title-pair-conscientiousness-high--extraversion-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: マジョラム｜温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 候補: ローマンカモミール｜まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 共有カード: マジョラム｜温かく穏やかなハーブの香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ペパーミント｜鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 候補: ライム｜軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 共有カード: ペパーミント｜鋭く澄んだ清涼の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: ベチバー｜根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- ★ 共有代表: ローズマリー｜青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 共有カード: ローズマリー｜青く端正なハーブの香調

### 30. 道草の合流者 (`title-pair-conscientiousness-low--extraversion-high`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ヒノキ｜静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 候補: ネロリ｜透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 共有カード: ヒノキ｜静かな森を思わせる木質の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ジンジャー｜すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- ★ 共有代表: グレープフルーツ｜ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 共有カード: グレープフルーツ｜ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: ベルガモット｜ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- ★ 共有代表: ジュニパーベリー｜澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 共有カード: ジュニパーベリー｜澄んだ針葉樹と青い実の香調

### 31. 余白を楽しむ散策者 (`title-pair-conscientiousness-low--extraversion-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: 真正ラベンダー｜静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 候補: ホーウッド｜やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 共有カード: 真正ラベンダー｜静かな甘みを含む花の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ジンジャー｜すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- ★ 共有代表: プチグレン｜青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 共有カード: プチグレン｜青い葉と柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- ★ 共有代表: サイプレス｜端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 共有カード: サイプレス｜端正で清涼な木質の香調

### 32. 輪を整える準備者 (`title-pair-conscientiousness-high--agreeableness-high`)

#### ひと息つきたい (`pause`)

- 候補: ネロリ｜透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- ★ 共有代表: フランキンセンス｜やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 共有カード: フランキンセンス｜やわらかな樹脂と木質の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ユーカリ・ラディアータ｜透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- ★ 共有代表: グレープフルーツ｜ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 共有カード: グレープフルーツ｜ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: ローズマリー｜青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- ★ 共有代表: シダーウッド｜乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 共有カード: シダーウッド｜乾いた深みのある木質の香調

### 33. 線を引く整頓者 (`title-pair-conscientiousness-high--agreeableness-low`)

#### ひと息つきたい (`pause`)

- 候補: 真正ラベンダー｜静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- ★ 共有代表: サンダルウッド｜温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 共有カード: サンダルウッド｜温かく穏やかな木質の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: レモングラス｜レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 候補: レモン｜鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 共有カード: レモングラス｜レモンを思わせる青い草の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: パチュリ｜湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 候補: ヒノキ｜端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 共有カード: パチュリ｜湿り気を含む土と葉の香調

### 34. 寄り道をともにする同行者 (`title-pair-conscientiousness-low--agreeableness-high`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ホーウッド｜やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 候補: ローマンカモミール｜まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 共有カード: ホーウッド｜やわらかな花を含む木質の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ローズマリー｜風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 候補: ライム｜軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 共有カード: ローズマリー｜風を受ける青い葉のハーブの香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: サイプレス｜端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- ★ 共有代表: ベチバー｜根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 共有カード: ベチバー｜根と土を思わせる重厚な香調

### 35. 自由な独行者 (`title-pair-conscientiousness-low--agreeableness-low`)

#### ひと息つきたい (`pause`)

- 候補: フランキンセンス｜やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- ★ 共有代表: スイートオレンジ｜やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 共有カード: スイートオレンジ｜やわらかな甘みの柑橘の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ベルガモット｜明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- ★ 共有代表: ペパーミント｜鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 共有カード: ペパーミント｜鋭く澄んだ清涼の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ヒノキ｜端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 候補: ジュニパーベリー｜澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 共有カード: ヒノキ｜端正で澄んだ木質の香調

### 36. 凪の計画者 (`title-pair-conscientiousness-high--emotionalStability-high`)

#### ひと息つきたい (`pause`)

- 候補: マジョラム｜温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- ★ 共有代表: ヒノキ｜静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 共有カード: ヒノキ｜静かな森を思わせる木質の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ローズマリー｜風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- ★ 共有代表: マンダリン｜丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 共有カード: マンダリン｜丸みのあるやさしい切替の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ベルガモット｜ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 候補: シダーウッド｜乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 共有カード: ベルガモット｜ほろ苦く端正な柑橘の香調

### 37. 揺れ灯の整頓者 (`title-pair-conscientiousness-high--emotionalStability-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ローマンカモミール｜まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 候補: サンダルウッド｜温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 共有カード: ローマンカモミール｜まろやかな甘みの草花の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ライム｜軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 候補: レモングラス｜レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 共有カード: ライム｜軽快で透明な柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 候補: サイプレス｜端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 共有カード: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調

### 38. 流れをゆく漂泊者 (`title-pair-conscientiousness-low--emotionalStability-high`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: スイートオレンジ｜やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 候補: マジョラム｜温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 共有カード: スイートオレンジ｜やわらかな甘みの柑橘の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ベルガモット｜明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 候補: ペパーミント｜鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 共有カード: ベルガモット｜明るく軽快な柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ローズマリー｜青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 候補: ヒノキ｜端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 共有カード: ローズマリー｜青く端正なハーブの香調

### 39. 揺れ影の遊歩者 (`title-pair-conscientiousness-low--emotionalStability-low`)

#### ひと息つきたい (`pause`)

- 候補: ヒノキ｜静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- ★ 共有代表: ネロリ｜透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 共有カード: ネロリ｜透明感のある花と柑橘の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: マンダリン｜丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- ★ 共有代表: ジンジャー｜すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 共有カード: ジンジャー｜すっきりした辛みを含む香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: パチュリ｜湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- ★ 共有代表: ジュニパーベリー｜澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 共有カード: ジュニパーベリー｜澄んだ針葉樹と青い実の香調

### 40. 輪舞へ踏み出す共演者 (`title-pair-extraversion-high--agreeableness-high`)

#### ひと息つきたい (`pause`)

- 候補: 真正ラベンダー｜静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- ★ 共有代表: ホーウッド｜やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 共有カード: ホーウッド｜やわらかな花を含む木質の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ユーカリ・ラディアータ｜透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- ★ 共有代表: グレープフルーツ｜ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- 共有カード: グレープフルーツ｜ほろ苦く明るい柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: シダーウッド｜乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- ★ 共有代表: ベルガモット｜ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 共有カード: ベルガモット｜ほろ苦く端正な柑橘の香調

### 41. 自分の色を掲げる表明者 (`title-pair-extraversion-high--agreeableness-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: マジョラム｜温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 候補: フランキンセンス｜やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 共有カード: マジョラム｜温かく穏やかなハーブの香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ジンジャー｜すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 候補: プチグレン｜青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- 共有カード: ジンジャー｜すっきりした辛みを含む香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ベチバー｜根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 候補: シダーウッド｜乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 共有カード: ベチバー｜根と土を思わせる重厚な香調

### 42. 寄り添う静観者 (`title-pair-extraversion-low--agreeableness-high`)

#### ひと息つきたい (`pause`)

- 候補: ヒノキ｜静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- ★ 共有代表: ローマンカモミール｜まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 共有カード: ローマンカモミール｜まろやかな甘みの草花の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ユーカリ・ラディアータ｜透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 候補: レモン｜鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 共有カード: ユーカリ・ラディアータ｜透明感のある葉の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ベルガモット｜ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 候補: パチュリ｜湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 共有カード: ベルガモット｜ほろ苦く端正な柑橘の香調

### 43. 一席を選ぶ滞在者 (`title-pair-extraversion-low--agreeableness-low`)

#### ひと息つきたい (`pause`)

- 候補: ネロリ｜透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- ★ 共有代表: サンダルウッド｜温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 共有カード: サンダルウッド｜温かく穏やかな木質の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: グレープフルーツ｜ほろ苦く明るい柑橘の香調 (`fragrance-reset-grapefruit`)
- ★ 共有代表: レモングラス｜レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- 共有カード: レモングラス｜レモンを思わせる青い草の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- 候補: ベチバー｜根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 共有カード: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調

### 44. 寛ぐ交遊者 (`title-pair-extraversion-high--emotionalStability-high`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: 真正ラベンダー｜静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 候補: スイートオレンジ｜やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 共有カード: 真正ラベンダー｜静かな甘みを含む花の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: プチグレン｜青い葉と柑橘の香調 (`fragrance-reset-petitgrain`)
- ★ 共有代表: ローズマリー｜風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- 共有カード: ローズマリー｜風を受ける青い葉のハーブの香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: ジュニパーベリー｜澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- ★ 共有代表: サイプレス｜端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 共有カード: サイプレス｜端正で清涼な木質の香調

### 45. ざわめきへ振り向く参加者 (`title-pair-extraversion-high--emotionalStability-low`)

#### ひと息つきたい (`pause`)

- 候補: ホーウッド｜やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- ★ 共有代表: フランキンセンス｜やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 共有カード: フランキンセンス｜やわらかな樹脂と木質の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: レモン｜鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 候補: ペパーミント｜鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 共有カード: レモン｜鮮やかで明るい柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: ヒノキ｜端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- ★ 共有代表: ローズマリー｜青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 共有カード: ローズマリー｜青く端正なハーブの香調

### 46. 芽吹きを待つ滞在者 (`title-pair-extraversion-low--emotionalStability-high`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: 真正ラベンダー｜静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 候補: フランキンセンス｜やわらかな樹脂と木質の香調 (`fragrance-pause-frankincense`)
- 共有カード: 真正ラベンダー｜静かな甘みを含む花の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: レモングラス｜レモンを思わせる青い草の香調 (`fragrance-reset-lemongrass`)
- ★ 共有代表: マンダリン｜丸みのあるやさしい切替の香調 (`fragrance-reset-mandarin`)
- 共有カード: マンダリン｜丸みのあるやさしい切替の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: シダーウッド｜乾いた深みのある木質の香調 (`fragrance-quiet-focus-cedarwood`)
- 候補: ローズマリー｜青く端正なハーブの香調 (`fragrance-quiet-focus-rosemary`)
- 共有カード: シダーウッド｜乾いた深みのある木質の香調

### 47. 薄明に耳を向ける逗留者 (`title-pair-extraversion-low--emotionalStability-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ローマンカモミール｜まろやかな甘みの草花の香調 (`fragrance-pause-roman-chamomile`)
- 候補: サンダルウッド｜温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 共有カード: ローマンカモミール｜まろやかな甘みの草花の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ローズマリー｜風を受ける青い葉のハーブの香調 (`fragrance-reset-rosemary`)
- ★ 共有代表: ライム｜軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 共有カード: ライム｜軽快で透明な柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: ヒノキ｜端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 候補: ベルガモット｜ほろ苦く端正な柑橘の香調 (`fragrance-quiet-focus-bergamot`)
- 共有カード: ヒノキ｜端正で澄んだ木質の香調

### 48. ふたつの杯の相席者 (`title-pair-agreeableness-high--emotionalStability-high`)

#### ひと息つきたい (`pause`)

- 候補: スイートオレンジ｜やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- ★ 共有代表: マジョラム｜温かく穏やかなハーブの香調 (`fragrance-pause-marjoram`)
- 共有カード: マジョラム｜温かく穏やかなハーブの香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ベルガモット｜明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- ★ 共有代表: ペパーミント｜鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- 共有カード: ペパーミント｜鋭く澄んだ清涼の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: フランキンセンス｜静かな樹脂の輪郭を含む木質の香調 (`fragrance-quiet-focus-frankincense`)
- ★ 共有代表: ジュニパーベリー｜澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- 共有カード: ジュニパーベリー｜澄んだ針葉樹と青い実の香調

### 49. 揺れ布に並ぶ同伴者 (`title-pair-agreeableness-high--emotionalStability-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: ヒノキ｜静かな森を思わせる木質の香調 (`fragrance-pause-hinoki`)
- 候補: ネロリ｜透明感のある花と柑橘の香調 (`fragrance-pause-neroli`)
- 共有カード: ヒノキ｜静かな森を思わせる木質の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ライム｜軽快で透明な柑橘の香調 (`fragrance-reset-lime`)
- 候補: ジンジャー｜すっきりした辛みを含む香調 (`fragrance-reset-ginger`)
- 共有カード: ライム｜軽快で透明な柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: パチュリ｜湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 候補: サイプレス｜端正で清涼な木質の香調 (`fragrance-quiet-focus-cypress`)
- 共有カード: パチュリ｜湿り気を含む土と葉の香調

### 50. 淡々たる表明者 (`title-pair-agreeableness-low--emotionalStability-high`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: スイートオレンジ｜やわらかな甘みの柑橘の香調 (`fragrance-pause-sweet-orange`)
- 候補: ホーウッド｜やわらかな花を含む木質の香調 (`fragrance-pause-ho-wood`)
- 共有カード: スイートオレンジ｜やわらかな甘みの柑橘の香調

#### 気持ちを切り替えたい (`reset`)

- ★ 共有代表: ベルガモット｜明るく軽快な柑橘の香調 (`fragrance-reset-bergamot`)
- 候補: ユーカリ・ラディアータ｜透明感のある葉の香調 (`fragrance-reset-eucalyptus-radiata`)
- 共有カード: ベルガモット｜明るく軽快な柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- 候補: ジュニパーベリー｜澄んだ針葉樹と青い実の香調 (`fragrance-quiet-focus-juniper-berry`)
- ★ 共有代表: ベチバー｜根と土を思わせる重厚な香調 (`fragrance-quiet-focus-vetiver`)
- 共有カード: ベチバー｜根と土を思わせる重厚な香調

### 51. 風鳴る戸口の掲示者 (`title-pair-agreeableness-low--emotionalStability-low`)

#### ひと息つきたい (`pause`)

- ★ 共有代表: サンダルウッド｜温かく穏やかな木質の香調 (`fragrance-pause-sandalwood`)
- 候補: 真正ラベンダー｜静かな甘みを含む花の香調 (`fragrance-pause-true-lavender`)
- 共有カード: サンダルウッド｜温かく穏やかな木質の香調

#### 気持ちを切り替えたい (`reset`)

- 候補: ペパーミント｜鋭く澄んだ清涼の香調 (`fragrance-reset-peppermint`)
- ★ 共有代表: レモン｜鮮やかで明るい柑橘の香調 (`fragrance-reset-lemon`)
- 共有カード: レモン｜鮮やかで明るい柑橘の香調

#### 静かに取り組みたい (`quiet-focus`)

- ★ 共有代表: パチュリ｜湿り気を含む土と葉の香調 (`fragrance-quiet-focus-patchouli`)
- 候補: ヒノキ｜端正で澄んだ木質の香調 (`fragrance-quiet-focus-hinoki`)
- 共有カード: パチュリ｜湿り気を含む土と葉の香調

## 使用回数

### 香調

| 香調ID | 候補採用称号数 | 共有代表称号数 |
| --- | --- | --- |
| `fragrance-pause-roman-chamomile` | 11 | 6 |
| `fragrance-pause-sandalwood` | 12 | 6 |
| `fragrance-reset-grapefruit` | 8 | 4 |
| `fragrance-reset-lemongrass` | 10 | 5 |
| `fragrance-quiet-focus-bergamot` | 11 | 6 |
| `fragrance-quiet-focus-frankincense` | 11 | 5 |
| `fragrance-pause-sweet-orange` | 12 | 6 |
| `fragrance-pause-marjoram` | 11 | 6 |
| `fragrance-reset-petitgrain` | 8 | 4 |
| `fragrance-reset-lemon` | 9 | 5 |
| `fragrance-quiet-focus-rosemary` | 11 | 5 |
| `fragrance-quiet-focus-juniper-berry` | 12 | 6 |
| `fragrance-pause-hinoki` | 11 | 6 |
| `fragrance-pause-neroli` | 11 | 5 |
| `fragrance-reset-rosemary` | 10 | 4 |
| `fragrance-reset-lime` | 9 | 5 |
| `fragrance-quiet-focus-patchouli` | 12 | 7 |
| `fragrance-quiet-focus-cypress` | 11 | 5 |
| `fragrance-pause-true-lavender` | 12 | 6 |
| `fragrance-pause-ho-wood` | 11 | 5 |
| `fragrance-reset-bergamot` | 9 | 5 |
| `fragrance-reset-peppermint` | 11 | 5 |
| `fragrance-quiet-focus-cedarwood` | 11 | 5 |
| `fragrance-quiet-focus-vetiver` | 11 | 6 |
| `fragrance-reset-mandarin` | 8 | 5 |
| `fragrance-quiet-focus-hinoki` | 12 | 6 |
| `fragrance-pause-frankincense` | 11 | 5 |
| `fragrance-reset-ginger` | 10 | 5 |
| `fragrance-reset-eucalyptus-radiata` | 10 | 4 |

### 素材

| 素材ID | 採用称号数 | 使用場面 |
| --- | --- | --- |
| `material-roman-chamomile` | 11 | pause |
| `material-sandalwood` | 12 | pause |
| `material-grapefruit` | 8 | reset |
| `material-lemongrass` | 10 | reset |
| `material-bergamot` | 20 | reset・quiet-focus |
| `material-frankincense` | 22 | pause・quiet-focus |
| `material-sweet-orange` | 12 | pause |
| `material-marjoram` | 11 | pause |
| `material-petitgrain` | 8 | reset |
| `material-lemon` | 9 | reset |
| `material-rosemary` | 21 | reset・quiet-focus |
| `material-juniper-berry` | 12 | quiet-focus |
| `material-hinoki` | 23 | pause・quiet-focus |
| `material-neroli` | 11 | pause |
| `material-lime` | 9 | reset |
| `material-patchouli` | 12 | quiet-focus |
| `material-cypress` | 11 | quiet-focus |
| `material-true-lavender` | 12 | pause |
| `material-ho-wood` | 11 | pause |
| `material-peppermint` | 11 | reset |
| `material-cedarwood` | 11 | quiet-focus |
| `material-vetiver` | 11 | quiet-focus |
| `material-mandarin` | 8 | reset |
| `material-ginger` | 10 | reset |
| `material-eucalyptus-radiata` | 10 | reset |

### family

| family | 候補採用称号数 |
| --- | --- |
| `floral` | 34 |
| `woody` | 46 |
| `citrus` | 51 |
| `herbal` | 34 |
| `resinous` | 22 |
| `fresh` | 28 |
| `earthy` | 23 |
| `spicy` | 10 |

### 共有代表3件の組み合わせ

| 代表3件 | 称号数 |
| --- | --- |
| まろやかな甘みの草花の香調 / ほろ苦く明るい柑橘の香調 / ほろ苦く端正な柑橘の香調 | 1 |
| 温かく穏やかなハーブの香調 / 青い葉と柑橘の香調 / 澄んだ針葉樹と青い実の香調 | 1 |
| 静かな森を思わせる木質の香調 / 鋭く澄んだ清涼の香調 / 青く端正なハーブの香調 | 1 |
| やわらかな花を含む木質の香調 / すっきりした辛みを含む香調 / 湿り気を含む土と葉の香調 | 1 |
| やわらかな樹脂と木質の香調 / 明るく軽快な柑橘の香調 / 乾いた深みのある木質の香調 | 1 |
| 静かな森を思わせる木質の香調 / 丸みのあるやさしい切替の香調 / 端正で清涼な木質の香調 | 1 |
| 透明感のある花と柑橘の香調 / 透明感のある葉の香調 / 端正で澄んだ木質の香調 | 1 |
| やわらかな甘みの柑橘の香調 / レモンを思わせる青い草の香調 / ほろ苦く端正な柑橘の香調 | 1 |
| やわらかな花を含む木質の香調 / すっきりした辛みを含む香調 / 澄んだ針葉樹と青い実の香調 | 1 |
| 静かな甘みを含む花の香調 / 風を受ける青い葉のハーブの香調 / 湿り気を含む土と葉の香調 | 1 |
| 温かく穏やかな木質の香調 / 鮮やかで明るい柑橘の香調 / 静かな樹脂の輪郭を含む木質の香調 | 1 |
| 温かく穏やかなハーブの香調 / 軽快で透明な柑橘の香調 / 根と土を思わせる重厚な香調 | 1 |
| 透明感のある花と柑橘の香調 / 青い葉と柑橘の香調 / 端正で清涼な木質の香調 | 1 |
| やわらかな甘みの柑橘の香調 / 鮮やかで明るい柑橘の香調 / 青く端正なハーブの香調 | 1 |
| 温かく穏やかな木質の香調 / 軽快で透明な柑橘の香調 / 澄んだ針葉樹と青い実の香調 | 1 |
| まろやかな甘みの草花の香調 / 丸みのあるやさしい切替の香調 / 乾いた深みのある木質の香調 | 1 |
| 静かな森を思わせる木質の香調 / 明るく軽快な柑橘の香調 / 根と土を思わせる重厚な香調 | 1 |
| やわらかな樹脂と木質の香調 / 鋭く澄んだ清涼の香調 / 端正で澄んだ木質の香調 | 1 |
| 温かく穏やかなハーブの香調 / すっきりした辛みを含む香調 / 静かな樹脂の輪郭を含む木質の香調 | 1 |
| 透明感のある花と柑橘の香調 / 透明感のある葉の香調 / ほろ苦く端正な柑橘の香調 | 1 |
| 静かな甘みを含む花の香調 / 透明感のある葉の香調 / 端正で清涼な木質の香調 | 1 |
| まろやかな甘みの草花の香調 / レモンを思わせる青い草の香調 / 根と土を思わせる重厚な香調 | 1 |
| やわらかな花を含む木質の香調 / 風を受ける青い葉のハーブの香調 / 端正で澄んだ木質の香調 | 1 |
| やわらかな樹脂と木質の香調 / 明るく軽快な柑橘の香調 / 端正で澄んだ木質の香調 | 1 |
| 温かく穏やかな木質の香調 / 青い葉と柑橘の香調 / 静かな樹脂の輪郭を含む木質の香調 | 1 |
| やわらかな甘みの柑橘の香調 / 鮮やかで明るい柑橘の香調 / 湿り気を含む土と葉の香調 | 1 |
| 静かな甘みを含む花の香調 / 丸みのあるやさしい切替の香調 / 湿り気を含む土と葉の香調 | 1 |
| 透明感のある花と柑橘の香調 / レモンを思わせる青い草の香調 / 乾いた深みのある木質の香調 | 1 |
| 温かく穏やかなハーブの香調 / 鋭く澄んだ清涼の香調 / 青く端正なハーブの香調 | 1 |
| 静かな森を思わせる木質の香調 / ほろ苦く明るい柑橘の香調 / 澄んだ針葉樹と青い実の香調 | 1 |
| 静かな甘みを含む花の香調 / 青い葉と柑橘の香調 / 端正で清涼な木質の香調 | 1 |
| やわらかな樹脂と木質の香調 / ほろ苦く明るい柑橘の香調 / 乾いた深みのある木質の香調 | 1 |
| 温かく穏やかな木質の香調 / レモンを思わせる青い草の香調 / 湿り気を含む土と葉の香調 | 1 |
| やわらかな花を含む木質の香調 / 風を受ける青い葉のハーブの香調 / 根と土を思わせる重厚な香調 | 1 |
| やわらかな甘みの柑橘の香調 / 鋭く澄んだ清涼の香調 / 端正で澄んだ木質の香調 | 1 |
| 静かな森を思わせる木質の香調 / 丸みのあるやさしい切替の香調 / ほろ苦く端正な柑橘の香調 | 1 |
| まろやかな甘みの草花の香調 / 軽快で透明な柑橘の香調 / 静かな樹脂の輪郭を含む木質の香調 | 1 |
| やわらかな甘みの柑橘の香調 / 明るく軽快な柑橘の香調 / 青く端正なハーブの香調 | 1 |
| 透明感のある花と柑橘の香調 / すっきりした辛みを含む香調 / 澄んだ針葉樹と青い実の香調 | 1 |
| やわらかな花を含む木質の香調 / ほろ苦く明るい柑橘の香調 / ほろ苦く端正な柑橘の香調 | 1 |
| 温かく穏やかなハーブの香調 / すっきりした辛みを含む香調 / 根と土を思わせる重厚な香調 | 1 |
| まろやかな甘みの草花の香調 / 透明感のある葉の香調 / ほろ苦く端正な柑橘の香調 | 1 |
| 温かく穏やかな木質の香調 / レモンを思わせる青い草の香調 / 静かな樹脂の輪郭を含む木質の香調 | 1 |
| 静かな甘みを含む花の香調 / 風を受ける青い葉のハーブの香調 / 端正で清涼な木質の香調 | 1 |
| やわらかな樹脂と木質の香調 / 鮮やかで明るい柑橘の香調 / 青く端正なハーブの香調 | 1 |
| 静かな甘みを含む花の香調 / 丸みのあるやさしい切替の香調 / 乾いた深みのある木質の香調 | 1 |
| まろやかな甘みの草花の香調 / 軽快で透明な柑橘の香調 / 端正で澄んだ木質の香調 | 1 |
| 温かく穏やかなハーブの香調 / 鋭く澄んだ清涼の香調 / 澄んだ針葉樹と青い実の香調 | 1 |
| 静かな森を思わせる木質の香調 / 軽快で透明な柑橘の香調 / 湿り気を含む土と葉の香調 | 1 |
| やわらかな甘みの柑橘の香調 / 明るく軽快な柑橘の香調 / 根と土を思わせる重厚な香調 | 1 |
| 温かく穏やかな木質の香調 / 鮮やかで明るい柑橘の香調 / 湿り気を含む土と葉の香調 | 1 |

## 機械監査

- 判定: 適合
- 違反: 0件
- 香調: 29件
- 素材: 25件
- 称号: 51件
- 関連行: 306件

## 承認gateの現在値

| gate | scope | status |
| --- | --- | --- |
| P-1 | fragrance-vocabulary-materials | approved |
| P-2 | titles-balanced-and-single-01-11 | approved |
| P-3 | titles-pair-01-10 | approved |
| P-4 | titles-pair-11-20 | approved |
| P-5 | titles-pair-21-30 | approved |
| P-6 | titles-pair-31-40 | approved |
