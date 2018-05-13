---
layout: post
title: Should you unit test your dependency container?
tags:
- php
- phpunit
- programming
- testing
---
I've been working with Pimple Dependency Injector lately, and I've come up with an interesting question.

**Should I unit test my container?**

Because I was having PHPUnit test issues with the anonymous function serialization of setting up Pimple in my bootstrap, I decided to put the Pimple configuration inside of class instead.  Actually, I've made it a singleton class that extends the Pimple Container class.  Then, when I ask for an instance of my own dependency class, it will build it and then issue the same one for the rest of my run-time.  The idea of unit testing a singleton is definitely something for a different entry - but more so I'm concerned about whether I should unit test the rest of my class - the build process of the container really.

Part of me thinks I should - because it is a utility that I require for the rest of my application.  If a dependency is missing, the rest of my application may crash.  I should be testing to make sure that every known dependency exists and can be retrieved.

However, part of me thinks that it's unnecessary - if you consider that the dependency injection container really is just an instance of a configuration.  You normally don't unit test configuration, right?  You don't write a unit test around your configuration ini/yml/json/xml file to make sure they work, right? (Or maybe you should - but I guess that I don't.)  But, it's really just configuration - even if you're doing a builder or factory pattern, those should be local to the class itself and under a different test, right?

I'm trying to figure out on my next project if I should unit test my DI container - what do you think?
