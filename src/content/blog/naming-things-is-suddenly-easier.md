---
title: "Naming things is suddenly easier"
date: "2025-03-26"
tags:
  - programming
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2025-03-26-naming-things-is-suddenly-easier"
  canonical: true
---

Oh that famous computer science joke: there are two hard problems in programming, cache invalidation, naming things and off-by-1 errors.

But, on a recent Laravel project, I realized something super important. Let me show you what I was doing and see if you can follow along.

<!--more-->

First, I wanted to do a query on a User object. I needed it to be users who are missing a password - or that it is set to null. These users do not get access to something.

I found myself writing this Laravel code:

```php
User::whereNotNull('password')->get();
```

Great, but I don't like seeing things like this in my code. That feels like a smell to make a specific query on a specific field randomly, with no context.  So, I did the next best thing: I reached for a scope on user:

```php
public function scopeHasPassword($query)
{
  $query->whereNotNull('password');
}

User::hasPassword()->get();
```

Well, this is looking better... but I still don't like it.

What I did was make a mechanical scope. It just says something about the data. It doesn't say anything about the business. Remember, business people don't mention things like "password field" unless we've accidentally corrupted them with our IT words.

So, what was I really trying to do here? I was trying to build a query for users that the business had considered not set up yet. In fact, they consider them 'incomplete' users.  In the business parlance, they are people who have not verified their email or set a password; but these are just physical steps. The true label is incomplete.

Now, I have a better name:

```php
public function scopeCompleteUsers($query)
{
  $query->whereNotNull('password');
}

User::completeUsers()->get();
```

Now, the name represents the business concept - complete vs incomplete. It doesn't talk about implementation. Nice.

And then that's when it hit me.

**I have been naming things wrong.**

Or at least, I haven't been thinking about it right. I need to name my items appropriately to the scheme or context in which they're being used.  Naming becomes much easier when you consider the user case.

So, the next time you find yourself trying to figure out what to name the variable or method, take a step back. Imagine speaking to a human. What would you tell them the code does? Then, name it that.
