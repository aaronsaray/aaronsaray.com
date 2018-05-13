---
layout: post
title: Composer-based Utility Installs vs Global Installs
tags:
- phpunit
- php
---
I'm a huge fan of tools like PHPUnit.  Or any other tool that will help my project carry on.

But, maybe it's because I've been using them for a long time that I always favored global installs vs composer based installs.  But, maybe that's wrong now?

Let me trace the history...

Many years ago, there was this tool called PEAR.  Ok, I'm being slightly silly - but I "grew up" using tools like PEAR to install my tools globally.  But, I was never a fan of this because I didn't like the idea of installing something to the global file system (like a framework) that would be shared among all my projects.  What if I wanted to upgrade the framework in one project but not all of them all at once?

So, I used PEAR for tools that I somehow thought should be shared (like PHPUnit) and downloaded individual components / their versions by hand and versioned them into my project.

Then, as PHAR become more common, I tended to shift my thoughts to downloading a .phar file, renaming it to look like a binary, and marking it executable.  Still, it was still global.

I remember recently looking at installing PHPUnit on a new project and seeing the composer - based install.

A knee jerk reaction was to ignore that install and install it to the filesystem globally instead.  Why would I want to duplicate this code to my local working directory when I would be using it among many projects?

Perhaps by now, you're seeing the flaw in my reasoning.  I gotta admit - I was still being old-school and stubborn.

So, on my most recent project, I use apt-get to install PHPUnit.  All was good and fine until I did a --version on the command line tool - for some unknown reason.
    
    PHPUnit 3.7.28 by Sebastian Bergmann.

Ruh roh - all this time, I had been looking at the docs for the newest 4.x version of the platform, 4.6 stable.  

Now, I think I finally get it.  Let me summarize for those who have been dense for years like me:

- Hard-drive space and bandwidth are cheap.  There is no need to share the install of a library for those reasons.
- Always read/document and test against a known version.  If you don't include the library as a declaration (I'm looking at you composer.lock file), you can't guarantee what version of the library you're using.
- Don't be stubborn - change with the times.  Sometimes, when everyone's doing it someway (composer require phpunit/phpunit), there's a reason why
