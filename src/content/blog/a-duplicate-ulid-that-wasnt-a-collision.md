---
title: "A duplicate ULID that wasn't a collision"
date: "2026-05-05"
tags:
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-05-05-a-duplicate-ulid-that-wasnt-a-collision"
  canonical: true
---

Imagine I have this trait that gives any model a ULID-based `public_id` on create:

<!--more-->

```php
trait HasPublicId
{
  protected static function bootHasPublicId(): void
  {
    self::creating(function (self $model): void {
      if (empty($model->public_id)) {
        $model->public_id = (string) Str::ulid();
      }
    });
  }
}
```

Eloquent picks up the `bootHasPublicId` method automatically when the trait is added to a model, which is what registers the `creating` hook.

The `empty()` check lets us pass in a specific `public_id` from tests or an admin tool when we need a known value.

One day the app threw a database error about a duplicate `public_id`.
ULID collisions seem impossible, so I shrugged it off as a one in a billion issue and moved on.

The next day it happened again.
Different model, different customer.
Ok, so something else is up.

I tracked it down to a "duplicate this record" action in the code somewhere:

```php
public function duplicate(Order $order): RedirectResponse
{
  $copy = $order->replicate();
  $copy->save();

  return redirect()->route('orders.edit', $copy);
}
```

`replicate()` copies every attribute except the primary key, timestamps, and any columns you explicitly exclude.
`public_id` comes along for the ride, the `creating` hook sees it's not empty, and the clone saves with the original's ULID, causing the collision.

The fix is a `replicating` hook:

```php
self::replicating(function (self $model): void {
  $model->public_id = (string) Str::ulid();
});
```

No `empty()` check here on purpose.
The whole point of replicating is to break the link with the source, so we always overwrite it.
No more collisions!
