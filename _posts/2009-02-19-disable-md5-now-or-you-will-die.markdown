---
layout: post
title: Disable md5 now - or you will die
tags:
- php
- security
---
I remember a while ago hearing about a few theoretical collisions of the MD5 algorithm, but I thought nothing of them.  Now, as more information emerges, [Microsoft is issuing advisories](http://www.microsoft.com/technet/security/advisory/961509.mspx), and people are proving more and more [collisions with example code](http://www.schneier.com/blog/archives/2005/03/more_hash_funct.html), and even [md5 is out of vista](http://www.eweek.com/c/a/Security/Microsoft-Scraps-Old-Encryption-in-New-Code/), I figure its time to remind everyone not to use MD5.

### What should I do?

First of all - lets use [sha1](http://php.net/sha1) instead - equally as easy of a function to use - but much more secure.
    
```php?start_inline=1
echo sha1('test');
```

**Output:**
    
    a94a8fe5ccb19ba61c4c0873d391e987982fbbd3
    
Next, disable it in php using `disable_functions` in your configuration:

**`php.ini`**
```ini
disable_functions = md5
```
    
Finally, don't accidentally use it in your db ;)
