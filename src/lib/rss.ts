// Channel shape, guid = permalink, and escaped-HTML descriptions match
// the feed the site served before; a change makes every subscriber
// see the whole archive as new items.

export const SITE_TITLE =
  "Milwaukee Web Developer, PHP and Laravel Programmer, Consultant";
export const SITE_URL = "https://aaronsaray.com";
const COPYRIGHT =
  "This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&#34;")
    .replace(/'/g, "&#39;");
}

/**
 * RFC-1123 pubDate from the frontmatter date string. The authored
 * wall-clock time and offset are kept verbatim (date-only strings are
 * midnight +0000), never converted through a timezone.
 */
export function rfc1123(date: string): string {
  const [y, mo, d] = date.slice(0, 10).split("-").map(Number);
  if (!y || !mo || !d || !MONTHS[mo - 1]) {
    // Unreachable for schema-validated dates; a caller that bypasses
    // the schema would otherwise emit NaNs into pubDate.
    throw new Error(`rfc1123: malformed date string "${date}"`);
  }
  const day = DAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()];
  const time = date.length > 10 ? date.slice(11, 19) : "00:00:00";
  const offset = date.length > 19 ? date.slice(19).replace(":", "") : "+0000";
  return `${day}, ${String(d).padStart(2, "0")} ${MONTHS[mo - 1]} ${y} ${time} ${offset}`;
}

export interface FeedItem {
  title: string;
  /** Absolute URL; also the guid. */
  link: string;
  /** Frontmatter date string; omitted from the item when absent. */
  date?: string;
  /** HTML; escaped into the description element. */
  descriptionHtml: string;
}

export function renderFeed(opts: {
  /** Page title; channel title becomes "<title> on <site title>". */
  title: string;
  /** Site-absolute path of the page the feed covers, e.g. /blog/. */
  path: string;
  /** Site-absolute path of the feed itself. */
  selfPath: string;
  items: FeedItem[];
}): string {
  const channelTitle = xmlEscape(`${opts.title} on ${SITE_TITLE}`);
  const lastBuild = opts.items.find((i) => i.date)?.date;

  const items = opts.items
    .map((item) => {
      const pubDate = item.date
        ? `\n      <pubDate>${rfc1123(item.date)}</pubDate>`
        : "";
      return `    <item>
      <title>${xmlEscape(item.title)}</title>
      <link>${xmlEscape(item.link)}</link>${pubDate}
      <guid>${xmlEscape(item.link)}</guid>
      <description>${xmlEscape(item.descriptionHtml)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${channelTitle}</title>
    <link>${xmlEscape(`${SITE_URL}${opts.path}`)}</link>
    <description>Recent content in ${channelTitle}</description>
    <generator>Astro</generator>
    <language>en-us</language>
    <copyright>${COPYRIGHT}</copyright>${lastBuild ? `\n    <lastBuildDate>${rfc1123(lastBuild)}</lastBuildDate>` : ""}
    <atom:link href="${xmlEscape(`${SITE_URL}${opts.selfPath}`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

export const RSS_LIMIT = 10;

export function feedResponse(xml: string): Response {
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
