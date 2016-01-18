---
layout: post
title: 'Eclipse PDT2 won''t jump to functions/classes on ctrl-click: solved'
tags:
- Eclipse PDT
---

I am using the new PDT2 based off of Eclipse 3.4.  The one thing I noticed as an issue for me was the building.  I created a project based off of a checkout using SVN.  After I had built the PHP project, I could not ctrl-click any of the functions that were part of my project.  It just wouldn't find them.

The solution for me was to configure the build path to include the project itself.

1. Right click on open project.

2. highlight build path

3. click on Configure build path...

4. Click Add Folder... button.

5. Put a check mark next to your project.

6. Click OK.

If necessary, click the project menu and choose the 'clean...' option to rebuild.
