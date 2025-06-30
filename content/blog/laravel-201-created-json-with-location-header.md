---
title: "Laravel 201 Created JSON With Location Header"
date: 2025-06-30T16:49:56-05:00
draft: true # don't forget to change date!!
tag:
- laravel
params:
  context:
    - Laravel 11
    - Laravel 12
---
Each API seems to be different. However, there are some best practices that we should all try to follow.

One of those that I really like is the 201 Created HTTP response. If the object is created immediately, you may even return the full object contents.

In some cases, we don't have the data or don't want to return the full payload. We can return null with a location header. Here's how to do that with Laravel.

<!--more-->

In this example, we're going to assume that we've created a new `ComplexObject` using a JSON post. We don't want to return all of the fields or create a new resource, so we want to return a null response with a location header instead.

Let's see how:

```php
return response()
  ->json(data: null, status: 201)
  ->withHeaders([
    'location' => route('api.complex-objects.show', ['complex_object' => $complexObject]),
  ]);
```

Here, we get the response object, force it to a JSON response with `null` for data, and a 201 status. Then, add the `location` header on using a named route and referring to our complex object.  Pretty simple.