---
title: "Write code the way you say it"
date: "2026-09-17"
tags:
  - laravel
  - php
  - programming
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-09-17-write-code-the-way-you-say-it"
  canonical: true
---

When I see something like this, I immediately want to "fix" it.

<!--more-->

```php
$locationsList = "'" . implode("','", $params['locations']) . "'";
```

This isn't just a stylistic thing, either.
I'm really feeling confused by this code.
A single quote double quoted, with an `implode`, with double quotes and singles... wait... what?

The output is something like `'Milwaukee','Chicago','Atlanta'`.
But it took me a little bit to read and understand that.
And don't lie, you had to read it a few times too.
And then you just trusted me that it was `'Milwaukee'` and not `"Milwaukee"`, right?

To quell this confusion, I reached for one of Laravel's helpers:

```php
$locationsList = Str::wrap(implode("','", $params['locations']), "'");
```

Ok.
So, that's actually not that much better.
Maybe even worse?

Here's the thing.
I fell for the biggest refactoring blunder ever: not really owning and understanding what the code was doing before I touched anything.
I was reacting to a feeling and not listening to the code.

So let me read the original out loud, as written.
"A single quote to begin with, add on the locations joined with a single quote and comma and another quote between them, and then end it with another single quote."

To me, that doesn't really sound like how I'd explain the output.
I'd say it like this:
"Take a list of locations, wrap each one with single quotes, and then combine them with commas."

So, let's write the code that way (I knew the helper would be useful):

```php
$locationsList = collect($params['locations'])
  ->map(fn ($location) => Str::wrap($location, "'"))
  ->implode(',');
```

It's a little longer, sure.
But now the code reads exactly like what I said.
