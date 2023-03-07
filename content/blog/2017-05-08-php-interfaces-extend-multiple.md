---
title: PHP Interfaces Can Extend Multiple Interfaces
date: 2017-05-08
tag:
- php
---
Every PHP programmer knows you can't extend multiple classes with PHP.  You can only do one - which is fine.  In fact, if you need more shared code, make sure to focus on using [traits](http://php.net/manual/en/language.oop5.traits.php) instead.

<!--more-->

What I didn't realize, until recently, is that PHP Interfaces can extend multiple other interfaces, though.  (I admit, I haven't been much of a contract-based programmer until recently.)  Let me show you what I mean:

```php
interface Talks
{
  public function say(string $message);
}

interface Eats
{
  public function putInMouth(FoodObject $food);
}

interface Human extends Talks, Eats
{
  public function singsOffKey(SongObject $song);
}
```

Now, when you have an object that implements the `Human` interface, it's going to have to define the `putInMouth` and `say` methods in addition to the `singsOffKey` method.  Pretty sweet.
