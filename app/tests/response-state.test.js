import assert from "node:assert/strict";
import test from "node:test";

import { appMeta } from "../js/config/app-meta.js";
import { DiagnosticDefinition } from "../js/data/diagnostic-definition.js";
import {
  answerCurrent,
  choosePreviewExit,
  createProgressRecord,
  goBack,
} from "../js/domain/response-state.js";

const NOW = "2026-07-25T00:00:00.000Z";

function createProgress() {
  return createProgressRecord({
    definition: DiagnosticDefinition,
    meta: appMeta,
    progressId: "progress-1",
    now: NOW,
  });
}

test("T-004 F-003 starts at the fixed preview question and advances only its valid answer", () => {
  const progress = createProgress();

  assert.equal(progress.mode, "preview20");
  assert.equal(progress.currentIndex, 0);
  assert.deepEqual(progress.answers, {});

  const next = answerCurrent(progress, {
    questionId: DiagnosticDefinition.previewQuestionIds[0],
    value: 4,
  }, {
    definition: DiagnosticDefinition,
    meta: appMeta,
    now: "2026-07-25T00:01:00.000Z",
  });

  assert.equal(next.kind, "in-progress");
  assert.equal(next.progress.currentIndex, 1);
  assert.deepEqual(next.progress.answers, {
    [DiagnosticDefinition.previewQuestionIds[0]]: 4,
  });
});

function answerUntil(progress, count, start = 0) {
  let state = progress;
  for (let index = start; index < count; index += 1) {
    state = answerCurrent(state.progress ?? state, {
      questionId: DiagnosticDefinition.detailQuestionIds[index],
      value: (index % 5) + 1,
    }, { definition: DiagnosticDefinition, meta: appMeta, now: `2026-07-25T00:${String(index + 1).padStart(2, "0")}:00.000Z` });
  }
  return state;
}

test("T-004 F-003 rejects stale, unknown, inherited, accessor, and non-integer current answers", () => {
  const progress = createProgress();
  const currentQuestionId = DiagnosticDefinition.previewQuestionIds[0];
  const inherited = Object.create({ questionId: currentQuestionId, value: 3 });
  const accessor = { questionId: currentQuestionId };
  Object.defineProperty(accessor, "value", { enumerable: true, get: () => 3 });

  for (const answer of [
    { questionId: DiagnosticDefinition.previewQuestionIds[1], value: 3 },
    { questionId: currentQuestionId, value: 0 },
    { questionId: currentQuestionId, value: 6 },
    { questionId: currentQuestionId, value: 1.5 },
    inherited,
    accessor,
  ]) {
    assert.throws(
      () => answerCurrent(progress, answer, { definition: DiagnosticDefinition, meta: appMeta, now: NOW }),
      /RESPONSE_INVALID_INPUT/,
    );
  }

  const advanced = answerUntil(progress, 1);
  assert.throws(
    () => answerCurrent(advanced.progress, { questionId: currentQuestionId, value: 4 }, { definition: DiagnosticDefinition, meta: appMeta, now: NOW }),
    /RESPONSE_INVALID_INPUT/,
  );
});

test("T-004 F-003 preserves an earlier answer on back and replaces it without duplicate answers", () => {
  const third = answerUntil(createProgress(), 3).progress;
  const back = goBack(third, { definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:04:00.000Z" });
  const replaced = answerCurrent(back.progress, {
    questionId: DiagnosticDefinition.previewQuestionIds[2],
    value: 5,
  }, { definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:05:00.000Z" });

  assert.equal(replaced.progress.currentIndex, 3);
  assert.equal(replaced.progress.answers[DiagnosticDefinition.previewQuestionIds[2]], 5);
  assert.equal(Object.keys(replaced.progress.answers).length, 3);
});

test("T-004 F-003 permits only complete-preview exits and keeps continueHidden score-free", () => {
  const incomplete = answerUntil(createProgress(), 19).progress;
  assert.throws(
    () => choosePreviewExit(incomplete, "showPreview", { definition: DiagnosticDefinition, meta: appMeta, now: NOW }),
    /RESPONSE_INVALID_TRANSITION/,
  );

  const choice = answerUntil(incomplete, 20, 19).progress;
  const preview = choosePreviewExit(choice, "showPreview", { definition: DiagnosticDefinition, meta: appMeta, now: NOW });
  const hidden = choosePreviewExit(choice, "continueHidden", { definition: DiagnosticDefinition, meta: appMeta, now: NOW });

  assert.equal(preview.kind, "preview-ready");
  assert.equal(preview.progress.previewDecision, "showPreview");
  assert.equal("answers" in preview, false);
  assert.equal(hidden.kind, "detail-continued");
  assert.equal(hidden.progress.mode, "detail50");
  assert.equal(hidden.progress.currentIndex, 20);
  assert.equal(hidden.progress.previewDecision, "continueHidden");
  assert.equal(Object.keys(hidden.progress.answers).length, 20);
  assert.equal("preview" in hidden, false);
  assert.equal("result" in hidden, false);
  assert.equal("share" in hidden, false);
});

test("T-004 F-003 returns only the complete 50-answer map at the detailed terminal exit", () => {
  const previewComplete = answerUntil(createProgress(), 20).progress;
  const hidden = choosePreviewExit(previewComplete, "continueHidden", { definition: DiagnosticDefinition, meta: appMeta, now: NOW });
  const terminal = answerUntil(hidden.progress, 50, 20);

  assert.equal(terminal.kind, "detail-complete");
  assert.equal(Object.keys(terminal.answers).length, 50);
  assert.deepEqual(Object.keys(terminal).sort(), ["answers", "kind"]);
});
