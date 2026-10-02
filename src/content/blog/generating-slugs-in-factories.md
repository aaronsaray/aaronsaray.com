---
title: "Generating slugs in factories"
date: "2024-07-01"
tags:
  - laravel
  - testing
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2024-07-01-generating-slugs-in-factories"
  canonical: true
---

Normally, I would generate a slug for an Eloquent model with an observer or an event.  The `creating` event can verify if the `slug` field is filled, and if not, use the `Str` helper to add it to the current creation payload. Pretty cool.

<!--more-->

But, sometimes you can't do it like this. Perhaps it's a legacy project, events are turned off in your tests, or any number of reasons. So, when using Eloquent factories, you might find yourself doing something like this:

```php
App\Models\Article::factory()->create([
  'title' => 'The Baron of the Hoops',
  'slug' => Str::slug('The Baron of the Hoops'),
  'author' => 'R J J Kientol',
]);
```

I don't know about you, but I really don't want to do that.  Seems repetitive - especially since I know I want the slug to be generated directly from the title field.

Laravel provides a solution, though. When you pass a closure to a field definition in the factory declaration, you get access to the other attributes that are being used to create the model.  So, let's update our factory definition to this:

```php
public function definition(): array
{
  return [
    'title' => $this->faker->sentence(),
    'slug' => fn(array $attributes) => Str::slug($attributes['title']),
    'author' => $this->faker->name(),
  ];
}
```

Now, our slug is generated automatically from our title. (If we want a different one, we can still pass it in using the `create()` method.)

So, now, we can do this:

```php
App\Models\Article::factory()->create([
  'title' => 'The Baron of the Hoops',
  'author' => 'R J J Kientol',
]);
```

Nice!
