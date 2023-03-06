---
title: PHP Shared Host - Session File Browser Script
date: 2008-04-24
tags:
- php
- security
---
PHP stores its session information into flat files unencrypted by default. 			

<!--more-->

[![Session File Browser](/uploads/2008/sessionfilebrowser-108x150.jpg)](/uploads/2008/sessionfilebrowser.jpg){: .thumbnail }{: .pull-right}

In shared hosting situations, this can be a big security issue.  This script allows easy access to the attributes of these files as well as decoding of the values stored in them.  This script can also be used to audit the security of your current configuration.  If other users' session information is available, your information is not secure either!

[Session Browser 0.1a](/uploads/2008/sessionfilebrowser_01a.zip)
