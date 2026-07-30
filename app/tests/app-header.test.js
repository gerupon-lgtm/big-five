import assert from "node:assert/strict";
import test from "node:test";

import { appendAppHeader } from "../js/presentation/app-header.js";
import { collectElements, collectText, createFakeScreen } from "./helpers/fake-dom.js";

test("T-007 F-001 renders the canonical decorative brand mark and screen copy", () => {
  const { host } = createFakeScreen();

  const header = appendAppHeader(host, {
    sticky: true,
  });

  assert.equal(header.className, "app-header is-sticky");
  assert.deepEqual(
    collectElements(header)
      .filter(({ className }) => className === "app-brand-name" || className === "app-brand-subtitle")
      .map(({ textContent }) => textContent),
    ["ココロパレア", "Big Five 自己理解支援ツール"],
  );
  const mark = collectElements(header)
    .find(({ className }) => className === "app-mark");
  assert.equal(mark.tagName, "img");
  assert.equal(mark.getAttribute("src"), "./assets/brand/kokoro-parea-mark.svg");
  assert.equal(mark.getAttribute("alt"), "");
  assert.equal(mark.getAttribute("width"), "120");
  assert.equal(mark.getAttribute("height"), "120");
  assert.doesNotMatch(
    collectText(header),
    /Big Five 自己理解チェック|BIG FIVE SELF UNDERSTANDING|^5$/,
  );
  assert.equal(
    collectElements(header)
      .find(({ className }) => className === "app-brand")
      .tagName,
    "div",
  );
  assert.equal(
    collectElements(header)
      .filter(({ className }) => className === "app-screen-label")
      .length,
    0,
  );
});

test("T-008A S-001 delegates a button action once as a non-submit button", () => {
  const { host } = createFakeScreen();
  let pauses = 0;

  const header = appendAppHeader(host, {
    action: {
      label: "中断してトップへ",
      onClick() {
        pauses += 1;
      },
    },
  });

  const action = collectElements(header)
    .find(({ className }) => className === "app-header-action");
  assert.ok(action);
  assert.equal(action.tagName, "button");
  assert.equal(action.attributes.get("type"), "button");
  action.dispatch("click");
  assert.equal(pauses, 1);
});

test("T-008A S-001 renders a link action with its destination", () => {
  const { host } = createFakeScreen();

  const header = appendAppHeader(host, {
    action: {
      label: "履歴を見る",
      href: "#/history",
    },
  });

  const action = collectElements(header)
    .find(({ className }) => className === "app-header-action");
  assert.ok(action);
  assert.equal(action.tagName, "a");
  assert.equal(action.attributes.get("href"), "#/history");
});
