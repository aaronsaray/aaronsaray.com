---
title: What License to Use for Private Software
date: 2019-10-19
tag:
- business
- misc-web
- programming
---
When it comes to Open Source Software, you have a number of choices to make for licensing your software.  When you provide a license for your software, you, as the copyright holder, are giving various types of permissions and warranties for the use of this software. You might even define the way it can be used and if modifications have to be submitted back to you. But, what do you "license" software that is closed, paid or private software that you don't want anyone else to use?

<!--more-->

> You should know that I am not a lawyer and I do not offer legal advice.  I may not even know what I'm talking about.  Please use this blog as reference, but don't refer to it as unequivocally authoritative for your license choice.

I started thinking about this question because I'm getting ready to publish my first SaaS product.  I have the code in a private repository on Github (which has its own terms of service and thereby determines how your non-licensed work can be used as well as that you provide them a license to host it for you).  Because some of the software I'm using like NPM and Composer have configuration files that have a license field (and Github itself tries to publish meta information based on your license file), I thought it might be interesting to understand this more.

There are many resources about which license to choose. Many people end up referring to the [SPDX License List](https://spdx.org/licenses/) or [Creative Commons](https://creativecommons.org/) to research and choose your license for open source software.  But what about software that you wish to "license" as your own and non-distributable?

After much research, I've determined a few things:

**You are a copyright holder of your code, and thereby you retain the rights to all of your software.** You are the only one who is allowed to use, share, publish, compile, distribute or run it.  This is why you receive a license and terms of service document when you purchase other people's software; the copyright holder is transferring some of these rights to you.  

**When you don't license a piece of software specifically, you continue to be the copyright holder and no one else has any other rights.**

**When you choose a license for your software, you still retain the copyright, but you grant other people rights** that are specific use cases, sharing, etc, based on the content of the chosen license.

**If you don't want to license your software, the lack of license defines that it is not licensed.**  It is not an implicit or implication, but an explicit definition.  In this case, software usage is prohibited by default, and only allowed by an overriding, defined license.  That is to say, if you don't specify one, you are explicitly denying anyone any rights to this software.

So, the answer is pretty simple - if you have private, closed source software, do not add a license to it. 

If you do feel the need to specify something, I would suggest using the term `Unlicensed` or `No-License` (not to be confused with [the unlicense](https://spdx.org/licenses/Unlicense.html)).

### Summary

Do not license your closed source software.  If you must specify something, use the term `Unlicensed` or `No-License`.

#### References

Normally I link out to references inline, but this particular article would benefit from a references list.

[What does no license mean](https://choosealicense.com/no-permission/)  
[Open Source Casebook / Trademark Reference](https://google.github.io/opencasebook/trademarks/)  
[SPDX License List](https://spdx.org/licenses/)  
[Creative Commons License List](https://creativecommons.org/)  
[Some other non-lawyers talk licensing](https://softwareengineering.stackexchange.com/questions/68134/best-existing-license-for-closed-source-code)  
