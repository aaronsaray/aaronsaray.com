---
layout: post
title: The Perils of the AT in PHP
tags:
- performance
- PHP
---
A lot of weird things have been happening ever since we introduced a new error handler at ("the triangle").  First of all, it took down our whole site for a good portion of time (oops!), then it created a large project for us to review our code.  Turns out a lot of the errors were just weird little things that we ignored.  However, there were a few times where the @ operator (http://us3.php.net/manual/en/language.operators.errorcontrol.php) was a huge problem.  I, for once, don't think that the @ operator should ever be used again.  Let me detail out what it does and why I don't think we should use it:

**What does the @ do?**

For most PHPers, they will answer with: "it suppresses the error on that statement."  This isn't entirely true.  It actually internally changes the error_reporting() value at that one statement.  Now, that one statement could also include many statements, if the statement is @require 'myfile.php'... (all actions that happen as that file parses will have error reporting turned off).

**Why is the @ harmful to performance**

When I went to ZendCon 2006, I heard a talk about performance (I forget who it was now! :( ) - but they explained how the @ works.  Basically, think of every time you execute a @'d statement, this is what happens internally:

```php?start_inline=1
@print 'hello';
```

is really something like...

```php?start_inline=1
$errorReporting = error_reporting();
error_reporting(0);
print 'hello';
error_reporting($errorReporting);
unset($errorReporting);
```
    
As you can see, even tho the internals of PHP are fast, that's a needless set of statements to call.

**When does the @ not function as expected?**

When you define a custom error handler, the @ doesn't stop the error reporting.  Instead, it sets error_reporting() to 0, but still executes the custom error handler.  Of course, you can still facilitate the @ sign in your custom error handler by doing as so:

```php?start_inline=1
if (error_reporting() === 0) {
    return false;
}
```
    
What this does is exits the error handler right away (not so good - what if this was a fatal error?? - you're now allowing the script to continue) and at least populates the $php_errmsg variable (return false allows this to happen).

**How to not code with the @:**

I can't think of a legitimate, quality use for calling functions with the @.  Notice I qualified that with 'quality'.  You can create code and use it to cut corners, but really, you're just creating crappy code.  Lets go over a few common usages of the @, and how you could code without using it again.

Require
Bad:

```php?start_inline=1
@require('myfile.php') or die('file was not included');
```
    
Better:

```php?start_inline=1
if (file_exists('myfile.php')) {
    require('myfile.php');
}
else {
    trigger_error('Could not include myfile.php', E_USER_ERROR);
}
```
    
Of course, make sure to read all about the caveats of [file_exists](http://us3.php.net/manual/en/function.is-readable.php).

Undeclared Variable Manipulation
Bad:

```php?start_inline=1
$value = @$myarray[0];
if ($value) {
    print 'do something';
}
```

Better:

```php?start_inline=1
$value = null;
if (isset($myarray[0])) {
    $value = $myarray[0];
}
if ($value) {
    print 'do something';
}
```
    
