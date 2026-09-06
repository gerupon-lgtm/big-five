# 共有カード配色確認プレビュー実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** P-0の全153配色を、ココロパレアの正式共有カードをイメージしやすい3:5簡略カードと固定ブランド5色グラフで確認できる、外部通信なしの単一HTMLへ更新する。

**Architecture:** 共有カード確認専用の版付き定義を小さなES Moduleへ分離し、固定因子色、同系濃色、見本スコア、代表猫注記を一元管理する。既存のCSV読込・用途色解決・ブラウザ内一時編集は維持し、生成器だけが代表猫を1つのData URLとして読み込み、全153枚から再利用する。

**Tech Stack:** JavaScript ES Modules、HTML/CSS、Node.js `node:test`、Node.js標準`fs`／`path`／`vm`。

## Global Constraints

- 対応タスクは`T-005`、対応機能は`F-008`、`F-011`、`F-018`とする。
- 直近の変更対象は確認用ツール`docs/palette-preview.html`だけとし、正式共有カードのCanvasレンダラーとS-003／S-004のレーダーチャートを変更しない。
- プレビュー本体の比率は`3:5`とし、スマートフォンで横スクロールを発生させない。
- 表示順は既存`FACTOR_ORDER`の知性・想像力、勤勉性、外向性、協調性、情緒安定性を維持する。
- 固定塗り色は、知性・想像力`#ADA1C0`、勤勉性`#7399B1`、外向性`#9BA789`、協調性`#E38543`、情緒安定性`#A5B6BA`とする。
- 同系濃色は、知性・想像力`#6F677B`、勤勉性`#536E7F`、外向性`#656D59`、協調性`#9A5A2E`、情緒安定性`#616B6E`とする。黒から白92%混合時の最暗背景`#EBEBEB`に対して4.5:1以上を満たす。
- 見本スコアは、知性・想像力60、勤勉性58、外向性52、協調性56、情緒安定性54に固定する。
- 代表猫は`docs/assets/character-production/source-png/character-balanced.png`を縦横比維持・全体表示し、再配色、トリミング、反転、変形しない。
- 代表猫の利用をQ-012の承認、正式releaseへの採用、称号別の正式猫対応として扱わない。
- 代表猫の画像データは単一HTMLへ1回だけ埋め込み、153枚へBase64文字列を重複させない。
- Q-013の`palettes.csv`、`palette-usage-mappings.csv`、P-0の`draft`状態を変更しない。
- 基調色編集、検索、「標準のみ」「要確認のみ」、変更一覧、リセット、用途色とWCAG比率の表示を維持する。
- 共有カード用の固定5色は背景編集で変えず、既存のパレット由来`chart`用途色はP-0確認値として別表示を維持する。
- 外部画像、外部フォント、`fetch`、外部script、外部stylesheetを追加しない。

---

### Task 1: 版付き共有カードプレビュー定義

**Files:**
- Create: `scripts/content/share-card-preview-definition.mjs`
- Modify: `app/tests/palette-preview-tool.test.js`

**Interfaces:**
- Consumes: `FACTOR_ORDER` from `app/js/config/factor-order.js`、`contrastRatio(foreground, background)` from `app/js/domain/palette-usage.js`。
- Produces: `shareCardPreviewDefinition` with exact fields `version`, `representativeCatSource`, `representativeCatNotice`, `modeLabel`, `fragrancePlaceholders`, `factors`。
- Produces: `validateShareCardPreviewDefinition(definition)`。不正時は`TypeError("SHARE_CARD_PREVIEW_INVALID")`、正当時は`true`を返す。

- [ ] **Step 1: 定義契約の失敗テストを書く**

`app/tests/palette-preview-tool.test.js`へ次を追加する。

```js
import { FACTOR_ORDER } from "../js/config/factor-order.js";
import {
  shareCardPreviewDefinition,
  validateShareCardPreviewDefinition,
} from "../../scripts/content/share-card-preview-definition.mjs";

test("share-card preview definition fixes factor colors and sample values", () => {
  assert.equal(shareCardPreviewDefinition.version, "share-card-preview-v1");
  assert.equal(
    shareCardPreviewDefinition.representativeCatSource,
    "docs/assets/character-production/source-png/character-balanced.png",
  );
  assert.equal(
    shareCardPreviewDefinition.representativeCatNotice,
    "色・配置確認用の代表猫です。称号ごとの正式な猫ではありません。",
  );
  assert.deepEqual(
    shareCardPreviewDefinition.factors.map(({ factorId }) => factorId),
    [...FACTOR_ORDER],
  );
  assert.deepEqual(
    shareCardPreviewDefinition.factors.map(
      ({ factorId, label, value, fill, tone }) =>
        [factorId, label, value, fill, tone],
    ),
    [
      ["intellectImagination", "知性・想像力", 60, "#ADA1C0", "#6F677B"],
      ["conscientiousness", "勤勉性", 58, "#7399B1", "#536E7F"],
      ["extraversion", "外向性", 52, "#9BA789", "#656D59"],
      ["agreeableness", "協調性", 56, "#E38543", "#9A5A2E"],
      ["emotionalStability", "情緒安定性", 54, "#A5B6BA", "#616B6E"],
    ],
  );
  for (const factor of shareCardPreviewDefinition.factors) {
    assert.ok(contrastRatio(factor.tone, "#EBEBEB") >= 4.5);
  }
  assert.equal(
    validateShareCardPreviewDefinition(shareCardPreviewDefinition),
    true,
  );
});

test("share-card preview definition rejects malformed factors", () => {
  const invalid = structuredClone(shareCardPreviewDefinition);
  invalid.factors[1].factorId = invalid.factors[0].factorId;
  assert.throws(
    () => validateShareCardPreviewDefinition(invalid),
    { name: "TypeError", message: "SHARE_CARD_PREVIEW_INVALID" },
  );
});
```

- [ ] **Step 2: REDを確認する**

Run:

```powershell
node --test app/tests/palette-preview-tool.test.js
```

Expected: `ERR_MODULE_NOT_FOUND` for `share-card-preview-definition.mjs`。

- [ ] **Step 3: 最小の版付き定義を実装する**

`scripts/content/share-card-preview-definition.mjs`を次の構造で作成する。

```js
import { FACTOR_ORDER } from "../../app/js/config/factor-order.js";

const HEX_COLOR = /^#[0-9A-F]{6}$/;
const EXACT_FIELDS = [
  "version",
  "representativeCatSource",
  "representativeCatNotice",
  "modeLabel",
  "fragrancePlaceholders",
  "factors",
];
const FACTOR_FIELDS = ["factorId", "label", "value", "fill", "tone"];

function invalidDefinition() {
  throw new TypeError("SHARE_CARD_PREVIEW_INVALID");
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

export function validateShareCardPreviewDefinition(definition) {
  if (!definition || typeof definition !== "object" ||
    Object.keys(definition).length !== EXACT_FIELDS.length ||
    !EXACT_FIELDS.every((field) => Object.hasOwn(definition, field)) ||
    definition.version !== "share-card-preview-v1" ||
    definition.representativeCatSource !==
      "docs/assets/character-production/source-png/character-balanced.png" ||
    typeof definition.representativeCatNotice !== "string" ||
    definition.modeLabel !== "50問 詳細結果" ||
    !Array.isArray(definition.fragrancePlaceholders) ||
    definition.fragrancePlaceholders.length !== 3 ||
    !definition.fragrancePlaceholders.every((value) =>
      typeof value === "string" && value.length > 0) ||
    !Array.isArray(definition.factors) ||
    definition.factors.length !== FACTOR_ORDER.length ||
    definition.factors.some((factor, index) =>
      !factor || typeof factor !== "object" ||
      Object.keys(factor).length !== FACTOR_FIELDS.length ||
      !FACTOR_FIELDS.every((field) => Object.hasOwn(factor, field)) ||
      factor.factorId !== FACTOR_ORDER[index] ||
      typeof factor.label !== "string" ||
      !Number.isInteger(factor.value) ||
      factor.value < 0 || factor.value > 100 ||
      !HEX_COLOR.test(factor.fill) ||
      !HEX_COLOR.test(factor.tone))) {
    invalidDefinition();
  }
  return true;
}

export const shareCardPreviewDefinition = deepFreeze({
  version: "share-card-preview-v1",
  representativeCatSource:
    "docs/assets/character-production/source-png/character-balanced.png",
  representativeCatNotice:
    "色・配置確認用の代表猫です。称号ごとの正式な猫ではありません。",
  modeLabel: "50問 詳細結果",
  fragrancePlaceholders: [
    "ひと息つく場面",
    "気持ちを整える場面",
    "静かに集中する場面",
  ],
  factors: [
    {
      factorId: "intellectImagination",
      label: "知性・想像力",
      value: 60,
      fill: "#ADA1C0",
      tone: "#6F677B",
    },
    {
      factorId: "conscientiousness",
      label: "勤勉性",
      value: 58,
      fill: "#7399B1",
      tone: "#536E7F",
    },
    {
      factorId: "extraversion",
      label: "外向性",
      value: 52,
      fill: "#9BA789",
      tone: "#656D59",
    },
    {
      factorId: "agreeableness",
      label: "協調性",
      value: 56,
      fill: "#E38543",
      tone: "#9A5A2E",
    },
    {
      factorId: "emotionalStability",
      label: "情緒安定性",
      value: 54,
      fill: "#A5B6BA",
      tone: "#616B6E",
    },
  ],
});

validateShareCardPreviewDefinition(shareCardPreviewDefinition);
```

- [ ] **Step 4: GREENを確認する**

Run:

```powershell
node --test app/tests/palette-preview-tool.test.js
```

Expected: 既存5件と追加2件がすべてPASS。

- [ ] **Step 5: Task 1をコミットする**

```powershell
git add scripts/content/share-card-preview-definition.mjs app/tests/palette-preview-tool.test.js
git commit -m "feat: define share card preview colors"
```

---

### Task 2: 3:5簡略共有カードを単一HTMLへ描画

**Files:**
- Modify: `scripts/content/render-palette-preview.mjs`
- Modify: `app/tests/palette-preview-tool.test.js`
- Regenerate: `docs/palette-preview.html`

**Interfaces:**
- Consumes: `shareCardPreviewDefinition` and `validateShareCardPreviewDefinition` from Task 1、`appMeta.brand` and `appMeta.appVersion` from `app/js/config/app-meta.js`。
- Changes: `loadPalettePreviewModel({ sourceDir, representativeCatPath? })`。省略時はプロジェクトルートと`representativeCatSource`から既定PNGを解決する。
- Produces: model field `shareCardPreview` with exact fields `definition`, `representativeCatDataUrl`, `brandName`, `cardSubtitle`, `appVersion`。
- Produces: 各`palette-preview-card`内に1件の`.share-card-preview`、5件の`.preview-factor-row`、3件の`.preview-fragrance-row`。

- [ ] **Step 1: 3:5カードと単一画像埋め込みの失敗テストを書く**

既存の`"P-0 preview is one offline HTML file with all interactive cards"`へ次を追加する。

```js
assert.equal(
  (html.match(/class="share-card-preview"/g) ?? []).length,
  153,
);
assert.equal(
  (html.match(/class="preview-factor-row"/g) ?? []).length,
  153 * 5,
);
assert.equal(
  (html.match(/class="preview-fragrance-row"/g) ?? []).length,
  153 * 3,
);
assert.equal(
  (html.match(/data:image\/png;base64,/g) ?? []).length,
  1,
);
assert.equal(
  (html.match(/href="#kokoro-parea-preview-mark"/g) ?? []).length,
  153,
);
assert.match(html, /aspect-ratio:\s*3\s*\/\s*5/);
assert.match(html, /配色確認用の簡略プレビュー/);
assert.match(
  html,
  /色・配置確認用の代表猫です。称号ごとの正式な猫ではありません。/,
);
assert.match(html, /data-factor-id="intellectImagination"/);
assert.match(html, /--factor-fill:#ADA1C0;--factor-tone:#6F677B/);
assert.match(html, /パレット由来のグラフ用途色/);
```

画像読込失敗の安定化テストも追加する。

```js
await assert.rejects(
  () => loadPalettePreviewModel({
    sourceDir: SOURCE_DIR,
    representativeCatPath: path.join(ROOT, "missing-cat.png"),
  }),
  { name: "TypeError", message: "PALETTE_PREVIEW_INVALID" },
);
```

- [ ] **Step 2: REDを確認する**

Run:

```powershell
node --test app/tests/palette-preview-tool.test.js
```

Expected: `.share-card-preview`が0件、Data URLが0件、欠落画像が`ENOENT`のままなのでFAIL。

- [ ] **Step 3: 代表猫をモデルへ1回だけ読み込む**

`scripts/content/render-palette-preview.mjs`で`readFile`、`appMeta`、Task 1の定義をimportし、次の境界を実装する。

```js
const PROJECT_ROOT = path.resolve(import.meta.dirname, "../..");

export async function loadPalettePreviewModel({
  sourceDir,
  representativeCatPath = path.join(
    PROJECT_ROOT,
    shareCardPreviewDefinition.representativeCatSource,
  ),
} = {}) {
  if (typeof sourceDir !== "string" || sourceDir === "") invalidPreview();
  validateShareCardPreviewDefinition(shareCardPreviewDefinition);

  let representativeCat;
  try {
    representativeCat = await readFile(representativeCatPath);
  } catch {
    invalidPreview();
  }
  if (representativeCat.length === 0) invalidPreview();
}
```

`fs/promises` importは次に変更する。

```js
import { readFile, writeFile } from "node:fs/promises";
```

既存のreview読込と153件projectionの後、現在のreturn objectへ次のfieldを追加する。

```js
shareCardPreview: Object.freeze({
  definition: shareCardPreviewDefinition,
  representativeCatDataUrl:
    `data:image/png;base64,${representativeCat.toString("base64")}`,
  brandName: appMeta.brand.name,
  cardSubtitle: appMeta.brand.cardSubtitle,
  appVersion: appMeta.appVersion,
}),
```

`renderPalettePreview(model)`の入力検証へ、`shareCardPreview`、Data URL prefix、ブランド名、サブタイトル、版の完全性検査を追加し、不正時は`PALETTE_PREVIEW_INVALID`へ統一する。

- [ ] **Step 4: ブランドSVG symbolと縦長カードmarkupを実装する**

HTMLの`body`先頭に次の1個のsymbolを置き、各カードは`use`で参照する。

```html
<svg class="svg-definitions" aria-hidden="true">
  <symbol id="kokoro-parea-preview-mark" viewBox="0 0 120 120">
    <rect x="2" y="2" width="116" height="116" rx="28" fill="#26705C"></rect>
    <path d="M60 17 C48 17 43 29 47 39 C50 47 60 54 60 54 C60 54 70 47 73 39 C77 29 72 17 60 17Z" fill="#F0B06C"></path>
    <path d="M60 17 C48 17 43 29 47 39 C50 47 60 54 60 54 C60 54 70 47 73 39 C77 29 72 17 60 17Z" fill="#DF7F68" transform="rotate(72 60 60)"></path>
    <path d="M60 17 C48 17 43 29 47 39 C50 47 60 54 60 54 C60 54 70 47 73 39 C77 29 72 17 60 17Z" fill="#A98DB5" transform="rotate(144 60 60)"></path>
    <path d="M60 17 C48 17 43 29 47 39 C50 47 60 54 60 54 C60 54 70 47 73 39 C77 29 72 17 60 17Z" fill="#6B98AB" transform="rotate(216 60 60)"></path>
    <path d="M60 17 C48 17 43 29 47 39 C50 47 60 54 60 54 C60 54 70 47 73 39 C77 29 72 17 60 17Z" fill="#82AD90" transform="rotate(288 60 60)"></path>
    <circle cx="60" cy="60" r="10.5" fill="#FFF9ED"></circle>
  </symbol>
</svg>
```

`paletteCard(entry, shareCardPreview)`へ変更し、横長`.mini-result`を次の3:5構造へ置き換える。

```js
function factorRow(factor) {
  return `
    <div class="preview-factor-row"
      data-factor-id="${factor.factorId}"
      style="--factor-fill:${factor.fill};--factor-tone:${factor.tone}">
      <span class="preview-factor-label">${factor.label}</span>
      <span class="preview-factor-track">
        <span class="preview-factor-value"
          style="width:${factor.value}%"></span>
      </span>
      <strong>${factor.value}</strong>
    </div>`;
}

function shareCardPreview(entry, preview) {
  return `
    <section class="share-card-preview"
      aria-label="${escapeHtml(`${entry.titleLabel} ${entry.paletteLabel}の配色確認用簡略プレビュー`)}">
      <p class="preview-only-label">配色確認用の簡略プレビュー</p>
      <div class="preview-brand">
        <svg aria-hidden="true"><use href="#kokoro-parea-preview-mark"></use></svg>
        <div><strong>${escapeHtml(preview.brandName)}</strong>
        <small>${escapeHtml(preview.cardSubtitle)}</small></div>
      </div>
      <p class="preview-title-kicker">あなたの称号</p>
      <h3>${escapeHtml(entry.titleLabel)}</h3>
      <p class="preview-description">${escapeHtml(entry.description)}</p>
      <div class="preview-cat" role="img"
        aria-label="色と配置を確認するための代表猫"></div>
      <p class="preview-cat-notice">
        ${escapeHtml(preview.definition.representativeCatNotice)}
      </p>
      <div class="preview-factors">
        ${preview.definition.factors.map(factorRow).join("")}
      </div>
      <div class="preview-fragrances" aria-label="香り欄の配置見本">
        ${preview.definition.fragrancePlaceholders.map((label) =>
          `<div class="preview-fragrance-row"><span>${escapeHtml(label)}</span><i></i></div>`).join("")}
      </div>
      <p class="preview-disclaimer">
        これは性格の優劣や心理学上の正式なタイプを示すものではありません。
      </p>
      <p class="preview-mode">${escapeHtml(preview.definition.modeLabel)}</p>
      <p class="preview-version">${escapeHtml(preview.appVersion)}</p>
    </section>`;
}
```

- [ ] **Step 5: 3:5 CSSと配色連動を実装する**

Data URLは`previewStyles(shareCardPreview)`のCSSへ1回だけ置く。

```css
.share-card-preview {
  aspect-ratio: 3 / 5;
  width: min(100%, 18rem);
  margin-inline: auto;
  padding: 0.75rem;
  overflow: hidden;
  color: var(--preview-text);
  background: var(--preview-bg);
  border: 1px solid var(--preview-accent);
  border-radius: 1.25rem;
  box-shadow: 0 0.5rem 1.2rem rgba(31, 36, 48, 0.12);
}
.preview-cat {
  width: 62%;
  aspect-ratio: 1;
  margin-inline: auto;
  background-image: var(--representative-cat);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
.preview-factor-row {
  display: grid;
  grid-template-columns: 4.9rem 1fr 1.6rem;
  gap: 0.35rem;
  align-items: center;
  color: var(--factor-tone);
}
.preview-factor-track {
  height: 0.55rem;
  overflow: hidden;
  border: 1px solid var(--factor-tone);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
}
.preview-factor-value {
  display: block;
  height: 100%;
  background: var(--factor-fill);
}
```

`previewStyles`の先頭で次を1回だけ生成する。

```js
const representativeCatCss = preview.representativeCatDataUrl
  .replaceAll("\\", "\\\\")
  .replaceAll('"', '\\"');
return `
  :root {
    --representative-cat: url("${representativeCatCss}");
  }
  /* 残りのCSS */
`;
```

既存`renderCard`は背景、表面、アクセント、文字、P-0用途色swatchと比率だけを更新する。`.preview-factor-row`の`--factor-fill`、`--factor-tone`、見本スコアを変更する処理を追加しない。既存のresolved gridでは`グラフ`を`パレット由来のグラフ用途色`へ改称する。

- [ ] **Step 6: GREENと決定性を確認する**

Run:

```powershell
node --test app/tests/palette-preview-tool.test.js
npm.cmd run content:preview:palettes
node --test app/tests/palette-preview-tool.test.js
```

Expected: focused tests PASS。再生成後の`docs/palette-preview.html`が生成器出力とbyte一致し、Data URLは1件、カード153件、因子行765件、香り配置行459件。

- [ ] **Step 7: Task 2をコミットする**

```powershell
git add scripts/content/render-palette-preview.mjs app/tests/palette-preview-tool.test.js docs/palette-preview.html
git commit -m "feat: preview palettes as share cards"
```

---

### Task 3: 文書同期と最終検証

**Files:**
- Modify: `docs/content-authoring.md`
- Modify: `docs/superpowers/plans/2026-07-25-q013-presentation-content.md`
- Modify: `docs/tasks.md`
- Regenerate: `docs/palette-preview.html`

**Interfaces:**
- Preserves: P-0 and all Q-013 source rows remain`draft` with blank approval metadata。
- Documents: 3:5簡略共有カード、代表猫は色・配置確認専用、固定5因子色、パレット由来`chart`用途色は別表示、単一HTMLはCSVへ書き戻さない。

- [ ] **Step 1: 作成手順とタスク記録を更新する**

`docs/content-authoring.md`のP-0節を次の内容へ更新する。

```markdown
出力先は`docs/palette-preview.html`です。ブラウザで直接開くと、51称号×3候補＝153配色を、3:5の簡略共有カードとして確認できます。背景・表面・差し色はQ-013用途色、5因子の横棒は共有カード用の固定ブランド5色です。代表猫、見本スコア、香り欄は色と配置の確認専用であり、正式な診断結果、称号別の猫、正式共有カードではありません。
```

`docs/superpowers/plans/2026-07-25-q013-presentation-content.md`のTask 6 Step 1に、3:5簡略共有カード、固定5因子色、代表猫の確認専用注記を追記する。`docs/tasks.md`のT-005 Q-013記録と未対応表には、P-0向け単一HTMLが3:5簡略共有カードで確認可能であることを記録する。P-0の状態を`approved`へ変更しない。

- [ ] **Step 2: focused検証を実行する**

Run:

```powershell
npm.cmd run content:preview:palettes
node --test app/tests/palette-preview-tool.test.js app/tests/palette-usage.test.js app/tests/presentation-review-report.test.js
npm.cmd run content:validate
```

Expected: tests PASS。validationは構造エラー0件で、P-0〜P-6の未承認、`RELEASE_NOT_SELECTED`、Q-012 formal release未選択の既存警告を維持する。

- [ ] **Step 3: 全体回帰を実行する**

Run:

```powershell
npm.cmd test
npm.cmd run check
git diff --check
```

Expected: 全テストPASS、静的検証PASS、diff check PASS。

- [ ] **Step 4: 目視確認を行う**

`docs/palette-preview.html`を通常ブラウザで開き、次を確認する。

1. 360px相当で横スクロールがなく、3:5カード全体が幅内へ縮小される。
2. 標準のみの51件と全153件の切替が動く。
3. 代表猫、称号、固定5色バー、香り欄、注意書き、モード、版がカード内に収まる。
4. Primary／Secondary／Accentを変更すると背景・表面・装飾・用途色swatchが変わる。
5. 5因子の塗り色、同系濃色、見本スコア、代表猫は基調色編集で変わらない。
6. 「変更一覧」と個別／全体リセットが動く。
7. 外部通信が0件である。

- [ ] **Step 5: Task 3をコミットする**

```powershell
git add docs/content-authoring.md docs/superpowers/plans/2026-07-25-q013-presentation-content.md docs/tasks.md docs/palette-preview.html
git commit -m "docs: explain share card palette preview"
```

---

## Final Verification Gate

Run:

```powershell
node --test app/tests/palette-preview-tool.test.js app/tests/palette-usage.test.js app/tests/presentation-review-report.test.js
npm.cmd run content:preview:palettes
npm.cmd run content:validate
npm.cmd test
npm.cmd run check
git diff --check
git status --short
```

Expected:

- 全テストと静的検証がPASSする。
- `docs/palette-preview.html`は生成器出力とbyte一致する。
- P-0とQ-013 source rowは`draft`のままで、承認者・承認日は空欄である。
- 生成HTMLは外部通信なしの単一ファイルで、代表猫Data URLを1件だけ含む。
- 作業ツリーはcleanである。
