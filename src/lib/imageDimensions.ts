import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { imageMetadata } from "astro/assets/utils";

const PUBLIC_DIR = fileURLToPath(new URL("../../public/", import.meta.url));

export type Dimensions = { width: number; height: number };

export async function lookupDimensions(src: string): Promise<Dimensions> {
  const { width, height } = await imageMetadata(
    await readFile(join(PUBLIC_DIR, src)),
    src,
  );
  return { width, height };
}
