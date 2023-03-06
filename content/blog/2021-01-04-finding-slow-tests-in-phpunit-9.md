---
layout: post
title: Finding Slow Tests in PHPUnit 9
tags:
- php
- testing
- phpunit
---
When your unit test suite gets larger, it can take quite a long time. One of the many ways to speed this up is to hunt down and fix slow tests.  Let's use PHPUnit's test listeners to do just that.

I've written about this [before]({% post_url 2011-12-20-add-phpunit-listeners-to-watch-for-long-running-tests %}) and [revised it]({% post_url 2017-11-15-phpunit-listener-for-long-running-tests-update %}) as well, but with PHPUnit 9, we have new interfaces and classes that we need to create.  Let's get started.

We're looking for something called [extensions](https://phpunit.readthedocs.io/en/9.5/extending-phpunit.html#extending-the-testrunner) in this version of PHPUnit.

I am going to use the `executeAfterTest` hook to check the time of each test.  If its longer than 3 seconds, I'm going to just write a message to standard error.  (You may want to issue an exception if you're really die-hard. I just want to be notified.)

I'll compare the time, which is in seconds with float precision, and if it's longer than than my configuration constant, I'll write a message about the test class.

I've created the file at `tests/LongrunningTestAlert.php` with the following content:

```php
<?php

namespace Tests;

use PHPUnit\Runner\AfterTestHook;

class LongRunningTestAlert implements AfterTestHook
{
  protected const MAX_SECONDS_ALLOWED = 3;

  public function executeAfterTest(string $test, float $time): void
  {
    if ($time > self::MAX_SECONDS_ALLOWED) {
      fwrite(STDERR, sprintf("\nThe %s test took %s seconds!\n", $test, $time));
    }
  }
}
```

Then, I've added this configuration to my `phpunit.xml` file at the top level:

```xml
<extensions>
  <extension class="Tests\LongRunningTestAlert" />
</extensions>
```

Now, any time there is a test that's longer than 3 seconds, I'll be alerted.

### Quick Notes for Database Setup In Tests

If you're using something like Laravel, you might run into a situation where the unit test set up for your database takes a long time.  If you're running your database migrations on each test (which is the default with sqlite), I recommend against that and using a similar database to your production system.  If you're using something like MySQL, it will run the migrations the first time, and then after that use transactions.

If you are using a set up that only one test receives the weight of the database setup, and you don't want to alert on that test each time, you can implement the `BeforeTestHook` interface and do something with that handler method.  For example, in Laravel, you might store the state of the `RefreshDatabaseState::$migrated` variable.  If it is false when the test begins, and true when the test ends, you can likely assume this was the test that had to experience that setup.  You will obviously not be able to track the length of this specific test's time, but that's probably ok.
