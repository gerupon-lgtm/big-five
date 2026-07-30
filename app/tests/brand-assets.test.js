import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import test from "node:test";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const ICONS = Object.freeze([
  ["app/assets/brand/kokoro-parea-icon-192.png", 192],
  ["app/assets/brand/kokoro-parea-icon-512.png", 512],
]);

async function iconHashes() {
  return Promise.all(ICONS.map(async ([path]) => createHash("sha256")
    .update(await readFile(new URL(`../../${path}`, import.meta.url)))
    .digest("hex")));
}

test("T-007 F-001 publishes the canonical brand metadata and deterministic icons", async () => {
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
  assert.match(index, /rel="canonical"\s+href="https:\/\/kokoroparea\.gerupon\.uk\/"/);
  assert.match(index, /property="og:url"\s+content="https:\/\/kokoroparea\.gerupon\.uk\/"/);
  assert.match(index, /rel="manifest"\s+href="\.\/manifest\/app\.webmanifest"/);
  assert.match(index, /rel="icon"\s+href="\.\/assets\/brand\/kokoro-parea-mark\.svg"\s+type="image\/svg\+xml"/);
  assert.doesNotMatch(index, /gerupo\.uk|kokoropalea/);
  assert.match(index, /connect-src 'none'/);

  for (const [path, width] of ICONS) {
    const metadata = await sharp(
      await readFile(new URL(`../../${path}`, import.meta.url)),
    ).metadata();
    assert.deepEqual(
      [metadata.width, metadata.height, metadata.format],
      [width, width, "png"],
    );
  }

  await execFileAsync(process.execPath, ["scripts/brand/build-brand-icons.mjs"], {
    cwd: new URL("../../", import.meta.url),
  });
  const first = await iconHashes();
  await execFileAsync(process.execPath, ["scripts/brand/build-brand-icons.mjs"], {
    cwd: new URL("../../", import.meta.url),
  });
  assert.deepEqual(await iconHashes(), first);
});
