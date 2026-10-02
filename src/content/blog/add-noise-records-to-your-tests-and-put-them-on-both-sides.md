---
title: "Add noise records to your tests, and put them on both sides"
date: "2026-05-28"
tags:
  - testing
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-05-28-add-noise-records-to-your-tests-and-put-them-on-both-sides"
  canonical: true
---

Joel mentioned this convention in [Why would I leave an unused variable in my test?](https://masteringlaravel.io/daily/2025-07-09-why-would-i-leave-an-unused-variable-in-my-test), where he leaves "noise" records assigned to unused variables for readability.
If you were wondering why bother with the noise records at all, here is the demonstration.

<!--more-->

Here is the kind of test most people write when starting out:

```php
$client = Client::factory()->create();
$order = Order::factory()->for($client)->create();

$found = (new OrderLookup)->getForClient($client);

$this->assertTrue($order->is($found));
```

One order, one client, the service returns it, the test passes.

The problem is that both of these service implementations turn the test green:

```php
// Correct, scoped to the client.
public function getForClient(Client $client): Order
{
  return Order::where('client_id', $client->id)->first();
}

// Broken, returns the first order in the table regardless of client.
public function getForClient(Client $client): Order
{
  return Order::first();
}
```

With one row in the table, these are indistinguishable.
The test can't prove the code does what the method name claims.

Now we add noise from other clients to strengthen the test:

```php
$client = Client::factory()->create();

Order::factory()->for(Client::factory()->create())->create();
$order = Order::factory()->for($client)->create();
Order::factory()->for(Client::factory()->create())->create();

$found = (new OrderLookup)->getForClient($client);

$this->assertTrue($order->is($found));
```

Now `Order::first()` returns a noise record belonging to a different client, `is()` returns false, and the broken implementation fails.
The bug is caught.

Notice the target is in the middle, with noise on both sides.
That's deliberate.

Noise only after the target leaves it as the lowest id, so `Order::first()` still picks it by accident.
Noise only before and `Order::latest()->first()` does the same thing from the other end.
Putting the target in the middle is what proves the lookup is actually scoped to the client, not just returning the first or last row.
