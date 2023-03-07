---
title: Force Log Messages using Tortoise SVN
date: 2007-07-25
tag:
- svn
- windows
---
Everyone knows that standard SVN has its list of 6 or 8 standard hooks - but what if you're 1) lazy, 2) busy, 3) don't have access to the SVN server?  Using one of the popular win32 shell integrated svn clients, [TortoiseSVN](http://tortoisesvn.tigris.org/), we can still force commit log messages easily:

<!--more-->

SVN objects support properties.  For example, if you'd like to ignore a set of files, you might set the svn ignore property.  [TortoiseSVN has its own set of properties](http://tortoisesvn.net/docs/release/TortoiseSVN_en/tsvn-dug-propertypage.html) that begin with the tsvn: prefix.

The property we're going to set is tsvn:logminsize.  Choose the top level of your current working copy and choose tortoisesvn > properties.  Click add and choose tsvn:logminsize from the drop down.  Then, enter in a numeric value in the property content box.   Click apply recursively, click ok - and commit these changes.

For my projects at ("the triangle"), I applied a value of 7.  The standard log commit we've been doing is a project number or helpdesk ticket number (AD12345 or HD32132).  They are 5 digits at minimum.

The cool part about this now is that tortoiseSVN will gray out the OK button on your commit until you reach the minimum number of characters.

_**Disclaimer:** yes, I know this is not secure.  Its actually just to be more of a reminder to make the log messages and not necessarily and audit-able security measure. _
