---
title: "Using Laravel Factory States to Add More Configuration After Creation"
date: 2024-03-27T14:09:39-05:00
tag:
- laravel
---
I love using Laravel [Database Factories](https://laravel.com/docs/11.x/eloquent-factories) for setting up test data. But, what about when we want to do more complex domain object creation besides just data values or relationships created outside of the factory? Let's try using the `afterCreated()` hook and states.

<!--more-->

To give this more clarity, let's develop a scenario. We want to create a User object with our factory. We're using the [Spatie Laravel Permissions](https://spatie.be/docs/laravel-permission/v6/introduction) package, and we'd like to make some users with the role staff and some with the admin role.

Let's take a look at our User factory and see how we might accomplish this using database factories states.

{{< filename-header "database/factories/UserFactory.php" >}}
```php
<?php declare(strict_types=1);

namespace Database\Factories;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
  public function definition(): array
  {
    return [
      'email' => $this->faker->unique()->email(),
      'first_name' => $this->faker->firstName(),
      'last_name' => $this->faker->lastName(),
      'activated' => true,
      // snip
    ];
  }

  public function notActivated(): self
  {
    return $this->state(fn() => ['activated' => false]);
  }

  public function staff(): self
  {
    return $this->afterCreating(fn(User $user) => $user->assignRole(Role::STAFF));
  }

  public function admin(): self
  {
    return $this->afterCreating(fn(User $user) => $user->assignRole(Role::ADMIN));
  }
}
```

So, the beginning part just defines our user fields as we'd normally do. I snipped out some to not be distracting. Note that we have the `activated` field turned to true normally.

Now, I demonstrate how you might be familiar with states. The `notActivated()` will set a state value that disables activated. So, if you used `User::factory()->notActivated()->create()` you'd have a user created with default parameters, just not activated.

So, how do we add a role? Well there's no easy way to do it in the initialization or definition. So, we can use callbacks - and we can access those callbacks in states.

Let's imagine we want to create a staff user named Aaron who is activated. `User::factory()->admin()->create(['first_name' => 'Aaron'])`. Perfect! Now, it calls the `admin()` state which - instead of setting a state, still fluently returns, but this time registering a callback into `afterCreating()`. Now, after the user is created, as a normal user, activated, named Aaron, a final handler executes and adds the `Role::ADMIN` to them.