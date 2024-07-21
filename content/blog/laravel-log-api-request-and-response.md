---
title: "Laravel Log Incoming API Request and Response"
date: 2024-07-21T00:28:38-05:00
tag:
- laravel
---
There are packages out there to add logging to the HTTP client in Laravel for outgoing requests freely available. Those are great, but what about if you're providing an API - and you need to log incoming requests and responses? There's not a single place to do that - or is there? Let's look at a middleware to log our incoming requests and responses.

<!--more-->

So, it's simple. First, we want to make a middleware. Then, we'll apply that middleware to all of our routes that we want logged. Perhaps you have a very busy API and you can't handle that much logging - so you might either enable it periodically with Laravel Pennant or only add it to specific end points. Or, you can simply add it to your `api` middleware group and it'll apply to everything.

Great! Let's check it out.

{{< filename-header "app/Http/Middleware/LogRequestAndResponse.php" >}}
```php
<?php declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class LogRequestAndResponse
{
  /**
   * Do nothing during the lifecycle
   */
  public function handle(Request $request, Closure $next)
  {
    return $next($request);
  }

  /**
   * After finished, log the item
   *
   * @param Response|JsonResponse $response
   */
  public function terminate(Request $request, $response): void
  {
    $message = sprintf(
      '%s: %s', 
      $request->method(), 
      $request->route()->getName() ?? 'no route name'
    );

    $context = [
      'request' => [
        'full_url' => $request->fullUrl(),
        'method' => $request->method(),
        'body' => $this->redactedRequestBody($request),
        'server' => $request->server(),
        'user_id' => $request->user()->id ?? 0,
      ],
      'response' => [
        'status_code' => $response->status(),
        'body' => $response->getContent(),
        'headers' => $response->headers->all(),
      ],
    ];

    Log::channel('api-logs')->debug($message, $context);
  }

  /**
   * Removes any sensitive information and replaces with [REDACTED]
   */
  protected function redactedRequestBody(Request $request): string
  {
    $replacements = array_filter($request->only(['password', 'current_password']));

    if (empty($replacements)) {
        return $request->getContent();
    }

    return str_replace(Arr::flatten($replacements), '[REDACTED]', $request->getContent());
  }
}
```

Let's walk through it.  First of all, we're using a terminable middleware. This means that it runs the `terminate()` method
after the request and response have finished. That's why you see in our `handle()` method we're doing basically nothing. We
only want to do stuff when the request is done.

Then, we gather together the route name and method and use that as our logger message. The rest of the information is
put into the context object. We know that not every end point will have an authenticated user, so that's why we chose to
null coalesce that value to zero.

Finally, this is all sent to a special channel in our logger as a debug message.

One last thing - note the `redactedRequestBody` method. There are probably better ways to do this, but I knew that sometimes
we would have requests with fields called `password` or the like in it. Here, if they exist, they're redacted. This helps
for logging requests to our authentication endpoints. We don't want those credentials displayed.
