import test from "node:test";
import assert from "node:assert/strict";
import { buildShareText, shareResult } from "../share-card.js";

test("share text identifies sample status and answer count without raw answers", () => {
  const text = buildShareText({
    answerCount: 20,
    title: "探究する調整役",
    scores: { O: 82, C: 68, E: 41, A: 74, N: 57 },
  });

  assert.match(text, /体験用サンプル/);
  assert.match(text, /20問版/);
  assert.match(text, /探究する調整役/);
  assert.match(text, /尺度内スコア・正式な診断ではありません/);
  assert.doesNotMatch(text, /answers/);
});

test("share falls back to selectable text without browser sharing capabilities", async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: undefined });
  try {
    const outcome = await shareResult({
      answerCount: 20,
      title: "探究する調整役",
      scores: { O: 82, C: 68, E: 41, A: 74, N: 57 },
    }, {
      toBlob: (callback) => callback(new Blob(["png"], { type: "image/png" })),
    });

    assert.equal(outcome.kind, "text");
    assert.equal(outcome.copied, false);
    assert.match(outcome.text, /体験用サンプル/);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "navigator", descriptor);
    else delete globalThis.navigator;
  }
});