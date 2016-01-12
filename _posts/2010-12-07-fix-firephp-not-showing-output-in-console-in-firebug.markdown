---
author: aaron
comments: true
date: 2010-12-07 17:12:42+00:00
layout: post
slug: fix-firephp-not-showing-output-in-console-in-firebug
title: 'Fix: FirePHP not showing output in console in Firebug'
wordpress_id: 749
categories:
- IDE and Web Dev Tools
- Misc Web Design
tags:
- IDE and Web Dev Tools
- Misc Web Design
---

When using [FirePHP](http://www.firephp.org/), I ran into this issue where I could not see the output of the debug information.  All the documents I found kept suggesting that I had not enabled the Console tab for this particular site.

I had done so.

Turns out, there is one other caveat: the Net tab.  In addition to the console tab needing to be enabled, the Net tab also needs to be enabled for that particular site.  Then, the FirePHP information comes through.
