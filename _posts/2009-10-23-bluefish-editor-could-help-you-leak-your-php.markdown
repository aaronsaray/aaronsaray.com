---
layout: post
title: Bluefish Editor could help you leak your PHP!
tags:
- ide and
- IDE and Web Dev Tools
- PHP
---
The [BlueFish](http://bluefish.openoffice.nl/index.html) editor is a primarily linux based visual editor for various web languages.  Visit the site for more...

One thing I had noticed about a few projects I was working on was the presence of files named things like:

    index.php~
    settings.php~

After opening them up, I noticed that they were straight PHP code.  The settings file particularly was intriguing - as it had db credentials in it.  These were in our deployment... so anyone who surfed to `http://domain.com/settings.php~` could see our code.  Not good.

I talked with the other developers to see why this was happening.  The most irritating response I received was "just add it as a php mime type so we don't have to worry about it."  Grrarr!

[![BlueFish Options](/uploads/2009/Untitled-300x208.jpg)](/uploads/2009/Untitled.jpg){: .thumbnail}

Turns out it was one of the developers using the Bluefish editor - and then committing his entire working directory.  Bluefish has an auto backup process that creates a backup of a file before a save.  Its default setting was to use a tilde with the file name.  This option is found under the **Edit -> Preferences** menu option.

So my suggestions are to a) be very careful what you commit, b) turn off that function if its not needed or at least c) check mark the 'remove backup file on close' option.

Seems to me that some clever google queries may be able to help us find this problem elsewhere out in the wild...
