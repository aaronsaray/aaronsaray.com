---
title: PHPUnit Runs Data Provider Before Setup
date: 2018-12-03
tags:
- php
- phpunit
- testing
---
I started noticing a disturbing trend on one of my projects: developers were doing too much logic in the `setup` and data provider methods of their PHPUnit tests. However, before we could address this, a "limitation" popped up which helped them kick this habit.

<!--more-->

When you use a [data provider](https://phpunit.de/manual/6.5/en/writing-tests-for-phpunit.html#writing-tests-for-phpunit.data-providers) for a test, the values here should be very simple and pre-calculated. The issue was that there was logic being applied to some of these values which negates the whole point of a test. (Don't test logic with logic.)  Well, at one point, the logic went too far: resources from the `setup` method were being used to build the data provider values.  That's when we discovered the "issue."

**Data providers in PHPUnit run before setup.**  This means that the values from the data provider, which should not require logic anyway, are all returned to the context of the method before the setup method is even ran.  That means you can not rely on the setup method's information to generate values in your data provider, which is great news!