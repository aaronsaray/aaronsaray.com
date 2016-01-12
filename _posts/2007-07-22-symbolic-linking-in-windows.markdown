---
author: aaron
comments: true
date: 2007-07-22 00:52:12+00:00
layout: post
slug: symbolic-linking-in-windows
title: Symbolic Linking in Windows?
wordpress_id: 59
categories:
- windows
tags:
- windows
---

Be careful!  Those of you who are trying to emulate a symbolic link in windows have probably come across the [Windows Resource Kit tool linkd.exe](http://support.microsoft.com/kb/205524).  This creates junction points on the file system.  However, before you have to find out the hard way, here's my reminder... junction points are more akin to hardlinks than symbolic links: if you delete a junction point, it deletes the target as well!
