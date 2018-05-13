---
layout: post
title: Timetracker Timeclock
tags:
- php
---
The 102 Degrees Timeclock software package is a very simple interface for keeping track of time.  Instead of purchasing a timeclock, you could resurrect an old laptop and run this software on it.  With a very simple clean interface, even beginning computer users will feel comfortable. The timeclock has .csv generation for reporting - which can easily be opened in Microsoft Excel.  The entire interface is web based.

[![Time tracker](/uploads/2008/timetracker-screenshot-300x133.gif)](/uploads/2008/timetracker-screenshot.gif){: .thumbnail}{: .pull-right}

The software requires PHP5 with MySQL.

You can download it here:
[timetracker - timeclock 0.1](/uploads/2008/timetracker_01.zip)

**Installation Instructions**

After you upload the contents of the zip file to the root of your website (in future releases, I'll make it be available to any folder..), you can visit your website's domain.  This will launch the install script.

The script will ask for MySQL credentials.  You need to have a hostname, user and password, and a database for the software to write to.

Finally, after you submit it and receive a successful message, delete the install.php file.

Then, visit your domain again, and you're good to go - or follow the directions on the screen to set up your users.
