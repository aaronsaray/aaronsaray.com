---
title: Object Cache Class in PHP
date: 2010-11-16
tag:
- php
- programming
---
While I'm infinitely happy that all uses of a class in PHP now are references, that's just not good enough.  Sometimes I want to use my newly created object in many different methods.  I have two options.  First, I could create it as a Singleton, and always call the instance getter.  Or, I could use an object cache.

<!--more-->

The object cache is design to store the references to the objects that you associate with it, as a static reference.  Then, later, when you call it, it will check its static um...self... to see if the object exists.  If so, it will return it.  Wala - no singletons.

Before I show you the code, I wanted to point out that this has already been done now (perhaps more efficiently?) in SPL: [http://www.php.net/manual/en/class.splobjectstorage.php](http://www.php.net/manual/en/class.splobjectstorage.php).

## The Object Cache Class

This is the very simple code in the class found in this file:

{{< filename-header "objectCache.php" >}}
```php
class objectCache
{
  protected static $_storage = array();

  public static function exists($type, $id)
  {
    return isset(self::$_storage[$type][$id]);
  }

  public static function set($type, $id, $obj)
  {
    self::$_storage[$type][$id] = $obj;
  }

  public static function get($type, $id)
  {
    return self::$_storage[$type][$id];
  }

  public static function clear($type, $id)
  {
    if (self::exists($type, $id)) unset(self::$_storage[$type][$id]);
  }
}
```   

For example.  If we want to make a new user from the User class, and then later retrieve more information, this might be used:

```php
$uid = 12;
$user = new User($uid);
objectCache::set('user', $uid, $user);
//...snippie...
$uid = 12;
$user = objectCache::exists('user', $uid) ? objectCache::get('user', $uid) : false;
```   
