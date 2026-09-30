---
title: "Know your dependencies' licenses"
date: "2026-01-06"
tags:
  - composer
  - php
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-01-06-know-your-dependencies-licenses"
  canonical: true
---

Your project pulls in dozens of dependencies.
Each one has a license.
Do you actually know what you're shipping?

<!--more-->

Composer has a built-in command for this:

```bash
composer licenses
```

This outputs a table showing every dependency and its license:

```output
Name                                Version    Licenses
brick/math                          0.14.1     MIT
doctrine/inflector                  2.1.0      MIT
egulias/email-validator             4.0.4      MIT
guzzlehttp/guzzle                   7.10.0     MIT
...
symfony/http-foundation             v7.4.1     MIT
symfony/http-kernel                 v7.4.2     MIT
symfony/mailer                      v7.4.0     MIT
vlucas/phpdotenv                    v5.6.1     BSD-3-Clause
```

It's nice to see, but just a list isn't very actionable.
What if you want to automatically check for disallowed licenses?

The license command supports different output formats that make automation possible.
I'll show you how in an upcoming tip.
