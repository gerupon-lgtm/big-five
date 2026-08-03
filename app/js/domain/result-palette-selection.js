import { validateResultSnapshot } from "./result-snapshot.js";

function invalidSelection() {
  throw new TypeError("RESULT_PALETTE_INVALID");
}

function paletteIdOf(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value.paletteId
    : null;
}

function allowedPaletteIds(allowedPalettes) {
  if (
    !allowedPalettes
    || typeof allowedPalettes !== "object"
    || Array.isArray(allowedPalettes)
    || !Array.isArray(allowedPalettes.alternatives)
    || allowedPalettes.alternatives.length !== 2
    || Object.keys(allowedPalettes.alternatives).length !== 2
  ) {
    invalidSelection();
  }
  const ids = [
    paletteIdOf(allowedPalettes.standard),
    ...allowedPalettes.alternatives.map(paletteIdOf),
  ];
  if (
    ids.some((id) => typeof id !== "string" || id.length === 0)
    || new Set(ids).size !== 3
  ) {
    invalidSelection();
  }
  return ids;
}

export function selectResultPalette(snapshot, allowedPalettes, paletteId) {
  let validSnapshot;
  try {
    validSnapshot = validateResultSnapshot(snapshot);
  } catch {
    invalidSelection();
  }
  const allowedIds = allowedPaletteIds(allowedPalettes);
  if (
    typeof paletteId !== "string"
    || !allowedIds.includes(paletteId)
    || !allowedIds.includes(validSnapshot.selectedPaletteId)
  ) {
    invalidSelection();
  }
  try {
    return validateResultSnapshot({
      ...validSnapshot,
      selectedPaletteId: paletteId,
    });
  } catch {
    invalidSelection();
  }
}
