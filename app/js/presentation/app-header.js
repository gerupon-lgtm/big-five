import { appMeta } from "../config/app-meta.js";
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
  const mark = documentObject.createElement("img");
  mark.className = "app-mark";
  mark.setAttribute("src", appMeta.brand.iconPath);
  mark.setAttribute("alt", "");
  mark.setAttribute("width", "120");
  mark.setAttribute("height", "120");
  brand.append(mark);
  const brandCopy = documentObject.createElement("span");
  brandCopy.className = "app-brand-copy";
  appendTextElement(brandCopy, "span", appMeta.brand.name, "app-brand-name");
  appendTextElement(brandCopy, "span", appMeta.brand.subtitle, "app-brand-subtitle");
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
