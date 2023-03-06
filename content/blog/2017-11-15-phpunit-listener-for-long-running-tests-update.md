---
title: PHPUnit Listener for Long Running Tests Update
date: 2017-11-15
tags:
- php
- phpunit
---
I wrote instructions in 2011 to [add a PHPUnit Listener to Watch for Long Running Tests]({% post_url 2011-12-20-add-phpunit-listeners-to-watch-for-long-running-tests %}) which seem to be a bit out of date now.  But, here's a quick refresher:

<!--more-->

We want to add a listener to our PHPUnit tests that checks to see if any of the unit tests take longer than 2 seconds.  If so, we want to issue a warning to the screen to let us know so we can check it out.  If a unit test is taking longer than 2 seconds, there's probably something wrong.

So, let's apply our test times listener.  First, we need to register the listener with PHPUnit.

**`phpunit.xml.dist`**
```xml
<!-- snip -->
<listeners>
  <listener 
    class="Tests\TestTimeThresholdListener" 
    file="tests/TestTimeThresholdListener.php"
  />
</listeners>
```

Now, let's take a look at the listener itself.

**`tests/TestTimeThresholdListener.php`**
```php
<?php
/**
 * Listener for long test times
 */
declare(strict_types=1);

namespace Tests;

use PHPUnit\Framework\BaseTestListener;
use PHPUnit\Framework\Test;
use PHPUnit\Framework\TestListener;
use PHPUnit\Framework\TestSuite;

/**
 * Class TestTimeThresholdListener
 * @package Tests
 */
class TestTimeThresholdListener extends BaseTestListener implements TestListener
{
  /**
   * @var integer the number of milliseconds that mean this was a long test
   */
  const TEST_LIMIT_MILLISECONDS = 2000;

  /**
   * A test ended - print out if it was too long
   * @param Test $test
   * @param float $time seconds
   */
  public function endTest(Test $test, $time)
  {
    if ($time * 1000 > self::TEST_LIMIT_MILLISECONDS) {
      $error = sprintf(
        '%s::%s ran for %s seconds', 
        get_class($test), 
        $test->getName(), 
        $time
      );
      print "\n\033[41m" . $error . "\033[0m\n";
    }
  }
}
```

After each test is ran, we get the test time in seconds.  We compare that to the limit milliseconds constant.  If that's larger than we'd like, we create an error message and push it out to the console.  The formatting allows us to mark it with console warning red.

I like this updated version a lot more.  We get the actual class, not just the method - and - we don't need to make a bunch of empty methods because we can extend the base listener.  Cool!