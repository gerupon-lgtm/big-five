import sharp from "sharp";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(
  new URL("../../app/assets/brand/kokoro-parea-mark.svg", import.meta.url),
);

for (const size of [192, 512]) {
  const output = fileURLToPath(
    new URL(`../../app/assets/brand/kokoro-parea-icon-${size}.png`, import.meta.url),
  );
  await sharp(source).resize(size, size).png({ compressionLevel: 9 }).toFile(output);
}
