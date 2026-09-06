import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { selectPresentation } from "../../app/js/domain/presentation-selector.js";
import { summarizeFragrances } from "../../app/js/domain/share-fragrance-summary.js";
import { auditFragranceVariation } from "./audit-fragrance-variation.mjs";
import { loadPresentationReviewModel } from "./render-presentation-review.mjs";

const MASTER_CHANGES = Object.freeze([
  Object.freeze({
    before: "fragrance-pause-roman-chamomile-soft",
    after: "fragrance-pause-roman-chamomileへ統合",
    reason: "同一素材・近接表現の重複",
  }),
  Object.freeze({
    before: "fragrance-pause-chamomile / material-chamomile",
    after: "削除",
    reason: "カモミール種別が曖昧",
  }),
  Object.freeze({
    before: "fragrance-pause-ylang-ylang",
    after: "fragrance-pause-sweet-orange",
    reason: "pauseには濃厚すぎる",
  }),
  Object.freeze({
    before: "fragrance-reset-citronella",
    after: "fragrance-reset-ginger",
    reason: "虫よけ用品の連想を避ける",
  }),
  Object.freeze({
    before: "fragrance-pause-patchouli",
    after: "削除（quiet-focusだけ維持）",
    reason: "深く落ち着く香りをquiet-focusへ限定",
  }),
]);

function invalidReview() {
  throw new TypeError("KOKORO_AROMA_REVIEW_INVALID");
}

function escapeCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", "<br>");
}

function table(lines, headers, rows) {
  lines.push(
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
  );
  for (const row of rows) {
    lines.push(`| ${row.map(escapeCell).join(" | ")} |`);
  }
  lines.push("");
}

export async function loadKokoroAromaReviewModel({ sourceDir }) {
  const presentation = await loadPresentationReviewModel({ sourceDir });
  const audit = auditFragranceVariation(presentation.definitionSet);
  if (!audit.valid) invalidReview();
  return Object.freeze({ ...presentation, audit });
}

export function renderKokoroAromaReview(model) {
  if (!model?.definitionSet || !Array.isArray(model.titleProfiles) ||
    !Array.isArray(model.approvals) || !model.audit?.valid) {
    invalidReview();
  }
  const { definitionSet, titleProfiles, approvals, audit } = model;
  const materialById = new Map(
    definitionSet.fragranceMaterials.map((material) => [
      material.materialId,
      material,
    ]),
  );
  const sceneById = new Map(
    definitionSet.scenes.map((scene) => [scene.sceneId, scene]),
  );
  const fragranceById = new Map(
    definitionSet.fragrances.map((fragrance) => [
      fragrance.fragranceId,
      fragrance,
    ]),
  );
  const lines = [
    "# ココロアロマ確認資料",
    "",
    "正典: `content/source/presentation/presentation-v2/*.csv`",
    "",
    "本書は香りの語彙・素材・称号別割り当てを確認する決定的な生成ビューです。生成しただけでは承認やruntime接続を意味しません。",
    "",
    "香りは称号から着想した非診断的な演出であり、効果・適合・商品・使用方法の案内ではありません。",
    "",
    "## マスタ変更前後",
    "",
  ];
  table(lines, ["変更前", "変更後", "理由"], MASTER_CHANGES.map((change) => [
    change.before,
    change.after,
    change.reason,
  ]));

  lines.push("## 3場面", "");
  table(lines, ["順", "scene ID", "表示名", "icon ID"],
    definitionSet.scenes.map((scene, index) => [
      index + 1,
      `\`${scene.sceneId}\``,
      scene.label,
      `\`${scene.iconId}\``,
    ]));

  lines.push(`## 香調マスタ（${definitionSet.fragrances.length}件）`, "");
  table(lines, [
    "順",
    "香調ID",
    "場面",
    "family",
    "素材例",
    "短い印象",
    "説明",
  ], definitionSet.fragrances.map((fragrance, index) => [
    index + 1,
    `\`${fragrance.fragranceId}\``,
    sceneById.get(fragrance.sceneId)?.label ?? fragrance.sceneId,
    `\`${fragrance.familyId}\``,
    fragrance.materialIds.map((materialId) =>
      materialById.get(materialId)?.displayName ?? materialId).join("・"),
    fragrance.accordLabel,
    fragrance.description,
  ]));

  lines.push(`## 香り素材（${definitionSet.fragranceMaterials.length}件）`, "");
  table(lines, ["順", "素材ID", "表示名", "使用場面"],
    definitionSet.fragranceMaterials.map((material, index) => {
      const usage = audit.usage.materials.find(({ materialId }) =>
        materialId === material.materialId);
      return [
        index + 1,
        `\`${material.materialId}\``,
        material.displayName,
        usage.sceneIds.map((sceneId) =>
          sceneById.get(sceneId)?.label ?? sceneId).join("・"),
      ];
    }));

  lines.push("## 51称号の候補と共有カード代表", "");
  titleProfiles.forEach((title, titleIndex) => {
    const selection = selectPresentation(title, definitionSet);
    const summary = summarizeFragrances(selection.fragranceScenes);
    lines.push(
      `### ${titleIndex + 1}. ${title.label} (\`${title.titleId}\`)`,
      "",
    );
    for (const [sceneIndex, scene] of selection.fragranceScenes.entries()) {
      lines.push(`#### ${scene.label} (\`${scene.sceneId}\`)`, "");
      for (const candidate of scene.candidates) {
        const selected = candidate.fragranceId ===
          scene.shareRepresentative.fragranceId;
        lines.push(
          `- ${selected ? "★ 共有代表" : "候補"}: ${candidate.materialNames.join("・")}｜${candidate.accordLabel} (\`${candidate.fragranceId}\`)`,
        );
      }
      lines.push(
        `- 共有カード: ${summary[sceneIndex].materialNames.join("・")}｜${summary[sceneIndex].accordLabel}`,
        "",
      );
    }
  });

  lines.push("## 使用回数", "", "### 香調", "");
  table(lines, ["香調ID", "候補採用称号数", "共有代表称号数"],
    audit.usage.fragrances.map((usage) => [
      `\`${usage.fragranceId}\``,
      usage.candidateTitleCount,
      usage.shareTitleCount,
    ]));
  lines.push("### 素材", "");
  table(lines, ["素材ID", "採用称号数", "使用場面"],
    audit.usage.materials.map((usage) => [
      `\`${usage.materialId}\``,
      usage.titleCount,
      usage.sceneIds.join("・"),
    ]));
  lines.push("### family", "");
  table(lines, ["family", "候補採用称号数"],
    audit.usage.families.map((usage) => [
      `\`${usage.familyId}\``,
      usage.candidateTitleCount,
    ]));
  lines.push("### 共有代表3件の組み合わせ", "");
  table(lines, ["代表3件", "称号数"],
    audit.usage.shareTriples.map((usage) => [
      usage.fragranceIds.map((fragranceId) =>
        fragranceById.get(fragranceId)?.accordLabel ?? fragranceId).join(" / "),
      usage.count,
    ]));

  lines.push(
    "## 機械監査",
    "",
    `- 判定: ${audit.valid ? "適合" : "不適合"}`,
    `- 違反: ${audit.findings.length}件`,
    `- 香調: ${definitionSet.fragrances.length}件`,
    `- 素材: ${definitionSet.fragranceMaterials.length}件`,
    `- 称号: ${titleProfiles.length}件`,
    `- 関連行: ${titleProfiles.length * 3 * 2}件`,
    "",
    "## 承認gateの現在値",
    "",
  );
  table(lines, ["gate", "scope", "status"], approvals
    .filter(({ gate_id }) => gate_id !== "P-0")
    .map((approval) => [
      approval.gate_id,
      approval.scope,
      approval.status,
    ]));
  return `${lines.join("\n").trimEnd()}\n`;
}

function parseArguments(argv) {
  if (argv.length !== 4 || argv[0] !== "--source" ||
    argv[2] !== "--output" || !argv[1] || !argv[3]) {
    invalidReview();
  }
  return { sourceDir: path.resolve(argv[1]), outputPath: path.resolve(argv[3]) };
}

async function main() {
  const { sourceDir, outputPath } = parseArguments(process.argv.slice(2));
  const model = await loadKokoroAromaReviewModel({ sourceDir });
  await writeFile(outputPath, renderKokoroAromaReview(model), "utf8");
}

if (process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
