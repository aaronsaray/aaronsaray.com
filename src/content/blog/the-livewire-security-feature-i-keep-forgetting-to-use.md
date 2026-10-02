---
title: "The Livewire security feature I keep forgetting to use"
date: "2026-07-21"
tags:
  - livewire
  - laravel
  - security
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-07-21-the-livewire-security-feature-i-keep-forgetting-to-use"
  canonical: true
---

Here's a Livewire checkout component that looks completely fine:

<!--more-->

```php
public int $discountPercent;

public function mount(User $user)
{
  $this->discountPercent = $user->loyaltyTier()->discount();
}

public function checkout()
{
  $price = $this->getBasePrice() * (1 - $this->discountPercent / 100);

  // charge $price...
}
```

There's no input bound to `$discountPercent`. I never wrote `wire:model="discountPercent"`, so it feels safe.

But it isn't.

Livewire sends every public property to the browser and trusts whatever comes back. This means the user can change it.
They open DevTools, drop in `<input wire:model="discountPercent">`, set it to 100, and click checkout.
Now they've paid nothing using the discount they provided instead of the one I calculated on the server.

Livewire is clear about this in their docs: treat every public property like request input, because that's exactly what it is.

Here's where my brain fails me.
My instinct for "the user shouldn't touch this" is `protected` or `private`, but that doesn't work here.
Livewire only persists `public` properties between requests, so a value I set in `mount()` has to be public to survive the trip back to the server.

Keep reading those same Livewire docs and the fix is right there a little further down: the `#[Locked]` attribute.

```php
use Livewire\Attributes\Locked;

#[Locked]
public int $discountPercent;
```

The property stays public so Livewire still persists it, but now any tampering from the frontend throws an exception instead of being trusted.

This matters most for plain values like a percentage, a price, or a flag.
Store a whole model and Livewire locks its ID for you, but a raw value like this is on you to protect.

The rule I want to remember: if a public property is meant to be edited by the user, leave it alone.
If it isn't, use `#[Locked]`.
