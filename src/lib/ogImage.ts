import fs from "node:fs";

// Paths are cwd-relative. If the fallback image is not findable,
// either public/ moved or the build is running from the wrong
// directory, and every existsSync below would silently return false,
// downgrading every post's social card to nothing. Fail the build
// instead.
if (!fs.existsSync("public/images/og-image.png")) {
  throw new Error(
    "og image lookup: public/images/og-image.png not found. Wrong cwd, or the fallback og-image was deleted.",
  );
}

export function ogImageForTag(tag: string | undefined): string {
  if (tag && fs.existsSync(`public/images/tag/${tag}.jpg`)) {
    return `/images/tag/${tag}.jpg`;
  }
  return "/images/og-image.png";
}
