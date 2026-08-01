import { appendAppHeader } from "./app-header.js";
import { appendScreenHeading } from "./screen-heading.js";
import { appendTextElement } from "./screen-helpers.js";

const VIEWS = new Set(["card", "details", "zoom"]);

function appendButton(parent, label, className, onClick) {
  const button = appendTextElement(parent, "button", label, className);
  button.setAttribute("type", "button");
  button.addEventListener("click", onClick);
  return button;
}

function appendPreview(parent, model, imageUrl, zoom = false) {
  const image = parent.ownerDocument.createElement("img");
  image.className = zoom
    ? "share-card-preview share-card-preview--zoom"
    : "share-card-preview";
  image.setAttribute("src", imageUrl);
  image.setAttribute("alt", `${model.titleLabel}の共有カード`);
  image.setAttribute("width", String(model.width));
  image.setAttribute("height", String(model.height));
  parent.append(image);
  return image;
}

function appendTextFallback(parent, model) {
  const section = parent.ownerDocument.createElement("section");
  section.className = "share-text-section";
  appendTextElement(section, "h2", "共有されるテキスト");
  const fallback = appendTextElement(
    section,
    "pre",
    model.shareText,
    "share-text-fallback",
  );
  fallback.setAttribute("tabindex", "0");
  parent.append(section);
}

function appendDeliveryActions(parent, model, actions, capabilities, hasImage) {
  const controls = parent.ownerDocument.createElement("div");
  controls.className = "share-delivery-actions";
  if (hasImage && capabilities.fileShare && typeof actions.onShare === "function") {
    appendButton(controls, "画像を共有する", "primary-button", () =>
      actions.onShare());
  }
  if (hasImage && capabilities.download && typeof actions.onDownload === "function") {
    appendButton(controls, "PNGを保存する", "secondary-button", () =>
      actions.onDownload());
  }
  if (capabilities.clipboard && typeof actions.onCopyText === "function") {
    appendButton(controls, "テキストをコピーする", "secondary-button", () =>
      actions.onCopyText(model.shareText));
  }
  parent.append(controls);
}

export function renderShareScreen(host, model, actions = {}, dependencies = {}) {
  if (!host ||
    !model ||
    model.width !== 1080 ||
    model.height !== 1800 ||
    typeof model.titleLabel !== "string" ||
    typeof model.shareText !== "string") {
    throw new TypeError("SHARE_SCREEN_INVALID");
  }
  const imageUrl = typeof dependencies.imageUrl === "string" &&
    dependencies.imageUrl.length > 0
    ? dependencies.imageUrl
    : null;
  const capabilities = {
    fileShare: dependencies.capabilities?.fileShare === true,
    download: dependencies.capabilities?.download === true,
    clipboard: dependencies.capabilities?.clipboard === true,
  };
  let view = imageUrl ? "card" : "details";

  function show(nextView) {
    if (!VIEWS.has(nextView) || (!imageUrl && nextView !== "details")) return;
    view = nextView;
    const documentObject = host.ownerDocument ?? document;
    const main = documentObject.createElement("main");
    main.className = `app-shell share-screen share-screen--${view}`;
    main.setAttribute("data-share-view", view);
    appendAppHeader(main);
    appendScreenHeading(main, {
      kicker: "SHARE PREVIEW",
      title: "共有内容を確認",
    });

    if (!imageUrl) {
      appendTextElement(
        main,
        "p",
        "画像を生成できませんでした。下のテキストは選択して利用できます。",
        "notice error-notice",
      ).setAttribute("role", "alert");
    }

    const pane = documentObject.createElement("section");
    pane.className = `share-card-pane share-card-pane--${view}`;
    if (view === "card") {
      appendPreview(pane, model, imageUrl);
      const viewActions = documentObject.createElement("div");
      viewActions.className = "share-view-actions";
      appendButton(viewActions, "共有内容を見る", "secondary-button", () =>
        show("details"));
      appendButton(viewActions, "拡大して見る", "secondary-button", () =>
        show("zoom"));
      pane.append(viewActions);
    } else if (view === "zoom") {
      appendPreview(pane, model, imageUrl, true);
      appendButton(pane, "カードへ戻る", "secondary-button", () =>
        show("card"));
    } else {
      if (imageUrl) appendPreview(pane, model, imageUrl);
      appendTextFallback(pane, model);
      if (imageUrl) {
        appendButton(pane, "カードへ戻る", "secondary-button", () =>
          show("card"));
      }
    }
    main.append(pane);
    appendDeliveryActions(main, model, actions, capabilities, imageUrl !== null);
    if (typeof actions.onBackToResult === "function") {
      appendButton(main, "結果へ戻る", "secondary-button share-back-button", () =>
        actions.onBackToResult());
    }
    host.replaceChildren(main);
  }

  show(view);
}
