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

function fragrance(fragranceId, version, sceneId) {
  return {
    fragranceId,
    version,
    sceneId,
    accordLabel: "Fixture accord",
    description: "An atmospheric suggestion.",
    disclaimerId: "fragrance-disclaimer-v1",
  };
}

export function makeValidPresentationDefinitionSet(titleProfiles) {
  const version = "presentation-v1";
  const palettes = [palette("palette-default", version)];
  const fragrances = [];
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
      fragrances.push(...candidateFragranceIds.map((fragranceId) => fragrance(fragranceId, version, sceneId)));
      return { sceneId, candidateFragranceIds, shareFragranceId: candidateFragranceIds[0] };
    });

    return { titleId: profile.titleId, alternativePaletteIds, fragranceScenes };
  });

  return {
    schemaVersion: 1,
    presentationDefinitionVersion: version,
    scenes: structuredClone(SCENES),
    palettes,
    fragrances,
    titleSelectors,
  };
}
