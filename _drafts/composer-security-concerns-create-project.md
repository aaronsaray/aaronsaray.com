---
layout: post
title: Composer Security Concerns with Create Project
tags:
- php
- security
---
One of the lesser known pieces of functionality from [Composer](https://getcomposer.org) is the ability to create a project from skeleton/scaffolding. This ability allows you to create a project structure, directory, files and requirements based on the suggested setup from the project maintainer.  A common [installation mechanism of Laravel](https://laravel.com/docs/5.7/installation) uses this functionality.  (Even [I use it](https://packagist.org/packages/aaronsaray/laravel-boot) to save time and set up my own custom configuration for new project skeletons.)

But, there is a security concern lurking around the corner.  Try creating this project on a Mac:

`composer create-project aaronsaray/composer-mac-security-demonstration`

What did you hear?  This project created some files on your local machine, and then executed the `say` command to speak to you.  I doubt that was something you had wanted to happen.  Using the `say` command was just a demonstration.  Technically, we could execute a lot of commands, actually.  Good thing you're [not running composer as root](https://getcomposer.org/root), right?

This functionality is made possibly by the [scripts functionality](https://getcomposer.org/doc/articles/scripts.md#command-events) built into composer.  Commonly used to execute PHP code and do system cleanup, there are no real limitations.  Luckily, we're all reviewing the source code of our open source projects, before we install them, right?

**But Aaron, this seems like a big problem! Am I hostage to all packages I install?**

You might have noticed that this was demonstrated using the `create-project` functionality.  That's because there is some security already in the scripts functionality of composer.  Only scripts in the root `composer.json` file will be executed.  So, that means any of your libraries could have additional scripts to run, but composer will not execute them.  However, when we're using the `create-project` functionality, we're executing at the root level context of composer, so it will execute the scripts.

**Is this only a Mac problem?**

Naw, I just thought it'd be fun to demonstrate this using the Mac's `say` command. Really, it could execute any command.