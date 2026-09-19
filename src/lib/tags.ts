import fs from "node:fs";
import type { CollectionEntry } from "astro:content";
import type { Post } from "./posts";

export function tagTitle(term: string): string {
  return `Blog Entries Tagged "${term}"`;
}

export function tagDescription(term: string): string {
  return `Blog entries by Aaron Saray that have the tag "${term}".`;
}

/** Throws when a tag lacks its social card or a post's tag lacks its file. */
export function assertTags(
  tags: CollectionEntry<"tags">[],
  posts: Post[],
): void {
  const terms = new Set(tags.map((tag) => tag.id));
  for (const term of terms) {
    if (!fs.existsSync(`public/images/tag/${term}.jpg`)) {
      throw new Error(
        `The tag "${term}" needs public/images/tag/${term}.jpg (1200x630).`,
      );
    }
  }
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
