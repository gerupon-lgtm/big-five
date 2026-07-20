import { appMeta } from "./config/app-meta.js";
import { createStartVersionViewModel } from "./domain/version-model.js";
import { resolveRoute } from "./infrastructure/router.js";
import { renderStartScreen } from "./presentation/start-screen.js";

export function startApp({
  documentObject = document,
  historyObject = history,
  windowObject = window,
} = {}) {
  const screenHost = documentObject.getElementById("app");

  if (!screenHost) {
    throw new Error("APP_SCREEN_HOST_MISSING");
  }

  function renderCurrentRoute() {
    const route = resolveRoute(windowObject.location.hash);

    if (route.didFallback) {
      historyObject.replaceState(null, "", route.canonicalHash);
    }

    renderStartScreen(screenHost, createStartVersionViewModel(appMeta));
  }

  windowObject.addEventListener("hashchange", renderCurrentRoute);
  renderCurrentRoute();
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
  startApp();
}
