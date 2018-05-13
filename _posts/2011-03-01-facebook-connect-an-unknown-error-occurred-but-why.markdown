---
layout: post
title: 'Facebook connect: An unknown error occurred. - but why??'
tags:
- misc-web
---
I had been working with the facebook connect javascript API on one site and transferred over the code to another site.  I changed the app ID and clicked connect.  Every time I got a popup saying an unknown error occurred and they were taking a look into it.

Turns out, I did not have the exact matching domain in the application settings in the developer portion of the facebook app.  Once I matched it exactly, it no longer had this error.  It seems weird to me that this happened because I've seen these work on multiple subdomains.  But, for whatever reason, that was the solution!
