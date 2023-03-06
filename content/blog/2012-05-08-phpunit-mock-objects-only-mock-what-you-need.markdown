---
layout: post
title: 'PHPUnit Mock Objects: Only Mock What You Need'
tags:
- php
- phpunit
- testing
---
I was looking at mock objects in PHPUnit the other day and started to get confused.  When I asked for a `Mock` object, the entire object was a mock.  In all actuality, it wasn't so much a Mock of the object but a complete shell of it.  Each method needed to be defined.  So, if I was testing an object that required three methods to execute, I would have to mock each method.  (Yeah, some people would say that no single test should test more than one method, but that's just semantics.  Sometimes you have to start more grand in your testing instead of the perfect best way.  I was working on a legacy application and didn't have the ability to refactor at this time...).  Anyway, I created my mock in the normal way I knew of:

```php?start_inline=1
$myMock = $this->getMock('myObject');
```

Now, the entire object was an empty mock.  I had to define each one.  

**Define your methods to mock only, instead.**

Try this:

```php?start_inline=1
$myMock = $this->getMockBuilder('myObject')
               ->setMethods(array('onlyMethodToMock'))
               ->getMock();
```

Oh, and to make it easier, in PHP Unit 3.6, it's all built in as a second parameter of the `getMock()` call:

```php?start_inline=1
$myMock = $this->getMock('myObject', array('onlyMethodToMock'));
```

Sweet.
