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
