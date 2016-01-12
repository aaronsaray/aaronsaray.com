---
author: aaron
comments: true
date: 2009-03-05 17:40:41+00:00
layout: post
slug: another-example-of-csrf-in-css
title: Another example of CSRF - in CSS
wordpress_id: 328
categories:
- CSS
- javascript
- security
tags:
- CSS
- javascript
- security
---

Just saw this really cool example get submitted on one of my websites testing for CSRF:


    
    
    #logo{background:url(deletepost.process.php?id=12345&userID;=12345);
    



Just another great example of why you should
1) not use GET for irreversible changes
2) filter filter filter! (I edited that posting, it was a filtered by my script already...)
