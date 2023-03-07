---
title: Better failing tests with Mockery::on()
date: 2018-10-15
tags:
- php
- testing
- mockery
---
In an earlier post titled [Use `$this->fail()` with `Mockery::on()`]({{< ref "/blog/2017-06-11-use-the-fail-method-with-mockery-on" >}}), I explained the challenges of debugging a failing test with the closure passed to `Mockery::on()`.  Instead of returning `false`, I opted to use `$this->fail()` - which seemed like a good idea at the time.  After all, I was doing my test, then failing with a useful bit of information.  (Previous to this, it would just say that you don't have a matching handler for this assertion, which was really confusing).

<!--more-->

Then it hit me: **I'm reinventing the wheel.** Listen to what I said: I'm testing something, then calling a failure method.  That sounds like a lot like assertion to me.  Duh!  Let's use the previous example:

```php
$mockedClass->shouldReceive('process')->once()
  ->with(\Mockery::on(function($parameter) {
    $valid = false;
    if (
      ($parameter instanceof SomeClass)
      &&
      ($parameter->getProperty() == 12)
    ) {
      $valid = true;
    }
    return $valid;
  })->andReturn(true);
```

You can read about our expectations in the earlier [blog posting]({{< ref "/blog/2017-06-11-use-the-fail-method-with-mockery-on" >}}) - but let's refactor this using assertions now.

```php
$mockedClass->shouldReceive('process')->once()
  ->with(\Mockery::on(function($parameter) {
    $this->assertInstanceOf(SomeClass::class, $parameter);
    $this->assertEquals(12, $parameter->getProperty());
    return true;
  })->andReturn(true);
```

This is so much better and it still gives us good errors when it fails.