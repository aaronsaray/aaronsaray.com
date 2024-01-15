---
title: "Logging for Laravel Http Client"
date: 2024-01-15T12:01:17-06:00
tag:
- laravel
---
I'm a huge fan of using the [Laravel HTTP Client](https://laravel.com/docs/10.x/http-client) for requests to third-party APIs. It's clean and easy, nice for unit testing, and exposes methods for the most common functionality we need when consuming APIs. But one thing has bothered me - how do I log both my request and the API's response, no matter what, with no special calls. Well, we're in luck - using some global middleware on the client, we can do just that.

<!--more-->

## The Problem

I want to log both my request details and the API response for every call through my HTTP Client.  The problem is that I want to use my existing HTTP client calls without having to modify them.  I just want to 'introduce' logging - I don't want to have to go modify every place I've used my client.

## The Solution

The solution is the `globalMiddleware()` method on the `Http` facade in Laravel.  This allows us to register a global middleware to the underlying instance(s) of Guzzle that the client is wrapping.

Let's take a look at some code.

{{< filename-header "AppServiceProvider.php" >}}
```php
<?php declare(strict_types=1);

namespace App\Providers;

use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

class AppServiceProvider extends ServiceProvider
{
  public function boot(): void
  {
    $this->bootFileMakerLogging();
  }

  protected function bootFileMakerLogging(): void
  {
    Http::globalMiddleware(static function (callable $handler): callable {
      return static function (RequestInterface $request, array $options) use ($handler) {
        $uuid = Str::uuid();

        Log::channel('api-log')->debug("API Request {$uuid}", [
          'url' => (string) $request->getUri(),
          'method' => $request->getMethod(),
          'body' => (string) $request->getBody(),
          'hasAuthorizationHeader' => $request->hasHeader('Authorization'),
        ]);

        /** @var PromiseInterface $responsePromise */
        $responsePromise = $handler($request, $options);
        return $responsePromise->then(function (ResponseInterface $response) use ($uuid) {
          Log::channel('api-log')->debug("API Response {$uuid}", [
            'status' => $response->getStatusCode(),
            'body' => (string) $response->getBody(),
            'headers' => $response->getHeaders(),
          ]);
          return $response;
        });
      };
    });
  }
}
```

I've just decided to use my App Service Provider to boot in this global middleware.  The middleware is very similar to what you might be used to with Http controller middleware. The method call to `globalMiddleware()` requires a callable that returns a callable. It receives the `$handler` which is basically the stack of things being ran through the Http client request.

This method returns a static callable that is the 'middleware' - so that's what we build next.  Inside of this I generate a UUID that I can use for both the request logging and the response logging. This helps tie them together. They may happen at different times. (You may make a request that takes 5 seconds, and 1 second later, create another request that takes 1 second. You don't want these log lines to be conflated - so the UUID helps.)

I'm logging things to the configuration called `api-log` that I've configured in my `config/logging.php` file.

Next, we have to get the promise from this request and use a call to `then()` which is ran both in successful and failure modes.  Therefore when the promise 'resolves', we'll do the rest of the logging of the response.

And there you have it - this is how we can log on both sides of the request/response of an Http client call.

## End Notes

Remember, if you do this, you should configure your logger called `api-log` to rotate. This could become very large. In fact, you may want to refactor this out into its own class as it grows bigger. I think there would be room here to do some redactions as well as remove binary blobs from this.

Also, there are other Laravel packages that add on macros so you can specify when you want to log - like [this one](https://github.com/bilfeldt/laravel-http-client-logger) - so you might want to use that as well.