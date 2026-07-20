const START_ROUTE = Object.freeze({
  id: "start",
  canonicalHash: "#/start",
});

export function resolveRoute(hash) {
  const didFallback = hash !== START_ROUTE.canonicalHash;

  return Object.freeze({
    ...START_ROUTE,
    didFallback,
  });
}
