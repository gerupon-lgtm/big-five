import { ContentError } from "./content-error.mjs";

const utf8 = new TextDecoder("utf-8", { fatal: true });
const cp932 = new TextDecoder("shift_jis", { fatal: true });

export function decodeCsvBytes(bytes, sourceName) {
  const input = Uint8Array.from(bytes);
  const hasBom = input.length >= 3
    && input[0] === 0xef && input[1] === 0xbb && input[2] === 0xbf;
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
