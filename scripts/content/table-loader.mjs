import { readFile } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";

import { ContentError } from "./content-error.mjs";
import { decodeCsvBytes } from "./encoding.mjs";
import { parseCsv } from "./csv-parser.mjs";

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VERSION_PATTERN = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
const INTEGER_PATTERN = /^(?:0|[1-9]\d*)$/;

function valueError({ code, sourceName, lineNumber, columnName, message }) {
  return new ContentError({
    code,
    sourceName,
    lineNumber,
    columnName,
    message,
  });
}

function convertValue(value, column, sourceName, lineNumber) {
  if (value === "" && column.required) {
    throw valueError({
      code: "CSV_REQUIRED_VALUE_MISSING",
      sourceName,
      lineNumber,
      columnName: column.name,
      message: "必須項目が空欄です。",
    });
  }

  if (value === "" && column.required === false) return "";

  if (column.type === "integer") {
    if (!INTEGER_PATTERN.test(value)) {
      throw valueError({
        code: "CSV_INTEGER_INVALID",
        sourceName,
        lineNumber,
        columnName: column.name,
        message: "0以上の10進整数で指定してください。",
      });
    }
    const numberValue = Number(value);
    if (!Number.isSafeInteger(numberValue)
      || (Object.hasOwn(column, "minimum") && numberValue < column.minimum)) {
      throw valueError({
        code: "CSV_INTEGER_INVALID",
        sourceName,
        lineNumber,
        columnName: column.name,
        message: "指定可能な整数の範囲外です。",
      });
    }
    return numberValue;
  }

  const valid = (column.type === "id" && ID_PATTERN.test(value))
    || (column.type === "version" && VERSION_PATTERN.test(value))
    || (column.type === "text")
    || (column.type === "enum" && column.values.includes(value));
  if (!valid) {
    throw valueError({
      code: "CSV_VALUE_INVALID",
      sourceName,
      lineNumber,
      columnName: column.name,
      message: "列の値が定義に一致しません。",
    });
  }
  return value;
}

function convertRow(row, schema, sourceName) {
  return Object.fromEntries(schema.columns.map((column, index) => [
    column.name,
    convertValue(row.values[index], column, sourceName, row.lineNumber),
  ]));
}

export async function loadCsvTable({ filePath, schema }) {
  const bytes = await readFile(filePath);
  const { text, encoding } = decodeCsvBytes(bytes, filePath);
  const parsed = parseCsv(text, filePath);
  const expectedHeaders = schema.columns.map(({ name }) => name);
  if (!isDeepStrictEqual(parsed.headers, expectedHeaders)) {
    throw new ContentError({
      code: "CSV_COLUMNS_INVALID",
      sourceName: filePath,
      lineNumber: 1,
      message: `列順は ${expectedHeaders.join(",")} である必要があります。`,
    });
  }
  return {
    encoding,
    rows: parsed.rows.map((row) => convertRow(row, schema, filePath)),
  };
}
