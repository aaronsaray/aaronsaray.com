---
title: "Why Do I Use Plain Text Password for My Initial User Record?"
date: 2025-06-30T14:57:00-05:00
draft: true # don't forget to change date!!
tag:
- laravel
- programming
- security
---
When I create a project, I will have at least one user seeded into the database. This usually is an admin user as well. 

So, why would I create this user with a plain text password initially?! That's crazy right?

Let me explain why - and then you can see if you agree. 

<!--more-->

Best practices that I follow:

* Hash passwords securely
* Do not seed data unless you have to
* Required data for your application should be seeded in a migration

So, why would you see something like this in my last line of my first migration?

```php
User::factory()->programmer()->create([
  'name' => 'Aaron Saray',
  'email' => 'my@email.com',
  'password' => 'change-this-asap',
]);
```

It actually fits perfectly into my 3 best practices. 

**Hash passwords** Exactly. So, in order to add a hashed password, I would need to do something like `Hash::make('change-this-asap')` in order for it to be hashed password.  As far as I'm aware, there is no value in my hash protocol that can generate a hash that matches `change-this-asap` exactly. Plus, it makes it very clear in the database, if I'm glancing at it, that this is a purposefully unset password. (I'll use my password reset functionality to reset it for the first login.)

**Do not seed data unless you have to** This was found in a migration. The seed data was empty.

**Required data should be seeded in migration** Correct. I need a programmer or admin level user in order to administer my application. Without a single high level user, we have arrived at an impasse - there are no privileged users to elevate other non-privileged users.  So it's required that I have at least one user.

So, this is why I use a plaintext password on my main first account in a migration.  And then, I'll change the password, the application will remove my plain text content and replace with a hash, and I'll update my password manager with my newest password. 