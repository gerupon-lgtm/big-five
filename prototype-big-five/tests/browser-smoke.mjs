import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const APP_URL = "http://localhost:4173/";
const executable = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find(existsSync);

assert.ok(executable, "Chrome or Edge is required for the browser smoke test");

const port = 9300 + Math.floor(Math.random() * 500);
const profilePath = join(tmpdir(), `big-five-browser-smoke-${Date.now()}`);
const browserProcess = spawn(executable, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profilePath}`,
  "about:blank",
], { stdio: "ignore", windowsHide: true });

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function poll(action, timeout = 10_000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeout) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      await delay(100);
    }
  }
  throw lastError ?? new Error("Timed out");
}

let socket;
let commandId = 0;
const pending = new Map();
const eventWaiters = new Map();
const browserExceptions = [];

function waitForEvent(method, timeout = 5_000) {
  return new Promise((resolveEvent, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeout);
    eventWaiters.set(method, (params) => {
      clearTimeout(timer);
      eventWaiters.delete(method);
      resolveEvent(params);
    });
  });
}

function command(method, params = {}) {
  commandId += 1;
  return new Promise((resolveCommand, reject) => {
    pending.set(commandId, { resolveCommand, reject });
    socket.send(JSON.stringify({ id: commandId, method, params }));
  });
}

async function evaluate(expression) {
  const response = await command("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.text ?? "Browser evaluation failed");
  }
  return response.result.value;
}

async function click(selector) {
  const clicked = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return false;
    element.click();
    return true;
  })()`);
  assert.equal(clicked, true, `Expected clickable element: ${selector}`);
  await delay(40);
}

async function reload() {
  const loaded = waitForEvent("Page.loadEventFired");
  await command("Page.reload", { ignoreCache: true });
  await loaded;
  await delay(40);
}

async function assertScreen(text) {
  const appText = await evaluate("document.querySelector('#app')?.innerText ?? ''");
  assert.match(appText, new RegExp(text));
  assert.match(appText, /体験用サンプル・正式な診断ではありません/);
  const dimensions = await evaluate(`({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  })`);
  assert.equal(dimensions.viewport, 360);
  assert.ok(dimensions.content <= dimensions.viewport, `horizontal overflow: ${dimensions.content} > ${dimensions.viewport}`);
}

try {
  await poll(() => fetchJson(`http://127.0.0.1:${port}/json/version`));
  const target = await fetchJson(`http://127.0.0.1:${port}/json/new?about%3Ablank`, { method: "PUT" });
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => {
    socket.addEventListener("open", resolveOpen, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const handlers = pending.get(message.id);
      if (!handlers) return;
      pending.delete(message.id);
      if (message.error) handlers.reject(new Error(message.error.message));
      else handlers.resolveCommand(message.result);
      return;
    }
    if (message.method === "Runtime.exceptionThrown") {
      browserExceptions.push(message.params.exceptionDetails.text);
    }
    eventWaiters.get(message.method)?.(message.params);
  });

  await command("Page.enable");
  await command("Runtime.enable");
  await command("Emulation.setDeviceMetricsOverride", {
    width: 360,
    height: 800,
    deviceScaleFactor: 1,
    mobile: true,
  });
  const loaded = waitForEvent("Page.loadEventFired");
  await command("Page.navigate", { url: APP_URL });
  await loaded;
  await delay(80);
  await evaluate("localStorage.clear()");
  await reload();

  await assertScreen("自分の傾向");
  await click("#manual-start");
  await assertScreen("設問 1 / 20");
  await click('[data-answer="3"]');
  await assertScreen("設問 2 / 20");
  await click("#back-button");
  await assertScreen("設問 1 / 20");
  assert.equal(
    await evaluate("document.querySelector('[data-answer=\"3\"]')?.getAttribute('aria-pressed')"),
    "true",
  );
  await reload();
  await assertScreen("設問 1 / 20");
  assert.equal(
    await evaluate("document.querySelector('[data-answer=\"3\"]')?.getAttribute('aria-pressed')"),
    "true",
  );

  for (let index = 0; index < 20; index += 1) {
    await click('[data-answer="3"]');
  }
  await assertScreen("基本結果 / 20問");
  assert.equal(
    await evaluate("JSON.parse(localStorage.getItem('bigFivePrototype:v1')).history.filter((result) => result.answerCount === 20).length"),
    1,
  );
  await reload();
  await assertScreen("基本結果 / 20問");
  assert.equal(
    await evaluate("JSON.parse(localStorage.getItem('bigFivePrototype:v1')).history.filter((result) => result.answerCount === 20).length"),
    1,
  );
  await click("#result-history");
  await assertScreen("結果履歴");
  await click("#resume-from-history");
  await assertScreen("基本結果 / 20問");
  assert.equal(
    await evaluate("JSON.parse(localStorage.getItem('bigFivePrototype:v1')).history.filter((result) => result.answerCount === 20).length"),
    1,
  );
  await click("#continue-button");
  await assertScreen("設問 21 / 50");

  await click("#brand-link");
  await click("#demo-start");
  await assertScreen("基本結果 / 20問");
  await click("#continue-button");
  await assertScreen("精密結果 / 50問");

  await click("#new-run");
  await click("#demo-start");
  await assertScreen("基本結果 / 20問");
  await click("#result-history");
  await assertScreen("結果履歴");
  assert.ok(await evaluate("document.querySelectorAll('.history-item').length >= 3"));
  await evaluate(`(() => {
    const store = JSON.parse(localStorage.getItem("bigFivePrototype:v1"));
    const twentyItemResults = store.history.filter((result) => result.answerCount === 20);
    Object.assign(twentyItemResults[0], {
      completedAt: "2026-07-02T09:00:00.000Z",
      title: "新しい結果",
      scores: { O: 75, C: 50, E: 50, A: 50, N: 50 },
    });
    Object.assign(twentyItemResults[1], {
      completedAt: "2026-07-01T09:00:00.000Z",
      title: "古い結果",
      scores: { O: 25, C: 50, E: 50, A: 50, N: 50 },
    });
    localStorage.setItem("bigFivePrototype:v1", JSON.stringify(store));
  })()`);
  await click("#history-start");
  await click("#history-button");

  const selectNextTwenty = `(() => {
    const item = [...document.querySelectorAll('.history-item')]
      .find((entry) => entry.innerText.includes('20問') && !entry.querySelector('input').checked);
    item?.querySelector('input').click();
    return Boolean(item);
  })()`;
  assert.equal(await evaluate(selectNextTwenty), true);
  await delay(40);
  assert.equal(await evaluate("document.activeElement?.matches('[data-select-index]')"), true);
  assert.equal(await evaluate(selectNextTwenty), true);
  await delay(40);
  assert.equal(await evaluate("document.activeElement?.id"), "compare-button");
  await click("#compare-button");
  await assertScreen("過去結果との比較");
  assert.equal(await evaluate("document.querySelector('#comparison-heading')?.innerText"), "古い結果 と 新しい結果");
  assert.deepEqual(
    await evaluate(`(() => {
      const row = [...document.querySelectorAll(".comparison-row")]
        .find((candidate) => candidate.innerText.includes("開放性"));
      return [...row.children].map((cell) => cell.innerText);
    })()`),
    ["開放性", "25", "75", "+50"],
  );

  await click("#compare-back");
  const historyCount = await evaluate("document.querySelectorAll('.history-item').length");
  await click("[data-delete-index]");
  assert.equal(await evaluate("document.querySelectorAll('.history-item').length"), historyCount - 1);
  assert.equal(await evaluate("document.activeElement?.matches('[data-delete-index], #restart-from-history')"), true);
  await evaluate("window.confirm = () => true");
  await click("#clear-history");
  await assertScreen("保存済みの結果はありません");
  assert.equal(await evaluate("document.activeElement?.id"), "restart-from-history");
  await click("#restart-from-history");
  await assertScreen("設問 1 / 20");

  assert.deepEqual(browserExceptions, []);
  console.log("Browser smoke passed: checkpoint reload→history→item 21 without duplicates, chronological compare labels/sign, focus restoration, and 360px no overflow.");
} finally {
  try {
    if (socket?.readyState === WebSocket.OPEN) {
      await command("Browser.close");
      socket.close();
    }
  } catch {
    browserProcess.kill();
  }
  await delay(200);
  browserProcess.kill();
  const resolvedProfile = resolve(profilePath);
  const resolvedTemp = resolve(tmpdir());
  if (resolvedProfile.startsWith(`${resolvedTemp}\\`)) {
    rmSync(resolvedProfile, { recursive: true, force: true, maxRetries: 3 });
  }
}
