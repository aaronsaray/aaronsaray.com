---
title: "Breaking my own rule and reaching for a single-use method"
date: "2026-07-20"
tags:
  - laravel
  - programming
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-07-20-breaking-my-own-rule-and-reaching-for-a-single-use-method"
  canonical: true
---

I've taken the stance before against pulling code into a method just to make a longer one look shorter.
So you'd think my `AppServiceProvider` would be a straight line of code. It isn't.

<!--more-->

```php
public function boot(): void
{
    $this->bootBladeDirectives();
    $this->bootModelStrictness();
    $this->bootMacros();
    $this->bootViewComposers();
}

public function register(): void
{
    $this->registerStripe();
    $this->registerLocalServiceStubs();
}
```

Every one of those is private and called exactly once. By my own rule, this should upset me, but it doesn't.

The difference is that these are actually independent.
`bootBladeDirectives()` doesn't need `bootMacros()` to have run first.
I could reorder the calls and nothing would break.
Each is its own complete job that happens to live next to its siblings.

Each of these methods has everything a small class would, minus the extra file to open and wire up.
