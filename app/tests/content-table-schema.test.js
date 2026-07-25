import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ContentError } from "../../scripts/content/content-error.mjs";
import { loadTableSchema } from "../../scripts/content/schema-loader.mjs";
import { loadCsvTable } from "../../scripts/content/table-loader.mjs";
import { formatContentErrors } from "../../scripts/content/report-content-errors.mjs";

const validSchema = {
  schemaVersion: 1,
  fileName: "questions.csv",
  columns: [
    { name: "question_id", type: "id", required: true },
  ],
};

async function withSchema(value, callback) {
  const directory = await mkdtemp(join(tmpdir(), "big-five-schema-"));
  const schemaPath = join(directory, "table.schema.json");
  await writeFile(schemaPath, JSON.stringify(value), "utf8");
  try {
    return await callback(schemaPath);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function withCsv(text, callback) {
  const directory = await mkdtemp(join(tmpdir(), "big-five-table-"));
  const filePath = join(directory, "table.csv");
  await writeFile(filePath, text, "utf8");
  try {
    return await callback(filePath);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("T-012 schema loader accepts only the exact descriptor shape", async () => {
  await withSchema(validSchema, async (schemaPath) => {
    assert.deepEqual(await loadTableSchema(schemaPath), validSchema);
  });

  const invalidSchemas = [
    { ...validSchema, extra: true },
    {
      ...validSchema,
      columns: [
        ...validSchema.columns,
        { name: "question_id", type: "text", required: true },
      ],
    },
    {
      ...validSchema,
      columns: [{ name: "question_id", type: "decimal", required: true }],
    },
    {
      ...validSchema,
      columns: [{ name: "status", type: "enum", required: true }],
    },
    {
      ...validSchema,
      columns: [{ name: "display_order", type: "integer", minimum: 1.5, required: true }],
    },
  ];

  for (const invalidSchema of invalidSchemas) {
    await withSchema(invalidSchema, async (schemaPath) => {
      await assert.rejects(
        loadTableSchema(schemaPath),
        (error) => error instanceof ContentError && error.code === "CSV_SCHEMA_INVALID",
      );
    });
  }
});

test("T-012 schema loader accepts boolean required and rejects non-boolean values", async () => {
  const optionalSchema = {
    ...validSchema,
    columns: [{ name: "question_id", type: "id", required: false }],
  };
  await withSchema(optionalSchema, async (schemaPath) => {
    assert.deepEqual(await loadTableSchema(schemaPath), optionalSchema);
  });

  for (const required of [undefined, "false", 0, null]) {
    const column = { name: "question_id", type: "id" };
    if (required !== undefined) column.required = required;
    await withSchema({ ...validSchema, columns: [column] }, async (schemaPath) => {
      await assert.rejects(
        loadTableSchema(schemaPath),
        (error) => error instanceof ContentError && error.code === "CSV_SCHEMA_INVALID",
      );
    });
  }
});

test("T-012 table loader requires exact headers and converts only valid integers", async () => {
  const schema = {
    schemaVersion: 1,
    fileName: "table.csv",
    columns: [
      { name: "question_id", type: "id", required: true },
      { name: "question_version", type: "version", required: true },
      { name: "display_order", type: "integer", minimum: 1, required: true },
      { name: "text", type: "text", required: true },
      { name: "status", type: "enum", values: ["draft", "approved"], required: true },
    ],
  };

  await withCsv(
    "question_id,question_version,display_order,text,status\nquestion-1,mvp-0.1.0,2,  preserve  ,approved\n",
    async (filePath) => {
      assert.deepEqual(await loadCsvTable({ filePath, schema }), {
        encoding: "utf-8",
        rows: [{
          question_id: "question-1",
          question_version: "mvp-0.1.0",
          display_order: 2,
          text: "  preserve  ",
          status: "approved",
        }],
      });
    },
  );

  for (const [headers, row] of [
    ["question_id,question_version,text,display_order,status", "question-1,mvp-0.1.0,text,2,approved"],
    ["question_id,question_version,display_order,text", "question-1,mvp-0.1.0,2,text"],
    ["question_id,question_version,display_order,text,status,unexpected", "question-1,mvp-0.1.0,2,text,approved,extra"],
  ]) {
    await withCsv(`${headers}\n${row}\n`, async (filePath) => {
      await assert.rejects(
        loadCsvTable({ filePath, schema }),
        (error) => error instanceof ContentError
          && error.code === "CSV_COLUMNS_INVALID"
          && error.sourceName === filePath
          && error.lineNumber === 1,
      );
    });
  }
});

test("T-012 table loader reports required, value, and integer errors at their source cell", async () => {
  const schema = {
    schemaVersion: 1,
    fileName: "table.csv",
    columns: [
      { name: "question_id", type: "id", required: true },
      { name: "question_version", type: "version", required: true },
      { name: "display_order", type: "integer", minimum: 1, required: true },
      { name: "text", type: "text", required: true },
      { name: "status", type: "enum", values: ["draft", "approved"], required: true },
    ],
  };
  const cases = [
    ["question-1,mvp-0.1.0,1,,approved", "text", "CSV_REQUIRED_VALUE_MISSING"],
    ["question_1,mvp-0.1.0,1,text,approved", "question_id", "CSV_VALUE_INVALID"],
    ["question-1,MVP-0.1.0,1,text,approved", "question_version", "CSV_VALUE_INVALID"],
    ["question-1,mvp-0.1.0,1,text, approved ", "status", "CSV_VALUE_INVALID"],
    ["question-1,mvp-0.1.0,01,text,approved", "display_order", "CSV_INTEGER_INVALID"],
    ["question-1,mvp-0.1.0,0,text,approved", "display_order", "CSV_INTEGER_INVALID"],
    ["question-1,mvp-0.1.0, 1,text,approved", "display_order", "CSV_INTEGER_INVALID"],
  ];

  for (const [row, columnName, code] of cases) {
    await withCsv(
      `question_id,question_version,display_order,text,status\n${row}\n`,
      async (filePath) => {
        await assert.rejects(
          loadCsvTable({ filePath, schema }),
          (error) => error instanceof ContentError
            && error.code === code
            && error.sourceName === filePath
            && error.lineNumber === 2
            && error.columnName === columnName,
        );
      },
    );
  }
});

test("T-012 table loader preserves an optional empty cell without coercion", async () => {
  const schema = {
    schemaVersion: 1,
    fileName: "table.csv",
    columns: [
      { name: "required_id", type: "id", required: true },
      { name: "optional_mode", type: "enum", values: ["preview20", "detail50"], required: false },
    ],
  };

  await withCsv("required_id,optional_mode\nitem-1,\n", async (filePath) => {
    assert.deepEqual(await loadCsvTable({ filePath, schema }), {
      encoding: "utf-8",
      rows: [{ required_id: "item-1", optional_mode: "" }],
    });
  });
});

test("T-012 table loader does not treat missing or null required as optional", async () => {
  for (const required of [undefined, null]) {
    const column = { name: "value", type: "enum", values: ["present"] };
    if (required !== undefined) column.required = required;
    const schema = { schemaVersion: 1, fileName: "table.csv", columns: [column] };
    await withCsv("value\n\n", async (filePath) => {
      await assert.rejects(
        loadCsvTable({ filePath, schema }),
        (error) => error instanceof ContentError && error.code === "CSV_VALUE_INVALID",
      );
    });
  }
});

test("T-005 schema and table loaders accept compatibility references without weakening ids", async () => {
  const schema = {
    schemaVersion: 1,
    fileName: "references.csv",
    columns: [{ name: "title_id", type: "reference", required: true }],
  };
  await withSchema(schema, async (schemaPath) => {
    assert.deepEqual(await loadTableSchema(schemaPath), schema);
  });
  await withCsv("title_id\ntitle-single-intellectImagination-high\n", async (filePath) => {
    assert.deepEqual(await loadCsvTable({ filePath, schema }), {
      encoding: "utf-8",
      rows: [{ title_id: "title-single-intellectImagination-high" }],
    });
  });
  for (const value of ["title--pair", "title---pair", "title pair", "title/pair", "-title", "title-"]) {
    await withCsv(`title_id\n${value}\n`, async (filePath) => {
      const valid = value === "title--pair";
      if (valid) {
        assert.equal((await loadCsvTable({ filePath, schema })).rows[0].title_id, value);
      } else {
        await assert.rejects(
          loadCsvTable({ filePath, schema }),
          (error) => error instanceof ContentError && error.code === "CSV_VALUE_INVALID",
        );
      }
    });
  }
});

test("T-012 report includes source, one-based row, column, code, and Japanese message", () => {
  const report = formatContentErrors([
    new ContentError({
      code: "CSV_REQUIRED_VALUE_MISSING",
      sourceName: "result-texts.csv",
      lineNumber: 18,
      columnName: "text",
      message: "必須の結果文が空欄です。",
    }),
  ]);

  assert.match(report, /result-texts\.csv: 18行目 \/ text/);
  assert.match(report, /CSV_REQUIRED_VALUE_MISSING/);
  assert.match(report, /必須の結果文が空欄です。/);
});
