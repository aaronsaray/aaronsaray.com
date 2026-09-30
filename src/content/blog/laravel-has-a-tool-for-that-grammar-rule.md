---
title: "Laravel has a tool for that grammar rule"
date: "2026-07-14"
tags:
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-07-14-laravel-has-a-tool-for-that-grammar-rule"
  canonical: true
---

Our apps do a lot of writing.
Emails, notifications, invoices, dashboards.
All of that copy has to follow the same style guide as anything else we publish.

Say your style guide follows AP style, which spells out the numbers zero through nine and uses digits for 10 and up.
It is a simple enough rule that most of us just write our own tedious conditional for it, never thinking to check if the framework already handles it.

<!--more-->

Good news: Laravel has a [built-in helper](https://laravel.com/docs/13.x/helpers#method-number-spell) for this, and it has for [a while](https://github.com/laravel/framework/pull/48845).

Say you are generating a low-stock email and want the line to read naturally:

> Only three left in stock.

But once the count climbs, you want:

> Only 12 left in stock.

`Number::spell()` handles both cases with its `after` parameter, which spells out numbers up to a threshold and uses digits after it:

```php
use Illuminate\Support\Number;

Number::spell(9, after: 9); // nine

Number::spell(10, after: 9); // 10
```

That is the AP rule, in one line.
Back in the low-stock email, that output becomes something like this:

```php
'Only ' . Number::spell($count, after: 9) . ' left in stock.';

// $count of 3:  "Only three left in stock."
// $count of 12: "Only 12 left in stock."
```

Bonus: if your style follows the Chicago Manual instead, which spells out everything through one hundred, you do not need different code.
Just move the threshold:

```php
Number::spell(42, after: 100);
```
