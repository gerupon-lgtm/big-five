import assert from "node:assert/strict";
import test from "node:test";

import { appendAppHeader } from "../js/presentation/app-header.js";
import { collectElements, createFakeScreen } from "./helpers/fake-dom.js";

test("T-008A S-001 renders the official app name at its intentional wrap boundary", () => {
  const { host } = createFakeScreen();

  const header = appendAppHeader(host, {
    screenLabel: "回答中",
    sticky: true,
  });

  assert.equal(header.className, "app-header is-sticky");
  assert.deepEqual(
    collectElements(header)
      .filter(({ className }) => className === "app-brand-part")
      .map(({ textContent }) => textContent),
    ["Big Five｜", "自己理解支援ツール"],
  );
  assert.equal(
    collectElements(header)
      .find(({ className }) => className === "app-brand")
      .tagName,
    "div",
  );
  assert.equal(
    collectElements(header)
      .find(({ className }) => className === "app-screen-label")
      .textContent,
    "回答中",
  );
});

test("T-008A S-001 delegates the optional header action once as a non-submit button", () => {
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
