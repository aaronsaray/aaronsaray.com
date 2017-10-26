---
layout: post
title: Quick Snippet to Verify All Object Properties are Not Empty
tags:
- php
---
If you check out `array_filter` without a callback, you'll notice that it will basically check each array key to make sure it doesn't equal false.  If you have an object, you get call of the properties as an array using `get_object_vars`.  This quick snippet will allow you to look at an object and verify each property is non-false (or non-empty).

```php?start_inline=1
if (array_filter(get_object_vars($object)) == get_object_vars($object)) {
  // each property is non-empty
}
```

Simple and sometimes useful.