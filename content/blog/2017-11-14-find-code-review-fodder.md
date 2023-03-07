---
title: How to Find Sections of Code to Review
date: 2017-11-14
tags:
- programming
---
I'm a huge fan of code review and code walkthroughs.  I've been [asked before what I look for while reviewing code]({{< ref "/blog/2012-10-18-what-i-look-for-in-a-code-review" >}}) but I don't know if I've ever addressed ways to pick out what code to actually review.

<!--more-->

Your code base might be huge - so how do you know what to review?  You might periodically review code or do a pull-request-review process, but how do you know what to focus on or zero in on?  I've got a few tips.

**Spelling Mistakes** 

Spelling mistakes are a pet peeve of mine (please don't spell-check my blog... I mean, I tryyyyy).  But, a spelling mistake in a variable name or a spelling mistake in a comment is a key indicator that this section may require some review.  A spelling mistake tells me that the person got sloppy here - maybe they were not paying attention, maybe they were hurrying.  There are a lot of tools that can help catch this; this should not happen.  I've been known to say "if you can't speak and spell your own primary language, it lowers my faith in you using your second language (programming)"

**Code Not Formatted Correctly**

Extra line breaks, spacing mistakes and weird indentations usually indicate a lack of attention to detail or copy/pasting and moving things around.  More often than not, if the spacing is off and weird, it is because something was either duplicated, moved around, or automatically generated.  This tells me that this area is ripe for problems - when we copy and paste, and just change little things - or let the IDE generate code for us, there are a lot of times when it's not exactly right.

**Very Short Variable Names**

Unless you're using a temporary variable for an index of a loop, generally short variables mean something could be out of whack.  When variables are less expressive, it can be easy to use them incorrectly.  What if you meant to refer to `$pb1` and instead you assigned something to `$plb` - that's something that is very easy to do once you get tired, after a long day.  If you're using stuff like `$temp`, it probably indicates you're storing a value temporarily - and there might be a more efficient way to do this whole process.

**TODO**

This is pretty self explanatory.  If there is a `todo`, I'm going to look at that code, around that code, and ask questions.  Maybe the todo is an indicator that something else needs to be done in the future - but it also tips me off that this part of code is partially done.  Sometimes when something is in the form of a todo, other things are also missing - but undocumented or missed accidentally.

**Longer Methods / Code Blocks**

The longer a section of code becomes, (a method, a block of code) - the more likely it's doing something more complicated and can have bugs.  Smaller bits of code are easier for the programmer to comprehend - and compartmentalize.  When they get too large, its hard to follow along which introduces potential for problems.

**Complexity Tools**

If the code base is really looking good and the common things are not catching my eye, I might run something like [PHP Metrics](http://phpmetrics.org) on the code to find complex methods.  The complexity report might indicate a method or place in the code that is a good idea to review.

**Gut Feeling**

This is a horrible thing to say - but I use it.  Sometimes I'm scrolling through code or I'm listening to someone explain how code works, and something "feels wrong."  It could just be something subconscious in the code - or it could be the way that the programmer described it in the walkthrough (their tone changed, they sound exasperated, frustrated, or very proud).  Sometimes things that someone says are extremely clever are ready to be reviewed, too.  Too clever of code can be an indicator that there will be a future problem (either in unknown future cases - or - the dreaded other programmers can't understand/follow it problem). 