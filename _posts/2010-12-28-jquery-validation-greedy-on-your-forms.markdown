---
author: aaron
comments: true
date: 2010-12-28 16:59:33+00:00
layout: post
slug: jquery-validation-greedy-on-your-forms
title: jQuery Validation - greedy on your forms?
wordpress_id: 751
categories:
- javascript
- jquery
tags:
- javascript
- jquery
---

I was creating a page with two forms on it.  I ran into an issue where I would fill out one form, and it would fail validation.  Then, I tried to do the other form with passing fields, and it would keep invalidating the previous form on the same page.

I had been doing this:

    
    
    $('form').validate();
    



Instead, I found that I needed to loop through each form on the page and validate each single one in their own context. I replaced it with this code:


    
    
    $('form').each(function(){
         $(this).validate();
    });
    
