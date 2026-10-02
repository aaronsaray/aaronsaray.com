---
title: "A cleaner fix for the duplicate ULID problem"
date: "2026-05-07"
tags:
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-05-07-a-cleaner-fix-for-the-duplicate-ulid-problem"
  canonical: true
---

In a previous tip, I walked through a duplicate `public_id` bug caused by `Eloquent::replicate()` carrying the ULID over to the clone.

The fix I landed on was a `replicating` hook that overwrites `public_id` on the new instance.

<!--more-->

That works, but while digging in the framework source I noticed `Eloquent\Model::replicate()` already spreads `...$this->uniqueIds()` into its list of excluded attributes.

So instead of using a `replicating` hook, we can just tell Eloquent that `public_id` is a unique id and shouldn't come along for the ride:

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

  public function uniqueIds(): array
  {
    return ['public_id'];
  }
}
```

Now `replicate()` strips `public_id` from the new instance, the `creating` hook sees an empty value on save, and a fresh ULID gets generated.

One hook, no asymmetry to explain.
