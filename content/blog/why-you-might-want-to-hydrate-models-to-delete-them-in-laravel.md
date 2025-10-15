---
title: "Why You Might Want to Hydrate Models to Delete Them in Laravel"
date: 2025-10-15
tag:
- laravel
params:
  context:
    - Laravel 12
---
There are many ways to handle cascading functionality in Laravel. You can do this with observers, events, manually dispatched jobs - even in MySQL with cascading deletes.

I prefer to keep my cascading logic in the application code by using Eloquent Model Events. This is super easy when it's just a single level of model. But what about relationships? 

<!--more-->

So let's talk about a car with parking reservations. When our `Car` model gets deleted, we want to delete all of the parking reservations as well.

I'm going to register an event right in the `booted` method of the Eloquent model.

```php
protected static function booted(): void
{
  static::deleting(fn (self $self) => $self->reservations->each->delete());
}
```

Now, whenever a `Car` is deleted, all of its reservations (through the `->reservations()` HasMany relationship) are deleted.

But wait a second - this is doing some sort of loop on the loaded relationship! If it was doing it completely in the database, the command would look like `$self->reservations()->delete()` - but this is retrieving all and looping over them. 

Why?

Because I have introduced a cascading pattern into the project - so my assumption is that any time I define a cascading functionality it is now in effect. If we didn't retrieve each of the `Reservation` model, then any of those `deleting` events on those reservations will never be called. Maybe there is more cleanup?

This is not a great idea for every solution (imagine a situation where there are 1000s of records) - but in general, when there are a limited amount - I find the 'cost' of retrieving and hydrating these models to be a lot less than the built in functionality / ability to never forget to consider the whole hierarchy. I just have to focus on one model at a time.