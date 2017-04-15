---
layout: post
title: Which Fires First? Error Handler or Shutdown Function
tags:
- PHP
---
I was working on writing a shutdown function for a PHP 4 script and noticed some odd behavior when I was getting errors (no way! I program and get errors? Who knew!?)  At any rate, when I would handle my error with my custom function, I noticed the shutdown function was still executing after the error function.  (Or when it was a Fatal error, the error was shown to the screen but the shutdown function was still ran...)

This got me to thinking about handling error redirection pages and sending messages on fatal errors in PHP4 (you'll remember that a fatal error won't execute the error handler, and therefore most of our custom code to make a nice 'message' won't execute).  But anyway, I digress.

I'm using PHP5.2 - this is the code I used to test:

```php?start_inline=1
function error_function() {
    print 'error function';
}

function shutdown_function() {
    print 'shutdown function';
}

set_error_handler('error_function');
register_shutdown_function('shutdown_function');

print 1/0;
```

So, as you can tell, the error handler happens FIRST and then the shutdown function
