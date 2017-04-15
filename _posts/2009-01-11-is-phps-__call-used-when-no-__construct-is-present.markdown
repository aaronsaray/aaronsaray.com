---
layout: post
title: Is PHP's __call() used when no __construct is present?
tags:
- PHP
---
Simple enough question.  Lets check out some test code:

```php?start_inline=1
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

BLANK.  __call is not called.

Now we can all sleep at night! whew!
