---
title: PHPUnit Test Helpers for Mockery and Non-Public Properties
date: 2017-07-12
tags:
- php
- phpunit
---
I've written a few helpful methods and systems that help out my unit testing.  There are many arguments for and against these tools (don't test protected methods, don't introduce global namespace methods, etc) - and those are discussions for another day - but perhaps these might help you out in the mean time.

<!--more-->

### Mockery
I've been using [Mockery](http://docs.mockery.io/en/latest/) for my mocking in PHPUnit lately. (This is probably because it was introduced in Laravel, and I actually like it more than the built in PHPUnit mocking configuration.)  

To mock an object with Mockery, you have to mock it using the method `\Mockery::mock()` - which is fine.  But, in my tests I tend to allow a little bit more flexibility and "dirty" code - so I thought it'd be nice to just call something like `mock()` and get this to work easily.  So, in my bootstrap class for my PHPUnit test suite, I wrote the following code:

```php
if (!function_exists('mock')) {
  /**
   * Shortcut to mock an item
   * 
   * @return \Tests\CustomMockInterface
   */
  function mock()
  {
    return call_user_func_array('Mockery::mock', func_get_args());
  }
}
```

First, it makes sure that this global namespace method was not already defined.  If it isn't, it defines a method called `mock` which basically is just a little proxy using `call_user_func_array` to call the actual namespaced Mockery mock command.  I use `func_get_args` because I don't know how people will be using the mock command - and I don't want to know.

You might notice that I am returning a custom mock interface instead of the actual response from `Mockery::mock` - so let's take a look at it:

**`CustomMockInterface.php`**
```php
<?php
namespace Tests;

/**
 * Interface CustomMockInterface
 * @package Tests
 */
interface CustomMockInterface extends \Mockery\MockInterface
{
  /**
   * @param array ...$function
   * @return \Mockery\Expectation
   */
  public function shouldReceive(...$function);
}
```

This interface extends the interface that Mockery normally would return.  However, it has one difference, and that's in the `shouldReceive` method.  In the main implementation, there are no arguments defined, documented or hinted on this method.  It makes use of the `func_get_args()` like I've done above.  However, because of this, whenever you worked with mock interfaces in IDEs like PHPStorm, it would indicate that passing a value to the method was a no-no.  It would remind you that the definition does not receive any values.  

Because I was sick of that error, I decided to create a new implementation of this method.  Using the `...` prefix to the incoming parameter, that indicates to PHP that there is a variable length of elements this should receive.  And, because the return type is the same as the parent's interface `shouldReceive` this works as expected - with no errors in PHPStorm.

### Protected and Private Properties and Functions

Like I mentioned above, there are many arguments against testing protected methods and retrieving protected property values.  The main reason I do this is because there are sometimes complex logical operations that happen in protected methods - and testing all of those paths would require extensive set up.  If I can bypass a lot of that setup (required by the public methods), I can just test these methods like the true unit of code that they most likely represent.  When it comes to properties, sometimes you might want to test the way an object was constructed, but not actually run the code to generate the output of that object.  For example, if you just wanted to verify that an object was created with a set of two properties inside itself, without calling a `toArray()` method - which could be expensive - you might just validate the protected property values.  It's important to note that this is a rare and unique situation that requires these two methods to be used.  Most of the time, you shouldn't be using them.  Only in very complex situations might they provide an easier way to break down tests.  (Remember that time above I said that was a discussion for a different time - oops, think I just had it now.)

Let's take a look at two more methods in my bootstrap file for my PHPUnit test suite.

```php
if (!function_exists('callMethod')) {
  /**
   * Call protected or private method
   * 
   * @param $object
   * @param $methodName
   * @param array $arguments
   * @return mixed
   */
  function callMethod($object, $methodName, array $arguments = [])
  {
    $class = new ReflectionClass($object);
    $method = $class->getMethod($methodName);
    $method->setAccessible(true);
    return empty($arguments) 
      ? $method->invoke($object) 
      : $method->invokeArgs($object, $arguments);
  }
}

if (!function_exists('getProperty')) {
  /**
   * Get protected or private property
   *
   * @param $object
   * @param $propertyName
   * @return mixed
   */
  function getProperty($object, $propertyName)
  {
    $reflection = new ReflectionClass($object);
    $property = $reflection->getProperty($propertyName);
    $property->setAccessible(true);
    return $property->getValue($object);
  }
}
```

First, to call a protected or private method, we need to create a reflected version of our object.  Then, we can set the method accessible.  Finally, we can invoke it with/without arguments.  I think there is a way to call `invoke()` without checking to see if the argument list is empty - but since this already a unique method that could be confusing, I tried to write the most verbose way of it.  This should clearly show that arguments are passed in, if they exist.  Otherwise, it's called without arguments.  The return value will be the value that the method returns - and the method will be called to get this potential return value.

Second, to get the value of a protected or private property, the same process happens nearly identically.  Instead of calling a method, though, we end the function returning the value of said property.