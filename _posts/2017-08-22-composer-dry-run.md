---
layout: post
title: Composer Dry Run
tags:
- php
- composer
---
Just another case of RTFM I'm sure, but I was wondering how to preview the changes that will happen if I do a `composer update` on my current project.  I wanted to get an idea of how many libraries would change so I could see if it would be a short or long project (potentially) to do a 3rd Party Library update. (I already hear you - and I agree - the number of files changing isn't always indicative of how long the task to update your project's dependencies will take. Shhh - quiet you.)

Well, the command you're looking for is [dry run](https://getcomposer.org/doc/03-cli.md#update):

```bash
composer update --dry-run
```

This will do all the calculations and show you what would have happened. (Bonus is that I believe it caches the calculation as well - so when you actually go do to it - it should be much faster.)