import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { isAppVersion } from "../app/js/domain/version-model.js";

const REQUIRED_FILES = [
  "app/index.html",
  "app/css/styles.css",
  "app/dev-server.mjs",
  "app/js/main.js",
  "app/js/config/app-meta.js",
  "app/js/domain/version-model.js",
  "app/js/infrastructure/router.js",
  "app/js/presentation/start-screen.js",
];

const ALLOWED_EVIDENCE_URLS = new Set([
  "https://ipip.ori.org/JapaneseBig-FiveFactorMarkers.htm",
  "https://www.ipip.ori.org/New_IPIP-50-item-scale.htm",
  "https://doi.org/10.1037/1040-3590.18.2.192",
  "https://ipip.ori.org/newPermission.htm",
]);
const PROHIBITED_ARTIFACT_EXTENSIONS = new Set([".csv", ".md", ".map"]);
const AUTHORING_METADATA_KEYS = new Set([
  "approval",
  "approval_date",
  "approval_note",
  "approval_notes",
  "approval_status",
  "approved_by",
  "approved_on",
  "approver",
  "review_note",
  "review_notes",
  "review_status",
  "reviewed_by",
  "reviewed_on",
  "reviewer",
  "note",
  "notes",
].map(normalizeArtifactKey));
const CREDENTIAL_KEY = /(?:token|secret|password|credential|api[_-]?key|access[_-]?key|private[_-]?key)/i;
const CREDENTIAL_VALUE = /(?:token|secret|password|credential|api[_-]?key|access[_-]?key|private[_-]?key)\s*[:=]\s*\S+/i;
const HTTP_URL = /https?:\/\/[^\s"'<>]+/gi;
const WINDOWS_ABSOLUTE_PATH = /(?:^|[^A-Za-z0-9_])[A-Za-z]:[\\/]/;
const POSIX_ABSOLUTE_PATH = /(?:^|[\s"'([{:;,=])\/(?![\/\s])/;

function normalizeArtifactKey(key) {
  return key.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
}

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

function assertArtifact(condition, message) {
  if (!condition) {
    throw new Error(`ARTIFACT_INSPECTION_FAILED: ${message}`);
  }
}

function decodeUtf8(filePath) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(readFileSync(filePath));
  } catch {
    throw new Error(`ARTIFACT_INSPECTION_FAILED: invalid UTF-8 in ${path.basename(filePath)}`);
  }
}

function assertArtifactStringIsSafe(value, relativePath) {
  assertArtifact(!WINDOWS_ABSOLUTE_PATH.test(value), `Windows local absolute path in ${relativePath}`);
  assertArtifact(!POSIX_ABSOLUTE_PATH.test(value), `POSIX local absolute path in ${relativePath}`);
  assertArtifact(!/file:\/\//i.test(value), `file URL in ${relativePath}`);
  assertArtifact(!CREDENTIAL_VALUE.test(value), `credential-like value in ${relativePath}`);

  for (const url of value.match(HTTP_URL) ?? []) {
    assertArtifact(ALLOWED_EVIDENCE_URLS.has(url), `external URL is not an approved evidence locator in ${relativePath}`);
  }
}

function inspectJsonValue(value, relativePath) {
  if (typeof value === "string") {
    assertArtifactStringIsSafe(value, relativePath);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) inspectJsonValue(item, relativePath);
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, nestedValue] of Object.entries(value)) {
    const normalizedKey = normalizeArtifactKey(key);
    assertArtifact(!AUTHORING_METADATA_KEYS.has(normalizedKey), `authoring metadata key ${key} in ${relativePath}`);
    assertArtifact(!CREDENTIAL_KEY.test(key), `credential-like key ${key} in ${relativePath}`);
    if (normalizedKey === "status") {
      assertArtifact(
        !["draft", "reviewed", "rejected"].includes(nestedValue),
        `authoring status ${nestedValue} in ${relativePath}`,
      );
    }
    inspectJsonValue(nestedValue, relativePath);
  }
}

function collectArtifactFiles(rootDir, relativeDirectory = "") {
  const directoryPath = path.join(rootDir, relativeDirectory);
  const directoryStatus = lstatSync(directoryPath);
  assertArtifact(!directoryStatus.isSymbolicLink(), `symlink at ${relativeDirectory || "."}`);
  const files = [];
  for (const entry of readdirSync(directoryPath, { withFileTypes: true })) {
    const relativePath = path.join(relativeDirectory, entry.name);
    const absolutePath = path.join(rootDir, relativePath);
    const status = lstatSync(absolutePath);
    assertArtifact(!status.isSymbolicLink(), `symlink at ${relativePath}`);
    if (status.isDirectory()) {
      files.push(...collectArtifactFiles(rootDir, relativePath));
    } else if (status.isFile()) {
      files.push({ absolutePath, relativePath });
    }
  }
  return files;
}

export function inspectArtifact(rootDir) {
  const files = collectArtifactFiles(rootDir);
  let checkedJsonFiles = 0;

  for (const { absolutePath, relativePath } of files) {
    const normalizedSegments = relativePath.split(/[\\/]+/).map((segment) => segment.toLowerCase());
    const extension = path.extname(relativePath).toLowerCase();
    assertArtifact(!PROHIBITED_ARTIFACT_EXTENSIONS.has(extension), `prohibited ${extension} file at ${relativePath}`);
    assertArtifact(
      !normalizedSegments.some((segment, index) => segment === "content" && normalizedSegments[index + 1] === "source"),
      `content/source path segment at ${relativePath}`,
    );

    const text = decodeUtf8(absolutePath);
    if (extension === ".json") {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error(`ARTIFACT_INSPECTION_FAILED: invalid JSON in ${relativePath}`);
      }
      inspectJsonValue(parsed, relativePath);
      checkedJsonFiles += 1;
    } else {
      assertArtifactStringIsSafe(text, relativePath);
    }
  }

  return { checkedFiles: files.length, checkedJsonFiles };
}

export function inspectCanonicalRuntimeVersion(sources) {
  const declarations = sources.flatMap((source) =>
    [...source.matchAll(/\bappVersion\s*:\s*["']([^"']+)["']/g)].map(
      (match) => match[1],
    ),
  );

  assertContract(
    declarations.length === 1,
    "the runtime app version must have exactly one canonical declaration",
  );
  assertContract(
    isAppVersion(declarations[0]),
    "the canonical runtime app version has an invalid format",
  );

  return declarations[0];
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
  const runtimeSources = [];
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
    runtimeSources.push(source);
    prototypeImports += source.match(/(?:from|import)\s*["'][^"']*prototype-big-five/g)?.length ?? 0;
  }

  const canonicalVersion = inspectCanonicalRuntimeVersion(runtimeSources);
  const runtimeVersionOccurrences = 1;

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
    prototypeImports === 0,
    "the formal app must not import from prototype-big-five",
  );

  const trackedContent = spawnSync("git", ["ls-files", "--", "app/content/"], {
    cwd: projectRoot,
    encoding: "utf8",
  });
  assertContract(
    trackedContent.status === 0 && trackedContent.stdout.trim() === "",
    "generated app/content artifacts must not be tracked",
  );

  return {
    checkedJavaScriptFiles: javaScriptFiles.length,
    prototypeImports,
    canonicalVersion,
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
