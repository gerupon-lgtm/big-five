import { compareResultSnapshots } from "../domain/result-comparison.js";
import { comparisonErrorMessage } from "./comparison-copy.js";
import { appendAppHeader } from "./app-header.js";
import { appendScreenHeading } from "./screen-heading.js";
import { appendTextElement, formatCompletedAt } from "./screen-helpers.js";

function appendCardIdentity(parent, snapshot, labels, phrasingOnly = false) {
  appendTextElement(
    parent,
    phrasingOnly ? "span" : "h2",
    labels.titleLabels[snapshot.titleId] ?? snapshot.titleId,
    "history-card-title",
  );
  const metadata = parent.ownerDocument.createElement(
    phrasingOnly ? "span" : "p",
  );
  metadata.className = "history-metadata";
  const time = appendTextElement(
    metadata,
    "time",
    formatCompletedAt(snapshot.completedAt),
  );
  time.setAttribute("datetime", snapshot.completedAt);
  appendTextElement(
    metadata,
    "span",
    snapshot.questionCount === 20
      ? "20問 簡易プレビュー"
      : "50問 詳細結果",
    "history-mode-badge",
  );
  parent.append(metadata);
}

function appendThumbnailFallback(frame, text) {
  appendTextElement(
    frame,
    "span",
    text,
    "history-character-fallback",
  );
}

function renderHistoryThumbnail(
  parent,
  snapshot,
  dependencies,
  phrasingOnly = false,
) {
  const frame = parent.ownerDocument.createElement(
    phrasingOnly ? "span" : "div",
  );
  frame.className = "history-character-frame";
  frame.setAttribute("data-character-state", "unavailable");
  parent.append(frame);

  let entry = null;
  try {
    entry = dependencies.resolveCharacterEntry?.(snapshot.characterId) ?? null;
  } catch {
    entry = null;
  }
  if (
    !entry
    || entry.characterId !== snapshot.characterId
    || entry.assetVersion !== snapshot.characterAssetVersion
    || typeof dependencies.observeViewport !== "function"
    || typeof dependencies.loadCharacterImage !== "function"
    || typeof dependencies.decodeImage !== "function"
  ) {
    appendThumbnailFallback(frame, "猫画像を利用できません");
    return;
  }

  frame.setAttribute("data-character-state", "pending");
  appendThumbnailFallback(frame, entry.alt);
  let started = false;
  const loadOnEntry = async () => {
    if (started) return;
    started = true;
    try {
      const result = await dependencies.loadCharacterImage(entry, {
        decodeImage: dependencies.decodeImage,
      });
      if (result.status === "loaded" && result.image) {
        result.image.className = "history-character-image";
        result.image.setAttribute("alt", result.alt);
        result.image.setAttribute("width", String(entry.width));
        result.image.setAttribute("height", String(entry.height));
        frame.setAttribute("data-character-state", "loaded");
        frame.replaceChildren(result.image);
        return;
      }
    } catch {
      // The approved alt remains visible as the fallback.
    }
    frame.setAttribute("data-character-state", "unavailable");
  };

  try {
    dependencies.observeViewport(frame, loadOnEntry);
  } catch {
    frame.setAttribute("data-character-state", "unavailable");
  }
}

function renderResultCard(parent, snapshot, labels, actions, dependencies) {
  const card = parent.ownerDocument.createElement("article");
  card.className = "history-card";
  card.setAttribute("data-result-id", snapshot.resultId);
  renderHistoryThumbnail(card, snapshot, dependencies);
  appendCardIdentity(card, snapshot, labels);

  const openButton = appendTextElement(
    card,
    "button",
    "結果を見る",
    "primary-button history-open-result",
  );
  openButton.setAttribute("type", "button");
  openButton.addEventListener(
    "click",
    () => actions.onOpenResult?.(snapshot.resultId),
  );
  parent.append(card);
}

function renderSelectableCard(
  parent,
  snapshot,
  labels,
  dependencies,
  selectedResultIds,
  comparison,
  onToggle,
) {
  const card = parent.ownerDocument.createElement("article");
  card.className = "history-card comparison-mode";
  card.setAttribute("data-result-id", snapshot.resultId);

  const toggle = card.ownerDocument.createElement("button");
  toggle.className = "history-card-select-toggle";
  toggle.setAttribute("type", "button");
  const selected = selectedResultIds.includes(snapshot.resultId);
  toggle.setAttribute("aria-pressed", selected ? "true" : "false");
  toggle.disabled = comparison?.compatible === false
    || (selectedResultIds.length === 2 && !selected);
  renderHistoryThumbnail(toggle, snapshot, dependencies, true);
  appendCardIdentity(toggle, snapshot, labels, true);
  toggle.addEventListener("click", () => onToggle(snapshot));
  card.append(toggle);

  if (comparison?.compatible === false) {
    appendTextElement(
      card,
      "p",
      comparisonErrorMessage(comparison.code),
      "comparison-reason",
    );
  }
  parent.append(card);
  return toggle;
}

function renderComparisonBar(
  parent,
  comparisonMode,
  selectedCount,
  actions,
) {
  const bar = parent.ownerDocument.createElement("nav");
  bar.className = "history-comparison-bar";
  bar.setAttribute("aria-label", "診断結果の比較");

  if (!comparisonMode) {
    const enter = appendTextElement(
      bar,
      "button",
      "結果を比較する",
      "primary-button",
    );
    enter.setAttribute("type", "button");
    enter.addEventListener("click", actions.onEnter);
  } else {
    appendTextElement(
      bar,
      "p",
      `${selectedCount}件選択中`,
      "history-comparison-count",
    );
    const cancel = appendTextElement(
      bar,
      "button",
      "キャンセル",
      "secondary-button",
    );
    cancel.setAttribute("type", "button");
    cancel.addEventListener("click", actions.onCancel);
    const compare = appendTextElement(
      bar,
      "button",
      "選択した2件を比較",
      "primary-button",
    );
    compare.setAttribute("type", "button");
    compare.disabled = selectedCount !== 2;
    compare.addEventListener("click", actions.onExecute);
  }
  parent.append(bar);
}

function renderHistoryHeader(parent, historyState, actions) {
  if (historyState.status !== "ok") return;

  const header = parent.ownerDocument.createElement("header");
  header.className = "history-header";

  const toggle = appendTextElement(
    header,
    "button",
    "履歴削除",
    "history-management-toggle",
  );
  toggle.setAttribute("type", "button");
  toggle.setAttribute("aria-label", "履歴の管理");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "history-management-modal");

  const dialog = header.ownerDocument.createElement("dialog");
  dialog.className = "history-management-modal";
  dialog.setAttribute("id", "history-management-modal");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", "履歴の管理");
  const menu = dialog.ownerDocument.createElement("div");
  menu.className = "history-management-content";
  dialog.append(menu);
  const closeButton = appendTextElement(
    menu,
    "button",
    "閉じる",
    "history-management-close",
  );
  closeButton.setAttribute("type", "button");
  const deleteAll = appendTextElement(
    menu,
    "button",
    "端末内データをすべて削除",
    "danger-button",
  );
  deleteAll.setAttribute("type", "button");
  deleteAll.addEventListener("click", () => actions.onDeleteAll?.());

  for (const snapshot of historyState.results ?? []) {
    const details = menu.ownerDocument.createElement("details");
    appendTextElement(
      details,
      "summary",
      `${formatCompletedAt(snapshot.completedAt)} ${
        snapshot.questionCount === 20 ? "20問" : "50問"
      } 診断時のバージョン`,
    );
    const versions = details.ownerDocument.createElement("dl");
    for (const [name, value] of Object.entries(snapshot.versionTuple)) {
      appendTextElement(versions, "dt", name);
      appendTextElement(versions, "dd", value);
    }
    details.append(versions);
    const deleteOne = appendTextElement(
      details,
      "button",
      `${formatCompletedAt(snapshot.completedAt)} ${
        snapshot.questionCount === 20 ? "20問" : "50問"
      } この結果を削除`,
      "danger-button",
    );
    deleteOne.setAttribute("type", "button");
    deleteOne.addEventListener(
      "click",
      () => actions.onDeleteResult?.(snapshot.resultId),
    );
    menu.append(details);
  }

  let modalOpen = false;
  let fallbackMode = false;
  let fallbackBackgroundStates = [];

  function subtreeContainsDialog(element) {
    if (element === dialog) return true;
    return Array.from(element.children ?? []).some(subtreeContainsDialog);
  }

  function fallbackBackgroundBranches(container) {
    return Array.from(container.children ?? []).flatMap((child) => {
      if (child === dialog) return [];
      if (!subtreeContainsDialog(child)) return [child];
      return fallbackBackgroundBranches(child);
    });
  }

  function activateFallbackModality() {
    dialog.className =
      "history-management-modal history-management-modal--fallback";
    dialog.setAttribute("data-presentation", "fallback-modal");
    fallbackBackgroundStates = fallbackBackgroundBranches(parent).map((element) => ({
      element,
      inert: Boolean(element.inert),
      ariaHidden: element.getAttribute("aria-hidden"),
    }));
    for (const { element } of fallbackBackgroundStates) {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    }
  }

  function restoreFallbackModality() {
    for (const { element, inert, ariaHidden } of fallbackBackgroundStates) {
      element.inert = inert;
      if (ariaHidden === null) {
        element.removeAttribute("aria-hidden");
      } else {
        element.setAttribute("aria-hidden", ariaHidden);
      }
    }
    fallbackBackgroundStates = [];
    dialog.className = "history-management-modal";
    dialog.removeAttribute("data-presentation");
  }

  function fallbackFocusableElements() {
    const focusableTags = new Set(["a", "button", "input", "select", "summary", "textarea"]);
    return collectReachableDescendants(dialog).filter((element) =>
      focusableTags.has(String(element.tagName).toLowerCase()) && !element.disabled
    );
  }

  function collectReachableDescendants(element) {
    return Array.from(element.children ?? []).flatMap((child) => {
      if (
        child.hidden
        || child.inert
        || child.getAttribute("aria-hidden") === "true"
      ) {
        return [];
      }
      if (String(child.tagName).toLowerCase() === "details" && !child.open) {
        const summary = Array.from(child.children ?? []).find(
          (candidate) =>
            String(candidate.tagName).toLowerCase() === "summary",
        );
        return summary
          ? [child, summary, ...collectReachableDescendants(summary)]
          : [child];
      }
      return [child, ...collectReachableDescendants(child)];
    });
  }

  function closeManagement() {
    if (!modalOpen) return;
    const wasFallback = fallbackMode;
    modalOpen = false;
    fallbackMode = false;
    toggle.setAttribute("aria-expanded", "false");
    if (dialog.open) {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.open = false;
        dialog.removeAttribute("open");
      }
    }
    if (wasFallback) restoreFallbackModality();
    toggle.focus?.();
  }

  function openManagement() {
    if (modalOpen) return;
    modalOpen = true;
    toggle.setAttribute("aria-expanded", "true");
    if (typeof dialog.showModal === "function") {
      try {
        dialog.showModal();
      } catch {
        fallbackMode = true;
        dialog.open = true;
        dialog.setAttribute("open", "");
        activateFallbackModality();
      }
    } else {
      fallbackMode = true;
      dialog.open = true;
      dialog.setAttribute("open", "");
      activateFallbackModality();
    }
    closeButton.focus?.();
  }

  closeButton.addEventListener("click", closeManagement);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeManagement();
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeManagement();
  });
  dialog.addEventListener("close", closeManagement);
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeManagement();
      return;
    }
    if (!fallbackMode) return;
    if (event.key !== "Tab") return;
    const focusable = fallbackFocusableElements();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    const active = dialog.ownerDocument.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus?.();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus?.();
    }
  });
  toggle.addEventListener("click", openManagement);
  header.append(dialog);
  parent.append(header);
}

function renderOperationNotice(parent, operationNotice) {
  if (!operationNotice) return;
  const notice = appendTextElement(
    parent,
    "p",
    operationNotice.text,
    `notice ${operationNotice.kind}-notice`,
  );
  notice.setAttribute(
    "role",
    operationNotice.kind === "error" ? "alert" : "status",
  );
}

export function renderHistoryScreen(
  host,
  historyState,
  actions = {},
  dependencies = {},
) {
  let comparisonMode = false;
  let selectedResultIds = [];
  let viewportCleanups = [];

  function selectedSnapshots() {
    return selectedResultIds.map((resultId) =>
      historyState.results.find((snapshot) => snapshot.resultId === resultId));
  }

  function comparisonAgainstFirst(snapshot) {
    const [first] = selectedSnapshots();
    return first ? compareResultSnapshots(first, snapshot) : null;
  }

  function toggleResult(snapshot) {
    if (selectedResultIds.includes(snapshot.resultId)) {
      selectedResultIds = selectedResultIds.filter(
        (resultId) => resultId !== snapshot.resultId,
      );
    } else if (
      selectedResultIds.length < 2
      && comparisonAgainstFirst(snapshot)?.compatible !== false
    ) {
      selectedResultIds = [...selectedResultIds, snapshot.resultId];
    }
    render(snapshot.resultId);
  }

  function cancelComparison() {
    comparisonMode = false;
    selectedResultIds = [];
    render();
  }

  function executeComparison() {
    if (selectedResultIds.length !== 2) return;
    const [first, second] = selectedSnapshots();
    const comparison = compareResultSnapshots(first, second);
    if (comparison.compatible) actions.onCompare?.(comparison);
  }

  function render(focusResultId = null) {
    for (const cleanup of viewportCleanups) cleanup();
    viewportCleanups = [];
    const documentObject = host.ownerDocument ?? document;
    const selectableToggles = new Map();
    const renderDependencies = typeof dependencies.observeViewport === "function"
      ? {
        ...dependencies,
        observeViewport(target, onEnter) {
          const cleanup = dependencies.observeViewport(target, onEnter);
          if (typeof cleanup === "function") viewportCleanups.push(cleanup);
          return cleanup;
        },
      }
      : dependencies;
    const main = documentObject.createElement("main");
    main.className = "app-shell history-screen";
    appendAppHeader(main, {
      action: { label: "トップ画面へ", href: "#/start" },
    });
    appendScreenHeading(main, {
      kicker: "HISTORY",
      title: "診断結果の履歴",
      titleClassName: "history-title",
    });
    appendTextElement(
      main,
      "p",
      "結果はこの端末のブラウザ内にだけ保存されます。",
      "lead compact-lead history-lead",
    );
    renderHistoryHeader(main, historyState, actions);
    renderOperationNotice(main, actions.operationNotice);

    if (historyState.status === "error") {
      const error = appendTextElement(
        main,
        "p",
        "保存データを読み込めませんでした。既存データは変更していません。",
        "notice error-notice",
      );
      error.setAttribute("role", "alert");
    } else if (historyState.results.length === 0) {
      const empty = documentObject.createElement("section");
      empty.className = "status-card empty-state";
      appendTextElement(empty, "h2", "まだ結果がありません");
      appendTextElement(
        empty,
        "p",
        "診断が完了すると、この端末で過去の結果を振り返れます。",
      );
      const startLink = appendTextElement(
        empty,
        "a",
        "診断を始める",
        "primary-link",
      );
      startLink.setAttribute("href", "#/start");
      main.append(empty);
    } else {
      const list = documentObject.createElement("div");
      list.className = "history-list";
      const [first] = selectedSnapshots();
      for (const snapshot of historyState.results) {
        if (!comparisonMode) {
          renderResultCard(
            list,
            snapshot,
            historyState,
            actions,
            renderDependencies,
          );
          continue;
        }
        const comparison = first && first.resultId !== snapshot.resultId
          ? compareResultSnapshots(first, snapshot)
          : null;
        const toggle = renderSelectableCard(
          list,
          snapshot,
          historyState,
          renderDependencies,
          selectedResultIds,
          comparison,
          toggleResult,
        );
        selectableToggles.set(snapshot.resultId, toggle);
      }
      main.append(list);
    }

    if (historyState.status === "ok" && historyState.results.length > 0) {
      renderComparisonBar(
        main,
        comparisonMode,
        selectedResultIds.length,
        {
          onEnter() {
            comparisonMode = true;
            selectedResultIds = [];
            render();
          },
          onCancel: cancelComparison,
          onExecute: executeComparison,
        },
      );
    }
    host.replaceChildren(main);
    selectableToggles.get(focusResultId)?.focus?.();
  }

  render();
}
