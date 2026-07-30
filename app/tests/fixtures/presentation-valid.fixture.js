const SCENES = [
  { sceneId: "pause", label: "ひと息つきたい" },
  { sceneId: "reset", label: "気持ちを切り替えたい" },
  { sceneId: "quiet-focus", label: "静かに取り組みたい" },
];

const sceneSuffix = {
  pause: "pause",
  reset: "reset",
  "quiet-focus": "quiet-focus",
};

function palette(paletteId, version) {
  return {
    paletteId,
    version,
    label: "Fixture palette",
    baseColors: { primary: "#123456", secondary: "#ABCDEF", accent: "#7890AB" },
    description: "A quiet visual tone.",
  };
}

function fragrance(fragranceId, version, sceneId, materialIds) {
  return {
    fragranceId,
    version,
    sceneId,
    accordLabel: "Fixture accord",
    description: "An atmospheric suggestion.",
    ...(materialIds ? { materialIds } : {}),
    disclaimerId: "fragrance-disclaimer-v1",
  };
}

function paletteUsageMapping(paletteId, version) {
  return {
    paletteId,
    version,
    roles: {
      background: { source: "primary", mixWith: "white", mixPercent: 88 },
      surface: { source: "secondary", mixWith: "white", mixPercent: 94 },
      accent: { source: "accent", mixWith: "none", mixPercent: 0 },
      chart: { source: "primary", mixWith: "black", mixPercent: 12 },
    },
    textCandidates: ["#1F2430", "#FFFFFF"],
  };
}

function fragranceMaterial(materialId, version, displayName, materialKind) {
  return { materialId, version, displayName, materialKind };
}

export function makeValidPresentationDefinitionSet(titleProfiles, { schemaVersion = 1, version = "presentation-v1" } = {}) {
  const palettes = [palette("palette-default", version)];
  const fragrances = [];
  const fragranceMaterials = [];
  const titleSelectors = titleProfiles.map((profile, titleIndex) => {
    const alternativePaletteIds = [
      `palette-title-${titleIndex + 1}-a`,
      `palette-title-${titleIndex + 1}-b`,
    ];
    palettes.push(...alternativePaletteIds.map((paletteId) => palette(paletteId, version)));

    const fragranceScenes = SCENES.map(({ sceneId }) => {
      const candidateFragranceIds = [
        `fragrance-${sceneSuffix[sceneId]}-title-${titleIndex + 1}-a`,
        `fragrance-${sceneSuffix[sceneId]}-title-${titleIndex + 1}-b`,
      ];
      for (const fragranceId of candidateFragranceIds) {
        const materialIndex = String(fragranceMaterials.length / 2 + 1).padStart(4, "0");
        const materialIds = [`material-${materialIndex}-a`, `material-${materialIndex}-b`];
        if (schemaVersion === 2) {
          fragranceMaterials.push(
            fragranceMaterial(materialIds[0], version, "Lavender", "plant-name"),
            fragranceMaterial(materialIds[1], version, "Lavender essential oil", "essential-oil-name"),
          );
        }
        fragrances.push(fragrance(fragranceId, version, sceneId, schemaVersion === 2 ? materialIds : undefined));
      }
      return { sceneId, candidateFragranceIds, shareFragranceId: candidateFragranceIds[0] };
    });

    return { titleId: profile.titleId, alternativePaletteIds, fragranceScenes };
  });

  return {
    schemaVersion,
    presentationDefinitionVersion: version,
    scenes: structuredClone(SCENES),
    palettes,
    ...(schemaVersion === 2 ? { paletteUsageMappings: palettes.map(({ paletteId }) => paletteUsageMapping(paletteId, version)) } : {}),
    fragrances,
    ...(schemaVersion === 2 ? { fragranceMaterials } : {}),
    titleSelectors,
  };
}
