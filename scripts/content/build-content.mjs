import { ContentError } from "./content-error.mjs";
import { compileRelease, writeReleaseAtomically } from "./content-compiler.mjs";

function parseArguments(argv) {
  const values = {};
  const valid = new Set(["--source", "--release", "--output", "--allowed-parent"]);
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!valid.has(key) || Object.hasOwn(values, key) || index + 1 >= argv.length || argv[index + 1].startsWith("--")) {
      throw new ContentError({ code: "CONTENT_CLI_ARGUMENT_INVALID", message: "引数を確認してください。" });
    }
    values[key] = argv[++index];
  }
  if (!values["--source"] || !values["--output"] || !values["--allowed-parent"]) {
    throw new ContentError({ code: "CONTENT_CLI_ARGUMENT_INVALID", message: "--source、--output、--allowed-parent を指定してください。" });
  }
  return values;
}

try {
  const args = parseArguments(process.argv.slice(2));
  const compiled = await compileRelease({ sourceDir: args["--source"], releaseId: args["--release"] });
  await writeReleaseAtomically({ outputDir: args["--output"], allowedParentDir: args["--allowed-parent"], compiled });
  process.stdout.write("コンテンツリリースを生成しました。\n");
} catch (error) {
  const code = error instanceof ContentError && typeof error.code === "string" ? error.code : "CONTENT_BUILD_FAILED";
  process.stderr.write(`[${code}] コンテンツリリースを生成できませんでした。\n`);
  process.exitCode = 1;
}
