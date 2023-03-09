---
title: "The Very Bad Things That Javascript Can Do: Part 1"
date: 2013-04-09
tag:
- javascript
- security
---
I have the argument a lot with product managers about allowing custom HTML and Javascript into our projects.  I don't want to do it.  I want to only put in predefined, sanitized information.  But more about my reasons after this... let's look at the arguments I get first...

<!--more-->

**Point:** Our clients are smart enough not to put in bad Javascript.

**Counter point:** If they were really programmers, they probably wouldn't be taking advantage of a service like a CMS.  That isn't to say that I don't here for my blog - but generally, the customer doesn't know what they're doing.  Don't let the ability that they have been taught to use good UI confuse you that they know what they're doing.

**Point:** Our clients are not the target of any hackers; they are non profits, etc.

**Counter point:** Bot-nets exist because a lot of non-important users have had their computers infected.  The attack isn't against the infected computer, but is being leveraged against another third party.  Bad hackers aren't looking to attack our clients, probably, but they will use any available spring-board they can.

**Counter point:** The better reputation our clients have, the more enticing they look.  If a hacker could gain access to a .edu domain, you can bet its much more valuable than a random .com name.  The .edu designation has a trust reputation.  Plus, there are TONS of ill-intentioned internet users.  Just because our client may not be the target of a high-profile, skilled hacking group, it doesn't mean that a teenager in their bedroom learning how to hack for the first time won't randomly pick them as a target.  That could be devastating to our client - and it just turns out that it was random.

**Point:** If our clients make a mistake and allow their sites to get hacked, that's their fault, not ours.

**Counter point:** No matter what, its always our fault.  For many reasons... First, if the client discovers the problem, they aren't going to say "I was not informed and allowed my site to be hacked."  They will invariably say "My site, hosted by BLAHBLAH company, was hacked!"  There is branding and word of mouth to worry about.  Imagine if a car company didn't make cars so safe.  They could say "well, our clients shouldn't hit brick walls" but we all say "no, that car should have protected me."

So, now you may have an idea of how those arguments don't always hold water.  I still think its important to show what can really happen in the real world.  

[Part two]({{< ref "/blog/the-very-bad-things-that-javascript-can-do-part-2" >}}) the actual exploits that could happen.  It will run through scenarios that make it really easy for the offending code to get on the site, and make it difficult for a casual user or for security analyzing scripts to detect rogue code.
