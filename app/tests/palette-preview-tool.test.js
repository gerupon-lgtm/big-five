import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import { createContext, Script } from "node:vm";

import {
  contrastRatio,
  resolvePaletteUsage,
} from "../js/domain/palette-usage.js";
import {
  loadPalettePreviewModel,
  renderPalettePreview,
} from "../../scripts/content/render-palette-preview.mjs";

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "../..");
const SOURCE_DIR = path.join(ROOT, "content/source");
const SCRIPT_PATH = path.join(
  ROOT,
  "scripts/content/render-palette-preview.mjs",
);
const COMMITTED_PREVIEW = path.join(ROOT, "docs/palette-preview.html");

test("P-0 preview model maps 51 titles to exactly three palettes", async () => {
  const model = await loadPalettePreviewModel({ sourceDir: SOURCE_DIR });

  assert.equal(model.presentationDefinitionVersion, "presentation-v2");
  assert.equal(model.approvalStatus, "draft");
  assert.equal(model.titleCount, 51);
  assert.equal(model.paletteCount, 153);
  assert.equal(model.palettes.length, 153);

  for (let titleOrder = 1; titleOrder <= 51; titleOrder += 1) {
    const titlePalettes = model.palettes.filter(
      (palette) => palette.titleOrder === titleOrder,
    );
    assert.deepEqual(
      titlePalettes.map(({ selectionRole }) => selectionRole),
      ["standard", "alternative-1", "alternative-2"],
    );
    assert.equal(
      new Set(titlePalettes.map(({ titleId }) => titleId)).size,
      1,
    );
  }

  assert.deepEqual(model.palettes[0], {
    titleId: "title-balanced",
    titleLabel: "五つの風を見渡す観測者",
    titleOrder: 1,
    selectionRole: "standard",
    paletteId: "palette-balanced-1",
    paletteLabel: "澄み切った空色",
    description: "複数の方向を等しく見渡す中立的な印象。",
    contentReviewNote: "",
    baseColors: {
      primary: "#7C8791",
      secondary: "#8FAFC1",
      accent: "#A8B7A1",
    },
    mapping: {
      background: {
        source: "primary",
        mixWith: "white",
        mixPercent: 92,
      },
      surface: {
        source: "secondary",
        mixWith: "white",
        mixPercent: 95,
      },
      accent: {
        source: "accent",
        mixWith: "black",
        mixPercent: 45,
      },
      chart: {
        source: "primary",
        mixWith: "black",
        mixPercent: 45,
      },
      textCandidates: ["#1F2430", "#FFFFFF"],
    },
    resolved: {
      background: "#F5F5F6",
      surface: "#F9FBFC",
      accent: "#5C6559",
      text: "#1F2430",
      chart: "#444A50",
    },
    contrast: {
      textBackground: 14.242,
      textSurface: 14.951,
      accentSurface: 5.846,
      chartBackground: 8.233,
      valid: true,
    },
  });
});

test("P-0 preview is one offline HTML file with all interactive cards", async () => {
  const model = await loadPalettePreviewModel({ sourceDir: SOURCE_DIR });
  const html = renderPalettePreview(model);

  assert.match(html, /^<!doctype html>\n<html lang="ja">/);
  assert.equal(
    (html.match(/class="palette-preview-card(?: has-review-note)?"/g) ?? [])
      .length,
    153,
  );
  assert.equal((html.match(/<input type="color"/g) ?? []).length, 459);
  assert.match(html, /標準のみ/);
  assert.match(html, /要確認のみ/);
  assert.match(html, /変更一覧/);
  assert.match(html, /すべて初期値に戻す/);
  assert.match(html, /この画面で色を変更しても正典CSVは変更されません。/);
  assert.match(html, /aria-label="五つの風を見渡す観測者 澄み切った空色の完成イメージ"/);
  assert.match(html, /data-role="background-hex">#F5F5F6</);
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /<script[^>]+\bsrc=/i);
  assert.doesNotMatch(html, /<link[^>]+\bhref=/i);
  assert.doesNotMatch(html, /\bfetch\s*\(/);

  const data = html.match(
    /<script type="application\/json" id="palette-data">([\s\S]*?)<\/script>/,
  );
  const browserScripts = [
    ...html.matchAll(/<script>([\s\S]*?)<\/script>/g),
  ].map((match) => match[1]);
  assert.ok(data);
  assert.equal(browserScripts.length, 2);
  assert.equal(JSON.parse(data[1]).length, 153);
  for (const browserScript of browserScripts) {
    assert.doesNotThrow(() => new Script(browserScript));
  }
});

test("P-0 preview CLI is deterministic and matches the committed HTML", async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "palette-preview-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const firstPath = path.join(directory, "first.html");
  const secondPath = path.join(directory, "second.html");

  for (const outputPath of [firstPath, secondPath]) {
    await execFileAsync(process.execPath, [
      SCRIPT_PATH,
      "--source",
      SOURCE_DIR,
      "--output",
      outputPath,
    ]);
  }

  const [first, second, committed] = await Promise.all([
    readFile(firstPath),
    readFile(secondPath),
    readFile(COMMITTED_PREVIEW),
  ]);
  assert.deepEqual(first, second);
  assert.deepEqual(first, committed);
});

test("browser-side edited colors remain in parity with canonical palette usage", async () => {
  const model = await loadPalettePreviewModel({ sourceDir: SOURCE_DIR });
  const html = renderPalettePreview(model);
  const executableScripts = [
    ...html.matchAll(/<script>([\s\S]*?)<\/script>/g),
  ].map((match) => match[1]);
  assert.equal(executableScripts.length, 2);

  const context = createContext({});
  new Script(executableScripts[0]).runInContext(context);
  const calculator = context.PalettePreviewCalculator;
  assert.deepEqual(
    Object.keys(calculator).sort(),
    ["ratios", "resolve"],
  );

  const entry = model.palettes[0];
  const cases = [
    {
      primary: "#1A2B3C",
      secondary: "#EEDDCC",
      accent: "#336699",
    },
    {
      primary: "#FFFFFF",
      secondary: "#000000",
      accent: "#FF0000",
    },
    {
      primary: "#E07868",
      secondary: "#E69A4B",
      accent: "#38A8A0",
    },
  ];

  for (const colors of cases) {
    const canonical = resolvePaletteUsage({
      paletteId: entry.paletteId,
      version: model.presentationDefinitionVersion,
      label: entry.paletteLabel,
      baseColors: colors,
      description: entry.description,
    }, {
      paletteId: entry.paletteId,
      version: model.presentationDefinitionVersion,
      roles: {
        background: entry.mapping.background,
        surface: entry.mapping.surface,
        accent: entry.mapping.accent,
        chart: entry.mapping.chart,
      },
      textCandidates: entry.mapping.textCandidates,
    });
    const browserResolved = JSON.parse(JSON.stringify(
      calculator.resolve(entry, colors),
    ));
    assert.deepEqual(browserResolved, canonical);

    const expectedRatios = {
      textBackground: contrastRatio(canonical.text, canonical.background),
      textSurface: contrastRatio(canonical.text, canonical.surface),
      accentSurface: contrastRatio(canonical.accent, canonical.surface),
      chartBackground: contrastRatio(canonical.chart, canonical.background),
    };
    const browserRatios = JSON.parse(JSON.stringify(
      calculator.ratios(browserResolved),
    ));
    assert.deepEqual(browserRatios, expectedRatios);
  }
});

test("package command regenerates the standalone P-0 preview", async () => {
  const packageJson = JSON.parse(
    await readFile(path.join(ROOT, "package.json"), "utf8"),
  );
  assert.equal(
    packageJson.scripts["content:preview:palettes"],
    "node scripts/content/render-palette-preview.mjs --source content/source --output docs/palette-preview.html",
  );
});
