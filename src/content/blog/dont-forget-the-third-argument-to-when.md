---
title: "Don't forget the third argument to when"
date: "2026-05-26"
tags:
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-05-26-dont-forget-the-third-argument-to-when"
  canonical: true
---

What is the opposite of `when()`?

`unless()` is the obvious answer, and it is correct.
But there is also a quieter answer.
`when()` itself accepts a third callback that runs when the condition is falsy.

<!--more-->

Most uses of `when()` look like this:

```php
$query->when(
    $this->customerId,
    fn (Builder $query, int $customerId) => $query->where('customer_id', $customerId),
);
```

That covers the simple case.
But what if the falsy branch also needs to do work?

Take an optional customer filter.
If one was selected, scope to that customer.
If not, scope to the customers the current user is allowed to see, not every row in the table.

That's exactly what the third argument to `when()` is for, a second callback that runs when the condition is falsy:

```php
$query->when(
    $this->customerId,
    fn (Builder $query, int $customerId) => $query->where('customer_id', $customerId),
    fn (Builder $query) => $query->whereIn('customer_id', Auth::user()->customers()->pluck('id')),
);
```

The same goes for `unless()`, which has the same three-argument shape with the conditions flipped.
If you are reaching for `when()` or `unless()` and finding yourself adding an outer `if/else` to handle the other branch, the third argument is probably what you want.
