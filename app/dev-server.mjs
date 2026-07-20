import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
]);

export function isPathWithinRoot(rootDir, candidatePath, pathApi = path) {
  const relativeToRoot = pathApi.relative(rootDir, candidatePath);

  return (
    relativeToRoot !== ".." &&
    !relativeToRoot.startsWith(`..${pathApi.sep}`) &&
    !pathApi.isAbsolute(relativeToRoot)
  );
}

export function resolveRequestPath(rootDir, requestUrl) {
  const url = new URL(requestUrl, "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
  const absoluteRoot = path.resolve(rootDir);
  const absolutePath = path.resolve(absoluteRoot, relativePath);
  if (!isPathWithinRoot(absoluteRoot, absolutePath)) {
    return null;
  }

  return absolutePath;
}

export function createStaticServer({ rootDir }) {
  const absoluteRoot = path.resolve(rootDir);

  return createServer(async (request, response) => {
    if (!request.url || !["GET", "HEAD"].includes(request.method ?? "")) {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end();
      return;
    }

    let filePath;
    try {
      filePath = resolveRequestPath(absoluteRoot, request.url);
    } catch {
      filePath = null;
    }

    if (!filePath) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    try {
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        throw new Error("NOT_A_FILE");
      }

      response.writeHead(200, {
        "Content-Type":
          MIME_TYPES.get(path.extname(filePath)) ??
          "application/octet-stream",
        "Content-Length": fileStat.size,
        "Cache-Control": "no-store",
      });

      if (request.method === "HEAD") {
        response.end();
        return;
      }

      createReadStream(filePath).pipe(response);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  const rootDir = path.dirname(fileURLToPath(import.meta.url));
  const port = Number.parseInt(process.env.PORT ?? "4174", 10);
  const server = createStaticServer({ rootDir });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${port} is already in use. Set another port with $env:PORT.`,
      );
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  });

  server.listen(port, () => {
    console.log(`Formal app: http://localhost:${port}/#/start`);
  });
}
