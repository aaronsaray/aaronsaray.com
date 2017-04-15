---
layout: post
title: Pass PHP session to a new script using fsockopen
tags:
- apache
- PHP
---
I was working on a script that opened up a new connection to the same server with fsockopen to process a php script.  It passed the variables needed through GET and then gathered the output.  Finally, it displayed the output on the screen under the current context.

I ran into an issue where now I needed to set a session variable in my calling script, but make the same session information available to the called script (the called script starts its own session too).

This is how I did it:

**The session ID is being stored via a cookie**

There is a cookie named after our session with our session id.  When my called script generated a new session, it did not have this cookie available, and consequently started its own empty session.

**Pass the cookie name and value in the HTTP Header**

I needed to send the cookie name and session id to the script.  Remember, this only works because these two scripts are on the same server/domain.  I used this code:

```php?start_inline=1
$out .= "Cookie: " . session_name() . "=" . session_id() . "; path=/\r\n";
```

**Close your session before you re-open it**

Doh!  I passed my cookie values, and my apache/php kept freezing.  I forgot to close my session before I posted to the open fsock connection.  Do this using [session_write_close()](http://php.net/session_write_close).

**All in all, it wasn't as hard as I thought**

At first I was ashamed that I hadn't thought this out.  Then, I got a little confused with the session/cookie freeze situation.  However, finally, it all worked out fine.  I had to keep remembering that my session wasn't available after I closed it in my calling script, however!
