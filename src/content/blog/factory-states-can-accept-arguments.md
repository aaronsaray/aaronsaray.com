---
title: "Factory states can accept arguments"
date: "2026-08-20"
tags:
  - laravel
  - testing
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-08-20-factory-states-can-accept-arguments"
  canonical: true
---

Most Eloquent factory states I've created are pretty simple like `->published()` or `->cancelled()`.
They flip a flag or override a field to a fixed value making the call site of the factory easier to understand and requiring less ceremony.
Awesome.

But, a state can also accept arguments, and that opens up some useful patterns like deriving values from another model passed in by the caller.

<!--more-->

Imagine we had a scheduled event factory, and we want to use it to build chains of events, one hour after another.
We might make a state like this:

```php
public function fromEventOneHourLater(ScheduledEvent $source): self
{
  return $this->state([
    'start_at' => $source->start_at->addHour(),
    'timezone' => $source->timezone,
    'organizer_email' => $source->organizer_email,
  ]);
}
```

The state name says exactly what it does to the data.
The argument is a model because the state needs to read three fields off it, one that gets transformed (`start_at` plus an hour) and two that get copied verbatim.

We can now build our chain in the test:

```php
$first = ScheduledEvent::factory()->create();
$second = ScheduledEvent::factory()->fromEventOneHourLater($first)->create();
$third = ScheduledEvent::factory()->fromEventOneHourLater($second)->create();
```

Be careful not to take this too far, though.
You should consider this as the facade PHP pattern for reducing your boilerplate test code, not for duplicating business logic.
