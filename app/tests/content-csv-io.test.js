import test from "node:test";
import assert from "node:assert/strict";

import { ContentError } from "../../scripts/content/content-error.mjs";
import { parseCsv } from "../../scripts/content/csv-parser.mjs";
import { serializeCsv } from "../../scripts/content/csv-writer.mjs";
import { decodeCsvBytes } from "../../scripts/content/encoding.mjs";

test("T-011 CSV decoder accepts UTF-8 BOM, UTF-8, and CP932", () => {
  assert.deepEqual(
    decodeCsvBytes(
      Uint8Array.from([0xef, 0xbb, 0xbf, ...new TextEncoder().encode("text\nあ\n")]),
      "utf8-bom.csv",
    ),
    { text: "text\nあ\n", encoding: "utf-8-bom" },
  );
  assert.deepEqual(
    decodeCsvBytes(new TextEncoder().encode("text\nあ\n"), "utf8.csv"),
    { text: "text\nあ\n", encoding: "utf-8" },
  );
  assert.deepEqual(
    decodeCsvBytes(
      Uint8Array.from([0x74, 0x65, 0x78, 0x74, 0x0d, 0x0a, 0x82, 0xa0, 0x0d, 0x0a]),
      "cp932.csv",
    ),
    { text: "text\r\nあ\r\n", encoding: "cp932" },
  );
});

test("decoder rejects replacement characters and invalid CP932 tails", () => {
  assert.throws(
    () => decodeCsvBytes(Uint8Array.from([0x82]), "broken.csv"),
    (error) => error.code === "CSV_ENCODING_INVALID",
  );
  assert.throws(
    () => decodeCsvBytes(new TextEncoder().encode("text\n�\n"), "replacement.csv"),
    (error) => error.code === "CSV_REPLACEMENT_CHARACTER",
  );
});

test("CSV parser preserves commas, quotes, embedded CRLF, and physical line numbers", () => {
  const parsed = parseCsv(
    'id,text,status\r\nq-1,"A, B","approved"\r\nq-2,"1行目\r\n2行目",reviewed\r\n',
    "questions.csv",
  );
  assert.deepEqual(parsed.headers, ["id", "text", "status"]);
  assert.deepEqual(parsed.rows, [
    { lineNumber: 2, values: ["q-1", "A, B", "approved"] },
    { lineNumber: 3, values: ["q-2", "1行目\r\n2行目", "reviewed"] },
  ]);
  assert.equal(
    serializeCsv(parsed.headers, parsed.rows.map(({ values }) => values)),
    'id,text,status\r\nq-1,"A, B",approved\r\nq-2,"1行目\r\n2行目",reviewed\r\n',
  );
});

test("CSV parser accepts doubled quotes and LF while writer emits canonical CRLF", () => {
  const parsed = parseCsv('id,text\nq-1,"say ""hello"""\n', "quoted.csv");

  assert.deepEqual(parsed.rows, [
    { lineNumber: 2, values: ["q-1", 'say "hello"'] },
  ]);
  assert.equal(
    serializeCsv(parsed.headers, parsed.rows.map(({ values }) => values)),
    'id,text\r\nq-1,"say ""hello"""\r\n',
  );
});

test("CSV parser rejects malformed syntax with the stable error code", () => {
  for (const text of [
    'id,text\nq-1,a"b\n',
    'id,text\nq-1,"a"b\n',
    "id,text\nq-1\n",
    "id,\n",
    "id,id\n",
    'id,text\nq-1,"unterminated',
    "id,text\rq-1,value\r",
  ]) {
    assert.throws(
      () => parseCsv(text, "invalid.csv"),
      (error) => error instanceof ContentError && error.code === "CSV_SYNTAX_INVALID",
    );
  }
});

test("ContentError retains stable diagnostic properties", () => {
  const error = new ContentError({
    code: "CSV_SYNTAX_INVALID",
    sourceName: "questions.csv",
    lineNumber: 4,
    columnName: "text",
    message: "invalid CSV",
    safeValue: "safe excerpt",
  });

  assert.deepEqual(
    {
      name: error.name,
      message: error.message,
      code: error.code,
      sourceName: error.sourceName,
      lineNumber: error.lineNumber,
      columnName: error.columnName,
      safeValue: error.safeValue,
    },
    {
      name: "ContentError",
      message: "invalid CSV",
      code: "CSV_SYNTAX_INVALID",
      sourceName: "questions.csv",
      lineNumber: 4,
      columnName: "text",
      safeValue: "safe excerpt",
    },
  );
});
