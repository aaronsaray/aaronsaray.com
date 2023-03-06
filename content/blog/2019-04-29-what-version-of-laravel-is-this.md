---
layout: post
title: What Version of Laravel is This?
tags:
- php
- laravel
- composer
---
There are tons of ways to answer this question each with its own benefits.  Lets check out a few.

### Artisan

```bash
php artisan
```

The very first line of the output shows the version.  Then it shows all the registered commands. Need only the version? Use `-V` or `--version` when running the command.

### Composer

```bash
composer show | grep laravel/framework
```

This will search the output of all installed packages and only show the Laravel framework.

```bash
composer show -- laravel/framework
```

This will show the version and a bunch of additional information like license, description and dependencies.
