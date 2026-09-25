import rss from "@astrojs/rss";

export const SITE_TITLE =
  "Milwaukee Web Developer, PHP and Laravel Programmer, Consultant";
export const SITE_URL = "https://aaronsaray.com";
export const RSS_LIMIT = 10;
const COPYRIGHT =
  "This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.";

export interface FeedItem {
  title: string;
  // Also the guid: a change shows every item to subscribers as new.
  link: string;
  /** Frontmatter date string. */
  date: string;
  descriptionHtml: string;
}

/** UTC midnight of the date: a date-only string parses as UTC. */
function day(date: string): Date {
  return new Date(date.slice(0, 10));
}

export function feed(opts: {
  /** Page title; channel title becomes "<title> on <site title>". */
  title: string;
  /** Site-absolute path of the page the feed covers, e.g. /blog/. */
  path: string;
  /** Site-absolute path of the feed itself. */
  selfPath: string;
  items: FeedItem[];
}): Promise<Response> {
  const channelTitle = `${opts.title} on ${SITE_TITLE}`;
  const lastBuild = day(opts.items[0].date).toUTCString();
  const channelData = [
    "<language>en-us</language>",
    `<copyright>${COPYRIGHT}</copyright>`,
    `<lastBuildDate>${lastBuild}</lastBuildDate>`,
    `<atom:link href="${SITE_URL}${opts.selfPath}" rel="self" type="application/rss+xml"/>`,
  ].join("");

  return rss({
    title: channelTitle,
    description: `Recent content in ${channelTitle}`,
    site: `${SITE_URL}${opts.path}`,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: channelData,
    items: opts.items.map((item) => ({
      title: item.title,
      link: item.link,
      description: item.descriptionHtml,
      pubDate: day(item.date),
    })),
  });
}
