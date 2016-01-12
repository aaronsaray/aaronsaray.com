---
author: aaron
comments: true
date: 2011-02-22 16:12:16+00:00
layout: post
slug: jquery-form-plugin-does-not-submit-submit-buttons-named-submit
title: jQuery form plugin does not submit submit buttons named submit
wordpress_id: 847
categories:
- javascript
- jquery
tags:
- javascript
- jquery
---

... in Google Chrome.  Yep.  

I tested in Firefox and Internet explorer and had no problem.  However, using the form plugin and submit input types with the name of 'submit' did not work.  I changed their name to 'submitbutton' and they all worked flawlessly.  

Hope this saves someone the trouble it caused me!
