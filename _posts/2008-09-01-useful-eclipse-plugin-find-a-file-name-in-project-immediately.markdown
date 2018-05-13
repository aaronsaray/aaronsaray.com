---
layout: post
title: 'Useful Eclipse Plugin: Find a file name in project immediately'
tags:
- eclipse-pdt
- ide-and-web-dev-tools
---
Unfortunately, at #superdev, there are times when the `include_path` in PHP is calculated.  It is not always clear where to find a file.  Other times there are just too many places to find the file.  Because of this - and Eclipse PDT's inability to find a file from an include or `include_once` statement when you ctrl click it, I needed to find a tool to find files fast.

### Don't be Lazy - use 'Teh Google'

So for the longest time, I would determine what classes or functions were being used from the included file, and then do a search of the code base for `function functionName()` because I knew it would find that file ... eventually.

Well, turns out, there is a better way.

### go to File Eclipse Plugin

[![](/uploads/2008/screenshot-300x177.jpg)](/uploads/2008/screenshot.jpg){: .thumbnail}

I found this great plugin for eclipse: [GotoFile @ muermann.org](http://muermann.org/gotofile/).  I wish I had thought that this could be done - and searched earlier! heh.  Turns out this plugin adds a new menu to your search menu by which you can launch the dialog window.  Then, just start typing the name of the file and it live searches for you.  When you finally find it, just double click it - and it'll open up the file it found in your project.  It appears to work for any file in your project - which is amazing.  For more features and details, check out hte [GotoFile Eclipse Plugin Home Page](http://muermann.org/gotofile/).
