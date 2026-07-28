import assert from "node:assert/strict";
import test from "node:test";

import { appendScreenHeading } from "../js/presentation/screen-heading.js";
import { collectElements, createFakeScreen } from "./helpers/fake-dom.js";

test("T-008A S-001 appends the requested kicker and title with an optional title class", () => {
  const { host } = createFakeScreen();

  const heading = appendScreenHeading(host, {
    kicker: "診断をはじめる",
    title: "あなたの傾向を見てみましょう",
    titleClassName: "start-screen-title",
  });

  assert.equal(heading.tagName, "header");
  assert.equal(heading.className, "screen-heading");
  assert.deepEqual(
    collectElements(heading).slice(1).map(({ tagName, textContent, className }) => ({
      tagName,
      textContent,
      className,
    })),
    [
      { tagName: "p", textContent: "診断をはじめる", className: "screen-kicker" },
      {
        tagName: "h1",
        textContent: "あなたの傾向を見てみましょう",
        className: "screen-title start-screen-title",
      },
    ],
  );
});
