import test from "node:test";
import assert from "node:assert/strict";
import { initialState, transition } from "../state-machine.js";

test("manual flow stops at the 20-item basic result", () => {
  let state = transition(initialState(), { type: "START", mode: "manual" });
  for (let index = 0; index < 20; index += 1) {
    state = transition(state, { type: "ANSWER", questionId: `Q${index}`, value: 3 });
  }
  assert.equal(state.screen, "basicResult");
  assert.equal(state.currentIndex, 20);
});

test("continuation reaches the detailed result after 50 answers", () => {
  let state = { ...initialState(), screen: "basicResult", currentIndex: 20 };
  state = transition(state, { type: "CONTINUE" });
  for (let index = 20; index < 50; index += 1) {
    state = transition(state, { type: "ANSWER", questionId: `Q${index}`, value: 4 });
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
