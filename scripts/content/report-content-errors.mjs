function formatLocation(error) {
  const line = error.lineNumber === undefined ? "行番号なし" : `${error.lineNumber}行目`;
  const column = error.columnName === undefined ? "列不明" : error.columnName;
  return `${error.sourceName}: ${line} / ${column}`;
}

export function formatContentErrors(errors) {
  return errors.map((error) => (
    `${formatLocation(error)} [${error.code}] ${error.message}`
  )).join("\n");
}
