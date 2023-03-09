---
title: Fixing Laravel 5.4's Dependency on PHPUnit 5
date: 2017-04-14
tag:
- php
- testing
- phpunit
- laravel
---
Normally, when I write unit tests, I don't use Laravel's facade and fakery methods.  I do a lot of injection of services, but in one particular case, when working with the Queue system, I had to use the facade for faking the queue and asserting some jobs were pushed.

<!--more-->

However, when I ran the following code in a unit test, I got an error that class `PHPUnit_Framework_Assert` was not found.

```php
class QueueFakeTest extends AbstractTestCase 
{
  public function testCanAssertPushed()
  {
    Queue::fake();
    Queue::assertPushed('my-job');
  }
}
```

After looking into the actual code for `assertPushed` I see a dependency of the PHPUnit non-namespaced class.  This is PHPUnit 4 land.  You might remember, in PHPUnit 5, they namespaced their classes, but added aliases so that it'd still be backwards compatible.  Well, this was removed in PHPUnit 6.

Time to look at my composer file...

{{< filename-header "composer.json" >}}
```json
{
  "require": {
    "laravel/framework": "5.4.*",
  },
  "require-dev": {
    "phpunit/phpunit": "~6.0",
  }
}
```

Obviously, I've snipped out portions of it. But yep, I was requiring PHPUnit 6, but in Laravel 5.4 (at least 5.4.16), the header in in `QueueFake` reveals the problem:

{{< filename-header "vendor/laravel/framework/...../Fakes/QueueFake.php" >}}
```php
<?php
namespace Illuminate\Support\Testing\Fakes;

use Illuminate\Contracts\Queue\Queue;
use PHPUnit_Framework_Assert as PHPUnit;

class QueueFake implements Queue
{
// snip
}
```

As you can see, it's importing the class alias instead of the actual namespaced code (that was available in the recommended PHPUnit 5 that laravel suggested).

## What's the Fix?

Like many of us, I have my own bootstrap php file in the tests directory (it imports the main bootstrap file for laravel, and does  a few other things.) 

In order to fix this, I decided to add class aliases to this bootstrap file.

```php
/**
 * Laravel has some testing helpers that are using the non-namespaced PHPUnit 
 * classes, but these were removed in PHPUnit 6
 */
class_alias(\PHPUnit\Framework\Assert::class,'PHPUnit_Framework_Assert');
```

Running this, my test now fails, but in a good way! (The job 'my-job' was never submitted.) This fixes this helper.

Now, I know that in PHPUnit 5 source code there probably is a bunch of aliases for each class, and the lazy way would be to just find that code and copy it into my project.  However, I don't want those aliases available.  (I don't want to accidentally use them myself either!)  So, instead, I decided to search the Laravel framework for instances of `PHPUnit_` which should give me a list of the rest of the times that Laravel might do this.

The updated list, as far as I can tell, is this:

```php
class_alias(\PHPUnit\Framework\Assert::class,'PHPUnit_Framework_Assert');
class_alias(
  \PHPUnit\Framework\ExpectationFailedException::class, 
  'PHPUnit_Framework_ExpectationFailedException'
);
class_alias(
  \PHPUnit\Framework\Constraint\LogicalNot::class, 
  'PHPUnit_Framework_Constraint_Not'
);
class_alias(
  \PHPUnit\Framework\Constraint\Constraint::class, 
  'PHPUnit_Framework_Constraint'
);
```

Then, you should be able to continue using Laravel 5.4 with PHPUnit 6.