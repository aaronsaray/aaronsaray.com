import { existsSync } from "node:fs";

// Resolving public/ from import.meta.url, as imageDimensions.ts does,
// breaks here: pages are bundled into chunks elsewhere, every lookup
// misses, and each post falls back to og-image.png.
export function ogImageForTag(tag: string): string {
  if (existsSync(`public/images/tag/${tag}.jpg`)) {
    return `/images/tag/${tag}.jpg`;
  }
  return "/images/og-image.png";
}
