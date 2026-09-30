---
title: "You don't always need to put Pennant in the database"
date: "2026-09-01"
tags:
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-09-01-you-dont-always-need-to-put-pennant-in-the-database"
  canonical: true
---

Pennant defaults to the database driver, and most tutorials follow that lead.
That's fine for long-lived flags, but it adds a row and a query for every feature resolution.

<!--more-->

But what about those simple date-based toggles, or features that are deployed darkly but will be enabled by a config change later?

If that's all you have, choose the array storage configuration instead.

Then, you can still leverage the power of Pennant without the unnecessary weight of a database lookup.
For example:

```php
use Laravel\Pennant\Feature;

// Continuous deploy gate - flipped via config when we're ready to release
Feature::define('new-checkout', fn () => config('features.new-checkout'));

// Date-based toggle
Feature::define('holiday-banner', fn () => now()->between('2026-12-20', '2026-12-31'));
```

This isn't a knock on the database driver.
For flags tied to user segments, or features that need to be altered through a UI, the database can be the right call.
But for most other cases, I'd suggest going with the lighter weight array configuration.
