export interface NavItem {
  text: string;
  href?: string;
  match?: RegExp;
  children?: NavItem[];
}

// Posts live at /:year/:slug/, not under /blog/, so the Blog item
// cannot be matched by prefix; `match` carries the extra paths.
export const NAV: NavItem[] = [
  {
    text: "About",
    children: [
      { text: "Who am I", href: "/about/" },
      { text: "CV", href: "/cv/" },
    ],
  },
  {
    text: "Writing",
    children: [
      { text: "Blog", href: "/blog/", match: /^\/(blog|tag|\d{4})\// },
      { text: "Books", href: "/books/" },
    ],
  },
  { text: "Contact", href: "/contact/" },
];

export function isActive(pathname: string, item: NavItem): boolean {
  return (
    pathname === item.href ||
    (item.match?.test(pathname) ?? false) ||
    (item.children?.some((child) => isActive(pathname, child)) ?? false)
  );
}
