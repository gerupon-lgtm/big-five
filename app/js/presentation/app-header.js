import { appendTextElement } from "./screen-helpers.js";

export function appendAppHeader(parent, {
  action = null,
  sticky = false,
} = {}) {
  const documentObject = parent.ownerDocument ?? document;
  const header = documentObject.createElement("header");
  header.className = sticky ? "app-header is-sticky" : "app-header";

  const brand = documentObject.createElement("div");
  brand.className = "app-brand";
  const mark = appendTextElement(brand, "span", "5", "app-mark");
  mark.setAttribute("aria-hidden", "true");
  const brandCopy = documentObject.createElement("span");
  brandCopy.className = "app-brand-copy";
  appendTextElement(brandCopy, "span", "Big Five 自己理解チェック", "app-brand-name");
  appendTextElement(brandCopy, "span", "BIG FIVE SELF UNDERSTANDING", "app-brand-subtitle");
  brand.append(brandCopy);
  header.append(brand);

  if (action) {
    if (action.href) {
      const link = appendTextElement(header, "a", action.label, "app-header-action");
      link.setAttribute("href", action.href);
    } else {
      const button = appendTextElement(
        header,
        "button",
        action.label,
        "app-header-action",
      );
      button.setAttribute("type", "button");
      button.addEventListener("click", action.onClick);
    }
  }

  parent.append(header);
  return header;
}
