import { FACTOR_ORDER } from "../config/factor-order.js";

const SIGOTOSOCKET_BASE_URL = "https://sigotosocket.sikumilab.com/";

export function createSigotosocketLinkUrl(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }
  const { mode, factors } = input;
  if (
    mode !== "detail50"
    || !Array.isArray(factors)
    || factors.length !== FACTOR_ORDER.length
    || factors.some((factor) =>
      factor === null
      || typeof factor !== "object"
      || !FACTOR_ORDER.includes(factor.factorId))
    || new Set(factors.map(({ factorId }) => factorId)).size !== FACTOR_ORDER.length
  ) {
    return null;
  }

  const parts = [];
  for (const factorId of FACTOR_ORDER) {
    const factor = factors.find((candidate) => candidate.factorId === factorId);
    if (!factor) return null;
    if (
      typeof factor.rawMean !== "number"
      || !Number.isFinite(factor.rawMean)
      || factor.rawMean < 1
      || factor.rawMean > 5
    ) {
      return null;
    }
    const hundreds = Math.round(factor.rawMean * 100);
    if (hundreds < 100 || hundreds > 500) {
      return null;
    }
    parts.push(String(hundreds).padStart(3, "0"));
  }

  return `${SIGOTOSOCKET_BASE_URL}#b5=v1-${parts.join("")}`;
}
