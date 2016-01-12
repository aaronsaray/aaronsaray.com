---
author: aaron
comments: true
date: 2009-04-09 15:48:22+00:00
layout: post
slug: remove-internet-explorer-button-border
title: Remove Internet Explorer Button Border
wordpress_id: 369
categories:
- CSS
tags:
- CSS
---

Internet Explorer provides an additional border to any BUTTON element in the page if you don't explicitly assign a 0px border to it.  i have a bunch of buttons on a design that I'd like to have a 1px #fff border on.  Unfortunately, with the additional border that IE adds, it looks horrible.

The solution was to add a span around the button:

    
    
    button {
    border: 0px;
    }
    .button {
    border: 1px solid #fff;
    }
    




    
    
    <span class="button"><button>My Button</button></span>
    
