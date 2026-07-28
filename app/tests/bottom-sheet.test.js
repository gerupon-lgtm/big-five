import assert from "node:assert/strict";
import test from "node:test";

import { appendBottomSheetLauncher } from "../js/presentation/bottom-sheet.js";
import {
  collectElements,
  collectText,
  createFakeScreen,
} from "./helpers/fake-dom.js";

test("T-008A F-008 opens and closes one accessible bottom sheet", () => {
  const { host } = createFakeScreen();
  const launcher = appendBottomSheetLauncher(host, {
    id: "method-basis",
    label: "測定の土台",
    title: "測定の土台",
    body: "Big Fiveの5因子を測定の土台にしています。",
  });
  const dialog = collectElements(host).find(
    ({ tagName }) => tagName === "dialog",
  );
  const close = collectElements(host).find(
    ({ tagName, textContent }) =>
      tagName === "button" && textContent === "閉じる",
  );

  assert.ok(dialog);
  assert.equal(
    collectElements(host).filter(
      ({ tagName, textContent }) =>
        tagName === "button" && textContent === "測定の土台",
    ).length,
    1,
  );
  assert.equal(launcher.attributes.get("aria-expanded"), "false");
  assert.equal(dialog.attributes.has("open"), false);
  assert.match(collectText(dialog), /Big Fiveの5因子/);

  launcher.dispatch("click");
  assert.equal(launcher.attributes.get("aria-expanded"), "true");
  assert.equal(dialog.attributes.has("open"), true);

  close.dispatch("click");
  assert.equal(launcher.attributes.get("aria-expanded"), "false");
  assert.equal(dialog.attributes.has("open"), false);
});

test("T-008A F-015 rejects incomplete bottom sheet input", () => {
  const { host } = createFakeScreen();

  assert.throws(
    () => appendBottomSheetLauncher(host, {
      id: "",
      label: "測定の土台",
      title: "測定の土台",
      body: "説明",
    }),
    /BOTTOM_SHEET_INVALID/,
  );
});

test("T-008A F-008 handles native cancel as Escape and restores launcher state", () => {
  const { host } = createFakeScreen();
  const launcher = appendBottomSheetLauncher(host, {
    id: "method-limitations",
    label: "この結果の限界",
    title: "この結果の限界",
    body: "結果を解釈するときの限界です。",
  });
  const dialog = collectElements(host).find(
    ({ tagName }) => tagName === "dialog",
  );

  launcher.dispatch("click");
  const event = dialog.dispatch("cancel");

  assert.equal(event.defaultPrevented, true);
  assert.equal(dialog.open, false);
  assert.equal(dialog.attributes.has("open"), false);
  assert.equal(launcher.attributes.get("aria-expanded"), "false");
  assert.equal(host.ownerDocument.activeElement, launcher);
});

test("T-008A F-008 closes once on keydown Escape even when close dispatches synchronously", () => {
  const { host } = createFakeScreen();
  const launcher = appendBottomSheetLauncher(host, {
    id: "method-sources",
    label: "出典・利用条件",
    title: "出典・利用条件",
    body: "尺度の出典と利用条件です。",
  });
  const dialog = collectElements(host).find(
    ({ tagName }) => tagName === "dialog",
  );
  const nativeClose = dialog.close.bind(dialog);
  let closeCalls = 0;
  let focusCalls = 0;
  dialog.close = () => {
    closeCalls += 1;
    nativeClose();
  };
  launcher.focus = () => {
    focusCalls += 1;
    host.ownerDocument.activeElement = launcher;
  };

  launcher.dispatch("click");
  const event = dialog.dispatch("keydown", { key: "Escape" });

  assert.equal(event.defaultPrevented, true);
  assert.equal(dialog.open, false);
  assert.equal(launcher.attributes.get("aria-expanded"), "false");
  assert.equal(closeCalls, 1);
  assert.equal(focusCalls, 1);

  dialog.dispatch("cancel");
  assert.equal(closeCalls, 1);
  assert.equal(focusCalls, 1);
});
