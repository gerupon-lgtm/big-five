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
    this.open = false;
    this.inert = false;
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

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  dispatch(type, eventInit = {}) {
    const event = {
      ...eventInit,
      currentTarget: this,
      target: eventInit.target ?? this,
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };
    this.listeners.get(type)?.(event);
    return event;
  }

  showModal() {
    this.open = true;
    this.setAttribute("open", "");
  }

  close() {
    this.open = false;
    this.removeAttribute("open");
    this.dispatch("close");
  }

  focus() {
    this.ownerDocument.activeElement = this;
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
