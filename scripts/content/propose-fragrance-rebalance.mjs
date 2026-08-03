import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  auditFragranceVariation,
  FRAGRANCE_VARIATION_LIMITS,
} from "./audit-fragrance-variation.mjs";
import {
  loadPresentationReviewModel,
} from "./render-presentation-review.mjs";

function invalidProposal() {
  throw new TypeError("FRAGRANCE_REBALANCE_UNSATISFIABLE");
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

function orderedPairs(fragrances) {
  const pairs = [];
  for (const first of fragrances) {
    for (const second of fragrances) {
      if (first.fragranceId === second.fragranceId ||
        first.familyId === second.familyId ||
        first.materialIds.some((materialId) =>
          second.materialIds.includes(materialId))) {
        continue;
      }
      pairs.push([first, second]);
    }
  }
  return pairs;
}

function rotationDistance(index, origin, length) {
  return (index - origin + length) % length;
}

function rankPairs(pairs, usage, titleIndex, sceneIndex, seed) {
  const origin = (titleIndex * [5, 7, 11][sceneIndex] + seed) % pairs.length;
  return pairs
    .map((pair, index) => ({ pair, index }))
    .filter(({ pair }) => pair.every(({ fragranceId }) =>
      (usage.get(fragranceId) ?? 0) <
        FRAGRANCE_VARIATION_LIMITS.candidateTitlesPerFragrance))
    .sort((left, right) => {
      const leftCounts = left.pair.map(({ fragranceId }) =>
        usage.get(fragranceId) ?? 0);
      const rightCounts = right.pair.map(({ fragranceId }) =>
        usage.get(fragranceId) ?? 0);
      return Math.max(...leftCounts) - Math.max(...rightCounts) ||
        leftCounts[0] + leftCounts[1] - rightCounts[0] - rightCounts[1] ||
        rotationDistance(left.index, origin, pairs.length) -
          rotationDistance(right.index, origin, pairs.length);
    });
}

function chooseTitlePairs({
  pairsByScene,
  usage,
  titleIndex,
  seed,
  usedTitleSets,
}) {
  const selected = [];
  const materialIds = new Set();

  function visit(sceneIndex) {
    if (sceneIndex === pairsByScene.length) {
      const key = selected.flat().map(({ fragranceId }) => fragranceId)
        .join("\u0000");
      return usedTitleSets.has(key) ? null : {
        pairs: selected.map((pair) => [...pair]),
        key,
      };
    }

    const ranked = rankPairs(
      pairsByScene[sceneIndex],
      usage,
      titleIndex,
      sceneIndex,
      seed,
    );
    for (const { pair } of ranked) {
      const pairMaterials = pair.flatMap(({ materialIds: ids }) => ids);
      if (pairMaterials.some((materialId) => materialIds.has(materialId))) {
        continue;
      }
      selected.push(pair);
      pairMaterials.forEach((materialId) => materialIds.add(materialId));
      const result = visit(sceneIndex + 1);
      if (result) return result;
      selected.pop();
      pairMaterials.forEach((materialId) => materialIds.delete(materialId));
    }
    return null;
  }

  return visit(0);
}

function assignCandidates(definitionSet, seed) {
  const fragrancesByScene = new Map(definitionSet.scenes.map(({ sceneId }) => [
    sceneId,
    definitionSet.fragrances.filter((fragrance) =>
      fragrance.sceneId === sceneId),
  ]));
  const pairsByScene = definitionSet.scenes.map(({ sceneId }) =>
    orderedPairs(fragrancesByScene.get(sceneId)));
  if (pairsByScene.some((pairs) => pairs.length === 0)) invalidProposal();

  const usage = new Map();
  const usedTitleSets = new Set();
  const assignments = [];
  for (const [titleIndex, selector] of definitionSet.titleSelectors.entries()) {
    const choice = chooseTitlePairs({
      pairsByScene,
      usage,
      titleIndex,
      seed,
      usedTitleSets,
    });
    if (!choice) return null;
    usedTitleSets.add(choice.key);
    choice.pairs.flat().forEach(({ fragranceId }) =>
      usage.set(fragranceId, (usage.get(fragranceId) ?? 0) + 1));
    assignments.push({
      titleId: selector.titleId,
      pairs: choice.pairs,
    });
  }
  return assignments;
}

function assignShareRepresentatives(assignments, seed) {
  const shareUsage = new Map();
  const tripleUsage = new Map();
  return assignments.map((assignment, titleIndex) => {
    const masks = Array.from({ length: 8 }, (_, mask) => mask)
      .map((mask) => {
        const selected = assignment.pairs.map((pair, sceneIndex) =>
          pair[(mask >> sceneIndex) & 1]);
        const tripleKey = selected.map(({ fragranceId }) => fragranceId)
          .join("\u0000");
        return {
          mask,
          selected,
          tripleKey,
          counts: selected.map(({ fragranceId }) =>
            shareUsage.get(fragranceId) ?? 0),
          tripleCount: tripleUsage.get(tripleKey) ?? 0,
        };
      })
      .filter(({ selected, tripleCount }) =>
        tripleCount < FRAGRANCE_VARIATION_LIMITS.shareTripleTitles &&
        selected.every(({ fragranceId }) =>
          (shareUsage.get(fragranceId) ?? 0) <
            FRAGRANCE_VARIATION_LIMITS.shareTitlesPerFragrance))
      .sort((left, right) =>
        Math.max(...left.counts) - Math.max(...right.counts) ||
        left.counts.reduce((sum, count) => sum + count, 0) -
          right.counts.reduce((sum, count) => sum + count, 0) ||
        left.tripleCount - right.tripleCount ||
        rotationDistance(left.mask, (titleIndex + seed) % 8, 8) -
          rotationDistance(right.mask, (titleIndex + seed) % 8, 8));
    if (masks.length === 0) return null;
    const choice = masks[0];
    choice.selected.forEach(({ fragranceId }) =>
      shareUsage.set(fragranceId, (shareUsage.get(fragranceId) ?? 0) + 1));
    tripleUsage.set(choice.tripleKey,
      (tripleUsage.get(choice.tripleKey) ?? 0) + 1);
    return {
      titleId: assignment.titleId,
      pairs: assignment.pairs,
      shareFragranceIds: choice.selected.map(({ fragranceId }) => fragranceId),
    };
  });
}

function toTitleSelectors(definitionSet, assignments) {
  return assignments.map((assignment, titleIndex) => ({
    titleId: assignment.titleId,
    alternativePaletteIds: [
      ...definitionSet.titleSelectors[titleIndex].alternativePaletteIds,
    ],
    fragranceScenes: definitionSet.scenes.map(({ sceneId }, sceneIndex) => ({
      sceneId,
      candidateFragranceIds: assignment.pairs[sceneIndex]
        .map(({ fragranceId }) => fragranceId),
      shareFragranceId: assignment.shareFragranceIds[sceneIndex],
    })),
  }));
}

export function proposeFragranceRebalance(definitionSet) {
  for (let seed = 0; seed < 1000; seed += 1) {
    const candidates = assignCandidates(definitionSet, seed);
    if (!candidates) continue;
    const assignments = assignShareRepresentatives(candidates, seed);
    if (!assignments || assignments.some((assignment) => assignment === null)) {
      continue;
    }
    const titleSelectors = toTitleSelectors(definitionSet, assignments);
    const proposedDefinition = { ...definitionSet, titleSelectors };
    const audit = auditFragranceVariation(proposedDefinition);
    if (audit.valid) return deepFreeze({ seed, titleSelectors, audit });
  }
  invalidProposal();
}

export function renderSelectorFragrancesCsv(titleSelectors) {
  const lines = [
    "title_id,scene_id,display_order,fragrance_id,share_selected,status",
  ];
  for (const selector of titleSelectors) {
    for (const scene of selector.fragranceScenes) {
      scene.candidateFragranceIds.forEach((fragranceId, index) => {
        lines.push([
          selector.titleId,
          scene.sceneId,
          index + 1,
          fragranceId,
          fragranceId === scene.shareFragranceId ? "true" : "false",
          "draft",
        ].join(","));
      });
    }
  }
  return `${lines.join("\r\n")}\r\n`;
}

function parseArguments(argv) {
  if (argv.length !== 4 || argv[0] !== "--source" ||
    argv[2] !== "--output" || !argv[1] || !argv[3]) {
    throw new TypeError("FRAGRANCE_REBALANCE_ARGUMENT_INVALID");
  }
  return { sourceDir: path.resolve(argv[1]), outputPath: path.resolve(argv[3]) };
}

async function main() {
  const { sourceDir, outputPath } = parseArguments(process.argv.slice(2));
  const canonicalPath = path.join(
    sourceDir,
    "presentation/presentation-v2/selector-fragrances.csv",
  );
  if (outputPath === canonicalPath) {
    throw new TypeError("FRAGRANCE_REBALANCE_OUTPUT_FORBIDDEN");
  }
  const model = await loadPresentationReviewModel({ sourceDir });
  const proposal = proposeFragranceRebalance(model.definitionSet);
  await writeFile(
    outputPath,
    renderSelectorFragrancesCsv(proposal.titleSelectors),
    "utf8",
  );
}

if (process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
