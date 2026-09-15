---
title: Why I'm Starting to Love Parallel Testing
date: "2026-09-14"
tags:
  - php
  - laravel
  - testing
  - phpunit
---
Maybe I'm behind. But I like to think of it as conservative.  Parallel unit testing has been around for a while,
and I haven't really reached for it until recently.

This isn't about not wanting to change, though.  It's about using the proper tools for the job, and only when necessary.

Or at least, that's how I rationalize my delay. But maybe you're in the same place.  Let's dig into why I waited,
why you might want to wait still, and the reasons why this works now.

<!--more-->

## Before: A specific type of confidence

For a long time, my test suites have run serially and I was fine with that.  Actually, more than fine. I was confident that
was the way to do it.

First, they didn't take that long.  And when a run did grow longer, it was usually a full test run on a CI system. I tend to target
only my specific test scenarios with repeated tests.  That's to say, I ran only one suite or one method over and over until
everything passed and worked as I expected.  I don't need parallel testing for that.

Another reason: I was developing locally on my host.  Before I moved to Docker, I was using a local database.  Because of this,
I really locked down the users that accessed my database.  There would be no reason for my development credentials (or my test
instance connection) to create new databases, as that's not something that happens in my regular project.  (Parallel testing runners, at
least the one I finally chose, require it to create databases for each thread).

So, my confidence (bordering on over-confidence?) was nicely placed. I was confident in my workflow and my tooling didn't
need to change or expand.

## Now: New tooling dictates a new approach

As my projects progressed, and I took on larger enterprise level tasks, the test suites grew larger.  Couple that with
test suites that have legacy cross-connection - or code that is intertwined, and suddenly I started seeing the slow-down.

When I was on a greenfield project, or working directly on my new code, my tests were fast. But, plop me into a legacy application
with (arguably) good coverage, and things start grinding to a halt.  

Something has to change.

And now, something else enters the mix: AI can write pretty decent tests for us. (Not perfect, but good).  This allows
me to expand my test coverage a bit beyond what I had before. I'm not hitting 100% coverage, but I'm covering those tough-to-set-up scenarios
now - because AI takes away the boring ceremony.

So, that's more tests.  And more delay.

Moving through tooling, I also went to a Docker-based environment for all of my databases.  While I still don't like the idea
of giving a specific environment's credential more access than what would be in production, I rationalize this as my dev credentials
still can't create databases - but my test ones can - just to support my testing tool [Paratest](https://github.com/paratestphp/paratest).

So, I'm starting to see the reason for parallel testing, now.  (And as a bonus, if my automated LLM-based tooling decides to
run the full test suite, at least it's a bit faster.)

## What's the point?

I don't think I'm saying "you should always use parallel testing" for unit tests now.  But, I've seen there are good
reasons for it.  I didn't get into it - but there are risks involved with this as well (luckily the Paratest/Laravel integration
handles most of these pretty well).  So, you should really understand when you reach for a tool like this what you're getting
and what you're risking. 

But, if your tests are taking a bit too long, and you have a decently secure and isolated dev setup, 
it might be time to reach for parallel testing.
