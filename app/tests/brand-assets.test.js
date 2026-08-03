import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const WORKSPACE = fileURLToPath(new URL("../../", import.meta.url));
const COMMITTED_ICON_DIRECTORY = join(WORKSPACE, "app", "assets", "brand");
const ICONS = Object.freeze([
  ["kokoro-parea-icon-192.png", 192],
  ["kokoro-parea-icon-512.png", 512],
]);

async function iconHashes(directory) {
  return Promise.all(ICONS.map(async ([filename]) => createHash("sha256")
    .update(await readFile(join(directory, filename)))
    .digest("hex")));
}

async function withTemporaryDirectory(run) {
  const directory = await mkdtemp(join(tmpdir(), "kokoro-parea-brand-"));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function buildIcons(outputDirectory) {
  await execFileAsync(process.execPath, [
    "scripts/brand/build-brand-icons.mjs",
    "--output-dir",
    outputDirectory,
  ], { cwd: WORKSPACE });
}

async function committedIconTimes() {
  return Promise.all(ICONS.map(async ([filename]) => {
    const metadata = await stat(join(COMMITTED_ICON_DIRECTORY, filename));
    return { size: metadata.size, mtimeMs: metadata.mtimeMs };
  }));
}

async function assertApprovedRoundedIcon(path, size) {
  const { data, info } = await sharp(path).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const pixel = (x, y) => Array.from(data.subarray(
    (y * info.width + x) * info.channels,
    (y * info.width + x + 1) * info.channels,
  ));
  assert.deepEqual(pixel(0, 0), [0, 0, 0, 0]);
  assert.deepEqual(pixel(Math.floor(size * 0.05), Math.floor(size / 2)), [38, 112, 92, 255]);
}

test("T-007 F-001 publishes the canonical brand metadata and deterministic icons", async () => {
  const mark = await readFile(
    new URL("../assets/brand/kokoro-parea-mark.svg", import.meta.url),
    "utf8",
  );
  assert.match(mark, /<rect x="2" y="2" width="116" height="116" rx="28" fill="#26705C"\/>/);

  const manifest = JSON.parse(await readFile(
    new URL("../manifest/app.webmanifest", import.meta.url),
    "utf8",
  ));
  assert.equal(manifest.name, "ココロパレア");
  assert.equal(manifest.short_name, "ココロパレア");
  assert.equal(manifest.start_url, "../#/start");
  assert.equal(manifest.display, "standalone");
  assert.deepEqual(manifest.icons, [
    {
      src: "../assets/brand/kokoro-parea-icon-192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "../assets/brand/kokoro-parea-icon-512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ]);

  const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(index, /<title>ココロパレア｜Big Five 自己理解支援ツール<\/title>/);
  assert.match(index, /name="description"\s+content="Big Fiveを使って自分の傾向を振り返る自己理解支援ツール"/);
  assert.match(index, /rel="canonical"\s+href="https:\/\/kokoro\.sikumilab\.com\/"/);
  assert.match(index, /property="og:url"\s+content="https:\/\/kokoro\.sikumilab\.com\/"/);
  assert.match(index, /rel="manifest"\s+href="\.\/manifest\/app\.webmanifest"/);
  assert.match(index, /rel="icon"\s+href="\.\/assets\/brand\/kokoro-parea-mark\.svg"\s+type="image\/svg\+xml"/);
  assert.doesNotMatch(index, /gerupo\.uk|kokoropalea/);
  assert.match(index, /img-src 'self' data: blob:/);
  assert.match(index, /connect-src 'none'/);

  for (const [filename, width] of ICONS) {
    const metadata = await sharp(
      await readFile(join(COMMITTED_ICON_DIRECTORY, filename)),
    ).metadata();
    assert.deepEqual(
      [metadata.width, metadata.height, metadata.format],
      [width, width, "png"],
    );
    await assertApprovedRoundedIcon(join(COMMITTED_ICON_DIRECTORY, filename), width);
  }
});

test("T-007 F-001 builds byte-identical rounded icons in temporary output directories", async () => {
  const committedHashes = await iconHashes(COMMITTED_ICON_DIRECTORY);
  const committedTimes = await committedIconTimes();

  await withTemporaryDirectory(async (firstDirectory) => {
    await buildIcons(firstDirectory);
    const firstHashes = await iconHashes(firstDirectory);
    assert.deepEqual(firstHashes, committedHashes);

    for (const [filename, size] of ICONS) {
      await assertApprovedRoundedIcon(join(firstDirectory, filename), size);
    }

    await withTemporaryDirectory(async (secondDirectory) => {
      await buildIcons(secondDirectory);
      assert.deepEqual(await iconHashes(secondDirectory), firstHashes);
    });
  });

  assert.deepEqual(await committedIconTimes(), committedTimes);
});
