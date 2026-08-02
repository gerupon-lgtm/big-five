import { appMeta } from "./config/app-meta.js";
import { CharacterManifest } from "./data/character-manifest.js";
import { DiagnosticDefinition, FactorDefinitions, QuestionDefinitions } from "./data/diagnostic-definition.js";
import { PresentationDefinitionSet } from "./data/presentation-definitions.js";
import { ResultTextDefinitions } from "./data/result-text-definitions.js";
import { TitleProfileDefinitions } from "./data/title-profile-definitions.js";
import {
  resolveCharacterEntry,
  validateCharacterManifest,
} from "./domain/character-manifest.js";
import { compareResultSnapshots } from "./domain/result-comparison.js";
import { createShareCardModel } from "./domain/share-card-model.js";
import { summarizeFragrances } from "./domain/share-fragrance-summary.js";
import { resolvePaletteUsage } from "./domain/palette-usage.js";
import { createQuestionComposition } from "./domain/question-composition.js";
import { resolveRegisteredDiagnosticDefinition } from "./domain/diagnostic-definition-registry.js";
import { selectPresentation } from "./domain/presentation-selector.js";
import { selectResultPalette } from "./domain/result-palette-selection.js";
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
  updateResultPaletteSelection,
} from "./infrastructure/progress-storage.js";
import { loadCharacterImage } from "./infrastructure/character-loader.js";
import { resolveRoute } from "./infrastructure/router.js";
import {
  copyShareText,
  detectShareCapabilities,
  downloadPng,
  sharePng,
} from "./infrastructure/share-delivery.js";
import { renderComparisonScreen } from "./presentation/comparison-screen.js";
import { renderHistoryScreen } from "./presentation/history-screen.js";
import { renderSavedResultScreen } from "./presentation/result-screen.js";
import { renderShareCard } from "./presentation/share-card-renderer.js";
import { renderShareScreen } from "./presentation/share-screen.js";
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
const questionCompositionByMode = Object.freeze({
  preview20: createQuestionComposition({
    mode: "preview20",
    definition: DiagnosticDefinition,
    questionDefinitions: QuestionDefinitions,
  }),
  detail50: createQuestionComposition({
    mode: "detail50",
    definition: DiagnosticDefinition,
    questionDefinitions: QuestionDefinitions,
  }),
});
const diagnosticDefinitionRegistry = Object.freeze([
  Object.freeze({
    scaleVersion: DiagnosticDefinition.scaleVersion,
    questionVersion: DiagnosticDefinition.questionVersion,
    scoringVersion: DiagnosticDefinition.scoringVersion,
    definition: DiagnosticDefinition,
    questionCompositionByMode,
  }),
]);

function createMethodInfo(definition, mode) {
  return Object.freeze([
    Object.freeze({
      id: "basis",
      title: "測定の土台",
      body: `${definition.scaleName}を用いて、Big Fiveの5因子を確認します。`,
    }),
    Object.freeze({
      id: "scoring",
      title: "スコアの計算方法",
      body: "正方向・逆方向をそろえた1〜5の平均を、表示用に0〜100へ換算しています。",
    }),
    Object.freeze({
      id: "limitations",
      title: "この結果の限界",
      body: (mode === "preview20"
        ? definition.limitations
        : [definition.limitations[0], definition.limitations[2]]
      ).join(" "),
    }),
    Object.freeze({
      id: "sources",
      title: "出典・利用条件",
      body: definition.source.map(({ label }) => label).join(" / "),
    }),
  ]);
}
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
      return () => {};
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
    return () => observer.disconnect();
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
  renderShareCardProvider = renderShareCard,
  shareCanvasDependencies,
  shareDeliveryDependencies,
} = {}) {
  const screenHost = documentObject.getElementById("app");
  let historyNotice = null;
  let currentProgress = null;
  let questionnaireStorageStatus = "ok";
  let liveResult = null;
  let resultActionNotice = null;
  let pendingInternalHashChange = null;
  const effectiveDecodeImage = decodeImage ??
    createBrowserImageDecoder(windowObject);
  const baseObserveViewport = observeViewport ??
    createViewportObserver(windowObject);
  let activeViewportCleanups = [];
  let activeShareObjectUrl = null;
  let shareRenderGeneration = 0;
  const effectiveShareDeliveryDependencies = shareDeliveryDependencies ?? {
    File: windowObject.File ?? globalThis.File,
    navigator: windowObject.navigator,
    URL: windowObject.URL ?? globalThis.URL,
    document: documentObject,
  };
  const effectiveShareCanvasDependencies = shareCanvasDependencies ?? {
    createCanvas(width, height) {
      const canvas = documentObject.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      return canvas;
    },
    async loadImage(path) {
      const ImageConstructor = windowObject.Image ?? globalThis.Image;
      if (typeof ImageConstructor !== "function") throw new Error("IMAGE_UNAVAILABLE");
      const image = new ImageConstructor();
      image.src = path;
      if (typeof image.decode === "function") await image.decode();
      return image;
    },
    fontsReady: documentObject.fonts?.ready ?? Promise.resolve(),
  };

  function effectiveObserveViewport(target, onEnter) {
    const cleanup = baseObserveViewport(target, onEnter);
    if (typeof cleanup !== "function") return cleanup;
    let active = true;
    const trackedCleanup = () => {
      if (!active) return;
      active = false;
      cleanup();
      activeViewportCleanups = activeViewportCleanups.filter(
        (candidate) => candidate !== trackedCleanup,
      );
    };
    activeViewportCleanups.push(trackedCleanup);
    return trackedCleanup;
  }

  function clearViewportObservers() {
    for (const cleanup of [...activeViewportCleanups]) cleanup();
  }

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
    if (!progress || snapshot.mode !== "preview20") return false;
    if (progress.progressId !== snapshot.resultId) return false;
    return progress.mode === "preview20" &&
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

  function createSnapshot({
    answers,
    questionCount,
    mode,
    resultId = uuidProvider(),
  }) {
    if (!currentProgress) throw new Error("APP_PROGRESS_MISSING");
    return createDiagnosticResultSnapshot({
      answers,
      questionCount,
      mode,
      resultId,
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
        const outcome = deleteAllData({
          storage: effectiveStorage,
          confirmed: true,
          now: nowProvider(),
        });
        if (outcome.status === "ok") {
          currentProgress = null;
          liveResult = null;
          questionnaireStorageStatus = "ok";
          resultActionNotice = null;
        }
        historyNotice = outcome.status === "ok"
          ? { kind: "success", text: "端末内の途中回答と診断結果をすべて削除しました。" }
          : { kind: "error", text: "端末内データを削除できませんでした。もう一度お試しください。" };
        renderCurrentRoute();
      },
      onCompare(comparison) {
        setRoute(`#/compare?before=${encodeURIComponent(comparison.beforeResultId)}&after=${encodeURIComponent(comparison.afterResultId)}`);
      },
      onOpenResult(resultId) {
        liveResult = null;
        resultActionNotice = null;
        setRoute(`#/result?resultId=${encodeURIComponent(resultId)}`);
      },
    }, {
      resolveCharacterEntry(characterId) {
        return resolveCharacterEntry(validatedCharacterManifest, characterId);
      },
      decodeImage: effectiveDecodeImage,
      loadCharacterImage,
      observeViewport: effectiveObserveViewport,
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
            resultId: currentProgress.progressId,
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
        onPause() { pauseCurrentProgress(); },
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
      onPause() { pauseCurrentProgress(); },
      onDiscard() { discardCurrentProgress(); },
    });
  }

  function pauseCurrentProgress() {
    if (
      questionnaireStorageStatus === "error"
      && !requestConfirmation(
        "この回答は端末へ保存できていません。トップへ戻ると、再読み込み後には再開できない場合があります。トップへ戻りますか？",
      )
    ) {
      return;
    }
    setRoute("#/start");
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
    renderResult(snapshot, false, loadPreviewContinuation(snapshot), true);
  }

  function clearShareResource() {
    shareRenderGeneration += 1;
    if (activeShareObjectUrl) {
      try {
        effectiveShareDeliveryDependencies.URL?.revokeObjectURL?.(
          activeShareObjectUrl,
        );
      } catch {
        // The route still changes when explicit URL cleanup is unavailable.
      }
      activeShareObjectUrl = null;
    }
  }

  function renderResult(
    snapshot,
    persistenceFailed,
    previewProgress = null,
    historyDetail = false,
    openResultDisclosureId = null,
  ) {
    const definitionRegistration = resolveRegisteredDiagnosticDefinition(
      snapshot.versionTuple,
      diagnosticDefinitionRegistry,
    );
    let presentation = null;
    if (
      snapshot.versionTuple.presentationDefinitionVersion ===
      PresentationDefinitionSet.presentationDefinitionVersion
    ) {
      const titleProfile = TitleProfileDefinitions.find(({ titleId }) =>
        titleId === snapshot.titleId);
      if (titleProfile) {
        try {
          presentation = selectPresentation(
            titleProfile,
            PresentationDefinitionSet,
          );
        } catch {
          // Historical results remain readable if their presentation cannot resolve.
        }
      }
    }
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
    const canFinishPreview = !persistenceFailed && previewProgress !== null;
    const previewActions = previewProgress ? {
      onContinueDetail() {
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
        resultActionNotice = null;
        setRoute("#/answer");
      },
      ...(canFinishPreview ? {
        onFinishPreview() {
          const storedPreview = loadPreviewContinuation(snapshot);
          if (
            !storedPreview
            || storedPreview.progressId !== previewProgress.progressId
          ) {
            resultActionNotice = "対応する途中回答を確認できないため、簡易プレビューを終了できません。";
            renderResult(snapshot, false, null, historyDetail);
            return;
          }
          const outcome = discardProgress({
            storage: getStorage(),
            diagnosisId: DiagnosticDefinition.diagnosisId,
            confirmed: true,
            now: nowProvider(),
          });
          if (outcome.status !== "ok") {
            resultActionNotice = "簡易プレビューを終了できませんでした。もう一度お試しください。";
            renderResult(snapshot, false, previewProgress, historyDetail);
            return;
          }
          currentProgress = null;
          liveResult = null;
          resultActionNotice = null;
          setRoute("#/start");
        },
      } : {}),
    } : {};
    const paletteActions = presentation ? {
      onSelectPalette(paletteId, { openResultDisclosureId } = {}) {
        let selectedSnapshot;
        try {
          selectedSnapshot = selectResultPalette(
            snapshot,
            presentation.palettes,
            paletteId,
          );
        } catch {
          return;
        }
        const allowedPaletteIds = [
          presentation.palettes.standard.paletteId,
          ...presentation.palettes.alternatives.map(({ paletteId: id }) => id),
        ];
        const persistence = persistenceFailed
          ? { status: "error" }
          : updateResultPaletteSelection({
              storage: getStorage(),
              resultId: selectedSnapshot.resultId,
              paletteId,
              allowedPaletteIds,
              now: nowProvider(),
            });
        if (liveResult?.snapshot?.resultId === selectedSnapshot.resultId) {
          liveResult = {
            ...liveResult,
            snapshot: selectedSnapshot,
          };
        }
        resultActionNotice = persistence.status === "ok"
          ? null
          : "色はこの画面に反映しましたが、履歴には保存できませんでした。";
        renderResult(
          selectedSnapshot,
          persistenceFailed,
          previewProgress,
          historyDetail,
          openResultDisclosureId,
        );
      },
    } : {};
    renderSavedResultScreen(screenHost, snapshot, {
      factorLabels,
      factorDescriptions,
      titleLabels,
    }, {
      ...previewActions,
      ...paletteActions,
      onReturnToStart() {
        if (
          persistenceFailed &&
          !requestConfirmation(
            "この結果は端末の履歴に保存されていないため、トップへ戻ると再び開けません。トップへ戻りますか？",
          )
        ) {
          return;
        }
        liveResult = null;
        resultActionNotice = null;
        setRoute("#/start");
      },
      onRetry() {
        liveResult = null;
        resultActionNotice = null;
        const progress = createProgressRecord({
          definition: DiagnosticDefinition, meta: appMeta, progressId: uuidProvider(), now: nowProvider(),
        });
        persistProgress(progress);
        setRoute("#/answer");
      },
      ...(presentation ? {
        onShare() {
          resultActionNotice = null;
          setRoute(`#/share?resultId=${encodeURIComponent(snapshot.resultId)}`);
        },
      } : {}),
    }, {
      notice: resultActionNotice ?? (
        persistenceFailed
          ? "結果は表示できましたが、この端末の履歴には保存できませんでした。"
          : null
      ),
      characterEntry,
      decodeImage: effectiveDecodeImage,
      loadCharacterImage,
      observeViewport: effectiveObserveViewport,
      historyDetail,
      historyPreviewInProgress: historyDetail && previewProgress !== null,
      presentation,
      openResultDisclosureId,
      definitionSupported: definitionRegistration !== null,
      ...(definitionRegistration ? {
        questionComposition:
          definitionRegistration.questionCompositionByMode[snapshot.mode],
        methodInfo: createMethodInfo(
          definitionRegistration.definition,
          snapshot.mode,
        ),
      } : {
        methodInformationUnavailable:
          "診断時の尺度・設問・採点版に対応する説明は、このアプリでは確認できません。保存された称号・スコア・結果文は、そのまま確認できます。",
      }),
    });
  }

  function findShareSnapshot(resultId) {
    if (liveResult?.snapshot?.resultId === resultId) return liveResult.snapshot;
    const historyState = loadResultHistory({
      storage: getStorage(),
      now: nowProvider(),
    });
    if (historyState.status === "error") return null;
    return historyState.results.find((snapshot) =>
      snapshot.resultId === resultId) ?? null;
  }

  async function renderShareRoute(route) {
    if (!route.resultId) {
      returnMissingResultToHistory();
      return;
    }
    const snapshot = findShareSnapshot(route.resultId);
    if (!snapshot) {
      returnMissingResultToHistory();
      return;
    }
    const titleProfile = TitleProfileDefinitions.find(({ titleId }) =>
      titleId === snapshot.titleId);
    if (!titleProfile ||
      snapshot.versionTuple.presentationDefinitionVersion !==
        PresentationDefinitionSet.presentationDefinitionVersion) {
      returnMissingResultToHistory();
      return;
    }

    let presentation;
    let characterEntry = null;
    let model;
    try {
      presentation = selectPresentation(titleProfile, PresentationDefinitionSet);
      try {
        characterEntry = resolveCharacterEntry(
          validatedCharacterManifest,
          snapshot.characterId,
        );
      } catch {
        characterEntry = null;
      }
      const palettes = [
        presentation.palettes.standard,
        ...presentation.palettes.alternatives,
      ];
      const palette = palettes.find(({ paletteId }) =>
        paletteId === snapshot.selectedPaletteId);
      const paletteMapping = PresentationDefinitionSet.paletteUsageMappings
        .find(({ paletteId }) => paletteId === snapshot.selectedPaletteId);
      model = createShareCardModel({
        snapshot,
        titleLabel: titleLabels[snapshot.titleId],
        factorLabels,
        characterEntry,
        palette,
        paletteUsage: resolvePaletteUsage(palette, paletteMapping),
        fragranceSummary: summarizeFragrances(presentation.fragranceScenes),
        brand: appMeta.brand,
      });
    } catch {
      returnMissingResultToHistory();
      return;
    }

    clearShareResource();
    const generation = shareRenderGeneration;
    const rendered = await renderShareCardProvider(
      model,
      effectiveShareCanvasDependencies,
    );
    if (generation !== shareRenderGeneration ||
      resolveRoute(windowObject.location.hash).id !== "share") {
      return;
    }

    let blob = null;
    let imageUrl = null;
    let renderErrorCode = rendered?.errorCode ?? null;
    if (rendered?.status === "ok" && rendered.blob) {
      blob = rendered.blob;
      try {
        imageUrl = effectiveShareDeliveryDependencies.URL.createObjectURL(blob);
        activeShareObjectUrl = imageUrl;
      } catch {
        renderErrorCode = "SHARE_CANVAS_UNAVAILABLE";
      }
    }
    const capabilities = detectShareCapabilities(
      effectiveShareDeliveryDependencies,
    );
    renderShareScreen(screenHost, model, {
      ...(blob ? {
        onShare: () => sharePng({
          blob,
          filename: model.filename,
          text: model.shareText,
        }, effectiveShareDeliveryDependencies),
        onDownload: () => downloadPng({
          blob,
          filename: model.filename,
        }, effectiveShareDeliveryDependencies),
      } : {}),
      onCopyText: (text) =>
        copyShareText(text, effectiveShareDeliveryDependencies),
      onBackToResult() {
        setRoute(`#/result?resultId=${encodeURIComponent(snapshot.resultId)}`);
      },
    }, {
      imageUrl,
      renderErrorCode,
      capabilities,
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
    clearViewportObservers();
    const route = resolveRoute(windowObject.location.hash);
    if (route.id !== "share") clearShareResource();
    if (route.id !== "result") resultActionNotice = null;

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
    if (route.id === "share") {
      void renderShareRoute(route);
      return;
    }
    if (route.id === "answer") {
      renderQuestionnaireRoute();
      return;
    }

    const loaded = loadProgress({
      storage: getStorage(), definition: DiagnosticDefinition, meta: appMeta, now: nowProvider(),
    });
    const resumeFromMemory = currentProgress !== null;
    const resumeProgress = currentProgress
      ?? (loaded.status === "ok" ? loaded.progress : null);
    const historyState = loadResultHistory({
      storage: getStorage(), now: nowProvider(),
    });
    renderStartScreen(screenHost, createStartVersionViewModel(appMeta), {
      onStartNew() {
        if (
          resumeProgress
          && !requestConfirmation(
            "途中回答があります。新しく始めると、この途中回答は置き換えられます。新しく始めますか？",
          )
        ) {
          return;
        }
        const progress = createProgressRecord({
          definition: DiagnosticDefinition, meta: appMeta, progressId: uuidProvider(), now: nowProvider(),
        });
        persistProgress(progress);
        setRoute("#/answer");
      },
      ...(resumeProgress ? {
        onResume() {
          currentProgress = resumeProgress;
          if (!resumeFromMemory) questionnaireStorageStatus = "ok";
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
    }, {
      hasHistory: historyState.status === "ok" && historyState.results.length > 0,
      resumeLabel: resumeProgress?.mode === "preview20"
          && resumeProgress.previewDecision === "showPreview"
        ? "残り30問を再開する"
        : "途中から再開する",
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
