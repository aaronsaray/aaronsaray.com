---
title: Anonymous Self-Executing Functions in JavaScript and PHP
date: 2017-11-14
tags:
- php
- javascript
---
I've used the anonymous self-executing paradigm a few times in JavaScript over the years.  Something like this:

<!--more-->

```javascript
(function() {
  console.log('So running. Much anonymous.');
})();
```

Then I started thinking - can I do the same thing in PHP (not a question of should, a question of can!)  Turns out, you can still do it - just a different method of self-execution is required:

```php
<?php
call_user_func(function() {
  print "Oy - even PHP!";
});
```

That's it for today!