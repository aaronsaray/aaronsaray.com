---
title: How to Log PHP Errors like a Pro
date: 2010-05-25
tags:
- php
---
The error log can be fun to parse through and figure out what happened.  Ok, so if you just read that and agreed, you need to move on.  This is not for you.  That's not fun.  However, you CAN make error gathering easier on yourself by including the right information in the error log.  To top it off, you can present your users with something that is a bit more 'friendly' than the standard error display or blank page.  Let's check it out.

<!--more-->

### Create an Error Handling Class

All of my error handling is going to be pretty much uniform.  In order to do this, I want to share a lot of code.  I'm going to do this by creating a class and having my error handling methods a part of it.  I plan on gathering data from both standard PHP errors and uncaught PHP Exceptions.

#### First, PHP Errors

The first thing I want to do is grab my PHP errors.  I'll make the following code:

```php
class errorhandlers
{
  public static function error_handler($errno, $errstr, $errfile, $errline, $errcontext)
  {
    $string = "ErrorNo: {$errno}:: {$errstr} || {$errfile} on {$errline} || ";
    ob_start();
    var_dump($errcontext);
    debug_print_backtrace();
    $string .= ob_get_clean();

    if (ENVIRONMENT == 'DEV') {
      print $string;
    }
    else {
       error_log($string);
    }

    switch ($errno) {
      case E_NOTICE:
      case E_USER_NOTICE:
        //do nothing
        break;

      default:
        self::beFriendly();
        break;
    }
  }

  protected static function beFriendly()
  {
    /**
     * kind of hacky
     */
    if (ENVIRONMENT != 'DEV') {
      die(header("Location: /error"));
    }
  }
}
```

The first thing that is done is to grab all of the error context that PHP sends to the error handler.  That is what the 5 parameters are for.  I begin by making a string with this information in it.  The last parameter is actually an array, so I use `var_dump()`.  Before that, however, the output buffering is initiated.  Then, the context is `var_dump()`'d.  Finally, to get a little bit more context, the command `debug_print_backtrace()` is used.  The contents of this output buffer is then added to the string.

The reason I am using `ob_start()` and not using the parameters / functions to return the data is because of a recursion issue that can happen with `var_export()`/`var_dump()` in certain contexts.  I'm not sure what happened, but it was an infinite type of recursion - so I chose this method.

The final two steps of that method are pretty straight forward.  If we are working in our development environment, print the error information to the screen.  Otherwise, log it to the standard error log.  (This is better than using `ini_set()` with display errors because of the extra context I'm adding with the `debug_print_backtrace()`).  Finally, if not a `NOTICE` type error, call the `beFriendly()` static protected method.

The `beFriendly()` method simply redirects a user to a friendlier "ruh roh" type page if we're not in the development environment.

#### Do something with uncaught exceptions

To handle exceptions, the following method is added to the class:

```php
public static function exception_handler($exception)
{
  $string = str_replace("\n", ' ', var_export($exception, TRUE));

  if (ENVIRONMENT == 'DEV') {
    print $string;
  }
  else {
    error_log($string);
  }

  self::beFriendly();
}
```

This is much more simple.  The exception details are exported to a string.  The new lines are removed because they play havoc with the error log grep'ing.  Then, as with the previous method, it is either displayed or logged and then the user is redirected possibly.

#### Register the Error Handlers

The last thing to do is to register each of these error handlers.  That is done with this simple code:

```php
set_error_handler(array('errorhandlers', 'error_handler'));
set_exception_handler(array('errorhandlers', 'exception_handler'));
```

And then, you're ready to go.  Happy error logging!
