import assert from "node:assert/strict";
import test from "node:test";

import { startApp } from "../js/main.js";

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName;
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.attributes = new Map();
    this.textContent = "";
  }

  append(child) {
    this.children.push(child);
  }

  prepend(child) {
    this.children.unshift(child);
  }

  insertBefore(child, reference) {
    const index = this.children.indexOf(reference);
    this.children.splice(index < 0 ? this.children.length : index, 0, child);
  }

  replaceChildren(...children) {
    this.children = children;
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  get lastElementChild() {
    return this.children.at(-1) ?? null;
  }
}

function collectText(element) {
  return [element.textContent, ...element.children.map(collectText)].join(" ");
}

test("startApp renders the start heading and canonical version from a hash route", () => {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
    getElementById(id) {
      return id === "app" ? host : null;
    },
  };
  const host = new FakeElement("div", documentObject);
  const windowObject = {
    location: { hash: "#/start" },
    addEventListener() {},
  };
  const historyObject = {
    replaceState() {
      throw new Error("canonical route must not be replaced");
    },
  };

  startApp({ documentObject, historyObject, windowObject });

  const renderedText = collectText(host);
  assert.match(renderedText, /Big Five自己理解支援ツール/);
  assert.match(renderedText, /バージョン mvp-0\.1\.0/);
});
