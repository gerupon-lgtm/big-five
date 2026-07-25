import { ContentError } from "./content-error.mjs";

const UNQUOTED = "unquoted";
const QUOTED = "quoted";
const AFTER_QUOTE = "after-quote";
const ROW_END = "row-end";

function syntaxError(sourceName, lineNumber, message) {
  return new ContentError({
    code: "CSV_SYNTAX_INVALID",
    sourceName,
    lineNumber,
    message,
  });
}

export function parseCsv(text, sourceName) {
  const records = [];
  let state = UNQUOTED;
  let value = "";
  let values = [];
  let lineNumber = 1;
  let rowLineNumber = 1;

  const endCell = () => {
    values.push(value);
    value = "";
  };
  const endRow = () => {
    state = ROW_END;
    endCell();
    records.push({ lineNumber: rowLineNumber, values });
    values = [];
    state = UNQUOTED;
  };
  const consumeLineEnding = (index) => {
    if (text[index] === "\r" && text[index + 1] === "\n") {
      lineNumber += 1;
      return index + 1;
    }
    lineNumber += 1;
    return index;
  };

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const isLineEnding = character === "\r" || character === "\n";

    if (character === "\r" && text[index + 1] !== "\n") {
      throw syntaxError(sourceName, lineNumber, "改行はCRLFまたはLFで指定してください。");
    }

    if (state === UNQUOTED) {
      if (character === ",") {
        endCell();
      } else if (character === '"') {
        if (value !== "") {
          throw syntaxError(sourceName, lineNumber, "引用符の前に値があります。");
        }
        state = QUOTED;
      } else if (isLineEnding) {
        endRow();
        index = consumeLineEnding(index);
        rowLineNumber = lineNumber;
      } else {
        value += character;
      }
      continue;
    }

    if (state === QUOTED) {
      if (character === '"') {
        state = AFTER_QUOTE;
      } else if (isLineEnding) {
        const endIndex = consumeLineEnding(index);
        value += text.slice(index, endIndex + 1);
        index = endIndex;
      } else {
        value += character;
      }
      continue;
    }

    if (state === AFTER_QUOTE) {
      if (character === '"') {
        value += '"';
        state = QUOTED;
      } else if (character === ",") {
        endCell();
        state = UNQUOTED;
      } else if (isLineEnding) {
        endRow();
        index = consumeLineEnding(index);
        rowLineNumber = lineNumber;
      } else {
        throw syntaxError(sourceName, lineNumber, "閉じ引用符の後に値があります。");
      }
    }
  }

  if (state === QUOTED) {
    throw syntaxError(sourceName, rowLineNumber, "引用符が閉じられていません。");
  }

  if (values.length > 0 || value !== "" || state === AFTER_QUOTE) {
    endRow();
  }

  const [header, ...rows] = records;
  if (!header || header.values.some((columnName) => columnName === "")) {
    throw syntaxError(sourceName, 1, "空のヘッダーは使用できません。");
  }
  if (new Set(header.values).size !== header.values.length) {
    throw syntaxError(sourceName, 1, "重複したヘッダーは使用できません。");
  }
  for (const row of rows) {
    if (row.values.length !== header.values.length) {
      throw syntaxError(sourceName, row.lineNumber, "列数がヘッダーと一致しません。");
    }
  }

  return { headers: header.values, rows };
}
