import { appMeta } from "./config/app-meta.js";
import { FactorDefinitions } from "./data/diagnostic-definition.js";
import { TitleProfileDefinitions } from "./data/title-profile-definitions.js";
import { compareResultSnapshots } from "./domain/result-comparison.js";
import { createStartVersionViewModel } from "./domain/version-model.js";
import {
  deleteAllData,
  deleteResultSnapshot,
  loadResultHistory,
} from "./infrastructure/progress-storage.js";
import { resolveRoute } from "./infrastructure/router.js";
import { renderComparisonScreen } from "./presentation/comparison-screen.js";
import { renderHistoryScreen } from "./presentation/history-screen.js";
import { renderSavedResultScreen } from "./presentation/result-screen.js";
import { renderStartScreen } from "./presentation/start-screen.js";

const factorLabels = Object.freeze(Object.fromEntries(
  FactorDefinitions.map(({ id, displayName }) => [id, displayName]),
));
const factorDescriptions = Object.freeze(Object.fromEntries(
  FactorDefinitions.map(({ id, description }) => [id, description]),
));
const titleLabels = Object.freeze(Object.fromEntries(
  TitleProfileDefinitions.map(({ titleId, label }) => [titleId, label]),
));

export function startApp({
  documentObject = document,
  historyObject = history,
  windowObject = window,
  storage,
  nowProvider = () => new Date().toISOString(),
  confirmProvider,
} = {}) {
  const screenHost = documentObject.getElementById("app");
  let historyNotice = null;

  if (!screenHost) {
    throw new Error("APP_SCREEN_HOST_MISSING");
  }

  function getStorage() {
    if (storage !== undefined) return storage;
    try {
      return windowObject.localStorage;
    } catch {
      return null;
    }
  }

  function requestConfirmation(message) {
    return confirmProvider
      ? confirmProvider(message) === true
      : windowObject.confirm?.(message) === true;
  }

  function renderHistoryRoute() {
    const effectiveStorage = getStorage();
    const operationNotice = historyNotice;
    historyNotice = null;
    renderHistoryScreen(screenHost, {
      ...loadResultHistory({
        storage: effectiveStorage,
        now: nowProvider(),
      }),
      factorLabels,
      titleLabels,
    }, {
      operationNotice,
      onDeleteResult(resultId) {
        if (!requestConfirmation("この診断結果1件を削除します。削除後は復元できません。")) return;
        const outcome = deleteResultSnapshot({
          storage: effectiveStorage,
          resultId,
          confirmed: true,
          now: nowProvider(),
        });
        historyNotice = outcome.status === "ok" && outcome.deleted
          ? { kind: "success", text: "診断結果を1件削除しました。" }
          : { kind: "error", text: "診断結果を削除できませんでした。もう一度お試しください。" };
        renderCurrentRoute();
      },
      onDeleteAll() {
        if (!requestConfirmation("途中回答と診断結果をすべて削除します。削除後は復元できません。")) return;
        const outcome = deleteAllData({
          storage: effectiveStorage,
          confirmed: true,
          now: nowProvider(),
        });
        historyNotice = outcome.status === "ok"
          ? { kind: "success", text: "端末内の途中回答と診断結果をすべて削除しました。" }
          : { kind: "error", text: "端末内データを削除できませんでした。もう一度お試しください。" };
        renderCurrentRoute();
      },
      onCompare(comparison) {
        windowObject.location.hash = `#/compare?before=${encodeURIComponent(comparison.beforeResultId)}&after=${encodeURIComponent(comparison.afterResultId)}`;
        renderCurrentRoute();
      },
      onOpenResult(resultId) {
        windowObject.location.hash = `#/result?resultId=${encodeURIComponent(resultId)}`;
        renderCurrentRoute();
      },
    });
  }

  function returnMissingResultToHistory() {
    historyNotice = {
      kind: "error",
      text: "指定された診断結果を開けませんでした。履歴からもう一度選んでください。",
    };
    historyObject.replaceState(null, "", "#/history");
    windowObject.location.hash = "#/history";
    renderCurrentRoute();
  }

  function renderResultRoute(route) {
    if (!route.resultId) {
      returnMissingResultToHistory();
      return;
    }
    const historyState = loadResultHistory({
      storage: getStorage(),
      now: nowProvider(),
    });
    if (historyState.status === "error") {
      returnMissingResultToHistory();
      return;
    }
    const snapshot = historyState.results.find(({ resultId }) =>
      resultId === route.resultId);
    if (!snapshot) {
      returnMissingResultToHistory();
      return;
    }
    renderSavedResultScreen(screenHost, snapshot, {
      factorLabels,
      factorDescriptions,
      titleLabels,
    }, {
      onRetry() {
        windowObject.location.hash = "#/start";
        renderCurrentRoute();
      },
    });
  }

  function renderComparisonRoute(route) {
    if (!route.beforeResultId || !route.afterResultId) {
      historyObject.replaceState(null, "", "#/history");
      windowObject.location.hash = "#/history";
      renderCurrentRoute();
      return;
    }
    const historyState = loadResultHistory({
      storage: getStorage(),
      now: nowProvider(),
    });
    if (historyState.status === "error") {
      renderComparisonScreen(screenHost, { status: "result-unavailable" });
      return;
    }
    const first = historyState.results.find(({ resultId }) =>
      resultId === route.beforeResultId);
    const second = historyState.results.find(({ resultId }) =>
      resultId === route.afterResultId);
    if (!first || !second) {
      renderComparisonScreen(screenHost, { status: "result-unavailable" });
      return;
    }
    const comparison = compareResultSnapshots(first, second);
    if (!comparison.compatible) {
      renderComparisonScreen(screenHost, {
        status: "incompatible",
        code: comparison.code,
      });
      return;
    }
    const before = comparison.beforeResultId === first.resultId ? first : second;
    const after = comparison.afterResultId === second.resultId ? second : first;
    renderComparisonScreen(screenHost, {
      status: "ok",
      before,
      after,
      comparison,
      factorLabels,
    });
  }

  function renderCurrentRoute() {
    const route = resolveRoute(windowObject.location.hash);

    if (route.didFallback) {
      historyObject.replaceState(null, "", route.canonicalHash);
    }

    if (route.id === "history") {
      renderHistoryRoute();
      return;
    }
    if (route.id === "compare") {
      renderComparisonRoute(route);
      return;
    }
    if (route.id === "result") {
      renderResultRoute(route);
      return;
    }

    renderStartScreen(screenHost, createStartVersionViewModel(appMeta));
  }

  windowObject.addEventListener("hashchange", renderCurrentRoute);
  renderCurrentRoute();
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
  startApp();
}
