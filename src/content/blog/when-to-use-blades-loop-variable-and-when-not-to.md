---
title: "When to use Blade's loop variable, and when not to"
date: "2026-10-01"
tags:
  - laravel
  - css
context:
  - Laravel 13
  - Tailwind 4
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-10-01-when-to-use-blades-loop-variable-and-when-not-to"
  canonical: true
---

Laravel is always giving us little helpers.
One of which is Blade's `@foreach` that gives you a `$loop` variable.
Inside the loop you get things like `$loop->index` and `$loop->iteration`, plus the two I want to talk about today: `$loop->first` and `$loop->last`.

`first` and `last` are boolean values that tell you if this is the first iteration or the last iteration of the loop.
Pretty self-explanatory.

But far too many times I see people abusing these for style - when they should be for flow control.

<!--more-->

Check out this code.
It doesn't put a border on the top of the first row as a design choice.

```blade
@foreach($invoices as $invoice)
    <div @class(['py-4', 'border-t' => ! $loop->first])>
        {{ $invoice->number }}
    </div>
@endforeach
```

But we already have tools in our toolbox for this.
If you're using plain CSS, you have `:first-child`.
If you're using Tailwind, you already have utility classes for this - and the inverse too!

```blade
@foreach($invoices as $invoice)
    <div class="py-4 not-first:border-t">
        {{ $invoice->number }}
    </div>
@endforeach
```

No PHP conditions, simpler code, and using CSS how it was meant to be used.

So, when do I use the `$loop`?

When a decision needs to alter the markup, content or template.

For example, on our tips archive page, a book promo shows up after the first month's group of tips.

```blade
@foreach($tipsByYearAndMonth as $yearMonth => $tips)
    <!-- the month's tips -->

    @if($loop->first)
        <!-- book promo -->
    @endif
@endforeach
```

We certainly don't want to repeat the promo at the end of each month's tips and hide it with CSS.
Instead, we only render it when it's the first iteration of the loop.

My rule is simple: style is CSS, logic is PHP.
