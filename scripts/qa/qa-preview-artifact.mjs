import {
  cp,
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

const REQUIRED_FILES = new Set([
  ".nojekyll",
  "assets/brand/kokoro-parea-icon-192.png",
  "assets/brand/kokoro-parea-icon-512.png",
  "assets/brand/kokoro-parea-mark.svg",
  "index.html",
  "manifest/app.webmanifest",
  "robots.txt",
]);
const ALLOWED_PATTERNS = [
  /^css\/.+\.css$/,
  /^js\/.+\.js$/,
  /^assets\/characters\/[^/]+\.webp$/,
];

function qaError(code) {
  return Object.assign(new Error(code), { code });
}

function normalizeRelative(filePath) {
  return filePath.split(path.sep).join("/");
}

function isAllowedArtifactPath(relativePath) {
  return REQUIRED_FILES.has(relativePath) ||
    ALLOWED_PATTERNS.some((pattern) => pattern.test(relativePath));
}

async function collectFiles(root, current = root) {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    const absolute = path.join(current, entry.name);
    const info = await lstat(absolute);
    if (info.isSymbolicLink()) throw qaError("QA_PREVIEW_ARTIFACT_INVALID");
    if (info.isDirectory()) files.push(...await collectFiles(root, absolute));
    else if (info.isFile()) files.push(normalizeRelative(path.relative(root, absolute)));
    else throw qaError("QA_PREVIEW_ARTIFACT_INVALID");
  }
  return files;
}

async function assertSafeOutput(outputDir, allowedParentDir) {
  const parent = await realpath(path.resolve(allowedParentDir))
    .catch(() => { throw qaError("QA_PREVIEW_OUTPUT_INVALID"); });
  const output = path.resolve(outputDir);
  const relative = path.relative(parent, output);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw qaError("QA_PREVIEW_OUTPUT_INVALID");
  }
  return { output, parent };
}

async function outputLstat(entryPath) {
  try {
    return await lstat(entryPath);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw qaError("QA_PREVIEW_OUTPUT_INVALID");
  }
}

async function assertSafeOutputTree(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
    .catch(() => { throw qaError("QA_PREVIEW_OUTPUT_INVALID"); });
  for (const entry of entries.sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    const entryPath = path.join(directory, entry.name);
    const info = await outputLstat(entryPath);
    if (!info || info.isSymbolicLink()) {
      throw qaError("QA_PREVIEW_OUTPUT_INVALID");
    }
    if (info.isDirectory()) await assertSafeOutputTree(entryPath);
    else if (!info.isFile()) throw qaError("QA_PREVIEW_OUTPUT_INVALID");
  }
}

async function prepareSafeOutputPath({ output, parent }) {
  const parts = path.relative(parent, output).split(path.sep);
  let current = parent;
  for (const part of parts.slice(0, -1)) {
    current = path.join(current, part);
    let info = await outputLstat(current);
    if (!info) {
      await mkdir(current)
        .catch(() => { throw qaError("QA_PREVIEW_OUTPUT_INVALID"); });
      info = await outputLstat(current);
    }
    if (!info?.isDirectory() || info.isSymbolicLink()) {
      throw qaError("QA_PREVIEW_OUTPUT_INVALID");
    }
  }

  const outputInfo = await outputLstat(output);
  if (!outputInfo) return;
  if (outputInfo.isSymbolicLink()) throw qaError("QA_PREVIEW_OUTPUT_INVALID");
  if (outputInfo.isDirectory()) await assertSafeOutputTree(output);
  else if (!outputInfo.isFile()) throw qaError("QA_PREVIEW_OUTPUT_INVALID");
}

function addNoIndex(html) {
  if (typeof html !== "string" || !html.includes("</head>")) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  if (/name=["']robots["']/i.test(html)) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  return html.replace(
    "</head>",
    '    <meta name="robots" content="noindex,nofollow">\n  </head>',
  );
}

async function copyTree({ source, destination, extension }) {
  const rootInfo = await lstat(source)
    .catch(() => { throw qaError("QA_PREVIEW_SOURCE_INVALID"); });
  if (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  const entries = await readdir(source, { withFileTypes: true })
    .catch(() => { throw qaError("QA_PREVIEW_SOURCE_INVALID"); });
  for (const entry of entries.sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    const info = await lstat(sourcePath);
    if (info.isSymbolicLink()) throw qaError("QA_PREVIEW_SOURCE_INVALID");
    if (info.isDirectory()) {
      await mkdir(destinationPath, { recursive: true });
      await copyTree({ source: sourcePath, destination: destinationPath, extension });
    } else if (info.isFile() && path.extname(entry.name) === extension) {
      await cp(sourcePath, destinationPath, { force: false });
    } else {
      throw qaError("QA_PREVIEW_SOURCE_INVALID");
    }
  }
}

async function copyRequiredFile({ source, destination }) {
  const info = await lstat(source)
    .catch(() => { throw qaError("QA_PREVIEW_SOURCE_INVALID"); });
  if (!info.isFile() || info.isSymbolicLink()) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, { force: false });
}

export async function auditQaPreviewArtifact(outputDir) {
  try {
    const root = path.resolve(outputDir);
    const rootInfo = await lstat(root);
    if (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()) {
      throw qaError("QA_PREVIEW_ARTIFACT_INVALID");
    }
    const files = await collectFiles(root);
    if (files.length === 0 ||
        files.some((file) => !isAllowedArtifactPath(file)) ||
        [...REQUIRED_FILES].some((file) => !files.includes(file)) ||
        !files.some((file) => file.startsWith("css/")) ||
        !files.some((file) => file.startsWith("js/")) ||
        !files.some((file) => file.startsWith("assets/characters/"))) {
      throw qaError("QA_PREVIEW_ARTIFACT_INVALID");
    }
    const html = await readFile(path.join(root, "index.html"), "utf8");
    const requiredRobotsMeta =
      '<meta name="robots" content="noindex,nofollow">';
    if (html.split(requiredRobotsMeta).length - 1 !== 1 ||
        (html.match(
          /<meta\b[^>]*\sname\s*=\s*(?:"robots"|'robots'|robots(?=\s|\/?>))[^>]*>/gi,
        ) ?? []).length !== 1 ||
        await readFile(path.join(root, "robots.txt"), "utf8") !==
          "User-agent: *\nDisallow: /\n") {
      throw qaError("QA_PREVIEW_ARTIFACT_INVALID");
    }
    let totalBytes = 0;
    for (const file of files) {
      totalBytes += (await stat(path.join(outputDir, ...file.split("/")))).size;
    }
    return Object.freeze({ files: Object.freeze(files), totalBytes });
  } catch (error) {
    if (error?.code === "QA_PREVIEW_ARTIFACT_INVALID") throw error;
    throw qaError("QA_PREVIEW_ARTIFACT_INVALID");
  }
}

export async function assembleQaPreview({ appDir, outputDir, allowedParentDir }) {
  if (![appDir, outputDir, allowedParentDir].every(
    (value) => typeof value === "string" && value.length > 0,
  )) {
    throw qaError("QA_PREVIEW_INPUT_INVALID");
  }
  const requestedApp = path.resolve(appDir);
  const appInfo = await lstat(requestedApp)
    .catch(() => { throw qaError("QA_PREVIEW_SOURCE_INVALID"); });
  if (!appInfo.isDirectory() || appInfo.isSymbolicLink()) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  const app = await realpath(requestedApp)
    .catch(() => { throw qaError("QA_PREVIEW_SOURCE_INVALID"); });
  const { output, parent } = await assertSafeOutput(outputDir, allowedParentDir);
  await prepareSafeOutputPath({ output, parent });
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: false });

  const indexInfo = await lstat(path.join(app, "index.html"))
    .catch(() => { throw qaError("QA_PREVIEW_SOURCE_INVALID"); });
  if (!indexInfo.isFile() || indexInfo.isSymbolicLink()) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  await writeFile(
    path.join(output, "index.html"),
    addNoIndex(await readFile(path.join(app, "index.html"), "utf8")),
    "utf8",
  );
  await mkdir(path.join(output, "css"));
  await copyTree({
    source: path.join(app, "css"),
    destination: path.join(output, "css"),
    extension: ".css",
  });
  await mkdir(path.join(output, "js"));
  await copyTree({
    source: path.join(app, "js"),
    destination: path.join(output, "js"),
    extension: ".js",
  });
  await mkdir(path.join(output, "assets", "characters"), { recursive: true });
  await copyTree({
    source: path.join(app, "assets", "characters"),
    destination: path.join(output, "assets", "characters"),
    extension: ".webp",
  });
  for (const relativePath of [
    "assets/brand/kokoro-parea-icon-192.png",
    "assets/brand/kokoro-parea-icon-512.png",
    "assets/brand/kokoro-parea-mark.svg",
    "manifest/app.webmanifest",
  ]) {
    await copyRequiredFile({
      source: path.join(app, ...relativePath.split("/")),
      destination: path.join(output, ...relativePath.split("/")),
    });
  }
  await writeFile(path.join(output, ".nojekyll"), "", "utf8");
  await writeFile(
    path.join(output, "robots.txt"),
    "User-agent: *\nDisallow: /\n",
    "utf8",
  );
  return auditQaPreviewArtifact(output);
}
