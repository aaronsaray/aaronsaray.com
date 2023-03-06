---
title: The Chicken or the Egg of Hacking Your Software
date: 2016-07-26
tags:
- business
- security
---
Today I was faced with an interesting quandary about whether I should write the code to exploit an application vulnerability in our software at work. This vulnerability is not necessarily a "security" one, but more-so a known-risk: it was theorized that someone with enough knowledge could bypass a mechanism in our software.

<!--more-->

But this was all theory. I started thinking: is it really theory or can it be proven? Maybe I should write this software, once and for all, to demonstrate that it really is a problem.  

> We should all note that sometimes problems are ok in business - sometimes a risk is still fine. I just believe in having known risks, having their mechanisms defined.  I'd rather say "this could happen, and here's how" instead of "we think this could happen."

Maybe I should write this software?  But maybe I shouldn't?  [Tim Cook wrote](http://www.apple.com/customer-letter/) in his letter about the FBI case and the iPhone that sometimes building software that can bypass security is bad. This software doesn't exist now - so at least we are partially protected. Once it exists, it can't un-exist, and now the battle is keeping it in the right hands.

So maybe I shouldn't write this software? Maybe I should just keep this in my mind instead of putting it out in source code. After all, what if someone were able to acquire my code and use it to exploit our software en masse?

This really was a very interesting thing to contemplate - but in the end, I made the decision to write the exploit.  I believe we should all learn from things like this - and just because information isn't available now to us, doesn't mean it isn't available somewhere.  Maybe someone already wrote this - just we don't know about it? Or maybe they will? I think that at least now we will be prepared.