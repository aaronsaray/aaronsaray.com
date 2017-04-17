---
layout: post
title: Adobe Air Log File Watcher
tags:
- adobe air
- log file watcher
---
One of the biggest pet peeves I have is when errors are generated on PHP files between redirects using the `header()` function.  Especially if they're not a fatal error, you never get to see them!  Also, missing files that hit the apache logs usually are not found later until you review the logs as well.  I thought: wouldn't it be great if there was a tool that would watch these log files for me?  (yes, a while ago, I talked about the perl "tail" script that I used in my eclipse to watch these... but... this is even better).  Well there is a solution!  My first Adobe Air application: Log File Watcher!

This was my first attempt at using Adobe Air - and I'd have to say I like it.  This application is very ugly - I didn't really use any CSS or anything.  I used JS and HTML - no action script (well besides AIR's built in stuff...).

Basically, I found some examples online and pieced them all together - and it worked!  So yay. (Also, a good portion of this was done while working at SuperDev - sooo... shhhh)

Anyway, when you first start out the application, you can choose 1 or more files for it to watch.  Then, when you click to start the watching, the application minimizes to the tray. (at least in windows...).  Then, it will generate a popup whenever there is a change in any of the files that you're watching.

Yeh, not great, but it was a start.

I've attached the AIR application - and a zip with the source in it.  If I find time later, I might come back and rewrite it to be 1) prettier and 2) more useful. hah!

Adobe Air Application: [logfilewatcher.air](/uploads/2008/logfilewatcher.air)

Adobe Air Source files: [logfilewatcher.zip](/uploads/2008/logfilewatcher.zip)
