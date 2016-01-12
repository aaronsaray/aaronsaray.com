---
author: aaron
comments: true
date: 2009-07-07 02:06:30+00:00
layout: post
slug: launch-screen-automatically
title: Launch Screen Automatically
wordpress_id: 408
categories:
- linux
tags:
- linux
---

Because the internet in the Crown building is as good as... well my parents 19.2K dialup - which drops pretty much every 5 minutes, I've had to use GNU screen extensively.

I've modified my .bash_profile page to have the following line:

    
    
    exec /usr/bin/screen -R
    



This way it automatically reattaches to any screen it lost when it last disconnected. If none exists, it just creates a new session.  Simple but very useful.
