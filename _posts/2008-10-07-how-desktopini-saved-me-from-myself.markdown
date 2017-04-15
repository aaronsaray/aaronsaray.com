---
layout: post
title: How desktop.ini saved me from myself
tags:
- windows
---
When working at "the triangle" we used junction points on windows to link to repositories that we needed to run the code base - but weren't necessary for the project.  (see [creating junction points on windows with linkd.exe](http://support.microsoft.com/kb/205524).)

The problem I ran into was thinking I could delete my whole folder with all of the repositories after the project was done.  Unfortunately, because they were junction points, they would also delete the source of the links.

Next, I decided that I should delete each folder individually.  However, I kept forgetting which were junction points and which were real folders.  Unfortunately, windows did not automatically distinguish real folders from junction points.

Finally, I found out about [desktop.ini](http://msdn.microsoft.com/en-us/library/cc144102(VS.85).aspx) - and how I could use it to my advantage.  I ended up creating a desktop.ini file inside of each of my real folders and changing the icons to something else.  This way, I would know that they were real folders and not junction points.  This worked great and kept me from deleting junction points ever again.

Microsoft is pretty close lipped on their msdn link above - so I found this to be a better resource: [Peatsoft desktop.ini reference.](http://www.xs4all.nl/~hwiegman/desktopini.html)
