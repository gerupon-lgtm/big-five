export const SIGOTOSOCKET_LINK_STATE_KEY =
  "big-five-self-understanding:sigotosocket-link:v1";

const RESULT_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function loadLastSigotosocketLinkedResultId({ storage } = {}) {
  if (!storage || typeof storage.getItem !== "function") return null;
  try {
    const raw = storage.getItem(SIGOTOSOCKET_LINK_STATE_KEY);
    if (typeof raw !== "string") return null;
    const value = JSON.parse(raw);
    if (
      value === null
      || typeof value !== "object"
      || Array.isArray(value)
      || Object.getPrototypeOf(value) !== Object.prototype
      || Object.keys(value).length !== 2
      || value.schemaVersion !== 1
      || !RESULT_ID_PATTERN.test(value.resultId)
    ) {
      return null;
    }
    return value.resultId;
  } catch {
    return null;
  }
}

export function saveLastSigotosocketLinkedResultId({ storage, resultId } = {}) {
  if (
    !storage
    || typeof storage.setItem !== "function"
    || typeof resultId !== "string"
    || !RESULT_ID_PATTERN.test(resultId)
  ) {
    return false;
  }
  try {
    storage.setItem(SIGOTOSOCKET_LINK_STATE_KEY, JSON.stringify({
      schemaVersion: 1,
      resultId,
    }));
    return true;
  } catch {
    return false;
  }
}

export function clearSigotosocketLinkState({ storage } = {}) {
  if (!storage || typeof storage.removeItem !== "function") return false;
  try {
    storage.removeItem(SIGOTOSOCKET_LINK_STATE_KEY);
    return true;
  } catch {
    return false;
  }
}
