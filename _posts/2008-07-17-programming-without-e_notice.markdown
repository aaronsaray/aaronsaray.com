---
layout: post
title: Programming without E_Notice
tags:
- PHP
---
[![#superdev boss](/uploads/2008/squirrel-150x109.jpg)](/uploads/2008/squirrel.jpg){: .thumbnail}

Well, my boss at #superdev - who can only be compared to a more energetic version of the squirrel from hoodwinked asked me to start putting together some thoughts here and there on some proper PHP coding.  I thought I'd start out the series with this article, Programming without E_NOTICE.

Ok.

### How does it happen?

E_NOTICE errors are generally generated when variables that haven't been declared are read.  But Aaron - why is this an error?  I thought PHP did not require you to define your variables a head of time?  Well, buddy, thanks for asking!  PHP does not require you to define your variables ahead of time - when you write to them.  However, it does suggest that you define them with some value before you read them.  One of the main reasons why this is important is the registered globals feature... "feature"... that PHP had prior to PHP6.

Image this code:

```php?start_inline=1
if ($admin) {
    print "super secret stuff";
}
?>
```

Well, every time you run this script, no super secret stuff will be printed.  However, if you have registered globals on, and then pass in a get variable, such as:

    http://localhost/test.php?admin=TRUE
    
you'll find that you just accessed a variable that was set to something you didn't really expect.

Anyways, that's the history of why this notice was generated.

Now, lets move on to the real meat:

### Uninstantiated Variables

Lets take a common decision tree:

_If my variable has been set to something, print something else.  If my admin variable has been set, print the admin menu._

I've seen code do this like this:

```php?start_inline=1
if ($isAdmin) {
    print "<div id='menu'>blahb lah blah</div>";
}
?>
```

Also, other times I've seen this:

```php?start_inline=1
if (!$normalUser) {
    print "<div id='menu'>blah blalhickity blah</div>";
}
?>
```

Both of these are bound to generate E_NOTICE errors if not used properly.  We'll use the first example.  Think about this:

Is there ever a case where $isAdmin won't be set?  You know that an unset variable will evaluate to false - but php will generate that E_NOTICE on you.

### How to fix this?

There are two ways that you can fix this type of error:

**First, predefine every variable to a blank or null** before you could even use it.  This is especially good for those who still have registered globals on.

```php?start_inline=1

/** top of script **/
$isAdmin = FALSE;

/** some function that may or may not actually define $isAdmin to true or false **/
areTheyAdmin();

if ($isAdmin) {
    /** continues **/
```

Other suitable predefined values include: '', NULL, 0, array().

[![false positive](/uploads/2008/false_pos-150x100.jpg)](/uploads/2008/false_pos.jpg){: .thumbnail}

_One Caveat:_ Be careful with predefining your values, however, so that you don't use a legitimate value when not expecting it.  For example, if you assigned $locationOfString = 0 and then did a stristr(), you could legitimately get a 0 returned.  This might cause issues with your code that might be difficult to track down-such as false positives.

_If you're really lazy and don't like spending all those extra lines, here's a tip:_

```php?start_inline=1
$a = '';
$b = '';
$c = '';
```

**OR**

```php?start_inline=1
$a = $b = $c = '';
```

**The second style: using isset().**

Isset will return whether the variable is set to any value or not.  If it is not, it returns false, and then your if statement exits right away.  No calculation is done on an unset variable.  Example:

```php?start_inline=1
areTheyAdmin();

if (isset($isAdmin) && $isAdmin) {
    /** continue some stuff here for admin dude **/
```

### What else does this affect?

This also affects array keys that are unset.  You can view array keys the exact same as variables - you shouldn't read from an unset one - but you can write to one that doesn't exist yet.

```php?start_inline=1

$myArray = array('something'=>"another");

/** bad boy **/
if ($myArray['kakaw']) {
    print "word";
}

/** good to go boy **/
$myArray['chunky'] = 'soup';
```

As with variables, you should use isset().  I would caution against using array_key_exists().  Isset is a language construct whereas array_key_exists() is not - so isset is immensely faster.  The only time you might want to use array_key_exists is when you have an array of keys.  Otherwise, isset() supports everything you need.

_Bonus!_  In that previous example, to write to the chunky key, you don't even have to define $myArray.  In this example, $arrayKaBob is defined into an array automatically, and then the key is set:

```php?start_inline=1
$arrayKaBob['key master'] = 'gate keeper';
```

### Well what if I just use the @?

Don't.  Seriously.  Look <a href="/2007/07/27/the-perils-of-the-at-in-php/">here</a>.

### Wrapping it Up

Ok - so that about wraps it up - any comments are welcome. :)