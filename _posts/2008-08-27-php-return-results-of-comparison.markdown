---
author: aaron
comments: true
date: 2008-08-27 23:02:26+00:00
layout: post
slug: php-return-results-of-comparison
title: PHP - Return results of comparison
wordpress_id: 182
categories:
- PHP
tags:
- PHP
---

A useful reminder: you can make use of returning the results of comparisons for is*() functions.  Let me explain that further...

PHP allows you to get the result of a comparison in a variable.  Any variable you can return from a function.  My my amazing transitive skills, I say you can return the comparison of a variable.  Enough of this drivel - here's an example:


    
    
    function isGreaterThanFour($testVar)
    {
      return $testVar > 4;
    }
    
    if (isGreaterThanFour(5)) {
      print 'yay!';
    }
    



So - this is a very simple example, obviously - but it illustrates the powerful point of this functionality clearly.
