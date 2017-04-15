---
layout: post
title: Launch Screen Automatically
tags:
- linux
---
Because the internet in the Crown building is as good as... well my parents 19.2K dialup - which drops pretty much every 5 minutes, I've had to use GNU screen extensively.

I've modified my .bash_profile page to have the following line:
    
    exec /usr/bin/screen -R

This way it automatically reattaches to any screen it lost when it last disconnected. If none exists, it just creates a new session.  Simple but very useful.
