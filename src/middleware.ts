// The host answers /about with a redirect to /about/; this does the
// same in dev, where an unslashed Astro.url.pathname breaks the nav's
// active state and the canonical URL. A build renders every page at
// its slashed path.
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(({ url, redirect }, next) => {
  if (!url.pathname.endsWith("/") && !/\.[a-z0-9]+$/i.test(url.pathname)) {
    return redirect(`${url.pathname}/${url.search}`, 301);
  }
  return next();
});
