// Dev serves /about unslashed, which breaks the nav's active state and
// the canonical URL. A build renders only slashed paths, so this is a
// no-op there. Production serves static files and never runs it.
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(({ url, redirect }, next) => {
  if (!url.pathname.endsWith("/") && !/\.[a-z0-9]+$/i.test(url.pathname)) {
    return redirect(`${url.pathname}/${url.search}`, 301);
  }
  return next();
});
