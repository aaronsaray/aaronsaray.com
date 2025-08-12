---
title: "Rendering Json Exceptions in Laravel Before Version 11"
date: 2025-08-12T10:13:34-06:00
tag:
- laravel
params:
  context:
    - Laravel 11
    - Laravel 10
    - Laravel 9
    - Laravel 8
---
In Laravel 11+, it's quite easy to tell the exception handler to render all (or a select portion of them) as JSON regardless of the request/response type. But what about earlier versions?

<!--more-->

In a perfect world, we'd all be on the most current Laravel. Yay! This entry is not required. However, what if you're not? We can still do this pretty easily.

### The Problem

First of all, why do we even care?

Well, if you're working on an API, you may require that consumers submit their request via JSON - and respond with an appropriate accept header. Perhaps you even reject those responses. In Laravel, if the request comes in with JSON,
it will automatically go out as such. But, what if you want predictable responses in JSON, but need to handle non-JSON incoming requests? Yeah - that is a small edge-case, but that's what we need to do. 

In this example, we're going to assume that all `/api/v1` routes require JSON responses, even with exceptions.

### Laravel 11+ way

This scenario is covered [in the manual here](https://laravel.com/docs/11.x/errors#rendering-exceptions-as-json) but let's recap.

```php
->withExceptions(function (Exceptions $exceptions) {
  $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
    if ($request->routeIs('api.v1.*')) {
      return true;
    }
 
    return $request->expectsJson();
  });
})
```

This goes in the `bootstrap.php` file and you're good to go. If the request is an API V1 route, always return true - which tells it to process JSON. Otherwise, fall back to Laravel's automatic determination.

### Laravel 10- way

What about older versions of Laravel?

These have the exception handler as a class.  Let's take a look at the `app/Exceptions/Handler.php` file.

```php
protected function shouldReturnJson($request, Throwable $e): bool
{
  if ($request->routeIs('api.v1.*')) {
    return true;
  }

  return parent::shouldReturnJson($request, $e);
}
```

Here, the exception handler is looking to call the `shouldReturnJson()` method. When we override it, we can check the current route. If it's one of the API V1, process it as JSON. Otherwise, again, fall back to Laravel's automatic determination.