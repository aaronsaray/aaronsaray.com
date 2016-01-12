---
author: aaron
comments: true
date: 2013-06-25 14:05:40+00:00
layout: post
slug: idea-extra-analytics-information
title: 'Idea: Extra Analytics Information'
wordpress_id: 1548
categories:
- Ideas for Websites
tags:
- Ideas for Websites
---

When browsing the documentation for chrome, I came across this:


    
    
    window.performance.getEntries();
    



This gives a dump of all the connection and timing information available to the Javascript Timing and Resource API.  

Why this is an idea?  There could be a service which is just a tiny javascript library inserted on the page that tracks and records this information for each visitor.  Additional information can be correlated with it then.

So, why is this useful?





  * You can now tell how many people have an empty cache vs a full cache.  


  * When do most DNS queries take longer / does google CDN help


  * Do logged in users have a warmer cache, faster load time, than non logged in users.



I think there is tremendous information to be gathered basically from remote visitor's network tab.  Pretty sweet.
