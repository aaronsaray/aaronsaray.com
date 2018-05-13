---
layout: post
title: AssertSame vs AssertEqual in PHPUnit
tags:
- php
- phpunit
- testing
---
When you're testing inside of your PHPUnit test methods, you will use many assert-based methods.  Two that are seemingly very similar are `assertSame()` and `assertEqual()`

The difference between these is the same as the difference of `===` and `==` in PHP.  One is equal and one is identical.

`assertSame` is the closest to identical comparison that you can use.  So, when you have a choice, use `assertSame()` instead of equals.  This will help catch type mismatches as well.