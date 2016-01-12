---
author: aaron
comments: true
date: 2010-03-26 19:25:15+00:00
layout: post
slug: fixing-fakepath-in-jquery-filestyle
title: Fixing c:\fakepath in filestyle jquery plugin
wordpress_id: 574
categories:
- javascript
- jquery
tags:
- javascript
- jquery
---

The other day I ran across an issue with the FileStyle jquery plugin.  Whenever a new file was chosen, windows and Internet Explorer would put c:\fakepath\ before the filename.  Turns out its not FileStyle's issue - but a security feature of Internet Explorer.

As a quick fix, however, I made the following changes to FileStyle:

**BEFORE**

    
    
    //snip
                $(self).bind("change", function() {
                    filename.val($(self).val());
                });
    
    //snip
    



**AFTER**

    
    
                $(self).bind("change", function() {
                	var s = $(self).val().replace(/(c:\\)*fakepath/i, '');
                    filename.val(s);
                });
    
