---
author: aaron
comments: true
date: 2008-04-24 23:34:22+00:00
layout: post
slug: php-shared-host-session-file-browser-script
title: PHP Shared Host - Session File Browser Script
wordpress_id: 98
categories:
- open source
- PHP
- security
tags:
- open source
- PHP
- security
---

![](http://aaronsaray.com/blog/wp-content/uploads/2008/05/sessionfilebrowser-108x150.jpg) 			PHP stores its session information into flat files unencrypted by default. 			In shared hosting situations, this can be a big security issue.  This script 			allows easy access to the attributes of these files as well as decoding of  			the values stored in them.  This script can also be used to audit the security 			of your current configuration.  If other users' session information is available, 			your information is not secure either!

[Session Browser 0.1a](http://aaronsaray.com/blog/wp-content/uploads/2008/04/sessionfilebrowser_01a.zip)
