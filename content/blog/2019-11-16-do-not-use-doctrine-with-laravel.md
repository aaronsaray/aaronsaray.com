---
layout: post
title: Reasons Why Not to Use Doctrine with Laravel
tags:
- php
- laravel
---
Currently, there are two pretty common packages for interacting with your database: Eloquent and Doctrine.  Eloquent is part of Laravel and Doctrine, while used often on its own, is usually referenced with Symfony.  If you've come to read this article, you're probably versed in Doctrine and wondering why you can't just - or shouldn't just - use it with your new Laravel project.

There are a number of packages, like [Laravel Doctrine](https://www.laraveldoctrine.org/) that make it easy to interact and interject Doctrine into Laravel. So, it seems like this might be a pretty valid choice.  Why am I against it?  

Well just with every opinion and choice, things aren't always black and white. I'm not 100% against this, there are some reasons (which I'll discuss below) that you might actually want to do this.  But in general, I'm against this mix, and let me detail why:

> Before we begin, I should note that I use Laravel right now almost exclusively. However, I still like Doctrine and it's methodologies better, but I stick with Eloquent.  Colleagues have found that a weird choice for me, so this article helps to explain that disconnect as well.

### Two Different Styles of Tools

First, its important to understand that these are two different styles of ORM or database packages. Eloquent is based on Active Record whereas Doctrine is a Repository Pattern.  If your application is architected in one way versus another, it may make sense to pick a different package.  But, it's important to understand that these aren't two interchangeable toolsets and methodologies.  Choosing a different tool besides the designated in one for your framework requires you to think in a different paradigm.  You better be getting more value out of choosing this difference in methodology.

### Path of Least Resistance and Familiarity

My colleague [Joel Clermont](https://joelclermont.com/) points out that using Eloquent in a Laravel project is the path of least resistance. I agree: it's already there as part of the framework, so use it.  

Because of this familiarity and bundling, most people who have programmed a Laravel project will have familiarity with Eloquent.  When you say your project is a "Laravel Framework project," it stands to reason that a programmer who offers that they have the requisite experience is assuming it's the standard configuration of Laravel + Eloquent.

Also, are you building an application for a client who expects a ROI on this, or are you doing a vanity project or a homework assignment?  Most of us are tempted by the academics of this, but we need to understand our objective is to make a quality product for the client in a timely and efficient manner. Are you making choices that give them the best chance to be successful moving forward, or are you selfishly choosing a path that you like the most, regardless of the rest of the team/future devs/cost?

### Quality Tools

I'm not saying we should settle for crappy solutions just because they're 'built in' - I genuinely believe both choices are of similar quality.  The biggest complaints I've heard about Eloquent (and I was guilty of this in the beginning) was regarding the lack of reading the manual and understanding the way that you properly implement it.  Just like PHP, tools like Eloquent allow you to make choices that are less efficient - doesn't mean they're wrong.

### Integration to the Framework

While Eloquent is designed to be used outside of the Laravel framework, it's not vice-versa. There are any number of 'magic' or 'just works' things that are built into the framework that take advantage of the predictability of using a known database library.

### Choosing a Tool for the Wrong Reasons

The data mapper pattern with repositories is great. I tend to use it when I'm working with third-party data.  Just because I'm using Eloquent doesn't mean that I can't also have Domain objects (stupid or smart).  You can mix your model types, it's ok.

Another argument I hear is that the Eloquent models become way too large.  Again, this is not a reason for choosing a different library, it's about using proper code architecture. If your Eloquent model is becoming too large, consider that you might want to move to using more observers and decorators.  If you tend to interact with more than one object in your class, and that's causing it to balloon, perhaps you might investigate creating Service classes that deal with these objects separately.  Again, this is not Eloquent's fault.  

I've seen some very bad models built, and I wanted to blame the toolset many times.  After reading the manual, people have extended and bastardized the code so much!  But, if you look at it more objectively, the documentation is pretty good. They're trying to encapsulate examples and documentation in such a way that makes sense only in the context that it's there - this isn't about building a full application. And that's what people forget: some programmers haven't yet moved to an experience level where they can synthesize a better, more robust architecture from examples, so they just stretch the boundaries.  That's not the fault of the tool.

### Reasons and Expenses of Picking Doctrine

Now, there is a reason I'd use Doctrine in a new Laravel project.  That is if the previous iteration of the project had a large collection of Doctrine resources that were so numerous and thoroughly tested.  If I could drop them into a framework-based application, without having to significantly alter them, then I might consider this.

I think this collection of models and repositories would have to be so large and recreating it would be so timeconsuming to overcome what I see to be a 20 to 30% time penalty with the rest of the development of framework-based activities.  All of the special packages to install, all of the time to troubleshoot something different based on Doctrine instead of Eloquent. I predict this would all add up, and potentially eclipse the cost savings gained by retaining the Doctrine models.  In addition, as mentioned in the first point, the cost comes from not just the specialized configuration, but the ramp-up speed of those Laravel programmers that join the team in the future that aren't familiar with Doctrine.

### I'm Sorry

As a programmer, I'm constantly learning more and changing my mind. I apologize to those who might run into my projects that I've created before I realized that using Eloquent with Laravel really is the path of least resistance.  Please forgive me, friends!

Oh, and I reserve the right to change my mind again when I learn more in a few years! Haha!