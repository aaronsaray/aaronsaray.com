---
author: aaron
comments: true
date: 2010-10-05 13:55:31+00:00
layout: post
slug: combining-print-and-screen-css
title: Combining Print and Screen CSS
wordpress_id: 675
categories:
- CSS
- Misc Web Design
tags:
- CSS
- Misc Web Design
---

When running YSlow the other day, I was reminded that I was loading 2 stylesheets when only one would suffice.  So, let this be a reminder to you - and a quick excerpt at my own solution:

**Combine your Print and Screen stylesheets using the @media tag**

For example, in my print stylesheet, I wanted all input boxes with class 'userinfo' to be hidden.  Instead of doing that, I now have one stylesheet with this exerpt:


    
    
    input.userinfo {
      border: 1px solid #000
    }
    @media print {
        input.userinfo {
            display: none;
        }
    }
    



The style is to put a solid border on that particular input.  However, when media type is print, just don't show it at all.  No more double requests for stylesheets.
