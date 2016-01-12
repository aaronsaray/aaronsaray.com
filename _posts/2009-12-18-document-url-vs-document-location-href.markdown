---
author: aaron
comments: true
date: 2009-12-18 17:34:33+00:00
layout: post
slug: document-url-vs-document-location-href
title: document.URL vs document.location.href
wordpress_id: 521
categories:
- javascript
tags:
- javascript
---

When reviewing some javascript security ideas, I came across the document.URL property.  Turns out that my normal way of retrieving the location (document.location.href) is both a getter and a setter.  The document.URL is just a getter.

Check it out with this code:

    
    
    alert(document.URL);
    alert(document.location.href);
    document.URL = 'http://google.com';
    document.location.href = 'http://yahoo.com';
    



The results are simple: you will get the current location twice - and then an error.  If you comment out the document.URL line, it will redirect to yahoo.
