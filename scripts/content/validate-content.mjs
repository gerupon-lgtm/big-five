import { writeFile } from "node:fs/promises";
import path from "node:path";

import { validateAuthoringTree } from "./content-compiler.mjs";
import { ContentError } from "./content-error.mjs";

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
  return {
    file: typeof error.sourceName === "string" ? path.basename(error.sourceName) : "不明",
    line: Number.isSafeInteger(error.lineNumber) ? error.lineNumber : "-",
    column: typeof error.columnName === "string" ? error.columnName : "-",
    code: typeof error.code === "string" ? error.code : "CONTENT_VALIDATION_FAILED",
    message: typeof error.message === "string" ? error.message : "コンテンツ定義を確認してください。",
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
try {
  const args = parseArguments(process.argv.slice(2));
  const result = await validateAuthoringTree({ sourceDir: args["--source"] });
  report = markdown({ warnings: result.warnings });
  if (args["--report"]) await writeFile(args["--report"], report, "utf8");
} catch (error) {
  report = markdown({ errors: [error] });
  process.exitCode = 1;
}
process.stdout.write(report);
