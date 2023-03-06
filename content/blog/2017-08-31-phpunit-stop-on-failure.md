---
title: PHPUnit Stop On Failure
date: 2017-08-31
tags:
- php
- phpunit
---
From time to time, I get thrown onto a project that has many, many errors in the unit tests.  It can be hard to try to figure out what to fix first with so many errors on the screen.  Sadly, I've had my scroll-back buffer filled many times.

<!--more-->

Or, there are other times when I'm working on a unit test and I know that some of my tests are broken - but I just want to start from the top and fix them one by one.  

For these reasons, I don't like it when all the unit tests run from start to finish.  I want it to stop at the first error. I'm going to fix that one most likely first anyway.

You could argue that you might take a look over some of the tests, figure out what's wrong, and maybe fix the middle one which might end up causing the rest of them to succeed.  I get that.  But more often than not, in test land, I'm working like sort of a mindless robot.

> I actually haven't yet figured out any reason why we'd want the unit tests to keep running after first failure - unless it was some sort of metric saying "we have 20 broken tests" - which I'd rather they just be marked skipped or fixed - than keep them in the code base and broken...

So, to make sure that my unit tests stop immediately, I add one setting to my **`phpunit.xml`** file's configuration.  Add the attribute and value set to the root `<phpunit />` element like such: `stopOnFailure="true"` 

This will stop your test suite on the first error - and you can work through it from there right away.