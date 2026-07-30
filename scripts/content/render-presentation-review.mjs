import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  contrastRatio,
  resolvePaletteUsage,
  validatePaletteContrast,
} from "../../app/js/domain/palette-usage.js";
import { selectPresentation } from "../../app/js/domain/presentation-selector.js";
import { summarizeFragrances } from "../../app/js/domain/share-fragrance-summary.js";
import { validateTitleProfileDefinitions } from "../../app/js/domain/title-profile.js";
import { compilePresentationContent } from "./compile-presentation.mjs";
import { loadTableSchema } from "./schema-loader.mjs";
import { loadCsvTable } from "./table-loader.mjs";

const ROOT_DIR = path.resolve(import.meta.dirname, "../..");
const SCHEMA_DIR = path.join(ROOT_DIR, "content/schemas");
const PRESENTATION_VERSION = "presentation-v2";
const GATES = Object.freeze([
  Object.freeze({ gateId: "P-0", label: "パレットと用途色", start: null, end: null }),
  Object.freeze({ gateId: "P-1", label: "香調語彙と素材", start: null, end: null }),
  Object.freeze({ gateId: "P-2", label: "バランス・単一因子称号", start: 1, end: 11 }),
  Object.freeze({ gateId: "P-3", label: "ペア称号 1〜10", start: 12, end: 21 }),
  Object.freeze({ gateId: "P-4", label: "ペア称号 11〜20", start: 22, end: 31 }),
  Object.freeze({ gateId: "P-5", label: "ペア称号 21〜30", start: 32, end: 41 }),
  Object.freeze({ gateId: "P-6", label: "ペア称号 31〜40", start: 42, end: 51 }),
]);

function invalidReview() {
  throw new TypeError("PRESENTATION_REVIEW_INVALID");
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) deepFreeze(nestedValue);
  }
  return value;
}

async function loadTable(sourceDir, segments, fileName) {
  const schema = await loadTableSchema(
    path.join(SCHEMA_DIR, fileName.replace(/\.csv$/, ".schema.json")),
  );
  return loadCsvTable({
    filePath: path.join(sourceDir, ...segments, fileName),
    schema,
  });
}

function projectTitleProfiles(profileRows, profileFactorRows) {
  const factorsByTitle = new Map();
  for (const row of profileFactorRows) {
    if (!factorsByTitle.has(row.title_id)) factorsByTitle.set(row.title_id, []);
    factorsByTitle.get(row.title_id).push(row);
  }
  const profiles = [...profileRows]
    .sort((left, right) => left.display_order - right.display_order)
    .map((row) => ({
      titleId: row.title_id,
      label: row.label,
      kind: row.kind,
      factors: (factorsByTitle.get(row.title_id) ?? [])
        .sort((left, right) => left.display_order - right.display_order)
        .map((factor) => ({
          factorId: factor.factor_id,
          direction: factor.direction,
        })),
      characterId: row.character_id,
      summaryTextId: row.summary_text_id,
      defaultPaletteId: row.default_palette_id,
    }));
  return validateTitleProfileDefinitions(profiles);
}

function makeContrastReports(definitionSet) {
  return definitionSet.palettes.map((palette, index) => {
    const mapping = definitionSet.paletteUsageMappings[index];
    const resolved = resolvePaletteUsage(palette, mapping);
    const validation = validatePaletteContrast(resolved);
    return deepFreeze({
      paletteId: palette.paletteId,
      mapping,
      resolved,
      ratios: {
        textBackground: contrastRatio(resolved.text, resolved.background),
        textSurface: contrastRatio(resolved.text, resolved.surface),
        accentSurface: contrastRatio(resolved.accent, resolved.surface),
        chartBackground: contrastRatio(resolved.chart, resolved.background),
      },
      valid: validation.valid,
      failures: validation.failures,
    });
  });
}

export async function loadPresentationReviewModel({ sourceDir }) {
  if (typeof sourceDir !== "string" || sourceDir === "") invalidReview();
  const presentationDir = ["presentation", PRESENTATION_VERSION];
  const [
    profiles,
    profileFactors,
    scenes,
    palettes,
    paletteUsage,
    fragrances,
    fragranceMaterials,
    fragranceMaterialExamples,
    selectors,
    selectorPalettes,
    selectorFragrances,
    approvals,
  ] = await Promise.all([
    loadTable(sourceDir, ["titles", "title-rule-v1"], "title-profiles.csv"),
    loadTable(sourceDir, ["titles", "title-rule-v1"], "title-profile-factors.csv"),
    loadTable(sourceDir, presentationDir, "scenes.csv"),
    loadTable(sourceDir, presentationDir, "palettes.csv"),
    loadTable(sourceDir, presentationDir, "palette-usage-mappings.csv"),
    loadTable(sourceDir, presentationDir, "fragrances.csv"),
    loadTable(sourceDir, presentationDir, "fragrance-materials.csv"),
    loadTable(sourceDir, presentationDir, "fragrance-material-examples.csv"),
    loadTable(sourceDir, presentationDir, "presentation-selectors.csv"),
    loadTable(sourceDir, presentationDir, "selector-palettes.csv"),
    loadTable(sourceDir, presentationDir, "selector-fragrances.csv"),
    loadTable(sourceDir, ["approvals"], "presentation-content-approvals.csv"),
  ]);
  const titleProfiles = projectTitleProfiles(profiles.rows, profileFactors.rows);
  const definitionSet = compilePresentationContent({
    sceneRows: scenes.rows,
    paletteRows: palettes.rows,
    paletteUsageRows: paletteUsage.rows,
    fragranceRows: fragrances.rows,
    fragranceMaterialRows: fragranceMaterials.rows,
    fragranceMaterialExampleRows: fragranceMaterialExamples.rows,
    selectorRows: selectors.rows,
    selectorPaletteRows: selectorPalettes.rows,
    selectorFragranceRows: selectorFragrances.rows,
    titleProfiles,
  }, PRESENTATION_VERSION);

  return deepFreeze({
    definitionSet,
    titleProfiles,
    contrastReports: makeContrastReports(definitionSet),
    approvals: approvals.rows,
  });
}

function approvalStatus(approvals, gateId) {
  const matches = approvals.filter(({ gate_id }) => gate_id === gateId);
  if (matches.length !== 1) invalidReview();
  return matches[0].status;
}

function ratio(value) {
  return value.toFixed(3);
}

function recipe(mapping) {
  return ["background", "surface", "accent", "chart"]
    .map((role) => {
      const value = mapping.roles[role];
      return `${role}=${value.source}/${value.mixWith}/${value.mixPercent}%`;
    })
    .join("; ");
}

function renderPaletteSection(lines, model) {
  lines.push(
    `## P-0 パレットと用途色（${approvalStatus(model.approvals, "P-0")}）`,
    "",
    "| ID | ラベル | 基調色 primary / secondary / accent | 用途色レシピ | 解決色 background / surface / accent / chart / text | 比率 text-bg / text-surface / accent-surface / chart-bg | 判定 | 説明 |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
  );
  const reportById = new Map(
    model.contrastReports.map((report) => [report.paletteId, report]),
  );
  for (const palette of model.definitionSet.palettes) {
    const report = reportById.get(palette.paletteId);
    if (!report) invalidReview();
    const base = palette.baseColors;
    const resolved = report.resolved;
    const ratios = report.ratios;
    lines.push(
      `| \`${palette.paletteId}\` | ${palette.label} | ${base.primary} / ${base.secondary} / ${base.accent} | ${recipe(report.mapping)} | ${resolved.background} / ${resolved.surface} / ${resolved.accent} / ${resolved.chart} / ${resolved.text} | ${ratio(ratios.textBackground)} / ${ratio(ratios.textSurface)} / ${ratio(ratios.accentSurface)} / ${ratio(ratios.chartBackground)} | ${report.valid ? "適合" : `要修正: ${report.failures.join(", ")}`} | ${palette.description} |`,
    );
  }
  lines.push("");
}

function renderFragranceSection(lines, model) {
  lines.push(
    `## P-1 香調語彙と素材（${approvalStatus(model.approvals, "P-1")}）`,
    "",
  );
  const sceneById = new Map(
    model.definitionSet.scenes.map((scene) => [scene.sceneId, scene]),
  );
  const materialById = new Map(
    model.definitionSet.fragranceMaterials.map((material) => [
      material.materialId,
      material,
    ]),
  );
  for (const fragrance of model.definitionSet.fragrances) {
    const materialNames = fragrance.materialIds.map((materialId) => {
      const material = materialById.get(materialId);
      if (!material) invalidReview();
      return material.displayName;
    });
    lines.push(
      `### ${fragrance.accordLabel}（\`${fragrance.fragranceId}\`）`,
      "",
      `- 場面: ${sceneById.get(fragrance.sceneId)?.label ?? fragrance.sceneId}`,
      `- 説明: ${fragrance.description}`,
      `- 素材例: ${materialNames.join("、")}`,
      `- 共有投影: ${fragrance.accordLabel}`,
      `- 注意書きID: \`${fragrance.disclaimerId}\``,
      "",
    );
  }
}

function renderTitleGate(lines, model, gate) {
  lines.push(
    `## ${gate.gateId} ${gate.label}（${approvalStatus(model.approvals, gate.gateId)}）`,
    "",
  );
  const materialById = new Map(
    model.definitionSet.fragranceMaterials.map((material) => [
      material.materialId,
      material,
    ]),
  );
  for (let order = gate.start; order <= gate.end; order += 1) {
    const title = model.titleProfiles[order - 1];
    const selection = selectPresentation(title, model.definitionSet);
    const share = summarizeFragrances(selection.fragranceScenes);
    lines.push(
      `### ${order}. ${title.label} (\`${title.titleId}\`)`,
      "",
      `- 標準パレット: ${selection.palettes.standard.label} (\`${selection.palettes.standard.paletteId}\`)`,
      `- 代替パレット1: ${selection.palettes.alternatives[0].label} (\`${selection.palettes.alternatives[0].paletteId}\`)`,
      `- 代替パレット2: ${selection.palettes.alternatives[1].label} (\`${selection.palettes.alternatives[1].paletteId}\`)`,
      "",
    );
    for (const [sceneIndex, scene] of selection.fragranceScenes.entries()) {
      lines.push(`#### ${scene.label}（${scene.sceneId}）`, "");
      for (const fragrance of scene.candidates) {
        const materialNames = fragrance.materialIds.map((materialId) => {
          const material = materialById.get(materialId);
          if (!material) invalidReview();
          return material.displayName;
        });
        lines.push(
          `- 香り候補: ${fragrance.accordLabel} (\`${fragrance.fragranceId}\`)`,
          `- 素材例: ${materialNames.join("、")}`,
        );
      }
      lines.push(`- 共有サマリ: ${share[sceneIndex].accordLabel}`, "");
    }
  }
}

export function renderPresentationReview({
  definitionSet,
  titleProfiles,
  contrastReports,
  approvals,
}) {
  if (!definitionSet || !Array.isArray(titleProfiles) ||
    !Array.isArray(contrastReports) || !Array.isArray(approvals)) {
    invalidReview();
  }
  const lines = [
    "# Q-013 Presentation v2 承認レビュー",
    "",
    "正典: content/source/presentation/presentation-v2/*.csv",
    "",
    "本書は承認用の生成ビューであり、手編集しない。",
    "",
    "すべての行とP-0〜P-6は未承認のドラフトであり、本書の生成は承認またはruntime有効化を意味しない。",
    "",
  ];
  renderPaletteSection(lines, {
    definitionSet,
    titleProfiles,
    contrastReports,
    approvals,
  });
  renderFragranceSection(lines, {
    definitionSet,
    titleProfiles,
    contrastReports,
    approvals,
  });
  for (const gate of GATES.slice(2)) {
    renderTitleGate(lines, {
      definitionSet,
      titleProfiles,
      contrastReports,
      approvals,
    }, gate);
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!["--source", "--output"].includes(key) || typeof value !== "string" ||
      value.startsWith("--") || Object.hasOwn(values, key)) {
      invalidReview();
    }
    values[key] = value;
  }
  if (argv.length !== 4 || !values["--source"] || !values["--output"]) {
    invalidReview();
  }
  return values;
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  const model = await loadPresentationReviewModel({
    sourceDir: path.resolve(args["--source"]),
  });
  const markdown = renderPresentationReview(model);
  await writeFile(path.resolve(args["--output"]), markdown, "utf8");
}

if (process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
