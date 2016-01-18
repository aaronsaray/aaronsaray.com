---
layout: post
title: When is a PHP array not an array?
tags:
- PHP
---

Arrays, return variables, expressions, OH MY!  I recently learned a lesson about array functions in PHP not returning what I thought they would.  I had a function that returned the value of array_shift()... and then used it in another function.  Unfortunately, this generated a strict error and was causing some issues... As usual, I put together a proof of concept.  Lets check out the code example, the error, and then why:

{% highlight PHP %}
<?php
class TEST
{
    private $__data = '';
 
    public function __construct()
    {
        $this->__data = 'one,two,three';
    }
 
    public function getArray()
    {
        $a = array();
 
        $a[] = explode(',', $this->__data);
        $a[] = explode(',', $this->__data);
        $a[] = explode(',', $this->__data);
 
        return $a;
    }
}
 
function testFunction()
{
    $test = new TEST();
 
    return array_shift($test->getArray());
}
 
var_dump(testFunction());
{% endhighlight %}

When I execute this, I get a strict error:

**Strict Standards:** Only variables should be passed by reference in C:\DEVELOPMENT\temp\arraytest.php on line 27
array(3) { [0]=> string(3) "one" [1]=> string(3) "two" [2]=> string(5) "three" }

After talking with one of the consultants that ("the triangle") uses, he sent me a note about all the things he found in regards to my test code.

First off, [this bug page](http://bugs.php.net/bug.php?id=33466) is from another developer that was running into the same issues as I was.  After some back and forth, it looks like its just a mis-understanding ... those functions are returning array pointers and not values and expressions (see [expressions in PHP manual here](http://us.php.net/language.expressions)).

Turns out that the way to fix this issue is going to be using [pass by reference](http://us.php.net/language.references.pass).  One quick modification and we're good:

{% highlight PHP %}
<?php
public function &getArray()
{% endhighlight %}
