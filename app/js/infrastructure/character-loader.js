import { isAppVersion } from "../domain/version-model.js";

export async function loadCharacterImage(entry, { decodeImage, cacheVersion } = {}) {
  if (
    !entry ||
    typeof entry.imagePath !== "string" ||
    typeof entry.alt !== "string"
  ) {
    throw new TypeError("CHARACTER_ENTRY_INVALID");
  }
  if (typeof decodeImage !== "function") {
    throw new TypeError("CHARACTER_DECODER_INVALID");
  }
  if (cacheVersion !== undefined && !isAppVersion(cacheVersion)) {
    throw new TypeError("CHARACTER_CACHE_VERSION_INVALID");
  }

  try {
    const imagePath = cacheVersion === undefined
      ? entry.imagePath
      : `${entry.imagePath}?v=${encodeURIComponent(cacheVersion)}`;
    const image = await decodeImage(imagePath);
    return { status: "loaded", image, alt: entry.alt };
  } catch {
    return { status: "unavailable", image: null, alt: entry.alt };
  }
}
