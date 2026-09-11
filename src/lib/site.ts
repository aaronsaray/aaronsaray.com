import { getPosts } from "./posts";

/** Default meta description. */
export const SITE_DESCRIPTION =
  "Open Source Consultant specializing in building effective software for startups and SMBs.";

/**
 * The blog index and /tag/ show the same number but compute it
 * themselves via getSortedPosts(), so a change here does not follow
 * to those pages.
 */
export async function getPostCount(): Promise<number> {
  const posts = await getPosts();
  return posts.length;
}
