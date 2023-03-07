---
title: Named function or anonymous function for PHP helper
date: 2022-03-11
tag:
- php
---
The question is this: When creating a helper method in PHP, should you use a named function in the global scope, or an anonymous function assigned to a variable?

<!--more-->

Well first of all, let's define what these two choices are - so we understand why we're even asking the question.

You might find yourself wanting to create a simple helper method in PHP.  These are probably nearly context-less functions who just do a simple thing for you. They don't necessarily make sense as a class static method (we've all made `Util::myFunc()` before...) so you decide to just make a method in the global scope.  Or maybe you should make an anonymous method because it's just a helper.  Let's take a look at the two in practice.

```php
<?php

function colonAndCombine(string $first, array $second): string
{
  return $first . ':' . implode(',', $second);
}

class Main
{
  public function run(): void
  {
    $who = 'george';
    $couldBe = ['of the jungle', 'washington'];

    print colonAndCombine($who, $couldBe);
  }
}

print colonAndCombine('english', ['one', 'two']);
print "\n";
print colonAndCombine('spanish', ['uno', 'dos']);
print "\n";

$app = new Main();
$app->run();
```

In this case I want to use my `colonAndCombine` method in many places... inside of a class, in the global method, etc.  This is obviously a contrived example, but it's meant to explain the **scope** of this named method.

Now, let's look at how we might make use of an anonymous method:

```php
<?php

$colonAndCombine = function (string $first, array $second): string
{
  return $first . ':' . implode(',', $second);
};

class Main
{
  public function run(): void
  {
    $who = 'george';
    $couldBe = ['of the jungle', 'washington'];

    print $colonAndCombine($who, $couldBe);
  }
}

print $colonAndCombine('english', ['one', 'two']);
print "\n";
print $colonAndCombine('spanish', ['uno', 'dos']);
print "\n";

$app = new Main();
$app->run();
```

This will error out.  The named variable is not available in the class, so therefore you can't call the anonymous function.  You could declare `global $colonAndCombine;` at the top of the `run()` method.  And then it would work.

So, by now, you might be asking - hey, what's the point?  It seems like the global named method is the way to go because it's available everywhere.

But do you really want this?  I would argue the answer depends on the use case of the helper.  Perhaps I want a method that I'll reuse many times in this particular file or method, but I don't necessarily want other classes making use of it. 

So, the answer is 'it depends.'  I know, everyone's favorite answer to a question posed in an article or blog entry!