---
author: aaron
comments: true
date: 2007-07-12 02:42:13+00:00
layout: post
slug: show-the-right-files-in-php-explorer
title: Show the right files in PHP Explorer
wordpress_id: 48
categories:
- Eclipse PDT
- IDE and Web Dev Tools
tags:
- Eclipse PDT
---

After I installed Eclipse PDT, I had two project navigators.  I closed the native one and kept open the PHP Explorer.  PHP Explorer showed my php, css, js, etc, files.  It also puts a plus sign to the left of the filenames.  Using this view, we can expand the file to see the classes and functions inside of the file without opening it.

The only issue was that, by default, I couldn't see my .htaccess and .htpasswd files.  On the bright side, using SVN, I couldn't see my .svn folders - which is exactly what I wanted.  Put, this put the issue into a different light - there must be some sort of filter that is restricting files that begin with a dot.

At the top of the PHP Explorer, there are a few toolbar buttons.  Clicking the down arrow brings up a context menu.  I choose the filters... menu item.  By default, 'name filter patterns' was not checked.  .* files and server projects were selected in the second box.  This makes sense why I was not seeing my .htaccess file.

First, I unchecked my option .* files.  This fixed the issue - I was able to see the .htaccess files - but I also saw my .svn folders as well as additional meta files.

I checked the box saying "name filter patterns" and put in the following string:

**.cache, .settings, .svn, .project, .projectOptions**

This seemed to do it for me.
