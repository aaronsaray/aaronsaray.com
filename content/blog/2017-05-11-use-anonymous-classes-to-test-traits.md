---
title: Use Anonymous Classes to Test Traits
date: 2017-05-11
tags:
- php
- phpunit
- testing
---
I'm guilty of creating stub-like classes in my tests to unit test traits, sometimes.  So, you end up with a special class inside your unit test file, perhaps at the bottom, that is empty but only extends the trait or something like that.  This is not a good idea, but it was my only way that I could figure out how to unit-test traits separately - especially if they were made of protected methods.  

<!--more-->

But there is a better way: use anonymous classes to test your trait.  

Let's look at an example.  Here we'll look at our trait.  Our trait basically just filters a string to lowercase.

**`src/Traits/FilterToLCTrait.php`**
```php
<?php
namespace App\Traits;

trait FilterToLCTrait
{
  public function filterStringToLC($string)
  {
    return strtolower($string);
  }
}
```

And now, let's take a look at one of our tests in our test case.

```php
$class = new class { use FilterToLCTrait; };
$this->assertEquals('abc', $class->filterStringToLC('AbC'));
```

This way we can test our trait without having to make our stub class somewhere in this file.  

The only trouble you might have is if your trait has a protected method.  I tend to just create a 'proxy' method to enable that.  (You could use reflection to make it public for your test, I'm sure, too.  There are many ways to solve a single problem.)

Let's imagine now that the signature for the method has changed from `public` to `protected` - and we still want to test this smaller unit.

```php
$class = new class { 
  use FilterToLCTrait; 
  public function proxyFilterStringToLC()
  {
    return call_user_func_array([$this, 'filterStringToLC'], func_get_args());
  };
};
$this->assertEquals('abc', $class->proxyFilterStringToLC('AbC'));
```

Here, we just proxy the call to our protected method, passing in whatever would be incoming functions to the new method.  I wrote it with `func_get_args` and `call_user_func_array` because I don't want to have to edit all of these internal implementations if I change my function's signature or parameter list.

> There are arguments that you should never be unit testing something like a trait with a protected method.  Instead, you should only be testing the class that implement that trait.  I think that's fine, for the most part, but sometimes your trait is pretty complex.  And then, you'd have to test each scenario individually on each class - if you were following that line of logic.  Instead, I tend to test the trait like this with all the ways I can think of - then when it comes to my implementing class, I can focus on testing it's own interior logic, knowing that I only need to have one successful path through the trait to verify it is in-fact implemented.  I think this is "not the right way" - but sometimes solutions outside of the 'way the book says to do it' make more sense in real life, at least to me.