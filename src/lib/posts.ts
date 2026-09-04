import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

/** Permalink per the URL contract: /:year/:filename/ */
export function postHref(post: Post): string {
  return `/${post.data.date.slice(0, 4)}/${post.id}/`;
}

/**
 * Published posts, newest first. Date strings are ISO-shaped so they
 * sort lexicographically.
 */
export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort(
    (a, b) =>
      b.data.date.localeCompare(a.data.date) ||
      a.data.title.localeCompare(b.data.title) ||
      a.id.localeCompare(b.id),
  );
}

export const PER_PAGE = 10;

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PER_PAGE));
}

/** Items for a 1-based page number. */
export function pageSlice<T>(items: T[], num: number): T[] {
  return items.slice((num - 1) * PER_PAGE, num * PER_PAGE);
}
