---
title: Why I'm Starting to Love Parallel Testing
date: "2026-09-11"
tags:
  - php
  - laravel
  - testing
  - phpunit
draft: true
---
<!-- AI-GENERATED PLACEHOLDER: the entire post, from Aaron's one-line note -->
Yes, I'm behind on this one. Parallel test runners have been around for years, and I've only recently started reaching for them. But I wasn't avoiding them for no reason. I just didn't have a reason to use them yet, and I've learned not to adopt a tool until I do.

<!--more-->

## Before: A Specific Kind of Confidence

For a long time my test suites ran serially and I was fine with that. Not because I hadn't heard of ParaTest, and not because I thought it was a bad idea. The suites were fast enough. A few seconds, maybe a minute on the bigger projects. Waiting was not a problem I had.

That was a specific type of confidence: I knew my tests, I knew how long they took, and I knew a serial run would surface problems in an order I could reason about. Adding a parallel runner would have meant adding a moving part to solve a problem that did not exist.

## Now: A Reason

What changed is not the tool. What changed is that I finally have a reason. Suites got bigger. Feedback loops got longer. The minute became several minutes, and several minutes is long enough to lose your train of thought between runs.

Once the reason showed up, the switch was easy. Laravel ships `php artisan test --parallel`, ParaTest does the work underneath, and the setup is mostly making sure each process gets its own database.

## The Point

I'm not writing this to say "use parallel tests." I'm writing it because the order matters. Wanting a reason first is not the same as being slow to learn. It's how you keep the tool count down to the tools that are earning their keep.
