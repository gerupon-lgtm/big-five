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
  t005Spec: "docs/superpowers/specs/2026-07-25-t005-result-character-presentation-design.md",
  tasks: "docs/tasks.md",
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

test("formal app satisfies the static project contract", async () => {
  const result = await validateProject(projectRoot);

  assert.equal(result.runtimeVersionOccurrences, 1);
  assert.ok(result.checkedJavaScriptFiles >= 5);
  assert.equal(result.prototypeImports, 0);
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
    "progress-storage.js",
    "後続永続化統合",
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

test("Q-006 processing and screen documents preserve composition order and fallback access", async () => {
  const [processing, screens] = await Promise.all([
    readProjectDocument(documentPaths.processing),
    readProjectDocument(documentPaths.screens),
  ]);

  assertIncludesAll(processing, [
    "composeResultTexts",
    "result-text-v1",
    "7件",
    "42件",
    "section-first",
    "FACTOR_ORDER",
    "exact ID",
    "RenderedResultText",
    "deep freeze",
    "ResultSnapshot",
    "characterAssetVersion",
    "characterManifestVersion",
    "生回答",
  ], documentPaths.processing);

  const previewScreen = sectionBetween(screens, "## 7. S-003 基本結果", "## 8. S-004 詳細結果");
  assertIncludesAll(previewScreen, [
    "中立副題",
    "称号になった理由",
    "5因子それぞれの観察文",
    "7件",
    "20問簡易プレビュー",
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
    "説明を見る",
    "※因子名の「説明を見る」から、それぞれの意味を確認できます。",
  ], documentPaths.screens);

  assertIncludesAll(screens, [
    "猫画像またはCanvasが失敗しても",
    "称号",
    "結果文",
    "根拠",
    "共有テキスト",
  ], documentPaths.screens);
});

test("Q-006 status documents separate reviewed implementation from pending human approval", async () => {
  const [requirements, t005Spec, tasks] = await Promise.all([
    readProjectDocument(documentPaths.requirements),
    readProjectDocument(documentPaths.t005Spec),
    readProjectDocument(documentPaths.tasks),
  ]);

  assertIncludesAll(requirements, [
    "result-text-v1",
    "docs/research/2026-07-25-q006-result-content-evidence.md",
    "実装・独立レビュー済み",
    "initial reviewed copy",
    "Content Approval pending",
    "E-1〜E-5",
  ], documentPaths.requirements);
  assert.doesNotMatch(requirements, /Q-006（解決済み）|Q-006は完全解決済み/);

  assertIncludesAll(t005Spec, [
    "result-text-v1",
    "102",
    "135",
    "237",
    "composeResultTexts",
    "createResultSnapshot",
    "実装・独立レビュー済み",
    "initial reviewed copy",
    "Content Approval pending",
    "E-1〜E-5",
  ], documentPaths.t005Spec);

  assertIncludesAll(tasks, [
    "T-005",
    "F-002",
    "F-005",
    "F-006",
    "F-016",
    "ResultEvidenceDefinition",
    "ResultTextDefinition",
    "ResultSnapshot",
    "progress-storage.js",
    "後続永続化統合で更新",
    "Content Approval pending",
    "Q-007",
    "Q-012",
    "Q-013",
  ], documentPaths.tasks);
});
