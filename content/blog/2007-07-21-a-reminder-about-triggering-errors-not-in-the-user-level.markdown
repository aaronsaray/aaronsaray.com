---
title: A reminder about triggering errors not in the USER level
date: 2007-07-21
tag:
- php
---
I had a function in some of my code that I wanted to trigger a notice error on certain occasions.  Unfortunately, it kept halting my script with a Warning instead.  Unfortunately, the error handler at that particular block of code was not properly capturing the error string.  It runs out that I was triggering an `E_NOTICE` instead of an `E_USER_NOTICE` error... (if I would have reviewed the [`trigger_error` manual page](http://us2.php.net/trigger_error), I wouldn't have made this mistake... silly, lazy developer).  Just to make sure that I fully understood this issue and hopefully wouldn't make the same mistake again, I made a quick proof of concept:

<!--more-->

From the comments on the manual page, I was able to grab a pre-made function that I stripped down.  It prints out the error type as well as the error string.  My test script also generates an error.

```php
function my_error_handler($errno, $errstr, $errfile, $errline) {
  switch($errno){
    case E_ERROR:             print "Error";                  break;
    case E_WARNING:           print "Warning";                break;
    case E_PARSE:             print "Parse Error";            break;
    case E_NOTICE:            print "Notice";                 break;
    case E_CORE_ERROR:        print "Core Error";             break;
    case E_CORE_WARNING:      print "Core Warning";           break;
    case E_COMPILE_ERROR:     print "Compile Error";          break;
    case E_COMPILE_WARNING:   print "Compile Warning";        break;
    case E_USER_ERROR:        print "User Error";             break;
    case E_USER_WARNING:      print "User Warning";           break;
    case E_USER_NOTICE:       print "User Notice";            break;
    case E_STRICT:            print "Strict Notice";          break;
    case E_RECOVERABLE_ERROR: print "Recoverable Error";      break;
    default:                  print "Unknown error ($errno)"; break;
  }
  print '<br />string: ' . $errstr;
}
 
set_error_handler('my_error_handler');
```

Now, when I do the following:

```php
trigger_error('test error', E_USER_NOTICE);
```

Our output is predictable:
    
    User Notice
    string: test error

However, I was forgetting to put the USER in that error:

```php
trigger_error('test error', E_NOTICE);
```

And my error:

    Warning
    string: Invalid error type specified

So just a reminder, you can only trigger errors in the USER class.
