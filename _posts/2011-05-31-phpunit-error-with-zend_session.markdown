---
author: aaron
comments: true
date: 2011-05-31 23:10:40+00:00
layout: post
slug: phpunit-error-with-zend_session
title: PHPUnit error with Zend_Session
wordpress_id: 940
categories:
- phpunit
- zend framework
tags:
- phpunit
- zend framework
---

Running a test, I ran into this error:

    
    
    Zend_Session_Exception: Session must be started before any output has been sent to the browser; output started in /usr/share/php/PHPUnit/Util/Printer.php/173
    



In order to solve that, I added a line calling ob_start() to my test bootstrap file.  

However, there is a better way!!  

Instead, add the following line:

    
    
    Zend_Session::$_unitTestEnabled = true;
    



This works flawlessly.
