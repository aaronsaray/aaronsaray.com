---
title: Stop Considering the Same Password a New Password Attempt
date: 2019-04-01
tag:
- programming
- business
---
One of the most rewarding things I've done as a programmer was watch a real life in person focus group use my application.  At first, I didn't enjoy it. But like most lessons, looking back, it was extremely valuable.  

<!--more-->

We had set up a scenario where we changed the user's password without telling them. This was supposed to fail the login, potentially lock them out, and offer for a password reset functionality.

While watching the users try to login, I noticed a common thread.  Most users would type in the same password two or three times.  They then realized they forgot the password or they tried a different one.  On average, most users would get locked out before they could try a second password.

That's where I realized the flaw that most password lock out mechanisms have: they lock out without intelligence.

**Do not count the same password as another login attempt.** I don't know about you, but if I type in a password and it fails, I try to type the password again. I might actually have the wrong password, but I don't know that yet.  That's the same thing my testers did.  Instead, we started locking them out way early.

The point of a password lock out mechanism is to stop brute force or dictionary attempts.  Using the same incorrect password should never allow the user to login, therefore it should only be considered one instance of a wrong password.  If you want a three time lock out, use three unique passwords, not three entries.

I think it's just good user experience and care without lowering your security mechanism quality.
