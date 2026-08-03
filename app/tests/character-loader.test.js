import test from "node:test";
import assert from "node:assert/strict";

import { loadCharacterImage } from "../js/infrastructure/character-loader.js";

const entry = Object.freeze({
  characterId: "character-balanced",
  assetVersion: "character-balanced-v1",
  imagePath: "assets/characters/character-balanced.webp",
  width: 1024,
  height: 1024,
  alt: "五枚の葉のモビールを見上げる、自然な姿勢の猫。",
  integrity: "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
});

test("T-005 F-016 requests only the selected character path once", async () => {
  const requested = [];
  const image = { width: 1024, height: 1024 };

  const result = await loadCharacterImage(entry, {
    decodeImage: async (path) => {
      requested.push(path);
      return image;
    },
  });

  assert.deepEqual(requested, [entry.imagePath]);
  assert.deepEqual(result, { status: "loaded", image, alt: entry.alt });
});

test("T-011 NF-01 appends the canonical app version without changing the manifest path", async () => {
  const requested = [];
  const result = await loadCharacterImage(entry, {
    cacheVersion: "mvp-1.0.1",
    async decodeImage(path) {
      requested.push(path);
      return { path };
    },
  });

  assert.equal(result.status, "loaded");
  assert.deepEqual(requested, [`${entry.imagePath}?v=mvp-1.0.1`]);
  assert.equal(entry.imagePath.includes("?"), false);
});

test("T-005 F-015 preserves approved alt on one failed decode", async () => {
  const requested = [];

  const result = await loadCharacterImage(entry, {
    decodeImage: async (path) => {
      requested.push(path);
      throw new Error("decode failed");
    },
  });

  assert.deepEqual(requested, [entry.imagePath]);
  assert.deepEqual(result, {
    status: "unavailable",
    image: null,
    alt: entry.alt,
  });
});

test("T-005 F-016 rejects an invalid character entry before decoding", async () => {
  let decodeCalls = 0;
  const decodeImage = async () => {
    decodeCalls += 1;
    return {};
  };

  for (const invalidEntry of [
    null,
    { ...entry, imagePath: null },
    { ...entry, alt: null },
  ]) {
    await assert.rejects(
      loadCharacterImage(invalidEntry, { decodeImage }),
      {
        name: "TypeError",
        message: "CHARACTER_ENTRY_INVALID",
      },
    );
  }

  assert.equal(decodeCalls, 0);
});

test("T-005 F-016 rejects an invalid decoder", async () => {
  await assert.rejects(
    loadCharacterImage(entry, { decodeImage: null }),
    {
      name: "TypeError",
      message: "CHARACTER_DECODER_INVALID",
    },
  );
});

test("T-011 NF-01 rejects an invalid cache version before decoding", async () => {
  let decodeCalls = 0;
  await assert.rejects(
    loadCharacterImage(entry, {
      cacheVersion: "mvp-1.0.1?stale=true",
      async decodeImage() {
        decodeCalls += 1;
        return {};
      },
    }),
    {
      name: "TypeError",
      message: "CHARACTER_CACHE_VERSION_INVALID",
    },
  );
  assert.equal(decodeCalls, 0);
});
