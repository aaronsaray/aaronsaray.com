---
layout: post
title: 'DateTime: My new best friend'
tags:
- PHP
---
I have a new love affair... PHP's [DateTime](http://us2.php.net/manual/en/class.datetime.php) object.  I'm not sure when it started, but it's going on strong now.  If you haven't taken a look at it, I invite you to run over there now and just look at the methods.  If that isn't enough, let me give you a bit of example code... see if this makes you really want to do it:

```php?start_inline=1
$firstDate = new DateTime('01/12/2012 10:00:00');
$secondDate = new DateTime('2012-01-01 23:23:23');
echo $firstDate > $secondDate ? "First Date is Newer" : "Second date is newer";
```

What do you think the output will be? How EASY is that?!
