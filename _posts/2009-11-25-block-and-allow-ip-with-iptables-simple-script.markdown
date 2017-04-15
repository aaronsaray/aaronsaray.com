---
layout: post
title: Block and Allow IP with iptables - simple script
tags:
- linux
- scripting
---

As most developers are lazy, I'm a huge fan of scripts.  I've found myself lately having to add entries to iptables to block a single IP or a small subnet, so I made a quick script to make the job easier on myself.

Usage for both of these is of course really simple.  Say 123.1.2.3 is the IP in question:
    
    sudo ./blockip.sh 123.1.2.3
    sudo ./allowip.sh 123.1.2.3

**blockip.sh**

Blocks the IP using iptables
    
    #!/bin/bash
    
    #blocking iptables
    /sbin/iptables -A INPUT -s $1 -j DROP
    
    #saving iptables
    /sbin/iptables-save > /etc/sysconfig/iptables

**allowip.sh**

Removes the entry from iptables
    
    #!/bin/bash
    
    #allowing iptables
    /sbin/iptables -D INPUT -s $1 -j DROP
    
    #saving iptables
    /sbin/iptables-save > /etc/sysconfig/iptables
    