---
title: Test Coverage is Not as Good of a Metric as You Think
date: 2019-06-09
tag:
- php
- phpunit
- testing
---
There are a lot of debates about trying to achieve test coverage of 100%. Some people swear you need to do this. Others say, get 80% or more... the rest doesn't matter.  Each side has strong arguments.

<!--more-->

But, I think test coverage is not a great metric actually.  See, test coverage should be used as a last-step reminder that you might have forgotten to test an area of new code.  Instead, you should be writing either TDD or testing right after you wrote it.

Let me show an example (albeit very contrived).

{{< filename-header "app/models/Chicken.php" >}}
```php
<?php
namespace App\Models;

class Chicken
{
  public function whatItDoes(): array
  {
    return [
      'does' => 'clucks',
      'repeats' => $this->randomRepeats()
    ];
  }

  protected function randomRepeats(): int
  {
    return rand(1, 4);
  }
}
```

In this case, we want to test our `whatItDoes` method.

Right now, we don't have test coverage:

{{< image src="/uploads/2019/code-coverage-1.png" alt="No Coverage" >}}

Now, let's introduce our test.

{{< filename-header "tests/Unit/Models/ChickenTest.php" >}}
```php
<?php
namespace Tests\Unit\Models;

use App\Models\Chicken;

class ChickenTest extends \PHPUnit\Framework\TestCase
{
  public function testWhatItDoes(): void
  {
    $chicken = new Chicken();
    $does = $chicken->whatItDoes();

    $this->assertTrue(is_array($does));
    $this->assertNotEmpty($does);
    $this->assertCount(2, $does);
    $this->assertEquals('clucks', $does['does']);
  }
}
```

This test _should_ test the `whatItDoes` method as well as provide testing for the protected method that generates the repeats.  This tester, not fully understanding maybe the intricacies of unit testing, has **went overboard with the testing** and is testing with too many methods, but not the right things.

First, they check that it's an array.  Then, they check that its not empty.  Then, the count of items. Finally, they test what it does.  I think we could get rid of the `is_array` test because we're already using types.  Not empty can go away because we're using count.  Let's run it and see what we get for coverage.

{{< image src="/uploads/2019/code-coverage-2.png" alt="100% Coverage" >}}

Now, we have 100% code coverage for this test. Yay!

But you'll notice that it never actually tested anything about the repeats function. Does it stay within an acceptable bounds? Is the item even set? Is it an integer? Etc...

Because of this, we can definitely conclude that **the code coverage metric is not a good measurement of how well your code is tested**.