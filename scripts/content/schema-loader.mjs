import { readFile } from "node:fs/promises";

import { ContentError } from "./content-error.mjs";

const ROOT_FIELDS = ["schemaVersion", "fileName", "columns"];
const BASE_COLUMN_FIELDS = ["name", "type", "required"];
const SUPPORTED_TYPES = new Set(["id", "reference", "version", "integer", "text", "enum"]);

function schemaError(sourceName, message) {
  return new ContentError({
    code: "CSV_SCHEMA_INVALID",
    sourceName,
    message,
  });
}

function isExactObject(value, expectedFields) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const keys = Object.keys(value);
  return keys.length === expectedFields.length
    && expectedFields.every((field) => Object.hasOwn(value, field));
}

function validateColumn(column, sourceName) {
  if (column === null || typeof column !== "object" || Array.isArray(column)) {
    throw schemaError(sourceName, "列記述子はオブジェクトで指定してください。");
  }
  if (!SUPPORTED_TYPES.has(column.type)) {
    throw schemaError(sourceName, "列型がサポートされていません。");
  }

  const expectedFields = column.type === "integer"
    ? (Object.hasOwn(column, "minimum") ? [...BASE_COLUMN_FIELDS, "minimum"] : BASE_COLUMN_FIELDS)
    : (column.type === "enum" ? [...BASE_COLUMN_FIELDS, "values"] : BASE_COLUMN_FIELDS);
  if (!isExactObject(column, expectedFields)) {
    throw schemaError(sourceName, "列記述子に未定義または不足している項目があります。");
  }
  if (typeof column.name !== "string" || column.name === "") {
    throw schemaError(sourceName, "列名は空でない文字列で指定してください。");
  }
  if (typeof column.required !== "boolean") {
    throw schemaError(sourceName, "必須指定は true または false で指定してください。");
  }
  if (column.type === "integer" && Object.hasOwn(column, "minimum")
    && (!Number.isSafeInteger(column.minimum))) {
    throw schemaError(sourceName, "最小値は安全な整数で指定してください。");
  }
  if (column.type === "enum") {
    if (!Array.isArray(column.values) || column.values.length === 0
      || column.values.some((value) => typeof value !== "string")
      || new Set(column.values).size !== column.values.length) {
      throw schemaError(sourceName, "列挙値は重複のない空でない文字列配列で指定してください。");
    }
  }
}

function validateSchema(schema, sourceName) {
  if (!isExactObject(schema, ROOT_FIELDS)) {
    throw schemaError(sourceName, "スキーマの項目が正しくありません。");
  }
  if (schema.schemaVersion !== 1) {
    throw schemaError(sourceName, "schemaVersion は 1 で指定してください。");
  }
  if (typeof schema.fileName !== "string" || schema.fileName === "") {
    throw schemaError(sourceName, "fileName は空でない文字列で指定してください。");
  }
  if (!Array.isArray(schema.columns) || schema.columns.length === 0) {
    throw schemaError(sourceName, "columns は空でない配列で指定してください。");
  }

  const columnNames = new Set();
  for (const column of schema.columns) {
    validateColumn(column, sourceName);
    if (columnNames.has(column.name)) {
      throw schemaError(sourceName, "列名は重複できません。");
    }
    columnNames.add(column.name);
  }

  return schema;
}

export async function loadTableSchema(schemaPath) {
  const bytes = await readFile(schemaPath);
  let schema;
  try {
    schema = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw schemaError(schemaPath, "スキーマJSONを解析できません。");
  }
  return validateSchema(schema, schemaPath);
}
