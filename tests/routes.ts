// One case per route template, shared by the e2e and a11y projects so a
// new page cannot be covered by one and missed by the other. Posts and
// tags are not enumerated: check-url-contract.mjs already proves every
// one of them resolves in dist/.
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
  // The one post whose code block is wide enough to scroll at the
  // 1280px test viewport, so the only one where axe's
  // scrollable-region-focusable rule has a scrollable region to judge.
  // Every other sampled post's longest code line fits the ~704px
  // column, which is why a <pre> that was not keyboard focusable
  // passed the sweep. The mask that signals the overflow renders
  // nowhere else here either.
  {
    name: "post with a scrolling code block",
    path: "/2019/expression-1-not-in-group-by/",
  },
  { name: "not found", path: "/no-such-page-exists/", status: 404 },
];

// A route here covers a template, so a rule that only fires on markup
// some post happens to contain is covered only when a sampled post
// happens to contain it. The entries above name what each post was
// picked for. Nothing enforces that a new rendering shape gets a
// sample, and the list cannot grow to every post without becoming the
// URL contract check.
//
// Known uncovered: no sampled post has a table. `.table-wrap` in
// global.css scrolls on overflow and rehype-table-wrap.mjs adds no
// tabindex, which is the same keyboard trap the code blocks had.
// Four posts have tables; none is in this list.
//
// Known uncovered: no sampled post has an `@2x` or `@3x` image, so
// nothing exercises the divided width/height in rehype-img-attrs.mjs.
// A regression there stamps the file's full pixel size and the
// screenshot renders two or three times the size it was captured at,
// which looks like a content mistake rather than a plugin one. The
// posts with such images are /2025/livewire-3-reactive-event-dispatching/,
// /2024/email-catch-all-forwarding-on-cloudflare-free/,
// /2023/meme-image-generator-ios-shortcut/, and
// /2022/one-tap-track-weight-daily-ios-no-app/ (the only `@3x` one).
