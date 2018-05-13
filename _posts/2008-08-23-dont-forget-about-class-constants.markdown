---
layout: post
title: Don't forget about Class Constants!
tags:
- php
---
Constants can be great.  They can stand for things like web services keys, integers, flags, etc.  Basically, anything that you aren't going to be changing in your script - and most likely things that don't change much outside of the script either.  However, I've seen people use them in the global name space far too many times.  A great alternative is the class constant.  Lets check out some examples:

### The Bad Code

First off, I can't tell you how many times I've seen code like this:

```php?start_inline=1
define('MYCLASS_FLAG_ON', '1');
define('MYCLASS_FLAG_OFF', '0');

class MYCLASS
{
  public function __construct($var)
  {
    if ($var == MYCLASS_FLAG_ON) {
      print 'it is on';
    }
  }
}
```

Basically, you'll see that they are being smart and using constants for some specific flags.  However, they're cluttering the global namespace with constants that probably won't be used outside of the class (even if they ARE, we have a way to work around that.)

Now, lets take a look at the alternative.

### The Good Code

Lets use the class constant.

```php?start_inline=1
class MYCLASS
{
  const FLAG_ON = 1;
  const FLAG_OFF = 0;
    
  public function __construct($var)
  {
    if ($var == self::FLAG_ON) {
      print 'it is on';
    }
  }
}
```

Now, you'll see there is no congestion in the global name space.

### But what if you need that Constant's value?

The great thing about constants in classes in this specific example is that you can access them like static variables outside of the class.  For example:

```php?start_inline=1
$var = magicVarGettingFunction();
if ($var == MYCLASS::FLAG_ON) {
  print 'it is on';
}
```
    
