import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";

const ASSET_DIRECTORY = new URL("../assets/share-card/", import.meta.url);
const ASSET_NAMES = Object.freeze([
  "aroma-pause-v1.png",
  "aroma-quiet-focus-v1.png",
  "aroma-reset-v1.png",
]);
const ASSET_HASHES = Object.freeze({
  "aroma-pause-v1.png":
    "d946e8cb15fb64f52791001c97afdc76e66e9b339b4f479b60d85a2c4f45c31a",
  "aroma-quiet-focus-v1.png":
    "ea8f49dd9851805c715dcce9d6f7c4ecc45d4290eb13105d9611112603b267e8",
  "aroma-reset-v1.png":
    "9c71df1c5ed8bce2315166ee1708e154107b7f1f2f96a4221825aee828f73e7f",
});

test("T-007 F-011 keeps the three aroma illustrations as high-resolution transparent PNGs", async () => {
  assert.deepEqual((await readdir(ASSET_DIRECTORY)).sort(), ASSET_NAMES);

  for (const name of ASSET_NAMES) {
    const path = fileURLToPath(new URL(name, ASSET_DIRECTORY));
    const source = await readFile(path);
    assert.equal(
      createHash("sha256").update(source).digest("hex"),
      ASSET_HASHES[name],
    );
    const image = sharp(source);
    const metadata = await image.metadata();
    assert.equal(metadata.format, "png");
    assert.equal(metadata.hasAlpha, true);
    assert.ok(metadata.width >= 800);
    assert.ok(metadata.height >= 800);

    const { data, info } = await image.ensureAlpha().raw()
      .toBuffer({ resolveWithObject: true });
    const cornerAlpha = [
      data[3],
      data[(info.width - 1) * 4 + 3],
      data[(info.height - 1) * info.width * 4 + 3],
      data[(info.width * info.height - 1) * 4 + 3],
    ];
    assert.deepEqual(cornerAlpha, [0, 0, 0, 0]);

    let transparentPixels = 0;
    let opaquePixels = 0;
    let keyedFringePixels = 0;
    for (let offset = 0; offset < data.length; offset += 4) {
      const alpha = data[offset + 3];
      if (alpha === 0) transparentPixels += 1;
      if (alpha === 255) opaquePixels += 1;
      if (alpha > 0 &&
        data[offset] > data[offset + 1] * 1.35 &&
        data[offset + 2] > data[offset + 1] * 1.35) {
        keyedFringePixels += 1;
      }
    }
    assert.ok(transparentPixels > 0);
    assert.ok(opaquePixels > 0);
    assert.equal(keyedFringePixels, 0);
  }
});
