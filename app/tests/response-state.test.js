import assert from "node:assert/strict";
import test from "node:test";

import { appMeta } from "../js/config/app-meta.js";
import { DiagnosticDefinition } from "../js/data/diagnostic-definition.js";
import {
  answerCurrent,
  choosePreviewExit,
  continueAfterPreview,
  createProgressRecord,
  goBack,
} from "../js/domain/response-state.js";

const NOW = "2026-07-25T00:00:00.000Z";
const PROGRESS_ID = "7b6f0a80-7b0a-4e9d-9f15-0fe3ad12c001";

function createProgress() {
  return createProgressRecord({
    definition: DiagnosticDefinition,
    meta: appMeta,
    progressId: PROGRESS_ID,
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
  assert.equal(terminal.progress.currentIndex, 49);
  assert.equal(Object.keys(terminal.progress.answers).length, 50);
  assert.equal(Object.keys(terminal.answers).length, 50);
  assert.deepEqual(Object.keys(terminal).sort(), ["answers", "kind", "progress"]);
});

test("T-004 F-003 continues to detail after a shown preview without relabeling it hidden", () => {
  const previewChoice = answerUntil(createProgress(), 20).progress;
  const preview = choosePreviewExit(previewChoice, "showPreview", { definition: DiagnosticDefinition, meta: appMeta, now: NOW });
  const detail = continueAfterPreview(preview.progress, { definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:21:00.000Z" });

  assert.equal(detail.kind, "detail-after-preview");
  assert.equal(detail.progress.mode, "detail50");
  assert.equal(detail.progress.currentIndex, 20);
  assert.equal(detail.progress.previewDecision, "showPreview");
  assert.equal(Object.keys(detail.progress.answers).length, 20);
});

test("T-004 F-003 permits repeated back and replacement from complete preview and both detailed paths", () => {
  const completePreview = answerUntil(createProgress(), 20).progress;
  const backTwice = goBack(
    goBack(completePreview, { definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:21:00.000Z" }).progress,
    { definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:22:00.000Z" },
  );
  const changedPreview = answerCurrent(backTwice.progress, {
    questionId: DiagnosticDefinition.previewQuestionIds[17], value: 5,
  }, { definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:23:00.000Z" });
  assert.equal(changedPreview.kind, "preview-choice-required");

  for (const detail of [
    continueAfterPreview(choosePreviewExit(completePreview, "showPreview", { definition: DiagnosticDefinition, meta: appMeta, now: NOW }).progress, { definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:24:00.000Z" }),
    choosePreviewExit(completePreview, "continueHidden", { definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:24:00.000Z" }),
  ]) {
    let state = detail.progress;
    for (let index = 0; index < 3; index += 1) state = goBack(state, { definition: DiagnosticDefinition, meta: appMeta, now: `2026-07-25T00:2${5 + index}:00.000Z` }).progress;
    const changed = answerCurrent(state, { questionId: DiagnosticDefinition.detailQuestionIds[17], value: 2 }, { definition: DiagnosticDefinition, meta: appMeta, now: "2026-07-25T00:29:00.000Z" });
    assert.equal(changed.progress.answers[DiagnosticDefinition.detailQuestionIds[17]], 2);
    assert.equal(changed.progress.currentIndex, 20);
  }
});

test("T-004 F-015 rejects omitted, impossible, and non-UUID progress inputs deterministically", () => {
  assert.throws(() => createProgressRecord({ definition: DiagnosticDefinition, meta: appMeta, progressId: PROGRESS_ID }), /RESPONSE_INVALID_INPUT/);
  assert.throws(() => createProgressRecord({ definition: DiagnosticDefinition, meta: appMeta, progressId: "not-a-uuid", now: NOW }), /RESPONSE_INVALID_INPUT/);
  assert.throws(() => createProgressRecord({ definition: DiagnosticDefinition, meta: appMeta, progressId: PROGRESS_ID, now: "2026-02-30T00:00:00.000Z" }), /RESPONSE_INVALID_INPUT/);
  assert.throws(() => answerCurrent(createProgress(), { questionId: DiagnosticDefinition.previewQuestionIds[0], value: 1 }, { definition: DiagnosticDefinition, meta: appMeta }), /RESPONSE_INVALID_INPUT/);
});
