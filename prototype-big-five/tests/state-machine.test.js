import test from "node:test";
import assert from "node:assert/strict";
import { SAMPLE_QUESTIONS } from "../sample-questions.js";
import { initialState, transition } from "../state-machine.js";

test("manual flow stops at the 20-item basic result", () => {
  let state = transition(initialState(), { type: "START", mode: "manual" });
  for (let index = 0; index < 20; index += 1) {
    state = transition(state, {
      type: "ANSWER",
      questionId: SAMPLE_QUESTIONS[index].id,
      value: 3,
    });
  }
  assert.equal(state.screen, "basicResult");
  assert.equal(state.currentIndex, 20);
});

test("continuation reaches the detailed result after 50 answers", () => {
  let state = { ...initialState(), screen: "basicResult", currentIndex: 20 };
  state = transition(state, { type: "CONTINUE" });
  for (let index = 20; index < 50; index += 1) {
    state = transition(state, {
      type: "ANSWER",
      questionId: SAMPLE_QUESTIONS[index].id,
      value: 4,
    });
  }
  assert.equal(state.screen, "detailedResult");
});

test("back navigation does not discard an existing answer", () => {
  let state = transition(initialState(), { type: "START", mode: "manual" });
  state = transition(state, { type: "ANSWER", questionId: "O1", value: 5 });
  state = transition(state, { type: "BACK" });
  assert.equal(state.answers.O1, 5);
  assert.equal(state.currentIndex, 0);
});

test("repeated or stale answers do not advance the fixed question order", () => {
  let state = transition(initialState(), { type: "START", mode: "manual" });
  state = transition(state, { type: "ANSWER", questionId: "O1", value: 3 });
  state = transition(state, { type: "ANSWER", questionId: "O1", value: 5 });
  state = transition(state, { type: "ANSWER", questionId: "E1", value: 4 });

  assert.equal(state.currentIndex, 1);
  assert.equal(state.answers.O1, 5);
  assert.equal(state.answers.E1, undefined);
});

test("answers after the detailed result leave the terminal state unchanged", () => {
  let state = transition(initialState(), { type: "START", mode: "manual" });
  for (const question of SAMPLE_QUESTIONS.slice(0, 20)) {
    state = transition(state, { type: "ANSWER", questionId: question.id, value: 3 });
  }
  state = transition(state, { type: "CONTINUE" });
  for (const question of SAMPLE_QUESTIONS.slice(20)) {
    state = transition(state, { type: "ANSWER", questionId: question.id, value: 3 });
  }
  assert.equal(state.screen, "detailedResult");

  const next = transition(state, { type: "ANSWER", questionId: "O1", value: 5 });
  assert.equal(next, state);
});

test("CONTINUE only works from the 20-item basic result", () => {
  const state = transition(initialState(), { type: "CONTINUE" });
  assert.equal(state.screen, "start");
  assert.equal(state.currentIndex, 0);
});

test("comparison selection is isolated from later event mutation", () => {
  const ids = ["first", "second"];
  const state = transition(initialState(), { type: "SHOW_COMPARE", ids });
  ids.push("third");

  assert.deepEqual(state.selectedHistoryIds, ["first", "second"]);
});
