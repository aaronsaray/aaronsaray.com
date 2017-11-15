---
layout: post
title: For Performance, Skip Generating Hashes in Laravel Factories
tags:
- PHP
- Laravel
---
This isn't a one-size-fits-all suggestion, but it's a start to help you think about how you actually interact with factories in Laravel.  They are used for test data, and are ran very often, multiple times in a row.  You don't need as much random information as you need.  (In fact, a lot of times I see people overusing Faker even.)

I've generated a User Model factory.  It ends up looking something like this:

```php?start_inline=true
$factory->define(App\Models\User::class, function (Faker\Generator $faker) {
  return [
    'first_name' => $faker->firstName,
    'last_name' => $faker->lastName,
    'email' => $faker->unique()->safeEmail,
    'password' => Hash::make('secret')
  ];
});
```

This looks all fine and dandy until you realize that if you generate 100 models, you have to run the expensive hashing mechanism at least 100 times.  This adds up in your unit tests (remember, the longer it takes for unit tests to run, the less likely people will run them more often).

So, instead, pre-calculate the hash and just use a string. It's only test data! (In this case, I like to comment out my actual code I used to create the hash as a mechanism to explain what is going on here.)

```php?start_inline=true
$factory->define(App\Models\User::class, function (Faker\Generator $faker) {
  return [
    'first_name' => $faker->firstName,
    'last_name' => $faker->lastName,
    'email' => $faker->unique()->safeEmail,
    // 'password' generated with Hash::make('secret')
    'password' => '$2y$10$oPCcCpaPQ69KQ1fdrAIL0eptYCcG/s/NmQZizJfVdB.QOXUn5mGE6'
  ];
});
```

Now you can skip the expensive hashing generation.