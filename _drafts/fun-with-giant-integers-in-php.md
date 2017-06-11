---
layout: post
title: Fun with Giant Integers in PHP
tags:
- php
---
If you deal with integers, you validate them, right?  You make sure they're a valid integer?  Well, what about the value 9223372036854775808?  That's right, that's one more than the `PHP_INT_MAX` on a 64 bit system.  

So here's an interesting question: is 9223372036854775808 greater than 9223372036854775807 in PHP?  The answer is sometimes, but not when we're talking about integers.

Watch this!

```
>>> var_dump(9223372036854775806 < 9223372036854775807);
bool(true)

>>> var_dump(9223372036854775807 < 9223372036854775808);
bool(false)

>>> var_dump('9223372036854775807' < '9223372036854775808');
bool(true)

>>> var_dump(9223372036854775807 < null);
bool(false)
```

So, the first example shows that we can deal with integers that big.  The largest integer is larger than the second largest integer.  

Next, we compare one higher than the largest integer to the largest one - and that returns a false.  That seems peculiar to some extent...

However, we *can* get that to work if we convert the integers to strings - the it happens to be less-than again.

The fourth example shows what I believe is happening with the second one.  Since the number is too large to consider an integer, it turns to null.

**Important note** This is very important to understand when it comes to work with API's.  How is your incoming integer value being sent to you?  Is it a string or an integer?  If it's an integer, it can convert to null accidentally if it's too large. If it's a string, it'll pass comparisons potentially without issue - until it becomes time to convert it to an integer for storage.  Because... look what happens:

```
>>> var_dump((int) '9223372036854775808');
int(9223372036854775807)
```