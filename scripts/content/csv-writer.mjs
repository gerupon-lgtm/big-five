export function serializeCsv(headers, rows) {
  const quote = (value) => /[",\r\n]/.test(value)
    ? `"${value.replaceAll('"', '""')}"`
    : value;

  return [headers, ...rows]
    .map((row) => row.map((value) => quote(String(value))).join(","))
    .join("\r\n") + "\r\n";
}
