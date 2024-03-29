---
title: array_merge is Useful - But With a Caveat
date: 2008-10-07
tag:
- php
---
So, the other day, I saw a horrible thing.  I saw two PHP associative arrays that needed to be combined into one, and the worst example of NOT using PHP's built in functions to combine them.  They weren't using [`array_merge`](http://php.net/array_merge) - instead they were looping through each value.

<!--more-->

That's what I thought until I did some testing.  There is a legitimate difference in the looping method vs the `array_merge` method.  This could be by design in your application, so don't get over-eager optimizing.  Let's take a look:

**Example Arrays**

```php
$ar1 = array('a'=>'ay', 'b'=>'bee', 'c'=>'see');
$ar2 = array('d'=>'dee', 'e'=>'ee', 'f'=>'ef');
```

Well, first off, let's try my way - with array_merge:

```php
$ar2 = array_merge($ar1, $ar2);
var_dump($ar2);
```

Output:

```txt
array(6) { ["a"]=>  string(2) "ay" ["b"]=>  string(3) "bee"
["c"]=>  string(3) "see" ["d"]=>  string(3) "dee"
["e"]=>  string(2) "ee" ["f"]=>  string(2) "ef" }
```

Ok - decent.  Now let's try it their way:

```php
foreach ($ar1 as $k=>$v) {
  $ar2[$k]=$v;
}
var_dump($ar2);
```

Output: 

```txt
array(6) { ["d"]=>  string(3) "dee" ["e"]=>  string(2) "ee"
["f"]=>  string(2) "ef" ["a"]=>  string(2) "ay"
["b"]=>  string(3) "bee" ["c"]=>  string(3) "see" }
```

**The array is in a different order.**

_Special Thanks to Sjan and James for commenting on my original version of this story and explaining that I was totally running in circles!_
