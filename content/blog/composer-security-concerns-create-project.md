---
title: Composer Security Concerns with Create Project
date: 2019-01-21
tag:
- php
- security
- composer
---
One of the lesser known pieces of functionality from [Composer](https://getcomposer.org) is the ability to create a project from skeleton/scaffolding. This ability allows you to create a project structure, directory, files and requirements based on the suggested setup from the project maintainer.  A common [installation mechanism of Laravel](https://laravel.com/docs/5.7/installation) uses this functionality.  (Even [I use it](https://packagist.org/packages/aaronsaray/laravel-boot) to save time and set up my own custom configuration for new project skeletons.)

<!--more-->

But, there is a security concern lurking around the corner.  Try creating this project on a Mac:

```bash
composer create-project aaronsaray/composer-mac-security-demonstration
```

What did you hear?  This project created some files on your local machine, and then executed the `say` command to speak to you.  I doubt that was something you had wanted to happen.  Using the `say` command was just a demonstration.  Technically, we could execute a lot of commands, actually.  Good thing you're [not running composer as root](https://getcomposer.org/root), right?

This functionality is made possibly by the [scripts functionality](https://getcomposer.org/doc/articles/scripts.md#command-events) built into composer.  Commonly used to execute PHP code and do system cleanup, there are no real limitations.  Luckily, we're all reviewing the source code of our open source projects, before we install them, right?  Speaking of reviewing source, you can review the source [of this example right here](https://github.com/aaronsaray/composer-mac-security-demonstration).

**But Aaron, this seems like a big problem! Am I hostage to all packages I install?**

You might have noticed that this was demonstrated using the `create-project` functionality.  That's because there is some security already in the scripts functionality of composer.  Only scripts in the root `composer.json` file will be executed.  So, that means any of your libraries could have additional scripts to run, but composer will not execute them.  However, when we're using the `create-project` functionality, we're executing at the root level context of composer, so it will execute the scripts.

**Is this only a Mac problem?**

Naw, I just thought it'd be fun to demonstrate this using the Mac's `say` command. Really, it could execute any command.

## This Isn't the End

There are more opportunities to take advantage of in the Composer ecosystem.  Imagine someone creating a [custom installer plugin](https://getcomposer.org/doc/articles/custom-installers.md) and dropping it into packages that you trust. 

What about someone creating autoloading classmaps that conflict with your project or some of its dependencies.  What will composer do then? Will it load your code or theirs?

The big thing here is to make sure you review your projects.  And don't just trust that they're ok because tons of people use them.  Remember, this has [happened before with npm packages](https://www.theregister.co.uk/2018/11/26/npm_repo_bitcoin_stealer/) - it can happen to your packages as well.