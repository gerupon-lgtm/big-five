import { FACTOR_ORDER } from "../data/factor-order.js";

const DIRECTIONS = ["high", "low"];

function invalidProfiles() {
  throw new TypeError("TITLE_PROFILE_INVALID");
}

function hasExactFields(value, fields) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).length === fields.length && fields.every((field) => Object.hasOwn(value, field));
}

function profileKey(kind, factors) {
  return `${kind}:${factors.map(({ factorId, direction }) => `${factorId}/${direction}`).join(",")}`;
}

function expectedProfileKeys() {
  return [
    "balanced:",
    ...FACTOR_ORDER.flatMap((factorId) => DIRECTIONS.map((direction) =>
      profileKey("single", [{ factorId, direction }]))),
    ...FACTOR_ORDER.flatMap((firstFactorId, firstIndex) =>
      FACTOR_ORDER.slice(firstIndex + 1).flatMap((secondFactorId) =>
        DIRECTIONS.flatMap((firstDirection) => DIRECTIONS.map((secondDirection) =>
          profileKey("pair", [
            { factorId: firstFactorId, direction: firstDirection },
            { factorId: secondFactorId, direction: secondDirection },
          ]))))),
  ];
}

export function validateTitleProfileDefinitions(value) {
  const fields = ["titleId", "label", "kind", "factors", "characterId", "summaryTextId", "defaultPaletteId"];
  if (!Array.isArray(value) || value.length !== 51 || !value.every((profile) => hasExactFields(profile, fields))) invalidProfiles();
  if (!value.every(({ titleId, label, kind, factors, characterId, summaryTextId, defaultPaletteId }) =>
    [titleId, label, characterId, summaryTextId, defaultPaletteId].every((item) => typeof item === "string" && item.length > 0) &&
    ["balanced", "single", "pair"].includes(kind) &&
    Array.isArray(factors) && factors.length === (kind === "balanced" ? 0 : kind === "single" ? 1 : 2) &&
    factors.every((factor) => hasExactFields(factor, ["factorId", "direction"]) && FACTOR_ORDER.includes(factor.factorId) && DIRECTIONS.includes(factor.direction)) &&
    new Set(factors.map(({ factorId }) => factorId)).size === factors.length &&
    factors.every((factor, index) => index === 0 || FACTOR_ORDER.indexOf(factors[index - 1].factorId) < FACTOR_ORDER.indexOf(factor.factorId)))) invalidProfiles();

  const titleIds = value.map(({ titleId }) => titleId);
  const characterIds = value.map(({ characterId }) => characterId);
  const keys = value.map(({ kind, factors }) => profileKey(kind, factors));
  if (new Set(titleIds).size !== 51 || new Set(characterIds).size !== 51 || new Set(keys).size !== 51 ||
    !expectedProfileKeys().every((key) => keys.includes(key))) invalidProfiles();
  return value;
}
