---
author: aaron
comments: true
date: 2009-09-20 02:53:42+00:00
layout: post
slug: multi-version-programming-to-successfully-leverage-overseas-programming
title: Multi-Version Programming to Successfully Leverage Overseas Programming
wordpress_id: 424
categories:
- business
- programming
tags:
- business
- programming
---

Today, I read through the paper titled 'An Experimental Evaluation of the Assumption of Independence in Multi-Version Programming' (Find it [here](http://sunnyday.mit.edu/papers/nver-tse.pdf)).

The basic concept is that in N programs written by N different programmers, they will have N*N bugs and inconsistencies.  However, the probability of them having the exact same fault is very small.  By executing the same programs at the same time and comparing the output to each other automatically, you can take the majority of exact same output and call that the bug-free result.  Those who have not matched the output of everyone else theoretically have a bug.

Now, this got me thinking about people who outsource their technology.  Lets say I have a wage of $50 an hour.  I make a pretty good program.  However, lets say you can hire an outsource programmer for $10 an hour who has average accuracy in their program.  You could hire 4 of them, saving yourself $10 an hour, and run those programs together.  Compare the output, use the majority of the answers that match, and money is saved.

Now, mind you, I am not a fan of outsourcing at all - but I just thought it would be an interesting idea.
