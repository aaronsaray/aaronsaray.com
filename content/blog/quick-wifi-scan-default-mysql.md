---
title: Quick Local Network Scanner for Default MySQL Installs
date: 2018-11-11
tag:
- security
- mysql
- nodejs
---
The other day I was at a coffee shop and I looked around at all the Mac's open. It used to be that you'd see people writing manuscripts at coffee houses. Surprisingly, this place held a lot of programmers.  I suddenly thought of something interesting:

<!--more-->

**How many of these Macs on this wifi network had default MySQL servers running/open?**

The answer should be none. There should be a password. Or at the very least, they should be listening to only the local IP/socket.  But, I had to know...

So, I decided to write a quick NodeJS script to do the scan and try the default login configuration.  It will grab your local subnet (through CIDR), look for open port 3306 and try to log into MySQL with `root` and blank password.

You can download this at the [mysql-connect Github repo](https://github.com/aaronsaray/mysql-connect).

*What did you find?* ... none.  But, maybe your luck will be different. It's only good news if you don't find any!