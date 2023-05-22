---
title: "An Argument for Keeping Your Project Simple"
date: 2023-05-22T07:59:33-05:00
tag:
- business
- programming
---
Awesome. You used interfaces so you can abstract out the dependencies and swap services. Your database queries are all built with an ORM that is database agnostic. You don't rely on anything special with your servers/cloud. You did it! You now have a project that retains the business logic while allowing all the technical aspects to be loosely coupled! But should you have done it?!

<!--more-->

{{< header-call-out >}}
Before we begin, I should point out that - if you're not familiar - I work mainly in Laravel/PHP and Vue/Javascript. Your choice of language may use different terms or be architected slightly different. But, the conceptual argument should still apply.
{{< /header-call-out >}}

Was it worth it?

Think about it. For just a little bit. Please.

Was all that extra work worth it?

I'd say 99% of the time it is not. And guess what, you're likely not the 1%. 

But how could you be so wrong? Let's dig in.

## Interfaces for Implementation

Contracts for your concrete implementations are a great thing. But, just because something is a good idea doesn't mean it should be used for everything. When you have a hammer, everything looks like a nail - right?

### Constant Implementations

When using interfaces on some of my services classes years ago, a senior programmer told me I was being too picky. I thought this just meant they were a bad programmer. They didn't know about interfaces - they didn't know how to make contracts and use them the right way!

But what I think they meant - was that I had a case of the YAGNIs. You Aint Gonna Need It.  See, I had a single service to do a complex set of coupled business actions that I needed injected into a controller.  Instead of injecting it directly, I injected the interface. Later I bound the interface to a concrete implementation of the service class in my dependency container.

So - what was wrong with this?

Well, here's the deal. I was never going to swap out that service with another implementation. In this particular case, the interface or contract was not needed and was overkill.  I would always be using this service.  If I needed to change functionality, it would likely be a change to the code and deploy (or maybe a feature flag). It wasn't going to be a configurable alternate instance of the service class at all.

So **rule 1** - you don't need to use contracts or interfaces for things that are going to be forever in your code and not swapped with something else.  The concrete is enough.  (Of course, all rules can be broken - but it's at least something to consider and think about.)

If that's the case, why are we all using these interfaces?  

### Swapping Out Core Functionality

A great reason to use these is to build that contract for when you have to swap out your dependency. What's a good example?  Well, let's start out with a bad one first...

Let's say you're processing payments through Braintree.  Your business stakeholders say that you may be swapping out to Stripe in the future if Braintree doesn't get cheaper.

So, you think, now it's time to write things abstract. Let's get a payment provider interface and let's make everything abstract. I will call 'charge' and that will do what it needs to do.

In order to do this, I need to define all the public methods on a contract or interface. I then have to logically think about all the steps that other payment processors may do - in addition to Braintree.  Then I have to implement the code for Braintree in such a way that it's abstract and no one can 'tell' it's Braintree in the code.  This is tough. It's hard to know what every single processor might need (some require you to charge immediately, some require an authorization capture first, others require a webhook in the middle of the process).

So let's look at the math. I'm going to just make up some numbers - but that's just to illustrate the point.

* _Option A:_ Build with Braintree - 10 hours
* _Option B:_ Build with Stripe - 10 hours (won't hit business objectives - but you think we're moving here)
* _Option C:_ Build an abstract system that works for Braintree and Stripe - and maybe others: 25 hours.  (If you think this is silly and large, you've never fully abstracted code among third parties then...)

So - really only A and C are options.  Now, let's estimate what it would require if we implemented Stripe later:

* _Option Stripe Later:_ Rip out Braintree code - 2 hours. Implement stripe. 10 hours.

Now - see the math?  Braintree first (10) - then rip it out (2) - then implement stripe (10). (Likely the 10 is less because you now know your payment flow process very well as well.). - 22 hours

It's less time invested to do A and then B - compared to C.

Oh and with C - now that it's more abstract - every change for the Braintree flow has to be abstracted - so all of the work is say... 20% harder - so therefore 20% more expensive.

Of course I'm making up numbers - and you can make the numbers look anyway you want. But they're being used to illustrate this point:

**Rule #2** Don't abstract things for future needs.  YMNNI.  You may not need it. Hah!

So when would you actually use contracts and interfaces? 

### Swapping for Strategy

The best example of using interfaces and contracts in your code is when you opt to implement the [Strategy Design Pattern](https://en.wikipedia.org/wiki/Strategy_pattern). This basically is a design pattern that allows your code to self-select which code to run at runtime.  That's just a fancy way of saying that you have built a system that, depending on some choice, takes a different path through a likely encapsulated block of code.

Let's move out of the academic.  Imagine a scenario where you're charging with Braintree, but now the accounting department says you can also have people request an invoice.  Now you have two ways of paying - or strategies of getting the go-ahead for the rest of your application to function or to be licensed.

The first is through a response back from the Braintree processor saying the credit card payment was successful. You don't actually get the money immediately anyway - what you're getting is a promise that a number of intermediate companies will conduct a transaction on your behalf which includes a deposit of funds.

The second is through an API call to the accounting system which either confirms or denies that this user can invoice bill - and then maybe a second call that writes the invoice to the accounting system (sound familiar? Like auth capture and charge?)

Now, you've got a perfect example of when you can use an interface or contract for your billing.  Your code only requires to know the payment processor says "yes." It directs which of the two dependency options it needs for this interface and then runs the code in it.

This is an example of two systems that are working at the same time - that must be at the same time - that could require an interface.  The value of that interfaces raises as we start to add more strategies. (However it's still possible with just two to cleanly if/else the proper concrete implementation still).

What type of situation with more choices would make the best use of contracts?

### Third-party supplied plugins

You got it! When you write a plugin system - you're likely using a form of the Observer or [Visitor](https://en.wikipedia.org/wiki/Visitor_pattern) pattern.  This is the perfect time to use interfaces and contracts.

There are a number of packages or blocks of code being used in your system by third parties that you may have no insight into. With this interface you can specify what is required for these plugins to fit your model.

And, I guess we could say that plugins don't even need to be third-party. They could be all from your team, too.

Ok - fine - so what other ways are we making our projects too complex?

## Abstract Database Components

Now let's get a few things clear at first. When I talk about abstracting out a database component, I'm not talking about things like PDO in PHP or Eloquent in Laravel.  Those are abstractions that help you interact in a standard way with multiple databases - but they still give you access to the underlying database - and the intricacies and strengths there in.

What I'm talking about is the idea that you never make use of database-engine-specific functionality because you may not be able to always depend on that functionality being there in the future.

That is to say - maybe you're using MySQL and you don't want to use `insert ... on duplicate key update` functionality because you know it doesn't exist in Postgres. (I believe Postgres uses an `on conflict` syntax instead.) So, instead of doing something efficient, you use multiple DB queries, locking, and a whole host of other things - just because some day you might not have `on duplicate key` available to you.

That's just wrong.

In the last 20+ years of professionally programming projects, I can count on 1 finger the number of times I've had to swap entire database engines. I've upgraded versions with breaking changes even - but not swapped out a whole system. (I know what you're thinking - maybe you're going to be one of those people that will need to. Naw - you won't. By the time you may want to swap out the database, your project is probably already up for rewriting anyway.)

So, stop making those things so abstract. Use the built-in functionality in the database to make your whole project simpler. You will not be swapping out to a new database. (Again, I'm not saying you will never do that - but the circumstances around it are likely much larger - therefore they negate the "cost" you implement right away to abstract things).

### What About ORMs?

I used to hate ORMs. And honestly, I can't tell you if it was because I didn't actually know how to use them - or - that they were so 'bad' when I first started programming.

These days it's different: I love ORMs. I want to use an ORM whenever I can.  You just have to know how to use them.

I bring this up because some people will take the advice of using underlying database functionality too strictly and reach for only direct SQL queries. Don't do this.

Today's ORMs do a good job of writing great queries. A lot of them have built-in profiling options as well. If you use an ORM properly, it will be as efficient as a regular query in 99% of the times. (In fact, I've learned a few things about MySQL from some of the queries my ORM generated.)

## So - Just Wild West My Projects Then?

No. Don't just make up all your own rules and go crazy. These things you've learned or 'absorbed' from others are great. But, you need to understand the context of them. 

Think it through: why do I need to do this? Is it something I actually need now - or in a future that is set in stone? (Most 'future' things never seem to happen in my experience of IT projects).  Does my implementation of code seem more complex with this 'right way of doing it' - or is it more confusing?

I'm in favor of learning more design patterns, creating higher quality code, and doing your due diligence in architecture and testing.  I think you should aim to write your code for someone else to read, understand and love.  And I think sometimes programming just sucks - sometimes you have to do tedious things because they're more effective and cheaper for the business' bottom line (and that's who pays you).

So, write good clean code. Implement contracts and interfaces where needed.  Use your ORM. Just don't make your code too complex for a future state that may never come.