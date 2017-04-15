---
layout: post
title: PHP Command Line Shell Experiments
tags:
- PHP
---

Having been a shell, perl and batch scripter before I started PHP, I've always enjoyed the CLI life.  I actually created an interactive or script-able interface for creating all of my projects at ("the triangle") - hopefully I'll link to it here when I write it up.

I wanted to experiment with PHP's Interactive command line interface a little bit more - anyone can write a script that reads in STDIN and the like, but is there any use in having an interactive CL environment?  I tried out PHP's standard interactive, plus two additional php packages.

**What are our test cases?**

We're going to execute three test scenarios in PHP to test out each of these shells.

The first one:

```php?start_inline=1
phpinfo ();
```

The Second:

```php?start_inline=1
$a = 'test';
echo $a;
```

And the third one is going to be a class creation, followed by var_dump()ing it out to the display.  Our file -- test.php:

```php?start_inline=1
class TEST
{
    protected $_val = 'test';

    public function __construct()
    {
        $this->_val='constructor';
    }
}
```

And we're going to execute the following:

```php?start_inline=1
include 'test.php';
$a = new TEST();
var_dump($a);
```

**First off, What does Plain Ol' PHP offer me?**

On Windows?  Hrm... lets see.  I've been looking over the [PHP manual page for command line](http://us.php.net/manual/en/features.commandline.php) options and decided to run php interactively:
    
    c:\php -a

This test failed on all accounts - by that I mean - there was no display what so ever... so I scoured the manual pages - and found out that sometimes on windowsxp you need to execute a "-n" as well. (while this doesn't make any sense, I was willing to try it.)

Nope.  Didn't work either.  There was just no output what so ever - no error, no nothing.  I finally had to do ctrl-c to exit the interactive interpreter.

**~jk php shell**

[This project](http://jan.kneschke.de/projects/php-shell) seemed to have alot of potential.  Its an interactive command line interface that allows tab completion, (we should remember that I'm working on windows - which doesn't have support for the readline extension in PHP - which is required for tab completion - Dang!!), verbose output, and more! (Sounds salesy right?).  Anyway, lets do the three tests.

They all passed with flying colors.  The more interesting thing is the verbose output.  For example, when we created our new class instance, it dumps (var_dump()s?) the internals to the screen as they would be AFTER construction... see so:

    
    >> include 'test.php';
    
    >> $a = new TEST();
    TEST::__set_state(array(
       '_val' => 'constructor',
    ))

There was an issue, however.  When you create a request that throws a fatal error, you're doen for... The shell exits:
    
    >> $a->_val = 'blah';
    
    Fatal error: Cannot access protected property TEST::$_val in C:\php5.2\PEAR\php-shell-cmd.php(121) : eval()'d code on line 1
    
    C:\DEVELO~1\temp>

This sucks because it may take you a few commands to get to your specific location - and then if you do something wrong (or if you're troubleshooting), you're kicked out - and have to start again.  It seems to me that we should be able to trap those errors (at the very least, not exit the shell... restart it at the VERY LEAST).

**PHP Interactive **

Finally, lets check out this [tabbed, interactive shell simulator](http://www.hping.org/phpinteractive/).  This tool is a shell emulator - its not necessarily ran from the shell.  You can open up multiple tabs and execute your commands.

All three tests succeeded - but there were some side affects.  Every time we executed a command, the actual script itself was written to a folder inside of this distribution called 'scripts'.  So for each command I ran, depending on the names at the bottom of the window.  I didn't like this that much... but I could deal.

I did like the fact that you could get the 'raw' output or the 'html' output at the bottom - the part that sucks about that is that it appears that the script is ran again - it seems that we should run it only once - and then cache the results.

Finally, all 2.0ish and junk, we can create multiple tabs to execute multiple commands (see bad point: we make a new file for each tab execution).  I wish that it could share the php environment between tabs, however.  Each one really is its own instance.

**Oh, and I skipped one**

[This shell](http://david.acz.org/phpa/) I skipped - it said it required readline to execute - as well as it looked very similar to the first shell...

**What is the best way?**

Well, I guess I'd have to settle on the ~jk php shell.  It was very verbose - and its limited bad points aren't that significant compared to the way it enhances the shell.  I'm not entirely happy with any of the solutions - which is ok - because I don't write that many CLI apps anyway.
