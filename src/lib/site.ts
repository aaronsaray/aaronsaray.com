import { getPosts } from "./posts";

/**
 * The blog index and /tag/ show the same number but compute it
 * themselves via getSortedPosts(), so a change here does not follow
 * to those pages.
 */
export async function getPostCount(): Promise<number> {
  const posts = await getPosts();
  return posts.length;
}
