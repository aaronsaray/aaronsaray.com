---
layout: post
title: Using Namespaces in Laravel Tinker
tags:
- php
- laravel
---
I hate to admit it, but I do like [Laravel's Tinker](https://github.com/laravel/tinker) package.  Sometimes, just testing out your relationships on the command line before you go further is super helpful.

One thing I don't like, though, is the amount of typing it takes when I'm trying to test out my various models.  My structure is something like `App\Models\Group\Model` - which can get quite annoying to type.  

Check out this Laravel Tinker output:

```
>>> $account = new App\Models\Facebook\Account();
=> App\Models\Facebook\Account {#1155}
>>> $account->pages()->save(new App\Models\Facebook\Page());
```

Ugh - so many keystrokes right? :-)  

But, you can actually set your working namespace inside of Tinker.  Check out this example:

```
>>> use App\Models;
=> null
>>> $account = new Models\Facebook\Account();
=> App\Models\Facebook\Account {#1162}
```

That's cool - but let's say you knew you were even going to be working just with Facebook models, in that context - go one level deeper with your namespace usage.

```
>>> use App\Models\Facebook;
=> null
>>> $account = new Facebook\Account();
=> App\Models\Facebook\Account {#1142}
```

