---
layout: post
title: What "type" are you?
tags:
- php
---
When I went to a University for a Computer Science degree, a required class was Introduction to Java Programming.  I remember the first thing the professor taught seemed very confusing at the time.  I can still hear his voice very clearly: "So to begin with, we'll type... string string equals new string."  

### Episode 11: What Type Are You?

As the class went on, I learned a little bit about strong typing variables and how necessary that was in Java.  Having been a self-taught PHP "expert" for the last few years, I scoffed at this new code requirement I was learning.  Java programmers have made everything way too difficult on themselves and this is all just silly.

Readers of this column know that I'm no stranger to opening up about my mistakes from my early career and describing how, in most cases, I'm the "silly" one.  This is one of those cases.  I didn't know much about types of variables because I was using a loosely typed language.  And since I was able to program a guest book with PHP, I certainly knew more than this Java professor.

Fast forward a few years and I had begun to understand the importance and relevance of variable types from my forays into other languages.  Now, while I like the loose-typed flexibility of PHP, I also appreciate the accuracy, predictability and consistency strong typed variables can bring.  

I'm going to assume that you're familiar with weak and strong typing and have a general understanding of how PHP handles variables.  
(For more background, check out Wikipedia articles about [Data Type](http://en.wikipedia.org/wiki/Data_type) and [Strong and Weak Typing](http://en.wikipedia.org/wiki/Strong_and_weak_typing).  This article's code examples will focus more on method type hinting and not casting of types.

#### What Types Can Be Hinted

As of PHP 5.5, the following types can be hinted: classes, interfaces, arrays, and callable.  Resources, Traits and Scalar types are not currently allowed at this time.  When hinting objects, one important thing to remember is that any class or interface that makes up the entire object can be hinted.  This means child classes can still satisfy a parent class hint.

#### Why To Hint

As a Confident Coder, we know that we want our methods to be doing the least amount of work as possible.  I'd rather not have to handle converting data types.  

The following style illustrated in this example might be familiar to you:

```php?start_inline=1
function doSomething($value)
{
  $value = (array) $value;
  // ...
```

Since it was unclear what data type the parameter will be, it was cast to an array.  Other examples might use functions like `is_array()` to determine if this parameter is of the required type.

If I document my function (and now have a type-hinted signature), it will be the calling code's responsibility to provide my function with the proper variable type.

Note how the previous example can be refactored to require the proper data type:

```php?start_inline=1
function doSomething(array $value)
```

This will now require the incoming variable to be type array.

Often, Confident Coders find themselves building modular, reusable code as a library or the base of an application.  Usually, this code can then be implemented or extended to create other applications.  Because of this, the original programmer, other programmers on the team, or even the entire user base may be using the code and calling public methods.  When you introduce this much flexibility and utility, it is even more important to impose standards and to be precise.  This is an example where type-hinting in PHP really shines.

Imagine a code base where programmers can send any of their objects into your method as a parameter.  However, since your method requires a method of the parameter object's to be called every single time, you can define an interface for those objects to implement.  Then, using the interface as the type hint in the function signature, it can be guaranteed that the methods exist.

This interface and class method help demonstrate this:

```php?start_inline=1
class MyProcessorClass
{
  function process(MyPluginInterface $yourPlugin)
  {
    $yourPlugin->doSomething();
  }
}

interface MyPluginInterface
{
  public function doSomething();
}

```

Since the `process()` method will always be calling the `doSomething()` method of any object passed as a parameter, the interface defines the `doSomething()` method.  This means that any class implementing this interface must have that method.  And since the `process()` method has type-hinted its parameter to be that interface, we can be assured that any object, no matter what base class it is, will at least have that callable method because it will be forced to implement the interface.

#### End Notes

Confident Coders know and appreciate the balance between the ease-of-use of our beloved loosely-typed language and the accuracy and standards enforced by strong typing.  It is incredibly important to understand the unique value that type-hinting inside a loosely typed language can add to your programming.  Learn to balance and embrace the flexibility of PHP with the benefits that type-hinting can add.

> This entry is republished from the original columns included years ago in the [PHP Architect](http://phparch.com) magazine.  I really recommend purchasing the magazine to get timely articles, columns and PHP news.
