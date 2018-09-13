---
layout: post
title: Host Static Website on GitHub Pages with SSL and WWW redirect
tags:
- misc-web
---
You may know that you can host a static site on [GitHub pages](https://pages.github.com/) - but what if you want to have a www redirect and also SSL?  This [isn't that hard](https://blog.github.com/2018-05-01-github-pages-custom-domains-https/) until you get to the www redirect.  That would require a subdomain and a second SSL cert, which they don't provide.  

So, let me demonstrate how we can use GitHub Pages and Cloudflare to host your free GitHub pages website with SSL and www removal/redirect.  

In this example I'm going to focus on [morebetterfaster.io](https://morebetterfaster.io) - but this is basically the same setup for aaronsaray.com - except instead of using flat HTML and the gh-pages plugin, I use [jekyll](https://jekyllrb.com/).

### Register Domain

First of all, I recommend [NameCheap](https://namecheap.com) for domains. I'm not an affiliate, so I won't get a commission either. Just look into their history - they're pretty great. Anyway, register your domain to get started.  You'll be coming back to this later.

### Set Up a Cloudflare Account




Then, you'll have to set the name servers to Cloudflare's nameservers.  We're going to use Cloudflare to 



https://support.cloudflare.com/hc/en-us/articles/205195708-Step-3-Change-your-domain-name-servers-to-Cloudflare


