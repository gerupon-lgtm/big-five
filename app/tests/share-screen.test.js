import assert from "node:assert/strict";
import test from "node:test";

import { renderShareScreen } from "../js/presentation/share-screen.js";
import {
  collectElements,
  collectText,
  createFakeScreen,
} from "./helpers/fake-dom.js";

const MODEL = Object.freeze({
  width: 1080,
  height: 1800,
  filename: "kokoro-parea-result.png",
  titleLabel: "五つの風を見渡す観測者",
  modeLabel: "50問 詳細結果",
  shareText: "ココロパレア\n50問 詳細結果\n五つの風を見渡す観測者",
});

function findButton(host, text) {
  return collectElements(host).find(({ tagName, textContent }) =>
    tagName === "button" && textContent === text);
}

test("T-007 S-005 starts with one fitted card and only available actions", () => {
  const { host } = createFakeScreen();
  const calls = [];

  renderShareScreen(host, MODEL, {
    onShare: () => calls.push("share"),
    onDownload: () => calls.push("download"),
    onCopyText: () => calls.push("copy"),
    onBackToResult: () => calls.push("back"),
  }, {
    imageUrl: "blob:share-card",
    capabilities: { fileShare: true, download: true, clipboard: false },
  });

  const main = collectElements(host).find(({ className }) =>
    className.includes("share-screen"));
  assert.equal(main.getAttribute("data-share-view"), "card");
  const image = collectElements(host).find(({ className }) =>
    className === "share-card-preview");
  assert.equal(image.getAttribute("src"), "blob:share-card");
  assert.equal(image.getAttribute("width"), "1080");
  assert.equal(image.getAttribute("height"), "1800");
  assert.ok(findButton(host, "共有内容を見る"));
  assert.ok(findButton(host, "拡大して見る"));
  assert.ok(findButton(host, "画像を共有する"));
  assert.ok(findButton(host, "PNGを保存する"));
  assert.equal(findButton(host, "テキストをコピーする"), undefined);

  findButton(host, "画像を共有する").dispatch("click");
  findButton(host, "PNGを保存する").dispatch("click");
  findButton(host, "結果へ戻る").dispatch("click");
  assert.deepEqual(calls, ["share", "download", "back"]);
});

test("T-007 S-005 details and zoom return to the same card without changing its URL", () => {
  const { host } = createFakeScreen();
  renderShareScreen(host, MODEL, {
    onCopyText() {},
    onBackToResult() {},
  }, {
    imageUrl: "blob:stable-card",
    capabilities: { fileShare: false, download: false, clipboard: true },
  });

  findButton(host, "共有内容を見る").dispatch("click");
  let main = collectElements(host).find(({ className }) =>
    className.includes("share-screen"));
  assert.equal(main.getAttribute("data-share-view"), "details");
  assert.match(collectText(host), /共有されるテキスト/);
  const selectable = collectElements(host).find(({ className }) =>
    className === "share-text-fallback");
  assert.equal(selectable.textContent, MODEL.shareText);
  assert.equal(selectable.getAttribute("tabindex"), "0");
  assert.ok(findButton(host, "テキストをコピーする"));

  findButton(host, "カードへ戻る").dispatch("click");
  findButton(host, "拡大して見る").dispatch("click");
  main = collectElements(host).find(({ className }) =>
    className.includes("share-screen"));
  assert.equal(main.getAttribute("data-share-view"), "zoom");
  assert.equal(
    collectElements(host)
      .find(({ className }) => className === "share-card-preview share-card-preview--zoom")
      .getAttribute("src"),
    "blob:stable-card",
  );
  findButton(host, "カードへ戻る").dispatch("click");
  main = collectElements(host).find(({ className }) =>
    className.includes("share-screen"));
  assert.equal(main.getAttribute("data-share-view"), "card");
});

test("T-007 F-015 keeps selectable text when card rendering failed", () => {
  const { host } = createFakeScreen();

  renderShareScreen(host, MODEL, {
    onBackToResult() {},
  }, {
    imageUrl: null,
    renderErrorCode: "SHARE_CANVAS_UNAVAILABLE",
    capabilities: { fileShare: false, download: false, clipboard: false },
  });

  assert.match(collectText(host), /画像を生成できませんでした/);
  const selectable = collectElements(host).find(({ className }) =>
    className === "share-text-fallback");
  assert.equal(selectable.textContent, MODEL.shareText);
  assert.ok(findButton(host, "結果へ戻る"));
  assert.equal(findButton(host, "画像を共有する"), undefined);
});
