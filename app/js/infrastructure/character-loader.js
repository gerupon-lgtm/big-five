export async function loadCharacterImage(entry, { decodeImage }) {
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

  try {
    const image = await decodeImage(entry.imagePath);
    return { status: "loaded", image, alt: entry.alt };
  } catch {
    return { status: "unavailable", image: null, alt: entry.alt };
  }
}
