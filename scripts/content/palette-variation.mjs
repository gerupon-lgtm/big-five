const HEX_PATTERN = /^#[0-9A-F]{6}$/;

function assertHex(value) {
  if (typeof value !== "string" || !HEX_PATTERN.test(value)) {
    throw new TypeError("PALETTE_COLOR_INVALID");
  }
}

export function hexToRgb(hex) {
  assertHex(hex);
  return [1, 3, 5].map((offset) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16));
}

function rgbToHex(channels) {
  return `#${channels
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

export function mixHex(first, second, secondWeight) {
  if (!Number.isFinite(secondWeight) || secondWeight < 0 || secondWeight > 1) {
    throw new TypeError("PALETTE_COLOR_WEIGHT_INVALID");
  }
  const firstRgb = hexToRgb(first);
  const secondRgb = hexToRgb(second);
  return rgbToHex(firstRgb.map((channel, index) =>
    channel * (1 - secondWeight) + secondRgb[index] * secondWeight));
}

export function mixWithWhite(hex, whitePercent) {
  if (!Number.isFinite(whitePercent) || whitePercent < 0 || whitePercent > 100) {
    throw new TypeError("PALETTE_COLOR_PERCENT_INVALID");
  }
  return mixHex(hex, "#FFFFFF", whitePercent / 100);
}

function linearChannel(channel) {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex) {
  const [red, green, blue] = hexToRgb(hex).map(linearChannel);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function toOklab(hex) {
  const [red, green, blue] = hexToRgb(hex).map(linearChannel);
  const l = Math.cbrt(
    0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue,
  );
  const m = Math.cbrt(
    0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue,
  );
  const s = Math.cbrt(
    0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue,
  );
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export function oklabDistance(first, second) {
  const firstLab = toOklab(first);
  const secondLab = toOklab(second);
  return Math.hypot(
    ...firstLab.map((channel, index) => channel - secondLab[index]),
  ) * 100;
}

function minimumPairDistance(colors) {
  return Math.min(
    oklabDistance(colors[0], colors[1]),
    oklabDistance(colors[0], colors[2]),
    oklabDistance(colors[1], colors[2]),
  );
}

function isCyclicGroup(group) {
  return (
    group[0].secondary_color === group[1].primary_color
    && group[0].accent_color === group[2].primary_color
    && group[1].secondary_color === group[2].primary_color
    && group[1].accent_color === group[0].primary_color
    && group[2].secondary_color === group[0].primary_color
    && group[2].accent_color === group[1].primary_color
  );
}

export function auditTitlePaletteGroups(
  rows,
  { backgroundWhitePercent, surfaceWhitePercent },
) {
  if (!Array.isArray(rows) || rows.length % 3 !== 0) {
    throw new TypeError("PALETTE_GROUPS_INVALID");
  }

  const groups = [];
  for (let index = 0; index < rows.length; index += 3) {
    const group = rows.slice(index, index + 3);
    const backgrounds = group.map(({ primary_color }) =>
      mixWithWhite(primary_color, backgroundWhitePercent));
    const surfaces = group.map(({ secondary_color }) =>
      mixWithWhite(secondary_color, surfaceWhitePercent));

    groups.push({
      titleOrder: index / 3 + 1,
      paletteIds: group.map(({ palette_id }) => palette_id),
      isCyclic: isCyclicGroup(group),
      minimumBackgroundDistance: minimumPairDistance(backgrounds),
      minimumSurfaceLuminance: Math.min(...surfaces.map(relativeLuminance)),
      uniqueColorTriples: new Set(group.map((row) =>
        `${row.primary_color}/${row.secondary_color}/${row.accent_color}`)).size,
    });
  }
  return groups;
}
