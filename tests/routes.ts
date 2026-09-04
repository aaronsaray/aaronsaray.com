// One case per route template, shared by the e2e and a11y projects so a
// new page cannot be covered by one and missed by the other. Posts and
// tags are not enumerated: check-url-contract.mjs already proves every
// one of them resolves in dist/. These prove each template renders.
export const ROUTES = [
  { name: "home", path: "/" },
  { name: "contact", path: "/contact/" },
  { name: "cv", path: "/cv/" },
  { name: "books", path: "/books/" },
  { name: "who am i", path: "/who-am-i/" },
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
] as const;
