---
layout: post
title: Using Google Analytics Asynchronously
tags:
- google
- javascript
---
I came across the following link on google's code pages:
[http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html](http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html)

It basically details the asynchronous loading of google analytics.  I found this to be a very cool addition to an already powerful package that I rely on.

However, one thing that I haven't been able to successfully figure out.  What happens when you want to load in two instances or two different accounts?  On one of my sites, I use my own google analytics account plus the clients.  This tracks the traffic fine with the non-asynchronous method.  You simply make a new instance of the `ga` object and assign a new ID to it.  However, can I do the same thing with this async method?  I'm kind of wary to try it because I don't want to lose any data.

Anyone have any experience or have any links to where I can find this detail?
