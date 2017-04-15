---
layout: post
title: PHPUnit error with Zend_Session
tags:
- phpunit
- zend framework
---
Running a test, I ran into this error:
    
    Zend_Session_Exception: Session must be started before any output has been sent to the browser; output started in /usr/share/php/PHPUnit/Util/Printer.php/173

In order to solve that, I added a line calling ob_start() to my test bootstrap file.  

However, there is a better way!!  

Instead, add the following line:
    
```php?start_inline=1
Zend_Session::$_unitTestEnabled = true;
```

This works flawlessly.
