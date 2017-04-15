---
layout: post
title: Short-hand PHP Dotenv instantiation
tags:
- php
---
I'm a big fan of [PHP DotEnv](https://github.com/vlucas/phpdotenv) for creating my environment variables for my scripts.  (It's always a good thing to keep your passwords and credentials separate from your source code, according to [OWASP](https://www.owasp.org/index.php/OWASP_Guide_Project)).  

Now, this is kind of nit-picky, but I never liked the instructions from phpdotenv on how to initialize their code.  This is what they say to do:

```php?start_inline=1
$dotenv = new Dotenv\Dotenv(__DIR__);
$dotenv->load();
```

Ok - so that's not that big of a deal. But, since programmers are lazy and we like to make things even quicker, I decided to use one of [PHP 5.4's new features](http://php.net/manual/en/migration54.new-features.php) in my code: *Class member access on instantiation.*

Now, my PHP code looks super simple - just like this:

```php?start_inline=1
(new Dotenv\Dotenv(__DIR__))->load();
```