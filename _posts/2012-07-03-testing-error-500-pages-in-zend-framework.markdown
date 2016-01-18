---
layout: post
title: Testing Error 500 Pages in Zend Framework
tags:
- phpunit
- testing
- zend framework
---

For the most part, ZF can capture any of your hard errors.  It will generate an error 500.  You've seen them, don't lie... I've seen them way too many times.  However, in my production application, I capture these with a specific controller.  And because I love Unit Testing, I want to make sure that I test my implementation of my omg-this-is-broken setup.

Well, if we generate an error that would make a FATAL or 500 error in our test unit suite, something bad will happen.  However, you can still trigger the **exception** that is triggered during normal operation to test your controller.  My error controller is default/error/error and has a h1 of Error 500.  This is how I test that controller:

{% highlight PHP %}
<?php
class Application_Test_Default_Controller_ErrorController extends Zend_Test_PHPUnit_ControllerTestCase
{
  // ...
    $response = $this->getResponse();
    $response->setException(new Zend_Controller_Exception('testing application error', 500));
    $this->dispatch('/');
    $this->assertController('error');
    $this->assertAction('error');
    $this->assertQueryContentContains('//h1', 'Error 500');
  // ...
{% endhighlight %}


It grabs the response item that is part of the Zend_Test extension of PHPUnit.  Next, set the error that would be thrown.  Finally, dispatch any page.  Instead of that page, the front controller plugin that is the default error handler should grab it and redirect it to the error page.  
