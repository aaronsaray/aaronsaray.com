---
author: aaron
comments: true
date: 2012-09-25 15:41:41+00:00
layout: post
slug: the-point-of-custom-exceptions
title: The point of custom exceptions
wordpress_id: 1243
categories:
- PHP
- programming
---

I tend to want to use [PHP Exceptions](http://us.php.net/manual/en/language.exceptions.php) when I can.  But, I don't just leave them as is.  I tend to have a large custom exception library.  These exceptions extend the base Exception class in PHP - that's about it.

But why??

The primary reason I use all of these custom exceptions is to gracefully handle full-stop style errors with a bit more information for the user.  Imagine a scenario where most of your site works - except maybe an API with a third party.  If the user goes to that page, and the API fails, they may get an error 500 - and that could be very disconcerting for them.  Instead, what if you just disabled the features that required that API?  What if you wanted to let them know that something was happening - versus just saying "there was an error."  Or even better, what if you wanted to handle off cases of ID's not found (for example, if you edit an element in your DB via the ID, and the user puts in their own ID)... what if you didn't want to have to write verification code ahead of a proper retrieval - and instead when retrieval failed, just throw a record not found style exception?

Anyway, let's look at this in practice.

**Here is our custom exception.**  Maybe if our target api returns error 500, we throw this exception.  Doesn't mean our site is kaput - we just can't use this API.

    
    
    class API_500error_Exception extends exception {}
    



**and then...** here is our code

    
    
    $service = new API_Service();
    try {
      $service->connect();
      // .... more code here
    }
    catch (API_500error_Exception $a5e) {
      echo "Here is where I'd disable settings that use the API - but we can continue.";
    }
    catch (Exception $e) {
      echo "Unfortunately, there was an unknown error on this page.";
    }
    



Here, in this code example, we do a number of things with the service.  We put a try/catch around those things.  If its a known custom exception, we can do certain things, but allow the code to continue.  Note, if the exception does not match the custom exception, the parent of 'Exception' will finally be caught. (You could also put a custom exception handler in your code so you wouldn't have to define this condition.)

As you can see, there is nothing special about the exception itself - but since it is a specific type of exception, we can capture it effectively (I tend to think of when I use instanceof in my PHP code, this is a similar mindset).  
