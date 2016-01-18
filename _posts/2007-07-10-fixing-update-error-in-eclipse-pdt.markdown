---
layout: post
title: Fixing update error in eclipse PDT
tags:
- Eclipse PDT
- IDE and Web Dev Tools
---

The last time I downloaded Eclipse PDT for PHP, (located at [zend.com/pdt](http://zend.com/pdt)), everything was great.  That is, until I wanted to run the updates.  It stopped with an error and would never update my PDT.  Luckily, one of the consultants from ("the triangle") had the same issues - and he was able to tell me what was up:

Every time I ran the update, I'd get a message saying "Network Connection problems encountered during search."  My other plugins/modules above this would update fine, but this one (and everyone below it) would stop.  Turns out, it was the entry called 'zend'.

When clicking on the zend item in the list of updates, the edit button becomes available.  Changing the url from http://downloads.zend.com/phpide (because this is the old name, silly zend!) to http://downloads.zend.com/pdt solves the issue.  Then, you will be able to get your PDT updates.
