import fs from "node:fs";

// Hugo used /images/tag/<first-frontmatter-tag>.jpg for posts and
// <term>.jpg for tag pages, falling back to the site og-image only
// when no tag exists. It never checked the file — posts whose first
// tag is "twitter" (no jpg) shipped a broken og:image. We check.
//
// Paths are cwd-relative (the build always runs from the project
// root). The assert below is the tripwire: if the fallback image is
// not findable, either public/ moved or the build is running from the
// wrong directory, and every existsSync above would silently return
// false, downgrading every post's social card to nothing. Fail the
// build instead.
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
