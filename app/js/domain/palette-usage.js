const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/;
const PALETTE_FIELDS = ["paletteId", "version", "label", "baseColors", "description"];
const BASE_COLOR_FIELDS = ["primary", "secondary", "accent"];
const MAPPING_FIELDS = ["paletteId", "version", "roles", "textCandidates"];
const ROLE_FIELDS = ["background", "surface", "accent", "chart"];
const ROLE_DEFINITION_FIELDS = ["source", "mixWith", "mixPercent"];
const RESOLVED_FIELDS = ["background", "surface", "accent", "text", "chart"];

function invalidPaletteUsage() {
  throw new TypeError("PALETTE_USAGE_INVALID");
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactFields(value, fields) {
  return isRecord(value) &&
    Object.keys(value).length === fields.length &&
    fields.every((field) => Object.hasOwn(value, field));
}

function isDenseArray(value) {
  return Array.isArray(value) && Object.keys(value).length === value.length;
}

function isHexColor(value) {
  return typeof value === "string" && HEX_COLOR_PATTERN.test(value);
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) deepFreeze(nestedValue);
  }
  return value;
}

function parseHex(color) {
  if (!isHexColor(color)) invalidPaletteUsage();
  return [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ];
}

function toHex(channels) {
  return `#${channels.map((channel) =>
    channel.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function mixColor(source, mixWith, mixPercent) {
  const sourceChannels = parseHex(source);
  if (!Number.isInteger(mixPercent) || mixPercent < 0 || mixPercent > 100) {
    invalidPaletteUsage();
  }
  if (mixWith === "none") {
    if (mixPercent !== 0) invalidPaletteUsage();
    return source;
  }
  const target = mixWith === "white"
    ? [255, 255, 255]
    : mixWith === "black"
      ? [0, 0, 0]
      : null;
  if (target === null) invalidPaletteUsage();
  const ratio = mixPercent / 100;
  return toHex(sourceChannels.map((channel, index) =>
    Math.round(channel * (1 - ratio) + target[index] * ratio)));
}

function relativeLuminance(color) {
  const channels = parseHex(color).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function validatePaletteAndMapping(palette, mapping) {
  if (!hasExactFields(palette, PALETTE_FIELDS) ||
    !hasExactFields(palette.baseColors, BASE_COLOR_FIELDS) ||
    !BASE_COLOR_FIELDS.every((field) => isHexColor(palette.baseColors[field])) ||
    !hasExactFields(mapping, MAPPING_FIELDS) ||
    mapping.paletteId !== palette.paletteId ||
    mapping.version !== palette.version ||
    !hasExactFields(mapping.roles, ROLE_FIELDS) ||
    !isDenseArray(mapping.textCandidates) ||
    mapping.textCandidates.length !== 2 ||
    !mapping.textCandidates.every(isHexColor) ||
    new Set(mapping.textCandidates).size !== mapping.textCandidates.length) {
    invalidPaletteUsage();
  }

  for (const role of ROLE_FIELDS) {
    const definition = mapping.roles[role];
    if (!hasExactFields(definition, ROLE_DEFINITION_FIELDS) ||
      !BASE_COLOR_FIELDS.includes(definition.source) ||
      !["white", "black", "none"].includes(definition.mixWith) ||
      !Number.isInteger(definition.mixPercent) ||
      definition.mixPercent < 0 ||
      definition.mixPercent > 100 ||
      (definition.mixWith === "none" && definition.mixPercent !== 0)) {
      invalidPaletteUsage();
    }
  }
}

export function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

export function resolvePaletteUsage(palette, mapping) {
  if (arguments.length !== 2) invalidPaletteUsage();
  validatePaletteAndMapping(palette, mapping);

  const resolvedRoles = Object.fromEntries(ROLE_FIELDS.map((role) => {
    const definition = mapping.roles[role];
    return [
      role,
      mixColor(
        palette.baseColors[definition.source],
        definition.mixWith,
        definition.mixPercent,
      ),
    ];
  }));
  const text = mapping.textCandidates.reduce((best, candidate) => {
    const score = Math.min(
      contrastRatio(candidate, resolvedRoles.background),
      contrastRatio(candidate, resolvedRoles.surface),
    );
    return score > best.score ? { color: candidate, score } : best;
  }, { color: mapping.textCandidates[0], score: -1 }).color;

  return deepFreeze({
    background: resolvedRoles.background,
    surface: resolvedRoles.surface,
    accent: resolvedRoles.accent,
    text,
    chart: resolvedRoles.chart,
  });
}

export function validatePaletteContrast(resolved) {
  if (arguments.length !== 1 ||
    !hasExactFields(resolved, RESOLVED_FIELDS) ||
    !RESOLVED_FIELDS.every((field) => isHexColor(resolved[field]))) {
    invalidPaletteUsage();
  }
  const checks = [
    ["text-background", contrastRatio(resolved.text, resolved.background), 4.5],
    ["text-surface", contrastRatio(resolved.text, resolved.surface), 4.5],
    ["accent-surface", contrastRatio(resolved.accent, resolved.surface), 3],
    ["chart-background", contrastRatio(resolved.chart, resolved.background), 3],
  ];
  const failures = checks
    .filter(([, ratio, threshold]) => ratio < threshold)
    .map(([name]) => name);
  return deepFreeze({ valid: failures.length === 0, failures });
}

