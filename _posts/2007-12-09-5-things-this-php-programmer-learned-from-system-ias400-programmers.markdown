---
author: aaron
comments: true
date: 2007-12-09 16:25:17+00:00
layout: post
slug: 5-things-this-php-programmer-learned-from-system-ias400-programmers
title: 5 Things this PHP programmer learned from System-i/as400 programmers
wordpress_id: 86
categories:
- PHP
- programming
tags:
- PHP
- programming
---

Working in a shop that has approximately 15 times more System-I as/400 iSeries (whatever you want to call it) programmers, I've been immersed into their culture, standards and mindset.

As you can imagine, as a fresh new programmer for emerging web technologies, there was some struggle between me and the analysts for this older language.  However, as I stepped back and actually looked at their directions, suggestions and practice, I found 5 things that I actually should integrate into my methodology.

**1. Make necessary text settings dynamic using databases**
Generally, these programmers have progressed through their career under highly strict and audit-able programming and promoting to production environments.  Because of that, they tend to leave a lot of the actual text in their applications separate from their programming logic.  This allows them to get their application out in production, and then just change the data in the databases (or files as they call them.  Also in our environment, changing data is a lot easier than changing programming).

PHP programmers should be used to this as well when creating multi language applications.  I learned that this could be useful in situations where I only have one language - especially when working with business users who aren't fully set on their wording until after the application hits production.  (Just recently, I changed 3 help texts for an application at work - and it took me about 3 minutes of database manipulation - rather than an hour of checking out code, modifying it, repromoting it, etc.)


**2. Add additional logic situation by creating database driven action rules**
For whatever reason, you might find yourself wanting to introduce different language for different partners (in our case states).  Previously, we had created state switch statements in shared code to determine what to do for any particular state.  However, this means that I had to keep the code up to date in areas where it wasn't explicitly shared with code that referenced specific states.  If we added a new state ever, we'd have to go and modify everyone's code again.

The system-i programmers had been creating rules for these type of situation.  Basically a rule is a numeric record with a state or environment specifier and then a yes/no value.  Then, they would intelligently program their logic around these rules.  The environment or state where the rule was being retrieved from had the proper value for that state.  For example, if I were getting rule 114 from  WI.t_rules it might be 1.  Rule 114 from IA.t_rules would have a 0.  This also adds flexibility for environments who made a decision to do it one way, but now want to do it another way.


**3. Separate your logic into smaller objects and keep your display separate**
System-I programmers can make display files which is basically a type of interface to show data.  Also, they are moving to more and more of a modularized system - which is something I've always wanted to do (using MVC pattern).  They are introducing more service programs who's only duty is to take a parameter and do a quick specific calculation and return them.  This was a cool reiteration of a programming concept that I already knew.  Their service programs are very similar to web services - which is encouraging me to keep thinking of making more and more service oriented architecture.


**4. Validate your data**
Although this is an obvious thing - and this is something I shouldn't have had to re-learn, you do end up getting lazy when you're programming for your own projects all the time.  When you send stuff to the System-i, say like a date field, and it is incorrect format, it will cause their program to hang (that is to say, halt and hold crash information in memory for someone to analyze).  Because of this, my connection is blocking - and my page freezes too (this could be solved with a proper time-out - but we're not covering that here.)  When a program hangs, a page is generated to the system-i programmer on call.  You can imagine that they're really irritated if its in the middle of the night.

At any rate, PHP has let me become a little bit lazy.  If I send an invalid date format to a function, it'll just error - but most often continue to run.  This was a good experience for me to have - I'm far more diligent about error checking my data before it even leaves my script.


**5. Not everyone is a programmer / I take stack programmers for granted**
This one is kind of a double point.  Its amazing to me that their are two types of workers on the system-i side: the system analysts and the programmers.  SA's are responsible for quoting, designing and generally architecting the project requests that come through.  The programmers take those specifications and make them reality.  This is a little bit different for me as I've always just been in charge from start to finish.  I still pretty much am right now in this organization - I do get assisted by the SA's when the project is very cross platform, however.

The other thing that caused me some surprise is that the programmers and analysts don't know the intricate details about their stack - that is the whole environment and programming box their using.  They have an administrator who is a lot more familiar with the environment.  This is kind of different for a LAMP programmer - I originally looked down on them for that - but then I realized it was positive for two reasons: It had security and it tried to separate duty and responsibility to allow more specialization.

These two things - after I realized they even existed - helped me communicate with my peers in the system-i programming side a lot better, effecient and more accurate.



So, although I like to give some of the more fun system-i programmers a hard time about programming on an old archaic language and that they can't handle us young hotshots, there is a lot to gather from these experienced programmers.
