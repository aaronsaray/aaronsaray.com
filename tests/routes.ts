// One case per route template, shared by the e2e and a11y projects so a
// new page cannot be covered by one and missed by the other.
type Route = { name: string; path: string; status?: number };

export const ROUTES: readonly Route[] = [
  { name: "home", path: "/" },
  { name: "contact", path: "/contact/" },
  { name: "cv", path: "/cv/" },
  { name: "books", path: "/books/" },
  { name: "about", path: "/about/" },
  { name: "colophon", path: "/colophon/" },
  { name: "blog index", path: "/blog/" },
  { name: "blog pagination", path: "/blog/page/2/" },
  { name: "tag index", path: "/tag/" },
  { name: "tag landing", path: "/tag/php/" },
  { name: "post", path: "/2007/ajax-security-research-and-findings-round-1/" },
  // Both copy-button DOM shapes: this one is code-wrap only, while the
  // post above carries filename headers too.
  {
    name: "post without filename headers",
    path: "/2007/a-better-understanding-of-error-reporting-in-php/",
  },
  // The one post the axe sweep sees with H3 anchors.
  {
    name: "post with heading anchors",
    path: "/2021/do-not-use-tinker-in-production/",
  },
  // The one post whose code block overflows at the 1280px test
  // viewport, so the only one where axe's scrollable-region-focusable
  // rule has a region to judge and the overflow mask renders.
  {
    name: "post with a scrolling code block",
    path: "/2019/expression-1-not-in-group-by/",
  },
  // The one post with output blocks, so the axe sweep sees a <pre>
  // whose colors come from global.css rather than from Shiki.
  {
    name: "post with output blocks",
    path: "/2017/use-the-fail-method-with-mockery-on/",
  },
  { name: "not found", path: "/no-such-page-exists/", status: 404 },
];
