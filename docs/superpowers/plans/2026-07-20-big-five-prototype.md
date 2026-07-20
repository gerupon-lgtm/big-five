# Big Five UI Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a disposable, mobile-first Big Five UI prototype that demonstrates the 20-question result, optional 30-question extension, share-card preview, local history, and compatible-result comparison.

**Architecture:** A dependency-free static application runs as native browser ES modules behind a tiny Node.js static server. Pure modules own sample scoring, state transitions, history compatibility, result modeling, and share text; browser modules own DOM rendering, Canvas drawing, localStorage, clipboard, download, and Web Share integration.

**Tech Stack:** HTML5, CSS3, browser JavaScript ES modules, Canvas 2D, localStorage, Node.js 24, Node built-in test runner.

## Global Constraints

- This is a throwaway prototype, not a production foundation.
- Every major screen must state `体験用サンプル・正式な診断ではありません`.
- Use exactly 50 fixed sample questions; the first 20 form the prototype checkpoint and the remaining 30 extend it.
- Do not use external packages, APIs, backend services, accounts, or public result URLs.
- Store in-progress answers and result history only under localStorage key `bigFivePrototype:v1`.
- Use the approved C layout: title and profile statement first, followed immediately by scores and the reason for the result.
- Show 0–100 values as scale-internal scores, never percentiles or ability scores.
- Never compare 20-question results with 50-question results as equivalent measurements.
- Generate share images on demand; never persist the image or raw answers in a shared artifact.
- Optimize for a 360px-wide smartphone without horizontal scrolling.
- Use Japanese UI copy and a restrained white, gray, deep-green, and navy visual system.

---

## File Map

```text
package.json
prototype-big-five/
├─ index.html                  # App shell and screen host
├─ styles.css                 # Mobile-first visual system
├─ app.js                     # Browser event wiring and screen orchestration
├─ state-machine.js           # Pure application state transitions
├─ sample-questions.js        # Fixed sample item definitions
├─ sample-scoring.js          # Demo answers and 20/50 scoring
├─ sample-results.js          # Titles and evidence-first result models
├─ history.js                 # Storage schema, history, deletion, comparison
├─ radar-chart.js             # Radar geometry and Canvas rendering
├─ share-card.js              # Share text, Canvas card, share fallbacks
├─ prototype-server.mjs       # One-command static server
├─ NOTES.md                   # Prototype question and verdict capture
└─ tests/
   ├─ scoring.test.js
   ├─ state-machine.test.js
   ├─ history.test.js
   ├─ results.test.js
   └─ share.test.js
```

---

### Task 1: Static Server and Scoring Core

**Files:**
- Create: `package.json`
- Create: `prototype-big-five/prototype-server.mjs`
- Create: `prototype-big-five/sample-questions.js`
- Create: `prototype-big-five/sample-scoring.js`
- Create: `prototype-big-five/tests/scoring.test.js`

**Interfaces:**
- Produces: `FACTORS`, `SAMPLE_QUESTIONS`, `scoreAnswers(answers, answerCount)`, `makeDemoAnswers(answerCount)`.
- `scoreAnswers` returns `{ answerCount, scores }`, where `scores` has numeric keys `O`, `C`, `E`, `A`, and `N`.

- [ ] **Step 1: Create the package scripts**

```json
{
  "name": "big-five-ui-prototype",
  "private": true,
  "type": "module",
  "scripts": {
    "prototype": "node prototype-big-five/prototype-server.mjs",
    "test": "node --test prototype-big-five/tests/*.test.js"
  }
}
```

- [ ] **Step 2: Write the failing scoring tests**

```js
// prototype-big-five/tests/scoring.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { SAMPLE_QUESTIONS } from "../sample-questions.js";
import { makeDemoAnswers, scoreAnswers } from "../sample-scoring.js";

test("sample inventory contains a fixed 50 items and a balanced 20-item checkpoint", () => {
  assert.equal(SAMPLE_QUESTIONS.length, 50);
  const checkpointCounts = Object.groupBy(
    SAMPLE_QUESTIONS.slice(0, 20),
    (question) => question.factor,
  );
  for (const factor of ["O", "C", "E", "A", "N"]) {
    assert.equal(checkpointCounts[factor].length, 4);
  }
});

test("scoreAnswers returns five bounded scale-internal scores", () => {
  const result = scoreAnswers(makeDemoAnswers(20), 20);
  assert.equal(result.answerCount, 20);
  assert.deepEqual(Object.keys(result.scores), ["O", "C", "E", "A", "N"]);
  for (const score of Object.values(result.scores)) {
    assert.ok(score >= 0 && score <= 100);
    assert.equal(Number.isInteger(score), true);
  }
});

test("reverse-keyed items invert a response before averaging", () => {
  const answers = Object.fromEntries(
    SAMPLE_QUESTIONS.slice(0, 20).map((question) => [question.id, 3]),
  );
  const positive = SAMPLE_QUESTIONS.slice(0, 20).find((question) => !question.reverse);
  const reversed = SAMPLE_QUESTIONS.slice(0, 20).find((question) => question.reverse);
  answers[positive.id] = 5;
  answers[reversed.id] = 1;
  const result = scoreAnswers(answers, 20);
  assert.ok(Object.values(result.scores).some((score) => score > 50));
});
```

- [ ] **Step 3: Run the scoring tests and verify failure**

Run:

```powershell
npm.cmd test
```

Expected: FAIL because `sample-questions.js` and `sample-scoring.js` do not exist.

- [ ] **Step 4: Implement fixed sample questions**

Use ten items per factor. Interleave the five factors so the first four rounds create a balanced 20-item checkpoint.

```js
// prototype-big-five/sample-questions.js
export const FACTORS = Object.freeze([
  { id: "O", name: "開放性" },
  { id: "C", name: "勤勉性" },
  { id: "E", name: "外向性" },
  { id: "A", name: "協調性" },
  { id: "N", name: "感情反応性" },
]);

const statements = {
  O: [
    "新しい考え方に触れると試してみたくなる",
    "抽象的なテーマについて考えることを楽しむ",
    "慣れた方法より別の可能性を探したくなる",
    "芸術や表現の細かな違いに気づきやすい",
    "想像を膨らませる時間を大切にする",
    "知らない分野を学ぶことに抵抗が少ない",
    "実用性が見えない話題には関心を持ちにくい",
    "決まった手順があれば変えない方が安心する",
    "複数の見方を比べることが好きだ",
    "日常に小さな変化を取り入れたくなる"
  ],
  C: [
    "始める前に手順を整理する",
    "約束した期限を意識して行動する",
    "使った物を決まった場所へ戻す",
    "長期的な目標のために行動を続けられる",
    "重要な作業でも後回しにすることがある",
    "計画がなくてもその場で何とかする方だ",
    "作業の抜け漏れを確認する",
    "気分に左右されず必要なことへ取り組む",
    "細かなルールより状況への対応を優先する",
    "途中で投げ出さず区切りまで進める"
  ],
  E: [
    "人と話すことで気分が上向きやすい",
    "初対面の集まりでも自分から話しかけられる",
    "注目を集める場面を負担に感じにくい",
    "活動の多い一日を楽しめる",
    "一人で静かに過ごすと回復しやすい",
    "大人数の場では聞き役になることが多い",
    "考えをその場で言葉にする方だ",
    "新しい集まりへ参加することに抵抗が少ない",
    "にぎやかな環境が長く続くと疲れやすい",
    "周囲へ働きかけて流れを作ることがある"
  ],
  A: [
    "意見が違っても相手の事情を考える",
    "困っている人を見ると手を貸したくなる",
    "対立したときは共通点を探す",
    "人の言葉をまず善意に受け取る",
    "必要なら相手に厳しい意見を伝えられる",
    "納得できない提案にははっきり反対する",
    "自分の利益より全体の納得を優先することがある",
    "相手の気持ちの変化に気づきやすい",
    "競争では遠慮せず勝ちを目指す",
    "人間関係の緊張を和らげようとする"
  ],
  N: [
    "予定外のことが起きると心が揺れやすい",
    "失敗の可能性を繰り返し考えることがある",
    "小さな違和感にも早く気づく",
    "強いプレッシャーが続くと消耗しやすい",
    "嫌なことがあっても気持ちを切り替えやすい",
    "難しい状況でも落ち着きを保てる",
    "人からどう見られるかが気になる",
    "先のリスクを考えて準備する",
    "感情の波は比較的小さい方だ",
    "緊張する場面では身体にも反応が出やすい"
  ],
};

const reverseIndexes = {
  O: new Set([6, 7]),
  C: new Set([4, 5, 8]),
  E: new Set([4, 5, 8]),
  A: new Set([4, 5, 8]),
  N: new Set([4, 5, 8]),
};

export const SAMPLE_QUESTIONS = Object.freeze(
  Array.from({ length: 10 }, (_, round) =>
    FACTORS.map((factor) => ({
      id: `${factor.id}${round + 1}`,
      factor: factor.id,
      text: statements[factor.id][round],
      reverse: reverseIndexes[factor.id].has(round),
    })),
  ).flat(),
);
```

- [ ] **Step 5: Implement deterministic sample scoring**

```js
// prototype-big-five/sample-scoring.js
import { FACTORS, SAMPLE_QUESTIONS } from "./sample-questions.js";

export function makeDemoAnswers(answerCount = 50) {
  const pattern = [5, 4, 3, 2, 4, 5, 2, 3, 4, 1];
  return Object.fromEntries(
    SAMPLE_QUESTIONS.slice(0, answerCount).map((question, index) => [
      question.id,
      pattern[index % pattern.length],
    ]),
  );
}

export function scoreAnswers(answers, answerCount) {
  if (![20, 50].includes(answerCount)) {
    throw new RangeError("answerCount must be 20 or 50");
  }
  const selected = SAMPLE_QUESTIONS.slice(0, answerCount);
  const scores = {};
  for (const factor of FACTORS) {
    const items = selected.filter((question) => question.factor === factor.id);
    const values = items.map((question) => {
      const response = Number(answers[question.id]);
      if (!Number.isInteger(response) || response < 1 || response > 5) {
        throw new TypeError(`missing or invalid answer: ${question.id}`);
      }
      return question.reverse ? 6 - response : response;
    });
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    scores[factor.id] = Math.round(((mean - 1) / 4) * 100);
  }
  return { answerCount, scores };
}
```

- [ ] **Step 6: Implement the one-command static server**

```js
// prototype-big-five/prototype-server.mjs
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  const requested = pathname === "/" ? "index.html" : pathname.slice(1);
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  try {
    const body = await readFile(join(root, safePath));
    response.writeHead(200, { "content-type": mime[extname(safePath)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(port, () => {
  console.log(`Big Five prototype: http://localhost:${port}`);
});
```

- [ ] **Step 7: Run tests and server**

Run:

```powershell
npm.cmd test
```

Expected: 3 tests pass.

Run:

```powershell
npm.cmd run prototype
```

Expected: `Big Five prototype: http://localhost:4173`.

- [ ] **Step 8: Commit the scoring core**

```powershell
git add package.json prototype-big-five/prototype-server.mjs prototype-big-five/sample-questions.js prototype-big-five/sample-scoring.js prototype-big-five/tests/scoring.test.js
git commit -m "feat: add prototype scoring core"
```

---

### Task 2: Pure State Machine

**Files:**
- Create: `prototype-big-five/state-machine.js`
- Create: `prototype-big-five/tests/state-machine.test.js`

**Interfaces:**
- Consumes: fixed question count of 50.
- Produces: `initialState()`, `transition(state, event)`.
- Screen values: `start`, `questions`, `basicResult`, `detailedResult`, `share`, `history`, `compare`.

- [ ] **Step 1: Write state transition tests**

```js
// prototype-big-five/tests/state-machine.test.js
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
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm.cmd test`

Expected: FAIL because `state-machine.js` does not exist.

- [ ] **Step 3: Implement the reducer**

```js
// prototype-big-five/state-machine.js
export function initialState() {
  return {
    screen: "start",
    mode: "manual",
    currentIndex: 0,
    answers: {},
    selectedHistoryIds: [],
  };
}

export function transition(state, event) {
  switch (event.type) {
    case "START":
      return { ...initialState(), screen: "questions", mode: event.mode };
    case "ANSWER": {
      const answers = { ...state.answers, [event.questionId]: event.value };
      const currentIndex = state.currentIndex + 1;
      const screen =
        currentIndex === 20
          ? "basicResult"
          : currentIndex === 50
            ? "detailedResult"
            : "questions";
      return { ...state, answers, currentIndex, screen };
    }
    case "BACK":
      return { ...state, currentIndex: Math.max(0, state.currentIndex - 1), screen: "questions" };
    case "CONTINUE":
      return { ...state, screen: "questions", currentIndex: 20 };
    case "SHOW_SHARE":
      return { ...state, screen: "share" };
    case "SHOW_HISTORY":
      return { ...state, screen: "history" };
    case "SHOW_COMPARE":
      return { ...state, screen: "compare", selectedHistoryIds: event.ids };
    case "GO_START":
      return initialState();
    default:
      return state;
  }
}
```

- [ ] **Step 4: Run tests**

Run: `npm.cmd test`

Expected: all tests pass.

- [ ] **Step 5: Commit**

```powershell
git add prototype-big-five/state-machine.js prototype-big-five/tests/state-machine.test.js
git commit -m "feat: define prototype state flow"
```

---

### Task 3: Local History and Comparison Rules

**Files:**
- Create: `prototype-big-five/history.js`
- Create: `prototype-big-five/tests/history.test.js`

**Interfaces:**
- Produces: `loadStore(storage)`, `saveProgress(storage, state)`, `saveResult(storage, result)`, `deleteResult(storage, id)`, `clearHistory(storage)`, `canCompare(left, right)`, `compareResults(left, right)`.
- Storage key: `bigFivePrototype:v1`.

- [ ] **Step 1: Write history tests**

```js
// prototype-big-five/tests/history.test.js
import test from "node:test";
import assert from "node:assert/strict";
import {
  canCompare,
  compareResults,
  loadStore,
  saveResult,
} from "../history.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

const base = {
  instrumentId: "sample-big-five",
  instrumentVersion: "sample-v1",
  scoringVersion: "sample-v1",
  resultContentVersion: "sample-v1",
  mode: "manual",
};

test("saveResult prepends a result without persisting answers", () => {
  const storage = memoryStorage();
  saveResult(storage, { ...base, id: "one", answerCount: 20, scores: { O: 50 } });
  const store = loadStore(storage);
  assert.equal(store.history[0].id, "one");
  assert.equal("answers" in store.history[0], false);
});

test("20 and 50 item results cannot be compared", () => {
  assert.equal(
    canCompare(
      { ...base, answerCount: 20 },
      { ...base, answerCount: 50 },
    ).ok,
    false,
  );
});

test("compatible results produce factor deltas", () => {
  const left = { ...base, answerCount: 20, scores: { O: 25, C: 50, E: 75, A: 50, N: 25 } };
  const right = { ...base, answerCount: 20, scores: { O: 50, C: 25, E: 75, A: 75, N: 50 } };
  assert.deepEqual(compareResults(left, right), { O: 25, C: -25, E: 0, A: 25, N: 25 });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm.cmd test`

Expected: FAIL because `history.js` does not exist.

- [ ] **Step 3: Implement versioned local history**

```js
// prototype-big-five/history.js
export const STORAGE_KEY = "bigFivePrototype:v1";
const emptyStore = () => ({ inProgress: null, history: [] });

export function loadStore(storage = localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY));
    return {
      inProgress: parsed?.inProgress ?? null,
      history: Array.isArray(parsed?.history) ? parsed.history : [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(storage, store) {
  storage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function saveProgress(storage, state) {
  const store = loadStore(storage);
  writeStore(storage, {
    ...store,
    inProgress: {
      answers: state.answers,
      currentIndex: state.currentIndex,
      startedAt: state.startedAt,
      mode: state.mode,
    },
  });
}

export function saveResult(storage, result) {
  const store = loadStore(storage);
  const { answers: _answers, ...safeResult } = result;
  writeStore(storage, {
    inProgress: null,
    history: [safeResult, ...store.history],
  });
}

export function deleteResult(storage, id) {
  const store = loadStore(storage);
  writeStore(storage, {
    ...store,
    history: store.history.filter((result) => result.id !== id),
  });
}

export function clearHistory(storage) {
  writeStore(storage, emptyStore());
}

export function canCompare(left, right) {
  const fields = ["answerCount", "instrumentId", "instrumentVersion", "scoringVersion"];
  const mismatch = fields.find((field) => left[field] !== right[field]);
  return mismatch
    ? { ok: false, reason: `${mismatch}が異なるため比較できません` }
    : { ok: true, reason: "" };
}

export function compareResults(left, right) {
  const compatibility = canCompare(left, right);
  if (!compatibility.ok) throw new TypeError(compatibility.reason);
  return Object.fromEntries(
    Object.keys(left.scores).map((factor) => [factor, right.scores[factor] - left.scores[factor]]),
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npm.cmd test`

Expected: all tests pass.

- [ ] **Step 5: Commit**

```powershell
git add prototype-big-five/history.js prototype-big-five/tests/history.test.js
git commit -m "feat: add local prototype history"
```

---

### Task 4: Result Models and Radar Geometry

**Files:**
- Create: `prototype-big-five/sample-results.js`
- Create: `prototype-big-five/radar-chart.js`
- Create: `prototype-big-five/tests/results.test.js`

**Interfaces:**
- Consumes: `{ answerCount, scores }`.
- Produces: `buildResultModel(scored)`, `radarPoints(scores, centerX, centerY, radius)`, `drawRadar(canvas, scores)`.

- [ ] **Step 1: Write result-model tests**

```js
// prototype-big-five/tests/results.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { buildResultModel } from "../sample-results.js";
import { radarPoints } from "../radar-chart.js";

test("result model names the two strongest profile factors", () => {
  const model = buildResultModel({
    answerCount: 20,
    scores: { O: 82, C: 68, E: 41, A: 74, N: 57 },
  });
  assert.equal(model.title, "探究する調整役");
  assert.deepEqual(model.leadingFactors, ["O", "A"]);
  assert.match(model.disclaimer, /尺度内スコア/);
});

test("radarPoints returns five bounded points", () => {
  const points = radarPoints({ O: 100, C: 50, E: 0, A: 75, N: 25 }, 100, 100, 80);
  assert.equal(points.length, 5);
  for (const [x, y] of points) {
    assert.ok(x >= 20 && x <= 180);
    assert.ok(y >= 20 && y <= 180);
  }
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm.cmd test`

Expected: FAIL because result modules do not exist.

- [ ] **Step 3: Implement evidence-first sample result copy**

```js
// prototype-big-five/sample-results.js
const factorNames = {
  O: "開放性",
  C: "勤勉性",
  E: "外向性",
  A: "協調性",
  N: "感情反応性",
};

const titles = {
  "A-O": "探究する調整役",
  "C-O": "構想を形にする人",
  "E-O": "可能性を広げる発信者",
  "A-C": "信頼を積み上げる実務家",
  "C-E": "前へ進める推進役",
  "A-E": "人をつなぐ働きかけ役",
};

export function buildResultModel({ answerCount, scores }) {
  const leadingFactors = Object.entries(scores)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 2)
    .map(([factor]) => factor);
  const pair = [...leadingFactors].sort().join("-");
  const title = titles[pair] ?? `${factorNames[leadingFactors[0]]}を軸にする人`;
  return {
    title,
    leadingFactors,
    summary: `${factorNames[leadingFactors[0]]}と${factorNames[leadingFactors[1]]}が、今回のプロフィールに特に表れています。`,
    reason: `上位2因子は${factorNames[leadingFactors[0]]} ${scores[leadingFactors[0]]}、${factorNames[leadingFactors[1]]} ${scores[leadingFactors[1]]}です。`,
    detail:
      answerCount === 50
        ? "状況に応じた強みと、同じ傾向が負荷につながる場面まで確認できます。"
        : "20問版は広い傾向を捉えた基本結果です。追加30問で結果を精密化できます。",
    disclaimer: "0〜100は尺度内スコアであり、順位や能力点ではありません。",
  };
}
```

- [ ] **Step 4: Implement radar geometry and Canvas drawing**

```js
// prototype-big-five/radar-chart.js
const order = ["O", "C", "E", "A", "N"];

export function radarPoints(scores, centerX, centerY, radius) {
  return order.map((factor, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / order.length;
    const scaled = radius * (scores[factor] / 100);
    return [centerX + Math.cos(angle) * scaled, centerY + Math.sin(angle) * scaled];
  });
}

export function drawRadar(canvas, scores) {
  const context = canvas.getContext("2d");
  const size = Math.min(canvas.width, canvas.height);
  const center = size / 2;
  const radius = size * 0.36;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#cbd8d4";
  context.fillStyle = "rgba(40,106,90,.22)";
  context.lineWidth = 2;
  const points = radarPoints(scores, center, center, radius);
  context.beginPath();
  points.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
  context.closePath();
  context.fill();
  context.stroke();
}
```

- [ ] **Step 5: Run tests and commit**

Run: `npm.cmd test`

Expected: all tests pass.

```powershell
git add prototype-big-five/sample-results.js prototype-big-five/radar-chart.js prototype-big-five/tests/results.test.js
git commit -m "feat: add result model and radar chart"
```

---

### Task 5: Mobile UI and Complete Questionnaire Flow

**Files:**
- Create: `prototype-big-five/index.html`
- Create: `prototype-big-five/styles.css`
- Create: `prototype-big-five/app.js`

**Interfaces:**
- Consumes all interfaces from Tasks 1–4.
- Produces a usable browser flow with `renderStart`, `renderQuestion`, `renderResult`, `renderHistory`, and `renderCompare`.

- [ ] **Step 1: Create the accessible app shell**

```html
<!-- prototype-big-five/index.html -->
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Big Five 体験用プロトタイプ</title>
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <header class="site-header">
    <a href="#start" class="brand">BIG FIVE <span>PROTOTYPE</span></a>
    <button id="history-button" class="text-button" type="button">履歴</button>
  </header>
  <div class="prototype-notice">体験用サンプル・正式な診断ではありません</div>
  <main id="app" tabindex="-1" aria-live="polite"></main>
  <script type="module" src="./app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Implement the approved restrained visual system**

```css
/* prototype-big-five/styles.css */
:root {
  color: #16221f;
  background: #f4f6f5;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  --green: #245f51;
  --green-soft: #e5f0ec;
  --navy: #172d3b;
  --line: #d9e1de;
}
* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; }
button { font: inherit; }
.site-header, #app, .prototype-notice { width: min(100% - 32px, 480px); margin-inline: auto; }
.site-header { min-height: 64px; display: flex; align-items: center; justify-content: space-between; }
.brand { color: var(--navy); text-decoration: none; font-weight: 800; letter-spacing: .05em; }
.brand span { color: var(--green); font-size: .7rem; }
.prototype-notice { color: #5e6b67; font-size: .75rem; border-block: 1px solid var(--line); padding: 8px 0; }
#app { padding: 28px 0 64px; }
.eyebrow { color: #62706b; font-size: .75rem; font-weight: 700; letter-spacing: .08em; }
h1 { color: var(--navy); font-size: clamp(1.8rem, 8vw, 2.6rem); line-height: 1.15; margin: 10px 0 14px; }
.lead { color: #46534f; line-height: 1.75; }
.primary, .secondary, .answer { width: 100%; min-height: 48px; border-radius: 10px; padding: 12px 16px; cursor: pointer; }
.primary { border: 1px solid var(--green); background: var(--green); color: white; font-weight: 700; }
.secondary { border: 1px solid var(--line); background: white; color: var(--navy); }
.actions { display: grid; gap: 10px; margin-top: 24px; }
.progress { height: 6px; background: #e2e7e5; border-radius: 99px; overflow: hidden; margin: 12px 0 28px; }
.progress > div { height: 100%; background: var(--green); }
.answers { display: grid; gap: 8px; margin: 24px 0; }
.answer { border: 1px solid var(--line); background: white; text-align: left; }
.answer:hover, .answer:focus-visible { border-color: var(--green); outline: 3px solid #cce1da; }
.result-card, .panel { background: white; border: 1px solid var(--line); border-radius: 16px; padding: 20px; margin-top: 16px; }
.profile-badge { display: inline-block; color: var(--green); background: var(--green-soft); border-radius: 99px; padding: 5px 9px; font-size: .75rem; font-weight: 700; }
.radar { display: block; width: min(100%, 280px); height: auto; margin: 16px auto; }
.score-row { display: grid; grid-template-columns: 88px 1fr 38px; gap: 8px; align-items: center; margin: 10px 0; font-size: .85rem; }
.score-bar { height: 8px; background: #e4e9e7; border-radius: 99px; overflow: hidden; }
.score-bar span { display: block; height: 100%; background: var(--green); }
.text-button { border: 0; background: transparent; color: var(--green); cursor: pointer; }
@media (prefers-reduced-motion: no-preference) {
  .result-card { animation: reveal .28s ease-out; }
  @keyframes reveal { from { opacity: 0; transform: translateY(8px); } }
}
```

- [ ] **Step 3: Implement orchestration and rendering**

`app.js` must:

```js
import { SAMPLE_QUESTIONS, FACTORS } from "./sample-questions.js";
import { makeDemoAnswers, scoreAnswers } from "./sample-scoring.js";
import { initialState, transition } from "./state-machine.js";
import { buildResultModel } from "./sample-results.js";
import { drawRadar } from "./radar-chart.js";
import {
  clearHistory,
  compareResults,
  deleteResult,
  loadStore,
  saveProgress,
  saveResult,
} from "./history.js";

const app = document.querySelector("#app");
let state = initialState();

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
}

function persistProgress() {
  try { saveProgress(localStorage, { ...state, startedAt: state.startedAt ?? new Date().toISOString() }); }
  catch { state = { ...state, storageWarning: "この環境では回答途中と履歴を保存できません。" }; }
}

function completeResult(answerCount) {
  const scored = scoreAnswers(state.answers, answerCount);
  const model = buildResultModel(scored);
  const result = {
    id: crypto.randomUUID(),
    completedAt: new Date().toISOString(),
    answerCount,
    mode: state.mode,
    instrumentId: "sample-big-five",
    instrumentVersion: "sample-v1",
    scoringVersion: "sample-v1",
    resultContentVersion: "sample-v1",
    scores: scored.scores,
    title: model.title,
  };
  try { saveResult(localStorage, result); } catch { state.storageWarning = "結果を履歴へ保存できませんでした。"; }
  return { scored, model, result };
}

function render() {
  if (state.screen === "start") renderStart();
  if (state.screen === "questions") renderQuestion();
  if (state.screen === "basicResult") renderResult(20);
  if (state.screen === "detailedResult") renderResult(50);
  if (state.screen === "history") renderHistory();
  if (state.screen === "compare") renderCompare();
  app.focus({ preventScroll: true });
}
```

Continue the same file with concrete renderers that:

- Render start buttons for manual and demo modes.
- Fill `state.answers` with `makeDemoAnswers(50)` for demo mode and show the basic result first.
- Render one question and five buttons labeled `まったく当てはまらない` through `とても当てはまる`.
- Call `transition` after every answer and `persistProgress`.
- Render the C-layout result with title, summary, radar Canvas, reason, all score bars, disclaimer, share button, and continue button after 20 items.
- Render history entries with delete and two-item selection.
- Render compare deltas only after `compareResults` succeeds.

Do not interpolate question text or persisted values without `escapeHtml`.

- [ ] **Step 4: Run the browser smoke flow**

Run: `npm.cmd run prototype`

Verify at `http://localhost:4173`:

1. Manual answer reaches item 2.
2. Back returns to item 1 without losing its response.
3. Demo mode reaches the 20-item result immediately.
4. Continue reaches the 50-item result.
5. Reload resumes an incomplete manual run.
6. No horizontal scrolling occurs at 360px.

- [ ] **Step 5: Commit**

```powershell
git add prototype-big-five/index.html prototype-big-five/styles.css prototype-big-five/app.js
git commit -m "feat: build mobile prototype flow"
```

---

### Task 6: Share Card and Capability Fallbacks

**Files:**
- Create: `prototype-big-five/share-card.js`
- Create: `prototype-big-five/tests/share.test.js`
- Modify: `prototype-big-five/app.js`
- Modify: `prototype-big-five/styles.css`

**Interfaces:**
- Produces: `buildShareText(result)`, `drawShareCard(canvas, result)`, `canvasToBlob(canvas)`, `shareResult(result, canvas)`.
- Browser fallback order: file-capable Web Share → PNG download and text copy → selectable text.

- [ ] **Step 1: Write share-text tests**

```js
// prototype-big-five/tests/share.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { buildShareText } from "../share-card.js";

test("share text identifies sample status and answer count without raw answers", () => {
  const text = buildShareText({
    answerCount: 20,
    title: "探究する調整役",
    scores: { O: 82, C: 68, E: 41, A: 74, N: 57 },
  });
  assert.match(text, /体験用サンプル/);
  assert.match(text, /20問版/);
  assert.match(text, /探究する調整役/);
  assert.doesNotMatch(text, /answers/);
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `npm.cmd test`

Expected: FAIL because `share-card.js` does not exist.

- [ ] **Step 3: Implement share generation**

```js
// prototype-big-five/share-card.js
import { drawRadar } from "./radar-chart.js";

const labels = { O: "開放性", C: "勤勉性", E: "外向性", A: "協調性", N: "感情反応性" };

export function buildShareText(result) {
  const scoreText = Object.entries(result.scores)
    .map(([factor, score]) => `${labels[factor]} ${score}`)
    .join(" / ");
  return `Big Five 体験用サンプル ${result.answerCount}問版\n${result.title}\n${scoreText}\n※尺度内スコア・正式な診断ではありません`;
}

export function drawShareCard(canvas, result) {
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  context.fillStyle = "#f4f6f5";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#172d3b";
  context.font = "700 44px system-ui";
  context.fillText(`BIG FIVE / ${result.answerCount}問版`, 80, 100);
  context.font = "800 72px system-ui";
  context.fillText(result.title, 80, 210);
  const radar = document.createElement("canvas");
  radar.width = 480;
  radar.height = 480;
  drawRadar(radar, result.scores);
  context.drawImage(radar, 300, 280);
  context.font = "500 34px system-ui";
  Object.entries(result.scores).forEach(([factor, score], index) => {
    context.fillText(`${labels[factor]}  ${score}`, 120, 850 + index * 62);
  });
  context.font = "500 26px system-ui";
  context.fillStyle = "#5e6b67";
  context.fillText("体験用サンプル・尺度内スコア・正式な診断ではありません", 80, 1280);
}

export function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("画像を生成できませんでした")), "image/png");
  });
}
```

- [ ] **Step 4: Add browser capability fallbacks**

In `app.js`, add share preview rendering and handlers:

```js
async function handleShare(result, canvas) {
  const text = buildShareText(result);
  try {
    const blob = await canvasToBlob(canvas);
    const file = new File([blob], `big-five-sample-${result.answerCount}.png`, { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text });
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
    await navigator.clipboard?.writeText(text);
  } catch {
    renderSelectableShareText(text);
  }
}
```

- [ ] **Step 5: Verify sharing**

Run: `npm.cmd test`

Expected: all tests pass.

Manual checks:

1. Share preview shows the same title and scores as the result.
2. PNG includes `体験用サンプル`.
3. PNG contains no answers, timestamp, or device information.
4. Desktop fallback downloads PNG.
5. Clipboard denial displays selectable text.

- [ ] **Step 6: Commit**

```powershell
git add prototype-big-five/share-card.js prototype-big-five/tests/share.test.js prototype-big-five/app.js prototype-big-five/styles.css
git commit -m "feat: add prototype result sharing"
```

---

### Task 7: Final Verification and Prototype Notes

**Files:**
- Create: `prototype-big-five/NOTES.md`
- Modify: `docs/superpowers/specs/2026-07-20-big-five-prototype-design.md` only if implementation reveals a confirmed discrepancy.

**Interfaces:**
- Produces the one-command handoff and durable prototype verdict template.

- [ ] **Step 1: Create the verdict capture file**

```markdown
# Big Five UI Prototype Notes

## Question

Does the approved C layout make a sample Big Five experience feel evidence-based, understandable, and worth continuing from 20 to 50 questions?

## Run

```powershell
npm.cmd run prototype
```

Open `http://localhost:4173`.

## Verdict

- 20問までの負担感:
- 追加30問へ進みたいか:
- 結果画面の信頼感:
- 称号と数値のバランス:
- 共有画像の情報量:
- 履歴比較の価値:
- 本番へ採用する要素:
- 捨てる要素:
```

- [ ] **Step 2: Run the complete automated suite**

Run:

```powershell
npm.cmd test
```

Expected:

```text
tests 12
pass 12
fail 0
```

If Node reports more than 12 tests because additional focused cases were added, require `fail 0`.

- [ ] **Step 3: Run the complete mobile smoke test**

Run:

```powershell
npm.cmd run prototype
```

Verify:

1. Start, manual answer, back, and reload resume.
2. Demo answer displays 20-item C-layout result.
3. Continue displays 50-item detailed result.
4. Both results save to local history with correct modes and versions.
5. Compatible results compare.
6. 20- and 50-item results refuse comparison with an explanation.
7. Individual deletion and full deletion work.
8. Share preview, download, copy, and fallback work.
9. 360px viewport has no horizontal scroll.
10. Keyboard-only operation reaches the result.

- [ ] **Step 4: Inspect the saved data**

In browser developer tools, inspect `localStorage["bigFivePrototype:v1"]`.

Expected:

- In-progress state contains answers only while a run is incomplete.
- Completed history contains no `answers` property.
- Every history result contains `instrumentVersion`, `scoringVersion`, and `resultContentVersion`.

- [ ] **Step 5: Confirm the working tree contains only intended changes**

Run:

```powershell
git status --short
```

Expected: only `prototype-big-five/`, `package.json`, this plan, and any explicitly approved spec correction are uncommitted.

- [ ] **Step 6: Commit the verified prototype**

```powershell
git add prototype-big-five/NOTES.md docs/superpowers/plans/2026-07-20-big-five-prototype.md
git commit -m "docs: add prototype runbook and verdict template"
```

---

## Implementation Review Checklist

- [ ] All 50 sample items are visibly marked as non-diagnostic.
- [ ] First 20 items contain four items per factor.
- [ ] The 20-item result is always available before continuation.
- [ ] The 50-item result never claims 30 facets.
- [ ] C-layout title, score, reason, and disclaimer are above the fold or immediately reachable.
- [ ] No public URL or network response persistence exists.
- [ ] History comparison enforces answer count and version equality.
- [ ] Share artifacts contain no raw answers or hidden personal data.
- [ ] `npm.cmd test` passes.
- [ ] `npm.cmd run prototype` is the only startup command.
- [ ] `NOTES.md` is ready for the user's verdict.
