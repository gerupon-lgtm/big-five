import { appMeta } from "./config/app-meta.js";
import { createStartVersionViewModel } from "./domain/version-model.js";
import { resolveRoute } from "./infrastructure/router.js";
import { renderStartScreen } from "./presentation/start-screen.js";

const screenHost = document.querySelector("#app");

if (!screenHost) {
  throw new Error("APP_SCREEN_HOST_MISSING");
}

function renderCurrentRoute() {
  const route = resolveRoute(window.location.hash);

  if (route.didFallback) {
    window.history.replaceState(null, "", route.canonicalHash);
  }

  renderStartScreen(screenHost, createStartVersionViewModel(appMeta));
}

window.addEventListener("hashchange", renderCurrentRoute);
renderCurrentRoute();
