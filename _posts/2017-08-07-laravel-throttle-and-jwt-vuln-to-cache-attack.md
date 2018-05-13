---
layout: post
title: Laravel Default Throttle Configuration and Common JWT Blacklist Vulnerable to Cache Attacks
tags:
- php
- laravel
- security
---
One thing I like about [Laravel](https://laravel.com/) is the amount of built-in functionality that is available.  But when this functionality is left in default configuration (much like many [default](https://snyk.io/blog/mongodb-hack-and-secure-defaults/) [configuration](https://krebsonsecurity.com/2015/02/spam-uses-default-passwords-to-hack-routers/) items getting hacked), there can be consequences.

> Just a bit of a disclaimer: I'm not trying to say everything is broken and omg the developers are horrible. I'm saying _you_ should understand what you're using, why it's working, and how you could have problems if you don't put in the effort to configure and secure things properly.

Partial blame lies on the default configuration of these packages (however, if they were more complex to configure, one might say they'd have less adoption), but the majority I think lies in the fact that too many people set-it and forget-it - never understanding what their third-party software is doing.

So, let's talk about what the vulnerability is.  Stick with me here - it can get a little abstract - but once I describe all of it, it might help you understand how it can be done - and help you figure out how to secure yourself.

> At time of writing, we're referring to Laravel 5.4.

### Laravel Throttle Default Configuration

Since I work primarily on APIs using Laravel, I have always been concerned about throttling connections.  Luckily, in a release of Laravel, a [default middleware package](https://laravel.com/docs/5.4/middleware#registering-middleware) was introduced which sets up throttling.

To have this enabled, add the following line to the `$routeMiddleware` variable in `App\Http\Kernel` class:

`'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class` 

Once this is defined, you can either add it per route or on a route group by using the suggested/default setting of this:

`throttle:60,1`

This basically says there can be up to 60 requests within one minute.  If there are too many results within that rolling period, you'll get hit with a `429 Too Many Attempts` HTTP response.

Great - this is super easy!

But then I got to thinking: **how is it keeping tracking of who it is throttling?** - Not because I cared so much, as I wanted to make sure that legitimate customer's weren't getting throttled.  I wanted to know if it was happening, who it was happening to, and investigate into their usage patterns.

### Laravel Default Throttle Storage Mechanism

So, after digging through the code, I found out how the signature is built for this throttle.  The `fingerprint()` method on `Illuminate\Http\Request` was used - which is basically building a SHA1 of the route's methods, domain, URI and IP. 

Well this is good.  It's not using a user model or anything silly like this.  I know how it's being tracked, next I just need to find out where it's stored.  Back to the middleware.

There is a limiter instance which has a method called `tooManyAttempts`  So, I went over to that class which is `Illuminate\Cache\RateLimiter` - and my heart already started to begin to sink.  This is part of the Cache namespace, so it probably uses the cache to store these fingerprints.  

I found a reference to `$this->cache->has()` which references an injected instance of `Illuminate\Contracts\Cache\Repository` which is likely the default cache set up that you've instantiated in your project.

**The fingerprint, frequency and lockout criteria is being stored in a cache.**

Before we go into why this is bad, let's see if this might be the same anywhere else.

### Tymon JWT Package

The [JWT package by Tymon Designs](https://github.com/tymondesigns/jwt-auth) has saved me a LOT of time.  I'm very grateful.

I am using the blacklist feature of this.  When you stop and think about it, it's a lot like the throttling aspect.  We have a fingerprint that we no longer want to access something.  We have to store that somewhere.  I wonder where this JWT package stores it. I don't remember configuring a database... (what a leading question...)

In the `Tymon\JWTAuth\JWTManager` file, there is a method named `invalidate()` which accepts a token.  It references the blacklist and calls the `add()` method.  The `Tymon\JWTAuth\Blacklist` class does some calculations, but in the end refers to its storage property by adding the blacklisted token jti value.  That's when I saw the `$cacheLifetime` variable and I got those fears again.

The blacklist accepts an instance of `\Tymon\JWTAuth\Providers\Storage\StorageInterface` - which I did a find-usages on in PHPStorm.  This is instantiated in the provider for this and returns an instance of `$app['tymon.jwt.provider.storage']` - which is defined as a singleton instance of the JWT configuration (rabbit hole almost over here!) to `providers.storage` which is from the **`config/jwt.php`** file in my application which is mapped by default to `Tymon\JWTAuth\Providers\Storage\IlluminateCacheAdapter` which receives an instance of the Illuminate Cache Manager - your default configuration for your cache again.

Again, this information is not 'hidden' - it's clearly in the configuration file - but have you looked at this and changed it?

### So How is This Attacked?

Well, what do we know about caches?  They shouldn't be the first / only source of your information and they are ephemeral - they go away quite easily and at any point. (Or at least we should be planning that they could be.)

So, what we're doing is storing a short-term (throttling) or a long-term (blacklist token until expiration date) resource in a cache - something that goes away.  This isn't good.

Depending on how you have your cache set up for Laravel, this can be attacked a number of ways.

**Filesystem Cache** If you're just using a filesystem cache, this is vulnerable to the random person/process deleting files.  Sounds silly, but imagine that you put your cache into the `/tmp` directory - this will get cleared depending on your configuration by [tmpreaper](http://manpages.ubuntu.com/manpages/wily/man8/tmpreaper.8.html) in Ubuntu for example.  I'm sure there are other garbage collection services in other distros.

**Redis or Memcache** If you're using one of these cache's, you have to become very aware of your configuration.  For example, if your Redis cache is filling up/too full, it will [purge data](https://stackoverflow.com/questions/5068518/what-does-redis-do-when-it-runs-out-of-memory) that isn't marked in such a way to leave it to the last possible moment.  That is to say, if you haven't configured these keys to be the last on the chopping block, they might become first.   Also, remember that persistence in your Redis cache [needs to be configured](https://redis.io/topics/persistence) properly.  What if the server crashes/restarts?

Whether the files get deleted or the persistence is lost, another way to do this is to just overflow the cache with request information that is not necessary.  If you were to black-list my JWT key, I might execute a number of other actions that cause the cache to fill up (perhaps your public api caches information) I could distribute a number of requests throughout the internet, overflow your cache, get my blacklist out of your cache, and then be allowed to work again.

### How To Fix

There are a number of ways to do this.  Configure and update your default cache configuration so that it is more persistent and secure.  Persist the keys used to store this information stronger than other keys.  Things like that.

But the **best solution** within the current code's configuration is to develop two "cache" mechanisms.  First, a general cache mechanism can be your default cache.  This is one of those caches that can go away and nothing bad happens (besides extra server workload).  

Then, create a second, more secure "cache" implementation (perhaps make a driver that connects to a MySQL or NoSQL database that is designed for persistence to be used in these particularly high-security instances.)

**Fix for Throttle** Since the throttle middleware requests an instance of your default cache, I think it's necessary to bind in a different instance for just that class.

First, create a new instance of a cache connection/driver to something less ephemeral like MySQL or PHP.  Steps to do that are located [here](https://laravel.com/docs/5.4/cache#writing-the-driver).

Then, use [contextual binding](https://laravel.com/docs/5.4/container#contextual-binding) to register your specific cache driver instance to the throttle middleware.

There you go!

### Final Notes

I believe that the default _configuration_ - not the code - of these libraries open them up for vulnerabilities.  Take a look at your code - if anything seems to magic, check it out.