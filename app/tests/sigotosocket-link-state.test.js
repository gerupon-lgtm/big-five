import test from "node:test";
import assert from "node:assert/strict";

import {
  SIGOTOSOCKET_LINK_STATE_KEY,
  clearSigotosocketLinkState,
  loadLastSigotosocketLinkedResultId,
  saveLastSigotosocketLinkedResultId,
} from "../js/infrastructure/sigotosocket-link-state.js";

const resultId = "00000000-0000-4000-8000-000000000138";

function createStorage(initialValue = null) {
  const values = new Map();
  if (initialValue !== null) values.set(SIGOTOSOCKET_LINK_STATE_KEY, initialValue);
  return {
    values,
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
    removeItem(key) { values.delete(key); },
  };
}

test("T-038 stores and loads one exact versioned result ID", () => {
  const storage = createStorage();

  assert.equal(saveLastSigotosocketLinkedResultId({ storage, resultId }), true);
  assert.deepEqual(JSON.parse(storage.values.get(SIGOTOSOCKET_LINK_STATE_KEY)), {
    schemaVersion: 1,
    resultId,
  });
  assert.equal(loadLastSigotosocketLinkedResultId({ storage }), resultId);
});

test("T-038 rejects malformed and expanded linkage state", () => {
  for (const value of [
    "not-json",
    JSON.stringify({ schemaVersion: 2, resultId }),
    JSON.stringify({ schemaVersion: 1, resultId: "not-a-uuid" }),
    JSON.stringify({ schemaVersion: 1, resultId, received: true }),
  ]) {
    assert.equal(
      loadLastSigotosocketLinkedResultId({ storage: createStorage(value) }),
      null,
    );
  }
});

test("T-038 treats storage failures as an unavailable marker", () => {
  const storage = {
    getItem() { throw new Error("read failed"); },
    setItem() { throw new Error("write failed"); },
    removeItem() { throw new Error("delete failed"); },
  };

  assert.equal(loadLastSigotosocketLinkedResultId({ storage }), null);
  assert.equal(saveLastSigotosocketLinkedResultId({ storage, resultId }), false);
  assert.equal(clearSigotosocketLinkState({ storage }), false);
});

test("T-038 clears the separate linkage marker", () => {
  const storage = createStorage(JSON.stringify({ schemaVersion: 1, resultId }));

  assert.equal(clearSigotosocketLinkState({ storage }), true);
  assert.equal(storage.values.has(SIGOTOSOCKET_LINK_STATE_KEY), false);
});
