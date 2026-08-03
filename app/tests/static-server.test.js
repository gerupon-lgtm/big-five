import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createStaticServer } from "../dev-server.mjs";

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  return `http://127.0.0.1:${address.port}`;
}

test("the formal app serves its start shell and ES module", async (t) => {
  const server = createStaticServer({ rootDir: appRoot });
  t.after(() => server.close());
  const origin = await listen(server);

  const startResponse = await fetch(`${origin}/#/start`);
  assert.equal(startResponse.status, 200);
  assert.match(startResponse.headers.get("content-type"), /^text\/html/);
  const html = await startResponse.text();
  assert.match(html, /ココロパレア｜Big Five 自己理解支援ツール/);
  assert.match(html, /id="app"/);
  assert.match(html, /type="module" src="\.\/js\/main\.js"/);

  const moduleResponse = await fetch(`${origin}/js/main.js`);
  assert.equal(moduleResponse.status, 200);
  assert.match(
    moduleResponse.headers.get("content-type"),
    /^text\/javascript/,
  );
});

test("the formal app server returns 404 for unknown files", async (t) => {
  const server = createStaticServer({ rootDir: appRoot });
  t.after(() => server.close());
  const origin = await listen(server);

  const response = await fetch(`${origin}/missing.js`);
  assert.equal(response.status, 404);
});

test("the formal app serves share-card raster assets with image MIME types", async (t) => {
  const server = createStaticServer({ rootDir: appRoot });
  t.after(() => server.close());
  const origin = await listen(server);

  const png = await fetch(`${origin}/assets/share-card/aroma-pause-v1.png`);
  const wreath = await fetch(`${origin}/assets/share-card/kokoro-wreath-v2.png`);
  const webp = await fetch(
    `${origin}/assets/characters/character-balanced.webp`,
  );
  assert.equal(png.status, 200);
  assert.equal(png.headers.get("content-type"), "image/png");
  assert.equal(wreath.status, 200);
  assert.equal(wreath.headers.get("content-type"), "image/png");
  assert.equal(webp.status, 200);
  assert.equal(webp.headers.get("content-type"), "image/webp");
});
