---
title: Live Combined Error Reporting for Apache and PHP during Development
date: 2007-07-20
tags:
- apache
- eclipse-pdt
- ide-and-web-dev-tools
- scripting
---
So many times during development, I've missed little PHP errors because they were 1) on a processing page that was redirected or 2) output inside of a html tag - and rendered invisible.  From time to time, I have to go back to my file system and check the php error log to see what happened.  The first step to solving this was implementing a custom error handler - which we did at ("the triangle").  But I'm torn on this: should the error handler script function the exact same during development as it does in production, or should we write two different error handlers.  To keep the code as simple as possible and allow for scenario regeneration, I opted to have the error handler work the exact same way in development.  Some might disagree, but that's not the point here.  The issue was that I needed to watch the error log closer (I'm notoriously bad at not checking errors - see my previous post about error reporting...).

<!--more-->

Another thing I knew would be nice to see would be the apache error log.  As I'm not combining my error logs with php, I don't often check the apache one.  However, local mistakes can cause errors on the production server too.

Luckily, I was able to find a utility that made life easier - and of course - integrates into eclipse.  Lets configure:

**The meat: a perl script**

A perl script called logtail ([author's website](http://www.fourmilab.ch/webtools/logtail/):   - and [here is the file](/uploads/2007/logtailtar.gz) in case the website ever goes down), is used to enhance the `last -f` command type output used on the *nix platform.  since I'm developing on Win32, I don't have the `last -f` command natively - and was happy to see this perl script could run without it.  I installed w32 perl and was able to launch this script successfully.

I should stop right now to say why a PHP fanboy is using a perl script - and I think its just because that's the best solution for the problem at hand.  I am far more comfortable with Perl's socket management than PHP.

In my command prompt, I then ran the perl interpreter [which isn't in my path - we're not allowed to modify our path variables... at ("the triangle")] by using the full path, added the full path to the perl file, and then added my two log files.  While this process was running, I surfed from page to page - and made sure to generate both apache and php errors.  Success!  It updates to the screen.

**The potatoes: Moving on to eclipse**

I opened up Eclipse's External Tools menu and made another external tool - I named it monitor logs.

First thing's first, fill in your location of perl in the Location: dialog box.  I used:

`C:\Program Files\Perl\bin\perl.exe`

Next, the arguments box: fill in the rest of your command line.  I used:

`c:\tools\logtail.pl c:\php\error.log "c:\program files\apache group\apache2\logs\error.log"`

Finally, save it and click run.  You may see a console window appear the next time you have an error... why? Well lets checkout...

**The Gravy: Eclipse keeps it running in the background**

Sometimes you may not see an initial console window - but don't worry... its running.  As soon as you generate an error and output is created, the console view will open up and you'll see your output.  If the output is annoying, just close the view - the program stays running!  The way to stop this program would be to click the red square - stop command - on the console window.

I found that this is one of the coolest little hacks so far - I love being able to watch multiple error logs.  We know that we shouldn't be generating errors at all - so having this in my IDE, where I'm actually coding - is the best.
