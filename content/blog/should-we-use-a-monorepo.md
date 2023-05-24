---
title: "Should We Use a Monorepo?"
date: 2023-05-24T13:57:15-05:00
draft: true
tag:
- programming
---
A monorepo refers to a single repository in your version control system that holds all of the code for an entire project. That project could be made up of many services, front and back end code, ETLs, etc. 

There are many technical arguments for using a monorepo vs a bunch of smaller repos that are more targeted to that functionality.  But, one argument is often left out of the discussion.

<!--more-->

The question that needs to be asked is "What is your team and management culture?"

Really? Isn't this a technical challenge/question?

Yes - and also culture.  Let me explain.

**Monorepo pro:** easier to see all parts of the project and run integration/end-to-end tests

**Monorepo con:** harder to manage things like code conflicts and the sheer size of impact of making changes like code style updates.

**Mini repos pro:** Teams can be more focused, potentially move faster at code improvements and breaking changes because the surface area is smaller.

**Mini repos con:** Requires more integration between teams at the human level. You have to manage deploys - either that or write very defensive code that works in all situations.

There are surely many more pros and cons - but this is just to demonstrate my point that the company size, management and culture need to be taken into account.

Do you have a large team or a small team? That is to say, can you easily name all the programmers first and last name that work on this project. If yes, that's probably a small team. If not, it's probably a large one.

Does your company leadership and culture encourage multiple forms of communication (with authority) throughout the day - or is it more structured asynchronously?

Do you have more team members who are newer to programming or have less experience managing multiple dependencies and projects?

Do you see the trend?

Yes there are definitely technical reasons why you might pick one versus the other. But do not forget about the makeup of this particular team and the company. Introduce this into your consideration.  How 'hard' will it be to do the 'right' thing technically - whatever that might be - compared to the other thing.