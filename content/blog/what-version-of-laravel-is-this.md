---
title: What Version of Laravel is This?
date: 2019-04-29
tag:
- php
- laravel
- composer
---
There are tons of ways to answer this question each with its own benefits.  Let's check out a few.

<!--more-->

## Artisan

```bash
php artisan
```

The very first line of the output shows the version.  Then it shows all the registered commands. Need only the version? Use `-V` or `--version` when running the command.

## Composer

```bash
composer show | grep laravel/framework
```

This will search the output of all installed packages and only show the Laravel framework.

```bash
composer show -- laravel/framework
```

This will show the version and a bunch of additional information like license, description and dependencies.
