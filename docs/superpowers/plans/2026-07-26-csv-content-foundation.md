# CSV Content Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Excelで編集した版付きCSVを厳密に検証し、決定的なJSONへ変換できる基盤を作り、現行の設問・称号・結果文・根拠を正しい承認状態のCSVへ移行する。

**Architecture:** Node.js組込みAPIだけで、`byte decode -> CSV parse -> table schema -> domain compile -> cross-reference validation -> deterministic JSON`の純粋なパイプラインを構成する。第1段階では既存ES Modulesを実行時正典として残しつつ、CSVとの意味的等価性テストで二重更新を禁止する。Q-006、Q-012、Q-013が未承認の間はrelease buildを必ず拒否し、実行時切替とPages配布は別計画で行う。

**Tech Stack:** Node.js ES Modules、Node標準`node:test`、`TextDecoder`、`node:crypto`、JSON、RFC 4180相当CSV、既存domain validator

## Global Constraints

- 対象worktreeは`C:\Users\user\Documents\診断系アプリ開発\.worktrees\big-five-q006`、branchは`codex/big-five-q006`とする。
- 人が編集する正典は`content/source/`以下の用途別・版別CSVとし、生成JSONを手編集しない。
- 入力はUTF-8 BOM付き、UTF-8 BOMなし、CP932（Windows-31J）を受け付け、生成JSONはBOMなしUTF-8・LF・末尾改行ありとする。
- ASCIIだけの入力はUTF-8と判定し、復号置換文字、不正バイト、混在を検出できた入力を拒否する。
- `status`は`draft`、`reviewed`、`approved`、`rejected`だけを許可する。
- 公開releaseは参照行と別承認台帳の両方がapprovedの場合だけ生成できる。
- Q-006はE-0〜E-5、T-0〜T-4、F-1〜F-5、X-1〜X-2の全approval recordが揃うまで`Content Approval pending`を維持する。
- Q-012は承認済み3体パイロットと量産アセットが揃うまでreleaseへ含めない。
- Q-013は全パレット・香調・用途色の承認済み実データが揃うまでreleaseへ含めない。
- 公開済み版を上書きせず、過去版と`release-history.csv`を保持する。
- CSV、JSON、ログへ生回答、結果履歴、利用者情報、秘密情報を含めない。
- `prototype-big-five/`を変更せず、正式データの移植元にしない。
- テスト生成物は一時ディレクトリへ出力し、`app/content/`を変更しない。

---

## File Map

### New build modules

- `scripts/content/content-error.mjs` — 安定エラーコード、ファイル・行・列情報、Markdown report投影。
- `scripts/content/encoding.mjs` — UTF-8/CP932のstrict判定とUnicode復号。
- `scripts/content/csv-parser.mjs` — RFC 4180相当の解析と物理行番号保持。
- `scripts/content/csv-writer.mjs` — 初期移行用の決定的CSV出力。
- `scripts/content/schema-loader.mjs` — CSV schema descriptorのexact validation。
- `scripts/content/table-loader.mjs` — 復号、解析、列schema検証を1入口へ統合。
- `scripts/content/compile-diagnosis.mjs` — 診断、設問、20問集合をruntime shapeへ変換。
- `scripts/content/compile-result-content.mjs` — 称号、結果文、根拠をruntime shapeへ変換。
- `scripts/content/compile-presentation.mjs` — 色・香り・selectorをQ-013 shapeへ変換。
- `scripts/content/compile-characters.mjs` — Q-012 character manifestを変換。
- `scripts/content/content-compiler.mjs` — release解決、全参照検証、JSON resource生成。
- `scripts/content/validate-content.mjs` — authoring validation CLI。
- `scripts/content/build-content.mjs` — approved release build CLI。
- `scripts/content/export-current-content.mjs` — 現行ES Modulesから初期CSVを一度生成する移行ツール。

### New schemas and source

- `content/schemas/*.schema.json` — 固定列順、型、enum、空欄許可を表すCSV schema descriptor。
- `content/source/releases/release-manifest.csv` — 公開候補。基盤完了時点ではヘッダーのみ。
- `content/source/releases/release-history.csv` — 追記専用公開履歴。基盤完了時点ではヘッダーのみ。
- `content/source/diagnoses/<version>/diagnosis-sets.csv`
- `content/source/diagnoses/<version>/diagnosis-sources.csv`
- `content/source/diagnoses/<version>/diagnosis-limitations.csv`
- `content/source/diagnoses/<version>/factor-definitions.csv`
- `content/source/questions/<version>/questions.csv`
- `content/source/questions/<version>/preview-questions.csv`
- `content/source/titles/<version>/title-profiles.csv`
- `content/source/titles/<version>/title-profile-factors.csv`
- `content/source/result-texts/<version>/result-texts.csv`
- `content/source/result-texts/<version>/result-text-evidence.csv`
- `content/source/evidence/<version>/result-evidence.csv`
- `content/fixtures/invalid/` — 文字コード、列、参照、承認状態の失敗fixture。

### Tests and existing files

- `app/tests/content-csv-io.test.js` — 文字コード、CSV構文、CSV出力。
- `app/tests/content-table-schema.test.js` — exact columns、型、値、エラーreport。
- `app/tests/content-diagnosis-compiler.test.js` — 50問、20問、因子、方向。
- `app/tests/content-result-compiler.test.js` — 51称号、237結果文、根拠。
- `app/tests/content-presentation-character-compiler.test.js` — Q-012/Q-013 schemaと禁止表現。
- `app/tests/content-compiler.test.js` — release gate、決定性、hash、部分生成防止。
- `app/tests/content-migration-parity.test.js` — 現行ES ModulesとCSVの意味的等価性。
- Modify: `package.json` — focused content commandsを追加。
- Modify: `.gitignore` — `app/content/`を追加。
- Modify: `scripts/check-static.mjs` — source CSVと生成物の漏えい契約を追加。
- Modify: `AGENTS.md`、`docs/基本設計サマリ.md`、`docs/data-model.md`、`docs/processing-design.md`、`docs/screens.md`、`docs/tasks.md` — 基盤完成時点の正典・移行状態を同期。
- Create: `docs/content-authoring.md` — Excel編集、検証、エラー修正、承認状態の運用手順。

---

### Task 1: Strict Encoding and CSV I/O

**Files:**
- Create: `scripts/content/content-error.mjs`
- Create: `scripts/content/encoding.mjs`
- Create: `scripts/content/csv-parser.mjs`
- Create: `scripts/content/csv-writer.mjs`
- Create: `app/tests/content-csv-io.test.js`

**Interfaces:**
- Produces: `decodeCsvBytes(bytes, sourceName) -> { text, encoding }`
- Produces: `parseCsv(text, sourceName) -> { headers: string[], rows: { lineNumber: number, values: string[] }[] }`
- Produces: `serializeCsv(headers, rows) -> string`
- Produces: `ContentError({ code, sourceName, lineNumber, columnName, message, safeValue })`

- [ ] **Step 1: Write failing strict decoding tests**

```js
test("T-011 CSV decoder accepts UTF-8 BOM, UTF-8, and CP932", () => {
  assert.deepEqual(decodeCsvBytes(
    Uint8Array.from([0xef, 0xbb, 0xbf, ...new TextEncoder().encode("text\nあ\n")]),
    "utf8-bom.csv",
  ), { text: "text\nあ\n", encoding: "utf-8-bom" });
  assert.deepEqual(decodeCsvBytes(
    new TextEncoder().encode("text\nあ\n"),
    "utf8.csv",
  ), { text: "text\nあ\n", encoding: "utf-8" });
  assert.deepEqual(decodeCsvBytes(
    Uint8Array.from([0x74, 0x65, 0x78, 0x74, 0x0d, 0x0a, 0x82, 0xa0, 0x0d, 0x0a]),
    "cp932.csv",
  ), { text: "text\r\nあ\r\n", encoding: "cp932" });
});

test("decoder rejects replacement characters and invalid CP932 tails", () => {
  assert.throws(
    () => decodeCsvBytes(Uint8Array.from([0x82]), "broken.csv"),
    (error) => error.code === "CSV_ENCODING_INVALID",
  );
  assert.throws(
    () => decodeCsvBytes(new TextEncoder().encode("text\n�\n"), "replacement.csv"),
    (error) => error.code === "CSV_REPLACEMENT_CHARACTER",
  );
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test app/tests/content-csv-io.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/content/encoding.mjs`.

- [ ] **Step 3: Implement strict UTF-8 then CP932 decoding**

```js
const utf8 = new TextDecoder("utf-8", { fatal: true });
const cp932 = new TextDecoder("shift_jis", { fatal: true });

export function decodeCsvBytes(bytes, sourceName) {
  const input = Uint8Array.from(bytes);
  const hasBom = input.length >= 3 &&
    input[0] === 0xef && input[1] === 0xbb && input[2] === 0xbf;
  const body = hasBom ? input.subarray(3) : input;
  let text;
  let encoding;
  try {
    text = utf8.decode(body);
    encoding = hasBom ? "utf-8-bom" : "utf-8";
  } catch {
    try {
      text = cp932.decode(input);
      encoding = "cp932";
    } catch {
      throw new ContentError({
        code: "CSV_ENCODING_INVALID",
        sourceName,
        message: "UTF-8またはCP932として復号できません。",
      });
    }
  }
  if (text.includes("\ufffd")) {
    throw new ContentError({
      code: "CSV_REPLACEMENT_CHARACTER",
      sourceName,
      message: "置換文字を含むCSVは受け付けられません。",
    });
  }
  return { text, encoding };
}
```

- [ ] **Step 4: Add failing CSV syntax and round-trip tests**

```js
test("CSV parser preserves commas, quotes, embedded CRLF, and physical line numbers", () => {
  const parsed = parseCsv(
    'id,text,status\r\nq-1,"A, B","approved"\r\nq-2,"1行目\r\n2行目",reviewed\r\n',
    "questions.csv",
  );
  assert.deepEqual(parsed.headers, ["id", "text", "status"]);
  assert.deepEqual(parsed.rows, [
    { lineNumber: 2, values: ["q-1", "A, B", "approved"] },
    { lineNumber: 3, values: ["q-2", "1行目\r\n2行目", "reviewed"] },
  ]);
  assert.equal(
    serializeCsv(parsed.headers, parsed.rows.map(({ values }) => values)),
    'id,text,status\r\nq-1,"A, B",approved\r\nq-2,"1行目\r\n2行目",reviewed\r\n',
  );
});
```

- [ ] **Step 5: Implement a state-machine parser and deterministic writer**

Implement four parser states—unquoted, quoted, after-quote, row-end—and increment the physical line counter for CRLF or LF outside and inside quoted cells. Reject quote-in-unquoted-cell, characters after a closing quote, inconsistent cell counts, duplicate/empty headers, and unterminated quotes with `CSV_SYNTAX_INVALID`.

```js
export function serializeCsv(headers, rows) {
  const quote = (value) => /[",\r\n]/.test(value)
    ? `"${value.replaceAll('"', '""')}"`
    : value;
  return [headers, ...rows]
    .map((row) => row.map((value) => quote(String(value))).join(","))
    .join("\r\n") + "\r\n";
}
```

- [ ] **Step 6: Run the focused tests**

Run: `node --test app/tests/content-csv-io.test.js`

Expected: PASS, including BOM, no-BOM, CP932, invalid byte, embedded newline, quoted comma, doubled quote, and round-trip cases.

- [ ] **Step 7: Commit**

```powershell
git add scripts/content/content-error.mjs scripts/content/encoding.mjs scripts/content/csv-parser.mjs scripts/content/csv-writer.mjs app/tests/content-csv-io.test.js
git commit -m "feat: add strict CSV input foundation"
```

---

### Task 2: Exact Table Schemas and Japanese Reports

**Files:**
- Create: `content/schemas/releases.schema.json`
- Create: `content/schemas/diagnoses.schema.json`
- Create: `content/schemas/questions.schema.json`
- Create: `content/schemas/titles.schema.json`
- Create: `content/schemas/result-texts.schema.json`
- Create: `content/schemas/evidence.schema.json`
- Create: `content/schemas/presentation.schema.json`
- Create: `content/schemas/characters.schema.json`
- Create: `scripts/content/schema-loader.mjs`
- Create: `scripts/content/table-loader.mjs`
- Create: `scripts/content/report-content-errors.mjs`
- Create: `app/tests/content-table-schema.test.js`

**Interfaces:**
- Consumes: `decodeCsvBytes`, `parseCsv`, `ContentError`
- Produces: `loadTableSchema(schemaPath) -> CsvTableSchema`
- Produces: `loadCsvTable({ filePath, schema }) -> { encoding, rows: object[] }`
- Produces: `formatContentErrors(errors) -> string`

- [ ] **Step 1: Define and test the schema descriptor contract**

Use this exact descriptor shape for every table:

```json
{
  "schemaVersion": 1,
  "fileName": "questions.csv",
  "columns": [
    { "name": "question_id", "type": "id", "required": true },
    { "name": "question_version", "type": "version", "required": true },
    { "name": "display_order", "type": "integer", "minimum": 1, "required": true },
    { "name": "text", "type": "text", "required": true },
    { "name": "factor_id", "type": "enum", "values": ["intellectImagination", "conscientiousness", "extraversion", "agreeableness", "emotionalStability"], "required": true },
    { "name": "direction", "type": "enum", "values": ["positive", "reverse"], "required": true },
    { "name": "source_ref", "type": "text", "required": true },
    { "name": "status", "type": "enum", "values": ["draft", "reviewed", "approved", "rejected"], "required": true }
  ]
}
```

Test that unknown descriptor fields, duplicate column names, unsupported types, missing enum values, and non-integer minimums throw `CSV_SCHEMA_INVALID`.

- [ ] **Step 2: Run the schema test and verify it fails**

Run: `node --test app/tests/content-table-schema.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `schema-loader.mjs`.

- [ ] **Step 3: Implement exact descriptor validation and typed row conversion**

```js
export async function loadCsvTable({ filePath, schema }) {
  const bytes = await readFile(filePath);
  const { text, encoding } = decodeCsvBytes(bytes, filePath);
  const parsed = parseCsv(text, filePath);
  const expectedHeaders = schema.columns.map(({ name }) => name);
  if (!isDeepStrictEqual(parsed.headers, expectedHeaders)) {
    throw new ContentError({
      code: "CSV_COLUMNS_INVALID",
      sourceName: filePath,
      lineNumber: 1,
      message: `列順は ${expectedHeaders.join(",")} である必要があります。`,
    });
  }
  return {
    encoding,
    rows: parsed.rows.map((row) => convertRow(row, schema, filePath)),
  };
}
```

`convertRow`はtrimせず、`integer`だけ10進整数へ変換する。必須空欄は`CSV_REQUIRED_VALUE_MISSING`、enum不正は`CSV_VALUE_INVALID`、数値不正は`CSV_INTEGER_INVALID`とする。

- [ ] **Step 4: Test file/row/column reporting**

```js
test("reports exact source, one-based row, column, code, and Japanese message", () => {
  const report = formatContentErrors([
    new ContentError({
      code: "CSV_REQUIRED_VALUE_MISSING",
      sourceName: "result-texts.csv",
      lineNumber: 18,
      columnName: "text",
      message: "必須の結果文が空欄です。",
    }),
  ]);
  assert.match(report, /result-texts\.csv: 18行目 \/ text/);
  assert.match(report, /CSV_REQUIRED_VALUE_MISSING/);
  assert.match(report, /必須の結果文が空欄です。/);
});
```

- [ ] **Step 5: Run the focused tests**

Run: `node --test app/tests/content-table-schema.test.js`

Expected: PASS for exact columns, missing/unknown columns, types, enum, no implicit trim, and Japanese report.

- [ ] **Step 6: Commit**

```powershell
git add content/schemas scripts/content/schema-loader.mjs scripts/content/table-loader.mjs scripts/content/report-content-errors.mjs app/tests/content-table-schema.test.js
git commit -m "feat: validate CSV table contracts"
```

---

### Task 3: Diagnosis and Question Compiler

**Files:**
- Create: `scripts/content/compile-diagnosis.mjs`
- Create: `app/tests/content-diagnosis-compiler.test.js`
- Modify: `content/schemas/diagnoses.schema.json`
- Modify: `content/schemas/questions.schema.json`

**Interfaces:**
- Consumes: `loadCsvTable`
- Produces: `compileDiagnosisContent({ diagnosisRows, sourceRows, limitationRows, factorRows, questionRows, previewRows }) -> { diagnostic, factors, questions }`

- [ ] **Step 1: Write a failing authority test**

```js
test("T-002 CSV compiler produces the fixed 50 questions and 20-question subset", () => {
  const compiled = compileDiagnosisContent(validRows());
  assert.equal(compiled.questions.length, 50);
  assert.deepEqual(
    compiled.diagnostic.previewQuestionIds,
    IPIP_JA_50_AUTHORITY_FIXTURE.previewQuestionIds,
  );
  assert.equal(
    validateDefinitionAuthority(
      compiled,
      definitionVersions,
      IPIP_JA_50_AUTHORITY_FIXTURE,
    ),
    compiled,
  );
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test app/tests/content-diagnosis-compiler.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `compile-diagnosis.mjs`.

- [ ] **Step 3: Implement row-to-domain projection**

```js
export function compileDiagnosisContent({
  diagnosisRows, sourceRows, limitationRows, factorRows, questionRows, previewRows,
}) {
  assertCount(questionRows, 50, "QUESTION_COUNT_INVALID");
  assertCount(previewRows, 20, "PREVIEW_QUESTION_COUNT_INVALID");
  assertUnique(questionRows, "question_id");
  assertUnique(questionRows, "display_order");
  const previewIds = new Set(previewRows.map(({ question_id }) => question_id));
  const questions = questionRows
    .toSorted((a, b) => a.display_order - b.display_order)
    .map((row) => ({
      id: row.question_id,
      order: row.display_order,
      textJa: row.text,
      factorId: row.factor_id,
      keyedDirection: row.direction === "reverse" ? "negative" : "positive",
      sourceItemId: row.source_ref,
      previewIncluded: previewIds.has(row.question_id),
    }));
  const questionIds = new Set(questions.map(({ id }) => id));
  for (const row of previewRows) {
    if (!questionIds.has(row.question_id)) {
      throw referenceError(row, "question_id", "QUESTION_REFERENCE_UNKNOWN");
    }
  }
  return buildAndValidateDiagnosis({
    diagnosisRow: diagnosisRows[0],
    sourceRows,
    limitationRows,
    factorRows,
    questions,
    previewRows,
  });
}
```

`buildAndValidateDiagnosis`は`diagnosis-sources.csv`、`diagnosis-limitations.csv`、`factor-definitions.csv`を`display_order`順に投影し、`validateDefinitionStructure`と`validateDefinitionAuthority`を呼ぶ。実装はID、`textJa`、因子、`keyedDirection`、20問集合を`app/tests/fixtures/ipip-ja-50-authority.fixture.js`と比較する。ランダム化、IDによる暗黙sort、同一版の変更は禁止する。

- [ ] **Step 4: Add negative contract cases**

Reject 49/51 questions, 19/21 preview rows, duplicate ID/order, unknown factor, unknown direction, preview reference missing from the 50, mixed `question_version`, and a modified authority literal.

- [ ] **Step 5: Run the focused tests**

Run: `node --test app/tests/content-diagnosis-compiler.test.js`

Expected: PASS for the authority fixture and all negative cases.

- [ ] **Step 6: Commit**

```powershell
git add scripts/content/compile-diagnosis.mjs content/schemas/diagnoses.schema.json content/schemas/questions.schema.json app/tests/content-diagnosis-compiler.test.js
git commit -m "feat: compile diagnosis CSV content"
```

---

### Task 4: Title, Result Text, and Evidence Compiler

**Files:**
- Create: `scripts/content/compile-result-content.mjs`
- Create: `app/js/domain/title-profile.js`
- Create: `app/tests/content-result-compiler.test.js`
- Modify: `app/js/data/title-profile-definitions.js`
- Modify: `app/js/domain/title-classifier.js`
- Modify: `app/js/domain/presentation-definition-validator.js`
- Modify: `app/tests/result-content-definitions.test.js`
- Modify: `content/schemas/titles.schema.json`
- Modify: `content/schemas/result-texts.schema.json`
- Modify: `content/schemas/evidence.schema.json`

**Interfaces:**
- Consumes: `loadCsvTable`
- Produces: `validateTitleProfileDefinitions(value) -> value` from `app/js/domain/title-profile.js`
- Produces: `compileResultContent({ profileRows, profileFactorRows, textRows, textEvidenceRows, evidenceRows, resultTextVersion }) -> { titleProfiles, textDefinitions, evidenceDefinitions, resultTextVersion }`

- [ ] **Step 1: Write failing count, shape, and ordering tests**

```js
test("Q-006 CSV compiler preserves 51 titles and 237 result literals", () => {
  const compiled = compileResultContent(validResultRows());
  assert.equal(compiled.titleProfiles.length, 51);
  assert.equal(compiled.textDefinitions.length, 237);
  assert.equal(compiled.evidenceDefinitions.length, 6);
  assert.equal(validateTitleProfileDefinitions(compiled.titleProfiles), compiled.titleProfiles);
  assert.equal(validateResultTextDefinitions(compiled.textDefinitions), compiled.textDefinitions);
  assert.equal(validateResultContentDefinitions(compiled), true);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test app/tests/content-result-compiler.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `compile-result-content.mjs`.

- [ ] **Step 3: Implement normalized joins without wildcard inference**

First move the pure `validateTitleProfileDefinitions` implementation from `app/js/data/title-profile-definitions.js` to `app/js/domain/title-profile.js`; the data module imports and re-exports it during the migration. Change `title-classifier.js` and `presentation-definition-validator.js` to import the validator from `./title-profile.js`. This keeps the validator available after the static data module is removed.

```js
function appliesToFromRow(row) {
  const entries = [
    ["mode", row.mode],
    ["questionCount", row.mode === "preview20" ? 20 : row.mode === "detail50" ? 50 : ""],
    ["factorId", row.factor_id],
    ["band", row.band],
    ["titleId", row.title_id],
  ].filter(([, value]) => value !== "");
  return Object.fromEntries(entries);
}

const evidenceByTextId = groupOrdered(textEvidenceRows, "text_id");
const textDefinitions = textRows
  .toSorted(byDisplayOrder)
  .map((row) => ({
    id: row.text_id,
    version: row.result_text_version,
    appliesTo: appliesToFromRow(row),
    section: row.section,
    claimKind: row.claim_kind,
    text: row.text,
    evidenceRefs: (evidenceByTextId.get(row.text_id) ?? []).map(({ evidence_id }) => evidence_id),
    previewAllowed: row.preview_allowed === "true",
  }));
```

Section schema must explicitly allow each blank column combination. It must reject an inferred wildcard, duplicate evidence reference, unknown title/evidence/factor, 50-title or 238-text catalogs, noncanonical factor order, and prohibited ability/treatment/aroma claims using the existing validators and review tests.

- [ ] **Step 4: Add accurate approval-gate assertions**

The source status may be `reviewed`, but release eligibility must remain false until the external approval ledger reports every gate:

```js
assert.throws(
  () => assertReleaseEligible({
    rows: compiledSourceRows,
    approvals: { "E-0": "approved", "E-1": "draft" },
  }),
  (error) => error.code === "CONTENT_APPROVAL_PENDING",
);
```

- [ ] **Step 5: Run result tests**

Run: `node --test app/tests/content-result-compiler.test.js app/tests/result-content-definitions.test.js app/tests/result-composer.test.js`

Expected: PASS without changing the 51-title catalog or 237 literals.

- [ ] **Step 6: Commit**

```powershell
git add scripts/content/compile-result-content.mjs app/js/domain/title-profile.js app/js/domain/title-classifier.js app/js/domain/presentation-definition-validator.js app/js/data/title-profile-definitions.js content/schemas/titles.schema.json content/schemas/result-texts.schema.json content/schemas/evidence.schema.json app/tests/content-result-compiler.test.js app/tests/result-content-definitions.test.js
git commit -m "feat: compile result content CSVs"
```

---

### Task 5: Presentation and Character Compiler Contracts

**Files:**
- Create: `scripts/content/compile-presentation.mjs`
- Create: `scripts/content/compile-characters.mjs`
- Create: `app/tests/content-presentation-character-compiler.test.js`
- Modify: `content/schemas/presentation.schema.json`
- Modify: `content/schemas/characters.schema.json`

**Interfaces:**
- Produces: `compilePresentationContent(tables, expectedVersion) -> PresentationDefinition`
- Produces: `compileCharacterContent(rows, expectedVersion) -> CharacterManifest`

- [ ] **Step 1: Write failing normalized-join tests**

```js
test("Q-013 normalized CSVs compile to the exact presentation definition", () => {
  const compiled = compilePresentationContent(validPresentationRows(), "presentation-v1");
  assert.equal(validatePresentationDefinitionSet(compiled, {
    titleProfiles: validTitleProfiles(),
    expectedVersion: "presentation-v1",
  }), compiled);
  assert.equal(compiled.scenes.length, 3);
  assert.equal(compiled.titleSelectors.length, 51);
  for (const selector of compiled.titleSelectors) {
    assert.equal(selector.alternativePaletteIds.length, 2);
    assert.equal(selector.fragranceScenes.length, 3);
    assert.ok(selector.fragranceScenes.every(
      ({ candidateFragranceIds }) => candidateFragranceIds.length === 2,
    ));
  }
});
```

Use the exact Q-013 field names from `app/js/domain/presentation-definition-validator.js`. The CSV relation tables determine order through `display_order`; joins must never use filesystem order.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test app/tests/content-presentation-character-compiler.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for the two compiler modules.

- [ ] **Step 3: Implement presentation projection and prohibited-copy gates**

Project normalized rows to `schemaVersion`, `presentationDefinitionVersion`, `scenes`, `palettes`, `fragrances`, and `titleSelectors`, then call `validatePresentationDefinitionSet` with exact `titleProfiles` and `expectedVersion`. Reject product names, quantities, ingestion/application/diffuser instructions, and treatment or capability claims with stable codes from the Q-013 contract.

- [ ] **Step 4: Implement exact character manifest projection**

```js
export function compileCharacterContent(rows, expectedVersion) {
  assertCount(rows, 51, "CHARACTER_COUNT_INVALID");
  assertUnique(rows, "title_id");
  assertUnique(rows, "character_id");
  const entries = rows.toSorted(byDisplayOrder).map((row) => ({
    titleId: row.title_id,
    characterId: row.character_id,
    assetVersion: row.asset_version,
    src: assertSameOriginAssetPath(row.delivery_webp_path),
    sha256: assertLowerHexSha256(row.delivery_sha256),
    width: row.width,
    height: row.height,
    byteLength: row.byte_length,
    hasAlpha: row.has_alpha === "true",
    alt: row.alt,
  }));
  return deepFreeze({ schemaVersion: 1, characterManifestVersion: expectedVersion, entries });
}
```

Require all four Q-012 review statuses, `approvedBy`, and `approvedAt` before a row is release eligible. Compiler tests use synthetic approved fixtures only; do not mark production rows approved or invent image hashes.

- [ ] **Step 5: Run focused presentation/character tests**

Run: `node --test app/tests/content-presentation-character-compiler.test.js app/tests/presentation-definition.test.js`

Expected: PASS for exact schema and FAIL cases covering missing scenes, extra alternatives, unsafe fragrance copy, duplicate title mapping, external paths, invalid hash, and unapproved art.

- [ ] **Step 6: Commit**

```powershell
git add scripts/content/compile-presentation.mjs scripts/content/compile-characters.mjs content/schemas/presentation.schema.json content/schemas/characters.schema.json app/tests/content-presentation-character-compiler.test.js
git commit -m "feat: compile presentation and character CSVs"
```

---

### Task 6: Deterministic Release Compiler

**Files:**
- Create: `scripts/content/content-compiler.mjs`
- Create: `scripts/content/validate-content.mjs`
- Create: `scripts/content/build-content.mjs`
- Create: `app/tests/content-compiler.test.js`

**Interfaces:**
- Consumes: all four domain compilers.
- Produces: `validateAuthoringTree({ sourceDir }) -> { catalogs, warnings }`
- Produces: `compileRelease({ sourceDir, releaseId }) -> { manifest, resources: Map<string, string> }`
- Produces: `writeReleaseAtomically({ outputDir, compiled }) -> void`

- [ ] **Step 1: Write failing deterministic build tests**

```js
test("approved fixture release builds byte-identical JSON with hashes", async (t) => {
  const sourceDir = await createApprovedSourceTree(t);
  const first = await compileRelease({ sourceDir, releaseId: "release-test-v1" });
  const second = await compileRelease({ sourceDir, releaseId: "release-test-v1" });
  assert.deepEqual([...first.resources], [...second.resources]);
  for (const resource of first.manifest.resources) {
    assert.equal(
      resource.sha256,
      createHash("sha256").update(first.resources.get(resource.kind)).digest("hex"),
    );
  }
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test app/tests/content-compiler.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `content-compiler.mjs`.

- [ ] **Step 3: Implement canonical JSON and manifest ordering**

```js
const RESOURCE_KINDS = Object.freeze([
  "diagnosis", "questions", "titles", "result-texts",
  "evidence", "presentation", "characters",
]);

export function canonicalJson(value) {
  return JSON.stringify(orderBySchema(value), null, 2) + "\n";
}

function manifestResource(releaseId, kind, json) {
  return {
    kind,
    path: `./${releaseId}/${kind}.json`,
    sha256: createHash("sha256").update(json).digest("hex"),
  };
}
```

The manifest must contain `schemaVersion: 1`, `releaseId`, `appVersion`, `diagnosisId`, all release version fields, and resources in `RESOURCE_KINDS` order. Do not include timestamps, absolute paths, usernames, or environment values.

- [ ] **Step 4: Implement authoring and release modes**

`validateAuthoringTree` validates every existing catalog and reports draft/reviewed rows without requiring a selected release. `compileRelease` requires exactly one matching manifest row, `status=approved`, all referenced rows approved, all external approval gates satisfied, and every required resource present.

`validate-content.mjs --report <path>` must write a Markdown report on both success and failure. The report contains summary counts and sanitized file/row/column/code/message entries, never the complete CSV. After writing the report, the CLI sets a nonzero exit code when errors exist.

Add tests for:

- header-only release manifest accepted by authoring validation;
- release build fails with `RELEASE_NOT_SELECTED`;
- draft/reviewed/rejected row fails with `RELEASE_CONTENT_NOT_APPROVED`;
- missing resource fails before any output write;
- unknown version/reference fails;
- same input produces byte-identical output;
- path traversal and URL resource path fail.

- [ ] **Step 5: Implement atomic output**

Write the complete output tree, including `content-manifest.json`, below a sibling temporary directory and verify it before switching directories. Resolve and reject filesystem roots, home directories, and paths outside the caller-provided parent. If an old output exists, rename it to a sibling backup, rename the verified temporary tree to the output path, then remove the backup; if the switch fails, restore the backup. Never merge files into an existing release tree.

```js
export async function writeReleaseAtomically({ outputDir, compiled }) {
  const resolvedOutput = path.resolve(outputDir);
  assertSafeOutputPath(resolvedOutput);
  const parentDir = path.dirname(resolvedOutput);
  const tempDir = await mkdtemp(path.join(parentDir, ".content-build-"));
  const backupDir = `${resolvedOutput}.previous`;
  let movedPrevious = false;
  try {
    await writeCompiledTree(tempDir, compiled);
    await verifyCompiledTree(tempDir, compiled.manifest);
    if (await pathExists(resolvedOutput)) {
      if (await pathExists(backupDir)) {
        throw new ContentError({ code: "CONTENT_BACKUP_ALREADY_EXISTS" });
      }
      await rename(resolvedOutput, backupDir);
      movedPrevious = true;
    }
    await rename(tempDir, resolvedOutput);
    if (movedPrevious) await rm(backupDir, { recursive: true });
  } catch (error) {
    if (movedPrevious && !await pathExists(resolvedOutput)) {
      await rename(backupDir, resolvedOutput);
    }
    await rm(tempDir, { recursive: true, force: true });
    throw error;
  }
}
```

- [ ] **Step 6: Run compiler tests**

Run: `node --test app/tests/content-compiler.test.js`

Expected: PASS for deterministic build, approval rejection, reference rejection, and no partial output.

- [ ] **Step 7: Commit**

```powershell
git add scripts/content/content-compiler.mjs scripts/content/validate-content.mjs scripts/content/build-content.mjs app/tests/content-compiler.test.js
git commit -m "feat: build deterministic content releases"
```

---

### Task 7: Migrate Current Definitions to Human-Editable CSV

**Files:**
- Create: `scripts/content/export-current-content.mjs`
- Create: `content/source/releases/release-manifest.csv`
- Create: `content/source/releases/release-history.csv`
- Create: `content/source/diagnoses/ipip-ja-50-definition-v1/diagnosis-sets.csv`
- Create: `content/source/diagnoses/ipip-ja-50-definition-v1/diagnosis-sources.csv`
- Create: `content/source/diagnoses/ipip-ja-50-definition-v1/diagnosis-limitations.csv`
- Create: `content/source/diagnoses/ipip-ja-50-definition-v1/factor-definitions.csv`
- Create: `content/source/questions/ipip-ja-50-question-set-v1/questions.csv`
- Create: `content/source/questions/ipip-ja-50-question-set-v1/preview-questions.csv`
- Create: `content/source/titles/title-rule-v1/title-profiles.csv`
- Create: `content/source/titles/title-rule-v1/title-profile-factors.csv`
- Create: `content/source/result-texts/result-text-v1/result-texts.csv`
- Create: `content/source/result-texts/result-text-v1/result-text-evidence.csv`
- Create: `content/source/evidence/result-evidence-v1/result-evidence.csv`
- Create: `app/tests/content-migration-parity.test.js`

**Interfaces:**
- Consumes: current ES Module definitions and `serializeCsv`.
- Produces: committed initial CSV source with accurate statuses.

- [ ] **Step 1: Write the parity test before exporting**

```js
test("migrated CSV is semantically equal to current runtime definitions", async () => {
  const diagnosis = await loadAndCompileDiagnosis(PROJECT_SOURCE);
  assert.deepEqual(diagnosis.questions, QuestionDefinitions);
  assert.deepEqual(diagnosis.factors, FactorDefinitions);
  assert.deepEqual(diagnosis.diagnostic, DiagnosticDefinition);

  const result = await loadAndCompileResultContent(PROJECT_SOURCE);
  assert.deepEqual(result.titleProfiles, TitleProfileDefinitions);
  assert.deepEqual(result.textDefinitions, ResultTextDefinitions);
  assert.deepEqual(result.evidenceDefinitions, ResultEvidenceDefinitions);
});
```

- [ ] **Step 2: Run the parity test and verify it fails**

Run: `node --test app/tests/content-migration-parity.test.js`

Expected: FAIL because the source CSV files do not exist.

- [ ] **Step 3: Implement and run the one-time exporter**

The exporter imports only `app/js/data/` formal definitions, projects nested arrays into normalized rows, preserves domain order, and writes with `serializeCsv`. It must not import `prototype-big-five/`.

```js
await exportCsv("questions/...", QUESTION_HEADERS,
  QuestionDefinitions.map((question) => [
    question.id, DiagnosticDefinition.questionVersion, question.order,
    question.textJa, question.factorId,
    question.keyedDirection === "negative" ? "reverse" : "positive",
    question.sourceItemId, "approved",
  ]));
```

Set statuses as follows:

- verified T-002 diagnosis/question rows: `approved`;
- title profile and Q-006 result text rows: `reviewed`;
- evidence rows: copy the actual state supported by `docs/research/2026-07-25-q006-result-content-evidence.md`; do not invent approval dates;
- `release-manifest.csv` and `release-history.csv`: headers only;
- do not create production presentation or character rows until Q-012/Q-013 supplies reviewed source data.

Run: `node scripts/content/export-current-content.mjs`

Expected: creates the listed CSVs and reports `50 questions, 20 preview mappings, 51 titles, 237 result texts, 6 evidence definitions`.

- [ ] **Step 4: Make the exporter non-overwriting**

Add `assertFileDoesNotExist` before every write. A second run must fail with `MIGRATION_TARGET_EXISTS`, preventing accidental replacement of human-edited CSV.

- [ ] **Step 5: Run parity and authoring validation**

Run: `node --test app/tests/content-migration-parity.test.js`

Expected: PASS with deep equality to all current runtime definitions.

Run: `node scripts/content/validate-content.mjs --source content/source`

Expected: exit 0, with an authoring summary that identifies Q-006 as reviewed/pending and reports no selected approved release.

- [ ] **Step 6: Commit**

```powershell
git add scripts/content/export-current-content.mjs content/source app/tests/content-migration-parity.test.js
git commit -m "feat: migrate current content to CSV"
```

---

### Task 8: Commands, Leak Checks, and Documentation

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`
- Modify: `scripts/check-static.mjs`
- Create: `app/tests/content-artifact-contract.test.js`
- Create: `docs/content-authoring.md`
- Modify: `AGENTS.md`
- Modify: `docs/基本設計サマリ.md`
- Modify: `docs/data-model.md`
- Modify: `docs/processing-design.md`
- Modify: `docs/screens.md`
- Modify: `docs/tasks.md`

**Interfaces:**
- Consumes: validation/build CLIs and committed source CSV.
- Produces: stable operator commands and documented transitional state.

- [ ] **Step 1: Add failing package and artifact contract tests**

```js
test("content commands are explicit and generated JSON is ignored", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  assert.equal(packageJson.scripts["content:validate"],
    "node scripts/content/validate-content.mjs --source content/source");
  assert.equal(packageJson.scripts["content:build"],
    "node scripts/content/build-content.mjs --source content/source --out app/content");
  assert.match(await readFile(".gitignore", "utf8"), /^app\/content\/$/m);
});
```

Also test that an assembled artifact fixture rejects `.csv`, `draft`, `reviewed`, `rejected`, `approval`, local absolute paths, and token-like strings.

- [ ] **Step 2: Run the contract test and verify it fails**

Run: `node --test app/tests/content-artifact-contract.test.js`

Expected: FAIL because the package scripts and ignore rule do not exist.

- [ ] **Step 3: Add focused commands without changing runtime startup**

```json
{
  "content:validate": "node scripts/content/validate-content.mjs --source content/source",
  "content:build": "node scripts/content/build-content.mjs --source content/source --out app/content"
}
```

Do not add `predev` or change `main.js` in this foundation plan. Until an approved complete release exists, the current ES Module runtime remains active and parity tests prevent drift.

- [ ] **Step 4: Extend static checks**

Add `inspectArtifact(rootDir)` to reject CSV files, non-approved status literals, source maps containing local paths, and external URLs outside the documented evidence fields. Keep `connect-src 'none'` in this plan because runtime JSON fetch has not started.

- [ ] **Step 5: Write the authoring runbook**

`docs/content-authoring.md` must contain:

1. Excelの「CSV UTF-8」推奨とANSI/CP932対応範囲。
2. 用途別CSVと版ディレクトリの作り方。
3. status遷移と別承認台帳の関係。
4. `release-manifest.csv`をヘッダーのみからapproved 1行へ更新する条件。
5. Action Summary形式のエラー修正例。
6. 公開済み版を上書きしない差し替え・切り戻し規則。
7. JSONを手編集しないこと。

- [ ] **Step 6: Synchronize canonical documents**

Record these exact facts:

- CSV source and compiler are implemented.
- Runtime still imports existing ES Modules.
- CSV/runtime parity is enforced by tests.
- No approved release exists while Q-006/Q-012/Q-013 gates remain open.
- Runtime JSON loading and Pages deployment are assigned to `docs/superpowers/plans/2026-07-26-csv-content-activation-pages.md`.
- Human editors change CSV only; no manual JSON generation is required after activation.

- [ ] **Step 7: Run all verification**

Run: `npm.cmd run content:validate`

Expected: PASS in authoring mode with an explicit no-approved-release notice.

Run: `npm.cmd test`

Expected: all formal and prototype tests PASS.

Run: `npm.cmd run check`

Expected: static check PASS, no prototype import, one canonical runtime app version, and no tracked `app/content/`.

Run: `git diff --check`

Expected: no output.

- [ ] **Step 8: Commit**

```powershell
git add package.json .gitignore scripts/check-static.mjs app/tests/content-artifact-contract.test.js docs/content-authoring.md AGENTS.md docs/基本設計サマリ.md docs/data-model.md docs/processing-design.md docs/screens.md docs/tasks.md
git commit -m "docs: establish CSV content authoring workflow"
```

---

## Foundation Completion Gate

The foundation is complete only when:

- UTF-8 BOM/no-BOM and CP932 fixtures compile to identical Unicode models.
- The CSV parser preserves quoted commas, quotes, and embedded CRLF/LF.
- Exact columns, values, counts, references, versions, and statuses are validated.
- Current 50 questions, 20 preview mappings, 51 titles, 237 result texts, and 6 evidence definitions round-trip with semantic equality.
- Q-006 remains pending and no production Q-012/Q-013 approval is fabricated.
- Release build rejects the header-only manifest and every incomplete/unapproved fixture without changing output.
- Tests write generated JSON only to temporary directories.
- The normal app still starts from existing ES Modules and makes no runtime JSON request.
- `npm.cmd test`, `npm.cmd run check`, `npm.cmd run content:validate`, and `git diff --check` pass.
