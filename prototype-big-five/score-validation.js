export const SCORE_FACTORS = ["O", "C", "E", "A", "N"];

export function validateScores(scores) {
  if (!scores || typeof scores !== "object" || Array.isArray(scores)) {
    throw new TypeError("scores must be an object with O, C, E, A, and N");
  }
  for (const factor of SCORE_FACTORS) {
    const value = scores[factor];
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TypeError(`scores.${factor} must be a finite number`);
    }
    if (value < 0 || value > 100) {
      throw new RangeError(`scores.${factor} must be between 0 and 100`);
    }
  }
}
