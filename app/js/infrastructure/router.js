const START_ROUTE = Object.freeze({
  id: "start",
  canonicalHash: "#/start",
});

export function resolveRoute(hash) {
  if (hash === "#/answer") {
    return Object.freeze({
      id: "answer",
      canonicalHash: hash,
      didFallback: false,
    });
  }
  if (hash === "#/history") {
    return Object.freeze({
      id: "history",
      canonicalHash: hash,
      didFallback: false,
    });
  }

  const [path, query = ""] = typeof hash === "string" ? hash.split("?", 2) : [];
  if (path === "#/result") {
    const params = new URLSearchParams(query);
    return Object.freeze({
      id: "result",
      canonicalHash: hash,
      didFallback: false,
      resultId: params.get("resultId"),
    });
  }
  if (path === "#/share") {
    const params = new URLSearchParams(query);
    return Object.freeze({
      id: "share",
      canonicalHash: hash,
      didFallback: false,
      resultId: params.get("resultId"),
    });
  }
  if (path === "#/compare") {
    const params = new URLSearchParams(query);
    return Object.freeze({
      id: "compare",
      canonicalHash: hash,
      didFallback: false,
      beforeResultId: params.get("before"),
      afterResultId: params.get("after"),
    });
  }

  return Object.freeze({
    ...START_ROUTE,
    didFallback: hash !== START_ROUTE.canonicalHash,
  });
}
