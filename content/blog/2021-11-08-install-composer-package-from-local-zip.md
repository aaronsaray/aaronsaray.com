---
title: How to Install a Composer package from a local zip
date: 2021-11-08
tags:
- php
- composer
- laravel
---
I use [Laravel Nova](https://nova.laravel.com) in a lot of my projects, but I've never liked the idea of storing the files in a local directory after download.  Yes, you can use credentials for a Composer-based install, true, but I wanted something that didn't require that.  Turns out you can install packages like Laravel Nova from a zip file locally.  Here's how.

<!--more-->

First of all, I should say that this is all covered in the [Composer repositories](https://getcomposer.org/doc/05-repositories.md) documentation section - but I never fully put it all together.  Maybe this example will save you some time as well.

Now, get your zip file that is in the format of a Composer repository source.  This means it has a `composer.json` file in its root directory.  I downloaded one from Nova's downloads, but you might also find these in the releases of Github projects.

Store that in some place that's in your project but out of your normal browsing / searching.  (I didn't like unzipping the Nova project into my project source code because my IDE would find multiple copies of the same file. I could have filtered that out, but I think this is better.) I'm placing my file at `/packages/nova-3.30.0.zip` in my Laravel project.  This is the same level as `/app` or `/tests` folders.

Finally, you need to modify or add a section to your `composer.json` file like so:

```json
"repositories": [
  {
    "type": "artifact",
    "url": "./packages"
  }
]
```

This is in the top level.  Now, Composer knows to check for [artifacts](https://getcomposer.org/doc/05-repositories.md#artifact) and will install from that directory if it can find it.

So, now it's simple:

```bash
composer require laravel/nova
``` 

And we're good to go.