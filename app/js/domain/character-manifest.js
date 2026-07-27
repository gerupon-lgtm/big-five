const ROOT_FIELDS = Object.freeze([
  "characterManifestVersion",
  "entries",
]);

const ENTRY_FIELDS = Object.freeze([
  "characterId",
  "assetVersion",
  "imagePath",
  "width",
  "height",
  "alt",
  "integrity",
]);

const INTEGRITY_PATTERN = /^sha256-[A-Za-z0-9+/]{43}=$/;

function failManifest() {
  throw new TypeError("CHARACTER_MANIFEST_INVALID");
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactFields(value, fields) {
  return isRecord(value)
    && Object.keys(value).length === fields.length
    && fields.every((field) => Object.hasOwn(value, field));
}

function isDenseArray(value) {
  return Array.isArray(value) && Object.keys(value).length === value.length;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function hasUniqueValues(values) {
  return new Set(values).size === values.length;
}

function isSafeWebpPath(value) {
  if (!isNonEmptyString(value)
    || value.startsWith("/")
    || value.includes("\\")
    || value.includes("%")
    || value.includes("?")
    || value.includes("#")
    || !value.endsWith(".webp")
    || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(value)) {
    return false;
  }
  const segments = value.split("/");
  return segments.every(
    (segment) => segment !== "" && segment !== "." && segment !== "..",
  );
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) {
      deepFreeze(nestedValue);
    }
  }
  return value;
}

export function validateCharacterManifest(
  value,
  titleProfiles,
  expectedVersion = value?.characterManifestVersion,
) {
  if (!hasExactFields(value, ROOT_FIELDS)
    || !isNonEmptyString(expectedVersion)
    || value.characterManifestVersion !== expectedVersion
    || !isDenseArray(value.entries)
    || value.entries.length !== 51
    || !isDenseArray(titleProfiles)
    || titleProfiles.length !== 51) {
    failManifest();
  }

  const characterIds = [];
  const imagePaths = [];
  value.entries.forEach((entry, index) => {
    if (!hasExactFields(entry, ENTRY_FIELDS)) failManifest();
    const profile = titleProfiles[index];
    if (!isRecord(profile)
      || !isNonEmptyString(profile.characterId)
      || entry.characterId !== profile.characterId
      || !isNonEmptyString(entry.assetVersion)
      || !isSafeWebpPath(entry.imagePath)
      || entry.width !== 1024
      || entry.height !== 1024
      || !isNonEmptyString(entry.alt)
      || typeof entry.integrity !== "string"
      || !INTEGRITY_PATTERN.test(entry.integrity)) {
      failManifest();
    }
    characterIds.push(entry.characterId);
    imagePaths.push(entry.imagePath);
  });

  if (!hasUniqueValues(characterIds) || !hasUniqueValues(imagePaths)) {
    failManifest();
  }

  return deepFreeze(value);
}

export function resolveCharacterEntry(manifest, characterId) {
  const entry = manifest?.entries?.find(
    (candidate) => candidate.characterId === characterId,
  );
  if (!entry) {
    throw new TypeError(`CHARACTER_NOT_FOUND: ${characterId}`);
  }
  return entry;
}
