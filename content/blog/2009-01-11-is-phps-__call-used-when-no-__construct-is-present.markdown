---
title: Is PHP's __call() used when no __construct is present?
date: 2009-01-11
tags:
- php
---
Simple enough question.  Lets check out some test code:

<!--more-->

```php
class TEST
{
  public function __construct($arguments)
  {
    print "constructed with: {$arguments}";
  }
 
  public function __call($name, $arguments)
  {
    print "called {$name} with: {$arguments}";
  }
}
 
new TEST('hi');
```

Ran the first time, the output was:

    constructed with: hi

Ran without a constructor?

BLANK. `__call` is not called.

Now we can all sleep at night! whew!
