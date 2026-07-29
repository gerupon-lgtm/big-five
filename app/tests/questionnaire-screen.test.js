import assert from "node:assert/strict";
import test from "node:test";

import { renderQuestionnaireScreen } from "../js/presentation/questionnaire-screen.js";
import { collectElements, collectText, createFakeScreen } from "./helpers/fake-dom.js";

function questionViewModel(overrides = {}) {
  return {
    phase: "question",
    questionId: "ipip-001",
    questionText: "にぎやかな集まりが好きだ",
    currentIndex: 0,
    totalCount: 20,
    selectedValue: null,
    storageStatus: "ok",
    ...overrides,
  };
}

function questionActions(overrides = {}) {
  return {
    onAnswer() {},
    onBack() {},
    onPause() {},
    onDiscard() {},
    ...overrides,
  };
}

function previewActions(overrides = {}) {
  return {
    onPreviewDecision() {},
    onBack() {},
    onPause() {},
    onDiscard() {},
    ...overrides,
  };
}

function previewViewModel(overrides = {}) {
  return {
    phase: "preview-choice",
    storageStatus: "ok",
    ...overrides,
  };
}

function buttons(host) {
  return collectElements(host).filter(({ tagName }) => tagName === "button");
}

test("T-004 S-002 renders one question with natural five-point labels and current position", () => {
  const { host } = createFakeScreen();

  renderQuestionnaireScreen(
    host,
    questionViewModel({ currentIndex: 6, selectedValue: 4 }),
    questionActions(),
  );

  const text = collectText(host);
  assert.match(text, /7 \/ 20問/);
  assert.match(text, /にぎやかな集まりが好きだ/);
  const heading = collectElements(host)
    .find(({ className }) => className === "screen-heading");
  assert.ok(heading);
  assert.match(collectText(heading), /7 \/ 20問/);
  assert.match(collectText(heading), /にぎやかな集まりが好きだ/);
  assert.deepEqual(
    buttons(host)
      .filter(({ className }) => className.includes("answer-option"))
      .map(({ textContent }) => textContent),
    [
      "1 まったく当てはまらない",
      "2 あまり当てはまらない",
      "3 どちらともいえない",
      "4 やや当てはまる",
      "5 とても当てはまる",
    ],
  );
  const selected = buttons(host).find(
    ({ textContent }) => textContent === "4 やや当てはまる",
  );
  assert.equal(selected.attributes.get("aria-pressed"), "true");
  assert.match(text, /前へ/);
  assert.match(text, /回答を破棄/);
  assert.doesNotMatch(text, /ipip-001|questionId|selectedValue|storageStatus/);
});

test("T-008A F-004 delegates answer, back, pause, and discard as separate actions", () => {
  const { host } = createFakeScreen();
  const calls = [];

  renderQuestionnaireScreen(host, questionViewModel({ currentIndex: 1 }), questionActions({
    onAnswer: (answer) => calls.push(["answer", answer]),
    onBack: () => calls.push(["back"]),
    onPause: () => calls.push(["pause"]),
    onDiscard: () => calls.push(["discard"]),
  }));

  buttons(host)
    .find(({ textContent }) => textContent === "5 とても当てはまる")
    .dispatch("click");
  buttons(host).find(({ textContent }) => textContent === "前へ").dispatch("click");
  buttons(host)
    .find(({ textContent }) => textContent === "中断してトップへ")
    .dispatch("click");
  buttons(host).find(({ textContent }) => textContent === "回答を破棄").dispatch("click");

  assert.deepEqual(calls, [
    ["answer", { questionId: "ipip-001", value: 5 }],
    ["back"],
    ["pause"],
    ["discard"],
  ]);
});

test("T-004 F-003 disables back navigation on the first question only", () => {
  for (const [currentIndex, expectedDisabled] of [[0, true], [1, false]]) {
    const { host } = createFakeScreen();

    renderQuestionnaireScreen(
      host,
      questionViewModel({ currentIndex }),
      questionActions(),
    );

    assert.equal(
      buttons(host).find(({ textContent }) => textContent === "前へ").disabled,
      expectedDisabled,
    );
  }
});

test("T-004 F-004 announces only storage failure and keeps the questionnaire usable", () => {
  const okScreen = createFakeScreen();
  renderQuestionnaireScreen(okScreen.host, questionViewModel(), questionActions());
  assert.equal(
    collectElements(okScreen.host)
      .filter(({ attributes }) => attributes.get("role") === "status").length,
    0,
  );
  assert.doesNotMatch(collectText(okScreen.host), /保存できません|保存不可/);

  const errorScreen = createFakeScreen();
  renderQuestionnaireScreen(
    errorScreen.host,
    questionViewModel({ storageStatus: "error" }),
    questionActions(),
  );

  const alerts = collectElements(errorScreen.host)
    .filter(({ attributes }) => attributes.get("role") === "alert");
  assert.equal(alerts.length, 1);
  assert.match(
    collectText(alerts[0]),
    /この環境では回答を保存できません。同じ画面を開いている間は、そのまま回答を続けられます。/,
  );
  assert.equal(
    buttons(errorScreen.host)
      .filter(({ className }) => className.includes("answer-option"))
      .every(({ disabled }) => disabled === false),
    true,
  );
});

test("T-004 S-002 renders the 20-question decision before exposing any result", () => {
  const { host } = createFakeScreen();

  renderQuestionnaireScreen(host, previewViewModel(), previewActions());

  const text = collectText(host);
  const heading = collectElements(host)
    .find(({ className }) => className === "screen-heading");
  assert.ok(heading);
  assert.match(collectText(heading), /20 \/ 20問/);
  assert.match(collectText(heading), /20問の回答が完了しました/);
  assert.match(text, /20問の回答が完了しました/);
  assert.match(text, /20問の簡易プレビューを見る/);
  assert.match(text, /結果を見ずに、あと30問続ける/);
  assert.match(text, /回答へ戻る/);
  assert.match(text, /回答を破棄/);
  assert.doesNotMatch(
    text,
    /設問|因子|スコア|称号|猫|色|character|palette|rawMean|displayScore/,
  );
});

test("T-004 S-002 delegates both preview decisions without adding hidden result data", () => {
  for (const [label, decision] of [
    ["20問の簡易プレビューを見る", "showPreview"],
    ["結果を見ずに、あと30問続ける", "continueHidden"],
  ]) {
    const { host } = createFakeScreen();
    const calls = [];

    renderQuestionnaireScreen(host, previewViewModel(), previewActions({
      onPreviewDecision: (selected) => calls.push(selected),
    }));
    buttons(host).find(({ textContent }) => textContent === label).dispatch("click");

    assert.deepEqual(calls, [decision]);
    assert.doesNotMatch(
      collectText(host),
      /titleId|characterId|factorId|rawMean|displayScore|paletteId/,
    );
  }
});

test("T-008A F-004 delegates back, pause, and discard from the preview decision", () => {
  const { host } = createFakeScreen();
  const calls = [];

  renderQuestionnaireScreen(host, previewViewModel(), previewActions({
    onBack: () => calls.push("back"),
    onPause: () => calls.push("pause"),
    onDiscard: () => calls.push("discard"),
  }));

  buttons(host).find(({ textContent }) => textContent === "回答へ戻る").dispatch("click");
  buttons(host)
    .find(({ textContent }) => textContent === "中断してトップへ")
    .dispatch("click");
  buttons(host).find(({ textContent }) => textContent === "回答を破棄").dispatch("click");

  assert.deepEqual(calls, ["back", "pause", "discard"]);
});

test("T-004 S-002 renders every control as a non-submit button", () => {
  for (const [viewModel, actions] of [
    [questionViewModel(), questionActions()],
    [previewViewModel(), previewActions()],
  ]) {
    const { host } = createFakeScreen();
    renderQuestionnaireScreen(host, viewModel, actions);
    assert.ok(buttons(host).length > 0);
    assert.equal(
      buttons(host).every(({ attributes }) => attributes.get("type") === "button"),
      true,
    );
  }
});

test("T-008A S-002 uses the shared standard header action and keeps discard in secondary management", () => {
  for (const [viewModel, actions] of [
    [questionViewModel(), questionActions()],
    [previewViewModel(), previewActions()],
  ]) {
    const { host } = createFakeScreen();
    renderQuestionnaireScreen(host, viewModel, actions);

    const header = collectElements(host)
      .find(({ className }) => className === "app-header");
    assert.ok(header);
    assert.equal(
      collectElements(host)
        .filter(({ className }) => className === "app-header is-sticky").length,
      0,
    );
    assert.equal(
      collectElements(header)
        .find(({ className }) => className === "app-header-action")
        .textContent,
      "中断してトップへ",
    );
    const management = collectElements(host)
      .find(({ className }) => className === "questionnaire-management");
    assert.ok(management);
    assert.equal(management.tagName, "details");
    assert.match(collectText(management), /その他の操作 回答を破棄/);
  }
});

test("T-004 S-002 rejects malformed exact view models and action dependencies", () => {
  const { host } = createFakeScreen();
  const invalidCalls = [
    () => renderQuestionnaireScreen(
      host,
      questionViewModel({ currentIndex: -1 }),
      questionActions(),
    ),
    () => renderQuestionnaireScreen(
      host,
      questionViewModel({ selectedValue: 6 }),
      questionActions(),
    ),
    () => renderQuestionnaireScreen(
      host,
      { ...questionViewModel(), titleId: "must-not-enter-presentation" },
      questionActions(),
    ),
    () => renderQuestionnaireScreen(
      host,
      { ...previewViewModel(), score: 80 },
      previewActions(),
    ),
    () => renderQuestionnaireScreen(
      host,
      questionViewModel(),
      { ...questionActions(), onAnswer: null },
    ),
    () => renderQuestionnaireScreen(
      host,
      previewViewModel(),
      { ...previewActions(), onPreviewDecision: undefined },
    ),
    () => {
      const { onPause: _onPause, ...missingPause } = questionActions();
      return renderQuestionnaireScreen(host, questionViewModel(), missingPause);
    },
    () => renderQuestionnaireScreen(
      host,
      questionViewModel(),
      { ...questionActions(), onUnexpectedAction() {} },
    ),
    () => {
      const { onPause: _onPause, ...missingPause } = previewActions();
      return renderQuestionnaireScreen(host, previewViewModel(), missingPause);
    },
    () => renderQuestionnaireScreen(
      host,
      previewViewModel(),
      { ...previewActions(), onUnexpectedAction() {} },
    ),
  ];

  for (const call of invalidCalls) {
    assert.throws(call, {
      name: "TypeError",
      message: "QUESTIONNAIRE_SCREEN_INVALID",
    });
  }
});

test("T-004 F-004 keeps both preview decisions usable when the twentieth answer cannot be saved", () => {
  const okScreen = createFakeScreen();
  renderQuestionnaireScreen(
    okScreen.host,
    previewViewModel(),
    previewActions(),
  );
  assert.equal(
    collectElements(okScreen.host)
      .filter(({ attributes }) => attributes.get("role") === "status").length,
    0,
  );
  assert.equal(
    collectElements(okScreen.host)
      .filter(({ attributes }) => attributes.get("role") === "alert").length,
    0,
  );

  const errorScreen = createFakeScreen();
  renderQuestionnaireScreen(
    errorScreen.host,
    previewViewModel({ storageStatus: "error" }),
    previewActions(),
  );

  const alerts = collectElements(errorScreen.host)
    .filter(({ attributes }) => attributes.get("role") === "alert");
  assert.equal(alerts.length, 1);
  assert.match(
    collectText(alerts[0]),
    /この環境では回答を保存できません。同じ画面を開いている間は、そのまま回答を続けられます。/,
  );
  assert.equal(
    buttons(errorScreen.host)
      .filter(({ textContent }) =>
        textContent === "20問の簡易プレビューを見る"
        || textContent === "結果を見ずに、あと30問続ける")
      .every(({ disabled }) => disabled === false),
    true,
  );
});
