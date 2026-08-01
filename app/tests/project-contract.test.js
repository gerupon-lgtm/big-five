import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { validateProject } from "../../scripts/check-static.mjs";

const projectRoot = fileURLToPath(new URL("../..", import.meta.url));
const documentPaths = {
  requirements: "docs/requirements/2026-07-20-big-five-self-understanding-requirements.md",
  dataModel: "docs/data-model.md",
  screens: "docs/screens.md",
  processing: "docs/processing-design.md",
  basicDesign: "docs/基本設計サマリ.md",
  t005Spec: "docs/superpowers/specs/2026-07-25-t005-result-character-presentation-design.md",
  tasks: "docs/tasks.md",
  evidenceLedger: "docs/research/2026-07-25-q006-result-content-evidence.md",
};

async function readProjectDocument(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), "utf8");
}

function sectionBetween(text, startHeading, endHeading) {
  const start = text.indexOf(startHeading);
  assert.notEqual(start, -1, `missing section ${startHeading}`);
  const end = text.indexOf(endHeading, start + startHeading.length);
  assert.notEqual(end, -1, `missing section ${endHeading}`);
  return text.slice(start, end);
}

function tableFieldNames(section) {
  return [...section.matchAll(/^\|\s*([A-Za-z][A-Za-z0-9]*)\s*\|/gm)]
    .map(([, field]) => field);
}

function assertIncludesAll(text, required, documentName) {
  for (const token of required) {
    assert.ok(text.includes(token), `${documentName} missing ${token}`);
  }
}

function matchingLine(section, pattern, label) {
  const line = section.split(/\r?\n/).find((candidate) => pattern.test(candidate));
  assert.ok(line, `missing ${label}`);
  return line;
}

test("formal app satisfies the static project contract", async () => {
  const result = await validateProject(projectRoot);

  assert.equal(result.runtimeVersionOccurrences, 1);
  assert.ok(result.checkedJavaScriptFiles >= 5);
  assert.equal(result.prototypeImports, 0);
});

test("major design documents reference the canonical requirements version", async () => {
  const [requirements, screens, processing, tasks, basicDesign] = await Promise.all([
    readProjectDocument(documentPaths.requirements),
    readProjectDocument(documentPaths.screens),
    readProjectDocument(documentPaths.processing),
    readProjectDocument(documentPaths.tasks),
    readProjectDocument(documentPaths.basicDesign),
  ]);
  const requirementVersion = requirements.match(/^\|\s*文書版\s*\|\s*(\d+\.\d+)\s*\|$/m)?.[1];

  assert.ok(requirementVersion, "canonical requirements version is missing");
  for (const [document, name, field] of [
    [screens, documentPaths.screens, "入力要件"],
    [processing, documentPaths.processing, "入力要件"],
    [tasks, documentPaths.tasks, "要件正典"],
  ]) {
    assert.ok(
      document.includes(`| ${field} | 要件定義書v${requirementVersion} |`),
      `${name} does not reference requirements v${requirementVersion}`,
    );
  }
  assert.ok(
    basicDesign.includes(`要件定義 | \`docs/requirements/2026-07-20-big-five-self-understanding-requirements.md\` v${requirementVersion}`),
    `${documentPaths.basicDesign} does not reference requirements v${requirementVersion}`,
  );
});

test("Q-006 data model documents the exact evidence, text, rendered, and snapshot schemas", async () => {
  const text = await readProjectDocument(documentPaths.dataModel);

  const evidenceSection = sectionBetween(text, "### 2.5 ResultEvidenceDefinition", "### 2.6 ResultTextDefinition");
  assert.deepEqual(tableFieldNames(evidenceSection), [
    "evidenceId",
    "version",
    "sourceType",
    "sourceLabel",
    "locator",
    "supportedClaims",
  ]);

  const resultTextSection = sectionBetween(text, "### 2.6 ResultTextDefinition", "### 2.7 TitleProfileDefinition");
  assert.deepEqual(tableFieldNames(resultTextSection), [
    "id",
    "version",
    "appliesTo",
    "section",
    "claimKind",
    "text",
    "evidenceRefs",
    "previewAllowed",
  ]);
  assertIncludesAll(resultTextSection, [
    "titleSubtitle",
    "titleReason",
    "observation",
    "strength",
    "tradeoff",
    "work",
    "relationship",
    "stress",
    "question",
    "action",
    "102",
    "135",
    "237",
  ], documentPaths.dataModel);

  const versionTupleSection = sectionBetween(text, "### 3.4 VersionTuple", "### 3.4.1");
  assert.deepEqual(tableFieldNames(versionTupleSection), [
    "scaleVersion",
    "questionVersion",
    "scoringVersion",
    "resultTextVersion",
    "titleRuleVersion",
    "characterManifestVersion",
    "presentationDefinitionVersion",
    "cardTemplateVersion",
    "appVersion",
  ]);
  assert.match(
    versionTupleSection,
    /\|\s*scaleVersion\s*\|[^|\n]*\|[^|\n]*尺度[^|\n]*識別[^|\n]*改訂[^|\n]*一意な版ID/,
  );
  assert.match(
    versionTupleSection,
    /\|\s*characterManifestVersion\s*\|[^|\n]*\|[^|\n]*キャラクターmanifest全体版/,
  );

  const snapshotSection = sectionBetween(text, "### 3.5 ResultSnapshot", "### 3.6 FactorResult");
  assert.deepEqual(tableFieldNames(snapshotSection), [
    "resultId",
    "completedAt",
    "questionCount",
    "mode",
    "versionTuple",
    "factors",
    "titleId",
    "characterId",
    "characterAssetVersion",
    "boundaryFlags",
    "renderedTexts",
    "selectedPaletteId",
    "cardTemplateVersion",
  ]);
  assert.doesNotMatch(snapshotSection, /\|\s*diagnosisId\s*\|/);
  assertIncludesAll(snapshotSection, [
    "answers",
    "診断時",
    "characterAssetVersion",
    "characterManifestVersion",
    "validateResultSnapshot",
    "progress-storage.js",
    "saveResultSnapshot",
    "本番caller",
  ], documentPaths.dataModel);

  const renderedSection = sectionBetween(text, "### 3.7 RenderedResultText", "## 4.");
  assert.deepEqual(tableFieldNames(renderedSection), [
    "id",
    "version",
    "section",
    "text",
    "evidenceRefs",
  ]);
  assertIncludesAll(renderedSection, ["5フィールド", "deep freeze"], documentPaths.dataModel);
});

test("VersionTuple scaleVersion preserves scale identity and revision without adding scaleId", async () => {
  const [requirements, dataModel] = await Promise.all([
    readProjectDocument(documentPaths.requirements),
    readProjectDocument(documentPaths.dataModel),
  ]);
  const requirementCompatibility = sectionBetween(requirements, "### 8.5 履歴・比較", "### 8.6 共有");
  const dataCompatibility = sectionBetween(dataModel, "## 4. 比較互換性", "## 5. 更新・削除・復元");
  const versionTupleSection = sectionBetween(dataModel, "### 3.4 VersionTuple", "### 3.4.1");

  for (const [section, documentName] of [
    [requirementCompatibility, documentPaths.requirements],
    [dataCompatibility, documentPaths.dataModel],
  ]) {
    assertIncludesAll(section, ["scaleVersion", "尺度の識別", "改訂版", "一意な版ID"], documentName);
    assert.match(section, /別(?:の)?`?scaleId`?(?:フィールド)?を要求しない/);
  }
  assert.doesNotMatch(versionTupleSection, /^\|\s*scaleId\s*\|/m);
});

test("T-006 documents implemented history, deletion, and comparison seams", async () => {
  const [dataModel, processing, tasks, historyScreen, comparisonScreen, resultScreen] = await Promise.all([
    readProjectDocument(documentPaths.dataModel),
    readProjectDocument(documentPaths.processing),
    readProjectDocument(documentPaths.tasks),
    readProjectDocument("app/js/presentation/history-screen.js"),
    readProjectDocument("app/js/presentation/comparison-screen.js"),
    readProjectDocument("app/js/presentation/result-screen.js"),
  ]);
  const snapshotSection = sectionBetween(dataModel, "### 3.5 ResultSnapshot", "### 3.6 FactorResult");
  const compatibilitySection = sectionBetween(dataModel, "## 4. 比較互換性", "## 5. 更新・削除・復元");
  const historySection = sectionBetween(processing, "## 7. 履歴保存", "## 8. 比較");
  const comparisonSection = sectionBetween(processing, "## 8. 比較", "## 9. レーダーチャート");
  const taskSection = sectionBetween(tasks, "### T-006 履歴・比較・削除", "### T-007 共有カード・保存・コピー");

  for (const section of [snapshotSection, historySection, taskSection]) {
    assertIncludesAll(section, [
      "loadResultHistory",
      "deleteResultSnapshot",
      "deleteAllData",
    ], documentPaths.processing);
  }
  for (const section of [compatibilitySection, comparisonSection, taskSection]) {
    assertIncludesAll(section, [
      "compareResultSnapshots",
      "beforeRawMean",
      "afterRawMean",
      "deltaRawMean",
    ], documentPaths.processing);
  }
  assertIncludesAll(taskSection, [
    "本番caller",
    "S-006",
    "S-007",
    "#/history",
    "#/compare",
    "履歴0件",
    "比較選択",
    "P1",
    "全363件",
  ], documentPaths.tasks);
  assert.doesNotMatch(historyScreen, /from\s+["']\.\.\/data\//);
  assert.doesNotMatch(comparisonScreen, /from\s+["']\.\.\/data\//);
  assert.doesNotMatch(resultScreen, /from\s+["']\.\.\/data\//);
  assert.doesNotMatch(resultScreen, /from\s+["']\.\.\/infrastructure\//);
});

test("T-005 F-016 character result stays contain-fit at 360px and 200% text", async () => {
  const styles = await readProjectDocument("app/css/styles.css");
  const bodyRule = styles.match(/body\s*\{[\s\S]*?\}/)?.[0] ?? "";
  const frameRule = styles.match(/\.result-character-frame\s*\{[\s\S]*?\}/)?.[0] ?? "";
  const imageRule = styles.match(/\.result-character-image\s*\{[\s\S]*?\}/)?.[0] ?? "";

  assert.doesNotMatch(bodyRule, /min-width:\s*320px/);
  assert.match(frameRule, /width:\s*min\(100%,\s*520px\)/);
  assert.match(frameRule, /overflow:\s*hidden/);
  assert.match(imageRule, /width:\s*100%/);
  assert.match(imageRule, /object-fit:\s*contain/);
});

test("Q-006 processing assigns selection validation to the composer and production IDs to snapshots", async () => {
  const [processing, t005Spec, tasks] = await Promise.all([
    readProjectDocument(documentPaths.processing),
    readProjectDocument(documentPaths.t005Spec),
    readProjectDocument(documentPaths.tasks),
  ]);
  const composerSection = sectionBetween(processing, "### 6.2 `composeResultTexts`", "### 6.3 ResultModelとResultSnapshot");
  const snapshotSection = sectionBetween(processing, "### 6.3 ResultModelとResultSnapshot", "## 7. 履歴保存");

  assertIncludesAll(composerSection, [
    "条件選択",
    "欠落",
    "重複",
    "件数",
    "section-first",
    "FACTOR_ORDER",
    "version",
    "5フィールド",
  ], documentPaths.processing);
  assert.doesNotMatch(composerSection, /exact (?:production record )?ID/);
  assertIncludesAll(snapshotSection, [
    "exact production record ID",
    "7件",
    "42件",
    "section",
    "factor",
    "version",
  ], documentPaths.processing);

  const specContract = sectionBetween(t005Spec, "### 2.3 Q-006実装済み契約", "### 2.4 Q-006の現在gate");
  const specComposerLine = matchingLine(specContract, /composeResultTexts/, "T-005 spec composer contract");
  const specSnapshotLine = matchingLine(specContract, /createResultSnapshot/, "T-005 spec snapshot contract");
  assertIncludesAll(specComposerLine, ["条件選択", "欠落", "重複", "件数", "section-first", "version", "5フィールド"], documentPaths.t005Spec);
  assert.doesNotMatch(specComposerLine, /exact (?:production record )?ID/);
  assert.match(specSnapshotLine, /exact production record ID/);

  const taskContract = sectionBetween(tasks, "#### Q-006ドメイン実装記録（2026-07-26）", "### T-006 履歴・比較・削除");
  const taskComposerLine = matchingLine(taskContract, /合成:.*composeResultTexts/, "T-005 task composer contract");
  const taskSnapshotLine = matchingLine(taskContract, /snapshot:.*createResultSnapshot/, "T-005 task snapshot contract");
  assertIncludesAll(taskComposerLine, ["条件選択", "欠落", "重複", "件数", "section-first", "version", "5フィールド"], documentPaths.tasks);
  assert.doesNotMatch(taskComposerLine, /exact (?:production record )?ID/);
  assert.match(taskSnapshotLine, /exact production record ID/);
});

test("Q-006 screens preserve text sharing fallbacks independently in preview and detail", async () => {
  const screens = await readProjectDocument(documentPaths.screens);

  const previewScreen = sectionBetween(screens, "## 7. S-003 基本結果", "## 8. S-004 詳細結果");
  assertIncludesAll(previewScreen, [
    "中立副題",
    "称号になった理由",
    "5因子それぞれの観察文",
    "7件",
    "20問簡易プレビュー",
    "猫画像",
    "Canvas",
    "共有API",
    "共有テキスト",
    "選択可能テキスト",
  ], documentPaths.screens);

  const detailScreen = sectionBetween(screens, "## 8. S-004 詳細結果", "## 9. 色候補の任意操作");
  assertIncludesAll(detailScreen, [
    "中立副題",
    "称号になった理由",
    "5因子それぞれの観察文",
    "強み",
    "裏返り",
    "仕事",
    "人間関係",
    "ストレス",
    "問いかけ",
    "行動ヒント",
    "42件",
    "詳しく見る",
    "因子を選ぶと、詳しい結果を確認できます。",
    "猫画像",
    "Canvas",
    "共有API",
    "共有テキスト",
    "選択可能テキスト",
  ], documentPaths.screens);
});

test("T-007 documents the implemented Kokoro Parea sharing pipeline", async () => {
  const [requirements, dataModel, screens, processing, basicDesign, tasks] = await Promise.all([
    readProjectDocument(documentPaths.requirements),
    readProjectDocument(documentPaths.dataModel),
    readProjectDocument(documentPaths.screens),
    readProjectDocument(documentPaths.processing),
    readProjectDocument(documentPaths.basicDesign),
    readProjectDocument(documentPaths.tasks),
  ]);

  assertIncludesAll(requirements, [
    "ココロパレア",
    "https://kokoroparea.gerupon.uk",
    "1080×1800",
    "3:5",
    "320×480",
    "補正版の透過ラスタリース",
    "上下位置の中央付近が外側へ膨らみ過ぎて見える点の形状調整は保留",
  ], documentPaths.requirements);
  assertIncludesAll(dataModel, [
    "createShareCardModel",
    "1080×1800",
    "titleReflection",
    "共有物は保存しない",
    "透過素材画付き代表3件",
  ], documentPaths.dataModel);
  assertIncludesAll(screens, [
    "#/share?resultId=<UUID>",
    "data-share-view",
    "card",
    "details",
    "zoom",
    "320×480",
    "完成カードをSVGからラスタライズしない",
    "同じ副ボタンのトンマナ",
  ], documentPaths.screens);
  assertIncludesAll(processing, [
    "createShareCardModel",
    "renderShareCard",
    "sharePng",
    "SHARE_CANVAS_UNAVAILABLE",
    "SHARE_FONT_UNAVAILABLE",
    "SHARE_PNG_UNAVAILABLE",
    "プレビューとダウンロードは同じ1080×1800 PNG Blob",
    "通常結果画面は境界注意の後に単一の称号カードCTA",
  ], documentPaths.processing);
  assertIncludesAll(tasks, [
    "状態: IMPLEMENTED_WITH_VISUAL_FOLLOW_UP（2026-08-02）",
    "#/share?resultId=<UUID>",
    "1080×1800",
    "猫ごとのalpha下端追従",
  ], documentPaths.tasks);
  assertIncludesAll(basicDesign, [
    "1080×1800",
    "補正版の透過ラスタリース",
    "上下中央付近の膨らみを抑える形状調整は保留",
    "猫ごとのalpha下端",
  ], documentPaths.basicDesign);
  for (const [document, name] of [
    [requirements, documentPaths.requirements],
    [basicDesign, documentPaths.basicDesign],
    [tasks, documentPaths.tasks],
  ]) {
    assert.doesNotMatch(document, /共有画像の寸法、形式、トリミング、文字量\s*\|\s*ユーザー\s*\|\s*共有画面実装前/);
    assert.doesNotMatch(document, /正式共有Canvasとproduction release CSVは未完了/);
    assert.doesNotMatch(document, /共有画像の最終仕様\s*\|\s*寸法・文字量未決/);
    assert.doesNotMatch(document, /視覚承認待ち/, `${name} retains stale visual approval status`);
  }
  for (const document of [requirements, screens, basicDesign, tasks]) {
    assert.doesNotMatch(
      document,
      /【想定】`～あなたらしさから着想した色～`/,
    );
  }
});

test("Q-006 records every content gate as approved and the overall gate as resolved", async () => {
  const [requirements, t005Spec, tasks, evidenceLedger] = await Promise.all([
    readProjectDocument(documentPaths.requirements),
    readProjectDocument(documentPaths.t005Spec),
    readProjectDocument(documentPaths.tasks),
    readProjectDocument(documentPaths.evidenceLedger),
  ]);
  const gateSection = sectionBetween(requirements, "#### 8.3.2 Q-006 `result-text-v1`実装・承認状態", "### 8.4 途中回答");
  const openSection = sectionBetween(requirements, "## 19. 要確認事項", "### 19.1 解決済み事項");
  const resolvedSection = sectionBetween(requirements, "### 19.1 解決済み事項", "## 20. 基本設計への引き渡し");

  assertIncludesAll(gateSection, [
    "result-text-v1",
    "docs/research/2026-07-25-q006-result-content-evidence.md",
    "実装・独立レビュー済み",
    "initial reviewed copy",
    "Content Approval",
    "2026-07-28に完了",
    "E-1",
    "E-2",
    "E-3",
    "E-4",
    "E-5",
    "T-0",
    "T-1",
    "T-2",
    "T-3",
    "T-4",
    "F-1",
    "F-2",
    "F-3",
    "F-4",
    "F-5",
    "X-1〜X-2",
  ], documentPaths.requirements);
  assert.match(gateSection, /E-0[^。\n]*approved/);
  assert.match(gateSection, /E-1[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /E-2[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /E-3[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /E-4[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /E-5[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /F-1[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /F-2[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /F-3[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /F-4[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /F-5[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /T-0[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /T-1[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /T-2[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /T-3[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /T-4[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /X-1[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /X-2[^。\n]*approved[^。\n]*2026-07-28/);
  assert.match(gateSection, /E-0〜E-5[^。\n]*T-0〜T-4[^。\n]*F-1〜F-5[^。\n]*X-1〜X-2[^。\n]*approved[^。\n]*Q-006[^。\n]*解決済み/);
  assert.doesNotMatch(gateSection, /Content Approval pending/);

  assert.doesNotMatch(openSection, /^\|\s*Q-006(?:\s|\()/m);
  assert.match(resolvedSection, /^\|\s*Q-006\s*\|.*Content Approval.*2026-07-28/m);

  const specGate = sectionBetween(t005Spec, "### 2.4 Q-006の現在gate", "## 3. Q-012 キャラクター");
  assertIncludesAll(specGate, [
    "result-text-v1",
    "initial reviewed copy",
    "Content Approval",
    "2026-07-28に完了",
    "E-0",
    "E-1",
    "E-2",
    "E-3",
    "E-4",
    "E-5",
    "T-0",
    "T-1",
    "T-2",
    "T-3",
    "T-4",
    "F-1",
    "F-2",
    "F-3",
    "F-4",
    "F-5",
    "X-1〜X-2",
  ], documentPaths.t005Spec);
  const specApprovedGateLine = matchingLine(specGate, /T-1:/, "T-005 spec approved T-1 gate");
  assertIncludesAll(specApprovedGateLine, ["approved", "2026-07-28"], documentPaths.t005Spec);
  const specApprovedT2GateLine = matchingLine(specGate, /T-2:/, "T-005 spec approved T-2 gate");
  assertIncludesAll(specApprovedT2GateLine, ["approved", "2026-07-28"], documentPaths.t005Spec);
  const specApprovedT3GateLine = matchingLine(specGate, /T-3:/, "T-005 spec approved T-3 gate");
  assertIncludesAll(specApprovedT3GateLine, ["approved", "2026-07-28"], documentPaths.t005Spec);
  const specApprovedT4GateLine = matchingLine(specGate, /T-4:/, "T-005 spec approved T-4 gate");
  assertIncludesAll(specApprovedT4GateLine, ["approved", "2026-07-28"], documentPaths.t005Spec);
  assert.doesNotMatch(specApprovedT4GateLine, /F-5/);
  const specApprovedX1GateLine = matchingLine(specGate, /X-1:/, "T-005 spec approved X-1 gate");
  assertIncludesAll(specApprovedX1GateLine, ["approved", "2026-07-28", "7件"], documentPaths.t005Spec);
  const specApprovedX2GateLine = matchingLine(specGate, /X-2:/, "T-005 spec approved X-2 gate");
  assertIncludesAll(specApprovedX2GateLine, ["approved", "2026-07-28", "42件"], documentPaths.t005Spec);
  assert.doesNotMatch(specGate, /Content Approval pending/);

  const taskGate = sectionBetween(tasks, "#### Q-006ドメイン実装記録（2026-07-26）", "### T-006 履歴・比較・削除");
  assertIncludesAll(taskGate, ["initial reviewed copy", "Content Approval", "2026-07-28", "E-0〜E-5", "T-0〜T-4", "F-1〜F-5", "X-1", "X-2"], documentPaths.tasks);
  assert.match(taskGate, /T-0〜T-4[^。\n]*2026-07-28[^。\n]*approved/);
  assert.match(taskGate, /X-1[^。\n]*2026-07-28[^。\n]*approved/);
  assert.match(taskGate, /X-2[^。\n]*2026-07-28[^。\n]*approved/);
  assert.doesNotMatch(taskGate, /Content Approval pending/);

  const initialStateLine = matchingLine(tasks, /- 初期状態:/, "Q-006 initial-state history");
  assertIncludesAll(initialStateLine, ["E-0は`approved`", "E-1〜E-5は`draft`", "F-1〜F-5", "`reviewed`"], documentPaths.tasks);

  const evidenceGates = sectionBetween(evidenceLedger, "## Content Approval Gates（E-0〜E-5）", "## 結果節の主張種別");
  assert.match(evidenceGates, /^\| E-1 \|.*\| approved \| 2026-07-28 \|/m);
  assert.match(evidenceGates, /^\| E-2 \|.*\| approved \| 2026-07-28 \|/m);
  assert.match(evidenceGates, /^\| E-3 \|.*\| approved \| 2026-07-28 \|/m);
  assert.match(evidenceGates, /^\| E-4 \|.*\| approved \| 2026-07-28 \|/m);
  assert.match(evidenceGates, /^\| E-5 \|.*\| approved \| 2026-07-28 \|/m);
  assert.match(evidenceGates, /F-1[^。\n]*2026-07-28[^。\n]*ユーザー承認/);
  assert.match(evidenceGates, /F-2[^。\n]*2026-07-28[^。\n]*ユーザー承認/);
  assert.match(evidenceGates, /F-3[^。\n]*2026-07-28[^。\n]*ユーザー承認/);
  assert.match(evidenceGates, /F-4[^。\n]*2026-07-28[^。\n]*ユーザー承認/);
  assert.match(evidenceGates, /F-5[^。\n]*2026-07-28[^。\n]*ユーザー承認/);
  assert.match(evidenceGates, /T-0[^。\n]*2026-07-28[^。\n]*ユーザー承認/);
  assert.match(evidenceGates, /T-1[^。\n]*2026-07-28[^。\n]*ユーザー承認/);
  assert.match(evidenceGates, /T-2[^。\n]*2026-07-28[^。\n]*ユーザー承認/);
  assert.match(evidenceGates, /T-3[^。\n]*2026-07-28[^。\n]*ユーザー承認/);
  assert.match(evidenceGates, /T-4[^。\n]*2026-07-28[^。\n]*ユーザー承認/);
  assert.match(evidenceGates, /X-1[^。\n]*2026-07-28[^。\n]*ユーザー承認/);
  assert.match(evidenceGates, /X-2[^。\n]*2026-07-28[^。\n]*ユーザー承認/);
  assert.match(evidenceGates, /T-0〜T-2[^。\n]*「〜しやすい」反復[^。\n]*再修正[^。\n]*ユーザー承認/);
});

test("F-002 maps to T-005 in the trace row, task section, and T-005 spec", async () => {
  const [tasks, t005Spec] = await Promise.all([
    readProjectDocument(documentPaths.tasks),
    readProjectDocument(documentPaths.t005Spec),
  ]);
  const canonicalT005Features = [
    "F-002",
    "F-005",
    "F-006",
    "F-007",
    "F-008",
    "F-016",
    "F-018",
  ];
  const traceability = sectionBetween(tasks, "## 1. トレーサビリティ表（正典）", "## 2. 実装順");
  const f002Row = matchingLine(traceability, /^\|\s*F-002\s*\|/, "F-002 traceability row");
  const implementationOrder = sectionBetween(tasks, "## 2. 実装順", "## 3. フェーズ");
  const implementationOrderRow = matchingLine(implementationOrder, /^\|\s*T-005\s*\|/, "T-005 implementation order row");
  const t005Task = sectionBetween(tasks, "### T-005 結果画面・猫・レーダー・色香り", "### T-006 履歴・比較・削除");
  const taskFeatureLine = matchingLine(t005Task, /対応機能:/, "T-005 task feature list");
  const specHeader = sectionBetween(t005Spec, "# T-005 結果・キャラクター・色香り設計", "## 1. 目的");
  const specFeatureLine = matchingLine(specHeader, /対象機能:/, "T-005 spec feature list");

  assert.match(f002Row, /\|\s*T-002,\s*T-005\s*\|/);
  for (const line of [implementationOrderRow, taskFeatureLine, specFeatureLine]) {
    assert.deepEqual(
      line.match(/F-\d{3}/g),
      canonicalT005Features,
    );
  }
});

test("QA Pages runbook separates preview deployment from production release", async () => {
  const [runbook, tasks] = await Promise.all([
    readFile(new URL("../../docs/qa-preview-pages.md", import.meta.url), "utf8"),
    readFile(new URL("../../docs/tasks.md", import.meta.url), "utf8"),
  ]);
  assert.match(runbook, /https:\/\/gerupon-lgtm\.github\.io\/big-five\//);
  assert.match(runbook, /Settings.*Pages.*GitHub Actions/s);
  assert.match(runbook, /localStorage/);
  assert.match(runbook, /外部通信0件/);
  assert.match(runbook, /公開を解除/);
  assert.match(runbook, /T-011.*完了.*意味しない/s);
  assert.match(tasks, /F-005.*result-text-v1.*2026-07-28.*完了/);
  assert.match(tasks, /F-006.*result-text-v1.*2026-07-28.*完了/);
  assert.match(tasks, /TR-0〜TR-4承認済み`titleReflection`153件＝390件/);
  assert.match(tasks, /QA一時プレビュー.*T-011.*完了.*意味しない/s);
});
