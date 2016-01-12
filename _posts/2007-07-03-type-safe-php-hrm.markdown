---
author: aaron
comments: true
date: 2007-07-03 00:42:53+00:00
layout: post
slug: type-safe-php-hrm
title: Type-Safe PHP? Hrm...
wordpress_id: 20
categories:
- PHP
tags:
- PHP
---

As you can probably remember, lately I've been writing about PHP's object handling, patterns, etc.  - but I lightly glossed over the whole forced typing of variables - and how that relates to PHP.  While looking for solutions to this, I came across a great blog entry that solves this issue - but I've gotta bring up some counter points... Finally, I'm also wondering: what are the real important needs for a strongly typed object?

<!-- more -->This most recent blog entry [here](http://jan.kneschke.de/2007/2/19/typesafe-objects-in-php) talks about type - safe variables in PHP.  A combination of reflection, documentation, and OO extension is used.  I would have to admit, I'm rather impressed by this entry - its a great way to solve that issue... that is, if it needed solving.

Now, I have to argue - part of **PHP's initial draw to beginning programmers** is the lack of forced typing of variables.  You can have a value of integer 3 and concatenate 'bananas' on to the end, and the variable then becomes a string with the literal string representation of the integer 3.  To **new programmers**, this is both amazing and cool - it helps reduce the number of syntax errors and provides for faster coding.

**The intermediate PHP programmer** starts noticing with his programming that sometimes PHP's interpretation, while predictable, causes issues to his code.  Imagine adding $myVar and $myVar2 when $myVar2 is false?  Perhaps false is an error condition, but it will be evaluated to the integer zero in that addition sequence.  So the intermediate programmer realizes he has to be more accurate with his programming - start checking for errors, etc - so that we don't run into this situation.  The easiest solution sometimes seems to be checking for == false or empty - but as we all know, that brings in a few small cases where that could be error prone (ie, the result is 0, which evaluates as false - use the identical operator instead ===).

**The advanced PHP programmer** has probably dabbled in other languages that require typing, and may long for it.  Instead of having to manually throw exceptions, he could be catching language generated exceptions (invalid value for this type of variable, etc) and generate less error checking code - because its already built in.  However, this process could lead to some untraceable errors - the point being that there is a specific sense of accuracy obtained when typed variables are used.

The blog entry I posted has a great solution for implementing these typed variables - but I can't help wonder if its 1) too much overhead and 2) a lazy escape (see advanced PHP programmer - number 1 reason for typed variables?).

**Too much overhead?**

Now for every object that you create, you must extend another object, loading in more non-native PHP core code.  Then, you need to define each variable's type in comments (which, while you SHOULD do this type of documentation, I tend to do mine towards the end of the project), and you need to create a reflection object.  Now imagine dealing with database results as objects, and each reflection instance and each extended class you'd have to initialize.  It just seems to me that its alot of overhead (with smart programming, you might be able to initialize just one object and possibly cycle through its values, however... thus lowering the amount of times you'd need to init a new reflection class).

**Lazy programmer?**

I also think that some of the reason people want an "accurate" typing of their variables is because they're too lazy to a) refactor their code and b) write proper tests (see equality sign vs. identical sign).  Its easier to write something like !empty() vs. $val !== false.

**Is there a reason to force type?**

So, I also admit - I could be making some vast generalizations here - discounting the validity of typed variables in PHP.  Does anyone have any reasons why this type of functionality might be more useful than the overhead it might take to implement with a homemade solution?
