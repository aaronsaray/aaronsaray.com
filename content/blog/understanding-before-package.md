---
title: Understand the Tech Before Getting a Package
date: 2018-06-13
tag:
- php
- programming
- javascript
---
How often have you heard this phrase?

<!--more-->

> Is there a composer or a npm package for it?

Packages are great - they're one of the reasons why I really like open source software.  Why should we all reinvent the wheel?  If someone has done a good job already, why should I make my own copy of it?  Besides, if it's a new tech, why take all the time to learn the ins and outs if there's just an easy implementation SDK?

And there's the key phrase: "done a good job" - how do you know if your package is any good?

** I think people are approaching the package installation process backward.**

### Learn the Tech First

Many times I see people get a vague requirement ("let's use JWT"), then find a package, and learn about the requirement through the usage of the package.  A pet-peeve of mine is the retort "I can't do that, the package doesn't support it."  But the real problem here is that programmers are searching for the package first, then building their technical knowledge based on the implementation of that package.

This is problematic because we're relying on a particular programmer's (or group of programmers) interpretation of a spec and implementation.  I mean, sure, that might be great if they were the original writer of the RFC, but that's probably not them. Instead, it is someone - potentially a popular programmer or a good coder - that has decided that _this_ is the way that spec should be implemented.

There is nothing wrong with opinionated implementations, but the keyword is there: opinion.  I think a lot of people are doing this backwards.  Learn the tech first.

When you learn the tech first, you can speak intelligently about the requirements. You can determine if you really need a package or if it's just a quick 3 line fix (I can think of people implementing huge [overhead packages](https://github.com/aaronsaray/slimphp-compression-middleware) to implement gzip as middleware, for example, when a simple server configuration would suffice).  

There's another important reason you should learn the tech first, too.

### Pick the Best Package

Just because a package is popular, that doesn't mean it's the best package for the job.  There are a number of reasons why this package could be popular (good marketing, it shows first in search results, someone famous used it or made it).  It's possible it has too much functionality and overhead for your need though.  

It could actually be a bad package.  It could be too opinionated and not actually implement the spec properly. It could have security holes (you are reading through the source code of all the packages you use, right?).  It could have memory leaks.  It could use a deprecated version of the spec.  

**How would you know?**

### Learn the Tech, Then Pick the Package

So, the next time you hear about a new requirement, don't race right away to find a good package.  Yes, the delivery time of our products is important, but whether they work properly is even more important.  Plus, we have a responsibility as programmers to implement the specs properly (or, was it that you really LIKE programming front-end code for old Internet Explorer versions?).

Instead, take a minute to figure out what the need and spec are.  Learn about it, language agnostic.  Then, search out a _few_ packages and compare/contrast them.  Pick the best one for your need, for your spec, and for your project.  Don't just pick the first one.