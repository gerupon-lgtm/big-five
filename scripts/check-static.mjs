import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_FILES = [
  "app/index.html",
  "app/styles.css",
  "app/dev-server.mjs",
  "app/js/main.js",
  "app/js/config/app-meta.js",
  "app/js/domain/version-model.js",
  "app/js/infrastructure/router.js",
  "app/js/presentation/start-screen.js",
];

function collectJavaScriptFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return entry.name === "tests" ? [] : collectJavaScriptFiles(absolutePath);
    }

    return /\.(?:js|mjs)$/.test(entry.name) ? [absolutePath] : [];
  });
}

function assertContract(condition, message) {
  if (!condition) {
    throw new Error(`STATIC_CHECK_FAILED: ${message}`);
  }
}

export function validateProject(projectRoot) {
  for (const relativePath of REQUIRED_FILES) {
    assertContract(
      existsSync(path.join(projectRoot, relativePath)),
      `required file is missing: ${relativePath}`,
    );
  }

  const appRoot = path.join(projectRoot, "app");
  const javaScriptFiles = collectJavaScriptFiles(appRoot);
  let runtimeVersionOccurrences = 0;
  let prototypeImports = 0;

  for (const filePath of javaScriptFiles) {
    const syntaxCheck = spawnSync(process.execPath, ["--check", filePath], {
      encoding: "utf8",
    });
    assertContract(
      syntaxCheck.status === 0,
      `JavaScript syntax check failed: ${path.relative(projectRoot, filePath)}\n${syntaxCheck.stderr}`,
    );

    const source = readFileSync(filePath, "utf8");
    runtimeVersionOccurrences += source.match(/mvp-\d+\.\d+\.\d+/g)?.length ?? 0;
    prototypeImports += source.match(/(?:from|import)\s*["'][^"']*prototype-big-five/g)?.length ?? 0;
  }

  const html = readFileSync(path.join(appRoot, "index.html"), "utf8");
  assertContract(
    html.includes('src="./js/main.js"') && html.includes('type="module"'),
    "index.html must load the formal app as an ES module",
  );
  assertContract(
    html.includes("connect-src 'none'"),
    "the normal static build must not make external connections",
  );
  assertContract(
    !/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/i.test(html),
    "inline scripts are not allowed",
  );
  assertContract(
    runtimeVersionOccurrences === 1,
    "the runtime MVP version must have exactly one canonical declaration",
  );
  assertContract(
    prototypeImports === 0,
    "the formal app must not import from prototype-big-five",
  );

  return {
    checkedJavaScriptFiles: javaScriptFiles.length,
    prototypeImports,
    runtimeVersionOccurrences,
  };
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";

if (currentFile === invokedFile) {
  try {
    const projectRoot = path.resolve(path.dirname(currentFile), "..");
    const result = validateProject(projectRoot);
    console.log(
      `Static check passed (${result.checkedJavaScriptFiles} JavaScript files, one canonical runtime version).`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
