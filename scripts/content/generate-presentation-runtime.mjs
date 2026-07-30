import { createHash } from "node:crypto";
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { selectPresentation } from "../../app/js/domain/presentation-selector.js";
import { summarizeFragrances } from "../../app/js/domain/share-fragrance-summary.js";
import { compilePresentationContent } from "./compile-presentation.mjs";
import { compileResultContent } from "./compile-result-content.mjs";
import {
  canonicalJson,
  validateAuthoringTree,
} from "./content-compiler.mjs";
import { loadTableSchema } from "./schema-loader.mjs";
import { loadCsvTable } from "./table-loader.mjs";

const ROOT_DIR = path.resolve(import.meta.dirname, "../..");
const SCHEMA_DIR = path.join(ROOT_DIR, "content", "schemas");
const PRESENTATION_VERSION = "presentation-v2";
const TITLE_RULE_VERSION = "title-rule-v1";
const RESULT_TEXT_VERSION = "result-text-v2";
const PRESENTATION_TABLES = Object.freeze([
  "sceneRows",
  "paletteRows",
  "paletteUsageRows",
  "fragranceRows",
  "fragranceMaterialRows",
  "fragranceMaterialExampleRows",
  "selectorRows",
  "selectorPaletteRows",
  "selectorFragranceRows",
]);
const OUTPUT_FIELDS = Object.freeze(["presentation", "titleProfiles"]);

function invalid() {
  throw new TypeError("PRESENTATION_RUNTIME_GENERATION_INVALID");
}

function exactRecord(value, fields) {
  return value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype &&
    Object.keys(value).length === fields.length &&
    fields.every((field) => Object.hasOwn(value, field));
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function regularDirectory(directory) {
  const info = await lstat(directory);
  return info.isDirectory() && !info.isSymbolicLink();
}

async function exists(filePath) {
  try {
    await lstat(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function validateOutputPaths(outputPaths) {
  if (!exactRecord(outputPaths, OUTPUT_FIELDS)) invalid();
  const presentation = path.resolve(outputPaths.presentation);
  const titleProfiles = path.resolve(outputPaths.titleProfiles);
  if (
    path.basename(presentation) !== "presentation-definitions.js" ||
    path.basename(titleProfiles) !== "title-profile-definitions.js" ||
    presentation === titleProfiles ||
    path.dirname(presentation) !== path.dirname(titleProfiles)
  ) {
    invalid();
  }
  const parent = path.dirname(presentation);
  if (!await regularDirectory(parent)) invalid();
  for (const output of [presentation, titleProfiles]) {
    if (await exists(output)) {
      const info = await lstat(output);
      if (!info.isFile() || info.isSymbolicLink()) invalid();
    }
  }
  return { presentation, titleProfiles, parent };
}

async function loadTable(sourceDir, segments, fileName) {
  const schema = await loadTableSchema(
    path.join(SCHEMA_DIR, fileName.replace(/\.csv$/, ".schema.json")),
  );
  return loadCsvTable({
    filePath: path.join(sourceDir, ...segments, fileName),
    schema,
  });
}

async function loadRuntimeCatalogs(sourceDir) {
  const definitions = [
    ["profileRows", ["titles", TITLE_RULE_VERSION], "title-profiles.csv"],
    ["profileFactorRows", ["titles", TITLE_RULE_VERSION], "title-profile-factors.csv"],
    ["textRows", ["result-texts", RESULT_TEXT_VERSION], "result-texts.csv"],
    ["textEvidenceRows", ["result-texts", RESULT_TEXT_VERSION], "result-text-evidence.csv"],
    ["titleReflectionRows", ["result-texts", RESULT_TEXT_VERSION], "title-reflection-comments.csv"],
    ["evidenceRows", ["evidence", "result-evidence-v1"], "result-evidence.csv"],
    ["evidenceClaimRows", ["evidence", "result-evidence-v1"], "result-evidence-claims.csv"],
    ["sceneRows", ["presentation", PRESENTATION_VERSION], "scenes.csv"],
    ["paletteRows", ["presentation", PRESENTATION_VERSION], "palettes.csv"],
    ["paletteUsageRows", ["presentation", PRESENTATION_VERSION], "palette-usage-mappings.csv"],
    ["fragranceRows", ["presentation", PRESENTATION_VERSION], "fragrances.csv"],
    ["fragranceMaterialRows", ["presentation", PRESENTATION_VERSION], "fragrance-materials.csv"],
    ["fragranceMaterialExampleRows", ["presentation", PRESENTATION_VERSION], "fragrance-material-examples.csv"],
    ["selectorRows", ["presentation", PRESENTATION_VERSION], "presentation-selectors.csv"],
    ["selectorPaletteRows", ["presentation", PRESENTATION_VERSION], "selector-palettes.csv"],
    ["selectorFragranceRows", ["presentation", PRESENTATION_VERSION], "selector-fragrances.csv"],
    ["presentationApprovals", ["approvals"], "presentation-content-approvals.csv"],
  ];
  const tables = await Promise.all(definitions.map(([, segments, fileName]) =>
    loadTable(sourceDir, segments, fileName)));
  return Object.fromEntries(
    definitions.map(([name], index) => [name, tables[index]]),
  );
}

function assertApproved(catalogs) {
  if (
    catalogs.presentationApprovals.rows.length !== 7 ||
    !catalogs.presentationApprovals.rows.every(
      (row, index) =>
        row.gate_id === `P-${index}` &&
        row.display_order === index + 1 &&
        row.status === "approved" &&
        row.approved_by.trim() !== "" &&
        row.approved_on.trim() !== "",
    )
  ) {
    invalid();
  }
  if (!PRESENTATION_TABLES.every((name) =>
    Array.isArray(catalogs[name]?.rows) &&
    catalogs[name].rows.every(({ status }) => status === "approved"))) {
    invalid();
  }
}

function assertGlobalOrder(rows) {
  if (!rows.every(({ display_order: displayOrder }, index) =>
    displayOrder === index + 1)) {
    invalid();
  }
}

function assertGroupedOrder(rows, expectedGroups, groupKey) {
  let cursor = 0;
  for (const expectedGroup of expectedGroups) {
    let displayOrder = 1;
    while (cursor < rows.length && groupKey(rows[cursor]) === expectedGroup) {
      if (rows[cursor].display_order !== displayOrder) invalid();
      cursor += 1;
      displayOrder += 1;
    }
    if (displayOrder === 1) invalid();
  }
  if (cursor !== rows.length) invalid();
}

function assertCanonicalOrder(catalogs) {
  for (const name of [
    "profileRows",
    "profileFactorRows",
    "sceneRows",
    "paletteRows",
    "paletteUsageRows",
    "fragranceRows",
    "fragranceMaterialRows",
    "selectorRows",
  ]) {
    if (name === "profileFactorRows") continue;
    assertGlobalOrder(catalogs[name].rows);
  }

  const titleIds = catalogs.profileRows.rows.map(({ title_id: titleId }) => titleId);
  const fragranceIds = catalogs.fragranceRows.rows.map(
    ({ fragrance_id: fragranceId }) => fragranceId,
  );
  const sceneIds = catalogs.sceneRows.rows.map(({ scene_id: sceneId }) => sceneId);
  assertGroupedOrder(
    catalogs.profileFactorRows.rows,
    titleIds.filter((titleId) =>
      catalogs.profileFactorRows.rows.some((row) => row.title_id === titleId)),
    ({ title_id: titleId }) => titleId,
  );
  assertGroupedOrder(
    catalogs.fragranceMaterialExampleRows.rows,
    fragranceIds,
    ({ fragrance_id: fragranceId }) => fragranceId,
  );
  assertGroupedOrder(
    catalogs.selectorPaletteRows.rows,
    titleIds,
    ({ title_id: titleId }) => titleId,
  );
  assertGroupedOrder(
    catalogs.selectorFragranceRows.rows,
    titleIds.flatMap((titleId) =>
      sceneIds.map((sceneId) => `${titleId}/${sceneId}`)),
    ({ title_id: titleId, scene_id: sceneId }) => `${titleId}/${sceneId}`,
  );
}

function compileApprovedRuntime(catalogs) {
  const get = (name) => catalogs[name].rows;
  const result = compileResultContent({
    profileRows: get("profileRows"),
    profileFactorRows: get("profileFactorRows"),
    textRows: get("textRows"),
    textEvidenceRows: get("textEvidenceRows"),
    titleReflectionRows: get("titleReflectionRows"),
    evidenceRows: get("evidenceRows"),
    evidenceClaimRows: get("evidenceClaimRows"),
    titleRuleVersion: TITLE_RULE_VERSION,
    resultTextVersion: RESULT_TEXT_VERSION,
  });
  const presentation = compilePresentationContent({
    sceneRows: get("sceneRows"),
    paletteRows: get("paletteRows"),
    paletteUsageRows: get("paletteUsageRows"),
    fragranceRows: get("fragranceRows"),
    fragranceMaterialRows: get("fragranceMaterialRows"),
    fragranceMaterialExampleRows: get("fragranceMaterialExampleRows"),
    selectorRows: get("selectorRows"),
    selectorPaletteRows: get("selectorPaletteRows"),
    selectorFragranceRows: get("selectorFragranceRows"),
    titleProfiles: result.titleProfiles,
  }, PRESENTATION_VERSION);
  return { presentation, titleProfiles: result.titleProfiles };
}

function assertShareProjection({ presentation, titleProfiles }) {
  const forbiddenValues = presentation.fragranceMaterials.map(
    ({ materialId }) => materialId,
  );
  for (const titleProfile of titleProfiles) {
    const selection = selectPresentation(titleProfile, presentation);
    const summary = summarizeFragrances(selection.fragranceScenes);
    if (
      summary.length !== 3 ||
      !summary.every((item) =>
        Object.keys(item).join(",") ===
          "sceneId,iconId,label,materialNames,accordLabel" &&
        item.materialNames.length >= 1 &&
        item.materialNames.length <= 2
      )
    ) {
      invalid();
    }
    const serialized = JSON.stringify(summary);
    if (forbiddenValues.some((value) => serialized.includes(value))) invalid();
  }
}

function presentationModule(definitionSet) {
  return `// Generated by scripts/content/generate-presentation-runtime.mjs. Do not edit.\n` +
    `import { validatePresentationDefinitionSet } from "../domain/presentation-definition-validator.js";\n` +
    `import { TitleProfileDefinitions } from "./title-profile-definitions.js";\n\n` +
    `const definitionSet = ${canonicalJson(definitionSet).trimEnd()};\n\n` +
    `export const PresentationDefinitionSet = validatePresentationDefinitionSet(\n` +
    `  definitionSet,\n` +
    `  { titleProfiles: TitleProfileDefinitions, expectedVersion: "presentation-v2" },\n` +
    `);\n` +
    `export const PaletteDefinitions = PresentationDefinitionSet.palettes;\n` +
    `export const PaletteUsageMappingDefinitions = PresentationDefinitionSet.paletteUsageMappings;\n` +
    `export const FragranceSuggestions = PresentationDefinitionSet.fragrances;\n` +
    `export const FragranceMaterialDefinitions = PresentationDefinitionSet.fragranceMaterials;\n`;
}

function titleProfileModule(titleProfiles) {
  return `// Generated by scripts/content/generate-presentation-runtime.mjs. Do not edit.\n` +
    `import { validateTitleProfileDefinitions } from "../domain/title-profile.js";\n\n` +
    `export { validateTitleProfileDefinitions } from "../domain/title-profile.js";\n\n` +
    `function deepFreeze(value) {\n` +
    `  if (value && typeof value === "object" && !Object.isFrozen(value)) {\n` +
    `    Object.freeze(value);\n` +
    `    for (const nestedValue of Object.values(value)) deepFreeze(nestedValue);\n` +
    `  }\n` +
    `  return value;\n` +
    `}\n\n` +
    `const profileDefinitions = ${canonicalJson(titleProfiles).trimEnd()};\n\n` +
    `export const TitleProfileDefinitions = deepFreeze(\n` +
    `  validateTitleProfileDefinitions(profileDefinitions),\n` +
    `);\n`;
}

async function verifyTemp(filePath, expectedBytes, expectedHash) {
  const actual = await readFile(filePath, "utf8");
  if (actual !== expectedBytes || sha256(actual) !== expectedHash) invalid();
}

async function replaceBoth({ outputs, tempPaths }) {
  const backups = {
    presentation: `${outputs.presentation}.previous`,
    titleProfiles: `${outputs.titleProfiles}.previous`,
  };
  if (await exists(backups.presentation) || await exists(backups.titleProfiles)) {
    invalid();
  }
  const had = {
    presentation: await exists(outputs.presentation),
    titleProfiles: await exists(outputs.titleProfiles),
  };
  let movedPresentation = false;
  let movedTitles = false;
  let installedPresentation = false;
  let installedTitles = false;
  try {
    if (had.presentation) {
      await rename(outputs.presentation, backups.presentation);
      movedPresentation = true;
    }
    if (had.titleProfiles) {
      await rename(outputs.titleProfiles, backups.titleProfiles);
      movedTitles = true;
    }
    await rename(tempPaths.presentation, outputs.presentation);
    installedPresentation = true;
    await rename(tempPaths.titleProfiles, outputs.titleProfiles);
    installedTitles = true;
    if (movedPresentation) await rm(backups.presentation);
    if (movedTitles) await rm(backups.titleProfiles);
  } catch {
    if (installedPresentation && await exists(outputs.presentation)) {
      await rm(outputs.presentation);
    }
    if (installedTitles && await exists(outputs.titleProfiles)) {
      await rm(outputs.titleProfiles);
    }
    if (movedPresentation && await exists(backups.presentation)) {
      await rename(backups.presentation, outputs.presentation);
    }
    if (movedTitles && await exists(backups.titleProfiles)) {
      await rename(backups.titleProfiles, outputs.titleProfiles);
    }
    invalid();
  }
}

export async function generatePresentationRuntime({ sourceDir, outputPaths }) {
  let tempDir = null;
  try {
    if (typeof sourceDir !== "string" || sourceDir === "") invalid();
    const outputs = await validateOutputPaths(outputPaths);
    const resolvedSource = path.resolve(sourceDir);
    await validateAuthoringTree({ sourceDir: resolvedSource });
    const catalogs = await loadRuntimeCatalogs(resolvedSource);
    assertApproved(catalogs);
    assertCanonicalOrder(catalogs);
    const compiled = compileApprovedRuntime(catalogs);
    assertShareProjection(compiled);

    const presentationBytes = presentationModule(compiled.presentation);
    const titleProfilesBytes = titleProfileModule(compiled.titleProfiles);
    const hashes = {
      presentationSha256: sha256(presentationBytes),
      titleProfilesSha256: sha256(titleProfilesBytes),
    };

    tempDir = await mkdtemp(path.join(outputs.parent, ".presentation-runtime-"));
    const tempPaths = {
      presentation: path.join(tempDir, "presentation-definitions.js"),
      titleProfiles: path.join(tempDir, "title-profile-definitions.js"),
    };
    await Promise.all([
      writeFile(tempPaths.presentation, presentationBytes, "utf8"),
      writeFile(tempPaths.titleProfiles, titleProfilesBytes, "utf8"),
    ]);
    await Promise.all([
      verifyTemp(
        tempPaths.presentation,
        presentationBytes,
        hashes.presentationSha256,
      ),
      verifyTemp(
        tempPaths.titleProfiles,
        titleProfilesBytes,
        hashes.titleProfilesSha256,
      ),
    ]);
    await replaceBoth({ outputs, tempPaths });
    await rm(tempDir, { recursive: true, force: true });
    tempDir = null;
    return Object.freeze(hashes);
  } catch (error) {
    if (tempDir !== null) {
      await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
    if (
      error instanceof TypeError &&
      error.message === "PRESENTATION_RUNTIME_GENERATION_INVALID"
    ) {
      throw error;
    }
    invalid();
  }
}

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (
      !["--source", "--presentation-output", "--titles-output"].includes(key) ||
      typeof value !== "string" ||
      value.startsWith("--") ||
      Object.hasOwn(values, key)
    ) {
      invalid();
    }
    values[key] = value;
  }
  if (
    argv.length !== 6 ||
    !values["--source"] ||
    !values["--presentation-output"] ||
    !values["--titles-output"]
  ) {
    invalid();
  }
  return values;
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  await mkdir(path.dirname(path.resolve(args["--presentation-output"])), {
    recursive: false,
  }).catch((error) => {
    if (error?.code !== "EEXIST") throw error;
  });
  const hashes = await generatePresentationRuntime({
    sourceDir: path.resolve(args["--source"]),
    outputPaths: {
      presentation: path.resolve(args["--presentation-output"]),
      titleProfiles: path.resolve(args["--titles-output"]),
    },
  });
  process.stdout.write(
    `Presentation runtime generated: ${hashes.presentationSha256} ${hashes.titleProfilesSha256}\n`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  await main();
}
