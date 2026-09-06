import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(
  new URL("../../app/assets/brand/kokoro-parea-mark.svg", import.meta.url),
);
const defaultOutputDirectory = fileURLToPath(
  new URL("../../app/assets/brand", import.meta.url),
);

function outputDirectoryFromArguments(arguments_) {
  if (arguments_.length === 0) return defaultOutputDirectory;
  if (arguments_.length === 2 && arguments_[0] === "--output-dir" && arguments_[1]) {
    return resolve(arguments_[1]);
  }
  throw new TypeError("BRAND_ICON_BUILD_INVALID: expected --output-dir <directory>");
}

async function buildBrandIcons(outputDirectory) {
  await mkdir(outputDirectory, { recursive: true });
  for (const size of [192, 512]) {
    await sharp(source)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(join(outputDirectory, `kokoro-parea-icon-${size}.png`));
  }
}

await buildBrandIcons(outputDirectoryFromArguments(process.argv.slice(2)));
