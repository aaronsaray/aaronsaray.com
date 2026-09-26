import type { CollectionEntry } from "astro:content";
import type { Post } from "./posts";
import { pageTitle } from "./site";

export function tagTitle(term: string): string {
  return `Blog Entries Tagged "${term}"`;
}

/** Channel title of a tag's feed, and the label on the link to it. */
export function tagFeedTitle(term: string): string {
  return pageTitle(`"${term}" entries`);
}

export function tagDescription(term: string): string {
  return `Blog entries by Aaron Saray that have the tag "${term}".`;
}

// Tag pages are built from src/content/tags/, so a mistyped tag in a
// post builds no page, and the post's #tag link points at nothing.
export function assertTags(
  tags: CollectionEntry<"tags">[],
  posts: Post[],
): void {
  const terms = new Set(tags.map((tag) => tag.id));
  for (const post of posts) {
    for (const term of post.data.tags) {
      if (!terms.has(term)) {
        throw new Error(
          `${post.id}.md uses the tag "${term}". A tag needs src/content/tags/${term}.md and public/images/tag/${term}.jpg (1200x630).`,
        );
      }
    }
  }
}
