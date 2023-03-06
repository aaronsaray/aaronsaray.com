---
layout: post
title: The Importance of ToDo Tests
tags:
- php
- testing
- phpunit
---
I'm not a huge fan of `todo` comments in code because I think they're mainly forgotten. However, I don't have the same opinion for PHPUnit tests.  Let's talk about why - and how to easily add them in your code.

### Why Todo in PHPUnit?

Usually when we write `todo` in some code, it's because we understand something important about the code we're near, but don't have time to fix or change it.  The fact that you're deep into the understanding of the code at the time is super valuable.  You know the most about that code probably at the time that you're writing the todo.

But do you come back and fix it? I can count on one hand the number of times that I have gone back to fix it. It's usually I forget it's there, I don't remember exactly what I wanted to do about it, or I don't have the time to fix it.  There is no pain, either, because it's just silently in a comment. (Props to people who have linters who stop todo comments!)

With tests, though, I think there's even more value in these todos.  You have written code and you know the ins and outs of it. Maybe you're being forced to move on without writing tests.  How are you going to remember all of the scenarios a week, a month later?  Will you ever come back to it?  I think when we're writing the code, we know the most about the use cases. So, this is the perfect time to write the tests.

Or, at least write shells of the tests with todos.  This way, you know what you need to test when you come back to work on it. Even **more important** is you know what's **not tested** by looking at your todos.  You might assume the entire process is under test if you see 20 unit tests. But, when you see some todo tests, you know specific areas that are not tested and areas that you can't fully depend on.

With PHPUnit, we can mark tests as incomplete.  This means that the unit test suite will still run, but we'll start to see indications of tests that are incomplete.  This provides the 'pain' or 'consequence' too.  If our todo tests keep growing, we'll see them on each test run.  If you have more `I` than `.` in your output, you know that your coverage is trending in the wrong way.  This will help you make your point that you need to write more tests.

Finally, depending on your team, you may have specific people who need specific types of work - or you might be wanting to onboard a new person.  With the todo tests written out, you can give someone some clear tasks: fill in the tests.  This is much easier than "come up with test cases that are missing for a thing that you don't fully understand anyway."

### Implementation of Todo Tests

In order to make the process of marking a test `todo` easier, I put a method on my base test class. (You could also write this as a trait and include it on test classes that have todos, but I find that its just easier to have it on the base test class).

```php
/**
 * Marks a test as incomplete with a useful message
 */
protected function todo(): void
{
  $caller = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2)[1];
  self::markTestIncomplete(sprintf('Todo: %s::%s', $caller['class'], $caller['function']));
}
```

Then, you can write something like this in your unit tests:

```php
public function testPositiveNumbers(): void
{
  self::assertEquals(6, Utility:multiply(2, 3));
}

public function testZeroNumbers(): void
{
  $this->todo();
}

public function testOneNegativeNumber(): void
{
  self::assertEquals(-6, Utility:multiply(-2, 3));
}
```

Now, when you run the test suite, the output would look like this:

```
.I.
```

That means two successful, one incomplete.

If you wanted to see the error messages, you could run it with the `--verbose` flag.  Then you'd see something like this:

```
.I.                                              3 / 3 (100%)

Time: 00:00.004, Memory: 8.00 MB

There was 1 incomplete test:

1) Tests\Unit\ExampleTest::testZeroNumbers
Todo: Tests\Unit\ExampleTest::testZeroNumbers
```
