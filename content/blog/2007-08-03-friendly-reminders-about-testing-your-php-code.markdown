---
title: Friendly reminders about testing your PHP code
date: 2007-08-03
tags:
- misc-web
- php
- testing
---
I was reading on a forum the other day about some benchmarks for PHP.  The guy had posted some results in ms measurements, and was getting upset about his erratic results.  There were some things that he was forgetting, however.

<!--more-->

First, not all tests are built to be accurate up to the ms.  Sometimes, they are ratio based.  For example, the tests you run on your development machine aren't going to perform the same as they would on the production machine (of course, in this example I'm assuming identical hardware and configuration).  There is differences in processes running, memory, etc.  The important thing to note is the ratio between a mean of tests in scenario 1 and scenario 2.

Next, if we want to be super picky, the code you're inserting to test - or the extra modules (think xdebug) you're loading to test performance - are going to actually lower your performance a small amount.  And when dealing with ms, this is measurable!

Finally, I can't believe how many people forget this: if your development machine is not an exact copy of your production server (which most of the time, it isn't), your tests MUST be ratio based.  There are so many differences here - including even the differences in performance on internal PHP functions (think windows + perl regular expressions...)

So, in summary: DO test.  DON'T take the results verbatim as proof.  Run many and use means and averages.  Be smart about how you're configuring your test environment.
