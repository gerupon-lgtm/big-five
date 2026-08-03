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

import { isAppVersion } from "../../app/js/domain/version-model.js";

const REQUIRED_FILES = new Set([
  ".nojekyll",
  "assets/brand/kokoro-parea-icon-192.png",
  "assets/brand/kokoro-parea-icon-512.png",
  "assets/brand/kokoro-parea-mark.svg",
  "assets/share-card/aroma-pause-v1.png",
  "assets/share-card/aroma-quiet-focus-v1.png",
  "assets/share-card/aroma-reset-v1.png",
  "assets/share-card/kokoro-wreath-v1.png",
  "index.html",
  "manifest/app.webmanifest",
  "robots.txt",
]);
const ALLOWED_PATTERNS = [
  /^css\/.+\.css$/,
  /^js\/.+\.js$/,
  /^assets\/characters\/[^/]+\.webp$/,
  /^assets\/share-card\/[^/]+\.png$/,
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

async function copyTree({ source, destination, extension, transform = null }) {
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
      await copyTree({
        source: sourcePath,
        destination: destinationPath,
        extension,
        transform,
      });
    } else if (info.isFile() && path.extname(entry.name) === extension) {
      if (transform) {
        await writeFile(
          destinationPath,
          transform(await readFile(sourcePath, "utf8")),
          "utf8",
        );
      } else {
        await cp(sourcePath, destinationPath, { force: false });
      }
    } else {
      throw qaError("QA_PREVIEW_SOURCE_INVALID");
    }
  }
}

function extractAppVersion(source) {
  const matches = [...source.matchAll(/\bappVersion\s*:\s*["']([^"']+)["']/g)];
  if (matches.length !== 1 || !isAppVersion(matches[0][1])) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  return matches[0][1];
}

function appendCacheVersion(reference, appVersion) {
  if (reference.includes("?")) throw qaError("QA_PREVIEW_SOURCE_INVALID");
  return `${reference}?v=${encodeURIComponent(appVersion)}`;
}

function versionHtmlReferences(html, appVersion) {
  return html.replace(
    /((?:href|src)=["'])(\.\/(?:assets|css|js|manifest)\/[^"'?]+\.(?:css|js|png|svg|webp|webmanifest))(["'])/g,
    (_match, before, reference, after) =>
      `${before}${appendCacheVersion(reference, appVersion)}${after}`,
  );
}

function versionJavaScriptReferences(source, appVersion) {
  return source
    .replace(
      /(["'])(\.\.?\/[^"'?\r\n]+\.js)(["'])/g,
      (_match, before, reference, after) =>
        `${before}${appendCacheVersion(reference, appVersion)}${after}`,
    )
    .replace(
      /(["'])(\.\/assets\/[^"'?\r\n]+\.(?:png|svg|webp))(["'])/g,
      (_match, before, reference, after) =>
        `${before}${appendCacheVersion(reference, appVersion)}${after}`,
    );
}

function versionCssReferences(source, appVersion) {
  return source.replace(
    /(url\(\s*["']?)(\.\.?\/[^"')?]+\.(?:png|svg|webp|woff2?))(["']?\s*\))/g,
    (_match, before, reference, after) =>
      `${before}${appendCacheVersion(reference, appVersion)}${after}`,
  );
}

function versionManifestReferences(source, appVersion) {
  let manifest;
  try {
    manifest = JSON.parse(source);
  } catch {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
    throw qaError("QA_PREVIEW_SOURCE_INVALID");
  }
  manifest.icons = manifest.icons.map((icon) => {
    if (!icon || typeof icon.src !== "string") {
      throw qaError("QA_PREVIEW_SOURCE_INVALID");
    }
    return { ...icon, src: appendCacheVersion(icon.src, appVersion) };
  });
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function assertCanonicalCacheReferences(content, pattern, appVersion) {
  const references = [...content.matchAll(pattern)].map((match) => match[1]);
  const suffix = `?v=${encodeURIComponent(appVersion)}`;
  if (references.length === 0 || references.some((reference) => !reference.endsWith(suffix))) {
    throw qaError("QA_PREVIEW_ARTIFACT_INVALID");
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
    const appVersion = extractAppVersion(await readFile(
      path.join(root, "js", "config", "app-meta.js"),
      "utf8",
    ));
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
    assertCanonicalCacheReferences(
      html,
      /(?:href|src)=["'](\.\/(?:assets|css|js|manifest)\/[^"']+\.(?:css|js|png|svg|webp|webmanifest)(?:\?v=[^"']+)?)['"]/g,
      appVersion,
    );
    const expectedCacheSuffix = `?v=${encodeURIComponent(appVersion)}`;
    for (const file of files.filter(
      (file) => file.startsWith("js/") && file.endsWith(".js"),
    )) {
      const source = await readFile(path.join(root, ...file.split("/")), "utf8");
      const references = [
        ...[...source.matchAll(
          /["'](\.\.?\/[^"']+\.js(?:\?v=[^"']+)?)['"]/g,
        )].map((match) => match[1]),
        ...[...source.matchAll(
          /["'](\.\/assets\/[^"']+\.(?:png|svg|webp)(?:\?v=[^"']+)?)['"]/g,
        )].map((match) => match[1]),
      ];
      if (references.some((reference) => !reference.endsWith(expectedCacheSuffix))) {
        throw qaError("QA_PREVIEW_ARTIFACT_INVALID");
      }
    }
    const manifest = JSON.parse(await readFile(
      path.join(root, "manifest", "app.webmanifest"),
      "utf8",
    ));
    if (!Array.isArray(manifest.icons) || manifest.icons.length === 0 ||
        manifest.icons.some((icon) =>
          typeof icon?.src !== "string" ||
          !icon.src.endsWith(expectedCacheSuffix))) {
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
  const appVersion = extractAppVersion(await readFile(
    path.join(app, "js", "config", "app-meta.js"),
    "utf8",
  ).catch(() => { throw qaError("QA_PREVIEW_SOURCE_INVALID"); }));
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
    versionHtmlReferences(
      addNoIndex(await readFile(path.join(app, "index.html"), "utf8")),
      appVersion,
    ),
    "utf8",
  );
  await mkdir(path.join(output, "css"));
  await copyTree({
    source: path.join(app, "css"),
    destination: path.join(output, "css"),
    extension: ".css",
    transform: (source) => versionCssReferences(source, appVersion),
  });
  await mkdir(path.join(output, "js"));
  await copyTree({
    source: path.join(app, "js"),
    destination: path.join(output, "js"),
    extension: ".js",
    transform: (source) => versionJavaScriptReferences(source, appVersion),
  });
  await mkdir(path.join(output, "assets", "characters"), { recursive: true });
  await copyTree({
    source: path.join(app, "assets", "characters"),
    destination: path.join(output, "assets", "characters"),
    extension: ".webp",
  });
  await mkdir(path.join(output, "assets", "share-card"), { recursive: true });
  await copyTree({
    source: path.join(app, "assets", "share-card"),
    destination: path.join(output, "assets", "share-card"),
    extension: ".png",
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
  await writeFile(
    path.join(output, "manifest", "app.webmanifest"),
    versionManifestReferences(
      await readFile(path.join(app, "manifest", "app.webmanifest"), "utf8"),
      appVersion,
    ),
    "utf8",
  );
  await writeFile(path.join(output, ".nojekyll"), "", "utf8");
  await writeFile(
    path.join(output, "robots.txt"),
    "User-agent: *\nDisallow: /\n",
    "utf8",
  );
  return auditQaPreviewArtifact(output);
}
