---
title: Issue 404 Not Found Middleware After Pagination Limit
date: 2017-06-01
tag:
- php
- laravel
---
A pet-peeve of mine is pagination that doesn't work properly.  One that I ran into lately with Laravel is related to the pagination system it has built in.  I was able to request pages that were larger than the last page with no discernible error.  So, I decided to write a middleware to handle this issue for all of my content.

<!--more-->

Now, in this particular example, I am using Laravel 5.4 with a JSON API response and dealing with `LengthAwarePaginator` instances (which are the default that return from calls the static `paginate` method.  This will not work (at least in this manner) if you are using an HTML response.  In addition, realize that this middleware could be easily adapted to your own framework just by changing the property values.  It is a PSR-7 compatible middleware.

Let's check out my file here:

{{< filename-header "app/Http/Middleware/Issue404IfPageAfterLastMiddleware.php" >}}
```php
<?php
/**
 * If pagination, and pagination is after the last page, issue 404
 */
namespace App\Http\Middleware;

use Closure;

/**
 * Class Issue404IfPageAfterLastMiddleware
 * @package App\Http\Middleware
 */
class Issue404IfPageAfterLastMiddleware
{
  /**
   * Handle an incoming request, add 404 if page > last_page
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return mixed
   */
  public function handle($request, Closure $next)
  {
    $response = $next($request);
    if ($page = $request->input('page')) {
      $responseData = json_decode($response->getContent());
      if (!empty($responseData->last_page)) {
        if ($responseData->last_page < $page) {
          $response->setStatusCode(404);
        }
      }
    }
    return $response;
  }
}
```

Basically, we process the other middlewares first.  Then, we try to retrieve the `page` variable from the input.  This is what our particular framework is set up to indicate which page we're using.  If that exists, we get the body content and JSON decode it. (Remember, this only works because this is a JSON API.)  If the `last_page` property exists (from `LengthAwarePaginator`), then we verify that the page we've requested is not greater than the last page.  If it is, we change the status code to 404.  We could choose to remove the entire body content, but I decided not to.  My API consumers are always checking the HTTP status code first, anyway.

Then, just remember to add this middleware to your HTTP Kernel.  I added mine to the middleware group for my API in the `$middlewareGroups` variable inside of the `App\Http\Kernel` class.
