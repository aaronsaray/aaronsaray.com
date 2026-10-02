---
title: "Is your validation test passing for the wrong reason?"
date: "2026-08-11"
tags:
  - testing
  - laravel
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-08-11-is-your-validation-test-passing-for-the-wrong-reason"
  canonical: true
---

A common pattern when testing Laravel validation looks like this:

<!--more-->

```php
$response->assertSessionHasErrors(['username']);
```

(Livewire has its own `assertHasErrors` that works nearly the same way, and everything below applies there too.)

This only says "the form rejected the input and there was an error on the username field."
That's a weaker claim than what we actually want to prove, which is that a specific rule rejected this input.

Here's where it falls apart.
Imagine a test class covering registration, with a `setUp()` that seeds the users these tests typically need:

```php
class RegistrationTest extends TestCase
{
  protected function setUp(): void
  {
    parent::setUp();

    User::factory()->create(['username' => 'admin']);
    User::factory()->create(['username' => 'regular-user']);
  }
}
```

Every test in the class starts with a known admin and a known regular user.

Now, let's look at my contrived registration form with just two rules on `username`:

```php
public function rules(): array
{
  return [
    'username' => [new NotReservedUsername, 'unique:users'],
  ];
}
```

`NotReservedUsername` is a custom rule that rejects `admin`, `root`, and `system`.
`unique:users` is the standard duplicate check.

The test for the custom rule:

```php
public function testCannotRegisterWithReservedUsername(): void
{
  $response = $this->post('/register', ['username' => 'admin']);

  $response->assertSessionHasErrors(['username']);
}
```

This passes.
But what if later someone refactors `NotReservedUsername` into a no-op accidentally?
The test still passes.
`admin` already exists from `setUp()`, `unique:users` fires, and the field has an error.
The assertion can't tell which rule produced it and the broken custom rule slips by our tests.

The fix is to assert on the specific message:

```php
$response->assertSessionHasErrors([
  'username' => 'This username is reserved.',
]);
```

Now if `NotReservedUsername` stops firing, the assertion fails, because `unique:users` produces a different message and won't satisfy the check.
