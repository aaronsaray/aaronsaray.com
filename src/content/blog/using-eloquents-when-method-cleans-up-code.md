---
title: "Using Eloquent's when method cleans up code"
date: "2025-03-25"
tags:
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2025-03-25-using-eloquents-when-method-cleans-up-code"
  canonical: true
---

Laravel gives a lot of syntactical sugar helpers. This allows you to write your Laravel code in a few different flavors or dialects. Some programmers prefer using fluent interfaces, others composition, and others pure functional statements.

As a seasoned and salty programmer, I tend to stick with what I know. It can be easy to overlook the helpers that Laravel provides. But, with Eloquent, the `when` function is way more useful than a simple helper.  The true eloquence comes from its handling of the results of the first condition check.

<!--more-->

Imagine this contrived code:

```php
$discountAmount = $user->complicatedCalculation();

if ($discountAmount) {
  $products = Product::where('discount', '<=', $discountAmount)->get();
} else {
  $products = Product::all();  
}
```

A couple things to note: first, depending on if you've built a query or not, we need to retrieve the eloquent results with a different method call.  Second, we now have a variable in our scope that we don't necessarily want or need.

How can `when` help us?  See the new version of the code:

```php
$products = Product::when(
  $user->complicatedCalculation(), 
  function ($query, $amount) {
    $query->where('discount', '<=', $amount);
  }
)->get();
```

At first glance, I didn't like this. It feels more complicated and yet more loose. It has a different variable name, and I find it harder to follow. Then, I realized the benefit, and now I love it:

Since I won't need the discount amount again, I don't care to have a variable in my current scope. `when` will pass the result of the conditional check as the second parameter of the closure. This means I still have the value available to me, but only in the scope of my closure. Then, I apply my condition.

Finally, notice that the result is now retrieved the same way.

I didn't really like this at first, but now I've come around to it. I like how it cleans up the code.
