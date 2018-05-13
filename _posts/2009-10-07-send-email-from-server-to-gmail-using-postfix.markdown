---
layout: post
title: Send email from server to gmail using postfix
tags:
- email
- linux
---
The other day I ran into this problem where postfix insisted on delivering mail... as it was supposed to do!  As it was configured!  But this isn't what I wanted.  Let me explain what was happening:

I have a machine called `ws1.domain.com`.  It's in the `domain.com` network.  The mx record for `domain.com` points to gmail apps.  When `ws1` tried to send out mail to `aaron@domain.com`, it would deliver it to the local email box.  This is not what I wanted - I wanted it to leave the machine and go to the gmail box.  Everywhere else worked fine.

After some mistakes, I finally realized where the culprit lived...

In `main.cf`, the following variable was set:

    mydomain = domain.com

This was as it was supposed to be.  But, later on in the file, the following line existed:
    
    mydestination = $mydomain, localhost.$mydomain, localhost

This was what was causing the local mail to be delivered locally.  I removed the variables like such:
    
    mydestination =

And now everything works.  Yay.
