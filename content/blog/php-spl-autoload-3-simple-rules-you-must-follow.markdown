---
title: 'PHP SPL autoload: 3 simple rules you must follow'
date: 2008-09-29
tag:
- php
---
While working on a larger site that I may need to use many external libraries, I realized I need to come up with a better `__autoload()` function (for example, I think it was DOMPDF that had its own autoload function as well.  Last time I used that, I had to hack my own autoload to use their code as well to locate files).  I researched into [SPL autoload](http://us2.php.net/manual/en/function.spl-autoload-register.php) functionality, and I've found what I need.  

<!--more-->

Through some trial and error, I found out 3 absolutely necessary rules that need to be followed when building your custom autoload functions, however.  Lets examine:

### Our Example ... so far

**`index.php`**
```php    
class FW
{
  public static function autoload($class)
  {
    require $_SERVER['DOCUMENT_ROOT'] . "/includes/{$class}.php";
  }
}

spl_autoload_register('FW::autoload');

new Test();
```
    
**existing files:**

  * includes/Test.php

### Always check if the file is readable

One great feature about the [`is_readable`](http://us3.php.net/is_readable) function in PHP is that it will not only check if the file exists, but also if the script has permission to read that file.  (No need to use `file_exists` and `is_readable` - `is_readable` can do it all).  In our example right now, this will work fine.  However, if I change the request to `new Test2()` which is a file that doesn't exist, PHP will generate a Warning and a Fatal Error - halting the script.  **Not checking if the file exists could potentially halt the script, including additional autoload functions.**

I modified that autoload function to be like this:

```php    
public static function autoload($class)
{
  if (is_readable($_SERVER['DOCUMENT_ROOT'] . "/includes/{$class}.php") {
    require $_SERVER['DOCUMENT_ROOT'] . "/includes/{$class}.php";
  }
}
```
    
Now, this autoload will include the file if it exists/is readable.

Now, lets add in a full new directory called `test` which will contain a file **`Test2.php`** with the same named class.

### Custom autoload functions should not have a failure consequence

I've seen this type of code a lot of times in autoload functions:

**BAD!**

```php
function __autoload($class)
{
  if (is_readable($class . '.php')) {
    require $class . '.php';
  }
  else {
    trigger_error("The class file was not found!", E_USER_ERROR);
  }
}
```
    
**You cannot do this if you want to successfully use SPL autoload!**  Remember, now its possible to add in more autoload functions.  Your surrounding framework code should be able to handle the error correctly if all the autoload functions fail to include the proper file.

Lets add to our example.

**`index.php`**
```php
class FW
{
  public static function autoload($class)
  {
    if (is_readable($_SERVER['DOCUMENT_ROOT'] . "/includes/{$class}.php")) {
      require $_SERVER['DOCUMENT_ROOT'] . "/includes/{$class}.php";
    }
  }

  public static function autoload2($class)
  {
    if (is_readable($_SERVER['DOCUMENT_ROOT'] . "/test/{$class}.php")) {
      require $_SERVER['DOCUMENT_ROOT'] . "/test/{$class}.php";
    }
  }
}

spl_autoload_register('FW::autoload');
spl_autoload_register('FW::autoload2');

new Test2();
```

**existing files:**

  * includes/Test.php

  * test/Test2.php

Now, our example will try to execute the first autoload function.  It will exit this function after finding a false answer for `is_readable`.  Then, according to our `spl_autoload_register` function, the `autoload2` function gets executed, finds the file and loads it.

### Unregister functions you don't need

The amazing function `spl_autoload_unregister()` is amazing.  Remember, the more autoload functions you have loaded, the longer it will take to find (or not find!) your file.  If there is only a specific block of code that requires an additional autoload functionality - add it - then remove it when done - so the script can continue.  The performance 'hit' for removing something from a stack is far less than invoking a function (and at least one other call like `is_readable()`).
