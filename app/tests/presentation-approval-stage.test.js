import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { appMeta } from "../js/config/app-meta.js";
import { loadTableSchema } from "../../scripts/content/schema-loader.mjs";
import { loadCsvTable } from "../../scripts/content/table-loader.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SOURCE = path.join(ROOT, "content/source");
const SCHEMAS = path.join(ROOT, "content/schemas");
const PRESENTATION = path.join(
  SOURCE,
  "presentation/presentation-v2",
);

async function table(directory, fileName) {
  return loadCsvTable({
    filePath: path.join(directory, fileName),
    schema: await loadTableSchema(
      path.join(SCHEMAS, fileName.replace(/\.csv$/, ".schema.json")),
    ),
  });
}

function gateForTitleOrder(order) {
  if (order <= 11) return "P-2";
  if (order <= 21) return "P-3";
  if (order <= 31) return "P-4";
  if (order <= 41) return "P-5";
  return "P-6";
}

test("current presentation rows follow their gate stage without pinning every gate to draft", async () => {
  const approvals = await table(
    path.join(SOURCE, "approvals"),
    "presentation-content-approvals.csv",
  );
  const statusByGate = new Map(
    approvals.rows.map(({ gate_id, status, approved_by, approved_on }) => {
      if (status === "approved") {
        assert.notEqual(approved_by, "", gate_id);
        assert.match(approved_on, /^\d{4}-\d{2}-\d{2}$/, gate_id);
      } else {
        assert.equal(approved_by, "", gate_id);
        assert.equal(approved_on, "", gate_id);
      }
      return [gate_id, status];
    }),
  );
  assert.deepEqual(
    [...statusByGate.keys()],
    Array.from({ length: 7 }, (_, index) => `P-${index}`),
  );

  for (const [gateId, fileNames] of [
    ["P-0", ["palettes.csv", "palette-usage-mappings.csv"]],
    ["P-1", [
      "scenes.csv",
      "fragrances.csv",
      "fragrance-materials.csv",
      "fragrance-material-examples.csv",
    ]],
  ]) {
    for (const fileName of fileNames) {
      const rows = (await table(PRESENTATION, fileName)).rows;
      assert.ok(rows.length > 0, fileName);
      assert.ok(
        rows.every(({ status }) => status === statusByGate.get(gateId)),
        `${fileName} must follow ${gateId}`,
      );
    }
  }

  const selectors = await table(PRESENTATION, "presentation-selectors.csv");
  const orderByTitle = new Map(
    selectors.rows.map(({ title_id, display_order }) => [title_id, display_order]),
  );
  for (const row of selectors.rows) {
    assert.equal(
      row.status,
      statusByGate.get(gateForTitleOrder(row.display_order)),
      row.title_id,
    );
  }
  for (const fileName of ["selector-palettes.csv", "selector-fragrances.csv"]) {
    for (const row of (await table(PRESENTATION, fileName)).rows) {
      const order = orderByTitle.get(row.title_id);
      assert.ok(order, row.title_id);
      assert.equal(
        row.status,
        statusByGate.get(gateForTitleOrder(order)),
        `${fileName}: ${row.title_id}`,
      );
    }
  }

  assert.equal(appMeta.presentationDefinitionVersion, "presentation-v1");
});
