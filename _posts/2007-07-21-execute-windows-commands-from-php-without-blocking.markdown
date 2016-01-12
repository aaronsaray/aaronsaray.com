---
author: aaron
comments: true
date: 2007-07-21 18:23:02+00:00
layout: post
slug: execute-windows-commands-from-php-without-blocking
title: Execute Windows Commands from PHP without blocking
wordpress_id: 54
categories:
- PHP
- windows
tags:
- PHP
- windows
---

When researching for my [live error reporting posting](http://aaronsaray.com/blog/2007/07/20/live-combined-error-reporting-for-apache-and-php-during-development/), I tried running some [exec](http://us.php.net/manual/en/function.exec.php) and [passthru](http://us.php.net/manual/en/function.passthru.php) command tests by starting up calc.exe.  While they executed the command correctly, I got some weird results in my script ... which I suppose now make sense.  Lets see how we can start programs in Windows, and not run into the same issues that I did.

<!-- more -->**What happened?**

Using exec, passthru, etc, I was able to execute my windows process.  However, if you look closely at the manual entries for these type of commands, it gives a return type of either a string or an array.  They will return the output of the command ran to your variable.  (This is helpful, say... if you wanted to run a ping command - and gather the results).  Well, when you launch a program, and want your existing script to continue, this blocking seriously sucks.  After reading the comments on one of the exec commands manual pages, however, I found the solution.

**How can I start a program without blocking?**

Using the Com object in windows:


    
    $runCommand = 'calc.exe';
    $WshShell = new COM("WScript.Shell");
    $oExec = $WshShell->Run($runCommand, 7, false);
    



Of course if you wanted to run the command on *nix, you could use the standard shell_exec calls or whatever using the send to background operator "&".

**Com Components are becoming more valuable**

As well as launching programs in the background for windows, I've also used com objects for testing e-mail with outlook.  I think this is something that could be more useful for local windows developers (I wonder if a com object could be used to interface with eclipse when running the test site using eclipse's web browser...)
