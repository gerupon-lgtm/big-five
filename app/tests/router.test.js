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
