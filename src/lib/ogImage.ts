import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { imageMetadata } from "astro/assets/utils";

// Resolving public/ from import.meta.url, as imageDimensions.ts does,
// breaks here: pages are bundled into chunks elsewhere and every lookup
// misses.
export function ogImageForTag(tag: string): string {
  if (!existsSync(`public/images/tag/${tag}.jpg`)) {
    throw new Error(
      `The tag "${tag}" needs public/images/tag/${tag}.jpg (1200x630).`,
    );
  }
  return `/images/tag/${tag}.jpg`;
}

const sizes = new Map<string, Promise<{ width: number; height: number }>>();

/** Pixel size of a file under public/, by its site-absolute path. */
export function publicImageSize(path: string) {
  let size = sizes.get(path);
  if (!size) {
    size = readFile(`public${path}`).then((file) => imageMetadata(file, path));
    sizes.set(path, size);
  }
  return size;
}
