import { lintPresentationCopy } from "../../app/js/domain/presentation-definition-validator.js";

export const FRAGRANCE_VARIATION_LIMITS = Object.freeze({
  shareTripleTitles: 3,
  candidateTitlesPerFragrance: 12,
  shareTitlesPerFragrance: 8,
  scenesPerMaterial: 2,
  shareMaterialCodePoints: 22,
  shareAccordCodePoints: 22,
});

export const FRAGRANCE_VARIATION_CODES = Object.freeze([
  "FRAGRANCE_TITLE_MATERIAL_DUPLICATE",
  "FRAGRANCE_TITLE_SET_DUPLICATE",
  "FRAGRANCE_SCENE_FAMILY_DUPLICATE",
  "FRAGRANCE_SHARE_TRIPLE_OVERUSED",
  "FRAGRANCE_USAGE_OVER_LIMIT",
  "FRAGRANCE_SCENE_REUSE_OVER_LIMIT",
  "FRAGRANCE_SCENE_COPY_DUPLICATE",
  "FRAGRANCE_PROHIBITED_COPY",
  "FRAGRANCE_SHARE_COPY_OVERFLOW",
]);

function invalidAudit() {
  throw new TypeError("FRAGRANCE_VARIATION_AUDIT_INVALID");
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function addToMapSet(map, key, value) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

function finding(code, {
  titleIds = [],
  sceneIds = [],
  fragranceIds = [],
  materialIds = [],
  detail = "",
} = {}) {
  return { code, titleIds, sceneIds, fragranceIds, materialIds, detail };
}

function codePointLength(value) {
  return Array.from(value).length;
}

function compareByOrder(orderById, left, right) {
  return (orderById.get(left) ?? Number.MAX_SAFE_INTEGER) -
    (orderById.get(right) ?? Number.MAX_SAFE_INTEGER) ||
    left.localeCompare(right);
}

export function auditFragranceVariation(definitionSet) {
  if (!isRecord(definitionSet) ||
    !Array.isArray(definitionSet.scenes) ||
    !Array.isArray(definitionSet.fragrances) ||
    !Array.isArray(definitionSet.fragranceMaterials) ||
    !Array.isArray(definitionSet.titleSelectors)) {
    invalidAudit();
  }

  const sceneOrder = new Map(
    definitionSet.scenes.map(({ sceneId }, index) => [sceneId, index]),
  );
  const titleOrder = new Map(
    definitionSet.titleSelectors.map(({ titleId }, index) => [titleId, index]),
  );
  const fragranceOrder = new Map(
    definitionSet.fragrances.map(({ fragranceId }, index) => [fragranceId, index]),
  );
  const fragranceById = new Map(
    definitionSet.fragrances.map((fragrance) => [fragrance.fragranceId, fragrance]),
  );
  const materialById = new Map(
    definitionSet.fragranceMaterials.map((material) => [material.materialId, material]),
  );
  if (sceneOrder.size !== definitionSet.scenes.length ||
    titleOrder.size !== definitionSet.titleSelectors.length ||
    fragranceById.size !== definitionSet.fragrances.length ||
    materialById.size !== definitionSet.fragranceMaterials.length) {
    invalidAudit();
  }

  const findings = [];
  const candidateTitlesByFragrance = new Map();
  const shareTitlesByFragrance = new Map();
  const candidateTitlesByFamily = new Map();
  const titleSets = new Map();
  const shareTriples = new Map();
  const materialScenes = new Map();
  const materialTitles = new Map();

  for (const fragrance of definitionSet.fragrances) {
    for (const materialId of fragrance.materialIds) {
      addToMapSet(materialScenes, materialId, fragrance.sceneId);
    }
  }

  for (const selector of definitionSet.titleSelectors) {
    const titleMaterialFragrances = new Map();
    const sixFragranceIds = [];
    const shareFragranceIds = [];

    for (const scene of selector.fragranceScenes) {
      const candidates = scene.candidateFragranceIds.map((fragranceId) => {
        const fragrance = fragranceById.get(fragranceId);
        if (!fragrance || fragrance.sceneId !== scene.sceneId) invalidAudit();
        return fragrance;
      });
      if (candidates.length !== 2) invalidAudit();
      sixFragranceIds.push(...scene.candidateFragranceIds);
      const share = fragranceById.get(scene.shareFragranceId);
      if (!share || !scene.candidateFragranceIds.includes(scene.shareFragranceId)) {
        invalidAudit();
      }
      shareFragranceIds.push(scene.shareFragranceId);

      if (candidates[0].familyId === candidates[1].familyId) {
        findings.push(finding("FRAGRANCE_SCENE_FAMILY_DUPLICATE", {
          titleIds: [selector.titleId],
          sceneIds: [scene.sceneId],
          fragranceIds: scene.candidateFragranceIds,
          detail: `familyId=${candidates[0].familyId}`,
        }));
      }

      for (const fragrance of candidates) {
        addToMapSet(candidateTitlesByFragrance, fragrance.fragranceId, selector.titleId);
        addToMapSet(candidateTitlesByFamily, fragrance.familyId, selector.titleId);
        for (const materialId of fragrance.materialIds) {
          if (!titleMaterialFragrances.has(materialId)) {
            titleMaterialFragrances.set(materialId, []);
          }
          titleMaterialFragrances.get(materialId).push(fragrance.fragranceId);
          addToMapSet(materialTitles, materialId, selector.titleId);
        }
      }
      addToMapSet(shareTitlesByFragrance, share.fragranceId, selector.titleId);

      const materialNames = share.materialIds.map((materialId) => {
        const material = materialById.get(materialId);
        if (!material) invalidAudit();
        return material.displayName;
      });
      const joinedMaterials = materialNames.join("・");
      if (codePointLength(joinedMaterials) >
          FRAGRANCE_VARIATION_LIMITS.shareMaterialCodePoints ||
        codePointLength(share.accordLabel) >
          FRAGRANCE_VARIATION_LIMITS.shareAccordCodePoints) {
        findings.push(finding("FRAGRANCE_SHARE_COPY_OVERFLOW", {
          titleIds: [selector.titleId],
          sceneIds: [scene.sceneId],
          fragranceIds: [share.fragranceId],
          materialIds: share.materialIds,
          detail: `materials=${codePointLength(joinedMaterials)},accord=${codePointLength(share.accordLabel)}`,
        }));
      }
    }

    for (const [materialId, fragranceIds] of titleMaterialFragrances) {
      if (fragranceIds.length > 1) {
        findings.push(finding("FRAGRANCE_TITLE_MATERIAL_DUPLICATE", {
          titleIds: [selector.titleId],
          fragranceIds: [...new Set(fragranceIds)].sort((left, right) =>
            compareByOrder(fragranceOrder, left, right)),
          materialIds: [materialId],
          detail: `occurrences=${fragranceIds.length}`,
        }));
      }
    }

    const titleSetKey = sixFragranceIds.join("\u0000");
    if (!titleSets.has(titleSetKey)) {
      titleSets.set(titleSetKey, { fragranceIds: sixFragranceIds, titleIds: [] });
    }
    titleSets.get(titleSetKey).titleIds.push(selector.titleId);

    const shareKey = shareFragranceIds.join("\u0000");
    if (!shareTriples.has(shareKey)) {
      shareTriples.set(shareKey, { fragranceIds: shareFragranceIds, titleIds: [] });
    }
    shareTriples.get(shareKey).titleIds.push(selector.titleId);
  }

  for (const { fragranceIds, titleIds } of titleSets.values()) {
    if (titleIds.length > 1) {
      findings.push(finding("FRAGRANCE_TITLE_SET_DUPLICATE", {
        titleIds,
        fragranceIds,
        detail: `titles=${titleIds.length}`,
      }));
    }
  }
  for (const { fragranceIds, titleIds } of shareTriples.values()) {
    if (titleIds.length > FRAGRANCE_VARIATION_LIMITS.shareTripleTitles) {
      findings.push(finding("FRAGRANCE_SHARE_TRIPLE_OVERUSED", {
        titleIds,
        fragranceIds,
        detail: `titles=${titleIds.length},limit=${FRAGRANCE_VARIATION_LIMITS.shareTripleTitles}`,
      }));
    }
  }

  for (const fragrance of definitionSet.fragrances) {
    const candidateCount =
      candidateTitlesByFragrance.get(fragrance.fragranceId)?.size ?? 0;
    const shareCount = shareTitlesByFragrance.get(fragrance.fragranceId)?.size ?? 0;
    if (candidateCount > FRAGRANCE_VARIATION_LIMITS.candidateTitlesPerFragrance) {
      findings.push(finding("FRAGRANCE_USAGE_OVER_LIMIT", {
        titleIds: [...candidateTitlesByFragrance.get(fragrance.fragranceId)],
        sceneIds: [fragrance.sceneId],
        fragranceIds: [fragrance.fragranceId],
        detail: `candidate=${candidateCount},limit=${FRAGRANCE_VARIATION_LIMITS.candidateTitlesPerFragrance}`,
      }));
    }
    if (shareCount > FRAGRANCE_VARIATION_LIMITS.shareTitlesPerFragrance) {
      findings.push(finding("FRAGRANCE_USAGE_OVER_LIMIT", {
        titleIds: [...shareTitlesByFragrance.get(fragrance.fragranceId)],
        sceneIds: [fragrance.sceneId],
        fragranceIds: [fragrance.fragranceId],
        detail: `share=${shareCount},limit=${FRAGRANCE_VARIATION_LIMITS.shareTitlesPerFragrance}`,
      }));
    }
  }

  for (const [materialId, sceneIds] of materialScenes) {
    if (sceneIds.size > FRAGRANCE_VARIATION_LIMITS.scenesPerMaterial) {
      findings.push(finding("FRAGRANCE_SCENE_REUSE_OVER_LIMIT", {
        sceneIds: [...sceneIds].sort((left, right) =>
          compareByOrder(sceneOrder, left, right)),
        materialIds: [materialId],
        detail: `scenes=${sceneIds.size},limit=${FRAGRANCE_VARIATION_LIMITS.scenesPerMaterial}`,
      }));
    }
  }

  const copies = new Map();
  for (const fragrance of definitionSet.fragrances) {
    const key = `${fragrance.accordLabel}\u0000${fragrance.description}`;
    if (!copies.has(key)) copies.set(key, []);
    copies.get(key).push(fragrance);
  }
  for (const fragrances of copies.values()) {
    const sceneIds = [...new Set(fragrances.map(({ sceneId }) => sceneId))];
    if (sceneIds.length > 1) {
      findings.push(finding("FRAGRANCE_SCENE_COPY_DUPLICATE", {
        sceneIds: sceneIds.sort((left, right) =>
          compareByOrder(sceneOrder, left, right)),
        fragranceIds: fragrances.map(({ fragranceId }) => fragranceId),
        detail: "accordLabel+description",
      }));
    }
  }

  const fragranceIds = new Set(definitionSet.fragrances.map(({ fragranceId }) =>
    fragranceId));
  const materialIds = new Set(definitionSet.fragranceMaterials.map(({ materialId }) =>
    materialId));
  for (const copyFinding of lintPresentationCopy(definitionSet)) {
    if (!fragranceIds.has(copyFinding.definitionId) &&
      !materialIds.has(copyFinding.definitionId)) {
      continue;
    }
    findings.push(finding("FRAGRANCE_PROHIBITED_COPY", {
      fragranceIds: fragranceIds.has(copyFinding.definitionId)
        ? [copyFinding.definitionId]
        : [],
      materialIds: materialIds.has(copyFinding.definitionId)
        ? [copyFinding.definitionId]
        : [],
      detail: `${copyFinding.field}:${copyFinding.code}`,
    }));
  }

  const codeOrder = new Map(
    FRAGRANCE_VARIATION_CODES.map((code, index) => [code, index]),
  );
  findings.sort((left, right) =>
    codeOrder.get(left.code) - codeOrder.get(right.code) ||
    compareByOrder(titleOrder, left.titleIds[0] ?? "", right.titleIds[0] ?? "") ||
    compareByOrder(sceneOrder, left.sceneIds[0] ?? "", right.sceneIds[0] ?? "") ||
    compareByOrder(
      fragranceOrder,
      left.fragranceIds[0] ?? "",
      right.fragranceIds[0] ?? "",
    ) ||
    left.detail.localeCompare(right.detail));

  const usage = {
    fragrances: definitionSet.fragrances.map(({ fragranceId, sceneId, familyId }) => ({
      fragranceId,
      sceneId,
      familyId,
      candidateTitleCount: candidateTitlesByFragrance.get(fragranceId)?.size ?? 0,
      shareTitleCount: shareTitlesByFragrance.get(fragranceId)?.size ?? 0,
    })),
    materials: definitionSet.fragranceMaterials.map(({ materialId }) => ({
      materialId,
      sceneIds: [...(materialScenes.get(materialId) ?? [])].sort((left, right) =>
        compareByOrder(sceneOrder, left, right)),
      titleCount: materialTitles.get(materialId)?.size ?? 0,
    })),
    families: [...new Set(definitionSet.fragrances.map(({ familyId }) => familyId))]
      .map((familyId) => ({
        familyId,
        candidateTitleCount: candidateTitlesByFamily.get(familyId)?.size ?? 0,
      })),
    shareTriples: [...shareTriples.values()].map(({ fragranceIds, titleIds }) => ({
      fragranceIds,
      titleIds,
      count: titleIds.length,
    })),
  };

  return deepFreeze({
    valid: findings.length === 0,
    findings,
    usage,
  });
}
