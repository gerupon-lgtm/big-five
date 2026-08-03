import assert from "node:assert/strict";
import test from "node:test";

import {
  copyShareText,
  detectShareCapabilities,
  downloadPng,
  sharePng,
} from "../js/infrastructure/share-delivery.js";

class TestFile extends Blob {
  constructor(parts, name, options) {
    super(parts, options);
    this.name = name;
  }
}

function dependencies(overrides = {}) {
  const events = [];
  const anchor = {
    download: "",
    href: "",
    click: () => events.push("click"),
    remove: () => events.push("remove"),
  };
  const value = {
    File: TestFile,
    navigator: {
      canShare: () => true,
      share: async () => events.push("share"),
      clipboard: { writeText: async (text) => events.push(["copy", text]) },
    },
    URL: {
      createObjectURL: () => {
        events.push("create-url");
        return "blob:test";
      },
      revokeObjectURL: (url) => events.push(["revoke", url]),
    },
    document: { createElement: () => anchor },
    ...overrides,
  };
  return { value, events, anchor };
}

test("T-007 F-012 detects file share, download, and clipboard independently", () => {
  const supported = dependencies();
  assert.deepEqual(detectShareCapabilities(supported.value), {
    fileShare: true,
    download: true,
    clipboard: true,
  });

  const throwing = dependencies();
  throwing.value.navigator.canShare = () => { throw new Error("blocked"); };
  assert.deepEqual(detectShareCapabilities(throwing.value), {
    fileShare: false,
    download: true,
    clipboard: true,
  });
});

test("T-007 F-012 shares a PNG file first and maps cancellation neutrally", async () => {
  const shared = dependencies();
  const blob = new Blob(["png"], { type: "image/png" });
  assert.equal(await sharePng({
    blob,
    filename: "kokoro-parea-result.png",
    text: "共有文",
  }, shared.value), "shared");
  assert.deepEqual(shared.events, ["share"]);

  const cancelled = dependencies();
  cancelled.value.navigator.share = async () => {
    const error = new Error("cancel");
    error.name = "AbortError";
    throw error;
  };
  assert.equal(await sharePng({
    blob,
    filename: "kokoro-parea-result.png",
    text: "共有文",
  }, cancelled.value), "cancelled");
});

test("T-007 F-012 returns unavailable or failed without implicit fallback actions", async () => {
  const unavailable = dependencies();
  unavailable.value.navigator.canShare = () => false;
  assert.equal(await sharePng({
    blob: new Blob(["png"], { type: "image/png" }),
    filename: "result.png",
    text: "text",
  }, unavailable.value), "unavailable");
  assert.deepEqual(unavailable.events, []);

  const failed = dependencies();
  failed.value.navigator.share = async () => { throw new Error("denied"); };
  assert.equal(await sharePng({
    blob: new Blob(["png"], { type: "image/png" }),
    filename: "result.png",
    text: "text",
  }, failed.value), "failed");
});

test("T-007 F-012 downloads with object URL cleanup even when click fails", async () => {
  const normal = dependencies();
  assert.equal(await downloadPng({
    blob: new Blob(["png"], { type: "image/png" }),
    filename: "result.png",
  }, normal.value), "downloaded");
  assert.deepEqual(normal.events, [
    "create-url",
    "click",
    "remove",
    ["revoke", "blob:test"],
  ]);

  const failed = dependencies();
  failed.value.document.createElement = () => ({
    click: () => { throw new Error("blocked"); },
    remove: () => failed.events.push("remove"),
  });
  assert.equal(await downloadPng({
    blob: new Blob(["png"], { type: "image/png" }),
    filename: "result.png",
  }, failed.value), "failed");
  assert.ok(failed.events.some((event) =>
    Array.isArray(event) && event[0] === "revoke"));
});

test("T-007 F-012 copies text or leaves selectable text available", async () => {
  const copied = dependencies();
  assert.equal(await copyShareText("共有文", copied.value), "copied");
  assert.deepEqual(copied.events, [["copy", "共有文"]]);

  const unavailable = dependencies({ navigator: {} });
  assert.equal(await copyShareText("共有文", unavailable.value), "unavailable");

  const failed = dependencies();
  failed.value.navigator.clipboard.writeText = async () => { throw new Error("denied"); };
  assert.equal(await copyShareText("共有文", failed.value), "failed");
});
