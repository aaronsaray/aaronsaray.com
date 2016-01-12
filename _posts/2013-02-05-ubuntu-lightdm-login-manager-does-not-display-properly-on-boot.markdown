---
author: aaron
comments: true
date: 2013-02-05 15:39:29+00:00
layout: post
slug: ubuntu-lightdm-login-manager-does-not-display-properly-on-boot
title: 'Ubuntu: lightdm login manager does not display properly on boot'
wordpress_id: 1369
categories:
- linux
tags:
- linux
---

When I installed Ubuntu 11.10 and 12.04, I had the problem where the terminal would boot up until it said something about checking battery state, and then freeze.  If I flipped to a different terminal, I could sudo launch lightdm - and then login on the first terminal.  Obviously, this wasn't my first choice in fixing this, though.

After doing a little bit more digging, I found it was a combination of issues with my nvidia configuration and boot time.  I'm not an ubuntu wiz, so I don't know the specifics really.  However, I was able to make the following fix to fix my issue:

Edit /etc/init/lightdm.conf
Find the line 'exec lightdm'

Put 'sleep 1' above it.

This causes it to wait another second before it launches lightdm.  This gives the nvidia driver enough time to catch up I guess.
