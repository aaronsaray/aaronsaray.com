---
title: Why is Deleting Code OK but Fixing is Not?
date: 2022-03-02
tag:
- programming
- business
---
One of the most painful things for programmers - whether you're in a startup or an established business - is leaving code alone that you know could be better. That should be better.  There are reasons for this - but what about when it comes to deleting code?

<!--more-->

First, we should talk about why we have to leave "crappy" code in place.  There's a difference between levels of crappy code.  There's code that 100% doesn't work. Then there's code that fails in certain situations, and we know the situations and the risks they bring. Then there's code that is ugly or out of standards, maybe even too complicated, but it works.  The problem with that code is that it's an opportunity cost based expense - that is, it's bad so when you do work on it, it takes too long, and you can't work on other things.

All of these types of code developers want to fix. We need to fix it. It itches.  Make the code better! Maybe it's someone else who wrote it and you can fix it. Maybe it's even your own.  

But you have to leave it alone.  The business understands the risk and cost, and has decided that you need to work on other things instead.  This can be tough to grasp, but there is a logic to it.  The opportunity to build something new, adjust other features, will generate more revenue than fixing that code will save.  Or, the risk is fine - we know it will break sometimes, and we'll handle it when it happens. That expense and ratio of risk is so low, so we just move forward with other things.

I can understand this. As I progress in my career, I even support this.

But there's one type of code that I still say needs to be handled, and that's dead code.

That code should be deleted.  Immediately.  

Let's talk about why.

The 'bad' code likely is in place, working, and gets cycled through. It may not be great, but it's being executed and tested with some level of repetition.  You have a reasonable sense that it works as expected.

But dead code is much more dangerous.  That is, code that is not part of the normal process of using a program.  This could be code that is no longer accessible publicly, or has its public access hidden.  It might be old features.

The problem is that hidden code can be found. Non-public code or code that's been abandoned is working on an earlier programming, security and business paradigm - but how does the next programmer know that?  Unless they intimately know the system, they will think its good code because hey - it's here.

Hidden code can also be executed by external parties and cause unforeseen results.  "How did they do .... that?" you might find yourself asking if someone accesses the dead code.

So there's a difference in the two types of code: crappy and dead.  As a developer, you have to be ok with navigating crappy code, and making the case for making it better. You also have to be ok when you're overruled.

But dead code you must insist on moving. This is a danger that is never worth the forward progress potentially gained by doing something else.