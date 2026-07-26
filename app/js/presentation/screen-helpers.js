export function appendTextElement(parent, tagName, text, className) {
  const documentObject = parent.ownerDocument ?? document;
  const element = documentObject.createElement(tagName);
  element.textContent = text;
  if (className) element.className = className;
  parent.append(element);
  return element;
}

export function formatCompletedAt(completedAt) {
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(completedAt));
  } catch {
    return completedAt;
  }
}
