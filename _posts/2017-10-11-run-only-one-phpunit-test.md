---
layout: post
title: Run A Single PHPUnit Test Only
tags:
- php
- phpunit
- Testing
---
Often times, I find myself targeting a single file with PHPUnit by specifying the file after the binary in the command line:

`vendor/bin/phpunit tests/MyTest.php`

This will execute all the tests in this file.  From time to time, I find that I have an issue in one of my test methods that I need to fix.  This can get annoying if this is at the end of the file.

So, up until now, I'm sorry to admit, I was commenting out most of the code, just leaving my test available.

But there's a better way!  Use the `--filter` option to choose a single 'pattern' in your test file.  In this case, I'm going to use the full name of one of my test methods.  (Keep in mind, you can not specify the test file at all, and just use the filter parameter, but it's going to iterate over all your test files then.  This could be useful in certain scenarios.)

`vendor/bin/phpunit tests/MyTest.php --filter testDoSomethingSucceeds`

Boom - just one test ran.