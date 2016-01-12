---
author: aaron
comments: true
date: 2009-11-05 17:17:10+00:00
layout: post
slug: mod_unique_id-error-after-installing-mod_security
title: mod_unique_id error after installing mod_security
wordpress_id: 493
categories:
- apache
tags:
- apache
---

After installing my mod_security module for apache, I could not restart my apache server.  I kept getting the following error:

    
    
    [alert] (EAI 2)Name or service not known: mod_unique_id: unable to find IPv4 address of "mn-ws"
    



In this case, mn-ws was the host name of my computer.

This is a pretty simple fix, but I'll document it anyway.  The issue was that my host name was not looking up to my server.

First, I executed the hostname command.  This reported back 'mn-ws' properly.  Then, I tried to ping mn-ws with no reply.  I finally put an entry in the /etc/hosts file with the following content:

    
    
    127.0.0.1 mn-ws
    



This solved the issue and mod_security would now allow the server to start.  Pretty simple.
