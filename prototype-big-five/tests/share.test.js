import test from "node:test";
import assert from "node:assert/strict";
import { buildShareText, drawShareCard, shareResult } from "../share-card.js";

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
test("share download stays safe when URL cannot revoke an object URL", async () => {
  const descriptors = Object.fromEntries(
    ["document", "navigator", "URL", "setTimeout"].map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]),
  );
  let clicked = false;
  Object.defineProperties(globalThis, {
    document: {
      configurable: true,
      value: {
        createElement: () => ({ click: () => { clicked = true; } }),
      },
    },
    navigator: { configurable: true, value: undefined },
    URL: {
      configurable: true,
      value: { createObjectURL: () => "blob:sample" },
    },
    setTimeout: {
      configurable: true,
      value: (callback) => { callback(); return 0; },
    },
  });

  try {
    const outcome = await shareResult({
      answerCount: 20,
      title: "探究する調整役",
      scores: { O: 82, C: 68, E: 41, A: 74, N: 57 },
    }, {
      toBlob: (callback) => callback(new Blob(["png"], { type: "image/png" })),
    });

    assert.equal(outcome.kind, "downloaded");
    assert.equal(outcome.copied, false);
    assert.equal(clicked, true);
  } finally {
    for (const [name, descriptor] of Object.entries(descriptors)) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});
test("failed card rendering never shares or downloads an empty image", async () => {
  const descriptors = Object.fromEntries(
    ["document", "navigator", "URL"].map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]),
  );
  let shared = false;
  let downloaded = false;
  let blobRequested = false;
  Object.defineProperties(globalThis, {
    document: {
      configurable: true,
      value: { createElement: () => ({ click: () => { downloaded = true; } }) },
    },
    navigator: {
      configurable: true,
      value: { canShare: () => true, share: async () => { shared = true; } },
    },
    URL: {
      configurable: true,
      value: { createObjectURL: () => "blob:empty" },
    },
  });

  const canvas = {
    getContext: () => null,
    toBlob: (callback) => {
      blobRequested = true;
      callback(new Blob(["empty"], { type: "image/png" }));
    },
  };
  const result = {
    answerCount: 20,
    title: "描画失敗サンプル",
    scores: { O: 82, C: 68, E: 41, A: 74, N: 57 },
  };
  let imageReady = true;
  try {
    drawShareCard(canvas, result);
  } catch {
    imageReady = false;
  }

  try {
    const outcome = await shareResult(result, canvas, { imageReady });
    assert.equal(outcome.kind, "text");
    assert.equal(blobRequested, false);
    assert.equal(shared, false);
    assert.equal(downloaded, false);
    assert.match(outcome.text, /描画失敗サンプル/);
  } finally {
    for (const [name, descriptor] of Object.entries(descriptors)) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});
