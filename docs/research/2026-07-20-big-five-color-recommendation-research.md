# Big Five結果からの色提案に関する心理学的妥当性調査

- 調査日: 2026-07-20
- 対象: Big Five自己理解支援ツール
- 目的: 診断結果から「性格傾向を象徴する色」または「現在の心理状態を支える色」を提示できるかを検討する

## 1. 結論

色提案機能は採用できる。ただし、科学的な位置づけを二つに分ける必要がある。

1. **性格傾向を象徴する色**
   - Big Fiveの結果を視覚的な比喩へ変換するエンタメ表現として採用可能。
   - 「この性格だからこの色を好む」「この色が本質を示す」という心理学的判定にはしない。
   - 現時点の研究では、Big Fiveから特定の色相を一意に決めるほど強く一般化可能な根拠はない。

2. **現在の心理状態に対して良い方向に働く色**
   - Big Fiveは比較的持続的な性格傾向を測るものであり、回答時点の気分・疲労・ストレスを測る尺度ではない。Big Fiveの結果だけから現在の状態や必要な色を推定してはならない。
   - 任意の状態質問を追加しても、画面上の色が気分を改善・治療すると断定できる根拠は不足している。
   - 「今の自分に合わせて選ぶサポートカラー」「気分づくりのヒント」として、複数候補から本人に選んでもらう仕様が妥当。

したがって、推奨する製品上の位置づけは次の通り。

> Big Fiveの傾向をもとに作った「象徴カラーパレット」と、本人が今の目的や好みに合わせて選ぶ「サポートカラー」を提供する。診断色・治療色とは呼ばない。

## 2. Big Five特性と色嗜好・色連想

### 2.1 色相を固定対応させる根拠は弱い

韓国成人854名を対象にTIPIと10色の選好・性格語との連想を調べた横断研究では、次の傾向が報告された。

- 外向的・熱意があるという語は赤、黄、橙と連想された。
- 協調性の肯定語は黄、誠実性と情緒安定性の肯定語は緑と連想された。
- 開放性の肯定語は緑、黄、水色、複雑さは紫と連想された。
- 色の**選好**との相関は小さく、外向性には有意な相関がなかった。
- 最大級の相関でもおおむね `|r| = .16` 程度、回帰モデルの説明率も `R² = .02–.05` だった。
- 著者自身が、相関はかなり小さいこと、短いTIPIを用いたこと、韓国標本に限られ一般化が限定的であることを限界としている。

これは「性格語を色で表現する」参考にはなるが、個人の好きな色を予測したり、色を心理学的な診断結果として確定したりする根拠にはならない。

出典: Jue & Ha (2022), *Exploring the relationships between personality and color preferences*, Frontiers in Psychology.
https://doi.org/10.3389/fpsyg.2022.1065372

### 2.2 「好きな色から性格が分かる」という一般的主張は支持されない

323名のフランス語話者を対象に、人気サイトから抽出した11個の「好きな色―性格」予測をBig Six/HEXACO尺度で検証した研究では、11予測はいずれも確認されず、探索的分析でも色の選好と性格特性の信頼できる関連は見つからなかった。

よって、本アプリは「あなたの性格なら青が好きなはず」「好きな色は性格を表す」と表示してはならない。

出典: Jonauskaite et al. (2021), *What Does Your Favourite Colour Say About Your Personality? Not Much*, Personality Science.
https://doi.org/10.5964/ps.6297

### 2.3 色相より彩度に限定した関連は利用余地がある

色相と明度を一定にして彩度を操作した2研究では、外向性が高い人ほど高彩度色を好む関連が報告された。他のBig Five特性には同じ交互作用は見られなかった。

これは外向性を「特定の色相」ではなく「鮮やかさの程度」に反映する参考になる。ただし単一研究群による選好の関連であり、因果効果や全ユーザーへの適合を示すものではない。

出典: Pazda & Thorstenson (2018), *Extraversion predicts a preference for high-chroma colors*, Personality and Individual Differences.
https://doi.org/10.1016/j.paid.2018.01.028

### 2.4 実装上の解釈

- 研究から比較的安全に借りられるのは、色相の固定診断よりも、**彩度、明度、配色の複雑さ、コントラスト**を性格の視覚的比喩として使う考え方である。
- 個別の色相対応は、研究を参考にした「デザイン規則」と明記し、心理尺度の採点ロジックから分離する。
- 神経症傾向の高さに暗色や「不安の色」を直結させると、結果を否定的に見せ、色に優劣を生むため避ける。

## 3. 色と心理状態への効果

### 3.1 色と感情の「連想」はある

132論文、42,266名、64か国を含む128年分の研究の系統的レビューでは、基本色と感情の間に体系的な連想が確認された。代表例は次の通り。

- 明るい色は肯定的感情、暗い色は否定的感情
- 赤は肯定・否定の両方を含む高覚醒感情
- 黄・橙は肯定的で高覚醒の感情
- 青・緑・青緑・白は肯定的で低覚醒の感情
- 灰は否定的で低覚醒、黒は否定的で高覚醒の感情

ただし、対応は一対一ではなく多対多である。レビューが主に整理したのは「色がどの感情を伝えるか・連想させるか」であり、色を見ることで実際の感情状態が改善することではない。著者らの結論は「色が感情を伝えることは分かるが、色を感じることで感情が変わるかはまだ分からない」という範囲である。

出典: Jonauskaite & Mohr (2025), *Do we feel colours? A systematic review of 128 years of psychological research linking colours and emotions*, Psychonomic Bulletin & Review.
https://doi.org/10.3758/s13423-024-02615-z

### 3.2 応用効果は文脈依存で、強い推奨には早い

色は感情・認知・行動に影響し得るが、色心理学の研究はまだ発展途上で、文脈、境界条件、調整要因、現実場面への一般化について追加検証が必要とするレビューがある。特定色を見せれば誰にでも同じ効果が出るという応用推奨は支持されない。

出典:

- Elliot & Maier (2014), *Color Psychology: Effects of Perceiving Color on Psychological Functioning in Humans*, Annual Review of Psychology.
  https://doi.org/10.1146/annurev-psych-010213-115035
- Elliot (2019), *A Historically Based Review of Empirical Work on Color and Psychological Functioning*, Review of General Psychology.
  https://doi.org/10.1037/gpr0000170

個別研究で報告された効果も安定しているとは限らない。例えば「赤という語の処理が知的成績を下げる」という研究に対する4回の直接・概念的追試では、効果を再現できなかった。

出典: Gnambs et al. (2020), *Processing the Word Red and Intellectual Performance: Four Replication Attempts*, Collabra: Psychology.
https://doi.org/10.1525/collabra.3

### 3.3 光療法と画面の配色は別物

青色光療法について9件のRCT、347名を統合したメタ分析でも、抑うつ症状に対する非活動対照・活動対照への有意な優越性は確認されず、有効性は未確立と結論された。

そもそも臨床研究の光療法は、波長だけでなく照度、照射時間、タイミング、概日リズムなどを扱う医療的介入である。Web画面に青色を表示することとは同一視できない。

出典: Do et al. (2022), *Blue-Light Therapy for Seasonal and Non-Seasonal Depression: A Systematic Review and Meta-Analysis of Randomized Controlled Trials*, Canadian Journal of Psychiatry.
https://doi.org/10.1177/07067437221097903

## 4. 文脈・文化・個人差

30か国、4,598名、22母語を対象にした国際研究では、色―感情連想の国間平均類似度は高かった一方、国籍にも追加的な予測力があり、言語的・地理的に近い国ほど連想が似ていた。

出典: Jonauskaite et al. (2020), *Universal Patterns in Color-Emotion Associations Are Further Shaped by Linguistic and Geographic Proximity*, Psychological Science.
https://doi.org/10.1177/0956797620948810

色の意味と選好には、少なくとも次の要因が関与する。

- 使用文脈: 同じ赤でも、恋愛、警告、勝負、食品などで意味が変わる。
- 色属性: 色相だけでなく明度・彩度・組み合わせが印象を変える。
- 文化・言語・地域
- 年齢、性別、過去の経験、ブランドや所属集団への親近感
- その時点の目的と気分
- 色覚特性、端末の表示特性、ダークモード、周囲の照明

色の好みは対象によって変わり、服、建築、集中したい場面などで同じ色が選ばれるとは限らないという大規模調査もある。

出典: Bakker et al. (2015), *Color preferences for different topics in connection to personal characteristics*, Color Research & Application.
https://doi.org/10.1002/col.21845

## 5. アプリで許容される表現

### 5.1 推奨表現

- 「あなたの傾向を色で表すと」
- 「結果をイメージした象徴カラーパレット」
- 「色と感情の一般的な連想を参考にした表現です」
- 「今の気分や目的に合わせて選ぶサポートカラー」
- 「3つの候補から、いちばんしっくりくる色を選んでください」
- 「落ち着いた雰囲気をつくりたい時の候補」
- 「少し活動的な雰囲気に切り替えたい時の候補」

共通注記案:

> 色と感情の一般的な連想および今回の回答傾向をもとにした表現です。色の好みや感じ方には個人差があり、心理状態の診断や改善・治療効果を示すものではありません。

### 5.2 避ける表現

- 「心理学が証明したあなたの色」
- 「あなたの本質は青」
- 「この性格の人は赤を好む」
- 「今の不安には青が必要」
- 「ストレスを下げる色」「集中力を上げる色」
- 「治癒色」「処方色」「カラーセラピー」
- 「この色を身につければ人間関係が改善する」

「必ず」「最適」「効く」「改善する」等の効果断定と、医学・治療を連想させる語を使わない。

心理学に関する活動は社会と個人へ影響し得るため、専門的責任と利用者の福祉への配慮が必要とする日本心理学会の倫理原則とも整合させる。

出典: 公益社団法人日本心理学会「倫理規程」
https://psych.or.jp/publication/rinri_kitei/

## 6. 信頼性を損なわずエンタメ性を持たせる推奨仕様

### 6.1 機能A: シグネチャーパレット

結果画面の猫キャラクターに、3色からなる「シグネチャーパレット」を付ける。

- **主色**: 最も特徴的な傾向を象徴
- **副色**: 二番目に特徴的な傾向を象徴
- **差し色**: 二つの傾向の組み合わせや51称号の個性を演出

実装上は次の原則を採用する。

- 色は得点そのものではなく、得点から導いたキャラクター演出データとして保持する。
- 単純な「1特性＝1色相」ではなく、上位2特性と各特性の高低、スコアの偏りを組み合わせる。
- 外向性は、固定色よりも彩度・コントラスト・暖冷感の強弱へ反映する。
- 開放性は、配色数、色相差、グラデーションや模様の複雑さで表現できる。
- 誠実性は、配色の規則性や整然さ、調和性は色間の柔らかなつながりとして演出できる。
- 神経症傾向は暗さや悪い色へ変換せず、繊細な明度差、境界線、余白など価値中立な造形で表現する。
- 51種類すべてを同等に魅力的にし、「高得点ほど鮮やかで良い」「低得点ほど濁って悪い」という序列を作らない。

表示ラベルは「心理学的に決まる色」ではなく「結果をイメージした色」とする。

### 6.2 機能B: ユーザーが完成させる色

結果ごとに2～3種類の配色候補を表示し、ユーザーが「いちばん自分らしい」と思うものを選ぶ。

この選択により、

- 科学的に弱い一意の色相対応を断定しない
- 個人の経験・好みを尊重できる
- 選ぶ楽しさと結果への参加感を増やせる
- 選んだ配色で猫キャラクター、結果カード、共有画像を着せ替えられる

という利点がある。

結果履歴には、Big Five得点と称号とは別フィールドで選択パレットを保存する。色を変更しても診断結果自体は変わらない設計にする。

### 6.3 機能C: 任意の「今のサポートカラー」

Big Five回答から現在の心理状態を推測せず、結果表示後に任意で短いチェックインを行う。

質問例:

1. 今の気分はどちらに近いですか（落ち着いている―張りつめている）
2. 今のエネルギーはどちらに近いですか（低い―高い）
3. これから作りたい雰囲気はどれですか（ひと息つく／気持ちを切り替える／少し活動的に／静かに取り組む）
4. 苦手または避けたい色はありますか（任意）

出力は「効果の処方」ではなく、明度・彩度・暖冷感が異なる2～3候補を提示し、最後は本人が選ぶ。選択肢には「どれも選ばない」を含める。

表示例:

> 今は静かな雰囲気を作りたいという回答から、低彩度で明るめの候補を用意しました。感じ方には個人差があるので、心地よいものだけを選んでください。

### 6.4 根拠表示

結果画面には折りたたみ式の「この色の決まり方」を設ける。

- Big Five得点 → 称号・猫キャラクター判定
- 特徴的な2傾向 → 配色構成、彩度、明度、模様へ変換
- 本人が選んだ好み → 最終パレット
- サポートカラーは任意の現在状態回答から別に生成

根拠レベルを次のように明示するとよい。

- **尺度に基づく**: Big Five得点
- **研究を参考にした表現**: 色と性格語・感情の一般的連想
- **演出**: 51称号、猫、小物、具体的な配色
- **本人の選択**: 最終パレット、避けたい色

### 6.5 共有体験

- 猫キャラクター、称号、3色パレット、短い結果文を1枚にまとめる。
- HEX値または色名を添え、画像保存後にも再現できるようにする。
- 「今日選んだ色」を日付つきで履歴に残せるが、気分の診断履歴とは呼ばない。
- 共有画像にも小さく「結果をイメージしたカラーパレット」と表示する。
- 色だけで意味を伝えず、色名、テキスト、アイコン、模様を併用する。

W3CのWCAG 1.4.1は、情報伝達の唯一の手段として色を使わないことを求めている。本文・操作部のコントラストも別途検証する。

出典: W3C, *Understanding Success Criterion 1.4.1: Use of Color*
https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html

## 7. 検証計画

### MVP

- シグネチャーパレットを2～3候補表示し、本人が1つ選択
- 「研究を参考にした演出」であることを常時表示
- 色覚多様性シミュレーション、コントラスト、グレースケールでの可読性を確認
- 色を選ばなくても全機能を利用可能にする

### ベータ

同意した利用者に、次の項目だけを収集する。

- 結果への納得度
- 色が自分らしいと感じたか
- 最初に提示された色と最終選択色
- 色提案が結果を理解しやすくしたか
- 文化・年代等の分析に必要な最小限の属性

検証対象は「色で気分が改善したか」ではなく、まず**自己理解の補助、納得度、好み、共有意向**とする。改善効果を検証する場合は、別研究として事前に仮説・尺度・対照条件・同意手続きを定める必要がある。

### 採用判断指標案

- 色提案を「心理学的な確定診断」と誤解した割合
- 提案パレットから本人に合うものを選べた割合
- 色なし結果と比較した理解度・満足度
- パレット候補間の選択分布
- 色覚特性を問わず結果を判別できるか

## 8. 要件化する場合の推奨文

> システムは、Big Fiveの得点からプロフィールを表現するシグネチャーパレット候補を生成し、利用者が最終パレットを選択できるものとする。色提案は自己理解を補助する視覚的・娯楽的表現であり、色の好み、現在の心理状態、心理的改善効果を診断または保証するものとして表示してはならない。

> 現在の状態に応じた色を提案する場合は、Big Five得点とは別に任意の状態質問と利用者の色選択を用いる。出力はサポートカラー候補とし、治療、改善、能力向上その他の効果を断定してはならない。

## 9. 参考文献

1. Jue, J. J., & Ha, J. H. (2022). Exploring the relationships between personality and color preferences. *Frontiers in Psychology, 13*, 1065372. https://doi.org/10.3389/fpsyg.2022.1065372
2. Jonauskaite, D., Thalmayer, A. G., Müller, L., & Mohr, C. (2021). What Does Your Favourite Colour Say About Your Personality? Not Much. *Personality Science, 2*. https://doi.org/10.5964/ps.6297
3. Pazda, A. D., & Thorstenson, C. A. (2018). Extraversion predicts a preference for high-chroma colors. *Personality and Individual Differences, 127*, 133–138. https://doi.org/10.1016/j.paid.2018.01.028
4. Jonauskaite, D., & Mohr, C. (2025). Do we feel colours? A systematic review of 128 years of psychological research linking colours and emotions. *Psychonomic Bulletin & Review, 32*, 1457–1486. https://doi.org/10.3758/s13423-024-02615-z
5. Jonauskaite, D., et al. (2020). Universal Patterns in Color-Emotion Associations Are Further Shaped by Linguistic and Geographic Proximity. *Psychological Science, 31*(10), 1245–1260. https://doi.org/10.1177/0956797620948810
6. Elliot, A. J., & Maier, M. A. (2014). Color Psychology: Effects of Perceiving Color on Psychological Functioning in Humans. *Annual Review of Psychology, 65*, 95–120. https://doi.org/10.1146/annurev-psych-010213-115035
7. Elliot, A. J. (2019). A Historically Based Review of Empirical Work on Color and Psychological Functioning. *Review of General Psychology, 23*(2). https://doi.org/10.1037/gpr0000170
8. Gnambs, T., Appel, M., & Batinic, B. (2020). Processing the Word Red and Intellectual Performance: Four Replication Attempts. *Collabra: Psychology, 6*(1), 3. https://doi.org/10.1525/collabra.3
9. Do, A., et al. (2022). Blue-Light Therapy for Seasonal and Non-Seasonal Depression: A Systematic Review and Meta-Analysis of Randomized Controlled Trials. *Canadian Journal of Psychiatry, 67*(10), 745–754. https://doi.org/10.1177/07067437221097903
10. Bakker, I., van der Voordt, T., Vink, P., de Boon, J., & Bazley, C. (2015). Color preferences for different topics in connection to personal characteristics. *Color Research & Application, 40*(1), 62–71. https://doi.org/10.1002/col.21845
11. 公益社団法人日本心理学会. 倫理規程. https://psych.or.jp/publication/rinri_kitei/
12. W3C. Understanding Success Criterion 1.4.1: Use of Color. https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
