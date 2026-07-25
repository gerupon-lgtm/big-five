# T-005 結果・キャラクター・色香り設計

- 状態: 設計承認済み。コンテンツ制作・実装前
- 対象版: `mvp-0.1.0`
- 対象機能: F-005、F-006、F-007、F-008、F-016、F-018
- 決定対象: Q-006一部、Q-012、Q-013
- 更新日: 2026-07-25

## 1. 目的

20問簡易プレビューと50問詳細結果を、採点上の事実とエンタメ表現を混同せず表示する。称号、猫、色、香りが失敗しても、5因子、結果文、履歴、共有テキストへ到達できる構成とする。

本設計は次の資料を正典として参照する。

- 要件: `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md`
- 称号・演出: `docs/title-character-catalog.md`
- データ契約: `docs/data-model.md`
- 画面: `docs/screens.md`
- 処理: `docs/processing-design.md`

## 2. 結果画面

### 2.1 表示順

50問結果は次の順とする。

1. 称号、猫、中立副題、非公式表現の注意
2. 結果の輪郭
3. 称号になった理由
4. 5因子のスコアと因子説明
5. 観察文、強みとして表れやすい面、裏返りとして出やすい面
6. 場面別の振り返り、問いかけ、行動ヒント
7. 色候補と香調候補
8. 履歴、共有、50問への継続等の操作

20問簡易プレビューは仮称号・仮猫・全5因子と限界を表示し、場面別の詳細記述、断定的な強み・裏返り、詳しい行動ヒントを抑制する。

### 2.2 文面

- 測定結果は客観的な観察文、実用コメントは柔らかな問いかけとして分離する。
- 「あなたは」で人格を固定せず、「今回の回答では」「この因子では」と書く。
- 低傾向を能力不足、高傾向を能力保証として扱わない。
- 仕事、人間関係、ストレス、行動提案は尺度から直接判定した事実ではなく、振り返り・行動のヒントとして表示する。
- 因子名の横に「説明を見る」を置き、HTMLの展開ボタンで一行定義を確認できるようにする。Canvas内だけのツールチップにしない。
- 振り返り文の後へ `※因子名の「説明を見る」から、それぞれの意味を確認できます。` を小さく控えめな文字で表示する。
- 履歴には診断時に表示した文章を順序と版ごと保存し、後の文章版から再生成・上書きしない。開閉状態は保存しない。

Q-006の称号ラフは確定したが、全因子・全称号の本番観察文、根拠対応表、採用文献はコンテンツ制作として残る。これらが揃うまでT-005の本番結果文を完成扱いにしない。

## 3. Q-012 キャラクター

### 3.1 画風と構図

- 自然な成猫の骨格を保った、中密度の水彩・ガッシュ調。
- 正方形、中央、全身、透明背景、トリミングなし。
- 原本は透明PNG、配信は1024×1024pxの透明WebP。
- 猫1体と小物1〜2点。背景、文字、カード色を焼き込まない。
- 画面と共有カードで縦横比を維持し、`contain`相当で表示する。
- 1体250,000 bytes以下を目標とする。超過はCI警告と人の承認対象であり、自動失敗にはしない。
- 該当1体だけを遅延読み込みし、51体を初期一括読込しない。
- 毛色・猫種・体格を因子、能力、善悪、知性、序列へ結び付けない。

### 3.2 CharacterManifest

```text
CharacterManifest = exact {
  characterManifestVersion: string,
  entries: CharacterManifestEntry[51]
}

CharacterManifestEntry = exact {
  characterId: string,
  assetVersion: string,
  imagePath: string,
  width: integer,
  height: integer,
  alt: string,
  integrity: string
}
```

- `titleId -> characterId`は`TitleProfileDefinition`だけを正典とし、manifestへ`titleId`を重複保持しない。
- entriesは`TitleProfileDefinitions`と同じ固定順の51件。
- `characterId`、`imagePath`は一意。欠落、余剰、重複、孤児ファイルを拒否する。
- `imagePath`は同一オリジン相対パスの`.webp`。query、fragment、`..`を拒否する。
- `width`と`height`は1024。実ファイルのWebP magic、alpha、透明画素を検査する。
- `integrity`は`sha256-<Base64>`を必須とし、実ファイルと一致させる。
- 非透明bounding boxが四辺へ接触した場合はトリミング疑いとして失敗する。
- altは画像で観察できる姿勢、視線、小物を書く。称号、性格、能力、猫種推定を繰り返さない。

### 3.3 制作台帳

台帳は最低限、次を保持する。

`titleId`、`characterId`、`titleLabelAtBrief`、`assetVersion`、`productionStatus`、`sceneIntent`、`catReferenceKind`、`catReferencePath`、`referenceRightsNote`、`pose`、`gazeTarget`、`props`、`prohibitedRepresentationCheck`、`sourcePngPath`、`sourceSha256`、`deliveryWebpPath`、`deliverySha256`、`width`、`height`、`byteLength`、`webpEncoder`、`webpSettings`、`alt`、`artReviewStatus`、`anatomyReviewStatus`、`technicalReviewStatus`、`accessibilityReviewStatus`、`approvedBy`、`approvedAt`、`rejectionReason`、`notes`。

`titleLabelAtBrief`は制作時点の参照値であり、称号正典にはしない。

### 3.4 生成と検査

1. 台帳で情景意図、視線、姿勢、小物、禁止表現を承認する。
2. 中密度水彩・ガッシュ、自然な骨格、中央全身、透明背景のPNG原本を制作する。
3. 耳、ひげ、尻尾、小物が欠けず、背景・文字・カード色がないことを確認する。
4. 固定encoderと設定で1024角透明WebPへ変換し、メタデータを除去する。
5. 寸法、magic、alpha、透明画素、bounding box、hash、byte数を抽出する。
6. manifestを生成し、exact schema、51件対応、版、参照、孤児を検証する。
7. 透過チェッカー、明・中・暗背景、360px、200%文字拡大で確認する。
8. 該当1体以外の非取得、404、decode失敗時の称号・スコア・文章・共有テキスト維持を確認する。

### 3.5 3体パイロット

最初に次の3体を制作する。

- `character-balanced`: 五枚の葉のモビール。
- `character-single-intellectImagination-high`: もなか、蝶、スケッチブック。
- `character-single-intellectImagination-low`: 木の実、籠。

3体すべてに原本PNG、配信WebP、alt、台帳、hashを用意し、自動検査、画風、頭身、目、毛柄密度、彩度、余白、小物密度、骨格、透明、同等の魅力を横並びで承認する。もなかアンカーは画風と本人らしさの参照専用であり、背景付き画像を配信物へ流用しない。

WebPは`quality 82 / alpha 100 / effort 6 / metadata none`を初期比較値とする。3体承認後、encoder製品・版、最終設定、中央余白の数値を全51体共通値として固定する。

## 4. Q-013 色・香り

### 4.1 定義

```text
PresentationDefinitionSet = exact {
  schemaVersion: 1,
  presentationDefinitionVersion: string,
  scenes: [
    { sceneId: "pause", label: "ひと息つきたい" },
    { sceneId: "reset", label: "気持ちを切り替えたい" },
    { sceneId: "quiet-focus", label: "静かに取り組みたい" }
  ],
  palettes: PaletteDefinition[],
  fragrances: FragranceSuggestion[],
  titleSelectors: TitlePresentationSelector[51]
}

PaletteDefinition = exact {
  paletteId: string,
  version: string,
  label: string,
  baseColors: {
    primary: HexColor,
    secondary: HexColor,
    accent: HexColor
  },
  description: string
}

FragranceSuggestion = exact {
  fragranceId: string,
  version: string,
  sceneId: "pause" | "reset" | "quiet-focus",
  accordLabel: string,
  description: string,
  disclaimerId: string
}

TitlePresentationSelector = exact {
  titleId: string,
  alternativePaletteIds: [string, string],
  fragranceScenes: [
    FragranceSceneSelector<"pause">,
    FragranceSceneSelector<"reset">,
    FragranceSceneSelector<"quiet-focus">
  ]
}

FragranceSceneSelector<S> = exact {
  sceneId: S,
  candidateFragranceIds: [string, string],
  shareFragranceId: string
}
```

- 標準パレットは`TitleProfileDefinition.defaultPaletteId`を正典とし、selectorには代替2件だけを持たせる。
- 標準1件と代替2件は相互に異なる。
- 各パレットは主色、副色、差し色の3基調色を持つ。
- `paletteId`は`palette-<slug>`、`fragranceId`は`fragrance-<scene>-<slug>`とし、版をIDへ埋め込まない。
- HexColorは大文字6桁の`#[0-9A-F]{6}`。
- 未知フィールド、ID重複、版不一致、参照切れ、配列数・順序違反を拒否する。

### 4.2 選択

`selectPresentation`はTitleProfileDefinitionとPresentationDefinitionSetだけを受け取る純粋関数とする。DOM、Canvas、localStorage、ネットワーク、生回答、得点、因子band、猫の色を受け取らない。

同じ称号と版から、標準1＋代替2のパレット、固定順3場面、各2香調、各場面の共有代表1件を決定的に返す。

利用者の色選択は`selectedPaletteId`だけを更新し、スコア、称号、文章、猫、香調を変更しない。同系色の猫でも候補を除外、差替え、再配色しない。

### 4.3 用途色

3基調色から背景、表面、アクセント、文字、グラフへ展開する処理を`resolvePaletteUsage(PaletteDefinition, PaletteUsageMappingDefinition)`として分離する。展開規則、コントラスト、明暗二重縁取り、影、中立背景プレートはこの処理以降で扱い、猫色を入力にしたパレット変更を禁止する。

### 4.4 香調と共有

- 追加質問や香り選択を要求せず、3場面×各2候補、合計6件を同時表示する。
- 共有では`pause -> reset -> quiet-focus`の順に各`shareFragranceId`を1件、合計3件へ要約する。
- 共有代表は同じ場面の2候補内に必須とし、得点や利用者操作で変更しない。
- 香調は雰囲気・印象の候補として書き、現在の心理状態を推定した提案と表現しない。
- 商品、ブランド、購入URL、植物・精油名、量、滴数、濃度、配合、摂取、塗布、ディフューザー等の使用法を持たない。
- 「効く」「治す」「改善する」「不安を下げる」「集中力・能力・作業効率が上がる」等の効果断定を禁止する。
- 過去調査にあった追加質問、安全モード、無香料分岐は導入しない。

全パレット、香調、用途色展開の実データはコンテンツ制作として残る。Q-013の構造と選択規則は本設計で確定する。

## 5. フォールバック

- 猫読込失敗: 称号、5因子、結果文、色香り、共有テキストを維持し、altと代替枠を表示する。
- Canvas失敗: HTMLの5因子一覧と選択可能テキストを維持する。
- 無効パレット: TitleProfileDefinitionの標準パレットへ戻し、診断結果を変更しない。
- 色選択不可: 標準パレットのまま結果と共有を成立させる。
- Web Share不可: PNG保存、画像コピー、テキストコピー、選択可能テキストの順に到達可能にする。

## 6. 検証

- 20問／50問、balanced／single／pair、境界あり／なし。
- 51称号、51 characterId、51 manifest entryの完全対応と孤児0件。
- exact schema、未知フィールド、生回答・得点・猫色条件の拒否。
- 標準1＋代替2、3場面×2香調、共有3件。
- 色選択前後でスコア、称号、文章、猫、香調が不変。
- 猫404、decode失敗、Canvas不可、無効パレット、共有API不可。
- 360px、200%文字拡大、キーボード、読み上げ、非色依存。
- 同系色背景で再配色せず輪郭を識別でき、プレビューと完成PNGが一致。
- 通常版の診断フローで外部送信0件。

## 7. 残作業

1. Q-006の全本番結果文、因子説明、根拠対応表、採用文献。
2. Q-012の3体パイロット制作・承認、encoderと余白値の固定、残り48体の量産。
3. Q-013の全パレット・香調・用途色展開データ。
4. Q-007の共有画像寸法・文字量。
5. 上記コンテンツを前提にしたT-005実装計画とTDD。
