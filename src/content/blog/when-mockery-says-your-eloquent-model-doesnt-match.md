---
title: "When Mockery says your Eloquent model doesn't match"
date: "2026-08-13"
tags:
  - mockery
  - testing
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-08-13-when-mockery-says-your-eloquent-model-doesnt-match"
  canonical: true
---

In tests, it's common to have a service that takes an Eloquent model as an argument, and therefore you want to mock that service to confirm it was called with the right model instance.

<!--more-->

The naive approach is to pass the model straight to Mockery with `->with()`:

```php
$order = Order::factory()->create();

$invoiceMock = $this->mock(InvoiceGenerator::class);
$invoiceMock->shouldReceive('generate')
    ->once()
    ->with($order)
    ->andReturn($fakeInvoice);
```

This tends to fail in most cases.
Mockery's `->with()` does a strict equality comparison on objects, which means it only matches if the system under test receives the exact same PHP instance you passed in.
If your service or path hydrates or retrieves the model, you will have a different instance representing the same database row.
The test fails even though the behavior is correct.

In another tip, I showed how a validation assertion that's too loose can pass for the wrong reason.
This is the opposite problem, a matcher so strict it fails for the wrong reason.

It's tempting to just not test this or to reach for testing specific values on the instance.
But there's a cleaner, more elegant, and Eloquent way to do it:

```php
$order = Order::factory()->create();

$invoiceMock = $this->mock(InvoiceGenerator::class);
$invoiceMock->shouldReceive('generate')
    ->once()
    ->with(Mockery::on(fn ($arg) => $order->is($arg)))
    ->andReturn($fakeInvoice);
```

`Mockery::on` accepts a closure and matches the argument when the closure returns `true`.
The closure delegates the actual comparison to Eloquent's `is()` method, which uses Eloquent's internal matching system.
Different instances still succeed, as long as they reference the same underlying row or model.

This isn't always the solution, but for 95% of the cases, I would say checking with `is()` gives you the proper coverage you need compared to checking individual attributes.
