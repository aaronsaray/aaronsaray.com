---
layout: post
title: Helpful strtotime reminders
tags:
- php
---
Today, Todd (one of the consultants that ("the triangle") uses) called me up to share a bit of a reminder and also tell me about an issue in the code that was in one of our older modules.  There was an issue with the strtotime function converting a year to a timestamp.

I thought I'd take a few minutes to just outline `strtotime()` examples again, as a reminder:

[`strtotime()`](http://us.php.net/strtotime) is a useful function that converts english based strings to unix timestamps.  These can range from iso date formats `2007-07-11` to proper written dates `July 11th, 2007` to descriptive range based dates `+3 days`. The output is always a unix timestamp compatible with the `date()` functions.  While the manual doesn't give all the possible combinations, it does give some useful examples.  Well, in order to test and predict the behavior of this tool, I tried out a few more date combinations to see what would happen.

```php?start_inline=1
print "date('r', strtotime('now'))";
print date('r', strtotime('now'));
print "<hr></hr>";

print "date('r', strtotime('+1 day'))";
print date('r', strtotime('+1 day'));
print "<hr></hr>";

print "date('r', strtotime('06/28/1983'))";
print date('r', strtotime('06/28/1983'));
print "<hr></hr>";

print "date('r', strtotime('6/28/83'))";
print date('r', strtotime('6/28/83'));
print "<hr></hr>";

print "date('r', strtotime('6/1999'))";
print date('r', strtotime('6/1999'));
print "<hr></hr>";

print "date('r', strtotime('1999'))";
print date('r', strtotime('1999'));
print "<hr></hr>";
```

This was the output: (with php 5.2)

    date('r', strtotime('now'))Wed, 11 Jul 2007 19:05:18 -0500
    
    * * *
    
    date('r', strtotime('+1 day'))Thu, 12 Jul 2007 19:05:18 -0500
    
    * * *
    
    date('r', strtotime('06/28/1983'))Tue, 28 Jun 1983 00:00:00 -0500
    
    * * *
    
    date('r', strtotime('6/28/83'))Tue, 28 Jun 1983 00:00:00 -0500
    
    * * *
    
    date('r', strtotime('6/1999'))Wed, 31 Dec 1969 18:00:00 -0600
    
    * * *
    
    date('r', strtotime('1999'))Sun, 11 Jul 1999 19:05:18 -0500
    
    * * *

Let's check out the important things here: As predicted, most of the results came out accurately.  `Now` came out as exactly today's date and time.  `+1 day` came out as one day (24 hours) exactly in the future.  `mm/dd/yyyy` and `m/dd/yy` formats come out as expected with a proper date but a zero time.  `m/yyyy` was not properly interpreted (which makes sense, how do you know if that's a month or a day...).  Finally, the plain year came out as that year's version of today's date - which is kind of helpful (in case you wanted to know what day july 11th was back in 1999).

I wasn't entirely certain of the second from last result however.  I did a quick check, however... `date('r', 0)` comes back as the same time - so that's the proper value for a zero - or unknown date.

Another cool note is that for versions of PHP less than 5.1, they did not support a negative timestamp on windows and some *nix distros.  My version on windows have moved pass this limitation though:

```php?start_inline=1
print date('r', -100);
```

The output:

    Wed, 31 Dec 1969 17:58:20 -0600

As always, there is a wealth of knowledge in the comments on the PHP manual page.
