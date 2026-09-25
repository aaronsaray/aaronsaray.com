import { existsSync } from "node:fs";

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
