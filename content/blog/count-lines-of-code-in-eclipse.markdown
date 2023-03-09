---
title: Count lines of code in Eclipse
date: 2011-04-05
tag:
- eclipse-pdt
- ide-and-web-dev-tools
---
When searching for how to count the lines of code I had in my project, I ran into this [blog entry](http://www.binaryfrost.com/index.php?/archives/207-Easy-way-to-count-Lines-of-Code-in-Eclipse.html).  While it's a good start, it still gave me some inaccurate counts.  I was getting inflated counts because of new lines.  So, here is my alternate solution:

<!--more-->

  1. Open Eclipse and open your project

  2. Click the Search menu and choose 'file'

  3. In the containing text box, enter "\w+\n" without quotes and then check the regular expression box.

  4. In the file name patterns box, enter the extensions of all your source.  I added .php,.phtml,.js,.html,.htm,.css

  5. Make sure Workspace is selected and click search

The result will the number of matches found in the search panel.  The regular expression makes sure that the new line has at least one or more non white space character.
