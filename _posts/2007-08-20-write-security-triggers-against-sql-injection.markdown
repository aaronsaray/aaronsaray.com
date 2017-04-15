---
layout: post
title: Write Security Triggers Against SQL Injection
tags:
- security
- SQL
---

An interesting idea that a colleague told me about was a 'security trigger' in any application that has a SQL type storage engine.  The trick is to make sure that your admin account is not ID #1 and that your administrative username isn't one of the most common ones:

  * admin
	
  * root
	
  * administrator
	
  * webmaster
	
  * company name / your name

Then, the next thing to do is to program a trigger in your mysql database to check against a select against ID #1 or against one of those names.  This would only happen if there was some sort of sql injection being exploited on your site... (of course make sure that the 'search' feature can't search for those usernames either - otherwise you'll get false positives!)

A very intriguing idea.
