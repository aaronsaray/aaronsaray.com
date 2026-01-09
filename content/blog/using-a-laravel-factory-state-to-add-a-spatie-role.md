---
title: "Using a Laravel Factory State to Add a Spatie Role"
date: 2026-01-09
tag:
- laravel
- testing
params:
  context:
    - Laravel 12
---
I love the [Spatie Laravel Permissions](https://spatie.be/docs/laravel-permission/v6/introduction) package. I use it in almost all of my Laravel projects.

When testing, I'll need to set up users with various different roles and permissions. Usually, I'm using an Eloquent Factory in order to accomplish this.

But it's a little different when you're dealing with relationships. Let's find out how.

<!--more-->

So, one nice thing about Laravel Eloquent Factories is the ability to call a state. This is basically a call to a method that builds on predetermined values that fit a specific business requirement or state.  This is usually done by calling the `$this->state()` method inside of the state call.  For example:

```php
$user = User::factory()->likesDogs()->create();
```

And the method call in the factory may look like this:

```php
public function likesDogs(): static
{
  return $this->state([
    'like_dogs' => true,
  ]);
}
```

But, when using this methodology, we're not limited to only calls to the `state()` method. We also have lifecycle hooks in the factories that we can call.

Ok - so let's think about this: I want to create a user with the role of Admin. I'm using the Spatie permissions package, so users can have many roles.  How would I do this?

Well, you could retrieve roles and assign them after the user has been created. But, let's make it easier.  Imagine calling this code instead:

```php
$user = User::factory()->admin()->likesDogs()->create();
```

Now, we'll have a user created who likes dogs, but also is an admin. They have an admin role assigned to them.  How? Let's look at the new method:

```php
public function admin(): static
{
  return $this->afterCreating(fn(User $user) => $user->assignRole('admin'));
}
```

How, we've registered an `afterCreating` hook like we'd have registered state. After the user is created, a role is assigned using the Spatie functionality.