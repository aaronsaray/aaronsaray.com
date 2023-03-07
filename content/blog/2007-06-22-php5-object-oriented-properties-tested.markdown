---
title: PHP5 Object Oriented Properties - Tested!
date: 2007-06-22
tag:
- php
---
I was recently reading an article (while researching for my website monitoring project), and there was a comment about PHP5's lack of flexibility in its Object Oriented usage.  Some people were arguing for it - and some against, the typical ranting that goes on in blog comments, etc.  Instead of joining the argument, I wanted to do my proof of concepts myself.  I'm going to explore (well I already know some of the answers - but it'll be exploration to YOU reader ;)) public/private constructors, magic methods, and maybe a few extras (we'll see when we get to the end!)

<!--more-->

_I'm using PHP 5.2.0 on Windows XP for these tests._

### var_dump() will be our friend

We're going to use `var_dump()` to demonstrate all of our properties - its the best printable version of testing I've found so far.

So without further rambling, lets get started with ... private constructors

### Our first code example.  Lets create a proper singleton pattern.

While the term 'proper' is debatable, the most improper solution is NOT to make a non-existent or empty constructor.   Instead, lets make it protected.  We know that a protected method cannot be ran outside of the class context (hint hint ;)) but it can be extended by a child class.  (Note: I rarely ever use private variables anymore.  There are instances, but most often, it appears to be sufficient to allow the variables to be private.  -- once again debatable).  Here's our example:

```php
class classTest {
  protected static $_self = null;

  protected $_myVar = 'initial value';

  protected function __construct()
  {
    $this->_myVar = 'I have been constructed at: ' . date('r');
  }

  public function getInstance()
  {
    if (!(self::$_self instanceof self)) {
      self::$_self = new self();
    }

    return self::$_self;
  }
}
```

A quick explanation: In the future examples, we're going to set `$_myVar`, a protected var, to show our progress and as a good reference to what happened.  In this first example, we have a protected constructor and a singleton pattern `getInstance` function - a public static function that will return a new instance of `self`.

Lets run this code:

```php
$myClassTest = new classTest();
```

Error:

    **Fatal error**:  Call to protected classTest::__construct() from invalid context in **C:\DEVELOPMENT\temp\methodtest.php** on line **22**

Ok great - this means that we can't run this construct - we can't create a new `classTest` from outside of the class - this is awesome.  This stops us from making new instances - so we'll moving to our singleton.  Our constructor can still be called on allowed class creation.  The reason this is important is that could reduce your code refactoring.  Say, for example, you wish to refactor your base database class to be singleton, but the connection is created in the constructor, its a small change - create a singleton instance method, and make the constructor non-public.

Let's move on.  How do we get the same instance of this class?  And let's make sure it ran?  Finally, lets make sure that we're really singleton-y?  Well, lets call an instance of the class, var dump it, sleep a bit, and call it again.  To prove it, our first call should dump our protected variable with a timestamp when it was constructed.  The second call should give the exact message...

```php
$myClassTest = classTest::getInstance();
var_dump($myClassTest);
sleep(5);
$newMyClassTest = classTest::getInstance();
var_dump($newMyClassTest);
```

Our output?

    object(classTest)#1 (1) { ["_myVar:protected"]=>  string(59) "I have been constructed at: Thu, 21 Jun 2007 19:00:17 -0500" }
    
    object(classTest)#1 (1) { ["_myVar:protected"]=> string(59) "I have been constructed at: Thu, 21 Jun 2007 19:00:17 -0500" }

This proves that our singleton method works.  Yay!.

Let's move on to another one of the common complaints...

### Are the overload methods of a class, the getters and setters, for example, able to be modified in their scope?

Let's start out with a basic example of overloading a class.  Our `__get()` method will allow us to get any value our method allows us to by referring to it as a public object attribute, and `__set()` will allow... well the opposite.

```php
class classTest
{
  protected $_protectedVars = array();

  public function __construct()
  {
    $this->_protectedVars['constructMessage'] = 'I have been constructed at: ' 
                                              . date('r');
  }

  public function __get($item)
  {
    if (isset($this->_protectedVars[$item])) {
      return $this->_protectedVars[$item];
    }
    else {
      throw new exception ("Don't be silly, [{$this}] is not in the protected vars");
    }
  }
    
  public function __set($item, $value)
  {
    $this->_protectedVars[$item] = $value;
  }
}
```

Lets verify that this will work:

```php
$myClassTest = new classTest();
var_dump($myClassTest);
print "<br></br>";
print $myClassTest->constructMessage;
$myClassTest->newMessage = 'yay!';
var_dump($myClassTest);
```

It seems to me that we should make a new instance of the class, see the protected array with one key `constructMessage`.  Then, we can refer to the key, because of the 'magic' of our method `__get()`, and print it.  Finally, our super magic method will allow us to set that protected variable through the class.  Standard overloading.  Lets see what happens.

Output:

    object(classTest)#1 (1) { ["_protectedVars:protected"]=>  array(1) { ["constructMessage"]=>  string(59) "I have been constructed at: Thu, 21 Jun 2007 19:17:21 -0500" } }

I have been constructed at: Thu, 21 Jun 2007 19:17:21 -0500

    object(classTest)#1 (1) { ["_protectedVars:protected"]=> array(2) { ["constructMessage"]=> string(59) "I have been constructed at: Thu, 21 Jun 2007 19:17:21 -0500" ["newMessage"]=> string(4) "yay!" } }

Yes - it worked!  Thank you 'magic overloading' - but this isn't the question.  The question is, can we have public getters, but not public setters.

I changed the function...

```php
private function __set($item, $value)
{
  $this->_protectedVars[$item] = $value;
}
```

_But the output was the same!!_

Then, I got to thinking... is PHP maybe erroring out - and not telling me?  Could it be that the magic method is private, its erroring out silently, but maybe still assigning the public attribute anyway?  (um der... in hindsight, it was the EXACT same output - in order for my next example to have been happening, the output would be different because it would be assigned as a public attribute, not a key to a protected variable)  Anyways, lets think about what PHP does here:

```php
$o = (object) null;
$o->test = 'blah';
var_dump($o);
```

Our output is:

    object(stdClass)#1 (1) { ["test"]=>  string(4) "blah" }

So we know, without having attributes defined, we can still assign them publicly.  So, maybe that's what my class is doing?  (see der note... this is all pointless right now - but I'm on a roll!!!)

Let's put a very dirty hack in - and print out to the screen when the `__set()` method is called.

```php
private function __set($item, $value)
{
  print "set was called";
  $this->_protectedVars[$item] = $value;
}
```

And, our output?

    object(classTest)#1 (1) { ["_protectedVars:protected"]=>  array(1) { ["constructMessage"]=>  string(59) "I have been constructed at: Thu, 21 Jun 2007 19:29:32 -0500" } }
    
    I have been constructed at: Thu, 21 Jun 2007 19:29:32 -0500
    
    set was called
    
    object(classTest)#1 (1) { ["_protectedVars:protected"]=> array(2) { ["constructMessage"]=> string(59) "I have been constructed at: Thu, 21 Jun 2007 19:29:32 -0500" ["newMessage"]=> string(4) "yay!" } }

_So that proves, even though our setter was private, we can still call it! grrr._

Well, then the question becomes... can we hack together this functionality?  YES!  Should we ... um... well.. eh....

So, our objective is not to allow the setter to be executed unless we've extended the class and have an instance of the extended class (um... not exactly our solution, YET, but lets work on it...  If you see our example, this allows us to invoke the setter still 'publicly' - just not directly yet)

Let's replace `__set()` with this version (note: we're still gonna make it 'protected' - not so much because it matters but maybe to give a hint on the scope of this method)

```php
protected function __set($item, $value)
{
  if (get_parent_class($this)) {
    $this->_protectedVars[$item] = $value;
  }
  else {
    throw new exception("We can't set this because you're not extending it!");
  }
}
```

And our test call:

```php
$myClassTest = new classTest();
$myClassTest->newMessage = 'yay!';
var_dump($myClassTest);
```

Results in:

    **Fatal error**: Uncaught exception 'Exception' with message 'We can't set this because you're not extending it!' in C:\DEVELOPMENT\temp\methodtest.php:32 Stack trace: #0 C:\DEVELOPMENT\temp\methodtest.php(46): classTest->__set('newMessage', 'yay!') #1 {main} thrown in **C:\DEVELOPMENT\temp\methodtest.php** on line **32**

Well, lets add on our extended class, and change our code that we're invoking:

```php
class extenderClassTest extends classTest
{
  public function __construct()
  {
    $this->_protectedVars['constructMessage'] = 'This was made from the extender';
  }
}

$myClassTest = new extenderClassTest();
$myClassTest->newMessage = 'yay!';
var_dump($myClassTest);
```

And the result is:

    object(extenderClassTest)#1 (1) { ["_protectedVars:protected"]=>  array(2) { ["constructMessage"]=>  string(31) "This was made from the extender" ["newMessage"]=>  string(4) "yay!" } }

_Yay!_

So we can restrict that... lets see if its possible to restrict this to only extending classes can call this setter internally, but not from a public instance.

_Update:  I still haven't figured out a way to do this... I am open to comments!_

### Can we use overloading methods to pass by reference, and get rid of the __set() method?

To be honest, I haven't seen this in many conversations, but I was curious.

Let's focus on this code of `classTest`:

```php
public function __get($item)
{
  if (isset($this->_protectedVars[$item])) {
    return $this->_protectedVars[$item];
  }
  else {
    throw new exception ("Don't be silly, [{$this}] is not in the protected vars");
  }
}
```

I first tried putting the reference character (ampersand) in front of the `$this`... syntax error.  In front of the `_protectedVars` - still no dice - syntax error.  Next, try putting an ampersand in front of __get(... nopers - no errors but doesn't work.  Lets check out our assignment code:

```php
$myItem = $myClassTest->constructMessage;
```

What about putting the ampersand after the `=`?  Then you get this error!

    **Notice:** Indirect modification of overloaded property classTest::$constructMessage has no effect in **C:\DEVELOPMENT\temp\methodtest.php **on line **30**

It looks like there is no escaping the `__set()` magic method...

### Well, it seems that the OO model isn't perfect... 

There is some work to be done - but its going good so far.  Stay tuned for future OOP PHP  tutorials (or POOP - PHP Object Oriented Programming) tutorials ;)

_Update: for more info, check [here](http://www.php.net/manual/en/language.oop5.overloading.php#46125)._
