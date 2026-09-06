# ココロパレア ブランド・共有カード実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 正式名称・確定アイコン・公開URLをアプリへ統合し、結果の選択色と香り3件を使った1080×1800 PNG共有カードを、スマートフォンで無スクロール確認して共有・保存・コピーできるようにする。

**Architecture:** ブランド情報は版付き設定と1つのSVGを正典にし、ヘッダー、HTML metadata、Manifest、共有カードへ参照させる。共有は`ResultSnapshot + Q-013 presentation + CharacterManifestEntry`から純粋な`ShareCardModel`を生成し、Canvasレンダラー、S-005画面、ブラウザ共有能力を分離する。通常版は同一origin資産だけを読み、`connect-src 'none'`と外部送信0件を維持する。

**Tech Stack:** HTML / CSS / JavaScript ES Modules、Canvas 2D、Web Share、Clipboard、Object URL、Web App Manifest、Node.js `node:test`、Sharp 0.35.3。

## Global Constraints

- 対応タスクは`T-007`、対応機能は`F-001`、`F-011`、`F-012`、`F-014`、`F-015`、`F-016`、`F-018`とする。
- アプリ名は`ココロパレア`、画面用サブタイトルは`Big Five 自己理解支援ツール`、カード用サブタイトルは`～Big Five 自己理解支援ツール～`とする。
- 正式公開URLは`https://kokoroparea.gerupon.uk`とする。個別結果URL、公開ID、QRコードは作らない。
- ブランドアイコンは`viewBox="0 0 120 120"`、背景`#26705C`、固定5色の花びら、中央`#FFF9ED`・半径`10.5`の円とする。ハート、文字、数字を置かない。
- 花びらpathは`M60 17 C48 17 43 29 47 39 C50 47 60 54 60 54 C60 54 70 47 73 39 C77 29 72 17 60 17Z`とし、中心`60,60`で`0/72/144/216/288deg`回転する。
- 花びら色は順に`#F0B06C`、`#DF7F68`、`#A98DB5`、`#6B98AB`、`#82AD90`とする。
- 診断中は現行の淡い緑と白を維持し、五色は共通ヘッダーのアイコンだけに使う。水彩・植物装飾を設問画面へ追加しない。
- 色選択はカード表現だけを変え、スコア、称号、猫、結果文、香り候補を変更しない。
- 共有カードは縦`3:5`、固定`1080×1800`、PNGのみとする。端末のdevice pixel ratioで論理寸法を変えない。
- 猫は`contain`で全体表示し、トリミング、再配色、反転、変形をしない。
- カードへ生回答、氏名、端末情報、`titleReflection`、香り素材例、公開結果URL、アプリ入口URLを含めない。
- 香りは固定`pause/reset/quiet-focus`各1件、合計3件だけをカードへ表示する。
- S-005の初期ペインは`320×480`以上の縦画面で、ヘッダー、カード全体、主要操作をスクロールなしで表示する。
- 共有テキスト詳細は別ペインで縦スクロールを許可し、拡大表示のパン・スクロールは利用者操作後だけ許可する。
- 共有キャンセルは失敗通知にしない。Canvasや共有APIが失敗しても、共有テキストのコピーまたは選択へ到達できるようにする。
- `app/`から外部へ通信しない。`connect-src 'none'`、生回答非送信、通常版の外部送信0件を維持する。
- Q-013の承認事実を補完しない。未承認の色・香り・素材・selectorをruntimeへ仮置きしない。

## Q-013開始ゲート

Task 1〜2は直ちに実行できる。Task 3以降は、次がすべて存在し、人手承認記録と自動検証を通った時だけ開始する。

- `PresentationDefinitionSet.schemaVersion === 2`
- `appMeta.presentationDefinitionVersion === "presentation-v2"`
- 承認済み`PaletteDefinitions`
- 承認済み`PaletteUsageMappingDefinitions`
- 承認済み`FragranceSuggestions`
- 承認済み`FragranceMaterialDefinitions`
- 51件の承認済みselector
- `selectPresentation(titleProfile, definitionSet)`
- `resolvePaletteUsage(palette, mapping)`
- `summarizeFragrances(fragranceScenes)`

不足している場合はTask 2完了後に停止し、`docs/superpowers/plans/2026-07-25-q013-presentation-content.md`を`presentation-v2`と香り素材正典へ同期してからQ-013を実行する。承認前のレコードを`approved`へ変更して先へ進まない。

## File Structure

- `app/js/config/app-meta.js` — アプリ版とブランド正典。
- `app/assets/brand/kokoro-parea-mark.svg` — すべての用途が参照する確定アイコン。
- `scripts/brand/build-brand-icons.mjs` — SVGから192/512 PNGを決定的に生成。
- `app/manifest/app.webmanifest` — PWA名称、start URL、同一originアイコン。
- `app/js/domain/result-palette-selection.js` — 診断値を変えない選択色更新。
- `app/js/domain/share-card-model.js` — DOM/Canvas非依存の共有モデル。
- `app/js/domain/share-card-visibility.js` — 画像画素と背景色から視認性補助を決定。
- `app/js/presentation/share-card-renderer.js` — 固定1080×1800 Canvas描画。
- `app/js/infrastructure/share-delivery.js` — Web Share、Download、Clipboardの能力分岐。
- `app/js/presentation/share-screen.js` — S-005のカード・詳細・拡大ペイン。
- `app/js/infrastructure/router.js` / `app/js/main.js` — `#/share?resultId=...`の接続。
- `app/css/styles.css` — ブランドヘッダー、結果の色選択、S-005レスポンシブ。

---

### Task 1: ブランド正典・確定SVG・共通ヘッダー

**Files:**
- Create: `app/assets/brand/kokoro-parea-mark.svg`
- Modify: `app/js/config/app-meta.js`
- Modify: `app/js/presentation/app-header.js`
- Modify: `app/css/styles.css`
- Modify: `app/tests/app-header.test.js`
- Modify: `app/tests/frontend-tone.test.js`
- Modify: `app/tests/version-contract.test.js`

**Interfaces:**
- Produces: `appMeta.brand` with exact fields `{ version, name, subtitle, cardSubtitle, publicOrigin, iconPath }`.
- Produces: one decorative `<img class="app-mark">` from the canonical SVG.
- Consumes: no diagnosis, result, palette, character, storage, or network state.

- [ ] **Step 1: Write the failing brand/header tests**

```js
assert.deepEqual(appMeta.brand, {
  version: "brand-v1",
  name: "ココロパレア",
  subtitle: "Big Five 自己理解支援ツール",
  cardSubtitle: "～Big Five 自己理解支援ツール～",
  publicOrigin: "https://kokoroparea.gerupon.uk",
  iconPath: "./assets/brand/kokoro-parea-mark.svg",
});

const mark = collectElements(header).find(({ className }) => className === "app-mark");
assert.equal(mark.tagName, "img");
assert.equal(mark.getAttribute("src"), "./assets/brand/kokoro-parea-mark.svg");
assert.equal(mark.getAttribute("alt"), "");
assert.deepEqual(brandCopy, ["ココロパレア", "Big Five 自己理解支援ツール"]);
assert.doesNotMatch(collectText(header), /Big Five 自己理解チェック|BIG FIVE SELF UNDERSTANDING|^5$/);
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `node --test app/tests/app-header.test.js app/tests/version-contract.test.js`

Expected: FAIL because `appMeta.brand` and the SVG image do not exist.

- [ ] **Step 3: Add the exact SVG and frozen brand metadata**

```js
const brand = Object.freeze({
  version: "brand-v1",
  name: "ココロパレア",
  subtitle: "Big Five 自己理解支援ツール",
  cardSubtitle: "～Big Five 自己理解支援ツール～",
  publicOrigin: "https://kokoroparea.gerupon.uk",
  iconPath: "./assets/brand/kokoro-parea-mark.svg",
});

export const appMeta = Object.freeze({
  // existing fields stay byte-for-byte unchanged
  brand,
});
```

The SVG must contain the exact background, path, rotations, colors, and center circle from Global Constraints. Do not copy the comparison-board SVG or its labels.

- [ ] **Step 4: Render the header from `appMeta.brand`**

```js
const mark = documentObject.createElement("img");
mark.className = "app-mark";
mark.setAttribute("src", appMeta.brand.iconPath);
mark.setAttribute("alt", "");
mark.setAttribute("width", "120");
mark.setAttribute("height", "120");
brand.append(mark);
appendTextElement(brandCopy, "span", appMeta.brand.name, "app-brand-name");
appendTextElement(brandCopy, "span", appMeta.brand.subtitle, "app-brand-subtitle");
```

Keep the approved `38/34/32px` responsive sizes. Change `.app-mark` from a text badge to an image box with `display: block; object-fit: contain; flex: 0 0 auto;`; do not add padding, recolor filters, or a second background.

- [ ] **Step 5: Run focused and full tests**

Run: `node --test app/tests/app-header.test.js app/tests/frontend-tone.test.js app/tests/version-contract.test.js`

Expected: PASS.

Run: `npm.cmd test`

Expected: PASS without changing existing diagnostic version tuples.

- [ ] **Step 6: Commit Task 1**

```powershell
git add app/assets/brand/kokoro-parea-mark.svg app/js/config/app-meta.js app/js/presentation/app-header.js app/css/styles.css app/tests/app-header.test.js app/tests/frontend-tone.test.js app/tests/version-contract.test.js
git commit -m "feat: add kokoro parea brand header"
```

---

### Task 2: HTML metadata・Manifest・決定的アイコン生成

**Files:**
- Create: `scripts/brand/build-brand-icons.mjs`
- Create: `app/assets/brand/kokoro-parea-icon-192.png`
- Create: `app/assets/brand/kokoro-parea-icon-512.png`
- Create: `app/manifest/app.webmanifest`
- Create: `app/tests/brand-assets.test.js`
- Modify: `app/index.html`
- Modify: `package.json`

**Interfaces:**
- Consumes: `app/assets/brand/kokoro-parea-mark.svg`.
- Produces: `npm.cmd run brand:build`.
- Produces: PNG icons with exact `192×192` and `512×512` dimensions.
- Produces: Manifest `name`, `short_name`, `start_url`, `display`, `icons`.

- [ ] **Step 1: Add failing metadata and asset tests**

```js
const manifest = JSON.parse(await readFile("app/manifest/app.webmanifest", "utf8"));
assert.equal(manifest.name, "ココロパレア");
assert.equal(manifest.short_name, "ココロパレア");
assert.equal(manifest.start_url, "../#/start");
assert.equal(manifest.display, "standalone");
assert.deepEqual(manifest.icons.map(({ sizes }) => sizes), ["192x192", "512x512"]);

for (const [path, width] of [
  ["app/assets/brand/kokoro-parea-icon-192.png", 192],
  ["app/assets/brand/kokoro-parea-icon-512.png", 512],
]) {
  const metadata = await sharp(path).metadata();
  assert.deepEqual([metadata.width, metadata.height, metadata.format], [width, width, "png"]);
}
```

Also assert `index.html` contains the exact title, description, canonical URL, Manifest link, SVG favicon, and no `gerupo.uk` or `kokoropalea`.

- [ ] **Step 2: Run and verify RED**

Run: `node --test app/tests/brand-assets.test.js`

Expected: FAIL with missing Manifest/icons.

- [ ] **Step 3: Implement the Sharp builder**

```js
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(
  new URL("../../app/assets/brand/kokoro-parea-mark.svg", import.meta.url),
);
for (const size of [192, 512]) {
  const output = fileURLToPath(
    new URL(`../../app/assets/brand/kokoro-parea-icon-${size}.png`, import.meta.url),
  );
  await sharp(source).resize(size, size).png({ compressionLevel: 9 }).toFile(output);
}
```

Add `"brand:build": "node scripts/brand/build-brand-icons.mjs"` to `package.json`.

- [ ] **Step 4: Add Manifest and document metadata**

Use `https://kokoroparea.gerupon.uk/` as canonical/OG application origin. Keep CSP `connect-src 'none'`. Do not add analytics, remote fonts, remote images, service worker, or individual result URLs.

- [ ] **Step 5: Build twice and prove deterministic output**

Run: `npm.cmd run brand:build`

Record SHA-256 of both PNG files, run the command again, and assert the hashes are unchanged in `brand-assets.test.js`.

Run: `node --test app/tests/brand-assets.test.js app/tests/app-shell.test.js`

Expected: PASS.

- [ ] **Step 6: Commit Task 2**

```powershell
git add scripts/brand/build-brand-icons.mjs app/assets/brand/kokoro-parea-icon-192.png app/assets/brand/kokoro-parea-icon-512.png app/manifest/app.webmanifest app/tests/brand-assets.test.js app/index.html package.json
git commit -m "feat: add kokoro parea app metadata"
```

---

### Task 3: 結果の3色選択と保存

**Gate:** Q-013開始ゲートをすべて満たしてから開始する。

**Files:**
- Create: `app/js/domain/result-palette-selection.js`
- Create: `app/tests/result-palette-selection.test.js`
- Modify: `app/js/infrastructure/progress-storage.js`
- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/js/main.js`
- Modify: `app/tests/progress-storage.test.js`
- Modify: `app/tests/result-screen.test.js`
- Modify: `app/css/styles.css`

**Interfaces:**
- Consumes: `selectPresentation(titleProfile, PresentationDefinitionSet)`.
- Consumes: `allowedPalettes = { standard: PaletteDefinition, alternatives: [PaletteDefinition, PaletteDefinition] }`.
- Produces: `selectResultPalette(snapshot, allowedPalettes, paletteId) -> ResultSnapshot`.
- Produces: `updateResultPaletteSelection({ storage, resultId, paletteId, allowedPaletteIds, now })`.
- Invariant: only`selectedPaletteId` may differ between old and new snapshots.

- [ ] **Step 1: Write failing domain and storage tests**

```js
const updated = selectResultPalette(snapshot, presentation.palettes, alternativeId);
assert.equal(updated.selectedPaletteId, alternativeId);
assert.deepEqual(
  { ...updated, selectedPaletteId: snapshot.selectedPaletteId },
  snapshot,
);
assert.throws(
  () => selectResultPalette(snapshot, presentation.palettes, "palette-unknown"),
  { name: "TypeError", message: "RESULT_PALETTE_INVALID" },
);
```

The storage test must preserve every other valid, malformed, and future record exactly as existing storage APIs require.

- [ ] **Step 2: Run and verify RED**

Run: `node --test app/tests/result-palette-selection.test.js app/tests/progress-storage.test.js`

Expected: FAIL because selection/update functions do not exist.

- [ ] **Step 3: Implement immutable selection and exact storage update**

Validate the existing snapshot first. Accept exactly three allowed palette IDs: standard first, then two alternatives. Deep-copy and freeze the returned snapshot. The storage function must update one matching valid snapshot, never rewrite unrelated or malformed records, and return `{ status, snapshot }`.

- [ ] **Step 4: Add the result-screen selector**

Render three labelled swatches and the exact note:

`選んだ色で、結果カードを彩れます。診断結果は変わりません。`

Use a native radio group or buttons with `aria-pressed`; never use color alone. Do not recolor the radar, score bars, title, cat, or result text.

- [ ] **Step 5: Wire live and saved results**

`main.js` resolves the title profile and Q-013 presentation, passes the three palettes to `renderSavedResultScreen`, keeps an in-memory selection if storage fails, and shows a non-blocking persistence notice. `onShare` must receive the currently selected snapshot.

- [ ] **Step 6: Run focused and full tests**

Run: `node --test app/tests/result-palette-selection.test.js app/tests/progress-storage.test.js app/tests/result-screen.test.js`

Expected: PASS, including invariance of factors/title/character/text/fragrances.

Run: `npm.cmd test`

Expected: PASS.

- [ ] **Step 7: Commit Task 3**

```powershell
git add app/js/domain/result-palette-selection.js app/tests/result-palette-selection.test.js app/js/infrastructure/progress-storage.js app/js/presentation/result-screen.js app/js/main.js app/tests/progress-storage.test.js app/tests/result-screen.test.js app/css/styles.css
git commit -m "feat: select result card palette"
```

---

### Task 4: 純粋な共有カードモデル

**Files:**
- Create: `app/js/domain/share-card-model.js`
- Create: `app/tests/share-card-model.test.js`
- Modify: `app/js/domain/share-result-text.js`

**Interfaces:**
- Produces:

```js
createShareCardModel({
  snapshot,
  titleLabel,
  factorLabels,
  characterEntry,
  palette,
  paletteUsage,
  fragranceSummary,
  brand,
}) -> Readonly<{
  width: 1080,
  height: 1800,
  mimeType: "image/png",
  filename: "kokoro-parea-result.png",
  brand: { name, cardSubtitle, iconPath },
  modeLabel,
  titleLabel,
  titleReason,
  character: null | { path, alt, width, height },
  factors: ReadonlyArray<{ factorId, label, displayScore }>,
  fragrances: ReadonlyArray<{ sceneId, sceneLabel, accordLabel }>,
  disclaimer,
  versions: {
    appVersion,
    cardTemplateVersion,
    presentationDefinitionVersion,
    resultTextVersion,
  },
  palette,
  shareText,
}>
```

- Error contract: `TypeError("SHARE_CARD_MODEL_INVALID")`.
- Invariant: input objects remain unchanged; output is deeply frozen.

- [ ] **Step 1: Write failing model tests**

Test preview20/detail50, fixed factor order, exact 1080×1800, three fixed fragrance scenes, cat present/absent, and exact wave-lined subtitle.

```js
assert.equal(model.width, 1080);
assert.equal(model.height, 1800);
assert.equal(model.filename, "kokoro-parea-result.png");
assert.deepEqual(Object.keys(model.versions), [
  "appVersion",
  "cardTemplateVersion",
  "presentationDefinitionVersion",
  "resultTextVersion",
]);
assert.deepEqual(model.fragrances.map(({ sceneId }) => sceneId), [
  "pause", "reset", "quiet-focus",
]);
assert.doesNotMatch(JSON.stringify(model), /answers|titleReflection|materialIds|publicOrigin|resultId/);
```

- [ ] **Step 2: Run and verify RED**

Run: `node --test app/tests/share-card-model.test.js app/tests/share-result-text.test.js`

Expected: FAIL with missing module.

- [ ] **Step 3: Implement exact input validation and projection**

Use `validateResultSnapshot`, `selectShareableResultTexts`, `FACTOR_ORDER`, and the Q-013 three-item fragrance summary. Select the saved `titleReason` only; never regenerate historical text from current definitions.

- [ ] **Step 4: Build the fallback share text**

Include app name, mode, title, five labelled display integers, three scene/accord pairs, and disclaimer. Do not include the application URL or a result URL.

- [ ] **Step 5: Run focused and mutation tests**

Run: `node --test app/tests/share-card-model.test.js app/tests/share-result-text.test.js`

Expected: PASS with all prohibited-field fixtures rejected or omitted.

- [ ] **Step 6: Commit Task 4**

```powershell
git add app/js/domain/share-card-model.js app/tests/share-card-model.test.js app/js/domain/share-result-text.js app/tests/share-result-text.test.js
git commit -m "feat: create share card model"
```

---

### Task 5: 視認性判定と1080×1800 Canvasレンダラー

**Files:**
- Create: `app/js/domain/share-card-visibility.js`
- Create: `app/js/presentation/share-card-renderer.js`
- Create: `app/tests/share-card-visibility.test.js`
- Create: `app/tests/share-card-renderer.test.js`

**Interfaces:**
- Produces: `collectOpaqueEdgePixels({ data, width, height }, alphaThreshold = 192) -> ReadonlyArray<{ r, g, b }>`.
- Produces: `chooseCharacterTreatment({ edgePixels, backgroundHex }) -> "none" | "shadow" | "double-outline" | "neutral-plate"`.
- Produces: `renderShareCard(model, { createCanvas, loadImage, fontsReady }) -> Promise<{ status: "ok", blob } | { status: "error", errorCode }>`。
- Error codes: `SHARE_CANVAS_UNAVAILABLE`, `SHARE_FONT_UNAVAILABLE`, `SHARE_PNG_UNAVAILABLE`.

- [ ] **Step 1: Write failing visibility tests**

Use fixed synthetic RGBA buffers. `collectOpaqueEdgePixels` must select opaque pixels adjacent to transparency or the image boundary and ignore fully transparent RGB values. Assert the four treatment branches in descending contrast order. The algorithm must use WCAG relative luminance and fixed thresholds, not browser/device state.

- [ ] **Step 2: Write failing renderer-contract tests**

Inject a recording canvas. Assert exact width/height, fixed draw order, five horizontal factor bars, three fragrance rows, no radar call, cat `contain` rectangle, wave-lined subtitle, disclaimer, and version footer.

- [ ] **Step 3: Run and verify RED**

Run: `node --test app/tests/share-card-visibility.test.js app/tests/share-card-renderer.test.js`

Expected: FAIL with missing modules.

- [ ] **Step 4: Implement deterministic visibility treatment**

Use these fixed thresholds against the palette background:

- edge contrast `>= 3.0`: `none`
- `>= 2.0`: `shadow`
- `>= 1.4`: `double-outline`
- `< 1.4`: `neutral-plate`

If cat pixels cannot be read, use`neutral-plate`; do not change palette or cat.

- [ ] **Step 5: Implement the fixed renderer**

Draw in this order: ivory/palette background, paper texture, small botanical motifs, brand icon/name/subtitle, title block, cat/neutral plate, five factor bars, three fragrance rows, mode/disclaimer/version. Texture and plants must be deterministic Canvas paths; do not load remote images.

For a loaded cat, draw the unchanged image with`contain` onto an injected`64×64` analysis canvas, call`getImageData`, pass the result through`collectOpaqueEdgePixels`, and choose the treatment before drawing the final card. If analysis is blocked or throws, use`neutral-plate`.

Wait for fonts before measuring text. If the cat itself fails, render the no-cat layout and keep all text. Convert with `canvas.toBlob(callback, "image/png")`; reject null Blob with`SHARE_PNG_UNAVAILABLE`.

- [ ] **Step 6: Run focused tests**

Run: `node --test app/tests/share-card-visibility.test.js app/tests/share-card-renderer.test.js`

Expected: PASS.

- [ ] **Step 7: Commit Task 5**

```powershell
git add app/js/domain/share-card-visibility.js app/js/presentation/share-card-renderer.js app/tests/share-card-visibility.test.js app/tests/share-card-renderer.test.js
git commit -m "feat: render kokoro parea share card"
```

---

### Task 6: Web Share・保存・Clipboardの段階フォールバック

**Files:**
- Create: `app/js/infrastructure/share-delivery.js`
- Create: `app/tests/share-delivery.test.js`

**Interfaces:**
- Produces: `detectShareCapabilities(dependencies)`.
- Produces: `sharePng({ blob, filename, text }, dependencies)`.
- Produces: `downloadPng({ blob, filename }, dependencies)`.
- Produces: `copyShareText(text, dependencies)`.
- Statuses: `shared`, `cancelled`, `downloaded`, `copied`, `unavailable`, `failed`.

- [ ] **Step 1: Write failing capability tests**

Cover `navigator.canShare({ files })` true/false/throw, `navigator.share` resolve/AbortError/other rejection, Clipboard resolve/reject, Object URL create/revoke, and missing APIs.

- [ ] **Step 2: Run and verify RED**

Run: `node --test app/tests/share-delivery.test.js`

Expected: FAIL with missing module.

- [ ] **Step 3: Implement injected browser boundaries**

Never call global APIs at module import time. Always revoke Object URLs in`finally`. Map`AbortError` to`cancelled` without an error notice. Do not fetch, beacon, log, or send analytics.

- [ ] **Step 4: Prove fallback ordering**

Assert file Web Share is first when supported, PNG download remains available independently, Clipboard failure leaves selectable text, and no result/answer data is passed to these functions.

- [ ] **Step 5: Run focused tests and commit**

Run: `node --test app/tests/share-delivery.test.js`

Expected: PASS.

```powershell
git add app/js/infrastructure/share-delivery.js app/tests/share-delivery.test.js
git commit -m "feat: add share delivery fallbacks"
```

---

### Task 7: S-005画面・ルート・無スクロール初期ペイン

**Files:**
- Create: `app/js/presentation/share-screen.js`
- Create: `app/tests/share-screen.test.js`
- Modify: `app/js/infrastructure/router.js`
- Modify: `app/js/main.js`
- Modify: `app/js/presentation/result-screen.js`
- Modify: `app/tests/router.test.js`
- Modify: `app/tests/result-screen.test.js`
- Modify: `app/css/styles.css`

**Interfaces:**
- Route: `#/share?resultId=<RFC4122 UUID>`.
- Produces: `renderShareScreen(host, model, actions, dependencies)`.
- Actions: `onShare`, `onDownload`, `onCopyText`, `onBackToResult`.
- View states: `card`, `details`, `zoom`.

- [ ] **Step 1: Add failing route/controller tests**

```js
assert.deepEqual(resolveRoute("#/share?resultId=00000000-0000-4000-8000-000000000001"), {
  id: "share",
  canonicalHash: "#/share?resultId=00000000-0000-4000-8000-000000000001",
  didFallback: false,
  resultId: "00000000-0000-4000-8000-000000000001",
});
```

Missing/deleted/invalid results must return to history with a notice and must not mutate storage.

- [ ] **Step 2: Add failing S-005 presentation tests**

Assert initial`data-share-view="card"`, card image/Canvas,`共有内容を見る`,`拡大して見る`, available share/download/copy controls, selected text fallback, and`カードへ戻る`.

- [ ] **Step 3: Run and verify RED**

Run: `node --test app/tests/router.test.js app/tests/share-screen.test.js app/tests/result-screen.test.js`

Expected: FAIL because share route/screen do not exist.

- [ ] **Step 4: Implement the S-005 state transitions**

The initial card pane has no document scroll. Details may scroll. Zoom may pan/scroll only after explicit action. Returning to card resets the pane state without regenerating the PNG.

- [ ] **Step 5: Add fit-to-screen CSS**

```css
.share-screen {
  block-size: 100vh;
  block-size: 100dvh;
  overflow: hidden;
  padding-block:
    env(safe-area-inset-top)
    env(safe-area-inset-bottom);
}

.share-card-pane {
  display: flex;
  min-block-size: 0;
  overflow: hidden;
}

.share-card-preview {
  max-inline-size: 100%;
  max-block-size: 100%;
  aspect-ratio: 3 / 5;
  object-fit: contain;
}
```

Keep each main action at least`44×44` CSS px. At`min-width: 960px`, use a two-column card/details layout.

- [ ] **Step 6: Wire result → share → result**

The result button routes with the selected snapshot ID. `main.js` creates one model and one Blob per screen entry, reuses it for preview/share/download, and revokes any Object URL on route exit. Rendering failure shows text fallback without removing the result/history routes.

- [ ] **Step 7: Run focused and full tests**

Run: `node --test app/tests/router.test.js app/tests/share-screen.test.js app/tests/result-screen.test.js app/tests/app-shell.test.js`

Expected: PASS.

Run: `npm.cmd test`

Expected: PASS.

- [ ] **Step 8: Commit Task 7**

```powershell
git add app/js/presentation/share-screen.js app/tests/share-screen.test.js app/js/infrastructure/router.js app/js/main.js app/js/presentation/result-screen.js app/tests/router.test.js app/tests/result-screen.test.js app/css/styles.css
git commit -m "feat: add fit-to-screen share preview"
```

---

### Task 8: 文書同期・ブラウザQA・公開前ゲート

**Files:**
- Modify: `docs/requirements/2026-07-20-big-five-self-understanding-requirements.md`
- Modify: `docs/data-model.md`
- Modify: `docs/screens.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/tasks.md`
- Modify: `app/tests/project-contract.test.js`

**Interfaces:**
- Produces: T-007/F-011/F-012/F-014/F-015/F-016/F-018の実装記録と検証証跡。
- Keeps: Q-013 approval、approved release、production Pages/DNSを別ゲートとして正確に記録。

- [ ] **Step 1: Add failing document-contract assertions**

Assert the documents name `ココロパレア`, `https://kokoroparea.gerupon.uk`, exact icon asset,`createShareCardModel`,`renderShareCard`,`sharePng`,`#/share`, 1080×1800, 3:5, and the 320×480 no-scroll gate.

- [ ] **Step 2: Update the five canonical documents**

Record actual file names, stable error codes, fallback order, test counts, and remaining deployment/Q-013 gates. Do not mark DNS, HTTPS, custom domain, or approved release complete before live verification.

- [ ] **Step 3: Run all automated checks**

Run:

```powershell
npm.cmd test
npm.cmd run check
npm.cmd run content:validate
npm.cmd run brand:build
npm.cmd run qa:preview:build
git diff --check
```

Expected:

- all tests PASS;
- static check PASS;
- content validation has 0 errors;
- brand build is hash-stable;
- QA preview build succeeds;
- `git diff --check` produces no error.

- [ ] **Step 4: Run local browser QA**

Start: `npm.cmd run dev`

Verify:

- `320×480`, `320×568`, `360×640`, `414×896`: initial S-005 has no horizontal or vertical scroll, card is not cropped, and main controls are at least 44×44 CSS px.
- `960×720`: card/details two-column layout has no horizontal overflow.
- card/details/zoom transitions, keyboard focus, Escape/back behavior, safe-area simulation.
- preview20/detail50, cat loaded/failed, Canvas failed, Web Share supported/unsupported/cancelled, Clipboard allowed/rejected.
- light/mid/dark palettes and all four visibility treatments.
- saved PNG metadata is exactly 1080×1800 PNG and visually matches the preview.
- network panel has external request 0; console warning/error 0.

- [ ] **Step 5: Ask the project owner for final visual approval**

Present at minimum:

- one 320×480 screenshot of initial S-005;
- one 360×640 screenshot;
- one 960×720 screenshot;
- the exact generated 1080×1800 PNG;
- white-center brand icon at 38px and 24px.

Record only the actual approval date and wording. Do not infer approval from silence.

- [ ] **Step 6: Commit Task 8**

```powershell
git add docs/requirements/2026-07-20-big-five-self-understanding-requirements.md docs/data-model.md docs/screens.md docs/processing-design.md docs/tasks.md app/tests/project-contract.test.js
git commit -m "docs: record kokoro parea sharing implementation"
```

## Final Verification Gate

- [ ] Brand/header/metadata/Manifest use`ココロパレア` and the same exact SVG.
- [ ] `kokoropalea`、`gerupo.uk`、旧`5`文字アイコン、旧ブランド名がruntimeに残っていない。
- [ ] Q-013 production records and approval metadata are real; no placeholder was activated.
- [ ] Palette selection changes only`selectedPaletteId` and share-card presentation.
- [ ] Share model contains no raw answers, identity/device data, title reflections, material examples, or URLs.
- [ ] Preview and saved PNG come from the same model/rendering result.
- [ ] PNG is always 1080×1800 and the cat is never cropped/recolored.
- [ ] Initial S-005 fits without scroll at all four required mobile viewports.
- [ ] Web Share cancellation is neutral; all other failures reach download/copy/selectable text as capabilities allow.
- [ ] Normal mode sends zero external requests and keeps`connect-src 'none'`.
- [ ] Project owner approved final browser screenshots and exact PNG.
- [ ] Production DNS/custom-domain/HTTPS remain open until the separate release task verifies them live.
