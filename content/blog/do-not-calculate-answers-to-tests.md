---
title: Do Not Calculate Answers to Your Unit Tests
date: 2021-02-08
tag:
- php
- phpunit
- testing
---
Since you're a programmer, you're always looking for ways to be a bit more efficient. Because of this, it can be easy to fall into the trap of being too programatic, too calculation-heavy in your unit tests. But, this isn't a test then - its just another block of quite fallible code.  Let's talk about why and show what to do instead.

<!--more-->

## Example

Let's say we have the following logical code.  These are obviously very contrived examples.

```php
<?php
namespace App;

class Utility
{
  public static function makeSpecialNumber($number)
  {
    return $number > 5 ? $number ** $number : $number ** 3;
  }
}
```

You have a method that does some sort of business domain logic to make a special value for your code.  Then, you decide to write the test.  You're going to use the test value of `4`. 

You could calculate out what `4` would actually equal: `64`.  But, that's pretty complex. And you have PHP available to you anyway. You know that a really simple, easy to follow way to "programmatically" solve this.  So you might find yourself writing a test like this:

```php
<?php
namespace Tests\Unit;

use App\Utility;
use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
  protected function generateSpecialNumber($incoming)
  {
    return $incoming * $incoming * $incoming;
  }

  public function testMySpecialOutcome()
  {
    self::assertEquals($this->generateSpecialNumber(4), Utility::makeSpecialNumber(4));
  }
}
```

You know that the 'simple' way to test this is with your `generateSpecialNumber()` method and the test is passing.  Now, someone says "don't forget about 0!!".  So, you rename one method and add another:

```php
public function testMySpecialNumberNormal()
{
  self::assertEquals($this->generateSpecialNumber(4), Utility::makeSpecialNumber(4));
}

public function testMySpecialNumberZero()
{
  self::assertEquals($this->generateSpecialNumber(0), Utility::makeSpecialNumber(0));
}
```

Then, someone says don't forget about negative numbers!  You also realize that maybe you don't need to generate a special value 0 when it's zero, so you won't call that method at least there.  So you write these tests now:

```php
public function testMySpecialNumberNormal()
{
  self::assertEquals($this->generateSpecialNumber(4), Utility::makeSpecialNumber(4));
}

public function testMySpecialNumberZero()
{
  self::assertEquals(0, Utility::makeSpecialNumber(0));
}

public function testMySpecialNumberNegative()
{
  self::assertEquals($this->generateSpecialNumber(-3), Utility::makeSpecialNumber(-3));
}
```

Everything is going good now.

## The Monkey Wrench

Then someone says 'oh theres a problem with the code when we use 10' and so you go and write a unit test for 10.

```php
protected function generateSpecialNumber($incoming)
{
  return $incoming * $incoming * $incoming;
}

public function testMySpecialNumberDoubleDigit()
{
  self::assertEquals($this->generateSpecialNumber(10), Utility::makeSpecialNumber(10));
}
```

Oh no!  You have an error now:

```txt
Failed asserting that 10000000000 matches expected 1000.
```

Oh, that makes sense.  Let's adjust our generation method to calculate the answer.  I realize I'm now starting to do more logic, but its still **different** right? I'm using different ways to solve it, so they'll be fine.

```php
protected function generateSpecialNumber($incoming)
{
  if ($incoming > 5) {
    $return = $incoming;
    for ($i = 0; $i < $incoming - 1; $i++) {
      $return = $return * $incoming;
    }
    return $return;
  }
  
  return $incoming * $incoming * $incoming;
}

public function testMySpecialNumberDoubleDigit()
{
  self::assertEquals($this->generateSpecialNumber(10), Utility::makeSpecialNumber(10));
}

public function testMySpecialNumberNormal()
{
  self::assertEquals($this->generateSpecialNumber(4), Utility::makeSpecialNumber(4));
}

public function testMySpecialNumberZero()
{
  self::assertEquals(0, Utility::makeSpecialNumber(0));
}

public function testMySpecialNumberNegative()
{
  self::assertEquals($this->generateSpecialNumber(-3), Utility::makeSpecialNumber(-3));
}
```

Now we're passing again.  And I can hear the defense: "I'm using different mechanisms to calculate the response values, so the chance both of those are wrong is very small."  You're right, except you're not.

This code is not using different mechanisms fully.  It still is checking **if the incoming value is greater than 5 on both sides of the test**.  This is the problem.  If you're checking the same condition on both sides of the test, you're not actually testing anything at all.

## Favor String Constants and Copy and Paste

The goal of unit tests is to have a known answer and test it against some code you've written that is dynamic. Any time you use another calculation method, or building code, you're reducing the effectiveness of your tests.  You're now testing code on both sides of the equation.

In Unit Tests, it's ok to use string constants or "magic numbers."  It's ok to copy and paste set up scenarios.  This code is not about efficiency, its about accuracy. It's about testing the efficiency code you wrote.  

So, how would my test look in the end?  Like this!

```php
<?php
namespace Tests\Unit;

use App\Utility;
use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
  public function testMySpecialNumberDoubleDigit()
  {
    self::assertEquals(10000000000, Utility::makeSpecialNumber(10));
  }

  public function testMySpecialNumberNormal()
  {
    self::assertEquals(64, Utility::makeSpecialNumber(4));
  }

  public function testMySpecialNumberZero()
  {
    self::assertEquals(0, Utility::makeSpecialNumber(0));
  }

  public function testMySpecialNumberNegative()
  {
    self::assertEquals(-27, Utility::makeSpecialNumber(-3));
  }
}
```

We are no longer doing any calculations on the expected side of the tests.  It requires more 'setup' or at least more calculation at time of writing, but it's more accurate because there are no calculations. You're simply saying "I expect this value to come out from this code" and that's it.