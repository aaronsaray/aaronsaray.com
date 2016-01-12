---
author: aaron
comments: true
date: 2009-01-11 04:04:35+00:00
layout: post
slug: is-phps-__call-used-when-no-__construct-is-present
title: Is PHP's __call() used when no __construct is present?
wordpress_id: 301
categories:
- PHP
tags:
- PHP
---

Simple enough question.  Lets check out some test code:


    
    
    
    
    Ran the first time, the output was:
    
    
    
    constructed with: hi
    



Ran without a constructor?
BLANK.  __call is not called.

Now we can all sleep at night! whew!
