import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { appendFile, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { convertCharacter } from "../../scripts/characters/convert-characters.mjs";
import { inspectCharacterAsset } from "../../scripts/characters/inspect-character.mjs";

const SETTINGS = Object.freeze({
  quality: 82,
  alphaQuality: 100,
  effort: 6,
});

async function withTemporaryDirectory(run) {
  const directory = await mkdtemp(join(tmpdir(), "q012-"));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function transparentSquarePixels(size = 32, touchesEdge = false) {
  const pixels = Buffer.alloc(size * size * 4);
  const start = touchesEdge ? 0 : Math.floor(size / 4);
  const end = Math.floor(size * 3 / 4);
  for (let row = start; row < end; row += 1) {
    for (let column = start; column < end; column += 1) {
      const offset = (row * size + column) * 4;
      pixels.set([120, 90, 60, 255], offset);
    }
  }
  return pixels;
}

test("T-005 F-016 converts a transparent square PNG to inspected WebP", async () => {
  await withTemporaryDirectory(async (directory) => {
    const inputPath = join(directory, "input.png");
    const outputPath = join(directory, "output.webp");
    await sharp(transparentSquarePixels(), {
      raw: { width: 32, height: 32, channels: 4 },
    })
      .png()
      .withMetadata({ orientation: 1 })
      .toFile(inputPath);

    const report = await convertCharacter({
      inputPath,
      outputPath,
      size: 1024,
      settings: SETTINGS,
    });

    assert.equal(report.format, "webp");
    assert.deepEqual([report.width, report.height], [1024, 1024]);
    assert.equal(report.hasAlpha, true);
    assert.equal(report.hasTransparentPixel, true);
    assert.equal(report.boundsTouchEdge, false);
    assert.equal(report.sizeWarning, false);
    const outputBytes = await readFile(outputPath);
    assert.equal(
      report.integrity,
      `sha256-${createHash("sha256").update(outputBytes).digest("base64")}`,
    );
    assert.deepEqual(Object.keys(report), [
      "width",
      "height",
      "format",
      "hasAlpha",
      "hasTransparentPixel",
      "boundsTouchEdge",
      "byteLength",
      "integrity",
      "sizeWarning",
    ]);
    assert.equal((await sharp(outputBytes).metadata()).exif, undefined);
  });
});

test("T-005 F-016 converter rejects a non-square PNG and a PNG without alpha", async () => {
  await withTemporaryDirectory(async (directory) => {
    const nonSquarePath = join(directory, "non-square.png");
    const noAlphaPath = join(directory, "no-alpha.png");
    const outputPath = join(directory, "output.webp");
    await sharp({
      create: {
        width: 32,
        height: 16,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    }).png().toFile(nonSquarePath);
    await sharp({
      create: {
        width: 32,
        height: 32,
        channels: 3,
        background: { r: 120, g: 90, b: 60 },
      },
    }).png().toFile(noAlphaPath);

    await assert.rejects(
      convertCharacter({
        inputPath: nonSquarePath,
        outputPath,
        size: 1024,
        settings: SETTINGS,
      }),
      /CHARACTER_ASSET_INVALID/,
    );
    await assert.rejects(
      convertCharacter({
        inputPath: noAlphaPath,
        outputPath,
        size: 1024,
        settings: SETTINGS,
      }),
      /CHARACTER_ASSET_INVALID/,
    );
  });
});

test("T-005 F-016 converter rejects a delivery size other than 1024 before writing", async () => {
  await withTemporaryDirectory(async (directory) => {
    const inputPath = join(directory, "input.png");
    const outputPath = join(directory, "output.webp");
    await sharp(transparentSquarePixels(), {
      raw: { width: 32, height: 32, channels: 4 },
    }).png().toFile(inputPath);

    await assert.rejects(
      convertCharacter({
        inputPath,
        outputPath,
        size: 512,
        settings: SETTINGS,
      }),
      /CHARACTER_ASSET_INVALID/,
    );
    await assert.rejects(
      readFile(outputPath),
      (error) => error?.code === "ENOENT",
    );
  });
});

test("T-005 F-016 inspector rejects invalid format, geometry, alpha, and bounds", async () => {
  await withTemporaryDirectory(async (directory) => {
    const pngPath = join(directory, "asset.png");
    const nonSquarePath = join(directory, "non-square.webp");
    const noAlphaPath = join(directory, "no-alpha.webp");
    const opaquePath = join(directory, "opaque.webp");
    const edgePath = join(directory, "edge.webp");

    await sharp(transparentSquarePixels(), {
      raw: { width: 32, height: 32, channels: 4 },
    }).png().toFile(pngPath);
    await sharp({
      create: {
        width: 32,
        height: 16,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    }).webp().toFile(nonSquarePath);
    await sharp({
      create: {
        width: 32,
        height: 32,
        channels: 3,
        background: { r: 120, g: 90, b: 60 },
      },
    }).webp().toFile(noAlphaPath);
    await sharp({
      create: {
        width: 32,
        height: 32,
        channels: 4,
        background: { r: 120, g: 90, b: 60, alpha: 1 },
      },
    }).webp().toFile(opaquePath);
    await sharp(transparentSquarePixels(32, true), {
      raw: { width: 32, height: 32, channels: 4 },
    }).webp().toFile(edgePath);

    for (const path of [
      pngPath,
      nonSquarePath,
      noAlphaPath,
      opaquePath,
      edgePath,
    ]) {
      await assert.rejects(
        inspectCharacterAsset(path),
        (error) => error instanceof TypeError
          && /CHARACTER_ASSET_INVALID/.test(error.message),
      );
    }
  });
});

test("T-005 F-016 inspector warns instead of throwing above 250000 bytes", async () => {
  await withTemporaryDirectory(async (directory) => {
    const outputPath = join(directory, "large.webp");
    await sharp(transparentSquarePixels(), {
      raw: { width: 32, height: 32, channels: 4 },
    }).webp().toFile(outputPath);
    await appendFile(outputPath, Buffer.alloc(250_001));

    const report = await inspectCharacterAsset(outputPath);

    assert.equal(report.sizeWarning, true);
    assert.ok(report.byteLength > 250_000);
  });
});
