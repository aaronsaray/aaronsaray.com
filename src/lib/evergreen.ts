const EVERGREEN_TAGS = new Set(["management", "business", "ideas"]);

export function isEvergreen(tags: string[], override?: boolean): boolean {
  return override ?? tags.every((tag) => EVERGREEN_TAGS.has(tag));
}
