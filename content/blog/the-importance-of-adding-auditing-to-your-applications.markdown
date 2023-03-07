---
title: The Importance of Adding Auditing to Your Applications
date: 2012-06-05
tag:
- programming
---
One of the things I learned while working at "The Triangle" was the "joy" of auditing.  From their point of view, auditing was extreme.  Think journaling and you have a pretty good idea.  Now, when we talk about auditing, make sure to understand this is referring to change tracking and not vulnerability or fault detection.

<!--more-->

So, auditing can be as extreme / verbose or as little as possible.  Let's talk about the most common types of auditing:

**Full/Complete auditing:**  This is really similar to things like journaling.  What happens is that on every change or action, a complete new record is added.  For example, if you edit a blog entry, a new revision of exactly the same record (but with applied changes) is created in the database.  This provides a very complete trail of what happened when.  

Sometimes that can be overkill...

**Action based auditing:** This is when a record is created that something happened, but it doesn't necessarily track the changes.  For example, you might track that user 23 edited blog entry 35.  It doesn't say exactly what was changed, but it did show which item was changed and who changed it.

Sometimes that's not enough...

**Make Auditing a Requirement:** Ok, so this is what it really comes down to.  As a programmer or an architect, sometimes you have to inject requirements into a project.  If your stakeholder doesn't talk about auditing, bring up the conversation.  Figure out how much logging is necessary.  I would even advise that if nothing is required, there is still the action based auditing.  This has saved me many, many times.

PS: Real life example:  So, I've been tracking logins for a while now.  A tech support specialist suggested that I make the audit more verbose by tracking which browser the user used.  That way, they can view the last login of the user, and already narrow down any browser based issues before they send an issue my direction.  I added this and I've saved both support and myself tons of time already.

Double PS: Let's get proactive: If you were tracking failed logins, you could use something like fail2ban to stop IPs that are continually generating failed logins.  Additionally, if you want to get proactive with your customers, you could see who has to request their password to be reset often.  It may make sense to give them a call and see if there is a way to help them proactively.  

