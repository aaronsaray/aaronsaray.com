---
title: In PHP, False is Sometimes True
date: 2017-05-23
tag:
- php
---
Sometimes it's the little things that get you.  This is more of just a reminder than anything else.  One of the fun quirks (and I hesitate to call it a quirk because it's technically working as defined) in PHP.

<!--more-->

```php
$flag = "false";
assert((bool) $flag === true);
```

The result here is `true` - why does this matter?  Because of some sloppy programming, I had some code that was trying to use the value of some flag that was passed in from a JSON post request.  Because I knew it was a string, I was casting it to a boolean.  Of course this worked when the value was `"true"` but it wasn't until a weird bug later that I noticed that it was casting `"false"` as true as well.  It does this because it validate that the string is non-empty, not the content of the actual string.  Doh!
