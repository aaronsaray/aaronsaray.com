---
layout: post
title: Use the $this->fail() method with Mockery::on()
tags:
- PHP
- testing
- mockery
---
When you have a more complex assertion you need to make on the parameters of a mocked object, you might use the `Mockery::on()` method.  It can be hard to tell how this fails, though, because if the assertion fails somewhere, the message is confusing - it basically says that there was no matching call to that method, which is _technically_ correct.

Let's take a look at this example:

```php?start_inline=1
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

Here, we have a mocked class that should receive a call to the `process` method once and that should return true.  We want to make sure that the parameter passed into the function is an instance of `SomeClass` and that the `getProperty()` method returns `12` - for some reason.  This is just a contrived example of course.

Now, if everything is valid, we return true - and the test passes.  However, if the parameter isn't an instance of `SomeClass` - or - if the value is not right, `$valid` will be false.  This will make Mockery give us the weird error like:

```
Mockery\Exception\NoMatchingExpectationException: 
No matching handler found for Mockery_2_Mocked_Class_name::process(...
```

This obviously is not clear - which thing failed?  Or even worse, imagine if there were a bunch of checks to do - instead of just 2. How would you ever track this down?

**Got the solution** from a tip from my coworker [Fred](https://github.com/fredjiles) - it has to do with using `$this->fail()` in PHPUnit (or the equivalent method in your test framework of choice).  Let's check out our new test with more verbose items.

```php?start_inline=1
$mockedClass->shouldReceive('process')->once()
  ->with(\Mockery::on(function($parameter) {
    if (! $parameter instanceof SomeClass) {
      $this->fail('Parameter not instance of SomeClass');
    }
    if ($parameter->getProperty() != 12) {
      $this->fail('Property is not 12.');
    }
    return true;
  })->andReturn(true);
```

Now, when we run the script and we have an issue, it'll fail with a more verbose message:

```
There was 1 failure:

1) Tests\MockedClassTest::test
Property is not 12.
```

This is pretty easy to tell what the exact error was - and why it failed.

As a bonus, you might also use the parameter hinting of the closure passed to `Mockery::on()` to get cut down on the testing you have to write.  Instead of checking for instances, just require the incoming item to be that instance.

```php?start_inline=1
$mockedClass->shouldReceive('process')->once()
  ->with(\Mockery::on(function(SomeClass $parameter) {
    if ($parameter->getProperty() != 12) {
      $this->fail('Property is not 12.');
    }
    return true;
    }
    return $valid;
  })->andReturn(true);
```

If the wrong class comes in, the error will be very clear and verbose:

```
There was 1 error:

1) Tests\MockedClassTest::test
TypeError: Argument 1 passed to Tests\MockedClassTest::Tests\{closure}() 
must be an instance of SomeClass, instance of WrongClass given, called in
/project/path/vendor/mockery/mockery/library/Mockery/Matcher/Closure.php on line 35
```
