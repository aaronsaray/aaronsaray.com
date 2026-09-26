export const SITE_NAME = "Aaron Saray";

// The home page's description and the blog feed's.
export const SITE_DESCRIPTION =
  "Aaron Saray coaches engineering managers and developers, builds software that stays simple, and leads through honest communication and education.";

// Mirrors --color-night in src/styles/global.css.
export const THEME_COLOR = "#0a0a0a";

/** A page's <title>, and the channel title of a tag's feed. */
export function pageTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}
