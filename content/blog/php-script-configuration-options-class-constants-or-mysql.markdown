---
title: PHP Script Configuration Options - Class Constants or MySQL
date: 2008-05-31
tag:
- php
---
I'm trying to figure out the best way to do configuration options for my newest PHP scripts that I'm working on.  My requirements are simple:

<!--more-->

1) You cannot change the config option once it is loaded

2) The options are easy to modify quickly

3) Must call a method to get values, no matter if they're available globally or not (this is just in case I want to change the logic in the future)

Non-Requirements:

1) Does not need to make dynamic configuration options or choose configuration options based on logic (IE, one mysql credential for LIVE vs another for development)

with this in mind, let's figure out what may work best:

## Class Constants

I'm going to call my class `config` with the method of `get` - simple enough.  (I thought about using magic methods and overloading - but bleh - let us just keep it simple)...

For this test, I'm going to have 5 configuration items, all named `item1` - `item 5`.

When I was building my get method, I kept running into an error:

```txt
Fatal error: Access to undeclared static property: config::$item
```

The first way I tried to do it was as so:

```php
public static function get($item)
{
  return self::$item;
}
```

Turns out, that method of accessing an item points to it as being a static variable and not a constant (never-mind the fact that `self::item1` would work...)

I have to end up using the `constant()` function.  Here is my finished testing script:

```php
class config
{
  const item1 = 'test';
  const item2 = 'test';
  const item3 = 'test';
  const item4 = 'test';
  const item5 = 'test';

  public static function get($item)
  {
    return constant("self::$item");
  }
}

/** illegal **/
print config::item1;

print config::get('item1');
```

As you can see, I can still access the items 'illegally' by going the class constant route - but I made sure that the `get()` method works as well.

Doesn't look too bad...

## Enter MySQL

Ok - so I wanted to try to do it with MySQL - to make it even more dynamic.  This script becomes drastically more complex:

1) need to form some sort of singleton pattern as to not make more than one connection to the db.

2) don't want to create a new object - would like to keep using the static `get()` method.

3) need to manage mysql credentials (which I originally wanted to store in my config class as elements to reference) in the config class...

So, I'm going to cut it off there... it is just not worth it - not for a config.

I have decided that the config should be in the class constants - and not read it in from mysql.  Interestingly enough, at "the triangle," I still do make use of mysql for meta data - that is to say data on the page that we can change easily and at will.
