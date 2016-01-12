---
author: aaron
comments: true
date: 2009-08-30 20:03:31+00:00
layout: post
slug: display-unix-timestamp-in-a-date-format-in-mysql
title: Display unix timestamp in a date format in MySQL
wordpress_id: 333
categories:
- mysql
tags:
- mysql
---

Every once in a while, I forget about the built in awesomeness of MySQL.  Today, I was looking at a unix timestamp from PHP in one of the fields and was wondering what that date was.  Derr, use [from_unixtime](http://dev.mysql.com/doc/refman/5.1/en/date-and-time-functions.html#function_from-unixtime) function!


    
    
    SELECT from_unixtime(dateField) FROM tableName;
    
