---
layout: post
title: 1 Quick Tip to Decide Which Type of Unit Test to Create
tags:
- testing
---
Should I be writing more unit tests? Integration Tests? End to End tests? I can't answer this completely, but I can give you one tip to help you decide 80% of the time.

Quick definition for these types of tests.  **Unit test** is a type of test that takes the smallest self-contained block of code and tests it. It has predictable input and output that passes for each test.  **Integration test** is an extension of a unit test. It is a larger block or collection of blocks of code combined into some sort of business process that may integrate with other services (like a database). **End to End (E2E) Test** is a unit test that takes a system or user input, cycles that information through the entire application in one workflow, and validates the output or by product of that process.  As you can imagine, unit tests are the fastest, and e2e tend to be the slowest, most brittle.

Years ago, the type of test you'd do would likely depend on the language you were writing in.  If you were writing in Javascript, this was a more user-facing product, you might do more user-based tests which tended to be E2E tests.  If you were programming with something like PHP or Ruby, you might have focused on more Unit or integration tests. These, afterall, were the languages used more for computational processes. These are harder to set up with user/system input.

But as languages changes and we evolve how we program, I think I've distilled it down into a different indicator:

**The type of test you write depends on what the primary use of the code you wish to test is.**

Let me explain that differently.  

If you're writing an entire app that's main functionality is reflecting different states based on user input, you probably will run more of an E2E test.  Think about things like basic CRUD, workflow creation, etc.

If you're working on code that might be used for report generation, you're likely looking into unit and integration tests. There is likely very little difference in the user input that is created (call the report, show me the response). But, the underlying data has many different scenarios that could cause the output to look different with the SAME user input.

So, if you're trying to decide what type of test, this isn't perfect, but it'll get you close: does your code depend on user choices to achieve its full potential (E2E test) or is it data and algorithm driven (Unit/Integration test).