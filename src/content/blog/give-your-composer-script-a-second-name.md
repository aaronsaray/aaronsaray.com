---
title: "Give your Composer script a second name"
date: "2026-06-02"
tags:
  - composer
  - ide-and-web-dev-tools
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-06-02-give-your-composer-script-a-second-name"
  canonical: true
---

A composer script is often named after the underlying tool, like `phpstan`, because that is the binary the script calls.
But what if you or the team always refers to the tool as `larastan` because that is the plugin or package providing most of the functionality for your project?
"Did Larastan catch that?" asks another programmer, even though `composer.json` says `phpstan`.

<!--more-->

You could rename the script, but that might break things down the line like CI.
Or maybe you just want it to be named `phpstan` out of convention.

So, let's use Composer's `scripts-aliases` key.

```json
"scripts": {
  "phpstan": [
    "@php vendor/bin/phpstan analyse"
  ]
},
"scripts-aliases": {
  "phpstan": [
    "larastan"
  ]
}
```

Now `composer phpstan` and `composer larastan` both invoke the same script.

When an existing script name does not match the name you naturally type, an alias is the simplest fix.

Oh, and bonus: the alias value is an array, so you can even add common typos, if you're into that sort of thing.
