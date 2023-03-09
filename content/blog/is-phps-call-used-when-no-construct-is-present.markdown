---
title: Is PHP's __call() Used When No __construct is Present?
date: 2009-01-11
tag:
- php
---
Simple enough question.  Let's check out some test code:

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

```txt
constructed with: hi
```

Ran without a constructor?

BLANK. `__call` is not called.

Now we can all sleep at night! whew!
