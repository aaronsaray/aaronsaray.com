---
layout: post
title: A Better Understanding of Error Reporting in PHP
tags:
- PHP
---
While working on a website for ("the triangle"), I came to a page running locally that just stopped - blank.  This particular website was not using output buffering - so there is no excuse for a blank page.  For whatever reason (laziness, stupidity, thursdayness), I haven't checked my php.ini file for error reporting in the last few months... and for whatever reason a long time ago, I decided to go back to standard error reporting.  Well unfortunately, this means months of developing has gone by on this particular set of websites that I was possibly missing errors (never-mind everything has successfully went through QA...hrm...)  At any rate, I jumped out to PHP's website - eager and ready to copy a quick fix for my error reporting issue.  As I was getting ready to copy an `error_reporting()` line, I realized: I don't fully understand what I want to do here...Well, that's never good - copying code and not fully understanding it... so lets fix this.  Lets talk about error reporting.

**Where to error report**

First, error reporting can be set in three places: your php.ini file (which globally applies to all scripts that are ran with a php binary that uses that ini file), your apache configuration (httpd.conf, vhost container or .htaccess file which applies to those particular scripts ran under that instance of apache or vhost) and using the [`error_reporting()`](http://php.net/error_reporting) during your PHP script (which applies to that script as well as any included scripts during that one-time execution).

Combined with this is the `display_errors` directive in the ini file - but we're not going to cover that here.  We're going to assume that any staging/development server has this on, and a production server has this off.

I tend to do my error reporting in my **`php.ini`** file on my development machine - there is no reason why I wouldn't want to see all the errors that are happening.

**Set the level of error reporting**

Error reporting values are set by constants (you can find them [here](http://us2.php.net/manual/en/ref.errorfunc.php#errorfunc.constants)).  It is important to remember that the constants are not available in the apache configuration; you can still setting your configuration option using the integer value. However, if you upgrade PHP, the error reporting values are subject to change - and your integer values may be out of date.

From now on, we're going to refer to the integer values as constants - assume that they reference their integer values.

Error reporting is set by interpeting the integer value of the constant supplied - or in some cases the bitwise result of more than one constant.  since the error reporting is set up with bitwise based integers, the error reporting can flow downhill but still allow values to be jumped.  By this I mean: If you choose a bit value of 1111 - and then remove the integer 2, you end up getting 1101 - which means your error reporting is now on 1, 4, and 8 instead of 1, 2, 4, and 8.  So, its important to note that the highest value that you define is how the error reporting 'flows' - with allowing items to be removed.

**Bitwise?  How does that work?**

For those familiar with bitwise operators, the last paragraph probably seemed pretty pointless... this one you can too.  First off, someone else wrote the tutorial, so lets check it out [here](http://www.litfuel.net/tutorials/bitwise.htm).  Ok, so with that, and combined with our constants, we can create new integer values to send to the error reporting.

**What error reporting should I be using?**

Well, as I said above, I'm assuming that you're not displaying errors on the production box, so we could - theoretically - use the same error reporting on the production box as well as the development box.  However, if you're handling a lot of hits, writing a lot of errors to the log file might start to overwhelm - so I would suggest using:

```php?start_inline=1
error_reporting(E_ALL)
```

It still reports all of the major errors, but it doesn't report errors such as notice and strict.  You should catch these during development... its not worth overloading your log files in live.  (HOWEVER - if you're using `registered_globals = on`, you should add in `E_NOTICE` to your error reporting.  It is possible that a script of yours could have an unset variable which gets set by a crafted post/get request - this would be a no - no.  If using `registered_globals` - which you shouldn't be - use the `E_NOTICE` on production too.)

On the development box, this is without question - use all error reporting.  You need to know about every single error.  I'm of the opinion that code should never go to production in a state that PHP is able to report an error of it.  Use:

```php?start_inline=1
error_reporting(E_ALL | E_STRICT)
```

`E_ALL` is set and any thing that is `E_STRICT` is also set (as `E_ALL` doesn't include `E_STRICT`)

**When might I not want to use E_ALL \| E_STRICT?**

From the PHP manual for `E_STRICT`: Enable to have PHP suggest changes to your code which will ensure the best interoperability and forward compatibility of your code.

Well it might be necessary to write code that has limited backwards compatibility - and this might generate `E_STRICT` errors.  I would suggest looking for a different way to accomplish your task, however.

**What if I'm using 3rd party code - and they don't code to the same standard as I?**

From time to time, using 3rd party code, I've found that they will allow various `E_STRICT` and `E_NOTICE` errors to exist in their application.  Because we often update these code bases, I didn't want to go through and fix all of the code each time.  Instead, I put an **`.htaccess`** file in that directory (or you could use your **`httpd.conf`** file using the  attribute) with the following line:

```ini
php_value error_reporting 6135
```
    
I got that value from printing out the value of `E_ALL & ~E_NOTICE`.

Although not a perfect solution, at least this restricts these errors in this 3rd party code that I'm not responsible for.  I'm able to use it without getting peppered with errors.
