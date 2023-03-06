---
layout: post
title: How Developers Should Delegate
tags:
- business
- management
---
As a manager, I spend a lot of time delegating.  I delegate small tasks so that I can spend more time adding value to the process and project. The value I bring is my ability to see the larger picture, use my experience as a guide, things like that. If I'm doing too many little things, I can't do what I'm good at.

Developers have the same challenge.  They can add more value, they can create revenue producing things, but they sometimes get mired in the details and tasks.  They need to delegate certain responsibilities across or outward. But which ones - or how do I even figure this out as a developer?

**Never be the only person who can perform a task or provide information (like reporting).  Prioritize building tools for concerned parties first.**

What does this mean?  Well, let's take a concrete type of example.  Too many times I see this:

```
Product Config through code or database by MySQL
-- then, later --
Command line scripting to save time, ran by developer
-- then, much later --
Interface built for product owners
```

This takes way too much time to get to the interface usually in this process.  The first two steps are taking away precious time from a developer.  They have to stop what they're doing, do the task, and then restart the process.  This is a lot of time wasted.

This pain is felt by the developer, which is indirectly proxied to the business, but is rarely understood by product owners or management.  Consider this common back and forth:

Owner: "Why are project timelines slipping?"  
Developer: "I have to do a task to update things that takes 15 mins each time. It happens quite often."  
O: "That should only take 1 minute... why the extra 14?"  
D: "To get back in the zone."

Most non-development people don't understand that this context shifting is expensive.  Expensive to a developer's process, their sanity, but more so the product goals and revenue.  You're not generating new things anymore, you're doing maintenance.

It's best to create an interface for configuration and information gathering as soon as possible.  Even if its only for yourself, and you're the only one using it, create an interface.  (I've seen this happen before: developer has information, owner suddenly wants it, it takes another extended amount of time to make it compatible with a non-tech person.)  But this isn't the only reason to prioritize building one.

The current best practices now revolve around distributed, parallel systems.  This means it's harder to just get access to the database or to jump on the server.  There could be containers, clusters, etc.  There are shards, master slaves, and other things with the data storage as well.  This has already been abstracted and handled by your project's service layer, so why not use the same thing?  You shouldn't be doing this by hand.  Oh, and don't fall for the command line middle road.  This might mean you have to have some sort of utility server lying around now that poses as your proxy for other services. This is extra overhead and another thing to take care of that could be eliminated with good interfaces.

If you create an interface for only yourself, that's ok.  It's not perfect, but you're closer.  You now test out the interface functionality before you expose it to the end user. And, when they finally do want access to it, it's only going to take a little bit to alter the look, change the permissions, etc.  It's better than having to hurry and build something from scratch when the business needs access to something.  **There's nothing more frustrating than owning a product or service, but not being able to make fast changes that are relatively simple to implement.**

When you create user interfaces right away, you make testing easier as well. Your testers, other programmers, etc, can set up testing scenarios without having to mix in with the technical things.  When you have to do technical setup as a developer to test another's work, you've shifted your mind away from end-user experience and are anchored in technical details.  This makes your testing less effective.

Interfaces push the responsibility for the product, the domain, into the owner's hands.  That's what we should be doing as programmers.  Programming is a service, we should be doing the best we can to provide all the service to the end user.  Resist the urge to become that important cog in the wheel, to be the hero. The real hero provides the business with interface and access as (or before) they need it.

I talk a lot about accessing things, having information available as a business owner, but this can be hard to understand as a developer.  After all, you've been given all the access, you've created it.  But let me give a real-life example to help develop empathy.  

Imagine you purchased a brand new beautiful house with a cleaning service. The cleaning products are locked up in a closet in your house.  The weekly service keeps your house clean, but in the middle of the night you spill something. You know this is a quick fix - just wipe up the mess - but the cleaning supplies are hidden away.  If you only had the key, you could get in there, but they're locked away. This is _so_ simple - why can't I just clean up my mess right now. I don't want to get rid of my cleaners, I just need to take care of this one thing on my own in the middle of the night.

That's how product owners can feel about not having access to interfaces for information.  So, delegate your tasks outward, upward, away, to the product owner.  If they need report information, build an interface so that they can use it themselves in the future (you might still give them the first report delivered in the manner they expected).  If there are configuration options to be done with a product, make those user-friendly, so the product owner can access what they need to, whenever they need to.  Delegate these simple tasks outward which in turn demonstrates the quality of your service.