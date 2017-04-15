---
layout: post
title: Make sure not to "too" future-proof your code
tags:
- programming
---
When doing a bit of code review, I saw an incredibly ornately architected future-proof module written by one of my programmers on my team.  It had taken him roughly 3x as long as I had estimated, but the code was very complete.  It was created in such a way that every single portion of it was modular and could be interchanged quite easily.  

However, remember, it did take him 3x as long as we estimated.

If you work on timelines, you know that a project that takes 3x as long is not a success, no matter how great the code is.  So, I started up the conversation with him asking about the reasons he made certain choices.  Turns out, he had thought of almost every single future way to use this code and implemented architecture to support that. He covered instances where we might change our database, our models, even our front controller and consumption patterns.  

While this is fine and dandy, I would say that he went too far with future proofing.  And here's why...

In the programming world, current tech moves so fast.  We have to be constantly churning out new code to keep up with all the new features and technologies.  This presents a difficult balance that we must consider.  We need to create code that is able to be re-used when the dependency technologies change, but at the same time, need to hit deadlines for our current requirements.  I would also submit that sometimes planning for technology interchange wastes current time so that by the time we finish, that technology we planned for is already out of date.

Now, don't get me wrong.  I'm not saying we shouldn't future proof our code and keep it modular, but it has to be a balance.  Get working code out the door that has the basic architecture to be modular.  Each individual method doesn't need to be interchangeable 100%.  

Let me give an example.  Say, there are three social networks out there that do music related communities for your music website: MySpace, MusicEar, and defNotes (I  think I made up the last two).  The requirements are to build a unified login system with a music website, preferably MySpace, for the music site you're creating.  You have three options:

  1. Cater to just MySpace

  2. Build a pluggable system for any network, then build a MySpace plugin

  3. Build a system with a basic framework to allow pluggable items, but hard code in the MySpace dependency

Obviously, you now know my desire would be #3.  Because, by the time you finished #2, MusicEar and defNotes may be out of business.  And #1 doesn't allow much flexibility for future networks that you don't know about yet.  

So, how would one do that?  That's where the balance comes in.  But, I can think of some ways.  Say, when you want to create a new instance of the social network class, call a factory method.  This first iteration, all it does is return new MySpace().  In the future, if you implement a new network, you can then modify that factory method to return the proper class.  

The balance comes from honestly assessing what the future may look like.  Look at your client and customer base.  What is the likelihood of that customer base using the other methods? If its not very high, don't future-program for it.  
