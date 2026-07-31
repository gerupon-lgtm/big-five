function createPngFile({ blob, filename }, dependencies) {
  if (!blob || typeof filename !== "string" || filename.length === 0 ||
    typeof dependencies?.File !== "function") {
    return null;
  }
  try {
    return new dependencies.File([blob], filename, { type: "image/png" });
  } catch {
    return null;
  }
}

function canFileShare(file, dependencies) {
  if (!file ||
    typeof dependencies?.navigator?.canShare !== "function" ||
    typeof dependencies?.navigator?.share !== "function") {
    return false;
  }
  try {
    return dependencies.navigator.canShare({ files: [file] }) === true;
  } catch {
    return false;
  }
}

export function detectShareCapabilities(dependencies) {
  const file = createPngFile({
    blob: new Blob([""], { type: "image/png" }),
    filename: "kokoro-parea-result.png",
  }, dependencies);
  return Object.freeze({
    fileShare: canFileShare(file, dependencies),
    download:
      typeof dependencies?.URL?.createObjectURL === "function" &&
      typeof dependencies?.document?.createElement === "function",
    clipboard:
      typeof dependencies?.navigator?.clipboard?.writeText === "function",
  });
}

export async function sharePng({ blob, filename, text } = {}, dependencies) {
  const file = createPngFile({ blob, filename }, dependencies);
  if (!canFileShare(file, dependencies)) return "unavailable";
  try {
    await dependencies.navigator.share({
      files: [file],
      ...(typeof text === "string" && text.length > 0 ? { text } : {}),
    });
    return "shared";
  } catch (error) {
    return error?.name === "AbortError" ? "cancelled" : "failed";
  }
}

export async function downloadPng({ blob, filename } = {}, dependencies) {
  if (!blob ||
    typeof filename !== "string" ||
    filename.length === 0 ||
    typeof dependencies?.URL?.createObjectURL !== "function" ||
    typeof dependencies?.document?.createElement !== "function") {
    return "unavailable";
  }

  let objectUrl;
  let anchor;
  try {
    objectUrl = dependencies.URL.createObjectURL(blob);
    anchor = dependencies.document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.click();
    return "downloaded";
  } catch {
    return "failed";
  } finally {
    try {
      anchor?.remove?.();
    } catch {
      // Cleanup failure does not change the completed user action.
    }
    if (objectUrl && typeof dependencies.URL.revokeObjectURL === "function") {
      try {
        dependencies.URL.revokeObjectURL(objectUrl);
      } catch {
        // Object URL lifetime is browser-owned if explicit cleanup is blocked.
      }
    }
  }
}

export async function copyShareText(text, dependencies) {
  if (typeof text !== "string" ||
    text.length === 0 ||
    typeof dependencies?.navigator?.clipboard?.writeText !== "function") {
    return "unavailable";
  }
  try {
    await dependencies.navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
