---
title: "Moved to Hugo"
date: 2023-03-09T10:08:39-06:00
tag:
- news
---
I just moved from Jekyll and Github pages to Hugo and Netlify.  And made a new design.  It's overall much better - but with a few things to note.

<!--more-->

## The Positives

First of all, it's much faster to compile.  Granted, locally I was using Docker and Jekyll, so there was a little overhead there.  But still,
it went from about 30 seconds to compile 650 pages - to just about 1.5 seconds.  

Next, I really like the shortcode functionality in Hugo. It allows you to put snippets of either plain HTML or full-functional components into your markdown files.

Finally, the new design I created focuses on more of my wholistic work - and not just on being a programmer.  My programming work is directly still marketed on [More Beter Faster](https://morebetterfaster.io).

## The Negatives

It took days of work between scripting and manual work to convert all of my content.  There was a lot more logic I was doing in the Jekyll templates. I tried to follow the 'rules' with my Hugo installation.

Sadly, some of the RSS feed locations have changed.  It used to be:

```txt
https://aaronsaray.com/tag/laravel.xml
```

And now it's:
```txt
https://aaronsaray.com/tag/laravel/index.xml
```

Also, the main blog feed used to be at `/feed.xml` and now it's at `/blog/index.xml`.  But, I did put a redirect in Netlify for this.

## Final Thoughts

I'm still learning Hugo - but I'm enjoying the quickness and ease of use.  I think this was a good change!