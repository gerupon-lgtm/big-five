import { appMeta } from "./config/app-meta.js";
import { CharacterManifest } from "./data/character-manifest.js";
import { DiagnosticDefinition, FactorDefinitions, QuestionDefinitions } from "./data/diagnostic-definition.js";
import { ResultTextDefinitions } from "./data/result-text-definitions.js";
import { TitleProfileDefinitions } from "./data/title-profile-definitions.js";
import {
  resolveCharacterEntry,
  validateCharacterManifest,
} from "./domain/character-manifest.js";
import { compareResultSnapshots } from "./domain/result-comparison.js";
import { createStartVersionViewModel } from "./domain/version-model.js";
import {
  choosePreviewExit,
  continueAfterPreview,
  createProgressRecord,
  goBack,
} from "./domain/response-state.js";
import { createDiagnosticResultSnapshot } from "./domain/diagnostic-result.js";
import {
  answerAndSave,
  discardProgress,
  deleteAllData,
  deleteResultSnapshot,
  loadProgress,
  loadResultHistory,
  saveProgress,
  saveResultSnapshot,
  transitionAndSave,
} from "./infrastructure/progress-storage.js";
import { loadCharacterImage } from "./infrastructure/character-loader.js";
import { resolveRoute } from "./infrastructure/router.js";
import { renderComparisonScreen } from "./presentation/comparison-screen.js";
import { renderHistoryScreen } from "./presentation/history-screen.js";
import { renderSavedResultScreen } from "./presentation/result-screen.js";
import { renderStartScreen } from "./presentation/start-screen.js";
import { renderQuestionnaireScreen } from "./presentation/questionnaire-screen.js";

const factorLabels = Object.freeze(Object.fromEntries(
  FactorDefinitions.map(({ id, displayName }) => [id, displayName]),
));
const factorDescriptions = Object.freeze(Object.fromEntries(
  FactorDefinitions.map(({ id, description }) => [id, description]),
));
const titleLabels = Object.freeze(Object.fromEntries(
  TitleProfileDefinitions.map(({ titleId, label }) => [titleId, label]),
));
const validatedCharacterManifest = validateCharacterManifest(
  CharacterManifest,
  TitleProfileDefinitions,
  appMeta.characterManifestVersion,
);

function createBrowserImageDecoder(windowObject) {
  return (path) => new Promise((resolve, reject) => {
    if (typeof windowObject.Image !== "function") {
      reject(new Error("CHARACTER_IMAGE_UNAVAILABLE"));
      return;
    }
    const image = new windowObject.Image();
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener(
      "error",
      () => reject(new Error("CHARACTER_IMAGE_UNAVAILABLE")),
      { once: true },
    );
    image.src = path;
  });
}

function createViewportObserver(windowObject) {
  return (target, onEnter) => {
    if (typeof windowObject.IntersectionObserver !== "function") {
      void onEnter();
      return;
    }
    let entered = false;
    const observer = new windowObject.IntersectionObserver((entries) => {
      if (
        entered ||
        !entries.some((entry) =>
          entry.target === target && entry.isIntersecting)
      ) {
        return;
      }
      entered = true;
      observer.disconnect();
      void onEnter();
    });
    observer.observe(target);
  };
}

export function startApp({
  documentObject = document,
  historyObject = history,
  windowObject = window,
  storage,
  nowProvider = () => new Date().toISOString(),
  uuidProvider = () => globalThis.crypto.randomUUID(),
  confirmProvider,
  decodeImage,
  observeViewport,
} = {}) {
  const screenHost = documentObject.getElementById("app");
  let historyNotice = null;
  let currentProgress = null;
  let questionnaireStorageStatus = "ok";
  let liveResult = null;
  let pendingInternalHashChange = null;
  const effectiveDecodeImage = decodeImage ??
    createBrowserImageDecoder(windowObject);
  const effectiveObserveViewport = observeViewport ??
    createViewportObserver(windowObject);

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

  function setRoute(hash) {
    pendingInternalHashChange = hash;
    historyObject.pushState?.(null, "", hash);
    windowObject.location.hash = hash;
    renderCurrentRoute();
  }

  function replaceRoute(hash) {
    pendingInternalHashChange = hash;
    historyObject.replaceState(null, "", hash);
    windowObject.location.hash = hash;
    renderCurrentRoute();
  }

  function isShownPreviewProgressForSnapshot(progress, snapshot) {
    return progress && snapshot.mode === "preview20" &&
      progress.mode === "preview20" &&
      progress.previewDecision === "showPreview" &&
      Object.keys(progress.answers).length === 20 &&
      Object.keys(snapshot.versionTuple).length === Object.keys(progress.versionTuple).length &&
      Object.keys(snapshot.versionTuple).every((key) => snapshot.versionTuple[key] === progress.versionTuple[key]);
  }

  function loadPreviewContinuation(snapshot) {
    if (snapshot.mode !== "preview20") return null;
    const loaded = loadProgress({
      storage: getStorage(), definition: DiagnosticDefinition, meta: appMeta, now: nowProvider(),
    });
    return loaded.status === "ok" && isShownPreviewProgressForSnapshot(loaded.progress, snapshot)
      ? loaded.progress
      : null;
  }

  function persistProgress(progress) {
    const outcome = saveProgress({
      storage: getStorage(),
      progress,
      definition: DiagnosticDefinition,
      meta: appMeta,
      now: nowProvider(),
    });
    currentProgress = outcome.progress ?? progress;
    questionnaireStorageStatus = outcome.status === "ok" ? "ok" : "error";
    return outcome;
  }

  function createSnapshot({ answers, questionCount, mode }) {
    if (!currentProgress) throw new Error("APP_PROGRESS_MISSING");
    return createDiagnosticResultSnapshot({
      answers,
      questionCount,
      mode,
      resultId: uuidProvider(),
      completedAt: nowProvider(),
      versionTuple: currentProgress.versionTuple,
      questionDefinitions: QuestionDefinitions,
      titleProfiles: TitleProfileDefinitions,
      resultTextDefinitions: ResultTextDefinitions,
      resultTextVersion: appMeta.diagnosticVersions.resultTextVersion,
      characterManifest: CharacterManifest,
      cardTemplateVersion: appMeta.cardTemplateVersion,
    });
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
        setRoute(`#/compare?before=${encodeURIComponent(comparison.beforeResultId)}&after=${encodeURIComponent(comparison.afterResultId)}`);
      },
      onOpenResult(resultId) {
        setRoute(`#/result?resultId=${encodeURIComponent(resultId)}`);
      },
    });
  }

  function returnMissingResultToHistory() {
    historyNotice = {
      kind: "error",
      text: "指定された診断結果を開けませんでした。履歴からもう一度選んでください。",
    };
    replaceRoute("#/history");
  }

  function renderQuestionnaireRoute() {
    if (!currentProgress) {
      setRoute("#/start");
      return;
    }
    const isPreviewChoice = currentProgress.mode === "preview20" &&
      currentProgress.previewDecision === "undecided" &&
      Object.keys(currentProgress.answers).length === 20;
    if (isPreviewChoice) {
      renderQuestionnaireScreen(screenHost, {
        phase: "preview-choice",
        storageStatus: questionnaireStorageStatus,
      }, {
        onPreviewDecision(decision) {
          const transition = choosePreviewExit(currentProgress, decision, {
            definition: DiagnosticDefinition,
            meta: appMeta,
            now: nowProvider(),
          });
          const saved = transitionAndSave({
            storage: getStorage(),
            transition,
            definition: DiagnosticDefinition,
            meta: appMeta,
            now: nowProvider(),
          });
          currentProgress = saved.progress;
          questionnaireStorageStatus = saved.persistence.status === "ok" ? "ok" : "error";
          if (decision === "continueHidden") {
            setRoute("#/answer");
            return;
          }
          const snapshot = createSnapshot({
            answers: currentProgress.answers,
            questionCount: 20,
            mode: "preview20",
          });
          const persisted = saveResultSnapshot({
            storage: getStorage(),
            snapshot,
            diagnosisId: DiagnosticDefinition.diagnosisId,
            definition: DiagnosticDefinition,
            meta: appMeta,
            now: nowProvider(),
          });
          liveResult = { snapshot, persistenceFailed: persisted.status !== "ok" };
          setRoute(`#/result?resultId=${encodeURIComponent(snapshot.resultId)}`);
        },
        onBack() {
          const transition = goBack(currentProgress, {
            definition: DiagnosticDefinition,
            meta: appMeta,
            now: nowProvider(),
          });
          const saved = transitionAndSave({ storage: getStorage(), transition, definition: DiagnosticDefinition, meta: appMeta, now: nowProvider() });
          currentProgress = saved.progress;
          questionnaireStorageStatus = saved.persistence.status === "ok" ? "ok" : "error";
          renderQuestionnaireRoute();
        },
        onDiscard() { discardCurrentProgress(); },
      });
      return;
    }
    const ids = currentProgress.mode === "preview20"
      ? DiagnosticDefinition.previewQuestionIds
      : DiagnosticDefinition.detailQuestionIds;
    const questionId = ids[currentProgress.currentIndex];
    const question = QuestionDefinitions.find(({ id }) => id === questionId);
    renderQuestionnaireScreen(screenHost, {
      phase: "question",
      questionId,
      questionText: question.textJa,
      currentIndex: currentProgress.currentIndex,
      totalCount: currentProgress.mode === "preview20" ? 20 : 50,
      selectedValue: currentProgress.answers[questionId] ?? null,
      storageStatus: questionnaireStorageStatus,
    }, {
      onAnswer(answer) { answerCurrentQuestion(answer); },
      onBack() {
        const transition = goBack(currentProgress, { definition: DiagnosticDefinition, meta: appMeta, now: nowProvider() });
        const saved = transitionAndSave({ storage: getStorage(), transition, definition: DiagnosticDefinition, meta: appMeta, now: nowProvider() });
        currentProgress = saved.progress;
        questionnaireStorageStatus = saved.persistence.status === "ok" ? "ok" : "error";
        renderQuestionnaireRoute();
      },
      onDiscard() { discardCurrentProgress(); },
    });
  }

  function discardCurrentProgress() {
    if (!requestConfirmation("途中回答を破棄します。破棄後は復元できません。")) return;
    const outcome = discardProgress({
      storage: getStorage(), diagnosisId: DiagnosticDefinition.diagnosisId, confirmed: true, now: nowProvider(),
    });
    if (outcome.status === "ok") {
      currentProgress = null;
      questionnaireStorageStatus = "ok";
      setRoute("#/start");
      return;
    }
    questionnaireStorageStatus = "error";
    renderQuestionnaireRoute();
  }

  function answerCurrentQuestion(answer) {
    const transition = answerAndSave({
      storage: getStorage(), progress: currentProgress, answer,
      definition: DiagnosticDefinition, meta: appMeta, now: nowProvider(),
    });
    currentProgress = transition.progress;
    questionnaireStorageStatus = transition.persistence.status === "ok" ? "ok" : "error";
    if (transition.kind !== "detail-complete") {
      renderQuestionnaireRoute();
      return;
    }
    const snapshot = createSnapshot({ answers: transition.answers, questionCount: 50, mode: "detail50" });
    const persisted = saveResultSnapshot({
      storage: getStorage(), snapshot, diagnosisId: DiagnosticDefinition.diagnosisId,
      definition: DiagnosticDefinition, meta: appMeta, now: nowProvider(),
    });
    currentProgress = null;
    questionnaireStorageStatus = "ok";
    liveResult = { snapshot, persistenceFailed: persisted.status !== "ok" };
    setRoute(`#/result?resultId=${encodeURIComponent(snapshot.resultId)}`);
  }

  function renderResultRoute(route) {
    if (!route.resultId) {
      returnMissingResultToHistory();
      return;
    }
    if (liveResult?.snapshot?.resultId === route.resultId) {
      renderResult(
        liveResult.snapshot,
        liveResult.persistenceFailed,
        isShownPreviewProgressForSnapshot(currentProgress, liveResult.snapshot) ? currentProgress : null,
      );
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
    renderResult(snapshot, false, loadPreviewContinuation(snapshot));
  }

  function renderResult(snapshot, persistenceFailed, previewProgress = null) {
    let characterEntry = null;
    try {
      characterEntry = resolveCharacterEntry(
        validatedCharacterManifest,
        snapshot.characterId,
      );
    } catch {
      // Historical snapshots may reference an asset absent from this manifest.
      // The result screen converts null to its image-only safe fallback.
    }
    renderSavedResultScreen(screenHost, snapshot, {
      factorLabels,
      factorDescriptions,
      titleLabels,
    }, {
      ...(previewProgress ? { onContinueDetail() {
        currentProgress = previewProgress;
        const transition = continueAfterPreview(currentProgress, {
          definition: DiagnosticDefinition, meta: appMeta, now: nowProvider(),
        });
        const saved = transitionAndSave({
          storage: getStorage(), transition, definition: DiagnosticDefinition, meta: appMeta, now: nowProvider(),
        });
        currentProgress = saved.progress;
        questionnaireStorageStatus = saved.persistence.status === "ok" ? "ok" : "error";
        liveResult = null;
        setRoute("#/answer");
      } } : {}),
      onRetry() {
        liveResult = null;
        const progress = createProgressRecord({
          definition: DiagnosticDefinition, meta: appMeta, progressId: uuidProvider(), now: nowProvider(),
        });
        persistProgress(progress);
        setRoute("#/answer");
      },
    }, {
      notice: persistenceFailed
        ? "結果は表示できましたが、この端末の履歴には保存できませんでした。"
        : null,
      characterEntry,
      decodeImage: effectiveDecodeImage,
      loadCharacterImage,
      observeViewport: effectiveObserveViewport,
    });
  }

  function renderComparisonRoute(route) {
    if (!route.beforeResultId || !route.afterResultId) {
      replaceRoute("#/history");
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
    if (route.id === "answer") {
      renderQuestionnaireRoute();
      return;
    }

    const loaded = loadProgress({
      storage: getStorage(), definition: DiagnosticDefinition, meta: appMeta, now: nowProvider(),
    });
    const resumeProgress = loaded.status === "ok" ? loaded.progress : null;
    renderStartScreen(screenHost, createStartVersionViewModel(appMeta), {
      onStartNew() {
        const progress = createProgressRecord({
          definition: DiagnosticDefinition, meta: appMeta, progressId: uuidProvider(), now: nowProvider(),
        });
        persistProgress(progress);
        setRoute("#/answer");
      },
      ...(resumeProgress ? {
        onResume() {
          currentProgress = resumeProgress;
          questionnaireStorageStatus = "ok";
          if (currentProgress.mode === "preview20" && currentProgress.previewDecision === "showPreview") {
            const transition = continueAfterPreview(currentProgress, {
              definition: DiagnosticDefinition, meta: appMeta, now: nowProvider(),
            });
            const saved = transitionAndSave({
              storage: getStorage(), transition, definition: DiagnosticDefinition, meta: appMeta, now: nowProvider(),
            });
            currentProgress = saved.progress;
            questionnaireStorageStatus = saved.persistence.status === "ok" ? "ok" : "error";
          }
          setRoute("#/answer");
        },
      } : {}),
    });
  }

  windowObject.addEventListener("hashchange", () => {
    if (pendingInternalHashChange === windowObject.location.hash) {
      pendingInternalHashChange = null;
      return;
    }
    pendingInternalHashChange = null;
    renderCurrentRoute();
  });
  renderCurrentRoute();
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
  startApp();
}
