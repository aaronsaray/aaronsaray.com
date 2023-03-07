---
title: Why Use Private in Open Source Software
date: 2017-09-04
tag:
- php
- programming
---
As a PHP programmer, I struggle to understand the reason for private methods and properties.  Now, don't get me wrong, **I know** the official explanation for them: "Use this to hide properties and methods from child classes" - but why?  There have been a number of times when I've done stuff that is way more of a cluster-fnck because of private methods that I couldn't slightly modify.  

<!--more-->

**tldr;** Most reasons are wrong / useless or just 'perfect world' scenarios.  The only reason I came up with is for third party libraries that are on a fast-update process where their internals get consistently rewritten drastically per release.

### An Example of  a Protected Variable

Let's say we have a plugin system - and it provides access to the database.  The database is wrapped with some custom special functions and sanitization, logging, and a bunch of other stuff.  Doesn't really matter.  Point is, we don't want people to access the database connection directly because they might do some code that has some vulnerabilities in it (perhaps sql injection).  So, we write a base class - and then they can extend it - like this example:

```php
<?php
abstract class BasePlugin
{
  private $db;
  
  protected function getDb()
  {
    if (empty($this->db)) {
      $this->db = new PDO(getenv('dsn'));
    }
    return new CustomWrapperAroundPDO($this->db);
  }
}

class CustomPlugin extends BasePlugin
{
  public function getValue($key)
  {
    return $this->getDb()->wrappedSelect($key);
  }
}
```
This class isn't something necessarily 'good' but it's the simplest way to demonstrate this concept I think.

Now, when someone uses our custom plugin, they get access to a `CustomWrapperAroundPDO` object, not direct access to PDO itself.  We store the actual PDO element as a private variable - so our child plugins can't access it directly, messing up things.

### Most People Play By The Rules

Most people will now just us the `getDb()` function - but every once in a while there is a maverick among us!  (That or someone who's just starting and doesn't fully understand what the point of the custom wrapper is - they might just think it's slowing themselves down.)

So, they write this code:

```php
class CustomPlugin extends BasePlugin
{
  public function getValue($key)
  {
    $db = new PDO(getenv('dsn'));
    return $db->query("select $key from my_table");
  }
}
```
Here, you can see that they just made their own instance of PDO.  Then, they wrote sql that is potentially vulnerable to sql injection.  They were able to do this because the source is open source software - and they could just see how the PDO object was made and copy it.  It's not like a binary library where you don't know exactly how the objects in private storage are defined (which of course is still just security through obscurity).

### There Are Only Two Reasons

There are only two reasons that I can see to make private methods, variables, etc - in Open Source Software like PHP.

First, they're made as helper methods to do things "the right way" but they're more like directions, not security.

Secondly, the only real obvious / true reason is that you're working with a third-party library that tends to update it's private code often and drastically.  They publish interfaces and that's all you should interact with. You should treat the source as educational, not instrumental.

> For programmers who program to interfaces, this might seem like an obvious "duh" entry, but PHP developers usually start out with the constraints of interfaces. A structured PHP application should insist that interaction happen via interfaces, but again, since we can see/access the interior code, that can make it easier to bypass the notion of only using protected/public methods and to dig in and muck things up. :)