import { getCollection, type CollectionEntry } from "astro:content";
import { isFuturePost } from "./dates";

// Astro types `body` optional because the glob loader also loads JSON,
// which has none; every blog entry is markdown.
export type Post = CollectionEntry<"blog"> & { body: string };

/** Permalink per the URL contract: /:year/:filename/ */
export function postHref(post: Post): string {
  return `/${post.data.date.slice(0, 4)}/${post.id}/`;
}

/** The original's URL when it is this post's canonical. */
export function originalUrl(post: Post): string | undefined {
  return post.data.origin?.canonical ? post.data.origin.url : undefined;
}

/**
 * Every post the current mode shows. Drafts and posts dated after today
 * render on the dev server (marked with a badge) and are absent from a
 * build.
 */
export async function getPosts(): Promise<Post[]> {
  // MODE follows the astro command; DEV follows NODE_ENV, which a shell
  // exporting NODE_ENV=production turns off under `astro dev` too.
  const dev = import.meta.env.MODE === "development";
  return (await getCollection(
    "blog",
    ({ data }) => (!data.draft && !isFuturePost(data.date)) || dev,
  )) as Post[];
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
      a.data.title.localeCompare(b.data.title),
  );
}

export const PER_PAGE = 10;

export function pageCount(total: number): number {
  return Math.ceil(total / PER_PAGE);
}

/** Items for a 1-based page number. */
export function pageSlice<T>(items: T[], num: number): T[] {
  return items.slice((num - 1) * PER_PAGE, num * PER_PAGE);
}
