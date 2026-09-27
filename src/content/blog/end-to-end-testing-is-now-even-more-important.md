---
title: "End to End Testing is Now Even More Important"
date: "2026-09-27"
tags:
  - testing
  - ai
---
I've been a huge fan of automated software testing for years.  I tend to reach for unit tests over end-to-end (e2e) tests.
This is probably because of two reasons: a focus on back-end work (primarily) and e2e testing was slow compared to my targeted unit tests.

With automated AI tooling now, though, I think the tide is changing.  I still value my unit tests, but e2e is becoming my champion.

I'll explain how and why my mind changed:

<!--more-->

## Defining the Different Test Types

First, let's get a few definitions.  It's important to define these terms specifically in context of this article (I'm sure I've interchanged
terms in the past - this is generalizing the terms just to hit the main point of this article).

**Unit test** Something that tests a unit of work. In this article, we're going to allow it to be integrating with multiple pieces of code (databases, etc).  
It's basically something that knows and has access to the interiors of your code.

**End-to-end (e2e) test** A test that runs in a browser (or terminal) that imitates a user's interactions and asserts scenarios together.  This may have
access to 'reset' or interrogate your data, but it's not directly tied to that code. It's a layer on the outside.

Now that we've got these defined, at least in regard to this article, let's walk through the before - and now.

## Always Create Unit Tests

Nothing has changed here. I always still create unit tests when I can. I want to have automated testing that tests the smallest pieces of my code, all the permutations, etc.
A full e2e test testing everything is way long-winded, takes much more time, and may not be able to cover everything (sometimes code tests are written for invalid data that happened outside
of a user's control).

In fact, I'm still using AI to help me write these tests, too. It's great for these repetitive tasks (just make sure to review the output yourself as it tends to rabbit hole or hyper-focus on
one type of testing pattern or scenario.)

## Create More E2E Tests

So, since I can use AI to generate some of my unit tests, I'm already saving time. I've opened up a bit of my budget for additional tests I didn't write (because of the time constraint). Plus there's an added bonus.

### More Tests with Less Time

First, I can now have AI write more Playwright tests - or any other tooling. The amount of time I spend writing my unit tests is lowered, so now we have the additional time to write these e2e tests.

I do acknowledge that with more tests comes a longer running test suite. That's a problem for a different article. :)

### My AI Already Knows Playwright

Not only does the training corpus have a tremendous amount of data and experience for Playwright testing, I've already taught my agent about Playwright for daily interactions as well.

Using the Playwright MCP showed me that the AI tools can wield Playwright and understand its code decently.

There's a crossover that has some synergies here. I've noticed that my agent will sometimes fail Playwright stuff it has done fine in other sessions. Now that we've written tests,
we can use them to steer the agent when it uses the app with the MCP. Your tests prove your application is working, and now serve an additional purpose: a blueprint for your agent.

## Tests Are More Important Now than Ever

Clearly I love [testing](/tag/testing/) - I've written about it a lot. But before, it was a "you should do this - because you can't trust your own code" style argument. While that is true,
and I strongly believe that, others have pushed back. (Call it overconfidence, cockiness or just self-security - saying "I don't need tests because I don't write bugs") If you pushed back in the past,
realize now that - depending on your workflow - you're moving yourself more out of the loop. You're no longer writing 'perfect code' if you're not writing it. More tests now are our protection.
