import { appendTextElement } from "./screen-helpers.js";

export function appendAppHeader(parent, {
  screenLabel = "",
  action = null,
  sticky = false,
} = {}) {
  const documentObject = parent.ownerDocument ?? document;
  const header = documentObject.createElement("header");
  header.className = sticky ? "app-header is-sticky" : "app-header";

  const brand = documentObject.createElement("div");
  brand.className = "app-brand";
  appendTextElement(brand, "span", "Big Five｜", "app-brand-part");
  appendTextElement(brand, "span", "自己理解支援ツール", "app-brand-part");
  header.append(brand);

  if (screenLabel) {
    appendTextElement(header, "span", screenLabel, "app-screen-label");
  }
  if (action) {
    const button = appendTextElement(
      header,
      "button",
      action.label,
      "app-header-action",
    );
    button.setAttribute("type", "button");
    button.addEventListener("click", action.onClick);
  }

  parent.append(header);
  return header;
}
