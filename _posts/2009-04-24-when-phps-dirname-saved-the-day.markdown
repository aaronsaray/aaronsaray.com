---
author: aaron
comments: true
date: 2009-04-24 01:53:53+00:00
layout: post
slug: when-phps-dirname-saved-the-day
title: When PHP's dirname() saved the day
wordpress_id: 375
categories:
- PHP
- scripting
tags:
- PHP
- scripting
---

Now, I won't bore you with the actual details of how I came across this - lets just skip to the explanation and example:

First, even when it makes 'sense', you should not be using relative paths in your command line PHP scripts.  I am so used to writing web PHP that I fell into this bad habit.



### Show Me Why dirname() is your hero


Imagine a directory structure on windows like this:

    
    
    C:\DEVELOPMENT\local>dir
     Volume in drive C has no label.
     Volume Serial Number is 1122-45E1
    
     Directory of C:\DEVELOPMENT\local
    
    04/23/2009  08:40 PM    <dir>          .
    04/23/2009  08:40 PM    <dir>          ..
    04/23/2009  08:37 PM    <dir>          includes
    04/23/2009  08:40 PM    <dir>          testdirname
                   0 File(s)                    0 bytes
                   4 Dir(s)  67,484,995,584 bytes free
    



We have two files:
**testdirname/script.php**

    
    
    require_once '../includes/include.php';
    print "I've done ran, ya'll.";
    



**includes/include.php**

    
    
    print "I'm an include!\n";
    



Now, let's run the script as it is:

    
    
    C:\DEVELOPMENT\local\testdirname>php script.php
    I'm an include!
    I've done ran, ya'll.
    



Not too bad - but note how we're actually in the script.php's working directory.  What if we wanted to run it in a different directory?


    
    
    C:\DEVELOPMENT\local>php testdirname\script.php
    
    Warning: require_once(../includes/include.php): failed to open stream: No such file or directory in C:\DEVELOPMENT\local\testdirname\script.php on line 2
    



Well this makes sense because I programmed with that relative path.

Instead, change the require line in script.php to this:

    
    
    require_once dirname(__FILE__) . '/../includes/include.php';
    



This way, it always gets the full directory of the file itself (__FILE__ constant) - and THEN you can path to the file any which way you'd like.

Let's check the output:

    
    
    C:\DEVELOPMENT\local>php testdirname\script.php
    I'm an include!
    I've done ran, ya'll.
    



Yep - I KNOW - Simple.  Its embarrassing to say it bit me - but it did :)
