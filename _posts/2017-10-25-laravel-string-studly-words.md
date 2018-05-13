---
layout: post
title: Studly Words in Laravel
tags:
- php
- laravel
---
In Laravel, the `Support\Str` class has a lot of useful methods for switching formats of strings between each other.  I needed to take a hyphenated slug and change it to title case words.  In Laravel land, I think this is referred to as "Studly" - because I found something very similar called `Str::studly()`.  This converts underline or hyphenated words into a single string with capital letters.  I wanted to not concatenate all of these.

To be clear, I wanted to convert something like `something-is-here` to `Something Is Here` - the closest I could find in Laravel made it `SomethingIsHere` which is not very good for a sentence.

So, following the Laravel namespace convention, I created my own `Str` class which augments the existing one to add this functionality:

**`app/Support/Str.php`**
```php
<?php
/**
 * Our own string helper functions as well
 */
declare(strict_types=1);

namespace App\Support;

/**
 * Class Str
 * @package App\Support
 */
class Str extends \Illuminate\Support\Str
{
  /**
   * The cache of studly-cased word strings.
   *
   * @var array
   */
  protected static $studlyWordCache = [];

  /**
   * Convert snake case to studly words
   * 
   * ex: something_here to Something Here
   * 
   * @param $value
   * @return mixed|string
   */
  public static function studlyWords($value)
  {
    $key = $value;

    if (isset(static::$studlyWordCache[$key])) {
      return static::$studlyWordCache[$key];
    }
        
    return static::$studlyWordCache[$key] = ucwords(str_replace(['-', '_'], ' ', $value));
  }
}
```

To be clear, I might have chosen to do it slightly different, but in this case I decided to follow their paradigm.  In the end, the only real difference between this method and the `studly` one in the base class is a lack of removing the final spaces after `ucwords`.
