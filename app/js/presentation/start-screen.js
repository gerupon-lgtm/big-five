function appendTextElement(parent, tagName, text, className) {
  const documentObject = parent.ownerDocument ?? document;
  const element = documentObject.createElement(tagName);
  element.textContent = text;
  if (className) {
    element.className = className;
  }
  parent.append(element);
  return element;
}

export function renderStartScreen(host, versionModel) {
  const documentObject = host.ownerDocument ?? document;
  const main = documentObject.createElement("main");
  main.className = "app-shell";

  const headingGroup = documentObject.createElement("header");
  headingGroup.className = "hero";
  appendTextElement(
    headingGroup,
    "p",
    "BIG FIVE · SELF UNDERSTANDING",
    "eyebrow",
  );
  appendTextElement(
    headingGroup,
    "h1",
    "Big Five自己理解支援ツール",
  );
  appendTextElement(
    headingGroup,
    "p",
    "5つの特性から、今の自分らしい傾向を丁寧に読み解くためのWebツールです。",
    "lead",
  );

  const status = documentObject.createElement("section");
  status.className = "status-card";
  status.setAttribute("aria-labelledby", "build-status-title");
  const statusTitle = appendTextElement(
    status,
    "h2",
    "正式版MVPを準備中です",
  );
  statusTitle.id = "build-status-title";
  appendTextElement(
    status,
    "p",
    "現在は開始画面と版管理の基盤を構築しています。診断機能は今後のタスクで追加します。",
  );

  appendTextElement(main, "p", versionModel.versionLabel, "version");
  main.prepend(headingGroup);
  main.insertBefore(status, main.lastElementChild);
  host.replaceChildren(main);
}
