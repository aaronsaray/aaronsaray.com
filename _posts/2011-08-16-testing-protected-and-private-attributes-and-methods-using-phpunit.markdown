---
layout: post
title: Testing protected and private attributes and methods using PHPUnit
tags:
- phpunit
- Test Driven Development
---

_First, I just want to say up front that this is not a discussion of "is 100% test coverage necessary" or a discussion about testing private methods.  This is simply how you may do it if you wanted to._



#### Testing Protected/Private Attributes using PHPUnit


PHPUnit has this built in - simply use PHPUnit_Framework_Assert::readAttribute().  So, for example, lets say our object User has a protected role id of 1.

{% highlight PHP %}
<?php
public function testUserRoleIsOne()
{  
  $user = new User();
  $this->assertEquals(1, PHPUnit_Framework_Assert::readAttribute($user, '_roleId'));
}
{% endhighlight %}


#### Testing Protected/Private Methods in PHPUnit


This method is mainly reflection based.  The PHPUnit component is really only the testing. Lets say a protected method _getKey() of the User object returns a value of 'mysuperawesomekey'

{% highlight PHP %}
<?php
public function testRetrieveKeyFromUser()
{
    $user = new User();
    
    $reflectionOfUser = new ReflectionClass('User');
    $method = $reflectionOfUser->getMethod('_getKey');
    $method->setAccessible(true);
    
    $this->assertEquals('mysuperawesomekey', $method->invokeArgs($user, array()));
}
{% endhighlight %}
    



This code creates a new object of our object that we'd like to test.  Then, it creates a reflection of it and its method that we want to test.  Next it sets it to accessible.  Finally, in the assertion, the invokeArgs() method of a reflectionmethod is called using the object instance to call it.  The empty array() is because this method does not accept parameters.  If your method did, you would put them there.

In my code, I add a static method to handle most of the testing setup for protected/private methods to a helper class so I don't have to duplicate the above code.
