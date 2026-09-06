import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { appMeta } from "../js/config/app-meta.js";
import {
  FragranceMaterialDefinitions,
  FragranceSuggestions,
  PaletteDefinitions,
  PaletteUsageMappingDefinitions,
  PresentationDefinitionSet,
} from "../js/data/presentation-definitions.js";
import { TitleProfileDefinitions } from "../js/data/title-profile-definitions.js";
import { selectPresentation } from "../js/domain/presentation-selector.js";
import { summarizeFragrances } from "../js/domain/share-fragrance-summary.js";
import {
  generatePresentationRuntime,
} from "../../scripts/content/generate-presentation-runtime.mjs";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SOURCE = path.join(ROOT, "content", "source");

function outputPaths(root) {
  const dataDir = path.join(root, "app", "js", "data");
  return {
    dataDir,
    paths: {
      presentation: path.join(dataDir, "presentation-definitions.js"),
      titleProfiles: path.join(dataDir, "title-profile-definitions.js"),
    },
  };
}

async function generateIntoTemp(t, sourceDir = SOURCE) {
  const root = await mkdtemp(path.join(os.tmpdir(), "big-five-presentation-runtime-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const { dataDir, paths } = outputPaths(root);
  await mkdir(dataDir, { recursive: true });
  const hashes = await generatePresentationRuntime({
    sourceDir,
    outputPaths: paths,
  });
  const bytes = {
    presentation: await readFile(paths.presentation),
    titleProfiles: await readFile(paths.titleProfiles),
  };
  return { hashes, bytes, paths };
}

async function copySource(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "big-five-presentation-source-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const sourceDir = path.join(root, "source");
  await cp(SOURCE, sourceDir, { recursive: true });
  return sourceDir;
}

async function rewrite(filePath, transform) {
  const before = await readFile(filePath, "utf8");
  const after = transform(before);
  assert.notEqual(after, before);
  await writeFile(filePath, after, "utf8");
}

test("T-005 F-018 approved CSV generates byte-identical ES Modules twice", async (t) => {
  const first = await generateIntoTemp(t);
  const second = await generateIntoTemp(t);

  assert.deepEqual(first.bytes, second.bytes);
  assert.deepEqual(first.hashes, second.hashes);
  assert.deepEqual(first.hashes, {
    presentationSha256: createHash("sha256")
      .update(first.bytes.presentation)
      .digest("hex"),
    titleProfilesSha256: createHash("sha256")
      .update(first.bytes.titleProfiles)
      .digest("hex"),
  });
});

test("T-005 F-018 generated runtime exposes the approved sharing-card gate", () => {
  assert.equal(PresentationDefinitionSet.schemaVersion, 2);
  assert.equal(PresentationDefinitionSet.presentationDefinitionVersion, "presentation-v2");
  assert.equal(appMeta.presentationDefinitionVersion, "presentation-v2");
  assert.equal(PaletteDefinitions.length, 153);
  assert.equal(PaletteDefinitions.length, PaletteUsageMappingDefinitions.length);
  assert.equal(FragranceSuggestions.length, 29);
  assert.equal(FragranceMaterialDefinitions.length, 25);
  assert.equal(PresentationDefinitionSet.titleSelectors.length, 51);
  assert.equal(TitleProfileDefinitions.length, 51);
  assert.equal(
    TitleProfileDefinitions.every(({ defaultPaletteId }) =>
      PaletteDefinitions.some(({ paletteId }) => paletteId === defaultPaletteId)),
    true,
  );
  assert.equal(Object.isFrozen(PresentationDefinitionSet), true);
  assert.equal(Object.isFrozen(PresentationDefinitionSet.titleSelectors[0]), true);
  assert.equal(Object.isFrozen(TitleProfileDefinitions), true);
  assert.equal(Object.isFrozen(TitleProfileDefinitions[0]), true);

  const selection = selectPresentation(
    TitleProfileDefinitions[0],
    PresentationDefinitionSet,
  );
  const summary = summarizeFragrances(selection.fragranceScenes);
  assert.equal(summary.length, 3);
  assert.deepEqual(
    Object.keys(summary[0]),
    ["sceneId", "iconId", "label", "materialNames", "accordLabel"],
  );
  assert.equal(
    summary.every(({ materialNames }) =>
      materialNames.length >= 1 && materialNames.length <= 2),
    true,
  );
  assert.doesNotMatch(JSON.stringify(summary), /materialId|displayName/);
});

test("T-005 F-018 generator refuses unsafe output names", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "big-five-presentation-output-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const { dataDir, paths } = outputPaths(root);
  await mkdir(dataDir, { recursive: true });

  await assert.rejects(
    () => generatePresentationRuntime({
      sourceDir: SOURCE,
      outputPaths: {
        ...paths,
        presentation: path.join(dataDir, "unexpected.js"),
      },
    }),
    /PRESENTATION_RUNTIME_GENERATION_INVALID/,
  );
});

test("T-005 F-018 generator rejects unapproved and noncanonical authoring without replacing either module", async (t) => {
  const mutations = [
    {
      name: "draft gate",
      relative: "approvals/presentation-content-approvals.csv",
      transform: (value) => value.replace(
        /P-6,7,titles-pair-31-40,approved,user,2026-07-31,/,
        "P-6,7,titles-pair-31-40,draft,,,",
      ),
    },
    {
      name: "draft selected row",
      relative: "presentation/presentation-v2/presentation-selectors.csv",
      transform: (value) => value.replace(
        /title-balanced,presentation-v2,1,approved/,
        "title-balanced,presentation-v2,1,draft",
      ),
    },
    {
      name: "unknown field",
      relative: "presentation/presentation-v2/presentation-selectors.csv",
      transform: (value) => value
        .split(/\r?\n/)
        .map((line) => line === "" ? line : `${line},unexpected`)
        .join("\r\n"),
    },
    {
      name: "noncanonical physical order",
      relative: "presentation/presentation-v2/presentation-selectors.csv",
      transform: (value) => {
        const lines = value.split(/\r?\n/);
        [lines[1], lines[2]] = [lines[2], lines[1]];
        return lines.join("\r\n");
      },
    },
  ];

  for (const mutation of mutations) {
    await t.test(mutation.name, async (t) => {
      const sourceDir = await copySource(t);
      const root = await mkdtemp(path.join(os.tmpdir(), "big-five-presentation-atomic-"));
      t.after(() => rm(root, { recursive: true, force: true }));
      const { dataDir, paths } = outputPaths(root);
      await mkdir(dataDir, { recursive: true });
      await writeFile(paths.presentation, "previous presentation\n", "utf8");
      await writeFile(paths.titleProfiles, "previous titles\n", "utf8");
      await rewrite(
        path.join(sourceDir, mutation.relative),
        mutation.transform,
      );

      await assert.rejects(
        () => generatePresentationRuntime({ sourceDir, outputPaths: paths }),
        /PRESENTATION_RUNTIME_GENERATION_INVALID/,
      );
      assert.equal(
        await readFile(paths.presentation, "utf8"),
        "previous presentation\n",
      );
      assert.equal(
        await readFile(paths.titleProfiles, "utf8"),
        "previous titles\n",
      );
    });
  }
});
