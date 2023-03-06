---
title: Quick Honey Pots in Laravel
date: 2018-08-18
tags:
- php
- laravel
---
When someone breaches the security of a web app, sometimes it's not discovered to weeks or months later.  There are a number of tools that specialize in intrusion detection, but they may be costly or difficult to set up.  Another idea is to use a [canary in the coal mine](https://www.smithsonianmag.com/smart-news/story-real-canary-coal-mine-180961570/) or a [honey pot](https://en.wikipedia.org/wiki/Honeypot_(computing)). Here we'll talk about the concept and then demonstrate some easy and quick methods.

<!--more-->

### The Concept

Throughout normal usage of a web app, various different resources are accessed in an approved way. It becomes hard to determine if the resource is accessed by a truly authorized person or someone who's stolen authorization.  That's where canaries and honey pots come in.

When an attacker is attempting to breach the system, they're going to try the most common ways first.  Humans are creatures of habit, so a lot of us do stupid things like share passwords or create usernames like `admin`.  So, an attacker is most likely going to try to access things that are common like that.

If you look at a lot of default setups of software, the first user in the database is usually the administrator or a user with the highest level of access.  Typically, that user also has an internal id of something like `1`.  Because of this, the attackers first step is most likely going to be to determine if there is access to a first user or an admin user.

Now, if we knew how they'd attack our system, we'd fortify that area, right?  This process is about identifying a potential attack on something that should never be accessed in that way, and then using that as a tool to stop that attacker.  Let me rephrase this more concretely: if you're not using the admin user, and no one should, anyone trying to retrieve information about that admin user is suspect and should most likely be blocked (of course, this is simplification, but we're just talking conceptually here).

So, one of the things you might do is to block anyone who tries to access that user record.

### The Implementation in Laravel

Usually, the first thing people look at is the login or the user list end points of a Laravel application and try to fortify them.  I understand this knee-jerk reaction, and it's a useful activity, but it's not the only way to access these user resources.  Actually, I can't tell you what the other ways are - but a concentrated attacker will come up with one.  So, let's go deeper and consider the model itself.

#### Hydrating a Restricted Model

Let's define the actual issue: **A user should not hydrate and retrieve the admin user ever. We don't use it, it's an ID of 1, and it's left as a canary. If someone is successful in hydrating this model, they are a bad actor.**  Ok, so how do we do this?  Let's go as low as the eloquent model itself.

**`app/Observers/UserHoneyPotObserver.php`**
```php
<?php
namespace App\Observers;

use App\Models\User;
use App\Events\UserHoneyPotRetrievedEvent;
use Illuminate\Auth\Access\AuthorizationException;

class UserHoneyPotObserver
{
  public function retrieved(User $user): void
  {
    if ($user->id == 1) {
      event(new UserHoneyPotRetrievedEvent);
      throw new AuthorizationException('Unable to retrieve user.');
    }
  }
}
```

First, we create an observer for this honey pot behavior.  We will use the `retrieved` method which is executed after a model has been retrieved and hydrated.  We haven't yet returned it to the requester, but we know it's been retrieved in some manner. Again, in a perfect world, we'd have locked own all access (and we've tried our best), but in this case it has failed in some manner.

If the user that is retrieved matches our criteria (in this case, its the the ID of `1`), then we issue a new event that this has happened.  In that event, we can do any number of things (logging, ban the IP, etc).  Finally, we'll issue an authorization exception to stop the rest of the process.

This can be registered in the following file:

**`app/Providers/AppServiceProvider.php`**
```php
// snip
public function boot()
{
  App\Models\User::observe(App\Events\UserHoneyPotObserver::class);
  // more
}
// snip
```

Now, there's an observer on this eloquent model that issues an event in the case that anyone, anywhere, has tried to hydrate and load this canary or honey pot user.

#### Retrieving a Resource With Restricted Properties

Let's imagine your application is built with regular users, admin users and system users.  System users are restricted and used to run system commands internally.  You do hydrate them in command line scripts, but you never want them retrieved by an end-user.  

In this architecture, we're going to imagine we have a route defined that binds in the user, some `GET` route like this `/users/{user}`.  The user has many roles.  The restricted role is `Roles::SYSTEM_USER` - this type of user should never be retrieved by any endpoint that requests user information.  (Perhaps its only used for internal auditing, command line stuff, things like that).

Let's make a middleware that we'll register on all routes.

**`app/Http/Middleware/SystemUserHoneyPotMiddleware.php`**
```php
<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Route;
use App\Models\Roles;
use App\Events\SystemUserHoneyPotRetrievedEvent;

class SystemUserHoneyPotMiddleware
{
  public function handle($request, Closure $next)
  {
    $response = $next($request);
        
    $route = Route::current();
    if ($user = $route->parameter('user')) {
      if ($user->hasRoles(Roles::SYSTEM_USER)) {
        event(new SystemUserHoneyPotRetrievedEvent);
        throw new AuthorizationException('Unable to retrieve user.');
      }
    }
        
    return $response;
  }
}
```

This middleware is an **after** middleware.  First, it runs all of the things that are required - including retrieving and binding the user into the current route.   Then, retrieve the current route using the `Route` facade and attempt to retrieve the user bound model.  Then, if the user exists (we're going to add this globally so we don't forget about it), and it has a system role, we'll issue the event and deny access.  The event could do any number of things to restrict access, block the IP, etc.

This is registered globally:

**`app/Http/Kernel.php`**
```php
// snip
class Kernel extends HttpKernel
{
  protected $middleware = [
    // others
    App\Middleware\SystemUserHoneyPotMiddleware::class
  ];
// snip
```

Now, all end points will look for system users being retrieved.  If they see it, they'll issue your honey pot or canary event and restrict access.

### End Notes

This type of architecture is a **one off** decision to add things more forcefully and globally. Normally, I'd be careful to add observers to just the events I need. I'd register middleware only when necessary.  But, the idea of honey pot and canary testing is that you don't always know the areas where someone might attack you.  By programming "with a hammer" this way, you can catch things that fail outside of your planning.

There are many solutions for your applications security.  Honey pot and canary testing is just one of them.
