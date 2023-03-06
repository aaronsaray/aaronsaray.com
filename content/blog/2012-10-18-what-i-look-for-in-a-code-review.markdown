---
layout: post
title: What I look for in a code review
tags:
- business
- programming
---
A few days (ok, a bunch of days) ago, [someone](https://twitter.com/mathewpeterson) asked me on twitter what I look for when I do a code review.  Pretty certain I was tweeting that I was either... a) doing a code review or b) annoyed at doing a code review. heh.  I thought for a bit, and I think I've distilled the list of things I look for.  Now, mind you, I don't set out with my checkbox list or a manual, I just look at the code and "feel" it.  Yes, that sounds crazy.  I understand.  But, subconsciously, I think I'm doing the following things when I do code reviews:

### Quality

First of all, I'm looking for bugs.  You'd be surprised of the number of submissions to revision control I've seen with PHP or Javascript errors in them.  I always suggest using a lint tool before committing your changes (or uploading them via FTP, or whatever you happen to use to deploy code).  I've written about PHP Lint before - and don't forget our friend [JSLint](http://jslint.com).

Quality also comes from sticking to a set of coding standards.  In my projects, we have a coding standard that we stick with (it's a combination of PEAR and Zend Framework - but either of those really works).  If the code strays from this too much, I will bring it up.  (Please don't confuse 'sticking to standards' as architecture - I'll chat about that later.)

### Architecture

I also pay special attention to architecture.  Of course, it depends on the level of programmer who created the code you're looking at, but there should always be some semblance of an architectural pattern throughout the code block.  In cases where things look haphazard, or like "and me!" or "add on!", I'm going to bring that up.  In my team work, architectural decisions are often made by me.  This brings me to my next point...

### Following Directions/Patterns

Sometimes programmers will come and chat with me about a solution.  I try to guide them to the solution themselves.  However, if they still need additional help, I might tell them the solution that I'd like to see implemented.  When doing a code review, I'll follow up on this direction and compare it to what I mentioned.  If it is different, part of my review is asking for the details on why the programmer did what s/he did.  The open dialog will sometimes increase my understanding of where the idea came from - and open up more learning opportunities for the programmer.  In rare cases, if the programmer did not follow my directions and has no legitimate reason for doing it, that would be another thing I'd bring up as part of my review.

The other less quantitative thing is to make sure that the code is "doing it how we do it."  That is to say, if we've decided on a macro structure for features, the code better be implemented with that in mind.  That isn't to say that I suggest staying in a less-stable version of an architecture, but instead I strive to build consistency.  To state it another way, if we're working at a mountain bike shop, we might bring in road bikes or hybrid bikes.  We wouldn't bring in a car.

### Legibility

We're typing, so why is this an issue?!  This actually has to do with the complexity/obscurity of the code.  First, I'll notice a lot of times with new programmers a complex set of code because of a lack of familiarity with the language being used.  For example, PHP has a huge list of array manipulation functions.  Often, I'll see programmers unfamiliar with these functions recreating the wheel.

The other bit of complexity/obscurity I look for is the complexity of a code block, and how it is organized.  Often, programmers try to put way too much logic inside of a singular method.  Basically, this is unintended procedural encapsulation.  I look to make sure that a method is doing one, or at most two, logical functions.  Additional logical blocks should be refactored to their own methods for readability, clarity, and testing.  In cases where code just can't be broken out or the logic is quite complex, I'll look for comments.  Most code, at a very basic level, can be understood.  However, with complex variable variable or polymorphic interfaces, this becomes more confusing.  I suggest comments near code that is not clearly understood if you're unfamiliar with the project/codebase.

### Closing Thoughts

These are the things that I look for in a code-review.  I have noticed that I may want to start integrating more positive feedback in my reviews as well.  Basically, if you take a lot of the opposites of what I mentioned, they'd make great positive statements, too - right?  Another thing I need to note: the goal of code reviews is not to catch a programmer in a mistake.  It is instead to produce teachable moments and keep quality/consistent code.  That's why I said "I'll bring it up" instead of "I'll yell at the programmer" when referring to infractions in my review process.  I would encourage everyone to look at it the same.  You hope for the best code, but in cases where it is not such, positively enforce quality.
