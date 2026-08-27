import fs from 'node:fs';

// Hugo used /images/tag/<first-frontmatter-tag>.jpg for posts and
// <term>.jpg for tag pages, falling back to the site og-image only
// when no tag exists. It never checked the file — posts whose first
// tag is "twitter" (no jpg) shipped a broken og:image. We check.
export function ogImageForTag(tag: string | undefined): string {
  if (tag && fs.existsSync(`public/images/tag/${tag}.jpg`)) {
    return `/images/tag/${tag}.jpg`;
  }
  return '/images/og-image.png';
}
