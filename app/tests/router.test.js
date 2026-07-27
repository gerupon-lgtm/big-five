import test from "node:test";
import assert from "node:assert/strict";

import { resolveRoute } from "../js/infrastructure/router.js";

test("the start hash resolves without a server-side route", () => {
  assert.deepEqual(resolveRoute("#/start"), {
    id: "start",
    canonicalHash: "#/start",
    didFallback: false,
  });
});

test("empty and unknown hashes safely fall back to the start route", () => {
  assert.deepEqual(resolveRoute(""), {
    id: "start",
    canonicalHash: "#/start",
    didFallback: true,
  });
  assert.deepEqual(resolveRoute("#/not-found"), {
    id: "start",
    canonicalHash: "#/start",
    didFallback: true,
  });
});

test("T-006 S-006 resolves the history hash without a server-side route", () => {
  assert.deepEqual(resolveRoute("#/history"), {
    id: "history",
    canonicalHash: "#/history",
    didFallback: false,
  });
});

test("T-006 S-007 resolves comparison result IDs and keeps missing IDs on the comparison route", () => {
  assert.deepEqual(resolveRoute("#/compare?before=before-id&after=after-id"), {
    id: "compare",
    canonicalHash: "#/compare?before=before-id&after=after-id",
    didFallback: false,
    beforeResultId: "before-id",
    afterResultId: "after-id",
  });
  assert.deepEqual(resolveRoute("#/compare"), {
    id: "compare",
    canonicalHash: "#/compare",
    didFallback: false,
    beforeResultId: null,
    afterResultId: null,
  });
});

test("T-005/T-006 S-003/S-004 resolves an independent saved result route", () => {
  assert.deepEqual(
    resolveRoute("#/result?resultId=00000000-0000-4000-8000-000000000001"),
    {
      id: "result",
      canonicalHash: "#/result?resultId=00000000-0000-4000-8000-000000000001",
      didFallback: false,
      resultId: "00000000-0000-4000-8000-000000000001",
    },
  );
  assert.deepEqual(resolveRoute("#/result"), {
    id: "result",
    canonicalHash: "#/result",
    didFallback: false,
    resultId: null,
  });
});

test("T-005 S-002 resolves the canonical answer hash without a server-side route", () => {
  assert.deepEqual(resolveRoute("#/answer"), {
    id: "answer",
    canonicalHash: "#/answer",
    didFallback: false,
  });
});
