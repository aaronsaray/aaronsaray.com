---
title: Should you use software you are making new again?
date: 2013-01-01
tags:
- programming
---
Lately, I've been working on the "2.0" of a very old piece of software in our organization.  I rarely use this software - partially out of the pain caused to try to figure out how to navigate it and the associated slow user interface - and partially out of a different theory about new software development.  Let me explain.

<!--more-->

### Building Incrementally is Easy

If you have a piece of software and your tasks are incremental, your programming challenge is small and the job is easy.  For example, if you have a blog system that does not have any formatting, and the next version requires formatting, that incremental change is easy.  It is easy compared to writing a brand new blog system.  

So, when you are tasked with incremental changes, you should be very familiar with the software.  You should use it often.  You need to learn the ins and outs of the software and become familiar with efficiency and good things, as well as the bad things.  This way, you understand the various paradigms that the software uses to accomplish things and you provide a consistent way to solve them.

### Building Brand New is Hard

Sometimes software developers want to jump right away to the "re-write."  "Things will be so much easier if we had a better software package and more features."  "the old software is crap."  I'm very guilty of this myself.  However, don't forget that the task is much harder than you realize.

First, depending on your users you might still be pigeon holed into old systems, non intuitive user interface choices, and product legacy.  Things like "we always did it this way" will come up.  Whether or not that is the best way to do it, that's the way it HAS been done.  And people hate change.

I follow this interesting theory when writing a brand new piece of software, though.  I use the old software as little as possible.

That sounds horrible!  Naw... let me explain.

### Use the software JUST enough

I use the software just enough to understand what the goal is that it's solving.  But that's where I try to stop.  I may glance at the features, understand their use and implementation, but I rarely use them start to finish.  I'd rather see examples of what people have used the software to do - not what the software allows for.

What this does is allows me to break from the mold that every power user falls into - the fear of change.  If you use the old software too much, you might fall into that manner.  For example, on this project, the old version had a search term and a location search box.  They were separate and worked in tandem some of the time.  I saw this, but I didn't ever use it.  I never learned what happened if you put in a search term but not a location.  I never learned what happened when you did both.  Instead, I created a single box moving forward and said "people should type whatever they want in here."  If its a location, I'll find that location.  If its a search term, I'll search that.  If its a combination, I'll parse that out too.

The stakeholders were a little confused at first.  But, once they realized what was done, they loved it.  It's funny - now it's already like second nature to them.  Not only do they want what I built, but there are complaints that it doesn't do enough "magic."  If I would have been a power user of the old version, I would not have dreamt up this new way of doing things.

### There are negatives...

It's not all fun and games.  In a perfect world, the new project would have a set of requirements and you could build off of that.  However, that's not always the case.  So, sometimes, you do have to go back and look at the old version.  You have to compare the old system and make sure that you're providing the right level of service.  And, of course, compare it all to the requirements you were given.  Are you accomplishing the task?  Yes.  

### Final thoughts

I have learned a lot through this experiment.  I tended to not use other software out of peer laziness.  This time, I did it for this experiment.  I think I'll stick with this style to an extent.  I will use the software more, but try not to become a power user of it so that I don't fall into those traps.
