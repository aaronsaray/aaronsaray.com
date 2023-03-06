---
title: PHPUnit Code Coverage Can Help While Writing Tests
date: 2020-12-28
tags:
- php
- phpunit
- testing
---
It's great to run code coverage at the very end before you push your changes. This gives you some idea what's tested and what's not. But you don't have to wait till the end; code coverage can help you all throughout writing your test suite, too.

<!--more-->

> Let's make sure we're clear about code coverage. Code coverage is a metric used during unit testing to indicate how much of the code is under test. This doesn't necessarily mean that it's tested that code - just that the code has been ran during at least one of your tests in your suite.  It's quite easy for code to appear tested, but actually only to have been ran without error.

There are many types of tests that you can run with PHPUnit. In this entry, I'm going to talk more about unit and integration-layer tests.  These would be tests where we're dealing with a public method of a class. It may or may not be wired up into the rest of your application.  While these topics do apply to end-to-end testing, that's not the focus of this entry.

When looking to create my tests for a class, the first thing I do is note all of the public methods. I know I must write at least one test for each method.  Then, I look for `if` statements or other control structures like `foreach`.  If it's an `if`, I want to write a scenario that goes into the `if` and one that skips it.  If it's a `foreach`, the minimum I want is a scenario where the loop has 0 elements, so it's skipped, and at least 1 so it executes.  I also look for ternaries and treat them as an `if`.  As you can imagine, this is a thorough but exhaustive process.  For theory and a more comp-sci type of explanation, you should look into [cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity).

After I've written what I think covers all of these, I'll run PHPUnit against my particular test class with code coverage enabled.  I'm not running it on the whole project, so depending on my configuration, I may have a huge amount of code not covered.  That's ok! I'm just looking at my class to make sure I've covered each branch. (Remember, just because you've covered it doesn't mean that you actually tested it.  This is just guidance to make sure you haven't missed a branch).

Let's look at a contrived example.

### Source Code

Here we have a file called `app/Services/DogSoundsService.php` with the following PHP code:

```php
<?php

declare(strict_types=1);

namespace App\Services;

class DogSoundsService
{
  protected $legs = 0;

  public function __construct(int $legs)
  {
    if ($legs < 0 || $legs > 4) {
      throw new \OutOfRangeException("{$legs} is an invalid number of legs.");
    }

    $this->legs = $legs;
  }

  public function greeting(): string
  {
    $greeting = 'bark';

    if ($this->legs === 3) {
      $greeting = 'woof';
    }

    return $greeting;
  }
}
```

### Test Planning

Now, I'm going to begin my planning for my unit tests.  Here are my initial thoughts:

* Constructor throws exception with two if statements - two tests
* greeting method returns a greeting

I think I'm going to need three tests for this. (Now hold on, it should be obvious I'm missing something. But, not all code is this simple in our project codebase.)

### First Round of Tests

In my `tests/Unit/Services/DogSoundsServiceTest.php` file I have the following code:

```php
<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Services\DogSoundsService;
use PHPUnit\Framework\TestCase;

class DogSoundsServiceTest extends TestCase
{
  public function testLowerRangeLegsThrowsException(): void
  {
    $this->expectException(\OutOfRangeException::class);
    $this->expectExceptionMessage('-1 is an invalid number of legs.');

    $service = new DogSoundsService(-1);
    $service->greeting();
  }

  public function testHigherRangeLegsThrowsException(): void
  {
    $this->expectException(\OutOfRangeException::class);
    $this->expectExceptionMessage('5 is an invalid number of legs.');

    $service = new DogSoundsService(5);
    $service->greeting();
  }

  public function testGreetingReturnsProperDogSound(): void
  {
    $service = new DogSoundsService(4);
    $greeting = $service->greeting();
    self::assertEquals('bark', $greeting);
  }
}
```

### Running Tests and Checking Coverage

Ok, I'm ready to run this. I'll do the following command:

```bash
vendor/bin/phpunit tests/Unit/Services/DogSoundsServiceTest.php
```

And I got a successful response.

```
OK (3 tests, 5 assertions)
```

I could now run code coverage on my whole test suite.  This would take forever, though, and I am only concentrating on my own service at the moment.  So, I decide to run code coverage just when I test this one single test.  I also prefer the HTML version for local review (there are other outputs of code coverage, but those are more useful for other tools, not spot-checking like I'm aiming to do). So, I run the following command:

```bash
XDEBUG_MODE=coverage vendor/bin/phpunit --coverage-html=temp-coverage tests/Unit/Services/DogSoundsServiceTest.php
```

(Note, I'm using XDebug 3.  XDebug 2 would not require the environment variable).

Now, in the `temp-coverage` folder, open the `index.html` file and drill into the `Services/DogSoundsService.php` file.

[![Code coverage example](/uploads/2020/code-coverage-1.jpg)](/uploads/2020/code-coverage-1.jpg){: .thumbnail}{: .inline}

Looks like I have only 87.5% coverage.  Looking through the class I see that I've missed an if statement. Oh man! I forgot to check if the legs are 3.

I add the following test to my unit test suite:

```php
public function testGreetingIsWoofWhenMissingSingleLeg(): void
{
  $service = new DogSoundsService(3);
  $greeting = $service->greeting();
  self::assertEquals('woof', $greeting);
}
```

Now, my code coverage looks better, too:

[![Code coverage example](/uploads/2020/code-coverage-2.jpg)](/uploads/2020/code-coverage-2.jpg){: .thumbnail}{: .inline}

### That's Only Part of It

Remember, code coverage is only an indicator of the quality and accuracy of your testing suite. It is not the end all, be all.  Areas that are commonly covered, but not necessarily tested are:

* Calls to static methods of a different class where you don't test their by products
* Random values - especially those generated from tools like Faker
* Units of code that are covered by an end-to-end test, but not necessarily tested by a unit test - like sending mail or altering data
