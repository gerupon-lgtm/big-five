export const STORAGE_KEY = "bigFivePrototype:v1";

const emptyStore = () => ({ inProgress: null, history: [] });

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.filter(isRecord).map(({ answers: _answers, ...result }) => result);
}

function normalizeInProgress(inProgress) {
  return isRecord(inProgress) ? inProgress : null;
}

export function loadStore(storage = localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY));
    return {
      inProgress: normalizeInProgress(parsed?.inProgress),
      history: sanitizeHistory(parsed?.history),
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(storage, store) {
  storage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function saveProgress(storage, state) {
  const store = loadStore(storage);
  writeStore(storage, {
    ...store,
    inProgress: {
      answers: state.answers,
      currentIndex: state.currentIndex,
      startedAt: state.startedAt,
      mode: state.mode,
    },
  });
}

export function saveResult(storage, result) {
  const store = loadStore(storage);
  const { answers: _answers, ...safeResult } = result;
  writeStore(storage, {
    inProgress: null,
    history: [safeResult, ...store.history],
  });
}

export function deleteResult(storage, id) {
  const store = loadStore(storage);
  writeStore(storage, {
    ...store,
    history: store.history.filter((result) => result.id !== id),
  });
}

export function clearHistory(storage) {
  writeStore(storage, emptyStore());
}

export function canCompare(left, right) {
  const fields = ["answerCount", "instrumentId", "instrumentVersion", "scoringVersion"];
  const mismatch = fields.find((field) => left[field] !== right[field]);
  return mismatch
    ? { ok: false, reason: `${mismatch} values do not match` }
    : { ok: true, reason: "" };
}

export function compareResults(left, right) {
  const compatibility = canCompare(left, right);
  if (!compatibility.ok) throw new TypeError(compatibility.reason);
  return Object.fromEntries(
    Object.keys(left.scores).map((factor) => [factor, right.scores[factor] - left.scores[factor]]),
  );
}
