import { appendTextElement } from "./screen-helpers.js";

function requireText(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError("BOTTOM_SHEET_INVALID");
  }
  return value;
}

export function appendBottomSheetLauncher(
  parent,
  { id, label, title, body } = {},
) {
  if (!parent || typeof parent.append !== "function") {
    throw new TypeError("BOTTOM_SHEET_INVALID");
  }
  const safeId = requireText(id);
  const safeLabel = requireText(label);
  const safeTitle = requireText(title);
  const safeBody = requireText(body);

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
  const closeButton = appendTextElement(
    sheet,
    "button",
    "閉じる",
    "secondary-button",
  );
  closeButton.setAttribute("type", "button");

  function openSheet() {
    if (typeof sheet.showModal === "function") {
      sheet.showModal();
    } else {
      sheet.setAttribute("open", "");
    }
    button.setAttribute("aria-expanded", "true");
  }

  function closeSheet() {
    if (typeof sheet.close === "function" && sheet.open) {
      sheet.close();
    } else {
      sheet.removeAttribute("open");
    }
    button.setAttribute("aria-expanded", "false");
    button.focus?.();
  }

  button.addEventListener("click", openSheet);
  closeButton.addEventListener("click", closeSheet);
  sheet.addEventListener("close", () => {
    button.setAttribute("aria-expanded", "false");
    button.focus?.();
  });
  parent.append(sheet);
  return button;
}
