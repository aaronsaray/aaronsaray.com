---
layout: post
title: PEAR Installation Woes
tags:
- PHP
---
I've found the need to do some installs from some PEAR channels, so I jumped into my command line on PHP 5.2.0 and windows xp sp2.  I ran `c:\php5.2\go-pear` - which would launch the **`go-pear.bat`** file.  I executed with standard permissions, and the unthinkable happened - a PEAR FAILURE.  OH NO!  But I was able to get around it.  Lets look at the details of the error, and my lazy man's way of solving it:

    1-8, 'all' or Enter to continue:
    Beginning install...
    Configuration written to C:\WINDOWS\pear.ini...
    Initialized registry...
    
    Warning: Cannot use a scalar value as an array in phar://go-pear.phar/PEAR/Command.php on line 268
    
    Warning: Cannot use a scalar value as an array in phar://go-pear.phar/PEAR/Command.php on line 268

And it just went worse from there!  It finally ended with an installation failure message.

**How I solved this issue without messing with the holy binary of PEAR**

Pear has a front end now for their installation and management.  This can be found [here](http://pear.php.net/go-pear) sorta.  You actually need to download that source and name it **`go-pear.php`**.  Load it up in your web browser and go from there.

The only configuration change I had to do was change the default directory prefix from my development testing browser location to `c:\php5.2`.  So far it looks better (plus the web interface was pretty sweet!).
