---
layout: post
title: Finally - PHP has NoIndex on phpinfo output
tags:
- PHP
- security
---

### Security Issue?

A big issue with PHP security had been the developers creating a php info page and not removing it from a production site.  As you may know, phpinfo() will dump a ton of useful information (for the developer - as well as the cracker) to the screen:

```php?start_inline=1
phpinfo();
```

I can't imagine how many versions of that are out on various servers...

Actually, let's take a look with this [google query](http://www.google.com/search?q=phpinfo&btnG=Search&hl=en&client=firefox-a&rls=org.mozilla%3Aen-US%3Aofficial&hs=su2&sa=2)...

More than a million returns (granted they're not all phpinfo() calls... but it gives you a good idea...)

### There is Hope

With the release of [5.2.1](http://php.net/ChangeLog-5.php#5.2.1) of PHP, phpinfo() now outputs the following meta tag:

```html
<meta content="NOINDEX,NOFOLLOW,NOARCHIVE" name="ROBOTS"></meta>
```

This will slowly but surely stop compliant robots (see: google, yahoo... not crackerMcCrackenstein.com) from archiving these... yes!
