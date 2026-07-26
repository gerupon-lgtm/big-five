import { writeFile } from "node:fs/promises";
import path from "node:path";

import { validateAuthoringTree } from "./content-compiler.mjs";
import { ContentError } from "./content-error.mjs";

const SAFE_MESSAGES = Object.freeze({
  CONTENT_CLI_ARGUMENT_INVALID: "引数を確認してください。",
  CONTENT_VALIDATION_FAILED: "コンテンツ定義を確認してください。",
  CONTENT_REPORT_WRITE_FAILED: "検証レポートを書き込めませんでした。",
  CSV_COLUMNS_INVALID: "CSVの列名または列順がスキーマと一致しません。",
  CSV_REQUIRED_VALUE_MISSING: "CSVの必須項目が空欄です。",
  CSV_INTEGER_INVALID: "CSVの整数値が不正です。",
  CSV_VALUE_INVALID: "CSVの値がスキーマと一致しません。",
  CSV_SYNTAX_INVALID: "CSVの構文が不正です。",
  CSV_ENCODING_INVALID: "CSVの文字コードを判定できません。",
  CSV_REPLACEMENT_CHARACTER: "CSVに不正な文字が含まれています。",
  CSV_SCHEMA_INVALID: "CSVスキーマが不正です。",
  RELEASE_RESOURCE_MISSING: "必要なコンテンツファイルがありません。",
  RELEASE_VERSION_REFERENCE_INVALID: "コンテンツの版参照が不正です。",
  RELEASE_HISTORY_MISMATCH: "公開履歴がリリース定義と一致しません。",
  RELEASE_MULTIPLE_SELECTED: "リリース定義は0行または1行にしてください。",
  RELEASE_NOT_SELECTED: "公開するリリースが選択されていません。",
  RELEASE_CONTENT_NOT_APPROVED: "公開対象に未承認のコンテンツがあります。",
  CONTENT_APPROVAL_PENDING: "承認ゲートを確認してください。",
  CONTENT_NOT_APPROVED: "未承認のコンテンツがあります。",
  PRESENTATION_CATALOG_PENDING: "演出カタログは準備中です。",
  CHARACTER_CATALOG_PENDING: "キャラクターカタログは準備中です。",
  RESULT_CONTENT_INVALID: "結果コンテンツの定義が不正です。",
  PRESENTATION_CONTENT_INVALID: "演出コンテンツの定義が不正です。",
  CHARACTER_CONTENT_INVALID: "キャラクターコンテンツの定義が不正です。",
  CHARACTER_APPROVAL_PENDING: "キャラクター承認が完了していません。",
});

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!new Set(["--source", "--report"]).has(key) || Object.hasOwn(values, key) || index + 1 >= argv.length || argv[index + 1].startsWith("--")) {
      throw new ContentError({ code: "CONTENT_CLI_ARGUMENT_INVALID", message: "引数を確認してください。" });
    }
    values[key] = argv[++index];
  }
  if (!values["--source"]) throw new ContentError({ code: "CONTENT_CLI_ARGUMENT_INVALID", message: "--source を指定してください。" });
  return values;
}

function safeEntry(error) {
  const requestedCode = typeof error.code === "string" ? error.code : "CONTENT_VALIDATION_FAILED";
  const code = Object.hasOwn(SAFE_MESSAGES, requestedCode) ? requestedCode : "CONTENT_VALIDATION_FAILED";
  const baseName = typeof error.sourceName === "string" ? path.basename(error.sourceName) : "";
  return {
    file: /^[A-Za-z0-9._-]+$/.test(baseName) ? baseName : "不明",
    line: Number.isSafeInteger(error.lineNumber) ? error.lineNumber : "-",
    column: typeof error.columnName === "string" && /^[A-Za-z0-9_]+$/.test(error.columnName) ? error.columnName : "-",
    code,
    message: SAFE_MESSAGES[code],
  };
}

function markdown({ warnings = [], errors = [] }) {
  const lines = ["# コンテンツ検証レポート", "", `- 警告: ${warnings.length}`, `- エラー: ${errors.length}`, "", "| 種別 | ファイル | 行 | 列 | コード | メッセージ |", "| --- | --- | ---: | --- | --- | --- |"];
  for (const [kind, items] of [["警告", warnings], ["エラー", errors]]) {
    for (const item of items) {
      const entry = safeEntry(item);
      lines.push(`| ${kind} | ${entry.file} | ${entry.line} | ${entry.column} | ${entry.code} | ${entry.message.replaceAll("|", "\\|")} |`);
    }
  }
  return `${lines.join("\n")}\n`;
}

let report;
let args;
let failed = false;
try {
  args = parseArguments(process.argv.slice(2));
  const result = await validateAuthoringTree({ sourceDir: args["--source"] });
  report = markdown({ warnings: result.warnings });
} catch (error) {
  report = markdown({ errors: [error] });
  failed = true;
}
if (args?.["--report"]) {
  try {
    await writeFile(args["--report"], report, "utf8");
  } catch {
    report = markdown({ errors: [new ContentError({
      code: "CONTENT_REPORT_WRITE_FAILED",
      message: SAFE_MESSAGES.CONTENT_REPORT_WRITE_FAILED,
    })] });
    failed = true;
  }
}
if (failed) process.exitCode = 1;
process.stdout.write(report);
