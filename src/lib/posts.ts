import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

/** Permalink per the URL contract: /:year/:filename/ */
export function postHref(post: Post): string {
  return `/${post.data.date.slice(0, 4)}/${post.id}/`;
}

/**
 * Every post the current mode shows. Drafts render on the dev server
 * (marked with a badge) and are absent from a build.
 */
export async function getPosts(): Promise<Post[]> {
  // MODE follows the astro command; DEV follows NODE_ENV, which a shell
  // exporting NODE_ENV=production turns off under `astro dev` too.
  const dev = import.meta.env.MODE === "development";
  return getCollection("blog", ({ data }) => !data.draft || dev);
}

/**
 * Posts newest first. Date strings are ISO-shaped so they sort
 * lexicographically.
 */
export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getPosts();
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
