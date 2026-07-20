import { SAMPLE_QUESTIONS, FACTORS } from "./sample-questions.js";
import { makeDemoAnswers, scoreAnswers } from "./sample-scoring.js";
import { initialState, transition } from "./state-machine.js";
import { buildResultModel } from "./sample-results.js";
import { drawRadar } from "./radar-chart.js";
import { orderSelectedResultsChronologically } from "./comparison-order.js";
import {
  clearHistory,
  compareResults,
  deleteResult,
  loadStore,
  saveProgress,
  saveResult,
} from "./history.js";

const PROTOTYPE_NOTICE = "体験用サンプル・正式な診断ではありません";
const ANSWER_LABELS = [
  "まったく当てはまらない",
  "あまり当てはまらない",
  "どちらともいえない",
  "やや当てはまる",
  "とても当てはまる",
];

const app = document.querySelector("#app");
const historyButton = document.querySelector("#history-button");
const brandLink = document.querySelector("#brand-link");
let state = initialState();

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

function noticeMarkup() {
  return `<p class="screen-notice">${PROTOTYPE_NOTICE}</p>`;
}

function warningMarkup() {
  return state.storageWarning
    ? `<p class="warning" role="status">${escapeHtml(state.storageWarning)}</p>`
    : "";
}

function isValidAnswer(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

function isResumableProgress(progress) {
  if (
    !progress ||
    !["manual", "demo"].includes(progress.mode) ||
    !Number.isInteger(progress.currentIndex) ||
    progress.currentIndex < 0 ||
    progress.currentIndex > 50 ||
    !progress.answers ||
    typeof progress.answers !== "object" ||
    Array.isArray(progress.answers)
  ) {
    return false;
  }

  return SAMPLE_QUESTIONS
    .slice(0, progress.currentIndex)
    .every((question) => isValidAnswer(progress.answers[question.id]));
}

function restoreProgress() {
  const progress = loadStore(localStorage).inProgress;
  if (!isResumableProgress(progress)) return false;
  state = {
    ...initialState(),
    ...progress,
    screen: progress.currentIndex === 20
      ? "basicResult"
      : progress.currentIndex === 50
        ? "detailedResult"
        : "questions",
  };
  return true;
}

function persistProgress() {
  try {
    state = {
      ...state,
      startedAt: state.startedAt ?? new Date().toISOString(),
    };
    saveProgress(localStorage, state);
  } catch {
    state = {
      ...state,
      storageWarning: "この環境では回答途中と履歴を保存できません。",
    };
  }
}

function createResultId(answerCount) {
  state = {
    ...state,
    startedAt: state.startedAt ?? new Date().toISOString(),
  };
  return `sample-${state.startedAt}-${state.mode}-${answerCount}`;
}

function completeResult(answerCount) {
  const scored = scoreAnswers(state.answers, answerCount);
  const model = buildResultModel(scored);
  const id = createResultId(answerCount);
  const storedResult = loadStore(localStorage).history.find((result) => result.id === id);
  const result = {
    id,
    completedAt: storedResult?.completedAt ?? new Date().toISOString(),
    answerCount,
    mode: state.mode,
    instrumentId: "sample-big-five",
    instrumentVersion: "sample-v1",
    scoringVersion: "sample-v1",
    resultContentVersion: "sample-v1",
    scores: scored.scores,
    title: model.title,
  };

  try {
    if (!storedResult) saveResult(localStorage, result);
    if (answerCount === 20) saveProgress(localStorage, state);
  } catch {
    state = {
      ...state,
      storageWarning: answerCount === 20
        ? "基本結果は表示できますが、追加30問の再開状態を保存できませんでした。"
        : "結果を履歴へ保存できませんでした。",
    };
  }
  return { scored, model, result };
}

function renderScoreRows(scores) {
  return FACTORS.map((factor) => {
    const score = Number(scores[factor.id]);
    const boundedScore = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0;
    return `
      <li class="score-row">
        <span>${factor.name}</span>
        <span class="score-bar" aria-hidden="true">
          <span style="width: ${boundedScore}%"></span>
        </span>
        <strong class="score-value">${boundedScore}</strong>
      </li>
    `;
  }).join("");
}

function renderMiniScores(scores) {
  if (!scores || typeof scores !== "object") return "";
  return FACTORS.map((factor) => {
    const value = Number(scores[factor.id]);
    const display = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : "—";
    return `<div class="mini-score"><span>${factor.name}</span><strong>${display}</strong></div>`;
  }).join("");
}

function renderStart() {
  const store = loadStore(localStorage);
  const resumable = isResumableProgress(store.inProgress);
  const resumeNumber = resumable
    ? Math.min(store.inProgress.currentIndex + 1, SAMPLE_QUESTIONS.length)
    : 1;
  const resumeLabel = store.inProgress?.currentIndex === 20
    ? "20問の基本結果から再開"
    : `設問${resumeNumber}から再開`;

  app.innerHTML = `
    ${noticeMarkup()}
    <p class="eyebrow">BIG FIVE UI PROTOTYPE</p>
    <h1>自分の傾向を、回答の根拠から見る</h1>
    <p class="lead">
      固定20問の基本結果から、希望すれば追加30問の精密結果へ進める体験用プロトタイプです。
      0〜100はこの回答尺度内のスコアで、能力や順位を表しません。
    </p>
    <div class="panel">
      <h2>体験を始める</h2>
      <p class="supporting">基本結果まで約3分、全50問は約7分が目安です。</p>
      <div class="actions compact">
        ${resumable ? `<button id="resume-button" class="primary" type="button">${resumeLabel}</button>` : ""}
        <button id="manual-start" class="${resumable ? "secondary" : "primary"}" type="button">手動で最初から回答</button>
        <button id="demo-start" class="secondary" type="button">デモ回答を自動入力して体験</button>
      </div>
    </div>
    ${store.history.length ? `
      <button id="start-history" class="text-button" type="button">
        保存済みの履歴 ${store.history.length}件を見る
      </button>
    ` : ""}
    ${warningMarkup()}
  `;

  document.querySelector("#manual-start").addEventListener("click", startManualRun);
  document.querySelector("#demo-start").addEventListener("click", () => {
    state = transition(initialState(), { type: "START", mode: "demo" });
    state = {
      ...state,
      answers: makeDemoAnswers(50),
      currentIndex: 20,
      screen: "basicResult",
      startedAt: new Date().toISOString(),
    };
    render();
  });
  document.querySelector("#resume-button")?.addEventListener("click", () => {
    if (restoreProgress()) render();
  });
  document.querySelector("#start-history")?.addEventListener("click", showHistory);
}

function renderQuestion() {
  const question = SAMPLE_QUESTIONS[state.currentIndex];
  if (!question) {
    state = {
      ...state,
      screen: state.currentIndex >= 50 ? "detailedResult" : "basicResult",
    };
    render();
    return;
  }

  const total = state.currentIndex < 20 ? 20 : 50;
  const progress = Math.round(((state.currentIndex + 1) / total) * 100);
  const selected = state.answers[question.id];
  const stage = state.currentIndex < 20 ? "基本結果まで" : "精密結果まで";

  app.innerHTML = `
    ${noticeMarkup()}
    <div class="progress-label">
      <span>${stage}</span>
      <strong>設問 ${state.currentIndex + 1} / ${total}</strong>
    </div>
    <div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${state.currentIndex + 1}">
      <div style="width: ${progress}%"></div>
    </div>
    <p class="eyebrow">体験用の固定設問</p>
    <h1 class="question-text">${escapeHtml(question.text)}</h1>
    <div class="answers" role="group" aria-label="回答を5段階から選択">
      ${ANSWER_LABELS.map((label, index) => `
        <button
          class="answer"
          type="button"
          data-answer="${index + 1}"
          aria-pressed="${selected === index + 1}"
        >
          ${index + 1}. ${label}
        </button>
      `).join("")}
    </div>
    <div class="actions">
      <button id="back-button" class="secondary" type="button" ${state.currentIndex === 0 ? "disabled" : ""}>前の設問へ戻る</button>
      <button id="restart-button" class="text-button" type="button">最初からやり直す</button>
    </div>
    ${warningMarkup()}
  `;

  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      state = transition(state, {
        type: "ANSWER",
        questionId: question.id,
        value: Number(button.dataset.answer),
      });
      persistProgress();
      render();
    });
  });
  document.querySelector("#back-button").addEventListener("click", () => {
    state = transition(state, { type: "BACK" });
    persistProgress();
    render();
  });
  document.querySelector("#restart-button").addEventListener("click", startManualRun);
}

function renderDetailedGuidance(model) {
  const first = FACTORS.find((factor) => factor.id === model.leadingFactors[0])?.name ?? "";
  const second = FACTORS.find((factor) => factor.id === model.leadingFactors[1])?.name ?? "";
  return `
    <section class="panel" aria-labelledby="detail-heading">
      <h2 id="detail-heading">精密結果の読み方</h2>
      <p class="lead">${escapeHtml(model.detail)}</p>
      <h3>強みが活きる場面</h3>
      <p class="supporting">${first}と${second}の両方を使い、考えと行動をつなげる場面です。</p>
      <h3>強みが裏返りやすい場面</h3>
      <p class="supporting">一方の傾向だけを急いで使うときは、状況に合うか立ち止まって確認すると扱いやすくなります。</p>
      <h3>自分との付き合い方</h3>
      <p class="supporting">この結果を固定的なタイプではなく、今回の回答で表れた傾向として振り返ってください。</p>
    </section>
  `;
}

function renderResult(answerCount) {
  const { scored, model } = completeResult(answerCount);
  const kind = answerCount === 20 ? "基本結果" : "精密結果";
  const demoBadge = state.mode === "demo" ? '<span class="profile-badge">デモ回答</span>' : "";

  app.innerHTML = `
    ${noticeMarkup()}
    <article class="result-card">
      <p class="eyebrow">BIG FIVE ${kind} / ${answerCount}問</p>
      ${demoBadge}
      <h1>${escapeHtml(model.title)}</h1>
      <p class="lead result-summary">${escapeHtml(model.summary)}</p>
      <section class="score-visual" aria-labelledby="score-heading">
        <h2 id="score-heading">5因子の尺度内スコア</h2>
        <canvas
          id="result-radar"
          class="radar"
          width="280"
          height="280"
          role="img"
          aria-label="${FACTORS.map((factor) => `${factor.name} ${scored.scores[factor.id]}`).join("、")}"
        ></canvas>
        <ul class="score-list">${renderScoreRows(scored.scores)}</ul>
      </section>
      <section class="reason-panel" aria-labelledby="reason-heading">
        <h2 id="reason-heading">この結果になった理由</h2>
        <p>${escapeHtml(model.reason)}</p>
      </section>
      <p class="disclaimer">${escapeHtml(model.disclaimer)} 50は回答尺度上の中央で、上位何％という意味ではありません。</p>
    </article>
    ${answerCount === 50 ? renderDetailedGuidance(model) : `
      <section class="panel">
        <h2>追加30問で、条件を含む精密結果へ</h2>
        <p class="supporting">${escapeHtml(model.detail)}</p>
      </section>
    `}
    <div class="actions">
      ${answerCount === 20 ? '<button id="continue-button" class="primary" type="button">追加30問へ進む</button>' : ""}
      <button class="secondary" type="button" disabled aria-describedby="share-help">共有プレビュー</button>
      <p id="share-help" class="share-placeholder">共有機能は次の実装タスクで利用できます</p>
      <button id="result-history" class="secondary" type="button">履歴を見る</button>
      <button id="new-run" class="text-button" type="button">新しい体験を始める</button>
    </div>
    ${warningMarkup()}
  `;

  drawRadar(document.querySelector("#result-radar"), scored.scores);
  document.querySelector("#continue-button")?.addEventListener("click", () => {
    state = transition(state, { type: "CONTINUE" });
    if (state.mode === "demo") {
      for (const question of SAMPLE_QUESTIONS.slice(20)) {
        state = transition(state, {
          type: "ANSWER",
          questionId: question.id,
          value: state.answers[question.id],
        });
      }
    } else {
      persistProgress();
    }
    render();
  });
  document.querySelector("#result-history").addEventListener("click", showHistory);
  document.querySelector("#new-run").addEventListener("click", () => {
    state = transition(state, { type: "GO_START" });
    render();
  });
}

function validHistoryResults() {
  return loadStore(localStorage).history.filter((result) => (
    result &&
    typeof result.id === "string" &&
    typeof result.title === "string" &&
    [20, 50].includes(result.answerCount) &&
    result.scores &&
    FACTORS.every((factor) => {
      const score = result.scores[factor.id];
      return Number.isFinite(score) && score >= 0 && score <= 100;
    })
  ));
}

function formatCompletedAt(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "日時不明";
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function showHistory() {
  state = transition(state, { type: "SHOW_HISTORY" });
  render();
}

function focusHistoryControl(selector) {
  const target = selector ? document.querySelector(selector) : null;
  (target ?? app).focus({ preventScroll: true });
}

function renderHistory(focusSelector = "") {
  const results = validHistoryResults();
  const selected = new Set(state.selectedHistoryIds);

  app.innerHTML = `
    ${noticeMarkup()}
    <p class="eyebrow">この端末内だけに保存</p>
    <h1>結果履歴</h1>
    <p class="lead">同じ条件の結果を2件選ぶと、尺度内スコアの差を確認できます。</p>
    ${results.length ? `
      <div class="history-toolbar">
        <button id="compare-button" class="primary" type="button" ${selected.size === 2 ? "" : "disabled"}>
          選択した2件を比較
        </button>
        <button id="clear-history" class="danger-button" type="button">履歴と途中回答をすべて削除</button>
      </div>
      <div>
        ${results.map((result, index) => `
          <article class="history-item">
            <label class="history-choice">
              <input type="checkbox" data-select-index="${index}" ${selected.has(result.id) ? "checked" : ""}>
              <span>
                <span class="history-title">${escapeHtml(result.title)}</span>
                <span class="meta">${result.answerCount}問 / ${result.mode === "demo" ? "デモ回答" : "手動回答"} / ${escapeHtml(formatCompletedAt(result.completedAt))}</span>
              </span>
            </label>
            <div class="mini-scores">${renderMiniScores(result.scores)}</div>
            <div class="item-actions">
              <button class="text-button danger" type="button" data-delete-index="${index}">この結果を削除</button>
            </div>
          </article>
        `).join("")}
      </div>
    ` : '<p class="panel empty">保存済みの結果はありません。</p>'}
    <div class="actions">
      ${isResumableProgress(loadStore(localStorage).inProgress) ? '<button id="resume-from-history" class="primary" type="button">保存中の回答へ戻る</button>' : ""}
      <button id="restart-from-history" class="secondary" type="button">最初から新しく回答する</button>
      <button id="history-start" class="text-button" type="button">開始画面へ戻る</button>
    </div>
    ${warningMarkup()}
  `;

  document.querySelectorAll("[data-select-index]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const index = Number(checkbox.dataset.selectIndex);
      const result = results[index];
      const next = new Set(state.selectedHistoryIds);
      let nextFocus = `[data-select-index="${index}"]`;
      if (checkbox.checked && next.size >= 2) {
        state = { ...state, storageWarning: "比較対象は2件まで選択できます。" };
      } else if (checkbox.checked) {
        next.add(result.id);
        state = { ...state, selectedHistoryIds: [...next], storageWarning: undefined };
        if (next.size === 2) nextFocus = "#compare-button";
      } else {
        next.delete(result.id);
        state = { ...state, selectedHistoryIds: [...next], storageWarning: undefined };
      }
      renderHistory(nextFocus);
    });
  });
  document.querySelectorAll("[data-delete-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.deleteIndex);
      const result = results[index];
      try {
        deleteResult(localStorage, result.id);
        state = {
          ...state,
          selectedHistoryIds: state.selectedHistoryIds.filter((id) => id !== result.id),
          storageWarning: undefined,
        };
      } catch {
        state = { ...state, storageWarning: "この結果を削除できませんでした。" };
      }
      const remainingCount = validHistoryResults().length;
      const nextFocus = remainingCount
        ? `[data-delete-index="${Math.min(index, remainingCount - 1)}"]`
        : "#restart-from-history";
      renderHistory(nextFocus);
    });
  });
  document.querySelector("#compare-button")?.addEventListener("click", () => {
    state = transition(state, {
      type: "SHOW_COMPARE",
      ids: state.selectedHistoryIds,
    });
    render();
  });
  document.querySelector("#clear-history")?.addEventListener("click", () => {
    if (!window.confirm("履歴と回答途中のデータをすべて削除しますか？")) return;
    try {
      clearHistory(localStorage);
      state = { ...state, selectedHistoryIds: [], storageWarning: undefined };
    } catch {
      state = { ...state, storageWarning: "端末内データを削除できませんでした。" };
    }
    renderHistory("#restart-from-history");
  });
  document.querySelector("#resume-from-history")?.addEventListener("click", () => {
    if (restoreProgress()) render();
  });
  document.querySelector("#restart-from-history").addEventListener("click", startManualRun);
  document.querySelector("#history-start").addEventListener("click", () => {
    state = transition(state, { type: "GO_START" });
    render();
  });

  if (focusSelector) focusHistoryControl(focusSelector);
}

function renderCompare() {
  const results = validHistoryResults();
  const [left, right] = orderSelectedResultsChronologically(
    results,
    state.selectedHistoryIds,
  );
  let comparisonMarkup;

  if (!left || !right) {
    comparisonMarkup = '<p class="warning">比較する結果を履歴から2件選び直してください。</p>';
  } else {
    try {
      const deltas = compareResults(left, right);
      comparisonMarkup = `
        <section class="panel" aria-labelledby="comparison-heading">
          <h2 id="comparison-heading">${escapeHtml(left.title)} と ${escapeHtml(right.title)}</h2>
          <p class="supporting">
            左が前回、右が今回です。差は性格の確定的な変化ではなく、回答時点の尺度内スコア差です。
          </p>
          <div class="comparison-grid">
            <div class="comparison-row comparison-head">
              <span>因子</span><span>前回</span><span>今回</span><span>差</span>
            </div>
            ${FACTORS.map((factor) => {
              const delta = deltas[factor.id];
              return `
                <div class="comparison-row">
                  <strong>${factor.name}</strong>
                  <span>${left.scores[factor.id]}</span>
                  <span>${right.scores[factor.id]}</span>
                  <strong>${delta > 0 ? "+" : ""}${delta}</strong>
                </div>
              `;
            }).join("")}
          </div>
        </section>
      `;
    } catch {
      comparisonMarkup = `
        <p class="warning">
          この2件は設問数または採点バージョンが異なるため、同じ精度の結果として比較できません。
        </p>
      `;
    }
  }

  app.innerHTML = `
    ${noticeMarkup()}
    <p class="eyebrow">互換性を確認して比較</p>
    <h1>過去結果との比較</h1>
    ${comparisonMarkup}
    <div class="actions">
      <button id="compare-back" class="secondary" type="button">履歴へ戻る</button>
      <button id="compare-restart" class="text-button" type="button">最初から新しく回答する</button>
    </div>
    ${warningMarkup()}
  `;

  document.querySelector("#compare-back").addEventListener("click", showHistory);
  document.querySelector("#compare-restart").addEventListener("click", startManualRun);
}

function startManualRun() {
  state = transition(initialState(), { type: "START", mode: "manual" });
  persistProgress();
  render();
}

function render() {
  switch (state.screen) {
    case "questions":
      renderQuestion();
      break;
    case "basicResult":
      renderResult(20);
      break;
    case "detailedResult":
      renderResult(50);
      break;
    case "history":
      renderHistory();
      break;
    case "compare":
      renderCompare();
      break;
    default:
      renderStart();
  }
  app.focus({ preventScroll: true });
}

historyButton.addEventListener("click", showHistory);
brandLink.addEventListener("click", (event) => {
  event.preventDefault();
  state = transition(state, { type: "GO_START" });
  render();
});

restoreProgress();
render();
