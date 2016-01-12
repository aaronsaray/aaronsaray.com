---
author: aaron
comments: true
date: 2007-07-21 18:55:52+00:00
layout: post
slug: a-reminder-about-triggering-errors-not-in-the-user-level
title: A reminder about triggering errors not in the USER level
wordpress_id: 56
categories:
- PHP
tags:
- PHP
---

I had a function in some of my code that I wanted to trigger a notice error on certain occasions.  Unfortunately, it kept halting my script with a Warning instead.  Unfortunately, the error handler at that particular block of code was not properly capturing the error string.  It runs out that I was triggering an E_NOTICE instead of an E_USER_NOTICE error... (if I would have reviewed the [trigger_error manual page](http://us2.php.net/trigger_error), I wouldn't have made this mistake... silly, lazy developer).  Just to make sure that I fully understood this issue and hopefully wouldn't make the same mistake again, I made a quick proof of concept:

<!-- more -->

From the comments on the manual page, I was able to grab a pre-made function that I stripped down.  It prints out the error type as well as the error string.  My test script also generates an error.


    
    string: ' . $errstr;
    }
    
    set_error_handler('my_error_handler');
    ?>



Now, when I do the following:


    
    trigger_error('test error', E_USER_NOTICE);



Our output is predictable:
User Notice
string: test error

However, I was forgetting to put the USER in that error:


    
    trigger_error('test error', E_NOTICE);



And my error:

Warning
string: Invalid error type specified

So just a reminder, you can only trigger errors in the USER class.
