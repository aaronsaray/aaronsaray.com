---
title: Laravel 5 Middleware that Requires JSON
date: 2019-03-18
tags:
- php
- laravel
---
Laravel has a built in request helper called `wantsJson()` that determines if the request is requesting JSON with the `Accept: application/json` header.  But, what if you want to only accept JSON responses?  I set up a Laravel middleware that rejects anything that isn't JSON.

<!--more-->

**`app/Http/Middleware/RequiresJson.php`**
```php
<?php
declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Symfony\Component\HttpKernel\Exception\NotAcceptableHttpException;

/**
 * Class RequiresJson
 * 
 * This middleware rejects the request if it doesn't have 
 * an accept application/json header
 * 
 * @package App\Http\Middleware
 */
class RequiresJson
{
  /**
   * Handle an incoming request - reject if not application/json
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @param  string|null  $guard
   * @return mixed
   */
  public function handle($request, Closure $next, $guard = null)
  {
      if (!$request->wantsJson()) {
        throw new NotAcceptableHttpException(
          'Please request with HTTP header: Accept: application/json'
        );
      }
  
      return $next($request);
  }
}
```

When the header is not set, this middleware throws a Not Acceptable 406 HTTP error.  Just add this middleware to all of your API routes.
