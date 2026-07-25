export class ContentError extends Error {
  constructor({
    code,
    sourceName,
    lineNumber = undefined,
    columnName = undefined,
    message,
    safeValue = undefined,
  }) {
    super(message);
    this.name = "ContentError";
    this.code = code;
    this.sourceName = sourceName;
    this.lineNumber = lineNumber;
    this.columnName = columnName;
    this.safeValue = safeValue;
  }
}
