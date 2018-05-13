---
layout: post
title: Laravel Pretty Print JSON Middleware
tags:
- php
- laravel
---
For testing, I tend to use [Postman](https://www.getpostman.com/) - which gives you the option to view your API JSON responses in a preview mode (interactive), pretty and raw.  But, the other day I heard someone saying sometimes they just want to invoke pretty print in their JSON responses without having to use an external tool and set up a whole environment.

As you might already know, `json_encode` takes in encoding options - of which one of them is `JSON_PRETTY_PRINT` which basically handles pretty printing through line breaks and spaces.  Since I'm currently working in a Laravel project, I thought - what would be a good way of doing this? Is it really easy - a drop in solution?

My first attempt was to find all instances of a response I made where I called the json method (like `response()->json()`) and insert the options into that call.  That's not very scalable though - and it's easy to miss one.  So, I came up with a middleware.

**`somefile.php`**
```php
<?php
/**
 * Allow pretty print with the query parameter ?pretty=true
 */
declare(strict_types=1);

namespace App\Http\Middleware;

use Illuminate\Http\JsonResponse;

/**
 * Class PrettyPrintMiddleware
 * @package App\Http\Middleware
 */
class PrettyPrintMiddleware
{
  /**
   * @var string the query parameter
   */
  const QUERY_PARAMETER = 'pretty';

  /**
   * Apply pretty print if designated
   * 
   * @param $request
   * @param \Closure $next
   * @return mixed
   */
  public function handle($request, \Closure $next)
  {
    $response = $next($request);
        
    if ($response instanceof JsonResponse) {
      if ($request->query(self::QUERY_PARAMETER) == 'true') {
        $response->setEncodingOptions(JSON_PRETTY_PRINT);
      }
    }
        
    return $response;
  }
}
```

Once you assign this middleware to your stack, you can send your query parameter of `pretty=true` (which could be changed for your own setup using the constant value) - and the middleware will insert the encoding option after your request is on the way out.  This will handle all of your requests without you having to do anything else.

Now your regular JSON like this:
```
[{"id":123,"name":"first item"},{"id":124,"name":"first item"}]
```

Will end up looking like this:
```
[
    {
        "id": 123,
        "name": "first item"
    },
    {
        "id": 123,
        "name": "first item"
    }
]
```

The only thing to keep in mind is that this is a pretty big of a hammer approach - if you're using other JSON encoding options, you should add this encoding to the stack instead of just setting it.  If you wanted to package this to be deployed, you might want to make the query parameter a config option.  Finally, you might want to allow for more truthy values like `1` and `TRUE` and `on`.