---
title: "Google Geo-location Zip Only Not Found Fix"
date: 2023-04-06T14:11:27-05:00
tag:
- misc-web
---
When running a geo-location query out to Google, we found a zip code that wasn't found. The city/state was found in Google maps, but if you searched just the zip code, no results turned up. This is the fix I came up with.

<!--more-->

First thing's first - most often, when doing geo location lookups, you're using a whole address. We did not have that problem with a whole address in this particular zip code. But with just the zip code itself, it was a problem.

Second, just for context - although it's likely not necessary - this was using a package called [toin0u/geocoder-laravel](https://github.com/geocoder-php/GeocoderLaravel).

So, normally, you could send in something like `53202` and that would return a geo result for Milwaukee, WI.  However, when searching for `15705` no results were returned.

Normally, when there are ambiguous results, there may be a few results returned. Just none this time.  

When you search that zip code directly on Google maps, nothing was found either.  My best guess is it has something to do with some ambiguous numbering system near my location - as it doesn't always seem to be the same type of problem in all search contexts.

**So, what is the solution?**  Well, this is a United States postal code - so just add `USA` to the end.

Now, when searching only zip codes, we'll do `15705 USA` and it returns the proper location: Indiana, PA 15705.