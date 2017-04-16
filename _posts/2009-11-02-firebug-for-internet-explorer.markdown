---
layout: post
title: Firebug for Internet Explorer
tags:
- IDE and Web Dev Tools
---
During the creation of my websites, I develop solely in Firefox.  When it comes to testing, I run it through [IE tester](http://my-debugbar.com/wiki/IETester/HomePage).  One thing that I really miss is my [Firebug](http://getfirebug.com/).

### Enter Firebug Lite

Firebug Lite is a stripped down version of Firebug.  For the details of the current release, look at the [firebug lite features](http://getfirebug.com/lite.html).

For my code, I decided to only include the firebug lite code from their distribution when not in production.  This is how I do it in my code:

```php?start_inline=1
if (!ENVIRONMENT_LIVE && strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false) {
  echo '<script src="http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js" type="text/javascript"></script>';
}
```

In this case, whenever the code is not in production and the agent is a version of Internet Explorer, the code is loaded.

### Issues with Firebug Lite

Regular Firebug has spoiled me.  The lite version has a few issues:

  * The inspect feature is somewhat quirky.  Sometimes it clicks links instead of selecting the DOM element.  It also has a delay.

  * The CSS view shows the whole entire computed style, not just items you've added.

  * You can't do any inline editing of elements in the DOM tree.

Overall, its a real nice addition to my IE debugging back.
