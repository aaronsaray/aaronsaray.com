---
author: aaron
comments: true
date: 2009-04-14 20:55:20+00:00
layout: post
slug: form-submit-internet-explorer-behaving-badly
title: 'Form Submit: Internet Explorer behaving badly'
wordpress_id: 373
categories:
- html
- javascript
- jquery
tags:
- html
- javascript
- jquery
---

I just want to make a micro blog here.  Just a tiny lil blog.



### Internet Explorer Does Not Submit Form on Enter


Correct!  Instead, I load my page with this jquery

    
    
        $('input').keydown(function(e){
            if (e.keyCode == 13) {
                $(this).parents('form').submit();
                return false;
            }
        });
    





### Button Element Not Submitting in Internet Explorer


Correct!  Mainly because I was lazy.

But in FireFox  works fine for a submit.

In IE - don't forget to add type="submit"


    
    
    
    <button>Works in FF</button>
    
    
    <button type="submit">Works and is probably what you SHOULD do</button>
    



That is all.
