import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { loadPresentationReviewModel } from "../../scripts/content/render-presentation-review.mjs";
import { loadTableSchema } from "../../scripts/content/schema-loader.mjs";
import { loadCsvTable } from "../../scripts/content/table-loader.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SOURCE_DIR = path.join(ROOT, "content/source");
const PRESENTATION_DIR = path.join(SOURCE_DIR, "presentation/presentation-v2");
const OLD_FRAGRANCE_IDS = [
  "fragrance-pause-roman-chamomile-soft",
  "fragrance-pause-chamomile",
  "fragrance-pause-ylang-ylang",
  "fragrance-reset-citronella",
  "fragrance-pause-patchouli",
];
const OLD_MATERIAL_IDS = [
  "material-chamomile",
  "material-ylang-ylang",
  "material-citronella",
];

async function loadTable(fileName) {
  const schema = await loadTableSchema(path.join(ROOT, "content/schemas", `${fileName}.schema.json`));
  return loadCsvTable({
    filePath: path.join(PRESENTATION_DIR, `${fileName}.csv`),
    schema,
  });
}

function assertOneBasedOrder(rows, label) {
  assert.deepEqual(rows.map(({ display_order }) => display_order),
    Array.from({ length: rows.length }, (_, index) => index + 1), label);
}

test("T-002 Q-013 香調・素材の廃止と置換後の定義をコンパイルする", async () => {
  const model = await loadPresentationReviewModel({ sourceDir: SOURCE_DIR });
  const { fragrances, fragranceMaterials } = model.definitionSet;
  const fragranceById = new Map(fragrances.map((fragrance) => [fragrance.fragranceId, fragrance]));

  assert.equal(fragrances.length, 29);
  assert.equal(fragranceMaterials.length, 25);
  for (const fragranceId of OLD_FRAGRANCE_IDS) assert.equal(fragranceById.has(fragranceId), false);
  const materialIds = new Set(fragranceMaterials.map(({ materialId }) => materialId));
  for (const materialId of OLD_MATERIAL_IDS) assert.equal(materialIds.has(materialId), false);
  assert.deepEqual(fragranceById.get("fragrance-pause-sweet-orange")?.materialIds, ["material-sweet-orange"]);
  assert.equal(fragranceById.get("fragrance-pause-sweet-orange")?.sceneId, "pause");
  assert.equal(fragranceById.get("fragrance-pause-sweet-orange")?.familyId, "citrus");
  assert.deepEqual(fragranceById.get("fragrance-reset-ginger")?.materialIds, ["material-ginger"]);
  assert.equal(fragranceById.get("fragrance-reset-ginger")?.sceneId, "reset");
  assert.equal(fragranceById.get("fragrance-reset-ginger")?.familyId, "spicy");
  assert.deepEqual(
    fragrances.filter(({ materialIds }) => materialIds.includes("material-patchouli")).map(({ fragranceId }) => fragranceId),
    ["fragrance-quiet-focus-patchouli"],
  );
});

test("T-002 Q-013 香調・素材CSVはP-1承認後も順序・選択契約を保つ", async () => {
  const [fragrances, materials, examples, selectors, model] = await Promise.all([
    loadTable("fragrances"),
    loadTable("fragrance-materials"),
    loadTable("fragrance-material-examples"),
    loadTable("selector-fragrances"),
    loadPresentationReviewModel({ sourceDir: SOURCE_DIR }),
  ]);
  for (const table of [fragrances, materials, examples]) {
    assert.ok(table.rows.every(({ presentation_definition_version, status }) =>
      presentation_definition_version === "presentation-v2" && status === "approved"));
  }
  const approvedTitleIds = new Set(
    model.definitionSet.titleSelectors.slice(0, 41).map(({ titleId }) => titleId),
  );
  assert.ok(selectors.rows.every(({ title_id, status }) =>
    status === (approvedTitleIds.has(title_id) ? "approved" : "draft")));
  assertOneBasedOrder(fragrances.rows, "fragrances");
  assertOneBasedOrder(materials.rows, "materials");
  const examplesByFragrance = Map.groupBy(examples.rows, ({ fragrance_id }) => fragrance_id);
  for (const [fragranceId, rows] of examplesByFragrance) assertOneBasedOrder(rows, fragranceId);
  const selectorsByTitleScene = Map.groupBy(selectors.rows, ({ title_id, scene_id }) => `${title_id}:${scene_id}`);
  for (const [titleScene, rows] of selectorsByTitleScene) {
    assert.deepEqual(rows.map(({ display_order }) => display_order), [1, 2], titleScene);
    assert.equal(new Set(rows.map(({ fragrance_id }) => fragrance_id)).size, 2, titleScene);
    assert.equal(rows.filter(({ share_selected }) => share_selected === "true").length, 1, titleScene);
  }
});

test("T-002 Q-013 指摘香調は場面に合う非効能表現を持つ", async () => {
  const model = await loadPresentationReviewModel({ sourceDir: SOURCE_DIR });
  const byId = new Map(model.definitionSet.fragrances.map((fragrance) => [fragrance.fragranceId, fragrance]));
  const text = (fragranceId) => {
    const fragrance = byId.get(fragranceId);
    return `${fragrance?.accordLabel}\n${fragrance?.description}`;
  };

  assert.match(text("fragrance-reset-lemongrass"), /レモンを思わせる青い草/);
  assert.match(text("fragrance-quiet-focus-juniper-berry"), /澄んだ針葉樹と青い実/);
  assert.match(text("fragrance-pause-ho-wood"), /やわらかな花/);
  assert.match(text("fragrance-quiet-focus-bergamot"), /ほろ苦さ/);
  assert.match(text("fragrance-quiet-focus-bergamot"), /端正な輪郭/);
  assert.match(text("fragrance-reset-mandarin"), /丸みのあるやさしい切替/);

  for (const ids of [
    ["fragrance-reset-rosemary", "fragrance-quiet-focus-rosemary"],
    ["fragrance-reset-bergamot", "fragrance-quiet-focus-bergamot"],
    ["fragrance-pause-hinoki", "fragrance-quiet-focus-hinoki"],
    ["fragrance-pause-frankincense", "fragrance-quiet-focus-frankincense"],
  ]) {
    assert.equal(new Set(ids.map(text)).size, 2, ids.join(", "));
  }
  for (const fragrance of model.definitionSet.fragrances.filter(({ sceneId }) => sceneId === "pause")) {
    assert.doesNotMatch(fragrance.description, /濃厚|官能的|深く沈み込む/);
  }
  for (const fragrance of model.definitionSet.fragrances) {
    assert.doesNotMatch(fragrance.description, /効能|適合|推奨|使用法|ディフューザー/);
  }
});
