import { assembleQaPreview } from "./qa-preview-artifact.mjs";

function cliError() {
  return Object.assign(
    new Error("QA_PREVIEW_INPUT_INVALID"),
    { code: "QA_PREVIEW_INPUT_INVALID" },
  );
}

function parseArguments(argv) {
  const allowed = new Set(["--app", "--output", "--allowed-parent"]);
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!allowed.has(key) ||
        Object.hasOwn(values, key) ||
        index + 1 >= argv.length ||
        argv[index + 1].startsWith("--")) {
      throw cliError();
    }
    values[key] = argv[++index];
  }
  if (!values["--app"] || !values["--output"] || !values["--allowed-parent"]) {
    throw cliError();
  }
  return values;
}

try {
  const args = parseArguments(process.argv.slice(2));
  const report = await assembleQaPreview({
    appDir: args["--app"],
    outputDir: args["--output"],
    allowedParentDir: args["--allowed-parent"],
  });
  process.stdout.write(
    `QA preview artifact: ${report.files.length} files, ${report.totalBytes} bytes\n`,
  );
} catch (error) {
  const code = typeof error?.code === "string"
    ? error.code
    : "QA_PREVIEW_ARTIFACT_INVALID";
  process.stderr.write(`[${code}] QA preview artifactを生成できませんでした。\n`);
  process.exitCode = 1;
}
