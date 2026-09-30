---
title: "Quick PHP REPL"
date: "2025-03-27"
tags:
  - php
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2025-03-27-quick-php-repl"
  canonical: true
---

A REPL (Read-Eval-Print-Loop) is useful in a lot of cases. It allows you to run your code in this specific environment in a way that can be particularly useful with debugging.

So, what if you need a REPL in PHP but you don't have Laravel Tinker available (yet?).

<!--more-->

First, PHP has this built in already. You can launch the PHP REPL on the command line like so:

```shell
php -a
```

Now, you'll be in a PHP environment. Remember, it is just a basic, PHP environment. A lot of the useful comforts you might expect are not available. This experience is a lot like a vanilla instance of a MySQL terminal connection.

Need a little bit more? You might try [Psysh](https://psysh.org) - which is a wrapper around the standard PHP REPL.  It allows things like tab completion, documentation and the ability to launch itself directly in your application context - like a debug point.

And, if you're in Laravel, you can reach directly for Tinker.
