import { appendTextElement } from "./screen-helpers.js";

function requireText(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError("BOTTOM_SHEET_INVALID");
  }
  return value;
}

export function appendBottomSheetLauncher(
  parent,
  { id, label, title, body, appendContent } = {},
) {
  if (!parent || typeof parent.append !== "function") {
    throw new TypeError("BOTTOM_SHEET_INVALID");
  }
  const safeId = requireText(id);
  const safeLabel = requireText(label);
  const safeTitle = requireText(title);
  const safeBody = requireText(body);
  if (appendContent !== undefined && typeof appendContent !== "function") {
    throw new TypeError("BOTTOM_SHEET_INVALID");
  }

  const button = appendTextElement(
    parent,
    "button",
    safeLabel,
    "bottom-sheet-launcher",
  );
  button.setAttribute("type", "button");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", safeId);

  const sheet = parent.ownerDocument.createElement("dialog");
  sheet.id = safeId;
  sheet.className = "bottom-sheet";
  sheet.setAttribute("aria-labelledby", `${safeId}-title`);
  const heading = appendTextElement(sheet, "h2", safeTitle);
  heading.id = `${safeId}-title`;
  appendTextElement(sheet, "p", safeBody);
  appendContent?.(sheet);
  const closeButton = appendTextElement(
    sheet,
    "button",
    "閉じる",
    "secondary-button",
  );
  closeButton.setAttribute("type", "button");
  let sheetOpen = false;

  function openInlineFallback() {
    sheet.className = "bottom-sheet bottom-sheet--inline";
    sheet.setAttribute("data-presentation", "inline");
    sheet.open = true;
    sheet.setAttribute("open", "");
  }

  function openSheet() {
    if (sheetOpen) return;
    if (typeof sheet.showModal === "function") {
      try {
        sheet.showModal();
      } catch {
        openInlineFallback();
      }
    } else {
      openInlineFallback();
    }
    sheetOpen = true;
    button.setAttribute("aria-expanded", "true");
    closeButton.focus?.();
  }

  function finishClose() {
    if (!sheetOpen) return;
    sheetOpen = false;
    sheet.className = "bottom-sheet";
    sheet.removeAttribute("data-presentation");
    button.setAttribute("aria-expanded", "false");
    button.focus?.();
  }

  function closeSheet() {
    if (!sheetOpen) return;
    if (typeof sheet.close === "function" && sheet.open) {
      sheet.close();
    } else {
      sheet.removeAttribute("open");
    }
    finishClose();
  }

  button.addEventListener("click", openSheet);
  closeButton.addEventListener("click", closeSheet);
  sheet.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSheet();
  });
  sheet.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !sheetOpen) return;
    event.preventDefault();
    closeSheet();
  });
  sheet.addEventListener("close", finishClose);
  parent.append(sheet);
  return button;
}
