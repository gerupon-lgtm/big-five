# ココロアロマ コンテンツ再整理 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 承認済み設計に沿って`presentation-v2`の香りマスタと51称号の割り当てを再整理し、具体的な素材例を含む結果・共有カード用の純粋モデル、機械監査、決定的な確認資料を実装する。

**Architecture:** 人手編集の正典は引き続き`content/source/`のCSVとし、schema→compiler→domain validator→selector→review projectionの依存方向を維持する。香りの多様性はDOMやCanvasに依存しない純粋監査モジュールで検証し、結果画面・正式共有Canvasへの接続は行わない。既存の`presentation-v2`はapproved release未選択のdraft契約なので、schemaVersionを増やさず`iconId`と`familyId`を追加する。

**Tech Stack:** HTML / CSS / JavaScript ES Modules、Node.js `node:test`、CSV authoring schemas、既存content compiler、Markdown review generator

## Global Constraints

- 対応機能・タスクはT-005/F-018（結果用香りモデル）とT-007/F-011・F-018（共有カード用香り要約）である。ただし結果画面DOM、正式共有Canvas、共有操作は本計画の対象外とし、各タスクを完了扱いにしない。
- 正典は`content/source/presentation/presentation-v2/*.csv`である。`app/content/`の生成JSONを手編集・コミットしない。
- `presentation-v2`、全対象行の`draft`、P-0〜P-6の現在の承認状態・承認者・承認日時を維持する。approved releaseを作らない。
- パレット、用途色、称号、猫、採点、結果文、結果snapshot、通常版の`connect-src 'none'`を変更しない。
- 香りは診断・効能・適合推奨ではなく、称号から着想した非診断的な演出とする。商品、購入、量、滴数、濃度、配合、摂取、塗布、ディフューザー等の使用案内を追加しない。
- 既存IDの意味を別素材へ流用しない。廃止対象IDは削除し、追加対象には新規IDを付ける。
- 香り素材例は1〜2件とする。結果用モデルは6候補すべての素材名を解決でき、共有カード用モデルは代表3候補の素材名を含む。共有テキスト生成は本計画で変更しない。
- 固定場面順は`pause`、`reset`、`quiet-focus`、各2候補、各1代表、51称号合計306関連行を維持する。
- 監査結果とMarkdown出力は入力CSVだけで決まり、時刻・乱数・DOM・ネットワークへ依存しない。
- 各実装タスクは、失敗するテスト→最小実装→成功確認→コミットの順で進める。

---

### Task 1: 場面アイコン・香りfamily・素材数の契約を追加する

**Files:**

- Create: `app/js/domain/fragrance-taxonomy.js`
- Modify: `app/js/domain/presentation-scenes.js`
- Modify: `content/schemas/scenes.schema.json`
- Modify: `content/schemas/fragrances.schema.json`
- Modify: `content/source/presentation/presentation-v2/scenes.csv`
- Modify: `content/source/presentation/presentation-v2/fragrances.csv`
- Modify: `scripts/content/compile-presentation.mjs`
- Modify: `app/js/domain/presentation-definition-validator.js`
- Modify: `app/js/domain/presentation-selector.js`
- Modify: `app/tests/fixtures/presentation-valid.fixture.js`
- Modify: `app/tests/fixtures/presentation-invalid.fixture.js`
- Modify: `app/tests/content-table-schema.test.js`
- Modify: `app/tests/content-presentation-character-compiler.test.js`
- Modify: `app/tests/presentation-definition.test.js`
- Modify: `app/tests/presentation-selector.test.js`

- [ ] **Step 1: 新しい契約を表す失敗テストを書く**

  次をテストへ追加する。

  - `scenes.csv`の厳密列に`icon_id`があり、固定対応が次のとおりである。

    ```js
    [
      { sceneId: "pause", iconId: "aroma-pause" },
      { sceneId: "reset", iconId: "aroma-reset" },
      { sceneId: "quiet-focus", iconId: "aroma-quiet-focus" },
    ]
    ```

  - `fragrances.csv`の厳密列に`family_id`がある。
  - `familyId`は次の8値だけを許可する。

    ```js
    [
      "citrus",
      "floral",
      "herbal",
      "woody",
      "resinous",
      "earthy",
      "spicy",
      "fresh",
    ]
    ```

  - schemaVersion 2の香調は`materialIds`が1〜2件なら有効、0件・3件・重複・未知IDなら無効。
  - compiler、validator、selectorの厳密フィールド検査が`iconId`と`familyId`の欠落・余剰・未知値を拒否する。

- [ ] **Step 2: focused testを実行してREDを確認する**

  Run:

  ```powershell
  node --test app/tests/content-table-schema.test.js app/tests/content-presentation-character-compiler.test.js app/tests/presentation-definition.test.js app/tests/presentation-selector.test.js
  ```

  Expected: `icon_id`、`family_id`、素材数3件のいずれかに関するassertion failure。

- [ ] **Step 3: 共有定数とschemaを実装する**

  `app/js/domain/fragrance-taxonomy.js`は次の公開契約にする。

  ```js
  export const FRAGRANCE_FAMILY_IDS = Object.freeze([
    "citrus",
    "floral",
    "herbal",
    "woody",
    "resinous",
    "earthy",
    "spicy",
    "fresh",
  ]);
  ```

  `app/js/domain/presentation-scenes.js`には固定順のIDに対応する次の定数を追加する。

  ```js
  export const PRESENTATION_SCENE_ICON_IDS = Object.freeze([
    "aroma-pause",
    "aroma-reset",
    "aroma-quiet-focus",
  ]);
  ```

  CSV schemaへ厳密列を追加する。

  - `scenes.csv`: `icon_id`を`label`の後、`status`の前
  - `fragrances.csv`: `family_id`を`scene_id`の後、`accord_label`の前

- [ ] **Step 4: compilerとdomain validatorへ投影する**

  compilerの出力形を次に変更する。

  ```js
  const scenes = ordered(sceneRows).map(({ scene_id, label, icon_id }) => ({
    sceneId: scene_id,
    label,
    iconId: icon_id,
  }));

  return {
    fragranceId: row.fragrance_id,
    version: row.presentation_definition_version,
    sceneId: row.scene_id,
    familyId: row.family_id,
    accordLabel: row.accord_label,
    description: row.description,
    materialIds: fragranceMaterialIds,
    disclaimerId: row.disclaimer_id,
  };
  ```

  `presentation-definition-validator.js`と`presentation-selector.js`の厳密フィールド配列、許可値、素材数上限を同期する。schemaVersion 1の履歴互換フィールドは変更しない。

- [ ] **Step 5: 現行CSVへ暫定familyと固定iconを記入する**

  現行32香調の主たる香り系統を8値のいずれかで明示する。複合素材でも主系統1件だけを記録する。既存のID、順序、文言、statusはこのTaskでは変更しない。

- [ ] **Step 6: focused testをGREENにする**

  Run:

  ```powershell
  node --test app/tests/content-table-schema.test.js app/tests/content-presentation-character-compiler.test.js app/tests/presentation-definition.test.js app/tests/presentation-selector.test.js
  ```

  Expected: all pass。

- [ ] **Step 7: コミットする**

  ```powershell
  git add app/js/domain/fragrance-taxonomy.js app/js/domain/presentation-scenes.js content/schemas/scenes.schema.json content/schemas/fragrances.schema.json content/source/presentation/presentation-v2/scenes.csv content/source/presentation/presentation-v2/fragrances.csv scripts/content/compile-presentation.mjs app/js/domain/presentation-definition-validator.js app/js/domain/presentation-selector.js app/tests/fixtures/presentation-valid.fixture.js app/tests/fixtures/presentation-invalid.fixture.js app/tests/content-table-schema.test.js app/tests/content-presentation-character-compiler.test.js app/tests/presentation-definition.test.js app/tests/presentation-selector.test.js
  git commit -m "feat: add aroma scene and family contracts"
  ```

---

### Task 2: 問題のある香調・素材マスタを整理する

**Files:**

- Create: `app/tests/kokoro-aroma-content.test.js`
- Modify: `content/source/presentation/presentation-v2/fragrances.csv`
- Modify: `content/source/presentation/presentation-v2/fragrance-materials.csv`
- Modify: `content/source/presentation/presentation-v2/fragrance-material-examples.csv`
- Modify: `content/source/presentation/presentation-v2/selector-fragrances.csv`
- Modify: `app/tests/presentation-review-report.test.js`

- [ ] **Step 1: 廃止・追加・文言契約の失敗テストを書く**

  実CSVをcompileした定義に対して次を固定する。

  - 香調29件、素材25件。
  - 次の香調IDは存在しない。

    ```js
    [
      "fragrance-pause-roman-chamomile-soft",
      "fragrance-pause-chamomile",
      "fragrance-pause-ylang-ylang",
      "fragrance-reset-citronella",
      "fragrance-pause-patchouli",
    ]
    ```

  - 次の素材IDは存在しない。

    ```js
    [
      "material-chamomile",
      "material-ylang-ylang",
      "material-citronella",
    ]
    ```

  - 次の新規IDが存在し、指定場面と素材を持つ。

    ```js
    {
      "fragrance-pause-sweet-orange": {
        sceneId: "pause",
        familyId: "citrus",
        materialIds: ["material-sweet-orange"],
      },
      "fragrance-reset-ginger": {
        sceneId: "reset",
        familyId: "spicy",
        materialIds: ["material-ginger"],
      },
    }
    ```

  - `fragrance-quiet-focus-patchouli`だけがpatchouli素材を使う。
  - fragrance/material/exampleの`display_order`は削除後も1始まりの連番。
  - 全行の`presentation_definition_version`は`presentation-v2`、`status`は現状どおり`draft`。

- [ ] **Step 2: focused testを実行してREDを確認する**

  Run:

  ```powershell
  node --test app/tests/kokoro-aroma-content.test.js app/tests/presentation-review-report.test.js
  ```

  Expected: 旧ID・件数・新IDのassertion failure。

- [ ] **Step 3: マスタを置換し、参照切れを解消する**

  次をそのまま実施する。

  - `fragrance-pause-roman-chamomile-soft`参照を`fragrance-pause-roman-chamomile`へ統合して旧行を削除。
  - `fragrance-pause-chamomile`と`material-chamomile`を削除。参照は同一称号内重複を避けられるpause候補へ移す。
  - ylang-ylangの香調・素材を削除し、新規sweet-orange香調・素材へ参照を置換。
  - citronellaの香調・素材を削除し、新規ginger香調・素材へ参照を置換。
  - pause patchouli香調を削除し、参照はpause内の別候補へ移す。quiet-focus patchouliは維持。
  - 香調、素材の`display_order`を連番へ振り直す。selectorは各称号・場面内で1、2を維持する。

  初回置換では`share_selected`をできる限り維持する。廃止された代表香調は置換先を代表にし、Task 4で全体の上限を調整する。

- [ ] **Step 4: 指摘された香り表現を修正する**

  次の意味を`accord_label`と`description`へ反映する。

  - レモングラス: 「レモンを思わせる青い草」
  - ジュニパーベリー: 「澄んだ針葉樹と青い実」
  - ホーウッド: 木質だけでなく、やわらかな花のニュアンス
  - quiet-focusのベルガモット: 軽さだけでなく、ほろ苦さと端正な輪郭
  - resetのマンダリン: 鋭い切替ではなく、丸みのあるやさしい切替
  - sceneをまたぐローズマリー、ベルガモット、ヒノキ、フランキンセンスは、場面ごとに異なる`accord_label`と`description`にする。

  `pause`に濃厚・官能的・深く沈み込む表現を残さない。`description`に効能・適合推奨・使用法を入れない。

- [ ] **Step 5: focused testをGREENにする**

  Run:

  ```powershell
  node --test app/tests/kokoro-aroma-content.test.js app/tests/presentation-review-report.test.js
  npm.cmd run content:validate
  ```

  Expected: tests pass。validationは既知の未承認warningを許容するが、errorは0。

- [ ] **Step 6: コミットする**

  ```powershell
  git add content/source/presentation/presentation-v2/fragrances.csv content/source/presentation/presentation-v2/fragrance-materials.csv content/source/presentation/presentation-v2/fragrance-material-examples.csv content/source/presentation/presentation-v2/selector-fragrances.csv app/tests/kokoro-aroma-content.test.js app/tests/presentation-review-report.test.js
  git commit -m "content: refine kokoro aroma master data"
  ```

---

### Task 3: 香りの多様性を純粋関数で機械監査する

**Files:**

- Create: `scripts/content/audit-fragrance-variation.mjs`
- Create: `app/tests/fragrance-variation.test.js`
- Modify: `app/js/domain/presentation-definition-validator.js`

- [ ] **Step 1: 9分類の失敗fixtureを書く**

  `app/tests/fragrance-variation.test.js`で、最小fixtureを1つずつ変形し、次の安定コードを検出する。

  ```js
  const EXPECTED_CODES = [
    "FRAGRANCE_TITLE_MATERIAL_DUPLICATE",
    "FRAGRANCE_TITLE_SET_DUPLICATE",
    "FRAGRANCE_SCENE_FAMILY_DUPLICATE",
    "FRAGRANCE_SHARE_TRIPLE_OVERUSED",
    "FRAGRANCE_USAGE_OVER_LIMIT",
    "FRAGRANCE_SCENE_REUSE_OVER_LIMIT",
    "FRAGRANCE_SCENE_COPY_DUPLICATE",
    "FRAGRANCE_PROHIBITED_COPY",
    "FRAGRANCE_SHARE_COPY_OVERFLOW",
  ];
  ```

  実CSVに対しても`findings.length === 0`を期待するテストを置く。この時点では割り当て未調整のため、そのテストは失敗してよい。

- [ ] **Step 2: focused testを実行してREDを確認する**

  Run:

  ```powershell
  node --test app/tests/fragrance-variation.test.js
  ```

  Expected: module not foundまたは監査結果未実装でfail。

- [ ] **Step 3: 監査APIと決定的な結果形を実装する**

  公開APIを次に固定する。

  ```js
  export const FRAGRANCE_VARIATION_LIMITS = Object.freeze({
    shareTripleTitles: 3,
    candidateTitlesPerFragrance: 12,
    shareTitlesPerFragrance: 8,
    scenesPerMaterial: 2,
    shareMaterialCodePoints: 22,
    shareAccordCodePoints: 22,
  });

  export function auditFragranceVariation(definitionSet) {
    return deepFreeze({
      valid: findings.length === 0,
      findings,
      usage: {
        fragrances,
        materials,
        families,
        shareTriples,
      },
    });
  }
  ```

  `findings`の各行は次の厳密形とし、`code`、`titleIds`、`sceneIds`、`fragranceIds`、`materialIds`、`detail`の全フィールドを常に持たせる。該当しない配列は空配列にする。

  ```js
  {
    code: "FRAGRANCE_SCENE_FAMILY_DUPLICATE",
    titleIds: ["title-balanced"],
    sceneIds: ["pause"],
    fragranceIds: ["fragrance-pause-a", "fragrance-pause-b"],
    materialIds: [],
    detail: "familyId=floral",
  }
  ```

  findingsは安定コード順、称号定義順、場面固定順、香調display順でsortする。使用回数は重複行数ではなく、異なる称号数で数える。

- [ ] **Step 4: 各規則を実装する**

  - 同一称号の6候補が参照する素材IDに重複があれば`TITLE_MATERIAL_DUPLICATE`。
  - 同一場面の2候補が同一`familyId`なら`SCENE_FAMILY_DUPLICATE`。
  - 6香調IDを場面順・候補順で連結した組が別称号と一致すれば`TITLE_SET_DUPLICATE`。
  - 場面順の代表3香調IDの組が3称号を超えれば`SHARE_TRIPLE_OVERUSED`。
  - 各香調の候補採用が12称号、代表採用が8称号を超えれば`USAGE_OVER_LIMIT`。`detail`で`candidate`と`share`を区別する。
  - 同一素材IDが3場面で使われれば`SCENE_REUSE_OVER_LIMIT`。
  - sceneをまたぐ香調が同じ`accordLabel`かつ`description`なら`SCENE_COPY_DUPLICATE`。
  - `lintPresentationCopy()`の香り関連findingを`PROHIBITED_COPY`へ正規化する。
  - 代表香調の素材表示名を`・`で連結した文字列、または`accordLabel`が規定code point数を超えれば`SHARE_COPY_OVERFLOW`。

- [ ] **Step 5: synthetic fixtureのテストをGREENにする**

  Run:

  ```powershell
  node --test app/tests/fragrance-variation.test.js
  ```

  Expected: 9分類のfixtureはpass。実CSVのzero-finding assertionだけが残ってfailする場合はTask 4へ進む。

- [ ] **Step 6: コミットする**

  ```powershell
  git add scripts/content/audit-fragrance-variation.mjs app/tests/fragrance-variation.test.js app/js/domain/presentation-definition-validator.js
  git commit -m "feat: audit fragrance assignment diversity"
  ```

---

### Task 4: 51称号の306関連行を中程度の個別性へ再配分する

**Files:**

- Create: `scripts/content/propose-fragrance-rebalance.mjs`
- Create: `app/tests/fragrance-rebalance-proposal.test.js`
- Modify: `content/source/presentation/presentation-v2/selector-fragrances.csv`
- Modify: `app/tests/kokoro-aroma-content.test.js`
- Modify: `app/tests/fragrance-variation.test.js`

- [ ] **Step 1: 読み取り専用の提案器の失敗テストを書く**

  提案器は正典CSVを書き換えず、標準出力または`--output`で提案CSVを生成する。テストで次を固定する。

  - 入力と出力は同じ306行、同じtitle/scene/display_order/statusを持つ。
  - 1称号×3場面×2候補、各場面1代表を維持する。
  - 全提案IDは同じsceneのマスタを参照する。
  - 同じ入力はbyte-identicalな出力を返す。
  - 提案をcompileすると多様性監査findingが0件になる。

- [ ] **Step 2: focused testを実行してREDを確認する**

  Run:

  ```powershell
  node --test app/tests/fragrance-rebalance-proposal.test.js
  ```

  Expected: module not foundまたは提案未実装でfail。

- [ ] **Step 3: 既存割り当てを優先する決定的提案アルゴリズムを実装する**

  処理順とtie-breakを次で固定する。

  1. 称号の`display_order`順、場面は`pause`→`reset`→`quiet-focus`。
  2. 旧IDはTask 2の置換先へ変換し、それ以外の既存候補は規則違反がない限り維持。
  3. 同一scene内のfamily重複、称号内素材重複、香調使用上限を解消するときは、原則として非代表の2番候補を先に交換。
  4. 交換候補は、同じscene、相手候補と異なるfamily、称号内で未使用の素材、candidate採用12未満を必須条件にする。
  5. 複数候補がある場合はcandidate採用称号数が少ない順、share採用称号数が少ない順、香調`display_order`順。
  6. 6候補セット重複が残る場合は`quiet-focus`→`reset`→`pause`の2番候補を順に同条件で交換。
  7. 代表3件セットが3称号を超える、または代表採用が8称号を超える場合は、既存の2候補の範囲で代表を切り替える。切替後triple使用数が少ない順、香調share使用数が少ない順、場面は`quiet-focus`→`reset`→`pause`。
  8. 一巡で解消しない場合は同じ順序で再走査し、変更0件かつfindingありなら`FRAGRANCE_REBALANCE_UNSATISFIABLE`をthrowする。

  出力CSVの改行・列順は入力schemaに合わせ、statusを変更しない。

- [ ] **Step 4: 提案を一時ファイルへ生成し、差分を人手確認する**

  Run:

  ```powershell
  node scripts/content/propose-fragrance-rebalance.mjs --source content/source --output .tmp/kokoro-aroma-selector-proposal.csv
  git diff --no-index -- content/source/presentation/presentation-v2/selector-fragrances.csv .tmp/kokoro-aroma-selector-proposal.csv
  ```

  Expected: 変更は`fragrance_id`と必要な`share_selected`だけ。title_id、scene_id、display_order、statusに差分なし。

  提案は制約充足の下書きであり、科学的な性格適合を意味しない。称号ラベルと香りの情景が明らかに逆方向でないことを、変更行について目視確認する。

- [ ] **Step 5: 確認済み提案を正典CSVへ反映する**

  `.tmp`の提案をそのまま正典扱いにはしない。確認した差分だけを`selector-fragrances.csv`へ反映し、`.tmp`はコミットしない。

- [ ] **Step 6: 実CSVの全制約をGREENにする**

  Run:

  ```powershell
  node --test app/tests/fragrance-rebalance-proposal.test.js app/tests/fragrance-variation.test.js app/tests/kokoro-aroma-content.test.js
  npm.cmd run content:validate
  ```

  Expected: 306行、構造・多様性・表現finding 0、content error 0。

- [ ] **Step 7: コミットする**

  ```powershell
  git add scripts/content/propose-fragrance-rebalance.mjs app/tests/fragrance-rebalance-proposal.test.js content/source/presentation/presentation-v2/selector-fragrances.csv app/tests/kokoro-aroma-content.test.js app/tests/fragrance-variation.test.js
  git commit -m "content: diversify title fragrance selections"
  ```

---

### Task 5: 結果用・共有カード用の素材名解決モデルを実装する

**Files:**

- Modify: `app/js/domain/presentation-selector.js`
- Modify: `app/js/domain/share-fragrance-summary.js`
- Modify: `app/tests/presentation-selector.test.js`
- Modify: `app/tests/share-fragrance-summary.test.js`

- [ ] **Step 1: 新しい選択・共有要約形の失敗テストを書く**

  `selectPresentation()`の各場面を次の形で期待する。

  ```js
  {
    sceneId: "pause",
    iconId: "aroma-pause",
    label: "ひと息つきたい",
    candidates: [
      {
        fragranceId: "fragrance-pause-roman-chamomile",
        familyId: "floral",
        materialIds: ["material-roman-chamomile"],
        materialNames: ["ローマンカモミール"],
        // version, sceneId, accordLabel, description, disclaimerIdも維持
      },
      // 2件目
    ],
    shareRepresentative: /* candidatesの同一object参照 */,
  }
  ```

  `summarizeFragrances()`は共有カード用の代表3行を次の厳密形で返す。

  ```js
  {
    sceneId: "pause",
    iconId: "aroma-pause",
    label: "ひと息つきたい",
    materialNames: ["ローマンカモミール"],
    accordLabel: "まろやかな甘みの草花",
  }
  ```

  入力・出力はdeep-frozenとし、未知素材、順序不一致、代表が候補外、空素材名を拒否する。

- [ ] **Step 2: focused testを実行してREDを確認する**

  Run:

  ```powershell
  node --test app/tests/presentation-selector.test.js app/tests/share-fragrance-summary.test.js
  ```

  Expected: `iconId`または`materialNames`欠落でfail。

- [ ] **Step 3: selectorで素材名を一度だけ解決する**

  `definitionSet.fragranceMaterials`から`materialId -> displayName`を作り、候補と代表に同じ解決済みobjectを使う。

  ```js
  const materialNameById = new Map(
    definitionSet.fragranceMaterials.map(({ materialId, displayName }) => [
      materialId,
      displayName,
    ]),
  );

  const resolveFragrance = (fragrance) => ({
    ...fragrance,
    materialNames: fragrance.materialIds.map((materialId) =>
      materialNameById.get(materialId)),
  });
  ```

  場面へ`iconId`を投影する。定義objectは変更せず、返却前の`frozenCopy()`を維持する。

- [ ] **Step 4: 共有カード要約へ素材名を含める**

  `share-fragrance-summary.js`の厳密入力形を解決済みselector出力へ合わせ、代表3件から`iconId`、`label`、`materialNames`、`accordLabel`だけを抽出する。`description`、効能、使用法、候補2件目は含めない。

  この関数は共有カード画像用である。共有テキスト生成は未実装のT-007範囲なので、本Taskで素材名を共有テキストへ追加しない。

- [ ] **Step 5: focused testをGREENにする**

  Run:

  ```powershell
  node --test app/tests/presentation-selector.test.js app/tests/share-fragrance-summary.test.js
  ```

  Expected: all pass。

- [ ] **Step 6: コミットする**

  ```powershell
  git add app/js/domain/presentation-selector.js app/js/domain/share-fragrance-summary.js app/tests/presentation-selector.test.js app/tests/share-fragrance-summary.test.js
  git commit -m "feat: resolve aroma materials for result and share models"
  ```

---

### Task 6: 香り専用の決定的なMarkdown確認資料を生成する

**Files:**

- Create: `scripts/content/render-kokoro-aroma-review.mjs`
- Create: `app/tests/kokoro-aroma-review.test.js`
- Create: `docs/kokoro-aroma-review.md`
- Modify: `scripts/content/render-presentation-review.mjs`
- Modify: `app/tests/presentation-review-report.test.js`
- Modify: `docs/presentation-content-catalog.md`
- Modify: `package.json`

- [ ] **Step 1: review modelと出力の失敗テストを書く**

  次の公開APIをimportして検査する。

  ```js
  export async function loadKokoroAromaReviewModel({ sourceDir }) {}
  export function renderKokoroAromaReview(model) {}
  ```

  Markdownに次が固定順で含まれることを検査する。

  1. 目的・正典・未承認状態の明記
  2. マスタ変更前後表
  3. 3場面と固定icon
  4. 全29香調のscene/family/素材/短い印象/説明
  5. 全25素材の使用場面
  6. 51称号の3場面×2候補と代表印
  7. 各称号の共有カード代表3件
  8. 香調・素材・family・代表tripleの使用回数
  9. 監査結果「違反0件」
  10. P-1〜P-6の現行status

  CLIを2回実行したbyte列が一致し、コミット済み`docs/kokoro-aroma-review.md`とも一致することを検査する。

- [ ] **Step 2: focused testを実行してREDを確認する**

  Run:

  ```powershell
  node --test app/tests/kokoro-aroma-review.test.js app/tests/presentation-review-report.test.js
  ```

  Expected: new renderer not found、旧件数、旧共有素材除外assertionのいずれかでfail。

- [ ] **Step 3: focused review rendererを実装する**

  `loadPresentationReviewModel()`と`auditFragranceVariation()`を再利用する。変更前後表は承認済み設計の5項目を固定データとして持ち、現行CSVに旧IDがないこと、新IDがあることをloaderで検証する。

  代表候補の表示形式は次に統一する。

  ```text
  ひと息つきたい｜ローマンカモミール｜まろやかな甘みの草花
  ```

  2素材は`・`で連結する。結果説明と共有カード用短文を混同しない。

- [ ] **Step 4: 既存の総合レビューも新契約へ同期する**

  `render-presentation-review.mjs`の素材数表記を1〜2件へ変更する。既存の「共有サマリ」は共有カード用代表として素材名を含める。共有テキストには含めないことを注記する。

  件数assertionを香調29件、素材25件へ更新する。承認gate表示は変更しない。

- [ ] **Step 5: package scriptを追加し、資料を生成する**

  `package.json`へ次を追加する。

  ```json
  "content:review:aroma": "node scripts/content/render-kokoro-aroma-review.mjs --source content/source --output docs/kokoro-aroma-review.md"
  ```

  Run:

  ```powershell
  npm.cmd run content:review:aroma
  node scripts/content/render-presentation-review.mjs --source content/source --output docs/presentation-content-catalog.md
  ```

- [ ] **Step 6: focused testをGREENにする**

  Run:

  ```powershell
  node --test app/tests/kokoro-aroma-review.test.js app/tests/presentation-review-report.test.js
  ```

  Expected: all pass。生成資料に違反0件、P-1〜P-6は現状statusのまま。

- [ ] **Step 7: コミットする**

  ```powershell
  git add scripts/content/render-kokoro-aroma-review.mjs app/tests/kokoro-aroma-review.test.js docs/kokoro-aroma-review.md scripts/content/render-presentation-review.mjs app/tests/presentation-review-report.test.js docs/presentation-content-catalog.md package.json
  git commit -m "docs: generate kokoro aroma review"
  ```

---

### Task 7: 共有カード配色確認ツールへ承認済みの香り3段を反映する

**Files:**

- Modify: `scripts/content/render-palette-preview.mjs`
- Modify: `app/tests/palette-preview-tool.test.js`
- Modify: `docs/palette-preview.html`

- [ ] **Step 1: 共有カード香り欄の失敗テストを書く**

  各簡略カードが称号別の代表3件を使い、次を1回ずつ含むことを検査する。

  ```text
  ココロアロマ
  ～あなたらしさから着想した香り～
  香りをイメージするための素材例です
  ```

  各カードの香り欄には固定順3場面、対応`data-icon-id`、素材名1〜2件、短い香りの印象を含める。旧「香りのヒント」とplaceholderは含めない。共有カード以外のグラフ配色やB濃度は変更しない。

- [ ] **Step 2: focused testを実行してREDを確認する**

  Run:

  ```powershell
  node --test app/tests/palette-preview-tool.test.js
  ```

  Expected: 旧placeholderまたは見出し不一致でfail。

- [ ] **Step 3: 称号別の代表3件をrendererへ渡す**

  palette previewのloaderでcompile済み定義とtitle profileから`selectPresentation()`、`summarizeFragrances()`を呼び、同じ称号の標準・代替1・代替2へ同一の香り3件を渡す。色候補だけが変わり、香り候補は変えない。

- [ ] **Step 4: A案のコンパクト3段を描画する**

  各段は場面名を小、素材名を主、`accordLabel`を補足として描画する。2素材は`・`で連結し、省略記号で切らない。固定iconは`iconId`に対応する抽象的なCSS/SVG記号とし、植物や道具を描かない。

  既存3:5比率、ブランド領域、称号、猫、5因子グラフ、footer、B表示のbackground/surface/accent/text解決を維持する。文字が収まらない場合はrendererが`FRAGRANCE_SHARE_COPY_OVERFLOW`をthrowする。

- [ ] **Step 5: HTMLを再生成しfocused testをGREENにする**

  Run:

  ```powershell
  npm.cmd run content:preview:palettes
  node --test app/tests/palette-preview-tool.test.js
  ```

  Expected: 153カードすべてに3段、overflow 0、all pass。

- [ ] **Step 6: コミットする**

  ```powershell
  git add scripts/content/render-palette-preview.mjs app/tests/palette-preview-tool.test.js docs/palette-preview.html
  git commit -m "feat: show kokoro aroma in card preview"
  ```

---

### Task 8: 正典要件・画面・処理・authoring・タスク台帳を同期する

**Files:**

- Modify: `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md`
- Modify: `docs/screens.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/data-model.md`
- Modify: `docs/content-authoring.md`
- Modify: `docs/tasks.md`
- Modify: `基本設計サマリ.md`

- [ ] **Step 1: 要件正典へ変更履歴を追加する**

  2026-07-31の版を追加し、次を同期する。

  - 素材例は1〜3件から1〜2件へ変更。
  - 結果画面は6候補すべてに素材例を表示。
  - 共有カード画像は代表3件の素材例と短い印象を表示。
  - 共有テキストは素材例を含めない。
  - 見出しは`ココロアロマ`、副題は`～あなたらしさから着想した香り～`。
  - 共通注記は`香りをイメージするための素材例です`。
  - `familyId`8値、固定`iconId`3値、多様性上限を追記。
  - Q-013の構造決定とproduction data未承認を分けて記述。

- [ ] **Step 2: 画面・処理・データモデルを同期する**

  `docs/screens.md`の旧「香りの素材例1〜3件」「共有から除外」を全て修正する。共有カード画像と共有テキストの差を明記する。

  `docs/processing-design.md`へ次を記載する。

  - compilerで`iconId`、`familyId`、素材ID1〜2件を結合。
  - selectorで素材名を解決。
  - 純粋監査の9安定コード。
  - 正式Canvasと結果DOMは未接続。

  `docs/data-model.md`へCSV列とruntime object形を追加する。

- [ ] **Step 3: authoring手順とタスク台帳を同期する**

  `docs/content-authoring.md`へ次のコマンドと確認順を追記する。

  ```powershell
  npm.cmd run content:validate
  npm.cmd run content:review:aroma
  npm.cmd run content:preview:palettes
  ```

  `docs/tasks.md`へ「Q-013 ココロアロマ再整理（2026-07-31）」を追加し、T-005/F-018とT-007/F-011・F-018へ対応付ける。マスタ・監査・review・確認用カードまで完了、P-1〜P-6の人手承認、結果画面、正式共有Canvas、runtime JSON activationは未完了と明記する。

- [ ] **Step 4: 基本設計サマリを同期する**

  利用者向けには、香りが称号から着想した演出であり、具体的な商品・使い方・効果の案内ではないことを簡潔に記載する。

- [ ] **Step 5: stale wordingを検索する**

  Run:

  ```powershell
  rg -n "1〜3|素材例は含めない|共有.*素材例.*除外|香りのヒント" docs content app scripts
  ```

  Expected: 履歴説明や本設計の「旧仕様」引用を除き、現行仕様としての該当0件。

- [ ] **Step 6: コミットする**

  ```powershell
  git add docs/requirements/2026-07-20-big-five-self-understanding-requirements.md docs/screens.md docs/processing-design.md docs/data-model.md docs/content-authoring.md docs/tasks.md 基本設計サマリ.md
  git commit -m "docs: align aroma requirements and authoring"
  ```

---

### Task 9: 全体回帰・生成物一致・変更範囲を検証する

**Files:**

- Verify only unless a test exposes a scoped defect.

- [ ] **Step 1: 香り関連のfocused suiteを実行する**

  Run:

  ```powershell
  node --test app/tests/kokoro-aroma-content.test.js app/tests/fragrance-variation.test.js app/tests/fragrance-rebalance-proposal.test.js app/tests/kokoro-aroma-review.test.js app/tests/content-presentation-character-compiler.test.js app/tests/presentation-definition.test.js app/tests/presentation-selector.test.js app/tests/share-fragrance-summary.test.js app/tests/presentation-review-report.test.js app/tests/palette-preview-tool.test.js
  ```

  Expected: all pass。

- [ ] **Step 2: 全テストと静的検証を実行する**

  Run:

  ```powershell
  npm.cmd test
  npm.cmd run check
  npm.cmd run content:validate
  npm.cmd run qa:preview:build
  ```

  Expected:

  - tests: fail 0
  - static check: fail 0
  - content validation: error 0。approved release未選択、Q-012、Q-013の既知warningは許容
  - QA preview build: success

- [ ] **Step 3: 生成物の再現性を検証する**

  Run:

  ```powershell
  npm.cmd run content:review:aroma
  npm.cmd run content:preview:palettes
  git diff --exit-code -- docs/kokoro-aroma-review.md docs/presentation-content-catalog.md docs/palette-preview.html
  ```

  Expected: diff 0。

- [ ] **Step 4: 承認状態と変更禁止範囲を検証する**

  Run:

  ```powershell
  git diff 67b540c -- content/source/approvals content/source/presentation/presentation-v2/palettes.csv content/source/presentation/presentation-v2/palette-usage-mappings.csv app/js/domain/scoring.js
  git diff --check
  git status --short
  ```

  Expected:

  - approvals、パレット、採点に差分なし
  - whitespace error 0
  - 意図したファイル以外の未追跡・未コミット差分なし

- [ ] **Step 5: 最終コミットが必要な場合だけ行う**

  検証で生成物または記録だけが更新された場合:

  ```powershell
  git add docs/kokoro-aroma-review.md docs/presentation-content-catalog.md docs/palette-preview.html docs/tasks.md
  git commit -m "chore: finalize kokoro aroma verification"
  ```

  変更がなければ空コミットを作らない。

- [ ] **Step 6: 引き渡し結果をまとめる**

  次を報告する。

  - 香調29件、素材25件、selector 306行
  - 多様性・禁止表現・共有文字量finding 0
  - 変更したマスタIDと追加ID
  - `docs/kokoro-aroma-review.md`と`docs/palette-preview.html`の場所
  - 全検証コマンドと結果
  - P-1〜P-6、正式結果UI、正式共有Canvas、runtime JSON activationは未完了

