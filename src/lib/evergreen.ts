// Evergreen policy for the old-post notice: management, business, and
// idea essays don't go stale the way technical posts do, so "verify
// this against the current release" is the wrong banner for them.
//
// Default is conservative: a post is evergreen only when EVERY tag is
// in the evergreen set, so mixed-tag posts keep the notice. Frontmatter
// `evergreen: true|false` overrides the default either way.
const EVERGREEN_TAGS = new Set(["management", "business", "ideas"]);

export function isEvergreen(tags: string[], override?: boolean): boolean {
  return override ?? tags.every((tag) => EVERGREEN_TAGS.has(tag));
}
