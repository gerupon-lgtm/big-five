import { appendAppHeader } from "./app-header.js";
import { appendScreenHeading } from "./screen-heading.js";
import { appendTextElement } from "./screen-helpers.js";

const ANSWER_OPTIONS = Object.freeze([
  Object.freeze({ value: 1, label: "1 まったく当てはまらない" }),
  Object.freeze({ value: 2, label: "2 あまり当てはまらない" }),
  Object.freeze({ value: 3, label: "3 どちらともいえない" }),
  Object.freeze({ value: 4, label: "4 やや当てはまる" }),
  Object.freeze({ value: 5, label: "5 とても当てはまる" }),
]);

const QUESTION_KEYS = Object.freeze([
  "phase",
  "questionId",
  "questionText",
  "currentIndex",
  "totalCount",
  "selectedValue",
  "storageStatus",
]);
const PREVIEW_KEYS = Object.freeze(["phase", "storageStatus"]);
const QUESTION_ACTION_KEYS = Object.freeze([
  "onAnswer",
  "onBack",
  "onPause",
  "onDiscard",
]);
const PREVIEW_ACTION_KEYS = Object.freeze([
  "onPreviewDecision",
  "onBack",
  "onPause",
  "onDiscard",
]);

function hasExactKeys(value, expectedKeys) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const actualKeys = Object.keys(value).sort();
  const sortedExpectedKeys = [...expectedKeys].sort();
  return actualKeys.length === sortedExpectedKeys.length
    && actualKeys.every((key, index) => key === sortedExpectedKeys[index]);
}

function hasRequiredActions(actions, expectedKeys) {
  return hasExactKeys(actions, expectedKeys)
    && expectedKeys.every((key) => typeof actions[key] === "function");
}

function isQuestionViewModel(viewModel) {
  return hasExactKeys(viewModel, QUESTION_KEYS)
    && viewModel.phase === "question"
    && typeof viewModel.questionId === "string"
    && viewModel.questionId.length > 0
    && typeof viewModel.questionText === "string"
    && viewModel.questionText.length > 0
    && Number.isInteger(viewModel.currentIndex)
    && viewModel.currentIndex >= 0
    && Number.isInteger(viewModel.totalCount)
    && (viewModel.totalCount === 20 || viewModel.totalCount === 50)
    && viewModel.currentIndex < viewModel.totalCount
    && (
      viewModel.selectedValue === null
      || (
        Number.isInteger(viewModel.selectedValue)
        && viewModel.selectedValue >= 1
        && viewModel.selectedValue <= 5
      )
    )
    && (viewModel.storageStatus === "ok" || viewModel.storageStatus === "error");
}

function isPreviewViewModel(viewModel) {
  return hasExactKeys(viewModel, PREVIEW_KEYS)
    && viewModel.phase === "preview-choice"
    && (viewModel.storageStatus === "ok" || viewModel.storageStatus === "error");
}

function addButton(parent, label, className, onClick) {
  const button = appendTextElement(parent, "button", label, className);
  button.setAttribute("type", "button");
  button.addEventListener("click", onClick);
  return button;
}

function renderStorageError(parent) {
  const alert = appendTextElement(
    parent,
    "p",
    "この環境では回答を保存できません。同じ画面を開いている間は、そのまま回答を続けられます。",
    "notice error-notice questionnaire-storage-error",
  );
  alert.setAttribute("role", "alert");
}

function renderQuestion(main, viewModel, actions) {
  appendAppHeader(main, {
    sticky: true,
    action: {
      label: "中断してトップへ",
      onClick: actions.onPause,
    },
  });
  appendScreenHeading(main, {
    kicker: `${viewModel.currentIndex + 1} / ${viewModel.totalCount}問`,
    title: viewModel.questionText,
    titleClassName: "questionnaire-question",
  });

  const options = main.ownerDocument.createElement("div");
  options.className = "answer-options";
  options.setAttribute("role", "group");
  options.setAttribute("aria-label", "回答を選択");
  for (const option of ANSWER_OPTIONS) {
    const button = addButton(
      options,
      option.label,
      "answer-option",
      () => actions.onAnswer({
        questionId: viewModel.questionId,
        value: option.value,
      }),
    );
    button.setAttribute(
      "aria-pressed",
      option.value === viewModel.selectedValue ? "true" : "false",
    );
  }
  main.append(options);

  if (viewModel.storageStatus === "error") {
    renderStorageError(main);
  }

  const navigation = main.ownerDocument.createElement("div");
  navigation.className = "questionnaire-navigation";
  const backButton = addButton(
    navigation,
    "前へ",
    "secondary-button",
    actions.onBack,
  );
  backButton.disabled = viewModel.currentIndex === 0;
  main.append(navigation);

  const management = main.ownerDocument.createElement("details");
  management.className = "questionnaire-management";
  appendTextElement(management, "summary", "その他の操作");
  addButton(management, "回答を破棄", "danger-button", actions.onDiscard);
  main.append(management);
}

function renderPreviewChoice(main, viewModel, actions) {
  appendAppHeader(main, {
    sticky: true,
    action: {
      label: "中断してトップへ",
      onClick: actions.onPause,
    },
  });
  appendScreenHeading(main, {
    kicker: "20 / 20問",
    title: "20問の回答が完了しました",
    titleClassName: "preview-choice-title",
  });
  appendTextElement(
    main,
    "p",
    "ここで短い振り返りを見るか、表示せずに残りへ進むかを選べます。",
    "lead compact-lead",
  );

  if (viewModel.storageStatus === "error") {
    renderStorageError(main);
  }

  const decisions = main.ownerDocument.createElement("div");
  decisions.className = "preview-decision-actions";
  addButton(
    decisions,
    "20問の簡易プレビューを見る",
    "primary-button",
    () => actions.onPreviewDecision("showPreview"),
  );
  addButton(
    decisions,
    "結果を見ずに、あと30問続ける",
    "secondary-button",
    () => actions.onPreviewDecision("continueHidden"),
  );
  main.append(decisions);

  const navigation = main.ownerDocument.createElement("div");
  navigation.className = "questionnaire-navigation";
  addButton(navigation, "回答へ戻る", "secondary-button", actions.onBack);
  main.append(navigation);

  const management = main.ownerDocument.createElement("details");
  management.className = "questionnaire-management";
  appendTextElement(management, "summary", "その他の操作");
  addButton(management, "回答を破棄", "danger-button", actions.onDiscard);
  main.append(management);
}

export function renderQuestionnaireScreen(host, viewModel, actions) {
  const valid = isQuestionViewModel(viewModel)
    ? hasRequiredActions(actions, QUESTION_ACTION_KEYS)
    : isPreviewViewModel(viewModel)
      && hasRequiredActions(actions, PREVIEW_ACTION_KEYS);
  if (
    !valid
    || host === null
    || typeof host !== "object"
    || typeof host.replaceChildren !== "function"
  ) {
    throw new TypeError("QUESTIONNAIRE_SCREEN_INVALID");
  }

  const documentObject = host.ownerDocument ?? document;
  const main = documentObject.createElement("main");
  main.className = "app-shell questionnaire-screen";

  if (viewModel.phase === "question") {
    renderQuestion(main, viewModel, actions);
  } else {
    renderPreviewChoice(main, viewModel, actions);
  }
  host.replaceChildren(main);
}
