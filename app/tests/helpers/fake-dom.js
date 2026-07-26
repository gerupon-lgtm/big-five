export class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName;
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.textContent = "";
    this.className = "";
    this.disabled = false;
    this.hidden = false;
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

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  dispatch(type) {
    this.listeners.get(type)?.({ currentTarget: this });
  }

  get lastElementChild() {
    return this.children.at(-1) ?? null;
  }
}

export function collectElements(element) {
  return [element, ...element.children.flatMap(collectElements)];
}

export function collectText(element) {
  return collectElements(element).map(({ textContent }) => textContent).join(" ");
}

export function createFakeScreen() {
  const documentObject = {
    createElement(tagName) {
      return new FakeElement(tagName, documentObject);
    },
  };
  return {
    documentObject,
    host: new FakeElement("div", documentObject),
  };
}
